"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_tan = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const multiply_js_1 = require("./multiply.js");
const power_js_1 = require("./power.js");
// Tangent function of numerical and symbolic arguments
function Eval_tan(p1) {
    return tangent((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_tan = Eval_tan;
function tangent(p1) {
    if ((0, defs_js_1.car)(p1) === (0, symbol_js_1.symbol)(defs_js_1.ARCTAN)) {
        return (0, defs_js_1.cadr)(p1);
    }
    if ((0, defs_js_1.isdouble)(p1)) {
        let d = Math.tan(p1.d);
        if (Math.abs(d) < 1e-10) {
            d = 0.0;
        }
        return (0, bignum_js_1.double)(d);
    }
    // tan function is antisymmetric, tan(-x) = -tan(x)
    if ((0, is_js_1.isnegative)(p1)) {
        return (0, multiply_js_1.negate)(tangent((0, multiply_js_1.negate)(p1)));
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
        return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.TAN), p1);
    }
    switch (n % 360) {
        case 0:
        case 180:
            return defs_js_1.Constants.zero;
        case 30:
        case 210:
            return (0, multiply_js_1.multiply)((0, bignum_js_1.rational)(1, 3), (0, power_js_1.power)((0, bignum_js_1.integer)(3), (0, bignum_js_1.rational)(1, 2)));
        case 150:
        case 330:
            return (0, multiply_js_1.multiply)((0, bignum_js_1.rational)(-1, 3), (0, power_js_1.power)((0, bignum_js_1.integer)(3), (0, bignum_js_1.rational)(1, 2)));
        case 45:
        case 225:
            return defs_js_1.Constants.one;
        case 135:
        case 315:
            return defs_js_1.Constants.negOne;
        case 60:
        case 240:
            return (0, power_js_1.power)((0, bignum_js_1.integer)(3), (0, bignum_js_1.rational)(1, 2));
        case 120:
        case 300:
            return (0, multiply_js_1.negate)((0, power_js_1.power)((0, bignum_js_1.integer)(3), (0, bignum_js_1.rational)(1, 2)));
        default:
            return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.TAN), p1);
    }
}
