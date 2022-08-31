import { cadr, isdouble, isNumericAtom, ROUND } from '../runtime/defs';
import { symbol } from "../runtime/symbol";
import { double, integer } from './bignum';
import { Eval } from './eval';
import { yyfloat } from './float';
import { isinteger } from './is';
import { makeList } from './list';
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
