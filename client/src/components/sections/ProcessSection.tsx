'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Workflow, Search, FileCode, Palette, Code2, ShieldAlert, Rocket, Zap, LifeBuoy } from 'lucide-react';

export default function ProcessSection() {
  const steps = [
    {
      num: "01",
      title: "Discovery & Strategy",
      desc: "Deep dive into project scope, target audience, business goals, and competitive positioning.",
      icon: <Search className="w-5 h-5 text-accent" />
    },
    {
      num: "02",
      title: "Architecture & Planning",
      desc: "Selecting framework, database schemas, REST API contracts, and component hierarchy.",
      icon: <FileCode className="w-5 h-5 text-aurora-cyan" />
    },
    {
      num: "03",
      title: "UI/UX & Visual Identity",
      desc: "Crafting glassmorphism design tokens, dark premium color systems, and micro-interactions.",
      icon: <Palette className="w-5 h-5 text-aurora-blue" />
    },
    {
      num: "04",
      title: "Full Stack Development",
      desc: "Writing clean, modular Next.js App Router code and Node.js REST APIs with strict TypeScript.",
      icon: <Code2 className="w-5 h-5 text-aurora-purple" />
    },
    {
      num: "05",
      title: "Rigorous QA & Security",
      desc: "Unit testing, Zod validation, cross-browser compatibility checks, and security audits.",
      icon: <ShieldAlert className="w-5 h-5 text-accent" />
    },
    {
      num: "06",
      title: "Cloud Deployment",
      desc: "Configuring Vercel/Docker edge nodes, SSL encryption, environment variables, and CDN rules.",
      icon: <Rocket className="w-5 h-5 text-aurora-cyan" />
    },
    {
      num: "07",
      title: "Speed & AEO Tuning",
      desc: "Achieving 95+ PageSpeed scores, sub-1.5s LCP, and JSON-LD schema graphs for AI search.",
      icon: <Zap className="w-5 h-5 text-accent" />
    },
    {
      num: "08",
      title: "Ongoing Growth Support",
      desc: "Continuous server monitoring, feature updates, dependency maintenance, and retainers.",
      icon: <LifeBuoy className="w-5 h-5 text-aurora-purple" />
    }
  ];

  return (
    <section id="process" className="py-24 relative bg-dark-bg border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-surface border border-white/10 text-xs font-mono text-accent">
            <Workflow className="w-3.5 h-3.5" />
            <span>06 // DEVELOPMENT PROCESS</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            An 8-stage <span className="text-accent">engineering pipeline</span> built for precision.
          </h2>
          <p className="text-customText-secondary text-base sm:text-lg leading-relaxed">
            Eliminating guesswork with a structured, transparent software development workflow from initial concept to post-launch optimization.
          </p>
        </div>

        {/* 8-Stage Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="p-6 rounded-2xl bg-dark-surface border border-white/10 hover:border-accent/40 transition-all duration-300 relative group shadow-xl"
            >
              {/* Step Number Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-2xl font-extrabold text-white/20 group-hover:text-accent transition-colors">
                  {step.num}
                </span>
                <div className="p-2.5 rounded-xl bg-dark-card border border-white/10 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
              </div>

              <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-accent transition-colors">
                {step.title}
              </h3>
              <p className="text-customText-secondary text-xs sm:text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
