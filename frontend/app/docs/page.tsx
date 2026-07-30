'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { ScrollReveal } from '@/components/animations/scroll-reveal';

const endpoints = [
  {
    method: 'POST',
    path: '/api/newton-forward',
    description: 'Compute the first derivative using Newton\'s Forward Difference formula.',
    body: `{
  "xValues": [0, 1, 2, 3, 4],
  "yValues": [1, 2, 9, 28, 65],
  "targetX": 1.5
}`,
    response: 'Returns CalculationResult with difference table, steps, formula, derivative, and execution time.',
  },
  {
    method: 'POST',
    path: '/api/newton-backward',
    description: 'Compute the first derivative using Newton\'s Backward Difference formula.',
    body: `{
  "xValues": [0, 1, 2, 3, 4],
  "yValues": [1, 2, 9, 28, 65],
  "targetX": 3.5
}`,
    response: 'Returns CalculationResult with difference table, steps, formula, derivative, and execution time.',
  },
  {
    method: 'POST',
    path: '/api/difference-table',
    description: 'Generate a standalone difference table without computing a derivative.',
    body: `{
  "xValues": [0, 1, 2, 3, 4],
  "yValues": [1, 2, 9, 28, 65]
}`,
    response: 'Returns DifferenceTableResult with the full table and max order.',
  },
  {
    method: 'GET',
    path: '/api/examples',
    description: 'Returns a list of pre-built worked examples.',
    body: null,
    response: 'Returns an array of WorkedExample objects.',
  },
  {
    method: 'GET',
    path: '/api/health',
    description: 'Health check returning server status, uptime, and version.',
    body: null,
    response: '{ status, uptime, timestamp, version }',
  },
];

const validationRules = [
  'x and y arrays must have the same length.',
  'At least 3 data points are required (2 for difference table).',
  'All values must be finite numbers.',
  'x values must be equally spaced.',
  'Duplicate x values are not allowed.',
  'Step size h cannot be zero.',
];

export default function DocsPage() {
  return (
    <div className="container-app max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-[var(--color-text-primary)] tracking-[-0.02em] mb-2">
          API Documentation
        </h1>
        <p className="text-[var(--color-text-secondary)] text-[16px]">
          REST API reference for the Numerical Differentiation Calculator backend.
        </p>
        <p className="text-[14px] text-[var(--color-text-tertiary)] mt-2">
          Base URL: <code className="px-2 py-0.5 rounded-md bg-[var(--color-surface-elevated)] text-[var(--color-primary)] font-mono text-[13px]">http://localhost:3001</code>
          {' · '}
          Swagger UI: <code className="px-2 py-0.5 rounded-md bg-[var(--color-surface-elevated)] text-[var(--color-primary)] font-mono text-[13px]">/api/docs</code>
        </p>
      </motion.div>

      <div className="flex flex-col gap-6">
        {/* Endpoints */}
        {endpoints.map((ep, i) => (
          <ScrollReveal key={ep.path} delay={i * 0.06}>
            <GlassCard hover={false}>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`px-2.5 py-1 rounded-md text-[12px] font-bold tracking-wider ${
                    ep.method === 'POST'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                  }`}
                >
                  {ep.method}
                </span>
                <code className="text-[15px] font-mono font-semibold text-[var(--color-text-primary)]">
                  {ep.path}
                </code>
              </div>
              <p className="text-[14px] text-[var(--color-text-secondary)] mb-4">
                {ep.description}
              </p>

              {ep.body && (
                <div className="mb-4">
                  <div className="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">
                    Request Body
                  </div>
                  <pre className="p-4 rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)] text-[13px] font-mono text-[var(--color-text-primary)] overflow-x-auto border border-[var(--color-border)]">
                    {ep.body}
                  </pre>
                </div>
              )}

              <div>
                <div className="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">
                  Response
                </div>
                <p className="text-[13px] text-[var(--color-text-secondary)]">
                  {ep.response}
                </p>
              </div>
            </GlassCard>
          </ScrollReveal>
        ))}

        {/* Validation */}
        <ScrollReveal>
          <GlassCard hover={false}>
            <h2 className="text-[18px] font-bold text-[var(--color-text-primary)] mb-4">
              Validation Rules
            </h2>
            <ul className="flex flex-col gap-2.5">
              {validationRules.map((rule) => (
                <li key={rule} className="text-[14px] text-[var(--color-text-secondary)] flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0" />
                  {rule}
                </li>
              ))}
            </ul>
          </GlassCard>
        </ScrollReveal>

        {/* Running locally */}
        <ScrollReveal>
          <GlassCard hover={false}>
            <h2 className="text-[18px] font-bold text-[var(--color-text-primary)] mb-4">
              Running Locally
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-[13px] font-bold text-[var(--color-text-secondary)] mb-2">
                  1. Backend
                </div>
                <pre className="p-4 rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)] text-[13px] font-mono text-[var(--color-text-primary)] overflow-x-auto border border-[var(--color-border)]">
{`cd backend
npm install
npm run start:dev`}
                </pre>
              </div>
              <div>
                <div className="text-[13px] font-bold text-[var(--color-text-secondary)] mb-2">
                  2. Frontend
                </div>
                <pre className="p-4 rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)] text-[13px] font-mono text-[var(--color-text-primary)] overflow-x-auto border border-[var(--color-border)]">
{`cd frontend
npm install
npm run dev`}
                </pre>
              </div>
              <div>
                <div className="text-[13px] font-bold text-[var(--color-text-secondary)] mb-2">
                  3. Run Tests
                </div>
                <pre className="p-4 rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)] text-[13px] font-mono text-[var(--color-text-primary)] overflow-x-auto border border-[var(--color-border)]">
{`cd backend
npm test`}
                </pre>
              </div>
            </div>
          </GlassCard>
        </ScrollReveal>
      </div>
    </div>
  );
}
