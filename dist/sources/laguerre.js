"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_laguerre = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const list_js_1 = require("./list.js");
const multiply_js_1 = require("./multiply.js");
const subst_js_1 = require("./subst.js");
/*
 Laguerre function

Example

  laguerre(x,3)

Result

     1   3    3   2
  - --- x  + --- x  - 3 x + 1
     6        2

The computation uses the following recurrence relation.

  L(x,0,k) = 1

  L(x,1,k) = -x + k + 1

  n*L(x,n,k) = (2*(n-1)+1-x+k)*L(x,n-1,k) - (n-1+k)*L(x,n-2,k)

In the "for" loop i = n-1 so the recurrence relation becomes

  (i+1)*L(x,n,k) = (2*i+1-x+k)*L(x,n-1,k) - (i+k)*L(x,n-2,k)
*/
function Eval_laguerre(p1) {
    const X = (0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1));
    const N = (0, eval_js_1.Eval)((0, defs_js_1.caddr)(p1));
    const p2 = (0, eval_js_1.Eval)((0, defs_js_1.cadddr)(p1));
    const K = p2 === (0, symbol_js_1.symbol)(defs_js_1.NIL) ? defs_js_1.Constants.zero : p2;
    return laguerre(X, N, K);
}
exports.Eval_laguerre = Eval_laguerre;
function laguerre(X, N, K) {
    let n = (0, bignum_js_1.nativeInt)(N);
    if (n < 0 || isNaN(n)) {
        return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.LAGUERRE), X, N, K);
    }
    if ((0, defs_js_1.issymbol)(X)) {
        return laguerre2(n, X, K);
    }
    return (0, eval_js_1.Eval)((0, subst_js_1.subst)(laguerre2(n, (0, symbol_js_1.symbol)(defs_js_1.SECRETX), K), (0, symbol_js_1.symbol)(defs_js_1.SECRETX), X));
}
function laguerre2(n, p1, p3) {
    let Y0 = defs_js_1.Constants.zero;
    let Y1 = defs_js_1.Constants.one;
    for (let i = 0; i < n; i++) {
        const result = (0, multiply_js_1.divide)((0, add_js_1.subtract)((0, multiply_js_1.multiply)((0, add_js_1.add)((0, add_js_1.subtract)((0, bignum_js_1.integer)(2 * i + 1), p1), p3), Y1), (0, multiply_js_1.multiply)((0, add_js_1.add)((0, bignum_js_1.integer)(i), p3), Y0)), (0, bignum_js_1.integer)(i + 1));
        Y0 = Y1;
        Y1 = result;
    }
    return Y1;
}
