"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_floor = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const mmul_js_1 = require("./mmul.js");
function Eval_floor(p1) {
    return yfloor((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_floor = Eval_floor;
function yfloor(p1) {
    return yyfloor(p1);
}
function yyfloor(p1) {
    if (!(0, defs_js_1.isNumericAtom)(p1)) {
        return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.FLOOR), p1);
    }
    if ((0, defs_js_1.isdouble)(p1)) {
        return (0, bignum_js_1.double)(Math.floor(p1.d));
    }
    if ((0, is_js_1.isinteger)(p1)) {
        return p1;
    }
    let p3 = new defs_js_1.Num((0, mmul_js_1.mdiv)(p1.q.a, p1.q.b));
    if ((0, is_js_1.isnegativenumber)(p1)) {
        p3 = (0, add_js_1.add)(p3, defs_js_1.Constants.negOne);
    }
    return p3;
}
