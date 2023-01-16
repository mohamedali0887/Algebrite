"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignum_js_1 = require("../sources/bignum.js");
const mpow_js_1 = require("../sources/mpow.js");
const test_harness_js_1 = require("../test-harness.js");
// small numbers
for (let i = -10; i < 10; i++) {
    const a = (0, bignum_js_1.mint)(i);
    let x = 1;
    for (let j = 0; j < 10; j++) {
        (0, test_harness_js_1.test)(`${i}^${j}=${x}`, t => {
            const b = (0, mpow_js_1.mpow)(a, j);
            const c = (0, bignum_js_1.mint)(x);
            t.is(c.toString(), b.toString());
            x *= i;
        });
    }
}
