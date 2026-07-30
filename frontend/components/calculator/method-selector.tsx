'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MethodType } from '@/types/calculator';

interface MethodSelectorProps {
  value: MethodType;
  onChange: (method: MethodType) => void;
}

const methods = [
  {
    id: 'newton-forward' as MethodType,
    label: 'Newton Forward',
    icon: ArrowRight,
    description: 'Best when x is near the beginning of the table',
  },
  {
    id: 'newton-backward' as MethodType,
    label: 'Newton Backward',
    icon: ArrowLeft,
    description: 'Best when x is near the end of the table',
  },
];

/**
 * Pill-style method selector with animated background indicator.
 */
export function MethodSelector({ value, onChange }: MethodSelectorProps) {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-[18px] font-bold text-[var(--color-text-primary)] text-center w-full">
        Select Method
      </h3>
      <div className="grid grid-cols-2 gap-6">
        {methods.map((method) => {
          const isActive = value === method.id;
          const Icon = method.icon;

          return (
            <motion.button
              key={method.id}
              type="button"
              onClick={() => onChange(method.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'relative w-full flex items-center gap-3 px-5 rounded-[var(--radius-lg)] cursor-pointer transition-colors text-left h-[80px]',
                isActive
                  ? 'text-white'
                  : 'glass text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
              )}
              aria-pressed={isActive}
              aria-label={method.label}
            >
              {isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-[var(--radius-lg)] bg-gradient-to-r from-[var(--color-gradient-start)] via-[var(--color-gradient-mid)] to-[var(--color-gradient-end)]"
                  style={{ boxShadow: 'var(--shadow-glow)' }}
                />
              )}
              <div className="relative z-10 flex items-center gap-3">
                <div
                  className={cn(
                    'w-9 h-9 rounded-[12px] flex items-center justify-center',
                    isActive
                      ? 'bg-white/20'
                      : 'bg-[var(--color-surface-hover)]',
                  )}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <div className="text-[14px] font-semibold">{method.label}</div>
                  <div
                    className={cn(
                      'text-[12px] mt-0.5',
                      isActive ? 'text-white/70' : 'text-[var(--color-text-tertiary)]',
                    )}
                  >
                    {method.description}
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
