'use client';

import React from 'react';

interface VengeanceTextShimmerProps {
  children: string;
  className?: string;
}

export function VengeanceTextShimmer({ children, className = '' }: VengeanceTextShimmerProps) {
  return (
    <span
      className={`inline-block bg-gradient-to-r from-white via-accent to-aurora-cyan bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer ${className}`}
    >
      {children}
    </span>
  );
}
