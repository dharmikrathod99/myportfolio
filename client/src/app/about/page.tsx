import type { Metadata } from 'next';
import Link from 'next/link';
import AboutSection from '@/components/sections/AboutSection';
import WhyMeSection from '@/components/sections/WhyMeSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import AchievementsSection from '@/components/sections/AchievementsSection';
import { User, ChevronRight, Download, Mail, Sparkles } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import { LiquidMetal } from '@/components/ui/animate-ui/liquid-metal';

export const metadata: Metadata = {
  title: 'About Dharmik Rathod | Senior MERN Stack & Software Engineer',
  description:
    'Learn about Dharmik Rathod, a passionate Full Stack Software Engineer specializing in MERN stack, high-performance web applications, system architecture, and modern UX design.',
  alternates: {
    canonical: 'https://dharmikrathod.com/about',
  },
  openGraph: {
    title: 'About Dharmik Rathod | Senior MERN Stack & Software Engineer',
    description:
      'Learn about Dharmik Rathod, a passionate Full Stack Software Engineer specializing in MERN stack, high-performance web applications, and system architecture.',
    url: 'https://dharmikrathod.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className="w-full space-y-12">
      {/* Dedicated Page Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-customText-muted mb-6">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-accent font-bold">About</span>
        </nav>

        {/* Page Title & Hero Box */}
        <div className="p-8 sm:p-12 rounded-3xl bg-dark-card/80 border border-white/10 relative overflow-hidden backdrop-blur-2xl shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-mono text-accent font-bold">
              <User className="w-3.5 h-3.5" /> DEDICATED ABOUT PAGE // /about
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-none">
              About <span className="bg-gradient-to-r from-accent via-[#38BDF8] to-white bg-clip-text text-transparent">Dharmik Rathod</span>
            </h1>
            <p className="text-base sm:text-xl text-customText-secondary leading-relaxed font-sans">
              Software Engineer & MERN Stack Developer building scalable, ultra-fast web applications and high-impact digital experiences.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href={PORTFOLIO_DATA.personalInfo.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group cursor-pointer border-none bg-transparent p-0 outline-none transition-transform hover:scale-105 active:scale-95"
              >
                <div className="relative rounded-full overflow-hidden p-[2px] shadow-[0_4px_18px_rgba(58,134,255,0.35)] hover:shadow-[0_6px_28px_rgba(58,134,255,0.6)] transition-all duration-300">
                  <LiquidMetal
                    colorBack="#001F33"
                    colorTint="#3A86FF"
                    speed={0.8}
                    repetition={4}
                    distortion={0.3}
                    scale={1.2}
                    className="absolute inset-0 z-0 rounded-full"
                  />
                  <div className="relative z-10 rounded-full px-5 py-2.5 bg-[#0F172A] text-white keep-white flex items-center gap-2 overflow-hidden">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full z-10 bg-gradient-to-b from-white/15 via-white/5 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 rounded-full z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.8)]" />
                    <Download className="w-4 h-4 text-accent relative z-30" />
                    <span className="relative z-30 text-white keep-white font-extrabold uppercase tracking-wider text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      Download Resume
                    </span>
                  </div>
                </div>
              </a>

              <Link
                href="/contact"
                className="relative group cursor-pointer border-none bg-transparent p-0 outline-none transition-transform hover:scale-105 active:scale-95"
              >
                <div className="relative rounded-full overflow-hidden p-[2px] shadow-[0_4px_16px_rgba(14,165,233,0.25)] hover:shadow-[0_6px_24px_rgba(14,165,233,0.5)] transition-all duration-300">
                  <LiquidMetal
                    colorBack="#001F33"
                    colorTint="#0EA5E9"
                    speed={0.6}
                    repetition={3}
                    distortion={0.25}
                    scale={1.2}
                    className="absolute inset-0 z-0 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="relative z-10 rounded-full px-5 py-2.5 bg-[#0F172A] text-white keep-white flex items-center gap-2 overflow-hidden">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full z-10 bg-gradient-to-b from-white/15 via-white/5 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 rounded-full z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.8)]" />
                    <Mail className="w-4 h-4 text-accent relative z-30" />
                    <span className="relative z-30 text-white keep-white font-extrabold uppercase tracking-wider text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      Get In Touch
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main About Component Sections */}
      <AboutSection />
      <WhyMeSection />
      <AchievementsSection />
      <TestimonialsSection />
    </div>
  );
}
