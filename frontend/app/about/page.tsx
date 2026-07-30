'use client';

import { motion } from 'framer-motion';
import {
  Code2,
  GraduationCap,
  User,
  BookOpen,
  UserCheck,
  Layers,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { ScrollReveal } from '@/components/animations/scroll-reveal';

const techStack = [
  { category: 'Frontend', items: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'KaTeX', 'Recharts'] },
  { category: 'Backend', items: ['NestJS', 'TypeScript', 'Swagger', 'class-validator', 'Jest'] },
  { category: 'Export', items: ['html-to-image', 'jsPDF', 'html2canvas'] },
  { category: 'Design', items: ['Apple HIG', 'Glassmorphism', 'Lucide Icons', 'shadcn/ui patterns'] },
];

const info = [
  { icon: Code2, label: 'Project', value: 'Numerical Differentiation Calculator' },
  { icon: User, label: 'Developer', value: 'Sadia Islam Joya, Farhad Islam Hridoy, Tanzim Masud Niloy, Irfan Ahmed Sohan' },
  { icon: GraduationCap, label: 'University', value: 'Daffodil International University' },
  { icon: BookOpen, label: 'Course', value: 'Numerical Methods' },
  { icon: UserCheck, label: 'Course Teacher', value: 'Noor Muhammad' },
  { icon: Layers, label: 'Version', value: '1.0.0' },
];

export default function AboutPage() {
  return (
    <div className="container-app max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-[var(--color-text-primary)] tracking-[-0.02em] mb-2">
          About
        </h1>
        <p className="text-[var(--color-text-secondary)] text-[16px]">
          About this project, the developer, and the technology behind it.
        </p>
      </motion.div>

      <div className="flex flex-col gap-8">
        {/* Project info */}
        <ScrollReveal>
          <GlassCard hover={false}>
            <h2 className="text-[18px] font-bold text-[var(--color-text-primary)] text-center w-full mb-6">
              Project Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {info.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)]"
                >
                  <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] flex items-center justify-center flex-shrink-0">
                    <item.icon size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
                      {item.label}
                    </div>
                    <div className="text-[14px] font-semibold text-[var(--color-text-primary)]">
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </ScrollReveal>

        {/* Project description */}
        <ScrollReveal delay={0.1}>
          <GlassCard hover={false}>
            <h2 className="text-[18px] font-bold text-[var(--color-text-primary)] text-center w-full mb-4">
              What This Project Does
            </h2>
            <div className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed space-y-3">
              <p>
                This application computes numerical derivatives using two classical methods
                from Newton&apos;s finite-difference calculus: the Forward Difference formula
                and the Backward Difference formula.
              </p>
              <p>
                Given a set of equally spaced data points, the calculator automatically builds
                the complete difference table, applies the appropriate formula, and produces a
                step-by-step solution rendered in beautiful typeset mathematics (KaTeX).
              </p>
              <p>
                An interactive Recharts graph visualises the data, the interpolation polynomial,
                and the differentiation point. Results can be exported to PNG, SVG, PDF, or CSV.
              </p>
            </div>
          </GlassCard>
        </ScrollReveal>

        {/* Tech stack */}
        <ScrollReveal delay={0.2}>
          <GlassCard hover={false}>
            <h2 className="text-[18px] font-bold text-[var(--color-text-primary)] text-center w-full mb-6">
              Technology Stack
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {techStack.map((group) => (
                <div key={group.category}>
                  <h3 className="text-[13px] font-bold text-[var(--color-primary)] uppercase tracking-wider mb-3">
                    {group.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 rounded-full text-[12px] font-medium glass text-[var(--color-text-secondary)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </ScrollReveal>
      </div>
    </div>
  );
}
