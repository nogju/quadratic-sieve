var Field = require('./field');

/**
 * Implements a basic wrapper around javascript numeric types.
 */
function NumericField(value) {
    this.value = value || 0;

    this.add = (x) => new NumericField(this.value + x.value);
    this.subtract = (x) => new NumericField(this.value - x.value);
    this.multiply = (x) => new NumericField(this.value * x.value);
    this.divide = (x) => new NumericField(this.value / x.value);
    this.power = (n) => new NumericField(this.value ** n);
    this.equals = (x) => this.value == x.value;
    this.toString = () => this.value.toString();
    this.additiveIdentity = NumericField.additiveIdentity;
    this.multiplicativeIdentity = NumericField.multiplicativeIdentity;
}

NumericField.prototype = new Field();
NumericField.additiveIdentity = () => new NumericField(0);
NumericField.multiplicativeIdentity = () => new NumericField(1);
NumericField.one = NumericField.multiplicativeIdentity;
NumericField.zero = NumericField.additiveIdentity;

module.exports = NumericField;
