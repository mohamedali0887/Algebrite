import { cadr, Constants } from '../runtime/defs.js';
import { Eval } from './eval.js';
import { isnonnegativeinteger } from './is.js';
import { mprime } from './mprime.js';
export function Eval_isprime(p1) {
    return isprime(Eval(cadr(p1)));
}
function isprime(p1) {
    if (isnonnegativeinteger(p1) && mprime(p1.q.a)) {
        return Constants.one;
    }
    return Constants.zero;
}
