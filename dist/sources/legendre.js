"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_legendre = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const misc_js_1 = require("../sources/misc.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const cos_js_1 = require("./cos.js");
const derivative_js_1 = require("./derivative.js");
const eval_js_1 = require("./eval.js");
const list_js_1 = require("./list.js");
const multiply_js_1 = require("./multiply.js");
const power_js_1 = require("./power.js");
const sin_js_1 = require("./sin.js");
const subst_js_1 = require("./subst.js");
/*
 Legendre function

Example

  legendre(x,3,0)

Result

   5   3    3
  --- x  - --- x
   2        2

The computation uses the following recurrence relation.

  P(x,0) = 1

  P(x,1) = x

  n*P(x,n) = (2*(n-1)+1)*x*P(x,n-1) - (n-1)*P(x,n-2)

In the "for" loop we have i = n-1 so the recurrence relation becomes

  (i+1)*P(x,n) = (2*i+1)*x*P(x,n-1) - i*P(x,n-2)

For m > 0

  P(x,n,m) = (-1)^m * (1-x^2)^(m/2) * d^m/dx^m P(x,n)
*/
function Eval_legendre(p1) {
    const X = (0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1));
    const N = (0, eval_js_1.Eval)((0, defs_js_1.caddr)(p1));
    const p2 = (0, eval_js_1.Eval)((0, defs_js_1.cadddr)(p1));
    const M = p2 === (0, symbol_js_1.symbol)(defs_js_1.NIL) ? defs_js_1.Constants.zero : p2;
    return legendre(X, N, M);
}
exports.Eval_legendre = Eval_legendre;
function legendre(X, N, M) {
    return __legendre(X, N, M);
}
function __legendre(X, N, M) {
    let n = (0, bignum_js_1.nativeInt)(N);
    let m = (0, bignum_js_1.nativeInt)(M);
    if (n < 0 || isNaN(n) || m < 0 || isNaN(m)) {
        return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.LEGENDRE), X, N, M);
    }
    let result;
    if ((0, defs_js_1.issymbol)(X)) {
        result = __legendre2(n, m, X);
    }
    else {
        const expr = __legendre2(n, m, (0, symbol_js_1.symbol)(defs_js_1.SECRETX));
        result = (0, eval_js_1.Eval)((0, subst_js_1.subst)(expr, (0, symbol_js_1.symbol)(defs_js_1.SECRETX), X));
    }
    result = __legendre3(result, m, X) || result;
    return result;
}
function __legendre2(n, m, X) {
    let Y0 = defs_js_1.Constants.zero;
    let Y1 = defs_js_1.Constants.one;
    //  i=1  Y0 = 0
    //    Y1 = 1
    //    ((2*i+1)*x*Y1 - i*Y0) / i = x
    //
    //  i=2  Y0 = 1
    //    Y1 = x
    //    ((2*i+1)*x*Y1 - i*Y0) / i = -1/2 + 3/2*x^2
    //
    //  i=3  Y0 = x
    //    Y1 = -1/2 + 3/2*x^2
    //    ((2*i+1)*x*Y1 - i*Y0) / i = -3/2*x + 5/2*x^3
    for (let i = 0; i < n; i++) {
        const divided = (0, multiply_js_1.divide)((0, add_js_1.subtract)((0, multiply_js_1.multiply)((0, multiply_js_1.multiply)((0, bignum_js_1.integer)(2 * i + 1), X), Y1), (0, multiply_js_1.multiply)((0, bignum_js_1.integer)(i), Y0)), (0, bignum_js_1.integer)(i + 1));
        Y0 = Y1;
        Y1 = divided;
    }
    for (let i = 0; i < m; i++) {
        Y1 = (0, derivative_js_1.derivative)(Y1, X);
    }
    return Y1;
}
// moveTos tos * (-1)^m * (1-x^2)^(m/2)
function __legendre3(p1, m, X) {
    if (m === 0) {
        return;
    }
    let base = (0, add_js_1.subtract)(defs_js_1.Constants.one, (0, misc_js_1.square)(X));
    if ((0, defs_js_1.car)(X) === (0, symbol_js_1.symbol)(defs_js_1.COS)) {
        base = (0, misc_js_1.square)((0, sin_js_1.sine)((0, defs_js_1.cadr)(X)));
    }
    else if ((0, defs_js_1.car)(X) === (0, symbol_js_1.symbol)(defs_js_1.SIN)) {
        base = (0, misc_js_1.square)((0, cos_js_1.cosine)((0, defs_js_1.cadr)(X)));
    }
    let result = (0, multiply_js_1.multiply)(p1, (0, power_js_1.power)(base, (0, multiply_js_1.multiply)((0, bignum_js_1.integer)(m), (0, bignum_js_1.rational)(1, 2))));
    if (m % 2) {
        result = (0, multiply_js_1.negate)(result);
    }
    return result;
}
