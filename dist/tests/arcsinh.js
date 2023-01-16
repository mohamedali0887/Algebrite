"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_harness_js_1 = require("../test-harness.js");
(0, test_harness_js_1.run_test)([
    'arcsinh(0.0)',
    '0.0',
    'arcsinh(0)',
    '0',
    'arcsinh(sinh(x))',
    'x'
]);
