"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defs_js_1 = require("../runtime/defs.js");
const bignum_js_1 = require("../sources/bignum.js");
const mprime_js_1 = require("../sources/mprime.js");
const test_harness_js_1 = require("../test-harness.js");
let i = 0;
let k = 0;
const m = 0;
let t = 0;
k = 0;
for (i = 0; i < 10000; i++) {
    const n = (0, bignum_js_1.mint)(i);
    let expectPrime = i === defs_js_1.primetab[k];
    if (expectPrime) {
        k++;
    }
    (0, test_harness_js_1.test)(`mprime(${i}) = ${expectPrime}`, t => t.is(expectPrime, (0, mprime_js_1.mprime)(n)));
}
//endif
