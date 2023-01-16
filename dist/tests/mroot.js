"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignum_js_1 = require("../sources/bignum.js");
const mpow_js_1 = require("../sources/mpow.js");
const mroot_js_1 = require("../sources/mroot.js");
const test_harness_js_1 = require("../test-harness.js");
// small numbers
for (let i = 0; i < 10; i++) {
    const a = (0, bignum_js_1.mint)(i);
    for (let j = 1; j < 10; j++) {
        (0, test_harness_js_1.test)(`mroot(mpow(${i},${j}),${j})=${i}`, t => {
            const b = (0, mpow_js_1.mpow)(a, j);
            const c = (0, mroot_js_1.mroot)(b, j);
            t.not(0, c);
            t.is(a.toString(), c.toString());
        });
    }
}
// big numbers
const a = (0, bignum_js_1.mint)(12345);
for (let i = 1; i < 10; i++) {
    (0, test_harness_js_1.test)(`mroot(mpow(${a},${i}),${i})=${a}`, t => {
        const b = (0, mpow_js_1.mpow)(a, i);
        const c = (0, mroot_js_1.mroot)(b, i);
        t.not(0, c);
        t.is(a.toString(), c.toString());
    });
}
