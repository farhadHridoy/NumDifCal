'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sigma } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/calculator', label: 'Calculator' },
  { href: '/theory', label: 'Theory' },
  { href: '/examples', label: 'Examples' },
  { href: '/about', label: 'About' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="container-app">
          <nav
            className="mt-3 px-4 md:px-6 py-3 rounded-[20px] glass flex items-center justify-between"
            role="navigation"
            aria-label="Main navigation"
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 no-underline"
            >
              <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[var(--color-gradient-start)] via-[var(--color-gradient-mid)] to-[var(--color-gradient-end)] flex items-center justify-center shadow-sm">
                <Sigma size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--color-text-primary)] hidden sm:inline">
                NumDiff
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors no-underline',
                      isActive
                        ? 'text-[var(--color-primary)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: 'rgba(79, 70, 255, 0.08)',
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              {/* Mobile menu button */}
              <motion.button
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full glass cursor-pointer"
                onClick={() => setMobileOpen((v) => !v)}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle mobile menu"
              >
                {mobileOpen ? (
                  <X size={18} className="text-[var(--color-text-secondary)]" />
                ) : (
                  <Menu size={18} className="text-[var(--color-text-secondary)]" />
                )}
              </motion.button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute top-20 left-4 right-4 glass-strong rounded-[20px] p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'px-4 py-3 rounded-[14px] text-[15px] font-medium transition-colors no-underline',
                        isActive
                          ? 'bg-[rgba(79,70,255,0.08)] text-[var(--color-primary)]'
                          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]',
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
