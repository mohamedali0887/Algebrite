"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_harness_js_1 = require("../test-harness.js");
(0, test_harness_js_1.run_test)([
    'binomial(12,6)',
    '924',
    'binomial(n,k)',
    //  "1/(factorial(k))*factorial(n)*1/(factorial(-k+n))",
    //  "factorial(n)/(factorial(k)*factorial(-k+n))",
    'n!/(k!*(-k+n)!)',
    'binomial(0,k)',
    //  "1/(factorial(k))*1/(factorial(-k))",
    //  "1/(factorial(k)*factorial(-k))",
    '1/(k!*(-k)!)',
    'binomial(n,0)',
    '1',
    'binomial(-1,k)',
    '0',
    'binomial(n,-1)',
    '0',
]);
