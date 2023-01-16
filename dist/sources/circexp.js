"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_circexp = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const misc_js_1 = require("../sources/misc.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const expcos_js_1 = require("./expcos.js");
const expsin_js_1 = require("./expsin.js");
const multiply_js_1 = require("./multiply.js");
const tensor_js_1 = require("./tensor.js");
/* circexp =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------

Returns expression x with circular and hyperbolic functions converted to exponential forms. Sometimes this will simplify an expression.

*/
function Eval_circexp(p1) {
    const result = circexp((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
    return (0, eval_js_1.Eval)(result);
}
exports.Eval_circexp = Eval_circexp;
function circexp(p1) {
    if ((0, defs_js_1.car)(p1) === (0, symbol_js_1.symbol)(defs_js_1.COS)) {
        return (0, expcos_js_1.expcos)((0, defs_js_1.cadr)(p1));
    }
    if ((0, defs_js_1.car)(p1) === (0, symbol_js_1.symbol)(defs_js_1.SIN)) {
        return (0, expsin_js_1.expsin)((0, defs_js_1.cadr)(p1));
    }
    if ((0, defs_js_1.car)(p1) === (0, symbol_js_1.symbol)(defs_js_1.TAN)) {
        p1 = (0, defs_js_1.cadr)(p1);
        const p2 = (0, misc_js_1.exponential)((0, multiply_js_1.multiply)(defs_js_1.Constants.imaginaryunit, p1));
        const p3 = (0, misc_js_1.exponential)((0, multiply_js_1.negate)((0, multiply_js_1.multiply)(defs_js_1.Constants.imaginaryunit, p1)));
        return (0, multiply_js_1.divide)((0, multiply_js_1.multiply)((0, add_js_1.subtract)(p3, p2), defs_js_1.Constants.imaginaryunit), (0, add_js_1.add)(p2, p3));
    }
    if ((0, defs_js_1.car)(p1) === (0, symbol_js_1.symbol)(defs_js_1.COSH)) {
        p1 = (0, defs_js_1.cadr)(p1);
        return (0, multiply_js_1.multiply)((0, add_js_1.add)((0, misc_js_1.exponential)(p1), (0, misc_js_1.exponential)((0, multiply_js_1.negate)(p1))), (0, bignum_js_1.rational)(1, 2));
    }
    if ((0, defs_js_1.car)(p1) === (0, symbol_js_1.symbol)(defs_js_1.SINH)) {
        p1 = (0, defs_js_1.cadr)(p1);
        return (0, multiply_js_1.multiply)((0, add_js_1.subtract)((0, misc_js_1.exponential)(p1), (0, misc_js_1.exponential)((0, multiply_js_1.negate)(p1))), (0, bignum_js_1.rational)(1, 2));
    }
    if ((0, defs_js_1.car)(p1) === (0, symbol_js_1.symbol)(defs_js_1.TANH)) {
        p1 = (0, misc_js_1.exponential)((0, multiply_js_1.multiply)((0, defs_js_1.cadr)(p1), (0, bignum_js_1.integer)(2)));
        return (0, multiply_js_1.divide)((0, add_js_1.subtract)(p1, defs_js_1.Constants.one), (0, add_js_1.add)(p1, defs_js_1.Constants.one));
    }
    if ((0, defs_js_1.iscons)(p1)) {
        return p1.map(circexp);
    }
    if (p1.k === defs_js_1.TENSOR) {
        p1 = (0, tensor_js_1.copy_tensor)(p1);
        p1.tensor.elem = p1.tensor.elem.map(circexp);
        return p1;
    }
    return p1;
}
