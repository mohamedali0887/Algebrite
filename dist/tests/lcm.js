"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_harness_js_1 = require("../test-harness.js");
(0, test_harness_js_1.run_test)([
    'lcm(4,6)',
    '12',
    'lcm(4*x,6*x*y)',
    '12*x*y',
    // multiple arguments
    'lcm(2,3,4)',
    '12',
]);
