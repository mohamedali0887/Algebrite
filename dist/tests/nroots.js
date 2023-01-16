"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_harness_js_1 = require("../test-harness.js");
(0, test_harness_js_1.run_test)([
    'nroots(x)',
    '0',
    'nroots((1+i)*x^2+1)',
    '[-0.171780...-0.727673...*i,0.171780...+0.727673...*i]',
    'nroots(sqrt(2)*exp(i*pi/4)*x^2+1)',
    '[-0.171780...-0.727673...*i,0.171780...+0.727673...*i]',
    //  "nroots(x^4+1)",
    //  "(-0.707107+0.707107*i,-0.707107-0.707107*i,0.707107+0.707107*i,0.707107-0.707107*i)",
]);
