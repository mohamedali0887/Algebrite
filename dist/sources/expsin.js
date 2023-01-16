"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expsin = exports.Eval_expsin = void 0;
const defs_js_1 = require("../runtime/defs.js");
const misc_js_1 = require("../sources/misc.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const multiply_js_1 = require("./multiply.js");
// Do the exponential sine function.
function Eval_expsin(p1) {
    return expsin((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_expsin = Eval_expsin;
function expsin(p1) {
    return (0, add_js_1.subtract)((0, multiply_js_1.multiply)((0, multiply_js_1.divide)((0, misc_js_1.exponential)((0, multiply_js_1.multiply)(defs_js_1.Constants.imaginaryunit, p1)), defs_js_1.Constants.imaginaryunit), (0, bignum_js_1.rational)(1, 2)), (0, multiply_js_1.multiply)((0, multiply_js_1.divide)((0, misc_js_1.exponential)((0, multiply_js_1.multiply)((0, multiply_js_1.negate)(defs_js_1.Constants.imaginaryunit), p1)), defs_js_1.Constants.imaginaryunit), (0, bignum_js_1.rational)(1, 2)));
}
exports.expsin = expsin;
