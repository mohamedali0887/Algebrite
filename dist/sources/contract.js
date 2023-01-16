"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_contract = void 0;
const alloc_js_1 = require("../runtime/alloc.js");
const defs_js_1 = require("../runtime/defs.js");
const run_js_1 = require("../runtime/run.js");
const symbol_js_1 = require("../runtime/symbol.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
/* contract =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
a,i,j

General description
-------------------
Contract across tensor indices i.e. returns "a" summed over indices i and j.
If i and j are omitted then 1 and 2 are used.
contract(m) is equivalent to the trace of matrix m.

*/
function Eval_contract(p1) {
    const p1_prime = (0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1));
    let p2, p3;
    if ((0, defs_js_1.cddr)(p1) === (0, symbol_js_1.symbol)(defs_js_1.NIL)) {
        p2 = defs_js_1.Constants.one;
        p3 = (0, bignum_js_1.integer)(2);
    }
    else {
        p2 = (0, eval_js_1.Eval)((0, defs_js_1.caddr)(p1));
        p3 = (0, eval_js_1.Eval)((0, defs_js_1.cadddr)(p1));
    }
    return contract(p1_prime, p2, p3);
}
exports.Eval_contract = Eval_contract;
function contract(p1, p2, p3) {
    const ai = [];
    const an = [];
    if (!(0, defs_js_1.istensor)(p1)) {
        if (!(0, is_js_1.isZeroAtomOrTensor)(p1)) {
            (0, run_js_1.stop)('contract: tensor expected, 1st arg is not a tensor');
        }
        return defs_js_1.Constants.zero;
    }
    let l = (0, bignum_js_1.nativeInt)(p2);
    let m = (0, bignum_js_1.nativeInt)(p3);
    const { ndim } = p1.tensor;
    if (l < 1 ||
        l > ndim ||
        m < 1 ||
        m > ndim ||
        l === m ||
        p1.tensor.dim[l - 1] !== p1.tensor.dim[m - 1]) {
        (0, run_js_1.stop)('contract: index out of range');
    }
    l--;
    m--;
    const n = p1.tensor.dim[l];
    // nelem is the number of elements in "b"
    let nelem = 1;
    for (let i = 0; i < ndim; i++) {
        if (i !== l && i !== m) {
            nelem *= p1.tensor.dim[i];
        }
    }
    p2 = (0, alloc_js_1.alloc_tensor)(nelem);
    p2.tensor.ndim = ndim - 2;
    let j = 0;
    for (let i = 0; i < ndim; i++) {
        if (i !== l && i !== m) {
            p2.tensor.dim[j++] = p1.tensor.dim[i];
        }
    }
    const a = p1.tensor.elem;
    const b = p2.tensor.elem;
    for (let i = 0; i < ndim; i++) {
        ai[i] = 0;
        an[i] = p1.tensor.dim[i];
    }
    for (let i = 0; i < nelem; i++) {
        let temp = defs_js_1.Constants.zero;
        for (let j = 0; j < n; j++) {
            ai[l] = j;
            ai[m] = j;
            let h = 0;
            for (let k = 0; k < ndim; k++) {
                h = h * an[k] + ai[k];
            }
            //console.log "a[h]: " + a[h]
            temp = (0, add_js_1.add)(temp, a[h]);
        }
        //console.log "tos: " + stack[tos-1]
        b[i] = temp;
        //console.log "b[i]: " + b[i]
        for (let j = ndim - 1; j >= 0; j--) {
            if (j === l || j === m) {
                continue;
            }
            if (++ai[j] < an[j]) {
                break;
            }
            ai[j] = 0;
        }
    }
    if (nelem === 1) {
        return b[0];
    }
    return p2;
}
