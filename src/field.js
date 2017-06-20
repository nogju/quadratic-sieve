/**
 * We want to implement algebra over arbitrary fields - the Field type acts
 * as a base class that implements field-independent operations.
 */
function Field() {
    this.additiveInverse = additiveInverse.bind(this);
    this.multiplicativeInverse = multiplicativeInverse.bind(this);

    if (Field.aliases) {
        Object
            .keys(Field.aliases)
            .forEach((key) => {
                this[key] = () => this[Field.aliases[key]].apply(this, arguments);
             });
    }

    function additiveInverse(x) {
        return this
            .additiveIdentity
            .subtract(x);
    }

    function multiplicativeInverse(x) {
        return this
            .multiplicativeIdentity
            .divide(x);
    }
}

// Aliases for function names defined on the Field instance.
Field.aliases = {
    div: 'divide',
    mul: 'multiply',
    sub: 'subtract',
    neg: 'additiveInverse',
    inv: 'multiplicativeInverse'
}

module.exports = {
    Field: Field
}
