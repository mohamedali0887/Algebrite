"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.factors = void 0;
const defs_js_1 = require("../runtime/defs.js");
// Push expression factors onto the stack. For example...
//
// Input
//
//       2
//     3x  + 2x + 1
//
// Output on stack
//
//     [  3  ]
//     [ x^2 ]
//     [  2  ]
//     [  x  ]
//     [  1  ]
//
// but not necessarily in that order. Returns the number of factors.
function factors(p) {
    const result = [];
    if ((0, defs_js_1.isadd)(p)) {
        p.tail().forEach((el) => result.push(...term_factors(el)));
    }
    else {
        result.push(...term_factors(p));
    }
    return result;
}
exports.factors = factors;
function term_factors(p) {
    if ((0, defs_js_1.ismultiply)(p)) {
        return p.tail();
    }
    return [p];
}
