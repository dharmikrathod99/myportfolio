'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, Quote, ShieldCheck } from 'lucide-react';
import { PORTFOLIO_DATA, Testimonial } from '@/data/portfolioData';

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 relative bg-dark-bg border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-surface border border-white/10 text-xs font-mono text-accent">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>08 // CLIENT TESTIMONIALS</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            Trusted by founders, CEOs, and <span className="text-accent">digital leaders</span>.
          </h2>
          <p className="text-customText-secondary text-base sm:text-lg leading-relaxed">
            Here is what global clients say about collaborating with Dharmik Tarasaka and Tarasaka Digital Solutions.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {PORTFOLIO_DATA.testimonials.map((t: Testimonial, idx: number) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-8 rounded-3xl bg-dark-surface border border-white/10 hover:border-accent/40 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group shadow-2xl"
            >
              {/* Quote Icon Background */}
              <Quote className="absolute top-6 right-6 w-12 h-12 text-white/5 pointer-events-none group-hover:text-accent/10 transition-colors" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-customText-primary text-sm sm:text-base leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              {/* Client Info Footer */}
              <div className="pt-6 border-t border-white/10 flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-accent/40"
                />
                <div>
                  <h4 className="font-display font-bold text-white text-base flex items-center gap-1.5">
                    <span>{t.name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  </h4>
                  <span className="block text-xs font-mono text-customText-secondary">
                    {t.title}, <span className="text-white">{t.company}</span>
                  </span>
                  <span className="block text-[10px] font-mono text-accent mt-0.5">
                    {t.projectType}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
