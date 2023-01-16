"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guess = void 0;
const defs_js_1 = require("../runtime/defs.js");
const find_js_1 = require("../runtime/find.js");
const symbol_js_1 = require("../runtime/symbol.js");
// Guess which symbol to use for derivative, integral, etc.
function guess(p) {
    if ((0, find_js_1.Find)(p, (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_X))) {
        return (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_X);
    }
    else if ((0, find_js_1.Find)(p, (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_Y))) {
        return (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_Y);
    }
    else if ((0, find_js_1.Find)(p, (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_Z))) {
        return (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_Z);
    }
    else if ((0, find_js_1.Find)(p, (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_T))) {
        return (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_T);
    }
    else if ((0, find_js_1.Find)(p, (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_S))) {
        return (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_S);
    }
    else {
        return (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_X);
    }
}
exports.guess = guess;
