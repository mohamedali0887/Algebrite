"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.derivative = exports.Eval_derivative = void 0;
const defs_js_1 = require("../runtime/defs.js");
const find_js_1 = require("../runtime/find.js");
const run_js_1 = require("../runtime/run.js");
const symbol_js_1 = require("../runtime/symbol.js");
const misc_js_1 = require("../sources/misc.js");
const add_js_1 = require("./add.js");
const besselj_js_1 = require("./besselj.js");
const bessely_js_1 = require("./bessely.js");
const bignum_js_1 = require("./bignum.js");
const cos_js_1 = require("./cos.js");
const cosh_js_1 = require("./cosh.js");
const dirac_js_1 = require("./dirac.js");
const eval_js_1 = require("./eval.js");
const guess_js_1 = require("./guess.js");
const hermite_js_1 = require("./hermite.js");
const integral_js_1 = require("./integral.js");
const is_js_1 = require("./is.js");
const list_js_1 = require("./list.js");
const log_js_1 = require("./log.js");
const multiply_js_1 = require("./multiply.js");
const power_js_1 = require("./power.js");
const sgn_js_1 = require("./sgn.js");
const simplify_js_1 = require("./simplify.js");
const sin_js_1 = require("./sin.js");
const sinh_js_1 = require("./sinh.js");
const subst_js_1 = require("./subst.js");
const tensor_js_1 = require("./tensor.js");
// derivative
//define F p3
//define X p4
//define N p5
function Eval_derivative(p1) {
    // evaluate 1st arg to get function F
    p1 = (0, defs_js_1.cdr)(p1);
    let F = (0, eval_js_1.Eval)((0, defs_js_1.car)(p1));
    // evaluate 2nd arg and then...
    // example  result of 2nd arg  what to do
    //
    // d(f)    nil      guess X, N = nil
    // d(f,2)  2      guess X, N = 2
    // d(f,x)  x      X = x, N = nil
    // d(f,x,2)  x      X = x, N = 2
    // d(f,x,y)  x      X = x, N = y
    p1 = (0, defs_js_1.cdr)(p1);
    let X, N;
    const p2 = (0, eval_js_1.Eval)((0, defs_js_1.car)(p1));
    if (p2 === (0, symbol_js_1.symbol)(defs_js_1.NIL)) {
        X = (0, guess_js_1.guess)(F);
        N = (0, symbol_js_1.symbol)(defs_js_1.NIL);
    }
    else if ((0, defs_js_1.isNumericAtom)(p2)) {
        X = (0, guess_js_1.guess)(F);
        N = p2;
    }
    else {
        X = p2;
        p1 = (0, defs_js_1.cdr)(p1);
        N = (0, eval_js_1.Eval)((0, defs_js_1.car)(p1));
    }
    while (true) {
        // p5 (N) might be a symbol instead of a number
        let n;
        if ((0, defs_js_1.isNumericAtom)(N)) {
            n = (0, bignum_js_1.nativeInt)(N);
            if (isNaN(n)) {
                (0, run_js_1.stop)('nth derivative: check n');
            }
        }
        else {
            n = 1;
        }
        let temp = F;
        if (n >= 0) {
            for (let i = 0; i < n; i++) {
                temp = derivative(temp, X);
            }
        }
        else {
            n = -n;
            for (let i = 0; i < n; i++) {
                temp = (0, integral_js_1.integral)(temp, X);
            }
        }
        F = temp;
        // if p5 (N) is nil then arglist is exhausted
        if (N === (0, symbol_js_1.symbol)(defs_js_1.NIL)) {
            break;
        }
        // otherwise...
        // N    arg1    what to do
        //
        // number  nil    break
        // number  number    N = arg1, continue
        // number  symbol    X = arg1, N = arg2, continue
        //
        // symbol  nil    X = N, N = nil, continue
        // symbol  number    X = N, N = arg1, continue
        // symbol  symbol    X = N, N = arg1, continue
        if ((0, defs_js_1.isNumericAtom)(N)) {
            p1 = (0, defs_js_1.cdr)(p1);
            N = (0, eval_js_1.Eval)((0, defs_js_1.car)(p1));
            if (N === (0, symbol_js_1.symbol)(defs_js_1.NIL)) {
                break; // arglist exhausted
            }
            if (!(0, defs_js_1.isNumericAtom)(N)) {
                X = N;
                p1 = (0, defs_js_1.cdr)(p1);
                N = (0, eval_js_1.Eval)((0, defs_js_1.car)(p1));
            }
        }
        else {
            X = N;
            p1 = (0, defs_js_1.cdr)(p1);
            N = (0, eval_js_1.Eval)((0, defs_js_1.car)(p1));
        }
    }
    return F; // final result
}
exports.Eval_derivative = Eval_derivative;
function derivative(p1, p2) {
    if ((0, defs_js_1.isNumericAtom)(p2)) {
        (0, run_js_1.stop)('undefined function');
    }
    if ((0, defs_js_1.istensor)(p1)) {
        if ((0, defs_js_1.istensor)(p2)) {
            return (0, tensor_js_1.d_tensor_tensor)(p1, p2);
        }
        else {
            return (0, tensor_js_1.d_tensor_scalar)(p1, p2);
        }
    }
    else {
        if ((0, defs_js_1.istensor)(p2)) {
            return (0, tensor_js_1.d_scalar_tensor)(p1, p2);
        }
        else {
            return d_scalar_scalar(p1, p2);
        }
    }
}
exports.derivative = derivative;
function d_scalar_scalar(p1, p2) {
    if ((0, defs_js_1.issymbol)(p2)) {
        return d_scalar_scalar_1(p1, p2);
    }
    // Example: d(sin(cos(x)),cos(x))
    // Replace cos(x) <- X, find derivative, then do X <- cos(x)
    const arg1 = (0, subst_js_1.subst)(p1, p2, (0, symbol_js_1.symbol)(defs_js_1.SECRETX)); // p1: sin(cos(x)), p2: cos(x), symbol(SECRETX): X => sin(cos(x)) -> sin(X)
    return (0, subst_js_1.subst)(derivative(arg1, (0, symbol_js_1.symbol)(defs_js_1.SECRETX)), (0, symbol_js_1.symbol)(defs_js_1.SECRETX), p2); // p2:  cos(x)  =>  cos(X) -> cos(cos(x))
}
function d_scalar_scalar_1(p1, p2) {
    // d(x,x)?
    if ((0, misc_js_1.equal)(p1, p2)) {
        return defs_js_1.Constants.one;
    }
    // d(a,x)?
    if (!(0, defs_js_1.iscons)(p1)) {
        return defs_js_1.Constants.zero;
    }
    if ((0, defs_js_1.isadd)(p1)) {
        return dsum(p1, p2);
    }
    switch ((0, defs_js_1.car)(p1)) {
        case (0, symbol_js_1.symbol)(defs_js_1.MULTIPLY):
            return dproduct(p1, p2);
        case (0, symbol_js_1.symbol)(defs_js_1.POWER):
            return dpower(p1, p2);
        case (0, symbol_js_1.symbol)(defs_js_1.DERIVATIVE):
            return dd(p1, p2);
        case (0, symbol_js_1.symbol)(defs_js_1.LOG):
            return dlog(p1, p2);
        case (0, symbol_js_1.symbol)(defs_js_1.SIN):
            return dsin(p1, p2);
        case (0, symbol_js_1.symbol)(defs_js_1.COS):
            return dcos(p1, p2);
        case (0, symbol_js_1.symbol)(defs_js_1.TAN):
            return dtan(p1, p2);
        case (0, symbol_js_1.symbol)(defs_js_1.ARCSIN):
            return darcsin(p1, p2);
        case (0, symbol_js_1.symbol)(defs_js_1.ARCCOS):
            return darccos(p1, p2);
        case (0, symbol_js_1.symbol)(defs_js_1.ARCTAN):
            return darctan(p1, p2);
        case (0, symbol_js_1.symbol)(defs_js_1.SINH):
            return dsinh(p1, p2);
        case (0, symbol_js_1.symbol)(defs_js_1.COSH):
            return dcosh(p1, p2);
        case (0, symbol_js_1.symbol)(defs_js_1.TANH):
            return dtanh(p1, p2);
        case (0, symbol_js_1.symbol)(defs_js_1.ARCSINH):
            return darcsinh(p1, p2);
        case (0, symbol_js_1.symbol)(defs_js_1.ARCCOSH):
            return darccosh(p1, p2);
        case (0, symbol_js_1.symbol)(defs_js_1.ARCTANH):
            return darctanh(p1, p2);
        case (0, symbol_js_1.symbol)(defs_js_1.ABS):
            return dabs(p1, p2);
        case (0, symbol_js_1.symbol)(defs_js_1.SGN):
            return dsgn(p1, p2);
        case (0, symbol_js_1.symbol)(defs_js_1.HERMITE):
            return dhermite(p1, p2);
        case (0, symbol_js_1.symbol)(defs_js_1.ERF):
            return derf(p1, p2);
        case (0, symbol_js_1.symbol)(defs_js_1.ERFC):
            return derfc(p1, p2);
        case (0, symbol_js_1.symbol)(defs_js_1.BESSELJ):
            return dbesselj(p1, p2);
        case (0, symbol_js_1.symbol)(defs_js_1.BESSELY):
            return dbessely(p1, p2);
        default:
        // pass through
    }
    if ((0, defs_js_1.car)(p1) === (0, symbol_js_1.symbol)(defs_js_1.INTEGRAL) && (0, defs_js_1.caddr)(p1) === p2) {
        return derivative_of_integral(p1);
    }
    return dfunction(p1, p2);
}
function dsum(p1, p2) {
    const toAdd = (0, defs_js_1.iscons)(p1) ? p1.tail().map((el) => derivative(el, p2)) : [];
    return (0, add_js_1.add_all)(toAdd);
}
function dproduct(p1, p2) {
    const n = (0, misc_js_1.length)(p1) - 1;
    const toAdd = [];
    for (let i = 0; i < n; i++) {
        const arr = [];
        let p3 = (0, defs_js_1.cdr)(p1);
        for (let j = 0; j < n; j++) {
            let temp = (0, defs_js_1.car)(p3);
            if (i === j) {
                temp = derivative(temp, p2);
            }
            arr.push(temp);
            p3 = (0, defs_js_1.cdr)(p3);
        }
        toAdd.push((0, multiply_js_1.multiply_all)(arr));
    }
    return (0, add_js_1.add_all)(toAdd);
}
//-----------------------------------------------------------------------------
//
//       v
//  y = u
//
//  log y = v log u
//
//  1 dy   v du           dv
//  - -- = - -- + (log u) --
//  y dx   u dx           dx
//
//  dy    v  v du           dv
//  -- = u  (- -- + (log u) --)
//  dx       u dx           dx
//
//-----------------------------------------------------------------------------
function dpower(p1, p2) {
    // v/u
    const arg1 = (0, multiply_js_1.divide)((0, defs_js_1.caddr)(p1), (0, defs_js_1.cadr)(p1));
    // du/dx
    const deriv_1 = derivative((0, defs_js_1.cadr)(p1), p2);
    // log u
    const log_1 = (0, log_js_1.logarithm)((0, defs_js_1.cadr)(p1));
    // dv/dx
    const deriv_2 = derivative((0, defs_js_1.caddr)(p1), p2);
    // u^v
    return (0, multiply_js_1.multiply)((0, add_js_1.add)((0, multiply_js_1.multiply)(arg1, deriv_1), (0, multiply_js_1.multiply)(log_1, deriv_2)), p1);
}
function dlog(p1, p2) {
    const deriv = derivative((0, defs_js_1.cadr)(p1), p2);
    return (0, multiply_js_1.divide)(deriv, (0, defs_js_1.cadr)(p1));
}
//  derivative of derivative
//
//  example: d(d(f(x,y),y),x)
//
//  p1 = d(f(x,y),y)
//
//  p2 = x
//
//  cadr(p1) = f(x,y)
//
//  caddr(p1) = y
function dd(p1, p2) {
    // d(f(x,y),x)
    const p3 = derivative((0, defs_js_1.cadr)(p1), p2);
    if ((0, defs_js_1.car)(p3) === (0, symbol_js_1.symbol)(defs_js_1.DERIVATIVE)) {
        // sort dx terms
        if ((0, misc_js_1.lessp)((0, defs_js_1.caddr)(p3), (0, defs_js_1.caddr)(p1))) {
            return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.DERIVATIVE), (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.DERIVATIVE), (0, defs_js_1.cadr)(p3), (0, defs_js_1.caddr)(p3)), (0, defs_js_1.caddr)(p1));
        }
        else {
            return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.DERIVATIVE), (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.DERIVATIVE), (0, defs_js_1.cadr)(p3), (0, defs_js_1.caddr)(p1)), (0, defs_js_1.caddr)(p3));
        }
    }
    return derivative(p3, (0, defs_js_1.caddr)(p1));
}
// derivative of a generic function
function dfunction(p1, p2) {
    const p3 = (0, defs_js_1.cdr)(p1); // p3 is the argument list for the function
    if (p3 === (0, symbol_js_1.symbol)(defs_js_1.NIL) || (0, find_js_1.Find)(p3, p2)) {
        return (0, list_js_1.makeList)((0, symbol_js_1.symbol)(defs_js_1.DERIVATIVE), p1, p2);
    }
    return defs_js_1.Constants.zero;
}
function dsin(p1, p2) {
    const deriv = derivative((0, defs_js_1.cadr)(p1), p2);
    return (0, multiply_js_1.multiply)(deriv, (0, cos_js_1.cosine)((0, defs_js_1.cadr)(p1)));
}
function dcos(p1, p2) {
    const deriv = derivative((0, defs_js_1.cadr)(p1), p2);
    return (0, multiply_js_1.negate)((0, multiply_js_1.multiply)(deriv, (0, sin_js_1.sine)((0, defs_js_1.cadr)(p1))));
}
function dtan(p1, p2) {
    const deriv = derivative((0, defs_js_1.cadr)(p1), p2);
    return (0, multiply_js_1.multiply)(deriv, (0, power_js_1.power)((0, cos_js_1.cosine)((0, defs_js_1.cadr)(p1)), (0, bignum_js_1.integer)(-2)));
}
function darcsin(p1, p2) {
    const deriv = derivative((0, defs_js_1.cadr)(p1), p2);
    return (0, multiply_js_1.multiply)(deriv, (0, power_js_1.power)((0, add_js_1.subtract)(defs_js_1.Constants.one, (0, power_js_1.power)((0, defs_js_1.cadr)(p1), (0, bignum_js_1.integer)(2))), (0, bignum_js_1.rational)(-1, 2)));
}
function darccos(p1, p2) {
    const deriv = derivative((0, defs_js_1.cadr)(p1), p2);
    return (0, multiply_js_1.negate)((0, multiply_js_1.multiply)(deriv, (0, power_js_1.power)((0, add_js_1.subtract)(defs_js_1.Constants.one, (0, power_js_1.power)((0, defs_js_1.cadr)(p1), (0, bignum_js_1.integer)(2))), (0, bignum_js_1.rational)(-1, 2))));
}
//        Without simplify  With simplify
//
//  d(arctan(y/x),x)  -y/(x^2*(y^2/x^2+1))  -y/(x^2+y^2)
//
//  d(arctan(y/x),y)  1/(x*(y^2/x^2+1))  x/(x^2+y^2)
function darctan(p1, p2) {
    const deriv = derivative((0, defs_js_1.cadr)(p1), p2);
    return (0, simplify_js_1.simplify)((0, multiply_js_1.multiply)(deriv, (0, multiply_js_1.inverse)((0, add_js_1.add)(defs_js_1.Constants.one, (0, power_js_1.power)((0, defs_js_1.cadr)(p1), (0, bignum_js_1.integer)(2))))));
}
function dsinh(p1, p2) {
    const deriv = derivative((0, defs_js_1.cadr)(p1), p2);
    return (0, multiply_js_1.multiply)(deriv, (0, cosh_js_1.ycosh)((0, defs_js_1.cadr)(p1)));
}
function dcosh(p1, p2) {
    const deriv = derivative((0, defs_js_1.cadr)(p1), p2);
    return (0, multiply_js_1.multiply)(deriv, (0, sinh_js_1.ysinh)((0, defs_js_1.cadr)(p1)));
}
function dtanh(p1, p2) {
    const deriv = derivative((0, defs_js_1.cadr)(p1), p2);
    return (0, multiply_js_1.multiply)(deriv, (0, power_js_1.power)((0, cosh_js_1.ycosh)((0, defs_js_1.cadr)(p1)), (0, bignum_js_1.integer)(-2)));
}
function darcsinh(p1, p2) {
    const deriv = derivative((0, defs_js_1.cadr)(p1), p2);
    return (0, multiply_js_1.multiply)(deriv, (0, power_js_1.power)((0, add_js_1.add)((0, power_js_1.power)((0, defs_js_1.cadr)(p1), (0, bignum_js_1.integer)(2)), defs_js_1.Constants.one), (0, bignum_js_1.rational)(-1, 2)));
}
function darccosh(p1, p2) {
    const deriv = derivative((0, defs_js_1.cadr)(p1), p2);
    return (0, multiply_js_1.multiply)(deriv, (0, power_js_1.power)((0, add_js_1.add)((0, power_js_1.power)((0, defs_js_1.cadr)(p1), (0, bignum_js_1.integer)(2)), defs_js_1.Constants.negOne), (0, bignum_js_1.rational)(-1, 2)));
}
function darctanh(p1, p2) {
    const deriv = derivative((0, defs_js_1.cadr)(p1), p2);
    return (0, multiply_js_1.multiply)(deriv, (0, multiply_js_1.inverse)((0, add_js_1.subtract)(defs_js_1.Constants.one, (0, power_js_1.power)((0, defs_js_1.cadr)(p1), (0, bignum_js_1.integer)(2)))));
}
function dabs(p1, p2) {
    const deriv = derivative((0, defs_js_1.cadr)(p1), p2);
    return (0, multiply_js_1.multiply)(deriv, (0, sgn_js_1.sgn)((0, defs_js_1.cadr)(p1)));
}
function dsgn(p1, p2) {
    const deriv = derivative((0, defs_js_1.cadr)(p1), p2);
    return (0, multiply_js_1.multiply)((0, multiply_js_1.multiply)(deriv, (0, dirac_js_1.dirac)((0, defs_js_1.cadr)(p1))), (0, bignum_js_1.integer)(2));
}
function dhermite(p1, p2) {
    const deriv = derivative((0, defs_js_1.cadr)(p1), p2);
    return (0, multiply_js_1.multiply)((0, multiply_js_1.multiply)(deriv, (0, multiply_js_1.multiply)((0, bignum_js_1.integer)(2), (0, defs_js_1.caddr)(p1))), (0, hermite_js_1.hermite)((0, defs_js_1.cadr)(p1), (0, add_js_1.add)((0, defs_js_1.caddr)(p1), defs_js_1.Constants.negOne)));
}
function derf(p1, p2) {
    const deriv = derivative((0, defs_js_1.cadr)(p1), p2);
    return (0, multiply_js_1.multiply)((0, multiply_js_1.multiply)((0, multiply_js_1.multiply)((0, misc_js_1.exponential)((0, multiply_js_1.multiply)((0, power_js_1.power)((0, defs_js_1.cadr)(p1), (0, bignum_js_1.integer)(2)), defs_js_1.Constants.negOne)), (0, power_js_1.power)(defs_js_1.Constants.Pi(), (0, bignum_js_1.rational)(-1, 2))), (0, bignum_js_1.integer)(2)), deriv);
}
function derfc(p1, p2) {
    const deriv = derivative((0, defs_js_1.cadr)(p1), p2);
    return (0, multiply_js_1.multiply)((0, multiply_js_1.multiply)((0, multiply_js_1.multiply)((0, misc_js_1.exponential)((0, multiply_js_1.multiply)((0, power_js_1.power)((0, defs_js_1.cadr)(p1), (0, bignum_js_1.integer)(2)), defs_js_1.Constants.negOne)), (0, power_js_1.power)(defs_js_1.Constants.Pi(), (0, bignum_js_1.rational)(-1, 2))), (0, bignum_js_1.integer)(-2)), deriv);
}
function dbesselj(p1, p2) {
    if ((0, is_js_1.isZeroAtomOrTensor)((0, defs_js_1.caddr)(p1))) {
        return dbesselj0(p1, p2);
    }
    return dbesseljn(p1, p2);
}
function dbesselj0(p1, p2) {
    const deriv = derivative((0, defs_js_1.cadr)(p1), p2);
    return (0, multiply_js_1.multiply)((0, multiply_js_1.multiply)(deriv, (0, besselj_js_1.besselj)((0, defs_js_1.cadr)(p1), defs_js_1.Constants.one)), defs_js_1.Constants.negOne);
}
function dbesseljn(p1, p2) {
    const deriv = derivative((0, defs_js_1.cadr)(p1), p2);
    return (0, multiply_js_1.multiply)(deriv, (0, add_js_1.add)((0, besselj_js_1.besselj)((0, defs_js_1.cadr)(p1), (0, add_js_1.add)((0, defs_js_1.caddr)(p1), defs_js_1.Constants.negOne)), (0, multiply_js_1.multiply)((0, multiply_js_1.divide)((0, multiply_js_1.multiply)((0, defs_js_1.caddr)(p1), defs_js_1.Constants.negOne), (0, defs_js_1.cadr)(p1)), (0, besselj_js_1.besselj)((0, defs_js_1.cadr)(p1), (0, defs_js_1.caddr)(p1)))));
}
function dbessely(p1, p2) {
    if ((0, is_js_1.isZeroAtomOrTensor)((0, defs_js_1.caddr)(p1))) {
        return dbessely0(p1, p2);
    }
    return dbesselyn(p1, p2);
}
function dbessely0(p1, p2) {
    const deriv = derivative((0, defs_js_1.cadr)(p1), p2);
    return (0, multiply_js_1.multiply)((0, multiply_js_1.multiply)(deriv, (0, besselj_js_1.besselj)((0, defs_js_1.cadr)(p1), defs_js_1.Constants.one)), defs_js_1.Constants.negOne);
}
function dbesselyn(p1, p2) {
    const deriv = derivative((0, defs_js_1.cadr)(p1), p2);
    return (0, multiply_js_1.multiply)(deriv, (0, add_js_1.add)((0, bessely_js_1.bessely)((0, defs_js_1.cadr)(p1), (0, add_js_1.add)((0, defs_js_1.caddr)(p1), defs_js_1.Constants.negOne)), (0, multiply_js_1.multiply)((0, multiply_js_1.divide)((0, multiply_js_1.multiply)((0, defs_js_1.caddr)(p1), defs_js_1.Constants.negOne), (0, defs_js_1.cadr)(p1)), (0, bessely_js_1.bessely)((0, defs_js_1.cadr)(p1), (0, defs_js_1.caddr)(p1)))));
}
function derivative_of_integral(p1) {
    return (0, defs_js_1.cadr)(p1);
}
