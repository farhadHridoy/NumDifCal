'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { FormulaDisplay } from '@/components/calculator/formula-display';
import { ScrollReveal } from '@/components/animations/scroll-reveal';

const sections = [
  {
    title: 'What is Numerical Differentiation?',
    content: `Numerical differentiation is a technique for approximating the derivative of a function f(x) using discrete data points rather than an analytical expression. When the function is known only through tabulated values — as in experimental data — numerical methods provide the only way to estimate rates of change.`,
    formula: `f'(x) \\approx \\frac{f(x+h) - f(x)}{h}`,
  },
  {
    title: 'Difference Tables',
    content: `A difference table organises successive differences of the function values. Given equally spaced points x₀, x₁, …, xₙ with spacing h, the forward differences are defined recursively. The first-order forward difference is the simplest building block.`,
    formula: `\\Delta y_i = y_{i+1} - y_i \\qquad \\Delta^k y_i = \\Delta^{k-1} y_{i+1} - \\Delta^{k-1} y_i`,
  },
  {
    title: "Newton's Forward Difference Formula (First Derivative)",
    content: `Newton's forward interpolation polynomial is used when the point of interest lies near the beginning of the data set. By differentiating this polynomial with respect to x, we obtain the forward difference formula for the first derivative. Here u = (x − x₀) / h.`,
    formula: `f'(x) = \\frac{1}{h}\\left[\\Delta y_0 + \\frac{2u - 1}{2!}\\Delta^2 y_0 + \\frac{3u^2 - 6u + 2}{3!}\\Delta^3 y_0 + \\frac{4u^3 - 18u^2 + 22u - 6}{4!}\\Delta^4 y_0 + \\cdots\\right]`,
  },
  {
    title: "Newton's Backward Difference Formula (First Derivative)",
    content: `Newton's backward interpolation polynomial is used when the point of interest lies near the end of the data set. The backward differences ∇ᵏyₙ are read from the last diagonal of the difference table. Here u = (x − xₙ) / h.`,
    formula: `f'(x) = \\frac{1}{h}\\left[\\nabla y_n + \\frac{2u + 1}{2!}\\nabla^2 y_n + \\frac{3u^2 + 6u + 2}{3!}\\nabla^3 y_n + \\frac{4u^3 + 18u^2 + 22u + 6}{4!}\\nabla^4 y_n + \\cdots\\right]`,
  },
  {
    title: "Second Derivative (Forward Formula)",
    content: `By differentiating the first derivative formula again with respect to x, we obtain the second derivative. Because each differentiation introduces a factor of (1/h) from the chain rule, the overall scaling factor becomes 1/h².`,
    formula: `f''(x) = \\frac{1}{h^2}\\left[\\Delta^2 y_0 + (u - 1)\\Delta^3 y_0 + \\frac{11 - 18u + 6u^2}{12}\\Delta^4 y_0 + \\cdots\\right]`,
  },
  {
    title: "Second Derivative (Backward Formula)",
    content: `Similarly, applying a second derivative to the backward interpolation polynomial gives the second derivative formula for points near the end of the table.`,
    formula: `f''(x) = \\frac{1}{h^2}\\left[\\nabla^2 y_n + (u + 1)\\nabla^3 y_n + \\frac{11 + 18u + 6u^2}{12}\\nabla^4 y_n + \\cdots\\right]`,
  },
];

const advantages = [
  'Works with tabulated data — no closed-form expression needed',
  'Systematic approach using difference tables',
  'Increasing accuracy with more data points',
  'Both forward and backward variants for flexibility',
  'Easy to implement computationally',
];

const disadvantages = [
  'Requires equally spaced data points',
  'Accuracy decreases away from the reference point',
  'Sensitive to rounding errors in data',
  'Higher-order differences may amplify noise',
  'Not suitable for irregularly spaced data',
];

const applications = [
  'Engineering: velocity and acceleration from position data',
  'Physics: rate of change in experimental measurements',
  'Finance: computing growth rates from tabulated data',
  'Signal processing: estimating slopes of sampled signals',
  'Chemistry: reaction rate estimation from concentration data',
];

export default function TheoryPage() {
  return (
    <div className="container-app max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-[var(--color-text-primary)] tracking-[-0.02em] mb-2">
          Theory
        </h1>
        <p className="text-[var(--color-text-secondary)] text-[16px]">
          Mathematical foundations of Newton&apos;s difference-based differentiation methods.
        </p>
      </motion.div>

      {/* Main content sections */}
      <div className="flex flex-col gap-8">
        {sections.map((section, i) => (
          <ScrollReveal key={section.title} delay={i * 0.1}>
            <GlassCard hover={false}>
              <h2 className="text-[18px] font-bold text-[var(--color-text-primary)] text-center w-full mb-4">
                {section.title}
              </h2>
              <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed mb-6">
                {section.content}
              </p>
              <FormulaDisplay formula={section.formula} />
            </GlassCard>
          </ScrollReveal>
        ))}

        {/* Derivation note */}
        <ScrollReveal>
          <GlassCard hover={false}>
            <h2 className="text-[18px] font-bold text-[var(--color-text-primary)] text-center w-full mb-4">
              Deriving the Coefficients
            </h2>
            <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed mb-4">
              The coefficients come from differentiating the generalised binomial product.
              For the forward case, each order-k term involves the product u(u−1)(u−2)…(u−k+1)/k!.
              Differentiating with respect to u gives:
            </p>
            <FormulaDisplay
              formula={`\\frac{d}{du}\\left[\\frac{u(u-1)(u-2)\\cdots(u-k+1)}{k!}\\right] = \\frac{1}{k!}\\sum_{i=0}^{k-1}\\prod_{\\substack{j=0 \\\\ j \\neq i}}^{k-1}(u - j)`}
            />
            <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed mt-4">
              Since dy/dx = (1/h) · df/du, we divide the entire expression by h. To find the second derivative, we apply the product rule a second time (resulting in a double summation) and divide by h².
            </p>
          </GlassCard>
        </ScrollReveal>

        {/* Advantages / Disadvantages / Applications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScrollReveal delay={0}>
            <GlassCard hover={false} className="h-full">
              <h3 className="text-[15px] font-bold text-green-600 dark:text-green-400 mb-4">
                ✓ Advantages
              </h3>
              <ul className="flex flex-col gap-2.5">
                {advantages.map((item) => (
                  <li key={item} className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <GlassCard hover={false} className="h-full">
              <h3 className="text-[15px] font-bold text-red-500 dark:text-red-400 mb-4">
                ✗ Disadvantages
              </h3>
              <ul className="flex flex-col gap-2.5">
                {disadvantages.map((item) => (
                  <li key={item} className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <GlassCard hover={false} className="h-full">
              <h3 className="text-[15px] font-bold text-[var(--color-primary)] mb-4">
                ◆ Applications
              </h3>
              <ul className="flex flex-col gap-2.5">
                {applications.map((item) => (
                  <li key={item} className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
