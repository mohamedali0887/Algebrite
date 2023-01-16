"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_nroots = void 0;
const alloc_js_1 = require("../runtime/alloc.js");
const defs_js_1 = require("../runtime/defs.js");
const run_js_1 = require("../runtime/run.js");
const symbol_js_1 = require("../runtime/symbol.js");
const misc_js_1 = require("../sources/misc.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const coeff_js_1 = require("./coeff.js");
const eval_js_1 = require("./eval.js");
const float_js_1 = require("./float.js");
const guess_js_1 = require("./guess.js");
const imag_js_1 = require("./imag.js");
const is_js_1 = require("./is.js");
const multiply_js_1 = require("./multiply.js");
const real_js_1 = require("./real.js");
// find the roots of a polynomial numerically
const NROOTS_YMAX = 101;
const NROOTS_DELTA = 1.0e-6;
const NROOTS_EPSILON = 1.0e-9;
function NROOTS_ABS(z) {
    return Math.sqrt(z.r * z.r + z.i * z.i);
}
// random between -2 and 2
const theRandom = 0.0;
function NROOTS_RANDOM() {
    //theRandom += 0.2
    //return theRandom
    return 4.0 * Math.random() - 2.0;
}
class numericRootOfPolynomial {
    constructor() {
        this.r = 0.0;
        this.i = 0.0;
    }
}
const nroots_a = new numericRootOfPolynomial();
const nroots_b = new numericRootOfPolynomial();
const nroots_x = new numericRootOfPolynomial();
const nroots_y = new numericRootOfPolynomial();
const nroots_fa = new numericRootOfPolynomial();
const nroots_fb = new numericRootOfPolynomial();
const nroots_dx = new numericRootOfPolynomial();
const nroots_df = new numericRootOfPolynomial();
const nroots_c = [];
for (let initNRoots = 0; initNRoots < NROOTS_YMAX; initNRoots++) {
    nroots_c[initNRoots] = new numericRootOfPolynomial();
}
function Eval_nroots(p1) {
    let p2 = (0, eval_js_1.Eval)((0, defs_js_1.caddr)(p1));
    p1 = (0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1));
    p2 = p2 === (0, symbol_js_1.symbol)(defs_js_1.NIL) ? (0, guess_js_1.guess)(p1) : p2;
    if (!(0, is_js_1.ispolyexpandedform)(p1, p2)) {
        (0, run_js_1.stop)('nroots: polynomial?');
    }
    // get the coefficients
    const cs = (0, coeff_js_1.coeff)(p1, p2);
    let n = cs.length;
    if (n > NROOTS_YMAX) {
        (0, run_js_1.stop)('nroots: degree?');
    }
    // convert the coefficients to real and imaginary doubles
    for (let i = 0; i < n; i++) {
        p1 = (0, eval_js_1.Eval)((0, float_js_1.yyfloat)((0, real_js_1.real)(cs[i])));
        p2 = (0, eval_js_1.Eval)((0, float_js_1.yyfloat)((0, imag_js_1.imag)(cs[i])));
        if (!(0, defs_js_1.isdouble)(p1) || !(0, defs_js_1.isdouble)(p2)) {
            (0, run_js_1.stop)('nroots: coefficients?');
        }
        nroots_c[i].r = p1.d;
        nroots_c[i].i = p2.d;
    }
    // n is the number of coefficients, n = deg(p) + 1
    monic(n);
    const roots = [];
    for (let k = n; k > 1; k--) {
        findroot(k);
        if (Math.abs(nroots_a.r) < NROOTS_DELTA) {
            nroots_a.r = 0.0;
        }
        if (Math.abs(nroots_a.i) < NROOTS_DELTA) {
            nroots_a.i = 0.0;
        }
        roots.push((0, add_js_1.add)((0, bignum_js_1.double)(nroots_a.r), (0, multiply_js_1.multiply)((0, bignum_js_1.double)(nroots_a.i), defs_js_1.Constants.imaginaryunit)));
        NROOTS_divpoly(k);
    }
    // now make n equal to the number of roots
    n = roots.length;
    if (n == 1) {
        return roots[0];
    }
    else if (n > 1) {
        roots.sort(misc_js_1.cmp_expr);
        p1 = (0, alloc_js_1.alloc_tensor)(n);
        p1.tensor.ndim = 1;
        p1.tensor.dim[0] = n;
        p1.tensor.elem = roots;
        return p1;
    }
}
exports.Eval_nroots = Eval_nroots;
// divide the polynomial by its leading coefficient
function monic(n) {
    nroots_y.r = nroots_c[n - 1].r;
    nroots_y.i = nroots_c[n - 1].i;
    const t = nroots_y.r * nroots_y.r + nroots_y.i * nroots_y.i;
    for (let k = 0; k < n - 1; k++) {
        nroots_c[k].r =
            (nroots_c[k].r * nroots_y.r + nroots_c[k].i * nroots_y.i) / t;
        nroots_c[k].i =
            (nroots_c[k].i * nroots_y.r - nroots_c[k].r * nroots_y.i) / t;
    }
    nroots_c[n - 1].r = 1.0;
    nroots_c[n - 1].i = 0.0;
}
// uses the secant method
function findroot(n) {
    if (NROOTS_ABS(nroots_c[0]) < NROOTS_DELTA) {
        nroots_a.r = 0.0;
        nroots_a.i = 0.0;
        return;
    }
    for (let j = 0; j < 100; j++) {
        nroots_a.r = NROOTS_RANDOM();
        nroots_a.i = NROOTS_RANDOM();
        compute_fa(n);
        nroots_b.r = nroots_a.r;
        nroots_b.i = nroots_a.i;
        nroots_fb.r = nroots_fa.r;
        nroots_fb.i = nroots_fa.i;
        nroots_a.r = NROOTS_RANDOM();
        nroots_a.i = NROOTS_RANDOM();
        for (let k = 0; k < 1000; k++) {
            compute_fa(n);
            const nrabs = NROOTS_ABS(nroots_fa);
            if (defs_js_1.DEBUG) {
                console.log(`nrabs: ${nrabs}`);
            }
            if (nrabs < NROOTS_EPSILON) {
                return;
            }
            if (NROOTS_ABS(nroots_fa) < NROOTS_ABS(nroots_fb)) {
                nroots_x.r = nroots_a.r;
                nroots_x.i = nroots_a.i;
                nroots_a.r = nroots_b.r;
                nroots_a.i = nroots_b.i;
                nroots_b.r = nroots_x.r;
                nroots_b.i = nroots_x.i;
                nroots_x.r = nroots_fa.r;
                nroots_x.i = nroots_fa.i;
                nroots_fa.r = nroots_fb.r;
                nroots_fa.i = nroots_fb.i;
                nroots_fb.r = nroots_x.r;
                nroots_fb.i = nroots_x.i;
            }
            // dx = nroots_b - nroots_a
            nroots_dx.r = nroots_b.r - nroots_a.r;
            nroots_dx.i = nroots_b.i - nroots_a.i;
            // df = fb - fa
            nroots_df.r = nroots_fb.r - nroots_fa.r;
            nroots_df.i = nroots_fb.i - nroots_fa.i;
            // y = dx / df
            const t = nroots_df.r * nroots_df.r + nroots_df.i * nroots_df.i;
            if (t === 0.0) {
                break;
            }
            nroots_y.r = (nroots_dx.r * nroots_df.r + nroots_dx.i * nroots_df.i) / t;
            nroots_y.i = (nroots_dx.i * nroots_df.r - nroots_dx.r * nroots_df.i) / t;
            // a = b - y * fb
            nroots_a.r =
                nroots_b.r - (nroots_y.r * nroots_fb.r - nroots_y.i * nroots_fb.i);
            nroots_a.i =
                nroots_b.i - (nroots_y.r * nroots_fb.i + nroots_y.i * nroots_fb.r);
        }
    }
    (0, run_js_1.stop)('nroots: convergence error');
}
function compute_fa(n) {
    // x = a
    nroots_x.r = nroots_a.r;
    nroots_x.i = nroots_a.i;
    // fa = c0 + c1 * x
    nroots_fa.r =
        nroots_c[0].r + nroots_c[1].r * nroots_x.r - nroots_c[1].i * nroots_x.i;
    nroots_fa.i =
        nroots_c[0].i + nroots_c[1].r * nroots_x.i + nroots_c[1].i * nroots_x.r;
    for (let k = 2; k < n; k++) {
        // x = a * x
        const t = nroots_a.r * nroots_x.r - nroots_a.i * nroots_x.i;
        nroots_x.i = nroots_a.r * nroots_x.i + nroots_a.i * nroots_x.r;
        nroots_x.r = t;
        // fa += c[k] * x
        nroots_fa.r += nroots_c[k].r * nroots_x.r - nroots_c[k].i * nroots_x.i;
        nroots_fa.i += nroots_c[k].r * nroots_x.i + nroots_c[k].i * nroots_x.r;
    }
}
// divide the polynomial by x - a
function NROOTS_divpoly(n) {
    for (let k = n - 1; k > 0; k--) {
        nroots_c[k - 1].r +=
            nroots_c[k].r * nroots_a.r - nroots_c[k].i * nroots_a.i;
        nroots_c[k - 1].i +=
            nroots_c[k].i * nroots_a.r + nroots_c[k].r * nroots_a.i;
    }
    if (NROOTS_ABS(nroots_c[0]) > NROOTS_DELTA) {
        (0, run_js_1.stop)('nroots: residual error');
    }
    for (let k = 0; k < n - 1; k++) {
        nroots_c[k].r = nroots_c[k + 1].r;
        nroots_c[k].i = nroots_c[k + 1].i;
    }
}
