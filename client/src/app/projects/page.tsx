import type { Metadata } from 'next';
import Link from 'next/link';
import ProjectsSection from '@/components/sections/ProjectsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import { FolderGit2, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Portfolio & Full Stack Case Studies | Dharmik Rathod',
  description:
    'Browse production-grade web applications, SaaS tools, E-commerce platforms, and real-time dashboard systems engineered by Dharmik Rathod.',
  alternates: {
    canonical: 'https://dharmikrathod.com/projects',
  },
  openGraph: {
    title: 'Featured Projects & Case Studies | Dharmik Rathod',
    description:
      'Browse production-grade web applications, SaaS tools, E-commerce platforms, and real-time dashboards engineered by Dharmik Rathod.',
    url: 'https://dharmikrathod.com/projects',
  },
};

export default function ProjectsPage() {
  return (
    <div className="w-full space-y-12">
      {/* Page Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <nav className="flex items-center gap-2 text-xs font-mono text-customText-muted mb-6">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-accent font-bold">Projects</span>
        </nav>

        <div className="p-8 sm:p-12 rounded-3xl bg-dark-card/80 border border-white/10 relative overflow-hidden backdrop-blur-2xl shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-mono text-accent font-bold">
              <FolderGit2 className="w-3.5 h-3.5" /> DEDICATED PROJECTS PAGE // /projects
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight">
              Featured <span className="bg-gradient-to-r from-accent via-emerald-400 to-white bg-clip-text text-transparent">Projects & Portfolio</span>
            </h1>
            <p className="text-base sm:text-xl text-customText-secondary">
              Production-grade web applications, SaaS tools, client platforms, and high-performance solutions.
            </p>
          </div>
        </div>
      </section>

      <ProjectsSection />
      <TestimonialsSection />
    </div>
  );
}
