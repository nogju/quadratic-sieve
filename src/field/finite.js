var Field = require('./field');

/**
 * Implements prime finite field arithmetic.
 */
function Finite(order) {
    // Normalises the value to be the least positive residue.
    function normalise(value) {
        if (value < 0)
            return (value + Math.ceil(-value / order) * order) % order;

        return value % order;
    }

    function create(value) {
        var parent = new Field();
        parent.value = normalise(value || 0);
        parent.add = add.bind(parent);
        parent.divide = divide.bind(parent);
        parent.subtract = subtract.bind(parent);
        parent.multiply = multiply.bind(parent);
        parent.additiveIdentity = create.additiveIdentity;
        parent.multiplicativeIdentity = create.multiplicativeIdentity;

        return parent;

        function add(x) {
            return new create(this.value + x.value);
        }

        function subtract(x) {
            return new create(this.value - x.value);
        }

        function multiply(x) {
            return new create(this.value * x.value);
        }

        function divide(x) {
            return this.multiply(x.power(order - 2));
        }
    }

    // Basic identity elements.
    create.additiveIdentity = () => new create(0);
    create.multiplicativeIdentity = () => new create(1);

    return create;
}

// Common finite fields added as utilities.
Finite.Z2 = Finite(2);
Finite.Z3 = Finite(3);

module.exports = Finite;
