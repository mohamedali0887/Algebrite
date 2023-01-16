"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.areunivarpolysfactoredorexpandedform = exports.gcd = exports.Eval_gcd = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const misc_js_1 = require("../sources/misc.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const eval_js_1 = require("./eval.js");
const factorpoly_js_1 = require("./factorpoly.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const multiply_js_1 = require("./multiply.js");
const power_js_1 = require("./power.js");
// Greatest common denominator
// can also be run on polynomials, however
// it works only on the integers and it works
// by factoring the polynomials (not Euclidean algorithm)
function Eval_gcd(p1) {
    p1 = (0, defs_js_1.cdr)(p1);
    let result = (0, eval_js_1.Eval)((0, defs_js_1.car)(p1));
    if ((0, defs_js_1.iscons)(p1)) {
        result = p1.tail().reduce((acc, p) => gcd(acc, (0, eval_js_1.Eval)(p)), result);
    }
    return result;
}
exports.Eval_gcd = Eval_gcd;
function gcd(p1, p2) {
    return (0, defs_js_1.doexpand)(gcd_main, p1, p2);
}
exports.gcd = gcd;
function gcd_main(p1, p2) {
    let polyVar;
    if ((0, misc_js_1.equal)(p1, p2)) {
        return p1;
    }
    if ((0, defs_js_1.isrational)(p1) && (0, defs_js_1.isrational)(p2)) {
        return (0, bignum_js_1.gcd_numbers)(p1, p2);
    }
    if (polyVar = areunivarpolysfactoredorexpandedform(p1, p2)) {
        return gcd_polys(p1, p2, polyVar);
    }
    if ((0, defs_js_1.isadd)(p1) && (0, defs_js_1.isadd)(p2)) {
        return gcd_sum_sum(p1, p2);
    }
    if ((0, defs_js_1.isadd)(p1)) {
        p1 = gcd_sum(p1);
    }
    if ((0, defs_js_1.isadd)(p2)) {
        p2 = gcd_sum(p2);
    }
    if ((0, defs_js_1.ismultiply)(p1)) {
        return gcd_sum_product(p1, p2);
    }
    if ((0, defs_js_1.ismultiply)(p2)) {
        return gcd_product_sum(p1, p2);
    }
    if ((0, defs_js_1.ismultiply)(p1) && (0, defs_js_1.ismultiply)(p2)) {
        return gcd_product_product(p1, p2);
    }
    return gcd_powers_with_same_base(p1, p2);
}
// TODO this should probably be in "is"?
function areunivarpolysfactoredorexpandedform(p1, p2) {
    let polyVar;
    if (polyVar = (0, is_js_1.isunivarpolyfactoredorexpandedform)(p1)) {
        if ((0, is_js_1.isunivarpolyfactoredorexpandedform)(p2, polyVar)) {
            return polyVar;
        }
    }
}
exports.areunivarpolysfactoredorexpandedform = areunivarpolysfactoredorexpandedform;
function gcd_polys(p1, p2, polyVar) {
    p1 = (0, factorpoly_js_1.factorpoly)(p1, polyVar);
    p2 = (0, factorpoly_js_1.factorpoly)(p2, polyVar);
    if ((0, defs_js_1.ismultiply)(p1) || (0, defs_js_1.ismultiply)(p2)) {
        if (!(0, defs_js_1.ismultiply)(p1)) {
            p1 = (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.MULTIPLY), p1, defs_js_1.Constants.one);
        }
        if (!(0, defs_js_1.ismultiply)(p2)) {
            p2 = (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.MULTIPLY), p2, defs_js_1.Constants.one);
        }
    }
    if ((0, defs_js_1.ismultiply)(p1) && (0, defs_js_1.ismultiply)(p2)) {
        return gcd_product_product(p1, p2);
    }
    return gcd_powers_with_same_base(p1, p2);
}
function gcd_product_product(p1, p2) {
    let p3 = (0, defs_js_1.cdr)(p1);
    let p4 = (0, defs_js_1.cdr)(p2);
    if ((0, defs_js_1.iscons)(p3)) {
        return [...p3].reduce((acc, pOuter) => {
            if ((0, defs_js_1.iscons)(p4)) {
                return (0, multiply_js_1.multiply)(acc, [...p4].reduce((innerAcc, pInner) => (0, multiply_js_1.multiply)(innerAcc, gcd(pOuter, pInner)), defs_js_1.Constants.one));
            }
        }, defs_js_1.Constants.one);
    }
    // another, (maybe more readable?) version:
    /*
    let totalProduct:U = Constants.one;
    let p3 = cdr(p1)
    while (iscons(p3)) {
  
      let p4: U = cdr(p2)
  
      if (iscons(p4)) {
        totalProduct = [...p4].reduce(
            ((acc: U, p: U) =>
                multiply(gcd(car(p3), p), acc))
            , totalProduct
        );
      }
  
      p3 = cdr(p3);
    }
  
    return totalProduct;
    */
}
function gcd_powers_with_same_base(base1, base2) {
    let exponent1, exponent2, p6;
    if ((0, defs_js_1.ispower)(base1)) {
        exponent1 = (0, defs_js_1.caddr)(base1); // exponent
        base1 = (0, defs_js_1.cadr)(base1); // base
    }
    else {
        exponent1 = defs_js_1.Constants.one;
    }
    if ((0, defs_js_1.ispower)(base2)) {
        exponent2 = (0, defs_js_1.caddr)(base2); // exponent
        base2 = (0, defs_js_1.cadr)(base2); // base
    }
    else {
        exponent2 = defs_js_1.Constants.one;
    }
    if (!(0, misc_js_1.equal)(base1, base2)) {
        return defs_js_1.Constants.one;
    }
    // are both exponents numerical?
    if ((0, defs_js_1.isNumericAtom)(exponent1) && (0, defs_js_1.isNumericAtom)(exponent2)) {
        const exponent = (0, misc_js_1.lessp)(exponent1, exponent2) ? exponent1 : exponent2;
        return (0, power_js_1.power)(base1, exponent);
    }
    // are the exponents multiples of eah other?
    let p5 = (0, multiply_js_1.divide)(exponent1, exponent2);
    if ((0, defs_js_1.isNumericAtom)(p5)) {
        // choose the smallest exponent
        p5 =
            (0, defs_js_1.ismultiply)(exponent1) && (0, defs_js_1.isNumericAtom)((0, defs_js_1.cadr)(exponent1))
                ? (0, defs_js_1.cadr)(exponent1)
                : defs_js_1.Constants.one;
        p6 =
            (0, defs_js_1.ismultiply)(exponent2) && (0, defs_js_1.isNumericAtom)((0, defs_js_1.cadr)(exponent2))
                ? (0, defs_js_1.cadr)(exponent2)
                : defs_js_1.Constants.one;
        const exponent = (0, misc_js_1.lessp)(p5, p6) ? exponent1 : exponent2;
        return (0, power_js_1.power)(base1, exponent);
    }
    p5 = (0, add_js_1.subtract)(exponent1, exponent2);
    if (!(0, defs_js_1.isNumericAtom)(p5)) {
        return defs_js_1.Constants.one;
    }
    // can't be equal because of test near beginning
    const exponent = (0, is_js_1.isnegativenumber)(p5) ? exponent1 : exponent2;
    return (0, power_js_1.power)(base1, exponent);
}
// in this case gcd is used as a composite function, i.e. gcd(gcd(gcd...
function gcd_sum_sum(p1, p2) {
    let p3, p4, p5, p6;
    if ((0, misc_js_1.length)(p1) !== (0, misc_js_1.length)(p2)) {
        return defs_js_1.Constants.one;
    }
    p3 = (0, defs_js_1.iscons)(p1) ? p1.tail().reduce(gcd) : (0, defs_js_1.car)((0, defs_js_1.cdr)(p1));
    p4 = (0, defs_js_1.iscons)(p2) ? p2.tail().reduce(gcd) : (0, defs_js_1.car)((0, defs_js_1.cdr)(p2));
    p5 = (0, multiply_js_1.divide)(p1, p3);
    p6 = (0, multiply_js_1.divide)(p2, p4);
    if ((0, misc_js_1.equal)(p5, p6)) {
        return (0, multiply_js_1.multiply)(p5, gcd(p3, p4));
    }
    return defs_js_1.Constants.one;
}
function gcd_sum(p) {
    return (0, defs_js_1.iscons)(p) ? p.tail().reduce(gcd) : (0, defs_js_1.car)((0, defs_js_1.cdr)(p));
}
function gcd_term_term(p1, p2) {
    if (!(0, defs_js_1.iscons)(p1) || !(0, defs_js_1.iscons)(p2)) {
        return defs_js_1.Constants.one;
    }
    return p1.tail().reduce((a, b) => {
        return p2.tail().reduce((x, y) => (0, multiply_js_1.multiply)(x, gcd(b, y)), a);
    }, defs_js_1.Constants.one);
}
function gcd_sum_product(p1, p2) {
    return (0, defs_js_1.iscons)(p1)
        ? p1.tail().reduce((a, b) => (0, multiply_js_1.multiply)(a, gcd(b, p2)), defs_js_1.Constants.one)
        : defs_js_1.Constants.one;
}
function gcd_product_sum(p1, p2) {
    return (0, defs_js_1.iscons)(p2)
        ? p2.tail().reduce((a, b) => (0, multiply_js_1.multiply)(a, gcd(p1, b)), defs_js_1.Constants.one)
        : defs_js_1.Constants.one;
}
