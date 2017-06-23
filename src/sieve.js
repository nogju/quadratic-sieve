var FiniteFieldFactory = require('./field/finite');

/**
 * Sieves for primes in the range [2, N] using the sieve of Erastosthenes.
 */
function primes(N) {
    let sieve = [];
    for (let i = 0; i <= N; i++)
        sieve.push(true);

    let results = [];
    for (let i = 2; i <= N; i++) {
        if (sieve[i]) {
            results.push(i);

            for (let j = 2*i; j <= N; j += i)
                sieve[j] = false;
        }
    }

    return results;
}

/**
 * Sieve for smooth values of Q(x) = n - x^2 for x in the range [A, B],
 * given a factor base to check smoothness over.
 *
 * TODO there are many ways to implement this - implement the log method and compare.
 */
naiveSmooth.Q = (x, n) => n - x*x;
function naiveSmooth(A, B, n, base) {
    let sieve = [];
    for (let i = A; i <= B; i++)
        sieve.push(Math.abs(naiveSmooth.Q(i, n)));

    for (let i = 0; i < base.length; i++) {
        // We sieve the function Q(x) = n - x^2 by computing n's roots mod p.
        let Field = FiniteFieldFactory(base[i]);
        let r1 = new Field(n).sqrt();
        let r2 = Field.zero().sub(r1);

        let sieveOut = (index) => {
            if (A <= index && index <= B)
                while(sieve[index - A] % base[i] == 0)
                    sieve[index - A] /= base[i];
        }

        for (let j = base[i] * Math.floor(A / base[i]); j <= B; j += base[i]) {
            sieveOut(j + r1.value);
            sieveOut(j + r2.value);
        }
    }

    let results = [];
    for (let i = 0; i < sieve.length; i++)
        if (sieve[i] == 1)
            results.push(A + i);

    return results;
}

module.exports = {
    primes: primes,
    smoothArguments: naiveSmooth
}
