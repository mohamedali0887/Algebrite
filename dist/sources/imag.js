"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imag = exports.Eval_imag = void 0;
const defs_js_1 = require("../runtime/defs.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const conj_js_1 = require("./conj.js");
const eval_js_1 = require("./eval.js");
const multiply_js_1 = require("./multiply.js");
const rect_js_1 = require("./rect.js");
/*
 Returns the coefficient of the imaginary part of complex z

  z    imag(z)
  -    -------

  a + i b    b

  exp(i a)  sin(a)
*/
const DEBUG_IMAG = false;
function Eval_imag(p1) {
    return imag((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_imag = Eval_imag;
function imag(p) {
    const p1 = (0, rect_js_1.rect)(p);
    const conj = (0, conj_js_1.conjugate)(p1);
    const arg1 = (0, multiply_js_1.divide)((0, add_js_1.subtract)(p1, conj), (0, bignum_js_1.integer)(2));
    const result = (0, multiply_js_1.divide)(arg1, defs_js_1.Constants.imaginaryunit);
    if (DEBUG_IMAG) {
        console.log(`IMAGE of ${p1}`);
        console.log(` image: conjugate result: ${conj}`);
        console.log(` image: 1st divide result: ${arg1}`);
        console.log(` image: 2nd divide result: ${result}`);
    }
    return result;
}
exports.imag = imag;
