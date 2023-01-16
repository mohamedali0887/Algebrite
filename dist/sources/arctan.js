"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arctan = exports.Eval_arctan = void 0;
const defs_js_1 = require("../runtime/defs.js");
const find_js_1 = require("../runtime/find.js");
const symbol_js_1 = require("../runtime/symbol.js");
const misc_js_1 = require("../sources/misc.js");
const bignum_js_1 = require("./bignum.js");
const denominator_js_1 = require("./denominator.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const multiply_js_1 = require("./multiply.js");
const numerator_js_1 = require("./numerator.js");
/* arctan =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------
Returns the inverse tangent of x.

*/
function Eval_arctan(x) {
    return arctan((0, eval_js_1.Eval)((0, defs_js_1.cadr)(x)));
}
exports.Eval_arctan = Eval_arctan;
function arctan(x) {
    if ((0, defs_js_1.car)(x) === (0, symbol_js_1.symbol)(defs_js_1.TAN)) {
        return (0, defs_js_1.cadr)(x);
    }
    if ((0, defs_js_1.isdouble)(x)) {
        return (0, bignum_js_1.double)(Math.atan(x.d));
    }
    if ((0, is_js_1.isZeroAtomOrTensor)(x)) {
        return defs_js_1.Constants.zero;
    }
    if ((0, is_js_1.isnegative)(x)) {
        return (0, multiply_js_1.negate)(arctan((0, multiply_js_1.negate)(x)));
    }
    // arctan(sin(a) / cos(a)) ?
    if ((0, find_js_1.Find)(x, (0, symbol_js_1.symbol)(defs_js_1.SIN)) && (0, find_js_1.Find)(x, (0, symbol_js_1.symbol)(defs_js_1.COS))) {
        const p2 = (0, numerator_js_1.numerator)(x);
        const p3 = (0, denominator_js_1.denominator)(x);
        if ((0, defs_js_1.car)(p2) === (0, symbol_js_1.symbol)(defs_js_1.SIN) &&
            (0, defs_js_1.car)(p3) === (0, symbol_js_1.symbol)(defs_js_1.COS) &&
            (0, misc_js_1.equal)((0, defs_js_1.cadr)(p2), (0, defs_js_1.cadr)(p3))) {
            return (0, defs_js_1.cadr)(p2);
        }
    }
    // arctan(1/sqrt(3)) -> pi/6
    // second if catches the other way of saying it, sqrt(3)/3
    if (((0, defs_js_1.ispower)(x) && (0, is_js_1.equaln)((0, defs_js_1.cadr)(x), 3) && (0, is_js_1.equalq)((0, defs_js_1.caddr)(x), -1, 2)) ||
        ((0, defs_js_1.ismultiply)(x) &&
            (0, is_js_1.equalq)((0, defs_js_1.car)((0, defs_js_1.cdr)(x)), 1, 3) &&
            (0, defs_js_1.car)((0, defs_js_1.car)((0, defs_js_1.cdr)((0, defs_js_1.cdr)(x)))) === (0, symbol_js_1.symbol)(defs_js_1.POWER) &&
            (0, is_js_1.equaln)((0, defs_js_1.car)((0, defs_js_1.cdr)((0, defs_js_1.car)((0, defs_js_1.cdr)((0, defs_js_1.cdr)(x))))), 3) &&
            (0, is_js_1.equalq)((0, defs_js_1.car)((0, defs_js_1.cdr)((0, defs_js_1.cdr)((0, defs_js_1.car)((0, defs_js_1.cdr)((0, defs_js_1.cdr)(x)))))), 1, 2))) {
        return (0, multiply_js_1.multiply)((0, bignum_js_1.rational)(1, 6), defs_js_1.Constants.Pi());
    }
    // arctan(1) -> pi/4
    if ((0, is_js_1.equaln)(x, 1)) {
        return (0, multiply_js_1.multiply)((0, bignum_js_1.rational)(1, 4), defs_js_1.Constants.Pi());
    }
    // arctan(sqrt(3)) -> pi/3
    if ((0, defs_js_1.ispower)(x) && (0, is_js_1.equaln)((0, defs_js_1.cadr)(x), 3) && (0, is_js_1.equalq)((0, defs_js_1.caddr)(x), 1, 2)) {
        return (0, multiply_js_1.multiply)((0, bignum_js_1.rational)(1, 3), defs_js_1.Constants.Pi());
    }
    return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.ARCTAN), x);
}
exports.arctan = arctan;
