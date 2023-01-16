"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bignum_factorial = exports.bignum_float = exports.nativeDouble = exports.gcd_numbers = exports.print_number = exports.bignum_scan_float = exports.bignum_scan_integer = exports.nativeInt = exports.rational = exports.double = exports.integer = exports.convert_rational_to_double = exports.bignum_power_number = exports.mp_denominator = exports.mp_numerator = exports.bignum_truncate = exports.negate_number = exports.compare_numbers = exports.invert_number = exports.divide_numbers = exports.multiply_numbers = exports.add_numbers = exports.makePositive = exports.makeSignSameAs = exports.setSignTo = exports.isSmall = exports.mint = void 0;
const big_integer_1 = __importDefault(require("big-integer"));
const defs_js_1 = require("../runtime/defs.js");
const mcmp_js_1 = require("../runtime/mcmp.js");
const otherCFunctions_js_1 = require("../runtime/otherCFunctions.js");
const run_js_1 = require("../runtime/run.js");
const is_js_1 = require("./is.js");
const mgcd_js_1 = require("./mgcd.js");
const mmul_js_1 = require("./mmul.js");
const mpow_js_1 = require("./mpow.js");
const multiply_js_1 = require("./multiply.js");
const qadd_js_1 = require("./qadd.js");
const qdiv_js_1 = require("./qdiv.js");
const qmul_js_1 = require("./qmul.js");
//double convert_rational_to_double(U *)
//double convert_bignum_to_double(unsigned int *)
//int ge(unsigned int *, unsigned int *, int)
function mint(a) {
    return (0, big_integer_1.default)(a);
}
exports.mint = mint;
function isSmall(a) {
    return a.geq(Number.MIN_SAFE_INTEGER) && a.leq(Number.MAX_SAFE_INTEGER);
}
exports.isSmall = isSmall;
// b is +1 or -1
function setSignTo(a, b) {
    if (a.isPositive()) {
        if (b < 0) {
            return a.multiply((0, big_integer_1.default)(-1));
        }
    }
    else {
        // a is negative
        if (b > 0) {
            return a.multiply((0, big_integer_1.default)(-1));
        }
    }
    return a;
}
exports.setSignTo = setSignTo;
function makeSignSameAs(a, b) {
    if (a.isPositive()) {
        if (b.isNegative()) {
            return a.multiply((0, big_integer_1.default)(-1));
        }
    }
    else {
        // a is negative
        if (b.isPositive()) {
            return a.multiply((0, big_integer_1.default)(-1));
        }
    }
    return a;
}
exports.makeSignSameAs = makeSignSameAs;
function makePositive(a) {
    if (a.isNegative()) {
        return a.multiply((0, big_integer_1.default)(-1));
    }
    return a;
}
exports.makePositive = makePositive;
// n is an int
/*
mtotal = 0
MP_MIN_SIZE = 2
MP_MAX_FREE  = 1000

mnew = (n) ->
  if (n < MP_MIN_SIZE)
    n = MP_MIN_SIZE
  if (n == MP_MIN_SIZE && mfreecount)
    p = free_stack[--mfreecount]
  else
    p = [] #(unsigned int *) malloc((n + 3) * sizeof (int))
    *if (p == 0)
    *  stop("malloc failure")
  p[0] = n
  mtotal += n
  return p[3]
*/
// p is the index of array of ints
// !!! array wasn't passed here
/*
free_stack = []

mfree = (array, p) ->
  p -= 3
  mtotal -= array[p]
  if (array[p] == MP_MIN_SIZE && mfreecount < MP_MAX_FREE)
    free_stack[mfreecount++] = p
  else
    free(p)
*/
// convert int to bignum
// n is an int
/*
mint = (n) ->
  p = mnew(1)
  if (n < 0)
    * !!! this is FU
    * MSIGN(p) = -1
    fu = true
  else
    * !!! this is FU
    *MSIGN(p) = 1
    fu = true
  * !!! this is FU
  *MLENGTH(p) = 1
  p[0] = Math.abs(n)
  return p
*/
// copy bignum
// a is an array of ints
/*
mcopy = (a) ->
  *unsigned int *b

  b = mnew(MLENGTH(a))

  * !!! fu
  *MSIGN(b) = MSIGN(a)
  *MLENGTH(b) = MLENGTH(a)

  for i in [0...MLENGTH(a)]
    b[i] = a[i]

  return b
*/
/*
*
* ge not invoked from anywhere - is you need ge
* just use the bigNum's ge implementation
* leaving it here just in case I decide to backport to C
*
* a >= b ?
* and and b arrays of ints, len is an int
ge = (a, b, len) ->
  i = 0
  for i in [0...len]
    if (a[i] == b[i])
      continue
    else
      break
  if (a[i] >= b[i])
    return 1
  else
    return 0
*/
function add_numbers(p1, p2) {
    //if DEBUG then console.log("add_numbers adding numbers: " + print_list(stack[tos - 1]) + " and " + print_list(stack[tos - 2]))
    if ((0, defs_js_1.isrational)(p1) && (0, defs_js_1.isrational)(p2)) {
        return (0, qadd_js_1.qadd)(p1, p2);
    }
    const a = (0, defs_js_1.isdouble)(p1) ? p1.d : convert_rational_to_double(p1);
    const b = (0, defs_js_1.isdouble)(p2) ? p2.d : convert_rational_to_double(p2);
    return double(a + b);
}
exports.add_numbers = add_numbers;
function multiply_numbers(p1, p2) {
    if ((0, defs_js_1.isrational)(p1) && (0, defs_js_1.isrational)(p2)) {
        return (0, qmul_js_1.qmul)(p1, p2);
    }
    const a = (0, defs_js_1.isdouble)(p1) ? p1.d : convert_rational_to_double(p1);
    const b = (0, defs_js_1.isdouble)(p2) ? p2.d : convert_rational_to_double(p2);
    return new defs_js_1.Double(a * b);
}
exports.multiply_numbers = multiply_numbers;
function divide_numbers(p1, p2) {
    if ((0, defs_js_1.isrational)(p1) && (0, defs_js_1.isrational)(p2)) {
        return (0, qdiv_js_1.qdiv)(p1, p2);
    }
    if ((0, is_js_1.isZeroAtomOrTensor)(p2)) {
        (0, run_js_1.stop)('divide by zero');
    }
    const a = (0, defs_js_1.isdouble)(p1) ? p1.d : convert_rational_to_double(p1);
    const b = (0, defs_js_1.isdouble)(p2) ? p2.d : convert_rational_to_double(p2);
    return new defs_js_1.Double(a / b);
}
exports.divide_numbers = divide_numbers;
function invert_number(p1) {
    if ((0, is_js_1.isZeroAtomOrTensor)(p1)) {
        (0, run_js_1.stop)('divide by zero');
    }
    if ((0, defs_js_1.isdouble)(p1)) {
        return new defs_js_1.Double(1 / p1.d);
    }
    let a = (0, big_integer_1.default)(p1.q.a);
    let b = (0, big_integer_1.default)(p1.q.b);
    b = makeSignSameAs(b, a);
    a = setSignTo(a, 1);
    return new defs_js_1.Num(b, a);
}
exports.invert_number = invert_number;
function compare_rationals(a, b) {
    //unsigned int *ab, *ba
    const ab = (0, mmul_js_1.mmul)(a.q.a, b.q.b);
    const ba = (0, mmul_js_1.mmul)(a.q.b, b.q.a);
    return (0, mcmp_js_1.mcmp)(ab, ba);
}
function compare_numbers(a, b) {
    if ((0, defs_js_1.isrational)(a) && (0, defs_js_1.isrational)(b)) {
        return compare_rationals(a, b);
    }
    const x = (0, defs_js_1.isdouble)(a) ? a.d : convert_rational_to_double(a);
    const y = (0, defs_js_1.isdouble)(b) ? b.d : convert_rational_to_double(b);
    if (x < y) {
        return -1;
    }
    if (x > y) {
        return 1;
    }
    return 0;
}
exports.compare_numbers = compare_numbers;
function negate_number(p1) {
    if ((0, is_js_1.isZeroAtomOrTensor)(p1)) {
        return p1;
    }
    switch (p1.k) {
        case defs_js_1.NUM:
            return new defs_js_1.Num((0, big_integer_1.default)(p1.q.a.multiply(big_integer_1.default.minusOne)), (0, big_integer_1.default)(p1.q.b));
        case defs_js_1.DOUBLE:
            return new defs_js_1.Double(-p1.d);
        default:
            (0, run_js_1.stop)('bug caught in mp_negate_number');
    }
}
exports.negate_number = negate_number;
function bignum_truncate(p1) {
    const a = (0, mmul_js_1.mdiv)(p1.q.a, p1.q.b);
    return new defs_js_1.Num(a);
}
exports.bignum_truncate = bignum_truncate;
function mp_numerator(p1) {
    if (!(0, defs_js_1.isrational)(p1)) {
        return defs_js_1.Constants.one;
    }
    return new defs_js_1.Num((0, big_integer_1.default)(p1.q.a));
}
exports.mp_numerator = mp_numerator;
function mp_denominator(p1) {
    if (!(0, defs_js_1.isrational)(p1)) {
        return defs_js_1.Constants.one;
    }
    return new defs_js_1.Num((0, big_integer_1.default)(p1.q.b));
}
exports.mp_denominator = mp_denominator;
// expo is an integer
function bignum_power_number(base, expo) {
    let a = (0, mpow_js_1.mpow)(base.q.a, Math.abs(expo));
    let b = (0, mpow_js_1.mpow)(base.q.b, Math.abs(expo));
    if (expo < 0) {
        // swap a and b
        const t = a;
        a = b;
        b = t;
        a = makeSignSameAs(a, b);
        b = setSignTo(b, 1);
    }
    return new defs_js_1.Num(a, b);
}
exports.bignum_power_number = bignum_power_number;
// p an array of ints
function convert_bignum_to_double(p) {
    return p.toJSNumber();
}
function convert_rational_to_double(p) {
    if (p.q == null) {
        defs_js_1.breakpoint;
    }
    const quotientAndRemainder = p.q.a.divmod(p.q.b);
    const result = quotientAndRemainder.quotient.toJSNumber() +
        quotientAndRemainder.remainder.toJSNumber() / p.q.b.toJSNumber();
    return result;
}
exports.convert_rational_to_double = convert_rational_to_double;
function integer(n) {
    return new defs_js_1.Num((0, big_integer_1.default)(n));
}
exports.integer = integer;
function double(d) {
    return new defs_js_1.Double(d);
}
exports.double = double;
function rational(a, b) {
    // `as any as number` cast added because bigInt(number) and bigInt(bigInt.BigInteger)
    // are both accepted signatures, but bigInt(number|bigInt.BigInteger) is not
    return new defs_js_1.Num((0, big_integer_1.default)(a), (0, big_integer_1.default)(b));
}
exports.rational = rational;
function nativeInt(p1) {
    let n = NaN;
    switch (p1.k) {
        case defs_js_1.NUM:
            if ((0, is_js_1.isinteger)(p1) && isSmall(p1.q.a)) {
                n = p1.q.a.toJSNumber();
            }
            break;
        case defs_js_1.DOUBLE:
            if (defs_js_1.DEBUG) {
                console.log('popping integer but double is found');
            }
            if (Math.floor(p1.d) === p1.d) {
                if (defs_js_1.DEBUG) {
                    console.log("...although it's an integer");
                }
                n = p1.d;
            }
            break;
    }
    return n;
}
exports.nativeInt = nativeInt;
function bignum_scan_integer(s) {
    let scounter = 0;
    const sign_ = s[scounter];
    if (sign_ === '+' || sign_ === '-') {
        scounter++;
    }
    // !!!! some mess in here, added an argument
    const a = (0, big_integer_1.default)(s.substring(scounter));
    let p1 = new defs_js_1.Num(a);
    if (sign_ === '-') {
        p1 = (0, multiply_js_1.negate)(p1);
    }
    return p1;
}
exports.bignum_scan_integer = bignum_scan_integer;
function bignum_scan_float(s) {
    return double(parseFloat(s));
}
exports.bignum_scan_float = bignum_scan_float;
// gives the capability of printing the unsigned
// value. This is handy because printing of the sign
// might be taken care of "upstream"
// e.g. when printing a base elevated to a negative exponent
// prints the inverse of the base powered to the unsigned
// exponent.
function print_number(p, signed) {
    let accumulator = '';
    let denominatorString = '';
    const buf = '';
    switch (p.k) {
        case defs_js_1.NUM:
            var aAsString = p.q.a.toString();
            if (!signed) {
                if (aAsString[0] === '-') {
                    aAsString = aAsString.substring(1);
                }
            }
            if (defs_js_1.defs.printMode === defs_js_1.PRINTMODE_LATEX && (0, is_js_1.isfraction)(p)) {
                aAsString = '\\frac{' + aAsString + '}{';
            }
            accumulator += aAsString;
            if ((0, is_js_1.isfraction)(p)) {
                if (defs_js_1.defs.printMode !== defs_js_1.PRINTMODE_LATEX) {
                    accumulator += '/';
                }
                denominatorString = p.q.b.toString();
                if (defs_js_1.defs.printMode === defs_js_1.PRINTMODE_LATEX) {
                    denominatorString += '}';
                }
                accumulator += denominatorString;
            }
            break;
        case defs_js_1.DOUBLE:
            aAsString = (0, otherCFunctions_js_1.doubleToReasonableString)(p.d);
            if (!signed) {
                if (aAsString[0] === '-') {
                    aAsString = aAsString.substring(1);
                }
            }
            accumulator += aAsString;
            break;
    }
    return accumulator;
}
exports.print_number = print_number;
function gcd_numbers(p1, p2) {
    //  if (!isinteger(p1) || !isinteger(p2))
    //    stop("integer args expected for gcd")
    const a = (0, mgcd_js_1.mgcd)(p1.q.a, p2.q.a);
    const b = (0, mgcd_js_1.mgcd)(p1.q.b, p2.q.b);
    return new defs_js_1.Num(setSignTo(a, 1), b);
}
exports.gcd_numbers = gcd_numbers;
function nativeDouble(p1) {
    let d = 0.0;
    switch (p1.k) {
        case defs_js_1.NUM:
            d = convert_rational_to_double(p1);
            break;
        case defs_js_1.DOUBLE:
            ({ d } = p1);
            break;
        default:
            d = 0.0;
    }
    return d;
}
exports.nativeDouble = nativeDouble;
function bignum_float(n) {
    const d = convert_rational_to_double(n);
    return new defs_js_1.Double(d);
}
exports.bignum_float = bignum_float;
//static unsigned int *__factorial(int)
// n is an int
function bignum_factorial(n) {
    return new defs_js_1.Num(__factorial(n));
}
exports.bignum_factorial = bignum_factorial;
// n is an int
function __factorial(n) {
    let a;
    // unsigned int *a, *b, *t
    if (n === 0 || n === 1) {
        a = (0, big_integer_1.default)(1);
        return a;
    }
    a = (0, big_integer_1.default)(2);
    let b = (0, big_integer_1.default)(0);
    if (3 <= n) {
        for (let i = 3; i <= n; i++) {
            b = (0, big_integer_1.default)(i);
            a = (0, mmul_js_1.mmul)(a, b);
        }
    }
    return a;
}
const mask = [
    0x00000001,
    0x00000002,
    0x00000004,
    0x00000008,
    0x00000010,
    0x00000020,
    0x00000040,
    0x00000080,
    0x00000100,
    0x00000200,
    0x00000400,
    0x00000800,
    0x00001000,
    0x00002000,
    0x00004000,
    0x00008000,
    0x00010000,
    0x00020000,
    0x00040000,
    0x00080000,
    0x00100000,
    0x00200000,
    0x00400000,
    0x00800000,
    0x01000000,
    0x02000000,
    0x04000000,
    0x08000000,
    0x10000000,
    0x20000000,
    0x40000000,
    0x80000000,
];
// unsigned int *x, unsigned int k
function mp_clr_bit(x, k) {
    console.log('not implemented yet');
    defs_js_1.breakpoint;
    return (x[k / 32] &= ~mask[k % 32]);
}
