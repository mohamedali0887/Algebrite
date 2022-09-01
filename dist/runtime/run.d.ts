import { U } from './defs';
export declare function stop(s: string): never;
export declare function findDependenciesInScript(stringToBeParsed: string, dontGenerateCode?: boolean): [string, string, string, string, string, string, {
    affectsVariables: string[];
    affectedBy: string[];
}];
export declare function run(stringToBeRun: string, generateLatex?: boolean): string | string[];
export declare function check_stack(): void;
export declare function top_level_eval(expr: U): U;
export declare function check_esc_flag(): void;
export declare function computeDependenciesFromAlgebra(codeFromAlgebraBlock: any): {
    affectsVariables: string[];
    affectedBy: string[];
};
export declare function computeResultsAndJavaScriptFromAlgebra(codeFromAlgebraBlock: any): {
    code: any;
    result: any;
    latexResult: any;
    dependencyInfo: any;
};
