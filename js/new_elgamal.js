
const powmod = (base, exp, modulus) => {
    var result = 1;
    base = base % modulus

    while (exp > 0) {
        if (exp % 2 === 1) {
            result = (result * base) % modulus;
        }
        exp = Math.floor(exp / 2);
        base = (base * base) % modulus;
    }
    return result
}

const Factorization = (n) => {
    let factors = [];
    for (let i = 2; i * i <= n; i++) {
        factors.push(i);
        n /= i;
    }

    if (n > 1) {
        factors.push(n);
    }
    return factors;
}

const isGenerator = (g, p) => {
    const factors = Factorization(p-1);
    for (const q of factors) {
        if (powmod(g, (p-1)/q. p) === 1) {
            return false;
        }
    }
    return true;
}

function isPrimitiveRoot(g, p) {
    let values = new Set();
    let result = 1;

    for (let i = 0; i < p - 1; i++) {
        result = (result * g) % p;
        values.add(result);
    }

    return [values.size === p - 1, values];
}

function findPrimitiveRoot(p) {
    for (let g = 2; g < p; g++) {
        if (isPrimitiveRoot(g, p)[0]) {
            return g;
        }
    }

    return -1;
}
const extendedEuclidean = (largeNumber, number) => {
    var rows = []
    var rOne = largeNumber,
    rTwo = number, 
    reminder,
    t1 = 0, 
    t2 = 1,
    t;
    while (reminder !== 0) {
      q = Math.floor(rOne / rTwo);
      reminder = Math.floor(rOne % rTwo);
      t = t1 - t2 * q;
      rows.push({q: q, R1: rOne, R2: rTwo, r: reminder, t1: t1, t2: t2, t:t})
      rOne = rTwo;
      rTwo = reminder;
      t1 = t2;
      t2=t;
      
    }
    return [rows, t2]
}


const isPrime = (p) =>  {
    var i;
    if (p === 1) return false;

    for (i = 2; i * i <= p; i++) 
    {
      if (p % i === 0) 
      {
        return false;
      }
    }
    return true;
};

const gcd = (k, p) => {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a
}

// Encryption Process 

const cipherCycle = (g, key, p) => {
    cOne = powmod(g, key, p)
    return cOne
}

const cipherCycleSecond = (m, y, key, p) => {
    cTwo = powmod(m*y, key, p)
    return cTwo
}