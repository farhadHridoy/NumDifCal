'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  RotateCcw,
  Loader2,
  BookOpen,
  AlertTriangle,
} from 'lucide-react';
import { useCalculator } from '@/hooks/use-calculator';
import { useEffect, useRef } from 'react';
import { MethodSelector } from '@/components/calculator/method-selector';
import { DerivativeSelector } from '@/components/calculator/derivative-selector';
import { DataInputTable } from '@/components/calculator/data-input-table';
import { DifferenceTableDisplay } from '@/components/calculator/difference-table';
import { StepDisplay } from '@/components/calculator/step-display';
import { ResultCard } from '@/components/calculator/result-card';
import { Graph } from '@/components/calculator/graph';
import { FormulaDisplay } from '@/components/calculator/formula-display';
import { FinalAnswer } from '@/components/calculator/final-answer';
import { GlassCard } from '@/components/ui/glass-card';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { AnimatedInput } from '@/components/ui/animated-input';
import { ScrollReveal } from '@/components/animations/scroll-reveal';
import type { WorkedExample } from '@/types/calculator';

/** Pre-built examples for one-click loading */
const examples: WorkedExample[] = [
  {
    id: 'cubic-forward',
    title: 'Cubic — Forward',
    description: "f(x) = x³ + 1, find f'(1.5)",
    xValues: [0, 1, 2, 3, 4],
    yValues: [1, 2, 9, 28, 65],
    targetX: 1.5,
    method: 'newton-forward',
  },
  {
    id: 'cubic-backward',
    title: 'Cubic — Backward',
    description: "f(x) = x³ + 1, find f'(3.5)",
    xValues: [0, 1, 2, 3, 4],
    yValues: [1, 2, 9, 28, 65],
    targetX: 3.5,
    method: 'newton-backward',
  },
  {
    id: 'cubic-forward-2nd',
    title: 'Cubic — 2nd Deriv (Fwd)',
    description: "f(x) = x³ + 1, find f''(1.5)",
    xValues: [0, 1, 2, 3, 4],
    yValues: [1, 2, 9, 28, 65],
    targetX: 1.5,
    method: 'newton-forward',
    derivativeOrder: 2,
  },
  {
    id: 'cubic-backward-2nd',
    title: 'Cubic — 2nd Deriv (Bwd)',
    description: "f(x) = x³ + 1, find f''(3.5)",
    xValues: [0, 1, 2, 3, 4],
    yValues: [1, 2, 9, 28, 65],
    targetX: 3.5,
    method: 'newton-backward',
    derivativeOrder: 2,
  },
  {
    id: 'exp-forward',
    title: 'Exponential — Forward',
    description: "eˣ data, find f'(1.22)",
    xValues: [1.0, 1.1, 1.2, 1.3, 1.4, 1.5],
    yValues: [2.7183, 3.0042, 3.3201, 3.6693, 4.0552, 4.4817],
    targetX: 1.22,
    method: 'newton-forward',
  },
  {
    id: 'sin-backward',
    title: 'Sine — Backward',
    description: "sin(x) data, find f'(1.29)",
    xValues: [1.0, 1.1, 1.2, 1.3, 1.4],
    yValues: [0.8415, 0.8912, 0.9320, 0.9636, 0.9854],
    targetX: 1.29,
    method: 'newton-backward',
  },
];

export default function CalculatorPage() {
  const {
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
  } = useCalculator();

  const [showExamples, setShowExamples] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [result]);

  return (
    <div className="container-app">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
        {/* ═══ Left: Calculator ═══ */}
        <div className="flex flex-col gap-6">
          {/* Method Selector */}
          <div>
            <MethodSelector value={input.method} onChange={setMethod} />
          </div>

          {/* Derivative Order Toggle */}
          <div>
            <DerivativeSelector
              value={input.derivativeOrder}
              onChange={setDerivativeOrder}
            />
          </div>

          {/* Data Input */}
          <div>
            <DataInputTable
              numPoints={input.numPoints}
              xValues={input.xValues}
              yValues={input.yValues}
              onNumPointsChange={setNumPoints}
              onXChange={setXValue}
              onYChange={setYValue}
            />
          </div>

          {/* Target X */}
          <div>
            <AnimatedInput
              label="Target x (point to differentiate at)"
              value={input.targetX}
              onChange={setTargetX}
              type="text"
              placeholder="e.g. 1.5"
              centered
              size="lg"
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-row items-center gap-4">
            <MagneticButton
              variant="primary"
              className="h-[44px] px-10"
              onClick={calculate}
              disabled={isCalculating}
              aria-label="Calculate derivative"
            >
              {isCalculating ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Play size={18} />
              )}
              {isCalculating ? 'Calculating...' : 'Calculate'}
            </MagneticButton>

            <MagneticButton
              variant="secondary"
              className="h-[44px] px-6"
              onClick={reset}
              aria-label="Reset calculator"
            >
              <RotateCcw size={16} />
              Reset
            </MagneticButton>

            <MagneticButton
              variant="ghost"
              className="h-[44px] px-6"
              onClick={() => setShowExamples((v) => !v)}
              aria-label="Load example"
            >
              <BookOpen size={16} />
              {showExamples ? 'Hide Examples' : 'Load Example'}
            </MagneticButton>
          </div>

          {/* Example selector */}
          <AnimatePresence>
            {showExamples && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {examples.map((ex) => (
                    <motion.button
                      key={ex.id}
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        loadExample(ex);
                        setShowExamples(false);
                      }}
                      className="glass rounded-[var(--radius-lg)] p-4 text-left cursor-pointer transition-colors hover:bg-[var(--color-surface-hover)]"
                    >
                      <div className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-1">
                        {ex.title}
                      </div>
                      <div className="text-[12px] text-[var(--color-text-secondary)]">
                        {ex.description}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-3 px-5 py-4 rounded-[var(--radius-lg)] bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
              >
                <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-[14px] text-red-700 dark:text-red-300">
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══ Results ═══ */}
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                ref={resultsRef}
                key="results"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.12 }
                  }
                }}
                className="flex flex-col gap-8 pt-8"
              >
                {/* Result card */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.25 } } }}>
                  <ResultCard result={result} />
                </motion.div>

                {/* Difference table */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.25 } } }}>
                  <DifferenceTableDisplay
                    table={result.differenceTable}
                    method={result.method}
                    targetX={result.targetX}
                  />
                </motion.div>

                {/* Graph */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.25 } } }}>
                  <Graph result={result} />
                </motion.div>

                {/* Step-by-step solution */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.25 } } }}>
                  <StepDisplay steps={result.steps} />
                </motion.div>

                {/* Final Answer */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.25 } } }}>
                  <FinalAnswer result={result} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══ Right: Sidebar (formula reference) ═══ */}
        <div className="hidden xl:block">
          <div className="sticky top-28 flex flex-col gap-6">
            <GlassCard hover={false} className="p-6">
              <h3 className="text-[16px] font-bold text-[var(--color-text-primary)] mb-5 text-center w-full">
                Quick Reference
              </h3>
              <div className="flex flex-col gap-5">
                <div>
                  <div className="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2 px-1">
                    Forward Formula
                  </div>
                  <div className="rounded-[var(--radius-lg)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-4 flex items-center justify-center overflow-x-auto w-full">
                    <FormulaDisplay
                      formula={input.derivativeOrder === 1 ? String.raw`f'(x) = \frac{1}{h}\left[\Delta y_0 + \frac{2u-1}{2!}\Delta^2 y_0 + \cdots\right]` : String.raw`f''(x) = \frac{1}{h^2}\left[\Delta^2 y_0 + (u-1)\Delta^3 y_0 + \cdots\right]`}
                      displayMode={true}
                      className="!m-0"
                    />
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2 px-1">
                    Backward Formula
                  </div>
                  <div className="rounded-[var(--radius-lg)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-4 flex items-center justify-center overflow-x-auto w-full">
                    <FormulaDisplay
                      formula={input.derivativeOrder === 1 ? String.raw`f'(x) = \frac{1}{h}\left[\nabla y_n + \frac{2u+1}{2!}\nabla^2 y_n + \cdots\right]` : String.raw`f''(x) = \frac{1}{h^2}\left[\nabla^2 y_n + (u+1)\nabla^3 y_n + \cdots\right]`}
                      displayMode={true}
                      className="!m-0"
                    />
                  </div>
                </div>

                <div className="px-1 flex flex-col items-center w-full">
                  <div className="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2 text-center">
                    When to use
                  </div>
                  <div className="flex justify-center w-full">
                    <p className="text-[12px] text-[var(--color-text-secondary)] leading-relaxed text-left">
                      <strong className="text-[var(--color-text-primary)] font-semibold">Forward:</strong> Target x is near x₀ (start)
                      <br />
                      <strong className="text-[var(--color-text-primary)] font-semibold">Backward:</strong> Target x is near xₙ (end)
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard hover={false} className="p-5 flex flex-col items-center">
              <h3 className="text-[16px] font-bold text-[var(--color-text-primary)] mb-4 text-center w-full">
                Tips
              </h3>
              <div className="flex justify-center w-full">
                <ul className="flex flex-col gap-3 text-[13px] text-[var(--color-text-secondary)]">
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] flex-shrink-0" />
                    <span>x values must be equally spaced</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] flex-shrink-0" />
                    <span>At least 3 data points required</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                    <span>More points = higher accuracy</span>
                  </li>
                </ul>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
