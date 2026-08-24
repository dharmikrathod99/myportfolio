'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, ExternalLink, Github, Zap, X, ChevronRight, CheckCircle } from 'lucide-react';
import { PORTFOLIO_DATA, Project } from '@/data/portfolioData';
import { LiquidMetal } from '@/components/ui/animate-ui/liquid-metal';

export default function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeCaseStudy, setActiveCaseStudy] = useState<Project | null>(null);

  const categories = ['All', 'Full Stack', 'Next.js', 'AI & Automation', 'SaaS'];

  const filteredProjects =
    selectedCategory === 'All'
      ? PORTFOLIO_DATA.projects
      : PORTFOLIO_DATA.projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-24 relative bg-dark-bg border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-surface border border-white/10 text-xs font-mono text-accent">
            <Briefcase className="w-3.5 h-3.5" />
            <span>05 // PORTFOLIO</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            Recent <span className="text-accent">Projects</span>
          </h2>
          <p className="text-customText-secondary text-base sm:text-lg leading-relaxed">
            Explore a collection of web applications, SaaS platforms, AI-powered solutions, management systems, and business websites showcasing my expertise in modern web development, responsive design, backend architecture, and scalable software engineering.
          </p>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap items-center gap-2 mt-8 p-1.5 rounded-2xl bg-dark-surface border border-white/10 max-w-fit">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative rounded-xl text-xs font-mono font-medium transition-all duration-300 overflow-hidden ${
                  isActive
                    ? 'p-[2px] shadow-[0_2px_15px_rgba(0,251,27,0.35)]'
                    : 'px-4 py-2 text-customText-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive ? (
                  <>
                    <LiquidMetal
                      colorBack="#042F0C"
                      colorTint="#00FB1B"
                      speed={0.8}
                      repetition={3}
                      distortion={0.25}
                      scale={1.2}
                      className="absolute inset-0 z-0 rounded-xl"
                    />
                    <div className="relative z-10 px-4 py-1.5 rounded-xl bg-[#080C14] text-white font-extrabold flex items-center justify-center overflow-hidden">
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-xl z-10 bg-gradient-to-b from-white/15 via-white/5 to-transparent" />
                      <span className="relative z-30 text-white font-extrabold uppercase tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                        {cat}
                      </span>
                    </div>
                  </>
                ) : (
                  <span>{cat}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Projects Showcase Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {filteredProjects.map((project: Project, idx: number) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="rounded-3xl bg-dark-surface border border-white/10 hover:border-accent/40 transition-all duration-300 overflow-hidden group shadow-2xl flex flex-col justify-between"
            >
              {/* Top Image & Device Frame Mockup */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-dark-card border-b border-white/10">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
                
                {/* Overlay Glow & Category Badge */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-surface via-transparent to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-dark-bg/80 border border-white/10 backdrop-blur-md text-accent text-xs font-mono font-semibold">
                  {project.category}
                </div>

                {/* Metrics Badges Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {project.metrics.map((m, i) => (
                      <div key={i} className="px-2.5 py-1 rounded-lg bg-dark-bg/90 border border-white/10 backdrop-blur-md text-[11px] font-mono text-white">
                        <span className="text-customText-muted">{m.label}: </span>
                        <span className="text-accent font-bold">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Details Body */}
              <div className="p-6 sm:p-8 space-y-4">
                <div>
                  <span className="text-xs font-mono text-accent uppercase tracking-wider">{project.subtitle}</span>
                  <h3 className="font-display font-bold text-2xl text-white group-hover:text-accent transition-colors mt-1">
                    {project.title}
                  </h3>
                </div>

                <p className="text-customText-secondary text-sm leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-md bg-dark-card border border-white/5 text-customText-primary text-xs font-mono">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions Bar */}
                <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <button
                    onClick={() => setActiveCaseStudy(project)}
                    className="flex items-center gap-1.5 text-xs font-mono text-accent hover:underline"
                  >
                    <span>Read Full Case Study</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-dark-card border border-white/10 hover:border-accent/40 text-customText-secondary hover:text-white transition-colors"
                      title="View GitHub Source Code"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="relative rounded-xl overflow-hidden p-[2px] shadow-[0_4px_16px_rgba(0,251,27,0.3)] hover:shadow-[0_6px_24px_rgba(0,251,27,0.55)] transition-all active:scale-95 group cursor-pointer"
                    >
                      <LiquidMetal
                        colorBack="#042F0C"
                        colorTint="#00FB1B"
                        speed={0.8}
                        repetition={3}
                        distortion={0.25}
                        scale={1.2}
                        className="absolute inset-0 z-0 rounded-xl"
                      />
                      <div className="relative z-10 px-4 py-2 rounded-xl bg-[#080C14] text-white flex items-center gap-1.5 overflow-hidden">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-xl z-10 bg-gradient-to-b from-white/15 via-white/5 to-transparent" />
                        <div className="pointer-events-none absolute inset-0 rounded-xl z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.8)]" />
                        <ExternalLink className="w-3.5 h-3.5 text-accent stroke-[2.5] relative z-30" />
                        <span className="relative z-30 text-white font-extrabold uppercase tracking-wider text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                          Live Preview
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Case Study Modal Drawer */}
        <AnimatePresence>
          {activeCaseStudy && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveCaseStudy(null)}
                className="fixed inset-0 bg-dark-bg/85 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-dark-surface border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-mono text-accent">{activeCaseStudy.category} Case Study</span>
                    <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mt-1">
                      {activeCaseStudy.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveCaseStudy(null)}
                    className="p-2 rounded-xl bg-dark-card text-customText-secondary hover:text-white border border-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Case Study Details */}
                <div className="space-y-6 text-sm">
                  {/* Challenge */}
                  <div className="p-4 rounded-xl bg-dark-card border border-white/5 space-y-1">
                    <h4 className="font-display font-semibold text-accent text-base">The Challenge</h4>
                    <p className="text-customText-secondary leading-relaxed">{activeCaseStudy.caseStudy.challenge}</p>
                  </div>

                  {/* Solution */}
                  <div className="p-4 rounded-xl bg-dark-card border border-white/5 space-y-1">
                    <h4 className="font-display font-semibold text-aurora-cyan text-base">The Solution</h4>
                    <p className="text-customText-secondary leading-relaxed">{activeCaseStudy.caseStudy.solution}</p>
                  </div>

                  {/* Result */}
                  <div className="p-4 rounded-xl bg-dark-card border border-accent/20 space-y-1">
                    <h4 className="font-display font-semibold text-white text-base flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      <span>Measurable Results</span>
                    </h4>
                    <p className="text-customText-primary font-mono leading-relaxed">{activeCaseStudy.caseStudy.result}</p>
                  </div>

                  {/* Tech Stack List */}
                  <div>
                    <h4 className="text-xs font-mono text-customText-muted uppercase tracking-wider mb-2">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeCaseStudy.caseStudy.techStack.map((tech) => (
                        <span key={tech} className="px-3 py-1 rounded-lg bg-dark-bg border border-white/10 font-mono text-xs text-white">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer Links */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <a
                    href={activeCaseStudy.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-mono text-customText-secondary hover:text-white"
                  >
                    <Github className="w-4 h-4" />
                    <span>Source Repository</span>
                  </a>
                  <a
                    href={activeCaseStudy.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="relative rounded-2xl overflow-hidden p-[2px] shadow-[0_4px_20px_rgba(0,251,27,0.35)] hover:shadow-[0_6px_28px_rgba(0,251,27,0.6)] transition-all active:scale-95 group cursor-pointer"
                  >
                    <LiquidMetal
                      colorBack="#042F0C"
                      colorTint="#00FB1B"
                      speed={0.8}
                      repetition={4}
                      distortion={0.3}
                      scale={1.2}
                      className="absolute inset-0 z-0 rounded-2xl"
                    />
                    <div className="relative z-10 px-5 py-2.5 rounded-2xl bg-[#080C14] text-white flex items-center gap-2 overflow-hidden">
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl z-10 bg-gradient-to-b from-white/15 via-white/5 to-transparent" />
                      <div className="pointer-events-none absolute inset-0 rounded-2xl z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.8)]" />
                      <ExternalLink className="w-4 h-4 text-accent stroke-[2.5] relative z-30" />
                      <span className="relative z-30 text-white font-extrabold uppercase tracking-wider text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                        Launch Live Site
                      </span>
                    </div>
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
