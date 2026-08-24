import type { Metadata } from 'next';
import Link from 'next/link';
import BlogSection from '@/components/sections/BlogSection';
import { BookOpen, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Engineering Blog & Technical Insights | Dharmik Rathod',
  description:
    'Read deep-dive articles on React performance tuning, Node.js microservices architecture, Next.js App Router optimizations, MongoDB indexing, and Web Security by Dharmik Rathod.',
  alternates: {
    canonical: 'https://dharmikrathod.com/blog',
  },
  openGraph: {
    title: 'Technical Blog & Full Stack Articles | Dharmik Rathod',
    description:
      'Read deep-dive articles on React performance tuning, Node.js microservices architecture, Next.js optimizations, and Web Security.',
    url: 'https://dharmikrathod.com/blog',
  },
};

export default function BlogPage() {
  return (
    <div className="w-full space-y-12">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <nav className="flex items-center gap-2 text-xs font-mono text-customText-muted mb-6">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-accent font-bold">Blog</span>
        </nav>

        <div className="p-8 sm:p-12 rounded-3xl bg-dark-card/80 border border-white/10 relative overflow-hidden backdrop-blur-2xl shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-mono text-accent font-bold">
              <BookOpen className="w-3.5 h-3.5" /> DEDICATED BLOG PAGE // /blog
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight">
              Engineering <span className="bg-gradient-to-r from-accent via-[#38BDF8] to-white bg-clip-text text-transparent">Blog & Articles</span>
            </h1>
            <p className="text-base sm:text-xl text-customText-secondary">
              Deep-dive technical writings, architecture tutorials, performance benchmarks, and MERN best practices.
            </p>
          </div>
        </div>
      </section>

      <BlogSection />
    </div>
  );
}
