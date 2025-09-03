/**
 * The test case data in JSON format.
 */
const testCase = {
  keys: {
    n: 10,
    k: 7,
  },
  1: {
    base: "6",
    value: "13444211440455345511",
  },
  2: {
    base: "15",
    value: "aed7015a346d635",
  },
  3: {
    base: "15",
    value: "6aeeb69631c227c",
  },
  4: {
    base: "16",
    value: "e1b5e05623d881f",
  },
  5: {
    base: "8",
    value: "316034514573652620673",
  },
  6: {
    base: "3",
    value: "2122212201122002221120200210011020220200",
  },
  7: {
    base: "3",
    value: "20120221122211000100210021102001201112121",
  },
  8: {
    base: "6",
    value: "20220554335330240002224253",
  },
  9: {
    base: "12",
    value: "45153788322a1255483",
  },
  10: {
    base: "7",
    value: "1101613130313526312514143",
  },
};

/**
 * Parses a string value of a given base into a BigInt.
 * @param {string} valueStr The string representation of the number.
 * @param {number|string} base The base of the number.
 * @returns {BigInt} The parsed BigInt value.
 */
function parseBigInt(valueStr, base) {
  const bigBase = BigInt(base);
  let result = 0n;
  for (let i = 0; i < valueStr.length; i++) {
    const char = valueStr[i];
    const digit = parseInt(char, base);
    result = result * bigBase + BigInt(digit);
  }
  return result;
}

/**
 * Solves for the polynomial coefficients using Gaussian elimination.
 * @param {object} jsonData The input data in JSON format.
 * @returns {BigInt[]} An array of the polynomial coefficients [a₀, a₁, ..., aₘ].
 */
function solvePolynomial(jsonData) {
  const k = jsonData.keys.k;
  const points = [];

  // 1. Parse the first 'k' points
  for (let i = 1; i <= k; i++) {
    const key = i.toString();
    const { base, value } = jsonData[key];
    points.push({
      x: BigInt(i),
      y: parseBigInt(value, base),
    });
  }

  // 2. Set up the augmented matrix
  const matrix = [];
  for (let i = 0; i < k; i++) {
    const row = [];
    for (let j = 0; j < k; j++) {
      row.push(points[i].x ** BigInt(j));
    }
    row.push(points[i].y);
    matrix.push(row);
  }

  // 3. Perform Gaussian elimination
  for (let i = 0; i < k; i++) {
    let pivotRow = i;
    while (pivotRow < k && matrix[pivotRow][i] === 0n) {
      pivotRow++;
    }
    if (pivotRow === k) continue;
    [matrix[i], matrix[pivotRow]] = [matrix[pivotRow], matrix[i]];

    for (let j = i + 1; j < k; j++) {
      const factor = matrix[j][i];
      const pivot = matrix[i][i];
      for (let col = i; col <= k; col++) {
        matrix[j][col] = matrix[j][col] * pivot - matrix[i][col] * factor;
      }
    }
  }

  // 4. Perform back substitution
  const coefficients = new Array(k).fill(0n);
  for (let i = k - 1; i >= 0; i--) {
    let sum = 0n;
    for (let j = i + 1; j < k; j++) {
      sum += matrix[i][j] * coefficients[j];
    }
    coefficients[i] = (matrix[i][k] - sum) / matrix[i][i];
  }

  return coefficients;
}

// --- Main Execution ---
const coefficients = solvePolynomial(testCase);

// The constant term is the first coefficient, a₀.
const constantTerm = coefficients[0];

// Print only the constant term.
console.log(constantTerm.toString());
