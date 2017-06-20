var Matrix = require('./src/matrix');
var Numeric = require('./src/field/numeric');
var Finite = require('./src/field/finite');

var matrix =[
    [1, 0, 1],
    [1, 1, 1],
    [0, 1, 1],
    [1, 0, 0]
];


console.log(matrix);
console.log();

var elimination = Matrix.gaussianElimination(matrix);
console.log(elimination.matrix);
console.log(elimination.augmentingMatrix);

var a = new Finite.Z2(-11);
var b = new Finite.Z2(-6);
console.log(b.multiply(a).value);
