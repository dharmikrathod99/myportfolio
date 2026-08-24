'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Search, Menu, X, ArrowUpRight, Sparkles, ChevronRight, Sun, Moon, Box, Monitor } from 'lucide-react';
import { LiquidMetal, BorderBeam } from '@/components/ui/animate-ui';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

export default function Navbar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme, toggleTheme, siteMode, isTransitioning, transformSite } = useTheme();
  const pathname = usePathname();

  const isLight = theme === 'light';

  useEffect(() => {
    let prevScrolled = false;
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    const handleScroll = () => {
      const scrolled = window.scrollY > 30;
      if (scrolled !== prevScrolled) {
        prevScrolled = scrolled;
        setIsScrolled(scrolled);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Skills', href: '/skills' },
    { label: 'Services', href: '/services' },
    { label: 'Projects', href: '/projects' },
    { label: 'Process', href: '/process' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-3 sm:px-4">
      {/* Dynamic Island Capsule with Transparent Liquid Glass & Flowing Liquid Metal */}
      <motion.div
        layout
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        initial={false}
        animate={{
          borderRadius: isMobileOpen ? '28px' : isHovered ? '32px' : '9999px',
          borderColor: isHovered || isMobileOpen
            ? 'rgba(0, 251, 27, 0.7)'
            : isLight
            ? 'rgba(255, 255, 255, 0.85)'
            : 'rgba(255, 255, 255, 0.12)',
          boxShadow: isHovered || isMobileOpen
            ? isLight
              ? '0 20px 50px rgba(0, 251, 27, 0.35), 0 8px 32px rgba(31, 38, 135, 0.15), inset 0 2px 4px rgba(255, 255, 255, 0.95)'
              : '0 20px 50px rgba(0, 251, 27, 0.35), 0 0 40px rgba(0, 0, 0, 0.95)'
            : isLight
            ? '0 12px 35px rgba(31, 38, 135, 0.12), inset 0 1.5px 3px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(0, 0, 0, 0.05)'
            : '0 10px 30px rgba(0, 0, 0, 0.7)',
        }}
        transition={{
          layout: { type: 'spring', stiffness: 380, damping: 30, mass: 0.7 },
          borderColor: { duration: 0.2 },
          boxShadow: { duration: 0.2 },
        }}
        className={cn(
          "pointer-events-auto p-1.5 sm:p-2 relative overflow-hidden transition-all duration-300 backdrop-blur-2xl border w-full max-w-[92vw] sm:max-w-fit shadow-2xl",
          isLight
            ? "bg-white/90 text-slate-950 border-slate-200"
            : "bg-[#0B0F17]/90 text-white border-white/10"
        )}
      >
        {/* Moving Neon Green Laser Line along Top Border (Exact Match to Screenshot) */}
        <div className="absolute inset-x-0 top-0 h-[2px] overflow-hidden pointer-events-none z-20">
          <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-[#00FB1B] to-transparent shadow-[0_0_10px_#00FB1B,0_0_20px_#00FB1B] animate-[shimmer_3s_linear_infinite]" />
        </div>

        {/* Continuous Perimeter Moving Laser Border Beam */}
        <BorderBeam size={220} duration={6} colorFrom="#00FB1B" colorTo="transparent" borderWidth={1.5} />

        <div className="relative z-10 flex items-center justify-between gap-2 sm:gap-4 px-2">
          
          {/* Brand & Pulsing Status Dot */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <div className={cn(
              "relative w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md border backdrop-blur-md",
              isLight
                ? "bg-white/90 border-slate-200 group-hover:border-emerald-500 shadow-sm"
                : "bg-white/5 border-white/10 group-hover:border-accent"
            )}>
              <Terminal className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent" />
            </div>

            {/* Dynamic Label */}
            <div className="flex flex-col">
              <span className={cn(
                "font-display font-extrabold text-xs sm:text-sm tracking-tight transition-colors flex items-center gap-0.5",
                isLight ? "text-slate-950 group-hover:text-emerald-600" : "text-white group-hover:text-accent"
              )}>
                <span className="text-accent">DR.</span>Developer
              </span>
              <span className={cn(
                "text-[9px] font-mono -mt-0.5 tracking-wider hidden xs:block",
                isLight ? "text-slate-700 font-semibold" : "text-customText-secondary"
              )}>
                Dharmik Rathod · Full Stack
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Active Path Highlighting */}
          <AnimatePresence>
            {!isMobile && (isHovered || !isScrolled || pathname !== '/') && (
              <motion.nav
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="hidden md:flex items-center gap-1 overflow-hidden"
              >
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={cn(
                        "px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-200 whitespace-nowrap",
                        isActive
                          ? isLight
                            ? "bg-emerald-600 text-white shadow-md font-extrabold"
                            : "bg-white/15 text-accent border border-accent/40 font-extrabold shadow-[0_0_12px_rgba(0,251,27,0.2)]"
                          : isLight
                          ? "text-slate-900 hover:text-black hover:bg-slate-100"
                          : "text-customText-secondary hover:text-white hover:bg-white/10"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </motion.nav>
            )}
          </AnimatePresence>

          {/* Right Control Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={cn(
                "p-2 rounded-full border transition-all active:scale-90 cursor-pointer flex items-center justify-center",
                isLight
                  ? "bg-slate-100 border-slate-200 text-slate-900 hover:text-emerald-600"
                  : "bg-white/5 border-white/10 text-customText-secondary hover:text-white hover:border-white/25 hover:bg-white/10"
              )}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-accent" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-emerald-600" />
              )}
            </button>

            {/* Transform 2D ↔ 3D Mode Button */}
            <button
              onClick={transformSite}
              disabled={isTransitioning}
              title={siteMode === '2d' ? 'Transform to 3D Immersive' : 'Transform to 2D Classic'}
              className="relative group cursor-pointer border-none bg-transparent p-0 outline-none transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <div className="relative rounded-full overflow-hidden p-[2px] shadow-[0_4px_16px_rgba(0,251,27,0.3)] hover:shadow-[0_6px_22px_rgba(0,251,27,0.55)] transition-all duration-300">
                <LiquidMetal
                  colorBack="#042F0C"
                  colorTint="#00FB1B"
                  speed={0.8}
                  repetition={4}
                  distortion={0.3}
                  scale={1.2}
                  className="absolute inset-0 z-0 rounded-full"
                />
                <div className="relative z-10 rounded-full px-3 py-1.5 bg-[#080C14] text-white flex items-center gap-1.5 overflow-hidden">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full z-10 bg-gradient-to-b from-white/15 via-white/5 to-transparent" />
                  <div className="pointer-events-none absolute inset-0 rounded-full z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.8)]" />
                  <span className="relative z-30 text-accent group-hover:scale-110 transition-transform">
                    {siteMode === '2d' ? (
                      <Box className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <Monitor className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                  </span>
                  <span className="relative z-30 text-white font-extrabold uppercase tracking-wider text-[10px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] hidden sm:inline">
                    {siteMode === '2d' ? '3D' : '2D'}
                  </span>
                </div>
              </div>
            </button>

            {/* Command Search Trigger */}
            <button
              onClick={onOpenPalette}
              title="Search Commands (Ctrl+K)"
              className={cn(
                "px-2.5 py-1.5 rounded-full border transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-sm",
                isLight
                  ? "bg-slate-100 border-slate-200 text-slate-900 hover:text-emerald-600"
                  : "bg-white/5 border-white/10 text-customText-secondary hover:text-white hover:border-white/25 hover:bg-white/10"
              )}
            >
              <Search className="w-3.5 h-3.5" />
              <kbd className={cn(
                "hidden lg:inline text-[9px] font-mono border rounded px-1",
                isLight ? "bg-white border-slate-300 text-slate-800 font-bold" : "bg-white/5 border-white/10 text-customText-secondary"
              )}>
                ⌘K
              </kbd>
            </button>

            {/* Desktop Liquid Metal Border Hire Me CTA */}
            <Link
              href="/contact"
              className="hidden sm:inline-block relative group cursor-pointer border-none bg-transparent p-0 outline-none transition-transform hover:scale-105 active:scale-95"
            >
              <div className="relative rounded-full overflow-hidden p-[2px] shadow-[0_4px_18px_rgba(0,251,27,0.35)] hover:shadow-[0_6px_25px_rgba(0,251,27,0.6)] transition-all duration-300">
                <LiquidMetal
                  colorBack="#042F0C"
                  colorTint="#00FB1B"
                  speed={0.8}
                  repetition={4}
                  distortion={0.3}
                  scale={1.2}
                  className="absolute inset-0 z-0 rounded-full"
                />
                <div className="relative z-10 rounded-full px-4 py-2 bg-[#080C14] text-white flex items-center gap-1.5 overflow-hidden">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full z-10 bg-gradient-to-b from-white/15 via-white/5 to-transparent" />
                  <div className="pointer-events-none absolute inset-0 rounded-full z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.8)]" />
                  <span className="relative z-30 text-accent group-hover:scale-110 transition-transform">
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                  <span className="relative z-30 text-white font-extrabold uppercase tracking-wider text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                    Hire Me
                  </span>
                </div>
              </div>
            </Link>

            {/* Mobile Menu Toggle & Close Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              title={isMobileOpen ? 'Close Menu' : 'Open Navigation Menu'}
              className={cn(
                "md:hidden p-2 rounded-full border transition-colors flex items-center justify-center shadow-lg active:scale-90",
                isLight ? "bg-white/80 border-white/90 text-slate-900 hover:text-emerald-600" : "bg-dark-card border-white/15 text-white hover:text-accent"
              )}
            >
              {isMobileOpen ? (
                <X className="w-4 h-4 text-accent animate-pulse" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer inside Island */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={cn(
                "md:hidden pt-3 border-t mt-2 px-2 pb-2 space-y-3",
                isLight ? "border-slate-200/80" : "border-white/10"
              )}
            >
              {/* Header inside mobile overlay */}
              <div className="flex items-center justify-between px-1 pb-1">
                <span className="text-[10px] font-mono text-accent uppercase tracking-wider flex items-center gap-1 font-bold">
                  <Sparkles className="w-3 h-3" /> Navigation Menu
                </span>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "px-2 py-0.5 text-[10px] font-mono rounded-full flex items-center gap-1",
                    isLight ? "bg-white/80 text-slate-900 hover:text-black font-bold" : "bg-white/10 text-customText-secondary hover:text-white"
                  )}
                >
                  <span>Close</span>
                  <X className="w-3 h-3 text-accent" />
                </button>
              </div>

              {/* Navigation Links Grid */}
              <div className="grid grid-cols-1 gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-between group",
                        isActive
                          ? isLight
                            ? "bg-emerald-600 text-white font-extrabold"
                            : "bg-accent text-dark-bg font-extrabold shadow-accent-glow"
                          : isLight
                          ? "text-slate-900 hover:text-black hover:bg-white/80"
                          : "text-customText-secondary hover:text-white hover:bg-white/10"
                      )}
                    >
                      <span>{link.label}</span>
                      <ChevronRight className={cn(
                        "w-4 h-4 transition-all",
                        isActive ? "text-dark-bg" : "text-customText-muted group-hover:text-accent group-hover:translate-x-1"
                      )} />
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Hire Me Button */}
              <div className="pt-2">
                <Link
                  href="/contact"
                  onClick={() => setIsMobileOpen(false)}
                  className="relative block w-full rounded-2xl overflow-hidden p-[2px] shadow-[0_4px_20px_rgba(0,251,27,0.35)]"
                >
                  <LiquidMetal
                    colorBack="#042F0C"
                    colorTint="#00FB1B"
                    speed={0.8}
                    repetition={4}
                    distortion={0.3}
                    scale={1.2}
                    className="absolute inset-0 z-0 rounded-2xl"
                  />
                  <div className="relative z-10 py-3.5 px-4 text-center rounded-2xl bg-[#080C14] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 overflow-hidden">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl z-10 bg-gradient-to-b from-white/15 via-white/5 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 rounded-2xl z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.8)]" />
                    <span className="text-accent font-bold">✔</span>
                    <span className="relative z-30 text-white font-extrabold uppercase tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      Hire DR.Developer
                    </span>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
