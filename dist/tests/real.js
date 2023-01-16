"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_harness_js_1 = require("../test-harness.js");
(0, test_harness_js_1.run_test)([
    'real(a+i*b)',
    'a',
    'real(1+exp(i*pi/3))',
    '3/2',
    'real(i)',
    '0',
    'real((-1)^(1/3))',
    '1/2',
]);
