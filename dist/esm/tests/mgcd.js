import { MSIGN, MZERO } from '../runtime/defs.js';
import { stop } from '../runtime/run.js';
import { mint, setSignTo } from '../sources/bignum.js';
import { mgcd } from '../sources/mgcd.js';
import { mmod } from '../sources/mmul.js';
import { test } from '../test-harness.js';
for (let i = 1; i < 100; i++) {
    const a = mint(i);
    for (let j = 1; j < 100; j++) {
        test(`gcd(${i}, ${j})`, t => {
            const b = mint(j);
            const c = mgcd(a, b);
            const d = egcd(a, b);
            t.is(d.toString(), c.toString());
        });
    }
}
// Euclid's algorithm
function egcd(a, b) {
    let sign_ = 0;
    if (MZERO(b)) {
        stop('divide by zero');
    }
    //b = mcopy(b)
    if (MZERO(a)) {
        return b;
    }
    sign_ = MSIGN(b);
    //a = mcopy(a)
    while (!MZERO(b)) {
        const c = mmod(a, b);
        //mfree(a)
        a = b;
        b = c;
    }
    a = setSignTo(a, sign_);
    return a;
}
