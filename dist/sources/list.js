import { Cons, NIL } from '../runtime/defs';
import { symbol } from "../runtime/symbol";
// Convert an array into a CONS list.
// TODO: rename this to just list
export function makeList(...items) {
    let node = symbol(NIL);
    for (let i = items.length - 1; i >= 0; i--) {
        node = new Cons(items[i], node);
    }
    return node;
}
