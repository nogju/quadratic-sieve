var FiniteFieldFactory = require('./field/finite');

/**
 * Sieves for a factor base in the range [2, N].
 * We only want primes for which n is a quadratic residue, as we can sieve
 * solutions to Q(x) = n - x^2 for division by these primes efficiently.
 */
function factorBase(N, n) {
    let sieve = [];
    for (let i = 0; i <= N; i++)
        sieve.push(true);

    let results = [];
    for (let i = 2; i <= N; i++) {
        if (sieve[i]) {
            let Field = FiniteFieldFactory(i);
            if (new Field(n).isQuadraticResidue())
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
function naiveSmooth(A, B, n, base) {
    let Q = (x) => n - x*x;

    let sieve = [];
    for (let i = A; i <= B; i++)
        sieve.push(Math.abs(Q(i)));

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

        for (let j = Math.floor(A / base[i]); j <= B; j += base[i]) {
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
    factorBase: factorBase,
    smoothArguments: naiveSmooth
}
