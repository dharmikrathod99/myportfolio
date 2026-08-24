'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Terminal, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-dark-bg text-customText-primary flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-dark-card border border-white/10 flex items-center justify-center mb-6">
        <Terminal className="w-8 h-8 text-accent" />
      </div>
      <span className="text-accent font-mono text-sm uppercase tracking-wider mb-2">APPLICATION ERROR</span>
      <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-4">
        Something went wrong!
      </h1>
      <p className="text-customText-secondary text-sm sm:text-base max-w-md mb-8 leading-relaxed font-mono">
        An unexpected runtime error occurred while processing your request.
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3.5 rounded-xl bg-accent text-dark-bg font-bold text-sm flex items-center gap-2 shadow-accent-glow hover:bg-accent-hover transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="px-6 py-3.5 rounded-xl bg-dark-card border border-white/15 text-white font-bold text-sm flex items-center gap-2 hover:border-accent transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
