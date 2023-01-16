"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_harness_js_1 = require("../test-harness.js");
(0, test_harness_js_1.run_test)([
    'cofactor([[1,2],[3,4]],1,1)',
    '4',
    'cofactor([[1,2],[3,4]],1,2)',
    '-3',
    'cofactor([[1,2],[3,4]],2,1)',
    '-2',
    'cofactor([[1,2],[3,4]],2,2)',
    '1',
    'cofactor([[1,2,3],[4,5,6],[7,8,9]],1,2)',
    '6',
]);
