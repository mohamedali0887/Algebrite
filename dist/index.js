"use strict";
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS202: Simplify dynamic range loops
 * DS207: Consider shorter variations of null checks
 * Full docs:
 * https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ = void 0;
const defs_js_1 = require("./runtime/defs.js");
const find_js_1 = require("./runtime/find.js");
const init_js_1 = require("./runtime/init.js");
const run_js_1 = require("./runtime/run.js");
const symbol_js_1 = require("./runtime/symbol.js");
const zombocom_js_1 = require("./runtime/zombocom.js");
const approxratio_js_1 = require("./sources/approxratio.js");
const integral_js_1 = require("./sources/integral.js");
const is_js_1 = require("./sources/is.js");
const misc_js_1 = require("./sources/misc.js");
const scan_js_1 = require("./sources/scan.js");
const functions = {
    version: defs_js_1.version,
    isadd: defs_js_1.isadd,
    ismultiply: defs_js_1.ismultiply,
    ispower: defs_js_1.ispower,
    isfactorial: defs_js_1.isfactorial,
    car: defs_js_1.car,
    cdr: defs_js_1.cdr,
    caar: defs_js_1.caar,
    cadr: defs_js_1.cadr,
    cdar: defs_js_1.cdar,
    cddr: defs_js_1.cddr,
    caadr: defs_js_1.caadr,
    caddr: defs_js_1.caddr,
    cadar: defs_js_1.cadar,
    cdadr: defs_js_1.cdadr,
    cddar: defs_js_1.cddar,
    cdddr: defs_js_1.cdddr,
    caaddr: defs_js_1.caaddr,
    cadadr: defs_js_1.cadadr,
    caddar: defs_js_1.caddar,
    cdaddr: defs_js_1.cdaddr,
    cadddr: defs_js_1.cadddr,
    cddddr: defs_js_1.cddddr,
    caddddr: defs_js_1.caddddr,
    cadaddr: defs_js_1.cadaddr,
    cddaddr: defs_js_1.cddaddr,
    caddadr: defs_js_1.caddadr,
    cdddaddr: defs_js_1.cdddaddr,
    caddaddr: defs_js_1.caddaddr,
    symbol: symbol_js_1.symbol,
    iscons: defs_js_1.iscons,
    isrational: defs_js_1.isrational,
    isdouble: defs_js_1.isdouble,
    isNumericAtom: defs_js_1.isNumericAtom,
    isstr: defs_js_1.isstr,
    istensor: defs_js_1.istensor,
    issymbol: defs_js_1.issymbol,
    iskeyword: symbol_js_1.iskeyword,
    CONS: defs_js_1.CONS,
    Cons: defs_js_1.Cons,
    NUM: defs_js_1.NUM,
    Num: defs_js_1.Num,
    DOUBLE: defs_js_1.DOUBLE,
    Double: defs_js_1.Double,
    STR: defs_js_1.STR,
    Str: defs_js_1.Str,
    TENSOR: defs_js_1.TENSOR,
    Tensor: defs_js_1.Tensor,
    SYM: defs_js_1.SYM,
    Sym: defs_js_1.Sym,
    approxRadicals: approxratio_js_1.approxRadicals,
    approxRationalsOfLogs: approxratio_js_1.approxRationalsOfLogs,
    approxAll: approxratio_js_1.approxAll,
    testApprox: approxratio_js_1.testApprox,
    make_hashed_itab: integral_js_1.make_hashed_itab,
    isZeroAtomOrTensor: is_js_1.isZeroAtomOrTensor,
    isnegativenumber: is_js_1.isnegativenumber,
    isplusone: is_js_1.isplusone,
    isminusone: is_js_1.isminusone,
    isinteger: is_js_1.isinteger,
    isnonnegativeinteger: is_js_1.isnonnegativeinteger,
    isposint: is_js_1.isposint,
    isnegativeterm: is_js_1.isnegativeterm,
    isimaginarynumber: is_js_1.isimaginarynumber,
    iscomplexnumber: is_js_1.iscomplexnumber,
    iseveninteger: is_js_1.iseveninteger,
    isnegative: is_js_1.isnegative,
    issymbolic: is_js_1.issymbolic,
    isintegerfactor: is_js_1.isintegerfactor,
    isoneover: is_js_1.isoneover,
    isfraction: is_js_1.isfraction,
    isoneoversqrttwo: is_js_1.isoneoversqrttwo,
    isminusoneoversqrttwo: is_js_1.isminusoneoversqrttwo,
    isfloating: is_js_1.isfloating,
    isimaginaryunit: is_js_1.isimaginaryunit,
    isquarterturn: is_js_1.isquarterturn,
    isnpi: is_js_1.isnpi,
    equal: misc_js_1.equal,
    length: misc_js_1.length,
    scan: scan_js_1.scan,
    Find: find_js_1.Find,
    get_binding: symbol_js_1.get_binding,
    set_binding: symbol_js_1.set_binding,
    usr_symbol: symbol_js_1.usr_symbol,
    collectUserSymbols: symbol_js_1.collectUserSymbols,
    init: init_js_1.init,
    exec: zombocom_js_1.exec,
    parse: zombocom_js_1.parse,
    run: run_js_1.run,
};
const builtin_fns = [
    'abs', 'add', 'adj', 'and',
    'approxratio', 'arccos', 'arccosh', 'arcsin',
    'arcsinh', 'arctan', 'arctanh', 'arg',
    'atomize', 'besselj', 'bessely', 'binding',
    'binomial', 'ceiling', 'check', 'choose',
    'circexp', 'clear', 'clearall', 'clearpatterns',
    'clock', 'coeff', 'cofactor', 'condense',
    'conj', 'contract', 'cos', 'cosh',
    'decomp', 'defint', 'deg', 'denominator',
    'det', 'derivative', 'dim', 'dirac',
    'divisors', 'do', 'dot', 'draw',
    'dsolve', 'eigen', 'eigenval', 'eigenvec',
    'erf', 'erfc', 'eval', 'exp',
    'expand', 'expcos', 'expsin', 'factor',
    'factorial', 'factorpoly', 'filter', 'float',
    'floor', 'for', 'Gamma', 'gcd',
    'hermite', 'hilbert', 'imag', 'component',
    'inner', 'integral', 'inv', 'invg',
    'isinteger', 'isprime', 'laguerre', 'lcm',
    'leading', 'legendre', 'log', 'mod',
    'multiply', 'not', 'nroots', 'number',
    'numerator', 'operator', 'or', 'outer',
    'pattern', 'patternsinfo', 'polar', 'power',
    'prime', 'print', 'print2dascii', 'printcomputer',
    'printlatex', 'printlist', 'printhuman', 'product',
    'quote', 'quotient', 'rank', 'rationalize',
    'real', 'rect', 'roots', 'round',
    'equals', 'shape', 'sgn', 'silentpattern',
    'simplify', 'sin', 'sinh', 'sqrt',
    'stop', 'subst', 'sum', 'symbolsinfo',
    'tan', 'tanh', 'taylor', 'test',
    'testeq', 'testge', 'testgt', 'testle',
    'testlt', 'transpose', 'unit', 'zero',
];
const $ = functions;
exports.$ = $;
Array.from(builtin_fns).map(fn => ($[fn] = zombocom_js_1.exec.bind(this, fn)));
exports.default = $;
