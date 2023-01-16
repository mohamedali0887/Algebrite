"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simfac = void 0;
const defs_js_1 = require("../runtime/defs.js");
const symbol_js_1 = require("../runtime/symbol.js");
const misc_js_1 = require("../sources/misc.js");
const add_js_1 = require("./add.js");
const eval_js_1 = require("./eval.js");
const factorial_js_1 = require("./factorial.js");
const is_js_1 = require("./is.js");
const multiply_js_1 = require("./multiply.js");
/*
 Simplify factorials

The following script

  F(n,k) = k binomial(n,k)
  (F(n,k) + F(n,k-1)) / F(n+1,k)

generates

       k! n!             n! (1 - k + n)!              k! n!
 -------------------- + -------------------- - ----------------------
 (-1 + k)! (1 + n)!     (1 + n)! (-k + n)!     k (-1 + k)! (1 + n)!

Simplify each term to get

    k       1 - k + n       1
 ------- + ----------- - -------
  1 + n       1 + n       1 + n

Then simplify the sum to get

    n
 -------
  1 + n

*/
// simplify factorials term-by-term
function Eval_simfac(p1) {
    return simfac((0, eval_js_1.Eval)((0, defs_js_1.cadr)(p1)));
}
//if 1
function simfac(p1) {
    if ((0, defs_js_1.isadd)(p1)) {
        const terms = p1.tail().map(simfac_term);
        return (0, add_js_1.add_all)(terms);
    }
    return simfac_term(p1);
}
exports.simfac = simfac;
//else
/*
void
simfac(void)
{
  int h
  save()
  p1 = pop()
  if (car(p1) == symbol(ADD)) {
    h = tos
    p1 = cdr(p1)
    while (p1 != symbol(NIL)) {
      push(car(p1))
      simfac_term()
      p1 = cdr(p1)
    }
    addk(tos - h)
    p1 = pop()
    if (find(p1, symbol(FACTORIAL))) {
      push(p1)
      if (car(p1) == symbol(ADD)) {
        Condense()
        simfac_term()
      }
    }
  } else {
    push(p1)
    simfac_term()
  }
  restore()
}

*endif
*/
function simfac_term(p1) {
    // if not a product of factors then done
    if (!(0, defs_js_1.ismultiply)(p1)) {
        return p1;
    }
    // push all factors
    const factors = p1.tail();
    // keep trying until no more to do
    while (yysimfac(factors)) {
        // do nothing
    }
    return (0, multiply_js_1.multiply_all_noexpand)(factors);
}
// try all pairs of factors
function yysimfac(stack) {
    for (let i = 0; i < stack.length; i++) {
        let p1 = stack[i];
        for (let j = 0; j < stack.length; j++) {
            if (i === j) {
                continue;
            }
            let p2 = stack[j];
            //  n! / n    ->  (n - 1)!
            if ((0, defs_js_1.isfactorial)(p1) &&
                (0, defs_js_1.ispower)(p2) &&
                (0, is_js_1.isminusone)((0, defs_js_1.caddr)(p2)) &&
                (0, misc_js_1.equal)((0, defs_js_1.cadr)(p1), (0, defs_js_1.cadr)(p2))) {
                stack[i] = (0, factorial_js_1.factorial)((0, add_js_1.subtract)((0, defs_js_1.cadr)(p1), defs_js_1.Constants.one));
                stack[j] = defs_js_1.Constants.one;
                return true;
            }
            //  n / n!    ->  1 / (n - 1)!
            if ((0, defs_js_1.ispower)(p2) &&
                (0, is_js_1.isminusone)((0, defs_js_1.caddr)(p2)) &&
                (0, defs_js_1.caadr)(p2) === (0, symbol_js_1.symbol)(defs_js_1.FACTORIAL) &&
                (0, misc_js_1.equal)(p1, (0, defs_js_1.cadadr)(p2))) {
                stack[i] = (0, multiply_js_1.reciprocate)((0, factorial_js_1.factorial)((0, add_js_1.add)(p1, defs_js_1.Constants.negOne)));
                stack[j] = defs_js_1.Constants.one;
                return true;
            }
            //  (n + 1) n!  ->  (n + 1)!
            if ((0, defs_js_1.isfactorial)(p2)) {
                const p3 = (0, add_js_1.subtract)(p1, (0, defs_js_1.cadr)(p2));
                if ((0, is_js_1.isplusone)(p3)) {
                    stack[i] = (0, factorial_js_1.factorial)(p1);
                    stack[j] = defs_js_1.Constants.one;
                    return true;
                }
            }
            //  1 / ((n + 1) n!)  ->  1 / (n + 1)!
            if ((0, defs_js_1.ispower)(p1) &&
                (0, is_js_1.isminusone)((0, defs_js_1.caddr)(p1)) &&
                (0, defs_js_1.ispower)(p2) &&
                (0, is_js_1.isminusone)((0, defs_js_1.caddr)(p2)) &&
                (0, defs_js_1.caadr)(p2) === (0, symbol_js_1.symbol)(defs_js_1.FACTORIAL)) {
                const p3 = (0, add_js_1.subtract)((0, defs_js_1.cadr)(p1), (0, defs_js_1.cadr)((0, defs_js_1.cadr)(p2)));
                if ((0, is_js_1.isplusone)(p3)) {
                    stack[i] = (0, multiply_js_1.reciprocate)((0, factorial_js_1.factorial)((0, defs_js_1.cadr)(p1)));
                    stack[j] = defs_js_1.Constants.one;
                    return true;
                }
            }
            //  (n + 1)! / n!  ->  n + 1
            //  n! / (n + 1)!  ->  1 / (n + 1)
            if ((0, defs_js_1.isfactorial)(p1) &&
                (0, defs_js_1.ispower)(p2) &&
                (0, is_js_1.isminusone)((0, defs_js_1.caddr)(p2)) &&
                (0, defs_js_1.caadr)(p2) === (0, symbol_js_1.symbol)(defs_js_1.FACTORIAL)) {
                const p3 = (0, add_js_1.subtract)((0, defs_js_1.cadr)(p1), (0, defs_js_1.cadr)((0, defs_js_1.cadr)(p2)));
                if ((0, is_js_1.isplusone)(p3)) {
                    stack[i] = (0, defs_js_1.cadr)(p1);
                    stack[j] = defs_js_1.Constants.one;
                    return true;
                }
                if ((0, is_js_1.isminusone)(p3)) {
                    stack[i] = (0, multiply_js_1.reciprocate)((0, defs_js_1.cadr)((0, defs_js_1.cadr)(p2)));
                    stack[j] = defs_js_1.Constants.one;
                    return true;
                }
                if ((0, is_js_1.equaln)(p3, 2)) {
                    stack[i] = (0, defs_js_1.cadr)(p1);
                    stack[j] = (0, add_js_1.add)((0, defs_js_1.cadr)(p1), defs_js_1.Constants.negOne);
                    return true;
                }
                if ((0, is_js_1.equaln)(p3, -2)) {
                    stack[i] = (0, multiply_js_1.reciprocate)((0, defs_js_1.cadr)((0, defs_js_1.cadr)(p2)));
                    stack[j] = (0, multiply_js_1.reciprocate)((0, add_js_1.add)((0, defs_js_1.cadr)((0, defs_js_1.cadr)(p2)), defs_js_1.Constants.negOne));
                    return true;
                }
            }
        }
    }
    return false;
}
