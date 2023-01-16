"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_for = void 0;
const defs_js_1 = require("../runtime/defs.js");
const run_js_1 = require("../runtime/run.js");
const symbol_js_1 = require("../runtime/symbol.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
// 'for' function
/*
x=0
y=2
for(do(x=sqrt(2+x),y=2*y/x),k,1,9)
float(y)

X: k
B: 1...9

1st parameter is the body
2nd parameter is the variable to loop with
3rd and 4th are the limits

*/
//define A p3
//define B p4
//define I p5
//define X p6
function Eval_for(p1) {
    const loopingVariable = (0, defs_js_1.caddr)(p1);
    if (!(0, defs_js_1.issymbol)(loopingVariable)) {
        (0, run_js_1.stop)('for: 2nd arg should be the variable to loop over');
    }
    const j = (0, eval_js_1.evaluate_integer)((0, defs_js_1.cadddr)(p1));
    if (isNaN(j)) {
        return p1;
    }
    const k = (0, eval_js_1.evaluate_integer)((0, defs_js_1.caddddr)(p1));
    if (isNaN(k)) {
        return p1;
    }
    // remember contents of the index
    // variable so we can put it back after the loop
    const p4 = (0, symbol_js_1.get_binding)(loopingVariable);
    for (let i = j; i <= k; i++) {
        (0, symbol_js_1.set_binding)(loopingVariable, (0, bignum_js_1.integer)(i));
        (0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1));
    }
    // put back the index variable to original content
    (0, symbol_js_1.set_binding)(loopingVariable, p4);
    // return value
    return (0, symbol_js_1.symbol)(defs_js_1.NIL);
}
exports.Eval_for = Eval_for;
