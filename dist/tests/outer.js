"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_harness_js_1 = require("../test-harness.js");
(0, test_harness_js_1.run_test)([
    'outer(a,b)',
    'a*b',
    'outer(a,[b1,b2])',
    '[a*b1,a*b2]',
    'outer([a1,a2],b)',
    '[a1*b,a2*b]',
    'H33=hilbert(3)',
    '',
    'H44=hilbert(4)',
    '',
    'H55=hilbert(5)',
    '',
    'H3344=outer(H33,H44)',
    '',
    'H4455=outer(H44,H55)',
    '',
    'H33444455=outer(H33,H44,H44,H55)',
    '',
    'simplify(inner(H3344,H4455)-contract(H33444455,4,5))',
    '0',
]);
