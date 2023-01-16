"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.absval = exports.abs = exports.absValFloat = exports.Eval_abs = void 0;
const defs_js_1 = require("../runtime/defs.js");
const find_js_1 = require("../runtime/find.js");
const run_js_1 = require("../runtime/run.js");
const symbol_js_1 = require("../runtime/symbol.js");
const misc_js_1 = require("../sources/misc.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const conj_js_1 = require("./conj.js");
const denominator_js_1 = require("./denominator.js");
const eval_js_1 = require("./eval.js");
const float_js_1 = require("./float.js");
const imag_js_1 = require("./imag.js");
const inner_js_1 = require("./inner.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const multiply_js_1 = require("./multiply.js");
const numerator_js_1 = require("./numerator.js");
const power_js_1 = require("./power.js");
const real_js_1 = require("./real.js");
const rect_js_1 = require("./rect.js");
const simplify_js_1 = require("./simplify.js");
//(docs are generated from top-level comments, keep an eye on the formatting!)
/* abs =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------
Returns the absolute value of a real number, the magnitude of a complex number, or the vector length.

*/
/*
 Absolute value of a number,or magnitude of complex z, or norm of a vector

  z    abs(z)
  -    ------

  a    a

  -a    a

  (-1)^a    1

  exp(a + i b)  exp(a)

  a b    abs(a) abs(b)

  a + i b    sqrt(a^2 + b^2)

Notes

  1. Handles mixed polar and rectangular forms, e.g. 1 + exp(i pi/3)

  2. jean-francois.debroux reports that when z=(a+i*b)/(c+i*d) then

    abs(numerator(z)) / abs(denominator(z))

     must be used to get the correct answer. Now the operation is
     automatic.
*/
const DEBUG_ABS = false;
function Eval_abs(p1) {
    return abs((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_abs = Eval_abs;
function absValFloat(p1) {
    return (0, float_js_1.zzfloat)((0, eval_js_1.Eval)(absval((0, eval_js_1.Eval)(p1))));
}
exports.absValFloat = absValFloat;
// zzfloat of an abs doesn't necessarily result in a double
// , for example if there are variables. But
// in many of the tests there should be indeed
// a float, these two lines come handy to highlight
// when that doesn't happen for those tests.
//if !isdouble(stack[tos-1])
//  stop("absValFloat should return a double and instead got: " + stack[tos-1])
function abs(p1) {
    const numer = (0, numerator_js_1.numerator)(p1);
    const absNumer = absval(numer);
    const denom = (0, denominator_js_1.denominator)(p1);
    const absDenom = absval(denom);
    const result = (0, multiply_js_1.divide)(absNumer, absDenom);
    if (DEBUG_ABS) {
        console.trace('>>>>  ABS of ' + p1);
        console.log(`ABS numerator ${numer}`);
        console.log(`ABSVAL numerator: ${absNumer}`);
        console.log(`ABS denominator: ${denom}`);
        console.log(`ABSVAL denominator: ${absDenom}`);
        console.log(`ABSVAL divided: ${result}`);
        console.log('<<<<<<<  ABS');
    }
    return result;
}
exports.abs = abs;
function absval(p1) {
    const input = p1;
    if (DEBUG_ABS) {
        console.log(`ABS of ${p1}`);
    }
    // handle all the "number" cases first -----------------------------------------
    if ((0, is_js_1.isZeroAtomOrTensor)(p1)) {
        if (DEBUG_ABS) {
            console.log(` abs: ${p1} just zero`);
            console.log(' --> ABS of ' + input + ' : ' + defs_js_1.Constants.zero);
        }
        return defs_js_1.Constants.zero;
    }
    if ((0, is_js_1.isnegativenumber)(p1)) {
        if (DEBUG_ABS) {
            console.log(` abs: ${p1} just a negative`);
        }
        return (0, multiply_js_1.negate)(p1);
    }
    if ((0, is_js_1.ispositivenumber)(p1)) {
        if (DEBUG_ABS) {
            console.log(` abs: ${p1} just a positive`);
            console.log(` --> ABS of ${input} : ${p1}`);
        }
        return p1;
    }
    if (p1 === (0, symbol_js_1.symbol)(defs_js_1.PI)) {
        if (DEBUG_ABS) {
            console.log(` abs: ${p1} of PI`);
            console.log(` --> ABS of ${input} : ${p1}`);
        }
        return p1;
    }
    // ??? should there be a shortcut case here for the imaginary unit?
    // now handle decomposition cases ----------------------------------------------
    // we catch the "add", "power", "multiply" cases first,
    // before falling back to the
    // negative/positive cases because there are some
    // simplification thay we might be able to do.
    // Note that for this routine to give a correct result, this
    // must be a sum where a complex number appears.
    // If we apply this to "a+b", we get an incorrect result.
    if ((0, defs_js_1.isadd)(p1) &&
        ((0, find_js_1.findPossibleClockForm)(p1, p1) ||
            (0, find_js_1.findPossibleExponentialForm)(p1) ||
            (0, find_js_1.Find)(p1, defs_js_1.Constants.imaginaryunit))) {
        if (DEBUG_ABS) {
            console.log(` abs: ${p1} is a sum`);
            console.log('abs of a sum');
        }
        // sum
        p1 = (0, rect_js_1.rect)(p1); // convert polar terms, if any
        const result = (0, simplify_js_1.simplify_trig)((0, power_js_1.power)(
        // prettier-ignore
        (0, add_js_1.add)((0, power_js_1.power)((0, real_js_1.real)(p1), (0, bignum_js_1.integer)(2)), (0, power_js_1.power)((0, imag_js_1.imag)(p1), (0, bignum_js_1.integer)(2))), (0, bignum_js_1.rational)(1, 2)));
        if (DEBUG_ABS) {
            console.log(` --> ABS of ${input} : ${result}`);
        }
        return result;
    }
    if ((0, defs_js_1.ispower)(p1) && (0, is_js_1.equaln)((0, defs_js_1.cadr)(p1), -1)) {
        // -1 to any power
        const one = defs_js_1.Constants.One();
        if (DEBUG_ABS) {
            console.log(` abs: ${p1} is -1 to any power`);
            const msg = defs_js_1.defs.evaluatingAsFloats
                ? ' abs: numeric, so result is 1.0'
                : ' abs: symbolic, so result is 1';
            console.log(msg);
            console.log(` --> ABS of ${input} : ${one}`);
        }
        return one;
    }
    // abs(a^b) is equal to abs(a)^b IF b is positive
    if ((0, defs_js_1.ispower)(p1) && (0, is_js_1.ispositivenumber)((0, defs_js_1.caddr)(p1))) {
        const result = (0, power_js_1.power)(abs((0, defs_js_1.cadr)(p1)), (0, defs_js_1.caddr)(p1));
        if (DEBUG_ABS) {
            console.log(` abs: ${p1} is something to the power of a positive number`);
            console.log(` --> ABS of ${input} : ${result}`);
        }
        return result;
    }
    // abs(e^something)
    if ((0, defs_js_1.ispower)(p1) && (0, defs_js_1.cadr)(p1) === (0, symbol_js_1.symbol)(defs_js_1.E)) {
        // exponential
        const result = (0, misc_js_1.exponential)((0, real_js_1.real)((0, defs_js_1.caddr)(p1)));
        if (DEBUG_ABS) {
            console.log(` abs: ${p1} is an exponential`);
            console.log(` --> ABS of ${input} : ${result}`);
        }
        return result;
    }
    if ((0, defs_js_1.ismultiply)(p1)) {
        // product
        const result = p1.tail().map(absval).reduce(multiply_js_1.multiply);
        if (DEBUG_ABS) {
            console.log(` abs: ${p1} is a product`);
            console.log(` --> ABS of ${input} : ${result}`);
        }
        return result;
    }
    if ((0, defs_js_1.car)(p1) === (0, symbol_js_1.symbol)(defs_js_1.ABS)) {
        const absOfAbs = (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.ABS), (0, defs_js_1.cadr)(p1));
        if (DEBUG_ABS) {
            console.log(` abs: ${p1} is abs of a abs`);
            console.log(` --> ABS of ${input} : ${absOfAbs}`);
        }
        return absOfAbs;
    }
    /*
    * Evaluation via zzfloat()
    * ...while this is in theory a powerful mechanism, I've commented it
    * out because I've refined this method enough to not need this.
    * Evaling via zzfloat() is in principle more problematic because it could
    * require further evaluations which could end up in further "abs" which
    * would end up in infinite loops. Better not use it if not necessary.
  
    * we look directly at the float evaluation of the argument
    * to see if we end up with a number, which would mean that there
    * is no imaginary component and we can just return the input
    * (or its negation) as the result.
    push p1
    zzfloat()
    floatEvaluation = pop()
  
    if (isnegativenumber(floatEvaluation))
      if DEBUG_ABS then console.log " abs: " + p1 + " just a negative"
      push(p1)
      negate()
      restore()
      return
  
    if (ispositivenumber(floatEvaluation))
      if DEBUG_ABS then console.log " abs: " + p1 + " just a positive"
      push(p1)
      if DEBUG_ABS then console.log " --> ABS of " + input + " : " + stack[tos-1]
      restore()
      return
    */
    if ((0, defs_js_1.istensor)(p1)) {
        return absval_tensor(p1);
    }
    if ((0, is_js_1.isnegativeterm)(p1) || ((0, defs_js_1.isadd)(p1) && (0, is_js_1.isnegativeterm)((0, defs_js_1.cadr)(p1)))) {
        p1 = (0, multiply_js_1.negate)(p1);
    }
    const l = (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.ABS), p1);
    if (DEBUG_ABS) {
        console.log(` abs: ${p1} is nothing decomposable`);
        console.log(` --> ABS of ${input} : ${l}`);
    }
    return l;
}
exports.absval = absval;
// also called the "norm" of a vector
function absval_tensor(p1) {
    if (p1.tensor.ndim !== 1) {
        (0, run_js_1.stop)('abs(tensor) with tensor rank > 1');
    }
    return (0, eval_js_1.Eval)((0, simplify_js_1.simplify)((0, power_js_1.power)((0, inner_js_1.inner)(p1, (0, conj_js_1.conjugate)(p1)), (0, bignum_js_1.rational)(1, 2))));
}
