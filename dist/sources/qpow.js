"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.qpow = void 0;
const big_integer_1 = __importDefault(require("big-integer"));
const defs_js_1 = require("../runtime/defs.js");
const run_js_1 = require("../runtime/run.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const mpow_js_1 = require("./mpow.js");
const mroot_js_1 = require("./mroot.js");
const multiply_js_1 = require("./multiply.js");
const quickfactor_js_1 = require("./quickfactor.js");
const symbol_js_1 = require("../runtime/symbol.js");
// Rational power function
function qpow(base, expo) {
    return qpowf(base, expo);
}
exports.qpow = qpow;
function qpowf(BASE, EXPO) {
    //unsigned int a, b, *t, *x, *y
    // if base is 1 or exponent is 0 then return 1
    if ((0, is_js_1.isplusone)(BASE) || (0, is_js_1.isZeroAtomOrTensor)(EXPO)) {
        return defs_js_1.Constants.one;
    }
    // if (-1)^(1/2) -> leave it as is
    if ((0, is_js_1.isminusone)(BASE) && (0, is_js_1.isoneovertwo)(EXPO)) {
        return defs_js_1.Constants.imaginaryunit;
    }
    // if base is zero then return 0
    if ((0, is_js_1.isZeroAtomOrTensor)(BASE)) {
        if ((0, is_js_1.isnegativenumber)(EXPO)) {
            (0, run_js_1.stop)('divide by zero');
        }
        return defs_js_1.Constants.zero;
    }
    // if exponent is 1 then return base
    if ((0, is_js_1.isplusone)(EXPO)) {
        return BASE;
    }
    let expo = 0;
    let x;
    let y;
    // if exponent is integer then power
    if ((0, is_js_1.isinteger)(EXPO)) {
        expo = (0, bignum_js_1.nativeInt)(EXPO);
        if (isNaN(expo)) {
            // expo greater than 32 bits
            return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.POWER), BASE, EXPO);
        }
        x = (0, mpow_js_1.mpow)(BASE.q.a, Math.abs(expo));
        y = (0, mpow_js_1.mpow)(BASE.q.b, Math.abs(expo));
        if (expo < 0) {
            const t = x;
            x = y;
            y = t;
            x = (0, bignum_js_1.makeSignSameAs)(x, y);
            y = (0, bignum_js_1.makePositive)(y);
        }
        return new defs_js_1.Num(x, y);
    }
    // from here on out the exponent is NOT an integer
    // if base is -1 then normalize polar angle
    if ((0, is_js_1.isminusone)(BASE)) {
        return normalize_angle(EXPO);
    }
    // if base is negative then (-N)^M -> N^M * (-1)^M
    if ((0, is_js_1.isnegativenumber)(BASE)) {
        return (0, multiply_js_1.multiply)(qpow((0, multiply_js_1.negate)(BASE), EXPO), qpow(defs_js_1.Constants.negOne, EXPO));
    }
    // if BASE is not an integer then power numerator and denominator
    if (!(0, is_js_1.isinteger)(BASE)) {
        return (0, multiply_js_1.multiply)(qpow((0, bignum_js_1.mp_numerator)(BASE), EXPO), qpow((0, bignum_js_1.mp_denominator)(BASE), (0, multiply_js_1.negate)(EXPO)));
    }
    // At this point BASE is a positive integer.
    // If BASE is small then factor it.
    if (is_small_integer(BASE)) {
        return (0, quickfactor_js_1.quickfactor)(BASE, EXPO);
    }
    // At this point BASE is a positive integer and EXPO is not an integer.
    if (!(0, bignum_js_1.isSmall)(EXPO.q.a) || !(0, bignum_js_1.isSmall)(EXPO.q.b)) {
        return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.POWER), BASE, EXPO);
    }
    const { a, b } = EXPO.q;
    x = (0, mroot_js_1.mroot)(BASE.q.a, b.toJSNumber());
    if (x === 0) {
        return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.POWER), BASE, EXPO);
    }
    y = (0, mpow_js_1.mpow)(x, a);
    return EXPO.q.a.isNegative() ? new defs_js_1.Num(big_integer_1.default.one, y) : new defs_js_1.Num(y);
}
//-----------------------------------------------------------------------------
//
//  Normalize the angle of unit imaginary, i.e. (-1) ^ N
//
//  Input:    N on stack (must be rational, not float)
//
//  Output:    Result on stack
//
//  Note:
//
//  n = q * d + r
//
//  Example:
//            n  d  q  r
//
//  (-1)^(8/3)  ->   (-1)^(2/3)  8  3  2  2
//  (-1)^(7/3)  ->   (-1)^(1/3)  7  3  2  1
//  (-1)^(5/3)  ->  -(-1)^(2/3)  5  3  1  2
//  (-1)^(4/3)  ->  -(-1)^(1/3)  4  3  1  1
//  (-1)^(2/3)  ->   (-1)^(2/3)  2  3  0  2
//  (-1)^(1/3)  ->   (-1)^(1/3)  1  3  0  1
//
//  (-1)^(-1/3)  ->  -(-1)^(2/3)  -1  3  -1  2
//  (-1)^(-2/3)  ->  -(-1)^(1/3)  -2  3  -1  1
//  (-1)^(-4/3)  ->   (-1)^(2/3)  -4  3  -2  2
//  (-1)^(-5/3)  ->   (-1)^(1/3)  -5  3  -2  1
//  (-1)^(-7/3)  ->  -(-1)^(2/3)  -7  3  -3  2
//  (-1)^(-8/3)  ->  -(-1)^(1/3)  -8  3  -3  1
//
//-----------------------------------------------------------------------------
function normalize_angle(A) {
    // integer exponent?
    if ((0, is_js_1.isinteger)(A)) {
        if (A.q.a.isOdd()) {
            return defs_js_1.Constants.negOne; // odd exponent
        }
        else {
            return defs_js_1.Constants.one; // even exponent
        }
    }
    // floor
    let Q = (0, bignum_js_1.bignum_truncate)(A);
    if ((0, is_js_1.isnegativenumber)(A)) {
        Q = (0, add_js_1.add)(Q, defs_js_1.Constants.negOne);
    }
    // remainder (always positive)
    let R = (0, add_js_1.subtract)(A, Q);
    // remainder becomes new angle
    let result = (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.POWER), defs_js_1.Constants.negOne, R);
    // negate if quotient is odd
    if (Q.q.a.isOdd()) {
        result = (0, multiply_js_1.negate)(result);
    }
    return result;
}
function is_small_integer(p) {
    return (0, bignum_js_1.isSmall)(p.q.a);
}
