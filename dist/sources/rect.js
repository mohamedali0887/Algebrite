"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rect = exports.Eval_rect = void 0;
const defs_js_1 = require("../runtime/defs.js");
const find_js_1 = require("../runtime/find.js");
const symbol_js_1 = require("../runtime/symbol.js");
const abs_js_1 = require("./abs.js");
const add_js_1 = require("./add.js");
const arg_js_1 = require("./arg.js");
const cos_js_1 = require("./cos.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const multiply_js_1 = require("./multiply.js");
const sin_js_1 = require("./sin.js");
/*
Convert complex z to rectangular form

  Input:    push  z

  Output:    Result on stack
*/
const DEBUG_RECT = false;
function Eval_rect(p1) {
    return rect((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_rect = Eval_rect;
function rect(p1) {
    const input = p1;
    if (DEBUG_RECT) {
        console.log(`RECT of ${input}`);
        console.log(`any clock forms in : ${input} ? ${(0, find_js_1.findPossibleClockForm)(input, p1)}`);
    }
    // if we assume real variables, then the
    // rect of any symbol is the symbol itself
    // (note that 'i' is not a symbol, it's made of (-1)^(1/2))
    // otherwise we have to leave unevalled
    if ((0, defs_js_1.issymbol)(p1)) {
        if (DEBUG_RECT) {
            console.log(` rect: simple symbol: ${input}`);
        }
        if (!(0, is_js_1.isZeroAtomOrTensor)((0, symbol_js_1.get_binding)((0, symbol_js_1.symbol)(defs_js_1.ASSUME_REAL_VARIABLES)))) {
            return p1;
        }
        return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.YYRECT), p1);
        // TODO this is quite dirty, ideally we don't need this
        // but removing this creates a few failings in the tests
        // that I can't investigate right now.
        // --
        // if we assume all variables are real AND
        // it's not an exponential nor a polar nor a clock form
        // THEN rect(_) = _
        // note that these matches can be quite sloppy, one can find expressions
        // which shouldn't match but do
        //
    }
    if (!(0, is_js_1.isZeroAtomOrTensor)((0, symbol_js_1.get_binding)((0, symbol_js_1.symbol)(defs_js_1.ASSUME_REAL_VARIABLES))) &&
        !(0, find_js_1.findPossibleExponentialForm)(p1) && // no exp form?
        !(0, find_js_1.findPossibleClockForm)(p1, p1) && // no clock form?
        !((0, find_js_1.Find)(p1, (0, symbol_js_1.symbol)(defs_js_1.SIN)) &&
            (0, find_js_1.Find)(p1, (0, symbol_js_1.symbol)(defs_js_1.COS)) &&
            (0, find_js_1.Find)(p1, defs_js_1.Constants.imaginaryunit))) {
        // no polar form?
        if (DEBUG_RECT) {
            console.log(` rect: simple symbol: ${input}`);
        }
        return p1; // ib
    }
    if ((0, defs_js_1.ismultiply)(p1) &&
        (0, is_js_1.isimaginaryunit)((0, defs_js_1.cadr)(p1)) &&
        !(0, is_js_1.isZeroAtomOrTensor)((0, symbol_js_1.get_binding)((0, symbol_js_1.symbol)(defs_js_1.ASSUME_REAL_VARIABLES)))) {
        return p1; // sum
    }
    if ((0, defs_js_1.isadd)(p1)) {
        if (DEBUG_RECT) {
            console.log(` rect - ${input} is a sum `);
        }
        return p1.tail().reduce((a, b) => (0, add_js_1.add)(a, rect(b)), defs_js_1.Constants.zero);
    }
    // try to get to the rectangular form by doing
    // abs(p1) * (cos (theta) + i * sin(theta))
    // where theta is arg(p1)
    // abs(z) * (cos(arg(z)) + i sin(arg(z)))
    const result = (0, multiply_js_1.multiply)((0, abs_js_1.abs)(p1), (0, add_js_1.add)((0, cos_js_1.cosine)((0, arg_js_1.arg)(p1)), (0, multiply_js_1.multiply)(defs_js_1.Constants.imaginaryunit, (0, sin_js_1.sine)((0, arg_js_1.arg)(p1)))));
    if (DEBUG_RECT) {
        console.log(` rect - ${input} is NOT a sum `);
        console.log(` rect - ${input} abs: ${(0, abs_js_1.abs)(p1)}`);
        console.log(` rect - ${input} arg of ${p1} : ${p1}`);
        console.log(` rect - ${input} cosine: ${(0, cos_js_1.cosine)((0, arg_js_1.arg)(p1))}`);
        console.log(` rect - ${input} sine: ${(0, sin_js_1.sine)((0, arg_js_1.arg)(p1))}`);
        console.log(` rect - ${input} i * sine: ${(0, multiply_js_1.multiply)(defs_js_1.Constants.imaginaryunit, (0, sin_js_1.sine)((0, arg_js_1.arg)(p1)))}`);
        console.log(` rect - ${input} cos + i * sine: ${(0, add_js_1.add)((0, cos_js_1.cosine)((0, arg_js_1.arg)(p1)), (0, multiply_js_1.multiply)(defs_js_1.Constants.imaginaryunit, (0, sin_js_1.sine)((0, arg_js_1.arg)(p1))))}`);
        console.log(`rect of ${input} : ${result}`);
    }
    return result;
}
exports.rect = rect;
