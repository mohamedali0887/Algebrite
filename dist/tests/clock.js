import { run_test } from '../test-harness';
run_test([
    'clock(exp(i pi/3))',
    '(-1)^(1/3)',
    'clock(exp(-i pi/3))',
    //"-(-1)^(2/3)",
    '1/(-1)^(1/3)',
    'rect(clock(3+4*i))',
    '3+4*i',
    'clock((-108+108*(-1)^(1/2)*3^(1/2))^(1/3))',
    '6*(-1)^(2/9)',
]);
