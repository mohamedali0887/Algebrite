"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arg = exports.Eval_arg = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const add_js_1 = require("./add.js");
const arctan_js_1 = require("./arctan.js");
const denominator_js_1 = require("./denominator.js");
const eval_js_1 = require("./eval.js");
const imag_js_1 = require("./imag.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const multiply_js_1 = require("./multiply.js");
const numerator_js_1 = require("./numerator.js");
const real_js_1 = require("./real.js");
const rect_js_1 = require("./rect.js");
/* arg =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
z

General description
-------------------
Returns the angle of complex z.

*/
/*
 Argument (angle) of complex z

  z    arg(z)
  -    ------

  a    0

  -a    -pi      See note 3 below

  (-1)^a    a pi

  exp(a + i b)  b

  a b    arg(a) + arg(b)

  a + i b    arctan(b/a)

Result by quadrant

  z    arg(z)
  -    ------

  1 + i    1/4 pi

  1 - i    -1/4 pi

  -1 + i    3/4 pi

  -1 - i    -3/4 pi

Notes

  1. Handles mixed polar and rectangular forms, e.g. 1 + exp(i pi/3)

  2. Symbols in z are assumed to be positive and real.

  3. Negative direction adds -pi to angle.

     Example: z = (-1)^(1/3), abs(z) = 1/3 pi, abs(-z) = -2/3 pi

  4. jean-francois.debroux reports that when z=(a+i*b)/(c+i*d) then

    arg(numerator(z)) - arg(denominator(z))

     must be used to get the correct answer. Now the operation is
     automatic.
*/
const DEBUG_ARG = false;
function Eval_arg(z) {
    return arg((0, eval_js_1.Eval)((0, defs_js_1.cadr)(z)));
}
exports.Eval_arg = Eval_arg;
function arg(z) {
    return (0, add_js_1.subtract)(yyarg((0, numerator_js_1.numerator)(z)), yyarg((0, denominator_js_1.denominator)(z)));
}
exports.arg = arg;
function yyarg(p1) {
    // case of plain number
    if ((0, is_js_1.ispositivenumber)(p1) || p1 === (0, symbol_js_1.symbol)(defs_js_1.PI)) {
        return (0, defs_js_1.isdouble)(p1) || defs_js_1.defs.evaluatingAsFloats
            ? defs_js_1.Constants.zeroAsDouble
            : defs_js_1.Constants.zero;
    }
    if ((0, is_js_1.isnegativenumber)(p1)) {
        const pi = (0, defs_js_1.isdouble)(p1) || defs_js_1.defs.evaluatingAsFloats
            ? defs_js_1.Constants.piAsDouble
            : (0, symbol_js_1.symbol)(defs_js_1.PI);
        return (0, multiply_js_1.negate)(pi);
    }
    // you'd think that something like
    // arg(a) is always 0 when a is real but no,
    // arg(a) is pi when a is negative so we have
    // to leave unexpressed
    if ((0, defs_js_1.issymbol)(p1)) {
        return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.ARG), p1);
    }
    if ((0, defs_js_1.ispower)(p1) && (0, is_js_1.equaln)((0, defs_js_1.cadr)(p1), -1)) {
        // -1 to a power
        return (0, multiply_js_1.multiply)(defs_js_1.Constants.Pi(), (0, defs_js_1.caddr)(p1));
    }
    if ((0, defs_js_1.ispower)(p1) && (0, defs_js_1.cadr)(p1) === (0, symbol_js_1.symbol)(defs_js_1.E)) {
        // exponential
        // arg(a^(1/2)) is always equal to 1/2 * arg(a)
        // this can obviously be made more generic TODO
        return (0, imag_js_1.imag)((0, defs_js_1.caddr)(p1));
    }
    if ((0, defs_js_1.ispower)(p1) && (0, is_js_1.isoneovertwo)((0, defs_js_1.caddr)(p1))) {
        const arg1 = arg((0, defs_js_1.cadr)(p1));
        if (DEBUG_ARG) {
            console.log(`arg of a sqrt: ${p1}`);
            defs_js_1.breakpoint;
            console.log(` = 1/2 * ${arg1}`);
        }
        return (0, multiply_js_1.multiply)(arg1, (0, defs_js_1.caddr)(p1));
    }
    if ((0, defs_js_1.ismultiply)(p1)) {
        // product of factors
        return p1.tail().map(arg).reduce(add_js_1.add, defs_js_1.Constants.zero);
    }
    if ((0, defs_js_1.isadd)(p1)) {
        // sum of terms
        p1 = (0, rect_js_1.rect)(p1);
        const RE = (0, real_js_1.real)(p1);
        const IM = (0, imag_js_1.imag)(p1);
        if ((0, is_js_1.isZeroAtomOrTensor)(RE)) {
            if ((0, is_js_1.isnegative)(IM)) {
                return (0, multiply_js_1.negate)(defs_js_1.Constants.Pi());
            }
            else {
                return defs_js_1.Constants.Pi();
            }
        }
        else {
            const arg1 = (0, arctan_js_1.arctan)((0, multiply_js_1.divide)(IM, RE));
            if ((0, is_js_1.isnegative)(RE)) {
                if ((0, is_js_1.isnegative)(IM)) {
                    return (0, add_js_1.subtract)(arg1, defs_js_1.Constants.Pi()); // quadrant 1 -> 3
                }
                else {
                    return (0, add_js_1.add)(arg1, defs_js_1.Constants.Pi()); // quadrant 4 -> 2
                }
            }
            return arg1;
        }
    }
    if (!(0, is_js_1.isZeroAtomOrTensor)((0, symbol_js_1.get_binding)((0, symbol_js_1.symbol)(defs_js_1.ASSUME_REAL_VARIABLES)))) {
        // if we assume all passed values are real
        return defs_js_1.Constants.zero;
    }
    // if we don't assume all passed values are real, all
    // we con do is to leave unexpressed
    return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.ARG), p1);
}
