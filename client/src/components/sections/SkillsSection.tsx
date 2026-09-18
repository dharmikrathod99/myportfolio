'use client';

import React from 'react';
import HeroShowcaseCard from './HeroShowcaseCard';
import ElectricalSkillCard from './ElectricalSkillCard';
import {
  Html5Icon,
  Css3Icon,
  JavaScriptIcon,
  ReactIcon,
  NodejsIcon,
  ExpressIcon,
  MongoDbIcon,
  TailwindIcon,
  BootstrapIcon,
  PythonIcon,
  FigmaIcon,
  FramerMotionIcon,
  ApiIntegrationIcon,
  AiAutomationIcon,
  GitGithubIcon,
  DataAnalysisIcon,
  FirebaseIcon,
  DockerIcon,
} from './SkillTechIcons';

export const SKILLS_LIST = [
  { name: 'HTML', icon: Html5Icon },
  { name: 'CSS', icon: Css3Icon },
  { name: 'JavaScript', icon: JavaScriptIcon },
  { name: 'React', icon: ReactIcon },
  { name: 'Node.js', icon: NodejsIcon },
  { name: 'Express', icon: ExpressIcon },
  { name: 'MongoDB', icon: MongoDbIcon },
  { name: 'Tailwind CSS', icon: TailwindIcon },
  { name: 'Bootstrap', icon: BootstrapIcon },
  { name: 'Python', icon: PythonIcon },
  { name: 'Figma', icon: FigmaIcon },
  { name: 'Framer Motion', icon: FramerMotionIcon },
  { name: 'API Integration', icon: ApiIntegrationIcon },
  { name: 'AI Automation', icon: AiAutomationIcon },
  { name: 'Git & GitHub', icon: GitGithubIcon },
  { name: 'Data Analysis', icon: DataAnalysisIcon },
  { name: 'Firebase', icon: FirebaseIcon },
  { name: 'Docker', icon: DockerIcon },
];

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#050811] text-white overflow-hidden select-none border-t border-white/5"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00F0FF]/[0.035] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[550px] h-[550px] bg-[#38BDF8]/[0.035] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ================= SECTION HEADER ================= */}
        <div className="space-y-3 max-w-3xl mb-8 sm:mb-10">
          {/* Section Indicator Pill & Node */}
          <div className="flex items-center gap-3">
            <span className="text-[#38BDF8] font-mono text-base font-bold">02.</span>
            <div className="px-3.5 py-1 rounded-full bg-[#0B1528] border border-[#38BDF8]/40 text-[#38BDF8] text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] uppercase shadow-[0_0_12px_rgba(56,189,248,0.15)]">
              SKILLS & EXPERIENCE
            </div>
            <div className="hidden sm:flex items-center">
              <div className="w-16 lg:w-24 h-[1px] bg-gradient-to-r from-[#38BDF8]/60 to-transparent" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] -ml-0.5" />
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-[56px] text-white keep-white tracking-tight leading-[1.15]" style={{ color: '#ffffff' }}>
            <span className="text-white keep-white" style={{ color: '#ffffff' }}>My Skills </span>
            <span className="bg-gradient-to-r from-[#38BDF8] via-[#00F0FF] to-[#60A5FA] bg-clip-text text-transparent">& Toolkit</span>
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl leading-relaxed">
            Technologies I use to build, automate and bring ideas to life.
            From full-stack development to AI and automation, here&apos;s what
            I work with.
          </p>
        </div>

        {/* ================= TWO-COLUMN COMPOSITION ================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* LEFT: 3D Showcase Card (approx 58-60% on desktop) */}
          <div className="md:col-span-7 flex w-full">
            <HeroShowcaseCard />
          </div>

          {/* RIGHT: Compact Tools & Technologies Panel (approx 40-42% on desktop) */}
          <div className="md:col-span-5 flex w-full">
            <div className="w-full h-full min-h-[480px] sm:min-h-[520px] lg:min-h-[580px] rounded-[28px] sm:rounded-[32px] border border-[#1E293B]/80 hover:border-[#38BDF8]/40 transition-all duration-300 bg-[#070D1B]/85 backdrop-blur-2xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between shadow-[0_0_30px_rgba(15,23,42,0.6)]">
              {/* Panel Header */}
              <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#38BDF8]/30 to-transparent" />
                <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.24em] text-[#7DD3FC] uppercase whitespace-nowrap">
                  TOOLS & TECHNOLOGIES
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#38BDF8]/30 to-transparent" />
              </div>

              {/* 18 Skill Cards (3 columns x 6 rows) */}
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5 flex-1 items-stretch">
                {SKILLS_LIST.map((skill) => (
                  <ElectricalSkillCard
                    key={skill.name}
                    name={skill.name}
                    icon={skill.icon}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM TAGLINE ================= */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mt-10 sm:mt-14 select-none">
          <div className="h-[1px] flex-1 max-w-[80px] sm:max-w-[180px] bg-gradient-to-r from-transparent via-[#38BDF8]/40 to-[#38BDF8]" />
          <div className="flex items-center gap-2 sm:gap-3 text-center">
            <span className="text-[#00F0FF] font-mono font-black text-sm sm:text-base drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">
              &lt;/&gt;
            </span>
            <span className="text-[9px] sm:text-xs font-mono font-bold tracking-[0.18em] sm:tracking-[0.24em] text-[#94A3B8] uppercase whitespace-nowrap">
              CODE &nbsp;+&nbsp; AI &nbsp;+&nbsp; AUTOMATION &nbsp;=&nbsp; REAL SOLUTIONS
            </span>
          </div>
          <div className="h-[1px] flex-1 max-w-[80px] sm:max-w-[180px] bg-gradient-to-l from-transparent via-[#38BDF8]/40 to-[#38BDF8]" />
        </div>
      </div>
    </section>
  );
}
