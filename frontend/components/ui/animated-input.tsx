'use client';

import { useState, useId } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  centered?: boolean;
  size?: 'default' | 'lg';
}

/**
 * Apple-style input with floating label, blur background, and animated focus ring.
 */
export function AnimatedInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  className,
  disabled = false,
  id: customId,
  centered = false,
  size = 'default',
}: AnimatedInputProps) {
  const generatedId = useId();
  const id = customId || generatedId;
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  return (
    <div className={cn('relative', className)}>
      <motion.div
        className="absolute inset-0 rounded-[var(--radius-md)] pointer-events-none"
        animate={{
          boxShadow: focused
            ? '0 0 0 2px var(--color-primary), 0 0 20px rgba(79, 70, 255, 0.1)'
            : '0 0 0 1px var(--color-border)',
        }}
        transition={{ duration: 0.2 }}
      />
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        placeholder={centered ? label : (isActive ? placeholder : undefined)}
        className={cn(
          'w-full px-4 rounded-[var(--radius-md)] font-medium',
          size === 'lg' 
            ? 'h-[50px] text-[18px]' 
            : 'pt-5 pb-2 text-[14px]',
          centered ? 'text-center' : 'text-left',
          'bg-[var(--color-input)] hover:bg-[var(--color-input-hover)] backdrop-blur-xl text-[var(--color-text-primary)]',
          'outline-none border-none transition-all',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )}
        aria-label={label}
      />
      {!centered && (
        <motion.label
          htmlFor={id}
          className={cn(
            'absolute pointer-events-none text-[var(--color-text-tertiary)]',
            'left-4 origin-left'
          )}
          animate={{
            y: isActive ? (size === 'lg' ? 6 : 6) : (size === 'lg' ? 18 : 14),
            scale: isActive ? 0.75 : 1,
            color: focused ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {label}
        </motion.label>
      )}
    </div>
  );
}
