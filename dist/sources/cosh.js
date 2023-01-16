"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ycosh = exports.Eval_cosh = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
/* cosh =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------
Returns the hyperbolic cosine of x

```
            exp(x) + exp(-x)
  cosh(x) = ----------------
                   2
```

*/
function Eval_cosh(p1) {
    return ycosh((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_cosh = Eval_cosh;
function ycosh(p1) {
    if ((0, defs_js_1.car)(p1) === (0, symbol_js_1.symbol)(defs_js_1.ARCCOSH)) {
        return (0, defs_js_1.cadr)(p1);
    }
    if ((0, defs_js_1.isdouble)(p1)) {
        let d = Math.cosh(p1.d);
        if (Math.abs(d) < 1e-10) {
            d = 0.0;
        }
        return (0, bignum_js_1.double)(d);
    }
    if ((0, is_js_1.isZeroAtomOrTensor)(p1)) {
        return defs_js_1.Constants.one;
    }
    return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.COSH), p1);
}
exports.ycosh = ycosh;
