"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter = exports.Eval_filter = void 0;
const alloc_js_1 = require("../runtime/alloc.js");
const defs_js_1 = require("../runtime/defs.js");
const find_js_1 = require("../runtime/find.js");
const add_js_1 = require("./add.js");
const eval_js_1 = require("./eval.js");
/*
Remove terms that involve a given symbol or expression. For example...

  filter(x^2 + x + 1, x)    =>  1

  filter(x^2 + x + 1, x^2)  =>  x + 1
*/
function Eval_filter(p1) {
    p1 = (0, defs_js_1.cdr)(p1);
    let result = (0, eval_js_1.Eval)((0, defs_js_1.car)(p1));
    if ((0, defs_js_1.iscons)(p1)) {
        result = p1.tail().reduce((acc, p) => filter(acc, (0, eval_js_1.Eval)(p)), result);
    }
    return result;
}
exports.Eval_filter = Eval_filter;
function filter(F, X) {
    return filter_main(F, X);
}
exports.filter = filter;
function filter_main(F, X) {
    if ((0, defs_js_1.isadd)(F)) {
        return filter_sum(F, X);
    }
    if ((0, defs_js_1.istensor)(F)) {
        return filter_tensor(F, X);
    }
    if ((0, find_js_1.Find)(F, X)) {
        return defs_js_1.Constants.zero;
    }
    return F;
}
function filter_sum(F, X) {
    return (0, defs_js_1.iscons)(F)
        ? F.tail().reduce((a, b) => (0, add_js_1.add)(a, filter(b, X)), defs_js_1.Constants.zero)
        : defs_js_1.Constants.zero;
}
function filter_tensor(F, X) {
    const n = F.tensor.nelem;
    const p3 = (0, alloc_js_1.alloc_tensor)(n);
    p3.tensor.ndim = F.tensor.ndim;
    p3.tensor.dim = Array.from(F.tensor.dim);
    p3.tensor.elem = F.tensor.elem.map((el) => filter(el, X));
    return p3;
}
