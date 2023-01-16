import { primetab } from '../runtime/defs.js';
import { mint } from '../sources/bignum.js';
import { mprime } from '../sources/mprime.js';
import { test } from '../test-harness.js';
let i = 0;
let k = 0;
const m = 0;
let t = 0;
k = 0;
for (i = 0; i < 10000; i++) {
    const n = mint(i);
    let expectPrime = i === primetab[k];
    if (expectPrime) {
        k++;
    }
    test(`mprime(${i}) = ${expectPrime}`, t => t.is(expectPrime, mprime(n)));
}
//endif
