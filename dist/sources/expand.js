"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_expand = void 0;
const alloc_js_1 = require("../runtime/alloc.js");
const defs_js_1 = require("../runtime/defs.js");
const find_js_1 = require("../runtime/find.js");
const symbol_js_1 = require("../runtime/symbol.js");
const misc_js_1 = require("../sources/misc.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const degree_js_1 = require("./degree.js");
const denominator_js_1 = require("./denominator.js");
const eval_js_1 = require("./eval.js");
const factorpoly_js_1 = require("./factorpoly.js");
const factors_js_1 = require("./factors.js");
const filter_js_1 = require("./filter.js");
const guess_js_1 = require("./guess.js");
const inner_js_1 = require("./inner.js");
const inv_js_1 = require("./inv.js");
const is_js_1 = require("./is.js");
const multiply_js_1 = require("./multiply.js");
const numerator_js_1 = require("./numerator.js");
const power_js_1 = require("./power.js");
const quotient_js_1 = require("./quotient.js");
const tensor_js_1 = require("./tensor.js");
// Partial fraction expansion
//
// Example
//
//      expand(1/(x^3+x^2),x)
//
//        1      1       1
//      ---- - --- + -------
//        2     x     x + 1
//       x
function Eval_expand(p1) {
    const F = (0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1));
    const p2 = (0, eval_js_1.Eval)((0, defs_js_1.caddr)(p1));
    const X = p2 === (0, symbol_js_1.symbol)(defs_js_1.NIL) ? (0, guess_js_1.guess)(F) : p2;
    return expand(F, X);
}
exports.Eval_expand = Eval_expand;
//define A p2
//define B p3
//define C p4
//define F p5
//define P p6
//define Q p7
//define T p8
//define X p9
function expand(F, X) {
    if ((0, defs_js_1.istensor)(F)) {
        return expand_tensor(F, X);
    }
    // if sum of terms then sum over the expansion of each term
    if ((0, defs_js_1.isadd)(F)) {
        return F.tail().reduce((a, b) => (0, add_js_1.add)(a, expand(b, X)), defs_js_1.Constants.zero);
    }
    let B = (0, numerator_js_1.numerator)(F);
    let A = (0, denominator_js_1.denominator)(F);
    [A, B] = remove_negative_exponents(A, B, X);
    // if the denominator is one then always bail out
    // also bail out if the denominator is not one but
    // it's not anything recognizable as a polynomial.
    if ((0, is_js_1.isone)(B) || (0, is_js_1.isone)(A)) {
        if (!(0, is_js_1.ispolyexpandedform)(A, X) || (0, is_js_1.isone)(A)) {
            return F;
        }
    }
    // Q = quotient
    const Q = (0, quotient_js_1.divpoly)(B, A, X);
    // remainder B = B - A * Q
    B = (0, add_js_1.subtract)(B, (0, multiply_js_1.multiply)(A, Q));
    // if the remainder is zero then we're done
    if ((0, is_js_1.isZeroAtomOrTensor)(B)) {
        return Q;
    }
    // A = factor(A)
    A = (0, factorpoly_js_1.factorpoly)(A, X);
    let C = expand_get_C(A, X);
    B = expand_get_B(B, C, X);
    A = expand_get_A(A, C, X);
    let result;
    if ((0, defs_js_1.istensor)(C)) {
        const inverse = (0, defs_js_1.doexpand)(inv_js_1.inv, C);
        result = (0, inner_js_1.inner)((0, inner_js_1.inner)(inverse, B), A);
    }
    else {
        const arg1 = (0, defs_js_1.doexpand)(multiply_js_1.divide, B, C);
        result = (0, multiply_js_1.multiply)(arg1, A);
    }
    return (0, add_js_1.add)(result, Q);
}
function expand_tensor(p5, p9) {
    p5 = (0, tensor_js_1.copy_tensor)(p5);
    p5.tensor.elem = p5.tensor.elem.map((el) => {
        return expand(el, p9);
    });
    return p5;
}
function remove_negative_exponents(p2, p3, p9) {
    const arr = [...(0, factors_js_1.factors)(p2), ...(0, factors_js_1.factors)(p3)];
    // find the smallest exponent
    let j = 0;
    for (let i = 0; i < arr.length; i++) {
        const p1 = arr[i];
        if (!(0, defs_js_1.ispower)(p1)) {
            continue;
        }
        if ((0, defs_js_1.cadr)(p1) !== p9) {
            continue;
        }
        const k = (0, bignum_js_1.nativeInt)((0, defs_js_1.caddr)(p1));
        if (isNaN(k)) {
            continue;
        }
        if (k < j) {
            j = k;
        }
    }
    if (j === 0) {
        return [p2, p3];
    }
    // A = A / X^j
    p2 = (0, multiply_js_1.multiply)(p2, (0, power_js_1.power)(p9, (0, bignum_js_1.integer)(-j)));
    // B = B / X^j
    p3 = (0, multiply_js_1.multiply)(p3, (0, power_js_1.power)(p9, (0, bignum_js_1.integer)(-j)));
    return [p2, p3];
}
// Returns the expansion coefficient matrix C.
//
// Example:
//
//       B         1
//      --- = -----------
//       A      2
//             x (x + 1)
//
// We have
//
//       B     Y1     Y2      Y3
//      --- = ---- + ---- + -------
//       A      2     x      x + 1
//             x
//
// Our task is to solve for the unknowns Y1, Y2, and Y3.
//
// Multiplying both sides by A yields
//
//           AY1     AY2      AY3
//      B = ----- + ----- + -------
//            2      x       x + 1
//           x
//
// Let
//
//            A               A                 A
//      W1 = ----       W2 = ---        W3 = -------
//             2              x               x + 1
//            x
//
// Then the coefficient matrix C is
//
//              coeff(W1,x,0)   coeff(W2,x,0)   coeff(W3,x,0)
//
//       C =    coeff(W1,x,1)   coeff(W2,x,1)   coeff(W3,x,1)
//
//              coeff(W1,x,2)   coeff(W2,x,2)   coeff(W3,x,2)
//
// It follows that
//
//       coeff(B,x,0)     Y1
//
//       coeff(B,x,1) = C Y2
//
//       coeff(B,x,2) =   Y3
//
// Hence
//
//       Y1       coeff(B,x,0)
//             -1
//       Y2 = C   coeff(B,x,1)
//
//       Y3       coeff(B,x,2)
function expand_get_C(p2, p9) {
    const stack = [];
    if ((0, defs_js_1.ismultiply)(p2)) {
        p2.tail().forEach((p5) => stack.push(...expand_get_CF(p2, p5, p9)));
    }
    else {
        stack.push(...expand_get_CF(p2, p2, p9));
    }
    const n = stack.length;
    if (n === 1) {
        return stack[0];
    }
    const p4 = (0, alloc_js_1.alloc_tensor)(n * n);
    p4.tensor.ndim = 2;
    p4.tensor.dim[0] = n;
    p4.tensor.dim[1] = n;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const arg2 = (0, power_js_1.power)(p9, (0, bignum_js_1.integer)(i));
            const divided = (0, defs_js_1.doexpand)(multiply_js_1.divide, stack[j], arg2);
            p4.tensor.elem[n * i + j] = (0, filter_js_1.filter)(divided, p9);
        }
    }
    return p4;
}
// The following table shows the push order for simple roots, repeated roots,
// and inrreducible factors.
//
//  Factor F        Push 1st        Push 2nd         Push 3rd      Push 4th
//
//
//                   A
//  x               ---
//                   x
//
//
//   2               A               A
//  x               ----            ---
//                    2              x
//                   x
//
//
//                     A
//  x + 1           -------
//                   x + 1
//
//
//         2            A              A
//  (x + 1)         ----------      -------
//                          2        x + 1
//                   (x + 1)
//
//
//   2                   A               Ax
//  x  + x + 1      ------------    ------------
//                    2               2
//                   x  + x + 1      x  + x + 1
//
//
//    2         2          A              Ax              A             Ax
//  (x  + x + 1)    --------------- ---------------  ------------  ------------
//                     2         2     2         2     2             2
//                   (x  + x + 1)    (x  + x + 1)     x  + x + 1    x  + x + 1
//
//
// For T = A/F and F = P^N we have
//
//
//      Factor F          Push 1st    Push 2nd    Push 3rd    Push 4th
//
//      x                 T
//
//       2
//      x                 T           TP
//
//
//      x + 1             T
//
//             2
//      (x + 1)           T           TP
//
//       2
//      x  + x + 1        T           TX
//
//        2         2
//      (x  + x + 1)      T           TX          TP          TPX
//
//
// Hence we want to push in the order
//
//      T * (P ^ i) * (X ^ j)
//
// for all i, j such that
//
//      i = 0, 1, ..., N - 1
//
//      j = 0, 1, ..., deg(P) - 1
//
// where index j runs first.
function expand_get_CF(p2, p5, p9) {
    let p6;
    let n = 0;
    if (!(0, find_js_1.Find)(p5, p9)) {
        return [];
    }
    const p8 = (0, defs_js_1.doexpand)(trivial_divide, p2, p5);
    if ((0, defs_js_1.ispower)(p5)) {
        n = (0, bignum_js_1.nativeInt)((0, defs_js_1.caddr)(p5));
        p6 = (0, defs_js_1.cadr)(p5);
    }
    else {
        n = 1;
        p6 = p5;
    }
    const stack = [];
    const d = (0, bignum_js_1.nativeInt)((0, degree_js_1.degree)(p6, p9));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < d; j++) {
            let arg2 = (0, power_js_1.power)(p6, (0, bignum_js_1.integer)(i));
            let arg1 = (0, defs_js_1.doexpand)(multiply_js_1.multiply, p8, arg2);
            arg2 = (0, power_js_1.power)(p9, (0, bignum_js_1.integer)(j));
            const multiplied = (0, defs_js_1.doexpand)(multiply_js_1.multiply, arg1, arg2);
            stack.push(multiplied);
        }
    }
    return stack;
}
// Returns T = A/F where F is a factor of A.
function trivial_divide(p2, p5) {
    let result = defs_js_1.Constants.one;
    if ((0, defs_js_1.ismultiply)(p2)) {
        const arr = [];
        p2.tail().forEach((p0) => {
            if (!(0, misc_js_1.equal)(p0, p5)) {
                // force expansion of (x+1)^2, f.e.
                arr.push((0, eval_js_1.Eval)(p0));
            }
        });
        result = (0, multiply_js_1.multiply_all)(arr);
    }
    return result;
}
// Returns the expansion coefficient vector B.
function expand_get_B(p3, p4, p9) {
    if (!(0, defs_js_1.istensor)(p4)) {
        return p3;
    }
    const n = p4.tensor.dim[0];
    const p8 = (0, alloc_js_1.alloc_tensor)(n);
    p8.tensor.ndim = 1;
    p8.tensor.dim[0] = n;
    for (let i = 0; i < n; i++) {
        const arg2 = (0, power_js_1.power)(p9, (0, bignum_js_1.integer)(i));
        const divided = (0, defs_js_1.doexpand)(multiply_js_1.divide, p3, arg2);
        p8.tensor.elem[i] = (0, filter_js_1.filter)(divided, p9);
    }
    return p8;
}
// Returns the expansion fractions in A.
function expand_get_A(p2, p4, p9) {
    if (!(0, defs_js_1.istensor)(p4)) {
        return (0, multiply_js_1.reciprocate)(p2);
    }
    let elements = [];
    if ((0, defs_js_1.ismultiply)(p2)) {
        p2.tail().forEach((p5) => {
            elements.push(...expand_get_AF(p5, p9));
        });
    }
    else {
        elements = expand_get_AF(p2, p9);
    }
    const n = elements.length;
    const p8 = (0, alloc_js_1.alloc_tensor)(n);
    p8.tensor.ndim = 1;
    p8.tensor.dim[0] = n;
    p8.tensor.elem = elements;
    return p8;
}
function expand_get_AF(p5, p9) {
    let n = 1;
    if (!(0, find_js_1.Find)(p5, p9)) {
        return [];
    }
    if ((0, defs_js_1.ispower)(p5)) {
        n = (0, bignum_js_1.nativeInt)((0, defs_js_1.caddr)(p5));
        p5 = (0, defs_js_1.cadr)(p5);
    }
    const results = [];
    const d = (0, bignum_js_1.nativeInt)((0, degree_js_1.degree)(p5, p9));
    for (let i = n; i > 0; i--) {
        for (let j = 0; j < d; j++) {
            results.push((0, multiply_js_1.multiply)((0, multiply_js_1.reciprocate)((0, power_js_1.power)(p5, (0, bignum_js_1.integer)(i))), (0, power_js_1.power)(p9, (0, bignum_js_1.integer)(j))));
        }
    }
    return results;
}
