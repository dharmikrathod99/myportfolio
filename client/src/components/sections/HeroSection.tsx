'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ArrowUpRight, FileText, Github, Linkedin, Mail, Sparkles, Code2, Zap, CheckCircle2, ChevronDown } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import { VengeanceTextShimmer } from '@/components/ui/VengeanceTextShimmer';
import { VengeanceSpotlightButton } from '@/components/ui/VengeanceSpotlightButton';
import { BorderBeam, TextAnimate, Marquee, LiquidMetal } from '@/components/ui/animate-ui';

export default function HeroSection() {
  const [activeCodeTab, setActiveCodeTab] = useState<'next' | 'node' | 'seo'>('next');
  const [typedText, setTypedText] = useState('');
  const codeSnippet = `const developer = {
  name: "DR.Developer",
  fullName: "Dharmik Rathod",
  role: "Full Stack Engineer & MERN Specialist",
  stack: ["React", "Next.js", "Node.js", "MongoDB", "Express"],
  pageSpeedScore: 99,
  status: "Available for Projects"
};`;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(codeSnippet.slice(0, index));
      index++;
      if (index > codeSnippet.length) {
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Text Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Availability Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-surface border border-accent/30 text-xs font-mono shadow-sm relative overflow-hidden"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span className="text-customText-primary font-medium">
                {PORTFOLIO_DATA.personalInfo.availability}
              </span>
              <BorderBeam size={100} duration={6} colorFrom="#00FB1B" />
            </motion.div>

            {/* Headline with Animate UI TextAnimate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-3"
            >
              <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08] flex items-center flex-wrap gap-2">
                <span className="text-accent drop-shadow-[0_0_30px_rgba(0,251,27,0.4)]">DR.</span>
                <TextAnimate text="Developer" type="chars" stagger={0.04} />
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/30 text-xs font-mono text-accent font-semibold tracking-wider">
                  Dharmik Rathod Developer
                </span>
                <span className="text-customText-muted text-xs hidden sm:inline">•</span>
                <span className="text-xs font-mono text-customText-secondary hidden sm:inline">
                  Full Stack MERN & AI Solutions
                </span>
              </div>
              <div className="text-customText-secondary text-sm sm:text-base max-w-xl font-normal leading-relaxed space-y-3 pt-2">
                <p>
                  Hi, I'm <strong className="text-white">Dharmik Rathod</strong> (known as <strong className="text-accent">DR.Developer</strong>), a passionate Software Engineer and Full Stack  Developer dedicated to building modern, scalable, and high-performance web applications. I specialize in React.js, Node.js, Express.js, MongoDB, REST APIs, JavaScript, and responsive UI/UX design.
                </p>
                <p>
                  Based in India and working remotely with clients worldwide, I help businesses transform ideas into reliable digital products using clean architecture, modern technologies, and scalable development practices.
                </p>
              </div>
            </motion.div>

            {/* CTAs & Social Links with Liquid Metal Border Effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              {/* Primary Hire Me Button */}
              <a href="#contact" className="relative group cursor-pointer border-none bg-transparent p-0 outline-none transition-transform hover:scale-105 active:scale-95">
                <div className="relative rounded-full overflow-hidden p-[2px] shadow-[0_4px_20px_rgba(0,251,27,0.35),0_1px_4px_rgba(0,251,27,0.2)] hover:shadow-[0_6px_30px_rgba(0,251,27,0.6)] transition-all duration-300">
                  <LiquidMetal
                    colorBack="#042F0C"
                    colorTint="#00FB1B"
                    speed={0.8}
                    repetition={4}
                    distortion={0.3}
                    scale={1.2}
                    className="absolute inset-0 z-0 rounded-full"
                  />
                  <div className="relative z-10 rounded-full px-6 py-3.5 bg-[#080C14] text-white flex items-center gap-2.5 overflow-hidden">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full z-10 bg-gradient-to-b from-white/15 via-white/5 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 rounded-full z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.8)]" />
                    <div className="pointer-events-none absolute -inset-full top-0 w-1/2 h-full z-20 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[350%] transition-transform duration-1000 ease-out" />
                    <span className="relative z-30 text-accent group-hover:scale-110 transition-transform">
                      <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                    </span>
                    <span className="relative z-30 text-white font-extrabold uppercase tracking-wider text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      Hire Me
                    </span>
                  </div>
                </div>
              </a>

              {/* Secondary View Projects Button */}
              <a
                href="#projects"
                className="relative group cursor-pointer border-none bg-transparent p-0 outline-none transition-transform hover:scale-105 active:scale-95"
              >
                <div className="relative rounded-full overflow-hidden p-[2px] shadow-[0_4px_16px_rgba(0,251,27,0.25)] hover:shadow-[0_6px_25px_rgba(0,251,27,0.5)] transition-all duration-300">
                  <LiquidMetal
                    colorBack="#042F0C"
                    colorTint="#00FB1B"
                    speed={0.6}
                    repetition={3}
                    distortion={0.25}
                    scale={1.2}
                    className="absolute inset-0 z-0 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="relative z-10 rounded-full px-5 py-3.5 bg-[#080C14] text-white flex items-center gap-2 overflow-hidden">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full z-10 bg-gradient-to-b from-white/15 via-white/5 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 rounded-full z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.8)]" />
                    <span className="relative z-30 text-accent group-hover:scale-110 transition-transform font-black">
                      ✔
                    </span>
                    <span className="relative z-30 text-white font-extrabold uppercase tracking-wider text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      View Projects
                    </span>
                  </div>
                </div>
              </a>

              {/* Tertiary Download Resume Button */}
              <a
                href={PORTFOLIO_DATA.personalInfo.resumeUrl}
                className="relative group cursor-pointer border-none bg-transparent p-0 outline-none transition-transform hover:scale-105 active:scale-95"
              >
                <div className="relative rounded-full overflow-hidden p-[2px] shadow-[0_4px_16px_rgba(0,251,27,0.25)] hover:shadow-[0_6px_25px_rgba(0,251,27,0.5)] transition-all duration-300">
                  <LiquidMetal
                    colorBack="#042F0C"
                    colorTint="#00FB1B"
                    speed={0.6}
                    repetition={3}
                    distortion={0.25}
                    scale={1.2}
                    className="absolute inset-0 z-0 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="relative z-10 rounded-full px-5 py-3.5 bg-[#080C14] text-white flex items-center gap-2 overflow-hidden">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full z-10 bg-gradient-to-b from-white/15 via-white/5 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 rounded-full z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.8)]" />
                    <FileText className="w-4 h-4 text-accent relative z-30" />
                    <span className="relative z-30 text-white font-extrabold uppercase tracking-wider text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      Download Resume
                    </span>
                  </div>
                </div>
              </a>
            </motion.div>

            {/* Animate UI Marquee for Tech Stack */}
            <div className="pt-4 overflow-hidden max-w-xl">
              <span className="block text-xs font-mono text-customText-muted mb-2">Core Tech Stack (Animate UI Marquee):</span>
              <div className="rounded-xl bg-dark-surface/60 border border-white/10 p-2 backdrop-blur-md">
                <Marquee pauseOnHover repeat={4} className="[--gap:0.75rem]">
                  {['React.js', 'Next.js 14', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Framer Motion', 'REST APIs', 'Redux', 'Docker'].map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-lg bg-dark-card border border-white/10 text-xs font-mono text-white flex items-center gap-1.5 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {tech}
                    </span>
                  ))}
                </Marquee>
              </div>
            </div>
          </div>

          {/* Right Column: Code Terminal Window with Animate UI BorderBeam (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Terminal Card */}
            <div className="relative bg-dark-surface/90 border border-white/15 rounded-2xl p-4 shadow-2xl backdrop-blur-xl overflow-hidden dark-terminal">
              <BorderBeam size={250} duration={12} colorFrom="#00FB1B" colorTo="transparent" />
              
              {/* Header Dots & Tabs */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-white/20" />
                  <span className="w-3 h-3 rounded-full bg-white/40" />
                  <span className="w-3 h-3 rounded-full bg-white/60" />
                  <span className="text-xs font-mono text-accent font-semibold ml-2">dr-developer.ts</span>
                </div>
                <div className="flex items-center gap-1 bg-dark-card p-1 rounded-lg border border-white/5">
                  <button
                    onClick={() => setActiveCodeTab('next')}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                      activeCodeTab === 'next' ? 'bg-accent text-dark-bg font-bold' : 'text-customText-secondary'
                    }`}
                  >
                    App Router
                  </button>
                  <button
                    onClick={() => setActiveCodeTab('node')}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                      activeCodeTab === 'node' ? 'bg-accent text-dark-bg font-bold' : 'text-customText-secondary'
                    }`}
                  >
                    API Engine
                  </button>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="p-3 bg-dark-bg/90 rounded-xl font-mono text-xs text-customText-primary leading-relaxed border border-white/5 min-h-[220px] overflow-x-auto">
                {activeCodeTab === 'next' ? (
                  <pre className="text-accent">
                    <code>{typedText}<span className="animate-pulse">|</span></code>
                  </pre>
                ) : (
                  <pre className="text-accent">
                    <code>{`// Express API Architecture
import express from 'express';
import { contactRateLimiter } from './security';

const app = express();
app.post('/api/contact', contactRateLimiter, async (req, res) => {
  // Ultra-safe Zod validation
  return res.json({ success: true, ref: 'TAR-9821' });
});`}</code>
                  </pre>
                )}
              </div>

              {/* Live Metric Badges footer inside card */}
              <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="flex items-center gap-2 p-2 bg-dark-card rounded-lg border border-white/5">
                  <Zap className="w-4 h-4 text-accent" />
                  <div>
                    <span className="block text-[10px] text-customText-muted">Google PageSpeed</span>
                    <span className="text-white font-bold">99 / 100</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-dark-card rounded-lg border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <div>
                    <span className="block text-[10px] text-customText-muted">Core Web Vitals</span>
                    <span className="text-white font-bold">LCP 1.1s (Passed)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Floating Decorative Element */}
            <div className="absolute -bottom-6 -right-6 p-4 rounded-2xl bg-dark-card border border-accent/30 shadow-2xl hidden sm:flex items-center gap-3 backdrop-blur-lg animate-float">
              <Sparkles className="w-6 h-6 text-accent" />
              <div>
                <span className="block text-xs font-bold text-white">DR.Developer</span>
                <span className="text-[10px] text-customText-secondary font-mono">Dharmik Rathod · Full Stack</span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Live Metrics Counter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-dark-card/50 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden group hover:border-accent/30 transition-all duration-300"
        >
          {PORTFOLIO_DATA.stats.map((stat, i) => (
            <div key={i} className="text-center p-3 border-r last:border-r-0 border-white/10">
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
                {stat.value}
              </span>
              <span className="block text-xs font-mono text-customText-secondary mt-1 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-12">
          <a href="#about" className="flex flex-col items-center gap-1 text-xs font-mono text-customText-secondary hover:text-white transition-colors">
            <span>SCROLL TO EXPLORE</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>

      </div>
    </section>
  );
}
