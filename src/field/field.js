/**
 * We want to implement algebra over arbitrary fields - the Field type acts
 * as a base class that implements field-independent operations.
 */
function Field() {
    this.power = power.bind(this);
    this.additiveInverse = additiveInverse.bind(this);
    this.multiplicativeInverse = multiplicativeInverse.bind(this);

    if (Field.aliases) {
        Object
            .keys(Field.aliases)
            .forEach((key) => {
                console.log(this);
                this[key] = () => this[Field.aliases[key]].apply(this, arguments);
             });
    }

    // Basic integer power implementation.
    function power(n) {
        let value = this.multiplicativeIdentity();

        if (n < 0) {
            value = value.additiveInverse();
            n = -n;
        }

        for (let i = 0; i < n; i++)
            value = value.multiply(this);

        return value;
    }

    function additiveInverse() {
        return this
            .additiveIdentity()
            .subtract(this);
    }

    function multiplicativeInverse() {
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
