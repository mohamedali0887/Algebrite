"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defs_js_1 = require("../runtime/defs.js");
const run_js_1 = require("../runtime/run.js");
const bignum_js_1 = require("../sources/bignum.js");
const mgcd_js_1 = require("../sources/mgcd.js");
const mmul_js_1 = require("../sources/mmul.js");
const test_harness_js_1 = require("../test-harness.js");
for (let i = 1; i < 100; i++) {
    const a = (0, bignum_js_1.mint)(i);
    for (let j = 1; j < 100; j++) {
        (0, test_harness_js_1.test)(`gcd(${i}, ${j})`, t => {
            const b = (0, bignum_js_1.mint)(j);
            const c = (0, mgcd_js_1.mgcd)(a, b);
            const d = egcd(a, b);
            t.is(d.toString(), c.toString());
        });
    }
}
// Euclid's algorithm
function egcd(a, b) {
    let sign_ = 0;
    if ((0, defs_js_1.MZERO)(b)) {
        (0, run_js_1.stop)('divide by zero');
    }
    //b = mcopy(b)
    if ((0, defs_js_1.MZERO)(a)) {
        return b;
    }
    sign_ = (0, defs_js_1.MSIGN)(b);
    //a = mcopy(a)
    while (!(0, defs_js_1.MZERO)(b)) {
        const c = (0, mmul_js_1.mmod)(a, b);
        //mfree(a)
        a = b;
        b = c;
    }
    a = (0, bignum_js_1.setSignTo)(a, sign_);
    return a;
}
