"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const add_js_1 = require("./add.js");
const bake_js_1 = require("./bake.js");
const decomp_js_1 = require("./decomp.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const scan_js_1 = require("./scan.js");
const subst_js_1 = require("./subst.js");
/*
Transform an expression using a pattern. The
pattern can come from the integrals table or
the user-defined patterns.

The expression and free variable are on the stack.

The argument s is a null terminated list of transform rules.

For example, see the itab (integrals table)

Internally, the following symbols are used:

  F  input expression

  X  free variable, i.e. F of X

  A  template expression

  B  result expression

  C  list of conditional expressions

Puts the final expression on top of stack
(whether it's transformed or not) and returns
true is successful, false if not.

*/
// p1 and p2 are tmps
//define F p3
//define X p4
//define A p5
//define B p6
//define C p7
function transform(F, X, s, generalTransform) {
    if (defs_js_1.DEBUG) {
        console.log(`         !!!!!!!!!   transform on: ${F}`);
    }
    const state = saveMetaBindings();
    (0, symbol_js_1.set_binding)((0, symbol_js_1.symbol)(defs_js_1.METAX), X);
    const arg = (0, bake_js_1.polyform)(F, X); // collect coefficients of x, x^2, etc.
    const result = (0, decomp_js_1.decomp)(generalTransform, arg, X);
    if (defs_js_1.DEBUG) {
        console.log(`  ${result.length} decomposed elements ====== `);
        for (let i = 0; i < result.length; i++) {
            console.log(`  decomposition element ${i}: ${result[i]}`);
        }
    }
    let transformationSuccessful = false;
    let B;
    if (generalTransform) {
        // "general tranform" mode is supposed to be more generic than
        // "integrals" mode.
        // In general transform mode we get only one transformation
        // in s
        // simple numbers can end up matching complicated templates,
        // which we don't want.
        // for example "1" ends up matching "inner(transpose(a_),a_)"
        // since "1" is decomposed to "1" and replacing "a_" with "1"
        // there is a match.
        // Although this match is OK at some fundamental level, we want to
        // avoid it because that's not what the spirit of this match
        // is: "1" does not have any structural resemblance with
        // "inner(transpose(a_),a_)". There are probably better ways
        // to so this, for example we might notice that "inner" is an
        // anchor since it "sits above" any meta variables, so we
        // might want to mandate it to be matched at the top
        // of the tree. For the time
        // being let's just skip matching on simple numbers.
        if (!(0, defs_js_1.isNumericAtom)(F)) {
            const theTransform = s;
            if (defs_js_1.DEBUG) {
                console.log(`applying transform: ${theTransform}`);
                console.log(`scanning table entry ${theTransform}`);
            }
            // replacements of meta variables. Note that we don't
            // use scan_meta because the pattern is not a string
            // that we have to parse, it's a tree already.
            // replace a_ with METAA in the passed transformation
            let expr = (0, subst_js_1.subst)(theTransform, (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_A_UNDERSCORE), (0, symbol_js_1.symbol)(defs_js_1.METAA));
            // replace b_ with METAB in the passed transformation
            expr = (0, subst_js_1.subst)(expr, (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_B_UNDERSCORE), (0, symbol_js_1.symbol)(defs_js_1.METAB));
            // replace x_ with METAX in the passed transformation
            const p1 = (0, subst_js_1.subst)(expr, (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_X_UNDERSCORE), (0, symbol_js_1.symbol)(defs_js_1.METAX));
            const A = (0, defs_js_1.car)(p1);
            if (defs_js_1.DEBUG) {
                console.log(`template expression: ${A}`);
            }
            B = (0, defs_js_1.cadr)(p1);
            const C = (0, defs_js_1.cddr)(p1);
            if (f_equals_a([defs_js_1.Constants.one, ...result], generalTransform, F, A, C)) {
                // successful transformation, transformed result is in p6
                transformationSuccessful = true;
            }
            else {
                // the match failed but perhaps we can match something lower down in
                // the tree, so let's recurse the tree
                if (defs_js_1.DEBUG) {
                    console.log(`p3 at this point: ${F}`);
                    console.log(`car(p3): ${(0, defs_js_1.car)(F)}`);
                }
                const transformedTerms = [];
                let restTerm = F;
                if ((0, defs_js_1.iscons)(restTerm)) {
                    transformedTerms.push((0, defs_js_1.car)(F));
                    restTerm = (0, defs_js_1.cdr)(F);
                }
                while ((0, defs_js_1.iscons)(restTerm)) {
                    const secondTerm = (0, defs_js_1.car)(restTerm);
                    restTerm = (0, defs_js_1.cdr)(restTerm);
                    if (defs_js_1.DEBUG) {
                        console.log(`testing: ${secondTerm}`);
                        console.log(`about to try to simplify other term: ${secondTerm}`);
                    }
                    const [t, success] = transform(secondTerm, (0, symbol_js_1.symbol)(defs_js_1.NIL), s, generalTransform);
                    transformationSuccessful = transformationSuccessful || success;
                    transformedTerms.push(t);
                    if (defs_js_1.DEBUG) {
                        console.log(`tried to simplify other term: ${secondTerm} ...successful?: ${success} ...transformed: ${transformedTerms[transformedTerms.length - 1]}`);
                    }
                }
                // recreate the tree we were passed,
                // but with all the terms being transformed
                if (transformedTerms.length !== 0) {
                    B = (0, list_js_1.makeList)(...transformedTerms);
                }
            }
        }
    }
    else {
        // "integrals" mode
        for (let eachTransformEntry of Array.from(s)) {
            if (defs_js_1.DEBUG) {
                console.log(`scanning table entry ${eachTransformEntry}`);
                if ((eachTransformEntry + '').indexOf('f(sqrt(a+b*x),2/3*1/b*sqrt((a+b*x)^3))') !== -1) {
                    defs_js_1.breakpoint;
                }
            }
            if (eachTransformEntry) {
                const temp = (0, scan_js_1.scan_meta)(eachTransformEntry);
                const p5 = (0, defs_js_1.cadr)(temp);
                B = (0, defs_js_1.caddr)(temp);
                const p7 = (0, defs_js_1.cdddr)(temp);
                if (f_equals_a([defs_js_1.Constants.one, ...result], generalTransform, F, p5, p7)) {
                    // there is a successful transformation, transformed result is in p6
                    transformationSuccessful = true;
                    break;
                }
            }
        }
    }
    const temp = transformationSuccessful
        ? (0, eval_js_1.Eval)(B)
        : generalTransform
            ? F
            : (0, symbol_js_1.symbol)(defs_js_1.NIL);
    restoreMetaBindings(state);
    return [temp, transformationSuccessful];
}
exports.transform = transform;
function saveMetaBindings() {
    return {
        METAA: (0, symbol_js_1.get_binding)((0, symbol_js_1.symbol)(defs_js_1.METAA)),
        METAB: (0, symbol_js_1.get_binding)((0, symbol_js_1.symbol)(defs_js_1.METAB)),
        METAX: (0, symbol_js_1.get_binding)((0, symbol_js_1.symbol)(defs_js_1.METAX)),
    };
}
function restoreMetaBindings(state) {
    (0, symbol_js_1.set_binding)((0, symbol_js_1.symbol)(defs_js_1.METAX), state.METAX);
    (0, symbol_js_1.set_binding)((0, symbol_js_1.symbol)(defs_js_1.METAB), state.METAB);
    (0, symbol_js_1.set_binding)((0, symbol_js_1.symbol)(defs_js_1.METAA), state.METAA);
}
// search for a METAA and METAB such that F = A
function f_equals_a(stack, generalTransform, F, A, C) {
    for (const fea_i of stack) {
        (0, symbol_js_1.set_binding)((0, symbol_js_1.symbol)(defs_js_1.METAA), fea_i);
        if (defs_js_1.DEBUG) {
            console.log(`  binding METAA to ${(0, symbol_js_1.get_binding)((0, symbol_js_1.symbol)(defs_js_1.METAA))}`);
        }
        for (const fea_j of stack) {
            (0, symbol_js_1.set_binding)((0, symbol_js_1.symbol)(defs_js_1.METAB), fea_j);
            if (defs_js_1.DEBUG) {
                console.log(`  binding METAB to ${(0, symbol_js_1.get_binding)((0, symbol_js_1.symbol)(defs_js_1.METAB))}`);
            }
            // now test all the conditions (it's an and between them)
            let temp = C;
            while ((0, defs_js_1.iscons)(temp)) {
                const p2 = (0, eval_js_1.Eval)((0, defs_js_1.car)(temp));
                if ((0, is_js_1.isZeroAtomOrTensor)(p2)) {
                    break;
                }
                temp = (0, defs_js_1.cdr)(temp);
            }
            if ((0, defs_js_1.iscons)(temp)) {
                // conditions are not met, skip to the next binding of metas
                continue;
            }
            const arg2 = generalTransform ? (0, defs_js_1.noexpand)(eval_js_1.Eval, A) : (0, eval_js_1.Eval)(A);
            if (defs_js_1.DEBUG) {
                console.log(`about to evaluate template expression: ${A} binding METAA to ${(0, symbol_js_1.get_binding)((0, symbol_js_1.symbol)(defs_js_1.METAA))} and binding METAB to ${(0, symbol_js_1.get_binding)((0, symbol_js_1.symbol)(defs_js_1.METAB))} and binding METAX to ${(0, symbol_js_1.get_binding)((0, symbol_js_1.symbol)(defs_js_1.METAX))}`);
                console.log(`  comparing ${arg2} to: ${F}`);
            }
            if ((0, is_js_1.isZeroAtomOrTensor)((0, add_js_1.subtract)(F, arg2))) {
                if (defs_js_1.DEBUG) {
                    console.log(`binding METAA to ${(0, symbol_js_1.get_binding)((0, symbol_js_1.symbol)(defs_js_1.METAA))}`);
                    console.log(`binding METAB to ${(0, symbol_js_1.get_binding)((0, symbol_js_1.symbol)(defs_js_1.METAB))}`);
                    console.log(`binding METAX to ${(0, symbol_js_1.get_binding)((0, symbol_js_1.symbol)(defs_js_1.METAX))}`);
                    console.log(`comparing ${F} to: ${A}`);
                }
                return true; // yes
            }
        }
    }
    return false; // no
}
