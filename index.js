var MatrixFactory = require('./src/matrix');
var Numeric = require('./src/field/numeric');
var Finite = require('./src/field/finite');


var Field  = Finite.Z3;
var Matrix = MatrixFactory(Field);

var values = [[1, 1, 0], [0, 1, 1], [1, 0, 1]]
    .map((row) => row.map((value) => new Field(value)));

var matrix = new Matrix(values);
var reduct = matrix.gaussianReduction();

console.log(matrix.toString());
console.log();

console.log(reduct.matrix.toString());
console.log();

console.log(reduct.augmentingMatrix.toString())
