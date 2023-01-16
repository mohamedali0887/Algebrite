"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_arccos = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const multiply_js_1 = require("./multiply.js");
/* arccos =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------
Returns the inverse cosine of x.

*/
function Eval_arccos(x) {
    return arccos((0, eval_js_1.Eval)((0, defs_js_1.cadr)(x)));
}
exports.Eval_arccos = Eval_arccos;
function arccos(x) {
    if ((0, defs_js_1.car)(x) === (0, symbol_js_1.symbol)(defs_js_1.COS)) {
        return (0, defs_js_1.cadr)(x);
    }
    if ((0, defs_js_1.isdouble)(x)) {
        return (0, bignum_js_1.double)(Math.acos(x.d));
    }
    // if x == 1/sqrt(2) then return 1/4*pi (45 degrees)
    // second if catches the other way of saying it, sqrt(2)/2
    if ((0, is_js_1.isoneoversqrttwo)(x) ||
        ((0, defs_js_1.ismultiply)(x) &&
            (0, is_js_1.equalq)((0, defs_js_1.car)((0, defs_js_1.cdr)(x)), 1, 2) &&
            (0, defs_js_1.car)((0, defs_js_1.car)((0, defs_js_1.cdr)((0, defs_js_1.cdr)(x)))) === (0, symbol_js_1.symbol)(defs_js_1.POWER) &&
            (0, is_js_1.equaln)((0, defs_js_1.car)((0, defs_js_1.cdr)((0, defs_js_1.car)((0, defs_js_1.cdr)((0, defs_js_1.cdr)(x))))), 2) &&
            (0, is_js_1.equalq)((0, defs_js_1.car)((0, defs_js_1.cdr)((0, defs_js_1.cdr)((0, defs_js_1.car)((0, defs_js_1.cdr)((0, defs_js_1.cdr)(x)))))), 1, 2))) {
        return defs_js_1.defs.evaluatingAsFloats
            ? (0, bignum_js_1.double)(Math.PI / 4.0)
            : (0, multiply_js_1.multiply)((0, bignum_js_1.rational)(1, 4), (0, symbol_js_1.symbol)(defs_js_1.PI));
    }
    // if x == -1/sqrt(2) then return 3/4*pi (135 degrees)
    // second if catches the other way of saying it, -sqrt(2)/2
    if ((0, is_js_1.isminusoneoversqrttwo)(x) ||
        ((0, defs_js_1.ismultiply)(x) &&
            (0, is_js_1.equalq)((0, defs_js_1.car)((0, defs_js_1.cdr)(x)), -1, 2) &&
            (0, defs_js_1.car)((0, defs_js_1.car)((0, defs_js_1.cdr)((0, defs_js_1.cdr)(x)))) === (0, symbol_js_1.symbol)(defs_js_1.POWER) &&
            (0, is_js_1.equaln)((0, defs_js_1.car)((0, defs_js_1.cdr)((0, defs_js_1.car)((0, defs_js_1.cdr)((0, defs_js_1.cdr)(x))))), 2) &&
            (0, is_js_1.equalq)((0, defs_js_1.car)((0, defs_js_1.cdr)((0, defs_js_1.cdr)((0, defs_js_1.car)((0, defs_js_1.cdr)((0, defs_js_1.cdr)(x)))))), 1, 2))) {
        return defs_js_1.defs.evaluatingAsFloats
            ? (0, bignum_js_1.double)((Math.PI * 3.0) / 4.0)
            : (0, multiply_js_1.multiply)((0, bignum_js_1.rational)(3, 4), (0, symbol_js_1.symbol)(defs_js_1.PI));
    }
    // if x == sqrt(3)/2 then return 1/6*pi (30 degrees)
    if ((0, is_js_1.isSqrtThreeOverTwo)(x)) {
        return defs_js_1.defs.evaluatingAsFloats
            ? (0, bignum_js_1.double)(Math.PI / 6.0)
            : (0, multiply_js_1.multiply)((0, bignum_js_1.rational)(1, 6), (0, symbol_js_1.symbol)(defs_js_1.PI));
    }
    // if x == -sqrt(3)/2 then return 5/6*pi (150 degrees)
    if ((0, is_js_1.isMinusSqrtThreeOverTwo)(x)) {
        return defs_js_1.defs.evaluatingAsFloats
            ? (0, bignum_js_1.double)((5.0 * Math.PI) / 6.0)
            : (0, multiply_js_1.multiply)((0, bignum_js_1.rational)(5, 6), (0, symbol_js_1.symbol)(defs_js_1.PI));
    }
    if (!(0, defs_js_1.isrational)(x)) {
        return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.ARCCOS), x);
    }
    const n = (0, bignum_js_1.nativeInt)((0, multiply_js_1.multiply)(x, (0, bignum_js_1.integer)(2)));
    switch (n) {
        case -2:
            return defs_js_1.Constants.Pi();
        case -1:
            return defs_js_1.defs.evaluatingAsFloats
                ? (0, bignum_js_1.double)((Math.PI * 2.0) / 3.0)
                : (0, multiply_js_1.multiply)((0, bignum_js_1.rational)(2, 3), (0, symbol_js_1.symbol)(defs_js_1.PI));
        case 0:
            return defs_js_1.defs.evaluatingAsFloats
                ? (0, bignum_js_1.double)(Math.PI / 2.0)
                : (0, multiply_js_1.multiply)((0, bignum_js_1.rational)(1, 2), (0, symbol_js_1.symbol)(defs_js_1.PI));
        case 1:
            return defs_js_1.defs.evaluatingAsFloats
                ? (0, bignum_js_1.double)(Math.PI / 3.0)
                : (0, multiply_js_1.multiply)((0, bignum_js_1.rational)(1, 3), (0, symbol_js_1.symbol)(defs_js_1.PI));
        case 2:
            return defs_js_1.Constants.Zero();
        default:
            return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.ARCCOS), x);
    }
}
