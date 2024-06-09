declare class Asserts {
    is(a: unknown, b: unknown, msg?: string): boolean;
    not(a: unknown, b: unknown, msg?: string): boolean;
}
declare function test<T extends unknown[]>(name: string, f: (t: Asserts, ...args: T) => void, ...args: T): void;
declare namespace test {
    var beforeEach: (hook: () => void) => void;
    var failing: <T extends unknown[]>(name: string, f: (t: Asserts, ...args: T) => void, ...args: T) => void;
}
export { test };
export declare function setup_test(f: () => void): void;
export declare function run_shardable_test(s: string[], prefix?: string): void;
export declare function run_test(s: string[], name?: string): void;
export declare function ava_run(t: any, input: any, expected: any): void;
