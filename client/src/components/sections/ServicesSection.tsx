'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Globe, Cpu, Code, Workflow, Rocket, Sliders, Search, BarChart3, Check, ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_DATA, Service } from '@/data/portfolioData';
import { GlowingEffect, BorderBeam } from '@/components/ui/animate-ui';

export default function ServicesSection() {
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers':
        return <Layers className="w-6 h-6 text-accent" />;
      case 'Globe':
        return <Globe className="w-6 h-6 text-accent" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-accent" />;
      case 'Code':
        return <Code className="w-6 h-6 text-accent" />;
      case 'Workflow':
        return <Workflow className="w-6 h-6 text-accent" />;
      case 'Rocket':
        return <Rocket className="w-6 h-6 text-accent" />;
      case 'Sliders':
        return <Sliders className="w-6 h-6 text-accent" />;
      case 'Search':
        return <Search className="w-6 h-6 text-accent" />;
      default:
        return <BarChart3 className="w-6 h-6 text-accent" />;
    }
  };

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-dark-bg/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-surface border border-white/10 text-xs font-mono text-accent">
            <Layers className="w-3.5 h-3.5" />
            <span>04 // SERVICES & SOLUTIONS (ANIMATE UI)</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            High-value engineering & <span className="text-accent">digital solutions</span>.
          </h2>
          <p className="text-customText-secondary text-base sm:text-lg leading-relaxed">
            From single-page Next.js web applications to complete enterprise software architectures, AI search optimization, and automated workflows.
          </p>
        </div>

        {/* Services Grid with Animate UI GlowingEffect & BorderBeam */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {PORTFOLIO_DATA.services.map((service: Service, idx: number) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <GlowingEffect glowColor="#3A86FF" spread={350} className="h-full">
                <div className="p-6 rounded-2xl bg-dark-surface border border-white/10 hover:border-accent/50 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-xl h-full">
                  
                  {/* Animate UI BorderBeam on Popular Items */}
                  {service.popular && (
                    <BorderBeam size={180} duration={8} colorFrom="#3A86FF" />
                  )}

                  {/* Popular Badge */}
                  {service.popular && (
                    <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/40 text-accent font-mono text-[10px] uppercase font-bold tracking-wider">
                      Featured Service
                    </div>
                  )}

                  <div>
                    {/* Icon Header */}
                    <div className="p-3.5 rounded-2xl bg-dark-card border border-white/10 w-fit mb-5 group-hover:scale-110 group-hover:border-accent/40 transition-all">
                      {getServiceIcon(service.icon)}
                    </div>

                    <h3 className="font-display font-bold text-xl text-white group-hover:text-accent transition-colors mb-2">
                      {service.title}
                    </h3>
                    <p className="text-customText-secondary text-xs sm:text-sm leading-relaxed mb-6">
                      {service.fullDesc}
                    </p>

                    {/* Deliverables List */}
                    <div className="space-y-2 pt-4 border-t border-white/5 mb-6">
                      <span className="block text-[11px] font-mono text-customText-muted uppercase tracking-wider">
                        Key Deliverables:
                      </span>
                      {service.deliverables.map((deliv, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-mono text-customText-primary">
                          <Check className="w-3.5 h-3.5 text-accent shrink-0" />
                          <span>{deliv}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inquiry Button */}
                  <a
                    href="#contact"
                    className="w-full py-2.5 px-4 rounded-xl bg-dark-card border border-white/10 hover:border-accent/50 text-white font-medium text-xs transition-all flex items-center justify-between group/btn"
                  >
                    <span>Request Service Proposal</span>
                    <ArrowUpRight className="w-4 h-4 text-accent group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </GlowingEffect>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
