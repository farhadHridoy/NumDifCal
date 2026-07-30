'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';
import { cn } from '@/lib/utils';

interface FormulaDisplayProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

/**
 * Renders a KaTeX formula string into beautiful typeset mathematics.
 */
export function FormulaDisplay({
  formula,
  displayMode = true,
  className,
}: FormulaDisplayProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && formula) {
      try {
        katex.render(formula, ref.current, {
          displayMode,
          throwOnError: false,
          trust: true,
          strict: false,
        });
      } catch {
        if (ref.current) {
          ref.current.textContent = formula;
        }
      }
    }
  }, [formula, displayMode]);

  return (
    <div
      ref={ref}
      className={cn(
        'katex-block overflow-x-auto',
        className,
      )}
      aria-label="Mathematical formula"
    />
  );
}
