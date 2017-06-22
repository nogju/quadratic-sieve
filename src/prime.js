var FiniteFieldFactory = require('./field/finite');
var assert = require('assert');

/**
 * Implements the Miller-Rabin probabalistic primality test.
 */
function millerRabin(n) {
    assert(n > 0);
    if (n === 1) return false;
    if (n === 2) return true;

    let Field = FiniteFieldFactory(n);
    let Q = n - 1;
    let S = 1;
    while(Q%2 == 0) {
        Q /= 2;
        S *= 2;
    }

    let a = new Field(Math.floor(2 + Math.random()*(n - 2))).power(Q);
    if (a.equals(Field.one())) return true;

    while(S > 1) {
        if (a.equals(Field.one().neg())) return true;
        S /= 2;
        a = a.mul(a);
    }

    return false;
}

module.exports = {
    millerRabin: millerRabin
}
