'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Github, Code, GitCommit, CheckCircle2, Star } from 'lucide-react';

export default function AchievementsSection() {
  const achievements = [
    { title: "GitHub Commits (2026)", value: "1,420+", icon: <GitCommit className="w-5 h-5 text-accent" /> },
    { title: "LeetCode Solved", value: "350+", icon: <Code className="w-5 h-5 text-aurora-cyan" /> },
    { title: "Open Source Stars", value: "850+", icon: <Star className="w-5 h-5 text-aurora-blue" /> },
    { title: "Production Deployments", value: "120+", icon: <CheckCircle2 className="w-5 h-5 text-aurora-purple" /> }
  ];

  // Grid of mock github activity squares (52 weeks x 7 days styled grid)
  const activitySquares = Array.from({ length: 112 }, (_, i) => {
    const levels = ['bg-white/5', 'bg-accent/20', 'bg-accent/40', 'bg-accent/70', 'bg-accent'];
    return levels[Math.floor(Math.sin(i * 0.3) * 2 + 2.5) % levels.length];
  });

  return (
    <section id="achievements" className="py-24 relative bg-dark-bg border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-surface border border-white/10 text-xs font-mono text-accent">
            <Trophy className="w-3.5 h-3.5" />
            <span>09 // ACHIEVEMENTS & CODING ACTIVITY</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            Relentless consistency & <span className="text-accent">open source metrics</span>.
          </h2>
          <p className="text-customText-secondary text-base sm:text-lg leading-relaxed">
            A look at coding activity, problem-solving track record, and open source contributions.
          </p>
        </div>

        {/* Top 4 Stats Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {achievements.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-dark-surface border border-white/10 hover:border-accent/40 transition-all text-center space-y-2"
            >
              <div className="p-3 rounded-xl bg-dark-card border border-white/5 w-fit mx-auto">
                {item.icon}
              </div>
              <span className="font-display font-extrabold text-3xl text-white block">
                {item.value}
              </span>
              <span className="text-xs font-mono text-customText-secondary block uppercase tracking-wider">
                {item.title}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Simulated GitHub Contribution Heatmap Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-8 p-6 sm:p-8 rounded-3xl bg-dark-surface border border-white/10 space-y-6 shadow-2xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <Github className="w-6 h-6 text-white" />
              <div>
                <h3 className="font-display font-bold text-lg text-white">GitHub Contribution Graph</h3>
                <span className="text-xs font-mono text-customText-muted">@dharmiktarasaka • 1,420 contributions in 2026</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-customText-secondary">
              <span>Less</span>
              <span className="w-3 h-3 rounded-sm bg-white/5" />
              <span className="w-3 h-3 rounded-sm bg-accent/20" />
              <span className="w-3 h-3 rounded-sm bg-accent/50" />
              <span className="w-3 h-3 rounded-sm bg-accent" />
              <span>More</span>
            </div>
          </div>

          {/* Activity Squares Heatmap */}
          <div className="grid grid-cols-[repeat(16,minmax(0,1fr))] sm:grid-cols-[repeat(28,minmax(0,1fr))] gap-1.5 pt-2">
            {activitySquares.map((bgClass, idx) => (
              <div
                key={idx}
                className={`h-3 rounded-sm ${bgClass} hover:ring-1 hover:ring-white transition-all`}
                title={`Activity day ${idx + 1}`}
              />
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
