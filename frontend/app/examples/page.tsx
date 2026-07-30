'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass-card';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { DifferenceTableDisplay } from '@/components/calculator/difference-table';
import { StepDisplay } from '@/components/calculator/step-display';
import { ResultCard } from '@/components/calculator/result-card';
import { ScrollReveal } from '@/components/animations/scroll-reveal';
import {
  computeNewtonForward,
  computeNewtonBackward,
} from '@/lib/math-engine';
import type { CalculationResult, WorkedExample } from '@/types/calculator';

const workedExamples: WorkedExample[] = [
  {
    id: 'cubic-forward',
    title: 'Cubic Polynomial — Forward',
    description: "Given f(x) = x³ + 1, find f'(1.5) using Newton's Forward Difference.",
    xValues: [0, 1, 2, 3, 4],
    yValues: [1, 2, 9, 28, 65],
    targetX: 1.5,
    method: 'newton-forward',
  },
  {
    id: 'cubic-backward',
    title: 'Cubic Polynomial — Backward',
    description: "Given f(x) = x³ + 1, find f'(3.5) using Newton's Backward Difference.",
    xValues: [0, 1, 2, 3, 4],
    yValues: [1, 2, 9, 28, 65],
    targetX: 3.5,
    method: 'newton-backward',
  },
  {
    id: 'exp-forward',
    title: 'Exponential — Forward',
    description: "Given tabulated eˣ values, find f'(1.22) using Newton's Forward Difference.",
    xValues: [1.0, 1.1, 1.2, 1.3, 1.4, 1.5],
    yValues: [2.7183, 3.0042, 3.3201, 3.6693, 4.0552, 4.4817],
    targetX: 1.22,
    method: 'newton-forward',
  },
  {
    id: 'sin-backward',
    title: 'Sine Function — Backward',
    description: "Given tabulated sin(x), find f'(1.29) using Newton's Backward Difference.",
    xValues: [1.0, 1.1, 1.2, 1.3, 1.4],
    yValues: [0.8415, 0.8912, 0.9320, 0.9636, 0.9854],
    targetX: 1.29,
    method: 'newton-backward',
  },
  {
    id: 'quadratic-forward',
    title: 'Quadratic — Forward',
    description: "Given eˣ data near 0, find f'(0.1) using Newton's Forward Difference.",
    xValues: [0.0, 0.2, 0.4, 0.6, 0.8],
    yValues: [1.0, 1.2214, 1.4918, 1.8221, 2.2255],
    targetX: 0.1,
    method: 'newton-forward',
  },
  {
    id: 'log-backward',
    title: 'Logarithmic — Backward',
    description: "Given log₁₀(x) data, find f'(2.36) using Newton's Backward Difference.",
    xValues: [2.0, 2.1, 2.2, 2.3, 2.4],
    yValues: [0.3010, 0.3222, 0.3424, 0.3617, 0.3802],
    targetX: 2.36,
    method: 'newton-backward',
  },
];

export default function ExamplesPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, CalculationResult>>({});

  function runExample(example: WorkedExample) {
    if (results[example.id]) {
      setActiveId(activeId === example.id ? null : example.id);
      return;
    }

    const calc =
      example.method === 'newton-forward'
        ? computeNewtonForward(example.xValues, example.yValues, example.targetX)
        : computeNewtonBackward(example.xValues, example.yValues, example.targetX);

    setResults((prev) => ({ ...prev, [example.id]: calc }));
    setActiveId(example.id);
  }

  return (
    <div className="container-app max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-[var(--color-text-primary)] tracking-[-0.02em] mb-2">
          Worked Examples
        </h1>
        <p className="text-[var(--color-text-secondary)] text-[16px] mb-4">
          Click any example to instantly see the complete step-by-step solution.
        </p>
        <Link href="/calculator">
          <MagneticButton variant="secondary" size="sm">
            Open in Calculator <ChevronRight size={14} />
          </MagneticButton>
        </Link>
      </motion.div>

      <div className="flex flex-col gap-4">
        {workedExamples.map((example, i) => (
          <ScrollReveal key={example.id} delay={i * 0.06}>
            <div>
              <GlassCard
                hover={false}
                className="cursor-pointer"
              >
                <div
                  onClick={() => runExample(example)}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          example.method === 'newton-forward'
                            ? 'bg-[rgba(79,70,255,0.1)] text-[var(--color-primary)]'
                            : 'bg-[rgba(168,85,247,0.1)] text-[var(--color-accent)]'
                        }`}
                      >
                        {example.method === 'newton-forward' ? 'Forward' : 'Backward'}
                      </span>
                    </div>
                    <h3 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-1">
                      {example.title}
                    </h3>
                    <p className="text-[13px] text-[var(--color-text-secondary)]">
                      {example.description}
                    </p>
                  </div>
                  <MagneticButton
                    variant="primary"
                    size="sm"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      runExample(example);
                    }}
                  >
                    <Play size={14} />
                    {results[example.id] ? 'Toggle' : 'Solve'}
                  </MagneticButton>
                </div>
              </GlassCard>

              {/* Expanded solution */}
              <AnimatePresence>
                {activeId === example.id && results[example.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 flex flex-col gap-6">
                      <ResultCard result={results[example.id]} />
                      <GlassCard hover={false}>
                        <DifferenceTableDisplay
                          table={results[example.id].differenceTable}
                          method={results[example.id].method}
                          targetX={results[example.id].targetX}
                        />
                      </GlassCard>
                      <StepDisplay steps={results[example.id].steps} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
