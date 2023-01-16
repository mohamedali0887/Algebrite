"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clockform = exports.Eval_clock = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const abs_js_1 = require("./abs.js");
const arg_js_1 = require("./arg.js");
const eval_js_1 = require("./eval.js");
const list_js_1 = require("./list.js");
const multiply_js_1 = require("./multiply.js");
/*
 Convert complex z to clock form

  Input:    push  z

  Output:    Result on stack

  clock(z) = abs(z) * (-1) ^ (arg(z) / pi)

  For example, clock(exp(i pi/3)) gives the result (-1)^(1/3)
*/
// P.S. I couldn't find independent definition/aknowledgment
// of the naming "clock form" anywhere on the web, seems like a
// naming specific to eigenmath.
// Clock form is another way to express a complex number, and
// it has three advantages
//   1) it's uniform with how for example
//      i is expressed i.e. (-1)^(1/2)
//   2) it's very compact
//   3) it's a straighforward notation for roots of 1 and -1
const DEBUG_CLOCKFORM = false;
function Eval_clock(p1) {
    return clockform((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_clock = Eval_clock;
function clockform(p1) {
    // pushing the expression (-1)^... but note
    // that we can't use "power", as "power" evaluates
    // clock forms into rectangular form (see "-1 ^ rational"
    // section in power)
    const l = (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.POWER), defs_js_1.Constants.negOne, (0, multiply_js_1.divide)((0, arg_js_1.arg)(p1), defs_js_1.Constants.Pi()));
    const multiplied = (0, multiply_js_1.multiply)((0, abs_js_1.abs)(p1), l);
    if (DEBUG_CLOCKFORM) {
        console.log(`clockform: abs of ${p1} : ${(0, abs_js_1.abs)(p1)}`);
        console.log(`clockform: arg of ${p1} : ${(0, arg_js_1.arg)(p1)}`);
        console.log(`clockform: divide : ${(0, multiply_js_1.divide)((0, arg_js_1.arg)(p1), defs_js_1.Constants.Pi())}`);
        console.log(`clockform: power : ${l}`);
        console.log(`clockform: multiply : ${multiplied}`);
    }
    return multiplied;
}
exports.clockform = clockform;
