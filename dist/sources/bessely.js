import { BESSELY, caddr, cadr, Constants, isdouble } from '../runtime/defs';
import { yn } from '../runtime/otherCFunctions';
import { symbol } from "../runtime/symbol";
import { double, nativeInt } from './bignum';
import { Eval } from './eval';
import { isnegativeterm } from './is';
import { makeList } from './list';
import { multiply, negate } from './multiply';
import { power } from './power';
/* bessely =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x,n

General description
-------------------

Bessel function of second kind.

*/
export function Eval_bessely(p1) {
    return bessely(Eval(cadr(p1)), Eval(caddr(p1)));
}
export function bessely(p1, p2) {
    return yybessely(p1, p2);
}
function yybessely(X, N) {
    const n = nativeInt(N);
    if (isdouble(X) && !isNaN(n)) {
        const d = yn(n, X.d);
        return double(d);
    }
    if (isnegativeterm(N)) {
        return multiply(power(Constants.negOne, N), makeList(symbol(BESSELY), X, negate(N)));
    }
    return makeList(symbol(BESSELY), X, N);
}
