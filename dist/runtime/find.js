"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPossibleExponentialForm = exports.findPossibleClockForm = exports.Find = void 0;
const is_js_1 = require("../sources/is.js");
const misc_js_1 = require("../sources/misc.js");
const defs_js_1 = require("./defs.js");
const symbol_js_1 = require("./symbol.js");
// returns true if expr p contains expr q, otherwise returns false
function Find(p, q) {
    if ((0, misc_js_1.equal)(p, q)) {
        return true;
    }
    if ((0, defs_js_1.istensor)(p)) {
        for (let i = 0; i < p.tensor.nelem; i++) {
            if (Find(p.tensor.elem[i], q)) {
                return true;
            }
        }
        return false;
    }
    if ((0, defs_js_1.iscons)(p)) {
        return [...p].some((p1) => Find(p1, q));
    }
    return false;
}
exports.Find = Find;
// find stuff like (-1)^(something (but disregard
// imaginary units which are in the form (-1)^(1/2))
function findPossibleClockForm(p, p1) {
    if ((0, is_js_1.isimaginaryunit)(p)) {
        return false;
    }
    if ((0, defs_js_1.ispower)(p) && !(0, is_js_1.isinteger)((0, defs_js_1.caddr)(p1))) {
        if (Find((0, defs_js_1.cadr)(p), defs_js_1.Constants.imaginaryunit)) {
            //console.log "found i^fraction " + p
            return true;
        }
    }
    if ((0, defs_js_1.ispower)(p) && (0, is_js_1.equaln)((0, defs_js_1.cadr)(p), -1) && !(0, is_js_1.isinteger)((0, defs_js_1.caddr)(p1))) {
        //console.log "found -1^fraction in " + p
        return true;
    }
    if ((0, defs_js_1.istensor)(p)) {
        for (let i = 0; i < p.tensor.nelem; i++) {
            if (findPossibleClockForm(p.tensor.elem[i], p1)) {
                return true;
            }
        }
        return false;
    }
    if ((0, defs_js_1.iscons)(p)) {
        return [...p].some((el) => findPossibleClockForm(el, p1));
    }
    return false;
}
exports.findPossibleClockForm = findPossibleClockForm;
// find stuff like (e)^(i something)
function findPossibleExponentialForm(p) {
    if ((0, defs_js_1.ispower)(p) && (0, defs_js_1.cadr)(p) === (0, symbol_js_1.symbol)(defs_js_1.E)) {
        return Find((0, defs_js_1.caddr)(p), defs_js_1.Constants.imaginaryunit);
    }
    if ((0, defs_js_1.istensor)(p)) {
        for (let i = 0; i < p.tensor.nelem; i++) {
            if (findPossibleExponentialForm(p.tensor.elem[i])) {
                return true;
            }
        }
        return false;
    }
    if ((0, defs_js_1.iscons)(p)) {
        return [...p].some(findPossibleExponentialForm);
    }
    return false;
}
exports.findPossibleExponentialForm = findPossibleExponentialForm;
