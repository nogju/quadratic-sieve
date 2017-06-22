var Field = require('./field');
var assert = require('assert');

/**
 * Implements prime finite field arithmetic.
 */
function FiniteFieldFactory(order) {
    //TODO verify order is prime

    // Normalises the value to be the least positive residue.
    function normalise(value) {
        if (value < 0)
            return (value + Math.ceil(-value / order) * order) % order;

        return value % order;
    }

    function FiniteField(value) {
        if (value instanceof FiniteField)
            return new FiniteField(value.value);

        this.value = normalise(value || 0);

        this.add = (x) => new FiniteField(this.value + x.value);
        this.subtract = (x) => new FiniteField(this.value - x.value);
        this.multiply = (x) => new FiniteField(this.value * x.value);
        this.divide = (x) => this.multiply(x.power(order - 2));
        this.equals = (x) => this.value == x.value;
        this.toString = () => this.value.toString();

        // Fast exponentiation by squaring.
        this.power = function(n) {
            // Only integer powers should be given.
            assert(n === Math.round(n));

            if (n < 0) return this.multiplicativeInverse().power(-n);
            if (n == 0) return FiniteField.multiplicativeIdentity();
            if (n == 1) return new FiniteField(this);

            if (n%2 == 0) return this.multiply(this).power(n / 2);
            else          return this.multiply(this).power((n-1) / 2).multiply(this);
        }

        // Euler's criterion for determining whether we have a root.
        this.isQuadraticResidue = function() {
            // Z2 is still special.
            if (order === 2)
                return this.value === 1;

            return this.power((order - 1) / 2).equals(FiniteField.multiplicativeIdentity());
        }

        // Uses the Tonelli-Shanks algorithm for computing roots.
        this.sqrt = function() {
            assert(this.isQuadraticResidue());

            // Z2 is special.
            if (order === 2)
                return new FiniteField(this);

            // Find a non-residue as our fudge value.
            let g = new FiniteField(2);
            while(g.isQuadraticResidue())
                g = g.add(FiniteField.multiplicativeIdentity());

            // Factorise p-1 as p-1 = QS where Q is odd and S a 2-power.
            let S = 1;
            let Q = order - 1;
            while(Q % 2 == 0) {
                Q /= 2;
                S *= 2;
            }

            // Construct auxilliary variables and run the algorithm.
            let R = this.power((Q+1) / 2);
            let t = this.power(Q);
            let c = g.power(Q);
            let m = S;

            while(m > 1) {
                // Find order of t, which is necessarily a 2-power.
                let i = 1;
                let _t = new FiniteField(t);
                while(!_t.equals(FiniteField.multiplicativeIdentity())) {
                    i *= 2;
                    _t = _t.multiply(_t);
                }

                // Should never have a situation where order doesn't decrease.
                assert(i < m);

                // We've found our root!
                if (i == 1)
                    return R;

                // Restrict to a smaller 2-subgroup.
                let b = c.power(m / i / 2);
                R = R.multiply(b);
                c = b.multiply(b);
                t = t.multiply(c);
                m = i;
            }

            // Should never reach here.
            assert(false);
        }

        this.additiveIdentity = FiniteField.additiveIdentity;
        this.multiplicativeIdentity = FiniteField.multiplicativeIdentity;
    }

    FiniteField.prototype = new Field();
    FiniteField.additiveIdentity = () => new FiniteField(0);
    FiniteField.multiplicativeIdentity = () => new FiniteField(1);
    FiniteField.one = FiniteField.multiplicativeIdentity;
    FiniteField.zero = FiniteField.additiveIdentity;

    return FiniteField;
}

// Common finite fields added as utilities.
FiniteFieldFactory.Z2 = FiniteFieldFactory(2);
FiniteFieldFactory.Z3 = FiniteFieldFactory(3);
FiniteFieldFactory.Z5 = FiniteFieldFactory(5);
FiniteFieldFactory.Z7 = FiniteFieldFactory(7);

module.exports = FiniteFieldFactory;
