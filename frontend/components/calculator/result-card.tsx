'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Printer, FileDown, Clock, Zap, ChevronDown, ChevronRight } from 'lucide-react';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { AnimatedCounter } from '@/components/animations/animated-counter';
import {
  exportToPdf,
  exportResultCsv,
  copyToClipboard,
  formatResultForCopy,
  printElement,
} from '@/lib/export';
import type { CalculationResult } from '@/types/calculator';
import { FormulaDisplay } from './formula-display';

interface ResultCardProps {
  result: CalculationResult;
}

/**
 * Final result card showing the derivative, method, execution time,
 * with copy/print/export actions.
 */
export function ResultCard({ result }: ResultCardProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [showFormula, setShowFormula] = useState(false);

  const methodName =
    result.method === 'newton-forward'
      ? "Newton's Forward Difference"
      : "Newton's Backward Difference";

  return (
    <div className="glass rounded-[var(--radius-xl)] shadow-lg overflow-hidden flex flex-col relative w-full">
      {/* Gradient accent bar */}
      <div className="h-1 bg-gradient-to-r from-[var(--color-gradient-start)] via-[var(--color-gradient-mid)] to-[var(--color-gradient-end)] w-full absolute top-0 left-0" />

      <div ref={printRef} className="p-8 pb-6 flex flex-col gap-6">
        {/* Header and Toolbar */}
        <div className="relative flex items-center justify-center min-h-[44px]">
          <div className="flex flex-col items-center justify-center text-center w-full">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Zap size={16} className="text-[var(--color-primary)]" />
              <span className="text-[12px] font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                Result
              </span>
            </div>
            <h3 className="text-[18px] font-bold text-[var(--color-text-primary)]">
              {methodName}
            </h3>
            <div className="text-[14px] text-[var(--color-text-secondary)] mt-1">
              {result.derivativeOrder === 2 ? 'Second' : 'First'} Derivative at x = {result.targetX}
            </div>
          </div>
          
          {/* Export Toolbar */}
          <div className="absolute right-2 top-0 flex items-center gap-2 bg-[var(--color-surface-elevated)] p-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)]">
            <button
              onClick={() => copyToClipboard(formatResultForCopy(result))}
              className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              aria-label="Copy"
              title="Copy to Clipboard"
            >
              <Copy size={14} />
            </button>
            <button
              onClick={() => printRef.current && printElement(printRef.current)}
              className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              aria-label="Print"
              title="Print"
            >
              <Printer size={14} />
            </button>
            <button
              onClick={() => printRef.current && exportToPdf(printRef.current, result.method, result.targetX)}
              className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              aria-label="Export PDF"
              title="Export as PDF"
            >
              <FileDown size={14} />
            </button>
            <button
              onClick={() => exportResultCsv(result)}
              className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              aria-label="Export CSV"
              title="Export as CSV"
            >
              <FileDown size={14} />
            </button>
          </div>
        </div>

        {/* Big derivative result */}
        <div className="text-[48px] font-bold gradient-text leading-tight -mt-2">
          <AnimatedCounter value={result.derivative} decimals={8} />
        </div>

        {/* Horizontal Stats Row */}
        <div className="flex items-center gap-6 py-4 border-y border-[var(--color-border)]">
          {[
            { label: 'h', value: String(result.h) },
            { label: 'u', value: String(result.u) },
            { label: 'Data points', value: String(result.xValues.length) },
            { label: 'Time', value: `${result.executionTimeMs} ms` },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                {item.label}
              </span>
              <span className="text-[14px] font-semibold text-[var(--color-text-primary)]">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Collapsible Formula */}
        <div>
          <button
            onClick={() => setShowFormula(!showFormula)}
            className="flex items-center gap-2 text-[13px] font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors focus:outline-none"
          >
            {showFormula ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            Formula Used
          </button>
          <AnimatePresence>
            {showFormula && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pt-4"
              >
                <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
                  <FormulaDisplay formula={result.formula} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
