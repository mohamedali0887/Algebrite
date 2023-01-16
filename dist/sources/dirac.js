"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dirac = exports.Eval_dirac = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const mmul_js_1 = require("./mmul.js");
const multiply_js_1 = require("./multiply.js");
//-----------------------------------------------------------------------------
//
//  Author : philippe.billet@noos.fr
//
//  Dirac function dirac(x)
//  dirac(-x)=dirac(x)
//  dirac(b-a)=dirac(a-b)
//-----------------------------------------------------------------------------
function Eval_dirac(p1) {
    return dirac((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_dirac = Eval_dirac;
function dirac(p1) {
    return ydirac(p1);
}
exports.dirac = dirac;
function ydirac(p1) {
    if ((0, defs_js_1.isdouble)(p1)) {
        if (p1.d === 0) {
            return defs_js_1.Constants.one;
        }
        return defs_js_1.Constants.zero;
    }
    if ((0, defs_js_1.isrational)(p1)) {
        if ((0, defs_js_1.MZERO)((0, mmul_js_1.mmul)(p1.q.a, p1.q.b))) {
            return defs_js_1.Constants.one;
        }
        return defs_js_1.Constants.zero;
    }
    if ((0, defs_js_1.ispower)(p1)) {
        return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.DIRAC), (0, defs_js_1.cadr)(p1));
    }
    if ((0, is_js_1.isnegativeterm)(p1)) {
        return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.DIRAC), (0, multiply_js_1.negate)(p1));
    }
    if ((0, is_js_1.isnegativeterm)(p1) || ((0, defs_js_1.isadd)(p1) && (0, is_js_1.isnegativeterm)((0, defs_js_1.cadr)(p1)))) {
        p1 = (0, multiply_js_1.negate)(p1);
    }
    return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.DIRAC), p1);
}
