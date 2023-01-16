"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.erfc = exports.Eval_erfc = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
//-----------------------------------------------------------------------------
//
//  Author : philippe.billet@noos.fr
//
//  erfc(x)
//
//  GW  Added erfc() from Numerical Recipes in C
//
//-----------------------------------------------------------------------------
function Eval_erfc(p1) {
    return yerfc((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_erfc = Eval_erfc;
function yerfc(p1) {
    if ((0, defs_js_1.isdouble)(p1)) {
        const d = erfc(p1.d);
        return (0, bignum_js_1.double)(d);
    }
    if ((0, is_js_1.isZeroAtomOrTensor)(p1)) {
        return defs_js_1.Constants.one;
    }
    return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.ERFC), p1);
}
// from Numerical Recipes in C
function erfc(x) {
    if (x === 0) {
        return 1.0;
    }
    const z = Math.abs(x);
    const t = 1.0 / (1.0 + 0.5 * z);
    const ans = t *
        Math.exp(-z * z -
            1.26551223 +
            t *
                (1.00002368 +
                    t *
                        (0.37409196 +
                            t *
                                (0.09678418 +
                                    t *
                                        (-0.18628806 +
                                            t *
                                                (0.27886807 +
                                                    t *
                                                        (-1.13520398 +
                                                            t *
                                                                (1.48851587 +
                                                                    t * (-0.82215223 + t * 0.17087277)))))))));
    if (x >= 0.0) {
        return ans;
    }
    return 2.0 - ans;
}
exports.erfc = erfc;
