"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_harness_js_1 = require("../test-harness.js");
(0, test_harness_js_1.run_test)([
    'arctanh(0.0)',
    '0.0',
    'arctanh(0)',
    '0',
    'arctanh(tanh(x))',
    'x'
]);
