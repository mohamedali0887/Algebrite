"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignum_js_1 = require("../sources/bignum.js");
const mmul_js_1 = require("../sources/mmul.js");
const test_harness_js_1 = require("../test-harness.js");
function make_test(f, expected) {
    (0, test_harness_js_1.test)(f.name, t => {
        for (let i = -100; i <= 100; i++) {
            for (let j = -1000; j <= 100; j++) {
                const a = (0, bignum_js_1.mint)(i);
                const b = (0, bignum_js_1.mint)(j);
                const e = expected(i, j);
                if (!isFinite(e)) {
                    continue;
                }
                const c = (0, bignum_js_1.mint)(e);
                t.is(c.toString(), f(a, b).toString(), `${f.name}(${a}, ${b})`);
            }
        }
    });
}
make_test(mmul_js_1.mmul, (i, j) => i * j);
make_test(mmul_js_1.mdiv, (i, j) => {
    if (i / j > 0) {
        return Math.floor(i / j);
    }
    else {
        return Math.ceil(i / j);
    }
});
make_test(mmul_js_1.mmod, (i, j) => i % j);
