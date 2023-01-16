"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeList = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
// Convert an array into a CONS list.
// TODO: rename this to just list
function makeList(...items) {
    let node = (0, symbol_js_1.symbol)(defs_js_1.NIL);
    for (let i = items.length - 1; i >= 0; i--) {
        node = new defs_js_1.Cons(items[i], node);
    }
    return node;
}
exports.makeList = makeList;
