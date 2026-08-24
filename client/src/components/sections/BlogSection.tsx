'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, Clock, ArrowUpRight, X, Calendar, User } from 'lucide-react';
import { PORTFOLIO_DATA, BlogPost } from '@/data/portfolioData';

export default function BlogSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  const categories = ['All', 'SEO & AI', 'Performance', 'Backend'];

  const filteredPosts = PORTFOLIO_DATA.blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="blog" className="py-24 relative bg-dark-bg border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-surface border border-white/10 text-xs font-mono text-accent">
            <BookOpen className="w-3.5 h-3.5" />
            <span>10 // TECHNICAL ARTICLES & INSIGHTS</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            Deep-dive technical writings on <span className="text-accent">AEO, Next.js & APIs</span>.
          </h2>
          <p className="text-customText-secondary text-base sm:text-lg leading-relaxed">
            Sharing real-world engineering insights, web performance benchmarks, and generative search optimization strategies.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-dark-surface border border-white/10 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-accent text-dark-bg font-bold shadow-accent-glow'
                    : 'text-customText-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-customText-muted absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-surface border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-customText-muted focus:outline-none focus:border-accent font-mono"
            />
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {filteredPosts.map((post: BlogPost, idx: number) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-3xl bg-dark-surface border border-white/10 hover:border-accent/40 transition-all duration-300 flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-customText-muted mb-3">
                  <span className="text-accent font-semibold">{post.category}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h3 className="font-display font-bold text-xl text-white group-hover:text-accent transition-colors leading-snug mb-3">
                  {post.title}
                </h3>
                <p className="text-customText-secondary text-xs sm:text-sm leading-relaxed mb-6">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {post.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-dark-card text-[10px] font-mono text-customText-muted border border-white/5">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Read Action Button */}
              <button
                onClick={() => setActiveArticle(post)}
                className="w-full py-2.5 px-4 rounded-xl bg-dark-card border border-white/10 hover:border-accent/40 text-white font-medium text-xs transition-all flex items-center justify-between group/btn"
              >
                <span>Read Full Article</span>
                <ArrowUpRight className="w-4 h-4 text-accent group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Article Full Preview Modal */}
        <AnimatePresence>
          {activeArticle && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveArticle(null)}
                className="fixed inset-0 bg-dark-bg/85 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-dark-surface border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl z-10 space-y-6"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-3 text-xs font-mono text-accent mb-2">
                      <span>{activeArticle.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-customText-muted"><Calendar className="w-3.5 h-3.5" /> {activeArticle.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-customText-muted"><User className="w-3.5 h-3.5" /> {activeArticle.author}</span>
                    </div>
                    <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
                      {activeArticle.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="p-2 rounded-xl bg-dark-card text-customText-secondary hover:text-white border border-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Article Content */}
                <div className="text-customText-secondary text-sm sm:text-base leading-relaxed space-y-4 font-normal">
                  <p className="text-white font-medium text-lg leading-snug p-4 rounded-xl bg-dark-card border-l-4 border-accent">
                    {activeArticle.excerpt}
                  </p>
                  <p>{activeArticle.content}</p>
                  <p>
                    Implementing Answer Engine Optimization requires structuring content into entity triples, leveraging microdata or JSON-LD schema graphs, and serving ultra-clean HTML syntax with minimal hydration overhead.
                  </p>
                </div>

                {/* Article Tags & Close */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {activeArticle.tags.map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded bg-dark-bg font-mono text-xs text-accent border border-white/10">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="px-5 py-2.5 rounded-xl bg-accent text-dark-bg font-bold text-xs hover:bg-accent-hover"
                  >
                    Done Reading
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
