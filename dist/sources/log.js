"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logarithm = exports.Eval_log = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const denominator_js_1 = require("./denominator.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const multiply_js_1 = require("./multiply.js");
const numerator_js_1 = require("./numerator.js");
// Natural logarithm.
//
// Note that we use the mathematics / Javascript / Mathematica
// convention that "log" is indeed the natural logarithm.
//
// In engineering, biology, astronomy, "log" can stand instead
// for the "common" logarithm i.e. base 10. Also note that Google
// calculations use log for the common logarithm.
function Eval_log(p1) {
    return logarithm((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_log = Eval_log;
function logarithm(p1) {
    if (p1 === (0, symbol_js_1.symbol)(defs_js_1.E)) {
        return defs_js_1.Constants.one;
    }
    if ((0, is_js_1.equaln)(p1, 1)) {
        return defs_js_1.Constants.zero;
    }
    if ((0, is_js_1.isnegativenumber)(p1)) {
        return (0, add_js_1.add)(logarithm((0, multiply_js_1.negate)(p1)), (0, multiply_js_1.multiply)(defs_js_1.Constants.imaginaryunit, defs_js_1.Constants.Pi()));
    }
    if ((0, defs_js_1.isdouble)(p1)) {
        return (0, bignum_js_1.double)(Math.log(p1.d));
    }
    // rational number and not an integer?
    if ((0, is_js_1.isfraction)(p1)) {
        return (0, add_js_1.subtract)(logarithm((0, numerator_js_1.numerator)(p1)), logarithm((0, denominator_js_1.denominator)(p1)));
    }
    // log(a ^ b) --> b log(a)
    if ((0, defs_js_1.ispower)(p1)) {
        return (0, multiply_js_1.multiply)((0, defs_js_1.caddr)(p1), logarithm((0, defs_js_1.cadr)(p1)));
    }
    // log(a * b) --> log(a) + log(b)
    if ((0, defs_js_1.ismultiply)(p1)) {
        return p1.tail().map(logarithm).reduce(add_js_1.add, defs_js_1.Constants.zero);
    }
    return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.LOG), p1);
}
exports.logarithm = logarithm;
