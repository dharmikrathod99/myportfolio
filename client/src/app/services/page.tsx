import type { Metadata } from 'next';
import Link from 'next/link';
import ServicesSection from '@/components/sections/ServicesSection';
import FaqSection from '@/components/sections/FaqSection';
import ContactSection from '@/components/sections/ContactSection';
import { Briefcase, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Web Engineering & MERN Development Services | Dharmik Rathod',
  description:
    'Custom web app development, MERN stack solutions, REST & GraphQL API engineering, UI/UX performance optimization, and scalable cloud infrastructure services by Dharmik Rathod.',
  alternates: {
    canonical: 'https://dharmikrathod.com/services',
  },
  openGraph: {
    title: 'Services & Development Solutions | Dharmik Rathod',
    description:
      'Custom web app development, MERN stack solutions, REST & GraphQL API engineering, and cloud infrastructure services.',
    url: 'https://dharmikrathod.com/services',
  },
};

export default function ServicesPage() {
  return (
    <div className="w-full space-y-12">
      {/* Page Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <nav className="flex items-center gap-2 text-xs font-mono text-customText-muted mb-6">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-accent font-bold">Services</span>
        </nav>

        <div className="p-8 sm:p-12 rounded-3xl bg-dark-card/80 border border-white/10 relative overflow-hidden backdrop-blur-2xl shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-mono text-accent font-bold">
              <Briefcase className="w-3.5 h-3.5" /> DEDICATED SERVICES PAGE // /services
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight">
              Engineering <span className="bg-gradient-to-r from-accent via-[#38BDF8] to-white bg-clip-text text-transparent">Services & Solutions</span>
            </h1>
            <p className="text-base sm:text-xl text-customText-secondary">
              End-to-end full stack development, API design, performance optimization, and cloud architecture.
            </p>
          </div>
        </div>
      </section>

      <ServicesSection />
      <FaqSection />
      <ContactSection />
    </div>
  );
}
