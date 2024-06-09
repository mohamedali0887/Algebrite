import { isadd, ismultiply } from '../runtime/defs.js';
// Push expression factors onto the stack. For example...
//
// Input
//
//       2
//     3x  + 2x + 1
//
// Output on stack
//
//     [  3  ]
//     [ x^2 ]
//     [  2  ]
//     [  x  ]
//     [  1  ]
//
// but not necessarily in that order. Returns the number of factors.
export function factors(p) {
    const result = [];
    if (isadd(p)) {
        p.tail().forEach((el) => result.push(...term_factors(el)));
    }
    else {
        result.push(...term_factors(p));
    }
    return result;
}
function term_factors(p) {
    if (ismultiply(p)) {
        return p.tail();
    }
    return [p];
}
