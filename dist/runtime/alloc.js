"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alloc_tensor = void 0;
const tensor_js_1 = require("../sources/tensor.js");
const defs_js_1 = require("./defs.js");
function alloc_tensor(nelem) {
    const p = new defs_js_1.Tensor();
    for (let i = 0; i < nelem; i++) {
        p.tensor.elem[i] = defs_js_1.Constants.zero;
    }
    (0, tensor_js_1.check_tensor_dimensions)(p);
    return p;
}
exports.alloc_tensor = alloc_tensor;
