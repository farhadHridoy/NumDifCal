'use client';

import { Sigma } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)] py-12">
      <div className="container-app">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-[var(--color-gradient-start)] via-[var(--color-gradient-mid)] to-[var(--color-gradient-end)] flex items-center justify-center">
              <Sigma size={14} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[14px] font-semibold text-[var(--color-text-primary)]">
              NumDiff Calculator
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-[13px] text-[var(--color-text-secondary)]">
            <Link href="/calculator" className="hover:text-[var(--color-text-primary)] transition-colors no-underline">
              Calculator
            </Link>
            <Link href="/theory" className="hover:text-[var(--color-text-primary)] transition-colors no-underline">
              Theory
            </Link>
            <Link href="/examples" className="hover:text-[var(--color-text-primary)] transition-colors no-underline">
              Examples
            </Link>
            <Link href="/docs" className="hover:text-[var(--color-text-primary)] transition-colors no-underline">
              API Docs
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-[12px] text-[var(--color-text-tertiary)]">
            © {new Date().getFullYear()} Numerical Differentiation Calculator
          </p>
        </div>
      </div>
    </footer>
  );
}
