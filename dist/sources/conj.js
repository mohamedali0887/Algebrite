"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conjugate = exports.Eval_conj = void 0;
const defs_js_1 = require("../runtime/defs.js");
const find_js_1 = require("../runtime/find.js");
const clock_js_1 = require("./clock.js");
const eval_js_1 = require("./eval.js");
const multiply_js_1 = require("./multiply.js");
const polar_js_1 = require("./polar.js");
const subst_js_1 = require("./subst.js");
/* conj =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
z

General description
-------------------
Returns the complex conjugate of z.

*/
function Eval_conj(p1) {
    p1 = (0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1));
    if (!(0, find_js_1.Find)(p1, defs_js_1.Constants.imaginaryunit)) {
        // example: (-1)^(1/3)
        return (0, clock_js_1.clockform)(conjugate((0, polar_js_1.polar)(p1)));
    }
    else {
        return conjugate(p1);
    }
}
exports.Eval_conj = Eval_conj;
// careful is you pass this one an expression with
// i (instead of (-1)^(1/2)) then this doesn't work!
function conjugate(p1) {
    return (0, eval_js_1.Eval)((0, subst_js_1.subst)(p1, defs_js_1.Constants.imaginaryunit, (0, multiply_js_1.negate)(defs_js_1.Constants.imaginaryunit)));
}
exports.conjugate = conjugate;
