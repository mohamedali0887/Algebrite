"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeResultsAndJavaScriptFromAlgebra = exports.computeDependenciesFromAlgebra = exports.check_esc_flag = exports.top_level_eval = exports.check_stack = exports.run = exports.findDependenciesInScript = exports.stop = void 0;
const bake_js_1 = require("../sources/bake.js");
const clear_js_1 = require("../sources/clear.js");
const eval_js_1 = require("../sources/eval.js");
const is_js_1 = require("../sources/is.js");
const print_js_1 = require("../sources/print.js");
const print2d_js_1 = require("../sources/print2d.js");
const scan_js_1 = require("../sources/scan.js");
const simplify_js_1 = require("../sources/simplify.js");
const subst_js_1 = require("../sources/subst.js");
const defs_js_1 = require("./defs.js");
const init_js_1 = require("./init.js");
const symbol_js_1 = require("./symbol.js");
//jmp_buf stop_return, draw_stop_return
// s is a string here
function stop(s) {
    //if (draw_flag == 2)
    //  longjmp(draw_stop_return, 1)
    //else
    defs_js_1.defs.errorMessage += 'Stop: ';
    defs_js_1.defs.errorMessage += s;
    //breakpoint
    const message = defs_js_1.defs.errorMessage;
    defs_js_1.defs.errorMessage = '';
    throw new Error(message);
}
exports.stop = stop;
//longjmp(stop_return, 1)
// Figuring out dependencies is key to automatically
// generating a method signature when generating JS code
// from algebrite scripts.
// This is important because the user can keep using normal Algebrite
// scripting without special notations.
// Basically the process consists of figuring out
// the "ground variables" that are needed to compute each variable.
// Now there are two ways of doing this:
//   * at parse time
//   * after running the scripts
// Doing it at parse time means that we can't track simplifications
// canceling-out some variables for example. But on the other side
// it's very quick and the user can somehow see what the signature is
// going to look like (assuming tha code is rather simple), or anyways
// is going to easily make sense of the generated signature.
// Doing it after execution on the other hand would allow us to see
// if some variable cancel-out. But if variables cancel out then
// they might do so according to some run-time behaviour that the user
// might struggle to keep track of.
// So the effort for the user to make sense of the signature in the first case
// is similar to the effort of keeping tab of types in a typed language.
// While in the second case the effort is similar to running the
// code and simplifications in her head.
//
// If we just want to compute the dependencies, we don't need to do
// anything costly, we don't "run" the code and we don't simplify
// the code. Just finding the plain dependencies
// TODO change the name of this function, as it doesn't just find the
// dependencies. It also runs it and generates the JS code.
function findDependenciesInScript(stringToBeParsed, dontGenerateCode = false) {
    if (defs_js_1.DEBUG) {
        console.log(`stringToBeParsed: ${stringToBeParsed}`);
    }
    const timeStartFromAlgebra = new Date().getTime();
    const inited = true;
    defs_js_1.defs.codeGen = true;
    defs_js_1.defs.symbolsDependencies = {};
    defs_js_1.defs.symbolsHavingReassignments = [];
    defs_js_1.defs.symbolsInExpressionsWithoutAssignments = [];
    defs_js_1.defs.patternHasBeenFound = false;
    let indexOfPartRemainingToBeParsed = 0;
    let allReturnedPlainStrings = '';
    let allReturnedLatexStrings = '';
    let n = 0;
    // we are going to store the dependencies _of the block as a whole_
    // so all affected variables in the whole block are lumped
    // together, and same for the variable that affect those, we
    // lump them all together.
    const dependencyInfo = {
        affectsVariables: [],
        affectedBy: [],
    };
    const stringToBeRun = stringToBeParsed;
    // parse the input. This collects the
    // dependency information
    while (true) {
        try {
            defs_js_1.defs.errorMessage = '';
            check_stack();
            if (defs_js_1.DEBUG) {
                console.log('findDependenciesInScript: scanning');
            }
            [n] = (0, scan_js_1.scan)(stringToBeParsed.substring(indexOfPartRemainingToBeParsed));
            if (defs_js_1.DEBUG) {
                console.log('scanned');
            }
            check_stack();
        }
        catch (error) {
            if (defs_js_1.PRINTOUTRESULT) {
                console.log(error);
            }
            defs_js_1.defs.errorMessage = error + '';
            //breakpoint
            (0, defs_js_1.reset_after_error)();
            break;
        }
        if (n === 0) {
            break;
        }
        indexOfPartRemainingToBeParsed += n;
    }
    let testableString = '';
    // print out all local dependencies as collected by this
    // parsing pass
    if (defs_js_1.DEBUG) {
        console.log('all local dependencies ----------------');
    }
    testableString += 'All local dependencies: ';
    for (let key in defs_js_1.defs.symbolsDependencies) {
        const value = defs_js_1.defs.symbolsDependencies[key];
        if (defs_js_1.DEBUG) {
            console.log(`variable ${key} depends on: `);
        }
        dependencyInfo.affectsVariables.push(key);
        testableString += ' variable ' + key + ' depends on: ';
        for (let i of Array.from(value)) {
            if (defs_js_1.DEBUG) {
                console.log(`    ${i}`);
            }
            if (i[0] !== "'") {
                dependencyInfo.affectedBy.push(i);
            }
            testableString += i + ', ';
        }
        testableString += '; ';
    }
    testableString += '. ';
    // print out the symbols with re-assignments:
    if (defs_js_1.DEBUG) {
        console.log('Symbols with reassignments ----------------');
    }
    testableString += 'Symbols with reassignments: ';
    for (let key of Array.from(defs_js_1.defs.symbolsHavingReassignments)) {
        if (dependencyInfo.affectedBy.indexOf(key) === -1) {
            dependencyInfo.affectedBy.push(key);
            testableString += key + ', ';
        }
    }
    testableString += '. ';
    // print out the symbols that appear in expressions without assignments
    if (defs_js_1.DEBUG) {
        console.log('Symbols in expressions without assignments ----------------');
    }
    testableString += 'Symbols in expressions without assignments: ';
    for (let key of Array.from(defs_js_1.defs.symbolsInExpressionsWithoutAssignments)) {
        if (dependencyInfo.affectedBy.indexOf(key) === -1) {
            dependencyInfo.affectedBy.push(key);
            testableString += key + ', ';
        }
    }
    testableString += '. ';
    // ALL Algebrite code is affected by any pattern changing
    dependencyInfo.affectedBy.push('PATTERN_DEPENDENCY');
    if (defs_js_1.defs.patternHasBeenFound) {
        dependencyInfo.affectsVariables.push('PATTERN_DEPENDENCY');
        testableString += ' - PATTERN_DEPENDENCY inserted - ';
    }
    // print out all global dependencies as collected by this
    // parsing pass
    if (defs_js_1.DEBUG) {
        console.log('All dependencies recursively ----------------');
    }
    testableString += 'All dependencies recursively: ';
    let scriptEvaluation = ['', ''];
    let generatedCode = '';
    let readableSummaryOfGeneratedCode = '';
    if (defs_js_1.defs.errorMessage === '' && !dontGenerateCode) {
        try {
            allReturnedPlainStrings = '';
            allReturnedLatexStrings = '';
            scriptEvaluation = run(stringToBeParsed, true);
            allReturnedPlainStrings = '';
            allReturnedLatexStrings = '';
        }
        catch (error2) {
            const error = error2;
            if (defs_js_1.PRINTOUTRESULT) {
                console.log(error);
            }
            defs_js_1.defs.errorMessage = error.toString();
            // breakpoint
            (0, init_js_1.init)();
        }
        if (defs_js_1.defs.errorMessage === '') {
            for (let key in defs_js_1.defs.symbolsDependencies) {
                defs_js_1.defs.codeGen = true;
                if (defs_js_1.DEBUG) {
                    console.log('  variable ' +
                        key +
                        ' is: ' +
                        (0, symbol_js_1.get_binding)((0, symbol_js_1.usr_symbol)(key)).toString());
                }
                defs_js_1.defs.codeGen = false;
                if (defs_js_1.DEBUG) {
                    console.log(`  variable ${key} depends on: `);
                }
                testableString += ' variable ' + key + ' depends on: ';
                var recursedDependencies = [];
                const variablesWithCycles = [];
                const cyclesDescriptions = [];
                recursiveDependencies(key, recursedDependencies, [], variablesWithCycles, [], cyclesDescriptions);
                for (let i of Array.from(variablesWithCycles)) {
                    if (defs_js_1.DEBUG) {
                        console.log(`    --> cycle through ${i}`);
                    }
                }
                for (let i of Array.from(recursedDependencies)) {
                    if (defs_js_1.DEBUG) {
                        console.log(`    ${i}`);
                    }
                    testableString += i + ', ';
                }
                testableString += '; ';
                for (let i of Array.from(cyclesDescriptions)) {
                    testableString += ' ' + i + ', ';
                }
                if (defs_js_1.DEBUG) {
                    console.log(`  code generation:${key} is: ${(0, symbol_js_1.get_binding)((0, symbol_js_1.usr_symbol)(key))}`);
                }
                // we really want to make an extra effort
                // to generate simplified code, so
                // run a "simplify" on the content of each
                // variable that we are generating code for.
                // Note that the variable
                // will still point to un-simplified structures,
                // we only simplify the generated code.
                let v = (0, symbol_js_1.get_binding)((0, symbol_js_1.usr_symbol)(key));
                // Since we go and simplify all variables we meet,
                // we have to replace each variable passed as a parameter
                // with something entirely new, so that there is no chance
                // that it might evoke previous values in the external scope
                // as in this case:
                //  a = 2
                //  f(a) = a+1+b
                // we don't want 'a' in the body of f to be simplified to 2
                // There are two cases: 1) the variable actually was already in
                // the symbol table, in which case there is going to be this new
                // one prepended with AVOID_BINDING_TO_EXTERNAL_SCOPE_VALUE, and
                // we'll have to remove up this variable later.
                // OR 2) the variable wasn't already in the symbol table, in which
                // case we directly create this one, which means that we'll have
                // to rename it later to the correct name without the prepended
                // part.
                const replacementsFrom = [];
                const replacementsTo = [];
                for (let eachDependency of Array.from(recursedDependencies)) {
                    if (eachDependency[0] === "'") {
                        const deQuotedDep = eachDependency.substring(1);
                        const originalUserSymbol = (0, symbol_js_1.usr_symbol)(deQuotedDep);
                        const newUserSymbol = (0, symbol_js_1.usr_symbol)('AVOID_BINDING_TO_EXTERNAL_SCOPE_VALUE' + deQuotedDep);
                        replacementsFrom.push(originalUserSymbol);
                        replacementsTo.push(newUserSymbol);
                        v = (0, subst_js_1.subst)(v, originalUserSymbol, newUserSymbol);
                        if (defs_js_1.DEBUG) {
                            console.log(`after substitution: ${v}`);
                        }
                    }
                }
                try {
                    v = (0, simplify_js_1.simplifyForCodeGeneration)(v);
                }
                catch (error) {
                    if (defs_js_1.PRINTOUTRESULT) {
                        console.log(error);
                    }
                    defs_js_1.defs.errorMessage = error + '';
                    //breakpoint
                    (0, init_js_1.init)();
                }
                for (let indexOfEachReplacement = 0; indexOfEachReplacement < replacementsFrom.length; indexOfEachReplacement++) {
                    //console.log "replacing back " + replacementsTo[indexOfEachReplacement] + " into: " + replacementsFrom[indexOfEachReplacement]
                    v = (0, subst_js_1.subst)(v, replacementsTo[indexOfEachReplacement], replacementsFrom[indexOfEachReplacement]);
                }
                (0, symbol_js_1.clearRenamedVariablesToAvoidBindingToExternalScope)();
                if (defs_js_1.defs.errorMessage === '') {
                    const toBePrinted = v;
                    // we have to get all the variables used on the right side
                    // here. I.e. to print the arguments it's better to look at the
                    // actual method body after simplification.
                    let userVariablesMentioned = [];
                    (0, symbol_js_1.collectUserSymbols)(toBePrinted, userVariablesMentioned);
                    allReturnedPlainStrings = '';
                    allReturnedLatexStrings = '';
                    defs_js_1.defs.codeGen = true;
                    const generatedBody = toBePrinted.toString();
                    defs_js_1.defs.codeGen = false;
                    const origPrintMode = defs_js_1.defs.printMode;
                    defs_js_1.defs.printMode = defs_js_1.PRINTMODE_LATEX;
                    const bodyForReadableSummaryOfGeneratedCode = toBePrinted.toString();
                    defs_js_1.defs.printMode = origPrintMode;
                    if (variablesWithCycles.indexOf(key) !== -1) {
                        generatedCode +=
                            '// ' +
                                key +
                                ' is part of a cyclic dependency, no code generated.';
                        readableSummaryOfGeneratedCode +=
                            '#' + key + ' is part of a cyclic dependency, no code generated.';
                    }
                    else {
                        /*
                        * using this paragraph instead of the following one
                        * creates methods signatures that
                        * are slightly less efficient
                        * i.e. variables compare even if they are
                        * simplified away.
                        * In theory these signatures are more stable, but
                        * in practice signatures vary quite a bit anyways
                        * depending on previous assignments for example,
                        * so it's unclear whether going for stability
                        * is sensible at all..
                        if recursedDependencies.length != 0
                          parameters = "("
                          for i in recursedDependencies
                            if i.indexOf("'") != 0
                              parameters += i + ", "
                            else
                              if recursedDependencies.indexOf(i.substring(1)) == -1
                                parameters += i.substring(1) + ", "
                        */
                        // remove all native functions from the
                        // parameters as well.
                        userVariablesMentioned = userVariablesMentioned.filter((x) => defs_js_1.predefinedSymbolsInGlobalScope_doNotTrackInDependencies.indexOf(x + '') === -1);
                        // remove the variable that are not in the dependency list
                        // i.e. only allow the variables that are in the dependency list
                        userVariablesMentioned = userVariablesMentioned.filter((x) => recursedDependencies.indexOf(x + '') !== -1 ||
                            recursedDependencies.indexOf("'" + x + '') !== -1);
                        if (userVariablesMentioned.length !== 0) {
                            let parameters = '(';
                            for (let i of Array.from(userVariablesMentioned)) {
                                if (i.printname !== key) {
                                    parameters += i.printname + ', ';
                                }
                            }
                            // eliminate the last ", " for printout clarity
                            parameters = parameters.replace(/, $/gm, '');
                            parameters += ')';
                            generatedCode +=
                                key +
                                    ' = function ' +
                                    parameters +
                                    ' { return ( ' +
                                    generatedBody +
                                    ' ); }';
                            readableSummaryOfGeneratedCode +=
                                key +
                                    parameters +
                                    ' = ' +
                                    bodyForReadableSummaryOfGeneratedCode;
                        }
                        else {
                            generatedCode += key + ' = ' + generatedBody + ';';
                            readableSummaryOfGeneratedCode +=
                                key + ' = ' + bodyForReadableSummaryOfGeneratedCode;
                        }
                    }
                    generatedCode += '\n';
                    readableSummaryOfGeneratedCode += '\n';
                    if (defs_js_1.DEBUG) {
                        console.log(`    ${generatedCode}`);
                    }
                }
            }
        }
    }
    // eliminate the last new line
    generatedCode = generatedCode.replace(/\n$/gm, '');
    readableSummaryOfGeneratedCode = readableSummaryOfGeneratedCode.replace(/\n$/gm, '');
    // cleanup
    defs_js_1.defs.symbolsDependencies = {};
    defs_js_1.defs.symbolsHavingReassignments = [];
    defs_js_1.defs.patternHasBeenFound = false;
    defs_js_1.defs.symbolsInExpressionsWithoutAssignments = [];
    if (defs_js_1.DEBUG) {
        console.log(`testable string: ${testableString}`);
    }
    if (TIMING_DEBUGS) {
        console.log(`findDependenciesInScript time for: ${stringToBeRun} : ${new Date().getTime() - timeStartFromAlgebra}ms`);
    }
    return [
        testableString,
        scriptEvaluation[0],
        generatedCode,
        readableSummaryOfGeneratedCode,
        scriptEvaluation[1],
        defs_js_1.defs.errorMessage,
        dependencyInfo,
    ];
}
exports.findDependenciesInScript = findDependenciesInScript;
function recursiveDependencies(variableToBeChecked, arrayWhereDependenciesWillBeAdded, variablesAlreadyFleshedOut, variablesWithCycles, chainBeingChecked, cyclesDescriptions) {
    variablesAlreadyFleshedOut.push(variableToBeChecked);
    // recursive dependencies can only be descended if the variable is not bound to a parameter
    if (defs_js_1.defs.symbolsDependencies[chainBeingChecked[chainBeingChecked.length - 1]] !=
        null) {
        if (defs_js_1.defs.symbolsDependencies[chainBeingChecked[chainBeingChecked.length - 1]].indexOf("'" + variableToBeChecked) !== -1) {
            if (defs_js_1.DEBUG) {
                console.log("can't keep following the chain of " +
                    variableToBeChecked +
                    " because it's actually a variable bound to a parameter");
            }
            if (arrayWhereDependenciesWillBeAdded.indexOf("'" + variableToBeChecked) ===
                -1 &&
                arrayWhereDependenciesWillBeAdded.indexOf(variableToBeChecked) === -1) {
                arrayWhereDependenciesWillBeAdded.push(variableToBeChecked);
            }
            arrayWhereDependenciesWillBeAdded;
            return;
        }
    }
    chainBeingChecked.push(variableToBeChecked);
    if (defs_js_1.defs.symbolsDependencies[variableToBeChecked] == null) {
        // end case: the passed variable has no dependencies
        // so there is nothing else to do
        if (arrayWhereDependenciesWillBeAdded.indexOf(variableToBeChecked) === -1) {
            arrayWhereDependenciesWillBeAdded.push(variableToBeChecked);
        }
        arrayWhereDependenciesWillBeAdded;
    }
    else {
        // recursion case: we have to dig deeper
        for (let i of Array.from(defs_js_1.defs.symbolsDependencies[variableToBeChecked])) {
            // check that there is no recursion in dependencies
            // we do that by keeping a list of variables that
            // have already been "fleshed-out". If we encounter
            // any of those "fleshed-out" variables while
            // fleshing out, then there is a cycle
            if (chainBeingChecked.indexOf(i) !== -1) {
                if (defs_js_1.DEBUG) {
                    console.log('  found cycle:');
                }
                let cyclesDescription = '';
                for (let k of Array.from(chainBeingChecked)) {
                    if (variablesWithCycles.indexOf(k) === -1) {
                        variablesWithCycles.push(k);
                    }
                    if (defs_js_1.DEBUG) {
                        console.log(k + ' --> ');
                    }
                    cyclesDescription += k + ' --> ';
                }
                if (defs_js_1.DEBUG) {
                    console.log(` ... then ${i} again`);
                }
                cyclesDescription += ' ... then ' + i + ' again';
                cyclesDescriptions.push(cyclesDescription);
                //if DEBUG then console.log "    --> cycle through " + i
                // we want to flesh-out i but it's already been
                // fleshed-out, just add it to the variables
                // with cycles and move on
                // todo refactor this, there are two copies of these two lines
                if (variablesWithCycles.indexOf(i) === -1) {
                    variablesWithCycles.push(i);
                }
            }
            else {
                // flesh-out i recursively
                recursiveDependencies(i, arrayWhereDependenciesWillBeAdded, variablesAlreadyFleshedOut, variablesWithCycles, chainBeingChecked, cyclesDescriptions);
                chainBeingChecked.pop();
            }
        }
        //variablesAlreadyFleshedOut.pop()
        arrayWhereDependenciesWillBeAdded;
    }
}
const latexErrorSign = '\\rlap{\\large\\color{red}\\bigtriangleup}{\\ \\ \\tiny\\color{red}!}';
function turnErrorMessageToLatex(theErrorMessage) {
    theErrorMessage = theErrorMessage.replace(/\n/g, '');
    theErrorMessage = theErrorMessage.replace(/_/g, '} \\_ \\text{');
    theErrorMessage = theErrorMessage.replace(new RegExp(String.fromCharCode(defs_js_1.transpose_unicode), 'g'), '}{}^{T}\\text{');
    theErrorMessage = theErrorMessage.replace(new RegExp(String.fromCharCode(defs_js_1.dotprod_unicode), 'g'), '}\\cdot \\text{');
    theErrorMessage = theErrorMessage.replace('Stop:', '}  \\quad \\text{Stop:');
    theErrorMessage = theErrorMessage.replace('->', '}  \\rightarrow \\text{');
    theErrorMessage = theErrorMessage.replace('?', '}\\enspace ' + latexErrorSign + ' \\enspace  \\text{');
    theErrorMessage = '$$\\text{' + theErrorMessage.replace(/\n/g, '') + '}$$';
    //console.log "theErrorMessage: " + theErrorMessage
    return theErrorMessage;
}
// there are around a dozen different unicodes that
// represent some sort of middle dot, let's catch the most
// common and turn them into what we can process
function normaliseDots(stringToNormalise) {
    stringToNormalise = stringToNormalise.replace(new RegExp(String.fromCharCode(8901), 'g'), String.fromCharCode(defs_js_1.dotprod_unicode));
    stringToNormalise = stringToNormalise.replace(new RegExp(String.fromCharCode(8226), 'g'), String.fromCharCode(defs_js_1.dotprod_unicode));
    stringToNormalise = stringToNormalise.replace(new RegExp(String.fromCharCode(12539), 'g'), String.fromCharCode(defs_js_1.dotprod_unicode));
    stringToNormalise = stringToNormalise.replace(new RegExp(String.fromCharCode(55296), 'g'), String.fromCharCode(defs_js_1.dotprod_unicode));
    stringToNormalise = stringToNormalise.replace(new RegExp(String.fromCharCode(65381), 'g'), String.fromCharCode(defs_js_1.dotprod_unicode));
    return stringToNormalise;
}
var TIMING_DEBUGS = false;
function run(stringToBeRun, generateLatex = false) {
    let p1, p2;
    let stringToBeReturned;
    const timeStart = new Date().getTime();
    //stringToBeRun = stringToBeRun + "\n"
    stringToBeRun = normaliseDots(stringToBeRun);
    //console.log "run running: " + stringToBeRun
    // if (stringToBeRun === "selftest") {
    //   selftest();
    //   return;
    // }
    //if (setjmp(stop_return))
    //  return
    if (!defs_js_1.defs.inited) {
        defs_js_1.defs.inited = true;
        (0, init_js_1.init)();
    }
    let n = 0;
    let indexOfPartRemainingToBeParsed = 0;
    let allReturnedPlainStrings = '';
    let allReturnedLatexStrings = '';
    let collectedLatexResult;
    let collectedPlainResult;
    while (true) {
        // while we can keep scanning commands out of the
        // passed input AND we can execute them...
        try {
            defs_js_1.defs.errorMessage = '';
            check_stack();
            [n, p1] = (0, scan_js_1.scan)(stringToBeRun.substring(indexOfPartRemainingToBeParsed));
            check_stack();
        }
        catch (error) {
            if (defs_js_1.PRINTOUTRESULT) {
                console.log(error);
            }
            //breakpoint
            allReturnedPlainStrings += error.message;
            if (generateLatex) {
                //breakpoint
                const theErrorMessage = turnErrorMessageToLatex(error.message);
                allReturnedLatexStrings += theErrorMessage;
            }
            (0, defs_js_1.reset_after_error)();
            break;
        }
        if (n === 0) {
            break;
        }
        // if debug mode then print the source text
        //if (equaln(get_binding(symbol(TRACE)), 1)) {
        //  for (i = 0 i < n i++)
        //    if (s[i] != '\r')
        //      printchar(s[i])
        //  if (s[n - 1] != '\n') # n is not zero, see above
        //    printchar('\n')
        //}
        indexOfPartRemainingToBeParsed += n;
        let errorWhileExecution = false;
        try {
            defs_js_1.defs.stringsEmittedByUserPrintouts = '';
            p2 = top_level_eval(p1);
            //console.log "emitted string after top_level_eval(): >" + stringsEmittedByUserPrintouts + "<"
            //console.log "allReturnedPlainStrings string after top_level_eval(): >" + allReturnedPlainStrings + "<"
            check_stack();
            if ((0, defs_js_1.isstr)(p2)) {
                if (defs_js_1.DEBUG) {
                    console.log(p2.str);
                }
                if (defs_js_1.DEBUG) {
                    console.log('\n');
                }
            }
            // if the return value is nil there isn't much point
            // in adding "nil" to the printout
            if (p2 === (0, symbol_js_1.symbol)(defs_js_1.NIL)) {
                //collectedPlainResult = stringsEmittedByUserPrintouts
                collectedPlainResult = defs_js_1.defs.stringsEmittedByUserPrintouts;
                if (generateLatex) {
                    collectedLatexResult =
                        '$$' + defs_js_1.defs.stringsEmittedByUserPrintouts + '$$';
                }
            }
            else {
                //console.log "emitted string before collectPlainStringFromReturnValue: >" + stringsEmittedByUserPrintouts + "<"
                //console.log "allReturnedPlainStrings string before collectPlainStringFromReturnValue: >" + allReturnedPlainStrings + "<"
                collectedPlainResult = (0, print_js_1.print_expr)(p2);
                collectedPlainResult += '\n';
                //console.log "collectedPlainResult: >" + collectedPlainResult + "<"
                if (generateLatex) {
                    collectedLatexResult =
                        '$$' + (0, print_js_1.collectLatexStringFromReturnValue)(p2) + '$$';
                    if (defs_js_1.DEBUG) {
                        console.log(`collectedLatexResult: ${collectedLatexResult}`);
                    }
                }
            }
            allReturnedPlainStrings += collectedPlainResult;
            if (generateLatex) {
                allReturnedLatexStrings += collectedLatexResult;
            }
            if (defs_js_1.PRINTOUTRESULT) {
                if (defs_js_1.DEBUG) {
                    console.log('printline');
                }
                if (defs_js_1.DEBUG) {
                    console.log(collectedPlainResult);
                }
            }
            //alert collectedPlainResult
            if (defs_js_1.PRINTOUTRESULT) {
                if (defs_js_1.DEBUG) {
                    console.log('display:');
                }
                (0, print2d_js_1.print2dascii)(p2);
            }
            if (generateLatex) {
                allReturnedLatexStrings += '\n';
            }
        }
        catch (error) {
            errorWhileExecution = true;
            collectedPlainResult = error.message;
            if (generateLatex) {
                collectedLatexResult = turnErrorMessageToLatex(error.message);
            }
            if (defs_js_1.PRINTOUTRESULT) {
                console.log(collectedPlainResult);
            }
            allReturnedPlainStrings += collectedPlainResult;
            if (collectedPlainResult !== '') {
                allReturnedPlainStrings += '\n';
            }
            if (generateLatex) {
                allReturnedLatexStrings += collectedLatexResult;
                allReturnedLatexStrings += '\n';
            }
            (0, init_js_1.init)();
        }
    }
    if (allReturnedPlainStrings[allReturnedPlainStrings.length - 1] === '\n') {
        allReturnedPlainStrings = allReturnedPlainStrings.substring(0, allReturnedPlainStrings.length - 1);
    }
    if (generateLatex) {
        if (allReturnedLatexStrings[allReturnedLatexStrings.length - 1] === '\n') {
            allReturnedLatexStrings = allReturnedLatexStrings.substring(0, allReturnedLatexStrings.length - 1);
        }
    }
    if (generateLatex) {
        if (defs_js_1.DEBUG) {
            console.log(`allReturnedLatexStrings: ${allReturnedLatexStrings}`);
        }
        stringToBeReturned = [allReturnedPlainStrings, allReturnedLatexStrings];
    }
    else {
        stringToBeReturned = allReturnedPlainStrings;
    }
    if (TIMING_DEBUGS) {
        const timingDebugWrite = 'run time on: ' +
            stringToBeRun +
            ' : ' +
            (new Date().getTime() - timeStart) +
            'ms';
        console.log(timingDebugWrite);
    }
    allReturnedPlainStrings = '';
    allReturnedLatexStrings = '';
    return stringToBeReturned;
}
exports.run = run;
function check_stack() {
    if (defs_js_1.defs.chainOfUserSymbolsNotFunctionsBeingEvaluated.length !== 0) {
        defs_js_1.breakpoint;
        stop('symbols evaluation still ongoing?');
    }
    if (defs_js_1.defs.evaluatingAsFloats) {
        defs_js_1.breakpoint;
        stop('numeric evaluation still ongoing?');
    }
    if (defs_js_1.defs.evaluatingPolar) {
        defs_js_1.breakpoint;
        stop('evaluation of polar still ongoing?');
    }
}
exports.check_stack = check_stack;
// cannot reference symbols yet
// returns nil if no result to print
function top_level_eval(expr) {
    if (defs_js_1.DEBUG) {
        console.log('#### top level eval');
    }
    defs_js_1.defs.trigmode = 0;
    const shouldAutoexpand = (0, symbol_js_1.symbol)(defs_js_1.AUTOEXPAND);
    defs_js_1.defs.expanding = !(0, is_js_1.isZeroAtomOrTensor)((0, symbol_js_1.get_binding)(shouldAutoexpand));
    const originalArgument = expr;
    let evalledArgument = (0, eval_js_1.Eval)(expr);
    // "draw", "for" and "setq" return "nil", there is no result to print
    if (evalledArgument === (0, symbol_js_1.symbol)(defs_js_1.NIL)) {
        return evalledArgument;
    }
    // update "last" to contain the last result
    (0, symbol_js_1.set_binding)((0, symbol_js_1.symbol)(defs_js_1.LAST), evalledArgument);
    if (!(0, is_js_1.isZeroAtomOrTensor)((0, symbol_js_1.get_binding)((0, symbol_js_1.symbol)(defs_js_1.BAKE)))) {
        const baked = (0, bake_js_1.bake)(evalledArgument);
        evalledArgument = baked;
    }
    // If user asked explicitly asked to evaluate "i" or "j" and
    // they represent the imaginary unit (-1)^(1/2), then
    // show (-1)^(1/2).
    if ((originalArgument === (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_I) ||
        originalArgument === (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_J)) &&
        (0, is_js_1.isimaginaryunit)(evalledArgument)) {
        return evalledArgument;
        // In all other cases, replace all instances of (-1)^(1/2) in the result
        // with the symbol "i" or "j" depending on which one
        // represents the imaginary unit
    }
    else if ((0, is_js_1.isimaginaryunit)((0, symbol_js_1.get_binding)((0, symbol_js_1.symbol)(defs_js_1.SYMBOL_J)))) {
        return (0, subst_js_1.subst)(evalledArgument, defs_js_1.Constants.imaginaryunit, (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_J));
    }
    else if ((0, is_js_1.isimaginaryunit)((0, symbol_js_1.get_binding)((0, symbol_js_1.symbol)(defs_js_1.SYMBOL_I)))) {
        return (0, subst_js_1.subst)(evalledArgument, defs_js_1.Constants.imaginaryunit, (0, symbol_js_1.symbol)(defs_js_1.SYMBOL_I));
    }
    return evalledArgument;
}
exports.top_level_eval = top_level_eval;
function check_esc_flag() {
    if (defs_js_1.defs.esc_flag) {
        stop('esc key');
    }
}
exports.check_esc_flag = check_esc_flag;
// this is called when the whole notebook is re-run
// so we get the chance of clearing the whole state from
// scratch.
// In practice, the state we need to clear that persists
// across blocks are only the patterns, so
// just eject those.
function clearAlgebraEnvironment() {
    let p1, p6;
    let do_clearallResult;
    do_clearallResult = (0, clear_js_1.do_clearall)();
    //console.log "CLEARING clearAlgebraEnvironment ============================================================="
    return do_clearallResult;
}
function computeDependenciesFromAlgebra(codeFromAlgebraBlock) {
    let p1, p6;
    if (defs_js_1.DEBUG) {
        console.log('computeDependenciesFromAlgebra!!!');
    }
    // return findDependenciesInScript(codeFromAlgebraBlock, true)[6]
    // TODO this part below is duplicated from computeResultsAndJavaScriptFromAlgebra
    //      ...should refactor.
    const originalcodeFromAlgebraBlock = codeFromAlgebraBlock;
    const keepState = true;
    defs_js_1.defs.called_from_Algebra_block = true;
    //console.log "codeFromAlgebraBlock: " + codeFromAlgebraBlock
    codeFromAlgebraBlock = normaliseDots(codeFromAlgebraBlock);
    if (!keepState) {
        defs_js_1.defs.userSimplificationsInListForm = [];
        let userSimplificationsInProgramForm = '';
        for (const i of Array.from(defs_js_1.defs.userSimplificationsInListForm)) {
            //console.log "silentpattern(" + car(i) + ","+cdr(i)+")"
            userSimplificationsInProgramForm +=
                'silentpattern(' +
                    (0, defs_js_1.car)(i) +
                    ',' +
                    (0, defs_js_1.car)((0, defs_js_1.cdr)(i)) +
                    ',' +
                    (0, defs_js_1.car)((0, defs_js_1.cdr)((0, defs_js_1.cdr)(i))) +
                    ')\n';
        }
        (0, clear_js_1.do_clearall)();
        codeFromAlgebraBlock =
            userSimplificationsInProgramForm + codeFromAlgebraBlock;
        if (defs_js_1.DEBUG) {
            console.log('codeFromAlgebraBlock including patterns: ' + codeFromAlgebraBlock);
        }
    }
    if (defs_js_1.DEBUG) {
        console.log('computeDependenciesFromAlgebra: patterns in the list --------------- ');
        for (const i of Array.from(defs_js_1.defs.userSimplificationsInListForm)) {
            console.log((0, defs_js_1.car)(i) + ',' + (0, defs_js_1.cdr)(i) + ')');
        }
        console.log('...end of list --------------- ');
    }
    defs_js_1.defs.called_from_Algebra_block = false;
    return findDependenciesInScript(codeFromAlgebraBlock, true)[6];
}
exports.computeDependenciesFromAlgebra = computeDependenciesFromAlgebra;
function computeResultsAndJavaScriptFromAlgebra(codeFromAlgebraBlock) {
    let p1, p6;
    let code, dependencyInfo, i, latexResult, readableSummaryOfCode, result, testableStringIsIgnoredHere;
    const originalcodeFromAlgebraBlock = codeFromAlgebraBlock;
    const keepState = true;
    defs_js_1.defs.called_from_Algebra_block = true;
    const timeStartFromAlgebra = new Date().getTime();
    if (TIMING_DEBUGS) {
        console.log(' --------- computeResultsAndJavaScriptFromAlgebra input: ' +
            codeFromAlgebraBlock +
            ' at: ' +
            new Date());
    }
    // we start "clean" each time:
    // clear all the symbols and then re-define
    // the "starting" symbols.
    //console.log "codeFromAlgebraBlock: " + codeFromAlgebraBlock
    codeFromAlgebraBlock = normaliseDots(codeFromAlgebraBlock);
    const stringToBeRun = codeFromAlgebraBlock;
    if (defs_js_1.DEBUG) {
        console.log('computeResultsAndJavaScriptFromAlgebra: patterns in the list --------------- ');
        for (i of Array.from(defs_js_1.defs.userSimplificationsInListForm)) {
            console.log((0, defs_js_1.car)(i) + ',' + (0, defs_js_1.cdr)(i) + ')');
        }
        console.log('...end of list --------------- ');
    }
    if (!keepState) {
        defs_js_1.defs.userSimplificationsInListForm = [];
        let userSimplificationsInProgramForm = '';
        for (i of Array.from(defs_js_1.defs.userSimplificationsInListForm)) {
            //console.log "silentpattern(" + car(i) + ","+cdr(i)+")"
            userSimplificationsInProgramForm +=
                'silentpattern(' +
                    (0, defs_js_1.car)(i) +
                    ',' +
                    (0, defs_js_1.car)((0, defs_js_1.cdr)(i)) +
                    ',' +
                    (0, defs_js_1.car)((0, defs_js_1.cdr)((0, defs_js_1.cdr)(i))) +
                    ')\n';
        }
        (0, clear_js_1.do_clearall)();
        codeFromAlgebraBlock =
            userSimplificationsInProgramForm + codeFromAlgebraBlock;
        if (defs_js_1.DEBUG) {
            console.log('codeFromAlgebraBlock including patterns: ' + codeFromAlgebraBlock);
        }
    }
    //breakpoint
    [
        testableStringIsIgnoredHere,
        result,
        code,
        readableSummaryOfCode,
        latexResult,
        defs_js_1.defs.errorMessage,
        dependencyInfo,
    ] = findDependenciesInScript(codeFromAlgebraBlock);
    defs_js_1.defs.called_from_Algebra_block = false;
    if (readableSummaryOfCode !== '' || defs_js_1.defs.errorMessage !== '') {
        result += '\n' + readableSummaryOfCode;
        if (defs_js_1.defs.errorMessage !== '') {
            result += '\n' + defs_js_1.defs.errorMessage;
        }
        result = result.replace(/\n/g, '\n\n');
        latexResult += '\n$$' + readableSummaryOfCode + '$$';
        if (defs_js_1.defs.errorMessage !== '') {
            latexResult += turnErrorMessageToLatex(defs_js_1.defs.errorMessage);
        }
        latexResult = latexResult.replace(/\n/g, '\n\n');
    }
    // remove empty results altogether from latex output, which happens
    // for example for assignments to variables or
    // functions definitions
    latexResult = latexResult.replace(/\n*/, '');
    latexResult = latexResult.replace(/\$\$\$\$\n*/g, '');
    code = code.replace(/Math\./g, '');
    code = code.replace(/\n/g, '\n\n');
    //console.log "code: " + code
    //console.log "result: " + result
    //console.log "latexResult: " + latexResult
    if (TIMING_DEBUGS) {
        console.log('computeResultsAndJavaScriptFromAlgebra time (total time from notebook and back) for: ' +
            stringToBeRun +
            ' : ' +
            (new Date().getTime() - timeStartFromAlgebra) +
            'ms');
    }
    //code: "// no code generated yet\n//try again later"
    //code: "console.log('some passed code is run'); window.something = 1;"
    return {
        code,
        // TODO temporarily pass latex in place of standard result too
        result: latexResult,
        latexResult,
        dependencyInfo,
    };
}
exports.computeResultsAndJavaScriptFromAlgebra = computeResultsAndJavaScriptFromAlgebra;
