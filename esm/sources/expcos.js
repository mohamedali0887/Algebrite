import { cadr, Constants } from '../runtime/defs.js';
import { exponential } from '../sources/misc.js';
import { add } from './add.js';
import { rational } from './bignum.js';
import { Eval } from './eval.js';
import { multiply, negate } from './multiply.js';
// Do the exponential cosine function.
export function Eval_expcos(p1) {
    return expcos(Eval(cadr(p1)));
}
export function expcos(p1) {
    return add(multiply(exponential(multiply(Constants.imaginaryunit, p1)), rational(1, 2)), multiply(exponential(multiply(negate(Constants.imaginaryunit), p1)), rational(1, 2)));
}
