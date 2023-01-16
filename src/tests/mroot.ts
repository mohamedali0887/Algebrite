import { mint } from '../sources/bignum.js';
import { mpow } from '../sources/mpow.js';
import { mroot } from '../sources/mroot.js';
import { test } from '../test-harness.js';

// small numbers
for (let i = 0; i < 10; i++) {
  const a = mint(i);
  for (let j = 1; j < 10; j++) {
    test(`mroot(mpow(${i},${j}),${j})=${i}`, t => {
      const b = mpow(a, j);
      const c = mroot(b, j);
      t.not(0, c);
      t.is(a.toString(), c.toString());
    });
  }
}

// big numbers
const a = mint(12345);
for (let i = 1; i < 10; i++) {
  test(`mroot(mpow(${a},${i}),${i})=${a}`, t => {
    const b = mpow(a, i);
    const c = mroot(b, i);
    t.not(0, c);
    t.is(a.toString(), c.toString());
  });
}
