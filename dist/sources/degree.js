"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.degree = exports.Eval_degree = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const misc_js_1 = require("../sources/misc.js");
const eval_js_1 = require("./eval.js");
const guess_js_1 = require("./guess.js");
const is_js_1 = require("./is.js");
/* deg =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
p,x

General description
-------------------
Returns the degree of polynomial p(x).

*/
function Eval_degree(p1) {
    const poly = (0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1));
    p1 = (0, eval_js_1.Eval)((0, defs_js_1.caddr)(p1));
    const variable = p1 === (0, symbol_js_1.symbol)(defs_js_1.NIL) ? (0, guess_js_1.guess)(poly) : p1;
    return degree(poly, variable);
}
exports.Eval_degree = Eval_degree;
//-----------------------------------------------------------------------------
//
//  Find the degree of a polynomial
//
//  Input:    POLY    p(x)
//            X       x
//
//  Output:    Result
//
//  Note: Finds the largest numerical power of x. Does not check for
//  weirdness in p(x).
//
//-----------------------------------------------------------------------------
function degree(POLY, X) {
    return yydegree(POLY, X, defs_js_1.Constants.zero);
}
exports.degree = degree;
function yydegree(POLY, X, DEGREE) {
    if ((0, misc_js_1.equal)(POLY, X)) {
        if ((0, is_js_1.isZeroAtomOrTensor)(DEGREE)) {
            DEGREE = defs_js_1.Constants.one;
        }
    }
    else if ((0, defs_js_1.ispower)(POLY)) {
        if ((0, misc_js_1.equal)((0, defs_js_1.cadr)(POLY), X) &&
            (0, defs_js_1.isNumericAtom)((0, defs_js_1.caddr)(POLY)) &&
            (0, misc_js_1.lessp)(DEGREE, (0, defs_js_1.caddr)(POLY))) {
            DEGREE = (0, defs_js_1.caddr)(POLY);
        }
    }
    else if ((0, defs_js_1.iscons)(POLY)) {
        DEGREE = POLY.tail().reduce((a, b) => yydegree(b, X, a), DEGREE);
    }
    return DEGREE;
}
