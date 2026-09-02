'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  User,
  CheckCircle2,
  Rocket,
  ShieldCheck,
  Brain,
  Layers,
  ArrowUpRight,
  Code2,
  Sparkles,
  Zap,
  Globe,
  Award,
  Terminal,
  FileText
} from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import { InteractivePortrait } from '@/components/ui/InteractivePortrait';
import { BorderBeam, LiquidMetal } from '@/components/ui/animate-ui';
import {
  FramerCodeIcon,
  FramerZapIcon,
  FramerAwardIcon,
  FramerStackIcon,
  FramerSparklesIcon,
  FramerFileIcon,
} from '@/components/ui/icons/PremiumIcons';

export default function AboutSection() {
  const highlights = [
    {
      icon: <FramerCodeIcon className="w-4 h-4 text-accent" />,
      title: "MERN & Next.js Architecture",
      desc: "Robust full-stack systems built with React 19, Next.js 14/15, TypeScript, Node.js, and MongoDB."
    },
    {
      icon: <FramerSparklesIcon className="w-4 h-4 text-aurora-cyan" />,
      title: "Generative AI & Automation",
      desc: "Custom AI chatbot integrations, OpenAI & Gemini LLM pipelines, autonomous workflow automations."
    },
    {
      icon: <FramerZapIcon className="w-4 h-4 text-aurora-purple" />,
      title: "Hyper-Fast Performance",
      desc: "Sub-second LCP, zero CLS shift, Core Web Vitals optimization, and modern micro-animations."
    },
    {
      icon: <FramerAwardIcon className="w-4 h-4 text-accent" />,
      title: "Business-Driven Execution",
      desc: "Tailored SaaS, CRM, and enterprise portals designed specifically to increase leads and conversion."
    }
  ];

  const stats = [
    { label: "Projects Completed", value: "15+" },
    { label: "Happy Clients", value: "42+" },
    { label: "Code Quality & Uptime", value: "99.9%" },
    { label: "Client Satisfaction", value: "100%" }
  ];

  return (
    <section id="about" className="relative py-16 sm:py-24 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#3A86FF]/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#38BDF8]/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header Tag */}
        <div className="flex flex-col items-center sm:items-start mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-dark-surface/90 border border-slate-200 dark:border-accent/30 text-xs font-mono shadow-md backdrop-blur-xl relative overflow-hidden group">
            <User className="w-3.5 h-3.5 text-accent" />
            <span className="text-slate-900 dark:text-white font-bold tracking-wide text-[11px]">
              ABOUT ME // DR.DEVELOPER
            </span>
            <BorderBeam size={80} duration={6} colorFrom="#3A86FF" />
          </div>
        </div>

        {/* 2-Column Split: Left = About Me Details, Right = Interactive Portrait Transformation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* ================= LEFT COLUMN: ABOUT ME INFORMATION (7 cols) ================= */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6 text-center sm:text-left"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.2]">
                Passionate Software Engineer &{' '}
                <span className="bg-gradient-to-r from-accent via-[#38BDF8] to-white bg-clip-text text-transparent inline-block">
                  AI Solutions Architect
                </span>
              </h2>
              <p className="mt-4 text-base sm:text-lg text-customText-secondary leading-relaxed">
                Hi, I'm <strong className="text-white">Dharmik Rathod</strong> (widely known as <strong className="text-accent">DR.Developer</strong>), a dedicated Software Engineer based in Ahmedabad, Gujarat, India, delivering high-performance web applications and AI-driven platforms to businesses worldwide.
              </p>
              <p className="mt-2 text-sm sm:text-base text-customText-secondary leading-relaxed">
                I bridge the gap between stunning, interactive user experiences and bulletproof backend engineering. Whether you require a full-stack MERN application, custom SaaS software, AI automation pipelines, or a modern business website, I engineer solutions built for speed, security, and real revenue impact.
              </p>
            </div>

            {/* Core Capability Highlights (2x2 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-dark-card/60 border border-white/10 hover:border-accent/40 transition-all duration-300 backdrop-blur-xl group text-left"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                      {item.icon}
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-customText-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Live Stats Row */}
            <div className="p-4 sm:p-5 rounded-2xl bg-dark-card/70 border border-white/10 backdrop-blur-xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {stats.map((st, i) => (
                <div key={i} className="space-y-0.5">
                  <span className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight">
                    <span className="bg-gradient-to-r from-accent to-[#38BDF8] bg-clip-text text-transparent">
                      {st.value}
                    </span>
                  </span>
                  <span className="block text-[10px] sm:text-[11px] font-mono text-customText-muted uppercase font-semibold">
                    {st.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Action CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3.5">
              <Link
                href="/contact"
                className="relative group cursor-pointer border-none bg-transparent p-0 outline-none transition-transform hover:scale-105 active:scale-95"
              >
                <div className="relative rounded-full overflow-hidden p-[2px] shadow-[0_4px_18px_rgba(58,134,255,0.35)] hover:shadow-[0_6px_28px_rgba(58,134,255,0.6)] transition-all duration-300">
                  <LiquidMetal
                    colorBack="#001F33"
                    colorTint="#3A86FF"
                    speed={0.8}
                    className="absolute inset-0 z-0 rounded-full"
                  />
                  <div className="relative z-10 rounded-full px-6 py-3 bg-[#0F172A] text-white keep-white flex items-center gap-2 overflow-hidden">
                    <span className="relative z-30 text-white keep-white font-extrabold uppercase tracking-wider text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      Let's Talk
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-accent relative z-30 stroke-[2.5]" />
                  </div>
                </div>
              </Link>

              <a
                href={PORTFOLIO_DATA.personalInfo.resumeUrl}
                className="relative group cursor-pointer border-none bg-transparent p-0 outline-none transition-transform hover:scale-105 active:scale-95"
              >
                <div className="relative rounded-full overflow-hidden p-[2px] shadow-[0_4px_14px_rgba(58,134,255,0.25)] hover:shadow-[0_6px_22px_rgba(58,134,255,0.5)] transition-all duration-300">
                  <LiquidMetal
                    colorBack="#001F33"
                    colorTint="#3A86FF"
                    speed={0.6}
                    className="absolute inset-0 z-0 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="relative z-10 rounded-full px-6 py-3 bg-[#0F172A] text-white keep-white flex items-center gap-2 overflow-hidden">
                    <FramerFileIcon className="w-3.5 h-3.5 text-accent relative z-30" />
                    <span className="relative z-30 text-white keep-white font-extrabold uppercase tracking-wider text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      Download Resume
                    </span>
                  </div>
                </div>
              </a>

              <Link
                href="/about"
                className="px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-customText-primary hover:text-white transition-all duration-300 font-semibold flex items-center gap-1.5"
              >
                <span>Read Full Story</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
              </Link>
            </div>

          </motion.div>

          {/* ================= RIGHT COLUMN: INTERACTIVE PHOTO TRANSFORMATION / REVEAL EFFECT (5 cols) ================= */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-5 flex flex-col items-center justify-center relative"
          >
            {/* Ambient Background Glow Halos */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[400px] lg:w-[440px] h-[280px] sm:h-[400px] lg:h-[440px] rounded-full bg-[#3A86FF]/10 blur-3xl pointer-events-none" />

            {/* Card Frame Housing the Interactive Reveal Portrait */}
            <div className="relative w-full max-w-[360px] sm:max-w-[420px] rounded-3xl p-3 sm:p-4 bg-dark-card/70 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden group">
              <BorderBeam size={180} duration={8} colorFrom="#3A86FF" />

              {/* Floating Top Chip */}
              <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  <span className="text-[11px] font-mono text-white font-bold uppercase tracking-wider">
                    Interactive AI Mode
                  </span>
                </div>
                <span className="text-[10px] font-mono text-customText-muted">
                  Hover / Touch
                </span>
              </div>

              {/* Interactive Portrait Canvas Container */}
              <div className="relative w-full h-[360px] sm:h-[420px] md:h-[460px] rounded-2xl overflow-hidden bg-gradient-to-b from-white/5 to-black/40 flex items-center justify-center">
                <InteractivePortrait
                  baseImageUrl="/myfaceopen.png"
                  revealImageUrl="/myfacecover.png"
                  blobRadius={0.42}
                  blobFadeSpeed={1.2}
                  lingerDuration={0.99}
                  className="w-full h-full"
                />

                {/* Bottom Verified Developer Badge */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#0B0F19]/95 border border-accent/40 shadow-2xl flex items-center gap-2 backdrop-blur-xl whitespace-nowrap z-30">
                  <FramerSparklesIcon className="w-3.5 h-3.5 text-accent" />
                  <span className="text-[11px] sm:text-xs font-extrabold text-white uppercase tracking-wider">
                    DR.Developer · Dharmik Rathod
                  </span>
                </div>
              </div>

              {/* Bottom Quick Feature Tags */}
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-customText-muted">
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Full Stack MERN
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" /> AI Integration
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> SEO Ready
                </span>
              </div>
            </div>

            {/* Micro Helper Note */}
            <p className="mt-3 text-[11px] font-mono text-customText-muted flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-accent" />
              <span>Hover anywhere on photo to experience liquid AI transformation</span>
            </p>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
