'use client';

import { Download } from 'lucide-react';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { exportDifferenceTableCsv } from '@/lib/export';
import { cn } from '@/lib/utils';
import type { DifferenceTableRow } from '@/types/calculator';

interface DifferenceTableDisplayProps {
  table: DifferenceTableRow[];
  method: string;
  targetX: number;
  highlightRow?: number;
}

/**
 * Professional Apple-style difference table with sticky header,
 * hover animations, highlighted row, and CSV export.
 */
export function DifferenceTableDisplay({
  table,
  method,
  targetX,
  highlightRow,
}: DifferenceTableDisplayProps) {
  if (table.length === 0) return null;

  const maxOrder = table[0].differences.length;

  const formatNumber = (num: number) => 
    Number.isInteger(num) ? num : Number(num.toFixed(4));

  const isValueHighlighted = (rowIndex: number, colIndex: number) => {
    return highlightRow !== undefined && rowIndex === highlightRow;
  };

  return (
    <div className="glass rounded-[var(--radius-xl)] shadow-lg overflow-hidden flex flex-col relative w-full p-8">
      <div className="relative flex items-center justify-center mb-6 min-h-[32px]">
        <h3 className="text-[18px] font-bold text-[var(--color-text-primary)] text-center w-full">
          Difference Table
        </h3>
        <div className="absolute right-2">
          <MagneticButton
            variant="ghost"
            size="sm"
            onClick={() => exportDifferenceTableCsv(table, method, targetX)}
            aria-label="Export difference table as CSV"
          >
            <Download size={14} />
            Export CSV
          </MagneticButton>
        </div>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full border-collapse min-w-[500px]">
            <thead className="sticky top-0 z-10 bg-[var(--color-surface-elevated)] shadow-sm">
              <tr>
                <th className="px-4 py-3 text-[12px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider text-center w-[80px] border-b border-r border-[var(--color-border)]">
                  x
                </th>
                <th className="px-4 py-3 text-[12px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider text-center w-[100px] border-b border-r border-[var(--color-border)]">
                  y = f(x)
                </th>
                {Array.from({ length: maxOrder }, (_, k) => {
                  const order = k + 1;
                  return (
                    <th
                      key={k}
                      className="px-4 py-3 text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider text-center border-b border-r border-[var(--color-border)] last:border-r-0"
                    >
                      {order === 1 ? 'Δy' : `Δ${order}y`}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {table.map((row, i) => (
                <tr 
                  key={i} 
                  className="even:bg-[var(--color-surface-hover)] transition-colors hover:bg-[rgba(79,70,255,0.05)] h-[48px]"
                >
                  <td className="px-4 text-[13px] font-medium text-[var(--color-text-primary)] border-r border-[var(--color-border)] text-center">
                    {formatNumber(row.x)}
                  </td>
                  <td className="px-4 text-[13px] font-medium text-[var(--color-text-primary)] border-r border-[var(--color-border)] text-center">
                    {formatNumber(row.y)}
                  </td>
                  {Array.from({ length: maxOrder }, (_, j) => {
                    const val = row.differences[j];
                    const isHighlighted = isValueHighlighted(i, j);

                    return (
                      <td
                        key={j}
                        className={cn(
                          'px-4 text-[13px] text-center border-r border-[var(--color-border)] last:border-r-0 transition-colors duration-300',
                          isHighlighted
                            ? 'font-bold text-[var(--color-primary)] bg-[rgba(79,70,255,0.1)]'
                            : 'text-[var(--color-text-secondary)]',
                          val === null && 'opacity-30',
                        )}
                      >
                        {val !== null ? formatNumber(val) : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/** Convert a number to Unicode superscript */
function superscript(n: number): string {
  const superscripts: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  };
  return String(n)
    .split('')
    .map((d) => superscripts[d] || d)
    .join('');
}
