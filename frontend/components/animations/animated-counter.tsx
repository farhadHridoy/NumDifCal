'use client';

import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

/**
 * Animated number counter with spring physics.
 */
export function AnimatedCounter({
  value,
  decimals = 2,
  className,
  prefix = '',
  suffix = '',
  duration = 1.5,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  const spring = useSpring(0, {
    stiffness: 50,
    damping: 20,
    duration: duration * 1000,
  });

  const display = useTransform(spring, (v) =>
    `${prefix}${v.toFixed(decimals)}${suffix}`,
  );

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  return <motion.span ref={ref} className={className}>{display}</motion.span>;
}
