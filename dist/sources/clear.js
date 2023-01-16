"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_clear = exports.do_clearall = exports.Eval_clearall = void 0;
const defs_js_1 = require("../runtime/defs.js");
const init_js_1 = require("../runtime/init.js");
const otherCFunctions_js_1 = require("../runtime/otherCFunctions.js");
const run_js_1 = require("../runtime/run.js");
const symbol_js_1 = require("../runtime/symbol.js");
const pattern_js_1 = require("./pattern.js");
/* clearall =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

General description
-------------------

Completely wipes all variables from the environment.

*/
function Eval_clearall() {
    do_clearall();
    return (0, symbol_js_1.symbol)(defs_js_1.NIL);
}
exports.Eval_clearall = Eval_clearall;
function do_clearall() {
    if (!defs_js_1.defs.test_flag) {
        (0, otherCFunctions_js_1.clear_term)();
    }
    (0, pattern_js_1.do_clearPatterns)();
    (0, symbol_js_1.clear_symbols)();
    (0, init_js_1.defn)();
    return (defs_js_1.defs.codeGen = false);
}
exports.do_clearall = do_clearall;
// clearall from application GUI code
function clearall() {
    return (0, run_js_1.run)('clearall');
}
/* clear =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------

Completely wipes a variable from the environment (while doing x = quote(x) just unassigns it).

*/
function Eval_clear(p1) {
    let p2;
    p2 = (0, defs_js_1.cdr)(p1);
    while ((0, defs_js_1.iscons)(p2)) {
        const variableToBeCleared = (0, defs_js_1.car)(p2);
        //console.log variableToBeCleared + ""
        if (variableToBeCleared.k !== defs_js_1.SYM) {
            (0, run_js_1.stop)('symbol error');
        }
        //console.log "getting binding of " + p.toString()
        //if p.toString() == "aaa"
        //  breakpoint
        (0, symbol_js_1.clear_symbol)(variableToBeCleared);
        p2 = (0, defs_js_1.cdr)(p2);
    }
    return (0, symbol_js_1.symbol)(defs_js_1.NIL);
}
exports.Eval_clear = Eval_clear;
