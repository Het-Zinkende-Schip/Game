typeof BigInt > "u" && (BigInt = function(e) {
  if (isNaN(e)) throw new Error("");
  return e;
});
const C_ZERO = BigInt(0), C_ONE = BigInt(1), C_TWO = BigInt(2), C_FIVE = BigInt(5), C_TEN = BigInt(10), MAX_CYCLE_LEN = 2e3, P = {
  s: C_ONE,
  n: C_ZERO,
  d: C_ONE
};
function assign(e, t) {
  try {
    e = BigInt(e);
  } catch {
    throw InvalidParameter();
  }
  return e * t;
}
function trunc(e) {
  return typeof e == "bigint" ? e : Math.floor(e);
}
function newFraction(e, t) {
  if (t === C_ZERO)
    throw DivisionByZero();
  const a = Object.create(Fraction.prototype);
  a.s = e < C_ZERO ? -C_ONE : C_ONE, e = e < C_ZERO ? -e : e;
  const o = gcd$1(e, t);
  return a.n = e / o, a.d = t / o, a;
}
function factorize(e) {
  const t = {};
  let a = e, o = C_TWO, u = C_FIVE - C_ONE;
  for (; u <= a; ) {
    for (; a % o === C_ZERO; )
      a /= o, t[o] = (t[o] || C_ZERO) + C_ONE;
    u += C_ONE + C_TWO * o++;
  }
  return a !== e ? a > 1 && (t[a] = (t[a] || C_ZERO) + C_ONE) : t[e] = (t[e] || C_ZERO) + C_ONE, t;
}
const parse$7 = function(e, t) {
  let a = C_ZERO, o = C_ONE, u = C_ONE;
  if (e != null) if (t !== void 0) {
    if (typeof e == "bigint")
      a = e;
    else {
      if (isNaN(e))
        throw InvalidParameter();
      if (e % 1 !== 0)
        throw NonIntegerParameter();
      a = BigInt(e);
    }
    if (typeof t == "bigint")
      o = t;
    else {
      if (isNaN(t))
        throw InvalidParameter();
      if (t % 1 !== 0)
        throw NonIntegerParameter();
      o = BigInt(t);
    }
    u = a * o;
  } else if (typeof e == "object") {
    if ("d" in e && "n" in e)
      a = BigInt(e.n), o = BigInt(e.d), "s" in e && (a *= BigInt(e.s));
    else if (0 in e)
      a = BigInt(e[0]), 1 in e && (o = BigInt(e[1]));
    else if (typeof e == "bigint")
      a = e;
    else
      throw InvalidParameter();
    u = a * o;
  } else if (typeof e == "number") {
    if (isNaN(e))
      throw InvalidParameter();
    if (e < 0 && (u = -C_ONE, e = -e), e % 1 === 0)
      a = BigInt(e);
    else if (e > 0) {
      let l = 1, f = 0, p = 1, g = 1, d = 1, b = 1e7;
      for (e >= 1 && (l = 10 ** Math.floor(1 + Math.log10(e)), e /= l); p <= b && d <= b; ) {
        let F = (f + g) / (p + d);
        if (e === F) {
          p + d <= b ? (a = f + g, o = p + d) : d > p ? (a = g, o = d) : (a = f, o = p);
          break;
        } else
          e > F ? (f += g, p += d) : (g += f, d += p), p > b ? (a = g, o = d) : (a = f, o = p);
      }
      a = BigInt(a) * BigInt(l), o = BigInt(o);
    }
  } else if (typeof e == "string") {
    let l = 0, f = C_ZERO, p = C_ZERO, g = C_ZERO, d = C_ONE, b = C_ONE, F = e.replace(/_/g, "").match(/\d+|./g);
    if (F === null)
      throw InvalidParameter();
    if (F[l] === "-" ? (u = -C_ONE, l++) : F[l] === "+" && l++, F.length === l + 1 ? p = assign(F[l++], u) : F[l + 1] === "." || F[l] === "." ? (F[l] !== "." && (f = assign(F[l++], u)), l++, (l + 1 === F.length || F[l + 1] === "(" && F[l + 3] === ")" || F[l + 1] === "'" && F[l + 3] === "'") && (p = assign(F[l], u), d = C_TEN ** BigInt(F[l].length), l++), (F[l] === "(" && F[l + 2] === ")" || F[l] === "'" && F[l + 2] === "'") && (g = assign(F[l + 1], u), b = C_TEN ** BigInt(F[l + 1].length) - C_ONE, l += 3)) : F[l + 1] === "/" || F[l + 1] === ":" ? (p = assign(F[l], u), d = assign(F[l + 2], C_ONE), l += 3) : F[l + 3] === "/" && F[l + 1] === " " && (f = assign(F[l], u), p = assign(F[l + 2], u), d = assign(F[l + 4], C_ONE), l += 5), F.length <= l)
      o = d * b, u = /* void */
      a = g + o * f + b * p;
    else
      throw InvalidParameter();
  } else if (typeof e == "bigint")
    a = e, u = e, o = C_ONE;
  else
    throw InvalidParameter();
  if (o === C_ZERO)
    throw DivisionByZero();
  P.s = u < C_ZERO ? -C_ONE : C_ONE, P.n = a < C_ZERO ? -a : a, P.d = o < C_ZERO ? -o : o;
};
function modpow(e, t, a) {
  let o = C_ONE;
  for (; t > C_ZERO; e = e * e % a, t >>= C_ONE)
    t & C_ONE && (o = o * e % a);
  return o;
}
function cycleLen(e, t) {
  for (; t % C_TWO === C_ZERO; t /= C_TWO)
    ;
  for (; t % C_FIVE === C_ZERO; t /= C_FIVE)
    ;
  if (t === C_ONE)
    return C_ZERO;
  let a = C_TEN % t, o = 1;
  for (; a !== C_ONE; o++)
    if (a = a * C_TEN % t, o > MAX_CYCLE_LEN)
      return C_ZERO;
  return BigInt(o);
}
function cycleStart(e, t, a) {
  let o = C_ONE, u = modpow(C_TEN, a, t);
  for (let l = 0; l < 300; l++) {
    if (o === u)
      return BigInt(l);
    o = o * C_TEN % t, u = u * C_TEN % t;
  }
  return 0;
}
function gcd$1(e, t) {
  if (!e)
    return t;
  if (!t)
    return e;
  for (; ; ) {
    if (e %= t, !e)
      return t;
    if (t %= e, !t)
      return e;
  }
}
function Fraction(e, t) {
  if (parse$7(e, t), this instanceof Fraction)
    e = gcd$1(P.d, P.n), this.s = P.s, this.n = P.n / e, this.d = P.d / e;
  else
    return newFraction(P.s * P.n, P.d);
}
var DivisionByZero = function() {
  return new Error("Division by Zero");
}, InvalidParameter = function() {
  return new Error("Invalid argument");
}, NonIntegerParameter = function() {
  return new Error("Parameters must be integer");
};
Fraction.prototype = {
  s: C_ONE,
  n: C_ZERO,
  d: C_ONE,
  /**
   * Calculates the absolute value
   *
   * Ex: new Fraction(-4).abs() => 4
   **/
  abs: function() {
    return newFraction(this.n, this.d);
  },
  /**
   * Inverts the sign of the current fraction
   *
   * Ex: new Fraction(-4).neg() => 4
   **/
  neg: function() {
    return newFraction(-this.s * this.n, this.d);
  },
  /**
   * Adds two rational numbers
   *
   * Ex: new Fraction({n: 2, d: 3}).add("14.9") => 467 / 30
   **/
  add: function(e, t) {
    return parse$7(e, t), newFraction(
      this.s * this.n * P.d + P.s * this.d * P.n,
      this.d * P.d
    );
  },
  /**
   * Subtracts two rational numbers
   *
   * Ex: new Fraction({n: 2, d: 3}).add("14.9") => -427 / 30
   **/
  sub: function(e, t) {
    return parse$7(e, t), newFraction(
      this.s * this.n * P.d - P.s * this.d * P.n,
      this.d * P.d
    );
  },
  /**
   * Multiplies two rational numbers
   *
   * Ex: new Fraction("-17.(345)").mul(3) => 5776 / 111
   **/
  mul: function(e, t) {
    return parse$7(e, t), newFraction(
      this.s * P.s * this.n * P.n,
      this.d * P.d
    );
  },
  /**
   * Divides two rational numbers
   *
   * Ex: new Fraction("-17.(345)").inverse().div(3)
   **/
  div: function(e, t) {
    return parse$7(e, t), newFraction(
      this.s * P.s * this.n * P.d,
      this.d * P.n
    );
  },
  /**
   * Clones the actual object
   *
   * Ex: new Fraction("-17.(345)").clone()
   **/
  clone: function() {
    return newFraction(this.s * this.n, this.d);
  },
  /**
   * Calculates the modulo of two rational numbers - a more precise fmod
   *
   * Ex: new Fraction('4.(3)').mod([7, 8]) => (13/3) % (7/8) = (5/6)
   * Ex: new Fraction(20, 10).mod().equals(0) ? "is Integer"
   **/
  mod: function(e, t) {
    if (e === void 0)
      return newFraction(this.s * this.n % this.d, C_ONE);
    if (parse$7(e, t), C_ZERO === P.n * this.d)
      throw DivisionByZero();
    return newFraction(
      this.s * (P.d * this.n) % (P.n * this.d),
      P.d * this.d
    );
  },
  /**
   * Calculates the fractional gcd of two rational numbers
   *
   * Ex: new Fraction(5,8).gcd(3,7) => 1/56
   */
  gcd: function(e, t) {
    return parse$7(e, t), newFraction(gcd$1(P.n, this.n) * gcd$1(P.d, this.d), P.d * this.d);
  },
  /**
   * Calculates the fractional lcm of two rational numbers
   *
   * Ex: new Fraction(5,8).lcm(3,7) => 15
   */
  lcm: function(e, t) {
    return parse$7(e, t), P.n === C_ZERO && this.n === C_ZERO ? newFraction(C_ZERO, C_ONE) : newFraction(P.n * this.n, gcd$1(P.n, this.n) * gcd$1(P.d, this.d));
  },
  /**
   * Gets the inverse of the fraction, means numerator and denominator are exchanged
   *
   * Ex: new Fraction([-3, 4]).inverse() => -4 / 3
   **/
  inverse: function() {
    return newFraction(this.s * this.d, this.n);
  },
  /**
   * Calculates the fraction to some integer exponent
   *
   * Ex: new Fraction(-1,2).pow(-3) => -8
   */
  pow: function(e, t) {
    if (parse$7(e, t), P.d === C_ONE)
      return P.s < C_ZERO ? newFraction((this.s * this.d) ** P.n, this.n ** P.n) : newFraction((this.s * this.n) ** P.n, this.d ** P.n);
    if (this.s < C_ZERO) return null;
    let a = factorize(this.n), o = factorize(this.d), u = C_ONE, l = C_ONE;
    for (let f in a)
      if (f !== "1") {
        if (f === "0") {
          u = C_ZERO;
          break;
        }
        if (a[f] *= P.n, a[f] % P.d === C_ZERO)
          a[f] /= P.d;
        else return null;
        u *= BigInt(f) ** a[f];
      }
    for (let f in o)
      if (f !== "1") {
        if (o[f] *= P.n, o[f] % P.d === C_ZERO)
          o[f] /= P.d;
        else return null;
        l *= BigInt(f) ** o[f];
      }
    return P.s < C_ZERO ? newFraction(l, u) : newFraction(u, l);
  },
  /**
   * Calculates the logarithm of a fraction to a given rational base
   *
   * Ex: new Fraction(27, 8).log(9, 4) => 3/2
   */
  log: function(e, t) {
    if (parse$7(e, t), this.s <= C_ZERO || P.s <= C_ZERO) return null;
    const a = {}, o = factorize(P.n), u = factorize(P.d), l = factorize(this.n), f = factorize(this.d);
    for (const d in u)
      o[d] = (o[d] || C_ZERO) - u[d];
    for (const d in f)
      l[d] = (l[d] || C_ZERO) - f[d];
    for (const d in o)
      d !== "1" && (a[d] = !0);
    for (const d in l)
      d !== "1" && (a[d] = !0);
    let p = null, g = null;
    for (const d in a) {
      const b = o[d] || C_ZERO, F = l[d] || C_ZERO;
      if (b === C_ZERO) {
        if (F !== C_ZERO)
          return null;
        continue;
      }
      let E = F, S = b;
      const R = gcd$1(E, S);
      if (E /= R, S /= R, p === null && g === null)
        p = E, g = S;
      else if (E * g !== p * S)
        return null;
    }
    return p !== null && g !== null ? newFraction(p, g) : null;
  },
  /**
   * Check if two rational numbers are the same
   *
   * Ex: new Fraction(19.6).equals([98, 5]);
   **/
  equals: function(e, t) {
    return parse$7(e, t), this.s * this.n * P.d === P.s * P.n * this.d;
  },
  /**
   * Check if this rational number is less than another
   *
   * Ex: new Fraction(19.6).lt([98, 5]);
   **/
  lt: function(e, t) {
    return parse$7(e, t), this.s * this.n * P.d < P.s * P.n * this.d;
  },
  /**
   * Check if this rational number is less than or equal another
   *
   * Ex: new Fraction(19.6).lt([98, 5]);
   **/
  lte: function(e, t) {
    return parse$7(e, t), this.s * this.n * P.d <= P.s * P.n * this.d;
  },
  /**
   * Check if this rational number is greater than another
   *
   * Ex: new Fraction(19.6).lt([98, 5]);
   **/
  gt: function(e, t) {
    return parse$7(e, t), this.s * this.n * P.d > P.s * P.n * this.d;
  },
  /**
   * Check if this rational number is greater than or equal another
   *
   * Ex: new Fraction(19.6).lt([98, 5]);
   **/
  gte: function(e, t) {
    return parse$7(e, t), this.s * this.n * P.d >= P.s * P.n * this.d;
  },
  /**
   * Compare two rational numbers
   * < 0 iff this < that
   * > 0 iff this > that
   * = 0 iff this = that
   *
   * Ex: new Fraction(19.6).compare([98, 5]);
   **/
  compare: function(e, t) {
    parse$7(e, t);
    let a = this.s * this.n * P.d - P.s * P.n * this.d;
    return (C_ZERO < a) - (a < C_ZERO);
  },
  /**
   * Calculates the ceil of a rational number
   *
   * Ex: new Fraction('4.(3)').ceil() => (5 / 1)
   **/
  ceil: function(e) {
    return e = C_TEN ** BigInt(e || 0), newFraction(
      trunc(this.s * e * this.n / this.d) + (e * this.n % this.d > C_ZERO && this.s >= C_ZERO ? C_ONE : C_ZERO),
      e
    );
  },
  /**
   * Calculates the floor of a rational number
   *
   * Ex: new Fraction('4.(3)').floor() => (4 / 1)
   **/
  floor: function(e) {
    return e = C_TEN ** BigInt(e || 0), newFraction(
      trunc(this.s * e * this.n / this.d) - (e * this.n % this.d > C_ZERO && this.s < C_ZERO ? C_ONE : C_ZERO),
      e
    );
  },
  /**
   * Rounds a rational numbers
   *
   * Ex: new Fraction('4.(3)').round() => (4 / 1)
   **/
  round: function(e) {
    return e = C_TEN ** BigInt(e || 0), newFraction(
      trunc(this.s * e * this.n / this.d) + this.s * ((this.s >= C_ZERO ? C_ONE : C_ZERO) + C_TWO * (e * this.n % this.d) > this.d ? C_ONE : C_ZERO),
      e
    );
  },
  /**
    * Rounds a rational number to a multiple of another rational number
    *
    * Ex: new Fraction('0.9').roundTo("1/8") => 7 / 8
    **/
  roundTo: function(e, t) {
    parse$7(e, t);
    const a = this.n * P.d, o = this.d * P.n, u = a % o;
    let l = trunc(a / o);
    return u + u >= o && l++, newFraction(this.s * l * P.n, P.d);
  },
  /**
   * Check if two rational numbers are divisible
   *
   * Ex: new Fraction(19.6).divisible(1.5);
   */
  divisible: function(e, t) {
    return parse$7(e, t), !(!(P.n * this.d) || this.n * P.d % (P.n * this.d));
  },
  /**
   * Returns a decimal representation of the fraction
   *
   * Ex: new Fraction("100.'91823'").valueOf() => 100.91823918239183
   **/
  valueOf: function() {
    return Number(this.s * this.n) / Number(this.d);
  },
  /**
   * Creates a string representation of a fraction with all digits
   *
   * Ex: new Fraction("100.'91823'").toString() => "100.(91823)"
   **/
  toString: function(e) {
    let t = this.n, a = this.d;
    e = e || 15;
    let o = cycleLen(t, a), u = cycleStart(t, a, o), l = this.s < C_ZERO ? "-" : "";
    if (l += trunc(t / a), t %= a, t *= C_TEN, t && (l += "."), o) {
      for (let f = u; f--; )
        l += trunc(t / a), t %= a, t *= C_TEN;
      l += "(";
      for (let f = o; f--; )
        l += trunc(t / a), t %= a, t *= C_TEN;
      l += ")";
    } else
      for (let f = e; t && f--; )
        l += trunc(t / a), t %= a, t *= C_TEN;
    return l;
  },
  /**
   * Returns a string-fraction representation of a Fraction object
   *
   * Ex: new Fraction("1.'3'").toFraction() => "4 1/3"
   **/
  toFraction: function(e) {
    let t = this.n, a = this.d, o = this.s < C_ZERO ? "-" : "";
    if (a === C_ONE)
      o += t;
    else {
      let u = trunc(t / a);
      e && u > C_ZERO && (o += u, o += " ", t %= a), o += t, o += "/", o += a;
    }
    return o;
  },
  /**
   * Returns a latex representation of a Fraction object
   *
   * Ex: new Fraction("1.'3'").toLatex() => "\frac{4}{3}"
   **/
  toLatex: function(e) {
    let t = this.n, a = this.d, o = this.s < C_ZERO ? "-" : "";
    if (a === C_ONE)
      o += t;
    else {
      let u = trunc(t / a);
      e && u > C_ZERO && (o += u, t %= a), o += "\\frac{", o += t, o += "}{", o += a, o += "}";
    }
    return o;
  },
  /**
   * Returns an array of continued fraction elements
   *
   * Ex: new Fraction("7/8").toContinued() => [0,1,7]
   */
  toContinued: function() {
    let e = this.n, t = this.d, a = [];
    do {
      a.push(trunc(e / t));
      let o = e % t;
      e = t, t = o;
    } while (e !== C_ONE);
    return a;
  },
  simplify: function(e) {
    const t = BigInt(1 / (e || 1e-3) | 0), a = this.abs(), o = a.toContinued();
    for (let u = 1; u < o.length; u++) {
      let l = newFraction(o[u - 1], C_ONE);
      for (let p = u - 2; p >= 0; p--)
        l = l.inverse().add(o[p]);
      let f = l.sub(a);
      if (f.n * t < f.d)
        return l.mul(this.s);
    }
    return this;
  }
};
const logKey = "strudel.log";
let debounce = 1e3, lastMessage, lastTime;
function errorLogger$1(e, t = "cyclist") {
  logger$2(`[${t}] error: ${e.message}`);
}
function logger$2(e, t, a = {}) {
  let o = performance.now();
  lastMessage === e && o - lastTime < debounce || (lastMessage = e, lastTime = o, console.log(`%c${e}`, "background-color: black;color:white;border-radius:15px"), typeof document < "u" && typeof CustomEvent < "u" && document.dispatchEvent(
    new CustomEvent(logKey, {
      detail: {
        message: e,
        type: t,
        data: a
      }
    })
  ));
}
logger$2.key = logKey;
const isNoteWithOctave = (e) => /^[a-gA-G][#bsf]*[0-9]*$/.test(e), isNote = (e) => /^[a-gA-G][#bsf]*-?[0-9]*$/.test(e), tokenizeNote$3 = (e) => {
  if (typeof e != "string")
    return [];
  const [t, a = "", o] = e.match(/^([a-gA-G])([#bsf]*)(-?[0-9]*)$/)?.slice(1) || [];
  return t ? [t, a, o ? Number(o) : void 0] : [];
}, chromas$2 = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }, accs$2 = { "#": 1, b: -1, s: 1, f: -1 }, getAccidentalsOffset$1 = (e) => e?.split("").reduce((t, a) => t + accs$2[a], 0) || 0, noteToMidi$1 = (e, t = 3) => {
  const [a, o, u = t] = tokenizeNote$3(e);
  if (!a)
    throw new Error('not a note: "' + e + '"');
  const l = chromas$2[a.toLowerCase()], f = getAccidentalsOffset$1(o);
  return (Number(u) + 1) * 12 + l + f;
}, midiToFreq$2 = (e) => Math.pow(2, (e - 69) / 12) * 440, freqToMidi$2 = (e) => 12 * Math.log(e / 440) / Math.LN2 + 69, valueToMidi$1 = (e, t) => {
  if (typeof e != "object")
    throw new Error("valueToMidi: expected object value");
  let { freq: a, note: o } = e;
  if (typeof a == "number")
    return freqToMidi$2(a);
  if (typeof o == "string")
    return noteToMidi$1(o);
  if (typeof o == "number")
    return o;
  if (!t)
    throw new Error("valueToMidi: expected freq or note to be set");
  return t;
}, getEventOffsetMs = (e, t) => (e - t) * 1e3, getFreq = (e) => midiToFreq$2(typeof e == "number" ? e : noteToMidi$1(e)), pcs$1 = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"], midi2note$1 = (e) => {
  const t = Math.floor(e / 12) - 1;
  return pcs$1[e % 12] + t;
}, _mod$2 = (e, t) => (e % t + t) % t, averageArray = (e) => e.reduce((t, a) => t + a) / e.length;
function nanFallback$1(e, t = 0) {
  return isNaN(Number(e)) ? (logger$2(`"${e}" is not a number, falling back to ${t}`, "warning"), t) : e;
}
const getSoundIndex$1 = (e, t) => _mod$2(Math.round(nanFallback$1(e ?? 0, 0)), t), getPlayableNoteValue = (e) => {
  let { value: t, context: a } = e, o = t;
  if (typeof o == "object" && !Array.isArray(o) && (o = o.note || o.n || o.value, o === void 0))
    throw new Error(`cannot find a playable note for ${JSON.stringify(t)}`);
  if (typeof o == "number" && a.type !== "frequency")
    o = midiToFreq$2(e.value);
  else if (typeof o == "number" && a.type === "frequency")
    o = e.value;
  else if (typeof o != "string" || !isNote(o))
    throw new Error("not a note: " + JSON.stringify(o));
  return o;
}, getFrequency = (e) => {
  let { value: t, context: a } = e;
  if (typeof t == "object")
    return t.freq ? t.freq : getFreq(t.note || t.n || t.value);
  if (typeof t == "number" && a.type !== "frequency")
    t = midiToFreq$2(e.value);
  else if (typeof t == "string" && isNote(t))
    t = midiToFreq$2(noteToMidi$1(e.value));
  else if (typeof t != "number")
    throw new Error("not a note or frequency: " + t);
  return t;
}, rotate$2 = (e, t) => e.slice(t).concat(e.slice(0, t)), pipe = (...e) => e.reduce(
  (t, a) => (...o) => t(a(...o)),
  (t) => t
), compose = (...e) => pipe(...e.reverse()), removeUndefineds = (e) => e.filter((t) => t != null), flatten = (e) => [].concat(...e), id = (e) => e, constant = (e, t) => e, listRange = (e, t) => Array.from({ length: t - e + 1 }, (a, o) => o + e);
function curry(e, t, a = e.length) {
  const o = function u(...l) {
    if (l.length >= a)
      return e.apply(this, l);
    {
      const f = function(...p) {
        return u.apply(this, l.concat(p));
      };
      return t && t(f, l), f;
    }
  };
  return t && t(o, []), o;
}
function parseNumeral(e) {
  const t = Number(e);
  if (!isNaN(t))
    return t;
  if (isNote(e))
    return noteToMidi$1(e);
  throw new Error(`cannot parse as numeral: "${e}"`);
}
function mapArgs(e, t) {
  return (...a) => e(...a.map(t));
}
function numeralArgs(e) {
  return mapArgs(e, parseNumeral);
}
function parseFractional(e) {
  const t = Number(e);
  if (!isNaN(t))
    return t;
  const a = {
    pi: Math.PI,
    w: 1,
    h: 0.5,
    q: 0.25,
    e: 0.125,
    s: 0.0625,
    t: 1 / 3,
    f: 0.2,
    x: 1 / 6
  }[e];
  if (typeof a < "u")
    return a;
  throw new Error(`cannot parse as fractional: "${e}"`);
}
const fractionalArgs = (e) => mapArgs(e, parseFractional), splitAt = function(e, t) {
  return [t.slice(0, e), t.slice(e)];
}, zipWith = (e, t, a) => t.map((o, u) => e(o, a[u])), pairs = function(e) {
  const t = [];
  for (let a = 0; a < e.length - 1; ++a)
    t.push([e[a], e[a + 1]]);
  return t;
}, clamp$1 = (e, t, a) => Math.min(Math.max(e, t), a), solfeggio = ["Do", "Reb", "Re", "Mib", "Mi", "Fa", "Solb", "Sol", "Lab", "La", "Sib", "Si"], indian = [
  "Sa",
  "Re",
  "Ga",
  "Ma",
  "Pa",
  "Dha",
  "Ni"
], german = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Hb", "H"], byzantine = [
  "Ni",
  "Pab",
  "Pa",
  "Voub",
  "Vou",
  "Ga",
  "Dib",
  "Di",
  "Keb",
  "Ke",
  "Zob",
  "Zo"
], japanese = [
  "I",
  "Ro",
  "Ha",
  "Ni",
  "Ho",
  "He",
  "To"
], english = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"], sol2note = (e, t = "letters") => {
  const o = (t === "solfeggio" ? solfeggio : t === "indian" ? indian : t === "german" ? german : t === "byzantine" ? byzantine : t === "japanese" ? japanese : english)[e % 12], u = Math.floor(e / 12) - 1;
  return o + u;
};
function uniq(e) {
  var t = {};
  return e.filter(function(a) {
    return t.hasOwn(a) ? !1 : t[a] = !0;
  });
}
function uniqsort(e) {
  return e.sort().filter(function(t, a, o) {
    return !a || t != o[a - 1];
  });
}
function uniqsortr(e) {
  return e.sort((t, a) => t.compare(a)).filter(function(t, a, o) {
    return !a || t.ne(o[a - 1]);
  });
}
function unicodeToBase64(e) {
  const t = new TextEncoder().encode(e);
  return btoa(String.fromCharCode(...t));
}
function base64ToUnicode(e) {
  const t = new Uint8Array(
    atob(e).split("").map((o) => o.charCodeAt(0))
  );
  return new TextDecoder().decode(t);
}
function code2hash(e) {
  return encodeURIComponent(unicodeToBase64(e));
}
function hash2code(e) {
  return base64ToUnicode(decodeURIComponent(e));
}
function objectMap(e, t) {
  return Array.isArray(e) ? e.map(t) : Object.fromEntries(Object.entries(e).map(([a, o], u) => [a, t(o, a, u)]));
}
function cycleToSeconds$1(e, t) {
  return e / t;
}
class ClockCollator {
  constructor({
    getTargetClockTime: t = getUnixTimeSeconds,
    weight: a = 16,
    offsetDelta: o = 5e-3,
    checkAfterTime: u = 2,
    resetAfterTime: l = 8
  }) {
    this.offsetTime, this.timeAtPrevOffsetSample, this.prevOffsetTimes = [], this.getTargetClockTime = t, this.weight = a, this.offsetDelta = o, this.checkAfterTime = u, this.resetAfterTime = l, this.reset = () => {
      this.prevOffsetTimes = [], this.offsetTime = null, this.timeAtPrevOffsetSample = null;
    };
  }
  calculateOffset(t) {
    const a = this.getTargetClockTime(), o = a - this.timeAtPrevOffsetSample, u = a - t;
    if (o > this.resetAfterTime && this.reset(), this.offsetTime == null && (this.offsetTime = u), this.prevOffsetTimes.push(u), this.prevOffsetTimes.length > this.weight && this.prevOffsetTimes.shift(), this.timeAtPrevOffsetSample == null || o > this.checkAfterTime) {
      this.timeAtPrevOffsetSample = a;
      const l = averageArray(this.prevOffsetTimes);
      Math.abs(l - this.offsetTime) > this.offsetDelta && (this.offsetTime = l);
    }
    return this.offsetTime;
  }
  calculateTimestamp(t, a) {
    return this.calculateOffset(t) + a;
  }
}
function getPerformanceTimeSeconds() {
  return performance.now() * 1e-3;
}
function getUnixTimeSeconds() {
  return Date.now() * 1e-3;
}
const keyAlias = /* @__PURE__ */ new Map([
  ["control", "Control"],
  ["ctrl", "Control"],
  ["alt", "Alt"],
  ["shift", "Shift"],
  ["down", "ArrowDown"],
  ["up", "ArrowUp"],
  ["left", "ArrowLeft"],
  ["right", "ArrowRight"]
]);
let keyState;
function getCurrentKeyboardState() {
  if (keyState == null) {
    if (typeof window > "u")
      return;
    keyState = {}, window.addEventListener("keydown", (e) => {
      keyState[e.key] = !0;
    }), window.addEventListener("keyup", (e) => {
      keyState[e.key] = !1;
    });
  }
  return { ...keyState };
}
function stringifyValues(e, t = !1) {
  return typeof e == "object" ? t ? JSON.stringify(e).slice(1, -1).replaceAll('"', "").replaceAll(",", " ") : JSON.stringify(e) : e;
}
Fraction.prototype.sam = function() {
  return this.floor();
};
Fraction.prototype.nextSam = function() {
  return this.sam().add(1);
};
Fraction.prototype.wholeCycle = function() {
  return new TimeSpan(this.sam(), this.nextSam());
};
Fraction.prototype.cyclePos = function() {
  return this.sub(this.sam());
};
Fraction.prototype.lt = function(e) {
  return this.compare(e) < 0;
};
Fraction.prototype.gt = function(e) {
  return this.compare(e) > 0;
};
Fraction.prototype.lte = function(e) {
  return this.compare(e) <= 0;
};
Fraction.prototype.gte = function(e) {
  return this.compare(e) >= 0;
};
Fraction.prototype.eq = function(e) {
  return this.compare(e) == 0;
};
Fraction.prototype.ne = function(e) {
  return this.compare(e) != 0;
};
Fraction.prototype.max = function(e) {
  return this.gt(e) ? this : e;
};
Fraction.prototype.maximum = function(...e) {
  return e = e.map((t) => new Fraction(t)), e.reduce((t, a) => a.max(t), this);
};
Fraction.prototype.min = function(e) {
  return this.lt(e) ? this : e;
};
Fraction.prototype.mulmaybe = function(e) {
  return e !== void 0 ? this.mul(e) : void 0;
};
Fraction.prototype.divmaybe = function(e) {
  return e !== void 0 ? this.div(e) : void 0;
};
Fraction.prototype.addmaybe = function(e) {
  return e !== void 0 ? this.add(e) : void 0;
};
Fraction.prototype.submaybe = function(e) {
  return e !== void 0 ? this.sub(e) : void 0;
};
Fraction.prototype.show = function() {
  return this.s * this.n + "/" + this.d;
};
Fraction.prototype.or = function(e) {
  return this.eq(0) ? e : this;
};
const fraction$1 = (e) => Fraction(e), gcd = (...e) => {
  if (e = removeUndefineds(e), e.length !== 0)
    return e.reduce((t, a) => t.gcd(a), fraction$1(1));
}, lcm = (...e) => {
  if (e = removeUndefineds(e), e.length === 0)
    return;
  const t = e.pop();
  return e.reduce(
    (a, o) => a === void 0 || o === void 0 ? void 0 : a.lcm(o),
    t
  );
}, isFraction = (e) => e instanceof Fraction;
fraction$1._original = Fraction;
class TimeSpan {
  constructor(t, a) {
    this.begin = fraction$1(t), this.end = fraction$1(a);
  }
  get spanCycles() {
    const t = [];
    var a = this.begin;
    const o = this.end, u = o.sam();
    if (a.equals(o))
      return [new TimeSpan(a, o)];
    for (; o.gt(a); ) {
      if (a.sam().equals(u)) {
        t.push(new TimeSpan(a, this.end));
        break;
      }
      const l = a.nextSam();
      t.push(new TimeSpan(a, l)), a = l;
    }
    return t;
  }
  get duration() {
    return this.end.sub(this.begin);
  }
  cycleArc() {
    const t = this.begin.cyclePos(), a = t.add(this.duration);
    return new TimeSpan(t, a);
  }
  withTime(t) {
    return new TimeSpan(t(this.begin), t(this.end));
  }
  withEnd(t) {
    return new TimeSpan(this.begin, t(this.end));
  }
  withCycle(t) {
    const a = this.begin.sam(), o = a.add(t(this.begin.sub(a))), u = a.add(t(this.end.sub(a)));
    return new TimeSpan(o, u);
  }
  intersection(t) {
    const a = this.begin.max(t.begin), o = this.end.min(t.end);
    if (!a.gt(o) && !(a.equals(o) && (a.equals(this.end) && this.begin.lt(this.end) || a.equals(t.end) && t.begin.lt(t.end))))
      return new TimeSpan(a, o);
  }
  intersection_e(t) {
    const a = this.intersection(t);
    if (a == null)
      throw "TimeSpans do not intersect";
    return a;
  }
  midpoint() {
    return this.begin.add(this.duration.div(fraction$1(2)));
  }
  equals(t) {
    return this.begin.equals(t.begin) && this.end.equals(t.end);
  }
  show() {
    return this.begin.show() + " → " + this.end.show();
  }
}
class Hap {
  /*
        Event class, representing a value active during the timespan
        'part'. This might be a fragment of an event, in which case the
        timespan will be smaller than the 'whole' timespan, otherwise the
        two timespans will be the same. The 'part' must never extend outside of the
        'whole'. If the event represents a continuously changing value
        then the whole will be returned as None, in which case the given
        value will have been sampled from the point halfway between the
        start and end of the 'part' timespan.
        The context is to store a list of source code locations causing the event.
  
        The word 'Event' is more or less a reserved word in javascript, hence this
        class is named called 'Hap'.
        */
  constructor(t, a, o, u = {}, l = !1) {
    this.whole = t, this.part = a, this.value = o, this.context = u, this.stateful = l, l && console.assert(typeof this.value == "function", "Stateful values must be functions");
  }
  get duration() {
    let t;
    return typeof this.value?.duration == "number" ? t = fraction$1(this.value.duration) : t = this.whole.end.sub(this.whole.begin), typeof this.value?.clip == "number" ? t.mul(this.value.clip) : t;
  }
  get endClipped() {
    return this.whole.begin.add(this.duration);
  }
  isActive(t) {
    return this.whole.begin <= t && this.endClipped >= t;
  }
  isInPast(t) {
    return t > this.endClipped;
  }
  isInNearPast(t, a) {
    return a - t <= this.endClipped;
  }
  isInFuture(t) {
    return t < this.whole.begin;
  }
  isInNearFuture(t, a) {
    return a < this.whole.begin && a > this.whole.begin - t;
  }
  isWithinTime(t, a) {
    return this.whole.begin <= a && this.endClipped >= t;
  }
  wholeOrPart() {
    return this.whole ? this.whole : this.part;
  }
  withSpan(t) {
    const a = this.whole ? t(this.whole) : void 0;
    return new Hap(a, t(this.part), this.value, this.context);
  }
  withValue(t) {
    return new Hap(this.whole, this.part, t(this.value), this.context);
  }
  hasOnset() {
    return this.whole != null && this.whole.begin.equals(this.part.begin);
  }
  hasTag(t) {
    return this.context.tags?.includes(t);
  }
  resolveState(t) {
    if (this.stateful && this.hasOnset()) {
      console.log("stateful");
      const a = this.value, [o, u] = a(t);
      return [o, new Hap(this.whole, this.part, u, this.context, !1)];
    }
    return [t, this];
  }
  spanEquals(t) {
    return this.whole == null && t.whole == null || this.whole.equals(t.whole);
  }
  equals(t) {
    return this.spanEquals(t) && this.part.equals(t.part) && // TODO would == be better ??
    this.value === t.value;
  }
  show(t = !1) {
    const a = typeof this.value == "object" ? t ? JSON.stringify(this.value).slice(1, -1).replaceAll('"', "").replaceAll(",", " ") : JSON.stringify(this.value) : this.value;
    var o = "";
    if (this.whole == null)
      o = "~" + this.part.show;
    else {
      var u = this.whole.begin.equals(this.part.begin) && this.whole.end.equals(this.part.end);
      this.whole.begin.equals(this.part.begin) || (o = this.whole.begin.show() + " ⇜ "), u || (o += "("), o += this.part.show(), u || (o += ")"), this.whole.end.equals(this.part.end) || (o += " ⇝ " + this.whole.end.show());
    }
    return "[ " + o + " | " + a + " ]";
  }
  showWhole(t = !1) {
    return `${this.whole == null ? "~" : this.whole.show()}: ${stringifyValues(this.value, t)}`;
  }
  combineContext(t) {
    const a = this;
    return { ...a.context, ...t.context, locations: (a.context.locations || []).concat(t.context.locations || []) };
  }
  setContext(t) {
    return new Hap(this.whole, this.part, this.value, t);
  }
  ensureObjectValue() {
    if (typeof this.value != "object")
      throw new Error(
        `expected hap.value to be an object, but got "${this.value}". Hint: append .note() or .s() to the end`,
        "error"
      );
  }
}
class State {
  constructor(t, a = {}) {
    this.span = t, this.controls = a;
  }
  // Returns new State with different span
  setSpan(t) {
    return new State(t, this.controls);
  }
  withSpan(t) {
    return this.setSpan(t(this.span));
  }
  // Returns new State with added controls.
  setControls(t) {
    return new State(this.span, { ...this.controls, ...t });
  }
}
function unionWithObj(e, t, a) {
  if (t?.value !== void 0 && Object.keys(t).length === 1)
    return logger$2("[warn]: Can't do arithmetic on control pattern."), e;
  const o = Object.keys(e).filter((u) => Object.keys(t).includes(u));
  return Object.assign({}, e, t, Object.fromEntries(o.map((u) => [u, a(e[u], t[u])])));
}
curry((e, t) => e * t);
curry((e, t) => t.map(e));
function drawLine(e, t = 60) {
  let a = 0, o = fraction$1(0), u = [""], l = "";
  for (; u[0].length < t; ) {
    const f = e.queryArc(a, a + 1), p = f.filter((b) => b.hasOnset()).map((b) => b.duration), g = gcd(...p), d = g.inverse();
    u = u.map((b) => b + "|"), l += "|";
    for (let b = 0; b < d; b++) {
      const [F, E] = [o, o.add(g)], S = f.filter((k) => k.whole.begin.lte(F) && k.whole.end.gte(E)), R = S.length - u.length;
      R > 0 && (u = u.concat(Array(R).fill(l))), u = u.map((k, I) => {
        const V = S[I];
        if (V) {
          const q = V.whole.begin.eq(F) ? "" + V.value : "-";
          return k + q;
        }
        return k + ".";
      }), l += ".", o = o.add(g);
    }
    a++;
  }
  return u.join(`
`);
}
let stringParser, __steps = !0;
const calculateSteps = function(e) {
  __steps = !!e;
}, setStringParser = (e) => stringParser = e;
let Pattern$1 = class je {
  /**
   * Create a pattern. As an end user, you will most likely not create a Pattern directly.
   *
   * @param {function} query - The function that maps a `State` to an array of `Hap`.
   * @noAutocomplete
   */
  constructor(t, a = void 0) {
    this.query = t, this._Pattern = !0, this._steps = a;
  }
  get _steps() {
    return this.__steps;
  }
  set _steps(t) {
    this.__steps = t === void 0 ? void 0 : fraction$1(t);
  }
  setSteps(t) {
    return this._steps = t, this;
  }
  withSteps(t) {
    return __steps ? new je(this.query, this._steps === void 0 ? void 0 : t(this._steps)) : this;
  }
  get hasSteps() {
    return this._steps !== void 0;
  }
  //////////////////////////////////////////////////////////////////////
  // Haskell-style functor, applicative and monadic operations
  /**
   * Returns a new pattern, with the function applied to the value of
   * each hap. It has the alias `fmap`.
   * @synonyms fmap
   * @param {Function} func to to apply to the value
   * @returns Pattern
   * @example
   * "0 1 2".withValue(v => v + 10).log()
   */
  withValue(t) {
    const a = new je((o) => this.query(o).map((u) => u.withValue(t)));
    return a._steps = this._steps, a;
  }
  // runs func on query state
  withState(t) {
    return new je((a) => this.query(t(a)));
  }
  /**
   * see `withValue`
   * @noAutocomplete
   */
  fmap(t) {
    return this.withValue(t);
  }
  /**
   * Assumes 'this' is a pattern of functions, and given a function to
   * resolve wholes, applies a given pattern of values to that
   * pattern of functions.
   * @param {Function} whole_func
   * @param {Function} func
   * @noAutocomplete
   * @returns Pattern
   */
  appWhole(t, a) {
    const o = this, u = function(l) {
      const f = o.query(l), p = a.query(l), g = function(d, b) {
        const F = d.part.intersection(b.part);
        if (F != null)
          return new Hap(
            t(d.whole, b.whole),
            F,
            d.value(b.value),
            b.combineContext(d)
          );
      };
      return flatten(
        f.map((d) => removeUndefineds(p.map((b) => g(d, b))))
      );
    };
    return new je(u);
  }
  /**
   * When this method is called on a pattern of functions, it matches its haps
   * with those in the given pattern of values.  A new pattern is returned, with
   * each matching value applied to the corresponding function.
   *
   * In this `_appBoth` variant, where timespans of the function and value haps
   * are not the same but do intersect, the resulting hap has a timespan of the
   * intersection. This applies to both the part and the whole timespan.
   * @param {Pattern} pat_val
   * @noAutocomplete
   * @returns Pattern
   */
  appBoth(t) {
    const a = this, o = function(l, f) {
      if (!(l == null || f == null))
        return l.intersection_e(f);
    }, u = a.appWhole(o, t);
    return __steps && (u._steps = lcm(t._steps, a._steps)), u;
  }
  /**
   * As with `appBoth`, but the `whole` timespan is not the intersection,
   * but the timespan from the function of patterns that this method is called
   * on. In practice, this means that the pattern structure, including onsets,
   * are preserved from the pattern of functions (often referred to as the left
   * hand or inner pattern).
   * @param {Pattern} pat_val
   * @noAutocomplete
   * @returns Pattern
   */
  appLeft(t) {
    const a = this, o = function(l) {
      const f = [];
      for (const p of a.query(l)) {
        const g = t.query(l.setSpan(p.wholeOrPart()));
        for (const d of g) {
          const b = p.whole, F = p.part.intersection(d.part);
          if (F) {
            const E = p.value(d.value), S = d.combineContext(p), R = new Hap(b, F, E, S);
            f.push(R);
          }
        }
      }
      return f;
    }, u = new je(o);
    return u._steps = this._steps, u;
  }
  /**
   * As with `appLeft`, but `whole` timespans are instead taken from the
   * pattern of values, i.e. structure is preserved from the right hand/outer
   * pattern.
   * @param {Pattern} pat_val
   * @noAutocomplete
   * @returns Pattern
   */
  appRight(t) {
    const a = this, o = function(l) {
      const f = [];
      for (const p of t.query(l)) {
        const g = a.query(l.setSpan(p.wholeOrPart()));
        for (const d of g) {
          const b = p.whole, F = d.part.intersection(p.part);
          if (F) {
            const E = d.value(p.value), S = p.combineContext(d), R = new Hap(b, F, E, S);
            f.push(R);
          }
        }
      }
      return f;
    }, u = new je(o);
    return u._steps = t._steps, u;
  }
  bindWhole(t, a) {
    const o = this, u = function(l) {
      const f = function(g, d) {
        return new Hap(
          t(g.whole, d.whole),
          d.part,
          d.value,
          Object.assign({}, g.context, d.context, {
            locations: (g.context.locations || []).concat(d.context.locations || [])
          })
        );
      }, p = function(g) {
        return a(g.value).query(l.setSpan(g.part)).map((d) => f(g, d));
      };
      return flatten(o.query(l).map((g) => p(g)));
    };
    return new je(u);
  }
  bind(t) {
    const a = function(o, u) {
      if (!(o == null || u == null))
        return o.intersection_e(u);
    };
    return this.bindWhole(a, t);
  }
  join() {
    return this.bind(id);
  }
  outerBind(t) {
    return this.bindWhole((a) => a, t).setSteps(this._steps);
  }
  outerJoin() {
    return this.outerBind(id);
  }
  innerBind(t) {
    return this.bindWhole((a, o) => o, t);
  }
  innerJoin() {
    return this.innerBind(id);
  }
  // Flatterns patterns of patterns, by retriggering/resetting inner patterns at onsets of outer pattern haps
  resetJoin(t = !1) {
    const a = this;
    return new je((o) => a.discreteOnly().query(o).map((u) => u.value.late(t ? u.whole.begin : u.whole.begin.cyclePos()).query(o).map(
      (l) => new Hap(
        // Supports continuous haps in the inner pattern
        l.whole ? l.whole.intersection(u.whole) : void 0,
        l.part.intersection(u.part),
        l.value
      ).setContext(u.combineContext(l))
    ).filter((l) => l.part)).flat());
  }
  restartJoin() {
    return this.resetJoin(!0);
  }
  // Like the other joins above, joins a pattern of patterns of values, into a flatter
  // pattern of values. In this case it takes whole cycles of the inner pattern to fit each event
  // in the outer pattern.
  squeezeJoin() {
    const t = this;
    function a(o) {
      const u = t.discreteOnly().query(o);
      function l(p) {
        const d = p.value._focusSpan(p.wholeOrPart()).query(o.setSpan(p.part));
        function b(F, E) {
          let S;
          if (E.whole && F.whole && (S = E.whole.intersection(F.whole), !S))
            return;
          const R = E.part.intersection(F.part);
          if (!R)
            return;
          const k = E.combineContext(F);
          return new Hap(S, R, E.value, k);
        }
        return d.map((F) => b(p, F));
      }
      return flatten(u.map(l)).filter((p) => p);
    }
    return new je(a);
  }
  squeezeBind(t) {
    return this.fmap(t).squeezeJoin();
  }
  polyJoin = function() {
    const t = this;
    return t.fmap((a) => a.extend(t._steps.div(a._steps))).outerJoin();
  };
  polyBind(t) {
    return this.fmap(t).polyJoin();
  }
  //////////////////////////////////////////////////////////////////////
  // Utility methods mainly for internal use
  /**
   * Query haps inside the given time span.
   *
   * @param {Fraction | number} begin from time
   * @param {Fraction | number} end to time
   * @returns Hap[]
   * @example
   * const pattern = sequence('a', ['b', 'c'])
   * const haps = pattern.queryArc(0, 1)
   * console.log(haps)
   * silence
   * @noAutocomplete
   */
  queryArc(t, a, o = {}) {
    try {
      return this.query(new State(new TimeSpan(t, a), o));
    } catch (u) {
      return logger$2(`[query]: ${u.message}`, "error"), [];
    }
  }
  /**
   * Returns a new pattern, with queries split at cycle boundaries. This makes
   * some calculations easier to express, as all haps are then constrained to
   * happen within a cycle.
   * @returns Pattern
   * @noAutocomplete
   */
  splitQueries() {
    const t = this, a = (o) => flatten(o.span.spanCycles.map((u) => t.query(o.setSpan(u))));
    return new je(a);
  }
  /**
   * Returns a new pattern, where the given function is applied to the query
   * timespan before passing it to the original pattern.
   * @param {Function} func the function to apply
   * @returns Pattern
   * @noAutocomplete
   */
  withQuerySpan(t) {
    return new je((a) => this.query(a.withSpan(t)));
  }
  withQuerySpanMaybe(t) {
    const a = this;
    return new je((o) => {
      const u = o.withSpan(t);
      return u.span ? a.query(u) : [];
    });
  }
  /**
   * As with `withQuerySpan`, but the function is applied to both the
   * begin and end time of the query timespan.
   * @param {Function} func the function to apply
   * @returns Pattern
   * @noAutocomplete
   */
  withQueryTime(t) {
    return new je((a) => this.query(a.withSpan((o) => o.withTime(t))));
  }
  /**
   * Similar to `withQuerySpan`, but the function is applied to the timespans
   * of all haps returned by pattern queries (both `part` timespans, and where
   * present, `whole` timespans).
   * @param {Function} func
   * @returns Pattern
   * @noAutocomplete
   */
  withHapSpan(t) {
    return new je((a) => this.query(a).map((o) => o.withSpan(t)));
  }
  /**
   * As with `withHapSpan`, but the function is applied to both the
   * begin and end time of the hap timespans.
   * @param {Function} func the function to apply
   * @returns Pattern
   * @noAutocomplete
   */
  withHapTime(t) {
    return this.withHapSpan((a) => a.withTime(t));
  }
  /**
   * Returns a new pattern with the given function applied to the list of haps returned by every query.
   * @param {Function} func
   * @returns Pattern
   * @noAutocomplete
   */
  withHaps(t) {
    const a = new je((o) => t(this.query(o), o));
    return a._steps = this._steps, a;
  }
  /**
   * As with `withHaps`, but applies the function to every hap, rather than every list of haps.
   * @param {Function} func
   * @returns Pattern
   * @noAutocomplete
   */
  withHap(t) {
    return this.withHaps((a) => a.map(t));
  }
  /**
   * Returns a new pattern with the context field set to every hap set to the given value.
   * @param {*} context
   * @returns Pattern
   * @noAutocomplete
   */
  setContext(t) {
    return this.withHap((a) => a.setContext(t));
  }
  /**
   * Returns a new pattern with the given function applied to the context field of every hap.
   * @param {Function} func
   * @returns Pattern
   * @noAutocomplete
   */
  withContext(t) {
    const a = this.withHap((o) => o.setContext(t(o.context)));
    return this.__pure !== void 0 && (a.__pure = this.__pure, a.__pure_loc = this.__pure_loc), a;
  }
  /**
   * Returns a new pattern with the context field of every hap set to an empty object.
   * @returns Pattern
   * @noAutocomplete
   */
  stripContext() {
    return this.withHap((t) => t.setContext({}));
  }
  /**
   * Returns a new pattern with the given location information added to the
   * context of every hap.
   * @param {Number} start start offset
   * @param {Number} end end offset
   * @returns Pattern
   * @noAutocomplete
   */
  withLoc(t, a) {
    const o = {
      start: t,
      end: a
    }, u = this.withContext((l) => {
      const f = (l.locations || []).concat([o]);
      return { ...l, locations: f };
    });
    return this.__pure && (u.__pure = this.__pure, u.__pure_loc = o), u;
  }
  /**
   * Returns a new Pattern, which only returns haps that meet the given test.
   * @param {Function} hap_test - a function which returns false for haps to be removed from the pattern
   * @returns Pattern
   * @noAutocomplete
   */
  filterHaps(t) {
    return new je((a) => this.query(a).filter(t));
  }
  /**
   * As with `filterHaps`, but the function is applied to values
   * inside haps.
   * @param {Function} value_test
   * @returns Pattern
   * @noAutocomplete
   */
  filterValues(t) {
    return new je((a) => this.query(a).filter((o) => t(o.value))).setSteps(this._steps);
  }
  /**
   * Returns a new pattern, with haps containing undefined values removed from
   * query results.
   * @returns Pattern
   * @noAutocomplete
   */
  removeUndefineds() {
    return this.filterValues((t) => t != null);
  }
  /**
   * Returns a new pattern, with all haps without onsets filtered out. A hap
   * with an onset is one with a `whole` timespan that begins at the same time
   * as its `part` timespan.
   * @returns Pattern
   * @noAutocomplete
   */
  onsetsOnly() {
    return this.filterHaps((t) => t.hasOnset());
  }
  /**
   * Returns a new pattern, with 'continuous' haps (those without 'whole'
   * timespans) removed from query results.
   * @returns Pattern
   * @noAutocomplete
   */
  discreteOnly() {
    return this.filterHaps((t) => t.whole);
  }
  /**
   * Combines adjacent haps with the same value and whole.  Only
   * intended for use in tests.
   * @noAutocomplete
   */
  defragmentHaps() {
    return this.discreteOnly().withHaps((a) => {
      const o = [];
      for (var u = 0; u < a.length; ++u) {
        for (var l = !0, f = a[u]; l; ) {
          const d = JSON.stringify(a[u].value);
          for (var p = !1, g = u + 1; g < a.length; g++) {
            const b = a[g];
            if (f.whole.equals(b.whole)) {
              if (f.part.begin.eq(b.part.end)) {
                if (d === JSON.stringify(b.value)) {
                  f = new Hap(f.whole, new TimeSpan(b.part.begin, f.part.end), f.value), a.splice(g, 1), p = !0;
                  break;
                }
              } else if (b.part.begin.eq(f.part.end) && d == JSON.stringify(b.value)) {
                f = new Hap(f.whole, new TimeSpan(f.part.begin, b.part.end), f.value), a.splice(g, 1), p = !0;
                break;
              }
            }
          }
          l = p;
        }
        o.push(f);
      }
      return o;
    });
  }
  /**
   * Queries the pattern for the first cycle, returning Haps. Mainly of use when
   * debugging a pattern.
   * @param {Boolean} with_context - set to true, otherwise the context field
   * will be stripped from the resulting haps.
   * @returns [Hap]
   * @noAutocomplete
   */
  firstCycle(t = !1) {
    var a = this;
    return t || (a = a.stripContext()), a.query(new State(new TimeSpan(fraction$1(0), fraction$1(1))));
  }
  /**
   * Accessor for a list of values returned by querying the first cycle.
   * @noAutocomplete
   */
  get firstCycleValues() {
    return this.firstCycle().map((t) => t.value);
  }
  /**
   * More human-readable version of the `firstCycleValues` accessor.
   * @noAutocomplete
   */
  get showFirstCycle() {
    return this.firstCycle().map(
      (t) => `${t.value}: ${t.whole.begin.toFraction()} - ${t.whole.end.toFraction()}`
    );
  }
  /**
   * Returns a new pattern, which returns haps sorted in temporal order. Mainly
   * of use when comparing two patterns for equality, in tests.
   * @returns Pattern
   * @noAutocomplete
   */
  sortHapsByPart() {
    return this.withHaps(
      (t) => t.sort(
        (a, o) => a.part.begin.sub(o.part.begin).or(a.part.end.sub(o.part.end)).or(a.whole.begin.sub(o.whole.begin).or(a.whole.end.sub(o.whole.end)))
      )
    );
  }
  asNumber() {
    return this.fmap(parseNumeral);
  }
  //////////////////////////////////////////////////////////////////////
  // Operators - see 'make composers' later..
  _opIn(t, a) {
    return this.fmap(a).appLeft(reify(t));
  }
  _opOut(t, a) {
    return this.fmap(a).appRight(reify(t));
  }
  _opMix(t, a) {
    return this.fmap(a).appBoth(reify(t));
  }
  _opSqueeze(t, a) {
    const o = reify(t);
    return this.fmap((u) => o.fmap((l) => a(u)(l))).squeezeJoin();
  }
  _opSqueezeOut(t, a) {
    const o = this;
    return reify(t).fmap((l) => o.fmap((f) => a(f)(l))).squeezeJoin();
  }
  _opReset(t, a) {
    return reify(t).fmap((u) => this.fmap((l) => a(l)(u))).resetJoin();
  }
  _opRestart(t, a) {
    return reify(t).fmap((u) => this.fmap((l) => a(l)(u))).restartJoin();
  }
  _opPoly(t, a) {
    const o = reify(t);
    return this.fmap((u) => o.fmap((l) => a(l)(u))).polyJoin();
  }
  //////////////////////////////////////////////////////////////////////
  // End-user methods.
  // Those beginning with an underscore (_) are 'patternified',
  // i.e. versions are created without the underscore, that are
  // magically transformed to accept patterns for all their arguments.
  //////////////////////////////////////////////////////////////////////
  // Methods without corresponding toplevel functions
  /**
   * Layers the result of the given function(s). Like `superimpose`, but without the original pattern:
   * @name layer
   * @memberof Pattern
   * @synonyms apply
   * @returns Pattern
   * @example
   * "<0 2 4 6 ~ 4 ~ 2 0!3 ~!5>*8"
   *   .layer(x=>x.add("0,2"))
   *   .scale('C minor').note()
   */
  layer(...t) {
    return stack(...t.map((a) => a(this)));
  }
  /**
   * Superimposes the result of the given function(s) on top of the original pattern:
   * @name superimpose
   * @memberof Pattern
   * @returns Pattern
   * @example
   * "<0 2 4 6 ~ 4 ~ 2 0!3 ~!5>*8"
   *   .superimpose(x=>x.add(2))
   *   .scale('C minor').note()
   */
  superimpose(...t) {
    return this.stack(...t.map((a) => a(this)));
  }
  //////////////////////////////////////////////////////////////////////
  // Multi-pattern functions
  stack(...t) {
    return stack(this, ...t);
  }
  sequence(...t) {
    return sequence(this, ...t);
  }
  seq(...t) {
    return sequence(this, ...t);
  }
  cat(...t) {
    return cat(this, ...t);
  }
  fastcat(...t) {
    return fastcat(this, ...t);
  }
  slowcat(...t) {
    return slowcat(this, ...t);
  }
  //////////////////////////////////////////////////////////////////////
  // Context methods - ones that deal with metadata
  onTrigger(t, a = !0) {
    return this.withHap(
      (o) => o.setContext({
        ...o.context,
        onTrigger: (...u) => {
          o.context.onTrigger?.(...u), t(...u);
        },
        // if dominantTrigger is set to true, the default output (webaudio) will be disabled
        // when using multiple triggers, you cannot flip this flag to false again!
        // example: x.csound('CooLSynth').log() as well as x.log().csound('CooLSynth') should work the same
        dominantTrigger: o.context.dominantTrigger || a
      })
    );
  }
  /**
   * Writes the content of the current event to the console (visible in the side menu).
   * @name log
   * @memberof Pattern
   * @example
   * s("bd sd").log()
   */
  log(t = (o) => `[hap] ${o.showWhole(!0)}`, a = (o) => ({ hap: o })) {
    return this.onTrigger((...o) => {
      logger$2(t(...o), void 0, a(...o));
    }, !1);
  }
  /**
   * A simplified version of `log` which writes all "values" (various configurable parameters)
   * within the event to the console (visible in the side menu).
   * @name logValues
   * @memberof Pattern
   * @example
   * s("bd sd").gain("0.25 0.5 1").n("2 1 0").logValues()
   */
  logValues(t = (a) => `[hap] ${stringifyValues(a, !0)}`) {
    return this.log((a) => t(a.value));
  }
  //////////////////////////////////////////////////////////////////////
  // Visualisation
  drawLine() {
    return console.log(drawLine(this)), this;
  }
  //////////////////////////////////////////////////////////////////////
  // methods relating to breaking patterns into subcycles
  // Breaks a pattern into a pattern of patterns, according to the structure of the given binary pattern.
  unjoin(t, a = id) {
    return t.withHap(
      (o) => o.withValue((u) => u ? a(this.ribbon(o.whole.begin, o.whole.duration)) : this)
    );
  }
  /**
   * Breaks a pattern into pieces according to the structure of a given pattern.
   * True values in the given pattern cause the corresponding subcycle of the
   * source pattern to be looped, and for an (optional) given function to be
   * applied. False values result in the corresponding part of the source pattern
   * to be played unchanged.
   * @name into
   * @memberof Pattern
   * @example
   * sound("bd sd ht lt").into("1 0", hurry(2))
   */
  into(t, a) {
    return this.unjoin(t, a).innerJoin();
  }
};
function groupHapsBy(e, t) {
  let a = [];
  return t.forEach((o) => {
    const u = a.findIndex(([l]) => e(o, l));
    u === -1 ? a.push([o]) : a[u].push(o);
  }), a;
}
const congruent = (e, t) => e.spanEquals(t);
Pattern$1.prototype.collect = function() {
  return this.withHaps(
    (e) => groupHapsBy(congruent, e).map((t) => new Hap(t[0].whole, t[0].part, t, {}))
  );
};
const arpWith = register("arpWith", (e, t) => t.collect().fmap((a) => reify(e(a))).innerJoin().withHap((a) => new Hap(a.whole, a.part, a.value.value, a.combineContext(a.value)))), arp = register(
  "arp",
  (e, t) => t.arpWith((a) => reify(e).fmap((o) => a[o % a.length])),
  !1
);
function _nonArrayObject(e) {
  return !Array.isArray(e) && typeof e == "object" && !isFraction(e);
}
function _composeOp(e, t, a) {
  return _nonArrayObject(e) || _nonArrayObject(t) ? (_nonArrayObject(e) || (e = { value: e }), _nonArrayObject(t) || (t = { value: t }), unionWithObj(e, t, a)) : a(e, t);
}
(function() {
  const e = {
    set: [(a, o) => o],
    keep: [(a) => a],
    keepif: [(a, o) => o ? a : void 0],
    // numerical functions
    /**
     *
     * Assumes a pattern of numbers. Adds the given number to each item in the pattern.
     * @name add
     * @memberof Pattern
     * @example
     * // Here, the triad 0, 2, 4 is shifted by different amounts
     * n("0 2 4".add("<0 3 4 0>")).scale("C:major")
     * // Without add, the equivalent would be:
     * // n("<[0 2 4] [3 5 7] [4 6 8] [0 2 4]>").scale("C:major")
     * @example
     * // You can also use add with notes:
     * note("c3 e3 g3".add("<0 5 7 0>"))
     * // Behind the scenes, the notes are converted to midi numbers:
     * // note("48 52 55".add("<0 5 7 0>"))
     */
    add: [numeralArgs((a, o) => a + o)],
    // support string concatenation
    /**
     *
     * Like add, but the given numbers are subtracted.
     * @name sub
     * @memberof Pattern
     * @example
     * n("0 2 4".sub("<0 1 2 3>")).scale("C4:minor")
     * // See add for more information.
     */
    sub: [numeralArgs((a, o) => a - o)],
    /**
     *
     * Multiplies each number by the given factor.
     * @name mul
     * @memberof Pattern
     * @example
     * "<1 1.5 [1.66, <2 2.33>]>*4".mul(150).freq()
     */
    mul: [numeralArgs((a, o) => a * o)],
    /**
     *
     * Divides each number by the given factor.
     * @name div
     * @memberof Pattern
     */
    div: [numeralArgs((a, o) => a / o)],
    mod: [numeralArgs(_mod$2)],
    pow: [numeralArgs(Math.pow)],
    log2: [numeralArgs(Math.log2)],
    band: [numeralArgs((a, o) => a & o)],
    bor: [numeralArgs((a, o) => a | o)],
    bxor: [numeralArgs((a, o) => a ^ o)],
    blshift: [numeralArgs((a, o) => a << o)],
    brshift: [numeralArgs((a, o) => a >> o)],
    // TODO - force numerical comparison if both look like numbers?
    lt: [(a, o) => a < o],
    gt: [(a, o) => a > o],
    lte: [(a, o) => a <= o],
    gte: [(a, o) => a >= o],
    eq: [(a, o) => a == o],
    eqt: [(a, o) => a === o],
    ne: [(a, o) => a != o],
    net: [(a, o) => a !== o],
    and: [(a, o) => a && o],
    or: [(a, o) => a || o],
    //  bitwise ops
    func: [(a, o) => o(a)]
  }, t = ["In", "Out", "Mix", "Squeeze", "SqueezeOut", "Reset", "Restart", "Poly"];
  for (const [a, [o, u]] of Object.entries(e)) {
    Pattern$1.prototype["_" + a] = function(l) {
      return this.fmap((f) => o(f, l));
    }, Object.defineProperty(Pattern$1.prototype, a, {
      // a getter that returns a function, so 'pat' can be
      // accessed by closures that are methods of that function..
      get: function() {
        const l = this, f = (...p) => l[a].in(...p);
        for (const p of t)
          f[p.toLowerCase()] = function(...g) {
            var d = l;
            g = sequence(g), u && (d = u(d), g = u(g));
            var b;
            return a === "keepif" ? (b = d["_op" + p](g, (F) => (E) => o(F, E)), b = b.removeUndefineds()) : b = d["_op" + p](g, (F) => (E) => _composeOp(F, E, o)), b;
          };
        return f.squeezein = f.squeeze, f;
      }
    });
    for (const l of t)
      Pattern$1.prototype[l.toLowerCase()] = function(...f) {
        return this.set[l.toLowerCase()](f);
      };
  }
  Pattern$1.prototype.struct = function(...a) {
    return this.keepif.out(...a);
  }, Pattern$1.prototype.structAll = function(...a) {
    return this.keep.out(...a);
  }, Pattern$1.prototype.mask = function(...a) {
    return this.keepif.in(...a);
  }, Pattern$1.prototype.maskAll = function(...a) {
    return this.keep.in(...a);
  }, Pattern$1.prototype.reset = function(...a) {
    return this.keepif.reset(...a);
  }, Pattern$1.prototype.resetAll = function(...a) {
    return this.keep.reset(...a);
  }, Pattern$1.prototype.restart = function(...a) {
    return this.keepif.restart(...a);
  }, Pattern$1.prototype.restartAll = function(...a) {
    return this.keep.restart(...a);
  };
})();
const polyrhythm = stack, pr = stack, pm = polymeter, gap = (e) => new Pattern$1(() => [], e), silence = gap(1), nothing = gap(0);
function pure(e) {
  function t(o) {
    return o.span.spanCycles.map((u) => new Hap(fraction$1(u.begin).wholeCycle(), u, e));
  }
  const a = new Pattern$1(t, 1);
  return a.__pure = e, a;
}
function isPattern(e) {
  return e instanceof Pattern$1 || e?._Pattern;
}
function reify(e) {
  return isPattern(e) ? e : stringParser && typeof e == "string" ? stringParser(e) : pure(e);
}
function sequenceP(e) {
  let t = pure([]);
  for (const a of e)
    t = t.bind((o) => a.fmap((u) => o.concat([u])));
  return t;
}
function stack(...e) {
  e = e.map((o) => Array.isArray(o) ? sequence(...o) : reify(o));
  const t = (o) => flatten(e.map((u) => u.query(o))), a = new Pattern$1(t);
  return __steps && (a._steps = lcm(...e.map((o) => o._steps))), a;
}
function _stackWith(e, t) {
  if (t = t.map((l) => Array.isArray(l) ? sequence(...l) : reify(l)), t.length === 0)
    return silence;
  if (t.length === 1)
    return t[0];
  const [a, ...o] = t.map((l) => l._steps), u = __steps ? a.maximum(...o) : void 0;
  return stack(...e(u, t));
}
function stackLeft(...e) {
  return _stackWith(
    (t, a) => a.map((o) => o._steps.eq(t) ? o : stepcat(o, gap(t.sub(o._steps)))),
    e
  );
}
function stackRight(...e) {
  return _stackWith(
    (t, a) => a.map((o) => o._steps.eq(t) ? o : stepcat(gap(t.sub(o._steps)), o)),
    e
  );
}
function stackCentre(...e) {
  return _stackWith(
    (t, a) => a.map((o) => {
      if (o._steps.eq(t))
        return o;
      const u = gap(t.sub(o._steps).div(2));
      return stepcat(u, o, u);
    }),
    e
  );
}
function stackBy(e, ...t) {
  const [a, ...o] = t.map((f) => f._steps), u = a.maximum(...o), l = {
    centre: stackCentre,
    left: stackLeft,
    right: stackRight,
    expand: stack,
    repeat: (...f) => polymeter(...f).steps(u)
  };
  return e.inhabit(l).fmap((f) => f(...t)).innerJoin().setSteps(u);
}
function slowcat(...e) {
  if (e = e.map((o) => Array.isArray(o) ? fastcat(...o) : reify(o)), e.length == 1)
    return e[0];
  const t = function(o) {
    const u = o.span, l = _mod$2(u.begin.sam(), e.length), f = e[l];
    if (!f)
      return [];
    const p = u.begin.floor().sub(u.begin.div(e.length).floor());
    return f.withHapTime((g) => g.add(p)).query(o.setSpan(u.withTime((g) => g.sub(p))));
  }, a = __steps ? lcm(...e.map((o) => o._steps)) : void 0;
  return new Pattern$1(t).splitQueries().setSteps(a);
}
function slowcatPrime(...e) {
  e = e.map(reify);
  const t = function(a) {
    const o = Math.floor(a.span.begin) % e.length;
    return e[o]?.query(a) || [];
  };
  return new Pattern$1(t).splitQueries();
}
function cat(...e) {
  return slowcat(...e);
}
function arrange(...e) {
  const t = e.reduce((a, [o]) => a + o, 0);
  return e = e.map(([a, o]) => [a, o.fast(a)]), stepcat(...e).slow(t);
}
function seqPLoop(...e) {
  let t = fraction$1(0);
  for (let a of e)
    a.length == 2 && a.unshift(t), t = a[1];
  return stack(
    ...e.map(
      ([a, o, u]) => pure(reify(u)).compress(fraction$1(a).div(t), fraction$1(o).div(t))
    )
  ).slow(t).innerJoin();
}
function fastcat(...e) {
  let t = slowcat(...e);
  return e.length > 1 && (t = t._fast(e.length), t._steps = e.length), e.length == 1 && e[0].__steps_source && (e._steps = e[0]._steps), t;
}
function sequence(...e) {
  return fastcat(...e);
}
function seq(...e) {
  return fastcat(...e);
}
function _sequenceCount(e) {
  return Array.isArray(e) ? e.length == 0 ? [silence, 0] : e.length == 1 ? _sequenceCount(e[0]) : [fastcat(...e.map((t) => _sequenceCount(t)[0])), e.length] : [reify(e), 1];
}
const mask = curry((e, t) => reify(t).mask(e)), struct = curry((e, t) => reify(t).struct(e)), superimpose = curry((e, t) => reify(t).superimpose(...e)), withValue = curry((e, t) => reify(t).withValue(e)), bind = curry((e, t) => reify(t).bind(e)), innerBind = curry((e, t) => reify(t).innerBind(e)), outerBind = curry((e, t) => reify(t).outerBind(e)), squeezeBind = curry((e, t) => reify(t).squeezeBind(e)), stepBind = curry((e, t) => reify(t).stepBind(e)), polyBind = curry((e, t) => reify(t).polyBind(e)), set = curry((e, t) => reify(t).set(e)), keep = curry((e, t) => reify(t).keep(e)), keepif = curry((e, t) => reify(t).keepif(e)), add$5 = curry((e, t) => reify(t).add(e)), sub = curry((e, t) => reify(t).sub(e)), mul = curry((e, t) => reify(t).mul(e)), div = curry((e, t) => reify(t).div(e)), mod$3 = curry((e, t) => reify(t).mod(e)), pow = curry((e, t) => reify(t).pow(e)), band = curry((e, t) => reify(t).band(e)), bor = curry((e, t) => reify(t).bor(e)), bxor = curry((e, t) => reify(t).bxor(e)), blshift = curry((e, t) => reify(t).blshift(e)), brshift = curry((e, t) => reify(t).brshift(e)), lt = curry((e, t) => reify(t).lt(e)), gt = curry((e, t) => reify(t).gt(e)), lte = curry((e, t) => reify(t).lte(e)), gte = curry((e, t) => reify(t).gte(e)), eq = curry((e, t) => reify(t).eq(e)), eqt = curry((e, t) => reify(t).eqt(e)), ne = curry((e, t) => reify(t).ne(e)), net = curry((e, t) => reify(t).net(e)), and = curry((e, t) => reify(t).and(e)), or = curry((e, t) => reify(t).or(e)), func = curry((e, t) => reify(t).func(e));
function register(e, t, a = !0, o = !1, u = (l) => l.innerJoin()) {
  if (Array.isArray(e)) {
    const p = {};
    for (const g of e)
      p[g] = register(g, t, a, o, u);
    return p;
  }
  const l = t.length;
  var f;
  return a ? f = function(...p) {
    p = p.map(reify);
    const g = p[p.length - 1];
    let d;
    if (l === 1)
      d = t(g);
    else {
      const b = p.slice(0, -1);
      if (b.every((F) => F.__pure != null)) {
        const F = b.map((S) => S.__pure), E = b.filter((S) => S.__pure_loc).map((S) => S.__pure_loc);
        d = t(...F, g), d = d.withContext((S) => {
          const R = (S.locations || []).concat(E);
          return { ...S, locations: R };
        });
      } else {
        const [F, ...E] = b;
        let S = (...R) => t(...R, g);
        S = curry(S, null, l - 1), d = u(E.reduce((R, k) => R.appLeft(k), F.fmap(S)));
      }
    }
    return o && (d._steps = g._steps), d;
  } : f = function(...p) {
    p = p.map(reify);
    const g = t(...p);
    return o && (g._steps = p[p.length - 1]._steps), g;
  }, Pattern$1.prototype[e] = function(...p) {
    if (l === 2 && p.length !== 1)
      p = [sequence(...p)];
    else if (l !== p.length + 1)
      throw new Error(`.${e}() expects ${l - 1} inputs but got ${p.length}.`);
    return p = p.map(reify), f(...p, this);
  }, l > 1 && (Pattern$1.prototype["_" + e] = function(...p) {
    const g = t(...p, this);
    return o && g.setSteps(this._steps), g;
  }), curry(f, null, l);
}
function stepRegister(e, t, a = !0, o = !1, u = (l) => l.stepJoin()) {
  return register(e, t, a, o, u);
}
const round = register("round", function(e) {
  return e.asNumber().fmap((t) => Math.round(t));
}), floor = register("floor", function(e) {
  return e.asNumber().fmap((t) => Math.floor(t));
}), ceil = register("ceil", function(e) {
  return e.asNumber().fmap((t) => Math.ceil(t));
}), toBipolar = register("toBipolar", function(e) {
  return e.fmap((t) => t * 2 - 1);
}), fromBipolar = register("fromBipolar", function(e) {
  return e.fmap((t) => (t + 1) / 2);
}), range$2 = register("range", function(e, t, a) {
  return a.mul(t - e).add(e);
}), rangex = register("rangex", function(e, t, a) {
  return a._range(Math.log(e), Math.log(t)).fmap(Math.exp);
}), range2 = register("range2", function(e, t, a) {
  return a.fromBipolar()._range(e, t);
}), ratio = register(
  "ratio",
  (e) => e.fmap((t) => Array.isArray(t) ? t.slice(1).reduce((a, o) => a / o, t[0]) : t)
), compress = register("compress", function(e, t, a) {
  return e = fraction$1(e), t = fraction$1(t), e.gt(t) || e.gt(1) || t.gt(1) || e.lt(0) || t.lt(0) ? silence : a._fastGap(fraction$1(1).div(t.sub(e)))._late(e);
}), { compressSpan, compressspan } = register(["compressSpan", "compressspan"], function(e, t) {
  return t._compress(e.begin, e.end);
}), { fastGap, fastgap } = register(["fastGap", "fastgap"], function(e, t) {
  const a = function(u) {
    const l = u.begin.sam(), f = u.begin.sub(l).mul(e).min(1), p = u.end.sub(l).mul(e).min(1);
    if (!(f >= 1))
      return new TimeSpan(l.add(f), l.add(p));
  }, o = function(u) {
    const l = u.part.begin, f = u.part.end, p = l.sam(), g = l.sub(p).div(e).min(1), d = f.sub(p).div(e).min(1), b = new TimeSpan(p.add(g), p.add(d)), F = u.whole ? new TimeSpan(
      b.begin.sub(l.sub(u.whole.begin).div(e)),
      b.end.add(u.whole.end.sub(f).div(e))
    ) : void 0;
    return new Hap(F, b, u.value, u.context);
  };
  return t.withQuerySpanMaybe(a).withHap(o).splitQueries();
}), focus = register("focus", function(e, t, a) {
  return e = fraction$1(e), t = fraction$1(t), a._early(e.sam())._fast(fraction$1(1).div(t.sub(e)))._late(e);
}), { focusSpan, focusspan } = register(["focusSpan", "focusspan"], function(e, t) {
  return t._focus(e.begin, e.end);
}), ply = register("ply", function(e, t) {
  const a = t.fmap((o) => pure(o)._fast(e)).squeezeJoin();
  return __steps && (a._steps = fraction$1(e).mulmaybe(t._steps)), a;
}), { fast, density: density$1 } = register(
  ["fast", "density"],
  function(e, t) {
    return e === 0 ? silence : (e = fraction$1(e), t.withQueryTime((o) => o.mul(e)).withHapTime((o) => o.div(e)).setSteps(t._steps));
  },
  !0,
  !0
), hurry = register("hurry", function(e, t) {
  return t._fast(e).mul(pure({ speed: e }));
}), { slow, sparsity } = register(["slow", "sparsity"], function(e, t) {
  return e === 0 ? silence : t._fast(fraction$1(1).div(e));
}), inside = register("inside", function(e, t, a) {
  return t(a._slow(e))._fast(e);
}), outside = register("outside", function(e, t, a) {
  return t(a._fast(e))._slow(e);
}), lastOf = register("lastOf", function(e, t, a) {
  const o = Array(e - 1).fill(a);
  return o.push(t(a)), slowcatPrime(...o);
}), { firstOf, every } = register(["firstOf", "every"], function(e, t, a) {
  const o = Array(e - 1).fill(a);
  return o.unshift(t(a)), slowcatPrime(...o);
}), apply = register("apply", function(e, t) {
  return e(t);
}), cpm = register("cpm", function(e, t) {
  return t._fast(e / 60 / 1);
}), early = register(
  "early",
  function(e, t) {
    return e = fraction$1(e), t.withQueryTime((a) => a.add(e)).withHapTime((a) => a.sub(e));
  },
  !0,
  !0
), late = register(
  "late",
  function(e, t) {
    return e = fraction$1(e), t._early(fraction$1(0).sub(e));
  },
  !0,
  !0
), zoom = register("zoom", function(e, t, a) {
  if (t = fraction$1(t), e = fraction$1(e), e.gte(t))
    return nothing;
  const o = t.sub(e), u = __steps ? a._steps?.mulmaybe(o) : void 0;
  return a.withQuerySpan((l) => l.withCycle((f) => f.mul(o).add(e))).withHapSpan((l) => l.withCycle((f) => f.sub(e).div(o))).splitQueries().setSteps(u);
}), { zoomArc, zoomarc } = register(["zoomArc", "zoomarc"], function(e, t) {
  return t.zoom(e.begin, e.end);
}), bite = register(
  "bite",
  (e, t, a) => t.fmap((o) => (u) => {
    const l = fraction$1(o).div(u).mod(1), f = l.add(fraction$1(1).div(u));
    return a.zoom(l, f);
  }).appLeft(e).squeezeJoin(),
  !1
), linger = register(
  "linger",
  function(e, t) {
    return e == 0 ? silence : e < 0 ? t._zoom(e.add(1), 1)._slow(e) : t._zoom(0, e)._slow(e);
  },
  !0,
  !0
), { segment, seg } = register(["segment", "seg"], function(e, t) {
  return t.struct(pure(!0)._fast(e)).setSteps(e);
}), swingBy = register("swingBy", (e, t, a) => a.inside(t, late(seq(0, e / 2)))), swing = register("swing", (e, t) => t.swingBy(1 / 3, e)), { invert: invert$1, inv } = register(
  ["invert", "inv"],
  function(e) {
    return e.fmap((t) => !t);
  },
  !0,
  !0
), when = register("when", function(e, t, a) {
  return e ? t(a) : a;
}), off = register("off", function(e, t, a) {
  return stack(a, t(a.late(e)));
}), brak = register("brak", function(e) {
  return e.when(slowcat(!1, !0), (t) => fastcat(t, silence)._late(0.25));
}), rev = register(
  "rev",
  function(e) {
    const t = function(a) {
      const o = a.span, u = o.begin.sam(), l = o.begin.nextSam(), f = function(g) {
        const d = g.withTime((F) => u.add(l.sub(F))), b = d.begin;
        return d.begin = d.end, d.end = b, d;
      };
      return e.query(a.setSpan(f(o))).map((g) => g.withSpan(f));
    };
    return new Pattern$1(t).splitQueries();
  },
  !1,
  !0
), pressBy = register("pressBy", function(e, t) {
  return t.fmap((a) => pure(a).compress(e, 1)).squeezeJoin();
}), press = register("press", function(e) {
  return e._pressBy(0.5);
});
Pattern$1.prototype.hush = function() {
  return silence;
};
const palindrome = register(
  "palindrome",
  function(e) {
    return e.lastOf(2, rev);
  },
  !0,
  !0
), { juxBy, juxby } = register(["juxBy", "juxby"], function(e, t, a) {
  e /= 2;
  const o = function(f, p, g) {
    return p in f ? f[p] : g;
  }, u = a.withValue((f) => Object.assign({}, f, { pan: o(f, "pan", 0.5) - e })), l = t(a.withValue((f) => Object.assign({}, f, { pan: o(f, "pan", 0.5) + e })));
  return stack(u, l).setSteps(__steps ? lcm(u._steps, l._steps) : void 0);
}), jux = register("jux", function(e, t) {
  return t._juxBy(1, e, t);
}), { echoWith, echowith, stutWith, stutwith } = register(
  ["echoWith", "echowith", "stutWith", "stutwith"],
  function(e, t, a, o) {
    return stack(...listRange(0, e - 1).map((u) => a(o.late(fraction$1(t).mul(u)), u)));
  }
), echo = register("echo", function(e, t, a, o) {
  return o._echoWith(e, t, (u, l) => u.gain(Math.pow(a, l)));
}), stut = register("stut", function(e, t, a, o) {
  return o._echoWith(e, a, (u, l) => u.gain(Math.pow(t, l)));
}), applyN = register("applyN", function(e, t, a) {
  let o = a;
  for (let u = 0; u < e; u++)
    o = t(o);
  return o;
}), plyWith = register(["plyWith", "plywith"], function(e, t, a) {
  const o = a.fmap((u) => cat(...listRange(0, e - 1).map((l) => applyN(l, t, u)))._fast(e)).squeezeJoin();
  return __steps && (o._steps = fraction$1(e).mulmaybe(a._steps)), o;
}), plyForEach = register(["plyForEach", "plyforeach"], function(e, t, a) {
  const o = a.fmap((u) => cat(cat(pure(u), ...listRange(1, e - 1).map((l) => t(pure(u), l))))._fast(e)).squeezeJoin();
  return __steps && (o._steps = fraction$1(e).mulmaybe(a._steps)), o;
}), _iter = function(e, t, a = !1) {
  return e = fraction$1(e), slowcat(
    ...listRange(0, e.sub(1)).map(
      (o) => a ? t.late(fraction$1(o).div(e)) : t.early(fraction$1(o).div(e))
    )
  );
}, iter = register(
  "iter",
  function(e, t) {
    return _iter(e, t, !1);
  },
  !0,
  !0
), { iterBack, iterback } = register(
  ["iterBack", "iterback"],
  function(e, t) {
    return _iter(e, t, !0);
  },
  !0,
  !0
), { repeatCycles } = register(
  "repeatCycles",
  function(e, t) {
    return new Pattern$1(function(a) {
      const o = a.span.begin.sam(), u = o.div(e).sam(), l = o.sub(u);
      return a = a.withSpan((f) => f.withTime((p) => p.sub(l))), t.query(a).map((f) => f.withSpan((p) => p.withTime((g) => g.add(l))));
    }).splitQueries();
  },
  !0,
  !0
), _chunk = function(e, t, a, o = !1, u = !1) {
  const l = Array(e - 1).fill(!1);
  l.unshift(!0);
  const f = _iter(e, sequence(...l), !o);
  return u || (a = a.repeatCycles(e)), a.when(f, t);
}, { chunk, slowchunk, slowChunk } = register(
  ["chunk", "slowchunk", "slowChunk"],
  function(e, t, a) {
    return _chunk(e, t, a, !1, !1);
  },
  !0,
  !0
), { chunkBack, chunkback } = register(
  ["chunkBack", "chunkback"],
  function(e, t, a) {
    return _chunk(e, t, a, !0);
  },
  !0,
  !0
), { fastchunk, fastChunk } = register(
  ["fastchunk", "fastChunk"],
  function(e, t, a) {
    return _chunk(e, t, a, !1, !0);
  },
  !0,
  !0
), { chunkinto, chunkInto } = register(["chunkinto", "chunkInto"], function(e, t, a) {
  return a.into(fastcat(!0, ...Array(e - 1).fill(!1))._iterback(e), t);
}), { chunkbackinto, chunkBackInto } = register(["chunkbackinto", "chunkBackInto"], function(e, t, a) {
  return a.into(
    fastcat(!0, ...Array(e - 1).fill(!1))._iter(e)._early(1),
    t
  );
}), bypass = register(
  "bypass",
  function(e, t) {
    return e = !!parseInt(e), e ? silence : t;
  },
  !0,
  !0
), { ribbon, rib } = register(
  ["ribbon", "rib"],
  (e, t, a) => a.early(e).restart(pure(1).slow(t))
), hsla = register("hsla", (e, t, a, o, u) => u.color(`hsla(${e}turn,${t * 100}%,${a * 100}%,${o})`)), hsl = register("hsl", (e, t, a, o) => o.color(`hsl(${e}turn,${t * 100}%,${a * 100}%)`));
Pattern$1.prototype.tag = function(e) {
  return this.withContext((t) => ({ ...t, tags: (t.tags || []).concat([e]) }));
};
const filter$1 = register("filter", (e, t) => t.withHaps((a) => a.filter(e))), filterWhen = register("filterWhen", (e, t) => t.filter((a) => e(a.whole.begin))), within = register(
  "within",
  (e, t, a, o) => stack(
    a(o.filterWhen((u) => u.cyclePos() >= e && u.cyclePos() <= t)),
    o.filterWhen((u) => u.cyclePos() < e || u.cyclePos() > t)
  )
);
Pattern$1.prototype.stepJoin = function() {
  const e = this, t = stepcat(..._retime(_slices(e.queryArc(0, 1))))._steps, a = function(o) {
    const l = e.early(o.span.begin.sam()).query(o.setSpan(new TimeSpan(fraction$1(0), fraction$1(1))));
    return stepcat(..._retime(_slices(l))).query(o);
  };
  return new Pattern$1(a, t);
};
Pattern$1.prototype.stepBind = function(e) {
  return this.fmap(e).stepJoin();
};
function _retime(e) {
  const t = e.filter((l, f) => f.hasSteps).reduce((l, f) => l.add(f), fraction$1(0)), a = removeUndefineds(e.map((l, f) => f._steps)).reduce(
    (l, f) => l.add(f),
    fraction$1(0)
  ), o = t.eq(0) ? void 0 : a.div(t);
  function u(l, f) {
    return f._steps === void 0 ? [l.mulmaybe(o), f] : [f._steps, f];
  }
  return e.map((l) => u(...l));
}
function _slices(e) {
  const t = flatten(e.map((u) => [u.part.begin, u.part.end])), a = uniqsortr([fraction$1(0), fraction$1(1), ...t]);
  return pairs(a).map((u) => [
    u[1].sub(u[0]),
    stack(..._fitslice(new TimeSpan(...u), e).map((l) => l.value.withHap((f) => f.setContext(f.combineContext(l)))))
  ]);
}
function _fitslice(e, t) {
  return removeUndefineds(t.map((a) => _match(e, a)));
}
function _match(e, t) {
  const a = e.intersection(t.part);
  if (a != null)
    return new Hap(t.whole, a, t.value, t.context);
}
const pace = register("pace", function(e, t) {
  return t._steps === void 0 ? t : t._steps.eq(fraction$1(0)) ? nothing : t._fast(fraction$1(e).div(t._steps)).setSteps(e);
});
function _polymeterListSteps(e, ...t) {
  const a = t.map((u) => _sequenceCount(u));
  if (a.length == 0)
    return silence;
  e == 0 && (e = a[0][1]);
  const o = [];
  for (const u of a)
    u[1] != 0 && (e == u[1] ? o.push(u[0]) : o.push(u[0]._fast(fraction$1(e).div(fraction$1(u[1])))));
  return stack(...o);
}
function polymeter(...e) {
  if (Array.isArray(e[0]))
    return _polymeterListSteps(0, ...e);
  if (e = e.filter((o) => o.hasSteps), e.length == 0)
    return silence;
  const t = lcm(...e.map((o) => o._steps));
  if (t.eq(fraction$1(0)))
    return nothing;
  const a = stack(...e.map((o) => o.pace(t)));
  return a._steps = t, a;
}
function stepcat(...e) {
  if (e.length === 0)
    return nothing;
  const t = (f) => Array.isArray(f) ? f : [f._steps ?? 1, f];
  if (e = e.map(t), e.find((f) => f[0] === void 0)) {
    const f = e.map((g) => g[0]).filter((g) => g !== void 0);
    if (f.length === 0)
      return fastcat(...e.map((g) => g[1]));
    if (f.length === e.length)
      return nothing;
    const p = f.reduce((g, d) => g.add(d), fraction$1(0)).div(f.length);
    for (let g of e)
      g[0] === void 0 && (g[0] = p);
  }
  if (e.length == 1)
    return reify(e[0][1]).withSteps((p) => e[0][0]);
  const a = e.map((f) => f[0]).reduce((f, p) => f.add(p), fraction$1(0));
  let o = fraction$1(0);
  const u = [];
  for (const [f, p] of e) {
    if (fraction$1(f).eq(0))
      continue;
    const g = o.add(f);
    u.push(reify(p)._compress(o.div(a), g.div(a))), o = g;
  }
  const l = stack(...u);
  return l._steps = a, l;
}
function stepalt(...e) {
  e = e.map((u) => Array.isArray(u) ? u.map(reify) : [reify(u)]);
  const t = lcm(...e.map((u) => fraction$1(u.length)));
  let a = [];
  for (let u = 0; u < t; ++u)
    a.push(...e.map((l) => l.length == 0 ? silence : l[u % l.length]));
  a = a.filter((u) => u.hasSteps && u._steps > 0);
  const o = a.reduce((u, l) => u.add(l._steps), fraction$1(0));
  return a = stepcat(...a), a._steps = o, a;
}
const take = stepRegister("take", function(e, t) {
  if (!t.hasSteps || t._steps.lte(0) || (e = fraction$1(e), e.eq(0)))
    return nothing;
  const a = e < 0;
  a && (e = e.abs());
  const o = e.div(t._steps);
  return o.lte(0) ? nothing : o.gte(1) ? t : a ? t.zoom(fraction$1(1).sub(o), 1) : t.zoom(0, o);
}), drop = stepRegister("drop", function(e, t) {
  return t.hasSteps ? (e = fraction$1(e), e.lt(0) ? t.take(t._steps.add(e)) : t.take(fraction$1(0).sub(t._steps.sub(e)))) : nothing;
}), extend = stepRegister("extend", function(e, t) {
  return t.fast(e).expand(e);
}), replicate = stepRegister("replicate", function(e, t) {
  return t.repeatCycles(e).fast(e).expand(e);
}), expand = stepRegister("expand", function(e, t) {
  return t.withSteps((a) => a.mul(fraction$1(e)));
}), contract = stepRegister("contract", function(e, t) {
  return t.withSteps((a) => a.div(fraction$1(e)));
});
Pattern$1.prototype.shrinklist = function(e) {
  const t = this;
  if (!t.hasSteps)
    return [t];
  let [a, o] = Array.isArray(e) ? e : [e, t._steps];
  if (a = fraction$1(a), o === 0 || a === 0)
    return [t];
  const u = a > 0, l = [];
  if (u) {
    const f = fraction$1(1).div(t._steps).mul(a);
    for (let p = 0; p < o; ++p) {
      const g = f.mul(p);
      if (g.gt(1))
        break;
      l.push([g, 1]);
    }
  } else {
    a = fraction$1(0).sub(a);
    const f = fraction$1(1).div(t._steps).mul(a);
    for (let p = 0; p < o; ++p) {
      const g = fraction$1(1).sub(f.mul(p));
      if (g.lt(0))
        break;
      l.push([fraction$1(0), g]);
    }
  }
  return l.map((f) => t.zoom(...f));
};
const shrinklist = (e, t) => t.shrinklist(e), shrink = register(
  "shrink",
  function(e, t) {
    if (!t.hasSteps)
      return nothing;
    const a = t.shrinklist(e), o = stepcat(...a);
    return o._steps = a.reduce((u, l) => u.add(l._steps), fraction$1(0)), o;
  },
  !0,
  !1,
  (e) => e.stepJoin()
), grow = register(
  "grow",
  function(e, t) {
    if (!t.hasSteps)
      return nothing;
    const a = t.shrinklist(fraction$1(0).sub(e));
    a.reverse();
    const o = stepcat(...a);
    return o._steps = a.reduce((u, l) => u.add(l._steps), fraction$1(0)), o;
  },
  !0,
  !1,
  (e) => e.stepJoin()
), tour = function(e, ...t) {
  return e.tour(...t);
};
Pattern$1.prototype.tour = function(...e) {
  return stepcat(
    ...[].concat(
      ...e.map((t, a) => [...e.slice(0, e.length - a), this, ...e.slice(e.length - a)]),
      this,
      ...e
    )
  );
};
const zip = function(...e) {
  e = e.filter((o) => o.hasSteps);
  const t = slowcat(...e.map((o) => o._slow(o._steps))), a = lcm(...e.map((o) => o._steps));
  return t._fast(a).setSteps(a);
}, timecat = stepcat, timeCat = stepcat, s_cat = stepcat, s_alt = stepalt, s_polymeter = polymeter;
Pattern$1.prototype.s_polymeter = Pattern$1.prototype.polymeter;
const s_taper = shrink;
Pattern$1.prototype.s_taper = Pattern$1.prototype.shrink;
const s_taperlist = shrinklist;
Pattern$1.prototype.s_taperlist = Pattern$1.prototype.shrinklist;
const s_add = take;
Pattern$1.prototype.s_add = Pattern$1.prototype.take;
const s_sub = drop;
Pattern$1.prototype.s_sub = Pattern$1.prototype.drop;
const s_expand = expand;
Pattern$1.prototype.s_expand = Pattern$1.prototype.expand;
const s_extend = extend;
Pattern$1.prototype.s_extend = Pattern$1.prototype.extend;
const s_contract = contract;
Pattern$1.prototype.s_contract = Pattern$1.prototype.contract;
const s_tour = tour;
Pattern$1.prototype.s_tour = Pattern$1.prototype.tour;
const s_zip = zip;
Pattern$1.prototype.s_zip = Pattern$1.prototype.zip;
const steps$2 = pace;
Pattern$1.prototype.steps = Pattern$1.prototype.pace;
const chop = register("chop", function(e, t) {
  const o = Array.from({ length: e }, (f, p) => p).map((f) => ({ begin: f / e, end: (f + 1) / e })), u = function(f, p) {
    if ("begin" in f && "end" in f && f.begin !== void 0 && f.end !== void 0) {
      const g = f.end - f.begin;
      p = { begin: f.begin + p.begin * g, end: f.begin + p.end * g };
    }
    return Object.assign({}, f, p);
  }, l = function(f) {
    return sequence(o.map((p) => u(f, p)));
  };
  return t.squeezeBind(l).setSteps(__steps ? fraction$1(e).mulmaybe(t._steps) : void 0);
}), striate = register("striate", function(e, t) {
  const o = Array.from({ length: e }, (l, f) => f).map((l) => ({ begin: l / e, end: (l + 1) / e })), u = slowcat(...o);
  return t.set(u)._fast(e).setSteps(__steps ? fraction$1(e).mulmaybe(t._steps) : void 0);
}), _loopAt = function(e, t, a = 0.5) {
  return t.speed(1 / e * a).unit("c").slow(e);
}, slice = register(
  "slice",
  function(e, t, a) {
    return e.innerBind(
      (o) => t.outerBind(
        (u) => a.outerBind((l) => {
          l = l instanceof Object ? l : { s: l };
          const f = Array.isArray(o) ? o[u] : u / o, p = Array.isArray(o) ? o[u + 1] : (u + 1) / o;
          return pure({ begin: f, end: p, _slices: o, ...l });
        })
      )
    ).setSteps(t._steps);
  },
  !1
  // turns off auto-patternification
);
Pattern$1.prototype.onTriggerTime = function(e) {
  return this.onTrigger((t, a, o, u) => {
    const l = u - a;
    window.setTimeout(() => {
      e(t);
    }, l * 1e3);
  }, !1);
};
const splice = register(
  "splice",
  function(e, t, a) {
    const o = slice(e, t, a);
    return new Pattern$1((u) => {
      const l = u.controls._cps || 1;
      return o.query(u).map(
        (p) => p.withValue((g) => ({
          speed: l / g._slices / p.whole.duration * (g.speed || 1),
          unit: "c",
          ...g
        }))
      );
    }).setSteps(t._steps);
  },
  !1
  // turns off auto-patternification
), { loopAt, loopat } = register(["loopAt", "loopat"], function(e, t) {
  const a = t._steps ? t._steps.div(e) : void 0;
  return new Pattern$1((o) => _loopAt(e, t, o.controls._cps).query(o), a);
}), fit = register(
  "fit",
  (e) => e.withHaps(
    (t, a) => t.map(
      (o) => o.withValue((u) => {
        const l = ("end" in u ? u.end : 1) - ("begin" in u ? u.begin : 0);
        return {
          ...u,
          speed: (a.controls._cps || 1) / o.whole.duration * l,
          unit: "c"
        };
      })
    )
  )
), { loopAtCps, loopatcps } = register(["loopAtCps", "loopatcps"], function(e, t, a) {
  return _loopAt(e, a, t);
}), ref$1 = (e) => pure(1).withValue(() => reify(e())).innerJoin();
let fadeGain = (e) => e < 0.5 ? 1 : 1 - (e - 0.5) / 0.5, xfade = (e, t, a) => {
  t = reify(t), e = reify(e), a = reify(a);
  let o = t.fmap((l) => ({ gain: fadeGain(l) })), u = t.fmap((l) => ({ gain: fadeGain(1 - l) }));
  return stack(e.mul(o), a.mul(u));
};
Pattern$1.prototype.xfade = function(e, t) {
  return xfade(this, e, t);
};
const __beat = (e) => (t, a, o) => {
  t = fraction$1(t).mod(a), a = fraction$1(a);
  const u = t.div(a), l = t.add(1).div(a);
  return e(o.fmap((f) => pure(f)._compress(u, l)));
}, { beat } = register(
  ["beat"],
  __beat((e) => e.innerJoin())
), _morph = (e, t, a) => {
  a = fraction$1(a);
  const o = fraction$1(1).div(e.length), u = (p) => {
    const g = [];
    for (const [d, b] of p.entries())
      b && g.push([fraction$1(d).div(p.length), b]);
    return g;
  }, l = zipWith(
    ([p, g], [d, b]) => {
      const F = a.mul(d - p).add(p), E = F.add(o);
      return new TimeSpan(F, E);
    },
    u(e),
    u(t)
  );
  function f(p) {
    const g = p.span.begin.sam(), d = p.span.cycleArc(), b = [];
    for (const F of l) {
      const E = F.intersection(d);
      E !== void 0 && b.push(
        new Hap(
          F.withTime((S) => S.add(g)),
          E.withTime((S) => S.add(g)),
          !0
        )
      );
    }
    return b;
  }
  return new Pattern$1(f).splitQueries();
}, morph = (e, t, a) => (e = reify(e), t = reify(t), a = reify(a), e.innerBind((o) => t.innerBind((u) => a.innerBind((l) => _morph(o, u, l))))), distAlgoNames = ["scurve", "soft", "hard", "cubic", "diode", "asym", "fold", "sinefold", "chebyshev"];
for (const e of distAlgoNames)
  Pattern$1.prototype[e] = function(t) {
    const a = reify(t).fmap((o) => Array.isArray(o) ? [...o, e] : [o, 1, e]);
    return this.distort(a);
  };
const parray = (e) => {
  let a = pure(curry((...o) => o, null, e.length));
  for (const o of e) a = a.appBoth(reify(o));
  return a;
}, _ensureListPattern = (e) => Array.isArray(e) ? parray(e) : reify(e);
Pattern$1.prototype.partials = function(e) {
  return this.withValue((t) => (a) => ({ ...t, partials: a })).appLeft(_ensureListPattern(e));
};
const partials = (e) => _ensureListPattern(e).as("partials");
Pattern$1.prototype.phases = function(e) {
  return this.withValue((t) => (a) => ({ ...t, phases: a })).appLeft(_ensureListPattern(e));
};
const phases = (e) => _ensureListPattern(e).as("phases");
function createParam(e) {
  let t = Array.isArray(e);
  e = t ? e : [e];
  const a = e[0], o = (l) => {
    let f;
    if (typeof l == "object" && l.value !== void 0 && (f = { ...l }, l = l.value, delete f.value), t && Array.isArray(l)) {
      const p = f || {};
      return l.forEach((g, d) => {
        d < e.length && (p[e[d]] = g);
      }), p;
    } else return f ? (f[a] = l, f) : { [a]: l };
  }, u = function(l, f) {
    return f ? typeof l > "u" ? f.fmap(o) : f.set(reify(l).withValue(o)) : reify(l).withValue(o);
  };
  return Pattern$1.prototype[a] = function(l) {
    return u(l, this);
  }, u;
}
const controlAlias = /* @__PURE__ */ new Map();
function isControlName(e) {
  return controlAlias.has(e);
}
function registerControl(e, ...t) {
  const a = Array.isArray(e) ? e[0] : e;
  let o = {};
  return o[a] = createParam(e), controlAlias.set(a, a), t.forEach((u) => {
    o[u] = o[a], controlAlias.set(u, a), Pattern$1.prototype[u] = Pattern$1.prototype[a];
  }), o;
}
const { s, sound } = registerControl(["s", "n", "gain"], "sound"), { wt, wavetablePosition } = registerControl("wt", "wavetablePosition"), { wtenv } = registerControl("wtenv"), { wtattack, wtatt } = registerControl("wtattack", "wtatt"), { wtdecay, wtdec } = registerControl("wtdecay", "wtdec"), { wtsustain, wtsus } = registerControl("wtsustain", "wtsus"), { wtrelease, wtrel } = registerControl("wtrelease", "wtrel"), { wtrate } = registerControl("wtrate"), { wtsync } = registerControl("wtsync"), { wtdepth } = registerControl("wtdepth"), { wtshape } = registerControl("wtshape"), { wtdc } = registerControl("wtdc"), { wtskew } = registerControl("wtskew"), { warp, wavetableWarp } = registerControl("warp", "wavetableWarp"), { warpattack, warpatt } = registerControl("warpattack", "warpatt"), { warpdecay, warpdec } = registerControl("warpdecay", "warpdec"), { warpsustain, warpsus } = registerControl("warpsustain", "warpsus"), { warprelease, warprel } = registerControl("warprelease", "warprel"), { warprate } = registerControl("warprate"), { warpdepth } = registerControl("warpdepth"), { warpshape } = registerControl("warpshape"), { warpdc } = registerControl("warpdc"), { warpskew } = registerControl("warpskew"), { warpmode, wavetableWarpMode } = registerControl("warpmode", "wavetableWarpMode"), { wtphaserand, wavetablePhaseRand } = registerControl("wtphaserand", "wavetablePhaseRand"), { warpenv } = registerControl("warpenv"), { warpsync } = registerControl("warpsync"), { source, src } = registerControl("source", "src"), { n } = registerControl("n"), { note: note$2 } = registerControl(["note", "n"]), { accelerate } = registerControl("accelerate"), { velocity } = registerControl("velocity"), { gain } = registerControl("gain"), { postgain } = registerControl("postgain"), { amp } = registerControl("amp"), { attack, att } = registerControl("attack", "att"), { fmh } = registerControl(["fmh", "fmi"], "fmh"), { fmi, fm: fm$1 } = registerControl(["fmi", "fmh"], "fm"), { fmenv } = registerControl("fmenv"), { fmattack } = registerControl("fmattack"), { fmwave } = registerControl("fmwave"), { fmdecay } = registerControl("fmdecay"), { fmsustain } = registerControl("fmsustain"), { fmrelease } = registerControl("fmrelease"), { fmvelocity } = registerControl("fmvelocity"), { bank } = registerControl("bank"), { chorus } = registerControl("chorus"), { analyze } = registerControl("analyze"), { fft } = registerControl("fft"), { decay, dec } = registerControl("decay", "dec"), { sustain, sus } = registerControl("sustain", "sus"), { release, rel } = registerControl("release", "rel"), { hold } = registerControl("hold"), { bandf, bpf, bp } = registerControl(["bandf", "bandq", "bpenv"], "bpf", "bp"), { bandq, bpq } = registerControl("bandq", "bpq"), { begin } = registerControl("begin"), { end } = registerControl("end"), { loop } = registerControl("loop"), { loopBegin, loopb } = registerControl("loopBegin", "loopb"), { loopEnd, loope } = registerControl("loopEnd", "loope"), { crush } = registerControl("crush"), { coarse } = registerControl("coarse"), { tremolo } = registerControl(["tremolo", "tremolodepth", "tremoloskew", "tremolophase"], "trem"), { tremolosync } = registerControl(
  ["tremolosync", "tremolodepth", "tremoloskew", "tremolophase"],
  "tremsync"
), { tremolodepth } = registerControl("tremolodepth", "tremdepth"), { tremoloskew } = registerControl("tremoloskew", "tremskew"), { tremolophase } = registerControl("tremolophase", "tremphase"), { tremoloshape } = registerControl("tremoloshape", "tremshape"), { drive } = registerControl("drive"), { duck } = registerControl("duckorbit", "duck"), { duckdepth } = registerControl("duckdepth"), { duckonset } = registerControl("duckonset", "duckons"), { duckattack } = registerControl("duckattack", "duckatt"), { byteBeatExpression, bbexpr } = registerControl("byteBeatExpression", "bbexpr"), { byteBeatStartTime, bbst } = registerControl("byteBeatStartTime", "bbst"), { channels, ch } = registerControl("channels", "ch"), { pw } = registerControl(["pw", "pwrate", "pwsweep"]), { pwrate } = registerControl("pwrate"), { pwsweep } = registerControl("pwsweep"), { phaserrate, ph, phaser } = registerControl(
  ["phaserrate", "phaserdepth", "phasercenter", "phasersweep"],
  "ph",
  "phaser"
), { phasersweep, phs } = registerControl("phasersweep", "phs"), { phasercenter, phc } = registerControl("phasercenter", "phc"), { phaserdepth, phd, phasdp } = registerControl("phaserdepth", "phd", "phasdp"), { channel } = registerControl("channel"), { cut } = registerControl("cut"), { cutoff, ctf, lpf, lp } = registerControl(["cutoff", "resonance", "lpenv"], "ctf", "lpf", "lp"), { lpenv, lpe } = registerControl("lpenv", "lpe"), { hpenv, hpe } = registerControl("hpenv", "hpe"), { bpenv, bpe } = registerControl("bpenv", "bpe"), { lpattack, lpa } = registerControl("lpattack", "lpa"), { hpattack, hpa } = registerControl("hpattack", "hpa"), { bpattack, bpa } = registerControl("bpattack", "bpa"), { lpdecay, lpd } = registerControl("lpdecay", "lpd"), { hpdecay, hpd } = registerControl("hpdecay", "hpd"), { bpdecay, bpd } = registerControl("bpdecay", "bpd"), { lpsustain, lps } = registerControl("lpsustain", "lps"), { hpsustain, hps } = registerControl("hpsustain", "hps"), { bpsustain, bps } = registerControl("bpsustain", "bps"), { lprelease, lpr } = registerControl("lprelease", "lpr"), { hprelease, hpr } = registerControl("hprelease", "hpr"), { bprelease, bpr } = registerControl("bprelease", "bpr"), { ftype } = registerControl("ftype"), { fanchor } = registerControl("fanchor"), { lprate } = registerControl("lprate"), { lpsync } = registerControl("lpsync"), { lpdepth } = registerControl("lpdepth"), { lpshape } = registerControl("lpshape"), { lpdc } = registerControl("lpdc"), { lpskew } = registerControl("lpskew"), { bprate } = registerControl("bprate"), { bpsync } = registerControl("bpsync"), { bpdepth } = registerControl("bpdepth"), { bpshape } = registerControl("bpshape"), { bpdc } = registerControl("bpdc"), { bpskew } = registerControl("bpskew"), { hprate } = registerControl("hprate"), { hpsync } = registerControl("hpsync"), { hpdepth } = registerControl("hpdepth"), { hpshape } = registerControl("hpshape"), { hpdc } = registerControl("hpdc"), { hpskew } = registerControl("hpskew"), { vib, vibrato, v } = registerControl(["vib", "vibmod"], "vibrato", "v"), { noise } = registerControl("noise"), { vibmod, vmod } = registerControl(["vibmod", "vib"], "vmod"), { hcutoff, hpf, hp } = registerControl(["hcutoff", "hresonance", "hpenv"], "hpf", "hp"), { hresonance, hpq } = registerControl("hresonance", "hpq"), { resonance, lpq } = registerControl("resonance", "lpq"), { djf } = registerControl("djf"), { delay } = registerControl(["delay", "delaytime", "delayfeedback"]), { delayfeedback, delayfb, dfb } = registerControl("delayfeedback", "delayfb", "dfb"), { delayspeed } = registerControl("delayspeed"), { delaytime, delayt, dt } = registerControl("delaytime", "delayt", "dt"), { delaysync } = registerControl("delaysync"), { lock } = registerControl("lock"), { detune, det } = registerControl("detune", "det"), { unison } = registerControl("unison"), { spread } = registerControl("spread"), { dry } = registerControl("dry"), { fadeTime, fadeOutTime } = registerControl("fadeTime", "fadeOutTime"), { fadeInTime } = registerControl("fadeInTime"), { freq: freq$1 } = registerControl("freq"), { pattack, patt } = registerControl("pattack", "patt"), { pdecay, pdec } = registerControl("pdecay", "pdec"), { psustain, psus } = registerControl("psustain", "psus"), { prelease, prel } = registerControl("prelease", "prel"), { penv } = registerControl("penv"), { pcurve } = registerControl("pcurve"), { panchor } = registerControl("panchor"), { gate, gat } = registerControl("gate", "gat"), { leslie } = registerControl("leslie"), { lrate } = registerControl("lrate"), { lsize } = registerControl("lsize"), { activeLabel } = registerControl("activeLabel"), { label } = registerControl(["label", "activeLabel"]), { degree } = registerControl("degree"), { mtranspose } = registerControl("mtranspose"), { ctranspose } = registerControl("ctranspose"), { harmonic } = registerControl("harmonic"), { stepsPerOctave } = registerControl("stepsPerOctave"), { octaveR } = registerControl("octaveR"), { nudge } = registerControl("nudge"), { octave: octave$1 } = registerControl("octave"), { orbit } = registerControl("orbit"), { overgain } = registerControl("overgain"), { overshape } = registerControl("overshape"), { pan } = registerControl("pan"), { panspan } = registerControl("panspan"), { pansplay } = registerControl("pansplay"), { panwidth } = registerControl("panwidth"), { panorient } = registerControl("panorient"), { rate } = registerControl("rate"), { slide } = registerControl("slide"), { semitone } = registerControl("semitone"), { voice } = registerControl("voice"), { chord: chord$1 } = registerControl("chord"), { dictionary: dictionary$3, dict } = registerControl("dictionary", "dict"), { anchor } = registerControl("anchor"), { offset } = registerControl("offset"), { octaves } = registerControl("octaves"), { mode: mode$1 } = registerControl(["mode", "anchor"]), { room } = registerControl(["room", "size"]), { roomlp, rlp } = registerControl("roomlp", "rlp"), { roomdim, rdim } = registerControl("roomdim", "rdim"), { roomfade, rfade } = registerControl("roomfade", "rfade"), { ir, iresponse } = registerControl(["ir", "i"], "iresponse"), { irspeed } = registerControl("irspeed"), { irbegin } = registerControl("irbegin"), { roomsize, size, sz, rsize } = registerControl("roomsize", "size", "sz", "rsize"), { shape } = registerControl(["shape", "shapevol"]), { distort, dist: dist$2 } = registerControl(["distort", "distortvol", "distorttype"], "dist"), { distortvol } = registerControl("distortvol", "distvol"), { distorttype } = registerControl("distorttype", "disttype"), { compressor } = registerControl([
  "compressor",
  "compressorRatio",
  "compressorKnee",
  "compressorAttack",
  "compressorRelease"
]), { compressorKnee } = registerControl("compressorKnee"), { compressorRatio } = registerControl("compressorRatio"), { compressorAttack } = registerControl("compressorAttack"), { compressorRelease } = registerControl("compressorRelease"), { speed } = registerControl("speed"), { stretch } = registerControl("stretch"), { unit } = registerControl("unit"), { squiz } = registerControl("squiz"), { vowel } = registerControl("vowel"), { waveloss } = registerControl("waveloss"), { density } = registerControl("density"), { expression } = registerControl("expression"), { sustainpedal } = registerControl("sustainpedal"), { fshift } = registerControl("fshift"), { fshiftnote } = registerControl("fshiftnote"), { fshiftphase } = registerControl("fshiftphase"), { triode } = registerControl("triode"), { krush } = registerControl("krush"), { kcutoff } = registerControl("kcutoff"), { octer } = registerControl("octer"), { octersub } = registerControl("octersub"), { octersubsub } = registerControl("octersubsub"), { ring } = registerControl("ring"), { ringf } = registerControl("ringf"), { ringdf } = registerControl("ringdf"), { freeze } = registerControl("freeze"), { xsdelay } = registerControl("xsdelay"), { tsdelay } = registerControl("tsdelay"), { real } = registerControl("real"), { imag } = registerControl("imag"), { enhance } = registerControl("enhance"), { comb } = registerControl("comb"), { smear: smear$1 } = registerControl("smear"), { scram } = registerControl("scram"), { binshift } = registerControl("binshift"), { hbrick } = registerControl("hbrick"), { lbrick } = registerControl("lbrick"), { frameRate } = registerControl("frameRate"), { frames } = registerControl("frames"), { hours } = registerControl("hours"), { minutes } = registerControl("minutes"), { seconds } = registerControl("seconds"), { songPtr } = registerControl("songPtr"), { uid } = registerControl("uid"), { val } = registerControl("val"), { cps } = registerControl("cps"), { clip, legato } = registerControl("clip", "legato"), { duration, dur } = registerControl("duration", "dur"), { zrand } = registerControl("zrand"), { curve } = registerControl("curve"), { deltaSlide } = registerControl("deltaSlide"), { pitchJump } = registerControl("pitchJump"), { pitchJumpTime } = registerControl("pitchJumpTime"), { lfo, repeatTime } = registerControl("lfo", "repeatTime"), { znoise } = registerControl("znoise"), { zmod } = registerControl("zmod"), { zcrush } = registerControl("zcrush"), { zdelay } = registerControl("zdelay"), { zzfx } = registerControl("zzfx"), { color, colour } = registerControl(["color", "colour"]);
let createParams = (...e) => e.reduce((t, a) => Object.assign(t, { [a]: createParam(a) }), {});
const adsr = register("adsr", (e, t) => {
  e = Array.isArray(e) ? e : [e];
  const [a, o, u, l] = e;
  return t.set({ attack: a, decay: o, sustain: u, release: l });
}), ad = register("ad", (e, t) => {
  e = Array.isArray(e) ? e : [e];
  const [a, o = a] = e;
  return t.attack(a).decay(o);
}), ds = register("ds", (e, t) => {
  e = Array.isArray(e) ? e : [e];
  const [a, o = 0] = e;
  return t.set({ decay: a, sustain: o });
}), ar = register("ar", (e, t) => {
  e = Array.isArray(e) ? e : [e];
  const [a, o = a] = e;
  return t.set({ attack: a, release: o });
}), { midichan } = registerControl("midichan"), { midimap } = registerControl("midimap"), { midiport } = registerControl("midiport"), { midicmd } = registerControl("midicmd"), control = register("control", (e, t) => {
  if (!Array.isArray(e))
    throw new Error("control expects an array of [ccn, ccv]");
  const [a, o] = e;
  return t.ccn(a).ccv(o);
}), { ccn } = registerControl("ccn"), { ccv } = registerControl("ccv"), { ctlNum } = registerControl("ctlNum"), { nrpnn } = registerControl("nrpnn"), { nrpv } = registerControl("nrpv"), { progNum } = registerControl("progNum"), sysex = register("sysex", (e, t) => {
  if (!Array.isArray(e))
    throw new Error("sysex expects an array of [id, data]");
  const [a, o] = e;
  return t.sysexid(a).sysexdata(o);
}), { sysexid } = registerControl("sysexid"), { sysexdata } = registerControl("sysexdata"), { midibend } = registerControl("midibend"), { miditouch } = registerControl("miditouch"), { polyTouch } = registerControl("polyTouch"), { oschost } = registerControl("oschost"), { oscport } = registerControl("oscport"), getControlName = (e) => controlAlias.has(e) ? controlAlias.get(e) : e, as = register("as", (e, t) => (e = Array.isArray(e) ? e : [e], t.fmap((a) => (a = Array.isArray(a) ? a : [a], a = Object.fromEntries(e.map((o, u) => [getControlName(o), a[u]])), a)))), scrub = register(
  "scrub",
  (e, t) => e.outerBind((a) => {
    Array.isArray(a) || (a = [a]);
    const [o, u = 1] = a;
    return t.begin(o).mul(speed(u)).clip(1);
  }),
  !1
), controls = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  accelerate,
  activeLabel,
  ad,
  adsr,
  amp,
  analyze,
  anchor,
  ar,
  as,
  att,
  attack,
  bandf,
  bandq,
  bank,
  bbexpr,
  bbst,
  begin,
  binshift,
  bp,
  bpa,
  bpattack,
  bpd,
  bpdc,
  bpdecay,
  bpdepth,
  bpe,
  bpenv,
  bpf,
  bpq,
  bpr,
  bprate,
  bprelease,
  bps,
  bpshape,
  bpskew,
  bpsustain,
  bpsync,
  byteBeatExpression,
  byteBeatStartTime,
  ccn,
  ccv,
  ch,
  channel,
  channels,
  chord: chord$1,
  chorus,
  clip,
  coarse,
  color,
  colour,
  comb,
  compressor,
  compressorAttack,
  compressorKnee,
  compressorRatio,
  compressorRelease,
  control,
  cps,
  createParam,
  createParams,
  crush,
  ctf,
  ctlNum,
  ctranspose,
  curve,
  cut,
  cutoff,
  dec,
  decay,
  degree,
  delay,
  delayfb,
  delayfeedback,
  delayspeed,
  delaysync,
  delayt,
  delaytime,
  deltaSlide,
  density,
  det,
  detune,
  dfb,
  dict,
  dictionary: dictionary$3,
  dist: dist$2,
  distort,
  distorttype,
  distortvol,
  djf,
  drive,
  dry,
  ds,
  dt,
  duck,
  duckattack,
  duckdepth,
  duckonset,
  dur,
  duration,
  end,
  enhance,
  expression,
  fadeInTime,
  fadeOutTime,
  fadeTime,
  fanchor,
  fft,
  fm: fm$1,
  fmattack,
  fmdecay,
  fmenv,
  fmh,
  fmi,
  fmrelease,
  fmsustain,
  fmvelocity,
  fmwave,
  frameRate,
  frames,
  freeze,
  freq: freq$1,
  fshift,
  fshiftnote,
  fshiftphase,
  ftype,
  gain,
  gat,
  gate,
  getControlName,
  harmonic,
  hbrick,
  hcutoff,
  hold,
  hours,
  hp,
  hpa,
  hpattack,
  hpd,
  hpdc,
  hpdecay,
  hpdepth,
  hpe,
  hpenv,
  hpf,
  hpq,
  hpr,
  hprate,
  hprelease,
  hps,
  hpshape,
  hpskew,
  hpsustain,
  hpsync,
  hresonance,
  imag,
  ir,
  irbegin,
  iresponse,
  irspeed,
  isControlName,
  kcutoff,
  krush,
  label,
  lbrick,
  legato,
  leslie,
  lfo,
  lock,
  loop,
  loopBegin,
  loopEnd,
  loopb,
  loope,
  lp,
  lpa,
  lpattack,
  lpd,
  lpdc,
  lpdecay,
  lpdepth,
  lpe,
  lpenv,
  lpf,
  lpq,
  lpr,
  lprate,
  lprelease,
  lps,
  lpshape,
  lpskew,
  lpsustain,
  lpsync,
  lrate,
  lsize,
  midibend,
  midichan,
  midicmd,
  midimap,
  midiport,
  miditouch,
  minutes,
  mode: mode$1,
  mtranspose,
  n,
  noise,
  note: note$2,
  nrpnn,
  nrpv,
  nudge,
  octave: octave$1,
  octaveR,
  octaves,
  octer,
  octersub,
  octersubsub,
  offset,
  orbit,
  oschost,
  oscport,
  overgain,
  overshape,
  pan,
  panchor,
  panorient,
  panspan,
  pansplay,
  panwidth,
  patt,
  pattack,
  pcurve,
  pdec,
  pdecay,
  penv,
  ph,
  phasdp,
  phaser,
  phasercenter,
  phaserdepth,
  phaserrate,
  phasersweep,
  phc,
  phd,
  phs,
  pitchJump,
  pitchJumpTime,
  polyTouch,
  postgain,
  prel,
  prelease,
  progNum,
  psus,
  psustain,
  pw,
  pwrate,
  pwsweep,
  rate,
  rdim,
  real,
  registerControl,
  rel,
  release,
  repeatTime,
  resonance,
  rfade,
  ring,
  ringdf,
  ringf,
  rlp,
  room,
  roomdim,
  roomfade,
  roomlp,
  roomsize,
  rsize,
  s,
  scram,
  scrub,
  seconds,
  semitone,
  shape,
  size,
  slide,
  smear: smear$1,
  songPtr,
  sound,
  source,
  speed,
  spread,
  squiz,
  src,
  stepsPerOctave,
  stretch,
  sus,
  sustain,
  sustainpedal,
  sysex,
  sysexdata,
  sysexid,
  sz,
  tremolo,
  tremolodepth,
  tremolophase,
  tremoloshape,
  tremoloskew,
  tremolosync,
  triode,
  tsdelay,
  uid,
  unison,
  unit,
  v,
  val,
  velocity,
  vib,
  vibmod,
  vibrato,
  vmod,
  voice,
  vowel,
  warp,
  warpatt,
  warpattack,
  warpdc,
  warpdec,
  warpdecay,
  warpdepth,
  warpenv,
  warpmode,
  warprate,
  warprel,
  warprelease,
  warpshape,
  warpskew,
  warpsus,
  warpsustain,
  warpsync,
  waveloss,
  wavetablePhaseRand,
  wavetablePosition,
  wavetableWarp,
  wavetableWarpMode,
  wt,
  wtatt,
  wtattack,
  wtdc,
  wtdec,
  wtdecay,
  wtdepth,
  wtenv,
  wtphaserand,
  wtrate,
  wtrel,
  wtrelease,
  wtshape,
  wtskew,
  wtsus,
  wtsustain,
  wtsync,
  xsdelay,
  zcrush,
  zdelay,
  zmod,
  znoise,
  zrand,
  zzfx
}, Symbol.toStringTag, { value: "Module" })), left = function(e, t) {
  const [a, o] = e, [u, l] = t, [f, p] = splitAt(o, u);
  return [
    [o, a - o],
    [zipWith((g, d) => g.concat(d), f, l), p]
  ];
}, right = function(e, t) {
  const [a, o] = e, [u, l] = t, [f, p] = splitAt(a, l);
  return [
    [a, o - a],
    [zipWith((d, b) => d.concat(b), u, f), p]
  ];
}, _bjorklund = function(e, t) {
  const [a, o] = e;
  return Math.min(a, o) <= 1 ? [e, t] : _bjorklund(...a > o ? left(e, t) : right(e, t));
}, bjorklund = function(e, t) {
  const a = e < 0, o = Math.abs(e), u = t - o, l = Array(o).fill([1]), f = Array(u).fill([0]), p = _bjorklund([o, u], [l, f]), g = flatten(p[1][0]).concat(flatten(p[1][1]));
  return a ? g.map((d) => 1 - d) : g;
}, _euclidRot = function(e, t, a) {
  const o = bjorklund(e, t);
  return a ? rotate$2(o, -a) : o;
}, euclid = register("euclid", function(e, t, a) {
  return a.struct(_euclidRot(e, t, 0));
}), bjork = register("bjork", function(e, t) {
  Array.isArray(e) || (e = [e]);
  const [a, o = a, u = 0] = e;
  return t.struct(_euclidRot(a, o, u));
}), { euclidrot, euclidRot } = register(["euclidrot", "euclidRot"], function(e, t, a, o) {
  return o.struct(_euclidRot(e, t, a));
}), _euclidLegato = function(e, t, a, o) {
  if (e < 1)
    return silence;
  const l = _euclidRot(e, t, 0).join("").split("1").slice(1).map((f) => [f.length + 1, !0]);
  return o.struct(timeCat(...l)).late(fraction$1(a).div(t));
}, euclidLegato = register(["euclidLegato"], function(e, t, a) {
  return _euclidLegato(e, t, 0, a);
}), euclidLegatoRot = register(["euclidLegatoRot"], function(e, t, a, o) {
  return _euclidLegato(e, t, a, o);
}), { euclidish, eish } = register(["euclidish", "eish"], function(e, t, a, o) {
  const u = _morph(bjorklund(e, t), new Array(e).fill(1), a);
  return o.struct(u).setSteps(t);
});
function createClock(e, t, a = 0.05, o = 0.1, u = 0.1, l = globalThis.setInterval, f = globalThis.clearInterval, p = !0) {
  let g = 0, d = 0, b = 10 ** 4, F = 0.01;
  const E = (H) => a = H(a);
  u = u || o / 2;
  const S = () => {
    const H = e(), z = H + o + u;
    for (d === 0 && (d = H + F); d < z; )
      d = p ? Math.round(d * b) / b : d, t(d, a, g, H), d += a, g++;
  };
  let R;
  const k = () => {
    I(), S(), R = l(S, o * 1e3);
  }, I = () => {
    R !== void 0 && f(R), R = void 0;
  };
  return { setDuration: E, start: k, stop: () => {
    g = 0, d = 0, I();
  }, pause: () => I(), duration: a, interval: o, getPhase: () => d, minLatency: F };
}
function steady(e) {
  return new Pattern$1((t) => [new Hap(void 0, t.span, e)]);
}
const signal = (e) => {
  const t = (a) => [new Hap(void 0, a.span, e(a.span.begin))];
  return new Pattern$1(t);
}, saw = signal((e) => e % 1), saw2 = saw.toBipolar(), isaw = signal((e) => 1 - e % 1), isaw2 = isaw.toBipolar(), sine2 = signal((e) => Math.sin(Math.PI * 2 * e)), sine = sine2.fromBipolar(), cosine = sine._early(fraction$1(1).div(4)), cosine2 = sine2._early(fraction$1(1).div(4)), square = signal((e) => Math.floor(e * 2 % 2)), square2 = square.toBipolar(), tri = fastcat(saw, isaw), tri2 = fastcat(saw2, isaw2), itri = fastcat(isaw, saw), itri2 = fastcat(isaw2, saw2), time$1 = signal(id);
let _mouseY = 0, _mouseX = 0;
typeof window < "u" && document.addEventListener("mousemove", (e) => {
  _mouseY = e.clientY / document.body.clientHeight, _mouseX = e.clientX / document.body.clientWidth;
});
const mousey = signal(() => _mouseY), mouseY = signal(() => _mouseY), mousex = signal(() => _mouseX), mouseX = signal(() => _mouseX), xorwise = (e) => {
  const t = e << 13 ^ e, a = t >> 17 ^ t;
  return a << 5 ^ a;
}, _frac = (e) => e - Math.trunc(e), timeToIntSeed = (e) => xorwise(Math.trunc(_frac(e / 300) * 536870912)), intSeedToRand = (e) => e % 536870912 / 536870912, timeToRand = (e) => Math.abs(intSeedToRand(timeToIntSeed(e))), timeToRandsPrime = (e, t) => {
  const a = [];
  for (let o = 0; o < t; ++o)
    a.push(intSeedToRand(e)), e = xorwise(e);
  return a;
}, timeToRands = (e, t) => timeToRandsPrime(timeToIntSeed(e), t), run = (e) => saw.range(0, e).round().segment(e), binary = (e) => {
  const t = reify(e).log2(0).floor().add(1);
  return binaryN(e, t);
}, binaryN = (e, t = 16) => {
  t = reify(t);
  const a = run(t).mul(-1).add(t.sub(1));
  return reify(e).segment(t).brshift(a).band(pure(1));
}, binaryL = (e) => {
  const t = reify(e).log2(0).floor().add(1);
  return binaryNL(e, t);
}, binaryNL = (e, t = 16) => reify(e).withValue((a) => (o) => {
  const u = [];
  for (let l = o - 1; l >= 0; l--)
    u.push(a >> l & 1);
  return u;
}).appLeft(reify(t)), randL = (e) => signal((t) => (a) => timeToRands(t, a).map(Math.abs)).appLeft(reify(e)), randrun = (e) => signal((t) => {
  const o = timeToRands(t.floor().add(0.5), e).map((l, f) => [l, f]).sort((l, f) => (l[0] > f[0]) - (l[0] < f[0])).map((l) => l[1]), u = t.cyclePos().mul(e).floor() % e;
  return o[u];
})._segment(e), _rearrangeWith = (e, t, a) => {
  const o = [...Array(t).keys()].map((u) => a.zoom(fraction$1(u).div(t), fraction$1(u + 1).div(t)));
  return e.fmap((u) => o[u].repeatCycles(t)._fast(t)).innerJoin();
}, shuffle$2 = register("shuffle", (e, t) => _rearrangeWith(randrun(e), e, t)), scramble = register("scramble", (e, t) => _rearrangeWith(_irand(e)._segment(e), e, t)), rand = signal(timeToRand), rand2 = rand.toBipolar(), _brandBy = (e) => rand.fmap((t) => t < e), brandBy = (e) => reify(e).fmap(_brandBy).innerJoin(), brand = _brandBy(0.5), _irand = (e) => rand.fmap((t) => Math.trunc(t * e)), irand = (e) => reify(e).fmap(_irand).innerJoin(), __chooseWith = (e, t) => (t = t.map(reify), t.length == 0 ? silence : e.range(0, t.length).fmap((a) => {
  const o = Math.min(Math.max(Math.floor(a), 0), t.length - 1);
  return t[o];
})), chooseWith = (e, t) => __chooseWith(e, t).outerJoin(), chooseInWith = (e, t) => __chooseWith(e, t).innerJoin(), choose = (...e) => chooseWith(rand, e), chooseIn = (...e) => chooseInWith(rand, e), chooseOut = choose;
Pattern$1.prototype.choose = function(...e) {
  return chooseWith(this, e);
};
Pattern$1.prototype.choose2 = function(...e) {
  return chooseWith(this.fromBipolar(), e);
};
const chooseCycles = (...e) => chooseInWith(rand.segment(1), e), randcat = chooseCycles, _wchooseWith = function(e, ...t) {
  const a = t.map((p) => reify(p[0])), o = [];
  let u = pure(0);
  for (const p of t)
    u = u.add(p[1]), o.push(u);
  const l = sequenceP(o), f = function(p) {
    const g = u.mul(p);
    return l.fmap((d) => (b) => a[d.findIndex((F) => F > b, d)]).appLeft(g);
  };
  return e.bind(f);
}, wchooseWith = (...e) => _wchooseWith(...e).outerJoin(), wchoose = (...e) => wchooseWith(rand, ...e), wchooseCycles = (...e) => _wchooseWith(rand.segment(1), ...e).innerJoin(), wrandcat = wchooseCycles;
function _perlin(e) {
  let t = Math.floor(e), a = t + 1;
  const o = (f) => 6 * f ** 5 - 15 * f ** 4 + 10 * f ** 3;
  return ((f) => (p) => (g) => p + o(f) * (g - p))(e - t)(timeToRand(t))(timeToRand(a));
}
const perlinWith = (e) => e.fmap(_perlin);
function _berlin(e) {
  const t = Math.floor(e), a = t + 1, o = timeToRand(t), u = timeToRand(a) + o, l = (e - t) / (a - t);
  return ((p, g, d) => p + (g - p) * d)(o, u, l) / 2;
}
const berlinWith = (e) => e.fmap(_berlin), perlin = perlinWith(time$1.fmap((e) => Number(e))), berlin = berlinWith(time$1.fmap((e) => Number(e))), degradeByWith = register(
  "degradeByWith",
  (e, t, a) => a.fmap((o) => (u) => o).appLeft(e.filterValues((o) => o > t)),
  !0,
  !0
), degradeBy = register(
  "degradeBy",
  function(e, t) {
    return t._degradeByWith(rand, e);
  },
  !0,
  !0
), degrade = register("degrade", (e) => e._degradeBy(0.5), !0, !0), undegradeBy = register(
  "undegradeBy",
  function(e, t) {
    return t._degradeByWith(
      rand.fmap((a) => 1 - a),
      e
    );
  },
  !0,
  !0
), undegrade = register("undegrade", (e) => e._undegradeBy(0.5), !0, !0), sometimesBy = register("sometimesBy", function(e, t, a) {
  return reify(e).fmap((o) => stack(a._degradeBy(o), t(a._undegradeBy(1 - o)))).innerJoin();
}), sometimes = register("sometimes", function(e, t) {
  return t._sometimesBy(0.5, e);
}), someCyclesBy = register("someCyclesBy", function(e, t, a) {
  return reify(e).fmap(
    (o) => stack(
      a._degradeByWith(rand._segment(1), o),
      t(a._degradeByWith(rand.fmap((u) => 1 - u)._segment(1), 1 - o))
    )
  ).innerJoin();
}), someCycles = register("someCycles", function(e, t) {
  return t._someCyclesBy(0.5, e);
}), often = register("often", function(e, t) {
  return t.sometimesBy(0.75, e);
}), rarely = register("rarely", function(e, t) {
  return t.sometimesBy(0.25, e);
}), almostNever = register("almostNever", function(e, t) {
  return t.sometimesBy(0.1, e);
}), almostAlways = register("almostAlways", function(e, t) {
  return t.sometimesBy(0.9, e);
}), never = register("never", function(e, t) {
  return t;
}), always = register("always", function(e, t) {
  return e(t);
});
function _keyDown(e) {
  Array.isArray(e) === !1 && (e = [e]);
  const t = getCurrentKeyboardState();
  return e.every((a) => {
    const o = keyAlias.get(a) ?? a;
    return t[o];
  });
}
const whenKey = register("whenKey", function(e, t, a) {
  return a.when(_keyDown(e), t);
}), keyDown = register("keyDown", function(e) {
  return e.fmap(_keyDown);
}), _pick = function(e, t, a = !0) {
  const o = Array.isArray(e), u = Object.keys(e).length;
  return e = objectMap(e, reify), u === 0 ? silence : t.fmap((l) => {
    let f = l;
    return o && (f = a ? Math.round(f) % u : clamp$1(Math.round(f), 0, e.length - 1)), e[f];
  });
}, pick = function(e, t) {
  return Array.isArray(t) && ([t, e] = [e, t]), __pick(e, t);
}, __pick = register("pick", function(e, t) {
  return _pick(e, t, !1).innerJoin();
}), pickmod = register("pickmod", function(e, t) {
  return _pick(e, t, !0).innerJoin();
}), pickF = register("pickF", function(e, t, a) {
  return a.apply(pick(e, t));
}), pickmodF = register("pickmodF", function(e, t, a) {
  return a.apply(pickmod(e, t));
}), pickOut = register("pickOut", function(e, t) {
  return _pick(e, t, !1).outerJoin();
}), pickmodOut = register("pickmodOut", function(e, t) {
  return _pick(e, t, !0).outerJoin();
}), pickRestart = register("pickRestart", function(e, t) {
  return _pick(e, t, !1).restartJoin();
}), pickmodRestart = register("pickmodRestart", function(e, t) {
  return _pick(e, t, !0).restartJoin();
}), pickReset = register("pickReset", function(e, t) {
  return _pick(e, t, !1).resetJoin();
}), pickmodReset = register("pickmodReset", function(e, t) {
  return _pick(e, t, !0).resetJoin();
}), { inhabit, pickSqueeze } = register(["inhabit", "pickSqueeze"], function(e, t) {
  return _pick(e, t, !1).squeezeJoin();
}), { inhabitmod, pickmodSqueeze } = register(["inhabitmod", "pickmodSqueeze"], function(e, t) {
  return _pick(e, t, !0).squeezeJoin();
}), squeeze = (e, t) => (t = t.map(reify), t.length == 0 ? silence : e.fmap((a) => {
  const o = _mod$2(Math.round(a), t.length);
  return t[o];
}).squeezeJoin());
let synth;
try {
  synth = window?.speechSynthesis;
} catch {
  console.warn("cannot use window: not in browser?");
}
let allVoices = synth?.getVoices();
function triggerSpeech(e, t, a) {
  synth.cancel();
  const o = new SpeechSynthesisUtterance(e);
  o.lang = t, allVoices = synth.getVoices();
  const u = allVoices.filter((l) => l.lang.includes(t));
  typeof a == "number" ? o.voice = u[a % u.length] : typeof a == "string" && (o.voice = u.find((l) => l.name === l)), speechSynthesis.speak(o);
}
const speak = register("speak", function(e, t, a) {
  return a.onTrigger((o) => {
    triggerSpeech(o.value, e, t);
  });
}), strudelScope = {}, evalScope = async (...e) => {
  const t = await Promise.allSettled(e), a = t.filter((o) => o.status === "fulfilled").map((o) => o.value);
  return t.forEach((o, u) => {
    o.status === "rejected" && console.warn(`evalScope: module with index ${u} could not be loaded:`, o.reason);
  }), a.forEach((o) => {
    Object.entries(o).forEach(([u, l]) => {
      globalThis[u] = l, strudelScope[u] = l;
    });
  }), a;
};
function safeEval(e, t = {}) {
  const { wrapExpression: a = !0, wrapAsync: o = !0 } = t;
  a && (e = `{${e}}`), o && (e = `(async ()=>${e})()`);
  const u = `"use strict";return (${e})`;
  return Function(u)();
}
const evaluate$1 = async (e, t, a) => {
  let o = {};
  if (t) {
    const f = t(e, a);
    e = f.output, o = f;
  }
  return { mode: "javascript", pattern: await safeEval(e, { wrapExpression: !!t }), meta: o };
};
class NeoCyclist {
  constructor({ onTrigger: t, onToggle: a, getTime: o }) {
    this.started = !1, this.cps = 0.5, this.getTime = o, this.time_at_last_tick_message = 0, this.collator = new ClockCollator({ getTargetClockTime: o }), this.onToggle = a, this.latency = 0.1, this.cycle = 0, this.id = Math.round(Date.now() * Math.random()), this.worker = new SharedWorker(new URL(
      /* @vite-ignore */
      "" + new URL("assets/clockworker-ZDiUtESR.js", import.meta.url).href,
      import.meta.url
    )), this.worker.port.start(), this.channel = new BroadcastChannel("strudeltick");
    const u = (f) => {
      const { cps: p, begin: g, end: d, cycle: b, time: F } = f;
      this.cps = p, this.cycle = b;
      const E = this.collator.calculateOffset(F) + F;
      l(g, d, E), this.time_at_last_tick_message = E;
    }, l = (f, p, g) => {
      if (this.started === !1)
        return;
      this.pattern.queryArc(f, p, { _cps: this.cps, cyclist: "neocyclist" }).forEach((b) => {
        if (b.hasOnset()) {
          const E = cycleToSeconds$1(b.whole.begin - this.cycle, this.cps) + g + this.latency, S = cycleToSeconds$1(b.duration, this.cps);
          t?.(b, 0, S, this.cps, E);
        }
      });
    };
    this.channel.onmessage = (f) => {
      if (!this.started)
        return;
      const { payload: p, type: g } = f.data;
      switch (g) {
        case "tick":
          u(p);
      }
    };
  }
  sendMessage(t, a) {
    this.worker.port.postMessage({ type: t, payload: a, id: this.id });
  }
  now() {
    const t = (this.getTime() - this.time_at_last_tick_message) * this.cps;
    return this.cycle + t;
  }
  setCps(t = 1) {
    this.sendMessage("cpschange", { cps: t });
  }
  setCycle(t) {
    this.sendMessage("setcycle", { cycle: t });
  }
  setStarted(t) {
    this.sendMessage("toggle", { started: t }), this.started = t, this.onToggle?.(t);
  }
  start() {
    logger$2("[cyclist] start"), this.setStarted(!0);
  }
  stop() {
    logger$2("[cyclist] stop"), this.collator.reset(), this.setStarted(!1);
  }
  setPattern(t, a = !1) {
    this.pattern = t, a && !this.started && this.start();
  }
  log(t, a, o) {
    const u = o.filter((l) => l.hasOnset());
    console.log(`${t.toFixed(4)} - ${a.toFixed(4)} ${Array(u.length).fill("I").join("")}`);
  }
}
class Cyclist {
  constructor({
    interval: t,
    onTrigger: a,
    onToggle: o,
    onError: u,
    getTime: l,
    latency: f = 0.1,
    setInterval: p,
    clearInterval: g,
    beforeStart: d
  }) {
    this.started = !1, this.beforeStart = d, this.cps = 0.5, this.num_ticks_since_cps_change = 0, this.lastTick = 0, this.lastBegin = 0, this.lastEnd = 0, this.getTime = l, this.num_cycles_at_cps_change = 0, this.seconds_at_cps_change, this.onToggle = o, this.latency = f, this.clock = createClock(
      l,
      // called slightly before each cycle
      (b, F, E, S) => {
        this.num_ticks_since_cps_change === 0 && (this.num_cycles_at_cps_change = this.lastEnd, this.seconds_at_cps_change = b), this.num_ticks_since_cps_change++;
        const k = this.num_ticks_since_cps_change * F * this.cps;
        try {
          const I = this.lastEnd;
          this.lastBegin = I;
          const V = this.num_cycles_at_cps_change + k;
          if (this.lastEnd = V, this.lastTick = b, b < S) {
            console.log("skip query: too late");
            return;
          }
          this.pattern.queryArc(I, V, { _cps: this.cps, cyclist: "cyclist" }).forEach((q) => {
            if (q.hasOnset()) {
              const H = (q.whole.begin - this.num_cycles_at_cps_change) / this.cps + this.seconds_at_cps_change + f, z = q.duration / this.cps, j = H - b;
              a?.(q, j, z, this.cps, H), q.value.cps !== void 0 && this.cps != q.value.cps && (this.cps = q.value.cps, this.num_ticks_since_cps_change = 0);
            }
          });
        } catch (I) {
          errorLogger$1(I), u?.(I);
        }
      },
      t,
      // duration of each cycle
      0.1,
      0.1,
      p,
      g
    );
  }
  now() {
    if (!this.started)
      return 0;
    const t = this.getTime() - this.lastTick - this.clock.duration;
    return this.lastBegin + t * this.cps;
  }
  setStarted(t) {
    this.started = t, this.onToggle?.(t);
  }
  async start() {
    if (await this.beforeStart?.(), this.num_ticks_since_cps_change = 0, this.num_cycles_at_cps_change = 0, !this.pattern)
      throw new Error("Scheduler: no pattern set! call .setPattern first.");
    logger$2("[cyclist] start"), this.clock.start(), this.setStarted(!0);
  }
  pause() {
    logger$2("[cyclist] pause"), this.clock.pause(), this.setStarted(!1);
  }
  stop() {
    logger$2("[cyclist] stop"), this.clock.stop(), this.lastEnd = 0, this.setStarted(!1);
  }
  async setPattern(t, a = !1) {
    this.pattern = t, a && !this.started && await this.start();
  }
  setCps(t = 0.5) {
    this.cps !== t && (this.cps = t, this.num_ticks_since_cps_change = 0);
  }
  log(t, a, o) {
    const u = o.filter((l) => l.hasOnset());
    console.log(`${t.toFixed(4)} - ${a.toFixed(4)} ${Array(u.length).fill("I").join("")}`);
  }
}
let time;
function getTime() {
  if (!time)
    throw new Error("no time set! use setTime to define a time source");
  return time();
}
function setTime(e) {
  time = e;
}
function repl$2({
  defaultOutput: e,
  onEvalError: t,
  beforeEval: a,
  beforeStart: o,
  afterEval: u,
  getTime: l,
  transpiler: f,
  onToggle: p,
  editPattern: g,
  onUpdateState: d,
  sync: b = !1,
  setInterval: F,
  clearInterval: E,
  id: S,
  mondo: R = !1
}) {
  const k = {
    schedulerError: void 0,
    evalError: void 0,
    code: "// LOADING",
    activeCode: "// LOADING",
    pattern: void 0,
    miniLocations: [],
    widgets: [],
    pending: !1,
    started: !1
  }, I = {
    id: S
  }, V = (ue) => {
    Object.assign(k, ue), k.isDirty = k.code !== k.activeCode, k.error = k.evalError || k.schedulerError, d?.(k);
  }, U = {
    onTrigger: getTrigger({ defaultOutput: e, getTime: l }),
    getTime: l,
    onToggle: (ue) => {
      V({ started: ue }), p?.(ue);
    },
    setInterval: F,
    clearInterval: E,
    beforeStart: o
  }, q = b && typeof SharedWorker < "u" ? new NeoCyclist(U) : new Cyclist(U);
  let H = {}, z = 0, j;
  const ee = function() {
    return H = {}, z = 0, j = void 0, silence;
  };
  function te(ue) {
    return ue._Pattern ? ue.__pure : ue;
  }
  const de = async (ue, Ee = !0) => (ue = g?.(ue) || ue, await q.setPattern(ue, Ee), ue);
  setTime(() => q.now());
  const ie = () => q.stop(), he = () => q.start(), fe = () => q.pause(), le = () => q.toggle(), _e = (ue) => (q.setCps(te(ue)), silence), Me = (ue) => (q.setCps(te(ue) / 60), silence);
  let be = [];
  const ve = function(ue) {
    return be.push(ue), silence;
  }, ge = function(ue) {
    return j = ue, silence;
  }, Ie = () => {
    Pattern$1.prototype.p = function(Ee) {
      return typeof Ee == "string" && (Ee.startsWith("_") || Ee.endsWith("_")) ? silence : (Ee === "$" && (Ee = `$${z}`, z++), H[Ee] = this, this);
    }, Pattern$1.prototype.q = function(Ee) {
      return silence;
    };
    try {
      for (let Ee = 1; Ee < 10; ++Ee)
        Object.defineProperty(Pattern$1.prototype, `d${Ee}`, {
          get() {
            return this.p(Ee);
          },
          configurable: !0
        }), Object.defineProperty(Pattern$1.prototype, `p${Ee}`, {
          get() {
            return this.p(Ee);
          },
          configurable: !0
        }), Pattern$1.prototype[`q${Ee}`] = silence;
    } catch (Ee) {
      console.warn("injectPatternMethods: error:", Ee);
    }
    const ue = register("cpm", function(Ee, qe) {
      return qe._fast(Ee / 60 / q.cps);
    });
    return evalScope({
      all: ve,
      each: ge,
      hush: ee,
      cpm: ue,
      setCps: _e,
      setcps: _e,
      setCpm: Me,
      setcpm: Me
    });
  };
  return { scheduler: q, evaluate: async (ue, Ee = !0, qe = !0) => {
    if (!ue)
      throw new Error("no code to evaluate");
    try {
      V({ code: ue, pending: !0 }), await Ie(), setTime(() => q.now()), await a?.({ code: ue }), be = [], qe && ee(), R && (ue = `mondolang\`${ue}\``);
      let { pattern: Te, meta: xe } = await evaluate$1(ue, f, I);
      if (Object.keys(H).length) {
        let Ve = [];
        for (const [we, We] of Object.entries(H))
          Ve.push(We.withState((Qe) => Qe.setControls({ id: we })));
        j && (Ve = Ve.map((we) => j(we))), Te = stack(...Ve);
      } else j && (Te = j(Te));
      if (be.length)
        for (let Ve in be)
          Te = be[Ve](Te);
      if (!isPattern(Te)) {
        const Ve = `got "${typeof evaluated}" instead of pattern`;
        throw new Error(Ve + (typeof evaluated == "function" ? ", did you forget to call a function?" : "."));
      }
      return logger$2("[eval] code updated"), Te = await de(Te, Ee), V({
        miniLocations: xe?.miniLocations || [],
        widgets: xe?.widgets || [],
        activeCode: ue,
        pattern: Te,
        evalError: void 0,
        schedulerError: void 0,
        pending: !1
      }), u?.({ code: ue, pattern: Te, meta: xe }), Te;
    } catch (Te) {
      logger$2(`[eval] error: ${Te.message}`, "error"), console.error(Te), V({ evalError: Te, pending: !1 }), t?.(Te);
    }
  }, start: he, stop: ie, pause: fe, setCps: _e, setPattern: de, setCode: (ue) => V({ code: ue }), toggle: le, state: k };
}
const getTrigger = ({ getTime: e, defaultOutput: t }) => async (a, o, u, l, f) => {
  try {
    (!a.context.onTrigger || !a.context.dominantTrigger) && await t(a, o, u, l, f), a.context.onTrigger && await a.context.onTrigger(a, e(), l, f);
  } catch (p) {
    errorLogger$1(p, "getTrigger");
  }
}, backgroundImage = function(e, t = {}) {
  const a = document.getElementById("code"), o = "background-image:url(" + e + ");background-size:contain;";
  a.style = o;
  const { className: u } = a, l = (g, d) => {
    ({
      style: () => a.style = o + ";" + d,
      className: () => a.className = d + " " + u
    })[g]();
  }, f = Object.entries(t).filter(([g, d]) => typeof d == "function");
  Object.entries(t).filter(([g, d]) => typeof d == "string").forEach(([g, d]) => l(g, d)), f.length;
}, cleanupUi = () => {
  const e = document.getElementById("code");
  e && (e.style = "");
};
logger$2("🌀 @strudel/core loaded 🌀");
globalThis._strudelLoaded && console.warn(
  `@strudel/core was loaded more than once...
This might happen when you have multiple versions of strudel installed. 
Please check with "npm ls @strudel/core".`
);
globalThis._strudelLoaded = !0;
const strudel = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ClockCollator,
  Cyclist,
  Fraction: fraction$1,
  Hap,
  Pattern: Pattern$1,
  State,
  TimeSpan,
  __chooseWith,
  _brandBy,
  _fitslice,
  _irand,
  _keyDown,
  _match,
  _mod: _mod$2,
  _morph,
  _polymeterListSteps,
  _retime,
  _slices,
  accelerate,
  activeLabel,
  ad,
  add: add$5,
  adsr,
  almostAlways,
  almostNever,
  always,
  amp,
  analyze,
  anchor,
  and,
  apply,
  applyN,
  ar,
  arp,
  arpWith,
  arrange,
  as,
  att,
  attack,
  averageArray,
  backgroundImage,
  band,
  bandf,
  bandq,
  bank,
  base64ToUnicode,
  bbexpr,
  bbst,
  beat,
  begin,
  berlin,
  berlinWith,
  binary,
  binaryL,
  binaryN,
  binaryNL,
  bind,
  binshift,
  bite,
  bjork,
  bjorklund,
  blshift,
  bor,
  bp,
  bpa,
  bpattack,
  bpd,
  bpdc,
  bpdecay,
  bpdepth,
  bpe,
  bpenv,
  bpf,
  bpq,
  bpr,
  bprate,
  bprelease,
  bps,
  bpshape,
  bpskew,
  bpsustain,
  bpsync,
  brak,
  brand,
  brandBy,
  brshift,
  bxor,
  bypass,
  byteBeatExpression,
  byteBeatStartTime,
  calculateSteps,
  cat,
  ccn,
  ccv,
  ceil,
  ch,
  channel,
  channels,
  choose,
  chooseCycles,
  chooseIn,
  chooseInWith,
  chooseOut,
  chooseWith,
  chop,
  chord: chord$1,
  chorus,
  chunk,
  chunkBack,
  chunkBackInto,
  chunkInto,
  chunkback,
  chunkbackinto,
  chunkinto,
  clamp: clamp$1,
  cleanupUi,
  clip,
  coarse,
  code2hash,
  color,
  colour,
  comb,
  compose,
  compress,
  compressSpan,
  compressor,
  compressorAttack,
  compressorKnee,
  compressorRatio,
  compressorRelease,
  compressspan,
  constant,
  contract,
  control,
  controls,
  cosine,
  cosine2,
  cpm,
  cps,
  createClock,
  createParam,
  createParams,
  crush,
  ctf,
  ctlNum,
  ctranspose,
  curry,
  curve,
  cut,
  cutoff,
  cycleToSeconds: cycleToSeconds$1,
  dec,
  decay,
  degrade,
  degradeBy,
  degradeByWith,
  degree,
  delay,
  delayfb,
  delayfeedback,
  delayspeed,
  delaysync,
  delayt,
  delaytime,
  deltaSlide,
  det,
  detune,
  dfb,
  dict,
  dictionary: dictionary$3,
  dist: dist$2,
  distort,
  distorttype,
  distortvol,
  div,
  djf,
  drawLine,
  drive,
  drop,
  dry,
  ds,
  dt,
  duck,
  duckattack,
  duckdepth,
  duckonset,
  dur,
  duration,
  early,
  echo,
  echoWith,
  echowith,
  eish,
  end,
  enhance,
  eq,
  eqt,
  errorLogger: errorLogger$1,
  euclid,
  euclidLegato,
  euclidLegatoRot,
  euclidRot,
  euclidish,
  euclidrot,
  evalScope,
  evaluate: evaluate$1,
  every,
  expand,
  expression,
  extend,
  fadeInTime,
  fadeOutTime,
  fadeTime,
  fanchor,
  fast,
  fastChunk,
  fastGap,
  fastcat,
  fastchunk,
  fastgap,
  fft,
  filter: filter$1,
  filterWhen,
  firstOf,
  fit,
  flatten,
  floor,
  fm: fm$1,
  fmattack,
  fmdecay,
  fmenv,
  fmh,
  fmi,
  fmrelease,
  fmsustain,
  fmvelocity,
  fmwave,
  focus,
  focusSpan,
  focusspan,
  fractionalArgs,
  frameRate,
  frames,
  freeze,
  freq: freq$1,
  freqToMidi: freqToMidi$2,
  fromBipolar,
  fshift,
  fshiftnote,
  fshiftphase,
  ftype,
  func,
  gain,
  gap,
  gat,
  gate,
  getAccidentalsOffset: getAccidentalsOffset$1,
  getControlName,
  getCurrentKeyboardState,
  getEventOffsetMs,
  getFreq,
  getFrequency,
  getPerformanceTimeSeconds,
  getPlayableNoteValue,
  getSoundIndex: getSoundIndex$1,
  getTime,
  getTrigger,
  grow,
  gt,
  gte,
  harmonic,
  hash2code,
  hbrick,
  hcutoff,
  hold,
  hours,
  hp,
  hpa,
  hpattack,
  hpd,
  hpdc,
  hpdecay,
  hpdepth,
  hpe,
  hpenv,
  hpf,
  hpq,
  hpr,
  hprate,
  hprelease,
  hps,
  hpshape,
  hpskew,
  hpsustain,
  hpsync,
  hresonance,
  hsl,
  hsla,
  hurry,
  id,
  imag,
  inhabit,
  inhabitmod,
  innerBind,
  inside,
  inv,
  invert: invert$1,
  ir,
  irand,
  irbegin,
  iresponse,
  irspeed,
  isControlName,
  isNote,
  isNoteWithOctave,
  isPattern,
  isaw,
  isaw2,
  iter,
  iterBack,
  iterback,
  itri,
  itri2,
  jux,
  juxBy,
  juxby,
  kcutoff,
  keep,
  keepif,
  keyAlias,
  keyDown,
  krush,
  label,
  lastOf,
  late,
  lbrick,
  legato,
  leslie,
  lfo,
  linger,
  listRange,
  lock,
  logKey,
  logger: logger$2,
  loop,
  loopAt,
  loopAtCps,
  loopBegin,
  loopEnd,
  loopat,
  loopatcps,
  loopb,
  loope,
  lp,
  lpa,
  lpattack,
  lpd,
  lpdc,
  lpdecay,
  lpdepth,
  lpe,
  lpenv,
  lpf,
  lpq,
  lpr,
  lprate,
  lprelease,
  lps,
  lpshape,
  lpskew,
  lpsustain,
  lpsync,
  lrate,
  lsize,
  lt,
  lte,
  mapArgs,
  mask,
  midi2note: midi2note$1,
  midiToFreq: midiToFreq$2,
  midibend,
  midichan,
  midicmd,
  midimap,
  midiport,
  miditouch,
  minutes,
  mod: mod$3,
  mode: mode$1,
  morph,
  mouseX,
  mouseY,
  mousex,
  mousey,
  mtranspose,
  mul,
  n,
  nanFallback: nanFallback$1,
  ne,
  net,
  never,
  noise,
  note: note$2,
  noteToMidi: noteToMidi$1,
  nothing,
  nrpnn,
  nrpv,
  nudge,
  numeralArgs,
  objectMap,
  octave: octave$1,
  octaveR,
  octaves,
  octer,
  octersub,
  octersubsub,
  off,
  offset,
  often,
  or,
  orbit,
  oschost,
  oscport,
  outerBind,
  outside,
  overgain,
  overshape,
  pace,
  pairs,
  palindrome,
  pan,
  panchor,
  panorient,
  panspan,
  pansplay,
  panwidth,
  parray,
  parseFractional,
  parseNumeral,
  partials,
  patt,
  pattack,
  pcurve,
  pdec,
  pdecay,
  penv,
  perlin,
  perlinWith,
  ph,
  phasdp,
  phaser,
  phasercenter,
  phaserdepth,
  phaserrate,
  phasersweep,
  phases,
  phc,
  phd,
  phs,
  pick,
  pickF,
  pickOut,
  pickReset,
  pickRestart,
  pickSqueeze,
  pickmod,
  pickmodF,
  pickmodOut,
  pickmodReset,
  pickmodRestart,
  pickmodSqueeze,
  pipe,
  pitchJump,
  pitchJumpTime,
  ply,
  plyForEach,
  plyWith,
  pm,
  polyBind,
  polyTouch,
  polymeter,
  polyrhythm,
  postgain,
  pow,
  pr,
  prel,
  prelease,
  press,
  pressBy,
  progNum,
  psus,
  psustain,
  pure,
  pw,
  pwrate,
  pwsweep,
  rand,
  rand2,
  randL,
  randcat,
  randrun,
  range: range$2,
  range2,
  rangex,
  rarely,
  rate,
  ratio,
  rdim,
  real,
  ref: ref$1,
  register,
  registerControl,
  reify,
  rel,
  release,
  removeUndefineds,
  repeatCycles,
  repeatTime,
  repl: repl$2,
  replicate,
  resonance,
  rev,
  rfade,
  rib,
  ribbon,
  ring,
  ringdf,
  ringf,
  rlp,
  room,
  roomdim,
  roomfade,
  roomlp,
  roomsize,
  rotate: rotate$2,
  round,
  rsize,
  run,
  s,
  s_add,
  s_alt,
  s_cat,
  s_contract,
  s_expand,
  s_extend,
  s_polymeter,
  s_sub,
  s_taper,
  s_taperlist,
  s_tour,
  s_zip,
  saw,
  saw2,
  scram,
  scramble,
  scrub,
  seconds,
  seg,
  segment,
  semitone,
  seq,
  seqPLoop,
  sequence,
  sequenceP,
  set,
  setStringParser,
  setTime,
  shape,
  shrink,
  shrinklist,
  shuffle: shuffle$2,
  signal,
  silence,
  sine,
  sine2,
  size,
  slice,
  slide,
  slow,
  slowChunk,
  slowcat,
  slowcatPrime,
  slowchunk,
  smear: smear$1,
  sol2note,
  someCycles,
  someCyclesBy,
  sometimes,
  sometimesBy,
  songPtr,
  sound,
  source,
  sparsity,
  speak,
  speed,
  splice,
  splitAt,
  spread,
  square,
  square2,
  squeeze,
  squeezeBind,
  squiz,
  src,
  stack,
  stackBy,
  stackCentre,
  stackLeft,
  stackRight,
  steady,
  stepBind,
  stepalt,
  stepcat,
  steps: steps$2,
  stepsPerOctave,
  stretch,
  striate,
  stringifyValues,
  struct,
  strudelScope,
  stut,
  stutWith,
  stutwith,
  sub,
  superimpose,
  sus,
  sustain,
  sustainpedal,
  swing,
  swingBy,
  sysex,
  sysexdata,
  sysexid,
  sz,
  take,
  time: time$1,
  timeCat,
  timecat,
  toBipolar,
  tokenizeNote: tokenizeNote$3,
  tour,
  tremolo,
  tremolodepth,
  tremolophase,
  tremoloshape,
  tremoloskew,
  tremolosync,
  tri,
  tri2,
  triode,
  tsdelay,
  uid,
  undegrade,
  undegradeBy,
  unicodeToBase64,
  uniq,
  uniqsort,
  uniqsortr,
  unison,
  unit,
  v,
  val,
  valueToMidi: valueToMidi$1,
  velocity,
  vib,
  vibmod,
  vibrato,
  vmod,
  voice,
  vowel,
  warp,
  warpatt,
  warpattack,
  warpdc,
  warpdec,
  warpdecay,
  warpdepth,
  warpenv,
  warpmode,
  warprate,
  warprel,
  warprelease,
  warpshape,
  warpskew,
  warpsus,
  warpsustain,
  warpsync,
  waveloss,
  wavetablePhaseRand,
  wavetablePosition,
  wavetableWarp,
  wavetableWarpMode,
  wchoose,
  wchooseCycles,
  when,
  whenKey,
  withValue,
  within,
  wrandcat,
  wt,
  wtatt,
  wtattack,
  wtdc,
  wtdec,
  wtdecay,
  wtdepth,
  wtenv,
  wtphaserand,
  wtrate,
  wtrel,
  wtrelease,
  wtshape,
  wtskew,
  wtsus,
  wtsustain,
  wtsync,
  xfade,
  xsdelay,
  zcrush,
  zdelay,
  zip,
  zipWith,
  zmod,
  znoise,
  zoom,
  zoomArc,
  zoomarc,
  zrand,
  zzfx
}, Symbol.toStringTag, { value: "Module" }));
if (typeof DelayNode < "u") {
  class e extends DelayNode {
    constructor(a, o, u, l) {
      super(a), o = Math.abs(o), this.delayTime.value = u;
      const f = a.createGain();
      f.gain.value = Math.min(Math.abs(l), 0.995), this.feedback = f.gain;
      const p = a.createGain();
      return p.gain.value = o, this.delayGain = p, this.connect(f), this.connect(p), f.connect(this), this.connect = (g) => p.connect(g), this;
    }
    start(a) {
      this.delayGain.gain.setValueAtTime(this.delayGain.gain.value, a + this.delayTime.value);
    }
  }
  AudioContext.prototype.createFeedbackDelay = function(t, a, o) {
    return new e(this, t, a, o);
  };
}
var reverbGen = {};
reverbGen.generateReverb = function(e, t) {
  for (var a = e.audioContext || new AudioContext(), o = a.sampleRate, u = e.numChannels || 2, l = e.decayTime * 1.5, f = Math.round(e.decayTime * o), p = Math.round(l * o), g = Math.round((e.fadeInTime || 0) * o), d = Math.pow(1 / 1e3, 1 / f), b = a.createBuffer(u, p, o), F = 0; F < u; F++) {
    for (var E = b.getChannelData(F), S = 0; S < p; S++)
      E[S] = randomSample() * Math.pow(d, S);
    for (var S = 0; S < g; S++)
      E[S] *= S / g;
  }
  applyGradualLowpass(b, e.lpFreqStart || 0, e.lpFreqEnd || 0, e.decayTime, t);
};
reverbGen.generateGraph = function(e, t, a, o, u) {
  var l = document.createElement("canvas");
  l.width = t, l.height = a;
  var f = l.getContext("2d");
  f.fillStyle = "#000", f.fillRect(0, 0, l.width, l.height), f.fillStyle = "#fff";
  for (var p = t / e.length, g = a / (u - o), d = 0; d < e.length; d++)
    f.fillRect(d * p, a - (e[d] - o) * g, 1, 1);
  return l;
};
var applyGradualLowpass = function(e, t, a, o, u) {
  if (t == 0) {
    u(e);
    return;
  }
  var l = getAllChannelData(e), f = new OfflineAudioContext(e.numberOfChannels, l[0].length, e.sampleRate), p = f.createBufferSource();
  p.buffer = e;
  var g = f.createBiquadFilter();
  t = Math.min(t, e.sampleRate / 2), a = Math.min(a, e.sampleRate / 2), g.type = "lowpass", g.Q.value = 1e-4, g.frequency.setValueAtTime(t, 0), g.frequency.linearRampToValueAtTime(a, o), p.connect(g), g.connect(f.destination), p.start(), f.oncomplete = function(d) {
    u(d.renderedBuffer), g.disconnect(), p.disconnect();
  }, f.startRendering(), window.filterNode = g;
}, getAllChannelData = function(e) {
  for (var t = [], a = 0; a < e.numberOfChannels; a++)
    t[a] = e.getChannelData(a);
  return t;
}, randomSample = function() {
  return Math.random() * 2 - 1;
};
let log = (e) => console.log(e);
function errorLogger(e, t = "superdough") {
  logger$1(`[${t}] error: ${e.message}`);
}
const logger$1 = (...e) => log(...e), setLogger = (e) => {
  log = e;
}, tokenizeNote$2 = (e) => {
  if (typeof e != "string")
    return [];
  const [t, a = "", o] = e.match(/^([a-gA-G])([#bsf]*)(-?[0-9]*)$/)?.slice(1) || [];
  return t ? [t, a, o ? Number(o) : void 0] : [];
}, chromas$1 = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }, accs$1 = { "#": 1, b: -1, s: 1, f: -1 }, getAccidentalsOffset = (e) => e?.split("").reduce((t, a) => t + accs$1[a], 0) || 0, noteToMidi = (e, t = 3) => {
  const [a, o, u = t] = tokenizeNote$2(e);
  if (!a)
    throw new Error('not a note: "' + e + '"');
  const l = chromas$1[a.toLowerCase()], f = getAccidentalsOffset(o);
  return (Number(u) + 1) * 12 + l + f;
}, midiToFreq$1 = (e) => Math.pow(2, (e - 69) / 12) * 440, clamp = (e, t, a) => Math.min(Math.max(e, t), a), freqToMidi$1 = (e) => 12 * Math.log(e / 440) / Math.LN2 + 69, valueToMidi = (e, t) => {
  if (typeof e != "object")
    throw new Error("valueToMidi: expected object value");
  let { freq: a, note: o } = e;
  return typeof a == "number" ? freqToMidi$1(a) : typeof o == "string" ? noteToMidi(o) : typeof o == "number" ? o : t;
};
function nanFallback(e, t = 0, a) {
  return isNaN(Number(e)) ? (!a && logger$1(`"${e}" is not a number, falling back to ${t}`, "warning"), t) : e;
}
const _mod$1 = (e, t) => (e % t + t) % t, getSoundIndex = (e, t) => _mod$1(Math.round(nanFallback(e, 0)), t);
function cycleToSeconds(e, t) {
  return e / t;
}
function getCommonSampleInfo(e, t) {
  const { s: a, n: o = 0 } = e;
  let u = valueToMidi(e, 36), l = u - 36, f, p = 0;
  if (Array.isArray(t))
    p = getSoundIndex(o, t.length), f = t[p];
  else {
    const d = (F) => noteToMidi(F) - u, b = Object.keys(t).filter((F) => !F.startsWith("_")).reduce(
      (F, E, S) => !F || Math.abs(d(E)) < Math.abs(d(F)) ? E : F,
      null
    );
    l = -d(b), p = getSoundIndex(o, t[b].length), f = t[b][p];
  }
  const g = `${a}:${p}`;
  return { transpose: l, url: f, index: p, midi: u, label: g };
}
const pickAndRename = (e, t) => Object.fromEntries(Object.entries(t).map(([a, o]) => [a, e[o]]));
typeof AudioContext < "u" && (AudioContext.prototype.adjustLength = function(e, t, a = 1, o = 0) {
  const u = Math.floor(clamp(o, 0, 1) * t.length), l = t.sampleRate * e, f = this.createBuffer(t.numberOfChannels, t.length, t.sampleRate);
  for (let p = 0; p < t.numberOfChannels; p++) {
    let g = t.getChannelData(p), d = f.getChannelData(p);
    for (let b = 0; b < l; b++) {
      let F = (u + b * Math.abs(a)) % g.length;
      a < 1 && (F = F * -1), d[b] = g.at(F) || 0;
    }
  }
  return f;
}, AudioContext.prototype.createReverb = function(e, t, a, o, u, l, f) {
  const p = this.createConvolver();
  return p.generate = (g = 2, d = 0.1, b = 15e3, F = 1e3, E, S, R) => {
    p.duration = g, p.fade = d, p.lp = b, p.dim = F, p.ir = E, p.irspeed = S, p.irbegin = R, E ? p.buffer = this.adjustLength(g, E, S, R) : reverbGen.generateReverb(
      {
        audioContext: this,
        numChannels: 2,
        decayTime: g,
        fadeInTime: d,
        lpFreqStart: b,
        lpFreqEnd: F
      },
      (k) => {
        p.buffer = k;
      }
    );
  }, p.generate(e, t, a, o, u, l, f), p;
});
var vowelFormant = {
  a: { freqs: [660, 1120, 2750, 3e3, 3350], gains: [1, 0.5012, 0.0708, 0.0631, 0.0126], qs: [80, 90, 120, 130, 140] },
  e: { freqs: [440, 1800, 2700, 3e3, 3300], gains: [1, 0.1995, 0.1259, 0.1, 0.1], qs: [70, 80, 100, 120, 120] },
  i: { freqs: [270, 1850, 2900, 3350, 3590], gains: [1, 0.0631, 0.0631, 0.0158, 0.0158], qs: [40, 90, 100, 120, 120] },
  o: { freqs: [430, 820, 2700, 3e3, 3300], gains: [1, 0.3162, 0.0501, 0.0794, 0.01995], qs: [40, 80, 100, 120, 120] },
  u: { freqs: [370, 630, 2750, 3e3, 3400], gains: [1, 0.1, 0.0708, 0.0316, 0.01995], qs: [40, 60, 100, 120, 120] },
  ae: { freqs: [650, 1515, 2400, 3e3, 3350], gains: [1, 0.5, 0.1008, 0.0631, 0.0126], qs: [80, 90, 120, 130, 140] },
  aa: { freqs: [560, 900, 2570, 3e3, 3300], gains: [1, 0.5, 0.0708, 0.0631, 0.0126], qs: [80, 90, 120, 130, 140] },
  oe: { freqs: [500, 1430, 2300, 3e3, 3300], gains: [1, 0.2, 0.0708, 0.0316, 0.01995], qs: [40, 60, 100, 120, 120] },
  ue: { freqs: [250, 1750, 2150, 3200, 3300], gains: [1, 0.1, 0.0708, 0.0316, 0.01995], qs: [40, 60, 100, 120, 120] },
  y: { freqs: [400, 1460, 2400, 3e3, 3300], gains: [1, 0.2, 0.0708, 0.0316, 0.02995], qs: [40, 60, 100, 120, 120] },
  uh: { freqs: [600, 1250, 2100, 3100, 3500], gains: [1, 0.3, 0.0608, 0.0316, 0.01995], qs: [40, 70, 100, 120, 130] },
  un: { freqs: [500, 1240, 2280, 3e3, 3500], gains: [1, 0.1, 0.1708, 0.0216, 0.02995], qs: [40, 60, 100, 120, 120] },
  en: { freqs: [600, 1480, 2450, 3200, 3300], gains: [1, 0.15, 0.0708, 0.0316, 0.02995], qs: [40, 60, 100, 120, 120] },
  an: { freqs: [700, 1050, 2500, 3e3, 3300], gains: [1, 0.1, 0.0708, 0.0316, 0.02995], qs: [40, 60, 100, 120, 120] },
  on: { freqs: [500, 1080, 2350, 3e3, 3300], gains: [1, 0.1, 0.0708, 0.0316, 0.02995], qs: [40, 60, 100, 120, 120] },
  get æ() {
    return this.ae;
  },
  get ø() {
    return this.oe;
  },
  get ɑ() {
    return this.aa;
  },
  get å() {
    return this.aa;
  },
  get ö() {
    return this.oe;
  },
  get ü() {
    return this.ue;
  },
  get ı() {
    return this.y;
  }
};
if (typeof GainNode < "u") {
  class e extends GainNode {
    constructor(a, o) {
      if (super(a), !vowelFormant[o])
        throw new Error("vowel: unknown vowel " + o);
      const { gains: u, qs: l, freqs: f } = vowelFormant[o], p = a.createGain();
      for (let g = 0; g < 5; g++) {
        const d = a.createGain();
        d.gain.value = u[g];
        const b = a.createBiquadFilter();
        b.type = "bandpass", b.Q.value = l[g], b.frequency.value = f[g], this.connect(b), b.connect(d), d.connect(p);
      }
      return p.gain.value = 8, this.connect = (g) => p.connect(g), this;
    }
  }
  AudioContext.prototype.createVowelFilter = function(t) {
    return new e(this, t);
  };
}
const workletsUrl = "data:text/javascript;base64,dmFyIF89ZnVuY3Rpb24oayl7InVzZSBzdHJpY3QiO3ZhciB5ZT1PYmplY3QuZGVmaW5lUHJvcGVydHk7dmFyIEFlPShrLFcsSCk9PlcgaW4gaz95ZShrLFcse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOkh9KTprW1ddPUg7dmFyIHl0PShrLFcsSCk9PkFlKGssdHlwZW9mIFchPSJzeW1ib2wiP1crIiI6VyxIKTtjbGFzcyBIIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye2NvbnN0cnVjdG9yKHQpe3N1cGVyKHQpLHRoaXMuc3RhcnRlZD0hMSx0aGlzLm5iSW5wdXRzPXQubnVtYmVyT2ZJbnB1dHMsdGhpcy5uYk91dHB1dHM9dC5udW1iZXJPZk91dHB1dHMsdGhpcy5ibG9ja1NpemU9dC5wcm9jZXNzb3JPcHRpb25zLmJsb2NrU2l6ZSx0aGlzLmhvcFNpemU9MTI4LHRoaXMubmJPdmVybGFwcz10aGlzLmJsb2NrU2l6ZS90aGlzLmhvcFNpemUsdGhpcy5pbnB1dEJ1ZmZlcnM9bmV3IEFycmF5KHRoaXMubmJJbnB1dHMpLHRoaXMuaW5wdXRCdWZmZXJzSGVhZD1uZXcgQXJyYXkodGhpcy5uYklucHV0cyksdGhpcy5pbnB1dEJ1ZmZlcnNUb1NlbmQ9bmV3IEFycmF5KHRoaXMubmJJbnB1dHMpO2ZvcihsZXQgZT0wO2U8dGhpcy5uYklucHV0cztlKyspdGhpcy5hbGxvY2F0ZUlucHV0Q2hhbm5lbHMoZSwxKTt0aGlzLm91dHB1dEJ1ZmZlcnM9bmV3IEFycmF5KHRoaXMubmJPdXRwdXRzKSx0aGlzLm91dHB1dEJ1ZmZlcnNUb1JldHJpZXZlPW5ldyBBcnJheSh0aGlzLm5iT3V0cHV0cyk7Zm9yKGxldCBlPTA7ZTx0aGlzLm5iT3V0cHV0cztlKyspdGhpcy5hbGxvY2F0ZU91dHB1dENoYW5uZWxzKGUsMSl9cmVhbGxvY2F0ZUNoYW5uZWxzSWZOZWVkZWQodCxlKXtmb3IobGV0IHM9MDtzPHRoaXMubmJJbnB1dHM7cysrKXtsZXQgcj10W3NdLmxlbmd0aDtyIT10aGlzLmlucHV0QnVmZmVyc1tzXS5sZW5ndGgmJnRoaXMuYWxsb2NhdGVJbnB1dENoYW5uZWxzKHMscil9Zm9yKGxldCBzPTA7czx0aGlzLm5iT3V0cHV0cztzKyspe2xldCByPWVbc10ubGVuZ3RoO3IhPXRoaXMub3V0cHV0QnVmZmVyc1tzXS5sZW5ndGgmJnRoaXMuYWxsb2NhdGVPdXRwdXRDaGFubmVscyhzLHIpfX1hbGxvY2F0ZUlucHV0Q2hhbm5lbHModCxlKXt0aGlzLmlucHV0QnVmZmVyc1t0XT1uZXcgQXJyYXkoZSk7Zm9yKGxldCBzPTA7czxlO3MrKyl0aGlzLmlucHV0QnVmZmVyc1t0XVtzXT1uZXcgRmxvYXQzMkFycmF5KHRoaXMuYmxvY2tTaXplKzEyOCksdGhpcy5pbnB1dEJ1ZmZlcnNbdF1bc10uZmlsbCgwKTt0aGlzLmlucHV0QnVmZmVyc0hlYWRbdF09bmV3IEFycmF5KGUpLHRoaXMuaW5wdXRCdWZmZXJzVG9TZW5kW3RdPW5ldyBBcnJheShlKTtmb3IobGV0IHM9MDtzPGU7cysrKXRoaXMuaW5wdXRCdWZmZXJzSGVhZFt0XVtzXT10aGlzLmlucHV0QnVmZmVyc1t0XVtzXS5zdWJhcnJheSgwLHRoaXMuYmxvY2tTaXplKSx0aGlzLmlucHV0QnVmZmVyc1RvU2VuZFt0XVtzXT1uZXcgRmxvYXQzMkFycmF5KHRoaXMuYmxvY2tTaXplKX1hbGxvY2F0ZU91dHB1dENoYW5uZWxzKHQsZSl7dGhpcy5vdXRwdXRCdWZmZXJzW3RdPW5ldyBBcnJheShlKTtmb3IobGV0IHM9MDtzPGU7cysrKXRoaXMub3V0cHV0QnVmZmVyc1t0XVtzXT1uZXcgRmxvYXQzMkFycmF5KHRoaXMuYmxvY2tTaXplKSx0aGlzLm91dHB1dEJ1ZmZlcnNbdF1bc10uZmlsbCgwKTt0aGlzLm91dHB1dEJ1ZmZlcnNUb1JldHJpZXZlW3RdPW5ldyBBcnJheShlKTtmb3IobGV0IHM9MDtzPGU7cysrKXRoaXMub3V0cHV0QnVmZmVyc1RvUmV0cmlldmVbdF1bc109bmV3IEZsb2F0MzJBcnJheSh0aGlzLmJsb2NrU2l6ZSksdGhpcy5vdXRwdXRCdWZmZXJzVG9SZXRyaWV2ZVt0XVtzXS5maWxsKDApfXJlYWRJbnB1dHModCl7aWYodFswXS5sZW5ndGgmJnRbMF1bMF0ubGVuZ3RoPT0wKXtmb3IobGV0IGU9MDtlPHRoaXMubmJJbnB1dHM7ZSsrKWZvcihsZXQgcz0wO3M8dGhpcy5pbnB1dEJ1ZmZlcnNbZV0ubGVuZ3RoO3MrKyl0aGlzLmlucHV0QnVmZmVyc1tlXVtzXS5maWxsKDAsdGhpcy5ibG9ja1NpemUpO3JldHVybn1mb3IobGV0IGU9MDtlPHRoaXMubmJJbnB1dHM7ZSsrKWZvcihsZXQgcz0wO3M8dGhpcy5pbnB1dEJ1ZmZlcnNbZV0ubGVuZ3RoO3MrKyl7bGV0IHI9dFtlXVtzXTt0aGlzLmlucHV0QnVmZmVyc1tlXVtzXS5zZXQocix0aGlzLmJsb2NrU2l6ZSl9fXdyaXRlT3V0cHV0cyh0KXtmb3IobGV0IGU9MDtlPHRoaXMubmJJbnB1dHM7ZSsrKWZvcihsZXQgcz0wO3M8dGhpcy5pbnB1dEJ1ZmZlcnNbZV0ubGVuZ3RoO3MrKyl7bGV0IHI9dGhpcy5vdXRwdXRCdWZmZXJzW2VdW3NdLnN1YmFycmF5KDAsMTI4KTt0W2VdW3NdLnNldChyKX19c2hpZnRJbnB1dEJ1ZmZlcnMoKXtmb3IobGV0IHQ9MDt0PHRoaXMubmJJbnB1dHM7dCsrKWZvcihsZXQgZT0wO2U8dGhpcy5pbnB1dEJ1ZmZlcnNbdF0ubGVuZ3RoO2UrKyl0aGlzLmlucHV0QnVmZmVyc1t0XVtlXS5jb3B5V2l0aGluKDAsMTI4KX1zaGlmdE91dHB1dEJ1ZmZlcnMoKXtmb3IobGV0IHQ9MDt0PHRoaXMubmJPdXRwdXRzO3QrKylmb3IobGV0IGU9MDtlPHRoaXMub3V0cHV0QnVmZmVyc1t0XS5sZW5ndGg7ZSsrKXRoaXMub3V0cHV0QnVmZmVyc1t0XVtlXS5jb3B5V2l0aGluKDAsMTI4KSx0aGlzLm91dHB1dEJ1ZmZlcnNbdF1bZV0uc3ViYXJyYXkodGhpcy5ibG9ja1NpemUtMTI4KS5maWxsKDApfXByZXBhcmVJbnB1dEJ1ZmZlcnNUb1NlbmQoKXtmb3IobGV0IHQ9MDt0PHRoaXMubmJJbnB1dHM7dCsrKWZvcihsZXQgZT0wO2U8dGhpcy5pbnB1dEJ1ZmZlcnNbdF0ubGVuZ3RoO2UrKyl0aGlzLmlucHV0QnVmZmVyc1RvU2VuZFt0XVtlXS5zZXQodGhpcy5pbnB1dEJ1ZmZlcnNIZWFkW3RdW2VdKX1oYW5kbGVPdXRwdXRCdWZmZXJzVG9SZXRyaWV2ZSgpe2ZvcihsZXQgdD0wO3Q8dGhpcy5uYk91dHB1dHM7dCsrKWZvcihsZXQgZT0wO2U8dGhpcy5vdXRwdXRCdWZmZXJzW3RdLmxlbmd0aDtlKyspZm9yKGxldCBzPTA7czx0aGlzLmJsb2NrU2l6ZTtzKyspdGhpcy5vdXRwdXRCdWZmZXJzW3RdW2VdW3NdKz10aGlzLm91dHB1dEJ1ZmZlcnNUb1JldHJpZXZlW3RdW2VdW3NdL3RoaXMubmJPdmVybGFwc31wcm9jZXNzKHQsZSxzKXtjb25zdCBpPXRbMF1bMF0hPT12b2lkIDA7cmV0dXJuIHRoaXMuc3RhcnRlZCYmIWk/ITE6KHRoaXMuc3RhcnRlZD1pLHRoaXMucmVhbGxvY2F0ZUNoYW5uZWxzSWZOZWVkZWQodCxlKSx0aGlzLnJlYWRJbnB1dHModCksdGhpcy5zaGlmdElucHV0QnVmZmVycygpLHRoaXMucHJlcGFyZUlucHV0QnVmZmVyc1RvU2VuZCgpLHRoaXMucHJvY2Vzc09MQSh0aGlzLmlucHV0QnVmZmVyc1RvU2VuZCx0aGlzLm91dHB1dEJ1ZmZlcnNUb1JldHJpZXZlLHMpLHRoaXMuaGFuZGxlT3V0cHV0QnVmZmVyc1RvUmV0cmlldmUoKSx0aGlzLndyaXRlT3V0cHV0cyhlKSx0aGlzLnNoaWZ0T3V0cHV0QnVmZmVycygpLCEwKX1wcm9jZXNzT0xBKHQsZSxzKXtjb25zb2xlLmFzc2VydCghMSwiTm90IG92ZXJyaWRlbiIpfX1jbGFzcyB6dHtjb25zdHJ1Y3Rvcih0KXtpZih0aGlzLnNpemU9dHwwLHRoaXMuc2l6ZTw9MXx8dGhpcy5zaXplJnRoaXMuc2l6ZS0xKXRocm93IG5ldyBFcnJvcigiRkZUIHNpemUgbXVzdCBiZSBhIHBvd2VyIG9mIHR3byBhbmQgYmlnZ2VyIHRoYW4gMSIpO3RoaXMuX2NzaXplPXQ8PDE7Zm9yKHZhciBlPW5ldyBBcnJheSh0aGlzLnNpemUqMikscz0wO3M8ZS5sZW5ndGg7cys9Mil7Y29uc3QgYz1NYXRoLlBJKnMvdGhpcy5zaXplO2Vbc109TWF0aC5jb3MoYyksZVtzKzFdPS1NYXRoLnNpbihjKX10aGlzLnRhYmxlPWU7Zm9yKHZhciByPTAsaT0xO3RoaXMuc2l6ZT5pO2k8PD0xKXIrKzt0aGlzLl93aWR0aD1yJTI9PT0wP3ItMTpyLHRoaXMuX2JpdHJldj1uZXcgQXJyYXkoMTw8dGhpcy5fd2lkdGgpO2Zvcih2YXIgbz0wO288dGhpcy5fYml0cmV2Lmxlbmd0aDtvKyspe3RoaXMuX2JpdHJldltvXT0wO2Zvcih2YXIgYT0wO2E8dGhpcy5fd2lkdGg7YSs9Mil7dmFyIHU9dGhpcy5fd2lkdGgtYS0yO3RoaXMuX2JpdHJldltvXXw9KG8+Pj5hJjMpPDx1fX10aGlzLl9vdXQ9bnVsbCx0aGlzLl9kYXRhPW51bGwsdGhpcy5faW52PTB9ZnJvbUNvbXBsZXhBcnJheSh0LGUpe2Zvcih2YXIgcz1lfHxuZXcgQXJyYXkodC5sZW5ndGg+Pj4xKSxyPTA7cjx0Lmxlbmd0aDtyKz0yKXNbcj4+PjFdPXRbcl07cmV0dXJuIHN9Y3JlYXRlQ29tcGxleEFycmF5KCl7Y29uc3QgdD1uZXcgQXJyYXkodGhpcy5fY3NpemUpO2Zvcih2YXIgZT0wO2U8dC5sZW5ndGg7ZSsrKXRbZV09MDtyZXR1cm4gdH10b0NvbXBsZXhBcnJheSh0LGUpe2Zvcih2YXIgcz1lfHx0aGlzLmNyZWF0ZUNvbXBsZXhBcnJheSgpLHI9MDtyPHMubGVuZ3RoO3IrPTIpc1tyXT10W3I+Pj4xXSxzW3IrMV09MDtyZXR1cm4gc31jb21wbGV0ZVNwZWN0cnVtKHQpe2Zvcih2YXIgZT10aGlzLl9jc2l6ZSxzPWU+Pj4xLHI9MjtyPHM7cis9Mil0W2Utcl09dFtyXSx0W2UtcisxXT0tdFtyKzFdfXRyYW5zZm9ybSh0LGUpe2lmKHQ9PT1lKXRocm93IG5ldyBFcnJvcigiSW5wdXQgYW5kIG91dHB1dCBidWZmZXJzIG11c3QgYmUgZGlmZmVyZW50Iik7dGhpcy5fb3V0PXQsdGhpcy5fZGF0YT1lLHRoaXMuX2ludj0wLHRoaXMuX3RyYW5zZm9ybTQoKSx0aGlzLl9vdXQ9bnVsbCx0aGlzLl9kYXRhPW51bGx9cmVhbFRyYW5zZm9ybSh0LGUpe2lmKHQ9PT1lKXRocm93IG5ldyBFcnJvcigiSW5wdXQgYW5kIG91dHB1dCBidWZmZXJzIG11c3QgYmUgZGlmZmVyZW50Iik7dGhpcy5fb3V0PXQsdGhpcy5fZGF0YT1lLHRoaXMuX2ludj0wLHRoaXMuX3JlYWxUcmFuc2Zvcm00KCksdGhpcy5fb3V0PW51bGwsdGhpcy5fZGF0YT1udWxsfWludmVyc2VUcmFuc2Zvcm0odCxlKXtpZih0PT09ZSl0aHJvdyBuZXcgRXJyb3IoIklucHV0IGFuZCBvdXRwdXQgYnVmZmVycyBtdXN0IGJlIGRpZmZlcmVudCIpO3RoaXMuX291dD10LHRoaXMuX2RhdGE9ZSx0aGlzLl9pbnY9MSx0aGlzLl90cmFuc2Zvcm00KCk7Zm9yKHZhciBzPTA7czx0Lmxlbmd0aDtzKyspdFtzXS89dGhpcy5zaXplO3RoaXMuX291dD1udWxsLHRoaXMuX2RhdGE9bnVsbH1fdHJhbnNmb3JtNCgpe3ZhciB0PXRoaXMuX291dCxlPXRoaXMuX2NzaXplLHM9dGhpcy5fd2lkdGgscj0xPDxzLGk9ZS9yPDwxLG8sYSx1PXRoaXMuX2JpdHJldjtpZihpPT09NClmb3Iobz0wLGE9MDtvPGU7bys9aSxhKyspe2NvbnN0IG09dVthXTt0aGlzLl9zaW5nbGVUcmFuc2Zvcm0yKG8sbSxyKX1lbHNlIGZvcihvPTAsYT0wO288ZTtvKz1pLGErKyl7Y29uc3QgbT11W2FdO3RoaXMuX3NpbmdsZVRyYW5zZm9ybTQobyxtLHIpfXZhciBjPXRoaXMuX2ludj8tMToxLGg9dGhpcy50YWJsZTtmb3Iocj4+PTI7cj49MjtyPj49Mil7aT1lL3I8PDE7dmFyIGY9aT4+PjI7Zm9yKG89MDtvPGU7bys9aSlmb3IodmFyIGQ9bytmLGw9byxwPTA7bDxkO2wrPTIscCs9cil7Y29uc3QgbT1sLEk9bStmLGc9SStmLHY9ZytmLFA9dFttXSxUPXRbbSsxXSxTPXRbSV0sVj10W0krMV0sTT10W2ddLHg9dFtnKzFdLHk9dFt2XSxBPXRbdisxXSxMPVAsTj1ULHo9aFtwXSxPPWMqaFtwKzFdLEY9Uyp6LVYqTyxDPVMqTytWKnosaj1oWzIqcF0sUj1jKmhbMipwKzFdLHJ0PU0qai14KlIsbnQ9TSpSK3gqaixpdD1oWzMqcF0sb3Q9YypoWzMqcCsxXSxhdD15Kml0LUEqb3QsY3Q9eSpvdCtBKml0LHV0PUwrcnQsUT1OK250LEo9TC1ydCxodD1OLW50LGx0PUYrYXQsWD1DK2N0LHR0PWMqKEYtYXQpLGZ0PWMqKEMtY3QpLG10PXV0K2x0LEJ0PVErWCx3dD11dC1sdCxQdD1RLVgsVHQ9SitmdCxNdD1odC10dCxTdD1KLWZ0LFZ0PWh0K3R0O3RbbV09bXQsdFttKzFdPUJ0LHRbSV09VHQsdFtJKzFdPU10LHRbZ109d3QsdFtnKzFdPVB0LHRbdl09U3QsdFt2KzFdPVZ0fX19X3NpbmdsZVRyYW5zZm9ybTIodCxlLHMpe2NvbnN0IHI9dGhpcy5fb3V0LGk9dGhpcy5fZGF0YSxvPWlbZV0sYT1pW2UrMV0sdT1pW2Urc10sYz1pW2UrcysxXSxoPW8rdSxmPWErYyxkPW8tdSxsPWEtYztyW3RdPWgsclt0KzFdPWYsclt0KzJdPWQsclt0KzNdPWx9X3NpbmdsZVRyYW5zZm9ybTQodCxlLHMpe2NvbnN0IHI9dGhpcy5fb3V0LGk9dGhpcy5fZGF0YSxvPXRoaXMuX2ludj8tMToxLGE9cyoyLHU9cyozLGM9aVtlXSxoPWlbZSsxXSxmPWlbZStzXSxkPWlbZStzKzFdLGw9aVtlK2FdLHA9aVtlK2ErMV0sbT1pW2UrdV0sST1pW2UrdSsxXSxnPWMrbCx2PWgrcCxQPWMtbCxUPWgtcCxTPWYrbSxWPWQrSSxNPW8qKGYtbSkseD1vKihkLUkpLHk9ZytTLEE9ditWLEw9UCt4LE49VC1NLHo9Zy1TLE89di1WLEY9UC14LEM9VCtNO3JbdF09eSxyW3QrMV09QSxyW3QrMl09TCxyW3QrM109TixyW3QrNF09eixyW3QrNV09TyxyW3QrNl09RixyW3QrN109Q31fcmVhbFRyYW5zZm9ybTQoKXt2YXIgdD10aGlzLl9vdXQsZT10aGlzLl9jc2l6ZSxzPXRoaXMuX3dpZHRoLHI9MTw8cyxpPWUvcjw8MSxvLGEsdT10aGlzLl9iaXRyZXY7aWYoaT09PTQpZm9yKG89MCxhPTA7bzxlO28rPWksYSsrKXtjb25zdCB4dD11W2FdO3RoaXMuX3NpbmdsZVJlYWxUcmFuc2Zvcm0yKG8seHQ+Pj4xLHI+Pj4xKX1lbHNlIGZvcihvPTAsYT0wO288ZTtvKz1pLGErKyl7Y29uc3QgeHQ9dVthXTt0aGlzLl9zaW5nbGVSZWFsVHJhbnNmb3JtNChvLHh0Pj4+MSxyPj4+MSl9dmFyIGM9dGhpcy5faW52Py0xOjEsaD10aGlzLnRhYmxlO2ZvcihyPj49MjtyPj0yO3I+Pj0yKXtpPWUvcjw8MTt2YXIgZj1pPj4+MSxkPWY+Pj4xLGw9ZD4+PjE7Zm9yKG89MDtvPGU7bys9aSlmb3IodmFyIHA9MCxtPTA7cDw9bDtwKz0yLG0rPXIpe3ZhciBJPW8rcCxnPUkrZCx2PWcrZCxQPXYrZCxUPXRbSV0sUz10W0krMV0sVj10W2ddLE09dFtnKzFdLHg9dFt2XSx5PXRbdisxXSxBPXRbUF0sTD10W1ArMV0sTj1ULHo9UyxPPWhbbV0sRj1jKmhbbSsxXSxDPVYqTy1NKkYsaj1WKkYrTSpPLFI9aFsyKm1dLHJ0PWMqaFsyKm0rMV0sbnQ9eCpSLXkqcnQsaXQ9eCpydCt5KlIsb3Q9aFszKm1dLGF0PWMqaFszKm0rMV0sY3Q9QSpvdC1MKmF0LHV0PUEqYXQrTCpvdCxRPU4rbnQsSj16K2l0LGh0PU4tbnQsbHQ9ei1pdCxYPUMrY3QsdHQ9ait1dCxmdD1jKihDLWN0KSxtdD1jKihqLXV0KSxCdD1RK1gsd3Q9Sit0dCxQdD1odCttdCxUdD1sdC1mdDtpZih0W0ldPUJ0LHRbSSsxXT13dCx0W2ddPVB0LHRbZysxXT1UdCxwPT09MCl7dmFyIE10PVEtWCxTdD1KLXR0O3Rbdl09TXQsdFt2KzFdPVN0O2NvbnRpbnVlfWlmKHAhPT1sKXt2YXIgVnQ9aHQsYmU9LWx0LEllPVEsX2U9LUosQmU9LWMqbXQsd2U9LWMqZnQsUGU9LWMqdHQsVGU9LWMqWCxNZT1WdCtCZSxTZT1iZSt3ZSxWZT1JZStUZSx4ZT1fZS1QZSxFdD1vK2QtcCxEdD1vK2YtcDt0W0V0XT1NZSx0W0V0KzFdPVNlLHRbRHRdPVZlLHRbRHQrMV09eGV9fX19X3NpbmdsZVJlYWxUcmFuc2Zvcm0yKHQsZSxzKXtjb25zdCByPXRoaXMuX291dCxpPXRoaXMuX2RhdGEsbz1pW2VdLGE9aVtlK3NdLHU9bythLGM9by1hO3JbdF09dSxyW3QrMV09MCxyW3QrMl09YyxyW3QrM109MH1fc2luZ2xlUmVhbFRyYW5zZm9ybTQodCxlLHMpe2NvbnN0IHI9dGhpcy5fb3V0LGk9dGhpcy5fZGF0YSxvPXRoaXMuX2ludj8tMToxLGE9cyoyLHU9cyozLGM9aVtlXSxoPWlbZStzXSxmPWlbZSthXSxkPWlbZSt1XSxsPWMrZixwPWMtZixtPWgrZCxJPW8qKGgtZCksZz1sK20sdj1wLFA9LUksVD1sLW0sUz1wLFY9STtyW3RdPWcsclt0KzFdPTAsclt0KzJdPXYsclt0KzNdPVAsclt0KzRdPVQsclt0KzVdPTAsclt0KzZdPVMsclt0KzddPVZ9fWxldCBXdD1uPT5jb25zb2xlLmxvZyhuKTtjb25zdCBxdD0oLi4ubik9Pld0KC4uLm4pLEx0PShuLHQsZSk9Pk1hdGgubWluKE1hdGgubWF4KG4sdCksZSksQXQ9bj0+bi8oMStuKSxZdD0obix0KT0+KG4ldCt0KSV0LGp0PShuLHQpPT4oMSt0KSpuLygxK3QqTWF0aC5hYnMobikpLEs9KG4sdCk9Pk1hdGgudGFuaChuKigxK3QpKSxIdD0obix0KT0+THQoKDErdCkqbiwtMSwxKSxOdD0obix0KT0+e2xldCBlPSgxKy41KnQpKm47Y29uc3Qgcz1ZdChlKzEsNCk7cmV0dXJuIDEtTWF0aC5hYnMocy0yKX0sS3Q9KG4sdCk9Pk1hdGguc2luKE1hdGguUEkvMipOdChuLHQpKSxVdD0obix0KT0+e2NvbnN0IGU9QXQoTWF0aC5sb2cxcCh0KSkscz0obi1lLzMqbipuKm4pLygxLWUvMyk7cmV0dXJuIEsocyx0KX0sT3Q9KG4sdCxlPSExKT0+e2NvbnN0IHM9MSsyKnQsaT0uMDcqQXQoTWF0aC5sb2cxcCh0KSksbz1LKG4raSwyKnQpLGE9SyhlP2k6LW4raSwyKnQpLHU9by1hLGM9MS9NYXRoLmNvc2gocyppKSxoPWMqYyxmPU1hdGgubWF4KDFlLTgsKGU/MToyKSpzKmgpO3JldHVybiBLKHUvZix0KX0sRnQ9e3NjdXJ2ZTpqdCxzb2Z0OkssaGFyZDpIdCxjdWJpYzpVdCxkaW9kZTpPdCxhc3ltOihuLHQpPT5PdChuLHQsITApLGZvbGQ6TnQsc2luZWZvbGQ6S3QsY2hlYnlzaGV2OihuLHQpPT57Y29uc3QgZT0xMCpNYXRoLmxvZzFwKHQpO2xldCBzPTEscj1uLGksbz0wO2ZvcihsZXQgYT0xO2E8NjQ7YSsrKXtpZihhPDIpe28rPWE9PTA/czpyO2NvbnRpbnVlfWk9MipuKnMtcixyPXMscz1pLGElMj09PTAmJihvKz1NYXRoLm1pbigxLjMqZS9hLDIpKmkpfXJldHVybiBLKG8sZS8yMCl9fSxldD1PYmplY3QuZnJlZXplKE9iamVjdC5rZXlzKEZ0KSksWnQ9bj0+e2xldCB0PW47dHlwZW9mIG49PSJzdHJpbmciJiYodD1ldC5pbmRleE9mKG4pLHQ9PT0tMSYmKHF0KGBbc3VwZXJkb3VnaF0gQ291bGQgbm90IGZpbmQgd2F2ZXNoYXBpbmcgYWxnb3JpdGhtICR7bn0uCiAgICAgICAgQXZhaWxhYmxlIG9wdGlvbnMgYXJlICR7ZXQuam9pbigiLCAiKX0uCiAgICAgICAgRGVmYXVsdGluZyB0byAke2V0WzBdfS5gKSx0PTApKTtjb25zdCBlPWV0W3QlZXQubGVuZ3RoXTtyZXR1cm4gRnRbZV19LFU9MTI4LEU9TWF0aC5QSSxEPTIqRSxZPTEvc2FtcGxlUmF0ZSx3PShuLHQsZSk9Pk1hdGgubWluKE1hdGgubWF4KG4sdCksZSksYj0obix0KT0+blt0XT8/blswXSxkdD1uPT5uLU1hdGguZmxvb3IobiksWj1uPT5ufDAsJD1uPT5aKG4rLjUpLCR0PW49PloobisxKSxwdD1uPT5uLVoobikscT1uPT57Y29uc3QgdD1uKioyO3JldHVybiBuKigyNyt0KS8oMjcrOSp0KX0sQ3Q9KG4sdCk9PntpZihuPDIpcmV0dXJuIHI9PjA7Y29uc3QgZT10LyhuLTEpLHM9dCouNTtyZXR1cm4gcj0+ciplLXN9LEc9KG4sdCk9Pm4qTWF0aC5wb3coMix0LzEyKTtmdW5jdGlvbiBHdChuLHQpe3Q9TWF0aC5taW4odCwxLXQpO2NvbnN0IGU9MS90O3JldHVybiBuPHQ/KG4qPWUsMipuLW4qKjItMSk6bj4xLXQ/KG49KG4tMSkqZSxuKioyKzIqbisxKTowfWNvbnN0IHZ0PXt0cmkobix0PS41KXtjb25zdCBlPTEtdDtyZXR1cm4gbj49dD8xL2Utbi9lOm4vdH0sc2luZShuKXtyZXR1cm4gTWF0aC5zaW4oRCpuKSouNSsuNX0scmFtcChuKXtyZXR1cm4gbn0sc2F3KG4pe3JldHVybiAxLW59LHNxdWFyZShuLHQ9LjUpe3JldHVybiBuPj10PzA6MX0sY3VzdG9tKG4sdD1bMCwxXSl7Y29uc3QgZT10Lmxlbmd0aC0xLHM9TWF0aC5mbG9vcihuKmUpLHI9MS9lLGk9dyh0W3NdLDAsMSksYT13KHRbcysxXSwwLDEpLHU9aSxjPTAsaD1yO3JldHVybihhLXUpLyhoLWMpKihuLXIqcykraX0sc2F3YmxlcChuLHQpe3JldHVybiAyKm4tMS1HdChuLHQpfX0sUXQ9T2JqZWN0LmtleXModnQpO2NsYXNzIEp0IGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye3N0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKXtyZXR1cm5be25hbWU6ImJlZ2luIixkZWZhdWx0VmFsdWU6MH0se25hbWU6InRpbWUiLGRlZmF1bHRWYWx1ZTowfSx7bmFtZToiZW5kIixkZWZhdWx0VmFsdWU6MH0se25hbWU6ImZyZXF1ZW5jeSIsZGVmYXVsdFZhbHVlOi41fSx7bmFtZToic2tldyIsZGVmYXVsdFZhbHVlOi41fSx7bmFtZToiZGVwdGgiLGRlZmF1bHRWYWx1ZToxfSx7bmFtZToicGhhc2VvZmZzZXQiLGRlZmF1bHRWYWx1ZTowfSx7bmFtZToic2hhcGUiLGRlZmF1bHRWYWx1ZTowfSx7bmFtZToiY3VydmUiLGRlZmF1bHRWYWx1ZToxfSx7bmFtZToiZGNvZmZzZXQiLGRlZmF1bHRWYWx1ZTowfSx7bmFtZToibWluIixkZWZhdWx0VmFsdWU6MH0se25hbWU6Im1heCIsZGVmYXVsdFZhbHVlOjF9XX1jb25zdHJ1Y3Rvcigpe3N1cGVyKCksdGhpcy5waGFzZX1pbmNyZW1lbnRQaGFzZSh0KXt0aGlzLnBoYXNlKz10LHRoaXMucGhhc2U+MSYmKHRoaXMucGhhc2U9dGhpcy5waGFzZS0xKX1wcm9jZXNzKHQsZSxzKXtjb25zdCByPXMuYmVnaW5bMF07aWYoY3VycmVudFRpbWU+PXMuZW5kWzBdKXJldHVybiExO2lmKGN1cnJlbnRUaW1lPD1yKXJldHVybiEwO2NvbnN0IGk9ZVswXSxvPXMuZnJlcXVlbmN5WzBdLGE9cy50aW1lWzBdLHU9cy5kZXB0aFswXSxjPXMuc2tld1swXSxoPXMucGhhc2VvZmZzZXRbMF0sZj1zLmN1cnZlWzBdLGQ9cy5kY29mZnNldFswXSxsPXMubWluWzBdLHA9cy5tYXhbMF0sbT1RdFtzLnNoYXBlWzBdXSxJPWlbMF0ubGVuZ3RoPz8wO3RoaXMucGhhc2U9PW51bGwmJih0aGlzLnBoYXNlPXB0KGEqbytoKSk7Y29uc3QgZz1vKlk7Zm9yKGxldCB2PTA7djxJO3YrKyl7Zm9yKGxldCBQPTA7UDxpLmxlbmd0aDtQKyspe2xldCBUPSh2dFttXSh0aGlzLnBoYXNlLGMpK2QpKnU7VD1NYXRoLnBvdyhULGYpLGlbUF1bdl09dyhULGwscCl9dGhpcy5pbmNyZW1lbnRQaGFzZShnKX1yZXR1cm4hMH19cmVnaXN0ZXJQcm9jZXNzb3IoImxmby1wcm9jZXNzb3IiLEp0KTtjbGFzcyBYdCBleHRlbmRzIEF1ZGlvV29ya2xldFByb2Nlc3NvcntzdGF0aWMgZ2V0IHBhcmFtZXRlckRlc2NyaXB0b3JzKCl7cmV0dXJuW3tuYW1lOiJjb2Fyc2UiLGRlZmF1bHRWYWx1ZToxfV19Y29uc3RydWN0b3IoKXtzdXBlcigpLHRoaXMuc3RhcnRlZD0hMX1wcm9jZXNzKHQsZSxzKXtjb25zdCByPXRbMF0saT1lWzBdLG89clswXSE9PXZvaWQgMDtpZih0aGlzLnN0YXJ0ZWQmJiFvKXJldHVybiExO3RoaXMuc3RhcnRlZD1vO2xldCBhPXMuY29hcnNlWzBdPz8wO2E9TWF0aC5tYXgoMSxhKTtmb3IobGV0IHU9MDt1PFU7dSsrKWZvcihsZXQgYz0wO2M8ci5sZW5ndGg7YysrKWlbY11bdV09dSVhPT09MD9yW2NdW3VdOmlbY11bdS0xXTtyZXR1cm4hMH19cmVnaXN0ZXJQcm9jZXNzb3IoImNvYXJzZS1wcm9jZXNzb3IiLFh0KTtjbGFzcyB0ZSBleHRlbmRzIEF1ZGlvV29ya2xldFByb2Nlc3NvcntzdGF0aWMgZ2V0IHBhcmFtZXRlckRlc2NyaXB0b3JzKCl7cmV0dXJuW3tuYW1lOiJjcnVzaCIsZGVmYXVsdFZhbHVlOjB9XX1jb25zdHJ1Y3Rvcigpe3N1cGVyKCksdGhpcy5zdGFydGVkPSExfXByb2Nlc3ModCxlLHMpe2NvbnN0IHI9dFswXSxpPWVbMF0sbz1yWzBdIT09dm9pZCAwO2lmKHRoaXMuc3RhcnRlZCYmIW8pcmV0dXJuITE7dGhpcy5zdGFydGVkPW87bGV0IGE9cy5jcnVzaFswXT8/ODthPU1hdGgubWF4KDEsYSk7Zm9yKGxldCB1PTA7dTxVO3UrKylmb3IobGV0IGM9MDtjPHIubGVuZ3RoO2MrKyl7Y29uc3QgaD1NYXRoLnBvdygyLGEtMSk7aVtjXVt1XT1NYXRoLnJvdW5kKHJbY11bdV0qaCkvaH1yZXR1cm4hMH19cmVnaXN0ZXJQcm9jZXNzb3IoImNydXNoLXByb2Nlc3NvciIsdGUpO2NsYXNzIGVlIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye3N0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKXtyZXR1cm5be25hbWU6InNoYXBlIixkZWZhdWx0VmFsdWU6MH0se25hbWU6InBvc3RnYWluIixkZWZhdWx0VmFsdWU6MX1dfWNvbnN0cnVjdG9yKCl7c3VwZXIoKSx0aGlzLnN0YXJ0ZWQ9ITF9cHJvY2Vzcyh0LGUscyl7Y29uc3Qgcj10WzBdLGk9ZVswXSxvPXJbMF0hPT12b2lkIDA7aWYodGhpcy5zdGFydGVkJiYhbylyZXR1cm4hMTt0aGlzLnN0YXJ0ZWQ9bztsZXQgYT1zLnNoYXBlWzBdO2E9YTwxP2E6Ljk5OTk5OTk5OTYsYT0yKmEvKDEtYSk7Y29uc3QgdT1NYXRoLm1heCguMDAxLE1hdGgubWluKDEscy5wb3N0Z2FpblswXSkpO2ZvcihsZXQgYz0wO2M8VTtjKyspZm9yKGxldCBoPTA7aDxyLmxlbmd0aDtoKyspaVtoXVtjXT0oMSthKSpyW2hdW2NdLygxK2EqTWF0aC5hYnMocltoXVtjXSkpKnU7cmV0dXJuITB9fXJlZ2lzdGVyUHJvY2Vzc29yKCJzaGFwZS1wcm9jZXNzb3IiLGVlKTtjbGFzcyBSdHtjb25zdHJ1Y3Rvcigpe3l0KHRoaXMsInMwIiwwKTt5dCh0aGlzLCJzMSIsMCl9dXBkYXRlKHQsZSxzPTApe3M9dyhzLDAsMSksZT13KGUsMCxzYW1wbGVSYXRlLzItMSk7Y29uc3Qgcj13KDIqTWF0aC5zaW4oZSpFKlkpLDAsMS4xNCksbz0xLU1hdGgucG93KC41LDgqcysxKSpyO3JldHVybiB0aGlzLnMwPW8qdGhpcy5zMC1yKnRoaXMuczErcip0LHRoaXMuczE9byp0aGlzLnMxK3IqdGhpcy5zMCx0aGlzLnMxfX1jbGFzcyBzZSBleHRlbmRzIEF1ZGlvV29ya2xldFByb2Nlc3NvcntzdGF0aWMgZ2V0IHBhcmFtZXRlckRlc2NyaXB0b3JzKCl7cmV0dXJuW3tuYW1lOiJ2YWx1ZSIsZGVmYXVsdFZhbHVlOi41fV19Y29uc3RydWN0b3IoKXtzdXBlcigpLHRoaXMuZmlsdGVycz1bbmV3IFJ0LG5ldyBSdF19cHJvY2Vzcyh0LGUscyl7Y29uc3Qgcj10WzBdLGk9ZVswXSxvPXJbMF0hPT12b2lkIDA7dGhpcy5zdGFydGVkPW87Y29uc3QgYT13KHMudmFsdWVbMF0sMCwxKTtsZXQgdT0ibm9uZSIsYyxoPTE7YT4uNTE/KHU9ImhpcGFzcyIsaD0oYS0uNSkqMik6YTwuNDkmJih1PSJsb3Bhc3MiLGg9YSoyKSxjPU1hdGgucG93KGgqMTEsNCk7Zm9yKGxldCBmPTA7ZjxyLmxlbmd0aDtmKyspZm9yKGxldCBkPTA7ZDxVO2QrKyl1PT0ibm9uZSI/aVtmXVtkXT1yW2ZdW2RdOih0aGlzLmZpbHRlcnNbZl0udXBkYXRlKHJbZl1bZF0sYywuMSksdT09PSJsb3Bhc3MiP2lbZl1bZF09dGhpcy5maWx0ZXJzW2ZdLnMxOnU9PT0iaGlwYXNzIj9pW2ZdW2RdPXJbZl1bZF0tdGhpcy5maWx0ZXJzW2ZdLnMxOmlbZl1bZF09cltmXVtkXSk7cmV0dXJuITB9fXJlZ2lzdGVyUHJvY2Vzc29yKCJkamYtcHJvY2Vzc29yIixzZSk7Y2xhc3MgcmUgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3J7c3RhdGljIGdldCBwYXJhbWV0ZXJEZXNjcmlwdG9ycygpe3JldHVyblt7bmFtZToiZnJlcXVlbmN5IixkZWZhdWx0VmFsdWU6NTAwfSx7bmFtZToicSIsZGVmYXVsdFZhbHVlOjF9LHtuYW1lOiJkcml2ZSIsZGVmYXVsdFZhbHVlOi42OX1dfWNvbnN0cnVjdG9yKCl7c3VwZXIoKSx0aGlzLnN0YXJ0ZWQ9ITEsdGhpcy5wMD1bMCwwXSx0aGlzLnAxPVswLDBdLHRoaXMucDI9WzAsMF0sdGhpcy5wMz1bMCwwXSx0aGlzLnAzMj1bMCwwXSx0aGlzLnAzMz1bMCwwXSx0aGlzLnAzND1bMCwwXX1wcm9jZXNzKHQsZSxzKXtjb25zdCByPXRbMF0saT1lWzBdLG89clswXSE9PXZvaWQgMDtpZih0aGlzLnN0YXJ0ZWQmJiFvKXJldHVybiExO3RoaXMuc3RhcnRlZD1vO2NvbnN0IGE9cy5xWzBdLHU9dyhNYXRoLmV4cChzLmRyaXZlWzBdKSwuMSwyZTMpO2xldCBjPXMuZnJlcXVlbmN5WzBdO2M9YypEKlksYz1jPjE/MTpjO2NvbnN0IGg9TWF0aC5taW4oOCxhKi4xMyk7bGV0IGY9MS91Kk1hdGgubWluKDEuNzUsMStoKTtmb3IobGV0IGQ9MDtkPFU7ZCsrKWZvcihsZXQgbD0wO2w8ci5sZW5ndGg7bCsrKXtjb25zdCBwPXRoaXMucDNbbF0qLjM2MDg5MSt0aGlzLnAzMltsXSouNDE3MjkrdGhpcy5wMzNbbF0qLjE3Nzg5Nit0aGlzLnAzNFtsXSouMDQzOTcyNTt0aGlzLnAzNFtsXT10aGlzLnAzM1tsXSx0aGlzLnAzM1tsXT10aGlzLnAzMltsXSx0aGlzLnAzMltsXT10aGlzLnAzW2xdLHRoaXMucDBbbF0rPShxKHJbbF1bZF0qdS1oKnApLXEodGhpcy5wMFtsXSkpKmMsdGhpcy5wMVtsXSs9KHEodGhpcy5wMFtsXSktcSh0aGlzLnAxW2xdKSkqYyx0aGlzLnAyW2xdKz0ocSh0aGlzLnAxW2xdKS1xKHRoaXMucDJbbF0pKSpjLHRoaXMucDNbbF0rPShxKHRoaXMucDJbbF0pLXEodGhpcy5wM1tsXSkpKmMsaVtsXVtkXT1wKmZ9cmV0dXJuITB9fXJlZ2lzdGVyUHJvY2Vzc29yKCJsYWRkZXItcHJvY2Vzc29yIixyZSk7Y2xhc3MgbmUgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3J7c3RhdGljIGdldCBwYXJhbWV0ZXJEZXNjcmlwdG9ycygpe3JldHVyblt7bmFtZToiZGlzdG9ydCIsZGVmYXVsdFZhbHVlOjB9LHtuYW1lOiJwb3N0Z2FpbiIsZGVmYXVsdFZhbHVlOjF9XX1jb25zdHJ1Y3Rvcih7cHJvY2Vzc29yT3B0aW9uczp0fSl7c3VwZXIoKSx0aGlzLnN0YXJ0ZWQ9ITEsdGhpcy5hbGdvcml0aG09WnQodC5hbGdvcml0aG0pfXByb2Nlc3ModCxlLHMpe2NvbnN0IHI9dFswXSxpPWVbMF0sbz1yWzBdIT09dm9pZCAwO2lmKHRoaXMuc3RhcnRlZCYmIW8pcmV0dXJuITE7dGhpcy5zdGFydGVkPW87Zm9yKGxldCBhPTA7YTxVO2ErKyl7Y29uc3QgdT13KGIocy5wb3N0Z2FpbixhKSwuMDAxLDEpLGM9TWF0aC5leHBtMShiKHMuZGlzdG9ydCxhKSk7Zm9yKGxldCBoPTA7aDxyLmxlbmd0aDtoKyspe2NvbnN0IGY9cltoXVthXTtpW2hdW2FdPXUqdGhpcy5hbGdvcml0aG0oZixjKX19cmV0dXJuITB9fXJlZ2lzdGVyUHJvY2Vzc29yKCJkaXN0b3J0LXByb2Nlc3NvciIsbmUpO2NsYXNzIGllIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye2NvbnN0cnVjdG9yKCl7c3VwZXIoKSx0aGlzLnBoYXNlPVtdfXN0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKXtyZXR1cm5be25hbWU6ImJlZ2luIixkZWZhdWx0VmFsdWU6MCxtYXg6TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLG1pbjowfSx7bmFtZToiZW5kIixkZWZhdWx0VmFsdWU6MCxtYXg6TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLG1pbjowfSx7bmFtZToiZnJlcXVlbmN5IixkZWZhdWx0VmFsdWU6NDQwLG1pbjpOdW1iZXIuRVBTSUxPTn0se25hbWU6InBhbnNwcmVhZCIsZGVmYXVsdFZhbHVlOi40LG1pbjowLG1heDoxfSx7bmFtZToiZnJlcXNwcmVhZCIsZGVmYXVsdFZhbHVlOi4yLG1pbjowfSx7bmFtZToiZGV0dW5lIixkZWZhdWx0VmFsdWU6MCxtaW46MH0se25hbWU6InZvaWNlcyIsZGVmYXVsdFZhbHVlOjUsbWluOjEsYXV0b21hdGlvblJhdGU6ImstcmF0ZSJ9XX1wcm9jZXNzKHQsZSxzKXtpZihjdXJyZW50VGltZTw9cy5iZWdpblswXSlyZXR1cm4hMDtpZihjdXJyZW50VGltZT49cy5lbmRbMF0pcmV0dXJuITE7Y29uc3Qgcj1lWzBdLGk9cy52b2ljZXNbMF07Zm9yKGxldCBvPTA7bzxyWzBdLmxlbmd0aDtvKyspe2NvbnN0IGE9YihzLmRldHVuZSxvKSx1PWIocy5mcmVxc3ByZWFkLG8pLGM9YihzLnBhbnNwcmVhZCxvKSouNSsuNTtsZXQgaD1NYXRoLnNxcnQoMS1jKSxmPU1hdGguc3FydChjKSxkPWIocy5mcmVxdWVuY3ksbyk7ZD1HKGQsYS8xMDApO2NvbnN0IGw9Q3QoaSx1KTtmb3IobGV0IHA9MDtwPGk7cCsrKXtjb25zdCBtPUcoZCxsKHApKSxJPXB0KG0qWSk7dGhpcy5waGFzZVtwXT10aGlzLnBoYXNlW3BdPz9NYXRoLnJhbmRvbSgpO2NvbnN0IGc9dnQuc2F3YmxlcCh0aGlzLnBoYXNlW3BdLEkpO3JbMF1bb10rPWcqaCxyWzFdW29dKz1nKmY7bGV0IHY9dGhpcy5waGFzZVtwXStJO3Y+PTEmJih2LT0xKSx0aGlzLnBoYXNlW3BdPXYsaD1mLGY9aH19cmV0dXJuITB9fXJlZ2lzdGVyUHJvY2Vzc29yKCJzdXBlcnNhdy1vc2NpbGxhdG9yIixpZSk7Y29uc3Qgb2U9MjA0OCxndD1uZXcgTWFwO2Z1bmN0aW9uIGFlKG4pe2lmKCFndC5oYXMobikpe2NvbnN0IHQ9bmV3IEZsb2F0MzJBcnJheShuKTtmb3IobGV0IGU9MDtlPG47ZSsrKXRbZV09LjUqKDEtTWF0aC5jb3MoRCplL24pKTtndC5zZXQobix0KX1yZXR1cm4gZ3QuZ2V0KG4pfWNsYXNzIGNlIGV4dGVuZHMgSHtzdGF0aWMgZ2V0IHBhcmFtZXRlckRlc2NyaXB0b3JzKCl7cmV0dXJuW3tuYW1lOiJwaXRjaEZhY3RvciIsZGVmYXVsdFZhbHVlOjF9XX1jb25zdHJ1Y3Rvcih0KXt0LnByb2Nlc3Nvck9wdGlvbnM9e2Jsb2NrU2l6ZTpvZX0sc3VwZXIodCksdGhpcy50aW1lQ3Vyc29yPTAsdGhpcy5mZnRTaXplPXRoaXMuYmxvY2tTaXplLHRoaXMuaW52ZmZ0U2l6ZT0xL3RoaXMuZmZ0U2l6ZSx0aGlzLmhhbm5XaW5kb3c9YWUodGhpcy5mZnRTaXplKSx0aGlzLmZmdD1uZXcgenQodGhpcy5mZnRTaXplKSx0aGlzLmZyZXFDb21wbGV4QnVmZmVyPXRoaXMuZmZ0LmNyZWF0ZUNvbXBsZXhBcnJheSgpLHRoaXMuZnJlcUNvbXBsZXhCdWZmZXJTaGlmdGVkPXRoaXMuZmZ0LmNyZWF0ZUNvbXBsZXhBcnJheSgpLHRoaXMudGltZUNvbXBsZXhCdWZmZXI9dGhpcy5mZnQuY3JlYXRlQ29tcGxleEFycmF5KCksdGhpcy5tYWduaXR1ZGVzPW5ldyBGbG9hdDMyQXJyYXkodGhpcy5mZnRTaXplLzIrMSksdGhpcy5wZWFrSW5kZXhlcz1uZXcgSW50MzJBcnJheSh0aGlzLm1hZ25pdHVkZXMubGVuZ3RoKSx0aGlzLm5iUGVha3M9MH1wcm9jZXNzT0xBKHQsZSxzKXtsZXQgcj1zLnBpdGNoRmFjdG9yW3MucGl0Y2hGYWN0b3IubGVuZ3RoLTFdO3I8MCYmKHI9ciouMjUpLHI9TWF0aC5tYXgoMCxyKzEpO2ZvcihsZXQgaT0wO2k8dGhpcy5uYklucHV0cztpKyspZm9yKGxldCBvPTA7bzx0W2ldLmxlbmd0aDtvKyspe2NvbnN0IGE9dFtpXVtvXSx1PWVbaV1bb107dGhpcy5hcHBseUhhbm5XaW5kb3coYSksdGhpcy5mZnQucmVhbFRyYW5zZm9ybSh0aGlzLmZyZXFDb21wbGV4QnVmZmVyLGEpLHRoaXMuY29tcHV0ZU1hZ25pdHVkZXMoKSx0aGlzLmZpbmRQZWFrcygpLHRoaXMuc2hpZnRQZWFrcyhyKSx0aGlzLmZmdC5jb21wbGV0ZVNwZWN0cnVtKHRoaXMuZnJlcUNvbXBsZXhCdWZmZXJTaGlmdGVkKSx0aGlzLmZmdC5pbnZlcnNlVHJhbnNmb3JtKHRoaXMudGltZUNvbXBsZXhCdWZmZXIsdGhpcy5mcmVxQ29tcGxleEJ1ZmZlclNoaWZ0ZWQpLHRoaXMuZmZ0LmZyb21Db21wbGV4QXJyYXkodGhpcy50aW1lQ29tcGxleEJ1ZmZlcix1KSx0aGlzLmFwcGx5SGFubldpbmRvdyh1KX10aGlzLnRpbWVDdXJzb3IrPXRoaXMuaG9wU2l6ZX1hcHBseUhhbm5XaW5kb3codCl7Zm9yKGxldCBlPTA7ZTx0aGlzLmJsb2NrU2l6ZTtlKyspdFtlXSo9dGhpcy5oYW5uV2luZG93W2VdKjEuNjJ9Y29tcHV0ZU1hZ25pdHVkZXMoKXtsZXQgdD0wLGU9MDtmb3IoO3Q8dGhpcy5tYWduaXR1ZGVzLmxlbmd0aDspe2NvbnN0IHM9dGhpcy5mcmVxQ29tcGxleEJ1ZmZlcltlXSxyPXRoaXMuZnJlcUNvbXBsZXhCdWZmZXJbZSsxXTt0aGlzLm1hZ25pdHVkZXNbdF09cyoqMityKioyLHQrPTEsZSs9Mn19ZmluZFBlYWtzKCl7dGhpcy5uYlBlYWtzPTA7bGV0IHQ9Mjtjb25zdCBlPXRoaXMubWFnbml0dWRlcy5sZW5ndGgtMjtmb3IoO3Q8ZTspe2NvbnN0IHM9dGhpcy5tYWduaXR1ZGVzW3RdO2lmKHRoaXMubWFnbml0dWRlc1t0LTFdPj1zfHx0aGlzLm1hZ25pdHVkZXNbdC0yXT49cyl7dCsrO2NvbnRpbnVlfWlmKHRoaXMubWFnbml0dWRlc1t0KzFdPj1zfHx0aGlzLm1hZ25pdHVkZXNbdCsyXT49cyl7dCsrO2NvbnRpbnVlfXRoaXMucGVha0luZGV4ZXNbdGhpcy5uYlBlYWtzXT10LHRoaXMubmJQZWFrcysrLHQrPTJ9fXNoaWZ0UGVha3ModCl7dGhpcy5mcmVxQ29tcGxleEJ1ZmZlclNoaWZ0ZWQuZmlsbCgwKTtmb3IobGV0IGU9MDtlPHRoaXMubmJQZWFrcztlKyspe2NvbnN0IHM9dGhpcy5wZWFrSW5kZXhlc1tlXSxyPSQocyp0KTtpZihyPnRoaXMubWFnbml0dWRlcy5sZW5ndGgpYnJlYWs7bGV0IGk9MCxvPXRoaXMuZmZ0U2l6ZTtlPjAmJihpPXMtJCgocy10aGlzLnBlYWtJbmRleGVzW2UtMV0pLzIpKSxlPHRoaXMubmJQZWFrcy0xJiYobz1zKyR0KCh0aGlzLnBlYWtJbmRleGVzW2UrMV0tcykvMikpO2NvbnN0IGE9aS1zLHU9by1zLGM9RCp0aGlzLmludmZmdFNpemUqKHItcyksaD1NYXRoLmNvcyhjKnRoaXMudGltZUN1cnNvciksZj1NYXRoLnNpbihjKnRoaXMudGltZUN1cnNvcik7Zm9yKGxldCBkPWE7ZDx1O2QrKyl7Y29uc3QgbD1zK2QscD1yK2Q7aWYocD49dGhpcy5tYWduaXR1ZGVzLmxlbmd0aClicmVhaztjb25zdCBtPTIqbCxJPW0rMSxnPXRoaXMuZnJlcUNvbXBsZXhCdWZmZXJbbV0sdj10aGlzLmZyZXFDb21wbGV4QnVmZmVyW0ldLFA9ZypoLXYqZixUPWcqZit2KmgsUz0yKnAsVj1TKzE7dGhpcy5mcmVxQ29tcGxleEJ1ZmZlclNoaWZ0ZWRbU10rPVAsdGhpcy5mcmVxQ29tcGxleEJ1ZmZlclNoaWZ0ZWRbVl0rPVR9fX19cmVnaXN0ZXJQcm9jZXNzb3IoInBoYXNlLXZvY29kZXItcHJvY2Vzc29yIixjZSk7Y2xhc3MgdWUgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3J7Y29uc3RydWN0b3IoKXtzdXBlcigpLHRoaXMucGhpPS1FLHRoaXMuWTA9MCx0aGlzLlkxPTAsdGhpcy5QVz1FLHRoaXMuQj0yLjMsdGhpcy5kcGhpZj0wLHRoaXMuZW52Zj0wfXN0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKXtyZXR1cm5be25hbWU6ImJlZ2luIixkZWZhdWx0VmFsdWU6MCxtYXg6TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLG1pbjowfSx7bmFtZToiZW5kIixkZWZhdWx0VmFsdWU6MCxtYXg6TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLG1pbjowfSx7bmFtZToiZnJlcXVlbmN5IixkZWZhdWx0VmFsdWU6NDQwLG1pbjpOdW1iZXIuRVBTSUxPTn0se25hbWU6ImRldHVuZSIsZGVmYXVsdFZhbHVlOjAsbWluOk51bWJlci5ORUdBVElWRV9JTkZJTklUWSxtYXg6TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZfSx7bmFtZToicHVsc2V3aWR0aCIsZGVmYXVsdFZhbHVlOjEsbWluOjAsbWF4Ok51bWJlci5QT1NJVElWRV9JTkZJTklUWX1dfXByb2Nlc3ModCxlLHMpe2lmKHRoaXMuZGlzY29ubmVjdGVkKXJldHVybiExO2lmKGN1cnJlbnRUaW1lPD1zLmJlZ2luWzBdKXJldHVybiEwO2lmKGN1cnJlbnRUaW1lPj1zLmVuZFswXSlyZXR1cm4hMTtjb25zdCByPWVbMF07bGV0IGk9MSxvO2ZvcihsZXQgYT0wO2E8KHJbMF0ubGVuZ3RoPz8wKTthKyspe2NvbnN0IHU9KDEtdyhiKHMucHVsc2V3aWR0aCxhKSwtLjk5LC45OSkpKkUsYz1iKHMuZGV0dW5lLGEpLGg9RyhiKHMuZnJlcXVlbmN5LGEpLGMvMTAwKTtvPWgqRCpZLHRoaXMuZHBoaWYrPS4xKihvLXRoaXMuZHBoaWYpLGkqPS45OTk4LHRoaXMuZW52Zis9LjEqKGktdGhpcy5lbnZmKSx0aGlzLkI9Mi4zKigxLTFlLTQqaCksdGhpcy5CPDAmJih0aGlzLkI9MCksdGhpcy5waGkrPXRoaXMuZHBoaWYsdGhpcy5waGk+PUUmJih0aGlzLnBoaS09RCk7bGV0IGY9TWF0aC5jb3ModGhpcy5waGkrdGhpcy5CKnRoaXMuWTApO3RoaXMuWTA9LjUqKGYrdGhpcy5ZMCk7bGV0IGQ9TWF0aC5jb3ModGhpcy5waGkrdGhpcy5CKnRoaXMuWTErdSk7dGhpcy5ZMT0uNSooZCt0aGlzLlkxKTtmb3IobGV0IGw9MDtsPHIubGVuZ3RoO2wrKylyW2xdW2FdPS4xNSooZi1kKSp0aGlzLmVudmZ9cmV0dXJuITB9fXJlZ2lzdGVyUHJvY2Vzc29yKCJwdWxzZS1vc2NpbGxhdG9yIix1ZSk7Y29uc3QgYnQ9e2JpdEM6ZnVuY3Rpb24obix0LGUpe3JldHVybiBuJnQ/ZTowfSxicjpmdW5jdGlvbihuLHQ9OCl7aWYodD4zMil0aHJvdyBuZXcgRXJyb3IoImJyKCkgU2l6ZSBjYW5ub3QgYmUgZ3JlYXRlciB0aGFuIDMyIik7bGV0IGU9MDtmb3IobGV0IHM9MDtzPHQ7cysrKWV8PWJ0LmJpdEMobiwxPDxzLDE8PHQtKHMrMSkpO3JldHVybiBlfSxzaW5mOmZ1bmN0aW9uKG4pe3JldHVybiBNYXRoLnNpbihuKkUvMTI4KX0sY29zZjpmdW5jdGlvbihuKXtyZXR1cm4gTWF0aC5jb3MobipFLzEyOCl9LHRhbmY6ZnVuY3Rpb24obil7cmV0dXJuIE1hdGgudGFuKG4qRS8xMjgpfSxyZWdHOmZ1bmN0aW9uKG4sdCl7cmV0dXJuIHQudGVzdChuLnRvU3RyaW5nKDIpKX19O2xldCBzdCxJdDtmdW5jdGlvbiBoZShuKXtpZihzdD09bnVsbCl7c3Q9T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTWF0aCksSXQ9c3QubWFwKHM9Pk1hdGhbc10pO2NvbnN0IHQ9T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYnQpLGU9dC5tYXAocz0+YnRbc10pO3N0LnB1c2goImludCIsIndpbmRvdyIsLi4udCksSXQucHVzaChNYXRoLmZsb29yLGdsb2JhbFRoaXMsLi4uZSl9cmV0dXJuIG5ldyBGdW5jdGlvbiguLi5zdCwidCIsYHJldHVybiAwLAoke258fDB9O2ApLmJpbmQoZ2xvYmFsVGhpcywuLi5JdCl9Y2xhc3MgbGUgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3J7Y29uc3RydWN0b3IoKXtzdXBlcigpLHRoaXMucG9ydC5vbm1lc3NhZ2U9dD0+e2xldHtjb2RlVGV4dDplfT10LmRhdGE7Y29uc3R7Ynl0ZUJlYXRTdGFydFRpbWU6c309dC5kYXRhO3MhPW51bGwmJih0aGlzLnQ9MCx0aGlzLmluaXRpYWxPZmZzZXQ9TWF0aC5mbG9vcihzKSksZT1lLnRyaW0oKS5yZXBsYWNlKC9eZXZhbFwodW5lc2NhcGVcKGVzY2FwZSg/OmB8XCgnfFwoInxcKGApKC4qPykoPzpgfCdcKXwiXCl8YFwpKS5yZXBsYWNlXChcL3VcKFwuXC5cKVwvZyxbIidgXVwkMSVbIidgXVwpXClcKSQvLChyLGkpPT51bmVzY2FwZShlc2NhcGUoaSkucmVwbGFjZSgvdSguLikvZywiJDElIikpKSx0aGlzLmZ1bmM9aGUoZSl9LHRoaXMuaW5pdGlhbE9mZnNldD0wLHRoaXMudD1udWxsLHRoaXMuZnVuYz1udWxsfXN0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKXtyZXR1cm5be25hbWU6ImJlZ2luIixkZWZhdWx0VmFsdWU6MCxtYXg6TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLG1pbjowfSx7bmFtZToiZnJlcXVlbmN5IixkZWZhdWx0VmFsdWU6NDQwLG1pbjpOdW1iZXIuRVBTSUxPTn0se25hbWU6ImRldHVuZSIsZGVmYXVsdFZhbHVlOjAsbWluOk51bWJlci5ORUdBVElWRV9JTkZJTklUWSxtYXg6TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZfSx7bmFtZToiZW5kIixkZWZhdWx0VmFsdWU6MCxtYXg6TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLG1pbjowfV19cHJvY2Vzcyh0LGUscyl7aWYodGhpcy5kaXNjb25uZWN0ZWQpcmV0dXJuITE7aWYoY3VycmVudFRpbWU8PXMuYmVnaW5bMF0pcmV0dXJuITA7aWYoY3VycmVudFRpbWU+PXMuZW5kWzBdKXJldHVybiExO3RoaXMudD09bnVsbCYmKHRoaXMudD1zLmJlZ2luWzBdKnNhbXBsZVJhdGUpO2NvbnN0IHI9ZVswXSxpPTI1NipZO2ZvcihsZXQgbz0wO288clswXS5sZW5ndGg7bysrKXtjb25zdCBhPWIocy5kZXR1bmUsbyksdT1HKGIocy5mcmVxdWVuY3ksbyksYS8xMDApLGM9aSp1KnRoaXMudCt0aGlzLmluaXRpYWxPZmZzZXQsZj0odGhpcy5mdW5jKGMpJjI1NSkvMTI3LjUtMSxkPXcoZiouMiwtLjQsLjQpO2ZvcihsZXQgbD0wO2w8ci5sZW5ndGg7bCsrKXJbbF1bb109ZDt0aGlzLnQrK31yZXR1cm4hMH19cmVnaXN0ZXJQcm9jZXNzb3IoImJ5dGUtYmVhdC1wcm9jZXNzb3IiLGxlKTtjbGFzcyBmZSBleHRlbmRzIEF1ZGlvV29ya2xldFByb2Nlc3NvcntzdGF0aWMgZ2V0IHBhcmFtZXRlckRlc2NyaXB0b3JzKCl7cmV0dXJuW3tuYW1lOiJiZWdpbiIsZGVmYXVsdFZhbHVlOjB9LHtuYW1lOiJlbmQiLGRlZmF1bHRWYWx1ZTowfSx7bmFtZToiYXR0YWNrIixkZWZhdWx0VmFsdWU6LjAwNSxtaW5WYWx1ZTowfSx7bmFtZToiZGVjYXkiLGRlZmF1bHRWYWx1ZTouMTQsbWluVmFsdWU6MH0se25hbWU6InN1c3RhaW4iLGRlZmF1bHRWYWx1ZTowLG1pblZhbHVlOjAsbWF4VmFsdWU6MX0se25hbWU6InJlbGVhc2UiLGRlZmF1bHRWYWx1ZTouMSxtaW5WYWx1ZTowfSx7bmFtZToiYXR0YWNrQ3VydmUiLGRlZmF1bHRWYWx1ZTowLG1pblZhbHVlOi0xLG1heFZhbHVlOjF9LHtuYW1lOiJkZWNheUN1cnZlIixkZWZhdWx0VmFsdWU6MCxtaW5WYWx1ZTotMSxtYXhWYWx1ZToxfSx7bmFtZToicmVsZWFzZUN1cnZlIixkZWZhdWx0VmFsdWU6MCxtaW5WYWx1ZTotMSxtYXhWYWx1ZToxfSx7bmFtZToicGVhayIsZGVmYXVsdFZhbHVlOjF9LHtuYW1lOiJyZXRyaWdnZXIiLGRlZmF1bHRWYWx1ZToxLG1pblZhbHVlOjAsbWF4VmFsdWU6MX1dfWNvbnN0cnVjdG9yKCl7c3VwZXIoKSx0aGlzLnZhbD0wLHRoaXMuc2VnSWR4PTAsdGhpcy5zdGF0ZT0wLHRoaXMuYmVnaW5UaW1lPTAsdGhpcy5lbmRUaW1lPTAsdGhpcy5hdHRhY2tTdGFydD0wfV93YXJwKHQsZSxzPTgpe2lmKHQ9PT0wfHx0PT09MSlyZXR1cm4gdDtpZihlPjApe2NvbnN0IHI9MStzKmU7cmV0dXJuIDEtTWF0aC5wb3coMS10LHIpfWVsc2V7Y29uc3Qgcj0xLXMqZTtyZXR1cm4gTWF0aC5wb3codCxyKX19X2FkdmFuY2UodCxlLHMscil7aWYocz09PTB8fHQ9PT1lKXRoaXMudmFsPWU7ZWxzZXtjb25zdCBpPU1hdGgubWluKDEsKGN1cnJlbnRUaW1lLXRoaXMuYmVnaW5UaW1lKS9zKSxvPXRoaXMuX3dhcnAoaSxyKTt0aGlzLnZhbD10KyhlLXQpKm99fXByb2Nlc3ModCxlLHMpe2NvbnN0IHI9ZVswXVswXTtpZighcilyZXR1cm4hMDtjb25zdCBpPWIocy5iZWdpbiwwKSxvPWIocy5yZXRyaWdnZXIsMCk+PS41O2khPT10aGlzLmJlZ2luVGltZSYmKHRoaXMuc3RhdGU9PT0wfHxvKSYmKHRoaXMuYmVnaW5UaW1lPWksdGhpcy5zdGF0ZT0xLHRoaXMuZW5kVGltZT1iKHMuZW5kLDApLHRoaXMuYXR0YWNrU3RhcnQ9dGhpcy52YWwpO2NvbnN0IGE9dGhpcy5lbmRUaW1lLXRoaXMuYmVnaW5UaW1lO2ZvcihsZXQgdT0wO3U8ci5sZW5ndGg7dSsrKXtjb25zdCBjPWIocy5hdHRhY2ssdSksaD1iKHMuZGVjYXksdSksZj1iKHMuc3VzdGFpbix1KSxkPWIocy5yZWxlYXNlLHUpLGw9YihzLmF0dGFja0N1cnZlLHUpLHA9YihzLmRlY2F5Q3VydmUsdSksbT1iKHMucmVsZWFzZUN1cnZlLHUpLEk9YihzLnBlYWssdSksZz1be3RpbWU6TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLHN0YXJ0OjAsdGFyZ2V0OjB9LHt0aW1lOmMsc3RhcnQ6dGhpcy5hdHRhY2tTdGFydCx0YXJnZXQ6MSxjdXJ2ZTpsfSx7dGltZTpjK2gsc3RhcnQ6MSx0YXJnZXQ6ZixjdXJ2ZTpwfSx7dGltZTphLHN0YXJ0OmYsdGFyZ2V0OmZ9LHt0aW1lOmErZCxzdGFydDpmLHRhcmdldDowLGN1cnZlOm19XTtsZXR7dGltZTp2LHN0YXJ0OlAsdGFyZ2V0OlQsY3VydmU6U309Z1t0aGlzLnN0YXRlXTtmb3IodGhpcy5fYWR2YW5jZShQLFQsdixTKTtjdXJyZW50VGltZS10aGlzLmJlZ2luVGltZT49djspdGhpcy5zdGF0ZT0odGhpcy5zdGF0ZSsxKSVnLmxlbmd0aCx2PWdbdGhpcy5zdGF0ZV0udGltZTtyW3VdPXRoaXMudmFsKkl9cmV0dXJuITB9fXJlZ2lzdGVyUHJvY2Vzc29yKCJlbnZlbG9wZS1wcm9jZXNzb3IiLGZlKTtjb25zdCBCPU9iamVjdC5mcmVlemUoe05PTkU6MCxBU1lNOjEsTUlSUk9SOjIsQkVORFA6MyxCRU5ETTo0LEJFTkRNUDo1LFNZTkM6NixRVUFOVDo3LEZPTEQ6OCxQV006OSxPUkJJVDoxMCxTUElOOjExLENIQU9TOjEyLFBSSU1FUzoxMyxCSU5BUlk6MTQsQlJPV05JQU46MTUsUkVDSVBST0NBTDoxNixXT1JNSE9MRToxNyxMT0dJU1RJQzoxOCxTSUdNT0lEOjE5LEZSQUNUQUw6MjAsRkxJUDoyMX0pO2Z1bmN0aW9uIGRlKG4pe3JldHVybiBuPW4rMjEyNzkxMjIxNCsobjw8MTIpLG49bl4zMzQ1MDcyNzAwXm4+Pj4xOSxuPW4rMzc0NzYxMzkzKyhuPDw1KSxuPW4rMzU1MDYzNTExNl5uPDw5LG49bis0MjUxOTkzNzk3KyhuPDwzKSxuPW5eMzA0MjU5NDU2OV5uPj4+MTYsbj4+PjB9Y29uc3Qga3Q9bj0+KGRlKG4pPj4+OCkvMTY3NzcyMTY7ZnVuY3Rpb24gcGUobix0KXtsZXQgZT0wO2ZvcihsZXQgcz0wO3M8dDtzKyspZT1lPDwxfG4mMSxuPj4+PTE7cmV0dXJuIGV9ZnVuY3Rpb24gbWUobil7Y29uc3QgdD1NYXRoLmZsb29yKG4pLGU9bi10LHM9a3QodCkscj1rdCh0KzEpO3JldHVybiBzKyhyLXMpKmV9ZnVuY3Rpb24gdmUobix0PTQpe2xldCBlPS41LHM9MCxyPTAsaT0xO2ZvcihsZXQgbz0wO288dDtvKyspcys9ZSptZShuKmkpLHIrPWUsZSo9LjUsaSo9MjtyZXR1cm4gcy9yKjItMX1jb25zdCBfdD17fTtjbGFzcyBnZSBleHRlbmRzIEF1ZGlvV29ya2xldFByb2Nlc3NvcntzdGF0aWMgZ2V0IHBhcmFtZXRlckRlc2NyaXB0b3JzKCl7cmV0dXJuW3tuYW1lOiJiZWdpbiIsZGVmYXVsdFZhbHVlOjAsbWluOjAsbWF4Ok51bWJlci5QT1NJVElWRV9JTkZJTklUWX0se25hbWU6ImVuZCIsZGVmYXVsdFZhbHVlOjAsbWluOjAsbWF4Ok51bWJlci5QT1NJVElWRV9JTkZJTklUWX0se25hbWU6ImZyZXF1ZW5jeSIsZGVmYXVsdFZhbHVlOjQ0MCxtaW46TnVtYmVyLkVQU0lMT059LHtuYW1lOiJkZXR1bmUiLGRlZmF1bHRWYWx1ZTowfSx7bmFtZToiZnJlcXNwcmVhZCIsZGVmYXVsdFZhbHVlOi4xOCxtaW46MH0se25hbWU6InBvc2l0aW9uIixkZWZhdWx0VmFsdWU6MCxtaW46MCxtYXg6MX0se25hbWU6IndhcnAiLGRlZmF1bHRWYWx1ZTowLG1pbjowLG1heDoxfSx7bmFtZToid2FycE1vZGUiLGRlZmF1bHRWYWx1ZTowfSx7bmFtZToidm9pY2VzIixkZWZhdWx0VmFsdWU6MSxtaW46MSxhdXRvbWF0aW9uUmF0ZToiay1yYXRlIn0se25hbWU6InBhbnNwcmVhZCIsZGVmYXVsdFZhbHVlOi43LG1pbjowLG1heDoxfSx7bmFtZToicGhhc2VyYW5kIixkZWZhdWx0VmFsdWU6MCxtaW46MCxtYXg6MX1dfWNvbnN0cnVjdG9yKHQpe3N1cGVyKHQpLHRoaXMuZnJhbWVMZW49MCx0aGlzLm51bUZyYW1lcz0wLHRoaXMucGhhc2U9W10sdGhpcy5wb3J0Lm9ubWVzc2FnZT1lPT57Y29uc3R7dHlwZTpzLHBheWxvYWQ6cn09ZS5kYXRhfHx7fTtpZihzPT09InRhYmxlIil7Y29uc3QgaT1yLmtleTtpZih0aGlzLmZyYW1lTGVuPXIuZnJhbWVMZW4sIV90W2ldKXtjb25zdCBvPVtyLmZyYW1lc107bGV0IGE9b1swXTtmb3IobGV0IHU9MTt1PDE7dSsrKXtjb25zdCBjPWEubGVuZ3RoPj4xLGg9YS5tYXAoZj0+e2NvbnN0IGQ9bmV3IEZsb2F0MzJBcnJheShjKTtmb3IobGV0IGw9MDtsPGM7bCsrKWRbbF09KGZbMipsXStmWzIqbCsxXSkvMjtyZXR1cm4gZH0pO2lmKG8ucHVzaChoKSxhPWgsYzw9MzIpYnJlYWt9X3RbaV09b310aGlzLnRhYmxlcz1fdFtpXSx0aGlzLm51bUZyYW1lcz10aGlzLnRhYmxlc1swXS5sZW5ndGh9fX1fbWlycm9yKHQpe3JldHVybiAxLU1hdGguYWJzKDIqdC0xKX1fdG9CaXRzKHQsZT0yLHM9MTIpe2NvbnN0IHI9cysoZS1zKSp0O3JldHVybntiOnIsbjokKE1hdGgucG93KDIscikpfX1fd2FycFBoYXNlKHQsZSxzKXtzd2l0Y2gocyl7Y2FzZSBCLk5PTkU6cmV0dXJuIHQ7Y2FzZSBCLkFTWU06e2NvbnN0IHI9LjAxKy45OSplO3JldHVybiB0PHI/LjUqdC9yOi41Ky41Kih0LXIpLygxLXIpfWNhc2UgQi5NSVJST1I6cmV0dXJuIHRoaXMuX21pcnJvcih0aGlzLl93YXJwUGhhc2UodCxlLEIuQVNZTSkpO2Nhc2UgQi5CRU5EUDpyZXR1cm4gTWF0aC5wb3codCwxKzMqZSk7Y2FzZSBCLkJFTkRNOnJldHVybiBNYXRoLnBvdyh0LDEvKDErMyplKSk7Y2FzZSBCLkJFTkRNUDpyZXR1cm4gZTwuNT90aGlzLl93YXJwUGhhc2UodCwxLTIqZSwzKTp0aGlzLl93YXJwUGhhc2UodCwyKmUtMSwyKTtjYXNlIEIuU1lOQzp7Y29uc3Qgcj1NYXRoLnBvdygxNixlKioyKTtyZXR1cm4gdCpyJTF9Y2FzZSBCLlFVQU5UOntjb25zdHtuOnJ9PXRoaXMuX3RvQml0cyhlKTtyZXR1cm4gWih0KnIpL3J9Y2FzZSBCLkZPTEQ6e2NvbnN0IGk9MStNYXRoLm1heCgxLCQoNyplKSk7cmV0dXJuIE1hdGguYWJzKHB0KGkqdCktLjUpKjJ9Y2FzZSBCLlBXTTp7Y29uc3Qgcj13KC41Ky40OSooMiplLTEpLDAsMSk7cmV0dXJuIHQ8cj90L3IqLjU6LjUrKHQtcikvKDEtcikqLjV9Y2FzZSBCLk9SQklUOntjb25zdCByPS41KmU7cmV0dXJuIGR0KHQrcipNYXRoLnNpbihEKjMqdCkpfWNhc2UgQi5TUElOOntjb25zdCByPS41KmUse246aX09dGhpcy5fdG9CaXRzKGUsMSw2KTtyZXR1cm4gZHQodCtyKk1hdGguc2luKEQqaSp0KSl9Y2FzZSBCLkNIQU9TOntjb25zdCBpPSgzLjcrLjMqZSkqdCooMS10KTtyZXR1cm4gdygoMS1lKSp0K2UqaSwwLDEpfWNhc2UgQi5QUklNRVM6e2NvbnN0IHI9bz0+e2lmKG88MilyZXR1cm4hMTtpZihvJTI9PT0wKXJldHVybiBvPT09Mjtmb3IobGV0IGE9MzthKioyPD1vO2ErPTIpaWYobyVhPT09MClyZXR1cm4hMTtyZXR1cm4hMH07bGV0e246aX09dGhpcy5fdG9CaXRzKGUsMyk7Zm9yKDshcihpKTspaSsrO3JldHVybiBaKHQqaSkvaX1jYXNlIEIuQklOQVJZOntsZXR7YjpyfT10aGlzLl90b0JpdHMoZSwzKTtyPSQocik7Y29uc3QgaT0xPDxyLG89Wih0KmkpO3JldHVybiBwZShvLHIpL2l9Y2FzZSBCLkJST1dOSUFOOntjb25zdCByPS4yNSplKnZlKDY0KnQsNCk7cmV0dXJuIGR0KHQrcil9Y2FzZSBCLlJFQ0lQUk9DQUw6e2NvbnN0IHI9Mis0KmUsaT10KnIsbz10KygxLXQpKnIsYT1vPjFlLTEyP2kvbzowO3JldHVybiB3KGEsMCwxKX1jYXNlIEIuV09STUhPTEU6e2NvbnN0IHI9dyguOCplLDAsMSksaT0uNSooMS1yKSxvPS41KigxK3IpO3JldHVybiB0PGk/dC9pKi41OnQ+bz8uNSooMSsodC1vKS8oMS1vKSk6LjV9Y2FzZSBCLkxPR0lTVElDOntsZXQgcj10O2NvbnN0IGk9My42Ky40KmUsbz0xKyQoMiplKTtmb3IobGV0IGE9MDthPG87YSsrKXI9aSpyKigxLXIpO3JldHVybiB3KHIsMCwxKX1jYXNlIEIuU0lHTU9JRDp7Y29uc3Qgcj0xKzEwKmUsaT10LS41LG89MS8oMStNYXRoLmV4cCgtcippKSksYT0xLygxK01hdGguZXhwKC41KnIpKSx1PTEvKDErTWF0aC5leHAoLS41KnIpKTtyZXR1cm4oby1hKS8odS1hKX1jYXNlIEIuRlJBQ1RBTDp7Y29uc3Qgcj0uNSpNYXRoLnNpbihEKnQpKmU7cmV0dXJuIGR0KHQrcil9Y2FzZSBCLkZMSVA6cmV0dXJuIHQ7ZGVmYXVsdDpyZXR1cm4gdH19X3NhbXBsZUZyYW1lKHQsZSl7Y29uc3Qgcz10Lmxlbmd0aCxyPWUqcztsZXQgaT1yfDA7aT49cyYmKGk9MCk7Y29uc3Qgbz1yLWksYT10W2ldO2xldCB1PWkrMTt1Pj1zJiYodT0wKTtjb25zdCBjPXRbdV07cmV0dXJuIGErKGMtYSkqb31fY2hvb3NlTWlwKHQpe3ZhciByO2NvbnN0IGU9dyh0LDFlLTYsNjQpO2xldCBzPTA7Zm9yKDtzKzE8KCgocj10aGlzLnRhYmxlcyk9PW51bGw/dm9pZCAwOnIubGVuZ3RoKXx8MSkmJmU8dGhpcy50YWJsZXNbc11bMF0ubGVuZ3RoLzg7KXMrKztyZXR1cm4gc31wcm9jZXNzKHQsZSxzKXtpZihjdXJyZW50VGltZT49cy5lbmRbMF0pcmV0dXJuITE7aWYoY3VycmVudFRpbWU8PXMuYmVnaW5bMF0pcmV0dXJuITA7Y29uc3Qgcj1lWzBdWzBdLGk9ZVswXVsxXXx8ZVswXVswXTtpZighdGhpcy50YWJsZXMpcmV0dXJuIHIuZmlsbCgwKSxpIT09ciYmaS5zZXQociksITA7Y29uc3Qgbz1zLnZvaWNlc1swXTtmb3IobGV0IGE9MDthPHIubGVuZ3RoO2ErKyl7Y29uc3QgdT1iKHMuZGV0dW5lLGEpLGM9YihzLmZyZXFzcHJlYWQsYSksZj13KGIocy5wb3NpdGlvbixhKSwwLDEpKih0aGlzLm51bUZyYW1lcy0xKSxkPWZ8MCxsPWYtZCxwPXcoYihzLndhcnAsYSksMCwxKSxtPWIocy53YXJwTW9kZSxhKSxJPXcoYihzLnBoYXNlcmFuZCxhKSwwLDEpLGc9bz4xP3coYihzLnBhbnNwcmVhZCxhKSwwLDEpOjAsdj1NYXRoLnNxcnQoLjUtLjUqZyksUD1NYXRoLnNxcnQoLjUrLjUqZyk7bGV0IFQ9YihzLmZyZXF1ZW5jeSxhKTtUPUcoVCx1LzEwMCk7Y29uc3QgUz0xL01hdGguc3FydChvKSxWPUN0KG8sYyk7Zm9yKGxldCBNPTA7TTxvO00rKyl7Y29uc3QgeD0oTSYxKT09MTtsZXQgeT12LEE9UDt4JiYoeT1QLEE9dik7Y29uc3QgTj1HKFQsVihNKSkqWSx6PXRoaXMuX2Nob29zZU1pcChOKSxPPXRoaXMudGFibGVzW3pdO3RoaXMucGhhc2VbTV09dGhpcy5waGFzZVtNXT8/TWF0aC5yYW5kb20oKSpJO2NvbnN0IEY9dGhpcy5fd2FycFBoYXNlKHRoaXMucGhhc2VbTV0scCxtKSxDPXRoaXMuX3NhbXBsZUZyYW1lKE9bZF0sRiksaj10aGlzLl9zYW1wbGVGcmFtZShPW01hdGgubWluKHRoaXMubnVtRnJhbWVzLTEsZCsxKV0sRik7bGV0IFI9Qysoai1DKSpsO209PT1CLkZMSVAmJnRoaXMucGhhc2VbTV08cCYmKFI9LVIpLHJbYV0rPVIqeSpTLGlbYV0rPVIqQSpTLHRoaXMucGhhc2VbTV09cHQodGhpcy5waGFzZVtNXStOKX19cmV0dXJuITB9fXJldHVybiByZWdpc3RlclByb2Nlc3Nvcigid2F2ZXRhYmxlLW9zY2lsbGF0b3ItcHJvY2Vzc29yIixnZSksay5XYXJwTW9kZT1CLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrLFN5bWJvbC50b1N0cmluZ1RhZyx7dmFsdWU6Ik1vZHVsZSJ9KSxrfSh7fSk7Cg==";
let audioContext;
const setDefaultAudioContext = () => (audioContext = new AudioContext(), audioContext), getAudioContext = () => audioContext || setDefaultAudioContext();
function getAudioContextCurrentTime() {
  return getAudioContext().currentTime;
}
let noiseCache = {};
function getNoiseBuffer(e, t) {
  const a = getAudioContext();
  if (noiseCache[e])
    return noiseCache[e];
  const o = 2 * a.sampleRate, u = a.createBuffer(1, o, a.sampleRate), l = u.getChannelData(0);
  let f = 0, p, g, d, b, F, E, S;
  p = g = d = b = F = E = S = 0;
  for (let R = 0; R < o; R++)
    if (e === "white")
      l[R] = Math.random() * 2 - 1;
    else if (e === "brown") {
      let k = Math.random() * 2 - 1;
      l[R] = (f + 0.02 * k) / 1.02, f = l[R];
    } else if (e === "pink") {
      let k = Math.random() * 2 - 1;
      p = 0.99886 * p + k * 0.0555179, g = 0.99332 * g + k * 0.0750759, d = 0.969 * d + k * 0.153852, b = 0.8665 * b + k * 0.3104856, F = 0.55 * F + k * 0.5329522, E = -0.7616 * E - k * 0.016898, l[R] = p + g + d + b + F + E + S + k * 0.5362, l[R] *= 0.11, S = k * 0.115926;
    } else if (e === "crackle") {
      const k = t * 0.01;
      Math.random() < k ? l[R] = Math.random() * 2 - 1 : l[R] = 0;
    }
  return e !== "crackle" && (noiseCache[e] = u), u;
}
function getNoiseOscillator(e = "white", t, a = 0.02) {
  const u = getAudioContext().createBufferSource();
  return u.buffer = getNoiseBuffer(e, a), u.loop = !0, u.start(t), {
    node: u,
    stop: (l) => u.stop(l)
  };
}
function getNoiseMix(e, t, a) {
  const o = getNoiseOscillator("pink", a);
  return {
    node: drywet(e, o.node, t),
    stop: (l) => o?.stop(l)
  };
}
const noises = ["pink", "white", "brown", "crackle"];
function gainNode(e) {
  const t = getAudioContext().createGain();
  return t.gain.value = e, t;
}
function effectSend(e, t, a) {
  const o = gainNode(a);
  return e.connect(o), o.connect(t), o;
}
const getSlope = (e, t, a, o) => o - a === 0 ? 0 : (t - e) / (o - a);
function getWorklet(e, t, a, o) {
  const u = new AudioWorkletNode(e, t, o);
  return Object.entries(a).forEach(([l, f]) => {
    f !== void 0 && (u.parameters.get(l).value = f);
  }), u;
}
const getParamADSR = (e, t, a, o, u, l, f, p, g, d = "exponential") => {
  t = nanFallback(t), a = nanFallback(a), o = nanFallback(o), u = nanFallback(u);
  const b = d === "exponential" ? "exponentialRampToValueAtTime" : "linearRampToValueAtTime";
  d === "exponential" && (l = l === 0 ? 1e-3 : l, f = f === 0 ? 1e-3 : f);
  const F = f - l, E = f, S = l + o * F, R = g - p, k = (I) => {
    let V;
    if (t > I) {
      let U = getSlope(l, E, 0, t);
      V = I * U + (l > E ? l : 0);
    } else
      V = (I - t) * getSlope(E, S, 0, a) + E;
    return d === "exponential" && (V = V || 1e-3), V;
  };
  e.setValueAtTime(l, p), t > R ? e[b](k(R), g) : t + a > R ? (e[b](k(t), p + t), e[b](k(R), g)) : (e[b](k(t), p + t), e[b](k(t + a), p + t + a), e.setValueAtTime(S, g)), e[b](l, g + u);
};
function getModulationShapeInput(e) {
  return typeof e == "number" ? e % 5 : { tri: 0, triangle: 0, sine: 1, ramp: 2, saw: 3, square: 4 }[e] ?? 0;
}
function getLfo(e, t, a, o = {}) {
  const { shape: u = 0, ...l } = o, { dcoffset: f = -0.5, depth: p = 1 } = o, g = {
    frequency: 1,
    depth: p,
    skew: 0.5,
    phaseoffset: 0,
    time: t,
    begin: t,
    end: a,
    shape: getModulationShapeInput(u),
    dcoffset: f,
    min: f * p,
    max: f * p + p,
    curve: 1,
    ...l
  };
  return getWorklet(e, "lfo-processor", g);
}
function getCompressor(e, t, a, o, u, l) {
  const f = {
    threshold: t ?? -3,
    ratio: a ?? 10,
    knee: o ?? 10,
    attack: u ?? 5e-3,
    release: l ?? 0.05
  };
  return new DynamicsCompressorNode(e, f);
}
const getADSRValues = (e, t = "linear", a) => {
  const [f, p, g, d] = e;
  if (f == null && p == null && g == null && d == null)
    return a ?? [1e-3, 1e-3, 1, 0.01];
  const b = g ?? (f != null && p == null || f == null && p == null ? 1 : 1e-3);
  return [Math.max(f ?? 0, 1e-3), Math.max(p ?? 0, 1e-3), Math.min(b, 1), Math.max(d ?? 0, 0.01)];
};
function getParamLfo(e, t, a, o, u) {
  let { defaultDepth: l = 1, depth: f, dcoffset: p, ...g } = u;
  f == null && (f = Object.values(g).some((F) => F != null) ? l : 0);
  let d;
  return f && (d = getLfo(e, a, o, {
    depth: f,
    dcoffset: p,
    ...g
  }), d.connect(t)), d;
}
function applyParameterModulators(e, t, a, o, u, l) {
  let { amount: f, offset: p, defaultAmount: g = 1, curve: d = "linear", values: b, holdEnd: F, defaultValues: E } = u;
  f == null && (f = b.some((U) => U != null) ? g : 0);
  const S = p ?? 0, R = f + S;
  if (Math.abs(R - S)) {
    const [V, U, q, H] = getADSRValues(b, d, E);
    getParamADSR(t, V, U, q, H, S, R, a, F, d);
  }
  const I = getParamLfo(e, t, a, o, l);
  return { lfo: I, disconnect: () => I?.disconnect() };
}
function createFilter(e, t, a, o, u) {
  let {
    frequency: l,
    anchor: f,
    env: p,
    type: g,
    model: d,
    q: b = 1,
    drive: F = 0.69,
    depth: E,
    dcoffset: S = -0.5,
    skew: R,
    shape: k,
    rate: I,
    sync: V
  } = o, U, q;
  d === "ladder" ? (q = getWorklet(e, "ladder-processor", { frequency: l, q: b, drive: F }), U = q.parameters.get("frequency")) : (q = e.createBiquadFilter(), q.type = g, q.Q.value = b, q.frequency.value = l, U = q.frequency);
  const H = [o.attack, o.decay, o.sustain, o.release], [z, j, ee, te] = getADSRValues(H, "exponential", [5e-3, 0.14, 0, 0.1]);
  if ([...H, p].some((he) => he !== void 0)) {
    p = nanFallback(p, 1, !0), f = nanFallback(f, 0, !0);
    const he = Math.abs(p), fe = he * f;
    let le = clamp(2 ** -fe * l, 0, 2e4), _e = clamp(2 ** (he - fe) * l, 0, 2e4);
    p < 0 && ([le, _e] = [_e, le]), getParamADSR(U, z, j, ee, te, le, _e, t, a, "exponential");
  }
  return V != null && (I = u * V), getParamLfo(e, U, t, a, { depth: E, dcoffset: S, skew: R, shape: k, frequency: I }), q;
}
let wetfade = (e) => e < 0.5 ? 1 : 1 - (e - 0.5) / 0.5;
function drywet(e, t, a = 0) {
  const o = getAudioContext();
  if (!a)
    return e;
  let u = o.createGain(), l = o.createGain();
  e.connect(u), t.connect(l), u.gain.value = wetfade(a), l.gain.value = wetfade(1 - a);
  let f = o.createGain();
  return u.connect(f), l.connect(f), f;
}
let curves = ["linear", "exponential"];
function getPitchEnvelope(e, t, a, o) {
  if ((t.pattack ?? t.pdecay ?? t.psustain ?? t.prelease ?? t.penv) === void 0)
    return;
  const l = nanFallback(t.penv, 1, !0), f = curves[t.pcurve ?? 0];
  let [p, g, d, b] = getADSRValues(
    [t.pattack, t.pdecay, t.psustain, t.prelease],
    f,
    [0.2, 1e-3, 1, 1e-3]
  ), F = t.panchor ?? d;
  const E = l * 100, S = 0 - E * F, R = E - E * F;
  getParamADSR(e, p, g, d, b, S, R, a, o, f);
}
function getVibratoOscillator(e, t, a) {
  const { vibmod: o = 0.5, vib: u } = t;
  let l;
  if (u > 0) {
    l = getAudioContext().createOscillator(), l.frequency.value = u;
    const f = getAudioContext().createGain();
    return f.gain.value = o * 100, l.connect(f), f.connect(e), l.start(a), l;
  }
}
function scheduleAtTime(e, t, a = getAudioContext()) {
  const o = a.currentTime;
  webAudioTimeout(a, e, o, t);
}
function webAudioTimeout(e, t, a, o) {
  const u = new ConstantSourceNode(e), l = gainNode(0);
  return l.connect(e.destination), u.connect(l), u.onended = () => {
    try {
      l.disconnect();
    } catch {
    }
    try {
      u.disconnect();
    } catch {
    }
    t();
  }, u.start(a), u.stop(o), u;
}
const mod$2 = (e, t = 1, a = "sine") => {
  const o = getAudioContext();
  let u;
  noises.includes(a) ? (u = o.createBufferSource(), u.buffer = getNoiseBuffer(a, 2), u.loop = !0) : (u = o.createOscillator(), u.type = a, u.frequency.value = e), u.start();
  const l = new GainNode(o, { gain: t });
  return u.connect(l), { node: l, stop: (f) => u.stop(f) };
}, fm = (e, t, a, o = "sine") => {
  const l = e.value * t, f = l * a;
  return mod$2(l, f, o);
};
function applyFM(e, t, a) {
  const {
    fmh: o = 1,
    fmi: u,
    fmenv: l = "exp",
    fmattack: f,
    fmdecay: p,
    fmsustain: g,
    fmrelease: d,
    fmvelocity: b,
    fmwave: F = "sine",
    duration: E
  } = t;
  let S, R = () => {
  };
  if (u) {
    const I = getAudioContext().createGain(), V = fm(e, o, u, F);
    if (S = V.node, R = V.stop, ![f, p, g, d, b].some((U) => U !== void 0))
      S.connect(e);
    else {
      const [U, q, H, z] = getADSRValues([f, p, g, d]), j = a + E;
      getParamADSR(
        I.gain,
        U,
        q,
        H,
        z,
        0,
        1,
        a,
        j,
        l === "exp" ? "exponential" : "linear"
      ), S.connect(I), I.connect(e);
    }
  }
  return { stop: R };
}
const __squash = (e) => e / (1 + e), _mod = (e, t) => (e % t + t) % t, _scurve = (e, t) => (1 + t) * e / (1 + t * Math.abs(e)), _soft = (e, t) => Math.tanh(e * (1 + t)), _hard = (e, t) => clamp((1 + t) * e, -1, 1), _fold = (e, t) => {
  let a = (1 + 0.5 * t) * e;
  const o = _mod(a + 1, 4);
  return 1 - Math.abs(o - 2);
}, _sineFold = (e, t) => Math.sin(Math.PI / 2 * _fold(e, t)), _cubic = (e, t) => {
  const a = __squash(Math.log1p(t)), o = (e - a / 3 * e * e * e) / (1 - a / 3);
  return _soft(o, t);
}, _diode = (e, t, a = !1) => {
  const o = 1 + 2 * t, l = 0.07 * __squash(Math.log1p(t)), f = _soft(e + l, 2 * t), p = _soft(a ? l : -e + l, 2 * t), g = f - p, d = 1 / Math.cosh(o * l), b = d * d, F = Math.max(1e-8, (a ? 1 : 2) * o * b);
  return _soft(g / F, t);
}, _asym = (e, t) => _diode(e, t, !0), _chebyshev = (e, t) => {
  const a = 10 * Math.log1p(t);
  let o = 1, u = e, l, f = 0;
  for (let p = 1; p < 64; p++) {
    if (p < 2) {
      f += p == 0 ? o : u;
      continue;
    }
    l = 2 * e * o - u, u = o, o = l, p % 2 === 0 && (f += Math.min(1.3 * a / p, 2) * l);
  }
  return _soft(f, a / 20);
}, distortionAlgorithms = {
  scurve: _scurve,
  soft: _soft,
  hard: _hard,
  cubic: _cubic,
  diode: _diode,
  asym: _asym,
  fold: _fold,
  sinefold: _sineFold,
  chebyshev: _chebyshev
}, _algoNames = Object.freeze(Object.keys(distortionAlgorithms)), getDistortionAlgorithm = (e) => {
  let t = e;
  typeof e == "string" && (t = _algoNames.indexOf(e), t === -1 && (logger$1(`[superdough] Could not find waveshaping algorithm ${e}.
        Available options are ${_algoNames.join(", ")}.
        Defaulting to ${_algoNames[0]}.`), t = 0));
  const a = _algoNames[t % _algoNames.length];
  return distortionAlgorithms[a];
}, getDistortion = (e, t, a) => getWorklet(getAudioContext(), "distort-processor", { distort: e, postgain: t }, { processorOptions: { algorithm: a } }), getFrequencyFromValue = (e, t = 36) => {
  let { note: a, freq: o } = e;
  return a = a || t, typeof a == "string" && (a = noteToMidi(a)), !o && typeof a == "number" && (o = midiToFreq$1(a)), Number(o);
}, destroyAudioWorkletNode = (e) => {
  e != null && (e.disconnect(), e.parameters.get("end")?.setValueAtTime(0, 0));
};
let listenerQueue = [], lqIndex = 0;
const QUEUE_ITEMS_PER_LISTENER = 4;
let atom = (e) => {
  let t = [], a = {
    get() {
      return a.lc || a.listen(() => {
      })(), a.value;
    },
    lc: 0,
    listen(o) {
      return a.lc = t.push(o), () => {
        for (let l = lqIndex + QUEUE_ITEMS_PER_LISTENER; l < listenerQueue.length; )
          listenerQueue[l] === o ? listenerQueue.splice(l, QUEUE_ITEMS_PER_LISTENER) : l += QUEUE_ITEMS_PER_LISTENER;
        let u = t.indexOf(o);
        ~u && (t.splice(u, 1), --a.lc || a.off());
      };
    },
    notify(o, u) {
      let l = !listenerQueue.length;
      for (let f of t)
        listenerQueue.push(
          f,
          a.value,
          o,
          u
        );
      if (l) {
        for (lqIndex = 0; lqIndex < listenerQueue.length; lqIndex += QUEUE_ITEMS_PER_LISTENER)
          listenerQueue[lqIndex](
            listenerQueue[lqIndex + 1],
            listenerQueue[lqIndex + 2],
            listenerQueue[lqIndex + 3]
          );
        listenerQueue.length = 0;
      }
    },
    /* It will be called on last listener unsubscribing.
       We will redefine it in onMount and onStop. */
    off() {
    },
    set(o) {
      let u = a.value;
      u !== o && (a.value = o, a.notify(u));
    },
    subscribe(o) {
      let u = a.listen(o);
      return o(a.value), u;
    },
    value: e
  };
  return a;
}, map = (e = {}) => {
  let t = atom(e);
  return t.setKey = function(a, o) {
    let u = t.value;
    typeof o > "u" && a in t.value ? (t.value = { ...t.value }, delete t.value[a], t.notify(u, a)) : t.value[a] !== o && (t.value = {
      ...t.value,
      [a]: o
    }, t.notify(u, a));
  }, t;
};
const bufferCache$1 = {}, loadCache$2 = {}, getCachedBuffer = (e) => bufferCache$1[e];
function humanFileSize$1(e, t) {
  var a = 1024;
  if (e < a) return e + " B";
  var o = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], u = -1;
  do
    e /= a, ++u;
  while (e >= a);
  return e.toFixed(1) + " " + o[u];
}
function getSampleInfo(e, t) {
  const { speed: a = 1 } = e, { transpose: o, url: u, index: l, midi: f, label: p } = getCommonSampleInfo(e, t);
  let g = Math.abs(a) * Math.pow(2, o / 12);
  return { transpose: o, url: u, index: l, midi: f, label: p, playbackRate: g };
}
const getSampleBuffer = async (e, t, a) => {
  let { url: o, label: u, playbackRate: l } = getSampleInfo(e, t);
  a && (o = await a(o));
  const f = getAudioContext(), p = await loadBuffer$1(o, f, u);
  return e.unit === "c" && (l = l * p.duration), { buffer: p, playbackRate: l };
}, getSampleBufferSource = async (e, t, a) => {
  let { buffer: o, playbackRate: u } = await getSampleBuffer(e, t, a);
  e.speed < 0 && (o = reverseBuffer(o));
  const f = getAudioContext().createBufferSource();
  f.buffer = o, f.playbackRate.value = u;
  const { loopBegin: p = 0, loopEnd: g = 1, begin: d = 0, end: b = 1 } = e, F = d * f.buffer.duration;
  e.loop && (f.loop = !0, f.loopStart = p * f.buffer.duration - F, f.loopEnd = g * f.buffer.duration - F);
  const S = f.buffer.duration / f.playbackRate.value, R = (b - d) * S;
  return { bufferSource: f, offset: F, bufferDuration: S, sliceDuration: R };
}, loadBuffer$1 = (e, t, a, o = 0) => {
  const u = a ? `sound "${a}:${o}"` : "sample";
  if (e = e.replace("#", "%23"), !loadCache$2[e]) {
    logger$1(`[sampler] load ${u}..`, "load-sample", { url: e });
    const l = Date.now();
    loadCache$2[e] = fetch(e).then((f) => f.arrayBuffer()).then(async (f) => {
      const p = Date.now() - l, g = humanFileSize$1(f.byteLength);
      logger$1(`[sampler] load ${u}... done! loaded ${g} in ${p}ms`, "loaded-sample", { url: e });
      const d = await t.decodeAudioData(f);
      return bufferCache$1[e] = d, d;
    });
  }
  return loadCache$2[e];
};
function reverseBuffer(e) {
  const t = getAudioContext(), a = t.createBuffer(e.numberOfChannels, e.length, t.sampleRate);
  for (let o = 0; o < e.numberOfChannels; o++)
    a.copyToChannel(e.getChannelData(o).slice().reverse(), o, o);
  return a;
}
const getLoadedBuffer = (e) => bufferCache$1[e];
function resolveSpecialPaths(e) {
  if (e.startsWith("bubo:")) {
    const [t, a] = e.split(":");
    e = `github:Bubobubobubobubo/dough-${a}`;
  }
  return e;
}
function githubPath$2(e, t = "") {
  if (!e.startsWith("github:"))
    throw new Error('expected "github:" at the start of pseudoUrl');
  let a = e.slice(7);
  a = a.endsWith("/") ? a.slice(0, -1) : a;
  let o = a.split("/"), u = o[0], l = o.length >= 2 ? o[1] : "samples", f = o.length >= 3 ? o[2] : "main", p = o.slice(3);
  return p.push(t || ""), p = p.join("/"), `https://raw.githubusercontent.com/${u}/${l}/${f}/${p}`;
}
const processSampleMap = (e, t, a = e._base || "") => Object.entries(e).forEach(([o, u]) => {
  if (typeof u == "string" && (u = [u]), typeof u != "object")
    throw new Error("wrong sample map format for " + o);
  a = u._base || a, a = resolveSpecialPaths(a), a.startsWith("github:") && (a = githubPath$2(a, ""));
  const l = (f) => a + f;
  Array.isArray(u) ? u = u.map(l) : u = Object.fromEntries(
    Object.entries(u).map(([f, p]) => [f, (typeof p == "string" ? [p] : p).map(l)])
  ), t(o, u);
});
let resourcePrefixHandlers = {};
function registerSamplesPrefix(e, t) {
  resourcePrefixHandlers[e] = t;
}
function getSamplesPrefixHandler(e) {
  const t = Object.entries(resourcePrefixHandlers).find(([a]) => e.startsWith(a));
  if (t)
    return t[1];
}
async function fetchSampleMap$1(e) {
  const t = getSamplesPrefixHandler(e);
  if (t)
    return t(e);
  if (e = resolveSpecialPaths(e), e.startsWith("github:") && (e = githubPath$2(e, "strudel.json")), e.startsWith("local:") && (e = "http://localhost:5432"), e.startsWith("shabda:")) {
    let [u, l] = e.split("shabda:");
    e = `https://shabda.ndre.gr/${l}.json?strudel=1`;
  }
  if (e.startsWith("shabda/speech")) {
    let [u, l] = e.split("shabda/speech");
    l = l.startsWith("/") ? l.substring(1) : l;
    let [f, p] = l.split(":"), g = "f", d = "en-GB";
    f && ([d, g] = f.split("/")), e = `https://shabda.ndre.gr/speech/${p}.json?gender=${g}&language=${d}&strudel=1'`;
  }
  if (typeof fetch != "function")
    return;
  const a = e.split("/").slice(0, -1).join("/");
  if (typeof fetch > "u")
    return;
  const o = await fetch(e).then((u) => u.json()).catch((u) => {
    throw console.error(u), new Error(`error loading "${e}"`);
  });
  return [o, o._base || a];
}
const samples = async (e, t = e._base || "", a = {}) => {
  if (typeof e == "string") {
    const [l, f] = await fetchSampleMap$1(e);
    return samples(l, t || f, a);
  }
  const { prebake: o, tag: u } = a;
  processSampleMap(
    e,
    (l, f) => {
      registerSampleSource(l, f, { baseUrl: t, prebake: o, tag: u });
    },
    t
  );
}, cutGroups = [];
async function onTriggerSample(e, t, a, o, u) {
  let {
    s: l,
    nudge: f = 0,
    // TODO: is this in seconds?
    cut: p,
    loop: g,
    clip: d = void 0,
    // if set, samples will be cut off when the hap ends
    n: b = 0,
    speed: F = 1,
    // sample playback speed
    duration: E
  } = t;
  if (F === 0)
    return;
  const S = getAudioContext();
  let [R, k, I, V] = getADSRValues([t.attack, t.decay, t.sustain, t.release]);
  const { bufferSource: U, sliceDuration: q, offset: H } = await getSampleBufferSource(t, o, u);
  if (S.currentTime > e) {
    logger$1(`[sampler] still loading sound "${l}:${b}"`, "highlight");
    return;
  }
  if (!U) {
    logger$1(`[sampler] could not load "${l}:${b}"`, "error");
    return;
  }
  let z = getVibratoOscillator(U.detune, t, e);
  const j = e + f;
  U.start(j, H);
  const ee = S.createGain(), te = U.connect(ee);
  d == null && g == null && t.release == null && (E = q);
  let de = e + E;
  getParamADSR(te.gain, R, k, I, V, 0, 1, e, de, "linear"), getPitchEnvelope(U.detune, t, e, de);
  const ie = S.createGain();
  te.connect(ie), U.onended = function() {
    U.disconnect(), z?.stop(), te.disconnect(), ie.disconnect(), a();
  };
  let he = de + V + 0.01;
  U.stop(he);
  const le = { node: ie, bufferSource: U, stop: (_e) => {
    U.stop(_e);
  } };
  if (p !== void 0) {
    const _e = cutGroups[p];
    _e && (_e.node.gain.setValueAtTime(1, j), _e.node.gain.linearRampToValueAtTime(0, j + 0.01)), cutGroups[p] = le;
  }
  return le;
}
function registerSample(e, t, a) {
  registerSound(e, (o, u, l) => onTriggerSample(o, u, l, t), {
    type: "sample",
    samples: t,
    ...a
  });
}
function registerSampleSource(e, t, a) {
  e.startsWith("wt_") ? registerWaveTable(e, t, a) : registerSample(e, t, a);
}
let hasChanged = (e, t) => e !== void 0 && e !== t;
class Orbit {
  reverbNode;
  delayNode;
  output;
  summingNode;
  djfNode;
  audioContext;
  constructor(t) {
    this.audioContext = t, this.output = new GainNode(t, { gain: 1, channelCount: 2, channelCountMode: "explicit" }), this.summingNode = new GainNode(t, { gain: 1, channelCount: 2, channelCountMode: "explicit" }), this.summingNode.connect(this.output);
  }
  disconnect() {
    this.output.disconnect(), this.summingNode.disconnect(), this.delayNode?.disconnect(), this.reverbNode?.disconnect();
  }
  getDjf(t, a = 0) {
    this.djfNode == null && (this.djfNode = getWorklet(this.audioContext, "djf-processor", { value: t }), this.summingNode.disconnect(), this.summingNode.connect(this.djfNode), this.djfNode.connect(this.output)), this.djfNode.parameters.get("value").setValueAtTime(t, a);
  }
  getDelay(t = 0, a = 0.5, o) {
    return a = clamp(a, 0, 0.98), this.delayNode == null && (this.delayNode = this.audioContext.createFeedbackDelay(1, t, a), this.delayNode.connect(this.summingNode), this.delayNode.start?.(o)), this.delayNode.delayTime.value !== t && this.delayNode.delayTime.setValueAtTime(t, o), this.delayNode.feedback.value !== a && this.delayNode.feedback.setValueAtTime(a, o), this.delayNode;
  }
  getReverb(t, a, o, u, l, f, p) {
    return this.reverbNode == null && (this.reverbNode = this.audioContext.createReverb(t, a, o, u, l, f, p), this.reverbNode.connect(this.summingNode)), (hasChanged(t, this.reverbNode.duration) || hasChanged(a, this.reverbNode.fade) || hasChanged(o, this.reverbNode.lp) || hasChanged(u, this.reverbNode.dim) || hasChanged(f, this.reverbNode.irspeed) || hasChanged(p, this.reverbNode.irbegin) || this.reverbNode.ir !== l) && this.reverbNode.generate(t, a, o, u, l, f, p), this.reverbNode;
  }
  sendReverb(t, a) {
    return effectSend(t, this.reverbNode, a);
  }
  sendDelay(t, a) {
    effectSend(t, this.delayNode, a);
  }
  duck(t, a = 0, o = 0.1, u = 1) {
    const l = a, f = Math.max(o, 2e-3), p = this.output.gain;
    webAudioTimeout(
      this.audioContext,
      () => {
        const g = this.audioContext.currentTime, d = p.value;
        p.cancelScheduledValues(g), p.setValueAtTime(d, g);
        const b = Math.max(t, g), F = clamp(1 - Math.sqrt(u), 0.01, d);
        p.exponentialRampToValueAtTime(F, b + l), p.exponentialRampToValueAtTime(1, b + l + f);
      },
      0,
      t - 0.01
    );
  }
  connectToOutput(t) {
    t.connect(this.summingNode);
  }
}
class SuperdoughOutput {
  channelMerger;
  destinationGain;
  constructor(t) {
    this.audioContext = t, this.initializeAudio();
  }
  initializeAudio() {
    const t = this.audioContext, a = t.destination.maxChannelCount;
    this.audioContext.destination.channelCount = a, this.channelMerger = new ChannelMergerNode(t, { numberOfInputs: t.destination.channelCount }), this.destinationGain = new GainNode(t), this.channelMerger.connect(this.destinationGain), this.destinationGain.connect(t.destination);
  }
  reset() {
    this.disconnect(), this.initializeAudio();
  }
  disconnect() {
    this.channelMerger.disconnect(), this.destinationGain.disconnect(), this.destinationGain = null, this.channelMerger = null;
  }
  connectToDestination = (t, a = [0, 1]) => {
    const o = new StereoPannerNode(this.audioContext);
    t.connect(o);
    const u = new ChannelSplitterNode(this.audioContext, {
      numberOfOutputs: o.channelCount
    });
    o.connect(u), a.forEach((l, f) => {
      u.connect(this.channelMerger, f % o.channelCount, l % this.audioContext.destination.channelCount);
    });
  };
}
class SuperdoughAudioController {
  audioContext;
  output;
  nodes = {};
  constructor(t) {
    this.audioContext = t, this.output = new SuperdoughOutput(t);
  }
  reset() {
    Array.from(this.nodes).forEach((t) => {
      t.disconnect();
    }), this.nodes = {}, this.output.reset();
  }
  duck(t, a, o = 0, u = 0.1, l = 1) {
    const f = [t].flat(), p = [o].flat(), g = [u].flat(), d = [l].flat();
    f.forEach((b, F) => {
      const E = this.nodes[b];
      if (E == null) {
        errorLogger(new Error(`duck target orbit ${b} does not exist`), "superdough");
        return;
      }
      const S = p[F] ?? p[0], R = Math.max(g[F] ?? g[0], 2e-3), k = d[F] ?? d[0];
      E.duck(a, S, R, k);
    });
  }
  getOrbit(t, a) {
    return this.nodes[t] == null && (this.nodes[t] = new Orbit(this.audioContext), this.output.connectToDestination(this.nodes[t].output, a)), this.nodes[t];
  }
}
const DEFAULT_MAX_POLYPHONY = 128, DEFAULT_AUDIO_DEVICE_NAME = "System Standard";
let maxPolyphony = DEFAULT_MAX_POLYPHONY;
function setMaxPolyphony(e) {
  maxPolyphony = parseInt(e) ?? DEFAULT_MAX_POLYPHONY;
}
let multiChannelOrbits = !1;
function setMultiChannelOrbits(e) {
  multiChannelOrbits = e == !0;
}
const soundMap$1 = map();
function registerSound(e, t, a = {}) {
  e = e.toLowerCase().replace(/\s+/g, "_"), soundMap$1.setKey(e, { onTrigger: t, data: a });
}
let gainCurveFunc = (e) => e;
function applyGainCurve(e) {
  return gainCurveFunc(e);
}
function setGainCurve(e) {
  gainCurveFunc = e;
}
function aliasBankMap(e) {
  for (const a in e)
    e[a.toLowerCase()] = e[a];
  const t = soundMap$1.get();
  for (const a in t) {
    const [o, u] = a.split("_");
    if (!u) continue;
    const l = e[o];
    if (l) {
      if (typeof l == "string")
        t[`${l}_${u}`.toLowerCase()] = t[a];
      else if (Array.isArray(l))
        for (const f of l)
          t[`${f}_${u}`.toLowerCase()] = t[a];
    }
  }
  soundMap$1.set({ ...t });
}
async function aliasBankPath(e) {
  const a = await (await fetch(e)).json();
  aliasBankMap(a);
}
async function aliasBank(...e) {
  switch (e.length) {
    case 1:
      return typeof e[0] == "string" ? aliasBankPath(e[0]) : aliasBankMap(e[0]);
    case 2:
      return aliasBankMap({ [e[0]]: e[1] });
    default:
      throw new Error("aliasMap expects 1 or 2 arguments, received " + e.length);
  }
}
function soundAlias(e, t) {
  if (getSound(e) == null) {
    logger$1("soundAlias: original sound not found");
    return;
  }
  soundMap$1.setKey(t, getSound(e));
}
function getSound(e) {
  return typeof e != "string" ? (console.warn(`getSound: expected string got "${e}". fall back to triangle`), soundMap$1.get().triangle) : soundMap$1.get()[e.toLowerCase()];
}
const getAudioDevices = async () => {
  await navigator.mediaDevices.getUserMedia({ audio: !0 });
  let e = await navigator.mediaDevices.enumerateDevices();
  e = e.filter((a) => a.kind === "audiooutput" && a.deviceId !== "default");
  const t = /* @__PURE__ */ new Map();
  return t.set(DEFAULT_AUDIO_DEVICE_NAME, ""), e.forEach((a) => {
    t.set(a.label, a.deviceId);
  }), t;
};
let defaultDefaultValues = {
  s: "triangle",
  gain: 0.8,
  postgain: 1,
  density: ".03",
  channels: [1, 2],
  phaserdepth: 0.75,
  shapevol: 1,
  distortvol: 1,
  distorttype: 0,
  delay: 0,
  byteBeatExpression: "0",
  delayfeedback: 0.5,
  delaysync: 3 / 16,
  orbit: 1,
  i: 1,
  velocity: 1,
  fft: 8
};
const defaultDefaultDefaultValues = Object.freeze({ ...defaultDefaultValues });
function setDefault(e, t) {
  defaultDefaultValues[e] = t;
}
function resetDefaults() {
  defaultDefaultValues = { ...defaultDefaultDefaultValues };
}
let defaultControls = new Map(Object.entries(defaultDefaultValues));
function setDefaultValue(e, t) {
  defaultControls.set(e, t);
}
function getDefaultValue(e) {
  return defaultControls.get(e);
}
function setDefaultValues(e) {
  Object.keys(e).forEach((t) => {
    setDefaultValue(t, e[t]);
  });
}
function resetDefaultValues() {
  defaultControls = new Map(Object.entries(defaultDefaultValues));
}
function setVersionDefaults(e) {
  resetDefaultValues(), e === "1.0" && setDefaultValue("fanchor", 0.5);
}
const resetLoadedSounds = () => soundMap$1.set({});
let externalWorklets = [];
function registerWorklet(e) {
  externalWorklets.push(e);
}
let workletsLoading;
function loadWorklets() {
  if (!workletsLoading) {
    const e = getAudioContext(), t = externalWorklets.concat([workletsUrl]);
    workletsLoading = Promise.all(t.map((a) => e.audioWorklet.addModule(a)));
  }
  return workletsLoading;
}
async function initAudio(e = {}) {
  const {
    disableWorklets: t = !1,
    maxPolyphony: a,
    audioDeviceName: o = DEFAULT_AUDIO_DEVICE_NAME,
    multiChannelOrbits: u = !1
  } = e;
  if (setMaxPolyphony(a), setMultiChannelOrbits(u), typeof window > "u")
    return;
  const l = getAudioContext();
  if (o != null && o != DEFAULT_AUDIO_DEVICE_NAME)
    try {
      const p = (await getAudioDevices()).get(o), g = (p ?? "").length > 0;
      l.sinkId !== p && g && await l.setSinkId(p), logger$1(
        `[superdough] Audio Device set to ${o}, it might take a few seconds before audio plays on all output channels`
      );
    } catch {
      logger$1("[superdough] failed to set audio interface", "warning");
    }
  if (await l.resume(), t) {
    logger$1("[superdough]: AudioWorklets disabled with disableWorklets");
    return;
  }
  try {
    await loadWorklets(), logger$1("[superdough] AudioWorklets loaded");
  } catch (f) {
    console.warn("could not load AudioWorklet effects", f);
  }
  logger$1("[superdough] ready");
}
let audioReady;
async function initAudioOnFirstClick(e) {
  return audioReady || (audioReady = new Promise((t) => {
    document.addEventListener("click", async function a() {
      document.removeEventListener("click", a), await initAudio(e), t();
    });
  })), audioReady;
}
let controller;
function getSuperdoughAudioController() {
  return controller == null && (controller = new SuperdoughAudioController(getAudioContext())), controller;
}
function connectToDestination(e, t) {
  getSuperdoughAudioController().output.connectToDestination(e, t);
}
function getPhaser(e, t, a = 1, o = 0.5, u = 1e3, l = 2e3) {
  const f = getAudioContext(), p = getLfo(f, e, t, { frequency: a, depth: l * 2 }), g = 2;
  let d = 0;
  const b = [];
  for (let F = 0; F < g; F++) {
    const E = f.createBiquadFilter();
    E.type = "notch", E.gain.value = 1, E.frequency.value = u + d, E.Q.value = 2 - Math.min(Math.max(o * 2, 0), 1.9), p.connect(E.detune), d += 282, F > 0 && b[F - 1].connect(E), b.push(E);
  }
  return b[b.length - 1];
}
function getFilterType(e) {
  e = e ?? 0;
  const t = ["12db", "ladder", "24db"];
  return typeof e == "number" ? t[Math.floor(_mod$1(e, t.length))] : e;
}
let analysers = {}, analysersData = {};
function getAnalyserById(e, t = 1024, a = 0.5) {
  if (!analysers[e]) {
    const o = getAudioContext().createAnalyser();
    o.fftSize = t, o.smoothingTimeConstant = a, analysers[e] = o, analysersData[e] = new Float32Array(analysers[e].frequencyBinCount);
  }
  return analysers[e].fftSize !== t && (analysers[e].fftSize = t, analysersData[e] = new Float32Array(analysers[e].frequencyBinCount)), analysers[e];
}
function getAnalyzerData(e = "time", t = 1) {
  const a = {
    time: () => analysers[t]?.getFloatTimeDomainData(analysersData[t]),
    frequency: () => analysers[t]?.getFloatFrequencyData(analysersData[t])
  }[e];
  if (!a)
    throw new Error(`getAnalyzerData: ${e} not supported. use one of ${Object.keys(a).join(", ")}`);
  return a(), analysersData[t];
}
function resetGlobalEffects() {
  controller?.reset(), analysers = {}, analysersData = {};
}
let activeSoundSources = /* @__PURE__ */ new Map();
function mapChannelNumbers(e) {
  return (Array.isArray(e) ? e : [e]).map((t) => t - 1);
}
const superdough = async (e, t, a, o = 0.5, u = 0.5) => {
  const l = getAudioContext(), f = getSuperdoughAudioController();
  let { stretch: p } = e;
  if (p != null && (t = t - 0.04), typeof e != "object")
    throw new Error(
      `expected hap.value to be an object, but got "${e}". Hint: append .note() or .s() to the end`,
      "error"
    );
  if (e.duration = a, t < l.currentTime) {
    console.warn(
      `[superdough]: cannot schedule sounds in the past (target: ${t.toFixed(2)}, now: ${l.currentTime.toFixed(2)})`
    );
    return;
  }
  let {
    tremolo: g,
    tremolosync: d,
    tremolodepth: b = 1,
    tremoloskew: F,
    tremolophase: E = 0,
    tremoloshape: S,
    s: R = getDefaultValue("s"),
    bank: k,
    source: I,
    gain: V = getDefaultValue("gain"),
    postgain: U = getDefaultValue("postgain"),
    density: q = getDefaultValue("density"),
    duckorbit: H,
    duckonset: z,
    duckattack: j,
    duckdepth: ee,
    djf: te,
    // filters
    fanchor: de = getDefaultValue("fanchor"),
    release: ie = 0,
    //phaser
    phaserrate: he,
    phaserdepth: fe = getDefaultValue("phaserdepth"),
    phasersweep: le,
    phasercenter: _e,
    //
    coarse: Me,
    crush: be,
    dry: ve,
    shape: ge,
    shapevol: Ie = getDefaultValue("shapevol"),
    distort: $e,
    distortvol: Xe = getDefaultValue("distortvol"),
    distorttype: ue = getDefaultValue("distorttype"),
    pan: Ee,
    vowel: qe,
    delay: Te = getDefaultValue("delay"),
    delayfeedback: xe = getDefaultValue("delayfeedback"),
    delaysync: Ve = getDefaultValue("delaysync"),
    delaytime: we,
    orbit: We = getDefaultValue("orbit"),
    room: Qe,
    roomfade: nt,
    roomlp: ze,
    roomdim: At,
    roomsize: Ue,
    ir: rt,
    irspeed: at,
    irbegin: ot,
    i: ft = getDefaultValue("i"),
    velocity: ht = getDefaultValue("velocity"),
    analyze: _t,
    // analyser wet
    fft: St = getDefaultValue("fft"),
    // fftSize 0 - 10
    compressor: mt,
    compressorRatio: st,
    compressorKnee: Pt,
    compressorAttack: ke,
    compressorRelease: Je
  } = e;
  we = we ?? cycleToSeconds(Ve, o);
  const Se = mapChannelNumbers(
    multiChannelOrbits && We > 0 ? [We * 2 - 1, We * 2] : getDefaultValue("channels")
  ), Ke = e.channels != null ? mapChannelNumbers(e.channels) : Se, Ne = f.getOrbit(We, Ke);
  H != null && f.duck(H, t, z, j, ee), V = applyGainCurve(nanFallback(V, 1)), U = applyGainCurve(U), Ie = applyGainCurve(Ie), Xe = applyGainCurve(Xe), Te = applyGainCurve(Te), ht = applyGainCurve(ht), b = applyGainCurve(b), V *= ht;
  const yt = t + a, xt = yt + ie, et = Math.round(Math.random() * 1e6);
  for (let Fe = 0; Fe <= activeSoundSources.size - maxPolyphony; Fe++) {
    const Re = activeSoundSources.entries().next(), Ze = Re.value[1].deref(), Ye = Re.value[0], Dt = t + 0.25;
    Ze?.node?.gain?.linearRampToValueAtTime(0, Dt), Ze?.stop?.(Dt), activeSoundSources.delete(Ye);
  }
  let pt = [];
  if (["-", "~", "_"].includes(R))
    return;
  k && R && (R = `${k}_${R}`, e.s = R);
  let tt;
  if (I)
    tt = I(t, e, a, o);
  else if (getSound(R)) {
    const { onTrigger: Fe } = getSound(R), Ze = await Fe(t, e, () => {
      pt.forEach((Ye) => Ye?.disconnect()), activeSoundSources.delete(et);
    }, o);
    Ze && (tt = Ze.node, activeSoundSources.set(et, new WeakRef(Ze)));
  } else
    throw new Error(`sound ${R} not found! Is it loaded?`);
  if (!tt)
    return;
  if (l.currentTime > t) {
    logger$1("[webaudio] skip hap: still loading", l.currentTime - t);
    return;
  }
  const Ge = [];
  Ge.push(tt), p !== void 0 && Ge.push(getWorklet(l, "phase-vocoder-processor", { pitchFactor: p })), Ge.push(gainNode(V));
  const Ft = getFilterType(e.ftype);
  if (e.cutoff !== void 0) {
    const Re = pickAndRename(e, {
      frequency: "cutoff",
      q: "resonance",
      attack: "lpattack",
      decay: "lpdecay",
      sustain: "lpsustain",
      release: "lprelease",
      env: "lpenv",
      anchor: "fanchor",
      model: "ftype",
      drive: "drive",
      rate: "lprate",
      sync: "lpsync",
      depth: "lpdepth",
      shape: "lpshape",
      dcoffset: "lpdc",
      skew: "lpskew"
    });
    Re.type = "lowpass";
    let Ze = () => createFilter(l, t, yt, Re, o);
    Ge.push(Ze()), Ft === "24db" && Ge.push(Ze());
  }
  if (e.hcutoff !== void 0) {
    const Re = pickAndRename(e, {
      frequency: "hcutoff",
      q: "hresonance",
      attack: "hpattack",
      decay: "hpdecay",
      sustain: "hpsustain",
      release: "hprelease",
      env: "hpenv",
      anchor: "fanchor",
      model: "ftype",
      drive: "drive",
      rate: "hprate",
      sync: "hpsync",
      depth: "hpdepth",
      shape: "hpshape",
      dcoffset: "hpdc",
      skew: "hpskew"
    });
    Re.type = "highpass";
    let Ze = () => createFilter(l, t, yt, Re, o);
    Ge.push(Ze()), Ft === "24db" && Ge.push(Ze());
  }
  if (e.bandf !== void 0) {
    const Re = pickAndRename(e, {
      frequency: "bandf",
      q: "bandq",
      attack: "bpattack",
      decay: "bpdecay",
      sustain: "bpsustain",
      release: "bprelease",
      env: "bpenv",
      anchor: "fanchor",
      model: "ftype",
      drive: "drive",
      rate: "bprate",
      sync: "bpsync",
      depth: "bpdepth",
      shape: "bpshape",
      dcoffset: "bpdc",
      skew: "bpskew"
    });
    Re.type = "bandpass";
    let Ze = () => createFilter(l, t, yt, Re, o);
    Ge.push(Ze()), Ft === "24db" && Ge.push(Ze());
  }
  if (qe !== void 0) {
    const Fe = l.createVowelFilter(qe);
    Ge.push(Fe);
  }
  if (Me !== void 0 && Ge.push(getWorklet(l, "coarse-processor", { coarse: Me })), be !== void 0 && Ge.push(getWorklet(l, "crush-processor", { crush: be })), ge !== void 0 && Ge.push(getWorklet(l, "shape-processor", { shape: ge, postgain: Ie })), $e !== void 0 && Ge.push(getDistortion($e, Xe, ue)), d != null && (g = o * d), e.wtPosSynced != null && (e.wtPosRate /= o), e.wtWarpSynced != null && (e.wtWarpRate /= o), g !== void 0) {
    const Fe = Math.max(1 - b, 0), Re = new GainNode(l, { gain: Fe }), Ze = u / o;
    getLfo(l, t, xt, {
      skew: F ?? (S != null ? 0.5 : 1),
      frequency: g,
      depth: b,
      time: Ze,
      dcoffset: 0,
      shape: S,
      phaseoffset: E,
      min: 0,
      max: 1,
      curve: 1.5
    }).connect(Re.gain), Ge.push(Re);
  }
  if (mt !== void 0 && Ge.push(
    getCompressor(l, mt, st, Pt, ke, Je)
  ), Ee !== void 0) {
    const Fe = l.createStereoPanner();
    Fe.pan.value = 2 * Ee - 1, Ge.push(Fe);
  }
  if (he !== void 0 && fe > 0) {
    const Fe = getPhaser(t, xt, he, fe, _e, le);
    Ge.push(Fe);
  }
  const Ct = new GainNode(l, { gain: U });
  if (Ge.push(Ct), Te > 0 && we > 0 && xe > 0 && (Ne.getDelay(we, xe, t), Ne.sendDelay(Ct, Te)), Qe > 0) {
    let Fe;
    if (rt !== void 0) {
      let Ze, Ye = getSound(rt);
      Array.isArray(Ye) ? Ze = Ye.data.samples[ft % Ye.data.samples.length] : typeof Ye == "object" && (Ze = Object.values(Ye.data.samples).flat()[ft % Object.values(Ye.data.samples).length]), Fe = await loadBuffer$1(Ze, l, rt, 0);
    }
    Ne.getReverb(Ue, nt, ze, At, Fe, at, ot);
    const Re = Ne.sendReverb(Ct, Qe);
    pt.push(Re);
  }
  if (te != null && Ne.getDjf(te, t), _t) {
    const Fe = getAnalyserById(_t, 2 ** (St + 5)), Re = effectSend(Ct, Fe, 1);
    pt.push(Re);
  }
  if (ve != null) {
    ve = applyGainCurve(ve);
    const Fe = new GainNode(l, { gain: ve });
    Ge.push(Fe), Ne.connectToOutput(Fe);
  } else
    Ne.connectToOutput(Ct);
  Ge.slice(1).reduce((Fe, Re) => Fe.connect(Re), Ge[0]), pt = pt.concat(Ge);
}, superdoughTrigger = (e, t, a, o) => {
  superdough(t, e - a, t.duration / o, o);
}, waveforms = ["triangle", "square", "sawtooth", "sine", "user"], waveformAliases = [
  ["tri", "triangle"],
  ["sqr", "square"],
  ["saw", "sawtooth"],
  ["sin", "sine"]
];
function makeSaturationCurve(e, t) {
  const a = e, o = new Float32Array(t);
  for (let u = 0; u < t; u++) {
    const l = u * 2 / t - 1;
    o[u] = Math.tanh(l * a);
  }
  return o;
}
function registerSynthSounds() {
  [...waveforms].forEach((e) => {
    registerSound(
      e,
      (t, a, o) => {
        const [u, l, f, p] = getADSRValues(
          [a.attack, a.decay, a.sustain, a.release],
          "linear",
          [1e-3, 0.05, 0.6, 0.01]
        );
        let g = getOscillator(e, t, a), { node: d, stop: b, triggerRelease: F } = g;
        const E = gainNode(0.3), { duration: S } = a;
        d.onended = () => {
          d.disconnect(), E.disconnect(), o();
        };
        const R = gainNode(1);
        let k = d.connect(E).connect(R);
        const I = t + S;
        getParamADSR(k.gain, u, l, f, p, 0, 1, t, I, "linear");
        const V = I + p + 0.01;
        return F?.(V), b(V), {
          node: k,
          stop: (U) => {
            b(U);
          }
        };
      },
      { type: "synth", prebake: !0 }
    );
  }), registerSound(
    "sbd",
    (e, t, a) => {
      const { duration: o, decay: u = 0.5, pdecay: l = 0.5, penv: f = 36, clip: p } = t, g = getAudioContext(), d = 0.02, b = 1.2, F = 0.025, E = 1, S = g.createOscillator();
      S.type = "triangle", S.frequency.value = getFrequencyFromValue(t, 29), S.detune.setValueAtTime(f * 100, 0), S.detune.setValueAtTime(f * 100, e), S.detune.exponentialRampToValueAtTime(1e-3, e + l);
      const R = gainNode(1);
      R.gain.setValueAtTime(1, e + d), R.gain.exponentialRampToValueAtTime(1e-3, e + d + u), S.start(e);
      const k = getNoiseOscillator("brown", e, 2), I = gainNode(1);
      I.gain.setValueAtTime(b, e), I.gain.exponentialRampToValueAtTime(1e-3, e + F);
      const V = new WaveShaperNode(g);
      V.curve = makeSaturationCurve(2, g.sampleRate);
      const U = gainNode(E);
      S.onended = () => {
        S.disconnect(), R.disconnect(), V.disconnect(), k.node.disconnect(), I.disconnect(), U.disconnect(), a();
      };
      const q = S.connect(V).connect(R).connect(U);
      k.node.connect(I).connect(U);
      let z = e + u + 0.01;
      return p != null && (z = Math.min(e + p * o, z)), U.gain.setValueAtTime(E, z - 0.01), U.gain.linearRampToValueAtTime(0, z), S.stop(z), k.stop(z), {
        node: q,
        stop: (j) => {
          S.stop(j);
        }
      };
    },
    { type: "synth", prebake: !0 }
  ), registerSound(
    "supersaw",
    (e, t, a) => {
      const o = getAudioContext();
      let { duration: u, n: l, unison: f = 5, spread: p = 0.6, detune: g } = t;
      g = g ?? l ?? 0.18;
      const d = getFrequencyFromValue(t), [b, F, E, S] = getADSRValues(
        [t.attack, t.decay, t.sustain, t.release],
        "linear",
        [1e-3, 0.05, 0.6, 0.01]
      ), R = e + u, k = R + S + 0.01, I = clamp(f, 1, 100);
      let V = I > 1 ? clamp(p, 0, 1) : 0, U = getWorklet(
        o,
        "supersaw-oscillator",
        {
          frequency: d,
          begin: e,
          end: k,
          freqspread: g,
          voices: I,
          panspread: V
        },
        {
          outputChannelCount: [2]
        }
      );
      const q = 1 / Math.sqrt(I);
      getPitchEnvelope(U.parameters.get("detune"), t, e, R);
      const H = getVibratoOscillator(U.parameters.get("detune"), t, e), z = applyFM(U.parameters.get("frequency"), t, e);
      let j = gainNode(1);
      j = U.connect(j), getParamADSR(j.gain, b, F, E, S, 0, 0.3 * q, e, R, "linear");
      let ee = webAudioTimeout(
        o,
        () => {
          destroyAudioWorkletNode(U), j.disconnect(), a(), z?.stop(), H?.stop();
        },
        e,
        k
      );
      return {
        node: j,
        stop: (te) => {
          ee.stop(te);
        }
      };
    },
    { prebake: !0, type: "synth" }
  ), registerSound(
    "bytebeat",
    (e, t, a) => {
      const o = [
        "(t%255 >= t/255%255)*255",
        "(t*(t*8%60 <= 300)|(-t)*(t*4%512 < 256))+t/400",
        "t",
        "t*(t >> 10^t)",
        "t&128",
        "t&t>>8",
        "((t%255+t%128+t%64+t%32+t%16+t%127.8+t%64.8+t%32.8+t%16.8)/3)",
        "((t%64+t%63.8+t%64.15+t%64.35+t%63.5)/1.25)",
        "(t&(t>>7)-t)",
        "(sin(t*PI/128)*127+127)",
        "((t^t/2+t+64*(sin((t*PI/64)+(t*PI/32768))+64))%128*2)",
        "((t^t/2+t+64*(cos >> 0))%127.85*2)",
        "((t^t/2+t+64)%128*2)",
        "(((t * .25)^(t * .25)/100+(t * .25))%128)*2",
        "((t^t/2+t+64)%7 * 24)"
      ], { n: u = 0 } = t, l = getFrequencyFromValue(t), { byteBeatExpression: f = o[u % o.length], byteBeatStartTime: p } = t, g = getAudioContext();
      let { duration: d } = t;
      const [b, F, E, S] = getADSRValues(
        [t.attack, t.decay, t.sustain, t.release],
        "linear",
        [1e-3, 0.05, 0.6, 0.01]
      ), R = e + d, k = R + S + 0.01;
      let I = getWorklet(
        g,
        "byte-beat-processor",
        {
          frequency: l,
          begin: e,
          end: k
        },
        {
          outputChannelCount: [2]
        }
      );
      I.port.postMessage({ codeText: f, byteBeatStartTime: p, frequency: l });
      let V = gainNode(1);
      V = I.connect(V), getParamADSR(V.gain, b, F, E, S, 0, 1, e, R, "linear");
      let U = webAudioTimeout(
        g,
        () => {
          destroyAudioWorkletNode(I), V.disconnect(), a();
        },
        e,
        k
      );
      return {
        node: V,
        stop: (q) => {
          U.stop(q);
        }
      };
    },
    { prebake: !0, type: "synth" }
  ), registerSound(
    "pulse",
    (e, t, a) => {
      const o = getAudioContext();
      let { pwrate: u, pwsweep: l } = t;
      l == null && (u != null ? l = 0.3 : l = 0), u == null && l != null && (u = 1);
      let { duration: f, pw: p = 0.5 } = t;
      const g = getFrequencyFromValue(t), [d, b, F, E] = getADSRValues(
        [t.attack, t.decay, t.sustain, t.release],
        "linear",
        [1e-3, 0.05, 0.6, 0.01]
      ), S = e + f, R = S + E + 0.01;
      let k = getWorklet(
        o,
        "pulse-oscillator",
        {
          frequency: g,
          begin: e,
          end: R,
          pulsewidth: p
        },
        {
          outputChannelCount: [2]
        }
      );
      getPitchEnvelope(k.parameters.get("detune"), t, e, S);
      const I = getVibratoOscillator(k.parameters.get("detune"), t, e), V = applyFM(k.parameters.get("frequency"), t, e);
      let U = gainNode(1);
      U = k.connect(U), getParamADSR(U.gain, d, b, F, E, 0, 1, e, S, "linear");
      let q;
      l != 0 && (q = getLfo(o, e, R, { frequency: u, depth: l }), q.connect(k.parameters.get("pulsewidth")));
      let H = webAudioTimeout(
        o,
        () => {
          destroyAudioWorkletNode(k), destroyAudioWorkletNode(q), U.disconnect(), a(), V?.stop(), I?.stop();
        },
        e,
        R
      );
      return {
        node: U,
        stop: (z) => {
          H.stop(z);
        }
      };
    },
    { prebake: !0, type: "synth" }
  ), [...noises].forEach((e) => {
    registerSound(
      e,
      (t, a, o) => {
        const [u, l, f, p] = getADSRValues(
          [a.attack, a.decay, a.sustain, a.release],
          "linear",
          [1e-3, 0.05, 0.6, 0.01]
        );
        let g, { density: d } = a;
        g = getNoiseOscillator(e, t, d);
        let { node: b, stop: F, triggerRelease: E } = g;
        const S = gainNode(0.3), { duration: R } = a;
        b.onended = () => {
          b.disconnect(), S.disconnect(), o();
        };
        const k = gainNode(1);
        let I = b.connect(S).connect(k);
        const V = t + R;
        getParamADSR(I.gain, u, l, f, p, 0, 1, t, V, "linear");
        const U = V + p + 0.01;
        return E?.(U), F(U), {
          node: I,
          stop: (q) => {
            F(q);
          }
        };
      },
      { type: "synth", prebake: !0 }
    );
  }), waveformAliases.forEach(([e, t]) => soundMap$1.set({ ...soundMap$1.get(), [e]: soundMap$1.get()[t] }));
}
const PI2 = 2 * Math.PI;
function waveformN(e, t, a) {
  e = typeof e == "object" ? e : new Float32Array(e).fill(1);
  const u = e.length, l = new Float32Array(u + 1), f = new Float32Array(u + 1), p = getAudioContext(), g = p.createOscillator(), d = {
    sawtooth: (F) => [0, -1 / F],
    square: (F) => [0, F % 2 === 0 ? 0 : 1 / F],
    triangle: (F) => [F % 2 === 0 ? 0 : 1 / (F * F), 0],
    user: (F) => [0, 1]
  };
  if (!d[a])
    throw new Error(`unknown wave type ${a}`);
  for (let F = 0; F < u; F++) {
    const E = e[F], [S, R] = d[a](F + 1), k = t?.[F] ?? 0;
    let I = S * E, V = R * E;
    if (k !== 0) {
      const U = Math.cos(PI2 * k), q = Math.sin(PI2 * k);
      I = U * I - q * V, V = q * I + U * V;
    }
    l[F + 1] = I, f[F + 1] = V;
  }
  const b = p.createPeriodicWave(l, f);
  return g.setPeriodicWave(b), g;
}
function getOscillator(e, t, a) {
  const { duration: o, noise: u = 0 } = a, l = a.partials ?? a.n;
  let f;
  e === "user" && !l && (logger$1(
    "[superdough] Synth 'user' was selected, but partials not specified. Defaulting to triangle. Use pat.partials to setup custom waveform"
  ), e = "triangle"), e = e === "user" && !l ? "triangle" : e, !l || l?.length === 0 || e === "sine" ? (f = getAudioContext().createOscillator(), f.type = e || "triangle") : f = waveformN(l, a.phases, e), f.frequency.value = getFrequencyFromValue(a), f.start(t);
  let p = getVibratoOscillator(f.detune, a, t);
  getPitchEnvelope(f.detune, a, t, t + o);
  const g = applyFM(f.frequency, a, t);
  let d;
  return u && (d = getNoiseMix(f, u, t)), {
    node: d?.node || f,
    stop: (b) => {
      g.stop(b), p?.stop(b), d?.stop(b), f.stop(b);
    },
    triggerRelease: (b) => {
    }
  };
}
function buildSamples(e = 1, t = 0.05, a = 220, o = 0, u = 0, l = 0.1, f = 0, p = 1, g = 0, d = 0, b = 0, F = 0, E = 0, S = 0, R = 0, k = 0, I = 0, V = 1, U = 0, q = 0) {
  let H = Math.PI * 2, z = getAudioContext().sampleRate, j = (Ie) => Ie > 0 ? 1 : -1, ee = g *= 500 * H / z / z, te = a *= (1 + t * 2 * Math.random() - t) * H / z, de = [], ie = 0, he = 0, fe = 0, le = 1, _e = 0, Me = 0, be = 0, ve, ge;
  for (o = o * z + 9, U *= z, u *= z, l *= z, I *= z, d *= 500 * H / z ** 3, R *= H / z, b *= H / z, F *= z, E = E * z | 0, ge = o + U + u + l + I | 0; fe < ge; de[fe++] = be)
    ++Me % (k * 100 | 0) || (be = f ? f > 1 ? f > 2 ? f > 3 ? Math.sin((ie % H) ** 3) : Math.max(Math.min(Math.tan(ie), 1), -1) : 1 - (2 * ie / H % 2 + 2) % 2 : 1 - 4 * Math.abs(Math.round(ie / H) - ie / H) : Math.sin(ie), be = (E ? 1 - q + q * Math.sin(H * fe / E) : 1) * j(be) * Math.abs(be) ** p * // curve 0=square, 2=pointy
    e * 1 * // envelope
    (fe < o ? fe / o : fe < o + U ? 1 - (fe - o) / U * (1 - V) : fe < o + U + u ? V : fe < ge - I ? (ge - fe - I) / l * // release falloff
    V : 0), be = I ? be / 2 + (I > fe ? 0 : (fe < ge - I ? 1 : (ge - fe) / I) * // release delay
    de[fe - I | 0] / 2) : be), ve = (a += g += d) * // frequency
    Math.cos(R * he++), ie += ve - ve * S * (1 - (Math.sin(fe) + 1) * 1e9 % 2), le && ++le > F && (a += b, te += b, le = 0), E && !(++_e % E) && (a = te, g = ee, le ||= 1);
  return de;
}
const getZZFX = (e, t) => {
  let {
    s: a,
    note: o = 36,
    freq: u,
    //
    zrand: l = 0,
    attack: f = 0,
    decay: p = 0,
    sustain: g = 0.8,
    release: d = 0.1,
    curve: b = 1,
    slide: F = 0,
    deltaSlide: E = 0,
    pitchJump: S = 0,
    pitchJumpTime: R = 0,
    lfo: k = 0,
    znoise: I = 0,
    zmod: V = 0,
    zcrush: U = 0,
    zdelay: q = 0,
    tremolo: H = 0,
    duration: z = 0.2,
    zzfx: j
  } = e;
  const ee = Math.max(z - f - p, 0);
  typeof o == "string" && (o = noteToMidi(o)), !u && typeof o == "number" && (u = midiToFreq$1(o)), a = a.replace("z_", "");
  const te = ["sine", "triangle", "sawtooth", "tan", "noise"].indexOf(a) || 0;
  b = a === "square" ? 0 : b;
  const ie = (
    /* ZZFX. */
    buildSamples(...j || [
      0.25,
      // volume
      l,
      u,
      f,
      ee,
      d,
      te,
      b,
      F,
      E,
      S,
      R,
      k,
      I,
      V,
      U,
      q,
      g,
      // sustain volume!
      p,
      H
    ])
  ), he = getAudioContext(), fe = he.createBuffer(1, ie.length, he.sampleRate);
  fe.getChannelData(0).set(ie);
  const le = getAudioContext().createBufferSource();
  return le.buffer = fe, le.start(t), {
    node: le
  };
};
function registerZZFXSounds() {
  ["zzfx", "z_sine", "z_sawtooth", "z_triangle", "z_square", "z_tan", "z_noise"].forEach((e) => {
    registerSound(
      e,
      (t, a, o) => {
        const { node: u } = getZZFX({ s: e, ...a }, t);
        return u.onended = () => {
          u.disconnect(), o();
        }, {
          node: u,
          stop: () => {
          }
        };
      },
      { type: "synth", prebake: !0 }
    );
  });
}
let worklet;
async function dspWorklet(e, t) {
  const a = `dsp-worklet-${Date.now()}`, o = `${t}
let __q = []; // trigger queue
class MyProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.t = 0;
    this.stopped = false;
    this.port.onmessage = (e) => {
      if(e.data==='stop') {
        this.stopped = true;
      } else if(e.data?.dough) {
        __q.push(e.data)
      } else {
        msg?.(e.data)
      }
    };
  }
  process(inputs, outputs, parameters) {
    const output = outputs[0];
    if(__q.length) {
      for(let i=0;i<__q.length;++i) {
        const deadline = __q[i].time-currentTime;
        if(deadline<=0) {
          trigger(__q[i].dough)
          __q.splice(i,1)
        }
      }
    }
    for (let i = 0; i < output[0].length; i++) {
      const out = dsp(this.t / sampleRate);
      output.forEach((channel) => {
        channel[i] = out;
      });
      this.t++;
    }
  return !this.stopped;
  }
}
registerProcessor('${a}', MyProcessor);
`, l = `data:text/javascript;base64,${btoa(o)}`;
  await e.audioWorklet.addModule(l);
  const f = new AudioWorkletNode(e, a);
  return { node: f, stop: () => f.port.postMessage("stop") };
}
const stop = () => {
  worklet && (worklet?.stop(), worklet?.node?.disconnect());
};
typeof window < "u" && window.addEventListener("message", (e) => {
  e.data === "strudel-stop" ? stop() : e.data?.dough && worklet?.node.port.postMessage(e.data);
});
const dough = async (e) => {
  const t = getAudioContext();
  stop(), worklet = await dspWorklet(t, e), worklet.node.connect(t.destination);
};
function doughTrigger(e, t, a, o) {
  window.postMessage({ time: o, dough: e.value, currentTime: t, duration: e.duration, cps: a });
}
const Warpmode = Object.freeze({
  NONE: 0,
  ASYM: 1,
  MIRROR: 2,
  BENDP: 3,
  BENDM: 4,
  BENDMP: 5,
  SYNC: 6,
  QUANT: 7,
  FOLD: 8,
  PWM: 9,
  ORBIT: 10,
  SPIN: 11,
  CHAOS: 12,
  PRIMES: 13,
  BINARY: 14,
  BROWNIAN: 15,
  RECIPROCAL: 16,
  WORMHOLE: 17,
  LOGISTIC: 18,
  SIGMOID: 19,
  FRACTAL: 20,
  FLIP: 21
}), seenKeys = /* @__PURE__ */ new Set();
async function getPayload(e, t, a = 2048) {
  const o = `${e},${a}`;
  if (!seenKeys.has(o)) {
    const l = (await loadBuffer(e, t)).getChannelData(0), f = l.length, p = Math.max(1, Math.floor(f / a)), g = new Array(p);
    for (let d = 0; d < p; d++) {
      const b = d * a;
      g[d] = l.subarray(b, b + a);
    }
    return seenKeys.add(o), { frames: g, frameLen: a, numFrames: p, key: o };
  }
  return { frameLen: a, key: o };
}
function humanFileSize(e, t) {
  var a = 1024;
  if (e < a) return e + " B";
  var o = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], u = -1;
  do
    e /= a, ++u;
  while (e >= a);
  return e.toFixed(1) + " " + o[u];
}
function parseWavSampleRate(e) {
  const t = new DataView(e);
  let a = 12;
  for (; a + 8 <= t.byteLength; ) {
    const o = String.fromCharCode(t.getUint8(a), t.getUint8(a + 1), t.getUint8(a + 2), t.getUint8(a + 3)), u = t.getUint32(a + 4, !0);
    if (o === "fmt ")
      return t.getUint32(a + 12, !0);
    a += 8 + u + (u & 1);
  }
  return null;
}
async function decodeAtNativeRate(e) {
  const t = parseWavSampleRate(e) || 44100;
  return await new OfflineAudioContext(1, 1, t).decodeAudioData(e);
}
const loadCache$1 = {}, loadBuffer = (e, t) => {
  if (e = e.replace("#", "%23"), !loadCache$1[e]) {
    logger$1(`[wavetable] load table ${t}..`, "load-table", { url: e });
    const a = Date.now();
    loadCache$1[e] = fetch(e).then((o) => o.arrayBuffer()).then(async (o) => {
      const u = Date.now() - a, l = humanFileSize(o.byteLength);
      return logger$1(`[wavetable] load table ${t}... done! loaded ${l} in ${u}ms`, "loaded-table", { url: e }), await decodeAtNativeRate(o);
    });
  }
  return loadCache$1[e];
};
function githubPath$1(e, t = "") {
  if (!e.startsWith("github:"))
    throw new Error('expected "github:" at the start of pseudoUrl');
  let [a, o] = e.split("github:");
  return o = o.endsWith("/") ? o.slice(0, -1) : o, o.split("/").length === 2 && (o += "/main"), `https://raw.githubusercontent.com/${o}/${t}`;
}
const _processTables = (e, t, a, o = {}) => (t = e._base || t, Object.entries(e).forEach(([u, l]) => {
  if (u === "_base") return !1;
  if (typeof l == "string" && (l = [l]), typeof l != "object")
    throw new Error("wrong json format for " + u);
  let f = t;
  f.startsWith("github:") && (f = githubPath$1(f, "")), l = l.map((p) => f + p).filter((p) => p.toLowerCase().endsWith(".wav") ? !0 : (logger$1(`[wavetable] skipping ${p} -- wavetables must be ".wav" format`), !1)), l.length && registerWaveTable(u, l, { baseUrl: t, frameLen: a });
}));
function registerWaveTable(e, t, a) {
  registerSound(
    e,
    (o, u, l, f) => onTriggerSynth(o, u, l, t, f, a?.frameLen ?? 2048),
    {
      type: "wavetable",
      tables: t,
      ...a
    }
  );
}
const tables = async (e, t, a, o = {}) => {
  if (a !== void 0) return _processTables(a, e, t);
  if (e.startsWith("github:") && (e = githubPath$1(e, "strudel.json")), e.startsWith("local:") && (e = "http://localhost:5432"), typeof fetch == "function" && !(typeof fetch > "u"))
    return fetch(e).then((u) => u.json()).then((u) => _processTables(u, e, t, o)).catch((u) => {
      throw console.error(u), new Error(`error loading "${e}"`);
    });
};
async function onTriggerSynth(e, t, a, o, u, l) {
  const { s: f, n: p = 0, duration: g, clip: d } = t, b = getAudioContext(), [F, E, S, R] = getADSRValues([t.attack, t.decay, t.sustain, t.release]);
  let { warpmode: k } = t;
  typeof k == "string" && (k = Warpmode[k.toUpperCase()] ?? Warpmode.NONE);
  const I = getFrequencyFromValue(t), { url: V, label: U } = getCommonSampleInfo(t, o), q = await getPayload(V, U, l);
  let H = e + g;
  d !== void 0 && (H = Math.min(e + d * g, H));
  const z = H + R, j = z + 0.01, ee = getWorklet(
    b,
    "wavetable-oscillator-processor",
    {
      begin: e,
      end: j,
      frequency: I,
      freqspread: t.detune,
      position: t.wt,
      warp: t.warp,
      warpMode: k,
      voices: Math.max(t.unison ?? 1, 1),
      panspread: t.spread,
      phaserand: t.wtphaserand ?? t.unison > 1 ? 1 : 0
    },
    { outputChannelCount: [2] }
  );
  if (ee.port.postMessage({ type: "table", payload: q }), b.currentTime > e) {
    logger$1(`[wavetable] still loading sound "${f}:${p}"`, "highlight");
    return;
  }
  const te = [t.wtattack, t.wtdecay, t.wtsustain, t.wtrelease], de = [t.warpattack, t.warpdecay, t.warpsustain, t.warprelease], ie = ee.parameters, he = ie.get("position"), fe = ie.get("warp");
  let le = t.wtrate;
  t.wtsync != null && (le = u * t.wtsync);
  const _e = applyParameterModulators(
    b,
    he,
    e,
    z,
    {
      offset: t.wt,
      amount: t.wtenv,
      defaultAmount: 0.5,
      shape: "linear",
      values: te,
      holdEnd: H,
      defaultValues: [0, 0.5, 0, 0.1]
    },
    {
      frequency: le,
      depth: t.wtdepth,
      defaultDepth: 0.5,
      shape: t.wtshape,
      skew: t.wtskew,
      dcoffset: t.wtdc ?? 0
    }
  );
  let Me = t.warprate;
  t.warpsync != null && (Me = Me = u * t.warpsync);
  const be = applyParameterModulators(
    b,
    fe,
    e,
    z,
    {
      offset: t.warp,
      amount: t.warpenv,
      defaultAmount: 0.5,
      shape: "linear",
      values: de,
      holdEnd: H,
      defaultValues: [0, 0.5, 0, 0.1]
    },
    {
      frequency: Me,
      depth: t.warpdepth,
      defaultDepth: 0.5,
      shape: t.warpshape,
      skew: t.warpskew,
      dcoffset: t.warpdc ?? 0
    }
  ), ve = getVibratoOscillator(ee.parameters.get("detune"), t, e), ge = applyFM(ee.parameters.get("frequency"), t, e), Ie = b.createGain(), $e = ee.connect(Ie);
  getParamADSR($e.gain, F, E, S, R, 0, 0.3, e, H, "linear"), getPitchEnvelope(ee.parameters.get("detune"), t, e, H);
  const Xe = { node: $e, source: ee }, ue = webAudioTimeout(
    b,
    () => {
      destroyAudioWorkletNode(ee), ve?.stop(), ge?.stop(), $e.disconnect(), _e?.disconnect(), be?.disconnect(), a();
    },
    e,
    j
  );
  return Xe.stop = (Ee) => {
    ue.stop(Ee);
  }, Xe;
}
let doughWorklet;
function initDoughWorklet() {
  const e = getAudioContext();
  doughWorklet = getWorklet(
    e,
    "dough-processor",
    {},
    {
      outputChannelCount: [2]
    }
  ), connectToDestination(doughWorklet);
}
const soundMap = /* @__PURE__ */ new Map(), loadedSounds = /* @__PURE__ */ new Map();
Pattern$1.prototype.supradough = function() {
  return this.onTrigger((e, t, a, o) => {
    e.value._begin = o, e.value._duration = e.duration / a, !doughWorklet && initDoughWorklet();
    const u = (e.value.bank ? e.value.bank + "_" : "") + e.value.s, l = e.value.n ?? 0, f = `${u}:${l}`;
    if (soundMap.has(u) && (e.value.s = f), soundMap.has(u) && !loadedSounds.has(f)) {
      const p = soundMap.get(u), g = p[l % p.length];
      console.log(`load ${f} from ${g}`);
      const d = fetchSample(g);
      loadedSounds.set(f, d), d.then(
        ({ channels: b, sampleRate: F }) => doughWorklet.port.postMessage({
          sample: f,
          channels: b,
          sampleRate: F
        })
      );
    }
    doughWorklet.port.postMessage({ spawn: e.value });
  }, 1);
};
function githubPath(e, t = "") {
  if (!e.startsWith("github:"))
    throw new Error('expected "github:" at the start of pseudoUrl');
  let [a, o] = e.split("github:");
  return o = o.endsWith("/") ? o.slice(0, -1) : o, o.split("/").length === 2 && (o += "/main"), `https://raw.githubusercontent.com/${o}/${t}`;
}
async function fetchSampleMap(e) {
  if (e.startsWith("github:") && (e = githubPath(e, "strudel.json")), e.startsWith("local:") && (e = "http://localhost:5432"), e.startsWith("shabda:")) {
    let [o, u] = e.split("shabda:");
    e = `https://shabda.ndre.gr/${u}.json?strudel=1`;
  }
  if (e.startsWith("shabda/speech")) {
    let [o, u] = e.split("shabda/speech");
    u = u.startsWith("/") ? u.substring(1) : u;
    let [l, f] = u.split(":"), p = "f", g = "en-GB";
    l && ([g, p] = l.split("/")), e = `https://shabda.ndre.gr/speech/${f}.json?gender=${p}&language=${g}&strudel=1'`;
  }
  if (typeof fetch != "function")
    return;
  const t = e.split("/").slice(0, -1).join("/");
  if (typeof fetch > "u")
    return;
  const a = await fetch(e).then((o) => o.json()).catch((o) => {
    throw console.error(o), new Error(`error loading "${e}"`);
  });
  return [a, a._base || t];
}
async function fetchSample(e) {
  const t = await fetch(e).then((o) => o.arrayBuffer()).then((o) => getAudioContext().decodeAudioData(o));
  let a = [];
  for (let o = 0; o < t.numberOfChannels; o++)
    a.push(t.getChannelData(o));
  return { channels: a, sampleRate: t.sampleRate };
}
async function doughsamples(e, t) {
  if (typeof e == "string") {
    const [a, o] = await fetchSampleMap(e);
    return doughsamples(a, o);
  }
  Object.entries(e).map(async ([a, o]) => {
    a !== "_base" && (o = o.map((u) => t + u), soundMap.set(a, o));
  });
}
const _workletUrl = "data:text/javascript;base64,dmFyIGh0PU9iamVjdC5kZWZpbmVQcm9wZXJ0eTt2YXIgbnQ9KHUsbSxmKT0+bSBpbiB1P2h0KHUsbSx7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Zn0pOnVbbV09Zjt2YXIgZT0odSxtLGYpPT5udCh1LHR5cGVvZiBtIT0ic3ltYm9sIj9tKyIiOm0sZik7KGZ1bmN0aW9uKCl7InVzZSBzdHJpY3QiO2NvbnN0IHU9dHlwZW9mIHNhbXBsZVJhdGU8InUiP3NhbXBsZVJhdGU6NDhlMyxtPU1hdGguUEkvdSxmPTEvdTtsZXQgVj1oPT5NYXRoLnBvdyhoLDIpO2NvbnN0IE89KGgscyx0KT0+TWF0aC5taW4oTWF0aC5tYXgoaCxzKSx0KTtmdW5jdGlvbiBfKGgpe3JldHVybiBWKGgpfWZ1bmN0aW9uIFQoaCxzLHQpe2NvbnN0IGk9TWF0aC5zaW4oKDEtdCkqLjUqTWF0aC5QSSksbj1NYXRoLnNpbih0Ki41Kk1hdGguUEkpO3JldHVybiBoKmkrcypufWNsYXNzIGd7Y29uc3RydWN0b3IoKXtlKHRoaXMsInBoYXNlIiwwKX11cGRhdGUocyl7Y29uc3QgdD1NYXRoLnNpbih0aGlzLnBoYXNlKjIqTWF0aC5QSSk7cmV0dXJuIHRoaXMucGhhc2U9KHRoaXMucGhhc2Urcy91KSUxLHR9fWNsYXNzIEl7Y29uc3RydWN0b3IoKXtlKHRoaXMsInBoYXNlIiwwKX11cGRhdGUocyl7cmV0dXJuIHRoaXMucGhhc2UrPWYqcyx0aGlzLnBoYXNlJTEqMi0xfX1mdW5jdGlvbiBNKGgscyl7cmV0dXJuIGg8cz8oaC89cyxoK2gtaCpoLTEpOmg+MS1zPyhoPShoLTEpL3MsaCpoK2graCsxKTowfWNsYXNzIFN7Y29uc3RydWN0b3Iocz17fSl7dGhpcy5waGFzZT1zLnBoYXNlPz8wfXVwZGF0ZShzKXtjb25zdCB0PXMvdTtsZXQgaT1NKHRoaXMucGhhc2UsdCksbj0yKnRoaXMucGhhc2UtMS1pO3JldHVybiB0aGlzLnBoYXNlKz10LHRoaXMucGhhc2U+MSYmKHRoaXMucGhhc2UtPTEpLG59fWZ1bmN0aW9uIHooaCxzLHQpe3JldHVybiBoPDI/MDooKG4sbCxyKT0+cioobC1uKStuKSgtcyouNSxzKi41LHQvKGgtMSkpfWZ1bmN0aW9uIEYoaCxzKXtyZXR1cm4gaCpNYXRoLnBvdygyLHMvMTIpfWNsYXNzIEx7Y29uc3RydWN0b3Iocz17fSl7dGhpcy52b2ljZXM9cy52b2ljZXM/PzUsdGhpcy5mcmVxc3ByZWFkPXMuZnJlcXNwcmVhZD8/LjIsdGhpcy5wYW5zcHJlYWQ9cy5wYW5zcHJlYWQ/Py40LHRoaXMucGhhc2U9bmV3IEZsb2F0MzJBcnJheSh0aGlzLnZvaWNlcykubWFwKCgpPT5NYXRoLnJhbmRvbSgpKX11cGRhdGUocyl7Y29uc3QgdD1NYXRoLnNxcnQoMS10aGlzLnBhbnNwcmVhZCksaT1NYXRoLnNxcnQodGhpcy5wYW5zcHJlYWQpO2xldCBuPTAsbD0wO2ZvcihsZXQgcj0wO3I8dGhpcy52b2ljZXM7cisrKXtjb25zdCBhPUYocyx6KHRoaXMudm9pY2VzLHRoaXMuZnJlcXNwcmVhZCxyKSkvdSxjPShyJjEpPT0xO2xldCBkPXQ7YyYmKGQ9aSk7bGV0IGI9TSh0aGlzLnBoYXNlW3JdLGEpLEU9Mip0aGlzLnBoYXNlW3JdLTEtYjtuPW4rRSpkLGw9bCtFKmQsdGhpcy5waGFzZVtyXSs9YSx0aGlzLnBoYXNlW3JdPjEmJih0aGlzLnBoYXNlW3JdLT0xKX1yZXR1cm4gbitsfX1jbGFzcyBre2NvbnN0cnVjdG9yKCl7ZSh0aGlzLCJwaGFzZSIsMCl9dXBkYXRlKHMpe3RoaXMucGhhc2UrPWYqcztsZXQgdD10aGlzLnBoYXNlJTE7cmV0dXJuKHQ8LjU/Mip0OjEtMioodC0uNSkpKjItMX19Y2xhc3MgcXtjb25zdHJ1Y3Rvcigpe2UodGhpcywiczAiLDApO2UodGhpcywiczEiLDApfXVwZGF0ZShzLHQsaT0wKXtpPU1hdGgubWF4KGksMCksdD1NYXRoLm1pbih0LDJlNCk7bGV0IG49MipNYXRoLnNpbih0Km0pO249TyhuLDAsMS4xNCk7Y29uc3Qgcj0xLU1hdGgucG93KC41LChpKy4xMjUpLy4xMjUpKm47cmV0dXJuIHRoaXMuczA9cip0aGlzLnMwLW4qdGhpcy5zMStuKnMsdGhpcy5zMT1yKnRoaXMuczErbip0aGlzLnMwLHRoaXMuczF9fWNsYXNzIEN7Y29uc3RydWN0b3Iocz0wKXt0aGlzLnBoYXNlPXN9c2F3KHMsdCl7bGV0IGk9KHRoaXMucGhhc2UrcyklMSxuPU0oaSx0KTtyZXR1cm4gMippLTEtbn11cGRhdGUocyx0PS41KXtjb25zdCBpPXMvdTtsZXQgbj10aGlzLnNhdygwLGkpLXRoaXMuc2F3KHQsaSk7cmV0dXJuIHRoaXMucGhhc2U9KHRoaXMucGhhc2UraSklMSxuK3QqMi0xfX1jbGFzcyBOe2NvbnN0cnVjdG9yKCl7ZSh0aGlzLCJwaGFzZSIsMCl9dXBkYXRlKHMsdD0uNSl7cmV0dXJuIHRoaXMucGhhc2UrPWYqcyx0aGlzLnBoYXNlJTE8dD8xOi0xfX1jbGFzcyBQe2NvbnN0cnVjdG9yKCl7ZSh0aGlzLCJ1cGRhdGUiLHM9Pk1hdGgucmFuZG9tKCk8cypmP01hdGgucmFuZG9tKCk6MCl9fWNsYXNzIEd7dXBkYXRlKCl7cmV0dXJuIE1hdGgucmFuZG9tKCkqMi0xfX1jbGFzcyBqe2NvbnN0cnVjdG9yKCl7dGhpcy5vdXQ9MH11cGRhdGUoKXtsZXQgcz1NYXRoLnJhbmRvbSgpKjItMTtyZXR1cm4gdGhpcy5vdXQ9KHRoaXMub3V0Ky4wMipzKS8xLjAyLHRoaXMub3V0fX1jbGFzcyBCe2NvbnN0cnVjdG9yKCl7dGhpcy5iMD0wLHRoaXMuYjE9MCx0aGlzLmIyPTAsdGhpcy5iMz0wLHRoaXMuYjQ9MCx0aGlzLmI1PTAsdGhpcy5iNj0wfXVwZGF0ZSgpe2NvbnN0IHM9TWF0aC5yYW5kb20oKSoyLTE7dGhpcy5iMD0uOTk4ODYqdGhpcy5iMCtzKi4wNTU1MTc5LHRoaXMuYjE9Ljk5MzMyKnRoaXMuYjErcyouMDc1MDc1OSx0aGlzLmIyPS45NjkqdGhpcy5iMitzKi4xNTM4NTIsdGhpcy5iMz0uODY2NSp0aGlzLmIzK3MqLjMxMDQ4NTYsdGhpcy5iND0uNTUqdGhpcy5iNCtzKi41MzI5NTIyLHRoaXMuYjU9LS43NjE2KnRoaXMuYjUtcyouMDE2ODk4O2NvbnN0IHQ9dGhpcy5iMCt0aGlzLmIxK3RoaXMuYjIrdGhpcy5iMyt0aGlzLmI0K3RoaXMuYjUrdGhpcy5iNitzKi41MzYyO3JldHVybiB0aGlzLmI2PXMqLjExNTkyNix0Ki4xMX19Y2xhc3MgJHtjb25zdHJ1Y3Rvcigpe2UodGhpcywicGhhc2UiLDEpfXVwZGF0ZShzKXt0aGlzLnBoYXNlKz1mKnM7bGV0IHQ9dGhpcy5waGFzZT49MT8xOjA7cmV0dXJuIHRoaXMucGhhc2U9dGhpcy5waGFzZSUxLHR9fWZ1bmN0aW9uIHgoaCxzLHQsaT0xKXtpZihoPD0wKXJldHVybiBzO2lmKGg+PTEpcmV0dXJuIHQ7bGV0IG47cmV0dXJuIGk9PT0wP249aDppPjA/bj1NYXRoLnBvdyhoLGkpOm49MS1NYXRoLnBvdygxLWgsLWkpLHMrKHQtcykqbn1jbGFzcyB2e2NvbnN0cnVjdG9yKHM9e30pe3RoaXMuc3RhdGU9Im9mZiIsdGhpcy5zdGFydFRpbWU9MCx0aGlzLnN0YXJ0VmFsPTAsdGhpcy5kZWNheUN1cnZlPXMuZGVjYXlDdXJ2ZT8/MX11cGRhdGUocyx0LGksbixsLHIpe3N3aXRjaCh0aGlzLnN0YXRlKXtjYXNlIm9mZiI6cmV0dXJuIHQ+MCYmKHRoaXMuc3RhdGU9ImF0dGFjayIsdGhpcy5zdGFydFRpbWU9cyx0aGlzLnN0YXJ0VmFsPTApLDA7Y2FzZSJhdHRhY2siOntsZXQgcD1zLXRoaXMuc3RhcnRUaW1lO3JldHVybiBwPmk/KHRoaXMuc3RhdGU9ImRlY2F5Iix0aGlzLnN0YXJ0VGltZT1zLDEpOngocC9pLHRoaXMuc3RhcnRWYWwsMSwxKX1jYXNlImRlY2F5Ijp7bGV0IHA9cy10aGlzLnN0YXJ0VGltZSxhPXgocC9uLDEsbCwtdGhpcy5kZWNheUN1cnZlKTtyZXR1cm4gdDw9MD8odGhpcy5zdGF0ZT0icmVsZWFzZSIsdGhpcy5zdGFydFRpbWU9cyx0aGlzLnN0YXJ0VmFsPWEsYSk6cD5uPyh0aGlzLnN0YXRlPSJzdXN0YWluIix0aGlzLnN0YXJ0VGltZT1zLGwpOmF9Y2FzZSJzdXN0YWluIjpyZXR1cm4gdDw9MCYmKHRoaXMuc3RhdGU9InJlbGVhc2UiLHRoaXMuc3RhcnRUaW1lPXMsdGhpcy5zdGFydFZhbD1sKSxsO2Nhc2UicmVsZWFzZSI6e2xldCBwPXMtdGhpcy5zdGFydFRpbWU7aWYocD5yKXJldHVybiB0aGlzLnN0YXRlPSJvZmYiLDA7bGV0IGE9eChwL3IsdGhpcy5zdGFydFZhbCwwLC10aGlzLmRlY2F5Q3VydmUpO3JldHVybiB0PjAmJih0aGlzLnN0YXRlPSJhdHRhY2siLHRoaXMuc3RhcnRUaW1lPXMsdGhpcy5zdGFydFZhbD1hKSxhfX10aHJvdyJpbnZhbGlkIGVudmVsb3BlIHN0YXRlIn19Y29uc3QgVz0xMDtjbGFzcyBSe2NvbnN0cnVjdG9yKCl7ZSh0aGlzLCJ3cml0ZUlkeCIsMCk7ZSh0aGlzLCJyZWFkSWR4IiwwKTtlKHRoaXMsImJ1ZmZlciIsbmV3IEZsb2F0MzJBcnJheShXKnUpKX13cml0ZShzLHQpe3RoaXMud3JpdGVJZHg9KHRoaXMud3JpdGVJZHgrMSkldGhpcy5idWZmZXIubGVuZ3RoLHRoaXMuYnVmZmVyW3RoaXMud3JpdGVJZHhdPXM7bGV0IGk9TWF0aC5taW4oTWF0aC5mbG9vcih1KnQpLHRoaXMuYnVmZmVyLmxlbmd0aC0xKTt0aGlzLnJlYWRJZHg9dGhpcy53cml0ZUlkeC1pLHRoaXMucmVhZElkeDwwJiYodGhpcy5yZWFkSWR4Kz10aGlzLmJ1ZmZlci5sZW5ndGgpfXVwZGF0ZShzLHQpe3JldHVybiB0aGlzLndyaXRlKHMsdCksdGhpcy5idWZmZXJbdGhpcy5yZWFkSWR4XX19Y2xhc3MgWHtjb25zdHJ1Y3Rvcigpe2UodGhpcywiZGVsYXkiLG5ldyBSKTtlKHRoaXMsIm1vZHVsYXRvciIsbmV3IGspfXVwZGF0ZShzLHQsaSxuLGwpe2NvbnN0IHI9dGhpcy5tb2R1bGF0b3IudXBkYXRlKG4pKmwscD10aGlzLmRlbGF5LnVwZGF0ZShzLGkqKDErcikpO3JldHVybiBUKHMscCx0KX19Y2xhc3MgVXtjb25zdHJ1Y3Rvcigpe2UodGhpcywiaG9sZCIsMCk7ZSh0aGlzLCJ0IiwwKX11cGRhdGUocyx0KXtyZXR1cm4gdGhpcy50KysldD09PTAmJih0aGlzLnQ9MCx0aGlzLmhvbGQ9cyksdGhpcy5ob2xkfX1jbGFzcyBZe3VwZGF0ZShzLHQpe3Q9TWF0aC5tYXgoMSx0KTtjb25zdCBpPU1hdGgucG93KDIsdC0xKTtyZXR1cm4gTWF0aC5yb3VuZChzKmkpL2l9fWNsYXNzIFp7dXBkYXRlKHMsdD0wLGk9MSl7aT1NYXRoLm1heCguMDAxLE1hdGgubWluKDEsaSkpO2NvbnN0IG49TWF0aC5leHBtMSh0KTtyZXR1cm4oMStuKSpzLygxK24qTWF0aC5hYnMocykpKml9fWNsYXNzIHd7Y29uc3RydWN0b3Iocyx0LGkpe2UodGhpcywiYnVmZmVyIik7ZSh0aGlzLCJzYW1wbGVSYXRlIik7ZSh0aGlzLCJwb3MiLDApO2UodGhpcywic2FtcGxlRnJlcSIsQSgpKTt0aGlzLmJ1ZmZlcj1zLHRoaXMuc2FtcGxlUmF0ZT10LHRoaXMuZHVyYXRpb249dGhpcy5idWZmZXIubGVuZ3RoL3RoaXMuc2FtcGxlUmF0ZSx0aGlzLnNwZWVkPXUvdGhpcy5zYW1wbGVSYXRlLGkmJih0aGlzLnNwZWVkKj10aGlzLmR1cmF0aW9uKX11cGRhdGUocyl7aWYodGhpcy5wb3M+PXRoaXMuYnVmZmVyLmxlbmd0aClyZXR1cm4gMDtjb25zdCB0PXMvdGhpcy5zYW1wbGVGcmVxKnRoaXMuc3BlZWQ7bGV0IGk9dGhpcy5idWZmZXJbTWF0aC5mbG9vcih0aGlzLnBvcyldO3JldHVybiB0aGlzLnBvcz10aGlzLnBvcyt0LGl9fWUodywic2FtcGxlcyIsbmV3IE1hcCk7Y29uc3QgeT0oaCxzPSJsaW5lYXIiLHQpPT57Y29uc3RbcixwLGEsY109aDtpZihyPT1udWxsJiZwPT1udWxsJiZhPT1udWxsJiZjPT1udWxsKXJldHVybiB0Pz9bLjAwMSwuMDAxLDEsLjAxXTtjb25zdCBkPWE/PyhyIT1udWxsJiZwPT1udWxsfHxyPT1udWxsJiZwPT1udWxsPzE6LjAwMSk7cmV0dXJuW01hdGgubWF4KHI/PzAsLjAwMSksTWF0aC5tYXgocD8/MCwuMDAxKSxNYXRoLm1pbihkLDEpLE1hdGgubWF4KGM/PzAsLjAxKV19O2xldCBEPXtzaW5lOmcsc2F3OlMsemF3Okksc2F3dG9vdGg6Uyx6YXd0b290aDpJLHN1cGVyc2F3OkwsdHJpOmssdHJpYW5nbGU6ayxwdWxzZTpDLHNxdWFyZTpDLHB1bHplOk4sZHVzdDpQLGNyYWNrbGU6UCxpbXB1bHNlOiQsd2hpdGU6Ryxicm93bjpqLHBpbms6Qn07Y29uc3QgSD17Y2hvcnVzOjAsbm90ZTo0OCxzOiJ0cmlhbmdsZSIsYmFuazoiIixnYWluOjEscG9zdGdhaW46MSx2ZWxvY2l0eToxLGRlbnNpdHk6Ii4wMyIsZnR5cGU6IjEyZGIiLGZhbmNob3I6MCxyZXNvbmFuY2U6MCxocmVzb25hbmNlOjAsYmFuZHE6MCxjaGFubmVsczpbMSwyXSxwaGFzZXJkZXB0aDouNzUsc2hhcGV2b2w6MSxkaXN0b3J0dm9sOjEsZGVsYXk6MCxieXRlQmVhdEV4cHJlc3Npb246IjAiLGRlbGF5ZmVlZGJhY2s6LjUsZGVsYXlzcGVlZDoxLGRlbGF5dGltZTouMjUsb3JiaXQ6MSxpOjEsZmZ0OjgsejoidHJpYW5nbGUiLHBhbjouNSxmbWg6MSxmbWVudjowLHNwZWVkOjEscHc6LjV9O2xldCBvPWg9PkhbaF07Y29uc3QgSj17YzowLGQ6MixlOjQsZjo1LGc6NyxhOjksYjoxMX0sSz17IiMiOjEsYjotMSxzOjEsZjotMX0sUT0oaCxzPTMpPT57dmFyIGE7bGV0W3QsaT0iIixuPSIiXT0oKGE9U3RyaW5nKGgpLm1hdGNoKC9eKFthLWdBLUddKShbI2JzZl0qKShbMC05XSopJC8pKT09bnVsbD92b2lkIDA6YS5zbGljZSgxKSl8fFtdO2lmKCF0KXRocm93IG5ldyBFcnJvcignbm90IGEgbm90ZTogIicraCsnIicpO2NvbnN0IGw9Slt0LnRvTG93ZXJDYXNlKCldLHI9KGk9PW51bGw/dm9pZCAwOmkuc3BsaXQoIiIpLnJlZHVjZSgoYyxkKT0+YytLW2RdLDApKXx8MDtyZXR1cm4oTnVtYmVyKG58fHMpKzEpKjEyK2wrcn0sdHQ9aD0+TWF0aC5wb3coMiwoaC02OSkvMTIpKjQ0MCxBPWg9PihoPWh8fG8oIm5vdGUiKSx0eXBlb2YgaD09InN0cmluZyImJihoPVEoaCwzKSksdHQoaCkpO2NsYXNzIHN0e2NvbnN0cnVjdG9yKHMpe2UodGhpcywiaWQiLDApO2UodGhpcywib3V0IixbMCwwXSk7ZSh0aGlzLCJhdHRhY2siKTtlKHRoaXMsImRlY2F5Iik7ZSh0aGlzLCJzdXN0YWluIik7ZSh0aGlzLCJyZWxlYXNlIik7ZSh0aGlzLCJfYmVnaW4iKTtlKHRoaXMsIl9kdXJhdGlvbiIpO2UodGhpcywiX3NvdW5kIik7ZSh0aGlzLCJfY2hhbm5lbHMiLDEpO2UodGhpcywiX2J1ZmZlcnMiKTtlKHRoaXMsInVuaXQiKTtlKHRoaXMsIl9wZW52Iik7ZSh0aGlzLCJwZW52Iik7ZSh0aGlzLCJwYXR0YWNrIik7ZSh0aGlzLCJwZGVjYXkiKTtlKHRoaXMsInBzdXN0YWluIik7ZSh0aGlzLCJwcmVsZWFzZSIpO2UodGhpcywidmliIik7ZSh0aGlzLCJfdmliIik7ZSh0aGlzLCJ2aWJtb2QiKTtlKHRoaXMsIl9mbSIpO2UodGhpcywiZm1oIik7ZSh0aGlzLCJmbWkiKTtlKHRoaXMsIl9mbWVudiIpO2UodGhpcywiZm1hdHRhY2siKTtlKHRoaXMsImZtZGVjYXkiKTtlKHRoaXMsImZtc3VzdGFpbiIpO2UodGhpcywiZm1yZWxlYXNlIik7ZSh0aGlzLCJfbHBlbnYiKTtlKHRoaXMsImxwZW52Iik7ZSh0aGlzLCJscGF0dGFjayIpO2UodGhpcywibHBkZWNheSIpO2UodGhpcywibHBzdXN0YWluIik7ZSh0aGlzLCJscHJlbGVhc2UiKTtlKHRoaXMsIl9ocGVudiIpO2UodGhpcywiaHBlbnYiKTtlKHRoaXMsImhwYXR0YWNrIik7ZSh0aGlzLCJocGRlY2F5Iik7ZSh0aGlzLCJocHN1c3RhaW4iKTtlKHRoaXMsImhwcmVsZWFzZSIpO2UodGhpcywiX2JwZW52Iik7ZSh0aGlzLCJicGVudiIpO2UodGhpcywiYnBhdHRhY2siKTtlKHRoaXMsImJwZGVjYXkiKTtlKHRoaXMsImJwc3VzdGFpbiIpO2UodGhpcywiYnByZWxlYXNlIik7ZSh0aGlzLCJjdXRvZmYiKTtlKHRoaXMsImhjdXRvZmYiKTtlKHRoaXMsImJhbmRmIik7ZSh0aGlzLCJjb2Fyc2UiKTtlKHRoaXMsImNydXNoIik7ZSh0aGlzLCJkaXN0b3J0Iik7ZSh0aGlzLCJmcmVxIik7ZSh0aGlzLCJub3RlIik7ZSh0aGlzLCJfbHBmIik7ZSh0aGlzLCJfaHBmIik7ZSh0aGlzLCJfYnBmIik7ZSh0aGlzLCJfY2hvcnVzIik7ZSh0aGlzLCJfY29hcnNlIik7ZSh0aGlzLCJfY3J1c2giKTtlKHRoaXMsIl9kaXN0b3J0Iik7dmFyIGksbixsLHIscCxhLGM7dGhpcy5mcmVxPz8odGhpcy5mcmVxPUEocy5ub3RlKSksdGhpcy5fYmVnaW49cy5fYmVnaW4sdGhpcy5fZHVyYXRpb249cy5fZHVyYXRpb24sdGhpcy5yZWxlYXNlPXMucmVsZWFzZT8/MDtsZXQgdD10aGlzO2lmKE9iamVjdC5hc3NpZ24odCxzKSx0LnM9dC5zPz9vKCJzIiksdC5nYWluPV8odC5nYWluPz9vKCJnYWluIikpLHQudmVsb2NpdHk9Xyh0LnZlbG9jaXR5Pz9vKCJ2ZWxvY2l0eSIpKSx0LnBvc3RnYWluPV8odC5wb3N0Z2Fpbj8/bygicG9zdGdhaW4iKSksdC5kZW5zaXR5PXQuZGVuc2l0eT8/bygiZGVuc2l0eSIpLHQuZmFuY2hvcj10LmZhbmNob3I/P28oImZhbmNob3IiKSx0LmRyaXZlPXQuZHJpdmU/Py42OSx0LnBoYXNlcmRlcHRoPXQucGhhc2VyZGVwdGg/P28oInBoYXNlcmRlcHRoIiksdC5zaGFwZXZvbD1fKHQuc2hhcGV2b2w/P28oInNoYXBldm9sIikpLHQuZGlzdG9ydHZvbD1fKHQuZGlzdG9ydHZvbD8/bygiZGlzdG9ydHZvbCIpKSx0Lmk9dC5pPz9vKCJpIiksdC5jaG9ydXM9dC5jaG9ydXM/P28oImNob3J1cyIpLHQuZmZ0PXQuZmZ0Pz9vKCJmZnQiKSx0LnBhbj10LnBhbj8/bygicGFuIiksdC5vcmJpdD10Lm9yYml0Pz9vKCJvcmJpdCIpLHQuZm1lbnY9dC5mbWVudj8/bygiZm1lbnYiKSx0LnJlc29uYW5jZT10LnJlc29uYW5jZT8/bygicmVzb25hbmNlIiksdC5ocmVzb25hbmNlPXQuaHJlc29uYW5jZT8/bygiaHJlc29uYW5jZSIpLHQuYmFuZHE9dC5iYW5kcT8/bygiYmFuZHEiKSx0LnNwZWVkPXQuc3BlZWQ/P28oInNwZWVkIiksdC5wdz10LnB3Pz9vKCJwdyIpLFt0LmF0dGFjayx0LmRlY2F5LHQuc3VzdGFpbix0LnJlbGVhc2VdPXkoW3QuYXR0YWNrLHQuZGVjYXksdC5zdXN0YWluLHQucmVsZWFzZV0pLHQuX2hvbGRFbmQ9dC5fYmVnaW4rdC5fZHVyYXRpb24sdC5fZW5kPXQuX2hvbGRFbmQrdC5yZWxlYXNlKy4wMSx0LmZtaSYmKHQucz09PSJzYXcifHx0LnM9PT0ic2F3dG9vdGgiKSYmKHQucz0iemF3IiksRFt0LnNdKXtjb25zdCBkPURbdC5zXTt0Ll9zb3VuZD1uZXcgZCx0Ll9jaGFubmVscz0xfWVsc2UgaWYody5zYW1wbGVzLmhhcyh0LnMpKXtjb25zdCBkPXcuc2FtcGxlcy5nZXQodC5zKTt0Ll9idWZmZXJzPVtdLHQuX2NoYW5uZWxzPWQuY2hhbm5lbHMubGVuZ3RoO2ZvcihsZXQgYj0wO2I8dC5fY2hhbm5lbHM7YisrKXQuX2J1ZmZlcnMucHVzaChuZXcgdyhkLmNoYW5uZWxzW2JdLGQuc2FtcGxlUmF0ZSx0LnVuaXQ9PT0iYyIpKX1lbHNlIGNvbnNvbGUud2Fybigic291bmQgbm90IGxvYWRlZCIsdC5zKTt0LnBlbnYmJih0Ll9wZW52PW5ldyB2KHtkZWNheUN1cnZlOjR9KSxbdC5wYXR0YWNrLHQucGRlY2F5LHQucHN1c3RhaW4sdC5wcmVsZWFzZV09eShbdC5wYXR0YWNrLHQucGRlY2F5LHQucHN1c3RhaW4sdC5wcmVsZWFzZV0pKSx0LnZpYiYmKHQuX3ZpYj1uZXcgZyx0LnZpYm1vZD10LnZpYm1vZD8/bygidmlibW9kIikpLHQuZm1pJiYodC5fZm09bmV3IGcsdC5mbWg9dC5mbWg/P28oImZtaCIpLHQuZm1lbnYmJih0Ll9mbWVudj1uZXcgdih7ZGVjYXlDdXJ2ZToyfSksW3QuZm1hdHRhY2ssdC5mbWRlY2F5LHQuZm1zdXN0YWluLHQuZm1yZWxlYXNlXT15KFt0LmZtYXR0YWNrLHQuZm1kZWNheSx0LmZtc3VzdGFpbix0LmZtcmVsZWFzZV0pKSksdC5fYWRzcj1uZXcgdih7ZGVjYXlDdXJ2ZToyfSksdC5kZWxheT1fKHQuZGVsYXk/P28oImRlbGF5IikpLHQuZGVsYXlmZWVkYmFjaz10LmRlbGF5ZmVlZGJhY2s/P28oImRlbGF5ZmVlZGJhY2siKSx0LmRlbGF5c3BlZWQ9dC5kZWxheXNwZWVkPz9vKCJkZWxheXNwZWVkIiksdC5kZWxheXRpbWU9dC5kZWxheXRpbWU/P28oImRlbGF5dGltZSIpLHQubHBlbnYmJih0Ll9scGVudj1uZXcgdih7ZGVjYXlDdXJ2ZTo0fSksW3QubHBhdHRhY2ssdC5scGRlY2F5LHQubHBzdXN0YWluLHQubHByZWxlYXNlXT15KFt0LmxwYXR0YWNrLHQubHBkZWNheSx0Lmxwc3VzdGFpbix0LmxwcmVsZWFzZV0pKSx0LmhwZW52JiYodC5faHBlbnY9bmV3IHYoe2RlY2F5Q3VydmU6NH0pLFt0LmhwYXR0YWNrLHQuaHBkZWNheSx0Lmhwc3VzdGFpbix0LmhwcmVsZWFzZV09eShbdC5ocGF0dGFjayx0LmhwZGVjYXksdC5ocHN1c3RhaW4sdC5ocHJlbGVhc2VdKSksdC5icGVudiYmKHQuX2JwZW52PW5ldyB2KHtkZWNheUN1cnZlOjR9KSxbdC5icGF0dGFjayx0LmJwZGVjYXksdC5icHN1c3RhaW4sdC5icHJlbGVhc2VdPXkoW3QuYnBhdHRhY2ssdC5icGRlY2F5LHQuYnBzdXN0YWluLHQuYnByZWxlYXNlXSkpLHQuX2Nob3J1cz10LmNob3J1cz9bXTpudWxsLHQuX2xwZj10LmN1dG9mZj9bXTpudWxsLHQuX2hwZj10LmhjdXRvZmY/W106bnVsbCx0Ll9icGY9dC5iYW5kZj9bXTpudWxsLHQuX2NvYXJzZT10LmNvYXJzZT9bXTpudWxsLHQuX2NydXNoPXQuY3J1c2g/W106bnVsbCx0Ll9kaXN0b3J0PXQuZGlzdG9ydD9bXTpudWxsO2ZvcihsZXQgZD0wO2Q8dGhpcy5fY2hhbm5lbHM7ZCsrKShpPXQuX2xwZik9PW51bGx8fGkucHVzaChuZXcgcSksKG49dC5faHBmKT09bnVsbHx8bi5wdXNoKG5ldyBxKSwobD10Ll9icGYpPT1udWxsfHxsLnB1c2gobmV3IHEpLChyPXQuX2Nob3J1cyk9PW51bGx8fHIucHVzaChuZXcgWCksKHA9dC5fY29hcnNlKT09bnVsbHx8cC5wdXNoKG5ldyBVKSwoYT10Ll9jcnVzaCk9PW51bGx8fGEucHVzaChuZXcgWSksKGM9dC5fZGlzdG9ydCk9PW51bGx8fGMucHVzaChuZXcgWil9dXBkYXRlKHMpe2lmKCF0aGlzLl9zb3VuZCYmIXRoaXMuX2J1ZmZlcnMpcmV0dXJuIDA7bGV0IHQ9KyhzPj10aGlzLl9iZWdpbiYmczw9dGhpcy5faG9sZEVuZCksaT10aGlzLmZyZXEqdGhpcy5zcGVlZDtpZih0aGlzLl9mbSYmdGhpcy5mbWghPT12b2lkIDAmJnRoaXMuZm1pIT09dm9pZCAwKXtsZXQgYT10aGlzLmZtaTtpZih0aGlzLl9mbWVudil7Y29uc3QgYj10aGlzLl9mbWVudi51cGRhdGUocyx0LHRoaXMuZm1hdHRhY2ssdGhpcy5mbWRlY2F5LHRoaXMuZm1zdXN0YWluLHRoaXMuZm1yZWxlYXNlKTthPXRoaXMuZm1lbnYqYiphfWNvbnN0IGM9aSp0aGlzLmZtaCxkPWMqYTtpPWkrdGhpcy5fZm0udXBkYXRlKGMpKmR9aWYodGhpcy5fdmliJiZ0aGlzLnZpYm1vZCE9PXZvaWQgMCYmKGk9aSoyKioodGhpcy5fdmliLnVwZGF0ZSh0aGlzLnZpYikqdGhpcy52aWJtb2QvMTIpKSx0aGlzLl9wZW52JiZ0aGlzLnBlbnYhPT12b2lkIDApe2NvbnN0IGE9dGhpcy5fcGVudi51cGRhdGUocyx0LHRoaXMucGF0dGFjayx0aGlzLnBkZWNheSx0aGlzLnBzdXN0YWluLHRoaXMucHJlbGVhc2UpO2k9aSthKnRoaXMucGVudn1sZXQgbj10aGlzLmN1dG9mZjtpZihuIT09dm9pZCAwJiZ0aGlzLl9scGVudil7Y29uc3QgYT10aGlzLl9scGVudi51cGRhdGUocyx0LHRoaXMubHBhdHRhY2ssdGhpcy5scGRlY2F5LHRoaXMubHBzdXN0YWluLHRoaXMubHByZWxlYXNlKTtuPXRoaXMubHBlbnYqYSpuK259bGV0IGw9dGhpcy5oY3V0b2ZmO2lmKGwhPT12b2lkIDAmJnRoaXMuX2hwZW52JiZ0aGlzLmhwZW52IT09dm9pZCAwKXtjb25zdCBhPXRoaXMuX2hwZW52LnVwZGF0ZShzLHQsdGhpcy5ocGF0dGFjayx0aGlzLmhwZGVjYXksdGhpcy5ocHN1c3RhaW4sdGhpcy5ocHJlbGVhc2UpO2w9MioqdGhpcy5ocGVudiphKmwrbH1sZXQgcj10aGlzLmJhbmRmO2lmKHIhPT12b2lkIDAmJnRoaXMuX2JwZW52JiZ0aGlzLmJwZW52IT09dm9pZCAwKXtjb25zdCBhPXRoaXMuX2JwZW52LnVwZGF0ZShzLHQsdGhpcy5icGF0dGFjayx0aGlzLmJwZGVjYXksdGhpcy5icHN1c3RhaW4sdGhpcy5icHJlbGVhc2UpO3I9MioqdGhpcy5icGVudiphKnIrcn1jb25zdCBwPXRoaXMuX2Fkc3IudXBkYXRlKHMsdCx0aGlzLmF0dGFjayx0aGlzLmRlY2F5LHRoaXMuc3VzdGFpbix0aGlzLnJlbGVhc2UpO2ZvcihsZXQgYT0wO2E8dGhpcy5fY2hhbm5lbHM7YSsrKXtpZih0aGlzLl9zb3VuZCYmdGhpcy5zPT09InB1bHNlIj90aGlzLm91dFthXT10aGlzLl9zb3VuZC51cGRhdGUoaSx0aGlzLnB3KTp0aGlzLl9zb3VuZD90aGlzLm91dFthXT10aGlzLl9zb3VuZC51cGRhdGUoaSk6dGhpcy5fYnVmZmVycyYmKHRoaXMub3V0W2FdPXRoaXMuX2J1ZmZlcnNbYV0udXBkYXRlKGkpKSx0aGlzLm91dFthXT10aGlzLm91dFthXSp0aGlzLmdhaW4qdGhpcy52ZWxvY2l0eSx0aGlzLl9jaG9ydXMpe2NvbnN0IGM9dGhpcy5fY2hvcnVzW2FdLnVwZGF0ZSh0aGlzLm91dFthXSx0aGlzLmNob3J1cywuMDMrLjA1KmEsMSwuMTEpO3RoaXMub3V0W2FdPWMrdGhpcy5vdXRbYV19dGhpcy5fbHBmJiYodGhpcy5fbHBmW2FdLnVwZGF0ZSh0aGlzLm91dFthXSxuLHRoaXMucmVzb25hbmNlKSx0aGlzLm91dFthXT10aGlzLl9scGZbYV0uczEpLHRoaXMuX2hwZiYmKHRoaXMuX2hwZlthXS51cGRhdGUodGhpcy5vdXRbYV0sbCx0aGlzLmhyZXNvbmFuY2UpLHRoaXMub3V0W2FdPXRoaXMub3V0W2FdLXRoaXMuX2hwZlthXS5zMSksdGhpcy5fYnBmJiYodGhpcy5fYnBmW2FdLnVwZGF0ZSh0aGlzLm91dFthXSxyLHRoaXMuYmFuZHEpLHRoaXMub3V0W2FdPXRoaXMuX2JwZlthXS5zMCksdGhpcy5fY29hcnNlJiYodGhpcy5vdXRbYV09dGhpcy5fY29hcnNlW2FdLnVwZGF0ZSh0aGlzLm91dFthXSx0aGlzLmNvYXJzZSkpLHRoaXMuX2NydXNoJiYodGhpcy5vdXRbYV09dGhpcy5fY3J1c2hbYV0udXBkYXRlKHRoaXMub3V0W2FdLHRoaXMuY3J1c2gpKSx0aGlzLl9kaXN0b3J0JiYodGhpcy5vdXRbYV09dGhpcy5fZGlzdG9ydFthXS51cGRhdGUodGhpcy5vdXRbYV0sdGhpcy5kaXN0b3J0LHRoaXMuZGlzdG9ydHZvbCkpLHRoaXMub3V0W2FdPXRoaXMub3V0W2FdKnAsdGhpcy5vdXRbYV09dGhpcy5vdXRbYV0qdGhpcy5wb3N0Z2Fpbix0aGlzLl9idWZmZXJzfHwodGhpcy5vdXRbYV09dGhpcy5vdXRbYV0qLjIpfWlmKHRoaXMuX2NoYW5uZWxzPT09MSYmKHRoaXMub3V0WzFdPXRoaXMub3V0WzBdKSx0aGlzLnBhbiE9PS41KXtjb25zdCBhPXRoaXMucGFuKk1hdGguUEkvMjt0aGlzLm91dFswXT10aGlzLm91dFswXSpNYXRoLmNvcyhhKSx0aGlzLm91dFsxXT10aGlzLm91dFsxXSpNYXRoLnNpbihhKX19fWNsYXNzIGV0e2NvbnN0cnVjdG9yKHM9NDhlMyx0PTApe2UodGhpcywidm9pY2VzIixbXSk7ZSh0aGlzLCJ2aWQiLDApO2UodGhpcywicSIsW10pO2UodGhpcywib3V0IixbMCwwXSk7ZSh0aGlzLCJkZWxheXNlbmQiLFswLDBdKTtlKHRoaXMsImRlbGF5dGltZSIsbygiZGVsYXl0aW1lIikpO2UodGhpcywiZGVsYXlmZWVkYmFjayIsbygiZGVsYXlmZWVkYmFjayIpKTtlKHRoaXMsImRlbGF5c3BlZWQiLG8oImRlbGF5c3BlZWQiKSk7ZSh0aGlzLCJ0IiwwKTt0aGlzLnNhbXBsZVJhdGU9cyx0aGlzLnQ9TWF0aC5mbG9vcih0KnMpLHRoaXMuX2RlbGF5TD1uZXcgUix0aGlzLl9kZWxheVI9bmV3IFJ9bG9hZFNhbXBsZShzLHQsaSl7dy5zYW1wbGVzLnNldChzLHtjaGFubmVsczp0LHNhbXBsZVJhdGU6aX0pfXNjaGVkdWxlU3Bhd24ocyl7aWYocy5fYmVnaW49PT12b2lkIDApdGhyb3cgbmV3IEVycm9yKCJbZG91Z2hdOiBzY2hlZHVsZVNwYXduIGV4cGVjdGVkIF9iZWdpbiB0byBiZSBzZXQiKTtpZihzLl9kdXJhdGlvbj09PXZvaWQgMCl0aHJvdyBuZXcgRXJyb3IoIltkb3VnaF06IHNjaGVkdWxlU3Bhd24gZXhwZWN0ZWQgX2R1cmF0aW9uIHRvIGJlIHNldCIpO3Muc2FtcGxlUmF0ZT10aGlzLnNhbXBsZVJhdGU7Y29uc3QgdD1NYXRoLmZsb29yKHMuX2JlZ2luKnRoaXMuc2FtcGxlUmF0ZSk7dGhpcy5zY2hlZHVsZSh7dGltZTp0LHR5cGU6InNwYXduIixhcmc6c30pfXNwYXduKHMpe3MuaWQ9dGhpcy52aWQrKztjb25zdCB0PW5ldyBzdChzKTt0aGlzLnZvaWNlcy5wdXNoKHQpO2NvbnN0IGk9TWF0aC5jZWlsKHQuX2VuZCp0aGlzLnNhbXBsZVJhdGUpO3RoaXMuc2NoZWR1bGUoe3RpbWU6aSx0eXBlOiJkZXNwYXduIixhcmc6dC5pZH0pfWRlc3Bhd24ocyl7dGhpcy52b2ljZXM9dGhpcy52b2ljZXMuZmlsdGVyKHQ9PnQuaWQhPT1zKX1zY2hlZHVsZShzKXtpZighdGhpcy5xLmxlbmd0aCl7dGhpcy5xLnB1c2gocyk7cmV0dXJufWxldCB0PTA7Zm9yKDt0PHRoaXMucS5sZW5ndGgmJnRoaXMucVt0XS50aW1lPHMudGltZTspdCsrO3RoaXMucS5zcGxpY2UodCwwLHMpfXVwZGF0ZSgpe2Zvcig7dGhpcy5xLmxlbmd0aD4wJiZ0aGlzLnFbMF0udGltZTw9dGhpcy50Oyl0aGlzW3RoaXMucVswXS50eXBlXSh0aGlzLnFbMF0uYXJnKSx0aGlzLnEuc2hpZnQoKTt0aGlzLm91dFswXT0wLHRoaXMub3V0WzFdPTA7Zm9yKGxldCBpPTA7aTx0aGlzLnZvaWNlcy5sZW5ndGg7aSsrKXRoaXMudm9pY2VzW2ldLnVwZGF0ZSh0aGlzLnQvdGhpcy5zYW1wbGVSYXRlKSx0aGlzLm91dFswXSs9dGhpcy52b2ljZXNbaV0ub3V0WzBdLHRoaXMub3V0WzFdKz10aGlzLnZvaWNlc1tpXS5vdXRbMV0sdGhpcy52b2ljZXNbaV0uZGVsYXkmJih0aGlzLmRlbGF5c2VuZFswXSs9dGhpcy52b2ljZXNbaV0ub3V0WzBdKnRoaXMudm9pY2VzW2ldLmRlbGF5LHRoaXMuZGVsYXlzZW5kWzFdKz10aGlzLnZvaWNlc1tpXS5vdXRbMV0qdGhpcy52b2ljZXNbaV0uZGVsYXksdGhpcy5kZWxheXRpbWU9dGhpcy52b2ljZXNbaV0uZGVsYXl0aW1lLHRoaXMuZGVsYXlzcGVlZD10aGlzLnZvaWNlc1tpXS5kZWxheXNwZWVkLHRoaXMuZGVsYXlmZWVkYmFjaz10aGlzLnZvaWNlc1tpXS5kZWxheWZlZWRiYWNrKTtjb25zdCBzPXRoaXMuX2RlbGF5TC51cGRhdGUodGhpcy5kZWxheXNlbmRbMF0sdGhpcy5kZWxheXRpbWUpLHQ9dGhpcy5fZGVsYXlSLnVwZGF0ZSh0aGlzLmRlbGF5c2VuZFsxXSx0aGlzLmRlbGF5dGltZSk7dGhpcy5kZWxheXNlbmRbMF09cyp0aGlzLmRlbGF5ZmVlZGJhY2ssdGhpcy5kZWxheXNlbmRbMV09dCp0aGlzLmRlbGF5ZmVlZGJhY2ssdGhpcy5vdXRbMF0rPXMsdGhpcy5vdXRbMV0rPXQsdGhpcy50Kyt9fWNvbnN0IGl0PShoLHMsdCk9Pk1hdGgubWluKE1hdGgubWF4KGgscyksdCk7Y2xhc3MgYXQgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3J7Y29uc3RydWN0b3IoKXtzdXBlcigpLHRoaXMuZG91Z2g9bmV3IGV0KHNhbXBsZVJhdGUsY3VycmVudFRpbWUpLHRoaXMucG9ydC5vbm1lc3NhZ2U9cz0+e3MuZGF0YS5zcGF3bj90aGlzLmRvdWdoLnNjaGVkdWxlU3Bhd24ocy5kYXRhLnNwYXduKTpzLmRhdGEuc2FtcGxlP3RoaXMuZG91Z2gubG9hZFNhbXBsZShzLmRhdGEuc2FtcGxlLHMuZGF0YS5jaGFubmVscyxzLmRhdGEuc2FtcGxlUmF0ZSk6cy5kYXRhLnNhbXBsZXM/cy5kYXRhLnNhbXBsZXMuZm9yRWFjaCgoW3QsaSxuXSk9Pnt0aGlzLmRvdWdoLmxvYWRTYW1wbGUodCxpLG4pfSk6Y29uc29sZS5sb2coInVucmVjb2duaXplZCBldmVudCB0eXBlIixzLmRhdGEpfX1wcm9jZXNzKHMsdCxpKXtpZih0aGlzLmRpc2Nvbm5lY3RlZClyZXR1cm4hMTtjb25zdCBuPXRbMF07Zm9yKGxldCBsPTA7bDxuWzBdLmxlbmd0aDtsKyspe3RoaXMuZG91Z2gudXBkYXRlKCk7Zm9yKGxldCByPTA7cjxuLmxlbmd0aDtyKyspbltyXVtsXT1pdCh0aGlzLmRvdWdoLm91dFtyXSwtMSwxKX1yZXR1cm4hMH19cmVnaXN0ZXJQcm9jZXNzb3IoImRvdWdoLXByb2Nlc3NvciIsYXQpfSkoKTsK";
const workletUrl = _workletUrl;
registerWorklet(workletUrl);
const { Pattern, logger, repl: repl$1 } = strudel;
setLogger(logger);
const hap2value = (e) => (e.ensureObjectValue(), e.value), webaudioOutput = (e, t, a, o, u) => superdough(hap2value(e), u, a, o, e.whole?.begin.valueOf());
function webaudioRepl(e = {}) {
  return e = {
    getTime: () => getAudioContext().currentTime,
    defaultOutput: webaudioOutput,
    ...e
  }, repl$1(e);
}
Pattern.prototype.dough = function() {
  return this.onTrigger(doughTrigger, 1);
};
const getDrawContext = (e = "test-canvas", t) => {
  let { contextType: a = "2d", pixelated: o = !1, pixelRatio: u = window.devicePixelRatio } = {}, l = document.querySelector("#" + e);
  if (!l) {
    l = document.createElement("canvas"), l.id = e, l.width = window.innerWidth * u, l.height = window.innerHeight * u, l.style = "pointer-events:none;width:100%;height:100%;position:fixed;top:0;left:0", o && (l.style.imageRendering = "pixelated"), document.body.prepend(l);
    let f;
    window.addEventListener("resize", () => {
      f && clearTimeout(f), f = setTimeout(() => {
        l.width = window.innerWidth * u, l.height = window.innerHeight * u;
      }, 200);
    });
  }
  return l.getContext(a, { willReadFrequently: !0 });
};
let animationFrames = {};
function stopAnimationFrame(e) {
  animationFrames[e] !== void 0 && (cancelAnimationFrame(animationFrames[e]), delete animationFrames[e]);
}
let memory = {};
Pattern$1.prototype.draw = function(e, t) {
  if (typeof window > "u")
    return this;
  let { id: a = 1, lookbehind: o = 0, lookahead: u = 0 } = t, l = Math.max(getTime(), 0);
  stopAnimationFrame(a), o = Math.abs(o), memory[a] = (memory[a] || []).filter((d) => !d.isInFuture(l));
  let f = this.queryArc(l, l + u).filter((d) => d.hasOnset());
  memory[a] = memory[a].concat(f);
  let p;
  const g = () => {
    const d = getTime(), b = d + u;
    memory[a] = memory[a].filter((S) => S.isInNearPast(o, d));
    let F = Math.max(p || b, b - 1 / 10);
    const E = this.queryArc(F, b).filter((S) => S.hasOnset());
    memory[a] = memory[a].concat(E), p = b, e(memory[a], d, b, this), animationFrames[a] = requestAnimationFrame(g);
  };
  return animationFrames[a] = requestAnimationFrame(g), this;
};
Pattern$1.prototype.onPaint = function(e) {
  return this.withState((t) => (t.controls.painters || (t.controls.painters = []), t.controls.painters.push(e), t));
};
Pattern$1.prototype.getPainters = function() {
  let e = [];
  return this.queryArc(0, 0, { painters: e }), e;
};
let theme = {
  background: "#222",
  foreground: "#75baff",
  caret: "#ffcc00",
  selection: "rgba(128, 203, 196, 0.5)",
  selectionMatch: "#036dd626",
  lineHighlight: "#00000050",
  gutterBackground: "transparent",
  gutterForeground: "#8a919966"
};
function getTheme() {
  return theme;
}
let clearColor = "#22222210";
Pattern$1.prototype.animate = function({ callback: e, sync: t = !1, smear: a = 0.5 } = {}) {
  window.frame && cancelAnimationFrame(window.frame);
  const o = getDrawContext();
  let { clientWidth: u, clientHeight: l } = o.canvas;
  u *= window.devicePixelRatio, l *= window.devicePixelRatio;
  let f = a === 0 ? "99" : Number((1 - a) * 100).toFixed(0);
  f = f.length === 1 ? `0${f}` : f, clearColor = `#200010${f}`;
  const p = (g) => {
    let d;
    g = Math.round(g), d = this.slow(1e3).queryArc(g, g), o.fillStyle = clearColor, o.fillRect(0, 0, u, l), d.forEach((b) => {
      let { x: F, y: E, w: S, h: R, s: k, r: I, angle: V = 0, fill: U = "darkseagreen" } = b.value;
      if (S *= u, R *= l, I !== void 0 && V !== void 0) {
        const H = V * 2 * Math.PI, [z, j] = [(u - S) / 2, (l - R) / 2];
        F = z + Math.cos(H) * I * z, E = j + Math.sin(H) * I * j;
      } else
        F *= u - S, E *= l - R;
      const q = { ...b.value, x: F, y: E, w: S, h: R };
      o.fillStyle = U, k === "rect" ? o.fillRect(F, E, S, R) : k === "ellipse" && (o.beginPath(), o.ellipse(F + S / 2, E + R / 2, S / 2, R / 2, 0, 0, 2 * Math.PI), o.fill()), e && e(o, q, b);
    }), window.frame = requestAnimationFrame(p);
  };
  return window.frame = requestAnimationFrame(p), silence;
};
const { x: x$1, y, w, h: h$1, angle, r, fill, smear } = createParams("x", "y", "w", "h", "angle", "r", "fill", "smear");
register("rescale", function(e, t) {
  return t.mul(x$1(e).w(e).y(e).h(e));
});
register("moveXY", function(e, t, a) {
  return a.add(x$1(e).y(t));
});
register("zoomIn", function(e, t) {
  const a = pure(1).sub(e).div(2);
  return t.rescale(e).move(a, a);
});
const scale$2 = (e, t, a) => e * (a - t) + t, getValue = (e) => {
  let { value: t } = e;
  typeof e.value != "object" && (t = { value: t });
  let { note: a, n: o, freq: u, s: l } = t;
  if (u)
    return freqToMidi$2(u);
  if (a = a ?? o, typeof a == "string")
    try {
      return noteToMidi$1(a);
    } catch {
      return 0;
    }
  return typeof a == "number" ? a : l ? "_" + l : t;
};
Pattern$1.prototype.pianoroll = function(e = {}) {
  let { cycles: t = 4, playhead: a = 0.5, overscan: o = 0, hideNegative: u = !1, ctx: l = getDrawContext(), id: f = 1 } = e, p = -t * a, g = t * (1 - a);
  const d = (b, F) => (!u || b.whole.begin >= 0) && b.isWithinTime(F + p, F + g);
  return this.draw(
    (b, F) => {
      __pianoroll({
        ...e,
        time: F,
        ctx: l,
        haps: b.filter((E) => d(E, F))
      });
    },
    {
      lookbehind: p - o,
      lookahead: g + o,
      id: f
    }
  ), this;
};
function __pianoroll({
  time: e,
  haps: t,
  cycles: a = 4,
  playhead: o = 0.5,
  flipTime: u = 0,
  flipValues: l = 0,
  hideNegative: f = !1,
  inactive: p = getTheme().foreground,
  active: g = getTheme().foreground,
  background: d = "transparent",
  smear: b = 0,
  playheadColor: F = getTheme().foreground,
  minMidi: E = 10,
  maxMidi: S = 90,
  autorange: R = 0,
  timeframe: k,
  fold: I = 1,
  vertical: V = 0,
  labels: U = !1,
  fill: q = 1,
  fillActive: H = !1,
  strokeActive: z = !0,
  stroke: j,
  hideInactive: ee = 0,
  colorizeInactive: te = 1,
  fontFamily: de,
  ctx: ie,
  id: he
} = {}) {
  const fe = ie.canvas.width, le = ie.canvas.height;
  let _e = -a * o, Me = a * (1 - o);
  he && (t = t.filter((we) => we.hasTag(he))), k && (console.warn("timeframe is deprecated! use from/to instead"), _e = 0, Me = k);
  const be = V ? le : fe, ve = V ? fe : le;
  let ge = V ? [be, 0] : [0, be];
  const Ie = Me - _e, $e = V ? [0, ve] : [ve, 0];
  let Xe = S - E + 1, ue = ve / Xe, Ee = [];
  u && ge.reverse(), l && $e.reverse();
  const { min: qe, max: Te, values: xe } = t.reduce(
    ({ min: we, max: We, values: Qe }, nt) => {
      const ze = getValue(nt);
      return {
        min: ze < we ? ze : we,
        max: ze > We ? ze : We,
        values: Qe.includes(ze) ? Qe : [...Qe, ze]
      };
    },
    { min: 1 / 0, max: -1 / 0, values: [] }
  );
  R && (E = qe, S = Te, Xe = S - E + 1), Ee = xe.sort(
    (we, We) => typeof we == "number" && typeof We == "number" ? we - We : typeof we == "number" ? 1 : String(we).localeCompare(String(We))
  ), ue = I ? ve / Ee.length : ve / Xe, ie.fillStyle = d, ie.globalAlpha = 1, b || (ie.clearRect(0, 0, fe, le), ie.fillRect(0, 0, fe, le)), t.forEach((we) => {
    const We = we.whole.begin <= e && we.endClipped > e;
    let Qe = j ?? (z && We), nt = !We && q || We && H;
    if (ee && !We)
      return;
    let ze = we.value?.color;
    g = ze || g, p = te && ze || p, ze = We ? g : p, ie.fillStyle = nt ? ze : "transparent", ie.strokeStyle = ze;
    const { velocity: At = 1, gain: Ue = 1 } = we.value || {};
    ie.globalAlpha = At * Ue;
    const rt = (we.whole.begin - (u ? Me : _e)) / Ie, at = scale$2(rt, ...ge);
    let ot = scale$2(we.duration / Ie, 0, be);
    const ft = getValue(we), ht = I ? Ee.indexOf(ft) / Ee.length : (Number(ft) - E) / Xe, _t = scale$2(ht, ...$e);
    let St = 0;
    const mt = scale$2(e / Ie, ...ge);
    let st;
    if (V ? st = [
      _t + 1 - (l ? ue : 0),
      // x
      be - mt + at + St + 1 - (u ? 0 : ot),
      // y
      ue - 2,
      // width
      ot - 2
      // height
    ] : st = [
      at - mt + St + 1 - (u ? ot : 0),
      // x
      _t + 1 - (l ? 0 : ue),
      // y
      ot - 2,
      // widith
      ue - 2
      // height
    ], Qe && ie.strokeRect(...st), nt && ie.fillRect(...st), U) {
      const Pt = we.value.note ?? we.value.s + (we.value.n ? `:${we.value.n}` : ""), { label: ke, activeLabel: Je } = we.value, Ke = (We && Je || ke) ?? Pt;
      let Ne = V ? ot : ue * 0.75;
      ie.font = `${Ne}px ${de || "monospace"}`, ie.fillStyle = /* isActive &&  */
      nt ? "black" : ze, ie.textBaseline = "top", ie.fillText(Ke, ...st);
    }
  }), ie.globalAlpha = 1;
  const Ve = scale$2(-_e / Ie, ...ge);
  return ie.strokeStyle = F, ie.beginPath(), V ? (ie.moveTo(0, Ve), ie.lineTo(ve, Ve)) : (ie.moveTo(Ve, 0), ie.lineTo(Ve, ve)), ie.stroke(), this;
}
function getDrawOptions(e, t = {}) {
  let [a, o] = e;
  a = Math.abs(a);
  const u = o + a, l = u !== 0 ? a / u : 0;
  return { fold: 1, ...t, cycles: u, playhead: l };
}
const getPunchcardPainter = (e = {}) => (t, a, o, u) => __pianoroll({ ctx: t, time: a, haps: o, ...getDrawOptions(u, e) });
Pattern$1.prototype.punchcard = function(e) {
  return this.onPaint(getPunchcardPainter(e));
};
Pattern$1.prototype.wordfall = function(e) {
  return this.punchcard({ vertical: 1, labels: 1, stroke: 0, fillActive: 1, active: "white", ...e });
};
function fromPolar(e, t, a, o) {
  const u = (e - 90) * Math.PI / 180;
  return [a + Math.cos(u) * t, o + Math.sin(u) * t];
}
const xyOnSpiral = (e, t, a, o, u = 0) => fromPolar((e + u) * 360, t * e, a, o);
function spiralSegment(e) {
  let {
    ctx: t,
    from: a = 0,
    to: o = 3,
    margin: u = 50,
    cx: l = 100,
    cy: f = 100,
    rotate: p = 0,
    thickness: g = u / 2,
    color: d = getTheme().foreground,
    cap: b = "round",
    stretch: F = 1,
    fromOpacity: E = 1,
    toOpacity: S = 1
  } = e;
  a *= F, o *= F, p *= F, t.lineWidth = g, t.lineCap = b, t.strokeStyle = d, t.globalAlpha = E, t.beginPath();
  let [R, k] = xyOnSpiral(a, u, l, f, p);
  t.moveTo(R, k);
  const I = 1 / 60;
  let V = a;
  for (; V <= o; ) {
    const [U, q] = xyOnSpiral(V, u, l, f, p);
    t.globalAlpha = (V - a) / (o - a) * S, t.lineTo(U, q), V += I;
  }
  t.stroke();
}
function drawSpiral(e) {
  let {
    stretch: t = 1,
    size: a = 80,
    thickness: o = a / 2,
    cap: u = "butt",
    // round butt squar,
    inset: l = 3,
    // start angl,
    playheadColor: f = "#ffffff",
    playheadLength: p = 0.02,
    playheadThickness: g = o,
    padding: d = 0,
    steady: b = 1,
    activeColor: F = getTheme().foreground,
    inactiveColor: E = getTheme().gutterForeground,
    colorizeInactive: S = 0,
    fade: R = !0,
    // logSpiral = true,
    ctx: k,
    time: I,
    haps: V,
    drawTime: U,
    id: q
  } = e;
  q && (V = V.filter((fe) => fe.hasTag(q)));
  const [H, z] = [k.canvas.width, k.canvas.height];
  k.clearRect(0, 0, H * 2, z * 2);
  const [j, ee] = [H / 2, z / 2], te = {
    margin: a / t,
    cx: j,
    cy: ee,
    stretch: t,
    cap: u,
    thickness: o
  }, de = {
    ...te,
    thickness: g,
    from: l - p,
    to: l,
    color: f
  }, [ie] = U, he = b * I;
  V.forEach((fe) => {
    const le = fe.whole.begin <= I && fe.endClipped > I, _e = fe.whole.begin - I + l, Me = fe.endClipped - I + l - d, be = fe.value?.color || F, ve = S || le ? be : E, ge = R ? 1 - Math.abs((fe.whole.begin - I) / ie) : 1;
    spiralSegment({
      ctx: k,
      ...te,
      from: _e,
      to: Me,
      rotate: he,
      color: ve,
      fromOpacity: ge,
      toOpacity: ge
    });
  }), spiralSegment({
    ctx: k,
    ...de,
    rotate: he
  });
}
Pattern$1.prototype.spiral = function(e = {}) {
  return this.onPaint((t, a, o, u) => drawSpiral({ ctx: t, time: a, haps: o, drawTime: u, ...e }));
};
const c = midiToFreq$2(36), circlePos = (e, t, a, o) => {
  o = o * Math.PI * 2;
  const u = Math.sin(o) * a + e, l = Math.cos(o) * a + t;
  return [u, l];
}, freq2angle = (e, t) => 0.5 - Math.log2(e / t) % 1;
function pitchwheel({
  haps: e,
  ctx: t,
  id: a,
  hapcircles: o = 1,
  circle: u = 0,
  edo: l = 12,
  root: f = c,
  thickness: p = 3,
  hapRadius: g = 6,
  mode: d = "flake",
  margin: b = 10
} = {}) {
  const F = d === "polygon", E = d === "flake", S = t.canvas.width, R = t.canvas.height;
  t.clearRect(0, 0, S, R);
  const k = getTheme().foreground, V = Math.min(S, R) / 2 - p / 2 - g - b, U = S / 2, q = R / 2;
  a && (e = e.filter((z) => z.hasTag(a))), t.strokeStyle = k, t.fillStyle = k, t.globalAlpha = 1, t.lineWidth = p, u && (t.beginPath(), t.arc(U, q, V, 0, 2 * Math.PI), t.stroke()), l && (Array.from({ length: l }, (z, j) => {
    const ee = freq2angle(f * Math.pow(2, j / l), f), [te, de] = circlePos(U, q, V, ee);
    t.beginPath(), t.arc(te, de, g, 0, 2 * Math.PI), t.fill();
  }), t.stroke());
  let H = [];
  t.lineWidth = g, e.forEach((z) => {
    let j;
    try {
      j = getFrequency(z);
    } catch {
      return;
    }
    const ee = freq2angle(j, f), [te, de] = circlePos(U, q, V, ee), ie = z.value.color || k;
    t.strokeStyle = ie, t.fillStyle = ie;
    const { velocity: he = 1, gain: fe = 1 } = z.value || {}, le = he * fe;
    t.globalAlpha = le, H.push([te, de, ee, ie, le]), t.beginPath(), o && (t.moveTo(te + g, de), t.arc(te, de, g, 0, 2 * Math.PI), t.fill()), E && (t.moveTo(U, q), t.lineTo(te, de)), t.stroke();
  }), t.strokeStyle = k, t.globalAlpha = 1, F && H.length && (H = H.sort((z, j) => z[2] - j[2]), t.beginPath(), t.moveTo(H[0][0], H[0][1]), H.forEach(([z, j, ee, te, de]) => {
    t.strokeStyle = te, t.globalAlpha = de, t.lineTo(z, j);
  }), t.lineTo(H[0][0], H[0][1]), t.stroke());
}
Pattern$1.prototype.pitchwheel = function(e = {}) {
  let { ctx: t = getDrawContext(), id: a = 1 } = e;
  return this.tag(a).onPaint(
    (o, u, l) => pitchwheel({
      ...e,
      time: u,
      ctx: t,
      haps: l.filter((f) => f.isActive(u)),
      id: a
    })
  );
};
function drawTimeScope(e, {
  align: t = !0,
  color: a = "white",
  thickness: o = 3,
  scale: u = 0.25,
  pos: l = 0.75,
  trigger: f = 0,
  ctx: p = getDrawContext(),
  id: g = 1
} = {}) {
  p.lineWidth = o, p.strokeStyle = a;
  let d = p.canvas;
  if (!e) {
    p.beginPath();
    let k = l * d.height;
    p.moveTo(0, k), p.lineTo(d.width, k), p.stroke();
    return;
  }
  const b = getAnalyzerData("time", g);
  p.beginPath();
  const F = e.frequencyBinCount;
  let E = t ? Array.from(b).findIndex((k, I, V) => I && V[I - 1] > -f && k <= -f) : 0;
  E = Math.max(E, 0);
  const S = d.width * 1 / F;
  let R = 0;
  for (let k = E; k < F; k++) {
    const I = b[k] + 1, V = (l - u * (I - 1)) * d.height;
    k === 0 ? p.moveTo(R, V) : p.lineTo(R, V), R += S;
  }
  p.stroke();
}
function drawFrequencyScope(e, { color: t = "white", scale: a = 0.25, pos: o = 0.75, lean: u = 0.5, min: l = -150, max: f = 0, ctx: p = getDrawContext(), id: g = 1 } = {}) {
  if (!e) {
    p.beginPath();
    let R = o * b.height;
    p.moveTo(0, R), p.lineTo(b.width, R), p.stroke();
    return;
  }
  const d = getAnalyzerData("frequency", g), b = p.canvas;
  p.fillStyle = t;
  const F = e.frequencyBinCount, E = b.width * 1 / F;
  let S = 0;
  for (let R = 0; R < F; R++) {
    const I = clamp$1((d[R] - l) / (f - l), 0, 1) * a, V = I * b.height, U = (o - I * u) * b.height;
    p.fillRect(S, U, Math.max(E, 1), V), S += E;
  }
}
function clearScreen(e = 0, t = "0,0,0", a = getDrawContext()) {
  e ? (a.fillStyle = `rgba(${t},${1 - e})`, a.fillRect(0, 0, a.canvas.width, a.canvas.height)) : a.clearRect(0, 0, a.canvas.width, a.canvas.height);
}
Pattern$1.prototype.fscope = function(e = {}) {
  let t = e.id ?? 1;
  return this.analyze(t).draw(
    () => {
      clearScreen(e.smear, "0,0,0", e.ctx), analysers[t] && drawFrequencyScope(analysers[t], e);
    },
    { id: t }
  );
};
Pattern$1.prototype.tscope = function(e = {}) {
  let t = e.id ?? 1;
  return this.analyze(t).draw(
    (a) => {
      e.color = a[0]?.value?.color || getTheme().foreground, e.color, clearScreen(e.smear, "0,0,0", e.ctx), drawTimeScope(analysers[t], e);
    },
    { id: t }
  );
};
Pattern$1.prototype.scope = Pattern$1.prototype.tscope;
let latestColor = {};
Pattern$1.prototype.spectrum = function(e = {}) {
  let t = e.id ?? 1;
  return this.analyze(t).draw(
    (a) => {
      e.color = a[0]?.value?.color || latestColor[t] || getTheme().foreground, latestColor[t] = e.color, drawSpectrum(analysers[t], e);
    },
    { id: t }
  );
};
Pattern$1.prototype.scope = Pattern$1.prototype.tscope;
const lastFrames = /* @__PURE__ */ new Map();
function drawSpectrum(e, { thickness: t = 3, speed: a = 1, min: o = -80, max: u = 0, ctx: l = getDrawContext(), id: f = 1, color: p } = {}) {
  if (l.lineWidth = t, l.strokeStyle = p, !e)
    return;
  const g = a, d = getAnalyzerData("frequency", f), b = l.canvas;
  l.fillStyle = p;
  const F = e.frequencyBinCount;
  let E = lastFrames.get(f) || l.getImageData(0, 0, b.width, b.height);
  lastFrames.set(f, E), l.clearRect(0, 0, l.canvas.width, l.canvas.height), l.putImageData(E, -g, 0);
  let S = b.width - a;
  for (let R = 0; R < F; R++) {
    const k = clamp$1((d[R] - o) / (u - o), 0, 1);
    l.globalAlpha = k;
    const I = Math.log(R + 1) / Math.log(F) * b.height;
    l.fillRect(S, b.height - I, g, 2);
  }
  lastFrames.set(f, l.getImageData(0, 0, b.width, b.height));
}
const index$7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DEFAULT_MAX_POLYPHONY,
  Warpmode,
  aliasBank,
  get analysers() {
    return analysers;
  },
  get analysersData() {
    return analysersData;
  },
  applyFM,
  applyGainCurve,
  applyParameterModulators,
  connectToDestination,
  createFilter,
  destroyAudioWorkletNode,
  distortionAlgorithms,
  dough,
  doughTrigger,
  doughsamples,
  drawFrequencyScope,
  drawTimeScope,
  drywet,
  dspWorklet,
  effectSend,
  errorLogger,
  gainNode,
  getADSRValues,
  getAnalyserById,
  getAnalyzerData,
  getAudioContext,
  getAudioContextCurrentTime,
  getAudioDevices,
  getCachedBuffer,
  getCompressor,
  getDefaultValue,
  getDistortion,
  getDistortionAlgorithm,
  getFrequencyFromValue,
  getLfo,
  getLoadedBuffer,
  getOscillator,
  getParamADSR,
  getParamLfo,
  getPitchEnvelope,
  getSampleBuffer,
  getSampleBufferSource,
  getSampleInfo,
  getSound,
  getVibratoOscillator,
  getWorklet,
  getZZFX,
  initAudio,
  initAudioOnFirstClick,
  loadBuffer: loadBuffer$1,
  logger: logger$1,
  noises,
  onTriggerSample,
  onTriggerSynth,
  processSampleMap,
  registerSampleSource,
  registerSamplesPrefix,
  registerSound,
  registerSynthSounds,
  registerWaveTable,
  registerWorklet,
  registerZZFXSounds,
  resetDefaultValues,
  resetDefaults,
  resetGlobalEffects,
  resetLoadedSounds,
  reverseBuffer,
  samples,
  scheduleAtTime,
  setDefault,
  setDefaultAudioContext,
  setDefaultValue,
  setDefaultValues,
  setGainCurve,
  setLogger,
  setMaxPolyphony,
  setMultiChannelOrbits,
  setVersionDefaults,
  soundAlias,
  soundMap: soundMap$1,
  superdough,
  superdoughTrigger,
  tables,
  waveformN,
  webAudioTimeout,
  webaudioOutput,
  webaudioRepl
}, Symbol.toStringTag, { value: "Module" })), gm = {
  gm_piano: [
    //'gm_acoustic_piano': [
    // Acoustic Grand Piano: Piano
    "0000_JCLive_sf2_file",
    "0000_FluidR3_GM_sf2_file",
    "0000_Aspirin_sf2_file",
    "0000_Chaos_sf2_file",
    "0000_GeneralUserGS_sf2_file",
    //0000_SBLive_sf2
    //0000_SoundBlasterOld_sf2
    "0001_FluidR3_GM_sf2_file",
    "0001_GeneralUserGS_sf2_file",
    //],
    //'gm_bright_acoustic_piano': [
    // Bright Acoustic Piano: Piano
    "0010_Aspirin_sf2_file",
    "0010_Chaos_sf2_file",
    "0010_FluidR3_GM_sf2_file",
    "0010_GeneralUserGS_sf2_file",
    "0010_JCLive_sf2_file",
    //0010_SBLive_sf2
    //0010_SoundBlasterOld_sf2
    "0011_Aspirin_sf2_file",
    "0011_FluidR3_GM_sf2_file",
    "0011_GeneralUserGS_sf2_file",
    "0012_GeneralUserGS_sf2_file",
    //],
    //'gm_electric_grand_piano': [
    // Electric Grand Piano: Piano
    "0020_Aspirin_sf2_file",
    "0020_Chaos_sf2_file",
    "0020_FluidR3_GM_sf2_file",
    "0020_GeneralUserGS_sf2_file",
    "0020_JCLive_sf2_file",
    //0020_SBLive_sf2
    //0020_SoundBlasterOld_sf2
    "0021_Aspirin_sf2_file",
    "0021_GeneralUserGS_sf2_file",
    // ?
    "0022_Aspirin_sf2_file",
    //],
    //'gm_honky_tonk_piano': [
    // Honky_tonk Piano: Piano
    "0030_Aspirin_sf2_file",
    "0030_Chaos_sf2_file",
    "0030_FluidR3_GM_sf2_file",
    "0030_GeneralUserGS_sf2_file",
    "0030_JCLive_sf2_file",
    //0030_SBLive_sf2
    //0030_SoundBlasterOld_sf2
    "0031_Aspirin_sf2_file",
    "0031_FluidR3_GM_sf2_file",
    "0031_GeneralUserGS_sf2_file"
    //0031_SoundBlasterOld_sf2 // pianos until her
  ],
  gm_epiano1: [
    // Electric Piano 1: Piano
    "0040_JCLive_sf2_file",
    "0040_FluidR3_GM_sf2_file",
    "0040_Aspirin_sf2_file",
    "0040_Chaos_sf2_file",
    "0040_GeneralUserGS_sf2_file",
    //0040_SBLive_sf2 // ?
    //0040_SoundBlasterOld_sf2 // ?
    "0041_FluidR3_GM_sf2_file",
    "0041_GeneralUserGS_sf2_file",
    //0041_SoundBlasterOld_sf2 // ?
    "0042_GeneralUserGS_sf2_file",
    "0043_GeneralUserGS_sf2_file",
    "0044_GeneralUserGS_sf2_file",
    //0045_GeneralUserGS_sf2_file // ?
    "0046_GeneralUserGS_sf2_file"
  ],
  gm_epiano2: [
    // Electric Piano 2: Piano
    "0050_JCLive_sf2_file",
    "0050_FluidR3_GM_sf2_file",
    "0050_Aspirin_sf2_file",
    "0050_Chaos_sf2_file",
    // ?
    "0050_GeneralUserGS_sf2_file",
    // cont
    //0050_SBLive_sf2 // ?
    //0050_SoundBlasterOld_sf2 // ?
    "0051_FluidR3_GM_sf2_file",
    "0051_GeneralUserGS_sf2_file",
    //0052_GeneralUserGS_sf2_file // ?
    "0053_GeneralUserGS_sf2_file",
    // normal piano...
    "0054_GeneralUserGS_sf2_file"
  ],
  gm_harpsichord: [
    // Harpsichord: Piano
    "0060_JCLive_sf2_file",
    "0060_FluidR3_GM_sf2_file",
    "0060_Aspirin_sf2_file",
    "0060_Chaos_sf2_file",
    "0060_GeneralUserGS_sf2_file",
    //0060_SBLive_sf2
    //0060_SoundBlasterOld_sf2
    "0061_Aspirin_sf2_file",
    "0061_GeneralUserGS_sf2_file",
    //0061_SoundBlasterOld_sf2
    "0062_GeneralUserGS_sf2_file"
  ],
  gm_clavinet: [
    // Clavinet: Piano
    "0070_JCLive_sf2_file",
    "0070_FluidR3_GM_sf2_file",
    "0070_Aspirin_sf2_file",
    "0070_Chaos_sf2_file"
    // 0070_GeneralUserGS_sf2_file // half broken
    //0070_SBLive_sf2
    //0070_SoundBlasterOld_sf2
    // 0071_GeneralUserGS_sf2_file // half broke
  ],
  gm_celesta: [
    // Celesta: Chromatic Percussion
    "0080_JCLive_sf2_file",
    "0080_Aspirin_sf2_file",
    "0080_Chaos_sf2_file",
    "0080_FluidR3_GM_sf2_file",
    "0080_GeneralUserGS_sf2_file",
    //0080_SBLive_sf2
    //0080_SoundBlasterOld_sf2
    "0081_FluidR3_GM_sf2_file"
    // 0081_GeneralUserGS_sf2_file // weird detuned
    //0081_SoundBlasterOld_sf
  ],
  gm_glockenspiel: [
    // Glockenspiel: Chromatic Percussion
    "0090_JCLive_sf2_file",
    "0090_Aspirin_sf2_file",
    "0090_Chaos_sf2_file",
    "0090_FluidR3_GM_sf2_file",
    "0090_GeneralUserGS_sf2_file"
    //0090_SBLive_sf2
    //0090_SoundBlasterOld_sf2
    //0091_SoundBlasterOld_sf
  ],
  gm_music_box: [
    // Music Box: Chromatic Percussion
    "0100_JCLive_sf2_file",
    "0100_Aspirin_sf2_file",
    "0100_Chaos_sf2_file",
    "0100_FluidR3_GM_sf2_file",
    "0100_GeneralUserGS_sf2_file"
    //0100_SBLive_sf2
    //0100_SoundBlasterOld_sf2
    // 0101_GeneralUserGS_sf2_file // weird detuned
    //0101_SoundBlasterOld_sf
  ],
  gm_vibraphone: [
    // Vibraphone: Chromatic Percussion
    "0110_JCLive_sf2_file",
    "0110_Aspirin_sf2_file",
    "0110_Chaos_sf2_file",
    "0110_FluidR3_GM_sf2_file",
    "0110_GeneralUserGS_sf2_file",
    //0110_SBLive_sf2
    //0110_SoundBlasterOld_sf2
    "0111_FluidR3_GM_sf2_file"
  ],
  gm_marimba: [
    // Marimba: Chromatic Percussion
    "0120_JCLive_sf2_file",
    "0120_Aspirin_sf2_file",
    "0120_Chaos_sf2_file",
    "0120_FluidR3_GM_sf2_file",
    "0120_GeneralUserGS_sf2_file",
    //0120_SBLive_sf2
    //0120_SoundBlasterOld_sf2
    "0121_FluidR3_GM_sf2_file",
    "0121_GeneralUserGS_sf2_file"
  ],
  gm_xylophone: [
    // Xylophone: Chromatic Percussion
    "0130_JCLive_sf2_file",
    "0130_Aspirin_sf2_file",
    "0130_Chaos_sf2_file",
    "0130_FluidR3_GM_sf2_file",
    "0130_GeneralUserGS_sf2_file",
    //0130_SBLive_sf2
    //0130_SoundBlasterOld_sf2
    "0131_FluidR3_GM_sf2_file"
  ],
  gm_tubular_bells: [
    // Tubular Bells: Chromatic Percussion
    "0140_JCLive_sf2_file",
    "0140_Aspirin_sf2_file",
    // 0140_Chaos_sf2_file // same as aspirin?
    "0140_FluidR3_GM_sf2_file",
    "0140_GeneralUserGS_sf2_file",
    //0140_SBLive_sf2
    //0140_SoundBlasterOld_sf2
    "0141_FluidR3_GM_sf2_file",
    //0141_GeneralUserGS_sf2_file
    "0142_GeneralUserGS_sf2_file"
    // 0143_GeneralUserGS_sf2_file // bugg
  ],
  gm_dulcimer: [
    // Dulcimer: Chromatic Percussion
    "0150_Aspirin_sf2_file",
    "0150_Chaos_sf2_file",
    "0150_FluidR3_GM_sf2_file",
    "0150_GeneralUserGS_sf2_file",
    // 0150_JCLive_sf2_file // detuned???
    //0150_SBLive_sf2
    //0150_SoundBlasterOld_sf2
    "0151_FluidR3_GM_sf2_file"
  ],
  gm_drawbar_organ: [
    // Drawbar Organ: Organ
    "0160_JCLive_sf2_file",
    "0160_Aspirin_sf2_file",
    "0160_Chaos_sf2_file",
    "0160_FluidR3_GM_sf2_file",
    "0160_GeneralUserGS_sf2_file",
    //0160_SBLive_sf2
    //0160_SoundBlasterOld_sf2
    "0161_Aspirin_sf2_file",
    "0161_FluidR3_GM_sf2_file"
    //0161_SoundBlasterOld_sf
  ],
  gm_percussive_organ: [
    // Percussive Organ: Organ
    "0170_JCLive_sf2_file",
    "0170_Aspirin_sf2_file",
    "0170_Chaos_sf2_file",
    "0170_FluidR3_GM_sf2_file",
    // 0170_GeneralUserGS_sf2_file // repitched
    //0170_SBLive_sf2
    //0170_SoundBlasterOld_sf2
    "0171_FluidR3_GM_sf2_file",
    // 0171_GeneralUserGS_sf2_file  // repitched
    "0172_FluidR3_GM_sf2_file"
  ],
  gm_rock_organ: [
    // Rock Organ: Organ
    "0180_JCLive_sf2_file",
    "0180_Aspirin_sf2_file",
    "0180_Chaos_sf2_file",
    "0180_FluidR3_GM_sf2_file",
    "0180_GeneralUserGS_sf2_file"
    //0180_SBLive_sf2
    //0180_SoundBlasterOld_sf2
    //0181_Aspirin_sf2_file // flute
    //0181_GeneralUserGS_sf2_file // marimbalike
    //0181_SoundBlasterOld_sf
  ],
  gm_church_organ: [
    // Church Organ: Organ
    "0190_JCLive_sf2_file",
    "0190_Aspirin_sf2_file",
    "0190_Chaos_sf2_file",
    "0190_FluidR3_GM_sf2_file",
    "0190_GeneralUserGS_sf2_file"
    //0190_SBLive_sf2
    //0190_SoundBlasterOld_sf2
    //0191_Aspirin_sf2_file // string??
    //0191_GeneralUserGS_sf2_file // weird organ
    //0191_SoundBlasterOld_sf
  ],
  gm_reed_organ: [
    // Reed Organ: Organ
    "0200_JCLive_sf2_file",
    "0200_Aspirin_sf2_file",
    "0200_Chaos_sf2_file",
    "0200_FluidR3_GM_sf2_file",
    "0200_GeneralUserGS_sf2_file",
    //0200_SBLive_sf2
    //0200_SoundBlasterOld_sf2
    "0201_Aspirin_sf2_file",
    "0201_FluidR3_GM_sf2_file",
    "0201_GeneralUserGS_sf2_file"
    //0201_SoundBlasterOld_sf2
    //0210_Aspirin_sf2_file // buggy
    //0210_Chaos_sf2_file // bugg
  ],
  gm_accordion: [
    // Accordion: Organ
    "0210_JCLive_sf2_file",
    "0210_FluidR3_GM_sf2_file",
    "0210_GeneralUserGS_sf2_file",
    //0210_SBLive_sf2
    //0210_SoundBlasterOld_sf2
    "0211_Aspirin_sf2_file",
    "0211_FluidR3_GM_sf2_file",
    "0211_GeneralUserGS_sf2_file",
    //0211_SoundBlasterOld_sf2
    "0212_GeneralUserGS_sf2_file"
  ],
  gm_harmonica: [
    // Harmonica: Organ
    "0220_FluidR3_GM_sf2_file",
    "0220_JCLive_sf2_file",
    "0220_Aspirin_sf2_file",
    "0220_Chaos_sf2_file",
    "0220_GeneralUserGS_sf2_file",
    //0220_SBLive_sf2
    //0220_SoundBlasterOld_sf2
    "0221_FluidR3_GM_sf2_file"
  ],
  gm_bandoneon: [
    // Tango Accordion: Organ
    "0230_Aspirin_sf2_file",
    "0230_JCLive_sf2_file",
    "0230_Chaos_sf2_file",
    "0230_FluidR3_GM_sf2_file",
    "0230_GeneralUserGS_sf2_file",
    //0230_SBLive_sf2
    //0230_SoundBlasterOld_sf2
    "0231_FluidR3_GM_sf2_file",
    "0231_GeneralUserGS_sf2_file",
    "0231_JCLive_sf2_file",
    //0231_SoundBlasterOld_sf2
    "0232_FluidR3_GM_sf2_file",
    "0233_FluidR3_GM_sf2_file"
  ],
  gm_acoustic_guitar_nylon: [
    // Acoustic Guitar (nylon): Guitar
    "0240_JCLive_sf2_file",
    "0240_Aspirin_sf2_file",
    "0240_Chaos_sf2_file",
    "0240_FluidR3_GM_sf2_file",
    "0240_GeneralUserGS_sf2_file",
    "0240_LK_Godin_Nylon_SF2_file",
    //0240_SBLive_sf2
    //0240_SoundBlasterOld_sf2
    // 0241_GeneralUserGS_sf2_file // organ like
    "0241_JCLive_sf2_file",
    "0242_JCLive_sf2_file",
    "0243_JCLive_sf2_file"
  ],
  gm_acoustic_guitar_steel: [
    // Acoustic Guitar (steel): Guitar
    "0253_Acoustic_Guitar_sf2_file",
    "0250_Aspirin_sf2_file",
    "0250_Chaos_sf2_file",
    "0250_FluidR3_GM_sf2_file",
    "0250_GeneralUserGS_sf2_file",
    // 0250_JCLive_sf2_file // detuned
    "0250_LK_AcousticSteel_SF2_file",
    //0250_SBLive_sf2
    //0250_SoundBlasterOld_sf2
    //0251_Acoustic_Guitar_sf2_file // detuned?
    // 0251_GeneralUserGS_sf2_file // broken: missing pitches
    // 0252_Acoustic_Guitar_sf2_file // detuned..
    // 0252_GeneralUserGS_sf2_file // broken: missing pitches
    "0253_Acoustic_Guitar_sf2_file",
    "0253_GeneralUserGS_sf2_file",
    "0254_Acoustic_Guitar_sf2_file",
    "0254_GeneralUserGS_sf2_file"
    //0255_GeneralUserGS_sf2_file // no guitar.
  ],
  gm_electric_guitar_jazz: [
    // Electric Guitar (jazz): Guitar
    "0260_JCLive_sf2_file",
    "0260_Aspirin_sf2_file",
    "0260_Chaos_sf2_file",
    "0260_FluidR3_GM_sf2_file",
    "0260_GeneralUserGS_sf2_file",
    //0260_SBLive_sf2
    //0260_SoundBlasterOld_sf2
    "0260_Stratocaster_sf2_file",
    "0261_GeneralUserGS_sf2_file",
    //0261_SoundBlasterOld_sf2
    "0261_Stratocaster_sf2_file",
    "0262_Stratocaster_sf2_file"
  ],
  gm_electric_guitar_clean: [
    // Electric Guitar (clean): Guitar
    "0270_Aspirin_sf2_file",
    "0270_Chaos_sf2_file",
    "0270_FluidR3_GM_sf2_file",
    "0270_GeneralUserGS_sf2_file",
    //0270_Gibson_Les_Paul_sf2_file // detuned
    // 0270_JCLive_sf2_file // broken: missing notes
    "0270_SBAWE32_sf2_file",
    //0270_SBLive_sf2
    //0270_SoundBlasterOld_sf2
    "0270_Stratocaster_sf2_file",
    "0271_GeneralUserGS_sf2_file",
    "0271_Stratocaster_sf2_file",
    "0272_Stratocaster_sf2_file"
  ],
  gm_electric_guitar_muted: [
    // Electric Guitar (muted): Guitar
    "0280_Aspirin_sf2_file",
    "0280_Chaos_sf2_file",
    // 0280_FluidR3_GM_sf2_file // broken: wrong notes
    "0280_GeneralUserGS_sf2_file",
    "0280_JCLive_sf2_file",
    //0280_LesPaul_sf2 // missing
    "0280_LesPaul_sf2_file",
    "0280_SBAWE32_sf2_file",
    //0280_SBLive_sf2
    //0280_SoundBlasterOld_sf2
    "0281_Aspirin_sf2_file",
    "0281_FluidR3_GM_sf2_file",
    "0281_GeneralUserGS_sf2_file",
    "0282_FluidR3_GM_sf2_file"
    // 0282_GeneralUserGS_sf2_file // broken: missing notes
    // 0283_GeneralUserGS_sf2_file // missin
  ],
  gm_overdriven_guitar: [
    // Overdriven Guitar: Guitar
    "0290_FluidR3_GM_sf2_file",
    "0290_Aspirin_sf2_file",
    "0290_Chaos_sf2_file",
    "0290_GeneralUserGS_sf2_file",
    //0290_JCLive_sf2_file // detuned....
    //0290_LesPaul_sf2 // broken
    "0290_LesPaul_sf2_file",
    "0290_SBAWE32_sf2_file",
    //0290_SBLive_sf2
    //0290_SoundBlasterOld_sf2
    // 0291_Aspirin_sf2_file // broken
    // 0291_LesPaul_sf2 // broken
    "0291_LesPaul_sf2_file",
    "0291_SBAWE32_sf2_file",
    //0291_SoundBlasterOld_sf2
    "0292_Aspirin_sf2_file",
    // 0292_LesPaul_sf2 // broken
    "0292_LesPaul_sf2_file"
  ],
  gm_distortion_guitar: [
    // Distortion Guitar: Guitar
    "0300_FluidR3_GM_sf2_file",
    "0300_Aspirin_sf2_file",
    "0300_Chaos_sf2_file",
    "0300_GeneralUserGS_sf2_file",
    // 0300_JCLive_sf2_file // broken
    // 0300_LesPaul_sf2 // broken
    "0300_LesPaul_sf2_file",
    //0300_SBAWE32_sf2_file // _2 octave
    //0300_SBLive_sf2
    //0300_SoundBlasterOld_sf2
    // 0301_Aspirin_sf2_file // missing
    //0301_FluidR3_GM_sf2_file // weird broken bell
    // 0301_GeneralUserGS_sf2_file // broken
    // 0301_JCLive_sf2_file // broken
    // 0301_LesPaul_sf2 // missing
    // 0301_LesPaul_sf2_file // + 1 oct?
    "0302_Aspirin_sf2_file",
    // 0302_GeneralUserGS_sf2_file // not a guitar..
    //0302_JCLive_sf2_file // broken...
    // 0303_Aspirin_sf2_file // guitar harmonic??
    "0304_Aspirin_sf2_file"
  ],
  gm_guitar_harmonics: [
    // Guitar Harmonics: Guitar
    "0310_Aspirin_sf2_file",
    "0310_FluidR3_GM_sf2_file",
    "0310_Chaos_sf2_file"
    //0310_GeneralUserGS_sf2_file // weird..
    // 0310_JCLive_sf2_file // weird
    //0310_LesPaul_sf2 // missing
    //0310_LesPaul_sf2_file // wrong pitches
    //0310_SBAWE32_sf2_file // wrong pitches
    //0310_SBLive_sf2
    //0310_SoundBlasterOld_sf2
    //0311_FluidR3_GM_sf2_file // knackt
    //0311_GeneralUserGS_sf2_file // wrong note
  ],
  gm_acoustic_bass: [
    // Acoustic Bass: Bass
    "0320_JCLive_sf2_file",
    "0320_FluidR3_GM_sf2_file",
    "0320_Aspirin_sf2_file",
    "0320_Chaos_sf2_file"
    // 0320_GeneralUserGS_sf2_file // missing notes
    //0320_SBLive_sf2
    //0320_SoundBlasterOld_sf2
    // 0321_GeneralUserGS_sf2_file // nice sound but missing notes
    // 0322_GeneralUserGS_sf2_file // missing note
  ],
  gm_electric_bass_finger: [
    // Electric Bass (finger): Bass
    "0330_JCLive_sf2_file",
    "0330_FluidR3_GM_sf2_fible",
    "0330_Aspirin_sf2_file",
    //0330_Chaos_sf2_file // same as last
    "0330_GeneralUserGS_sf2_file"
    //0330_SBLive_sf2
    //0330_SoundBlasterOld_sf2
    //0331_GeneralUserGS_sf2_file // knackt
    // 0332_GeneralUserGS_sf2_file // missin
  ],
  gm_electric_bass_pick: [
    // Electric Bass (pick): Bass
    "0340_JCLive_sf2_file",
    "0340_FluidR3_GM_sf2_file",
    "0340_Aspirin_sf2_file",
    //0340_Chaos_sf2_file // same as last
    "0340_GeneralUserGS_sf2_file",
    //0340_SBLive_sf2
    //0340_SoundBlasterOld_sf2
    "0341_Aspirin_sf2_file"
    //0341_GeneralUserGS_sf2_file // knack
  ],
  gm_fretless_bass: [
    // Fretless Bass: Bass
    "0350_Aspirin_sf2_file",
    // 0350_Chaos_sf2_file // same as last
    //0350_FluidR3_GM_sf2_file // knackt
    //0350_GeneralUserGS_sf2_file // _1 oct + knackt
    "0350_JCLive_sf2_file"
    //0350_SBLive_sf2
    //0350_SoundBlasterOld_sf2
    //0351_GeneralUserGS_sf2_file // missin
  ],
  gm_slap_bass_1: [
    // Slap Bass 1: Bass
    "0360_Aspirin_sf2_file",
    "0360_JCLive_sf2_file",
    "0360_FluidR3_GM_sf2_file",
    "0360_Chaos_sf2_file"
    //0360_GeneralUserGS_sf2_file // _1 oct
    //0360_SBLive_sf2
    //0360_SoundBlasterOld_sf2
    //0361_GeneralUserGS_sf2_file // missin
  ],
  gm_slap_bass_2: [
    // Slap Bass 2: Bass
    "0370_Aspirin_sf2_file",
    // 0370_Chaos_sf2_file // same as last
    "0370_FluidR3_GM_sf2_file",
    "0370_GeneralUserGS_sf2_fil e",
    "0370_JCLive_sf2_file"
    //0370_SBLive_sf2
    //0370_SoundBlasterOld_sf2
    //0371_GeneralUserGS_sf2_file // missing
    //0372_GeneralUserGS_sf2_file // detuned
    //0385_GeneralUserGS_sf2_file // missin
  ],
  gm_synth_bass_1: [
    // Synth Bass 1: Bass
    // '0380_Aspirin_sf2_file', // broken in safari https://codeberg.org/uzu/strudel/issues/1384
    "0380_Chaos_sf2_file",
    "0380_FluidR3_GM_sf2_file",
    // 0380_GeneralUserGS_sf2_file // laut
    "0380_JCLive_sf2_file",
    //0380_SBLive_sf2
    //0380_SoundBlasterOld_sf2
    "0381_FluidR3_GM_sf2_file",
    "0381_GeneralUserGS_sf2_file",
    //0382_FluidR3_GM_sf2_file // kein synth bass
    "0382_GeneralUserGS_sf2_file",
    "0383_GeneralUserGS_sf2_file",
    "0384_GeneralUserGS_sf2_file",
    //0386_GeneralUserGS_sf2_file // knackt
    "0387_GeneralUserGS_sf2_file"
  ],
  gm_synth_bass_2: [
    // Synth Bass 2: Bass
    "0390_Aspirin_sf2_file",
    // 0390_Chaos_sf2_file // same as last
    "0390_FluidR3_GM_sf2_file",
    "0390_GeneralUserGS_sf2_file",
    "0390_JCLive_sf2_file",
    //0390_SBLive_sf2
    //0390_SoundBlasterOld_sf2
    "0391_FluidR3_GM_sf2_file",
    // 0391_GeneralUserGS_sf2_file // missing
    //0391_SoundBlasterOld_sf2
    "0392_FluidR3_GM_sf2_file",
    //0392_GeneralUserGS_sf2_file // kein synth und _1oct
    "0393_GeneralUserGS_sf2_file"
  ],
  gm_violin: [
    // Violin: Strings
    "0400_Aspirin_sf2_file",
    "0400_Chaos_sf2_file",
    "0400_JCLive_sf2_file",
    "0400_FluidR3_GM_sf2_file",
    "0400_GeneralUserGS_sf2_file",
    //0400_SBLive_sf2
    //0400_SoundBlasterOld_sf2
    "0401_Aspirin_sf2_file",
    "0401_FluidR3_GM_sf2_file",
    "0401_GeneralUserGS_sf2_file",
    "0402_GeneralUserGS_sf2_file"
  ],
  gm_viola: [
    // Viola: Strings
    "0410_Aspirin_sf2_file",
    // 0410_Chaos_sf2_file // laut und sehr unstringy
    "0410_FluidR3_GM_sf2_file",
    "0410_GeneralUserGS_sf2_file",
    "0410_JCLive_sf2_file",
    //0410_SBLive_sf2
    //0410_SoundBlasterOld_sf2
    "0411_FluidR3_GM_sf2_file"
  ],
  gm_cello: [
    // Cello: Strings
    "0420_Aspirin_sf2_file",
    // 0420_Chaos_sf2_file // kein cello und laut
    "0420_FluidR3_GM_sf2_file",
    "0420_GeneralUserGS_sf2_file",
    "0420_JCLive_sf2_file",
    //0420_SBLive_sf2
    //0420_SoundBlasterOld_sf2
    "0421_FluidR3_GM_sf2_file",
    "0421_GeneralUserGS_sf2_file"
  ],
  gm_contrabass: [
    // Contrabass: Strings
    "0430_Aspirin_sf2_file",
    "0430_Chaos_sf2_file",
    // 0430_FluidR3_GM_sf2_file // missing notes
    "0430_GeneralUserGS_sf2_file"
    //0430_JCLive_sf2_file // _1 oct und meh
    //0430_SBLive_sf2
    //0430_SoundBlasterOld_sf2
    // 0431_FluidR3_GM_sf2_file // missing note
  ],
  gm_tremolo_strings: [
    // Tremolo Strings: Strings
    "0440_Aspirin_sf2_file",
    "0440_Chaos_sf2_file",
    //0440_FluidR3_GM_sf2_file // huuuge
    "0440_GeneralUserGS_sf2_file",
    "0440_JCLive_sf2_file",
    //0440_SBLive_sf2
    //0440_SoundBlasterOld_sf2
    "0441_GeneralUserGS_sf2_file",
    "0442_GeneralUserGS_sf2_file"
  ],
  gm_pizzicato_strings: [
    // Pizzicato Strings: Strings
    "0450_Aspirin_sf2_file",
    "0450_Chaos_sf2_file",
    "0450_FluidR3_GM_sf2_file",
    "0450_GeneralUserGS_sf2_file",
    "0450_JCLive_sf2_file",
    //0450_SBLive_sf2
    //0450_SoundBlasterOld_sf2
    "0451_FluidR3_GM_sf2_file"
  ],
  gm_orchestral_harp: [
    // Orchestral Harp: Strings
    "0460_Aspirin_sf2_file",
    // 0460_Chaos_sf2_file // knackt
    "0460_FluidR3_GM_sf2_file",
    "0460_GeneralUserGS_sf2_file",
    "0460_JCLive_sf2_file",
    //0460_SBLive_sf2
    //0460_SoundBlasterOld_sf2
    "0461_FluidR3_GM_sf2_file"
  ],
  gm_timpani: [
    // Timpani: Strings
    "0470_Aspirin_sf2_file",
    "0470_Chaos_sf2_file",
    "0470_FluidR3_GM_sf2_file",
    "0470_GeneralUserGS_sf2_file",
    // 0470_JCLive_sf2_file // wrong pitches
    //0470_SBLive_sf2
    //0470_SoundBlasterOld_sf2
    "0471_FluidR3_GM_sf2_file",
    "0471_GeneralUserGS_sf2_file"
  ],
  gm_string_ensemble_1: [
    // String Ensemble 1: Ensemble
    "0480_Aspirin_sf2_file",
    "0480_Chaos_sf2_file",
    "0480_FluidR3_GM_sf2_file",
    "0480_GeneralUserGS_sf2_file",
    "0480_JCLive_sf2_file",
    //0480_SBLive_sf2
    //0480_SoundBlasterOld_sf2
    // these dont work..
    //04810_GeneralUserGS_sf2_file // missing notes + brass
    //04811_GeneralUserGS_sf2_file  // missing notes + brass
    //04812_GeneralUserGS_sf2_file
    //04813_GeneralUserGS_sf2_file
    //04814_GeneralUserGS_sf2_file
    //04815_GeneralUserGS_sf2_file
    //04816_GeneralUserGS_sf2_file
    //04817_GeneralUserGS_sf2_file
    "0481_Aspirin_sf2_file",
    "0481_FluidR3_GM_sf2_file",
    "0481_GeneralUserGS_sf2_file",
    "0482_Aspirin_sf2_file",
    "0482_GeneralUserGS_sf2_file",
    "0483_GeneralUserGS_sf2_file"
    // another block of buggyness:
    //0484_GeneralUserGS_sf2_file // keys?! + knackt
    //0485_GeneralUserGS_sf2_file // missing notes
    //0486_GeneralUserGS_sf2_file
    //0487_GeneralUserGS_sf2_file
    //0488_GeneralUserGS_sf2_file
    //0489_GeneralUserGS_sf2_fil
  ],
  gm_string_ensemble_2: [
    // String Ensemble 2: Ensemble
    "0490_Aspirin_sf2_file",
    "0490_Chaos_sf2_file",
    "0490_FluidR3_GM_sf2_file",
    "0490_GeneralUserGS_sf2_file",
    "0490_JCLive_sf2_file",
    //0490_SBLive_sf2
    //0490_SoundBlasterOld_sf2
    "0491_GeneralUserGS_sf2_file",
    "0492_GeneralUserGS_sf2_file"
  ],
  gm_synth_strings_1: [
    // Synth Strings 1: Ensemble
    "0500_Aspirin_sf2_file",
    // 0500_Chaos_sf2_file // same as above
    //0500_FluidR3_GM_sf2_file // detune + knack
    "0500_GeneralUserGS_sf2_file",
    "0500_JCLive_sf2_file",
    //0500_SBLive_sf2
    //0500_SoundBlasterOld_sf2
    "0501_FluidR3_GM_sf2_file",
    // 0501_GeneralUserGS_sf2_file // crackles
    // 0502_FluidR3_GM_sf2_file // missing
    "0502_GeneralUserGS_sf2_file",
    "0503_FluidR3_GM_sf2_file",
    // 0504_FluidR3_GM_sf2_file // missing
    "0505_FluidR3_GM_sf2_file"
  ],
  gm_synth_strings_2: [
    // Synth Strings 2: Ensemble
    "0510_Aspirin_sf2_file",
    "0510_Chaos_sf2_file",
    // 0510_FluidR3_GM_sf2_file // detune + crackle
    "0510_GeneralUserGS_sf2_file",
    //0510_JCLive_sf2_file // laarge and meh
    //0510_SBLive_sf2 // missing
    //0510_SoundBlasterOld_sf2
    "0511_GeneralUserGS_sf2_file"
    //0511_SoundBlasterOld_sf
  ],
  gm_choir_aahs: [
    // Choir Aahs: Ensemble
    "0520_Aspirin_sf2_file",
    "0520_Chaos_sf2_file",
    "0520_FluidR3_GM_sf2_file",
    "0520_GeneralUserGS_sf2_file",
    "0520_JCLive_sf2_file",
    //0520_SBLive_sf2
    "0520_Soul_Ahhs_sf2_file",
    //0520_SoundBlasterOld_sf2
    "0521_FluidR3_GM_sf2_file",
    "0521_Soul_Ahhs_sf2_file",
    //0521_SoundBlasterOld_sf2
    "0522_Soul_Ahhs_sf2_file"
  ],
  gm_voice_oohs: [
    // Voice Oohs: Ensemble
    "0530_Aspirin_sf2_file",
    "0530_Chaos_sf2_file",
    "0530_FluidR3_GM_sf2_file",
    "0530_GeneralUserGS_sf2_file",
    //0530_JCLive_sf2_file // same as above
    //0530_SBLive_sf2
    // 0530_Soul_Ahhs_sf2_file // not ooh
    //0530_SoundBlasterOld_sf2
    "0531_FluidR3_GM_sf2_file",
    // 0531_GeneralUserGS_sf2_file // ends crackle
    "0531_JCLive_sf2_file"
    //0531_SoundBlasterOld_sf
  ],
  gm_synth_choir: [
    // Synth Choir: Ensemble
    "0540_Aspirin_sf2_file",
    "0540_Chaos_sf2_file",
    "0540_FluidR3_GM_sf2_file",
    "0540_GeneralUserGS_sf2_file",
    //0540_JCLive_sf2_file // large + crackles
    //0540_SBLive_sf2
    //0540_SoundBlasterOld_sf2
    "0541_FluidR3_GM_sf2_file"
  ],
  gm_orchestra_hit: [
    // Orchestra Hit: Ensemble
    "0550_Aspirin_sf2_file",
    "0550_Chaos_sf2_file",
    "0550_FluidR3_GM_sf2_file",
    "0550_GeneralUserGS_sf2_file",
    //0550_JCLive_sf2_file // same as above
    //0550_SBLive_sf2
    //0550_SoundBlasterOld_sf2
    //0551_Aspirin_sf2_file // not an orch hit..
    "0551_FluidR3_GM_sf2_file"
  ],
  gm_trumpet: [
    // Trumpet: Brass
    "0560_FluidR3_GM_sf2_file",
    "0560_JCLive_sf2_file",
    "0560_Aspirin_sf2_file",
    "0560_Chaos_sf2_file"
    //0560_GeneralUserGS_sf2_file // _1 oct
    //0560_SBLive_sf2
    //0560_SoundBlasterOld_sf
  ],
  gm_trombone: [
    // Trombone: Brass
    "0570_Aspirin_sf2_file",
    "0570_Chaos_sf2_file",
    "0570_FluidR3_GM_sf2_file",
    "0570_GeneralUserGS_sf2_file",
    //0570_JCLive_sf2_file // _1oct
    //0570_SBLive_sf2
    //0570_SoundBlasterOld_sf2
    "0571_GeneralUserGS_sf2_file"
  ],
  gm_tuba: [
    // Tuba: Brass
    "0580_FluidR3_GM_sf2_file",
    "0580_Aspirin_sf2_file",
    "0580_Chaos_sf2_file",
    "0580_GeneralUserGS_sf2_file"
    //0580_JCLive_sf2_file // _1oct
    //0580_SBLive_sf2
    //0580_SoundBlasterOld_sf2
    //0581_GeneralUserGS_sf2_file // missin
  ],
  gm_muted_trumpet: [
    // Muted Trumpet: Brass
    "0590_JCLive_sf2_file",
    "0590_Aspirin_sf2_file",
    "0590_Chaos_sf2_file",
    "0590_FluidR3_GM_sf2_file",
    "0590_GeneralUserGS_sf2_file"
    //0590_SBLive_sf2
    //0590_SoundBlasterOld_sf2
    // 0591_GeneralUserGS_sf2_file // missin
  ],
  gm_french_horn: [
    // French Horn: Brass
    "0600_Aspirin_sf2_file",
    //0600_Chaos_sf2_file // weird jumps
    "0600_FluidR3_GM_sf2_file",
    "0600_GeneralUserGS_sf2_file",
    "0600_JCLive_sf2_file",
    //0600_SBLive_sf2
    //0600_SoundBlasterOld_sf2
    "0601_FluidR3_GM_sf2_file"
    //0601_GeneralUserGS_sf2_file // tiny crackles
    // 0602_GeneralUserGS_sf2_file // bad gain diffs
    // 0603_GeneralUserGS_sf2_file // tiny crackle
  ],
  gm_brass_section: [
    // Brass Section: Brass
    "0610_JCLive_sf2_file",
    "0610_Aspirin_sf2_file",
    "0610_Chaos_sf2_file",
    "0610_FluidR3_GM_sf2_file",
    "0610_GeneralUserGS_sf2_file"
    //0610_SBLive_sf2
    //0610_SoundBlasterOld_sf2
    // 0611_GeneralUserGS_sf2_file // missing sounds
    // 0612_GeneralUserGS_sf2_file
    //0613_GeneralUserGS_sf2_file // _1 oct
    // 0614_GeneralUserGS_sf2_file // missing sounds
    // 0615_GeneralUserGS_sf2_file // missing sound
  ],
  gm_synth_brass_1: [
    // Synth Brass 1: Brass
    "0620_Aspirin_sf2_file",
    //0620_Chaos_sf2_file // weird gain diff
    "0620_FluidR3_GM_sf2_file",
    //0620_GeneralUserGS_sf2_file // loooud
    // 0620_JCLive_sf2_file // weird gain diff
    //0620_SBLive_sf2
    //0620_SoundBlasterOld_sf2
    "0621_Aspirin_sf2_file",
    "0621_FluidR3_GM_sf2_file"
    // 0621_GeneralUserGS_sf2_file // detune + loooud
    //0622_FluidR3_GM_sf2_file // loud..
    //0622_GeneralUserGS_sf2_file // loud + crackle
  ],
  gm_synth_brass_2: [
    // Synth Brass 2: Brass
    "0630_Aspirin_sf2_file",
    "0630_Chaos_sf2_file",
    "0630_FluidR3_GM_sf2_file",
    //0630_GeneralUserGS_sf2_file // detune + looud
    "0630_JCLive_sf2_file",
    //0630_SBLive_sf2
    //0630_SoundBlasterOld_sf2
    // 0631_Aspirin_sf2_file // looud + detune + gain diffs
    "0631_FluidR3_GM_sf2_file",
    //0631_GeneralUserGS_sf2_file // crackles
    "0632_FluidR3_GM_sf2_file",
    "0633_FluidR3_GM_sf2_file"
  ],
  gm_soprano_sax: [
    // Soprano Sax: Reed
    "0640_JCLive_sf2_file",
    "0640_Aspirin_sf2_file",
    "0640_Chaos_sf2_file",
    "0640_FluidR3_GM_sf2_file",
    // 0640_GeneralUserGS_sf2_file // crackles
    //0640_SBLive_sf2
    //0640_SoundBlasterOld_sf2
    "0641_FluidR3_GM_sf2_file"
  ],
  gm_alto_sax: [
    // Alto Sax: Reed
    //0650_Aspirin_sf2_file // this is not an alto sax
    "0650_JCLive_sf2_file",
    "0650_Chaos_sf2_file",
    "0650_FluidR3_GM_sf2_file",
    "0650_GeneralUserGS_sf2_file",
    //0650_SBLive_sf2
    //0650_SoundBlasterOld_sf2
    "0651_Aspirin_sf2_file",
    "0651_FluidR3_GM_sf2_file"
  ],
  gm_tenor_sax: [
    // Tenor Sax: Reed
    "0660_JCLive_sf2_file",
    "0660_Aspirin_sf2_file",
    "0660_Chaos_sf2_file",
    //0660_FluidR3_GM_sf2_file // weird pitches
    "0660_GeneralUserGS_sf2_file"
    //0660_SBLive_sf2
    //0660_SoundBlasterOld_sf2
    // 0661_FluidR3_GM_sf2_file // weird pitches
    // 0661_GeneralUserGS_sf2_file // missin
  ],
  gm_baritone_sax: [
    // Baritone Sax: Reed
    "0670_JCLive_sf2_file",
    "0670_Aspirin_sf2_file",
    "0670_Chaos_sf2_file",
    "0670_FluidR3_GM_sf2_file",
    "0670_GeneralUserGS_sf2_file",
    //0670_SBLive_sf2
    //0670_SoundBlasterOld_sf2
    "0671_FluidR3_GM_sf2_file"
  ],
  gm_oboe: [
    // Oboe: Reed
    //0680_Aspirin_sf2_file // tiny crackles
    "0680_JCLive_sf2_file",
    "0680_Chaos_sf2_file",
    "0680_FluidR3_GM_sf2_file",
    "0680_GeneralUserGS_sf2_file",
    //0680_SBLive_sf2
    //0680_SoundBlasterOld_sf2
    "0681_FluidR3_GM_sf2_file"
  ],
  gm_english_horn: [
    // English Horn: Reed
    "0690_JCLive_sf2_file",
    "0690_Aspirin_sf2_file",
    //0690_Chaos_sf2_file // detuned
    "0690_FluidR3_GM_sf2_file",
    //0690_GeneralUserGS_sf2_file // +1 oct
    //0690_SBLive_sf2
    //0690_SoundBlasterOld_sf2
    "0691_FluidR3_GM_sf2_file"
  ],
  gm_bassoon: [
    // Bassoon: Reed
    "0700_JCLive_sf2_file",
    //0700_Aspirin_sf2_file // detune + gain diffs
    // 0700_Chaos_sf2_file // detune + crackles
    "0700_FluidR3_GM_sf2_file",
    "0700_GeneralUserGS_sf2_file",
    //0700_SBLive_sf2
    //0700_SoundBlasterOld_sf2
    "0701_FluidR3_GM_sf2_file"
    //0701_GeneralUserGS_sf2_file // missin
  ],
  gm_clarinet: [
    // Clarinet: Reed
    "0710_JCLive_sf2_file",
    "0710_Aspirin_sf2_file",
    "0710_Chaos_sf2_file",
    "0710_FluidR3_GM_sf2_file",
    "0710_GeneralUserGS_sf2_file",
    //0710_SBLive_sf2
    //0710_SoundBlasterOld_sf2
    "0711_FluidR3_GM_sf2_file"
  ],
  gm_piccolo: [
    // Piccolo: Pipe
    "0720_JCLive_sf2_file",
    "0720_Aspirin_sf2_file",
    // 0720_Chaos_sf2_file // not a piccolo
    "0720_FluidR3_GM_sf2_file",
    "0720_GeneralUserGS_sf2_file",
    //0720_SBLive_sf2
    //0720_SoundBlasterOld_sf2
    "0721_FluidR3_GM_sf2_file"
    //0721_SoundBlasterOld_sf
  ],
  gm_flute: [
    // Flute: Pipe
    "0730_JCLive_sf2_file",
    "0730_Aspirin_sf2_file",
    //0730_Chaos_sf2_file // etune
    "0730_FluidR3_GM_sf2_file",
    "0730_GeneralUserGS_sf2_file",
    //0730_SBLive_sf2
    //0730_SoundBlasterOld_sf2
    //0731_Aspirin_sf2_file // not a flute
    "0731_FluidR3_GM_sf2_file"
    //0731_SoundBlasterOld_sf
  ],
  gm_recorder: [
    // Recorder: Pipe
    "0740_JCLive_sf2_file",
    "0740_Aspirin_sf2_file",
    "0740_Chaos_sf2_file",
    "0740_FluidR3_GM_sf2_file",
    "0740_GeneralUserGS_sf2_file"
    //0740_SBLive_sf2
    //0740_SoundBlasterOld_sf2
    // 0741_GeneralUserGS_sf2_file // missin
  ],
  gm_pan_flute: [
    // Pan Flute: Pipe
    "0750_JCLive_sf2_file",
    "0750_FluidR3_GM_sf2_file",
    "0750_Aspirin_sf2_file",
    "0750_Chaos_sf2_file",
    "0750_GeneralUserGS_sf2_file",
    //0750_SBLive_sf2
    //0750_SoundBlasterOld_sf2
    "0751_Aspirin_sf2_file",
    "0751_FluidR3_GM_sf2_file",
    "0751_GeneralUserGS_sf2_file"
    //0751_SoundBlasterOld_sf
  ],
  gm_blown_bottle: [
    // Blown bottle: Pipe
    "0760_FluidR3_GM_sf2_file",
    "0760_JCLive_sf2_file",
    // 0760_Aspirin_sf2_file // same as below w crackle
    "0760_Chaos_sf2_file",
    "0760_GeneralUserGS_sf2_file",
    //0760_SBLive_sf2
    //0760_SoundBlasterOld_sf2
    "0761_FluidR3_GM_sf2_file"
    // 0761_GeneralUserGS_sf2_file // missing
    //0761_SoundBlasterOld_sf2
    // 0762_GeneralUserGS_sf2_file // missin
  ],
  gm_shakuhachi: [
    // Shakuhachi: Pipe
    "0770_JCLive_sf2_file",
    "0771_FluidR3_GM_sf2_file",
    "0770_Aspirin_sf2_file",
    //0770_Chaos_sf2_file // not shakuhachi
    "0770_FluidR3_GM_sf2_file",
    "0770_GeneralUserGS_sf2_file"
    //0770_SBLive_sf2
    //0770_SoundBlasterOld_sf2
    // 0771_GeneralUserGS_sf2_file // missing
    // 0772_GeneralUserGS_sf2_file // missin
  ],
  gm_whistle: [
    // Whistle: Pipe
    "0780_FluidR3_GM_sf2_file",
    "0780_JCLive_sf2_file",
    "0780_Aspirin_sf2_file",
    "0780_Chaos_sf2_file"
    //0780_GeneralUserGS_sf2_file // loud..
    //0780_SBLive_sf2
    //0780_SoundBlasterOld_sf2
    // 0781_GeneralUserGS_sf2_file // detune + crackle
  ],
  gm_ocarina: [
    // Ocarina: Pipe
    "0790_FluidR3_GM_sf2_file",
    "0790_JCLive_sf2_file",
    "0790_Aspirin_sf2_file",
    //0790_Chaos_sf2_file // same as above
    "0790_GeneralUserGS_sf2_file"
    //0790_SBLive_sf2
    //0790_SoundBlasterOld_sf2
    //0791_GeneralUserGS_sf2_file // missin
  ],
  gm_lead_1_square: [
    // Lead 1 (square): Synth Lead
    "0800_Aspirin_sf2_file",
    "0800_Chaos_sf2_file",
    "0800_FluidR3_GM_sf2_file"
    // 0800_GeneralUserGS_sf2_file // detuned
    // 0800_JCLive_sf2_file // detuned
    //0800_SBLive_sf2
    //0800_SoundBlasterOld_sf2
    //0801_FluidR3_GM_sf2_file // detune
    // 0801_GeneralUserGS_sf2_file // detun
  ],
  gm_lead_2_sawtooth: [
    // Lead 2 (sawtooth): Synth Lead
    "0810_JCLive_sf2_file",
    "0810_Aspirin_sf2_file",
    "0810_Chaos_sf2_file",
    "0810_FluidR3_GM_sf2_file",
    "0810_GeneralUserGS_sf2_file",
    //0810_SBLive_sf2
    //0810_SoundBlasterOld_sf2
    "0811_Aspirin_sf2_file",
    "0811_GeneralUserGS_sf2_file"
    //0811_SoundBlasterOld_sf
  ],
  gm_lead_3_calliope: [
    // Lead 3 (calliope): Synth Lead
    "0820_JCLive_sf2_file",
    "0820_Aspirin_sf2_file",
    "0820_Chaos_sf2_file",
    "0820_FluidR3_GM_sf2_file",
    "0820_GeneralUserGS_sf2_file",
    //0820_SBLive_sf2
    //0820_SoundBlasterOld_sf2
    "0821_FluidR3_GM_sf2_file",
    "0821_GeneralUserGS_sf2_file"
    //0821_SoundBlasterOld_sf2
    // 0822_GeneralUserGS_sf2_file // missing
    //0823_GeneralUserGS_sf2_file // missin
  ],
  gm_lead_4_chiff: [
    // Lead 4 (chiff): Synth Lead
    "0830_JCLive_sf2_file",
    "0830_Aspirin_sf2_file",
    // 0830_Chaos_sf2_file // same as above
    "0830_FluidR3_GM_sf2_file",
    "0830_GeneralUserGS_sf2_file",
    //0830_SBLive_sf2
    //0830_SoundBlasterOld_sf2
    "0831_FluidR3_GM_sf2_file",
    "0831_GeneralUserGS_sf2_file"
    //0831_SoundBlasterOld_sf
  ],
  gm_lead_5_charang: [
    // Lead 5 (charang): Synth Lead
    "0840_JCLive_sf2_file",
    "0840_FluidR3_GM_sf2_file",
    "0840_Aspirin_sf2_file",
    "0840_Chaos_sf2_file",
    "0840_GeneralUserGS_sf2_file",
    //0840_SBLive_sf2
    //0840_SoundBlasterOld_sf2
    "0841_Aspirin_sf2_file",
    "0841_Chaos_sf2_file",
    "0841_FluidR3_GM_sf2_file",
    "0841_GeneralUserGS_sf2_file",
    //0841_JCLive_sf2_file // +1oct + detune
    //0841_SoundBlasterOld_sf2
    "0842_FluidR3_GM_sf2_file"
  ],
  gm_lead_6_voice: [
    // Lead 6 (voice): Synth Lead
    "0850_JCLive_sf2_file",
    "0850_Aspirin_sf2_file",
    // 0850_Chaos_sf2_file // same as above
    "0850_FluidR3_GM_sf2_file",
    // 0850_GeneralUserGS_sf2_file // no voice
    //0850_SBLive_sf2
    //0850_SoundBlasterOld_sf2
    "0851_FluidR3_GM_sf2_file",
    "0851_GeneralUserGS_sf2_file",
    "0851_JCLive_sf2_file"
    //0851_SoundBlasterOld_sf
  ],
  gm_lead_7_fifths: [
    // Lead 7 (fifths): Synth Lead
    "0860_JCLive_sf2_file",
    "0860_Aspirin_sf2_file",
    "0860_Chaos_sf2_file",
    // 0860_FluidR3_GM_sf2_file // loud and not fitting
    "0860_GeneralUserGS_sf2_file",
    //0860_SBLive_sf2
    //0860_SoundBlasterOld_sf2
    "0861_Aspirin_sf2_file"
    // 0861_FluidR3_GM_sf2_file // lout and not fitting
    //0861_SoundBlasterOld_sf
  ],
  gm_lead_8_bass_lead: [
    // Lead 8 (bass + lead): Synth Lead
    "0870_JCLive_sf2_file",
    "0870_Aspirin_sf2_file",
    "0870_Chaos_sf2_file",
    "0870_FluidR3_GM_sf2_file",
    "0870_GeneralUserGS_sf2_file"
    //0870_SBLive_sf2
    //0870_SoundBlasterOld_sf2
    // 0871_GeneralUserGS_sf2_file // loud + detune
    //0872_GeneralUserGS_sf2_file // loud
    //0873_GeneralUserGS_sf2_file // lou
  ],
  gm_pad_new_age: [
    // Pad 1 (new age): Synth Pad
    "0880_JCLive_sf2_file",
    "0880_Aspirin_sf2_file",
    "0880_Chaos_sf2_file",
    "0880_FluidR3_GM_sf2_file",
    "0880_GeneralUserGS_sf2_file",
    //0880_SBLive_sf2
    //0880_SoundBlasterOld_sf2
    "0881_Aspirin_sf2_file",
    "0881_FluidR3_GM_sf2_file",
    "0881_GeneralUserGS_sf2_file",
    //0881_SoundBlasterOld_sf2
    "0882_Aspirin_sf2_file",
    // 0882_FluidR3_GM_sf2_file // missing
    "0882_GeneralUserGS_sf2_file",
    //0883_GeneralUserGS_sf2_file // missing
    // 0884_GeneralUserGS_sf2_file // broken
    "0885_GeneralUserGS_sf2_file",
    //0886_GeneralUserGS_sf2_file // not a pad
    "0887_GeneralUserGS_sf2_file"
    //0888_GeneralUserGS_sf2_file // not a pad
    //0889_GeneralUserGS_sf2_file // not a pa
  ],
  gm_pad_warm: [
    // Pad 2 (warm): Synth Pad
    "0890_JCLive_sf2_file",
    "0890_Aspirin_sf2_file",
    "0890_Chaos_sf2_file",
    "0890_FluidR3_GM_sf2_file",
    "0890_GeneralUserGS_sf2_file",
    //0890_SBLive_sf2
    //0890_SoundBlasterOld_sf2
    "0891_Aspirin_sf2_file",
    "0891_FluidR3_GM_sf2_file"
    // 0891_GeneralUserGS_sf2_file // nois
  ],
  gm_pad_poly: [
    // Pad 3 (polysynth): Synth Pad
    //0900_Aspirin_sf2_file // same as belo
    "0900_JCLive_sf2_file",
    "0900_Chaos_sf2_file",
    "0900_FluidR3_GM_sf2_file",
    "0900_GeneralUserGS_sf2_file",
    //0900_SBLive_sf2
    //0900_SoundBlasterOld_sf2
    "0901_Aspirin_sf2_file",
    "0901_FluidR3_GM_sf2_file",
    "0901_GeneralUserGS_sf2_file"
    //0901_SoundBlasterOld_sf
  ],
  gm_pad_choir: [
    // Pad 4 (choir): Synth Pad
    "0910_FluidR3_GM_sf2_file",
    "0910_JCLive_sf2_file",
    "0910_Aspirin_sf2_file",
    //0910_Chaos_sf2_file // +1oct
    "0910_GeneralUserGS_sf2_file",
    //0910_SBLive_sf2
    //0910_SoundBlasterOld_sf2
    // 0911_Aspirin_sf2_file // fluty crackles
    "0911_GeneralUserGS_sf2_file",
    "0911_JCLive_sf2_file"
    //0911_SoundBlasterOld_sf
  ],
  gm_pad_bowed: [
    // Pad 5 (bowed): Synth Pad
    "0920_JCLive_sf2_file",
    "0920_Aspirin_sf2_file",
    //0920_Chaos_sf2_file // same as above
    //0920_FluidR3_GM_sf2_file // detuned?
    "0920_GeneralUserGS_sf2_file",
    //0920_SBLive_sf2
    //0920_SoundBlasterOld_sf2
    "0921_Aspirin_sf2_file",
    "0921_GeneralUserGS_sf2_file"
    //0921_SoundBlasterOld_sf
  ],
  gm_pad_metallic: [
    // Pad 6 (metallic): Synth Pad
    "0930_Aspirin_sf2_file",
    "0930_Chaos_sf2_file",
    "0930_FluidR3_GM_sf2_file",
    "0930_GeneralUserGS_sf2_file",
    // 0930_JCLive_sf2_file // buggy zones: guitar / synth
    //0930_SBLive_sf2
    //0930_SoundBlasterOld_sf2
    "0931_Aspirin_sf2_file",
    "0931_FluidR3_GM_sf2_file",
    "0931_GeneralUserGS_sf2_file"
    //0931_SoundBlasterOld_sf
  ],
  gm_pad_halo: [
    // Pad 7 (halo): Synth Pad
    // 0940_Aspirin_sf2_file // same as below
    "0940_Chaos_sf2_file",
    "0940_FluidR3_GM_sf2_file",
    "0940_GeneralUserGS_sf2_file",
    "0940_JCLive_sf2_file",
    //0940_SBLive_sf2
    //0940_SoundBlasterOld_sf2
    "0941_Aspirin_sf2_file",
    "0941_FluidR3_GM_sf2_file",
    "0941_GeneralUserGS_sf2_file",
    "0941_JCLive_sf2_file"
  ],
  gm_pad_sweep: [
    // Pad 8 (sweep): Synth Pad
    "0950_Aspirin_sf2_file",
    "0950_Chaos_sf2_file",
    "0950_FluidR3_GM_sf2_file",
    "0950_GeneralUserGS_sf2_file",
    "0950_JCLive_sf2_file",
    //0950_SBLive_sf2
    //0950_SoundBlasterOld_sf2
    "0951_FluidR3_GM_sf2_file",
    "0951_GeneralUserGS_sf2_file"
  ],
  gm_fx_rain: [
    // FX 1 (rain): Synth Effects
    //0960_Aspirin_sf2_file //mixed samples?
    "0960_FluidR3_GM_sf2_file",
    "0960_Chaos_sf2_file",
    "0960_GeneralUserGS_sf2_file",
    // 0960_JCLive_sf2_file // mixed samples?
    //0960_SBLive_sf2
    //0960_SoundBlasterOld_sf2
    "0961_Aspirin_sf2_file",
    "0961_FluidR3_GM_sf2_file",
    // 0961_GeneralUserGS_sf2_file // ?!?!
    //0961_SoundBlasterOld_sf2
    "0962_GeneralUserGS_sf2_file"
  ],
  gm_fx_soundtrack: [
    // FX 2 (soundtrack): Synth Effects
    "0970_FluidR3_GM_sf2_file",
    "0970_Aspirin_sf2_file",
    //0970_Chaos_sf2_file // wrong pitch
    "0970_GeneralUserGS_sf2_file",
    //0970_JCLive_sf2_file // wrong pitch
    //0970_SBLive_sf2
    //0970_SoundBlasterOld_sf2
    "0971_FluidR3_GM_sf2_file",
    "0971_GeneralUserGS_sf2_file"
    //0971_SoundBlasterOld_sf
  ],
  gm_fx_crystal: [
    // FX 3 (crystal): Synth Effects
    "0980_Aspirin_sf2_file",
    "0980_JCLive_sf2_file",
    "0980_Chaos_sf2_file",
    // 0980_FluidR3_GM_sf2_file // some notes are weird
    "0980_GeneralUserGS_sf2_file",
    "0981_FluidR3_GM_sf2_file",
    //0980_SBLive_sf2
    //0980_SoundBlasterOld_sf2
    "0981_Aspirin_sf2_file",
    "0981_GeneralUserGS_sf2_file",
    //0981_SoundBlasterOld_sf2
    "0982_GeneralUserGS_sf2_file",
    "0983_GeneralUserGS_sf2_file",
    "0984_GeneralUserGS_sf2_file"
  ],
  gm_fx_atmosphere: [
    // FX 4 (atmosphere): Synth Effects
    "0990_JCLive_sf2_file",
    "0990_Aspirin_sf2_file",
    "0990_Chaos_sf2_file",
    "0990_FluidR3_GM_sf2_file",
    "0990_GeneralUserGS_sf2_file",
    //0990_SBLive_sf2
    //0990_SoundBlasterOld_sf2
    "0991_Aspirin_sf2_file",
    "0991_FluidR3_GM_sf2_file",
    "0991_GeneralUserGS_sf2_file",
    "0991_JCLive_sf2_file",
    //0991_SoundBlasterOld_sf2
    "0992_FluidR3_GM_sf2_file",
    "0992_JCLive_sf2_file",
    "0993_JCLive_sf2_file",
    "0994_JCLive_sf2_file"
  ],
  gm_fx_brightness: [
    // FX 5 (brightness): Synth Effects
    "1000_JCLive_sf2_file",
    "1000_Aspirin_sf2_file",
    "1000_Chaos_sf2_file",
    "1000_FluidR3_GM_sf2_file",
    "1000_GeneralUserGS_sf2_file",
    //1000_SBLive_sf2
    //1000_SoundBlasterOld_sf2
    "1001_Aspirin_sf2_file",
    "1001_FluidR3_GM_sf2_file",
    "1001_GeneralUserGS_sf2_file",
    "1001_JCLive_sf2_file",
    //1001_SoundBlasterOld_sf2
    "1002_Aspirin_sf2_file",
    "1002_FluidR3_GM_sf2_file",
    "1002_GeneralUserGS_sf2_file"
  ],
  gm_fx_goblins: [
    // FX 6 (goblins): Synth Effects
    "1010_FluidR3_GM_sf2_file",
    "1010_JCLive_sf2_file",
    "1010_Aspirin_sf2_file",
    "1010_Chaos_sf2_file",
    "1010_GeneralUserGS_sf2_file",
    //1010_SBLive_sf2
    //1010_SoundBlasterOld_sf2
    "1011_Aspirin_sf2_file",
    "1011_FluidR3_GM_sf2_file",
    "1011_JCLive_sf2_file",
    "1012_Aspirin_sf2_file"
  ],
  gm_fx_echoes: [
    // FX 7 (echoes): Synth Effects
    "1020_FluidR3_GM_sf2_file",
    "1020_JCLive_sf2_file",
    "1020_Aspirin_sf2_file",
    "1020_Chaos_sf2_file",
    "1020_GeneralUserGS_sf2_file",
    //1020_SBLive_sf2
    //1020_SoundBlasterOld_sf2
    "1021_Aspirin_sf2_file",
    "1021_FluidR3_GM_sf2_file",
    "1021_GeneralUserGS_sf2_file",
    "1021_JCLive_sf2_file",
    //1021_SoundBlasterOld_sf2
    "1022_GeneralUserGS_sf2_file"
  ],
  gm_fx_sci_fi: [
    // FX 8 (sci_fi): Synth Effects
    "1030_FluidR3_GM_sf2_file",
    "1030_Aspirin_sf2_file",
    "1030_Chaos_sf2_file",
    "1030_GeneralUserGS_sf2_file",
    "1030_JCLive_sf2_file",
    //1030_SBLive_sf2
    //1030_SoundBlasterOld_sf2
    "1031_Aspirin_sf2_file",
    "1031_FluidR3_GM_sf2_file",
    "1031_GeneralUserGS_sf2_file",
    //1031_SoundBlasterOld_sf2
    "1032_FluidR3_GM_sf2_file"
  ],
  gm_sitar: [
    // Sitar: Ethnic
    "1040_Aspirin_sf2_file",
    "1040_FluidR3_GM_sf2_file",
    "1040_JCLive_sf2_file",
    "1040_Chaos_sf2_file",
    "1040_GeneralUserGS_sf2_file",
    //1040_SBLive_sf2
    //1040_SoundBlasterOld_sf2
    "1041_FluidR3_GM_sf2_file",
    "1041_GeneralUserGS_sf2_file"
  ],
  gm_banjo: [
    // Banjo: Ethnic
    "1050_FluidR3_GM_sf2_file",
    "1050_JCLive_sf2_file",
    "1050_Aspirin_sf2_file",
    "1050_Chaos_sf2_file",
    "1050_GeneralUserGS_sf2_file",
    //1050_SBLive_sf2
    //1050_SoundBlasterOld_sf2
    "1051_GeneralUserGS_sf2_file"
  ],
  gm_shamisen: [
    // Shamisen: Ethnic
    "1060_JCLive_sf2_file",
    "1060_FluidR3_GM_sf2_file",
    "1060_Aspirin_sf2_file",
    "1060_Chaos_sf2_file",
    "1060_GeneralUserGS_sf2_file",
    //1060_SBLive_sf2
    //1060_SoundBlasterOld_sf2
    "1061_FluidR3_GM_sf2_file",
    "1061_GeneralUserGS_sf2_file"
    //1061_SoundBlasterOld_sf
  ],
  gm_koto: [
    // Koto: Ethnic
    "1070_FluidR3_GM_sf2_file",
    "1070_JCLive_sf2_file",
    "1070_Aspirin_sf2_file",
    "1070_Chaos_sf2_file",
    "1070_GeneralUserGS_sf2_file",
    //1070_SBLive_sf2
    //1070_SoundBlasterOld_sf2
    "1071_FluidR3_GM_sf2_file",
    "1071_GeneralUserGS_sf2_file",
    "1072_GeneralUserGS_sf2_file",
    "1073_GeneralUserGS_sf2_file"
  ],
  gm_kalimba: [
    // Kalimba: Ethnic
    "1080_JCLive_sf2_file",
    "1080_FluidR3_GM_sf2_file",
    "1080_Aspirin_sf2_file",
    "1080_Chaos_sf2_file",
    "1080_GeneralUserGS_sf2_file"
    //1080_SBLive_sf2
    //1080_SoundBlasterOld_sf2
    //1081_SoundBlasterOld_sf
  ],
  gm_bagpipe: [
    // Bagpipe: Ethnic
    "1090_Aspirin_sf2_file"
    // '1090_Chaos_sf2_file', // broken pitches
    // '1090_GeneralUserGS_sf2_file', // broken pitches
    // '1090_FluidR3_GM_sf2_file', // broken pitches ?
    // '1090_JCLive_sf2_file', // broken pitches ?
    //1090_SBLive_sf2
    //1090_SoundBlasterOld_sf2
    //1091_SoundBlasterOld_sf
  ],
  gm_fiddle: [
    // Fiddle: Ethnic
    "1100_JCLive_sf2_file",
    "1100_Aspirin_sf2_file",
    "1100_Chaos_sf2_file",
    "1100_FluidR3_GM_sf2_file",
    "1100_GeneralUserGS_sf2_file",
    //1100_SBLive_sf2
    //1100_SoundBlasterOld_sf2
    "1101_Aspirin_sf2_file",
    "1101_FluidR3_GM_sf2_file",
    "1101_GeneralUserGS_sf2_file",
    "1102_GeneralUserGS_sf2_file"
  ],
  gm_shanai: [
    // Shanai: Ethnic
    "1110_Aspirin_sf2_file",
    "1110_FluidR3_GM_sf2_file",
    "1110_JCLive_sf2_file",
    "1110_Chaos_sf2_file",
    "1110_GeneralUserGS_sf2_file"
    //1110_SBLive_sf2
    //1110_SoundBlasterOld_sf
  ],
  gm_tinkle_bell: [
    // Tinkle Bell: Percussive
    "1120_Aspirin_sf2_file"
    // '1120_Chaos_sf2_file', // same as above
    // '1120_GeneralUserGS_sf2_file', // sounds exactly as Aspirin
    // '1120_FluidR3_GM_sf2_file', // +1oct
    // '1120_JCLive_sf2_file', // +1oct
    //1120_SBLive_sf2
    //1120_SoundBlasterOld_sf2
    //1121_SoundBlasterOld_sf
  ],
  gm_agogo: [
    // Agogo: Percussive
    "1130_JCLive_sf2_file",
    "1130_Aspirin_sf2_file",
    "1130_Chaos_sf2_file",
    "1130_FluidR3_GM_sf2_file",
    "1130_GeneralUserGS_sf2_file",
    //1130_SBLive_sf2
    //1130_SoundBlasterOld_sf2
    "1131_FluidR3_GM_sf2_file"
    //1131_SoundBlasterOld_sf
  ],
  gm_steel_drums: [
    // Steel Drums: Percussive
    "1140_FluidR3_GM_sf2_file",
    "1140_Aspirin_sf2_file",
    "1140_JCLive_sf2_file",
    "1140_Chaos_sf2_file",
    "1140_GeneralUserGS_sf2_file",
    //1140_SBLive_sf2
    //1140_SoundBlasterOld_sf2
    "1141_FluidR3_GM_sf2_file"
  ],
  gm_woodblock: [
    // Woodblock: Percussive
    "1150_JCLive_sf2_file",
    "1150_Aspirin_sf2_file",
    "1150_Chaos_sf2_file",
    "1150_FluidR3_GM_sf2_file",
    "1150_GeneralUserGS_sf2_file",
    //1150_SBLive_sf2
    //1150_SoundBlasterOld_sf2
    "1151_FluidR3_GM_sf2_file",
    "1151_GeneralUserGS_sf2_file",
    "1152_FluidR3_GM_sf2_file",
    "1152_GeneralUserGS_sf2_file"
  ],
  gm_taiko_drum: [
    // Taiko Drum: Percussive
    "1160_JCLive_sf2_file",
    "1160_FluidR3_GM_sf2_file",
    "1160_Aspirin_sf2_file",
    "1160_Chaos_sf2_file",
    "1160_GeneralUserGS_sf2_file",
    //1160_SBLive_sf2
    //1160_SoundBlasterOld_sf2
    "1161_FluidR3_GM_sf2_file",
    "1161_GeneralUserGS_sf2_file",
    //1161_SoundBlasterOld_sf2
    "1162_FluidR3_GM_sf2_file",
    "1162_GeneralUserGS_sf2_file",
    "1163_FluidR3_GM_sf2_file"
  ],
  gm_melodic_tom: [
    // Melodic Tom: Percussive
    "1170_JCLive_sf2_file",
    "1170_Aspirin_sf2_file",
    "1170_Chaos_sf2_file",
    "1170_FluidR3_GM_sf2_file",
    "1170_GeneralUserGS_sf2_file",
    //1170_SBLive_sf2
    //1170_SoundBlasterOld_sf2
    "1171_FluidR3_GM_sf2_file",
    "1171_GeneralUserGS_sf2_file",
    "1172_FluidR3_GM_sf2_file",
    "1173_FluidR3_GM_sf2_file"
  ],
  gm_synth_drum: [
    // Synth Drum: Percussive
    "1180_JCLive_sf2_file",
    "1180_Aspirin_sf2_file",
    "1180_Chaos_sf2_file",
    "1180_FluidR3_GM_sf2_file",
    "1180_GeneralUserGS_sf2_file",
    //1180_SBLive_sf2
    //1180_SoundBlasterOld_sf2
    "1181_FluidR3_GM_sf2_file",
    "1181_GeneralUserGS_sf2_file"
    //1181_SoundBlasterOld_sf
  ],
  gm_reverse_cymbal: [
    // Reverse Cymbal: Percussive
    "1190_JCLive_sf2_file",
    "1190_Aspirin_sf2_file",
    "1190_Chaos_sf2_file",
    "1190_FluidR3_GM_sf2_file",
    "1190_GeneralUserGS_sf2_file",
    //1190_SBLive_sf2
    //1190_SoundBlasterOld_sf2
    "1191_GeneralUserGS_sf2_file",
    "1192_GeneralUserGS_sf2_file",
    "1193_GeneralUserGS_sf2_file",
    "1194_GeneralUserGS_sf2_file"
  ],
  gm_guitar_fret_noise: [
    // Guitar Fret Noise: Sound effects
    "1200_JCLive_sf2_file",
    "1200_Aspirin_sf2_file",
    "1200_Chaos_sf2_file",
    "1200_FluidR3_GM_sf2_file",
    "1200_GeneralUserGS_sf2_file",
    //1200_SBLive_sf2
    //1200_SoundBlasterOld_sf2
    "1201_Aspirin_sf2_file",
    "1201_GeneralUserGS_sf2_file",
    "1202_GeneralUserGS_sf2_file"
  ],
  gm_breath_noise: [
    // Breath Noise: Sound effects
    "1210_FluidR3_GM_sf2_file",
    "1210_JCLive_sf2_file",
    "1210_Aspirin_sf2_file",
    "1210_Chaos_sf2_file",
    "1210_GeneralUserGS_sf2_file",
    //1210_SBLive_sf2
    //1210_SoundBlasterOld_sf2
    "1211_Aspirin_sf2_file",
    "1211_GeneralUserGS_sf2_file",
    "1212_GeneralUserGS_sf2_file"
  ],
  gm_seashore: [
    // Seashore: Sound effects
    "1220_JCLive_sf2_file",
    "1220_Aspirin_sf2_file",
    "1220_Chaos_sf2_file",
    "1220_FluidR3_GM_sf2_file",
    "1220_GeneralUserGS_sf2_file",
    //1220_SBLive_sf2
    //1220_SoundBlasterOld_sf2
    "1221_Aspirin_sf2_file",
    "1221_GeneralUserGS_sf2_file",
    "1221_JCLive_sf2_file",
    "1222_Aspirin_sf2_file",
    "1222_GeneralUserGS_sf2_file",
    "1223_Aspirin_sf2_file",
    "1223_GeneralUserGS_sf2_file",
    "1224_Aspirin_sf2_file",
    "1224_GeneralUserGS_sf2_file",
    "1225_GeneralUserGS_sf2_file",
    "1226_GeneralUserGS_sf2_file"
  ],
  gm_bird_tweet: [
    // Bird Tweet: Sound effects
    "1230_FluidR3_GM_sf2_file",
    "1230_JCLive_sf2_file",
    "1230_Aspirin_sf2_file",
    // '1230_Chaos_sf2_file',
    "1230_GeneralUserGS_sf2_file",
    //1230_SBLive_sf2
    //1230_SoundBlasterOld_sf2
    //'1231_Aspirin_sf2_file',
    "1231_GeneralUserGS_sf2_file",
    // dog
    // '1232_Aspirin_sf2_file',// ?
    "1232_GeneralUserGS_sf2_file",
    // horse
    // '1233_GeneralUserGS_sf2_file', //
    "1234_GeneralUserGS_sf2_file"
    // scratch
  ],
  gm_telephone: [
    // Telephone Ring: Sound effects
    "1240_JCLive_sf2_file",
    "1240_Aspirin_sf2_file",
    "1240_Chaos_sf2_file",
    "1240_FluidR3_GM_sf2_file",
    // '1240_GeneralUserGS_sf2_file',
    //1240_SBLive_sf2
    //1240_SoundBlasterOld_sf2
    "1241_Aspirin_sf2_file",
    // door?
    //'1241_GeneralUserGS_sf2_file',
    // '1242_Aspirin_sf2_file', // ?
    "1242_GeneralUserGS_sf2_file",
    // door
    "1243_Aspirin_sf2_file",
    // scratch
    "1243_GeneralUserGS_sf2_file",
    // door close?
    "1244_Aspirin_sf2_file",
    // bells
    "1244_GeneralUserGS_sf2_file"
    // bells
  ],
  gm_helicopter: [
    // Helicopter: Sound effects
    "1250_JCLive_sf2_file",
    "1250_Aspirin_sf2_file",
    // '1250_Chaos_sf2_file', // same as above
    "1250_FluidR3_GM_sf2_file",
    "1250_GeneralUserGS_sf2_file",
    //1250_SBLive_sf2
    //1250_SoundBlasterOld_sf2
    // '1251_Aspirin_sf2_file', // slooow
    "1251_FluidR3_GM_sf2_file",
    // guitar
    "1251_GeneralUserGS_sf2_file",
    // engine start with loop at end..
    "1252_Aspirin_sf2_file",
    // alien
    "1252_FluidR3_GM_sf2_file",
    // seashore
    "1252_GeneralUserGS_sf2_file",
    // carbreak
    // '1253_Aspirin_sf2_file', // plane
    "1253_GeneralUserGS_sf2_file",
    // racing car
    // '1254_Aspirin_sf2_file',
    "1254_GeneralUserGS_sf2_file",
    // breaking
    // '1255_Aspirin_sf2_file',
    "1255_GeneralUserGS_sf2_file",
    // siren
    // '1256_Aspirin_sf2_file',
    "1256_GeneralUserGS_sf2_file",
    // hmm
    // '1257_Aspirin_sf2_file',
    "1257_GeneralUserGS_sf2_file",
    // noise
    // '1258_Aspirin_sf2_file',
    "1258_GeneralUserGS_sf2_file",
    // metallic noise
    "1259_GeneralUserGS_sf2_file"
    // watery nosie
  ],
  gm_applause: [
    // Applause: Sound effects
    "1260_JCLive_sf2_file",
    "1260_Aspirin_sf2_file",
    "1260_Chaos_sf2_file",
    "1260_FluidR3_GM_sf2_file",
    "1260_GeneralUserGS_sf2_file",
    //1260_SBLive_sf2
    //1260_SoundBlasterOld_sf2
    "1261_Aspirin_sf2_file",
    "1261_GeneralUserGS_sf2_file",
    "1262_Aspirin_sf2_file",
    "1262_GeneralUserGS_sf2_file",
    "1263_Aspirin_sf2_file",
    "1263_GeneralUserGS_sf2_file",
    "1264_Aspirin_sf2_file",
    "1264_GeneralUserGS_sf2_file",
    "1265_Aspirin_sf2_file",
    "1265_GeneralUserGS_sf2_file"
  ],
  gm_gunshot: [
    // Gunshot: Sound effects
    "1270_JCLive_sf2_file",
    "1270_Aspirin_sf2_file",
    "1270_Chaos_sf2_file",
    "1270_FluidR3_GM_sf2_file",
    "1270_GeneralUserGS_sf2_file",
    //1270_SBLive_sf2
    //1270_SoundBlasterOld_sf2
    "1271_Aspirin_sf2_file",
    "1271_GeneralUserGS_sf2_file",
    "1272_Aspirin_sf2_file",
    "1272_GeneralUserGS_sf2_file",
    "1273_GeneralUserGS_sf2_file",
    "1274_GeneralUserGS_sf2_file",
    ""
  ]
};
let defaultSoundfontUrl = "https://felixroos.github.io/webaudiofontdata/sound", soundfontUrl = defaultSoundfontUrl;
function setSoundfontUrl(e) {
  soundfontUrl = e;
}
let loadCache = {};
async function loadFont(name) {
  if (loadCache[name])
    return loadCache[name];
  const load = async () => {
    const url = `${soundfontUrl}/${name}.js`, preset = await fetch(url).then((e) => e.text());
    let [_, data] = preset.split("={");
    return eval("{" + data);
  };
  return loadCache[name] = load(), loadCache[name];
}
async function getFontBufferSource(e, t, a) {
  let { note: o = "c3", freq: u } = t, l;
  if (u)
    l = freqToMidi$2(u);
  else if (typeof o == "string")
    l = noteToMidi$1(o);
  else if (typeof o == "number")
    l = o;
  else
    throw new Error(`unexpected "note" type "${typeof o}"`);
  const { buffer: f, zone: p } = await getFontPitch(e, l, a), g = a.createBufferSource();
  g.buffer = f;
  const d = p.originalPitch - 100 * p.coarseTune - p.fineTune, b = 1 * Math.pow(2, (100 * l - d) / 1200);
  return g.playbackRate.value = b, p.loopStart > 1 && p.loopStart < p.loopEnd && (g.loop = !0, g.loopStart = p.loopStart / p.sampleRate, g.loopEnd = p.loopEnd / p.sampleRate), g;
}
let bufferCache = {};
async function getFontPitch(e, t, a) {
  const o = `${e}:::${t}`;
  if (bufferCache[o])
    return bufferCache[o];
  const u = async () => {
    const l = await loadFont(e);
    if (!l)
      throw new Error(`Could not load soundfont ${e}`);
    const f = findZone(l, t);
    if (!f)
      throw new Error("no soundfont zone found for preset ", e, "pitch", t);
    const p = await getBuffer(f, a);
    if (!p)
      throw new Error(`no soundfont buffer found for preset ${e}, pitch: ${t}`);
    return { buffer: p, zone: f };
  };
  return bufferCache[o] = u(), bufferCache[o];
}
function findZone(e, t) {
  return e.find((a) => a.keyRangeLow <= t && a.keyRangeHigh + 1 >= t);
}
async function getBuffer(e, t) {
  if (e.sample) {
    console.warn("zone.sample untested!");
    const o = atob(e.sample);
    e.buffer = t.createBuffer(1, o.length / 2, e.sampleRate);
    const u = e.buffer.getChannelData(0);
    let l, f, p;
    for (var a = 0; a < o.length / 2; a++)
      l = o.charCodeAt(a * 2), f = o.charCodeAt(a * 2 + 1), l < 0 && (l = 256 + l), f < 0 && (f = 256 + f), p = f * 256 + l, p >= 65536 / 2 && (p = p - 65536), u[a] = p / 65536;
  } else if (e.file) {
    const o = e.file.length, u = new ArrayBuffer(o), l = new Uint8Array(u), f = atob(e.file);
    let p;
    for (let g = 0; g < f.length; g++)
      p = f.charCodeAt(g), l[g] = p;
    return new Promise((g) => t.decodeAudioData(u, g));
  }
}
function registerSoundfonts() {
  Object.entries(gm).forEach(([e, t]) => {
    registerSound(
      e,
      async (a, o, u) => {
        const [l, f, p, g] = getADSRValues([
          o.attack,
          o.decay,
          o.sustain,
          o.release
        ]), { duration: d } = o, b = getSoundIndex$1(o.n, t.length), F = t[b], E = getAudioContext(), S = await getFontBufferSource(F, o, E);
        S.start(a);
        const R = E.createGain(), k = S.connect(R), I = a + d;
        getParamADSR(k.gain, l, f, p, g, 0, 0.3, a, I, "linear");
        let V = I + g + 0.01, U = getVibratoOscillator(S.detune, o, a);
        getPitchEnvelope(S.detune, o, a, I), S.stop(V);
        const q = (H) => {
        };
        return S.onended = () => {
          S.disconnect(), U?.stop(), k.disconnect(), u();
        }, { node: k, stop: q };
      },
      { type: "soundfont", prebake: !0, fonts: t }
    );
  });
}
const instruments = [
  // Acoustic Grand Piano: Piano
  "0000_JCLive_sf2_file",
  "0000_Aspirin_sf2_file",
  "0000_Chaos_sf2_file",
  "0000_FluidR3_GM_sf2_file",
  "0000_GeneralUserGS_sf2_file",
  //'0000_SBLive_sf2',
  //'0000_SoundBlasterOld_sf2',
  "0001_FluidR3_GM_sf2_file",
  "0001_GeneralUserGS_sf2_file",
  // Bright Acoustic Piano: Piano
  "0010_Aspirin_sf2_file",
  "0010_Chaos_sf2_file",
  "0010_FluidR3_GM_sf2_file",
  "0010_GeneralUserGS_sf2_file",
  "0010_JCLive_sf2_file",
  //'0010_SBLive_sf2',
  //'0010_SoundBlasterOld_sf2',
  "0011_Aspirin_sf2_file",
  "0011_FluidR3_GM_sf2_file",
  "0011_GeneralUserGS_sf2_file",
  "0012_GeneralUserGS_sf2_file",
  // string??
  // Electric Grand Piano: Piano
  "0020_Aspirin_sf2_file",
  "0020_Chaos_sf2_file",
  "0020_FluidR3_GM_sf2_file",
  "0020_GeneralUserGS_sf2_file",
  "0020_JCLive_sf2_file",
  //'0020_SBLive_sf2',
  //'0020_SoundBlasterOld_sf2',
  "0021_Aspirin_sf2_file",
  "0021_GeneralUserGS_sf2_file",
  // ?
  "0022_Aspirin_sf2_file",
  // dx7 epiano like
  // Honky-tonk Piano: Piano
  "0030_Aspirin_sf2_file",
  "0030_Chaos_sf2_file",
  "0030_FluidR3_GM_sf2_file",
  "0030_GeneralUserGS_sf2_file",
  "0030_JCLive_sf2_file",
  //'0030_SBLive_sf2',
  //'0030_SoundBlasterOld_sf2',
  "0031_Aspirin_sf2_file",
  "0031_FluidR3_GM_sf2_file",
  "0031_GeneralUserGS_sf2_file",
  //'0031_SoundBlasterOld_sf2', // pianos until here
  // Electric Piano 1: Piano
  "0040_Aspirin_sf2_file",
  "0040_Chaos_sf2_file",
  "0040_FluidR3_GM_sf2_file",
  // rhodes
  "0040_GeneralUserGS_sf2_file",
  // staccato rhodes
  "0040_JCLive_sf2_file",
  // warbly rhodes
  //'0040_SBLive_sf2', // ?
  //'0040_SoundBlasterOld_sf2', // ?
  "0041_FluidR3_GM_sf2_file",
  // rhodes
  "0041_GeneralUserGS_sf2_file",
  // staccato rhodes
  //'0041_SoundBlasterOld_sf2', // ?
  "0042_GeneralUserGS_sf2_file",
  // staccato wurly
  "0043_GeneralUserGS_sf2_file",
  // high bell
  "0044_GeneralUserGS_sf2_file",
  // reed organ
  //'0045_GeneralUserGS_sf2_file', // ?
  "0046_GeneralUserGS_sf2_file",
  // reed organ
  // Electric Piano 2: Piano
  "0050_Aspirin_sf2_file",
  // glass piano
  "0050_Chaos_sf2_file",
  // short glass piano
  "0050_FluidR3_GM_sf2_file",
  // long glass piano !
  // ?
  "0050_GeneralUserGS_sf2_file",
  // short glass piano
  // cont
  "0050_JCLive_sf2_file",
  // glass piano
  //'0050_SBLive_sf2', // ?
  //'0050_SoundBlasterOld_sf2', // ?
  "0051_FluidR3_GM_sf2_file",
  // long lass organ
  "0051_GeneralUserGS_sf2_file",
  //'0052_GeneralUserGS_sf2_file', // ?
  "0053_GeneralUserGS_sf2_file",
  // normal piano...
  "0054_GeneralUserGS_sf2_file",
  // piano
  // Harpsichord: Piano
  "0060_Aspirin_sf2_file",
  // harpsichord
  "0060_Chaos_sf2_file",
  "0060_FluidR3_GM_sf2_file",
  // harpsichord !
  "0060_GeneralUserGS_sf2_file",
  "0060_JCLive_sf2_file",
  //'0060_SBLive_sf2',
  //'0060_SoundBlasterOld_sf2',
  "0061_Aspirin_sf2_file",
  "0061_GeneralUserGS_sf2_file",
  //'0061_SoundBlasterOld_sf2',
  "0062_GeneralUserGS_sf2_file",
  // Clavinet: Piano
  "0070_Aspirin_sf2_file",
  "0070_Chaos_sf2_file",
  "0070_FluidR3_GM_sf2_file",
  // '0070_GeneralUserGS_sf2_file', // half broken
  "0070_JCLive_sf2_file",
  //'0070_SBLive_sf2',
  //'0070_SoundBlasterOld_sf2',
  // '0071_GeneralUserGS_sf2_file', // half broken
  // Celesta: Chromatic Percussion
  "0080_Aspirin_sf2_file",
  "0080_Chaos_sf2_file",
  "0080_FluidR3_GM_sf2_file",
  "0080_GeneralUserGS_sf2_file",
  "0080_JCLive_sf2_file",
  //'0080_SBLive_sf2',
  //'0080_SoundBlasterOld_sf2',
  "0081_FluidR3_GM_sf2_file",
  // '0081_GeneralUserGS_sf2_file', // weird detuned
  //'0081_SoundBlasterOld_sf2',
  // Glockenspiel: Chromatic Percussion
  "0090_Aspirin_sf2_file",
  "0090_Chaos_sf2_file",
  "0090_FluidR3_GM_sf2_file",
  "0090_GeneralUserGS_sf2_file",
  "0090_JCLive_sf2_file",
  //'0090_SBLive_sf2',
  //'0090_SoundBlasterOld_sf2',
  //'0091_SoundBlasterOld_sf2',
  // Music Box: Chromatic Percussion
  "0100_Aspirin_sf2_file",
  "0100_Chaos_sf2_file",
  "0100_FluidR3_GM_sf2_file",
  "0100_GeneralUserGS_sf2_file",
  "0100_JCLive_sf2_file",
  //'0100_SBLive_sf2',
  //'0100_SoundBlasterOld_sf2',
  // '0101_GeneralUserGS_sf2_file', // weird detuned
  //'0101_SoundBlasterOld_sf2',
  // Vibraphone: Chromatic Percussion
  "0110_Aspirin_sf2_file",
  "0110_Chaos_sf2_file",
  "0110_FluidR3_GM_sf2_file",
  "0110_GeneralUserGS_sf2_file",
  "0110_JCLive_sf2_file",
  //'0110_SBLive_sf2',
  //'0110_SoundBlasterOld_sf2',
  "0111_FluidR3_GM_sf2_file",
  // Marimba: Chromatic Percussion
  "0120_Aspirin_sf2_file",
  "0120_Chaos_sf2_file",
  "0120_FluidR3_GM_sf2_file",
  "0120_GeneralUserGS_sf2_file",
  "0120_JCLive_sf2_file",
  //'0120_SBLive_sf2',
  //'0120_SoundBlasterOld_sf2',
  "0121_FluidR3_GM_sf2_file",
  "0121_GeneralUserGS_sf2_file",
  // not really a marimba
  // Xylophone: Chromatic Percussion
  "0130_Aspirin_sf2_file",
  "0130_Chaos_sf2_file",
  "0130_FluidR3_GM_sf2_file",
  "0130_GeneralUserGS_sf2_file",
  "0130_JCLive_sf2_file",
  //'0130_SBLive_sf2',
  //'0130_SoundBlasterOld_sf2',
  "0131_FluidR3_GM_sf2_file",
  // Tubular Bells: Chromatic Percussion
  "0140_Aspirin_sf2_file",
  // '0140_Chaos_sf2_file', // same as aspirin?
  "0140_FluidR3_GM_sf2_file",
  "0140_GeneralUserGS_sf2_file",
  "0140_JCLive_sf2_file",
  //'0140_SBLive_sf2',
  //'0140_SoundBlasterOld_sf2',
  "0141_FluidR3_GM_sf2_file",
  //'0141_GeneralUserGS_sf2_file',
  "0142_GeneralUserGS_sf2_file",
  // epiano..
  // '0143_GeneralUserGS_sf2_file', // buggy
  // Dulcimer: Chromatic Percussion
  "0150_Aspirin_sf2_file",
  "0150_Chaos_sf2_file",
  // long load?
  "0150_FluidR3_GM_sf2_file",
  "0150_GeneralUserGS_sf2_file",
  // '0150_JCLive_sf2_file', // detuned???
  //'0150_SBLive_sf2',
  //'0150_SoundBlasterOld_sf2',
  "0151_FluidR3_GM_sf2_file",
  // Drawbar Organ: Organ
  "0160_Aspirin_sf2_file",
  "0160_Chaos_sf2_file",
  "0160_FluidR3_GM_sf2_file",
  "0160_GeneralUserGS_sf2_file",
  "0160_JCLive_sf2_file",
  //'0160_SBLive_sf2',
  //'0160_SoundBlasterOld_sf2',
  "0161_Aspirin_sf2_file",
  "0161_FluidR3_GM_sf2_file",
  //'0161_SoundBlasterOld_sf2',
  // Percussive Organ: Organ
  "0170_Aspirin_sf2_file",
  "0170_Chaos_sf2_file",
  "0170_FluidR3_GM_sf2_file",
  // '0170_GeneralUserGS_sf2_file', // repitched
  "0170_JCLive_sf2_file",
  //'0170_SBLive_sf2',
  //'0170_SoundBlasterOld_sf2',
  "0171_FluidR3_GM_sf2_file",
  // '0171_GeneralUserGS_sf2_file',  // repitched
  "0172_FluidR3_GM_sf2_file",
  // Rock Organ: Organ
  "0180_Aspirin_sf2_file",
  "0180_Chaos_sf2_file",
  "0180_FluidR3_GM_sf2_file",
  "0180_GeneralUserGS_sf2_file",
  "0180_JCLive_sf2_file",
  //'0180_SBLive_sf2',
  //'0180_SoundBlasterOld_sf2',
  //'0181_Aspirin_sf2_file', // flute
  //'0181_GeneralUserGS_sf2_file', // marimbalike
  //'0181_SoundBlasterOld_sf2',
  // Church Organ: Organ
  "0190_Aspirin_sf2_file",
  "0190_Chaos_sf2_file",
  "0190_FluidR3_GM_sf2_file",
  "0190_GeneralUserGS_sf2_file",
  "0190_JCLive_sf2_file",
  //'0190_SBLive_sf2',
  //'0190_SoundBlasterOld_sf2',
  //'0191_Aspirin_sf2_file', // string??
  //'0191_GeneralUserGS_sf2_file', // weird organ
  //'0191_SoundBlasterOld_sf2',
  // Reed Organ: Organ
  "0200_Aspirin_sf2_file",
  "0200_Chaos_sf2_file",
  "0200_FluidR3_GM_sf2_file",
  "0200_GeneralUserGS_sf2_file",
  "0200_JCLive_sf2_file",
  // stringy
  //'0200_SBLive_sf2',
  //'0200_SoundBlasterOld_sf2',
  "0201_Aspirin_sf2_file",
  // stringy
  "0201_FluidR3_GM_sf2_file",
  "0201_GeneralUserGS_sf2_file",
  //'0201_SoundBlasterOld_sf2',
  //'0210_Aspirin_sf2_file', // buggy
  //'0210_Chaos_sf2_file', // buggy
  // Accordion: Organ
  "0210_FluidR3_GM_sf2_file",
  "0210_GeneralUserGS_sf2_file",
  "0210_JCLive_sf2_file",
  //'0210_SBLive_sf2',
  //'0210_SoundBlasterOld_sf2',
  "0211_Aspirin_sf2_file",
  // stringy
  "0211_FluidR3_GM_sf2_file",
  "0211_GeneralUserGS_sf2_file",
  //'0211_SoundBlasterOld_sf2',
  "0212_GeneralUserGS_sf2_file",
  // Harmonica: Organ
  "0220_Aspirin_sf2_file",
  "0220_Chaos_sf2_file",
  "0220_FluidR3_GM_sf2_file",
  "0220_GeneralUserGS_sf2_file",
  "0220_JCLive_sf2_file",
  //'0220_SBLive_sf2',
  //'0220_SoundBlasterOld_sf2',
  "0221_FluidR3_GM_sf2_file",
  // Tango Accordion: Organ
  "0230_Aspirin_sf2_file",
  "0230_Chaos_sf2_file",
  "0230_FluidR3_GM_sf2_file",
  "0230_GeneralUserGS_sf2_file",
  "0230_JCLive_sf2_file",
  //'0230_SBLive_sf2',
  //'0230_SoundBlasterOld_sf2',
  "0231_FluidR3_GM_sf2_file",
  "0231_GeneralUserGS_sf2_file",
  // warbly
  "0231_JCLive_sf2_file",
  //'0231_SoundBlasterOld_sf2',
  "0232_FluidR3_GM_sf2_file",
  "0233_FluidR3_GM_sf2_file",
  // Acoustic Guitar (nylon): Guitar
  "0240_Aspirin_sf2_file",
  "0240_Chaos_sf2_file",
  "0240_FluidR3_GM_sf2_file",
  "0240_GeneralUserGS_sf2_file",
  "0240_JCLive_sf2_file",
  "0240_LK_Godin_Nylon_SF2_file",
  //'0240_SBLive_sf2',
  //'0240_SoundBlasterOld_sf2',
  // '0241_GeneralUserGS_sf2_file', // organ like
  "0241_JCLive_sf2_file",
  "0242_JCLive_sf2_file",
  "0243_JCLive_sf2_file",
  // Acoustic Guitar (steel): Guitar
  "0253_Acoustic_Guitar_sf2_file",
  "0250_Aspirin_sf2_file",
  "0250_Chaos_sf2_file",
  "0250_FluidR3_GM_sf2_file",
  "0250_GeneralUserGS_sf2_file",
  // '0250_JCLive_sf2_file', // detuned
  "0250_LK_AcousticSteel_SF2_file",
  //'0250_SBLive_sf2',
  //'0250_SoundBlasterOld_sf2',
  //'0251_Acoustic_Guitar_sf2_file', // detuned?
  // '0251_GeneralUserGS_sf2_file', // broken: missing pitches
  // '0252_Acoustic_Guitar_sf2_file', // detuned..
  // '0252_GeneralUserGS_sf2_file', // broken: missing pitches
  "0253_Acoustic_Guitar_sf2_file",
  "0253_GeneralUserGS_sf2_file",
  "0254_Acoustic_Guitar_sf2_file",
  // bends.. detuned
  "0254_GeneralUserGS_sf2_file",
  //'0255_GeneralUserGS_sf2_file', // no guitar..
  // Electric Guitar (jazz): Guitar
  "0260_Aspirin_sf2_file",
  // sounds like an epiano
  "0260_Chaos_sf2_file",
  // weird but cool detune
  "0260_FluidR3_GM_sf2_file",
  "0260_GeneralUserGS_sf2_file",
  "0260_JCLive_sf2_file",
  //'0260_SBLive_sf2',
  //'0260_SoundBlasterOld_sf2',
  "0260_Stratocaster_sf2_file",
  // -1 octave
  "0261_GeneralUserGS_sf2_file",
  //'0261_SoundBlasterOld_sf2',
  "0261_Stratocaster_sf2_file",
  // -1 octave
  "0262_Stratocaster_sf2_file",
  // -1 octave
  // Electric Guitar (clean): Guitar
  "0270_Aspirin_sf2_file",
  "0270_Chaos_sf2_file",
  // sounds meh
  "0270_FluidR3_GM_sf2_file",
  "0270_GeneralUserGS_sf2_file",
  //'0270_Gibson_Les_Paul_sf2_file', // detuned
  // '0270_JCLive_sf2_file', // broken: missing notes
  "0270_SBAWE32_sf2_file",
  //'0270_SBLive_sf2',
  //'0270_SoundBlasterOld_sf2',
  "0270_Stratocaster_sf2_file",
  // -1 octave
  "0271_GeneralUserGS_sf2_file",
  "0271_Stratocaster_sf2_file",
  // -1 octave
  "0272_Stratocaster_sf2_file",
  // -1 octave
  // Electric Guitar (muted): Guitar
  "0280_Aspirin_sf2_file",
  "0280_Chaos_sf2_file",
  // '0280_FluidR3_GM_sf2_file', // broken: wrong notes
  "0280_GeneralUserGS_sf2_file",
  "0280_JCLive_sf2_file",
  //'0280_LesPaul_sf2', // missing
  "0280_LesPaul_sf2_file",
  // not really muted..
  "0280_SBAWE32_sf2_file",
  //'0280_SBLive_sf2',
  //'0280_SoundBlasterOld_sf2',
  "0281_Aspirin_sf2_file",
  "0281_FluidR3_GM_sf2_file",
  "0281_GeneralUserGS_sf2_file",
  "0282_FluidR3_GM_sf2_file",
  // '0282_GeneralUserGS_sf2_file', // broken: missing notes
  // '0283_GeneralUserGS_sf2_file', // missing
  // Overdriven Guitar: Guitar
  "0290_Aspirin_sf2_file",
  "0290_Chaos_sf2_file",
  "0290_FluidR3_GM_sf2_file",
  "0290_GeneralUserGS_sf2_file",
  //'0290_JCLive_sf2_file', // detuned....
  //'0290_LesPaul_sf2', // broken
  "0290_LesPaul_sf2_file",
  "0290_SBAWE32_sf2_file",
  //'0290_SBLive_sf2',
  //'0290_SoundBlasterOld_sf2',
  // '0291_Aspirin_sf2_file', // broken
  // '0291_LesPaul_sf2', // broken
  "0291_LesPaul_sf2_file",
  "0291_SBAWE32_sf2_file",
  //'0291_SoundBlasterOld_sf2',
  "0292_Aspirin_sf2_file",
  // '0292_LesPaul_sf2', // broken
  "0292_LesPaul_sf2_file",
  // Distortion Guitar: Guitar
  "0300_Aspirin_sf2_file",
  "0300_Chaos_sf2_file",
  "0300_FluidR3_GM_sf2_file",
  "0300_GeneralUserGS_sf2_file",
  // '0300_JCLive_sf2_file', // broken
  // '0300_LesPaul_sf2', // broken
  "0300_LesPaul_sf2_file",
  //'0300_SBAWE32_sf2_file', // -2 octave
  //'0300_SBLive_sf2',
  //'0300_SoundBlasterOld_sf2',
  // '0301_Aspirin_sf2_file', // missing
  //'0301_FluidR3_GM_sf2_file', // weird broken bell
  // '0301_GeneralUserGS_sf2_file', // broken
  // '0301_JCLive_sf2_file', // broken
  // '0301_LesPaul_sf2', // missing
  // '0301_LesPaul_sf2_file', // + 1 oct?
  "0302_Aspirin_sf2_file",
  // '0302_GeneralUserGS_sf2_file', // not a guitar..
  //'0302_JCLive_sf2_file', // broken...
  // '0303_Aspirin_sf2_file', // guitar harmonic??
  "0304_Aspirin_sf2_file",
  // Guitar Harmonics: Guitar
  "0310_Aspirin_sf2_file",
  "0310_Chaos_sf2_file",
  "0310_FluidR3_GM_sf2_file",
  // weird..
  //'0310_GeneralUserGS_sf2_file', // weird..
  // '0310_JCLive_sf2_file', // weird
  //'0310_LesPaul_sf2', // missing
  //'0310_LesPaul_sf2_file', // wrong pitches
  //'0310_SBAWE32_sf2_file', // wrong pitches
  //'0310_SBLive_sf2',
  //'0310_SoundBlasterOld_sf2',
  //'0311_FluidR3_GM_sf2_file', // knackt
  //'0311_GeneralUserGS_sf2_file', // wrong notes
  // Acoustic Bass: Bass
  "0320_Aspirin_sf2_file",
  "0320_Chaos_sf2_file",
  "0320_FluidR3_GM_sf2_file",
  // '0320_GeneralUserGS_sf2_file', // missing notes
  "0320_JCLive_sf2_file",
  //'0320_SBLive_sf2',
  //'0320_SoundBlasterOld_sf2',
  // '0321_GeneralUserGS_sf2_file', // nice sound but missing notes
  // '0322_GeneralUserGS_sf2_file', // missing notes
  // Electric Bass (finger): Bass
  "0330_Aspirin_sf2_file",
  //'0330_Chaos_sf2_file', // same as last
  "0330_FluidR3_GM_sf2_file",
  // knackt..
  "0330_GeneralUserGS_sf2_file",
  // -1 oct
  "0330_JCLive_sf2_file",
  //'0330_SBLive_sf2',
  //'0330_SoundBlasterOld_sf2',
  //'0331_GeneralUserGS_sf2_file', // knackt
  // '0332_GeneralUserGS_sf2_file', // missing
  // Electric Bass (pick): Bass
  "0340_Aspirin_sf2_file",
  //'0340_Chaos_sf2_file', // same as last
  "0340_FluidR3_GM_sf2_file",
  "0340_GeneralUserGS_sf2_file",
  // -1oct
  "0340_JCLive_sf2_file",
  //'0340_SBLive_sf2',
  //'0340_SoundBlasterOld_sf2',
  "0341_Aspirin_sf2_file",
  //'0341_GeneralUserGS_sf2_file', // knackt
  // Fretless Bass: Bass
  "0350_Aspirin_sf2_file",
  // '0350_Chaos_sf2_file', // same as last
  //'0350_FluidR3_GM_sf2_file', // knackt
  //'0350_GeneralUserGS_sf2_file', // -1 oct + knackt
  "0350_JCLive_sf2_file",
  // weird detuned
  //'0350_SBLive_sf2',
  //'0350_SoundBlasterOld_sf2',
  //'0351_GeneralUserGS_sf2_file', // missing
  // Slap Bass 1: Bass
  "0360_Aspirin_sf2_file",
  "0360_Chaos_sf2_file",
  "0360_FluidR3_GM_sf2_file",
  // knackt
  //'0360_GeneralUserGS_sf2_file', // -1 oct
  "0360_JCLive_sf2_file",
  //'0360_SBLive_sf2',
  //'0360_SoundBlasterOld_sf2',
  //'0361_GeneralUserGS_sf2_file', // missing
  // Slap Bass 2: Bass
  "0370_Aspirin_sf2_file",
  // '0370_Chaos_sf2_file', // same as last
  "0370_FluidR3_GM_sf2_file",
  "0370_GeneralUserGS_sf2_file",
  "0370_JCLive_sf2_file",
  //'0370_SBLive_sf2',
  //'0370_SoundBlasterOld_sf2',
  //'0371_GeneralUserGS_sf2_file', // missing
  //'0372_GeneralUserGS_sf2_file', // detuned
  //'0385_GeneralUserGS_sf2_file', // missing
  // Synth Bass 1: Bass
  "0380_Aspirin_sf2_file",
  // laut!
  "0380_Chaos_sf2_file",
  "0380_FluidR3_GM_sf2_file",
  // bisl detuned
  // '0380_GeneralUserGS_sf2_file', // laut
  "0380_JCLive_sf2_file",
  //'0380_SBLive_sf2',
  //'0380_SoundBlasterOld_sf2',
  "0381_FluidR3_GM_sf2_file",
  // bisl detuned
  "0381_GeneralUserGS_sf2_file",
  //'0382_FluidR3_GM_sf2_file', // kein synth bass
  "0382_GeneralUserGS_sf2_file",
  "0383_GeneralUserGS_sf2_file",
  "0384_GeneralUserGS_sf2_file",
  //'0386_GeneralUserGS_sf2_file', // knackt
  "0387_GeneralUserGS_sf2_file",
  // Synth Bass 2: Bass
  "0390_Aspirin_sf2_file",
  // '0390_Chaos_sf2_file', // same as last
  "0390_FluidR3_GM_sf2_file",
  "0390_GeneralUserGS_sf2_file",
  "0390_JCLive_sf2_file",
  //'0390_SBLive_sf2',
  //'0390_SoundBlasterOld_sf2',
  "0391_FluidR3_GM_sf2_file",
  // lauuut
  // '0391_GeneralUserGS_sf2_file', // missing
  //'0391_SoundBlasterOld_sf2',
  "0392_FluidR3_GM_sf2_file",
  // lauut
  //'0392_GeneralUserGS_sf2_file', // kein synth und -1oct
  "0393_GeneralUserGS_sf2_file",
  // lauuuut
  // Violin: Strings
  "0400_Aspirin_sf2_file",
  "0400_Chaos_sf2_file",
  "0400_FluidR3_GM_sf2_file",
  "0400_GeneralUserGS_sf2_file",
  "0400_JCLive_sf2_file",
  //'0400_SBLive_sf2',
  //'0400_SoundBlasterOld_sf2',
  "0401_Aspirin_sf2_file",
  // synth
  "0401_FluidR3_GM_sf2_file",
  "0401_GeneralUserGS_sf2_file",
  "0402_GeneralUserGS_sf2_file",
  // pizzicato
  // Viola: Strings
  "0410_Aspirin_sf2_file",
  // '0410_Chaos_sf2_file', // laut und sehr unstringy
  "0410_FluidR3_GM_sf2_file",
  "0410_GeneralUserGS_sf2_file",
  "0410_JCLive_sf2_file",
  // <3
  //'0410_SBLive_sf2',
  //'0410_SoundBlasterOld_sf2',
  "0411_FluidR3_GM_sf2_file",
  // Cello: Strings
  "0420_Aspirin_sf2_file",
  // '0420_Chaos_sf2_file', // kein cello und laut
  "0420_FluidR3_GM_sf2_file",
  "0420_GeneralUserGS_sf2_file",
  "0420_JCLive_sf2_file",
  //'0420_SBLive_sf2',
  //'0420_SoundBlasterOld_sf2',
  "0421_FluidR3_GM_sf2_file",
  "0421_GeneralUserGS_sf2_file",
  // pizzicato
  // Contrabass: Strings
  "0430_Aspirin_sf2_file",
  "0430_Chaos_sf2_file",
  // '0430_FluidR3_GM_sf2_file', // missing notes
  "0430_GeneralUserGS_sf2_file",
  //'0430_JCLive_sf2_file', // -1 oct und meh
  //'0430_SBLive_sf2',
  //'0430_SoundBlasterOld_sf2',
  // '0431_FluidR3_GM_sf2_file', // missing notes
  // Tremolo Strings: Strings
  "0440_Aspirin_sf2_file",
  "0440_Chaos_sf2_file",
  //'0440_FluidR3_GM_sf2_file', // huuuge
  "0440_GeneralUserGS_sf2_file",
  "0440_JCLive_sf2_file",
  //'0440_SBLive_sf2',
  //'0440_SoundBlasterOld_sf2',
  "0441_GeneralUserGS_sf2_file",
  "0442_GeneralUserGS_sf2_file",
  // Pizzicato Strings: Strings
  "0450_Aspirin_sf2_file",
  "0450_Chaos_sf2_file",
  // same as last
  "0450_FluidR3_GM_sf2_file",
  // chrono trigger flashback
  "0450_GeneralUserGS_sf2_file",
  // -1 oct?
  "0450_JCLive_sf2_file",
  // filter env
  //'0450_SBLive_sf2',
  //'0450_SoundBlasterOld_sf2',
  "0451_FluidR3_GM_sf2_file",
  // Orchestral Harp: Strings
  "0460_Aspirin_sf2_file",
  // '0460_Chaos_sf2_file', // knackt
  "0460_FluidR3_GM_sf2_file",
  "0460_GeneralUserGS_sf2_file",
  "0460_JCLive_sf2_file",
  //'0460_SBLive_sf2',
  //'0460_SoundBlasterOld_sf2',
  "0461_FluidR3_GM_sf2_file",
  // Timpani: Strings
  "0470_Aspirin_sf2_file",
  "0470_Chaos_sf2_file",
  "0470_FluidR3_GM_sf2_file",
  "0470_GeneralUserGS_sf2_file",
  // '0470_JCLive_sf2_file', // wrong pitches
  //'0470_SBLive_sf2',
  //'0470_SoundBlasterOld_sf2',
  "0471_FluidR3_GM_sf2_file",
  "0471_GeneralUserGS_sf2_file",
  // String Ensemble 1: Ensemble
  "0480_Aspirin_sf2_file",
  "0480_Chaos_sf2_file",
  "0480_FluidR3_GM_sf2_file",
  // large
  "0480_GeneralUserGS_sf2_file",
  "0480_JCLive_sf2_file",
  //'0480_SBLive_sf2',
  //'0480_SoundBlasterOld_sf2',
  // these dont work..
  //'04810_GeneralUserGS_sf2_file', // missing notes + brass
  //'04811_GeneralUserGS_sf2_file',  // missing notes + brass
  //'04812_GeneralUserGS_sf2_file',
  //'04813_GeneralUserGS_sf2_file',
  //'04814_GeneralUserGS_sf2_file',
  //'04815_GeneralUserGS_sf2_file',
  //'04816_GeneralUserGS_sf2_file',
  //'04817_GeneralUserGS_sf2_file',
  "0481_Aspirin_sf2_file",
  "0481_FluidR3_GM_sf2_file",
  // brass
  "0481_GeneralUserGS_sf2_file",
  "0482_Aspirin_sf2_file",
  // brass
  "0482_GeneralUserGS_sf2_file",
  "0483_GeneralUserGS_sf2_file",
  // brass
  // another block of buggyness:
  //'0484_GeneralUserGS_sf2_file', // keys?! + knackt
  //'0485_GeneralUserGS_sf2_file', // missing notes
  //'0486_GeneralUserGS_sf2_file',
  //'0487_GeneralUserGS_sf2_file',
  //'0488_GeneralUserGS_sf2_file',
  //'0489_GeneralUserGS_sf2_file',
  // String Ensemble 2: Ensemble
  "0490_Aspirin_sf2_file",
  "0490_Chaos_sf2_file",
  "0490_FluidR3_GM_sf2_file",
  // large
  "0490_GeneralUserGS_sf2_file",
  "0490_JCLive_sf2_file",
  //'0490_SBLive_sf2',
  //'0490_SoundBlasterOld_sf2',
  "0491_GeneralUserGS_sf2_file",
  "0492_GeneralUserGS_sf2_file",
  // Synth Strings 1: Ensemble
  "0500_Aspirin_sf2_file",
  // '0500_Chaos_sf2_file', // same as above
  //'0500_FluidR3_GM_sf2_file', // detune + knack
  "0500_GeneralUserGS_sf2_file",
  "0500_JCLive_sf2_file",
  //'0500_SBLive_sf2',
  //'0500_SoundBlasterOld_sf2',
  "0501_FluidR3_GM_sf2_file",
  // '0501_GeneralUserGS_sf2_file', // crackles
  // '0502_FluidR3_GM_sf2_file', // missing
  "0502_GeneralUserGS_sf2_file",
  "0503_FluidR3_GM_sf2_file",
  // large
  // '0504_FluidR3_GM_sf2_file', // missing
  "0505_FluidR3_GM_sf2_file",
  // Synth Strings 2: Ensemble
  "0510_Aspirin_sf2_file",
  "0510_Chaos_sf2_file",
  // '0510_FluidR3_GM_sf2_file', // detune + crackle
  "0510_GeneralUserGS_sf2_file",
  //'0510_JCLive_sf2_file', // laarge and meh
  //'0510_SBLive_sf2', // missing
  //'0510_SoundBlasterOld_sf2',
  "0511_GeneralUserGS_sf2_file",
  // crackly
  //'0511_SoundBlasterOld_sf2',
  // Choir Aahs: Ensemble
  "0520_Aspirin_sf2_file",
  "0520_Chaos_sf2_file",
  "0520_FluidR3_GM_sf2_file",
  "0520_GeneralUserGS_sf2_file",
  "0520_JCLive_sf2_file",
  //'0520_SBLive_sf2',
  "0520_Soul_Ahhs_sf2_file",
  // large
  //'0520_SoundBlasterOld_sf2',
  "0521_FluidR3_GM_sf2_file",
  "0521_Soul_Ahhs_sf2_file",
  // large
  //'0521_SoundBlasterOld_sf2',
  "0522_Soul_Ahhs_sf2_file",
  // large
  // Voice Oohs: Ensemble
  "0530_Aspirin_sf2_file",
  "0530_Chaos_sf2_file",
  "0530_FluidR3_GM_sf2_file",
  "0530_GeneralUserGS_sf2_file",
  //'0530_JCLive_sf2_file', // same as above
  //'0530_SBLive_sf2',
  // '0530_Soul_Ahhs_sf2_file', // not ooh
  //'0530_SoundBlasterOld_sf2',
  "0531_FluidR3_GM_sf2_file",
  // '0531_GeneralUserGS_sf2_file', // ends crackle
  "0531_JCLive_sf2_file",
  //'0531_SoundBlasterOld_sf2',
  // Synth Choir: Ensemble
  "0540_Aspirin_sf2_file",
  "0540_Chaos_sf2_file",
  "0540_FluidR3_GM_sf2_file",
  "0540_GeneralUserGS_sf2_file",
  //'0540_JCLive_sf2_file', // large + crackles
  //'0540_SBLive_sf2',
  //'0540_SoundBlasterOld_sf2',
  "0541_FluidR3_GM_sf2_file",
  // Orchestra Hit: Ensemble
  "0550_Aspirin_sf2_file",
  "0550_Chaos_sf2_file",
  "0550_FluidR3_GM_sf2_file",
  "0550_GeneralUserGS_sf2_file",
  //'0550_JCLive_sf2_file', // same as above
  //'0550_SBLive_sf2',
  //'0550_SoundBlasterOld_sf2',
  //'0551_Aspirin_sf2_file', // not an orch hit..
  "0551_FluidR3_GM_sf2_file",
  // Trumpet: Brass
  "0560_Aspirin_sf2_file",
  "0560_Chaos_sf2_file",
  "0560_FluidR3_GM_sf2_file",
  //'0560_GeneralUserGS_sf2_file', // -1 oct
  "0560_JCLive_sf2_file",
  //'0560_SBLive_sf2',
  //'0560_SoundBlasterOld_sf2',
  // Trombone: Brass
  "0570_Aspirin_sf2_file",
  "0570_Chaos_sf2_file",
  "0570_FluidR3_GM_sf2_file",
  "0570_GeneralUserGS_sf2_file",
  //'0570_JCLive_sf2_file', // -1oct
  //'0570_SBLive_sf2',
  //'0570_SoundBlasterOld_sf2',
  "0571_GeneralUserGS_sf2_file",
  // Tuba: Brass
  "0580_Aspirin_sf2_file",
  "0580_Chaos_sf2_file",
  "0580_FluidR3_GM_sf2_file",
  "0580_GeneralUserGS_sf2_file",
  //'0580_JCLive_sf2_file', // -1oct
  //'0580_SBLive_sf2',
  //'0580_SoundBlasterOld_sf2',
  //'0581_GeneralUserGS_sf2_file', // missing
  // Muted Trumpet: Brass
  "0590_Aspirin_sf2_file",
  "0590_Chaos_sf2_file",
  "0590_FluidR3_GM_sf2_file",
  "0590_GeneralUserGS_sf2_file",
  "0590_JCLive_sf2_file",
  // winner
  //'0590_SBLive_sf2',
  //'0590_SoundBlasterOld_sf2',
  // '0591_GeneralUserGS_sf2_file', // missing
  // French Horn: Brass
  "0600_Aspirin_sf2_file",
  //'0600_Chaos_sf2_file', // weird jumps
  "0600_FluidR3_GM_sf2_file",
  // tiny crackles
  "0600_GeneralUserGS_sf2_file",
  // tiny crackles
  "0600_JCLive_sf2_file",
  // tiny crackles
  //'0600_SBLive_sf2',
  //'0600_SoundBlasterOld_sf2',
  "0601_FluidR3_GM_sf2_file",
  //'0601_GeneralUserGS_sf2_file', // tiny crackles
  // '0602_GeneralUserGS_sf2_file', // bad gain diffs
  // '0603_GeneralUserGS_sf2_file', // tiny crackles
  // Brass Section: Brass
  "0610_Aspirin_sf2_file",
  "0610_Chaos_sf2_file",
  "0610_FluidR3_GM_sf2_file",
  // large
  "0610_GeneralUserGS_sf2_file",
  "0610_JCLive_sf2_file",
  //'0610_SBLive_sf2',
  //'0610_SoundBlasterOld_sf2',
  // '0611_GeneralUserGS_sf2_file', // missing sounds
  // '0612_GeneralUserGS_sf2_file',
  //'0613_GeneralUserGS_sf2_file', // -1 oct
  // '0614_GeneralUserGS_sf2_file', // missing sounds
  // '0615_GeneralUserGS_sf2_file', // missing sounds
  // Synth Brass 1: Brass
  "0620_Aspirin_sf2_file",
  //'0620_Chaos_sf2_file', // weird gain diff
  "0620_FluidR3_GM_sf2_file",
  //'0620_GeneralUserGS_sf2_file', // loooud
  // '0620_JCLive_sf2_file', // weird gain diff
  //'0620_SBLive_sf2',
  //'0620_SoundBlasterOld_sf2',
  "0621_Aspirin_sf2_file",
  "0621_FluidR3_GM_sf2_file",
  // '0621_GeneralUserGS_sf2_file', // detune + loooud
  //'0622_FluidR3_GM_sf2_file', // loud..
  //'0622_GeneralUserGS_sf2_file', // loud + crackles
  // Synth Brass 2: Brass
  "0630_Aspirin_sf2_file",
  "0630_Chaos_sf2_file",
  "0630_FluidR3_GM_sf2_file",
  //'0630_GeneralUserGS_sf2_file', // detune + looud
  "0630_JCLive_sf2_file",
  //'0630_SBLive_sf2',
  //'0630_SoundBlasterOld_sf2',
  // '0631_Aspirin_sf2_file', // looud + detune + gain diffs
  "0631_FluidR3_GM_sf2_file",
  //'0631_GeneralUserGS_sf2_file', // crackles
  "0632_FluidR3_GM_sf2_file",
  "0633_FluidR3_GM_sf2_file",
  // tiny crackles
  // Soprano Sax: Reed
  "0640_Aspirin_sf2_file",
  "0640_Chaos_sf2_file",
  "0640_FluidR3_GM_sf2_file",
  // '0640_GeneralUserGS_sf2_file', // crackles
  "0640_JCLive_sf2_file",
  //'0640_SBLive_sf2',
  //'0640_SoundBlasterOld_sf2',
  "0641_FluidR3_GM_sf2_file",
  // Alto Sax: Reed
  //'0650_Aspirin_sf2_file', // this is not an alto sax
  "0650_Chaos_sf2_file",
  "0650_FluidR3_GM_sf2_file",
  // sounds really stringy
  "0650_GeneralUserGS_sf2_file",
  "0650_JCLive_sf2_file",
  //'0650_SBLive_sf2',
  //'0650_SoundBlasterOld_sf2',
  "0651_Aspirin_sf2_file",
  "0651_FluidR3_GM_sf2_file",
  // really stringy
  // Tenor Sax: Reed
  "0660_Aspirin_sf2_file",
  "0660_Chaos_sf2_file",
  //'0660_FluidR3_GM_sf2_file', // weird pitches
  "0660_GeneralUserGS_sf2_file",
  "0660_JCLive_sf2_file",
  //'0660_SBLive_sf2',
  //'0660_SoundBlasterOld_sf2',
  // '0661_FluidR3_GM_sf2_file', // weird pitches
  // '0661_GeneralUserGS_sf2_file', // missing
  // Baritone Sax: Reed
  "0670_Aspirin_sf2_file",
  "0670_Chaos_sf2_file",
  "0670_FluidR3_GM_sf2_file",
  // huge
  "0670_GeneralUserGS_sf2_file",
  "0670_JCLive_sf2_file",
  //'0670_SBLive_sf2',
  //'0670_SoundBlasterOld_sf2',
  "0671_FluidR3_GM_sf2_file",
  // huge
  // Oboe: Reed
  //'0680_Aspirin_sf2_file', // tiny crackles
  "0680_Chaos_sf2_file",
  // tiny crackles
  "0680_FluidR3_GM_sf2_file",
  // tiny crackles
  "0680_GeneralUserGS_sf2_file",
  "0680_JCLive_sf2_file",
  //'0680_SBLive_sf2',
  //'0680_SoundBlasterOld_sf2',
  "0681_FluidR3_GM_sf2_file",
  // tiny crackles
  // English Horn: Reed
  "0690_Aspirin_sf2_file",
  //'0690_Chaos_sf2_file', // detuned
  "0690_FluidR3_GM_sf2_file",
  //'0690_GeneralUserGS_sf2_file', // +1 oct
  "0690_JCLive_sf2_file",
  //'0690_SBLive_sf2',
  //'0690_SoundBlasterOld_sf2',
  "0691_FluidR3_GM_sf2_file",
  // tiny crackles
  // Bassoon: Reed
  //'0700_Aspirin_sf2_file', // detune + gain diffs
  // '0700_Chaos_sf2_file', // detune + crackles
  "0700_FluidR3_GM_sf2_file",
  "0700_GeneralUserGS_sf2_file",
  // tiny crackles
  "0700_JCLive_sf2_file",
  //'0700_SBLive_sf2',
  //'0700_SoundBlasterOld_sf2',
  "0701_FluidR3_GM_sf2_file",
  // tiny crackles
  //'0701_GeneralUserGS_sf2_file', // missing
  // Clarinet: Reed
  "0710_Aspirin_sf2_file",
  // tiny crackles
  "0710_Chaos_sf2_file",
  // tiny crackles
  "0710_FluidR3_GM_sf2_file",
  "0710_GeneralUserGS_sf2_file",
  "0710_JCLive_sf2_file",
  //'0710_SBLive_sf2',
  //'0710_SoundBlasterOld_sf2',
  "0711_FluidR3_GM_sf2_file",
  // Piccolo: Pipe
  "0720_Aspirin_sf2_file",
  // +1oct
  // '0720_Chaos_sf2_file', // not a piccolo
  "0720_FluidR3_GM_sf2_file",
  "0720_GeneralUserGS_sf2_file",
  // crackles
  "0720_JCLive_sf2_file",
  //'0720_SBLive_sf2',
  //'0720_SoundBlasterOld_sf2',
  "0721_FluidR3_GM_sf2_file",
  //'0721_SoundBlasterOld_sf2',
  // Flute: Pipe
  "0730_Aspirin_sf2_file",
  //'0730_Chaos_sf2_file', // etune
  "0730_FluidR3_GM_sf2_file",
  "0730_GeneralUserGS_sf2_file",
  "0730_JCLive_sf2_file",
  //'0730_SBLive_sf2',
  //'0730_SoundBlasterOld_sf2',
  //'0731_Aspirin_sf2_file', // not a flute
  "0731_FluidR3_GM_sf2_file",
  //'0731_SoundBlasterOld_sf2',
  // Recorder: Pipe
  "0740_Aspirin_sf2_file",
  "0740_Chaos_sf2_file",
  "0740_FluidR3_GM_sf2_file",
  "0740_GeneralUserGS_sf2_file",
  "0740_JCLive_sf2_file",
  //'0740_SBLive_sf2',
  //'0740_SoundBlasterOld_sf2',
  // '0741_GeneralUserGS_sf2_file', // missing
  // Pan Flute: Pipe
  "0750_Aspirin_sf2_file",
  // staccato
  "0750_Chaos_sf2_file",
  "0750_FluidR3_GM_sf2_file",
  "0750_GeneralUserGS_sf2_file",
  // crackles
  "0750_JCLive_sf2_file",
  //'0750_SBLive_sf2',
  //'0750_SoundBlasterOld_sf2',
  "0751_Aspirin_sf2_file",
  "0751_FluidR3_GM_sf2_file",
  "0751_GeneralUserGS_sf2_file",
  // crackles
  //'0751_SoundBlasterOld_sf2',
  // Blown bottle: Pipe
  // '0760_Aspirin_sf2_file', // same as below w crackle
  "0760_Chaos_sf2_file",
  "0760_FluidR3_GM_sf2_file",
  "0760_GeneralUserGS_sf2_file",
  "0760_JCLive_sf2_file",
  //'0760_SBLive_sf2',
  //'0760_SoundBlasterOld_sf2',
  "0761_FluidR3_GM_sf2_file",
  // '0761_GeneralUserGS_sf2_file', // missing
  //'0761_SoundBlasterOld_sf2',
  // '0762_GeneralUserGS_sf2_file', // missing
  // Shakuhachi: Pipe
  "0770_Aspirin_sf2_file",
  // staccato
  //'0770_Chaos_sf2_file', // not shakuhachi
  "0770_FluidR3_GM_sf2_file",
  "0770_GeneralUserGS_sf2_file",
  "0770_JCLive_sf2_file",
  //'0770_SBLive_sf2',
  //'0770_SoundBlasterOld_sf2',
  "0771_FluidR3_GM_sf2_file",
  // '0771_GeneralUserGS_sf2_file', // missing
  // '0772_GeneralUserGS_sf2_file', // missing
  // Whistle: Pipe
  "0780_Aspirin_sf2_file",
  // crackles
  "0780_Chaos_sf2_file",
  // crackles
  "0780_FluidR3_GM_sf2_file",
  //'0780_GeneralUserGS_sf2_file', // loud..
  "0780_JCLive_sf2_file",
  // crackles
  //'0780_SBLive_sf2',
  //'0780_SoundBlasterOld_sf2',
  // '0781_GeneralUserGS_sf2_file', // detune + crackles
  // Ocarina: Pipe
  "0790_Aspirin_sf2_file",
  // tiny crackles
  //'0790_Chaos_sf2_file', // same as above
  "0790_FluidR3_GM_sf2_file",
  "0790_GeneralUserGS_sf2_file",
  "0790_JCLive_sf2_file",
  // crackles
  //'0790_SBLive_sf2',
  //'0790_SoundBlasterOld_sf2',
  //'0791_GeneralUserGS_sf2_file', // missing
  // Lead 1 (square): Synth Lead
  "0800_Aspirin_sf2_file",
  "0800_Chaos_sf2_file",
  "0800_FluidR3_GM_sf2_file",
  // '0800_GeneralUserGS_sf2_file', // detuned
  // '0800_JCLive_sf2_file', // detuned
  //'0800_SBLive_sf2',
  //'0800_SoundBlasterOld_sf2',
  //'0801_FluidR3_GM_sf2_file', // detune
  // '0801_GeneralUserGS_sf2_file', // detune
  // Lead 2 (sawtooth): Synth Lead
  "0810_Aspirin_sf2_file",
  "0810_Chaos_sf2_file",
  "0810_FluidR3_GM_sf2_file",
  "0810_GeneralUserGS_sf2_file",
  "0810_JCLive_sf2_file",
  //'0810_SBLive_sf2',
  //'0810_SoundBlasterOld_sf2',
  "0811_Aspirin_sf2_file",
  "0811_GeneralUserGS_sf2_file",
  //'0811_SoundBlasterOld_sf2',
  // Lead 3 (calliope): Synth Lead
  "0820_Aspirin_sf2_file",
  "0820_Chaos_sf2_file",
  "0820_FluidR3_GM_sf2_file",
  "0820_GeneralUserGS_sf2_file",
  "0820_JCLive_sf2_file",
  // +1 oct
  //'0820_SBLive_sf2',
  //'0820_SoundBlasterOld_sf2',
  "0821_FluidR3_GM_sf2_file",
  "0821_GeneralUserGS_sf2_file",
  //'0821_SoundBlasterOld_sf2',
  // '0822_GeneralUserGS_sf2_file', // missing
  //'0823_GeneralUserGS_sf2_file', // missing
  // Lead 4 (chiff): Synth Lead
  "0830_Aspirin_sf2_file",
  // '0830_Chaos_sf2_file', // same as above
  "0830_FluidR3_GM_sf2_file",
  "0830_GeneralUserGS_sf2_file",
  "0830_JCLive_sf2_file",
  // flute synth
  //'0830_SBLive_sf2',
  //'0830_SoundBlasterOld_sf2',
  "0831_FluidR3_GM_sf2_file",
  "0831_GeneralUserGS_sf2_file",
  //'0831_SoundBlasterOld_sf2',
  // Lead 5 (charang): Synth Lead
  "0840_Aspirin_sf2_file",
  "0840_Chaos_sf2_file",
  "0840_FluidR3_GM_sf2_file",
  "0840_GeneralUserGS_sf2_file",
  "0840_JCLive_sf2_file",
  // detune?
  //'0840_SBLive_sf2',
  //'0840_SoundBlasterOld_sf2',
  "0841_Aspirin_sf2_file",
  "0841_Chaos_sf2_file",
  "0841_FluidR3_GM_sf2_file",
  "0841_GeneralUserGS_sf2_file",
  //'0841_JCLive_sf2_file', // +1oct + detune
  //'0841_SoundBlasterOld_sf2',
  "0842_FluidR3_GM_sf2_file",
  // Lead 6 (voice): Synth Lead
  "0850_Aspirin_sf2_file",
  // '0850_Chaos_sf2_file', // same as above
  "0850_FluidR3_GM_sf2_file",
  // '0850_GeneralUserGS_sf2_file', // no voice
  "0850_JCLive_sf2_file",
  // more a flute
  //'0850_SBLive_sf2',
  //'0850_SoundBlasterOld_sf2',
  "0851_FluidR3_GM_sf2_file",
  "0851_GeneralUserGS_sf2_file",
  "0851_JCLive_sf2_file",
  //'0851_SoundBlasterOld_sf2',
  // Lead 7 (fifths): Synth Lead
  "0860_Aspirin_sf2_file",
  "0860_Chaos_sf2_file",
  // '0860_FluidR3_GM_sf2_file', // loud and not fitting
  "0860_GeneralUserGS_sf2_file",
  "0860_JCLive_sf2_file",
  //'0860_SBLive_sf2',
  //'0860_SoundBlasterOld_sf2',
  "0861_Aspirin_sf2_file",
  // '0861_FluidR3_GM_sf2_file', // lout and not fitting
  //'0861_SoundBlasterOld_sf2',
  // Lead 8 (bass + lead): Synth Lead
  "0870_Aspirin_sf2_file",
  "0870_Chaos_sf2_file",
  "0870_FluidR3_GM_sf2_file",
  "0870_GeneralUserGS_sf2_file",
  "0870_JCLive_sf2_file",
  //'0870_SBLive_sf2',
  //'0870_SoundBlasterOld_sf2',
  // '0871_GeneralUserGS_sf2_file', // loud + detune
  //'0872_GeneralUserGS_sf2_file', // loud
  //'0873_GeneralUserGS_sf2_file', // loud
  // Pad 1 (new age): Synth Pad
  "0880_Aspirin_sf2_file",
  "0880_Chaos_sf2_file",
  "0880_FluidR3_GM_sf2_file",
  "0880_GeneralUserGS_sf2_file",
  "0880_JCLive_sf2_file",
  //'0880_SBLive_sf2',
  //'0880_SoundBlasterOld_sf2',
  "0881_Aspirin_sf2_file",
  "0881_FluidR3_GM_sf2_file",
  "0881_GeneralUserGS_sf2_file",
  //'0881_SoundBlasterOld_sf2',
  "0882_Aspirin_sf2_file",
  // staccato
  // '0882_FluidR3_GM_sf2_file', // missing
  "0882_GeneralUserGS_sf2_file",
  //'0883_GeneralUserGS_sf2_file', // missing
  // '0884_GeneralUserGS_sf2_file', // broken
  "0885_GeneralUserGS_sf2_file",
  //'0886_GeneralUserGS_sf2_file', // not a pad
  "0887_GeneralUserGS_sf2_file",
  //'0888_GeneralUserGS_sf2_file', // not a pad
  //'0889_GeneralUserGS_sf2_file', // not a pad
  // Pad 2 (warm): Synth Pad
  "0890_Aspirin_sf2_file",
  "0890_Chaos_sf2_file",
  "0890_FluidR3_GM_sf2_file",
  "0890_GeneralUserGS_sf2_file",
  // 1mb large
  "0890_JCLive_sf2_file",
  //'0890_SBLive_sf2',
  //'0890_SoundBlasterOld_sf2',
  "0891_Aspirin_sf2_file",
  "0891_FluidR3_GM_sf2_file",
  // '0891_GeneralUserGS_sf2_file', // noise
  // Pad 3 (polysynth): Synth Pad
  //'0900_Aspirin_sf2_file', // same as belo
  "0900_Chaos_sf2_file",
  "0900_FluidR3_GM_sf2_file",
  "0900_GeneralUserGS_sf2_file",
  "0900_JCLive_sf2_file",
  // a bit plucky for a pad
  //'0900_SBLive_sf2',
  //'0900_SoundBlasterOld_sf2',
  "0901_Aspirin_sf2_file",
  "0901_FluidR3_GM_sf2_file",
  "0901_GeneralUserGS_sf2_file",
  //'0901_SoundBlasterOld_sf2',
  // Pad 4 (choir): Synth Pad
  "0910_Aspirin_sf2_file",
  //'0910_Chaos_sf2_file', // +1oct
  "0910_FluidR3_GM_sf2_file",
  "0910_GeneralUserGS_sf2_file",
  "0910_JCLive_sf2_file",
  //'0910_SBLive_sf2',
  //'0910_SoundBlasterOld_sf2',
  // '0911_Aspirin_sf2_file', // fluty, crackles
  "0911_GeneralUserGS_sf2_file",
  "0911_JCLive_sf2_file",
  // the only choiry pad
  //'0911_SoundBlasterOld_sf2',
  // Pad 5 (bowed): Synth Pad
  "0920_Aspirin_sf2_file",
  //'0920_Chaos_sf2_file', // same as above
  //'0920_FluidR3_GM_sf2_file', // detuned?
  "0920_GeneralUserGS_sf2_file",
  "0920_JCLive_sf2_file",
  //'0920_SBLive_sf2',
  //'0920_SoundBlasterOld_sf2',
  "0921_Aspirin_sf2_file",
  "0921_GeneralUserGS_sf2_file",
  //'0921_SoundBlasterOld_sf2',
  // Pad 6 (metallic): Synth Pad
  "0930_Aspirin_sf2_file",
  "0930_Chaos_sf2_file",
  "0930_FluidR3_GM_sf2_file",
  // little crackles
  "0930_GeneralUserGS_sf2_file",
  // '0930_JCLive_sf2_file', // buggy zones: guitar / synth
  //'0930_SBLive_sf2',
  //'0930_SoundBlasterOld_sf2',
  "0931_Aspirin_sf2_file",
  // sitar
  "0931_FluidR3_GM_sf2_file",
  "0931_GeneralUserGS_sf2_file",
  // guitar
  //'0931_SoundBlasterOld_sf2',
  // Pad 7 (halo): Synth Pad
  // '0940_Aspirin_sf2_file', // same as below
  "0940_Chaos_sf2_file",
  "0940_FluidR3_GM_sf2_file",
  "0940_GeneralUserGS_sf2_file",
  "0940_JCLive_sf2_file",
  //'0940_SBLive_sf2',
  //'0940_SoundBlasterOld_sf2',
  "0941_Aspirin_sf2_file",
  "0941_FluidR3_GM_sf2_file",
  "0941_GeneralUserGS_sf2_file",
  "0941_JCLive_sf2_file",
  // Pad 8 (sweep): Synth Pad
  "0950_Aspirin_sf2_file",
  "0950_Chaos_sf2_file",
  "0950_FluidR3_GM_sf2_file",
  "0950_GeneralUserGS_sf2_file",
  "0950_JCLive_sf2_file",
  //'0950_SBLive_sf2',
  //'0950_SoundBlasterOld_sf2',
  "0951_FluidR3_GM_sf2_file",
  "0951_GeneralUserGS_sf2_file",
  // FX 1 (rain): Synth Effects
  //'0960_Aspirin_sf2_file', //mixed samples?
  "0960_Chaos_sf2_file",
  // pad?
  "0960_FluidR3_GM_sf2_file",
  // ???
  "0960_GeneralUserGS_sf2_file",
  // pad
  // '0960_JCLive_sf2_file', // mixed samples?
  //'0960_SBLive_sf2',
  //'0960_SoundBlasterOld_sf2',
  "0961_Aspirin_sf2_file",
  "0961_FluidR3_GM_sf2_file",
  // '0961_GeneralUserGS_sf2_file', // ?!?!
  //'0961_SoundBlasterOld_sf2',
  "0962_GeneralUserGS_sf2_file",
  // FX 2 (soundtrack): Synth Effects
  "0970_Aspirin_sf2_file",
  //'0970_Chaos_sf2_file', // wrong pitch
  "0970_FluidR3_GM_sf2_file",
  "0970_GeneralUserGS_sf2_file",
  // not looping..
  //'0970_JCLive_sf2_file', // wrong pitch
  //'0970_SBLive_sf2',
  //'0970_SoundBlasterOld_sf2',
  "0971_FluidR3_GM_sf2_file",
  "0971_GeneralUserGS_sf2_file",
  //'0971_SoundBlasterOld_sf2',
  // FX 3 (crystal): Synth Effects
  "0980_Aspirin_sf2_file",
  "0980_Chaos_sf2_file",
  // '0980_FluidR3_GM_sf2_file', // some notes are weird
  "0980_GeneralUserGS_sf2_file",
  "0980_JCLive_sf2_file",
  //'0980_SBLive_sf2',
  //'0980_SoundBlasterOld_sf2',
  "0981_Aspirin_sf2_file",
  // strings
  "0981_FluidR3_GM_sf2_file",
  // mallet
  "0981_GeneralUserGS_sf2_file",
  //'0981_SoundBlasterOld_sf2',
  "0982_GeneralUserGS_sf2_file",
  "0983_GeneralUserGS_sf2_file",
  // guitar
  "0984_GeneralUserGS_sf2_file",
  // FX 4 (atmosphere): Synth Effects
  "0990_Aspirin_sf2_file",
  // pad
  "0990_Chaos_sf2_file",
  // pad
  "0990_FluidR3_GM_sf2_file",
  // guitar
  "0990_GeneralUserGS_sf2_file",
  // guitar
  "0990_JCLive_sf2_file",
  // pad
  //'0990_SBLive_sf2',
  //'0990_SoundBlasterOld_sf2',
  "0991_Aspirin_sf2_file",
  // guitar
  "0991_FluidR3_GM_sf2_file",
  // pad
  "0991_GeneralUserGS_sf2_file",
  // pad
  "0991_JCLive_sf2_file",
  // guitar
  //'0991_SoundBlasterOld_sf2',
  "0992_FluidR3_GM_sf2_file",
  // pad
  "0992_JCLive_sf2_file",
  // guitar
  "0993_JCLive_sf2_file",
  // guitar
  "0994_JCLive_sf2_file",
  // guitar
  // FX 5 (brightness): Synth Effects
  "1000_Aspirin_sf2_file",
  "1000_Chaos_sf2_file",
  "1000_FluidR3_GM_sf2_file",
  "1000_GeneralUserGS_sf2_file",
  "1000_JCLive_sf2_file",
  //'1000_SBLive_sf2',
  //'1000_SoundBlasterOld_sf2',
  "1001_Aspirin_sf2_file",
  "1001_FluidR3_GM_sf2_file",
  "1001_GeneralUserGS_sf2_file",
  "1001_JCLive_sf2_file",
  //'1001_SoundBlasterOld_sf2',
  "1002_Aspirin_sf2_file",
  "1002_FluidR3_GM_sf2_file",
  "1002_GeneralUserGS_sf2_file",
  // FX 6 (goblins): Synth Effects
  "1010_Aspirin_sf2_file",
  "1010_Chaos_sf2_file",
  "1010_FluidR3_GM_sf2_file",
  "1010_GeneralUserGS_sf2_file",
  "1010_JCLive_sf2_file",
  //'1010_SBLive_sf2',
  //'1010_SoundBlasterOld_sf2',
  "1011_Aspirin_sf2_file",
  "1011_FluidR3_GM_sf2_file",
  "1011_JCLive_sf2_file",
  "1012_Aspirin_sf2_file",
  // FX 7 (echoes): Synth Effects
  "1020_Aspirin_sf2_file",
  "1020_Chaos_sf2_file",
  "1020_FluidR3_GM_sf2_file",
  "1020_GeneralUserGS_sf2_file",
  "1020_JCLive_sf2_file",
  //'1020_SBLive_sf2',
  //'1020_SoundBlasterOld_sf2',
  "1021_Aspirin_sf2_file",
  "1021_FluidR3_GM_sf2_file",
  "1021_GeneralUserGS_sf2_file",
  "1021_JCLive_sf2_file",
  //'1021_SoundBlasterOld_sf2',
  "1022_GeneralUserGS_sf2_file",
  // FX 8 (sci-fi): Synth Effects
  "1030_Aspirin_sf2_file",
  "1030_Chaos_sf2_file",
  "1030_FluidR3_GM_sf2_file",
  "1030_GeneralUserGS_sf2_file",
  "1030_JCLive_sf2_file",
  //'1030_SBLive_sf2',
  //'1030_SoundBlasterOld_sf2',
  "1031_Aspirin_sf2_file",
  "1031_FluidR3_GM_sf2_file",
  "1031_GeneralUserGS_sf2_file",
  //'1031_SoundBlasterOld_sf2',
  "1032_FluidR3_GM_sf2_file",
  // 'Sitar: Ethnic
  "1040_Aspirin_sf2_file",
  "1040_Chaos_sf2_file",
  "1040_FluidR3_GM_sf2_file",
  "1040_GeneralUserGS_sf2_file",
  "1040_JCLive_sf2_file",
  //'1040_SBLive_sf2',
  //'1040_SoundBlasterOld_sf2',
  "1041_FluidR3_GM_sf2_file",
  "1041_GeneralUserGS_sf2_file",
  // Banjo: Ethnic
  "1050_Aspirin_sf2_file",
  "1050_Chaos_sf2_file",
  "1050_FluidR3_GM_sf2_file",
  "1050_GeneralUserGS_sf2_file",
  "1050_JCLive_sf2_file",
  //'1050_SBLive_sf2',
  //'1050_SoundBlasterOld_sf2',
  "1051_GeneralUserGS_sf2_file",
  // Shamisen: Ethnic
  "1060_Aspirin_sf2_file",
  "1060_Chaos_sf2_file",
  "1060_FluidR3_GM_sf2_file",
  "1060_GeneralUserGS_sf2_file",
  "1060_JCLive_sf2_file",
  //'1060_SBLive_sf2',
  //'1060_SoundBlasterOld_sf2',
  "1061_FluidR3_GM_sf2_file",
  "1061_GeneralUserGS_sf2_file",
  //'1061_SoundBlasterOld_sf2',
  // Koto: Ethnic
  "1070_Aspirin_sf2_file",
  "1070_Chaos_sf2_file",
  "1070_FluidR3_GM_sf2_file",
  "1070_GeneralUserGS_sf2_file",
  "1070_JCLive_sf2_file",
  //'1070_SBLive_sf2',
  //'1070_SoundBlasterOld_sf2',
  "1071_FluidR3_GM_sf2_file",
  "1071_GeneralUserGS_sf2_file",
  "1072_GeneralUserGS_sf2_file",
  "1073_GeneralUserGS_sf2_file",
  // Kalimba: Ethnic
  "1080_Aspirin_sf2_file",
  "1080_Chaos_sf2_file",
  "1080_FluidR3_GM_sf2_file",
  "1080_GeneralUserGS_sf2_file",
  "1080_JCLive_sf2_file",
  //'1080_SBLive_sf2',
  //'1080_SoundBlasterOld_sf2',
  //'1081_SoundBlasterOld_sf2',
  // Bagpipe: Ethnic
  "1090_Aspirin_sf2_file",
  "1090_Chaos_sf2_file",
  "1090_FluidR3_GM_sf2_file",
  "1090_GeneralUserGS_sf2_file",
  "1090_JCLive_sf2_file",
  //'1090_SBLive_sf2',
  //'1090_SoundBlasterOld_sf2',
  //'1091_SoundBlasterOld_sf2',
  // Fiddle: Ethnic
  "1100_Aspirin_sf2_file",
  "1100_Chaos_sf2_file",
  "1100_FluidR3_GM_sf2_file",
  "1100_GeneralUserGS_sf2_file",
  "1100_JCLive_sf2_file",
  //'1100_SBLive_sf2',
  //'1100_SoundBlasterOld_sf2',
  "1101_Aspirin_sf2_file",
  "1101_FluidR3_GM_sf2_file",
  "1101_GeneralUserGS_sf2_file",
  "1102_GeneralUserGS_sf2_file",
  // Shanai: Ethnic
  "1110_Aspirin_sf2_file",
  "1110_Chaos_sf2_file",
  "1110_FluidR3_GM_sf2_file",
  "1110_GeneralUserGS_sf2_file",
  "1110_JCLive_sf2_file",
  //'1110_SBLive_sf2',
  //'1110_SoundBlasterOld_sf2',
  // Tinkle Bell: Percussive
  "1120_Aspirin_sf2_file",
  "1120_Chaos_sf2_file",
  "1120_FluidR3_GM_sf2_file",
  "1120_GeneralUserGS_sf2_file",
  "1120_JCLive_sf2_file",
  //'1120_SBLive_sf2',
  //'1120_SoundBlasterOld_sf2',
  //'1121_SoundBlasterOld_sf2',
  // Agogo: Percussive
  "1130_Aspirin_sf2_file",
  "1130_Chaos_sf2_file",
  "1130_FluidR3_GM_sf2_file",
  "1130_GeneralUserGS_sf2_file",
  "1130_JCLive_sf2_file",
  //'1130_SBLive_sf2',
  //'1130_SoundBlasterOld_sf2',
  "1131_FluidR3_GM_sf2_file",
  //'1131_SoundBlasterOld_sf2',
  // Steel Drums: Percussive
  "1140_Aspirin_sf2_file",
  "1140_Chaos_sf2_file",
  "1140_FluidR3_GM_sf2_file",
  "1140_GeneralUserGS_sf2_file",
  "1140_JCLive_sf2_file",
  //'1140_SBLive_sf2',
  //'1140_SoundBlasterOld_sf2',
  "1141_FluidR3_GM_sf2_file",
  // Woodblock: Percussive
  "1150_Aspirin_sf2_file",
  "1150_Chaos_sf2_file",
  "1150_FluidR3_GM_sf2_file",
  "1150_GeneralUserGS_sf2_file",
  "1150_JCLive_sf2_file",
  //'1150_SBLive_sf2',
  //'1150_SoundBlasterOld_sf2',
  "1151_FluidR3_GM_sf2_file",
  "1151_GeneralUserGS_sf2_file",
  "1152_FluidR3_GM_sf2_file",
  "1152_GeneralUserGS_sf2_file",
  // Taiko Drum: Percussive
  "1160_Aspirin_sf2_file",
  "1160_Chaos_sf2_file",
  "1160_FluidR3_GM_sf2_file",
  "1160_GeneralUserGS_sf2_file",
  "1160_JCLive_sf2_file",
  //'1160_SBLive_sf2',
  //'1160_SoundBlasterOld_sf2',
  "1161_FluidR3_GM_sf2_file",
  "1161_GeneralUserGS_sf2_file",
  //'1161_SoundBlasterOld_sf2',
  "1162_FluidR3_GM_sf2_file",
  "1162_GeneralUserGS_sf2_file",
  "1163_FluidR3_GM_sf2_file",
  // Melodic Tom: Percussive
  "1170_Aspirin_sf2_file",
  "1170_Chaos_sf2_file",
  "1170_FluidR3_GM_sf2_file",
  "1170_GeneralUserGS_sf2_file",
  "1170_JCLive_sf2_file",
  //'1170_SBLive_sf2',
  //'1170_SoundBlasterOld_sf2',
  "1171_FluidR3_GM_sf2_file",
  "1171_GeneralUserGS_sf2_file",
  "1172_FluidR3_GM_sf2_file",
  "1173_FluidR3_GM_sf2_file",
  // Synth Drum: Percussive
  "1180_Aspirin_sf2_file",
  "1180_Chaos_sf2_file",
  "1180_FluidR3_GM_sf2_file",
  "1180_GeneralUserGS_sf2_file",
  "1180_JCLive_sf2_file",
  //'1180_SBLive_sf2',
  //'1180_SoundBlasterOld_sf2',
  "1181_FluidR3_GM_sf2_file",
  "1181_GeneralUserGS_sf2_file",
  //'1181_SoundBlasterOld_sf2',
  // Reverse Cymbal: Percussive
  "1190_Aspirin_sf2_file",
  "1190_Chaos_sf2_file",
  "1190_FluidR3_GM_sf2_file",
  "1190_GeneralUserGS_sf2_file",
  "1190_JCLive_sf2_file",
  //'1190_SBLive_sf2',
  //'1190_SoundBlasterOld_sf2',
  "1191_GeneralUserGS_sf2_file",
  "1192_GeneralUserGS_sf2_file",
  "1193_GeneralUserGS_sf2_file",
  "1194_GeneralUserGS_sf2_file",
  // Guitar Fret Noise: Sound effects
  "1200_Aspirin_sf2_file",
  "1200_Chaos_sf2_file",
  "1200_FluidR3_GM_sf2_file",
  "1200_GeneralUserGS_sf2_file",
  "1200_JCLive_sf2_file",
  //'1200_SBLive_sf2',
  //'1200_SoundBlasterOld_sf2',
  "1201_Aspirin_sf2_file",
  "1201_GeneralUserGS_sf2_file",
  "1202_GeneralUserGS_sf2_file",
  // Breath Noise: Sound effects
  "1210_Aspirin_sf2_file",
  "1210_Chaos_sf2_file",
  "1210_FluidR3_GM_sf2_file",
  "1210_GeneralUserGS_sf2_file",
  "1210_JCLive_sf2_file",
  //'1210_SBLive_sf2',
  //'1210_SoundBlasterOld_sf2',
  "1211_Aspirin_sf2_file",
  "1211_GeneralUserGS_sf2_file",
  "1212_GeneralUserGS_sf2_file",
  // Seashore: Sound effects
  "1220_Aspirin_sf2_file",
  "1220_Chaos_sf2_file",
  "1220_FluidR3_GM_sf2_file",
  "1220_GeneralUserGS_sf2_file",
  "1220_JCLive_sf2_file",
  //'1220_SBLive_sf2',
  //'1220_SoundBlasterOld_sf2',
  "1221_Aspirin_sf2_file",
  "1221_GeneralUserGS_sf2_file",
  "1221_JCLive_sf2_file",
  "1222_Aspirin_sf2_file",
  "1222_GeneralUserGS_sf2_file",
  "1223_Aspirin_sf2_file",
  "1223_GeneralUserGS_sf2_file",
  "1224_Aspirin_sf2_file",
  "1224_GeneralUserGS_sf2_file",
  "1225_GeneralUserGS_sf2_file",
  "1226_GeneralUserGS_sf2_file",
  // Bird Tweet: Sound effects
  "1230_Aspirin_sf2_file",
  "1230_Chaos_sf2_file",
  "1230_FluidR3_GM_sf2_file",
  "1230_GeneralUserGS_sf2_file",
  "1230_JCLive_sf2_file",
  //'1230_SBLive_sf2',
  //'1230_SoundBlasterOld_sf2',
  "1231_Aspirin_sf2_file",
  "1231_GeneralUserGS_sf2_file",
  "1232_Aspirin_sf2_file",
  "1232_GeneralUserGS_sf2_file",
  "1233_GeneralUserGS_sf2_file",
  "1234_GeneralUserGS_sf2_file",
  // Telephone Ring: Sound effects
  "1240_Aspirin_sf2_file",
  "1240_Chaos_sf2_file",
  "1240_FluidR3_GM_sf2_file",
  "1240_GeneralUserGS_sf2_file",
  "1240_JCLive_sf2_file",
  //'1240_SBLive_sf2',
  //'1240_SoundBlasterOld_sf2',
  "1241_Aspirin_sf2_file",
  "1241_GeneralUserGS_sf2_file",
  "1242_Aspirin_sf2_file",
  "1242_GeneralUserGS_sf2_file",
  "1243_Aspirin_sf2_file",
  "1243_GeneralUserGS_sf2_file",
  "1244_Aspirin_sf2_file",
  "1244_GeneralUserGS_sf2_file",
  // Helicopter: Sound effects
  "1250_Aspirin_sf2_file",
  "1250_Chaos_sf2_file",
  "1250_FluidR3_GM_sf2_file",
  "1250_GeneralUserGS_sf2_file",
  "1250_JCLive_sf2_file",
  //'1250_SBLive_sf2',
  //'1250_SoundBlasterOld_sf2',
  "1251_Aspirin_sf2_file",
  "1251_FluidR3_GM_sf2_file",
  "1251_GeneralUserGS_sf2_file",
  "1252_Aspirin_sf2_file",
  "1252_FluidR3_GM_sf2_file",
  "1252_GeneralUserGS_sf2_file",
  "1253_Aspirin_sf2_file",
  "1253_GeneralUserGS_sf2_file",
  "1254_Aspirin_sf2_file",
  "1254_GeneralUserGS_sf2_file",
  "1255_Aspirin_sf2_file",
  "1255_GeneralUserGS_sf2_file",
  "1256_Aspirin_sf2_file",
  "1256_GeneralUserGS_sf2_file",
  "1257_Aspirin_sf2_file",
  "1257_GeneralUserGS_sf2_file",
  "1258_Aspirin_sf2_file",
  "1258_GeneralUserGS_sf2_file",
  "1259_GeneralUserGS_sf2_file",
  // Applause: Sound effects
  "1260_Aspirin_sf2_file",
  "1260_Chaos_sf2_file",
  "1260_FluidR3_GM_sf2_file",
  "1260_GeneralUserGS_sf2_file",
  "1260_JCLive_sf2_file",
  //'1260_SBLive_sf2',
  //'1260_SoundBlasterOld_sf2',
  "1261_Aspirin_sf2_file",
  "1261_GeneralUserGS_sf2_file",
  "1262_Aspirin_sf2_file",
  "1262_GeneralUserGS_sf2_file",
  "1263_Aspirin_sf2_file",
  "1263_GeneralUserGS_sf2_file",
  "1264_Aspirin_sf2_file",
  "1264_GeneralUserGS_sf2_file",
  "1265_Aspirin_sf2_file",
  "1265_GeneralUserGS_sf2_file",
  // Gunshot: Sound effects
  "1270_Aspirin_sf2_file",
  "1270_Chaos_sf2_file",
  "1270_FluidR3_GM_sf2_file",
  "1270_GeneralUserGS_sf2_file",
  "1270_JCLive_sf2_file",
  //'1270_SBLive_sf2',
  //'1270_SoundBlasterOld_sf2',
  "1271_Aspirin_sf2_file",
  "1271_GeneralUserGS_sf2_file",
  "1272_Aspirin_sf2_file",
  "1272_GeneralUserGS_sf2_file",
  "1273_GeneralUserGS_sf2_file",
  "1274_GeneralUserGS_sf2_file"
], drums = [
  ////'35_0_SBLive_sf2'
  "35_0_Chaos_sf2_file",
  "35_12_JCLive_sf2_file",
  "35_16_JCLive_sf2_file",
  "35_18_JCLive_sf2_file",
  "35_4_Chaos_sf2_file",
  //'36_0_SBLive_sf2',
  "36_12_JCLive_sf2_file",
  "36_16_JCLive_sf2_file",
  "36_18_JCLive_sf2_file",
  "36_4_Chaos_sf2_file",
  //'37_0_SBLive_sf2',
  "37_12_JCLive_sf2_file",
  "37_16_JCLive_sf2_file",
  "37_18_JCLive_sf2_file",
  "37_4_Chaos_sf2_file",
  //'38_0_SBLive_sf2',
  "38_12_JCLive_sf2_file",
  "38_16_JCLive_sf2_file",
  "38_18_JCLive_sf2_file",
  "38_4_Chaos_sf2_file",
  //'39_0_SBLive_sf2',
  "39_12_JCLive_sf2_file",
  "39_16_JCLive_sf2_file",
  "39_18_JCLive_sf2_file",
  "39_4_Chaos_sf2_file",
  //'40_0_SBLive_sf2',
  "40_12_JCLive_sf2_file",
  "40_16_JCLive_sf2_file",
  "40_18_JCLive_sf2_file",
  "40_4_Chaos_sf2_file",
  //'41_0_SBLive_sf2',
  "41_12_JCLive_sf2_file",
  "41_16_JCLive_sf2_file",
  "41_18_JCLive_sf2_file",
  "41_4_Chaos_sf2_file",
  //'42_0_SBLive_sf2',
  "42_12_JCLive_sf2_file",
  "42_16_JCLive_sf2_file",
  "42_18_JCLive_sf2_file",
  "42_4_Chaos_sf2_file",
  //'43_0_SBLive_sf2',
  "43_12_JCLive_sf2_file",
  "43_16_JCLive_sf2_file",
  "43_18_JCLive_sf2_file",
  "43_4_Chaos_sf2_file",
  //'44_0_SBLive_sf2',
  "44_12_JCLive_sf2_file",
  "44_16_JCLive_sf2_file",
  "44_18_JCLive_sf2_file",
  "44_4_Chaos_sf2_file",
  //'45_0_SBLive_sf2',
  "45_12_JCLive_sf2_file",
  "45_16_JCLive_sf2_file",
  "45_18_JCLive_sf2_file",
  "45_4_Chaos_sf2_file",
  //'46_0_SBLive_sf2',
  "46_12_JCLive_sf2_file",
  "46_16_JCLive_sf2_file",
  "46_18_JCLive_sf2_file",
  "46_4_Chaos_sf2_file",
  //'47_0_SBLive_sf2',
  "47_12_JCLive_sf2_file",
  "47_16_JCLive_sf2_file",
  "47_18_JCLive_sf2_file",
  "47_4_Chaos_sf2_file",
  //'48_0_SBLive_sf2',
  "48_12_JCLive_sf2_file",
  "48_16_JCLive_sf2_file",
  "48_18_JCLive_sf2_file",
  "48_4_Chaos_sf2_file",
  //'49_0_SBLive_sf2',
  "49_12_JCLive_sf2_file",
  "49_16_JCLive_sf2_file",
  "49_18_JCLive_sf2_file",
  "49_4_Chaos_sf2_file",
  //'50_0_SBLive_sf2',
  "50_12_JCLive_sf2_file",
  "50_16_JCLive_sf2_file",
  "50_18_JCLive_sf2_file",
  "50_4_Chaos_sf2_file",
  //'51_0_SBLive_sf2',
  "51_12_JCLive_sf2_file",
  "51_16_JCLive_sf2_file",
  "51_18_JCLive_sf2_file",
  "51_4_Chaos_sf2_file",
  //'52_0_SBLive_sf2',
  "52_12_JCLive_sf2_file",
  "52_16_JCLive_sf2_file",
  "52_18_JCLive_sf2_file",
  "52_4_Chaos_sf2_file",
  //'53_0_SBLive_sf2',
  "53_12_JCLive_sf2_file",
  "53_16_JCLive_sf2_file",
  "53_18_JCLive_sf2_file",
  "53_4_Chaos_sf2_file",
  //'54_0_SBLive_sf2',
  "54_12_JCLive_sf2_file",
  "54_16_JCLive_sf2_file",
  "54_18_JCLive_sf2_file",
  "54_4_Chaos_sf2_file",
  //'55_0_SBLive_sf2',
  "55_12_JCLive_sf2_file",
  "55_16_JCLive_sf2_file",
  "55_18_JCLive_sf2_file",
  "55_4_Chaos_sf2_file",
  //'56_0_SBLive_sf2',
  "56_12_JCLive_sf2_file",
  "56_16_JCLive_sf2_file",
  "56_18_JCLive_sf2_file",
  "56_4_Chaos_sf2_file",
  //'57_0_SBLive_sf2',
  "57_12_JCLive_sf2_file",
  "57_16_JCLive_sf2_file",
  "57_18_JCLive_sf2_file",
  "57_4_Chaos_sf2_file",
  //'58_0_SBLive_sf2',
  "58_12_JCLive_sf2_file",
  "58_16_JCLive_sf2_file",
  "58_18_JCLive_sf2_file",
  "58_4_Chaos_sf2_file",
  //'59_0_SBLive_sf2',
  "59_12_JCLive_sf2_file",
  "59_16_JCLive_sf2_file",
  "59_18_JCLive_sf2_file",
  "59_4_Chaos_sf2_file",
  //'60_0_SBLive_sf2',
  "60_12_JCLive_sf2_file",
  "60_16_JCLive_sf2_file",
  "60_18_JCLive_sf2_file",
  "60_4_Chaos_sf2_file",
  //'61_0_SBLive_sf2',
  "61_12_JCLive_sf2_file",
  "61_16_JCLive_sf2_file",
  "61_18_JCLive_sf2_file",
  "61_4_Chaos_sf2_file",
  //'62_0_SBLive_sf2',
  "62_12_JCLive_sf2_file",
  "62_16_JCLive_sf2_file",
  "62_18_JCLive_sf2_file",
  "62_4_Chaos_sf2_file",
  //'63_0_SBLive_sf2',
  "63_12_JCLive_sf2_file",
  "63_16_JCLive_sf2_file",
  "63_18_JCLive_sf2_file",
  "63_4_Chaos_sf2_file",
  //'64_0_SBLive_sf2',
  "64_12_JCLive_sf2_file",
  "64_16_JCLive_sf2_file",
  "64_18_JCLive_sf2_file",
  "64_4_Chaos_sf2_file",
  //'65_0_SBLive_sf2',
  "65_12_JCLive_sf2_file",
  "65_16_JCLive_sf2_file",
  "65_18_JCLive_sf2_file",
  "65_4_Chaos_sf2_file",
  //'66_0_SBLive_sf2',
  "66_12_JCLive_sf2_file",
  "66_16_JCLive_sf2_file",
  "66_18_JCLive_sf2_file",
  "66_4_Chaos_sf2_file",
  //'67_0_SBLive_sf2',
  "67_12_JCLive_sf2_file",
  "67_16_JCLive_sf2_file",
  "67_18_JCLive_sf2_file",
  "67_4_Chaos_sf2_file",
  //'68_0_SBLive_sf2',
  "68_12_JCLive_sf2_file",
  "68_16_JCLive_sf2_file",
  "68_18_JCLive_sf2_file",
  "68_4_Chaos_sf2_file",
  //'69_0_SBLive_sf2',
  "69_12_JCLive_sf2_file",
  "69_16_JCLive_sf2_file",
  "69_18_JCLive_sf2_file",
  "69_4_Chaos_sf2_file",
  //'70_0_SBLive_sf2',
  "70_12_JCLive_sf2_file",
  "70_16_JCLive_sf2_file",
  "70_18_JCLive_sf2_file",
  "70_4_Chaos_sf2_file",
  //'71_0_SBLive_sf2',
  "71_12_JCLive_sf2_file",
  "71_16_JCLive_sf2_file",
  "71_18_JCLive_sf2_file",
  "71_4_Chaos_sf2_file",
  //'72_0_SBLive_sf2',
  "72_12_JCLive_sf2_file",
  "72_16_JCLive_sf2_file",
  "72_18_JCLive_sf2_file",
  "72_4_Chaos_sf2_file",
  //'73_0_SBLive_sf2',
  "73_12_JCLive_sf2_file",
  "73_16_JCLive_sf2_file",
  "73_18_JCLive_sf2_file",
  "73_4_Chaos_sf2_file",
  //'74_0_SBLive_sf2',
  "74_12_JCLive_sf2_file",
  "74_16_JCLive_sf2_file",
  "74_18_JCLive_sf2_file",
  "74_4_Chaos_sf2_file",
  //'75_0_SBLive_sf2',
  "75_12_JCLive_sf2_file",
  "75_16_JCLive_sf2_file",
  "75_18_JCLive_sf2_file",
  "75_4_Chaos_sf2_file",
  //'76_0_SBLive_sf2',
  "76_12_JCLive_sf2_file",
  "76_16_JCLive_sf2_file",
  "76_18_JCLive_sf2_file",
  "76_4_Chaos_sf2_file",
  //'77_0_SBLive_sf2',
  "77_12_JCLive_sf2_file",
  "77_16_JCLive_sf2_file",
  "77_18_JCLive_sf2_file",
  "77_4_Chaos_sf2_file",
  //'78_0_SBLive_sf2',
  "78_12_JCLive_sf2_file",
  "78_16_JCLive_sf2_file",
  "78_18_JCLive_sf2_file",
  "78_4_Chaos_sf2_file",
  //'79_0_SBLive_sf2',
  "79_12_JCLive_sf2_file",
  "79_16_JCLive_sf2_file",
  "79_18_JCLive_sf2_file",
  "79_4_Chaos_sf2_file",
  //'80_0_SBLive_sf2',
  "80_12_JCLive_sf2_file",
  "80_16_JCLive_sf2_file",
  "80_18_JCLive_sf2_file",
  "80_4_Chaos_sf2_file",
  //'81_0_SBLive_sf2',
  "81_12_JCLive_sf2_file",
  "81_16_JCLive_sf2_file",
  "81_18_JCLive_sf2_file",
  "81_4_Chaos_sf2_file"
], instrumentNames = [];
instrumentNames[0] = "Acoustic Grand Piano: Piano";
instrumentNames[1] = "Bright Acoustic Piano: Piano";
instrumentNames[2] = "Electric Grand Piano: Piano";
instrumentNames[3] = "Honky-tonk Piano: Piano";
instrumentNames[4] = "Electric Piano 1: Piano";
instrumentNames[5] = "Electric Piano 2: Piano";
instrumentNames[6] = "Harpsichord: Piano";
instrumentNames[7] = "Clavinet: Piano";
instrumentNames[8] = "Celesta: Chromatic Percussion";
instrumentNames[9] = "Glockenspiel: Chromatic Percussion";
instrumentNames[10] = "Music Box: Chromatic Percussion";
instrumentNames[11] = "Vibraphone: Chromatic Percussion";
instrumentNames[12] = "Marimba: Chromatic Percussion";
instrumentNames[13] = "Xylophone: Chromatic Percussion";
instrumentNames[14] = "Tubular Bells: Chromatic Percussion";
instrumentNames[15] = "Dulcimer: Chromatic Percussion";
instrumentNames[16] = "Drawbar Organ: Organ";
instrumentNames[17] = "Percussive Organ: Organ";
instrumentNames[18] = "Rock Organ: Organ";
instrumentNames[19] = "Church Organ: Organ";
instrumentNames[20] = "Reed Organ: Organ";
instrumentNames[21] = "Accordion: Organ";
instrumentNames[22] = "Harmonica: Organ";
instrumentNames[23] = "Tango Accordion: Organ";
instrumentNames[24] = "Acoustic Guitar (nylon): Guitar";
instrumentNames[25] = "Acoustic Guitar (steel): Guitar";
instrumentNames[26] = "Electric Guitar (jazz): Guitar";
instrumentNames[27] = "Electric Guitar (clean): Guitar";
instrumentNames[28] = "Electric Guitar (muted): Guitar";
instrumentNames[29] = "Overdriven Guitar: Guitar";
instrumentNames[30] = "Distortion Guitar: Guitar";
instrumentNames[31] = "Guitar Harmonics: Guitar";
instrumentNames[32] = "Acoustic Bass: Bass";
instrumentNames[33] = "Electric Bass (finger): Bass";
instrumentNames[34] = "Electric Bass (pick): Bass";
instrumentNames[35] = "Fretless Bass: Bass";
instrumentNames[36] = "Slap Bass 1: Bass";
instrumentNames[37] = "Slap Bass 2: Bass";
instrumentNames[38] = "Synth Bass 1: Bass";
instrumentNames[39] = "Synth Bass 2: Bass";
instrumentNames[40] = "Violin: Strings";
instrumentNames[41] = "Viola: Strings";
instrumentNames[42] = "Cello: Strings";
instrumentNames[43] = "Contrabass: Strings";
instrumentNames[44] = "Tremolo Strings: Strings";
instrumentNames[45] = "Pizzicato Strings: Strings";
instrumentNames[46] = "Orchestral Harp: Strings";
instrumentNames[47] = "Timpani: Strings";
instrumentNames[48] = "String Ensemble 1: Ensemble";
instrumentNames[49] = "String Ensemble 2: Ensemble";
instrumentNames[50] = "Synth Strings 1: Ensemble";
instrumentNames[51] = "Synth Strings 2: Ensemble";
instrumentNames[52] = "Choir Aahs: Ensemble";
instrumentNames[53] = "Voice Oohs: Ensemble";
instrumentNames[54] = "Synth Choir: Ensemble";
instrumentNames[55] = "Orchestra Hit: Ensemble";
instrumentNames[56] = "Trumpet: Brass";
instrumentNames[57] = "Trombone: Brass";
instrumentNames[58] = "Tuba: Brass";
instrumentNames[59] = "Muted Trumpet: Brass";
instrumentNames[60] = "French Horn: Brass";
instrumentNames[61] = "Brass Section: Brass";
instrumentNames[62] = "Synth Brass 1: Brass";
instrumentNames[63] = "Synth Brass 2: Brass";
instrumentNames[64] = "Soprano Sax: Reed";
instrumentNames[65] = "Alto Sax: Reed";
instrumentNames[66] = "Tenor Sax: Reed";
instrumentNames[67] = "Baritone Sax: Reed";
instrumentNames[68] = "Oboe: Reed";
instrumentNames[69] = "English Horn: Reed";
instrumentNames[70] = "Bassoon: Reed";
instrumentNames[71] = "Clarinet: Reed";
instrumentNames[72] = "Piccolo: Pipe";
instrumentNames[73] = "Flute: Pipe";
instrumentNames[74] = "Recorder: Pipe";
instrumentNames[75] = "Pan Flute: Pipe";
instrumentNames[76] = "Blown bottle: Pipe";
instrumentNames[77] = "Shakuhachi: Pipe";
instrumentNames[78] = "Whistle: Pipe";
instrumentNames[79] = "Ocarina: Pipe";
instrumentNames[80] = "Lead 1 (square): Synth Lead";
instrumentNames[81] = "Lead 2 (sawtooth): Synth Lead";
instrumentNames[82] = "Lead 3 (calliope): Synth Lead";
instrumentNames[83] = "Lead 4 (chiff): Synth Lead";
instrumentNames[84] = "Lead 5 (charang): Synth Lead";
instrumentNames[85] = "Lead 6 (voice): Synth Lead";
instrumentNames[86] = "Lead 7 (fifths): Synth Lead";
instrumentNames[87] = "Lead 8 (bass + lead): Synth Lead";
instrumentNames[88] = "Pad 1 (new age): Synth Pad";
instrumentNames[89] = "Pad 2 (warm): Synth Pad";
instrumentNames[90] = "Pad 3 (polysynth): Synth Pad";
instrumentNames[91] = "Pad 4 (choir): Synth Pad";
instrumentNames[92] = "Pad 5 (bowed): Synth Pad";
instrumentNames[93] = "Pad 6 (metallic): Synth Pad";
instrumentNames[94] = "Pad 7 (halo): Synth Pad";
instrumentNames[95] = "Pad 8 (sweep): Synth Pad";
instrumentNames[96] = "FX 1 (rain): Synth Effects";
instrumentNames[97] = "FX 2 (soundtrack): Synth Effects";
instrumentNames[98] = "FX 3 (crystal): Synth Effects";
instrumentNames[99] = "FX 4 (atmosphere): Synth Effects";
instrumentNames[100] = "FX 5 (brightness): Synth Effects";
instrumentNames[101] = "FX 6 (goblins): Synth Effects";
instrumentNames[102] = "FX 7 (echoes): Synth Effects";
instrumentNames[103] = "FX 8 (sci-fi): Synth Effects";
instrumentNames[104] = "Sitar: Ethnic";
instrumentNames[105] = "Banjo: Ethnic";
instrumentNames[106] = "Shamisen: Ethnic";
instrumentNames[107] = "Koto: Ethnic";
instrumentNames[108] = "Kalimba: Ethnic";
instrumentNames[109] = "Bagpipe: Ethnic";
instrumentNames[110] = "Fiddle: Ethnic";
instrumentNames[111] = "Shanai: Ethnic";
instrumentNames[112] = "Tinkle Bell: Percussive";
instrumentNames[113] = "Agogo: Percussive";
instrumentNames[114] = "Steel Drums: Percussive";
instrumentNames[115] = "Woodblock: Percussive";
instrumentNames[116] = "Taiko Drum: Percussive";
instrumentNames[117] = "Melodic Tom: Percussive";
instrumentNames[118] = "Synth Drum: Percussive";
instrumentNames[119] = "Reverse Cymbal: Percussive";
instrumentNames[120] = "Guitar Fret Noise: Sound effects";
instrumentNames[121] = "Breath Noise: Sound effects";
instrumentNames[122] = "Seashore: Sound effects";
instrumentNames[123] = "Bird Tweet: Sound effects";
instrumentNames[124] = "Telephone Ring: Sound effects";
instrumentNames[125] = "Helicopter: Sound effects";
instrumentNames[126] = "Applause: Sound effects";
instrumentNames[127] = "Gunshot: Sound effects";
const list$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  drums,
  instrumentNames,
  instruments
}, Symbol.toStringTag, { value: "Module" }));
var commonjsGlobal = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function getDefaultExportFromCjs(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function getAugmentedNamespace(e) {
  if (e.__esModule) return e;
  var t = e.default;
  if (typeof t == "function") {
    var a = function o() {
      return this instanceof o ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    a.prototype = t.prototype;
  } else a = {};
  return Object.defineProperty(a, "__esModule", { value: !0 }), Object.keys(e).forEach(function(o) {
    var u = Object.getOwnPropertyDescriptor(e, o);
    Object.defineProperty(a, o, u.get ? u : {
      enumerable: !0,
      get: function() {
        return e[o];
      }
    });
  }), a;
}
var SoundFont2 = { exports: {} }, hasRequiredSoundFont2;
function requireSoundFont2() {
  return hasRequiredSoundFont2 || (hasRequiredSoundFont2 = 1, function(e, t) {
    (function(a, o) {
      e.exports = o();
    })(window, function() {
      return function(a) {
        var o = {};
        function u(l) {
          if (o[l]) return o[l].exports;
          var f = o[l] = { i: l, l: !1, exports: {} };
          return a[l].call(f.exports, f, f.exports, u), f.l = !0, f.exports;
        }
        return u.m = a, u.c = o, u.d = function(l, f, p) {
          u.o(l, f) || Object.defineProperty(l, f, { enumerable: !0, get: p });
        }, u.r = function(l) {
          typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(l, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(l, "__esModule", { value: !0 });
        }, u.t = function(l, f) {
          if (1 & f && (l = u(l)), 8 & f || 4 & f && typeof l == "object" && l && l.__esModule) return l;
          var p = /* @__PURE__ */ Object.create(null);
          if (u.r(p), Object.defineProperty(p, "default", { enumerable: !0, value: l }), 2 & f && typeof l != "string") for (var g in l) u.d(p, g, function(d) {
            return l[d];
          }.bind(null, g));
          return p;
        }, u.n = function(l) {
          var f = l && l.__esModule ? function() {
            return l.default;
          } : function() {
            return l;
          };
          return u.d(f, "a", f), f;
        }, u.o = function(l, f) {
          return Object.prototype.hasOwnProperty.call(l, f);
        }, u.p = "", u(u.s = "./src/index.ts");
      }({ "./src/chunk.ts": (
        /*!**********************!*\
          !*** ./src/chunk.ts ***!
          \**********************/
        /*! exports provided: SF2Chunk */
        function(a, o, u) {
          u.r(o), u.d(o, "SF2Chunk", function() {
            return S;
          });
          var l = u(
            /*! ./riff */
            "./src/riff/index.ts"
          ), f = u(
            /*! ./constants */
            "./src/constants.ts"
          ), p = u(
            /*! ./chunks */
            "./src/chunks/index.ts"
          );
          function g(R) {
            return (g = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(k) {
              return typeof k;
            } : function(k) {
              return k && typeof Symbol == "function" && k.constructor === Symbol && k !== Symbol.prototype ? "symbol" : typeof k;
            })(R);
          }
          function d(R, k) {
            for (var I = 0; I < k.length; I++) {
              var V = k[I];
              V.enumerable = V.enumerable || !1, V.configurable = !0, "value" in V && (V.writable = !0), Object.defineProperty(R, V.key, V);
            }
          }
          function b(R) {
            return (b = Object.setPrototypeOf ? Object.getPrototypeOf : function(k) {
              return k.__proto__ || Object.getPrototypeOf(k);
            })(R);
          }
          function F(R, k) {
            return (F = Object.setPrototypeOf || function(I, V) {
              return I.__proto__ = V, I;
            })(R, k);
          }
          function E(R) {
            if (R === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return R;
          }
          var S = function(R) {
            function k(U) {
              var q, H, z, j, ee, te;
              return function(de, ie) {
                if (!(de instanceof ie)) throw new TypeError("Cannot call a class as a function");
              }(this, k), H = this, q = !(z = b(k).call(this, U.id, U.length, U.buffer, U.subChunks)) || g(z) !== "object" && typeof z != "function" ? E(H) : z, j = E(E(q)), te = void 0, (ee = "subChunks") in j ? Object.defineProperty(j, ee, { value: te, enumerable: !0, configurable: !0, writable: !0 }) : j[ee] = te, q.subChunks = U.subChunks.map(function(de) {
                return new k(de);
              }), q;
            }
            var I, V;
            return function(U, q) {
              if (typeof q != "function" && q !== null) throw new TypeError("Super expression must either be null or a function");
              U.prototype = Object.create(q && q.prototype, { constructor: { value: U, writable: !0, configurable: !0 } }), q && F(U, q);
            }(k, l.RIFFChunk), I = k, (V = [{ key: "getMetaData", value: function() {
              if (this.id !== "LIST") throw new l.ParseError("Unexpected chunk ID", "'LIST'", "'".concat(this.id, "'"));
              var U = this.subChunks.reduce(function(q, H) {
                if (H.id === "ifil" || H.id === "iver") {
                  if (H.length !== f.SF_VERSION_LENGTH) throw new l.ParseError("Invalid size for the '".concat(H.id, "' sub-chunk"));
                  q[H.id] = "".concat(H.getInt16(), ".").concat(H.getInt16(2));
                } else q[H.id] = H.getString();
                return q;
              }, {});
              if (!U.ifil) throw new l.ParseError("Missing required 'ifil' sub-chunk");
              if (!U.INAM) throw new l.ParseError("Missing required 'INAM' sub-chunk");
              return { version: U.ifil, soundEngine: U.isng || "EMU8000", name: U.INAM, rom: U.irom, romVersion: U.iver, creationDate: U.ICRD, author: U.IENG, product: U.IPRD, copyright: U.ICOP, comments: U.ICMT, createdBy: U.ISFT };
            } }, { key: "getSampleData", value: function() {
              if (this.id !== "LIST") throw new l.ParseError("Unexpected chunk ID", "'LIST'", "'".concat(this.id, "'"));
              var U = this.subChunks[0];
              if (U.id !== "smpl") throw new l.ParseError("Invalid chunk signature", "'smpl'", "'".concat(U.id, "'"));
              return U.buffer;
            } }, { key: "getPresetData", value: function() {
              if (this.id !== "LIST") throw new l.ParseError("Unexpected chunk ID", "'LIST'", "'".concat(this.id, "'"));
              return { presetHeaders: Object(p.getPresetHeaders)(this.subChunks[0]), presetZones: Object(p.getZones)(this.subChunks[1], "pbag"), presetModulators: Object(p.getModulators)(this.subChunks[2], "pmod"), presetGenerators: Object(p.getGenerators)(this.subChunks[3], "pgen"), instrumentHeaders: Object(p.getInstrumentHeaders)(this.subChunks[4]), instrumentZones: Object(p.getZones)(this.subChunks[5], "ibag"), instrumentModulators: Object(p.getModulators)(this.subChunks[6], "imod"), instrumentGenerators: Object(p.getGenerators)(this.subChunks[7], "igen"), sampleHeaders: Object(p.getSampleHeaders)(this.subChunks[8]) };
            } }]) && d(I.prototype, V), k;
          }();
        }
      ), "./src/chunks/generators.ts": (
        /*!**********************************!*\
          !*** ./src/chunks/generators.ts ***!
          \**********************************/
        /*! exports provided: getGenerators */
        function(a, o, u) {
          u.r(o), u.d(o, "getGenerators", function() {
            return F;
          });
          var l = u(
            /*! ~/riff */
            "./src/riff/index.ts"
          ), f = u(
            /*! ~/types */
            "./src/types/index.ts"
          ), p = u(
            /*! ~/constants */
            "./src/constants.ts"
          ), g = [f.GeneratorType.StartAddrsOffset, f.GeneratorType.EndAddrsOffset, f.GeneratorType.StartLoopAddrsOffset, f.GeneratorType.EndLoopAddrsOffset, f.GeneratorType.StartAddrsCoarseOffset, f.GeneratorType.EndAddrsCoarseOffset, f.GeneratorType.StartLoopAddrsCoarseOffset, f.GeneratorType.KeyNum, f.GeneratorType.Velocity, f.GeneratorType.EndLoopAddrsCoarseOffset, f.GeneratorType.SampleModes, f.GeneratorType.ExclusiveClass, f.GeneratorType.OverridingRootKey], d = [f.GeneratorType.Unused1, f.GeneratorType.Unused2, f.GeneratorType.Unused3, f.GeneratorType.Unused4, f.GeneratorType.Reserved1, f.GeneratorType.Reserved2, f.GeneratorType.Reserved3], b = [f.GeneratorType.KeyRange, f.GeneratorType.VelRange], F = function(E, S) {
            if (E.id !== S) throw new l.ParseError("Unexpected chunk ID", "'".concat(S, "'"), "'".concat(E.id, "'"));
            if (E.length % p.SF_GENERATOR_SIZE) throw new l.ParseError("Invalid size for the '".concat(S, "' sub-chunk"));
            return E.iterate(function(R) {
              var k = R.getInt16();
              return f.GeneratorType[k] ? S === "pgen" && g.includes(k) || S === "igen" && d.includes(k) ? null : b.includes(k) ? { id: k, range: { lo: R.getByte(), hi: R.getByte() } } : { id: k, value: R.getInt16BE() } : null;
            });
          };
        }
      ), "./src/chunks/index.ts": (
        /*!*****************************!*\
          !*** ./src/chunks/index.ts ***!
          \*****************************/
        /*! exports provided: getGenerators, getModulators, getZones, getItemsInZone, getInstrumentHeaders, getPresetHeaders, getSampleHeaders */
        function(a, o, u) {
          u.r(o);
          var l = u(
            /*! ./instruments */
            "./src/chunks/instruments/index.ts"
          );
          u.d(o, "getInstrumentHeaders", function() {
            return l.getInstrumentHeaders;
          });
          var f = u(
            /*! ./presets */
            "./src/chunks/presets/index.ts"
          );
          u.d(o, "getPresetHeaders", function() {
            return f.getPresetHeaders;
          });
          var p = u(
            /*! ./samples */
            "./src/chunks/samples/index.ts"
          );
          u.d(o, "getSampleHeaders", function() {
            return p.getSampleHeaders;
          });
          var g = u(
            /*! ./generators */
            "./src/chunks/generators.ts"
          );
          u.d(o, "getGenerators", function() {
            return g.getGenerators;
          });
          var d = u(
            /*! ./modulators */
            "./src/chunks/modulators.ts"
          );
          u.d(o, "getModulators", function() {
            return d.getModulators;
          });
          var b = u(
            /*! ./zones */
            "./src/chunks/zones.ts"
          );
          u.d(o, "getZones", function() {
            return b.getZones;
          }), u.d(o, "getItemsInZone", function() {
            return b.getItemsInZone;
          });
        }
      ), "./src/chunks/instruments/headers.ts": (
        /*!*******************************************!*\
          !*** ./src/chunks/instruments/headers.ts ***!
          \*******************************************/
        /*! exports provided: getInstrumentHeaders */
        function(a, o, u) {
          u.r(o), u.d(o, "getInstrumentHeaders", function() {
            return p;
          });
          var l = u(
            /*! ~/riff */
            "./src/riff/index.ts"
          ), f = u(
            /*! ~/constants */
            "./src/constants.ts"
          ), p = function(g) {
            if (g.id !== "inst") throw new l.ParseError("Unexpected chunk ID", "'inst'", "'".concat(g.id, "'"));
            if (g.length % f.SF_INSTRUMENT_HEADER_SIZE) throw new l.ParseError("Invalid size for the 'inst' sub-chunk");
            return g.iterate(function(d) {
              return { name: d.getString(), bagIndex: d.getInt16() };
            });
          };
        }
      ), "./src/chunks/instruments/index.ts": (
        /*!*****************************************!*\
          !*** ./src/chunks/instruments/index.ts ***!
          \*****************************************/
        /*! exports provided: getInstrumentHeaders */
        function(a, o, u) {
          u.r(o);
          var l = u(
            /*! ./headers */
            "./src/chunks/instruments/headers.ts"
          );
          u.d(o, "getInstrumentHeaders", function() {
            return l.getInstrumentHeaders;
          });
        }
      ), "./src/chunks/modulators.ts": (
        /*!**********************************!*\
          !*** ./src/chunks/modulators.ts ***!
          \**********************************/
        /*! exports provided: getModulators */
        function(a, o, u) {
          u.r(o), u.d(o, "getModulators", function() {
            return g;
          });
          var l = u(
            /*! ~/riff */
            "./src/riff/index.ts"
          ), f = u(
            /*! ~/constants */
            "./src/constants.ts"
          ), p = function(d) {
            return { type: d >> 10 & 63, polarity: d >> 9 & 1, direction: d >> 8 & 1, palette: d >> 7 & 1, index: 127 & d };
          }, g = function(d, b) {
            if (d.id !== b) throw new l.ParseError("Unexpected chunk ID", "'".concat(b, "'"), "'".concat(d.id, "'"));
            if (d.length % f.SF_MODULATOR_SIZE) throw new l.ParseError("Invalid size for the '".concat(b, "' sub-chunk"));
            return d.iterate(function(F) {
              return { source: p(F.getInt16BE()), id: F.getInt16BE(), value: F.getInt16BE(), valueSource: p(F.getInt16BE()), transform: F.getInt16BE() };
            });
          };
        }
      ), "./src/chunks/presets/headers.ts": (
        /*!***************************************!*\
          !*** ./src/chunks/presets/headers.ts ***!
          \***************************************/
        /*! exports provided: getPresetHeaders */
        function(a, o, u) {
          u.r(o), u.d(o, "getPresetHeaders", function() {
            return p;
          });
          var l = u(
            /*! ~/riff */
            "./src/riff/index.ts"
          ), f = u(
            /*! ~/constants */
            "./src/constants.ts"
          ), p = function(g) {
            if (g.id !== "phdr") throw new l.ParseError("Invalid chunk ID", "'phdr'", "'".concat(g.id, "'"));
            if (g.length % f.SF_PRESET_HEADER_SIZE) throw new l.ParseError("Invalid size for the 'phdr' sub-chunk");
            return g.iterate(function(d) {
              return { name: d.getString(), preset: d.getInt16(), bank: d.getInt16(), bagIndex: d.getInt16(), library: d.getUInt32(), genre: d.getUInt32(), morphology: d.getUInt32() };
            });
          };
        }
      ), "./src/chunks/presets/index.ts": (
        /*!*************************************!*\
          !*** ./src/chunks/presets/index.ts ***!
          \*************************************/
        /*! exports provided: getPresetHeaders */
        function(a, o, u) {
          u.r(o);
          var l = u(
            /*! ./headers */
            "./src/chunks/presets/headers.ts"
          );
          u.d(o, "getPresetHeaders", function() {
            return l.getPresetHeaders;
          });
        }
      ), "./src/chunks/samples/headers.ts": (
        /*!***************************************!*\
          !*** ./src/chunks/samples/headers.ts ***!
          \***************************************/
        /*! exports provided: getSampleHeaders */
        function(a, o, u) {
          u.r(o), u.d(o, "getSampleHeaders", function() {
            return p;
          });
          var l = u(
            /*! ~/riff */
            "./src/riff/index.ts"
          ), f = u(
            /*! ~/constants */
            "./src/constants.ts"
          ), p = function(g) {
            if (g.id !== "shdr") throw new l.ParseError("Unexpected chunk ID", "'shdr'", "'".concat(g.id, "'"));
            if (g.length % f.SF_SAMPLE_HEADER_SIZE) throw new l.ParseError("Invalid size for the 'shdr' sub-chunk");
            return g.iterate(function(d) {
              return { name: d.getString(), start: d.getUInt32(), end: d.getUInt32(), startLoop: d.getUInt32(), endLoop: d.getUInt32(), sampleRate: d.getUInt32(), originalPitch: d.getByte(), pitchCorrection: d.getChar(), link: d.getInt16(), type: d.getInt16() };
            });
          };
        }
      ), "./src/chunks/samples/index.ts": (
        /*!*************************************!*\
          !*** ./src/chunks/samples/index.ts ***!
          \*************************************/
        /*! exports provided: getSampleHeaders */
        function(a, o, u) {
          u.r(o);
          var l = u(
            /*! ./headers */
            "./src/chunks/samples/headers.ts"
          );
          u.d(o, "getSampleHeaders", function() {
            return l.getSampleHeaders;
          });
        }
      ), "./src/chunks/zones.ts": (
        /*!*****************************!*\
          !*** ./src/chunks/zones.ts ***!
          \*****************************/
        /*! exports provided: getZones, getItemsInZone */
        function(a, o, u) {
          u.r(o), u.d(o, "getZones", function() {
            return g;
          }), u.d(o, "getItemsInZone", function() {
            return d;
          });
          var l = u(
            /*! ~/riff */
            "./src/riff/index.ts"
          ), f = u(
            /*! ~/constants */
            "./src/constants.ts"
          ), p = u(
            /*! ~/types */
            "./src/types/index.ts"
          ), g = function(S, R) {
            if (S.id !== R) throw new l.ParseError("Unexpected chunk ID", "'".concat(R, "'"), "'".concat(S.id, "'"));
            if (S.length % f.SF_BAG_SIZE) throw new l.ParseError("Invalid size for the '".concat(R, "' sub-chunk"));
            return S.iterate(function(k) {
              return { generatorIndex: k.getInt16(), modulatorIndex: k.getInt16() };
            });
          }, d = function(S, R, k, I, V, U) {
            for (var q = [], H = 0; H < S.length; H++) {
              for (var z = S[H], j = S[H + 1], ee = z.bagIndex, te = j ? j.bagIndex : R.length, de = [], ie = void 0, he = ee; he < te; he++) {
                var fe = b(he, R, k), le = F(he, R, I), _e = le[p.GeneratorType.KeyRange] && le[p.GeneratorType.KeyRange].range, Me = le[U];
                if (Me) {
                  var be = V[Me.value];
                  be && de.push({ keyRange: _e, modulators: fe, generators: le, reference: be });
                } else he - ee == 0 && (ie = { keyRange: _e, modulators: fe, generators: le });
              }
              q.push({ header: z, globalZone: ie, zones: de });
            }
            return q;
          }, b = function(S, R, k) {
            var I = R[S], V = R[S + 1], U = I.modulatorIndex, q = V ? V.modulatorIndex : R.length;
            return E(U, q, k);
          }, F = function(S, R, k) {
            var I = R[S], V = R[S + 1], U = I.generatorIndex, q = V ? V.generatorIndex : R.length;
            return E(U, q, k);
          }, E = function(S, R, k) {
            for (var I = {}, V = S; V < R; V++) {
              var U = k[V];
              U && (I[U.id] = U);
            }
            return I;
          };
        }
      ), "./src/constants.ts": (
        /*!**************************!*\
          !*** ./src/constants.ts ***!
          \**************************/
        /*! exports provided: SF_VERSION_LENGTH, SF_PRESET_HEADER_SIZE, SF_BAG_SIZE, SF_MODULATOR_SIZE, SF_GENERATOR_SIZE, SF_INSTRUMENT_HEADER_SIZE, SF_SAMPLE_HEADER_SIZE, DEFAULT_SAMPLE_RATE */
        function(a, o, u) {
          u.r(o), u.d(o, "SF_VERSION_LENGTH", function() {
            return l;
          }), u.d(o, "SF_PRESET_HEADER_SIZE", function() {
            return f;
          }), u.d(o, "SF_BAG_SIZE", function() {
            return p;
          }), u.d(o, "SF_MODULATOR_SIZE", function() {
            return g;
          }), u.d(o, "SF_GENERATOR_SIZE", function() {
            return d;
          }), u.d(o, "SF_INSTRUMENT_HEADER_SIZE", function() {
            return b;
          }), u.d(o, "SF_SAMPLE_HEADER_SIZE", function() {
            return F;
          }), u.d(o, "DEFAULT_SAMPLE_RATE", function() {
            return E;
          });
          var l = 4, f = 38, p = 4, g = 10, d = 4, b = 22, F = 46, E = 22050;
        }
      ), "./src/index.ts": (
        /*!**********************!*\
          !*** ./src/index.ts ***!
          \**********************/
        /*! no static exports found */
        function(a, o, u) {
          u.r(o);
          var l = u(
            /*! ./types */
            "./src/types/index.ts"
          );
          for (var f in l) f !== "default" && function(b) {
            u.d(o, b, function() {
              return l[b];
            });
          }(f);
          var p = u(
            /*! ./chunk */
            "./src/chunk.ts"
          );
          u.d(o, "SF2Chunk", function() {
            return p.SF2Chunk;
          });
          var g = u(
            /*! ./constants */
            "./src/constants.ts"
          );
          u.d(o, "SF_VERSION_LENGTH", function() {
            return g.SF_VERSION_LENGTH;
          }), u.d(o, "SF_PRESET_HEADER_SIZE", function() {
            return g.SF_PRESET_HEADER_SIZE;
          }), u.d(o, "SF_BAG_SIZE", function() {
            return g.SF_BAG_SIZE;
          }), u.d(o, "SF_MODULATOR_SIZE", function() {
            return g.SF_MODULATOR_SIZE;
          }), u.d(o, "SF_GENERATOR_SIZE", function() {
            return g.SF_GENERATOR_SIZE;
          }), u.d(o, "SF_INSTRUMENT_HEADER_SIZE", function() {
            return g.SF_INSTRUMENT_HEADER_SIZE;
          }), u.d(o, "SF_SAMPLE_HEADER_SIZE", function() {
            return g.SF_SAMPLE_HEADER_SIZE;
          }), u.d(o, "DEFAULT_SAMPLE_RATE", function() {
            return g.DEFAULT_SAMPLE_RATE;
          });
          var d = u(
            /*! ./soundFont2 */
            "./src/soundFont2.ts"
          );
          u.d(o, "SoundFont2", function() {
            return d.SoundFont2;
          });
        }
      ), "./src/riff/chunkIterator.ts": (
        /*!***********************************!*\
          !*** ./src/riff/chunkIterator.ts ***!
          \***********************************/
        /*! exports provided: ChunkIterator */
        function(a, o, u) {
          u.r(o), u.d(o, "ChunkIterator", function() {
            return g;
          });
          var l = u(
            /*! ~/utils */
            "./src/utils/index.ts"
          );
          function f(d, b) {
            for (var F = 0; F < b.length; F++) {
              var E = b[F];
              E.enumerable = E.enumerable || !1, E.configurable = !0, "value" in E && (E.writable = !0), Object.defineProperty(d, E.key, E);
            }
          }
          function p(d, b, F) {
            return b in d ? Object.defineProperty(d, b, { value: F, enumerable: !0, configurable: !0, writable: !0 }) : d[b] = F, d;
          }
          var g = function() {
            function d(E) {
              var S = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
              (function(R, k) {
                if (!(R instanceof k)) throw new TypeError("Cannot call a class as a function");
              })(this, d), p(this, "target", []), p(this, "chunk", void 0), p(this, "position", 0), this.chunk = E, this.position = S;
            }
            var b, F;
            return b = d, (F = [{ key: "iterate", value: function(E) {
              for (; this.position < this.chunk.length; ) {
                var S = E(this);
                S && this.target.push(S);
              }
            } }, { key: "getString", value: function() {
              var E = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 20, S = Object(l.getStringFromBuffer)(this.getBuffer(this.position, E));
              return this.position += E, S;
            } }, { key: "getInt16", value: function() {
              return this.chunk.buffer[this.position++] | this.chunk.buffer[this.position++] << 8;
            } }, { key: "getInt16BE", value: function() {
              return this.getInt16() << 16 >> 16;
            } }, { key: "getUInt32", value: function() {
              return (this.chunk.buffer[this.position++] | this.chunk.buffer[this.position++] << 8 | this.chunk.buffer[this.position++] << 16 | this.chunk.buffer[this.position++] << 24) >>> 0;
            } }, { key: "getByte", value: function() {
              return this.chunk.buffer[this.position++];
            } }, { key: "getChar", value: function() {
              return this.chunk.buffer[this.position++] << 24 >> 24;
            } }, { key: "skip", value: function(E) {
              this.position += E;
            } }, { key: "getBuffer", value: function(E, S) {
              return this.chunk.buffer.subarray(E, E + S);
            } }, { key: "currentPosition", get: function() {
              return this.position;
            } }]) && f(b.prototype, F), d;
          }();
        }
      ), "./src/riff/index.ts": (
        /*!***************************!*\
          !*** ./src/riff/index.ts ***!
          \***************************/
        /*! exports provided: ChunkIterator, ParseError, parseBuffer, getChunk, getChunkLength, getSubChunks, getChunkId, RIFFChunk */
        function(a, o, u) {
          u.r(o);
          var l = u(
            /*! ./chunkIterator */
            "./src/riff/chunkIterator.ts"
          );
          u.d(o, "ChunkIterator", function() {
            return l.ChunkIterator;
          });
          var f = u(
            /*! ./parseError */
            "./src/riff/parseError.ts"
          );
          u.d(o, "ParseError", function() {
            return f.ParseError;
          });
          var p = u(
            /*! ./parser */
            "./src/riff/parser.ts"
          );
          u.d(o, "parseBuffer", function() {
            return p.parseBuffer;
          }), u.d(o, "getChunk", function() {
            return p.getChunk;
          }), u.d(o, "getChunkLength", function() {
            return p.getChunkLength;
          }), u.d(o, "getSubChunks", function() {
            return p.getSubChunks;
          }), u.d(o, "getChunkId", function() {
            return p.getChunkId;
          });
          var g = u(
            /*! ./riffChunk */
            "./src/riff/riffChunk.ts"
          );
          u.d(o, "RIFFChunk", function() {
            return g.RIFFChunk;
          });
        }
      ), "./src/riff/parseError.ts": (
        /*!********************************!*\
          !*** ./src/riff/parseError.ts ***!
          \********************************/
        /*! exports provided: ParseError */
        function(a, o, u) {
          function l(E) {
            return (l = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(S) {
              return typeof S;
            } : function(S) {
              return S && typeof Symbol == "function" && S.constructor === Symbol && S !== Symbol.prototype ? "symbol" : typeof S;
            })(E);
          }
          function f(E, S) {
            return !S || l(S) !== "object" && typeof S != "function" ? function(R) {
              if (R === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return R;
            }(E) : S;
          }
          function p(E) {
            var S = typeof Map == "function" ? /* @__PURE__ */ new Map() : void 0;
            return (p = function(R) {
              if (R === null || (k = R, Function.toString.call(k).indexOf("[native code]") === -1)) return R;
              var k;
              if (typeof R != "function") throw new TypeError("Super expression must either be null or a function");
              if (S !== void 0) {
                if (S.has(R)) return S.get(R);
                S.set(R, I);
              }
              function I() {
                return g(R, arguments, b(this).constructor);
              }
              return I.prototype = Object.create(R.prototype, { constructor: { value: I, enumerable: !1, writable: !0, configurable: !0 } }), d(I, R);
            })(E);
          }
          function g(E, S, R) {
            return (g = function() {
              if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
              if (typeof Proxy == "function") return !0;
              try {
                return Date.prototype.toString.call(Reflect.construct(Date, [], function() {
                })), !0;
              } catch {
                return !1;
              }
            }() ? Reflect.construct : function(k, I, V) {
              var U = [null];
              U.push.apply(U, I);
              var q = new (Function.bind.apply(k, U))();
              return V && d(q, V.prototype), q;
            }).apply(null, arguments);
          }
          function d(E, S) {
            return (d = Object.setPrototypeOf || function(R, k) {
              return R.__proto__ = k, R;
            })(E, S);
          }
          function b(E) {
            return (b = Object.setPrototypeOf ? Object.getPrototypeOf : function(S) {
              return S.__proto__ || Object.getPrototypeOf(S);
            })(E);
          }
          u.r(o), u.d(o, "ParseError", function() {
            return F;
          });
          var F = function(E) {
            function S(R, k, I) {
              return function(V, U) {
                if (!(V instanceof U)) throw new TypeError("Cannot call a class as a function");
              }(this, S), f(this, b(S).call(this, "".concat(R).concat(k && I ? ", expected ".concat(k, ", received ").concat(I) : "")));
            }
            return function(R, k) {
              if (typeof k != "function" && k !== null) throw new TypeError("Super expression must either be null or a function");
              R.prototype = Object.create(k && k.prototype, { constructor: { value: R, writable: !0, configurable: !0 } }), k && d(R, k);
            }(S, p(Error)), S;
          }();
        }
      ), "./src/riff/parser.ts": (
        /*!****************************!*\
          !*** ./src/riff/parser.ts ***!
          \****************************/
        /*! exports provided: parseBuffer, getChunk, getChunkLength, getSubChunks, getChunkId */
        function(a, o, u) {
          u.r(o), u.d(o, "parseBuffer", function() {
            return g;
          }), u.d(o, "getChunk", function() {
            return d;
          }), u.d(o, "getChunkLength", function() {
            return b;
          }), u.d(o, "getSubChunks", function() {
            return F;
          }), u.d(o, "getChunkId", function() {
            return E;
          });
          var l = u(
            /*! ./parseError */
            "./src/riff/parseError.ts"
          ), f = u(
            /*! ~/utils/buffer */
            "./src/utils/buffer.ts"
          ), p = u(
            /*! ./riffChunk */
            "./src/riff/riffChunk.ts"
          ), g = function(S) {
            var R = E(S);
            if (R !== "RIFF") throw new l.ParseError("Invalid file format", "RIFF", R);
            var k = E(S, 8);
            if (k !== "sfbk") throw new l.ParseError("Invalid signature", "sfbk", k);
            var I = S.subarray(8), V = F(I.subarray(4));
            return new p.RIFFChunk(R, I.length, I, V);
          }, d = function(S, R) {
            var k = E(S, R), I = b(S, R + 4), V = [];
            return k !== "RIFF" && k !== "LIST" || (V = F(S.subarray(R + 12))), new p.RIFFChunk(k, I, S.subarray(R + 8), V);
          }, b = function(S, R) {
            return ((S = S.subarray(R, R + 4))[0] | S[1] << 8 | S[2] << 16 | S[3] << 24) >>> 0;
          }, F = function(S) {
            for (var R = [], k = 0; k <= S.length - 8; ) {
              var I = d(S, k);
              R.push(I), k = (k += 8 + I.length) % 2 ? k + 1 : k;
            }
            return R;
          }, E = function(S) {
            var R = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
            return Object(f.getStringFromBuffer)(S.subarray(R, R + 4));
          };
        }
      ), "./src/riff/riffChunk.ts": (
        /*!*******************************!*\
          !*** ./src/riff/riffChunk.ts ***!
          \*******************************/
        /*! exports provided: RIFFChunk */
        function(a, o, u) {
          u.r(o), u.d(o, "RIFFChunk", function() {
            return d;
          });
          var l = u(
            /*! ./chunkIterator */
            "./src/riff/chunkIterator.ts"
          ), f = u(
            /*! ~/utils */
            "./src/utils/index.ts"
          );
          function p(b, F) {
            for (var E = 0; E < F.length; E++) {
              var S = F[E];
              S.enumerable = S.enumerable || !1, S.configurable = !0, "value" in S && (S.writable = !0), Object.defineProperty(b, S.key, S);
            }
          }
          function g(b, F, E) {
            return F in b ? Object.defineProperty(b, F, { value: E, enumerable: !0, configurable: !0, writable: !0 }) : b[F] = E, b;
          }
          var d = function() {
            function b(S, R, k, I) {
              (function(V, U) {
                if (!(V instanceof U)) throw new TypeError("Cannot call a class as a function");
              })(this, b), g(this, "id", void 0), g(this, "length", void 0), g(this, "buffer", void 0), g(this, "subChunks", void 0), this.id = S, this.length = R, this.buffer = k, this.subChunks = I;
            }
            var F, E;
            return F = b, (E = [{ key: "getString", value: function() {
              var S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, R = arguments.length > 1 ? arguments[1] : void 0;
              return Object(f.getStringFromBuffer)(this.getBuffer(S, R || this.length - S));
            } }, { key: "getInt16", value: function() {
              var S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
              return this.buffer[S++] | this.buffer[S] << 8;
            } }, { key: "getUInt32", value: function() {
              var S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
              return (this.buffer[S++] | this.buffer[S++] << 8 | this.buffer[S++] << 16 | this.buffer[S] << 24) >>> 0;
            } }, { key: "getByte", value: function() {
              var S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
              return this.buffer[S];
            } }, { key: "getChar", value: function() {
              var S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
              return this.buffer[S] << 24 >> 24;
            } }, { key: "iterator", value: function() {
              var S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
              return new l.ChunkIterator(this, S);
            } }, { key: "iterate", value: function(S) {
              var R = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, k = new l.ChunkIterator(this, R);
              return k.iterate(S), k.target;
            } }, { key: "getBuffer", value: function(S, R) {
              return this.buffer.subarray(S, S + R);
            } }]) && p(F.prototype, E), b;
          }();
        }
      ), "./src/soundFont2.ts": (
        /*!***************************!*\
          !*** ./src/soundFont2.ts ***!
          \***************************/
        /*! exports provided: SoundFont2 */
        function(a, o, u) {
          u.r(o), u.d(o, "SoundFont2", function() {
            return R;
          });
          var l = u(
            /*! ./types */
            "./src/types/index.ts"
          ), f = u(
            /*! ./chunk */
            "./src/chunk.ts"
          ), p = u(
            /*! ./riff */
            "./src/riff/index.ts"
          ), g = u(
            /*! ./chunks */
            "./src/chunks/index.ts"
          ), d = u(
            /*! ./utils */
            "./src/utils/index.ts"
          );
          function b(k) {
            for (var I = 1; I < arguments.length; I++) {
              var V = arguments[I] != null ? arguments[I] : {}, U = Object.keys(V);
              typeof Object.getOwnPropertySymbols == "function" && (U = U.concat(Object.getOwnPropertySymbols(V).filter(function(q) {
                return Object.getOwnPropertyDescriptor(V, q).enumerable;
              }))), U.forEach(function(q) {
                S(k, q, V[q]);
              });
            }
            return k;
          }
          function F(k, I) {
            for (var V = 0; V < I.length; V++) {
              var U = I[V];
              U.enumerable = U.enumerable || !1, U.configurable = !0, "value" in U && (U.writable = !0), Object.defineProperty(k, U.key, U);
            }
          }
          function E(k, I, V) {
            return I && F(k.prototype, I), V && F(k, V), k;
          }
          function S(k, I, V) {
            return I in k ? Object.defineProperty(k, I, { value: V, enumerable: !0, configurable: !0, writable: !0 }) : k[I] = V, k;
          }
          var R = function() {
            function k(I) {
              if (function(U, q) {
                if (!(U instanceof q)) throw new TypeError("Cannot call a class as a function");
              }(this, k), S(this, "chunk", void 0), S(this, "metaData", void 0), S(this, "sampleData", void 0), S(this, "samples", void 0), S(this, "presetData", void 0), S(this, "instruments", void 0), S(this, "presets", void 0), S(this, "banks", void 0), !(I instanceof f.SF2Chunk)) {
                var V = Object(p.parseBuffer)(I);
                I = new f.SF2Chunk(V);
              }
              if (I.subChunks.length !== 3) throw new p.ParseError("Invalid sfbk structure", "3 chunks", "".concat(I.subChunks.length, " chunks"));
              this.chunk = I, this.metaData = I.subChunks[0].getMetaData(), this.sampleData = I.subChunks[1].getSampleData(), this.presetData = I.subChunks[2].getPresetData(), this.samples = this.getSamples(), this.instruments = this.getInstruments(), this.presets = this.getPresets(), this.banks = this.getBanks();
            }
            return E(k, null, [{ key: "from", value: function(I) {
              return new k(I);
            } }]), E(k, [{ key: "getKeyData", value: function(I) {
              var V = this, U = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, q = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
              return Object(d.memoize)(function(H, z, j) {
                var ee = V.banks[z];
                if (ee) {
                  var te = ee.presets[j];
                  if (te) {
                    var de = te.zones.find(function(Me) {
                      return V.isKeyInRange(Me, H);
                    });
                    if (de) {
                      var ie = de.instrument, he = ie.zones.find(function(Me) {
                        return V.isKeyInRange(Me, H);
                      });
                      if (he) {
                        var fe = he.sample, le = b({}, de.generators, he.generators), _e = b({}, de.modulators, he.modulators);
                        return { keyNumber: H, preset: te, instrument: ie, sample: fe, generators: le, modulators: _e };
                      }
                    }
                  }
                }
                return null;
              })(I, U, q);
            } }, { key: "isKeyInRange", value: function(I, V) {
              return I.keyRange === void 0 || I.keyRange.lo <= V && I.keyRange.hi >= V;
            } }, { key: "getBanks", value: function() {
              return this.presets.reduce(function(I, V) {
                var U = V.header.bank;
                return I[U] || (I[U] = { presets: [] }), I[U].presets[V.header.preset] = V, I;
              }, []);
            } }, { key: "getPresets", value: function() {
              var I = this.presetData, V = I.presetHeaders, U = I.presetZones, q = I.presetGenerators, H = I.presetModulators;
              return Object(g.getItemsInZone)(V, U, H, q, this.instruments, l.GeneratorType.Instrument).filter(function(z) {
                return z.header.name !== "EOP";
              }).map(function(z) {
                return { header: z.header, globalZone: z.globalZone, zones: z.zones.map(function(j) {
                  return { keyRange: j.keyRange, generators: j.generators, modulators: j.modulators, instrument: j.reference };
                }) };
              });
            } }, { key: "getInstruments", value: function() {
              var I = this.presetData, V = I.instrumentHeaders, U = I.instrumentZones, q = I.instrumentModulators, H = I.instrumentGenerators;
              return Object(g.getItemsInZone)(V, U, q, H, this.samples, l.GeneratorType.SampleId).filter(function(z) {
                return z.header.name !== "EOI";
              }).map(function(z) {
                return { header: z.header, globalZone: z.globalZone, zones: z.zones.map(function(j) {
                  return { keyRange: j.keyRange, generators: j.generators, modulators: j.modulators, sample: j.reference };
                }) };
              });
            } }, { key: "getSamples", value: function() {
              var I = this;
              return this.presetData.sampleHeaders.filter(function(V) {
                return V.name !== "EOS";
              }).map(function(V) {
                if (V.name !== "EOS" && V.sampleRate <= 0) throw new Error("Illegal sample rate of ".concat(V.sampleRate, " hz in sample '").concat(V.name, "'"));
                return V.originalPitch >= 128 && V.originalPitch <= 254 && (V.originalPitch = 60), V.startLoop -= V.start, V.endLoop -= V.start, { header: V, data: new Int16Array(new Uint8Array(I.sampleData.subarray(2 * V.start, 2 * V.end)).buffer) };
              });
            } }]), k;
          }();
        }
      ), "./src/types/bank.ts": (
        /*!***************************!*\
          !*** ./src/types/bank.ts ***!
          \***************************/
        /*! no static exports found */
        function(a, o) {
        }
      ), "./src/types/generator.ts": (
        /*!********************************!*\
          !*** ./src/types/generator.ts ***!
          \********************************/
        /*! exports provided: GeneratorType, DEFAULT_GENERATOR_VALUES */
        function(a, o, u) {
          var l, f;
          function p(d, b, F) {
            return b in d ? Object.defineProperty(d, b, { value: F, enumerable: !0, configurable: !0, writable: !0 }) : d[b] = F, d;
          }
          u.r(o), u.d(o, "GeneratorType", function() {
            return f;
          }), u.d(o, "DEFAULT_GENERATOR_VALUES", function() {
            return g;
          }), function(d) {
            d[d.StartAddrsOffset = 0] = "StartAddrsOffset", d[d.EndAddrsOffset = 1] = "EndAddrsOffset", d[d.StartLoopAddrsOffset = 2] = "StartLoopAddrsOffset", d[d.EndLoopAddrsOffset = 3] = "EndLoopAddrsOffset", d[d.StartAddrsCoarseOffset = 4] = "StartAddrsCoarseOffset", d[d.ModLFOToPitch = 5] = "ModLFOToPitch", d[d.VibLFOToPitch = 6] = "VibLFOToPitch", d[d.ModEnvToPitch = 7] = "ModEnvToPitch", d[d.InitialFilterFc = 8] = "InitialFilterFc", d[d.InitialFilterQ = 9] = "InitialFilterQ", d[d.ModLFOToFilterFc = 10] = "ModLFOToFilterFc", d[d.ModEnvToFilterFc = 11] = "ModEnvToFilterFc", d[d.EndAddrsCoarseOffset = 12] = "EndAddrsCoarseOffset", d[d.ModLFOToVolume = 13] = "ModLFOToVolume", d[d.Unused1 = 14] = "Unused1", d[d.ChorusEffectsSend = 15] = "ChorusEffectsSend", d[d.ReverbEffectsSend = 16] = "ReverbEffectsSend", d[d.Pan = 17] = "Pan", d[d.Unused2 = 18] = "Unused2", d[d.Unused3 = 19] = "Unused3", d[d.Unused4 = 20] = "Unused4", d[d.DelayModLFO = 21] = "DelayModLFO", d[d.FreqModLFO = 22] = "FreqModLFO", d[d.DelayVibLFO = 23] = "DelayVibLFO", d[d.FreqVibLFO = 24] = "FreqVibLFO", d[d.DelayModEnv = 25] = "DelayModEnv", d[d.AttackModEnv = 26] = "AttackModEnv", d[d.HoldModEnv = 27] = "HoldModEnv", d[d.DecayModEnv = 28] = "DecayModEnv", d[d.SustainModEnv = 29] = "SustainModEnv", d[d.ReleaseModEnv = 30] = "ReleaseModEnv", d[d.KeyNumToModEnvHold = 31] = "KeyNumToModEnvHold", d[d.KeyNumToModEnvDecay = 32] = "KeyNumToModEnvDecay", d[d.DelayVolEnv = 33] = "DelayVolEnv", d[d.AttackVolEnv = 34] = "AttackVolEnv", d[d.HoldVolEnv = 35] = "HoldVolEnv", d[d.DecayVolEnv = 36] = "DecayVolEnv", d[d.SustainVolEnv = 37] = "SustainVolEnv", d[d.ReleaseVolEnv = 38] = "ReleaseVolEnv", d[d.KeyNumToVolEnvHold = 39] = "KeyNumToVolEnvHold", d[d.KeyNumToVolEnvDecay = 40] = "KeyNumToVolEnvDecay", d[d.Instrument = 41] = "Instrument", d[d.Reserved1 = 42] = "Reserved1", d[d.KeyRange = 43] = "KeyRange", d[d.VelRange = 44] = "VelRange", d[d.StartLoopAddrsCoarseOffset = 45] = "StartLoopAddrsCoarseOffset", d[d.KeyNum = 46] = "KeyNum", d[d.Velocity = 47] = "Velocity", d[d.InitialAttenuation = 48] = "InitialAttenuation", d[d.Reserved2 = 49] = "Reserved2", d[d.EndLoopAddrsCoarseOffset = 50] = "EndLoopAddrsCoarseOffset", d[d.CoarseTune = 51] = "CoarseTune", d[d.FineTune = 52] = "FineTune", d[d.SampleId = 53] = "SampleId", d[d.SampleModes = 54] = "SampleModes", d[d.Reserved3 = 55] = "Reserved3", d[d.ScaleTuning = 56] = "ScaleTuning", d[d.ExclusiveClass = 57] = "ExclusiveClass", d[d.OverridingRootKey = 58] = "OverridingRootKey", d[d.Unused5 = 59] = "Unused5", d[d.EndOper = 60] = "EndOper";
          }(f || (f = {}));
          var g = (p(l = {}, f.StartAddrsOffset, 0), p(l, f.EndAddrsOffset, 0), p(l, f.StartLoopAddrsOffset, 0), p(l, f.EndLoopAddrsOffset, 0), p(l, f.StartAddrsCoarseOffset, 0), p(l, f.ModLFOToPitch, 0), p(l, f.VibLFOToPitch, 0), p(l, f.ModEnvToPitch, 0), p(l, f.InitialFilterFc, 13500), p(l, f.InitialFilterQ, 0), p(l, f.ModLFOToFilterFc, 0), p(l, f.ModEnvToFilterFc, 0), p(l, f.EndAddrsCoarseOffset, 0), p(l, f.ModLFOToVolume, 0), p(l, f.ChorusEffectsSend, 0), p(l, f.ReverbEffectsSend, 0), p(l, f.Pan, 0), p(l, f.DelayModLFO, -12e3), p(l, f.FreqModLFO, 0), p(l, f.DelayVibLFO, -12e3), p(l, f.FreqVibLFO, 0), p(l, f.DelayModEnv, -12e3), p(l, f.AttackModEnv, -12e3), p(l, f.HoldModEnv, -12e3), p(l, f.DecayModEnv, -12e3), p(l, f.SustainModEnv, 0), p(l, f.ReleaseModEnv, -12e3), p(l, f.KeyNumToModEnvHold, 0), p(l, f.KeyNumToModEnvDecay, 0), p(l, f.DelayVolEnv, -12e3), p(l, f.AttackVolEnv, -12e3), p(l, f.HoldVolEnv, -12e3), p(l, f.DecayVolEnv, -12e3), p(l, f.SustainVolEnv, 0), p(l, f.ReleaseVolEnv, -12e3), p(l, f.KeyNumToVolEnvHold, 0), p(l, f.KeyNumToVolEnvDecay, 0), p(l, f.StartLoopAddrsCoarseOffset, 0), p(l, f.KeyNum, -1), p(l, f.Velocity, -1), p(l, f.InitialAttenuation, 0), p(l, f.EndLoopAddrsCoarseOffset, 0), p(l, f.CoarseTune, 0), p(l, f.FineTune, 0), p(l, f.SampleModes, 0), p(l, f.ScaleTuning, 100), p(l, f.ExclusiveClass, 0), p(l, f.OverridingRootKey, -1), l);
        }
      ), "./src/types/index.ts": (
        /*!****************************!*\
          !*** ./src/types/index.ts ***!
          \****************************/
        /*! no static exports found */
        function(a, o, u) {
          u.r(o);
          var l = u(
            /*! ./bank */
            "./src/types/bank.ts"
          );
          for (var f in l) f !== "default" && function(I) {
            u.d(o, I, function() {
              return l[I];
            });
          }(f);
          var p = u(
            /*! ./generator */
            "./src/types/generator.ts"
          );
          u.d(o, "GeneratorType", function() {
            return p.GeneratorType;
          }), u.d(o, "DEFAULT_GENERATOR_VALUES", function() {
            return p.DEFAULT_GENERATOR_VALUES;
          });
          var g = u(
            /*! ./instrument */
            "./src/types/instrument.ts"
          );
          for (var f in g) ["GeneratorType", "DEFAULT_GENERATOR_VALUES", "default"].indexOf(f) < 0 && function(V) {
            u.d(o, V, function() {
              return g[V];
            });
          }(f);
          var d = u(
            /*! ./key */
            "./src/types/key.ts"
          );
          for (var f in d) ["GeneratorType", "DEFAULT_GENERATOR_VALUES", "default"].indexOf(f) < 0 && function(V) {
            u.d(o, V, function() {
              return d[V];
            });
          }(f);
          var b = u(
            /*! ./metaData */
            "./src/types/metaData.ts"
          );
          for (var f in b) ["GeneratorType", "DEFAULT_GENERATOR_VALUES", "default"].indexOf(f) < 0 && function(V) {
            u.d(o, V, function() {
              return b[V];
            });
          }(f);
          var F = u(
            /*! ./modulator */
            "./src/types/modulator.ts"
          );
          u.d(o, "ControllerType", function() {
            return F.ControllerType;
          }), u.d(o, "ControllerPolarity", function() {
            return F.ControllerPolarity;
          }), u.d(o, "ControllerDirection", function() {
            return F.ControllerDirection;
          }), u.d(o, "ControllerPalette", function() {
            return F.ControllerPalette;
          }), u.d(o, "Controller", function() {
            return F.Controller;
          }), u.d(o, "TransformType", function() {
            return F.TransformType;
          }), u.d(o, "DEFAULT_INSTRUMENT_MODULATORS", function() {
            return F.DEFAULT_INSTRUMENT_MODULATORS;
          });
          var E = u(
            /*! ./preset */
            "./src/types/preset.ts"
          );
          for (var f in E) ["GeneratorType", "DEFAULT_GENERATOR_VALUES", "ControllerType", "ControllerPolarity", "ControllerDirection", "ControllerPalette", "Controller", "TransformType", "DEFAULT_INSTRUMENT_MODULATORS", "default"].indexOf(f) < 0 && function(V) {
            u.d(o, V, function() {
              return E[V];
            });
          }(f);
          var S = u(
            /*! ./presetData */
            "./src/types/presetData.ts"
          );
          for (var f in S) ["GeneratorType", "DEFAULT_GENERATOR_VALUES", "ControllerType", "ControllerPolarity", "ControllerDirection", "ControllerPalette", "Controller", "TransformType", "DEFAULT_INSTRUMENT_MODULATORS", "default"].indexOf(f) < 0 && function(V) {
            u.d(o, V, function() {
              return S[V];
            });
          }(f);
          var R = u(
            /*! ./sample */
            "./src/types/sample.ts"
          );
          u.d(o, "SampleType", function() {
            return R.SampleType;
          });
          var k = u(
            /*! ./zone */
            "./src/types/zone.ts"
          );
          for (var f in k) ["GeneratorType", "DEFAULT_GENERATOR_VALUES", "ControllerType", "ControllerPolarity", "ControllerDirection", "ControllerPalette", "Controller", "TransformType", "DEFAULT_INSTRUMENT_MODULATORS", "SampleType", "default"].indexOf(f) < 0 && function(V) {
            u.d(o, V, function() {
              return k[V];
            });
          }(f);
        }
      ), "./src/types/instrument.ts": (
        /*!*********************************!*\
          !*** ./src/types/instrument.ts ***!
          \*********************************/
        /*! no static exports found */
        function(a, o) {
        }
      ), "./src/types/key.ts": (
        /*!**************************!*\
          !*** ./src/types/key.ts ***!
          \**************************/
        /*! no static exports found */
        function(a, o) {
        }
      ), "./src/types/metaData.ts": (
        /*!*******************************!*\
          !*** ./src/types/metaData.ts ***!
          \*******************************/
        /*! no static exports found */
        function(a, o) {
        }
      ), "./src/types/modulator.ts": (
        /*!********************************!*\
          !*** ./src/types/modulator.ts ***!
          \********************************/
        /*! exports provided: ControllerType, ControllerPolarity, ControllerDirection, ControllerPalette, Controller, TransformType, DEFAULT_INSTRUMENT_MODULATORS */
        function(a, o, u) {
          u.r(o), u.d(o, "ControllerType", function() {
            return l;
          }), u.d(o, "ControllerPolarity", function() {
            return f;
          }), u.d(o, "ControllerDirection", function() {
            return p;
          }), u.d(o, "ControllerPalette", function() {
            return g;
          }), u.d(o, "Controller", function() {
            return d;
          }), u.d(o, "TransformType", function() {
            return b;
          }), u.d(o, "DEFAULT_INSTRUMENT_MODULATORS", function() {
            return E;
          });
          var l, f, p, g, d, b, F = u(
            /*! ./generator */
            "./src/types/generator.ts"
          );
          (function(S) {
            S[S.Linear = 0] = "Linear", S[S.Concave = 1] = "Concave", S[S.Convex = 2] = "Convex", S[S.Switch = 3] = "Switch";
          })(l || (l = {})), function(S) {
            S[S.Unipolar = 0] = "Unipolar", S[S.Bipolar = 1] = "Bipolar";
          }(f || (f = {})), function(S) {
            S[S.Increasing = 0] = "Increasing", S[S.Decreasing = 1] = "Decreasing";
          }(p || (p = {})), function(S) {
            S[S.GeneralController = 0] = "GeneralController", S[S.MidiController = 1] = "MidiController";
          }(g || (g = {})), function(S) {
            S[S.NoController = 0] = "NoController", S[S.NoteOnVelocity = 2] = "NoteOnVelocity", S[S.NoteOnKeyNumber = 3] = "NoteOnKeyNumber", S[S.PolyPressure = 10] = "PolyPressure", S[S.ChannelPressure = 13] = "ChannelPressure", S[S.PitchWheel = 14] = "PitchWheel", S[S.PitchWheelSensitivity = 16] = "PitchWheelSensitivity", S[S.Link = 127] = "Link";
          }(d || (d = {})), function(S) {
            S[S.Linear = 0] = "Linear", S[S.Absolute = 2] = "Absolute";
          }(b || (b = {}));
          var E = [{ id: F.GeneratorType.InitialAttenuation, source: { type: l.Concave, polarity: f.Unipolar, direction: p.Decreasing, palette: g.GeneralController, index: d.NoteOnVelocity }, value: 960, valueSource: { type: l.Linear, polarity: f.Unipolar, direction: p.Increasing, palette: g.GeneralController, index: d.NoController }, transform: b.Linear }, { id: F.GeneratorType.InitialFilterFc, source: { type: l.Linear, polarity: f.Unipolar, direction: p.Decreasing, palette: g.GeneralController, index: d.NoteOnVelocity }, value: -2400, valueSource: { type: l.Linear, polarity: f.Unipolar, direction: p.Increasing, palette: g.GeneralController, index: d.NoController }, transform: b.Linear }, { id: F.GeneratorType.VibLFOToPitch, source: { type: l.Linear, polarity: f.Unipolar, direction: p.Increasing, palette: g.GeneralController, index: d.ChannelPressure }, value: 50, valueSource: { type: l.Linear, polarity: f.Unipolar, direction: p.Increasing, palette: g.GeneralController, index: d.NoController }, transform: b.Linear }, { id: F.GeneratorType.VibLFOToPitch, source: { type: l.Linear, polarity: f.Unipolar, direction: p.Increasing, palette: g.MidiController, index: 1 }, value: 50, valueSource: { type: l.Linear, polarity: f.Unipolar, direction: p.Increasing, palette: g.GeneralController, index: d.NoController }, transform: b.Linear }, { id: F.GeneratorType.InitialAttenuation, source: { type: l.Concave, polarity: f.Unipolar, direction: p.Decreasing, palette: g.MidiController, index: 7 }, value: 960, valueSource: { type: l.Linear, polarity: f.Unipolar, direction: p.Increasing, palette: g.GeneralController, index: d.NoController }, transform: b.Linear }, { id: F.GeneratorType.InitialAttenuation, source: { type: l.Linear, polarity: f.Bipolar, direction: p.Increasing, palette: g.MidiController, index: 10 }, value: 1e3, valueSource: { type: l.Linear, polarity: f.Unipolar, direction: p.Increasing, palette: g.GeneralController, index: d.NoController }, transform: b.Linear }, { id: F.GeneratorType.InitialAttenuation, source: { type: l.Concave, polarity: f.Unipolar, direction: p.Decreasing, palette: g.MidiController, index: 11 }, value: 960, valueSource: { type: l.Linear, polarity: f.Unipolar, direction: p.Increasing, palette: g.GeneralController, index: d.NoController }, transform: b.Linear }, { id: F.GeneratorType.ReverbEffectsSend, source: { type: l.Linear, polarity: f.Unipolar, direction: p.Increasing, palette: g.MidiController, index: 91 }, value: 200, valueSource: { type: l.Linear, polarity: f.Unipolar, direction: p.Increasing, palette: g.GeneralController, index: d.NoController }, transform: b.Linear }, { id: F.GeneratorType.ChorusEffectsSend, source: { type: l.Linear, polarity: f.Unipolar, direction: p.Increasing, palette: g.MidiController, index: 93 }, value: 200, valueSource: { type: l.Linear, polarity: f.Unipolar, direction: p.Increasing, palette: g.GeneralController, index: d.NoController }, transform: b.Linear }, { id: F.GeneratorType.CoarseTune, source: { type: l.Linear, polarity: f.Bipolar, direction: p.Increasing, palette: g.GeneralController, index: d.PitchWheel }, value: 12700, valueSource: { type: l.Linear, polarity: f.Unipolar, direction: p.Increasing, palette: g.GeneralController, index: d.PitchWheelSensitivity }, transform: b.Linear }];
        }
      ), "./src/types/preset.ts": (
        /*!*****************************!*\
          !*** ./src/types/preset.ts ***!
          \*****************************/
        /*! no static exports found */
        function(a, o) {
        }
      ), "./src/types/presetData.ts": (
        /*!*********************************!*\
          !*** ./src/types/presetData.ts ***!
          \*********************************/
        /*! no static exports found */
        function(a, o) {
        }
      ), "./src/types/sample.ts": (
        /*!*****************************!*\
          !*** ./src/types/sample.ts ***!
          \*****************************/
        /*! exports provided: SampleType */
        function(a, o, u) {
          var l;
          u.r(o), u.d(o, "SampleType", function() {
            return l;
          }), function(f) {
            f[f.EOS = 0] = "EOS", f[f.Mono = 1] = "Mono", f[f.Right = 2] = "Right", f[f.Left = 4] = "Left", f[f.Linked = 8] = "Linked", f[f.RomMono = 32769] = "RomMono", f[f.RomRight = 32770] = "RomRight", f[f.RomLeft = 32772] = "RomLeft", f[f.RomLinked = 32776] = "RomLinked";
          }(l || (l = {}));
        }
      ), "./src/types/zone.ts": (
        /*!***************************!*\
          !*** ./src/types/zone.ts ***!
          \***************************/
        /*! no static exports found */
        function(a, o) {
        }
      ), "./src/utils/buffer.ts": (
        /*!*****************************!*\
          !*** ./src/utils/buffer.ts ***!
          \*****************************/
        /*! exports provided: getStringFromBuffer */
        function(a, o, u) {
          u.r(o), u.d(o, "getStringFromBuffer", function() {
            return l;
          });
          var l = function(f) {
            return new TextDecoder("utf8").decode(f).split(/\0/)[0].trim();
          };
        }
      ), "./src/utils/index.ts": (
        /*!****************************!*\
          !*** ./src/utils/index.ts ***!
          \****************************/
        /*! exports provided: getStringFromBuffer, memoize */
        function(a, o, u) {
          u.r(o);
          var l = u(
            /*! ./buffer */
            "./src/utils/buffer.ts"
          );
          u.d(o, "getStringFromBuffer", function() {
            return l.getStringFromBuffer;
          });
          var f = u(
            /*! ./memoize */
            "./src/utils/memoize.ts"
          );
          u.d(o, "memoize", function() {
            return f.memoize;
          });
        }
      ), "./src/utils/memoize.ts": (
        /*!******************************!*\
          !*** ./src/utils/memoize.ts ***!
          \******************************/
        /*! exports provided: memoize */
        function(a, o, u) {
          u.r(o), u.d(o, "memoize", function() {
            return l;
          });
          var l = function(f) {
            var p = {};
            return function() {
              for (var g = arguments.length, d = new Array(g), b = 0; b < g; b++) d[b] = arguments[b];
              var F = JSON.stringify(d);
              if (F in p) return p[F];
              var E = f.apply(void 0, d);
              return p[F] = E, E;
            };
          };
        }
      ) });
    });
  }(SoundFont2)), SoundFont2.exports;
}
var SoundFont2Exports = requireSoundFont2();
const m$1 = (e) => Math.pow(2, e / 1200), Q = (e) => e / 1e3, G = (e, t) => {
  const a = Math.pow(10, t);
  return Math.round(e * a) / a;
};
typeof AudioParam < "u" && (AudioParam.prototype.dahdsr = function(e, t, a, o, u, l, f, p, g) {
  u = Math.max(G(u, 4), 1e-3), f = Math.max(G(f, 4), 1e-3), g = G(g, 4), t = Math.max(t, 1e-3);
  let d = e;
  return this.setValueAtTime(t, d), this.setValueAtTime(t, d += o), this.exponentialRampToValueAtTime(a, d += u), this.setValueAtTime(a, d += l), this.exponentialRampToValueAtTime(Math.max(p * a, 1e-3), d += f), (b, F) => {
    this.cancelAndHoldAtTime(b);
    const E = Math.max(F ?? t, 1e-3);
    this.exponentialRampToValueAtTime(E, b + g);
  };
});
const T = {
  0: "startAddrOffset",
  1: "endAddrOffset",
  2: "startloopAddrsOffset",
  3: "endloopAddrsOffset",
  4: "startAddrsCoarseOffset",
  5: "modLfoToPitch",
  6: "vibLfoToPitch",
  7: "modEnvToPitch",
  8: "initialFilterFc",
  9: "initialFilterQ",
  10: "modLfoToFilterFc",
  11: "modEnvToFilterFc",
  12: "endAddrsCoarseOffset",
  13: "modLfoToVolume",
  14: "unused1",
  15: "chorusEffectsSend",
  16: "reverbEffectsSend",
  17: "pan",
  18: "unused2",
  19: "unused3",
  20: "unused4",
  21: "delayModLFO",
  22: "freqModLFO",
  23: "delayVibLFO",
  24: "freqVibLFO",
  25: "delayModEnv",
  26: "attackModEnv",
  27: "holdModEnv",
  28: "decayModEnv",
  29: "sustainModEnv",
  30: "releaseModEnv",
  31: "keyNumToModEnvHold",
  32: "keyNumToModEnvDecay",
  33: "delayVolEnv",
  34: "attackVolEnv",
  35: "holdVolEnv",
  36: "decayVolEnv",
  37: "sustainVolEnv",
  38: "releaseVolEnv",
  39: "keyNumToVolEnvHold",
  40: "keyNumToVolEnvDecay",
  41: "instrument",
  42: "reserved1",
  43: "keyRange",
  44: "velRange",
  45: "startloopAddrsCoarseOffset",
  46: "keyNum",
  47: "velocity",
  48: "initialAttenuation",
  49: "reserved2",
  50: "endloopAddrsCoarseOffset",
  51: "coarseTune",
  52: "fineTune",
  53: "sampleID",
  54: "sampleModes",
  55: "reserved3",
  56: "scaleTuning",
  57: "exclusiveClass",
  58: "overridingRootKey",
  59: "unused5",
  60: "endOper"
};
Object.fromEntries(
  Object.entries(SoundFont2Exports.DEFAULT_GENERATOR_VALUES).map(([e, t]) => [T[e], t])
);
const D = (e, t, a, o, u) => {
  var l, f, p, g, d, b, F;
  const E = SoundFont2Exports.DEFAULT_GENERATOR_VALUES[e];
  if (typeof E != "number")
    throw new Error(`no default value found for generator with index ${e}`);
  const S = t.generators[e], R = (f = (l = a.globalZone) == null ? void 0 : l.generators) == null ? void 0 : f[e], k = (p = o?.generators) == null ? void 0 : p[e], I = (d = (g = u.globalZone) == null ? void 0 : g.generators) == null ? void 0 : d[e], V = S && "value" in S ? S.value : void 0, U = R && "value" in R ? R.value : void 0, q = k && "value" in k ? k.value : void 0, H = I && "value" in I ? I.value : void 0, z = (b = V ?? U) != null ? b : E, j = (F = q ?? H) != null ? F : 0;
  return z + j;
}, J = (e) => SoundFont2Exports.DEFAULT_GENERATOR_VALUES[e] !== void 0, W = (e, t, a) => {
  var o, u, l, f;
  return Object.fromEntries(
    Array.from(
      new Set(
        [
          Object.keys((u = (o = a.globalZone) == null ? void 0 : o.generators) != null ? u : {}),
          Object.keys(t.generators),
          Object.keys((f = (l = t.instrument.globalZone) == null ? void 0 : l.generators) != null ? f : {}),
          Object.keys(e.generators)
        ].flat()
      )
    ).filter(J).map((p) => [T[p], D(parseInt(p), e, t.instrument, t, a)])
  );
};
async function ae(e) {
  const t = await fetch(e).then((o) => o.arrayBuffer()), a = new Uint8Array(t);
  return new SoundFont2Exports.SoundFont2(a);
}
function X(e, t, a) {
  let { time: o = e.currentTime } = a;
  const {
    midi: u,
    start: l,
    velocity: f = 0.3,
    startLoop: p,
    endLoop: g,
    sampleRate: d,
    originalPitch: b,
    pitchCorrection: F,
    type: E,
    sampleModes: S = 0,
    overridingRootKey: R,
    fineTune: k = 0,
    startloopAddrsOffset: I = 0,
    startloopAddrsCoarseOffset: V = 0,
    endloopAddrsOffset: U = 0,
    endloopAddrsCoarseOffset: q = 0,
    delayVolEnv: H = -12e3,
    attackVolEnv: z = -12e3,
    holdVolEnv: j = -12e3,
    decayVolEnv: ee = -12e3,
    sustainVolEnv: te = 0,
    releaseVolEnv: de = -12e3,
    pan: ie = 0,
    ...he
  } = a, fe = 100 * (R !== void 0 && R !== -1 ? R : b) + F - k, le = u * 100 - fe, _e = 1 * Math.pow(2, le / 1200);
  t.playbackRate.value = _e;
  const Me = p + I + V * 32768, be = g + U + q * 32768;
  be > Me && S === 1 ? (t.loopStart = Me / d, t.loopEnd = be / d, t.loop = !0) : S === 3 && console.warn("unimplemented sampleMode 3 (play till end on note off)"), Object.keys(he).filter(
    (Xe) => !["name", "instrument", "keyRange", "sampleID", "end"].includes(Xe)
  ).length;
  const ve = e.createGain(), ge = [
    o,
    0,
    f,
    m$1(H),
    m$1(z),
    m$1(j),
    m$1(ee),
    te >= 960 ? 0 : 1 - Q(te),
    m$1(de)
  ], Ie = ve.gain.dahdsr(...ge), $e = e.createStereoPanner();
  return $e.pan.value = ie / 1e3, ve.connect($e), t.connect(ve), $e.connect(e.destination), t.start(o), (Xe = e.currentTime) => {
    t.stop(Xe + m$1(de)), Ie(Xe);
  };
}
function Y(e, t, a = {}) {
  const { header: o, data: u } = t, l = new Float32Array(u.length);
  for (let g = 0; g < u.length; g++)
    l[g] = u[g] / 32768;
  const f = e.createBuffer(1, l.length, o.sampleRate);
  f.getChannelData(0).set(l);
  const p = e.createBufferSource();
  return p.buffer = f, a = { ...o, ...a }, X(e, p, a);
}
const C = (e, t) => !e.keyRange || e.keyRange.lo <= t && t <= e.keyRange.hi, x = (e, t) => e.zones.filter((a) => C(a, t) && a.instrument).map((a) => a.instrument.zones.filter((o) => C(o, t)).map((o) => {
  const u = W(o, a, e);
  return {
    ...o,
    mergedGenerators: u
  };
})).flat(), ce = (e, t, a, o = e.currentTime) => {
  const u = x(t, a).map(
    (l) => Y(e, l.sample, {
      ...l.mergedGenerators,
      midi: a,
      time: o
    })
  );
  return (l = e.currentTime) => {
    u.forEach((f) => f(l));
  };
};
Pattern$1.prototype.soundfont = function(e, t = 0) {
  return this.onTrigger((a, o, u, l) => {
    const f = getAudioContext(), p = getPlayableNoteValue(a), g = e.presets[t % e.presets.length], d = l, b = [f, g, noteToMidi$1(p), d];
    ce(...b)(d + a.duration);
  });
};
const soundfontCache = /* @__PURE__ */ new Map();
function loadSoundfont(e) {
  if (soundfontCache.get(e))
    return soundfontCache.get(e);
  const t = ae(e);
  return soundfontCache.set(e, t), t;
}
function peg$subclass(e, t) {
  function a() {
    this.constructor = e;
  }
  a.prototype = t.prototype, e.prototype = new a();
}
function peg$SyntaxError(e, t, a, o) {
  var u = Error.call(this, e);
  return Object.setPrototypeOf && Object.setPrototypeOf(u, peg$SyntaxError.prototype), u.expected = t, u.found = a, u.location = o, u.name = "SyntaxError", u;
}
peg$subclass(peg$SyntaxError, Error);
function peg$padEnd(e, t, a) {
  return a = a || " ", e.length > t ? e : (t -= e.length, a += a.repeat(t), e + a.slice(0, t));
}
peg$SyntaxError.prototype.format = function(e) {
  var t = "Error: " + this.message;
  if (this.location) {
    var a = null, o;
    for (o = 0; o < e.length; o++)
      if (e[o].source === this.location.source) {
        a = e[o].text.split(/\r\n|\n|\r/g);
        break;
      }
    var u = this.location.start, l = this.location.source && typeof this.location.source.offset == "function" ? this.location.source.offset(u) : u, f = this.location.source + ":" + l.line + ":" + l.column;
    if (a) {
      var p = this.location.end, g = peg$padEnd("", l.line.toString().length, " "), d = a[u.line - 1], b = u.line === p.line ? p.column : d.length + 1, F = b - u.column || 1;
      t += `
 --> ` + f + `
` + g + ` |
` + l.line + " | " + d + `
` + g + " | " + peg$padEnd("", u.column - 1, " ") + peg$padEnd("", F, "^");
    } else
      t += `
 at ` + f;
  }
  return t;
};
peg$SyntaxError.buildMessage = function(e, t) {
  var a = {
    literal: function(d) {
      return '"' + u(d.text) + '"';
    },
    class: function(d) {
      var b = d.parts.map(function(F) {
        return Array.isArray(F) ? l(F[0]) + "-" + l(F[1]) : l(F);
      });
      return "[" + (d.inverted ? "^" : "") + b.join("") + "]";
    },
    any: function() {
      return "any character";
    },
    end: function() {
      return "end of input";
    },
    other: function(d) {
      return d.description;
    }
  };
  function o(d) {
    return d.charCodeAt(0).toString(16).toUpperCase();
  }
  function u(d) {
    return d.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(b) {
      return "\\x0" + o(b);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(b) {
      return "\\x" + o(b);
    });
  }
  function l(d) {
    return d.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(b) {
      return "\\x0" + o(b);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(b) {
      return "\\x" + o(b);
    });
  }
  function f(d) {
    return a[d.type](d);
  }
  function p(d) {
    var b = d.map(f), F, E;
    if (b.sort(), b.length > 0) {
      for (F = 1, E = 1; F < b.length; F++)
        b[F - 1] !== b[F] && (b[E] = b[F], E++);
      b.length = E;
    }
    switch (b.length) {
      case 1:
        return b[0];
      case 2:
        return b[0] + " or " + b[1];
      default:
        return b.slice(0, -1).join(", ") + ", or " + b[b.length - 1];
    }
  }
  function g(d) {
    return d ? '"' + u(d) + '"' : "end of input";
  }
  return "Expected " + p(e) + " but " + g(t) + " found.";
};
function peg$parse(e, t) {
  t = t !== void 0 ? t : {};
  var a = {}, o = t.grammarSource, u = { start: sn }, l = sn, f = ".", p = "-", g = "0", d = ",", b = "|", F = "[", E = "]", S = "{", R = "}", k = "%", I = "<", V = ">", U = "!", q = "(", H = ")", z = "/", j = "*", ee = "?", te = ":", de = "..", ie = "^", he = "struct", fe = "target", le = "euclid", _e = "slow", Me = "rotL", be = "rotR", ve = "fast", ge = "scale", Ie = "//", $e = "cat", Xe = "$", ue = "setcps", Ee = "setbpm", qe = "hush", Te = /^[1-9]/, xe = /^[eE]/, Ve = /^[+\-]/, we = /^[0-9]/, We = /^[ \n\r\t\xA0]/, Qe = /^["']/, nt = /^[#\--.0-9A-Z\^-_a-z~\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376-\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E-\u066F\u0671-\u06D3\u06D5\u06E5-\u06E6\u06EE-\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4-\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F-\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC-\u09DD\u09DF-\u09E1\u09F0-\u09F1\u09FC\u0A05-\u0A0A\u0A0F-\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32-\u0A33\u0A35-\u0A36\u0A38-\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2-\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0-\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F-\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32-\u0B33\u0B35-\u0B39\u0B3D\u0B5C-\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99-\u0B9A\u0B9C\u0B9E-\u0B9F\u0BA3-\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60-\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0-\u0CE1\u0CF1-\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32-\u0E33\u0E40-\u0E46\u0E81-\u0E82\u0E84\u0E87-\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA-\u0EAB\u0EAD-\u0EB0\u0EB2-\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065-\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE-\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5-\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEF\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A-\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7B9\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD-\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5-\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40-\uFB41\uFB43-\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/, ze = /^[@_]/, At = /^[^\n]/, Ue = Ht("number"), rt = Be(".", !1), at = Mt([["1", "9"]], !1, !1), ot = Mt(["e", "E"], !1, !1), ft = Mt(["+", "-"], !1, !1), ht = Be("-", !1), _t = Be("0", !1), St = Mt([["0", "9"]], !1, !1), mt = Ht("whitespace"), st = Mt([" ", `
`, "\r", "	", " "], !1, !1), Pt = Be(",", !1), ke = Be("|", !1), Je = Mt(['"', "'"], !1, !1), Se = Ht('a letter, a number, "-", "#", ".", "^", "_"'), Ke = Mt(["#", ["-", "."], ["0", "9"], ["A", "Z"], ["^", "_"], ["a", "z"], "~", "ª", "µ", "º", ["À", "Ö"], ["Ø", "ö"], ["ø", "ˁ"], ["ˆ", "ˑ"], ["ˠ", "ˤ"], "ˬ", "ˮ", ["Ͱ", "ʹ"], ["Ͷ", "ͷ"], ["ͺ", "ͽ"], "Ϳ", "Ά", ["Έ", "Ί"], "Ό", ["Ύ", "Ρ"], ["Σ", "ϵ"], ["Ϸ", "ҁ"], ["Ҋ", "ԯ"], ["Ա", "Ֆ"], "ՙ", ["ՠ", "ֈ"], ["א", "ת"], ["ׯ", "ײ"], ["ؠ", "ي"], ["ٮ", "ٯ"], ["ٱ", "ۓ"], "ە", ["ۥ", "ۦ"], ["ۮ", "ۯ"], ["ۺ", "ۼ"], "ۿ", "ܐ", ["ܒ", "ܯ"], ["ݍ", "ޥ"], "ޱ", ["ߊ", "ߪ"], ["ߴ", "ߵ"], "ߺ", ["ࠀ", "ࠕ"], "ࠚ", "ࠤ", "ࠨ", ["ࡀ", "ࡘ"], ["ࡠ", "ࡪ"], ["ࢠ", "ࢴ"], ["ࢶ", "ࢽ"], ["ऄ", "ह"], "ऽ", "ॐ", ["क़", "ॡ"], ["ॱ", "ঀ"], ["অ", "ঌ"], ["এ", "ঐ"], ["ও", "ন"], ["প", "র"], "ল", ["শ", "হ"], "ঽ", "ৎ", ["ড়", "ঢ়"], ["য়", "ৡ"], ["ৰ", "ৱ"], "ৼ", ["ਅ", "ਊ"], ["ਏ", "ਐ"], ["ਓ", "ਨ"], ["ਪ", "ਰ"], ["ਲ", "ਲ਼"], ["ਵ", "ਸ਼"], ["ਸ", "ਹ"], ["ਖ਼", "ੜ"], "ਫ਼", ["ੲ", "ੴ"], ["અ", "ઍ"], ["એ", "ઑ"], ["ઓ", "ન"], ["પ", "ર"], ["લ", "ળ"], ["વ", "હ"], "ઽ", "ૐ", ["ૠ", "ૡ"], "ૹ", ["ଅ", "ଌ"], ["ଏ", "ଐ"], ["ଓ", "ନ"], ["ପ", "ର"], ["ଲ", "ଳ"], ["ଵ", "ହ"], "ଽ", ["ଡ଼", "ଢ଼"], ["ୟ", "ୡ"], "ୱ", "ஃ", ["அ", "ஊ"], ["எ", "ஐ"], ["ஒ", "க"], ["ங", "ச"], "ஜ", ["ஞ", "ட"], ["ண", "த"], ["ந", "ப"], ["ம", "ஹ"], "ௐ", ["అ", "ఌ"], ["ఎ", "ఐ"], ["ఒ", "న"], ["ప", "హ"], "ఽ", ["ౘ", "ౚ"], ["ౠ", "ౡ"], "ಀ", ["ಅ", "ಌ"], ["ಎ", "ಐ"], ["ಒ", "ನ"], ["ಪ", "ಳ"], ["ವ", "ಹ"], "ಽ", "ೞ", ["ೠ", "ೡ"], ["ೱ", "ೲ"], ["അ", "ഌ"], ["എ", "ഐ"], ["ഒ", "ഺ"], "ഽ", "ൎ", ["ൔ", "ൖ"], ["ൟ", "ൡ"], ["ൺ", "ൿ"], ["අ", "ඖ"], ["ක", "න"], ["ඳ", "ර"], "ල", ["ව", "ෆ"], ["ก", "ะ"], ["า", "ำ"], ["เ", "ๆ"], ["ກ", "ຂ"], "ຄ", ["ງ", "ຈ"], "ຊ", "ຍ", ["ດ", "ທ"], ["ນ", "ຟ"], ["ມ", "ຣ"], "ລ", "ວ", ["ສ", "ຫ"], ["ອ", "ະ"], ["າ", "ຳ"], "ຽ", ["ເ", "ໄ"], "ໆ", ["ໜ", "ໟ"], "ༀ", ["ཀ", "ཇ"], ["ཉ", "ཬ"], ["ྈ", "ྌ"], ["က", "ဪ"], "ဿ", ["ၐ", "ၕ"], ["ၚ", "ၝ"], "ၡ", ["ၥ", "ၦ"], ["ၮ", "ၰ"], ["ၵ", "ႁ"], "ႎ", ["Ⴀ", "Ⴥ"], "Ⴧ", "Ⴭ", ["ა", "ჺ"], ["ჼ", "ቈ"], ["ቊ", "ቍ"], ["ቐ", "ቖ"], "ቘ", ["ቚ", "ቝ"], ["በ", "ኈ"], ["ኊ", "ኍ"], ["ነ", "ኰ"], ["ኲ", "ኵ"], ["ኸ", "ኾ"], "ዀ", ["ዂ", "ዅ"], ["ወ", "ዖ"], ["ዘ", "ጐ"], ["ጒ", "ጕ"], ["ጘ", "ፚ"], ["ᎀ", "ᎏ"], ["Ꭰ", "Ᏽ"], ["ᏸ", "ᏽ"], ["ᐁ", "ᙬ"], ["ᙯ", "ᙿ"], ["ᚁ", "ᚚ"], ["ᚠ", "ᛪ"], ["ᛮ", "ᛸ"], ["ᜀ", "ᜌ"], ["ᜎ", "ᜑ"], ["ᜠ", "ᜱ"], ["ᝀ", "ᝑ"], ["ᝠ", "ᝬ"], ["ᝮ", "ᝰ"], ["ក", "ឳ"], "ៗ", "ៜ", ["ᠠ", "ᡸ"], ["ᢀ", "ᢄ"], ["ᢇ", "ᢨ"], "ᢪ", ["ᢰ", "ᣵ"], ["ᤀ", "ᤞ"], ["ᥐ", "ᥭ"], ["ᥰ", "ᥴ"], ["ᦀ", "ᦫ"], ["ᦰ", "ᧉ"], ["ᨀ", "ᨖ"], ["ᨠ", "ᩔ"], "ᪧ", ["ᬅ", "ᬳ"], ["ᭅ", "ᭋ"], ["ᮃ", "ᮠ"], ["ᮮ", "ᮯ"], ["ᮺ", "ᯥ"], ["ᰀ", "ᰣ"], ["ᱍ", "ᱏ"], ["ᱚ", "ᱽ"], ["ᲀ", "ᲈ"], ["Ა", "Ჺ"], ["Ჽ", "Ჿ"], ["ᳩ", "ᳬ"], ["ᳮ", "ᳱ"], ["ᳵ", "ᳶ"], ["ᴀ", "ᶿ"], ["Ḁ", "ἕ"], ["Ἐ", "Ἕ"], ["ἠ", "ὅ"], ["Ὀ", "Ὅ"], ["ὐ", "ὗ"], "Ὑ", "Ὓ", "Ὕ", ["Ὗ", "ώ"], ["ᾀ", "ᾴ"], ["ᾶ", "ᾼ"], "ι", ["ῂ", "ῄ"], ["ῆ", "ῌ"], ["ῐ", "ΐ"], ["ῖ", "Ί"], ["ῠ", "Ῥ"], ["ῲ", "ῴ"], ["ῶ", "ῼ"], "ⁱ", "ⁿ", ["ₐ", "ₜ"], "ℂ", "ℇ", ["ℊ", "ℓ"], "ℕ", ["ℙ", "ℝ"], "ℤ", "Ω", "ℨ", ["K", "ℭ"], ["ℯ", "ℹ"], ["ℼ", "ℿ"], ["ⅅ", "ⅉ"], "ⅎ", ["Ⅰ", "ↈ"], ["Ⰰ", "Ⱞ"], ["ⰰ", "ⱞ"], ["Ⱡ", "ⳤ"], ["Ⳬ", "ⳮ"], ["Ⳳ", "ⳳ"], ["ⴀ", "ⴥ"], "ⴧ", "ⴭ", ["ⴰ", "ⵧ"], "ⵯ", ["ⶀ", "ⶖ"], ["ⶠ", "ⶦ"], ["ⶨ", "ⶮ"], ["ⶰ", "ⶶ"], ["ⶸ", "ⶾ"], ["ⷀ", "ⷆ"], ["ⷈ", "ⷎ"], ["ⷐ", "ⷖ"], ["ⷘ", "ⷞ"], "ⸯ", ["々", "〇"], ["〡", "〩"], ["〱", "〵"], ["〸", "〼"], ["ぁ", "ゖ"], ["ゝ", "ゟ"], ["ァ", "ヺ"], ["ー", "ヿ"], ["ㄅ", "ㄯ"], ["ㄱ", "ㆎ"], ["ㆠ", "ㆺ"], ["ㇰ", "ㇿ"], ["㐀", "䶵"], ["一", "鿯"], ["ꀀ", "ꒌ"], ["ꓐ", "ꓽ"], ["ꔀ", "ꘌ"], ["ꘐ", "ꘟ"], ["ꘪ", "ꘫ"], ["Ꙁ", "ꙮ"], ["ꙿ", "ꚝ"], ["ꚠ", "ꛯ"], ["ꜗ", "ꜟ"], ["Ꜣ", "ꞈ"], ["Ꞌ", "ꞹ"], ["ꟷ", "ꠁ"], ["ꠃ", "ꠅ"], ["ꠇ", "ꠊ"], ["ꠌ", "ꠢ"], ["ꡀ", "ꡳ"], ["ꢂ", "ꢳ"], ["ꣲ", "ꣷ"], "ꣻ", ["ꣽ", "ꣾ"], ["ꤊ", "ꤥ"], ["ꤰ", "ꥆ"], ["ꥠ", "ꥼ"], ["ꦄ", "ꦲ"], "ꧏ", ["ꧠ", "ꧤ"], ["ꧦ", "ꧯ"], ["ꧺ", "ꧾ"], ["ꨀ", "ꨨ"], ["ꩀ", "ꩂ"], ["ꩄ", "ꩋ"], ["ꩠ", "ꩶ"], "ꩺ", ["ꩾ", "ꪯ"], "ꪱ", ["ꪵ", "ꪶ"], ["ꪹ", "ꪽ"], "ꫀ", "ꫂ", ["ꫛ", "ꫝ"], ["ꫠ", "ꫪ"], ["ꫲ", "ꫴ"], ["ꬁ", "ꬆ"], ["ꬉ", "ꬎ"], ["ꬑ", "ꬖ"], ["ꬠ", "ꬦ"], ["ꬨ", "ꬮ"], ["ꬰ", "ꭚ"], ["ꭜ", "ꭥ"], ["ꭰ", "ꯢ"], ["가", "힣"], ["ힰ", "ퟆ"], ["ퟋ", "ퟻ"], ["豈", "舘"], ["並", "龎"], ["ﬀ", "ﬆ"], ["ﬓ", "ﬗ"], "יִ", ["ײַ", "ﬨ"], ["שׁ", "זּ"], ["טּ", "לּ"], "מּ", ["נּ", "סּ"], ["ףּ", "פּ"], ["צּ", "ﮱ"], ["ﯓ", "ﴽ"], ["ﵐ", "ﶏ"], ["ﶒ", "ﷇ"], ["ﷰ", "ﷻ"], ["ﹰ", "ﹴ"], ["ﹶ", "ﻼ"], ["Ａ", "Ｚ"], ["ａ", "ｚ"], ["ｦ", "ﾾ"], ["ￂ", "ￇ"], ["ￊ", "ￏ"], ["ￒ", "ￗ"], ["ￚ", "ￜ"]], !1, !1), Ne = Be("[", !1), yt = Be("]", !1), xt = Be("{", !1), et = Be("}", !1), pt = Be("%", !1), tt = Be("<", !1), Ge = Be(">", !1), Ft = Mt(["@", "_"], !1, !1), Ct = Be("!", !1), Fe = Be("(", !1), Re = Be(")", !1), Ze = Be("/", !1), Ye = Be("*", !1), Dt = Be("?", !1), Jt = Be(":", !1), Kt = Be("..", !1), M = Be("^", !1), B = Be("struct", !1), L = Be("target", !1), N = Be("euclid", !1), $ = Be("slow", !1), se = Be("rotL", !1), oe = Be("rotR", !1), pe = Be("fast", !1), me = Be("scale", !1), Le = Be("//", !1), He = Mt([`
`], !0, !1), bt = Be("cat", !1), Gt = Be("$", !1), $t = Be("setcps", !1), Xt = Be("setbpm", !1), it = Be("hush", !1), pn = function() {
    return parseFloat(jn());
  }, dn = function(A) {
    const Z = A.join("");
    return Z === "." || Z === "_";
  }, hn = function(A) {
    return new Xs(A.join(""));
  }, _n = function(A) {
    return A;
  }, mn = function(A, Z) {
    return A.arguments_.stepsPerCycle = Z, A;
  }, gn = function(A) {
    return A;
  }, yn = function(A) {
    return A.arguments_.alignment = "polymeter_slowcat", A;
  }, Cn = function(A) {
    return (Z) => Z.options_.weight = (Z.options_.weight ?? 1) + (A ?? 2) - 1;
  }, bn = function(A) {
    return (Z) => {
      const K = (Z.options_.reps ?? 1) + (A ?? 2) - 1;
      Z.options_.reps = K, Z.options_.ops = Z.options_.ops.filter((re) => re.type_ !== "replicate"), Z.options_.ops.push({ type_: "replicate", arguments_: { amount: K } }), Z.options_.weight = K;
    };
  }, Mn = function(A, Z, K) {
    return (re) => re.options_.ops.push({ type_: "bjorklund", arguments_: { pulse: A, step: Z, rotation: K } });
  }, vn = function(A) {
    return (Z) => Z.options_.ops.push({ type_: "stretch", arguments_: { amount: A, type: "slow" } });
  }, An = function(A) {
    return (Z) => Z.options_.ops.push({ type_: "stretch", arguments_: { amount: A, type: "fast" } });
  }, Sn = function(A) {
    return (Z) => Z.options_.ops.push({ type_: "degradeBy", arguments_: { amount: A, seed: Qt++ } });
  }, Pn = function(A) {
    return (Z) => Z.options_.ops.push({ type_: "tail", arguments_: { element: A } });
  }, Fn = function(A) {
    return (Z) => Z.options_.ops.push({ type_: "range", arguments_: { element: A } });
  }, Gn = function(A, Z) {
    const K = new zs(A, { ops: [], weight: 1, reps: 1 });
    for (const re of Z)
      re(K);
    return K;
  }, En = function(A, Z) {
    return new Ut(Z, "fastcat", void 0, !!A);
  }, Dn = function(A) {
    return { alignment: "stack", list: A };
  }, xn = function(A) {
    return { alignment: "rand", list: A, seed: Qt++ };
  }, wn = function(A) {
    return { alignment: "feet", list: A, seed: Qt++ };
  }, kn = function(A, Z) {
    return Z && Z.list.length > 0 ? new Ut([A, ...Z.list], Z.alignment, Z.seed) : A;
  }, Rn = function(A, Z) {
    return new Ut(Z ? [A, ...Z.list] : [A], "polymeter");
  }, Ln = function(A) {
    return A;
  }, Bn = function(A) {
    return { name: "struct", args: { mini: A } };
  }, Tn = function(A) {
    return { name: "target", args: { name: A } };
  }, Nn = function(A, Z, K) {
    return { name: "bjorklund", args: { pulse: A, step: parseInt(Z) } };
  }, In = function(A) {
    return { name: "stretch", args: { amount: A } };
  }, Zn = function(A) {
    return { name: "shift", args: { amount: "-" + A } };
  }, Vn = function(A) {
    return { name: "shift", args: { amount: A } };
  }, $n = function(A) {
    return { name: "stretch", args: { amount: "1/" + A } };
  }, Xn = function(A) {
    return { name: "scale", args: { scale: A.join("") } };
  }, en = function(A, Z) {
    return Z;
  }, Wn = function(A, Z) {
    return Z.unshift(A), new Ut(Z, "slowcat");
  }, zn = function(A) {
    return A;
  }, On = function(A, Z) {
    return new Ws(A.name, A.args, Z);
  }, Un = function(A) {
    return A;
  }, Jn = function(A) {
    return A;
  }, Kn = function(A) {
    return new qt("setcps", { value: A });
  }, Hn = function(A) {
    return new qt("setcps", { value: A / 120 / 2 });
  }, Yn = function() {
    return new qt("hush");
  }, O = t.peg$currPos | 0, De = O, kt = [{ line: 1, column: 1 }], ut = O, Wt = t.peg$maxFailExpected || [], ye = t.peg$silentFails | 0, Zt;
  if (t.startRule) {
    if (!(t.startRule in u))
      throw new Error(`Can't start parsing from rule "` + t.startRule + '".');
    l = u[t.startRule];
  }
  function jn() {
    return e.substring(De, O);
  }
  function tn() {
    return Yt(De, O);
  }
  function Be(A, Z) {
    return { type: "literal", text: A, ignoreCase: Z };
  }
  function Mt(A, Z, K) {
    return { type: "class", parts: A, inverted: Z, ignoreCase: K };
  }
  function qn() {
    return { type: "end" };
  }
  function Ht(A) {
    return { type: "other", description: A };
  }
  function nn(A) {
    var Z = kt[A], K;
    if (Z)
      return Z;
    if (A >= kt.length)
      K = kt.length - 1;
    else
      for (K = A; !kt[--K]; )
        ;
    for (Z = kt[K], Z = {
      line: Z.line,
      column: Z.column
    }; K < A; )
      e.charCodeAt(K) === 10 ? (Z.line++, Z.column = 1) : Z.column++, K++;
    return kt[A] = Z, Z;
  }
  function Yt(A, Z, K) {
    var re = nn(A), Ce = nn(Z), Oe = {
      source: o,
      start: {
        offset: A,
        line: re.line,
        column: re.column
      },
      end: {
        offset: Z,
        line: Ce.line,
        column: Ce.column
      }
    };
    return Oe;
  }
  function Ae(A) {
    O < ut || (O > ut && (ut = O, Wt = []), Wt.push(A));
  }
  function Qn(A, Z, K) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(A, Z),
      A,
      Z,
      K
    );
  }
  function sn() {
    var A;
    return A = $s(), A;
  }
  function vt() {
    var A, Z;
    return ye++, A = O, rs(), Z = zt(), Z !== a ? (is(), ss(), De = A, A = pn()) : (O = A, A = a), ye--, A === a && ye === 0 && Ae(Ue), A;
  }
  function es() {
    var A;
    return e.charCodeAt(O) === 46 ? (A = f, O++) : (A = a, ye === 0 && Ae(rt)), A;
  }
  function ts() {
    var A;
    return A = e.charAt(O), Te.test(A) ? O++ : (A = a, ye === 0 && Ae(at)), A;
  }
  function ns() {
    var A;
    return A = e.charAt(O), xe.test(A) ? O++ : (A = a, ye === 0 && Ae(ot)), A;
  }
  function ss() {
    var A, Z, K, re, Ce;
    if (A = O, Z = ns(), Z !== a) {
      if (K = e.charAt(O), Ve.test(K) ? O++ : (K = a, ye === 0 && Ae(ft)), K === a && (K = null), re = [], Ce = Rt(), Ce !== a)
        for (; Ce !== a; )
          re.push(Ce), Ce = Rt();
      else
        re = a;
      re !== a ? (Z = [Z, K, re], A = Z) : (O = A, A = a);
    } else
      O = A, A = a;
    return A;
  }
  function is() {
    var A, Z, K, re;
    if (A = O, Z = es(), Z !== a) {
      if (K = [], re = Rt(), re !== a)
        for (; re !== a; )
          K.push(re), re = Rt();
      else
        K = a;
      K !== a ? (Z = [Z, K], A = Z) : (O = A, A = a);
    } else
      O = A, A = a;
    return A;
  }
  function zt() {
    var A, Z, K, re;
    if (A = os(), A === a)
      if (A = O, Z = ts(), Z !== a) {
        for (K = [], re = Rt(); re !== a; )
          K.push(re), re = Rt();
        Z = [Z, K], A = Z;
      } else
        O = A, A = a;
    return A;
  }
  function rs() {
    var A;
    return e.charCodeAt(O) === 45 ? (A = p, O++) : (A = a, ye === 0 && Ae(ht)), A;
  }
  function os() {
    var A;
    return e.charCodeAt(O) === 48 ? (A = g, O++) : (A = a, ye === 0 && Ae(_t)), A;
  }
  function Rt() {
    var A;
    return A = e.charAt(O), we.test(A) ? O++ : (A = a, ye === 0 && Ae(St)), A;
  }
  function Pe() {
    var A, Z;
    for (ye++, A = [], Z = e.charAt(O), We.test(Z) ? O++ : (Z = a, ye === 0 && Ae(st)); Z !== a; )
      A.push(Z), Z = e.charAt(O), We.test(Z) ? O++ : (Z = a, ye === 0 && Ae(st));
    return ye--, Z = a, ye === 0 && Ae(mt), A;
  }
  function Lt() {
    var A, Z, K, re;
    return A = O, Z = Pe(), e.charCodeAt(O) === 44 ? (K = d, O++) : (K = a, ye === 0 && Ae(Pt)), K !== a ? (re = Pe(), Z = [Z, K, re], A = Z) : (O = A, A = a), A;
  }
  function rn() {
    var A, Z, K, re;
    return A = O, Z = Pe(), e.charCodeAt(O) === 124 ? (K = b, O++) : (K = a, ye === 0 && Ae(ke)), K !== a ? (re = Pe(), Z = [Z, K, re], A = Z) : (O = A, A = a), A;
  }
  function an() {
    var A, Z, K, re;
    return A = O, Z = Pe(), e.charCodeAt(O) === 46 ? (K = f, O++) : (K = a, ye === 0 && Ae(rt)), K !== a ? (re = Pe(), Z = [Z, K, re], A = Z) : (O = A, A = a), A;
  }
  function Bt() {
    var A;
    return A = e.charAt(O), Qe.test(A) ? O++ : (A = a, ye === 0 && Ae(Je)), A;
  }
  function Ot() {
    var A;
    return ye++, A = e.charAt(O), nt.test(A) ? O++ : (A = a, ye === 0 && Ae(Ke)), ye--, A === a && ye === 0 && Ae(Se), A;
  }
  function on() {
    var A, Z, K, re;
    if (A = O, Pe(), Z = [], K = Ot(), K !== a)
      for (; K !== a; )
        Z.push(K), K = Ot();
    else
      Z = a;
    return Z !== a ? (K = Pe(), De = O, re = dn(Z), re ? re = a : re = void 0, re !== a ? (De = A, A = hn(Z)) : (O = A, A = a)) : (O = A, A = a), A;
  }
  function us() {
    var A, Z, K, re;
    return A = O, Pe(), e.charCodeAt(O) === 91 ? (Z = F, O++) : (Z = a, ye === 0 && Ae(Ne)), Z !== a ? (Pe(), K = cn(), K !== a ? (Pe(), e.charCodeAt(O) === 93 ? (re = E, O++) : (re = a, ye === 0 && Ae(yt)), re !== a ? (Pe(), De = A, A = _n(K)) : (O = A, A = a)) : (O = A, A = a)) : (O = A, A = a), A;
  }
  function ls() {
    var A, Z, K, re, Ce;
    return A = O, Pe(), e.charCodeAt(O) === 123 ? (Z = S, O++) : (Z = a, ye === 0 && Ae(xt)), Z !== a ? (Pe(), K = fn(), K !== a ? (Pe(), e.charCodeAt(O) === 125 ? (re = R, O++) : (re = a, ye === 0 && Ae(et)), re !== a ? (Ce = cs(), Ce === a && (Ce = null), Pe(), De = A, A = mn(K, Ce)) : (O = A, A = a)) : (O = A, A = a)) : (O = A, A = a), A;
  }
  function cs() {
    var A, Z, K;
    return A = O, e.charCodeAt(O) === 37 ? (Z = k, O++) : (Z = a, ye === 0 && Ae(pt)), Z !== a ? (K = Tt(), K !== a ? (De = A, A = gn(K)) : (O = A, A = a)) : (O = A, A = a), A;
  }
  function fs() {
    var A, Z, K, re;
    return A = O, Pe(), e.charCodeAt(O) === 60 ? (Z = I, O++) : (Z = a, ye === 0 && Ae(tt)), Z !== a ? (Pe(), K = fn(), K !== a ? (Pe(), e.charCodeAt(O) === 62 ? (re = V, O++) : (re = a, ye === 0 && Ae(Ge)), re !== a ? (Pe(), De = A, A = yn(K)) : (O = A, A = a)) : (O = A, A = a)) : (O = A, A = a), A;
  }
  function Tt() {
    var A;
    return A = on(), A === a && (A = us(), A === a && (A = ls(), A === a && (A = fs()))), A;
  }
  function un() {
    var A;
    return A = ps(), A === a && (A = _s(), A === a && (A = ms(), A === a && (A = gs(), A === a && (A = hs(), A === a && (A = ys(), A === a && (A = Cs(), A === a && (A = bs()))))))), A;
  }
  function ps() {
    var A, Z, K;
    return A = O, Pe(), Z = e.charAt(O), ze.test(Z) ? O++ : (Z = a, ye === 0 && Ae(Ft)), Z !== a ? (K = vt(), K === a && (K = null), De = A, A = Cn(K)) : (O = A, A = a), A;
  }
  function hs() {
    var A, Z, K;
    return A = O, Pe(), e.charCodeAt(O) === 33 ? (Z = U, O++) : (Z = a, ye === 0 && Ae(Ct)), Z !== a ? (K = vt(), K === a && (K = null), De = A, A = bn(K)) : (O = A, A = a), A;
  }
  function _s() {
    var A, Z, K, re, Ce, Oe, ct;
    return A = O, e.charCodeAt(O) === 40 ? (Z = q, O++) : (Z = a, ye === 0 && Ae(Fe)), Z !== a ? (Pe(), K = Vt(), K !== a ? (Pe(), re = Lt(), re !== a ? (Pe(), Ce = Vt(), Ce !== a ? (Pe(), Lt(), Pe(), Oe = Vt(), Oe === a && (Oe = null), Pe(), e.charCodeAt(O) === 41 ? (ct = H, O++) : (ct = a, ye === 0 && Ae(Re)), ct !== a ? (De = A, A = Mn(K, Ce, Oe)) : (O = A, A = a)) : (O = A, A = a)) : (O = A, A = a)) : (O = A, A = a)) : (O = A, A = a), A;
  }
  function ms() {
    var A, Z, K;
    return A = O, e.charCodeAt(O) === 47 ? (Z = z, O++) : (Z = a, ye === 0 && Ae(Ze)), Z !== a ? (K = Tt(), K !== a ? (De = A, A = vn(K)) : (O = A, A = a)) : (O = A, A = a), A;
  }
  function gs() {
    var A, Z, K;
    return A = O, e.charCodeAt(O) === 42 ? (Z = j, O++) : (Z = a, ye === 0 && Ae(Ye)), Z !== a ? (K = Tt(), K !== a ? (De = A, A = An(K)) : (O = A, A = a)) : (O = A, A = a), A;
  }
  function ys() {
    var A, Z, K;
    return A = O, e.charCodeAt(O) === 63 ? (Z = ee, O++) : (Z = a, ye === 0 && Ae(Dt)), Z !== a ? (K = vt(), K === a && (K = null), De = A, A = Sn(K)) : (O = A, A = a), A;
  }
  function Cs() {
    var A, Z, K;
    return A = O, e.charCodeAt(O) === 58 ? (Z = te, O++) : (Z = a, ye === 0 && Ae(Jt)), Z !== a ? (K = Tt(), K !== a ? (De = A, A = Pn(K)) : (O = A, A = a)) : (O = A, A = a), A;
  }
  function bs() {
    var A, Z, K;
    return A = O, e.substr(O, 2) === de ? (Z = de, O += 2) : (Z = a, ye === 0 && Ae(Kt)), Z !== a ? (K = Tt(), K !== a ? (De = A, A = Fn(K)) : (O = A, A = a)) : (O = A, A = a), A;
  }
  function Vt() {
    var A, Z, K, re;
    if (A = O, Z = Tt(), Z !== a) {
      for (K = [], re = un(); re !== a; )
        K.push(re), re = un();
      De = A, A = Gn(Z, K);
    } else
      O = A, A = a;
    return A;
  }
  function Et() {
    var A, Z, K, re;
    if (A = O, e.charCodeAt(O) === 94 ? (Z = ie, O++) : (Z = a, ye === 0 && Ae(M)), Z === a && (Z = null), K = [], re = Vt(), re !== a)
      for (; re !== a; )
        K.push(re), re = Vt();
    else
      K = a;
    return K !== a ? (De = A, A = En(Z, K)) : (O = A, A = a), A;
  }
  function ln() {
    var A, Z, K, re, Ce;
    if (A = O, Z = [], K = O, re = Lt(), re !== a ? (Ce = Et(), Ce !== a ? K = Ce : (O = K, K = a)) : (O = K, K = a), K !== a)
      for (; K !== a; )
        Z.push(K), K = O, re = Lt(), re !== a ? (Ce = Et(), Ce !== a ? K = Ce : (O = K, K = a)) : (O = K, K = a);
    else
      Z = a;
    return Z !== a && (De = A, Z = Dn(Z)), A = Z, A;
  }
  function Ms() {
    var A, Z, K, re, Ce;
    if (A = O, Z = [], K = O, re = rn(), re !== a ? (Ce = Et(), Ce !== a ? K = Ce : (O = K, K = a)) : (O = K, K = a), K !== a)
      for (; K !== a; )
        Z.push(K), K = O, re = rn(), re !== a ? (Ce = Et(), Ce !== a ? K = Ce : (O = K, K = a)) : (O = K, K = a);
    else
      Z = a;
    return Z !== a && (De = A, Z = xn(Z)), A = Z, A;
  }
  function vs() {
    var A, Z, K, re, Ce;
    if (A = O, Z = [], K = O, re = an(), re !== a ? (Ce = Et(), Ce !== a ? K = Ce : (O = K, K = a)) : (O = K, K = a), K !== a)
      for (; K !== a; )
        Z.push(K), K = O, re = an(), re !== a ? (Ce = Et(), Ce !== a ? K = Ce : (O = K, K = a)) : (O = K, K = a);
    else
      Z = a;
    return Z !== a && (De = A, Z = wn(Z)), A = Z, A;
  }
  function cn() {
    var A, Z, K;
    return A = O, Z = Et(), Z !== a ? (K = ln(), K === a && (K = Ms(), K === a && (K = vs())), K === a && (K = null), De = A, A = kn(Z, K)) : (O = A, A = a), A;
  }
  function fn() {
    var A, Z, K;
    return A = O, Z = Et(), Z !== a ? (K = ln(), K === a && (K = null), De = A, A = Rn(Z, K)) : (O = A, A = a), A;
  }
  function As() {
    var A, Z, K, re;
    return A = O, Pe(), Z = Bt(), Z !== a ? (Pe(), K = cn(), K !== a ? (Pe(), re = Bt(), re !== a ? (De = A, A = Ln(K)) : (O = A, A = a)) : (O = A, A = a)) : (O = A, A = a), A;
  }
  function Ss() {
    var A;
    return A = ks(), A === a && (A = Es(), A === a && (A = ws(), A === a && (A = Fs(), A === a && (A = Gs(), A === a && (A = Ps(), A === a && (A = xs(), A === a && (A = Ds()))))))), A;
  }
  function Ps() {
    var A, Z, K;
    return A = O, e.substr(O, 6) === he ? (Z = he, O += 6) : (Z = a, ye === 0 && Ae(B)), Z !== a ? (Pe(), K = Nt(), K !== a ? (De = A, A = Bn(K)) : (O = A, A = a)) : (O = A, A = a), A;
  }
  function Fs() {
    var A, Z, K, re, Ce;
    return A = O, e.substr(O, 6) === fe ? (Z = fe, O += 6) : (Z = a, ye === 0 && Ae(L)), Z !== a ? (Pe(), K = Bt(), K !== a ? (re = on(), re !== a ? (Ce = Bt(), Ce !== a ? (De = A, A = Tn(re)) : (O = A, A = a)) : (O = A, A = a)) : (O = A, A = a)) : (O = A, A = a), A;
  }
  function Gs() {
    var A, Z, K, re;
    return A = O, e.substr(O, 6) === le ? (Z = le, O += 6) : (Z = a, ye === 0 && Ae(N)), Z !== a ? (Pe(), K = zt(), K !== a ? (Pe(), re = zt(), re !== a ? (Pe(), zt(), De = A, A = Nn(K, re)) : (O = A, A = a)) : (O = A, A = a)) : (O = A, A = a), A;
  }
  function Es() {
    var A, Z, K;
    return A = O, e.substr(O, 4) === _e ? (Z = _e, O += 4) : (Z = a, ye === 0 && Ae($)), Z !== a ? (Pe(), K = vt(), K !== a ? (De = A, A = In(K)) : (O = A, A = a)) : (O = A, A = a), A;
  }
  function Ds() {
    var A, Z, K;
    return A = O, e.substr(O, 4) === Me ? (Z = Me, O += 4) : (Z = a, ye === 0 && Ae(se)), Z !== a ? (Pe(), K = vt(), K !== a ? (De = A, A = Zn(K)) : (O = A, A = a)) : (O = A, A = a), A;
  }
  function xs() {
    var A, Z, K;
    return A = O, e.substr(O, 4) === be ? (Z = be, O += 4) : (Z = a, ye === 0 && Ae(oe)), Z !== a ? (Pe(), K = vt(), K !== a ? (De = A, A = Vn(K)) : (O = A, A = a)) : (O = A, A = a), A;
  }
  function ws() {
    var A, Z, K;
    return A = O, e.substr(O, 4) === ve ? (Z = ve, O += 4) : (Z = a, ye === 0 && Ae(pe)), Z !== a ? (Pe(), K = vt(), K !== a ? (De = A, A = $n(K)) : (O = A, A = a)) : (O = A, A = a), A;
  }
  function ks() {
    var A, Z, K, re, Ce;
    if (A = O, e.substr(O, 5) === ge ? (Z = ge, O += 5) : (Z = a, ye === 0 && Ae(me)), Z !== a)
      if (Pe(), K = Bt(), K !== a) {
        if (re = [], Ce = Ot(), Ce !== a)
          for (; Ce !== a; )
            re.push(Ce), Ce = Ot();
        else
          re = a;
        re !== a ? (Ce = Bt(), Ce !== a ? (De = A, A = Xn(re)) : (O = A, A = a)) : (O = A, A = a);
      } else
        O = A, A = a;
    else
      O = A, A = a;
    return A;
  }
  function jt() {
    var A, Z, K, re;
    if (A = O, e.substr(O, 2) === Ie ? (Z = Ie, O += 2) : (Z = a, ye === 0 && Ae(Le)), Z !== a) {
      for (K = [], re = e.charAt(O), At.test(re) ? O++ : (re = a, ye === 0 && Ae(He)); re !== a; )
        K.push(re), re = e.charAt(O), At.test(re) ? O++ : (re = a, ye === 0 && Ae(He));
      Z = [Z, K], A = Z;
    } else
      O = A, A = a;
    return A;
  }
  function Rs() {
    var A, Z, K, re, Ce, Oe, ct, It;
    if (A = O, e.substr(O, 3) === $e ? (Z = $e, O += 3) : (Z = a, ye === 0 && Ae(bt)), Z !== a)
      if (Pe(), e.charCodeAt(O) === 91 ? (K = F, O++) : (K = a, ye === 0 && Ae(Ne)), K !== a)
        if (Pe(), re = Nt(), re !== a) {
          for (Ce = [], Oe = O, ct = Lt(), ct !== a ? (It = Nt(), It !== a ? (De = Oe, Oe = en(re, It)) : (O = Oe, Oe = a)) : (O = Oe, Oe = a); Oe !== a; )
            Ce.push(Oe), Oe = O, ct = Lt(), ct !== a ? (It = Nt(), It !== a ? (De = Oe, Oe = en(re, It)) : (O = Oe, Oe = a)) : (O = Oe, Oe = a);
          Oe = Pe(), e.charCodeAt(O) === 93 ? (ct = E, O++) : (ct = a, ye === 0 && Ae(yt)), ct !== a ? (De = A, A = Wn(re, Ce)) : (O = A, A = a);
        } else
          O = A, A = a;
      else
        O = A, A = a;
    else
      O = A, A = a;
    return A;
  }
  function Ls() {
    var A;
    return A = Rs(), A === a && (A = As()), A;
  }
  function Nt() {
    var A, Z, K, re, Ce;
    if (A = O, Z = Ls(), Z !== a) {
      for (Pe(), K = [], re = jt(); re !== a; )
        K.push(re), re = jt();
      De = A, A = zn(Z);
    } else
      O = A, A = a;
    return A === a && (A = O, Z = Ss(), Z !== a ? (Pe(), e.charCodeAt(O) === 36 ? (K = Xe, O++) : (K = a, ye === 0 && Ae(Gt)), K !== a ? (re = Pe(), Ce = Nt(), Ce !== a ? (De = A, A = On(Z, Ce)) : (O = A, A = a)) : (O = A, A = a)) : (O = A, A = a)), A;
  }
  function Bs() {
    var A, Z;
    return A = O, Z = Nt(), Z !== a && (De = A, Z = Un(Z)), A = Z, A === a && (A = jt()), A;
  }
  function Ts() {
    var A;
    return A = Bs(), A;
  }
  function Ns() {
    var A, Z;
    return A = O, Pe(), Z = Is(), Z === a && (Z = Zs(), Z === a && (Z = Vs())), Z !== a ? (Pe(), De = A, A = Jn(Z)) : (O = A, A = a), A;
  }
  function Is() {
    var A, Z, K;
    return A = O, e.substr(O, 6) === ue ? (Z = ue, O += 6) : (Z = a, ye === 0 && Ae($t)), Z !== a ? (Pe(), K = vt(), K !== a ? (De = A, A = Kn(K)) : (O = A, A = a)) : (O = A, A = a), A;
  }
  function Zs() {
    var A, Z, K;
    return A = O, e.substr(O, 6) === Ee ? (Z = Ee, O += 6) : (Z = a, ye === 0 && Ae(Xt)), Z !== a ? (Pe(), K = vt(), K !== a ? (De = A, A = Hn(K)) : (O = A, A = a)) : (O = A, A = a), A;
  }
  function Vs() {
    var A, Z;
    return A = O, e.substr(O, 4) === qe ? (Z = qe, O += 4) : (Z = a, ye === 0 && Ae(it)), Z !== a && (De = A, Z = Yn()), A = Z, A;
  }
  function $s() {
    var A;
    return A = Ts(), A === a && (A = Ns()), A;
  }
  var Xs = function(A) {
    this.type_ = "atom", this.source_ = A, this.location_ = tn();
  }, Ut = function(A, Z, K, re) {
    this.type_ = "pattern", this.arguments_ = { alignment: Z, _steps: re }, K !== void 0 && (this.arguments_.seed = K), this.source_ = A;
  }, Ws = function(A, Z, K) {
    this.type_ = A, this.arguments_ = Z, this.source_ = K;
  }, zs = function(A, Z) {
    this.type_ = "element", this.source_ = A, this.options_ = Z, this.location_ = tn();
  }, qt = function(A, Z) {
    this.type_ = "command", this.name_ = A, this.options_ = Z;
  }, Qt = 0;
  if (Zt = l(), t.peg$library)
    return (
      /** @type {any} */
      {
        peg$result: Zt,
        peg$currPos: O,
        peg$FAILED: a,
        peg$maxFailExpected: Wt,
        peg$maxFailPos: ut
      }
    );
  if (Zt !== a && O === e.length)
    return Zt;
  throw Zt !== a && O < e.length && Ae(qn()), Qn(
    Wt,
    ut < e.length ? e.charAt(ut) : null,
    ut < e.length ? Yt(ut, ut + 1) : Yt(ut, ut)
  );
}
const peg$allowedStartRules = [
  "start"
], randOffset = 3e-4, applyOptions = (e, t) => (a, o) => {
  const f = e.source_[o].options_?.ops, p = a.__steps_source;
  if (f)
    for (const g of f)
      switch (g.type_) {
        case "stretch": {
          const d = ["fast", "slow"], { type: b, amount: F } = g.arguments_;
          if (!d.includes(b))
            throw new Error(`mini: stretch: type must be one of ${d.join("|")} but got ${b}`);
          a = reify(a)[b](t(F));
          break;
        }
        case "replicate": {
          const { amount: d } = g.arguments_;
          a = reify(a), a = a._repeatCycles(d)._fast(d);
          break;
        }
        case "bjorklund": {
          g.arguments_.rotation ? a = a.euclidRot(t(g.arguments_.pulse), t(g.arguments_.step), t(g.arguments_.rotation)) : a = a.euclid(t(g.arguments_.pulse), t(g.arguments_.step));
          break;
        }
        case "degradeBy": {
          a = reify(a)._degradeByWith(rand.early(randOffset * g.arguments_.seed), g.arguments_.amount ?? 0.5);
          break;
        }
        case "tail": {
          const d = t(g.arguments_.element);
          a = a.fmap((b) => (F) => Array.isArray(b) ? [...b, F] : [b, F]).appLeft(d);
          break;
        }
        case "range": {
          const d = t(g.arguments_.element);
          a = reify(a);
          const b = (E, S, R = 1) => Array.from(
            { length: Math.abs(S - E) / R + 1 },
            (k, I) => E < S ? E + I * R : E - I * R
          );
          a = ((E, S) => E.squeezeBind((R) => S.bind((k) => fastcat(...b(R, k)))))(a, d);
          break;
        }
        default:
          console.warn(`operator "${g.type_}" not implemented`);
      }
  return a.__steps_source = a.__steps_source || p, a;
};
function patternifyAST(e, t, a, o = 0) {
  a?.(e);
  const u = (l) => patternifyAST(l, t, a, o);
  switch (e.type_) {
    case "pattern": {
      const l = e.source_.map((d) => u(d)).map(applyOptions(e, u)), f = e.arguments_.alignment, p = l.filter((d) => d.__steps_source);
      let g;
      switch (f) {
        case "stack": {
          g = stack(...l), p.length && (g._steps = lcm(...p.map((d) => fraction$1(d._steps))));
          break;
        }
        case "polymeter_slowcat": {
          g = stack(...l.map((d) => d._slow(d.__weight))), p.length && (g._steps = lcm(...p.map((d) => fraction$1(d._steps))));
          break;
        }
        case "polymeter": {
          const d = e.arguments_.stepsPerCycle ? u(e.arguments_.stepsPerCycle).fmap((F) => fraction$1(F)) : pure(fraction$1(l.length > 0 ? l[0].__weight : 1)), b = l.map((F) => F.fast(d.fmap((E) => E.div(F.__weight))));
          g = stack(...b);
          break;
        }
        case "rand": {
          g = chooseInWith(rand.early(randOffset * e.arguments_.seed).segment(1), l), p.length && (g._steps = lcm(...p.map((d) => fraction$1(d._steps))));
          break;
        }
        case "feet": {
          g = fastcat(...l);
          break;
        }
        default: {
          if (e.source_.some((b) => !!b.options_?.weight)) {
            const b = e.source_.reduce(
              (F, E) => F.add(E.options_?.weight || fraction$1(1)),
              fraction$1(0)
            );
            g = timeCat(
              ...e.source_.map((F, E) => [F.options_?.weight || fraction$1(1), l[E]])
            ), g.__weight = b, g._steps = b, p.length && (g._steps = g._steps.mul(lcm(...p.map((F) => fraction$1(F._steps)))));
          } else
            g = sequence(...l), g._steps = l.length;
          e.arguments_._steps && (g.__steps_source = !0);
        }
      }
      return p.length && (g.__steps_source = !0), g;
    }
    case "element":
      return u(e.source_);
    case "atom": {
      if (e.source_ === "~" || e.source_ === "-")
        return silence;
      if (!e.location_)
        return console.warn("no location for", e), e.source_;
      const l = isNaN(Number(e.source_)) ? e.source_ : Number(e.source_);
      if (o === -1)
        return pure(l);
      const [f, p] = getLeafLocation(t, e, o);
      return pure(l).withLoc(f, p);
    }
    case "stretch":
      return u(e.source_).slow(u(e.arguments_.amount));
    default:
      return console.warn(`node type "${e.type_}" not implemented -> returning silence`), silence;
  }
}
const getLeafLocation = (e, t, a = 0) => {
  const { start: o, end: u } = t.location_, l = e?.split("").slice(o.offset, u.offset).join(""), [f = 0, p = 0] = l ? l.split(t.source_).map((g) => g.split("").filter((d) => d === " ").length) : [];
  return [o.offset + f + a, u.offset - p + a];
}, mini2ast = (e, t = 0, a = e) => {
  try {
    return peg$parse(e);
  } catch (o) {
    const u = [o.location.start.offset + t, o.location.end.offset + t], l = a.slice(0, u[0]).split(`
`).length;
    throw new Error(`[mini] parse error at line ${l}: ${o.message}`);
  }
}, getLeaves = (e, t, a) => {
  const o = mini2ast(e, t, a);
  let u = [];
  return patternifyAST(
    o,
    e,
    (l) => {
      l.type_ === "atom" && u.push(l);
    },
    -1
  ), u;
}, getLeafLocations = (e, t = 0, a) => getLeaves(e, t, a).map((o) => getLeafLocation(e, o, t)), mini = (...e) => {
  const t = e.map((a) => {
    const o = `"${a}"`, u = mini2ast(o);
    return patternifyAST(u, o);
  });
  return sequence(...t);
}, m = (e, t) => {
  const a = `"${e}"`, o = mini2ast(a);
  return patternifyAST(o, a, null, t);
}, h = (e) => {
  const t = mini2ast(e);
  return patternifyAST(t, e);
};
function minify(e) {
  return typeof e == "string" ? mini(e) : reify(e);
}
function miniAllStrings() {
  setStringParser(mini);
}
const index$6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  StartRules: peg$allowedStartRules,
  SyntaxError: peg$SyntaxError,
  getLeafLocation,
  getLeafLocations,
  getLeaves,
  h,
  m,
  mini,
  mini2ast,
  miniAllStrings,
  minify,
  parse: peg$parse,
  patternifyAST
}, Symbol.toStringTag, { value: "Module" }));
var astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 7, 9, 32, 4, 318, 1, 80, 3, 71, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 3, 0, 158, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 68, 8, 2, 0, 3, 0, 2, 3, 2, 4, 2, 0, 15, 1, 83, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 7, 19, 58, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 343, 9, 54, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 10, 1, 2, 0, 49, 6, 4, 4, 14, 10, 5350, 0, 7, 14, 11465, 27, 2343, 9, 87, 9, 39, 4, 60, 6, 26, 9, 535, 9, 470, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4178, 9, 519, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 101, 0, 161, 6, 10, 9, 357, 0, 62, 13, 499, 13, 245, 1, 2, 9, 726, 6, 110, 6, 6, 9, 4759, 9, 787719, 239], astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 4, 51, 13, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 39, 27, 10, 22, 251, 41, 7, 1, 17, 2, 60, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 20, 1, 64, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 31, 9, 2, 0, 3, 0, 2, 37, 2, 0, 26, 0, 2, 0, 45, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 200, 32, 32, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 16, 0, 2, 12, 2, 33, 125, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1071, 18, 5, 26, 3994, 6, 582, 6842, 29, 1763, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 433, 44, 212, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 42, 9, 8936, 3, 2, 6, 2, 1, 2, 290, 16, 0, 30, 2, 3, 0, 15, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 7, 5, 262, 61, 147, 44, 11, 6, 17, 0, 322, 29, 19, 43, 485, 27, 229, 29, 3, 0, 496, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4153, 7, 221, 3, 5761, 15, 7472, 16, 621, 2467, 541, 1507, 4938, 6, 4191], nonASCIIidentifierChars = "‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࢗ-࢟࣊-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄ఼ా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ೳഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-໎໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜕ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠏-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿ-ᫎᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷿‌‍‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯・꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿･", nonASCIIidentifierStartChars = "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࡰ-ࢇࢉ-ࢎࢠ-ࣉऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚౝౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೝೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜑᜟ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭌᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲊᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꟍꟐꟑꟓꟕ-Ƛꟲ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ", reservedWords = {
  3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
  5: "class enum extends super const export import",
  6: "enum",
  strict: "implements interface let package private protected public static yield",
  strictBind: "eval arguments"
}, ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this", keywords$1 = {
  5: ecma5AndLessKeywords,
  "5module": ecma5AndLessKeywords + " export import",
  6: ecma5AndLessKeywords + " const class extends export import super"
}, keywordRelationalOperator = /^in(stanceof)?$/, nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]"), nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
function isInAstralSet(e, t) {
  for (var a = 65536, o = 0; o < t.length; o += 2) {
    if (a += t[o], a > e)
      return !1;
    if (a += t[o + 1], a >= e)
      return !0;
  }
  return !1;
}
function isIdentifierStart(e, t) {
  return e < 65 ? e === 36 : e < 91 ? !0 : e < 97 ? e === 95 : e < 123 ? !0 : e <= 65535 ? e >= 170 && nonASCIIidentifierStart.test(String.fromCharCode(e)) : t === !1 ? !1 : isInAstralSet(e, astralIdentifierStartCodes);
}
function isIdentifierChar(e, t) {
  return e < 48 ? e === 36 : e < 58 ? !0 : e < 65 ? !1 : e < 91 ? !0 : e < 97 ? e === 95 : e < 123 ? !0 : e <= 65535 ? e >= 170 && nonASCIIidentifier.test(String.fromCharCode(e)) : t === !1 ? !1 : isInAstralSet(e, astralIdentifierStartCodes) || isInAstralSet(e, astralIdentifierCodes);
}
var TokenType = function e(t, a) {
  a === void 0 && (a = {}), this.label = t, this.keyword = a.keyword, this.beforeExpr = !!a.beforeExpr, this.startsExpr = !!a.startsExpr, this.isLoop = !!a.isLoop, this.isAssign = !!a.isAssign, this.prefix = !!a.prefix, this.postfix = !!a.postfix, this.binop = a.binop || null, this.updateContext = null;
};
function binop(e, t) {
  return new TokenType(e, { beforeExpr: !0, binop: t });
}
var beforeExpr = { beforeExpr: !0 }, startsExpr = { startsExpr: !0 }, keywords = {};
function kw(e, t) {
  return t === void 0 && (t = {}), t.keyword = e, keywords[e] = new TokenType(e, t);
}
var types$1 = {
  num: new TokenType("num", startsExpr),
  regexp: new TokenType("regexp", startsExpr),
  string: new TokenType("string", startsExpr),
  name: new TokenType("name", startsExpr),
  privateId: new TokenType("privateId", startsExpr),
  eof: new TokenType("eof"),
  // Punctuation token types.
  bracketL: new TokenType("[", { beforeExpr: !0, startsExpr: !0 }),
  bracketR: new TokenType("]"),
  braceL: new TokenType("{", { beforeExpr: !0, startsExpr: !0 }),
  braceR: new TokenType("}"),
  parenL: new TokenType("(", { beforeExpr: !0, startsExpr: !0 }),
  parenR: new TokenType(")"),
  comma: new TokenType(",", beforeExpr),
  semi: new TokenType(";", beforeExpr),
  colon: new TokenType(":", beforeExpr),
  dot: new TokenType("."),
  question: new TokenType("?", beforeExpr),
  questionDot: new TokenType("?."),
  arrow: new TokenType("=>", beforeExpr),
  template: new TokenType("template"),
  invalidTemplate: new TokenType("invalidTemplate"),
  ellipsis: new TokenType("...", beforeExpr),
  backQuote: new TokenType("`", startsExpr),
  dollarBraceL: new TokenType("${", { beforeExpr: !0, startsExpr: !0 }),
  // Operators. These carry several kinds of properties to help the
  // parser use them properly (the presence of these properties is
  // what categorizes them as operators).
  //
  // `binop`, when present, specifies that this operator is a binary
  // operator, and will refer to its precedence.
  //
  // `prefix` and `postfix` mark the operator as a prefix or postfix
  // unary operator.
  //
  // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
  // binary operators with a very low precedence, that should result
  // in AssignmentExpression nodes.
  eq: new TokenType("=", { beforeExpr: !0, isAssign: !0 }),
  assign: new TokenType("_=", { beforeExpr: !0, isAssign: !0 }),
  incDec: new TokenType("++/--", { prefix: !0, postfix: !0, startsExpr: !0 }),
  prefix: new TokenType("!/~", { beforeExpr: !0, prefix: !0, startsExpr: !0 }),
  logicalOR: binop("||", 1),
  logicalAND: binop("&&", 2),
  bitwiseOR: binop("|", 3),
  bitwiseXOR: binop("^", 4),
  bitwiseAND: binop("&", 5),
  equality: binop("==/!=/===/!==", 6),
  relational: binop("</>/<=/>=", 7),
  bitShift: binop("<</>>/>>>", 8),
  plusMin: new TokenType("+/-", { beforeExpr: !0, binop: 9, prefix: !0, startsExpr: !0 }),
  modulo: binop("%", 10),
  star: binop("*", 10),
  slash: binop("/", 10),
  starstar: new TokenType("**", { beforeExpr: !0 }),
  coalesce: binop("??", 1),
  // Keyword token types.
  _break: kw("break"),
  _case: kw("case", beforeExpr),
  _catch: kw("catch"),
  _continue: kw("continue"),
  _debugger: kw("debugger"),
  _default: kw("default", beforeExpr),
  _do: kw("do", { isLoop: !0, beforeExpr: !0 }),
  _else: kw("else", beforeExpr),
  _finally: kw("finally"),
  _for: kw("for", { isLoop: !0 }),
  _function: kw("function", startsExpr),
  _if: kw("if"),
  _return: kw("return", beforeExpr),
  _switch: kw("switch"),
  _throw: kw("throw", beforeExpr),
  _try: kw("try"),
  _var: kw("var"),
  _const: kw("const"),
  _while: kw("while", { isLoop: !0 }),
  _with: kw("with"),
  _new: kw("new", { beforeExpr: !0, startsExpr: !0 }),
  _this: kw("this", startsExpr),
  _super: kw("super", startsExpr),
  _class: kw("class", startsExpr),
  _extends: kw("extends", beforeExpr),
  _export: kw("export"),
  _import: kw("import", startsExpr),
  _null: kw("null", startsExpr),
  _true: kw("true", startsExpr),
  _false: kw("false", startsExpr),
  _in: kw("in", { beforeExpr: !0, binop: 7 }),
  _instanceof: kw("instanceof", { beforeExpr: !0, binop: 7 }),
  _typeof: kw("typeof", { beforeExpr: !0, prefix: !0, startsExpr: !0 }),
  _void: kw("void", { beforeExpr: !0, prefix: !0, startsExpr: !0 }),
  _delete: kw("delete", { beforeExpr: !0, prefix: !0, startsExpr: !0 })
}, lineBreak = /\r\n?|\n|\u2028|\u2029/, lineBreakG = new RegExp(lineBreak.source, "g");
function isNewLine(e) {
  return e === 10 || e === 13 || e === 8232 || e === 8233;
}
function nextLineBreak(e, t, a) {
  a === void 0 && (a = e.length);
  for (var o = t; o < a; o++) {
    var u = e.charCodeAt(o);
    if (isNewLine(u))
      return o < a - 1 && u === 13 && e.charCodeAt(o + 1) === 10 ? o + 2 : o + 1;
  }
  return -1;
}
var nonASCIIwhitespace = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/, skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g, ref = Object.prototype, hasOwnProperty = ref.hasOwnProperty, toString = ref.toString, hasOwn = Object.hasOwn || function(e, t) {
  return hasOwnProperty.call(e, t);
}, isArray = Array.isArray || function(e) {
  return toString.call(e) === "[object Array]";
}, regexpCache = /* @__PURE__ */ Object.create(null);
function wordsRegexp(e) {
  return regexpCache[e] || (regexpCache[e] = new RegExp("^(?:" + e.replace(/ /g, "|") + ")$"));
}
function codePointToString(e) {
  return e <= 65535 ? String.fromCharCode(e) : (e -= 65536, String.fromCharCode((e >> 10) + 55296, (e & 1023) + 56320));
}
var loneSurrogate = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/, Position = function e(t, a) {
  this.line = t, this.column = a;
};
Position.prototype.offset = function e(t) {
  return new Position(this.line, this.column + t);
};
var SourceLocation = function e(t, a, o) {
  this.start = a, this.end = o, t.sourceFile !== null && (this.source = t.sourceFile);
};
function getLineInfo(e, t) {
  for (var a = 1, o = 0; ; ) {
    var u = nextLineBreak(e, o, t);
    if (u < 0)
      return new Position(a, t - o);
    ++a, o = u;
  }
}
var defaultOptions = {
  // `ecmaVersion` indicates the ECMAScript version to parse. Must be
  // either 3, 5, 6 (or 2015), 7 (2016), 8 (2017), 9 (2018), 10
  // (2019), 11 (2020), 12 (2021), 13 (2022), 14 (2023), or `"latest"`
  // (the latest version the library supports). This influences
  // support for strict mode, the set of reserved words, and support
  // for new syntax features.
  ecmaVersion: null,
  // `sourceType` indicates the mode the code should be parsed in.
  // Can be either `"script"` or `"module"`. This influences global
  // strict mode and parsing of `import` and `export` declarations.
  sourceType: "script",
  // `onInsertedSemicolon` can be a callback that will be called when
  // a semicolon is automatically inserted. It will be passed the
  // position of the inserted semicolon as an offset, and if
  // `locations` is enabled, it is given the location as a `{line,
  // column}` object as second argument.
  onInsertedSemicolon: null,
  // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
  // trailing commas.
  onTrailingComma: null,
  // By default, reserved words are only enforced if ecmaVersion >= 5.
  // Set `allowReserved` to a boolean value to explicitly turn this on
  // an off. When this option has the value "never", reserved words
  // and keywords can also not be used as property names.
  allowReserved: null,
  // When enabled, a return at the top level is not considered an
  // error.
  allowReturnOutsideFunction: !1,
  // When enabled, import/export statements are not constrained to
  // appearing at the top of the program, and an import.meta expression
  // in a script isn't considered an error.
  allowImportExportEverywhere: !1,
  // By default, await identifiers are allowed to appear at the top-level scope only if ecmaVersion >= 2022.
  // When enabled, await identifiers are allowed to appear at the top-level scope,
  // but they are still not allowed in non-async functions.
  allowAwaitOutsideFunction: null,
  // When enabled, super identifiers are not constrained to
  // appearing in methods and do not raise an error when they appear elsewhere.
  allowSuperOutsideMethod: null,
  // When enabled, hashbang directive in the beginning of file is
  // allowed and treated as a line comment. Enabled by default when
  // `ecmaVersion` >= 2023.
  allowHashBang: !1,
  // By default, the parser will verify that private properties are
  // only used in places where they are valid and have been declared.
  // Set this to false to turn such checks off.
  checkPrivateFields: !0,
  // When `locations` is on, `loc` properties holding objects with
  // `start` and `end` properties in `{line, column}` form (with
  // line being 1-based and column 0-based) will be attached to the
  // nodes.
  locations: !1,
  // A function can be passed as `onToken` option, which will
  // cause Acorn to call that function with object in the same
  // format as tokens returned from `tokenizer().getToken()`. Note
  // that you are not allowed to call the parser from the
  // callback—that will corrupt its internal state.
  onToken: null,
  // A function can be passed as `onComment` option, which will
  // cause Acorn to call that function with `(block, text, start,
  // end)` parameters whenever a comment is skipped. `block` is a
  // boolean indicating whether this is a block (`/* */`) comment,
  // `text` is the content of the comment, and `start` and `end` are
  // character offsets that denote the start and end of the comment.
  // When the `locations` option is on, two more parameters are
  // passed, the full `{line, column}` locations of the start and
  // end of the comments. Note that you are not allowed to call the
  // parser from the callback—that will corrupt its internal state.
  // When this option has an array as value, objects representing the
  // comments are pushed to it.
  onComment: null,
  // Nodes have their start and end characters offsets recorded in
  // `start` and `end` properties (directly on the node, rather than
  // the `loc` object, which holds line/column data. To also add a
  // [semi-standardized][range] `range` property holding a `[start,
  // end]` array with the same numbers, set the `ranges` option to
  // `true`.
  //
  // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
  ranges: !1,
  // It is possible to parse multiple files into a single AST by
  // passing the tree produced by parsing the first file as
  // `program` option in subsequent parses. This will add the
  // toplevel forms of the parsed file to the `Program` (top) node
  // of an existing parse tree.
  program: null,
  // When `locations` is on, you can pass this to record the source
  // file in every node's `loc` object.
  sourceFile: null,
  // This value, if given, is stored in every node, whether
  // `locations` is on or off.
  directSourceFile: null,
  // When enabled, parenthesized expressions are represented by
  // (non-standard) ParenthesizedExpression nodes
  preserveParens: !1
}, warnedAboutEcmaVersion = !1;
function getOptions(e) {
  var t = {};
  for (var a in defaultOptions)
    t[a] = e && hasOwn(e, a) ? e[a] : defaultOptions[a];
  if (t.ecmaVersion === "latest" ? t.ecmaVersion = 1e8 : t.ecmaVersion == null ? (!warnedAboutEcmaVersion && typeof console == "object" && console.warn && (warnedAboutEcmaVersion = !0, console.warn(`Since Acorn 8.0.0, options.ecmaVersion is required.
Defaulting to 2020, but this will stop working in the future.`)), t.ecmaVersion = 11) : t.ecmaVersion >= 2015 && (t.ecmaVersion -= 2009), t.allowReserved == null && (t.allowReserved = t.ecmaVersion < 5), (!e || e.allowHashBang == null) && (t.allowHashBang = t.ecmaVersion >= 14), isArray(t.onToken)) {
    var o = t.onToken;
    t.onToken = function(u) {
      return o.push(u);
    };
  }
  return isArray(t.onComment) && (t.onComment = pushComment(t, t.onComment)), t;
}
function pushComment(e, t) {
  return function(a, o, u, l, f, p) {
    var g = {
      type: a ? "Block" : "Line",
      value: o,
      start: u,
      end: l
    };
    e.locations && (g.loc = new SourceLocation(this, f, p)), e.ranges && (g.range = [u, l]), t.push(g);
  };
}
var SCOPE_TOP = 1, SCOPE_FUNCTION = 2, SCOPE_ASYNC = 4, SCOPE_GENERATOR = 8, SCOPE_ARROW = 16, SCOPE_SIMPLE_CATCH = 32, SCOPE_SUPER = 64, SCOPE_DIRECT_SUPER = 128, SCOPE_CLASS_STATIC_BLOCK = 256, SCOPE_VAR = SCOPE_TOP | SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK;
function functionFlags(e, t) {
  return SCOPE_FUNCTION | (e ? SCOPE_ASYNC : 0) | (t ? SCOPE_GENERATOR : 0);
}
var BIND_NONE = 0, BIND_VAR = 1, BIND_LEXICAL = 2, BIND_FUNCTION = 3, BIND_SIMPLE_CATCH = 4, BIND_OUTSIDE = 5, Parser = function e(t, a, o) {
  this.options = t = getOptions(t), this.sourceFile = t.sourceFile, this.keywords = wordsRegexp(keywords$1[t.ecmaVersion >= 6 ? 6 : t.sourceType === "module" ? "5module" : 5]);
  var u = "";
  t.allowReserved !== !0 && (u = reservedWords[t.ecmaVersion >= 6 ? 6 : t.ecmaVersion === 5 ? 5 : 3], t.sourceType === "module" && (u += " await")), this.reservedWords = wordsRegexp(u);
  var l = (u ? u + " " : "") + reservedWords.strict;
  this.reservedWordsStrict = wordsRegexp(l), this.reservedWordsStrictBind = wordsRegexp(l + " " + reservedWords.strictBind), this.input = String(a), this.containsEsc = !1, o ? (this.pos = o, this.lineStart = this.input.lastIndexOf(`
`, o - 1) + 1, this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length) : (this.pos = this.lineStart = 0, this.curLine = 1), this.type = types$1.eof, this.value = null, this.start = this.end = this.pos, this.startLoc = this.endLoc = this.curPosition(), this.lastTokEndLoc = this.lastTokStartLoc = null, this.lastTokStart = this.lastTokEnd = this.pos, this.context = this.initialContext(), this.exprAllowed = !0, this.inModule = t.sourceType === "module", this.strict = this.inModule || this.strictDirective(this.pos), this.potentialArrowAt = -1, this.potentialArrowInForAwait = !1, this.yieldPos = this.awaitPos = this.awaitIdentPos = 0, this.labels = [], this.undefinedExports = /* @__PURE__ */ Object.create(null), this.pos === 0 && t.allowHashBang && this.input.slice(0, 2) === "#!" && this.skipLineComment(2), this.scopeStack = [], this.enterScope(SCOPE_TOP), this.regexpState = null, this.privateNameStack = [];
}, prototypeAccessors = { inFunction: { configurable: !0 }, inGenerator: { configurable: !0 }, inAsync: { configurable: !0 }, canAwait: { configurable: !0 }, allowSuper: { configurable: !0 }, allowDirectSuper: { configurable: !0 }, treatFunctionsAsVar: { configurable: !0 }, allowNewDotTarget: { configurable: !0 }, inClassStaticBlock: { configurable: !0 } };
Parser.prototype.parse = function e() {
  var t = this.options.program || this.startNode();
  return this.nextToken(), this.parseTopLevel(t);
};
prototypeAccessors.inFunction.get = function() {
  return (this.currentVarScope().flags & SCOPE_FUNCTION) > 0;
};
prototypeAccessors.inGenerator.get = function() {
  return (this.currentVarScope().flags & SCOPE_GENERATOR) > 0 && !this.currentVarScope().inClassFieldInit;
};
prototypeAccessors.inAsync.get = function() {
  return (this.currentVarScope().flags & SCOPE_ASYNC) > 0 && !this.currentVarScope().inClassFieldInit;
};
prototypeAccessors.canAwait.get = function() {
  for (var e = this.scopeStack.length - 1; e >= 0; e--) {
    var t = this.scopeStack[e];
    if (t.inClassFieldInit || t.flags & SCOPE_CLASS_STATIC_BLOCK)
      return !1;
    if (t.flags & SCOPE_FUNCTION)
      return (t.flags & SCOPE_ASYNC) > 0;
  }
  return this.inModule && this.options.ecmaVersion >= 13 || this.options.allowAwaitOutsideFunction;
};
prototypeAccessors.allowSuper.get = function() {
  var e = this.currentThisScope(), t = e.flags, a = e.inClassFieldInit;
  return (t & SCOPE_SUPER) > 0 || a || this.options.allowSuperOutsideMethod;
};
prototypeAccessors.allowDirectSuper.get = function() {
  return (this.currentThisScope().flags & SCOPE_DIRECT_SUPER) > 0;
};
prototypeAccessors.treatFunctionsAsVar.get = function() {
  return this.treatFunctionsAsVarInScope(this.currentScope());
};
prototypeAccessors.allowNewDotTarget.get = function() {
  var e = this.currentThisScope(), t = e.flags, a = e.inClassFieldInit;
  return (t & (SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK)) > 0 || a;
};
prototypeAccessors.inClassStaticBlock.get = function() {
  return (this.currentVarScope().flags & SCOPE_CLASS_STATIC_BLOCK) > 0;
};
Parser.extend = function e() {
  for (var t = [], a = arguments.length; a--; ) t[a] = arguments[a];
  for (var o = this, u = 0; u < t.length; u++)
    o = t[u](o);
  return o;
};
Parser.parse = function e(t, a) {
  return new this(a, t).parse();
};
Parser.parseExpressionAt = function e(t, a, o) {
  var u = new this(o, t, a);
  return u.nextToken(), u.parseExpression();
};
Parser.tokenizer = function e(t, a) {
  return new this(a, t);
};
Object.defineProperties(Parser.prototype, prototypeAccessors);
var pp$9 = Parser.prototype, literal = /^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/;
pp$9.strictDirective = function(e) {
  if (this.options.ecmaVersion < 5)
    return !1;
  for (; ; ) {
    skipWhiteSpace.lastIndex = e, e += skipWhiteSpace.exec(this.input)[0].length;
    var t = literal.exec(this.input.slice(e));
    if (!t)
      return !1;
    if ((t[1] || t[2]) === "use strict") {
      skipWhiteSpace.lastIndex = e + t[0].length;
      var a = skipWhiteSpace.exec(this.input), o = a.index + a[0].length, u = this.input.charAt(o);
      return u === ";" || u === "}" || lineBreak.test(a[0]) && !(/[(`.[+\-/*%<>=,?^&]/.test(u) || u === "!" && this.input.charAt(o + 1) === "=");
    }
    e += t[0].length, skipWhiteSpace.lastIndex = e, e += skipWhiteSpace.exec(this.input)[0].length, this.input[e] === ";" && e++;
  }
};
pp$9.eat = function(e) {
  return this.type === e ? (this.next(), !0) : !1;
};
pp$9.isContextual = function(e) {
  return this.type === types$1.name && this.value === e && !this.containsEsc;
};
pp$9.eatContextual = function(e) {
  return this.isContextual(e) ? (this.next(), !0) : !1;
};
pp$9.expectContextual = function(e) {
  this.eatContextual(e) || this.unexpected();
};
pp$9.canInsertSemicolon = function() {
  return this.type === types$1.eof || this.type === types$1.braceR || lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
};
pp$9.insertSemicolon = function() {
  if (this.canInsertSemicolon())
    return this.options.onInsertedSemicolon && this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc), !0;
};
pp$9.semicolon = function() {
  !this.eat(types$1.semi) && !this.insertSemicolon() && this.unexpected();
};
pp$9.afterTrailingComma = function(e, t) {
  if (this.type === e)
    return this.options.onTrailingComma && this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc), t || this.next(), !0;
};
pp$9.expect = function(e) {
  this.eat(e) || this.unexpected();
};
pp$9.unexpected = function(e) {
  this.raise(e ?? this.start, "Unexpected token");
};
var DestructuringErrors = function e() {
  this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
};
pp$9.checkPatternErrors = function(e, t) {
  if (e) {
    e.trailingComma > -1 && this.raiseRecoverable(e.trailingComma, "Comma is not permitted after the rest element");
    var a = t ? e.parenthesizedAssign : e.parenthesizedBind;
    a > -1 && this.raiseRecoverable(a, t ? "Assigning to rvalue" : "Parenthesized pattern");
  }
};
pp$9.checkExpressionErrors = function(e, t) {
  if (!e)
    return !1;
  var a = e.shorthandAssign, o = e.doubleProto;
  if (!t)
    return a >= 0 || o >= 0;
  a >= 0 && this.raise(a, "Shorthand property assignments are valid only in destructuring patterns"), o >= 0 && this.raiseRecoverable(o, "Redefinition of __proto__ property");
};
pp$9.checkYieldAwaitInDefaultParams = function() {
  this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos) && this.raise(this.yieldPos, "Yield expression cannot be a default value"), this.awaitPos && this.raise(this.awaitPos, "Await expression cannot be a default value");
};
pp$9.isSimpleAssignTarget = function(e) {
  return e.type === "ParenthesizedExpression" ? this.isSimpleAssignTarget(e.expression) : e.type === "Identifier" || e.type === "MemberExpression";
};
var pp$8 = Parser.prototype;
pp$8.parseTopLevel = function(e) {
  var t = /* @__PURE__ */ Object.create(null);
  for (e.body || (e.body = []); this.type !== types$1.eof; ) {
    var a = this.parseStatement(null, !0, t);
    e.body.push(a);
  }
  if (this.inModule)
    for (var o = 0, u = Object.keys(this.undefinedExports); o < u.length; o += 1) {
      var l = u[o];
      this.raiseRecoverable(this.undefinedExports[l].start, "Export '" + l + "' is not defined");
    }
  return this.adaptDirectivePrologue(e.body), this.next(), e.sourceType = this.options.sourceType, this.finishNode(e, "Program");
};
var loopLabel = { kind: "loop" }, switchLabel = { kind: "switch" };
pp$8.isLet = function(e) {
  if (this.options.ecmaVersion < 6 || !this.isContextual("let"))
    return !1;
  skipWhiteSpace.lastIndex = this.pos;
  var t = skipWhiteSpace.exec(this.input), a = this.pos + t[0].length, o = this.input.charCodeAt(a);
  if (o === 91 || o === 92)
    return !0;
  if (e)
    return !1;
  if (o === 123 || o > 55295 && o < 56320)
    return !0;
  if (isIdentifierStart(o, !0)) {
    for (var u = a + 1; isIdentifierChar(o = this.input.charCodeAt(u), !0); )
      ++u;
    if (o === 92 || o > 55295 && o < 56320)
      return !0;
    var l = this.input.slice(a, u);
    if (!keywordRelationalOperator.test(l))
      return !0;
  }
  return !1;
};
pp$8.isAsyncFunction = function() {
  if (this.options.ecmaVersion < 8 || !this.isContextual("async"))
    return !1;
  skipWhiteSpace.lastIndex = this.pos;
  var e = skipWhiteSpace.exec(this.input), t = this.pos + e[0].length, a;
  return !lineBreak.test(this.input.slice(this.pos, t)) && this.input.slice(t, t + 8) === "function" && (t + 8 === this.input.length || !(isIdentifierChar(a = this.input.charCodeAt(t + 8)) || a > 55295 && a < 56320));
};
pp$8.parseStatement = function(e, t, a) {
  var o = this.type, u = this.startNode(), l;
  switch (this.isLet(e) && (o = types$1._var, l = "let"), o) {
    case types$1._break:
    case types$1._continue:
      return this.parseBreakContinueStatement(u, o.keyword);
    case types$1._debugger:
      return this.parseDebuggerStatement(u);
    case types$1._do:
      return this.parseDoStatement(u);
    case types$1._for:
      return this.parseForStatement(u);
    case types$1._function:
      return e && (this.strict || e !== "if" && e !== "label") && this.options.ecmaVersion >= 6 && this.unexpected(), this.parseFunctionStatement(u, !1, !e);
    case types$1._class:
      return e && this.unexpected(), this.parseClass(u, !0);
    case types$1._if:
      return this.parseIfStatement(u);
    case types$1._return:
      return this.parseReturnStatement(u);
    case types$1._switch:
      return this.parseSwitchStatement(u);
    case types$1._throw:
      return this.parseThrowStatement(u);
    case types$1._try:
      return this.parseTryStatement(u);
    case types$1._const:
    case types$1._var:
      return l = l || this.value, e && l !== "var" && this.unexpected(), this.parseVarStatement(u, l);
    case types$1._while:
      return this.parseWhileStatement(u);
    case types$1._with:
      return this.parseWithStatement(u);
    case types$1.braceL:
      return this.parseBlock(!0, u);
    case types$1.semi:
      return this.parseEmptyStatement(u);
    case types$1._export:
    case types$1._import:
      if (this.options.ecmaVersion > 10 && o === types$1._import) {
        skipWhiteSpace.lastIndex = this.pos;
        var f = skipWhiteSpace.exec(this.input), p = this.pos + f[0].length, g = this.input.charCodeAt(p);
        if (g === 40 || g === 46)
          return this.parseExpressionStatement(u, this.parseExpression());
      }
      return this.options.allowImportExportEverywhere || (t || this.raise(this.start, "'import' and 'export' may only appear at the top level"), this.inModule || this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'")), o === types$1._import ? this.parseImport(u) : this.parseExport(u, a);
    // If the statement does not start with a statement keyword or a
    // brace, it's an ExpressionStatement or LabeledStatement. We
    // simply start parsing an expression, and afterwards, if the
    // next token is a colon and the expression was a simple
    // Identifier node, we switch to interpreting it as a label.
    default:
      if (this.isAsyncFunction())
        return e && this.unexpected(), this.next(), this.parseFunctionStatement(u, !0, !e);
      var d = this.value, b = this.parseExpression();
      return o === types$1.name && b.type === "Identifier" && this.eat(types$1.colon) ? this.parseLabeledStatement(u, d, b, e) : this.parseExpressionStatement(u, b);
  }
};
pp$8.parseBreakContinueStatement = function(e, t) {
  var a = t === "break";
  this.next(), this.eat(types$1.semi) || this.insertSemicolon() ? e.label = null : this.type !== types$1.name ? this.unexpected() : (e.label = this.parseIdent(), this.semicolon());
  for (var o = 0; o < this.labels.length; ++o) {
    var u = this.labels[o];
    if ((e.label == null || u.name === e.label.name) && (u.kind != null && (a || u.kind === "loop") || e.label && a))
      break;
  }
  return o === this.labels.length && this.raise(e.start, "Unsyntactic " + t), this.finishNode(e, a ? "BreakStatement" : "ContinueStatement");
};
pp$8.parseDebuggerStatement = function(e) {
  return this.next(), this.semicolon(), this.finishNode(e, "DebuggerStatement");
};
pp$8.parseDoStatement = function(e) {
  return this.next(), this.labels.push(loopLabel), e.body = this.parseStatement("do"), this.labels.pop(), this.expect(types$1._while), e.test = this.parseParenExpression(), this.options.ecmaVersion >= 6 ? this.eat(types$1.semi) : this.semicolon(), this.finishNode(e, "DoWhileStatement");
};
pp$8.parseForStatement = function(e) {
  this.next();
  var t = this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await") ? this.lastTokStart : -1;
  if (this.labels.push(loopLabel), this.enterScope(0), this.expect(types$1.parenL), this.type === types$1.semi)
    return t > -1 && this.unexpected(t), this.parseFor(e, null);
  var a = this.isLet();
  if (this.type === types$1._var || this.type === types$1._const || a) {
    var o = this.startNode(), u = a ? "let" : this.value;
    return this.next(), this.parseVar(o, !0, u), this.finishNode(o, "VariableDeclaration"), (this.type === types$1._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && o.declarations.length === 1 ? (this.options.ecmaVersion >= 9 && (this.type === types$1._in ? t > -1 && this.unexpected(t) : e.await = t > -1), this.parseForIn(e, o)) : (t > -1 && this.unexpected(t), this.parseFor(e, o));
  }
  var l = this.isContextual("let"), f = !1, p = this.containsEsc, g = new DestructuringErrors(), d = this.start, b = t > -1 ? this.parseExprSubscripts(g, "await") : this.parseExpression(!0, g);
  return this.type === types$1._in || (f = this.options.ecmaVersion >= 6 && this.isContextual("of")) ? (t > -1 ? (this.type === types$1._in && this.unexpected(t), e.await = !0) : f && this.options.ecmaVersion >= 8 && (b.start === d && !p && b.type === "Identifier" && b.name === "async" ? this.unexpected() : this.options.ecmaVersion >= 9 && (e.await = !1)), l && f && this.raise(b.start, "The left-hand side of a for-of loop may not start with 'let'."), this.toAssignable(b, !1, g), this.checkLValPattern(b), this.parseForIn(e, b)) : (this.checkExpressionErrors(g, !0), t > -1 && this.unexpected(t), this.parseFor(e, b));
};
pp$8.parseFunctionStatement = function(e, t, a) {
  return this.next(), this.parseFunction(e, FUNC_STATEMENT | (a ? 0 : FUNC_HANGING_STATEMENT), !1, t);
};
pp$8.parseIfStatement = function(e) {
  return this.next(), e.test = this.parseParenExpression(), e.consequent = this.parseStatement("if"), e.alternate = this.eat(types$1._else) ? this.parseStatement("if") : null, this.finishNode(e, "IfStatement");
};
pp$8.parseReturnStatement = function(e) {
  return !this.inFunction && !this.options.allowReturnOutsideFunction && this.raise(this.start, "'return' outside of function"), this.next(), this.eat(types$1.semi) || this.insertSemicolon() ? e.argument = null : (e.argument = this.parseExpression(), this.semicolon()), this.finishNode(e, "ReturnStatement");
};
pp$8.parseSwitchStatement = function(e) {
  this.next(), e.discriminant = this.parseParenExpression(), e.cases = [], this.expect(types$1.braceL), this.labels.push(switchLabel), this.enterScope(0);
  for (var t, a = !1; this.type !== types$1.braceR; )
    if (this.type === types$1._case || this.type === types$1._default) {
      var o = this.type === types$1._case;
      t && this.finishNode(t, "SwitchCase"), e.cases.push(t = this.startNode()), t.consequent = [], this.next(), o ? t.test = this.parseExpression() : (a && this.raiseRecoverable(this.lastTokStart, "Multiple default clauses"), a = !0, t.test = null), this.expect(types$1.colon);
    } else
      t || this.unexpected(), t.consequent.push(this.parseStatement(null));
  return this.exitScope(), t && this.finishNode(t, "SwitchCase"), this.next(), this.labels.pop(), this.finishNode(e, "SwitchStatement");
};
pp$8.parseThrowStatement = function(e) {
  return this.next(), lineBreak.test(this.input.slice(this.lastTokEnd, this.start)) && this.raise(this.lastTokEnd, "Illegal newline after throw"), e.argument = this.parseExpression(), this.semicolon(), this.finishNode(e, "ThrowStatement");
};
var empty$1 = [];
pp$8.parseCatchClauseParam = function() {
  var e = this.parseBindingAtom(), t = e.type === "Identifier";
  return this.enterScope(t ? SCOPE_SIMPLE_CATCH : 0), this.checkLValPattern(e, t ? BIND_SIMPLE_CATCH : BIND_LEXICAL), this.expect(types$1.parenR), e;
};
pp$8.parseTryStatement = function(e) {
  if (this.next(), e.block = this.parseBlock(), e.handler = null, this.type === types$1._catch) {
    var t = this.startNode();
    this.next(), this.eat(types$1.parenL) ? t.param = this.parseCatchClauseParam() : (this.options.ecmaVersion < 10 && this.unexpected(), t.param = null, this.enterScope(0)), t.body = this.parseBlock(!1), this.exitScope(), e.handler = this.finishNode(t, "CatchClause");
  }
  return e.finalizer = this.eat(types$1._finally) ? this.parseBlock() : null, !e.handler && !e.finalizer && this.raise(e.start, "Missing catch or finally clause"), this.finishNode(e, "TryStatement");
};
pp$8.parseVarStatement = function(e, t, a) {
  return this.next(), this.parseVar(e, !1, t, a), this.semicolon(), this.finishNode(e, "VariableDeclaration");
};
pp$8.parseWhileStatement = function(e) {
  return this.next(), e.test = this.parseParenExpression(), this.labels.push(loopLabel), e.body = this.parseStatement("while"), this.labels.pop(), this.finishNode(e, "WhileStatement");
};
pp$8.parseWithStatement = function(e) {
  return this.strict && this.raise(this.start, "'with' in strict mode"), this.next(), e.object = this.parseParenExpression(), e.body = this.parseStatement("with"), this.finishNode(e, "WithStatement");
};
pp$8.parseEmptyStatement = function(e) {
  return this.next(), this.finishNode(e, "EmptyStatement");
};
pp$8.parseLabeledStatement = function(e, t, a, o) {
  for (var u = 0, l = this.labels; u < l.length; u += 1) {
    var f = l[u];
    f.name === t && this.raise(a.start, "Label '" + t + "' is already declared");
  }
  for (var p = this.type.isLoop ? "loop" : this.type === types$1._switch ? "switch" : null, g = this.labels.length - 1; g >= 0; g--) {
    var d = this.labels[g];
    if (d.statementStart === e.start)
      d.statementStart = this.start, d.kind = p;
    else
      break;
  }
  return this.labels.push({ name: t, kind: p, statementStart: this.start }), e.body = this.parseStatement(o ? o.indexOf("label") === -1 ? o + "label" : o : "label"), this.labels.pop(), e.label = a, this.finishNode(e, "LabeledStatement");
};
pp$8.parseExpressionStatement = function(e, t) {
  return e.expression = t, this.semicolon(), this.finishNode(e, "ExpressionStatement");
};
pp$8.parseBlock = function(e, t, a) {
  for (e === void 0 && (e = !0), t === void 0 && (t = this.startNode()), t.body = [], this.expect(types$1.braceL), e && this.enterScope(0); this.type !== types$1.braceR; ) {
    var o = this.parseStatement(null);
    t.body.push(o);
  }
  return a && (this.strict = !1), this.next(), e && this.exitScope(), this.finishNode(t, "BlockStatement");
};
pp$8.parseFor = function(e, t) {
  return e.init = t, this.expect(types$1.semi), e.test = this.type === types$1.semi ? null : this.parseExpression(), this.expect(types$1.semi), e.update = this.type === types$1.parenR ? null : this.parseExpression(), this.expect(types$1.parenR), e.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(e, "ForStatement");
};
pp$8.parseForIn = function(e, t) {
  var a = this.type === types$1._in;
  return this.next(), t.type === "VariableDeclaration" && t.declarations[0].init != null && (!a || this.options.ecmaVersion < 8 || this.strict || t.kind !== "var" || t.declarations[0].id.type !== "Identifier") && this.raise(
    t.start,
    (a ? "for-in" : "for-of") + " loop variable declaration may not have an initializer"
  ), e.left = t, e.right = a ? this.parseExpression() : this.parseMaybeAssign(), this.expect(types$1.parenR), e.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(e, a ? "ForInStatement" : "ForOfStatement");
};
pp$8.parseVar = function(e, t, a, o) {
  for (e.declarations = [], e.kind = a; ; ) {
    var u = this.startNode();
    if (this.parseVarId(u, a), this.eat(types$1.eq) ? u.init = this.parseMaybeAssign(t) : !o && a === "const" && !(this.type === types$1._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) ? this.unexpected() : !o && u.id.type !== "Identifier" && !(t && (this.type === types$1._in || this.isContextual("of"))) ? this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value") : u.init = null, e.declarations.push(this.finishNode(u, "VariableDeclarator")), !this.eat(types$1.comma))
      break;
  }
  return e;
};
pp$8.parseVarId = function(e, t) {
  e.id = this.parseBindingAtom(), this.checkLValPattern(e.id, t === "var" ? BIND_VAR : BIND_LEXICAL, !1);
};
var FUNC_STATEMENT = 1, FUNC_HANGING_STATEMENT = 2, FUNC_NULLABLE_ID = 4;
pp$8.parseFunction = function(e, t, a, o, u) {
  this.initFunction(e), (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !o) && (this.type === types$1.star && t & FUNC_HANGING_STATEMENT && this.unexpected(), e.generator = this.eat(types$1.star)), this.options.ecmaVersion >= 8 && (e.async = !!o), t & FUNC_STATEMENT && (e.id = t & FUNC_NULLABLE_ID && this.type !== types$1.name ? null : this.parseIdent(), e.id && !(t & FUNC_HANGING_STATEMENT) && this.checkLValSimple(e.id, this.strict || e.generator || e.async ? this.treatFunctionsAsVar ? BIND_VAR : BIND_LEXICAL : BIND_FUNCTION));
  var l = this.yieldPos, f = this.awaitPos, p = this.awaitIdentPos;
  return this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(functionFlags(e.async, e.generator)), t & FUNC_STATEMENT || (e.id = this.type === types$1.name ? this.parseIdent() : null), this.parseFunctionParams(e), this.parseFunctionBody(e, a, !1, u), this.yieldPos = l, this.awaitPos = f, this.awaitIdentPos = p, this.finishNode(e, t & FUNC_STATEMENT ? "FunctionDeclaration" : "FunctionExpression");
};
pp$8.parseFunctionParams = function(e) {
  this.expect(types$1.parenL), e.params = this.parseBindingList(types$1.parenR, !1, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams();
};
pp$8.parseClass = function(e, t) {
  this.next();
  var a = this.strict;
  this.strict = !0, this.parseClassId(e, t), this.parseClassSuper(e);
  var o = this.enterClassBody(), u = this.startNode(), l = !1;
  for (u.body = [], this.expect(types$1.braceL); this.type !== types$1.braceR; ) {
    var f = this.parseClassElement(e.superClass !== null);
    f && (u.body.push(f), f.type === "MethodDefinition" && f.kind === "constructor" ? (l && this.raiseRecoverable(f.start, "Duplicate constructor in the same class"), l = !0) : f.key && f.key.type === "PrivateIdentifier" && isPrivateNameConflicted(o, f) && this.raiseRecoverable(f.key.start, "Identifier '#" + f.key.name + "' has already been declared"));
  }
  return this.strict = a, this.next(), e.body = this.finishNode(u, "ClassBody"), this.exitClassBody(), this.finishNode(e, t ? "ClassDeclaration" : "ClassExpression");
};
pp$8.parseClassElement = function(e) {
  if (this.eat(types$1.semi))
    return null;
  var t = this.options.ecmaVersion, a = this.startNode(), o = "", u = !1, l = !1, f = "method", p = !1;
  if (this.eatContextual("static")) {
    if (t >= 13 && this.eat(types$1.braceL))
      return this.parseClassStaticBlock(a), a;
    this.isClassElementNameStart() || this.type === types$1.star ? p = !0 : o = "static";
  }
  if (a.static = p, !o && t >= 8 && this.eatContextual("async") && ((this.isClassElementNameStart() || this.type === types$1.star) && !this.canInsertSemicolon() ? l = !0 : o = "async"), !o && (t >= 9 || !l) && this.eat(types$1.star) && (u = !0), !o && !l && !u) {
    var g = this.value;
    (this.eatContextual("get") || this.eatContextual("set")) && (this.isClassElementNameStart() ? f = g : o = g);
  }
  if (o ? (a.computed = !1, a.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc), a.key.name = o, this.finishNode(a.key, "Identifier")) : this.parseClassElementName(a), t < 13 || this.type === types$1.parenL || f !== "method" || u || l) {
    var d = !a.static && checkKeyName(a, "constructor"), b = d && e;
    d && f !== "method" && this.raise(a.key.start, "Constructor can't have get/set modifier"), a.kind = d ? "constructor" : f, this.parseClassMethod(a, u, l, b);
  } else
    this.parseClassField(a);
  return a;
};
pp$8.isClassElementNameStart = function() {
  return this.type === types$1.name || this.type === types$1.privateId || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword;
};
pp$8.parseClassElementName = function(e) {
  this.type === types$1.privateId ? (this.value === "constructor" && this.raise(this.start, "Classes can't have an element named '#constructor'"), e.computed = !1, e.key = this.parsePrivateIdent()) : this.parsePropertyName(e);
};
pp$8.parseClassMethod = function(e, t, a, o) {
  var u = e.key;
  e.kind === "constructor" ? (t && this.raise(u.start, "Constructor can't be a generator"), a && this.raise(u.start, "Constructor can't be an async method")) : e.static && checkKeyName(e, "prototype") && this.raise(u.start, "Classes may not have a static property named prototype");
  var l = e.value = this.parseMethod(t, a, o);
  return e.kind === "get" && l.params.length !== 0 && this.raiseRecoverable(l.start, "getter should have no params"), e.kind === "set" && l.params.length !== 1 && this.raiseRecoverable(l.start, "setter should have exactly one param"), e.kind === "set" && l.params[0].type === "RestElement" && this.raiseRecoverable(l.params[0].start, "Setter cannot use rest params"), this.finishNode(e, "MethodDefinition");
};
pp$8.parseClassField = function(e) {
  if (checkKeyName(e, "constructor") ? this.raise(e.key.start, "Classes can't have a field named 'constructor'") : e.static && checkKeyName(e, "prototype") && this.raise(e.key.start, "Classes can't have a static field named 'prototype'"), this.eat(types$1.eq)) {
    var t = this.currentThisScope(), a = t.inClassFieldInit;
    t.inClassFieldInit = !0, e.value = this.parseMaybeAssign(), t.inClassFieldInit = a;
  } else
    e.value = null;
  return this.semicolon(), this.finishNode(e, "PropertyDefinition");
};
pp$8.parseClassStaticBlock = function(e) {
  e.body = [];
  var t = this.labels;
  for (this.labels = [], this.enterScope(SCOPE_CLASS_STATIC_BLOCK | SCOPE_SUPER); this.type !== types$1.braceR; ) {
    var a = this.parseStatement(null);
    e.body.push(a);
  }
  return this.next(), this.exitScope(), this.labels = t, this.finishNode(e, "StaticBlock");
};
pp$8.parseClassId = function(e, t) {
  this.type === types$1.name ? (e.id = this.parseIdent(), t && this.checkLValSimple(e.id, BIND_LEXICAL, !1)) : (t === !0 && this.unexpected(), e.id = null);
};
pp$8.parseClassSuper = function(e) {
  e.superClass = this.eat(types$1._extends) ? this.parseExprSubscripts(null, !1) : null;
};
pp$8.enterClassBody = function() {
  var e = { declared: /* @__PURE__ */ Object.create(null), used: [] };
  return this.privateNameStack.push(e), e.declared;
};
pp$8.exitClassBody = function() {
  var e = this.privateNameStack.pop(), t = e.declared, a = e.used;
  if (this.options.checkPrivateFields)
    for (var o = this.privateNameStack.length, u = o === 0 ? null : this.privateNameStack[o - 1], l = 0; l < a.length; ++l) {
      var f = a[l];
      hasOwn(t, f.name) || (u ? u.used.push(f) : this.raiseRecoverable(f.start, "Private field '#" + f.name + "' must be declared in an enclosing class"));
    }
};
function isPrivateNameConflicted(e, t) {
  var a = t.key.name, o = e[a], u = "true";
  return t.type === "MethodDefinition" && (t.kind === "get" || t.kind === "set") && (u = (t.static ? "s" : "i") + t.kind), o === "iget" && u === "iset" || o === "iset" && u === "iget" || o === "sget" && u === "sset" || o === "sset" && u === "sget" ? (e[a] = "true", !1) : o ? !0 : (e[a] = u, !1);
}
function checkKeyName(e, t) {
  var a = e.computed, o = e.key;
  return !a && (o.type === "Identifier" && o.name === t || o.type === "Literal" && o.value === t);
}
pp$8.parseExportAllDeclaration = function(e, t) {
  return this.options.ecmaVersion >= 11 && (this.eatContextual("as") ? (e.exported = this.parseModuleExportName(), this.checkExport(t, e.exported, this.lastTokStart)) : e.exported = null), this.expectContextual("from"), this.type !== types$1.string && this.unexpected(), e.source = this.parseExprAtom(), this.options.ecmaVersion >= 16 && (e.attributes = this.parseWithClause()), this.semicolon(), this.finishNode(e, "ExportAllDeclaration");
};
pp$8.parseExport = function(e, t) {
  if (this.next(), this.eat(types$1.star))
    return this.parseExportAllDeclaration(e, t);
  if (this.eat(types$1._default))
    return this.checkExport(t, "default", this.lastTokStart), e.declaration = this.parseExportDefaultDeclaration(), this.finishNode(e, "ExportDefaultDeclaration");
  if (this.shouldParseExportStatement())
    e.declaration = this.parseExportDeclaration(e), e.declaration.type === "VariableDeclaration" ? this.checkVariableExport(t, e.declaration.declarations) : this.checkExport(t, e.declaration.id, e.declaration.id.start), e.specifiers = [], e.source = null;
  else {
    if (e.declaration = null, e.specifiers = this.parseExportSpecifiers(t), this.eatContextual("from"))
      this.type !== types$1.string && this.unexpected(), e.source = this.parseExprAtom(), this.options.ecmaVersion >= 16 && (e.attributes = this.parseWithClause());
    else {
      for (var a = 0, o = e.specifiers; a < o.length; a += 1) {
        var u = o[a];
        this.checkUnreserved(u.local), this.checkLocalExport(u.local), u.local.type === "Literal" && this.raise(u.local.start, "A string literal cannot be used as an exported binding without `from`.");
      }
      e.source = null;
    }
    this.semicolon();
  }
  return this.finishNode(e, "ExportNamedDeclaration");
};
pp$8.parseExportDeclaration = function(e) {
  return this.parseStatement(null);
};
pp$8.parseExportDefaultDeclaration = function() {
  var e;
  if (this.type === types$1._function || (e = this.isAsyncFunction())) {
    var t = this.startNode();
    return this.next(), e && this.next(), this.parseFunction(t, FUNC_STATEMENT | FUNC_NULLABLE_ID, !1, e);
  } else if (this.type === types$1._class) {
    var a = this.startNode();
    return this.parseClass(a, "nullableID");
  } else {
    var o = this.parseMaybeAssign();
    return this.semicolon(), o;
  }
};
pp$8.checkExport = function(e, t, a) {
  e && (typeof t != "string" && (t = t.type === "Identifier" ? t.name : t.value), hasOwn(e, t) && this.raiseRecoverable(a, "Duplicate export '" + t + "'"), e[t] = !0);
};
pp$8.checkPatternExport = function(e, t) {
  var a = t.type;
  if (a === "Identifier")
    this.checkExport(e, t, t.start);
  else if (a === "ObjectPattern")
    for (var o = 0, u = t.properties; o < u.length; o += 1) {
      var l = u[o];
      this.checkPatternExport(e, l);
    }
  else if (a === "ArrayPattern")
    for (var f = 0, p = t.elements; f < p.length; f += 1) {
      var g = p[f];
      g && this.checkPatternExport(e, g);
    }
  else a === "Property" ? this.checkPatternExport(e, t.value) : a === "AssignmentPattern" ? this.checkPatternExport(e, t.left) : a === "RestElement" && this.checkPatternExport(e, t.argument);
};
pp$8.checkVariableExport = function(e, t) {
  if (e)
    for (var a = 0, o = t; a < o.length; a += 1) {
      var u = o[a];
      this.checkPatternExport(e, u.id);
    }
};
pp$8.shouldParseExportStatement = function() {
  return this.type.keyword === "var" || this.type.keyword === "const" || this.type.keyword === "class" || this.type.keyword === "function" || this.isLet() || this.isAsyncFunction();
};
pp$8.parseExportSpecifier = function(e) {
  var t = this.startNode();
  return t.local = this.parseModuleExportName(), t.exported = this.eatContextual("as") ? this.parseModuleExportName() : t.local, this.checkExport(
    e,
    t.exported,
    t.exported.start
  ), this.finishNode(t, "ExportSpecifier");
};
pp$8.parseExportSpecifiers = function(e) {
  var t = [], a = !0;
  for (this.expect(types$1.braceL); !this.eat(types$1.braceR); ) {
    if (a)
      a = !1;
    else if (this.expect(types$1.comma), this.afterTrailingComma(types$1.braceR))
      break;
    t.push(this.parseExportSpecifier(e));
  }
  return t;
};
pp$8.parseImport = function(e) {
  return this.next(), this.type === types$1.string ? (e.specifiers = empty$1, e.source = this.parseExprAtom()) : (e.specifiers = this.parseImportSpecifiers(), this.expectContextual("from"), e.source = this.type === types$1.string ? this.parseExprAtom() : this.unexpected()), this.options.ecmaVersion >= 16 && (e.attributes = this.parseWithClause()), this.semicolon(), this.finishNode(e, "ImportDeclaration");
};
pp$8.parseImportSpecifier = function() {
  var e = this.startNode();
  return e.imported = this.parseModuleExportName(), this.eatContextual("as") ? e.local = this.parseIdent() : (this.checkUnreserved(e.imported), e.local = e.imported), this.checkLValSimple(e.local, BIND_LEXICAL), this.finishNode(e, "ImportSpecifier");
};
pp$8.parseImportDefaultSpecifier = function() {
  var e = this.startNode();
  return e.local = this.parseIdent(), this.checkLValSimple(e.local, BIND_LEXICAL), this.finishNode(e, "ImportDefaultSpecifier");
};
pp$8.parseImportNamespaceSpecifier = function() {
  var e = this.startNode();
  return this.next(), this.expectContextual("as"), e.local = this.parseIdent(), this.checkLValSimple(e.local, BIND_LEXICAL), this.finishNode(e, "ImportNamespaceSpecifier");
};
pp$8.parseImportSpecifiers = function() {
  var e = [], t = !0;
  if (this.type === types$1.name && (e.push(this.parseImportDefaultSpecifier()), !this.eat(types$1.comma)))
    return e;
  if (this.type === types$1.star)
    return e.push(this.parseImportNamespaceSpecifier()), e;
  for (this.expect(types$1.braceL); !this.eat(types$1.braceR); ) {
    if (t)
      t = !1;
    else if (this.expect(types$1.comma), this.afterTrailingComma(types$1.braceR))
      break;
    e.push(this.parseImportSpecifier());
  }
  return e;
};
pp$8.parseWithClause = function() {
  var e = [];
  if (!this.eat(types$1._with))
    return e;
  this.expect(types$1.braceL);
  for (var t = {}, a = !0; !this.eat(types$1.braceR); ) {
    if (a)
      a = !1;
    else if (this.expect(types$1.comma), this.afterTrailingComma(types$1.braceR))
      break;
    var o = this.parseImportAttribute(), u = o.key.type === "Identifier" ? o.key.name : o.key.value;
    hasOwn(t, u) && this.raiseRecoverable(o.key.start, "Duplicate attribute key '" + u + "'"), t[u] = !0, e.push(o);
  }
  return e;
};
pp$8.parseImportAttribute = function() {
  var e = this.startNode();
  return e.key = this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never"), this.expect(types$1.colon), this.type !== types$1.string && this.unexpected(), e.value = this.parseExprAtom(), this.finishNode(e, "ImportAttribute");
};
pp$8.parseModuleExportName = function() {
  if (this.options.ecmaVersion >= 13 && this.type === types$1.string) {
    var e = this.parseLiteral(this.value);
    return loneSurrogate.test(e.value) && this.raise(e.start, "An export name cannot include a lone surrogate."), e;
  }
  return this.parseIdent(!0);
};
pp$8.adaptDirectivePrologue = function(e) {
  for (var t = 0; t < e.length && this.isDirectiveCandidate(e[t]); ++t)
    e[t].directive = e[t].expression.raw.slice(1, -1);
};
pp$8.isDirectiveCandidate = function(e) {
  return this.options.ecmaVersion >= 5 && e.type === "ExpressionStatement" && e.expression.type === "Literal" && typeof e.expression.value == "string" && // Reject parenthesized strings.
  (this.input[e.start] === '"' || this.input[e.start] === "'");
};
var pp$7 = Parser.prototype;
pp$7.toAssignable = function(e, t, a) {
  if (this.options.ecmaVersion >= 6 && e)
    switch (e.type) {
      case "Identifier":
        this.inAsync && e.name === "await" && this.raise(e.start, "Cannot use 'await' as identifier inside an async function");
        break;
      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
        break;
      case "ObjectExpression":
        e.type = "ObjectPattern", a && this.checkPatternErrors(a, !0);
        for (var o = 0, u = e.properties; o < u.length; o += 1) {
          var l = u[o];
          this.toAssignable(l, t), l.type === "RestElement" && (l.argument.type === "ArrayPattern" || l.argument.type === "ObjectPattern") && this.raise(l.argument.start, "Unexpected token");
        }
        break;
      case "Property":
        e.kind !== "init" && this.raise(e.key.start, "Object pattern can't contain getter or setter"), this.toAssignable(e.value, t);
        break;
      case "ArrayExpression":
        e.type = "ArrayPattern", a && this.checkPatternErrors(a, !0), this.toAssignableList(e.elements, t);
        break;
      case "SpreadElement":
        e.type = "RestElement", this.toAssignable(e.argument, t), e.argument.type === "AssignmentPattern" && this.raise(e.argument.start, "Rest elements cannot have a default value");
        break;
      case "AssignmentExpression":
        e.operator !== "=" && this.raise(e.left.end, "Only '=' operator can be used for specifying default value."), e.type = "AssignmentPattern", delete e.operator, this.toAssignable(e.left, t);
        break;
      case "ParenthesizedExpression":
        this.toAssignable(e.expression, t, a);
        break;
      case "ChainExpression":
        this.raiseRecoverable(e.start, "Optional chaining cannot appear in left-hand side");
        break;
      case "MemberExpression":
        if (!t)
          break;
      default:
        this.raise(e.start, "Assigning to rvalue");
    }
  else a && this.checkPatternErrors(a, !0);
  return e;
};
pp$7.toAssignableList = function(e, t) {
  for (var a = e.length, o = 0; o < a; o++) {
    var u = e[o];
    u && this.toAssignable(u, t);
  }
  if (a) {
    var l = e[a - 1];
    this.options.ecmaVersion === 6 && t && l && l.type === "RestElement" && l.argument.type !== "Identifier" && this.unexpected(l.argument.start);
  }
  return e;
};
pp$7.parseSpread = function(e) {
  var t = this.startNode();
  return this.next(), t.argument = this.parseMaybeAssign(!1, e), this.finishNode(t, "SpreadElement");
};
pp$7.parseRestBinding = function() {
  var e = this.startNode();
  return this.next(), this.options.ecmaVersion === 6 && this.type !== types$1.name && this.unexpected(), e.argument = this.parseBindingAtom(), this.finishNode(e, "RestElement");
};
pp$7.parseBindingAtom = function() {
  if (this.options.ecmaVersion >= 6)
    switch (this.type) {
      case types$1.bracketL:
        var e = this.startNode();
        return this.next(), e.elements = this.parseBindingList(types$1.bracketR, !0, !0), this.finishNode(e, "ArrayPattern");
      case types$1.braceL:
        return this.parseObj(!0);
    }
  return this.parseIdent();
};
pp$7.parseBindingList = function(e, t, a, o) {
  for (var u = [], l = !0; !this.eat(e); )
    if (l ? l = !1 : this.expect(types$1.comma), t && this.type === types$1.comma)
      u.push(null);
    else {
      if (a && this.afterTrailingComma(e))
        break;
      if (this.type === types$1.ellipsis) {
        var f = this.parseRestBinding();
        this.parseBindingListItem(f), u.push(f), this.type === types$1.comma && this.raiseRecoverable(this.start, "Comma is not permitted after the rest element"), this.expect(e);
        break;
      } else
        u.push(this.parseAssignableListItem(o));
    }
  return u;
};
pp$7.parseAssignableListItem = function(e) {
  var t = this.parseMaybeDefault(this.start, this.startLoc);
  return this.parseBindingListItem(t), t;
};
pp$7.parseBindingListItem = function(e) {
  return e;
};
pp$7.parseMaybeDefault = function(e, t, a) {
  if (a = a || this.parseBindingAtom(), this.options.ecmaVersion < 6 || !this.eat(types$1.eq))
    return a;
  var o = this.startNodeAt(e, t);
  return o.left = a, o.right = this.parseMaybeAssign(), this.finishNode(o, "AssignmentPattern");
};
pp$7.checkLValSimple = function(e, t, a) {
  t === void 0 && (t = BIND_NONE);
  var o = t !== BIND_NONE;
  switch (e.type) {
    case "Identifier":
      this.strict && this.reservedWordsStrictBind.test(e.name) && this.raiseRecoverable(e.start, (o ? "Binding " : "Assigning to ") + e.name + " in strict mode"), o && (t === BIND_LEXICAL && e.name === "let" && this.raiseRecoverable(e.start, "let is disallowed as a lexically bound name"), a && (hasOwn(a, e.name) && this.raiseRecoverable(e.start, "Argument name clash"), a[e.name] = !0), t !== BIND_OUTSIDE && this.declareName(e.name, t, e.start));
      break;
    case "ChainExpression":
      this.raiseRecoverable(e.start, "Optional chaining cannot appear in left-hand side");
      break;
    case "MemberExpression":
      o && this.raiseRecoverable(e.start, "Binding member expression");
      break;
    case "ParenthesizedExpression":
      return o && this.raiseRecoverable(e.start, "Binding parenthesized expression"), this.checkLValSimple(e.expression, t, a);
    default:
      this.raise(e.start, (o ? "Binding" : "Assigning to") + " rvalue");
  }
};
pp$7.checkLValPattern = function(e, t, a) {
  switch (t === void 0 && (t = BIND_NONE), e.type) {
    case "ObjectPattern":
      for (var o = 0, u = e.properties; o < u.length; o += 1) {
        var l = u[o];
        this.checkLValInnerPattern(l, t, a);
      }
      break;
    case "ArrayPattern":
      for (var f = 0, p = e.elements; f < p.length; f += 1) {
        var g = p[f];
        g && this.checkLValInnerPattern(g, t, a);
      }
      break;
    default:
      this.checkLValSimple(e, t, a);
  }
};
pp$7.checkLValInnerPattern = function(e, t, a) {
  switch (t === void 0 && (t = BIND_NONE), e.type) {
    case "Property":
      this.checkLValInnerPattern(e.value, t, a);
      break;
    case "AssignmentPattern":
      this.checkLValPattern(e.left, t, a);
      break;
    case "RestElement":
      this.checkLValPattern(e.argument, t, a);
      break;
    default:
      this.checkLValPattern(e, t, a);
  }
};
var TokContext = function e(t, a, o, u, l) {
  this.token = t, this.isExpr = !!a, this.preserveSpace = !!o, this.override = u, this.generator = !!l;
}, types = {
  b_stat: new TokContext("{", !1),
  b_expr: new TokContext("{", !0),
  b_tmpl: new TokContext("${", !1),
  p_stat: new TokContext("(", !1),
  p_expr: new TokContext("(", !0),
  q_tmpl: new TokContext("`", !0, !0, function(e) {
    return e.tryReadTemplateToken();
  }),
  f_stat: new TokContext("function", !1),
  f_expr: new TokContext("function", !0),
  f_expr_gen: new TokContext("function", !0, !1, null, !0),
  f_gen: new TokContext("function", !1, !1, null, !0)
}, pp$6 = Parser.prototype;
pp$6.initialContext = function() {
  return [types.b_stat];
};
pp$6.curContext = function() {
  return this.context[this.context.length - 1];
};
pp$6.braceIsBlock = function(e) {
  var t = this.curContext();
  return t === types.f_expr || t === types.f_stat ? !0 : e === types$1.colon && (t === types.b_stat || t === types.b_expr) ? !t.isExpr : e === types$1._return || e === types$1.name && this.exprAllowed ? lineBreak.test(this.input.slice(this.lastTokEnd, this.start)) : e === types$1._else || e === types$1.semi || e === types$1.eof || e === types$1.parenR || e === types$1.arrow ? !0 : e === types$1.braceL ? t === types.b_stat : e === types$1._var || e === types$1._const || e === types$1.name ? !1 : !this.exprAllowed;
};
pp$6.inGeneratorContext = function() {
  for (var e = this.context.length - 1; e >= 1; e--) {
    var t = this.context[e];
    if (t.token === "function")
      return t.generator;
  }
  return !1;
};
pp$6.updateContext = function(e) {
  var t, a = this.type;
  a.keyword && e === types$1.dot ? this.exprAllowed = !1 : (t = a.updateContext) ? t.call(this, e) : this.exprAllowed = a.beforeExpr;
};
pp$6.overrideContext = function(e) {
  this.curContext() !== e && (this.context[this.context.length - 1] = e);
};
types$1.parenR.updateContext = types$1.braceR.updateContext = function() {
  if (this.context.length === 1) {
    this.exprAllowed = !0;
    return;
  }
  var e = this.context.pop();
  e === types.b_stat && this.curContext().token === "function" && (e = this.context.pop()), this.exprAllowed = !e.isExpr;
};
types$1.braceL.updateContext = function(e) {
  this.context.push(this.braceIsBlock(e) ? types.b_stat : types.b_expr), this.exprAllowed = !0;
};
types$1.dollarBraceL.updateContext = function() {
  this.context.push(types.b_tmpl), this.exprAllowed = !0;
};
types$1.parenL.updateContext = function(e) {
  var t = e === types$1._if || e === types$1._for || e === types$1._with || e === types$1._while;
  this.context.push(t ? types.p_stat : types.p_expr), this.exprAllowed = !0;
};
types$1.incDec.updateContext = function() {
};
types$1._function.updateContext = types$1._class.updateContext = function(e) {
  e.beforeExpr && e !== types$1._else && !(e === types$1.semi && this.curContext() !== types.p_stat) && !(e === types$1._return && lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) && !((e === types$1.colon || e === types$1.braceL) && this.curContext() === types.b_stat) ? this.context.push(types.f_expr) : this.context.push(types.f_stat), this.exprAllowed = !1;
};
types$1.colon.updateContext = function() {
  this.curContext().token === "function" && this.context.pop(), this.exprAllowed = !0;
};
types$1.backQuote.updateContext = function() {
  this.curContext() === types.q_tmpl ? this.context.pop() : this.context.push(types.q_tmpl), this.exprAllowed = !1;
};
types$1.star.updateContext = function(e) {
  if (e === types$1._function) {
    var t = this.context.length - 1;
    this.context[t] === types.f_expr ? this.context[t] = types.f_expr_gen : this.context[t] = types.f_gen;
  }
  this.exprAllowed = !0;
};
types$1.name.updateContext = function(e) {
  var t = !1;
  this.options.ecmaVersion >= 6 && e !== types$1.dot && (this.value === "of" && !this.exprAllowed || this.value === "yield" && this.inGeneratorContext()) && (t = !0), this.exprAllowed = t;
};
var pp$5 = Parser.prototype;
pp$5.checkPropClash = function(e, t, a) {
  if (!(this.options.ecmaVersion >= 9 && e.type === "SpreadElement") && !(this.options.ecmaVersion >= 6 && (e.computed || e.method || e.shorthand))) {
    var o = e.key, u;
    switch (o.type) {
      case "Identifier":
        u = o.name;
        break;
      case "Literal":
        u = String(o.value);
        break;
      default:
        return;
    }
    var l = e.kind;
    if (this.options.ecmaVersion >= 6) {
      u === "__proto__" && l === "init" && (t.proto && (a ? a.doubleProto < 0 && (a.doubleProto = o.start) : this.raiseRecoverable(o.start, "Redefinition of __proto__ property")), t.proto = !0);
      return;
    }
    u = "$" + u;
    var f = t[u];
    if (f) {
      var p;
      l === "init" ? p = this.strict && f.init || f.get || f.set : p = f.init || f[l], p && this.raiseRecoverable(o.start, "Redefinition of property");
    } else
      f = t[u] = {
        init: !1,
        get: !1,
        set: !1
      };
    f[l] = !0;
  }
};
pp$5.parseExpression = function(e, t) {
  var a = this.start, o = this.startLoc, u = this.parseMaybeAssign(e, t);
  if (this.type === types$1.comma) {
    var l = this.startNodeAt(a, o);
    for (l.expressions = [u]; this.eat(types$1.comma); )
      l.expressions.push(this.parseMaybeAssign(e, t));
    return this.finishNode(l, "SequenceExpression");
  }
  return u;
};
pp$5.parseMaybeAssign = function(e, t, a) {
  if (this.isContextual("yield")) {
    if (this.inGenerator)
      return this.parseYield(e);
    this.exprAllowed = !1;
  }
  var o = !1, u = -1, l = -1, f = -1;
  t ? (u = t.parenthesizedAssign, l = t.trailingComma, f = t.doubleProto, t.parenthesizedAssign = t.trailingComma = -1) : (t = new DestructuringErrors(), o = !0);
  var p = this.start, g = this.startLoc;
  (this.type === types$1.parenL || this.type === types$1.name) && (this.potentialArrowAt = this.start, this.potentialArrowInForAwait = e === "await");
  var d = this.parseMaybeConditional(e, t);
  if (a && (d = a.call(this, d, p, g)), this.type.isAssign) {
    var b = this.startNodeAt(p, g);
    return b.operator = this.value, this.type === types$1.eq && (d = this.toAssignable(d, !1, t)), o || (t.parenthesizedAssign = t.trailingComma = t.doubleProto = -1), t.shorthandAssign >= d.start && (t.shorthandAssign = -1), this.type === types$1.eq ? this.checkLValPattern(d) : this.checkLValSimple(d), b.left = d, this.next(), b.right = this.parseMaybeAssign(e), f > -1 && (t.doubleProto = f), this.finishNode(b, "AssignmentExpression");
  } else
    o && this.checkExpressionErrors(t, !0);
  return u > -1 && (t.parenthesizedAssign = u), l > -1 && (t.trailingComma = l), d;
};
pp$5.parseMaybeConditional = function(e, t) {
  var a = this.start, o = this.startLoc, u = this.parseExprOps(e, t);
  if (this.checkExpressionErrors(t))
    return u;
  if (this.eat(types$1.question)) {
    var l = this.startNodeAt(a, o);
    return l.test = u, l.consequent = this.parseMaybeAssign(), this.expect(types$1.colon), l.alternate = this.parseMaybeAssign(e), this.finishNode(l, "ConditionalExpression");
  }
  return u;
};
pp$5.parseExprOps = function(e, t) {
  var a = this.start, o = this.startLoc, u = this.parseMaybeUnary(t, !1, !1, e);
  return this.checkExpressionErrors(t) || u.start === a && u.type === "ArrowFunctionExpression" ? u : this.parseExprOp(u, a, o, -1, e);
};
pp$5.parseExprOp = function(e, t, a, o, u) {
  var l = this.type.binop;
  if (l != null && (!u || this.type !== types$1._in) && l > o) {
    var f = this.type === types$1.logicalOR || this.type === types$1.logicalAND, p = this.type === types$1.coalesce;
    p && (l = types$1.logicalAND.binop);
    var g = this.value;
    this.next();
    var d = this.start, b = this.startLoc, F = this.parseExprOp(this.parseMaybeUnary(null, !1, !1, u), d, b, l, u), E = this.buildBinary(t, a, e, F, g, f || p);
    return (f && this.type === types$1.coalesce || p && (this.type === types$1.logicalOR || this.type === types$1.logicalAND)) && this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses"), this.parseExprOp(E, t, a, o, u);
  }
  return e;
};
pp$5.buildBinary = function(e, t, a, o, u, l) {
  o.type === "PrivateIdentifier" && this.raise(o.start, "Private identifier can only be left side of binary expression");
  var f = this.startNodeAt(e, t);
  return f.left = a, f.operator = u, f.right = o, this.finishNode(f, l ? "LogicalExpression" : "BinaryExpression");
};
pp$5.parseMaybeUnary = function(e, t, a, o) {
  var u = this.start, l = this.startLoc, f;
  if (this.isContextual("await") && this.canAwait)
    f = this.parseAwait(o), t = !0;
  else if (this.type.prefix) {
    var p = this.startNode(), g = this.type === types$1.incDec;
    p.operator = this.value, p.prefix = !0, this.next(), p.argument = this.parseMaybeUnary(null, !0, g, o), this.checkExpressionErrors(e, !0), g ? this.checkLValSimple(p.argument) : this.strict && p.operator === "delete" && isLocalVariableAccess(p.argument) ? this.raiseRecoverable(p.start, "Deleting local variable in strict mode") : p.operator === "delete" && isPrivateFieldAccess(p.argument) ? this.raiseRecoverable(p.start, "Private fields can not be deleted") : t = !0, f = this.finishNode(p, g ? "UpdateExpression" : "UnaryExpression");
  } else if (!t && this.type === types$1.privateId)
    (o || this.privateNameStack.length === 0) && this.options.checkPrivateFields && this.unexpected(), f = this.parsePrivateIdent(), this.type !== types$1._in && this.unexpected();
  else {
    if (f = this.parseExprSubscripts(e, o), this.checkExpressionErrors(e))
      return f;
    for (; this.type.postfix && !this.canInsertSemicolon(); ) {
      var d = this.startNodeAt(u, l);
      d.operator = this.value, d.prefix = !1, d.argument = f, this.checkLValSimple(f), this.next(), f = this.finishNode(d, "UpdateExpression");
    }
  }
  if (!a && this.eat(types$1.starstar))
    if (t)
      this.unexpected(this.lastTokStart);
    else
      return this.buildBinary(u, l, f, this.parseMaybeUnary(null, !1, !1, o), "**", !1);
  else
    return f;
};
function isLocalVariableAccess(e) {
  return e.type === "Identifier" || e.type === "ParenthesizedExpression" && isLocalVariableAccess(e.expression);
}
function isPrivateFieldAccess(e) {
  return e.type === "MemberExpression" && e.property.type === "PrivateIdentifier" || e.type === "ChainExpression" && isPrivateFieldAccess(e.expression) || e.type === "ParenthesizedExpression" && isPrivateFieldAccess(e.expression);
}
pp$5.parseExprSubscripts = function(e, t) {
  var a = this.start, o = this.startLoc, u = this.parseExprAtom(e, t);
  if (u.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")")
    return u;
  var l = this.parseSubscripts(u, a, o, !1, t);
  return e && l.type === "MemberExpression" && (e.parenthesizedAssign >= l.start && (e.parenthesizedAssign = -1), e.parenthesizedBind >= l.start && (e.parenthesizedBind = -1), e.trailingComma >= l.start && (e.trailingComma = -1)), l;
};
pp$5.parseSubscripts = function(e, t, a, o, u) {
  for (var l = this.options.ecmaVersion >= 8 && e.type === "Identifier" && e.name === "async" && this.lastTokEnd === e.end && !this.canInsertSemicolon() && e.end - e.start === 5 && this.potentialArrowAt === e.start, f = !1; ; ) {
    var p = this.parseSubscript(e, t, a, o, l, f, u);
    if (p.optional && (f = !0), p === e || p.type === "ArrowFunctionExpression") {
      if (f) {
        var g = this.startNodeAt(t, a);
        g.expression = p, p = this.finishNode(g, "ChainExpression");
      }
      return p;
    }
    e = p;
  }
};
pp$5.shouldParseAsyncArrow = function() {
  return !this.canInsertSemicolon() && this.eat(types$1.arrow);
};
pp$5.parseSubscriptAsyncArrow = function(e, t, a, o) {
  return this.parseArrowExpression(this.startNodeAt(e, t), a, !0, o);
};
pp$5.parseSubscript = function(e, t, a, o, u, l, f) {
  var p = this.options.ecmaVersion >= 11, g = p && this.eat(types$1.questionDot);
  o && g && this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
  var d = this.eat(types$1.bracketL);
  if (d || g && this.type !== types$1.parenL && this.type !== types$1.backQuote || this.eat(types$1.dot)) {
    var b = this.startNodeAt(t, a);
    b.object = e, d ? (b.property = this.parseExpression(), this.expect(types$1.bracketR)) : this.type === types$1.privateId && e.type !== "Super" ? b.property = this.parsePrivateIdent() : b.property = this.parseIdent(this.options.allowReserved !== "never"), b.computed = !!d, p && (b.optional = g), e = this.finishNode(b, "MemberExpression");
  } else if (!o && this.eat(types$1.parenL)) {
    var F = new DestructuringErrors(), E = this.yieldPos, S = this.awaitPos, R = this.awaitIdentPos;
    this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0;
    var k = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, !1, F);
    if (u && !g && this.shouldParseAsyncArrow())
      return this.checkPatternErrors(F, !1), this.checkYieldAwaitInDefaultParams(), this.awaitIdentPos > 0 && this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function"), this.yieldPos = E, this.awaitPos = S, this.awaitIdentPos = R, this.parseSubscriptAsyncArrow(t, a, k, f);
    this.checkExpressionErrors(F, !0), this.yieldPos = E || this.yieldPos, this.awaitPos = S || this.awaitPos, this.awaitIdentPos = R || this.awaitIdentPos;
    var I = this.startNodeAt(t, a);
    I.callee = e, I.arguments = k, p && (I.optional = g), e = this.finishNode(I, "CallExpression");
  } else if (this.type === types$1.backQuote) {
    (g || l) && this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
    var V = this.startNodeAt(t, a);
    V.tag = e, V.quasi = this.parseTemplate({ isTagged: !0 }), e = this.finishNode(V, "TaggedTemplateExpression");
  }
  return e;
};
pp$5.parseExprAtom = function(e, t, a) {
  this.type === types$1.slash && this.readRegexp();
  var o, u = this.potentialArrowAt === this.start;
  switch (this.type) {
    case types$1._super:
      return this.allowSuper || this.raise(this.start, "'super' keyword outside a method"), o = this.startNode(), this.next(), this.type === types$1.parenL && !this.allowDirectSuper && this.raise(o.start, "super() call outside constructor of a subclass"), this.type !== types$1.dot && this.type !== types$1.bracketL && this.type !== types$1.parenL && this.unexpected(), this.finishNode(o, "Super");
    case types$1._this:
      return o = this.startNode(), this.next(), this.finishNode(o, "ThisExpression");
    case types$1.name:
      var l = this.start, f = this.startLoc, p = this.containsEsc, g = this.parseIdent(!1);
      if (this.options.ecmaVersion >= 8 && !p && g.name === "async" && !this.canInsertSemicolon() && this.eat(types$1._function))
        return this.overrideContext(types.f_expr), this.parseFunction(this.startNodeAt(l, f), 0, !1, !0, t);
      if (u && !this.canInsertSemicolon()) {
        if (this.eat(types$1.arrow))
          return this.parseArrowExpression(this.startNodeAt(l, f), [g], !1, t);
        if (this.options.ecmaVersion >= 8 && g.name === "async" && this.type === types$1.name && !p && (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc))
          return g = this.parseIdent(!1), (this.canInsertSemicolon() || !this.eat(types$1.arrow)) && this.unexpected(), this.parseArrowExpression(this.startNodeAt(l, f), [g], !0, t);
      }
      return g;
    case types$1.regexp:
      var d = this.value;
      return o = this.parseLiteral(d.value), o.regex = { pattern: d.pattern, flags: d.flags }, o;
    case types$1.num:
    case types$1.string:
      return this.parseLiteral(this.value);
    case types$1._null:
    case types$1._true:
    case types$1._false:
      return o = this.startNode(), o.value = this.type === types$1._null ? null : this.type === types$1._true, o.raw = this.type.keyword, this.next(), this.finishNode(o, "Literal");
    case types$1.parenL:
      var b = this.start, F = this.parseParenAndDistinguishExpression(u, t);
      return e && (e.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(F) && (e.parenthesizedAssign = b), e.parenthesizedBind < 0 && (e.parenthesizedBind = b)), F;
    case types$1.bracketL:
      return o = this.startNode(), this.next(), o.elements = this.parseExprList(types$1.bracketR, !0, !0, e), this.finishNode(o, "ArrayExpression");
    case types$1.braceL:
      return this.overrideContext(types.b_expr), this.parseObj(!1, e);
    case types$1._function:
      return o = this.startNode(), this.next(), this.parseFunction(o, 0);
    case types$1._class:
      return this.parseClass(this.startNode(), !1);
    case types$1._new:
      return this.parseNew();
    case types$1.backQuote:
      return this.parseTemplate();
    case types$1._import:
      return this.options.ecmaVersion >= 11 ? this.parseExprImport(a) : this.unexpected();
    default:
      return this.parseExprAtomDefault();
  }
};
pp$5.parseExprAtomDefault = function() {
  this.unexpected();
};
pp$5.parseExprImport = function(e) {
  var t = this.startNode();
  if (this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword import"), this.next(), this.type === types$1.parenL && !e)
    return this.parseDynamicImport(t);
  if (this.type === types$1.dot) {
    var a = this.startNodeAt(t.start, t.loc && t.loc.start);
    return a.name = "import", t.meta = this.finishNode(a, "Identifier"), this.parseImportMeta(t);
  } else
    this.unexpected();
};
pp$5.parseDynamicImport = function(e) {
  if (this.next(), e.source = this.parseMaybeAssign(), this.options.ecmaVersion >= 16)
    this.eat(types$1.parenR) ? e.options = null : (this.expect(types$1.comma), this.afterTrailingComma(types$1.parenR) ? e.options = null : (e.options = this.parseMaybeAssign(), this.eat(types$1.parenR) || (this.expect(types$1.comma), this.afterTrailingComma(types$1.parenR) || this.unexpected())));
  else if (!this.eat(types$1.parenR)) {
    var t = this.start;
    this.eat(types$1.comma) && this.eat(types$1.parenR) ? this.raiseRecoverable(t, "Trailing comma is not allowed in import()") : this.unexpected(t);
  }
  return this.finishNode(e, "ImportExpression");
};
pp$5.parseImportMeta = function(e) {
  this.next();
  var t = this.containsEsc;
  return e.property = this.parseIdent(!0), e.property.name !== "meta" && this.raiseRecoverable(e.property.start, "The only valid meta property for import is 'import.meta'"), t && this.raiseRecoverable(e.start, "'import.meta' must not contain escaped characters"), this.options.sourceType !== "module" && !this.options.allowImportExportEverywhere && this.raiseRecoverable(e.start, "Cannot use 'import.meta' outside a module"), this.finishNode(e, "MetaProperty");
};
pp$5.parseLiteral = function(e) {
  var t = this.startNode();
  return t.value = e, t.raw = this.input.slice(this.start, this.end), t.raw.charCodeAt(t.raw.length - 1) === 110 && (t.bigint = t.raw.slice(0, -1).replace(/_/g, "")), this.next(), this.finishNode(t, "Literal");
};
pp$5.parseParenExpression = function() {
  this.expect(types$1.parenL);
  var e = this.parseExpression();
  return this.expect(types$1.parenR), e;
};
pp$5.shouldParseArrow = function(e) {
  return !this.canInsertSemicolon();
};
pp$5.parseParenAndDistinguishExpression = function(e, t) {
  var a = this.start, o = this.startLoc, u, l = this.options.ecmaVersion >= 8;
  if (this.options.ecmaVersion >= 6) {
    this.next();
    var f = this.start, p = this.startLoc, g = [], d = !0, b = !1, F = new DestructuringErrors(), E = this.yieldPos, S = this.awaitPos, R;
    for (this.yieldPos = 0, this.awaitPos = 0; this.type !== types$1.parenR; )
      if (d ? d = !1 : this.expect(types$1.comma), l && this.afterTrailingComma(types$1.parenR, !0)) {
        b = !0;
        break;
      } else if (this.type === types$1.ellipsis) {
        R = this.start, g.push(this.parseParenItem(this.parseRestBinding())), this.type === types$1.comma && this.raiseRecoverable(
          this.start,
          "Comma is not permitted after the rest element"
        );
        break;
      } else
        g.push(this.parseMaybeAssign(!1, F, this.parseParenItem));
    var k = this.lastTokEnd, I = this.lastTokEndLoc;
    if (this.expect(types$1.parenR), e && this.shouldParseArrow(g) && this.eat(types$1.arrow))
      return this.checkPatternErrors(F, !1), this.checkYieldAwaitInDefaultParams(), this.yieldPos = E, this.awaitPos = S, this.parseParenArrowList(a, o, g, t);
    (!g.length || b) && this.unexpected(this.lastTokStart), R && this.unexpected(R), this.checkExpressionErrors(F, !0), this.yieldPos = E || this.yieldPos, this.awaitPos = S || this.awaitPos, g.length > 1 ? (u = this.startNodeAt(f, p), u.expressions = g, this.finishNodeAt(u, "SequenceExpression", k, I)) : u = g[0];
  } else
    u = this.parseParenExpression();
  if (this.options.preserveParens) {
    var V = this.startNodeAt(a, o);
    return V.expression = u, this.finishNode(V, "ParenthesizedExpression");
  } else
    return u;
};
pp$5.parseParenItem = function(e) {
  return e;
};
pp$5.parseParenArrowList = function(e, t, a, o) {
  return this.parseArrowExpression(this.startNodeAt(e, t), a, !1, o);
};
var empty = [];
pp$5.parseNew = function() {
  this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword new");
  var e = this.startNode();
  if (this.next(), this.options.ecmaVersion >= 6 && this.type === types$1.dot) {
    var t = this.startNodeAt(e.start, e.loc && e.loc.start);
    t.name = "new", e.meta = this.finishNode(t, "Identifier"), this.next();
    var a = this.containsEsc;
    return e.property = this.parseIdent(!0), e.property.name !== "target" && this.raiseRecoverable(e.property.start, "The only valid meta property for new is 'new.target'"), a && this.raiseRecoverable(e.start, "'new.target' must not contain escaped characters"), this.allowNewDotTarget || this.raiseRecoverable(e.start, "'new.target' can only be used in functions and class static block"), this.finishNode(e, "MetaProperty");
  }
  var o = this.start, u = this.startLoc;
  return e.callee = this.parseSubscripts(this.parseExprAtom(null, !1, !0), o, u, !0, !1), this.eat(types$1.parenL) ? e.arguments = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, !1) : e.arguments = empty, this.finishNode(e, "NewExpression");
};
pp$5.parseTemplateElement = function(e) {
  var t = e.isTagged, a = this.startNode();
  return this.type === types$1.invalidTemplate ? (t || this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal"), a.value = {
    raw: this.value.replace(/\r\n?/g, `
`),
    cooked: null
  }) : a.value = {
    raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, `
`),
    cooked: this.value
  }, this.next(), a.tail = this.type === types$1.backQuote, this.finishNode(a, "TemplateElement");
};
pp$5.parseTemplate = function(e) {
  e === void 0 && (e = {});
  var t = e.isTagged;
  t === void 0 && (t = !1);
  var a = this.startNode();
  this.next(), a.expressions = [];
  var o = this.parseTemplateElement({ isTagged: t });
  for (a.quasis = [o]; !o.tail; )
    this.type === types$1.eof && this.raise(this.pos, "Unterminated template literal"), this.expect(types$1.dollarBraceL), a.expressions.push(this.parseExpression()), this.expect(types$1.braceR), a.quasis.push(o = this.parseTemplateElement({ isTagged: t }));
  return this.next(), this.finishNode(a, "TemplateLiteral");
};
pp$5.isAsyncProp = function(e) {
  return !e.computed && e.key.type === "Identifier" && e.key.name === "async" && (this.type === types$1.name || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === types$1.star) && !lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
};
pp$5.parseObj = function(e, t) {
  var a = this.startNode(), o = !0, u = {};
  for (a.properties = [], this.next(); !this.eat(types$1.braceR); ) {
    if (o)
      o = !1;
    else if (this.expect(types$1.comma), this.options.ecmaVersion >= 5 && this.afterTrailingComma(types$1.braceR))
      break;
    var l = this.parseProperty(e, t);
    e || this.checkPropClash(l, u, t), a.properties.push(l);
  }
  return this.finishNode(a, e ? "ObjectPattern" : "ObjectExpression");
};
pp$5.parseProperty = function(e, t) {
  var a = this.startNode(), o, u, l, f;
  if (this.options.ecmaVersion >= 9 && this.eat(types$1.ellipsis))
    return e ? (a.argument = this.parseIdent(!1), this.type === types$1.comma && this.raiseRecoverable(this.start, "Comma is not permitted after the rest element"), this.finishNode(a, "RestElement")) : (a.argument = this.parseMaybeAssign(!1, t), this.type === types$1.comma && t && t.trailingComma < 0 && (t.trailingComma = this.start), this.finishNode(a, "SpreadElement"));
  this.options.ecmaVersion >= 6 && (a.method = !1, a.shorthand = !1, (e || t) && (l = this.start, f = this.startLoc), e || (o = this.eat(types$1.star)));
  var p = this.containsEsc;
  return this.parsePropertyName(a), !e && !p && this.options.ecmaVersion >= 8 && !o && this.isAsyncProp(a) ? (u = !0, o = this.options.ecmaVersion >= 9 && this.eat(types$1.star), this.parsePropertyName(a)) : u = !1, this.parsePropertyValue(a, e, o, u, l, f, t, p), this.finishNode(a, "Property");
};
pp$5.parseGetterSetter = function(e) {
  e.kind = e.key.name, this.parsePropertyName(e), e.value = this.parseMethod(!1);
  var t = e.kind === "get" ? 0 : 1;
  if (e.value.params.length !== t) {
    var a = e.value.start;
    e.kind === "get" ? this.raiseRecoverable(a, "getter should have no params") : this.raiseRecoverable(a, "setter should have exactly one param");
  } else
    e.kind === "set" && e.value.params[0].type === "RestElement" && this.raiseRecoverable(e.value.params[0].start, "Setter cannot use rest params");
};
pp$5.parsePropertyValue = function(e, t, a, o, u, l, f, p) {
  (a || o) && this.type === types$1.colon && this.unexpected(), this.eat(types$1.colon) ? (e.value = t ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(!1, f), e.kind = "init") : this.options.ecmaVersion >= 6 && this.type === types$1.parenL ? (t && this.unexpected(), e.kind = "init", e.method = !0, e.value = this.parseMethod(a, o)) : !t && !p && this.options.ecmaVersion >= 5 && !e.computed && e.key.type === "Identifier" && (e.key.name === "get" || e.key.name === "set") && this.type !== types$1.comma && this.type !== types$1.braceR && this.type !== types$1.eq ? ((a || o) && this.unexpected(), this.parseGetterSetter(e)) : this.options.ecmaVersion >= 6 && !e.computed && e.key.type === "Identifier" ? ((a || o) && this.unexpected(), this.checkUnreserved(e.key), e.key.name === "await" && !this.awaitIdentPos && (this.awaitIdentPos = u), e.kind = "init", t ? e.value = this.parseMaybeDefault(u, l, this.copyNode(e.key)) : this.type === types$1.eq && f ? (f.shorthandAssign < 0 && (f.shorthandAssign = this.start), e.value = this.parseMaybeDefault(u, l, this.copyNode(e.key))) : e.value = this.copyNode(e.key), e.shorthand = !0) : this.unexpected();
};
pp$5.parsePropertyName = function(e) {
  if (this.options.ecmaVersion >= 6) {
    if (this.eat(types$1.bracketL))
      return e.computed = !0, e.key = this.parseMaybeAssign(), this.expect(types$1.bracketR), e.key;
    e.computed = !1;
  }
  return e.key = this.type === types$1.num || this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
};
pp$5.initFunction = function(e) {
  e.id = null, this.options.ecmaVersion >= 6 && (e.generator = e.expression = !1), this.options.ecmaVersion >= 8 && (e.async = !1);
};
pp$5.parseMethod = function(e, t, a) {
  var o = this.startNode(), u = this.yieldPos, l = this.awaitPos, f = this.awaitIdentPos;
  return this.initFunction(o), this.options.ecmaVersion >= 6 && (o.generator = e), this.options.ecmaVersion >= 8 && (o.async = !!t), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(functionFlags(t, o.generator) | SCOPE_SUPER | (a ? SCOPE_DIRECT_SUPER : 0)), this.expect(types$1.parenL), o.params = this.parseBindingList(types$1.parenR, !1, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams(), this.parseFunctionBody(o, !1, !0, !1), this.yieldPos = u, this.awaitPos = l, this.awaitIdentPos = f, this.finishNode(o, "FunctionExpression");
};
pp$5.parseArrowExpression = function(e, t, a, o) {
  var u = this.yieldPos, l = this.awaitPos, f = this.awaitIdentPos;
  return this.enterScope(functionFlags(a, !1) | SCOPE_ARROW), this.initFunction(e), this.options.ecmaVersion >= 8 && (e.async = !!a), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, e.params = this.toAssignableList(t, !0), this.parseFunctionBody(e, !0, !1, o), this.yieldPos = u, this.awaitPos = l, this.awaitIdentPos = f, this.finishNode(e, "ArrowFunctionExpression");
};
pp$5.parseFunctionBody = function(e, t, a, o) {
  var u = t && this.type !== types$1.braceL, l = this.strict, f = !1;
  if (u)
    e.body = this.parseMaybeAssign(o), e.expression = !0, this.checkParams(e, !1);
  else {
    var p = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(e.params);
    (!l || p) && (f = this.strictDirective(this.end), f && p && this.raiseRecoverable(e.start, "Illegal 'use strict' directive in function with non-simple parameter list"));
    var g = this.labels;
    this.labels = [], f && (this.strict = !0), this.checkParams(e, !l && !f && !t && !a && this.isSimpleParamList(e.params)), this.strict && e.id && this.checkLValSimple(e.id, BIND_OUTSIDE), e.body = this.parseBlock(!1, void 0, f && !l), e.expression = !1, this.adaptDirectivePrologue(e.body.body), this.labels = g;
  }
  this.exitScope();
};
pp$5.isSimpleParamList = function(e) {
  for (var t = 0, a = e; t < a.length; t += 1) {
    var o = a[t];
    if (o.type !== "Identifier")
      return !1;
  }
  return !0;
};
pp$5.checkParams = function(e, t) {
  for (var a = /* @__PURE__ */ Object.create(null), o = 0, u = e.params; o < u.length; o += 1) {
    var l = u[o];
    this.checkLValInnerPattern(l, BIND_VAR, t ? null : a);
  }
};
pp$5.parseExprList = function(e, t, a, o) {
  for (var u = [], l = !0; !this.eat(e); ) {
    if (l)
      l = !1;
    else if (this.expect(types$1.comma), t && this.afterTrailingComma(e))
      break;
    var f = void 0;
    a && this.type === types$1.comma ? f = null : this.type === types$1.ellipsis ? (f = this.parseSpread(o), o && this.type === types$1.comma && o.trailingComma < 0 && (o.trailingComma = this.start)) : f = this.parseMaybeAssign(!1, o), u.push(f);
  }
  return u;
};
pp$5.checkUnreserved = function(e) {
  var t = e.start, a = e.end, o = e.name;
  if (this.inGenerator && o === "yield" && this.raiseRecoverable(t, "Cannot use 'yield' as identifier inside a generator"), this.inAsync && o === "await" && this.raiseRecoverable(t, "Cannot use 'await' as identifier inside an async function"), this.currentThisScope().inClassFieldInit && o === "arguments" && this.raiseRecoverable(t, "Cannot use 'arguments' in class field initializer"), this.inClassStaticBlock && (o === "arguments" || o === "await") && this.raise(t, "Cannot use " + o + " in class static initialization block"), this.keywords.test(o) && this.raise(t, "Unexpected keyword '" + o + "'"), !(this.options.ecmaVersion < 6 && this.input.slice(t, a).indexOf("\\") !== -1)) {
    var u = this.strict ? this.reservedWordsStrict : this.reservedWords;
    u.test(o) && (!this.inAsync && o === "await" && this.raiseRecoverable(t, "Cannot use keyword 'await' outside an async function"), this.raiseRecoverable(t, "The keyword '" + o + "' is reserved"));
  }
};
pp$5.parseIdent = function(e) {
  var t = this.parseIdentNode();
  return this.next(!!e), this.finishNode(t, "Identifier"), e || (this.checkUnreserved(t), t.name === "await" && !this.awaitIdentPos && (this.awaitIdentPos = t.start)), t;
};
pp$5.parseIdentNode = function() {
  var e = this.startNode();
  return this.type === types$1.name ? e.name = this.value : this.type.keyword ? (e.name = this.type.keyword, (e.name === "class" || e.name === "function") && (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46) && this.context.pop(), this.type = types$1.name) : this.unexpected(), e;
};
pp$5.parsePrivateIdent = function() {
  var e = this.startNode();
  return this.type === types$1.privateId ? e.name = this.value : this.unexpected(), this.next(), this.finishNode(e, "PrivateIdentifier"), this.options.checkPrivateFields && (this.privateNameStack.length === 0 ? this.raise(e.start, "Private field '#" + e.name + "' must be declared in an enclosing class") : this.privateNameStack[this.privateNameStack.length - 1].used.push(e)), e;
};
pp$5.parseYield = function(e) {
  this.yieldPos || (this.yieldPos = this.start);
  var t = this.startNode();
  return this.next(), this.type === types$1.semi || this.canInsertSemicolon() || this.type !== types$1.star && !this.type.startsExpr ? (t.delegate = !1, t.argument = null) : (t.delegate = this.eat(types$1.star), t.argument = this.parseMaybeAssign(e)), this.finishNode(t, "YieldExpression");
};
pp$5.parseAwait = function(e) {
  this.awaitPos || (this.awaitPos = this.start);
  var t = this.startNode();
  return this.next(), t.argument = this.parseMaybeUnary(null, !0, !1, e), this.finishNode(t, "AwaitExpression");
};
var pp$4 = Parser.prototype;
pp$4.raise = function(e, t) {
  var a = getLineInfo(this.input, e);
  t += " (" + a.line + ":" + a.column + ")";
  var o = new SyntaxError(t);
  throw o.pos = e, o.loc = a, o.raisedAt = this.pos, o;
};
pp$4.raiseRecoverable = pp$4.raise;
pp$4.curPosition = function() {
  if (this.options.locations)
    return new Position(this.curLine, this.pos - this.lineStart);
};
var pp$3 = Parser.prototype, Scope = function e(t) {
  this.flags = t, this.var = [], this.lexical = [], this.functions = [], this.inClassFieldInit = !1;
};
pp$3.enterScope = function(e) {
  this.scopeStack.push(new Scope(e));
};
pp$3.exitScope = function() {
  this.scopeStack.pop();
};
pp$3.treatFunctionsAsVarInScope = function(e) {
  return e.flags & SCOPE_FUNCTION || !this.inModule && e.flags & SCOPE_TOP;
};
pp$3.declareName = function(e, t, a) {
  var o = !1;
  if (t === BIND_LEXICAL) {
    var u = this.currentScope();
    o = u.lexical.indexOf(e) > -1 || u.functions.indexOf(e) > -1 || u.var.indexOf(e) > -1, u.lexical.push(e), this.inModule && u.flags & SCOPE_TOP && delete this.undefinedExports[e];
  } else if (t === BIND_SIMPLE_CATCH) {
    var l = this.currentScope();
    l.lexical.push(e);
  } else if (t === BIND_FUNCTION) {
    var f = this.currentScope();
    this.treatFunctionsAsVar ? o = f.lexical.indexOf(e) > -1 : o = f.lexical.indexOf(e) > -1 || f.var.indexOf(e) > -1, f.functions.push(e);
  } else
    for (var p = this.scopeStack.length - 1; p >= 0; --p) {
      var g = this.scopeStack[p];
      if (g.lexical.indexOf(e) > -1 && !(g.flags & SCOPE_SIMPLE_CATCH && g.lexical[0] === e) || !this.treatFunctionsAsVarInScope(g) && g.functions.indexOf(e) > -1) {
        o = !0;
        break;
      }
      if (g.var.push(e), this.inModule && g.flags & SCOPE_TOP && delete this.undefinedExports[e], g.flags & SCOPE_VAR)
        break;
    }
  o && this.raiseRecoverable(a, "Identifier '" + e + "' has already been declared");
};
pp$3.checkLocalExport = function(e) {
  this.scopeStack[0].lexical.indexOf(e.name) === -1 && this.scopeStack[0].var.indexOf(e.name) === -1 && (this.undefinedExports[e.name] = e);
};
pp$3.currentScope = function() {
  return this.scopeStack[this.scopeStack.length - 1];
};
pp$3.currentVarScope = function() {
  for (var e = this.scopeStack.length - 1; ; e--) {
    var t = this.scopeStack[e];
    if (t.flags & SCOPE_VAR)
      return t;
  }
};
pp$3.currentThisScope = function() {
  for (var e = this.scopeStack.length - 1; ; e--) {
    var t = this.scopeStack[e];
    if (t.flags & SCOPE_VAR && !(t.flags & SCOPE_ARROW))
      return t;
  }
};
var Node = function e(t, a, o) {
  this.type = "", this.start = a, this.end = 0, t.options.locations && (this.loc = new SourceLocation(t, o)), t.options.directSourceFile && (this.sourceFile = t.options.directSourceFile), t.options.ranges && (this.range = [a, 0]);
}, pp$2 = Parser.prototype;
pp$2.startNode = function() {
  return new Node(this, this.start, this.startLoc);
};
pp$2.startNodeAt = function(e, t) {
  return new Node(this, e, t);
};
function finishNodeAt(e, t, a, o) {
  return e.type = t, e.end = a, this.options.locations && (e.loc.end = o), this.options.ranges && (e.range[1] = a), e;
}
pp$2.finishNode = function(e, t) {
  return finishNodeAt.call(this, e, t, this.lastTokEnd, this.lastTokEndLoc);
};
pp$2.finishNodeAt = function(e, t, a, o) {
  return finishNodeAt.call(this, e, t, a, o);
};
pp$2.copyNode = function(e) {
  var t = new Node(this, e.start, this.startLoc);
  for (var a in e)
    t[a] = e[a];
  return t;
};
var scriptValuesAddedInUnicode = "Gara Garay Gukh Gurung_Khema Hrkt Katakana_Or_Hiragana Kawi Kirat_Rai Krai Nag_Mundari Nagm Ol_Onal Onao Sunu Sunuwar Todhri Todr Tulu_Tigalari Tutg Unknown Zzzz", ecma9BinaryProperties = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS", ecma10BinaryProperties = ecma9BinaryProperties + " Extended_Pictographic", ecma11BinaryProperties = ecma10BinaryProperties, ecma12BinaryProperties = ecma11BinaryProperties + " EBase EComp EMod EPres ExtPict", ecma13BinaryProperties = ecma12BinaryProperties, ecma14BinaryProperties = ecma13BinaryProperties, unicodeBinaryProperties = {
  9: ecma9BinaryProperties,
  10: ecma10BinaryProperties,
  11: ecma11BinaryProperties,
  12: ecma12BinaryProperties,
  13: ecma13BinaryProperties,
  14: ecma14BinaryProperties
}, ecma14BinaryPropertiesOfStrings = "Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji", unicodeBinaryPropertiesOfStrings = {
  9: "",
  10: "",
  11: "",
  12: "",
  13: "",
  14: ecma14BinaryPropertiesOfStrings
}, unicodeGeneralCategoryValues = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu", ecma9ScriptValues = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb", ecma10ScriptValues = ecma9ScriptValues + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd", ecma11ScriptValues = ecma10ScriptValues + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho", ecma12ScriptValues = ecma11ScriptValues + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi", ecma13ScriptValues = ecma12ScriptValues + " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith", ecma14ScriptValues = ecma13ScriptValues + " " + scriptValuesAddedInUnicode, unicodeScriptValues = {
  9: ecma9ScriptValues,
  10: ecma10ScriptValues,
  11: ecma11ScriptValues,
  12: ecma12ScriptValues,
  13: ecma13ScriptValues,
  14: ecma14ScriptValues
}, data = {};
function buildUnicodeData(e) {
  var t = data[e] = {
    binary: wordsRegexp(unicodeBinaryProperties[e] + " " + unicodeGeneralCategoryValues),
    binaryOfStrings: wordsRegexp(unicodeBinaryPropertiesOfStrings[e]),
    nonBinary: {
      General_Category: wordsRegexp(unicodeGeneralCategoryValues),
      Script: wordsRegexp(unicodeScriptValues[e])
    }
  };
  t.nonBinary.Script_Extensions = t.nonBinary.Script, t.nonBinary.gc = t.nonBinary.General_Category, t.nonBinary.sc = t.nonBinary.Script, t.nonBinary.scx = t.nonBinary.Script_Extensions;
}
for (var i = 0, list = [9, 10, 11, 12, 13, 14]; i < list.length; i += 1) {
  var ecmaVersion = list[i];
  buildUnicodeData(ecmaVersion);
}
var pp$1 = Parser.prototype, BranchID = function e(t, a) {
  this.parent = t, this.base = a || this;
};
BranchID.prototype.separatedFrom = function e(t) {
  for (var a = this; a; a = a.parent)
    for (var o = t; o; o = o.parent)
      if (a.base === o.base && a !== o)
        return !0;
  return !1;
};
BranchID.prototype.sibling = function e() {
  return new BranchID(this.parent, this.base);
};
var RegExpValidationState = function e(t) {
  this.parser = t, this.validFlags = "gim" + (t.options.ecmaVersion >= 6 ? "uy" : "") + (t.options.ecmaVersion >= 9 ? "s" : "") + (t.options.ecmaVersion >= 13 ? "d" : "") + (t.options.ecmaVersion >= 15 ? "v" : ""), this.unicodeProperties = data[t.options.ecmaVersion >= 14 ? 14 : t.options.ecmaVersion], this.source = "", this.flags = "", this.start = 0, this.switchU = !1, this.switchV = !1, this.switchN = !1, this.pos = 0, this.lastIntValue = 0, this.lastStringValue = "", this.lastAssertionIsQuantifiable = !1, this.numCapturingParens = 0, this.maxBackReference = 0, this.groupNames = /* @__PURE__ */ Object.create(null), this.backReferenceNames = [], this.branchID = null;
};
RegExpValidationState.prototype.reset = function e(t, a, o) {
  var u = o.indexOf("v") !== -1, l = o.indexOf("u") !== -1;
  this.start = t | 0, this.source = a + "", this.flags = o, u && this.parser.options.ecmaVersion >= 15 ? (this.switchU = !0, this.switchV = !0, this.switchN = !0) : (this.switchU = l && this.parser.options.ecmaVersion >= 6, this.switchV = !1, this.switchN = l && this.parser.options.ecmaVersion >= 9);
};
RegExpValidationState.prototype.raise = function e(t) {
  this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + t);
};
RegExpValidationState.prototype.at = function e(t, a) {
  a === void 0 && (a = !1);
  var o = this.source, u = o.length;
  if (t >= u)
    return -1;
  var l = o.charCodeAt(t);
  if (!(a || this.switchU) || l <= 55295 || l >= 57344 || t + 1 >= u)
    return l;
  var f = o.charCodeAt(t + 1);
  return f >= 56320 && f <= 57343 ? (l << 10) + f - 56613888 : l;
};
RegExpValidationState.prototype.nextIndex = function e(t, a) {
  a === void 0 && (a = !1);
  var o = this.source, u = o.length;
  if (t >= u)
    return u;
  var l = o.charCodeAt(t), f;
  return !(a || this.switchU) || l <= 55295 || l >= 57344 || t + 1 >= u || (f = o.charCodeAt(t + 1)) < 56320 || f > 57343 ? t + 1 : t + 2;
};
RegExpValidationState.prototype.current = function e(t) {
  return t === void 0 && (t = !1), this.at(this.pos, t);
};
RegExpValidationState.prototype.lookahead = function e(t) {
  return t === void 0 && (t = !1), this.at(this.nextIndex(this.pos, t), t);
};
RegExpValidationState.prototype.advance = function e(t) {
  t === void 0 && (t = !1), this.pos = this.nextIndex(this.pos, t);
};
RegExpValidationState.prototype.eat = function e(t, a) {
  return a === void 0 && (a = !1), this.current(a) === t ? (this.advance(a), !0) : !1;
};
RegExpValidationState.prototype.eatChars = function e(t, a) {
  a === void 0 && (a = !1);
  for (var o = this.pos, u = 0, l = t; u < l.length; u += 1) {
    var f = l[u], p = this.at(o, a);
    if (p === -1 || p !== f)
      return !1;
    o = this.nextIndex(o, a);
  }
  return this.pos = o, !0;
};
pp$1.validateRegExpFlags = function(e) {
  for (var t = e.validFlags, a = e.flags, o = !1, u = !1, l = 0; l < a.length; l++) {
    var f = a.charAt(l);
    t.indexOf(f) === -1 && this.raise(e.start, "Invalid regular expression flag"), a.indexOf(f, l + 1) > -1 && this.raise(e.start, "Duplicate regular expression flag"), f === "u" && (o = !0), f === "v" && (u = !0);
  }
  this.options.ecmaVersion >= 15 && o && u && this.raise(e.start, "Invalid regular expression flag");
};
function hasProp(e) {
  for (var t in e)
    return !0;
  return !1;
}
pp$1.validateRegExpPattern = function(e) {
  this.regexp_pattern(e), !e.switchN && this.options.ecmaVersion >= 9 && hasProp(e.groupNames) && (e.switchN = !0, this.regexp_pattern(e));
};
pp$1.regexp_pattern = function(e) {
  e.pos = 0, e.lastIntValue = 0, e.lastStringValue = "", e.lastAssertionIsQuantifiable = !1, e.numCapturingParens = 0, e.maxBackReference = 0, e.groupNames = /* @__PURE__ */ Object.create(null), e.backReferenceNames.length = 0, e.branchID = null, this.regexp_disjunction(e), e.pos !== e.source.length && (e.eat(
    41
    /* ) */
  ) && e.raise("Unmatched ')'"), (e.eat(
    93
    /* ] */
  ) || e.eat(
    125
    /* } */
  )) && e.raise("Lone quantifier brackets")), e.maxBackReference > e.numCapturingParens && e.raise("Invalid escape");
  for (var t = 0, a = e.backReferenceNames; t < a.length; t += 1) {
    var o = a[t];
    e.groupNames[o] || e.raise("Invalid named capture referenced");
  }
};
pp$1.regexp_disjunction = function(e) {
  var t = this.options.ecmaVersion >= 16;
  for (t && (e.branchID = new BranchID(e.branchID, null)), this.regexp_alternative(e); e.eat(
    124
    /* | */
  ); )
    t && (e.branchID = e.branchID.sibling()), this.regexp_alternative(e);
  t && (e.branchID = e.branchID.parent), this.regexp_eatQuantifier(e, !0) && e.raise("Nothing to repeat"), e.eat(
    123
    /* { */
  ) && e.raise("Lone quantifier brackets");
};
pp$1.regexp_alternative = function(e) {
  for (; e.pos < e.source.length && this.regexp_eatTerm(e); )
    ;
};
pp$1.regexp_eatTerm = function(e) {
  return this.regexp_eatAssertion(e) ? (e.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(e) && e.switchU && e.raise("Invalid quantifier"), !0) : (e.switchU ? this.regexp_eatAtom(e) : this.regexp_eatExtendedAtom(e)) ? (this.regexp_eatQuantifier(e), !0) : !1;
};
pp$1.regexp_eatAssertion = function(e) {
  var t = e.pos;
  if (e.lastAssertionIsQuantifiable = !1, e.eat(
    94
    /* ^ */
  ) || e.eat(
    36
    /* $ */
  ))
    return !0;
  if (e.eat(
    92
    /* \ */
  )) {
    if (e.eat(
      66
      /* B */
    ) || e.eat(
      98
      /* b */
    ))
      return !0;
    e.pos = t;
  }
  if (e.eat(
    40
    /* ( */
  ) && e.eat(
    63
    /* ? */
  )) {
    var a = !1;
    if (this.options.ecmaVersion >= 9 && (a = e.eat(
      60
      /* < */
    )), e.eat(
      61
      /* = */
    ) || e.eat(
      33
      /* ! */
    ))
      return this.regexp_disjunction(e), e.eat(
        41
        /* ) */
      ) || e.raise("Unterminated group"), e.lastAssertionIsQuantifiable = !a, !0;
  }
  return e.pos = t, !1;
};
pp$1.regexp_eatQuantifier = function(e, t) {
  return t === void 0 && (t = !1), this.regexp_eatQuantifierPrefix(e, t) ? (e.eat(
    63
    /* ? */
  ), !0) : !1;
};
pp$1.regexp_eatQuantifierPrefix = function(e, t) {
  return e.eat(
    42
    /* * */
  ) || e.eat(
    43
    /* + */
  ) || e.eat(
    63
    /* ? */
  ) || this.regexp_eatBracedQuantifier(e, t);
};
pp$1.regexp_eatBracedQuantifier = function(e, t) {
  var a = e.pos;
  if (e.eat(
    123
    /* { */
  )) {
    var o = 0, u = -1;
    if (this.regexp_eatDecimalDigits(e) && (o = e.lastIntValue, e.eat(
      44
      /* , */
    ) && this.regexp_eatDecimalDigits(e) && (u = e.lastIntValue), e.eat(
      125
      /* } */
    )))
      return u !== -1 && u < o && !t && e.raise("numbers out of order in {} quantifier"), !0;
    e.switchU && !t && e.raise("Incomplete quantifier"), e.pos = a;
  }
  return !1;
};
pp$1.regexp_eatAtom = function(e) {
  return this.regexp_eatPatternCharacters(e) || e.eat(
    46
    /* . */
  ) || this.regexp_eatReverseSolidusAtomEscape(e) || this.regexp_eatCharacterClass(e) || this.regexp_eatUncapturingGroup(e) || this.regexp_eatCapturingGroup(e);
};
pp$1.regexp_eatReverseSolidusAtomEscape = function(e) {
  var t = e.pos;
  if (e.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatAtomEscape(e))
      return !0;
    e.pos = t;
  }
  return !1;
};
pp$1.regexp_eatUncapturingGroup = function(e) {
  var t = e.pos;
  if (e.eat(
    40
    /* ( */
  )) {
    if (e.eat(
      63
      /* ? */
    )) {
      if (this.options.ecmaVersion >= 16) {
        var a = this.regexp_eatModifiers(e), o = e.eat(
          45
          /* - */
        );
        if (a || o) {
          for (var u = 0; u < a.length; u++) {
            var l = a.charAt(u);
            a.indexOf(l, u + 1) > -1 && e.raise("Duplicate regular expression modifiers");
          }
          if (o) {
            var f = this.regexp_eatModifiers(e);
            !a && !f && e.current() === 58 && e.raise("Invalid regular expression modifiers");
            for (var p = 0; p < f.length; p++) {
              var g = f.charAt(p);
              (f.indexOf(g, p + 1) > -1 || a.indexOf(g) > -1) && e.raise("Duplicate regular expression modifiers");
            }
          }
        }
      }
      if (e.eat(
        58
        /* : */
      )) {
        if (this.regexp_disjunction(e), e.eat(
          41
          /* ) */
        ))
          return !0;
        e.raise("Unterminated group");
      }
    }
    e.pos = t;
  }
  return !1;
};
pp$1.regexp_eatCapturingGroup = function(e) {
  if (e.eat(
    40
    /* ( */
  )) {
    if (this.options.ecmaVersion >= 9 ? this.regexp_groupSpecifier(e) : e.current() === 63 && e.raise("Invalid group"), this.regexp_disjunction(e), e.eat(
      41
      /* ) */
    ))
      return e.numCapturingParens += 1, !0;
    e.raise("Unterminated group");
  }
  return !1;
};
pp$1.regexp_eatModifiers = function(e) {
  for (var t = "", a = 0; (a = e.current()) !== -1 && isRegularExpressionModifier(a); )
    t += codePointToString(a), e.advance();
  return t;
};
function isRegularExpressionModifier(e) {
  return e === 105 || e === 109 || e === 115;
}
pp$1.regexp_eatExtendedAtom = function(e) {
  return e.eat(
    46
    /* . */
  ) || this.regexp_eatReverseSolidusAtomEscape(e) || this.regexp_eatCharacterClass(e) || this.regexp_eatUncapturingGroup(e) || this.regexp_eatCapturingGroup(e) || this.regexp_eatInvalidBracedQuantifier(e) || this.regexp_eatExtendedPatternCharacter(e);
};
pp$1.regexp_eatInvalidBracedQuantifier = function(e) {
  return this.regexp_eatBracedQuantifier(e, !0) && e.raise("Nothing to repeat"), !1;
};
pp$1.regexp_eatSyntaxCharacter = function(e) {
  var t = e.current();
  return isSyntaxCharacter(t) ? (e.lastIntValue = t, e.advance(), !0) : !1;
};
function isSyntaxCharacter(e) {
  return e === 36 || e >= 40 && e <= 43 || e === 46 || e === 63 || e >= 91 && e <= 94 || e >= 123 && e <= 125;
}
pp$1.regexp_eatPatternCharacters = function(e) {
  for (var t = e.pos, a = 0; (a = e.current()) !== -1 && !isSyntaxCharacter(a); )
    e.advance();
  return e.pos !== t;
};
pp$1.regexp_eatExtendedPatternCharacter = function(e) {
  var t = e.current();
  return t !== -1 && t !== 36 && !(t >= 40 && t <= 43) && t !== 46 && t !== 63 && t !== 91 && t !== 94 && t !== 124 ? (e.advance(), !0) : !1;
};
pp$1.regexp_groupSpecifier = function(e) {
  if (e.eat(
    63
    /* ? */
  )) {
    this.regexp_eatGroupName(e) || e.raise("Invalid group");
    var t = this.options.ecmaVersion >= 16, a = e.groupNames[e.lastStringValue];
    if (a)
      if (t)
        for (var o = 0, u = a; o < u.length; o += 1) {
          var l = u[o];
          l.separatedFrom(e.branchID) || e.raise("Duplicate capture group name");
        }
      else
        e.raise("Duplicate capture group name");
    t ? (a || (e.groupNames[e.lastStringValue] = [])).push(e.branchID) : e.groupNames[e.lastStringValue] = !0;
  }
};
pp$1.regexp_eatGroupName = function(e) {
  if (e.lastStringValue = "", e.eat(
    60
    /* < */
  )) {
    if (this.regexp_eatRegExpIdentifierName(e) && e.eat(
      62
      /* > */
    ))
      return !0;
    e.raise("Invalid capture group name");
  }
  return !1;
};
pp$1.regexp_eatRegExpIdentifierName = function(e) {
  if (e.lastStringValue = "", this.regexp_eatRegExpIdentifierStart(e)) {
    for (e.lastStringValue += codePointToString(e.lastIntValue); this.regexp_eatRegExpIdentifierPart(e); )
      e.lastStringValue += codePointToString(e.lastIntValue);
    return !0;
  }
  return !1;
};
pp$1.regexp_eatRegExpIdentifierStart = function(e) {
  var t = e.pos, a = this.options.ecmaVersion >= 11, o = e.current(a);
  return e.advance(a), o === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(e, a) && (o = e.lastIntValue), isRegExpIdentifierStart(o) ? (e.lastIntValue = o, !0) : (e.pos = t, !1);
};
function isRegExpIdentifierStart(e) {
  return isIdentifierStart(e, !0) || e === 36 || e === 95;
}
pp$1.regexp_eatRegExpIdentifierPart = function(e) {
  var t = e.pos, a = this.options.ecmaVersion >= 11, o = e.current(a);
  return e.advance(a), o === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(e, a) && (o = e.lastIntValue), isRegExpIdentifierPart(o) ? (e.lastIntValue = o, !0) : (e.pos = t, !1);
};
function isRegExpIdentifierPart(e) {
  return isIdentifierChar(e, !0) || e === 36 || e === 95 || e === 8204 || e === 8205;
}
pp$1.regexp_eatAtomEscape = function(e) {
  return this.regexp_eatBackReference(e) || this.regexp_eatCharacterClassEscape(e) || this.regexp_eatCharacterEscape(e) || e.switchN && this.regexp_eatKGroupName(e) ? !0 : (e.switchU && (e.current() === 99 && e.raise("Invalid unicode escape"), e.raise("Invalid escape")), !1);
};
pp$1.regexp_eatBackReference = function(e) {
  var t = e.pos;
  if (this.regexp_eatDecimalEscape(e)) {
    var a = e.lastIntValue;
    if (e.switchU)
      return a > e.maxBackReference && (e.maxBackReference = a), !0;
    if (a <= e.numCapturingParens)
      return !0;
    e.pos = t;
  }
  return !1;
};
pp$1.regexp_eatKGroupName = function(e) {
  if (e.eat(
    107
    /* k */
  )) {
    if (this.regexp_eatGroupName(e))
      return e.backReferenceNames.push(e.lastStringValue), !0;
    e.raise("Invalid named reference");
  }
  return !1;
};
pp$1.regexp_eatCharacterEscape = function(e) {
  return this.regexp_eatControlEscape(e) || this.regexp_eatCControlLetter(e) || this.regexp_eatZero(e) || this.regexp_eatHexEscapeSequence(e) || this.regexp_eatRegExpUnicodeEscapeSequence(e, !1) || !e.switchU && this.regexp_eatLegacyOctalEscapeSequence(e) || this.regexp_eatIdentityEscape(e);
};
pp$1.regexp_eatCControlLetter = function(e) {
  var t = e.pos;
  if (e.eat(
    99
    /* c */
  )) {
    if (this.regexp_eatControlLetter(e))
      return !0;
    e.pos = t;
  }
  return !1;
};
pp$1.regexp_eatZero = function(e) {
  return e.current() === 48 && !isDecimalDigit(e.lookahead()) ? (e.lastIntValue = 0, e.advance(), !0) : !1;
};
pp$1.regexp_eatControlEscape = function(e) {
  var t = e.current();
  return t === 116 ? (e.lastIntValue = 9, e.advance(), !0) : t === 110 ? (e.lastIntValue = 10, e.advance(), !0) : t === 118 ? (e.lastIntValue = 11, e.advance(), !0) : t === 102 ? (e.lastIntValue = 12, e.advance(), !0) : t === 114 ? (e.lastIntValue = 13, e.advance(), !0) : !1;
};
pp$1.regexp_eatControlLetter = function(e) {
  var t = e.current();
  return isControlLetter(t) ? (e.lastIntValue = t % 32, e.advance(), !0) : !1;
};
function isControlLetter(e) {
  return e >= 65 && e <= 90 || e >= 97 && e <= 122;
}
pp$1.regexp_eatRegExpUnicodeEscapeSequence = function(e, t) {
  t === void 0 && (t = !1);
  var a = e.pos, o = t || e.switchU;
  if (e.eat(
    117
    /* u */
  )) {
    if (this.regexp_eatFixedHexDigits(e, 4)) {
      var u = e.lastIntValue;
      if (o && u >= 55296 && u <= 56319) {
        var l = e.pos;
        if (e.eat(
          92
          /* \ */
        ) && e.eat(
          117
          /* u */
        ) && this.regexp_eatFixedHexDigits(e, 4)) {
          var f = e.lastIntValue;
          if (f >= 56320 && f <= 57343)
            return e.lastIntValue = (u - 55296) * 1024 + (f - 56320) + 65536, !0;
        }
        e.pos = l, e.lastIntValue = u;
      }
      return !0;
    }
    if (o && e.eat(
      123
      /* { */
    ) && this.regexp_eatHexDigits(e) && e.eat(
      125
      /* } */
    ) && isValidUnicode(e.lastIntValue))
      return !0;
    o && e.raise("Invalid unicode escape"), e.pos = a;
  }
  return !1;
};
function isValidUnicode(e) {
  return e >= 0 && e <= 1114111;
}
pp$1.regexp_eatIdentityEscape = function(e) {
  if (e.switchU)
    return this.regexp_eatSyntaxCharacter(e) ? !0 : e.eat(
      47
      /* / */
    ) ? (e.lastIntValue = 47, !0) : !1;
  var t = e.current();
  return t !== 99 && (!e.switchN || t !== 107) ? (e.lastIntValue = t, e.advance(), !0) : !1;
};
pp$1.regexp_eatDecimalEscape = function(e) {
  e.lastIntValue = 0;
  var t = e.current();
  if (t >= 49 && t <= 57) {
    do
      e.lastIntValue = 10 * e.lastIntValue + (t - 48), e.advance();
    while ((t = e.current()) >= 48 && t <= 57);
    return !0;
  }
  return !1;
};
var CharSetNone = 0, CharSetOk = 1, CharSetString = 2;
pp$1.regexp_eatCharacterClassEscape = function(e) {
  var t = e.current();
  if (isCharacterClassEscape(t))
    return e.lastIntValue = -1, e.advance(), CharSetOk;
  var a = !1;
  if (e.switchU && this.options.ecmaVersion >= 9 && ((a = t === 80) || t === 112)) {
    e.lastIntValue = -1, e.advance();
    var o;
    if (e.eat(
      123
      /* { */
    ) && (o = this.regexp_eatUnicodePropertyValueExpression(e)) && e.eat(
      125
      /* } */
    ))
      return a && o === CharSetString && e.raise("Invalid property name"), o;
    e.raise("Invalid property name");
  }
  return CharSetNone;
};
function isCharacterClassEscape(e) {
  return e === 100 || e === 68 || e === 115 || e === 83 || e === 119 || e === 87;
}
pp$1.regexp_eatUnicodePropertyValueExpression = function(e) {
  var t = e.pos;
  if (this.regexp_eatUnicodePropertyName(e) && e.eat(
    61
    /* = */
  )) {
    var a = e.lastStringValue;
    if (this.regexp_eatUnicodePropertyValue(e)) {
      var o = e.lastStringValue;
      return this.regexp_validateUnicodePropertyNameAndValue(e, a, o), CharSetOk;
    }
  }
  if (e.pos = t, this.regexp_eatLoneUnicodePropertyNameOrValue(e)) {
    var u = e.lastStringValue;
    return this.regexp_validateUnicodePropertyNameOrValue(e, u);
  }
  return CharSetNone;
};
pp$1.regexp_validateUnicodePropertyNameAndValue = function(e, t, a) {
  hasOwn(e.unicodeProperties.nonBinary, t) || e.raise("Invalid property name"), e.unicodeProperties.nonBinary[t].test(a) || e.raise("Invalid property value");
};
pp$1.regexp_validateUnicodePropertyNameOrValue = function(e, t) {
  if (e.unicodeProperties.binary.test(t))
    return CharSetOk;
  if (e.switchV && e.unicodeProperties.binaryOfStrings.test(t))
    return CharSetString;
  e.raise("Invalid property name");
};
pp$1.regexp_eatUnicodePropertyName = function(e) {
  var t = 0;
  for (e.lastStringValue = ""; isUnicodePropertyNameCharacter(t = e.current()); )
    e.lastStringValue += codePointToString(t), e.advance();
  return e.lastStringValue !== "";
};
function isUnicodePropertyNameCharacter(e) {
  return isControlLetter(e) || e === 95;
}
pp$1.regexp_eatUnicodePropertyValue = function(e) {
  var t = 0;
  for (e.lastStringValue = ""; isUnicodePropertyValueCharacter(t = e.current()); )
    e.lastStringValue += codePointToString(t), e.advance();
  return e.lastStringValue !== "";
};
function isUnicodePropertyValueCharacter(e) {
  return isUnicodePropertyNameCharacter(e) || isDecimalDigit(e);
}
pp$1.regexp_eatLoneUnicodePropertyNameOrValue = function(e) {
  return this.regexp_eatUnicodePropertyValue(e);
};
pp$1.regexp_eatCharacterClass = function(e) {
  if (e.eat(
    91
    /* [ */
  )) {
    var t = e.eat(
      94
      /* ^ */
    ), a = this.regexp_classContents(e);
    return e.eat(
      93
      /* ] */
    ) || e.raise("Unterminated character class"), t && a === CharSetString && e.raise("Negated character class may contain strings"), !0;
  }
  return !1;
};
pp$1.regexp_classContents = function(e) {
  return e.current() === 93 ? CharSetOk : e.switchV ? this.regexp_classSetExpression(e) : (this.regexp_nonEmptyClassRanges(e), CharSetOk);
};
pp$1.regexp_nonEmptyClassRanges = function(e) {
  for (; this.regexp_eatClassAtom(e); ) {
    var t = e.lastIntValue;
    if (e.eat(
      45
      /* - */
    ) && this.regexp_eatClassAtom(e)) {
      var a = e.lastIntValue;
      e.switchU && (t === -1 || a === -1) && e.raise("Invalid character class"), t !== -1 && a !== -1 && t > a && e.raise("Range out of order in character class");
    }
  }
};
pp$1.regexp_eatClassAtom = function(e) {
  var t = e.pos;
  if (e.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatClassEscape(e))
      return !0;
    if (e.switchU) {
      var a = e.current();
      (a === 99 || isOctalDigit(a)) && e.raise("Invalid class escape"), e.raise("Invalid escape");
    }
    e.pos = t;
  }
  var o = e.current();
  return o !== 93 ? (e.lastIntValue = o, e.advance(), !0) : !1;
};
pp$1.regexp_eatClassEscape = function(e) {
  var t = e.pos;
  if (e.eat(
    98
    /* b */
  ))
    return e.lastIntValue = 8, !0;
  if (e.switchU && e.eat(
    45
    /* - */
  ))
    return e.lastIntValue = 45, !0;
  if (!e.switchU && e.eat(
    99
    /* c */
  )) {
    if (this.regexp_eatClassControlLetter(e))
      return !0;
    e.pos = t;
  }
  return this.regexp_eatCharacterClassEscape(e) || this.regexp_eatCharacterEscape(e);
};
pp$1.regexp_classSetExpression = function(e) {
  var t = CharSetOk, a;
  if (!this.regexp_eatClassSetRange(e)) if (a = this.regexp_eatClassSetOperand(e)) {
    a === CharSetString && (t = CharSetString);
    for (var o = e.pos; e.eatChars(
      [38, 38]
      /* && */
    ); ) {
      if (e.current() !== 38 && (a = this.regexp_eatClassSetOperand(e))) {
        a !== CharSetString && (t = CharSetOk);
        continue;
      }
      e.raise("Invalid character in character class");
    }
    if (o !== e.pos)
      return t;
    for (; e.eatChars(
      [45, 45]
      /* -- */
    ); )
      this.regexp_eatClassSetOperand(e) || e.raise("Invalid character in character class");
    if (o !== e.pos)
      return t;
  } else
    e.raise("Invalid character in character class");
  for (; ; )
    if (!this.regexp_eatClassSetRange(e)) {
      if (a = this.regexp_eatClassSetOperand(e), !a)
        return t;
      a === CharSetString && (t = CharSetString);
    }
};
pp$1.regexp_eatClassSetRange = function(e) {
  var t = e.pos;
  if (this.regexp_eatClassSetCharacter(e)) {
    var a = e.lastIntValue;
    if (e.eat(
      45
      /* - */
    ) && this.regexp_eatClassSetCharacter(e)) {
      var o = e.lastIntValue;
      return a !== -1 && o !== -1 && a > o && e.raise("Range out of order in character class"), !0;
    }
    e.pos = t;
  }
  return !1;
};
pp$1.regexp_eatClassSetOperand = function(e) {
  return this.regexp_eatClassSetCharacter(e) ? CharSetOk : this.regexp_eatClassStringDisjunction(e) || this.regexp_eatNestedClass(e);
};
pp$1.regexp_eatNestedClass = function(e) {
  var t = e.pos;
  if (e.eat(
    91
    /* [ */
  )) {
    var a = e.eat(
      94
      /* ^ */
    ), o = this.regexp_classContents(e);
    if (e.eat(
      93
      /* ] */
    ))
      return a && o === CharSetString && e.raise("Negated character class may contain strings"), o;
    e.pos = t;
  }
  if (e.eat(
    92
    /* \ */
  )) {
    var u = this.regexp_eatCharacterClassEscape(e);
    if (u)
      return u;
    e.pos = t;
  }
  return null;
};
pp$1.regexp_eatClassStringDisjunction = function(e) {
  var t = e.pos;
  if (e.eatChars(
    [92, 113]
    /* \q */
  )) {
    if (e.eat(
      123
      /* { */
    )) {
      var a = this.regexp_classStringDisjunctionContents(e);
      if (e.eat(
        125
        /* } */
      ))
        return a;
    } else
      e.raise("Invalid escape");
    e.pos = t;
  }
  return null;
};
pp$1.regexp_classStringDisjunctionContents = function(e) {
  for (var t = this.regexp_classString(e); e.eat(
    124
    /* | */
  ); )
    this.regexp_classString(e) === CharSetString && (t = CharSetString);
  return t;
};
pp$1.regexp_classString = function(e) {
  for (var t = 0; this.regexp_eatClassSetCharacter(e); )
    t++;
  return t === 1 ? CharSetOk : CharSetString;
};
pp$1.regexp_eatClassSetCharacter = function(e) {
  var t = e.pos;
  if (e.eat(
    92
    /* \ */
  ))
    return this.regexp_eatCharacterEscape(e) || this.regexp_eatClassSetReservedPunctuator(e) ? !0 : e.eat(
      98
      /* b */
    ) ? (e.lastIntValue = 8, !0) : (e.pos = t, !1);
  var a = e.current();
  return a < 0 || a === e.lookahead() && isClassSetReservedDoublePunctuatorCharacter(a) || isClassSetSyntaxCharacter(a) ? !1 : (e.advance(), e.lastIntValue = a, !0);
};
function isClassSetReservedDoublePunctuatorCharacter(e) {
  return e === 33 || e >= 35 && e <= 38 || e >= 42 && e <= 44 || e === 46 || e >= 58 && e <= 64 || e === 94 || e === 96 || e === 126;
}
function isClassSetSyntaxCharacter(e) {
  return e === 40 || e === 41 || e === 45 || e === 47 || e >= 91 && e <= 93 || e >= 123 && e <= 125;
}
pp$1.regexp_eatClassSetReservedPunctuator = function(e) {
  var t = e.current();
  return isClassSetReservedPunctuator(t) ? (e.lastIntValue = t, e.advance(), !0) : !1;
};
function isClassSetReservedPunctuator(e) {
  return e === 33 || e === 35 || e === 37 || e === 38 || e === 44 || e === 45 || e >= 58 && e <= 62 || e === 64 || e === 96 || e === 126;
}
pp$1.regexp_eatClassControlLetter = function(e) {
  var t = e.current();
  return isDecimalDigit(t) || t === 95 ? (e.lastIntValue = t % 32, e.advance(), !0) : !1;
};
pp$1.regexp_eatHexEscapeSequence = function(e) {
  var t = e.pos;
  if (e.eat(
    120
    /* x */
  )) {
    if (this.regexp_eatFixedHexDigits(e, 2))
      return !0;
    e.switchU && e.raise("Invalid escape"), e.pos = t;
  }
  return !1;
};
pp$1.regexp_eatDecimalDigits = function(e) {
  var t = e.pos, a = 0;
  for (e.lastIntValue = 0; isDecimalDigit(a = e.current()); )
    e.lastIntValue = 10 * e.lastIntValue + (a - 48), e.advance();
  return e.pos !== t;
};
function isDecimalDigit(e) {
  return e >= 48 && e <= 57;
}
pp$1.regexp_eatHexDigits = function(e) {
  var t = e.pos, a = 0;
  for (e.lastIntValue = 0; isHexDigit(a = e.current()); )
    e.lastIntValue = 16 * e.lastIntValue + hexToInt(a), e.advance();
  return e.pos !== t;
};
function isHexDigit(e) {
  return e >= 48 && e <= 57 || e >= 65 && e <= 70 || e >= 97 && e <= 102;
}
function hexToInt(e) {
  return e >= 65 && e <= 70 ? 10 + (e - 65) : e >= 97 && e <= 102 ? 10 + (e - 97) : e - 48;
}
pp$1.regexp_eatLegacyOctalEscapeSequence = function(e) {
  if (this.regexp_eatOctalDigit(e)) {
    var t = e.lastIntValue;
    if (this.regexp_eatOctalDigit(e)) {
      var a = e.lastIntValue;
      t <= 3 && this.regexp_eatOctalDigit(e) ? e.lastIntValue = t * 64 + a * 8 + e.lastIntValue : e.lastIntValue = t * 8 + a;
    } else
      e.lastIntValue = t;
    return !0;
  }
  return !1;
};
pp$1.regexp_eatOctalDigit = function(e) {
  var t = e.current();
  return isOctalDigit(t) ? (e.lastIntValue = t - 48, e.advance(), !0) : (e.lastIntValue = 0, !1);
};
function isOctalDigit(e) {
  return e >= 48 && e <= 55;
}
pp$1.regexp_eatFixedHexDigits = function(e, t) {
  var a = e.pos;
  e.lastIntValue = 0;
  for (var o = 0; o < t; ++o) {
    var u = e.current();
    if (!isHexDigit(u))
      return e.pos = a, !1;
    e.lastIntValue = 16 * e.lastIntValue + hexToInt(u), e.advance();
  }
  return !0;
};
var Token = function e(t) {
  this.type = t.type, this.value = t.value, this.start = t.start, this.end = t.end, t.options.locations && (this.loc = new SourceLocation(t, t.startLoc, t.endLoc)), t.options.ranges && (this.range = [t.start, t.end]);
}, pp = Parser.prototype;
pp.next = function(e) {
  !e && this.type.keyword && this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword), this.options.onToken && this.options.onToken(new Token(this)), this.lastTokEnd = this.end, this.lastTokStart = this.start, this.lastTokEndLoc = this.endLoc, this.lastTokStartLoc = this.startLoc, this.nextToken();
};
pp.getToken = function() {
  return this.next(), new Token(this);
};
typeof Symbol < "u" && (pp[Symbol.iterator] = function() {
  var e = this;
  return {
    next: function() {
      var t = e.getToken();
      return {
        done: t.type === types$1.eof,
        value: t
      };
    }
  };
});
pp.nextToken = function() {
  var e = this.curContext();
  if ((!e || !e.preserveSpace) && this.skipSpace(), this.start = this.pos, this.options.locations && (this.startLoc = this.curPosition()), this.pos >= this.input.length)
    return this.finishToken(types$1.eof);
  if (e.override)
    return e.override(this);
  this.readToken(this.fullCharCodeAtPos());
};
pp.readToken = function(e) {
  return isIdentifierStart(e, this.options.ecmaVersion >= 6) || e === 92 ? this.readWord() : this.getTokenFromCode(e);
};
pp.fullCharCodeAtPos = function() {
  var e = this.input.charCodeAt(this.pos);
  if (e <= 55295 || e >= 56320)
    return e;
  var t = this.input.charCodeAt(this.pos + 1);
  return t <= 56319 || t >= 57344 ? e : (e << 10) + t - 56613888;
};
pp.skipBlockComment = function() {
  var e = this.options.onComment && this.curPosition(), t = this.pos, a = this.input.indexOf("*/", this.pos += 2);
  if (a === -1 && this.raise(this.pos - 2, "Unterminated comment"), this.pos = a + 2, this.options.locations)
    for (var o = void 0, u = t; (o = nextLineBreak(this.input, u, this.pos)) > -1; )
      ++this.curLine, u = this.lineStart = o;
  this.options.onComment && this.options.onComment(
    !0,
    this.input.slice(t + 2, a),
    t,
    this.pos,
    e,
    this.curPosition()
  );
};
pp.skipLineComment = function(e) {
  for (var t = this.pos, a = this.options.onComment && this.curPosition(), o = this.input.charCodeAt(this.pos += e); this.pos < this.input.length && !isNewLine(o); )
    o = this.input.charCodeAt(++this.pos);
  this.options.onComment && this.options.onComment(
    !1,
    this.input.slice(t + e, this.pos),
    t,
    this.pos,
    a,
    this.curPosition()
  );
};
pp.skipSpace = function() {
  e: for (; this.pos < this.input.length; ) {
    var e = this.input.charCodeAt(this.pos);
    switch (e) {
      case 32:
      case 160:
        ++this.pos;
        break;
      case 13:
        this.input.charCodeAt(this.pos + 1) === 10 && ++this.pos;
      case 10:
      case 8232:
      case 8233:
        ++this.pos, this.options.locations && (++this.curLine, this.lineStart = this.pos);
        break;
      case 47:
        switch (this.input.charCodeAt(this.pos + 1)) {
          case 42:
            this.skipBlockComment();
            break;
          case 47:
            this.skipLineComment(2);
            break;
          default:
            break e;
        }
        break;
      default:
        if (e > 8 && e < 14 || e >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(e)))
          ++this.pos;
        else
          break e;
    }
  }
};
pp.finishToken = function(e, t) {
  this.end = this.pos, this.options.locations && (this.endLoc = this.curPosition());
  var a = this.type;
  this.type = e, this.value = t, this.updateContext(a);
};
pp.readToken_dot = function() {
  var e = this.input.charCodeAt(this.pos + 1);
  if (e >= 48 && e <= 57)
    return this.readNumber(!0);
  var t = this.input.charCodeAt(this.pos + 2);
  return this.options.ecmaVersion >= 6 && e === 46 && t === 46 ? (this.pos += 3, this.finishToken(types$1.ellipsis)) : (++this.pos, this.finishToken(types$1.dot));
};
pp.readToken_slash = function() {
  var e = this.input.charCodeAt(this.pos + 1);
  return this.exprAllowed ? (++this.pos, this.readRegexp()) : e === 61 ? this.finishOp(types$1.assign, 2) : this.finishOp(types$1.slash, 1);
};
pp.readToken_mult_modulo_exp = function(e) {
  var t = this.input.charCodeAt(this.pos + 1), a = 1, o = e === 42 ? types$1.star : types$1.modulo;
  return this.options.ecmaVersion >= 7 && e === 42 && t === 42 && (++a, o = types$1.starstar, t = this.input.charCodeAt(this.pos + 2)), t === 61 ? this.finishOp(types$1.assign, a + 1) : this.finishOp(o, a);
};
pp.readToken_pipe_amp = function(e) {
  var t = this.input.charCodeAt(this.pos + 1);
  if (t === e) {
    if (this.options.ecmaVersion >= 12) {
      var a = this.input.charCodeAt(this.pos + 2);
      if (a === 61)
        return this.finishOp(types$1.assign, 3);
    }
    return this.finishOp(e === 124 ? types$1.logicalOR : types$1.logicalAND, 2);
  }
  return t === 61 ? this.finishOp(types$1.assign, 2) : this.finishOp(e === 124 ? types$1.bitwiseOR : types$1.bitwiseAND, 1);
};
pp.readToken_caret = function() {
  var e = this.input.charCodeAt(this.pos + 1);
  return e === 61 ? this.finishOp(types$1.assign, 2) : this.finishOp(types$1.bitwiseXOR, 1);
};
pp.readToken_plus_min = function(e) {
  var t = this.input.charCodeAt(this.pos + 1);
  return t === e ? t === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 && (this.lastTokEnd === 0 || lineBreak.test(this.input.slice(this.lastTokEnd, this.pos))) ? (this.skipLineComment(3), this.skipSpace(), this.nextToken()) : this.finishOp(types$1.incDec, 2) : t === 61 ? this.finishOp(types$1.assign, 2) : this.finishOp(types$1.plusMin, 1);
};
pp.readToken_lt_gt = function(e) {
  var t = this.input.charCodeAt(this.pos + 1), a = 1;
  return t === e ? (a = e === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2, this.input.charCodeAt(this.pos + a) === 61 ? this.finishOp(types$1.assign, a + 1) : this.finishOp(types$1.bitShift, a)) : t === 33 && e === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 && this.input.charCodeAt(this.pos + 3) === 45 ? (this.skipLineComment(4), this.skipSpace(), this.nextToken()) : (t === 61 && (a = 2), this.finishOp(types$1.relational, a));
};
pp.readToken_eq_excl = function(e) {
  var t = this.input.charCodeAt(this.pos + 1);
  return t === 61 ? this.finishOp(types$1.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2) : e === 61 && t === 62 && this.options.ecmaVersion >= 6 ? (this.pos += 2, this.finishToken(types$1.arrow)) : this.finishOp(e === 61 ? types$1.eq : types$1.prefix, 1);
};
pp.readToken_question = function() {
  var e = this.options.ecmaVersion;
  if (e >= 11) {
    var t = this.input.charCodeAt(this.pos + 1);
    if (t === 46) {
      var a = this.input.charCodeAt(this.pos + 2);
      if (a < 48 || a > 57)
        return this.finishOp(types$1.questionDot, 2);
    }
    if (t === 63) {
      if (e >= 12) {
        var o = this.input.charCodeAt(this.pos + 2);
        if (o === 61)
          return this.finishOp(types$1.assign, 3);
      }
      return this.finishOp(types$1.coalesce, 2);
    }
  }
  return this.finishOp(types$1.question, 1);
};
pp.readToken_numberSign = function() {
  var e = this.options.ecmaVersion, t = 35;
  if (e >= 13 && (++this.pos, t = this.fullCharCodeAtPos(), isIdentifierStart(t, !0) || t === 92))
    return this.finishToken(types$1.privateId, this.readWord1());
  this.raise(this.pos, "Unexpected character '" + codePointToString(t) + "'");
};
pp.getTokenFromCode = function(e) {
  switch (e) {
    // The interpretation of a dot depends on whether it is followed
    // by a digit or another two dots.
    case 46:
      return this.readToken_dot();
    // Punctuation tokens.
    case 40:
      return ++this.pos, this.finishToken(types$1.parenL);
    case 41:
      return ++this.pos, this.finishToken(types$1.parenR);
    case 59:
      return ++this.pos, this.finishToken(types$1.semi);
    case 44:
      return ++this.pos, this.finishToken(types$1.comma);
    case 91:
      return ++this.pos, this.finishToken(types$1.bracketL);
    case 93:
      return ++this.pos, this.finishToken(types$1.bracketR);
    case 123:
      return ++this.pos, this.finishToken(types$1.braceL);
    case 125:
      return ++this.pos, this.finishToken(types$1.braceR);
    case 58:
      return ++this.pos, this.finishToken(types$1.colon);
    case 96:
      if (this.options.ecmaVersion < 6)
        break;
      return ++this.pos, this.finishToken(types$1.backQuote);
    case 48:
      var t = this.input.charCodeAt(this.pos + 1);
      if (t === 120 || t === 88)
        return this.readRadixNumber(16);
      if (this.options.ecmaVersion >= 6) {
        if (t === 111 || t === 79)
          return this.readRadixNumber(8);
        if (t === 98 || t === 66)
          return this.readRadixNumber(2);
      }
    // Anything else beginning with a digit is an integer, octal
    // number, or float.
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
      return this.readNumber(!1);
    // Quotes produce strings.
    case 34:
    case 39:
      return this.readString(e);
    // Operators are parsed inline in tiny state machines. '=' (61) is
    // often referred to. `finishOp` simply skips the amount of
    // characters it is given as second argument, and returns a token
    // of the type given by its first argument.
    case 47:
      return this.readToken_slash();
    case 37:
    case 42:
      return this.readToken_mult_modulo_exp(e);
    case 124:
    case 38:
      return this.readToken_pipe_amp(e);
    case 94:
      return this.readToken_caret();
    case 43:
    case 45:
      return this.readToken_plus_min(e);
    case 60:
    case 62:
      return this.readToken_lt_gt(e);
    case 61:
    case 33:
      return this.readToken_eq_excl(e);
    case 63:
      return this.readToken_question();
    case 126:
      return this.finishOp(types$1.prefix, 1);
    case 35:
      return this.readToken_numberSign();
  }
  this.raise(this.pos, "Unexpected character '" + codePointToString(e) + "'");
};
pp.finishOp = function(e, t) {
  var a = this.input.slice(this.pos, this.pos + t);
  return this.pos += t, this.finishToken(e, a);
};
pp.readRegexp = function() {
  for (var e, t, a = this.pos; ; ) {
    this.pos >= this.input.length && this.raise(a, "Unterminated regular expression");
    var o = this.input.charAt(this.pos);
    if (lineBreak.test(o) && this.raise(a, "Unterminated regular expression"), e)
      e = !1;
    else {
      if (o === "[")
        t = !0;
      else if (o === "]" && t)
        t = !1;
      else if (o === "/" && !t)
        break;
      e = o === "\\";
    }
    ++this.pos;
  }
  var u = this.input.slice(a, this.pos);
  ++this.pos;
  var l = this.pos, f = this.readWord1();
  this.containsEsc && this.unexpected(l);
  var p = this.regexpState || (this.regexpState = new RegExpValidationState(this));
  p.reset(a, u, f), this.validateRegExpFlags(p), this.validateRegExpPattern(p);
  var g = null;
  try {
    g = new RegExp(u, f);
  } catch {
  }
  return this.finishToken(types$1.regexp, { pattern: u, flags: f, value: g });
};
pp.readInt = function(e, t, a) {
  for (var o = this.options.ecmaVersion >= 12 && t === void 0, u = a && this.input.charCodeAt(this.pos) === 48, l = this.pos, f = 0, p = 0, g = 0, d = t ?? 1 / 0; g < d; ++g, ++this.pos) {
    var b = this.input.charCodeAt(this.pos), F = void 0;
    if (o && b === 95) {
      u && this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals"), p === 95 && this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore"), g === 0 && this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits"), p = b;
      continue;
    }
    if (b >= 97 ? F = b - 97 + 10 : b >= 65 ? F = b - 65 + 10 : b >= 48 && b <= 57 ? F = b - 48 : F = 1 / 0, F >= e)
      break;
    p = b, f = f * e + F;
  }
  return o && p === 95 && this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits"), this.pos === l || t != null && this.pos - l !== t ? null : f;
};
function stringToNumber(e, t) {
  return t ? parseInt(e, 8) : parseFloat(e.replace(/_/g, ""));
}
function stringToBigInt(e) {
  return typeof BigInt != "function" ? null : BigInt(e.replace(/_/g, ""));
}
pp.readRadixNumber = function(e) {
  var t = this.pos;
  this.pos += 2;
  var a = this.readInt(e);
  return a == null && this.raise(this.start + 2, "Expected number in radix " + e), this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110 ? (a = stringToBigInt(this.input.slice(t, this.pos)), ++this.pos) : isIdentifierStart(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(types$1.num, a);
};
pp.readNumber = function(e) {
  var t = this.pos;
  !e && this.readInt(10, void 0, !0) === null && this.raise(t, "Invalid number");
  var a = this.pos - t >= 2 && this.input.charCodeAt(t) === 48;
  a && this.strict && this.raise(t, "Invalid number");
  var o = this.input.charCodeAt(this.pos);
  if (!a && !e && this.options.ecmaVersion >= 11 && o === 110) {
    var u = stringToBigInt(this.input.slice(t, this.pos));
    return ++this.pos, isIdentifierStart(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(types$1.num, u);
  }
  a && /[89]/.test(this.input.slice(t, this.pos)) && (a = !1), o === 46 && !a && (++this.pos, this.readInt(10), o = this.input.charCodeAt(this.pos)), (o === 69 || o === 101) && !a && (o = this.input.charCodeAt(++this.pos), (o === 43 || o === 45) && ++this.pos, this.readInt(10) === null && this.raise(t, "Invalid number")), isIdentifierStart(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number");
  var l = stringToNumber(this.input.slice(t, this.pos), a);
  return this.finishToken(types$1.num, l);
};
pp.readCodePoint = function() {
  var e = this.input.charCodeAt(this.pos), t;
  if (e === 123) {
    this.options.ecmaVersion < 6 && this.unexpected();
    var a = ++this.pos;
    t = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos), ++this.pos, t > 1114111 && this.invalidStringToken(a, "Code point out of bounds");
  } else
    t = this.readHexChar(4);
  return t;
};
pp.readString = function(e) {
  for (var t = "", a = ++this.pos; ; ) {
    this.pos >= this.input.length && this.raise(this.start, "Unterminated string constant");
    var o = this.input.charCodeAt(this.pos);
    if (o === e)
      break;
    o === 92 ? (t += this.input.slice(a, this.pos), t += this.readEscapedChar(!1), a = this.pos) : o === 8232 || o === 8233 ? (this.options.ecmaVersion < 10 && this.raise(this.start, "Unterminated string constant"), ++this.pos, this.options.locations && (this.curLine++, this.lineStart = this.pos)) : (isNewLine(o) && this.raise(this.start, "Unterminated string constant"), ++this.pos);
  }
  return t += this.input.slice(a, this.pos++), this.finishToken(types$1.string, t);
};
var INVALID_TEMPLATE_ESCAPE_ERROR = {};
pp.tryReadTemplateToken = function() {
  this.inTemplateElement = !0;
  try {
    this.readTmplToken();
  } catch (e) {
    if (e === INVALID_TEMPLATE_ESCAPE_ERROR)
      this.readInvalidTemplateToken();
    else
      throw e;
  }
  this.inTemplateElement = !1;
};
pp.invalidStringToken = function(e, t) {
  if (this.inTemplateElement && this.options.ecmaVersion >= 9)
    throw INVALID_TEMPLATE_ESCAPE_ERROR;
  this.raise(e, t);
};
pp.readTmplToken = function() {
  for (var e = "", t = this.pos; ; ) {
    this.pos >= this.input.length && this.raise(this.start, "Unterminated template");
    var a = this.input.charCodeAt(this.pos);
    if (a === 96 || a === 36 && this.input.charCodeAt(this.pos + 1) === 123)
      return this.pos === this.start && (this.type === types$1.template || this.type === types$1.invalidTemplate) ? a === 36 ? (this.pos += 2, this.finishToken(types$1.dollarBraceL)) : (++this.pos, this.finishToken(types$1.backQuote)) : (e += this.input.slice(t, this.pos), this.finishToken(types$1.template, e));
    if (a === 92)
      e += this.input.slice(t, this.pos), e += this.readEscapedChar(!0), t = this.pos;
    else if (isNewLine(a)) {
      switch (e += this.input.slice(t, this.pos), ++this.pos, a) {
        case 13:
          this.input.charCodeAt(this.pos) === 10 && ++this.pos;
        case 10:
          e += `
`;
          break;
        default:
          e += String.fromCharCode(a);
          break;
      }
      this.options.locations && (++this.curLine, this.lineStart = this.pos), t = this.pos;
    } else
      ++this.pos;
  }
};
pp.readInvalidTemplateToken = function() {
  for (; this.pos < this.input.length; this.pos++)
    switch (this.input[this.pos]) {
      case "\\":
        ++this.pos;
        break;
      case "$":
        if (this.input[this.pos + 1] !== "{")
          break;
      // fall through
      case "`":
        return this.finishToken(types$1.invalidTemplate, this.input.slice(this.start, this.pos));
      case "\r":
        this.input[this.pos + 1] === `
` && ++this.pos;
      // fall through
      case `
`:
      case "\u2028":
      case "\u2029":
        ++this.curLine, this.lineStart = this.pos + 1;
        break;
    }
  this.raise(this.start, "Unterminated template");
};
pp.readEscapedChar = function(e) {
  var t = this.input.charCodeAt(++this.pos);
  switch (++this.pos, t) {
    case 110:
      return `
`;
    // 'n' -> '\n'
    case 114:
      return "\r";
    // 'r' -> '\r'
    case 120:
      return String.fromCharCode(this.readHexChar(2));
    // 'x'
    case 117:
      return codePointToString(this.readCodePoint());
    // 'u'
    case 116:
      return "	";
    // 't' -> '\t'
    case 98:
      return "\b";
    // 'b' -> '\b'
    case 118:
      return "\v";
    // 'v' -> '\u000b'
    case 102:
      return "\f";
    // 'f' -> '\f'
    case 13:
      this.input.charCodeAt(this.pos) === 10 && ++this.pos;
    // '\r\n'
    case 10:
      return this.options.locations && (this.lineStart = this.pos, ++this.curLine), "";
    case 56:
    case 57:
      if (this.strict && this.invalidStringToken(
        this.pos - 1,
        "Invalid escape sequence"
      ), e) {
        var a = this.pos - 1;
        this.invalidStringToken(
          a,
          "Invalid escape sequence in template string"
        );
      }
    default:
      if (t >= 48 && t <= 55) {
        var o = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0], u = parseInt(o, 8);
        return u > 255 && (o = o.slice(0, -1), u = parseInt(o, 8)), this.pos += o.length - 1, t = this.input.charCodeAt(this.pos), (o !== "0" || t === 56 || t === 57) && (this.strict || e) && this.invalidStringToken(
          this.pos - 1 - o.length,
          e ? "Octal literal in template string" : "Octal literal in strict mode"
        ), String.fromCharCode(u);
      }
      return isNewLine(t) ? (this.options.locations && (this.lineStart = this.pos, ++this.curLine), "") : String.fromCharCode(t);
  }
};
pp.readHexChar = function(e) {
  var t = this.pos, a = this.readInt(16, e);
  return a === null && this.invalidStringToken(t, "Bad character escape sequence"), a;
};
pp.readWord1 = function() {
  this.containsEsc = !1;
  for (var e = "", t = !0, a = this.pos, o = this.options.ecmaVersion >= 6; this.pos < this.input.length; ) {
    var u = this.fullCharCodeAtPos();
    if (isIdentifierChar(u, o))
      this.pos += u <= 65535 ? 1 : 2;
    else if (u === 92) {
      this.containsEsc = !0, e += this.input.slice(a, this.pos);
      var l = this.pos;
      this.input.charCodeAt(++this.pos) !== 117 && this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX"), ++this.pos;
      var f = this.readCodePoint();
      (t ? isIdentifierStart : isIdentifierChar)(f, o) || this.invalidStringToken(l, "Invalid Unicode escape"), e += codePointToString(f), a = this.pos;
    } else
      break;
    t = !1;
  }
  return e + this.input.slice(a, this.pos);
};
pp.readWord = function() {
  var e = this.readWord1(), t = types$1.name;
  return this.keywords.test(e) && (t = keywords[e]), this.finishToken(t, e);
};
var version$1 = "8.14.0";
Parser.acorn = {
  Parser,
  version: version$1,
  defaultOptions,
  Position,
  SourceLocation,
  getLineInfo,
  Node,
  TokenType,
  tokTypes: types$1,
  keywordTypes: keywords,
  TokContext,
  tokContexts: types,
  isIdentifierChar,
  isIdentifierStart,
  Token,
  isNewLine,
  lineBreak,
  lineBreakG,
  nonASCIIwhitespace
};
function parse$6(e, t) {
  return Parser.parse(e, t);
}
var escodegen$1 = {}, estraverse = {}, hasRequiredEstraverse;
function requireEstraverse() {
  return hasRequiredEstraverse || (hasRequiredEstraverse = 1, function(e) {
    (function t(a) {
      var o, u, l, f, p, g;
      function d(z) {
        var j = {}, ee, te;
        for (ee in z)
          z.hasOwnProperty(ee) && (te = z[ee], typeof te == "object" && te !== null ? j[ee] = d(te) : j[ee] = te);
        return j;
      }
      function b(z, j) {
        var ee, te, de, ie;
        for (te = z.length, de = 0; te; )
          ee = te >>> 1, ie = de + ee, j(z[ie]) ? te = ee : (de = ie + 1, te -= ee + 1);
        return de;
      }
      o = {
        AssignmentExpression: "AssignmentExpression",
        AssignmentPattern: "AssignmentPattern",
        ArrayExpression: "ArrayExpression",
        ArrayPattern: "ArrayPattern",
        ArrowFunctionExpression: "ArrowFunctionExpression",
        AwaitExpression: "AwaitExpression",
        // CAUTION: It's deferred to ES7.
        BlockStatement: "BlockStatement",
        BinaryExpression: "BinaryExpression",
        BreakStatement: "BreakStatement",
        CallExpression: "CallExpression",
        CatchClause: "CatchClause",
        ChainExpression: "ChainExpression",
        ClassBody: "ClassBody",
        ClassDeclaration: "ClassDeclaration",
        ClassExpression: "ClassExpression",
        ComprehensionBlock: "ComprehensionBlock",
        // CAUTION: It's deferred to ES7.
        ComprehensionExpression: "ComprehensionExpression",
        // CAUTION: It's deferred to ES7.
        ConditionalExpression: "ConditionalExpression",
        ContinueStatement: "ContinueStatement",
        DebuggerStatement: "DebuggerStatement",
        DirectiveStatement: "DirectiveStatement",
        DoWhileStatement: "DoWhileStatement",
        EmptyStatement: "EmptyStatement",
        ExportAllDeclaration: "ExportAllDeclaration",
        ExportDefaultDeclaration: "ExportDefaultDeclaration",
        ExportNamedDeclaration: "ExportNamedDeclaration",
        ExportSpecifier: "ExportSpecifier",
        ExpressionStatement: "ExpressionStatement",
        ForStatement: "ForStatement",
        ForInStatement: "ForInStatement",
        ForOfStatement: "ForOfStatement",
        FunctionDeclaration: "FunctionDeclaration",
        FunctionExpression: "FunctionExpression",
        GeneratorExpression: "GeneratorExpression",
        // CAUTION: It's deferred to ES7.
        Identifier: "Identifier",
        IfStatement: "IfStatement",
        ImportExpression: "ImportExpression",
        ImportDeclaration: "ImportDeclaration",
        ImportDefaultSpecifier: "ImportDefaultSpecifier",
        ImportNamespaceSpecifier: "ImportNamespaceSpecifier",
        ImportSpecifier: "ImportSpecifier",
        Literal: "Literal",
        LabeledStatement: "LabeledStatement",
        LogicalExpression: "LogicalExpression",
        MemberExpression: "MemberExpression",
        MetaProperty: "MetaProperty",
        MethodDefinition: "MethodDefinition",
        ModuleSpecifier: "ModuleSpecifier",
        NewExpression: "NewExpression",
        ObjectExpression: "ObjectExpression",
        ObjectPattern: "ObjectPattern",
        PrivateIdentifier: "PrivateIdentifier",
        Program: "Program",
        Property: "Property",
        PropertyDefinition: "PropertyDefinition",
        RestElement: "RestElement",
        ReturnStatement: "ReturnStatement",
        SequenceExpression: "SequenceExpression",
        SpreadElement: "SpreadElement",
        Super: "Super",
        SwitchStatement: "SwitchStatement",
        SwitchCase: "SwitchCase",
        TaggedTemplateExpression: "TaggedTemplateExpression",
        TemplateElement: "TemplateElement",
        TemplateLiteral: "TemplateLiteral",
        ThisExpression: "ThisExpression",
        ThrowStatement: "ThrowStatement",
        TryStatement: "TryStatement",
        UnaryExpression: "UnaryExpression",
        UpdateExpression: "UpdateExpression",
        VariableDeclaration: "VariableDeclaration",
        VariableDeclarator: "VariableDeclarator",
        WhileStatement: "WhileStatement",
        WithStatement: "WithStatement",
        YieldExpression: "YieldExpression"
      }, l = {
        AssignmentExpression: ["left", "right"],
        AssignmentPattern: ["left", "right"],
        ArrayExpression: ["elements"],
        ArrayPattern: ["elements"],
        ArrowFunctionExpression: ["params", "body"],
        AwaitExpression: ["argument"],
        // CAUTION: It's deferred to ES7.
        BlockStatement: ["body"],
        BinaryExpression: ["left", "right"],
        BreakStatement: ["label"],
        CallExpression: ["callee", "arguments"],
        CatchClause: ["param", "body"],
        ChainExpression: ["expression"],
        ClassBody: ["body"],
        ClassDeclaration: ["id", "superClass", "body"],
        ClassExpression: ["id", "superClass", "body"],
        ComprehensionBlock: ["left", "right"],
        // CAUTION: It's deferred to ES7.
        ComprehensionExpression: ["blocks", "filter", "body"],
        // CAUTION: It's deferred to ES7.
        ConditionalExpression: ["test", "consequent", "alternate"],
        ContinueStatement: ["label"],
        DebuggerStatement: [],
        DirectiveStatement: [],
        DoWhileStatement: ["body", "test"],
        EmptyStatement: [],
        ExportAllDeclaration: ["source"],
        ExportDefaultDeclaration: ["declaration"],
        ExportNamedDeclaration: ["declaration", "specifiers", "source"],
        ExportSpecifier: ["exported", "local"],
        ExpressionStatement: ["expression"],
        ForStatement: ["init", "test", "update", "body"],
        ForInStatement: ["left", "right", "body"],
        ForOfStatement: ["left", "right", "body"],
        FunctionDeclaration: ["id", "params", "body"],
        FunctionExpression: ["id", "params", "body"],
        GeneratorExpression: ["blocks", "filter", "body"],
        // CAUTION: It's deferred to ES7.
        Identifier: [],
        IfStatement: ["test", "consequent", "alternate"],
        ImportExpression: ["source"],
        ImportDeclaration: ["specifiers", "source"],
        ImportDefaultSpecifier: ["local"],
        ImportNamespaceSpecifier: ["local"],
        ImportSpecifier: ["imported", "local"],
        Literal: [],
        LabeledStatement: ["label", "body"],
        LogicalExpression: ["left", "right"],
        MemberExpression: ["object", "property"],
        MetaProperty: ["meta", "property"],
        MethodDefinition: ["key", "value"],
        ModuleSpecifier: [],
        NewExpression: ["callee", "arguments"],
        ObjectExpression: ["properties"],
        ObjectPattern: ["properties"],
        PrivateIdentifier: [],
        Program: ["body"],
        Property: ["key", "value"],
        PropertyDefinition: ["key", "value"],
        RestElement: ["argument"],
        ReturnStatement: ["argument"],
        SequenceExpression: ["expressions"],
        SpreadElement: ["argument"],
        Super: [],
        SwitchStatement: ["discriminant", "cases"],
        SwitchCase: ["test", "consequent"],
        TaggedTemplateExpression: ["tag", "quasi"],
        TemplateElement: [],
        TemplateLiteral: ["quasis", "expressions"],
        ThisExpression: [],
        ThrowStatement: ["argument"],
        TryStatement: ["block", "handler", "finalizer"],
        UnaryExpression: ["argument"],
        UpdateExpression: ["argument"],
        VariableDeclaration: ["declarations"],
        VariableDeclarator: ["id", "init"],
        WhileStatement: ["test", "body"],
        WithStatement: ["object", "body"],
        YieldExpression: ["argument"]
      }, f = {}, p = {}, g = {}, u = {
        Break: f,
        Skip: p,
        Remove: g
      };
      function F(z, j) {
        this.parent = z, this.key = j;
      }
      F.prototype.replace = function(j) {
        this.parent[this.key] = j;
      }, F.prototype.remove = function() {
        return Array.isArray(this.parent) ? (this.parent.splice(this.key, 1), !0) : (this.replace(null), !1);
      };
      function E(z, j, ee, te) {
        this.node = z, this.path = j, this.wrap = ee, this.ref = te;
      }
      function S() {
      }
      S.prototype.path = function() {
        var j, ee, te, de, ie, he;
        function fe(le, _e) {
          if (Array.isArray(_e))
            for (te = 0, de = _e.length; te < de; ++te)
              le.push(_e[te]);
          else
            le.push(_e);
        }
        if (!this.__current.path)
          return null;
        for (ie = [], j = 2, ee = this.__leavelist.length; j < ee; ++j)
          he = this.__leavelist[j], fe(ie, he.path);
        return fe(ie, this.__current.path), ie;
      }, S.prototype.type = function() {
        var z = this.current();
        return z.type || this.__current.wrap;
      }, S.prototype.parents = function() {
        var j, ee, te;
        for (te = [], j = 1, ee = this.__leavelist.length; j < ee; ++j)
          te.push(this.__leavelist[j].node);
        return te;
      }, S.prototype.current = function() {
        return this.__current.node;
      }, S.prototype.__execute = function(j, ee) {
        var te, de;
        return de = void 0, te = this.__current, this.__current = ee, this.__state = null, j && (de = j.call(this, ee.node, this.__leavelist[this.__leavelist.length - 1].node)), this.__current = te, de;
      }, S.prototype.notify = function(j) {
        this.__state = j;
      }, S.prototype.skip = function() {
        this.notify(p);
      }, S.prototype.break = function() {
        this.notify(f);
      }, S.prototype.remove = function() {
        this.notify(g);
      }, S.prototype.__initialize = function(z, j) {
        this.visitor = j, this.root = z, this.__worklist = [], this.__leavelist = [], this.__current = null, this.__state = null, this.__fallback = null, j.fallback === "iteration" ? this.__fallback = Object.keys : typeof j.fallback == "function" && (this.__fallback = j.fallback), this.__keys = l, j.keys && (this.__keys = Object.assign(Object.create(this.__keys), j.keys));
      };
      function R(z) {
        return z == null ? !1 : typeof z == "object" && typeof z.type == "string";
      }
      function k(z, j) {
        return (z === o.ObjectExpression || z === o.ObjectPattern) && j === "properties";
      }
      function I(z, j) {
        for (var ee = z.length - 1; ee >= 0; --ee)
          if (z[ee].node === j)
            return !0;
        return !1;
      }
      S.prototype.traverse = function(j, ee) {
        var te, de, ie, he, fe, le, _e, Me, be, ve, ge, Ie;
        for (this.__initialize(j, ee), Ie = {}, te = this.__worklist, de = this.__leavelist, te.push(new E(j, null, null, null)), de.push(new E(null, null, null, null)); te.length; ) {
          if (ie = te.pop(), ie === Ie) {
            if (ie = de.pop(), le = this.__execute(ee.leave, ie), this.__state === f || le === f)
              return;
            continue;
          }
          if (ie.node) {
            if (le = this.__execute(ee.enter, ie), this.__state === f || le === f)
              return;
            if (te.push(Ie), de.push(ie), this.__state === p || le === p)
              continue;
            if (he = ie.node, fe = he.type || ie.wrap, ve = this.__keys[fe], !ve)
              if (this.__fallback)
                ve = this.__fallback(he);
              else
                throw new Error("Unknown node type " + fe + ".");
            for (Me = ve.length; (Me -= 1) >= 0; )
              if (_e = ve[Me], ge = he[_e], !!ge) {
                if (Array.isArray(ge)) {
                  for (be = ge.length; (be -= 1) >= 0; )
                    if (ge[be] && !I(de, ge[be])) {
                      if (k(fe, ve[Me]))
                        ie = new E(ge[be], [_e, be], "Property", null);
                      else if (R(ge[be]))
                        ie = new E(ge[be], [_e, be], null, null);
                      else
                        continue;
                      te.push(ie);
                    }
                } else if (R(ge)) {
                  if (I(de, ge))
                    continue;
                  te.push(new E(ge, _e, null, null));
                }
              }
          }
        }
      }, S.prototype.replace = function(j, ee) {
        var te, de, ie, he, fe, le, _e, Me, be, ve, ge, Ie, $e;
        function Xe(ue) {
          var Ee, qe, Te, xe;
          if (ue.ref.remove()) {
            for (qe = ue.ref.key, xe = ue.ref.parent, Ee = te.length; Ee--; )
              if (Te = te[Ee], Te.ref && Te.ref.parent === xe) {
                if (Te.ref.key < qe)
                  break;
                --Te.ref.key;
              }
          }
        }
        for (this.__initialize(j, ee), ge = {}, te = this.__worklist, de = this.__leavelist, Ie = {
          root: j
        }, le = new E(j, null, null, new F(Ie, "root")), te.push(le), de.push(le); te.length; ) {
          if (le = te.pop(), le === ge) {
            if (le = de.pop(), fe = this.__execute(ee.leave, le), fe !== void 0 && fe !== f && fe !== p && fe !== g && le.ref.replace(fe), (this.__state === g || fe === g) && Xe(le), this.__state === f || fe === f)
              return Ie.root;
            continue;
          }
          if (fe = this.__execute(ee.enter, le), fe !== void 0 && fe !== f && fe !== p && fe !== g && (le.ref.replace(fe), le.node = fe), (this.__state === g || fe === g) && (Xe(le), le.node = null), this.__state === f || fe === f)
            return Ie.root;
          if (ie = le.node, !!ie && (te.push(ge), de.push(le), !(this.__state === p || fe === p))) {
            if (he = ie.type || le.wrap, be = this.__keys[he], !be)
              if (this.__fallback)
                be = this.__fallback(ie);
              else
                throw new Error("Unknown node type " + he + ".");
            for (_e = be.length; (_e -= 1) >= 0; )
              if ($e = be[_e], ve = ie[$e], !!ve)
                if (Array.isArray(ve)) {
                  for (Me = ve.length; (Me -= 1) >= 0; )
                    if (ve[Me]) {
                      if (k(he, be[_e]))
                        le = new E(ve[Me], [$e, Me], "Property", new F(ve, Me));
                      else if (R(ve[Me]))
                        le = new E(ve[Me], [$e, Me], null, new F(ve, Me));
                      else
                        continue;
                      te.push(le);
                    }
                } else R(ve) && te.push(new E(ve, $e, null, new F(ie, $e)));
          }
        }
        return Ie.root;
      };
      function V(z, j) {
        var ee = new S();
        return ee.traverse(z, j);
      }
      function U(z, j) {
        var ee = new S();
        return ee.replace(z, j);
      }
      function q(z, j) {
        var ee;
        return ee = b(j, function(de) {
          return de.range[0] > z.range[0];
        }), z.extendedRange = [z.range[0], z.range[1]], ee !== j.length && (z.extendedRange[1] = j[ee].range[0]), ee -= 1, ee >= 0 && (z.extendedRange[0] = j[ee].range[1]), z;
      }
      function H(z, j, ee) {
        var te = [], de, ie, he, fe;
        if (!z.range)
          throw new Error("attachComments needs range information");
        if (!ee.length) {
          if (j.length) {
            for (he = 0, ie = j.length; he < ie; he += 1)
              de = d(j[he]), de.extendedRange = [0, z.range[0]], te.push(de);
            z.leadingComments = te;
          }
          return z;
        }
        for (he = 0, ie = j.length; he < ie; he += 1)
          te.push(q(d(j[he]), ee));
        return fe = 0, V(z, {
          enter: function(le) {
            for (var _e; fe < te.length && (_e = te[fe], !(_e.extendedRange[1] > le.range[0])); )
              _e.extendedRange[1] === le.range[0] ? (le.leadingComments || (le.leadingComments = []), le.leadingComments.push(_e), te.splice(fe, 1)) : fe += 1;
            if (fe === te.length)
              return u.Break;
            if (te[fe].extendedRange[0] > le.range[1])
              return u.Skip;
          }
        }), fe = 0, V(z, {
          leave: function(le) {
            for (var _e; fe < te.length && (_e = te[fe], !(le.range[1] < _e.extendedRange[0])); )
              le.range[1] === _e.extendedRange[0] ? (le.trailingComments || (le.trailingComments = []), le.trailingComments.push(_e), te.splice(fe, 1)) : fe += 1;
            if (fe === te.length)
              return u.Break;
            if (te[fe].extendedRange[0] > le.range[1])
              return u.Skip;
          }
        }), z;
      }
      return a.Syntax = o, a.traverse = V, a.replace = U, a.attachComments = H, a.VisitorKeys = l, a.VisitorOption = u, a.Controller = S, a.cloneEnvironment = function() {
        return t({});
      }, a;
    })(e);
  }(estraverse)), estraverse;
}
var utils = {}, ast = { exports: {} }, hasRequiredAst;
function requireAst() {
  return hasRequiredAst || (hasRequiredAst = 1, function() {
    function e(f) {
      if (f == null)
        return !1;
      switch (f.type) {
        case "ArrayExpression":
        case "AssignmentExpression":
        case "BinaryExpression":
        case "CallExpression":
        case "ConditionalExpression":
        case "FunctionExpression":
        case "Identifier":
        case "Literal":
        case "LogicalExpression":
        case "MemberExpression":
        case "NewExpression":
        case "ObjectExpression":
        case "SequenceExpression":
        case "ThisExpression":
        case "UnaryExpression":
        case "UpdateExpression":
          return !0;
      }
      return !1;
    }
    function t(f) {
      if (f == null)
        return !1;
      switch (f.type) {
        case "DoWhileStatement":
        case "ForInStatement":
        case "ForStatement":
        case "WhileStatement":
          return !0;
      }
      return !1;
    }
    function a(f) {
      if (f == null)
        return !1;
      switch (f.type) {
        case "BlockStatement":
        case "BreakStatement":
        case "ContinueStatement":
        case "DebuggerStatement":
        case "DoWhileStatement":
        case "EmptyStatement":
        case "ExpressionStatement":
        case "ForInStatement":
        case "ForStatement":
        case "IfStatement":
        case "LabeledStatement":
        case "ReturnStatement":
        case "SwitchStatement":
        case "ThrowStatement":
        case "TryStatement":
        case "VariableDeclaration":
        case "WhileStatement":
        case "WithStatement":
          return !0;
      }
      return !1;
    }
    function o(f) {
      return a(f) || f != null && f.type === "FunctionDeclaration";
    }
    function u(f) {
      switch (f.type) {
        case "IfStatement":
          return f.alternate != null ? f.alternate : f.consequent;
        case "LabeledStatement":
        case "ForStatement":
        case "ForInStatement":
        case "WhileStatement":
        case "WithStatement":
          return f.body;
      }
      return null;
    }
    function l(f) {
      var p;
      if (f.type !== "IfStatement" || f.alternate == null)
        return !1;
      p = f.consequent;
      do {
        if (p.type === "IfStatement" && p.alternate == null)
          return !0;
        p = u(p);
      } while (p);
      return !1;
    }
    ast.exports = {
      isExpression: e,
      isStatement: a,
      isIterationStatement: t,
      isSourceElement: o,
      isProblematicIfStatement: l,
      trailingStatement: u
    };
  }()), ast.exports;
}
var code = { exports: {} }, hasRequiredCode;
function requireCode() {
  return hasRequiredCode || (hasRequiredCode = 1, function() {
    var e, t, a, o, u, l;
    t = {
      // ECMAScript 5.1/Unicode v9.0.0 NonAsciiIdentifierStart:
      NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
      // ECMAScript 5.1/Unicode v9.0.0 NonAsciiIdentifierPart:
      NonAsciiIdentifierPart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/
    }, e = {
      // ECMAScript 6/Unicode v9.0.0 NonAsciiIdentifierStart:
      NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/,
      // ECMAScript 6/Unicode v9.0.0 NonAsciiIdentifierPart:
      NonAsciiIdentifierPart: /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
    };
    function f(I) {
      return 48 <= I && I <= 57;
    }
    function p(I) {
      return 48 <= I && I <= 57 || // 0..9
      97 <= I && I <= 102 || // a..f
      65 <= I && I <= 70;
    }
    function g(I) {
      return I >= 48 && I <= 55;
    }
    a = [
      5760,
      8192,
      8193,
      8194,
      8195,
      8196,
      8197,
      8198,
      8199,
      8200,
      8201,
      8202,
      8239,
      8287,
      12288,
      65279
    ];
    function d(I) {
      return I === 32 || I === 9 || I === 11 || I === 12 || I === 160 || I >= 5760 && a.indexOf(I) >= 0;
    }
    function b(I) {
      return I === 10 || I === 13 || I === 8232 || I === 8233;
    }
    function F(I) {
      if (I <= 65535)
        return String.fromCharCode(I);
      var V = String.fromCharCode(Math.floor((I - 65536) / 1024) + 55296), U = String.fromCharCode((I - 65536) % 1024 + 56320);
      return V + U;
    }
    for (o = new Array(128), l = 0; l < 128; ++l)
      o[l] = l >= 97 && l <= 122 || // a..z
      l >= 65 && l <= 90 || // A..Z
      l === 36 || l === 95;
    for (u = new Array(128), l = 0; l < 128; ++l)
      u[l] = l >= 97 && l <= 122 || // a..z
      l >= 65 && l <= 90 || // A..Z
      l >= 48 && l <= 57 || // 0..9
      l === 36 || l === 95;
    function E(I) {
      return I < 128 ? o[I] : t.NonAsciiIdentifierStart.test(F(I));
    }
    function S(I) {
      return I < 128 ? u[I] : t.NonAsciiIdentifierPart.test(F(I));
    }
    function R(I) {
      return I < 128 ? o[I] : e.NonAsciiIdentifierStart.test(F(I));
    }
    function k(I) {
      return I < 128 ? u[I] : e.NonAsciiIdentifierPart.test(F(I));
    }
    code.exports = {
      isDecimalDigit: f,
      isHexDigit: p,
      isOctalDigit: g,
      isWhiteSpace: d,
      isLineTerminator: b,
      isIdentifierStartES5: E,
      isIdentifierPartES5: S,
      isIdentifierStartES6: R,
      isIdentifierPartES6: k
    };
  }()), code.exports;
}
var keyword = { exports: {} }, hasRequiredKeyword;
function requireKeyword() {
  return hasRequiredKeyword || (hasRequiredKeyword = 1, function() {
    var e = requireCode();
    function t(E) {
      switch (E) {
        case "implements":
        case "interface":
        case "package":
        case "private":
        case "protected":
        case "public":
        case "static":
        case "let":
          return !0;
        default:
          return !1;
      }
    }
    function a(E, S) {
      return !S && E === "yield" ? !1 : o(E, S);
    }
    function o(E, S) {
      if (S && t(E))
        return !0;
      switch (E.length) {
        case 2:
          return E === "if" || E === "in" || E === "do";
        case 3:
          return E === "var" || E === "for" || E === "new" || E === "try";
        case 4:
          return E === "this" || E === "else" || E === "case" || E === "void" || E === "with" || E === "enum";
        case 5:
          return E === "while" || E === "break" || E === "catch" || E === "throw" || E === "const" || E === "yield" || E === "class" || E === "super";
        case 6:
          return E === "return" || E === "typeof" || E === "delete" || E === "switch" || E === "export" || E === "import";
        case 7:
          return E === "default" || E === "finally" || E === "extends";
        case 8:
          return E === "function" || E === "continue" || E === "debugger";
        case 10:
          return E === "instanceof";
        default:
          return !1;
      }
    }
    function u(E, S) {
      return E === "null" || E === "true" || E === "false" || a(E, S);
    }
    function l(E, S) {
      return E === "null" || E === "true" || E === "false" || o(E, S);
    }
    function f(E) {
      return E === "eval" || E === "arguments";
    }
    function p(E) {
      var S, R, k;
      if (E.length === 0 || (k = E.charCodeAt(0), !e.isIdentifierStartES5(k)))
        return !1;
      for (S = 1, R = E.length; S < R; ++S)
        if (k = E.charCodeAt(S), !e.isIdentifierPartES5(k))
          return !1;
      return !0;
    }
    function g(E, S) {
      return (E - 55296) * 1024 + (S - 56320) + 65536;
    }
    function d(E) {
      var S, R, k, I, V;
      if (E.length === 0)
        return !1;
      for (V = e.isIdentifierStartES6, S = 0, R = E.length; S < R; ++S) {
        if (k = E.charCodeAt(S), 55296 <= k && k <= 56319) {
          if (++S, S >= R || (I = E.charCodeAt(S), !(56320 <= I && I <= 57343)))
            return !1;
          k = g(k, I);
        }
        if (!V(k))
          return !1;
        V = e.isIdentifierPartES6;
      }
      return !0;
    }
    function b(E, S) {
      return p(E) && !u(E, S);
    }
    function F(E, S) {
      return d(E) && !l(E, S);
    }
    keyword.exports = {
      isKeywordES5: a,
      isKeywordES6: o,
      isReservedWordES5: u,
      isReservedWordES6: l,
      isRestrictedWord: f,
      isIdentifierNameES5: p,
      isIdentifierNameES6: d,
      isIdentifierES5: b,
      isIdentifierES6: F
    };
  }()), keyword.exports;
}
var hasRequiredUtils;
function requireUtils() {
  return hasRequiredUtils || (hasRequiredUtils = 1, function() {
    utils.ast = requireAst(), utils.code = requireCode(), utils.keyword = requireKeyword();
  }()), utils;
}
var sourceMap = {}, sourceMapGenerator = {}, base64Vlq = {}, base64 = {}, hasRequiredBase64;
function requireBase64() {
  if (hasRequiredBase64) return base64;
  hasRequiredBase64 = 1;
  var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
  return base64.encode = function(t) {
    if (0 <= t && t < e.length)
      return e[t];
    throw new TypeError("Must be between 0 and 63: " + t);
  }, base64.decode = function(t) {
    var a = 65, o = 90, u = 97, l = 122, f = 48, p = 57, g = 43, d = 47, b = 26, F = 52;
    return a <= t && t <= o ? t - a : u <= t && t <= l ? t - u + b : f <= t && t <= p ? t - f + F : t == g ? 62 : t == d ? 63 : -1;
  }, base64;
}
var hasRequiredBase64Vlq;
function requireBase64Vlq() {
  if (hasRequiredBase64Vlq) return base64Vlq;
  hasRequiredBase64Vlq = 1;
  var e = requireBase64(), t = 5, a = 1 << t, o = a - 1, u = a;
  function l(p) {
    return p < 0 ? (-p << 1) + 1 : (p << 1) + 0;
  }
  function f(p) {
    var g = (p & 1) === 1, d = p >> 1;
    return g ? -d : d;
  }
  return base64Vlq.encode = function(g) {
    var d = "", b, F = l(g);
    do
      b = F & o, F >>>= t, F > 0 && (b |= u), d += e.encode(b);
    while (F > 0);
    return d;
  }, base64Vlq.decode = function(g, d, b) {
    var F = g.length, E = 0, S = 0, R, k;
    do {
      if (d >= F)
        throw new Error("Expected more digits in base 64 VLQ value.");
      if (k = e.decode(g.charCodeAt(d++)), k === -1)
        throw new Error("Invalid base64 digit: " + g.charAt(d - 1));
      R = !!(k & u), k &= o, E = E + (k << S), S += t;
    } while (R);
    b.value = f(E), b.rest = d;
  }, base64Vlq;
}
var util = {}, hasRequiredUtil;
function requireUtil() {
  return hasRequiredUtil || (hasRequiredUtil = 1, function(e) {
    function t(H, z, j) {
      if (z in H)
        return H[z];
      if (arguments.length === 3)
        return j;
      throw new Error('"' + z + '" is a required argument.');
    }
    e.getArg = t;
    var a = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/, o = /^data:.+\,.+$/;
    function u(H) {
      var z = H.match(a);
      return z ? {
        scheme: z[1],
        auth: z[2],
        host: z[3],
        port: z[4],
        path: z[5]
      } : null;
    }
    e.urlParse = u;
    function l(H) {
      var z = "";
      return H.scheme && (z += H.scheme + ":"), z += "//", H.auth && (z += H.auth + "@"), H.host && (z += H.host), H.port && (z += ":" + H.port), H.path && (z += H.path), z;
    }
    e.urlGenerate = l;
    function f(H) {
      var z = H, j = u(H);
      if (j) {
        if (!j.path)
          return H;
        z = j.path;
      }
      for (var ee = e.isAbsolute(z), te = z.split(/\/+/), de, ie = 0, he = te.length - 1; he >= 0; he--)
        de = te[he], de === "." ? te.splice(he, 1) : de === ".." ? ie++ : ie > 0 && (de === "" ? (te.splice(he + 1, ie), ie = 0) : (te.splice(he, 2), ie--));
      return z = te.join("/"), z === "" && (z = ee ? "/" : "."), j ? (j.path = z, l(j)) : z;
    }
    e.normalize = f;
    function p(H, z) {
      H === "" && (H = "."), z === "" && (z = ".");
      var j = u(z), ee = u(H);
      if (ee && (H = ee.path || "/"), j && !j.scheme)
        return ee && (j.scheme = ee.scheme), l(j);
      if (j || z.match(o))
        return z;
      if (ee && !ee.host && !ee.path)
        return ee.host = z, l(ee);
      var te = z.charAt(0) === "/" ? z : f(H.replace(/\/+$/, "") + "/" + z);
      return ee ? (ee.path = te, l(ee)) : te;
    }
    e.join = p, e.isAbsolute = function(H) {
      return H.charAt(0) === "/" || a.test(H);
    };
    function g(H, z) {
      H === "" && (H = "."), H = H.replace(/\/$/, "");
      for (var j = 0; z.indexOf(H + "/") !== 0; ) {
        var ee = H.lastIndexOf("/");
        if (ee < 0 || (H = H.slice(0, ee), H.match(/^([^\/]+:\/)?\/*$/)))
          return z;
        ++j;
      }
      return Array(j + 1).join("../") + z.substr(H.length + 1);
    }
    e.relative = g;
    var d = function() {
      var H = /* @__PURE__ */ Object.create(null);
      return !("__proto__" in H);
    }();
    function b(H) {
      return H;
    }
    function F(H) {
      return S(H) ? "$" + H : H;
    }
    e.toSetString = d ? b : F;
    function E(H) {
      return S(H) ? H.slice(1) : H;
    }
    e.fromSetString = d ? b : E;
    function S(H) {
      if (!H)
        return !1;
      var z = H.length;
      if (z < 9 || H.charCodeAt(z - 1) !== 95 || H.charCodeAt(z - 2) !== 95 || H.charCodeAt(z - 3) !== 111 || H.charCodeAt(z - 4) !== 116 || H.charCodeAt(z - 5) !== 111 || H.charCodeAt(z - 6) !== 114 || H.charCodeAt(z - 7) !== 112 || H.charCodeAt(z - 8) !== 95 || H.charCodeAt(z - 9) !== 95)
        return !1;
      for (var j = z - 10; j >= 0; j--)
        if (H.charCodeAt(j) !== 36)
          return !1;
      return !0;
    }
    function R(H, z, j) {
      var ee = I(H.source, z.source);
      return ee !== 0 || (ee = H.originalLine - z.originalLine, ee !== 0) || (ee = H.originalColumn - z.originalColumn, ee !== 0 || j) || (ee = H.generatedColumn - z.generatedColumn, ee !== 0) || (ee = H.generatedLine - z.generatedLine, ee !== 0) ? ee : I(H.name, z.name);
    }
    e.compareByOriginalPositions = R;
    function k(H, z, j) {
      var ee = H.generatedLine - z.generatedLine;
      return ee !== 0 || (ee = H.generatedColumn - z.generatedColumn, ee !== 0 || j) || (ee = I(H.source, z.source), ee !== 0) || (ee = H.originalLine - z.originalLine, ee !== 0) || (ee = H.originalColumn - z.originalColumn, ee !== 0) ? ee : I(H.name, z.name);
    }
    e.compareByGeneratedPositionsDeflated = k;
    function I(H, z) {
      return H === z ? 0 : H === null ? 1 : z === null ? -1 : H > z ? 1 : -1;
    }
    function V(H, z) {
      var j = H.generatedLine - z.generatedLine;
      return j !== 0 || (j = H.generatedColumn - z.generatedColumn, j !== 0) || (j = I(H.source, z.source), j !== 0) || (j = H.originalLine - z.originalLine, j !== 0) || (j = H.originalColumn - z.originalColumn, j !== 0) ? j : I(H.name, z.name);
    }
    e.compareByGeneratedPositionsInflated = V;
    function U(H) {
      return JSON.parse(H.replace(/^\)]}'[^\n]*\n/, ""));
    }
    e.parseSourceMapInput = U;
    function q(H, z, j) {
      if (z = z || "", H && (H[H.length - 1] !== "/" && z[0] !== "/" && (H += "/"), z = H + z), j) {
        var ee = u(j);
        if (!ee)
          throw new Error("sourceMapURL could not be parsed");
        if (ee.path) {
          var te = ee.path.lastIndexOf("/");
          te >= 0 && (ee.path = ee.path.substring(0, te + 1));
        }
        z = p(l(ee), z);
      }
      return f(z);
    }
    e.computeSourceURL = q;
  }(util)), util;
}
var arraySet = {}, hasRequiredArraySet;
function requireArraySet() {
  if (hasRequiredArraySet) return arraySet;
  hasRequiredArraySet = 1;
  var e = requireUtil(), t = Object.prototype.hasOwnProperty, a = typeof Map < "u";
  function o() {
    this._array = [], this._set = a ? /* @__PURE__ */ new Map() : /* @__PURE__ */ Object.create(null);
  }
  return o.fromArray = function(l, f) {
    for (var p = new o(), g = 0, d = l.length; g < d; g++)
      p.add(l[g], f);
    return p;
  }, o.prototype.size = function() {
    return a ? this._set.size : Object.getOwnPropertyNames(this._set).length;
  }, o.prototype.add = function(l, f) {
    var p = a ? l : e.toSetString(l), g = a ? this.has(l) : t.call(this._set, p), d = this._array.length;
    (!g || f) && this._array.push(l), g || (a ? this._set.set(l, d) : this._set[p] = d);
  }, o.prototype.has = function(l) {
    if (a)
      return this._set.has(l);
    var f = e.toSetString(l);
    return t.call(this._set, f);
  }, o.prototype.indexOf = function(l) {
    if (a) {
      var f = this._set.get(l);
      if (f >= 0)
        return f;
    } else {
      var p = e.toSetString(l);
      if (t.call(this._set, p))
        return this._set[p];
    }
    throw new Error('"' + l + '" is not in the set.');
  }, o.prototype.at = function(l) {
    if (l >= 0 && l < this._array.length)
      return this._array[l];
    throw new Error("No element indexed by " + l);
  }, o.prototype.toArray = function() {
    return this._array.slice();
  }, arraySet.ArraySet = o, arraySet;
}
var mappingList = {}, hasRequiredMappingList;
function requireMappingList() {
  if (hasRequiredMappingList) return mappingList;
  hasRequiredMappingList = 1;
  var e = requireUtil();
  function t(o, u) {
    var l = o.generatedLine, f = u.generatedLine, p = o.generatedColumn, g = u.generatedColumn;
    return f > l || f == l && g >= p || e.compareByGeneratedPositionsInflated(o, u) <= 0;
  }
  function a() {
    this._array = [], this._sorted = !0, this._last = { generatedLine: -1, generatedColumn: 0 };
  }
  return a.prototype.unsortedForEach = function(u, l) {
    this._array.forEach(u, l);
  }, a.prototype.add = function(u) {
    t(this._last, u) ? (this._last = u, this._array.push(u)) : (this._sorted = !1, this._array.push(u));
  }, a.prototype.toArray = function() {
    return this._sorted || (this._array.sort(e.compareByGeneratedPositionsInflated), this._sorted = !0), this._array;
  }, mappingList.MappingList = a, mappingList;
}
var hasRequiredSourceMapGenerator;
function requireSourceMapGenerator() {
  if (hasRequiredSourceMapGenerator) return sourceMapGenerator;
  hasRequiredSourceMapGenerator = 1;
  var e = requireBase64Vlq(), t = requireUtil(), a = requireArraySet().ArraySet, o = requireMappingList().MappingList;
  function u(l) {
    l || (l = {}), this._file = t.getArg(l, "file", null), this._sourceRoot = t.getArg(l, "sourceRoot", null), this._skipValidation = t.getArg(l, "skipValidation", !1), this._sources = new a(), this._names = new a(), this._mappings = new o(), this._sourcesContents = null;
  }
  return u.prototype._version = 3, u.fromSourceMap = function(f) {
    var p = f.sourceRoot, g = new u({
      file: f.file,
      sourceRoot: p
    });
    return f.eachMapping(function(d) {
      var b = {
        generated: {
          line: d.generatedLine,
          column: d.generatedColumn
        }
      };
      d.source != null && (b.source = d.source, p != null && (b.source = t.relative(p, b.source)), b.original = {
        line: d.originalLine,
        column: d.originalColumn
      }, d.name != null && (b.name = d.name)), g.addMapping(b);
    }), f.sources.forEach(function(d) {
      var b = d;
      p !== null && (b = t.relative(p, d)), g._sources.has(b) || g._sources.add(b);
      var F = f.sourceContentFor(d);
      F != null && g.setSourceContent(d, F);
    }), g;
  }, u.prototype.addMapping = function(f) {
    var p = t.getArg(f, "generated"), g = t.getArg(f, "original", null), d = t.getArg(f, "source", null), b = t.getArg(f, "name", null);
    this._skipValidation || this._validateMapping(p, g, d, b), d != null && (d = String(d), this._sources.has(d) || this._sources.add(d)), b != null && (b = String(b), this._names.has(b) || this._names.add(b)), this._mappings.add({
      generatedLine: p.line,
      generatedColumn: p.column,
      originalLine: g != null && g.line,
      originalColumn: g != null && g.column,
      source: d,
      name: b
    });
  }, u.prototype.setSourceContent = function(f, p) {
    var g = f;
    this._sourceRoot != null && (g = t.relative(this._sourceRoot, g)), p != null ? (this._sourcesContents || (this._sourcesContents = /* @__PURE__ */ Object.create(null)), this._sourcesContents[t.toSetString(g)] = p) : this._sourcesContents && (delete this._sourcesContents[t.toSetString(g)], Object.keys(this._sourcesContents).length === 0 && (this._sourcesContents = null));
  }, u.prototype.applySourceMap = function(f, p, g) {
    var d = p;
    if (p == null) {
      if (f.file == null)
        throw new Error(
          `SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`
        );
      d = f.file;
    }
    var b = this._sourceRoot;
    b != null && (d = t.relative(b, d));
    var F = new a(), E = new a();
    this._mappings.unsortedForEach(function(S) {
      if (S.source === d && S.originalLine != null) {
        var R = f.originalPositionFor({
          line: S.originalLine,
          column: S.originalColumn
        });
        R.source != null && (S.source = R.source, g != null && (S.source = t.join(g, S.source)), b != null && (S.source = t.relative(b, S.source)), S.originalLine = R.line, S.originalColumn = R.column, R.name != null && (S.name = R.name));
      }
      var k = S.source;
      k != null && !F.has(k) && F.add(k);
      var I = S.name;
      I != null && !E.has(I) && E.add(I);
    }, this), this._sources = F, this._names = E, f.sources.forEach(function(S) {
      var R = f.sourceContentFor(S);
      R != null && (g != null && (S = t.join(g, S)), b != null && (S = t.relative(b, S)), this.setSourceContent(S, R));
    }, this);
  }, u.prototype._validateMapping = function(f, p, g, d) {
    if (p && typeof p.line != "number" && typeof p.column != "number")
      throw new Error(
        "original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values."
      );
    if (!(f && "line" in f && "column" in f && f.line > 0 && f.column >= 0 && !p && !g && !d)) {
      if (f && "line" in f && "column" in f && p && "line" in p && "column" in p && f.line > 0 && f.column >= 0 && p.line > 0 && p.column >= 0 && g)
        return;
      throw new Error("Invalid mapping: " + JSON.stringify({
        generated: f,
        source: g,
        original: p,
        name: d
      }));
    }
  }, u.prototype._serializeMappings = function() {
    for (var f = 0, p = 1, g = 0, d = 0, b = 0, F = 0, E = "", S, R, k, I, V = this._mappings.toArray(), U = 0, q = V.length; U < q; U++) {
      if (R = V[U], S = "", R.generatedLine !== p)
        for (f = 0; R.generatedLine !== p; )
          S += ";", p++;
      else if (U > 0) {
        if (!t.compareByGeneratedPositionsInflated(R, V[U - 1]))
          continue;
        S += ",";
      }
      S += e.encode(R.generatedColumn - f), f = R.generatedColumn, R.source != null && (I = this._sources.indexOf(R.source), S += e.encode(I - F), F = I, S += e.encode(R.originalLine - 1 - d), d = R.originalLine - 1, S += e.encode(R.originalColumn - g), g = R.originalColumn, R.name != null && (k = this._names.indexOf(R.name), S += e.encode(k - b), b = k)), E += S;
    }
    return E;
  }, u.prototype._generateSourcesContent = function(f, p) {
    return f.map(function(g) {
      if (!this._sourcesContents)
        return null;
      p != null && (g = t.relative(p, g));
      var d = t.toSetString(g);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, d) ? this._sourcesContents[d] : null;
    }, this);
  }, u.prototype.toJSON = function() {
    var f = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    return this._file != null && (f.file = this._file), this._sourceRoot != null && (f.sourceRoot = this._sourceRoot), this._sourcesContents && (f.sourcesContent = this._generateSourcesContent(f.sources, f.sourceRoot)), f;
  }, u.prototype.toString = function() {
    return JSON.stringify(this.toJSON());
  }, sourceMapGenerator.SourceMapGenerator = u, sourceMapGenerator;
}
var sourceMapConsumer = {}, binarySearch = {}, hasRequiredBinarySearch;
function requireBinarySearch() {
  return hasRequiredBinarySearch || (hasRequiredBinarySearch = 1, function(e) {
    e.GREATEST_LOWER_BOUND = 1, e.LEAST_UPPER_BOUND = 2;
    function t(a, o, u, l, f, p) {
      var g = Math.floor((o - a) / 2) + a, d = f(u, l[g], !0);
      return d === 0 ? g : d > 0 ? o - g > 1 ? t(g, o, u, l, f, p) : p == e.LEAST_UPPER_BOUND ? o < l.length ? o : -1 : g : g - a > 1 ? t(a, g, u, l, f, p) : p == e.LEAST_UPPER_BOUND ? g : a < 0 ? -1 : a;
    }
    e.search = function(o, u, l, f) {
      if (u.length === 0)
        return -1;
      var p = t(
        -1,
        u.length,
        o,
        u,
        l,
        f || e.GREATEST_LOWER_BOUND
      );
      if (p < 0)
        return -1;
      for (; p - 1 >= 0 && l(u[p], u[p - 1], !0) === 0; )
        --p;
      return p;
    };
  }(binarySearch)), binarySearch;
}
var quickSort = {}, hasRequiredQuickSort;
function requireQuickSort() {
  if (hasRequiredQuickSort) return quickSort;
  hasRequiredQuickSort = 1;
  function e(o, u, l) {
    var f = o[u];
    o[u] = o[l], o[l] = f;
  }
  function t(o, u) {
    return Math.round(o + Math.random() * (u - o));
  }
  function a(o, u, l, f) {
    if (l < f) {
      var p = t(l, f), g = l - 1;
      e(o, p, f);
      for (var d = o[f], b = l; b < f; b++)
        u(o[b], d) <= 0 && (g += 1, e(o, g, b));
      e(o, g + 1, b);
      var F = g + 1;
      a(o, u, l, F - 1), a(o, u, F + 1, f);
    }
  }
  return quickSort.quickSort = function(o, u) {
    a(o, u, 0, o.length - 1);
  }, quickSort;
}
var hasRequiredSourceMapConsumer;
function requireSourceMapConsumer() {
  if (hasRequiredSourceMapConsumer) return sourceMapConsumer;
  hasRequiredSourceMapConsumer = 1;
  var e = requireUtil(), t = requireBinarySearch(), a = requireArraySet().ArraySet, o = requireBase64Vlq(), u = requireQuickSort().quickSort;
  function l(d, b) {
    var F = d;
    return typeof d == "string" && (F = e.parseSourceMapInput(d)), F.sections != null ? new g(F, b) : new f(F, b);
  }
  l.fromSourceMap = function(d, b) {
    return f.fromSourceMap(d, b);
  }, l.prototype._version = 3, l.prototype.__generatedMappings = null, Object.defineProperty(l.prototype, "_generatedMappings", {
    configurable: !0,
    enumerable: !0,
    get: function() {
      return this.__generatedMappings || this._parseMappings(this._mappings, this.sourceRoot), this.__generatedMappings;
    }
  }), l.prototype.__originalMappings = null, Object.defineProperty(l.prototype, "_originalMappings", {
    configurable: !0,
    enumerable: !0,
    get: function() {
      return this.__originalMappings || this._parseMappings(this._mappings, this.sourceRoot), this.__originalMappings;
    }
  }), l.prototype._charIsMappingSeparator = function(b, F) {
    var E = b.charAt(F);
    return E === ";" || E === ",";
  }, l.prototype._parseMappings = function(b, F) {
    throw new Error("Subclasses must implement _parseMappings");
  }, l.GENERATED_ORDER = 1, l.ORIGINAL_ORDER = 2, l.GREATEST_LOWER_BOUND = 1, l.LEAST_UPPER_BOUND = 2, l.prototype.eachMapping = function(b, F, E) {
    var S = F || null, R = E || l.GENERATED_ORDER, k;
    switch (R) {
      case l.GENERATED_ORDER:
        k = this._generatedMappings;
        break;
      case l.ORIGINAL_ORDER:
        k = this._originalMappings;
        break;
      default:
        throw new Error("Unknown order of iteration.");
    }
    var I = this.sourceRoot;
    k.map(function(V) {
      var U = V.source === null ? null : this._sources.at(V.source);
      return U = e.computeSourceURL(I, U, this._sourceMapURL), {
        source: U,
        generatedLine: V.generatedLine,
        generatedColumn: V.generatedColumn,
        originalLine: V.originalLine,
        originalColumn: V.originalColumn,
        name: V.name === null ? null : this._names.at(V.name)
      };
    }, this).forEach(b, S);
  }, l.prototype.allGeneratedPositionsFor = function(b) {
    var F = e.getArg(b, "line"), E = {
      source: e.getArg(b, "source"),
      originalLine: F,
      originalColumn: e.getArg(b, "column", 0)
    };
    if (E.source = this._findSourceIndex(E.source), E.source < 0)
      return [];
    var S = [], R = this._findMapping(
      E,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      e.compareByOriginalPositions,
      t.LEAST_UPPER_BOUND
    );
    if (R >= 0) {
      var k = this._originalMappings[R];
      if (b.column === void 0)
        for (var I = k.originalLine; k && k.originalLine === I; )
          S.push({
            line: e.getArg(k, "generatedLine", null),
            column: e.getArg(k, "generatedColumn", null),
            lastColumn: e.getArg(k, "lastGeneratedColumn", null)
          }), k = this._originalMappings[++R];
      else
        for (var V = k.originalColumn; k && k.originalLine === F && k.originalColumn == V; )
          S.push({
            line: e.getArg(k, "generatedLine", null),
            column: e.getArg(k, "generatedColumn", null),
            lastColumn: e.getArg(k, "lastGeneratedColumn", null)
          }), k = this._originalMappings[++R];
    }
    return S;
  }, sourceMapConsumer.SourceMapConsumer = l;
  function f(d, b) {
    var F = d;
    typeof d == "string" && (F = e.parseSourceMapInput(d));
    var E = e.getArg(F, "version"), S = e.getArg(F, "sources"), R = e.getArg(F, "names", []), k = e.getArg(F, "sourceRoot", null), I = e.getArg(F, "sourcesContent", null), V = e.getArg(F, "mappings"), U = e.getArg(F, "file", null);
    if (E != this._version)
      throw new Error("Unsupported version: " + E);
    k && (k = e.normalize(k)), S = S.map(String).map(e.normalize).map(function(q) {
      return k && e.isAbsolute(k) && e.isAbsolute(q) ? e.relative(k, q) : q;
    }), this._names = a.fromArray(R.map(String), !0), this._sources = a.fromArray(S, !0), this._absoluteSources = this._sources.toArray().map(function(q) {
      return e.computeSourceURL(k, q, b);
    }), this.sourceRoot = k, this.sourcesContent = I, this._mappings = V, this._sourceMapURL = b, this.file = U;
  }
  f.prototype = Object.create(l.prototype), f.prototype.consumer = l, f.prototype._findSourceIndex = function(d) {
    var b = d;
    if (this.sourceRoot != null && (b = e.relative(this.sourceRoot, b)), this._sources.has(b))
      return this._sources.indexOf(b);
    var F;
    for (F = 0; F < this._absoluteSources.length; ++F)
      if (this._absoluteSources[F] == d)
        return F;
    return -1;
  }, f.fromSourceMap = function(b, F) {
    var E = Object.create(f.prototype), S = E._names = a.fromArray(b._names.toArray(), !0), R = E._sources = a.fromArray(b._sources.toArray(), !0);
    E.sourceRoot = b._sourceRoot, E.sourcesContent = b._generateSourcesContent(
      E._sources.toArray(),
      E.sourceRoot
    ), E.file = b._file, E._sourceMapURL = F, E._absoluteSources = E._sources.toArray().map(function(j) {
      return e.computeSourceURL(E.sourceRoot, j, F);
    });
    for (var k = b._mappings.toArray().slice(), I = E.__generatedMappings = [], V = E.__originalMappings = [], U = 0, q = k.length; U < q; U++) {
      var H = k[U], z = new p();
      z.generatedLine = H.generatedLine, z.generatedColumn = H.generatedColumn, H.source && (z.source = R.indexOf(H.source), z.originalLine = H.originalLine, z.originalColumn = H.originalColumn, H.name && (z.name = S.indexOf(H.name)), V.push(z)), I.push(z);
    }
    return u(E.__originalMappings, e.compareByOriginalPositions), E;
  }, f.prototype._version = 3, Object.defineProperty(f.prototype, "sources", {
    get: function() {
      return this._absoluteSources.slice();
    }
  });
  function p() {
    this.generatedLine = 0, this.generatedColumn = 0, this.source = null, this.originalLine = null, this.originalColumn = null, this.name = null;
  }
  f.prototype._parseMappings = function(b, F) {
    for (var E = 1, S = 0, R = 0, k = 0, I = 0, V = 0, U = b.length, q = 0, H = {}, z = {}, j = [], ee = [], te, de, ie, he, fe; q < U; )
      if (b.charAt(q) === ";")
        E++, q++, S = 0;
      else if (b.charAt(q) === ",")
        q++;
      else {
        for (te = new p(), te.generatedLine = E, he = q; he < U && !this._charIsMappingSeparator(b, he); he++)
          ;
        if (de = b.slice(q, he), ie = H[de], ie)
          q += de.length;
        else {
          for (ie = []; q < he; )
            o.decode(b, q, z), fe = z.value, q = z.rest, ie.push(fe);
          if (ie.length === 2)
            throw new Error("Found a source, but no line and column");
          if (ie.length === 3)
            throw new Error("Found a source and line, but no column");
          H[de] = ie;
        }
        te.generatedColumn = S + ie[0], S = te.generatedColumn, ie.length > 1 && (te.source = I + ie[1], I += ie[1], te.originalLine = R + ie[2], R = te.originalLine, te.originalLine += 1, te.originalColumn = k + ie[3], k = te.originalColumn, ie.length > 4 && (te.name = V + ie[4], V += ie[4])), ee.push(te), typeof te.originalLine == "number" && j.push(te);
      }
    u(ee, e.compareByGeneratedPositionsDeflated), this.__generatedMappings = ee, u(j, e.compareByOriginalPositions), this.__originalMappings = j;
  }, f.prototype._findMapping = function(b, F, E, S, R, k) {
    if (b[E] <= 0)
      throw new TypeError("Line must be greater than or equal to 1, got " + b[E]);
    if (b[S] < 0)
      throw new TypeError("Column must be greater than or equal to 0, got " + b[S]);
    return t.search(b, F, R, k);
  }, f.prototype.computeColumnSpans = function() {
    for (var b = 0; b < this._generatedMappings.length; ++b) {
      var F = this._generatedMappings[b];
      if (b + 1 < this._generatedMappings.length) {
        var E = this._generatedMappings[b + 1];
        if (F.generatedLine === E.generatedLine) {
          F.lastGeneratedColumn = E.generatedColumn - 1;
          continue;
        }
      }
      F.lastGeneratedColumn = 1 / 0;
    }
  }, f.prototype.originalPositionFor = function(b) {
    var F = {
      generatedLine: e.getArg(b, "line"),
      generatedColumn: e.getArg(b, "column")
    }, E = this._findMapping(
      F,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      e.compareByGeneratedPositionsDeflated,
      e.getArg(b, "bias", l.GREATEST_LOWER_BOUND)
    );
    if (E >= 0) {
      var S = this._generatedMappings[E];
      if (S.generatedLine === F.generatedLine) {
        var R = e.getArg(S, "source", null);
        R !== null && (R = this._sources.at(R), R = e.computeSourceURL(this.sourceRoot, R, this._sourceMapURL));
        var k = e.getArg(S, "name", null);
        return k !== null && (k = this._names.at(k)), {
          source: R,
          line: e.getArg(S, "originalLine", null),
          column: e.getArg(S, "originalColumn", null),
          name: k
        };
      }
    }
    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  }, f.prototype.hasContentsOfAllSources = function() {
    return this.sourcesContent ? this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function(b) {
      return b == null;
    }) : !1;
  }, f.prototype.sourceContentFor = function(b, F) {
    if (!this.sourcesContent)
      return null;
    var E = this._findSourceIndex(b);
    if (E >= 0)
      return this.sourcesContent[E];
    var S = b;
    this.sourceRoot != null && (S = e.relative(this.sourceRoot, S));
    var R;
    if (this.sourceRoot != null && (R = e.urlParse(this.sourceRoot))) {
      var k = S.replace(/^file:\/\//, "");
      if (R.scheme == "file" && this._sources.has(k))
        return this.sourcesContent[this._sources.indexOf(k)];
      if ((!R.path || R.path == "/") && this._sources.has("/" + S))
        return this.sourcesContent[this._sources.indexOf("/" + S)];
    }
    if (F)
      return null;
    throw new Error('"' + S + '" is not in the SourceMap.');
  }, f.prototype.generatedPositionFor = function(b) {
    var F = e.getArg(b, "source");
    if (F = this._findSourceIndex(F), F < 0)
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    var E = {
      source: F,
      originalLine: e.getArg(b, "line"),
      originalColumn: e.getArg(b, "column")
    }, S = this._findMapping(
      E,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      e.compareByOriginalPositions,
      e.getArg(b, "bias", l.GREATEST_LOWER_BOUND)
    );
    if (S >= 0) {
      var R = this._originalMappings[S];
      if (R.source === E.source)
        return {
          line: e.getArg(R, "generatedLine", null),
          column: e.getArg(R, "generatedColumn", null),
          lastColumn: e.getArg(R, "lastGeneratedColumn", null)
        };
    }
    return {
      line: null,
      column: null,
      lastColumn: null
    };
  }, sourceMapConsumer.BasicSourceMapConsumer = f;
  function g(d, b) {
    var F = d;
    typeof d == "string" && (F = e.parseSourceMapInput(d));
    var E = e.getArg(F, "version"), S = e.getArg(F, "sections");
    if (E != this._version)
      throw new Error("Unsupported version: " + E);
    this._sources = new a(), this._names = new a();
    var R = {
      line: -1,
      column: 0
    };
    this._sections = S.map(function(k) {
      if (k.url)
        throw new Error("Support for url field in sections not implemented.");
      var I = e.getArg(k, "offset"), V = e.getArg(I, "line"), U = e.getArg(I, "column");
      if (V < R.line || V === R.line && U < R.column)
        throw new Error("Section offsets must be ordered and non-overlapping.");
      return R = I, {
        generatedOffset: {
          // The offset fields are 0-based, but we use 1-based indices when
          // encoding/decoding from VLQ.
          generatedLine: V + 1,
          generatedColumn: U + 1
        },
        consumer: new l(e.getArg(k, "map"), b)
      };
    });
  }
  return g.prototype = Object.create(l.prototype), g.prototype.constructor = l, g.prototype._version = 3, Object.defineProperty(g.prototype, "sources", {
    get: function() {
      for (var d = [], b = 0; b < this._sections.length; b++)
        for (var F = 0; F < this._sections[b].consumer.sources.length; F++)
          d.push(this._sections[b].consumer.sources[F]);
      return d;
    }
  }), g.prototype.originalPositionFor = function(b) {
    var F = {
      generatedLine: e.getArg(b, "line"),
      generatedColumn: e.getArg(b, "column")
    }, E = t.search(
      F,
      this._sections,
      function(R, k) {
        var I = R.generatedLine - k.generatedOffset.generatedLine;
        return I || R.generatedColumn - k.generatedOffset.generatedColumn;
      }
    ), S = this._sections[E];
    return S ? S.consumer.originalPositionFor({
      line: F.generatedLine - (S.generatedOffset.generatedLine - 1),
      column: F.generatedColumn - (S.generatedOffset.generatedLine === F.generatedLine ? S.generatedOffset.generatedColumn - 1 : 0),
      bias: b.bias
    }) : {
      source: null,
      line: null,
      column: null,
      name: null
    };
  }, g.prototype.hasContentsOfAllSources = function() {
    return this._sections.every(function(b) {
      return b.consumer.hasContentsOfAllSources();
    });
  }, g.prototype.sourceContentFor = function(b, F) {
    for (var E = 0; E < this._sections.length; E++) {
      var S = this._sections[E], R = S.consumer.sourceContentFor(b, !0);
      if (R)
        return R;
    }
    if (F)
      return null;
    throw new Error('"' + b + '" is not in the SourceMap.');
  }, g.prototype.generatedPositionFor = function(b) {
    for (var F = 0; F < this._sections.length; F++) {
      var E = this._sections[F];
      if (E.consumer._findSourceIndex(e.getArg(b, "source")) !== -1) {
        var S = E.consumer.generatedPositionFor(b);
        if (S) {
          var R = {
            line: S.line + (E.generatedOffset.generatedLine - 1),
            column: S.column + (E.generatedOffset.generatedLine === S.line ? E.generatedOffset.generatedColumn - 1 : 0)
          };
          return R;
        }
      }
    }
    return {
      line: null,
      column: null
    };
  }, g.prototype._parseMappings = function(b, F) {
    this.__generatedMappings = [], this.__originalMappings = [];
    for (var E = 0; E < this._sections.length; E++)
      for (var S = this._sections[E], R = S.consumer._generatedMappings, k = 0; k < R.length; k++) {
        var I = R[k], V = S.consumer._sources.at(I.source);
        V = e.computeSourceURL(S.consumer.sourceRoot, V, this._sourceMapURL), this._sources.add(V), V = this._sources.indexOf(V);
        var U = null;
        I.name && (U = S.consumer._names.at(I.name), this._names.add(U), U = this._names.indexOf(U));
        var q = {
          source: V,
          generatedLine: I.generatedLine + (S.generatedOffset.generatedLine - 1),
          generatedColumn: I.generatedColumn + (S.generatedOffset.generatedLine === I.generatedLine ? S.generatedOffset.generatedColumn - 1 : 0),
          originalLine: I.originalLine,
          originalColumn: I.originalColumn,
          name: U
        };
        this.__generatedMappings.push(q), typeof q.originalLine == "number" && this.__originalMappings.push(q);
      }
    u(this.__generatedMappings, e.compareByGeneratedPositionsDeflated), u(this.__originalMappings, e.compareByOriginalPositions);
  }, sourceMapConsumer.IndexedSourceMapConsumer = g, sourceMapConsumer;
}
var sourceNode = {}, hasRequiredSourceNode;
function requireSourceNode() {
  if (hasRequiredSourceNode) return sourceNode;
  hasRequiredSourceNode = 1;
  var e = requireSourceMapGenerator().SourceMapGenerator, t = requireUtil(), a = /(\r?\n)/, o = 10, u = "$$$isSourceNode$$$";
  function l(f, p, g, d, b) {
    this.children = [], this.sourceContents = {}, this.line = f ?? null, this.column = p ?? null, this.source = g ?? null, this.name = b ?? null, this[u] = !0, d != null && this.add(d);
  }
  return l.fromStringWithSourceMap = function(p, g, d) {
    var b = new l(), F = p.split(a), E = 0, S = function() {
      var U = H(), q = H() || "";
      return U + q;
      function H() {
        return E < F.length ? F[E++] : void 0;
      }
    }, R = 1, k = 0, I = null;
    return g.eachMapping(function(U) {
      if (I !== null)
        if (R < U.generatedLine)
          V(I, S()), R++, k = 0;
        else {
          var q = F[E] || "", H = q.substr(0, U.generatedColumn - k);
          F[E] = q.substr(U.generatedColumn - k), k = U.generatedColumn, V(I, H), I = U;
          return;
        }
      for (; R < U.generatedLine; )
        b.add(S()), R++;
      if (k < U.generatedColumn) {
        var q = F[E] || "";
        b.add(q.substr(0, U.generatedColumn)), F[E] = q.substr(U.generatedColumn), k = U.generatedColumn;
      }
      I = U;
    }, this), E < F.length && (I && V(I, S()), b.add(F.splice(E).join(""))), g.sources.forEach(function(U) {
      var q = g.sourceContentFor(U);
      q != null && (d != null && (U = t.join(d, U)), b.setSourceContent(U, q));
    }), b;
    function V(U, q) {
      if (U === null || U.source === void 0)
        b.add(q);
      else {
        var H = d ? t.join(d, U.source) : U.source;
        b.add(new l(
          U.originalLine,
          U.originalColumn,
          H,
          q,
          U.name
        ));
      }
    }
  }, l.prototype.add = function(p) {
    if (Array.isArray(p))
      p.forEach(function(g) {
        this.add(g);
      }, this);
    else if (p[u] || typeof p == "string")
      p && this.children.push(p);
    else
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + p
      );
    return this;
  }, l.prototype.prepend = function(p) {
    if (Array.isArray(p))
      for (var g = p.length - 1; g >= 0; g--)
        this.prepend(p[g]);
    else if (p[u] || typeof p == "string")
      this.children.unshift(p);
    else
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + p
      );
    return this;
  }, l.prototype.walk = function(p) {
    for (var g, d = 0, b = this.children.length; d < b; d++)
      g = this.children[d], g[u] ? g.walk(p) : g !== "" && p(g, {
        source: this.source,
        line: this.line,
        column: this.column,
        name: this.name
      });
  }, l.prototype.join = function(p) {
    var g, d, b = this.children.length;
    if (b > 0) {
      for (g = [], d = 0; d < b - 1; d++)
        g.push(this.children[d]), g.push(p);
      g.push(this.children[d]), this.children = g;
    }
    return this;
  }, l.prototype.replaceRight = function(p, g) {
    var d = this.children[this.children.length - 1];
    return d[u] ? d.replaceRight(p, g) : typeof d == "string" ? this.children[this.children.length - 1] = d.replace(p, g) : this.children.push("".replace(p, g)), this;
  }, l.prototype.setSourceContent = function(p, g) {
    this.sourceContents[t.toSetString(p)] = g;
  }, l.prototype.walkSourceContents = function(p) {
    for (var g = 0, d = this.children.length; g < d; g++)
      this.children[g][u] && this.children[g].walkSourceContents(p);
    for (var b = Object.keys(this.sourceContents), g = 0, d = b.length; g < d; g++)
      p(t.fromSetString(b[g]), this.sourceContents[b[g]]);
  }, l.prototype.toString = function() {
    var p = "";
    return this.walk(function(g) {
      p += g;
    }), p;
  }, l.prototype.toStringWithSourceMap = function(p) {
    var g = {
      code: "",
      line: 1,
      column: 0
    }, d = new e(p), b = !1, F = null, E = null, S = null, R = null;
    return this.walk(function(k, I) {
      g.code += k, I.source !== null && I.line !== null && I.column !== null ? ((F !== I.source || E !== I.line || S !== I.column || R !== I.name) && d.addMapping({
        source: I.source,
        original: {
          line: I.line,
          column: I.column
        },
        generated: {
          line: g.line,
          column: g.column
        },
        name: I.name
      }), F = I.source, E = I.line, S = I.column, R = I.name, b = !0) : b && (d.addMapping({
        generated: {
          line: g.line,
          column: g.column
        }
      }), F = null, b = !1);
      for (var V = 0, U = k.length; V < U; V++)
        k.charCodeAt(V) === o ? (g.line++, g.column = 0, V + 1 === U ? (F = null, b = !1) : b && d.addMapping({
          source: I.source,
          original: {
            line: I.line,
            column: I.column
          },
          generated: {
            line: g.line,
            column: g.column
          },
          name: I.name
        })) : g.column++;
    }), this.walkSourceContents(function(k, I) {
      d.setSourceContent(k, I);
    }), { code: g.code, map: d };
  }, sourceNode.SourceNode = l, sourceNode;
}
var hasRequiredSourceMap;
function requireSourceMap() {
  return hasRequiredSourceMap || (hasRequiredSourceMap = 1, sourceMap.SourceMapGenerator = requireSourceMapGenerator().SourceMapGenerator, sourceMap.SourceMapConsumer = requireSourceMapConsumer().SourceMapConsumer, sourceMap.SourceNode = requireSourceNode().SourceNode), sourceMap;
}
const name$2 = "escodegen", description = "ECMAScript code generator", homepage = "http://github.com/estools/escodegen", main = "escodegen.js", bin = { esgenerate: "./bin/esgenerate.js", escodegen: "./bin/escodegen.js" }, files = ["LICENSE.BSD", "README.md", "bin", "escodegen.js", "package.json"], version = "2.1.0", engines = { node: ">=6.0" }, maintainers = [{ name: "Yusuke Suzuki", email: "utatane.tea@gmail.com", web: "http://github.com/Constellation" }], repository = { type: "git", url: "http://github.com/estools/escodegen.git" }, dependencies = { estraverse: "^5.2.0", esutils: "^2.0.2", esprima: "^4.0.1" }, optionalDependencies = { "source-map": "~0.6.1" }, devDependencies = { acorn: "^8.0.4", bluebird: "^3.4.7", "bower-registry-client": "^1.0.0", chai: "^4.2.0", "chai-exclude": "^2.0.2", "commonjs-everywhere": "^0.9.7", gulp: "^4.0.2", "gulp-eslint": "^6.0.0", "gulp-mocha": "^7.0.2", minimist: "^1.2.5", optionator: "^0.9.1", semver: "^7.3.4" }, license = "BSD-2-Clause", scripts = { test: "gulp travis", "unit-test": "gulp test", lint: "gulp lint", release: "node tools/release.js", "build-min": "./node_modules/.bin/cjsify -ma path: tools/entry-point.js > escodegen.browser.min.js", build: "./node_modules/.bin/cjsify -a path: tools/entry-point.js > escodegen.browser.js" }, require$$3 = {
  name: name$2,
  description,
  homepage,
  main,
  bin,
  files,
  version,
  engines,
  maintainers,
  repository,
  dependencies,
  optionalDependencies,
  devDependencies,
  license,
  scripts
};
var hasRequiredEscodegen;
function requireEscodegen() {
  return hasRequiredEscodegen || (hasRequiredEscodegen = 1, function(e) {
    (function() {
      var t, a, o, u, l, f, p, g, d, b, F, E, S, R, k, I, V, U, q, H, z, j, ee, te, de, ie;
      l = requireEstraverse(), f = requireUtils(), t = l.Syntax;
      function he(M) {
        return Fe.Expression.hasOwnProperty(M.type);
      }
      function fe(M) {
        return Fe.Statement.hasOwnProperty(M.type);
      }
      a = {
        Sequence: 0,
        Yield: 1,
        Assignment: 1,
        Conditional: 2,
        ArrowFunction: 2,
        Coalesce: 3,
        LogicalOR: 4,
        LogicalAND: 5,
        BitwiseOR: 6,
        BitwiseXOR: 7,
        BitwiseAND: 8,
        Equality: 9,
        Relational: 10,
        BitwiseSHIFT: 11,
        Additive: 12,
        Multiplicative: 13,
        Exponentiation: 14,
        Await: 15,
        Unary: 15,
        Postfix: 16,
        OptionalChaining: 17,
        Call: 18,
        New: 19,
        TaggedTemplate: 20,
        Member: 21,
        Primary: 22
      }, o = {
        "??": a.Coalesce,
        "||": a.LogicalOR,
        "&&": a.LogicalAND,
        "|": a.BitwiseOR,
        "^": a.BitwiseXOR,
        "&": a.BitwiseAND,
        "==": a.Equality,
        "!=": a.Equality,
        "===": a.Equality,
        "!==": a.Equality,
        is: a.Equality,
        isnt: a.Equality,
        "<": a.Relational,
        ">": a.Relational,
        "<=": a.Relational,
        ">=": a.Relational,
        in: a.Relational,
        instanceof: a.Relational,
        "<<": a.BitwiseSHIFT,
        ">>": a.BitwiseSHIFT,
        ">>>": a.BitwiseSHIFT,
        "+": a.Additive,
        "-": a.Additive,
        "*": a.Multiplicative,
        "%": a.Multiplicative,
        "/": a.Multiplicative,
        "**": a.Exponentiation
      };
      var le = 1, _e = 2, Me = 4, be = 8, ve = 16, ge = 32, Ie = 64, $e = _e | Me, Xe = le | _e, ue = le | _e | Me, Ee = le, qe = Me, Te = le | Me, xe = le, Ve = le | ge, we = 0, We = le | ve, Qe = le | be;
      function nt() {
        return {
          indent: null,
          base: null,
          parse: null,
          comment: !1,
          format: {
            indent: {
              style: "    ",
              base: 0,
              adjustMultilineComment: !1
            },
            newline: `
`,
            space: " ",
            json: !1,
            renumber: !1,
            hexadecimal: !1,
            quotes: "single",
            escapeless: !1,
            compact: !1,
            parentheses: !0,
            semicolons: !0,
            safeConcatenation: !1,
            preserveBlankLines: !1
          },
          moz: {
            comprehensionExpressionStartsWithAssignment: !1,
            starlessGenerator: !1
          },
          sourceMap: null,
          sourceMapRoot: null,
          sourceMapWithCode: !1,
          directive: !1,
          raw: !0,
          verbatim: null,
          sourceCode: null
        };
      }
      function ze(M, B) {
        var L = "";
        for (B |= 0; B > 0; B >>>= 1, M += M)
          B & 1 && (L += M);
        return L;
      }
      function At(M) {
        return /[\r\n]/g.test(M);
      }
      function Ue(M) {
        var B = M.length;
        return B && f.code.isLineTerminator(M.charCodeAt(B - 1));
      }
      function rt(M, B) {
        var L;
        for (L in B)
          B.hasOwnProperty(L) && (M[L] = B[L]);
        return M;
      }
      function at(M, B) {
        var L, N;
        function $(se) {
          return typeof se == "object" && se instanceof Object && !(se instanceof RegExp);
        }
        for (L in B)
          B.hasOwnProperty(L) && (N = B[L], $(N) ? $(M[L]) ? at(M[L], N) : M[L] = at({}, N) : M[L] = N);
        return M;
      }
      function ot(M) {
        var B, L, N, $, se;
        if (M !== M)
          throw new Error("Numeric literal whose value is NaN");
        if (M < 0 || M === 0 && 1 / M < 0)
          throw new Error("Numeric literal whose value is negative");
        if (M === 1 / 0)
          return d ? "null" : b ? "1e400" : "1e+400";
        if (B = "" + M, !b || B.length < 3)
          return B;
        for (L = B.indexOf("."), !d && B.charCodeAt(0) === 48 && L === 1 && (L = 0, B = B.slice(1)), N = B, B = B.replace("e+", "e"), $ = 0, (se = N.indexOf("e")) > 0 && ($ = +N.slice(se + 1), N = N.slice(0, se)), L >= 0 && ($ -= N.length - L - 1, N = +(N.slice(0, L) + N.slice(L + 1)) + ""), se = 0; N.charCodeAt(N.length + se - 1) === 48; )
          --se;
        return se !== 0 && ($ -= se, N = N.slice(0, se)), $ !== 0 && (N += "e" + $), (N.length < B.length || F && M > 1e12 && Math.floor(M) === M && (N = "0x" + M.toString(16)).length < B.length) && +N === M && (B = N), B;
      }
      function ft(M, B) {
        return (M & -2) === 8232 ? (B ? "u" : "\\u") + (M === 8232 ? "2028" : "2029") : M === 10 || M === 13 ? (B ? "" : "\\") + (M === 10 ? "n" : "r") : String.fromCharCode(M);
      }
      function ht(M) {
        var B, L, N, $, se, oe, pe, me;
        if (L = M.toString(), M.source) {
          if (B = L.match(/\/([^/]*)$/), !B)
            return L;
          for (N = B[1], L = "", pe = !1, me = !1, $ = 0, se = M.source.length; $ < se; ++$)
            oe = M.source.charCodeAt($), me ? (L += ft(oe, me), me = !1) : (pe ? oe === 93 && (pe = !1) : oe === 47 ? L += "\\" : oe === 91 && (pe = !0), L += ft(oe, me), me = oe === 92);
          return "/" + L + "/" + N;
        }
        return L;
      }
      function _t(M, B) {
        var L;
        return M === 8 ? "\\b" : M === 12 ? "\\f" : M === 9 ? "\\t" : (L = M.toString(16).toUpperCase(), d || M > 255 ? "\\u" + "0000".slice(L.length) + L : M === 0 && !f.code.isDecimalDigit(B) ? "\\0" : M === 11 ? "\\x0B" : "\\x" + "00".slice(L.length) + L);
      }
      function St(M) {
        if (M === 92)
          return "\\\\";
        if (M === 10)
          return "\\n";
        if (M === 13)
          return "\\r";
        if (M === 8232)
          return "\\u2028";
        if (M === 8233)
          return "\\u2029";
        throw new Error("Incorrectly classified character");
      }
      function mt(M) {
        var B, L, N, $;
        for ($ = E === "double" ? '"' : "'", B = 0, L = M.length; B < L; ++B)
          if (N = M.charCodeAt(B), N === 39) {
            $ = '"';
            break;
          } else if (N === 34) {
            $ = "'";
            break;
          } else N === 92 && ++B;
        return $ + M + $;
      }
      function st(M) {
        var B = "", L, N, $, se = 0, oe = 0, pe, me;
        for (L = 0, N = M.length; L < N; ++L) {
          if ($ = M.charCodeAt(L), $ === 39)
            ++se;
          else if ($ === 34)
            ++oe;
          else if ($ === 47 && d)
            B += "\\";
          else if (f.code.isLineTerminator($) || $ === 92) {
            B += St($);
            continue;
          } else if (!f.code.isIdentifierPartES5($) && (d && $ < 32 || !d && !S && ($ < 32 || $ > 126))) {
            B += _t($, M.charCodeAt(L + 1));
            continue;
          }
          B += String.fromCharCode($);
        }
        if (pe = !(E === "double" || E === "auto" && oe < se), me = pe ? "'" : '"', !(pe ? se : oe))
          return me + B + me;
        for (M = B, B = me, L = 0, N = M.length; L < N; ++L)
          $ = M.charCodeAt(L), ($ === 39 && pe || $ === 34 && !pe) && (B += "\\"), B += String.fromCharCode($);
        return B + me;
      }
      function Pt(M) {
        var B, L, N, $ = "";
        for (B = 0, L = M.length; B < L; ++B)
          N = M[B], $ += Array.isArray(N) ? Pt(N) : N;
        return $;
      }
      function ke(M, B) {
        if (!j)
          return Array.isArray(M) ? Pt(M) : M;
        if (B == null) {
          if (M instanceof u)
            return M;
          B = {};
        }
        return B.loc == null ? new u(null, null, j, M, B.name || null) : new u(B.loc.start.line, B.loc.start.column, j === !0 ? B.loc.source || null : j, M, B.name || null);
      }
      function Je() {
        return k || " ";
      }
      function Se(M, B) {
        var L, N, $, se;
        return L = ke(M).toString(), L.length === 0 ? [B] : (N = ke(B).toString(), N.length === 0 ? [M] : ($ = L.charCodeAt(L.length - 1), se = N.charCodeAt(0), ($ === 43 || $ === 45) && $ === se || f.code.isIdentifierPartES5($) && f.code.isIdentifierPartES5(se) || $ === 47 && se === 105 ? [M, Je(), B] : f.code.isWhiteSpace($) || f.code.isLineTerminator($) || f.code.isWhiteSpace(se) || f.code.isLineTerminator(se) ? [M, B] : [M, k, B]));
      }
      function Ke(M) {
        return [p, M];
      }
      function Ne(M) {
        var B;
        B = p, p += g, M(p), p = B;
      }
      function yt(M) {
        var B;
        for (B = M.length - 1; B >= 0 && !f.code.isLineTerminator(M.charCodeAt(B)); --B)
          ;
        return M.length - 1 - B;
      }
      function xt(M, B) {
        var L, N, $, se, oe, pe, me, Le;
        for (L = M.split(/\r\n|[\r\n]/), pe = Number.MAX_VALUE, N = 1, $ = L.length; N < $; ++N) {
          for (se = L[N], oe = 0; oe < se.length && f.code.isWhiteSpace(se.charCodeAt(oe)); )
            ++oe;
          pe > oe && (pe = oe);
        }
        for (typeof B < "u" ? (me = p, L[1][pe] === "*" && (B += " "), p = B) : (pe & 1 && --pe, me = p), N = 1, $ = L.length; N < $; ++N)
          Le = ke(Ke(L[N].slice(pe))), L[N] = j ? Le.join("") : Le;
        return p = me, L.join(`
`);
      }
      function et(M, B) {
        if (M.type === "Line") {
          if (Ue(M.value))
            return "//" + M.value;
          var L = "//" + M.value;
          return te || (L += `
`), L;
        }
        return H.format.indent.adjustMultilineComment && /[\n\r]/.test(M.value) ? xt("/*" + M.value + "*/", B) : "/*" + M.value + "*/";
      }
      function pt(M, B) {
        var L, N, $, se, oe, pe, me, Le, He, bt, Gt, $t, Xt, it;
        if (M.leadingComments && M.leadingComments.length > 0) {
          if (se = B, te) {
            for ($ = M.leadingComments[0], B = [], Le = $.extendedRange, He = $.range, Gt = ee.substring(Le[0], He[0]), it = (Gt.match(/\n/g) || []).length, it > 0 ? (B.push(ze(`
`, it)), B.push(Ke(et($)))) : (B.push(Gt), B.push(et($))), bt = He, L = 1, N = M.leadingComments.length; L < N; L++)
              $ = M.leadingComments[L], He = $.range, $t = ee.substring(bt[1], He[0]), it = ($t.match(/\n/g) || []).length, B.push(ze(`
`, it)), B.push(Ke(et($))), bt = He;
            Xt = ee.substring(He[1], Le[1]), it = (Xt.match(/\n/g) || []).length, B.push(ze(`
`, it));
          } else
            for ($ = M.leadingComments[0], B = [], U && M.type === t.Program && M.body.length === 0 && B.push(`
`), B.push(et($)), Ue(ke(B).toString()) || B.push(`
`), L = 1, N = M.leadingComments.length; L < N; ++L)
              $ = M.leadingComments[L], me = [et($)], Ue(ke(me).toString()) || me.push(`
`), B.push(Ke(me));
          B.push(Ke(se));
        }
        if (M.trailingComments)
          if (te)
            $ = M.trailingComments[0], Le = $.extendedRange, He = $.range, Gt = ee.substring(Le[0], He[0]), it = (Gt.match(/\n/g) || []).length, it > 0 ? (B.push(ze(`
`, it)), B.push(Ke(et($)))) : (B.push(Gt), B.push(et($)));
          else
            for (oe = !Ue(ke(B).toString()), pe = ze(" ", yt(ke([p, B, g]).toString())), L = 0, N = M.trailingComments.length; L < N; ++L)
              $ = M.trailingComments[L], oe ? (L === 0 ? B = [B, g] : B = [B, pe], B.push(et($, pe))) : B = [B, Ke(et($))], L !== N - 1 && !Ue(ke(B).toString()) && (B = [B, `
`]);
        return B;
      }
      function tt(M, B, L) {
        var N, $ = 0;
        for (N = M; N < B; N++)
          ee[N] === `
` && $++;
        for (N = 1; N < $; N++)
          L.push(R);
      }
      function Ge(M, B, L) {
        return B < L ? ["(", M, ")"] : M;
      }
      function Ft(M) {
        var B, L, N;
        for (N = M.split(/\r\n|\n/), B = 1, L = N.length; B < L; B++)
          N[B] = R + p + N[B];
        return N;
      }
      function Ct(M, B) {
        var L, N, $;
        return L = M[H.verbatim], typeof L == "string" ? N = Ge(Ft(L), a.Sequence, B) : (N = Ft(L.content), $ = L.precedence != null ? L.precedence : a.Sequence, N = Ge(N, $, B)), ke(N, M);
      }
      function Fe() {
      }
      Fe.prototype.maybeBlock = function(M, B) {
        var L, N, $ = this;
        return N = !H.comment || !M.leadingComments, M.type === t.BlockStatement && N ? [k, this.generateStatement(M, B)] : M.type === t.EmptyStatement && N ? ";" : (Ne(function() {
          L = [
            R,
            Ke($.generateStatement(M, B))
          ];
        }), L);
      }, Fe.prototype.maybeBlockSuffix = function(M, B) {
        var L = Ue(ke(B).toString());
        return M.type === t.BlockStatement && (!H.comment || !M.leadingComments) && !L ? [B, k] : L ? [B, p] : [B, R, p];
      };
      function Re(M) {
        return ke(M.name, M);
      }
      function Ze(M, B) {
        return M.async ? "async" + (B ? Je() : k) : "";
      }
      function Ye(M) {
        var B = M.generator && !H.moz.starlessGenerator;
        return B ? "*" + k : "";
      }
      function Dt(M) {
        var B = M.value, L = "";
        return B.async && (L += Ze(B, !M.computed)), B.generator && (L += Ye(B) ? "*" : ""), L;
      }
      Fe.prototype.generatePattern = function(M, B, L) {
        return M.type === t.Identifier ? Re(M) : this.generateExpression(M, B, L);
      }, Fe.prototype.generateFunctionParams = function(M) {
        var B, L, N, $;
        if ($ = !1, M.type === t.ArrowFunctionExpression && !M.rest && (!M.defaults || M.defaults.length === 0) && M.params.length === 1 && M.params[0].type === t.Identifier)
          N = [Ze(M, !0), Re(M.params[0])];
        else {
          for (N = M.type === t.ArrowFunctionExpression ? [Ze(M, !1)] : [], N.push("("), M.defaults && ($ = !0), B = 0, L = M.params.length; B < L; ++B)
            $ && M.defaults[B] ? N.push(this.generateAssignment(M.params[B], M.defaults[B], "=", a.Assignment, ue)) : N.push(this.generatePattern(M.params[B], a.Assignment, ue)), B + 1 < L && N.push("," + k);
          M.rest && (M.params.length && N.push("," + k), N.push("..."), N.push(Re(M.rest))), N.push(")");
        }
        return N;
      }, Fe.prototype.generateFunctionBody = function(M) {
        var B, L;
        return B = this.generateFunctionParams(M), M.type === t.ArrowFunctionExpression && (B.push(k), B.push("=>")), M.expression ? (B.push(k), L = this.generateExpression(M.body, a.Assignment, ue), L.toString().charAt(0) === "{" && (L = ["(", L, ")"]), B.push(L)) : B.push(this.maybeBlock(M.body, Qe)), B;
      }, Fe.prototype.generateIterationForStatement = function(M, B, L) {
        var N = ["for" + (B.await ? Je() + "await" : "") + k + "("], $ = this;
        return Ne(function() {
          B.left.type === t.VariableDeclaration ? Ne(function() {
            N.push(B.left.kind + Je()), N.push($.generateStatement(B.left.declarations[0], we));
          }) : N.push($.generateExpression(B.left, a.Call, ue)), N = Se(N, M), N = [Se(
            N,
            $.generateExpression(B.right, a.Assignment, ue)
          ), ")"];
        }), N.push(this.maybeBlock(B.body, L)), N;
      }, Fe.prototype.generatePropertyKey = function(M, B) {
        var L = [];
        return B && L.push("["), L.push(this.generateExpression(M, a.Assignment, ue)), B && L.push("]"), L;
      }, Fe.prototype.generateAssignment = function(M, B, L, N, $) {
        return a.Assignment < N && ($ |= le), Ge(
          [
            this.generateExpression(M, a.Call, $),
            k + L + k,
            this.generateExpression(B, a.Assignment, $)
          ],
          a.Assignment,
          N
        );
      }, Fe.prototype.semicolon = function(M) {
        return !V && M & ge ? "" : ";";
      }, Fe.Statement = {
        BlockStatement: function(M, B) {
          var L, N, $ = ["{", R], se = this;
          return Ne(function() {
            M.body.length === 0 && te && (L = M.range, L[1] - L[0] > 2 && (N = ee.substring(L[0] + 1, L[1] - 1), N[0] === `
` && ($ = ["{"]), $.push(N)));
            var oe, pe, me, Le;
            for (Le = xe, B & be && (Le |= ve), oe = 0, pe = M.body.length; oe < pe; ++oe)
              te && (oe === 0 && (M.body[0].leadingComments && (L = M.body[0].leadingComments[0].extendedRange, N = ee.substring(L[0], L[1]), N[0] === `
` && ($ = ["{"])), M.body[0].leadingComments || tt(M.range[0], M.body[0].range[0], $)), oe > 0 && !M.body[oe - 1].trailingComments && !M.body[oe].leadingComments && tt(M.body[oe - 1].range[1], M.body[oe].range[0], $)), oe === pe - 1 && (Le |= ge), M.body[oe].leadingComments && te ? me = se.generateStatement(M.body[oe], Le) : me = Ke(se.generateStatement(M.body[oe], Le)), $.push(me), Ue(ke(me).toString()) || te && oe < pe - 1 && M.body[oe + 1].leadingComments || $.push(R), te && oe === pe - 1 && (M.body[oe].trailingComments || tt(M.body[oe].range[1], M.range[1], $));
          }), $.push(Ke("}")), $;
        },
        BreakStatement: function(M, B) {
          return M.label ? "break " + M.label.name + this.semicolon(B) : "break" + this.semicolon(B);
        },
        ContinueStatement: function(M, B) {
          return M.label ? "continue " + M.label.name + this.semicolon(B) : "continue" + this.semicolon(B);
        },
        ClassBody: function(M, B) {
          var L = ["{", R], N = this;
          return Ne(function($) {
            var se, oe;
            for (se = 0, oe = M.body.length; se < oe; ++se)
              L.push($), L.push(N.generateExpression(M.body[se], a.Sequence, ue)), se + 1 < oe && L.push(R);
          }), Ue(ke(L).toString()) || L.push(R), L.push(p), L.push("}"), L;
        },
        ClassDeclaration: function(M, B) {
          var L, N;
          return L = ["class"], M.id && (L = Se(L, this.generateExpression(M.id, a.Sequence, ue))), M.superClass && (N = Se("extends", this.generateExpression(M.superClass, a.Unary, ue)), L = Se(L, N)), L.push(k), L.push(this.generateStatement(M.body, Ve)), L;
        },
        DirectiveStatement: function(M, B) {
          return H.raw && M.raw ? M.raw + this.semicolon(B) : mt(M.directive) + this.semicolon(B);
        },
        DoWhileStatement: function(M, B) {
          var L = Se("do", this.maybeBlock(M.body, xe));
          return L = this.maybeBlockSuffix(M.body, L), Se(L, [
            "while" + k + "(",
            this.generateExpression(M.test, a.Sequence, ue),
            ")" + this.semicolon(B)
          ]);
        },
        CatchClause: function(M, B) {
          var L, N = this;
          return Ne(function() {
            var $;
            M.param ? (L = [
              "catch" + k + "(",
              N.generateExpression(M.param, a.Sequence, ue),
              ")"
            ], M.guard && ($ = N.generateExpression(M.guard, a.Sequence, ue), L.splice(2, 0, " if ", $))) : L = ["catch"];
          }), L.push(this.maybeBlock(M.body, xe)), L;
        },
        DebuggerStatement: function(M, B) {
          return "debugger" + this.semicolon(B);
        },
        EmptyStatement: function(M, B) {
          return ";";
        },
        ExportDefaultDeclaration: function(M, B) {
          var L = ["export"], N;
          return N = B & ge ? Ve : xe, L = Se(L, "default"), fe(M.declaration) ? L = Se(L, this.generateStatement(M.declaration, N)) : L = Se(L, this.generateExpression(M.declaration, a.Assignment, ue) + this.semicolon(B)), L;
        },
        ExportNamedDeclaration: function(M, B) {
          var L = ["export"], N, $ = this;
          return N = B & ge ? Ve : xe, M.declaration ? Se(L, this.generateStatement(M.declaration, N)) : (M.specifiers && (M.specifiers.length === 0 ? L = Se(L, "{" + k + "}") : M.specifiers[0].type === t.ExportBatchSpecifier ? L = Se(L, this.generateExpression(M.specifiers[0], a.Sequence, ue)) : (L = Se(L, "{"), Ne(function(se) {
            var oe, pe;
            for (L.push(R), oe = 0, pe = M.specifiers.length; oe < pe; ++oe)
              L.push(se), L.push($.generateExpression(M.specifiers[oe], a.Sequence, ue)), oe + 1 < pe && L.push("," + R);
          }), Ue(ke(L).toString()) || L.push(R), L.push(p + "}")), M.source ? L = Se(L, [
            "from" + k,
            // ModuleSpecifier
            this.generateExpression(M.source, a.Sequence, ue),
            this.semicolon(B)
          ]) : L.push(this.semicolon(B))), L);
        },
        ExportAllDeclaration: function(M, B) {
          return [
            "export" + k,
            "*" + k,
            "from" + k,
            // ModuleSpecifier
            this.generateExpression(M.source, a.Sequence, ue),
            this.semicolon(B)
          ];
        },
        ExpressionStatement: function(M, B) {
          var L, N;
          function $(pe) {
            var me;
            return pe.slice(0, 5) !== "class" ? !1 : (me = pe.charCodeAt(5), me === 123 || f.code.isWhiteSpace(me) || f.code.isLineTerminator(me));
          }
          function se(pe) {
            var me;
            return pe.slice(0, 8) !== "function" ? !1 : (me = pe.charCodeAt(8), me === 40 || f.code.isWhiteSpace(me) || me === 42 || f.code.isLineTerminator(me));
          }
          function oe(pe) {
            var me, Le, He;
            if (pe.slice(0, 5) !== "async" || !f.code.isWhiteSpace(pe.charCodeAt(5)))
              return !1;
            for (Le = 6, He = pe.length; Le < He && f.code.isWhiteSpace(pe.charCodeAt(Le)); ++Le)
              ;
            return Le === He || pe.slice(Le, Le + 8) !== "function" ? !1 : (me = pe.charCodeAt(Le + 8), me === 40 || f.code.isWhiteSpace(me) || me === 42 || f.code.isLineTerminator(me));
          }
          return L = [this.generateExpression(M.expression, a.Sequence, ue)], N = ke(L).toString(), N.charCodeAt(0) === 123 || // ObjectExpression
          $(N) || se(N) || oe(N) || q && B & ve && M.expression.type === t.Literal && typeof M.expression.value == "string" ? L = ["(", L, ")" + this.semicolon(B)] : L.push(this.semicolon(B)), L;
        },
        ImportDeclaration: function(M, B) {
          var L, N, $ = this;
          return M.specifiers.length === 0 ? [
            "import",
            k,
            // ModuleSpecifier
            this.generateExpression(M.source, a.Sequence, ue),
            this.semicolon(B)
          ] : (L = [
            "import"
          ], N = 0, M.specifiers[N].type === t.ImportDefaultSpecifier && (L = Se(L, [
            this.generateExpression(M.specifiers[N], a.Sequence, ue)
          ]), ++N), M.specifiers[N] && (N !== 0 && L.push(","), M.specifiers[N].type === t.ImportNamespaceSpecifier ? L = Se(L, [
            k,
            this.generateExpression(M.specifiers[N], a.Sequence, ue)
          ]) : (L.push(k + "{"), M.specifiers.length - N === 1 ? (L.push(k), L.push(this.generateExpression(M.specifiers[N], a.Sequence, ue)), L.push(k + "}" + k)) : (Ne(function(se) {
            var oe, pe;
            for (L.push(R), oe = N, pe = M.specifiers.length; oe < pe; ++oe)
              L.push(se), L.push($.generateExpression(M.specifiers[oe], a.Sequence, ue)), oe + 1 < pe && L.push("," + R);
          }), Ue(ke(L).toString()) || L.push(R), L.push(p + "}" + k)))), L = Se(L, [
            "from" + k,
            // ModuleSpecifier
            this.generateExpression(M.source, a.Sequence, ue),
            this.semicolon(B)
          ]), L);
        },
        VariableDeclarator: function(M, B) {
          var L = B & le ? ue : $e;
          return M.init ? [
            this.generateExpression(M.id, a.Assignment, L),
            k,
            "=",
            k,
            this.generateExpression(M.init, a.Assignment, L)
          ] : this.generatePattern(M.id, a.Assignment, L);
        },
        VariableDeclaration: function(M, B) {
          var L, N, $, se, oe, pe = this;
          L = [M.kind], oe = B & le ? xe : we;
          function me() {
            for (se = M.declarations[0], H.comment && se.leadingComments ? (L.push(`
`), L.push(Ke(pe.generateStatement(se, oe)))) : (L.push(Je()), L.push(pe.generateStatement(se, oe))), N = 1, $ = M.declarations.length; N < $; ++N)
              se = M.declarations[N], H.comment && se.leadingComments ? (L.push("," + R), L.push(Ke(pe.generateStatement(se, oe)))) : (L.push("," + k), L.push(pe.generateStatement(se, oe)));
          }
          return M.declarations.length > 1 ? Ne(me) : me(), L.push(this.semicolon(B)), L;
        },
        ThrowStatement: function(M, B) {
          return [Se(
            "throw",
            this.generateExpression(M.argument, a.Sequence, ue)
          ), this.semicolon(B)];
        },
        TryStatement: function(M, B) {
          var L, N, $, se;
          if (L = ["try", this.maybeBlock(M.block, xe)], L = this.maybeBlockSuffix(M.block, L), M.handlers)
            for (N = 0, $ = M.handlers.length; N < $; ++N)
              L = Se(L, this.generateStatement(M.handlers[N], xe)), (M.finalizer || N + 1 !== $) && (L = this.maybeBlockSuffix(M.handlers[N].body, L));
          else {
            for (se = M.guardedHandlers || [], N = 0, $ = se.length; N < $; ++N)
              L = Se(L, this.generateStatement(se[N], xe)), (M.finalizer || N + 1 !== $) && (L = this.maybeBlockSuffix(se[N].body, L));
            if (M.handler)
              if (Array.isArray(M.handler))
                for (N = 0, $ = M.handler.length; N < $; ++N)
                  L = Se(L, this.generateStatement(M.handler[N], xe)), (M.finalizer || N + 1 !== $) && (L = this.maybeBlockSuffix(M.handler[N].body, L));
              else
                L = Se(L, this.generateStatement(M.handler, xe)), M.finalizer && (L = this.maybeBlockSuffix(M.handler.body, L));
          }
          return M.finalizer && (L = Se(L, ["finally", this.maybeBlock(M.finalizer, xe)])), L;
        },
        SwitchStatement: function(M, B) {
          var L, N, $, se, oe, pe = this;
          if (Ne(function() {
            L = [
              "switch" + k + "(",
              pe.generateExpression(M.discriminant, a.Sequence, ue),
              ")" + k + "{" + R
            ];
          }), M.cases)
            for (oe = xe, $ = 0, se = M.cases.length; $ < se; ++$)
              $ === se - 1 && (oe |= ge), N = Ke(this.generateStatement(M.cases[$], oe)), L.push(N), Ue(ke(N).toString()) || L.push(R);
          return L.push(Ke("}")), L;
        },
        SwitchCase: function(M, B) {
          var L, N, $, se, oe, pe = this;
          return Ne(function() {
            for (M.test ? L = [
              Se("case", pe.generateExpression(M.test, a.Sequence, ue)),
              ":"
            ] : L = ["default:"], $ = 0, se = M.consequent.length, se && M.consequent[0].type === t.BlockStatement && (N = pe.maybeBlock(M.consequent[0], xe), L.push(N), $ = 1), $ !== se && !Ue(ke(L).toString()) && L.push(R), oe = xe; $ < se; ++$)
              $ === se - 1 && B & ge && (oe |= ge), N = Ke(pe.generateStatement(M.consequent[$], oe)), L.push(N), $ + 1 !== se && !Ue(ke(N).toString()) && L.push(R);
          }), L;
        },
        IfStatement: function(M, B) {
          var L, N, $, se = this;
          return Ne(function() {
            L = [
              "if" + k + "(",
              se.generateExpression(M.test, a.Sequence, ue),
              ")"
            ];
          }), $ = B & ge, N = xe, $ && (N |= ge), M.alternate ? (L.push(this.maybeBlock(M.consequent, xe)), L = this.maybeBlockSuffix(M.consequent, L), M.alternate.type === t.IfStatement ? L = Se(L, ["else ", this.generateStatement(M.alternate, N)]) : L = Se(L, Se("else", this.maybeBlock(M.alternate, N)))) : L.push(this.maybeBlock(M.consequent, N)), L;
        },
        ForStatement: function(M, B) {
          var L, N = this;
          return Ne(function() {
            L = ["for" + k + "("], M.init ? M.init.type === t.VariableDeclaration ? L.push(N.generateStatement(M.init, we)) : (L.push(N.generateExpression(M.init, a.Sequence, $e)), L.push(";")) : L.push(";"), M.test && (L.push(k), L.push(N.generateExpression(M.test, a.Sequence, ue))), L.push(";"), M.update && (L.push(k), L.push(N.generateExpression(M.update, a.Sequence, ue))), L.push(")");
          }), L.push(this.maybeBlock(M.body, B & ge ? Ve : xe)), L;
        },
        ForInStatement: function(M, B) {
          return this.generateIterationForStatement("in", M, B & ge ? Ve : xe);
        },
        ForOfStatement: function(M, B) {
          return this.generateIterationForStatement("of", M, B & ge ? Ve : xe);
        },
        LabeledStatement: function(M, B) {
          return [M.label.name + ":", this.maybeBlock(M.body, B & ge ? Ve : xe)];
        },
        Program: function(M, B) {
          var L, N, $, se, oe;
          for (se = M.body.length, L = [U && se > 0 ? `
` : ""], oe = We, $ = 0; $ < se; ++$)
            !U && $ === se - 1 && (oe |= ge), te && ($ === 0 && (M.body[0].leadingComments || tt(M.range[0], M.body[$].range[0], L)), $ > 0 && !M.body[$ - 1].trailingComments && !M.body[$].leadingComments && tt(M.body[$ - 1].range[1], M.body[$].range[0], L)), N = Ke(this.generateStatement(M.body[$], oe)), L.push(N), $ + 1 < se && !Ue(ke(N).toString()) && (te && M.body[$ + 1].leadingComments || L.push(R)), te && $ === se - 1 && (M.body[$].trailingComments || tt(M.body[$].range[1], M.range[1], L));
          return L;
        },
        FunctionDeclaration: function(M, B) {
          return [
            Ze(M, !0),
            "function",
            Ye(M) || Je(),
            M.id ? Re(M.id) : "",
            this.generateFunctionBody(M)
          ];
        },
        ReturnStatement: function(M, B) {
          return M.argument ? [Se(
            "return",
            this.generateExpression(M.argument, a.Sequence, ue)
          ), this.semicolon(B)] : ["return" + this.semicolon(B)];
        },
        WhileStatement: function(M, B) {
          var L, N = this;
          return Ne(function() {
            L = [
              "while" + k + "(",
              N.generateExpression(M.test, a.Sequence, ue),
              ")"
            ];
          }), L.push(this.maybeBlock(M.body, B & ge ? Ve : xe)), L;
        },
        WithStatement: function(M, B) {
          var L, N = this;
          return Ne(function() {
            L = [
              "with" + k + "(",
              N.generateExpression(M.object, a.Sequence, ue),
              ")"
            ];
          }), L.push(this.maybeBlock(M.body, B & ge ? Ve : xe)), L;
        }
      }, rt(Fe.prototype, Fe.Statement), Fe.Expression = {
        SequenceExpression: function(M, B, L) {
          var N, $, se;
          for (a.Sequence < B && (L |= le), N = [], $ = 0, se = M.expressions.length; $ < se; ++$)
            N.push(this.generateExpression(M.expressions[$], a.Assignment, L)), $ + 1 < se && N.push("," + k);
          return Ge(N, a.Sequence, B);
        },
        AssignmentExpression: function(M, B, L) {
          return this.generateAssignment(M.left, M.right, M.operator, B, L);
        },
        ArrowFunctionExpression: function(M, B, L) {
          return Ge(this.generateFunctionBody(M), a.ArrowFunction, B);
        },
        ConditionalExpression: function(M, B, L) {
          return a.Conditional < B && (L |= le), Ge(
            [
              this.generateExpression(M.test, a.Coalesce, L),
              k + "?" + k,
              this.generateExpression(M.consequent, a.Assignment, L),
              k + ":" + k,
              this.generateExpression(M.alternate, a.Assignment, L)
            ],
            a.Conditional,
            B
          );
        },
        LogicalExpression: function(M, B, L) {
          return M.operator === "??" && (L |= Ie), this.BinaryExpression(M, B, L);
        },
        BinaryExpression: function(M, B, L) {
          var N, $, se, oe, pe, me;
          return oe = o[M.operator], $ = M.operator === "**" ? a.Postfix : oe, se = M.operator === "**" ? oe : oe + 1, oe < B && (L |= le), pe = this.generateExpression(M.left, $, L), me = pe.toString(), me.charCodeAt(me.length - 1) === 47 && f.code.isIdentifierPartES5(M.operator.charCodeAt(0)) ? N = [pe, Je(), M.operator] : N = Se(pe, M.operator), pe = this.generateExpression(M.right, se, L), M.operator === "/" && pe.toString().charAt(0) === "/" || M.operator.slice(-1) === "<" && pe.toString().slice(0, 3) === "!--" ? (N.push(Je()), N.push(pe)) : N = Se(N, pe), M.operator === "in" && !(L & le) ? ["(", N, ")"] : (M.operator === "||" || M.operator === "&&") && L & Ie ? ["(", N, ")"] : Ge(N, oe, B);
        },
        CallExpression: function(M, B, L) {
          var N, $, se;
          for (N = [this.generateExpression(M.callee, a.Call, Xe)], M.optional && N.push("?."), N.push("("), $ = 0, se = M.arguments.length; $ < se; ++$)
            N.push(this.generateExpression(M.arguments[$], a.Assignment, ue)), $ + 1 < se && N.push("," + k);
          return N.push(")"), L & _e ? Ge(N, a.Call, B) : ["(", N, ")"];
        },
        ChainExpression: function(M, B, L) {
          a.OptionalChaining < B && (L |= _e);
          var N = this.generateExpression(M.expression, a.OptionalChaining, L);
          return Ge(N, a.OptionalChaining, B);
        },
        NewExpression: function(M, B, L) {
          var N, $, se, oe, pe;
          if ($ = M.arguments.length, pe = L & Me && !I && $ === 0 ? Te : Ee, N = Se(
            "new",
            this.generateExpression(M.callee, a.New, pe)
          ), !(L & Me) || I || $ > 0) {
            for (N.push("("), se = 0, oe = $; se < oe; ++se)
              N.push(this.generateExpression(M.arguments[se], a.Assignment, ue)), se + 1 < oe && N.push("," + k);
            N.push(")");
          }
          return Ge(N, a.New, B);
        },
        MemberExpression: function(M, B, L) {
          var N, $;
          return N = [this.generateExpression(M.object, a.Call, L & _e ? Xe : Ee)], M.computed ? (M.optional && N.push("?."), N.push("["), N.push(this.generateExpression(M.property, a.Sequence, L & _e ? ue : Te)), N.push("]")) : (!M.optional && M.object.type === t.Literal && typeof M.object.value == "number" && ($ = ke(N).toString(), $.indexOf(".") < 0 && !/[eExX]/.test($) && f.code.isDecimalDigit($.charCodeAt($.length - 1)) && !($.length >= 2 && $.charCodeAt(0) === 48) && N.push(" ")), N.push(M.optional ? "?." : "."), N.push(Re(M.property))), Ge(N, a.Member, B);
        },
        MetaProperty: function(M, B, L) {
          var N;
          return N = [], N.push(typeof M.meta == "string" ? M.meta : Re(M.meta)), N.push("."), N.push(typeof M.property == "string" ? M.property : Re(M.property)), Ge(N, a.Member, B);
        },
        UnaryExpression: function(M, B, L) {
          var N, $, se, oe, pe;
          return $ = this.generateExpression(M.argument, a.Unary, ue), k === "" ? N = Se(M.operator, $) : (N = [M.operator], M.operator.length > 2 ? N = Se(N, $) : (oe = ke(N).toString(), pe = oe.charCodeAt(oe.length - 1), se = $.toString().charCodeAt(0), ((pe === 43 || pe === 45) && pe === se || f.code.isIdentifierPartES5(pe) && f.code.isIdentifierPartES5(se)) && N.push(Je()), N.push($))), Ge(N, a.Unary, B);
        },
        YieldExpression: function(M, B, L) {
          var N;
          return M.delegate ? N = "yield*" : N = "yield", M.argument && (N = Se(
            N,
            this.generateExpression(M.argument, a.Yield, ue)
          )), Ge(N, a.Yield, B);
        },
        AwaitExpression: function(M, B, L) {
          var N = Se(
            M.all ? "await*" : "await",
            this.generateExpression(M.argument, a.Await, ue)
          );
          return Ge(N, a.Await, B);
        },
        UpdateExpression: function(M, B, L) {
          return M.prefix ? Ge(
            [
              M.operator,
              this.generateExpression(M.argument, a.Unary, ue)
            ],
            a.Unary,
            B
          ) : Ge(
            [
              this.generateExpression(M.argument, a.Postfix, ue),
              M.operator
            ],
            a.Postfix,
            B
          );
        },
        FunctionExpression: function(M, B, L) {
          var N = [
            Ze(M, !0),
            "function"
          ];
          return M.id ? (N.push(Ye(M) || Je()), N.push(Re(M.id))) : N.push(Ye(M) || k), N.push(this.generateFunctionBody(M)), N;
        },
        ArrayPattern: function(M, B, L) {
          return this.ArrayExpression(M, B, L, !0);
        },
        ArrayExpression: function(M, B, L, N) {
          var $, se, oe = this;
          return M.elements.length ? (se = N ? !1 : M.elements.length > 1, $ = ["[", se ? R : ""], Ne(function(pe) {
            var me, Le;
            for (me = 0, Le = M.elements.length; me < Le; ++me)
              M.elements[me] ? ($.push(se ? pe : ""), $.push(oe.generateExpression(M.elements[me], a.Assignment, ue))) : (se && $.push(pe), me + 1 === Le && $.push(",")), me + 1 < Le && $.push("," + (se ? R : k));
          }), se && !Ue(ke($).toString()) && $.push(R), $.push(se ? p : ""), $.push("]"), $) : "[]";
        },
        RestElement: function(M, B, L) {
          return "..." + this.generatePattern(M.argument);
        },
        ClassExpression: function(M, B, L) {
          var N, $;
          return N = ["class"], M.id && (N = Se(N, this.generateExpression(M.id, a.Sequence, ue))), M.superClass && ($ = Se("extends", this.generateExpression(M.superClass, a.Unary, ue)), N = Se(N, $)), N.push(k), N.push(this.generateStatement(M.body, Ve)), N;
        },
        MethodDefinition: function(M, B, L) {
          var N, $;
          return M.static ? N = ["static" + k] : N = [], M.kind === "get" || M.kind === "set" ? $ = [
            Se(M.kind, this.generatePropertyKey(M.key, M.computed)),
            this.generateFunctionBody(M.value)
          ] : $ = [
            Dt(M),
            this.generatePropertyKey(M.key, M.computed),
            this.generateFunctionBody(M.value)
          ], Se(N, $);
        },
        Property: function(M, B, L) {
          return M.kind === "get" || M.kind === "set" ? [
            M.kind,
            Je(),
            this.generatePropertyKey(M.key, M.computed),
            this.generateFunctionBody(M.value)
          ] : M.shorthand ? M.value.type === "AssignmentPattern" ? this.AssignmentPattern(M.value, a.Sequence, ue) : this.generatePropertyKey(M.key, M.computed) : M.method ? [
            Dt(M),
            this.generatePropertyKey(M.key, M.computed),
            this.generateFunctionBody(M.value)
          ] : [
            this.generatePropertyKey(M.key, M.computed),
            ":" + k,
            this.generateExpression(M.value, a.Assignment, ue)
          ];
        },
        ObjectExpression: function(M, B, L) {
          var N, $, se, oe = this;
          return M.properties.length ? (N = M.properties.length > 1, Ne(function() {
            se = oe.generateExpression(M.properties[0], a.Sequence, ue);
          }), !N && !At(ke(se).toString()) ? ["{", k, se, k, "}"] : (Ne(function(pe) {
            var me, Le;
            if ($ = ["{", R, pe, se], N)
              for ($.push("," + R), me = 1, Le = M.properties.length; me < Le; ++me)
                $.push(pe), $.push(oe.generateExpression(M.properties[me], a.Sequence, ue)), me + 1 < Le && $.push("," + R);
          }), Ue(ke($).toString()) || $.push(R), $.push(p), $.push("}"), $)) : "{}";
        },
        AssignmentPattern: function(M, B, L) {
          return this.generateAssignment(M.left, M.right, "=", B, L);
        },
        ObjectPattern: function(M, B, L) {
          var N, $, se, oe, pe, me = this;
          if (!M.properties.length)
            return "{}";
          if (oe = !1, M.properties.length === 1)
            pe = M.properties[0], pe.type === t.Property && pe.value.type !== t.Identifier && (oe = !0);
          else
            for ($ = 0, se = M.properties.length; $ < se; ++$)
              if (pe = M.properties[$], pe.type === t.Property && !pe.shorthand) {
                oe = !0;
                break;
              }
          return N = ["{", oe ? R : ""], Ne(function(Le) {
            var He, bt;
            for (He = 0, bt = M.properties.length; He < bt; ++He)
              N.push(oe ? Le : ""), N.push(me.generateExpression(M.properties[He], a.Sequence, ue)), He + 1 < bt && N.push("," + (oe ? R : k));
          }), oe && !Ue(ke(N).toString()) && N.push(R), N.push(oe ? p : ""), N.push("}"), N;
        },
        ThisExpression: function(M, B, L) {
          return "this";
        },
        Super: function(M, B, L) {
          return "super";
        },
        Identifier: function(M, B, L) {
          return Re(M);
        },
        ImportDefaultSpecifier: function(M, B, L) {
          return Re(M.id || M.local);
        },
        ImportNamespaceSpecifier: function(M, B, L) {
          var N = ["*"], $ = M.id || M.local;
          return $ && N.push(k + "as" + Je() + Re($)), N;
        },
        ImportSpecifier: function(M, B, L) {
          var N = M.imported, $ = [N.name], se = M.local;
          return se && se.name !== N.name && $.push(Je() + "as" + Je() + Re(se)), $;
        },
        ExportSpecifier: function(M, B, L) {
          var N = M.local, $ = [N.name], se = M.exported;
          return se && se.name !== N.name && $.push(Je() + "as" + Je() + Re(se)), $;
        },
        Literal: function(M, B, L) {
          var N;
          if (M.hasOwnProperty("raw") && z && H.raw)
            try {
              if (N = z(M.raw).body[0].expression, N.type === t.Literal && N.value === M.value)
                return M.raw;
            } catch {
            }
          return M.regex ? "/" + M.regex.pattern + "/" + M.regex.flags : typeof M.value == "bigint" ? M.value.toString() + "n" : M.bigint ? M.bigint + "n" : M.value === null ? "null" : typeof M.value == "string" ? st(M.value) : typeof M.value == "number" ? ot(M.value) : typeof M.value == "boolean" ? M.value ? "true" : "false" : ht(M.value);
        },
        GeneratorExpression: function(M, B, L) {
          return this.ComprehensionExpression(M, B, L);
        },
        ComprehensionExpression: function(M, B, L) {
          var N, $, se, oe, pe = this;
          return N = M.type === t.GeneratorExpression ? ["("] : ["["], H.moz.comprehensionExpressionStartsWithAssignment && (oe = this.generateExpression(M.body, a.Assignment, ue), N.push(oe)), M.blocks && Ne(function() {
            for ($ = 0, se = M.blocks.length; $ < se; ++$)
              oe = pe.generateExpression(M.blocks[$], a.Sequence, ue), $ > 0 || H.moz.comprehensionExpressionStartsWithAssignment ? N = Se(N, oe) : N.push(oe);
          }), M.filter && (N = Se(N, "if" + k), oe = this.generateExpression(M.filter, a.Sequence, ue), N = Se(N, ["(", oe, ")"])), H.moz.comprehensionExpressionStartsWithAssignment || (oe = this.generateExpression(M.body, a.Assignment, ue), N = Se(N, oe)), N.push(M.type === t.GeneratorExpression ? ")" : "]"), N;
        },
        ComprehensionBlock: function(M, B, L) {
          var N;
          return M.left.type === t.VariableDeclaration ? N = [
            M.left.kind,
            Je(),
            this.generateStatement(M.left.declarations[0], we)
          ] : N = this.generateExpression(M.left, a.Call, ue), N = Se(N, M.of ? "of" : "in"), N = Se(N, this.generateExpression(M.right, a.Sequence, ue)), ["for" + k + "(", N, ")"];
        },
        SpreadElement: function(M, B, L) {
          return [
            "...",
            this.generateExpression(M.argument, a.Assignment, ue)
          ];
        },
        TaggedTemplateExpression: function(M, B, L) {
          var N = Xe;
          L & _e || (N = Ee);
          var $ = [
            this.generateExpression(M.tag, a.Call, N),
            this.generateExpression(M.quasi, a.Primary, qe)
          ];
          return Ge($, a.TaggedTemplate, B);
        },
        TemplateElement: function(M, B, L) {
          return M.value.raw;
        },
        TemplateLiteral: function(M, B, L) {
          var N, $, se;
          for (N = ["`"], $ = 0, se = M.quasis.length; $ < se; ++$)
            N.push(this.generateExpression(M.quasis[$], a.Primary, ue)), $ + 1 < se && (N.push("${" + k), N.push(this.generateExpression(M.expressions[$], a.Sequence, ue)), N.push(k + "}"));
          return N.push("`"), N;
        },
        ModuleSpecifier: function(M, B, L) {
          return this.Literal(M, B, L);
        },
        ImportExpression: function(M, B, L) {
          return Ge([
            "import(",
            this.generateExpression(M.source, a.Assignment, ue),
            ")"
          ], a.Call, B);
        }
      }, rt(Fe.prototype, Fe.Expression), Fe.prototype.generateExpression = function(M, B, L) {
        var N, $;
        return $ = M.type || t.Property, H.verbatim && M.hasOwnProperty(H.verbatim) ? Ct(M, B) : (N = this[$](M, B, L), H.comment && (N = pt(M, N)), ke(N, M));
      }, Fe.prototype.generateStatement = function(M, B) {
        var L, N;
        return L = this[M.type](M, B), H.comment && (L = pt(M, L)), N = ke(L).toString(), M.type === t.Program && !U && R === "" && N.charAt(N.length - 1) === `
` && (L = j ? ke(L).replaceRight(/\s+$/, "") : N.replace(/\s+$/, "")), ke(L, M);
      };
      function Jt(M) {
        var B;
        if (B = new Fe(), fe(M))
          return B.generateStatement(M, xe);
        if (he(M))
          return B.generateExpression(M, a.Sequence, ue);
        throw new Error("Unknown node type: " + M.type);
      }
      function Kt(M, B) {
        var L = nt(), N, $;
        return B != null ? (typeof B.indent == "string" && (L.format.indent.style = B.indent), typeof B.base == "number" && (L.format.indent.base = B.base), B = at(L, B), g = B.format.indent.style, typeof B.base == "string" ? p = B.base : p = ze(g, B.format.indent.base)) : (B = L, g = B.format.indent.style, p = ze(g, B.format.indent.base)), d = B.format.json, b = B.format.renumber, F = d ? !1 : B.format.hexadecimal, E = d ? "double" : B.format.quotes, S = B.format.escapeless, R = B.format.newline, k = B.format.space, B.format.compact && (R = k = g = p = ""), I = B.format.parentheses, V = B.format.semicolons, U = B.format.safeConcatenation, q = B.directive, z = d ? null : B.parse, j = B.sourceMap, ee = B.sourceCode, te = B.format.preserveBlankLines && ee !== null, H = B, j && (e.browser ? u = commonjsGlobal.sourceMap.SourceNode : u = requireSourceMap().SourceNode), N = Jt(M), j ? ($ = N.toStringWithSourceMap({
          file: B.file,
          sourceRoot: B.sourceMapRoot
        }), B.sourceContent && $.map.setSourceContent(
          B.sourceMap,
          B.sourceContent
        ), B.sourceMapWithCode ? $ : $.map.toString()) : ($ = { code: N.toString(), map: null }, B.sourceMapWithCode ? $ : $.code);
      }
      de = {
        indent: {
          style: "",
          base: 0
        },
        renumber: !0,
        hexadecimal: !0,
        quotes: "auto",
        escapeless: !0,
        compact: !0,
        parentheses: !1,
        semicolons: !1
      }, ie = nt().format, e.version = require$$3.version, e.generate = Kt, e.attachComments = l.attachComments, e.Precedence = at({}, a), e.browser = !1, e.FORMAT_MINIFY = de, e.FORMAT_DEFAULTS = ie;
    })();
  }(escodegen$1)), escodegen$1;
}
var escodegenExports = requireEscodegen();
const escodegen = /* @__PURE__ */ getDefaultExportFromCjs(escodegenExports);
class WalkerBase {
  constructor() {
    this.should_skip = !1, this.should_remove = !1, this.replacement = null, this.context = {
      skip: () => this.should_skip = !0,
      remove: () => this.should_remove = !0,
      replace: (t) => this.replacement = t
    };
  }
  /**
   * @template {Node} Parent
   * @param {Parent | null | undefined} parent
   * @param {keyof Parent | null | undefined} prop
   * @param {number | null | undefined} index
   * @param {Node} node
   */
  replace(t, a, o, u) {
    t && a && (o != null ? t[a][o] = u : t[a] = u);
  }
  /**
   * @template {Node} Parent
   * @param {Parent | null | undefined} parent
   * @param {keyof Parent | null | undefined} prop
   * @param {number | null | undefined} index
   */
  remove(t, a, o) {
    t && a && (o != null ? t[a].splice(o, 1) : delete t[a]);
  }
}
class SyncWalker extends WalkerBase {
  /**
   *
   * @param {SyncHandler} [enter]
   * @param {SyncHandler} [leave]
   */
  constructor(t, a) {
    super(), this.should_skip = !1, this.should_remove = !1, this.replacement = null, this.context = {
      skip: () => this.should_skip = !0,
      remove: () => this.should_remove = !0,
      replace: (o) => this.replacement = o
    }, this.enter = t, this.leave = a;
  }
  /**
   * @template {Node} Parent
   * @param {Node} node
   * @param {Parent | null} parent
   * @param {keyof Parent} [prop]
   * @param {number | null} [index]
   * @returns {Node | null}
   */
  visit(t, a, o, u) {
    if (t) {
      if (this.enter) {
        const f = this.should_skip, p = this.should_remove, g = this.replacement;
        this.should_skip = !1, this.should_remove = !1, this.replacement = null, this.enter.call(this.context, t, a, o, u), this.replacement && (t = this.replacement, this.replace(a, o, u, t)), this.should_remove && this.remove(a, o, u);
        const d = this.should_skip, b = this.should_remove;
        if (this.should_skip = f, this.should_remove = p, this.replacement = g, d) return t;
        if (b) return null;
      }
      let l;
      for (l in t) {
        const f = t[l];
        if (f && typeof f == "object")
          if (Array.isArray(f)) {
            const p = (
              /** @type {Array<unknown>} */
              f
            );
            for (let g = 0; g < p.length; g += 1) {
              const d = p[g];
              isNode(d) && (this.visit(d, t, l, g) || g--);
            }
          } else isNode(f) && this.visit(f, t, l, null);
      }
      if (this.leave) {
        const f = this.replacement, p = this.should_remove;
        this.replacement = null, this.should_remove = !1, this.leave.call(this.context, t, a, o, u), this.replacement && (t = this.replacement, this.replace(a, o, u, t)), this.should_remove && this.remove(a, o, u);
        const g = this.should_remove;
        if (this.replacement = f, this.should_remove = p, g) return null;
      }
    }
    return t;
  }
}
function isNode(e) {
  return e !== null && typeof e == "object" && "type" in e && typeof e.type == "string";
}
function walk(e, { enter: t, leave: a }) {
  return new SyncWalker(t, a).visit(e, null);
}
let widgetMethods = [];
function registerWidgetType(e) {
  widgetMethods.push(e);
}
let languages = /* @__PURE__ */ new Map();
function registerLanguage(e, t) {
  languages.set(e, t);
}
function transpiler(e, t = {}) {
  const { wrapAsync: a = !1, addReturn: o = !0, emitMiniLocations: u = !0, emitWidgets: l = !0 } = t;
  let f = parse$6(e, {
    ecmaVersion: 2022,
    allowAwaitOutsideFunction: !0,
    locations: !0
  }), p = [];
  const g = (E, S) => {
    const R = languages.get("minilang");
    if (R) {
      const k = `[${E}]`, I = R.getLocations(k, S.start);
      p = p.concat(I);
    } else {
      const k = getLeafLocations(`"${E}"`, S.start, e);
      p = p.concat(k);
    }
  };
  let d = [];
  walk(f, {
    enter(E, S) {
      if (isLanguageLiteral(E)) {
        const { name: R } = E.tag, k = languages.get(R), I = E.quasi.quasis[0].value.raw, V = E.quasi.start + 1;
        if (u) {
          const U = k.getLocations(I, V);
          p = p.concat(U);
        }
        return this.skip(), this.replace(languageWithLocation(R, I, V));
      }
      if (isTemplateLiteral(E, "tidal")) {
        const R = E.quasi.quasis[0].value.raw, k = E.quasi.start + 1;
        if (u) {
          const I = collectHaskellMiniLocations(R, k);
          p = p.concat(I);
        }
        return this.skip(), this.replace(tidalWithLocation(R, k));
      }
      if (isBackTickString(E, S)) {
        const { quasis: R } = E, { raw: k } = R[0].value;
        return this.skip(), u && g(k, E), this.replace(miniWithLocation(k, E));
      }
      if (isStringWithDoubleQuotes(E)) {
        const { value: R } = E;
        return this.skip(), u && g(R, E), this.replace(miniWithLocation(R, E));
      }
      if (isSliderFunction(E))
        return l && d.push({
          from: E.arguments[0].start,
          to: E.arguments[0].end,
          value: E.arguments[0].raw,
          // don't use value!
          min: E.arguments[1]?.value ?? 0,
          max: E.arguments[2]?.value ?? 1,
          step: E.arguments[3]?.value,
          type: "slider"
        }), this.replace(sliderWithLocation(E));
      if (isWidgetMethod(E)) {
        const R = E.callee.property.name, k = d.filter((V) => V.type === R).length, I = {
          to: E.end,
          index: k,
          type: R,
          id: t.id
        };
        return l && d.push(I), this.replace(widgetWithLocation(E, I));
      }
      if (isBareSamplesCall(E, S))
        return this.replace(withAwait(E));
      if (isLabelStatement(E))
        return this.replace(labelToP(E));
    },
    leave(E, S, R, k) {
    }
  });
  let { body: b } = f;
  if (!b.length)
    console.warn("empty body -> fallback to silence"), b.push({
      type: "ExpressionStatement",
      expression: {
        type: "Identifier",
        name: "silence"
      }
    });
  else if (!b?.[b.length - 1]?.expression)
    throw new Error("unexpected ast format without body expression");
  if (o) {
    const { expression: E } = b[b.length - 1];
    b[b.length - 1] = {
      type: "ReturnStatement",
      argument: E
    };
  }
  let F = escodegen.generate(f);
  return a && (F = `(async ()=>{${F}})()`), u ? { output: F, miniLocations: p, widgets: d } : { output: F };
}
function isStringWithDoubleQuotes(e, t, a) {
  return e.type !== "Literal" ? !1 : e.raw[0] === '"';
}
function isBackTickString(e, t) {
  return e.type === "TemplateLiteral" && t.type !== "TaggedTemplateExpression";
}
function miniWithLocation(e, t) {
  const { start: a } = t, o = languages.get("minilang");
  let u = "m";
  return o && o.name && (u = o.name), {
    type: "CallExpression",
    callee: {
      type: "Identifier",
      name: u
    },
    arguments: [
      { type: "Literal", value: e },
      { type: "Literal", value: a }
    ],
    optional: !1
  };
}
function isSliderFunction(e) {
  return e.type === "CallExpression" && e.callee.name === "slider";
}
function isWidgetMethod(e) {
  return e.type === "CallExpression" && widgetMethods.includes(e.callee.property?.name);
}
function sliderWithLocation(e) {
  const t = "slider_" + e.arguments[0].start;
  return e.arguments.unshift({
    type: "Literal",
    value: t,
    raw: t
  }), e.callee.name = "sliderWithID", e;
}
function getWidgetID(e) {
  return `${e.id || ""}_widget_${e.type}_${e.index}`;
}
function widgetWithLocation(e, t) {
  const a = getWidgetID(t);
  return e.arguments.unshift({
    type: "Literal",
    value: a,
    raw: a
  }), e;
}
function isBareSamplesCall(e, t) {
  return e.type === "CallExpression" && e.callee.name === "samples" && t.type !== "AwaitExpression";
}
function withAwait(e) {
  return {
    type: "AwaitExpression",
    argument: e
  };
}
function isLabelStatement(e) {
  return e.type === "LabeledStatement";
}
function labelToP(e) {
  return {
    type: "ExpressionStatement",
    expression: {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: e.body.expression,
        property: {
          type: "Identifier",
          name: "p"
        }
      },
      arguments: [
        {
          type: "Literal",
          value: e.label.name,
          raw: `'${e.label.name}'`
        }
      ]
    }
  };
}
function isLanguageLiteral(e) {
  return e.type === "TaggedTemplateExpression" && languages.has(e.tag.name);
}
function isTemplateLiteral(e, t) {
  return e.type === "TaggedTemplateExpression" && e.tag.name === t;
}
function collectHaskellMiniLocations(e, t) {
  return e.split("").reduce((a, o, u) => (o !== '"' || (!a.length || a[a.length - 1].length > 1 ? a.push([u + 1]) : a[a.length - 1].push(u)), a), []).map(([a, o]) => {
    const u = e.slice(a, o);
    return getLeafLocations(`"${u}"`, t + a - 1);
  }).flat();
}
function tidalWithLocation(e, t) {
  return {
    type: "CallExpression",
    callee: {
      type: "Identifier",
      name: "tidal"
    },
    arguments: [
      { type: "Literal", value: e },
      { type: "Literal", value: t }
    ],
    optional: !1
  };
}
function languageWithLocation(e, t, a) {
  return {
    type: "CallExpression",
    callee: {
      type: "Identifier",
      name: e
    },
    arguments: [
      { type: "Literal", value: t },
      { type: "Literal", value: a }
    ],
    optional: !1
  };
}
function isNamedPitch$1(e) {
  return e !== null && typeof e == "object" && "name" in e && typeof e.name == "string";
}
function isPitch$1(e) {
  return e !== null && typeof e == "object" && "step" in e && typeof e.step == "number" && "alt" in e && typeof e.alt == "number" && !isNaN(e.step) && !isNaN(e.alt);
}
var FIFTHS$1 = [0, 2, 4, -1, 1, 3, 5], STEPS_TO_OCTS$1 = FIFTHS$1.map(
  (e) => Math.floor(e * 7 / 12)
);
function coordinates$1(e) {
  const { step: t, alt: a, oct: o, dir: u = 1 } = e, l = FIFTHS$1[t] + 7 * a;
  if (o === void 0)
    return [u * l];
  const f = o - STEPS_TO_OCTS$1[t] - 4 * a;
  return [u * l, u * f];
}
var FIFTHS_TO_STEPS$1 = [3, 0, 4, 1, 5, 2, 6];
function pitch$1(e) {
  const [t, a, o] = e, u = FIFTHS_TO_STEPS$1[unaltered$1(t)], l = Math.floor((t + 1) / 7);
  if (a === void 0)
    return { step: u, alt: l, dir: o };
  const f = a + 4 * l + STEPS_TO_OCTS$1[u];
  return { step: u, alt: l, oct: f, dir: o };
}
function unaltered$1(e) {
  const t = (e + 1) % 7;
  return t < 0 ? 7 + t : t;
}
var fillStr$5 = (e, t) => Array(Math.abs(t) + 1).join(e), NoInterval$1 = Object.freeze({
  empty: !0,
  name: "",
  num: NaN,
  q: "",
  type: "",
  step: NaN,
  alt: NaN,
  dir: NaN,
  simple: NaN,
  semitones: NaN,
  chroma: NaN,
  coord: [],
  oct: NaN
}), INTERVAL_TONAL_REGEX$1 = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})", INTERVAL_SHORTHAND_REGEX$1 = "(AA|A|P|M|m|d|dd)([-+]?\\d+)", REGEX$8 = new RegExp(
  "^" + INTERVAL_TONAL_REGEX$1 + "|" + INTERVAL_SHORTHAND_REGEX$1 + "$"
);
function tokenizeInterval$1(e) {
  const t = REGEX$8.exec(`${e}`);
  return t === null ? ["", ""] : t[1] ? [t[1], t[2]] : [t[4], t[3]];
}
var cache$5 = {};
function interval$1(e) {
  return typeof e == "string" ? cache$5[e] || (cache$5[e] = parse$5(e)) : isPitch$1(e) ? interval$1(pitchName$3(e)) : isNamedPitch$1(e) ? interval$1(e.name) : NoInterval$1;
}
var SIZES$2 = [0, 2, 4, 5, 7, 9, 11], TYPES$1 = "PMMPPMM";
function parse$5(e) {
  const t = tokenizeInterval$1(e);
  if (t[0] === "")
    return NoInterval$1;
  const a = +t[0], o = t[1], u = (Math.abs(a) - 1) % 7, l = TYPES$1[u];
  if (l === "M" && o === "P")
    return NoInterval$1;
  const f = l === "M" ? "majorable" : "perfectable", p = "" + a + o, g = a < 0 ? -1 : 1, d = a === 8 || a === -8 ? a : g * (u + 1), b = qToAlt$1(f, o), F = Math.floor((Math.abs(a) - 1) / 7), E = g * (SIZES$2[u] + b + 12 * F), S = (g * (SIZES$2[u] + b) % 12 + 12) % 12, R = coordinates$1({ step: u, alt: b, oct: F, dir: g });
  return {
    empty: !1,
    name: p,
    num: a,
    q: o,
    step: u,
    alt: b,
    dir: g,
    type: f,
    simple: d,
    semitones: E,
    chroma: S,
    coord: R,
    oct: F
  };
}
function coordToInterval$1(e, t) {
  const [a, o = 0] = e, u = a * 7 + o * 12 < 0, l = t || u ? [-a, -o, -1] : [a, o, 1];
  return interval$1(pitch$1(l));
}
function qToAlt$1(e, t) {
  return t === "M" && e === "majorable" || t === "P" && e === "perfectable" ? 0 : t === "m" && e === "majorable" ? -1 : /^A+$/.test(t) ? t.length : /^d+$/.test(t) ? -1 * (e === "perfectable" ? t.length : t.length + 1) : 0;
}
function pitchName$3(e) {
  const { step: t, alt: a, oct: o = 0, dir: u } = e;
  if (!u)
    return "";
  const l = t + 1 + 7 * o, f = l === 0 ? t + 1 : l, p = u < 0 ? "-" : "", g = TYPES$1[t] === "M" ? "majorable" : "perfectable";
  return p + f + altToQ$1(g, a);
}
function altToQ$1(e, t) {
  return t === 0 ? e === "majorable" ? "M" : "P" : t === -1 && e === "majorable" ? "m" : t > 0 ? fillStr$5("A", t) : fillStr$5("d", e === "perfectable" ? t : t + 1);
}
var fillStr$4 = (e, t) => Array(Math.abs(t) + 1).join(e), NoNote$1 = Object.freeze({
  empty: !0,
  name: "",
  letter: "",
  acc: "",
  pc: "",
  step: NaN,
  alt: NaN,
  chroma: NaN,
  height: NaN,
  coord: [],
  midi: null,
  freq: null
}), cache$4 = /* @__PURE__ */ new Map(), stepToLetter$1 = (e) => "CDEFGAB".charAt(e), altToAcc$1 = (e) => e < 0 ? fillStr$4("b", -e) : fillStr$4("#", e), accToAlt$1 = (e) => e[0] === "b" ? -e.length : e.length;
function note$1(e) {
  const t = JSON.stringify(e), a = cache$4.get(t);
  if (a)
    return a;
  const o = typeof e == "string" ? parse$4(e) : isPitch$1(e) ? note$1(pitchName$2(e)) : isNamedPitch$1(e) ? note$1(e.name) : NoNote$1;
  return cache$4.set(t, o), o;
}
var REGEX$7 = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
function tokenizeNote$1(e) {
  const t = REGEX$7.exec(e);
  return t ? [t[1].toUpperCase(), t[2].replace(/x/g, "##"), t[3], t[4]] : ["", "", "", ""];
}
function coordToNote$1(e) {
  return note$1(pitch$1(e));
}
var mod$1 = (e, t) => (e % t + t) % t, SEMI$1 = [0, 2, 4, 5, 7, 9, 11];
function parse$4(e) {
  const t = tokenizeNote$1(e);
  if (t[0] === "" || t[3] !== "")
    return NoNote$1;
  const a = t[0], o = t[1], u = t[2], l = (a.charCodeAt(0) + 3) % 7, f = accToAlt$1(o), p = u.length ? +u : void 0, g = coordinates$1({ step: l, alt: f, oct: p }), d = a + o + u, b = a + o, F = (SEMI$1[l] + f + 120) % 12, E = p === void 0 ? mod$1(SEMI$1[l] + f, 12) - 12 * 99 : SEMI$1[l] + f + 12 * (p + 1), S = E >= 0 && E <= 127 ? E : null, R = p === void 0 ? null : Math.pow(2, (E - 69) / 12) * 440;
  return {
    empty: !1,
    acc: o,
    alt: f,
    chroma: F,
    coord: g,
    freq: R,
    height: E,
    letter: a,
    midi: S,
    name: d,
    oct: p,
    pc: b,
    step: l
  };
}
function pitchName$2(e) {
  const { step: t, alt: a, oct: o } = e, u = stepToLetter$1(t);
  if (!u)
    return "";
  const l = u + altToAcc$1(a);
  return o || o === 0 ? l + o : l;
}
function transpose$5(e, t) {
  const a = note$1(e), o = Array.isArray(t) ? t : interval$1(t).coord;
  if (a.empty || !o || o.length < 2)
    return "";
  const u = a.coord, l = u.length === 1 ? [u[0] + o[0]] : [u[0] + o[0], u[1] + o[1]];
  return coordToNote$1(l).name;
}
function tonicIntervalsTransposer$1(e, t) {
  const a = e.length;
  return (o) => {
    if (!t) return "";
    const u = o < 0 ? (a - -o % a) % a : o % a, l = Math.floor(o / a), f = transpose$5(t, [0, l]);
    return transpose$5(f, e[u]);
  };
}
function distance$5(e, t) {
  const a = note$1(e), o = note$1(t);
  if (a.empty || o.empty)
    return "";
  const u = a.coord, l = o.coord, f = l[0] - u[0], p = u.length === 2 && l.length === 2 ? l[1] - u[1] : -Math.floor(f * 7 / 12), g = o.height === a.height && o.midi !== null && a.oct === o.oct && a.step > o.step;
  return coordToInterval$1([f, p], g).name;
}
var fillStr$3 = (e, t) => Array(t + 1).join(e), REGEX$6 = /^(_{1,}|=|\^{1,}|)([abcdefgABCDEFG])([,']*)$/;
function tokenize$4(e) {
  const t = REGEX$6.exec(e);
  return t ? [t[1], t[2], t[3]] : ["", "", ""];
}
function abcToScientificNotation(e) {
  const [t, a, o] = tokenize$4(e);
  if (a === "")
    return "";
  let u = 4;
  for (let f = 0; f < o.length; f++)
    u += o.charAt(f) === "," ? -1 : 1;
  const l = t[0] === "_" ? t.replace(/_/g, "b") : t[0] === "^" ? t.replace(/\^/g, "#") : "";
  return a.charCodeAt(0) > 96 ? a.toUpperCase() + l + (u + 1) : a + l + u;
}
function scientificToAbcNotation(e) {
  const t = note$1(e);
  if (t.empty || !t.oct && t.oct !== 0)
    return "";
  const { letter: a, acc: o, oct: u } = t, l = o[0] === "b" ? o.replace(/b/g, "_") : o.replace(/#/g, "^"), f = u > 4 ? a.toLowerCase() : a, p = u === 5 ? "" : u > 4 ? fillStr$3("'", u - 5) : fillStr$3(",", 4 - u);
  return l + f + p;
}
function transpose$4(e, t) {
  return scientificToAbcNotation(transpose$5(abcToScientificNotation(e), t));
}
function distance$4(e, t) {
  return distance$5(abcToScientificNotation(e), abcToScientificNotation(t));
}
var abc_notation_default = {
  abcToScientificNotation,
  scientificToAbcNotation,
  tokenize: tokenize$4,
  transpose: transpose$4,
  distance: distance$4
};
function ascR$1(e, t) {
  const a = [];
  for (; t--; a[t] = t + e) ;
  return a;
}
function descR$1(e, t) {
  const a = [];
  for (; t--; a[t] = e - t) ;
  return a;
}
function range$1(e, t) {
  return e < t ? ascR$1(e, t - e + 1) : descR$1(e, e - t + 1);
}
function rotate$1(e, t) {
  const a = t.length, o = (e % a + a) % a;
  return t.slice(o, a).concat(t.slice(0, o));
}
function compact$1(e) {
  return e.filter((t) => t === 0 || t);
}
function sortedNoteNames(e) {
  return e.map((a) => note$1(a)).filter((a) => !a.empty).sort((a, o) => a.height - o.height).map((a) => a.name);
}
function sortedUniqNoteNames(e) {
  return sortedNoteNames(e).filter((t, a, o) => a === 0 || t !== o[a - 1]);
}
function shuffle$1(e, t = Math.random) {
  let a, o, u = e.length;
  for (; u; )
    a = Math.floor(t() * u--), o = e[u], e[u] = e[a], e[a] = o;
  return e;
}
function permutations$1(e) {
  return e.length === 0 ? [[]] : permutations$1(e.slice(1)).reduce((t, a) => t.concat(
    e.map((o, u) => {
      const l = a.slice();
      return l.splice(u, 0, e[0]), l;
    })
  ), []);
}
const index$5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  compact: compact$1,
  permutations: permutations$1,
  range: range$1,
  rotate: rotate$1,
  shuffle: shuffle$1,
  sortedNoteNames,
  sortedUniqNoteNames
}, Symbol.toStringTag, { value: "Module" }));
function ascR(e, t) {
  const a = [];
  for (; t--; a[t] = t + e) ;
  return a;
}
function descR(e, t) {
  const a = [];
  for (; t--; a[t] = e - t) ;
  return a;
}
function range(e, t) {
  return e < t ? ascR(e, t - e + 1) : descR(e, e - t + 1);
}
function rotate(e, t) {
  const a = t.length, o = (e % a + a) % a;
  return t.slice(o, a).concat(t.slice(0, o));
}
function compact(e) {
  return e.filter((t) => t === 0 || t);
}
function shuffle(e, t = Math.random) {
  let a, o, u = e.length;
  for (; u; )
    a = Math.floor(t() * u--), o = e[u], e[u] = e[a], e[a] = o;
  return e;
}
function permutations(e) {
  return e.length === 0 ? [[]] : permutations(e.slice(1)).reduce((t, a) => t.concat(
    e.map((o, u) => {
      const l = a.slice();
      return l.splice(u, 0, e[0]), l;
    })
  ), []);
}
var collection_default = {
  compact,
  permutations,
  range,
  rotate,
  shuffle
}, EmptyPcset = {
  empty: !0,
  name: "",
  setNum: 0,
  chroma: "000000000000",
  normalized: "000000000000",
  intervals: []
}, setNumToChroma = (e) => Number(e).toString(2).padStart(12, "0"), chromaToNumber = (e) => parseInt(e, 2), REGEX$5 = /^[01]{12}$/;
function isChroma(e) {
  return REGEX$5.test(e);
}
var isPcsetNum = (e) => typeof e == "number" && e >= 0 && e <= 4095, isPcset = (e) => e && isChroma(e.chroma), cache$3 = { [EmptyPcset.chroma]: EmptyPcset };
function get$b(e) {
  const t = isChroma(e) ? e : isPcsetNum(e) ? setNumToChroma(e) : Array.isArray(e) ? listToChroma(e) : isPcset(e) ? e.chroma : EmptyPcset.chroma;
  return cache$3[t] = cache$3[t] || chromaToPcset(t);
}
var pcset$1 = get$b, chroma$3 = (e) => get$b(e).chroma, intervals = (e) => get$b(e).intervals, num$1 = (e) => get$b(e).setNum, IVLS = [
  "1P",
  "2m",
  "2M",
  "3m",
  "3M",
  "4P",
  "5d",
  "5P",
  "6m",
  "6M",
  "7m",
  "7M"
];
function chromaToIntervals(e) {
  const t = [];
  for (let a = 0; a < 12; a++)
    e.charAt(a) === "1" && t.push(IVLS[a]);
  return t;
}
function notes$1(e) {
  return get$b(e).intervals.map((t) => transpose$5("C", t));
}
function chromas() {
  return range(2048, 4095).map(setNumToChroma);
}
function modes$1(e, t = !0) {
  const o = get$b(e).chroma.split("");
  return compact(
    o.map((u, l) => {
      const f = rotate(l, o);
      return t && f[0] === "0" ? null : f.join("");
    })
  );
}
function isEqual(e, t) {
  return get$b(e).setNum === get$b(t).setNum;
}
function isSubsetOf(e) {
  const t = get$b(e).setNum;
  return (a) => {
    const o = get$b(a).setNum;
    return t && t !== o && (o & t) === o;
  };
}
function isSupersetOf(e) {
  const t = get$b(e).setNum;
  return (a) => {
    const o = get$b(a).setNum;
    return t && t !== o && (o | t) === o;
  };
}
function isNoteIncludedIn(e) {
  const t = get$b(e);
  return (a) => {
    const o = note$1(a);
    return t && !o.empty && t.chroma.charAt(o.chroma) === "1";
  };
}
function filter(e) {
  const t = isNoteIncludedIn(e);
  return (a) => a.filter(t);
}
var pcset_default = {
  get: get$b,
  chroma: chroma$3,
  num: num$1,
  intervals,
  chromas,
  isSupersetOf,
  isSubsetOf,
  isNoteIncludedIn,
  isEqual,
  filter,
  modes: modes$1,
  notes: notes$1,
  // deprecated
  pcset: pcset$1
};
function chromaRotations(e) {
  const t = e.split("");
  return t.map((a, o) => rotate(o, t).join(""));
}
function chromaToPcset(e) {
  const t = chromaToNumber(e), a = chromaRotations(e).map(chromaToNumber).filter((l) => l >= 2048).sort()[0], o = setNumToChroma(a), u = chromaToIntervals(e);
  return {
    empty: !1,
    name: "",
    setNum: t,
    chroma: e,
    normalized: o,
    intervals: u
  };
}
function listToChroma(e) {
  if (e.length === 0)
    return EmptyPcset.chroma;
  let t;
  const a = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let o = 0; o < e.length; o++)
    t = note$1(e[o]), t.empty && (t = interval$1(e[o])), t.empty || (a[t.chroma] = 1);
  return a.join("");
}
var CHORDS$1 = [
  // ==Major==
  ["1P 3M 5P", "major", "M ^  maj"],
  ["1P 3M 5P 7M", "major seventh", "maj7 Δ ma7 M7 Maj7 ^7"],
  ["1P 3M 5P 7M 9M", "major ninth", "maj9 Δ9 ^9"],
  ["1P 3M 5P 7M 9M 13M", "major thirteenth", "maj13 Maj13 ^13"],
  ["1P 3M 5P 6M", "sixth", "6 add6 add13 M6"],
  ["1P 3M 5P 6M 9M", "sixth added ninth", "6add9 6/9 69 M69"],
  ["1P 3M 6m 7M", "major seventh flat sixth", "M7b6 ^7b6"],
  [
    "1P 3M 5P 7M 11A",
    "major seventh sharp eleventh",
    "maj#4 Δ#4 Δ#11 M7#11 ^7#11 maj7#11"
  ],
  // ==Minor==
  // '''Normal'''
  ["1P 3m 5P", "minor", "m min -"],
  ["1P 3m 5P 7m", "minor seventh", "m7 min7 mi7 -7"],
  [
    "1P 3m 5P 7M",
    "minor/major seventh",
    "m/ma7 m/maj7 mM7 mMaj7 m/M7 -Δ7 mΔ -^7 -maj7"
  ],
  ["1P 3m 5P 6M", "minor sixth", "m6 -6"],
  ["1P 3m 5P 7m 9M", "minor ninth", "m9 -9"],
  ["1P 3m 5P 7M 9M", "minor/major ninth", "mM9 mMaj9 -^9"],
  ["1P 3m 5P 7m 9M 11P", "minor eleventh", "m11 -11"],
  ["1P 3m 5P 7m 9M 13M", "minor thirteenth", "m13 -13"],
  // '''Diminished'''
  ["1P 3m 5d", "diminished", "dim ° o"],
  ["1P 3m 5d 7d", "diminished seventh", "dim7 °7 o7"],
  ["1P 3m 5d 7m", "half-diminished", "m7b5 ø -7b5 h7 h"],
  // ==Dominant/Seventh==
  // '''Normal'''
  ["1P 3M 5P 7m", "dominant seventh", "7 dom"],
  ["1P 3M 5P 7m 9M", "dominant ninth", "9"],
  ["1P 3M 5P 7m 9M 13M", "dominant thirteenth", "13"],
  ["1P 3M 5P 7m 11A", "lydian dominant seventh", "7#11 7#4"],
  // '''Altered'''
  ["1P 3M 5P 7m 9m", "dominant flat ninth", "7b9"],
  ["1P 3M 5P 7m 9A", "dominant sharp ninth", "7#9"],
  ["1P 3M 7m 9m", "altered", "alt7"],
  // '''Suspended'''
  ["1P 4P 5P", "suspended fourth", "sus4 sus"],
  ["1P 2M 5P", "suspended second", "sus2"],
  ["1P 4P 5P 7m", "suspended fourth seventh", "7sus4 7sus"],
  ["1P 5P 7m 9M 11P", "eleventh", "11"],
  [
    "1P 4P 5P 7m 9m",
    "suspended fourth flat ninth",
    "b9sus phryg 7b9sus 7b9sus4"
  ],
  // ==Other==
  ["1P 5P", "fifth", "5"],
  ["1P 3M 5A", "augmented", "aug + +5 ^#5"],
  ["1P 3m 5A", "minor augmented", "m#5 -#5 m+"],
  ["1P 3M 5A 7M", "augmented seventh", "maj7#5 maj7+5 +maj7 ^7#5"],
  [
    "1P 3M 5P 7M 9M 11A",
    "major sharp eleventh (lydian)",
    "maj9#11 Δ9#11 ^9#11"
  ],
  // ==Legacy==
  ["1P 2M 4P 5P", "", "sus24 sus4add9"],
  ["1P 3M 5A 7M 9M", "", "maj9#5 Maj9#5"],
  ["1P 3M 5A 7m", "", "7#5 +7 7+ 7aug aug7"],
  ["1P 3M 5A 7m 9A", "", "7#5#9 7#9#5 7alt"],
  ["1P 3M 5A 7m 9M", "", "9#5 9+"],
  ["1P 3M 5A 7m 9M 11A", "", "9#5#11"],
  ["1P 3M 5A 7m 9m", "", "7#5b9 7b9#5"],
  ["1P 3M 5A 7m 9m 11A", "", "7#5b9#11"],
  ["1P 3M 5A 9A", "", "+add#9"],
  ["1P 3M 5A 9M", "", "M#5add9 +add9"],
  ["1P 3M 5P 6M 11A", "", "M6#11 M6b5 6#11 6b5"],
  ["1P 3M 5P 6M 7M 9M", "", "M7add13"],
  ["1P 3M 5P 6M 9M 11A", "", "69#11"],
  ["1P 3m 5P 6M 9M", "", "m69 -69"],
  ["1P 3M 5P 6m 7m", "", "7b6"],
  ["1P 3M 5P 7M 9A 11A", "", "maj7#9#11"],
  ["1P 3M 5P 7M 9M 11A 13M", "", "M13#11 maj13#11 M13+4 M13#4"],
  ["1P 3M 5P 7M 9m", "", "M7b9"],
  ["1P 3M 5P 7m 11A 13m", "", "7#11b13 7b5b13"],
  ["1P 3M 5P 7m 13M", "", "7add6 67 7add13"],
  ["1P 3M 5P 7m 9A 11A", "", "7#9#11 7b5#9 7#9b5"],
  ["1P 3M 5P 7m 9A 11A 13M", "", "13#9#11"],
  ["1P 3M 5P 7m 9A 11A 13m", "", "7#9#11b13"],
  ["1P 3M 5P 7m 9A 13M", "", "13#9"],
  ["1P 3M 5P 7m 9A 13m", "", "7#9b13"],
  ["1P 3M 5P 7m 9M 11A", "", "9#11 9+4 9#4"],
  ["1P 3M 5P 7m 9M 11A 13M", "", "13#11 13+4 13#4"],
  ["1P 3M 5P 7m 9M 11A 13m", "", "9#11b13 9b5b13"],
  ["1P 3M 5P 7m 9m 11A", "", "7b9#11 7b5b9 7b9b5"],
  ["1P 3M 5P 7m 9m 11A 13M", "", "13b9#11"],
  ["1P 3M 5P 7m 9m 11A 13m", "", "7b9b13#11 7b9#11b13 7b5b9b13"],
  ["1P 3M 5P 7m 9m 13M", "", "13b9"],
  ["1P 3M 5P 7m 9m 13m", "", "7b9b13"],
  ["1P 3M 5P 7m 9m 9A", "", "7b9#9"],
  ["1P 3M 5P 9M", "", "Madd9 2 add9 add2"],
  ["1P 3M 5P 9m", "", "Maddb9"],
  ["1P 3M 5d", "", "Mb5"],
  ["1P 3M 5d 6M 7m 9M", "", "13b5"],
  ["1P 3M 5d 7M", "", "M7b5"],
  ["1P 3M 5d 7M 9M", "", "M9b5"],
  ["1P 3M 5d 7m", "", "7b5"],
  ["1P 3M 5d 7m 9M", "", "9b5"],
  ["1P 3M 7m", "", "7no5"],
  ["1P 3M 7m 13m", "", "7b13"],
  ["1P 3M 7m 9M", "", "9no5"],
  ["1P 3M 7m 9M 13M", "", "13no5"],
  ["1P 3M 7m 9M 13m", "", "9b13"],
  ["1P 3m 4P 5P", "", "madd4"],
  ["1P 3m 5P 6m 7M", "", "mMaj7b6"],
  ["1P 3m 5P 6m 7M 9M", "", "mMaj9b6"],
  ["1P 3m 5P 7m 11P", "", "m7add11 m7add4"],
  ["1P 3m 5P 9M", "", "madd9"],
  ["1P 3m 5d 6M 7M", "", "o7M7"],
  ["1P 3m 5d 7M", "", "oM7"],
  ["1P 3m 6m 7M", "", "mb6M7"],
  ["1P 3m 6m 7m", "", "m7#5"],
  ["1P 3m 6m 7m 9M", "", "m9#5"],
  ["1P 3m 5A 7m 9M 11P", "", "m11A"],
  ["1P 3m 6m 9m", "", "mb6b9"],
  ["1P 2M 3m 5d 7m", "", "m9b5"],
  ["1P 4P 5A 7M", "", "M7#5sus4"],
  ["1P 4P 5A 7M 9M", "", "M9#5sus4"],
  ["1P 4P 5A 7m", "", "7#5sus4"],
  ["1P 4P 5P 7M", "", "M7sus4"],
  ["1P 4P 5P 7M 9M", "", "M9sus4"],
  ["1P 4P 5P 7m 9M", "", "9sus4 9sus"],
  ["1P 4P 5P 7m 9M 13M", "", "13sus4 13sus"],
  ["1P 4P 5P 7m 9m 13m", "", "7sus4b9b13 7b9b13sus4"],
  ["1P 4P 7m 10m", "", "4 quartal"],
  ["1P 5P 7m 9m 11P", "", "11b9"]
], data_default$3 = CHORDS$1;
({
  ...EmptyPcset
});
var dictionary$2 = [], index$4 = {};
function all$3() {
  return dictionary$2.slice();
}
function add$4(e, t, a) {
  const o = getQuality$1(e), u = {
    ...get$b(e),
    name: a || "",
    quality: o,
    intervals: e,
    aliases: t
  };
  dictionary$2.push(u), u.name && (index$4[u.name] = u), index$4[u.setNum] = u, index$4[u.chroma] = u, u.aliases.forEach((l) => addAlias$2(u, l));
}
function addAlias$2(e, t) {
  index$4[t] = e;
}
function getQuality$1(e) {
  const t = (a) => e.indexOf(a) !== -1;
  return t("5A") ? "Augmented" : t("3M") ? "Major" : t("5d") ? "Diminished" : t("3m") ? "Minor" : "Unknown";
}
data_default$3.forEach(
  ([e, t, a]) => add$4(e.split(" "), a.split(" "), t)
);
dictionary$2.sort((e, t) => e.setNum - t.setNum);
var namedSet = (e) => {
  const t = e.reduce((a, o) => {
    const u = note$1(o).chroma;
    return u !== void 0 && (a[u] = a[u] || note$1(o).name), a;
  }, {});
  return (a) => t[a];
};
function detect$1(e, t = {}) {
  const a = e.map((u) => note$1(u).pc).filter((u) => u);
  return note$1.length === 0 ? [] : findMatches(a, 1, t).filter((u) => u.weight).sort((u, l) => l.weight - u.weight).map((u) => u.name);
}
var BITMASK = {
  // 3m 000100000000
  // 3M 000010000000
  anyThirds: 384,
  // 5P 000000010000
  perfectFifth: 16,
  // 5d 000000100000
  // 5A 000000001000
  nonPerfectFifths: 40,
  anySeventh: 3
}, testChromaNumber = (e) => (t) => !!(t & e), hasAnyThird = testChromaNumber(BITMASK.anyThirds), hasPerfectFifth = testChromaNumber(BITMASK.perfectFifth), hasAnySeventh = testChromaNumber(BITMASK.anySeventh), hasNonPerfectFifth = testChromaNumber(BITMASK.nonPerfectFifths);
function hasAnyThirdAndPerfectFifthAndAnySeventh(e) {
  const t = parseInt(e.chroma, 2);
  return hasAnyThird(t) && hasPerfectFifth(t) && hasAnySeventh(t);
}
function withPerfectFifth(e) {
  const t = parseInt(e, 2);
  return hasNonPerfectFifth(t) ? e : (t | 16).toString(2);
}
function findMatches(e, t, a) {
  const o = e[0], u = note$1(o).chroma, l = namedSet(e), f = modes$1(e, !1), p = [];
  return f.forEach((g, d) => {
    const b = a.assumePerfectFifth && withPerfectFifth(g);
    all$3().filter((E) => a.assumePerfectFifth && hasAnyThirdAndPerfectFifthAndAnySeventh(E) ? E.chroma === b : E.chroma === g).forEach((E) => {
      const S = E.aliases[0], R = l(d);
      d !== u ? p.push({
        weight: 0.5 * t,
        name: `${R}${S}/${o}`
      }) : p.push({ weight: 1 * t, name: `${R}${S}` });
    });
  }), p;
}
function isNamedPitch(e) {
  return e !== null && typeof e == "object" && "name" in e && typeof e.name == "string";
}
var SIZES$1 = [0, 2, 4, 5, 7, 9, 11], chroma$2 = ({ step: e, alt: t }) => (SIZES$1[e] + t + 120) % 12, height = ({ step: e, alt: t, oct: a, dir: o = 1 }) => o * (SIZES$1[e] + t + 12 * (a === void 0 ? -100 : a)), midi$1 = (e) => {
  const t = height(e);
  return e.oct !== void 0 && t >= -12 && t <= 115 ? t + 12 : null;
};
function isPitch(e) {
  return e !== null && typeof e == "object" && "step" in e && typeof e.step == "number" && "alt" in e && typeof e.alt == "number";
}
var FIFTHS = [0, 2, 4, -1, 1, 3, 5], STEPS_TO_OCTS = FIFTHS.map(
  (e) => Math.floor(e * 7 / 12)
);
function coordinates(e) {
  const { step: t, alt: a, oct: o, dir: u = 1 } = e, l = FIFTHS[t] + 7 * a;
  if (o === void 0)
    return [u * l];
  const f = o - STEPS_TO_OCTS[t] - 4 * a;
  return [u * l, u * f];
}
var FIFTHS_TO_STEPS = [3, 0, 4, 1, 5, 2, 6];
function pitch(e) {
  const [t, a, o] = e, u = FIFTHS_TO_STEPS[unaltered(t)], l = Math.floor((t + 1) / 7);
  if (a === void 0)
    return { step: u, alt: l, dir: o };
  const f = a + 4 * l + STEPS_TO_OCTS[u];
  return { step: u, alt: l, oct: f, dir: o };
}
function unaltered(e) {
  const t = (e + 1) % 7;
  return t < 0 ? 7 + t : t;
}
var fillStr$2 = (e, t) => Array(Math.abs(t) + 1).join(e), NoInterval = { empty: !0, name: "", acc: "" }, INTERVAL_TONAL_REGEX = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})", INTERVAL_SHORTHAND_REGEX = "(AA|A|P|M|m|d|dd)([-+]?\\d+)", REGEX$4 = new RegExp(
  "^" + INTERVAL_TONAL_REGEX + "|" + INTERVAL_SHORTHAND_REGEX + "$"
);
function tokenizeInterval(e) {
  const t = REGEX$4.exec(`${e}`);
  return t === null ? ["", ""] : t[1] ? [t[1], t[2]] : [t[4], t[3]];
}
var cache$2 = {};
function interval(e) {
  return typeof e == "string" ? cache$2[e] || (cache$2[e] = parse$3(e)) : isPitch(e) ? interval(pitchName$1(e)) : isNamedPitch(e) ? interval(e.name) : NoInterval;
}
var SIZES = [0, 2, 4, 5, 7, 9, 11], TYPES = "PMMPPMM";
function parse$3(e) {
  const t = tokenizeInterval(e);
  if (t[0] === "")
    return NoInterval;
  const a = +t[0], o = t[1], u = (Math.abs(a) - 1) % 7, l = TYPES[u];
  if (l === "M" && o === "P")
    return NoInterval;
  const f = l === "M" ? "majorable" : "perfectable", p = "" + a + o, g = a < 0 ? -1 : 1, d = a === 8 || a === -8 ? a : g * (u + 1), b = qToAlt(f, o), F = Math.floor((Math.abs(a) - 1) / 7), E = g * (SIZES[u] + b + 12 * F), S = (g * (SIZES[u] + b) % 12 + 12) % 12, R = coordinates({ step: u, alt: b, oct: F, dir: g });
  return {
    empty: !1,
    name: p,
    num: a,
    q: o,
    step: u,
    alt: b,
    dir: g,
    type: f,
    simple: d,
    semitones: E,
    chroma: S,
    coord: R,
    oct: F
  };
}
function coordToInterval(e, t) {
  const [a, o = 0] = e, u = a * 7 + o * 12 < 0, l = t || u ? [-a, -o, -1] : [a, o, 1];
  return interval(pitch(l));
}
function qToAlt(e, t) {
  return t === "M" && e === "majorable" || t === "P" && e === "perfectable" ? 0 : t === "m" && e === "majorable" ? -1 : /^A+$/.test(t) ? t.length : /^d+$/.test(t) ? -1 * (e === "perfectable" ? t.length : t.length + 1) : 0;
}
function pitchName$1(e) {
  const { step: t, alt: a, oct: o = 0, dir: u } = e;
  if (!u)
    return "";
  const l = t + 1 + 7 * o, f = l === 0 ? t + 1 : l, p = u < 0 ? "-" : "", g = TYPES[t] === "M" ? "majorable" : "perfectable";
  return p + f + altToQ(g, a);
}
function altToQ(e, t) {
  return t === 0 ? e === "majorable" ? "M" : "P" : t === -1 && e === "majorable" ? "m" : t > 0 ? fillStr$2("A", t) : fillStr$2("d", e === "perfectable" ? t : t + 1);
}
var fillStr$1 = (e, t) => Array(Math.abs(t) + 1).join(e), NoNote = { empty: !0, name: "", pc: "", acc: "" }, cache$1 = /* @__PURE__ */ new Map(), stepToLetter = (e) => "CDEFGAB".charAt(e), altToAcc = (e) => e < 0 ? fillStr$1("b", -e) : fillStr$1("#", e), accToAlt = (e) => e[0] === "b" ? -e.length : e.length;
function note(e) {
  const t = JSON.stringify(e), a = cache$1.get(t);
  if (a)
    return a;
  const o = typeof e == "string" ? parse$2(e) : isPitch(e) ? note(pitchName(e)) : isNamedPitch(e) ? note(e.name) : NoNote;
  return cache$1.set(t, o), o;
}
var REGEX$3 = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
function tokenizeNote(e) {
  const t = REGEX$3.exec(e);
  return t ? [t[1].toUpperCase(), t[2].replace(/x/g, "##"), t[3], t[4]] : ["", "", "", ""];
}
function coordToNote(e) {
  return note(pitch(e));
}
var mod = (e, t) => (e % t + t) % t, SEMI = [0, 2, 4, 5, 7, 9, 11];
function parse$2(e) {
  const t = tokenizeNote(e);
  if (t[0] === "" || t[3] !== "")
    return NoNote;
  const a = t[0], o = t[1], u = t[2], l = (a.charCodeAt(0) + 3) % 7, f = accToAlt(o), p = u.length ? +u : void 0, g = coordinates({ step: l, alt: f, oct: p }), d = a + o + u, b = a + o, F = (SEMI[l] + f + 120) % 12, E = p === void 0 ? mod(SEMI[l] + f, 12) - 12 * 99 : SEMI[l] + f + 12 * (p + 1), S = E >= 0 && E <= 127 ? E : null, R = p === void 0 ? null : Math.pow(2, (E - 69) / 12) * 440;
  return {
    empty: !1,
    acc: o,
    alt: f,
    chroma: F,
    coord: g,
    freq: R,
    height: E,
    letter: a,
    midi: S,
    name: d,
    oct: p,
    pc: b,
    step: l
  };
}
function pitchName(e) {
  const { step: t, alt: a, oct: o } = e, u = stepToLetter(t);
  if (!u)
    return "";
  const l = u + altToAcc(a);
  return o || o === 0 ? l + o : l;
}
function transpose$3(e, t) {
  const a = note(e), o = Array.isArray(t) ? t : interval(t).coord;
  if (a.empty || !o || o.length < 2)
    return "";
  const u = a.coord, l = u.length === 1 ? [u[0] + o[0]] : [u[0] + o[0], u[1] + o[1]];
  return coordToNote(l).name;
}
function tonicIntervalsTransposer(e, t) {
  const a = e.length;
  return (o) => {
    if (!t)
      return "";
    const u = o < 0 ? (a - -o % a) % a : o % a, l = Math.floor(o / a), f = transpose$3(t, [0, l]);
    return transpose$3(f, e[u]);
  };
}
function distance$3(e, t) {
  const a = note(e), o = note(t);
  if (a.empty || o.empty)
    return "";
  const u = a.coord, l = o.coord, f = l[0] - u[0], p = u.length === 2 && l.length === 2 ? l[1] - u[1] : -Math.floor(f * 7 / 12), g = o.height === a.height && o.midi !== null && a.midi !== null && a.step > o.step;
  return coordToInterval([f, p], g).name;
}
var fillStr = (e, t) => Array(Math.abs(t) + 1).join(e);
function deprecate(e, t, a) {
  return function(...o) {
    return console.warn(`${e} is deprecated. Use ${t}.`), a.apply(this, o);
  };
}
var isNamed = deprecate("isNamed", "isNamedPitch", isNamedPitch);
const Core = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  accToAlt,
  altToAcc,
  chroma: chroma$2,
  coordToInterval,
  coordToNote,
  coordinates,
  deprecate,
  distance: distance$3,
  fillStr,
  height,
  interval,
  isNamed,
  isNamedPitch,
  isPitch,
  midi: midi$1,
  note,
  pitch,
  stepToLetter,
  tokenizeInterval,
  tokenizeNote,
  tonicIntervalsTransposer,
  transpose: transpose$3
}, Symbol.toStringTag, { value: "Module" }));
var CHORDS = [
  ["1P 3M 5P", "major", "M ^  maj"],
  ["1P 3M 5P 7M", "major seventh", "maj7 Δ ma7 M7 Maj7 ^7"],
  ["1P 3M 5P 7M 9M", "major ninth", "maj9 Δ9 ^9"],
  ["1P 3M 5P 7M 9M 13M", "major thirteenth", "maj13 Maj13 ^13"],
  ["1P 3M 5P 6M", "sixth", "6 add6 add13 M6"],
  ["1P 3M 5P 6M 9M", "sixth added ninth", "6add9 6/9 69 M69"],
  ["1P 3M 6m 7M", "major seventh flat sixth", "M7b6 ^7b6"],
  [
    "1P 3M 5P 7M 11A",
    "major seventh sharp eleventh",
    "maj#4 Δ#4 Δ#11 M7#11 ^7#11 maj7#11"
  ],
  ["1P 3m 5P", "minor", "m min -"],
  ["1P 3m 5P 7m", "minor seventh", "m7 min7 mi7 -7"],
  [
    "1P 3m 5P 7M",
    "minor/major seventh",
    "m/ma7 m/maj7 mM7 mMaj7 m/M7 -Δ7 mΔ -^7"
  ],
  ["1P 3m 5P 6M", "minor sixth", "m6 -6"],
  ["1P 3m 5P 7m 9M", "minor ninth", "m9 -9"],
  ["1P 3m 5P 7M 9M", "minor/major ninth", "mM9 mMaj9 -^9"],
  ["1P 3m 5P 7m 9M 11P", "minor eleventh", "m11 -11"],
  ["1P 3m 5P 7m 9M 13M", "minor thirteenth", "m13 -13"],
  ["1P 3m 5d", "diminished", "dim ° o"],
  ["1P 3m 5d 7d", "diminished seventh", "dim7 °7 o7"],
  ["1P 3m 5d 7m", "half-diminished", "m7b5 ø -7b5 h7 h"],
  ["1P 3M 5P 7m", "dominant seventh", "7 dom"],
  ["1P 3M 5P 7m 9M", "dominant ninth", "9"],
  ["1P 3M 5P 7m 9M 13M", "dominant thirteenth", "13"],
  ["1P 3M 5P 7m 11A", "lydian dominant seventh", "7#11 7#4"],
  ["1P 3M 5P 7m 9m", "dominant flat ninth", "7b9"],
  ["1P 3M 5P 7m 9A", "dominant sharp ninth", "7#9"],
  ["1P 3M 7m 9m", "altered", "alt7"],
  ["1P 4P 5P", "suspended fourth", "sus4 sus"],
  ["1P 2M 5P", "suspended second", "sus2"],
  ["1P 4P 5P 7m", "suspended fourth seventh", "7sus4 7sus"],
  ["1P 5P 7m 9M 11P", "eleventh", "11"],
  [
    "1P 4P 5P 7m 9m",
    "suspended fourth flat ninth",
    "b9sus phryg 7b9sus 7b9sus4"
  ],
  ["1P 5P", "fifth", "5"],
  ["1P 3M 5A", "augmented", "aug + +5 ^#5"],
  ["1P 3m 5A", "minor augmented", "m#5 -#5 m+"],
  ["1P 3M 5A 7M", "augmented seventh", "maj7#5 maj7+5 +maj7 ^7#5"],
  [
    "1P 3M 5P 7M 9M 11A",
    "major sharp eleventh (lydian)",
    "maj9#11 Δ9#11 ^9#11"
  ],
  ["1P 2M 4P 5P", "", "sus24 sus4add9"],
  ["1P 3M 5A 7M 9M", "", "maj9#5 Maj9#5"],
  ["1P 3M 5A 7m", "", "7#5 +7 7+ 7aug aug7"],
  ["1P 3M 5A 7m 9A", "", "7#5#9 7#9#5 7alt"],
  ["1P 3M 5A 7m 9M", "", "9#5 9+"],
  ["1P 3M 5A 7m 9M 11A", "", "9#5#11"],
  ["1P 3M 5A 7m 9m", "", "7#5b9 7b9#5"],
  ["1P 3M 5A 7m 9m 11A", "", "7#5b9#11"],
  ["1P 3M 5A 9A", "", "+add#9"],
  ["1P 3M 5A 9M", "", "M#5add9 +add9"],
  ["1P 3M 5P 6M 11A", "", "M6#11 M6b5 6#11 6b5"],
  ["1P 3M 5P 6M 7M 9M", "", "M7add13"],
  ["1P 3M 5P 6M 9M 11A", "", "69#11"],
  ["1P 3m 5P 6M 9M", "", "m69 -69"],
  ["1P 3M 5P 6m 7m", "", "7b6"],
  ["1P 3M 5P 7M 9A 11A", "", "maj7#9#11"],
  ["1P 3M 5P 7M 9M 11A 13M", "", "M13#11 maj13#11 M13+4 M13#4"],
  ["1P 3M 5P 7M 9m", "", "M7b9"],
  ["1P 3M 5P 7m 11A 13m", "", "7#11b13 7b5b13"],
  ["1P 3M 5P 7m 13M", "", "7add6 67 7add13"],
  ["1P 3M 5P 7m 9A 11A", "", "7#9#11 7b5#9 7#9b5"],
  ["1P 3M 5P 7m 9A 11A 13M", "", "13#9#11"],
  ["1P 3M 5P 7m 9A 11A 13m", "", "7#9#11b13"],
  ["1P 3M 5P 7m 9A 13M", "", "13#9"],
  ["1P 3M 5P 7m 9A 13m", "", "7#9b13"],
  ["1P 3M 5P 7m 9M 11A", "", "9#11 9+4 9#4"],
  ["1P 3M 5P 7m 9M 11A 13M", "", "13#11 13+4 13#4"],
  ["1P 3M 5P 7m 9M 11A 13m", "", "9#11b13 9b5b13"],
  ["1P 3M 5P 7m 9m 11A", "", "7b9#11 7b5b9 7b9b5"],
  ["1P 3M 5P 7m 9m 11A 13M", "", "13b9#11"],
  ["1P 3M 5P 7m 9m 11A 13m", "", "7b9b13#11 7b9#11b13 7b5b9b13"],
  ["1P 3M 5P 7m 9m 13M", "", "13b9"],
  ["1P 3M 5P 7m 9m 13m", "", "7b9b13"],
  ["1P 3M 5P 7m 9m 9A", "", "7b9#9"],
  ["1P 3M 5P 9M", "", "Madd9 2 add9 add2"],
  ["1P 3M 5P 9m", "", "Maddb9"],
  ["1P 3M 5d", "", "Mb5"],
  ["1P 3M 5d 6M 7m 9M", "", "13b5"],
  ["1P 3M 5d 7M", "", "M7b5"],
  ["1P 3M 5d 7M 9M", "", "M9b5"],
  ["1P 3M 5d 7m", "", "7b5"],
  ["1P 3M 5d 7m 9M", "", "9b5"],
  ["1P 3M 7m", "", "7no5"],
  ["1P 3M 7m 13m", "", "7b13"],
  ["1P 3M 7m 9M", "", "9no5"],
  ["1P 3M 7m 9M 13M", "", "13no5"],
  ["1P 3M 7m 9M 13m", "", "9b13"],
  ["1P 3m 4P 5P", "", "madd4"],
  ["1P 3m 5P 6m 7M", "", "mMaj7b6"],
  ["1P 3m 5P 6m 7M 9M", "", "mMaj9b6"],
  ["1P 3m 5P 7m 11P", "", "m7add11 m7add4"],
  ["1P 3m 5P 9M", "", "madd9"],
  ["1P 3m 5d 6M 7M", "", "o7M7"],
  ["1P 3m 5d 7M", "", "oM7"],
  ["1P 3m 6m 7M", "", "mb6M7"],
  ["1P 3m 6m 7m", "", "m7#5"],
  ["1P 3m 6m 7m 9M", "", "m9#5"],
  ["1P 3m 5A 7m 9M 11P", "", "m11A"],
  ["1P 3m 6m 9m", "", "mb6b9"],
  ["1P 2M 3m 5d 7m", "", "m9b5"],
  ["1P 4P 5A 7M", "", "M7#5sus4"],
  ["1P 4P 5A 7M 9M", "", "M9#5sus4"],
  ["1P 4P 5A 7m", "", "7#5sus4"],
  ["1P 4P 5P 7M", "", "M7sus4"],
  ["1P 4P 5P 7M 9M", "", "M9sus4"],
  ["1P 4P 5P 7m 9M", "", "9sus4 9sus"],
  ["1P 4P 5P 7m 9M 13M", "", "13sus4 13sus"],
  ["1P 4P 5P 7m 9m 13m", "", "7sus4b9b13 7b9b13sus4"],
  ["1P 4P 7m 10m", "", "4 quartal"],
  ["1P 5P 7m 9m 11P", "", "11b9"]
], data_default$2 = CHORDS, NoChordType = {
  ...EmptyPcset,
  name: "",
  quality: "Unknown",
  intervals: [],
  aliases: []
}, dictionary$1 = [], index$3 = {};
function get$a(e) {
  return index$3[e] || NoChordType;
}
var chordType = deprecate("ChordType.chordType", "ChordType.get", get$a);
function names$8() {
  return dictionary$1.map((e) => e.name).filter((e) => e);
}
function symbols() {
  return dictionary$1.map((e) => e.aliases[0]).filter((e) => e);
}
function keys$1() {
  return Object.keys(index$3);
}
function all$2() {
  return dictionary$1.slice();
}
var entries$2 = deprecate("ChordType.entries", "ChordType.all", all$2);
function removeAll$1() {
  dictionary$1 = [], index$3 = {};
}
function add$3(e, t, a) {
  const o = getQuality(e), u = {
    ...get$b(e),
    name: a || "",
    quality: o,
    intervals: e,
    aliases: t
  };
  dictionary$1.push(u), u.name && (index$3[u.name] = u), index$3[u.setNum] = u, index$3[u.chroma] = u, u.aliases.forEach((l) => addAlias$1(u, l));
}
function addAlias$1(e, t) {
  index$3[t] = e;
}
function getQuality(e) {
  const t = (a) => e.indexOf(a) !== -1;
  return t("5A") ? "Augmented" : t("3M") ? "Major" : t("5d") ? "Diminished" : t("3m") ? "Minor" : "Unknown";
}
data_default$2.forEach(
  ([e, t, a]) => add$3(e.split(" "), a.split(" "), t)
);
dictionary$1.sort((e, t) => e.setNum - t.setNum);
var chord_type_default = {
  names: names$8,
  symbols,
  get: get$a,
  all: all$2,
  add: add$3,
  removeAll: removeAll$1,
  keys: keys$1,
  entries: entries$2,
  chordType
}, SCALES = [
  // Basic scales
  ["1P 2M 3M 5P 6M", "major pentatonic", "pentatonic"],
  ["1P 2M 3M 4P 5P 6M 7M", "major", "ionian"],
  ["1P 2M 3m 4P 5P 6m 7m", "minor", "aeolian"],
  // Jazz common scales
  ["1P 2M 3m 3M 5P 6M", "major blues"],
  ["1P 3m 4P 5d 5P 7m", "minor blues", "blues"],
  ["1P 2M 3m 4P 5P 6M 7M", "melodic minor"],
  ["1P 2M 3m 4P 5P 6m 7M", "harmonic minor"],
  ["1P 2M 3M 4P 5P 6M 7m 7M", "bebop"],
  ["1P 2M 3m 4P 5d 6m 6M 7M", "diminished", "whole-half diminished"],
  // Modes
  ["1P 2M 3m 4P 5P 6M 7m", "dorian"],
  ["1P 2M 3M 4A 5P 6M 7M", "lydian"],
  ["1P 2M 3M 4P 5P 6M 7m", "mixolydian", "dominant"],
  ["1P 2m 3m 4P 5P 6m 7m", "phrygian"],
  ["1P 2m 3m 4P 5d 6m 7m", "locrian"],
  // 5-note scales
  ["1P 3M 4P 5P 7M", "ionian pentatonic"],
  ["1P 3M 4P 5P 7m", "mixolydian pentatonic", "indian"],
  ["1P 2M 4P 5P 6M", "ritusen"],
  ["1P 2M 4P 5P 7m", "egyptian"],
  ["1P 3M 4P 5d 7m", "neopolitan major pentatonic"],
  ["1P 3m 4P 5P 6m", "vietnamese 1"],
  ["1P 2m 3m 5P 6m", "pelog"],
  ["1P 2m 4P 5P 6m", "kumoijoshi"],
  ["1P 2M 3m 5P 6m", "hirajoshi"],
  ["1P 2m 4P 5d 7m", "iwato"],
  ["1P 2m 4P 5P 7m", "in-sen"],
  ["1P 3M 4A 5P 7M", "lydian pentatonic", "chinese"],
  ["1P 3m 4P 6m 7m", "malkos raga"],
  ["1P 3m 4P 5d 7m", "locrian pentatonic", "minor seven flat five pentatonic"],
  ["1P 3m 4P 5P 7m", "minor pentatonic", "vietnamese 2"],
  ["1P 3m 4P 5P 6M", "minor six pentatonic"],
  ["1P 2M 3m 5P 6M", "flat three pentatonic", "kumoi"],
  ["1P 2M 3M 5P 6m", "flat six pentatonic"],
  ["1P 2m 3M 5P 6M", "scriabin"],
  ["1P 3M 5d 6m 7m", "whole tone pentatonic"],
  ["1P 3M 4A 5A 7M", "lydian #5P pentatonic"],
  ["1P 3M 4A 5P 7m", "lydian dominant pentatonic"],
  ["1P 3m 4P 5P 7M", "minor #7M pentatonic"],
  ["1P 3m 4d 5d 7m", "super locrian pentatonic"],
  // 6-note scales
  ["1P 2M 3m 4P 5P 7M", "minor hexatonic"],
  ["1P 2A 3M 5P 5A 7M", "augmented"],
  ["1P 2M 4P 5P 6M 7m", "piongio"],
  ["1P 2m 3M 4A 6M 7m", "prometheus neopolitan"],
  ["1P 2M 3M 4A 6M 7m", "prometheus"],
  ["1P 2m 3M 5d 6m 7m", "mystery #1"],
  ["1P 2m 3M 4P 5A 6M", "six tone symmetric"],
  ["1P 2M 3M 4A 5A 6A", "whole tone", "messiaen's mode #1"],
  ["1P 2m 4P 4A 5P 7M", "messiaen's mode #5"],
  // 7-note scales
  ["1P 2M 3M 4P 5d 6m 7m", "locrian major", "arabian"],
  ["1P 2m 3M 4A 5P 6m 7M", "double harmonic lydian"],
  [
    "1P 2m 2A 3M 4A 6m 7m",
    "altered",
    "super locrian",
    "diminished whole tone",
    "pomeroy"
  ],
  ["1P 2M 3m 4P 5d 6m 7m", "locrian #2", "half-diminished", "aeolian b5"],
  [
    "1P 2M 3M 4P 5P 6m 7m",
    "mixolydian b6",
    "melodic minor fifth mode",
    "hindu"
  ],
  ["1P 2M 3M 4A 5P 6M 7m", "lydian dominant", "lydian b7", "overtone"],
  ["1P 2M 3M 4A 5A 6M 7M", "lydian augmented"],
  [
    "1P 2m 3m 4P 5P 6M 7m",
    "dorian b2",
    "phrygian #6",
    "melodic minor second mode"
  ],
  [
    "1P 2m 3m 4d 5d 6m 7d",
    "ultralocrian",
    "superlocrian bb7",
    "superlocrian diminished"
  ],
  ["1P 2m 3m 4P 5d 6M 7m", "locrian 6", "locrian natural 6", "locrian sharp 6"],
  ["1P 2A 3M 4P 5P 5A 7M", "augmented heptatonic"],
  // Source https://en.wikipedia.org/wiki/Ukrainian_Dorian_scale
  [
    "1P 2M 3m 4A 5P 6M 7m",
    "dorian #4",
    "ukrainian dorian",
    "romanian minor",
    "altered dorian"
  ],
  ["1P 2M 3m 4A 5P 6M 7M", "lydian diminished"],
  ["1P 2M 3M 4A 5A 7m 7M", "leading whole tone"],
  ["1P 2M 3M 4A 5P 6m 7m", "lydian minor"],
  ["1P 2m 3M 4P 5P 6m 7m", "phrygian dominant", "spanish", "phrygian major"],
  ["1P 2m 3m 4P 5P 6m 7M", "balinese"],
  ["1P 2m 3m 4P 5P 6M 7M", "neopolitan major"],
  ["1P 2M 3M 4P 5P 6m 7M", "harmonic major"],
  ["1P 2m 3M 4P 5P 6m 7M", "double harmonic major", "gypsy"],
  ["1P 2M 3m 4A 5P 6m 7M", "hungarian minor"],
  ["1P 2A 3M 4A 5P 6M 7m", "hungarian major"],
  ["1P 2m 3M 4P 5d 6M 7m", "oriental"],
  ["1P 2m 3m 3M 4A 5P 7m", "flamenco"],
  ["1P 2m 3m 4A 5P 6m 7M", "todi raga"],
  ["1P 2m 3M 4P 5d 6m 7M", "persian"],
  ["1P 2m 3M 5d 6m 7m 7M", "enigmatic"],
  [
    "1P 2M 3M 4P 5A 6M 7M",
    "major augmented",
    "major #5",
    "ionian augmented",
    "ionian #5"
  ],
  ["1P 2A 3M 4A 5P 6M 7M", "lydian #9"],
  // 8-note scales
  ["1P 2m 2M 4P 4A 5P 6m 7M", "messiaen's mode #4"],
  ["1P 2m 3M 4P 4A 5P 6m 7M", "purvi raga"],
  ["1P 2m 3m 3M 4P 5P 6m 7m", "spanish heptatonic"],
  ["1P 2M 3m 3M 4P 5P 6M 7m", "bebop minor"],
  ["1P 2M 3M 4P 5P 5A 6M 7M", "bebop major"],
  ["1P 2m 3m 4P 5d 5P 6m 7m", "bebop locrian"],
  ["1P 2M 3m 4P 5P 6m 7m 7M", "minor bebop"],
  ["1P 2M 3M 4P 5d 5P 6M 7M", "ichikosucho"],
  ["1P 2M 3m 4P 5P 6m 6M 7M", "minor six diminished"],
  [
    "1P 2m 3m 3M 4A 5P 6M 7m",
    "half-whole diminished",
    "dominant diminished",
    "messiaen's mode #2"
  ],
  ["1P 3m 3M 4P 5P 6M 7m 7M", "kafi raga"],
  ["1P 2M 3M 4P 4A 5A 6A 7M", "messiaen's mode #6"],
  // 9-note scales
  ["1P 2M 3m 3M 4P 5d 5P 6M 7m", "composite blues"],
  ["1P 2M 3m 3M 4A 5P 6m 7m 7M", "messiaen's mode #3"],
  // 10-note scales
  ["1P 2m 2M 3m 4P 4A 5P 6m 6M 7M", "messiaen's mode #7"],
  // 12-note scales
  ["1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M", "chromatic"]
], data_default$1 = SCALES, NoScaleType = {
  ...EmptyPcset,
  intervals: [],
  aliases: []
}, dictionary = [], index$2 = {};
function names$7() {
  return dictionary.map((e) => e.name);
}
function get$9(e) {
  return index$2[e] || NoScaleType;
}
var scaleType = get$9;
function all$1() {
  return dictionary.slice();
}
var entries$1 = all$1;
function keys() {
  return Object.keys(index$2);
}
function removeAll() {
  dictionary = [], index$2 = {};
}
function add$2(e, t, a = []) {
  const o = { ...get$b(e), name: t, intervals: e, aliases: a };
  return dictionary.push(o), index$2[o.name] = o, index$2[o.setNum] = o, index$2[o.chroma] = o, o.aliases.forEach((u) => addAlias(o, u)), o;
}
function addAlias(e, t) {
  index$2[t] = e;
}
data_default$1.forEach(
  ([e, t, ...a]) => add$2(e.split(" "), t, a)
);
var scale_type_default = {
  names: names$7,
  get: get$9,
  all: all$1,
  add: add$2,
  removeAll,
  keys,
  // deprecated
  entries: entries$1,
  scaleType
}, NoChord = {
  empty: !0,
  name: "",
  symbol: "",
  root: "",
  rootDegree: 0,
  type: "",
  tonic: null,
  setNum: NaN,
  quality: "Unknown",
  chroma: "",
  normalized: "",
  aliases: [],
  notes: [],
  intervals: []
};
function tokenize$3(e) {
  const [t, a, o, u] = tokenizeNote(e);
  return t === "" ? ["", e] : t === "A" && u === "ug" ? ["", "aug"] : [t + a, o + u];
}
function get$8(e) {
  if (e === "")
    return NoChord;
  if (Array.isArray(e) && e.length === 2)
    return getChord(e[1], e[0]);
  {
    const [t, a] = tokenize$3(e), o = getChord(a, t);
    return o.empty ? getChord(e) : o;
  }
}
function getChord(e, t, a) {
  const o = get$a(e), u = note(t || ""), l = note(a || "");
  if (o.empty || t && u.empty || a && l.empty)
    return NoChord;
  const f = distance$3(u.pc, l.pc), p = o.intervals.indexOf(f) + 1;
  if (!l.empty && !p)
    return NoChord;
  const g = Array.from(o.intervals);
  for (let E = 1; E < p; E++) {
    const S = g[0][0], R = g[0][1], k = parseInt(S, 10) + 7;
    g.push(`${k}${R}`), g.shift();
  }
  const d = u.empty ? [] : g.map((E) => transpose$3(u, E));
  e = o.aliases.indexOf(e) !== -1 ? e : o.aliases[0];
  const b = `${u.empty ? "" : u.pc}${e}${l.empty || p <= 1 ? "" : "/" + l.pc}`, F = `${t ? u.pc + " " : ""}${o.name}${p > 1 && a ? " over " + l.pc : ""}`;
  return {
    ...o,
    name: F,
    symbol: b,
    type: o.name,
    root: l.name,
    intervals: g,
    rootDegree: p,
    tonic: u.name,
    notes: d
  };
}
var chord = deprecate("Chord.chord", "Chord.get", get$8);
function transpose$2(e, t) {
  const [a, o] = tokenize$3(e);
  return a ? transpose$3(a, t) + o : e;
}
function chordScales(e) {
  const t = get$8(e), a = isSupersetOf(t.chroma);
  return all$1().filter((o) => a(o.chroma)).map((o) => o.name);
}
function extended$1(e) {
  const t = get$8(e), a = isSupersetOf(t.chroma);
  return all$2().filter((o) => a(o.chroma)).map((o) => t.tonic + o.aliases[0]);
}
function reduced$1(e) {
  const t = get$8(e), a = isSubsetOf(t.chroma);
  return all$2().filter((o) => a(o.chroma)).map((o) => t.tonic + o.aliases[0]);
}
function degrees$1(e) {
  const { intervals: t, tonic: a } = get$8(e), o = tonicIntervalsTransposer(t, a);
  return (u) => u ? o(u > 0 ? u - 1 : u) : "";
}
function steps$1(e) {
  const { intervals: t, tonic: a } = get$8(e);
  return tonicIntervalsTransposer(t, a);
}
var chord_default = {
  getChord,
  get: get$8,
  detect: detect$1,
  chordScales,
  extended: extended$1,
  reduced: reduced$1,
  tokenize: tokenize$3,
  transpose: transpose$2,
  degrees: degrees$1,
  steps: steps$1,
  chord
}, DATA = [
  [
    0.125,
    "dl",
    ["large", "duplex longa", "maxima", "octuple", "octuple whole"]
  ],
  [0.25, "l", ["long", "longa"]],
  [0.5, "d", ["double whole", "double", "breve"]],
  [1, "w", ["whole", "semibreve"]],
  [2, "h", ["half", "minim"]],
  [4, "q", ["quarter", "crotchet"]],
  [8, "e", ["eighth", "quaver"]],
  [16, "s", ["sixteenth", "semiquaver"]],
  [32, "t", ["thirty-second", "demisemiquaver"]],
  [64, "sf", ["sixty-fourth", "hemidemisemiquaver"]],
  [128, "h", ["hundred twenty-eighth"]],
  [256, "th", ["two hundred fifty-sixth"]]
], data_default = DATA, VALUES = [];
data_default.forEach(
  ([e, t, a]) => add$1(e, t, a)
);
var NoDuration = {
  empty: !0,
  name: "",
  value: 0,
  fraction: [0, 0],
  shorthand: "",
  dots: "",
  names: []
};
function names$6() {
  return VALUES.reduce((e, t) => (t.names.forEach((a) => e.push(a)), e), []);
}
function shorthands() {
  return VALUES.map((e) => e.shorthand);
}
var REGEX$2 = /^([^.]+)(\.*)$/;
function get$7(e) {
  const [t, a, o] = REGEX$2.exec(e) || [], u = VALUES.find(
    (p) => p.shorthand === a || p.names.includes(a)
  );
  if (!u)
    return NoDuration;
  const l = calcDots(u.fraction, o.length), f = l[0] / l[1];
  return { ...u, name: e, dots: o, value: f, fraction: l };
}
var value = (e) => get$7(e).value, fraction = (e) => get$7(e).fraction, duration_value_default = { names: names$6, shorthands, get: get$7, value, fraction };
function add$1(e, t, a) {
  VALUES.push({
    empty: !1,
    dots: "",
    name: "",
    value: 1 / e,
    fraction: e < 1 ? [1 / e, 1] : [1, e],
    shorthand: t,
    names: a
  });
}
function calcDots(e, t) {
  const a = Math.pow(2, t);
  let o = e[0] * a, u = e[1] * a;
  const l = o;
  for (let f = 0; f < t; f++)
    o += l / Math.pow(2, f + 1);
  for (; o % 2 === 0 && u % 2 === 0; )
    o /= 2, u /= 2;
  return [o, u];
}
function names$5() {
  return "1P 2M 3M 4P 5P 6m 7m".split(" ");
}
var get$6 = interval, name$1 = (e) => interval(e).name, semitones = (e) => interval(e).semitones, quality = (e) => interval(e).q, num = (e) => interval(e).num;
function simplify$2(e) {
  const t = interval(e);
  return t.empty ? "" : t.simple + t.q;
}
function invert(e) {
  const t = interval(e);
  if (t.empty)
    return "";
  const a = (7 - t.step) % 7, o = t.type === "perfectable" ? -t.alt : -(t.alt + 1);
  return interval({ step: a, alt: o, oct: t.oct, dir: t.dir }).name;
}
var IN = [1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7], IQ = "P m M m M P d P m M m M".split(" ");
function fromSemitones(e) {
  const t = e < 0 ? -1 : 1, a = Math.abs(e), o = a % 12, u = Math.floor(a / 12);
  return t * (IN[o] + 7 * u) + IQ[o];
}
var distance$2 = distance$5, add = combinator((e, t) => [e[0] + t[0], e[1] + t[1]]), addTo = (e) => (t) => add(e, t), substract = combinator((e, t) => [e[0] - t[0], e[1] - t[1]]);
function transposeFifths$2(e, t) {
  const a = get$6(e);
  if (a.empty)
    return "";
  const [o, u, l] = a.coord;
  return coordToInterval([o + t, u, l]).name;
}
var interval_default = {
  names: names$5,
  get: get$6,
  name: name$1,
  num,
  semitones,
  quality,
  fromSemitones,
  distance: distance$2,
  invert,
  simplify: simplify$2,
  add,
  addTo,
  substract,
  transposeFifths: transposeFifths$2
};
function combinator(e) {
  return (t, a) => {
    const o = interval(t).coord, u = interval(a).coord;
    if (o && u) {
      const l = e(o, u);
      return coordToInterval(l).name;
    }
  };
}
function isMidi(e) {
  return +e >= 0 && +e <= 127;
}
function toMidi(e) {
  if (isMidi(e))
    return +e;
  const t = note$1(e);
  return t.empty ? null : t.midi;
}
function midiToFreq(e, t = 440) {
  return Math.pow(2, (e - 69) / 12) * t;
}
var L2 = Math.log(2), L440 = Math.log(440);
function freqToMidi(e) {
  const t = 12 * (Math.log(e) - L440) / L2 + 69;
  return Math.round(t * 100) / 100;
}
var SHARPS = "C C# D D# E F F# G G# A A# B".split(" "), FLATS = "C Db D Eb E F Gb G Ab A Bb B".split(" ");
function midiToNoteName(e, t = {}) {
  if (isNaN(e) || e === -1 / 0 || e === 1 / 0) return "";
  e = Math.round(e);
  const o = (t.sharps === !0 ? SHARPS : FLATS)[e % 12];
  if (t.pitchClass)
    return o;
  const u = Math.floor(e / 12) - 1;
  return o + u;
}
function chroma$1(e) {
  return e % 12;
}
function pcsetFromChroma(e) {
  return e.split("").reduce((t, a, o) => (o < 12 && a === "1" && t.push(o), t), []);
}
function pcsetFromMidi(e) {
  return e.map(chroma$1).sort((t, a) => t - a).filter((t, a, o) => a === 0 || t !== o[a - 1]);
}
function pcset(e) {
  return Array.isArray(e) ? pcsetFromMidi(e) : pcsetFromChroma(e);
}
function pcsetNearest(e) {
  const t = pcset(e);
  return (a) => {
    const o = chroma$1(a);
    for (let u = 0; u < 12; u++) {
      if (t.includes(o + u)) return a + u;
      if (t.includes(o - u)) return a - u;
    }
  };
}
function pcsetSteps(e, t) {
  const a = pcset(e), o = a.length;
  return (u) => {
    const l = u < 0 ? (o - -u % o) % o : u % o, f = Math.floor(u / o);
    return a[l] + f * 12 + t;
  };
}
function pcsetDegrees(e, t) {
  const a = pcsetSteps(e, t);
  return (o) => {
    if (o !== 0)
      return a(o > 0 ? o - 1 : o);
  };
}
var midi_default = {
  chroma: chroma$1,
  freqToMidi,
  isMidi,
  midiToFreq,
  midiToNoteName,
  pcsetNearest,
  pcset,
  pcsetDegrees,
  pcsetSteps,
  toMidi
}, NAMES$2 = ["C", "D", "E", "F", "G", "A", "B"], toName = (e) => e.name, onlyNotes = (e) => e.map(note$1).filter((t) => !t.empty);
function names$4(e) {
  return e === void 0 ? NAMES$2.slice() : Array.isArray(e) ? onlyNotes(e).map(toName) : [];
}
var get$5 = note$1, name = (e) => get$5(e).name, pitchClass = (e) => get$5(e).pc, accidentals = (e) => get$5(e).acc, octave = (e) => get$5(e).oct, midi = (e) => get$5(e).midi, freq = (e) => get$5(e).freq, chroma = (e) => get$5(e).chroma;
function fromMidi(e) {
  return midiToNoteName(e);
}
function fromFreq(e) {
  return midiToNoteName(freqToMidi(e));
}
function fromFreqSharps(e) {
  return midiToNoteName(freqToMidi(e), { sharps: !0 });
}
function fromMidiSharps(e) {
  return midiToNoteName(e, { sharps: !0 });
}
var distance$1 = distance$5, transpose$1 = transpose$5, tr = transpose$5, transposeBy = (e) => (t) => transpose$1(t, e), trBy = transposeBy, transposeFrom = (e) => (t) => transpose$1(e, t), trFrom = transposeFrom;
function transposeFifths$1(e, t) {
  return transpose$1(e, [t, 0]);
}
var trFifths = transposeFifths$1;
function transposeOctaves(e, t) {
  return transpose$1(e, [0, t]);
}
var ascending = (e, t) => e.height - t.height, descending = (e, t) => t.height - e.height;
function sortedNames(e, t) {
  return t = t || ascending, onlyNotes(e).sort(t).map(toName);
}
function sortedUniqNames(e) {
  return sortedNames(e, ascending).filter(
    (t, a, o) => a === 0 || t !== o[a - 1]
  );
}
var simplify$1 = (e) => {
  const t = get$5(e);
  return t.empty ? "" : midiToNoteName(t.midi || t.chroma, {
    sharps: t.alt > 0,
    pitchClass: t.midi === null
  });
};
function enharmonic(e, t) {
  const a = get$5(e);
  if (a.empty)
    return "";
  const o = get$5(
    t || midiToNoteName(a.midi || a.chroma, {
      sharps: a.alt < 0,
      pitchClass: !0
    })
  );
  if (o.empty || o.chroma !== a.chroma)
    return "";
  if (a.oct === void 0)
    return o.pc;
  const u = a.chroma - a.alt, l = o.chroma - o.alt, f = u > 11 || l < 0 ? -1 : u < 0 || l > 11 ? 1 : 0, p = a.oct + f;
  return o.pc + p;
}
var note_default = {
  names: names$4,
  get: get$5,
  name,
  pitchClass,
  accidentals,
  octave,
  midi,
  ascending,
  descending,
  distance: distance$1,
  sortedNames,
  sortedUniqNames,
  fromMidi,
  fromMidiSharps,
  freq,
  fromFreq,
  fromFreqSharps,
  chroma,
  transpose: transpose$1,
  tr,
  transposeBy,
  trBy,
  transposeFrom,
  trFrom,
  transposeFifths: transposeFifths$1,
  transposeOctaves,
  trFifths,
  simplify: simplify$1,
  enharmonic
}, NoRomanNumeral = { empty: !0, name: "", chordType: "" }, cache = {};
function get$4(e) {
  return typeof e == "string" ? cache[e] || (cache[e] = parse$1(e)) : typeof e == "number" ? get$4(NAMES$1[e] || "") : isPitch$1(e) ? fromPitch(e) : isNamedPitch$1(e) ? get$4(e.name) : NoRomanNumeral;
}
var romanNumeral = get$4;
function names$3(e = !0) {
  return (e ? NAMES$1 : NAMES_MINOR).slice();
}
function fromPitch(e) {
  return get$4(altToAcc$1(e.alt) + NAMES$1[e.step]);
}
var REGEX$1 = /^(#{1,}|b{1,}|x{1,}|)(IV|I{1,3}|VI{0,2}|iv|i{1,3}|vi{0,2})([^IViv]*)$/;
function tokenize$2(e) {
  return REGEX$1.exec(e) || ["", "", "", ""];
}
var ROMANS = "I II III IV V VI VII", NAMES$1 = ROMANS.split(" "), NAMES_MINOR = ROMANS.toLowerCase().split(" ");
function parse$1(e) {
  const [t, a, o, u] = tokenize$2(e);
  if (!o)
    return NoRomanNumeral;
  const l = o.toUpperCase(), f = NAMES$1.indexOf(l), p = accToAlt$1(a), g = 1;
  return {
    empty: !1,
    name: t,
    roman: o,
    interval: interval$1({ step: f, alt: p, dir: g }).name,
    acc: a,
    chordType: u,
    alt: p,
    step: f,
    major: o === l,
    oct: 0,
    dir: g
  };
}
var roman_numeral_default = {
  names: names$3,
  get: get$4,
  // deprecated
  romanNumeral
}, Empty = Object.freeze([]), NoKey = {
  type: "major",
  tonic: "",
  alteration: 0,
  keySignature: ""
}, NoKeyScale = {
  tonic: "",
  grades: Empty,
  intervals: Empty,
  scale: Empty,
  triads: Empty,
  chords: Empty,
  chordsHarmonicFunction: Empty,
  chordScales: Empty,
  secondaryDominants: Empty,
  secondaryDominantSupertonics: Empty,
  substituteDominantsMinorRelative: Empty,
  substituteDominants: Empty,
  substituteDominantSupertonics: Empty,
  secondaryDominantsMinorRelative: Empty
}, NoMajorKey = {
  ...NoKey,
  ...NoKeyScale,
  type: "major",
  minorRelative: "",
  scale: Empty,
  substituteDominants: Empty,
  secondaryDominantSupertonics: Empty,
  substituteDominantsMinorRelative: Empty
}, NoMinorKey = {
  ...NoKey,
  type: "minor",
  relativeMajor: "",
  natural: NoKeyScale,
  harmonic: NoKeyScale,
  melodic: NoKeyScale
}, mapScaleToType = (e, t, a = "") => t.map((o, u) => `${e[u]}${a}${o}`);
function keyScale(e, t, a, o, u) {
  return (l) => {
    const f = e.map((S) => get$4(S).interval || ""), p = f.map((S) => transpose$1(l, S)), g = mapScaleToType(p, a), d = p.map((S) => transpose$1(S, "5P")).map(
      (S) => (
        // A secondary dominant is a V chord which:
        // 1. is not diatonic to the key,
        // 2. it must have a diatonic root.
        p.includes(S) && !g.includes(S + "7") ? S + "7" : ""
      )
    ), b = supertonics(
      d,
      t
    ), F = d.map((S) => {
      if (!S) return "";
      const R = S.slice(0, -1);
      return transpose$1(R, "5d") + "7";
    }), E = supertonics(
      F,
      t
    );
    return {
      tonic: l,
      grades: e,
      intervals: f,
      scale: p,
      triads: mapScaleToType(p, t),
      chords: g,
      chordsHarmonicFunction: o.slice(),
      chordScales: mapScaleToType(p, u, " "),
      secondaryDominants: d,
      secondaryDominantSupertonics: b,
      substituteDominants: F,
      substituteDominantSupertonics: E,
      // @deprecated use secondaryDominantsSupertonic
      secondaryDominantsMinorRelative: b,
      // @deprecated use secondaryDominantsSupertonic
      substituteDominantsMinorRelative: E
    };
  };
}
var supertonics = (e, t) => e.map((a, o) => {
  if (!a) return "";
  const u = a.slice(0, -1), l = transpose$1(u, "5P");
  return t[o].endsWith("m") ? l + "m7" : l + "m7b5";
}), distInFifths = (e, t) => {
  const a = note$1(e), o = note$1(t);
  return a.empty || o.empty ? 0 : o.coord[0] - a.coord[0];
}, MajorScale = keyScale(
  "I II III IV V VI VII".split(" "),
  " m m   m dim".split(" "),
  "maj7 m7 m7 maj7 7 m7 m7b5".split(" "),
  "T SD T SD D T D".split(" "),
  "major,dorian,phrygian,lydian,mixolydian,minor,locrian".split(",")
), NaturalScale = keyScale(
  "I II bIII IV V bVI bVII".split(" "),
  "m dim  m m  ".split(" "),
  "m7 m7b5 maj7 m7 m7 maj7 7".split(" "),
  "T SD T SD D SD SD".split(" "),
  "minor,locrian,major,dorian,phrygian,lydian,mixolydian".split(",")
), HarmonicScale = keyScale(
  "I II bIII IV V bVI VII".split(" "),
  "m dim aug m   dim".split(" "),
  "mMaj7 m7b5 +maj7 m7 7 maj7 o7".split(" "),
  "T SD T SD D SD D".split(" "),
  "harmonic minor,locrian 6,major augmented,lydian diminished,phrygian dominant,lydian #9,ultralocrian".split(
    ","
  )
), MelodicScale = keyScale(
  "I II bIII IV V VI VII".split(" "),
  "m m aug   dim dim".split(" "),
  "m6 m7 +maj7 7 7 m7b5 m7b5".split(" "),
  "T SD T SD D  ".split(" "),
  "melodic minor,dorian b2,lydian augmented,lydian dominant,mixolydian b6,locrian #2,altered".split(
    ","
  )
);
function majorKey(e) {
  const t = note$1(e).pc;
  if (!t) return NoMajorKey;
  const a = MajorScale(t), o = distInFifths("C", t);
  return {
    ...a,
    type: "major",
    minorRelative: transpose$1(t, "-3m"),
    alteration: o,
    keySignature: altToAcc$1(o)
  };
}
function minorKey(e) {
  const t = note$1(e).pc;
  if (!t) return NoMinorKey;
  const a = distInFifths("C", t) - 3;
  return {
    type: "minor",
    tonic: t,
    relativeMajor: transpose$1(t, "3m"),
    alteration: a,
    keySignature: altToAcc$1(a),
    natural: NaturalScale(t),
    harmonic: HarmonicScale(t),
    melodic: MelodicScale(t)
  };
}
function majorTonicFromKeySignature(e) {
  return typeof e == "number" ? transposeFifths$1("C", e) : typeof e == "string" && /^b+|#+$/.test(e) ? transposeFifths$1("C", accToAlt$1(e)) : null;
}
var key_default = { majorKey, majorTonicFromKeySignature, minorKey }, get$3 = interval$1;
function simplify(e) {
  const t = interval$1(e);
  return t.empty ? "" : t.simple + t.q;
}
function transposeFifths(e, t) {
  const a = get$3(e);
  if (a.empty) return "";
  const [o, u, l] = a.coord;
  return coordToInterval$1([o + t, u, l]).name;
}
var MODES = [
  [0, 2773, 0, "ionian", "", "Maj7", "major"],
  [1, 2902, 2, "dorian", "m", "m7"],
  [2, 3418, 4, "phrygian", "m", "m7"],
  [3, 2741, -1, "lydian", "", "Maj7"],
  [4, 2774, 1, "mixolydian", "", "7"],
  [5, 2906, 3, "aeolian", "m", "m7", "minor"],
  [6, 3434, 5, "locrian", "dim", "m7b5"]
], NoMode = {
  ...EmptyPcset,
  name: "",
  alt: 0,
  modeNum: NaN,
  triad: "",
  seventh: "",
  aliases: []
}, modes = MODES.map(toMode), index$1 = {};
modes.forEach((e) => {
  index$1[e.name] = e, e.aliases.forEach((t) => {
    index$1[t] = e;
  });
});
function get$2(e) {
  return typeof e == "string" ? index$1[e.toLowerCase()] || NoMode : e && e.name ? get$2(e.name) : NoMode;
}
var mode = get$2;
function all() {
  return modes.slice();
}
var entries = all;
function names$2() {
  return modes.map((e) => e.name);
}
function toMode(e) {
  const [t, a, o, u, l, f, p] = e, g = p ? [p] : [], d = Number(a).toString(2);
  return {
    empty: !1,
    intervals: get$9(u).intervals,
    modeNum: t,
    chroma: d,
    normalized: d,
    name: u,
    setNum: a,
    alt: o,
    triad: l,
    seventh: f,
    aliases: g
  };
}
function notes(e, t) {
  return get$2(e).intervals.map((a) => transpose$5(t, a));
}
function chords(e) {
  return (t, a) => {
    const o = get$2(t);
    if (o.empty) return [];
    const u = rotate(o.modeNum, e), l = o.intervals.map((f) => transpose$5(a, f));
    return u.map((f, p) => l[p] + f);
  };
}
var triads$1 = chords(MODES.map((e) => e[4])), seventhChords = chords(MODES.map((e) => e[5]));
function distance(e, t) {
  const a = get$2(t), o = get$2(e);
  return a.empty || o.empty ? "" : simplify(transposeFifths("1P", o.alt - a.alt));
}
function relativeTonic(e, t, a) {
  return transpose$5(a, distance(e, t));
}
var mode_default = {
  get: get$2,
  names: names$2,
  all,
  distance,
  relativeTonic,
  notes,
  triads: triads$1,
  seventhChords,
  // deprecated
  entries,
  mode
};
function tokenize$1(e) {
  const [t, a, o, u] = tokenizeNote$1(e);
  return t === "" ? tokenizeBass("", e) : t === "A" && u === "ug" ? tokenizeBass("", "aug") : tokenizeBass(t + a, o + u);
}
function tokenizeBass(e, t) {
  const a = t.split("/");
  if (a.length === 1)
    return [e, a[0], ""];
  const [o, u, l, f] = tokenizeNote$1(a[1]);
  return o !== "" && l === "" && f === "" ? [e, a[0], o + u] : [e, t, ""];
}
function fromRomanNumerals(e, t) {
  return t.map(get$4).map(
    (o) => transpose$5(e, interval$1(o)) + o.chordType
  );
}
function toRomanNumerals(e, t) {
  return t.map((a) => {
    const [o, u] = tokenize$1(a), l = distance$5(e, o);
    return get$4(interval$1(l)).name + u;
  });
}
var progression_default = { fromRomanNumerals, toRomanNumerals };
function numeric(e) {
  const t = compact(
    e.map((a) => typeof a == "number" ? a : toMidi(a))
  );
  return !e.length || t.length !== e.length ? [] : t.reduce(
    (a, o) => {
      const u = a[a.length - 1];
      return a.concat(range(u, o).slice(1));
    },
    [t[0]]
  );
}
function chromatic(e, t) {
  return numeric(e).map((a) => midiToNoteName(a, t));
}
var range_default = { numeric, chromatic }, NoScale = {
  empty: !0,
  name: "",
  type: "",
  tonic: null,
  setNum: NaN,
  chroma: "",
  normalized: "",
  aliases: [],
  notes: [],
  intervals: []
};
function tokenize(e) {
  if (typeof e != "string")
    return ["", ""];
  const t = e.indexOf(" "), a = note$1(e.substring(0, t));
  if (a.empty) {
    const u = note$1(e);
    return u.empty ? ["", e] : [u.name, ""];
  }
  const o = e.substring(a.name.length + 1).toLowerCase();
  return [a.name, o.length ? o : ""];
}
var names$1 = names$7;
function get$1(e) {
  const t = Array.isArray(e) ? e : tokenize(e), a = note$1(t[0]).name, o = get$9(t[1]);
  if (o.empty)
    return NoScale;
  const u = o.name, l = a ? o.intervals.map((p) => transpose$5(a, p)) : [], f = a ? a + " " + u : u;
  return { ...o, name: f, type: u, tonic: a, notes: l };
}
var scale$1 = get$1;
function detect(e, t = {}) {
  const a = chroma$3(e), o = note$1(t.tonic ?? e[0] ?? ""), u = o.chroma;
  if (u === void 0)
    return [];
  const l = a.split("");
  l[u] = "1";
  const f = rotate(u, l).join(""), p = all$1().find((d) => d.chroma === f), g = [];
  return p && g.push(o.name + " " + p.name), t.match === "exact" || extended(f).forEach((d) => {
    g.push(o.name + " " + d);
  }), g;
}
function scaleChords(e) {
  const t = get$1(e), a = isSubsetOf(t.chroma);
  return all$3().filter((o) => a(o.chroma)).map((o) => o.aliases[0]);
}
function extended(e) {
  const t = isChroma(e) ? e : get$1(e).chroma, a = isSupersetOf(t);
  return all$1().filter((o) => a(o.chroma)).map((o) => o.name);
}
function reduced(e) {
  const t = isSubsetOf(get$1(e).chroma);
  return all$1().filter((a) => t(a.chroma)).map((a) => a.name);
}
function scaleNotes(e) {
  const t = e.map((u) => note$1(u).pc).filter((u) => u), a = t[0], o = sortedUniqNames(t);
  return rotate(o.indexOf(a), o);
}
function modeNames(e) {
  const t = get$1(e);
  if (t.empty)
    return [];
  const a = t.tonic ? t.notes : t.intervals;
  return modes$1(t.chroma).map((o, u) => {
    const l = get$1(o).name;
    return l ? [a[u], l] : ["", ""];
  }).filter((o) => o[0]);
}
function getNoteNameOf(e) {
  const t = Array.isArray(e) ? scaleNotes(e) : get$1(e).notes, a = t.map((o) => note$1(o).chroma);
  return (o) => {
    const u = note$1(typeof o == "number" ? fromMidi(o) : o), l = u.height;
    if (l === void 0) return;
    const f = l % 12, p = a.indexOf(f);
    if (p !== -1)
      return enharmonic(u.name, t[p]);
  };
}
function rangeOf(e) {
  const t = getNoteNameOf(e);
  return (a, o) => {
    const u = note$1(a).height, l = note$1(o).height;
    return u === void 0 || l === void 0 ? [] : range(u, l).map(t).filter((f) => f);
  };
}
function degrees(e) {
  const { intervals: t, tonic: a } = get$1(e), o = tonicIntervalsTransposer$1(t, a);
  return (u) => u ? o(u > 0 ? u - 1 : u) : "";
}
function steps(e) {
  const { intervals: t, tonic: a } = get$1(e);
  return tonicIntervalsTransposer$1(t, a);
}
var scale_default = {
  degrees,
  detect,
  extended,
  get: get$1,
  modeNames,
  names: names$1,
  rangeOf,
  reduced,
  scaleChords,
  scaleNotes,
  steps,
  tokenize,
  // deprecated
  scale: scale$1
}, NONE = {
  empty: !0,
  name: "",
  upper: void 0,
  lower: void 0,
  type: void 0,
  additive: []
}, NAMES = ["4/4", "3/4", "2/4", "2/2", "12/8", "9/8", "6/8", "3/8"];
function names() {
  return NAMES.slice();
}
var REGEX = /^(\d*\d(?:\+\d)*)\/(\d+)$/, CACHE = /* @__PURE__ */ new Map();
function get(e) {
  const t = JSON.stringify(e), a = CACHE.get(t);
  if (a)
    return a;
  const o = build(parse(e));
  return CACHE.set(t, o), o;
}
function parse(e) {
  if (typeof e == "string") {
    const [l, f, p] = REGEX.exec(e) || [];
    return parse([f, p]);
  }
  const [t, a] = e, o = +a;
  if (typeof t == "number")
    return [t, o];
  const u = t.split("+").map((l) => +l);
  return u.length === 1 ? [u[0], o] : [u, o];
}
var time_signature_default = { names, parse, get }, isPowerOfTwo = (e) => Math.log(e) / Math.log(2) % 1 === 0;
function build([e, t]) {
  const a = Array.isArray(e) ? e.reduce((p, g) => p + g, 0) : e, o = t;
  if (a === 0 || o === 0)
    return NONE;
  const u = Array.isArray(e) ? `${e.join("+")}/${t}` : `${e}/${t}`, l = Array.isArray(e) ? e : [], f = o === 4 || o === 2 ? "simple" : o === 8 && a % 3 === 0 ? "compound" : isPowerOfTwo(o) ? "irregular" : "irrational";
  return {
    empty: !1,
    name: u,
    type: f,
    upper: a,
    lower: o,
    additive: l
  };
}
var Tonal = Core, PcSet = pcset_default, ChordDictionary = chord_type_default, ScaleDictionary = scale_type_default;
const dist$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AbcNotation: abc_notation_default,
  Array: index$5,
  Chord: chord_default,
  ChordDictionary,
  ChordType: chord_type_default,
  Collection: collection_default,
  Core,
  DurationValue: duration_value_default,
  Interval: interval_default,
  Key: key_default,
  Midi: midi_default,
  Mode: mode_default,
  Note: note_default,
  PcSet,
  Pcset: pcset_default,
  Progression: progression_default,
  Range: range_default,
  RomanNumeral: roman_numeral_default,
  Scale: scale_default,
  ScaleDictionary,
  ScaleType: scale_type_default,
  TimeSignature: time_signature_default,
  Tonal,
  accToAlt,
  altToAcc,
  chroma: chroma$2,
  coordToInterval,
  coordToNote,
  coordinates,
  deprecate,
  distance: distance$3,
  fillStr,
  height,
  interval,
  isNamed,
  isNamedPitch,
  isPitch,
  midi: midi$1,
  note,
  pitch,
  stepToLetter,
  tokenizeInterval,
  tokenizeNote,
  tonicIntervalsTransposer,
  transpose: transpose$3
}, Symbol.toStringTag, { value: "Module" })), flats = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"], pcs = ["c", "db", "d", "eb", "e", "f", "gb", "g", "ab", "a", "bb", "b"], sharps = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], accs = { b: -1, "#": 1 }, pc2chroma = (e) => {
  const [t, ...a] = e.split("");
  return pcs.indexOf(t.toLowerCase()) + a.reduce((o, u) => o + accs[u], 0);
};
function tokenizeChord$1(e) {
  const t = (e || "").match(/^([A-G][b#]*)([^/]*)[/]?([A-G][b#]*)?$/);
  return t ? t.slice(1) : [];
}
const midi2chroma = (e) => e % 12, step2semitones = (e) => {
  let t = Number(e);
  return isNaN(t) ? interval_default.semitones(e) : t;
}, x2midi = (e, t) => {
  if (typeof e == "number")
    return e;
  if (typeof e == "string")
    return noteToMidi$1(e, t);
}, midi2note = (e, t = !1) => {
  const a = Math.floor(e / 12) - 1;
  return (t ? sharps : flats)[e % 12] + a;
};
function scaleStep$1(e, t, a = 1) {
  e = e.map((u) => typeof u == "string" ? noteToMidi$1(u) : u);
  const o = Math.floor(t / e.length) * a * 12;
  return t = _mod$2(t, e.length), e[t] + o;
}
function nearestNumberIndex(e, t, a) {
  let o = 0, u = 1 / 0;
  return t.forEach((l, f) => {
    const p = Math.abs(l - e);
    (!a && p < u || a && p <= u) && (o = f, u = p);
  }), o;
}
let scaleSteps = {};
function stepInNamedScale(e, t, a, o) {
  const [u, l] = scale_default.tokenize(t), f = x2midi(u), p = midi2chroma(f);
  if (!scaleSteps[l]) {
    const { intervals: E } = scale_default.get(`C ${l}`);
    scaleSteps[l] = E.map(step2semitones);
  }
  const g = scaleSteps[l];
  if (!g)
    return null;
  let d = f;
  if (a) {
    a = x2midi(a, 3);
    const E = midi2chroma(a), S = _mod$2(E - p, 12), R = nearestNumberIndex(S, g, o);
    e = e + R, d = a - S;
  }
  const b = Math.floor(e / g.length) * 12;
  return e = _mod$2(e, g.length), g[e] + d + b;
}
let modeTarget = {
  below: (e) => e.slice(-1)[0],
  duck: (e) => e.slice(-1)[0],
  above: (e) => e[0],
  root: (e) => e[0]
};
function renderVoicing({ chord: e, dictionary: t, offset: a = 0, n: o, mode: u = "below", anchor: l = "c5", octaves: f = 1 }) {
  const [p, g] = tokenizeChord$1(e), d = pc2chroma(p);
  l = x2midi(l?.note || l, 4);
  const b = midi2chroma(l), F = t[g].map(
    (j) => (typeof j == "string" ? j.split(" ") : j).map(step2semitones)
  );
  let E, S, R = F.map((j, ee) => {
    const te = modeTarget[u](j), de = _mod$2(b - te - d, 12);
    return (E === void 0 || de < E) && (E = de, S = ee), de;
  });
  u === "root" && (S = 0);
  const k = Math.ceil(a / F.length) * 12, I = _mod$2(S + a, F.length), V = F[I], U = modeTarget[u](V), q = l - R[I] + k, H = V.map((j) => q - U + j);
  let z = H.map((j) => midi2note(j));
  return u === "duck" && (z = z.filter((j, ee) => H[ee] !== l)), o !== void 0 ? [scaleStep$1(z, o, f)] : z;
}
const octavesInterval = (e) => (e <= 0 ? -1 : 1) + e * 7 + "P";
function getScale(e) {
  e = e.replaceAll(":", " ");
  const t = scale_default.get(e), { tonic: a, empty: o } = t;
  if (o && isNote(e) || o && !a)
    throw new Error(
      `Scale name ${e} is incomplete. Make sure to use ":" instead of spaces, example: .scale("C:major")`
    );
  if (o)
    throw new Error(`Invalid scale name "${e}"`);
  return t;
}
function scaleStep(e, t) {
  e = Math.ceil(e);
  let { intervals: a, tonic: o } = getScale(t);
  o = o || "C";
  const { pc: u, oct: l = 3 } = note_default.get(o), f = Math.floor(e / a.length), p = _mod$2(e, a.length), g = interval_default.add(a[p], octavesInterval(f));
  return note_default.transpose(u + l, g);
}
function scaleOffset(e, t, a) {
  let { notes: o } = getScale(e);
  if (o = o.map((F) => note_default.get(F).pc), t = Number(t), isNaN(t))
    throw new Error(`scale offset "${t}" not a number`);
  const { pc: u, oct: l = 3 } = note_default.get(a), f = o.indexOf(u);
  if (f === -1)
    throw new Error(`note "${a}" is not in scale "${e}"`);
  let p = f, g = l, d = u;
  const b = Math.sign(t);
  for (; Math.abs(p - f) < Math.abs(t); ) {
    p += b;
    const F = _mod$2(p, o.length);
    b < 0 && d[0] === "C" && (g += b), d = o[F], b > 0 && d[0] === "C" && (g += b);
  }
  return d + g;
}
const { transpose, trans } = register(["transpose", "trans"], function e(t, a) {
  return a.withHap((o) => {
    const u = o.value.note ?? o.value;
    if (typeof u == "number") {
      let p;
      typeof t == "number" ? p = t : typeof t == "string" && (p = interval_default.semitones(t) || 0);
      const g = u + p;
      return typeof o.value == "object" ? o.withValue(() => ({ ...o.value, note: g })) : o.withValue(() => g);
    }
    if (typeof u != "string" || !isNote(u))
      return logger$2(`[tonal] transpose: not a note "${u}"`, "warning"), o;
    const l = isNaN(Number(t)) ? String(t) : interval_default.fromSemitones(t), f = note_default.transpose(u, l);
    return typeof o.value == "object" ? o.withValue(() => ({ ...o.value, note: f })) : o.withValue(() => f);
  });
}), { scaleTranspose, scaleTrans, strans } = register(
  ["scaleTranspose", "scaleTrans", "strans"],
  function(e, t) {
    return t.withHap((a) => {
      if (!a.context.scale)
        throw new Error("can only use scaleTranspose after .scale");
      if (typeof a.value == "object")
        return a.withValue(() => ({
          ...a.value,
          note: scaleOffset(a.context.scale, Number(e), a.value.note)
        }));
      if (typeof a.value != "string")
        throw new Error("can only use scaleTranspose with notes");
      return a.withValue(() => scaleOffset(a.context.scale, Number(e), a.value));
    });
  }
);
function _convertStepToNumberAndOffset(e) {
  let t = Number(e), a = 0;
  if (isNaN(t)) {
    e = String(e);
    const o = /^(-?\d+)([#bsf]*)$/.exec(e);
    if (!o)
      throw new Error(`invalid scale step "${e}", expected number or integer with optional # b suffixes`);
    t = Number(o[1]);
    const u = o[2] || "";
    a = getAccidentalsOffset$1(u);
  }
  return [t, a];
}
let scaleToMidisAndNotes = {};
function _getNearestScaleNote(e, t, a = !0) {
  let o = typeof t == "string" ? noteToMidi$1(t) : t;
  if (scaleToMidisAndNotes[e] === void 0) {
    const { intervals: F, tonic: E } = getScale(e), { pc: S } = note_default.get(E), k = F.concat("8P").map((V) => note_default.transpose(S + "0", V)), I = k.map(noteToMidi$1);
    scaleToMidisAndNotes[e] = [I, k];
  }
  const [u, l] = scaleToMidisAndNotes[e], f = u[0], p = Math.floor((o - f) / 12), g = u.map((F) => F + 12 * p), d = nearestNumberIndex(o, g, a), b = l[d];
  return note_default.transpose(b, interval_default.fromSemitones(12 * p));
}
const scale = register(
  "scale",
  function(e, t) {
    return Array.isArray(e) && (e = e.flat().join(" ")), t.withHaps((a) => (a = a.map((o) => {
      let u = o.value;
      const l = typeof u == "object";
      u = l ? u : { n: u };
      const { note: f, n: p, value: g, ...d } = u, b = f ?? p ?? g;
      if (b === void 0)
        return logger$2(
          `[tonal] Invalid value format for 'scale'. Value must contain n, note, or value but received keys [${Object.keys(u).join(", ")}]`,
          "error"
        ), o;
      let F;
      if (isNote(b))
        F = _getNearestScaleNote(e, b), o.value = { ...d, note: F };
      else
        try {
          const [E, S] = _convertStepToNumberAndOffset(b);
          d.anchor ? F = stepInNamedScale(E, e, d.anchor) : F = scaleStep(E, e), S != 0 && (F = note_default.transpose(F, interval_default.fromSemitones(S)));
        } catch (E) {
          logger$2(`[tonal] ${E.message}`, "error");
          return;
        }
      return o.value = l ? { ...d, note: F } : F, o.setContext({ ...o.context, scale: e });
    }), removeUndefineds(a)));
  },
  !0,
  !0
  // preserve step count
);
var dist = {}, dictionaryVoicing$1 = {}, getBestVoicing = {}, hasRequiredGetBestVoicing;
function requireGetBestVoicing() {
  if (hasRequiredGetBestVoicing) return getBestVoicing;
  hasRequiredGetBestVoicing = 1, getBestVoicing.__esModule = !0, getBestVoicing.getBestVoicing = void 0;
  function e(t) {
    var a = t.chord, o = t.range, u = t.finder, l = t.picker, f = t.lastVoicing, p = u(a, o);
    return p.length ? l(p, f) : [];
  }
  return getBestVoicing.getBestVoicing = e, getBestVoicing;
}
var voicingsInRange = {};
const require$$0 = /* @__PURE__ */ getAugmentedNamespace(dist$1);
var tokenizeChord = {}, hasRequiredTokenizeChord;
function requireTokenizeChord() {
  if (hasRequiredTokenizeChord) return tokenizeChord;
  hasRequiredTokenizeChord = 1, tokenizeChord.__esModule = !0, tokenizeChord.tokenizeChord = void 0;
  function e(t) {
    var a = (t || "").match(/^([A-G][b#]*)([^\/]*)[\/]?([A-G][b#]*)?$/);
    return a ? a.slice(1) : [];
  }
  return tokenizeChord.tokenizeChord = e, tokenizeChord;
}
var hasRequiredVoicingsInRange;
function requireVoicingsInRange() {
  if (hasRequiredVoicingsInRange) return voicingsInRange;
  hasRequiredVoicingsInRange = 1, voicingsInRange.__esModule = !0, voicingsInRange.voicingsInRange = void 0;
  var e = require$$0, t = requireDictionaryVoicing(), a = requireTokenizeChord();
  function o(u, l, f) {
    l === void 0 && (l = t.lefthand), f === void 0 && (f = ["D3", "A4"]);
    var p = (0, a.tokenizeChord)(u), g = p[0], d = p[1];
    if (!l[d])
      return [];
    var b = l[d].map(function(E) {
      return E.split(" ");
    }), F = e.Range.chromatic(f);
    return b.reduce(function(E, S) {
      var R = S.map(function(U) {
        return e.Interval.substract(U, S[0]);
      }), k = e.Note.transpose(g, S[0]), I = F.filter(function(U) {
        return e.Note.chroma(U) === e.Note.chroma(k);
      }).filter(function(U) {
        return e.Note.midi(e.Note.transpose(U, R[R.length - 1])) <= e.Note.midi(f[1]);
      }).map(function(U) {
        return e.Note.enharmonic(U, k);
      }), V = I.map(function(U) {
        return R.map(function(q) {
          return e.Note.transpose(U, q);
        });
      });
      return E.concat(V);
    }, []);
  }
  return voicingsInRange.voicingsInRange = o, voicingsInRange;
}
var hasRequiredDictionaryVoicing;
function requireDictionaryVoicing() {
  return hasRequiredDictionaryVoicing || (hasRequiredDictionaryVoicing = 1, function(e) {
    var t = dictionaryVoicing$1.__assign || function() {
      return t = Object.assign || function(p) {
        for (var g, d = 1, b = arguments.length; d < b; d++) {
          g = arguments[d];
          for (var F in g) Object.prototype.hasOwnProperty.call(g, F) && (p[F] = g[F]);
        }
        return p;
      }, t.apply(this, arguments);
    }, a = dictionaryVoicing$1.__rest || function(p, g) {
      var d = {};
      for (var b in p) Object.prototype.hasOwnProperty.call(p, b) && g.indexOf(b) < 0 && (d[b] = p[b]);
      if (p != null && typeof Object.getOwnPropertySymbols == "function")
        for (var F = 0, b = Object.getOwnPropertySymbols(p); F < b.length; F++)
          g.indexOf(b[F]) < 0 && Object.prototype.propertyIsEnumerable.call(p, b[F]) && (d[b[F]] = p[b[F]]);
      return d;
    };
    e.__esModule = !0, e.dictionaryVoicing = e.dictionaryVoicingFinder = e.triads = e.guidetones = e.lefthand = void 0;
    var o = requireGetBestVoicing(), u = requireVoicingsInRange();
    e.lefthand = {
      m7: ["3m 5P 7m 9M", "7m 9M 10m 12P"],
      7: ["3M 6M 7m 9M", "7m 9M 10M 13M"],
      "^7": ["3M 5P 7M 9M", "7M 9M 10M 12P"],
      69: ["3M 5P 6A 9M"],
      m7b5: ["3m 5d 7m 8P", "7m 8P 10m 12d"],
      "7b9": ["3M 6m 7m 9m", "7m 9m 10M 13m"],
      "7b13": ["3M 6m 7m 9m", "7m 9m 10M 13m"],
      o7: ["1P 3m 5d 6M", "5d 6M 8P 10m"],
      "7#11": ["7m 9M 11A 13A"],
      "7#9": ["3M 7m 9A"],
      mM7: ["3m 5P 7M 9M", "7M 9M 10m 12P"],
      m6: ["3m 5P 6M 9M", "6M 9M 10m 12P"]
    }, e.guidetones = {
      m7: ["3m 7m", "7m 10m"],
      m9: ["3m 7m", "7m 10m"],
      7: ["3M 7m", "7m 10M"],
      "^7": ["3M 7M", "7M 10M"],
      "^9": ["3M 7M", "7M 10M"],
      69: ["3M 6M"],
      6: ["3M 6M", "6M 10M"],
      m7b5: ["3m 7m", "7m 10m"],
      "7b9": ["3M 7m", "7m 10M"],
      "7b13": ["3M 7m", "7m 10M"],
      o7: ["3m 6M", "6M 10m"],
      "7#11": ["3M 7m", "7m 10M"],
      "7#9": ["3M 7m", "7m 10M"],
      mM7: ["3m 7M", "7M 10m"],
      m6: ["3m 6M", "6M 10m"]
    }, e.triads = {
      M: ["1P 3M 5P", "3M 5P 8P", "5P 8P 10M"],
      m: ["1P 3m 5P", "3m 5P 8P", "5P 8P 10m"],
      o: ["1P 3m 5d", "3m 5d 8P", "5d 8P 10m"],
      aug: ["1P 3m 5A", "3m 5A 8P", "5A 8P 10m"]
    };
    var l = function(p) {
      return function(g, d) {
        return (0, u.voicingsInRange)(g, p, d);
      };
    };
    e.dictionaryVoicingFinder = l;
    var f = function(p) {
      var g = p.dictionary, d = p.range, b = a(p, ["dictionary", "range"]);
      return (0, o.getBestVoicing)(t(t({}, b), { range: d, finder: (0, e.dictionaryVoicingFinder)(g) }));
    };
    e.dictionaryVoicing = f;
  }(dictionaryVoicing$1)), dictionaryVoicing$1;
}
var minTopNoteDiff$1 = {}, hasRequiredMinTopNoteDiff;
function requireMinTopNoteDiff() {
  if (hasRequiredMinTopNoteDiff) return minTopNoteDiff$1;
  hasRequiredMinTopNoteDiff = 1, minTopNoteDiff$1.__esModule = !0, minTopNoteDiff$1.minTopNoteDiff = void 0;
  var e = require$$0;
  function t(a, o) {
    if (!o)
      return a[0];
    var u = function(l) {
      return Math.abs(e.Note.midi(o[o.length - 1]) - e.Note.midi(l[l.length - 1]));
    };
    return a.reduce(function(l, f) {
      return u(f) < u(l) ? f : l;
    }, a[0]);
  }
  return minTopNoteDiff$1.minTopNoteDiff = t, minTopNoteDiff$1;
}
var hasRequiredDist;
function requireDist() {
  return hasRequiredDist || (hasRequiredDist = 1, function(e) {
    e.__esModule = !0;
    var t = requireDictionaryVoicing(), a = requireMinTopNoteDiff(), o = requireGetBestVoicing(), u = requireTokenizeChord();
    e.default = {
      tokenizeChord: u.tokenizeChord,
      getBestVoicing: o.getBestVoicing,
      dictionaryVoicing: t.dictionaryVoicing,
      dictionaryVoicingFinder: t.dictionaryVoicingFinder,
      lefthand: t.lefthand,
      guidetones: t.guidetones,
      triads: t.triads,
      minTopNoteDiff: a.minTopNoteDiff
    };
  }(dist)), dist;
}
var distExports = requireDist();
const _voicings = /* @__PURE__ */ getDefaultExportFromCjs(distExports), simple = {
  2: ["1P 5P 8P 9M", "1P 5P 8P 9M 12P", "5P 8P 9M 12P"],
  5: ["1P 5P 8P 12P", "5P 8P 12P 15P"],
  6: ["1P 5P 6M 8P 10M", "1P 5P 8P 10M 13M", "3M 5P 8P 10M 13M", "5P 8P 10M 12P 13M"],
  7: [
    "1P 5P 7m 8P 10M",
    "1P 7m 8P 10M 12P",
    "3M 7m 8P 10M 12P",
    "3M 7m 8P 10M 14m",
    "3M 7m 10M 12P 15P",
    "7m 10M 12P 14m 15P",
    "7m 10M 12P 15P 17M"
  ],
  9: [
    "1P 5P 7m 9M 10M",
    "1P 7m 9M 10M 12P",
    "3M 7m 8P 9M 12P",
    "7m 9M 10M 14m 15P",
    "3M 7m 8P 12P 16M",
    "7m 10M 12P 15P 16M"
  ],
  11: ["1P 5P 7m 9M 11P", "5P 7m 8P 9M 11P", "7m 8P 9M 11P 12P", "7m 8P 11P 12P 16M"],
  13: ["1P 6M 7m 9M 10M", "1P 7m 9M 10M 13M", "3M 7m 8P 9M 13M", "7m 8P 9M 10M 13M", "7m 9M 10M 13M 15P"],
  69: ["1P 5P 6M 9M 10M", "1P 5P 9M 10M 13M", "3M 5P 8P 9M 13M", "5P 8P 9M 10M 13M"],
  add9: ["1P 5P 8P 9M 10M", "1P 5P 9M 10M 12P", "3M 8P 9M 10M 12P", "3M 8P 9M 12P 15P", "5P 8P 9M 12P 17M"],
  "+": [
    "1P 3M 6m 8P 10M",
    "1P 6m 8P 10M 13m",
    "3M 6m 8P 10M 13m",
    "3M 8P 10M 13m 15P",
    "6m 8P 10M 13m 15P",
    "6m 10M 13m 15P 17M"
  ],
  o: ["1P 5d 8P 10m 12d", "3m 8P 10m 12d 15P", "5d 8P 10m 12d 15P"],
  h: [
    "3m 5d 7m 8P 10m",
    "1P 5d 7m 10m 12d",
    "3m 7m 8P 10m 12d",
    "3m 7m 8P 12d 14m",
    "5d 7m 8P 10m 14m",
    "5d 8P 10m 12d 14m",
    "7m 10m 12d 14m 15P",
    "5d 8P 10m 14m 17m"
  ],
  sus: ["1P 4P 5P 8P", "1P 4P 5P 8P 11P", "5P 8P 11P 12P", "5P 8P 11P 12P 15P"],
  "^": ["1P 5P 8P 10M", "1P 5P 8P 10M 12P", "3M 5P 8P 10M 12P", "3M 8P 10M 12P 15P", "5P 8P 10M 12P 15P"],
  "-": ["1P 3m 5P 8P 10m", "1P 5P 8P 10m 12P", "3m 5P 8P 10m 12P", "5P 8P 10m 12P 15P"],
  "^7": ["1P 5P 7M 10M 12P", "1P 10M 12P 14M", "3M 8P 10M 12P 14M", "5P 8P 10M 12P 14M", "5P 8P 10M 14M 17M"],
  "-7": [
    "1P 3m 5P 7m 10m",
    "1P 5P 7m 10m 12P",
    "3m 7m 8P 10m 12P",
    "3m 7m 8P 10m 14m",
    "5P 7m 8P 10m 14m",
    "7m 10m 12P 14m 15P",
    "5P 8P 10m 14m 17m",
    "7m 10m 12P 15P 17m"
  ],
  "7sus": ["1P 5P 7m 8P 11P", "5P 8P 11P 12P 14m", "7m 8P 11P 12P 14m", "7m 11P 12P 14m 18P"],
  h7: [
    "3m 5d 7m 8P 10m",
    "1P 5d 7m 10m 12d",
    "1P 7m 10m 12d",
    "3m 7m 8P 10m 12d",
    "3m 7m 8P 12d 14m",
    "5d 7m 8P 10m 14m",
    "5d 8P 10m 12d 14m",
    "7m 10m 12d 14m 15P",
    "5d 8P 10m 14m 17m"
  ],
  o7: [
    "1P 6M 8P 10m 12d",
    "1P 6M 10m 12d 13M",
    "3m 8P 10m 12d 13M",
    "3m 8P 12d 13M 15P",
    "5d 10m 12d 13M 15P",
    "5d 10m 13M 15P 17m",
    "6M 12d 13M 15P 17m",
    "6M 12d 15P 17m 19d"
  ],
  "^9": [
    "1P 5P 7M 9M 10M",
    "1P 7M 9M 10M 12P",
    "3M 7M 8P 9M 12P",
    "3M 7M 8P 12P 16M",
    "5P 8P 10M 14M 16M",
    "7M 8P 10M 12P 16M"
  ],
  "^13": ["1P 6M 7M 9M 10M", "1P 7M 9M 10M 13M", "3M 7M 8P 9M 13M", "3M 7M 8P 13M 16M", "7M 8P 10M 13M 16M"],
  "^7#11": ["1P 5P 7M 10M 12d", "3M 7M 8P 10M 12d", "1P 7M 10M 12d 14M", "3M 7M 8P 12d 14M", "5P 8P 10M 12d 14M"],
  "^9#11": ["1P 3M 5d 7M 9M", "1P 7M 9M 10M 12d", "3M 7M 8P 9M 12d", "3M 8P 9M 12d 14M"],
  "^7#5": ["1P 6m 7M 10M 13m", "3M 7M 8P 10M 13m", "6m 7M 8P 10M 13m"],
  "-6": [
    "1P 3m 5P 6M 8P",
    "1P 5P 6M 8P 10m",
    "3m 5P 6M 8P 10m",
    "1P 5P 8P 10m 13M",
    "3m 5P 8P 10m 13M",
    "5P 8P 10m 12P 13M",
    "5P 8P 10m 13M 15P"
  ],
  "-69": [
    "1P 3m 5P 6M 9M",
    "3m 5P 6M 8P 9M",
    "3m 6M 9M 10m 12P",
    "1P 5P 9M 10m 13M",
    "3m 5P 8P 9M 13M",
    "5P 8P 9M 10m 13M",
    "5P 8P 10m 13M 16M"
  ],
  "-^7": ["1P 3m 5P 7M 10m", "1P 5P 7M 10m 12P", "3m 7M 8P 10m 12P", "5P 7M 8P 10m 14M", "5P 8P 10m 14M 17m"],
  "-^9": ["1P 3m 5P 7M 9M", "1P 7M 9M 10m 12P", "3m 7M 8P 9M 12P", "5P 8P 9M 10m 14M"],
  "-9": [
    "1P 3m 5P 7m 9M",
    "3m 5P 7m 8P 9M",
    "3m 7m 8P 9M 12P",
    "5P 8P 9M 10m 14m",
    "3m 7m 9M 12P 15P",
    "7m 10m 12P 15P 16M"
  ],
  "-add9": ["1P 2M 3m 5P 8P", "1P 3m 5P 9M", "3m 5P 8P 9M 12P", "5P 8P 9M 10m 12P"],
  "-11": [
    "1P 3m 7m 9M 11P",
    "3m 7m 8P 9M 11P",
    "1P 4P 7m 10m 12P",
    "5P 8P 11P 14m",
    "3m 7m 9M 11P 15P",
    "5P 8P 11P 14m 16M",
    "7m 10m 12P 15P 18P"
  ],
  "-7b5": [
    "3m 5d 7m 8P 10m",
    "1P 7m 10m 12d",
    "1P 5d 7m 10m 12d",
    "3m 7m 8P 10m 12d",
    "3m 7m 8P 12d 14m",
    "5d 7m 8P 10m 14m",
    "5d 8P 10m 12d 14m",
    "7m 10m 12d 14m 15P",
    "5d 8P 10m 14m 17m"
  ],
  h9: ["1P 7m 9M 10m 12d", "3m 7m 8P 9M 12d", "5d 8P 9M 10m 14m", "7m 10m 12d 15P 16M"],
  "-b6": ["1P 5P 6m 8P 10m", "1P 5P 8P 10m 13m", "3m 5P 8P 10m 13m", "5P 8P 10m 13m", "5P 8P 10m 13m 15P"],
  "-#5": ["1P 6m 8P 10m 13m", "3m 6m 8P 10m 13m", "6m 8P 10m 13m 15P"],
  "7b9": ["1P 3M 7m 9m 10M", "3M 7m 8P 9m 10M", "3M 7m 8P 9m 14m", "7m 9m 10M 14m 15P"],
  "7#9": ["1P 3M 7m 10m", "3M 7m 8P 10m 14m", "7m 10m 10M 14m 15P"],
  "7#11": ["1P 3M 7m 10M 12d", "3M 7m 8P 10M 12d", "7m 10M 12d 14m 15P"],
  "7b5": ["1P 3M 7m 10M 12d", "3M 7m 8P 10M 12d", "7m 10M 12d 14m 15P"],
  "7#5": ["1P 3M 7m 10M 13m", "3M 7m 8P 10M 13m", "3M 7m 8P 13m 14m", "7m 10M 13m 14m 15P"],
  "9#11": ["1P 7m 9M 10M 12d", "3M 7m 8P 9M 12d", "7m 10M 12d 15P 16M"],
  "9b5": ["1P 7m 9M 10M 12d", "3M 7m 8P 9M 12d", "7m 10M 12d 15P 16M"],
  "9#5": ["1P 7m 9M 10M 13m", "3M 7m 9M 10M 13m", "3M 7m 9M 13m 14m", "7m 10M 13m 14m 16M", "7m 10M 13m 16M 17M"],
  "7b13": ["1P 3M 7m 10M 13m", "3M 7m 8P 10M 13m", "3M 7m 8P 13m 14m", "7m 10M 13m 14m 15P"],
  "7#9#5": ["1P 3M 7m 10m 13m", "3M 7m 10m 13m 15P", "7m 10M 13m 15P 17m"],
  "7#9b5": ["1P 3M 7m 10m 12d", "3M 7m 10m 12d 15P", "7m 10M 12d 15P 17m"],
  "7#9#11": ["1P 3M 7m 10m 12d", "3M 7m 10m 12d 15P", "7m 10M 12d 15P 17m"],
  "7b9#11": ["1P 7m 9m 10M 12d", "3M 7m 8P 9m 12d", "7m 8P 10M 12d 16m"],
  "7b9b5": ["1P 7m 9m 10M 12d", "3M 7m 8P 9m 12d", "7m 8P 10M 12d 16m"],
  "7b9#5": ["1P 7m 9m 10M 13m", "3M 7m 8P 9m 13m", "7m 9m 10M 13m 15P"],
  "7b9#9": ["1P 3M 7m 9m 10m", "3M 7m 8P 9m 10m", "7m 8P 10M 16m 17m"],
  "7b9b13": ["1P 7m 9m 10M 13m", "3M 7m 8P 9m 13m", "7m 9m 10M 13m 15P"],
  "7alt": [
    "3M 7m 8P 9m 12d",
    "1P 7m 10m 10M 13m",
    "3M 7m 8P 10m 13m",
    "3M 7m 9m 12d 15P",
    "3M 7m 10m 13m 15P",
    "7m 10M 12d 15P 17m",
    "7m 10M 13m 15P 17m"
  ],
  "13#11": ["1P 6M 7m 10M 12d", "3M 7m 9M 12d 13M", "7m 10M 12d 13M 16M"],
  "13b9": ["1P 3M 6M 7m 9m", "1P 6M 7m 9m 10M", "3M 7m 9m 10M 13M", "3M 7m 10M 13M 16m", "7m 10M 13M 16m 17M"],
  "13#9": ["1P 3M 6M 7m 10m", "3M 7m 8P 10m 13M", "7m 10M 13M 14m 17m"],
  "7b9sus": ["1P 5P 7m 9m 11P", "5P 7m 8P 9m 11P", "7m 8P 11P 14m 16m"],
  "7susadd3": ["1P 4P 5P 7m 10M", "5P 8P 10M 11P 14m", "7m 11P 12P 15P 17M"],
  "9sus": ["1P 5P 7m 9M 11P", "5P 7m 8P 9M 11P", "7m 8P 9M 11P 12P", "7m 8P 11P 12P 16M"],
  "13sus": ["1P 4P 6M 7m 9M", "1P 7m 9M 11P 13M", "5P 7m 9M 11P 13M", "7m 9M 11P 13M 15P"],
  "7b13sus": ["1P 5P 7m 11P 13m", "5P 7m 8P 11P 13m", "7m 11P 13m 14m 15P"]
}, complex = {
  2: ["1P 5P 6M 8P 9M", "1P 5P 8P 9M 12P", "5P 8P 9M 12P 13M", "5P 8P 9M 12P 15P"],
  5: ["1P 5P 8P 12P", "1P 5P 8P 9M 12P", "5P 8P 12P 15P", "5P 8P 12P 15P 16M"],
  6: ["1P 5P 6M 9M 10M", "1P 5P 9M 10M 13M", "3M 5P 9M 10M 13M", "5P 8P 9M 10M 13M", "3M 6M 9M 12P 15P"],
  7: [
    "1P 5P 7m 8P 10M",
    "1P 7m 8P 10M 12P",
    "3M 7m 8P 10M 12P",
    "3M 7m 8P 10M 14m",
    "3M 7m 10M 12P 15P",
    "7m 10M 12P 14m 15P",
    "7m 10M 12P 15P 17M",
    "7m 10M 14m 17M 19P"
  ],
  9: [
    "1P 6M 7m 9M 10M",
    "3M 7m 9M 10M 12P",
    "1P 7m 9M 10M 13M",
    "3M 7m 9M 10M 13M",
    "3M 7m 9M 12P 15P",
    "7m 10M 12P 13M 16M",
    "7m 10M 13M 16M 17M",
    "7m 10M 13M 16M 19P"
  ],
  11: [
    "1P 4P 6M 7m 9M",
    "1P 5P 7m 9M 11P",
    "4P 6M 7m 9M 11P",
    "5P 8P 9M 11P 14m",
    "7m 9M 11P 13M 15P",
    "7m 11P 12P 14m 18P"
  ],
  13: [
    "3M 7m 9M 10M 13M",
    "3M 7m 9M 13M 15P",
    "3M 7m 10M 13M 16M",
    "7m 10M 12P 13M 16M",
    "7m 10M 13M 16M 17M",
    "7m 10M 13M 16M 19P"
  ],
  69: ["1P 5P 6M 9M 10M", "1P 5P 9M 10M 13M", "3M 5P 9M 10M 13M", "5P 8P 9M 10M 13M", "3M 6M 9M 12P 15P"],
  add9: [
    "1P 5P 8P 9M 10M",
    "1P 5P 9M 10M 12P",
    "3M 8P 9M 10M 12P",
    "3M 8P 9M 12P 15P",
    "5P 8P 9M 10M 15P",
    "5P 8P 9M 12P 17M"
  ],
  "+": [
    "1P 6m 8P 9M 10M",
    "1P 6m 8P 10M 13m",
    "3M 8P 9M 10M 13m",
    "3M 8P 10M 13m 15P",
    "6m 10M 13m 15P 16M",
    "6m 10M 13m 15P 17M"
  ],
  o: [
    "1P 6M 8P 10m 12d",
    "1P 6M 10m 12d 13M",
    "3m 8P 10m 12d 13M",
    "3m 8P 12d 13M 15P",
    "5d 10m 12d 13M 15P",
    "5d 10m 13M 15P 17m",
    "6M 12d 13M 15P 17m",
    "6M 12d 15P 17m 19d"
  ],
  h: [
    "1P 5d 7m 10m 11P",
    "3m 5d 7m 8P 11P",
    "5d 7m 8P 10m 11P",
    "1P 7m 10m 12d",
    "3m 7m 8P 12d 14m",
    "5d 8P 10m 11P 14m",
    "7m 10m 11P 12d 14m",
    "7m 10m 12d 14m 15P",
    "5d 8P 10m 14m 17m"
  ],
  sus: [
    "1P 4P 5P 8P 9M",
    "1P 4P 5P 8P 11P",
    "1P 5P 8P 9M 11P",
    "5P 8P 9M 11P 12P",
    "5P 8P 11P 12P 13M",
    "5P 8P 11P 13M 15P"
  ],
  "^": [
    "1P 3M 5P 6M 9M",
    "1P 5P 8P 10M 12P",
    "3M 5P 9M 10M 12P",
    "1P 5P 8P 10M 13M",
    "3M 8P 10M 13M 15P",
    "5P 9M 10M 12P 15P"
  ],
  "-": [
    "1P 3m 5P 8P 10m",
    "1P 3m 5P 9M 11P",
    "3m 5P 8P 9M 11P",
    "5P 8P 9M 10m 11P",
    "1P 5P 9M 10m 12P",
    "3m 5P 8P 10m 12P",
    "5P 8P 10m 12P 15P"
  ],
  "^7": [
    "1P 6M 7M 9M 10M",
    "3M 7M 9M 10M 12P",
    "1P 7M 9M 10M 13M",
    "3M 7M 9M 10M 13M",
    "3M 7M 9M 12P 13M",
    "3M 7M 9M 13M 14M",
    "3M 7M 10M 13M 16M",
    "7M 10M 13M 14M 16M",
    "7M 10M 13M 16M 17M",
    "7M 10M 13M 16M 19P"
  ],
  "-7": [
    "1P 3m 5P 7m 9M",
    "1P 3m 5P 7m 10m",
    "1P 5P 7m 10m 11P",
    "3m 7m 8P 10m 11P",
    "1P 5P 7m 10m 12P",
    "3m 7m 9M 10m 12P",
    "3m 7m 8P 10m 14m",
    "5P 7m 9M 10m 14m",
    "7m 10m 11P 14m 15P",
    "7m 10m 12P 15P 16M",
    "5P 8P 11P 14m 17m",
    "7m 10m 12P 15P 17m"
  ],
  "7sus": [
    "1P 4P 6M 7m 9M",
    "1P 5P 7m 9M 11P",
    "4P 6M 7m 9M 11P",
    "5P 8P 9M 11P 14m",
    "7m 9M 11P 13M 15P",
    "7m 11P 12P 14m 18P"
  ],
  h7: [
    "1P 5d 7m 10m 11P",
    "3m 5d 7m 8P 11P",
    "5d 7m 8P 10m 11P",
    "1P 7m 10m 12d",
    "3m 7m 8P 10m 12d",
    "3m 7m 8P 12d 14m",
    "5d 8P 10m 11P 14m",
    "7m 10m 11P 12d 14m",
    "7m 10m 12d 14m 15P",
    "5d 8P 10m 14m 17m"
  ],
  o7: [
    "1P 6M 8P 10m 12d",
    "1P 6M 10m 12d 13M",
    "3m 8P 10m 12d 13M",
    "3m 8P 12d 13M 15P",
    "5d 10m 12d 13M 15P",
    "5d 10m 13M 15P 17m",
    "6M 12d 13M 15P 17m",
    "6M 12d 15P 17m 19d"
  ],
  "^9": [
    "1P 6M 7M 9M 10M",
    "1P 7M 9M 10M 13M",
    "3M 7M 9M 10M 13M",
    "3M 7M 9M 12P 13M",
    "3M 7M 8P 9M 13M",
    "3M 7M 9M 13M 14M",
    "3M 7M 10M 13M 16M",
    "7M 10M 13M 14M 16M",
    "7M 10M 13M 16M 17M",
    "7M 10M 13M 16M 19P"
  ],
  "^13": [
    "1P 6M 7M 9M 10M",
    "1P 7M 9M 10M 13M",
    "3M 7M 9M 12P 13M",
    "3M 7M 9M 10M 13M",
    "3M 7M 8P 9M 13M",
    "3M 7M 9M 13M 14M",
    "3M 7M 10M 13M 16M",
    "7M 10M 13M 14M 16M",
    "7M 10M 13M 16M 17M",
    "7M 10M 13M 16M 19P"
  ],
  "^7#11": [
    "1P 3M 5d 7M 9M",
    "1P 7M 9M 10M 12d",
    "3M 7M 9M 10M 12d",
    "3M 7M 9M 12d 13M",
    "3M 7M 10M 12d 14M",
    "7M 10M 12d 13M 14M",
    "7M 10M 12d 13M 16M",
    "7M 10M 12d 14M 17M"
  ],
  "^9#11": [
    "1P 3M 5d 7M 9M",
    "1P 7M 9M 10M 12d",
    "3M 7M 9M 10M 12d",
    "3M 7M 9M 12d 13M",
    "3M 7M 9M 12d 14M",
    "7M 10M 12d 14M 16M",
    "7M 10M 12d 13M 16M"
  ],
  "^7#5": ["1P 6m 7M 10M 13m", "3M 7M 9M 10M 13m", "3M 7M 10M 13m 14M", "7M 10M 13m 14M 16M", "7M 10M 13m 14M 17M"],
  "-6": [
    "1P 3m 5P 6M 9M",
    "3m 5P 6M 8P 9M",
    "1P 5P 6M 10m 11P",
    "3m 5P 6M 8P 11P",
    "1P 5P 9M 10m 13M",
    "3m 5P 8P 9M 13M",
    "5P 8P 10m 11P 13M",
    "5P 8P 10m 13M 16M"
  ],
  "-69": [
    "1P 3m 5P 6M 9M",
    "3m 5P 6M 8P 9M",
    "3m 6M 9M 10m 12P",
    "1P 5P 9M 10m 13M",
    "3m 5P 8P 9M 13M",
    "5P 8P 9M 10m 13M",
    "5P 8P 10m 13M 16M"
  ],
  "-^7": [
    "1P 3m 5P 7M 9M",
    "1P 5P 7M 10m 11P",
    "3m 7M 9M 10m 11P",
    "3m 7M 9M 10m 12P",
    "3m 7M 9M 12P 14M",
    "7M 10m 11P 12P 14M",
    "7M 10m 12P 14M 16M"
  ],
  "-^9": [
    "1P 3m 5P 7M 9M",
    "1P 5P 7M 10m 11P",
    "3m 7M 9M 10m 11P",
    "3m 7M 9M 10m 12P",
    "3m 7M 9M 12P 14M",
    "7M 10m 11P 12P 14M",
    "7M 10m 12P 14M 16M"
  ],
  "-9": [
    "1P 3m 5P 7m 9M",
    "1P 3m 7m 9M 11P",
    "3m 7m 9M 10m 11P",
    "3m 7m 9M 10m 12P",
    "3m 7m 9M 10m 14m",
    "3m 7m 9M 12P 15P",
    "7m 10m 11P 14m 16M",
    "7m 10m 12P 16M 18P"
  ],
  "-add9": ["1P 2M 3m 5P 8P", "1P 3m 5P 9M", "3m 5P 8P 9M 12P", "5P 8P 9M 10m 12P"],
  "-11": [
    "3m 5P 7m 9M 11P",
    "7m 9M 10m 11P",
    "1P 4P 7m 10m 12P",
    "3m 7m 9M 11P 12P",
    "7m 9M 10m 11P 12P",
    "3m 7m 9M 11P 14m",
    "4P 10m 12P 14m",
    "5P 8P 11P 14m",
    "5P 8P 11P 14m 16M",
    "7m 10m 12P 16M 18P",
    "7m 10m 11P 16M 21m"
  ],
  "-7b5": [
    "1P 5d 7m 10m 11P",
    "3m 5d 7m 8P 11P",
    "5d 7m 8P 10m 11P",
    "1P 7m 10m 12d",
    "3m 7m 8P 10m 12d",
    "3m 7m 8P 12d 14m",
    "5d 8P 10m 11P 14m",
    "7m 10m 11P 12d 14m",
    "7m 10m 12d 14m 15P",
    "5d 8P 10m 14m 17m"
  ],
  h9: [
    "3m 5d 7m 9M 11P",
    "1P 7m 9M 10m 12d",
    "3m 7m 9M 12d 14m",
    "5d 8P 9M 10m 14m",
    "7m 10m 11P 12d 14m",
    "7m 10m 12d 14m 16M"
  ],
  "-b6": ["1P 3m 5P 6m 8P", "3m 5P 8P 11P 13m", "5P 8P 10m 11P 13m"],
  "-#5": ["1P 6m 8P 10m 13m", "3m 6m 8P 11P 13m", "6m 8P 10m 13m 15P"],
  "7b9": ["1P 3M 7m 9m 10M", "3M 7m 8P 9m 10M", "3M 7m 8P 9m 14m", "7m 9m 10M 14m 15P"],
  "7#9": ["1P 3M 7m 10m", "3M 7m 10m 10M 12P", "3M 7m 10m 12P 14m", "7m 10M 12P 14m 17m"],
  "7#11": ["1P 3M 7m 9M 12d", "3M 7m 9M 12d 13M", "7m 10M 12d 13M 16M"],
  "7b5": ["1P 3M 7m 9M 12d", "3M 7m 9M 12d 13M", "7m 10M 12d 13M 16M"],
  "7#5": ["1P 3M 7m 10M 13m", "3M 7m 8P 10M 13m", "3M 7m 8P 13m 14m", "7m 10M 13m 14m 15P", "7m 10M 13m 14m 17M"],
  "9#11": ["1P 7m 9M 10M 12d", "3M 7m 8P 9M 12d", "7m 10M 12d 15P 16M"],
  "9b5": ["1P 7m 9M 10M 12d", "3M 7m 8P 9M 12d", "7m 10M 12d 15P 16M"],
  "9#5": ["1P 7m 9M 10M 13m", "3M 7m 9M 10M 13m", "3M 7m 9M 13m 14m", "7m 10M 13m 14m 16M", "7m 10M 13m 16M 17M"],
  "7b13": ["1P 3M 7m 10M 13m", "3M 7m 8P 10M 13m", "3M 7m 8P 13m 14m", "7m 10M 13m 14m 15P", "7m 10M 13m 14m 17M"],
  "7#9#5": ["3M 7m 10m 10M 13m", "3M 7m 10m 13m 14m", "7m 10M 13m 14m 17m"],
  "7#9b5": ["3M 7m 10m 10M 12d", "3M 7m 10m 12d 14m", "7m 10M 12d 14m 17m"],
  "7#9#11": ["3M 7m 10m 10M 12d", "3M 7m 10m 12d 14m", "7m 10M 12d 14m 17m"],
  "7b9#11": ["3M 7m 9m 10M 12d", "3M 7m 9m 12d 14m", "7m 8P 10M 12d 16m", "7m 10M 12d 14m 16m"],
  "7b9b5": ["3M 7m 9m 10M 12d", "3M 7m 9m 12d 14m", "7m 8P 10M 12d 16m", "7m 10M 12d 14m 16m"],
  "7b9#5": ["1P 7m 9m 10M 13m", "3M 7m 9m 10M 13m", "3M 7m 10M 13m 16m", "7m 10M 13m 14m 16m", "7m 10M 13m 16m 17M"],
  "7b9#9": ["1P 3M 7m 9m 10m", "3M 7m 10m 13m 16m", "7m 10M 13m 16m 17m"],
  "7b9b13": ["1P 7m 9m 10M 13m", "3M 7m 9m 10M 13m", "3M 7m 10M 13m 16m", "7m 10M 13m 14m 16m", "7m 10M 13m 16m 17M"],
  "7alt": [
    "3M 7m 8P 10m 13m",
    "3M 7m 9m 12d 13m",
    "3M 7m 9m 10m 13m",
    "3M 7m 10m 13m 14m",
    "3M 7m 9m 12d 14m",
    "3M 7m 10m 13m 15P",
    "3M 7m 10m 13m 16m",
    "7m 10M 12d 14m 16m",
    "7m 10M 12d 13m 16m",
    "7m 10M 13m 15P 17m",
    "7m 10M 13m 16m 17m",
    "7m 10M 13m 16m 19d"
  ],
  "13#11": ["3M 7m 9M 12d 13M", "7m 10M 12d 13M 16M"],
  "13b9": ["3M 7m 9m 10M 13M", "3M 7m 10M 13M 16m", "7m 10M 13M 16m 17M"],
  "13#9": ["3M 7m 10m 10M 13M", "7m 10M 13M 14m 17m"],
  "7b9sus": ["1P 5P 7m 9m 11P", "5P 7m 8P 9m 11P", "7m 8P 11P 14m 16m"],
  "7susadd3": ["1P 4P 5P 7m 10M", "5P 8P 10M 11P 14m", "7m 11P 12P 15P 17M"],
  "9sus": [
    "1P 4P 6M 7m 9M",
    "1P 5P 7m 9M 11P",
    "4P 6M 7m 9M 11P",
    "5P 8P 9M 11P 14m",
    "7m 9M 11P 13M 15P",
    "7m 11P 12P 14m 18P"
  ],
  "13sus": [
    "1P 4P 6M 7m 9M",
    "1P 7m 9M 11P 13M",
    "4P 7m 9M 11P 13M",
    "7m 9M 11P 13M 15P",
    "7m 11P 13M 14m 16M",
    "7m 11P 13M 16M 18P"
  ],
  "7b13sus": ["1P 5P 7m 11P 13m", "5P 7m 8P 11P 13m", "7m 11P 13m 14m 15P"]
}, { dictionaryVoicing, minTopNoteDiff } = _voicings.default || _voicings, lefthand = {
  m7: ["3m 5P 7m 9M", "7m 9M 10m 12P"],
  7: ["3M 6M 7m 9M", "7m 9M 10M 13M"],
  "^7": ["3M 5P 7M 9M", "7M 9M 10M 12P"],
  69: ["3M 5P 6A 9M"],
  m7b5: ["3m 5d 7m 8P", "7m 8P 10m 12d"],
  "7b9": ["3M 6m 7m 9m", "7m 9m 10M 13m"],
  "7b13": ["3M 6m 7m 9m", "7m 9m 10M 13m"],
  o7: ["1P 3m 5d 6M", "5d 6M 8P 10m"],
  "7#11": ["7m 9M 11A 13A"],
  "7#9": ["3M 7m 9A"],
  mM7: ["3m 5P 7M 9M", "7M 9M 10m 12P"],
  m6: ["3m 5P 6M 9M", "6M 9M 10m 12P"]
}, guidetones = {
  m7: ["3m 7m", "7m 10m"],
  m9: ["3m 7m", "7m 10m"],
  7: ["3M 7m", "7m 10M"],
  "^7": ["3M 7M", "7M 10M"],
  "^9": ["3M 7M", "7M 10M"],
  69: ["3M 6M"],
  6: ["3M 6M", "6M 10M"],
  m7b5: ["3m 7m", "7m 10m"],
  "7b9": ["3M 7m", "7m 10M"],
  "7b13": ["3M 7m", "7m 10M"],
  o7: ["3m 6M", "6M 10m"],
  "7#11": ["3M 7m", "7m 10M"],
  "7#9": ["3M 7m", "7m 10M"],
  mM7: ["3m 7M", "7M 10m"],
  m6: ["3m 6M", "6M 10m"]
}, triads = {
  "": ["1P 3M 5P", "3M 5P 8P", "5P 8P 10M"],
  M: ["1P 3M 5P", "3M 5P 8P", "5P 8P 10M"],
  m: ["1P 3m 5P", "3m 5P 8P", "5P 8P 10m"],
  o: ["1P 3m 5d", "3m 5d 8P", "5d 8P 10m"],
  aug: ["1P 3m 5A", "3m 5A 8P", "5A 8P 10m"]
}, defaultDictionary = {
  // triads
  "": ["1P 3M 5P", "3M 5P 8P", "5P 8P 10M"],
  M: ["1P 3M 5P", "3M 5P 8P", "5P 8P 10M"],
  m: ["1P 3m 5P", "3m 5P 8P", "5P 8P 10m"],
  o: ["1P 3m 5d", "3m 5d 8P", "5d 8P 10m"],
  aug: ["1P 3m 5A", "3m 5A 8P", "5A 8P 10m"],
  // sevenths chords
  m7: ["3m 5P 7m 9M", "7m 9M 10m 12P"],
  7: ["3M 6M 7m 9M", "7m 9M 10M 13M"],
  "^7": ["3M 5P 7M 9M", "7M 9M 10M 12P"],
  69: ["3M 5P 6A 9M"],
  m7b5: ["3m 5d 7m 8P", "7m 8P 10m 12d"],
  "7b9": ["3M 6m 7m 9m", "7m 9m 10M 13m"],
  "7b13": ["3M 6m 7m 9m", "7m 9m 10M 13m"],
  o7: ["1P 3m 5d 6M", "5d 6M 8P 10m"],
  "7#11": ["7m 9M 11A 13A"],
  "7#9": ["3M 7m 9A"],
  mM7: ["3m 5P 7M 9M", "7M 9M 10m 12P"],
  m6: ["3m 5P 6M 9M", "6M 9M 10m 12P"]
}, voicingRegistry = {
  lefthand: { dictionary: lefthand, range: ["F3", "A4"], mode: "below", anchor: "a4" },
  triads: { dictionary: triads, mode: "below", anchor: "a4" },
  guidetones: { dictionary: guidetones, mode: "above", anchor: "a4" },
  legacy: { dictionary: defaultDictionary, mode: "below", anchor: "a4" }
};
let defaultDict = "ireal";
const setDefaultVoicings = (e) => defaultDict = e, setVoicingRange = (e, t) => addVoicings(e, voicingRegistry[e].dictionary, t), addVoicings = (e, t, a = ["F3", "A4"]) => {
  Object.assign(voicingRegistry, { [e]: { dictionary: t, range: a } });
}, registerVoicings = (e, t, a = {}) => {
  Object.assign(voicingRegistry, { [e]: { dictionary: t, ...a } });
}, getVoicing = (e, t, a) => {
  const { dictionary: o, range: u } = voicingRegistry[t];
  return dictionaryVoicing({
    chord: e,
    dictionary: o,
    range: u,
    picker: minTopNoteDiff,
    lastVoicing: a
  });
};
let lastVoicing;
const voicings = register("voicings", function(e, t) {
  return t.fmap((a) => (lastVoicing = getVoicing(a, e, lastVoicing), stack(...lastVoicing))).outerJoin();
}), rootNotes = register("rootNotes", function(e, t) {
  return t.fmap((a) => {
    const l = (a.chord || a).match(/^([a-gA-G][b#]?).*$/)[1] + e;
    return a.chord ? { note: l } : l;
  });
}), voicing = register("voicing", function(e) {
  return e.fmap((t) => {
    t = typeof t == "string" ? { chord: t } : t;
    let { dictionary: a = defaultDict, chord: o, anchor: u, offset: l, mode: f, n: p, octaves: g, ...d } = t;
    a = typeof a == "string" ? voicingRegistry[a] : { dictionary: a, mode: "below", anchor: "c5" };
    try {
      let b = renderVoicing({ ...a, chord: o, anchor: u, offset: l, mode: f, n: p, octaves: g });
      return stack(...b).note().set(d);
    } catch {
      return logger$2(`[voicing]: unknown chord "${o}"`), silence;
    }
  }).outerJoin();
});
function voicingAlias(e, t, a) {
  a = Array.isArray(a) ? a : [a], a.forEach((o) => {
    o[t] = o[e];
  });
}
voicingAlias("^", "", [simple, complex]);
Object.keys(simple).forEach((e) => {
  if (e.includes("-")) {
    let t = e.replace("-", "m");
    voicingAlias(e, t, [complex, simple]);
  }
  if (e.includes("^")) {
    let t = e.replace("^", "M");
    voicingAlias(e, t, [complex, simple]);
  }
  if (e.includes("+")) {
    let t = e.replace("+", "aug");
    voicingAlias(e, t, [complex, simple]);
  }
});
registerVoicings("ireal", simple);
registerVoicings("ireal-ext", complex);
function resetVoicings() {
  lastVoicing = void 0, setDefaultVoicings("ireal");
}
const packageName = "@strudel/tonal", index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addVoicings,
  complex,
  packageName,
  registerVoicings,
  resetVoicings,
  rootNotes,
  scale,
  scaleTrans,
  scaleTranspose,
  setDefaultVoicings,
  setVoicingRange,
  simple,
  strans,
  trans,
  transpose,
  voicing,
  voicingAlias,
  voicingRegistry,
  voicings
}, Symbol.toStringTag, { value: "Module" }));
async function defaultPrebake() {
  const e = evalScope(
    evalScope,
    Promise.resolve().then(() => strudel),
    Promise.resolve().then(() => index$6),
    Promise.resolve().then(() => index),
    Promise.resolve().then(() => index$7),
    { hush, evaluate }
  );
  await Promise.all([e, registerSynthSounds(), registerSoundfonts()]);
}
let initDone, repl;
function initStrudel(e = {}) {
  initAudioOnFirstClick(), e.miniAllStrings !== !1 && miniAllStrings();
  const { prebake: t, ...a } = e;
  return repl = webaudioRepl({ ...a, transpiler }), initDone = (async () => (await defaultPrebake(), await t?.(), repl))(), setTime(() => repl.scheduler.now()), initDone;
}
window.initStrudel = initStrudel;
Pattern$1.prototype.play = function() {
  if (!repl)
    throw new Error(".play: no repl found. Have you called initStrudel?");
  return initDone.then(() => {
    repl.setPattern(this, !0);
  }), this;
};
function hush() {
  repl.stop();
}
async function evaluate(e, t = !0) {
  return repl.evaluate(e, t);
}
export {
  ClockCollator,
  Cyclist,
  DEFAULT_MAX_POLYPHONY,
  fraction$1 as Fraction,
  Hap,
  Pattern$1 as Pattern,
  peg$allowedStartRules as StartRules,
  State,
  peg$SyntaxError as SyntaxError,
  TimeSpan,
  Warpmode,
  __chooseWith,
  _brandBy,
  _fitslice,
  _irand,
  _keyDown,
  _match,
  _mod$2 as _mod,
  _morph,
  _polymeterListSteps,
  _retime,
  _slices,
  accelerate,
  activeLabel,
  ad,
  add$5 as add,
  addVoicings,
  adsr,
  aliasBank,
  almostAlways,
  almostNever,
  always,
  amp,
  analysers,
  analysersData,
  analyze,
  anchor,
  and,
  apply,
  applyFM,
  applyGainCurve,
  applyN,
  applyParameterModulators,
  ar,
  arp,
  arpWith,
  arrange,
  as,
  att,
  attack,
  averageArray,
  backgroundImage,
  band,
  bandf,
  bandq,
  bank,
  base64ToUnicode,
  bbexpr,
  bbst,
  beat,
  begin,
  berlin,
  berlinWith,
  binary,
  binaryL,
  binaryN,
  binaryNL,
  bind,
  binshift,
  bite,
  bjork,
  bjorklund,
  blshift,
  bor,
  bp,
  bpa,
  bpattack,
  bpd,
  bpdc,
  bpdecay,
  bpdepth,
  bpe,
  bpenv,
  bpf,
  bpq,
  bpr,
  bprate,
  bprelease,
  bps,
  bpshape,
  bpskew,
  bpsustain,
  bpsync,
  brak,
  brand,
  brandBy,
  brshift,
  bxor,
  bypass,
  byteBeatExpression,
  byteBeatStartTime,
  calculateSteps,
  cat,
  ccn,
  ccv,
  ceil,
  ch,
  channel,
  channels,
  choose,
  chooseCycles,
  chooseIn,
  chooseInWith,
  chooseOut,
  chooseWith,
  chop,
  chord$1 as chord,
  chorus,
  chunk,
  chunkBack,
  chunkBackInto,
  chunkInto,
  chunkback,
  chunkbackinto,
  chunkinto,
  clamp$1 as clamp,
  cleanupUi,
  clip,
  coarse,
  code2hash,
  color,
  colour,
  comb,
  complex,
  compose,
  compress,
  compressSpan,
  compressor,
  compressorAttack,
  compressorKnee,
  compressorRatio,
  compressorRelease,
  compressspan,
  connectToDestination,
  constant,
  contract,
  control,
  controls,
  cosine,
  cosine2,
  cpm,
  cps,
  createClock,
  createFilter,
  createParam,
  createParams,
  crush,
  ctf,
  ctlNum,
  ctranspose,
  curry,
  curve,
  cut,
  cutoff,
  cycleToSeconds$1 as cycleToSeconds,
  dec,
  decay,
  defaultPrebake,
  degrade,
  degradeBy,
  degradeByWith,
  degree,
  delay,
  delayfb,
  delayfeedback,
  delayspeed,
  delaysync,
  delayt,
  delaytime,
  deltaSlide,
  destroyAudioWorkletNode,
  det,
  detune,
  dfb,
  dict,
  dictionary$3 as dictionary,
  dist$2 as dist,
  distort,
  distortionAlgorithms,
  distorttype,
  distortvol,
  div,
  djf,
  dough,
  doughTrigger,
  doughsamples,
  drawFrequencyScope,
  drawLine,
  drawTimeScope,
  drive,
  drop,
  dry,
  drywet,
  ds,
  dspWorklet,
  dt,
  duck,
  duckattack,
  duckdepth,
  duckonset,
  dur,
  duration,
  early,
  echo,
  echoWith,
  echowith,
  effectSend,
  eish,
  end,
  enhance,
  eq,
  eqt,
  euclid,
  euclidLegato,
  euclidLegatoRot,
  euclidRot,
  euclidish,
  euclidrot,
  evalScope,
  evaluate,
  every,
  expand,
  expression,
  extend,
  fadeInTime,
  fadeOutTime,
  fadeTime,
  fanchor,
  fast,
  fastChunk,
  fastGap,
  fastcat,
  fastchunk,
  fastgap,
  fft,
  filter$1 as filter,
  filterWhen,
  firstOf,
  fit,
  flatten,
  floor,
  fm$1 as fm,
  fmattack,
  fmdecay,
  fmenv,
  fmh,
  fmi,
  fmrelease,
  fmsustain,
  fmvelocity,
  fmwave,
  focus,
  focusSpan,
  focusspan,
  fractionalArgs,
  frameRate,
  frames,
  freeze,
  freq$1 as freq,
  freqToMidi$2 as freqToMidi,
  fromBipolar,
  fshift,
  fshiftnote,
  fshiftphase,
  ftype,
  func,
  gain,
  gainNode,
  gap,
  gat,
  gate,
  getADSRValues,
  getAccidentalsOffset$1 as getAccidentalsOffset,
  getAnalyserById,
  getAnalyzerData,
  getAudioContext,
  getAudioContextCurrentTime,
  getAudioDevices,
  getCachedBuffer,
  getCompressor,
  getControlName,
  getCurrentKeyboardState,
  getDefaultValue,
  getDistortion,
  getDistortionAlgorithm,
  getEventOffsetMs,
  getFontBufferSource,
  getFreq,
  getFrequency,
  getFrequencyFromValue,
  getLeafLocation,
  getLeafLocations,
  getLeaves,
  getLfo,
  getLoadedBuffer,
  getOscillator,
  getParamADSR,
  getParamLfo,
  getPerformanceTimeSeconds,
  getPitchEnvelope,
  getPlayableNoteValue,
  getSampleBuffer,
  getSampleBufferSource,
  getSampleInfo,
  getSound,
  getSoundIndex$1 as getSoundIndex,
  getTime,
  getTrigger,
  getVibratoOscillator,
  getWidgetID,
  getWorklet,
  getZZFX,
  grow,
  gt,
  gte,
  h,
  harmonic,
  hash2code,
  hbrick,
  hcutoff,
  hold,
  hours,
  hp,
  hpa,
  hpattack,
  hpd,
  hpdc,
  hpdecay,
  hpdepth,
  hpe,
  hpenv,
  hpf,
  hpq,
  hpr,
  hprate,
  hprelease,
  hps,
  hpshape,
  hpskew,
  hpsustain,
  hpsync,
  hresonance,
  hsl,
  hsla,
  hurry,
  hush,
  id,
  imag,
  inhabit,
  inhabitmod,
  initAudio,
  initAudioOnFirstClick,
  initStrudel,
  innerBind,
  inside,
  inv,
  invert$1 as invert,
  ir,
  irand,
  irbegin,
  iresponse,
  irspeed,
  isControlName,
  isNote,
  isNoteWithOctave,
  isPattern,
  isaw,
  isaw2,
  iter,
  iterBack,
  iterback,
  itri,
  itri2,
  jux,
  juxBy,
  juxby,
  kcutoff,
  keep,
  keepif,
  keyAlias,
  keyDown,
  krush,
  label,
  lastOf,
  late,
  lbrick,
  legato,
  leslie,
  lfo,
  linger,
  listRange,
  loadBuffer$1 as loadBuffer,
  loadSoundfont,
  lock,
  logKey,
  loop,
  loopAt,
  loopAtCps,
  loopBegin,
  loopEnd,
  loopat,
  loopatcps,
  loopb,
  loope,
  lp,
  lpa,
  lpattack,
  lpd,
  lpdc,
  lpdecay,
  lpdepth,
  lpe,
  lpenv,
  lpf,
  lpq,
  lpr,
  lprate,
  lprelease,
  lps,
  lpshape,
  lpskew,
  lpsustain,
  lpsync,
  lrate,
  lsize,
  lt,
  lte,
  m,
  mapArgs,
  mask,
  midi2note$1 as midi2note,
  midiToFreq$2 as midiToFreq,
  midibend,
  midichan,
  midicmd,
  midimap,
  midiport,
  miditouch,
  mini,
  mini2ast,
  miniAllStrings,
  minify,
  minutes,
  mod$3 as mod,
  mode$1 as mode,
  morph,
  mouseX,
  mouseY,
  mousex,
  mousey,
  mtranspose,
  mul,
  n,
  nanFallback$1 as nanFallback,
  ne,
  net,
  never,
  noise,
  noises,
  note$2 as note,
  noteToMidi$1 as noteToMidi,
  nothing,
  nrpnn,
  nrpv,
  nudge,
  numeralArgs,
  objectMap,
  octave$1 as octave,
  octaveR,
  octaves,
  octer,
  octersub,
  octersubsub,
  off,
  offset,
  often,
  onTriggerSample,
  onTriggerSynth,
  or,
  orbit,
  oschost,
  oscport,
  outerBind,
  outside,
  overgain,
  overshape,
  pace,
  packageName,
  pairs,
  palindrome,
  pan,
  panchor,
  panorient,
  panspan,
  pansplay,
  panwidth,
  parray,
  peg$parse as parse,
  parseFractional,
  parseNumeral,
  partials,
  patt,
  pattack,
  patternifyAST,
  pcurve,
  pdec,
  pdecay,
  penv,
  perlin,
  perlinWith,
  ph,
  phasdp,
  phaser,
  phasercenter,
  phaserdepth,
  phaserrate,
  phasersweep,
  phases,
  phc,
  phd,
  phs,
  pick,
  pickF,
  pickOut,
  pickReset,
  pickRestart,
  pickSqueeze,
  pickmod,
  pickmodF,
  pickmodOut,
  pickmodReset,
  pickmodRestart,
  pickmodSqueeze,
  pipe,
  pitchJump,
  pitchJumpTime,
  ply,
  plyForEach,
  plyWith,
  pm,
  polyBind,
  polyTouch,
  polymeter,
  polyrhythm,
  postgain,
  pow,
  pr,
  prel,
  prelease,
  press,
  pressBy,
  processSampleMap,
  progNum,
  psus,
  psustain,
  pure,
  pw,
  pwrate,
  pwsweep,
  rand,
  rand2,
  randL,
  randcat,
  randrun,
  range$2 as range,
  range2,
  rangex,
  rarely,
  rate,
  ratio,
  rdim,
  real,
  ref$1 as ref,
  register,
  registerControl,
  registerLanguage,
  registerSampleSource,
  registerSamplesPrefix,
  registerSound,
  registerSoundfonts,
  registerSynthSounds,
  registerVoicings,
  registerWaveTable,
  registerWidgetType,
  registerWorklet,
  registerZZFXSounds,
  reify,
  rel,
  release,
  removeUndefineds,
  repeatCycles,
  repeatTime,
  repl$2 as repl,
  replicate,
  resetDefaultValues,
  resetDefaults,
  resetGlobalEffects,
  resetLoadedSounds,
  resetVoicings,
  resonance,
  rev,
  reverseBuffer,
  rfade,
  rib,
  ribbon,
  ring,
  ringdf,
  ringf,
  rlp,
  room,
  roomdim,
  roomfade,
  roomlp,
  roomsize,
  rootNotes,
  rotate$2 as rotate,
  round,
  rsize,
  run,
  s,
  s_add,
  s_alt,
  s_cat,
  s_contract,
  s_expand,
  s_extend,
  s_polymeter,
  s_sub,
  s_taper,
  s_taperlist,
  s_tour,
  s_zip,
  samples,
  saw,
  saw2,
  scale,
  scaleTrans,
  scaleTranspose,
  scheduleAtTime,
  scram,
  scramble,
  scrub,
  seconds,
  seg,
  segment,
  semitone,
  seq,
  seqPLoop,
  sequence,
  sequenceP,
  set,
  setDefault,
  setDefaultAudioContext,
  setDefaultValue,
  setDefaultValues,
  setDefaultVoicings,
  setGainCurve,
  setLogger,
  setMaxPolyphony,
  setMultiChannelOrbits,
  setSoundfontUrl,
  setStringParser,
  setTime,
  setVersionDefaults,
  setVoicingRange,
  shape,
  shrink,
  shrinklist,
  shuffle$2 as shuffle,
  signal,
  silence,
  simple,
  sine,
  sine2,
  size,
  slice,
  slide,
  slow,
  slowChunk,
  slowcat,
  slowcatPrime,
  slowchunk,
  smear$1 as smear,
  sol2note,
  someCycles,
  someCyclesBy,
  sometimes,
  sometimesBy,
  songPtr,
  sound,
  soundAlias,
  soundMap$1 as soundMap,
  list$1 as soundfontList,
  source,
  sparsity,
  speak,
  speed,
  splice,
  splitAt,
  spread,
  square,
  square2,
  squeeze,
  squeezeBind,
  squiz,
  src,
  stack,
  stackBy,
  stackCentre,
  stackLeft,
  stackRight,
  ce as startPresetNote,
  steady,
  stepBind,
  stepalt,
  stepcat,
  steps$2 as steps,
  stepsPerOctave,
  strans,
  stretch,
  striate,
  stringifyValues,
  struct,
  strudelScope,
  stut,
  stutWith,
  stutwith,
  sub,
  superdough,
  superdoughTrigger,
  superimpose,
  sus,
  sustain,
  sustainpedal,
  swing,
  swingBy,
  sysex,
  sysexdata,
  sysexid,
  sz,
  tables,
  take,
  time$1 as time,
  timeCat,
  timecat,
  toBipolar,
  tokenizeNote$3 as tokenizeNote,
  tour,
  trans,
  transpiler,
  transpose,
  tremolo,
  tremolodepth,
  tremolophase,
  tremoloshape,
  tremoloskew,
  tremolosync,
  tri,
  tri2,
  triode,
  tsdelay,
  uid,
  undegrade,
  undegradeBy,
  unicodeToBase64,
  uniq,
  uniqsort,
  uniqsortr,
  unison,
  unit,
  v,
  val,
  valueToMidi$1 as valueToMidi,
  velocity,
  vib,
  vibmod,
  vibrato,
  vmod,
  voice,
  voicing,
  voicingAlias,
  voicingRegistry,
  voicings,
  vowel,
  warp,
  warpatt,
  warpattack,
  warpdc,
  warpdec,
  warpdecay,
  warpdepth,
  warpenv,
  warpmode,
  warprate,
  warprel,
  warprelease,
  warpshape,
  warpskew,
  warpsus,
  warpsustain,
  warpsync,
  waveformN,
  waveloss,
  wavetablePhaseRand,
  wavetablePosition,
  wavetableWarp,
  wavetableWarpMode,
  wchoose,
  wchooseCycles,
  webAudioTimeout,
  webaudioOutput,
  webaudioRepl,
  when,
  whenKey,
  withValue,
  within,
  wrandcat,
  wt,
  wtatt,
  wtattack,
  wtdc,
  wtdec,
  wtdecay,
  wtdepth,
  wtenv,
  wtphaserand,
  wtrate,
  wtrel,
  wtrelease,
  wtshape,
  wtskew,
  wtsus,
  wtsustain,
  wtsync,
  xfade,
  xsdelay,
  zcrush,
  zdelay,
  zip,
  zipWith,
  zmod,
  znoise,
  zoom,
  zoomArc,
  zoomarc,
  zrand,
  zzfx
};
