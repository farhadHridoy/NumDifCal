'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, type ReactNode, type MouseEvent } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

/**
 * Apple-style glassmorphism card with optional mouse-reactive tilt and glow.
 */
export function GlassCard({ children, className, hover = true, glow = false }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), {
    stiffness: 300,
    damping: 30,
  });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!ref.current || !hover) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={hover ? { rotateX, rotateY, transformPerspective: 800 } : undefined}
      whileHover={hover ? { y: -4, boxShadow: 'var(--shadow-lg)' } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn(
        'glass rounded-[var(--radius-xl)] p-6 md:p-8 transition-shadow',
        glow && 'shadow-[var(--shadow-glow)]',
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
