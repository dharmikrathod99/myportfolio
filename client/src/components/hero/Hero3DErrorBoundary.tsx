'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import NightSkyBackground from './NightSkyBackground';
import ElectricBackgroundText from './ElectricBackgroundText';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class Hero3DErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error?.message || '3D Engine initialization error',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Hero 3D WebGL caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="relative w-full h-[100dvh] min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#070A14] select-none">
          {/* Preserved Visuals: Night sky with stars and shooting comets */}
          <NightSkyBackground />

          {/* Preserved Visuals: Electric Background Text "DIYKAN" */}
          <ElectricBackgroundText isLoaded={true} />

          {/* Graceful Fallback Status Card */}
          <div className="relative z-20 flex flex-col items-center gap-3 px-6 py-4 rounded-2xl bg-[#070D1F]/80 border border-[#00F0FF]/30 backdrop-blur-xl shadow-[0_0_40px_rgba(0,240,255,0.15)] text-center max-w-md mx-4">
            <div className="flex items-center gap-2 text-[#38BDF8] text-xs font-mono font-bold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
              <span>DR. DEVELOPER // AI UNIT 01</span>
            </div>
            <p className="text-xs text-[#94A3B8] font-mono leading-relaxed">
              2D High-Performance Visual Mode Active. Scroll down to explore full portfolio and projects.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default Hero3DErrorBoundary;
