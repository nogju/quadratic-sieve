var Matrix = require('./src/matrix');
var Numeric = require('./src/field/numeric');
var Finite = require('./src/field/finite');

var a = new Finite.Z7(2);
var b = new Finite.Z7(5);

console.log(a.multiply(b).value);
console.log(a.divide(b).value);
console.log(a.add(b).value);
console.log(a.subtract(b).value);
console.log(a.additiveIdentity().value);
console.log(a.multiplicativeIdentity().value);
console.log(a.additiveInverse().value);
console.log(a.multiplicativeInverse().value);

console.log();
console.log(a.mul(b).value);
console.log(a.div(b).value);
console.log(a.add(b).value);
console.log(a.sub(b).value);
console.log(a.zero().value);
console.log(a.one().value);
console.log(a.neg().value);
console.log(a.inv().value);
