import { cadr, car, Constants, COS, COSH, iscons, SIN, SINH, TAN, TANH, TENSOR } from '../runtime/defs.js';
import { symbol } from '../runtime/symbol.js';
import { exponential } from '../sources/misc.js';
import { add, subtract } from './add.js';
import { integer, rational } from './bignum.js';
import { Eval } from './eval.js';
import { expcos } from './expcos.js';
import { expsin } from './expsin.js';
import { divide, multiply, negate } from './multiply.js';
import { copy_tensor } from './tensor.js';
/* circexp =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------

Returns expression x with circular and hyperbolic functions converted to exponential forms. Sometimes this will simplify an expression.

*/
export function Eval_circexp(p1) {
    const result = circexp(Eval(cadr(p1)));
    return Eval(result);
}
function circexp(p1) {
    if (car(p1) === symbol(COS)) {
        return expcos(cadr(p1));
    }
    if (car(p1) === symbol(SIN)) {
        return expsin(cadr(p1));
    }
    if (car(p1) === symbol(TAN)) {
        p1 = cadr(p1);
        const p2 = exponential(multiply(Constants.imaginaryunit, p1));
        const p3 = exponential(negate(multiply(Constants.imaginaryunit, p1)));
        return divide(multiply(subtract(p3, p2), Constants.imaginaryunit), add(p2, p3));
    }
    if (car(p1) === symbol(COSH)) {
        p1 = cadr(p1);
        return multiply(add(exponential(p1), exponential(negate(p1))), rational(1, 2));
    }
    if (car(p1) === symbol(SINH)) {
        p1 = cadr(p1);
        return multiply(subtract(exponential(p1), exponential(negate(p1))), rational(1, 2));
    }
    if (car(p1) === symbol(TANH)) {
        p1 = exponential(multiply(cadr(p1), integer(2)));
        return divide(subtract(p1, Constants.one), add(p1, Constants.one));
    }
    if (iscons(p1)) {
        return p1.map(circexp);
    }
    if (p1.k === TENSOR) {
        p1 = copy_tensor(p1);
        p1.tensor.elem = p1.tensor.elem.map(circexp);
        return p1;
    }
    return p1;
}
