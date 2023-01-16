"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qadd = void 0;
const defs_js_1 = require("../runtime/defs.js");
const bignum_js_1 = require("./bignum.js");
const madd_js_1 = require("./madd.js");
const mgcd_js_1 = require("./mgcd.js");
const mmul_js_1 = require("./mmul.js");
//  Add rational numbers
//
//  Input:    p1    addend
//            p2    addend
//
//  Output:    sum
function qadd(qadd_frac1, qadd_frac2) {
    // a, qadd_ab, b, qadd_ba, c are all bigNum
    // we are adding the fractions qadd_frac1 + qadd_frac2 i.e.
    // qadd_frac1.q.a/qadd_frac1.q.b + qadd_frac2.q.a/qadd_frac2.q.b
    const qadd_ab = (0, mmul_js_1.mmul)(qadd_frac1.q.a, qadd_frac2.q.b);
    const qadd_ba = (0, mmul_js_1.mmul)(qadd_frac1.q.b, qadd_frac2.q.a);
    const qadd_numerator = (0, madd_js_1.madd)(qadd_ab, qadd_ba);
    //mfree(qadd_ab)
    //mfree(qadd_ba)
    // zero?
    if ((0, defs_js_1.MZERO)(qadd_numerator)) {
        //console.log "qadd IS ZERO"
        //mfree(qadd_numerator)
        return defs_js_1.Constants.zero;
    }
    const qadd_denominator = (0, mmul_js_1.mmul)(qadd_frac1.q.b, qadd_frac2.q.b);
    let gcdBetweenNumeratorAndDenominator = (0, mgcd_js_1.mgcd)(qadd_numerator, qadd_denominator);
    //console.log "gcd("+qadd_numerator+","+qadd_denominator+"): " + gcdBetweenNumeratorAndDenominator
    gcdBetweenNumeratorAndDenominator = (0, bignum_js_1.makeSignSameAs)(gcdBetweenNumeratorAndDenominator, qadd_denominator);
    //console.log "qadd qadd_denominator: " + qadd_denominator
    //console.log "qadd gcdBetweenNumeratorAndDenominator: " + gcdBetweenNumeratorAndDenominator
    const a = (0, mmul_js_1.mdiv)(qadd_numerator, gcdBetweenNumeratorAndDenominator);
    const b = (0, mmul_js_1.mdiv)(qadd_denominator, gcdBetweenNumeratorAndDenominator);
    const resultSum = new defs_js_1.Num(a, b);
    //console.log "qadd resultSum.q.a: " + resultSum.q.a
    //console.log "qadd resultSum.q.b: " + resultSum.q.b
    //mfree(qadd_numerator)
    //mfree(qadd_denominator)
    //mfree(gcdBetweenNumeratorAndDenominator)
    return resultSum;
    //console.log "qadd result: " + resultSum
}
exports.qadd = qadd;
