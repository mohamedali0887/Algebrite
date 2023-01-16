"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.real = exports.Eval_real = void 0;
const defs_js_1 = require("../runtime/defs.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const conj_js_1 = require("./conj.js");
const eval_js_1 = require("./eval.js");
const multiply_js_1 = require("./multiply.js");
const rect_js_1 = require("./rect.js");
/*
 Returns the real part of complex z

  z    real(z)
  -    -------

  a + i b    a

  exp(i a)  cos(a)
*/
function Eval_real(p1) {
    return real((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_real = Eval_real;
function real(p) {
    const p1 = (0, rect_js_1.rect)(p);
    return (0, multiply_js_1.divide)((0, add_js_1.add)(p1, (0, conj_js_1.conjugate)(p1)), (0, bignum_js_1.integer)(2));
}
exports.real = real;
