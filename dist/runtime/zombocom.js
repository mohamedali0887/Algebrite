"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = exports.parse = void 0;
const run_js_1 = require("./run.js");
const bignum_js_1 = require("../sources/bignum.js");
const list_js_1 = require("../sources/list.js");
const scan_js_1 = require("../sources/scan.js");
const defs_js_1 = require("./defs.js");
const init_js_1 = require("./init.js");
const symbol_js_1 = require("./symbol.js");
if (!defs_js_1.defs.inited) {
    defs_js_1.defs.inited = true;
    (0, init_js_1.init)();
}
function parse_internal(argu) {
    if (typeof argu === 'string') {
        const [, u] = (0, scan_js_1.scan)(argu);
        return u;
    }
    else if (typeof argu === 'number') {
        if (argu % 1 === 0) {
            return (0, bignum_js_1.integer)(argu);
        }
        else {
            return (0, bignum_js_1.double)(argu);
        }
    }
    else if (typeof argu.k === 'number') {
        // hey look its a U
        return argu;
    }
    else {
        console.warn('unknown argument type', argu);
        return (0, symbol_js_1.symbol)(defs_js_1.NIL);
    }
}
function parse(argu) {
    let data;
    try {
        data = parse_internal(argu);
        (0, run_js_1.check_stack)();
    }
    catch (error) {
        (0, defs_js_1.reset_after_error)();
        throw error;
    }
    return data;
}
exports.parse = parse;
// exec handles the running ia JS of all the algebrite
// functions. The function name is passed in "name" and
// the corresponding function is pushed at the top of the stack
function exec(name, ...argus) {
    let result;
    const fn = (0, symbol_js_1.get_binding)((0, symbol_js_1.usr_symbol)(name));
    (0, run_js_1.check_stack)();
    const p1 = (0, list_js_1.makeList)(fn, ...argus.map(parse_internal));
    try {
        result = (0, run_js_1.top_level_eval)(p1);
        (0, run_js_1.check_stack)();
    }
    catch (error) {
        (0, defs_js_1.reset_after_error)();
        throw error;
    }
    return result;
}
exports.exec = exec;
