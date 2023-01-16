import { POWER } from '../runtime/defs.js';
import { subtract } from './add.js';
import { bignum_power_number, bignum_truncate, nativeInt } from './bignum.js';
import { factor_small_number } from './factor.js';
import { isZeroAtomOrTensor } from './is.js';
import { makeList } from './list.js';
import { multiply, multiply_all } from './multiply.js';
import { symbol } from '../runtime/symbol.js';
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
export function quickfactor(BASE, EXPO) {
    const arr = factor_small_number(nativeInt(BASE));
    const n = arr.length;
    for (let i = 0; i < n; i += 2) {
        arr.push(...quickpower(arr[i], multiply(arr[i + 1], EXPO))); // factored base, factored exponent * EXPO
    }
    // arr0 has n results from factor_number_raw()
    // on top of that are all the expressions from quickpower()
    // multiply the quickpower() results
    return multiply_all(arr.slice(n));
}
// BASE is a prime number so power is simpler
export function quickpower(BASE, EXPO) {
    const p3 = bignum_truncate(EXPO);
    const p4 = subtract(EXPO, p3);
    let fractionalPart;
    // fractional part of EXPO
    if (!isZeroAtomOrTensor(p4)) {
        fractionalPart = makeList(symbol(POWER), BASE, p4);
    }
    const expo = nativeInt(p3);
    if (isNaN(expo)) {
        const result = makeList(symbol(POWER), BASE, p3);
        return fractionalPart ? [fractionalPart, result] : [result];
    }
    if (expo === 0) {
        return [fractionalPart];
    }
    const result = bignum_power_number(BASE, expo);
    return fractionalPart ? [fractionalPart, result] : [result];
}
//if SELFTEST
