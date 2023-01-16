"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yyfloat = exports.zzfloat = exports.Eval_float = void 0;
const count_js_1 = require("../runtime/count.js");
const defs_js_1 = require("../runtime/defs.js");
const run_js_1 = require("../runtime/run.js");
const symbol_js_1 = require("../runtime/symbol.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const list_js_1 = require("./list.js");
const tensor_js_1 = require("./tensor.js");
function Eval_float(p1) {
    return (0, defs_js_1.evalFloats)(() => {
        return (0, eval_js_1.Eval)(yyfloat((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1))));
    });
}
exports.Eval_float = Eval_float;
function checkFloatHasWorkedOutCompletely(nodeToCheck) {
    const numberOfPowers = (0, count_js_1.countOccurrencesOfSymbol)((0, symbol_js_1.symbol)(defs_js_1.POWER), nodeToCheck);
    const numberOfPIs = (0, count_js_1.countOccurrencesOfSymbol)((0, symbol_js_1.symbol)(defs_js_1.PI), nodeToCheck);
    const numberOfEs = (0, count_js_1.countOccurrencesOfSymbol)((0, symbol_js_1.symbol)(defs_js_1.E), nodeToCheck);
    const numberOfMults = (0, count_js_1.countOccurrencesOfSymbol)((0, symbol_js_1.symbol)(defs_js_1.MULTIPLY), nodeToCheck);
    const numberOfSums = (0, count_js_1.countOccurrencesOfSymbol)((0, symbol_js_1.symbol)(defs_js_1.ADD), nodeToCheck);
    if (defs_js_1.DEBUG) {
        console.log(`     ... numberOfPowers: ${numberOfPowers}`);
        console.log(`     ... numberOfPIs: ${numberOfPIs}`);
        console.log(`     ... numberOfEs: ${numberOfEs}`);
        console.log(`     ... numberOfMults: ${numberOfMults}`);
        console.log(`     ... numberOfSums: ${numberOfSums}`);
    }
    if (numberOfPowers > 1 ||
        numberOfPIs > 0 ||
        numberOfEs > 0 ||
        numberOfMults > 1 ||
        numberOfSums > 1) {
        return (0, run_js_1.stop)('float: some unevalued parts in ' + nodeToCheck);
    }
}
function zzfloat(p1) {
    (0, defs_js_1.evalFloats)(() => {
        //p1 = pop()
        //push(cadr(p1))
        //push(p1)
        p1 = (0, eval_js_1.Eval)(p1);
        p1 = yyfloat(p1);
        p1 = (0, eval_js_1.Eval)(p1); // normalize
    });
    return p1;
}
exports.zzfloat = zzfloat;
// zzfloat doesn't necessarily result in a double
// , for example if there are variables. But
// in many of the tests there should be indeed
// a float, this line comes handy to highlight
// when that doesn't happen for those tests.
//checkFloatHasWorkedOutCompletely(stack[tos-1])
function yyfloat(p1) {
    return (0, defs_js_1.evalFloats)(yyfloat_, p1);
}
exports.yyfloat = yyfloat;
function yyfloat_(p1) {
    if ((0, defs_js_1.iscons)(p1)) {
        return (0, list_js_1.makeList)(...p1.map(yyfloat_));
    }
    if ((0, defs_js_1.istensor)(p1)) {
        p1 = (0, tensor_js_1.copy_tensor)(p1);
        p1.tensor.elem = p1.tensor.elem.map(yyfloat_);
        return p1;
    }
    if ((0, defs_js_1.isrational)(p1)) {
        return (0, bignum_js_1.bignum_float)(p1);
    }
    if (p1 === (0, symbol_js_1.symbol)(defs_js_1.PI)) {
        return defs_js_1.Constants.piAsDouble;
    }
    if (p1 === (0, symbol_js_1.symbol)(defs_js_1.E)) {
        return (0, bignum_js_1.double)(Math.E);
    }
    return p1;
}
