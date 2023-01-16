"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_isprime = void 0;
const defs_js_1 = require("../runtime/defs.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
const mprime_js_1 = require("./mprime.js");
function Eval_isprime(p1) {
    return isprime((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_isprime = Eval_isprime;
function isprime(p1) {
    if ((0, is_js_1.isnonnegativeinteger)(p1) && (0, mprime_js_1.mprime)(p1.q.a)) {
        return defs_js_1.Constants.one;
    }
    return defs_js_1.Constants.zero;
}
