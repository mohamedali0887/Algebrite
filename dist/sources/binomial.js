"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_binomial = void 0;
const defs_js_1 = require("../runtime/defs.js");
const misc_js_1 = require("../sources/misc.js");
const add_js_1 = require("./add.js");
const eval_js_1 = require("./eval.js");
const factorial_js_1 = require("./factorial.js");
const multiply_js_1 = require("./multiply.js");
//  Binomial coefficient
//
//  Input:    tos-2    n
//
//      tos-1    k
//
//  Output:    Binomial coefficient on stack
//
//  binomial(n, k) = n! / k! / (n - k)!
//
//  The binomial coefficient vanishes for k < 0 or k > n. (A=B, p. 19)
function Eval_binomial(p1) {
    const N = (0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1));
    const K = (0, eval_js_1.Eval)((0, defs_js_1.caddr)(p1));
    return binomial(N, K);
}
exports.Eval_binomial = Eval_binomial;
function binomial(N, K) {
    return ybinomial(N, K);
}
function ybinomial(N, K) {
    if (!BINOM_check_args(N, K)) {
        return defs_js_1.Constants.zero;
    }
    return (0, multiply_js_1.divide)((0, multiply_js_1.divide)((0, factorial_js_1.factorial)(N), (0, factorial_js_1.factorial)(K)), (0, factorial_js_1.factorial)((0, add_js_1.subtract)(N, K)));
}
function BINOM_check_args(N, K) {
    if ((0, defs_js_1.isNumericAtom)(N) && (0, misc_js_1.lessp)(N, defs_js_1.Constants.zero)) {
        return false;
    }
    else if ((0, defs_js_1.isNumericAtom)(K) && (0, misc_js_1.lessp)(K, defs_js_1.Constants.zero)) {
        return false;
    }
    else if ((0, defs_js_1.isNumericAtom)(N) && (0, defs_js_1.isNumericAtom)(K) && (0, misc_js_1.lessp)(N, K)) {
        return false;
    }
    else {
        return true;
    }
}
