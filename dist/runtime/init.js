"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defn = exports.init = void 0;
const abs_js_1 = require("../sources/abs.js");
const add_js_1 = require("../sources/add.js");
const adj_js_1 = require("../sources/adj.js");
const approxratio_js_1 = require("../sources/approxratio.js");
const arccos_js_1 = require("../sources/arccos.js");
const arccosh_js_1 = require("../sources/arccosh.js");
const arcsin_js_1 = require("../sources/arcsin.js");
const arcsinh_js_1 = require("../sources/arcsinh.js");
const arctan_js_1 = require("../sources/arctan.js");
const arctanh_js_1 = require("../sources/arctanh.js");
const arg_js_1 = require("../sources/arg.js");
const besselj_js_1 = require("../sources/besselj.js");
const bessely_js_1 = require("../sources/bessely.js");
const bignum_js_1 = require("../sources/bignum.js");
const binomial_js_1 = require("../sources/binomial.js");
const ceiling_js_1 = require("../sources/ceiling.js");
const choose_js_1 = require("../sources/choose.js");
const circexp_js_1 = require("../sources/circexp.js");
const clear_js_1 = require("../sources/clear.js");
const clock_js_1 = require("../sources/clock.js");
const coeff_js_1 = require("../sources/coeff.js");
const cofactor_js_1 = require("../sources/cofactor.js");
const condense_js_1 = require("../sources/condense.js");
const conj_js_1 = require("../sources/conj.js");
const contract_js_1 = require("../sources/contract.js");
const cos_js_1 = require("../sources/cos.js");
const cosh_js_1 = require("../sources/cosh.js");
const decomp_js_1 = require("../sources/decomp.js");
const define_js_1 = require("../sources/define.js");
const defint_js_1 = require("../sources/defint.js");
const degree_js_1 = require("../sources/degree.js");
const denominator_js_1 = require("../sources/denominator.js");
const derivative_js_1 = require("../sources/derivative.js");
const dirac_js_1 = require("../sources/dirac.js");
const eigen_js_1 = require("../sources/eigen.js");
const erf_js_1 = require("../sources/erf.js");
const erfc_js_1 = require("../sources/erfc.js");
const eval_js_1 = require("../sources/eval.js");
const expand_js_1 = require("../sources/expand.js");
const expcos_js_1 = require("../sources/expcos.js");
const expsin_js_1 = require("../sources/expsin.js");
const factor_js_1 = require("../sources/factor.js");
const filter_js_1 = require("../sources/filter.js");
const float_js_1 = require("../sources/float.js");
const floor_js_1 = require("../sources/floor.js");
const for_js_1 = require("../sources/for.js");
const gamma_js_1 = require("../sources/gamma.js");
const gcd_js_1 = require("../sources/gcd.js");
const imag_js_1 = require("../sources/imag.js");
const inner_js_1 = require("../sources/inner.js");
const integral_js_1 = require("../sources/integral.js");
const isprime_js_1 = require("../sources/isprime.js");
const laguerre_js_1 = require("../sources/laguerre.js");
const lcm_js_1 = require("../sources/lcm.js");
const leading_js_1 = require("../sources/leading.js");
const legendre_js_1 = require("../sources/legendre.js");
const list_js_1 = require("../sources/list.js");
const log_js_1 = require("../sources/log.js");
const lookup_js_1 = require("../sources/lookup.js");
const mod_js_1 = require("../sources/mod.js");
const multiply_js_1 = require("../sources/multiply.js");
const nroots_js_1 = require("../sources/nroots.js");
const numerator_js_1 = require("../sources/numerator.js");
const outer_js_1 = require("../sources/outer.js");
const pattern_js_1 = require("../sources/pattern.js");
const polar_js_1 = require("../sources/polar.js");
const power_js_1 = require("../sources/power.js");
const prime_js_1 = require("../sources/prime.js");
const print_js_1 = require("../sources/print.js");
const product_js_1 = require("../sources/product.js");
const quotient_js_1 = require("../sources/quotient.js");
const rationalize_js_1 = require("../sources/rationalize.js");
const real_js_1 = require("../sources/real.js");
const rect_js_1 = require("../sources/rect.js");
const roots_js_1 = require("../sources/roots.js");
const round_js_1 = require("../sources/round.js");
const scan_js_1 = require("../sources/scan.js");
const sgn_js_1 = require("../sources/sgn.js");
const shape_js_1 = require("../sources/shape.js");
const simplify_js_1 = require("../sources/simplify.js");
const sin_js_1 = require("../sources/sin.js");
const sinh_js_1 = require("../sources/sinh.js");
const sum_js_1 = require("../sources/sum.js");
const tan_js_1 = require("../sources/tan.js");
const tanh_js_1 = require("../sources/tanh.js");
const taylor_js_1 = require("../sources/taylor.js");
const test_js_1 = require("../sources/test.js");
const transpose_js_1 = require("../sources/transpose.js");
const zero_js_1 = require("../sources/zero.js");
const defs_js_1 = require("./defs.js");
const symbol_js_1 = require("./symbol.js");
const version_js_1 = require("./version.js");
let init_flag = 0;
function init() {
    init_flag = 0;
    (0, defs_js_1.reset_after_error)();
    defs_js_1.defs.chainOfUserSymbolsNotFunctionsBeingEvaluated = [];
    if (init_flag) {
        return; // already initted
    }
    init_flag = 1;
    (0, symbol_js_1.reset_symbols)();
    defn();
}
exports.init = init;
/* cross =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept, script_defined

Parameters
----------
u,v

General description
-------------------
Returns the cross product of vectors u and v.

*/
/* curl =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept, script_defined

Parameters
----------
u

General description
-------------------
Returns the curl of vector u.

*/
const defn_str = [
    'version="' + version_js_1.version + '"',
    'e=exp(1)',
    'i=sqrt(-1)',
    'autoexpand=1',
    'assumeRealVariables=1',
    'trange=[-pi,pi]',
    'xrange=[-10,10]',
    'yrange=[-10,10]',
    'last=0',
    'trace=0',
    'forceFixedPrintout=1',
    'maxFixedPrintoutDigits=6',
    'printLeaveEAlone=1',
    'printLeaveXAlone=0',
    // cross definition
    'cross(u,v)=[u[2]*v[3]-u[3]*v[2],u[3]*v[1]-u[1]*v[3],u[1]*v[2]-u[2]*v[1]]',
    // curl definition
    'curl(v)=[d(v[3],y)-d(v[2],z),d(v[1],z)-d(v[3],x),d(v[2],x)-d(v[1],y)]',
    // div definition
    'div(v)=d(v[1],x)+d(v[2],y)+d(v[3],z)',
    // Note that we use the mathematics / Javascript / Mathematica
    // convention that "log" is indeed the natural logarithm.
    //
    // In engineering, biology, astronomy, "log" can stand instead
    // for the "common" logarithm i.e. base 10. Also note that Google
    // calculations use log for the common logarithm.
    'ln(x)=log(x)',
];
function defn() {
    (0, symbol_js_1.std_symbol)(defs_js_1.ABS, abs_js_1.Eval_abs);
    (0, symbol_js_1.std_symbol)(defs_js_1.ADD, add_js_1.Eval_add);
    (0, symbol_js_1.std_symbol)(defs_js_1.ADJ, adj_js_1.Eval_adj);
    (0, symbol_js_1.std_symbol)(defs_js_1.AND, test_js_1.Eval_and);
    (0, symbol_js_1.std_symbol)(defs_js_1.APPROXRATIO, approxratio_js_1.Eval_approxratio);
    (0, symbol_js_1.std_symbol)(defs_js_1.ARCCOS, arccos_js_1.Eval_arccos);
    (0, symbol_js_1.std_symbol)(defs_js_1.ARCCOSH, arccosh_js_1.Eval_arccosh);
    (0, symbol_js_1.std_symbol)(defs_js_1.ARCSIN, arcsin_js_1.Eval_arcsin);
    (0, symbol_js_1.std_symbol)(defs_js_1.ARCSINH, arcsinh_js_1.Eval_arcsinh);
    (0, symbol_js_1.std_symbol)(defs_js_1.ARCTAN, arctan_js_1.Eval_arctan);
    (0, symbol_js_1.std_symbol)(defs_js_1.ARCTANH, arctanh_js_1.Eval_arctanh);
    (0, symbol_js_1.std_symbol)(defs_js_1.ARG, arg_js_1.Eval_arg);
    (0, symbol_js_1.std_symbol)(defs_js_1.ATOMIZE);
    (0, symbol_js_1.std_symbol)(defs_js_1.BESSELJ, besselj_js_1.Eval_besselj);
    (0, symbol_js_1.std_symbol)(defs_js_1.BESSELY, bessely_js_1.Eval_bessely);
    (0, symbol_js_1.std_symbol)(defs_js_1.BINDING, eval_js_1.Eval_binding);
    (0, symbol_js_1.std_symbol)(defs_js_1.BINOMIAL, binomial_js_1.Eval_binomial);
    (0, symbol_js_1.std_symbol)(defs_js_1.CEILING, ceiling_js_1.Eval_ceiling);
    (0, symbol_js_1.std_symbol)(defs_js_1.CHECK, eval_js_1.Eval_check);
    (0, symbol_js_1.std_symbol)(defs_js_1.CHOOSE, choose_js_1.Eval_choose);
    (0, symbol_js_1.std_symbol)(defs_js_1.CIRCEXP, circexp_js_1.Eval_circexp);
    (0, symbol_js_1.std_symbol)(defs_js_1.CLEAR, clear_js_1.Eval_clear);
    (0, symbol_js_1.std_symbol)(defs_js_1.CLEARALL, clear_js_1.Eval_clearall);
    (0, symbol_js_1.std_symbol)(defs_js_1.CLEARPATTERNS, pattern_js_1.Eval_clearpatterns);
    (0, symbol_js_1.std_symbol)(defs_js_1.CLOCK, clock_js_1.Eval_clock);
    (0, symbol_js_1.std_symbol)(defs_js_1.COEFF, coeff_js_1.Eval_coeff);
    (0, symbol_js_1.std_symbol)(defs_js_1.COFACTOR, cofactor_js_1.Eval_cofactor);
    (0, symbol_js_1.std_symbol)(defs_js_1.CONDENSE, condense_js_1.Eval_condense);
    (0, symbol_js_1.std_symbol)(defs_js_1.CONJ, conj_js_1.Eval_conj);
    (0, symbol_js_1.std_symbol)(defs_js_1.CONTRACT, contract_js_1.Eval_contract);
    (0, symbol_js_1.std_symbol)(defs_js_1.COS, cos_js_1.Eval_cos);
    (0, symbol_js_1.std_symbol)(defs_js_1.COSH, cosh_js_1.Eval_cosh);
    (0, symbol_js_1.std_symbol)(defs_js_1.DECOMP, decomp_js_1.Eval_decomp);
    (0, symbol_js_1.std_symbol)(defs_js_1.DEFINT, defint_js_1.Eval_defint);
    (0, symbol_js_1.std_symbol)(defs_js_1.DEGREE, degree_js_1.Eval_degree);
    (0, symbol_js_1.std_symbol)(defs_js_1.DENOMINATOR, denominator_js_1.Eval_denominator);
    (0, symbol_js_1.std_symbol)(defs_js_1.DET, eval_js_1.Eval_det);
    (0, symbol_js_1.std_symbol)(defs_js_1.DERIVATIVE, derivative_js_1.Eval_derivative);
    (0, symbol_js_1.std_symbol)(defs_js_1.DIM, eval_js_1.Eval_dim);
    (0, symbol_js_1.std_symbol)(defs_js_1.DIRAC, dirac_js_1.Eval_dirac);
    (0, symbol_js_1.std_symbol)(defs_js_1.DIVISORS, eval_js_1.Eval_divisors);
    (0, symbol_js_1.std_symbol)(defs_js_1.DO, eval_js_1.Eval_do);
    (0, symbol_js_1.std_symbol)(defs_js_1.DOT, inner_js_1.Eval_inner);
    (0, symbol_js_1.std_symbol)(defs_js_1.DRAW);
    (0, symbol_js_1.std_symbol)(defs_js_1.DSOLVE);
    (0, symbol_js_1.std_symbol)(defs_js_1.ERF, erf_js_1.Eval_erf);
    (0, symbol_js_1.std_symbol)(defs_js_1.ERFC, erfc_js_1.Eval_erfc);
    (0, symbol_js_1.std_symbol)(defs_js_1.EIGEN, eigen_js_1.Eval_eigen);
    (0, symbol_js_1.std_symbol)(defs_js_1.EIGENVAL, eigen_js_1.Eval_eigenval);
    (0, symbol_js_1.std_symbol)(defs_js_1.EIGENVEC, eigen_js_1.Eval_eigenvec);
    (0, symbol_js_1.std_symbol)(defs_js_1.EVAL, eval_js_1.Eval_Eval);
    (0, symbol_js_1.std_symbol)(defs_js_1.EXP, eval_js_1.Eval_exp);
    (0, symbol_js_1.std_symbol)(defs_js_1.EXPAND, expand_js_1.Eval_expand);
    (0, symbol_js_1.std_symbol)(defs_js_1.EXPCOS, expcos_js_1.Eval_expcos);
    (0, symbol_js_1.std_symbol)(defs_js_1.EXPSIN, expsin_js_1.Eval_expsin);
    (0, symbol_js_1.std_symbol)(defs_js_1.FACTOR, factor_js_1.Eval_factor);
    (0, symbol_js_1.std_symbol)(defs_js_1.FACTORIAL, eval_js_1.Eval_factorial);
    (0, symbol_js_1.std_symbol)(defs_js_1.FACTORPOLY, eval_js_1.Eval_factorpoly);
    (0, symbol_js_1.std_symbol)(defs_js_1.FILTER, filter_js_1.Eval_filter);
    (0, symbol_js_1.std_symbol)(defs_js_1.FLOATF, float_js_1.Eval_float);
    (0, symbol_js_1.std_symbol)(defs_js_1.FLOOR, floor_js_1.Eval_floor);
    (0, symbol_js_1.std_symbol)(defs_js_1.FOR, for_js_1.Eval_for);
    (0, symbol_js_1.std_symbol)(defs_js_1.FUNCTION, define_js_1.Eval_function_reference);
    (0, symbol_js_1.std_symbol)(defs_js_1.GAMMA, gamma_js_1.Eval_gamma);
    (0, symbol_js_1.std_symbol)(defs_js_1.GCD, gcd_js_1.Eval_gcd);
    (0, symbol_js_1.std_symbol)(defs_js_1.HERMITE, eval_js_1.Eval_hermite);
    (0, symbol_js_1.std_symbol)(defs_js_1.HILBERT, eval_js_1.Eval_hilbert);
    (0, symbol_js_1.std_symbol)(defs_js_1.IMAG, imag_js_1.Eval_imag);
    (0, symbol_js_1.std_symbol)(defs_js_1.INDEX, eval_js_1.Eval_index);
    (0, symbol_js_1.std_symbol)(defs_js_1.INNER, inner_js_1.Eval_inner);
    (0, symbol_js_1.std_symbol)(defs_js_1.INTEGRAL, integral_js_1.Eval_integral);
    (0, symbol_js_1.std_symbol)(defs_js_1.INV, eval_js_1.Eval_inv);
    (0, symbol_js_1.std_symbol)(defs_js_1.INVG, eval_js_1.Eval_invg);
    (0, symbol_js_1.std_symbol)(defs_js_1.ISINTEGER, eval_js_1.Eval_isinteger);
    (0, symbol_js_1.std_symbol)(defs_js_1.ISPRIME, isprime_js_1.Eval_isprime);
    (0, symbol_js_1.std_symbol)(defs_js_1.LAGUERRE, laguerre_js_1.Eval_laguerre);
    //  std_symbol(LAPLACE, Eval_laplace)
    (0, symbol_js_1.std_symbol)(defs_js_1.LCM, lcm_js_1.Eval_lcm);
    (0, symbol_js_1.std_symbol)(defs_js_1.LEADING, leading_js_1.Eval_leading);
    (0, symbol_js_1.std_symbol)(defs_js_1.LEGENDRE, legendre_js_1.Eval_legendre);
    (0, symbol_js_1.std_symbol)(defs_js_1.LOG, log_js_1.Eval_log);
    (0, symbol_js_1.std_symbol)(defs_js_1.LOOKUP, lookup_js_1.Eval_lookup);
    (0, symbol_js_1.std_symbol)(defs_js_1.MOD, mod_js_1.Eval_mod);
    (0, symbol_js_1.std_symbol)(defs_js_1.MULTIPLY, multiply_js_1.Eval_multiply);
    (0, symbol_js_1.std_symbol)(defs_js_1.NOT, test_js_1.Eval_not);
    (0, symbol_js_1.std_symbol)(defs_js_1.NROOTS, nroots_js_1.Eval_nroots);
    (0, symbol_js_1.std_symbol)(defs_js_1.NUMBER, eval_js_1.Eval_number);
    (0, symbol_js_1.std_symbol)(defs_js_1.NUMERATOR, numerator_js_1.Eval_numerator);
    (0, symbol_js_1.std_symbol)(defs_js_1.OPERATOR, eval_js_1.Eval_operator);
    (0, symbol_js_1.std_symbol)(defs_js_1.OR, test_js_1.Eval_or);
    (0, symbol_js_1.std_symbol)(defs_js_1.OUTER, outer_js_1.Eval_outer);
    (0, symbol_js_1.std_symbol)(defs_js_1.PATTERN, pattern_js_1.Eval_pattern);
    (0, symbol_js_1.std_symbol)(defs_js_1.PATTERNSINFO, pattern_js_1.Eval_patternsinfo);
    (0, symbol_js_1.std_symbol)(defs_js_1.POLAR, polar_js_1.Eval_polar);
    (0, symbol_js_1.std_symbol)(defs_js_1.POWER, power_js_1.Eval_power);
    (0, symbol_js_1.std_symbol)(defs_js_1.PRIME, prime_js_1.Eval_prime);
    (0, symbol_js_1.std_symbol)(defs_js_1.PRINT, print_js_1.Eval_print);
    (0, symbol_js_1.std_symbol)(defs_js_1.PRINT2DASCII, print_js_1.Eval_print2dascii);
    (0, symbol_js_1.std_symbol)(defs_js_1.PRINTFULL, print_js_1.Eval_printcomputer);
    (0, symbol_js_1.std_symbol)(defs_js_1.PRINTLATEX, print_js_1.Eval_printlatex);
    (0, symbol_js_1.std_symbol)(defs_js_1.PRINTLIST, print_js_1.Eval_printlist);
    (0, symbol_js_1.std_symbol)(defs_js_1.PRINTPLAIN, print_js_1.Eval_printhuman);
    (0, symbol_js_1.std_symbol)(defs_js_1.PRINT_LEAVE_E_ALONE);
    (0, symbol_js_1.std_symbol)(defs_js_1.PRINT_LEAVE_X_ALONE);
    (0, symbol_js_1.std_symbol)(defs_js_1.PRODUCT, product_js_1.Eval_product);
    (0, symbol_js_1.std_symbol)(defs_js_1.QUOTE, eval_js_1.Eval_quote);
    (0, symbol_js_1.std_symbol)(defs_js_1.QUOTIENT, quotient_js_1.Eval_quotient);
    (0, symbol_js_1.std_symbol)(defs_js_1.RANK, eval_js_1.Eval_rank);
    (0, symbol_js_1.std_symbol)(defs_js_1.RATIONALIZE, rationalize_js_1.Eval_rationalize);
    (0, symbol_js_1.std_symbol)(defs_js_1.REAL, real_js_1.Eval_real);
    (0, symbol_js_1.std_symbol)(defs_js_1.YYRECT, rect_js_1.Eval_rect);
    (0, symbol_js_1.std_symbol)(defs_js_1.ROOTS, roots_js_1.Eval_roots);
    (0, symbol_js_1.std_symbol)(defs_js_1.ROUND, round_js_1.Eval_round);
    (0, symbol_js_1.std_symbol)(defs_js_1.SETQ, eval_js_1.Eval_setq);
    (0, symbol_js_1.std_symbol)(defs_js_1.SGN, sgn_js_1.Eval_sgn);
    (0, symbol_js_1.std_symbol)(defs_js_1.SILENTPATTERN, pattern_js_1.Eval_silentpattern);
    (0, symbol_js_1.std_symbol)(defs_js_1.SIMPLIFY, simplify_js_1.Eval_simplify);
    (0, symbol_js_1.std_symbol)(defs_js_1.SIN, sin_js_1.Eval_sin);
    (0, symbol_js_1.std_symbol)(defs_js_1.SINH, sinh_js_1.Eval_sinh);
    (0, symbol_js_1.std_symbol)(defs_js_1.SHAPE, shape_js_1.Eval_shape);
    (0, symbol_js_1.std_symbol)(defs_js_1.SQRT, eval_js_1.Eval_sqrt);
    (0, symbol_js_1.std_symbol)(defs_js_1.STOP, eval_js_1.Eval_stop);
    (0, symbol_js_1.std_symbol)(defs_js_1.SUBST, eval_js_1.Eval_subst);
    (0, symbol_js_1.std_symbol)(defs_js_1.SUM, sum_js_1.Eval_sum);
    (0, symbol_js_1.std_symbol)(defs_js_1.SYMBOLSINFO, symbol_js_1.Eval_symbolsinfo);
    (0, symbol_js_1.std_symbol)(defs_js_1.TAN, tan_js_1.Eval_tan);
    (0, symbol_js_1.std_symbol)(defs_js_1.TANH, tanh_js_1.Eval_tanh);
    (0, symbol_js_1.std_symbol)(defs_js_1.TAYLOR, taylor_js_1.Eval_taylor);
    (0, symbol_js_1.std_symbol)(defs_js_1.TEST, test_js_1.Eval_test);
    (0, symbol_js_1.std_symbol)(defs_js_1.TESTEQ, test_js_1.Eval_testeq);
    (0, symbol_js_1.std_symbol)(defs_js_1.TESTGE, test_js_1.Eval_testge);
    (0, symbol_js_1.std_symbol)(defs_js_1.TESTGT, test_js_1.Eval_testgt);
    (0, symbol_js_1.std_symbol)(defs_js_1.TESTLE, test_js_1.Eval_testle);
    (0, symbol_js_1.std_symbol)(defs_js_1.TESTLT, test_js_1.Eval_testlt);
    (0, symbol_js_1.std_symbol)(defs_js_1.TRANSPOSE, transpose_js_1.Eval_transpose);
    (0, symbol_js_1.std_symbol)(defs_js_1.UNIT, eval_js_1.Eval_unit);
    (0, symbol_js_1.std_symbol)(defs_js_1.ZERO, zero_js_1.Eval_zero);
    (0, symbol_js_1.std_symbol)(defs_js_1.NIL);
    (0, symbol_js_1.std_symbol)(defs_js_1.AUTOEXPAND);
    (0, symbol_js_1.std_symbol)(defs_js_1.BAKE);
    (0, symbol_js_1.std_symbol)(defs_js_1.ASSUME_REAL_VARIABLES);
    (0, symbol_js_1.std_symbol)(defs_js_1.LAST);
    (0, symbol_js_1.std_symbol)(defs_js_1.LAST_PRINT);
    (0, symbol_js_1.std_symbol)(defs_js_1.LAST_2DASCII_PRINT);
    (0, symbol_js_1.std_symbol)(defs_js_1.LAST_FULL_PRINT);
    (0, symbol_js_1.std_symbol)(defs_js_1.LAST_LATEX_PRINT);
    (0, symbol_js_1.std_symbol)(defs_js_1.LAST_LIST_PRINT);
    (0, symbol_js_1.std_symbol)(defs_js_1.LAST_PLAIN_PRINT);
    (0, symbol_js_1.std_symbol)(defs_js_1.TRACE);
    (0, symbol_js_1.std_symbol)(defs_js_1.FORCE_FIXED_PRINTOUT);
    (0, symbol_js_1.std_symbol)(defs_js_1.MAX_FIXED_PRINTOUT_DIGITS);
    (0, symbol_js_1.std_symbol)(defs_js_1.YYE);
    (0, symbol_js_1.std_symbol)(defs_js_1.DRAWX); // special purpose internal symbols
    (0, symbol_js_1.std_symbol)(defs_js_1.METAA);
    (0, symbol_js_1.std_symbol)(defs_js_1.METAB);
    (0, symbol_js_1.std_symbol)(defs_js_1.METAX);
    (0, symbol_js_1.std_symbol)(defs_js_1.SECRETX);
    (0, symbol_js_1.std_symbol)(defs_js_1.VERSION);
    (0, symbol_js_1.std_symbol)(defs_js_1.PI);
    (0, symbol_js_1.std_symbol)(defs_js_1.SYMBOL_A);
    (0, symbol_js_1.std_symbol)(defs_js_1.SYMBOL_B);
    (0, symbol_js_1.std_symbol)(defs_js_1.SYMBOL_C);
    (0, symbol_js_1.std_symbol)(defs_js_1.SYMBOL_D);
    (0, symbol_js_1.std_symbol)(defs_js_1.SYMBOL_I);
    (0, symbol_js_1.std_symbol)(defs_js_1.SYMBOL_J);
    (0, symbol_js_1.std_symbol)(defs_js_1.SYMBOL_N);
    (0, symbol_js_1.std_symbol)(defs_js_1.SYMBOL_R);
    (0, symbol_js_1.std_symbol)(defs_js_1.SYMBOL_S);
    (0, symbol_js_1.std_symbol)(defs_js_1.SYMBOL_T);
    (0, symbol_js_1.std_symbol)(defs_js_1.SYMBOL_X);
    (0, symbol_js_1.std_symbol)(defs_js_1.SYMBOL_Y);
    (0, symbol_js_1.std_symbol)(defs_js_1.SYMBOL_Z);
    (0, symbol_js_1.std_symbol)(defs_js_1.SYMBOL_IDENTITY_MATRIX);
    (0, symbol_js_1.std_symbol)(defs_js_1.SYMBOL_A_UNDERSCORE);
    (0, symbol_js_1.std_symbol)(defs_js_1.SYMBOL_B_UNDERSCORE);
    (0, symbol_js_1.std_symbol)(defs_js_1.SYMBOL_X_UNDERSCORE);
    (0, symbol_js_1.std_symbol)(defs_js_1.C1);
    (0, symbol_js_1.std_symbol)(defs_js_1.C2);
    (0, symbol_js_1.std_symbol)(defs_js_1.C3);
    (0, symbol_js_1.std_symbol)(defs_js_1.C4);
    (0, symbol_js_1.std_symbol)(defs_js_1.C5);
    (0, symbol_js_1.std_symbol)(defs_js_1.C6);
    defineSomeHandyConstants();
    // don't add all these functions to the
    // symbolsDependencies, clone the original
    const originalCodeGen = defs_js_1.defs.codeGen;
    defs_js_1.defs.codeGen = false;
    for (let defn_i = 0; defn_i < defn_str.length; defn_i++) {
        const definitionOfInterest = defn_str[defn_i];
        const [, def] = (0, scan_js_1.scan)(definitionOfInterest);
        if (defs_js_1.DEBUG) {
            console.log(`... evaling ${definitionOfInterest}`);
            console.log('top of stack:');
            console.log((0, print_js_1.print_list)(def));
        }
        (0, eval_js_1.Eval)(def);
    }
    // restore the symbol dependencies as they were before.
    defs_js_1.defs.codeGen = originalCodeGen;
}
exports.defn = defn;
function defineSomeHandyConstants() {
    // i is the square root of -1 i.e. -1 ^ 1/2
    const imaginaryunit = (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.POWER), (0, bignum_js_1.integer)(-1), (0, bignum_js_1.rational)(1, 2));
    if (defs_js_1.DEBUG) {
        console.log((0, print_js_1.print_list)(imaginaryunit));
    }
    defs_js_1.Constants.imaginaryunit = imaginaryunit; // must be untagged in gc
}
