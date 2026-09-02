'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, FolderGit2 } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';

const SHOWCASE_ITEMS = [
  {
    id: 0,
    label: '01 / WEB DESIGN & DEV',
    src: '/bridge-video.mp4',
    accentColor: '#F598F2',
    heading: 'Tencent Bridge',
    tagline: 'Modern UI/UX & Frontend Development',
    description:
      'Crafting high-converting web designs, fluid animations, and pixel-perfect responsive interfaces optimized for Core Web Vitals and top search engine rankings.',
    tags: ['Next.js 14', 'React', 'Tailwind CSS', 'Framer Motion', 'SEO Optimized'],
  },
  {
    id: 1,
    label: '02 / WEB APPLICATIONS',
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_032424_3c9c2a9d-807b-4482-80e6-dd6d9dfd4545.mp4',
    accentColor: '#38BDF8',
    heading: 'Web Apps',
    tagline: 'Full-Stack MERN & SaaS Platforms',
    description:
      'Engineering enterprise SaaS architectures, real-time dashboards, and full-stack solutions built with Node.js, Express, MongoDB, and Next.js with sub-second speeds.',
    tags: ['MERN Stack', 'Node.js & Express', 'MongoDB Atlas', 'JWT Auth', 'REST APIs'],
  },
  {
    id: 2,
    label: '03 / OTHER WORK',
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260627_094019_4214ea73-b963-46a4-8327-61489192de99.mp4',
    accentColor: '#34D399',
    heading: 'Other Work',
    tagline: 'AI Automation & Custom Engineering',
    description:
      'Building intelligent AI agent workflows, custom automation tools, RESTful API microservices, performance overhauls, and bespoke software solutions for global clients.',
    tags: ['AI Integrations', 'OpenAI & Gemini', 'Custom Automations', 'API Microservices'],
  },
];

export default function ProjectsCarouselSection() {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isUserActive, setIsUserActive] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide UI overlay after 1.2s of inactivity
  const resetIdleTimer = () => {
    setIsUserActive(true);
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = setTimeout(() => {
      setIsUserActive(false);
    }, 1200);
  };

  useEffect(() => {
    // Initial timer to hide UI after 1.2s if no interaction
    idleTimerRef.current = setTimeout(() => {
      setIsUserActive(false);
    }, 1200);

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Live 24-hour clock (CUP HH:MM:SS format)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);
      setCurrentTime(`CUP ${timeStr}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Reveal animation & video play/pause on viewport intersection
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          videoRefs.current[activeVideo]?.play().catch(() => {});
          resetIdleTimer();
        } else {
          videoRefs.current.forEach((vid) => vid?.pause());
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [activeVideo]);

  // Ensure video plays smoothly whenever active tab switches
  useEffect(() => {
    const currentVid = videoRefs.current[activeVideo];
    if (currentVid) {
      currentVid.currentTime = 0;
      currentVid.play().catch(() => {});
    }
    resetIdleTimer();
  }, [activeVideo]);

  const currentItem = SHOWCASE_ITEMS[activeVideo];
  const currentAccent = currentItem.accentColor;

  return (
    <section
      id="projects-showcase"
      ref={sectionRef}
      onMouseMove={resetIdleTimer}
      onMouseEnter={resetIdleTimer}
      onMouseLeave={() => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        setIsUserActive(false);
      }}
      onTouchStart={resetIdleTimer}
      onTouchMove={resetIdleTimer}
      onClick={resetIdleTimer}
      className={`relative w-full h-[100vh] min-h-[560px] max-h-[1080px] bg-black text-white overflow-hidden select-none flex flex-col justify-between border-y border-white/10 shadow-2xl my-0 transition-all duration-700 ${
        isUserActive ? 'cursor-default' : 'cursor-none'
      }`}
      style={{
        ['--btn-accent' as any]: currentAccent,
      }}
    >
      {/* ================= 1. VIDEO BACKGROUND LAYER ================= */}
      <div className="absolute inset-0 z-0 bg-black overflow-hidden pointer-events-none" aria-hidden="true">
        {SHOWCASE_ITEMS.map((v, index) => (
          <video
            key={v.id}
            ref={(el) => {
              videoRefs.current[index] = el;
            }}
            src={v.src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1000ms] ease-in-out ${
              activeVideo === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
        ))}

        {/* Dynamic Cinematic Overlay - Becomes ultra-clean when idle */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/50 z-[1] transition-opacity duration-700 ${
            isUserActive ? 'opacity-100' : 'opacity-25'
          }`}
        />
      </div>

      {/* ================= 2. TOP STATUS BAR (z-20) ================= */}
      <div
        className={`relative z-20 w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 pt-4 sm:pt-6 flex justify-end items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isUserActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        {/* Right: Pulsing Status Dot + Live Clock */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/20 backdrop-blur-md shadow-lg">
            <div
              className="w-[7px] h-[7px] rounded-full animate-dot-pulse"
              style={{
                backgroundColor: currentAccent,
                boxShadow: `0 0 12px ${currentAccent}`,
              }}
            />
            <span className="text-[11px] sm:text-xs font-mono font-medium tracking-wide text-white keep-white" style={{ color: '#ffffff' }}>
              Available for work
            </span>
          </div>

          <span className="text-xs font-mono font-medium text-white/90 keep-white tabular-nums hidden sm:inline-block drop-shadow-md" style={{ color: '#ffffff' }}>
            {currentTime || 'CUP 00:00:00'}
          </span>
        </div>
      </div>

      {/* ================= 3. VERTICAL LEFT-CENTER SWITCHER (Auto-shows on activity) ================= */}
      <div
        className={`absolute left-4 sm:left-8 lg:left-12 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 sm:gap-2.5 max-w-[290px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isUserActive
            ? 'opacity-100 translate-x-0 pointer-events-auto'
            : 'opacity-0 -translate-x-6 pointer-events-none'
        }`}
      >
        <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/60 px-1 mb-0.5">
          Select Project Category
        </div>
        {SHOWCASE_ITEMS.map((v, index) => {
          const isActive = activeVideo === index;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => {
                setActiveVideo(index);
                videoRefs.current[index]?.play().catch(() => {});
                resetIdleTimer();
              }}
              className={`group/btn flex items-center gap-2.5 text-[10px] sm:text-xs font-mono tracking-wider uppercase transition-all duration-300 text-left cursor-pointer py-2 px-3 sm:px-3.5 rounded-xl border ${
                isActive
                  ? 'bg-black/90 border-white/50 text-white font-bold backdrop-blur-2xl shadow-2xl translate-x-1'
                  : 'bg-black/60 border-white/15 hover:border-white/40 hover:bg-black/80 text-white/70 hover:text-white font-normal backdrop-blur-md'
              }`}
              style={{
                borderColor: isActive ? `${currentAccent}90` : undefined,
              }}
            >
              {/* Active Indicator line */}
              <span
                className={`w-1.5 rounded-full transition-all duration-300 ${
                  isActive ? 'h-4 sm:h-5' : 'h-1.5 bg-white/40 group-hover/btn:bg-white/80'
                }`}
                style={{
                  backgroundColor: isActive ? currentAccent : undefined,
                  boxShadow: isActive ? `0 0 12px ${currentAccent}` : undefined,
                }}
              />
              <span
                className="role-link keep-white font-medium whitespace-nowrap"
                style={{
                  color: isActive ? currentAccent : '#ffffff',
                }}
              >
                {v.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ================= 4. BOTTOM ROW: Giant Name + Bio CTA (z-10) ================= */}
      <div
        className={`relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 pb-5 sm:pb-7 lg:pb-8 flex-1 flex flex-col justify-end transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isUserActive && isRevealed
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end">
          {/* Left Column: Giant Name / Heading */}
          <div className="lg:col-span-7 xl:col-span-7 transition-all duration-500">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-white/80 keep-white mb-1 sm:mb-1.5 block drop-shadow-md" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
              Featured Showcase // {currentItem.tagline}
            </span>
            <h2
              className="text-[clamp(36px,6.8vw,96px)] leading-[88%] tracking-[-1.5px] sm:tracking-[-3px] font-extrabold uppercase text-white keep-white select-none whitespace-nowrap drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
              style={{ color: '#ffffff' }}
            >
              {currentItem.heading}
              <span
                className="transition-colors duration-500"
                style={{ color: currentAccent }}
              >
                .
              </span>
            </h2>

            {/* Category Tags */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2.5 sm:mt-3.5">
              {currentItem.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-mono bg-black/60 border border-white/20 backdrop-blur-md text-white/90"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Paragraph + Fill-Up Button */}
          <div className="lg:col-span-5 xl:col-span-5 lg:pl-2 space-y-3.5 sm:space-y-4 transition-all duration-500">
            <p
              className="text-xs sm:text-sm leading-relaxed tracking-[-0.1px] font-normal text-white keep-white max-w-[420px] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
              style={{ color: '#ffffff' }}
            >
              {currentItem.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-0.5">
              <Link
                href="/projects"
                className="btn-fill-up inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full border border-white/60 text-xs font-mono font-bold tracking-wide uppercase text-white keep-white cursor-pointer transition-all shadow-lg hover:shadow-2xl"
                style={{ color: '#ffffff' }}
              >
                <FolderGit2 className="w-3.5 h-3.5 text-white" />
                <span className="text-white keep-white" style={{ color: '#ffffff' }}>Explore Projects</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-xs font-mono font-medium tracking-wide lowercase text-white keep-white transition-all backdrop-blur-md shadow-md"
                style={{ color: '#ffffff' }}
              >
                <span className="text-white keep-white" style={{ color: '#ffffff' }}>start a project</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
