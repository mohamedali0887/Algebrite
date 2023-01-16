"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.factorial = void 0;
const defs_js_1 = require("../runtime/defs.js");
const misc_js_1 = require("../sources/misc.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const list_js_1 = require("./list.js");
const multiply_js_1 = require("./multiply.js");
const power_js_1 = require("./power.js");
const symbol_js_1 = require("../runtime/symbol.js");
function factorial(p1) {
    const n = (0, bignum_js_1.nativeInt)(p1);
    if (n < 0 || isNaN(n)) {
        return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.FACTORIAL), p1);
    }
    return (0, bignum_js_1.bignum_factorial)(n);
}
exports.factorial = factorial;
// simplification rules for factorials (m < n)
//
//  (e + 1) * factorial(e)  ->  factorial(e + 1)
//
//  factorial(e) / e  ->  factorial(e - 1)
//
//  e / factorial(e)  ->  1 / factorial(e - 1)
//
//  factorial(e + n)
//  ----------------  ->  (e + m + 1)(e + m + 2)...(e + n)
//  factorial(e + m)
//
//  factorial(e + m)                               1
//  ----------------  ->  --------------------------------
//  factorial(e + n)    (e + m + 1)(e + m + 2)...(e + n)
// this function is not actually used, but
// all these simplifications
// do happen automatically via simplify
function simplifyfactorials(p1) {
    return (0, defs_js_1.noexpand)(simplifyfactorials_, p1);
}
function simplifyfactorials_(p1) {
    if ((0, defs_js_1.isadd)(p1)) {
        return p1.tail().map(simplifyfactorials).reduce(add_js_1.add, defs_js_1.Constants.zero);
    }
    if ((0, defs_js_1.ismultiply)(p1)) {
        return sfac_product(p1);
    }
    return p1;
}
function sfac_product(p1) {
    let terms = [];
    if ((0, defs_js_1.iscons)(p1)) {
        terms = p1.tail();
    }
    for (let i = 0; i < terms.length; i++) {
        if (terms[i] === (0, symbol_js_1.symbol)(defs_js_1.NIL)) {
            continue;
        }
        for (let j = i + 1; j < terms.length; j++) {
            if (terms[j] === (0, symbol_js_1.symbol)(defs_js_1.NIL)) {
                continue;
            }
            sfac_product_f(terms, i, j);
        }
    }
    let result = defs_js_1.Constants.one;
    for (let i = 0; i < terms.length; i++) {
        if (terms[i] === (0, symbol_js_1.symbol)(defs_js_1.NIL)) {
            continue;
        }
        result = (0, multiply_js_1.multiply)(result, terms[i]);
    }
    return result;
}
function sfac_product_f(s, a, b) {
    let p3, p4;
    let p1 = s[a];
    let p2 = s[b];
    if ((0, defs_js_1.ispower)(p1)) {
        p3 = (0, defs_js_1.caddr)(p1);
        p1 = (0, defs_js_1.cadr)(p1);
    }
    else {
        p3 = defs_js_1.Constants.one;
    }
    if ((0, defs_js_1.ispower)(p2)) {
        p4 = (0, defs_js_1.caddr)(p2);
        p2 = (0, defs_js_1.cadr)(p2);
    }
    else {
        p4 = defs_js_1.Constants.one;
    }
    if ((0, defs_js_1.isfactorial)(p1) && (0, defs_js_1.isfactorial)(p2)) {
        let n = (0, bignum_js_1.nativeInt)((0, misc_js_1.yyexpand)((0, add_js_1.add)(p3, p4)));
        if (n !== 0) {
            return;
        }
        // Find the difference between the two factorial args.
        // For example, the difference between (a + 2)! and a! is 2.
        n = (0, bignum_js_1.nativeInt)((0, misc_js_1.yyexpand)((0, add_js_1.subtract)((0, defs_js_1.cadr)(p1), (0, defs_js_1.cadr)(p2)))); // to simplify
        if (n === 0 || isNaN(n)) {
            return;
        }
        if (n < 0) {
            n = -n;
            const temp1 = p1;
            p1 = p2;
            p2 = temp1;
            const temp2 = p3;
            p3 = p4;
            p4 = temp2;
        }
        let temp3 = defs_js_1.Constants.one;
        for (let i = 1; i <= n; i++) {
            temp3 = (0, multiply_js_1.multiply)(temp3, (0, power_js_1.power)((0, add_js_1.add)((0, defs_js_1.cadr)(p2), (0, bignum_js_1.integer)(i)), p3));
        }
        s[a] = temp3;
        s[b] = (0, symbol_js_1.symbol)(defs_js_1.NIL);
    }
}
