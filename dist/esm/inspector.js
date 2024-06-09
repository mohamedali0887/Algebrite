import { DOUBLE, STR, SYM, CONS, TENSOR, NUM, iscons, Cons, Num, Double, Sym, Str, Tensor, issymbol, BaseAtom, } from './runtime/defs.js';
import { length } from './sources/misc.js';
class AtomFormatter {
    header(object) {
        if (!this.isValidAtom(object)) {
            return null;
        }
        return ['span', {}, this.atomTypeNode(object), this.summary(object)];
    }
    hasBody(object) {
        switch (object.k) {
            case DOUBLE:
            case STR:
            case SYM:
                return false;
            case CONS:
            case TENSOR:
            case NUM:
                return true;
        }
    }
    body(x) {
        if (x.k == NUM) {
            return propertyList([
                { name: 'a', value: x.q.a.toString() },
                { name: 'b', value: x.q.b.toString() },
            ]);
        }
        else if (x.k == CONS) {
            const items = iscons(x) ? [...x] : [];
            return propertyList(items);
        }
        else if (x.k == TENSOR) {
            const elems = split_tensor(x, 0, 0)[1];
            return propertyList(elems);
        }
        return null;
    }
    isValidAtom(x) {
        switch (x.constructor) {
            case Cons:
            case Num:
            case Double:
            case Sym:
            case Str:
            case Tensor:
                return true;
        }
        return false;
    }
    atomTypeNode(a) {
        return ['span', { style: 'font-weight: bold' }, this.atomType(a), ' '];
    }
    atomType(a) {
        switch (a.k) {
            case CONS:
                return 'Cons';
            case NUM:
                return 'Num';
            case DOUBLE:
                return 'Double';
            case STR:
                return 'String';
            case TENSOR:
                return 'Tensor';
            case SYM:
                return 'Sym';
        }
    }
    summary(a) {
        switch (a.k) {
            case SYM:
            case NUM:
            case DOUBLE:
            case STR:
                return a.toString();
            case TENSOR:
                const dims = a.tensor.dim.slice(0, a.tensor.ndim);
                return `size = ${dims.join('x')}`;
            case CONS:
                let name = issymbol(a.cons.car) ? `${a.cons.car} ` : '';
                return `${name}length = ${length(a)}`;
        }
    }
}
function isProperty(x) {
    if (x instanceof BaseAtom || Array.isArray(x)) {
        return false;
    }
    return true;
}
function propertyList(items) {
    const ol = [
        'ol',
        {
            style: 'list-style-type:none; padding-left: 0px; margin-top: 0px; margin-bottom: 0px; margin-left: 12px',
        },
    ];
    items.forEach((x, i) => {
        const name = isProperty(x) ? x.name : `${i}`;
        const nameSpan = [
            'span',
            { style: '"color: rgb(136, 19, 145); background-color: #bada55"' },
            `${name}: `,
        ];
        const child = [
            'object',
            { object: isProperty(x) ? x.value : x },
        ];
        ol.push(['li', {}, nameSpan, child]);
    });
    return ol;
}
function split_tensor(p, j, k) {
    // based on print_tensor_inner
    let accumulator = [];
    if (j < p.tensor.ndim - 1) {
        for (let i = 0; i < p.tensor.dim[j]; i++) {
            let result;
            [k, result] = split_tensor(p, j + 1, k);
            accumulator.push(result);
        }
    }
    else {
        for (let i = 0; i < p.tensor.dim[j]; i++) {
            accumulator.push(p.tensor.elem[k]);
            k++;
        }
    }
    return [k, accumulator];
}
globalThis['devtoolsFormatters'] = [new AtomFormatter()];
