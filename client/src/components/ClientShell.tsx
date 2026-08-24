'use client';

import React, { useState, lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReadingProgress from '@/components/ReadingProgress';
import CommandPalette from '@/components/CommandPalette';
import SmoothScroll from '@/components/SmoothScroll';
import TransformTransition from '@/components/TransformTransition';
import { FloatingAnimationBackground } from '@/components/ui/animate-ui';
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
            <div className="fixed inset-0 bg-[#030303] flex flex-col items-center justify-center gap-4 z-[9998]">
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
        /* 2D Classic Mode */
        <SmoothScroll>
          <main className="relative min-h-screen bg-transparent text-customText-primary selection:bg-accent selection:text-white overflow-x-hidden w-full max-w-[100vw]">
            {/* Top Reading Progress Bar */}
            <ReadingProgress />

            {/* Framer WebGL Simplex Noise Floating Animation Background */}
            <FloatingAnimationBackground
              colorStops={['#764105', '#1818E7', '#FF299B']}
              amplitude={1.0}
              blend={0.5}
              speed={1.0}
            />

            {/* Dynamic Liquid Metal Floating Navbar */}
            <Navbar onOpenPalette={() => setCommandPaletteOpen(true)} />

            {/* Command Palette Modal (Ctrl+K) */}
            <CommandPalette
              isOpen={commandPaletteOpen}
              onClose={() => setCommandPaletteOpen(false)}
            />

            {/* Main Content Area */}
            <div className="relative z-10 space-y-0 overflow-x-hidden w-full pt-16 sm:pt-20 min-h-[calc(100vh-200px)]">
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
