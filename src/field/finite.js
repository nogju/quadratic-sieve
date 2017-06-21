var Field = require('./field');

/**
 * Implements prime finite field arithmetic.
 */
function FiniteFieldFactory(order) {
    // Normalises the value to be the least positive residue.
    function normalise(value) {
        if (value < 0)
            return (value + Math.ceil(-value / order) * order) % order;

        return value % order;
    }

    function FiniteField(value) {
        this.value = normalise(value || 0);

        this.add = (x) => new FiniteField(this.value + x.value);
        this.subtract = (x) => new FiniteField(this.value - x.value);
        this.multiply = (x) => new FiniteField(this.value * x.value);
        this.divide = (x) => this.multiply(x.power(order - 2));
        this.equals = (x) => this.value == x.value;
        this.toString = () => this.value.toString();
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
