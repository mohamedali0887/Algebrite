import bigInt from 'big-integer';
// Bignum compare
//  returns
//  -1    a < b
//  0    a = b
//  1    a > b
export function mcmp(a, b) {
    return a.compare(b);
}
// a is a bigint, n is a normal int
function mcmpint(a, n) {
    const b = bigInt(n);
    const t = mcmp(a, b);
    return t;
}
