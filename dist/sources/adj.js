"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adj = exports.Eval_adj = void 0;
const alloc_js_1 = require("../runtime/alloc.js");
const defs_js_1 = require("../runtime/defs.js");
const run_js_1 = require("../runtime/run.js");
const cofactor_js_1 = require("./cofactor.js");
const eval_js_1 = require("./eval.js");
const tensor_js_1 = require("./tensor.js");
/* adj =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
m

General description
-------------------
Returns the adjunct of matrix m. The inverse of m is equal to adj(m) divided by det(m).

*/
function Eval_adj(p1) {
    return adj((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_adj = Eval_adj;
function adj(p1) {
    if (!(0, tensor_js_1.is_square_matrix)(p1)) {
        (0, run_js_1.stop)('adj: square matrix expected');
    }
    const n = p1.tensor.dim[0];
    const p2 = (0, alloc_js_1.alloc_tensor)(n * n);
    p2.tensor.ndim = 2;
    p2.tensor.dim[0] = n;
    p2.tensor.dim[1] = n;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            p2.tensor.elem[n * j + i] = (0, cofactor_js_1.cofactor)(p1, n, i, j);
        }
    } // transpose
    return p2;
}
exports.adj = adj;
