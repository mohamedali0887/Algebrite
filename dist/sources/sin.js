"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sine = exports.Eval_sin = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const cos_js_1 = require("./cos.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const multiply_js_1 = require("./multiply.js");
const power_js_1 = require("./power.js");
// Sine function of numerical and symbolic arguments
function Eval_sin(p1) {
    return sine((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_sin = Eval_sin;
function sine(p1) {
    if ((0, defs_js_1.isadd)(p1)) {
        // sin of a sum can be further decomposed into
        //sin(alpha+beta) = sin(alpha)*cos(beta)+sin(beta)*cos(alpha)
        return sine_of_angle_sum(p1);
    }
    return sine_of_angle(p1);
}
exports.sine = sine;
//console.log "sine end ---- "
// Use angle sum formula for special angles.
// decompose sum sin(alpha+beta) into
// sin(alpha)*cos(beta)+sin(beta)*cos(alpha)
function sine_of_angle_sum(p1) {
    let p2 = (0, defs_js_1.cdr)(p1);
    while ((0, defs_js_1.iscons)(p2)) {
        const B = (0, defs_js_1.car)(p2);
        if ((0, is_js_1.isnpi)(B)) {
            const A = (0, add_js_1.subtract)(p1, B);
            return (0, add_js_1.add)((0, multiply_js_1.multiply)(sine(A), (0, cos_js_1.cosine)(B)), (0, multiply_js_1.multiply)((0, cos_js_1.cosine)(A), sine(B)));
        }
        p2 = (0, defs_js_1.cdr)(p2);
    }
    return sine_of_angle(p1);
}
function sine_of_angle(p1) {
    if ((0, defs_js_1.car)(p1) === (0, symbol_js_1.symbol)(defs_js_1.ARCSIN)) {
        return (0, defs_js_1.cadr)(p1);
    }
    if ((0, defs_js_1.isdouble)(p1)) {
        let d = Math.sin(p1.d);
        if (Math.abs(d) < 1e-10) {
            d = 0.0;
        }
        return (0, bignum_js_1.double)(d);
    }
    // sine function is antisymmetric, sin(-x) = -sin(x)
    if ((0, is_js_1.isnegative)(p1)) {
        return (0, multiply_js_1.negate)(sine((0, multiply_js_1.negate)(p1)));
    }
    // sin(arctan(x)) = x / sqrt(1 + x^2)
    // see p. 173 of the CRC Handbook of Mathematical Sciences
    if ((0, defs_js_1.car)(p1) === (0, symbol_js_1.symbol)(defs_js_1.ARCTAN)) {
        return (0, multiply_js_1.multiply)((0, defs_js_1.cadr)(p1), (0, power_js_1.power)((0, add_js_1.add)(defs_js_1.Constants.one, (0, power_js_1.power)((0, defs_js_1.cadr)(p1), (0, bignum_js_1.integer)(2))), (0, bignum_js_1.rational)(-1, 2)));
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
        return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.SIN), p1);
    }
    // values of some famous angles. Many more here:
    // https://en.wikipedia.org/wiki/Trigonometric_constants_expressed_in_real_radicals
    switch (n % 360) {
        case 0:
        case 180:
            return defs_js_1.Constants.zero;
        case 30:
        case 150:
            return (0, bignum_js_1.rational)(1, 2);
        case 210:
        case 330:
            return (0, bignum_js_1.rational)(-1, 2);
        case 45:
        case 135:
            return (0, multiply_js_1.multiply)((0, bignum_js_1.rational)(1, 2), (0, power_js_1.power)((0, bignum_js_1.integer)(2), (0, bignum_js_1.rational)(1, 2)));
        case 225:
        case 315:
            return (0, multiply_js_1.multiply)((0, bignum_js_1.rational)(-1, 2), (0, power_js_1.power)((0, bignum_js_1.integer)(2), (0, bignum_js_1.rational)(1, 2)));
        case 60:
        case 120:
            return (0, multiply_js_1.multiply)((0, bignum_js_1.rational)(1, 2), (0, power_js_1.power)((0, bignum_js_1.integer)(3), (0, bignum_js_1.rational)(1, 2)));
        case 240:
        case 300:
            return (0, multiply_js_1.multiply)((0, bignum_js_1.rational)(-1, 2), (0, power_js_1.power)((0, bignum_js_1.integer)(3), (0, bignum_js_1.rational)(1, 2)));
        case 90:
            return defs_js_1.Constants.one;
        case 270:
            return defs_js_1.Constants.negOne;
        default:
            return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.SIN), p1);
    }
}
