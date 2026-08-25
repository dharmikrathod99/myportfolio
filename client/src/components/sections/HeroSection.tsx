'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
} from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import { BorderBeam, TextAnimate, Marquee, LiquidMetal, ProTextType } from '@/components/ui/animate-ui';
import { InteractivePortrait } from '@/components/ui/InteractivePortrait';
import {
  FramerCodeIcon,
  FramerZapIcon,
  FramerAwardIcon,
  FramerStackIcon,
  FramerSparklesIcon,
  FramerFileIcon,
} from '@/components/ui/icons/PremiumIcons';

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-4.5rem)] flex flex-col justify-center items-center overflow-hidden select-none"
    >
      {/* 4K Ultra HD Ambient Depth Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] lg:w-[1200px] h-[320px] sm:h-[600px] lg:h-[1200px] bg-gradient-to-tr from-[#3A86FF]/25 via-[#FF299B]/15 to-[#764105]/15 rounded-full blur-[100px] sm:blur-[180px] lg:blur-[240px] pointer-events-none -z-10" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full relative z-10 my-auto flex-1 flex flex-col justify-center pt-20 sm:pt-24 lg:pt-0 pb-6 sm:pb-8 lg:pb-0">
        
        {/* Main 3-Column Grand Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-4 xl:gap-8 items-center w-full">
          
          {/* ================= LEFT COLUMN: ANCHORED TO FAR LEFT (3.5 cols) ================= */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-3 xl:col-span-3 text-center lg:text-left space-y-4 order-2 lg:order-1 z-20 max-w-lg mx-auto lg:max-w-none w-full"
          >
            {/* Availability Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-dark-surface/90 border border-slate-200 dark:border-[#3A86FF]/35 text-xs font-mono shadow-md backdrop-blur-xl relative overflow-hidden group">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3A86FF] animate-ping" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#3A86FF] absolute left-3.5" />
              <span className="text-slate-900 dark:text-white font-bold pl-3 tracking-wide text-[11px]">
                Available for Freelance Worldwide
              </span>
              <BorderBeam size={90} duration={6} colorFrom="#3A86FF" />
            </div>

            {/* Main Brand Title & Headings */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 justify-center lg:justify-start flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-[#3A86FF]/15 border border-[#3A86FF]/40 text-xs font-mono text-[#3A86FF] font-bold uppercase tracking-wider">
                  Dharmik Rathod
                </span>
                <ProTextType
                  text={[
                    'Full Stack MERN & AI',
                    'AI Software Engineer',
                    'Custom SaaS Architect',
                    'Next.js & React Specialist'
                  ]}
                  typingSpeed={45}
                  deletingSpeed={25}
                  pauseDuration={2000}
                  loop={true}
                  cursorCharacterPreset="|"
                  className="text-[11px] font-mono text-slate-800 dark:text-slate-200 font-semibold"
                />
              </div>

              <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl text-slate-950 dark:text-white tracking-tight leading-tight whitespace-nowrap">
                <span className="text-accent drop-shadow-[0_0_35px_rgba(58,134,255,0.5)]">DR. </span>
                Developer
              </h1>
            </div>

            {/* Concise Bio */}
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
              Hi, I'm <strong className="text-slate-950 dark:text-white font-bold">Dharmik Rathod</strong>. I build high-performance web applications, AI automation tools, and scalable SaaS platforms for businesses worldwide.
            </p>

            {/* Quick Skills Badges */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <span className="px-2.5 py-1 rounded-lg bg-white/95 dark:bg-dark-card border border-slate-200 dark:border-white/10 text-[11px] font-mono text-slate-800 dark:text-white flex items-center gap-1.5 shadow-sm font-semibold">
                <FramerCodeIcon className="w-3.5 h-3.5 text-accent" /> Clean Code
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/95 dark:bg-dark-card border border-slate-200 dark:border-white/10 text-[11px] font-mono text-slate-800 dark:text-white flex items-center gap-1.5 shadow-sm font-semibold">
                <FramerZapIcon className="w-3.5 h-3.5 text-accent" /> convert your normal website to modern design
              </span>
            </div>

            {/* Horizontal Action Buttons: Hire Me & Projects */}
            <div className="flex flex-row items-center justify-center lg:justify-start gap-3 pt-1 flex-nowrap">
              <a
                href="#contact"
                className="relative group cursor-pointer border-none bg-transparent p-0 outline-none transition-transform hover:scale-105 active:scale-95 shrink-0"
              >
                <div className="relative rounded-full overflow-hidden p-[2px] shadow-[0_4px_18px_rgba(58,134,255,0.35)] hover:shadow-[0_6px_28px_rgba(58,134,255,0.6)] transition-all duration-300">
                  <LiquidMetal
                    colorBack="#001F33"
                    colorTint="#3A86FF"
                    speed={0.8}
                    className="absolute inset-0 z-0 rounded-full"
                  />
                  <div className="relative z-10 rounded-full px-5 py-2.5 bg-[#0F172A] text-white keep-white flex items-center gap-2 overflow-hidden whitespace-nowrap">
                    <span className="relative z-30 text-accent group-hover:scale-110 transition-transform">
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span className="relative z-30 text-white keep-white font-extrabold uppercase tracking-wider text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      Hire Me
                    </span>
                  </div>
                </div>
              </a>

              <a
                href="#projects"
                className="relative group cursor-pointer border-none bg-transparent p-0 outline-none transition-transform hover:scale-105 active:scale-95 shrink-0"
              >
                <div className="relative rounded-full overflow-hidden p-[2px] shadow-[0_4px_14px_rgba(58,134,255,0.25)] hover:shadow-[0_6px_22px_rgba(58,134,255,0.5)] transition-all duration-300">
                  <LiquidMetal
                    colorBack="#001F33"
                    colorTint="#3A86FF"
                    speed={0.6}
                    className="absolute inset-0 z-0 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="relative z-10 rounded-full px-5 py-2.5 bg-[#0F172A] text-white keep-white flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
                    <span className="relative z-30 text-accent font-black text-xs">✔</span>
                    <span className="relative z-30 text-white keep-white font-extrabold uppercase tracking-wider text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      Projects
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </motion.div>

          {/* ================= CENTER: INTERACTIVE PORTRAIT WITH HOVER REVEAL ================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-6 flex justify-center items-end relative order-1 lg:order-2"
          >
            <div className="relative w-full max-w-[340px] sm:max-w-[480px] lg:max-w-[680px] flex flex-col items-center">
              
              {/* Grand Multi-Stop Ambient Glow Halo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] lg:w-[680px] h-[300px] sm:h-[500px] lg:h-[680px] rounded-full bg-gradient-to-tr from-[#3A86FF]/35 via-[#FF299B]/25 to-[#764105]/20 blur-3xl opacity-90 animate-pulse-glow pointer-events-none" />

              {/* Interactive Portrait: Hover reveals myfacecover.png with organic blob */}
              <div className="relative w-full h-[340px] sm:h-[440px] md:h-[500px] lg:h-[calc(100vh-11rem)] max-h-[650px] overflow-visible">
                <InteractivePortrait
                  baseImageUrl="/myfaceopen.png"
                  revealImageUrl="/myfacecover.png"
                  blobRadius={0.42}
                  blobFadeSpeed={1.2}
                  lingerDuration={0.99}
                  className="w-full h-full"
                />
              </div>

              {/* Verified Developer Capsule Badge */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/95 dark:bg-dark-card/95 border border-slate-200 dark:border-accent/40 shadow-2xl flex items-center gap-2 backdrop-blur-xl whitespace-nowrap z-20">
                <FramerSparklesIcon className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  DR.Developer · (Dharmik Rathod)
                </span>
              </div>
            </div>
          </motion.div>

          {/* ================= RIGHT COLUMN: ANCHORED TO FAR RIGHT (3.5 cols) ================= */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-3 xl:col-span-3 text-center lg:text-left space-y-3.5 order-3 z-20 max-w-lg mx-auto lg:max-w-none w-full"
          >
            {/* Card 1: Experience & Track Record */}
            <div className="p-4 rounded-2xl bg-white/95 dark:bg-dark-surface/90 border border-slate-200 dark:border-white/15 shadow-xl backdrop-blur-xl space-y-2.5 relative overflow-hidden group hover:border-accent/40 transition-colors">
              <BorderBeam size={160} duration={8} colorFrom="#3A86FF" />
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                  <FramerAwardIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-950 dark:text-white">Track Record</h3>
                  <p className="text-[10px] font-mono text-slate-500 dark:text-customText-muted">Production Grade</p>
                </div>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-slate-100/90 dark:bg-dark-card border border-slate-200 dark:border-white/5 text-center lg:text-left">
                  <span className="font-display font-extrabold text-lg sm:text-xl text-slate-950 dark:text-white tracking-tight">15+</span>
                  <span className="block text-[9px] font-mono text-slate-600 dark:text-customText-muted uppercase font-semibold">Projects</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100/90 dark:bg-dark-card border border-slate-200 dark:border-white/5 text-center lg:text-left">
                  <span className="font-display font-extrabold text-lg sm:text-xl text-slate-950 dark:text-white tracking-tight">42+</span>
                  <span className="block text-[9px] font-mono text-slate-600 dark:text-customText-muted uppercase font-semibold">Clients</span>
                </div>
              </div>
            </div>

            {/* Card 2: Core Engineering Capabilities */}
            <div className="p-3.5 rounded-2xl bg-white/95 dark:bg-dark-surface/90 border border-slate-200 dark:border-white/15 shadow-xl backdrop-blur-xl space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-accent font-bold uppercase tracking-wider flex items-center gap-1">
                  <FramerStackIcon className="w-3.5 h-3.5" /> Stack
                </span>
                <span className="text-[10px] font-mono text-slate-600 dark:text-customText-muted font-semibold">MERN + AI</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['React.js', 'Next.js 14', 'Node.js', 'Express', 'MongoDB', 'AI Integration'].map((item) => (
                  <span
                    key={item}
                    className="px-2 py-0.5 rounded-md bg-slate-100/90 dark:bg-dark-card border border-slate-200 dark:border-white/5 text-[10px] font-mono text-slate-800 dark:text-white font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Download Resume Button */}
            <a
              href={PORTFOLIO_DATA.personalInfo.resumeUrl}
              className="relative group block cursor-pointer border-none bg-transparent p-0 outline-none transition-transform hover:scale-102 active:scale-98"
            >
              <div className="relative rounded-xl overflow-hidden p-[2px] shadow-[0_4px_14px_rgba(58,134,255,0.25)] hover:shadow-[0_6px_22px_rgba(58,134,255,0.5)] transition-all duration-300">
                <LiquidMetal
                  colorBack="#001F33"
                  colorTint="#3A86FF"
                  speed={0.6}
                  className="absolute inset-0 z-0 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity"
                />
                <div className="relative z-10 rounded-xl px-4 py-2.5 bg-[#0F172A] text-white keep-white flex items-center justify-between overflow-hidden">
                  <div className="flex items-center gap-2">
                    <FramerFileIcon className="w-3.5 h-3.5 text-accent" />
                    <span className="text-white keep-white font-extrabold uppercase tracking-wider text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      Download Resume
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </a>
          </motion.div>

        </div>

        {/* Bottom Tech Stack Marquee */}
        <div className="w-full max-w-[1400px] mt-0 overflow-hidden mx-auto">
          <div className="rounded-xl bg-white/90 dark:bg-dark-surface/60 border border-slate-200 dark:border-white/10 p-2 backdrop-blur-xl shadow-md">
            <Marquee pauseOnHover repeat={4} className="[--gap:0.75rem]">
              {[
                'React.js',
                'Next.js 14',
                'TypeScript',
                'Node.js',
                'Express.js',
                'MongoDB',
                'Tailwind CSS',
                'Framer Motion',
                'REST APIs',
                'GraphQL',
                'Docker',
                'AI Solutions',
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-lg bg-slate-100/90 dark:bg-dark-card border border-slate-200 dark:border-white/10 text-[11px] font-mono text-slate-800 dark:text-white flex items-center gap-1.5 shrink-0 shadow-sm font-semibold"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {tech}
                </span>
              ))}
            </Marquee>
          </div>
        </div>

      </div>
    </section>
  );
}
