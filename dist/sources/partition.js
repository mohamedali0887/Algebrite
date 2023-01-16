"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partition = void 0;
const defs_js_1 = require("../runtime/defs.js");
const find_js_1 = require("../runtime/find.js");
const multiply_js_1 = require("./multiply.js");
/*
 Partition a term

  Input:
    p1: term (factor or product of factors)
    p2: free variable

  Output:
    constant expression
    variable expression
*/
function partition(p1, p2) {
    let p3 = defs_js_1.Constants.one;
    let p4 = p3;
    p1 = (0, defs_js_1.cdr)(p1);
    if (!(0, defs_js_1.iscons)(p1)) {
        return [p3, p4];
    }
    for (const p of p1) {
        if ((0, find_js_1.Find)(p, p2)) {
            p4 = (0, multiply_js_1.multiply)(p4, p);
        }
        else {
            p3 = (0, multiply_js_1.multiply)(p3, p);
        }
    }
    return [p3, p4];
}
exports.partition = partition;
