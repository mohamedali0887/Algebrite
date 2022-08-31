(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod2) => function __require() {
    return mod2 || (0, cb[Object.keys(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // node_modules/big-integer/BigInteger.js
  var require_BigInteger = __commonJS({
    "node_modules/big-integer/BigInteger.js"(exports, module) {
      var bigInt8 = function(undefined2) {
        "use strict";
        var BASE = 1e7, LOG_BASE = 7, MAX_INT = 9007199254740992, MAX_INT_ARR = smallToArray(MAX_INT), DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
        var supportsNativeBigInt = typeof BigInt === "function";
        function Integer(v, radix, alphabet, caseSensitive) {
          if (typeof v === "undefined")
            return Integer[0];
          if (typeof radix !== "undefined")
            return +radix === 10 && !alphabet ? parseValue(v) : parseBase(v, radix, alphabet, caseSensitive);
          return parseValue(v);
        }
        function BigInteger(value, sign2) {
          this.value = value;
          this.sign = sign2;
          this.isSmall = false;
        }
        BigInteger.prototype = Object.create(Integer.prototype);
        function SmallInteger(value) {
          this.value = value;
          this.sign = value < 0;
          this.isSmall = true;
        }
        SmallInteger.prototype = Object.create(Integer.prototype);
        function NativeBigInt(value) {
          this.value = value;
        }
        NativeBigInt.prototype = Object.create(Integer.prototype);
        function isPrecise(n) {
          return -MAX_INT < n && n < MAX_INT;
        }
        function smallToArray(n) {
          if (n < 1e7)
            return [n];
          if (n < 1e14)
            return [n % 1e7, Math.floor(n / 1e7)];
          return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
        }
        function arrayToSmall(arr) {
          trim(arr);
          var length2 = arr.length;
          if (length2 < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
            switch (length2) {
              case 0:
                return 0;
              case 1:
                return arr[0];
              case 2:
                return arr[0] + arr[1] * BASE;
              default:
                return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
            }
          }
          return arr;
        }
        function trim(v) {
          var i2 = v.length;
          while (v[--i2] === 0)
            ;
          v.length = i2 + 1;
        }
        function createArray(length2) {
          var x = new Array(length2);
          var i2 = -1;
          while (++i2 < length2) {
            x[i2] = 0;
          }
          return x;
        }
        function truncate(n) {
          if (n > 0)
            return Math.floor(n);
          return Math.ceil(n);
        }
        function add2(a, b) {
          var l_a = a.length, l_b = b.length, r = new Array(l_a), carry = 0, base = BASE, sum2, i2;
          for (i2 = 0; i2 < l_b; i2++) {
            sum2 = a[i2] + b[i2] + carry;
            carry = sum2 >= base ? 1 : 0;
            r[i2] = sum2 - carry * base;
          }
          while (i2 < l_a) {
            sum2 = a[i2] + carry;
            carry = sum2 === base ? 1 : 0;
            r[i2++] = sum2 - carry * base;
          }
          if (carry > 0)
            r.push(carry);
          return r;
        }
        function addAny(a, b) {
          if (a.length >= b.length)
            return add2(a, b);
          return add2(b, a);
        }
        function addSmall(a, carry) {
          var l = a.length, r = new Array(l), base = BASE, sum2, i2;
          for (i2 = 0; i2 < l; i2++) {
            sum2 = a[i2] - base + carry;
            carry = Math.floor(sum2 / base);
            r[i2] = sum2 - carry * base;
            carry += 1;
          }
          while (carry > 0) {
            r[i2++] = carry % base;
            carry = Math.floor(carry / base);
          }
          return r;
        }
        BigInteger.prototype.add = function(v) {
          var n = parseValue(v);
          if (this.sign !== n.sign) {
            return this.subtract(n.negate());
          }
          var a = this.value, b = n.value;
          if (n.isSmall) {
            return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
          }
          return new BigInteger(addAny(a, b), this.sign);
        };
        BigInteger.prototype.plus = BigInteger.prototype.add;
        SmallInteger.prototype.add = function(v) {
          var n = parseValue(v);
          var a = this.value;
          if (a < 0 !== n.sign) {
            return this.subtract(n.negate());
          }
          var b = n.value;
          if (n.isSmall) {
            if (isPrecise(a + b))
              return new SmallInteger(a + b);
            b = smallToArray(Math.abs(b));
          }
          return new BigInteger(addSmall(b, Math.abs(a)), a < 0);
        };
        SmallInteger.prototype.plus = SmallInteger.prototype.add;
        NativeBigInt.prototype.add = function(v) {
          return new NativeBigInt(this.value + parseValue(v).value);
        };
        NativeBigInt.prototype.plus = NativeBigInt.prototype.add;
        function subtract2(a, b) {
          var a_l = a.length, b_l = b.length, r = new Array(a_l), borrow = 0, base = BASE, i2, difference;
          for (i2 = 0; i2 < b_l; i2++) {
            difference = a[i2] - borrow - b[i2];
            if (difference < 0) {
              difference += base;
              borrow = 1;
            } else
              borrow = 0;
            r[i2] = difference;
          }
          for (i2 = b_l; i2 < a_l; i2++) {
            difference = a[i2] - borrow;
            if (difference < 0)
              difference += base;
            else {
              r[i2++] = difference;
              break;
            }
            r[i2] = difference;
          }
          for (; i2 < a_l; i2++) {
            r[i2] = a[i2];
          }
          trim(r);
          return r;
        }
        function subtractAny(a, b, sign2) {
          var value;
          if (compareAbs(a, b) >= 0) {
            value = subtract2(a, b);
          } else {
            value = subtract2(b, a);
            sign2 = !sign2;
          }
          value = arrayToSmall(value);
          if (typeof value === "number") {
            if (sign2)
              value = -value;
            return new SmallInteger(value);
          }
          return new BigInteger(value, sign2);
        }
        function subtractSmall(a, b, sign2) {
          var l = a.length, r = new Array(l), carry = -b, base = BASE, i2, difference;
          for (i2 = 0; i2 < l; i2++) {
            difference = a[i2] + carry;
            carry = Math.floor(difference / base);
            difference %= base;
            r[i2] = difference < 0 ? difference + base : difference;
          }
          r = arrayToSmall(r);
          if (typeof r === "number") {
            if (sign2)
              r = -r;
            return new SmallInteger(r);
          }
          return new BigInteger(r, sign2);
        }
        BigInteger.prototype.subtract = function(v) {
          var n = parseValue(v);
          if (this.sign !== n.sign) {
            return this.add(n.negate());
          }
          var a = this.value, b = n.value;
          if (n.isSmall)
            return subtractSmall(a, Math.abs(b), this.sign);
          return subtractAny(a, b, this.sign);
        };
        BigInteger.prototype.minus = BigInteger.prototype.subtract;
        SmallInteger.prototype.subtract = function(v) {
          var n = parseValue(v);
          var a = this.value;
          if (a < 0 !== n.sign) {
            return this.add(n.negate());
          }
          var b = n.value;
          if (n.isSmall) {
            return new SmallInteger(a - b);
          }
          return subtractSmall(b, Math.abs(a), a >= 0);
        };
        SmallInteger.prototype.minus = SmallInteger.prototype.subtract;
        NativeBigInt.prototype.subtract = function(v) {
          return new NativeBigInt(this.value - parseValue(v).value);
        };
        NativeBigInt.prototype.minus = NativeBigInt.prototype.subtract;
        BigInteger.prototype.negate = function() {
          return new BigInteger(this.value, !this.sign);
        };
        SmallInteger.prototype.negate = function() {
          var sign2 = this.sign;
          var small = new SmallInteger(-this.value);
          small.sign = !sign2;
          return small;
        };
        NativeBigInt.prototype.negate = function() {
          return new NativeBigInt(-this.value);
        };
        BigInteger.prototype.abs = function() {
          return new BigInteger(this.value, false);
        };
        SmallInteger.prototype.abs = function() {
          return new SmallInteger(Math.abs(this.value));
        };
        NativeBigInt.prototype.abs = function() {
          return new NativeBigInt(this.value >= 0 ? this.value : -this.value);
        };
        function multiplyLong(a, b) {
          var a_l = a.length, b_l = b.length, l = a_l + b_l, r = createArray(l), base = BASE, product, carry, i2, a_i, b_j;
          for (i2 = 0; i2 < a_l; ++i2) {
            a_i = a[i2];
            for (var j = 0; j < b_l; ++j) {
              b_j = b[j];
              product = a_i * b_j + r[i2 + j];
              carry = Math.floor(product / base);
              r[i2 + j] = product - carry * base;
              r[i2 + j + 1] += carry;
            }
          }
          trim(r);
          return r;
        }
        function multiplySmall(a, b) {
          var l = a.length, r = new Array(l), base = BASE, carry = 0, product, i2;
          for (i2 = 0; i2 < l; i2++) {
            product = a[i2] * b + carry;
            carry = Math.floor(product / base);
            r[i2] = product - carry * base;
          }
          while (carry > 0) {
            r[i2++] = carry % base;
            carry = Math.floor(carry / base);
          }
          return r;
        }
        function shiftLeft(x, n) {
          var r = [];
          while (n-- > 0)
            r.push(0);
          return r.concat(x);
        }
        function multiplyKaratsuba(x, y) {
          var n = Math.max(x.length, y.length);
          if (n <= 30)
            return multiplyLong(x, y);
          n = Math.ceil(n / 2);
          var b = x.slice(n), a = x.slice(0, n), d = y.slice(n), c = y.slice(0, n);
          var ac = multiplyKaratsuba(a, c), bd = multiplyKaratsuba(b, d), abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));
          var product = addAny(addAny(ac, shiftLeft(subtract2(subtract2(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
          trim(product);
          return product;
        }
        function useKaratsuba(l1, l2) {
          return -0.012 * l1 - 0.012 * l2 + 15e-6 * l1 * l2 > 0;
        }
        BigInteger.prototype.multiply = function(v) {
          var n = parseValue(v), a = this.value, b = n.value, sign2 = this.sign !== n.sign, abs2;
          if (n.isSmall) {
            if (b === 0)
              return Integer[0];
            if (b === 1)
              return this;
            if (b === -1)
              return this.negate();
            abs2 = Math.abs(b);
            if (abs2 < BASE) {
              return new BigInteger(multiplySmall(a, abs2), sign2);
            }
            b = smallToArray(abs2);
          }
          if (useKaratsuba(a.length, b.length))
            return new BigInteger(multiplyKaratsuba(a, b), sign2);
          return new BigInteger(multiplyLong(a, b), sign2);
        };
        BigInteger.prototype.times = BigInteger.prototype.multiply;
        function multiplySmallAndArray(a, b, sign2) {
          if (a < BASE) {
            return new BigInteger(multiplySmall(b, a), sign2);
          }
          return new BigInteger(multiplyLong(b, smallToArray(a)), sign2);
        }
        SmallInteger.prototype._multiplyBySmall = function(a) {
          if (isPrecise(a.value * this.value)) {
            return new SmallInteger(a.value * this.value);
          }
          return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
        };
        BigInteger.prototype._multiplyBySmall = function(a) {
          if (a.value === 0)
            return Integer[0];
          if (a.value === 1)
            return this;
          if (a.value === -1)
            return this.negate();
          return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
        };
        SmallInteger.prototype.multiply = function(v) {
          return parseValue(v)._multiplyBySmall(this);
        };
        SmallInteger.prototype.times = SmallInteger.prototype.multiply;
        NativeBigInt.prototype.multiply = function(v) {
          return new NativeBigInt(this.value * parseValue(v).value);
        };
        NativeBigInt.prototype.times = NativeBigInt.prototype.multiply;
        function square2(a) {
          var l = a.length, r = createArray(l + l), base = BASE, product, carry, i2, a_i, a_j;
          for (i2 = 0; i2 < l; i2++) {
            a_i = a[i2];
            carry = 0 - a_i * a_i;
            for (var j = i2; j < l; j++) {
              a_j = a[j];
              product = 2 * (a_i * a_j) + r[i2 + j] + carry;
              carry = Math.floor(product / base);
              r[i2 + j] = product - carry * base;
            }
            r[i2 + l] = carry;
          }
          trim(r);
          return r;
        }
        BigInteger.prototype.square = function() {
          return new BigInteger(square2(this.value), false);
        };
        SmallInteger.prototype.square = function() {
          var value = this.value * this.value;
          if (isPrecise(value))
            return new SmallInteger(value);
          return new BigInteger(square2(smallToArray(Math.abs(this.value))), false);
        };
        NativeBigInt.prototype.square = function(v) {
          return new NativeBigInt(this.value * this.value);
        };
        function divMod1(a, b) {
          var a_l = a.length, b_l = b.length, base = BASE, result = createArray(b.length), divisorMostSignificantDigit = b[b_l - 1], lambda = Math.ceil(base / (2 * divisorMostSignificantDigit)), remainder = multiplySmall(a, lambda), divisor = multiplySmall(b, lambda), quotientDigit, shift, carry, borrow, i2, l, q;
          if (remainder.length <= a_l)
            remainder.push(0);
          divisor.push(0);
          divisorMostSignificantDigit = divisor[b_l - 1];
          for (shift = a_l - b_l; shift >= 0; shift--) {
            quotientDigit = base - 1;
            if (remainder[shift + b_l] !== divisorMostSignificantDigit) {
              quotientDigit = Math.floor((remainder[shift + b_l] * base + remainder[shift + b_l - 1]) / divisorMostSignificantDigit);
            }
            carry = 0;
            borrow = 0;
            l = divisor.length;
            for (i2 = 0; i2 < l; i2++) {
              carry += quotientDigit * divisor[i2];
              q = Math.floor(carry / base);
              borrow += remainder[shift + i2] - (carry - q * base);
              carry = q;
              if (borrow < 0) {
                remainder[shift + i2] = borrow + base;
                borrow = -1;
              } else {
                remainder[shift + i2] = borrow;
                borrow = 0;
              }
            }
            while (borrow !== 0) {
              quotientDigit -= 1;
              carry = 0;
              for (i2 = 0; i2 < l; i2++) {
                carry += remainder[shift + i2] - base + divisor[i2];
                if (carry < 0) {
                  remainder[shift + i2] = carry + base;
                  carry = 0;
                } else {
                  remainder[shift + i2] = carry;
                  carry = 1;
                }
              }
              borrow += carry;
            }
            result[shift] = quotientDigit;
          }
          remainder = divModSmall(remainder, lambda)[0];
          return [arrayToSmall(result), arrayToSmall(remainder)];
        }
        function divMod2(a, b) {
          var a_l = a.length, b_l = b.length, result = [], part = [], base = BASE, guess2, xlen, highx, highy, check;
          while (a_l) {
            part.unshift(a[--a_l]);
            trim(part);
            if (compareAbs(part, b) < 0) {
              result.push(0);
              continue;
            }
            xlen = part.length;
            highx = part[xlen - 1] * base + part[xlen - 2];
            highy = b[b_l - 1] * base + b[b_l - 2];
            if (xlen > b_l) {
              highx = (highx + 1) * base;
            }
            guess2 = Math.ceil(highx / highy);
            do {
              check = multiplySmall(b, guess2);
              if (compareAbs(check, part) <= 0)
                break;
              guess2--;
            } while (guess2);
            result.push(guess2);
            part = subtract2(part, check);
          }
          result.reverse();
          return [arrayToSmall(result), arrayToSmall(part)];
        }
        function divModSmall(value, lambda) {
          var length2 = value.length, quotient = createArray(length2), base = BASE, i2, q, remainder, divisor;
          remainder = 0;
          for (i2 = length2 - 1; i2 >= 0; --i2) {
            divisor = remainder * base + value[i2];
            q = truncate(divisor / lambda);
            remainder = divisor - q * lambda;
            quotient[i2] = q | 0;
          }
          return [quotient, remainder | 0];
        }
        function divModAny(self, v) {
          var value, n = parseValue(v);
          if (supportsNativeBigInt) {
            return [new NativeBigInt(self.value / n.value), new NativeBigInt(self.value % n.value)];
          }
          var a = self.value, b = n.value;
          var quotient;
          if (b === 0)
            throw new Error("Cannot divide by zero");
          if (self.isSmall) {
            if (n.isSmall) {
              return [new SmallInteger(truncate(a / b)), new SmallInteger(a % b)];
            }
            return [Integer[0], self];
          }
          if (n.isSmall) {
            if (b === 1)
              return [self, Integer[0]];
            if (b == -1)
              return [self.negate(), Integer[0]];
            var abs2 = Math.abs(b);
            if (abs2 < BASE) {
              value = divModSmall(a, abs2);
              quotient = arrayToSmall(value[0]);
              var remainder = value[1];
              if (self.sign)
                remainder = -remainder;
              if (typeof quotient === "number") {
                if (self.sign !== n.sign)
                  quotient = -quotient;
                return [new SmallInteger(quotient), new SmallInteger(remainder)];
              }
              return [new BigInteger(quotient, self.sign !== n.sign), new SmallInteger(remainder)];
            }
            b = smallToArray(abs2);
          }
          var comparison = compareAbs(a, b);
          if (comparison === -1)
            return [Integer[0], self];
          if (comparison === 0)
            return [Integer[self.sign === n.sign ? 1 : -1], Integer[0]];
          if (a.length + b.length <= 200)
            value = divMod1(a, b);
          else
            value = divMod2(a, b);
          quotient = value[0];
          var qSign = self.sign !== n.sign, mod2 = value[1], mSign = self.sign;
          if (typeof quotient === "number") {
            if (qSign)
              quotient = -quotient;
            quotient = new SmallInteger(quotient);
          } else
            quotient = new BigInteger(quotient, qSign);
          if (typeof mod2 === "number") {
            if (mSign)
              mod2 = -mod2;
            mod2 = new SmallInteger(mod2);
          } else
            mod2 = new BigInteger(mod2, mSign);
          return [quotient, mod2];
        }
        BigInteger.prototype.divmod = function(v) {
          var result = divModAny(this, v);
          return {
            quotient: result[0],
            remainder: result[1]
          };
        };
        NativeBigInt.prototype.divmod = SmallInteger.prototype.divmod = BigInteger.prototype.divmod;
        BigInteger.prototype.divide = function(v) {
          return divModAny(this, v)[0];
        };
        NativeBigInt.prototype.over = NativeBigInt.prototype.divide = function(v) {
          return new NativeBigInt(this.value / parseValue(v).value);
        };
        SmallInteger.prototype.over = SmallInteger.prototype.divide = BigInteger.prototype.over = BigInteger.prototype.divide;
        BigInteger.prototype.mod = function(v) {
          return divModAny(this, v)[1];
        };
        NativeBigInt.prototype.mod = NativeBigInt.prototype.remainder = function(v) {
          return new NativeBigInt(this.value % parseValue(v).value);
        };
        SmallInteger.prototype.remainder = SmallInteger.prototype.mod = BigInteger.prototype.remainder = BigInteger.prototype.mod;
        BigInteger.prototype.pow = function(v) {
          var n = parseValue(v), a = this.value, b = n.value, value, x, y;
          if (b === 0)
            return Integer[1];
          if (a === 0)
            return Integer[0];
          if (a === 1)
            return Integer[1];
          if (a === -1)
            return n.isEven() ? Integer[1] : Integer[-1];
          if (n.sign) {
            return Integer[0];
          }
          if (!n.isSmall)
            throw new Error("The exponent " + n.toString() + " is too large.");
          if (this.isSmall) {
            if (isPrecise(value = Math.pow(a, b)))
              return new SmallInteger(truncate(value));
          }
          x = this;
          y = Integer[1];
          while (true) {
            if (b & true) {
              y = y.times(x);
              --b;
            }
            if (b === 0)
              break;
            b /= 2;
            x = x.square();
          }
          return y;
        };
        SmallInteger.prototype.pow = BigInteger.prototype.pow;
        NativeBigInt.prototype.pow = function(v) {
          var n = parseValue(v);
          var a = this.value, b = n.value;
          var _0 = BigInt(0), _1 = BigInt(1), _2 = BigInt(2);
          if (b === _0)
            return Integer[1];
          if (a === _0)
            return Integer[0];
          if (a === _1)
            return Integer[1];
          if (a === BigInt(-1))
            return n.isEven() ? Integer[1] : Integer[-1];
          if (n.isNegative())
            return new NativeBigInt(_0);
          var x = this;
          var y = Integer[1];
          while (true) {
            if ((b & _1) === _1) {
              y = y.times(x);
              --b;
            }
            if (b === _0)
              break;
            b /= _2;
            x = x.square();
          }
          return y;
        };
        BigInteger.prototype.modPow = function(exp, mod2) {
          exp = parseValue(exp);
          mod2 = parseValue(mod2);
          if (mod2.isZero())
            throw new Error("Cannot take modPow with modulus 0");
          var r = Integer[1], base = this.mod(mod2);
          if (exp.isNegative()) {
            exp = exp.multiply(Integer[-1]);
            base = base.modInv(mod2);
          }
          while (exp.isPositive()) {
            if (base.isZero())
              return Integer[0];
            if (exp.isOdd())
              r = r.multiply(base).mod(mod2);
            exp = exp.divide(2);
            base = base.square().mod(mod2);
          }
          return r;
        };
        NativeBigInt.prototype.modPow = SmallInteger.prototype.modPow = BigInteger.prototype.modPow;
        function compareAbs(a, b) {
          if (a.length !== b.length) {
            return a.length > b.length ? 1 : -1;
          }
          for (var i2 = a.length - 1; i2 >= 0; i2--) {
            if (a[i2] !== b[i2])
              return a[i2] > b[i2] ? 1 : -1;
          }
          return 0;
        }
        BigInteger.prototype.compareAbs = function(v) {
          var n = parseValue(v), a = this.value, b = n.value;
          if (n.isSmall)
            return 1;
          return compareAbs(a, b);
        };
        SmallInteger.prototype.compareAbs = function(v) {
          var n = parseValue(v), a = Math.abs(this.value), b = n.value;
          if (n.isSmall) {
            b = Math.abs(b);
            return a === b ? 0 : a > b ? 1 : -1;
          }
          return -1;
        };
        NativeBigInt.prototype.compareAbs = function(v) {
          var a = this.value;
          var b = parseValue(v).value;
          a = a >= 0 ? a : -a;
          b = b >= 0 ? b : -b;
          return a === b ? 0 : a > b ? 1 : -1;
        };
        BigInteger.prototype.compare = function(v) {
          if (v === Infinity) {
            return -1;
          }
          if (v === -Infinity) {
            return 1;
          }
          var n = parseValue(v), a = this.value, b = n.value;
          if (this.sign !== n.sign) {
            return n.sign ? 1 : -1;
          }
          if (n.isSmall) {
            return this.sign ? -1 : 1;
          }
          return compareAbs(a, b) * (this.sign ? -1 : 1);
        };
        BigInteger.prototype.compareTo = BigInteger.prototype.compare;
        SmallInteger.prototype.compare = function(v) {
          if (v === Infinity) {
            return -1;
          }
          if (v === -Infinity) {
            return 1;
          }
          var n = parseValue(v), a = this.value, b = n.value;
          if (n.isSmall) {
            return a == b ? 0 : a > b ? 1 : -1;
          }
          if (a < 0 !== n.sign) {
            return a < 0 ? -1 : 1;
          }
          return a < 0 ? 1 : -1;
        };
        SmallInteger.prototype.compareTo = SmallInteger.prototype.compare;
        NativeBigInt.prototype.compare = function(v) {
          if (v === Infinity) {
            return -1;
          }
          if (v === -Infinity) {
            return 1;
          }
          var a = this.value;
          var b = parseValue(v).value;
          return a === b ? 0 : a > b ? 1 : -1;
        };
        NativeBigInt.prototype.compareTo = NativeBigInt.prototype.compare;
        BigInteger.prototype.equals = function(v) {
          return this.compare(v) === 0;
        };
        NativeBigInt.prototype.eq = NativeBigInt.prototype.equals = SmallInteger.prototype.eq = SmallInteger.prototype.equals = BigInteger.prototype.eq = BigInteger.prototype.equals;
        BigInteger.prototype.notEquals = function(v) {
          return this.compare(v) !== 0;
        };
        NativeBigInt.prototype.neq = NativeBigInt.prototype.notEquals = SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = BigInteger.prototype.neq = BigInteger.prototype.notEquals;
        BigInteger.prototype.greater = function(v) {
          return this.compare(v) > 0;
        };
        NativeBigInt.prototype.gt = NativeBigInt.prototype.greater = SmallInteger.prototype.gt = SmallInteger.prototype.greater = BigInteger.prototype.gt = BigInteger.prototype.greater;
        BigInteger.prototype.lesser = function(v) {
          return this.compare(v) < 0;
        };
        NativeBigInt.prototype.lt = NativeBigInt.prototype.lesser = SmallInteger.prototype.lt = SmallInteger.prototype.lesser = BigInteger.prototype.lt = BigInteger.prototype.lesser;
        BigInteger.prototype.greaterOrEquals = function(v) {
          return this.compare(v) >= 0;
        };
        NativeBigInt.prototype.geq = NativeBigInt.prototype.greaterOrEquals = SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;
        BigInteger.prototype.lesserOrEquals = function(v) {
          return this.compare(v) <= 0;
        };
        NativeBigInt.prototype.leq = NativeBigInt.prototype.lesserOrEquals = SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = BigInteger.prototype.leq = BigInteger.prototype.lesserOrEquals;
        BigInteger.prototype.isEven = function() {
          return (this.value[0] & 1) === 0;
        };
        SmallInteger.prototype.isEven = function() {
          return (this.value & 1) === 0;
        };
        NativeBigInt.prototype.isEven = function() {
          return (this.value & BigInt(1)) === BigInt(0);
        };
        BigInteger.prototype.isOdd = function() {
          return (this.value[0] & 1) === 1;
        };
        SmallInteger.prototype.isOdd = function() {
          return (this.value & 1) === 1;
        };
        NativeBigInt.prototype.isOdd = function() {
          return (this.value & BigInt(1)) === BigInt(1);
        };
        BigInteger.prototype.isPositive = function() {
          return !this.sign;
        };
        SmallInteger.prototype.isPositive = function() {
          return this.value > 0;
        };
        NativeBigInt.prototype.isPositive = SmallInteger.prototype.isPositive;
        BigInteger.prototype.isNegative = function() {
          return this.sign;
        };
        SmallInteger.prototype.isNegative = function() {
          return this.value < 0;
        };
        NativeBigInt.prototype.isNegative = SmallInteger.prototype.isNegative;
        BigInteger.prototype.isUnit = function() {
          return false;
        };
        SmallInteger.prototype.isUnit = function() {
          return Math.abs(this.value) === 1;
        };
        NativeBigInt.prototype.isUnit = function() {
          return this.abs().value === BigInt(1);
        };
        BigInteger.prototype.isZero = function() {
          return false;
        };
        SmallInteger.prototype.isZero = function() {
          return this.value === 0;
        };
        NativeBigInt.prototype.isZero = function() {
          return this.value === BigInt(0);
        };
        BigInteger.prototype.isDivisibleBy = function(v) {
          var n = parseValue(v);
          if (n.isZero())
            return false;
          if (n.isUnit())
            return true;
          if (n.compareAbs(2) === 0)
            return this.isEven();
          return this.mod(n).isZero();
        };
        NativeBigInt.prototype.isDivisibleBy = SmallInteger.prototype.isDivisibleBy = BigInteger.prototype.isDivisibleBy;
        function isBasicPrime(v) {
          var n = v.abs();
          if (n.isUnit())
            return false;
          if (n.equals(2) || n.equals(3) || n.equals(5))
            return true;
          if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5))
            return false;
          if (n.lesser(49))
            return true;
        }
        function millerRabinTest(n, a) {
          var nPrev = n.prev(), b = nPrev, r = 0, d, t, i2, x;
          while (b.isEven())
            b = b.divide(2), r++;
          next:
            for (i2 = 0; i2 < a.length; i2++) {
              if (n.lesser(a[i2]))
                continue;
              x = bigInt8(a[i2]).modPow(b, n);
              if (x.isUnit() || x.equals(nPrev))
                continue;
              for (d = r - 1; d != 0; d--) {
                x = x.square().mod(n);
                if (x.isUnit())
                  return false;
                if (x.equals(nPrev))
                  continue next;
              }
              return false;
            }
          return true;
        }
        BigInteger.prototype.isPrime = function(strict) {
          var isPrime = isBasicPrime(this);
          if (isPrime !== undefined2)
            return isPrime;
          var n = this.abs();
          var bits = n.bitLength();
          if (bits <= 64)
            return millerRabinTest(n, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
          var logN = Math.log(2) * bits.toJSNumber();
          var t = Math.ceil(strict === true ? 2 * Math.pow(logN, 2) : logN);
          for (var a = [], i2 = 0; i2 < t; i2++) {
            a.push(bigInt8(i2 + 2));
          }
          return millerRabinTest(n, a);
        };
        NativeBigInt.prototype.isPrime = SmallInteger.prototype.isPrime = BigInteger.prototype.isPrime;
        BigInteger.prototype.isProbablePrime = function(iterations, rng) {
          var isPrime = isBasicPrime(this);
          if (isPrime !== undefined2)
            return isPrime;
          var n = this.abs();
          var t = iterations === undefined2 ? 5 : iterations;
          for (var a = [], i2 = 0; i2 < t; i2++) {
            a.push(bigInt8.randBetween(2, n.minus(2), rng));
          }
          return millerRabinTest(n, a);
        };
        NativeBigInt.prototype.isProbablePrime = SmallInteger.prototype.isProbablePrime = BigInteger.prototype.isProbablePrime;
        BigInteger.prototype.modInv = function(n) {
          var t = bigInt8.zero, newT = bigInt8.one, r = parseValue(n), newR = this.abs(), q, lastT, lastR;
          while (!newR.isZero()) {
            q = r.divide(newR);
            lastT = t;
            lastR = r;
            t = newT;
            r = newR;
            newT = lastT.subtract(q.multiply(newT));
            newR = lastR.subtract(q.multiply(newR));
          }
          if (!r.isUnit())
            throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");
          if (t.compare(0) === -1) {
            t = t.add(n);
          }
          if (this.isNegative()) {
            return t.negate();
          }
          return t;
        };
        NativeBigInt.prototype.modInv = SmallInteger.prototype.modInv = BigInteger.prototype.modInv;
        BigInteger.prototype.next = function() {
          var value = this.value;
          if (this.sign) {
            return subtractSmall(value, 1, this.sign);
          }
          return new BigInteger(addSmall(value, 1), this.sign);
        };
        SmallInteger.prototype.next = function() {
          var value = this.value;
          if (value + 1 < MAX_INT)
            return new SmallInteger(value + 1);
          return new BigInteger(MAX_INT_ARR, false);
        };
        NativeBigInt.prototype.next = function() {
          return new NativeBigInt(this.value + BigInt(1));
        };
        BigInteger.prototype.prev = function() {
          var value = this.value;
          if (this.sign) {
            return new BigInteger(addSmall(value, 1), true);
          }
          return subtractSmall(value, 1, this.sign);
        };
        SmallInteger.prototype.prev = function() {
          var value = this.value;
          if (value - 1 > -MAX_INT)
            return new SmallInteger(value - 1);
          return new BigInteger(MAX_INT_ARR, true);
        };
        NativeBigInt.prototype.prev = function() {
          return new NativeBigInt(this.value - BigInt(1));
        };
        var powersOfTwo = [1];
        while (2 * powersOfTwo[powersOfTwo.length - 1] <= BASE)
          powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
        var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];
        function shift_isSmall(n) {
          return Math.abs(n) <= BASE;
        }
        BigInteger.prototype.shiftLeft = function(v) {
          var n = parseValue(v).toJSNumber();
          if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
          }
          if (n < 0)
            return this.shiftRight(-n);
          var result = this;
          if (result.isZero())
            return result;
          while (n >= powers2Length) {
            result = result.multiply(highestPower2);
            n -= powers2Length - 1;
          }
          return result.multiply(powersOfTwo[n]);
        };
        NativeBigInt.prototype.shiftLeft = SmallInteger.prototype.shiftLeft = BigInteger.prototype.shiftLeft;
        BigInteger.prototype.shiftRight = function(v) {
          var remQuo;
          var n = parseValue(v).toJSNumber();
          if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
          }
          if (n < 0)
            return this.shiftLeft(-n);
          var result = this;
          while (n >= powers2Length) {
            if (result.isZero() || result.isNegative() && result.isUnit())
              return result;
            remQuo = divModAny(result, highestPower2);
            result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
            n -= powers2Length - 1;
          }
          remQuo = divModAny(result, powersOfTwo[n]);
          return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
        };
        NativeBigInt.prototype.shiftRight = SmallInteger.prototype.shiftRight = BigInteger.prototype.shiftRight;
        function bitwise(x, y, fn) {
          y = parseValue(y);
          var xSign = x.isNegative(), ySign = y.isNegative();
          var xRem = xSign ? x.not() : x, yRem = ySign ? y.not() : y;
          var xDigit = 0, yDigit = 0;
          var xDivMod = null, yDivMod = null;
          var result = [];
          while (!xRem.isZero() || !yRem.isZero()) {
            xDivMod = divModAny(xRem, highestPower2);
            xDigit = xDivMod[1].toJSNumber();
            if (xSign) {
              xDigit = highestPower2 - 1 - xDigit;
            }
            yDivMod = divModAny(yRem, highestPower2);
            yDigit = yDivMod[1].toJSNumber();
            if (ySign) {
              yDigit = highestPower2 - 1 - yDigit;
            }
            xRem = xDivMod[0];
            yRem = yDivMod[0];
            result.push(fn(xDigit, yDigit));
          }
          var sum2 = fn(xSign ? 1 : 0, ySign ? 1 : 0) !== 0 ? bigInt8(-1) : bigInt8(0);
          for (var i2 = result.length - 1; i2 >= 0; i2 -= 1) {
            sum2 = sum2.multiply(highestPower2).add(bigInt8(result[i2]));
          }
          return sum2;
        }
        BigInteger.prototype.not = function() {
          return this.negate().prev();
        };
        NativeBigInt.prototype.not = SmallInteger.prototype.not = BigInteger.prototype.not;
        BigInteger.prototype.and = function(n) {
          return bitwise(this, n, function(a, b) {
            return a & b;
          });
        };
        NativeBigInt.prototype.and = SmallInteger.prototype.and = BigInteger.prototype.and;
        BigInteger.prototype.or = function(n) {
          return bitwise(this, n, function(a, b) {
            return a | b;
          });
        };
        NativeBigInt.prototype.or = SmallInteger.prototype.or = BigInteger.prototype.or;
        BigInteger.prototype.xor = function(n) {
          return bitwise(this, n, function(a, b) {
            return a ^ b;
          });
        };
        NativeBigInt.prototype.xor = SmallInteger.prototype.xor = BigInteger.prototype.xor;
        var LOBMASK_I = 1 << 30, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
        function roughLOB(n) {
          var v = n.value, x = typeof v === "number" ? v | LOBMASK_I : typeof v === "bigint" ? v | BigInt(LOBMASK_I) : v[0] + v[1] * BASE | LOBMASK_BI;
          return x & -x;
        }
        function integerLogarithm(value, base) {
          if (base.compareTo(value) <= 0) {
            var tmp = integerLogarithm(value, base.square(base));
            var p = tmp.p;
            var e = tmp.e;
            var t = p.multiply(base);
            return t.compareTo(value) <= 0 ? { p: t, e: e * 2 + 1 } : { p, e: e * 2 };
          }
          return { p: bigInt8(1), e: 0 };
        }
        BigInteger.prototype.bitLength = function() {
          var n = this;
          if (n.compareTo(bigInt8(0)) < 0) {
            n = n.negate().subtract(bigInt8(1));
          }
          if (n.compareTo(bigInt8(0)) === 0) {
            return bigInt8(0);
          }
          return bigInt8(integerLogarithm(n, bigInt8(2)).e).add(bigInt8(1));
        };
        NativeBigInt.prototype.bitLength = SmallInteger.prototype.bitLength = BigInteger.prototype.bitLength;
        function max(a, b) {
          a = parseValue(a);
          b = parseValue(b);
          return a.greater(b) ? a : b;
        }
        function min(a, b) {
          a = parseValue(a);
          b = parseValue(b);
          return a.lesser(b) ? a : b;
        }
        function gcd2(a, b) {
          a = parseValue(a).abs();
          b = parseValue(b).abs();
          if (a.equals(b))
            return a;
          if (a.isZero())
            return b;
          if (b.isZero())
            return a;
          var c = Integer[1], d, t;
          while (a.isEven() && b.isEven()) {
            d = min(roughLOB(a), roughLOB(b));
            a = a.divide(d);
            b = b.divide(d);
            c = c.multiply(d);
          }
          while (a.isEven()) {
            a = a.divide(roughLOB(a));
          }
          do {
            while (b.isEven()) {
              b = b.divide(roughLOB(b));
            }
            if (a.greater(b)) {
              t = b;
              b = a;
              a = t;
            }
            b = b.subtract(a);
          } while (!b.isZero());
          return c.isUnit() ? a : a.multiply(c);
        }
        function lcm2(a, b) {
          a = parseValue(a).abs();
          b = parseValue(b).abs();
          return a.divide(gcd2(a, b)).multiply(b);
        }
        function randBetween(a, b, rng) {
          a = parseValue(a);
          b = parseValue(b);
          var usedRNG = rng || Math.random;
          var low = min(a, b), high = max(a, b);
          var range = high.subtract(low).add(1);
          if (range.isSmall)
            return low.add(Math.floor(usedRNG() * range));
          var digits = toBase(range, BASE).value;
          var result = [], restricted = true;
          for (var i2 = 0; i2 < digits.length; i2++) {
            var top = restricted ? digits[i2] + (i2 + 1 < digits.length ? digits[i2 + 1] / BASE : 0) : BASE;
            var digit = truncate(usedRNG() * top);
            result.push(digit);
            if (digit < digits[i2])
              restricted = false;
          }
          return low.add(Integer.fromArray(result, BASE, false));
        }
        var parseBase = function(text, base, alphabet, caseSensitive) {
          alphabet = alphabet || DEFAULT_ALPHABET;
          text = String(text);
          if (!caseSensitive) {
            text = text.toLowerCase();
            alphabet = alphabet.toLowerCase();
          }
          var length2 = text.length;
          var i2;
          var absBase = Math.abs(base);
          var alphabetValues = {};
          for (i2 = 0; i2 < alphabet.length; i2++) {
            alphabetValues[alphabet[i2]] = i2;
          }
          for (i2 = 0; i2 < length2; i2++) {
            var c = text[i2];
            if (c === "-")
              continue;
            if (c in alphabetValues) {
              if (alphabetValues[c] >= absBase) {
                if (c === "1" && absBase === 1)
                  continue;
                throw new Error(c + " is not a valid digit in base " + base + ".");
              }
            }
          }
          base = parseValue(base);
          var digits = [];
          var isNegative = text[0] === "-";
          for (i2 = isNegative ? 1 : 0; i2 < text.length; i2++) {
            var c = text[i2];
            if (c in alphabetValues)
              digits.push(parseValue(alphabetValues[c]));
            else if (c === "<") {
              var start = i2;
              do {
                i2++;
              } while (text[i2] !== ">" && i2 < text.length);
              digits.push(parseValue(text.slice(start + 1, i2)));
            } else
              throw new Error(c + " is not a valid character");
          }
          return parseBaseFromArray(digits, base, isNegative);
        };
        function parseBaseFromArray(digits, base, isNegative) {
          var val = Integer[0], pow = Integer[1], i2;
          for (i2 = digits.length - 1; i2 >= 0; i2--) {
            val = val.add(digits[i2].times(pow));
            pow = pow.times(base);
          }
          return isNegative ? val.negate() : val;
        }
        function stringify(digit, alphabet) {
          alphabet = alphabet || DEFAULT_ALPHABET;
          if (digit < alphabet.length) {
            return alphabet[digit];
          }
          return "<" + digit + ">";
        }
        function toBase(n, base) {
          base = bigInt8(base);
          if (base.isZero()) {
            if (n.isZero())
              return { value: [0], isNegative: false };
            throw new Error("Cannot convert nonzero numbers to base 0.");
          }
          if (base.equals(-1)) {
            if (n.isZero())
              return { value: [0], isNegative: false };
            if (n.isNegative())
              return {
                value: [].concat.apply([], Array.apply(null, Array(-n.toJSNumber())).map(Array.prototype.valueOf, [1, 0])),
                isNegative: false
              };
            var arr = Array.apply(null, Array(n.toJSNumber() - 1)).map(Array.prototype.valueOf, [0, 1]);
            arr.unshift([1]);
            return {
              value: [].concat.apply([], arr),
              isNegative: false
            };
          }
          var neg = false;
          if (n.isNegative() && base.isPositive()) {
            neg = true;
            n = n.abs();
          }
          if (base.isUnit()) {
            if (n.isZero())
              return { value: [0], isNegative: false };
            return {
              value: Array.apply(null, Array(n.toJSNumber())).map(Number.prototype.valueOf, 1),
              isNegative: neg
            };
          }
          var out = [];
          var left = n, divmod;
          while (left.isNegative() || left.compareAbs(base) >= 0) {
            divmod = left.divmod(base);
            left = divmod.quotient;
            var digit = divmod.remainder;
            if (digit.isNegative()) {
              digit = base.minus(digit).abs();
              left = left.next();
            }
            out.push(digit.toJSNumber());
          }
          out.push(left.toJSNumber());
          return { value: out.reverse(), isNegative: neg };
        }
        function toBaseString(n, base, alphabet) {
          var arr = toBase(n, base);
          return (arr.isNegative ? "-" : "") + arr.value.map(function(x) {
            return stringify(x, alphabet);
          }).join("");
        }
        BigInteger.prototype.toArray = function(radix) {
          return toBase(this, radix);
        };
        SmallInteger.prototype.toArray = function(radix) {
          return toBase(this, radix);
        };
        NativeBigInt.prototype.toArray = function(radix) {
          return toBase(this, radix);
        };
        BigInteger.prototype.toString = function(radix, alphabet) {
          if (radix === undefined2)
            radix = 10;
          if (radix !== 10)
            return toBaseString(this, radix, alphabet);
          var v = this.value, l = v.length, str = String(v[--l]), zeros = "0000000", digit;
          while (--l >= 0) {
            digit = String(v[l]);
            str += zeros.slice(digit.length) + digit;
          }
          var sign2 = this.sign ? "-" : "";
          return sign2 + str;
        };
        SmallInteger.prototype.toString = function(radix, alphabet) {
          if (radix === undefined2)
            radix = 10;
          if (radix != 10)
            return toBaseString(this, radix, alphabet);
          return String(this.value);
        };
        NativeBigInt.prototype.toString = SmallInteger.prototype.toString;
        NativeBigInt.prototype.toJSON = BigInteger.prototype.toJSON = SmallInteger.prototype.toJSON = function() {
          return this.toString();
        };
        BigInteger.prototype.valueOf = function() {
          return parseInt(this.toString(), 10);
        };
        BigInteger.prototype.toJSNumber = BigInteger.prototype.valueOf;
        SmallInteger.prototype.valueOf = function() {
          return this.value;
        };
        SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;
        NativeBigInt.prototype.valueOf = NativeBigInt.prototype.toJSNumber = function() {
          return parseInt(this.toString(), 10);
        };
        function parseStringValue(v) {
          if (isPrecise(+v)) {
            var x = +v;
            if (x === truncate(x))
              return supportsNativeBigInt ? new NativeBigInt(BigInt(x)) : new SmallInteger(x);
            throw new Error("Invalid integer: " + v);
          }
          var sign2 = v[0] === "-";
          if (sign2)
            v = v.slice(1);
          var split = v.split(/e/i);
          if (split.length > 2)
            throw new Error("Invalid integer: " + split.join("e"));
          if (split.length === 2) {
            var exp = split[1];
            if (exp[0] === "+")
              exp = exp.slice(1);
            exp = +exp;
            if (exp !== truncate(exp) || !isPrecise(exp))
              throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
            var text = split[0];
            var decimalPlace = text.indexOf(".");
            if (decimalPlace >= 0) {
              exp -= text.length - decimalPlace - 1;
              text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
            }
            if (exp < 0)
              throw new Error("Cannot include negative exponent part for integers");
            text += new Array(exp + 1).join("0");
            v = text;
          }
          var isValid = /^([0-9][0-9]*)$/.test(v);
          if (!isValid)
            throw new Error("Invalid integer: " + v);
          if (supportsNativeBigInt) {
            return new NativeBigInt(BigInt(sign2 ? "-" + v : v));
          }
          var r = [], max2 = v.length, l = LOG_BASE, min2 = max2 - l;
          while (max2 > 0) {
            r.push(+v.slice(min2, max2));
            min2 -= l;
            if (min2 < 0)
              min2 = 0;
            max2 -= l;
          }
          trim(r);
          return new BigInteger(r, sign2);
        }
        function parseNumberValue(v) {
          if (supportsNativeBigInt) {
            return new NativeBigInt(BigInt(v));
          }
          if (isPrecise(v)) {
            if (v !== truncate(v))
              throw new Error(v + " is not an integer.");
            return new SmallInteger(v);
          }
          return parseStringValue(v.toString());
        }
        function parseValue(v) {
          if (typeof v === "number") {
            return parseNumberValue(v);
          }
          if (typeof v === "string") {
            return parseStringValue(v);
          }
          if (typeof v === "bigint") {
            return new NativeBigInt(v);
          }
          return v;
        }
        for (var i = 0; i < 1e3; i++) {
          Integer[i] = parseValue(i);
          if (i > 0)
            Integer[-i] = parseValue(-i);
        }
        Integer.one = Integer[1];
        Integer.zero = Integer[0];
        Integer.minusOne = Integer[-1];
        Integer.max = max;
        Integer.min = min;
        Integer.gcd = gcd2;
        Integer.lcm = lcm2;
        Integer.isInstance = function(x) {
          return x instanceof BigInteger || x instanceof SmallInteger || x instanceof NativeBigInt;
        };
        Integer.randBetween = randBetween;
        Integer.fromArray = function(digits, base, isNegative) {
          return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
        };
        return Integer;
      }();
      if (typeof module !== "undefined" && module.hasOwnProperty("exports")) {
        module.exports = bigInt8;
      }
      if (typeof define === "function" && define.amd) {
        define(function() {
          return bigInt8;
        });
      }
    }
  });

  // bazel-out/k8-fastbuild/bin/runtime/defs.js
  var import_big_integer7 = __toModule(require_BigInteger());

  // bazel-out/k8-fastbuild/bin/sources/bignum.js
  var import_big_integer6 = __toModule(require_BigInteger());

  // bazel-out/k8-fastbuild/bin/runtime/mcmp.js
  var import_big_integer = __toModule(require_BigInteger());
  function mcmp(a, b) {
    return a.compare(b);
  }

  // bazel-out/k8-fastbuild/bin/runtime/find.js
  function Find(p, q) {
    if (equal(p, q)) {
      return true;
    }
    if (istensor(p)) {
      for (let i = 0; i < p.tensor.nelem; i++) {
        if (Find(p.tensor.elem[i], q)) {
          return true;
        }
      }
      return false;
    }
    if (iscons(p)) {
      return [...p].some((p1) => Find(p1, q));
    }
    return false;
  }
  function findPossibleClockForm(p, p1) {
    if (isimaginaryunit(p)) {
      return false;
    }
    if (ispower(p) && !isinteger(caddr(p1))) {
      if (Find(cadr(p), Constants.imaginaryunit)) {
        return true;
      }
    }
    if (ispower(p) && equaln(cadr(p), -1) && !isinteger(caddr(p1))) {
      return true;
    }
    if (istensor(p)) {
      for (let i = 0; i < p.tensor.nelem; i++) {
        if (findPossibleClockForm(p.tensor.elem[i], p1)) {
          return true;
        }
      }
      return false;
    }
    if (iscons(p)) {
      return [...p].some((el) => findPossibleClockForm(el, p1));
    }
    return false;
  }
  function findPossibleExponentialForm(p) {
    if (ispower(p) && cadr(p) === symbol(E)) {
      return Find(caddr(p), Constants.imaginaryunit);
    }
    if (istensor(p)) {
      for (let i = 0; i < p.tensor.nelem; i++) {
        if (findPossibleExponentialForm(p.tensor.elem[i])) {
          return true;
        }
      }
      return false;
    }
    if (iscons(p)) {
      return [...p].some(findPossibleExponentialForm);
    }
    return false;
  }

  // bazel-out/k8-fastbuild/bin/sources/index.js
  function index_function(p1, indices) {
    const { ndim } = p1.tensor;
    const m = indices.length;
    if (m > ndim) {
      stop("too many indices for tensor");
    }
    let k = 0;
    for (let i = 0; i < m; i++) {
      const t = nativeInt(indices[i]);
      if (t < 1 || t > p1.tensor.dim[i]) {
        stop("index out of range");
      }
      k = k * p1.tensor.dim[i] + t - 1;
    }
    if (ndim === m) {
      return p1.tensor.elem[k];
    }
    k = p1.tensor.dim.slice(m).reduce((a, b) => a * b, k);
    const nelem = p1.tensor.dim.slice(m).reduce((a, b) => a * b, 1);
    const p2 = alloc_tensor(nelem);
    p2.tensor.ndim = ndim - m;
    p2.tensor.dim = p1.tensor.dim.slice(m);
    for (let i = 0; i < nelem; i++) {
      p2.tensor.elem[i] = p1.tensor.elem[k + i];
    }
    check_tensor_dimensions(p1);
    check_tensor_dimensions(p2);
    return p2;
  }
  function set_component(RVALUE, ...args) {
    if (args.length < 2) {
      stop("error in indexed assign");
    }
    let [LVALUE, ...indices] = args;
    if (!istensor(LVALUE)) {
      stop("error in indexed assign: assigning to something that is not a tensor");
    }
    const { ndim } = LVALUE.tensor;
    const m = indices.length;
    if (m > ndim) {
      stop("error in indexed assign");
    }
    let k = 0;
    for (let i = 0; i < m; i++) {
      const t = nativeInt(indices[i]);
      if (t < 1 || t > LVALUE.tensor.dim[i]) {
        stop("error in indexed assign\n");
      }
      k = k * LVALUE.tensor.dim[i] + t - 1;
    }
    for (let i = m; i < ndim; i++) {
      k = k * LVALUE.tensor.dim[i] + 0;
    }
    const TMP = alloc_tensor(LVALUE.tensor.nelem);
    TMP.tensor.ndim = LVALUE.tensor.ndim;
    TMP.tensor.dim = Array.from(LVALUE.tensor.dim);
    TMP.tensor.elem = Array.from(LVALUE.tensor.elem);
    check_tensor_dimensions(LVALUE);
    check_tensor_dimensions(TMP);
    LVALUE = TMP;
    if (ndim === m) {
      if (istensor(RVALUE)) {
        stop("error in indexed assign");
      }
      LVALUE.tensor.elem[k] = RVALUE;
      check_tensor_dimensions(LVALUE);
      return LVALUE;
    }
    if (!istensor(RVALUE)) {
      stop("error in indexed assign");
    }
    if (ndim - m !== RVALUE.tensor.ndim) {
      stop("error in indexed assign");
    }
    for (let i = 0; i < RVALUE.tensor.ndim; i++) {
      if (LVALUE.tensor.dim[m + i] !== RVALUE.tensor.dim[i]) {
        stop("error in indexed assign");
      }
    }
    for (let i = 0; i < RVALUE.tensor.nelem; i++) {
      LVALUE.tensor.elem[k + i] = RVALUE.tensor.elem[i];
    }
    check_tensor_dimensions(LVALUE);
    check_tensor_dimensions(RVALUE);
    return LVALUE;
  }

  // bazel-out/k8-fastbuild/bin/sources/list.js
  function makeList(...items) {
    let node = symbol(NIL);
    for (let i = items.length - 1; i >= 0; i--) {
      node = new Cons(items[i], node);
    }
    return node;
  }

  // bazel-out/k8-fastbuild/bin/sources/define.js
  function define_user_function(p1) {
    const F = caadr(p1);
    const A = cdadr(p1);
    let B = caddr(p1);
    if (!issymbol(F)) {
      stop("function name?");
    }
    if (car(B) === symbol(EVAL)) {
      B = Eval(cadr(B));
    }
    B = makeList(symbol(FUNCTION), B, A);
    set_binding(F, B);
    return symbol(NIL);
  }
  function Eval_function_reference(p1) {
    return p1;
  }

  // bazel-out/k8-fastbuild/bin/sources/lcm.js
  function Eval_lcm(p1) {
    p1 = cdr(p1);
    let result = Eval(car(p1));
    if (iscons(p1)) {
      result = p1.tail().reduce((a, b) => lcm(a, Eval(b)), result);
    }
    return result;
  }
  function lcm(p1, p2) {
    return doexpand(yylcm, p1, p2);
  }
  function yylcm(p1, p2) {
    return inverse(divide(divide(gcd(p1, p2), p1), p2));
  }

  // bazel-out/k8-fastbuild/bin/sources/filter.js
  function Eval_filter(p1) {
    p1 = cdr(p1);
    let result = Eval(car(p1));
    if (iscons(p1)) {
      result = p1.tail().reduce((acc, p) => filter(acc, Eval(p)), result);
    }
    return result;
  }
  function filter(F, X) {
    return filter_main(F, X);
  }
  function filter_main(F, X) {
    if (isadd(F)) {
      return filter_sum(F, X);
    }
    if (istensor(F)) {
      return filter_tensor(F, X);
    }
    if (Find(F, X)) {
      return Constants.zero;
    }
    return F;
  }
  function filter_sum(F, X) {
    return iscons(F) ? F.tail().reduce((a, b) => add(a, filter(b, X)), Constants.zero) : Constants.zero;
  }
  function filter_tensor(F, X) {
    const n = F.tensor.nelem;
    const p3 = alloc_tensor(n);
    p3.tensor.ndim = F.tensor.ndim;
    p3.tensor.dim = Array.from(F.tensor.dim);
    p3.tensor.elem = F.tensor.elem.map((el) => filter(el, X));
    return p3;
  }

  // bazel-out/k8-fastbuild/bin/sources/subst.js
  function subst(expr, oldExpr, newExpr) {
    if (oldExpr === symbol(NIL) || newExpr === symbol(NIL)) {
      return expr;
    }
    if (istensor(expr)) {
      const p4 = alloc_tensor(expr.tensor.nelem);
      p4.tensor.ndim = expr.tensor.ndim;
      p4.tensor.dim = Array.from(expr.tensor.dim);
      p4.tensor.elem = expr.tensor.elem.map((el) => {
        const result = subst(el, oldExpr, newExpr);
        check_tensor_dimensions(p4);
        return result;
      });
      return p4;
    }
    if (equal(expr, oldExpr)) {
      return newExpr;
    }
    if (iscons(expr)) {
      return new Cons(subst(car(expr), oldExpr, newExpr), subst(cdr(expr), oldExpr, newExpr));
    }
    return expr;
  }

  // bazel-out/k8-fastbuild/bin/sources/coeff.js
  function Eval_coeff(p1) {
    let N2 = Eval(cadddr(p1));
    let X = Eval(caddr(p1));
    const P = Eval(cadr(p1));
    if (N2 === symbol(NIL)) {
      N2 = X;
      X = symbol(SYMBOL_X);
    }
    return filter(divide(P, power(X, N2)), X);
  }
  function coeff(p, x) {
    const coefficients = [];
    while (true) {
      const c = Eval(subst(p, x, Constants.zero));
      coefficients.push(c);
      p = subtract(p, c);
      if (equal(p, Constants.zero)) {
        return coefficients;
      }
      p = doexpand(divide, p, x);
    }
  }

  // bazel-out/k8-fastbuild/bin/sources/clock.js
  var DEBUG_CLOCKFORM = false;
  function Eval_clock(p1) {
    return clockform(Eval(cadr(p1)));
  }
  function clockform(p1) {
    const l = makeList(symbol(POWER), Constants.negOne, divide(arg(p1), Constants.Pi()));
    const multiplied = multiply(abs(p1), l);
    if (DEBUG_CLOCKFORM) {
      console.log(`clockform: abs of ${p1} : ${abs(p1)}`);
      console.log(`clockform: arg of ${p1} : ${arg(p1)}`);
      console.log(`clockform: divide : ${divide(arg(p1), Constants.Pi())}`);
      console.log(`clockform: power : ${l}`);
      console.log(`clockform: multiply : ${multiplied}`);
    }
    return multiplied;
  }

  // bazel-out/k8-fastbuild/bin/sources/polar.js
  function Eval_polar(p1) {
    return polar(Eval(cadr(p1)));
  }
  function polar(p1) {
    return evalPolar(() => {
      return multiply(abs(p1), exponential(multiply(Constants.imaginaryunit, arg(p1))));
    });
  }

  // bazel-out/k8-fastbuild/bin/sources/conj.js
  function Eval_conj(p1) {
    p1 = Eval(cadr(p1));
    if (!Find(p1, Constants.imaginaryunit)) {
      return clockform(conjugate(polar(p1)));
    } else {
      return conjugate(p1);
    }
  }
  function conjugate(p1) {
    return Eval(subst(p1, Constants.imaginaryunit, negate(Constants.imaginaryunit)));
  }

  // bazel-out/k8-fastbuild/bin/sources/guess.js
  function guess(p) {
    if (Find(p, symbol(SYMBOL_X))) {
      return symbol(SYMBOL_X);
    } else if (Find(p, symbol(SYMBOL_Y))) {
      return symbol(SYMBOL_Y);
    } else if (Find(p, symbol(SYMBOL_Z))) {
      return symbol(SYMBOL_Z);
    } else if (Find(p, symbol(SYMBOL_T))) {
      return symbol(SYMBOL_T);
    } else if (Find(p, symbol(SYMBOL_S))) {
      return symbol(SYMBOL_S);
    } else {
      return symbol(SYMBOL_X);
    }
  }

  // bazel-out/k8-fastbuild/bin/sources/pollard.js
  var import_big_integer3 = __toModule(require_BigInteger());

  // bazel-out/k8-fastbuild/bin/sources/madd.js
  function madd(a, b) {
    return a.add(b);
  }
  function msub(a, b) {
    return a.subtract(b);
  }

  // bazel-out/k8-fastbuild/bin/sources/mgcd.js
  var import_big_integer2 = __toModule(require_BigInteger());
  function mgcd(u, v) {
    return import_big_integer2.default.gcd(u, v);
  }

  // bazel-out/k8-fastbuild/bin/sources/mmul.js
  function mmul(a, b) {
    return a.multiply(b);
  }
  function mdiv(a, b) {
    return a.divide(b);
  }
  function mmod(a, b) {
    return a.mod(b);
  }
  function mdivrem(a, b) {
    const toReturn = a.divmod(b);
    return [toReturn.quotient, toReturn.remainder];
  }

  // bazel-out/k8-fastbuild/bin/sources/mprime.js
  function mprime(n) {
    return n.isProbablePrime();
  }

  // bazel-out/k8-fastbuild/bin/sources/pollard.js
  var n_factor_number = (0, import_big_integer3.default)(0);
  function factor_number(p1) {
    if (equaln(p1, 0) || equaln(p1, 1) || equaln(p1, -1)) {
      return p1;
    }
    n_factor_number = p1.q.a;
    const factors2 = factor_a();
    if (factors2.length == 1) {
      return factors2[0];
    }
    return makeList(symbol(MULTIPLY), ...factors2);
  }
  function factor_a() {
    const result = [];
    if (n_factor_number.isNegative()) {
      n_factor_number = setSignTo(n_factor_number, 1);
      result.push(Constants.negOne);
    }
    for (let k = 0; k < 1e4; k++) {
      result.push(...try_kth_prime(k));
      if (n_factor_number.compare(1) === 0) {
        return result;
      }
    }
    result.push(...factor_b());
    return result;
  }
  function try_kth_prime(k) {
    const result = [];
    let q;
    const d = mint(primetab[k]);
    let count2 = 0;
    while (true) {
      if (n_factor_number.compare(1) === 0) {
        if (count2) {
          result.push(_factor(d, count2));
        }
        return result;
      }
      let r;
      [q, r] = Array.from(mdivrem(n_factor_number, d));
      if (r.isZero()) {
        count2++;
        n_factor_number = q;
      } else {
        break;
      }
    }
    if (count2) {
      result.push(_factor(d, count2));
    }
    if (mcmp(q, d) === -1) {
      result.push(_factor(n_factor_number, 1));
      n_factor_number = mint(1);
    }
    return result;
  }
  function factor_b() {
    const result = [];
    const bigint_one = mint(1);
    let x = mint(5);
    let xprime = mint(2);
    let k = 1;
    let l = 1;
    while (true) {
      if (mprime(n_factor_number)) {
        result.push(_factor(n_factor_number, 1));
        return result;
      }
      while (true) {
        if (defs.esc_flag) {
          stop("esc");
        }
        let t = msub(xprime, x);
        t = setSignTo(t, 1);
        const g = mgcd(t, n_factor_number);
        if (MEQUAL(g, 1)) {
          if (--k === 0) {
            xprime = x;
            l *= 2;
            k = l;
          }
          t = mmul(x, x);
          x = madd(t, bigint_one);
          t = mmod(x, n_factor_number);
          x = t;
          continue;
        }
        result.push(_factor(g, 1));
        if (mcmp(g, n_factor_number) === 0) {
          return result;
        }
        t = mdiv(n_factor_number, g);
        n_factor_number = t;
        t = mmod(x, n_factor_number);
        x = t;
        t = mmod(xprime, n_factor_number);
        xprime = t;
        break;
      }
    }
  }
  function _factor(d, count2) {
    let factor2 = new Num(d);
    if (count2 > 1) {
      factor2 = makeList(symbol(POWER), factor2, new Num(mint(count2)));
    }
    return factor2;
  }

  // bazel-out/k8-fastbuild/bin/sources/factor.js
  function Eval_factor(p1) {
    const top = Eval(cadr(p1));
    const p2 = Eval(caddr(p1));
    const variable = p2 === symbol(NIL) ? guess(top) : p2;
    let temp = factor(top, variable);
    p1 = cdddr(p1);
    if (iscons(p1)) {
      temp = [...p1].reduce((acc, p) => factor_again(acc, Eval(p)), temp);
    }
    return temp;
  }
  function factor_again(p1, p2) {
    if (ismultiply(p1)) {
      const arr2 = [];
      p1.tail().forEach((el) => factor_term(arr2, el, p2));
      return multiply_all_noexpand(arr2);
    }
    const arr = [];
    factor_term(arr, p1, p2);
    return arr[0];
  }
  function factor_term(arr, arg1, arg2) {
    const p1 = factorpoly(arg1, arg2);
    if (ismultiply(p1)) {
      arr.push(...p1.tail());
      return;
    }
    arr.push(p1);
  }
  function factor(p1, p2) {
    if (isinteger(p1)) {
      return factor_number(p1);
    }
    return factorpoly(p1, p2);
  }
  function factor_small_number(n) {
    if (isNaN(n)) {
      stop("number too big to factor");
    }
    const arr = [];
    if (n < 0) {
      n = -n;
    }
    for (let i = 0; i < MAXPRIMETAB; i++) {
      const d = primetab[i];
      if (d > n / d) {
        break;
      }
      let expo = 0;
      while (n % d === 0) {
        n /= d;
        expo++;
      }
      if (expo) {
        arr.push(integer(d));
        arr.push(integer(expo));
      }
    }
    if (n > 1) {
      arr.push(integer(n));
      arr.push(Constants.one);
    }
    return arr;
  }

  // bazel-out/k8-fastbuild/bin/sources/divisors.js
  function divisors(p) {
    const values = ydivisors(p);
    const n = values.length;
    values.sort(cmp_expr);
    const p1 = alloc_tensor(n);
    p1.tensor.ndim = 1;
    p1.tensor.dim[0] = n;
    p1.tensor.elem = values;
    return p1;
  }
  var flatten = (arr) => [].concat(...arr);
  function ydivisors(p1) {
    const stack = [];
    if (isNumericAtom(p1)) {
      stack.push(...factor_small_number(nativeInt(p1)));
    } else if (isadd(p1)) {
      stack.push(...__factor_add(p1));
    } else if (ismultiply(p1)) {
      p1 = cdr(p1);
      if (isNumericAtom(car(p1))) {
        stack.push(...factor_small_number(nativeInt(car(p1))));
        p1 = cdr(p1);
      }
      if (iscons(p1)) {
        const mapped = [...p1].map((p2) => {
          if (ispower(p2)) {
            return [cadr(p2), caddr(p2)];
          }
          return [p2, Constants.one];
        });
        stack.push(...flatten(mapped));
      }
    } else if (ispower(p1)) {
      stack.push(cadr(p1), caddr(p1));
    } else {
      stack.push(p1, Constants.one);
    }
    const k = stack.length;
    stack.push(Constants.one);
    gen(stack, 0, k);
    return stack.slice(k);
  }
  function gen(stack, h, k) {
    const ACCUM = stack.pop();
    if (h === k) {
      stack.push(ACCUM);
      return;
    }
    const BASE = stack[h + 0];
    const EXPO = stack[h + 1];
    const expo = nativeInt(EXPO);
    if (!isNaN(expo)) {
      for (let i = 0; i <= Math.abs(expo); i++) {
        stack.push(multiply(ACCUM, power(BASE, integer(sign(expo) * i))));
        gen(stack, h + 2, k);
      }
    }
  }
  function __factor_add(p1) {
    const temp1 = iscons(p1) ? p1.tail().reduce(gcd) : car(p1);
    const stack = [];
    let p2 = temp1;
    if (isplusone(p2)) {
      stack.push(p1, Constants.one);
      return stack;
    }
    if (isNumericAtom(p2)) {
      stack.push(...factor_small_number(nativeInt(p2)));
    } else if (ismultiply(p2)) {
      let p3 = cdr(p2);
      if (isNumericAtom(car(p3))) {
        stack.push(...factor_small_number(nativeInt(car(p3))));
      } else {
        stack.push(car(p3), Constants.one);
      }
      if (iscons(p3)) {
        p3.tail().forEach((p) => stack.push(p, Constants.one));
      }
    } else {
      stack.push(p2, Constants.one);
    }
    p2 = inverse(p2);
    const temp2 = iscons(p1) ? p1.tail().reduce((a, b) => add(a, multiply(p2, b)), Constants.zero) : cdr(p1);
    stack.push(temp2, Constants.one);
    return stack;
  }

  // bazel-out/k8-fastbuild/bin/sources/quotient.js
  function Eval_quotient(p1) {
    const DIVIDEND = Eval(cadr(p1));
    const DIVISOR = Eval(caddr(p1));
    let X = Eval(cadddr(p1));
    if (X === symbol(NIL)) {
      X = symbol(SYMBOL_X);
    }
    return divpoly(DIVIDEND, DIVISOR, X);
  }
  function divpoly(DIVIDEND, DIVISOR, X) {
    const dividendCs = coeff(DIVIDEND, X);
    let m = dividendCs.length - 1;
    const divisorCs = coeff(DIVISOR, X);
    const n = divisorCs.length - 1;
    let x = m - n;
    let QUOTIENT2 = Constants.zero;
    while (x >= 0) {
      const Q = divide(dividendCs[m], divisorCs[n]);
      for (let i = 0; i <= n; i++) {
        dividendCs[x + i] = subtract(dividendCs[x + i], multiply(divisorCs[i], Q));
      }
      QUOTIENT2 = add(QUOTIENT2, multiply(Q, power(X, integer(x))));
      m--;
      x--;
    }
    return QUOTIENT2;
  }

  // bazel-out/k8-fastbuild/bin/sources/sin.js
  function Eval_sin(p1) {
    return sine(Eval(cadr(p1)));
  }
  function sine(p1) {
    if (isadd(p1)) {
      return sine_of_angle_sum(p1);
    }
    return sine_of_angle(p1);
  }
  function sine_of_angle_sum(p1) {
    let p2 = cdr(p1);
    while (iscons(p2)) {
      const B = car(p2);
      if (isnpi(B)) {
        const A = subtract(p1, B);
        return add(multiply(sine(A), cosine(B)), multiply(cosine(A), sine(B)));
      }
      p2 = cdr(p2);
    }
    return sine_of_angle(p1);
  }
  function sine_of_angle(p1) {
    if (car(p1) === symbol(ARCSIN)) {
      return cadr(p1);
    }
    if (isdouble(p1)) {
      let d = Math.sin(p1.d);
      if (Math.abs(d) < 1e-10) {
        d = 0;
      }
      return double(d);
    }
    if (isnegative(p1)) {
      return negate(sine(negate(p1)));
    }
    if (car(p1) === symbol(ARCTAN)) {
      return multiply(cadr(p1), power(add(Constants.one, power(cadr(p1), integer(2))), rational(-1, 2)));
    }
    const n = nativeInt(divide(multiply(p1, integer(180)), Constants.Pi()));
    if (n < 0 || isNaN(n)) {
      return makeList(symbol(SIN), p1);
    }
    switch (n % 360) {
      case 0:
      case 180:
        return Constants.zero;
      case 30:
      case 150:
        return rational(1, 2);
      case 210:
      case 330:
        return rational(-1, 2);
      case 45:
      case 135:
        return multiply(rational(1, 2), power(integer(2), rational(1, 2)));
      case 225:
      case 315:
        return multiply(rational(-1, 2), power(integer(2), rational(1, 2)));
      case 60:
      case 120:
        return multiply(rational(1, 2), power(integer(3), rational(1, 2)));
      case 240:
      case 300:
        return multiply(rational(-1, 2), power(integer(3), rational(1, 2)));
      case 90:
        return Constants.one;
      case 270:
        return Constants.negOne;
      default:
        return makeList(symbol(SIN), p1);
    }
  }

  // bazel-out/k8-fastbuild/bin/sources/cos.js
  function Eval_cos(p1) {
    return cosine(Eval(cadr(p1)));
  }
  function cosine(p1) {
    if (isadd(p1)) {
      return cosine_of_angle_sum(p1);
    }
    return cosine_of_angle(p1);
  }
  function cosine_of_angle_sum(p1) {
    if (iscons(p1)) {
      for (const B of p1.tail()) {
        if (isnpi(B)) {
          const A = subtract(p1, B);
          return subtract(multiply(cosine(A), cosine(B)), multiply(sine(A), sine(B)));
        }
      }
    }
    return cosine_of_angle(p1);
  }
  function cosine_of_angle(p1) {
    if (car(p1) === symbol(ARCCOS)) {
      return cadr(p1);
    }
    if (isdouble(p1)) {
      let d = Math.cos(p1.d);
      if (Math.abs(d) < 1e-10) {
        d = 0;
      }
      return double(d);
    }
    if (isnegative(p1)) {
      p1 = negate(p1);
    }
    if (car(p1) === symbol(ARCTAN)) {
      const base = add(Constants.one, power(cadr(p1), integer(2)));
      return power(base, rational(-1, 2));
    }
    const n = nativeInt(divide(multiply(p1, integer(180)), Constants.Pi()));
    if (n < 0 || isNaN(n)) {
      return makeList(symbol(COS), p1);
    }
    switch (n % 360) {
      case 90:
      case 270:
        return Constants.zero;
      case 60:
      case 300:
        return rational(1, 2);
      case 120:
      case 240:
        return rational(-1, 2);
      case 45:
      case 315:
        return multiply(rational(1, 2), power(integer(2), rational(1, 2)));
      case 135:
      case 225:
        return multiply(rational(-1, 2), power(integer(2), rational(1, 2)));
      case 30:
      case 330:
        return multiply(rational(1, 2), power(integer(3), rational(1, 2)));
      case 150:
      case 210:
        return multiply(rational(-1, 2), power(integer(3), rational(1, 2)));
      case 0:
        return Constants.one;
      case 180:
        return Constants.negOne;
      default:
        return makeList(symbol(COS), p1);
    }
  }

  // bazel-out/k8-fastbuild/bin/sources/rect.js
  var DEBUG_RECT = false;
  function Eval_rect(p1) {
    return rect(Eval(cadr(p1)));
  }
  function rect(p1) {
    const input = p1;
    if (DEBUG_RECT) {
      console.log(`RECT of ${input}`);
      console.log(`any clock forms in : ${input} ? ${findPossibleClockForm(input, p1)}`);
    }
    if (issymbol(p1)) {
      if (DEBUG_RECT) {
        console.log(` rect: simple symbol: ${input}`);
      }
      if (!isZeroAtomOrTensor(get_binding(symbol(ASSUME_REAL_VARIABLES)))) {
        return p1;
      }
      return makeList(symbol(YYRECT), p1);
    }
    if (!isZeroAtomOrTensor(get_binding(symbol(ASSUME_REAL_VARIABLES))) && !findPossibleExponentialForm(p1) && !findPossibleClockForm(p1, p1) && !(Find(p1, symbol(SIN)) && Find(p1, symbol(COS)) && Find(p1, Constants.imaginaryunit))) {
      if (DEBUG_RECT) {
        console.log(` rect: simple symbol: ${input}`);
      }
      return p1;
    }
    if (ismultiply(p1) && isimaginaryunit(cadr(p1)) && !isZeroAtomOrTensor(get_binding(symbol(ASSUME_REAL_VARIABLES)))) {
      return p1;
    }
    if (isadd(p1)) {
      if (DEBUG_RECT) {
        console.log(` rect - ${input} is a sum `);
      }
      return p1.tail().reduce((a, b) => add(a, rect(b)), Constants.zero);
    }
    const result = multiply(abs(p1), add(cosine(arg(p1)), multiply(Constants.imaginaryunit, sine(arg(p1)))));
    if (DEBUG_RECT) {
      console.log(` rect - ${input} is NOT a sum `);
      console.log(` rect - ${input} abs: ${abs(p1)}`);
      console.log(` rect - ${input} arg of ${p1} : ${p1}`);
      console.log(` rect - ${input} cosine: ${cosine(arg(p1))}`);
      console.log(` rect - ${input} sine: ${sine(arg(p1))}`);
      console.log(` rect - ${input} i * sine: ${multiply(Constants.imaginaryunit, sine(arg(p1)))}`);
      console.log(` rect - ${input} cos + i * sine: ${add(cosine(arg(p1)), multiply(Constants.imaginaryunit, sine(arg(p1))))}`);
      console.log(`rect of ${input} : ${result}`);
    }
    return result;
  }

  // bazel-out/k8-fastbuild/bin/sources/factorpoly.js
  function factorpoly(POLY, X) {
    if (!Find(POLY, X)) {
      return POLY;
    }
    if (!ispolyexpandedform(POLY, X)) {
      return POLY;
    }
    if (!issymbol(X)) {
      return POLY;
    }
    return yyfactorpoly(POLY, X);
  }
  function yyfactorpoly(p1, p2) {
    let p4, p5, p8;
    let prev_expanding;
    if (isfloating(p1)) {
      stop("floating point numbers in polynomial");
    }
    const polycoeff = coeff(p1, p2);
    let factpoly_expo = polycoeff.length - 1;
    let p7 = rationalize_coefficients(polycoeff);
    let whichRootsAreWeFinding = "real";
    let remainingPoly = null;
    while (factpoly_expo > 0) {
      var foundComplexRoot, foundRealRoot;
      if (isZeroAtomOrTensor(polycoeff[0])) {
        p4 = Constants.one;
        p5 = Constants.zero;
      } else {
        if (whichRootsAreWeFinding === "real") {
          [foundRealRoot, p4, p5] = get_factor_from_real_root(polycoeff, factpoly_expo, p2, p4, p5);
        } else if (whichRootsAreWeFinding === "complex") {
          [foundComplexRoot, p4] = get_factor_from_complex_root(remainingPoly, polycoeff, factpoly_expo);
        }
      }
      if (whichRootsAreWeFinding === "real") {
        if (foundRealRoot === false) {
          whichRootsAreWeFinding = "complex";
          continue;
        } else {
          p8 = add(multiply(p4, p2), p5);
          if (DEBUG) {
            console.log(`success
FACTOR=${p8}`);
          }
          p7 = multiply_noexpand(p7, p8);
          yydivpoly(p4, p5, polycoeff, factpoly_expo);
          while (factpoly_expo && isZeroAtomOrTensor(polycoeff[factpoly_expo])) {
            factpoly_expo--;
          }
          let temp2 = Constants.zero;
          for (let i = 0; i <= factpoly_expo; i++) {
            temp2 = add(temp2, multiply(polycoeff[i], power(p2, integer(i))));
          }
          remainingPoly = temp2;
        }
      } else if (whichRootsAreWeFinding === "complex") {
        if (foundComplexRoot === false) {
          break;
        } else {
          const firstFactor = subtract(p4, p2);
          const secondFactor = subtract(conjugate(p4), p2);
          p8 = multiply(firstFactor, secondFactor);
          if (DEBUG) {
            console.log(`success
FACTOR=${p8}`);
          }
          const previousFactorisation = p7;
          p7 = multiply_noexpand(p7, p8);
          if (remainingPoly == null) {
            let temp2 = Constants.zero;
            for (let i = 0; i <= factpoly_expo; i++) {
              temp2 = add(temp2, multiply(polycoeff[i], power(p2, integer(i))));
            }
            remainingPoly = temp2;
          }
          const X = p2;
          const divisor = p8;
          const dividend = remainingPoly;
          remainingPoly = divpoly(dividend, divisor, X);
          const checkingTheDivision = multiply(remainingPoly, p8);
          if (!equal(checkingTheDivision, dividend)) {
            if (DEBUG) {
              console.log("we found a polynomial based on complex root and its conj but it doesn't divide the poly, quitting");
              console.log(`so just returning previousFactorisation times dividend: ${previousFactorisation} * ${dividend}`);
            }
            return multiply_noexpand(previousFactorisation, noexpand(yycondense, dividend));
          }
          for (let i = 0; i <= factpoly_expo; i++) {
            polycoeff.pop();
          }
          polycoeff.push(...coeff(remainingPoly, p2));
          factpoly_expo -= 2;
        }
      }
    }
    let temp = Constants.zero;
    for (let i = 0; i <= factpoly_expo; i++) {
      temp = add(temp, multiply(polycoeff[i], power(p2, integer(i))));
    }
    p1 = temp;
    if (DEBUG) {
      console.log(`POLY=${p1}`);
    }
    p1 = noexpand(yycondense, p1);
    if (factpoly_expo > 0 && isnegativeterm(polycoeff[factpoly_expo])) {
      p1 = negate(p1);
      p7 = negate_noexpand(p7);
    }
    p7 = multiply_noexpand(p7, p1);
    if (DEBUG) {
      console.log(`RESULT=${p7}`);
    }
    return p7;
  }
  function rationalize_coefficients(coefficients) {
    let p7 = Constants.one;
    for (const coeff2 of coefficients) {
      p7 = lcm(denominator(coeff2), p7);
    }
    for (let i = 0; i < coefficients.length; i++) {
      coefficients[i] = multiply(p7, coefficients[i]);
    }
    p7 = reciprocate(p7);
    if (DEBUG) {
      console.log("rationalize_coefficients result");
    }
    return p7;
  }
  function get_factor_from_real_root(polycoeff, factpoly_expo, p2, p4, p5) {
    let p1, p3, p6;
    if (DEBUG) {
      let temp = Constants.zero;
      for (let i = 0; i <= factpoly_expo; i++) {
        temp = add(temp, multiply(polycoeff[i], power(p2, integer(i))));
      }
      p1 = temp;
      console.log(`POLY=${p1}`);
    }
    const an = ydivisors(polycoeff[factpoly_expo]);
    const a0 = ydivisors(polycoeff[0]);
    if (DEBUG) {
      console.log("divisors of base term");
      for (let i = 0; i < a0.length; i++) {
        console.log(`, ${a0[i]}`);
      }
      console.log("divisors of leading term");
      for (let i = 0; i < an.length; i++) {
        console.log(`, ${an[i]}`);
      }
    }
    for (let rootsTries_i = 0; rootsTries_i < an.length; rootsTries_i++) {
      for (let rootsTries_j = 0; rootsTries_j < a0.length; rootsTries_j++) {
        p4 = an[rootsTries_i];
        p5 = a0[rootsTries_j];
        p3 = negate(divide(p5, p4));
        p6 = Evalpoly(p3, polycoeff, factpoly_expo);
        if (DEBUG) {
          console.log(`try A=${p4}
, B=${p5}
, root ${p2}
=-B/A=${p3}
, POLY(${p3}
)=${p6}`);
        }
        if (isZeroAtomOrTensor(p6)) {
          if (DEBUG) {
            console.log("get_factor_from_real_root returning true");
          }
          return [true, p4, p5];
        }
        p5 = negate(p5);
        p3 = negate(p3);
        p6 = Evalpoly(p3, polycoeff, factpoly_expo);
        if (DEBUG) {
          console.log(`try A=${p4}
, B=${p5}
, root ${p2}
=-B/A=${p3}
, POLY(${p3}
)=${p6}`);
        }
        if (isZeroAtomOrTensor(p6)) {
          if (DEBUG) {
            console.log("get_factor_from_real_root returning true");
          }
          return [true, p4, p5];
        }
      }
    }
    if (DEBUG) {
      console.log("get_factor_from_real_root returning false");
    }
    return [false, p4, p5];
  }
  function get_factor_from_complex_root(remainingPoly, polycoeff, factpoly_expo) {
    let p1, p4, p3, p6;
    if (factpoly_expo <= 2) {
      if (DEBUG) {
        console.log("no more factoring via complex roots to be found in polynomial of degree <= 2");
      }
      return [false, p4];
    }
    p1 = remainingPoly;
    if (DEBUG) {
      console.log(`complex root finding for POLY=${p1}`);
    }
    p4 = rect(power(Constants.negOne, rational(2, 3)));
    if (DEBUG) {
      console.log(`complex root finding: trying with ${p4}`);
    }
    p3 = p4;
    p6 = Evalpoly(p3, polycoeff, factpoly_expo);
    if (DEBUG) {
      console.log(`complex root finding result: ${p6}`);
    }
    if (isZeroAtomOrTensor(p6)) {
      if (DEBUG) {
        console.log("get_factor_from_complex_root returning true");
      }
      return [true, p4];
    }
    p4 = rect(power(Constants.one, rational(2, 3)));
    if (DEBUG) {
      console.log(`complex root finding: trying with ${p4}`);
    }
    p3 = p4;
    p6 = Evalpoly(p3, polycoeff, factpoly_expo);
    if (DEBUG) {
      console.log(`complex root finding result: ${p6}`);
    }
    if (isZeroAtomOrTensor(p6)) {
      if (DEBUG) {
        console.log("get_factor_from_complex_root returning true");
      }
      return [true, p4];
    }
    for (let rootsTries_i = -10; rootsTries_i <= 10; rootsTries_i++) {
      for (let rootsTries_j = 1; rootsTries_j <= 5; rootsTries_j++) {
        p4 = rect(add(integer(rootsTries_i), multiply(integer(rootsTries_j), Constants.imaginaryunit)));
        const p32 = p4;
        const p62 = Evalpoly(p32, polycoeff, factpoly_expo);
        if (isZeroAtomOrTensor(p62)) {
          if (DEBUG) {
            console.log(`found complex root: ${p62}`);
          }
          return [true, p4];
        }
      }
    }
    if (DEBUG) {
      console.log("get_factor_from_complex_root returning false");
    }
    return [false, p4];
  }
  function yydivpoly(p4, p5, polycoeff, factpoly_expo) {
    let p6 = Constants.zero;
    for (let i = factpoly_expo; i > 0; i--) {
      const divided = divide(polycoeff[i], p4);
      polycoeff[i] = p6;
      p6 = divided;
      polycoeff[i - 1] = subtract(polycoeff[i - 1], multiply(p6, p5));
    }
    polycoeff[0] = p6;
    if (DEBUG) {
      console.log("yydivpoly Q:");
    }
  }
  function Evalpoly(p3, polycoeff, factpoly_expo) {
    let temp = Constants.zero;
    for (let i = factpoly_expo; i >= 0; i--) {
      if (DEBUG) {
        console.log("Evalpoly top of stack:");
        console.log(print_list(temp));
      }
      temp = add(multiply(temp, p3), polycoeff[i]);
    }
    return temp;
  }

  // bazel-out/k8-fastbuild/bin/sources/gcd.js
  function Eval_gcd(p1) {
    p1 = cdr(p1);
    let result = Eval(car(p1));
    if (iscons(p1)) {
      result = p1.tail().reduce((acc, p) => gcd(acc, Eval(p)), result);
    }
    return result;
  }
  function gcd(p1, p2) {
    return doexpand(gcd_main, p1, p2);
  }
  function gcd_main(p1, p2) {
    let polyVar;
    if (equal(p1, p2)) {
      return p1;
    }
    if (isrational(p1) && isrational(p2)) {
      return gcd_numbers(p1, p2);
    }
    if (polyVar = areunivarpolysfactoredorexpandedform(p1, p2)) {
      return gcd_polys(p1, p2, polyVar);
    }
    if (isadd(p1) && isadd(p2)) {
      return gcd_sum_sum(p1, p2);
    }
    if (isadd(p1)) {
      p1 = gcd_sum(p1);
    }
    if (isadd(p2)) {
      p2 = gcd_sum(p2);
    }
    if (ismultiply(p1)) {
      return gcd_sum_product(p1, p2);
    }
    if (ismultiply(p2)) {
      return gcd_product_sum(p1, p2);
    }
    if (ismultiply(p1) && ismultiply(p2)) {
      return gcd_product_product(p1, p2);
    }
    return gcd_powers_with_same_base(p1, p2);
  }
  function areunivarpolysfactoredorexpandedform(p1, p2) {
    let polyVar;
    if (polyVar = isunivarpolyfactoredorexpandedform(p1)) {
      if (isunivarpolyfactoredorexpandedform(p2, polyVar)) {
        return polyVar;
      }
    }
  }
  function gcd_polys(p1, p2, polyVar) {
    p1 = factorpoly(p1, polyVar);
    p2 = factorpoly(p2, polyVar);
    if (ismultiply(p1) || ismultiply(p2)) {
      if (!ismultiply(p1)) {
        p1 = makeList(symbol(MULTIPLY), p1, Constants.one);
      }
      if (!ismultiply(p2)) {
        p2 = makeList(symbol(MULTIPLY), p2, Constants.one);
      }
    }
    if (ismultiply(p1) && ismultiply(p2)) {
      return gcd_product_product(p1, p2);
    }
    return gcd_powers_with_same_base(p1, p2);
  }
  function gcd_product_product(p1, p2) {
    let p3 = cdr(p1);
    let p4 = cdr(p2);
    if (iscons(p3)) {
      return [...p3].reduce((acc, pOuter) => {
        if (iscons(p4)) {
          return multiply(acc, [...p4].reduce((innerAcc, pInner) => multiply(innerAcc, gcd(pOuter, pInner)), Constants.one));
        }
      }, Constants.one);
    }
  }
  function gcd_powers_with_same_base(base1, base2) {
    let exponent1, exponent2, p6;
    if (ispower(base1)) {
      exponent1 = caddr(base1);
      base1 = cadr(base1);
    } else {
      exponent1 = Constants.one;
    }
    if (ispower(base2)) {
      exponent2 = caddr(base2);
      base2 = cadr(base2);
    } else {
      exponent2 = Constants.one;
    }
    if (!equal(base1, base2)) {
      return Constants.one;
    }
    if (isNumericAtom(exponent1) && isNumericAtom(exponent2)) {
      const exponent3 = lessp(exponent1, exponent2) ? exponent1 : exponent2;
      return power(base1, exponent3);
    }
    let p5 = divide(exponent1, exponent2);
    if (isNumericAtom(p5)) {
      p5 = ismultiply(exponent1) && isNumericAtom(cadr(exponent1)) ? cadr(exponent1) : Constants.one;
      p6 = ismultiply(exponent2) && isNumericAtom(cadr(exponent2)) ? cadr(exponent2) : Constants.one;
      const exponent3 = lessp(p5, p6) ? exponent1 : exponent2;
      return power(base1, exponent3);
    }
    p5 = subtract(exponent1, exponent2);
    if (!isNumericAtom(p5)) {
      return Constants.one;
    }
    const exponent = isnegativenumber(p5) ? exponent1 : exponent2;
    return power(base1, exponent);
  }
  function gcd_sum_sum(p1, p2) {
    let p3, p4, p5, p6;
    if (length(p1) !== length(p2)) {
      return Constants.one;
    }
    p3 = iscons(p1) ? p1.tail().reduce(gcd) : car(cdr(p1));
    p4 = iscons(p2) ? p2.tail().reduce(gcd) : car(cdr(p2));
    p5 = divide(p1, p3);
    p6 = divide(p2, p4);
    if (equal(p5, p6)) {
      return multiply(p5, gcd(p3, p4));
    }
    return Constants.one;
  }
  function gcd_sum(p) {
    return iscons(p) ? p.tail().reduce(gcd) : car(cdr(p));
  }
  function gcd_sum_product(p1, p2) {
    return iscons(p1) ? p1.tail().reduce((a, b) => multiply(a, gcd(b, p2)), Constants.one) : Constants.one;
  }
  function gcd_product_sum(p1, p2) {
    return iscons(p2) ? p2.tail().reduce((a, b) => multiply(a, gcd(p1, b)), Constants.one) : Constants.one;
  }

  // bazel-out/k8-fastbuild/bin/sources/condense.js
  function Eval_condense(p1) {
    return Condense(Eval(cadr(p1)));
  }
  function Condense(p1) {
    return noexpand(yycondense, p1);
  }
  function yycondense(p1) {
    if (!isadd(p1)) {
      return p1;
    }
    const termsGCD = p1.tail().reduce(gcd);
    const p2 = inverse(termsGCD);
    const temp2 = p1.tail().reduce((a, b) => add(a, multiply_noexpand(p2, b)), Constants.zero);
    const arg1 = yyexpand(temp2);
    return divide(arg1, p2);
  }

  // bazel-out/k8-fastbuild/bin/sources/rationalize.js
  function Eval_rationalize(p1) {
    return rationalize(Eval(cadr(p1)));
  }
  function rationalize(p) {
    const prev_expanding = defs.expanding;
    const result = yyrationalize(p);
    defs.expanding = prev_expanding;
    return result;
  }
  function yyrationalize(arg2) {
    if (istensor(arg2)) {
      return __rationalize_tensor(arg2);
    }
    defs.expanding = false;
    if (!isadd(arg2)) {
      return arg2;
    }
    const commonDenominator = multiply_denominators(arg2);
    let temp = Constants.zero;
    if (iscons(arg2)) {
      temp = arg2.tail().reduce((acc, term) => add(acc, multiply(commonDenominator, term)), temp);
    }
    return divide(Condense(temp), commonDenominator);
  }
  function multiply_denominators(p) {
    if (isadd(p)) {
      return p.tail().reduce((acc, el) => multiply_denominators_term(el, acc), Constants.one);
    }
    return multiply_denominators_term(p, Constants.one);
  }
  function multiply_denominators_term(p, p2) {
    if (ismultiply(p)) {
      return p.tail().reduce((acc, el) => multiply_denominators_factor(el, acc), p2);
    }
    return multiply_denominators_factor(p, p2);
  }
  function multiply_denominators_factor(p, p2) {
    if (!ispower(p)) {
      return p2;
    }
    const arg2 = p;
    p = caddr(p);
    if (isnegativenumber(p)) {
      return __lcm(p2, inverse(arg2));
    }
    if (ismultiply(p) && isnegativenumber(cadr(p))) {
      return __lcm(p2, inverse(arg2));
    }
    return p2;
  }
  function __rationalize_tensor(p1) {
    p1 = Eval(p1);
    if (!istensor(p1)) {
      return p1;
    }
    p1.tensor.elem = p1.tensor.elem.map(rationalize);
    check_tensor_dimensions(p1);
    return p1;
  }
  function __lcm(p1, p2) {
    return divide(multiply(p1, p2), gcd(p1, p2));
  }

  // bazel-out/k8-fastbuild/bin/sources/denominator.js
  function Eval_denominator(p1) {
    return denominator(Eval(cadr(p1)));
  }
  function denominator(p1) {
    if (isadd(p1)) {
      p1 = rationalize(p1);
    }
    if (ismultiply(p1) && !isplusone(car(cdr(p1)))) {
      return multiply_all(p1.tail().map(denominator));
    }
    if (isrational(p1)) {
      return mp_denominator(p1);
    }
    if (ispower(p1) && isnegativeterm(caddr(p1))) {
      return reciprocate(p1);
    }
    return Constants.one;
  }

  // bazel-out/k8-fastbuild/bin/sources/numerator.js
  function Eval_numerator(p1) {
    return numerator(Eval(cadr(p1)));
  }
  function numerator(p1) {
    if (isadd(p1)) {
      p1 = rationalize(p1);
    }
    if (ismultiply(p1) && !isplusone(car(cdr(p1)))) {
      return multiply_all(p1.tail().map(numerator));
    }
    if (isrational(p1)) {
      return mp_numerator(p1);
    }
    if (ispower(p1) && isnegativeterm(caddr(p1))) {
      return Constants.one;
    }
    return p1;
  }

  // bazel-out/k8-fastbuild/bin/sources/arctan.js
  function Eval_arctan(x) {
    return arctan(Eval(cadr(x)));
  }
  function arctan(x) {
    if (car(x) === symbol(TAN)) {
      return cadr(x);
    }
    if (isdouble(x)) {
      return double(Math.atan(x.d));
    }
    if (isZeroAtomOrTensor(x)) {
      return Constants.zero;
    }
    if (isnegative(x)) {
      return negate(arctan(negate(x)));
    }
    if (Find(x, symbol(SIN)) && Find(x, symbol(COS))) {
      const p2 = numerator(x);
      const p3 = denominator(x);
      if (car(p2) === symbol(SIN) && car(p3) === symbol(COS) && equal(cadr(p2), cadr(p3))) {
        return cadr(p2);
      }
    }
    if (ispower(x) && equaln(cadr(x), 3) && equalq(caddr(x), -1, 2) || ismultiply(x) && equalq(car(cdr(x)), 1, 3) && car(car(cdr(cdr(x)))) === symbol(POWER) && equaln(car(cdr(car(cdr(cdr(x))))), 3) && equalq(car(cdr(cdr(car(cdr(cdr(x)))))), 1, 2)) {
      return multiply(rational(1, 6), Constants.Pi());
    }
    if (equaln(x, 1)) {
      return multiply(rational(1, 4), Constants.Pi());
    }
    if (ispower(x) && equaln(cadr(x), 3) && equalq(caddr(x), 1, 2)) {
      return multiply(rational(1, 3), Constants.Pi());
    }
    return makeList(symbol(ARCTAN), x);
  }

  // bazel-out/k8-fastbuild/bin/sources/imag.js
  var DEBUG_IMAG = false;
  function Eval_imag(p1) {
    return imag(Eval(cadr(p1)));
  }
  function imag(p) {
    const p1 = rect(p);
    const conj = conjugate(p1);
    const arg1 = divide(subtract(p1, conj), integer(2));
    const result = divide(arg1, Constants.imaginaryunit);
    if (DEBUG_IMAG) {
      console.log(`IMAGE of ${p1}`);
      console.log(` image: conjugate result: ${conj}`);
      console.log(` image: 1st divide result: ${arg1}`);
      console.log(` image: 2nd divide result: ${result}`);
    }
    return result;
  }

  // bazel-out/k8-fastbuild/bin/sources/real.js
  function Eval_real(p1) {
    return real(Eval(cadr(p1)));
  }
  function real(p) {
    const p1 = rect(p);
    return divide(add(p1, conjugate(p1)), integer(2));
  }

  // bazel-out/k8-fastbuild/bin/sources/arg.js
  var DEBUG_ARG = false;
  function Eval_arg(z) {
    return arg(Eval(cadr(z)));
  }
  function arg(z) {
    return subtract(yyarg(numerator(z)), yyarg(denominator(z)));
  }
  function yyarg(p1) {
    if (ispositivenumber(p1) || p1 === symbol(PI)) {
      return isdouble(p1) || defs.evaluatingAsFloats ? Constants.zeroAsDouble : Constants.zero;
    }
    if (isnegativenumber(p1)) {
      const pi = isdouble(p1) || defs.evaluatingAsFloats ? Constants.piAsDouble : symbol(PI);
      return negate(pi);
    }
    if (issymbol(p1)) {
      return makeList(symbol(ARG), p1);
    }
    if (ispower(p1) && equaln(cadr(p1), -1)) {
      return multiply(Constants.Pi(), caddr(p1));
    }
    if (ispower(p1) && cadr(p1) === symbol(E)) {
      return imag(caddr(p1));
    }
    if (ispower(p1) && isoneovertwo(caddr(p1))) {
      const arg1 = arg(cadr(p1));
      if (DEBUG_ARG) {
        console.log(`arg of a sqrt: ${p1}`);
        breakpoint;
        console.log(` = 1/2 * ${arg1}`);
      }
      return multiply(arg1, caddr(p1));
    }
    if (ismultiply(p1)) {
      return p1.tail().map(arg).reduce(add, Constants.zero);
    }
    if (isadd(p1)) {
      p1 = rect(p1);
      const RE = real(p1);
      const IM = imag(p1);
      if (isZeroAtomOrTensor(RE)) {
        if (isnegative(IM)) {
          return negate(Constants.Pi());
        } else {
          return Constants.Pi();
        }
      } else {
        const arg1 = arctan(divide(IM, RE));
        if (isnegative(RE)) {
          if (isnegative(IM)) {
            return subtract(arg1, Constants.Pi());
          } else {
            return add(arg1, Constants.Pi());
          }
        }
        return arg1;
      }
    }
    if (!isZeroAtomOrTensor(get_binding(symbol(ASSUME_REAL_VARIABLES)))) {
      return Constants.zero;
    }
    return makeList(symbol(ARG), p1);
  }

  // bazel-out/k8-fastbuild/bin/sources/dpow.js
  function dpow(base, expo) {
    if (base === 0 && expo < 0) {
      stop("divide by zero");
    }
    if (base >= 0 || expo % 1 === 0) {
      return double(Math.pow(base, expo));
    }
    const result = Math.pow(Math.abs(base), expo);
    const theta = Math.PI * expo;
    let a = 0;
    let b = 0;
    if (expo % 0.5 === 0) {
      a = 0;
      b = Math.sin(theta);
    } else {
      a = Math.cos(theta);
      b = Math.sin(theta);
    }
    return add(double(a * result), multiply(double(b * result), Constants.imaginaryunit));
  }

  // bazel-out/k8-fastbuild/bin/sources/factorial.js
  function factorial(p1) {
    const n = nativeInt(p1);
    if (n < 0 || isNaN(n)) {
      return makeList(symbol(FACTORIAL), p1);
    }
    return bignum_factorial(n);
  }

  // bazel-out/k8-fastbuild/bin/sources/qpow.js
  var import_big_integer5 = __toModule(require_BigInteger());

  // bazel-out/k8-fastbuild/bin/sources/mpow.js
  function mpow(a, n) {
    return a.pow(n);
  }

  // bazel-out/k8-fastbuild/bin/sources/mroot.js
  var import_big_integer4 = __toModule(require_BigInteger());
  function mroot(n, index) {
    n = n.abs();
    if (index === 0) {
      stop("root index is zero");
    }
    let k = 0;
    while (n.shiftRight(k).toJSNumber() > 0) {
      k++;
    }
    if (k === 0) {
      return mint(0);
    }
    k = Math.floor((k - 1) / index);
    const j = Math.floor(k / 32 + 1);
    let x = (0, import_big_integer4.default)(j);
    for (let i = 0; i < j; i++) {
      x = x.and((0, import_big_integer4.default)(1).shiftLeft(i).not());
    }
    while (k >= 0) {
      x = x.or((0, import_big_integer4.default)(1).shiftLeft(k));
      const y = mpow(x, index);
      switch (mcmp(y, n)) {
        case 0:
          return x;
        case 1:
          x = x.and((0, import_big_integer4.default)(1).shiftLeft(k).not());
          break;
      }
      k--;
    }
    return 0;
  }

  // bazel-out/k8-fastbuild/bin/sources/quickfactor.js
  function quickfactor(BASE, EXPO) {
    const arr = factor_small_number(nativeInt(BASE));
    const n = arr.length;
    for (let i = 0; i < n; i += 2) {
      arr.push(...quickpower(arr[i], multiply(arr[i + 1], EXPO)));
    }
    return multiply_all(arr.slice(n));
  }
  function quickpower(BASE, EXPO) {
    const p3 = bignum_truncate(EXPO);
    const p4 = subtract(EXPO, p3);
    let fractionalPart;
    if (!isZeroAtomOrTensor(p4)) {
      fractionalPart = makeList(symbol(POWER), BASE, p4);
    }
    const expo = nativeInt(p3);
    if (isNaN(expo)) {
      const result2 = makeList(symbol(POWER), BASE, p3);
      return fractionalPart ? [fractionalPart, result2] : [result2];
    }
    if (expo === 0) {
      return [fractionalPart];
    }
    const result = bignum_power_number(BASE, expo);
    return fractionalPart ? [fractionalPart, result] : [result];
  }

  // bazel-out/k8-fastbuild/bin/sources/qpow.js
  function qpow(base, expo) {
    return qpowf(base, expo);
  }
  function qpowf(BASE, EXPO) {
    if (isplusone(BASE) || isZeroAtomOrTensor(EXPO)) {
      return Constants.one;
    }
    if (isminusone(BASE) && isoneovertwo(EXPO)) {
      return Constants.imaginaryunit;
    }
    if (isZeroAtomOrTensor(BASE)) {
      if (isnegativenumber(EXPO)) {
        stop("divide by zero");
      }
      return Constants.zero;
    }
    if (isplusone(EXPO)) {
      return BASE;
    }
    let expo = 0;
    let x;
    let y;
    if (isinteger(EXPO)) {
      expo = nativeInt(EXPO);
      if (isNaN(expo)) {
        return makeList(symbol(POWER), BASE, EXPO);
      }
      x = mpow(BASE.q.a, Math.abs(expo));
      y = mpow(BASE.q.b, Math.abs(expo));
      if (expo < 0) {
        const t = x;
        x = y;
        y = t;
        x = makeSignSameAs(x, y);
        y = makePositive(y);
      }
      return new Num(x, y);
    }
    if (isminusone(BASE)) {
      return normalize_angle(EXPO);
    }
    if (isnegativenumber(BASE)) {
      return multiply(qpow(negate(BASE), EXPO), qpow(Constants.negOne, EXPO));
    }
    if (!isinteger(BASE)) {
      return multiply(qpow(mp_numerator(BASE), EXPO), qpow(mp_denominator(BASE), negate(EXPO)));
    }
    if (is_small_integer(BASE)) {
      return quickfactor(BASE, EXPO);
    }
    if (!isSmall(EXPO.q.a) || !isSmall(EXPO.q.b)) {
      return makeList(symbol(POWER), BASE, EXPO);
    }
    const { a, b } = EXPO.q;
    x = mroot(BASE.q.a, b.toJSNumber());
    if (x === 0) {
      return makeList(symbol(POWER), BASE, EXPO);
    }
    y = mpow(x, a);
    return EXPO.q.a.isNegative() ? new Num(import_big_integer5.default.one, y) : new Num(y);
  }
  function normalize_angle(A) {
    if (isinteger(A)) {
      if (A.q.a.isOdd()) {
        return Constants.negOne;
      } else {
        return Constants.one;
      }
    }
    let Q = bignum_truncate(A);
    if (isnegativenumber(A)) {
      Q = add(Q, Constants.negOne);
    }
    let R = subtract(A, Q);
    let result = makeList(symbol(POWER), Constants.negOne, R);
    if (Q.q.a.isOdd()) {
      result = negate(result);
    }
    return result;
  }
  function is_small_integer(p) {
    return isSmall(p.q.a);
  }

  // bazel-out/k8-fastbuild/bin/sources/power.js
  var DEBUG_POWER = false;
  function Eval_power(p1) {
    if (DEBUG_POWER) {
      breakpoint;
    }
    const base = Eval(cadr(p1));
    const exponent = Eval(caddr(p1));
    return power(base, exponent);
  }
  function power(p1, p2) {
    return yypower(p1, p2);
  }
  function yypower(base, exponent) {
    if (DEBUG_POWER) {
      breakpoint;
    }
    const inputExp = exponent;
    const inputBase = base;
    if (DEBUG_POWER) {
      console.log(`POWER: ${base} ^ ${exponent}`);
    }
    if (equal(base, Constants.one) || isZeroAtomOrTensor(exponent)) {
      const one = Constants.One();
      if (DEBUG_POWER) {
        console.log(`   power of ${inputBase} ^ ${inputExp}: ${one}`);
      }
      return one;
    }
    if (equal(exponent, Constants.one)) {
      if (DEBUG_POWER) {
        console.log(`   power of ${inputBase} ^ ${inputExp}: ${base}`);
      }
      return base;
    }
    if (isminusone(base) && isminusone(exponent)) {
      const negOne = negate(Constants.One());
      if (DEBUG_POWER) {
        console.log(`   power of ${inputBase} ^ ${inputExp}: ${negOne}`);
      }
      return negOne;
    }
    if (isminusone(base) && isoneovertwo(exponent)) {
      const result2 = Constants.imaginaryunit;
      if (DEBUG_POWER) {
        console.log(`   power of ${inputBase} ^ ${inputExp}: ${result2}`);
      }
      return result2;
    }
    if (isminusone(base) && isminusoneovertwo(exponent)) {
      const result2 = negate(Constants.imaginaryunit);
      if (DEBUG_POWER) {
        console.log(`   power of ${inputBase} ^ ${inputExp}: ${result2}`);
      }
      return result2;
    }
    let tmp;
    if (isminusone(base) && !isdouble(base) && isrational(exponent) && !isinteger(exponent) && ispositivenumber(exponent) && !defs.evaluatingAsFloats) {
      if (DEBUG_POWER) {
        console.log("   power: -1 ^ rational");
        console.log(` trick: exponent.q.a , exponent.q.b ${exponent.q.a} , ${exponent.q.b}`);
      }
      if (exponent.q.a < exponent.q.b) {
        tmp = makeList(symbol(POWER), base, exponent);
      } else {
        tmp = makeList(symbol(MULTIPLY), base, makeList(symbol(POWER), base, rational(exponent.q.a.mod(exponent.q.b), exponent.q.b)));
        if (DEBUG_POWER) {
          console.log(` trick applied : ${tmp}`);
        }
      }
      const result2 = rect(tmp);
      if (DEBUG_POWER) {
        console.log(`   power of ${inputBase} ^ ${inputExp}: ${result2}`);
      }
      return result2;
    }
    if (isrational(base) && isrational(exponent)) {
      if (DEBUG_POWER) {
        console.log("   power: isrational(base) && isrational(exponent)");
      }
      const result2 = qpow(base, exponent);
      if (DEBUG_POWER) {
        console.log(`   power of ${inputBase} ^ ${inputExp}: ${result2}`);
      }
      return result2;
    }
    if (isNumericAtom(base) && isNumericAtom(exponent)) {
      const result2 = dpow(nativeDouble(base), nativeDouble(exponent));
      if (DEBUG_POWER) {
        console.log("   power: both base and exponent are either rational or double ");
        console.log("POWER - isNumericAtom(base) && isNumericAtom(exponent)");
        console.log(`   power of ${inputBase} ^ ${inputExp}: ${result2}`);
      }
      return result2;
    }
    if (istensor(base)) {
      const result2 = power_tensor(base, exponent);
      if (DEBUG_POWER) {
        console.log("   power: istensor(base) ");
        console.log(`   power of ${inputBase} ^ ${inputExp}: ${result2}`);
      }
      return result2;
    }
    if (car(base) === symbol(ABS) && iseveninteger(exponent) && !isZeroAtomOrTensor(get_binding(symbol(ASSUME_REAL_VARIABLES)))) {
      const result2 = power(cadr(base), exponent);
      if (DEBUG_POWER) {
        console.log("   power: even power of absolute of real value ");
        console.log(`   power of ${inputBase} ^ ${inputExp}: ${result2}`);
      }
      return result2;
    }
    if (base === symbol(E) && car(exponent) === symbol(LOG)) {
      const result2 = cadr(exponent);
      if (DEBUG_POWER) {
        console.log(`   power of ${inputBase} ^ ${inputExp}: ${result2}`);
      }
      return result2;
    }
    if (base === symbol(E) && isdouble(exponent)) {
      const result2 = double(Math.exp(exponent.d));
      if (DEBUG_POWER) {
        console.log("   power: base == symbol(E) && isdouble(exponent) ");
        console.log(`   power of ${inputBase} ^ ${inputExp}: ${result2}`);
      }
      return result2;
    }
    if (base === symbol(E) && Find(exponent, Constants.imaginaryunit) && Find(exponent, symbol(PI)) && !defs.evaluatingPolar) {
      let tmp2 = makeList(symbol(POWER), base, exponent);
      if (DEBUG_POWER) {
        console.log(`   power: turning complex exponential to rect: ${tmp2}`);
      }
      const hopefullySimplified = rect(tmp2);
      if (!Find(hopefullySimplified, symbol(PI))) {
        if (DEBUG_POWER) {
          console.log(`   power: turned complex exponential to rect: ${hopefullySimplified}`);
        }
        return hopefullySimplified;
      }
    }
    if (ismultiply(base) && isinteger(exponent)) {
      base = cdr(base);
      let result2 = power(car(base), exponent);
      if (iscons(base)) {
        result2 = base.tail().reduce((a, b) => multiply(a, power(b, exponent)), result2);
      }
      if (DEBUG_POWER) {
        console.log("   power: (a * b) ^ c  ->  (a ^ c) * (b ^ c) ");
        console.log(`   power of ${inputBase} ^ ${inputExp}: ${result2}`);
      }
      return result2;
    }
    let is_a_moreThanZero = false;
    if (isNumericAtom(cadr(base))) {
      is_a_moreThanZero = sign(compare_numbers(cadr(base), Constants.zero)) > 0;
    }
    if (ispower(base) && (isinteger(exponent) || is_a_moreThanZero)) {
      const result2 = power(cadr(base), multiply(caddr(base), exponent));
      if (DEBUG_POWER) {
        console.log(`   power of ${inputBase} ^ ${inputExp}: ${result2}`);
      }
      return result2;
    }
    let b_isEven_and_c_isItsInverse = false;
    if (iseveninteger(caddr(base))) {
      const isThisOne = multiply(caddr(base), exponent);
      if (isone(isThisOne)) {
        b_isEven_and_c_isItsInverse = true;
      }
    }
    if (ispower(base) && b_isEven_and_c_isItsInverse) {
      const result2 = abs(cadr(base));
      if (DEBUG_POWER) {
        console.log("   power: car(base) == symbol(POWER) && b_isEven_and_c_isItsInverse ");
        console.log(`   power of ${inputBase} ^ ${inputExp}: ${result2}`);
      }
      return result2;
    }
    if (defs.expanding && isadd(base) && isNumericAtom(exponent)) {
      const n = nativeInt(exponent);
      if (n > 1 && !isNaN(n)) {
        if (DEBUG_POWER) {
          console.log("   power: expanding && isadd(base) && isNumericAtom(exponent) ");
        }
        let result2 = power_sum(n, base);
        if (DEBUG_POWER) {
          console.log(`   power of ${inputBase} ^ ${inputExp}: ${result2}`);
        }
        return result2;
      }
    }
    if (defs.trigmode === 1 && car(base) === symbol(SIN) && iseveninteger(exponent)) {
      const result2 = power(subtract(Constants.one, power(cosine(cadr(base)), integer(2))), multiply(exponent, rational(1, 2)));
      if (DEBUG_POWER) {
        console.log("   power: trigmode == 1 && car(base) == symbol(SIN) && iseveninteger(exponent) ");
        console.log(`   power of ${inputBase} ^ ${inputExp}: ${result2}`);
      }
      return result2;
    }
    if (defs.trigmode === 2 && car(base) === symbol(COS) && iseveninteger(exponent)) {
      const result2 = power(subtract(Constants.one, power(sine(cadr(base)), integer(2))), multiply(exponent, rational(1, 2)));
      if (DEBUG_POWER) {
        console.log("   power: trigmode == 2 && car(base) == symbol(COS) && iseveninteger(exponent) ");
        console.log(`   power of ${inputBase} ^ ${inputExp}: ${result2}`);
      }
      return result2;
    }
    if (iscomplexnumber(base)) {
      if (DEBUG_POWER) {
        console.log(" power - handling the case (a + ib) ^ n");
      }
      if (isinteger(exponent)) {
        const p3 = conjugate(base);
        let result2 = divide(p3, multiply(p3, base));
        if (!isone(exponent)) {
          result2 = power(result2, negate(exponent));
        }
        if (DEBUG_POWER) {
          console.log(`   power of ${inputBase} ^ ${inputExp}: ${result2}`);
        }
        return result2;
      }
      if (isNumericAtom(exponent)) {
        const pi = defs.evaluatingAsFloats || iscomplexnumberdouble(base) && isdouble(exponent) ? double(Math.PI) : symbol(PI);
        let tmp2 = multiply(power(abs(base), exponent), power(Constants.negOne, divide(multiply(arg(base), exponent), pi)));
        if (avoidCalculatingPowersIntoArctans && Find(tmp2, symbol(ARCTAN))) {
          tmp2 = makeList(symbol(POWER), base, exponent);
        }
        if (DEBUG_POWER) {
          console.log(`   power of ${inputBase} ^ ${inputExp}: ${tmp2}`);
        }
        return tmp2;
      }
    }
    const polarResult = simplify_polar(exponent);
    if (polarResult !== void 0) {
      if (DEBUG_POWER) {
        console.log("   power: using simplify_polar");
      }
      return polarResult;
    }
    const result = makeList(symbol(POWER), base, exponent);
    if (DEBUG_POWER) {
      console.log("   power: nothing can be done ");
      console.log(`   power of ${inputBase} ^ ${inputExp}: ${result}`);
    }
    return result;
  }
  function power_sum(n, p1) {
    const a = [];
    const k = length(p1) - 1;
    const powers = [];
    p1 = cdr(p1);
    for (let i = 0; i < k; i++) {
      for (let j = 0; j <= n; j++) {
        powers[i * (n + 1) + j] = power(car(p1), integer(j));
      }
      p1 = cdr(p1);
    }
    p1 = factorial(integer(n));
    for (let i = 0; i < k; i++) {
      a[i] = 0;
    }
    return multinomial_sum(k, n, a, 0, n, powers, p1, Constants.zero);
  }
  function multinomial_sum(k, n, a, i, m, A, p1, p2) {
    if (i < k - 1) {
      for (let j = 0; j <= m; j++) {
        a[i] = j;
        p2 = multinomial_sum(k, n, a, i + 1, m - j, A, p1, p2);
      }
      return p2;
    }
    a[i] = m;
    let temp = p1;
    for (let j = 0; j < k; j++) {
      temp = divide(temp, factorial(integer(a[j])));
    }
    for (let j = 0; j < k; j++) {
      temp = multiply(temp, A[j * (n + 1) + a[j]]);
    }
    return add(p2, temp);
  }
  function simplify_polar(exponent) {
    let n = isquarterturn(exponent);
    switch (n) {
      case 0:
        break;
      case 1:
        return Constants.one;
      case 2:
        return Constants.negOne;
      case 3:
        return Constants.imaginaryunit;
      case 4:
        return negate(Constants.imaginaryunit);
    }
    if (isadd(exponent)) {
      let p3 = cdr(exponent);
      while (iscons(p3)) {
        n = isquarterturn(car(p3));
        if (n) {
          break;
        }
        p3 = cdr(p3);
      }
      let arg1;
      switch (n) {
        case 0:
          return void 0;
        case 1:
          arg1 = Constants.one;
          break;
        case 2:
          arg1 = Constants.negOne;
          break;
        case 3:
          arg1 = Constants.imaginaryunit;
          break;
        case 4:
          arg1 = negate(Constants.imaginaryunit);
          break;
      }
      return multiply(arg1, exponential(subtract(exponent, car(p3))));
    }
    return void 0;
  }

  // bazel-out/k8-fastbuild/bin/sources/multiply.js
  function Eval_multiply(p1) {
    let temp = Eval(cadr(p1));
    p1 = cddr(p1);
    if (iscons(p1)) {
      temp = [...p1].reduce((acc, p) => multiply(acc, Eval(p)), temp);
    }
    return temp;
  }
  function multiply(arg1, arg2) {
    if (defs.esc_flag) {
      stop("escape key stop");
    }
    if (isNumericAtom(arg1) && isNumericAtom(arg2)) {
      return multiply_numbers(arg1, arg2);
    }
    return yymultiply(arg1, arg2);
  }
  function yymultiply(p1, p2) {
    if (isZeroAtom(p1) || isZeroAtom(p2)) {
      return Constants.Zero();
    }
    if (defs.expanding && isadd(p1)) {
      return p1.tail().reduce((a, b) => add(a, multiply(b, p2)), Constants.Zero());
    }
    if (defs.expanding && isadd(p2)) {
      return p2.tail().reduce((a, b) => add(a, multiply(p1, b)), Constants.Zero());
    }
    if (!istensor(p1) && istensor(p2)) {
      return scalar_times_tensor(p1, p2);
    }
    if (istensor(p1) && !istensor(p2)) {
      return tensor_times_scalar(p1, p2);
    }
    p1 = ismultiply(p1) ? cdr(p1) : makeList(p1);
    p2 = ismultiply(p2) ? cdr(p2) : makeList(p2);
    const factors2 = [];
    if (isNumericAtom(car(p1)) && isNumericAtom(car(p2))) {
      const arg1 = car(p1);
      const arg2 = car(p2);
      factors2.push(multiply_numbers(arg1, arg2));
      p1 = cdr(p1);
      p2 = cdr(p2);
    } else if (isNumericAtom(car(p1))) {
      factors2.push(car(p1));
      p1 = cdr(p1);
    } else if (isNumericAtom(car(p2))) {
      factors2.push(car(p2));
      p2 = cdr(p2);
    } else {
      factors2.push(Constants.One());
    }
    let [p3, p5] = parse_p1(p1);
    let [p4, p6] = parse_p2(p2);
    while (iscons(p1) && iscons(p2)) {
      if (caar(p1) === symbol(OPERATOR) && caar(p2) === symbol(OPERATOR)) {
        factors2.push(new Cons(symbol(OPERATOR), append(cdar(p1), cdar(p2))));
        p1 = cdr(p1);
        p2 = cdr(p2);
        [p3, p5] = parse_p1(p1);
        [p4, p6] = parse_p2(p2);
        continue;
      }
      switch (cmp_expr(p3, p4)) {
        case -1:
          factors2.push(car(p1));
          p1 = cdr(p1);
          [p3, p5] = parse_p1(p1);
          break;
        case 1:
          factors2.push(car(p2));
          p2 = cdr(p2);
          [p4, p6] = parse_p2(p2);
          break;
        case 0:
          combine_factors(factors2, p4, p5, p6);
          p1 = cdr(p1);
          p2 = cdr(p2);
          [p3, p5] = parse_p1(p1);
          [p4, p6] = parse_p2(p2);
          break;
        default:
          stop("internal error 2");
      }
    }
    if (iscons(p1)) {
      factors2.push(...p1);
    }
    if (iscons(p2)) {
      factors2.push(...p2);
    }
    __normalize_radical_factors(factors2);
    if (defs.expanding) {
      for (let i = 0; i < factors2.length; i++) {
        if (isadd(factors2[i])) {
          return multiply_all(factors2);
        }
      }
    }
    const n = factors2.length;
    if (n === 1) {
      return factors2.pop();
    }
    if (isrational(factors2[0]) && equaln(factors2[0], 1)) {
      if (n === 2) {
        const p7 = factors2.pop();
        return p7;
      } else {
        factors2[0] = symbol(MULTIPLY);
        return makeList(...factors2);
      }
    }
    return new Cons(symbol(MULTIPLY), makeList(...factors2));
  }
  function parse_p1(p1) {
    let p3 = car(p1);
    let p5 = Constants.One();
    if (ispower(p3)) {
      p5 = caddr(p3);
      p3 = cadr(p3);
    }
    return [p3, p5];
  }
  function parse_p2(p2) {
    let p4 = car(p2);
    let p6 = Constants.One();
    if (ispower(p4)) {
      p6 = caddr(p4);
      p4 = cadr(p4);
    }
    return [p4, p6];
  }
  function combine_factors(factors2, p4, p5, p6) {
    let p7 = power(p4, add(p5, p6));
    if (isNumericAtom(p7)) {
      factors2[0] = multiply_numbers(factors2[0], p7);
    } else if (ismultiply(p7)) {
      if (isNumericAtom(cadr(p7)) && cdddr(p7) === symbol(NIL)) {
        const arg1 = factors2[0];
        const arg2 = cadr(p7);
        factors2[0] = multiply_numbers(arg1, arg2);
        factors2.push(caddr(p7));
      } else {
        factors2.push(p7);
      }
    } else {
      factors2.push(p7);
    }
  }
  function multiply_noexpand(arg1, arg2) {
    return noexpand(multiply, arg1, arg2);
  }
  function multiply_all(n) {
    if (n.length === 1) {
      return n[0];
    }
    if (n.length === 0) {
      return Constants.One();
    }
    let temp = n[0];
    for (let i = 1; i < n.length; i++) {
      temp = multiply(temp, n[i]);
    }
    return temp;
  }
  function multiply_all_noexpand(arr) {
    return noexpand(multiply_all, arr);
  }
  function divide(p1, p2) {
    if (isNumericAtom(p1) && isNumericAtom(p2)) {
      return divide_numbers(p1, p2);
    } else {
      return multiply(p1, inverse(p2));
    }
  }
  function inverse(p1) {
    if (isNumericAtom(p1)) {
      return invert_number(p1);
    } else {
      return power(p1, Constants.negOne);
    }
  }
  function reciprocate(p1) {
    return inverse(p1);
  }
  function negate(p1) {
    if (isNumericAtom(p1)) {
      return negate_number(p1);
    } else {
      return multiply(p1, Constants.NegOne());
    }
  }
  function negate_noexpand(p1) {
    return noexpand(negate, p1);
  }
  function __normalize_radical_factors(factors2) {
    let i = 0;
    if (isplusone(factors2[0]) || isminusone(factors2[0]) || isdouble(factors2[0])) {
      return;
    }
    for (i = 1; i < factors2.length; i++) {
      if (__is_radical_number(factors2[i])) {
        break;
      }
    }
    if (i === factors2.length) {
      return;
    }
    let A = mp_numerator(factors2[0]);
    for (let i2 = 1; i2 < factors2.length; i2++) {
      if (isplusone(A) || isminusone(A)) {
        break;
      }
      if (!__is_radical_number(factors2[i2])) {
        continue;
      }
      const BASE = cadr(factors2[i2]);
      const EXPO = caddr(factors2[i2]);
      if (!isnegativenumber(EXPO)) {
        continue;
      }
      const TMP = divide(A, BASE);
      if (!isinteger(TMP)) {
        continue;
      }
      A = TMP;
      factors2[i2] = makeList(symbol(POWER), BASE, add(Constants.One(), EXPO));
    }
    let B = mp_denominator(factors2[0]);
    for (let i2 = 1; i2 < factors2.length; i2++) {
      if (isplusone(B)) {
        break;
      }
      if (!__is_radical_number(factors2[i2])) {
        continue;
      }
      const BASE = cadr(factors2[i2]);
      const EXPO = caddr(factors2[i2]);
      if (isnegativenumber(EXPO)) {
        continue;
      }
      const TMP = divide(B, BASE);
      if (!isinteger(TMP)) {
        continue;
      }
      B = TMP;
      const subtracted = subtract(EXPO, Constants.one);
      if (dontCreateNewRadicalsInDenominatorWhenEvalingMultiplication) {
        if (isinteger(BASE) && !isinteger(subtracted) && isnegativenumber(subtracted)) {
          A = divide(A, BASE);
          break;
        }
      }
      factors2[i2] = makeList(symbol(POWER), BASE, subtracted);
    }
    factors2[0] = divide(A, B);
  }
  function __is_radical_number(p) {
    return ispower(p) && isNumericAtom(cadr(p)) && isfraction(caddr(p)) && !isminusone(cadr(p));
  }

  // bazel-out/k8-fastbuild/bin/sources/det.js
  function det(p1) {
    if (!is_square_matrix(p1)) {
      return makeList(symbol(DET), p1);
    }
    const a = p1.tensor.elem;
    const isNumeric = a.every((element) => isNumericAtom(element));
    if (isNumeric) {
      return yydetg(p1);
    } else {
      return determinant(a, p1.tensor.dim[0]);
    }
  }
  function determinant(elements, n) {
    let q = 0;
    const a = [];
    for (let i = 0; i < n; i++) {
      a[i] = i;
      a[i + n] = 0;
      a[i + n + n] = 1;
    }
    let sign_ = 1;
    let outerTemp = Constants.zero;
    while (true) {
      let temp = integer(sign_);
      for (let i = 0; i < n; i++) {
        const k = n * a[i] + i;
        temp = multiply(temp, elements[k]);
      }
      outerTemp = add(outerTemp, temp);
      let j = n - 1;
      let s = 0;
      let breakFromOutherWhile = false;
      while (true) {
        q = a[n + j] + a[n + n + j];
        if (q < 0) {
          a[n + n + j] = -a[n + n + j];
          j--;
          continue;
        }
        if (q === j + 1) {
          if (j === 0) {
            breakFromOutherWhile = true;
            break;
          }
          s++;
          a[n + n + j] = -a[n + n + j];
          j--;
          continue;
        }
        break;
      }
      if (breakFromOutherWhile) {
        break;
      }
      const t = a[j - a[n + j] + s];
      a[j - a[n + j] + s] = a[j - q + s];
      a[j - q + s] = t;
      a[n + j] = q;
      sign_ = sign_ === 1 ? -1 : 1;
    }
    return outerTemp;
  }
  function yydetg(p1) {
    const n = p1.tensor.dim[0];
    const elements = [...p1.tensor.elem];
    const decomp2 = lu_decomp(elements, n);
    return decomp2;
  }
  function getM(arr, n, i, j) {
    return arr[n * i + j];
  }
  function setM(arr, n, i, j, value) {
    arr[n * i + j] = value;
  }
  function lu_decomp(elements, n) {
    let p1 = Constants.one;
    for (let d = 0; d < n - 1; d++) {
      if (equal(getM(elements, n, d, d), Constants.zero)) {
        let i = 0;
        for (i = d + 1; i < n; i++) {
          if (!equal(getM(elements, n, i, d), Constants.zero)) {
            break;
          }
        }
        if (i === n) {
          p1 = Constants.zero;
          break;
        }
        for (let j = d; j < n; j++) {
          let p2 = getM(elements, n, d, j);
          setM(elements, n, d, j, getM(elements, n, i, j));
          setM(elements, n, i, j, p2);
        }
        p1 = negate(p1);
      }
      p1 = multiply(p1, getM(elements, n, d, d));
      for (let i = d + 1; i < n; i++) {
        const p2 = negate(divide(getM(elements, n, i, d), getM(elements, n, d, d)));
        setM(elements, n, i, d, Constants.zero);
        for (let j = d + 1; j < n; j++) {
          const added = add(multiply(getM(elements, n, d, j), p2), getM(elements, n, i, j));
          setM(elements, n, i, j, added);
        }
      }
    }
    return multiply(p1, getM(elements, n, n - 1, n - 1));
  }

  // bazel-out/k8-fastbuild/bin/sources/hermite.js
  function hermite(p1, p2) {
    return yyhermite(p1, p2);
  }
  function yyhermite(X, N2) {
    const n = nativeInt(N2);
    if (n < 0 || isNaN(n)) {
      return makeList(symbol(HERMITE), X, N2);
    }
    if (issymbol(X)) {
      return yyhermite2(n, X);
    }
    return Eval(subst(yyhermite2(n, symbol(SECRETX)), symbol(SECRETX), X));
  }
  function yyhermite2(n, p1) {
    let Y1 = Constants.zero;
    let temp = Constants.one;
    for (let i = 0; i < n; i++) {
      const Y0 = Y1;
      Y1 = temp;
      temp = multiply(subtract(multiply(p1, Y1), multiply(integer(i), Y0)), integer(2));
    }
    return temp;
  }

  // bazel-out/k8-fastbuild/bin/sources/hilbert.js
  function hilbert(N2) {
    const n = nativeInt(N2);
    if (n < 2) {
      return makeList(symbol(HILBERT), N2);
    }
    const A = zero_matrix(n, n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        A.tensor.elem[i * n + j] = inverse(integer(i + j + 1));
      }
    }
    return A;
  }

  // bazel-out/k8-fastbuild/bin/sources/cofactor.js
  function Eval_cofactor(p1) {
    const p2 = Eval(cadr(p1));
    if (!is_square_matrix(p2)) {
      stop("cofactor: 1st arg: square matrix expected");
    }
    const n = p2.tensor.dim[0];
    const i = evaluate_integer(caddr(p1));
    if (i < 1 || i > n) {
      stop("cofactor: 2nd arg: row index expected");
    }
    const j = evaluate_integer(cadddr(p1));
    if (j < 1 || j > n) {
      stop("cofactor: 3rd arg: column index expected");
    }
    return cofactor(p2, n, i - 1, j - 1);
  }
  function cofactor(p, n, row, col) {
    const elements = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== row && j !== col) {
          elements.push(p.tensor.elem[n * i + j]);
        }
      }
    }
    let result = determinant(elements, n - 1);
    if ((row + col) % 2) {
      result = negate(result);
    }
    return result;
  }

  // bazel-out/k8-fastbuild/bin/sources/adj.js
  function Eval_adj(p1) {
    return adj(Eval(cadr(p1)));
  }
  function adj(p1) {
    if (!is_square_matrix(p1)) {
      stop("adj: square matrix expected");
    }
    const n = p1.tensor.dim[0];
    const p2 = alloc_tensor(n * n);
    p2.tensor.ndim = 2;
    p2.tensor.dim[0] = n;
    p2.tensor.dim[1] = n;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        p2.tensor.elem[n * j + i] = cofactor(p1, n, i, j);
      }
    }
    return p2;
  }

  // bazel-out/k8-fastbuild/bin/sources/inner.js
  function Eval_inner(p1) {
    const args = [];
    args.push(car(cdr(p1)));
    const secondArgument = car(cdr(cdr(p1)));
    if (secondArgument === symbol(NIL)) {
      stop("pattern needs at least a template and a transformed version");
    }
    let moreArgs = cdr(cdr(p1));
    while (moreArgs !== symbol(NIL)) {
      args.push(car(moreArgs));
      moreArgs = cdr(moreArgs);
    }
    if (args.length > 2) {
      let temp = makeList(symbol(INNER), args[args.length - 2], args[args.length - 1]);
      for (let i = 2; i < args.length; i++) {
        temp = makeList(symbol(INNER), args[args.length - i - 1], temp);
      }
      return Eval_inner(temp);
    }
    let operands = [];
    get_innerprod_factors(p1, operands);
    let refinedOperands = [];
    for (let i = 0; i < operands.length; i++) {
      if (operands[i] !== symbol(SYMBOL_IDENTITY_MATRIX)) {
        refinedOperands.push(operands[i]);
      }
    }
    operands = refinedOperands;
    refinedOperands = [];
    if (operands.length > 1) {
      let shift = 0;
      for (let i = 0; i < operands.length; i++) {
        if (i + shift + 1 <= operands.length - 1) {
          if (!(isNumericAtomOrTensor(operands[i + shift]) || isNumericAtomOrTensor(operands[i + shift + 1]))) {
            const arg1 = inv(Eval(operands[i + shift]));
            const arg2 = Eval(operands[i + shift + 1]);
            const difference = subtract(arg1, arg2);
            if (isZeroAtomOrTensor(difference)) {
              shift += 1;
            } else {
              refinedOperands.push(operands[i + shift]);
            }
          } else {
            refinedOperands.push(operands[i + shift]);
          }
        } else {
          break;
        }
        if (i + shift === operands.length - 2) {
          refinedOperands.push(operands[operands.length - 1]);
        }
        if (i + shift >= operands.length - 1) {
          break;
        }
      }
      operands = refinedOperands;
    }
    if (operands.length == 0) {
      return symbol(SYMBOL_IDENTITY_MATRIX);
    }
    operands = operands.map(Eval);
    return operands.reduce(inner);
  }
  function inner(p1, p2) {
    if (isnegativeterm(p2) && isnegativeterm(p1)) {
      p2 = negate(p2);
      p1 = negate(p1);
    }
    if (isinnerordot(p1)) {
      p2 = inner(car(cdr(cdr(p1))), p2);
      p1 = car(cdr(p1));
    }
    if (p1 === symbol(SYMBOL_IDENTITY_MATRIX)) {
      return p2;
    } else if (p2 === symbol(SYMBOL_IDENTITY_MATRIX)) {
      return p1;
    }
    if (istensor(p1) && istensor(p2)) {
      return inner_f(p1, p2);
    } else {
      if (!(isNumericAtomOrTensor(p1) || isNumericAtomOrTensor(p2))) {
        const subtractionResult = subtract(p1, inv(p2));
        if (isZeroAtomOrTensor(subtractionResult)) {
          return symbol(SYMBOL_IDENTITY_MATRIX);
        }
      }
      if (defs.expanding && isadd(p1)) {
        return p1.tail().reduce((a, b) => add(a, inner(b, p2)), Constants.zero);
      }
      if (defs.expanding && isadd(p2)) {
        return p2.tail().reduce((a, b) => add(a, inner(p1, b)), Constants.zero);
      }
      if (istensor(p1) && isNumericAtom(p2)) {
        return tensor_times_scalar(p1, p2);
      } else if (isNumericAtom(p1) && istensor(p2)) {
        return scalar_times_tensor(p1, p2);
      } else if (isNumericAtom(p1) || isNumericAtom(p2)) {
        return multiply(p1, p2);
      } else {
        return makeList(symbol(INNER), p1, p2);
      }
    }
  }
  function inner_f(p1, p2) {
    const n = p1.tensor.dim[p1.tensor.ndim - 1];
    if (n !== p2.tensor.dim[0]) {
      breakpoint;
      stop("inner: tensor dimension check");
    }
    const ndim = p1.tensor.ndim + p2.tensor.ndim - 2;
    if (ndim > MAXDIM) {
      stop("inner: rank of result exceeds maximum");
    }
    const a = p1.tensor.elem;
    const b = p2.tensor.elem;
    const ak = p1.tensor.dim.slice(0, p1.tensor.dim.length - 1).reduce((a2, b2) => a2 * b2, 1);
    const bk = p2.tensor.dim.slice(1).reduce((a2, b2) => a2 * b2, 1);
    const p3 = alloc_tensor(ak * bk);
    const c = p3.tensor.elem;
    for (let i = 0; i < ak; i++) {
      for (let j = 0; j < n; j++) {
        if (isZeroAtomOrTensor(a[i * n + j])) {
          continue;
        }
        for (let k = 0; k < bk; k++) {
          c[i * bk + k] = add(multiply(a[i * n + j], b[j * bk + k]), c[i * bk + k]);
        }
      }
    }
    if (ndim === 0) {
      return p3.tensor.elem[0];
    } else {
      p3.tensor.ndim = ndim;
      p3.tensor.dim = [
        ...p1.tensor.dim.slice(0, p1.tensor.ndim - 1),
        ...p2.tensor.dim.slice(1, p2.tensor.ndim)
      ];
      return p3;
    }
  }
  function get_innerprod_factors(tree, factors_accumulator) {
    if (!iscons(tree)) {
      add_factor_to_accumulator(tree, factors_accumulator);
      return;
    }
    if (cdr(tree) === symbol(NIL)) {
      get_innerprod_factors(car(tree), factors_accumulator);
      return;
    }
    if (isinnerordot(tree)) {
      get_innerprod_factors(car(cdr(tree)), factors_accumulator);
      get_innerprod_factors(cdr(cdr(tree)), factors_accumulator);
      return;
    }
    add_factor_to_accumulator(tree, factors_accumulator);
  }
  function add_factor_to_accumulator(tree, factors_accumulator) {
    if (tree !== symbol(NIL)) {
      factors_accumulator.push(tree);
    }
  }

  // bazel-out/k8-fastbuild/bin/sources/inv.js
  function inv(p1) {
    if (isinv(p1)) {
      return car(cdr(p1));
    }
    if (isidentitymatrix(p1)) {
      return p1;
    }
    if (defs.expanding && isinnerordot(p1)) {
      const accumulator = iscons(p1) ? p1.tail() : [];
      const inverses = accumulator.map(inv);
      for (let i = inverses.length - 1; i > 0; i--) {
        inverses[i - 1] = inner(inverses[i], inverses[i - 1]);
      }
      return inverses[0];
    }
    if (!is_square_matrix(p1)) {
      return makeList(symbol(INV), p1);
    }
    if (isNumericAtomOrTensor(p1)) {
      return yyinvg(p1);
    }
    const p2 = det(p1);
    if (isZeroAtomOrTensor(p2)) {
      stop("inverse of singular matrix");
    }
    return divide(adj(p1), p2);
  }
  function invg(p1) {
    if (!is_square_matrix(p1)) {
      return makeList(symbol(INVG), p1);
    }
    return yyinvg(p1);
  }
  function yyinvg(p1) {
    const n = p1.tensor.dim[0];
    const units = new Array(n * n);
    units.fill(Constants.zero);
    for (let i = 0; i < n; i++) {
      units[i * n + i] = Constants.one;
    }
    const inverse2 = INV_decomp(units, p1.tensor.elem, n);
    const result = alloc_tensor(n * n);
    result.tensor.ndim = 2;
    result.tensor.dim[0] = n;
    result.tensor.dim[1] = n;
    result.tensor.elem = inverse2;
    return result;
  }
  function INV_decomp(units, elements, n) {
    for (let d = 0; d < n; d++) {
      if (equal(elements[n * d + d], Constants.zero)) {
        let i = 0;
        for (i = d + 1; i < n; i++) {
          if (!equal(elements[n * i + d], Constants.zero)) {
            break;
          }
        }
        if (i === n) {
          stop("inverse of singular matrix");
        }
        for (let j = 0; j < n; j++) {
          let p22 = elements[n * d + j];
          elements[n * d + j] = elements[n * i + j];
          elements[n * i + j] = p22;
          p22 = units[n * d + j];
          units[n * d + j] = units[n * i + j];
          units[n * i + j] = p22;
        }
      }
      const p2 = elements[n * d + d];
      for (let j = 0; j < n; j++) {
        if (j > d) {
          elements[n * d + j] = divide(elements[n * d + j], p2);
        }
        units[n * d + j] = divide(units[n * d + j], p2);
      }
      for (let i = 0; i < n; i++) {
        if (i === d) {
          continue;
        }
        const p22 = elements[n * i + d];
        for (let j = 0; j < n; j++) {
          if (j > d) {
            elements[n * i + j] = subtract(elements[n * i + j], multiply(elements[n * d + j], p22));
          }
          units[n * i + j] = subtract(units[n * i + j], multiply(units[n * d + j], p22));
        }
      }
    }
    return units;
  }

  // bazel-out/k8-fastbuild/bin/sources/besselj.js
  function Eval_besselj(p1) {
    return besselj(Eval(cadr(p1)), Eval(caddr(p1)));
  }
  function besselj(p1, p2) {
    return yybesselj(p1, p2);
  }
  function yybesselj(X, N2) {
    const n = nativeInt(N2);
    if (isdouble(X) && !isNaN(n)) {
      const d = jn(n, X.d);
      return double(d);
    }
    if (isZeroAtomOrTensor(X) && isZeroAtomOrTensor(N2)) {
      return Constants.one;
    }
    if (isZeroAtomOrTensor(X) && !isNaN(n)) {
      return Constants.zero;
    }
    if (N2.k === NUM && MEQUAL(N2.q.b, 2)) {
      if (MEQUAL(N2.q.a, 1)) {
        const twoOverPi = defs.evaluatingAsFloats ? double(2 / Math.PI) : divide(integer(2), symbol(PI));
        return multiply(power(divide(twoOverPi, X), rational(1, 2)), sine(X));
      }
      if (MEQUAL(N2.q.a, -1)) {
        const twoOverPi = defs.evaluatingAsFloats ? double(2 / Math.PI) : divide(integer(2), symbol(PI));
        return multiply(power(divide(twoOverPi, X), rational(1, 2)), cosine(X));
      }
      const SGN2 = integer(MSIGN(N2.q.a));
      return subtract(multiply(multiply(divide(integer(2), X), subtract(N2, SGN2)), besselj(X, subtract(N2, SGN2))), besselj(X, subtract(N2, multiply(integer(2), SGN2))));
    }
    if (isnegativeterm(X)) {
      return multiply(multiply(power(negate(X), N2), power(X, negate(N2))), makeList(symbol(BESSELJ), negate(X), N2));
    }
    if (isnegativeterm(N2)) {
      return multiply(power(Constants.negOne, N2), makeList(symbol(BESSELJ), X, negate(N2)));
    }
    return makeList(symbol(BESSELJ), X, N2);
  }

  // bazel-out/k8-fastbuild/bin/sources/bessely.js
  function Eval_bessely(p1) {
    return bessely(Eval(cadr(p1)), Eval(caddr(p1)));
  }
  function bessely(p1, p2) {
    return yybessely(p1, p2);
  }
  function yybessely(X, N2) {
    const n = nativeInt(N2);
    if (isdouble(X) && !isNaN(n)) {
      const d = yn(n, X.d);
      return double(d);
    }
    if (isnegativeterm(N2)) {
      return multiply(power(Constants.negOne, N2), makeList(symbol(BESSELY), X, negate(N2)));
    }
    return makeList(symbol(BESSELY), X, N2);
  }

  // bazel-out/k8-fastbuild/bin/sources/cosh.js
  function Eval_cosh(p1) {
    return ycosh(Eval(cadr(p1)));
  }
  function ycosh(p1) {
    if (car(p1) === symbol(ARCCOSH)) {
      return cadr(p1);
    }
    if (isdouble(p1)) {
      let d = Math.cosh(p1.d);
      if (Math.abs(d) < 1e-10) {
        d = 0;
      }
      return double(d);
    }
    if (isZeroAtomOrTensor(p1)) {
      return Constants.one;
    }
    return makeList(symbol(COSH), p1);
  }

  // bazel-out/k8-fastbuild/bin/sources/dirac.js
  function Eval_dirac(p1) {
    return dirac(Eval(cadr(p1)));
  }
  function dirac(p1) {
    return ydirac(p1);
  }
  function ydirac(p1) {
    if (isdouble(p1)) {
      if (p1.d === 0) {
        return Constants.one;
      }
      return Constants.zero;
    }
    if (isrational(p1)) {
      if (MZERO(mmul(p1.q.a, p1.q.b))) {
        return Constants.one;
      }
      return Constants.zero;
    }
    if (ispower(p1)) {
      return makeList(symbol(DIRAC), cadr(p1));
    }
    if (isnegativeterm(p1)) {
      return makeList(symbol(DIRAC), negate(p1));
    }
    if (isnegativeterm(p1) || isadd(p1) && isnegativeterm(cadr(p1))) {
      p1 = negate(p1);
    }
    return makeList(symbol(DIRAC), p1);
  }

  // bazel-out/k8-fastbuild/bin/sources/partition.js
  function partition(p1, p2) {
    let p3 = Constants.one;
    let p4 = p3;
    p1 = cdr(p1);
    if (!iscons(p1)) {
      return [p3, p4];
    }
    for (const p of p1) {
      if (Find(p, p2)) {
        p4 = multiply(p4, p);
      } else {
        p3 = multiply(p3, p);
      }
    }
    return [p3, p4];
  }

  // bazel-out/k8-fastbuild/bin/sources/scan.js
  var T_INTEGER = 1001;
  var T_DOUBLE = 1002;
  var T_SYMBOL = 1003;
  var T_FUNCTION = 1004;
  var T_NEWLINE = 1006;
  var T_STRING = 1007;
  var T_GTEQ = 1008;
  var T_LTEQ = 1009;
  var T_EQ = 1010;
  var T_NEQ = 1011;
  var T_QUOTASSIGN = 1012;
  var token = "";
  var newline_flag = 0;
  var meta_mode = 0;
  var input_str = 0;
  var scan_str = 0;
  var token_str = 0;
  var token_buf = "";
  var lastFoundSymbol = null;
  var symbolsRightOfAssignment = null;
  var symbolsLeftOfAssignment = null;
  var isSymbolLeftOfAssignment = null;
  var scanningParameters = null;
  var functionInvokationsScanningStack = null;
  var skipRootVariableToBeSolved = false;
  var assignmentFound = null;
  var scanned = "";
  function scan(s) {
    if (DEBUG) {
      console.log(`#### scanning ${s}`);
    }
    lastFoundSymbol = null;
    symbolsRightOfAssignment = [];
    symbolsLeftOfAssignment = [];
    isSymbolLeftOfAssignment = true;
    scanningParameters = [];
    functionInvokationsScanningStack = [""];
    assignmentFound = false;
    scanned = s;
    meta_mode = 0;
    const prev_expanding = defs.expanding;
    defs.expanding = true;
    input_str = 0;
    scan_str = 0;
    get_next_token();
    if (token === "") {
      defs.expanding = prev_expanding;
      return [0, symbol(NIL)];
    }
    const expr = scan_stmt();
    defs.expanding = prev_expanding;
    if (!assignmentFound) {
      defs.symbolsInExpressionsWithoutAssignments = defs.symbolsInExpressionsWithoutAssignments.concat(symbolsLeftOfAssignment);
    }
    return [token_str - input_str, expr];
  }
  function scan_meta(s) {
    scanned = s;
    meta_mode = 1;
    const prev_expanding = defs.expanding;
    defs.expanding = true;
    input_str = 0;
    scan_str = 0;
    get_next_token();
    if (token === "") {
      defs.expanding = prev_expanding;
      return symbol(NIL);
    }
    const stmt = scan_stmt();
    defs.expanding = prev_expanding;
    return stmt;
  }
  function scan_stmt() {
    let result = scan_relation();
    let assignmentIsOfQuotedType = false;
    if (token === T_QUOTASSIGN) {
      assignmentIsOfQuotedType = true;
    }
    if (token === T_QUOTASSIGN || token === "=") {
      const symbolLeftOfAssignment = lastFoundSymbol;
      if (DEBUG) {
        console.log("assignment!");
      }
      assignmentFound = true;
      isSymbolLeftOfAssignment = false;
      get_next_token();
      let rhs = scan_relation();
      if (assignmentIsOfQuotedType) {
        rhs = makeList(symbol(QUOTE), rhs);
      }
      result = makeList(symbol(SETQ), result, rhs);
      isSymbolLeftOfAssignment = true;
      if (defs.codeGen) {
        const indexOfSymbolLeftOfAssignment = symbolsRightOfAssignment.indexOf(symbolLeftOfAssignment);
        if (indexOfSymbolLeftOfAssignment !== -1) {
          symbolsRightOfAssignment.splice(indexOfSymbolLeftOfAssignment, 1);
          defs.symbolsHavingReassignments.push(symbolLeftOfAssignment);
        }
        if (DEBUG) {
          console.log(`locally, ${symbolLeftOfAssignment} depends on: `);
          for (const i of Array.from(symbolsRightOfAssignment)) {
            console.log(`  ${i}`);
          }
        }
        if (defs.symbolsDependencies[symbolLeftOfAssignment] == null) {
          defs.symbolsDependencies[symbolLeftOfAssignment] = [];
        }
        const existingDependencies = defs.symbolsDependencies[symbolLeftOfAssignment];
        for (const i of Array.from(symbolsRightOfAssignment)) {
          if (existingDependencies.indexOf(i) === -1) {
            existingDependencies.push(i);
          }
        }
        symbolsRightOfAssignment = [];
      }
    }
    return result;
  }
  function scan_relation() {
    let result = scan_expression();
    let rhs;
    switch (token) {
      case T_EQ:
        get_next_token();
        rhs = scan_expression();
        return makeList(symbol(TESTEQ), result, rhs);
      case T_NEQ:
        get_next_token();
        rhs = scan_expression();
        return makeList(symbol(NOT), makeList(symbol(TESTEQ), result, rhs));
      case T_LTEQ:
        get_next_token();
        rhs = scan_expression();
        return makeList(symbol(TESTLE), result, rhs);
      case T_GTEQ:
        get_next_token();
        rhs = scan_expression();
        return makeList(symbol(TESTGE), result, rhs);
      case "<":
        get_next_token();
        rhs = scan_expression();
        return makeList(symbol(TESTLT), result, rhs);
      case ">":
        get_next_token();
        rhs = scan_expression();
        return makeList(symbol(TESTGT), result, rhs);
    }
    return result;
  }
  function scan_expression() {
    const terms = [symbol(ADD)];
    switch (token) {
      case "+":
        get_next_token();
        terms.push(scan_term());
        break;
      case "-":
        get_next_token();
        terms.push(negate(scan_term()));
        break;
      default:
        terms.push(scan_term());
    }
    while (newline_flag === 0 && (token === "+" || token === "-")) {
      if (token === "+") {
        get_next_token();
        terms.push(scan_term());
      } else {
        get_next_token();
        terms.push(negate(scan_term()));
      }
    }
    if (terms.length === 2) {
      return terms[1];
    }
    return makeList(...terms);
  }
  function tokenCharCode() {
    if (typeof token == "string") {
      return token.charCodeAt(0);
    }
    return void 0;
  }
  function is_factor() {
    if (tokenCharCode() === dotprod_unicode) {
      return true;
    }
    switch (token) {
      case "*":
      case "/":
        return true;
      case "(":
      case T_SYMBOL:
      case T_FUNCTION:
      case T_INTEGER:
      case T_DOUBLE:
      case T_STRING:
        if (newline_flag) {
          scan_str = token_str;
          return false;
        } else {
          return true;
        }
    }
    return false;
  }
  function simplify_1_in_products(factors2) {
    if (factors2.length > 0 && isrational(factors2[factors2.length - 1]) && equaln(factors2[factors2.length - 1], 1)) {
      factors2.pop();
    }
  }
  function multiply_consecutive_constants(factors2) {
    if (factors2.length > 1 && isNumericAtom(factors2[factors2.length - 2]) && isNumericAtom(factors2[factors2.length - 1])) {
      const arg2 = factors2.pop();
      const arg1 = factors2.pop();
      factors2.push(multiply(arg1, arg2));
    }
  }
  function scan_term() {
    let results = [scan_factor()];
    if (parse_time_simplifications) {
      simplify_1_in_products(results);
    }
    while (is_factor()) {
      if (token === "*") {
        get_next_token();
        results.push(scan_factor());
      } else if (token === "/") {
        simplify_1_in_products(results);
        get_next_token();
        results.push(inverse(scan_factor()));
      } else if (tokenCharCode() === dotprod_unicode) {
        get_next_token();
        results.push(makeList(symbol(INNER), results.pop(), scan_factor()));
      } else {
        results.push(scan_factor());
      }
      if (parse_time_simplifications) {
        multiply_consecutive_constants(results);
        simplify_1_in_products(results);
      }
    }
    if (results.length === 0) {
      return Constants.one;
    } else if (results.length == 1) {
      return results[0];
    }
    return makeList(symbol(MULTIPLY), ...results);
  }
  function scan_power(lhs) {
    if (token === "^") {
      get_next_token();
      return makeList(symbol(POWER), lhs, scan_factor());
    }
    return lhs;
  }
  function scan_index(lhs) {
    get_next_token();
    const items = [symbol(INDEX), lhs, scan_expression()];
    while (token === ",") {
      get_next_token();
      items.push(scan_expression());
    }
    if (token !== "]") {
      scan_error("] expected");
    }
    get_next_token();
    return makeList(...items);
  }
  function scan_factor() {
    let firstFactorIsNumber = false;
    let result;
    if (token === "(") {
      result = scan_subexpr();
    } else if (token === T_SYMBOL) {
      result = scan_symbol();
    } else if (token === T_FUNCTION) {
      result = scan_function_call_with_function_name();
    } else if (token === "[") {
      result = scan_tensor();
    } else if (token === T_INTEGER) {
      firstFactorIsNumber = true;
      result = bignum_scan_integer(token_buf);
      token = get_next_token();
    } else if (token === T_DOUBLE) {
      firstFactorIsNumber = true;
      result = bignum_scan_float(token_buf);
      token = get_next_token();
    } else if (token === T_STRING) {
      result = scan_string();
    } else {
      scan_error("syntax error");
    }
    while (token === "[" || token === "(" && newline_flag === 0 && !firstFactorIsNumber) {
      if (token === "[") {
        result = scan_index(result);
      } else if (token === "(") {
        result = scan_function_call_without_function_name(result);
      }
    }
    while (token === "!") {
      get_next_token();
      result = makeList(symbol(FACTORIAL), result);
    }
    while (tokenCharCode() === transpose_unicode) {
      get_next_token();
      result = makeList(symbol(TRANSPOSE), result);
    }
    return scan_power(result);
  }
  function addSymbolRightOfAssignment(theSymbol) {
    if (predefinedSymbolsInGlobalScope_doNotTrackInDependencies.indexOf(theSymbol) === -1 && symbolsRightOfAssignment.indexOf(theSymbol) === -1 && symbolsRightOfAssignment.indexOf("'" + theSymbol) === -1 && !skipRootVariableToBeSolved) {
      if (DEBUG) {
        console.log(`... adding symbol: ${theSymbol} to the set of the symbols right of assignment`);
      }
      let prefixVar = "";
      for (let i = 1; i < functionInvokationsScanningStack.length; i++) {
        if (functionInvokationsScanningStack[i] !== "") {
          prefixVar += functionInvokationsScanningStack[i] + "_" + i + "_";
        }
      }
      theSymbol = prefixVar + theSymbol;
      symbolsRightOfAssignment.push(theSymbol);
    }
  }
  function addSymbolLeftOfAssignment(theSymbol) {
    if (predefinedSymbolsInGlobalScope_doNotTrackInDependencies.indexOf(theSymbol) === -1 && symbolsLeftOfAssignment.indexOf(theSymbol) === -1 && symbolsLeftOfAssignment.indexOf("'" + theSymbol) === -1 && !skipRootVariableToBeSolved) {
      if (DEBUG) {
        console.log(`... adding symbol: ${theSymbol} to the set of the symbols left of assignment`);
      }
      let prefixVar = "";
      for (let i = 1; i < functionInvokationsScanningStack.length; i++) {
        if (functionInvokationsScanningStack[i] !== "") {
          prefixVar += functionInvokationsScanningStack[i] + "_" + i + "_";
        }
      }
      theSymbol = prefixVar + theSymbol;
      symbolsLeftOfAssignment.push(theSymbol);
    }
  }
  function scan_symbol() {
    if (token !== T_SYMBOL) {
      scan_error("symbol expected");
    }
    let result;
    if (meta_mode && typeof token_buf == "string" && token_buf.length === 1) {
      switch (token_buf[0]) {
        case "a":
          result = symbol(METAA);
          break;
        case "b":
          result = symbol(METAB);
          break;
        case "x":
          result = symbol(METAX);
          break;
        default:
          result = usr_symbol(token_buf);
      }
    } else {
      result = usr_symbol(token_buf);
    }
    if (scanningParameters.length === 0) {
      if (DEBUG) {
        console.log(`out of scanning parameters, processing ${token_buf}`);
      }
      lastFoundSymbol = token_buf;
      if (isSymbolLeftOfAssignment) {
        addSymbolLeftOfAssignment(token_buf);
      }
    } else {
      if (DEBUG) {
        console.log(`still scanning parameters, skipping ${token_buf}`);
      }
      if (isSymbolLeftOfAssignment) {
        addSymbolRightOfAssignment("'" + token_buf);
      }
    }
    if (DEBUG) {
      console.log(`found symbol: ${token_buf} left of assignment: ${isSymbolLeftOfAssignment}`);
    }
    if (!isSymbolLeftOfAssignment) {
      addSymbolRightOfAssignment(token_buf);
    }
    get_next_token();
    return result;
  }
  function scan_string() {
    const result = new Str(token_buf);
    get_next_token();
    return result;
  }
  function scan_function_call_with_function_name() {
    if (DEBUG) {
      console.log("-- scan_function_call_with_function_name start");
    }
    let n = 1;
    const p = usr_symbol(token_buf);
    const fcall = [p];
    const functionName = token_buf;
    if (functionName === "roots" || functionName === "defint" || functionName === "sum" || functionName === "product" || functionName === "for") {
      functionInvokationsScanningStack.push(token_buf);
    }
    lastFoundSymbol = token_buf;
    if (!isSymbolLeftOfAssignment) {
      addSymbolRightOfAssignment(token_buf);
    }
    get_next_token();
    get_next_token();
    scanningParameters.push(true);
    if (token !== ")") {
      fcall.push(scan_stmt());
      n++;
      while (token === ",") {
        get_next_token();
        if (n === 2 && functionInvokationsScanningStack[functionInvokationsScanningStack.length - 1].indexOf("roots") !== -1) {
          symbolsRightOfAssignment = symbolsRightOfAssignment.filter((x) => !new RegExp("roots_" + (functionInvokationsScanningStack.length - 1) + "_" + token_buf).test(x));
          skipRootVariableToBeSolved = true;
        }
        if (n === 2 && functionInvokationsScanningStack[functionInvokationsScanningStack.length - 1].indexOf("sum") !== -1) {
          symbolsRightOfAssignment = symbolsRightOfAssignment.filter((x) => !new RegExp("sum_" + (functionInvokationsScanningStack.length - 1) + "_" + token_buf).test(x));
          skipRootVariableToBeSolved = true;
        }
        if (n === 2 && functionInvokationsScanningStack[functionInvokationsScanningStack.length - 1].indexOf("product") !== -1) {
          symbolsRightOfAssignment = symbolsRightOfAssignment.filter((x) => !new RegExp("product_" + (functionInvokationsScanningStack.length - 1) + "_" + token_buf).test(x));
          skipRootVariableToBeSolved = true;
        }
        if (n === 2 && functionInvokationsScanningStack[functionInvokationsScanningStack.length - 1].indexOf("for") !== -1) {
          symbolsRightOfAssignment = symbolsRightOfAssignment.filter((x) => !new RegExp("for_" + (functionInvokationsScanningStack.length - 1) + "_" + token_buf).test(x));
          skipRootVariableToBeSolved = true;
        }
        if (functionInvokationsScanningStack[functionInvokationsScanningStack.length - 1].indexOf("defint") !== -1 && (n === 2 || n > 2 && (n - 2) % 3 === 0)) {
          symbolsRightOfAssignment = symbolsRightOfAssignment.filter((x) => !new RegExp("defint_" + (functionInvokationsScanningStack.length - 1) + "_" + token_buf).test(x));
          skipRootVariableToBeSolved = true;
        }
        fcall.push(scan_stmt());
        skipRootVariableToBeSolved = false;
        n++;
      }
      if (n === 2 && functionInvokationsScanningStack[functionInvokationsScanningStack.length - 1].indexOf("roots") !== -1) {
        symbolsRightOfAssignment = symbolsRightOfAssignment.filter((x) => !new RegExp("roots_" + (functionInvokationsScanningStack.length - 1) + "_x").test(x));
      }
    }
    scanningParameters.pop();
    for (let i = 0; i <= symbolsRightOfAssignment.length; i++) {
      if (symbolsRightOfAssignment[i] != null) {
        if (functionName === "roots") {
          symbolsRightOfAssignment[i] = symbolsRightOfAssignment[i].replace(new RegExp("roots_" + (functionInvokationsScanningStack.length - 1) + "_"), "");
        }
        if (functionName === "defint") {
          symbolsRightOfAssignment[i] = symbolsRightOfAssignment[i].replace(new RegExp("defint_" + (functionInvokationsScanningStack.length - 1) + "_"), "");
        }
        if (functionName === "sum") {
          symbolsRightOfAssignment[i] = symbolsRightOfAssignment[i].replace(new RegExp("sum_" + (functionInvokationsScanningStack.length - 1) + "_"), "");
        }
        if (functionName === "product") {
          symbolsRightOfAssignment[i] = symbolsRightOfAssignment[i].replace(new RegExp("product_" + (functionInvokationsScanningStack.length - 1) + "_"), "");
        }
        if (functionName === "for") {
          symbolsRightOfAssignment[i] = symbolsRightOfAssignment[i].replace(new RegExp("for_" + (functionInvokationsScanningStack.length - 1) + "_"), "");
        }
      }
    }
    if (token !== ")") {
      scan_error(") expected");
    }
    get_next_token();
    if (functionName === "roots" || functionName === "defint" || functionName === "sum" || functionName === "product" || functionName === "for") {
      functionInvokationsScanningStack.pop();
    }
    if (functionName === symbol(PATTERN).printname) {
      defs.patternHasBeenFound = true;
    }
    if (DEBUG) {
      console.log("-- scan_function_call_with_function_name end");
    }
    return makeList(...fcall);
  }
  function scan_function_call_without_function_name(lhs) {
    if (DEBUG) {
      console.log("-- scan_function_call_without_function_name start");
    }
    const func = makeList(symbol(EVAL), lhs);
    const fcall = [func];
    get_next_token();
    scanningParameters.push(true);
    if (token !== ")") {
      fcall.push(scan_stmt());
      while (token === ",") {
        get_next_token();
        fcall.push(scan_stmt());
      }
    }
    scanningParameters.pop();
    if (token !== ")") {
      scan_error(") expected");
    }
    get_next_token();
    if (DEBUG) {
      console.log(`-- scan_function_call_without_function_name end: ${fcall[fcall.length - 1]}`);
    }
    return makeList(...fcall);
  }
  function scan_subexpr() {
    const n = 0;
    if (token !== "(") {
      scan_error("( expected");
    }
    token = get_next_token();
    const result = scan_stmt();
    if (token !== ")") {
      scan_error(") expected");
    }
    get_next_token();
    return result;
  }
  function scan_tensor() {
    if (token !== "[") {
      scan_error("[ expected");
    }
    get_next_token();
    const elements = [scan_stmt()];
    while (token === ",") {
      token = get_next_token();
      elements.push(scan_stmt());
    }
    const result = build_tensor(elements);
    if (token !== "]") {
      scan_error("] expected");
    }
    get_next_token();
    return result;
  }
  function scan_error(errmsg) {
    defs.errorMessage = "";
    while (input_str !== scan_str) {
      if ((scanned[input_str] === "\n" || scanned[input_str] === "\r") && input_str + 1 === scan_str) {
        break;
      }
      defs.errorMessage += scanned[input_str++];
    }
    defs.errorMessage += " ? ";
    while (scanned[input_str] && scanned[input_str] !== "\n" && scanned[input_str] !== "\r") {
      defs.errorMessage += scanned[input_str++];
    }
    defs.errorMessage += "\n";
    stop(errmsg);
  }
  function build_tensor(elements) {
    const p2 = alloc_tensor(elements.length);
    p2.tensor.ndim = 1;
    p2.tensor.dim[0] = elements.length;
    for (let i = 0; i < elements.length; i++) {
      p2.tensor.elem[i] = elements[i];
    }
    check_tensor_dimensions(p2);
    return p2;
  }
  function get_next_token() {
    newline_flag = 0;
    while (true) {
      get_token();
      if (token !== T_NEWLINE) {
        break;
      }
      newline_flag = 1;
    }
    if (DEBUG) {
      console.log(`get_next_token token: ${token}`);
    }
    return token;
  }
  function get_token() {
    while (isspace(scanned[scan_str])) {
      if (scanned[scan_str] === "\n" || scanned[scan_str] === "\r") {
        token = T_NEWLINE;
        scan_str++;
        return;
      }
      scan_str++;
    }
    token_str = scan_str;
    if (scan_str === scanned.length) {
      token = "";
      return;
    }
    if (isdigit(scanned[scan_str]) || scanned[scan_str] === ".") {
      while (isdigit(scanned[scan_str])) {
        scan_str++;
      }
      if (scanned[scan_str] === ".") {
        scan_str++;
        while (isdigit(scanned[scan_str])) {
          scan_str++;
        }
        if (scanned[scan_str] === "e" && (scanned[scan_str + 1] === "+" || scanned[scan_str + 1] === "-" || isdigit(scanned[scan_str + 1]))) {
          scan_str += 2;
          while (isdigit(scanned[scan_str])) {
            scan_str++;
          }
        }
        token = T_DOUBLE;
      } else {
        token = T_INTEGER;
      }
      update_token_buf(token_str, scan_str);
      return;
    }
    if (isalpha(scanned[scan_str])) {
      while (isalnumorunderscore(scanned[scan_str])) {
        scan_str++;
      }
      if (scanned[scan_str] === "(") {
        token = T_FUNCTION;
      } else {
        token = T_SYMBOL;
      }
      update_token_buf(token_str, scan_str);
      return;
    }
    if (scanned[scan_str] === '"') {
      scan_str++;
      while (scanned[scan_str] !== '"') {
        if (scan_str === scanned.length - 1) {
          scan_str++;
          scan_error("runaway string");
          scan_str--;
        }
        scan_str++;
      }
      scan_str++;
      token = T_STRING;
      update_token_buf(token_str + 1, scan_str - 1);
      return;
    }
    if (scanned[scan_str] === "#" || scanned[scan_str] === "-" && scanned[scan_str + 1] === "-") {
      while (scanned[scan_str] && scanned[scan_str] !== "\n" && scanned[scan_str] !== "\r") {
        scan_str++;
      }
      if (scanned[scan_str]) {
        scan_str++;
      }
      token = T_NEWLINE;
      return;
    }
    if (scanned[scan_str] === ":" && scanned[scan_str + 1] === "=") {
      scan_str += 2;
      token = T_QUOTASSIGN;
      return;
    }
    if (scanned[scan_str] === "=" && scanned[scan_str + 1] === "=") {
      scan_str += 2;
      token = T_EQ;
      return;
    }
    if (scanned[scan_str] === "!" && scanned[scan_str + 1] === "=") {
      scan_str += 2;
      token = T_NEQ;
      return;
    }
    if (scanned[scan_str] === "<" && scanned[scan_str + 1] === "=") {
      scan_str += 2;
      token = T_LTEQ;
      return;
    }
    if (scanned[scan_str] === ">" && scanned[scan_str + 1] === "=") {
      scan_str += 2;
      token = T_GTEQ;
      return;
    }
    token = scanned[scan_str++];
  }
  function update_token_buf(a, b) {
    token_buf = scanned.substring(a, b);
  }

  // bazel-out/k8-fastbuild/bin/sources/float.js
  function Eval_float(p1) {
    return evalFloats(() => {
      return Eval(yyfloat(Eval(cadr(p1))));
    });
  }
  function zzfloat(p1) {
    evalFloats(() => {
      p1 = Eval(p1);
      p1 = yyfloat(p1);
      p1 = Eval(p1);
    });
    return p1;
  }
  function yyfloat(p1) {
    return evalFloats(yyfloat_, p1);
  }
  function yyfloat_(p1) {
    if (iscons(p1)) {
      return makeList(...p1.map(yyfloat_));
    }
    if (istensor(p1)) {
      p1 = copy_tensor(p1);
      p1.tensor.elem = p1.tensor.elem.map(yyfloat_);
      return p1;
    }
    if (isrational(p1)) {
      return bignum_float(p1);
    }
    if (p1 === symbol(PI)) {
      return Constants.piAsDouble;
    }
    if (p1 === symbol(E)) {
      return double(Math.E);
    }
    return p1;
  }

  // bazel-out/k8-fastbuild/bin/sources/roots.js
  var log = {
    debug: (str) => {
      if (DEBUG) {
        console.log(str);
      }
    }
  };
  var flatten2 = (arr) => [].concat(...arr);
  function Eval_roots(POLY) {
    let X = cadr(POLY);
    let POLY1;
    if (car(X) === symbol(SETQ) || car(X) === symbol(TESTEQ)) {
      POLY1 = subtract(Eval(cadr(X)), Eval(caddr(X)));
    } else {
      X = Eval(X);
      if (car(X) === symbol(SETQ) || car(X) === symbol(TESTEQ)) {
        POLY1 = subtract(Eval(cadr(X)), Eval(caddr(X)));
      } else {
        POLY1 = X;
      }
    }
    X = Eval(caddr(POLY));
    const X1 = X === symbol(NIL) ? guess(POLY1) : X;
    if (!ispolyexpandedform(POLY1, X1)) {
      stop("roots: 1st argument is not a polynomial in the variable " + X1);
    }
    return roots(POLY1, X1);
  }
  function hasImaginaryCoeff(k) {
    return k.some((c) => iscomplexnumber(c));
  }
  function isSimpleRoot(k) {
    if (k.length <= 2) {
      return false;
    }
    if (isZeroAtomOrTensor(k[0])) {
      return false;
    }
    return k.slice(1, k.length - 1).every((el) => isZeroAtomOrTensor(el));
  }
  function normalisedCoeff(poly, x) {
    const miniStack = coeff(poly, x);
    const divideBy = miniStack[miniStack.length - 1];
    return miniStack.map((item) => divide(item, divideBy));
  }
  function roots(POLY, X) {
    if (defs.recursionLevelNestedRadicalsRemoval > 1) {
      return symbol(NIL);
    }
    log.debug(`checking if ${POLY} is a case of simple roots`);
    const k = normalisedCoeff(POLY, X);
    const results = [];
    if (isSimpleRoot(k)) {
      log.debug(`yes, ${k[k.length - 1]} is a case of simple roots`);
      const kn = k.length;
      const lastCoeff = k[0];
      const leadingCoeff = k.pop();
      const simpleRoots = getSimpleRoots(kn, leadingCoeff, lastCoeff);
      results.push(...simpleRoots);
    } else {
      const roots4 = roots2(POLY, X);
      results.push(...roots4);
    }
    const n = results.length;
    if (n === 0) {
      stop("roots: the polynomial is not factorable, try nroots");
    }
    if (n === 1) {
      return results[0];
    }
    sort(results);
    const tensor = alloc_tensor(n);
    tensor.tensor.ndim = 1;
    tensor.tensor.dim[0] = n;
    for (let i = 0; i < n; i++) {
      tensor.tensor.elem[i] = results[i];
    }
    console.log(`roots returning ${tensor}`);
    return tensor;
  }
  function getSimpleRoots(n, leadingCoeff, lastCoeff) {
    log.debug("getSimpleRoots");
    n = n - 1;
    const commonPart = divide(power(lastCoeff, rational(1, n)), power(leadingCoeff, rational(1, n)));
    const results = [];
    if (n % 2 === 0) {
      for (let i = 1; i <= n; i += 2) {
        const aSol = multiply(commonPart, power(Constants.negOne, rational(i, n)));
        results.push(aSol);
        results.push(negate(aSol));
      }
      return results;
    }
    for (let i = 1; i <= n; i++) {
      let sol = multiply(commonPart, power(Constants.negOne, rational(i, n)));
      if (i % 2 === 0) {
        sol = negate(sol);
      }
      results.push(sol);
    }
    return results;
  }
  function roots2(POLY, X) {
    const k = normalisedCoeff(POLY, X);
    if (!hasImaginaryCoeff(k)) {
      POLY = factorpoly(POLY, X);
    }
    if (ismultiply(POLY)) {
      const mapped = POLY.tail().map((p) => roots3(p, X));
      return flatten2(mapped);
    }
    return roots3(POLY, X);
  }
  function roots3(POLY, X) {
    if (ispower(POLY) && ispolyexpandedform(cadr(POLY), X) && isposint(caddr(POLY))) {
      const n = normalisedCoeff(cadr(POLY), X);
      return mini_solve(n);
    }
    if (ispolyexpandedform(POLY, X)) {
      const n = normalisedCoeff(POLY, X);
      return mini_solve(n);
    }
    return [];
  }
  function mini_solve(coefficients) {
    const n = coefficients.length;
    if (n === 2) {
      const A = coefficients.pop();
      const B = coefficients.pop();
      return _solveDegree1(A, B);
    }
    if (n === 3) {
      const A = coefficients.pop();
      const B = coefficients.pop();
      const C = coefficients.pop();
      return _solveDegree2(A, B, C);
    }
    if (n === 4) {
      const A = coefficients.pop();
      const B = coefficients.pop();
      const C = coefficients.pop();
      const D = coefficients.pop();
      return _solveDegree3(A, B, C, D);
    }
    if (n === 5) {
      const A = coefficients.pop();
      const B = coefficients.pop();
      const C = coefficients.pop();
      const D = coefficients.pop();
      const E2 = coefficients.pop();
      return _solveDegree4(A, B, C, D, E2);
    }
    return [];
  }
  function _solveDegree1(A, B) {
    return [negate(divide(B, A))];
  }
  function _solveDegree2(A, B, C) {
    const p6 = power(subtract(power(B, integer(2)), multiply(multiply(integer(4), A), C)), rational(1, 2));
    const result1 = divide(subtract(p6, B), multiply(A, integer(2)));
    const result2 = multiply(divide(negate(add(p6, B)), A), rational(1, 2));
    return [result1, result2];
  }
  function _solveDegree3(A, B, C, D) {
    const R_c3 = multiply(multiply(C, C), C);
    const R_b2 = multiply(B, B);
    const R_b3 = multiply(R_b2, B);
    const R_m4_b3_d = multiply(multiply(R_b3, D), integer(-4));
    const R_2_b3 = multiply(R_b3, integer(2));
    const R_3_a = multiply(integer(3), A);
    const R_a2_d = multiply(multiply(A, A), D);
    const R_27_a2_d = multiply(R_a2_d, integer(27));
    const R_m27_a2_d2 = multiply(multiply(R_a2_d, D), integer(-27));
    const R_a_b_c = multiply(multiply(A, C), B);
    const R_3_a_c = multiply(multiply(A, C), integer(3));
    const R_m4_a_c3 = multiply(integer(-4), multiply(A, R_c3));
    const R_m9_a_b_c = negate(multiply(R_a_b_c, integer(9)));
    const R_18_a_b_c_d = multiply(multiply(R_a_b_c, D), integer(18));
    const R_DELTA0 = subtract(R_b2, R_3_a_c);
    const R_b2_c2 = multiply(R_b2, multiply(C, C));
    const R_m_b_over_3a = divide(negate(B), R_3_a);
    const R_4_DELTA03 = multiply(power(R_DELTA0, integer(3)), integer(4));
    const R_DELTA0_toBeCheckedIfZero = absValFloat(simplify(R_DELTA0));
    const R_determinant = absValFloat(simplify(add_all([R_18_a_b_c_d, R_m4_b3_d, R_b2_c2, R_m4_a_c3, R_m27_a2_d2])));
    const R_DELTA1 = add_all([R_2_b3, R_m9_a_b_c, R_27_a2_d]);
    const R_Q = simplify(power(subtract(power(R_DELTA1, integer(2)), R_4_DELTA03), rational(1, 2)));
    log.debug(">>>>>>>>>>>>>>>> actually using cubic formula <<<<<<<<<<<<<<< ");
    log.debug(`cubic: D0: ${R_DELTA0}`);
    log.debug(`cubic: D0 as float: ${R_DELTA0_toBeCheckedIfZero}`);
    log.debug(`cubic: DETERMINANT: ${R_determinant}`);
    log.debug(`cubic: D1: ${R_DELTA1}`);
    if (isZeroAtomOrTensor(R_determinant)) {
      const data = {
        R_DELTA0_toBeCheckedIfZero,
        R_m_b_over_3a,
        R_DELTA0,
        R_b3,
        R_a_b_c
      };
      return _solveDegree3ZeroRDeterminant(A, B, C, D, data);
    }
    let C_CHECKED_AS_NOT_ZERO = false;
    let flipSignOFQSoCIsNotZero = false;
    let R_C;
    while (!C_CHECKED_AS_NOT_ZERO) {
      const arg1 = flipSignOFQSoCIsNotZero ? negate(R_Q) : R_Q;
      R_C = simplify(power(multiply(add(arg1, R_DELTA1), rational(1, 2)), rational(1, 3)));
      const R_C_simplified_toCheckIfZero = absValFloat(simplify(R_C));
      log.debug(`cubic: C: ${R_C}`);
      log.debug(`cubic: C as absval and float: ${R_C_simplified_toCheckIfZero}`);
      if (isZeroAtomOrTensor(R_C_simplified_toCheckIfZero)) {
        log.debug(" cubic: C IS ZERO flipping the sign");
        flipSignOFQSoCIsNotZero = true;
      } else {
        C_CHECKED_AS_NOT_ZERO = true;
      }
    }
    const R_6_a_C = multiply(multiply(R_C, R_3_a), integer(2));
    const i_sqrt3 = multiply(Constants.imaginaryunit, power(integer(3), rational(1, 2)));
    const one_plus_i_sqrt3 = add(Constants.one, i_sqrt3);
    const one_minus_i_sqrt3 = subtract(Constants.one, i_sqrt3);
    const R_C_over_3a = divide(R_C, R_3_a);
    const firstSolTerm1 = R_m_b_over_3a;
    const firstSolTerm2 = negate(R_C_over_3a);
    const firstSolTerm3 = negate(divide(R_DELTA0, multiply(R_C, R_3_a)));
    const firstSolution = simplify(add_all([firstSolTerm1, firstSolTerm2, firstSolTerm3]));
    const secondSolTerm1 = R_m_b_over_3a;
    const secondSolTerm2 = divide(multiply(R_C_over_3a, one_plus_i_sqrt3), integer(2));
    const secondSolTerm3 = divide(multiply(one_minus_i_sqrt3, R_DELTA0), R_6_a_C);
    const secondSolution = simplify(add_all([secondSolTerm1, secondSolTerm2, secondSolTerm3]));
    const thirdSolTerm1 = R_m_b_over_3a;
    const thirdSolTerm2 = divide(multiply(R_C_over_3a, one_minus_i_sqrt3), integer(2));
    const thirdSolTerm3 = divide(multiply(one_plus_i_sqrt3, R_DELTA0), R_6_a_C);
    const thirdSolution = simplify(add_all([thirdSolTerm1, thirdSolTerm2, thirdSolTerm3]));
    return [firstSolution, secondSolution, thirdSolution];
  }
  function _solveDegree3ZeroRDeterminant(A, B, C, D, common) {
    const { R_DELTA0_toBeCheckedIfZero, R_m_b_over_3a, R_DELTA0, R_b3, R_a_b_c } = common;
    if (isZeroAtomOrTensor(R_DELTA0_toBeCheckedIfZero)) {
      log.debug(" cubic: DETERMINANT IS ZERO and delta0 is zero");
      return [R_m_b_over_3a];
    }
    log.debug(" cubic: DETERMINANT IS ZERO and delta0 is not zero");
    const rootSolution = divide(subtract(multiply(A, multiply(D, integer(9))), multiply(B, C)), multiply(R_DELTA0, integer(2)));
    const numer_term1 = negate(R_b3);
    const numer_term2 = negate(multiply(A, multiply(A, multiply(D, integer(9)))));
    const numer_term3 = multiply(R_a_b_c, integer(4));
    const secondSolution = divide(add_all([numer_term3, numer_term2, numer_term1]), multiply(A, R_DELTA0));
    return [rootSolution, rootSolution, secondSolution];
  }
  function _solveDegree4(A, B, C, D, E2) {
    log.debug(">>>>>>>>>>>>>>>> actually using quartic formula <<<<<<<<<<<<<<< ");
    if (isZeroAtomOrTensor(B) && isZeroAtomOrTensor(D) && !isZeroAtomOrTensor(C) && !isZeroAtomOrTensor(E2)) {
      return _solveDegree4Biquadratic(A, B, C, D, E2);
    }
    if (!isZeroAtomOrTensor(B)) {
      return _solveDegree4NonzeroB(A, B, C, D, E2);
    } else {
      return _solveDegree4ZeroB(A, B, C, D, E2);
    }
  }
  function _solveDegree4Biquadratic(A, B, C, D, E2) {
    log.debug("biquadratic case");
    const biquadraticSolutions = roots(add(multiply(A, power(symbol(SECRETX), integer(2))), add(multiply(C, symbol(SECRETX)), E2)), symbol(SECRETX));
    const results = [];
    for (const sol of biquadraticSolutions.tensor.elem) {
      results.push(simplify(power(sol, rational(1, 2))));
      results.push(simplify(negate(power(sol, rational(1, 2)))));
    }
    return results;
  }
  function _solveDegree4ZeroB(A, B, C, D, E2) {
    const R_p = C;
    const R_q = D;
    const R_r = E2;
    const coeff2 = multiply(rational(5, 2), R_p);
    const coeff3 = subtract(multiply(integer(2), power(R_p, integer(2))), R_r);
    const coeff4 = add(multiply(rational(-1, 2), multiply(R_p, R_r)), add(divide(power(R_p, integer(3)), integer(2)), multiply(rational(-1, 8), power(R_q, integer(2)))));
    const arg1 = add(power(symbol(SECRETX), integer(3)), add(multiply(coeff2, power(symbol(SECRETX), integer(2))), add(multiply(coeff3, symbol(SECRETX)), coeff4)));
    log.debug(`resolventCubic: ${arg1}`);
    const resolventCubicSolutions = roots(arg1, symbol(SECRETX));
    log.debug(`resolventCubicSolutions: ${resolventCubicSolutions}`);
    let R_m = null;
    for (const sol of resolventCubicSolutions.tensor.elem) {
      log.debug(`examining solution: ${sol}`);
      const toBeCheckedIfZero = absValFloat(add(multiply(sol, integer(2)), R_p));
      log.debug(`abs value is: ${sol}`);
      if (!isZeroAtomOrTensor(toBeCheckedIfZero)) {
        R_m = sol;
        break;
      }
    }
    log.debug(`chosen solution: ${R_m}`);
    const sqrtPPlus2M = simplify(power(add(multiply(R_m, integer(2)), R_p), rational(1, 2)));
    const twoQOversqrtPPlus2M = simplify(divide(multiply(R_q, integer(2)), sqrtPPlus2M));
    const threePPlus2M = add(multiply(R_p, integer(3)), multiply(R_m, integer(2)));
    const sol1Arg = simplify(power(negate(add(threePPlus2M, twoQOversqrtPPlus2M)), rational(1, 2)));
    const solution1 = divide(add(sqrtPPlus2M, sol1Arg), integer(2));
    const sol2Arg = simplify(power(negate(add(threePPlus2M, twoQOversqrtPPlus2M)), rational(1, 2)));
    const solution2 = divide(subtract(sqrtPPlus2M, sol2Arg), integer(2));
    const sol3Arg = simplify(power(negate(subtract(threePPlus2M, twoQOversqrtPPlus2M)), rational(1, 2)));
    const solution3 = divide(add(negate(sqrtPPlus2M), sol3Arg), integer(2));
    const sol4Arg = simplify(power(negate(subtract(threePPlus2M, twoQOversqrtPPlus2M)), rational(1, 2)));
    const solution4 = divide(subtract(negate(sqrtPPlus2M), sol4Arg), integer(2));
    return [solution1, solution2, solution3, solution4];
  }
  function _solveDegree4NonzeroB(A, B, C, D, E2) {
    const R_p = divide(add(multiply(integer(8), multiply(C, A)), multiply(integer(-3), power(B, integer(2)))), multiply(integer(8), power(A, integer(2))));
    const R_q = divide(add(power(B, integer(3)), add(multiply(integer(-4), multiply(A, multiply(B, C))), multiply(integer(8), multiply(D, power(A, integer(2)))))), multiply(integer(8), power(A, integer(3))));
    const R_a3 = multiply(multiply(A, A), A);
    const R_b2 = multiply(B, B);
    const R_a2_d = multiply(multiply(A, A), D);
    let R_r = divide(add(multiply(power(B, integer(4)), integer(-3)), add(multiply(integer(256), multiply(R_a3, E2)), add(multiply(integer(-64), multiply(R_a2_d, B)), multiply(integer(16), multiply(R_b2, multiply(A, C)))))), multiply(integer(256), power(A, integer(4))));
    const four_x_4 = power(symbol(SECRETX), integer(4));
    const r_q_x_2 = multiply(R_p, power(symbol(SECRETX), integer(2)));
    const r_q_x = multiply(R_q, symbol(SECRETX));
    const simplified = simplify(add_all([four_x_4, r_q_x_2, r_q_x, R_r]));
    const depressedSolutions = roots(simplified, symbol(SECRETX));
    log.debug(`p for depressed quartic: ${R_p}`);
    log.debug(`q for depressed quartic: ${R_q}`);
    log.debug(`r for depressed quartic: ${R_r}`);
    log.debug(`4 * x^4: ${four_x_4}`);
    log.debug(`R_p * x^2: ${r_q_x_2}`);
    log.debug(`R_q * x: ${r_q_x}`);
    log.debug(`R_r: ${R_r}`);
    log.debug(`solving depressed quartic: ${simplified}`);
    log.debug(`depressedSolutions: ${depressedSolutions}`);
    return depressedSolutions.tensor.elem.map((sol) => {
      const result = simplify(subtract(sol, divide(B, multiply(integer(4), A))));
      log.debug(`solution from depressed: ${result}`);
      return result;
    });
  }

  // bazel-out/k8-fastbuild/bin/sources/simfac.js
  function simfac(p1) {
    if (isadd(p1)) {
      const terms = p1.tail().map(simfac_term);
      return add_all(terms);
    }
    return simfac_term(p1);
  }
  function simfac_term(p1) {
    if (!ismultiply(p1)) {
      return p1;
    }
    const factors2 = p1.tail();
    while (yysimfac(factors2)) {
    }
    return multiply_all_noexpand(factors2);
  }
  function yysimfac(stack) {
    for (let i = 0; i < stack.length; i++) {
      let p1 = stack[i];
      for (let j = 0; j < stack.length; j++) {
        if (i === j) {
          continue;
        }
        let p2 = stack[j];
        if (isfactorial(p1) && ispower(p2) && isminusone(caddr(p2)) && equal(cadr(p1), cadr(p2))) {
          stack[i] = factorial(subtract(cadr(p1), Constants.one));
          stack[j] = Constants.one;
          return true;
        }
        if (ispower(p2) && isminusone(caddr(p2)) && caadr(p2) === symbol(FACTORIAL) && equal(p1, cadadr(p2))) {
          stack[i] = reciprocate(factorial(add(p1, Constants.negOne)));
          stack[j] = Constants.one;
          return true;
        }
        if (isfactorial(p2)) {
          const p3 = subtract(p1, cadr(p2));
          if (isplusone(p3)) {
            stack[i] = factorial(p1);
            stack[j] = Constants.one;
            return true;
          }
        }
        if (ispower(p1) && isminusone(caddr(p1)) && ispower(p2) && isminusone(caddr(p2)) && caadr(p2) === symbol(FACTORIAL)) {
          const p3 = subtract(cadr(p1), cadr(cadr(p2)));
          if (isplusone(p3)) {
            stack[i] = reciprocate(factorial(cadr(p1)));
            stack[j] = Constants.one;
            return true;
          }
        }
        if (isfactorial(p1) && ispower(p2) && isminusone(caddr(p2)) && caadr(p2) === symbol(FACTORIAL)) {
          const p3 = subtract(cadr(p1), cadr(cadr(p2)));
          if (isplusone(p3)) {
            stack[i] = cadr(p1);
            stack[j] = Constants.one;
            return true;
          }
          if (isminusone(p3)) {
            stack[i] = reciprocate(cadr(cadr(p2)));
            stack[j] = Constants.one;
            return true;
          }
          if (equaln(p3, 2)) {
            stack[i] = cadr(p1);
            stack[j] = add(cadr(p1), Constants.negOne);
            return true;
          }
          if (equaln(p3, -2)) {
            stack[i] = reciprocate(cadr(cadr(p2)));
            stack[j] = reciprocate(add(cadr(cadr(p2)), Constants.negOne));
            return true;
          }
        }
      }
    }
    return false;
  }

  // bazel-out/k8-fastbuild/bin/sources/decomp.js
  function Eval_decomp(p1) {
    console.log("Eval_decomp is being called!!!!!!!!!!!!!!!!!!!!");
    const arg2 = Eval(cadr(p1));
    p1 = Eval(caddr(p1));
    const variable = p1 === symbol(NIL) ? guess(arg2) : p1;
    const result = decomp(false, arg2, variable);
    return makeList(symbol(NIL), ...result);
  }
  function pushTryNotToDuplicateLocal(localStack, item) {
    if (localStack.length > 0 && equal(item, localStack[localStack.length - 1])) {
      return false;
    }
    localStack.push(item);
    return true;
  }
  function decomp(generalTransform, p1, p2) {
    if (DEBUG) {
      console.log(`DECOMPOSING ${p1}`);
    }
    if (generalTransform) {
      if (!iscons(p1)) {
        if (DEBUG) {
          console.log(` ground thing: ${p1}`);
        }
        return [p1];
      }
    } else {
      if (!Find(p1, p2)) {
        if (DEBUG) {
          console.log(" entire expression is constant");
        }
        return [p1];
      }
    }
    if (isadd(p1)) {
      return decomp_sum(generalTransform, p1, p2);
    }
    if (ismultiply(p1)) {
      return decomp_product(generalTransform, p1, p2);
    }
    let p3 = cdr(p1);
    if (DEBUG) {
      console.log(" naive decomp");
      console.log(`startig p3: ${p3}`);
    }
    const stack = [];
    while (iscons(p3)) {
      if (generalTransform) {
        stack.push(car(p3));
      }
      if (DEBUG) {
        console.log("recursive decomposition");
        console.log(`car(p3): ${car(p3)}`);
        console.log(`p2: ${p2}`);
      }
      stack.push(...decomp(generalTransform, car(p3), p2));
      p3 = cdr(p3);
    }
    return stack;
  }
  function decomp_sum(generalTransform, p1, p2) {
    if (DEBUG) {
      console.log(" decomposing the sum ");
    }
    let p3 = cdr(p1);
    const stack = [];
    while (iscons(p3)) {
      if (Find(car(p3), p2) || generalTransform) {
        stack.push(...decomp(generalTransform, car(p3), p2));
      }
      p3 = cdr(p3);
    }
    p3 = cdr(p1);
    const constantTerms = [...p3].filter((t) => !Find(t, p2));
    if (constantTerms.length) {
      p3 = add_all(constantTerms);
      pushTryNotToDuplicateLocal(stack, p3);
      stack.push(negate(p3));
    }
    return stack;
  }
  function decomp_product(generalTransform, p1, p2) {
    if (DEBUG) {
      console.log(" decomposing the product ");
    }
    let p3 = cdr(p1);
    const stack = [];
    while (iscons(p3)) {
      if (Find(car(p3), p2) || generalTransform) {
        stack.push(...decomp(generalTransform, car(p3), p2));
      }
      p3 = cdr(p3);
    }
    p3 = cdr(p1);
    const constantFactors = [];
    while (iscons(p3)) {
      const item = car(p3);
      if (!Find(item, p2)) {
        if (constantFactors.length < 1 || !equal(item, constantFactors[constantFactors.length - 1])) {
          constantFactors.push(item);
        }
      }
      p3 = cdr(p3);
    }
    if (constantFactors.length > 0) {
      stack.push(multiply_all(constantFactors));
    }
    return stack;
  }

  // bazel-out/k8-fastbuild/bin/sources/transform.js
  function transform(F, X, s, generalTransform) {
    if (DEBUG) {
      console.log(`         !!!!!!!!!   transform on: ${F}`);
    }
    const state = saveMetaBindings();
    set_binding(symbol(METAX), X);
    const arg2 = polyform(F, X);
    const result = decomp(generalTransform, arg2, X);
    if (DEBUG) {
      console.log(`  ${result.length} decomposed elements ====== `);
      for (let i = 0; i < result.length; i++) {
        console.log(`  decomposition element ${i}: ${result[i]}`);
      }
    }
    let transformationSuccessful = false;
    let B;
    if (generalTransform) {
      if (!isNumericAtom(F)) {
        const theTransform = s;
        if (DEBUG) {
          console.log(`applying transform: ${theTransform}`);
          console.log(`scanning table entry ${theTransform}`);
        }
        let expr = subst(theTransform, symbol(SYMBOL_A_UNDERSCORE), symbol(METAA));
        expr = subst(expr, symbol(SYMBOL_B_UNDERSCORE), symbol(METAB));
        const p1 = subst(expr, symbol(SYMBOL_X_UNDERSCORE), symbol(METAX));
        const A = car(p1);
        if (DEBUG) {
          console.log(`template expression: ${A}`);
        }
        B = cadr(p1);
        const C = cddr(p1);
        if (f_equals_a([Constants.one, ...result], generalTransform, F, A, C)) {
          transformationSuccessful = true;
        } else {
          if (DEBUG) {
            console.log(`p3 at this point: ${F}`);
            console.log(`car(p3): ${car(F)}`);
          }
          const transformedTerms = [];
          let restTerm = F;
          if (iscons(restTerm)) {
            transformedTerms.push(car(F));
            restTerm = cdr(F);
          }
          while (iscons(restTerm)) {
            const secondTerm = car(restTerm);
            restTerm = cdr(restTerm);
            if (DEBUG) {
              console.log(`testing: ${secondTerm}`);
              console.log(`about to try to simplify other term: ${secondTerm}`);
            }
            const [t, success] = transform(secondTerm, symbol(NIL), s, generalTransform);
            transformationSuccessful = transformationSuccessful || success;
            transformedTerms.push(t);
            if (DEBUG) {
              console.log(`tried to simplify other term: ${secondTerm} ...successful?: ${success} ...transformed: ${transformedTerms[transformedTerms.length - 1]}`);
            }
          }
          if (transformedTerms.length !== 0) {
            B = makeList(...transformedTerms);
          }
        }
      }
    } else {
      for (let eachTransformEntry of Array.from(s)) {
        if (DEBUG) {
          console.log(`scanning table entry ${eachTransformEntry}`);
          if ((eachTransformEntry + "").indexOf("f(sqrt(a+b*x),2/3*1/b*sqrt((a+b*x)^3))") !== -1) {
            breakpoint;
          }
        }
        if (eachTransformEntry) {
          const temp2 = scan_meta(eachTransformEntry);
          const p5 = cadr(temp2);
          B = caddr(temp2);
          const p7 = cdddr(temp2);
          if (f_equals_a([Constants.one, ...result], generalTransform, F, p5, p7)) {
            transformationSuccessful = true;
            break;
          }
        }
      }
    }
    const temp = transformationSuccessful ? Eval(B) : generalTransform ? F : symbol(NIL);
    restoreMetaBindings(state);
    return [temp, transformationSuccessful];
  }
  function saveMetaBindings() {
    return {
      METAA: get_binding(symbol(METAA)),
      METAB: get_binding(symbol(METAB)),
      METAX: get_binding(symbol(METAX))
    };
  }
  function restoreMetaBindings(state) {
    set_binding(symbol(METAX), state.METAX);
    set_binding(symbol(METAB), state.METAB);
    set_binding(symbol(METAA), state.METAA);
  }
  function f_equals_a(stack, generalTransform, F, A, C) {
    for (const fea_i of stack) {
      set_binding(symbol(METAA), fea_i);
      if (DEBUG) {
        console.log(`  binding METAA to ${get_binding(symbol(METAA))}`);
      }
      for (const fea_j of stack) {
        set_binding(symbol(METAB), fea_j);
        if (DEBUG) {
          console.log(`  binding METAB to ${get_binding(symbol(METAB))}`);
        }
        let temp = C;
        while (iscons(temp)) {
          const p2 = Eval(car(temp));
          if (isZeroAtomOrTensor(p2)) {
            break;
          }
          temp = cdr(temp);
        }
        if (iscons(temp)) {
          continue;
        }
        const arg2 = generalTransform ? noexpand(Eval, A) : Eval(A);
        if (DEBUG) {
          console.log(`about to evaluate template expression: ${A} binding METAA to ${get_binding(symbol(METAA))} and binding METAB to ${get_binding(symbol(METAB))} and binding METAX to ${get_binding(symbol(METAX))}`);
          console.log(`  comparing ${arg2} to: ${F}`);
        }
        if (isZeroAtomOrTensor(subtract(F, arg2))) {
          if (DEBUG) {
            console.log(`binding METAA to ${get_binding(symbol(METAA))}`);
            console.log(`binding METAB to ${get_binding(symbol(METAB))}`);
            console.log(`binding METAX to ${get_binding(symbol(METAX))}`);
            console.log(`comparing ${F} to: ${A}`);
          }
          return true;
        }
      }
    }
    return false;
  }

  // bazel-out/k8-fastbuild/bin/sources/transpose.js
  function Eval_transpose(p1) {
    const arg1 = Eval(cadr(p1));
    let arg2 = Constants.one;
    let arg3 = integer(2);
    if (cddr(p1) !== symbol(NIL)) {
      arg2 = Eval(caddr(p1));
      arg3 = Eval(cadddr(p1));
    }
    return transpose(arg1, arg2, arg3);
  }
  function transpose(p1, p2, p3) {
    let t = 0;
    const ai = Array(MAXDIM).fill(0);
    const an = Array(MAXDIM).fill(0);
    if (isNumericAtom(p1)) {
      return p1;
    }
    if (isplusone(p2) && isplustwo(p3) || isplusone(p3) && isplustwo(p2)) {
      if (isidentitymatrix(p1)) {
        return p1;
      }
    }
    if (istranspose(p1)) {
      const innerTranspSwitch1 = car(cdr(cdr(p1)));
      const innerTranspSwitch2 = car(cdr(cdr(cdr(p1))));
      if (equal(innerTranspSwitch1, p3) && equal(innerTranspSwitch2, p2) || equal(innerTranspSwitch2, p3) && equal(innerTranspSwitch1, p2) || equal(innerTranspSwitch1, symbol(NIL)) && equal(innerTranspSwitch2, symbol(NIL)) && (isplusone(p3) && isplustwo(p2) || isplusone(p2) && isplustwo(p3))) {
        return car(cdr(p1));
      }
    }
    if (defs.expanding && isadd(p1)) {
      return p1.tail().reduce((a2, b2) => add(a2, transpose(b2, p2, p3)), Constants.zero);
    }
    if (defs.expanding && ismultiply(p1)) {
      return p1.tail().reduce((a2, b2) => multiply(a2, transpose(b2, p2, p3)), Constants.one);
    }
    if (defs.expanding && isinnerordot(p1)) {
      const accumulator = [];
      if (iscons(p1)) {
        accumulator.push(...p1.tail().map((p) => [p, p2, p3]));
      }
      accumulator.reverse();
      return accumulator.reduce((acc, p) => inner(acc, transpose(p[0], p[1], p[2])), symbol(SYMBOL_IDENTITY_MATRIX));
    }
    if (!istensor(p1)) {
      if (!isZeroAtomOrTensor(p1)) {
        if ((!isplusone(p2) || !isplustwo(p3)) && (!isplusone(p3) || !isplustwo(p2))) {
          return makeList(symbol(TRANSPOSE), p1, p2, p3);
        }
        return makeList(symbol(TRANSPOSE), p1);
      }
      return Constants.zero;
    }
    const { ndim, nelem } = p1.tensor;
    if (ndim === 1) {
      return p1;
    }
    let l = nativeInt(p2);
    let m = nativeInt(p3);
    if (l < 1 || l > ndim || m < 1 || m > ndim) {
      stop("transpose: index out of range");
    }
    l--;
    m--;
    p2 = alloc_tensor(nelem);
    p2.tensor.ndim = ndim;
    p2.tensor.dim = [...p1.tensor.dim];
    p2.tensor.dim[l] = p1.tensor.dim[m];
    p2.tensor.dim[m] = p1.tensor.dim[l];
    const a = p1.tensor.elem;
    const b = p2.tensor.elem;
    for (let i = 0; i < ndim; i++) {
      ai[i] = 0;
      an[i] = p1.tensor.dim[i];
    }
    for (let i = 0; i < nelem; i++) {
      t = ai[l];
      ai[l] = ai[m];
      ai[m] = t;
      t = an[l];
      an[l] = an[m];
      an[m] = t;
      let k = 0;
      for (let j = 0; j < ndim; j++) {
        k = k * an[j] + ai[j];
      }
      t = ai[l];
      ai[l] = ai[m];
      ai[m] = t;
      t = an[l];
      an[l] = an[m];
      an[m] = t;
      b[k] = a[i];
      for (let j = ndim - 1; j >= 0; j--) {
        if (++ai[j] < an[j]) {
          break;
        }
        ai[j] = 0;
      }
    }
    return p2;
  }

  // bazel-out/k8-fastbuild/bin/sources/simplify.js
  function Eval_simplify(p1) {
    const arg2 = runUserDefinedSimplifications(cadr(p1));
    return simplify(Eval(arg2));
  }
  function runUserDefinedSimplifications(p) {
    if (defs.userSimplificationsInListForm.length === 0 || Find(p, symbol(INTEGRAL))) {
      return p;
    }
    if (DEBUG) {
      console.log(`runUserDefinedSimplifications passed: ${p}`);
    }
    let F1 = noexpand(Eval, p);
    if (DEBUG) {
      console.log(`runUserDefinedSimplifications after eval no expanding: ${F1}`);
      console.log("patterns to be checked: ");
      for (const simplification of Array.from(defs.userSimplificationsInListForm)) {
        console.log(`...${simplification}`);
      }
    }
    let atLeastOneSuccessInRouldOfRulesApplications = true;
    let numberOfRulesApplications = 0;
    while (atLeastOneSuccessInRouldOfRulesApplications && numberOfRulesApplications < MAX_CONSECUTIVE_APPLICATIONS_OF_ALL_RULES) {
      atLeastOneSuccessInRouldOfRulesApplications = false;
      numberOfRulesApplications++;
      for (const eachSimplification of Array.from(defs.userSimplificationsInListForm)) {
        let success = true;
        let eachConsecutiveRuleApplication = 0;
        while (success && eachConsecutiveRuleApplication < MAX_CONSECUTIVE_APPLICATIONS_OF_SINGLE_RULE) {
          eachConsecutiveRuleApplication++;
          if (DEBUG) {
            console.log(`simplify - checking pattern: ${eachSimplification} on: ${F1}`);
          }
          [F1, success] = transform(F1, symbol(NIL), eachSimplification, true);
          if (success) {
            atLeastOneSuccessInRouldOfRulesApplications = true;
          }
          if (DEBUG) {
            console.log(`p1 at this stage of simplification: ${F1}`);
          }
        }
        if (eachConsecutiveRuleApplication === MAX_CONSECUTIVE_APPLICATIONS_OF_SINGLE_RULE) {
          stop(`maximum application of single transformation rule exceeded: ${eachSimplification}`);
        }
      }
    }
    if (numberOfRulesApplications === MAX_CONSECUTIVE_APPLICATIONS_OF_ALL_RULES) {
      stop("maximum application of all transformation rules exceeded ");
    }
    if (DEBUG) {
      console.log(`METAX = ${get_binding(symbol(METAX))}`);
      console.log(`METAA = ${get_binding(symbol(METAA))}`);
      console.log(`METAB = ${get_binding(symbol(METAB))}`);
    }
    return F1;
  }
  function simplify(p1) {
    if (defs.codeGen && car(p1) === symbol(FUNCTION)) {
      const fbody = cadr(p1);
      const p3 = simplify(Eval(fbody));
      const args = caddr(p1);
      p1 = makeList(symbol(FUNCTION), p3, args);
    }
    if (istensor(p1)) {
      return simplify_tensor(p1);
    }
    if (Find(p1, symbol(FACTORIAL))) {
      const p2 = simfac(p1);
      const p3 = simfac(rationalize(p1));
      p1 = count(p2) < count(p3) ? p2 : p3;
    }
    p1 = f10(p1);
    p1 = f1(p1);
    p1 = f2(p1);
    p1 = f3(p1);
    p1 = f4(p1);
    p1 = f5(p1);
    p1 = f9(p1);
    p1 = simplify_polarRect(p1);
    if (do_simplify_nested_radicals) {
      let simplify_nested_radicalsResult;
      [simplify_nested_radicalsResult, p1] = simplify_nested_radicals(p1);
      if (simplify_nested_radicalsResult) {
        if (DEBUG) {
          console.log("de-nesting successful into: " + p1.toString());
        }
        return simplify(p1);
      }
    }
    p1 = simplify_rectToClock(p1);
    p1 = simplify_rational_expressions(p1);
    return p1;
  }
  function simplify_tensor(p1) {
    let p2 = alloc_tensor(p1.tensor.nelem);
    p2.tensor.ndim = p1.tensor.ndim;
    p2.tensor.dim = Array.from(p1.tensor.dim);
    p2.tensor.elem = p1.tensor.elem.map(simplify);
    check_tensor_dimensions(p2);
    if (isZeroAtomOrTensor(p2)) {
      p2 = Constants.zero;
    }
    return p2;
  }
  function f1(p1) {
    if (!isadd(p1)) {
      return p1;
    }
    const p2 = rationalize(p1);
    if (count(p2) < count(p1)) {
      p1 = p2;
    }
    return p1;
  }
  function f2(p1) {
    if (!isadd(p1)) {
      return p1;
    }
    const p2 = Condense(p1);
    if (count(p2) <= count(p1)) {
      p1 = p2;
    }
    return p1;
  }
  function f3(p1) {
    const p2 = rationalize(negate(rationalize(negate(rationalize(p1)))));
    if (count(p2) < count(p1)) {
      p1 = p2;
    }
    return p1;
  }
  function f10(p1) {
    const carp1 = car(p1);
    if (carp1 === symbol(MULTIPLY) || isinnerordot(p1)) {
      if (car(car(cdr(p1))) === symbol(TRANSPOSE) && car(car(cdr(cdr(p1)))) === symbol(TRANSPOSE)) {
        if (DEBUG) {
          console.log(`maybe collecting a transpose ${p1}`);
        }
        const a = cadr(car(cdr(p1)));
        const b = cadr(car(cdr(cdr(p1))));
        let arg1;
        if (carp1 === symbol(MULTIPLY)) {
          arg1 = multiply(a, b);
        } else if (isinnerordot(p1)) {
          arg1 = inner(b, a);
        } else {
          arg1 = stop("f10: nothing to pop.");
        }
        const p2 = noexpand(() => {
          return transpose(arg1, Constants.one, integer(2));
        });
        if (count(p2) < count(p1)) {
          p1 = p2;
        }
        if (DEBUG) {
          console.log(`collecting a transpose ${p2}`);
        }
      }
    }
    return p1;
  }
  function f4(p1) {
    if (isZeroAtomOrTensor(p1)) {
      return p1;
    }
    const p2 = rationalize(inverse(rationalize(inverse(rationalize(p1)))));
    if (count(p2) < count(p1)) {
      p1 = p2;
    }
    return p1;
  }
  function simplify_trig(p1) {
    return f5(p1);
  }
  function f5(p1) {
    if (!Find(p1, symbol(SIN)) && !Find(p1, symbol(COS))) {
      return p1;
    }
    const p2 = p1;
    defs.trigmode = 1;
    let p3 = Eval(p2);
    defs.trigmode = 2;
    let p4 = Eval(p2);
    defs.trigmode = 0;
    if (count(p4) < count(p3) || nterms(p4) < nterms(p3)) {
      p3 = p4;
    }
    if (count(p3) < count(p1) || nterms(p3) < nterms(p1)) {
      p1 = p3;
    }
    return p1;
  }
  function f9(p1) {
    if (!isadd(p1)) {
      return p1;
    }
    let p2 = cdr(p1);
    if (iscons(p2)) {
      p2 = [...p2].reduce((acc, p) => simplify_rational_expressions(add(acc, simplify(p))), Constants.zero);
    }
    if (count(p2) < count(p1)) {
      p1 = p2;
    }
    return p1;
  }
  function simplify_rational_expressions(p1) {
    var denom, num, p2, polyVar, theGCD;
    denom = denominator(p1);
    if (isone(denom)) {
      return p1;
    }
    num = numerator(p1);
    if (isone(num)) {
      return p1;
    }
    if (!(polyVar = areunivarpolysfactoredorexpandedform(num, denom))) {
      return p1;
    }
    theGCD = factor(gcd(num, denom), polyVar);
    if (isone(theGCD)) {
      return p1;
    }
    let factoredNum = factor(num, polyVar);
    let theGCDInverse = inverse(theGCD);
    let multipliedNoeExpandNum = multiply_noexpand(factoredNum, theGCDInverse);
    let simplifiedNum = simplify(multipliedNoeExpandNum);
    let factoredDenom = factor(denom, polyVar);
    let multipliedNoeExpandDenom = multiply_noexpand(factoredDenom, theGCDInverse);
    let simplifiedDenom = simplify(multipliedNoeExpandDenom);
    let numDividedDenom = divide(simplifiedNum, simplifiedDenom);
    p2 = Condense(numDividedDenom);
    if (count(p2) < count(p1)) {
      return p2;
    } else {
      return p1;
    }
  }
  function simplify_rectToClock(p1) {
    let p2;
    if (!Find(p1, symbol(SIN)) && !Find(p1, symbol(COS))) {
      return p1;
    }
    p2 = clockform(Eval(p1));
    if (DEBUG) {
      console.log(`before simplification clockform: ${p1} after: ${p2}`);
    }
    if (count(p2) < count(p1)) {
      p1 = p2;
    }
    return p1;
  }
  function simplify_polarRect(p1) {
    const tmp = polarRectAMinusOneBase(p1);
    const p2 = Eval(tmp);
    if (count(p2) < count(p1)) {
      p1 = p2;
    }
    return p1;
  }
  function polarRectAMinusOneBase(p1) {
    if (isimaginaryunit(p1)) {
      return p1;
    }
    if (equal(car(p1), symbol(POWER)) && isminusone(cadr(p1))) {
      const base = negate(Constants.one);
      const exponent = polarRectAMinusOneBase(caddr(p1));
      return rect(polar(power(base, exponent)));
    } else if (iscons(p1)) {
      return p1.map(polarRectAMinusOneBase);
    } else {
      return p1;
    }
  }
  function nterms(p) {
    if (!isadd(p)) {
      return 1;
    } else {
      return length(p) - 1;
    }
  }
  function simplify_nested_radicals(p1) {
    if (defs.recursionLevelNestedRadicalsRemoval > 0) {
      if (DEBUG) {
        console.log("denesting bailing out because of too much recursion");
      }
      return [false, p1];
    }
    const [simplificationWithoutCondense, somethingSimplified] = take_care_of_nested_radicals(p1);
    const simplificationWithCondense = noexpand(yycondense, simplificationWithoutCondense);
    p1 = countOccurrencesOfSymbol(symbol(POWER), simplificationWithoutCondense) < countOccurrencesOfSymbol(symbol(POWER), simplificationWithCondense) ? simplificationWithoutCondense : simplificationWithCondense;
    return [somethingSimplified, p1];
  }
  function take_care_of_nested_radicals(p1) {
    if (defs.recursionLevelNestedRadicalsRemoval > 0) {
      if (DEBUG) {
        console.log("denesting bailing out because of too much recursion");
      }
      return [p1, false];
    }
    if (equal(car(p1), symbol(POWER))) {
      return _nestedPowerSymbol(p1);
    }
    if (iscons(p1)) {
      return _nestedCons(p1);
    }
    return [p1, false];
  }
  function _nestedPowerSymbol(p1) {
    const base = cadr(p1);
    const exponent = caddr(p1);
    if (isminusone(exponent) || !equal(car(base), symbol(ADD)) || !isfraction(exponent) || !equalq(exponent, 1, 3) && !equalq(exponent, 1, 2)) {
      return [p1, false];
    }
    const firstTerm = cadr(base);
    take_care_of_nested_radicals(firstTerm);
    const secondTerm = caddr(base);
    take_care_of_nested_radicals(secondTerm);
    let numberOfTerms = 0;
    let countingTerms = base;
    while (cdr(countingTerms) !== symbol(NIL)) {
      numberOfTerms++;
      countingTerms = cdr(countingTerms);
    }
    if (numberOfTerms > 2) {
      return [p1, false];
    }
    const { commonBases, termsThatAreNotPowers } = _listAll(secondTerm);
    if (commonBases.length === 0) {
      return [p1, false];
    }
    const A = firstTerm;
    const C = commonBases.reduce(multiply, Constants.one);
    const B = termsThatAreNotPowers.reduce(multiply, Constants.one);
    let temp;
    if (equalq(exponent, 1, 3)) {
      const checkSize1 = divide(multiply(negate(A), C), B);
      const result1 = nativeDouble(yyfloat(real(checkSize1)));
      if (Math.abs(result1) > Math.pow(2, 32)) {
        return [p1, false];
      }
      const checkSize2 = multiply(integer(3), C);
      const result2 = nativeDouble(yyfloat(real(checkSize2)));
      if (Math.abs(result2) > Math.pow(2, 32)) {
        return [p1, false];
      }
      const arg1b = multiply(checkSize2, symbol(SECRETX));
      const checkSize3 = divide(multiply(integer(-3), A), B);
      const result3 = nativeDouble(yyfloat(real(checkSize3)));
      if (Math.abs(result3) > Math.pow(2, 32)) {
        return [p1, false];
      }
      const result = add_all([
        checkSize1,
        arg1b,
        multiply(checkSize3, power(symbol(SECRETX), integer(2))),
        multiply(Constants.one, power(symbol(SECRETX), integer(3)))
      ]);
      temp = result;
    } else if (equalq(exponent, 1, 2)) {
      const result1 = nativeDouble(yyfloat(real(C)));
      if (Math.abs(result1) > Math.pow(2, 32)) {
        return [p1, false];
      }
      const checkSize = divide(multiply(integer(-2), A), B);
      const result2 = nativeDouble(yyfloat(real(checkSize)));
      if (Math.abs(result2) > Math.pow(2, 32)) {
        return [p1, false];
      }
      temp = add(C, add(multiply(checkSize, symbol(SECRETX)), multiply(Constants.one, power(symbol(SECRETX), integer(2)))));
    }
    defs.recursionLevelNestedRadicalsRemoval++;
    const r = roots(temp, symbol(SECRETX));
    defs.recursionLevelNestedRadicalsRemoval--;
    if (equal(r, symbol(NIL))) {
      if (DEBUG) {
        console.log("roots bailed out because of too much recursion");
      }
      return [p1, false];
    }
    const possibleSolutions = r.elem.filter((sol) => !Find(sol, symbol(POWER)));
    if (possibleSolutions.length === 0) {
      return [p1, false];
    }
    const possibleRationalSolutions = [];
    const realOfpossibleRationalSolutions = [];
    for (const i of Array.from(possibleSolutions)) {
      const result = nativeDouble(yyfloat(real(i)));
      possibleRationalSolutions.push(i);
      realOfpossibleRationalSolutions.push(result);
    }
    const whichRationalSolution = realOfpossibleRationalSolutions.indexOf(Math.max.apply(Math, realOfpossibleRationalSolutions));
    const SOLUTION = possibleRationalSolutions[whichRationalSolution];
    if (!equalq(exponent, 1, 3) && !equalq(exponent, 1, 2)) {
      return [p1, false];
    }
    if (equalq(exponent, 1, 3)) {
      const lowercase_b = power(divide(A, add(power(SOLUTION, integer(3)), multiply(multiply(integer(3), C), SOLUTION))), rational(1, 3));
      const lowercase_a = multiply(lowercase_b, SOLUTION);
      const result = simplify(add(multiply(lowercase_b, power(C, rational(1, 2))), lowercase_a));
      return [result, true];
    }
    if (equalq(exponent, 1, 2)) {
      const lowercase_b = power(divide(A, add(power(SOLUTION, integer(2)), C)), rational(1, 2));
      const lowercase_a = multiply(lowercase_b, SOLUTION);
      const possibleNewExpression = simplify(add(multiply(lowercase_b, power(C, rational(1, 2))), lowercase_a));
      const possibleNewExpressionValue = yyfloat(real(possibleNewExpression));
      if (!isnegativenumber(possibleNewExpressionValue)) {
        return [possibleNewExpression, true];
      }
      const result = simplify(add(multiply(negate(lowercase_b), power(C, rational(1, 2))), negate(lowercase_a)));
      return [result, true];
    }
    return [null, true];
  }
  function _listAll(secondTerm) {
    let commonInnerExponent = null;
    const commonBases = [];
    const termsThatAreNotPowers = [];
    if (ismultiply(secondTerm)) {
      let secondTermFactor = cdr(secondTerm);
      if (iscons(secondTermFactor)) {
        while (iscons(secondTermFactor)) {
          const potentialPower = car(secondTermFactor);
          if (ispower(potentialPower)) {
            const innerbase = cadr(potentialPower);
            const innerexponent = caddr(potentialPower);
            if (equalq(innerexponent, 1, 2)) {
              if (commonInnerExponent == null) {
                commonInnerExponent = innerexponent;
                commonBases.push(innerbase);
              } else if (equal(innerexponent, commonInnerExponent)) {
                commonBases.push(innerbase);
              }
            }
          } else {
            termsThatAreNotPowers.push(potentialPower);
          }
          secondTermFactor = cdr(secondTermFactor);
        }
      }
    } else if (ispower(secondTerm)) {
      const innerbase = cadr(secondTerm);
      const innerexponent = caddr(secondTerm);
      if (commonInnerExponent == null && equalq(innerexponent, 1, 2)) {
        commonInnerExponent = innerexponent;
        commonBases.push(innerbase);
      }
    }
    return { commonBases, termsThatAreNotPowers };
  }
  function _nestedCons(p1) {
    let anyRadicalSimplificationWorked = false;
    const arr = [];
    if (iscons(p1)) {
      const items = Array.from(p1).map((p) => {
        if (!anyRadicalSimplificationWorked) {
          let p2;
          [p2, anyRadicalSimplificationWorked] = take_care_of_nested_radicals(p);
          return p2;
        }
        return p;
      });
      arr.push(...items);
    }
    return [makeList(...arr), anyRadicalSimplificationWorked];
  }

  // bazel-out/k8-fastbuild/bin/sources/integral.js
  var itab = [
    "f(a,a*x)",
    "f(1/x,log(x))",
    "f(x^a,x^(a+1)/(a+1))",
    "f(x^(-2),-x^(-1))",
    "f(x^(-1/2),2*x^(1/2))",
    "f(x^(1/2),2/3*x^(3/2))",
    "f(x,x^2/2)",
    "f(x^2,x^3/3)",
    "f(exp(a*x),1/a*exp(a*x))",
    "f(exp(a*x+b),1/a*exp(a*x+b))",
    "f(x*exp(a*x^2),exp(a*x^2)/(2*a))",
    "f(x*exp(a*x^2+b),exp(a*x^2+b)/(2*a))",
    "f(log(a*x),x*log(a*x)-x)",
    "f(a^x,a^x/log(a),or(not(number(a)),a>0))",
    "f(1/(a+x^2),1/sqrt(a)*arctan(x/sqrt(a)),or(not(number(a)),a>0))",
    "f(1/(a-x^2),1/sqrt(a)*arctanh(x/sqrt(a)))",
    "f(1/sqrt(a-x^2),arcsin(x/(sqrt(a))))",
    "f(1/sqrt(a+x^2),log(x+sqrt(a+x^2)))",
    "f(1/(a+b*x),1/b*log(a+b*x))",
    "f(1/(a+b*x)^2,-1/(b*(a+b*x)))",
    "f(1/(a+b*x)^3,-1/(2*b)*1/(a+b*x)^2)",
    "f(x/(a+b*x),x/b-a*log(a+b*x)/b/b)",
    "f(x/(a+b*x)^2,1/b^2*(log(a+b*x)+a/(a+b*x)))",
    "f(x^2/(a+b*x),1/b^2*(1/2*(a+b*x)^2-2*a*(a+b*x)+a^2*log(a+b*x)))",
    "f(x^2/(a+b*x)^2,1/b^3*(a+b*x-2*a*log(a+b*x)-a^2/(a+b*x)))",
    "f(x^2/(a+b*x)^3,1/b^3*(log(a+b*x)+2*a/(a+b*x)-1/2*a^2/(a+b*x)^2))",
    "f(1/x*1/(a+b*x),-1/a*log((a+b*x)/x))",
    "f(1/x*1/(a+b*x)^2,1/a*1/(a+b*x)-1/a^2*log((a+b*x)/x))",
    "f(1/x*1/(a+b*x)^3,1/a^3*(1/2*((2*a+b*x)/(a+b*x))^2+log(x/(a+b*x))))",
    "f(1/x^2*1/(a+b*x),-1/(a*x)+b/a^2*log((a+b*x)/x))",
    "f(1/x^3*1/(a+b*x),(2*b*x-a)/(2*a^2*x^2)+b^2/a^3*log(x/(a+b*x)))",
    "f(1/x^2*1/(a+b*x)^2,-(a+2*b*x)/(a^2*x*(a+b*x))+2*b/a^3*log((a+b*x)/x))",
    "f(1/(a+b*x^2),1/sqrt(a*b)*arctan(x*sqrt(a*b)/a),or(not(number(a*b)),a*b>0))",
    "f(1/(a+b*x^2),1/(2*sqrt(-a*b))*log((a+x*sqrt(-a*b))/(a-x*sqrt(-a*b))),or(not(number(a*b)),a*b<0))",
    "f(x/(a+b*x^2),1/2*1/b*log(a+b*x^2))",
    "f(x^2/(a+b*x^2),x/b-a/b*integral(1/(a+b*x^2),x))",
    "f(1/(a+b*x^2)^2,x/(2*a*(a+b*x^2))+1/2*1/a*integral(1/(a+b*x^2),x))",
    "f(1/x*1/(a+b*x^2),1/2*1/a*log(x^2/(a+b*x^2)))",
    "f(1/x^2*1/(a+b*x^2),-1/(a*x)-b/a*integral(1/(a+b*x^2),x))",
    "f(1/(a+b*x^3),1/3*1/a*(a/b)^(1/3)*(1/2*log(((a/b)^(1/3)+x)^3/(a+b*x^3))+sqrt(3)*arctan((2*x-(a/b)^(1/3))*(a/b)^(-1/3)/sqrt(3))))",
    "f(x^2/(a+b*x^3),1/3*1/b*log(a+b*x^3))",
    "f(x/(a+b*x^4),1/2*sqrt(b/a)/b*arctan(x^2*sqrt(b/a)),or(not(number(a*b)),a*b>0))",
    "f(x/(a+b*x^4),1/4*sqrt(-b/a)/b*log((x^2-sqrt(-a/b))/(x^2+sqrt(-a/b))),or(not(number(a*b)),a*b<0))",
    "f(x^3/(a+b*x^4),1/4*1/b*log(a+b*x^4))",
    "f(sqrt(a+b*x),2/3*1/b*sqrt((a+b*x)^3))",
    "f(x*sqrt(a+b*x),-2*(2*a-3*b*x)*sqrt((a+b*x)^3)/15/b^2)",
    "f(x^2*sqrt(a+b*x),2*(8*a^2-12*a*b*x+15*b^2*x^2)*sqrt((a+b*x)^3)/105/b^3)",
    "f(sqrt(a+b*x)/x,2*sqrt(a+b*x)+a*integral(1/x*1/sqrt(a+b*x),x))",
    "f(sqrt(a+b*x)/x^2,-sqrt(a+b*x)/x+b/2*integral(1/x*1/sqrt(a+b*x),x))",
    "f(1/sqrt(a+b*x),2*sqrt(a+b*x)/b)",
    "f(x/sqrt(a+b*x),-2/3*(2*a-b*x)*sqrt(a+b*x)/b^2)",
    "f(x^2/sqrt(a+b*x),2/15*(8*a^2-4*a*b*x+3*b^2*x^2)*sqrt(a+b*x)/b^3)",
    "f(1/x*1/sqrt(a+b*x),1/sqrt(a)*log((sqrt(a+b*x)-sqrt(a))/(sqrt(a+b*x)+sqrt(a))),or(not(number(a)),a>0))",
    "f(1/x*1/sqrt(a+b*x),2/sqrt(-a)*arctan(sqrt(-(a+b*x)/a)),or(not(number(a)),a<0))",
    "f(1/x^2*1/sqrt(a+b*x),-sqrt(a+b*x)/a/x-1/2*b/a*integral(1/x*1/sqrt(a+b*x),x))",
    "f(sqrt(x^2+a),1/2*(x*sqrt(x^2+a)+a*log(x+sqrt(x^2+a))))",
    "f(1/sqrt(x^2+a),log(x+sqrt(x^2+a)))",
    "f(1/x*1/sqrt(x^2+a),arcsec(x/sqrt(-a))/sqrt(-a),or(not(number(a)),a<0))",
    "f(1/x*1/sqrt(x^2+a),-1/sqrt(a)*log((sqrt(a)+sqrt(x^2+a))/x),or(not(number(a)),a>0))",
    "f(sqrt(x^2+a)/x,sqrt(x^2+a)-sqrt(a)*log((sqrt(a)+sqrt(x^2+a))/x),or(not(number(a)),a>0))",
    "f(sqrt(x^2+a)/x,sqrt(x^2+a)-sqrt(-a)*arcsec(x/sqrt(-a)),or(not(number(a)),a<0))",
    "f(x/sqrt(x^2+a),sqrt(x^2+a))",
    "f(x*sqrt(x^2+a),1/3*sqrt((x^2+a)^3))",
    "f(sqrt(a+x^6+3*a^(1/3)*x^4+3*a^(2/3)*x^2),1/4*(x*sqrt((x^2+a^(1/3))^3)+3/2*a^(1/3)*x*sqrt(x^2+a^(1/3))+3/2*a^(2/3)*log(x+sqrt(x^2+a^(1/3)))))",
    "f(sqrt(-a+x^6-3*a^(1/3)*x^4+3*a^(2/3)*x^2),1/4*(x*sqrt((x^2-a^(1/3))^3)-3/2*a^(1/3)*x*sqrt(x^2-a^(1/3))+3/2*a^(2/3)*log(x+sqrt(x^2-a^(1/3)))))",
    "f(1/sqrt(a+x^6+3*a^(1/3)*x^4+3*a^(2/3)*x^2),x/a^(1/3)/sqrt(x^2+a^(1/3)))",
    "f(x/sqrt(a+x^6+3*a^(1/3)*x^4+3*a^(2/3)*x^2),-1/sqrt(x^2+a^(1/3)))",
    "f(x*sqrt(a+x^6+3*a^(1/3)*x^4+3*a^(2/3)*x^2),1/5*sqrt((x^2+a^(1/3))^5))",
    "f(x^2*sqrt(x^2+a),1/4*x*sqrt((x^2+a)^3)-1/8*a*x*sqrt(x^2+a)-1/8*a^2*log(x+sqrt(x^2+a)))",
    "f(x^3*sqrt(x^2+a),(1/5*x^2-2/15*a)*sqrt((x^2+a)^3),and(number(a),a>0))",
    "f(x^3*sqrt(x^2+a),sqrt((x^2+a)^5)/5-a*sqrt((x^2+a)^3)/3,and(number(a),a<0))",
    "f(x^2/sqrt(x^2+a),1/2*x*sqrt(x^2+a)-1/2*a*log(x+sqrt(x^2+a)))",
    "f(x^3/sqrt(x^2+a),1/3*sqrt((x^2+a)^3)-a*sqrt(x^2+a))",
    "f(1/x^2*1/sqrt(x^2+a),-sqrt(x^2+a)/a/x)",
    "f(1/x^3*1/sqrt(x^2+a),-1/2*sqrt(x^2+a)/a/x^2+1/2*log((sqrt(a)+sqrt(x^2+a))/x)/a^(3/2),or(not(number(a)),a>0))",
    "f(1/x^3*1/sqrt(x^2-a),1/2*sqrt(x^2-a)/a/x^2+1/2*1/(a^(3/2))*arcsec(x/(a^(1/2))),or(not(number(a)),a>0))",
    "f(x^2*sqrt(a+x^6+3*a^(1/3)*x^4+3*a^(2/3)*x^2),1/6*x*sqrt((x^2+a^(1/3))^5)-1/24*a^(1/3)*x*sqrt((x^2+a^(1/3))^3)-1/16*a^(2/3)*x*sqrt(x^2+a^(1/3))-1/16*a*log(x+sqrt(x^2+a^(1/3))),or(not(number(a)),a>0))",
    "f(x^2*sqrt(-a-3*a^(1/3)*x^4+3*a^(2/3)*x^2+x^6),1/6*x*sqrt((x^2-a^(1/3))^5)+1/24*a^(1/3)*x*sqrt((x^2-a^(1/3))^3)-1/16*a^(2/3)*x*sqrt(x^2-a^(1/3))+1/16*a*log(x+sqrt(x^2-a^(1/3))),or(not(number(a)),a>0))",
    "f(x^3*sqrt(a+x^6+3*a^(1/3)*x^4+3*a^(2/3)*x^2),1/7*sqrt((x^2+a^(1/3))^7)-1/5*a^(1/3)*sqrt((x^2+a^(1/3))^5),or(not(number(a)),a>0))",
    "f(x^3*sqrt(-a-3*a^(1/3)*x^4+3*a^(2/3)*x^2+x^6),1/7*sqrt((x^2-a^(1/3))^7)+1/5*a^(1/3)*sqrt((x^2-a^(1/3))^5),or(not(number(a)),a>0))",
    "f(1/(x-a)/sqrt(x^2-a^2),-sqrt(x^2-a^2)/a/(x-a))",
    "f(1/(x+a)/sqrt(x^2-a^2),sqrt(x^2-a^2)/a/(x+a))",
    "f(sqrt(a-x^2),1/2*(x*sqrt(a-x^2)+a*arcsin(x/sqrt(abs(a)))))",
    "f(1/x*1/sqrt(a-x^2),-1/sqrt(a)*log((sqrt(a)+sqrt(a-x^2))/x),or(not(number(a)),a>0))",
    "f(sqrt(a-x^2)/x,sqrt(a-x^2)-sqrt(a)*log((sqrt(a)+sqrt(a-x^2))/x),or(not(number(a)),a>0))",
    "f(x/sqrt(a-x^2),-sqrt(a-x^2))",
    "f(x*sqrt(a-x^2),-1/3*sqrt((a-x^2)^3))",
    "f(x^2*sqrt(a-x^2),-x/4*sqrt((a-x^2)^3)+1/8*a*(x*sqrt(a-x^2)+a*arcsin(x/sqrt(a))),or(not(number(a)),a>0))",
    "f(x^3*sqrt(a-x^2),(-1/5*x^2-2/15*a)*sqrt((a-x^2)^3),or(not(number(a)),a>0))",
    "f(x^2/sqrt(a-x^2),-x/2*sqrt(a-x^2)+a/2*arcsin(x/sqrt(a)),or(not(number(a)),a>0))",
    "f(1/x^2*1/sqrt(a-x^2),-sqrt(a-x^2)/a/x,or(not(number(a)),a>0))",
    "f(sqrt(a-x^2)/x^2,-sqrt(a-x^2)/x-arcsin(x/sqrt(a)),or(not(number(a)),a>0))",
    "f(sqrt(a-x^2)/x^3,-1/2*sqrt(a-x^2)/x^2+1/2*log((sqrt(a)+sqrt(a-x^2))/x)/sqrt(a),or(not(number(a)),a>0))",
    "f(sqrt(a-x^2)/x^4,-1/3*sqrt((a-x^2)^3)/a/x^3,or(not(number(a)),a>0))",
    "f(sqrt(a*x^2+b),x*sqrt(a*x^2+b)/2+b*log(x*sqrt(a)+sqrt(a*x^2+b))/2/sqrt(a),and(number(a),a>0))",
    "f(sqrt(a*x^2+b),x*sqrt(a*x^2+b)/2+b*arcsin(x*sqrt(-a/b))/2/sqrt(-a),and(number(a),a<0))",
    "f(sin(a*x),-cos(a*x)/a)",
    "f(cos(a*x),sin(a*x)/a)",
    "f(tan(a*x),-log(cos(a*x))/a)",
    "f(1/tan(a*x),log(sin(a*x))/a)",
    "f(1/cos(a*x),log(tan(pi/4+a*x/2))/a)",
    "f(1/sin(a*x),log(tan(a*x/2))/a)",
    "f(sin(a*x)^2,x/2-sin(2*a*x)/(4*a))",
    "f(sin(a*x)^3,-cos(a*x)*(sin(a*x)^2+2)/(3*a))",
    "f(sin(a*x)^4,3/8*x-sin(2*a*x)/(4*a)+sin(4*a*x)/(32*a))",
    "f(cos(a*x)^2,x/2+sin(2*a*x)/(4*a))",
    "f(cos(a*x)^3,sin(a*x)*(cos(a*x)^2+2)/(3*a))",
    "f(cos(a*x)^4,3/8*x+sin(2*a*x)/(4*a)+sin(4*a*x)/(32*a))",
    "f(1/sin(a*x)^2,-1/(a*tan(a*x)))",
    "f(1/cos(a*x)^2,tan(a*x)/a)",
    "f(sin(a*x)*cos(a*x),sin(a*x)^2/(2*a))",
    "f(sin(a*x)^2*cos(a*x)^2,-sin(4*a*x)/(32*a)+x/8)",
    "f(sin(a*x)/cos(a*x)^2,1/(a*cos(a*x)))",
    "f(sin(a*x)^2/cos(a*x),(log(tan(pi/4+a*x/2))-sin(a*x))/a)",
    "f(cos(a*x)/sin(a*x)^2,-1/(a*sin(a*x)))",
    "f(1/(sin(a*x)*cos(a*x)),log(tan(a*x))/a)",
    "f(1/(sin(a*x)*cos(a*x)^2),(1/cos(a*x)+log(tan(a*x/2)))/a)",
    "f(1/(sin(a*x)^2*cos(a*x)),(log(tan(pi/4+a*x/2))-1/sin(a*x))/a)",
    "f(1/(sin(a*x)^2*cos(a*x)^2),-2/(a*tan(2*a*x)))",
    "f(sin(a+b*x),-cos(a+b*x)/b)",
    "f(cos(a+b*x),sin(a+b*x)/b)",
    "f(1/(b+b*sin(a*x)),-tan(pi/4-a*x/2)/a/b)",
    "f(1/(b-b*sin(a*x)),tan(pi/4+a*x/2)/a/b)",
    "f(1/(b+b*cos(a*x)),tan(a*x/2)/a/b)",
    "f(1/(b-b*cos(a*x)),-1/tan(a*x/2)/a/b)",
    "f(1/(a+b*sin(x)),1/sqrt(b^2-a^2)*log((a*tan(x/2)+b-sqrt(b^2-a^2))/(a*tan(x/2)+b+sqrt(b^2-a^2))),b^2-a^2)",
    "f(1/(a+b*cos(x)),1/sqrt(b^2-a^2)*log((sqrt(b^2-a^2)*tan(x/2)+a+b)/(sqrt(b^2-a^2)*tan(x/2)-a-b)),b^2-a^2)",
    "f(x*sin(a*x),sin(a*x)/a^2-x*cos(a*x)/a)",
    "f(x^2*sin(a*x),2*x*sin(a*x)/a^2-(a^2*x^2-2)*cos(a*x)/a^3)",
    "f(x*cos(a*x),cos(a*x)/a^2+x*sin(a*x)/a)",
    "f(x^2*cos(a*x),2*x*cos(a*x)/a^2+(a^2*x^2-2)*sin(a*x)/a^3)",
    "f(arcsin(a*x),x*arcsin(a*x)+sqrt(1-a^2*x^2)/a)",
    "f(arccos(a*x),x*arccos(a*x)-sqrt(1-a^2*x^2)/a)",
    "f(arctan(a*x),x*arctan(a*x)-1/2*log(1+a^2*x^2)/a)",
    "f(x*log(a*x),x^2*log(a*x)/2-x^2/4)",
    "f(x^2*log(a*x),x^3*log(a*x)/3-1/9*x^3)",
    "f(log(x)^2,x*log(x)^2-2*x*log(x)+2*x)",
    "f(1/x*1/(a+log(x)),log(a+log(x)))",
    "f(log(a*x+b),(a*x+b)*log(a*x+b)/a-x)",
    "f(log(a*x+b)/x^2,a/b*log(x)-(a*x+b)*log(a*x+b)/b/x)",
    "f(sinh(x),cosh(x))",
    "f(cosh(x),sinh(x))",
    "f(tanh(x),log(cosh(x)))",
    "f(x*sinh(x),x*cosh(x)-sinh(x))",
    "f(x*cosh(x),x*sinh(x)-cosh(x))",
    "f(sinh(x)^2,sinh(2*x)/4-x/2)",
    "f(tanh(x)^2,x-tanh(x))",
    "f(cosh(x)^2,sinh(2*x)/4+x/2)",
    "f(x^3*exp(a*x^2),exp(a*x^2)*(x^2/a-1/(a^2))/2)",
    "f(x^3*exp(a*x^2+b),exp(a*x^2)*exp(b)*(x^2/a-1/(a^2))/2)",
    "f(exp(a*x^2),-i*sqrt(pi)*erf(i*sqrt(a)*x)/sqrt(a)/2)",
    "f(erf(a*x),x*erf(a*x)+exp(-a^2*x^2)/a/sqrt(pi))",
    "f(x^2*(1-x^2)^(3/2),(x*sqrt(1-x^2)*(-8*x^4+14*x^2-3)+3*arcsin(x))/48)",
    "f(x^2*(1-x^2)^(5/2),(x*sqrt(1-x^2)*(48*x^6-136*x^4+118*x^2-15)+15*arcsin(x))/384)",
    "f(x^4*(1-x^2)^(3/2),(-x*sqrt(1-x^2)*(16*x^6-24*x^4+2*x^2+3)+3*arcsin(x))/128)",
    "f(x*exp(a*x),exp(a*x)*(a*x-1)/(a^2))",
    "f(x*exp(a*x+b),exp(a*x+b)*(a*x-1)/(a^2))",
    "f(x^2*exp(a*x),exp(a*x)*(a^2*x^2-2*a*x+2)/(a^3))",
    "f(x^2*exp(a*x+b),exp(a*x+b)*(a^2*x^2-2*a*x+2)/(a^3))",
    "f(x^3*exp(a*x),exp(a*x)*x^3/a-3/a*integral(x^2*exp(a*x),x))",
    "f(x^3*exp(a*x+b),exp(a*x+b)*x^3/a-3/a*integral(x^2*exp(a*x+b),x))"
  ];
  function Eval_integral(p1) {
    let n = 0;
    p1 = cdr(p1);
    let F = Eval(car(p1));
    p1 = cdr(p1);
    const p2 = Eval(car(p1));
    let N2, X;
    if (p2 === symbol(NIL)) {
      X = guess(F);
      N2 = symbol(NIL);
    } else if (isNumericAtom(p2)) {
      X = guess(F);
      N2 = p2;
    } else {
      X = p2;
      p1 = cdr(p1);
      N2 = Eval(car(p1));
    }
    while (true) {
      if (isNumericAtom(N2)) {
        n = nativeInt(N2);
        if (isNaN(n)) {
          stop("nth integral: check n");
        }
      } else {
        n = 1;
      }
      let temp = F;
      if (n >= 0) {
        for (let i = 0; i < n; i++) {
          temp = integral(temp, X);
        }
      } else {
        n = -n;
        for (let i = 0; i < n; i++) {
          temp = derivative(temp, X);
        }
      }
      F = temp;
      if (N2 === symbol(NIL)) {
        break;
      }
      if (isNumericAtom(N2)) {
        p1 = cdr(p1);
        N2 = Eval(car(p1));
        if (N2 === symbol(NIL)) {
          break;
        }
        if (!isNumericAtom(N2)) {
          X = N2;
          p1 = cdr(p1);
          N2 = Eval(car(p1));
        }
      } else {
        X = N2;
        p1 = cdr(p1);
        N2 = Eval(car(p1));
      }
    }
    return F;
  }
  function integral(F, X) {
    let integ;
    if (isadd(F)) {
      integ = integral_of_sum(F, X);
    } else if (ismultiply(F)) {
      integ = integral_of_product(F, X);
    } else {
      integ = integral_of_form(F, X);
    }
    if (Find(integ, symbol(INTEGRAL))) {
      stop("integral: sorry, could not find a solution");
    }
    return Eval(simplify(integ));
  }
  function integral_of_sum(F, X) {
    F = cdr(F);
    let result = integral(car(F), X);
    if (iscons(F)) {
      result = F.tail().reduce((acc, b) => add(acc, integral(b, X)), result);
    }
    return result;
  }
  function integral_of_product(F, X) {
    const [constantExpr, variableExpr] = partition(F, X);
    return multiply(constantExpr, integral_of_form(variableExpr, X));
  }
  function integral_of_form(F, X) {
    const hc = italu_hashcode(F, X).toFixed(6);
    const tab = hashed_itab[hc];
    if (!tab) {
      return makeList(symbol(INTEGRAL), F, X);
    }
    const [p3, _] = transform(F, X, tab, false);
    if (p3 === symbol(NIL)) {
      return makeList(symbol(INTEGRAL), F, X);
    }
    return p3;
  }
  var hashcode_values = {
    "x": 0.95532,
    "constexp": 1.43762,
    "constant": 1.1441659362941434,
    "constbase": 1.2036412230421882,
    "sin": 1.7330548251830322,
    "arcsin": 1.6483368529465805,
    "cos": 1.0586721236863401,
    "arccos": 1.8405225918106694,
    "tan": 1.1224943776292506,
    "arctan": 1.1297397925394963,
    "sinh": 1.8176164926060079,
    "cosh": 1.9404934661708022,
    "tanh": 1.6421307715103122,
    "log": 1.477443701354924,
    "erf": 1.0825269225702916
  };
  function italu_hashcode(u, x) {
    if (issymbol(u)) {
      if (equal(u, x)) {
        return hashcode_values.x;
      } else {
        return hashcode_values.constant;
      }
    } else if (iscons(u)) {
      const sym = car(u);
      switch (issymbol(sym) && sym.printname) {
        case ADD:
          return hash_addition(cdr(u), x);
        case MULTIPLY:
          return hash_multiplication(cdr(u), x);
        case POWER:
          return hash_power(cadr(u), caddr(u), x);
        case EXP:
          return hash_power(symbol(E), cadr(u), x);
        case SQRT:
          var half = double(0.5);
          return hash_power(cadr(u), half, x);
        default:
          return hash_function(u, x);
      }
    }
    return hashcode_values.constant;
  }
  function hash_function(u, x) {
    if (!Find(cadr(u), x)) {
      return hashcode_values.constant;
    }
    const name = car(u);
    const arg_hash = italu_hashcode(cadr(u), x);
    const base = hashcode_values[name.printname];
    if (!base) {
      throw new Error("Unsupported function " + name.printname);
    }
    return Math.pow(base, arg_hash);
  }
  function hash_addition(terms, x) {
    const term_set = {};
    while (iscons(terms)) {
      const term = car(terms);
      terms = cdr(terms);
      let term_hash = 0;
      if (Find(term, x)) {
        term_hash = italu_hashcode(term, x);
      } else {
        term_hash = hashcode_values.constant;
      }
      term_set[term_hash.toFixed(6)] = true;
    }
    let sum2 = 0;
    for (let k of Object.keys(term_set || {})) {
      const v = term_set[k];
      sum2 = sum2 + Number(k);
    }
    return sum2;
  }
  function hash_multiplication(terms, x) {
    let product = 1;
    if (iscons(terms)) {
      [...terms].forEach((term) => {
        if (Find(term, x)) {
          product = product * italu_hashcode(term, x);
        }
      });
    }
    return product;
  }
  function hash_power(base, power2, x) {
    let base_hash = hashcode_values.constant;
    let exp_hash = hashcode_values.constexp;
    if (Find(base, x)) {
      base_hash = italu_hashcode(base, x);
    }
    if (Find(power2, x)) {
      exp_hash = italu_hashcode(power2, x);
    } else {
      if (base_hash === hashcode_values.constant) {
        return hashcode_values.constant;
      }
      if (isminusone(power2)) {
        exp_hash = -1;
      } else if (isoneovertwo(power2)) {
        exp_hash = 0.5;
      } else if (isminusoneovertwo(power2)) {
        exp_hash = -0.5;
      } else if (equalq(power2, 2, 1)) {
        exp_hash = 2;
      } else if (equalq(power2, -2, 1)) {
        exp_hash = -2;
      }
    }
    return Math.pow(base_hash, exp_hash);
  }
  function make_hashed_itab() {
    const tab = {};
    for (let s of Array.from(itab)) {
      const f = scan_meta(s);
      const u = cadr(f);
      const h = italu_hashcode(u, symbol(METAX));
      const key = h.toFixed(6);
      if (!tab[key]) {
        tab[key] = [];
      }
      tab[key].push(s);
    }
    console.log(`hashed_itab = ${JSON.stringify(tab, null, 2)}`);
    return tab;
  }
  var hashed_itab = {
    "1.144166": ["f(a,a*x)"],
    "1.046770": ["f(1/x,log(x))"],
    "0.936400": ["f(x^a,x^(a+1)/(a+1))"],
    "1.095727": ["f(x^(-2),-x^(-1))"],
    "1.023118": ["f(x^(-1/2),2*x^(1/2))"],
    "0.977405": ["f(x^(1/2),2/3*x^(3/2))"],
    "0.955320": ["f(x,x^2/2)"],
    "0.912636": ["f(x^2,x^3/3)"],
    "1.137302": [
      "f(exp(a*x),1/a*exp(a*x))",
      "f(a^x,a^x/log(a),or(not(number(a)),a>0))"
    ],
    "1.326774": ["f(exp(a*x+b),1/a*exp(a*x+b))"],
    "1.080259": ["f(x*exp(a*x^2),exp(a*x^2)/(2*a))"],
    "1.260228": ["f(x*exp(a*x^2+b),exp(a*x^2+b)/(2*a))"],
    "1.451902": ["f(log(a*x),x*log(a*x)-x)"],
    "0.486192": [
      "f(1/(a+x^2),1/sqrt(a)*arctan(x/sqrt(a)),or(not(number(a)),a>0))",
      "f(1/(a-x^2),1/sqrt(a)*arctanh(x/sqrt(a)))",
      "f(1/(a+b*x^2),1/sqrt(a*b)*arctan(x*sqrt(a*b)/a),or(not(number(a*b)),a*b>0))",
      "f(1/(a+b*x^2),1/(2*sqrt(-a*b))*log((a+x*sqrt(-a*b))/(a-x*sqrt(-a*b))),or(not(number(a*b)),a*b<0))"
    ],
    "0.697274": [
      "f(1/sqrt(a-x^2),arcsin(x/(sqrt(a))))",
      "f(1/sqrt(a+x^2),log(x+sqrt(a+x^2)))",
      "f(1/sqrt(x^2+a),log(x+sqrt(x^2+a)))"
    ],
    "0.476307": ["f(1/(a+b*x),1/b*log(a+b*x))"],
    "0.226868": ["f(1/(a+b*x)^2,-1/(b*(a+b*x)))"],
    "2.904531": ["f(1/(a+b*x)^3,-1/(2*b)*1/(a+b*x)^2)"],
    "0.455026": ["f(x/(a+b*x),x/b-a*log(a+b*x)/b/b)"],
    "0.216732": ["f(x/(a+b*x)^2,1/b^2*(log(a+b*x)+a/(a+b*x)))"],
    "0.434695": [
      "f(x^2/(a+b*x),1/b^2*(1/2*(a+b*x)^2-2*a*(a+b*x)+a^2*log(a+b*x)))"
    ],
    "0.207048": ["f(x^2/(a+b*x)^2,1/b^3*(a+b*x-2*a*log(a+b*x)-a^2/(a+b*x)))"],
    "2.650781": [
      "f(x^2/(a+b*x)^3,1/b^3*(log(a+b*x)+2*a/(a+b*x)-1/2*a^2/(a+b*x)^2))"
    ],
    "0.498584": ["f(1/x*1/(a+b*x),-1/a*log((a+b*x)/x))"],
    "0.237479": ["f(1/x*1/(a+b*x)^2,1/a*1/(a+b*x)-1/a^2*log((a+b*x)/x))"],
    "3.040375": [
      "f(1/x*1/(a+b*x)^3,1/a^3*(1/2*((2*a+b*x)/(a+b*x))^2+log(x/(a+b*x))))"
    ],
    "0.521902": ["f(1/x^2*1/(a+b*x),-1/(a*x)+b/a^2*log((a+b*x)/x))"],
    "0.446014": [
      "f(1/x^3*1/(a+b*x),(2*b*x-a)/(2*a^2*x^2)+b^2/a^3*log(x/(a+b*x)))"
    ],
    "0.248586": [
      "f(1/x^2*1/(a+b*x)^2,-(a+2*b*x)/(a^2*x*(a+b*x))+2*b/a^3*log((a+b*x)/x))"
    ],
    "0.464469": ["f(x/(a+b*x^2),1/2*1/b*log(a+b*x^2))"],
    "0.443716": ["f(x^2/(a+b*x^2),x/b-a/b*integral(1/(a+b*x^2),x))"],
    "0.236382": [
      "f(1/(a+b*x^2)^2,x/(2*a*(a+b*x^2))+1/2*1/a*integral(1/(a+b*x^2),x))"
    ],
    "0.508931": ["f(1/x*1/(a+b*x^2),1/2*1/a*log(x^2/(a+b*x^2)))"],
    "0.532733": ["f(1/x^2*1/(a+b*x^2),-1/(a*x)-b/a*integral(1/(a+b*x^2),x))"],
    "0.480638": [
      "f(1/(a+b*x^3),1/3*1/a*(a/b)^(1/3)*(1/2*log(((a/b)^(1/3)+x)^3/(a+b*x^3))+sqrt(3)*arctan((2*x-(a/b)^(1/3))*(a/b)^(-1/3)/sqrt(3))))"
    ],
    "0.438648": ["f(x^2/(a+b*x^3),1/3*1/b*log(a+b*x^3))"],
    "0.459164": [
      "f(x/(a+b*x^4),1/2*sqrt(b/a)/b*arctan(x^2*sqrt(b/a)),or(not(number(a*b)),a*b>0))",
      "f(x/(a+b*x^4),1/4*sqrt(-b/a)/b*log((x^2-sqrt(-a/b))/(x^2+sqrt(-a/b))),or(not(number(a*b)),a*b<0))"
    ],
    "0.450070": ["f(x^3/(a+b*x^4),1/4*1/b*log(a+b*x^4))"],
    "1.448960": ["f(sqrt(a+b*x),2/3*1/b*sqrt((a+b*x)^3))"],
    "1.384221": ["f(x*sqrt(a+b*x),-2*(2*a-3*b*x)*sqrt((a+b*x)^3)/15/b^2)"],
    "1.322374": [
      "f(x^2*sqrt(a+b*x),2*(8*a^2-12*a*b*x+15*b^2*x^2)*sqrt((a+b*x)^3)/105/b^3)"
    ],
    "1.516728": [
      "f(sqrt(a+b*x)/x,2*sqrt(a+b*x)+a*integral(1/x*1/sqrt(a+b*x),x))"
    ],
    "1.587665": [
      "f(sqrt(a+b*x)/x^2,-sqrt(a+b*x)/x+b/2*integral(1/x*1/sqrt(a+b*x),x))"
    ],
    "0.690150": ["f(1/sqrt(a+b*x),2*sqrt(a+b*x)/b)"],
    "0.659314": ["f(x/sqrt(a+b*x),-2/3*(2*a-b*x)*sqrt(a+b*x)/b^2)"],
    "0.629856": [
      "f(x^2/sqrt(a+b*x),2/15*(8*a^2-4*a*b*x+3*b^2*x^2)*sqrt(a+b*x)/b^3)"
    ],
    "0.722428": [
      "f(1/x*1/sqrt(a+b*x),1/sqrt(a)*log((sqrt(a+b*x)-sqrt(a))/(sqrt(a+b*x)+sqrt(a))),or(not(number(a)),a>0))",
      "f(1/x*1/sqrt(a+b*x),2/sqrt(-a)*arctan(sqrt(-(a+b*x)/a)),or(not(number(a)),a<0))"
    ],
    "0.756216": [
      "f(1/x^2*1/sqrt(a+b*x),-sqrt(a+b*x)/a/x-1/2*b/a*integral(1/x*1/sqrt(a+b*x),x))"
    ],
    "1.434156": [
      "f(sqrt(x^2+a),1/2*(x*sqrt(x^2+a)+a*log(x+sqrt(x^2+a))))",
      "f(sqrt(a-x^2),1/2*(x*sqrt(a-x^2)+a*arcsin(x/sqrt(abs(a)))))",
      "f(sqrt(a*x^2+b),x*sqrt(a*x^2+b)/2+b*log(x*sqrt(a)+sqrt(a*x^2+b))/2/sqrt(a),and(number(a),a>0))",
      "f(sqrt(a*x^2+b),x*sqrt(a*x^2+b)/2+b*arcsin(x*sqrt(-a/b))/2/sqrt(-a),and(number(a),a<0))"
    ],
    "0.729886": [
      "f(1/x*1/sqrt(x^2+a),arcsec(x/sqrt(-a))/sqrt(-a),or(not(number(a)),a<0))",
      "f(1/x*1/sqrt(x^2+a),-1/sqrt(a)*log((sqrt(a)+sqrt(x^2+a))/x),or(not(number(a)),a>0))",
      "f(1/x*1/sqrt(a-x^2),-1/sqrt(a)*log((sqrt(a)+sqrt(a-x^2))/x),or(not(number(a)),a>0))"
    ],
    "1.501230": [
      "f(sqrt(x^2+a)/x,sqrt(x^2+a)-sqrt(a)*log((sqrt(a)+sqrt(x^2+a))/x),or(not(number(a)),a>0))",
      "f(sqrt(x^2+a)/x,sqrt(x^2+a)-sqrt(-a)*arcsec(x/sqrt(-a)),or(not(number(a)),a<0))",
      "f(sqrt(a-x^2)/x,sqrt(a-x^2)-sqrt(a)*log((sqrt(a)+sqrt(a-x^2))/x),or(not(number(a)),a>0))"
    ],
    "0.666120": ["f(x/sqrt(x^2+a),sqrt(x^2+a))", "f(x/sqrt(a-x^2),-sqrt(a-x^2))"],
    "1.370077": [
      "f(x*sqrt(x^2+a),1/3*sqrt((x^2+a)^3))",
      "f(x*sqrt(a-x^2),-1/3*sqrt((a-x^2)^3))"
    ],
    "1.730087": [
      "f(sqrt(a+x^6+3*a^(1/3)*x^4+3*a^(2/3)*x^2),1/4*(x*sqrt((x^2+a^(1/3))^3)+3/2*a^(1/3)*x*sqrt(x^2+a^(1/3))+3/2*a^(2/3)*log(x+sqrt(x^2+a^(1/3)))))",
      "f(sqrt(-a+x^6-3*a^(1/3)*x^4+3*a^(2/3)*x^2),1/4*(x*sqrt((x^2-a^(1/3))^3)-3/2*a^(1/3)*x*sqrt(x^2-a^(1/3))+3/2*a^(2/3)*log(x+sqrt(x^2-a^(1/3)))))"
    ],
    "0.578006": [
      "f(1/sqrt(a+x^6+3*a^(1/3)*x^4+3*a^(2/3)*x^2),x/a^(1/3)/sqrt(x^2+a^(1/3)))"
    ],
    "0.552180": [
      "f(x/sqrt(a+x^6+3*a^(1/3)*x^4+3*a^(2/3)*x^2),-1/sqrt(x^2+a^(1/3)))"
    ],
    "1.652787": [
      "f(x*sqrt(a+x^6+3*a^(1/3)*x^4+3*a^(2/3)*x^2),1/5*sqrt((x^2+a^(1/3))^5))"
    ],
    "1.308862": [
      "f(x^2*sqrt(x^2+a),1/4*x*sqrt((x^2+a)^3)-1/8*a*x*sqrt(x^2+a)-1/8*a^2*log(x+sqrt(x^2+a)))",
      "f(x^2*sqrt(a-x^2),-x/4*sqrt((a-x^2)^3)+1/8*a*(x*sqrt(a-x^2)+a*arcsin(x/sqrt(a))),or(not(number(a)),a>0))"
    ],
    "1.342944": [
      "f(x^3*sqrt(x^2+a),(1/5*x^2-2/15*a)*sqrt((x^2+a)^3),and(number(a),a>0))",
      "f(x^3*sqrt(x^2+a),sqrt((x^2+a)^5)/5-a*sqrt((x^2+a)^3)/3,and(number(a),a<0))",
      "f(x^3*sqrt(a-x^2),(-1/5*x^2-2/15*a)*sqrt((a-x^2)^3),or(not(number(a)),a>0))",
      "f(sqrt(a-x^2)/x^3,-1/2*sqrt(a-x^2)/x^2+1/2*log((sqrt(a)+sqrt(a-x^2))/x)/sqrt(a),or(not(number(a)),a>0))",
      "f(sqrt(a-x^2)/x^4,-1/3*sqrt((a-x^2)^3)/a/x^3,or(not(number(a)),a>0))"
    ],
    "0.636358": [
      "f(x^2/sqrt(x^2+a),1/2*x*sqrt(x^2+a)-1/2*a*log(x+sqrt(x^2+a)))",
      "f(x^2/sqrt(a-x^2),-x/2*sqrt(a-x^2)+a/2*arcsin(x/sqrt(a)),or(not(number(a)),a>0))"
    ],
    "0.652928": [
      "f(x^3/sqrt(x^2+a),1/3*sqrt((x^2+a)^3)-a*sqrt(x^2+a))",
      "f(1/x^3*1/sqrt(x^2+a),-1/2*sqrt(x^2+a)/a/x^2+1/2*log((sqrt(a)+sqrt(x^2+a))/x)/a^(3/2),or(not(number(a)),a>0))",
      "f(1/x^3*1/sqrt(x^2-a),1/2*sqrt(x^2-a)/a/x^2+1/2*1/(a^(3/2))*arcsec(x/(a^(1/2))),or(not(number(a)),a>0))"
    ],
    "0.764022": [
      "f(1/x^2*1/sqrt(x^2+a),-sqrt(x^2+a)/a/x)",
      "f(1/x^2*1/sqrt(a-x^2),-sqrt(a-x^2)/a/x,or(not(number(a)),a>0))"
    ],
    "1.578940": [
      "f(x^2*sqrt(a+x^6+3*a^(1/3)*x^4+3*a^(2/3)*x^2),1/6*x*sqrt((x^2+a^(1/3))^5)-1/24*a^(1/3)*x*sqrt((x^2+a^(1/3))^3)-1/16*a^(2/3)*x*sqrt(x^2+a^(1/3))-1/16*a*log(x+sqrt(x^2+a^(1/3))),or(not(number(a)),a>0))",
      "f(x^2*sqrt(-a-3*a^(1/3)*x^4+3*a^(2/3)*x^2+x^6),1/6*x*sqrt((x^2-a^(1/3))^5)+1/24*a^(1/3)*x*sqrt((x^2-a^(1/3))^3)-1/16*a^(2/3)*x*sqrt(x^2-a^(1/3))+1/16*a*log(x+sqrt(x^2-a^(1/3))),or(not(number(a)),a>0))"
    ],
    "1.620055": [
      "f(x^3*sqrt(a+x^6+3*a^(1/3)*x^4+3*a^(2/3)*x^2),1/7*sqrt((x^2+a^(1/3))^7)-1/5*a^(1/3)*sqrt((x^2+a^(1/3))^5),or(not(number(a)),a>0))",
      "f(x^3*sqrt(-a-3*a^(1/3)*x^4+3*a^(2/3)*x^2+x^6),1/7*sqrt((x^2-a^(1/3))^7)+1/5*a^(1/3)*sqrt((x^2-a^(1/3))^5),or(not(number(a)),a>0))"
    ],
    "0.332117": [
      "f(1/(x-a)/sqrt(x^2-a^2),-sqrt(x^2-a^2)/a/(x-a))",
      "f(1/(x+a)/sqrt(x^2-a^2),sqrt(x^2-a^2)/a/(x+a))"
    ],
    "1.571443": [
      "f(sqrt(a-x^2)/x^2,-sqrt(a-x^2)/x-arcsin(x/sqrt(a)),or(not(number(a)),a>0))"
    ],
    "1.690994": ["f(sin(a*x),-cos(a*x)/a)"],
    "1.055979": ["f(cos(a*x),sin(a*x)/a)"],
    "1.116714": ["f(tan(a*x),-log(cos(a*x))/a)"],
    "0.895484": ["f(1/tan(a*x),log(sin(a*x))/a)"],
    "0.946989": ["f(1/cos(a*x),log(tan(pi/4+a*x/2))/a)"],
    "0.591368": ["f(1/sin(a*x),log(tan(a*x/2))/a)"],
    "2.859462": ["f(sin(a*x)^2,x/2-sin(2*a*x)/(4*a))"],
    "2.128050": [
      "f(sin(a*x)^3,-cos(a*x)*(sin(a*x)^2+2)/(3*a))",
      "f(sin(a*x)^4,3/8*x-sin(2*a*x)/(4*a)+sin(4*a*x)/(32*a))"
    ],
    "1.115091": ["f(cos(a*x)^2,x/2+sin(2*a*x)/(4*a))"],
    "1.081452": [
      "f(cos(a*x)^3,sin(a*x)*(cos(a*x)^2+2)/(3*a))",
      "f(cos(a*x)^4,3/8*x+sin(2*a*x)/(4*a)+sin(4*a*x)/(32*a))"
    ],
    "0.349716": ["f(1/sin(a*x)^2,-1/(a*tan(a*x)))"],
    "0.896788": ["f(1/cos(a*x)^2,tan(a*x)/a)"],
    "1.785654": ["f(sin(a*x)*cos(a*x),sin(a*x)^2/(2*a))"],
    "3.188560": ["f(sin(a*x)^2*cos(a*x)^2,-sin(4*a*x)/(32*a)+x/8)"],
    "1.516463": ["f(sin(a*x)/cos(a*x)^2,1/(a*cos(a*x)))"],
    "2.707879": ["f(sin(a*x)^2/cos(a*x),(log(tan(pi/4+a*x/2))-sin(a*x))/a)"],
    "0.369293": ["f(cos(a*x)/sin(a*x)^2,-1/(a*sin(a*x)))"],
    "0.560019": ["f(1/(sin(a*x)*cos(a*x)),log(tan(a*x))/a)"],
    "0.530332": ["f(1/(sin(a*x)*cos(a*x)^2),(1/cos(a*x)+log(tan(a*x/2)))/a)"],
    "0.331177": [
      "f(1/(sin(a*x)^2*cos(a*x)),(log(tan(pi/4+a*x/2))-1/sin(a*x))/a)"
    ],
    "0.313621": ["f(1/(sin(a*x)^2*cos(a*x)^2),-2/(a*tan(2*a*x)))"],
    "3.172365": ["f(sin(a+b*x),-cos(a+b*x)/b)"],
    "1.127162": ["f(cos(a+b*x),sin(a+b*x)/b)"],
    "0.352714": [
      "f(1/(b+b*sin(a*x)),-tan(pi/4-a*x/2)/a/b)",
      "f(1/(b-b*sin(a*x)),tan(pi/4+a*x/2)/a/b)",
      "f(1/(a+b*sin(x)),1/sqrt(b^2-a^2)*log((a*tan(x/2)+b-sqrt(b^2-a^2))/(a*tan(x/2)+b+sqrt(b^2-a^2))),b^2-a^2)"
    ],
    "0.454515": [
      "f(1/(b+b*cos(a*x)),tan(a*x/2)/a/b)",
      "f(1/(b-b*cos(a*x)),-1/tan(a*x/2)/a/b)",
      "f(1/(a+b*cos(x)),1/sqrt(b^2-a^2)*log((sqrt(b^2-a^2)*tan(x/2)+a+b)/(sqrt(b^2-a^2)*tan(x/2)-a-b)),b^2-a^2)"
    ],
    "1.615441": ["f(x*sin(a*x),sin(a*x)/a^2-x*cos(a*x)/a)"],
    "1.543263": ["f(x^2*sin(a*x),2*x*sin(a*x)/a^2-(a^2*x^2-2)*cos(a*x)/a^3)"],
    "1.008798": ["f(x*cos(a*x),cos(a*x)/a^2+x*sin(a*x)/a)"],
    "0.963724": ["f(x^2*cos(a*x),2*x*cos(a*x)/a^2+(a^2*x^2-2)*sin(a*x)/a^3)"],
    "1.611938": ["f(arcsin(a*x),x*arcsin(a*x)+sqrt(1-a^2*x^2)/a)"],
    "1.791033": ["f(arccos(a*x),x*arccos(a*x)-sqrt(1-a^2*x^2)/a)"],
    "1.123599": ["f(arctan(a*x),x*arctan(a*x)-1/2*log(1+a^2*x^2)/a)"],
    "1.387031": ["f(x*log(a*x),x^2*log(a*x)/2-x^2/4)"],
    "1.325058": ["f(x^2*log(a*x),x^3*log(a*x)/3-1/9*x^3)"],
    "2.108018": ["f(log(x)^2,x*log(x)^2-2*x*log(x)+2*x)"],
    "0.403214": ["f(1/x*1/(a+log(x)),log(a+log(x)))"],
    "2.269268": ["f(log(a*x+b),(a*x+b)*log(a*x+b)/a-x)"],
    "2.486498": ["f(log(a*x+b)/x^2,a/b*log(x)-(a*x+b)*log(a*x+b)/b/x)"],
    "1.769733": ["f(sinh(x),cosh(x))"],
    "1.883858": ["f(cosh(x),sinh(x))"],
    "1.606140": ["f(tanh(x),log(cosh(x)))"],
    "1.690661": ["f(x*sinh(x),x*cosh(x)-sinh(x))"],
    "1.799688": ["f(x*cosh(x),x*sinh(x)-cosh(x))"],
    "3.131954": ["f(sinh(x)^2,sinh(2*x)/4-x/2)"],
    "2.579685": ["f(tanh(x)^2,x-tanh(x))"],
    "3.548923": ["f(cosh(x)^2,sinh(2*x)/4+x/2)"],
    "1.058866": ["f(x^3*exp(a*x^2),exp(a*x^2)*(x^2/a-1/(a^2))/2)"],
    "1.235270": ["f(x^3*exp(a*x^2+b),exp(a*x^2)*exp(b)*(x^2/a-1/(a^2))/2)"],
    "1.130783": ["f(exp(a*x^2),-i*sqrt(pi)*erf(i*sqrt(a)*x)/sqrt(a)/2)"],
    "1.078698": ["f(erf(a*x),x*erf(a*x)+exp(-a^2*x^2)/a/sqrt(pi))"],
    "2.573650": [
      "f(x^2*(1-x^2)^(3/2),(x*sqrt(1-x^2)*(-8*x^4+14*x^2-3)+3*arcsin(x))/48)",
      "f(x^2*(1-x^2)^(5/2),(x*sqrt(1-x^2)*(48*x^6-136*x^4+118*x^2-15)+15*arcsin(x))/384)"
    ],
    "2.640666": [
      "f(x^4*(1-x^2)^(3/2),(-x*sqrt(1-x^2)*(16*x^6-24*x^4+2*x^2+3)+3*arcsin(x))/128)"
    ],
    "1.086487": ["f(x*exp(a*x),exp(a*x)*(a*x-1)/(a^2))"],
    "1.267493": ["f(x*exp(a*x+b),exp(a*x+b)*(a*x-1)/(a^2))"],
    "1.037943": ["f(x^2*exp(a*x),exp(a*x)*(a^2*x^2-2*a*x+2)/(a^3))"],
    "1.210862": ["f(x^2*exp(a*x+b),exp(a*x+b)*(a^2*x^2-2*a*x+2)/(a^3))"],
    "1.064970": ["f(x^3*exp(a*x),exp(a*x)*x^3/a-3/a*integral(x^2*exp(a*x),x))"],
    "1.242392": [
      "f(x^3*exp(a*x+b),exp(a*x+b)*x^3/a-3/a*integral(x^2*exp(a*x+b),x))"
    ]
  };

  // bazel-out/k8-fastbuild/bin/sources/log.js
  function Eval_log(p1) {
    return logarithm(Eval(cadr(p1)));
  }
  function logarithm(p1) {
    if (p1 === symbol(E)) {
      return Constants.one;
    }
    if (equaln(p1, 1)) {
      return Constants.zero;
    }
    if (isnegativenumber(p1)) {
      return add(logarithm(negate(p1)), multiply(Constants.imaginaryunit, Constants.Pi()));
    }
    if (isdouble(p1)) {
      return double(Math.log(p1.d));
    }
    if (isfraction(p1)) {
      return subtract(logarithm(numerator(p1)), logarithm(denominator(p1)));
    }
    if (ispower(p1)) {
      return multiply(caddr(p1), logarithm(cadr(p1)));
    }
    if (ismultiply(p1)) {
      return p1.tail().map(logarithm).reduce(add, Constants.zero);
    }
    return makeList(symbol(LOG), p1);
  }

  // bazel-out/k8-fastbuild/bin/sources/sgn.js
  function Eval_sgn(p1) {
    return sgn(Eval(cadr(p1)));
  }
  function sgn(X) {
    if (isdouble(X)) {
      if (X.d > 0) {
        return Constants.one;
      }
      if (X.d === 0) {
        return Constants.one;
      }
      return Constants.negOne;
    }
    if (isrational(X)) {
      if (MSIGN(mmul(X.q.a, X.q.b)) === -1) {
        return Constants.negOne;
      }
      if (MZERO(mmul(X.q.a, X.q.b))) {
        return Constants.zero;
      }
      return Constants.one;
    }
    if (iscomplexnumber(X)) {
      return multiply(power(Constants.negOne, absval(X)), X);
    }
    if (isnegativeterm(X)) {
      return multiply(makeList(symbol(SGN), negate(X)), Constants.negOne);
    }
    return makeList(symbol(SGN), X);
  }

  // bazel-out/k8-fastbuild/bin/sources/sinh.js
  function Eval_sinh(p1) {
    return ysinh(Eval(cadr(p1)));
  }
  function ysinh(p1) {
    if (car(p1) === symbol(ARCSINH)) {
      return cadr(p1);
    }
    if (isdouble(p1)) {
      let d = Math.sinh(p1.d);
      if (Math.abs(d) < 1e-10) {
        d = 0;
      }
      return double(d);
    }
    if (isZeroAtomOrTensor(p1)) {
      return Constants.zero;
    }
    return makeList(symbol(SINH), p1);
  }

  // bazel-out/k8-fastbuild/bin/sources/derivative.js
  function Eval_derivative(p1) {
    p1 = cdr(p1);
    let F = Eval(car(p1));
    p1 = cdr(p1);
    let X, N2;
    const p2 = Eval(car(p1));
    if (p2 === symbol(NIL)) {
      X = guess(F);
      N2 = symbol(NIL);
    } else if (isNumericAtom(p2)) {
      X = guess(F);
      N2 = p2;
    } else {
      X = p2;
      p1 = cdr(p1);
      N2 = Eval(car(p1));
    }
    while (true) {
      let n;
      if (isNumericAtom(N2)) {
        n = nativeInt(N2);
        if (isNaN(n)) {
          stop("nth derivative: check n");
        }
      } else {
        n = 1;
      }
      let temp = F;
      if (n >= 0) {
        for (let i = 0; i < n; i++) {
          temp = derivative(temp, X);
        }
      } else {
        n = -n;
        for (let i = 0; i < n; i++) {
          temp = integral(temp, X);
        }
      }
      F = temp;
      if (N2 === symbol(NIL)) {
        break;
      }
      if (isNumericAtom(N2)) {
        p1 = cdr(p1);
        N2 = Eval(car(p1));
        if (N2 === symbol(NIL)) {
          break;
        }
        if (!isNumericAtom(N2)) {
          X = N2;
          p1 = cdr(p1);
          N2 = Eval(car(p1));
        }
      } else {
        X = N2;
        p1 = cdr(p1);
        N2 = Eval(car(p1));
      }
    }
    return F;
  }
  function derivative(p1, p2) {
    if (isNumericAtom(p2)) {
      stop("undefined function");
    }
    if (istensor(p1)) {
      if (istensor(p2)) {
        return d_tensor_tensor(p1, p2);
      } else {
        return d_tensor_scalar(p1, p2);
      }
    } else {
      if (istensor(p2)) {
        return d_scalar_tensor(p1, p2);
      } else {
        return d_scalar_scalar(p1, p2);
      }
    }
  }
  function d_scalar_scalar(p1, p2) {
    if (issymbol(p2)) {
      return d_scalar_scalar_1(p1, p2);
    }
    const arg1 = subst(p1, p2, symbol(SECRETX));
    return subst(derivative(arg1, symbol(SECRETX)), symbol(SECRETX), p2);
  }
  function d_scalar_scalar_1(p1, p2) {
    if (equal(p1, p2)) {
      return Constants.one;
    }
    if (!iscons(p1)) {
      return Constants.zero;
    }
    if (isadd(p1)) {
      return dsum(p1, p2);
    }
    switch (car(p1)) {
      case symbol(MULTIPLY):
        return dproduct(p1, p2);
      case symbol(POWER):
        return dpower(p1, p2);
      case symbol(DERIVATIVE):
        return dd(p1, p2);
      case symbol(LOG):
        return dlog(p1, p2);
      case symbol(SIN):
        return dsin(p1, p2);
      case symbol(COS):
        return dcos(p1, p2);
      case symbol(TAN):
        return dtan(p1, p2);
      case symbol(ARCSIN):
        return darcsin(p1, p2);
      case symbol(ARCCOS):
        return darccos(p1, p2);
      case symbol(ARCTAN):
        return darctan(p1, p2);
      case symbol(SINH):
        return dsinh(p1, p2);
      case symbol(COSH):
        return dcosh(p1, p2);
      case symbol(TANH):
        return dtanh(p1, p2);
      case symbol(ARCSINH):
        return darcsinh(p1, p2);
      case symbol(ARCCOSH):
        return darccosh(p1, p2);
      case symbol(ARCTANH):
        return darctanh(p1, p2);
      case symbol(ABS):
        return dabs(p1, p2);
      case symbol(SGN):
        return dsgn(p1, p2);
      case symbol(HERMITE):
        return dhermite(p1, p2);
      case symbol(ERF):
        return derf(p1, p2);
      case symbol(ERFC):
        return derfc(p1, p2);
      case symbol(BESSELJ):
        return dbesselj(p1, p2);
      case symbol(BESSELY):
        return dbessely(p1, p2);
      default:
    }
    if (car(p1) === symbol(INTEGRAL) && caddr(p1) === p2) {
      return derivative_of_integral(p1);
    }
    return dfunction(p1, p2);
  }
  function dsum(p1, p2) {
    const toAdd = iscons(p1) ? p1.tail().map((el) => derivative(el, p2)) : [];
    return add_all(toAdd);
  }
  function dproduct(p1, p2) {
    const n = length(p1) - 1;
    const toAdd = [];
    for (let i = 0; i < n; i++) {
      const arr = [];
      let p3 = cdr(p1);
      for (let j = 0; j < n; j++) {
        let temp = car(p3);
        if (i === j) {
          temp = derivative(temp, p2);
        }
        arr.push(temp);
        p3 = cdr(p3);
      }
      toAdd.push(multiply_all(arr));
    }
    return add_all(toAdd);
  }
  function dpower(p1, p2) {
    const arg1 = divide(caddr(p1), cadr(p1));
    const deriv_1 = derivative(cadr(p1), p2);
    const log_1 = logarithm(cadr(p1));
    const deriv_2 = derivative(caddr(p1), p2);
    return multiply(add(multiply(arg1, deriv_1), multiply(log_1, deriv_2)), p1);
  }
  function dlog(p1, p2) {
    const deriv = derivative(cadr(p1), p2);
    return divide(deriv, cadr(p1));
  }
  function dd(p1, p2) {
    const p3 = derivative(cadr(p1), p2);
    if (car(p3) === symbol(DERIVATIVE)) {
      if (lessp(caddr(p3), caddr(p1))) {
        return makeList(symbol(DERIVATIVE), makeList(symbol(DERIVATIVE), cadr(p3), caddr(p3)), caddr(p1));
      } else {
        return makeList(symbol(DERIVATIVE), makeList(symbol(DERIVATIVE), cadr(p3), caddr(p1)), caddr(p3));
      }
    }
    return derivative(p3, caddr(p1));
  }
  function dfunction(p1, p2) {
    const p3 = cdr(p1);
    if (p3 === symbol(NIL) || Find(p3, p2)) {
      return makeList(symbol(DERIVATIVE), p1, p2);
    }
    return Constants.zero;
  }
  function dsin(p1, p2) {
    const deriv = derivative(cadr(p1), p2);
    return multiply(deriv, cosine(cadr(p1)));
  }
  function dcos(p1, p2) {
    const deriv = derivative(cadr(p1), p2);
    return negate(multiply(deriv, sine(cadr(p1))));
  }
  function dtan(p1, p2) {
    const deriv = derivative(cadr(p1), p2);
    return multiply(deriv, power(cosine(cadr(p1)), integer(-2)));
  }
  function darcsin(p1, p2) {
    const deriv = derivative(cadr(p1), p2);
    return multiply(deriv, power(subtract(Constants.one, power(cadr(p1), integer(2))), rational(-1, 2)));
  }
  function darccos(p1, p2) {
    const deriv = derivative(cadr(p1), p2);
    return negate(multiply(deriv, power(subtract(Constants.one, power(cadr(p1), integer(2))), rational(-1, 2))));
  }
  function darctan(p1, p2) {
    const deriv = derivative(cadr(p1), p2);
    return simplify(multiply(deriv, inverse(add(Constants.one, power(cadr(p1), integer(2))))));
  }
  function dsinh(p1, p2) {
    const deriv = derivative(cadr(p1), p2);
    return multiply(deriv, ycosh(cadr(p1)));
  }
  function dcosh(p1, p2) {
    const deriv = derivative(cadr(p1), p2);
    return multiply(deriv, ysinh(cadr(p1)));
  }
  function dtanh(p1, p2) {
    const deriv = derivative(cadr(p1), p2);
    return multiply(deriv, power(ycosh(cadr(p1)), integer(-2)));
  }
  function darcsinh(p1, p2) {
    const deriv = derivative(cadr(p1), p2);
    return multiply(deriv, power(add(power(cadr(p1), integer(2)), Constants.one), rational(-1, 2)));
  }
  function darccosh(p1, p2) {
    const deriv = derivative(cadr(p1), p2);
    return multiply(deriv, power(add(power(cadr(p1), integer(2)), Constants.negOne), rational(-1, 2)));
  }
  function darctanh(p1, p2) {
    const deriv = derivative(cadr(p1), p2);
    return multiply(deriv, inverse(subtract(Constants.one, power(cadr(p1), integer(2)))));
  }
  function dabs(p1, p2) {
    const deriv = derivative(cadr(p1), p2);
    return multiply(deriv, sgn(cadr(p1)));
  }
  function dsgn(p1, p2) {
    const deriv = derivative(cadr(p1), p2);
    return multiply(multiply(deriv, dirac(cadr(p1))), integer(2));
  }
  function dhermite(p1, p2) {
    const deriv = derivative(cadr(p1), p2);
    return multiply(multiply(deriv, multiply(integer(2), caddr(p1))), hermite(cadr(p1), add(caddr(p1), Constants.negOne)));
  }
  function derf(p1, p2) {
    const deriv = derivative(cadr(p1), p2);
    return multiply(multiply(multiply(exponential(multiply(power(cadr(p1), integer(2)), Constants.negOne)), power(Constants.Pi(), rational(-1, 2))), integer(2)), deriv);
  }
  function derfc(p1, p2) {
    const deriv = derivative(cadr(p1), p2);
    return multiply(multiply(multiply(exponential(multiply(power(cadr(p1), integer(2)), Constants.negOne)), power(Constants.Pi(), rational(-1, 2))), integer(-2)), deriv);
  }
  function dbesselj(p1, p2) {
    if (isZeroAtomOrTensor(caddr(p1))) {
      return dbesselj0(p1, p2);
    }
    return dbesseljn(p1, p2);
  }
  function dbesselj0(p1, p2) {
    const deriv = derivative(cadr(p1), p2);
    return multiply(multiply(deriv, besselj(cadr(p1), Constants.one)), Constants.negOne);
  }
  function dbesseljn(p1, p2) {
    const deriv = derivative(cadr(p1), p2);
    return multiply(deriv, add(besselj(cadr(p1), add(caddr(p1), Constants.negOne)), multiply(divide(multiply(caddr(p1), Constants.negOne), cadr(p1)), besselj(cadr(p1), caddr(p1)))));
  }
  function dbessely(p1, p2) {
    if (isZeroAtomOrTensor(caddr(p1))) {
      return dbessely0(p1, p2);
    }
    return dbesselyn(p1, p2);
  }
  function dbessely0(p1, p2) {
    const deriv = derivative(cadr(p1), p2);
    return multiply(multiply(deriv, besselj(cadr(p1), Constants.one)), Constants.negOne);
  }
  function dbesselyn(p1, p2) {
    const deriv = derivative(cadr(p1), p2);
    return multiply(deriv, add(bessely(cadr(p1), add(caddr(p1), Constants.negOne)), multiply(divide(multiply(caddr(p1), Constants.negOne), cadr(p1)), bessely(cadr(p1), caddr(p1)))));
  }
  function derivative_of_integral(p1) {
    return cadr(p1);
  }

  // bazel-out/k8-fastbuild/bin/sources/userfunc.js
  function Eval_user_function(p1) {
    if (DEBUG) {
      console.log(`Eval_user_function evaluating: ${car(p1)}`);
    }
    if (car(p1) === symbol(SYMBOL_D) && get_binding(symbol(SYMBOL_D)) === symbol(SYMBOL_D)) {
      return Eval_derivative(p1);
    }
    const bodyAndFormalArguments = Eval(car(p1));
    if (isNumericAtom(bodyAndFormalArguments)) {
      stop("expected function invocation, found multiplication instead. Use '*' symbol explicitly for multiplication.");
    } else if (istensor(bodyAndFormalArguments)) {
      stop("expected function invocation, found tensor product instead. Use 'dot/inner' explicitly.");
    } else if (isstr(bodyAndFormalArguments)) {
      stop("expected function, found string instead.");
    }
    let F = car(cdr(bodyAndFormalArguments));
    let A = car(cdr(cdr(bodyAndFormalArguments)));
    let B = cdr(p1);
    if (car(bodyAndFormalArguments) !== symbol(FUNCTION) || bodyAndFormalArguments === car(p1)) {
      return makeList(bodyAndFormalArguments, ...evalList(B));
    }
    p1 = A;
    let p2 = B;
    const S = [];
    while (iscons(p1) && iscons(p2)) {
      S.push(car(p1));
      S.push(car(p2));
      p1 = cdr(p1);
      p2 = cdr(p2);
    }
    if (S.length) {
      F = rewrite_args(F, S);
    }
    return Eval(F);
  }
  function rewrite_args(p1, p2) {
    if (istensor(p1)) {
      return rewrite_args_tensor(p1, p2);
    }
    if (iscons(p1)) {
      let result = [];
      if (car(p1) === p2[0]) {
        result.push(makeList(symbol(EVAL), p2[1]));
      } else {
        result.push(car(p1));
      }
      p1 = cdr(p1);
      while (iscons(p1)) {
        result.push(rewrite_args(car(p1), p2));
        p1 = cdr(p1);
      }
      return makeList(...result);
    }
    if (!issymbol(p1)) {
      return p1;
    }
    for (let i = 0; i < p2.length; i += 2) {
      if (p1 === p2[i]) {
        return p2[i + 1];
      }
    }
    let p3 = get_binding(p1);
    if (p1 !== p3) {
      const n = rewrite_args(p3, p2);
      if (n === p3) {
        return p1;
      }
    }
    return p3;
  }
  function rewrite_args_tensor(p1, p2) {
    p1 = copy_tensor(p1);
    p1.tensor.elem = p1.tensor.elem.map((el) => rewrite_args(el, p2));
    check_tensor_dimensions(p1);
    return p1;
  }

  // bazel-out/k8-fastbuild/bin/sources/eval.js
  function evaluate_integer(p) {
    return nativeInt(Eval(p));
  }
  function Eval(p1) {
    let willEvaluateAsFloats;
    check_esc_flag();
    if (p1 == null) {
      breakpoint;
    }
    if (!defs.evaluatingAsFloats && isfloating(p1)) {
      willEvaluateAsFloats = true;
      defs.evaluatingAsFloats = true;
    }
    try {
      switch (p1.k) {
        case CONS:
          return Eval_cons(p1);
        case NUM:
          return defs.evaluatingAsFloats ? double(convert_rational_to_double(p1)) : p1;
        case DOUBLE:
        case STR:
          return p1;
        case TENSOR:
          return Eval_tensor(p1);
        case SYM:
          return Eval_sym(p1);
        default:
          stop("atom?");
      }
    } finally {
      if (willEvaluateAsFloats) {
        defs.evaluatingAsFloats = false;
      }
    }
  }
  function Eval_sym(p1) {
    if (iskeyword(p1)) {
      return Eval(makeList(p1, symbol(LAST)));
    } else if (p1 === symbol(PI) && defs.evaluatingAsFloats) {
      return Constants.piAsDouble;
    }
    let p2 = get_binding(p1);
    if (DEBUG) {
      console.log(`looked up: ${p1} which contains: ${p2}`);
    }
    if (p1 !== p2) {
      const positionIfSymbolAlreadyBeingEvaluated = defs.chainOfUserSymbolsNotFunctionsBeingEvaluated.indexOf(p1);
      if (positionIfSymbolAlreadyBeingEvaluated !== -1) {
        let cycleString = "";
        for (let i = positionIfSymbolAlreadyBeingEvaluated; i < defs.chainOfUserSymbolsNotFunctionsBeingEvaluated.length; i++) {
          cycleString += defs.chainOfUserSymbolsNotFunctionsBeingEvaluated[i].printname + " -> ";
        }
        cycleString += p1.printname;
        stop("recursive evaluation of symbols: " + cycleString);
        return;
      }
      defs.chainOfUserSymbolsNotFunctionsBeingEvaluated.push(p1);
      p2 = Eval(p2);
      defs.chainOfUserSymbolsNotFunctionsBeingEvaluated.pop();
    }
    return p2;
  }
  function Eval_cons(p1) {
    const cons_head = car(p1);
    if (car(cons_head) === symbol(EVAL)) {
      return Eval_user_function(p1);
    }
    if (!issymbol(cons_head)) {
      stop("cons?");
    }
    if (cons_head.keyword) {
      return cons_head.keyword(p1);
    }
    return Eval_user_function(p1);
  }
  function Eval_binding(p1) {
    return get_binding(cadr(p1));
  }
  function Eval_check(p1) {
    const checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(cadr(p1));
    if (checkResult == null) {
      return p1;
    } else {
      return integer(Number(checkResult));
    }
  }
  function Eval_det(p1) {
    const arg2 = Eval(cadr(p1));
    return det(arg2);
  }
  function Eval_dim(p1) {
    const p2 = Eval(cadr(p1));
    const n = iscons(cddr(p1)) ? evaluate_integer(caddr(p1)) : 1;
    if (!istensor(p2)) {
      return Constants.one;
    } else if (n < 1 || n > p2.tensor.ndim) {
      return p1;
    } else {
      return integer(p2.tensor.dim[n - 1]);
    }
  }
  function Eval_divisors(p1) {
    return divisors(Eval(cadr(p1)));
  }
  function Eval_do(p1) {
    let result = car(p1);
    p1 = cdr(p1);
    while (iscons(p1)) {
      result = Eval(car(p1));
      p1 = cdr(p1);
    }
    return result;
  }
  function Eval_Eval(p1) {
    let tmp = Eval(cadr(p1));
    p1 = cddr(p1);
    while (iscons(p1)) {
      tmp = subst(tmp, Eval(car(p1)), Eval(cadr(p1)));
      p1 = cddr(p1);
    }
    return Eval(tmp);
  }
  function Eval_exp(p1) {
    return exponential(Eval(cadr(p1)));
  }
  function Eval_factorial(p1) {
    return factorial(Eval(cadr(p1)));
  }
  function Eval_factorpoly(p1) {
    p1 = cdr(p1);
    const arg1 = Eval(car(p1));
    p1 = cdr(p1);
    const arg2 = Eval(car(p1));
    let temp = factorpoly(arg1, arg2);
    if (iscons(p1)) {
      temp = p1.tail().reduce((a, b) => factorpoly(a, Eval(b)), temp);
    }
    return temp;
  }
  function Eval_hermite(p1) {
    const arg2 = Eval(caddr(p1));
    const arg1 = Eval(cadr(p1));
    return hermite(arg1, arg2);
  }
  function Eval_hilbert(p1) {
    return hilbert(Eval(cadr(p1)));
  }
  function Eval_index(p1) {
    const orig = p1;
    p1 = cdr(p1);
    const theTensor = Eval(car(p1));
    if (isNumericAtom(theTensor)) {
      stop("trying to access a scalar as a tensor");
    }
    if (!istensor(theTensor)) {
      return orig;
    }
    const stack = [];
    p1 = cdr(p1);
    while (iscons(p1)) {
      stack.push(Eval(car(p1)));
      if (!isintegerorintegerfloat(stack[stack.length - 1])) {
        return orig;
      }
      p1 = cdr(p1);
    }
    return index_function(theTensor, stack);
  }
  function Eval_inv(p1) {
    const arg2 = Eval(cadr(p1));
    return inv(arg2);
  }
  function Eval_invg(p1) {
    const arg2 = Eval(cadr(p1));
    return invg(arg2);
  }
  function Eval_isinteger(p1) {
    p1 = Eval(cadr(p1));
    if (isrational(p1)) {
      return isinteger(p1) ? Constants.one : Constants.zero;
    }
    if (isdouble(p1)) {
      const n = Math.floor(p1.d);
      return n === p1.d ? Constants.one : Constants.zero;
    }
    return makeList(symbol(ISINTEGER), p1);
  }
  function Eval_number(p1) {
    p1 = Eval(cadr(p1));
    if (p1.k === NUM || p1.k === DOUBLE) {
      return Constants.one;
    } else {
      return Constants.zero;
    }
  }
  function Eval_operator(p1) {
    return makeList(symbol(OPERATOR), ...evalList(cdr(p1)));
  }
  function Eval_quote(p1) {
    return cadr(p1);
  }
  function Eval_rank(p1) {
    p1 = Eval(cadr(p1));
    if (istensor(p1)) {
      return integer(p1.tensor.ndim);
    } else {
      return Constants.zero;
    }
  }
  function Eval_setq(p1) {
    if (caadr(p1) === symbol(INDEX)) {
      return setq_indexed(p1);
    }
    if (iscons(cadr(p1))) {
      return define_user_function(p1);
    }
    if (!issymbol(cadr(p1))) {
      stop("symbol assignment: error in symbol");
    }
    const p2 = Eval(caddr(p1));
    set_binding(cadr(p1), p2);
    return symbol(NIL);
  }
  function setq_indexed(p1) {
    const p4 = cadadr(p1);
    console.log(`p4: ${p4}`);
    if (!issymbol(p4)) {
      stop("indexed assignment: expected a symbol name");
    }
    const lvalue = Eval(caddr(p1));
    let args = [];
    let p2 = cdadr(p1);
    if (iscons(p2)) {
      args = [...p2].map(Eval);
    }
    const p3 = set_component(lvalue, ...args);
    set_binding(p4, p3);
    return symbol(NIL);
  }
  function Eval_sqrt(p1) {
    const base = Eval(cadr(p1));
    return power(base, rational(1, 2));
  }
  function Eval_stop() {
    stop("user stop");
  }
  function Eval_subst(p1) {
    const newExpr = Eval(cadr(p1));
    const oldExpr = Eval(caddr(p1));
    const expr = Eval(cadddr(p1));
    return Eval(subst(expr, oldExpr, newExpr));
  }
  function Eval_unit(p1) {
    const n = evaluate_integer(cadr(p1));
    if (isNaN(n)) {
      return p1;
    }
    if (n < 1) {
      return p1;
    }
    p1 = alloc_tensor(n * n);
    p1.tensor.ndim = 2;
    p1.tensor.dim[0] = n;
    p1.tensor.dim[1] = n;
    for (let i = 0; i < n; i++) {
      p1.tensor.elem[n * i + i] = Constants.one;
    }
    check_tensor_dimensions(p1);
    return p1;
  }
  function Eval_predicate(p1) {
    if (car(p1) === symbol(SETQ)) {
      p1 = makeList(symbol(TESTEQ), cadr(p1), caddr(p1));
    }
    return Eval(p1);
  }
  function* evalList(p1) {
    if (iscons(p1)) {
      for (const el of p1) {
        yield Eval(el);
      }
    }
  }

  // bazel-out/k8-fastbuild/bin/sources/add.js
  var flag = 0;
  function Eval_add(p1) {
    const terms = [];
    p1 = cdr(p1);
    for (const t of p1) {
      const p2 = Eval(t);
      push_terms(terms, p2);
    }
    return add_terms(terms);
  }
  function add_terms(terms) {
    if (DEBUG) {
      for (const term of terms) {
        console.log(print_list(term));
      }
    }
    for (let i = 0; i < 10; i++) {
      if (terms.length < 2) {
        break;
      }
      flag = 0;
      terms.sort(cmp_terms);
      if (flag === 0) {
        break;
      }
      combine_terms(terms);
    }
    switch (terms.length) {
      case 0:
        return Constants.Zero();
      case 1:
        return terms[0];
      default:
        terms.unshift(symbol(ADD));
        return makeList(...terms);
    }
  }
  var cmp_terms_count = 0;
  function cmp_terms(p1, p2) {
    cmp_terms_count++;
    if (isNumericAtom(p1) && isNumericAtom(p2)) {
      flag = 1;
      return 0;
    }
    if (istensor(p1) && istensor(p2)) {
      if (p1.tensor.ndim < p2.tensor.ndim) {
        return -1;
      }
      if (p1.tensor.ndim > p2.tensor.ndim) {
        return 1;
      }
      for (let i = 0; i < p1.tensor.ndim; i++) {
        if (p1.tensor.dim[i] < p2.tensor.dim[i]) {
          return -1;
        }
        if (p1.tensor.dim[i] > p2.tensor.dim[i]) {
          return 1;
        }
      }
      flag = 1;
      return 0;
    }
    if (ismultiply(p1)) {
      p1 = cdr(p1);
      if (isNumericAtom(car(p1))) {
        p1 = cdr(p1);
        if (cdr(p1) === symbol(NIL)) {
          p1 = car(p1);
        }
      }
    }
    if (ismultiply(p2)) {
      p2 = cdr(p2);
      if (isNumericAtom(car(p2))) {
        p2 = cdr(p2);
        if (cdr(p2) === symbol(NIL)) {
          p2 = car(p2);
        }
      }
    }
    const t = cmp_expr(p1, p2);
    if (t === 0) {
      flag = 1;
    }
    return t;
  }
  function combine_terms(terms) {
    let i = 0;
    while (i < terms.length - 1) {
      check_esc_flag();
      let p1, p2;
      let p3 = terms[i];
      let p4 = terms[i + 1];
      if (istensor(p3) && istensor(p4)) {
        p1 = tensor_plus_tensor(p3, p4);
        if (p1 !== symbol(NIL)) {
          terms.splice(i, 2, p1);
          i--;
        }
        i++;
        continue;
      }
      if (istensor(p3) || istensor(p4)) {
        i++;
        continue;
      }
      if (isNumericAtom(p3) && isNumericAtom(p4)) {
        p1 = add_numbers(p3, p4);
        if (isZeroAtomOrTensor(p1)) {
          terms.splice(i, 2);
        } else {
          terms.splice(i, 2, p1);
        }
        i--;
        i++;
        continue;
      }
      if (isNumericAtom(p3) || isNumericAtom(p4)) {
        i++;
        continue;
      }
      p1 = Constants.One();
      p2 = Constants.One();
      let t = 0;
      if (ismultiply(p3)) {
        p3 = cdr(p3);
        t = 1;
        if (isNumericAtom(car(p3))) {
          p1 = car(p3);
          p3 = cdr(p3);
          if (cdr(p3) === symbol(NIL)) {
            p3 = car(p3);
            t = 0;
          }
        }
      }
      if (ismultiply(p4)) {
        p4 = cdr(p4);
        if (isNumericAtom(car(p4))) {
          p2 = car(p4);
          p4 = cdr(p4);
          if (cdr(p4) === symbol(NIL)) {
            p4 = car(p4);
          }
        }
      }
      if (!equal(p3, p4)) {
        i++;
        continue;
      }
      p1 = add_numbers(p1, p2);
      if (isZeroAtomOrTensor(p1)) {
        terms.splice(i, 2);
        i--;
        i++;
        continue;
      }
      const arg2 = t ? new Cons(symbol(MULTIPLY), p3) : p3;
      terms.splice(i, 2, multiply(p1, arg2));
      i--;
      i++;
    }
  }
  function push_terms(array, p) {
    if (isadd(p)) {
      array.push(...p.tail());
    } else if (!isZeroAtom(p)) {
      array.push(p);
    }
  }
  function add(p1, p2) {
    const terms = [];
    push_terms(terms, p1);
    push_terms(terms, p2);
    return add_terms(terms);
  }
  function add_all(terms) {
    const flattened = [];
    for (const t of terms) {
      push_terms(flattened, t);
    }
    return add_terms(flattened);
  }
  function subtract(p1, p2) {
    return add(p1, negate(p2));
  }

  // bazel-out/k8-fastbuild/bin/sources/abs.js
  var DEBUG_ABS = false;
  function Eval_abs(p1) {
    return abs(Eval(cadr(p1)));
  }
  function absValFloat(p1) {
    return zzfloat(Eval(absval(Eval(p1))));
  }
  function abs(p1) {
    const numer = numerator(p1);
    const absNumer = absval(numer);
    const denom = denominator(p1);
    const absDenom = absval(denom);
    const result = divide(absNumer, absDenom);
    if (DEBUG_ABS) {
      console.trace(">>>>  ABS of " + p1);
      console.log(`ABS numerator ${numer}`);
      console.log(`ABSVAL numerator: ${absNumer}`);
      console.log(`ABS denominator: ${denom}`);
      console.log(`ABSVAL denominator: ${absDenom}`);
      console.log(`ABSVAL divided: ${result}`);
      console.log("<<<<<<<  ABS");
    }
    return result;
  }
  function absval(p1) {
    const input = p1;
    if (DEBUG_ABS) {
      console.log(`ABS of ${p1}`);
    }
    if (isZeroAtomOrTensor(p1)) {
      if (DEBUG_ABS) {
        console.log(` abs: ${p1} just zero`);
        console.log(" --> ABS of " + input + " : " + Constants.zero);
      }
      return Constants.zero;
    }
    if (isnegativenumber(p1)) {
      if (DEBUG_ABS) {
        console.log(` abs: ${p1} just a negative`);
      }
      return negate(p1);
    }
    if (ispositivenumber(p1)) {
      if (DEBUG_ABS) {
        console.log(` abs: ${p1} just a positive`);
        console.log(` --> ABS of ${input} : ${p1}`);
      }
      return p1;
    }
    if (p1 === symbol(PI)) {
      if (DEBUG_ABS) {
        console.log(` abs: ${p1} of PI`);
        console.log(` --> ABS of ${input} : ${p1}`);
      }
      return p1;
    }
    if (isadd(p1) && (findPossibleClockForm(p1, p1) || findPossibleExponentialForm(p1) || Find(p1, Constants.imaginaryunit))) {
      if (DEBUG_ABS) {
        console.log(` abs: ${p1} is a sum`);
        console.log("abs of a sum");
      }
      p1 = rect(p1);
      const result = simplify_trig(power(add(power(real(p1), integer(2)), power(imag(p1), integer(2))), rational(1, 2)));
      if (DEBUG_ABS) {
        console.log(` --> ABS of ${input} : ${result}`);
      }
      return result;
    }
    if (ispower(p1) && equaln(cadr(p1), -1)) {
      const one = Constants.One();
      if (DEBUG_ABS) {
        console.log(` abs: ${p1} is -1 to any power`);
        const msg = defs.evaluatingAsFloats ? " abs: numeric, so result is 1.0" : " abs: symbolic, so result is 1";
        console.log(msg);
        console.log(` --> ABS of ${input} : ${one}`);
      }
      return one;
    }
    if (ispower(p1) && ispositivenumber(caddr(p1))) {
      const result = power(abs(cadr(p1)), caddr(p1));
      if (DEBUG_ABS) {
        console.log(` abs: ${p1} is something to the power of a positive number`);
        console.log(` --> ABS of ${input} : ${result}`);
      }
      return result;
    }
    if (ispower(p1) && cadr(p1) === symbol(E)) {
      const result = exponential(real(caddr(p1)));
      if (DEBUG_ABS) {
        console.log(` abs: ${p1} is an exponential`);
        console.log(` --> ABS of ${input} : ${result}`);
      }
      return result;
    }
    if (ismultiply(p1)) {
      const result = p1.tail().map(absval).reduce(multiply);
      if (DEBUG_ABS) {
        console.log(` abs: ${p1} is a product`);
        console.log(` --> ABS of ${input} : ${result}`);
      }
      return result;
    }
    if (car(p1) === symbol(ABS)) {
      const absOfAbs = makeList(symbol(ABS), cadr(p1));
      if (DEBUG_ABS) {
        console.log(` abs: ${p1} is abs of a abs`);
        console.log(` --> ABS of ${input} : ${absOfAbs}`);
      }
      return absOfAbs;
    }
    if (istensor(p1)) {
      return absval_tensor(p1);
    }
    if (isnegativeterm(p1) || isadd(p1) && isnegativeterm(cadr(p1))) {
      p1 = negate(p1);
    }
    const l = makeList(symbol(ABS), p1);
    if (DEBUG_ABS) {
      console.log(` abs: ${p1} is nothing decomposable`);
      console.log(` --> ABS of ${input} : ${l}`);
    }
    return l;
  }
  function absval_tensor(p1) {
    if (p1.tensor.ndim !== 1) {
      stop("abs(tensor) with tensor rank > 1");
    }
    return Eval(simplify(power(inner(p1, conjugate(p1)), rational(1, 2))));
  }

  // bazel-out/k8-fastbuild/bin/sources/is.js
  var DEBUG_IS = false;
  function isZeroAtom(p) {
    switch (p.k) {
      case NUM:
        if (MZERO(p.q.a)) {
          return true;
        }
        break;
      case DOUBLE:
        if (p.d === 0) {
          return true;
        }
        break;
    }
    return false;
  }
  function isZeroTensor(p) {
    if (!istensor(p)) {
      return false;
    }
    return p.tensor.elem.every((el) => isZeroAtomOrTensor(el));
  }
  function isZeroAtomOrTensor(p) {
    return isZeroAtom(p) || isZeroTensor(p);
  }
  function isZeroLikeOrNonZeroLikeOrUndetermined(valueOrPredicate) {
    let evalledArgument = Eval_predicate(valueOrPredicate);
    if (isZeroAtomOrTensor(evalledArgument)) {
      return false;
    }
    if (isNumericAtomOrTensor(evalledArgument)) {
      return true;
    }
    evalledArgument = zzfloat(evalledArgument);
    if (isZeroAtomOrTensor(evalledArgument)) {
      return false;
    }
    if (isNumericAtomOrTensor(evalledArgument)) {
      return true;
    }
    if (Find(evalledArgument, Constants.imaginaryunit)) {
      evalledArgument = Eval_predicate(absValFloat(evalledArgument));
      if (isZeroAtomOrTensor(evalledArgument)) {
        return false;
      }
      if (isNumericAtomOrTensor(evalledArgument)) {
        return true;
      }
    }
    return null;
  }
  function isnegativenumber(p) {
    switch (p.k) {
      case NUM:
        if (MSIGN(p.q.a) === -1) {
          return true;
        }
        break;
      case DOUBLE:
        if (p.d < 0) {
          return true;
        }
        break;
    }
    return false;
  }
  function ispositivenumber(p) {
    switch (p.k) {
      case NUM:
        if (MSIGN(p.q.a) === 1) {
          return true;
        }
        break;
      case DOUBLE:
        if (p.d > 0) {
          return true;
        }
        break;
    }
    return false;
  }
  function isplustwo(p) {
    switch (p.k) {
      case NUM:
        if (MEQUAL(p.q.a, 2) && MEQUAL(p.q.b, 1)) {
          return true;
        }
        break;
      case DOUBLE:
        if (p.d === 2) {
          return true;
        }
        break;
    }
    return false;
  }
  function isplusone(p) {
    switch (p.k) {
      case NUM:
        if (MEQUAL(p.q.a, 1) && MEQUAL(p.q.b, 1)) {
          return true;
        }
        break;
      case DOUBLE:
        if (p.d === 1) {
          return true;
        }
        break;
    }
    return false;
  }
  function isminusone(p) {
    switch (p.k) {
      case NUM:
        if (MEQUAL(p.q.a, -1) && MEQUAL(p.q.b, 1)) {
          return true;
        }
        break;
      case DOUBLE:
        if (p.d === -1) {
          return true;
        }
        break;
    }
    return false;
  }
  function isone(p) {
    return isplusone(p) || isminusone(p);
  }
  function isinteger(p) {
    return p.k === NUM && MEQUAL(p.q.b, 1);
  }
  function isintegerorintegerfloat(p) {
    if (p.k === DOUBLE) {
      if (p.d === Math.round(p.d)) {
        return true;
      }
      return false;
    }
    return isinteger(p);
  }
  function isnonnegativeinteger(p) {
    return isrational(p) && MEQUAL(p.q.b, 1) && MSIGN(p.q.a) === 1;
  }
  function isposint(p) {
    return isinteger(p) && MSIGN(p.q.a) === 1;
  }
  function isunivarpolyfactoredorexpandedform(p, x) {
    if (x == null) {
      x = guess(p);
    }
    if (ispolyfactoredorexpandedform(p, x) && countTrue(Find(p, symbol(SYMBOL_X)), Find(p, symbol(SYMBOL_Y)), Find(p, symbol(SYMBOL_Z))) === 1) {
      return x;
    } else {
      return false;
    }
  }
  function countTrue(...a) {
    return a.reduce((count2, x) => count2 + Number(x), 0);
  }
  function ispolyfactoredorexpandedform(p, x) {
    return ispolyfactoredorexpandedform_factor(p, x);
  }
  function ispolyfactoredorexpandedform_factor(p, x) {
    if (ismultiply(p)) {
      return p.tail().every((el) => {
        const bool = ispolyfactoredorexpandedform_power(el, x);
        if (DEBUG) {
          console.log(`ispolyfactoredorexpandedform_factor testing ${el}`);
          if (bool) {
            console.log(`... tested negative:${el}`);
          }
        }
        return bool;
      });
    } else {
      return ispolyfactoredorexpandedform_power(p, x);
    }
  }
  function ispolyfactoredorexpandedform_power(p, x) {
    if (ispower(p)) {
      if (DEBUG) {
        console.log("ispolyfactoredorexpandedform_power (isposint(caddr(p)) " + (isposint(caddr(p)), DEBUG ? console.log("ispolyfactoredorexpandedform_power ispolyexpandedform_expr(cadr(p), x)) " + ispolyexpandedform_expr(cadr(p), x)) : void 0));
      }
      return isposint(caddr(p)) && ispolyexpandedform_expr(cadr(p), x);
    } else {
      if (DEBUG) {
        console.log(`ispolyfactoredorexpandedform_power not a power, testing if this is exp form: ${p}`);
      }
      return ispolyexpandedform_expr(p, x);
    }
  }
  function ispolyexpandedform(p, x) {
    if (Find(p, x)) {
      return ispolyexpandedform_expr(p, x);
    }
    return false;
  }
  function ispolyexpandedform_expr(p, x) {
    if (isadd(p)) {
      return p.tail().every((el) => ispolyexpandedform_term(el, x));
    } else {
      return ispolyexpandedform_term(p, x);
    }
  }
  function ispolyexpandedform_term(p, x) {
    if (ismultiply(p)) {
      return p.tail().every((el) => ispolyexpandedform_factor(el, x));
    } else {
      return ispolyexpandedform_factor(p, x);
    }
  }
  function ispolyexpandedform_factor(p, x) {
    if (equal(p, x)) {
      return true;
    }
    if (ispower(p) && equal(cadr(p), x)) {
      return isposint(caddr(p));
    }
    return !Find(p, x);
  }
  function isnegativeterm(p) {
    return isnegativenumber(p) || ismultiply(p) && isnegativenumber(cadr(p));
  }
  function hasNegativeRationalExponent(p) {
    if (ispower(p) && isrational(car(cdr(cdr(p)))) && isnegativenumber(car(cdr(p)))) {
      if (DEBUG_IS) {
        console.log(`hasNegativeRationalExponent: ${p} has imaginary component`);
      }
      return true;
    } else {
      if (DEBUG_IS) {
        console.log(`hasNegativeRationalExponent: ${p} has NO imaginary component`);
      }
      return false;
    }
  }
  function isimaginarynumberdouble(p) {
    return ismultiply(p) && length(p) === 3 && isdouble(cadr(p)) && hasNegativeRationalExponent(caddr(p)) || equal(p, Constants.imaginaryunit);
  }
  function isimaginarynumber(p) {
    if (ismultiply(p) && length(p) === 3 && isNumericAtom(cadr(p)) && equal(caddr(p), Constants.imaginaryunit) || equal(p, Constants.imaginaryunit) || hasNegativeRationalExponent(caddr(p))) {
      if (DEBUG_IS) {
        console.log(`isimaginarynumber: ${p} is imaginary number`);
      }
      return true;
    } else {
      if (DEBUG_IS) {
        console.log(`isimaginarynumber: ${p} isn't an imaginary number`);
      }
      return false;
    }
  }
  function iscomplexnumberdouble(p) {
    return isadd(p) && length(p) === 3 && isdouble(cadr(p)) && isimaginarynumberdouble(caddr(p)) || isimaginarynumberdouble(p);
  }
  function iscomplexnumber(p) {
    if (DEBUG_IS) {
      breakpoint;
    }
    if (isadd(p) && length(p) === 3 && isNumericAtom(cadr(p)) && isimaginarynumber(caddr(p)) || isimaginarynumber(p)) {
      if (DEBUG) {
        console.log(`iscomplexnumber: ${p} is imaginary number`);
      }
      return true;
    } else {
      if (DEBUG) {
        console.log(`iscomplexnumber: ${p} is imaginary number`);
      }
      return false;
    }
  }
  function iseveninteger(p) {
    return isinteger(p) && p.q.a.isEven();
  }
  function isnegative(p) {
    return isadd(p) && isnegativeterm(cadr(p)) || isnegativeterm(p);
  }
  function issymbolic(p) {
    if (issymbol(p)) {
      return true;
    }
    if (iscons(p)) {
      return [...p].some(issymbolic);
    }
    return false;
  }
  function isintegerfactor(p) {
    return isinteger(p) || ispower(p) && isinteger(cadr(p)) && isinteger(caddr(p));
  }
  function isNumberOneOverSomething(p) {
    return isfraction(p) && MEQUAL(p.q.a.abs(), 1);
  }
  function isoneover(p) {
    return ispower(p) && isminusone(caddr(p));
  }
  function isfraction(p) {
    return p.k === NUM && !MEQUAL(p.q.b, 1);
  }
  function equaln(p, n) {
    switch (p.k) {
      case NUM:
        return MEQUAL(p.q.a, n) && MEQUAL(p.q.b, 1);
      case DOUBLE:
        return p.d === n;
      default:
        return false;
    }
  }
  function equalq(p, a, b) {
    switch (p.k) {
      case NUM:
        return MEQUAL(p.q.a, a) && MEQUAL(p.q.b, b);
      case DOUBLE:
        return p.d === a / b;
      default:
        return false;
    }
  }
  function isoneovertwo(p) {
    return equalq(p, 1, 2);
  }
  function isminusoneovertwo(p) {
    return equalq(p, -1, 2);
  }
  function isoneoversqrttwo(p) {
    return ispower(p) && equaln(cadr(p), 2) && equalq(caddr(p), -1, 2);
  }
  function isminusoneoversqrttwo(p) {
    return ismultiply(p) && equaln(cadr(p), -1) && isoneoversqrttwo(caddr(p)) && length(p) === 3;
  }
  function isSqrtThreeOverTwo(p) {
    return ismultiply(p) && isoneovertwo(cadr(p)) && isSqrtThree(caddr(p)) && length(p) === 3;
  }
  function isMinusSqrtThreeOverTwo(p) {
    return ismultiply(p) && isminusoneovertwo(cadr(p)) && isSqrtThree(caddr(p)) && length(p) === 3;
  }
  function isSqrtThree(p) {
    return ispower(p) && equaln(cadr(p), 3) && isoneovertwo(caddr(p));
  }
  function isfloating(p) {
    if (p.k === DOUBLE || p === symbol(FLOATF)) {
      return true;
    }
    if (iscons(p)) {
      return [...p].some(isfloating);
    }
    return false;
  }
  function isimaginaryunit(p) {
    return equal(p, Constants.imaginaryunit);
  }
  function isquarterturn(p) {
    let minussign = 0;
    if (!ismultiply(p)) {
      return 0;
    }
    if (equal(cadr(p), Constants.imaginaryunit)) {
      if (caddr(p) !== symbol(PI)) {
        return 0;
      }
      if (length(p) !== 3) {
        return 0;
      }
      return 2;
    }
    if (!isNumericAtom(cadr(p))) {
      return 0;
    }
    if (!equal(caddr(p), Constants.imaginaryunit)) {
      return 0;
    }
    if (cadddr(p) !== symbol(PI)) {
      return 0;
    }
    if (length(p) !== 4) {
      return 0;
    }
    let n = nativeInt(multiply(cadr(p), integer(2)));
    if (isNaN(n)) {
      return 0;
    }
    if (n < 1) {
      minussign = 1;
      n = -n;
    }
    switch (n % 4) {
      case 0:
        n = 1;
        break;
      case 1:
        n = minussign ? 4 : 3;
        break;
      case 2:
        n = 2;
        break;
      case 3:
        n = minussign ? 3 : 4;
    }
    return n;
  }
  function isnpi(p) {
    let n = 0;
    if (p === symbol(PI)) {
      return 2;
    }
    if (!ismultiply(p) || !isNumericAtom(cadr(p)) || caddr(p) !== symbol(PI) || length(p) !== 3) {
      return 0;
    }
    n = nativeInt(multiply(cadr(p), integer(2)));
    if (isNaN(n)) {
      return 0;
    }
    if (n < 0) {
      n = 4 - -n % 4;
    } else {
      n = 1 + (n - 1) % 4;
    }
    return n;
  }

  // bazel-out/k8-fastbuild/bin/runtime/otherCFunctions.js
  function strcmp(str1, str2) {
    if (str1 === str2) {
      return 0;
    } else if (str1 > str2) {
      return 1;
    } else {
      return -1;
    }
  }
  function doubleToReasonableString(d) {
    let stringRepresentation;
    if (defs.codeGen || defs.fullDoubleOutput) {
      return "" + d;
    }
    if (isZeroAtomOrTensor(get_binding(symbol(FORCE_FIXED_PRINTOUT)))) {
      stringRepresentation = "" + d;
      if (defs.printMode === PRINTMODE_LATEX) {
        if (/\d*\.\d*e.*/gm.test(stringRepresentation)) {
          stringRepresentation = stringRepresentation.replace(/e(.*)/gm, "\\mathrm{e}{$1}");
        } else {
          stringRepresentation = stringRepresentation.replace(/(\d+)e(.*)/gm, "$1.0\\mathrm{e}{$2}");
        }
      } else {
        if (/\d*\.\d*e.*/gm.test(stringRepresentation)) {
          stringRepresentation = stringRepresentation.replace(/e(.*)/gm, "*10^($1)");
        } else {
          stringRepresentation = stringRepresentation.replace(/(\d+)e(.*)/gm, "$1.0*10^($2)");
        }
      }
    } else {
      const maxFixedPrintoutDigits = nativeInt(get_binding(symbol(MAX_FIXED_PRINTOUT_DIGITS)));
      stringRepresentation = "" + d.toFixed(maxFixedPrintoutDigits);
      stringRepresentation = stringRepresentation.replace(/(\.\d*?[1-9])0+$/gm, "$1");
      stringRepresentation = stringRepresentation.replace(/\.0+$/gm, "");
      if (stringRepresentation.indexOf(".") === -1) {
        stringRepresentation += ".0";
      }
      if (parseFloat(stringRepresentation) !== d) {
        stringRepresentation = d.toFixed(maxFixedPrintoutDigits) + "...";
      }
    }
    return stringRepresentation;
  }
  function clear_term() {
  }
  function isspace(s) {
    if (s == null) {
      return false;
    }
    return s === " " || s === "	" || s === "\n" || s === "\v" || s === "\f" || s === "\r";
  }
  function isdigit(str) {
    if (str == null) {
      return false;
    }
    return /^\d+$/.test(str);
  }
  function isalpha(str) {
    if (str == null) {
      return false;
    }
    return str.search(/[^A-Za-z]/) === -1;
  }
  function isalphaOrUnderscore(str) {
    if (str == null) {
      return false;
    }
    return str.search(/[^A-Za-z_]/) === -1;
  }
  function isalnumorunderscore(str) {
    if (str == null) {
      return false;
    }
    return isalphaOrUnderscore(str) || isdigit(str);
  }
  function append(p1, p2) {
    const arr = [];
    if (iscons(p1)) {
      arr.push(...p1);
    }
    if (iscons(p2)) {
      arr.push(...p2);
    }
    return makeList(...arr);
  }
  function jn(n, x) {
    stop("Not implemented");
  }
  function yn(n, x) {
    stop("Not implemented");
  }

  // bazel-out/k8-fastbuild/bin/sources/qadd.js
  function qadd(qadd_frac1, qadd_frac2) {
    const qadd_ab = mmul(qadd_frac1.q.a, qadd_frac2.q.b);
    const qadd_ba = mmul(qadd_frac1.q.b, qadd_frac2.q.a);
    const qadd_numerator = madd(qadd_ab, qadd_ba);
    if (MZERO(qadd_numerator)) {
      return Constants.zero;
    }
    const qadd_denominator = mmul(qadd_frac1.q.b, qadd_frac2.q.b);
    let gcdBetweenNumeratorAndDenominator = mgcd(qadd_numerator, qadd_denominator);
    gcdBetweenNumeratorAndDenominator = makeSignSameAs(gcdBetweenNumeratorAndDenominator, qadd_denominator);
    const a = mdiv(qadd_numerator, gcdBetweenNumeratorAndDenominator);
    const b = mdiv(qadd_denominator, gcdBetweenNumeratorAndDenominator);
    const resultSum = new Num(a, b);
    return resultSum;
  }

  // bazel-out/k8-fastbuild/bin/sources/qdiv.js
  function qdiv(p1, p2) {
    if (MZERO(p2.q.a)) {
      stop("divide by zero");
    }
    if (MZERO(p1.q.a)) {
      return Constants.zero;
    }
    const aa = mmul(p1.q.a, p2.q.b);
    const bb = mmul(p1.q.b, p2.q.a);
    let c = mgcd(aa, bb);
    c = makeSignSameAs(c, bb);
    return new Num(mdiv(aa, c), mdiv(bb, c));
  }

  // bazel-out/k8-fastbuild/bin/sources/qmul.js
  function qmul(p1, p2) {
    if (MZERO(p1.q.a) || MZERO(p2.q.a)) {
      return Constants.zero;
    }
    const aa = mmul(p1.q.a, p2.q.a);
    const bb = mmul(p1.q.b, p2.q.b);
    let c = mgcd(aa, bb);
    c = makeSignSameAs(c, bb);
    return new Num(mdiv(aa, c), mdiv(bb, c));
  }

  // bazel-out/k8-fastbuild/bin/sources/bignum.js
  function mint(a) {
    return (0, import_big_integer6.default)(a);
  }
  function isSmall(a) {
    return a.geq(Number.MIN_SAFE_INTEGER) && a.leq(Number.MAX_SAFE_INTEGER);
  }
  function setSignTo(a, b) {
    if (a.isPositive()) {
      if (b < 0) {
        return a.multiply((0, import_big_integer6.default)(-1));
      }
    } else {
      if (b > 0) {
        return a.multiply((0, import_big_integer6.default)(-1));
      }
    }
    return a;
  }
  function makeSignSameAs(a, b) {
    if (a.isPositive()) {
      if (b.isNegative()) {
        return a.multiply((0, import_big_integer6.default)(-1));
      }
    } else {
      if (b.isPositive()) {
        return a.multiply((0, import_big_integer6.default)(-1));
      }
    }
    return a;
  }
  function makePositive(a) {
    if (a.isNegative()) {
      return a.multiply((0, import_big_integer6.default)(-1));
    }
    return a;
  }
  function add_numbers(p1, p2) {
    if (isrational(p1) && isrational(p2)) {
      return qadd(p1, p2);
    }
    const a = isdouble(p1) ? p1.d : convert_rational_to_double(p1);
    const b = isdouble(p2) ? p2.d : convert_rational_to_double(p2);
    return double(a + b);
  }
  function multiply_numbers(p1, p2) {
    if (isrational(p1) && isrational(p2)) {
      return qmul(p1, p2);
    }
    const a = isdouble(p1) ? p1.d : convert_rational_to_double(p1);
    const b = isdouble(p2) ? p2.d : convert_rational_to_double(p2);
    return new Double(a * b);
  }
  function divide_numbers(p1, p2) {
    if (isrational(p1) && isrational(p2)) {
      return qdiv(p1, p2);
    }
    if (isZeroAtomOrTensor(p2)) {
      stop("divide by zero");
    }
    const a = isdouble(p1) ? p1.d : convert_rational_to_double(p1);
    const b = isdouble(p2) ? p2.d : convert_rational_to_double(p2);
    return new Double(a / b);
  }
  function invert_number(p1) {
    if (isZeroAtomOrTensor(p1)) {
      stop("divide by zero");
    }
    if (isdouble(p1)) {
      return new Double(1 / p1.d);
    }
    let a = (0, import_big_integer6.default)(p1.q.a);
    let b = (0, import_big_integer6.default)(p1.q.b);
    b = makeSignSameAs(b, a);
    a = setSignTo(a, 1);
    return new Num(b, a);
  }
  function compare_rationals(a, b) {
    const ab = mmul(a.q.a, b.q.b);
    const ba = mmul(a.q.b, b.q.a);
    return mcmp(ab, ba);
  }
  function compare_numbers(a, b) {
    if (isrational(a) && isrational(b)) {
      return compare_rationals(a, b);
    }
    const x = isdouble(a) ? a.d : convert_rational_to_double(a);
    const y = isdouble(b) ? b.d : convert_rational_to_double(b);
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  }
  function negate_number(p1) {
    if (isZeroAtomOrTensor(p1)) {
      return p1;
    }
    switch (p1.k) {
      case NUM:
        return new Num((0, import_big_integer6.default)(p1.q.a.multiply(import_big_integer6.default.minusOne)), (0, import_big_integer6.default)(p1.q.b));
      case DOUBLE:
        return new Double(-p1.d);
      default:
        stop("bug caught in mp_negate_number");
    }
  }
  function bignum_truncate(p1) {
    const a = mdiv(p1.q.a, p1.q.b);
    return new Num(a);
  }
  function mp_numerator(p1) {
    if (!isrational(p1)) {
      return Constants.one;
    }
    return new Num((0, import_big_integer6.default)(p1.q.a));
  }
  function mp_denominator(p1) {
    if (!isrational(p1)) {
      return Constants.one;
    }
    return new Num((0, import_big_integer6.default)(p1.q.b));
  }
  function bignum_power_number(base, expo) {
    let a = mpow(base.q.a, Math.abs(expo));
    let b = mpow(base.q.b, Math.abs(expo));
    if (expo < 0) {
      const t = a;
      a = b;
      b = t;
      a = makeSignSameAs(a, b);
      b = setSignTo(b, 1);
    }
    return new Num(a, b);
  }
  function convert_rational_to_double(p) {
    if (p.q == null) {
      breakpoint;
    }
    const quotientAndRemainder = p.q.a.divmod(p.q.b);
    const result = quotientAndRemainder.quotient.toJSNumber() + quotientAndRemainder.remainder.toJSNumber() / p.q.b.toJSNumber();
    return result;
  }
  function integer(n) {
    return new Num((0, import_big_integer6.default)(n));
  }
  function double(d) {
    return new Double(d);
  }
  function rational(a, b) {
    return new Num((0, import_big_integer6.default)(a), (0, import_big_integer6.default)(b));
  }
  function nativeInt(p1) {
    let n = NaN;
    switch (p1.k) {
      case NUM:
        if (isinteger(p1) && isSmall(p1.q.a)) {
          n = p1.q.a.toJSNumber();
        }
        break;
      case DOUBLE:
        if (DEBUG) {
          console.log("popping integer but double is found");
        }
        if (Math.floor(p1.d) === p1.d) {
          if (DEBUG) {
            console.log("...although it's an integer");
          }
          n = p1.d;
        }
        break;
    }
    return n;
  }
  function bignum_scan_integer(s) {
    let scounter = 0;
    const sign_ = s[scounter];
    if (sign_ === "+" || sign_ === "-") {
      scounter++;
    }
    const a = (0, import_big_integer6.default)(s.substring(scounter));
    let p1 = new Num(a);
    if (sign_ === "-") {
      p1 = negate(p1);
    }
    return p1;
  }
  function bignum_scan_float(s) {
    return double(parseFloat(s));
  }
  function print_number(p, signed) {
    let accumulator = "";
    let denominatorString = "";
    const buf = "";
    switch (p.k) {
      case NUM:
        var aAsString = p.q.a.toString();
        if (!signed) {
          if (aAsString[0] === "-") {
            aAsString = aAsString.substring(1);
          }
        }
        if (defs.printMode === PRINTMODE_LATEX && isfraction(p)) {
          aAsString = "\\frac{" + aAsString + "}{";
        }
        accumulator += aAsString;
        if (isfraction(p)) {
          if (defs.printMode !== PRINTMODE_LATEX) {
            accumulator += "/";
          }
          denominatorString = p.q.b.toString();
          if (defs.printMode === PRINTMODE_LATEX) {
            denominatorString += "}";
          }
          accumulator += denominatorString;
        }
        break;
      case DOUBLE:
        aAsString = doubleToReasonableString(p.d);
        if (!signed) {
          if (aAsString[0] === "-") {
            aAsString = aAsString.substring(1);
          }
        }
        accumulator += aAsString;
        break;
    }
    return accumulator;
  }
  function gcd_numbers(p1, p2) {
    const a = mgcd(p1.q.a, p2.q.a);
    const b = mgcd(p1.q.b, p2.q.b);
    return new Num(setSignTo(a, 1), b);
  }
  function nativeDouble(p1) {
    let d = 0;
    switch (p1.k) {
      case NUM:
        d = convert_rational_to_double(p1);
        break;
      case DOUBLE:
        ({ d } = p1);
        break;
      default:
        d = 0;
    }
    return d;
  }
  function bignum_float(n) {
    const d = convert_rational_to_double(n);
    return new Double(d);
  }
  function bignum_factorial(n) {
    return new Num(__factorial(n));
  }
  function __factorial(n) {
    let a;
    if (n === 0 || n === 1) {
      a = (0, import_big_integer6.default)(1);
      return a;
    }
    a = (0, import_big_integer6.default)(2);
    let b = (0, import_big_integer6.default)(0);
    if (3 <= n) {
      for (let i = 3; i <= n; i++) {
        b = (0, import_big_integer6.default)(i);
        a = mmul(a, b);
      }
    }
    return a;
  }

  // bazel-out/k8-fastbuild/bin/sources/bake.js
  function bake(p1) {
    return doexpand(_bake, p1);
  }
  function _bake(p1) {
    const s = ispolyexpandedform(p1, symbol(SYMBOL_S));
    const t = ispolyexpandedform(p1, symbol(SYMBOL_T));
    const x = ispolyexpandedform(p1, symbol(SYMBOL_X));
    const y = ispolyexpandedform(p1, symbol(SYMBOL_Y));
    const z = ispolyexpandedform(p1, symbol(SYMBOL_Z));
    let result;
    if (s && !t && !x && !y && !z) {
      result = bake_poly(p1, symbol(SYMBOL_S));
    } else if (!s && t && !x && !y && !z) {
      result = bake_poly(p1, symbol(SYMBOL_T));
    } else if (!s && !t && x && !y && !z) {
      result = bake_poly(p1, symbol(SYMBOL_X));
    } else if (!s && !t && !x && y && !z) {
      result = bake_poly(p1, symbol(SYMBOL_Y));
    } else if (!s && !t && !x && !y && z) {
      result = bake_poly(p1, symbol(SYMBOL_Z));
    } else if (iscons(p1) && car(p1) !== symbol(FOR)) {
      result = makeList(car(p1), ...p1.tail().map(bake));
    } else {
      result = p1;
    }
    return result;
  }
  function polyform(p1, p2) {
    if (ispolyexpandedform(p1, p2)) {
      return bake_poly(p1, p2);
    }
    if (iscons(p1)) {
      return makeList(car(p1), ...p1.tail().map((el) => polyform(el, p2)));
    }
    return p1;
  }
  function bake_poly(poly, x) {
    const k = coeff(poly, x);
    const result = [];
    for (let i = k.length - 1; i >= 0; i--) {
      const term = k[i];
      result.push(...bake_poly_term(i, term, x));
    }
    if (result.length > 1) {
      return new Cons(symbol(ADD), makeList(...result));
    }
    return result[0];
  }
  function bake_poly_term(k, coefficient, term) {
    if (isZeroAtomOrTensor(coefficient)) {
      return [];
    }
    if (k === 0) {
      if (isadd(coefficient)) {
        return coefficient.tail();
      }
      return [coefficient];
    }
    const result = [];
    if (ismultiply(coefficient)) {
      result.push(...coefficient.tail());
    } else if (!equaln(coefficient, 1)) {
      result.push(coefficient);
    }
    if (k === 1) {
      result.push(term);
    } else {
      result.push(makeList(symbol(POWER), term, integer(k)));
    }
    if (result.length > 1) {
      return [makeList(symbol(MULTIPLY), ...result)];
    }
    return result;
  }

  // bazel-out/k8-fastbuild/bin/sources/approxratio.js
  function Eval_approxratio(p1) {
    return approxratioRecursive(cadr(p1));
  }
  function approxratioRecursive(expr) {
    if (istensor(expr)) {
      const p4 = alloc_tensor(expr.tensor.nelem);
      p4.tensor.ndim = expr.tensor.ndim;
      p4.tensor.dim = Array.from(expr.tensor.dim);
      p4.tensor.elem = p4.tensor.elem.map((el) => {
        const result = approxratioRecursive(el);
        check_tensor_dimensions(p4);
        return result;
      });
      return p4;
    }
    if (expr.k === DOUBLE) {
      return approxOneRatioOnly(expr);
    }
    if (iscons(expr)) {
      return new Cons(approxratioRecursive(car(expr)), approxratioRecursive(cdr(expr)));
    }
    return expr;
  }
  function approxOneRatioOnly(p1) {
    const supposedlyTheFloat = zzfloat(p1);
    if (supposedlyTheFloat.k === DOUBLE) {
      const theFloat = supposedlyTheFloat.d;
      const splitBeforeAndAfterDot = theFloat.toString().split(".");
      if (splitBeforeAndAfterDot.length === 2) {
        const numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
        const precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
        const theRatio = floatToRatioRoutine(theFloat, precision);
        return rational(theRatio[0], theRatio[1]);
      }
      return integer(theFloat);
    }
    return makeList(symbol(APPROXRATIO), supposedlyTheFloat);
  }
  function floatToRatioRoutine(decimal, AccuracyFactor) {
    if (isNaN(decimal)) {
      return [0, 0];
    }
    if (decimal === Infinity) {
      return [1, 0];
    }
    if (decimal === -Infinity) {
      return [-1, 0];
    }
    const DecimalSign = decimal < 0 ? -1 : 1;
    decimal = Math.abs(decimal);
    if (Math.abs(decimal - Math.floor(decimal)) < AccuracyFactor) {
      const FractionNumerator2 = decimal * DecimalSign;
      const FractionDenominator2 = 1;
      return [FractionNumerator2, FractionDenominator2];
    }
    if (decimal < 1e-19) {
      const FractionNumerator2 = DecimalSign;
      const FractionDenominator2 = 1e19;
      return [FractionNumerator2, FractionDenominator2];
    }
    if (decimal > 1e19) {
      const FractionNumerator2 = 1e19 * DecimalSign;
      const FractionDenominator2 = 1;
      return [FractionNumerator2, FractionDenominator2];
    }
    let Z = decimal;
    let PreviousDenominator = 0;
    let FractionDenominator = 1;
    let FractionNumerator = void 0;
    while (true) {
      Z = 1 / (Z - Math.floor(Z));
      const temp = FractionDenominator;
      FractionDenominator = FractionDenominator * Math.floor(Z) + PreviousDenominator;
      PreviousDenominator = temp;
      FractionNumerator = Math.floor(decimal * FractionDenominator + 0.5);
      if (!(Math.abs(decimal - FractionNumerator / FractionDenominator) > AccuracyFactor) || Z === Math.floor(Z)) {
        break;
      }
    }
    FractionNumerator = DecimalSign * FractionNumerator;
    return [FractionNumerator, FractionDenominator];
  }
  var approx_just_an_integer = 0;
  var approx_sine_of_rational = 1;
  var approx_sine_of_pi_times_rational = 2;
  var approx_rationalOfPi = 3;
  var approx_radicalOfRatio = 4;
  var approx_ratioOfRadical = 6;
  var approx_rationalOfE = 7;
  var approx_logarithmsOfRationals = 8;
  var approx_rationalsOfLogarithms = 9;
  function approxRationalsOfRadicals(theFloat) {
    let precision;
    const splitBeforeAndAfterDot = theFloat.toString().split(".");
    if (splitBeforeAndAfterDot.length === 2) {
      const numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
      precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    } else {
      return [
        "" + Math.floor(theFloat),
        approx_just_an_integer,
        Math.floor(theFloat),
        1,
        2
      ];
    }
    console.log(`precision: ${precision}`);
    let bestResultSoFar = null;
    let minimumComplexity = Number.MAX_VALUE;
    for (let i of [2, 3, 5, 6, 7, 8, 10]) {
      for (let j = 1; j <= 10; j++) {
        let error, likelyMultiplier, ratio;
        const hypothesis = Math.sqrt(i) / j;
        if (Math.abs(hypothesis) > 1e-10) {
          ratio = theFloat / hypothesis;
          likelyMultiplier = Math.round(ratio);
          error = Math.abs(1 - ratio / likelyMultiplier);
        } else {
          ratio = 1;
          likelyMultiplier = 1;
          error = Math.abs(theFloat - hypothesis);
        }
        if (error < 2 * precision) {
          const complexity = simpleComplexityMeasure(likelyMultiplier, i, j);
          if (complexity < minimumComplexity) {
            minimumComplexity = complexity;
            const result = `${likelyMultiplier} * sqrt( ${i} ) / ${j}`;
            bestResultSoFar = [
              result,
              approx_ratioOfRadical,
              likelyMultiplier,
              i,
              j
            ];
          }
        }
      }
    }
    return bestResultSoFar;
  }
  function approxRadicalsOfRationals(theFloat) {
    let precision;
    const splitBeforeAndAfterDot = theFloat.toString().split(".");
    if (splitBeforeAndAfterDot.length === 2) {
      const numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
      precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    } else {
      return [
        "" + Math.floor(theFloat),
        approx_just_an_integer,
        Math.floor(theFloat),
        1,
        2
      ];
    }
    console.log(`precision: ${precision}`);
    let bestResultSoFar = null;
    let minimumComplexity = Number.MAX_VALUE;
    for (let i of [1, 2, 3, 5, 6, 7, 8, 10]) {
      for (let j of [1, 2, 3, 5, 6, 7, 8, 10]) {
        let error, likelyMultiplier, ratio;
        const hypothesis = Math.sqrt(i / j);
        if (Math.abs(hypothesis) > 1e-10) {
          ratio = theFloat / hypothesis;
          likelyMultiplier = Math.round(ratio);
          error = Math.abs(1 - ratio / likelyMultiplier);
        } else {
          ratio = 1;
          likelyMultiplier = 1;
          error = Math.abs(theFloat - hypothesis);
        }
        if (error < 2 * precision) {
          const complexity = simpleComplexityMeasure(likelyMultiplier, i, j);
          if (complexity < minimumComplexity) {
            minimumComplexity = complexity;
            const result = `${likelyMultiplier} * (sqrt( ${i} / ${j} )`;
            bestResultSoFar = [
              result,
              approx_radicalOfRatio,
              likelyMultiplier,
              i,
              j
            ];
          }
        }
      }
    }
    return bestResultSoFar;
  }
  function approxRadicals(theFloat) {
    let precision;
    const splitBeforeAndAfterDot = theFloat.toString().split(".");
    if (splitBeforeAndAfterDot.length === 2) {
      const numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
      precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    } else {
      return [
        "" + Math.floor(theFloat),
        approx_just_an_integer,
        Math.floor(theFloat),
        1,
        2
      ];
    }
    console.log(`precision: ${precision}`);
    const approxRationalsOfRadicalsResult = approxRationalsOfRadicals(theFloat);
    if (approxRationalsOfRadicalsResult != null) {
      return approxRationalsOfRadicalsResult;
    }
    const approxRadicalsOfRationalsResult = approxRadicalsOfRationals(theFloat);
    if (approxRadicalsOfRationalsResult != null) {
      return approxRadicalsOfRationalsResult;
    }
    return null;
  }
  function approxLogs(theFloat) {
    let precision;
    const splitBeforeAndAfterDot = theFloat.toString().split(".");
    if (splitBeforeAndAfterDot.length === 2) {
      const numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
      precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    } else {
      return [
        "" + Math.floor(theFloat),
        approx_just_an_integer,
        Math.floor(theFloat),
        1,
        2
      ];
    }
    console.log(`precision: ${precision}`);
    const approxRationalsOfLogsResult = approxRationalsOfLogs(theFloat);
    if (approxRationalsOfLogsResult != null) {
      return approxRationalsOfLogsResult;
    }
    const approxLogsOfRationalsResult = approxLogsOfRationals(theFloat);
    if (approxLogsOfRationalsResult != null) {
      return approxLogsOfRationalsResult;
    }
    return null;
  }
  function approxRationalsOfLogs(theFloat) {
    let precision;
    const splitBeforeAndAfterDot = theFloat.toString().split(".");
    if (splitBeforeAndAfterDot.length === 2) {
      const numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
      precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    } else {
      return [
        "" + Math.floor(theFloat),
        approx_just_an_integer,
        Math.floor(theFloat),
        1,
        2
      ];
    }
    console.log(`precision: ${precision}`);
    let bestResultSoFar = null;
    let minimumComplexity = Number.MAX_VALUE;
    for (let i = 2; i <= 5; i++) {
      for (let j = 1; j <= 5; j++) {
        let error, likelyMultiplier, ratio;
        const hypothesis = Math.log(i) / j;
        if (Math.abs(hypothesis) > 1e-10) {
          ratio = theFloat / hypothesis;
          likelyMultiplier = Math.round(ratio);
          error = Math.abs(1 - ratio / likelyMultiplier);
        } else {
          ratio = 1;
          likelyMultiplier = 1;
          error = Math.abs(theFloat - hypothesis);
        }
        if (likelyMultiplier !== 1 && Math.abs(Math.floor(likelyMultiplier / j)) === Math.abs(likelyMultiplier / j)) {
          continue;
        }
        if (error < 2.2 * precision) {
          const complexity = simpleComplexityMeasure(likelyMultiplier, i, j);
          if (complexity < minimumComplexity) {
            minimumComplexity = complexity;
            const result = `${likelyMultiplier} * log( ${i} ) / ${j}`;
            bestResultSoFar = [
              result,
              approx_rationalsOfLogarithms,
              likelyMultiplier,
              i,
              j
            ];
          }
        }
      }
    }
    return bestResultSoFar;
  }
  function approxLogsOfRationals(theFloat) {
    let precision;
    const splitBeforeAndAfterDot = theFloat.toString().split(".");
    if (splitBeforeAndAfterDot.length === 2) {
      const numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
      precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    } else {
      return [
        "" + Math.floor(theFloat),
        approx_just_an_integer,
        Math.floor(theFloat),
        1,
        2
      ];
    }
    console.log(`precision: ${precision}`);
    let bestResultSoFar = null;
    let minimumComplexity = Number.MAX_VALUE;
    for (let i = 1; i <= 5; i++) {
      for (let j = 1; j <= 5; j++) {
        let error, likelyMultiplier, ratio;
        const hypothesis = Math.log(i / j);
        if (Math.abs(hypothesis) > 1e-10) {
          ratio = theFloat / hypothesis;
          likelyMultiplier = Math.round(ratio);
          error = Math.abs(1 - ratio / likelyMultiplier);
        } else {
          ratio = 1;
          likelyMultiplier = 1;
          error = Math.abs(theFloat - hypothesis);
        }
        if (error < 1.96 * precision) {
          const complexity = simpleComplexityMeasure(likelyMultiplier, i, j);
          if (complexity < minimumComplexity) {
            minimumComplexity = complexity;
            const result = `${likelyMultiplier} * log( ${i} / ${j} )`;
            bestResultSoFar = [
              result,
              approx_logarithmsOfRationals,
              likelyMultiplier,
              i,
              j
            ];
          }
        }
      }
    }
    return bestResultSoFar;
  }
  function approxRationalsOfPowersOfE(theFloat) {
    let precision;
    const splitBeforeAndAfterDot = theFloat.toString().split(".");
    if (splitBeforeAndAfterDot.length === 2) {
      const numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
      precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    } else {
      return [
        "" + Math.floor(theFloat),
        approx_just_an_integer,
        Math.floor(theFloat),
        1,
        2
      ];
    }
    console.log(`precision: ${precision}`);
    let bestResultSoFar = null;
    let minimumComplexity = Number.MAX_VALUE;
    for (let i = 1; i <= 2; i++) {
      for (let j = 1; j <= 12; j++) {
        let error, likelyMultiplier, ratio;
        const hypothesis = Math.pow(Math.E, i) / j;
        if (Math.abs(hypothesis) > 1e-10) {
          ratio = theFloat / hypothesis;
          likelyMultiplier = Math.round(ratio);
          error = Math.abs(1 - ratio / likelyMultiplier);
        } else {
          ratio = 1;
          likelyMultiplier = 1;
          error = Math.abs(theFloat - hypothesis);
        }
        if (error < 2 * precision) {
          const complexity = simpleComplexityMeasure(likelyMultiplier, i, j);
          if (complexity < minimumComplexity) {
            minimumComplexity = complexity;
            const result = `${likelyMultiplier} * (e ^ ${i} ) / ${j}`;
            bestResultSoFar = [
              result,
              approx_rationalOfE,
              likelyMultiplier,
              i,
              j
            ];
          }
        }
      }
    }
    return bestResultSoFar;
  }
  function approxRationalsOfPowersOfPI(theFloat) {
    let precision;
    const splitBeforeAndAfterDot = theFloat.toString().split(".");
    if (splitBeforeAndAfterDot.length === 2) {
      const numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
      precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    } else {
      return [
        "" + Math.floor(theFloat),
        approx_just_an_integer,
        Math.floor(theFloat),
        1,
        2
      ];
    }
    console.log(`precision: ${precision}`);
    let bestResultSoFar = null;
    let minimumComplexity = Number.MAX_VALUE;
    for (let i = 1; i <= 5; i++) {
      for (let j = 1; j <= 12; j++) {
        let error, likelyMultiplier, ratio;
        const hypothesis = Math.pow(Math.PI, i) / j;
        if (Math.abs(hypothesis) > 1e-10) {
          ratio = theFloat / hypothesis;
          likelyMultiplier = Math.round(ratio);
          error = Math.abs(1 - ratio / likelyMultiplier);
        } else {
          ratio = 1;
          likelyMultiplier = 1;
          error = Math.abs(theFloat - hypothesis);
        }
        if (error < 2 * precision) {
          const complexity = simpleComplexityMeasure(likelyMultiplier, i, j);
          if (complexity < minimumComplexity) {
            minimumComplexity = complexity;
            const result = `${likelyMultiplier} * (pi ^ ${i} ) / ${j} )`;
            bestResultSoFar = [
              result,
              approx_rationalOfPi,
              likelyMultiplier,
              i,
              j
            ];
          }
        }
      }
    }
    return bestResultSoFar;
  }
  function approxTrigonometric(theFloat) {
    let precision;
    const splitBeforeAndAfterDot = theFloat.toString().split(".");
    if (splitBeforeAndAfterDot.length === 2) {
      const numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
      precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    } else {
      return [
        "" + Math.floor(theFloat),
        approx_just_an_integer,
        Math.floor(theFloat),
        1,
        2
      ];
    }
    console.log(`precision: ${precision}`);
    const approxSineOfRationalsResult = approxSineOfRationals(theFloat);
    if (approxSineOfRationalsResult != null) {
      return approxSineOfRationalsResult;
    }
    const approxSineOfRationalMultiplesOfPIResult = approxSineOfRationalMultiplesOfPI(theFloat);
    if (approxSineOfRationalMultiplesOfPIResult != null) {
      return approxSineOfRationalMultiplesOfPIResult;
    }
    return null;
  }
  function approxSineOfRationals(theFloat) {
    let precision;
    const splitBeforeAndAfterDot = theFloat.toString().split(".");
    if (splitBeforeAndAfterDot.length === 2) {
      const numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
      precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    } else {
      return [
        "" + Math.floor(theFloat),
        approx_just_an_integer,
        Math.floor(theFloat),
        1,
        2
      ];
    }
    console.log(`precision: ${precision}`);
    let bestResultSoFar = null;
    let minimumComplexity = Number.MAX_VALUE;
    for (let i = 1; i <= 4; i++) {
      for (let j = 1; j <= 4; j++) {
        let error, likelyMultiplier, ratio;
        const fraction = i / j;
        const hypothesis = Math.sin(fraction);
        if (Math.abs(hypothesis) > 1e-10) {
          ratio = theFloat / hypothesis;
          likelyMultiplier = Math.round(ratio);
          error = Math.abs(1 - ratio / likelyMultiplier);
        } else {
          ratio = 1;
          likelyMultiplier = 1;
          error = Math.abs(theFloat - hypothesis);
        }
        if (error < 2 * precision) {
          const complexity = simpleComplexityMeasure(likelyMultiplier, i, j);
          if (complexity < minimumComplexity) {
            minimumComplexity = complexity;
            const result = `${likelyMultiplier} * sin( ${i}/${j} )`;
            bestResultSoFar = [
              result,
              approx_sine_of_rational,
              likelyMultiplier,
              i,
              j
            ];
          }
        }
      }
    }
    return bestResultSoFar;
  }
  function approxSineOfRationalMultiplesOfPI(theFloat) {
    let precision;
    const splitBeforeAndAfterDot = theFloat.toString().split(".");
    if (splitBeforeAndAfterDot.length === 2) {
      const numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
      precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    } else {
      return [
        "" + Math.floor(theFloat),
        approx_just_an_integer,
        Math.floor(theFloat),
        1,
        2
      ];
    }
    console.log(`precision: ${precision}`);
    let bestResultSoFar = null;
    let minimumComplexity = Number.MAX_VALUE;
    for (let i = 1; i <= 13; i++) {
      for (let j = 1; j <= 13; j++) {
        let error, likelyMultiplier, ratio;
        const fraction = i / j;
        const hypothesis = Math.sin(Math.PI * fraction);
        if (Math.abs(hypothesis) > 1e-10) {
          ratio = theFloat / hypothesis;
          likelyMultiplier = Math.round(ratio);
          error = Math.abs(1 - ratio / likelyMultiplier);
        } else {
          ratio = 1;
          likelyMultiplier = 1;
          error = Math.abs(theFloat - hypothesis);
        }
        if (error < 23 * precision) {
          const complexity = simpleComplexityMeasure(likelyMultiplier, i, j);
          if (complexity < minimumComplexity) {
            minimumComplexity = complexity;
            const result = `${likelyMultiplier} * sin( ${i}/${j} * pi )`;
            bestResultSoFar = [
              result,
              approx_sine_of_pi_times_rational,
              likelyMultiplier,
              i,
              j
            ];
          }
        }
      }
    }
    return bestResultSoFar;
  }
  function approxAll(theFloat) {
    let precision;
    const splitBeforeAndAfterDot = theFloat.toString().split(".");
    if (splitBeforeAndAfterDot.length === 2) {
      const numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
      precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    } else {
      return [
        "" + Math.floor(theFloat),
        approx_just_an_integer,
        Math.floor(theFloat),
        1,
        2
      ];
    }
    console.log(`precision: ${precision}`);
    let constantsSumMin = Number.MAX_VALUE;
    let constantsSum = 0;
    let bestApproxSoFar = null;
    const LOG_EXPLANATIONS = true;
    const approxRadicalsResult = approxRadicals(theFloat);
    if (approxRadicalsResult != null) {
      constantsSum = simpleComplexityMeasure(approxRadicalsResult);
      if (constantsSum < constantsSumMin) {
        if (LOG_EXPLANATIONS) {
          console.log(`better explanation by approxRadicals: ${approxRadicalsResult} complexity: ${constantsSum}`);
        }
        constantsSumMin = constantsSum;
        bestApproxSoFar = approxRadicalsResult;
      } else {
        if (LOG_EXPLANATIONS) {
          console.log(`subpar explanation by approxRadicals: ${approxRadicalsResult} complexity: ${constantsSum}`);
        }
      }
    }
    const approxLogsResult = approxLogs(theFloat);
    if (approxLogsResult != null) {
      constantsSum = simpleComplexityMeasure(approxLogsResult);
      if (constantsSum < constantsSumMin) {
        if (LOG_EXPLANATIONS) {
          console.log(`better explanation by approxLogs: ${approxLogsResult} complexity: ${constantsSum}`);
        }
        constantsSumMin = constantsSum;
        bestApproxSoFar = approxLogsResult;
      } else {
        if (LOG_EXPLANATIONS) {
          console.log(`subpar explanation by approxLogs: ${approxLogsResult} complexity: ${constantsSum}`);
        }
      }
    }
    const approxRationalsOfPowersOfEResult = approxRationalsOfPowersOfE(theFloat);
    if (approxRationalsOfPowersOfEResult != null) {
      constantsSum = simpleComplexityMeasure(approxRationalsOfPowersOfEResult);
      if (constantsSum < constantsSumMin) {
        if (LOG_EXPLANATIONS) {
          console.log(`better explanation by approxRationalsOfPowersOfE: ${approxRationalsOfPowersOfEResult} complexity: ${constantsSum}`);
        }
        constantsSumMin = constantsSum;
        bestApproxSoFar = approxRationalsOfPowersOfEResult;
      } else {
        if (LOG_EXPLANATIONS) {
          console.log(`subpar explanation by approxRationalsOfPowersOfE: ${approxRationalsOfPowersOfEResult} complexity: ${constantsSum}`);
        }
      }
    }
    const approxRationalsOfPowersOfPIResult = approxRationalsOfPowersOfPI(theFloat);
    if (approxRationalsOfPowersOfPIResult != null) {
      constantsSum = simpleComplexityMeasure(approxRationalsOfPowersOfPIResult);
      if (constantsSum < constantsSumMin) {
        if (LOG_EXPLANATIONS) {
          console.log(`better explanation by approxRationalsOfPowersOfPI: ${approxRationalsOfPowersOfPIResult} complexity: ${constantsSum}`);
        }
        constantsSumMin = constantsSum;
        bestApproxSoFar = approxRationalsOfPowersOfPIResult;
      } else {
        if (LOG_EXPLANATIONS) {
          console.log(`subpar explanation by approxRationalsOfPowersOfPI: ${approxRationalsOfPowersOfPIResult} complexity: ${constantsSum}`);
        }
      }
    }
    const approxTrigonometricResult = approxTrigonometric(theFloat);
    if (approxTrigonometricResult != null) {
      constantsSum = simpleComplexityMeasure(approxTrigonometricResult);
      if (constantsSum < constantsSumMin) {
        if (LOG_EXPLANATIONS) {
          console.log(`better explanation by approxTrigonometric: ${approxTrigonometricResult} complexity: ${constantsSum}`);
        }
        constantsSumMin = constantsSum;
        bestApproxSoFar = approxTrigonometricResult;
      } else {
        if (LOG_EXPLANATIONS) {
          console.log(`subpar explanation by approxTrigonometric: ${approxTrigonometricResult} complexity: ${constantsSum}`);
        }
      }
    }
    return bestApproxSoFar;
  }
  function simpleComplexityMeasure(aResult, b, c) {
    let theSum = 0;
    if (aResult instanceof Array) {
      switch (aResult[1]) {
        case approx_sine_of_pi_times_rational:
          theSum = 4;
          break;
        case approx_rationalOfPi:
          theSum = Math.pow(4, Math.abs(aResult[3])) * Math.abs(aResult[2]);
          break;
        case approx_rationalOfE:
          theSum = Math.pow(3, Math.abs(aResult[3])) * Math.abs(aResult[2]);
          break;
        default:
          theSum = 0;
      }
      theSum += Math.abs(aResult[2]) * (Math.abs(aResult[3]) + Math.abs(aResult[4]));
    } else {
      theSum += Math.abs(aResult) * (Math.abs(b) + Math.abs(c));
    }
    if (aResult[2] === 1) {
      theSum -= 1;
    } else {
      theSum += 1;
    }
    if (aResult[3] === 1) {
      theSum -= 1;
    } else {
      theSum += 1;
    }
    if (aResult[4] === 1) {
      theSum -= 1;
    } else {
      theSum += 1;
    }
    if (theSum < 0) {
      theSum = 0;
    }
    return theSum;
  }
  function testApprox() {
    for (let i of [2, 3, 5, 6, 7, 8, 10]) {
      for (let j of [2, 3, 5, 6, 7, 8, 10]) {
        if (i === j) {
          continue;
        }
        console.log(`testapproxRadicals testing: 1 * sqrt( ${i} ) / ${j}`);
        const fraction = i / j;
        const value2 = Math.sqrt(i) / j;
        const returned = approxRadicals(value2);
        const returnedValue = returned[2] * Math.sqrt(returned[3]) / returned[4];
        if (Math.abs(value2 - returnedValue) > 1e-15) {
          console.log(`fail testapproxRadicals: 1 * sqrt( ${i} ) / ${j} . obtained: ${returned}`);
        }
      }
    }
    for (let i of [2, 3, 5, 6, 7, 8, 10]) {
      for (let j of [2, 3, 5, 6, 7, 8, 10]) {
        if (i === j) {
          continue;
        }
        console.log(`testapproxRadicals testing with 4 digits: 1 * sqrt( ${i} ) / ${j}`);
        const fraction = i / j;
        const originalValue = Math.sqrt(i) / j;
        const value2 = originalValue.toFixed(4);
        const returned = approxRadicals(Number(value2));
        const returnedValue = returned[2] * Math.sqrt(returned[3]) / returned[4];
        if (Math.abs(originalValue - returnedValue) > 1e-15) {
          console.log(`fail testapproxRadicals with 4 digits: 1 * sqrt( ${i} ) / ${j} . obtained: ${returned}`);
        }
      }
    }
    for (let i of [2, 3, 5, 6, 7, 8, 10]) {
      for (let j of [2, 3, 5, 6, 7, 8, 10]) {
        if (i === j) {
          continue;
        }
        console.log(`testapproxRadicals testing: 1 * sqrt( ${i} / ${j} )`);
        const fraction = i / j;
        const value2 = Math.sqrt(i / j);
        const returned = approxRadicals(value2);
        if (returned != null) {
          const returnedValue = returned[2] * Math.sqrt(returned[3] / returned[4]);
          if (returned[1] === approx_radicalOfRatio && Math.abs(value2 - returnedValue) > 1e-15) {
            console.log(`fail testapproxRadicals: 1 * sqrt( ${i} / ${j} ) . obtained: ${returned}`);
          }
        }
      }
    }
    for (let i of [1, 2, 3, 5, 6, 7, 8, 10]) {
      for (let j of [1, 2, 3, 5, 6, 7, 8, 10]) {
        if (i === 1 && j === 1) {
          continue;
        }
        console.log(`testapproxRadicals testing with 4 digits:: 1 * sqrt( ${i} / ${j} )`);
        const fraction = i / j;
        const originalValue = Math.sqrt(i / j);
        const value2 = originalValue.toFixed(4);
        const returned = approxRadicals(Number(value2));
        const returnedValue = returned[2] * Math.sqrt(returned[3] / returned[4]);
        if (returned[1] === approx_radicalOfRatio && Math.abs(originalValue - returnedValue) > 1e-15) {
          console.log(`fail testapproxRadicals with 4 digits:: 1 * sqrt( ${i} / ${j} ) . obtained: ${returned}`);
        }
      }
    }
    for (let i = 1; i <= 5; i++) {
      for (let j = 1; j <= 5; j++) {
        console.log(`testApproxAll testing: 1 * log(${i} ) / ${j}`);
        const fraction = i / j;
        const value2 = Math.log(i) / j;
        const returned = approxAll(value2);
        const returnedValue = returned[2] * Math.log(returned[3]) / returned[4];
        if (Math.abs(value2 - returnedValue) > 1e-15) {
          console.log(`fail testApproxAll: 1 * log(${i} ) / ${j} . obtained: ${returned}`);
        }
      }
    }
    for (let i = 1; i <= 5; i++) {
      for (let j = 1; j <= 5; j++) {
        console.log(`testApproxAll testing with 4 digits: 1 * log(${i} ) / ${j}`);
        const fraction = i / j;
        const originalValue = Math.log(i) / j;
        const value2 = originalValue.toFixed(4);
        const returned = approxAll(Number(value2));
        const returnedValue = returned[2] * Math.log(returned[3]) / returned[4];
        if (Math.abs(originalValue - returnedValue) > 1e-15) {
          console.log(`fail testApproxAll with 4 digits: 1 * log(${i} ) / ${j} . obtained: ${returned}`);
        }
      }
    }
    for (let i = 1; i <= 5; i++) {
      for (let j = 1; j <= 5; j++) {
        console.log(`testApproxAll testing: 1 * log(${i} / ${j} )}`);
        const fraction = i / j;
        const value2 = Math.log(i / j);
        const returned = approxAll(value2);
        const returnedValue = returned[2] * Math.log(returned[3] / returned[4]);
        if (Math.abs(value2 - returnedValue) > 1e-15) {
          console.log(`fail testApproxAll: 1 * log(${i} / ${j} ) . obtained: ${returned}`);
        }
      }
    }
    for (let i = 1; i <= 5; i++) {
      for (let j = 1; j <= 5; j++) {
        console.log(`testApproxAll testing with 4 digits: 1 * log(${i} / ${j} )`);
        const fraction = i / j;
        const originalValue = Math.log(i / j);
        const value2 = originalValue.toFixed(4);
        const returned = approxAll(Number(value2));
        const returnedValue = returned[2] * Math.log(returned[3] / returned[4]);
        if (Math.abs(originalValue - returnedValue) > 1e-15) {
          console.log(`fail testApproxAll with 4 digits: 1 * log(${i} / ${j} ) . obtained: ${returned}`);
        }
      }
    }
    for (let i = 1; i <= 2; i++) {
      for (let j = 1; j <= 12; j++) {
        console.log(`testApproxAll testing: 1 * (e ^ ${i} ) / ${j}`);
        const fraction = i / j;
        const value2 = Math.pow(Math.E, i) / j;
        const returned = approxAll(value2);
        const returnedValue = returned[2] * Math.pow(Math.E, returned[3]) / returned[4];
        if (Math.abs(value2 - returnedValue) > 1e-15) {
          console.log(`fail testApproxAll: 1 * (e ^ ${i} ) / ${j} . obtained: ${returned}`);
        }
      }
    }
    for (let i = 1; i <= 2; i++) {
      for (let j = 1; j <= 12; j++) {
        console.log(`approxRationalsOfPowersOfE testing with 4 digits: 1 * (e ^ ${i} ) / ${j}`);
        const fraction = i / j;
        const originalValue = Math.pow(Math.E, i) / j;
        const value2 = originalValue.toFixed(4);
        const returned = approxRationalsOfPowersOfE(Number(value2));
        const returnedValue = returned[2] * Math.pow(Math.E, returned[3]) / returned[4];
        if (Math.abs(originalValue - returnedValue) > 1e-15) {
          console.log(`fail approxRationalsOfPowersOfE with 4 digits: 1 * (e ^ ${i} ) / ${j} . obtained: ${returned}`);
        }
      }
    }
    for (let i = 1; i <= 2; i++) {
      for (let j = 1; j <= 12; j++) {
        console.log(`testApproxAll testing: 1 * pi ^ ${i} / ${j}`);
        const fraction = i / j;
        const value2 = Math.pow(Math.PI, i) / j;
        const returned = approxAll(value2);
        const returnedValue = returned[2] * Math.pow(Math.PI, returned[3]) / returned[4];
        if (Math.abs(value2 - returnedValue) > 1e-15) {
          console.log(`fail testApproxAll: 1 * pi ^ ${i} / ${j} ) . obtained: ${returned}`);
        }
      }
    }
    for (let i = 1; i <= 2; i++) {
      for (let j = 1; j <= 12; j++) {
        console.log(`approxRationalsOfPowersOfPI testing with 4 digits: 1 * pi ^ ${i} / ${j}`);
        const fraction = i / j;
        const originalValue = Math.pow(Math.PI, i) / j;
        const value2 = originalValue.toFixed(4);
        const returned = approxRationalsOfPowersOfPI(Number(value2));
        const returnedValue = returned[2] * Math.pow(Math.PI, returned[3]) / returned[4];
        if (Math.abs(originalValue - returnedValue) > 1e-15) {
          console.log(`fail approxRationalsOfPowersOfPI with 4 digits: 1 * pi ^ ${i} / ${j} ) . obtained: ${returned}`);
        }
      }
    }
    for (let i = 1; i <= 4; i++) {
      for (let j = 1; j <= 4; j++) {
        console.log(`testApproxAll testing: 1 * sin( ${i}/${j} )}`);
        const fraction = i / j;
        const value2 = Math.sin(fraction);
        const returned = approxAll(value2);
        const returnedFraction = returned[3] / returned[4];
        const returnedValue = returned[2] * Math.sin(returnedFraction);
        if (Math.abs(value2 - returnedValue) > 1e-15) {
          console.log(`fail testApproxAll: 1 * sin( ${i}/${j} ) . obtained: ${returned}`);
        }
      }
    }
    for (let i = 1; i <= 4; i++) {
      for (let j = 1; j <= 4; j++) {
        console.log(`testApproxAll testing with 5 digits: 1 * sin( ${i}/${j} )`);
        const fraction = i / j;
        const originalValue = Math.sin(fraction);
        const value2 = originalValue.toFixed(5);
        const returned = approxAll(Number(value2));
        if (returned == null) {
          console.log(`fail testApproxAll with 5 digits: 1 * sin( ${i}/${j} ) . obtained:  undefined `);
        }
        const returnedFraction = returned[3] / returned[4];
        const returnedValue = returned[2] * Math.sin(returnedFraction);
        const error = Math.abs(originalValue - returnedValue);
        if (error > 1e-14) {
          console.log(`fail testApproxAll with 5 digits: 1 * sin( ${i}/${j} ) . obtained: ${returned} error: ${error}`);
        }
      }
    }
    for (let i = 1; i <= 4; i++) {
      for (let j = 1; j <= 4; j++) {
        console.log(`testApproxAll testing with 4 digits: 1 * sin( ${i}/${j} )`);
        const fraction = i / j;
        const originalValue = Math.sin(fraction);
        const value2 = originalValue.toFixed(4);
        const returned = approxAll(Number(value2));
        if (returned == null) {
          console.log(`fail testApproxAll with 4 digits: 1 * sin( ${i}/${j} ) . obtained:  undefined `);
        }
        const returnedFraction = returned[3] / returned[4];
        const returnedValue = returned[2] * Math.sin(returnedFraction);
        const error = Math.abs(originalValue - returnedValue);
        if (error > 1e-14) {
          console.log(`fail testApproxAll with 4 digits: 1 * sin( ${i}/${j} ) . obtained: ${returned} error: ${error}`);
        }
      }
    }
    let value = 0;
    if (approxAll(value)[0] !== "0") {
      console.log("fail testApproxAll: 0");
    }
    value = 0;
    if (approxAll(value)[0] !== "0") {
      console.log("fail testApproxAll: 0.0");
    }
    value = 0;
    if (approxAll(value)[0] !== "0") {
      console.log("fail testApproxAll: 0.00");
    }
    value = 0;
    if (approxAll(value)[0] !== "0") {
      console.log("fail testApproxAll: 0.000");
    }
    value = 0;
    if (approxAll(value)[0] !== "0") {
      console.log("fail testApproxAll: 0.0000");
    }
    value = 1;
    if (approxAll(value)[0] !== "1") {
      console.log("fail testApproxAll: 1");
    }
    value = 1;
    if (approxAll(value)[0] !== "1") {
      console.log("fail testApproxAll: 1.0");
    }
    value = 1;
    if (approxAll(value)[0] !== "1") {
      console.log("fail testApproxAll: 1.00");
    }
    value = 1;
    if (approxAll(value)[0] !== "1") {
      console.log("fail testApproxAll: 1.000");
    }
    value = 1;
    if (approxAll(value)[0] !== "1") {
      console.log("fail testApproxAll: 1.0000");
    }
    value = 1;
    if (approxAll(value)[0] !== "1") {
      console.log("fail testApproxAll: 1.00000");
    }
    value = Math.sqrt(2);
    if (approxAll(value)[0] !== "1 * sqrt( 2 ) / 1") {
      console.log("fail testApproxAll: Math.sqrt(2)");
    }
    value = 1.41;
    if (approxAll(value)[0] !== "1 * sqrt( 2 ) / 1") {
      console.log("fail testApproxAll: 1.41");
    }
    value = 1.4;
    if (approxRadicals(value)[0] !== "1 * sqrt( 2 ) / 1") {
      console.log("fail approxRadicals: 1.4");
    }
    value = 0.6;
    if (approxLogs(value)[0] !== "1 * log( 2 ) / 1") {
      console.log("fail approxLogs: 0.6");
    }
    value = 0.69;
    if (approxLogs(value)[0] !== "1 * log( 2 ) / 1") {
      console.log("fail approxLogs: 0.69");
    }
    value = 0.7;
    if (approxLogs(value)[0] !== "1 * log( 2 ) / 1") {
      console.log("fail approxLogs: 0.7");
    }
    value = 1.09;
    if (approxLogs(value)[0] !== "1 * log( 3 ) / 1") {
      console.log("fail approxLogs: 1.09");
    }
    value = 1.09;
    if (approxAll(value)[0] !== "1 * log( 3 ) / 1") {
      console.log("fail approxAll: 1.09");
    }
    value = 1.098;
    if (approxAll(value)[0] !== "1 * log( 3 ) / 1") {
      console.log("fail approxAll: 1.098");
    }
    value = 1.1;
    if (approxAll(value)[0] !== "1 * log( 3 ) / 1") {
      console.log("fail approxAll: 1.1");
    }
    value = 1.11;
    if (approxAll(value)[0] !== "1 * log( 3 ) / 1") {
      console.log("fail approxAll: 1.11");
    }
    value = Math.sqrt(3);
    if (approxAll(value)[0] !== "1 * sqrt( 3 ) / 1") {
      console.log("fail testApproxAll: Math.sqrt(3)");
    }
    value = 1;
    if (approxAll(value)[0] !== "1") {
      console.log("fail testApproxAll: 1.0000");
    }
    value = 3.141592;
    if (approxAll(value)[0] !== "1 * (pi ^ 1 ) / 1 )") {
      console.log("fail testApproxAll: 3.141592");
    }
    value = 31.41592;
    if (approxAll(value)[0] !== "10 * (pi ^ 1 ) / 1 )") {
      console.log("fail testApproxAll: 31.41592");
    }
    value = 314.1592;
    if (approxAll(value)[0] !== "100 * (pi ^ 1 ) / 1 )") {
      console.log("fail testApproxAll: 314.1592");
    }
    value = 3141592653589793e-8;
    if (approxAll(value)[0] !== "10000000 * (pi ^ 1 ) / 1 )") {
      console.log("fail testApproxAll: 31415926.53589793");
    }
    value = Math.sqrt(2);
    if (approxTrigonometric(value)[0] !== "2 * sin( 1/4 * pi )") {
      console.log("fail approxTrigonometric: Math.sqrt(2)");
    }
    value = Math.sqrt(3);
    if (approxTrigonometric(value)[0] !== "2 * sin( 1/3 * pi )") {
      console.log("fail approxTrigonometric: Math.sqrt(3)");
    }
    value = (Math.sqrt(6) - Math.sqrt(2)) / 4;
    if (approxAll(value)[0] !== "1 * sin( 1/12 * pi )") {
      console.log("fail testApproxAll: (Math.sqrt(6) - Math.sqrt(2))/4");
    }
    value = Math.sqrt(2 - Math.sqrt(2)) / 2;
    if (approxAll(value)[0] !== "1 * sin( 1/8 * pi )") {
      console.log("fail testApproxAll: Math.sqrt(2 - Math.sqrt(2))/2");
    }
    value = (Math.sqrt(6) + Math.sqrt(2)) / 4;
    if (approxAll(value)[0] !== "1 * sin( 5/12 * pi )") {
      console.log("fail testApproxAll: (Math.sqrt(6) + Math.sqrt(2))/4");
    }
    value = Math.sqrt(2 + Math.sqrt(3)) / 2;
    if (approxAll(value)[0] !== "1 * sin( 5/12 * pi )") {
      console.log("fail testApproxAll: Math.sqrt(2 + Math.sqrt(3))/2");
    }
    value = (Math.sqrt(5) - 1) / 4;
    if (approxAll(value)[0] !== "1 * sin( 1/10 * pi )") {
      console.log("fail testApproxAll: (Math.sqrt(5) - 1)/4");
    }
    value = Math.sqrt(10 - 2 * Math.sqrt(5)) / 4;
    if (approxAll(value)[0] !== "1 * sin( 1/5 * pi )") {
      console.log("fail testApproxAll: Math.sqrt(10 - 2*Math.sqrt(5))/4");
    }
    value = Math.sin(Math.PI / 7);
    if (approxAll(value)[0] !== "1 * sin( 1/7 * pi )") {
      console.log("fail testApproxAll: Math.sin(Math.PI/7)");
    }
    value = Math.sin(Math.PI / 9);
    if (approxAll(value)[0] !== "1 * sin( 1/9 * pi )") {
      console.log("fail testApproxAll: Math.sin(Math.PI/9)");
    }
    value = 1836.15267;
    if (approxRationalsOfPowersOfPI(value)[0] !== "6 * (pi ^ 5 ) / 1 )") {
      console.log("fail approxRationalsOfPowersOfPI: 1836.15267");
    }
    for (let i = 1; i <= 13; i++) {
      for (let j = 1; j <= 13; j++) {
        console.log(`approxTrigonometric testing: 1 * sin( ${i}/${j} * pi )`);
        const fraction = i / j;
        value = Math.sin(Math.PI * fraction);
        const returned = approxTrigonometric(value);
        const returnedFraction = returned[3] / returned[4];
        const returnedValue = returned[2] * Math.sin(Math.PI * returnedFraction);
        if (Math.abs(value - returnedValue) > 1e-15) {
          console.log(`fail approxTrigonometric: 1 * sin( ${i}/${j} * pi ) . obtained: ${returned}`);
        }
      }
    }
    for (let i = 1; i <= 13; i++) {
      for (let j = 1; j <= 13; j++) {
        if (i === 5 && j === 11 || i === 6 && j === 11) {
          continue;
        }
        console.log(`approxTrigonometric testing with 4 digits: 1 * sin( ${i}/${j} * pi )`);
        const fraction = i / j;
        const originalValue = Math.sin(Math.PI * fraction);
        const value2 = originalValue.toFixed(4);
        const returned = approxTrigonometric(Number(value2));
        const returnedFraction = returned[3] / returned[4];
        const returnedValue = returned[2] * Math.sin(Math.PI * returnedFraction);
        const error = Math.abs(originalValue - returnedValue);
        if (error > 1e-14) {
          console.log(`fail approxTrigonometric with 4 digits: 1 * sin( ${i}/${j} * pi ) . obtained: ${returned} error: ${error}`);
        }
      }
    }
    return console.log("testApprox done");
  }

  // bazel-out/k8-fastbuild/bin/sources/arccos.js
  function Eval_arccos(x) {
    return arccos(Eval(cadr(x)));
  }
  function arccos(x) {
    if (car(x) === symbol(COS)) {
      return cadr(x);
    }
    if (isdouble(x)) {
      return double(Math.acos(x.d));
    }
    if (isoneoversqrttwo(x) || ismultiply(x) && equalq(car(cdr(x)), 1, 2) && car(car(cdr(cdr(x)))) === symbol(POWER) && equaln(car(cdr(car(cdr(cdr(x))))), 2) && equalq(car(cdr(cdr(car(cdr(cdr(x)))))), 1, 2)) {
      return defs.evaluatingAsFloats ? double(Math.PI / 4) : multiply(rational(1, 4), symbol(PI));
    }
    if (isminusoneoversqrttwo(x) || ismultiply(x) && equalq(car(cdr(x)), -1, 2) && car(car(cdr(cdr(x)))) === symbol(POWER) && equaln(car(cdr(car(cdr(cdr(x))))), 2) && equalq(car(cdr(cdr(car(cdr(cdr(x)))))), 1, 2)) {
      return defs.evaluatingAsFloats ? double(Math.PI * 3 / 4) : multiply(rational(3, 4), symbol(PI));
    }
    if (isSqrtThreeOverTwo(x)) {
      return defs.evaluatingAsFloats ? double(Math.PI / 6) : multiply(rational(1, 6), symbol(PI));
    }
    if (isMinusSqrtThreeOverTwo(x)) {
      return defs.evaluatingAsFloats ? double(5 * Math.PI / 6) : multiply(rational(5, 6), symbol(PI));
    }
    if (!isrational(x)) {
      return makeList(symbol(ARCCOS), x);
    }
    const n = nativeInt(multiply(x, integer(2)));
    switch (n) {
      case -2:
        return Constants.Pi();
      case -1:
        return defs.evaluatingAsFloats ? double(Math.PI * 2 / 3) : multiply(rational(2, 3), symbol(PI));
      case 0:
        return defs.evaluatingAsFloats ? double(Math.PI / 2) : multiply(rational(1, 2), symbol(PI));
      case 1:
        return defs.evaluatingAsFloats ? double(Math.PI / 3) : multiply(rational(1, 3), symbol(PI));
      case 2:
        return Constants.Zero();
      default:
        return makeList(symbol(ARCCOS), x);
    }
  }

  // bazel-out/k8-fastbuild/bin/sources/arccosh.js
  function Eval_arccosh(x) {
    return arccosh(Eval(cadr(x)));
  }
  function arccosh(x) {
    if (car(x) === symbol(COSH)) {
      return cadr(x);
    }
    if (isdouble(x)) {
      let { d } = x;
      if (d < 1) {
        stop("arccosh function argument is less than 1.0");
      }
      d = Math.log(d + Math.sqrt(d * d - 1));
      return double(d);
    }
    if (isplusone(x)) {
      return Constants.zero;
    }
    return makeList(symbol(ARCCOSH), x);
  }

  // bazel-out/k8-fastbuild/bin/sources/arcsin.js
  function Eval_arcsin(x) {
    return arcsin(Eval(cadr(x)));
  }
  function arcsin(x) {
    if (car(x) === symbol(SIN)) {
      return cadr(x);
    }
    if (isdouble(x)) {
      return double(Math.asin(x.d));
    }
    if (isoneoversqrttwo(x) || ismultiply(x) && equalq(car(cdr(x)), 1, 2) && car(car(cdr(cdr(x)))) === symbol(POWER) && equaln(car(cdr(car(cdr(cdr(x))))), 2) && equalq(car(cdr(cdr(car(cdr(cdr(x)))))), 1, 2)) {
      return multiply(rational(1, 4), symbol(PI));
    }
    if (isminusoneoversqrttwo(x) || ismultiply(x) && equalq(car(cdr(x)), -1, 2) && car(car(cdr(cdr(x)))) === symbol(POWER) && equaln(car(cdr(car(cdr(cdr(x))))), 2) && equalq(car(cdr(cdr(car(cdr(cdr(x)))))), 1, 2)) {
      return defs.evaluatingAsFloats ? double(-Math.PI / 4) : multiply(rational(-1, 4), symbol(PI));
    }
    if (isSqrtThreeOverTwo(x)) {
      return defs.evaluatingAsFloats ? double(Math.PI / 3) : multiply(rational(1, 3), symbol(PI));
    }
    if (isMinusSqrtThreeOverTwo(x)) {
      return defs.evaluatingAsFloats ? double(-Math.PI / 3) : multiply(rational(-1, 3), symbol(PI));
    }
    if (!isrational(x)) {
      return makeList(symbol(ARCSIN), x);
    }
    const n = nativeInt(multiply(x, integer(2)));
    switch (n) {
      case -2:
        return defs.evaluatingAsFloats ? double(-Math.PI / 2) : multiply(rational(-1, 2), symbol(PI));
      case -1:
        return defs.evaluatingAsFloats ? double(-Math.PI / 6) : multiply(rational(-1, 6), symbol(PI));
      case 0:
        return Constants.Zero();
      case 1:
        return defs.evaluatingAsFloats ? double(Math.PI / 6) : multiply(rational(1, 6), symbol(PI));
      case 2:
        return defs.evaluatingAsFloats ? double(Math.PI / 2) : multiply(rational(1, 2), symbol(PI));
      default:
        return makeList(symbol(ARCSIN), x);
    }
  }

  // bazel-out/k8-fastbuild/bin/sources/arcsinh.js
  function Eval_arcsinh(x) {
    return arcsinh(Eval(cadr(x)));
  }
  function arcsinh(x) {
    if (car(x) === symbol(SINH)) {
      return cadr(x);
    }
    if (isdouble(x)) {
      let { d } = x;
      d = Math.log(d + Math.sqrt(d * d + 1));
      return double(d);
    }
    if (isZeroAtomOrTensor(x)) {
      return Constants.zero;
    }
    return makeList(symbol(ARCSINH), x);
  }

  // bazel-out/k8-fastbuild/bin/sources/arctanh.js
  function Eval_arctanh(x) {
    return arctanh(Eval(cadr(x)));
  }
  function arctanh(x) {
    if (car(x) === symbol(TANH)) {
      return cadr(x);
    }
    if (isdouble(x)) {
      let { d } = x;
      if (d < -1 || d > 1) {
        stop("arctanh function argument is not in the interval [-1,1]");
      }
      d = Math.log((1 + d) / (1 - d)) / 2;
      return double(d);
    }
    if (isZeroAtomOrTensor(x)) {
      return Constants.zero;
    }
    return makeList(symbol(ARCTANH), x);
  }

  // bazel-out/k8-fastbuild/bin/sources/binomial.js
  function Eval_binomial(p1) {
    const N2 = Eval(cadr(p1));
    const K = Eval(caddr(p1));
    return binomial(N2, K);
  }
  function binomial(N2, K) {
    return ybinomial(N2, K);
  }
  function ybinomial(N2, K) {
    if (!BINOM_check_args(N2, K)) {
      return Constants.zero;
    }
    return divide(divide(factorial(N2), factorial(K)), factorial(subtract(N2, K)));
  }
  function BINOM_check_args(N2, K) {
    if (isNumericAtom(N2) && lessp(N2, Constants.zero)) {
      return false;
    } else if (isNumericAtom(K) && lessp(K, Constants.zero)) {
      return false;
    } else if (isNumericAtom(N2) && isNumericAtom(K) && lessp(N2, K)) {
      return false;
    } else {
      return true;
    }
  }

  // bazel-out/k8-fastbuild/bin/sources/ceiling.js
  function Eval_ceiling(p1) {
    return ceiling(Eval(cadr(p1)));
  }
  function ceiling(p1) {
    return yyceiling(p1);
  }
  function yyceiling(p1) {
    if (!isNumericAtom(p1)) {
      return makeList(symbol(CEILING), p1);
    }
    if (isdouble(p1)) {
      return double(Math.ceil(p1.d));
    }
    if (isinteger(p1)) {
      return p1;
    }
    let result = new Num(mdiv(p1.q.a, p1.q.b));
    if (!isnegativenumber(p1)) {
      result = add(result, Constants.one);
    }
    return result;
  }

  // bazel-out/k8-fastbuild/bin/sources/choose.js
  function Eval_choose(p1) {
    const N2 = Eval(cadr(p1));
    const K = Eval(caddr(p1));
    return choose(N2, K);
  }
  function choose(N2, K) {
    if (!choose_check_args(N2, K)) {
      return Constants.zero;
    }
    return divide(divide(factorial(N2), factorial(K)), factorial(subtract(N2, K)));
  }
  function choose_check_args(N2, K) {
    if (isNumericAtom(N2) && lessp(N2, Constants.zero)) {
      return false;
    } else if (isNumericAtom(K) && lessp(K, Constants.zero)) {
      return false;
    } else if (isNumericAtom(N2) && isNumericAtom(K) && lessp(N2, K)) {
      return false;
    } else {
      return true;
    }
  }

  // bazel-out/k8-fastbuild/bin/sources/expcos.js
  function Eval_expcos(p1) {
    return expcos(Eval(cadr(p1)));
  }
  function expcos(p1) {
    return add(multiply(exponential(multiply(Constants.imaginaryunit, p1)), rational(1, 2)), multiply(exponential(multiply(negate(Constants.imaginaryunit), p1)), rational(1, 2)));
  }

  // bazel-out/k8-fastbuild/bin/sources/expsin.js
  function Eval_expsin(p1) {
    return expsin(Eval(cadr(p1)));
  }
  function expsin(p1) {
    return subtract(multiply(divide(exponential(multiply(Constants.imaginaryunit, p1)), Constants.imaginaryunit), rational(1, 2)), multiply(divide(exponential(multiply(negate(Constants.imaginaryunit), p1)), Constants.imaginaryunit), rational(1, 2)));
  }

  // bazel-out/k8-fastbuild/bin/sources/circexp.js
  function Eval_circexp(p1) {
    const result = circexp(Eval(cadr(p1)));
    return Eval(result);
  }
  function circexp(p1) {
    if (car(p1) === symbol(COS)) {
      return expcos(cadr(p1));
    }
    if (car(p1) === symbol(SIN)) {
      return expsin(cadr(p1));
    }
    if (car(p1) === symbol(TAN)) {
      p1 = cadr(p1);
      const p2 = exponential(multiply(Constants.imaginaryunit, p1));
      const p3 = exponential(negate(multiply(Constants.imaginaryunit, p1)));
      return divide(multiply(subtract(p3, p2), Constants.imaginaryunit), add(p2, p3));
    }
    if (car(p1) === symbol(COSH)) {
      p1 = cadr(p1);
      return multiply(add(exponential(p1), exponential(negate(p1))), rational(1, 2));
    }
    if (car(p1) === symbol(SINH)) {
      p1 = cadr(p1);
      return multiply(subtract(exponential(p1), exponential(negate(p1))), rational(1, 2));
    }
    if (car(p1) === symbol(TANH)) {
      p1 = exponential(multiply(cadr(p1), integer(2)));
      return divide(subtract(p1, Constants.one), add(p1, Constants.one));
    }
    if (iscons(p1)) {
      return p1.map(circexp);
    }
    if (p1.k === TENSOR) {
      p1 = copy_tensor(p1);
      p1.tensor.elem = p1.tensor.elem.map(circexp);
      return p1;
    }
    return p1;
  }

  // bazel-out/k8-fastbuild/bin/sources/contract.js
  function Eval_contract(p1) {
    const p1_prime = Eval(cadr(p1));
    let p2, p3;
    if (cddr(p1) === symbol(NIL)) {
      p2 = Constants.one;
      p3 = integer(2);
    } else {
      p2 = Eval(caddr(p1));
      p3 = Eval(cadddr(p1));
    }
    return contract(p1_prime, p2, p3);
  }
  function contract(p1, p2, p3) {
    const ai = [];
    const an = [];
    if (!istensor(p1)) {
      if (!isZeroAtomOrTensor(p1)) {
        stop("contract: tensor expected, 1st arg is not a tensor");
      }
      return Constants.zero;
    }
    let l = nativeInt(p2);
    let m = nativeInt(p3);
    const { ndim } = p1.tensor;
    if (l < 1 || l > ndim || m < 1 || m > ndim || l === m || p1.tensor.dim[l - 1] !== p1.tensor.dim[m - 1]) {
      stop("contract: index out of range");
    }
    l--;
    m--;
    const n = p1.tensor.dim[l];
    let nelem = 1;
    for (let i = 0; i < ndim; i++) {
      if (i !== l && i !== m) {
        nelem *= p1.tensor.dim[i];
      }
    }
    p2 = alloc_tensor(nelem);
    p2.tensor.ndim = ndim - 2;
    let j = 0;
    for (let i = 0; i < ndim; i++) {
      if (i !== l && i !== m) {
        p2.tensor.dim[j++] = p1.tensor.dim[i];
      }
    }
    const a = p1.tensor.elem;
    const b = p2.tensor.elem;
    for (let i = 0; i < ndim; i++) {
      ai[i] = 0;
      an[i] = p1.tensor.dim[i];
    }
    for (let i = 0; i < nelem; i++) {
      let temp = Constants.zero;
      for (let j2 = 0; j2 < n; j2++) {
        ai[l] = j2;
        ai[m] = j2;
        let h = 0;
        for (let k = 0; k < ndim; k++) {
          h = h * an[k] + ai[k];
        }
        temp = add(temp, a[h]);
      }
      b[i] = temp;
      for (let j2 = ndim - 1; j2 >= 0; j2--) {
        if (j2 === l || j2 === m) {
          continue;
        }
        if (++ai[j2] < an[j2]) {
          break;
        }
        ai[j2] = 0;
      }
    }
    if (nelem === 1) {
      return b[0];
    }
    return p2;
  }

  // bazel-out/k8-fastbuild/bin/sources/defint.js
  function Eval_defint(p1) {
    let F = Eval(cadr(p1));
    p1 = cddr(p1);
    while (iscons(p1)) {
      const X = Eval(car(p1));
      p1 = cdr(p1);
      const A = Eval(car(p1));
      p1 = cdr(p1);
      const B = Eval(car(p1));
      p1 = cdr(p1);
      F = integral(F, X);
      const arg1 = Eval(subst(F, X, B));
      const arg2 = Eval(subst(F, X, A));
      F = subtract(arg1, arg2);
    }
    return F;
  }

  // bazel-out/k8-fastbuild/bin/sources/degree.js
  function Eval_degree(p1) {
    const poly = Eval(cadr(p1));
    p1 = Eval(caddr(p1));
    const variable = p1 === symbol(NIL) ? guess(poly) : p1;
    return degree(poly, variable);
  }
  function degree(POLY, X) {
    return yydegree(POLY, X, Constants.zero);
  }
  function yydegree(POLY, X, DEGREE2) {
    if (equal(POLY, X)) {
      if (isZeroAtomOrTensor(DEGREE2)) {
        DEGREE2 = Constants.one;
      }
    } else if (ispower(POLY)) {
      if (equal(cadr(POLY), X) && isNumericAtom(caddr(POLY)) && lessp(DEGREE2, caddr(POLY))) {
        DEGREE2 = caddr(POLY);
      }
    } else if (iscons(POLY)) {
      DEGREE2 = POLY.tail().reduce((a, b) => yydegree(b, X, a), DEGREE2);
    }
    return DEGREE2;
  }

  // bazel-out/k8-fastbuild/bin/sources/eigen.js
  var EIG_N = 0;
  var EIG_yydd = [];
  var EIG_yyqq = [];
  function Eval_eigen(p1) {
    const { arg: arg2 } = EIG_check_arg(p1);
    if (!arg2) {
      stop("eigen: argument is not a square matrix");
    }
    let [p2, p3] = eigen(EIGEN, arg2);
    p1 = usr_symbol("D");
    set_binding(p1, p2);
    p1 = usr_symbol("Q");
    set_binding(p1, p3);
    return symbol(NIL);
  }
  function Eval_eigenval(p1) {
    const { arg: arg2, invalid } = EIG_check_arg(p1);
    if (invalid) {
      return makeList(symbol(EIGENVAL), invalid);
    }
    let [p2, p3] = eigen(EIGENVAL, arg2);
    return p2;
  }
  function Eval_eigenvec(p1) {
    const { arg: arg2, invalid } = EIG_check_arg(p1);
    if (invalid) {
      return makeList(symbol(EIGENVEC), invalid);
    }
    let [_, p3] = eigen(EIGENVEC, arg2);
    return p3;
  }
  function EIG_check_arg(p1) {
    p1 = Eval(yyfloat(Eval(cadr(p1))));
    if (!istensor(p1)) {
      return { invalid: p1 };
    }
    if (p1.tensor.ndim !== 2 || p1.tensor.dim[0] !== p1.tensor.dim[1]) {
      stop("eigen: argument is not a square matrix");
    }
    EIG_N = p1.tensor.dim[0];
    if (!eigIsDoubleTensor(p1)) {
      stop("eigen: matrix is not numerical");
    }
    for (let i = 0; i < EIG_N - 1; i++) {
      for (let j = i + 1; j < EIG_N; j++) {
        const eli = p1.tensor.elem[EIG_N * i + j];
        const elj = p1.tensor.elem[EIG_N * j + i];
        if (Math.abs(eli.d - elj.d) > 1e-10) {
          stop("eigen: matrix is not symmetrical");
        }
      }
    }
    return { arg: p1 };
  }
  function eigIsDoubleTensor(p1) {
    for (let i = 0; i < EIG_N; i++) {
      for (let j = 0; j < EIG_N; j++) {
        if (!isdouble(p1.tensor.elem[EIG_N * i + j])) {
          return false;
        }
      }
    }
    return true;
  }
  function eigen(op, p1) {
    for (let i2 = 0; i2 < EIG_N * EIG_N; i2++) {
      EIG_yydd[i2] = 0;
    }
    for (let i2 = 0; i2 < EIG_N * EIG_N; i2++) {
      EIG_yyqq[i2] = 0;
    }
    for (let i2 = 0; i2 < EIG_N; i2++) {
      EIG_yydd[EIG_N * i2 + i2] = p1.tensor.elem[EIG_N * i2 + i2].d;
      for (let j = i2 + 1; j < EIG_N; j++) {
        EIG_yydd[EIG_N * i2 + j] = p1.tensor.elem[EIG_N * i2 + j].d;
        EIG_yydd[EIG_N * j + i2] = p1.tensor.elem[EIG_N * i2 + j].d;
      }
    }
    for (let i2 = 0; i2 < EIG_N; i2++) {
      EIG_yyqq[EIG_N * i2 + i2] = 1;
      for (let j = i2 + 1; j < EIG_N; j++) {
        EIG_yyqq[EIG_N * i2 + j] = 0;
        EIG_yyqq[EIG_N * j + i2] = 0;
      }
    }
    let i = 0;
    for (i = 0; i < 100; i++) {
      if (step() === 0) {
        break;
      }
    }
    if (i === 100) {
      print_str("\nnote: eigen did not converge\n");
    }
    let D;
    if (op === EIGEN || op === EIGENVAL) {
      D = copy_tensor(p1);
      for (let i2 = 0; i2 < EIG_N; i2++) {
        for (let j = 0; j < EIG_N; j++) {
          D.tensor.elem[EIG_N * i2 + j] = double(EIG_yydd[EIG_N * i2 + j]);
        }
      }
    }
    let Q;
    if (op === EIGEN || op === EIGENVEC) {
      Q = copy_tensor(p1);
      for (let i2 = 0; i2 < EIG_N; i2++) {
        for (let j = 0; j < EIG_N; j++) {
          Q.tensor.elem[EIG_N * i2 + j] = double(EIG_yyqq[EIG_N * i2 + j]);
        }
      }
    }
    return [D, Q];
  }
  function step() {
    let count2 = 0;
    for (let i = 0; i < EIG_N - 1; i++) {
      for (let j = i + 1; j < EIG_N; j++) {
        if (EIG_yydd[EIG_N * i + j] !== 0) {
          step2(i, j);
          count2++;
        }
      }
    }
    return count2;
  }
  function step2(p, q) {
    const theta = 0.5 * (EIG_yydd[EIG_N * p + p] - EIG_yydd[EIG_N * q + q]) / EIG_yydd[EIG_N * p + q];
    let t = 1 / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
    if (theta < 0) {
      t = -t;
    }
    const c = 1 / Math.sqrt(t * t + 1);
    const s = t * c;
    for (let k = 0; k < EIG_N; k++) {
      const cc = EIG_yydd[EIG_N * p + k];
      const ss = EIG_yydd[EIG_N * q + k];
      EIG_yydd[EIG_N * p + k] = c * cc + s * ss;
      EIG_yydd[EIG_N * q + k] = c * ss - s * cc;
    }
    for (let k = 0; k < EIG_N; k++) {
      const cc = EIG_yydd[EIG_N * k + p];
      const ss = EIG_yydd[EIG_N * k + q];
      EIG_yydd[EIG_N * k + p] = c * cc + s * ss;
      EIG_yydd[EIG_N * k + q] = c * ss - s * cc;
    }
    for (let k = 0; k < EIG_N; k++) {
      const cc = EIG_yyqq[EIG_N * p + k];
      const ss = EIG_yyqq[EIG_N * q + k];
      EIG_yyqq[EIG_N * p + k] = c * cc + s * ss;
      EIG_yyqq[EIG_N * q + k] = c * ss - s * cc;
    }
    EIG_yydd[EIG_N * p + q] = 0;
    EIG_yydd[EIG_N * q + p] = 0;
  }

  // bazel-out/k8-fastbuild/bin/sources/erfc.js
  function Eval_erfc(p1) {
    return yerfc(Eval(cadr(p1)));
  }
  function yerfc(p1) {
    if (isdouble(p1)) {
      const d = erfc(p1.d);
      return double(d);
    }
    if (isZeroAtomOrTensor(p1)) {
      return Constants.one;
    }
    return makeList(symbol(ERFC), p1);
  }
  function erfc(x) {
    if (x === 0) {
      return 1;
    }
    const z = Math.abs(x);
    const t = 1 / (1 + 0.5 * z);
    const ans = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    if (x >= 0) {
      return ans;
    }
    return 2 - ans;
  }

  // bazel-out/k8-fastbuild/bin/sources/erf.js
  function Eval_erf(p1) {
    return yerf(Eval(cadr(p1)));
  }
  function yerf(p1) {
    if (isdouble(p1)) {
      return double(1 - erfc(p1.d));
    }
    if (isZeroAtomOrTensor(p1)) {
      return Constants.zero;
    }
    if (isnegativeterm(p1)) {
      return negate(makeList(symbol(ERF), negate(p1)));
    }
    return makeList(symbol(ERF), p1);
  }

  // bazel-out/k8-fastbuild/bin/sources/factors.js
  function factors(p) {
    const result = [];
    if (isadd(p)) {
      p.tail().forEach((el) => result.push(...term_factors(el)));
    } else {
      result.push(...term_factors(p));
    }
    return result;
  }
  function term_factors(p) {
    if (ismultiply(p)) {
      return p.tail();
    }
    return [p];
  }

  // bazel-out/k8-fastbuild/bin/sources/expand.js
  function Eval_expand(p1) {
    const F = Eval(cadr(p1));
    const p2 = Eval(caddr(p1));
    const X = p2 === symbol(NIL) ? guess(F) : p2;
    return expand(F, X);
  }
  function expand(F, X) {
    if (istensor(F)) {
      return expand_tensor(F, X);
    }
    if (isadd(F)) {
      return F.tail().reduce((a, b) => add(a, expand(b, X)), Constants.zero);
    }
    let B = numerator(F);
    let A = denominator(F);
    [A, B] = remove_negative_exponents(A, B, X);
    if (isone(B) || isone(A)) {
      if (!ispolyexpandedform(A, X) || isone(A)) {
        return F;
      }
    }
    const Q = divpoly(B, A, X);
    B = subtract(B, multiply(A, Q));
    if (isZeroAtomOrTensor(B)) {
      return Q;
    }
    A = factorpoly(A, X);
    let C = expand_get_C(A, X);
    B = expand_get_B(B, C, X);
    A = expand_get_A(A, C, X);
    let result;
    if (istensor(C)) {
      const inverse2 = doexpand(inv, C);
      result = inner(inner(inverse2, B), A);
    } else {
      const arg1 = doexpand(divide, B, C);
      result = multiply(arg1, A);
    }
    return add(result, Q);
  }
  function expand_tensor(p5, p9) {
    p5 = copy_tensor(p5);
    p5.tensor.elem = p5.tensor.elem.map((el) => {
      return expand(el, p9);
    });
    return p5;
  }
  function remove_negative_exponents(p2, p3, p9) {
    const arr = [...factors(p2), ...factors(p3)];
    let j = 0;
    for (let i = 0; i < arr.length; i++) {
      const p1 = arr[i];
      if (!ispower(p1)) {
        continue;
      }
      if (cadr(p1) !== p9) {
        continue;
      }
      const k = nativeInt(caddr(p1));
      if (isNaN(k)) {
        continue;
      }
      if (k < j) {
        j = k;
      }
    }
    if (j === 0) {
      return [p2, p3];
    }
    p2 = multiply(p2, power(p9, integer(-j)));
    p3 = multiply(p3, power(p9, integer(-j)));
    return [p2, p3];
  }
  function expand_get_C(p2, p9) {
    const stack = [];
    if (ismultiply(p2)) {
      p2.tail().forEach((p5) => stack.push(...expand_get_CF(p2, p5, p9)));
    } else {
      stack.push(...expand_get_CF(p2, p2, p9));
    }
    const n = stack.length;
    if (n === 1) {
      return stack[0];
    }
    const p4 = alloc_tensor(n * n);
    p4.tensor.ndim = 2;
    p4.tensor.dim[0] = n;
    p4.tensor.dim[1] = n;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const arg2 = power(p9, integer(i));
        const divided = doexpand(divide, stack[j], arg2);
        p4.tensor.elem[n * i + j] = filter(divided, p9);
      }
    }
    return p4;
  }
  function expand_get_CF(p2, p5, p9) {
    let p6;
    let n = 0;
    if (!Find(p5, p9)) {
      return [];
    }
    const p8 = doexpand(trivial_divide, p2, p5);
    if (ispower(p5)) {
      n = nativeInt(caddr(p5));
      p6 = cadr(p5);
    } else {
      n = 1;
      p6 = p5;
    }
    const stack = [];
    const d = nativeInt(degree(p6, p9));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < d; j++) {
        let arg2 = power(p6, integer(i));
        let arg1 = doexpand(multiply, p8, arg2);
        arg2 = power(p9, integer(j));
        const multiplied = doexpand(multiply, arg1, arg2);
        stack.push(multiplied);
      }
    }
    return stack;
  }
  function trivial_divide(p2, p5) {
    let result = Constants.one;
    if (ismultiply(p2)) {
      const arr = [];
      p2.tail().forEach((p0) => {
        if (!equal(p0, p5)) {
          arr.push(Eval(p0));
        }
      });
      result = multiply_all(arr);
    }
    return result;
  }
  function expand_get_B(p3, p4, p9) {
    if (!istensor(p4)) {
      return p3;
    }
    const n = p4.tensor.dim[0];
    const p8 = alloc_tensor(n);
    p8.tensor.ndim = 1;
    p8.tensor.dim[0] = n;
    for (let i = 0; i < n; i++) {
      const arg2 = power(p9, integer(i));
      const divided = doexpand(divide, p3, arg2);
      p8.tensor.elem[i] = filter(divided, p9);
    }
    return p8;
  }
  function expand_get_A(p2, p4, p9) {
    if (!istensor(p4)) {
      return reciprocate(p2);
    }
    let elements = [];
    if (ismultiply(p2)) {
      p2.tail().forEach((p5) => {
        elements.push(...expand_get_AF(p5, p9));
      });
    } else {
      elements = expand_get_AF(p2, p9);
    }
    const n = elements.length;
    const p8 = alloc_tensor(n);
    p8.tensor.ndim = 1;
    p8.tensor.dim[0] = n;
    p8.tensor.elem = elements;
    return p8;
  }
  function expand_get_AF(p5, p9) {
    let n = 1;
    if (!Find(p5, p9)) {
      return [];
    }
    if (ispower(p5)) {
      n = nativeInt(caddr(p5));
      p5 = cadr(p5);
    }
    const results = [];
    const d = nativeInt(degree(p5, p9));
    for (let i = n; i > 0; i--) {
      for (let j = 0; j < d; j++) {
        results.push(multiply(reciprocate(power(p5, integer(i))), power(p9, integer(j))));
      }
    }
    return results;
  }

  // bazel-out/k8-fastbuild/bin/sources/floor.js
  function Eval_floor(p1) {
    return yfloor(Eval(cadr(p1)));
  }
  function yfloor(p1) {
    return yyfloor(p1);
  }
  function yyfloor(p1) {
    if (!isNumericAtom(p1)) {
      return makeList(symbol(FLOOR), p1);
    }
    if (isdouble(p1)) {
      return double(Math.floor(p1.d));
    }
    if (isinteger(p1)) {
      return p1;
    }
    let p3 = new Num(mdiv(p1.q.a, p1.q.b));
    if (isnegativenumber(p1)) {
      p3 = add(p3, Constants.negOne);
    }
    return p3;
  }

  // bazel-out/k8-fastbuild/bin/sources/for.js
  function Eval_for(p1) {
    const loopingVariable = caddr(p1);
    if (!issymbol(loopingVariable)) {
      stop("for: 2nd arg should be the variable to loop over");
    }
    const j = evaluate_integer(cadddr(p1));
    if (isNaN(j)) {
      return p1;
    }
    const k = evaluate_integer(caddddr(p1));
    if (isNaN(k)) {
      return p1;
    }
    const p4 = get_binding(loopingVariable);
    for (let i = j; i <= k; i++) {
      set_binding(loopingVariable, integer(i));
      Eval(cadr(p1));
    }
    set_binding(loopingVariable, p4);
    return symbol(NIL);
  }

  // bazel-out/k8-fastbuild/bin/sources/gamma.js
  function Eval_gamma(p1) {
    return gamma(Eval(cadr(p1)));
  }
  function gamma(p1) {
    return gammaf(p1);
  }
  function gammaf(p1) {
    if (isrational(p1) && MEQUAL(p1.q.a, 1) && MEQUAL(p1.q.b, 2)) {
      return power(Constants.Pi(), rational(1, 2));
    }
    if (isrational(p1) && MEQUAL(p1.q.a, 3) && MEQUAL(p1.q.b, 2)) {
      return multiply(power(Constants.Pi(), rational(1, 2)), rational(1, 2));
    }
    if (isnegativeterm(p1)) {
      return divide(multiply(Constants.Pi(), Constants.negOne), multiply(multiply(sine(multiply(Constants.Pi(), p1)), p1), gamma(negate(p1))));
    }
    if (isadd(p1)) {
      return gamma_of_sum(p1);
    }
    return makeList(symbol(GAMMA), p1);
  }
  function gamma_of_sum(p1) {
    const p3 = cdr(p1);
    if (isrational(car(p3)) && MEQUAL(car(p3).q.a, 1) && MEQUAL(car(p3).q.b, 1)) {
      return multiply(cadr(p3), gamma(cadr(p3)));
    }
    if (isrational(car(p3)) && MEQUAL(car(p3).q.a, -1) && MEQUAL(car(p3).q.b, 1)) {
      return divide(gamma(cadr(p3)), add(cadr(p3), Constants.negOne));
    }
    return makeList(symbol(GAMMA), p1);
  }

  // bazel-out/k8-fastbuild/bin/sources/isprime.js
  function Eval_isprime(p1) {
    return isprime(Eval(cadr(p1)));
  }
  function isprime(p1) {
    if (isnonnegativeinteger(p1) && mprime(p1.q.a)) {
      return Constants.one;
    }
    return Constants.zero;
  }

  // bazel-out/k8-fastbuild/bin/sources/laguerre.js
  function Eval_laguerre(p1) {
    const X = Eval(cadr(p1));
    const N2 = Eval(caddr(p1));
    const p2 = Eval(cadddr(p1));
    const K = p2 === symbol(NIL) ? Constants.zero : p2;
    return laguerre(X, N2, K);
  }
  function laguerre(X, N2, K) {
    let n = nativeInt(N2);
    if (n < 0 || isNaN(n)) {
      return makeList(symbol(LAGUERRE), X, N2, K);
    }
    if (issymbol(X)) {
      return laguerre2(n, X, K);
    }
    return Eval(subst(laguerre2(n, symbol(SECRETX), K), symbol(SECRETX), X));
  }
  function laguerre2(n, p1, p3) {
    let Y0 = Constants.zero;
    let Y1 = Constants.one;
    for (let i = 0; i < n; i++) {
      const result = divide(subtract(multiply(add(subtract(integer(2 * i + 1), p1), p3), Y1), multiply(add(integer(i), p3), Y0)), integer(i + 1));
      Y0 = Y1;
      Y1 = result;
    }
    return Y1;
  }

  // bazel-out/k8-fastbuild/bin/sources/leading.js
  function Eval_leading(p1) {
    const P = Eval(cadr(p1));
    p1 = Eval(caddr(p1));
    const X = p1 === symbol(NIL) ? guess(P) : p1;
    return leading(P, X);
  }
  function leading(P, X) {
    const N2 = degree(P, X);
    return filter(divide(P, power(X, N2)), X);
  }

  // bazel-out/k8-fastbuild/bin/sources/legendre.js
  function Eval_legendre(p1) {
    const X = Eval(cadr(p1));
    const N2 = Eval(caddr(p1));
    const p2 = Eval(cadddr(p1));
    const M = p2 === symbol(NIL) ? Constants.zero : p2;
    return legendre(X, N2, M);
  }
  function legendre(X, N2, M) {
    return __legendre(X, N2, M);
  }
  function __legendre(X, N2, M) {
    let n = nativeInt(N2);
    let m = nativeInt(M);
    if (n < 0 || isNaN(n) || m < 0 || isNaN(m)) {
      return makeList(symbol(LEGENDRE), X, N2, M);
    }
    let result;
    if (issymbol(X)) {
      result = __legendre2(n, m, X);
    } else {
      const expr = __legendre2(n, m, symbol(SECRETX));
      result = Eval(subst(expr, symbol(SECRETX), X));
    }
    result = __legendre3(result, m, X) || result;
    return result;
  }
  function __legendre2(n, m, X) {
    let Y0 = Constants.zero;
    let Y1 = Constants.one;
    for (let i = 0; i < n; i++) {
      const divided = divide(subtract(multiply(multiply(integer(2 * i + 1), X), Y1), multiply(integer(i), Y0)), integer(i + 1));
      Y0 = Y1;
      Y1 = divided;
    }
    for (let i = 0; i < m; i++) {
      Y1 = derivative(Y1, X);
    }
    return Y1;
  }
  function __legendre3(p1, m, X) {
    if (m === 0) {
      return;
    }
    let base = subtract(Constants.one, square(X));
    if (car(X) === symbol(COS)) {
      base = square(sine(cadr(X)));
    } else if (car(X) === symbol(SIN)) {
      base = square(cosine(cadr(X)));
    }
    let result = multiply(p1, power(base, multiply(integer(m), rational(1, 2))));
    if (m % 2) {
      result = negate(result);
    }
    return result;
  }

  // bazel-out/k8-fastbuild/bin/sources/lookup.js
  function Eval_lookup(p1) {
    p1 = cadr(p1);
    if (!iscons(p1) && cadr(p1).k === SYM) {
      p1 = get_binding(p1);
    }
    return p1;
  }

  // bazel-out/k8-fastbuild/bin/sources/mod.js
  function Eval_mod(p1) {
    const arg1 = Eval(cadr(p1));
    let arg2 = Eval(caddr(p1));
    return mod(arg1, arg2);
  }
  function mod(p1, p2) {
    if (isZeroAtomOrTensor(p2)) {
      stop("mod function: divide by zero");
    }
    if (!isNumericAtom(p1) || !isNumericAtom(p2)) {
      return makeList(symbol(MOD), p1, p2);
    }
    if (isdouble(p1)) {
      const n = nativeInt(p1);
      if (isNaN(n)) {
        stop("mod function: cannot convert float value to integer");
      }
      p1 = integer(n);
    }
    if (isdouble(p2)) {
      const n = nativeInt(p2);
      if (isNaN(n)) {
        stop("mod function: cannot convert float value to integer");
      }
      p2 = integer(n);
    }
    if (!isinteger(p1) || !isinteger(p2)) {
      stop("mod function: integer arguments expected");
    }
    return new Num(mmod(p1.q.a, p2.q.a));
  }

  // bazel-out/k8-fastbuild/bin/sources/nroots.js
  var NROOTS_YMAX = 101;
  var NROOTS_DELTA = 1e-6;
  var NROOTS_EPSILON = 1e-9;
  function NROOTS_ABS(z) {
    return Math.sqrt(z.r * z.r + z.i * z.i);
  }
  function NROOTS_RANDOM() {
    return 4 * Math.random() - 2;
  }
  var numericRootOfPolynomial = class {
    constructor() {
      this.r = 0;
      this.i = 0;
    }
  };
  var nroots_a = new numericRootOfPolynomial();
  var nroots_b = new numericRootOfPolynomial();
  var nroots_x = new numericRootOfPolynomial();
  var nroots_y = new numericRootOfPolynomial();
  var nroots_fa = new numericRootOfPolynomial();
  var nroots_fb = new numericRootOfPolynomial();
  var nroots_dx = new numericRootOfPolynomial();
  var nroots_df = new numericRootOfPolynomial();
  var nroots_c = [];
  for (let initNRoots = 0; initNRoots < NROOTS_YMAX; initNRoots++) {
    nroots_c[initNRoots] = new numericRootOfPolynomial();
  }
  function Eval_nroots(p1) {
    let p2 = Eval(caddr(p1));
    p1 = Eval(cadr(p1));
    p2 = p2 === symbol(NIL) ? guess(p1) : p2;
    if (!ispolyexpandedform(p1, p2)) {
      stop("nroots: polynomial?");
    }
    const cs = coeff(p1, p2);
    let n = cs.length;
    if (n > NROOTS_YMAX) {
      stop("nroots: degree?");
    }
    for (let i = 0; i < n; i++) {
      p1 = Eval(yyfloat(real(cs[i])));
      p2 = Eval(yyfloat(imag(cs[i])));
      if (!isdouble(p1) || !isdouble(p2)) {
        stop("nroots: coefficients?");
      }
      nroots_c[i].r = p1.d;
      nroots_c[i].i = p2.d;
    }
    monic(n);
    const roots4 = [];
    for (let k = n; k > 1; k--) {
      findroot(k);
      if (Math.abs(nroots_a.r) < NROOTS_DELTA) {
        nroots_a.r = 0;
      }
      if (Math.abs(nroots_a.i) < NROOTS_DELTA) {
        nroots_a.i = 0;
      }
      roots4.push(add(double(nroots_a.r), multiply(double(nroots_a.i), Constants.imaginaryunit)));
      NROOTS_divpoly(k);
    }
    n = roots4.length;
    if (n == 1) {
      return roots4[0];
    } else if (n > 1) {
      roots4.sort(cmp_expr);
      p1 = alloc_tensor(n);
      p1.tensor.ndim = 1;
      p1.tensor.dim[0] = n;
      p1.tensor.elem = roots4;
      return p1;
    }
  }
  function monic(n) {
    nroots_y.r = nroots_c[n - 1].r;
    nroots_y.i = nroots_c[n - 1].i;
    const t = nroots_y.r * nroots_y.r + nroots_y.i * nroots_y.i;
    for (let k = 0; k < n - 1; k++) {
      nroots_c[k].r = (nroots_c[k].r * nroots_y.r + nroots_c[k].i * nroots_y.i) / t;
      nroots_c[k].i = (nroots_c[k].i * nroots_y.r - nroots_c[k].r * nroots_y.i) / t;
    }
    nroots_c[n - 1].r = 1;
    nroots_c[n - 1].i = 0;
  }
  function findroot(n) {
    if (NROOTS_ABS(nroots_c[0]) < NROOTS_DELTA) {
      nroots_a.r = 0;
      nroots_a.i = 0;
      return;
    }
    for (let j = 0; j < 100; j++) {
      nroots_a.r = NROOTS_RANDOM();
      nroots_a.i = NROOTS_RANDOM();
      compute_fa(n);
      nroots_b.r = nroots_a.r;
      nroots_b.i = nroots_a.i;
      nroots_fb.r = nroots_fa.r;
      nroots_fb.i = nroots_fa.i;
      nroots_a.r = NROOTS_RANDOM();
      nroots_a.i = NROOTS_RANDOM();
      for (let k = 0; k < 1e3; k++) {
        compute_fa(n);
        const nrabs = NROOTS_ABS(nroots_fa);
        if (DEBUG) {
          console.log(`nrabs: ${nrabs}`);
        }
        if (nrabs < NROOTS_EPSILON) {
          return;
        }
        if (NROOTS_ABS(nroots_fa) < NROOTS_ABS(nroots_fb)) {
          nroots_x.r = nroots_a.r;
          nroots_x.i = nroots_a.i;
          nroots_a.r = nroots_b.r;
          nroots_a.i = nroots_b.i;
          nroots_b.r = nroots_x.r;
          nroots_b.i = nroots_x.i;
          nroots_x.r = nroots_fa.r;
          nroots_x.i = nroots_fa.i;
          nroots_fa.r = nroots_fb.r;
          nroots_fa.i = nroots_fb.i;
          nroots_fb.r = nroots_x.r;
          nroots_fb.i = nroots_x.i;
        }
        nroots_dx.r = nroots_b.r - nroots_a.r;
        nroots_dx.i = nroots_b.i - nroots_a.i;
        nroots_df.r = nroots_fb.r - nroots_fa.r;
        nroots_df.i = nroots_fb.i - nroots_fa.i;
        const t = nroots_df.r * nroots_df.r + nroots_df.i * nroots_df.i;
        if (t === 0) {
          break;
        }
        nroots_y.r = (nroots_dx.r * nroots_df.r + nroots_dx.i * nroots_df.i) / t;
        nroots_y.i = (nroots_dx.i * nroots_df.r - nroots_dx.r * nroots_df.i) / t;
        nroots_a.r = nroots_b.r - (nroots_y.r * nroots_fb.r - nroots_y.i * nroots_fb.i);
        nroots_a.i = nroots_b.i - (nroots_y.r * nroots_fb.i + nroots_y.i * nroots_fb.r);
      }
    }
    stop("nroots: convergence error");
  }
  function compute_fa(n) {
    nroots_x.r = nroots_a.r;
    nroots_x.i = nroots_a.i;
    nroots_fa.r = nroots_c[0].r + nroots_c[1].r * nroots_x.r - nroots_c[1].i * nroots_x.i;
    nroots_fa.i = nroots_c[0].i + nroots_c[1].r * nroots_x.i + nroots_c[1].i * nroots_x.r;
    for (let k = 2; k < n; k++) {
      const t = nroots_a.r * nroots_x.r - nroots_a.i * nroots_x.i;
      nroots_x.i = nroots_a.r * nroots_x.i + nroots_a.i * nroots_x.r;
      nroots_x.r = t;
      nroots_fa.r += nroots_c[k].r * nroots_x.r - nroots_c[k].i * nroots_x.i;
      nroots_fa.i += nroots_c[k].r * nroots_x.i + nroots_c[k].i * nroots_x.r;
    }
  }
  function NROOTS_divpoly(n) {
    for (let k = n - 1; k > 0; k--) {
      nroots_c[k - 1].r += nroots_c[k].r * nroots_a.r - nroots_c[k].i * nroots_a.i;
      nroots_c[k - 1].i += nroots_c[k].i * nroots_a.r + nroots_c[k].r * nroots_a.i;
    }
    if (NROOTS_ABS(nroots_c[0]) > NROOTS_DELTA) {
      stop("nroots: residual error");
    }
    for (let k = 0; k < n - 1; k++) {
      nroots_c[k].r = nroots_c[k + 1].r;
      nroots_c[k].i = nroots_c[k + 1].i;
    }
  }

  // bazel-out/k8-fastbuild/bin/sources/outer.js
  function Eval_outer(p1) {
    p1 = cdr(p1);
    let temp = Eval(car(p1));
    const result = iscons(p1) ? p1.tail().reduce((acc, p) => outer(acc, Eval(p)), temp) : temp;
    return result;
  }
  function outer(p1, p2) {
    if (istensor(p1) && istensor(p2)) {
      return yyouter(p1, p2);
    }
    if (istensor(p1)) {
      return tensor_times_scalar(p1, p2);
    }
    if (istensor(p2)) {
      return scalar_times_tensor(p1, p2);
    }
    return multiply(p1, p2);
  }
  function yyouter(p1, p2) {
    const ndim = p1.tensor.ndim + p2.tensor.ndim;
    if (ndim > MAXDIM) {
      stop("outer: rank of result exceeds maximum");
    }
    const nelem = p1.tensor.nelem * p2.tensor.nelem;
    const p3 = alloc_tensor(nelem);
    p3.tensor.ndim = ndim;
    p3.tensor.dim = [...p1.tensor.dim, ...p2.tensor.dim];
    let k = 0;
    for (let i = 0; i < p1.tensor.nelem; i++) {
      for (let j = 0; j < p2.tensor.nelem; j++) {
        p3.tensor.elem[k++] = multiply(p1.tensor.elem[i], p2.tensor.elem[j]);
      }
    }
    return p3;
  }

  // bazel-out/k8-fastbuild/bin/sources/pattern.js
  function Eval_silentpattern(p1) {
    Eval_pattern(p1);
    return symbol(NIL);
  }
  function Eval_pattern(p1) {
    let thirdArgument;
    if (!iscons(cdr(p1))) {
      stop("pattern needs at least a template and a transformed version");
    }
    const firstArgument = car(cdr(p1));
    const secondArgument = car(cdr(cdr(p1)));
    if (secondArgument === symbol(NIL)) {
      stop("pattern needs at least a template and a transformed version");
    }
    if (!iscons(cdr(cdr(p1)))) {
      thirdArgument = symbol(NIL);
    } else {
      thirdArgument = car(cdr(cdr(cdr(p1))));
    }
    if (equal(firstArgument, secondArgument)) {
      stop("recursive pattern");
    }
    let stringKey = "template: " + print_list(firstArgument);
    stringKey += " tests: " + print_list(thirdArgument);
    if (DEBUG) {
      console.log(`pattern stringkey: ${stringKey}`);
    }
    const patternPosition = defs.userSimplificationsInStringForm.indexOf(stringKey);
    if (patternPosition === -1) {
      defs.userSimplificationsInStringForm.push(stringKey);
      defs.userSimplificationsInListForm.push(cdr(p1));
    } else {
      if (DEBUG) {
        console.log(`pattern already exists, replacing. ${cdr(p1)}`);
      }
      defs.userSimplificationsInStringForm[patternPosition] = stringKey;
      defs.userSimplificationsInListForm[patternPosition] = cdr(p1);
    }
    return makeList(symbol(PATTERN), cdr(p1));
  }
  function do_clearPatterns() {
    defs.userSimplificationsInListForm = [];
    defs.userSimplificationsInStringForm = [];
  }
  function Eval_clearpatterns() {
    do_clearPatterns();
    return symbol(NIL);
  }
  function Eval_patternsinfo() {
    const patternsinfoToBePrinted = patternsinfo();
    if (patternsinfoToBePrinted !== "") {
      return new Str(patternsinfoToBePrinted);
    } else {
      return symbol(NIL);
    }
  }
  function patternsinfo() {
    let patternsinfoToBePrinted = "";
    for (let i of Array.from(defs.userSimplificationsInListForm)) {
      patternsinfoToBePrinted += defs.userSimplificationsInListForm + "\n";
    }
    return patternsinfoToBePrinted;
  }

  // bazel-out/k8-fastbuild/bin/sources/prime.js
  function Eval_prime(p1) {
    return prime(Eval(cadr(p1)));
  }
  function prime(p1) {
    let n = nativeInt(p1);
    if (n < 1 || n > MAXPRIMETAB) {
      stop("prime: Argument out of range.");
    }
    n = primetab[n - 1];
    return integer(n);
  }

  // bazel-out/k8-fastbuild/bin/sources/product.js
  function Eval_product(p1) {
    const body = cadr(p1);
    const indexVariable = caddr(p1);
    if (!issymbol(indexVariable)) {
      stop("sum: 2nd arg?");
    }
    const j = evaluate_integer(cadddr(p1));
    if (isNaN(j)) {
      return p1;
    }
    const k = evaluate_integer(caddddr(p1));
    if (isNaN(k)) {
      return p1;
    }
    const oldIndexVariableValue = get_binding(indexVariable);
    let temp = Constants.one;
    for (let i = j; i <= k; i++) {
      set_binding(indexVariable, integer(i));
      const arg2 = Eval(body);
      const temp2 = multiply(temp, arg2);
      if (DEBUG) {
        console.log(`product - factor 1: ${arg2}`);
        console.log(`product - factor 2: ${temp}`);
        console.log(`product - result: ${temp2}`);
      }
      temp = temp2;
    }
    set_binding(indexVariable, oldIndexVariableValue);
    return temp;
  }

  // bazel-out/k8-fastbuild/bin/sources/round.js
  function Eval_round(p1) {
    return yround(Eval(cadr(p1)));
  }
  function yround(p1) {
    if (!isNumericAtom(p1)) {
      return makeList(symbol(ROUND), p1);
    }
    if (isdouble(p1)) {
      return double(Math.round(p1.d));
    }
    if (isinteger(p1)) {
      return p1;
    }
    p1 = yyfloat(p1);
    return integer(Math.round(p1.d));
  }

  // bazel-out/k8-fastbuild/bin/sources/shape.js
  function Eval_shape(p1) {
    const result = shape(Eval(cadr(p1)));
    return result;
  }
  function shape(p1) {
    if (!istensor(p1)) {
      if (!isZeroAtomOrTensor(p1)) {
        stop("transpose: tensor expected, 1st arg is not a tensor");
      }
      return Constants.zero;
    }
    let { ndim } = p1.tensor;
    const p2 = alloc_tensor(ndim);
    p2.tensor.ndim = 1;
    p2.tensor.dim[0] = ndim;
    for (let i = 0; i < ndim; i++) {
      p2.tensor.elem[i] = integer(p1.tensor.dim[i]);
    }
    return p2;
  }

  // bazel-out/k8-fastbuild/bin/sources/sum.js
  function Eval_sum(p1) {
    const body = cadr(p1);
    const indexVariable = caddr(p1);
    if (!issymbol(indexVariable)) {
      stop("sum: 2nd arg?");
    }
    const j = evaluate_integer(cadddr(p1));
    if (isNaN(j)) {
      return p1;
    }
    const k = evaluate_integer(caddddr(p1));
    if (isNaN(k)) {
      return p1;
    }
    const p4 = get_binding(indexVariable);
    let temp = Constants.zero;
    for (let i = j; i <= k; i++) {
      set_binding(indexVariable, integer(i));
      temp = add(temp, Eval(body));
    }
    set_binding(indexVariable, p4);
    return temp;
  }

  // bazel-out/k8-fastbuild/bin/sources/tan.js
  function Eval_tan(p1) {
    return tangent(Eval(cadr(p1)));
  }
  function tangent(p1) {
    if (car(p1) === symbol(ARCTAN)) {
      return cadr(p1);
    }
    if (isdouble(p1)) {
      let d = Math.tan(p1.d);
      if (Math.abs(d) < 1e-10) {
        d = 0;
      }
      return double(d);
    }
    if (isnegative(p1)) {
      return negate(tangent(negate(p1)));
    }
    const n = nativeInt(divide(multiply(p1, integer(180)), Constants.Pi()));
    if (n < 0 || isNaN(n)) {
      return makeList(symbol(TAN), p1);
    }
    switch (n % 360) {
      case 0:
      case 180:
        return Constants.zero;
      case 30:
      case 210:
        return multiply(rational(1, 3), power(integer(3), rational(1, 2)));
      case 150:
      case 330:
        return multiply(rational(-1, 3), power(integer(3), rational(1, 2)));
      case 45:
      case 225:
        return Constants.one;
      case 135:
      case 315:
        return Constants.negOne;
      case 60:
      case 240:
        return power(integer(3), rational(1, 2));
      case 120:
      case 300:
        return negate(power(integer(3), rational(1, 2)));
      default:
        return makeList(symbol(TAN), p1);
    }
  }

  // bazel-out/k8-fastbuild/bin/sources/tanh.js
  function Eval_tanh(p1) {
    return tanh(Eval(cadr(p1)));
  }
  function tanh(p1) {
    if (car(p1) === symbol(ARCTANH)) {
      return cadr(p1);
    }
    if (isdouble(p1)) {
      let d = Math.tanh(p1.d);
      if (Math.abs(d) < 1e-10) {
        d = 0;
      }
      return double(d);
    }
    if (isZeroAtomOrTensor(p1)) {
      return Constants.zero;
    }
    return makeList(symbol(TANH), p1);
  }

  // bazel-out/k8-fastbuild/bin/sources/taylor.js
  function Eval_taylor(p1) {
    p1 = cdr(p1);
    const F = Eval(car(p1));
    p1 = cdr(p1);
    let p2 = Eval(car(p1));
    const X = p2 === symbol(NIL) ? guess(F) : p2;
    p1 = cdr(p1);
    p2 = Eval(car(p1));
    const N2 = p2 === symbol(NIL) ? integer(24) : p2;
    p1 = cdr(p1);
    p2 = Eval(car(p1));
    const A = p2 === symbol(NIL) ? Constants.zero : p2;
    return taylor(F, X, N2, A);
  }
  function taylor(F, X, N2, A) {
    const k = nativeInt(N2);
    if (isNaN(k)) {
      return makeList(symbol(TAYLOR), F, X, N2, A);
    }
    let p5 = Constants.one;
    let temp = Eval(subst(F, X, A));
    for (let i = 1; i <= k; i++) {
      F = derivative(F, X);
      if (isZeroAtomOrTensor(F)) {
        break;
      }
      p5 = multiply(p5, subtract(X, A));
      const arg1a = Eval(subst(F, X, A));
      temp = add(temp, divide(multiply(arg1a, p5), factorial(integer(i))));
    }
    return temp;
  }

  // bazel-out/k8-fastbuild/bin/sources/test.js
  function Eval_test(p1) {
    const orig = p1;
    p1 = cdr(p1);
    while (iscons(p1)) {
      if (cdr(p1) === symbol(NIL)) {
        return Eval(car(p1));
      }
      const checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(car(p1));
      if (checkResult == null) {
        return orig;
      } else if (checkResult) {
        return Eval(cadr(p1));
      } else {
        p1 = cddr(p1);
      }
    }
    return Constants.zero;
  }
  function Eval_testeq(p1) {
    const orig = p1;
    let subtractionResult = subtract(Eval(cadr(p1)), Eval(caddr(p1)));
    let checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(subtractionResult);
    if (checkResult) {
      return Constants.zero;
    } else if (checkResult != null && !checkResult) {
      return Constants.one;
    }
    const arg1 = simplify(Eval(cadr(p1)));
    const arg2 = simplify(Eval(caddr(p1)));
    subtractionResult = subtract(arg1, arg2);
    checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(subtractionResult);
    if (checkResult) {
      return Constants.zero;
    } else if (checkResult != null && !checkResult) {
      return Constants.one;
    }
    return orig;
  }
  function Eval_testge(p1) {
    const orig = p1;
    const comparison = cmp_args(p1);
    if (comparison == null) {
      return orig;
    }
    if (comparison >= 0) {
      return Constants.one;
    } else {
      return Constants.zero;
    }
  }
  function Eval_testgt(p1) {
    const orig = p1;
    const comparison = cmp_args(p1);
    if (comparison == null) {
      return orig;
    }
    if (comparison > 0) {
      return Constants.one;
    } else {
      return Constants.zero;
    }
  }
  function Eval_testle(p1) {
    const orig = p1;
    const comparison = cmp_args(p1);
    if (comparison == null) {
      return orig;
    }
    if (comparison <= 0) {
      return Constants.one;
    } else {
      return Constants.zero;
    }
  }
  function Eval_testlt(p1) {
    const orig = p1;
    const comparison = cmp_args(p1);
    if (comparison == null) {
      return orig;
    }
    if (comparison < 0) {
      return Constants.one;
    } else {
      return Constants.zero;
    }
  }
  function Eval_not(p1) {
    const wholeAndExpression = p1;
    const checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(cadr(p1));
    if (checkResult == null) {
      return wholeAndExpression;
    } else if (checkResult) {
      return Constants.zero;
    } else {
      return Constants.one;
    }
  }
  function Eval_and(p1) {
    const wholeAndExpression = p1;
    let andPredicates = cdr(wholeAndExpression);
    let somePredicateUnknown = false;
    while (iscons(andPredicates)) {
      const checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(car(andPredicates));
      if (checkResult == null) {
        somePredicateUnknown = true;
        andPredicates = cdr(andPredicates);
      } else if (checkResult) {
        andPredicates = cdr(andPredicates);
      } else if (!checkResult) {
        return Constants.zero;
      }
    }
    if (somePredicateUnknown) {
      return wholeAndExpression;
    } else {
      return Constants.one;
    }
  }
  function Eval_or(p1) {
    const wholeOrExpression = p1;
    let orPredicates = cdr(wholeOrExpression);
    let somePredicateUnknown = false;
    while (iscons(orPredicates)) {
      const checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(car(orPredicates));
      if (checkResult == null) {
        somePredicateUnknown = true;
        orPredicates = cdr(orPredicates);
      } else if (checkResult) {
        return Constants.one;
      } else if (!checkResult) {
        orPredicates = cdr(orPredicates);
      }
    }
    if (somePredicateUnknown) {
      return wholeOrExpression;
    } else {
      return Constants.zero;
    }
  }
  function cmp_args(p1) {
    let t = 0;
    const arg1 = simplify(Eval(cadr(p1)));
    const arg2 = simplify(Eval(caddr(p1)));
    p1 = subtract(arg1, arg2);
    if (p1.k !== NUM && p1.k !== DOUBLE) {
      p1 = Eval(yyfloat(p1));
    }
    if (isZeroAtomOrTensor(p1)) {
      return 0;
    }
    switch (p1.k) {
      case NUM:
        if (MSIGN(p1.q.a) === -1) {
          t = -1;
        } else {
          t = 1;
        }
        break;
      case DOUBLE:
        if (p1.d < 0) {
          t = -1;
        } else {
          t = 1;
        }
        break;
      default:
        t = null;
    }
    return t;
  }

  // bazel-out/k8-fastbuild/bin/sources/zero.js
  function Eval_zero(p1) {
    const k = Array(MAXDIM).fill(0);
    let m = 1;
    let n = 0;
    if (iscons(p1)) {
      for (const el of p1.tail()) {
        const i = evaluate_integer(el);
        if (i < 1 || isNaN(i)) {
          return Constants.zero;
        }
        m *= i;
        k[n++] = i;
      }
    }
    if (n === 0) {
      return Constants.zero;
    }
    p1 = alloc_tensor(m);
    p1.tensor.ndim = n;
    for (let i = 0; i < n; i++) {
      p1.tensor.dim[i] = k[i];
    }
    return p1;
  }

  // bazel-out/k8-fastbuild/bin/runtime/init.js
  var init_flag = 0;
  function init() {
    init_flag = 0;
    reset_after_error();
    defs.chainOfUserSymbolsNotFunctionsBeingEvaluated = [];
    if (init_flag) {
      return;
    }
    init_flag = 1;
    reset_symbols();
    defn();
  }
  var defn_str = [
    'version="' + version + '"',
    "e=exp(1)",
    "i=sqrt(-1)",
    "autoexpand=1",
    "assumeRealVariables=1",
    "trange=[-pi,pi]",
    "xrange=[-10,10]",
    "yrange=[-10,10]",
    "last=0",
    "trace=0",
    "forceFixedPrintout=1",
    "maxFixedPrintoutDigits=6",
    "printLeaveEAlone=1",
    "printLeaveXAlone=0",
    "cross(u,v)=[u[2]*v[3]-u[3]*v[2],u[3]*v[1]-u[1]*v[3],u[1]*v[2]-u[2]*v[1]]",
    "curl(v)=[d(v[3],y)-d(v[2],z),d(v[1],z)-d(v[3],x),d(v[2],x)-d(v[1],y)]",
    "div(v)=d(v[1],x)+d(v[2],y)+d(v[3],z)",
    "ln(x)=log(x)"
  ];
  function defn() {
    std_symbol(ABS, Eval_abs);
    std_symbol(ADD, Eval_add);
    std_symbol(ADJ, Eval_adj);
    std_symbol(AND, Eval_and);
    std_symbol(APPROXRATIO, Eval_approxratio);
    std_symbol(ARCCOS, Eval_arccos);
    std_symbol(ARCCOSH, Eval_arccosh);
    std_symbol(ARCSIN, Eval_arcsin);
    std_symbol(ARCSINH, Eval_arcsinh);
    std_symbol(ARCTAN, Eval_arctan);
    std_symbol(ARCTANH, Eval_arctanh);
    std_symbol(ARG, Eval_arg);
    std_symbol(ATOMIZE);
    std_symbol(BESSELJ, Eval_besselj);
    std_symbol(BESSELY, Eval_bessely);
    std_symbol(BINDING, Eval_binding);
    std_symbol(BINOMIAL, Eval_binomial);
    std_symbol(CEILING, Eval_ceiling);
    std_symbol(CHECK, Eval_check);
    std_symbol(CHOOSE, Eval_choose);
    std_symbol(CIRCEXP, Eval_circexp);
    std_symbol(CLEAR, Eval_clear);
    std_symbol(CLEARALL, Eval_clearall);
    std_symbol(CLEARPATTERNS, Eval_clearpatterns);
    std_symbol(CLOCK, Eval_clock);
    std_symbol(COEFF, Eval_coeff);
    std_symbol(COFACTOR, Eval_cofactor);
    std_symbol(CONDENSE, Eval_condense);
    std_symbol(CONJ, Eval_conj);
    std_symbol(CONTRACT, Eval_contract);
    std_symbol(COS, Eval_cos);
    std_symbol(COSH, Eval_cosh);
    std_symbol(DECOMP, Eval_decomp);
    std_symbol(DEFINT, Eval_defint);
    std_symbol(DEGREE, Eval_degree);
    std_symbol(DENOMINATOR, Eval_denominator);
    std_symbol(DET, Eval_det);
    std_symbol(DERIVATIVE, Eval_derivative);
    std_symbol(DIM, Eval_dim);
    std_symbol(DIRAC, Eval_dirac);
    std_symbol(DIVISORS, Eval_divisors);
    std_symbol(DO, Eval_do);
    std_symbol(DOT, Eval_inner);
    std_symbol(DRAW);
    std_symbol(DSOLVE);
    std_symbol(ERF, Eval_erf);
    std_symbol(ERFC, Eval_erfc);
    std_symbol(EIGEN, Eval_eigen);
    std_symbol(EIGENVAL, Eval_eigenval);
    std_symbol(EIGENVEC, Eval_eigenvec);
    std_symbol(EVAL, Eval_Eval);
    std_symbol(EXP, Eval_exp);
    std_symbol(EXPAND, Eval_expand);
    std_symbol(EXPCOS, Eval_expcos);
    std_symbol(EXPSIN, Eval_expsin);
    std_symbol(FACTOR, Eval_factor);
    std_symbol(FACTORIAL, Eval_factorial);
    std_symbol(FACTORPOLY, Eval_factorpoly);
    std_symbol(FILTER, Eval_filter);
    std_symbol(FLOATF, Eval_float);
    std_symbol(FLOOR, Eval_floor);
    std_symbol(FOR, Eval_for);
    std_symbol(FUNCTION, Eval_function_reference);
    std_symbol(GAMMA, Eval_gamma);
    std_symbol(GCD, Eval_gcd);
    std_symbol(HERMITE, Eval_hermite);
    std_symbol(HILBERT, Eval_hilbert);
    std_symbol(IMAG, Eval_imag);
    std_symbol(INDEX, Eval_index);
    std_symbol(INNER, Eval_inner);
    std_symbol(INTEGRAL, Eval_integral);
    std_symbol(INV, Eval_inv);
    std_symbol(INVG, Eval_invg);
    std_symbol(ISINTEGER, Eval_isinteger);
    std_symbol(ISPRIME, Eval_isprime);
    std_symbol(LAGUERRE, Eval_laguerre);
    std_symbol(LCM, Eval_lcm);
    std_symbol(LEADING, Eval_leading);
    std_symbol(LEGENDRE, Eval_legendre);
    std_symbol(LOG, Eval_log);
    std_symbol(LOOKUP, Eval_lookup);
    std_symbol(MOD, Eval_mod);
    std_symbol(MULTIPLY, Eval_multiply);
    std_symbol(NOT, Eval_not);
    std_symbol(NROOTS, Eval_nroots);
    std_symbol(NUMBER, Eval_number);
    std_symbol(NUMERATOR, Eval_numerator);
    std_symbol(OPERATOR, Eval_operator);
    std_symbol(OR, Eval_or);
    std_symbol(OUTER, Eval_outer);
    std_symbol(PATTERN, Eval_pattern);
    std_symbol(PATTERNSINFO, Eval_patternsinfo);
    std_symbol(POLAR, Eval_polar);
    std_symbol(POWER, Eval_power);
    std_symbol(PRIME, Eval_prime);
    std_symbol(PRINT, Eval_print);
    std_symbol(PRINT2DASCII, Eval_print2dascii);
    std_symbol(PRINTFULL, Eval_printcomputer);
    std_symbol(PRINTLATEX, Eval_printlatex);
    std_symbol(PRINTLIST, Eval_printlist);
    std_symbol(PRINTPLAIN, Eval_printhuman);
    std_symbol(PRINT_LEAVE_E_ALONE);
    std_symbol(PRINT_LEAVE_X_ALONE);
    std_symbol(PRODUCT, Eval_product);
    std_symbol(QUOTE, Eval_quote);
    std_symbol(QUOTIENT, Eval_quotient);
    std_symbol(RANK, Eval_rank);
    std_symbol(RATIONALIZE, Eval_rationalize);
    std_symbol(REAL, Eval_real);
    std_symbol(YYRECT, Eval_rect);
    std_symbol(ROOTS, Eval_roots);
    std_symbol(ROUND, Eval_round);
    std_symbol(SETQ, Eval_setq);
    std_symbol(SGN, Eval_sgn);
    std_symbol(SILENTPATTERN, Eval_silentpattern);
    std_symbol(SIMPLIFY, Eval_simplify);
    std_symbol(SIN, Eval_sin);
    std_symbol(SINH, Eval_sinh);
    std_symbol(SHAPE, Eval_shape);
    std_symbol(SQRT, Eval_sqrt);
    std_symbol(STOP, Eval_stop);
    std_symbol(SUBST, Eval_subst);
    std_symbol(SUM, Eval_sum);
    std_symbol(SYMBOLSINFO, Eval_symbolsinfo);
    std_symbol(TAN, Eval_tan);
    std_symbol(TANH, Eval_tanh);
    std_symbol(TAYLOR, Eval_taylor);
    std_symbol(TEST, Eval_test);
    std_symbol(TESTEQ, Eval_testeq);
    std_symbol(TESTGE, Eval_testge);
    std_symbol(TESTGT, Eval_testgt);
    std_symbol(TESTLE, Eval_testle);
    std_symbol(TESTLT, Eval_testlt);
    std_symbol(TRANSPOSE, Eval_transpose);
    std_symbol(UNIT, Eval_unit);
    std_symbol(ZERO, Eval_zero);
    std_symbol(NIL);
    std_symbol(AUTOEXPAND);
    std_symbol(BAKE);
    std_symbol(ASSUME_REAL_VARIABLES);
    std_symbol(LAST);
    std_symbol(LAST_PRINT);
    std_symbol(LAST_2DASCII_PRINT);
    std_symbol(LAST_FULL_PRINT);
    std_symbol(LAST_LATEX_PRINT);
    std_symbol(LAST_LIST_PRINT);
    std_symbol(LAST_PLAIN_PRINT);
    std_symbol(TRACE);
    std_symbol(FORCE_FIXED_PRINTOUT);
    std_symbol(MAX_FIXED_PRINTOUT_DIGITS);
    std_symbol(YYE);
    std_symbol(DRAWX);
    std_symbol(METAA);
    std_symbol(METAB);
    std_symbol(METAX);
    std_symbol(SECRETX);
    std_symbol(VERSION);
    std_symbol(PI);
    std_symbol(SYMBOL_A);
    std_symbol(SYMBOL_B);
    std_symbol(SYMBOL_C);
    std_symbol(SYMBOL_D);
    std_symbol(SYMBOL_I);
    std_symbol(SYMBOL_J);
    std_symbol(SYMBOL_N);
    std_symbol(SYMBOL_R);
    std_symbol(SYMBOL_S);
    std_symbol(SYMBOL_T);
    std_symbol(SYMBOL_X);
    std_symbol(SYMBOL_Y);
    std_symbol(SYMBOL_Z);
    std_symbol(SYMBOL_IDENTITY_MATRIX);
    std_symbol(SYMBOL_A_UNDERSCORE);
    std_symbol(SYMBOL_B_UNDERSCORE);
    std_symbol(SYMBOL_X_UNDERSCORE);
    std_symbol(C1);
    std_symbol(C2);
    std_symbol(C3);
    std_symbol(C4);
    std_symbol(C5);
    std_symbol(C6);
    defineSomeHandyConstants();
    const originalCodeGen = defs.codeGen;
    defs.codeGen = false;
    for (let defn_i = 0; defn_i < defn_str.length; defn_i++) {
      const definitionOfInterest = defn_str[defn_i];
      const [, def] = scan(definitionOfInterest);
      if (DEBUG) {
        console.log(`... evaling ${definitionOfInterest}`);
        console.log("top of stack:");
        console.log(print_list(def));
      }
      Eval(def);
    }
    defs.codeGen = originalCodeGen;
  }
  function defineSomeHandyConstants() {
    const imaginaryunit = makeList(symbol(POWER), integer(-1), rational(1, 2));
    if (DEBUG) {
      console.log(print_list(imaginaryunit));
    }
    Constants.imaginaryunit = imaginaryunit;
  }

  // bazel-out/k8-fastbuild/bin/sources/clear.js
  function Eval_clearall() {
    do_clearall();
    return symbol(NIL);
  }
  function do_clearall() {
    if (!defs.test_flag) {
      clear_term();
    }
    do_clearPatterns();
    clear_symbols();
    defn();
    return defs.codeGen = false;
  }
  function Eval_clear(p1) {
    let p2;
    p2 = cdr(p1);
    while (iscons(p2)) {
      const variableToBeCleared = car(p2);
      if (variableToBeCleared.k !== SYM) {
        stop("symbol error");
      }
      clear_symbol(variableToBeCleared);
      p2 = cdr(p2);
    }
    return symbol(NIL);
  }

  // bazel-out/k8-fastbuild/bin/sources/print2d.js
  var YMAX = 1e4;
  var glyph = class {
    constructor() {
      this.c = 0;
      this.x = 0;
      this.y = 0;
    }
  };
  var chartab = [];
  for (let charTabIndex = 0; charTabIndex < YMAX; charTabIndex++) {
    chartab[charTabIndex] = new glyph();
  }
  var yindex = 0;
  var level = 0;
  var emit_x = 0;
  var expr_level = 0;
  function printchar_nowrap(character) {
    let accumulator = "";
    accumulator += character;
    return accumulator;
  }
  function printchar(character) {
    return printchar_nowrap(character);
  }
  function print2dascii(p) {
    yindex = 0;
    level = 0;
    emit_x = 0;
    emit_top_expr(p);
    const [h, w, y] = Array.from(get_size(0, yindex));
    if (w > 100) {
      printline(p);
      return;
    }
    const beenPrinted = print_glyphs();
    return beenPrinted;
  }
  function emit_top_expr(p) {
    if (car(p) === symbol(SETQ)) {
      emit_expr(cadr(p));
      __emit_str(" = ");
      emit_expr(caddr(p));
      return;
    }
    if (istensor(p)) {
      emit_tensor(p);
    } else {
      emit_expr(p);
    }
  }
  function will_be_displayed_as_fraction(p) {
    if (level > 0) {
      return false;
    }
    if (isfraction(p)) {
      return true;
    }
    if (!ismultiply(p)) {
      return false;
    }
    if (isfraction(cadr(p))) {
      return true;
    }
    while (iscons(p)) {
      if (isdenominator(car(p))) {
        return true;
      }
      p = cdr(p);
    }
    return false;
  }
  function emit_expr(p) {
    expr_level++;
    if (isadd(p)) {
      p = cdr(p);
      if (__is_negative(car(p))) {
        __emit_char("-");
        if (will_be_displayed_as_fraction(car(p))) {
          __emit_char(" ");
        }
      }
      emit_term(car(p));
      p = cdr(p);
      while (iscons(p)) {
        if (__is_negative(car(p))) {
          __emit_char(" ");
          __emit_char("-");
          __emit_char(" ");
        } else {
          __emit_char(" ");
          __emit_char("+");
          __emit_char(" ");
        }
        emit_term(car(p));
        p = cdr(p);
      }
    } else {
      if (__is_negative(p)) {
        __emit_char("-");
        if (will_be_displayed_as_fraction(p)) {
          __emit_char(" ");
        }
      }
      emit_term(p);
    }
    expr_level--;
  }
  function emit_unsigned_expr(p) {
    if (isadd(p)) {
      p = cdr(p);
      emit_term(car(p));
      p = cdr(p);
      while (iscons(p)) {
        if (__is_negative(car(p))) {
          __emit_char(" ");
          __emit_char("-");
          __emit_char(" ");
        } else {
          __emit_char(" ");
          __emit_char("+");
          __emit_char(" ");
        }
        emit_term(car(p));
        p = cdr(p);
      }
    } else {
      emit_term(p);
    }
  }
  function __is_negative(p) {
    if (isnegativenumber(p)) {
      return true;
    }
    if (ismultiply(p) && isnegativenumber(cadr(p))) {
      return true;
    }
    return false;
  }
  function emit_term(p) {
    if (ismultiply(p)) {
      const n = count_denominators(p);
      if (n && level === 0) {
        emit_fraction(p, n);
      } else {
        emit_multiply(p, n);
      }
    } else {
      emit_factor(p);
    }
  }
  function isdenominator(p) {
    return ispower(p) && cadr(p) !== symbol(E) && __is_negative(caddr(p));
  }
  function count_denominators(p) {
    let count2 = 0;
    p = cdr(p);
    while (iscons(p)) {
      const q = car(p);
      if (isdenominator(q)) {
        count2++;
      }
      p = cdr(p);
    }
    return count2;
  }
  function emit_multiply(p, n) {
    if (n === 0) {
      p = cdr(p);
      if (isplusone(car(p)) || isminusone(car(p))) {
        p = cdr(p);
      }
      emit_factor(car(p));
      p = cdr(p);
      while (iscons(p)) {
        __emit_char(" ");
        emit_factor(car(p));
        p = cdr(p);
      }
    } else {
      emit_numerators(p);
      __emit_char("/");
      if (n > 1 || isfraction(cadr(p))) {
        __emit_char("(");
        emit_denominators(p);
        __emit_char(")");
      } else {
        emit_denominators(p);
      }
    }
  }
  function emit_fraction(p, d) {
    let p1, p2;
    let count2 = 0;
    let k1 = 0;
    let k2 = 0;
    let n = 0;
    let x = 0;
    let A = Constants.one;
    let B = Constants.one;
    if (isrational(cadr(p))) {
      A = absval(mp_numerator(cadr(p)));
      B = mp_denominator(cadr(p));
    }
    if (isdouble(cadr(p))) {
      A = absval(cadr(p));
    }
    n = isplusone(A) ? 0 : 1;
    p1 = cdr(p);
    if (isNumericAtom(car(p1))) {
      p1 = cdr(p1);
    }
    while (iscons(p1)) {
      p2 = car(p1);
      if (!isdenominator(p2)) {
        n++;
      }
      p1 = cdr(p1);
    }
    x = emit_x;
    k1 = yindex;
    count2 = 0;
    if (!isplusone(A)) {
      emit_number(A, 0);
      count2++;
    }
    p1 = cdr(p);
    if (isNumericAtom(car(p1))) {
      p1 = cdr(p1);
    }
    while (iscons(p1)) {
      p2 = car(p1);
      if (!isdenominator(p2)) {
        if (count2 > 0) {
          __emit_char(" ");
        }
        if (n === 1) {
          emit_expr(p2);
        } else {
          emit_factor(p2);
        }
        count2++;
      }
      p1 = cdr(p1);
    }
    if (count2 === 0) {
      __emit_char("1");
    }
    k2 = yindex;
    count2 = 0;
    if (!isplusone(B)) {
      emit_number(B, 0);
      count2++;
      d++;
    }
    p1 = cdr(p);
    if (isrational(car(p1))) {
      p1 = cdr(p1);
    }
    while (iscons(p1)) {
      p2 = car(p1);
      if (isdenominator(p2)) {
        if (count2 > 0) {
          __emit_char(" ");
        }
        emit_denominator(p2, d);
        count2++;
      }
      p1 = cdr(p1);
    }
    fixup_fraction(x, k1, k2);
  }
  function emit_numerators(p) {
    let p1 = Constants.one;
    p = cdr(p);
    if (isrational(car(p))) {
      p1 = absval(mp_numerator(car(p)));
      p = cdr(p);
    } else if (isdouble(car(p))) {
      p1 = absval(car(p));
      p = cdr(p);
    }
    let n = 0;
    if (!isplusone(p1)) {
      emit_number(p1, 0);
      n++;
    }
    while (iscons(p)) {
      if (!isdenominator(car(p))) {
        if (n > 0) {
          __emit_char(" ");
        }
        emit_factor(car(p));
        n++;
      }
      p = cdr(p);
    }
    if (n === 0) {
      __emit_char("1");
    }
  }
  function emit_denominators(p) {
    let n = 0;
    p = cdr(p);
    if (isfraction(car(p))) {
      const p1 = mp_denominator(car(p));
      emit_number(p1, 0);
      n++;
      p = cdr(p);
    }
    while (iscons(p)) {
      if (isdenominator(car(p))) {
        if (n > 0) {
          __emit_char(" ");
        }
        emit_denominator(car(p), 0);
        n++;
      }
      p = cdr(p);
    }
  }
  function emit_factor(p) {
    if (istensor(p)) {
      if (level === 0) {
        emit_flat_tensor(p);
      } else {
        emit_flat_tensor(p);
      }
      return;
    }
    if (isdouble(p)) {
      emit_number(p, 0);
      return;
    }
    if (isadd(p) || ismultiply(p)) {
      emit_subexpr(p);
      return;
    }
    if (ispower(p)) {
      emit_power(p);
      return;
    }
    if (iscons(p)) {
      emit_function(p);
      return;
    }
    if (isNumericAtom(p)) {
      if (level === 0) {
        emit_numerical_fraction(p);
      } else {
        emit_number(p, 0);
      }
      return;
    }
    if (issymbol(p)) {
      emit_symbol(p);
      return;
    }
    if (isstr(p)) {
      emit_string(p);
    }
  }
  function emit_numerical_fraction(p) {
    const A = absval(mp_numerator(p));
    const B = mp_denominator(p);
    if (isplusone(B)) {
      emit_number(A, 0);
      return;
    }
    let x = emit_x;
    const k1 = yindex;
    emit_number(A, 0);
    const k2 = yindex;
    emit_number(B, 0);
    fixup_fraction(x, k1, k2);
  }
  function isfactor(p) {
    if (iscons(p) && !isadd(p) && !ismultiply(p) && !ispower(p)) {
      return true;
    }
    if (issymbol(p)) {
      return true;
    }
    if (isfraction(p)) {
      return false;
    }
    if (isnegativenumber(p)) {
      return false;
    }
    if (isNumericAtom(p)) {
      return true;
    }
    return false;
  }
  function emit_power(p) {
    let k1 = 0;
    let k2 = 0;
    let x = 0;
    if (cadr(p) === symbol(E)) {
      __emit_str("exp(");
      emit_expr(caddr(p));
      __emit_char(")");
      return;
    }
    if (level > 0) {
      if (isminusone(caddr(p))) {
        __emit_char("1");
        __emit_char("/");
        if (isfactor(cadr(p))) {
          emit_factor(cadr(p));
        } else {
          emit_subexpr(cadr(p));
        }
      } else {
        if (isfactor(cadr(p))) {
          emit_factor(cadr(p));
        } else {
          emit_subexpr(cadr(p));
        }
        __emit_char("^");
        if (isfactor(caddr(p))) {
          emit_factor(caddr(p));
        } else {
          emit_subexpr(caddr(p));
        }
      }
      return;
    }
    if (__is_negative(caddr(p))) {
      x = emit_x;
      k1 = yindex;
      __emit_char("1");
      k2 = yindex;
      emit_denominator(p, 1);
      fixup_fraction(x, k1, k2);
      return;
    }
    k1 = yindex;
    if (isfactor(cadr(p))) {
      emit_factor(cadr(p));
    } else {
      emit_subexpr(cadr(p));
    }
    k2 = yindex;
    level++;
    emit_expr(caddr(p));
    level--;
    fixup_power(k1, k2);
  }
  function emit_denominator(p, n) {
    let k1 = 0;
    let k2 = 0;
    if (isminusone(caddr(p))) {
      if (n === 1) {
        emit_expr(cadr(p));
      } else {
        emit_factor(cadr(p));
      }
      return;
    }
    k1 = yindex;
    if (isfactor(cadr(p))) {
      emit_factor(cadr(p));
    } else {
      emit_subexpr(cadr(p));
    }
    k2 = yindex;
    level++;
    emit_unsigned_expr(caddr(p));
    level--;
    fixup_power(k1, k2);
  }
  function emit_function(p) {
    if (car(p) === symbol(INDEX) && issymbol(cadr(p))) {
      emit_index_function(p);
      return;
    }
    if (isfactorial(p)) {
      emit_factorial_function(p);
      return;
    }
    if (car(p) === symbol(DERIVATIVE)) {
      __emit_char("d");
    } else {
      emit_symbol(car(p));
    }
    __emit_char("(");
    p = cdr(p);
    if (iscons(p)) {
      emit_expr(car(p));
      p = cdr(p);
      while (iscons(p)) {
        __emit_char(",");
        emit_expr(car(p));
        p = cdr(p);
      }
    }
    __emit_char(")");
  }
  function emit_index_function(p) {
    p = cdr(p);
    if (caar(p) === symbol(ADD) || caar(p) === symbol(MULTIPLY) || caar(p) === symbol(POWER) || caar(p) === symbol(FACTORIAL)) {
      emit_subexpr(car(p));
    } else {
      emit_expr(car(p));
    }
    __emit_char("[");
    p = cdr(p);
    if (iscons(p)) {
      emit_expr(car(p));
      p = cdr(p);
      while (iscons(p)) {
        __emit_char(",");
        emit_expr(car(p));
        p = cdr(p);
      }
    }
    __emit_char("]");
  }
  function emit_factorial_function(p) {
    p = cadr(p);
    if (isfraction(p) || isadd(p) || ismultiply(p) || ispower(p) || isfactorial(p)) {
      emit_subexpr(p);
    } else {
      emit_expr(p);
    }
    __emit_char("!");
  }
  function emit_subexpr(p) {
    __emit_char("(");
    emit_expr(p);
    __emit_char(")");
  }
  function emit_symbol(p) {
    if (p === symbol(E)) {
      __emit_str("exp(1)");
      return;
    }
    const pPrintName = get_printname(p);
    for (let i = 0; i < pPrintName.length; i++) {
      __emit_char(pPrintName[i]);
    }
  }
  function emit_string(p) {
    const pString = p.str;
    __emit_char('"');
    for (let i = 0; i < pString.length; i++) {
      __emit_char(pString[i]);
    }
    __emit_char('"');
  }
  function fixup_fraction(x, k1, k2) {
    let dx = 0;
    let dy = 0;
    const [h1, w1, y1] = Array.from(get_size(k1, k2));
    const [h2, w2, y2] = Array.from(get_size(k2, yindex));
    if (w2 > w1) {
      dx = (w2 - w1) / 2;
    } else {
      dx = 0;
    }
    dx++;
    const y = y1 + h1 - 1;
    dy = -y - 1;
    move(k1, k2, dx, dy);
    if (w2 > w1) {
      dx = -w1;
    } else {
      dx = -w1 + (w1 - w2) / 2;
    }
    dx++;
    dy = -y2 + 1;
    move(k2, yindex, dx, dy);
    let w = 0;
    if (w2 > w1) {
      w = w2;
    } else {
      w = w1;
    }
    w += 2;
    emit_x = x;
    for (let i = 0; i < w; i++) {
      __emit_char("-");
    }
  }
  function fixup_power(k1, k2) {
    let dy = 0;
    let h1 = 0;
    let w1 = 0;
    let y1 = 0;
    let h2 = 0;
    let w2 = 0;
    let y2 = 0;
    [h1, w1, y1] = Array.from(get_size(k1, k2));
    [h2, w2, y2] = Array.from(get_size(k2, yindex));
    dy = -y2 - h2 + 1;
    dy += y1 - 1;
    move(k2, yindex, 0, dy);
  }
  function move(j, k, dx, dy) {
    for (let i = j; i < k; i++) {
      chartab[i].x += dx;
      chartab[i].y += dy;
    }
  }
  function get_size(j, k) {
    let min_x = chartab[j].x;
    let max_x = chartab[j].x;
    let min_y = chartab[j].y;
    let max_y = chartab[j].y;
    for (let i = j + 1; i < k; i++) {
      if (chartab[i].x < min_x) {
        min_x = chartab[i].x;
      }
      if (chartab[i].x > max_x) {
        max_x = chartab[i].x;
      }
      if (chartab[i].y < min_y) {
        min_y = chartab[i].y;
      }
      if (chartab[i].y > max_y) {
        max_y = chartab[i].y;
      }
    }
    const h = max_y - min_y + 1;
    const w = max_x - min_x + 1;
    const y = min_y;
    return [h, w, y];
  }
  function __emit_char(c) {
    if (yindex === YMAX) {
      return;
    }
    if (chartab[yindex] == null) {
      breakpoint;
    }
    chartab[yindex].c = c;
    chartab[yindex].x = emit_x;
    chartab[yindex].y = 0;
    yindex++;
    return emit_x++;
  }
  function __emit_str(s) {
    for (let i = 0; i < s.length; i++) {
      __emit_char(s[i]);
    }
  }
  function emit_number(p, emit_sign) {
    let tmpString = "";
    switch (p.k) {
      case NUM:
        tmpString = p.q.a.toString();
        if (tmpString[0] === "-" && emit_sign === 0) {
          tmpString = tmpString.substring(1);
        }
        for (let i = 0; i < tmpString.length; i++) {
          __emit_char(tmpString[i]);
        }
        tmpString = p.q.b.toString();
        if (tmpString === "1") {
          break;
        }
        __emit_char("/");
        for (let i = 0; i < tmpString.length; i++) {
          __emit_char(tmpString[i]);
        }
        break;
      case DOUBLE:
        tmpString = doubleToReasonableString(p.d);
        if (tmpString[0] === "-" && emit_sign === 0) {
          tmpString = tmpString.substring(1);
        }
        for (let i = 0; i < tmpString.length; i++) {
          __emit_char(tmpString[i]);
        }
        break;
    }
  }
  function cmpGlyphs(a, b) {
    if (a.y < b.y) {
      return -1;
    }
    if (a.y > b.y) {
      return 1;
    }
    if (a.x < b.x) {
      return -1;
    }
    if (a.x > b.x) {
      return 1;
    }
    return 0;
  }
  function print_glyphs() {
    let accumulator = "";
    const subsetOfStack = chartab.slice(0, yindex);
    subsetOfStack.sort(cmpGlyphs);
    chartab = [].concat(subsetOfStack).concat(chartab.slice(yindex));
    let x = 0;
    let { y } = chartab[0];
    for (let i = 0; i < yindex; i++) {
      while (chartab[i].y > y) {
        accumulator += printchar("\n");
        x = 0;
        y++;
      }
      while (chartab[i].x > x) {
        accumulator += printchar_nowrap(" ");
        x++;
      }
      accumulator += printchar_nowrap(chartab[i].c);
      x++;
    }
    return accumulator;
  }
  var N = 100;
  var oneElement = class {
    constructor() {
      this.x = 0;
      this.y = 0;
      this.h = 0;
      this.w = 0;
      this.index = 0;
      this.count = 0;
    }
  };
  var elem = [];
  for (let elelmIndex = 0; elelmIndex < 1e4; elelmIndex++) {
    elem[elelmIndex] = new oneElement();
  }
  var SPACE_BETWEEN_COLUMNS = 3;
  var SPACE_BETWEEN_ROWS = 1;
  function emit_tensor(p) {
    let ncol = 0;
    let dx = 0;
    let dy = 0;
    if (p.tensor.ndim > 2) {
      emit_flat_tensor(p);
      return;
    }
    const nrow = p.tensor.dim[0];
    if (p.tensor.ndim === 2) {
      ncol = p.tensor.dim[1];
    } else {
      ncol = 1;
    }
    const n = nrow * ncol;
    if (n > N) {
      emit_flat_tensor(p);
      return;
    }
    const x = emit_x;
    for (let i = 0; i < n; i++) {
      elem[i].index = yindex;
      elem[i].x = emit_x;
      emit_expr(p.tensor.elem[i]);
      elem[i].count = yindex - elem[i].index;
      [elem[i].h, elem[i].w, elem[i].y] = Array.from(get_size(elem[i].index, yindex));
    }
    let eh = 0;
    let ew = 0;
    for (let i = 0; i < n; i++) {
      if (elem[i].h > eh) {
        eh = elem[i].h;
      }
      if (elem[i].w > ew) {
        ew = elem[i].w;
      }
    }
    const h = nrow * eh + (nrow - 1) * SPACE_BETWEEN_ROWS;
    const w = ncol * ew + (ncol - 1) * SPACE_BETWEEN_COLUMNS;
    const y = -(h / 2);
    for (let row = 0; row < nrow; row++) {
      for (let col = 0; col < ncol; col++) {
        let i = row * ncol + col;
        dx = x - elem[i].x;
        dy = y - elem[i].y;
        move(elem[i].index, elem[i].index + elem[i].count, dx, dy);
        dx = 0;
        if (col > 0) {
          dx = col * (ew + SPACE_BETWEEN_COLUMNS);
        }
        dy = 0;
        if (row > 0) {
          dy = row * (eh + SPACE_BETWEEN_ROWS);
        }
        dx += (ew - elem[i].w) / 2;
        dy += (eh - elem[i].h) / 2;
        move(elem[i].index, elem[i].index + elem[i].count, dx, dy);
      }
    }
    emit_x = x + w;
  }
  function emit_flat_tensor(p) {
    emit_tensor_inner(p, 0, 0);
  }
  function emit_tensor_inner(p, j, k) {
    __emit_char("(");
    for (let i = 0; i < p.tensor.dim[j]; i++) {
      if (j + 1 === p.tensor.ndim) {
        emit_expr(p.tensor.elem[k]);
        k = k + 1;
      } else {
        k = emit_tensor_inner(p, j + 1, k);
      }
      if (i + 1 < p.tensor.dim[j]) {
        __emit_char(",");
      }
    }
    __emit_char(")");
    return k;
  }

  // bazel-out/k8-fastbuild/bin/runtime/run.js
  function stop(s) {
    defs.errorMessage += "Stop: ";
    defs.errorMessage += s;
    const message = defs.errorMessage;
    defs.errorMessage = "";
    throw new Error(message);
  }
  var latexErrorSign = "\\rlap{\\large\\color{red}\\bigtriangleup}{\\ \\ \\tiny\\color{red}!}";
  function turnErrorMessageToLatex(theErrorMessage) {
    theErrorMessage = theErrorMessage.replace(/\n/g, "");
    theErrorMessage = theErrorMessage.replace(/_/g, "} \\_ \\text{");
    theErrorMessage = theErrorMessage.replace(new RegExp(String.fromCharCode(transpose_unicode), "g"), "}{}^{T}\\text{");
    theErrorMessage = theErrorMessage.replace(new RegExp(String.fromCharCode(dotprod_unicode), "g"), "}\\cdot \\text{");
    theErrorMessage = theErrorMessage.replace("Stop:", "}  \\quad \\text{Stop:");
    theErrorMessage = theErrorMessage.replace("->", "}  \\rightarrow \\text{");
    theErrorMessage = theErrorMessage.replace("?", "}\\enspace " + latexErrorSign + " \\enspace  \\text{");
    theErrorMessage = "$$\\text{" + theErrorMessage.replace(/\n/g, "") + "}$$";
    return theErrorMessage;
  }
  function normaliseDots(stringToNormalise) {
    stringToNormalise = stringToNormalise.replace(new RegExp(String.fromCharCode(8901), "g"), String.fromCharCode(dotprod_unicode));
    stringToNormalise = stringToNormalise.replace(new RegExp(String.fromCharCode(8226), "g"), String.fromCharCode(dotprod_unicode));
    stringToNormalise = stringToNormalise.replace(new RegExp(String.fromCharCode(12539), "g"), String.fromCharCode(dotprod_unicode));
    stringToNormalise = stringToNormalise.replace(new RegExp(String.fromCharCode(55296), "g"), String.fromCharCode(dotprod_unicode));
    stringToNormalise = stringToNormalise.replace(new RegExp(String.fromCharCode(65381), "g"), String.fromCharCode(dotprod_unicode));
    return stringToNormalise;
  }
  var TIMING_DEBUGS = false;
  function run(stringToBeRun, generateLatex = false) {
    let p1, p2;
    let stringToBeReturned;
    const timeStart = new Date().getTime();
    stringToBeRun = normaliseDots(stringToBeRun);
    if (!defs.inited) {
      defs.inited = true;
      init();
    }
    let n = 0;
    let indexOfPartRemainingToBeParsed = 0;
    let allReturnedPlainStrings = "";
    let allReturnedLatexStrings = "";
    let collectedLatexResult;
    let collectedPlainResult;
    while (true) {
      try {
        defs.errorMessage = "";
        check_stack();
        [n, p1] = scan(stringToBeRun.substring(indexOfPartRemainingToBeParsed));
        check_stack();
      } catch (error) {
        if (PRINTOUTRESULT) {
          console.log(error);
        }
        allReturnedPlainStrings += error.message;
        if (generateLatex) {
          const theErrorMessage = turnErrorMessageToLatex(error.message);
          allReturnedLatexStrings += theErrorMessage;
        }
        reset_after_error();
        break;
      }
      if (n === 0) {
        break;
      }
      indexOfPartRemainingToBeParsed += n;
      let errorWhileExecution = false;
      try {
        defs.stringsEmittedByUserPrintouts = "";
        p2 = top_level_eval(p1);
        check_stack();
        if (isstr(p2)) {
          if (DEBUG) {
            console.log(p2.str);
          }
          if (DEBUG) {
            console.log("\n");
          }
        }
        if (p2 === symbol(NIL)) {
          collectedPlainResult = defs.stringsEmittedByUserPrintouts;
          if (generateLatex) {
            collectedLatexResult = "$$" + defs.stringsEmittedByUserPrintouts + "$$";
          }
        } else {
          collectedPlainResult = print_expr(p2);
          collectedPlainResult += "\n";
          if (generateLatex) {
            collectedLatexResult = "$$" + collectLatexStringFromReturnValue(p2) + "$$";
            if (DEBUG) {
              console.log(`collectedLatexResult: ${collectedLatexResult}`);
            }
          }
        }
        allReturnedPlainStrings += collectedPlainResult;
        if (generateLatex) {
          allReturnedLatexStrings += collectedLatexResult;
        }
        if (PRINTOUTRESULT) {
          if (DEBUG) {
            console.log("printline");
          }
          if (DEBUG) {
            console.log(collectedPlainResult);
          }
        }
        if (PRINTOUTRESULT) {
          if (DEBUG) {
            console.log("display:");
          }
          print2dascii(p2);
        }
        if (generateLatex) {
          allReturnedLatexStrings += "\n";
        }
      } catch (error) {
        errorWhileExecution = true;
        collectedPlainResult = error.message;
        if (generateLatex) {
          collectedLatexResult = turnErrorMessageToLatex(error.message);
        }
        if (PRINTOUTRESULT) {
          console.log(collectedPlainResult);
        }
        allReturnedPlainStrings += collectedPlainResult;
        if (collectedPlainResult !== "") {
          allReturnedPlainStrings += "\n";
        }
        if (generateLatex) {
          allReturnedLatexStrings += collectedLatexResult;
          allReturnedLatexStrings += "\n";
        }
        init();
      }
    }
    if (allReturnedPlainStrings[allReturnedPlainStrings.length - 1] === "\n") {
      allReturnedPlainStrings = allReturnedPlainStrings.substring(0, allReturnedPlainStrings.length - 1);
    }
    if (generateLatex) {
      if (allReturnedLatexStrings[allReturnedLatexStrings.length - 1] === "\n") {
        allReturnedLatexStrings = allReturnedLatexStrings.substring(0, allReturnedLatexStrings.length - 1);
      }
    }
    if (generateLatex) {
      if (DEBUG) {
        console.log(`allReturnedLatexStrings: ${allReturnedLatexStrings}`);
      }
      stringToBeReturned = [allReturnedPlainStrings, allReturnedLatexStrings];
    } else {
      stringToBeReturned = allReturnedPlainStrings;
    }
    if (TIMING_DEBUGS) {
      const timingDebugWrite = "run time on: " + stringToBeRun + " : " + (new Date().getTime() - timeStart) + "ms";
      console.log(timingDebugWrite);
    }
    allReturnedPlainStrings = "";
    allReturnedLatexStrings = "";
    return stringToBeReturned;
  }
  function check_stack() {
    if (defs.chainOfUserSymbolsNotFunctionsBeingEvaluated.length !== 0) {
      breakpoint;
      stop("symbols evaluation still ongoing?");
    }
    if (defs.evaluatingAsFloats) {
      breakpoint;
      stop("numeric evaluation still ongoing?");
    }
    if (defs.evaluatingPolar) {
      breakpoint;
      stop("evaluation of polar still ongoing?");
    }
  }
  function top_level_eval(expr) {
    if (DEBUG) {
      console.log("#### top level eval");
    }
    defs.trigmode = 0;
    const shouldAutoexpand = symbol(AUTOEXPAND);
    defs.expanding = !isZeroAtomOrTensor(get_binding(shouldAutoexpand));
    const originalArgument = expr;
    let evalledArgument = Eval(expr);
    if (evalledArgument === symbol(NIL)) {
      return evalledArgument;
    }
    set_binding(symbol(LAST), evalledArgument);
    if (!isZeroAtomOrTensor(get_binding(symbol(BAKE)))) {
      const baked = bake(evalledArgument);
      evalledArgument = baked;
    }
    if ((originalArgument === symbol(SYMBOL_I) || originalArgument === symbol(SYMBOL_J)) && isimaginaryunit(evalledArgument)) {
      return evalledArgument;
    } else if (isimaginaryunit(get_binding(symbol(SYMBOL_J)))) {
      return subst(evalledArgument, Constants.imaginaryunit, symbol(SYMBOL_J));
    } else if (isimaginaryunit(get_binding(symbol(SYMBOL_I)))) {
      return subst(evalledArgument, Constants.imaginaryunit, symbol(SYMBOL_I));
    }
    return evalledArgument;
  }
  function check_esc_flag() {
    if (defs.esc_flag) {
      stop("esc key");
    }
  }

  // bazel-out/k8-fastbuild/bin/sources/tensor.js
  function Eval_tensor(a) {
    check_tensor_dimensions(a);
    const { nelem, ndim } = a.tensor;
    const b = alloc_tensor(nelem);
    b.tensor.ndim = ndim;
    b.tensor.dim = Array.from(a.tensor.dim);
    check_tensor_dimensions(b);
    b.tensor.elem = a.tensor.elem.map(Eval);
    check_tensor_dimensions(a);
    check_tensor_dimensions(b);
    return promote_tensor(b);
  }
  function tensor_plus_tensor(p1, p2) {
    if (p1.tensor.ndim !== p2.tensor.ndim) {
      return symbol(NIL);
    }
    if (p1.tensor.dim.some((n, i) => n !== p2.tensor.dim[i])) {
      return symbol(NIL);
    }
    const { nelem, ndim } = p1.tensor;
    const p3 = alloc_tensor(nelem);
    p3.tensor.ndim = ndim;
    p3.tensor.dim = Array.from(p1.tensor.dim);
    const a = p1.tensor.elem;
    const b = p2.tensor.elem;
    const c = p3.tensor.elem;
    for (let i = 0; i < nelem; i++) {
      c[i] = add(a[i], b[i]);
    }
    return p3;
  }
  function tensor_times_scalar(a, p2) {
    const { ndim, nelem } = a.tensor;
    const b = alloc_tensor(nelem);
    b.tensor.ndim = ndim;
    b.tensor.dim = Array.from(a.tensor.dim);
    b.tensor.elem = a.tensor.elem.map((a_i) => multiply(a_i, p2));
    return b;
  }
  function scalar_times_tensor(p1, a) {
    const { ndim, nelem } = a.tensor;
    const b = alloc_tensor(nelem);
    b.tensor.ndim = ndim;
    b.tensor.dim = Array.from(a.tensor.dim);
    b.tensor.elem = a.tensor.elem.map((a_i) => multiply(p1, a_i));
    return b;
  }
  function check_tensor_dimensions(p) {
    if (p.tensor.nelem !== p.tensor.elem.length) {
      console.log("something wrong in tensor dimensions");
      return breakpoint;
    }
  }
  function is_square_matrix(p) {
    return istensor(p) && p.tensor.ndim === 2 && p.tensor.dim[0] === p.tensor.dim[1];
  }
  function d_tensor_tensor(p1, p2) {
    const { ndim, nelem } = p1.tensor;
    if (ndim + 1 >= MAXDIM) {
      return makeList(symbol(DERIVATIVE), p1, p2);
    }
    const p3 = alloc_tensor(nelem * p2.tensor.nelem);
    p3.tensor.ndim = ndim + 1;
    p3.tensor.dim = [...p1.tensor.dim, p2.tensor.dim[0]];
    const a = p1.tensor.elem;
    const b = p2.tensor.elem;
    const c = p3.tensor.elem;
    for (let i = 0; i < nelem; i++) {
      for (let j = 0; j < p2.tensor.nelem; j++) {
        c[i * p2.tensor.nelem + j] = derivative(a[i], b[j]);
      }
    }
    return p3;
  }
  function d_scalar_tensor(p1, p2) {
    const p3 = alloc_tensor(p2.tensor.nelem);
    p3.tensor.ndim = 1;
    p3.tensor.dim[0] = p2.tensor.dim[0];
    p3.tensor.elem = p2.tensor.elem.map((a_i) => derivative(p1, a_i));
    return p3;
  }
  function d_tensor_scalar(p1, p2) {
    const p3 = alloc_tensor(p1.tensor.nelem);
    p3.tensor.ndim = p1.tensor.ndim;
    p3.tensor.dim = [...p1.tensor.dim];
    p3.tensor.elem = p1.tensor.elem.map((a_i) => derivative(a_i, p2));
    return p3;
  }
  function compare_tensors(p1, p2) {
    if (p1.tensor.ndim < p2.tensor.ndim) {
      return -1;
    }
    if (p1.tensor.ndim > p2.tensor.ndim) {
      return 1;
    }
    for (let i = 0; i < p1.tensor.ndim; i++) {
      if (p1.tensor.dim[i] < p2.tensor.dim[i]) {
        return -1;
      }
      if (p1.tensor.dim[i] > p2.tensor.dim[i]) {
        return 1;
      }
    }
    for (let i = 0; i < p1.tensor.nelem; i++) {
      if (equal(p1.tensor.elem[i], p2.tensor.elem[i])) {
        continue;
      }
      if (lessp(p1.tensor.elem[i], p2.tensor.elem[i])) {
        return -1;
      } else {
        return 1;
      }
    }
    return 0;
  }
  function power_tensor(p1, p2) {
    let k = p1.tensor.ndim - 1;
    if (p1.tensor.dim[0] !== p1.tensor.dim[k]) {
      return makeList(symbol(POWER), p1, p2);
    }
    let n = nativeInt(p2);
    if (isNaN(n)) {
      return makeList(symbol(POWER), p1, p2);
    }
    if (n === 0) {
      if (p1.tensor.ndim !== 2) {
        stop("power(tensor,0) with tensor rank not equal to 2");
      }
      n = p1.tensor.dim[0];
      p1 = alloc_tensor(n * n);
      p1.tensor.ndim = 2;
      p1.tensor.dim[0] = n;
      p1.tensor.dim[1] = n;
      for (let i = 0; i < n; i++) {
        p1.tensor.elem[n * i + i] = Constants.one;
      }
      check_tensor_dimensions(p1);
      return p1;
    }
    let p3 = p1;
    if (n < 0) {
      n = -n;
      p3 = inv(p3);
    }
    let prev = p3;
    for (let i = 1; i < n; i++) {
      prev = inner(prev, p3);
      if (isZeroAtomOrTensor(prev)) {
        break;
      }
    }
    return prev;
  }
  function copy_tensor(p1) {
    let p2 = alloc_tensor(p1.tensor.nelem);
    p2.tensor.ndim = p1.tensor.ndim;
    p2.tensor.dim = [...p1.tensor.dim];
    p2.tensor.elem = [...p1.tensor.elem];
    check_tensor_dimensions(p1);
    check_tensor_dimensions(p2);
    return p2;
  }
  function promote_tensor(p1) {
    if (!istensor(p1)) {
      return p1;
    }
    let p2 = p1.tensor.elem[0];
    if (p1.tensor.elem.some((elem2) => !compatible(p2, elem2))) {
      stop("Cannot promote tensor due to inconsistent tensor components.");
    }
    if (!istensor(p2)) {
      return p1;
    }
    const ndim = p1.tensor.ndim + p2.tensor.ndim;
    if (ndim > MAXDIM) {
      stop("tensor rank > " + MAXDIM);
    }
    const nelem = p1.tensor.nelem * p2.tensor.nelem;
    const p3 = alloc_tensor(nelem);
    p3.tensor.ndim = ndim;
    p3.tensor.dim = [...p1.tensor.dim, ...p2.tensor.dim];
    p3.tensor.elem = [].concat(...p1.tensor.elem.map((el) => el.tensor.elem));
    check_tensor_dimensions(p2);
    check_tensor_dimensions(p3);
    return p3;
  }
  function compatible(p, q) {
    if (!istensor(p) && !istensor(q)) {
      return true;
    }
    if (!istensor(p) || !istensor(q)) {
      return false;
    }
    if (p.tensor.ndim !== q.tensor.ndim) {
      return false;
    }
    for (let i = 0; i < p.tensor.ndim; i++) {
      if (p.tensor.dim[i] !== q.tensor.dim[i]) {
        return false;
      }
    }
    return true;
  }

  // bazel-out/k8-fastbuild/bin/runtime/alloc.js
  function alloc_tensor(nelem) {
    const p = new Tensor();
    for (let i = 0; i < nelem; i++) {
      p.tensor.elem[i] = Constants.zero;
    }
    check_tensor_dimensions(p);
    return p;
  }

  // bazel-out/k8-fastbuild/bin/sources/misc.js
  function zero_matrix(i, j) {
    const m = alloc_tensor(i * j);
    m.ndim = 2;
    m.dim[0] = i;
    m.dim[1] = j;
    return m;
  }
  function equal(p1, p2) {
    return cmp_expr(p1, p2) === 0;
  }
  function lessp(p1, p2) {
    return cmp_expr(p1, p2) < 0;
  }
  function sign(n) {
    if (n < 0) {
      return -1;
    } else if (n > 0) {
      return 1;
    } else {
      return 0;
    }
  }
  function cmp_expr(p1, p2) {
    let n = 0;
    if (p1 === p2) {
      return 0;
    }
    if (p1 === symbol(NIL)) {
      return -1;
    }
    if (p2 === symbol(NIL)) {
      return 1;
    }
    if (isNumericAtom(p1) && isNumericAtom(p2)) {
      return sign(compare_numbers(p1, p2));
    }
    if (isNumericAtom(p1)) {
      return -1;
    }
    if (isNumericAtom(p2)) {
      return 1;
    }
    if (isstr(p1) && isstr(p2)) {
      return sign(strcmp(p1.str, p2.str));
    }
    if (isstr(p1)) {
      return -1;
    }
    if (isstr(p2)) {
      return 1;
    }
    if (issymbol(p1) && issymbol(p2)) {
      return sign(strcmp(get_printname(p1), get_printname(p2)));
    }
    if (issymbol(p1)) {
      return -1;
    }
    if (issymbol(p2)) {
      return 1;
    }
    if (istensor(p1) && istensor(p2)) {
      return compare_tensors(p1, p2);
    }
    if (istensor(p1)) {
      return -1;
    }
    if (istensor(p2)) {
      return 1;
    }
    while (iscons(p1) && iscons(p2)) {
      n = cmp_expr(car(p1), car(p2));
      if (n !== 0) {
        return n;
      }
      p1 = cdr(p1);
      p2 = cdr(p2);
    }
    if (iscons(p2)) {
      return -1;
    }
    if (iscons(p1)) {
      return 1;
    }
    return 0;
  }
  function length(p) {
    const n = iscons(p) ? [...p].length : 0;
    return n;
  }
  function yyexpand(p1) {
    return doexpand(Eval, p1);
  }
  function exponential(p1) {
    return power(symbol(E), p1);
  }
  function square(p1) {
    return power(p1, integer(2));
  }
  function sort(arr) {
    arr.sort(cmp_expr);
  }

  // bazel-out/k8-fastbuild/bin/runtime/count.js
  var sum = (arr) => arr.reduce((a, b) => a + b, 0);
  function count(p) {
    let n;
    if (iscons(p)) {
      const items = [...p];
      n = sum(items.map(count)) + items.length;
    } else {
      n = 1;
    }
    return n;
  }
  function countOccurrencesOfSymbol(needle, p) {
    let n = 0;
    if (iscons(p)) {
      n = sum([...p].map((el) => countOccurrencesOfSymbol(needle, el)));
    } else if (equal(needle, p)) {
      n = 1;
    }
    return n;
  }
  function countsize(p) {
    let n = 0;
    if (istensor(p)) {
      for (let i = 0; i < p.tensor.nelem; i++) {
        n += count(p.tensor.elem[i]);
      }
    } else if (iscons(p)) {
      const items = [...p];
      n = sum(items.map(count)) + items.length;
    } else {
      n = 1;
    }
    return n;
  }

  // bazel-out/k8-fastbuild/bin/runtime/symbol.js
  function Eval_symbolsinfo() {
    const symbolsinfoToBePrinted = symbolsinfo();
    if (symbolsinfoToBePrinted !== "") {
      return new Str(symbolsinfoToBePrinted);
    } else {
      return symbol(NIL);
    }
  }
  function symbolsinfo() {
    return [...userScope.symbolinfo()].join("\n");
  }
  var Scope = class {
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
        const bindingi = (binding + "").substring(0, 4);
        yield `symbol: ${sym} size: ${countsize(binding)} value: ${bindingi}...`;
      }
    }
    clearRenamedVariablesToAvoidBindingToExternalScope() {
      var _a;
      for (const name of this.symbols.keys()) {
        if (name.indexOf("AVOID_BINDING_TO_EXTERNAL_SCOPE_VALUE") !== -1) {
          this.symbols.delete(name);
        }
      }
      for (const name of this.bindings.keys()) {
        if (name.indexOf("AVOID_BINDING_TO_EXTERNAL_SCOPE_VALUE") !== -1) {
          this.bindings.delete(name);
        }
      }
      (_a = this.parent) === null || _a === void 0 ? void 0 : _a.clearRenamedVariablesToAvoidBindingToExternalScope();
    }
  };
  var keywordScope = new Scope();
  var userScope = new Scope(keywordScope);
  function std_symbol(s, keyword) {
    const sym = keywordScope.getOrCreate(s);
    sym.latexPrint = s;
    sym.keyword = keyword;
  }
  function usr_symbol(s) {
    return userScope.getOrCreate(s);
  }
  function get_printname(p) {
    if (p.k !== SYM) {
      stop("symbol error");
    }
    return p.printname;
  }
  function set_binding(p, q) {
    if (p.k !== SYM) {
      stop("symbol error");
    }
    userScope.set(p, q);
  }
  function get_binding(p) {
    if (p.k !== SYM) {
      stop("symbol error");
    }
    return userScope.binding(p);
  }
  function is_usr_symbol(p) {
    if (p.k !== SYM) {
      return false;
    }
    return /^[abcdjnrstxyz]_?$/.test(p.printname) || !keywordScope.has(p);
  }
  function reset_symbols() {
    keywordScope = new Scope();
    userScope = new Scope(keywordScope);
  }
  function clear_symbols() {
    userScope = new Scope(keywordScope);
    keywordScope.clear();
  }
  function collectUserSymbols(p, accumulator) {
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
  function symbol(name) {
    return userScope.mustGet(name);
  }
  function iskeyword(p) {
    return issymbol(p) && p.keyword != null;
  }
  function clear_symbol(s) {
    userScope.delete(s);
  }

  // bazel-out/k8-fastbuild/bin/sources/print.js
  var power_str = "^";
  function Eval_print(p1) {
    defs.stringsEmittedByUserPrintouts += _print(cdr(p1), defs.printMode);
    return symbol(NIL);
  }
  function Eval_print2dascii(p1) {
    defs.stringsEmittedByUserPrintouts += _print(cdr(p1), PRINTMODE_2DASCII);
    return symbol(NIL);
  }
  function Eval_printcomputer(p1) {
    defs.stringsEmittedByUserPrintouts += _print(cdr(p1), PRINTMODE_COMPUTER);
    return symbol(NIL);
  }
  function Eval_printlatex(p1) {
    defs.stringsEmittedByUserPrintouts += _print(cdr(p1), PRINTMODE_LATEX);
    return symbol(NIL);
  }
  function Eval_printhuman(p1) {
    const original_test_flag = defs.test_flag;
    defs.test_flag = false;
    defs.stringsEmittedByUserPrintouts += _print(cdr(p1), PRINTMODE_HUMAN);
    defs.test_flag = original_test_flag;
    return symbol(NIL);
  }
  function Eval_printlist(p1) {
    const beenPrinted = _print(cdr(p1), PRINTMODE_LIST);
    defs.stringsEmittedByUserPrintouts += beenPrinted;
    return symbol(NIL);
  }
  function _print(p, passedPrintMode) {
    let accumulator = "";
    while (iscons(p)) {
      const p2 = Eval(car(p));
      const origPrintMode = defs.printMode;
      if (passedPrintMode === PRINTMODE_COMPUTER) {
        defs.printMode = PRINTMODE_COMPUTER;
        accumulator = printline(p2);
        rememberPrint(accumulator, LAST_FULL_PRINT);
      } else if (passedPrintMode === PRINTMODE_HUMAN) {
        defs.printMode = PRINTMODE_HUMAN;
        accumulator = printline(p2);
        rememberPrint(accumulator, LAST_PLAIN_PRINT);
      } else if (passedPrintMode === PRINTMODE_2DASCII) {
        defs.printMode = PRINTMODE_2DASCII;
        accumulator = print2dascii(p2);
        rememberPrint(accumulator, LAST_2DASCII_PRINT);
      } else if (passedPrintMode === PRINTMODE_LATEX) {
        defs.printMode = PRINTMODE_LATEX;
        accumulator = printline(p2);
        rememberPrint(accumulator, LAST_LATEX_PRINT);
      } else if (passedPrintMode === PRINTMODE_LIST) {
        defs.printMode = PRINTMODE_LIST;
        accumulator = print_list(p2);
        rememberPrint(accumulator, LAST_LIST_PRINT);
      }
      defs.printMode = origPrintMode;
      p = cdr(p);
    }
    if (DEBUG) {
      console.log(`emttedString from display: ${defs.stringsEmittedByUserPrintouts}`);
    }
    return accumulator;
  }
  function rememberPrint(theString, theTypeOfPrint) {
    const [, parsedString] = scan('"' + theString + '"');
    set_binding(symbol(theTypeOfPrint), parsedString);
  }
  function print_str(s) {
    if (DEBUG) {
      console.log(`emttedString from print_str: ${defs.stringsEmittedByUserPrintouts}`);
    }
    return s;
  }
  function print_char(c) {
    return c;
  }
  function collectLatexStringFromReturnValue(p) {
    const origPrintMode = defs.printMode;
    defs.printMode = PRINTMODE_LATEX;
    const originalCodeGen = defs.codeGen;
    defs.codeGen = false;
    let returnedString = print_expr(p);
    returnedString = returnedString.replace(/_/g, "\\_");
    defs.printMode = origPrintMode;
    defs.codeGen = originalCodeGen;
    if (DEBUG) {
      console.log(`emttedString from collectLatexStringFromReturnValue: ${defs.stringsEmittedByUserPrintouts}`);
    }
    return returnedString;
  }
  function printline(p) {
    let accumulator = "";
    accumulator += print_expr(p);
    return accumulator;
  }
  function print_base_of_denom(BASE) {
    let accumulator = "";
    if (isfraction(BASE) || isadd(BASE) || ismultiply(BASE) || ispower(BASE) || lessp(BASE, Constants.zero)) {
      accumulator += print_char("(");
      accumulator += print_expr(BASE);
      accumulator += print_char(")");
    } else {
      accumulator += print_expr(BASE);
    }
    return accumulator;
  }
  function print_expo_of_denom(EXPO) {
    let accumulator = "";
    if (isfraction(EXPO) || isadd(EXPO) || ismultiply(EXPO) || ispower(EXPO)) {
      accumulator += print_char("(");
      accumulator += print_expr(EXPO);
      accumulator += print_char(")");
    } else {
      accumulator += print_expr(EXPO);
    }
    return accumulator;
  }
  function print_denom(p, d) {
    let accumulator = "";
    const BASE = cadr(p);
    let EXPO = caddr(p);
    if (isminusone(EXPO)) {
      accumulator += print_base_of_denom(BASE);
      return accumulator;
    }
    if (d === 1) {
      accumulator += print_char("(");
    }
    EXPO = negate(EXPO);
    accumulator += print_power(BASE, EXPO);
    if (d === 1) {
      accumulator += print_char(")");
    }
    return accumulator;
  }
  function print_a_over_b(p) {
    let A, B;
    let accumulator = "";
    let flag2 = 0;
    let n = 0;
    let d = 0;
    let p1 = cdr(p);
    let p2 = car(p1);
    if (isrational(p2)) {
      A = absval(mp_numerator(p2));
      B = mp_denominator(p2);
      if (!isplusone(A)) {
        n++;
      }
      if (!isplusone(B)) {
        d++;
      }
      p1 = cdr(p1);
    } else {
      A = Constants.one;
      B = Constants.one;
    }
    while (iscons(p1)) {
      p2 = car(p1);
      if (is_denominator(p2)) {
        d++;
      } else {
        n++;
      }
      p1 = cdr(p1);
    }
    if (defs.printMode === PRINTMODE_LATEX) {
      accumulator += print_str("\\frac{");
    }
    if (n === 0) {
      accumulator += print_char("1");
    } else {
      flag2 = 0;
      p1 = cdr(p);
      if (isrational(car(p1))) {
        p1 = cdr(p1);
      }
      if (!isplusone(A)) {
        accumulator += print_factor(A);
        flag2 = 1;
      }
      while (iscons(p1)) {
        p2 = car(p1);
        if (!is_denominator(p2)) {
          if (flag2) {
            accumulator += print_multiply_sign();
          }
          accumulator += print_factor(p2);
          flag2 = 1;
        }
        p1 = cdr(p1);
      }
    }
    if (defs.printMode === PRINTMODE_LATEX) {
      accumulator += print_str("}{");
    } else if (defs.printMode === PRINTMODE_HUMAN && !defs.test_flag) {
      accumulator += print_str(" / ");
    } else {
      accumulator += print_str("/");
    }
    if (d > 1 && defs.printMode !== PRINTMODE_LATEX) {
      accumulator += print_char("(");
    }
    flag2 = 0;
    p1 = cdr(p);
    if (isrational(car(p1))) {
      p1 = cdr(p1);
    }
    if (!isplusone(B)) {
      accumulator += print_factor(B);
      flag2 = 1;
    }
    while (iscons(p1)) {
      p2 = car(p1);
      if (is_denominator(p2)) {
        if (flag2) {
          accumulator += print_multiply_sign();
        }
        accumulator += print_denom(p2, d);
        flag2 = 1;
      }
      p1 = cdr(p1);
    }
    if (d > 1 && defs.printMode !== PRINTMODE_LATEX) {
      accumulator += print_char(")");
    }
    if (defs.printMode === PRINTMODE_LATEX) {
      accumulator += print_str("}");
    }
    return accumulator;
  }
  function print_expr(p) {
    let accumulator = "";
    if (isadd(p)) {
      p = cdr(p);
      if (sign_of_term(car(p)) === "-") {
        accumulator += print_str("-");
      }
      accumulator += print_term(car(p));
      p = cdr(p);
      while (iscons(p)) {
        if (sign_of_term(car(p)) === "+") {
          if (defs.printMode === PRINTMODE_HUMAN && !defs.test_flag) {
            accumulator += print_str(" + ");
          } else {
            accumulator += print_str("+");
          }
        } else {
          if (defs.printMode === PRINTMODE_HUMAN && !defs.test_flag) {
            accumulator += print_str(" - ");
          } else {
            accumulator += print_str("-");
          }
        }
        accumulator += print_term(car(p));
        p = cdr(p);
      }
    } else {
      if (sign_of_term(p) === "-") {
        accumulator += print_str("-");
      }
      accumulator += print_term(p);
    }
    return accumulator;
  }
  function sign_of_term(p) {
    let accumulator = "";
    if (ismultiply(p) && isNumericAtom(cadr(p)) && lessp(cadr(p), Constants.zero)) {
      accumulator += "-";
    } else if (isNumericAtom(p) && lessp(p, Constants.zero)) {
      accumulator += "-";
    } else {
      accumulator += "+";
    }
    return accumulator;
  }
  function print_term(p) {
    let accumulator = "";
    if (ismultiply(p) && any_denominators(p)) {
      accumulator += print_a_over_b(p);
      return accumulator;
    }
    if (ismultiply(p)) {
      let denom;
      let origAccumulator;
      p = cdr(p);
      if (isminusone(car(p))) {
        p = cdr(p);
      }
      let previousFactorWasANumber = false;
      if (isNumericAtom(car(p))) {
        previousFactorWasANumber = true;
      }
      let numberOneOverSomething = false;
      if (defs.printMode === PRINTMODE_LATEX && iscons(cdr(p)) && isNumberOneOverSomething(car(p))) {
        numberOneOverSomething = true;
        denom = car(p).q.b.toString();
      }
      if (numberOneOverSomething) {
        origAccumulator = accumulator;
        accumulator = "";
      } else {
        accumulator += print_factor(car(p));
      }
      p = cdr(p);
      while (iscons(p)) {
        if (defs.printMode === PRINTMODE_LATEX) {
          if (previousFactorWasANumber) {
            if (caar(p) === symbol(POWER)) {
              if (isNumericAtom(car(cdr(car(p))))) {
                if (!isfraction(car(cdr(cdr(car(p)))))) {
                  accumulator += " \\cdot ";
                }
              }
            }
          }
        }
        accumulator += print_multiply_sign();
        accumulator += print_factor(car(p), false, true);
        previousFactorWasANumber = false;
        if (isNumericAtom(car(p))) {
          previousFactorWasANumber = true;
        }
        p = cdr(p);
      }
      if (numberOneOverSomething) {
        accumulator = origAccumulator + "\\frac{" + accumulator + "}{" + denom + "}";
      }
    } else {
      accumulator += print_factor(p);
    }
    return accumulator;
  }
  function print_subexpr(p) {
    let accumulator = "";
    accumulator += print_char("(");
    accumulator += print_expr(p);
    accumulator += print_char(")");
    return accumulator;
  }
  function print_factorial_function(p) {
    let accumulator = "";
    p = cadr(p);
    if (isfraction(p) || isadd(p) || ismultiply(p) || ispower(p) || isfactorial(p)) {
      accumulator += print_subexpr(p);
    } else {
      accumulator += print_expr(p);
    }
    accumulator += print_char("!");
    return accumulator;
  }
  function print_ABS_latex(p) {
    let accumulator = "";
    accumulator += print_str("\\left |");
    accumulator += print_expr(cadr(p));
    accumulator += print_str(" \\right |");
    return accumulator;
  }
  function print_BINOMIAL_latex(p) {
    let accumulator = "";
    accumulator += print_str("\\binom{");
    accumulator += print_expr(cadr(p));
    accumulator += print_str("}{");
    accumulator += print_expr(caddr(p));
    accumulator += print_str("} ");
    return accumulator;
  }
  function print_DOT_latex(p) {
    let accumulator = "";
    accumulator += print_expr(cadr(p));
    accumulator += print_str(" \\cdot ");
    accumulator += print_expr(caddr(p));
    return accumulator;
  }
  function print_DOT_codegen(p) {
    let accumulator = "dot(";
    accumulator += print_expr(cadr(p));
    accumulator += ", ";
    accumulator += print_expr(caddr(p));
    accumulator += ")";
    return accumulator;
  }
  function print_SIN_codegen(p) {
    let accumulator = "Math.sin(";
    accumulator += print_expr(cadr(p));
    accumulator += ")";
    return accumulator;
  }
  function print_COS_codegen(p) {
    let accumulator = "Math.cos(";
    accumulator += print_expr(cadr(p));
    accumulator += ")";
    return accumulator;
  }
  function print_TAN_codegen(p) {
    let accumulator = "Math.tan(";
    accumulator += print_expr(cadr(p));
    accumulator += ")";
    return accumulator;
  }
  function print_ARCSIN_codegen(p) {
    let accumulator = "Math.asin(";
    accumulator += print_expr(cadr(p));
    accumulator += ")";
    return accumulator;
  }
  function print_ARCCOS_codegen(p) {
    let accumulator = "Math.acos(";
    accumulator += print_expr(cadr(p));
    accumulator += ")";
    return accumulator;
  }
  function print_ARCTAN_codegen(p) {
    let accumulator = "Math.atan(";
    accumulator += print_expr(cadr(p));
    accumulator += ")";
    return accumulator;
  }
  function print_SQRT_latex(p) {
    let accumulator = "";
    accumulator += print_str("\\sqrt{");
    accumulator += print_expr(cadr(p));
    accumulator += print_str("} ");
    return accumulator;
  }
  function print_TRANSPOSE_latex(p) {
    let accumulator = "";
    accumulator += print_str("{");
    if (iscons(cadr(p))) {
      accumulator += print_str("(");
    }
    accumulator += print_expr(cadr(p));
    if (iscons(cadr(p))) {
      accumulator += print_str(")");
    }
    accumulator += print_str("}");
    accumulator += print_str("^T");
    return accumulator;
  }
  function print_TRANSPOSE_codegen(p) {
    let accumulator = "";
    accumulator += print_str("transpose(");
    accumulator += print_expr(cadr(p));
    accumulator += print_str(")");
    return accumulator;
  }
  function print_UNIT_codegen(p) {
    let accumulator = "";
    accumulator += print_str("identity(");
    accumulator += print_expr(cadr(p));
    accumulator += print_str(")");
    return accumulator;
  }
  function print_INV_latex(p) {
    let accumulator = "";
    accumulator += print_str("{");
    if (iscons(cadr(p))) {
      accumulator += print_str("(");
    }
    accumulator += print_expr(cadr(p));
    if (iscons(cadr(p))) {
      accumulator += print_str(")");
    }
    accumulator += print_str("}");
    accumulator += print_str("^{-1}");
    return accumulator;
  }
  function print_INV_codegen(p) {
    let accumulator = "";
    accumulator += print_str("inv(");
    accumulator += print_expr(cadr(p));
    accumulator += print_str(")");
    return accumulator;
  }
  function print_DEFINT_latex(p) {
    let accumulator = "";
    const functionBody = car(cdr(p));
    p = cdr(p);
    const originalIntegral = p;
    let numberOfIntegrals = 0;
    while (iscons(cdr(cdr(p)))) {
      numberOfIntegrals++;
      const theIntegral = cdr(cdr(p));
      accumulator += print_str("\\int^{");
      accumulator += print_expr(car(cdr(theIntegral)));
      accumulator += print_str("}_{");
      accumulator += print_expr(car(theIntegral));
      accumulator += print_str("} \\! ");
      p = cdr(theIntegral);
    }
    accumulator += print_expr(functionBody);
    accumulator += print_str(" \\,");
    p = originalIntegral;
    for (let i = 1; i <= numberOfIntegrals; i++) {
      const theVariable = cdr(p);
      accumulator += print_str(" \\mathrm{d} ");
      accumulator += print_expr(car(theVariable));
      if (i < numberOfIntegrals) {
        accumulator += print_str(" \\, ");
      }
      p = cdr(cdr(theVariable));
    }
    return accumulator;
  }
  function print_tensor(p) {
    let accumulator = "";
    accumulator += print_tensor_inner(p, 0, 0)[1];
    return accumulator;
  }
  function print_tensor_inner(p, j, k) {
    let accumulator = "";
    accumulator += print_str("[");
    if (j < p.tensor.ndim - 1) {
      for (let i = 0; i < p.tensor.dim[j]; i++) {
        let retString;
        [k, retString] = Array.from(print_tensor_inner(p, j + 1, k));
        accumulator += retString;
        if (i !== p.tensor.dim[j] - 1) {
          accumulator += print_str(",");
        }
      }
    } else {
      for (let i = 0; i < p.tensor.dim[j]; i++) {
        accumulator += print_expr(p.tensor.elem[k]);
        if (i !== p.tensor.dim[j] - 1) {
          accumulator += print_str(",");
        }
        k++;
      }
    }
    accumulator += print_str("]");
    return [k, accumulator];
  }
  function print_tensor_latex(p) {
    let accumulator = "";
    if (p.tensor.ndim <= 2) {
      accumulator += print_tensor_inner_latex(true, p, 0, 0)[1];
    }
    return accumulator;
  }
  function print_tensor_inner_latex(firstLevel, p, j, k) {
    let accumulator = "";
    if (firstLevel) {
      accumulator += "\\begin{bmatrix} ";
    }
    if (j < p.tensor.ndim - 1) {
      for (let i = 0; i < p.tensor.dim[j]; i++) {
        let retString;
        [k, retString] = Array.from(print_tensor_inner_latex(false, p, j + 1, k));
        accumulator += retString;
        if (i !== p.tensor.dim[j] - 1) {
          accumulator += print_str(" \\\\ ");
        }
      }
    } else {
      for (let i = 0; i < p.tensor.dim[j]; i++) {
        accumulator += print_expr(p.tensor.elem[k]);
        if (i !== p.tensor.dim[j] - 1) {
          accumulator += print_str(" & ");
        }
        k++;
      }
    }
    if (firstLevel) {
      accumulator += " \\end{bmatrix}";
    }
    return [k, accumulator];
  }
  function print_SUM_latex(p) {
    let accumulator = "\\sum_{";
    accumulator += print_expr(caddr(p));
    accumulator += "=";
    accumulator += print_expr(cadddr(p));
    accumulator += "}^{";
    accumulator += print_expr(caddddr(p));
    accumulator += "}{";
    accumulator += print_expr(cadr(p));
    accumulator += "}";
    return accumulator;
  }
  function print_SUM_codegen(p) {
    const body = cadr(p);
    const variable = caddr(p);
    const lowerlimit = cadddr(p);
    const upperlimit = caddddr(p);
    const accumulator = "(function(){ var " + variable + ";  var holderSum = 0;  var lowerlimit = " + print_expr(lowerlimit) + ";  var upperlimit = " + print_expr(upperlimit) + ";  for (" + variable + " = lowerlimit; " + variable + " < upperlimit; " + variable + "++) {    holderSum += " + print_expr(body) + "; }  return holderSum;})()";
    return accumulator;
  }
  function print_TEST_latex(p) {
    let accumulator = "\\left\\{ \\begin{array}{ll}";
    p = cdr(p);
    while (iscons(p)) {
      if (cdr(p) === symbol(NIL)) {
        accumulator += "{";
        accumulator += print_expr(car(p));
        accumulator += "} & otherwise ";
        accumulator += " \\\\\\\\";
        break;
      }
      accumulator += "{";
      accumulator += print_expr(cadr(p));
      accumulator += "} & if & ";
      accumulator += print_expr(car(p));
      accumulator += " \\\\\\\\";
      p = cddr(p);
    }
    accumulator = accumulator.substring(0, accumulator.length - 4);
    return accumulator += "\\end{array} \\right.";
  }
  function print_TEST_codegen(p) {
    let accumulator = "(function(){";
    p = cdr(p);
    let howManyIfs = 0;
    while (iscons(p)) {
      if (cdr(p) === symbol(NIL)) {
        accumulator += "else {";
        accumulator += "return (" + print_expr(car(p)) + ");";
        accumulator += "}";
        break;
      }
      if (howManyIfs) {
        accumulator += " else ";
      }
      accumulator += "if (" + print_expr(car(p)) + "){";
      accumulator += "return (" + print_expr(cadr(p)) + ");";
      accumulator += "}";
      howManyIfs++;
      p = cddr(p);
    }
    accumulator += "})()";
    return accumulator;
  }
  function print_TESTLT_latex(p) {
    let accumulator = "{";
    accumulator += print_expr(cadr(p));
    accumulator += "}";
    accumulator += " < ";
    accumulator += "{";
    accumulator += print_expr(caddr(p));
    return accumulator += "}";
  }
  function print_TESTLE_latex(p) {
    let accumulator = "{";
    accumulator += print_expr(cadr(p));
    accumulator += "}";
    accumulator += " \\leq ";
    accumulator += "{";
    accumulator += print_expr(caddr(p));
    return accumulator += "}";
  }
  function print_TESTGT_latex(p) {
    let accumulator = "{";
    accumulator += print_expr(cadr(p));
    accumulator += "}";
    accumulator += " > ";
    accumulator += "{";
    accumulator += print_expr(caddr(p));
    return accumulator += "}";
  }
  function print_TESTGE_latex(p) {
    let accumulator = "{";
    accumulator += print_expr(cadr(p));
    accumulator += "}";
    accumulator += " \\geq ";
    accumulator += "{";
    accumulator += print_expr(caddr(p));
    return accumulator += "}";
  }
  function print_TESTEQ_latex(p) {
    let accumulator = "{";
    accumulator += print_expr(cadr(p));
    accumulator += "}";
    accumulator += " = ";
    accumulator += "{";
    accumulator += print_expr(caddr(p));
    return accumulator += "}";
  }
  function print_FOR_codegen(p) {
    const body = cadr(p);
    const variable = caddr(p);
    const lowerlimit = cadddr(p);
    const upperlimit = caddddr(p);
    const accumulator = "(function(){ var " + variable + ";  var lowerlimit = " + print_expr(lowerlimit) + ";  var upperlimit = " + print_expr(upperlimit) + ";  for (" + variable + " = lowerlimit; " + variable + " < upperlimit; " + variable + "++) {    " + print_expr(body) + " } })()";
    return accumulator;
  }
  function print_DO_codegen(p) {
    let accumulator = "";
    p = cdr(p);
    while (iscons(p)) {
      accumulator += print_expr(car(p));
      p = cdr(p);
    }
    return accumulator;
  }
  function print_SETQ_codegen(p) {
    let accumulator = "";
    accumulator += print_expr(cadr(p));
    accumulator += " = ";
    accumulator += print_expr(caddr(p));
    accumulator += "; ";
    return accumulator;
  }
  function print_PRODUCT_latex(p) {
    let accumulator = "\\prod_{";
    accumulator += print_expr(caddr(p));
    accumulator += "=";
    accumulator += print_expr(cadddr(p));
    accumulator += "}^{";
    accumulator += print_expr(caddddr(p));
    accumulator += "}{";
    accumulator += print_expr(cadr(p));
    accumulator += "}";
    return accumulator;
  }
  function print_PRODUCT_codegen(p) {
    const body = cadr(p);
    const variable = caddr(p);
    const lowerlimit = cadddr(p);
    const upperlimit = caddddr(p);
    const accumulator = "(function(){ var " + variable + ";  var holderProduct = 1;  var lowerlimit = " + print_expr(lowerlimit) + ";  var upperlimit = " + print_expr(upperlimit) + ";  for (" + variable + " = lowerlimit; " + variable + " < upperlimit; " + variable + "++) {    holderProduct *= " + print_expr(body) + "; }  return holderProduct;})()";
    return accumulator;
  }
  function print_power(base, exponent) {
    let accumulator = "";
    if (DEBUG) {
      console.log("power base: " + base + "  exponent: " + exponent);
    }
    if (isoneovertwo(exponent)) {
      if (equaln(base, 2)) {
        if (defs.codeGen) {
          accumulator += print_str("Math.SQRT2");
          return accumulator;
        }
      } else {
        if (defs.printMode === PRINTMODE_LATEX) {
          accumulator += print_str("\\sqrt{");
          accumulator += print_expr(base);
          accumulator += print_str("}");
          return accumulator;
        } else if (defs.codeGen) {
          accumulator += print_str("Math.sqrt(");
          accumulator += print_expr(base);
          accumulator += print_str(")");
          return accumulator;
        }
      }
    }
    if (equaln(get_binding(symbol(PRINT_LEAVE_E_ALONE)), 1) && base === symbol(E)) {
      if (defs.codeGen) {
        accumulator += print_str("Math.exp(");
        accumulator += print_expo_of_denom(exponent);
        accumulator += print_str(")");
        return accumulator;
      }
      if (defs.printMode === PRINTMODE_LATEX) {
        accumulator += print_str("e^{");
        accumulator += print_expr(exponent);
        accumulator += print_str("}");
      } else {
        accumulator += print_str("exp(");
        accumulator += print_expr(exponent);
        accumulator += print_str(")");
      }
      return accumulator;
    }
    if (defs.codeGen) {
      accumulator += print_str("Math.pow(");
      accumulator += print_base_of_denom(base);
      accumulator += print_str(", ");
      accumulator += print_expo_of_denom(exponent);
      accumulator += print_str(")");
      return accumulator;
    }
    if (equaln(get_binding(symbol(PRINT_LEAVE_X_ALONE)), 0) || base.printname !== "x") {
      if (base !== symbol(E)) {
        if (isminusone(exponent)) {
          if (defs.printMode === PRINTMODE_LATEX) {
            accumulator += print_str("\\frac{1}{");
          } else if (defs.printMode === PRINTMODE_HUMAN && !defs.test_flag) {
            accumulator += print_str("1 / ");
          } else {
            accumulator += print_str("1/");
          }
          if (iscons(base) && defs.printMode !== PRINTMODE_LATEX) {
            accumulator += print_str("(");
            accumulator += print_expr(base);
            accumulator += print_str(")");
          } else {
            accumulator += print_expr(base);
          }
          if (defs.printMode === PRINTMODE_LATEX) {
            accumulator += print_str("}");
          }
          return accumulator;
        }
        if (isnegativeterm(exponent)) {
          if (defs.printMode === PRINTMODE_LATEX) {
            accumulator += print_str("\\frac{1}{");
          } else if (defs.printMode === PRINTMODE_HUMAN && !defs.test_flag) {
            accumulator += print_str("1 / ");
          } else {
            accumulator += print_str("1/");
          }
          const newExponent = multiply(exponent, Constants.negOne);
          if (iscons(base) && defs.printMode !== PRINTMODE_LATEX) {
            accumulator += print_str("(");
            accumulator += print_power(base, newExponent);
            accumulator += print_str(")");
          } else {
            accumulator += print_power(base, newExponent);
          }
          if (defs.printMode === PRINTMODE_LATEX) {
            accumulator += print_str("}");
          }
          return accumulator;
        }
      }
      if (isfraction(exponent) && defs.printMode === PRINTMODE_LATEX) {
        accumulator += print_str("\\sqrt");
        const denomExponent = denominator(exponent);
        if (!isplustwo(denomExponent)) {
          accumulator += print_str("[");
          accumulator += print_expr(denomExponent);
          accumulator += print_str("]");
        }
        accumulator += print_str("{");
        exponent = numerator(exponent);
        accumulator += print_power(base, exponent);
        accumulator += print_str("}");
        return accumulator;
      }
    }
    if (defs.printMode === PRINTMODE_LATEX && isplusone(exponent)) {
      accumulator += print_expr(base);
    } else {
      if (isadd(base) || isnegativenumber(base)) {
        accumulator += print_str("(");
        accumulator += print_expr(base);
        accumulator += print_str(")");
      } else if (ismultiply(base) || ispower(base)) {
        if (defs.printMode !== PRINTMODE_LATEX) {
          accumulator += print_str("(");
        }
        accumulator += print_factor(base, true);
        if (defs.printMode !== PRINTMODE_LATEX) {
          accumulator += print_str(")");
        }
      } else if (isNumericAtom(base) && (lessp(base, Constants.zero) || isfraction(base))) {
        accumulator += print_str("(");
        accumulator += print_factor(base);
        accumulator += print_str(")");
      } else {
        accumulator += print_factor(base);
      }
      if (defs.printMode === PRINTMODE_HUMAN && !defs.test_flag) {
        accumulator += print_str(power_str);
      } else {
        accumulator += print_str("^");
      }
      if (defs.printMode === PRINTMODE_LATEX) {
        if (print_expr(exponent).length > 1) {
          accumulator += print_str("{");
          accumulator += print_expr(exponent);
          accumulator += print_str("}");
        } else {
          accumulator += print_expr(exponent);
        }
      } else if (iscons(exponent) || isfraction(exponent) || isNumericAtom(exponent) && lessp(exponent, Constants.zero)) {
        accumulator += print_str("(");
        accumulator += print_expr(exponent);
        accumulator += print_str(")");
      } else {
        accumulator += print_factor(exponent);
      }
    }
    return accumulator;
  }
  function print_index_function(p) {
    let accumulator = "";
    p = cdr(p);
    if (caar(p) === symbol(ADD) || caar(p) === symbol(MULTIPLY) || caar(p) === symbol(POWER) || caar(p) === symbol(FACTORIAL)) {
      accumulator += print_subexpr(car(p));
    } else {
      accumulator += print_expr(car(p));
    }
    accumulator += print_str("[");
    p = cdr(p);
    if (iscons(p)) {
      accumulator += print_expr(car(p));
      p = cdr(p);
      while (iscons(p)) {
        accumulator += print_str(",");
        accumulator += print_expr(car(p));
        p = cdr(p);
      }
    }
    accumulator += print_str("]");
    return accumulator;
  }
  function print_factor(p, omitParens = false, pastFirstFactor = false) {
    let accumulator = "";
    if (isNumericAtom(p)) {
      if (pastFirstFactor && lessp(p, Constants.zero)) {
        accumulator += "(";
      }
      accumulator += print_number(p, pastFirstFactor);
      if (pastFirstFactor && lessp(p, Constants.zero)) {
        accumulator += ")";
      }
      return accumulator;
    }
    if (isstr(p)) {
      accumulator += print_str('"');
      accumulator += print_str(p.str);
      accumulator += print_str('"');
      return accumulator;
    }
    if (istensor(p)) {
      if (defs.printMode === PRINTMODE_LATEX) {
        accumulator += print_tensor_latex(p);
      } else {
        accumulator += print_tensor(p);
      }
      return accumulator;
    }
    if (ismultiply(p)) {
      if (!omitParens) {
        if (sign_of_term(p) === "-" || defs.printMode !== PRINTMODE_LATEX) {
          if (defs.printMode === PRINTMODE_LATEX) {
            accumulator += print_str(" \\left (");
          } else {
            accumulator += print_str("(");
          }
        }
      }
      accumulator += print_expr(p);
      if (!omitParens) {
        if (sign_of_term(p) === "-" || defs.printMode !== PRINTMODE_LATEX) {
          if (defs.printMode === PRINTMODE_LATEX) {
            accumulator += print_str(" \\right ) ");
          } else {
            accumulator += print_str(")");
          }
        }
      }
      return accumulator;
    } else if (isadd(p)) {
      if (!omitParens) {
        accumulator += print_str("(");
      }
      accumulator += print_expr(p);
      if (!omitParens) {
        accumulator += print_str(")");
      }
      return accumulator;
    }
    if (ispower(p)) {
      const base = cadr(p);
      const exponent = caddr(p);
      accumulator += print_power(base, exponent);
      return accumulator;
    }
    if (car(p) === symbol(FUNCTION)) {
      const fbody = cadr(p);
      if (!defs.codeGen) {
        const parameters = caddr(p);
        accumulator += print_str("function ");
        if (DEBUG) {
          console.log(`emittedString from print_factor ${defs.stringsEmittedByUserPrintouts}`);
        }
        const returned = print_list(parameters);
        accumulator += returned;
        accumulator += print_str(" -> ");
      }
      accumulator += print_expr(fbody);
      return accumulator;
    }
    if (car(p) === symbol(PATTERN)) {
      accumulator += print_expr(caadr(p));
      if (defs.printMode === PRINTMODE_LATEX) {
        accumulator += print_str(" \\rightarrow ");
      } else {
        if (defs.printMode === PRINTMODE_HUMAN && !defs.test_flag) {
          accumulator += print_str(" -> ");
        } else {
          accumulator += print_str("->");
        }
      }
      accumulator += print_expr(car(cdr(cadr(p))));
      return accumulator;
    }
    if (car(p) === symbol(INDEX) && issymbol(cadr(p))) {
      accumulator += print_index_function(p);
      return accumulator;
    }
    if (isfactorial(p)) {
      accumulator += print_factorial_function(p);
      return accumulator;
    } else if (car(p) === symbol(ABS) && defs.printMode === PRINTMODE_LATEX) {
      accumulator += print_ABS_latex(p);
      return accumulator;
    } else if (car(p) === symbol(SQRT) && defs.printMode === PRINTMODE_LATEX) {
      accumulator += print_SQRT_latex(p);
      return accumulator;
    } else if (isfactorial(p)) {
      if (defs.printMode === PRINTMODE_LATEX) {
        accumulator += print_TRANSPOSE_latex(p);
        return accumulator;
      } else if (defs.codeGen) {
        accumulator += print_TRANSPOSE_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(UNIT)) {
      if (defs.codeGen) {
        accumulator += print_UNIT_codegen(p);
        return accumulator;
      }
    } else if (isinv(p)) {
      if (defs.printMode === PRINTMODE_LATEX) {
        accumulator += print_INV_latex(p);
        return accumulator;
      } else if (defs.codeGen) {
        accumulator += print_INV_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(BINOMIAL) && defs.printMode === PRINTMODE_LATEX) {
      accumulator += print_BINOMIAL_latex(p);
      return accumulator;
    } else if (car(p) === symbol(DEFINT) && defs.printMode === PRINTMODE_LATEX) {
      accumulator += print_DEFINT_latex(p);
      return accumulator;
    } else if (isinnerordot(p)) {
      if (defs.printMode === PRINTMODE_LATEX) {
        accumulator += print_DOT_latex(p);
        return accumulator;
      } else if (defs.codeGen) {
        accumulator += print_DOT_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(SIN)) {
      if (defs.codeGen) {
        accumulator += print_SIN_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(COS)) {
      if (defs.codeGen) {
        accumulator += print_COS_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(TAN)) {
      if (defs.codeGen) {
        accumulator += print_TAN_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(ARCSIN)) {
      if (defs.codeGen) {
        accumulator += print_ARCSIN_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(ARCCOS)) {
      if (defs.codeGen) {
        accumulator += print_ARCCOS_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(ARCTAN)) {
      if (defs.codeGen) {
        accumulator += print_ARCTAN_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(SUM)) {
      if (defs.printMode === PRINTMODE_LATEX) {
        accumulator += print_SUM_latex(p);
        return accumulator;
      } else if (defs.codeGen) {
        accumulator += print_SUM_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(PRODUCT)) {
      if (defs.printMode === PRINTMODE_LATEX) {
        accumulator += print_PRODUCT_latex(p);
        return accumulator;
      } else if (defs.codeGen) {
        accumulator += print_PRODUCT_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(FOR)) {
      if (defs.codeGen) {
        accumulator += print_FOR_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(DO)) {
      if (defs.codeGen) {
        accumulator += print_DO_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(TEST)) {
      if (defs.codeGen) {
        accumulator += print_TEST_codegen(p);
        return accumulator;
      }
      if (defs.printMode === PRINTMODE_LATEX) {
        accumulator += print_TEST_latex(p);
        return accumulator;
      }
    } else if (car(p) === symbol(TESTLT)) {
      if (defs.codeGen) {
        accumulator += "((" + print_expr(cadr(p)) + ") < (" + print_expr(caddr(p)) + "))";
        return accumulator;
      }
      if (defs.printMode === PRINTMODE_LATEX) {
        accumulator += print_TESTLT_latex(p);
        return accumulator;
      }
    } else if (car(p) === symbol(TESTLE)) {
      if (defs.codeGen) {
        accumulator += "((" + print_expr(cadr(p)) + ") <= (" + print_expr(caddr(p)) + "))";
        return accumulator;
      }
      if (defs.printMode === PRINTMODE_LATEX) {
        accumulator += print_TESTLE_latex(p);
        return accumulator;
      }
    } else if (car(p) === symbol(TESTGT)) {
      if (defs.codeGen) {
        accumulator += "((" + print_expr(cadr(p)) + ") > (" + print_expr(caddr(p)) + "))";
        return accumulator;
      }
      if (defs.printMode === PRINTMODE_LATEX) {
        accumulator += print_TESTGT_latex(p);
        return accumulator;
      }
    } else if (car(p) === symbol(TESTGE)) {
      if (defs.codeGen) {
        accumulator += "((" + print_expr(cadr(p)) + ") >= (" + print_expr(caddr(p)) + "))";
        return accumulator;
      }
      if (defs.printMode === PRINTMODE_LATEX) {
        accumulator += print_TESTGE_latex(p);
        return accumulator;
      }
    } else if (car(p) === symbol(TESTEQ)) {
      if (defs.codeGen) {
        accumulator += "((" + print_expr(cadr(p)) + ") === (" + print_expr(caddr(p)) + "))";
        return accumulator;
      }
      if (defs.printMode === PRINTMODE_LATEX) {
        accumulator += print_TESTEQ_latex(p);
        return accumulator;
      }
    } else if (car(p) === symbol(FLOOR)) {
      if (defs.codeGen) {
        accumulator += "Math.floor(" + print_expr(cadr(p)) + ")";
        return accumulator;
      }
      if (defs.printMode === PRINTMODE_LATEX) {
        accumulator += " \\lfloor {" + print_expr(cadr(p)) + "} \\rfloor ";
        return accumulator;
      }
    } else if (car(p) === symbol(CEILING)) {
      if (defs.codeGen) {
        accumulator += "Math.ceiling(" + print_expr(cadr(p)) + ")";
        return accumulator;
      }
      if (defs.printMode === PRINTMODE_LATEX) {
        accumulator += " \\lceil {" + print_expr(cadr(p)) + "} \\rceil ";
        return accumulator;
      }
    } else if (car(p) === symbol(ROUND)) {
      if (defs.codeGen) {
        accumulator += "Math.round(" + print_expr(cadr(p)) + ")";
        return accumulator;
      }
    } else if (car(p) === symbol(SETQ)) {
      if (defs.codeGen) {
        accumulator += print_SETQ_codegen(p);
        return accumulator;
      } else {
        accumulator += print_expr(cadr(p));
        accumulator += print_str("=");
        accumulator += print_expr(caddr(p));
        return accumulator;
      }
    }
    if (iscons(p)) {
      accumulator += print_factor(car(p));
      p = cdr(p);
      if (!omitParens) {
        accumulator += print_str("(");
      }
      if (iscons(p)) {
        accumulator += print_expr(car(p));
        p = cdr(p);
        while (iscons(p)) {
          accumulator += print_str(",");
          accumulator += print_expr(car(p));
          p = cdr(p);
        }
      }
      if (!omitParens) {
        accumulator += print_str(")");
      }
      return accumulator;
    }
    if (p === symbol(DERIVATIVE)) {
      accumulator += print_char("d");
    } else if (p === symbol(E)) {
      if (defs.codeGen) {
        accumulator += print_str("Math.E");
      } else {
        accumulator += print_str("e");
      }
    } else if (p === symbol(PI)) {
      if (defs.printMode === PRINTMODE_LATEX) {
        accumulator += print_str("\\pi");
      } else {
        accumulator += print_str("pi");
      }
    } else {
      accumulator += print_str(get_printname(p));
    }
    return accumulator;
  }
  function print_list(p) {
    let accumulator = "";
    switch (p.k) {
      case CONS:
        accumulator += "(";
        accumulator += print_list(car(p));
        if (p === cdr(p)) {
          console.log("oh no recursive!");
          breakpoint;
        }
        p = cdr(p);
        while (iscons(p)) {
          accumulator += " ";
          accumulator += print_list(car(p));
          p = cdr(p);
          if (p === cdr(p) && p !== symbol(NIL)) {
            console.log("oh no recursive!");
            breakpoint;
          }
        }
        if (p !== symbol(NIL)) {
          accumulator += " . ";
          accumulator += print_list(p);
        }
        accumulator += ")";
        break;
      case STR:
        accumulator += p.str;
        break;
      case NUM:
      case DOUBLE:
        accumulator += print_number(p, true);
        break;
      case SYM:
        accumulator += get_printname(p);
        break;
      default:
        accumulator += "<tensor>";
    }
    return accumulator;
  }
  function print_multiply_sign() {
    let accumulator = "";
    if (defs.printMode === PRINTMODE_LATEX) {
      return accumulator;
    }
    if (defs.printMode === PRINTMODE_HUMAN && !defs.test_flag && !defs.codeGen) {
      accumulator += print_str(" ");
    } else {
      accumulator += print_str("*");
    }
    return accumulator;
  }
  function is_denominator(p) {
    return ispower(p) && cadr(p) !== symbol(E) && isnegativeterm(caddr(p));
  }
  function any_denominators(p) {
    p = cdr(p);
    while (iscons(p)) {
      const q = car(p);
      if (is_denominator(q)) {
        return true;
      }
      p = cdr(p);
    }
    return false;
  }

  // bazel-out/k8-fastbuild/bin/runtime/defs.js
  function breakpoint() {
  }
  var version = "2.0.1";
  var DEBUG = false;
  var PRINTOUTRESULT = false;
  var PRINTMODE_LATEX = "PRINTMODE_LATEX";
  var PRINTMODE_2DASCII = "PRINTMODE_2DASCII";
  var PRINTMODE_COMPUTER = "PRINTMODE_COMPUTER";
  var PRINTMODE_HUMAN = "PRINTMODE_HUMAN";
  var PRINTMODE_LIST = "PRINTMODE_LIST";
  var Defs = class {
    constructor() {
      this.printMode = PRINTMODE_COMPUTER;
      this.recursionLevelNestedRadicalsRemoval = 0;
      this.errorMessage = "";
      this.symbolsDependencies = {};
      this.symbolsHavingReassignments = [];
      this.symbolsInExpressionsWithoutAssignments = [];
      this.patternHasBeenFound = false;
      this.inited = false;
      this.chainOfUserSymbolsNotFunctionsBeingEvaluated = [];
      this.stringsEmittedByUserPrintouts = "";
      this.called_from_Algebra_block = false;
      this.expanding = false;
      this.evaluatingAsFloats = false;
      this.evaluatingPolar = false;
      this.esc_flag = false;
      this.trigmode = 0;
      this.out_count = 0;
      this.test_flag = false;
      this.codeGen = false;
      this.userSimplificationsInListForm = [];
      this.userSimplificationsInStringForm = [];
      this.fullDoubleOutput = false;
    }
  };
  var defs = new Defs();
  var dontCreateNewRadicalsInDenominatorWhenEvalingMultiplication = true;
  var do_simplify_nested_radicals = true;
  var avoidCalculatingPowersIntoArctans = true;
  var BaseAtom = class {
    toString() {
      return print_expr(this);
    }
    toLatexString() {
      return collectLatexStringFromReturnValue(this);
    }
  };
  var Cons = class extends BaseAtom {
    constructor(car2, cdr2) {
      super();
      this.k = CONS;
      this.cons = { car: car2, cdr: cdr2 };
    }
    *[Symbol.iterator]() {
      let u = this;
      while (iscons(u)) {
        yield car(u);
        u = cdr(u);
      }
    }
    tail() {
      if (iscons(this.cons.cdr)) {
        return [...this.cons.cdr];
      }
      return [];
    }
    map(f) {
      const a = car(this);
      let b = cdr(this);
      if (iscons(b)) {
        b = b.map(f);
      }
      return new Cons(f(a), b);
    }
  };
  var Num = class extends BaseAtom {
    constructor(a, b = import_big_integer7.default.one) {
      super();
      this.a = a;
      this.b = b;
      this.q = this;
      this.k = NUM;
    }
  };
  var Double = class extends BaseAtom {
    constructor(d) {
      super();
      this.d = d;
      this.k = DOUBLE;
    }
  };
  var Str = class extends BaseAtom {
    constructor(str) {
      super();
      this.str = str;
      this.k = STR;
    }
  };
  var Tensor = class extends BaseAtom {
    constructor() {
      super(...arguments);
      this.tensor = this;
      this.k = TENSOR;
      this.ndim = 0;
      this.dim = [];
      this.elem = [];
    }
    get nelem() {
      return this.elem.length;
    }
  };
  var Sym = class extends BaseAtom {
    constructor(printname) {
      super();
      this.printname = printname;
      this.k = SYM;
    }
  };
  var CONS = 0;
  var NUM = 1;
  var DOUBLE = 2;
  var STR = 3;
  var TENSOR = 4;
  var SYM = 5;
  var ABS = "abs";
  var ADD = "add";
  var ADJ = "adj";
  var AND = "and";
  var APPROXRATIO = "approxratio";
  var ARCCOS = "arccos";
  var ARCCOSH = "arccosh";
  var ARCSIN = "arcsin";
  var ARCSINH = "arcsinh";
  var ARCTAN = "arctan";
  var ARCTANH = "arctanh";
  var ARG = "arg";
  var ATOMIZE = "atomize";
  var BESSELJ = "besselj";
  var BESSELY = "bessely";
  var BINDING = "binding";
  var BINOMIAL = "binomial";
  var CEILING = "ceiling";
  var CHECK = "check";
  var CHOOSE = "choose";
  var CIRCEXP = "circexp";
  var CLEAR = "clear";
  var CLEARALL = "clearall";
  var CLEARPATTERNS = "clearpatterns";
  var CLOCK = "clock";
  var COEFF = "coeff";
  var COFACTOR = "cofactor";
  var CONDENSE = "condense";
  var CONJ = "conj";
  var CONTRACT = "contract";
  var COS = "cos";
  var COSH = "cosh";
  var DECOMP = "decomp";
  var DEFINT = "defint";
  var DEGREE = "deg";
  var DENOMINATOR = "denominator";
  var DERIVATIVE = "derivative";
  var DET = "det";
  var DIM = "dim";
  var DIRAC = "dirac";
  var DIVISORS = "divisors";
  var DO = "do";
  var DOT = "dot";
  var DRAW = "draw";
  var DSOLVE = "dsolve";
  var EIGEN = "eigen";
  var EIGENVAL = "eigenval";
  var EIGENVEC = "eigenvec";
  var ERF = "erf";
  var ERFC = "erfc";
  var EVAL = "eval";
  var EXP = "exp";
  var EXPAND = "expand";
  var EXPCOS = "expcos";
  var EXPSIN = "expsin";
  var FACTOR = "factor";
  var FACTORIAL = "factorial";
  var FACTORPOLY = "factorpoly";
  var FILTER = "filter";
  var FLOATF = "float";
  var FLOOR = "floor";
  var FOR = "for";
  var FUNCTION = "function";
  var GAMMA = "Gamma";
  var GCD = "gcd";
  var HERMITE = "hermite";
  var HILBERT = "hilbert";
  var IMAG = "imag";
  var INDEX = "component";
  var INNER = "inner";
  var INTEGRAL = "integral";
  var INV = "inv";
  var INVG = "invg";
  var ISINTEGER = "isinteger";
  var ISPRIME = "isprime";
  var LAGUERRE = "laguerre";
  var LCM = "lcm";
  var LEADING = "leading";
  var LEGENDRE = "legendre";
  var LOG = "log";
  var LOOKUP = "lookup";
  var MOD = "mod";
  var MULTIPLY = "multiply";
  var NOT = "not";
  var NROOTS = "nroots";
  var NUMBER = "number";
  var NUMERATOR = "numerator";
  var OPERATOR = "operator";
  var OR = "or";
  var OUTER = "outer";
  var PATTERN = "pattern";
  var PATTERNSINFO = "patternsinfo";
  var POLAR = "polar";
  var POWER = "power";
  var PRIME = "prime";
  var PRINT_LEAVE_E_ALONE = "printLeaveEAlone";
  var PRINT_LEAVE_X_ALONE = "printLeaveXAlone";
  var PRINT = "print";
  var PRINT2DASCII = "print2dascii";
  var PRINTFULL = "printcomputer";
  var PRINTLATEX = "printlatex";
  var PRINTLIST = "printlist";
  var PRINTPLAIN = "printhuman";
  var PRODUCT = "product";
  var QUOTE = "quote";
  var QUOTIENT = "quotient";
  var RANK = "rank";
  var RATIONALIZE = "rationalize";
  var REAL = "real";
  var ROUND = "round";
  var YYRECT = "rect";
  var ROOTS = "roots";
  var SETQ = "equals";
  var SGN = "sgn";
  var SILENTPATTERN = "silentpattern";
  var SIMPLIFY = "simplify";
  var SIN = "sin";
  var SINH = "sinh";
  var SHAPE = "shape";
  var SQRT = "sqrt";
  var STOP = "stop";
  var SUBST = "subst";
  var SUM = "sum";
  var SYMBOLSINFO = "symbolsinfo";
  var TAN = "tan";
  var TANH = "tanh";
  var TAYLOR = "taylor";
  var TEST = "test";
  var TESTEQ = "testeq";
  var TESTGE = "testge";
  var TESTGT = "testgt";
  var TESTLE = "testle";
  var TESTLT = "testlt";
  var TRANSPOSE = "transpose";
  var UNIT = "unit";
  var ZERO = "zero";
  var NIL = "nil";
  var LAST = "last";
  var LAST_PRINT = "lastprint";
  var LAST_2DASCII_PRINT = "last2dasciiprint";
  var LAST_FULL_PRINT = "lastfullprint";
  var LAST_LATEX_PRINT = "lastlatexprint";
  var LAST_LIST_PRINT = "lastlistprint";
  var LAST_PLAIN_PRINT = "lastplainprint";
  var AUTOEXPAND = "autoexpand";
  var BAKE = "bake";
  var ASSUME_REAL_VARIABLES = "assumeRealVariables";
  var TRACE = "trace";
  var FORCE_FIXED_PRINTOUT = "forceFixedPrintout";
  var MAX_FIXED_PRINTOUT_DIGITS = "maxFixedPrintoutDigits";
  var YYE = "~";
  var DRAWX = "$DRAWX";
  var METAA = "$METAA";
  var METAB = "$METAB";
  var METAX = "$METAX";
  var SECRETX = "$SECRETX";
  var VERSION = "version";
  var PI = "pi";
  var SYMBOL_A = "a";
  var SYMBOL_B = "b";
  var SYMBOL_C = "c";
  var SYMBOL_D = "d";
  var SYMBOL_I = "i";
  var SYMBOL_J = "j";
  var SYMBOL_N = "n";
  var SYMBOL_R = "r";
  var SYMBOL_S = "s";
  var SYMBOL_T = "t";
  var SYMBOL_X = "x";
  var SYMBOL_Y = "y";
  var SYMBOL_Z = "z";
  var SYMBOL_IDENTITY_MATRIX = "I";
  var SYMBOL_A_UNDERSCORE = "a_";
  var SYMBOL_B_UNDERSCORE = "b_";
  var SYMBOL_X_UNDERSCORE = "x_";
  var C1 = "$C1";
  var C2 = "$C2";
  var C3 = "$C3";
  var C4 = "$C4";
  var C5 = "$C5";
  var C6 = "$C6";
  var E = YYE;
  var MAXPRIMETAB = 1e4;
  var MAX_CONSECUTIVE_APPLICATIONS_OF_ALL_RULES = 5;
  var MAX_CONSECUTIVE_APPLICATIONS_OF_SINGLE_RULE = 10;
  var MAXDIM = 24;
  var predefinedSymbolsInGlobalScope_doNotTrackInDependencies = [
    "rationalize",
    "abs",
    "e",
    "i",
    "pi",
    "sin",
    "ceiling",
    "cos",
    "roots",
    "integral",
    "derivative",
    "defint",
    "sqrt",
    "eig",
    "cov",
    "deig",
    "dcov",
    "float",
    "floor",
    "product",
    "root",
    "round",
    "sum",
    "test",
    "unit"
  ];
  var parse_time_simplifications = true;
  var primetab = function() {
    const primes = [2];
    let i = 3;
    while (primes.length < MAXPRIMETAB) {
      let j = 0;
      const ceil = Math.sqrt(i);
      while (j < primes.length && primes[j] <= ceil) {
        if (i % primes[j] === 0) {
          j = -1;
          break;
        }
        j++;
      }
      if (j !== -1) {
        primes.push(i);
      }
      i += 2;
    }
    primes[MAXPRIMETAB] = 0;
    return primes;
  }();
  var draw_flag = false;
  var transpose_unicode = 7488;
  var dotprod_unicode = 183;
  function iscons(p) {
    return p.k === CONS;
  }
  function isrational(p) {
    return p.k === NUM;
  }
  function isdouble(p) {
    return p.k === DOUBLE;
  }
  function isNumericAtom(p) {
    return isrational(p) || isdouble(p);
  }
  function isstr(p) {
    return p.k === STR;
  }
  function istensor(p) {
    return p.k === TENSOR;
  }
  function isNumericAtomOrTensor(p) {
    if (isNumericAtom(p) || p === symbol(SYMBOL_IDENTITY_MATRIX)) {
      return true;
    }
    if (!istensor(p)) {
      return false;
    }
    const n = p.tensor.nelem;
    const a = p.tensor.elem;
    for (let i = 0; i < n; i++) {
      if (!isNumericAtomOrTensor(a[i])) {
        return false;
      }
    }
    return true;
  }
  function issymbol(p) {
    return p.k === SYM;
  }
  function car(p) {
    if (iscons(p)) {
      return p.cons.car;
    } else {
      return symbol(NIL);
    }
  }
  function cdr(p) {
    if (iscons(p)) {
      return p.cons.cdr;
    } else {
      return symbol(NIL);
    }
  }
  function caar(p) {
    return car(car(p));
  }
  function cadr(p) {
    return car(cdr(p));
  }
  function cdar(p) {
    return cdr(car(p));
  }
  function cddr(p) {
    return cdr(cdr(p));
  }
  function caadr(p) {
    return car(car(cdr(p)));
  }
  function caddr(p) {
    return car(cdr(cdr(p)));
  }
  function cadar(p) {
    return car(cdr(car(p)));
  }
  function cdadr(p) {
    return cdr(car(cdr(p)));
  }
  function cddar(p) {
    return cdr(cdr(car(p)));
  }
  function cdddr(p) {
    return cdr(cdr(cdr(p)));
  }
  function caaddr(p) {
    return car(car(cdr(cdr(p))));
  }
  function cadadr(p) {
    return car(cdr(car(cdr(p))));
  }
  function caddar(p) {
    return car(cdr(cdr(car(p))));
  }
  function cdaddr(p) {
    return cdr(car(cdr(cdr(p))));
  }
  function cadddr(p) {
    return car(cdr(cdr(cdr(p))));
  }
  function cddddr(p) {
    return cdr(cdr(cdr(cdr(p))));
  }
  function caddddr(p) {
    return car(cdr(cdr(cdr(cdr(p)))));
  }
  function cadaddr(p) {
    return car(cdr(car(cdr(cdr(p)))));
  }
  function cddaddr(p) {
    return cdr(cdr(car(cdr(cdr(p)))));
  }
  function caddadr(p) {
    return car(cdr(cdr(car(cdr(p)))));
  }
  function cdddaddr(p) {
    return cdr(cdr(cdr(car(cdr(cdr(p))))));
  }
  function caddaddr(p) {
    return car(cdr(cdr(car(cdr(cdr(p))))));
  }
  function isadd(p) {
    return car(p) === symbol(ADD);
  }
  function ismultiply(p) {
    return car(p) === symbol(MULTIPLY);
  }
  function ispower(p) {
    return car(p) === symbol(POWER);
  }
  function isfactorial(p) {
    return car(p) === symbol(FACTORIAL);
  }
  function isinnerordot(p) {
    return car(p) === symbol(INNER) || car(p) === symbol(DOT);
  }
  function istranspose(p) {
    return car(p) === symbol(TRANSPOSE);
  }
  function isinv(p) {
    return car(p) === symbol(INV);
  }
  function isidentitymatrix(p) {
    return p === symbol(SYMBOL_IDENTITY_MATRIX);
  }
  function MSIGN(p) {
    if (p.isPositive()) {
      return 1;
    } else if (p.isZero()) {
      return 0;
    } else {
      return -1;
    }
  }
  function MZERO(p) {
    return p.isZero();
  }
  function MEQUAL(p, n) {
    if (p == null) {
      breakpoint;
    }
    return p.equals(n);
  }
  function reset_after_error() {
    defs.esc_flag = false;
    draw_flag = false;
    defs.evaluatingAsFloats = false;
    defs.evaluatingPolar = false;
  }
  var Constants = class {
    static One() {
      return defs.evaluatingAsFloats ? Constants.oneAsDouble : Constants.one;
    }
    static NegOne() {
      return defs.evaluatingAsFloats ? Constants.negOneAsDouble : Constants.negOne;
    }
    static Zero() {
      return defs.evaluatingAsFloats ? Constants.zeroAsDouble : Constants.zero;
    }
    static Pi() {
      return defs.evaluatingAsFloats ? Constants.piAsDouble : symbol(PI);
    }
  };
  Constants.one = new Num((0, import_big_integer7.default)(1));
  Constants.oneAsDouble = new Double(1);
  Constants.negOne = new Num((0, import_big_integer7.default)(-1));
  Constants.negOneAsDouble = new Double(-1);
  Constants.zero = new Num((0, import_big_integer7.default)(0));
  Constants.zeroAsDouble = new Double(0);
  Constants.piAsDouble = new Double(Math.PI);
  function noexpand(func, ...args) {
    const prev_expanding = defs.expanding;
    defs.expanding = false;
    try {
      return func(...args);
    } finally {
      defs.expanding = prev_expanding;
    }
  }
  function doexpand(func, ...args) {
    const prev_expanding = defs.expanding;
    defs.expanding = true;
    try {
      return func(...args);
    } finally {
      defs.expanding = prev_expanding;
    }
  }
  function evalPolar(func, ...args) {
    const prev_evaluatingPolar = defs.evaluatingPolar;
    defs.evaluatingPolar = true;
    try {
      return func(...args);
    } finally {
      defs.evaluatingPolar = prev_evaluatingPolar;
    }
  }
  function evalFloats(func, ...args) {
    const prev_evaluatingAsFloats = defs.evaluatingAsFloats;
    defs.evaluatingAsFloats = true;
    try {
      return func(...args);
    } finally {
      defs.evaluatingAsFloats = prev_evaluatingAsFloats;
    }
  }

  // bazel-out/k8-fastbuild/bin/runtime/zombocom.js
  if (!defs.inited) {
    defs.inited = true;
    init();
  }
  function parse_internal(argu) {
    if (typeof argu === "string") {
      const [, u] = scan(argu);
      return u;
    } else if (typeof argu === "number") {
      if (argu % 1 === 0) {
        return integer(argu);
      } else {
        return double(argu);
      }
    } else if (typeof argu.k === "number") {
      return argu;
    } else {
      console.warn("unknown argument type", argu);
      return symbol(NIL);
    }
  }
  function parse(argu) {
    let data;
    try {
      data = parse_internal(argu);
      check_stack();
    } catch (error) {
      reset_after_error();
      throw error;
    }
    return data;
  }
  function exec(name, ...argus) {
    let result;
    const fn = get_binding(usr_symbol(name));
    check_stack();
    const p1 = makeList(fn, ...argus.map(parse_internal));
    try {
      result = top_level_eval(p1);
      check_stack();
    } catch (error) {
      reset_after_error();
      throw error;
    }
    return result;
  }

  // bazel-out/k8-fastbuild/bin/index.js
  var $ = {};
  $.version = version;
  $.isadd = isadd;
  $.ismultiply = ismultiply;
  $.ispower = ispower;
  $.isfactorial = isfactorial;
  $.car = car;
  $.cdr = cdr;
  $.caar = caar;
  $.cadr = cadr;
  $.cdar = cdar;
  $.cddr = cddr;
  $.caadr = caadr;
  $.caddr = caddr;
  $.cadar = cadar;
  $.cdadr = cdadr;
  $.cddar = cddar;
  $.cdddr = cdddr;
  $.caaddr = caaddr;
  $.cadadr = cadadr;
  $.caddar = caddar;
  $.cdaddr = cdaddr;
  $.cadddr = cadddr;
  $.cddddr = cddddr;
  $.caddddr = caddddr;
  $.cadaddr = cadaddr;
  $.cddaddr = cddaddr;
  $.caddadr = caddadr;
  $.cdddaddr = cdddaddr;
  $.caddaddr = caddaddr;
  $.symbol = symbol;
  $.iscons = iscons;
  $.isrational = isrational;
  $.isdouble = isdouble;
  $.isNumericAtom = isNumericAtom;
  $.isstr = isstr;
  $.istensor = istensor;
  $.issymbol = issymbol;
  $.iskeyword = iskeyword;
  $.CONS = CONS;
  $.Cons = Cons;
  $.NUM = NUM;
  $.Num = Num;
  $.DOUBLE = DOUBLE;
  $.Double = Double;
  $.STR = STR;
  $.Str = Str;
  $.TENSOR = TENSOR;
  $.Tensor = Tensor;
  $.SYM = SYM;
  $.Sym = Sym;
  $.approxRadicals = approxRadicals;
  $.approxRationalsOfLogs = approxRationalsOfLogs;
  $.approxAll = approxAll;
  $.testApprox = testApprox;
  $.make_hashed_itab = make_hashed_itab;
  $.isZeroAtomOrTensor = isZeroAtomOrTensor;
  $.isnegativenumber = isnegativenumber;
  $.isplusone = isplusone;
  $.isminusone = isminusone;
  $.isinteger = isinteger;
  $.isnonnegativeinteger = isnonnegativeinteger;
  $.isposint = isposint;
  $.isnegativeterm = isnegativeterm;
  $.isimaginarynumber = isimaginarynumber;
  $.iscomplexnumber = iscomplexnumber;
  $.iseveninteger = iseveninteger;
  $.isnegative = isnegative;
  $.issymbolic = issymbolic;
  $.isintegerfactor = isintegerfactor;
  $.isoneover = isoneover;
  $.isfraction = isfraction;
  $.isoneoversqrttwo = isoneoversqrttwo;
  $.isminusoneoversqrttwo = isminusoneoversqrttwo;
  $.isfloating = isfloating;
  $.isimaginaryunit = isimaginaryunit;
  $.isquarterturn = isquarterturn;
  $.isnpi = isnpi;
  $.equal = equal;
  $.length = length;
  $.scan = scan;
  $.Find = Find;
  $.get_binding = get_binding;
  $.set_binding = set_binding;
  $.usr_symbol = usr_symbol;
  $.collectUserSymbols = collectUserSymbols;
  $.init = init;
  $.exec = exec;
  $.parse = parse;
  $.run = run;
  var builtin_fns = [
    "abs",
    "add",
    "adj",
    "and",
    "approxratio",
    "arccos",
    "arccosh",
    "arcsin",
    "arcsinh",
    "arctan",
    "arctanh",
    "arg",
    "atomize",
    "besselj",
    "bessely",
    "binding",
    "binomial",
    "ceiling",
    "check",
    "choose",
    "circexp",
    "clear",
    "clearall",
    "clearpatterns",
    "clock",
    "coeff",
    "cofactor",
    "condense",
    "conj",
    "contract",
    "cos",
    "cosh",
    "decomp",
    "defint",
    "deg",
    "denominator",
    "det",
    "derivative",
    "dim",
    "dirac",
    "divisors",
    "do",
    "dot",
    "draw",
    "dsolve",
    "eigen",
    "eigenval",
    "eigenvec",
    "erf",
    "erfc",
    "eval",
    "exp",
    "expand",
    "expcos",
    "expsin",
    "factor",
    "factorial",
    "factorpoly",
    "filter",
    "float",
    "floor",
    "for",
    "Gamma",
    "gcd",
    "hermite",
    "hilbert",
    "imag",
    "component",
    "inner",
    "integral",
    "inv",
    "invg",
    "isinteger",
    "isprime",
    "laguerre",
    "lcm",
    "leading",
    "legendre",
    "log",
    "mod",
    "multiply",
    "not",
    "nroots",
    "number",
    "numerator",
    "operator",
    "or",
    "outer",
    "pattern",
    "patternsinfo",
    "polar",
    "power",
    "prime",
    "print",
    "print2dascii",
    "printcomputer",
    "printlatex",
    "printlist",
    "printhuman",
    "product",
    "quote",
    "quotient",
    "rank",
    "rationalize",
    "real",
    "rect",
    "roots",
    "round",
    "equals",
    "shape",
    "sgn",
    "silentpattern",
    "simplify",
    "sin",
    "sinh",
    "sqrt",
    "stop",
    "subst",
    "sum",
    "symbolsinfo",
    "tan",
    "tanh",
    "taylor",
    "test",
    "testeq",
    "testge",
    "testgt",
    "testle",
    "testlt",
    "transpose",
    "unit",
    "zero"
  ];
  Array.from(builtin_fns).map((fn) => $[fn] = exec.bind(void 0, fn));
  var bin_default = $;

  // bazel-out/k8-fastbuild/bin/sources/browser_main.js
  globalThis.Algebrite = bin_default;
})();
//# sourceMappingURL=algebrite.bundle-for-browser.js.map
