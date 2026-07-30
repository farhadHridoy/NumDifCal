'use client';

import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface DataInputTableProps {
  numPoints: number;
  xValues: string[];
  yValues: string[];
  onNumPointsChange: (n: number) => void;
  onXChange: (index: number, value: string) => void;
  onYChange: (index: number, value: string) => void;
}

/**
 * Dynamic x/y data-entry table with Apple-style inputs and animated rows.
 */
export function DataInputTable({
  numPoints,
  xValues,
  yValues,
  onNumPointsChange,
  onXChange,
  onYChange,
}: DataInputTableProps) {
  return (
    <div className="glass rounded-[var(--radius-xl)] shadow-lg overflow-hidden flex flex-col relative w-full p-8">
      {/* Header with point count controls */}
      <div className="relative flex items-center justify-center mb-6 min-h-[32px]">
        <h3 className="text-[18px] font-bold text-[var(--color-text-primary)] text-center w-full">
          Data Points
        </h3>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onNumPointsChange(numPoints - 1)}
            disabled={numPoints <= 3}
            className="w-8 h-8 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-surface-hover)] transition-colors"
            aria-label="Remove data point"
          >
            <Minus size={14} className="text-[var(--color-text-primary)]" />
          </motion.button>
          <span className="text-[14px] font-semibold text-[var(--color-text-primary)] min-w-[24px] text-center">
            {numPoints}
          </span>
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onNumPointsChange(numPoints + 1)}
            disabled={numPoints >= 20}
            className="w-8 h-8 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-surface-hover)] transition-colors"
            aria-label="Add data point"
          >
            <Plus size={14} className="text-[var(--color-text-primary)]" />
          </motion.button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr className="bg-[var(--color-surface-hover)] h-[48px]">
                <th className="w-1/2 px-4 text-[12px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider text-center border-r border-[var(--color-border)]">
                  x
                </th>
                <th className="w-1/2 px-4 text-[12px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider text-center">
                  y = f(x)
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: numPoints }, (_, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  className="border-t border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors h-[48px]"
                >
                  <td className="p-0 border-r border-[var(--color-border)]">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={xValues[i] || ''}
                      onChange={(e) => onXChange(i, e.target.value)}
                      placeholder={`x${i}`}
                      className="w-full h-full px-4 py-3 bg-transparent text-[var(--color-text-primary)] text-[14px] font-bold text-center outline-none border border-transparent focus:border-[var(--color-primary)] transition-colors rounded-none"
                      aria-label={`x value ${i}`}
                    />
                  </td>
                  <td className="p-0">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={yValues[i] || ''}
                      onChange={(e) => onYChange(i, e.target.value)}
                      placeholder={`y${i}`}
                      className="w-full h-full px-4 py-3 bg-transparent text-[var(--color-text-primary)] text-[14px] font-bold text-center outline-none border border-transparent focus:border-[var(--color-primary)] transition-colors rounded-none"
                      aria-label={`y value ${i}`}
                    />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
