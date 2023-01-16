"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignum_js_1 = require("../sources/bignum.js");
const madd_js_1 = require("../sources/madd.js");
const test_harness_js_1 = require("../test-harness.js");
let i = 0;
(0, test_harness_js_1.test)('madd', t => {
    for (i = -100; i < 100; i++) {
        for (let j = -100; j < 100; j++) {
            const a = (0, bignum_js_1.mint)(i);
            const b = (0, bignum_js_1.mint)(j);
            const c = (0, bignum_js_1.mint)(i + j);
            t.is(c.toString(), (0, madd_js_1.madd)(a, b).toString(), `${i}+${j}=${i + j}`);
        }
    }
});
(0, test_harness_js_1.test)('msub', t => {
    for (i = -100; i <= 100; i++) {
        for (let j = -100; j <= 100; j++) {
            const a = (0, bignum_js_1.mint)(i);
            const b = (0, bignum_js_1.mint)(j);
            const c = (0, bignum_js_1.mint)(i - j);
            t.is(c.toString(), (0, madd_js_1.msub)(a, b).toString(), `${i}-${j}=${i - j}`);
        }
    }
});
