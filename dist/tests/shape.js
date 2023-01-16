"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_harness_js_1 = require("../test-harness.js");
(0, test_harness_js_1.run_test)([
    // see transpose function source to see why
    // transposition has no effect on vectors
    // of dimension (rank) 1
    'shape([A,B,C])',
    '[3]',
    'shape(transpose([A,B,C]))',
    '[3]',
    'shape([[A],[B],[C]])',
    '[3,1]',
    'shape(transpose([[A],[B],[C]]))',
    '[1,3]',
    'shape([[A,B],[C,D],[E,F]])',
    '[3,2]',
    'shape(transpose([[A,B],[C,D],[E,F]]))',
    '[2,3]',
]);
