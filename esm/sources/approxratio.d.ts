import { U } from '../runtime/defs.js';
export declare function Eval_approxratio(p1: U): U;
type ApproxResult = [string, number, number, number, number];
export declare function approxRadicals(theFloat: number): ApproxResult;
export declare function approxRationalsOfLogs(theFloat: number): ApproxResult;
export declare function approxAll(theFloat: number): ApproxResult;
export declare function testApprox(): void;
export {};
