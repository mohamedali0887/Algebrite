"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_harness_js_1 = require("../test-harness.js");
(0, test_harness_js_1.run_test)([
    // I found out about basic mistakes in
    // these very very late, better to
    // have those tests early on.
    '1/1',
    '1',
    '-1/1',
    '-1',
    '1/(-1)',
    '-1',
    '(-1)/(-1)',
    '1',
]);
