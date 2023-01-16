"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_shape = void 0;
const alloc_js_1 = require("../runtime/alloc.js");
const defs_js_1 = require("../runtime/defs.js");
const run_js_1 = require("../runtime/run.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
// shape of tensor
function Eval_shape(p1) {
    const result = shape((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
    return result;
}
exports.Eval_shape = Eval_shape;
function shape(p1) {
    if (!(0, defs_js_1.istensor)(p1)) {
        if (!(0, is_js_1.isZeroAtomOrTensor)(p1)) {
            (0, run_js_1.stop)('transpose: tensor expected, 1st arg is not a tensor');
        }
        return defs_js_1.Constants.zero;
    }
    let { ndim } = p1.tensor;
    const p2 = (0, alloc_js_1.alloc_tensor)(ndim);
    p2.tensor.ndim = 1;
    p2.tensor.dim[0] = ndim;
    for (let i = 0; i < ndim; i++) {
        p2.tensor.elem[i] = (0, bignum_js_1.integer)(p1.tensor.dim[i]);
    }
    return p2;
}
