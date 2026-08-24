'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Layout, Server, Zap, Terminal, Sparkles } from 'lucide-react';
import { PORTFOLIO_DATA, SkillCategory } from '@/data/portfolioData';

export default function SkillsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...PORTFOLIO_DATA.skillCategories.map((c) => c.category)];

  const filteredCategories: SkillCategory[] =
    selectedCategory === 'All'
      ? PORTFOLIO_DATA.skillCategories
      : PORTFOLIO_DATA.skillCategories.filter((c) => c.category === selectedCategory);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout':
        return <Layout className="w-5 h-5 text-accent" />;
      case 'Server':
        return <Server className="w-5 h-5 text-aurora-cyan" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-aurora-blue" />;
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-aurora-purple" />;
      default:
        return <Code className="w-5 h-5 text-accent" />;
    }
  };

  return (
    <section id="skills" className="py-24 relative bg-dark-bg border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-surface border border-white/10 text-xs font-mono text-accent">
            <Code className="w-3.5 h-3.5" />
            <span>03 // SKILLS & TECH STACK</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            Categorized technical capabilities & <span className="text-accent">mastery level</span>.
          </h2>
          <p className="text-customText-secondary text-base sm:text-lg leading-relaxed">
            Every technology in my arsenal is selected for high performance, strict type safety, long-term scalability, and flawless user experience.
          </p>
        </div>

        {/* Filter Tab Bar */}
        <div className="flex flex-wrap items-center gap-2 mt-8 p-1.5 rounded-2xl bg-dark-surface border border-white/10 max-w-fit">
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

        {/* Categorized Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {filteredCategories.map((catGroup, idx) => (
            <motion.div
              key={catGroup.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-8 rounded-2xl bg-dark-surface border border-white/10 relative overflow-hidden shadow-xl"
            >
              {/* Category Card Header */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                <div className="p-3 rounded-xl bg-dark-card border border-white/10">
                  {getCategoryIcon(catGroup.iconName)}
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-white">{catGroup.category}</h3>
                  <p className="text-xs text-customText-secondary font-mono">{catGroup.description}</p>
                </div>
              </div>

              {/* Skills List */}
              <div className="space-y-4">
                {catGroup.skills.map((skill) => (
                  <div key={skill.name} className="space-y-1.5 group">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold group-hover:text-accent transition-colors">
                          {skill.name}
                        </span>
                        {skill.highlight && (
                          <span className="text-[10px] text-customText-muted hidden sm:inline">
                            ({skill.highlight})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-customText-muted bg-white/5 px-2 py-0.5 rounded">
                          {skill.experience}
                        </span>
                        <span className="text-accent font-bold">{skill.level}%</span>
                      </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-primary via-accent to-aurora-cyan rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Extra Bottom Badge */}
        <div className="mt-12 p-6 rounded-2xl bg-dark-surface/60 border border-accent/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-accent" />
            <div>
              <h4 className="text-white font-bold text-sm">Need a custom stack integration?</h4>
              <p className="text-xs text-customText-secondary">I adapt quickly to modern frameworks, serverless edges, and specialized APIs.</p>
            </div>
          </div>
          <a
            href="#contact"
            className="px-5 py-2.5 rounded-xl bg-accent text-dark-bg font-bold text-xs hover:bg-accent-hover transition-colors shrink-0"
          >
            Discuss Stack
          </a>
        </div>

      </div>
    </section>
  );
}
