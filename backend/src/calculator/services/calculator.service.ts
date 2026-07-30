import { Injectable, BadRequestException } from '@nestjs/common';
import {
  CalculationResult,
  CalculationStep,
  DifferenceTableRow,
  DifferenceTableResult,
  DerivativeTerm,
} from '../interfaces/calculation-result.interface';

/**
 * CalculatorService — Core Mathematical Engine
 *
 * Implements Newton Forward and Newton Backward Difference Methods
 * for numerical differentiation, with full difference-table generation
 * and step-by-step solution output.
 */
@Injectable()
export class CalculatorService {
  // ──────────────────────────────────────────────
  // Public API
  // ──────────────────────────────────────────────

  /**
   * Compute the first derivative using Newton's Forward Difference formula.
   *
   * f'(x) = (1/h) [ Δy₀ + ((2u−1)/2!) Δ²y₀ + ((3u²−6u+2)/3!) Δ³y₀ + … ]
   * where u = (x − x₀) / h
   */
  computeNewtonForward(
    xValues: number[],
    yValues: number[],
    targetX: number,
    derivativeOrder: 1 | 2 = 1,
  ): CalculationResult {
    const startTime = performance.now();

    // ── Validation ──
    this.validateInputs(xValues, yValues);

    const n = xValues.length;
    const h = this.computeH(xValues);
    const u = (targetX - xValues[0]) / h;

    // ── Build difference table ──
    const rawTable = this.buildRawDifferenceTable(yValues);
    const displayTable = this.buildDisplayTable(xValues, yValues, rawTable);

    // ── Compute derivative terms ──
    let derivative = 0;
    const terms: DerivativeTerm[] = [];

    for (let k = 1; k < n; k++) {
      const coeff = this.forwardDerivativeCoefficient(u, k, derivativeOrder);
      const diff = rawTable[k][0]; // Forward: use FIRST element of each order
      const termValue = coeff * diff;
      derivative += termValue;

      if (coeff !== 0 || k === 1) {
        terms.push({
          order: k,
          coefficientFormula: this.forwardCoefficientKaTeX(k, derivativeOrder),
          coefficientValue: coeff,
          differenceSymbol: `\\Delta${k > 1 ? `^{${k}}` : ''} y_0`,
          differenceValue: diff,
          termValue,
        });
      }
    }

    derivative /= (derivativeOrder === 2 ? h * h : h);

    // ── Build step-by-step solution ──
    const steps = this.buildForwardSteps(xValues, yValues, targetX, h, u, rawTable, terms, derivative, derivativeOrder);

    const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(4));

    return {
      method: 'newton-forward',
      xValues,
      yValues,
      targetX,
      h,
      u,
      derivativeOrder,
      derivative: this.roundTo(derivative, 10),
      differenceTable: displayTable,
      rawDifferenceTable: rawTable,
      terms,
      steps,
      formula: this.forwardFormulaKaTeX(n - 1, derivativeOrder),
      executionTimeMs,
    };
  }

  /**
   * Compute the first derivative using Newton's Backward Difference formula.
   *
   * f'(x) = (1/h) [ ∇yₙ + ((2u+1)/2!) ∇²yₙ + ((3u²+6u+2)/3!) ∇³yₙ + … ]
   * where u = (x − xₙ) / h
   */
  computeNewtonBackward(
    xValues: number[],
    yValues: number[],
    targetX: number,
    derivativeOrder: 1 | 2 = 1,
  ): CalculationResult {
    const startTime = performance.now();

    this.validateInputs(xValues, yValues);

    const n = xValues.length;
    const h = this.computeH(xValues);
    const u = (targetX - xValues[n - 1]) / h;

    const rawTable = this.buildRawDifferenceTable(yValues);
    const displayTable = this.buildDisplayTable(xValues, yValues, rawTable);

    let derivative = 0;
    const terms: DerivativeTerm[] = [];

    for (let k = 1; k < n; k++) {
      const coeff = this.backwardDerivativeCoefficient(u, k, derivativeOrder);
      const diff = rawTable[k][n - 1 - k]; // Backward: use LAST element along the diagonal
      const termValue = coeff * diff;
      derivative += termValue;

      if (coeff !== 0 || k === 1) {
        terms.push({
          order: k,
          coefficientFormula: this.backwardCoefficientKaTeX(k, derivativeOrder),
          coefficientValue: coeff,
          differenceSymbol: `\\nabla${k > 1 ? `^{${k}}` : ''} y_{n}`,
          differenceValue: diff,
          termValue,
        });
      }
    }

    derivative /= (derivativeOrder === 2 ? h * h : h);

    // ── Build step-by-step solution ──
    const steps = this.buildBackwardSteps(xValues, yValues, targetX, h, u, rawTable, terms, derivative, n, derivativeOrder);

    const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(4));

    return {
      method: 'newton-backward',
      xValues,
      yValues,
      targetX,
      h,
      u,
      derivativeOrder,
      derivative: this.roundTo(derivative, 10),
      differenceTable: displayTable,
      rawDifferenceTable: rawTable,
      terms,
      steps,
      formula: this.backwardFormulaKaTeX(n - 1, derivativeOrder),
      executionTimeMs,
    };
  }

  /**
   * Generate a standalone difference table without computing a derivative.
   */
  computeDifferenceTable(
    xValues: number[],
    yValues: number[],
  ): DifferenceTableResult {
    this.validateInputs(xValues, yValues);
    const rawTable = this.buildRawDifferenceTable(yValues);
    const displayTable = this.buildDisplayTable(xValues, yValues, rawTable);

    return {
      xValues,
      yValues,
      table: displayTable,
      rawTable,
      maxOrder: rawTable.length - 1,
    };
  }

  // ──────────────────────────────────────────────
  // Core mathematical routines
  // ──────────────────────────────────────────────

  /**
   * Build the forward-difference table.
   *
   * rawTable[k][i] = Δᵏyᵢ
   *   rawTable[0] = [ y₀, y₁, …, yₙ₋₁ ]
   *   rawTable[1] = [ Δy₀, Δy₁, …, Δyₙ₋₂ ]
   *   rawTable[k][i] = rawTable[k−1][i+1] − rawTable[k−1][i]
   */
  private buildRawDifferenceTable(yValues: number[]): number[][] {
    const n = yValues.length;
    const table: number[][] = [[...yValues]];

    for (let order = 1; order < n; order++) {
      const prev = table[order - 1];
      const row: number[] = [];
      for (let i = 0; i < prev.length - 1; i++) {
        row.push(this.roundTo(prev[i + 1] - prev[i], 10));
      }
      table.push(row);
    }

    return table;
  }

  /**
   * Convert the raw table into a display-friendly format with x, y, and
   * nullable difference columns.
   */
  private buildDisplayTable(
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
      rows.push({
        x: xValues[i],
        y: yValues[i],
        differences: diffs,
      });
    }

    return rows;
  }

  /**
   * Derivative coefficient for Newton's Forward formula, order k.
   *
   * Equals d/du [ u(u−1)(u−2)…(u−k+1) / k! ] evaluated at the given u.
   * Computed via the product-rule sum:
   *   (1/k!) × Σᵢ₌₀ᵏ⁻¹ Πⱼ₌₀,ⱼ≠ᵢᵏ⁻¹ (u − j)
   */
  private forwardDerivativeCoefficient(u: number, k: number, order: 1 | 2): number {
    if (order === 1) {
      let sum = 0;
      for (let i = 0; i < k; i++) {
        let product = 1;
        for (let j = 0; j < k; j++) {
          if (j !== i) product *= (u - j);
        }
        sum += product;
      }
      return sum / this.factorial(k);
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
      return doubleSum / this.factorial(k);
    }
  }

  /**
   * Derivative coefficient for Newton's Backward formula, order k.
   *
   * Equals d/du [ u(u+1)(u+2)…(u+k−1) / k! ] evaluated at the given u.
   * Computed via the product-rule sum:
   *   (1/k!) × Σᵢ₌₀ᵏ⁻¹ Πⱼ₌₀,ⱼ≠ᵢᵏ⁻¹ (u + j)
   */
  private backwardDerivativeCoefficient(u: number, k: number, order: 1 | 2): number {
    if (order === 1) {
      let sum = 0;
      for (let i = 0; i < k; i++) {
        let product = 1;
        for (let j = 0; j < k; j++) {
          if (j !== i) product *= (u + j);
        }
        sum += product;
      }
      return sum / this.factorial(k);
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
      return doubleSum / this.factorial(k);
    }
  }

  // ──────────────────────────────────────────────
  // Step-by-step builders
  // ──────────────────────────────────────────────

  private buildForwardSteps(
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

    // Step 1: Difference Table
    steps.push({
      stepNumber: 1,
      title: 'Construct the Forward Difference Table',
      description:
        'Compute successive forward differences Δyᵢ = yᵢ₊₁ − yᵢ for each order.',
      formula: this.differenceTableKaTeX(xValues, yValues, rawTable),
    });

    // Step 2: Find h
    steps.push({
      stepNumber: 2,
      title: 'Determine the step size h',
      description: 'The common spacing between consecutive x values.',
      formula: `h = x_1 - x_0 = ${xValues[1]} - ${xValues[0]}`,
      result: `h = ${h}`,
    });

    // Step 3: Find u
    steps.push({
      stepNumber: 3,
      title: 'Calculate u',
      description:
        'The normalised distance from x₀ to the target point.',
      formula: `u = \\frac{x - x_0}{h} = \\frac{${targetX} - ${xValues[0]}}{${h}}`,
      result: `u = ${this.roundTo(u, 10)}`,
    });

    // Step 4: Formula
    steps.push({
      stepNumber: 4,
      title: `Newton's Forward Difference Formula for ${derivativeOrder === 1 ? 'f′(x)' : 'f′′(x)'}`,
      description: `The general formula for the ${derivativeOrder === 1 ? 'first' : 'second'} derivative using forward differences.`,
      formula: this.forwardFormulaKaTeX(n - 1, derivativeOrder),
    });

    // Step 5: Substitute
    const substitutionParts = terms.map(
      (t) =>
        `\\left(${this.roundTo(t.coefficientValue, 8)}\\right)\\left(${t.differenceValue}\\right)`,
    );
    const sumBeforeDivide = terms.reduce((s, t) => s + t.termValue, 0);

    const divTerm = derivativeOrder === 2 ? `h^2` : `h`;
    const divValue = derivativeOrder === 2 ? h * h : h;

    steps.push({
      stepNumber: 5,
      title: 'Substitute Values',
      description: 'Replace each Δᵏy₀ and u in the formula with computed values.',
      formula: `${derivativeOrder === 1 ? "f'" : "f''"}(${targetX}) = \\frac{1}{${divTerm}}\\left[${substitutionParts.join(' + ')}\\right]`,
      result: `${derivativeOrder === 1 ? "f'" : "f''"}(${targetX}) = \\frac{1}{${this.roundTo(divValue, 10)}} \\times ${this.roundTo(sumBeforeDivide, 10)} = ${this.roundTo(derivative, 10)}`,
    });

    // Step 6: Final answer
    steps.push({
      stepNumber: 6,
      title: 'Final Answer',
      description: `The ${derivativeOrder === 1 ? 'first' : 'second'} derivative of f(x) at x = ${targetX} using Newton's Forward Difference method.`,
      formula: `\\boxed{${derivativeOrder === 1 ? "f'" : "f''"}(${targetX}) = ${this.roundTo(derivative, 10)}}`,
    });

    return steps;
  }

  private buildBackwardSteps(
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

    // Step 1
    steps.push({
      stepNumber: 1,
      title: 'Construct the Difference Table',
      description:
        'Compute successive forward differences (read along the last diagonal for backward differences).',
      formula: this.differenceTableKaTeX(xValues, yValues, rawTable),
    });

    // Step 2
    steps.push({
      stepNumber: 2,
      title: 'Determine the step size h',
      description: 'The common spacing between consecutive x values.',
      formula: `h = x_1 - x_0 = ${xValues[1]} - ${xValues[0]}`,
      result: `h = ${h}`,
    });

    // Step 3
    steps.push({
      stepNumber: 3,
      title: 'Calculate u',
      description:
        'The normalised distance from xₙ (the last point) to the target.',
      formula: `u = \\frac{x - x_n}{h} = \\frac{${targetX} - ${xValues[n - 1]}}{${h}}`,
      result: `u = ${this.roundTo(u, 10)}`,
    });

    // Step 4
    steps.push({
      stepNumber: 4,
      title: `Newton's Backward Difference Formula for ${derivativeOrder === 1 ? 'f′(x)' : 'f′′(x)'}`,
      description: `The general formula for the ${derivativeOrder === 1 ? 'first' : 'second'} derivative using backward differences.`,
      formula: this.backwardFormulaKaTeX(n - 1, derivativeOrder),
    });

    // Step 5
    const substitutionParts = terms.map(
      (t) =>
        `\\left(${this.roundTo(t.coefficientValue, 8)}\\right)\\left(${t.differenceValue}\\right)`,
    );
    const sumBeforeDivide = terms.reduce((s, t) => s + t.termValue, 0);

    const divTerm = derivativeOrder === 2 ? `h^2` : `h`;
    const divValue = derivativeOrder === 2 ? h * h : h;

    steps.push({
      stepNumber: 5,
      title: 'Substitute Values',
      description: 'Replace each ∇ᵏyₙ and u in the formula with computed values.',
      formula: `${derivativeOrder === 1 ? "f'" : "f''"}(${targetX}) = \\frac{1}{${divTerm}}\\left[${substitutionParts.join(' + ')}\\right]`,
      result: `${derivativeOrder === 1 ? "f'" : "f''"}(${targetX}) = \\frac{1}{${this.roundTo(divValue, 10)}} \\times ${this.roundTo(sumBeforeDivide, 10)} = ${this.roundTo(derivative, 10)}`,
    });

    // Step 6
    steps.push({
      stepNumber: 6,
      title: 'Final Answer',
      description: `The ${derivativeOrder === 1 ? 'first' : 'second'} derivative of f(x) at x = ${targetX} using Newton's Backward Difference method.`,
      formula: `\\boxed{${derivativeOrder === 1 ? "f'" : "f''"}(${targetX}) = ${this.roundTo(derivative, 10)}}`,
    });

    return steps;
  }

  // ──────────────────────────────────────────────
  // KaTeX formula generators
  // ──────────────────────────────────────────────

  private forwardFormulaKaTeX(maxOrder: number, order: 1 | 2): string {
    const parts = [`${order === 1 ? "f'" : "f''"}(x) = \\frac{1}{h${order === 2 ? '^2' : ''}}\\Bigg[`];

    if (order === 1) {
      parts.push('\\Delta y_0');
      if (maxOrder >= 2) parts.push('+ \\frac{2u - 1}{2!}\\Delta^2 y_0');
      if (maxOrder >= 3) parts.push('+ \\frac{3u^2 - 6u + 2}{3!}\\Delta^3 y_0');
      if (maxOrder >= 4) parts.push('+ \\frac{4u^3 - 18u^2 + 22u - 6}{4!}\\Delta^4 y_0');
    } else {
      parts.push('0');
      if (maxOrder >= 2) parts.push('+ \\Delta^2 y_0');
      if (maxOrder >= 3) parts.push('+ (u - 1)\\Delta^3 y_0');
      if (maxOrder >= 4) parts.push('+ \\frac{11 - 18u + 6u^2}{12}\\Delta^4 y_0');
    }

    if (maxOrder >= 5) parts.push('+ \\cdots');
    parts.push('\\Bigg]');
    return parts.join(' ');
  }

  private backwardFormulaKaTeX(maxOrder: number, order: 1 | 2): string {
    const parts = [`${order === 1 ? "f'" : "f''"}(x) = \\frac{1}{h${order === 2 ? '^2' : ''}}\\Bigg[`];

    if (order === 1) {
      parts.push('\\nabla y_n');
      if (maxOrder >= 2) parts.push('+ \\frac{2u + 1}{2!}\\nabla^2 y_n');
      if (maxOrder >= 3) parts.push('+ \\frac{3u^2 + 6u + 2}{3!}\\nabla^3 y_n');
      if (maxOrder >= 4) parts.push('+ \\frac{4u^3 + 18u^2 + 22u + 6}{4!}\\nabla^4 y_n');
    } else {
      parts.push('0');
      if (maxOrder >= 2) parts.push('+ \\nabla^2 y_n');
      if (maxOrder >= 3) parts.push('+ (u + 1)\\nabla^3 y_n');
      if (maxOrder >= 4) parts.push('+ \\frac{11 + 18u + 6u^2}{12}\\nabla^4 y_n');
    }

    if (maxOrder >= 5) parts.push('+ \\cdots');
    parts.push('\\Bigg]');
    return parts.join(' ');
  }

  private forwardCoefficientKaTeX(k: number, order: 1 | 2): string {
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

  private backwardCoefficientKaTeX(k: number, order: 1 | 2): string {
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

  private differenceTableKaTeX(
    xValues: number[],
    yValues: number[],
    rawTable: number[][],
  ): string {
    const n = xValues.length;
    const maxOrder = rawTable.length - 1;

    // Build a LaTeX array
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

  // ──────────────────────────────────────────────
  // Validation
  // ──────────────────────────────────────────────

  private validateInputs(xValues: number[], yValues: number[]): void {
    if (xValues.length !== yValues.length) {
      throw new BadRequestException(
        'The number of x values must equal the number of y values.',
      );
    }

    if (xValues.length < 3) {
      throw new BadRequestException(
        'At least 3 data points are required.',
      );
    }

    // Check for non-numeric values
    for (let i = 0; i < xValues.length; i++) {
      if (!isFinite(xValues[i]) || !isFinite(yValues[i])) {
        throw new BadRequestException(
          `Non-numeric or infinite value found at index ${i}.`,
        );
      }
    }

    // Check for duplicate x values
    const xSet = new Set(xValues);
    if (xSet.size !== xValues.length) {
      throw new BadRequestException('Duplicate x values are not allowed.');
    }

    // Check for equal spacing (tolerance-based)
    this.computeH(xValues); // throws if not equally spaced
  }

  /**
   * Compute the step size h and verify that all intervals are equal.
   */
  private computeH(xValues: number[]): number {
    const h = xValues[1] - xValues[0];
    if (h === 0) {
      throw new BadRequestException('Step size h cannot be zero.');
    }

    const tolerance = Math.abs(h) * 1e-9;
    for (let i = 2; i < xValues.length; i++) {
      const diff = xValues[i] - xValues[i - 1];
      if (Math.abs(diff - h) > tolerance) {
        throw new BadRequestException(
          `x values must be equally spaced. Expected spacing ${h} but found ${diff} between x[${i - 1}] and x[${i}].`,
        );
      }
    }

    return h;
  }

  // ──────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────

  private factorial(n: number): number {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  }

  private roundTo(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }
}
