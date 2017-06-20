var Field = require('./field');

/**
 * Implements a basic wrapper around javascript numeric types.
 */
function Numeric(value) {
    this.value = value || 0;

    this.add = (x) => new Numeric(this.value + x.value);
    this.subtract = (x) => new Numeric(this.value - x.value);
    this.multiply = (x) => new Numeric(this.value * x.value);
    this.divide = (x) => new Numeric(this.value / x.value);
    this.power = (n) => new Numeric(this.value ** n);
    this.additiveIdentity = Numeric.additiveIdentity;
    this.multiplicativeIdentity = Numeric.multiplicativeIdentity;
}

Numeric.prototype = new Field();
Numeric.additiveIdentity = () => new Numeric(0);
Numeric.multiplicativeIdentity = () => new Numeric(1);

module.exports = Numeric;
