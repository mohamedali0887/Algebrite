"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_harness_js_1 = require("../test-harness.js");
(0, test_harness_js_1.run_test)([
    'erfc(a)',
    'erfc(a)',
    'erfc(0.0)',
    '1.0',
    'float(erfc(0))',
    '1.0',
    'erfc(0.0)',
    '1.0',
    'erfc(-0.0)',
    '1.0',
    'erfc(0)',
    '1',
    'erfc(-0)',
    '1',
    'float(erfc(1))',
    '0.157299...',
]);
