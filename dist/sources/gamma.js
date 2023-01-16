"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_gamma = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const multiply_js_1 = require("./multiply.js");
const power_js_1 = require("./power.js");
const sin_js_1 = require("./sin.js");
//-----------------------------------------------------------------------------
//
//  Author : philippe.billet@noos.fr
//
//  Gamma function gamma(x)
//
//-----------------------------------------------------------------------------
function Eval_gamma(p1) {
    return gamma((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_gamma = Eval_gamma;
function gamma(p1) {
    return gammaf(p1);
}
function gammaf(p1) {
    if ((0, defs_js_1.isrational)(p1) && (0, defs_js_1.MEQUAL)(p1.q.a, 1) && (0, defs_js_1.MEQUAL)(p1.q.b, 2)) {
        return (0, power_js_1.power)(defs_js_1.Constants.Pi(), (0, bignum_js_1.rational)(1, 2));
    }
    if ((0, defs_js_1.isrational)(p1) && (0, defs_js_1.MEQUAL)(p1.q.a, 3) && (0, defs_js_1.MEQUAL)(p1.q.b, 2)) {
        return (0, multiply_js_1.multiply)((0, power_js_1.power)(defs_js_1.Constants.Pi(), (0, bignum_js_1.rational)(1, 2)), (0, bignum_js_1.rational)(1, 2));
    }
    //  if (p1->k == DOUBLE) {
    //    d = exp(lgamma(p1.d))
    //    push_double(d)
    //    return
    //  }
    if ((0, is_js_1.isnegativeterm)(p1)) {
        return (0, multiply_js_1.divide)((0, multiply_js_1.multiply)(defs_js_1.Constants.Pi(), defs_js_1.Constants.negOne), (0, multiply_js_1.multiply)((0, multiply_js_1.multiply)((0, sin_js_1.sine)((0, multiply_js_1.multiply)(defs_js_1.Constants.Pi(), p1)), p1), gamma((0, multiply_js_1.negate)(p1))));
    }
    if ((0, defs_js_1.isadd)(p1)) {
        return gamma_of_sum(p1);
    }
    return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.GAMMA), p1);
}
function gamma_of_sum(p1) {
    const p3 = (0, defs_js_1.cdr)(p1);
    if ((0, defs_js_1.isrational)((0, defs_js_1.car)(p3)) &&
        (0, defs_js_1.MEQUAL)((0, defs_js_1.car)(p3).q.a, 1) &&
        (0, defs_js_1.MEQUAL)((0, defs_js_1.car)(p3).q.b, 1)) {
        return (0, multiply_js_1.multiply)((0, defs_js_1.cadr)(p3), gamma((0, defs_js_1.cadr)(p3)));
    }
    if ((0, defs_js_1.isrational)((0, defs_js_1.car)(p3)) &&
        (0, defs_js_1.MEQUAL)((0, defs_js_1.car)(p3).q.a, -1) &&
        (0, defs_js_1.MEQUAL)((0, defs_js_1.car)(p3).q.b, 1)) {
        return (0, multiply_js_1.divide)(gamma((0, defs_js_1.cadr)(p3)), (0, add_js_1.add)((0, defs_js_1.cadr)(p3), defs_js_1.Constants.negOne));
    }
    return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.GAMMA), p1);
}
