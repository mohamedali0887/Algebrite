"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qmul = void 0;
const defs_js_1 = require("../runtime/defs.js");
const bignum_js_1 = require("./bignum.js");
const mgcd_js_1 = require("./mgcd.js");
const mmul_js_1 = require("./mmul.js");
//  Multiply rational numbers
//
//  Input:    p1    multiplicand
//            p2    multiplier
//
//  Output:    product
function qmul(p1, p2) {
    // zero?
    if ((0, defs_js_1.MZERO)(p1.q.a) || (0, defs_js_1.MZERO)(p2.q.a)) {
        return defs_js_1.Constants.zero;
    }
    const aa = (0, mmul_js_1.mmul)(p1.q.a, p2.q.a);
    const bb = (0, mmul_js_1.mmul)(p1.q.b, p2.q.b);
    let c = (0, mgcd_js_1.mgcd)(aa, bb);
    c = (0, bignum_js_1.makeSignSameAs)(c, bb);
    return new defs_js_1.Num((0, mmul_js_1.mdiv)(aa, c), (0, mmul_js_1.mdiv)(bb, c));
}
exports.qmul = qmul;
