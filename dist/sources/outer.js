"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_outer = void 0;
const alloc_js_1 = require("../runtime/alloc.js");
const defs_js_1 = require("../runtime/defs.js");
const run_js_1 = require("../runtime/run.js");
const eval_js_1 = require("./eval.js");
const multiply_js_1 = require("./multiply.js");
const tensor_js_1 = require("./tensor.js");
// Outer product of tensors
function Eval_outer(p1) {
    p1 = (0, defs_js_1.cdr)(p1);
    let temp = (0, eval_js_1.Eval)((0, defs_js_1.car)(p1));
    const result = (0, defs_js_1.iscons)(p1)
        ? p1.tail().reduce((acc, p) => outer(acc, (0, eval_js_1.Eval)(p)), temp)
        : temp;
    return result;
}
exports.Eval_outer = Eval_outer;
function outer(p1, p2) {
    if ((0, defs_js_1.istensor)(p1) && (0, defs_js_1.istensor)(p2)) {
        return yyouter(p1, p2);
    }
    if ((0, defs_js_1.istensor)(p1)) {
        return (0, tensor_js_1.tensor_times_scalar)(p1, p2);
    }
    if ((0, defs_js_1.istensor)(p2)) {
        return (0, tensor_js_1.scalar_times_tensor)(p1, p2);
    }
    return (0, multiply_js_1.multiply)(p1, p2);
}
function yyouter(p1, p2) {
    const ndim = p1.tensor.ndim + p2.tensor.ndim;
    if (ndim > defs_js_1.MAXDIM) {
        (0, run_js_1.stop)('outer: rank of result exceeds maximum');
    }
    const nelem = p1.tensor.nelem * p2.tensor.nelem;
    const p3 = (0, alloc_js_1.alloc_tensor)(nelem);
    p3.tensor.ndim = ndim;
    p3.tensor.dim = [...p1.tensor.dim, ...p2.tensor.dim];
    let k = 0;
    for (let i = 0; i < p1.tensor.nelem; i++) {
        for (let j = 0; j < p2.tensor.nelem; j++) {
            p3.tensor.elem[k++] = (0, multiply_js_1.multiply)(p1.tensor.elem[i], p2.tensor.elem[j]);
        }
    }
    return p3;
}
