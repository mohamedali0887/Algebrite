"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.denominator = exports.Eval_denominator = void 0;
const defs_js_1 = require("../runtime/defs.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
const multiply_js_1 = require("./multiply.js");
const rationalize_js_1 = require("./rationalize.js");
/* denominator =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------
Returns the denominator of expression x.

*/
function Eval_denominator(p1) {
    return denominator((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_denominator = Eval_denominator;
function denominator(p1) {
    //console.trace "denominator of: " + p1
    if ((0, defs_js_1.isadd)(p1)) {
        p1 = (0, rationalize_js_1.rationalize)(p1);
    }
    if ((0, defs_js_1.ismultiply)(p1) && !(0, is_js_1.isplusone)((0, defs_js_1.car)((0, defs_js_1.cdr)(p1)))) {
        return (0, multiply_js_1.multiply_all)(p1.tail().map(denominator));
    }
    if ((0, defs_js_1.isrational)(p1)) {
        return (0, bignum_js_1.mp_denominator)(p1);
    }
    if ((0, defs_js_1.ispower)(p1) && (0, is_js_1.isnegativeterm)((0, defs_js_1.caddr)(p1))) {
        return (0, multiply_js_1.reciprocate)(p1);
    }
    return defs_js_1.Constants.one;
}
exports.denominator = denominator;
