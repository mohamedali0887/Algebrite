import { run_test } from '../test-harness.js';
run_test(['subst((-1)^(1/2),i,-3 + 10*3^(1/2)*i/9)', '-3+10/9*i*3^(1/2)']);
