'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Check, X, Sparkles } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';

export default function WhyMeSection() {
  return (
    <section id="whyme" className="py-24 relative bg-dark-bg border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-surface border border-white/10 text-xs font-mono text-accent">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>07 // WHY CHOOSE ME</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            Building Digital Experiences <span className="text-accent">That Deliver Results</span>
          </h2>
          <p className="text-customText-secondary text-base sm:text-lg leading-relaxed">
            {PORTFOLIO_DATA.whyChooseMe.content}
          </p>
        </div>

        {/* Comparison Matrix Table */}
        <div className="mt-12 rounded-3xl bg-dark-surface border border-white/15 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 bg-dark-card border-b border-white/10 p-4 sm:p-6 text-xs font-mono font-bold tracking-wider uppercase">
            <div className="md:col-span-4 text-customText-muted">Engineering Standard</div>
            <div className="md:col-span-4 text-accent flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Dharmik Tarasaka</span>
            </div>
            <div className="md:col-span-4 text-customText-muted hidden md:block">Average Freelancer / Agency</div>
          </div>

          {/* Comparison Rows */}
          <div className="divide-y divide-white/5">
            {PORTFOLIO_DATA.whyHireMe.map((item, index) => (
              <motion.div
                key={item.feature}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="grid grid-cols-1 md:grid-cols-12 p-4 sm:p-6 items-center gap-4 hover:bg-white/[0.02] transition-colors"
              >
                {/* Feature Name */}
                <div className="md:col-span-4 font-display font-bold text-white text-base">
                  {item.feature}
                </div>

                {/* Dharmik's Standard */}
                <div className="md:col-span-4 p-3 rounded-xl bg-accent/10 border border-accent/30 text-xs sm:text-sm font-medium text-white flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{item.dharmik}</span>
                </div>

                {/* Average Standard */}
                <div className="md:col-span-4 p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-xs sm:text-sm font-normal text-customText-secondary flex items-start gap-2.5">
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{item.others}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
