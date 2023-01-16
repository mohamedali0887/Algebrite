"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_prime = void 0;
const defs_js_1 = require("../runtime/defs.js");
const run_js_1 = require("../runtime/run.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
//-----------------------------------------------------------------------------
//
//  Look up the nth prime
//
//  Input:    n (0 < n < 10001)
//
//  Output:    nth prime
//
//-----------------------------------------------------------------------------
function Eval_prime(p1) {
    return prime((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_prime = Eval_prime;
function prime(p1) {
    let n = (0, bignum_js_1.nativeInt)(p1);
    if (n < 1 || n > defs_js_1.MAXPRIMETAB) {
        (0, run_js_1.stop)('prime: Argument out of range.');
    }
    n = defs_js_1.primetab[n - 1];
    return (0, bignum_js_1.integer)(n);
}
