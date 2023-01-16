"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rationalize = exports.Eval_rationalize = void 0;
const defs_js_1 = require("../runtime/defs.js");
const add_js_1 = require("./add.js");
const condense_js_1 = require("./condense.js");
const eval_js_1 = require("./eval.js");
const gcd_js_1 = require("./gcd.js");
const is_js_1 = require("./is.js");
const multiply_js_1 = require("./multiply.js");
const tensor_js_1 = require("./tensor.js");
function Eval_rationalize(p1) {
    return rationalize((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_rationalize = Eval_rationalize;
function rationalize(p) {
    const prev_expanding = defs_js_1.defs.expanding;
    const result = yyrationalize(p);
    defs_js_1.defs.expanding = prev_expanding;
    return result;
}
exports.rationalize = rationalize;
function yyrationalize(arg) {
    if ((0, defs_js_1.istensor)(arg)) {
        return __rationalize_tensor(arg);
    }
    defs_js_1.defs.expanding = false;
    if (!(0, defs_js_1.isadd)(arg)) {
        return arg;
    }
    // get common denominator
    const commonDenominator = multiply_denominators(arg);
    // multiply each term by common denominator
    let temp = defs_js_1.Constants.zero;
    if ((0, defs_js_1.iscons)(arg)) {
        temp = arg
            .tail()
            .reduce((acc, term) => (0, add_js_1.add)(acc, (0, multiply_js_1.multiply)(commonDenominator, term)), temp);
    }
    // collect common factors
    // divide by common denominator
    return (0, multiply_js_1.divide)((0, condense_js_1.Condense)(temp), commonDenominator);
}
function multiply_denominators(p) {
    if ((0, defs_js_1.isadd)(p)) {
        return p
            .tail()
            .reduce((acc, el) => multiply_denominators_term(el, acc), defs_js_1.Constants.one);
    }
    return multiply_denominators_term(p, defs_js_1.Constants.one);
}
function multiply_denominators_term(p, p2) {
    if ((0, defs_js_1.ismultiply)(p)) {
        return p
            .tail()
            .reduce((acc, el) => multiply_denominators_factor(el, acc), p2);
    }
    return multiply_denominators_factor(p, p2);
}
function multiply_denominators_factor(p, p2) {
    if (!(0, defs_js_1.ispower)(p)) {
        return p2;
    }
    const arg2 = p;
    p = (0, defs_js_1.caddr)(p);
    // like x^(-2) ?
    if ((0, is_js_1.isnegativenumber)(p)) {
        return __lcm(p2, (0, multiply_js_1.inverse)(arg2));
    }
    // like x^(-a) ?
    if ((0, defs_js_1.ismultiply)(p) && (0, is_js_1.isnegativenumber)((0, defs_js_1.cadr)(p))) {
        return __lcm(p2, (0, multiply_js_1.inverse)(arg2));
    }
    // no match
    return p2;
}
function __rationalize_tensor(p1) {
    p1 = (0, eval_js_1.Eval)(p1); // makes a copy
    if (!(0, defs_js_1.istensor)(p1)) {
        // might be zero
        return p1;
    }
    p1.tensor.elem = p1.tensor.elem.map(rationalize);
    (0, tensor_js_1.check_tensor_dimensions)(p1);
    return p1;
}
function __lcm(p1, p2) {
    return (0, multiply_js_1.divide)((0, multiply_js_1.multiply)(p1, p2), (0, gcd_js_1.gcd)(p1, p2));
}
