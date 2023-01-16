import { alloc_tensor } from '../runtime/alloc.js';
import { car, cdr, Constants, isadd, iscons, istensor } from '../runtime/defs.js';
import { Find } from '../runtime/find.js';
import { add } from './add.js';
import { Eval } from './eval.js';
/*
Remove terms that involve a given symbol or expression. For example...

  filter(x^2 + x + 1, x)    =>  1

  filter(x^2 + x + 1, x^2)  =>  x + 1
*/
export function Eval_filter(p1) {
    p1 = cdr(p1);
    let result = Eval(car(p1));
    if (iscons(p1)) {
        result = p1.tail().reduce((acc, p) => filter(acc, Eval(p)), result);
    }
    return result;
}
export function filter(F, X) {
    return filter_main(F, X);
}
function filter_main(F, X) {
    if (isadd(F)) {
        return filter_sum(F, X);
    }
    if (istensor(F)) {
        return filter_tensor(F, X);
    }
    if (Find(F, X)) {
        return Constants.zero;
    }
    return F;
}
function filter_sum(F, X) {
    return iscons(F)
        ? F.tail().reduce((a, b) => add(a, filter(b, X)), Constants.zero)
        : Constants.zero;
}
function filter_tensor(F, X) {
    const n = F.tensor.nelem;
    const p3 = alloc_tensor(n);
    p3.tensor.ndim = F.tensor.ndim;
    p3.tensor.dim = Array.from(F.tensor.dim);
    p3.tensor.elem = F.tensor.elem.map((el) => filter(el, X));
    return p3;
}
