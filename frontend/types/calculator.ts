/**
 * Shared TypeScript types for the Numerical Differentiation Calculator.
 * Mirrors the backend interfaces.
 */

export type MethodType = 'newton-forward' | 'newton-backward';

/** A single row in the difference table display */
export interface DifferenceTableRow {
  x: number;
  y: number;
  differences: (number | null)[];
}

/** A single term in the derivative expansion */
export interface DerivativeTerm {
  order: number;
  coefficientFormula: string;
  coefficientValue: number;
  differenceSymbol: string;
  differenceValue: number;
  termValue: number;
}

/** One step in the step-by-step solution */
export interface CalculationStep {
  stepNumber: number;
  title: string;
  description: string;
  formula: string;
  result?: string;
}

/** Full result from a calculation */
export interface CalculationResult {
  method: MethodType;
  xValues: number[];
  yValues: number[];
  targetX: number;
  h: number;
  u: number;
  derivativeOrder: 1 | 2;
  derivative: number;
  differenceTable: DifferenceTableRow[];
  rawDifferenceTable: number[][];
  terms: DerivativeTerm[];
  steps: CalculationStep[];
  formula: string;
  executionTimeMs: number;
}

/** Standalone difference-table result */
export interface DifferenceTableResult {
  xValues: number[];
  yValues: number[];
  table: DifferenceTableRow[];
  rawTable: number[][];
  maxOrder: number;
}

/** A pre-built worked example */
export interface WorkedExample {
  id: string;
  title: string;
  description: string;
  xValues: number[];
  yValues: number[];
  targetX: number;
  method: MethodType;
  derivativeOrder?: 1 | 2;
}

/** Calculator input state */
export interface CalculatorInput {
  method: MethodType;
  numPoints: number;
  xValues: string[];
  yValues: string[];
  targetX: string;
  derivativeOrder: 1 | 2;
}

/** Data point for the graph */
export interface GraphDataPoint {
  x: number;
  y: number;
  derivative?: number;
  isTarget?: boolean;
}
