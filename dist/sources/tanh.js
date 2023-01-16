"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_tanh = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
//             exp(2 x) - 1
//  tanh(x) = --------------
//             exp(2 x) + 1
function Eval_tanh(p1) {
    return tanh((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_tanh = Eval_tanh;
function tanh(p1) {
    if ((0, defs_js_1.car)(p1) === (0, symbol_js_1.symbol)(defs_js_1.ARCTANH)) {
        return (0, defs_js_1.cadr)(p1);
    }
    if ((0, defs_js_1.isdouble)(p1)) {
        let d = Math.tanh(p1.d);
        if (Math.abs(d) < 1e-10) {
            d = 0.0;
        }
        return (0, bignum_js_1.double)(d);
    }
    if ((0, is_js_1.isZeroAtomOrTensor)(p1)) {
        return defs_js_1.Constants.zero;
    }
    return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.TANH), p1);
}
