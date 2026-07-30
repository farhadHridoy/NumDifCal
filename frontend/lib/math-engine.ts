/**
 * Client-side Mathematical Engine
 *
 * Implements Newton Forward and Newton Backward Difference Methods
 * for numerical differentiation. This is a self-contained engine
 * that runs entirely in the browser for instant results.
 */

import type {
  CalculationResult,
  CalculationStep,
  DifferenceTableRow,
  DifferenceTableResult,
  DerivativeTerm,
} from '@/types/calculator';

// ════════════════════════════════════════════════════════════
// Public API
// ════════════════════════════════════════════════════════════

/**
 * Compute the first derivative using Newton's Forward Difference formula.
 */
export function computeNewtonForward(
  xValues: number[],
  yValues: number[],
  targetX: number,
  derivativeOrder: 1 | 2 = 1,
): CalculationResult {
  const startTime = performance.now();

  validateInputs(xValues, yValues);

  const n = xValues.length;
  const h = computeH(xValues);
  const u = (targetX - xValues[0]) / h;

  const rawTable = buildRawDifferenceTable(yValues);
  const displayTable = buildDisplayTable(xValues, yValues, rawTable);

  let derivative = 0;
  const terms: DerivativeTerm[] = [];

  for (let k = 1; k < n; k++) {
    const coeff = forwardDerivativeCoefficient(u, k, derivativeOrder);
    const diff = rawTable[k][0];
    const termValue = coeff * diff;
    derivative += termValue;

    if (coeff !== 0 || k === 1) { // Only add non-zero terms (k=1 is 0 for 2nd deriv)
      terms.push({
        order: k,
        coefficientFormula: forwardCoefficientKaTeX(k, derivativeOrder),
        coefficientValue: coeff,
        differenceSymbol: `\\Delta${k > 1 ? `^{${k}}` : ''} y_0`,
        differenceValue: diff,
        termValue,
      });
    }
  }

  derivative /= (derivativeOrder === 2 ? h * h : h);

  const steps = buildForwardSteps(xValues, yValues, targetX, h, u, rawTable, terms, derivative, derivativeOrder);
  const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(4));

  return {
    method: 'newton-forward',
    xValues,
    yValues,
    targetX,
    h,
    u,
    derivativeOrder,
    derivative: roundTo(derivative, 10),
    differenceTable: displayTable,
    rawDifferenceTable: rawTable,
    terms,
    steps,
    formula: forwardFormulaKaTeX(n - 1, derivativeOrder),
    executionTimeMs,
  };
}

/**
 * Compute the first derivative using Newton's Backward Difference formula.
 */
export function computeNewtonBackward(
  xValues: number[],
  yValues: number[],
  targetX: number,
  derivativeOrder: 1 | 2 = 1,
): CalculationResult {
  const startTime = performance.now();

  validateInputs(xValues, yValues);

  const n = xValues.length;
  const h = computeH(xValues);
  const u = (targetX - xValues[n - 1]) / h;

  const rawTable = buildRawDifferenceTable(yValues);
  const displayTable = buildDisplayTable(xValues, yValues, rawTable);

  let derivative = 0;
  const terms: DerivativeTerm[] = [];

  for (let k = 1; k < n; k++) {
    const coeff = backwardDerivativeCoefficient(u, k, derivativeOrder);
    const diff = rawTable[k][n - 1 - k];
    const termValue = coeff * diff;
    derivative += termValue;

    if (coeff !== 0 || k === 1) {
      terms.push({
        order: k,
        coefficientFormula: backwardCoefficientKaTeX(k, derivativeOrder),
        coefficientValue: coeff,
        differenceSymbol: `\\nabla${k > 1 ? `^{${k}}` : ''} y_{n}`,
        differenceValue: diff,
        termValue,
      });
    }
  }

  derivative /= (derivativeOrder === 2 ? h * h : h);

  const steps = buildBackwardSteps(xValues, yValues, targetX, h, u, rawTable, terms, derivative, n, derivativeOrder);
  const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(4));

  return {
    method: 'newton-backward',
    xValues,
    yValues,
    targetX,
    h,
    u,
    derivativeOrder,
    derivative: roundTo(derivative, 10),
    differenceTable: displayTable,
    rawDifferenceTable: rawTable,
    terms,
    steps,
    formula: backwardFormulaKaTeX(n - 1, derivativeOrder),
    executionTimeMs,
  };
}

/**
 * Generate a standalone difference table.
 */
export function computeDifferenceTable(
  xValues: number[],
  yValues: number[],
): DifferenceTableResult {
  validateInputs(xValues, yValues);
  const rawTable = buildRawDifferenceTable(yValues);
  const displayTable = buildDisplayTable(xValues, yValues, rawTable);

  return {
    xValues,
    yValues,
    table: displayTable,
    rawTable,
    maxOrder: rawTable.length - 1,
  };
}

// ════════════════════════════════════════════════════════════
// Core routines
// ════════════════════════════════════════════════════════════

function buildRawDifferenceTable(yValues: number[]): number[][] {
  const n = yValues.length;
  const table: number[][] = [[...yValues]];

  for (let order = 1; order < n; order++) {
    const prev = table[order - 1];
    const row: number[] = [];
    for (let i = 0; i < prev.length - 1; i++) {
      row.push(roundTo(prev[i + 1] - prev[i], 10));
    }
    table.push(row);
  }

  return table;
}

function buildDisplayTable(
  xValues: number[],
  yValues: number[],
  rawTable: number[][],
): DifferenceTableRow[] {
  const n = xValues.length;
  const maxOrder = rawTable.length - 1;
  const rows: DifferenceTableRow[] = [];

  for (let i = 0; i < n; i++) {
    const diffs: (number | null)[] = [];
    for (let k = 1; k <= maxOrder; k++) {
      diffs.push(i < rawTable[k].length ? rawTable[k][i] : null);
    }
    rows.push({ x: xValues[i], y: yValues[i], differences: diffs });
  }

  return rows;
}

/**
 * Forward derivative coefficient of order k.
 */
function forwardDerivativeCoefficient(u: number, k: number, order: 1 | 2): number {
  if (order === 1) {
    let sum = 0;
    for (let i = 0; i < k; i++) {
      let product = 1;
      for (let j = 0; j < k; j++) {
        if (j !== i) product *= (u - j);
      }
      sum += product;
    }
    return sum / factorial(k);
  } else {
    if (k < 2) return 0;
    let doubleSum = 0;
    for (let i = 0; i < k; i++) {
      for (let m = 0; m < k; m++) {
        if (i !== m) {
          let product = 1;
          for (let j = 0; j < k; j++) {
            if (j !== i && j !== m) product *= (u - j);
          }
          doubleSum += product;
        }
      }
    }
    return doubleSum / factorial(k);
  }
}

/**
 * Backward derivative coefficient of order k.
 */
function backwardDerivativeCoefficient(u: number, k: number, order: 1 | 2): number {
  if (order === 1) {
    let sum = 0;
    for (let i = 0; i < k; i++) {
      let product = 1;
      for (let j = 0; j < k; j++) {
        if (j !== i) product *= (u + j);
      }
      sum += product;
    }
    return sum / factorial(k);
  } else {
    if (k < 2) return 0;
    let doubleSum = 0;
    for (let i = 0; i < k; i++) {
      for (let m = 0; m < k; m++) {
        if (i !== m) {
          let product = 1;
          for (let j = 0; j < k; j++) {
            if (j !== i && j !== m) product *= (u + j);
          }
          doubleSum += product;
        }
      }
    }
    return doubleSum / factorial(k);
  }
}

// ════════════════════════════════════════════════════════════
// Step builders
// ════════════════════════════════════════════════════════════

function buildForwardSteps(
  xValues: number[],
  yValues: number[],
  targetX: number,
  h: number,
  u: number,
  rawTable: number[][],
  terms: DerivativeTerm[],
  derivative: number,
  derivativeOrder: 1 | 2,
): CalculationStep[] {
  const n = xValues.length;
  const steps: CalculationStep[] = [];

  steps.push({
    stepNumber: 1,
    title: 'Construct the Forward Difference Table',
    description: 'Compute successive forward differences Δyᵢ = yᵢ₊₁ − yᵢ for each order.',
    formula: differenceTableKaTeX(xValues, yValues, rawTable),
  });

  steps.push({
    stepNumber: 2,
    title: 'Determine the step size h',
    description: 'The common spacing between consecutive x values.',
    formula: `h = x_1 - x_0 = ${xValues[1]} - ${xValues[0]}`,
    result: `h = ${h}`,
  });

  steps.push({
    stepNumber: 3,
    title: 'Calculate u',
    description: 'The normalised distance from x₀ to the target point.',
    formula: `u = \\frac{x - x_0}{h} = \\frac{${targetX} - ${xValues[0]}}{${h}}`,
    result: `u = ${roundTo(u, 10)}`,
  });

  steps.push({
    stepNumber: 4,
    title: `Newton's Forward Difference Formula for ${derivativeOrder === 1 ? 'f′(x)' : 'f′′(x)'}`,
    description: `The general formula for the ${derivativeOrder === 1 ? 'first' : 'second'} derivative using forward differences.`,
    formula: forwardFormulaKaTeX(n - 1, derivativeOrder),
  });

  const substitutionParts = terms.map(
    (t) => `\\left(${roundTo(t.coefficientValue, 8)}\\right)\\left(${t.differenceValue}\\right)`,
  );
  const sumBeforeDivide = terms.reduce((s, t) => s + t.termValue, 0);

  const divTerm = derivativeOrder === 2 ? `h^2` : `h`;
  const divValue = derivativeOrder === 2 ? h * h : h;

  steps.push({
    stepNumber: 5,
    title: 'Substitute Values',
    description: 'Replace each Δᵏy₀ and u in the formula with computed values.',
    formula: `${derivativeOrder === 1 ? "f'" : "f''"}(${targetX}) = \\frac{1}{${divTerm}}\\left[${substitutionParts.join(' + ')}\\right]`,
    result: `${derivativeOrder === 1 ? "f'" : "f''"}(${targetX}) = \\frac{1}{${roundTo(divValue, 10)}} \\times ${roundTo(sumBeforeDivide, 10)} = ${roundTo(derivative, 10)}`,
  });

  steps.push({
    stepNumber: 6,
    title: 'Final Answer',
    description: `The ${derivativeOrder === 1 ? 'first' : 'second'} derivative of f(x) at x = ${targetX} using Newton's Forward Difference method.`,
    formula: `\\boxed{${derivativeOrder === 1 ? "f'" : "f''"}(${targetX}) = ${roundTo(derivative, 10)}}`,
  });

  return steps;
}

function buildBackwardSteps(
  xValues: number[],
  yValues: number[],
  targetX: number,
  h: number,
  u: number,
  rawTable: number[][],
  terms: DerivativeTerm[],
  derivative: number,
  n: number,
  derivativeOrder: 1 | 2,
): CalculationStep[] {
  const steps: CalculationStep[] = [];

  steps.push({
    stepNumber: 1,
    title: 'Construct the Difference Table',
    description: 'Compute successive forward differences (read along the last diagonal for backward differences).',
    formula: differenceTableKaTeX(xValues, yValues, rawTable),
  });

  steps.push({
    stepNumber: 2,
    title: 'Determine the step size h',
    description: 'The common spacing between consecutive x values.',
    formula: `h = x_1 - x_0 = ${xValues[1]} - ${xValues[0]}`,
    result: `h = ${h}`,
  });

  steps.push({
    stepNumber: 3,
    title: 'Calculate u',
    description: 'The normalised distance from xₙ (the last point) to the target.',
    formula: `u = \\frac{x - x_n}{h} = \\frac{${targetX} - ${xValues[n - 1]}}{${h}}`,
    result: `u = ${roundTo(u, 10)}`,
  });

  steps.push({
    stepNumber: 4,
    title: `Newton's Backward Difference Formula for ${derivativeOrder === 1 ? 'f′(x)' : 'f′′(x)'}`,
    description: `The general formula for the ${derivativeOrder === 1 ? 'first' : 'second'} derivative using backward differences.`,
    formula: backwardFormulaKaTeX(n - 1, derivativeOrder),
  });

  const substitutionParts = terms.map(
    (t) => `\\left(${roundTo(t.coefficientValue, 8)}\\right)\\left(${t.differenceValue}\\right)`,
  );
  const sumBeforeDivide = terms.reduce((s, t) => s + t.termValue, 0);

  const divTerm = derivativeOrder === 2 ? `h^2` : `h`;
  const divValue = derivativeOrder === 2 ? h * h : h;

  steps.push({
    stepNumber: 5,
    title: 'Substitute Values',
    description: 'Replace each ∇ᵏyₙ and u in the formula with computed values.',
    formula: `${derivativeOrder === 1 ? "f'" : "f''"}(${targetX}) = \\frac{1}{${divTerm}}\\left[${substitutionParts.join(' + ')}\\right]`,
    result: `${derivativeOrder === 1 ? "f'" : "f''"}(${targetX}) = \\frac{1}{${roundTo(divValue, 10)}} \\times ${roundTo(sumBeforeDivide, 10)} = ${roundTo(derivative, 10)}`,
  });

  steps.push({
    stepNumber: 6,
    title: 'Final Answer',
    description: `The ${derivativeOrder === 1 ? 'first' : 'second'} derivative of f(x) at x = ${targetX} using Newton's Backward Difference method.`,
    formula: `\\boxed{${derivativeOrder === 1 ? "f'" : "f''"}(${targetX}) = ${roundTo(derivative, 10)}}`,
  });

  return steps;
}

// ════════════════════════════════════════════════════════════
// KaTeX generators
// ════════════════════════════════════════════════════════════

function forwardFormulaKaTeX(maxOrder: number, order: 1 | 2): string {
  const parts = [`${order === 1 ? "f'" : "f''"}(x) = \\frac{1}{h${order === 2 ? '^2' : ''}}\\Bigg[`];
  
  if (order === 1) {
    parts.push('\\Delta y_0');
    if (maxOrder >= 2) parts.push('+ \\frac{2u - 1}{2!}\\Delta^2 y_0');
    if (maxOrder >= 3) parts.push('+ \\frac{3u^2 - 6u + 2}{3!}\\Delta^3 y_0');
    if (maxOrder >= 4) parts.push('+ \\frac{4u^3 - 18u^2 + 22u - 6}{4!}\\Delta^4 y_0');
  } else {
    // 2nd derivative formulas
    parts.push('0'); // k=1 is 0
    if (maxOrder >= 2) parts.push('+ \\Delta^2 y_0');
    if (maxOrder >= 3) parts.push('+ (u - 1)\\Delta^3 y_0');
    if (maxOrder >= 4) parts.push('+ \\frac{11 - 18u + 6u^2}{12}\\Delta^4 y_0');
  }
  
  if (maxOrder >= 5) parts.push('+ \\cdots');
  parts.push('\\Bigg]');
  return parts.join(' ');
}

function backwardFormulaKaTeX(maxOrder: number, order: 1 | 2): string {
  const parts = [`${order === 1 ? "f'" : "f''"}(x) = \\frac{1}{h${order === 2 ? '^2' : ''}}\\Bigg[`];
  
  if (order === 1) {
    parts.push('\\nabla y_n');
    if (maxOrder >= 2) parts.push('+ \\frac{2u + 1}{2!}\\nabla^2 y_n');
    if (maxOrder >= 3) parts.push('+ \\frac{3u^2 + 6u + 2}{3!}\\nabla^3 y_n');
    if (maxOrder >= 4) parts.push('+ \\frac{4u^3 + 18u^2 + 22u + 6}{4!}\\nabla^4 y_n');
  } else {
    // 2nd derivative formulas
    parts.push('0'); // k=1 is 0
    if (maxOrder >= 2) parts.push('+ \\nabla^2 y_n');
    if (maxOrder >= 3) parts.push('+ (u + 1)\\nabla^3 y_n');
    if (maxOrder >= 4) parts.push('+ \\frac{11 + 18u + 6u^2}{12}\\nabla^4 y_n');
  }
  
  if (maxOrder >= 5) parts.push('+ \\cdots');
  parts.push('\\Bigg]');
  return parts.join(' ');
}

function forwardCoefficientKaTeX(k: number, order: 1 | 2): string {
  if (order === 1) {
    switch (k) {
      case 1: return '1';
      case 2: return '\\frac{2u - 1}{2!}';
      case 3: return '\\frac{3u^2 - 6u + 2}{3!}';
      case 4: return '\\frac{4u^3 - 18u^2 + 22u - 6}{4!}';
      default: return `C_{\\text{fwd}}^{(${k})}(u)`;
    }
  } else {
    switch (k) {
      case 1: return '0';
      case 2: return '1';
      case 3: return 'u - 1';
      case 4: return '\\frac{11 - 18u + 6u^2}{12}';
      default: return `C_{\\text{fwd},2}^{(${k})}(u)`;
    }
  }
}

function backwardCoefficientKaTeX(k: number, order: 1 | 2): string {
  if (order === 1) {
    switch (k) {
      case 1: return '1';
      case 2: return '\\frac{2u + 1}{2!}';
      case 3: return '\\frac{3u^2 + 6u + 2}{3!}';
      case 4: return '\\frac{4u^3 + 18u^2 + 22u + 6}{4!}';
      default: return `C_{\\text{bwd}}^{(${k})}(u)`;
    }
  } else {
    switch (k) {
      case 1: return '0';
      case 2: return '1';
      case 3: return 'u + 1';
      case 4: return '\\frac{11 + 18u + 6u^2}{12}';
      default: return `C_{\\text{bwd},2}^{(${k})}(u)`;
    }
  }
}

function differenceTableKaTeX(
  xValues: number[],
  yValues: number[],
  rawTable: number[][],
): string {
  const n = xValues.length;
  const maxOrder = rawTable.length - 1;
  const headers = ['x', 'y'];
  for (let k = 1; k <= maxOrder; k++) {
    headers.push(`\\Delta${k > 1 ? `^{${k}}` : ''} y`);
  }
  let latex = '\\begin{array}{' + headers.map(() => 'c').join('|') + '} ';
  latex += headers.join(' & ') + ' \\\\ \\hline ';
  for (let i = 0; i < n; i++) {
    const cells = [String(xValues[i]), String(yValues[i])];
    for (let k = 1; k <= maxOrder; k++) {
      cells.push(i < rawTable[k].length ? String(rawTable[k][i]) : '');
    }
    latex += cells.join(' & ');
    if (i < n - 1) latex += ' \\\\ ';
  }
  latex += ' \\end{array}';
  return latex;
}

// ════════════════════════════════════════════════════════════
// Validation
// ════════════════════════════════════════════════════════════

function validateInputs(xValues: number[], yValues: number[]): void {
  if (xValues.length !== yValues.length) {
    throw new Error('The number of x values must equal the number of y values.');
  }
  if (xValues.length < 3) {
    throw new Error('At least 3 data points are required.');
  }
  for (let i = 0; i < xValues.length; i++) {
    if (!isFinite(xValues[i]) || !isFinite(yValues[i])) {
      throw new Error(`Non-numeric or infinite value found at index ${i}.`);
    }
  }
  const xSet = new Set(xValues);
  if (xSet.size !== xValues.length) {
    throw new Error('Duplicate x values are not allowed.');
  }
  computeH(xValues);
}

function computeH(xValues: number[]): number {
  const h = xValues[1] - xValues[0];
  if (h === 0) throw new Error('Step size h cannot be zero.');
  const tolerance = Math.abs(h) * 1e-9;
  for (let i = 2; i < xValues.length; i++) {
    const diff = xValues[i] - xValues[i - 1];
    if (Math.abs(diff - h) > tolerance) {
      throw new Error(
        `x values must be equally spaced. Expected spacing ${h} but found ${diff} between x[${i - 1}] and x[${i}].`,
      );
    }
  }
  return h;
}

// ════════════════════════════════════════════════════════════
// Helpers
// ════════════════════════════════════════════════════════════

function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
