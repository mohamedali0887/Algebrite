import { countsize } from './count';
import { car, cdr, iscons, issymbol, istensor, NIL, Str, Sym, SYM } from './defs';
import { stop } from './run';
// The symbol table is a simple array of struct U.
// put symbol at index n
export function Eval_symbolsinfo() {
    const symbolsinfoToBePrinted = symbolsinfo();
    if (symbolsinfoToBePrinted !== '') {
        return new Str(symbolsinfoToBePrinted);
    }
    else {
        return symbol(NIL);
    }
}
function symbolsinfo() {
    return [...userScope.symbolinfo()].join('\n');
}
class Scope {
    constructor(parent) {
        this.parent = parent;
        this.symbols = new Map();
        this.bindings = new Map();
    }
    getOrCreate(name) {
        const existing = this.getExisting(name);
        if (existing)
            return existing;
        const sym = new Sym(name);
        this.symbols.set(name, sym);
        return sym;
    }
    getExisting(name) {
        var _a;
        return ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.getExisting(name)) || this.symbols.get(name);
    }
    mustGet(name) {
        var _a;
        return this.symbols.get(name) || ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.mustGet(name)) || stop(`${name} not defined`);
    }
    has(s) {
        return this.symbols.has(s.printname);
    }
    binding(sym) {
        var _a;
        return this.bindings.get(sym.printname) || ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.binding(sym)) || sym;
    }
    set(sym, value) {
        this.bindings.set(sym.printname, value);
    }
    clear() {
        this.bindings.clear();
    }
    delete(s) {
        var _a;
        this.symbols.delete(s.printname);
        this.bindings.delete(s.printname);
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.delete(s);
    }
    *symbolinfo() {
        if (this.parent) {
            yield* this.parent.symbolinfo();
        }
        for (const [name, sym] of this.symbols.entries()) {
            const binding = this.bindings.get(name) || sym;
            const bindingi = (binding + '').substring(0, 4);
            yield `symbol: ${sym} size: ${countsize(binding)} value: ${bindingi}...`;
        }
    }
    clearRenamedVariablesToAvoidBindingToExternalScope() {
        var _a;
        for (const name of this.symbols.keys()) {
            if (name.indexOf('AVOID_BINDING_TO_EXTERNAL_SCOPE_VALUE') !== -1) {
                this.symbols.delete(name);
            }
        }
        for (const name of this.bindings.keys()) {
            if (name.indexOf('AVOID_BINDING_TO_EXTERNAL_SCOPE_VALUE') !== -1) {
                this.bindings.delete(name);
            }
        }
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.clearRenamedVariablesToAvoidBindingToExternalScope();
    }
}
let keywordScope = new Scope();
let userScope = new Scope(keywordScope);
export function inChildScope(f) {
    let savedScope = userScope;
    try {
        userScope = new Scope(userScope);
        return f();
    }
    finally {
        userScope = savedScope;
    }
}
export function std_symbol(s, keyword) {
    // TODO: can we delete latexPrint?
    const sym = keywordScope.getOrCreate(s);
    sym.latexPrint = s;
    sym.keyword = keyword;
}
// symbol lookup, or symbol creation if symbol doesn't exist yet
// this happens often from the scanner. When the scanner sees something
// like myVar = 2, it create a tree (SETQ ("myVar" symbol as created/looked up here (2)))
// user-defined functions also have a usr symbol.
//
// Note that some symbols like, say, "abs",
// are picked up by the scanner directly as keywords,
// so they are not looked up via this.
// So in fact you could redefine abs to be abs(x) = x
// but still abs would be picked up by the scanner as a particular
// node type and calls to abs() will be always to the "native" abs
//
// Also note that some symbols such as "zero" are (strangely) not picked up by
// the scanner as special nodes, rather they are identified as keywords
// (e.g. not redefinable) at time of symbol lookup (in Eval_sym) and
// evalled, where eval has a case for ZERO.
//
// Also note that there are a number of symbols, such as a,b,c,x,y,z,...
// that are actually created by std_symbols.
// They are not special node types (like abs), they are normal symbols
// that are looked up, but the advantage is that since they are often
// used internally by algebrite, we create the symbol in advance and
// we can reference the symbol entry in a clean way
// (e.g. symbol(SYMBOL_X)) rather than
// by looking up a string.
export function usr_symbol(s) {
    return userScope.getOrCreate(s);
}
// get the symbol's printname
export function get_printname(p) {
    if (p.k !== SYM) {
        stop('symbol error');
    }
    return p.printname;
}
// there are two Us at play here. One belongs to the
// symtab array and is the variable name.
// The other one is the U with the content, and that
// one will go in the corresponding "binding" array entry.
export function set_binding(p, q) {
    if (p.k !== SYM) {
        stop('symbol error');
    }
    userScope.set(p, q);
}
export function get_binding(p) {
    if (p.k !== SYM) {
        stop('symbol error');
    }
    return userScope.binding(p);
}
// the concept of user symbol is a little fuzzy
// beucase mathematics is full of symbols that actually
// have a special meaning, e.g. e,i,I in some cases j...
function is_usr_symbol(p) {
    if (p.k !== SYM) {
        return false;
    }
    return /^[abcdjnrstxyz]_?$/.test(p.printname) || !keywordScope.has(p);
}
// total clearout of symbol table
export function reset_symbols() {
    keywordScope = new Scope();
    userScope = new Scope(keywordScope);
}
export function clear_symbols() {
    userScope = new Scope(keywordScope);
    keywordScope.clear();
}
// collect all the variables in a tree
export function collectUserSymbols(p, accumulator) {
    if (accumulator == null) {
        accumulator = [];
    }
    if (is_usr_symbol(p)) {
        if (accumulator.indexOf(p) === -1) {
            accumulator.push(p);
            return;
        }
    }
    if (istensor(p)) {
        for (let i = 0; i < p.tensor.nelem; i++) {
            collectUserSymbols(p.tensor.elem[i], accumulator);
        }
        return;
    }
    while (iscons(p)) {
        collectUserSymbols(car(p), accumulator);
        p = cdr(p);
    }
}
export function symbol(name) {
    // Should this just in the keywordScope?
    return userScope.mustGet(name);
}
export function iskeyword(p) {
    return issymbol(p) && p.keyword != null;
} // this transformation is done in run.coffee, see there
// for more info.
export function clearRenamedVariablesToAvoidBindingToExternalScope() {
    userScope.clearRenamedVariablesToAvoidBindingToExternalScope();
}
export function clear_symbol(s) {
    userScope.delete(s);
}
