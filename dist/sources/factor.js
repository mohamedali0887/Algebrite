import { caddr, cadr, cdddr, Constants, iscons, ismultiply, MAXPRIMETAB, NIL, primetab } from '../runtime/defs';
import { stop } from '../runtime/run';
import { symbol } from "../runtime/symbol";
import { integer } from './bignum';
import { Eval } from './eval';
import { factorpoly } from './factorpoly';
import { guess } from './guess';
import { isinteger } from './is';
import { multiply_all_noexpand } from './multiply';
import { factor_number } from './pollard';
// factor a polynomial or integer
export function Eval_factor(p1) {
    const top = Eval(cadr(p1));
    const p2 = Eval(caddr(p1));
    const variable = p2 === symbol(NIL) ? guess(top) : p2;
    let temp = factor(top, variable);
    // more factoring?
    p1 = cdddr(p1);
    if (iscons(p1)) {
        temp = [...p1].reduce((acc, p) => factor_again(acc, Eval(p)), temp);
    }
    return temp;
}
function factor_again(p1, p2) {
    if (ismultiply(p1)) {
        const arr = [];
        p1.tail().forEach((el) => factor_term(arr, el, p2));
        return multiply_all_noexpand(arr);
    }
    const arr = [];
    factor_term(arr, p1, p2);
    return arr[0];
}
function factor_term(arr, arg1, arg2) {
    const p1 = factorpoly(arg1, arg2);
    if (ismultiply(p1)) {
        arr.push(...p1.tail());
        return;
    }
    arr.push(p1);
}
export function factor(p1, p2) {
    if (isinteger(p1)) {
        return factor_number(p1); // see pollard.cpp
    }
    return factorpoly(p1, p2);
}
// for factoring small integers (2^32 or less)
export function factor_small_number(n) {
    if (isNaN(n)) {
        stop('number too big to factor');
    }
    const arr = [];
    if (n < 0) {
        n = -n;
    }
    for (let i = 0; i < MAXPRIMETAB; i++) {
        const d = primetab[i];
        if (d > n / d) {
            break;
        }
        let expo = 0;
        while (n % d === 0) {
            n /= d;
            expo++;
        }
        if (expo) {
            arr.push(integer(d));
            arr.push(integer(expo));
        }
    }
    if (n > 1) {
        arr.push(integer(n));
        arr.push(Constants.one);
    }
    return arr;
}
