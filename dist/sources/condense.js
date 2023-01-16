"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yycondense = exports.Condense = exports.Eval_condense = void 0;
const defs_js_1 = require("../runtime/defs.js");
const misc_js_1 = require("../sources/misc.js");
const add_js_1 = require("./add.js");
const eval_js_1 = require("./eval.js");
const gcd_js_1 = require("./gcd.js");
const multiply_js_1 = require("./multiply.js");
// Condense an expression by factoring common terms.
function Eval_condense(p1) {
    return Condense((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_condense = Eval_condense;
function Condense(p1) {
    return (0, defs_js_1.noexpand)(yycondense, p1);
}
exports.Condense = Condense;
function yycondense(p1) {
    //expanding = 0
    if (!(0, defs_js_1.isadd)(p1)) {
        return p1;
    }
    // get gcd of all terms
    const termsGCD = p1.tail().reduce(gcd_js_1.gcd);
    //console.log "condense: this is the gcd of all the terms: " + stack[tos - 1]
    // divide each term by gcd
    const p2 = (0, multiply_js_1.inverse)(termsGCD);
    const temp2 = p1
        .tail()
        .reduce((a, b) => (0, add_js_1.add)(a, (0, multiply_js_1.multiply_noexpand)(p2, b)), defs_js_1.Constants.zero);
    // We multiplied above w/o expanding so some factors cancelled.
    // Now we expand which normalizes the result and, in some cases,
    // simplifies it too (see test case H).
    const arg1 = (0, misc_js_1.yyexpand)(temp2);
    // multiply result by gcd
    return (0, multiply_js_1.divide)(arg1, p2);
}
exports.yycondense = yycondense;
