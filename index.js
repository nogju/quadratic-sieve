var MatrixFactory = require('./src/matrix');
var Numeric = require('./src/field/numeric');
var Finite = require('./src/field/finite');
var Sieve = require('./src/sieve');

let n = 113;
let Q = (x) => n - x*x;

let factorBase = Sieve.factorBase(100, n);
console.log("Factor Base:");
console.log(factorBase);
console.log();

let smoothArguments = Sieve.smoothArguments(1, 20, n, factorBase);
let smoothValues = smoothArguments.map(Q);

console.log("Smooth Arguments:");
console.log(smoothArguments);
console.log();

console.log("Smooth Values:");
console.log(smoothValues);
console.log();
