var Matrix = require('./src/matrix');
var Numeric = require('./src/field/numeric');

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

var b = new Numeric(3);
console.log(b.neg().value);
