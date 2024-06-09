import { BaseAtom, Double, Num, Tensor, U } from '../runtime/defs.js';
export declare function isZeroAtom(p: U): p is (Num | Double) & {
    isZero: true;
};
export declare function isZeroAtomOrTensor(p: U): p is (Num | Double | Tensor) & {
    isZero: true;
};
export declare function isZeroLikeOrNonZeroLikeOrUndetermined(valueOrPredicate: U): boolean | null;
export declare function isnegativenumber(p: BaseAtom): p is (Num | Double) & {
    __ts_sign: -1;
};
export declare function ispositivenumber(p: BaseAtom): p is (Num | Double) & {
    __ts_sign: 1;
};
export declare function isplustwo(p: BaseAtom): p is (Num | Double) & {
    __ts_sign: 1;
    __ts_integer: true;
    __ts_special: 2;
};
export declare function isplusone(p: BaseAtom): p is (Num | Double) & {
    __ts_sign: 1;
    __ts_integer: true;
    __ts_special: 1;
};
export declare function isminusone(p: BaseAtom): p is (Num | Double) & {
    __ts_sign: -1;
    __ts_integer: true;
    __ts_special: -1;
};
export declare function isone(p: BaseAtom): p is (Num | Double) & {
    __ts_sign: -1 | 1;
    __ts_integer: true;
    __ts_special: 1 | -1;
};
export declare function isinteger(p: BaseAtom): p is Num & {
    __ts_integer: true;
};
export declare function isintegerorintegerfloat(p: BaseAtom): p is (Num | Double) & {
    __ts_integer: true;
};
export declare function isnonnegativeinteger(p: BaseAtom): p is Num & {
    __ts_integer: true;
    __ts_sign: 1;
};
export declare function isposint(p: BaseAtom): p is Num & {
    __ts_integer: true;
    __ts_sign: 1;
};
export declare function isunivarpolyfactoredorexpandedform(p: U, x?: U): U | false;
export declare function ispolyexpandedform(p: U, x: U): boolean;
export declare function isnegativeterm(p: BaseAtom): boolean;
export declare function isimaginarynumber(p: BaseAtom): boolean;
export declare function iscomplexnumberdouble(p: BaseAtom): boolean;
export declare function iscomplexnumber(p: U): boolean;
export declare function iseveninteger(p: U): boolean;
export declare function isnegative(p: U): boolean;
export declare function issymbolic(p: U): boolean;
export declare function isintegerfactor(p: U): boolean;
export declare function isNumberOneOverSomething(p: U): boolean;
export declare function isoneover(p: U): boolean;
export declare function isfraction(p: BaseAtom): p is Num;
export declare function equaln(p: U, n: number): boolean;
export declare function equalq(p: U, a: number, b: number): boolean;
export declare function isoneovertwo(p: BaseAtom): boolean;
export declare function isminusoneovertwo(p: BaseAtom): boolean;
export declare function isoneoversqrttwo(p: BaseAtom): boolean;
export declare function isminusoneoversqrttwo(p: BaseAtom): boolean;
export declare function isSqrtThreeOverTwo(p: BaseAtom): boolean;
export declare function isMinusSqrtThreeOverTwo(p: BaseAtom): boolean;
export declare function isfloating(p: BaseAtom): boolean;
export declare function isimaginaryunit(p: U): boolean;
export declare function isquarterturn(p: U): 0 | 1 | 2 | 3 | 4;
export declare function isnpi(p: U): number;
