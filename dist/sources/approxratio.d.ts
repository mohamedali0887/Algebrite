import { U } from '../runtime/defs';
export declare function Eval_approxratio(p1: U): U;
declare type ApproxResult = [string, number, number, number, number];
export declare function approxRadicals(theFloat: number): ApproxResult;
export declare function approxRationalsOfLogs(theFloat: number): ApproxResult;
export declare function approxAll(theFloat: number): ApproxResult;
export declare function testApprox(): void;
export {};
