"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roots = exports.Eval_roots = void 0;
const alloc_js_1 = require("../runtime/alloc.js");
const defs_js_1 = require("../runtime/defs.js");
const run_js_1 = require("../runtime/run.js");
const symbol_js_1 = require("../runtime/symbol.js");
const misc_js_1 = require("../sources/misc.js");
const abs_js_1 = require("./abs.js");
const add_js_1 = require("./add.js");
const bignum_js_1 = require("./bignum.js");
const coeff_js_1 = require("./coeff.js");
const eval_js_1 = require("./eval.js");
const factorpoly_js_1 = require("./factorpoly.js");
const guess_js_1 = require("./guess.js");
const is_js_1 = require("./is.js");
const multiply_js_1 = require("./multiply.js");
const power_js_1 = require("./power.js");
const simplify_js_1 = require("./simplify.js");
const log = {
    debug: (str) => {
        if (defs_js_1.DEBUG) {
            console.log(str);
        }
    },
};
const flatten = (arr) => [].concat(...arr);
//define POLY p1
//define X p2
//define A p3
//define B p4
//define C p5
//define Y p6
function Eval_roots(POLY) {
    // A == B -> A - B
    let X = (0, defs_js_1.cadr)(POLY);
    let POLY1;
    if ((0, defs_js_1.car)(X) === (0, symbol_js_1.symbol)(defs_js_1.SETQ) || (0, defs_js_1.car)(X) === (0, symbol_js_1.symbol)(defs_js_1.TESTEQ)) {
        POLY1 = (0, add_js_1.subtract)((0, eval_js_1.Eval)((0, defs_js_1.cadr)(X)), (0, eval_js_1.Eval)((0, defs_js_1.caddr)(X)));
    }
    else {
        X = (0, eval_js_1.Eval)(X);
        if ((0, defs_js_1.car)(X) === (0, symbol_js_1.symbol)(defs_js_1.SETQ) || (0, defs_js_1.car)(X) === (0, symbol_js_1.symbol)(defs_js_1.TESTEQ)) {
            POLY1 = (0, add_js_1.subtract)((0, eval_js_1.Eval)((0, defs_js_1.cadr)(X)), (0, eval_js_1.Eval)((0, defs_js_1.caddr)(X)));
        }
        else {
            POLY1 = X;
        }
    }
    // 2nd arg, x
    X = (0, eval_js_1.Eval)((0, defs_js_1.caddr)(POLY));
    const X1 = X === (0, symbol_js_1.symbol)(defs_js_1.NIL) ? (0, guess_js_1.guess)(POLY1) : X;
    if (!(0, is_js_1.ispolyexpandedform)(POLY1, X1)) {
        (0, run_js_1.stop)('roots: 1st argument is not a polynomial in the variable ' + X1);
    }
    return roots(POLY1, X1);
}
exports.Eval_roots = Eval_roots;
function hasImaginaryCoeff(k) {
    return k.some((c) => (0, is_js_1.iscomplexnumber)(c));
}
// k[0]      Coefficient of x^0
// k[n-1]    Coefficient of x^(n-1)
function isSimpleRoot(k) {
    if (k.length <= 2) {
        return false;
    }
    if ((0, is_js_1.isZeroAtomOrTensor)(k[0])) {
        return false;
    }
    return k.slice(1, k.length - 1).every((el) => (0, is_js_1.isZeroAtomOrTensor)(el));
}
function normalisedCoeff(poly, x) {
    const miniStack = (0, coeff_js_1.coeff)(poly, x);
    const divideBy = miniStack[miniStack.length - 1];
    return miniStack.map((item) => (0, multiply_js_1.divide)(item, divideBy));
}
function roots(POLY, X) {
    // the simplification of nested radicals uses "roots", which in turn uses
    // simplification of nested radicals. Usually there is no problem, one level
    // of recursion does the job. Beyond that, we probably got stuck in a
    // strange case of infinite recursion, so bail out and return NIL.
    if (defs_js_1.defs.recursionLevelNestedRadicalsRemoval > 1) {
        return (0, symbol_js_1.symbol)(defs_js_1.NIL);
    }
    log.debug(`checking if ${POLY} is a case of simple roots`);
    const k = normalisedCoeff(POLY, X);
    const results = [];
    if (isSimpleRoot(k)) {
        log.debug(`yes, ${k[k.length - 1]} is a case of simple roots`);
        const kn = k.length;
        const lastCoeff = k[0];
        const leadingCoeff = k.pop();
        const simpleRoots = getSimpleRoots(kn, leadingCoeff, lastCoeff);
        results.push(...simpleRoots);
    }
    else {
        const roots = roots2(POLY, X);
        results.push(...roots);
    }
    const n = results.length;
    if (n === 0) {
        (0, run_js_1.stop)('roots: the polynomial is not factorable, try nroots');
    }
    if (n === 1) {
        return results[0];
    }
    (0, misc_js_1.sort)(results);
    const tensor = (0, alloc_js_1.alloc_tensor)(n);
    tensor.tensor.ndim = 1;
    tensor.tensor.dim[0] = n;
    for (let i = 0; i < n; i++) {
        tensor.tensor.elem[i] = results[i];
    }
    console.log(`roots returning ${tensor}`);
    return tensor;
}
exports.roots = roots;
// ok to generate these roots take a look at their form
// in the case of even and odd exponents here:
// http://www.wolframalpha.com/input/?i=roots+x%5E14+%2B+1
// http://www.wolframalpha.com/input/?i=roots+ax%5E14+%2B+b
// http://www.wolframalpha.com/input/?i=roots+x%5E15+%2B+1
// http://www.wolframalpha.com/input/?i=roots+a*x%5E15+%2B+b
// leadingCoeff    Coefficient of x^0
// lastCoeff       Coefficient of x^(n-1)
function getSimpleRoots(n, leadingCoeff, lastCoeff) {
    log.debug('getSimpleRoots');
    n = n - 1;
    const commonPart = (0, multiply_js_1.divide)((0, power_js_1.power)(lastCoeff, (0, bignum_js_1.rational)(1, n)), (0, power_js_1.power)(leadingCoeff, (0, bignum_js_1.rational)(1, n)));
    const results = [];
    if (n % 2 === 0) {
        for (let i = 1; i <= n; i += 2) {
            const aSol = (0, multiply_js_1.multiply)(commonPart, (0, power_js_1.power)(defs_js_1.Constants.negOne, (0, bignum_js_1.rational)(i, n)));
            results.push(aSol);
            results.push((0, multiply_js_1.negate)(aSol));
        }
        return results;
    }
    for (let i = 1; i <= n; i++) {
        let sol = (0, multiply_js_1.multiply)(commonPart, (0, power_js_1.power)(defs_js_1.Constants.negOne, (0, bignum_js_1.rational)(i, n)));
        if (i % 2 === 0) {
            sol = (0, multiply_js_1.negate)(sol);
        }
        results.push(sol);
    }
    return results;
}
function roots2(POLY, X) {
    const k = normalisedCoeff(POLY, X);
    if (!hasImaginaryCoeff(k)) {
        POLY = (0, factorpoly_js_1.factorpoly)(POLY, X);
    }
    if ((0, defs_js_1.ismultiply)(POLY)) {
        // scan through all the factors and find the roots of each of them
        const mapped = POLY.tail().map((p) => roots3(p, X));
        return flatten(mapped);
    }
    return roots3(POLY, X);
}
function roots3(POLY, X) {
    if ((0, defs_js_1.ispower)(POLY) &&
        (0, is_js_1.ispolyexpandedform)((0, defs_js_1.cadr)(POLY), X) &&
        (0, is_js_1.isposint)((0, defs_js_1.caddr)(POLY))) {
        const n = normalisedCoeff((0, defs_js_1.cadr)(POLY), X);
        return mini_solve(n);
    }
    if ((0, is_js_1.ispolyexpandedform)(POLY, X)) {
        const n = normalisedCoeff(POLY, X);
        return mini_solve(n);
    }
    return [];
}
// note that for many quadratic, cubic and quartic polynomials we don't
// actually end up using the quadratic/cubic/quartic formulas in here,
// since there is a chance we factored the polynomial and in so
// doing we found some solutions and lowered the degree.
function mini_solve(coefficients) {
    const n = coefficients.length;
    // AX + B, X = -B/A
    if (n === 2) {
        const A = coefficients.pop();
        const B = coefficients.pop();
        return _solveDegree1(A, B);
    }
    // AX^2 + BX + C, X = (-B +/- (B^2 - 4AC)^(1/2)) / (2A)
    if (n === 3) {
        const A = coefficients.pop();
        const B = coefficients.pop();
        const C = coefficients.pop();
        return _solveDegree2(A, B, C);
    }
    if (n === 4) {
        const A = coefficients.pop();
        const B = coefficients.pop();
        const C = coefficients.pop();
        const D = coefficients.pop();
        return _solveDegree3(A, B, C, D);
    }
    // See http://www.sscc.edu/home/jdavidso/Math/Catalog/Polynomials/Fourth/Fourth.html
    // for a description of general shapes and properties of fourth degree polynomials
    if (n === 5) {
        const A = coefficients.pop();
        const B = coefficients.pop();
        const C = coefficients.pop();
        const D = coefficients.pop();
        const E = coefficients.pop();
        return _solveDegree4(A, B, C, D, E);
    }
    return [];
}
function _solveDegree1(A, B) {
    return [(0, multiply_js_1.negate)((0, multiply_js_1.divide)(B, A))];
}
function _solveDegree2(A, B, C) {
    //(B^2 - 4AC)^(1/2)
    const p6 = (0, power_js_1.power)(
    // prettier-ignore
    (0, add_js_1.subtract)((0, power_js_1.power)(B, (0, bignum_js_1.integer)(2)), (0, multiply_js_1.multiply)((0, multiply_js_1.multiply)((0, bignum_js_1.integer)(4), A), C)), (0, bignum_js_1.rational)(1, 2));
    // ((B^2 - 4AC)^(1/2) - B)/ (2A)
    const result1 = (0, multiply_js_1.divide)((0, add_js_1.subtract)(p6, B), (0, multiply_js_1.multiply)(A, (0, bignum_js_1.integer)(2)));
    // 1/2 * -(B + (B^2 - 4AC)^(1/2)) / A
    const result2 = (0, multiply_js_1.multiply)((0, multiply_js_1.divide)((0, multiply_js_1.negate)((0, add_js_1.add)(p6, B)), A), (0, bignum_js_1.rational)(1, 2));
    return [result1, result2];
}
function _solveDegree3(A, B, C, D) {
    // C - only related calculations
    const R_c3 = (0, multiply_js_1.multiply)((0, multiply_js_1.multiply)(C, C), C);
    // B - only related calculations
    const R_b2 = (0, multiply_js_1.multiply)(B, B);
    const R_b3 = (0, multiply_js_1.multiply)(R_b2, B);
    const R_m4_b3_d = (0, multiply_js_1.multiply)((0, multiply_js_1.multiply)(R_b3, D), (0, bignum_js_1.integer)(-4));
    const R_2_b3 = (0, multiply_js_1.multiply)(R_b3, (0, bignum_js_1.integer)(2));
    // A - only related calculations
    const R_3_a = (0, multiply_js_1.multiply)((0, bignum_js_1.integer)(3), A);
    const R_a2_d = (0, multiply_js_1.multiply)((0, multiply_js_1.multiply)(A, A), D);
    const R_27_a2_d = (0, multiply_js_1.multiply)(R_a2_d, (0, bignum_js_1.integer)(27));
    const R_m27_a2_d2 = (0, multiply_js_1.multiply)((0, multiply_js_1.multiply)(R_a2_d, D), (0, bignum_js_1.integer)(-27));
    // mixed calculations
    const R_a_b_c = (0, multiply_js_1.multiply)((0, multiply_js_1.multiply)(A, C), B);
    const R_3_a_c = (0, multiply_js_1.multiply)((0, multiply_js_1.multiply)(A, C), (0, bignum_js_1.integer)(3));
    const R_m4_a_c3 = (0, multiply_js_1.multiply)((0, bignum_js_1.integer)(-4), (0, multiply_js_1.multiply)(A, R_c3));
    const R_m9_a_b_c = (0, multiply_js_1.negate)((0, multiply_js_1.multiply)(R_a_b_c, (0, bignum_js_1.integer)(9)));
    const R_18_a_b_c_d = (0, multiply_js_1.multiply)((0, multiply_js_1.multiply)(R_a_b_c, D), (0, bignum_js_1.integer)(18));
    const R_DELTA0 = (0, add_js_1.subtract)(R_b2, R_3_a_c);
    const R_b2_c2 = (0, multiply_js_1.multiply)(R_b2, (0, multiply_js_1.multiply)(C, C));
    const R_m_b_over_3a = (0, multiply_js_1.divide)((0, multiply_js_1.negate)(B), R_3_a);
    const R_4_DELTA03 = (0, multiply_js_1.multiply)((0, power_js_1.power)(R_DELTA0, (0, bignum_js_1.integer)(3)), (0, bignum_js_1.integer)(4));
    const R_DELTA0_toBeCheckedIfZero = (0, abs_js_1.absValFloat)((0, simplify_js_1.simplify)(R_DELTA0));
    const R_determinant = (0, abs_js_1.absValFloat)((0, simplify_js_1.simplify)((0, add_js_1.add_all)([R_18_a_b_c_d, R_m4_b3_d, R_b2_c2, R_m4_a_c3, R_m27_a2_d2])));
    const R_DELTA1 = (0, add_js_1.add_all)([R_2_b3, R_m9_a_b_c, R_27_a2_d]);
    const R_Q = (0, simplify_js_1.simplify)((0, power_js_1.power)((0, add_js_1.subtract)((0, power_js_1.power)(R_DELTA1, (0, bignum_js_1.integer)(2)), R_4_DELTA03), (0, bignum_js_1.rational)(1, 2)));
    log.debug('>>>>>>>>>>>>>>>> actually using cubic formula <<<<<<<<<<<<<<< ');
    log.debug(`cubic: D0: ${R_DELTA0}`);
    log.debug(`cubic: D0 as float: ${R_DELTA0_toBeCheckedIfZero}`);
    log.debug(`cubic: DETERMINANT: ${R_determinant}`);
    log.debug(`cubic: D1: ${R_DELTA1}`);
    if ((0, is_js_1.isZeroAtomOrTensor)(R_determinant)) {
        const data = {
            R_DELTA0_toBeCheckedIfZero,
            R_m_b_over_3a,
            R_DELTA0,
            R_b3,
            R_a_b_c,
        };
        return _solveDegree3ZeroRDeterminant(A, B, C, D, data);
    }
    let C_CHECKED_AS_NOT_ZERO = false;
    let flipSignOFQSoCIsNotZero = false;
    let R_C;
    // C will go as denominator, we have to check that is not zero
    while (!C_CHECKED_AS_NOT_ZERO) {
        const arg1 = flipSignOFQSoCIsNotZero ? (0, multiply_js_1.negate)(R_Q) : R_Q;
        R_C = (0, simplify_js_1.simplify)((0, power_js_1.power)((0, multiply_js_1.multiply)((0, add_js_1.add)(arg1, R_DELTA1), (0, bignum_js_1.rational)(1, 2)), (0, bignum_js_1.rational)(1, 3)));
        const R_C_simplified_toCheckIfZero = (0, abs_js_1.absValFloat)((0, simplify_js_1.simplify)(R_C));
        log.debug(`cubic: C: ${R_C}`);
        log.debug(`cubic: C as absval and float: ${R_C_simplified_toCheckIfZero}`);
        if ((0, is_js_1.isZeroAtomOrTensor)(R_C_simplified_toCheckIfZero)) {
            log.debug(' cubic: C IS ZERO flipping the sign');
            flipSignOFQSoCIsNotZero = true;
        }
        else {
            C_CHECKED_AS_NOT_ZERO = true;
        }
    }
    const R_6_a_C = (0, multiply_js_1.multiply)((0, multiply_js_1.multiply)(R_C, R_3_a), (0, bignum_js_1.integer)(2));
    // imaginary parts calculations
    const i_sqrt3 = (0, multiply_js_1.multiply)(defs_js_1.Constants.imaginaryunit, (0, power_js_1.power)((0, bignum_js_1.integer)(3), (0, bignum_js_1.rational)(1, 2)));
    const one_plus_i_sqrt3 = (0, add_js_1.add)(defs_js_1.Constants.one, i_sqrt3);
    const one_minus_i_sqrt3 = (0, add_js_1.subtract)(defs_js_1.Constants.one, i_sqrt3);
    const R_C_over_3a = (0, multiply_js_1.divide)(R_C, R_3_a);
    // first solution
    const firstSolTerm1 = R_m_b_over_3a;
    const firstSolTerm2 = (0, multiply_js_1.negate)(R_C_over_3a);
    const firstSolTerm3 = (0, multiply_js_1.negate)((0, multiply_js_1.divide)(R_DELTA0, (0, multiply_js_1.multiply)(R_C, R_3_a)));
    const firstSolution = (0, simplify_js_1.simplify)((0, add_js_1.add_all)([firstSolTerm1, firstSolTerm2, firstSolTerm3]));
    // second solution
    const secondSolTerm1 = R_m_b_over_3a;
    const secondSolTerm2 = (0, multiply_js_1.divide)((0, multiply_js_1.multiply)(R_C_over_3a, one_plus_i_sqrt3), (0, bignum_js_1.integer)(2));
    const secondSolTerm3 = (0, multiply_js_1.divide)((0, multiply_js_1.multiply)(one_minus_i_sqrt3, R_DELTA0), R_6_a_C);
    const secondSolution = (0, simplify_js_1.simplify)((0, add_js_1.add_all)([secondSolTerm1, secondSolTerm2, secondSolTerm3]));
    // third solution
    const thirdSolTerm1 = R_m_b_over_3a;
    const thirdSolTerm2 = (0, multiply_js_1.divide)((0, multiply_js_1.multiply)(R_C_over_3a, one_minus_i_sqrt3), (0, bignum_js_1.integer)(2));
    const thirdSolTerm3 = (0, multiply_js_1.divide)((0, multiply_js_1.multiply)(one_plus_i_sqrt3, R_DELTA0), R_6_a_C);
    const thirdSolution = (0, simplify_js_1.simplify)((0, add_js_1.add_all)([thirdSolTerm1, thirdSolTerm2, thirdSolTerm3]));
    return [firstSolution, secondSolution, thirdSolution];
}
function _solveDegree3ZeroRDeterminant(A, B, C, D, common) {
    const { R_DELTA0_toBeCheckedIfZero, R_m_b_over_3a, R_DELTA0, R_b3, R_a_b_c, } = common;
    if ((0, is_js_1.isZeroAtomOrTensor)(R_DELTA0_toBeCheckedIfZero)) {
        log.debug(' cubic: DETERMINANT IS ZERO and delta0 is zero');
        return [R_m_b_over_3a]; // just same solution three times
    }
    log.debug(' cubic: DETERMINANT IS ZERO and delta0 is not zero');
    const rootSolution = (0, multiply_js_1.divide)((0, add_js_1.subtract)((0, multiply_js_1.multiply)(A, (0, multiply_js_1.multiply)(D, (0, bignum_js_1.integer)(9))), (0, multiply_js_1.multiply)(B, C)), (0, multiply_js_1.multiply)(R_DELTA0, (0, bignum_js_1.integer)(2)));
    // second solution here
    // -9*b^3
    const numer_term1 = (0, multiply_js_1.negate)(R_b3);
    // -9a*a*d
    const numer_term2 = (0, multiply_js_1.negate)((0, multiply_js_1.multiply)(A, (0, multiply_js_1.multiply)(A, (0, multiply_js_1.multiply)(D, (0, bignum_js_1.integer)(9)))));
    // 4*a*b*c
    const numer_term3 = (0, multiply_js_1.multiply)(R_a_b_c, (0, bignum_js_1.integer)(4));
    // build the fraction
    // numerator: sum the three terms
    // denominator: a*delta0
    const secondSolution = (0, multiply_js_1.divide)((0, add_js_1.add_all)([numer_term3, numer_term2, numer_term1]), (0, multiply_js_1.multiply)(A, R_DELTA0));
    return [rootSolution, rootSolution, secondSolution];
}
function _solveDegree4(A, B, C, D, E) {
    log.debug('>>>>>>>>>>>>>>>> actually using quartic formula <<<<<<<<<<<<<<< ');
    if ((0, is_js_1.isZeroAtomOrTensor)(B) &&
        (0, is_js_1.isZeroAtomOrTensor)(D) &&
        !(0, is_js_1.isZeroAtomOrTensor)(C) &&
        !(0, is_js_1.isZeroAtomOrTensor)(E)) {
        return _solveDegree4Biquadratic(A, B, C, D, E);
    }
    if (!(0, is_js_1.isZeroAtomOrTensor)(B)) {
        return _solveDegree4NonzeroB(A, B, C, D, E);
    }
    else {
        return _solveDegree4ZeroB(A, B, C, D, E);
    }
}
function _solveDegree4Biquadratic(A, B, C, D, E) {
    log.debug('biquadratic case');
    const biquadraticSolutions = roots((0, add_js_1.add)((0, multiply_js_1.multiply)(A, (0, power_js_1.power)((0, symbol_js_1.symbol)(defs_js_1.SECRETX), (0, bignum_js_1.integer)(2))), (0, add_js_1.add)((0, multiply_js_1.multiply)(C, (0, symbol_js_1.symbol)(defs_js_1.SECRETX)), E)), (0, symbol_js_1.symbol)(defs_js_1.SECRETX));
    const results = [];
    for (const sol of biquadraticSolutions.tensor.elem) {
        results.push((0, simplify_js_1.simplify)((0, power_js_1.power)(sol, (0, bignum_js_1.rational)(1, 2))));
        results.push((0, simplify_js_1.simplify)((0, multiply_js_1.negate)((0, power_js_1.power)(sol, (0, bignum_js_1.rational)(1, 2)))));
    }
    return results;
}
function _solveDegree4ZeroB(A, B, C, D, E) {
    const R_p = C;
    const R_q = D;
    const R_r = E;
    // Ferrari's solution
    // https://en.wikipedia.org/wiki/Quartic_function#Ferrari.27s_solution
    // finding the "m" in the depressed equation
    const coeff2 = (0, multiply_js_1.multiply)((0, bignum_js_1.rational)(5, 2), R_p);
    const coeff3 = (0, add_js_1.subtract)((0, multiply_js_1.multiply)((0, bignum_js_1.integer)(2), (0, power_js_1.power)(R_p, (0, bignum_js_1.integer)(2))), R_r);
    const coeff4 = (0, add_js_1.add)((0, multiply_js_1.multiply)((0, bignum_js_1.rational)(-1, 2), (0, multiply_js_1.multiply)(R_p, R_r)), (0, add_js_1.add)((0, multiply_js_1.divide)((0, power_js_1.power)(R_p, (0, bignum_js_1.integer)(3)), (0, bignum_js_1.integer)(2)), (0, multiply_js_1.multiply)((0, bignum_js_1.rational)(-1, 8), (0, power_js_1.power)(R_q, (0, bignum_js_1.integer)(2)))));
    const arg1 = (0, add_js_1.add)((0, power_js_1.power)((0, symbol_js_1.symbol)(defs_js_1.SECRETX), (0, bignum_js_1.integer)(3)), (0, add_js_1.add)((0, multiply_js_1.multiply)(coeff2, (0, power_js_1.power)((0, symbol_js_1.symbol)(defs_js_1.SECRETX), (0, bignum_js_1.integer)(2))), (0, add_js_1.add)((0, multiply_js_1.multiply)(coeff3, (0, symbol_js_1.symbol)(defs_js_1.SECRETX)), coeff4)));
    log.debug(`resolventCubic: ${arg1}`);
    const resolventCubicSolutions = roots(arg1, (0, symbol_js_1.symbol)(defs_js_1.SECRETX));
    log.debug(`resolventCubicSolutions: ${resolventCubicSolutions}`);
    let R_m = null;
    //R_m = resolventCubicSolutions.tensor.elem[1]
    for (const sol of resolventCubicSolutions.tensor.elem) {
        log.debug(`examining solution: ${sol}`);
        const toBeCheckedIfZero = (0, abs_js_1.absValFloat)((0, add_js_1.add)((0, multiply_js_1.multiply)(sol, (0, bignum_js_1.integer)(2)), R_p));
        log.debug(`abs value is: ${sol}`);
        if (!(0, is_js_1.isZeroAtomOrTensor)(toBeCheckedIfZero)) {
            R_m = sol;
            break;
        }
    }
    log.debug(`chosen solution: ${R_m}`);
    const sqrtPPlus2M = (0, simplify_js_1.simplify)((0, power_js_1.power)((0, add_js_1.add)((0, multiply_js_1.multiply)(R_m, (0, bignum_js_1.integer)(2)), R_p), (0, bignum_js_1.rational)(1, 2)));
    const twoQOversqrtPPlus2M = (0, simplify_js_1.simplify)((0, multiply_js_1.divide)((0, multiply_js_1.multiply)(R_q, (0, bignum_js_1.integer)(2)), sqrtPPlus2M));
    const threePPlus2M = (0, add_js_1.add)((0, multiply_js_1.multiply)(R_p, (0, bignum_js_1.integer)(3)), (0, multiply_js_1.multiply)(R_m, (0, bignum_js_1.integer)(2)));
    // solution1
    const sol1Arg = (0, simplify_js_1.simplify)((0, power_js_1.power)((0, multiply_js_1.negate)((0, add_js_1.add)(threePPlus2M, twoQOversqrtPPlus2M)), (0, bignum_js_1.rational)(1, 2)));
    const solution1 = (0, multiply_js_1.divide)((0, add_js_1.add)(sqrtPPlus2M, sol1Arg), (0, bignum_js_1.integer)(2));
    // solution2
    const sol2Arg = (0, simplify_js_1.simplify)((0, power_js_1.power)((0, multiply_js_1.negate)((0, add_js_1.add)(threePPlus2M, twoQOversqrtPPlus2M)), (0, bignum_js_1.rational)(1, 2)));
    const solution2 = (0, multiply_js_1.divide)((0, add_js_1.subtract)(sqrtPPlus2M, sol2Arg), (0, bignum_js_1.integer)(2));
    // solution3
    const sol3Arg = (0, simplify_js_1.simplify)((0, power_js_1.power)((0, multiply_js_1.negate)((0, add_js_1.subtract)(threePPlus2M, twoQOversqrtPPlus2M)), (0, bignum_js_1.rational)(1, 2)));
    const solution3 = (0, multiply_js_1.divide)((0, add_js_1.add)((0, multiply_js_1.negate)(sqrtPPlus2M), sol3Arg), (0, bignum_js_1.integer)(2));
    // solution4
    const sol4Arg = (0, simplify_js_1.simplify)((0, power_js_1.power)((0, multiply_js_1.negate)((0, add_js_1.subtract)(threePPlus2M, twoQOversqrtPPlus2M)), (0, bignum_js_1.rational)(1, 2)));
    const solution4 = (0, multiply_js_1.divide)((0, add_js_1.subtract)((0, multiply_js_1.negate)(sqrtPPlus2M), sol4Arg), (0, bignum_js_1.integer)(2));
    return [solution1, solution2, solution3, solution4];
}
function _solveDegree4NonzeroB(A, B, C, D, E) {
    const R_p = (0, multiply_js_1.divide)((0, add_js_1.add)((0, multiply_js_1.multiply)((0, bignum_js_1.integer)(8), (0, multiply_js_1.multiply)(C, A)), (0, multiply_js_1.multiply)((0, bignum_js_1.integer)(-3), (0, power_js_1.power)(B, (0, bignum_js_1.integer)(2)))), (0, multiply_js_1.multiply)((0, bignum_js_1.integer)(8), (0, power_js_1.power)(A, (0, bignum_js_1.integer)(2))));
    const R_q = (0, multiply_js_1.divide)((0, add_js_1.add)((0, power_js_1.power)(B, (0, bignum_js_1.integer)(3)), (0, add_js_1.add)((0, multiply_js_1.multiply)((0, bignum_js_1.integer)(-4), (0, multiply_js_1.multiply)(A, (0, multiply_js_1.multiply)(B, C))), (0, multiply_js_1.multiply)((0, bignum_js_1.integer)(8), (0, multiply_js_1.multiply)(D, (0, power_js_1.power)(A, (0, bignum_js_1.integer)(2)))))), (0, multiply_js_1.multiply)((0, bignum_js_1.integer)(8), (0, power_js_1.power)(A, (0, bignum_js_1.integer)(3))));
    const R_a3 = (0, multiply_js_1.multiply)((0, multiply_js_1.multiply)(A, A), A);
    const R_b2 = (0, multiply_js_1.multiply)(B, B);
    const R_a2_d = (0, multiply_js_1.multiply)((0, multiply_js_1.multiply)(A, A), D);
    // convert to depressed quartic
    let R_r = (0, multiply_js_1.divide)((0, add_js_1.add)((0, multiply_js_1.multiply)((0, power_js_1.power)(B, (0, bignum_js_1.integer)(4)), (0, bignum_js_1.integer)(-3)), (0, add_js_1.add)((0, multiply_js_1.multiply)((0, bignum_js_1.integer)(256), (0, multiply_js_1.multiply)(R_a3, E)), (0, add_js_1.add)((0, multiply_js_1.multiply)((0, bignum_js_1.integer)(-64), (0, multiply_js_1.multiply)(R_a2_d, B)), (0, multiply_js_1.multiply)((0, bignum_js_1.integer)(16), (0, multiply_js_1.multiply)(R_b2, (0, multiply_js_1.multiply)(A, C)))))), (0, multiply_js_1.multiply)((0, bignum_js_1.integer)(256), (0, power_js_1.power)(A, (0, bignum_js_1.integer)(4))));
    const four_x_4 = (0, power_js_1.power)((0, symbol_js_1.symbol)(defs_js_1.SECRETX), (0, bignum_js_1.integer)(4));
    const r_q_x_2 = (0, multiply_js_1.multiply)(R_p, (0, power_js_1.power)((0, symbol_js_1.symbol)(defs_js_1.SECRETX), (0, bignum_js_1.integer)(2)));
    const r_q_x = (0, multiply_js_1.multiply)(R_q, (0, symbol_js_1.symbol)(defs_js_1.SECRETX));
    const simplified = (0, simplify_js_1.simplify)((0, add_js_1.add_all)([four_x_4, r_q_x_2, r_q_x, R_r]));
    const depressedSolutions = roots(simplified, (0, symbol_js_1.symbol)(defs_js_1.SECRETX));
    log.debug(`p for depressed quartic: ${R_p}`);
    log.debug(`q for depressed quartic: ${R_q}`);
    log.debug(`r for depressed quartic: ${R_r}`);
    log.debug(`4 * x^4: ${four_x_4}`);
    log.debug(`R_p * x^2: ${r_q_x_2}`);
    log.debug(`R_q * x: ${r_q_x}`);
    log.debug(`R_r: ${R_r}`);
    log.debug(`solving depressed quartic: ${simplified}`);
    log.debug(`depressedSolutions: ${depressedSolutions}`);
    return depressedSolutions.tensor.elem.map((sol) => {
        const result = (0, simplify_js_1.simplify)((0, add_js_1.subtract)(sol, (0, multiply_js_1.divide)(B, (0, multiply_js_1.multiply)((0, bignum_js_1.integer)(4), A))));
        log.debug(`solution from depressed: ${result}`);
        return result;
    });
}
