'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Table2,
  ListOrdered,
  LineChart,
  FileDown,
  ChevronRight,
  BookOpen,
  Calculator,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { ScrollReveal } from '@/components/animations/scroll-reveal';

const features = [
  {
    icon: ArrowRight,
    title: 'Newton Forward',
    description: 'Compute derivatives near the beginning of equally-spaced data using forward differences.',
    color: '#4F46FF',
  },
  {
    icon: ArrowLeft,
    title: 'Newton Backward',
    description: 'Compute derivatives near the end of equally-spaced data using backward differences.',
    color: '#6D63FF',
  },
  {
    icon: Table2,
    title: 'Difference Table',
    description: 'Automatically generate complete forward difference tables up to any order.',
    color: '#7C3AED',
  },
  {
    icon: ListOrdered,
    title: 'Step-by-Step',
    description: 'Every calculation comes with a detailed, numbered step-by-step solution.',
    color: '#A855F7',
  },
  {
    icon: LineChart,
    title: 'Interactive Graph',
    description: 'Visualize data points, interpolation curves, and derivative points interactively.',
    color: '#C084FC',
  },
  {
    icon: FileDown,
    title: 'Export Results',
    description: 'Export to PNG, SVG, PDF, or CSV. Copy, print, or share your results.',
    color: '#E879F9',
  },
];

export default function HomePage() {
  return (
    <div className="container-app">
      {/* ═══ Hero ═══ */}
      <section className="text-center" style={{ paddingTop: '16px', paddingBottom: '64px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >


          {/* Title */}
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--color-text-primary)] mb-6">
            Numerical
            <br />
            <span className="gradient-text">Differentiation</span>
            <br />
            Calculator
          </h1>

          {/* Subtitle */}
          <div className="flex flex-col items-center w-full">
            <p className="max-w-3xl text-[clamp(1rem,2vw,1.25rem)] text-[var(--color-text-secondary)] leading-relaxed mb-10 text-center">
              Solve numerical differentiation using Newton Forward and Newton Backward
              Difference Methods with automatically generated Difference Tables,
              step-by-step solutions, and interactive graphs.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/calculator">
              <MagneticButton variant="primary" size="lg">
                <Calculator size={18} />
                Start Calculator
                <ChevronRight size={16} />
              </MagneticButton>
            </Link>
            <Link href="/theory">
              <MagneticButton variant="secondary" size="lg">
                <BookOpen size={18} />
                Learn Theory
              </MagneticButton>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ═══ Feature Cards ═══ */}
      <section style={{ paddingBottom: '64px' }}>
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold text-[var(--color-text-primary)] tracking-[-0.02em] mb-3 text-center">
              Everything You Need
            </h2>
            <p className="text-[var(--color-text-secondary)] text-[16px] max-w-lg mx-auto text-center text-balance">
              A complete toolkit for numerical differentiation — from input to export.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 0.08} className="h-full">
              <GlassCard className="h-full">
                <div
                  className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-5 mx-auto"
                  style={{ background: `${feature.color}12` }}
                >
                  <feature.icon
                    size={22}
                    style={{ color: feature.color }}
                  />
                </div>
                <h3 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-2 text-center">
                  {feature.title}
                </h3>
                <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed text-center text-balance">
                  {feature.description}
                </p>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══ CTA Section ═══ */}
      <ScrollReveal>
        <section style={{ paddingBottom: '64px' }}>
          <div className="rounded-[var(--radius-2xl)] bg-gradient-to-r from-[var(--color-gradient-start)] via-[var(--color-gradient-mid)] to-[var(--color-gradient-end)] p-8 md:p-16 text-center relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-white tracking-[-0.02em] mb-4 text-center">
                Ready to Calculate?
              </h2>
              <p className="text-white/70 text-[16px] max-w-md mx-auto mb-8 text-center text-balance">
                Enter your data points and get instant, step-by-step numerical derivatives.
              </p>
              <Link href="/calculator">
                <MagneticButton
                  variant="secondary"
                  size="lg"
                  className="!bg-white !text-[var(--color-primary)] font-semibold shadow-xl"
                >
                  Open Calculator
                  <ChevronRight size={16} />
                </MagneticButton>
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
