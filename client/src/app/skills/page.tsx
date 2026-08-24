import type { Metadata } from 'next';
import Link from 'next/link';
import SkillsSection from '@/components/sections/SkillsSection';
import ProcessSection from '@/components/sections/ProcessSection';
import { Code2, ChevronRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Technical Skills & Expertise | Dharmik Rathod',
  description:
    'Explore the full stack technology matrix of Dharmik Rathod: React, Next.js, Node.js, Express, MongoDB, TypeScript, Tailwind CSS, WebGL, GraphQL, and Cloud DevOps.',
  alternates: {
    canonical: 'https://dharmikrathod.com/skills',
  },
  openGraph: {
    title: 'Technical Skills & Tech Stack | Dharmik Rathod',
    description:
      'Explore the full stack technology matrix of Dharmik Rathod: React, Next.js, Node.js, Express, MongoDB, TypeScript, and Cloud DevOps.',
    url: 'https://dharmikrathod.com/skills',
  },
};

export default function SkillsPage() {
  return (
    <div className="w-full space-y-12">
      {/* Page Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <nav className="flex items-center gap-2 text-xs font-mono text-customText-muted mb-6">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-accent font-bold">Skills</span>
        </nav>

        <div className="p-8 sm:p-12 rounded-3xl bg-dark-card/80 border border-white/10 relative overflow-hidden backdrop-blur-2xl shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-mono text-accent font-bold">
              <Code2 className="w-3.5 h-3.5" /> DEDICATED SKILLS PAGE // /skills
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight">
              Technical <span className="bg-gradient-to-r from-accent via-emerald-400 to-white bg-clip-text text-transparent">Skills & Matrix</span>
            </h1>
            <p className="text-base sm:text-xl text-customText-secondary">
              Comprehensive full-stack technology matrix, frameworks, databases, DevOps, and engineering standards.
            </p>
          </div>
        </div>
      </section>

      <SkillsSection />
      <ProcessSection />
    </div>
  );
}
