'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sigma, FunctionSquare } from 'lucide-react';

interface DerivativeSelectorProps {
  value: 1 | 2;
  onChange: (order: 1 | 2) => void;
}

const orders = [
  {
    id: 1 as 1,
    label: '1st Derivative',
    icon: Sigma,
    description: "Computes f'(x)",
  },
  {
    id: 2 as 2,
    label: '2nd Derivative',
    icon: FunctionSquare,
    description: "Computes f''(x)",
  },
];

/**
 * Pill-style derivative selector with animated background indicator.
 */
export function DerivativeSelector({ value, onChange }: DerivativeSelectorProps) {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-[18px] font-bold text-[var(--color-text-primary)] text-center w-full">
        Derivative Order
      </h3>
      <div className="grid grid-cols-2 gap-6">
        {orders.map((order) => {
          const isActive = value === order.id;
          const Icon = order.icon;

          return (
            <motion.button
              key={order.id}
              type="button"
              onClick={() => onChange(order.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'relative w-full flex items-center gap-3 px-5 rounded-[var(--radius-lg)] cursor-pointer transition-colors text-left h-[80px]',
                isActive
                  ? 'text-white'
                  : 'glass text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
              )}
              aria-pressed={isActive}
              aria-label={order.label}
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
                  <div className="text-[14px] font-semibold">{order.label}</div>
                  <div
                    className={cn(
                      'text-[12px] mt-0.5',
                      isActive ? 'text-white/70' : 'text-[var(--color-text-tertiary)]',
                    )}
                  >
                    {order.description}
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
