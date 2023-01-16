"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_harness_js_1 = require("../test-harness.js");
(0, test_harness_js_1.run_test)([
    // no evaluation in case there are
    // symbolic variables
    'sum(body + k,k,b,c)',
    'sum(body+k,k,b,c)',
    'f=sum(a^k,k,0,9)',
    '',
    'eval(f,a,-1/2)',
    '341/512',
    // Leibniz formula for π as a series
    'sum(float((-1)^k * (1/(2*k + 1))),k,0,100)*4',
    '3.151493...',
    // -------------------
    'f(a,b)=sum(k,k,a,b)',
    '',
    'f(0,1)',
    '1',
    // --- cleanup
    'f = quote(f)',
    '',
]);
