"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.polyform = exports.bake = void 0;
const defs_js_1 = require("../runtime/defs.js");
const bignum_js_1 = require("./bignum.js");
const coeff_js_1 = require("./coeff.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const symbol_js_1 = require("../runtime/symbol.js");
function bake(p1) {
    return (0, defs_js_1.doexpand)(_bake, p1);
}
exports.bake = bake;
function _bake(p1) {
    const s = (0, is_js_1.ispolyexpandedform)(p1, (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_S));
    const t = (0, is_js_1.ispolyexpandedform)(p1, (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_T));
    const x = (0, is_js_1.ispolyexpandedform)(p1, (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_X));
    const y = (0, is_js_1.ispolyexpandedform)(p1, (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_Y));
    const z = (0, is_js_1.ispolyexpandedform)(p1, (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_Z));
    let result;
    if (s && !t && !x && !y && !z) {
        result = bake_poly(p1, (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_S));
    }
    else if (!s && t && !x && !y && !z) {
        result = bake_poly(p1, (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_T));
    }
    else if (!s && !t && x && !y && !z) {
        result = bake_poly(p1, (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_X));
    }
    else if (!s && !t && !x && y && !z) {
        result = bake_poly(p1, (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_Y));
    }
    else if (!s && !t && !x && !y && z) {
        result = bake_poly(p1, (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_Z));
        // don't bake the contents of some constructs such as "for"
        // because we don't want to evaluate the body of
        // such constructs "statically", i.e. without fully running
        // the loops.
    }
    else if ((0, defs_js_1.iscons)(p1) && (0, defs_js_1.car)(p1) !== (0, symbol_js_1.symbol)(defs_js_1.FOR)) {
        result = (0, list_js_1.makeList)((0, defs_js_1.car)(p1), ...p1.tail().map(bake));
    }
    else {
        result = p1;
    }
    return result;
}
function polyform(p1, p2) {
    if ((0, is_js_1.ispolyexpandedform)(p1, p2)) {
        return bake_poly(p1, p2);
    }
    if ((0, defs_js_1.iscons)(p1)) {
        return (0, list_js_1.makeList)((0, defs_js_1.car)(p1), ...p1.tail().map((el) => polyform(el, p2)));
    }
    return p1;
}
exports.polyform = polyform;
function bake_poly(poly, x) {
    const k = (0, coeff_js_1.coeff)(poly, x);
    const result = [];
    for (let i = k.length - 1; i >= 0; i--) {
        const term = k[i];
        result.push(...bake_poly_term(i, term, x));
    }
    if (result.length > 1) {
        return new defs_js_1.Cons((0, symbol_js_1.symbol)(defs_js_1.ADD), (0, list_js_1.makeList)(...result));
    }
    return result[0];
}
// p1 points to coefficient of p2 ^ k
// k is an int
function bake_poly_term(k, coefficient, term) {
    if ((0, is_js_1.isZeroAtomOrTensor)(coefficient)) {
        return [];
    }
    // constant term?
    if (k === 0) {
        if ((0, defs_js_1.isadd)(coefficient)) {
            return coefficient.tail();
        }
        return [coefficient];
    }
    const result = [];
    // coefficient
    if ((0, defs_js_1.ismultiply)(coefficient)) {
        result.push(...coefficient.tail());
    }
    else if (!(0, is_js_1.equaln)(coefficient, 1)) {
        result.push(coefficient);
    }
    // x ^ k
    if (k === 1) {
        result.push(term);
    }
    else {
        result.push((0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.POWER), term, (0, bignum_js_1.integer)(k)));
    }
    if (result.length > 1) {
        return [(0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.MULTIPLY), ...result)];
    }
    return result;
}
