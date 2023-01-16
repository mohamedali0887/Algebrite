"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simplify_trig = exports.simplify = exports.simplifyForCodeGeneration = exports.Eval_simplify = void 0;
const alloc_js_1 = require("../runtime/alloc.js");
const count_js_1 = require("../runtime/count.js");
const defs_js_1 = require("../runtime/defs.js");
const find_js_1 = require("../runtime/find.js");
const run_js_1 = require("../runtime/run.js");
const symbol_js_1 = require("../runtime/symbol.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const clock_js_1 = require("./clock.js");
const condense_js_1 = require("./condense.js");
const eval_js_1 = require("./eval.js");
const float_js_1 = require("./float.js");
const inner_js_1 = require("./inner.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const misc_js_1 = require("./misc.js");
const multiply_js_1 = require("./multiply.js");
const polar_js_1 = require("./polar.js");
const power_js_1 = require("./power.js");
const rationalize_js_1 = require("./rationalize.js");
const real_js_1 = require("./real.js");
const rect_js_1 = require("./rect.js");
const roots_js_1 = require("./roots.js");
const simfac_js_1 = require("./simfac.js");
const tensor_js_1 = require("./tensor.js");
const transform_js_1 = require("./transform.js");
const transpose_js_1 = require("./transpose.js");
const denominator_js_1 = require("./denominator.js");
const gcd_js_1 = require("./gcd.js");
const factor_js_1 = require("./factor.js");
const numerator_js_1 = require("./numerator.js");
function Eval_simplify(p1) {
    const arg = runUserDefinedSimplifications((0, defs_js_1.cadr)(p1));
    return simplify((0, eval_js_1.Eval)(arg));
}
exports.Eval_simplify = Eval_simplify;
function runUserDefinedSimplifications(p) {
    // -----------------------
    // unfortunately for the time being user
    // specified simplifications are only
    // run in things which don't contain
    // integrals.
    // Doesn't work yet, could be because of
    // some clobbering as "transform" is called
    // recursively?
    if (defs_js_1.defs.userSimplificationsInListForm.length === 0 ||
        (0, find_js_1.Find)(p, (0, symbol_js_1.symbol)(defs_js_1.INTEGRAL))) {
        return p;
    }
    if (defs_js_1.DEBUG) {
        console.log(`runUserDefinedSimplifications passed: ${p}`);
    }
    let F1 = (0, defs_js_1.noexpand)(eval_js_1.Eval, p);
    if (defs_js_1.DEBUG) {
        console.log(`runUserDefinedSimplifications after eval no expanding: ${F1}`);
        console.log('patterns to be checked: ');
        for (const simplification of Array.from(defs_js_1.defs.userSimplificationsInListForm)) {
            console.log(`...${simplification}`);
        }
    }
    let atLeastOneSuccessInRouldOfRulesApplications = true;
    let numberOfRulesApplications = 0;
    while (atLeastOneSuccessInRouldOfRulesApplications &&
        numberOfRulesApplications < defs_js_1.MAX_CONSECUTIVE_APPLICATIONS_OF_ALL_RULES) {
        atLeastOneSuccessInRouldOfRulesApplications = false;
        numberOfRulesApplications++;
        for (const eachSimplification of Array.from(defs_js_1.defs.userSimplificationsInListForm)) {
            let success = true;
            let eachConsecutiveRuleApplication = 0;
            while (success &&
                eachConsecutiveRuleApplication <
                    defs_js_1.MAX_CONSECUTIVE_APPLICATIONS_OF_SINGLE_RULE) {
                eachConsecutiveRuleApplication++;
                if (defs_js_1.DEBUG) {
                    console.log(`simplify - checking pattern: ${eachSimplification} on: ${F1}`);
                }
                [F1, success] = (0, transform_js_1.transform)(F1, (0, symbol_js_1.symbol)(defs_js_1.NIL), eachSimplification, true);
                if (success) {
                    atLeastOneSuccessInRouldOfRulesApplications = true;
                }
                if (defs_js_1.DEBUG) {
                    console.log(`p1 at this stage of simplification: ${F1}`);
                }
            }
            if (eachConsecutiveRuleApplication ===
                defs_js_1.MAX_CONSECUTIVE_APPLICATIONS_OF_SINGLE_RULE) {
                (0, run_js_1.stop)(`maximum application of single transformation rule exceeded: ${eachSimplification}`);
            }
        }
    }
    if (numberOfRulesApplications === defs_js_1.MAX_CONSECUTIVE_APPLICATIONS_OF_ALL_RULES) {
        (0, run_js_1.stop)('maximum application of all transformation rules exceeded ');
    }
    if (defs_js_1.DEBUG) {
        console.log(`METAX = ${(0, symbol_js_1.get_binding)((0, symbol_js_1.symbol)(defs_js_1.METAX))}`);
        console.log(`METAA = ${(0, symbol_js_1.get_binding)((0, symbol_js_1.symbol)(defs_js_1.METAA))}`);
        console.log(`METAB = ${(0, symbol_js_1.get_binding)((0, symbol_js_1.symbol)(defs_js_1.METAB))}`);
    }
    return F1;
}
// ------------------------
function simplifyForCodeGeneration(p) {
    const arg = runUserDefinedSimplifications(p);
    defs_js_1.defs.codeGen = true;
    // in "codeGen" mode we completely
    // eval and simplify the function bodies
    // because we really want to resolve all
    // the variables indirections and apply
    // all the simplifications we can.
    const result = simplify(arg);
    defs_js_1.defs.codeGen = false;
    return result;
}
exports.simplifyForCodeGeneration = simplifyForCodeGeneration;
function simplify(p1) {
    // when we do code generation, we proceed to
    // fully evaluate and simplify the body of
    // a function, so we resolve all variables
    // indirections and we simplify everything
    // we can given the current assignments.
    if (defs_js_1.defs.codeGen && (0, defs_js_1.car)(p1) === (0, symbol_js_1.symbol)(defs_js_1.FUNCTION)) {
        const fbody = (0, defs_js_1.cadr)(p1);
        // let's simplify the body so we give it a
        // compact form
        const p3 = simplify((0, eval_js_1.Eval)(fbody));
        // replace the evaled body
        const args = (0, defs_js_1.caddr)(p1); // p5 is B
        p1 = (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.FUNCTION), p3, args);
    }
    if ((0, defs_js_1.istensor)(p1)) {
        return simplify_tensor(p1);
    }
    if ((0, find_js_1.Find)(p1, (0, symbol_js_1.symbol)(defs_js_1.FACTORIAL))) {
        const p2 = (0, simfac_js_1.simfac)(p1);
        const p3 = (0, simfac_js_1.simfac)((0, rationalize_js_1.rationalize)(p1));
        p1 = (0, count_js_1.count)(p2) < (0, count_js_1.count)(p3) ? p2 : p3;
    }
    p1 = f10(p1);
    p1 = f1(p1);
    p1 = f2(p1);
    p1 = f3(p1);
    p1 = f4(p1);
    p1 = f5(p1);
    p1 = f9(p1);
    p1 = simplify_polarRect(p1);
    if (defs_js_1.do_simplify_nested_radicals) {
        let simplify_nested_radicalsResult;
        [simplify_nested_radicalsResult, p1] = simplify_nested_radicals(p1);
        // if there is some de-nesting then
        // re-run a simplification because
        // the shape of the expression might
        // have changed significantly.
        // e.g. simplify(14^(1/2) - (16 - 4*7^(1/2))^(1/2))
        // needs some more semplification after the de-nesting.
        if (simplify_nested_radicalsResult) {
            if (defs_js_1.DEBUG) {
                console.log('de-nesting successful into: ' + p1.toString());
            }
            return simplify(p1);
        }
    }
    p1 = simplify_rectToClock(p1);
    p1 = simplify_rational_expressions(p1);
    return p1;
}
exports.simplify = simplify;
function simplify_tensor(p1) {
    let p2 = (0, alloc_js_1.alloc_tensor)(p1.tensor.nelem);
    p2.tensor.ndim = p1.tensor.ndim;
    p2.tensor.dim = Array.from(p1.tensor.dim);
    p2.tensor.elem = p1.tensor.elem.map(simplify);
    (0, tensor_js_1.check_tensor_dimensions)(p2);
    if ((0, is_js_1.isZeroAtomOrTensor)(p2)) {
        p2 = defs_js_1.Constants.zero; // null tensor becomes scalar zero
    }
    return p2;
}
// try rationalizing
function f1(p1) {
    if (!(0, defs_js_1.isadd)(p1)) {
        return p1;
    }
    const p2 = (0, rationalize_js_1.rationalize)(p1);
    if ((0, count_js_1.count)(p2) < (0, count_js_1.count)(p1)) {
        p1 = p2;
    }
    return p1;
}
// try condensing
function f2(p1) {
    if (!(0, defs_js_1.isadd)(p1)) {
        return p1;
    }
    const p2 = (0, condense_js_1.Condense)(p1);
    if ((0, count_js_1.count)(p2) <= (0, count_js_1.count)(p1)) {
        p1 = p2;
    }
    return p1;
}
// this simplifies forms like (A-B) / (B-A)
function f3(p1) {
    const p2 = (0, rationalize_js_1.rationalize)((0, multiply_js_1.negate)((0, rationalize_js_1.rationalize)((0, multiply_js_1.negate)((0, rationalize_js_1.rationalize)(p1)))));
    if ((0, count_js_1.count)(p2) < (0, count_js_1.count)(p1)) {
        p1 = p2;
    }
    return p1;
}
function f10(p1) {
    const carp1 = (0, defs_js_1.car)(p1);
    if (carp1 === (0, symbol_js_1.symbol)(defs_js_1.MULTIPLY) || (0, defs_js_1.isinnerordot)(p1)) {
        // both operands a transpose?
        if ((0, defs_js_1.car)((0, defs_js_1.car)((0, defs_js_1.cdr)(p1))) === (0, symbol_js_1.symbol)(defs_js_1.TRANSPOSE) &&
            (0, defs_js_1.car)((0, defs_js_1.car)((0, defs_js_1.cdr)((0, defs_js_1.cdr)(p1)))) === (0, symbol_js_1.symbol)(defs_js_1.TRANSPOSE)) {
            if (defs_js_1.DEBUG) {
                console.log(`maybe collecting a transpose ${p1}`);
            }
            const a = (0, defs_js_1.cadr)((0, defs_js_1.car)((0, defs_js_1.cdr)(p1)));
            const b = (0, defs_js_1.cadr)((0, defs_js_1.car)((0, defs_js_1.cdr)((0, defs_js_1.cdr)(p1))));
            let arg1;
            if (carp1 === (0, symbol_js_1.symbol)(defs_js_1.MULTIPLY)) {
                arg1 = (0, multiply_js_1.multiply)(a, b);
            }
            else if ((0, defs_js_1.isinnerordot)(p1)) {
                arg1 = (0, inner_js_1.inner)(b, a);
            }
            else {
                arg1 = (0, run_js_1.stop)('f10: nothing to pop.');
            }
            // const p2 = noexpand(transpose, arg1, Constants.one, integer(2));
            const p2 = (0, defs_js_1.noexpand)(() => {
                return (0, transpose_js_1.transpose)(arg1, defs_js_1.Constants.one, (0, bignum_js_1.integer)(2));
            });
            if ((0, count_js_1.count)(p2) < (0, count_js_1.count)(p1)) {
                p1 = p2;
            }
            if (defs_js_1.DEBUG) {
                console.log(`collecting a transpose ${p2}`);
            }
        }
    }
    return p1;
}
// try expanding denominators
function f4(p1) {
    if ((0, is_js_1.isZeroAtomOrTensor)(p1)) {
        return p1;
    }
    const p2 = (0, rationalize_js_1.rationalize)((0, multiply_js_1.inverse)((0, rationalize_js_1.rationalize)((0, multiply_js_1.inverse)((0, rationalize_js_1.rationalize)(p1)))));
    if ((0, count_js_1.count)(p2) < (0, count_js_1.count)(p1)) {
        p1 = p2;
    }
    return p1;
}
// simplifies trig forms
function simplify_trig(p1) {
    return f5(p1);
}
exports.simplify_trig = simplify_trig;
function f5(p1) {
    if (!(0, find_js_1.Find)(p1, (0, symbol_js_1.symbol)(defs_js_1.SIN)) && !(0, find_js_1.Find)(p1, (0, symbol_js_1.symbol)(defs_js_1.COS))) {
        return p1;
    }
    const p2 = p1;
    defs_js_1.defs.trigmode = 1;
    let p3 = (0, eval_js_1.Eval)(p2);
    defs_js_1.defs.trigmode = 2;
    let p4 = (0, eval_js_1.Eval)(p2);
    defs_js_1.defs.trigmode = 0;
    if ((0, count_js_1.count)(p4) < (0, count_js_1.count)(p3) || nterms(p4) < nterms(p3)) {
        p3 = p4;
    }
    if ((0, count_js_1.count)(p3) < (0, count_js_1.count)(p1) || nterms(p3) < nterms(p1)) {
        p1 = p3;
    }
    return p1;
}
// if it's a sum then try to simplify each term
function f9(p1) {
    if (!(0, defs_js_1.isadd)(p1)) {
        return p1;
    }
    let p2 = (0, defs_js_1.cdr)(p1);
    if ((0, defs_js_1.iscons)(p2)) {
        p2 = [...p2].reduce((acc, p) => simplify_rational_expressions((0, add_js_1.add)(acc, simplify(p))), defs_js_1.Constants.zero);
    }
    if ((0, count_js_1.count)(p2) < (0, count_js_1.count)(p1)) {
        p1 = p2;
    }
    return p1;
}
function simplify_rational_expressions(p1) {
    var denom, num, p2, polyVar, theGCD;
    denom = (0, denominator_js_1.denominator)(p1);
    if ((0, is_js_1.isone)(denom)) {
        return p1;
    }
    num = (0, numerator_js_1.numerator)(p1);
    if ((0, is_js_1.isone)(num)) {
        return p1;
    }
    if (!(polyVar = (0, gcd_js_1.areunivarpolysfactoredorexpandedform)(num, denom))) {
        return p1;
    }
    theGCD = (0, factor_js_1.factor)((0, gcd_js_1.gcd)(num, denom), polyVar);
    if ((0, is_js_1.isone)(theGCD)) {
        return p1;
    }
    let factoredNum = (0, factor_js_1.factor)(num, polyVar);
    let theGCDInverse = (0, multiply_js_1.inverse)(theGCD);
    let multipliedNoeExpandNum = (0, multiply_js_1.multiply_noexpand)(factoredNum, theGCDInverse);
    let simplifiedNum = simplify(multipliedNoeExpandNum);
    let factoredDenom = (0, factor_js_1.factor)(denom, polyVar);
    let multipliedNoeExpandDenom = (0, multiply_js_1.multiply_noexpand)(factoredDenom, theGCDInverse);
    let simplifiedDenom = simplify(multipliedNoeExpandDenom);
    let numDividedDenom = (0, multiply_js_1.divide)(simplifiedNum, simplifiedDenom);
    p2 = (0, condense_js_1.Condense)(numDividedDenom);
    if ((0, count_js_1.count)(p2) < (0, count_js_1.count)(p1)) {
        return p2;
    }
    else {
        return p1;
    }
}
;
// things like 6*(cos(2/9*pi)+i*sin(2/9*pi))
// where we have sin and cos, those might start to
// look better in clock form i.e.  6*(-1)^(2/9)
function simplify_rectToClock(p1) {
    let p2;
    //breakpoint
    if (!(0, find_js_1.Find)(p1, (0, symbol_js_1.symbol)(defs_js_1.SIN)) && !(0, find_js_1.Find)(p1, (0, symbol_js_1.symbol)(defs_js_1.COS))) {
        return p1;
    }
    p2 = (0, clock_js_1.clockform)((0, eval_js_1.Eval)(p1)); // put new (hopefully simplified expr) in p2
    if (defs_js_1.DEBUG) {
        console.log(`before simplification clockform: ${p1} after: ${p2}`);
    }
    if ((0, count_js_1.count)(p2) < (0, count_js_1.count)(p1)) {
        p1 = p2;
    }
    return p1;
}
function simplify_polarRect(p1) {
    const tmp = polarRectAMinusOneBase(p1);
    const p2 = (0, eval_js_1.Eval)(tmp); // put new (hopefully simplified expr) in p2
    if ((0, count_js_1.count)(p2) < (0, count_js_1.count)(p1)) {
        p1 = p2;
    }
    return p1;
}
function polarRectAMinusOneBase(p1) {
    if ((0, is_js_1.isimaginaryunit)(p1)) {
        return p1;
    }
    if ((0, misc_js_1.equal)((0, defs_js_1.car)(p1), (0, symbol_js_1.symbol)(defs_js_1.POWER)) && (0, is_js_1.isminusone)((0, defs_js_1.cadr)(p1))) {
        // base we just said is minus 1
        const base = (0, multiply_js_1.negate)(defs_js_1.Constants.one);
        // exponent
        const exponent = polarRectAMinusOneBase((0, defs_js_1.caddr)(p1));
        // try to simplify it using polar and rect
        return (0, rect_js_1.rect)((0, polar_js_1.polar)((0, power_js_1.power)(base, exponent)));
    }
    else if ((0, defs_js_1.iscons)(p1)) {
        return p1.map(polarRectAMinusOneBase);
    }
    else {
        return p1;
    }
}
function nterms(p) {
    if (!(0, defs_js_1.isadd)(p)) {
        return 1;
    }
    else {
        return (0, misc_js_1.length)(p) - 1;
    }
}
function simplify_nested_radicals(p1) {
    if (defs_js_1.defs.recursionLevelNestedRadicalsRemoval > 0) {
        if (defs_js_1.DEBUG) {
            console.log('denesting bailing out because of too much recursion');
        }
        return [false, p1];
    }
    const [simplificationWithoutCondense, somethingSimplified,] = take_care_of_nested_radicals(p1);
    // in this paragraph we check whether we can collect
    // common factors without complicating the expression
    // in particular we want to avoid
    // collecting radicals like in this case where
    // we collect sqrt(2):
    //   2-2^(1/2) into 2^(1/2)*(-1+2^(1/2))
    // but we do like to collect other non-radicals e.g.
    //   17/2+3/2*5^(1/2) into 1/2*(17+3*5^(1/2))
    // so what we do is we count the powers and we check
    // which version has the least number of them.
    const simplificationWithCondense = (0, defs_js_1.noexpand)(condense_js_1.yycondense, simplificationWithoutCondense);
    //console.log("occurrences of powers in " + simplificationWithoutCondense + " :" + countOccurrencesOfSymbol(symbol(POWER),simplificationWithoutCondense))
    //console.log("occurrences of powers in " + simplificationWithCondense + " :" + countOccurrencesOfSymbol(symbol(POWER),simplificationWithCondense))
    p1 =
        (0, count_js_1.countOccurrencesOfSymbol)((0, symbol_js_1.symbol)(defs_js_1.POWER), simplificationWithoutCondense) <
            (0, count_js_1.countOccurrencesOfSymbol)((0, symbol_js_1.symbol)(defs_js_1.POWER), simplificationWithCondense)
            ? simplificationWithoutCondense
            : simplificationWithCondense;
    // we got out result, wrap up
    return [somethingSimplified, p1];
}
function take_care_of_nested_radicals(p1) {
    if (defs_js_1.defs.recursionLevelNestedRadicalsRemoval > 0) {
        if (defs_js_1.DEBUG) {
            console.log('denesting bailing out because of too much recursion');
        }
        return [p1, false];
    }
    if ((0, misc_js_1.equal)((0, defs_js_1.car)(p1), (0, symbol_js_1.symbol)(defs_js_1.POWER))) {
        return _nestedPowerSymbol(p1);
    }
    if ((0, defs_js_1.iscons)(p1)) {
        return _nestedCons(p1);
    }
    return [p1, false];
}
function _nestedPowerSymbol(p1) {
    //console.log("ok it's a power ")
    const base = (0, defs_js_1.cadr)(p1);
    const exponent = (0, defs_js_1.caddr)(p1);
    //console.log("possible double radical base: " + base)
    //console.log("possible double radical exponent: " + exponent)
    if ((0, is_js_1.isminusone)(exponent) ||
        !(0, misc_js_1.equal)((0, defs_js_1.car)(base), (0, symbol_js_1.symbol)(defs_js_1.ADD)) ||
        !(0, is_js_1.isfraction)(exponent) ||
        (!(0, is_js_1.equalq)(exponent, 1, 3) && !(0, is_js_1.equalq)(exponent, 1, 2))) {
        return [p1, false];
    }
    //console.log("ok there is a radix with a term inside")
    const firstTerm = (0, defs_js_1.cadr)(base);
    take_care_of_nested_radicals(firstTerm);
    const secondTerm = (0, defs_js_1.caddr)(base);
    take_care_of_nested_radicals(secondTerm);
    let numberOfTerms = 0;
    let countingTerms = base;
    while ((0, defs_js_1.cdr)(countingTerms) !== (0, symbol_js_1.symbol)(defs_js_1.NIL)) {
        numberOfTerms++;
        countingTerms = (0, defs_js_1.cdr)(countingTerms);
    }
    if (numberOfTerms > 2) {
        return [p1, false];
    }
    // list here all the factors
    const { commonBases, termsThatAreNotPowers } = _listAll(secondTerm);
    if (commonBases.length === 0) {
        return [p1, false];
    }
    const A = firstTerm;
    const C = commonBases.reduce(multiply_js_1.multiply, defs_js_1.Constants.one);
    const B = termsThatAreNotPowers.reduce(multiply_js_1.multiply, defs_js_1.Constants.one);
    let temp;
    if ((0, is_js_1.equalq)(exponent, 1, 3)) {
        const checkSize1 = (0, multiply_js_1.divide)((0, multiply_js_1.multiply)((0, multiply_js_1.negate)(A), C), B); // 4th coeff
        const result1 = (0, bignum_js_1.nativeDouble)((0, float_js_1.yyfloat)((0, real_js_1.real)(checkSize1)));
        if (Math.abs(result1) > Math.pow(2, 32)) {
            return [p1, false];
        }
        const checkSize2 = (0, multiply_js_1.multiply)((0, bignum_js_1.integer)(3), C); // 3rd coeff
        const result2 = (0, bignum_js_1.nativeDouble)((0, float_js_1.yyfloat)((0, real_js_1.real)(checkSize2)));
        if (Math.abs(result2) > Math.pow(2, 32)) {
            return [p1, false];
        }
        const arg1b = (0, multiply_js_1.multiply)(checkSize2, (0, symbol_js_1.symbol)(defs_js_1.SECRETX));
        const checkSize3 = (0, multiply_js_1.divide)((0, multiply_js_1.multiply)((0, bignum_js_1.integer)(-3), A), B); // 2nd coeff
        const result3 = (0, bignum_js_1.nativeDouble)((0, float_js_1.yyfloat)((0, real_js_1.real)(checkSize3)));
        if (Math.abs(result3) > Math.pow(2, 32)) {
            return [p1, false];
        }
        const result = (0, add_js_1.add_all)([
            checkSize1,
            arg1b,
            (0, multiply_js_1.multiply)(checkSize3, (0, power_js_1.power)((0, symbol_js_1.symbol)(defs_js_1.SECRETX), (0, bignum_js_1.integer)(2))),
            (0, multiply_js_1.multiply)(defs_js_1.Constants.one, (0, power_js_1.power)((0, symbol_js_1.symbol)(defs_js_1.SECRETX), (0, bignum_js_1.integer)(3))),
        ]);
        temp = result;
    }
    else if ((0, is_js_1.equalq)(exponent, 1, 2)) {
        const result1 = (0, bignum_js_1.nativeDouble)((0, float_js_1.yyfloat)((0, real_js_1.real)(C)));
        if (Math.abs(result1) > Math.pow(2, 32)) {
            return [p1, false];
        }
        const checkSize = (0, multiply_js_1.divide)((0, multiply_js_1.multiply)((0, bignum_js_1.integer)(-2), A), B);
        const result2 = (0, bignum_js_1.nativeDouble)((0, float_js_1.yyfloat)((0, real_js_1.real)(checkSize)));
        if (Math.abs(result2) > Math.pow(2, 32)) {
            return [p1, false];
        }
        temp = (0, add_js_1.add)(C, (0, add_js_1.add)((0, multiply_js_1.multiply)(checkSize, (0, symbol_js_1.symbol)(defs_js_1.SECRETX)), (0, multiply_js_1.multiply)(defs_js_1.Constants.one, (0, power_js_1.power)((0, symbol_js_1.symbol)(defs_js_1.SECRETX), (0, bignum_js_1.integer)(2)))));
    }
    defs_js_1.defs.recursionLevelNestedRadicalsRemoval++;
    const r = (0, roots_js_1.roots)(temp, (0, symbol_js_1.symbol)(defs_js_1.SECRETX));
    defs_js_1.defs.recursionLevelNestedRadicalsRemoval--;
    if ((0, misc_js_1.equal)(r, (0, symbol_js_1.symbol)(defs_js_1.NIL))) {
        if (defs_js_1.DEBUG) {
            console.log('roots bailed out because of too much recursion');
        }
        return [p1, false];
    }
    // exclude the solutions with radicals
    const possibleSolutions = r.elem.filter((sol) => !(0, find_js_1.Find)(sol, (0, symbol_js_1.symbol)(defs_js_1.POWER)));
    if (possibleSolutions.length === 0) {
        return [p1, false];
    }
    const possibleRationalSolutions = [];
    const realOfpossibleRationalSolutions = [];
    //console.log("checking the one with maximum real part ")
    for (const i of Array.from(possibleSolutions)) {
        const result = (0, bignum_js_1.nativeDouble)((0, float_js_1.yyfloat)((0, real_js_1.real)(i)));
        possibleRationalSolutions.push(i);
        realOfpossibleRationalSolutions.push(result);
    }
    const whichRationalSolution = realOfpossibleRationalSolutions.indexOf(Math.max.apply(Math, realOfpossibleRationalSolutions));
    const SOLUTION = possibleRationalSolutions[whichRationalSolution];
    if (!(0, is_js_1.equalq)(exponent, 1, 3) && !(0, is_js_1.equalq)(exponent, 1, 2)) {
        return [p1, false];
    }
    if ((0, is_js_1.equalq)(exponent, 1, 3)) {
        const lowercase_b = (0, power_js_1.power)((0, multiply_js_1.divide)(A, (0, add_js_1.add)((0, power_js_1.power)(SOLUTION, (0, bignum_js_1.integer)(3)), (0, multiply_js_1.multiply)((0, multiply_js_1.multiply)((0, bignum_js_1.integer)(3), C), SOLUTION))), (0, bignum_js_1.rational)(1, 3));
        const lowercase_a = (0, multiply_js_1.multiply)(lowercase_b, SOLUTION);
        const result = simplify((0, add_js_1.add)((0, multiply_js_1.multiply)(lowercase_b, (0, power_js_1.power)(C, (0, bignum_js_1.rational)(1, 2))), lowercase_a));
        return [result, true];
    }
    if ((0, is_js_1.equalq)(exponent, 1, 2)) {
        const lowercase_b = (0, power_js_1.power)((0, multiply_js_1.divide)(A, (0, add_js_1.add)((0, power_js_1.power)(SOLUTION, (0, bignum_js_1.integer)(2)), C)), (0, bignum_js_1.rational)(1, 2));
        const lowercase_a = (0, multiply_js_1.multiply)(lowercase_b, SOLUTION);
        const possibleNewExpression = simplify((0, add_js_1.add)((0, multiply_js_1.multiply)(lowercase_b, (0, power_js_1.power)(C, (0, bignum_js_1.rational)(1, 2))), lowercase_a));
        const possibleNewExpressionValue = (0, float_js_1.yyfloat)((0, real_js_1.real)(possibleNewExpression));
        if (!(0, is_js_1.isnegativenumber)(possibleNewExpressionValue)) {
            return [possibleNewExpression, true];
        }
        const result = simplify((0, add_js_1.add)((0, multiply_js_1.multiply)((0, multiply_js_1.negate)(lowercase_b), (0, power_js_1.power)(C, (0, bignum_js_1.rational)(1, 2))), (0, multiply_js_1.negate)(lowercase_a)));
        return [result, true];
    }
    return [null, true];
}
function _listAll(secondTerm) {
    let commonInnerExponent = null;
    const commonBases = [];
    const termsThatAreNotPowers = [];
    if ((0, defs_js_1.ismultiply)(secondTerm)) {
        // product of factors
        let secondTermFactor = (0, defs_js_1.cdr)(secondTerm);
        if ((0, defs_js_1.iscons)(secondTermFactor)) {
            while ((0, defs_js_1.iscons)(secondTermFactor)) {
                const potentialPower = (0, defs_js_1.car)(secondTermFactor);
                if ((0, defs_js_1.ispower)(potentialPower)) {
                    const innerbase = (0, defs_js_1.cadr)(potentialPower);
                    const innerexponent = (0, defs_js_1.caddr)(potentialPower);
                    if ((0, is_js_1.equalq)(innerexponent, 1, 2)) {
                        if (commonInnerExponent == null) {
                            commonInnerExponent = innerexponent;
                            commonBases.push(innerbase);
                        }
                        else if ((0, misc_js_1.equal)(innerexponent, commonInnerExponent)) {
                            commonBases.push(innerbase);
                        }
                    }
                }
                else {
                    termsThatAreNotPowers.push(potentialPower);
                }
                secondTermFactor = (0, defs_js_1.cdr)(secondTermFactor);
            }
        }
    }
    else if ((0, defs_js_1.ispower)(secondTerm)) {
        const innerbase = (0, defs_js_1.cadr)(secondTerm);
        const innerexponent = (0, defs_js_1.caddr)(secondTerm);
        if (commonInnerExponent == null && (0, is_js_1.equalq)(innerexponent, 1, 2)) {
            commonInnerExponent = innerexponent;
            commonBases.push(innerbase);
        }
    }
    return { commonBases, termsThatAreNotPowers };
}
function _nestedCons(p1) {
    let anyRadicalSimplificationWorked = false;
    const arr = [];
    if ((0, defs_js_1.iscons)(p1)) {
        const items = Array.from(p1).map((p) => {
            if (!anyRadicalSimplificationWorked) {
                let p2;
                [p2, anyRadicalSimplificationWorked] = take_care_of_nested_radicals(p);
                return p2;
            }
            return p;
        });
        arr.push(...items);
    }
    return [(0, list_js_1.makeList)(...arr), anyRadicalSimplificationWorked];
}
