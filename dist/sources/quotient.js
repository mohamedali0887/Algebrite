"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.divpoly = exports.Eval_quotient = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const coeff_js_1 = require("./coeff.js");
const eval_js_1 = require("./eval.js");
const multiply_js_1 = require("./multiply.js");
const power_js_1 = require("./power.js");
// Divide polynomials
function Eval_quotient(p1) {
    const DIVIDEND = (0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)); // 1st arg, p(x)
    const DIVISOR = (0, eval_js_1.Eval)((0, defs_js_1.caddr)(p1)); // 2nd arg, q(x)
    let X = (0, eval_js_1.Eval)((0, defs_js_1.cadddr)(p1)); // 3rd arg, x, default x
    if (X === (0, symbol_js_1.symbol)(defs_js_1.NIL)) {
        X = (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_X);
    }
    return divpoly(DIVIDEND, DIVISOR, X);
}
exports.Eval_quotient = Eval_quotient;
//-----------------------------------------------------------------------------
//
//  Divide polynomials
//
//  Input:    Dividend
//            Divisor
//            x
//
//  Output:    Quotient
//
//-----------------------------------------------------------------------------
function divpoly(DIVIDEND, DIVISOR, X) {
    const dividendCs = (0, coeff_js_1.coeff)(DIVIDEND, X);
    let m = dividendCs.length - 1; // m is dividend's power
    const divisorCs = (0, coeff_js_1.coeff)(DIVISOR, X);
    const n = divisorCs.length - 1; // n is divisor's power
    let x = m - n;
    let QUOTIENT = defs_js_1.Constants.zero;
    while (x >= 0) {
        const Q = (0, multiply_js_1.divide)(dividendCs[m], divisorCs[n]);
        for (let i = 0; i <= n; i++) {
            dividendCs[x + i] = (0, add_js_1.subtract)(dividendCs[x + i], (0, multiply_js_1.multiply)(divisorCs[i], Q));
        }
        QUOTIENT = (0, add_js_1.add)(QUOTIENT, (0, multiply_js_1.multiply)(Q, (0, power_js_1.power)(X, (0, bignum_js_1.integer)(x))));
        m--;
        x--;
    }
    return QUOTIENT;
}
exports.divpoly = divpoly;
