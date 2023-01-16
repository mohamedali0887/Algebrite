import { cdr, Constants, iscons } from '../runtime/defs.js';
import { Find } from '../runtime/find.js';
import { multiply } from './multiply.js';
/*
 Partition a term

  Input:
    p1: term (factor or product of factors)
    p2: free variable

  Output:
    constant expression
    variable expression
*/
export function partition(p1, p2) {
    let p3 = Constants.one;
    let p4 = p3;
    p1 = cdr(p1);
    if (!iscons(p1)) {
        return [p3, p4];
    }
    for (const p of p1) {
        if (Find(p, p2)) {
            p4 = multiply(p4, p);
        }
        else {
            p3 = multiply(p3, p);
        }
    }
    return [p3, p4];
}
