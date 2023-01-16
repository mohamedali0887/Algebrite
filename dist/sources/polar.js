"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.polar = exports.Eval_polar = void 0;
const defs_js_1 = require("../runtime/defs.js");
const misc_js_1 = require("../sources/misc.js");
const abs_js_1 = require("./abs.js");
const arg_js_1 = require("./arg.js");
const eval_js_1 = require("./eval.js");
const multiply_js_1 = require("./multiply.js");
/*
Convert complex z to polar form

  Input:    p1  z
  Output:    Result

  polar(z) = abs(z) * exp(i * arg(z))
*/
function Eval_polar(p1) {
    return polar((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_polar = Eval_polar;
function polar(p1) {
    // there are points where we turn polar
    // representations into rect, we set a "stack flag"
    // here to avoid that, so we don't undo the
    // work that we are trying to do.
    return (0, defs_js_1.evalPolar)(() => {
        return (0, multiply_js_1.multiply)((0, abs_js_1.abs)(p1), (0, misc_js_1.exponential)((0, multiply_js_1.multiply)(defs_js_1.Constants.imaginaryunit, (0, arg_js_1.arg)(p1))));
    });
}
exports.polar = polar;
