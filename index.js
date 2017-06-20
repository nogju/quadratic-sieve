var Matrix = require('./src/matrix');
var Field = require('./src/field');

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

var a = new Field.Field();
