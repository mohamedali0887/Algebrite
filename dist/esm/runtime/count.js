import { equal } from '../sources/misc.js';
import { iscons, istensor } from './defs.js';
const sum = (arr) => arr.reduce((a, b) => a + b, 0);
export function count(p) {
    let n;
    if (iscons(p)) {
        const items = [...p];
        n = sum(items.map(count)) + items.length;
    }
    else {
        n = 1;
    }
    return n;
}
// this probably works out to be
// more general than just counting symbols, it can
// probably count instances of anything you pass as
// first argument but didn't try it.
export function countOccurrencesOfSymbol(needle, p) {
    let n = 0;
    if (iscons(p)) {
        n = sum([...p].map((el) => countOccurrencesOfSymbol(needle, el)));
    }
    else if (equal(needle, p)) {
        n = 1;
    }
    return n;
}
// returns the total number of elements
// in an expression
export function countsize(p) {
    let n = 0;
    if (istensor(p)) {
        for (let i = 0; i < p.tensor.nelem; i++) {
            n += count(p.tensor.elem[i]);
        }
    }
    else if (iscons(p)) {
        const items = [...p];
        n = sum(items.map(count)) + items.length;
    }
    else {
        n = 1;
    }
    return n;
}
