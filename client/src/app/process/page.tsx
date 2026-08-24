import type { Metadata } from 'next';
import Link from 'next/link';
import ProcessSection from '@/components/sections/ProcessSection';
import WhyMeSection from '@/components/sections/WhyMeSection';
import FaqSection from '@/components/sections/FaqSection';
import { Cpu, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Engineering Process & Workflow | Dharmik Rathod',
  description:
    'Discover the 5-step development methodology of Dharmik Rathod: Discovery, Architecture, Agile Iteration, Automated Testing, and Seamless Cloud Deployment.',
  alternates: {
    canonical: 'https://dharmikrathod.com/process',
  },
  openGraph: {
    title: 'Development Workflow & Quality Assurance | Dharmik Rathod',
    description:
      'Discover the 5-step development methodology of Dharmik Rathod: Discovery, Architecture, Agile Iteration, Testing, and Cloud Deployment.',
    url: 'https://dharmikrathod.com/process',
  },
};

export default function ProcessPage() {
  return (
    <div className="w-full space-y-12">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <nav className="flex items-center gap-2 text-xs font-mono text-customText-muted mb-6">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-accent font-bold">Process</span>
        </nav>

        <div className="p-8 sm:p-12 rounded-3xl bg-dark-card/80 border border-white/10 relative overflow-hidden backdrop-blur-2xl shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-mono text-accent font-bold">
              <Cpu className="w-3.5 h-3.5" /> DEDICATED PROCESS PAGE // /process
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight">
              Engineering <span className="bg-gradient-to-r from-accent via-[#38BDF8] to-white bg-clip-text text-transparent">Process & Workflow</span>
            </h1>
            <p className="text-base sm:text-xl text-customText-secondary">
              5-stage development methodology ensuring zero technical debt, security, and sub-second page performance.
            </p>
          </div>
        </div>
      </section>

      <ProcessSection />
      <WhyMeSection />
      <FaqSection />
    </div>
  );
}
