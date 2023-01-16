"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quickpower = exports.quickfactor = void 0;
const defs_js_1 = require("../runtime/defs.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const factor_js_1 = require("./factor.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const multiply_js_1 = require("./multiply.js");
const symbol_js_1 = require("../runtime/symbol.js");
//-----------------------------------------------------------------------------
//
//  Factor small numerical powers
//
//  Input:    BASE        Base (positive integer < 2^31 - 1)
//            EXPONENT    Exponent
//
//  Output:    Expr
//
//-----------------------------------------------------------------------------
function quickfactor(BASE, EXPO) {
    const arr = (0, factor_js_1.factor_small_number)((0, bignum_js_1.nativeInt)(BASE));
    const n = arr.length;
    for (let i = 0; i < n; i += 2) {
        arr.push(...quickpower(arr[i], (0, multiply_js_1.multiply)(arr[i + 1], EXPO))); // factored base, factored exponent * EXPO
    }
    // arr0 has n results from factor_number_raw()
    // on top of that are all the expressions from quickpower()
    // multiply the quickpower() results
    return (0, multiply_js_1.multiply_all)(arr.slice(n));
}
exports.quickfactor = quickfactor;
// BASE is a prime number so power is simpler
function quickpower(BASE, EXPO) {
    const p3 = (0, bignum_js_1.bignum_truncate)(EXPO);
    const p4 = (0, add_js_1.subtract)(EXPO, p3);
    let fractionalPart;
    // fractional part of EXPO
    if (!(0, is_js_1.isZeroAtomOrTensor)(p4)) {
        fractionalPart = (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.POWER), BASE, p4);
    }
    const expo = (0, bignum_js_1.nativeInt)(p3);
    if (isNaN(expo)) {
        const result = (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.POWER), BASE, p3);
        return fractionalPart ? [fractionalPart, result] : [result];
    }
    if (expo === 0) {
        return [fractionalPart];
    }
    const result = (0, bignum_js_1.bignum_power_number)(BASE, expo);
    return fractionalPart ? [fractionalPart, result] : [result];
}
exports.quickpower = quickpower;
//if SELFTEST
