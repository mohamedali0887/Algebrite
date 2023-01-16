"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lcm = exports.Eval_lcm = void 0;
const defs_js_1 = require("../runtime/defs.js");
const eval_js_1 = require("./eval.js");
const gcd_js_1 = require("./gcd.js");
const multiply_js_1 = require("./multiply.js");
// Find the least common multiple of two expressions.
function Eval_lcm(p1) {
    p1 = (0, defs_js_1.cdr)(p1);
    let result = (0, eval_js_1.Eval)((0, defs_js_1.car)(p1));
    if ((0, defs_js_1.iscons)(p1)) {
        result = p1.tail().reduce((a, b) => lcm(a, (0, eval_js_1.Eval)(b)), result);
    }
    return result;
}
exports.Eval_lcm = Eval_lcm;
function lcm(p1, p2) {
    return (0, defs_js_1.doexpand)(yylcm, p1, p2);
}
exports.lcm = lcm;
function yylcm(p1, p2) {
    return (0, multiply_js_1.inverse)((0, multiply_js_1.divide)((0, multiply_js_1.divide)((0, gcd_js_1.gcd)(p1, p2), p1), p2));
}
