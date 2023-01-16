"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sgn = exports.Eval_sgn = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const abs_js_1 = require("./abs.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const mmul_js_1 = require("./mmul.js");
const multiply_js_1 = require("./multiply.js");
const power_js_1 = require("./power.js");
//-----------------------------------------------------------------------------
//
//  Author : philippe.billet@noos.fr
//
//  sgn sign function
//
//
//-----------------------------------------------------------------------------
function Eval_sgn(p1) {
    return sgn((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_sgn = Eval_sgn;
function sgn(X) {
    if ((0, defs_js_1.isdouble)(X)) {
        if (X.d > 0) {
            return defs_js_1.Constants.one;
        }
        if (X.d === 0) {
            return defs_js_1.Constants.one;
        }
        return defs_js_1.Constants.negOne;
    }
    if ((0, defs_js_1.isrational)(X)) {
        if ((0, defs_js_1.MSIGN)((0, mmul_js_1.mmul)(X.q.a, X.q.b)) === -1) {
            return defs_js_1.Constants.negOne;
        }
        if ((0, defs_js_1.MZERO)((0, mmul_js_1.mmul)(X.q.a, X.q.b))) {
            return defs_js_1.Constants.zero;
        }
        return defs_js_1.Constants.one;
    }
    if ((0, is_js_1.iscomplexnumber)(X)) {
        return (0, multiply_js_1.multiply)((0, power_js_1.power)(defs_js_1.Constants.negOne, (0, abs_js_1.absval)(X)), X);
    }
    if ((0, is_js_1.isnegativeterm)(X)) {
        return (0, multiply_js_1.multiply)((0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.SGN), (0, multiply_js_1.negate)(X)), defs_js_1.Constants.negOne);
    }
    return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.SGN), X);
}
exports.sgn = sgn;
