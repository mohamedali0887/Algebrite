"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ysinh = exports.Eval_sinh = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
//            exp(x) - exp(-x)
//  sinh(x) = ----------------
//                   2
function Eval_sinh(p1) {
    return ysinh((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_sinh = Eval_sinh;
function ysinh(p1) {
    if ((0, defs_js_1.car)(p1) === (0, symbol_js_1.symbol)(defs_js_1.ARCSINH)) {
        return (0, defs_js_1.cadr)(p1);
    }
    if ((0, defs_js_1.isdouble)(p1)) {
        let d = Math.sinh(p1.d);
        if (Math.abs(d) < 1e-10) {
            d = 0.0;
        }
        return (0, bignum_js_1.double)(d);
    }
    if ((0, is_js_1.isZeroAtomOrTensor)(p1)) {
        return defs_js_1.Constants.zero;
    }
    return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.SINH), p1);
}
exports.ysinh = ysinh;
