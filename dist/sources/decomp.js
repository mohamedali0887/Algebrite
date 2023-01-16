"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decomp = exports.Eval_decomp = void 0;
const defs_js_1 = require("../runtime/defs.js");
const find_js_1 = require("../runtime/find.js");
const symbol_js_1 = require("../runtime/symbol.js");
const misc_js_1 = require("../sources/misc.js");
const add_js_1 = require("./add.js");
const eval_js_1 = require("./eval.js");
const guess_js_1 = require("./guess.js");
const list_js_1 = require("./list.js");
const multiply_js_1 = require("./multiply.js");
// this function extract parts subtrees from a tree.
// It is used in two
// places that have to do with pattern matching.
// One is for integrals, where an expression or its
// subparts are matched against cases in an
// integrals table.
// Another one is for applyging tranformation patterns
// defined via PATTERN, again patterns are applied to
// either the whole expression or any of its parts.
// unclear to me at the moment
// why this is exposed as something that can
// be evalled. Never called.
function Eval_decomp(p1) {
    console.log('Eval_decomp is being called!!!!!!!!!!!!!!!!!!!!');
    const arg = (0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1));
    p1 = (0, eval_js_1.Eval)((0, defs_js_1.caddr)(p1));
    const variable = p1 === (0, symbol_js_1.symbol)(defs_js_1.NIL) ? (0, guess_js_1.guess)(arg) : p1;
    const result = decomp(false, arg, variable);
    return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.NIL), ...result);
}
exports.Eval_decomp = Eval_decomp;
function pushTryNotToDuplicateLocal(localStack, item) {
    if (localStack.length > 0 && (0, misc_js_1.equal)(item, localStack[localStack.length - 1])) {
        return false;
    }
    localStack.push(item);
    return true;
}
// returns constant expressions on the stack
function decomp(generalTransform, p1, p2) {
    if (defs_js_1.DEBUG) {
        console.log(`DECOMPOSING ${p1}`);
    }
    // is the entire expression constant?
    if (generalTransform) {
        if (!(0, defs_js_1.iscons)(p1)) {
            if (defs_js_1.DEBUG) {
                console.log(` ground thing: ${p1}`);
            }
            return [p1];
        }
    }
    else {
        if (!(0, find_js_1.Find)(p1, p2)) {
            if (defs_js_1.DEBUG) {
                console.log(' entire expression is constant');
            }
            return [p1];
        }
    }
    // sum?
    if ((0, defs_js_1.isadd)(p1)) {
        return decomp_sum(generalTransform, p1, p2);
    }
    // product?
    if ((0, defs_js_1.ismultiply)(p1)) {
        return decomp_product(generalTransform, p1, p2);
    }
    let p3 = (0, defs_js_1.cdr)(p1);
    // naive decomp if not sum or product
    if (defs_js_1.DEBUG) {
        console.log(' naive decomp');
        console.log(`startig p3: ${p3}`);
    }
    const stack = [];
    while ((0, defs_js_1.iscons)(p3)) {
        // for a general transformations,
        // we want to match any part of the tree so
        // we need to push the subtree as well
        // as recurse to its parts
        if (generalTransform) {
            stack.push((0, defs_js_1.car)(p3));
        }
        if (defs_js_1.DEBUG) {
            console.log('recursive decomposition');
            console.log(`car(p3): ${(0, defs_js_1.car)(p3)}`);
            console.log(`p2: ${p2}`);
        }
        stack.push(...decomp(generalTransform, (0, defs_js_1.car)(p3), p2));
        p3 = (0, defs_js_1.cdr)(p3);
    }
    return stack;
}
exports.decomp = decomp;
function decomp_sum(generalTransform, p1, p2) {
    if (defs_js_1.DEBUG) {
        console.log(' decomposing the sum ');
    }
    // decomp terms involving x
    let p3 = (0, defs_js_1.cdr)(p1);
    const stack = [];
    while ((0, defs_js_1.iscons)(p3)) {
        if ((0, find_js_1.Find)((0, defs_js_1.car)(p3), p2) || generalTransform) {
            stack.push(...decomp(generalTransform, (0, defs_js_1.car)(p3), p2));
        }
        p3 = (0, defs_js_1.cdr)(p3);
    }
    // add together all constant terms
    p3 = (0, defs_js_1.cdr)(p1);
    const constantTerms = [...p3].filter((t) => !(0, find_js_1.Find)(t, p2));
    if (constantTerms.length) {
        p3 = (0, add_js_1.add_all)(constantTerms);
        pushTryNotToDuplicateLocal(stack, p3);
        stack.push((0, multiply_js_1.negate)(p3)); // need both +a, -a for some integrals
    }
    return stack;
}
function decomp_product(generalTransform, p1, p2) {
    if (defs_js_1.DEBUG) {
        console.log(' decomposing the product ');
    }
    // decomp factors involving x
    let p3 = (0, defs_js_1.cdr)(p1);
    const stack = [];
    while ((0, defs_js_1.iscons)(p3)) {
        if ((0, find_js_1.Find)((0, defs_js_1.car)(p3), p2) || generalTransform) {
            stack.push(...decomp(generalTransform, (0, defs_js_1.car)(p3), p2));
        }
        p3 = (0, defs_js_1.cdr)(p3);
    }
    // multiply together all constant factors
    p3 = (0, defs_js_1.cdr)(p1);
    const constantFactors = [];
    while ((0, defs_js_1.iscons)(p3)) {
        const item = (0, defs_js_1.car)(p3);
        if (!(0, find_js_1.Find)(item, p2)) {
            if (constantFactors.length < 1 ||
                !(0, misc_js_1.equal)(item, constantFactors[constantFactors.length - 1])) {
                constantFactors.push(item);
            }
        }
        p3 = (0, defs_js_1.cdr)(p3);
    }
    if (constantFactors.length > 0) {
        stack.push((0, multiply_js_1.multiply_all)(constantFactors));
    }
    return stack;
}
