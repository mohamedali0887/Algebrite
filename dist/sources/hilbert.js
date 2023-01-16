"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hilbert = void 0;
const defs_js_1 = require("../runtime/defs.js");
const misc_js_1 = require("../sources/misc.js");
const bignum_js_1 = require("./bignum.js");
const list_js_1 = require("./list.js");
const multiply_js_1 = require("./multiply.js");
const symbol_js_1 = require("../runtime/symbol.js");
//-----------------------------------------------------------------------------
//
//  Create a Hilbert matrix
//
//  Input:    Dimension
//
//  Output:    Hilbert matrix
//
//  Example:
//
//  > hilbert(5)
//  ((1,1/2,1/3,1/4),(1/2,1/3,1/4,1/5),(1/3,1/4,1/5,1/6),(1/4,1/5,1/6,1/7))
//
//-----------------------------------------------------------------------------
//define AELEM(i, j) A->u.tensor->elem[i * n + j]
function hilbert(N) {
    const n = (0, bignum_js_1.nativeInt)(N);
    if (n < 2) {
        return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.HILBERT), N);
    }
    const A = (0, misc_js_1.zero_matrix)(n, n);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            A.tensor.elem[i * n + j] = (0, multiply_js_1.inverse)((0, bignum_js_1.integer)(i + j + 1));
        }
    }
    return A;
}
exports.hilbert = hilbert;
