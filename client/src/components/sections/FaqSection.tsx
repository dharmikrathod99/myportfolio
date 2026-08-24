'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';
import { PORTFOLIO_DATA, FaqItem } from '@/data/portfolioData';

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = PORTFOLIO_DATA.faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 relative bg-dark-bg border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-surface border border-white/10 text-xs font-mono text-accent">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>11 // FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            Clear answers to common <span className="text-accent">engineering queries</span>.
          </h2>
          <p className="text-customText-secondary text-base sm:text-lg leading-relaxed">
            Everything you need to know about timelines, code handover, SEO guarantees, and tech stack choices.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-8 relative max-w-md">
          <Search className="w-4 h-4 text-customText-muted absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-surface border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-customText-muted focus:outline-none focus:border-accent font-mono"
          />
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-10 space-y-4 max-w-4xl">
          {filteredFaqs.map((faq: FaqItem, idx: number) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="rounded-2xl bg-dark-surface border border-white/10 overflow-hidden transition-all shadow-lg"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <span className="font-display font-bold text-base sm:text-lg text-white">
                    {faq.question}
                  </span>
                  <div className={`p-2 rounded-xl bg-dark-card border border-white/10 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-accent/10 border-accent/30' : ''}`}>
                    <ChevronDown className={`w-4 h-4 ${isOpen ? 'text-accent' : 'text-customText-secondary'}`} />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 pt-2 border-t border-white/5 text-customText-secondary text-sm leading-relaxed"
                    >
                      <p>{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
