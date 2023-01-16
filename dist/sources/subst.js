"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subst = void 0;
const alloc_js_1 = require("../runtime/alloc.js");
const defs_js_1 = require("../runtime/defs.js");
const misc_js_1 = require("../sources/misc.js");
const tensor_js_1 = require("./tensor.js");
const symbol_js_1 = require("../runtime/symbol.js");
/*
  Substitute new expr for old expr in expr.

  Input:  expr     expr
          oldExpr  old expr
          newExpr  new expr

  Output:  Result
*/
function subst(expr, oldExpr, newExpr) {
    if (oldExpr === (0, symbol_js_1.symbol)(defs_js_1.NIL) || newExpr === (0, symbol_js_1.symbol)(defs_js_1.NIL)) {
        return expr;
    }
    if ((0, defs_js_1.istensor)(expr)) {
        const p4 = (0, alloc_js_1.alloc_tensor)(expr.tensor.nelem);
        p4.tensor.ndim = expr.tensor.ndim;
        p4.tensor.dim = Array.from(expr.tensor.dim);
        p4.tensor.elem = expr.tensor.elem.map((el) => {
            const result = subst(el, oldExpr, newExpr);
            (0, tensor_js_1.check_tensor_dimensions)(p4);
            return result;
        });
        return p4;
    }
    if ((0, misc_js_1.equal)(expr, oldExpr)) {
        return newExpr;
    }
    if ((0, defs_js_1.iscons)(expr)) {
        return new defs_js_1.Cons(subst((0, defs_js_1.car)(expr), oldExpr, newExpr), subst((0, defs_js_1.cdr)(expr), oldExpr, newExpr));
    }
    return expr;
}
exports.subst = subst;
