import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Numerical Differentiation Calculator',
  description:
    'Solve numerical differentiation using Newton Forward and Newton Backward Difference Methods with automatically generated Difference Tables, step-by-step solutions, and interactive graphs.',
  keywords: [
    'numerical differentiation',
    'newton forward difference',
    'newton backward difference',
    'difference table',
    'numerical methods',
    'calculus',
    'derivative calculator',
  ],
  authors: [{ name: 'NumDiff Team' }],
  openGraph: {
    title: 'Numerical Differentiation Calculator',
    description:
      'Premium mathematical software for Newton Forward & Backward Difference Methods.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          {/* Animated gradient background */}
          <div className="animated-gradient-bg" aria-hidden="true" />

          <Navbar />

          {/* Main content with top padding for fixed navbar */}
          <main className="flex-1 pb-8" style={{ paddingTop: '100px' }}>
            {children}
          </main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
