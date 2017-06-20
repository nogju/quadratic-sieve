var Field = require('./field');

/**
 * Implements a basic wrapper around javascript numeric types.
 */
function Numeric(value) {
    var parent = new Field();
    parent.value = value || 0;
    parent.add = add.bind(parent);
    parent.divide = divide.bind(parent);
    parent.subtract = subtract.bind(parent);
    parent.multiply = multiply.bind(parent);
    parent.additiveIdentity = Numeric.additiveIdentity;
    parent.multiplicativeIdentity = Numeric.multiplicativeIdentity;

    return parent;

    function add(x) {
        return new Numeric(this.value + x.value);
    }

    function subtract(x) {
        return new Numeric(this.value - x.value);
    }

    function multiply(x) {
        return new Numeric(this.value * x.value);
    }

    function divide(x) {
        return new Numeric(this.value / x.value);
    }
}

// Basic identity elements.
Numeric.additiveIdentity = () => new Numeric(0);
Numeric.multiplicativeIdentity = () => new Numeric(1);

module.exports = Numeric;
