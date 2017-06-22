var MatrixFactory = require('./src/matrix');
var Numeric = require('./src/field/numeric');
var Finite = require('./src/field/finite');

var Field = Finite(191);
var x = new Field(180);

console.log(x.sqrt());
