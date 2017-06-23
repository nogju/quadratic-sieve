var FiniteFieldFactory = require('./field/finite');
var assert = require('assert');

/**
 * Implements the Miller-Rabin probabalistic primality test, with repetition
 * as doing it once has a chance of a false positive with probability < 25%.
 */
function millerRabin(n, repeats) {
    assert(n > 0);
    if (n === 1) return false;
    if (n === 2) return true;

    repeats = repeats || 20;
    if (repeats === 0) return true;

    let Field = FiniteFieldFactory(n);
    let Q = n - 1;
    let S = 1;
    while(Q%2 == 0) {
        Q /= 2;
        S *= 2;
    }

    let a = new Field(Math.floor(2 + Math.random()*(n - 2))).power(Q);
    if (a.equals(Field.one())) return millerRabin(n, repeats - 1);

    while(S > 1) {
        if (a.equals(Field.one().neg())) return millerRabin(n, repeats - 1);
        S /= 2;
        a = a.mul(a);
    }

    return false;
}

/**
 * Checks if the input is a power.
 */
function isPower(n) {
    let possibleExponents = Math.ceil( Math.log2(n) );
    for (let i = 2; i <= possibleExponents; i++) {
        let n_prime = Math.round( Math.pow(n, 1/i) );
        if (n == Math.round( Math.pow(n_prime, i) ))
            return true;
    }

    return false;
}

module.exports = {
    isPrime: millerRabin,
    isPower: isPower
}
