/**
 * Numerical Differentiation Calculator — Shared Interfaces
 *
 * Defines the shape of all data structures used across the
 * calculator service, controller, and API responses.
 */

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
  formula: string;   // KaTeX string
  result?: string;    // KaTeX string showing the computed value
}

/** Full result returned by the calculation endpoints */
export interface CalculationResult {
  method: 'newton-forward' | 'newton-backward';
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

/** Standalone difference-table response */
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
  method: 'newton-forward' | 'newton-backward';
  derivativeOrder?: 1 | 2;
}

/** Health-check response */
export interface HealthResponse {
  status: string;
  uptime: number;
  timestamp: string;
  version: string;
}
