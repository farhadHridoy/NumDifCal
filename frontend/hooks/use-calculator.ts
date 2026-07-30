'use client';

import { useState, useCallback } from 'react';
import type {
  MethodType,
  CalculatorInput,
  CalculationResult,
  WorkedExample,
} from '@/types/calculator';
import {
  computeNewtonForward,
  computeNewtonBackward,
} from '@/lib/math-engine';

const DEFAULT_NUM_POINTS = 5;

function createEmptyInput(): CalculatorInput {
  return {
    method: 'newton-forward',
    numPoints: DEFAULT_NUM_POINTS,
    xValues: Array(DEFAULT_NUM_POINTS).fill(''),
    yValues: Array(DEFAULT_NUM_POINTS).fill(''),
    targetX: '',
    derivativeOrder: 1,
  };
}

export function useCalculator() {
  const [input, setInput] = useState<CalculatorInput>(createEmptyInput());
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // ── Method selection ──
  const setMethod = useCallback((method: MethodType) => {
    setInput((prev) => ({ ...prev, method }));
    setResult(null);
    setError(null);
  }, []);

  // ── Derivative Order ──
  const setDerivativeOrder = useCallback((order: 1 | 2) => {
    setInput((prev) => ({ ...prev, derivativeOrder: order }));
    setResult(null);
    setError(null);
  }, []);

  // ── Number of points ──
  const setNumPoints = useCallback((n: number) => {
    const num = Math.max(3, Math.min(20, n));
    setInput((prev) => {
      const xValues = Array(num)
        .fill('')
        .map((_, i) => (i < prev.xValues.length ? prev.xValues[i] : ''));
      const yValues = Array(num)
        .fill('')
        .map((_, i) => (i < prev.yValues.length ? prev.yValues[i] : ''));
      return { ...prev, numPoints: num, xValues, yValues };
    });
    setResult(null);
    setError(null);
  }, []);

  // ── Update individual x/y values ──
  const setXValue = useCallback((index: number, value: string) => {
    setInput((prev) => {
      const xValues = [...prev.xValues];
      xValues[index] = value;
      return { ...prev, xValues };
    });
  }, []);

  const setYValue = useCallback((index: number, value: string) => {
    setInput((prev) => {
      const yValues = [...prev.yValues];
      yValues[index] = value;
      return { ...prev, yValues };
    });
  }, []);

  // ── Target x ──
  const setTargetX = useCallback((value: string) => {
    setInput((prev) => ({ ...prev, targetX: value }));
  }, []);

  // ── Calculate ──
  const calculate = useCallback(() => {
    setError(null);
    setResult(null);
    setIsCalculating(true);

    try {
      // Parse values
      const xValues = input.xValues.map((v) => {
        const n = parseFloat(v);
        if (isNaN(n)) throw new Error(`Invalid x value: "${v}"`);
        return n;
      });

      const yValues = input.yValues.map((v) => {
        const n = parseFloat(v);
        if (isNaN(n)) throw new Error(`Invalid y value: "${v}"`);
        return n;
      });

      const targetX = parseFloat(input.targetX);
      if (isNaN(targetX)) throw new Error('Invalid target x value.');

      // Compute
      const calcResult =
        input.method === 'newton-forward'
          ? computeNewtonForward(xValues, yValues, targetX, input.derivativeOrder)
          : computeNewtonBackward(xValues, yValues, targetX, input.derivativeOrder);

      // Use setTimeout to allow the UI to show the calculating state
      setTimeout(() => {
        setResult(calcResult);
        setIsCalculating(false);
      }, 300);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(message);
      setIsCalculating(false);
    }
  }, [input]);

  // ── Reset ──
  const reset = useCallback(() => {
    setInput(createEmptyInput());
    setResult(null);
    setError(null);
  }, []);

  // ── Load example ──
  const loadExample = useCallback((example: WorkedExample) => {
    setInput({
      method: example.method,
      numPoints: example.xValues.length,
      xValues: example.xValues.map(String),
      yValues: example.yValues.map(String),
      targetX: String(example.targetX),
      derivativeOrder: example.derivativeOrder || 1,
    });
    setResult(null);
    setError(null);
  }, []);

  return {
    input,
    result,
    error,
    isCalculating,
    setMethod,
    setDerivativeOrder,
    setNumPoints,
    setXValue,
    setYValue,
    setTargetX,
    calculate,
    reset,
    loadExample,
  };
}
