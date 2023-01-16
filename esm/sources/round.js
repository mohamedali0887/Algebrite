import { cadr, isdouble, isNumericAtom, ROUND } from '../runtime/defs.js';
import { symbol } from '../runtime/symbol.js';
import { double, integer } from './bignum.js';
import { Eval } from './eval.js';
import { yyfloat } from './float.js';
import { isinteger } from './is.js';
import { makeList } from './list.js';
export function Eval_round(p1) {
    return yround(Eval(cadr(p1)));
}
function yround(p1) {
    if (!isNumericAtom(p1)) {
        return makeList(symbol(ROUND), p1);
    }
    if (isdouble(p1)) {
        return double(Math.round(p1.d));
    }
    if (isinteger(p1)) {
        return p1;
    }
    p1 = yyfloat(p1);
    return integer(Math.round(p1.d));
}
