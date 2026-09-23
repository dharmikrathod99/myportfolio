'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ChevronLeft, ChevronRight, Cpu, Zap, Activity } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';

export default function ProjectsCarouselSection() {
  const projects = PORTFOLIO_DATA.projects.slice(0, 3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  }, [projects.length]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch swipe support (maintaining pan-y native vertical scrolling)
  const touchStartX = React.useRef(0);
  const touchStartY = React.useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    // Only trigger horizontal switch if horizontal swipe is significantly stronger than vertical
    if (Math.abs(diffX) > 48 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      if (diffX > 0) handleNext();
      else handlePrev();
    }
  };

  const currentProject = projects[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
      filter: 'blur(4px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
      filter: 'blur(4px)',
      transition: { duration: 0.3, ease: 'easeIn' },
    }),
  };

  return (
    <section
      id="projects"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#050811] text-white overflow-hidden select-none border-t border-white/5"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Background Ambient Electric Glows */}
      <div className="absolute top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00F0FF]/[0.035] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 -translate-x-1/2 translate-y-1/2 w-[550px] h-[550px] bg-[#38BDF8]/[0.035] rounded-full blur-[150px] pointer-events-none" />

      {/* Background Blueprint Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="projects-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#38BDF8" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#projects-grid)" />
        </svg>
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ================= SECTION HEADER (Matching Skills & Experience language) ================= */}
        <div className="space-y-3 max-w-3xl mb-10 sm:mb-12">
          {/* Section Indicator Pill & Node */}
          <div className="flex items-center gap-3">
            <span className="text-[#38BDF8] font-mono text-base font-bold">03.</span>
            <div className="px-3.5 py-1 rounded-full bg-[#0B1528] border border-[#38BDF8]/40 text-[#38BDF8] text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] uppercase shadow-[0_0_12px_rgba(56,189,248,0.15)] flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-[#00F0FF]" />
              PROJECT SYSTEMS
            </div>
            <div className="hidden sm:flex items-center">
              <div className="w-16 lg:w-24 h-[1px] bg-gradient-to-r from-[#38BDF8]/60 to-transparent" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] -ml-0.5" />
            </div>
          </div>

          {/* Main Heading */}
          <h2
            className="font-display font-extrabold text-3xl sm:text-5xl lg:text-[56px] text-white keep-white tracking-tight leading-[1.15]"
            style={{ color: '#ffffff' }}
          >
            <span className="text-white keep-white" style={{ color: '#ffffff' }}>Selected </span>
            <span className="bg-gradient-to-r from-[#38BDF8] via-[#00F0FF] to-[#60A5FA] bg-clip-text text-transparent">
              Systems & Projects
            </span>
          </h2>

          {/* Description */}
          <p
            className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed"
            style={{ color: '#CBD5E1' }}
          >
            Engineering digital systems across AI, automation, full-stack development and intelligent interfaces.
          </p>
        </div>

        {/* ================= MAIN LABORATORY SYSTEM SHOWCASE ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* ================= LEFT COLUMN: SCIENTIFIC MONITOR DISPLAY (7 cols) ================= */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="relative w-full h-full rounded-[24px] sm:rounded-[28px] border border-[#00F0FF]/25 hover:border-[#00F0FF]/50 transition-all duration-300 bg-gradient-to-b from-[#091428]/95 via-[#060D1E]/95 to-[#040714]/98 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_0_40px_rgba(0,240,255,0.08)] flex flex-col justify-between gap-5">
              {/* Subtle Top Cyan Glow Beam */}
              <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-[#00F0FF]/50 to-transparent pointer-events-none" />

              {/* Monitor Top Status Telemetry */}
              <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08] text-[10px] sm:text-[11px] font-mono">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
                  </span>
                  <span className="text-[#00F0FF] font-bold tracking-wider uppercase font-mono">
                    SYSTEM 0{currentIndex + 1} // ACTIVE MODULE
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#38BDF8]/90 font-mono">ID: DR-SYS-00{currentIndex + 1}</span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ONLINE
                  </span>
                </div>
              </div>

              {/* Monitor Visual Screen (Animated transitions on project change) */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 group-hover:border-[#00F0FF]/30 transition-colors bg-black/60 group">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentProject.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 w-full h-full"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentProject.image}
                      alt={currentProject.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Subtle Laboratory Scanline & Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#040714] via-transparent to-transparent opacity-65 pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-50" />

                {/* Technical Corner Brackets */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#00F0FF]/80 pointer-events-none" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#00F0FF]/80 pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#00F0FF]/80 pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#00F0FF]/80 pointer-events-none" />

                {/* Floating System ID Badge */}
                <div className="absolute bottom-3.5 left-3.5 z-10 px-3 py-1 rounded-lg bg-[#070D1B]/90 border border-[#00F0FF]/30 backdrop-blur-md text-[10px] font-mono text-white/90 shadow-[0_0_12px_rgba(0,240,255,0.15)]">
                  <span className="text-[#00F0FF] font-bold">ARC-SYS //</span> {currentProject.category}
                </div>
              </div>

              {/* Monitor Bottom Telemetry Specs */}
              <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-white/[0.08]">
                {currentProject.metrics?.map((m) => (
                  <div
                    key={m.label}
                    className="flex flex-col items-center justify-center px-3 py-2 rounded-xl bg-[#0A152A]/90 border border-[#00F0FF]/15 hover:border-[#00F0FF]/40 transition-colors text-center shadow-[0_0_12px_rgba(0,240,255,0.03)]"
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
                      {m.label}
                    </span>
                    <span className="text-xs sm:text-base font-mono font-black text-[#00F0FF] tracking-wide drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: SYSTEM DETAILS & CONTROL PANEL (5 cols) ================= */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="relative w-full h-full rounded-[24px] sm:rounded-[28px] border border-[#00F0FF]/25 hover:border-[#00F0FF]/40 transition-all duration-300 bg-gradient-to-b from-[#091428]/95 via-[#060D1E]/95 to-[#040714]/98 backdrop-blur-2xl p-6 sm:p-7 lg:p-8 shadow-[0_0_40px_rgba(0,240,255,0.08)] flex flex-col justify-between gap-6">
              {/* Subtle Top Cyan Glow Beam */}
              <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-[#00F0FF]/50 to-transparent pointer-events-none" />

              {/* Top: Metadata & Descriptions */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentProject.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-4"
                >
                  {/* Category Pill & Index */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[11px] font-mono font-bold tracking-[0.22em] text-[#00F0FF] uppercase px-3.5 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]">
                      SYSTEM 0{currentIndex + 1} / 03
                    </span>
                    <span className="text-[11px] font-mono font-semibold tracking-widest text-[#38BDF8] uppercase">
                      &bull; &nbsp;{currentProject.category}
                    </span>
                  </div>

                  {/* Project Name (Force 100% white, high-contrast, immune to light mode overrides) */}
                  <h3
                    className="text-2xl sm:text-3xl lg:text-[34px] font-display font-black tracking-tight leading-tight text-white keep-white drop-shadow-[0_2px_14px_rgba(0,240,255,0.25)]"
                    style={{ color: '#FFFFFF' }}
                  >
                    {currentProject.title}
                  </h3>

                  {/* Subtitle */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-[#38BDF8]">
                    <Activity className="w-4 h-4 text-[#00F0FF] animate-pulse" />
                    <span className="font-semibold tracking-wide text-[#38BDF8]">{currentProject.subtitle}</span>
                  </div>

                  {/* Description */}
                  <p
                    className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal"
                    style={{ color: '#CBD5E1' }}
                  >
                    {currentProject.description}
                  </p>

                  {/* Engineering Tech Stack Badges */}
                  <div className="space-y-2.5 pt-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-[#7DD3FC] flex items-center gap-1.5">
                      <Cpu className="w-3 h-3 text-[#00F0FF]" />
                      ENGINEERED WITH
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {currentProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-lg text-[11px] font-mono font-semibold uppercase bg-[#0B172E] border border-[#00F0FF]/25 text-[#E0F2FE] hover:border-[#00F0FF] hover:bg-[#00F0FF]/15 hover:text-white transition-all duration-200 shadow-[0_0_10px_rgba(0,240,255,0.05)] hover:shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:-translate-y-0.5 cursor-default"
                          style={{ color: '#E0F2FE' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons & Navigation Controls */}
              <div className="space-y-5 pt-5 border-t border-white/[0.08]">
                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3.5">
                  {currentProject.liveUrl && (
                    <a
                      href={currentProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#2563EB] text-[#040814] text-xs font-mono font-extrabold tracking-widest uppercase shadow-[0_0_24px_rgba(0,240,255,0.45)] hover:shadow-[0_0_35px_rgba(0,240,255,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                      style={{ color: '#040814' }}
                    >
                      <span>VIEW SYSTEM</span>
                      <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  )}
                  {currentProject.githubUrl && (
                    <a
                      href={currentProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#0B172E] hover:bg-[#122240] border border-[#38BDF8]/40 hover:border-[#00F0FF] text-white keep-white text-xs font-mono font-extrabold tracking-widest uppercase shadow-[0_0_15px_rgba(56,189,248,0.15)] hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                      style={{ color: '#FFFFFF' }}
                    >
                      <Github className="w-4 h-4 text-[#00F0FF] group-hover:rotate-12 transition-transform duration-300" />
                      <span className="keep-white" style={{ color: '#FFFFFF' }}>SOURCE CODE</span>
                    </a>
                  )}
                </div>

                {/* Futuristic System Navigation Bar */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="group flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-[#0A152A] border border-white/15 hover:border-[#00F0FF] text-xs font-mono font-bold tracking-wider text-slate-300 hover:text-white transition-all shadow-[0_0_12px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(0,240,255,0.25)] cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#00F0FF] group-hover:-translate-x-0.5 transition-transform" />
                    <span className="hidden sm:inline uppercase tracking-wider text-[10px] font-bold text-slate-300 group-hover:text-white">
                      PREV SYSTEM
                    </span>
                  </button>

                  {/* Glowing Progress Bars / Active Indicators */}
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    {projects.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setDirection(i > currentIndex ? 1 : -1);
                          setCurrentIndex(i);
                        }}
                        className="flex items-center focus:outline-none cursor-pointer py-1"
                        aria-label={`Jump to system 0${i + 1}`}
                      >
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            currentIndex === i
                              ? 'w-7 sm:w-9 bg-[#00F0FF] shadow-[0_0_12px_#00F0FF]'
                              : 'w-2 sm:w-2.5 bg-white/20 hover:bg-white/40'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-[11px] sm:text-xs font-mono text-[#00F0FF] font-bold ml-1 tabular-nums">
                      0{currentIndex + 1} / 03
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="group flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-[#0A152A] border border-white/15 hover:border-[#00F0FF] text-xs font-mono font-bold tracking-wider text-slate-300 hover:text-white transition-all shadow-[0_0_12px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(0,240,255,0.25)] cursor-pointer"
                  >
                    <span className="hidden sm:inline uppercase tracking-wider text-[10px] font-bold text-slate-300 group-hover:text-white">
                      NEXT SYSTEM
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#00F0FF] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM TAGLINE ================= */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mt-12 sm:mt-16 select-none">
          <div className="h-[1px] flex-1 max-w-[80px] sm:max-w-[180px] bg-gradient-to-r from-transparent via-[#38BDF8]/40 to-[#38BDF8]" />
          <div className="flex items-center gap-2 sm:gap-3 text-center">
            <Zap className="w-3.5 h-3.5 text-[#00F0FF] animate-pulse" />
            <span
              className="text-[9px] sm:text-xs font-mono font-bold tracking-[0.18em] sm:tracking-[0.24em] text-slate-300 uppercase whitespace-nowrap"
              style={{ color: '#CBD5E1' }}
            >
              ENGINEERED &bull; BENCHMARKED &bull; PRODUCTION READY
            </span>
          </div>
          <div className="h-[1px] flex-1 max-w-[80px] sm:max-w-[180px] bg-gradient-to-l from-transparent via-[#38BDF8]/40 to-[#38BDF8]" />
        </div>
      </div>
    </section>
  );
}
