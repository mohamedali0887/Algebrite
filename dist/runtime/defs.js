import bigInt from 'big-integer';
import { collectLatexStringFromReturnValue, print_expr, } from '../sources/print';
import { symbol } from './symbol';
export function breakpoint() { }
// also change the version in the package.json file
export const version = '2.0.1';
const SELFTEST = 1;
// size of the symbol table
export const NSYM = 1000;
export const DEBUG = false;
export const PRINTOUTRESULT = false;
// printing-related constants
export const PRINTMODE_LATEX = 'PRINTMODE_LATEX';
export const PRINTMODE_2DASCII = 'PRINTMODE_2DASCII';
export const PRINTMODE_COMPUTER = 'PRINTMODE_COMPUTER';
export const PRINTMODE_HUMAN = 'PRINTMODE_HUMAN';
export const PRINTMODE_LIST = 'PRINTMODE_LIST';
class Defs {
    constructor() {
        // when the user uses the generic "print" statement
        // this setting kicks-in.
        this.printMode = PRINTMODE_COMPUTER;
        this.recursionLevelNestedRadicalsRemoval = 0;
        this.errorMessage = '';
        // needed for the mechanism to
        // find all dependencies between variables
        // in a script
        this.symbolsDependencies = {};
        this.symbolsHavingReassignments = [];
        this.symbolsInExpressionsWithoutAssignments = [];
        this.patternHasBeenFound = false;
        this.inited = false;
        this.chainOfUserSymbolsNotFunctionsBeingEvaluated = [];
        this.stringsEmittedByUserPrintouts = '';
        // flag use to potentially switch on/off some quirks "deep"
        // in the code due to call from Algebra block.
        // Currently not used.
        this.called_from_Algebra_block = false;
        this.expanding = false;
        this.evaluatingAsFloats = false;
        this.evaluatingPolar = false;
        this.esc_flag = false;
        this.trigmode = 0;
        this.out_count = 0;
        this.test_flag = false;
        this.codeGen = false;
        this.userSimplificationsInListForm = [];
        this.userSimplificationsInStringForm = [];
        this.fullDoubleOutput = false;
    }
}
export const defs = new Defs();
export const dontCreateNewRadicalsInDenominatorWhenEvalingMultiplication = true;
export const do_simplify_nested_radicals = true;
export const avoidCalculatingPowersIntoArctans = true;
// Symbolic expressions are built by connecting U structs.
//
// For example, (a b + c) is built like this:
//
//           _______      _______                                _______
//          |CONS   |--->|CONS   |----------------------------->|CONS   |
//          |       |    |       |                              |       |
//          |_______|    |_______|                              |_______|
//              |            |                                      |
//           ___v___      ___v___      _______      _______      ___v___
//          |ADD    |    |CONS   |--->|CONS   |--->|CONS   |    |SYM c  |
//          |       |    |       |    |       |    |       |    |       |
//          |_______|    |_______|    |_______|    |_______|    |_______|
//                           |            |            |
//                        ___v___      ___v___      ___v___
//                       |MUL    |    |SYM a  |    |SYM b  |
//                       |       |    |       |    |       |
//                       |_______|    |_______|    |_______|
export class BaseAtom {
    toString() {
        return print_expr(this);
    }
    toLatexString() {
        return collectLatexStringFromReturnValue(this);
    }
}
export class Cons extends BaseAtom {
    constructor(car, cdr) {
        super();
        this.k = CONS;
        this.cons = { car, cdr };
    }
    *[Symbol.iterator]() {
        let u = this;
        while (iscons(u)) {
            yield car(u);
            u = cdr(u);
        }
    }
    // Return everything except the first item in the list
    tail() {
        if (iscons(this.cons.cdr)) {
            return [...this.cons.cdr];
        }
        return [];
    }
    map(f) {
        const a = car(this);
        let b = cdr(this);
        if (iscons(b)) {
            b = b.map(f);
        }
        return new Cons(f(a), b);
    }
}
export class Num extends BaseAtom {
    constructor(a, b = bigInt.one) {
        super();
        this.a = a;
        this.b = b;
        this.q = this;
        this.k = NUM;
    }
}
export class Double extends BaseAtom {
    constructor(d) {
        super();
        this.d = d;
        this.k = DOUBLE;
    }
}
export class Str extends BaseAtom {
    constructor(str) {
        super();
        this.str = str;
        this.k = STR;
    }
}
export class Tensor extends BaseAtom {
    constructor() {
        super(...arguments);
        this.tensor = this;
        this.k = TENSOR;
        this.ndim = 0; // number of dimensions
        this.dim = []; // dimension length, for each dimension
        this.elem = []; // an array containing all the data
    }
    get nelem() {
        return this.elem.length;
    }
}
export class Sym extends BaseAtom {
    constructor(printname) {
        super();
        this.printname = printname;
        this.k = SYM;
    }
}
// the following enum is for struct U, member k
export const CONS = 0;
export const NUM = 1;
export const DOUBLE = 2;
export const STR = 3;
export const TENSOR = 4;
export const SYM = 5;
// the following enum is for indexing the symbol table
// standard functions first, then nil, then everything else
let counter = 0;
export const ABS = 'abs';
export const ADD = 'add';
export const ADJ = 'adj';
export const AND = 'and';
export const APPROXRATIO = 'approxratio';
export const ARCCOS = 'arccos';
export const ARCCOSH = 'arccosh';
export const ARCSIN = 'arcsin';
export const ARCSINH = 'arcsinh';
export const ARCTAN = 'arctan';
export const ARCTANH = 'arctanh';
export const ARG = 'arg';
export const ATOMIZE = 'atomize';
export const BESSELJ = 'besselj';
export const BESSELY = 'bessely';
export const BINDING = 'binding';
export const BINOMIAL = 'binomial';
export const CEILING = 'ceiling';
export const CHECK = 'check';
export const CHOOSE = 'choose';
export const CIRCEXP = 'circexp';
export const CLEAR = 'clear';
export const CLEARALL = 'clearall';
export const CLEARPATTERNS = 'clearpatterns';
export const CLOCK = 'clock';
export const COEFF = 'coeff';
export const COFACTOR = 'cofactor';
export const CONDENSE = 'condense';
export const CONJ = 'conj';
export const CONTRACT = 'contract';
export const COS = 'cos';
export const COSH = 'cosh';
export const DECOMP = 'decomp';
export const DEFINT = 'defint';
export const DEGREE = 'deg';
export const DENOMINATOR = 'denominator';
export const DERIVATIVE = 'derivative';
export const DET = 'det';
export const DIM = 'dim';
export const DIRAC = 'dirac';
export const DIVISORS = 'divisors';
export const DO = 'do';
export const DOT = 'dot';
export const DRAW = 'draw';
export const DSOLVE = 'dsolve';
export const EIGEN = 'eigen';
export const EIGENVAL = 'eigenval';
export const EIGENVEC = 'eigenvec';
export const ERF = 'erf';
export const ERFC = 'erfc';
export const EVAL = 'eval';
export const EXP = 'exp';
export const EXPAND = 'expand';
export const EXPCOS = 'expcos';
export const EXPSIN = 'expsin';
export const FACTOR = 'factor';
export const FACTORIAL = 'factorial';
export const FACTORPOLY = 'factorpoly';
export const FILTER = 'filter';
export const FLOATF = 'float';
export const FLOOR = 'floor';
export const FOR = 'for';
export const FUNCTION = 'function';
export const GAMMA = 'Gamma';
export const GCD = 'gcd';
export const HERMITE = 'hermite';
export const HILBERT = 'hilbert';
export const IMAG = 'imag';
export const INDEX = 'component';
export const INNER = 'inner';
export const INTEGRAL = 'integral';
export const INV = 'inv';
export const INVG = 'invg';
export const ISINTEGER = 'isinteger';
export const ISPRIME = 'isprime';
export const LAGUERRE = 'laguerre';
//  LAPLACE = 
export const LCM = 'lcm';
export const LEADING = 'leading';
export const LEGENDRE = 'legendre';
export const LOG = 'log';
export const LOOKUP = 'lookup';
export const MOD = 'mod';
export const MULTIPLY = 'multiply';
export const NOT = 'not';
export const NROOTS = 'nroots';
export const NUMBER = 'number';
export const NUMERATOR = 'numerator';
export const OPERATOR = 'operator';
export const OR = 'or';
export const OUTER = 'outer';
export const PATTERN = 'pattern';
export const PATTERNSINFO = 'patternsinfo';
export const POLAR = 'polar';
export const POWER = 'power';
export const PRIME = 'prime';
export const PRINT_LEAVE_E_ALONE = 'printLeaveEAlone';
export const PRINT_LEAVE_X_ALONE = 'printLeaveXAlone';
export const PRINT = 'print';
export const PRINT2DASCII = 'print2dascii';
export const PRINTFULL = 'printcomputer';
export const PRINTLATEX = 'printlatex';
export const PRINTLIST = 'printlist';
export const PRINTPLAIN = 'printhuman';
export const PRODUCT = 'product';
export const QUOTE = 'quote';
export const QUOTIENT = 'quotient';
export const RANK = 'rank';
export const RATIONALIZE = 'rationalize';
export const REAL = 'real';
export const ROUND = 'round';
export const YYRECT = 'rect';
export const ROOTS = 'roots';
export const SETQ = 'equals';
export const SGN = 'sgn';
export const SILENTPATTERN = 'silentpattern';
export const SIMPLIFY = 'simplify';
export const SIN = 'sin';
export const SINH = 'sinh';
export const SHAPE = 'shape';
export const SQRT = 'sqrt';
export const STOP = 'stop';
export const SUBST = 'subst';
export const SUM = 'sum';
export const SYMBOLSINFO = 'symbolsinfo';
export const TAN = 'tan';
export const TANH = 'tanh';
export const TAYLOR = 'taylor';
export const TEST = 'test';
export const TESTEQ = 'testeq';
export const TESTGE = 'testge';
export const TESTGT = 'testgt';
export const TESTLE = 'testle';
export const TESTLT = 'testlt';
export const TRANSPOSE = 'transpose';
export const UNIT = 'unit';
export const ZERO = 'zero';
// ALL THE SYMBOLS ABOVE NIL ARE KEYWORDS,
// WHICH MEANS THAT USER CANNOT REDEFINE THEM
export const NIL = 'nil'; // nil goes here, after standard functions
export const LAST = 'last';
export const LAST_PRINT = 'lastprint';
export const LAST_2DASCII_PRINT = 'last2dasciiprint';
export const LAST_FULL_PRINT = 'lastfullprint';
export const LAST_LATEX_PRINT = 'lastlatexprint';
export const LAST_LIST_PRINT = 'lastlistprint';
export const LAST_PLAIN_PRINT = 'lastplainprint';
export const AUTOEXPAND = 'autoexpand';
export const BAKE = 'bake';
export const ASSUME_REAL_VARIABLES = 'assumeRealVariables';
export const TRACE = 'trace';
export const FORCE_FIXED_PRINTOUT = 'forceFixedPrintout';
export const MAX_FIXED_PRINTOUT_DIGITS = 'maxFixedPrintoutDigits';
export const YYE = '~'; // tilde so sort puts it after other symbols
export const DRAWX = '$DRAWX'; // special purpose internal symbols
export const METAA = '$METAA';
export const METAB = '$METAB';
export const METAX = '$METAX';
export const SECRETX = '$SECRETX';
export const VERSION = 'version';
export const PI = 'pi';
export const SYMBOL_A = 'a';
export const SYMBOL_B = 'b';
export const SYMBOL_C = 'c';
export const SYMBOL_D = 'd';
export const SYMBOL_I = 'i';
export const SYMBOL_J = 'j';
export const SYMBOL_N = 'n';
export const SYMBOL_R = 'r';
export const SYMBOL_S = 's';
export const SYMBOL_T = 't';
export const SYMBOL_X = 'x';
export const SYMBOL_Y = 'y';
export const SYMBOL_Z = 'z';
export const SYMBOL_IDENTITY_MATRIX = 'I';
export const SYMBOL_A_UNDERSCORE = 'a_';
export const SYMBOL_B_UNDERSCORE = 'b_';
export const SYMBOL_X_UNDERSCORE = 'x_';
export const C1 = '$C1';
export const C2 = '$C2';
export const C3 = '$C3';
export const C4 = '$C4';
export const C5 = '$C5';
export const C6 = '$C6';
export const E = YYE;
export const MAXPRIMETAB = 10000;
export const MAX_CONSECUTIVE_APPLICATIONS_OF_ALL_RULES = 5;
export const MAX_CONSECUTIVE_APPLICATIONS_OF_SINGLE_RULE = 10;
//define _USE_MATH_DEFINES // for MS C++
export const MAXDIM = 24;
export const predefinedSymbolsInGlobalScope_doNotTrackInDependencies = [
    'rationalize',
    'abs',
    'e',
    'i',
    'pi',
    'sin',
    'ceiling',
    'cos',
    'roots',
    'integral',
    'derivative',
    'defint',
    'sqrt',
    'eig',
    'cov',
    'deig',
    'dcov',
    'float',
    'floor',
    'product',
    'root',
    'round',
    'sum',
    'test',
    'unit',
];
// you can do some little simplifications
// at parse time, such as calculating away
// immediately simple operations on
// constants, removing 1s from products
// etc.
export const parse_time_simplifications = true;
export const primetab = (function () {
    const primes = [2];
    let i = 3;
    while (primes.length < MAXPRIMETAB) {
        let j = 0;
        const ceil = Math.sqrt(i);
        while (j < primes.length && primes[j] <= ceil) {
            if (i % primes[j] === 0) {
                j = -1;
                break;
            }
            j++;
        }
        if (j !== -1) {
            primes.push(i);
        }
        i += 2;
    }
    primes[MAXPRIMETAB] = 0;
    return primes;
})();
let draw_flag = false;
export const mtotal = 0;
export const logbuf = '';
const arglist = []; // will contain U
const draw_stop_return = null; // extern jmp_buf ?????
export const transpose_unicode = 7488;
export const dotprod_unicode = 183;
export function iscons(p) {
    return p.k === CONS;
}
export function isrational(p) {
    return p.k === NUM;
}
export function isdouble(p) {
    return p.k === DOUBLE;
}
export function isNumericAtom(p) {
    return isrational(p) || isdouble(p);
}
export function isstr(p) {
    return p.k === STR;
}
export function istensor(p) {
    return p.k === TENSOR;
}
// because of recursion, we consider a scalar to be
// a tensor, so a numeric scalar will return true
export function isNumericAtomOrTensor(p) {
    if (isNumericAtom(p) || p === symbol(SYMBOL_IDENTITY_MATRIX)) {
        return true;
    }
    if (!istensor(p)) {
        //console.log "p not an atom nor a tensor: " + p
        return false;
    }
    const n = p.tensor.nelem;
    const a = p.tensor.elem;
    for (let i = 0; i < n; i++) {
        if (!isNumericAtomOrTensor(a[i])) {
            //console.log "non-numeric element: " + a[i]
            return false;
        }
    }
    return true;
}
export function issymbol(p) {
    return p.k === SYM;
}
export function car(p) {
    if (iscons(p)) {
        return p.cons.car;
    }
    else {
        return symbol(NIL);
    }
}
export function cdr(p) {
    if (iscons(p)) {
        return p.cons.cdr;
    }
    else {
        return symbol(NIL);
    }
}
export function caar(p) {
    return car(car(p));
}
export function cadr(p) {
    return car(cdr(p));
}
export function cdar(p) {
    return cdr(car(p));
}
export function cddr(p) {
    return cdr(cdr(p));
}
export function caadr(p) {
    return car(car(cdr(p)));
}
export function caddr(p) {
    return car(cdr(cdr(p)));
}
export function cadar(p) {
    return car(cdr(car(p)));
}
export function cdadr(p) {
    return cdr(car(cdr(p)));
}
export function cddar(p) {
    return cdr(cdr(car(p)));
}
export function cdddr(p) {
    return cdr(cdr(cdr(p)));
}
export function caaddr(p) {
    return car(car(cdr(cdr(p))));
}
export function cadadr(p) {
    return car(cdr(car(cdr(p))));
}
export function caddar(p) {
    return car(cdr(cdr(car(p))));
}
export function cdaddr(p) {
    return cdr(car(cdr(cdr(p))));
}
export function cadddr(p) {
    return car(cdr(cdr(cdr(p))));
}
export function cddddr(p) {
    return cdr(cdr(cdr(cdr(p))));
}
export function caddddr(p) {
    return car(cdr(cdr(cdr(cdr(p)))));
}
export function cadaddr(p) {
    return car(cdr(car(cdr(cdr(p)))));
}
export function cddaddr(p) {
    return cdr(cdr(car(cdr(cdr(p)))));
}
export function caddadr(p) {
    return car(cdr(cdr(car(cdr(p)))));
}
export function cdddaddr(p) {
    return cdr(cdr(cdr(car(cdr(cdr(p))))));
}
export function caddaddr(p) {
    return car(cdr(cdr(car(cdr(cdr(p))))));
}
export function isadd(p) {
    return car(p) === symbol(ADD);
}
export function ismultiply(p) {
    return car(p) === symbol(MULTIPLY);
}
export function ispower(p) {
    return car(p) === symbol(POWER);
}
export function isfactorial(p) {
    return car(p) === symbol(FACTORIAL);
}
export function isinnerordot(p) {
    return car(p) === symbol(INNER) || car(p) === symbol(DOT);
}
export function istranspose(p) {
    return car(p) === symbol(TRANSPOSE);
}
export function isinv(p) {
    return car(p) === symbol(INV);
}
// TODO this is a bit of a shallow check, we should
// check when we are passed an actual tensor and possibly
// cache the test result.
export function isidentitymatrix(p) {
    return p === symbol(SYMBOL_IDENTITY_MATRIX);
}
export function MSIGN(p) {
    if (p.isPositive()) {
        return 1;
    }
    else if (p.isZero()) {
        return 0;
    }
    else {
        return -1;
    }
}
function MLENGTH(p) {
    return p.toString().length;
}
export function MZERO(p) {
    return p.isZero();
}
export function MEQUAL(p, n) {
    if (p == null) {
        breakpoint;
    }
    return p.equals(n);
}
export function reset_after_error() {
    defs.esc_flag = false;
    draw_flag = false;
    defs.evaluatingAsFloats = false;
    defs.evaluatingPolar = false;
}
export const $ = {};
export class Constants {
    static One() {
        return defs.evaluatingAsFloats ? Constants.oneAsDouble : Constants.one;
    }
    static NegOne() {
        return defs.evaluatingAsFloats
            ? Constants.negOneAsDouble
            : Constants.negOne;
    }
    static Zero() {
        return defs.evaluatingAsFloats ? Constants.zeroAsDouble : Constants.zero;
    }
    static Pi() {
        return defs.evaluatingAsFloats ? Constants.piAsDouble : symbol(PI);
    }
}
Constants.one = new Num(bigInt(1));
Constants.oneAsDouble = new Double(1.0);
Constants.negOne = new Num(bigInt(-1));
Constants.negOneAsDouble = new Double(-1.0);
Constants.zero = new Num(bigInt(0));
Constants.zeroAsDouble = new Double(0.0);
Constants.piAsDouble = new Double(Math.PI);
// Call a function temporarily setting "expanding" to false
export function noexpand(func, ...args) {
    const prev_expanding = defs.expanding;
    defs.expanding = false;
    try {
        return func(...args);
    }
    finally {
        defs.expanding = prev_expanding;
    }
}
// Call a function temporarily setting "expanding" to true
export function doexpand(func, ...args) {
    const prev_expanding = defs.expanding;
    defs.expanding = true;
    try {
        return func(...args);
    }
    finally {
        defs.expanding = prev_expanding;
    }
}
// Call a function temporarily setting "evaluatingPolar" to true
export function evalPolar(func, ...args) {
    const prev_evaluatingPolar = defs.evaluatingPolar;
    defs.evaluatingPolar = true;
    try {
        return func(...args);
    }
    finally {
        defs.evaluatingPolar = prev_evaluatingPolar;
    }
}
// Call a function temporarily setting "evaluatingAsFloats" to true
export function evalFloats(func, ...args) {
    const prev_evaluatingAsFloats = defs.evaluatingAsFloats;
    defs.evaluatingAsFloats = true;
    try {
        return func(...args);
    }
    finally {
        defs.evaluatingAsFloats = prev_evaluatingAsFloats;
    }
}
