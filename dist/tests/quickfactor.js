"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const misc_js_1 = require("../sources/misc.js");
const defs_js_1 = require("../runtime/defs.js");
const bignum_js_1 = require("../sources/bignum.js");
const multiply_js_1 = require("../sources/multiply.js");
const quickfactor_js_1 = require("../sources/quickfactor.js");
const test_harness_js_1 = require("../test-harness.js");
(0, test_harness_js_1.test)('quickfactor', t => {
    for (let i = 2; i < 10001; i++) {
        let base = i;
        const qf = (0, quickfactor_js_1.quickfactor)((0, bignum_js_1.integer)(base), (0, bignum_js_1.integer)(1));
        const arr = [];
        let j = 0;
        while (base > 1) {
            let expo = 0;
            while (base % defs_js_1.primetab[j] === 0) {
                base /= defs_js_1.primetab[j];
                expo++;
            }
            if (expo) {
                arr.push((0, quickfactor_js_1.quickpower)((0, bignum_js_1.integer)(defs_js_1.primetab[j]), (0, bignum_js_1.integer)(expo))[0]);
            }
            j++;
        }
        let p2 = (0, multiply_js_1.multiply_all)(arr);
        let p1 = qf;
        t.is(true, (0, misc_js_1.equal)(p1, p2), `${p1} != ${p2}`);
    }
});
