'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { FormulaDisplay } from './formula-display';
import type { CalculationStep } from '@/types/calculator';

interface StepDisplayProps {
  steps: CalculationStep[];
}

/**
 * Renders the step-by-step solution as an accordion.
 */
export function StepDisplay({ steps }: StepDisplayProps) {
  const [openStep, setOpenStep] = useState<number | null>(null);

  const toggleStep = (index: number) => {
    setOpenStep(openStep === index ? null : index);
  };

  return (
    <div className="glass rounded-[var(--radius-xl)] shadow-lg overflow-hidden flex flex-col relative w-full p-8">
      <h3 className="text-[18px] font-bold text-[var(--color-text-primary)] mb-6 text-center w-full">
        Step-by-Step Solution
      </h3>

      <div className="flex flex-col gap-3 w-full">
        {steps.map((step, i) => {
          const isOpen = openStep === i;

          return (
            <div
              key={step.stepNumber}
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] overflow-hidden"
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleStep(i)}
                className="w-full flex items-center gap-3 p-4 hover:bg-[var(--color-surface-hover)] transition-colors text-left focus:outline-none"
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <ChevronDown size={16} className="text-[var(--color-text-secondary)] flex-shrink-0" />
                ) : (
                  <ChevronRight size={16} className="text-[var(--color-text-secondary)] flex-shrink-0" />
                )}

                <span className="text-[14px] font-semibold text-[var(--color-text-primary)]">
                  Step {step.stepNumber} - {step.title}
                </span>
              </button>

              {/* Accordion Content */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-5 md:p-6 border-t border-[var(--color-border)] bg-[rgba(255,255,255,0.02)]">
                      <p className="text-[13px] text-[var(--color-text-secondary)] mb-4 ml-6">
                        {step.description}
                      </p>

                      <div className="ml-6">
                        <FormulaDisplay formula={step.formula} />
                      </div>

                      {step.result && (
                        <div className="ml-6 mt-4 px-4 py-3 rounded-[var(--radius-md)] bg-[rgba(79,70,255,0.04)] border border-[rgba(79,70,255,0.1)]">
                          <FormulaDisplay
                            formula={step.result}
                            className="!bg-transparent !border-none !shadow-none !p-0"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
