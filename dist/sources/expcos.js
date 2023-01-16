"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expcos = exports.Eval_expcos = void 0;
const defs_js_1 = require("../runtime/defs.js");
const misc_js_1 = require("../sources/misc.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const multiply_js_1 = require("./multiply.js");
// Do the exponential cosine function.
function Eval_expcos(p1) {
    return expcos((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_expcos = Eval_expcos;
function expcos(p1) {
    return (0, add_js_1.add)((0, multiply_js_1.multiply)((0, misc_js_1.exponential)((0, multiply_js_1.multiply)(defs_js_1.Constants.imaginaryunit, p1)), (0, bignum_js_1.rational)(1, 2)), (0, multiply_js_1.multiply)((0, misc_js_1.exponential)((0, multiply_js_1.multiply)((0, multiply_js_1.negate)(defs_js_1.Constants.imaginaryunit), p1)), (0, bignum_js_1.rational)(1, 2)));
}
exports.expcos = expcos;
