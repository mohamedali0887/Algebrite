"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_round = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const float_js_1 = require("./float.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
function Eval_round(p1) {
    return yround((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_round = Eval_round;
function yround(p1) {
    if (!(0, defs_js_1.isNumericAtom)(p1)) {
        return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.ROUND), p1);
    }
    if ((0, defs_js_1.isdouble)(p1)) {
        return (0, bignum_js_1.double)(Math.round(p1.d));
    }
    if ((0, is_js_1.isinteger)(p1)) {
        return p1;
    }
    p1 = (0, float_js_1.yyfloat)(p1);
    return (0, bignum_js_1.integer)(Math.round(p1.d));
}
