"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_taylor = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const derivative_js_1 = require("./derivative.js");
const eval_js_1 = require("./eval.js");
const factorial_js_1 = require("./factorial.js");
const guess_js_1 = require("./guess.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const multiply_js_1 = require("./multiply.js");
const subst_js_1 = require("./subst.js");
/*
Taylor expansion of a function

  push(F)
  push(X)
  push(N)
  push(A)
  taylor()
*/
function Eval_taylor(p1) {
    // 1st arg
    p1 = (0, defs_js_1.cdr)(p1);
    const F = (0, eval_js_1.Eval)((0, defs_js_1.car)(p1));
    // 2nd arg
    p1 = (0, defs_js_1.cdr)(p1);
    let p2 = (0, eval_js_1.Eval)((0, defs_js_1.car)(p1));
    const X = p2 === (0, symbol_js_1.symbol)(defs_js_1.NIL) ? (0, guess_js_1.guess)(F) : p2;
    // 3rd arg
    p1 = (0, defs_js_1.cdr)(p1);
    p2 = (0, eval_js_1.Eval)((0, defs_js_1.car)(p1));
    const N = p2 === (0, symbol_js_1.symbol)(defs_js_1.NIL) ? (0, bignum_js_1.integer)(24) : p2; // 24: default number of terms
    // 4th arg
    p1 = (0, defs_js_1.cdr)(p1);
    p2 = (0, eval_js_1.Eval)((0, defs_js_1.car)(p1));
    const A = p2 === (0, symbol_js_1.symbol)(defs_js_1.NIL) ? defs_js_1.Constants.zero : p2; // 0: default expansion point
    return taylor(F, X, N, A);
}
exports.Eval_taylor = Eval_taylor;
function taylor(F, X, N, A) {
    const k = (0, bignum_js_1.nativeInt)(N);
    if (isNaN(k)) {
        return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.TAYLOR), F, X, N, A);
    }
    let p5 = defs_js_1.Constants.one;
    let temp = (0, eval_js_1.Eval)((0, subst_js_1.subst)(F, X, A)); // F: f(a)
    for (let i = 1; i <= k; i++) {
        F = (0, derivative_js_1.derivative)(F, X); // F: f = f'
        if ((0, is_js_1.isZeroAtomOrTensor)(F)) {
            break;
        }
        // c = c * (x - a)
        p5 = (0, multiply_js_1.multiply)(p5, (0, add_js_1.subtract)(X, A));
        const arg1a = (0, eval_js_1.Eval)((0, subst_js_1.subst)(F, X, A)); // F: f(a)
        temp = (0, add_js_1.add)(temp, (0, multiply_js_1.divide)((0, multiply_js_1.multiply)(arg1a, p5), (0, factorial_js_1.factorial)((0, bignum_js_1.integer)(i))));
    }
    return temp;
}
