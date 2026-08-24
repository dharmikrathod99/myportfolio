import type { Metadata } from 'next';
import Link from 'next/link';
import ContactSection from '@/components/sections/ContactSection';
import FaqSection from '@/components/sections/FaqSection';
import { Mail, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact & Hire Dharmik Rathod | Full Stack Software Engineer',
  description:
    'Get in touch with Dharmik Rathod for freelance projects, full-time positions, custom Web/MERN app development, or technical consultations.',
  alternates: {
    canonical: 'https://dharmikrathod.com/contact',
  },
  openGraph: {
    title: 'Get In Touch | Hire Dharmik Rathod',
    description:
      'Get in touch with Dharmik Rathod for freelance projects, full-time positions, or technical consultations.',
    url: 'https://dharmikrathod.com/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="w-full space-y-12">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <nav className="flex items-center gap-2 text-xs font-mono text-customText-muted mb-6">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-accent font-bold">Contact</span>
        </nav>

        <div className="p-8 sm:p-12 rounded-3xl bg-dark-card/80 border border-white/10 relative overflow-hidden backdrop-blur-2xl shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-mono text-accent font-bold">
              <Mail className="w-3.5 h-3.5" /> DEDICATED CONTACT PAGE // /contact
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight">
              Get In <span className="bg-gradient-to-r from-accent via-emerald-400 to-white bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-base sm:text-xl text-customText-secondary">
              Let's build scalable software together. Send an inquiry or schedule a direct consultation.
            </p>
          </div>
        </div>
      </section>

      <ContactSection />
      <FaqSection />
    </div>
  );
}
