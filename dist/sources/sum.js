"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_sum = void 0;
const defs_js_1 = require("../runtime/defs.js");
const run_js_1 = require("../runtime/run.js");
const symbol_js_1 = require("../runtime/symbol.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
// 'sum' function
//define A p3
//define B p4
//define I p5
//define X p6
// leaves the sum at the top of the stack
function Eval_sum(p1) {
    // 1st arg
    const body = (0, defs_js_1.cadr)(p1);
    // 2nd arg (index)
    const indexVariable = (0, defs_js_1.caddr)(p1);
    if (!(0, defs_js_1.issymbol)(indexVariable)) {
        (0, run_js_1.stop)('sum: 2nd arg?');
    }
    // 3rd arg (lower limit)
    const j = (0, eval_js_1.evaluate_integer)((0, defs_js_1.cadddr)(p1));
    if (isNaN(j)) {
        return p1;
    }
    // 4th arg (upper limit)
    const k = (0, eval_js_1.evaluate_integer)((0, defs_js_1.caddddr)(p1));
    if (isNaN(k)) {
        return p1;
    }
    // remember contents of the index
    // variable so we can put it back after the loop
    const p4 = (0, symbol_js_1.get_binding)(indexVariable);
    let temp = defs_js_1.Constants.zero;
    for (let i = j; i <= k; i++) {
        (0, symbol_js_1.set_binding)(indexVariable, (0, bignum_js_1.integer)(i));
        temp = (0, add_js_1.add)(temp, (0, eval_js_1.Eval)(body));
    }
    // put back the index variable to original content
    (0, symbol_js_1.set_binding)(indexVariable, p4);
    return temp;
}
exports.Eval_sum = Eval_sum;
