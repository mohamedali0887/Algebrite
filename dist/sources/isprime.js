import { cadr, Constants } from '../runtime/defs';
import { Eval } from './eval';
import { isnonnegativeinteger } from './is';
import { mprime } from './mprime';
export function Eval_isprime(p1) {
    return isprime(Eval(cadr(p1)));
}
function isprime(p1) {
    if (isnonnegativeinteger(p1) && mprime(p1.q.a)) {
        return Constants.one;
    }
    return Constants.zero;
}
