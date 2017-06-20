var assert = require('assert');

/**
 * Ensures that the given matrix is formatted correctly - every row
 * must be the same length, and it must have at least one row.
 */
function isValid(matrix) {
    if (matrix.length == 0) return false;

    let noColumns = matrix[0].length;
    return matrix.filter((row) => row.length != noColumns).length == 0;
}

/**
 * Creates an empty matrix of the given dimensions.
 */
function create(noRows, noColumns) {
    assert.ok(noRows > 0 && noColumns > 0);

    var matrix = [];
    for (let i = 0; i < noRows; i++) {
        matrix.push([]);
        for (let j = 0; j < noColumns; j++)
            matrix[i].push(0);
    }

    return matrix;
}

/**
 * Creates an identity matrix of the given dimension.
 */
function identity(dimension) {
    assert.ok(dimension > 0);

    var matrix = create(dimension, dimension)
    for (let i = 0; i < dimension; i++)
        matrix[i][i] = 1;

    return matrix;
}

/**
 * Clones a given matrix.
 */
function clone(matrix) {
    assert.ok(isValid(matrix));
    let noColumns = matrix[0].length;
    let noRows    = matrix.length;

    var newMatrix = create(noRows, noColumns);
    for (let i = 0; i < noRows; i++) {
        for (let j = 0; j < noColumns; j++)
            newMatrix[i][j] = matrix[i][j];
    }

    return newMatrix;
}

/**
 *  Runs gaussian elimination on the given matrix of row vectors in Z_2.
 *  Returns the matrix in reduced row-echelon form, as well as the corresponding
 *  augmenting matrix for the elimination.
 */
function gaussianElimination(matrix) {
    assert.ok(isValid(matrix));
    let noColumns = matrix[0].length;
    let noRows    = matrix.length;
    let curRow    = 0;
    let augmentingMatrix = identity(noRows);
    let workingMatrix    = clone(matrix);

    // Util to add a times row_n to row_m.
    function addRows(a, n, m) {
        for (let i = 0; i < noColumns; i++)
            workingMatrix[m][i] += a * workingMatrix[n][i];

        for (let i = 0; i < noRows; i++)
            augmentingMatrix[m][i] += a * augmentingMatrix[n][i];
    }

    // Run the gaussian elimination column by column.
    for (let curCol = 0; curCol < noColumns; curCol++) {
        for (let row = curRow; row < noRows; row++) {
            if (workingMatrix[row][curCol] != 0) {
                if (row == curRow) continue;
                if (workingMatrix[curRow][curCol] == 0)
                    addRows(workingMatrix[row][curCol], row, curRow);

                addRows(-workingMatrix[row][curCol] / workingMatrix[curRow][curCol], curRow, row);
            }
        }

        if (workingMatrix[curRow][curCol] != 0)
            curRow++;
    }

    return {
        matrix: workingMatrix,
        augmentingMatrix: augmentingMatrix
    }
}

module.exports = {
    clone: clone,
    create: create,
    isValid: isValid,
    identity: identity,
    gaussianElimination: gaussianElimination
}
