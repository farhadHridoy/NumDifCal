'use client';

import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/animations/animated-counter';
import type { CalculationResult } from '@/types/calculator';

interface FinalAnswerProps {
  result: CalculationResult;
}

export function FinalAnswer({ result }: FinalAnswerProps) {
  const methodName =
    result.method === 'newton-forward'
      ? "Newton Forward Difference"
      : "Newton Backward Difference";

  return (
    <div className="relative glass rounded-[var(--radius-xl)] shadow-lg p-8 w-full overflow-hidden border border-[var(--color-primary)]">
      {/* Intense purple glow background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(79,70,255,0.08)] to-[rgba(168,85,247,0.15)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[var(--color-primary)] opacity-[0.15] blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center gap-6">
        <h2 className="text-[14px] font-bold text-[var(--color-primary)] uppercase tracking-[0.2em]">
          Final Answer
        </h2>

        <div className="flex flex-col items-center gap-2">
          <div className="text-[18px] font-semibold text-[var(--color-text-secondary)]">
            f'({result.targetX}) =
          </div>
          <div className="text-[56px] md:text-[72px] font-bold text-[var(--color-text-primary)] leading-none tracking-tight" style={{ textShadow: '0 0 40px rgba(168,85,247,0.4)' }}>
            <AnimatedCounter value={result.derivative} decimals={8} />
          </div>
        </div>

        <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[13px] font-medium text-[var(--color-text-tertiary)] mt-2">
          {methodName}
        </div>
      </div>
    </div>
  );
}
