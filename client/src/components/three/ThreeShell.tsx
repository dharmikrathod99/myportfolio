'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, Stars, Preload } from '@react-three/drei';
import HeroScene from './HeroScene';
import SkillsOrbit from './SkillsOrbit';
import ProjectGallery3D from './ProjectGallery3D';
import ContactPortal from './ContactPortal';
import { useTheme } from '@/context/ThemeContext';
import { Monitor } from 'lucide-react';

// Smooth camera rig that follows scroll
function CameraRig() {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Subtle idle camera sway
    camera.position.x = Math.sin(t * 0.1) * 0.3;
    camera.rotation.z = Math.sin(t * 0.05) * 0.01;
  });

  return null;
}

// Loading fallback for 3D canvas
function Loader() {
  return (
    <div className="fixed inset-0 z-[9998] bg-[#030303] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      <p className="text-xs font-mono text-customText-secondary uppercase tracking-[0.3em]">
        Loading 3D Scene...
      </p>
    </div>
  );
}

export default function ThreeShell() {
  const { transformSite, isTransitioning } = useTheme();

  return (
    <div className="fixed inset-0 w-full h-full bg-[#030303]">
      {/* Minimal 3D Mode Navbar */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
        <div className="pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#0B0F17]/90 backdrop-blur-2xl border border-white/10 shadow-2xl">
          {/* Brand */}
          <span className="text-white font-display font-extrabold text-sm tracking-tight flex items-center gap-0.5">
            <span className="text-accent">DR.</span>Developer
          </span>
          <span className="text-[9px] font-mono text-accent uppercase tracking-[0.2em]">
            3D MODE
          </span>

          <div className="w-px h-5 bg-white/15 mx-1" />

          {/* Back to 2D Button */}
          <button
            onClick={transformSite}
            disabled={isTransitioning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/40 text-accent font-extrabold text-[10px] uppercase tracking-wider hover:bg-accent/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Monitor className="w-3.5 h-3.5" />
            Back to 2D
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center gap-2">
        <p className="text-[10px] font-mono text-customText-muted uppercase tracking-[0.3em]">
          Scroll to explore
        </p>
        <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-accent animate-bounce" />
        </div>
      </div>

      {/* R3F Canvas */}
      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{ position: [0, 0, 15], fov: 60, near: 0.1, far: 200 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
          }}
          style={{ background: '#030303' }}
        >
          <color attach="background" args={['#030303']} />

          {/* Ambient Lighting */}
          <ambientLight intensity={0.15} />
          <directionalLight position={[5, 5, 5]} intensity={0.3} color="#FFFFFF" />

          {/* Star Background */}
          <Stars radius={80} depth={60} count={3000} factor={3} saturation={0} fade speed={0.5} />

          {/* Scroll-driven scene traversal */}
          <ScrollControls pages={5} damping={0.25}>
            <Scroll>
              <CameraRig />
              <HeroScene />
              <SkillsOrbit />
              <ProjectGallery3D />
              <ContactPortal />
            </Scroll>

            {/* HTML overlay on scroll */}
            <Scroll html>
              <div className="w-screen">
                {/* Hero Section HTML Overlay */}
                <div className="h-screen flex flex-col items-center justify-center text-center px-4">
                  <h1 className="text-5xl sm:text-7xl font-display font-black text-white tracking-tighter leading-none">
                    <span className="text-accent drop-shadow-[0_0_35px_rgba(0,251,27,0.5)]">DR.</span><br />
                    <span className="bg-gradient-to-r from-white via-slate-200 to-accent bg-clip-text text-transparent">
                      DEVELOPER
                    </span>
                  </h1>
                  <p className="text-sm sm:text-base text-accent mt-3 font-mono font-semibold tracking-wider">
                    // Dharmik Rathod Developer
                  </p>
                  <p className="text-xs sm:text-sm text-customText-secondary mt-1 max-w-md font-mono">
                    Software Engineer · Full Stack MERN · Building the future in 3D
                  </p>
                </div>

                {/* Skills Section Spacing */}
                <div className="h-screen" />

                {/* Projects Section Spacing */}
                <div className="h-screen" />

                {/* Contact Section Spacing */}
                <div className="h-screen flex flex-col items-center justify-center text-center px-4">
                  <p className="text-xs font-mono text-accent uppercase tracking-[0.3em] mb-4">
                    // Ready to collaborate?
                  </p>
                  <a
                    href="/contact"
                    className="px-8 py-3.5 rounded-full bg-accent/10 border border-accent/50 text-accent font-extrabold text-sm uppercase tracking-wider hover:bg-accent/20 transition-all active:scale-95 shadow-[0_0_20px_rgba(0,251,27,0.2)]"
                  >
                    Contact Me →
                  </a>
                </div>

                {/* Extra scroll space */}
                <div className="h-screen" />
              </div>
            </Scroll>
          </ScrollControls>

          <Preload all />
        </Canvas>
      </Suspense>
    </div>
  );
}
