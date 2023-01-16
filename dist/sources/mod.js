"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_mod = void 0;
const defs_js_1 = require("../runtime/defs.js");
const run_js_1 = require("../runtime/run.js");
const symbol_js_1 = require("../runtime/symbol.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const mmul_js_1 = require("./mmul.js");
function Eval_mod(p1) {
    const arg1 = (0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1));
    let arg2 = (0, eval_js_1.Eval)((0, defs_js_1.caddr)(p1));
    return mod(arg1, arg2);
}
exports.Eval_mod = Eval_mod;
function mod(p1, p2) {
    if ((0, is_js_1.isZeroAtomOrTensor)(p2)) {
        (0, run_js_1.stop)('mod function: divide by zero');
    }
    if (!(0, defs_js_1.isNumericAtom)(p1) || !(0, defs_js_1.isNumericAtom)(p2)) {
        return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.MOD), p1, p2);
    }
    if ((0, defs_js_1.isdouble)(p1)) {
        const n = (0, bignum_js_1.nativeInt)(p1);
        if (isNaN(n)) {
            (0, run_js_1.stop)('mod function: cannot convert float value to integer');
        }
        p1 = (0, bignum_js_1.integer)(n);
    }
    if ((0, defs_js_1.isdouble)(p2)) {
        const n = (0, bignum_js_1.nativeInt)(p2);
        if (isNaN(n)) {
            (0, run_js_1.stop)('mod function: cannot convert float value to integer');
        }
        p2 = (0, bignum_js_1.integer)(n);
    }
    if (!(0, is_js_1.isinteger)(p1) || !(0, is_js_1.isinteger)(p2)) {
        (0, run_js_1.stop)('mod function: integer arguments expected');
    }
    return new defs_js_1.Num((0, mmul_js_1.mmod)(p1.q.a, p2.q.a));
}
