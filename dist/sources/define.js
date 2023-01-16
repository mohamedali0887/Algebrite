"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_function_reference = exports.define_user_function = void 0;
const defs_js_1 = require("../runtime/defs.js");
const run_js_1 = require("../runtime/run.js");
const symbol_js_1 = require("../runtime/symbol.js");
const eval_js_1 = require("./eval.js");
const list_js_1 = require("./list.js");
// Store a function definition
//
// Example:
//
//      f(x,y)=x^y
//
// For this definition, p1 points to the following structure.
//
//     p1
//      |
//   ___v__    ______                        ______
//  |CONS  |->|CONS  |--------------------->|CONS  |
//  |______|  |______|                      |______|
//      |         |                             |
//   ___v__    ___v__    ______    ______    ___v__    ______    ______
//  |SETQ  |  |CONS  |->|CONS  |->|CONS  |  |CONS  |->|CONS  |->|CONS  |
//  |______|  |______|  |______|  |______|  |______|  |______|  |______|
//                |         |         |         |         |         |
//             ___v__    ___v__    ___v__    ___v__    ___v__    ___v__
//            |SYM f |  |SYM x |  |SYM y |  |POWER |  |SYM x |  |SYM y |
//            |______|  |______|  |______|  |______|  |______|  |______|
//
// the result (in f) is a FUNCTION node
// that contains both the body and the argument list.
//
// We have
//
//  caadr(p1) points to the function name i.e. f
//  cdadr(p1) points to the arguments i.e. the list (x y)
//  caddr(p1) points to the function body i.e. (power x y)
// F function name
// A argument list
// B function body
function define_user_function(p1) {
    const F = (0, defs_js_1.caadr)(p1);
    const A = (0, defs_js_1.cdadr)(p1);
    let B = (0, defs_js_1.caddr)(p1);
    if (!(0, defs_js_1.issymbol)(F)) {
        (0, run_js_1.stop)('function name?');
    }
    // evaluate function body (maybe)
    if ((0, defs_js_1.car)(B) === (0, symbol_js_1.symbol)(defs_js_1.EVAL)) {
        B = (0, eval_js_1.Eval)((0, defs_js_1.cadr)(B));
    }
    // note how, unless explicitly forced by an eval,
    // (handled by the if just above)
    // we don't eval/simplify
    // the body.
    // Why? because it's the easiest way
    // to solve scope problems i.e.
    //   x = 0
    //   f(x) = x + 1
    //   f(4) # would reply 1
    // which would need to otherwise
    // be solved by some scope device
    // somehow
    B = (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.FUNCTION), B, A);
    (0, symbol_js_1.set_binding)(F, B);
    // return value is nil
    return (0, symbol_js_1.symbol)(defs_js_1.NIL);
}
exports.define_user_function = define_user_function;
function Eval_function_reference(p1) {
    return p1;
}
exports.Eval_function_reference = Eval_function_reference;
