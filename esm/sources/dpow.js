import { Constants } from '../runtime/defs.js';
import { stop } from '../runtime/run.js';
import { add } from './add.js';
import { double } from './bignum.js';
import { multiply } from './multiply.js';
// power function for double precision floating point
export function dpow(base, expo) {
    // divide by zero?
    if (base === 0.0 && expo < 0.0) {
        stop('divide by zero');
    }
    // nonnegative base or integer power?
    if (base >= 0.0 || expo % 1.0 === 0.0) {
        return double(Math.pow(base, expo));
    }
    const result = Math.pow(Math.abs(base), expo);
    const theta = Math.PI * expo;
    let a = 0.0;
    let b = 0.0;
    // this ensures the real part is 0.0 instead of a tiny fraction
    if (expo % 0.5 === 0.0) {
        a = 0.0;
        b = Math.sin(theta);
    }
    else {
        a = Math.cos(theta);
        b = Math.sin(theta);
    }
    return add(double(a * result), multiply(double(b * result), Constants.imaginaryunit));
}
