import React from 'react';
import Link from 'next/link';
import { Terminal, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-bg text-customText-primary flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-dark-card border border-white/10 flex items-center justify-center mb-6">
        <Terminal className="w-8 h-8 text-accent" />
      </div>
      <span className="text-accent font-mono text-sm uppercase tracking-wider mb-2">ERROR 404</span>
      <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight mb-4">
        Page Not Found
      </h1>
      <p className="text-customText-secondary text-sm sm:text-base max-w-md mb-8 leading-relaxed font-mono">
        The requested resource has moved or doesn't exist in Dharmik Tarasaka's digital environment.
      </p>
      <Link
        href="/"
        className="px-6 py-3.5 rounded-xl bg-accent text-dark-bg font-bold text-sm flex items-center gap-2 shadow-accent-glow hover:bg-accent-hover transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home Overview</span>
      </Link>
    </div>
  );
}
