/**
 * We want to implement algebra over arbitrary fields - the Field type acts
 * as a base class that implements field-independent operations.
 */
function Field() {
    if (Field.aliases) {
        Object
            .keys(Field.aliases)
            .forEach((key) => {
                this[key] = function() {
                    return this[Field.aliases[key]].apply(this, arguments)
                };
             });
    }

    // Basic integer power implementation.
    this.power = function(n) {
        let value = this.multiplicativeIdentity();

        if (n < 0) {
            value = value.additiveInverse();
            n = -n;
        }

        for (let i = 0; i < n; i++)
            value = value.multiply(this);

        return value;
    }

    this.additiveInverse = function() {
        return this
            .additiveIdentity()
            .subtract(this);
    }

    this.multiplicativeInverse = function() {
        return this
            .multiplicativeIdentity()
            .divide(this);
    }
}

// Aliases for function names defined on the Field instance.
Field.aliases = {
    pow: 'power',
    div: 'divide',
    mul: 'multiply',
    sub: 'subtract',
    neg: 'additiveInverse',
    zero: 'additiveIdentity',
    inv: 'multiplicativeInverse',
    one: 'multiplicativeIdentity'
}

module.exports = Field;
