"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_leading = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const degree_js_1 = require("./degree.js");
const eval_js_1 = require("./eval.js");
const filter_js_1 = require("./filter.js");
const guess_js_1 = require("./guess.js");
const multiply_js_1 = require("./multiply.js");
const power_js_1 = require("./power.js");
/*
 Return the leading coefficient of a polynomial.

Example

  leading(5x^2+x+1,x)

Result

  5

The result is undefined if P is not a polynomial.
*/
function Eval_leading(p1) {
    const P = (0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1));
    p1 = (0, eval_js_1.Eval)((0, defs_js_1.caddr)(p1));
    const X = p1 === (0, symbol_js_1.symbol)(defs_js_1.NIL) ? (0, guess_js_1.guess)(P) : p1;
    return leading(P, X);
}
exports.Eval_leading = Eval_leading;
function leading(P, X) {
    // N = degree of P
    const N = (0, degree_js_1.degree)(P, X);
    // divide through by X ^ N, remove terms that depend on X
    return (0, filter_js_1.filter)((0, multiply_js_1.divide)(P, (0, power_js_1.power)(X, N)), X);
}
