"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_arctanh = void 0;
const defs_js_1 = require("../runtime/defs.js");
const run_js_1 = require("../runtime/run.js");
const symbol_js_1 = require("../runtime/symbol.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
/* arctanh =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------
Returns the inverse hyperbolic tangent of x.

*/
function Eval_arctanh(x) {
    return arctanh((0, eval_js_1.Eval)((0, defs_js_1.cadr)(x)));
}
exports.Eval_arctanh = Eval_arctanh;
function arctanh(x) {
    if ((0, defs_js_1.car)(x) === (0, symbol_js_1.symbol)(defs_js_1.TANH)) {
        return (0, defs_js_1.cadr)(x);
    }
    if ((0, defs_js_1.isdouble)(x)) {
        let { d } = x;
        if (d < -1.0 || d > 1.0) {
            (0, run_js_1.stop)('arctanh function argument is not in the interval [-1,1]');
        }
        d = Math.log((1.0 + d) / (1.0 - d)) / 2.0;
        return (0, bignum_js_1.double)(d);
    }
    if ((0, is_js_1.isZeroAtomOrTensor)(x)) {
        return defs_js_1.Constants.zero;
    }
    return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.ARCTANH), x);
}
