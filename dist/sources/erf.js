"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_erf = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const bignum_js_1 = require("./bignum.js");
const erfc_js_1 = require("./erfc.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const multiply_js_1 = require("./multiply.js");
/* erf =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Authors
-------
philippe.billet@noos.fr

Parameters
----------
x

General description
-------------------
Error function erf(x).
erf(-x)=erf(x)

*/
function Eval_erf(p1) {
    return yerf((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_erf = Eval_erf;
function yerf(p1) {
    if ((0, defs_js_1.isdouble)(p1)) {
        return (0, bignum_js_1.double)(1.0 - (0, erfc_js_1.erfc)(p1.d));
    }
    if ((0, is_js_1.isZeroAtomOrTensor)(p1)) {
        return defs_js_1.Constants.zero;
    }
    if ((0, is_js_1.isnegativeterm)(p1)) {
        return (0, multiply_js_1.negate)((0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.ERF), (0, multiply_js_1.negate)(p1)));
    }
    return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.ERF), p1);
}
