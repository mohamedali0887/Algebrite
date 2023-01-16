"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hermite = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const list_js_1 = require("./list.js");
const multiply_js_1 = require("./multiply.js");
const subst_js_1 = require("./subst.js");
//-----------------------------------------------------------------------------
//
//  Hermite polynomial
//
//  Input:    p1    x  (can be a symbol or expr)
//            p2    n
//
//  Output:    Result
//
//-----------------------------------------------------------------------------
function hermite(p1, p2) {
    return yyhermite(p1, p2);
}
exports.hermite = hermite;
// uses the recurrence relation H(x,n+1)=2*x*H(x,n)-2*n*H(x,n-1)
function yyhermite(X, N) {
    const n = (0, bignum_js_1.nativeInt)(N);
    if (n < 0 || isNaN(n)) {
        return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.HERMITE), X, N);
    }
    if ((0, defs_js_1.issymbol)(X)) {
        return yyhermite2(n, X);
    }
    return (0, eval_js_1.Eval)((0, subst_js_1.subst)(yyhermite2(n, (0, symbol_js_1.symbol)(defs_js_1.SECRETX)), (0, symbol_js_1.symbol)(defs_js_1.SECRETX), X));
}
function yyhermite2(n, p1) {
    let Y1 = defs_js_1.Constants.zero;
    let temp = defs_js_1.Constants.one;
    for (let i = 0; i < n; i++) {
        const Y0 = Y1;
        Y1 = temp;
        temp = (0, multiply_js_1.multiply)((0, add_js_1.subtract)((0, multiply_js_1.multiply)(p1, Y1), (0, multiply_js_1.multiply)((0, bignum_js_1.integer)(i), Y0)), (0, bignum_js_1.integer)(2));
    }
    return temp;
}
