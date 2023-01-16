"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_zero = void 0;
const alloc_js_1 = require("../runtime/alloc.js");
const defs_js_1 = require("../runtime/defs.js");
const eval_js_1 = require("./eval.js");
function Eval_zero(p1) {
    const k = Array(defs_js_1.MAXDIM).fill(0);
    let m = 1;
    let n = 0;
    if ((0, defs_js_1.iscons)(p1)) {
        for (const el of p1.tail()) {
            const i = (0, eval_js_1.evaluate_integer)(el);
            if (i < 1 || isNaN(i)) {
                // if the input is nonsensical just return 0
                return defs_js_1.Constants.zero;
            }
            m *= i;
            k[n++] = i;
        }
    }
    if (n === 0) {
        return defs_js_1.Constants.zero;
    }
    p1 = (0, alloc_js_1.alloc_tensor)(m);
    p1.tensor.ndim = n;
    for (let i = 0; i < n; i++) {
        p1.tensor.dim[i] = k[i];
    }
    return p1;
}
exports.Eval_zero = Eval_zero;
