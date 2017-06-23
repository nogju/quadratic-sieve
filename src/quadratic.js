var FiniteFieldFactory = require('./field/finite');
var MatrixFactory = require('./matrix');
var Sieve = require('./sieve');
var assert = require('assert');
var Z2 = FiniteFieldFactory.Z2;
var Z2Matrix = MatrixFactory(Z2);

/**
 * Implements the Miller-Rabin probabalistic primality test, with repetition
 * as doing it once has a chance of a false positive with probability < 25%.
 */
function isPrime(n, repeats) {
    assert(n > 0);
    if (n === 1) return false;
    if (n === 2) return true;

    if (repeats === 0) return true;
    repeats = repeats || 20;

    let Field = FiniteFieldFactory(n);
    let Q = n - 1;
    let S = 1;
    while(Q%2 == 0) {
        Q /= 2;
        S *= 2;
    }

    let a = new Field(Math.floor(2 + Math.random()*(n - 2))).power(Q);
    if (a.equals(Field.one())) return isPrime(n, repeats - 1);

    while(S > 1) {
        if (a.equals(Field.one().neg())) return isPrime(n, repeats - 1);
        S /= 2;
        a = a.mul(a);
    }

    return false;
}

/**
 * Checks if the input is a power, returning a factor if it is, else false.
 */
function isPower(n) {
    assert(n > 0);

    let possibleExponents = Math.ceil( Math.log2(n) );
    for (let i = 2; i <= possibleExponents; i++) {
        let n_prime = Math.round( Math.pow(n, 1/i) );
        if (n == Math.round( Math.pow(n_prime, i) ))
            return n_prime;
    }

    return false;
}

/**
 * Runs trial division with integers up to N on n, returning either a factor
 * if one exists or false.
 */
function trialDivision(N, n) {
    assert(n > 0);

    for (let i = 2; i <= N && i <= n; i++)
        if (n%i == 0)
            return i;

    return false;
}

/**
 * Returns a function which checks if n is a quadratic residue mod the prime p.
 */
function hasAsQuadraticResidue(n) {
    return (p) => {
        var Field = FiniteFieldFactory(p);
        return new Field(n).isQuadraticResidue();
    }
}

/**
 * Construct exponent vector for n over the given factor base.
 * We include an extra dimension for the sign.
 */
function exponentVector(n, base) {
    let vector = [ n < 0 ? Z2.one() : Z2.zero() ];
    n = n < 0 ? -n : n;

    for (let i = 0; i < base.length; i++) {
        let exponent = 0;
        while(n%base[i] == 0) {
            n /= base[i];
            exponent++;
        }

        vector.push(new Z2(exponent));
    }

    return vector;
}

/**
 * Euclidean algorithm for computing the gcd of two numbers.
 */
function gcd(a, b) {
    if (b === 0) return a;
    return gcd(b, a%b);
}

/**
 * An implementatin of the quadratic sieve factorisation algorithm.
 * Returns a non-trivial factor of n if one exists, or false.
 */
module.exports = function(n) {
    assert(n > 0);

    // Try simple methods to see if n falls without heavy machinery.
    let trialFactor = trialDivision(Math.ceil( Math.log(n) ), n);
    let powerFactor = isPower(n);
    if (powerFactor) return powerFactor;
    if (trialFactor) return trialFactor;
    if (isPrime(n)) return false;

    // See "The Role of Smooth Numbers in Number Theoretic Algorithms" by Pomerance.
    // L(x)^{ \frac{\sqrt 2}{2} } is the theoretical optimal value for y when
    // sieving Q(x) for y-smoothness.
    let Q = Sieve.smoothArguments.Q;
    let L = (x) => Math.exp( Math.sqrt( Math.log(x) * Math.log(Math.log(x)) ) )
    let y = Math.ceil( Math.pow(L(n), Math.sqrt(2)/2) );

    // Construct our factor base and sieve until we get enough integers.
    // We can optimise by removing primes for which n is NOT a quadratic
    // residue, as Q(x) will never be divisible by these primes for any x.
    let sieveStart = 1;
    let sieveInterval = 1000;
    let smoothArguments = [];
    let factorBase = Sieve.primes(y).filter(hasAsQuadraticResidue(n));
    while(smoothArguments.length <= factorBase.length + 2) {
        smoothArguments = smoothArguments.concat( Sieve.smoothArguments(sieveStart, sieveStart + sieveInterval, n, factorBase) );
        sieveStart += sieveInterval + 1;
    }

    // Find product of values that give us squares.
    let smoothValues = smoothArguments.map((x) => Q(x, n));
    let exponentMatrix = new Z2Matrix( smoothValues.map((x) => exponentVector(x, factorBase)) )
    let kernelBasis = exponentMatrix.kernelBasis();

    console.log("N: " + n);
    console.log("Y: " + y);
    console.log("Factor base: " + factorBase);
    console.log("Smooth arguments: " + smoothArguments);
    console.log("Smooth values: " + smoothValues);

    console.log();
    console.log("Kernel basis: \n" + kernelBasis.join('\n'));

    // Compute (hopefully!) a non-trivial factor of n.
    for (let i = 0; i < kernelBasis.length; i++) {
        let x = 1, y = 1;

        for (let j = 0; j < kernelBasis[i].length; j++) {
            if (kernelBasis[i][j].equals(Z2.one())) {
                x *= smoothValues[j];
                y *= smoothArguments[j];
            }
        }

        x = Math.round(Math.sqrt(x));
        let factor = gcd(x + y, n);

        if (factor > 1 && factor < n)
            return factor;
    }
}
