// roots.js
const { create, all } = require("mathjs");

// 1. Create a local, configurable instance of math.js
const math = create(all);

// 2. Apply configuration to the local instance for high precision
math.config({
  number: "BigNumber",
  precision: 128,
});

/**
 * Parses a string representation of a number in an arbitrary base into a BigInt.
 */
function parseBigIntBaseN(valueStr, base) {
  const baseN = BigInt(base);
  let result = 0n; // Use 'n' to denote a BigInt literal
  const digitMap = "0123456789abcdefghijklmnopqrstuvwxyz";

  for (const char of valueStr.toLowerCase()) {
    const digitValue = BigInt(digitMap.indexOf(char));
    if (digitValue < 0 || digitValue >= baseN) {
      throw new Error(`Invalid character '${char}' for base ${base}`);
    }
    result = result * baseN + digitValue;
  }
  return result;
}

/**
 * Calculates the coefficients of a polynomial from a JSON string.
 */
function solvePolynomialCoefficients(jsonString) {
  const data = JSON.parse(jsonString);
  const k = data.keys.k;

  const x_points = [];
  const y_points = [];

  for (let i = 1; i <= k; i++) {
    const key = String(i);
    const pointData = data[key];

    x_points.push(i);
    const y_val = parseBigIntBaseN(
      pointData.value,
      parseInt(pointData.base, 10)
    );
    y_points.push(y_val);
  }

  const A = [];
  for (const x of x_points) {
    const row = [];
    for (let power = 0; power < k; power++) {
      row.push(math.bignumber(x).pow(power));
    }
    A.push(row);
  }
  const y_vector = y_points.map((val) => math.bignumber(val.toString()));

  // Solve the system A*c = y
  const coeffsMatrix = math.lusolve(A, y_vector);

  // Convert the result to a clean array of BigInts
  const coefficients = coeffsMatrix.flat().map((c) => {
    return BigInt(c.toFixed(0));
  });

  return coefficients;
}

// --- Main execution block ---

const secondTestCaseJson = `{
    "keys": { "n": 10, "k": 7 },
    "1": { "base": "6", "value": "13444211440455345511" },
    "2": { "base": "15", "value": "aed7015a346d635" },
    "3": { "base": "15", "value": "6aeeb69631c227c" },
    "4": { "base": "16", "value": "e1b5e05623d881f" },
    "5": { "base": "8", "value": "316034514573652620673" },
    "6": { "base": "3", "value": "2122212201122002221120200210011020220200" },
    "7": { "base": "3", "value": "20120221122211000100210021102001201112121" },
    "8": { "base": "6", "value": "20220554335330240002224253" },
    "9": { "base": "12", "value": "45153788322a1255483" },
    "10": { "base": "7", "value": "1101613130313526312514143" }
}`;

const coefficients = solvePolynomialCoefficients(secondTestCaseJson);
const degree = coefficients.length - 1;

console.log(coefficients[0]);
