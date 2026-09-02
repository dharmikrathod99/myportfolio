'use client';

import React, { useState, lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReadingProgress from '@/components/ReadingProgress';
import CommandPalette from '@/components/CommandPalette';
import SmoothScroll from '@/components/SmoothScroll';
import TransformTransition from '@/components/TransformTransition';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

// Lazy load Three.js shell to avoid loading WebGL when not needed
const ThreeShell = lazy(() => import('@/components/three/ThreeShell'));

function ShellContent({ children }: { children: React.ReactNode }) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const { siteMode } = useTheme();

  return (
    <>
      {/* Transform Transition Overlay (always mounted) */}
      <TransformTransition />

      {siteMode === '3d' ? (
        /* 3D Three.js Immersive Mode */
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-[#0F1422] flex flex-col items-center justify-center gap-4 z-[9998]">
              <div className="w-12 h-12 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              <p className="text-xs font-mono text-customText-secondary uppercase tracking-[0.3em]">
                Initializing 3D Engine...
              </p>
            </div>
          }
        >
          <ThreeShell />
        </Suspense>
      ) : (
        /* 2D Classic Mode - Clean, Ultra-Premium #0F1422 Background (Zero Lag) */
        <SmoothScroll>
          <main className="relative min-h-screen bg-[#0F1422] text-customText-primary selection:bg-accent selection:text-white overflow-x-hidden w-full max-w-[100vw]">
            {/* Top Reading Progress Bar */}
            <ReadingProgress />

            {/* Clean Static Premium Ambient Backdrop (Zero GPU shader overhead) */}
            <div
              aria-hidden="true"
              className="fixed inset-0 pointer-events-none -z-10 bg-[#0F1422] overflow-hidden select-none"
            >
              {/* Subtle top ambient radial highlight */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#3A86FF]/10 via-[#3A86FF]/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
            </div>

            {/* Dynamic Liquid Metal Floating Navbar */}
            <Navbar onOpenPalette={() => setCommandPaletteOpen(true)} />

            {/* Command Palette Modal (Ctrl+K) */}
            <CommandPalette
              isOpen={commandPaletteOpen}
              onClose={() => setCommandPaletteOpen(false)}
            />

            {/* Main Content Area - Starts at 0px with full screen hero */}
            <div className="relative z-10 space-y-0 overflow-x-hidden w-full pt-0 min-h-screen">
              {children}
            </div>

            {/* Footer */}
            <Footer />
          </main>
        </SmoothScroll>
      )}
    </>
  );
}

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ShellContent>{children}</ShellContent>
    </ThemeProvider>
  );
}
