var assert = require('assert');

// Construct a matrix factory over the given field.
function MatrixFactory(field) {
    function Matrix(values) {
        assert(isValid());
        this.field = field;
        this.values = values;

        // Ensure that the passed in matrix data is formatted correctly.
        function isValid() {
            if (values.length == 0) return false;

            let noColumns = values[0].length;
            if (values.filter((row) => row.length != noColumns).length != 0)
                return false;


            for (let i = 0; i < values.length; i++) {
                for (let j = 0; j < noColumns; j++) {
                    if (!(values[i][j] && values[i][j] instanceof field))
                        return false;
                }
            }

            return true;
        }

        /**
         * Creates an empty matrix of the given dimensions.
         */
        this.zero = function(noRows, noColumns) {
            assert(noRows > 0 && noColumns > 0);

            var matrix = [];
            for (let i = 0; i < noRows; i++) {
                matrix.push([]);
                for (let j = 0; j < noColumns; j++)
                    matrix[i].push(this.field.additiveIdentity());
            }

            return new Matrix(matrix);
        }

        /**
         * Creates an identity matrix of the given dimension.
         */
        this.one = function(dimension) {
            assert(dimension > 0);

            var matrix = this.zero(dimension, dimension)
            for (let i = 0; i < dimension; i++)
                matrix.values[i][i] = this.field.multiplicativeIdentity();

            return matrix;
        }

        /**
         * Clones a given matrix.
         */
        this.clone = function() {
            let noColumns = this.values[0].length;
            let noRows    = this.values.length;

            var matrix = this.zero(noRows, noColumns);
            for (let i = 0; i < noRows; i++) {
                for (let j = 0; j < noColumns; j++)
                    matrix.values[i][j] = new this.field(this.values[i][j].value); // TODO CLUDGE FOR NOW
            }

            return matrix;
        }

        this.toString = function() {
            let cellToString = (x) => x.toString();
            let rowToString = (row) => row.map(cellToString).join(' ');
            
            return this.values.map(rowToString).join('\n');
        }

        /**
         *  Runs gaussian reduction on the given matrix of row vectors in Z_2.
         *  Returns the matrix in reduced row-echelon form, as well as the corresponding
         *  augmenting matrix for the elimination.
         */
        this.gaussianReduction = function() {
            let noColumns = this.values[0].length;
            let noRows    = this.values.length;
            let curRow    = 0;
            let augmentingMatrix = this.one(noRows);
            let workingMatrix    = this.clone();

            // Util to add a times row_n to row_m.
            function addRows(a, n, m) {
                for (let i = 0; i < noColumns; i++)
                    workingMatrix.values[m][i] = workingMatrix.values[m][i].add( workingMatrix.values[n][i].mul(a) );

                for (let i = 0; i < noRows; i++)
                    augmentingMatrix.values[m][i] = augmentingMatrix.values[m][i].add( augmentingMatrix.values[n][i].mul(a) );
            }

            // Run the gaussian elimination column by column.
            for (let curCol = 0; curCol < noColumns; curCol++) {
                for (let row = curRow; row < noRows; row++) {
                    if (!workingMatrix.values[row][curCol].equals( this.field.zero() )) {
                        if (row == curRow) continue;
                        if (workingMatrix.values[curRow][curCol].equals( this.field.zero()) )
                            addRows(workingMatrix.values[row][curCol], row, curRow);

                        addRows(workingMatrix.values[row][curCol].neg().div( workingMatrix.values[curRow][curCol] ), curRow, row);
                    }
                }

                if (!workingMatrix.values[curRow][curCol].equals( this.field.zero() ))
                    curRow++;
            }

            return {
                matrix: workingMatrix,
                augmentingMatrix: augmentingMatrix
            }
        }
    }

    return Matrix;
}

module.exports = MatrixFactory;
