"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_defint = void 0;
const defs_js_1 = require("../runtime/defs.js");
const add_js_1 = require("./add.js");
const eval_js_1 = require("./eval.js");
const integral_js_1 = require("./integral.js");
const subst_js_1 = require("./subst.js");
/* defint =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
f,x,a,b[,y,c,d...]

General description
-------------------
Returns the definite integral of f with respect to x evaluated from "a" to b.
The argument list can be extended for multiple integrals (or "iterated
integrals"), for example a double integral (which can represent for
example a volume under a surface), or a triple integral, etc. For
example, defint(f,x,a,b,y,c,d).

*/
function Eval_defint(p1) {
    let F = (0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1));
    p1 = (0, defs_js_1.cddr)(p1);
    // defint can handle multiple
    // integrals, so we loop over the
    // multiple integrals here
    while ((0, defs_js_1.iscons)(p1)) {
        const X = (0, eval_js_1.Eval)((0, defs_js_1.car)(p1));
        p1 = (0, defs_js_1.cdr)(p1);
        const A = (0, eval_js_1.Eval)((0, defs_js_1.car)(p1));
        p1 = (0, defs_js_1.cdr)(p1);
        const B = (0, eval_js_1.Eval)((0, defs_js_1.car)(p1));
        p1 = (0, defs_js_1.cdr)(p1);
        // obtain the primitive of F against the
        // specified variable X
        // note that the primitive changes over
        // the calculation of the multiple
        // integrals.
        F = (0, integral_js_1.integral)(F, X); // contains the antiderivative of F
        // evaluate the integral in A
        const arg1 = (0, eval_js_1.Eval)((0, subst_js_1.subst)(F, X, B));
        // evaluate the integral in B
        const arg2 = (0, eval_js_1.Eval)((0, subst_js_1.subst)(F, X, A));
        // integral between B and A is the
        // subtraction. Note that this could
        // be a number but also a function.
        // and we might have to integrate this
        // number/function again doing the while
        // loop again if this is a multiple
        // integral.
        F = (0, add_js_1.subtract)(arg1, arg2);
    }
    return F;
}
exports.Eval_defint = Eval_defint;
