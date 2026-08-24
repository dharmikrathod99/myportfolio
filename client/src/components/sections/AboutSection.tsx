'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Award, Target, Rocket, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';

export default function AboutSection() {
  const coreValues = [
    {
      icon: <Target className="w-5 h-5 text-accent" />,
      title: "Performance First",
      desc: "Zero compromise on Core Web Vitals. Sub-1.5s LCP, zero CLS shift, and hyper-optimized assets on every project."
    },
    {
      icon: <Rocket className="w-5 h-5 text-aurora-cyan" />,
      title: "Scalable Architecture",
      desc: "Modular React Server Components and resilient Node.js REST APIs engineered for 10x business growth."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-aurora-blue" />,
      title: "AEO & GEO Ready",
      desc: "Ready for AI search indexing (ChatGPT, Gemini, Perplexity) with structured JSON-LD graphs and llms.txt standards."
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-aurora-purple" />,
      title: "Client Centricity",
      desc: "Direct communication with the founder, daily transparent sprint updates, and 100% on-time project completion."
    }
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-dark-bg border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-surface border border-white/10 text-xs font-mono text-accent">
            <User className="w-3.5 h-3.5" />
            <span>02 // ABOUT DR.DEVELOPER</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            About <span className="text-accent">DR.Developer</span>
          </h2>
          <p className="text-customText-secondary text-base sm:text-lg leading-relaxed">
            I'm <strong className="text-white">Dharmik Rathod</strong> (known as <strong className="text-accent">DR.Developer</strong>), a Software Engineer specializing in Full Stack Web Development using the MERN Stack and AI Integrations.
          </p>
        </div>

        {/* Top Info Grid: Bio & Values */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          
          {/* Bio & Mission Card (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 p-8 rounded-2xl bg-dark-surface border border-white/10 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
            <h3 className="font-display font-bold text-2xl text-white mb-4">
              Software Engineer & MERN Stack Developer
            </h3>
            <div className="space-y-4 text-customText-secondary text-sm sm:text-base leading-relaxed">
              {PORTFOLIO_DATA.personalInfo.aboutDetailed.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Quick Highlights */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium text-sm">Full Stack Mastery</h4>
                  <p className="text-xs text-customText-secondary">Next.js 14, React, Node.js, Express, MongoDB, MySQL</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium text-sm">Generative AI & AEO</h4>
                  <p className="text-xs text-customText-secondary">ChatGPT API, Gemini 1.5, JSON-LD Schemas, llms.txt</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Core Values Grid (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {coreValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-5 rounded-2xl bg-dark-card border border-white/10 hover:border-accent/40 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-dark-bg border border-white/10 group-hover:scale-110 transition-transform">
                    {value.icon}
                  </div>
                  <h4 className="font-display font-semibold text-white text-base group-hover:text-accent transition-colors">
                    {value.title}
                  </h4>
                </div>
                <p className="text-xs text-customText-secondary leading-relaxed pl-12">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Career & Agency Timeline */}
        <div className="mt-20">
          <h3 className="font-display font-bold text-2xl text-white mb-8 flex items-center gap-3">
            <Award className="w-6 h-6 text-accent" />
            <span>Career & Engineering Journey</span>
          </h3>

          <div className="relative border-l border-white/10 pl-6 sm:pl-10 space-y-10">
            {PORTFOLIO_DATA.journey.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative group"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-dark-bg border-2 border-accent group-hover:bg-accent group-hover:scale-125 transition-all" />

                <div className="p-6 rounded-2xl bg-dark-surface border border-white/10 hover:border-accent/40 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-semibold">
                      {item.year}
                    </span>
                    <span className="text-xs font-mono text-customText-muted">{item.company}</span>
                  </div>
                  <h4 className="font-display font-bold text-xl text-white">
                    {item.title} <span className="text-customText-secondary font-normal text-sm">({item.role})</span>
                  </h4>
                  <p className="text-customText-secondary text-sm mt-2 leading-relaxed">
                    {item.description}
                  </p>
                  <ul className="mt-4 space-y-1.5 text-xs text-customText-primary font-mono">
                    {item.achievements.map((ach, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
