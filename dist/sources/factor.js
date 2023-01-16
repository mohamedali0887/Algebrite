"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.factor_small_number = exports.factor = exports.Eval_factor = void 0;
const defs_js_1 = require("../runtime/defs.js");
const run_js_1 = require("../runtime/run.js");
const symbol_js_1 = require("../runtime/symbol.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const factorpoly_js_1 = require("./factorpoly.js");
const guess_js_1 = require("./guess.js");
const is_js_1 = require("./is.js");
const multiply_js_1 = require("./multiply.js");
const pollard_js_1 = require("./pollard.js");
// factor a polynomial or integer
function Eval_factor(p1) {
    const top = (0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1));
    const p2 = (0, eval_js_1.Eval)((0, defs_js_1.caddr)(p1));
    const variable = p2 === (0, symbol_js_1.symbol)(defs_js_1.NIL) ? (0, guess_js_1.guess)(top) : p2;
    let temp = factor(top, variable);
    // more factoring?
    p1 = (0, defs_js_1.cdddr)(p1);
    if ((0, defs_js_1.iscons)(p1)) {
        temp = [...p1].reduce((acc, p) => factor_again(acc, (0, eval_js_1.Eval)(p)), temp);
    }
    return temp;
}
exports.Eval_factor = Eval_factor;
function factor_again(p1, p2) {
    if ((0, defs_js_1.ismultiply)(p1)) {
        const arr = [];
        p1.tail().forEach((el) => factor_term(arr, el, p2));
        return (0, multiply_js_1.multiply_all_noexpand)(arr);
    }
    const arr = [];
    factor_term(arr, p1, p2);
    return arr[0];
}
function factor_term(arr, arg1, arg2) {
    const p1 = (0, factorpoly_js_1.factorpoly)(arg1, arg2);
    if ((0, defs_js_1.ismultiply)(p1)) {
        arr.push(...p1.tail());
        return;
    }
    arr.push(p1);
}
function factor(p1, p2) {
    if ((0, is_js_1.isinteger)(p1)) {
        return (0, pollard_js_1.factor_number)(p1); // see pollard.cpp
    }
    return (0, factorpoly_js_1.factorpoly)(p1, p2);
}
exports.factor = factor;
// for factoring small integers (2^32 or less)
function factor_small_number(n) {
    if (isNaN(n)) {
        (0, run_js_1.stop)('number too big to factor');
    }
    const arr = [];
    if (n < 0) {
        n = -n;
    }
    for (let i = 0; i < defs_js_1.MAXPRIMETAB; i++) {
        const d = defs_js_1.primetab[i];
        if (d > n / d) {
            break;
        }
        let expo = 0;
        while (n % d === 0) {
            n /= d;
            expo++;
        }
        if (expo) {
            arr.push((0, bignum_js_1.integer)(d));
            arr.push((0, bignum_js_1.integer)(expo));
        }
    }
    if (n > 1) {
        arr.push((0, bignum_js_1.integer)(n));
        arr.push(defs_js_1.Constants.one);
    }
    return arr;
}
exports.factor_small_number = factor_small_number;
