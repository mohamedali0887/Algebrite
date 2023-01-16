"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bessely = exports.Eval_bessely = void 0;
const defs_js_1 = require("../runtime/defs.js");
const otherCFunctions_js_1 = require("../runtime/otherCFunctions.js");
const symbol_js_1 = require("../runtime/symbol.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const multiply_js_1 = require("./multiply.js");
const power_js_1 = require("./power.js");
/* bessely =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x,n

General description
-------------------

Bessel function of second kind.

*/
function Eval_bessely(p1) {
    return bessely((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)), (0, eval_js_1.Eval)((0, defs_js_1.caddr)(p1)));
}
exports.Eval_bessely = Eval_bessely;
function bessely(p1, p2) {
    return yybessely(p1, p2);
}
exports.bessely = bessely;
function yybessely(X, N) {
    const n = (0, bignum_js_1.nativeInt)(N);
    if ((0, defs_js_1.isdouble)(X) && !isNaN(n)) {
        const d = (0, otherCFunctions_js_1.yn)(n, X.d);
        return (0, bignum_js_1.double)(d);
    }
    if ((0, is_js_1.isnegativeterm)(N)) {
        return (0, multiply_js_1.multiply)((0, power_js_1.power)(defs_js_1.Constants.negOne, N), (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.BESSELY), X, (0, multiply_js_1.negate)(N)));
    }
    return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.BESSELY), X, N);
}
