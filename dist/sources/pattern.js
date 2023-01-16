"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval_patternsinfo = exports.Eval_clearpatterns = exports.do_clearPatterns = exports.Eval_pattern = exports.Eval_silentpattern = void 0;
const defs_js_1 = require("../runtime/defs.js");
const run_js_1 = require("../runtime/run.js");
const symbol_js_1 = require("../runtime/symbol.js");
const misc_js_1 = require("../sources/misc.js");
const list_js_1 = require("./list.js");
const print_js_1 = require("./print.js");
/*
  Add a pattern i.e. a substitution rule.
  Substitution rule needs a template as first argument
  and what to transform it to as second argument.
  Optional third argument is a boolean test which
  adds conditions to when the rule is applied.
*/
// same as Eval_pattern but only leaves
// NIL on stack at return, hence gives no
// printout
function Eval_silentpattern(p1) {
    Eval_pattern(p1);
    return (0, symbol_js_1.symbol)(defs_js_1.NIL);
}
exports.Eval_silentpattern = Eval_silentpattern;
function Eval_pattern(p1) {
    // check that the parameters are allright
    let thirdArgument;
    if (!(0, defs_js_1.iscons)((0, defs_js_1.cdr)(p1))) {
        (0, run_js_1.stop)('pattern needs at least a template and a transformed version');
    }
    const firstArgument = (0, defs_js_1.car)((0, defs_js_1.cdr)(p1));
    const secondArgument = (0, defs_js_1.car)((0, defs_js_1.cdr)((0, defs_js_1.cdr)(p1)));
    if (secondArgument === (0, symbol_js_1.symbol)(defs_js_1.NIL)) {
        (0, run_js_1.stop)('pattern needs at least a template and a transformed version');
    }
    // third argument is optional and contains the tests
    if (!(0, defs_js_1.iscons)((0, defs_js_1.cdr)((0, defs_js_1.cdr)(p1)))) {
        thirdArgument = (0, symbol_js_1.symbol)(defs_js_1.NIL);
    }
    else {
        thirdArgument = (0, defs_js_1.car)((0, defs_js_1.cdr)((0, defs_js_1.cdr)((0, defs_js_1.cdr)(p1))));
    }
    if ((0, misc_js_1.equal)(firstArgument, secondArgument)) {
        (0, run_js_1.stop)('recursive pattern');
    }
    // console.log "Eval_pattern of " + cdr(p1)
    // this is likely to create garbage collection
    // problems in the C version as it's an
    // untracked reference
    let stringKey = 'template: ' + (0, print_js_1.print_list)(firstArgument);
    stringKey += ' tests: ' + (0, print_js_1.print_list)(thirdArgument);
    if (defs_js_1.DEBUG) {
        console.log(`pattern stringkey: ${stringKey}`);
    }
    const patternPosition = defs_js_1.defs.userSimplificationsInStringForm.indexOf(stringKey);
    // if pattern is not there yet, add it, otherwise replace it
    if (patternPosition === -1) {
        //console.log "adding pattern because it doesn't exist: " + cdr(p1)
        defs_js_1.defs.userSimplificationsInStringForm.push(stringKey);
        defs_js_1.defs.userSimplificationsInListForm.push((0, defs_js_1.cdr)(p1));
    }
    else {
        if (defs_js_1.DEBUG) {
            console.log(`pattern already exists, replacing. ${(0, defs_js_1.cdr)(p1)}`);
        }
        defs_js_1.defs.userSimplificationsInStringForm[patternPosition] = stringKey;
        defs_js_1.defs.userSimplificationsInListForm[patternPosition] = (0, defs_js_1.cdr)(p1);
    }
    // return the pattern node itself so we can
    // give some printout feedback
    return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.PATTERN), (0, defs_js_1.cdr)(p1));
}
exports.Eval_pattern = Eval_pattern;
/*
  Clear all patterns
*/
function do_clearPatterns() {
    defs_js_1.defs.userSimplificationsInListForm = [];
    defs_js_1.defs.userSimplificationsInStringForm = [];
}
exports.do_clearPatterns = do_clearPatterns;
function Eval_clearpatterns() {
    // this is likely to create garbage collection
    // problems in the C version as it's an
    // untracked reference
    do_clearPatterns();
    // return nothing
    return (0, symbol_js_1.symbol)(defs_js_1.NIL);
}
exports.Eval_clearpatterns = Eval_clearpatterns;
function Eval_patternsinfo() {
    const patternsinfoToBePrinted = patternsinfo();
    if (patternsinfoToBePrinted !== '') {
        return new defs_js_1.Str(patternsinfoToBePrinted);
    }
    else {
        return (0, symbol_js_1.symbol)(defs_js_1.NIL);
    }
}
exports.Eval_patternsinfo = Eval_patternsinfo;
function patternsinfo() {
    let patternsinfoToBePrinted = '';
    for (let i of Array.from(defs_js_1.defs.userSimplificationsInListForm)) {
        patternsinfoToBePrinted += defs_js_1.defs.userSimplificationsInListForm + '\n';
    }
    return patternsinfoToBePrinted;
}
