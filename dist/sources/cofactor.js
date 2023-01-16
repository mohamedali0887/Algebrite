"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cofactor = exports.Eval_cofactor = void 0;
const defs_js_1 = require("../runtime/defs.js");
const run_js_1 = require("../runtime/run.js");
const det_js_1 = require("./det.js");
const eval_js_1 = require("./eval.js");
const multiply_js_1 = require("./multiply.js");
const tensor_js_1 = require("./tensor.js");
/* cofactor =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
m,i,j

General description
-------------------
Cofactor of a matrix component.
Let c be the cofactor matrix of matrix m, i.e. tranpose(c) = adj(m).
This function returns c[i,j].

*/
function Eval_cofactor(p1) {
    const p2 = (0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1));
    if (!(0, tensor_js_1.is_square_matrix)(p2)) {
        (0, run_js_1.stop)('cofactor: 1st arg: square matrix expected');
    }
    const n = p2.tensor.dim[0];
    const i = (0, eval_js_1.evaluate_integer)((0, defs_js_1.caddr)(p1));
    if (i < 1 || i > n) {
        (0, run_js_1.stop)('cofactor: 2nd arg: row index expected');
    }
    const j = (0, eval_js_1.evaluate_integer)((0, defs_js_1.cadddr)(p1));
    if (j < 1 || j > n) {
        (0, run_js_1.stop)('cofactor: 3rd arg: column index expected');
    }
    return cofactor(p2, n, i - 1, j - 1);
}
exports.Eval_cofactor = Eval_cofactor;
function cofactor(p, n, row, col) {
    const elements = [];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i !== row && j !== col) {
                elements.push(p.tensor.elem[n * i + j]);
            }
        }
    }
    let result = (0, det_js_1.determinant)(elements, n - 1);
    if ((row + col) % 2) {
        result = (0, multiply_js_1.negate)(result);
    }
    return result;
}
exports.cofactor = cofactor;
