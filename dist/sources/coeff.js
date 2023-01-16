"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coeff = exports.Eval_coeff = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const misc_js_1 = require("../sources/misc.js");
const add_js_1 = require("./add.js");
const eval_js_1 = require("./eval.js");
const filter_js_1 = require("./filter.js");
const multiply_js_1 = require("./multiply.js");
const power_js_1 = require("./power.js");
const subst_js_1 = require("./subst.js");
/* coeff =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
p,x,n

General description
-------------------
Returns the coefficient of x^n in polynomial p. The x argument can be omitted for polynomials in x.

*/
function Eval_coeff(p1) {
    let N = (0, eval_js_1.Eval)((0, defs_js_1.cadddr)(p1));
    let X = (0, eval_js_1.Eval)((0, defs_js_1.caddr)(p1));
    const P = (0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1));
    if (N === (0, symbol_js_1.symbol)(defs_js_1.NIL)) {
        // only 2 args?
        N = X;
        X = (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_X);
    }
    // divide p by x^n, keep the constant part
    return (0, filter_js_1.filter)((0, multiply_js_1.divide)(P, (0, power_js_1.power)(X, N)), X);
}
exports.Eval_coeff = Eval_coeff;
//-----------------------------------------------------------------------------
//
//  Get polynomial coefficients
//
//  Input:  p(x) (the polynomial)
//
//          x (the variable)
//
//  Output:    Returns the array of coefficients:
//
//      [Coefficient of x^0, ..., Coefficient of x^(n-1)]
//
//-----------------------------------------------------------------------------
function coeff(p, x) {
    const coefficients = [];
    while (true) {
        const c = (0, eval_js_1.Eval)((0, subst_js_1.subst)(p, x, defs_js_1.Constants.zero));
        coefficients.push(c);
        p = (0, add_js_1.subtract)(p, c);
        if ((0, misc_js_1.equal)(p, defs_js_1.Constants.zero)) {
            return coefficients;
        }
        p = (0, defs_js_1.doexpand)(multiply_js_1.divide, p, x);
    }
}
exports.coeff = coeff;
