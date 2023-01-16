import { run_test } from '../test-harness.js';

run_test([
  '"hey" + "you"',
  '"hey"+"you"',

  '"hey" + "hey"',
  '2*"hey"',

  '"hey" / "hey"',
  '1',

  '"hey" - "hey"',
  '0',

  '"hey" * "hey"',
  '"hey"^2',

  '"aaaaaaaaaa\nbbbbbbbbbb"',
  '"aaaaaaaaaa\nbbbbbbbbbb"',
]);
