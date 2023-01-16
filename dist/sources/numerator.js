"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numerator = exports.Eval_numerator = void 0;
const defs_js_1 = require("../runtime/defs.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const is_js_1 = require("./is.js");
const multiply_js_1 = require("./multiply.js");
const rationalize_js_1 = require("./rationalize.js");
function Eval_numerator(p1) {
    return numerator((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
exports.Eval_numerator = Eval_numerator;
function numerator(p1) {
    if ((0, defs_js_1.isadd)(p1)) {
        //console.trace "rationalising "
        p1 = (0, rationalize_js_1.rationalize)(p1);
    }
    //console.log "rationalised: " + p1
    if ((0, defs_js_1.ismultiply)(p1) && !(0, is_js_1.isplusone)((0, defs_js_1.car)((0, defs_js_1.cdr)(p1)))) {
        //console.log "p1 inside multiply: " + p1
        //console.log "first term: " + car(p1)
        return (0, multiply_js_1.multiply_all)(p1.tail().map(numerator));
    }
    if ((0, defs_js_1.isrational)(p1)) {
        return (0, bignum_js_1.mp_numerator)(p1);
    }
    if ((0, defs_js_1.ispower)(p1) && (0, is_js_1.isnegativeterm)((0, defs_js_1.caddr)(p1))) {
        return defs_js_1.Constants.one;
    }
    return p1;
}
exports.numerator = numerator;
