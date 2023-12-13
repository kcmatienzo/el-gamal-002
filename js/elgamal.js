/*
    El-Gamal function
*/
var ElGamal = (function () {
  var extendedEuclid,
    powmod,
    isPrime,
    isPrimitiveRoot,
    isValidPrivate,
    isValidEncryptKey,
    isValidMessage,
    validatePublicKeyFields,
    validateEncryptFields,
    Api;

  function extendedEuclid(base, mod) {
    let x = 1,
      y = 0;
    let t1 = 0,
      t2 = 1;
    let quotient, tempX, tempY, temp;
    let r1 = base,
      r2 = mod;

    while (r2 !== 0) {
      quotient = Math.floor(r1 / r2);

      tempX = x - quotient * t1;
      tempY = y - quotient * t2;
      temp = r1 - quotient * r2;

      x = t1;
      y = t2;
      r1 = r2;

      t1 = tempX;
      t2 = tempY;
      r2 = temp;
    }
    console.log(
      `(p-1): ${mod}, inverse of k: ${mod + x}, GCD(${base}, ${mod}) = 1)`
    );
    return { gcd: r1, x: x, y: y };
  }

  powmod = function (base, exp, modulus) {
    var accum = 1,
      i = 0,
      basepow2 = base;
    if (exp === -1) {
      return extendedEuclid(base, modulus).x;
    }
    while (exp >> i > 0) {
      if (((exp >> i) & 1) === 1) accum = (accum * basepow2) % modulus;
      basepow2 = (basepow2 * basepow2) % modulus;
      i += 1;
    }
    return accum;
  };

  isPrime = function (
    p /*
      Checking if number is prime
  */
  ) {
    var i;
    if (p === 1) return false;

    for (i = 2; i * i <= p; i++) if (p % i === 0) return false;

    return true;
  };

  isPrimitiveRoot = function (g, p) {
    var o = 1,
      k = powmod(g, o, p);
    while (k > 1) {
      o++;
      k *= g;
      k %= p;
    }
    if (o === p - 1) return true;
    return false;
  };

  isValidPrivate = function (x, p) {
    return x > 0 && x < p - 1;
  };

  isValidEncryptKey = function (y, p) {
    return y >= 0 && y < p - 1;
  };

  isValidMessage = function (m, p) {
    return m > 0 && m < p;
  };

  validatePublicKeyFields = function (g, x, p) {
    var errors = [];
    if (!isPrime(p)) errors.push("NOT_PRIME");
    if (!isPrimitiveRoot(g, p)) errors.push("NOT_ROOT");
    if (!isValidPrivate(x, p)) errors.push("INVALID_KEY");
    return errors;
  };

  validateEncryptFields = function (m, y, p) {
    var errors = [];
    if (!isValidEncryptKey(y, p)) errors.push("INVALID_ENC_KEY");
    if (!isValidMessage(m, p)) errors.push("INVALID_MSG");
    return errors;
  };

  Api = function (p, g, x) {
    this.p = p;
    this.g = g;
    this.x = x;
  };

  Api.prototype.getPublicKey = function () {
    var errors = validatePublicKeyFields(this.g, this.x, this.p),
      h;
    if (errors.length > 0) throw errors;
    h = powmod(this.g, this.x, this.p);
    return {
      p: this.p,
      g: this.g,
      h: h,
    };
  };

  Api.prototype.decrypt = function (m) {
    var ay = powmod(m.b, this.x, this.p),
      s;

    s = (powmod(ay, -1, this.p) * m.c) % this.p;
    s = s < 0 ? s + this.p : s;
    return s;
  };

  Api.getAllRoots = function (p) {
    var r,
      roots = [];

    if (!isPrime(p)) throw Error("Please enter a valid prime number.");

    for (r = 2; r < p; r += 1);
    if (isPrimitiveRoot(r, p)) roots.push(r);

    return roots;
  };

  Api.getAllRootsAsync = function (p, work) {
    var r = 2;

    if (!isPrime(p)) {
      throw Error("Please enter a valid prime number.");
    }

    (function loop() {
      var j,
        roots = [];
      for (j = 0; j + r < p || j < 20; j += 1) {
        if (isPrimitiveRoot(r, p)) {
          roots.push(r);
        }
        r += 1;
      }
      work(roots);

      if (j + r < p) {
        setTimeout(loop, 24);
      }
    })();

    return 0;
  };

  Api.encrypt = function (m, y, publicKey) {
    var errors = validateEncryptFields(m, y, publicKey.p);
    if (errors.length > 0) {
      throw errors;
    }
    return {
      b: powmod(publicKey.g, y, publicKey.p),
      c: (m * powmod(publicKey.h, y, publicKey.p)) % publicKey.p,
    };
  };

  Api.sign = function (m, k, x, publicKey) {
    var r_ = powmod(publicKey.g, k, publicKey.p);
    var s_ =
      ((m - x * r_) * powmod(k, -1, publicKey.p - 1)) % (publicKey.p - 1);
    return {
      m: m,
      r: r_,
      s: s_,
    };
  };

  Api.sign2 = function (m, k, x, g, p) {
    var r_ = powmod(g, k, p);
    var s_ = ((m - x * r_) * powmod(k, -1, p - 1)) % (p - 1);
    return {
      m: m,
      r: r_,
      s: s_,
    };
  };

  Api.is_valid2 = function (m, r, s, y, g, p) {
    if ((powmod(y, r, p) * powmod(r, s, p)) % p === powmod(g, m, p))
      return "\nThe signature is correct";
    else return "Incorrect signature";
  };
  Api.is_valid3 = function (m, r, s, y, g, p) {
    return {
      a: (powmod(y, r, p) * powmod(r, s, p)) % p,
      b: powmod(g, m, p),
    };
  };

  Api.is_valid = function (msg, publicKey) {
    if (
      (powmod(publicKey.h, msg.r, publicKey.p) *
        powmod(msg.r, msg.s, publicKey.p)) %
        publicKey.p ===
      powmod(publicKey.g, msg.m, publicKey.p)
    )
      return "The signature is correct";
    else return "Incorrect signature";
  };
  return Api;
})();
