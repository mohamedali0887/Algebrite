"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cosine = exports.Eval_cos = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const multiply_js_1 = require("./multiply.js");
const power_js_1 = require("./power.js");
const sin_js_1 = require("./sin.js");
/* cos =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------
Returns the cosine of x.

*/
function Eval_cos(p1) {
    return cosine((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_cos = Eval_cos;
function cosine(p1) {
    if ((0, defs_js_1.isadd)(p1)) {
        return cosine_of_angle_sum(p1);
    }
    return cosine_of_angle(p1);
}
exports.cosine = cosine;
// Use angle sum formula for special angles.
function cosine_of_angle_sum(p1) {
    if ((0, defs_js_1.iscons)(p1)) {
        for (const B of p1.tail()) {
            if ((0, is_js_1.isnpi)(B)) {
                const A = (0, add_js_1.subtract)(p1, B);
                return (0, add_js_1.subtract)((0, multiply_js_1.multiply)(cosine(A), cosine(B)), (0, multiply_js_1.multiply)((0, sin_js_1.sine)(A), (0, sin_js_1.sine)(B)));
            }
        }
    }
    return cosine_of_angle(p1);
}
function cosine_of_angle(p1) {
    if ((0, defs_js_1.car)(p1) === (0, symbol_js_1.symbol)(defs_js_1.ARCCOS)) {
        return (0, defs_js_1.cadr)(p1);
    }
    if ((0, defs_js_1.isdouble)(p1)) {
        let d = Math.cos(p1.d);
        if (Math.abs(d) < 1e-10) {
            d = 0.0;
        }
        return (0, bignum_js_1.double)(d);
    }
    // cosine function is symmetric, cos(-x) = cos(x)
    if ((0, is_js_1.isnegative)(p1)) {
        p1 = (0, multiply_js_1.negate)(p1);
    }
    // cos(arctan(x)) = 1 / sqrt(1 + x^2)
    // see p. 173 of the CRC Handbook of Mathematical Sciences
    if ((0, defs_js_1.car)(p1) === (0, symbol_js_1.symbol)(defs_js_1.ARCTAN)) {
        const base = (0, add_js_1.add)(defs_js_1.Constants.one, (0, power_js_1.power)((0, defs_js_1.cadr)(p1), (0, bignum_js_1.integer)(2)));
        return (0, power_js_1.power)(base, (0, bignum_js_1.rational)(-1, 2));
    }
    // multiply by 180/pi to go from radians to degrees.
    // we go from radians to degrees because it's much
    // easier to calculate symbolic results of most (not all) "classic"
    // angles (e.g. 30,45,60...) if we calculate the degrees
    // and the we do a switch on that.
    // Alternatively, we could look at the fraction of pi
    // (e.g. 60 degrees is 1/3 pi) but that's more
    // convoluted as we'd need to look at both numerator and
    // denominator.
    const n = (0, bignum_js_1.nativeInt)((0, multiply_js_1.divide)((0, multiply_js_1.multiply)(p1, (0, bignum_js_1.integer)(180)), defs_js_1.Constants.Pi()));
    // most "good" (i.e. compact) trigonometric results
    // happen for a round number of degrees. There are some exceptions
    // though, e.g. 22.5 degrees, which we don't capture here.
    if (n < 0 || isNaN(n)) {
        return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.COS), p1);
    }
    switch (n % 360) {
        case 90:
        case 270:
            return defs_js_1.Constants.zero;
        case 60:
        case 300:
            return (0, bignum_js_1.rational)(1, 2);
        case 120:
        case 240:
            return (0, bignum_js_1.rational)(-1, 2);
        case 45:
        case 315:
            return (0, multiply_js_1.multiply)((0, bignum_js_1.rational)(1, 2), (0, power_js_1.power)((0, bignum_js_1.integer)(2), (0, bignum_js_1.rational)(1, 2)));
        case 135:
        case 225:
            return (0, multiply_js_1.multiply)((0, bignum_js_1.rational)(-1, 2), (0, power_js_1.power)((0, bignum_js_1.integer)(2), (0, bignum_js_1.rational)(1, 2)));
        case 30:
        case 330:
            return (0, multiply_js_1.multiply)((0, bignum_js_1.rational)(1, 2), (0, power_js_1.power)((0, bignum_js_1.integer)(3), (0, bignum_js_1.rational)(1, 2)));
        case 150:
        case 210:
            return (0, multiply_js_1.multiply)((0, bignum_js_1.rational)(-1, 2), (0, power_js_1.power)((0, bignum_js_1.integer)(3), (0, bignum_js_1.rational)(1, 2)));
        case 0:
            return defs_js_1.Constants.one;
        case 180:
            return defs_js_1.Constants.negOne;
        default:
            return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.COS), p1);
    }
}
