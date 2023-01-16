"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.besselj = exports.Eval_besselj = void 0;
const defs_js_1 = require("../runtime/defs.js");
const otherCFunctions_js_1 = require("../runtime/otherCFunctions.js");
const symbol_js_1 = require("../runtime/symbol.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const cos_js_1 = require("./cos.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const multiply_js_1 = require("./multiply.js");
const power_js_1 = require("./power.js");
const sin_js_1 = require("./sin.js");
/* besselj =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x,n

General description
-------------------

Returns a solution to the Bessel differential equation (Bessel function of first kind).

Recurrence relation:

  besselj(x,n) = (2/x) (n-1) besselj(x,n-1) - besselj(x,n-2)

  besselj(x,1/2) = sqrt(2/pi/x) sin(x)

  besselj(x,-1/2) = sqrt(2/pi/x) cos(x)

For negative n, reorder the recurrence relation as:

  besselj(x,n-2) = (2/x) (n-1) besselj(x,n-1) - besselj(x,n)

Substitute n+2 for n to obtain

  besselj(x,n) = (2/x) (n+1) besselj(x,n+1) - besselj(x,n+2)

Examples:

  besselj(x,3/2) = (1/x) besselj(x,1/2) - besselj(x,-1/2)

  besselj(x,-3/2) = -(1/x) besselj(x,-1/2) - besselj(x,1/2)

*/
function Eval_besselj(p1) {
    return besselj((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)), (0, eval_js_1.Eval)((0, defs_js_1.caddr)(p1)));
}
exports.Eval_besselj = Eval_besselj;
function besselj(p1, p2) {
    return yybesselj(p1, p2);
}
exports.besselj = besselj;
function yybesselj(X, N) {
    const n = (0, bignum_js_1.nativeInt)(N);
    // numerical result
    if ((0, defs_js_1.isdouble)(X) && !isNaN(n)) {
        const d = (0, otherCFunctions_js_1.jn)(n, X.d);
        return (0, bignum_js_1.double)(d);
    }
    // bessej(0,0) = 1
    if ((0, is_js_1.isZeroAtomOrTensor)(X) && (0, is_js_1.isZeroAtomOrTensor)(N)) {
        return defs_js_1.Constants.one;
    }
    // besselj(0,n) = 0
    if ((0, is_js_1.isZeroAtomOrTensor)(X) && !isNaN(n)) {
        return defs_js_1.Constants.zero;
    }
    // half arguments
    if (N.k === defs_js_1.NUM && (0, defs_js_1.MEQUAL)(N.q.b, 2)) {
        // n = 1/2
        if ((0, defs_js_1.MEQUAL)(N.q.a, 1)) {
            const twoOverPi = defs_js_1.defs.evaluatingAsFloats
                ? (0, bignum_js_1.double)(2.0 / Math.PI)
                : (0, multiply_js_1.divide)((0, bignum_js_1.integer)(2), (0, symbol_js_1.symbol)(defs_js_1.PI));
            return (0, multiply_js_1.multiply)((0, power_js_1.power)((0, multiply_js_1.divide)(twoOverPi, X), (0, bignum_js_1.rational)(1, 2)), (0, sin_js_1.sine)(X));
        }
        // n = -1/2
        if ((0, defs_js_1.MEQUAL)(N.q.a, -1)) {
            const twoOverPi = defs_js_1.defs.evaluatingAsFloats
                ? (0, bignum_js_1.double)(2.0 / Math.PI)
                : (0, multiply_js_1.divide)((0, bignum_js_1.integer)(2), (0, symbol_js_1.symbol)(defs_js_1.PI));
            return (0, multiply_js_1.multiply)((0, power_js_1.power)((0, multiply_js_1.divide)(twoOverPi, X), (0, bignum_js_1.rational)(1, 2)), (0, cos_js_1.cosine)(X));
        }
        // besselj(x,n) = (2/x) (n-sgn(n)) besselj(x,n-sgn(n)) - besselj(x,n-2*sgn(n))
        const SGN = (0, bignum_js_1.integer)((0, defs_js_1.MSIGN)(N.q.a));
        return (0, add_js_1.subtract)((0, multiply_js_1.multiply)((0, multiply_js_1.multiply)((0, multiply_js_1.divide)((0, bignum_js_1.integer)(2), X), (0, add_js_1.subtract)(N, SGN)), besselj(X, (0, add_js_1.subtract)(N, SGN))), besselj(X, (0, add_js_1.subtract)(N, (0, multiply_js_1.multiply)((0, bignum_js_1.integer)(2), SGN))));
    }
    //if 0 # test cases needed
    if ((0, is_js_1.isnegativeterm)(X)) {
        return (0, multiply_js_1.multiply)((0, multiply_js_1.multiply)((0, power_js_1.power)((0, multiply_js_1.negate)(X), N), (0, power_js_1.power)(X, (0, multiply_js_1.negate)(N))), (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.BESSELJ), (0, multiply_js_1.negate)(X), N));
    }
    if ((0, is_js_1.isnegativeterm)(N)) {
        return (0, multiply_js_1.multiply)((0, power_js_1.power)(defs_js_1.Constants.negOne, N), (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.BESSELJ), X, (0, multiply_js_1.negate)(N)));
    }
    return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.BESSELJ), X, N);
}
