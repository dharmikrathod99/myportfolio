'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ExternalLink, Github, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DepthCarouselProject {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  metrics?: { label: string; value: string }[];
  liveUrl?: string;
  githubUrl?: string;
}

export interface DepthBlurCarouselProps {
  projects: DepthCarouselProject[];
  itemWidth?: number;
  itemHeight?: number;
  sideItemWidth?: number;
  sideItemHeight?: number;
  gap?: number;
  maxRotation?: number;
  perspective?: number;
  scrollDamping?: number;
  blurSpread?: number;
  blurStrength?: number;
  borderRadius?: number;
  className?: string;
}

export function DepthBlurCarousel({
  projects,
  itemWidth = 540,
  itemHeight = 350,
  sideItemWidth = 360,
  sideItemHeight = 310,
  gap = 48,
  maxRotation = 65,
  perspective = 850,
  scrollDamping = 85,
  blurSpread = 22,
  blurStrength = 20,
  borderRadius = 20,
  className = '',
}: DepthBlurCarouselProps) {
  // Ensure enough items in circular loop
  const renderItems = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    const pool = [...projects];
    const items: DepthCarouselProject[] = [];
    while (items.length < Math.max(12, projects.length * 3)) {
      items.push(...pool);
    }
    return items;
  }, [projects]);

  const totalItems = renderItems.length;
  const scrollTarget = useRef(0);
  const rawScroll = useMotionValue(0);
  const snapTimeout = useRef<NodeJS.Timeout | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const smoothScroll = useSpring(rawScroll, {
    stiffness: 170,
    damping: scrollDamping,
    mass: 0.9,
    restDelta: 0.001,
  });

  // Track active center card index for dots
  useEffect(() => {
    const unsubscribe = smoothScroll.on('change', (v) => {
      const normalized = Math.round(v) % (projects.length || 1);
      const active = (normalized + projects.length) % projects.length;
      setActiveIndex(active);
    });
    return () => unsubscribe();
  }, [smoothScroll, projects.length]);

  const isHoveringCardRef = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // Intercept wheel scrolling ONLY when cursor is hovering over a card
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onNativeWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      const isTargetCard = target && target.closest('.depth-card') !== null;
      const shouldIntercept = isHoveringCardRef.current || isTargetCard;

      if (!shouldIntercept) {
        // Outside cards: let standard website scroll work smoothly
        return;
      }

      // Over card: scroll the 3D cards with smooth physics
      e.preventDefault();
      e.stopPropagation();

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const step = Math.sign(delta) * Math.min(Math.abs(delta), 60);
      scrollTarget.current += step * 0.0024;
      rawScroll.set(scrollTarget.current);

      if (snapTimeout.current) clearTimeout(snapTimeout.current);
      snapTimeout.current = setTimeout(() => {
        scrollTarget.current = Math.round(scrollTarget.current);
        rawScroll.set(scrollTarget.current);
      }, 160);
    };

    stage.addEventListener('wheel', onNativeWheel, { passive: false });

    return () => {
      stage.removeEventListener('wheel', onNativeWheel);
    };
  }, [rawScroll]);

  const handlePan = (_: any, info: { delta: { x: number } }) => {
    const delta = -info.delta.x * 0.004;
    scrollTarget.current += delta;
    rawScroll.set(scrollTarget.current);
    if (snapTimeout.current) clearTimeout(snapTimeout.current);
  };

  const handlePanEnd = (_: any, info: { velocity: { x: number } }) => {
    scrollTarget.current += -info.velocity.x * 0.0012;
    scrollTarget.current = Math.round(scrollTarget.current);
    rawScroll.set(scrollTarget.current);
  };

  const handleNext = () => {
    scrollTarget.current = Math.round(scrollTarget.current) + 1;
    rawScroll.set(scrollTarget.current);
  };

  const handlePrev = () => {
    scrollTarget.current = Math.round(scrollTarget.current) - 1;
    rawScroll.set(scrollTarget.current);
  };

  const handleDotClick = (idx: number) => {
    const current = Math.round(scrollTarget.current);
    const currentModulo = ((current % projects.length) + projects.length) % projects.length;
    let diff = idx - currentModulo;
    if (diff > projects.length / 2) diff -= projects.length;
    if (diff < -projects.length / 2) diff += projects.length;
    scrollTarget.current = current + diff;
    rawScroll.set(scrollTarget.current);
  };

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden select-none py-6 sm:py-10 flex flex-col items-center justify-center',
        className
      )}
      style={{ perspective: `${Math.max(perspective, 1)}px` }}
    >
      {/* 3D Stage Container */}
      <div
        ref={stageRef}
        className="relative w-full h-[460px] sm:h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        {/* Gesture Pan overlay confined to cards area */}
        <motion.div
          onPan={handlePan}
          onPanEnd={handlePanEnd}
          className="absolute inset-x-0 h-full max-w-5xl mx-auto z-20 touch-pan-y"
        />

        {/* 3D Cards preserve-3d root */}
        <div
          className="relative pointer-events-none"
          style={{ width: 0, height: 0, transformStyle: 'preserve-3d' }}
        >
          {renderItems.map((project, i) => (
            <DepthCardItem
              key={`depth-card-${project.id}-${i}`}
              project={project}
              index={i}
              total={totalItems}
              smoothScroll={smoothScroll}
              itemWidth={itemWidth}
              itemHeight={itemHeight}
              sideItemWidth={sideItemWidth}
              sideItemHeight={sideItemHeight}
              gap={gap}
              maxRotation={maxRotation}
              borderRadius={borderRadius}
              onMouseEnter={() => {
                isHoveringCardRef.current = true;
              }}
              onMouseLeave={() => {
                isHoveringCardRef.current = false;
              }}
            />
          ))}
        </div>

        {/* Left Progressive Depth Blur Vignette */}
        <div
          className="absolute left-0 top-0 bottom-0 pointer-events-none z-30 hidden sm:block"
          style={{
            width: `${blurSpread}%`,
            backdropFilter: `blur(${blurStrength}px)`,
            WebkitBackdropFilter: `blur(${blurStrength}px)`,
            maskImage: 'linear-gradient(to right, black 0%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 100%)',
          }}
        />

        {/* Right Progressive Depth Blur Vignette */}
        <div
          className="absolute right-0 top-0 bottom-0 pointer-events-none z-30 hidden sm:block"
          style={{
            width: `${blurSpread}%`,
            backdropFilter: `blur(${blurStrength}px)`,
            WebkitBackdropFilter: `blur(${blurStrength}px)`,
            maskImage: 'linear-gradient(to left, black 0%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to left, black 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Navigation Controls & Pagination */}
      <div className="relative z-40 flex items-center justify-between w-full max-w-4xl px-4 mt-2">
        {/* Prev Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous project"
          className="p-3 rounded-full bg-slate-900/80 hover:bg-accent text-white border border-white/15 backdrop-blur-xl shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Interactive Dots */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-card/70 border border-white/10 backdrop-blur-xl shadow-md">
          {projects.map((_, dotIdx) => (
            <button
              key={`dot-${dotIdx}`}
              type="button"
              onClick={() => handleDotClick(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                activeIndex === dotIdx
                  ? 'w-7 bg-accent shadow-[0_0_12px_rgba(58,134,255,0.8)]'
                  : 'w-2 bg-white/30 hover:bg-white/60'
              )}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next project"
          className="p-3 rounded-full bg-slate-900/80 hover:bg-accent text-white border border-white/15 backdrop-blur-xl shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 group"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}

function DepthCardItem({
  project,
  index,
  total,
  smoothScroll,
  itemWidth,
  itemHeight,
  sideItemWidth,
  sideItemHeight,
  gap,
  maxRotation,
  borderRadius,
  onMouseEnter,
  onMouseLeave,
}: {
  project: DepthCarouselProject;
  index: number;
  total: number;
  smoothScroll: any;
  itemWidth: number;
  itemHeight: number;
  sideItemWidth: number;
  sideItemHeight: number;
  gap: number;
  maxRotation: number;
  borderRadius: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const localOffset = useTransform(smoothScroll, (v: number) => {
    let linearBase = index - v;
    let mapped = ((linearBase % total) + total) % total;
    if (mapped > total / 2) mapped -= total;
    return mapped;
  });

  const absOffset = useTransform(localOffset, Math.abs);
  const cardWidth = useTransform(absOffset, [0, 1], [itemWidth, sideItemWidth], { clamp: true });
  const cardHeight = useTransform(absOffset, [0, 1], [itemHeight, sideItemHeight], { clamp: true });
  const marginLeft = useTransform(cardWidth, (w) => -w / 2);
  const marginTop = useTransform(cardHeight, (h) => -h / 2);

  const x = useTransform(localOffset, (o) => {
    const a = Math.abs(o);
    const s = Math.sign(o);
    const centerToNext = itemWidth / 2 + gap + sideItemWidth / 2;
    const sideToSide = sideItemWidth + gap;
    if (a === 0) return 0;
    if (a <= 1) return s * centerToNext * a;
    return s * (centerToNext + (a - 1) * sideToSide * 0.85);
  });

  const z = useTransform(absOffset, (a) => -a * 190);
  const rotateY = useTransform(localOffset, (o) => {
    return Math.sign(o) * Math.min(Math.abs(o) * 35, maxRotation);
  });
  const zIndex = useTransform(absOffset, (a) => 1000 - Math.round(a * 10));
  const visibilityOpacity = useTransform(absOffset, [0, 3.5, 5], [1, 0.9, 0]);

  return (
    <motion.div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        marginLeft,
        marginTop,
        width: cardWidth,
        height: cardHeight,
        rotateY,
        x,
        z,
        zIndex,
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="depth-card relative w-full h-full overflow-hidden border border-white/20 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-slate-900 group select-none pointer-events-auto"
        style={{
          borderRadius,
          opacity: visibilityOpacity,
        }}
      >
        {/* Background Project Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/40" />

        {/* Category & Tag Pill at Top */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/90 text-white keep-white backdrop-blur-md shadow-md flex items-center gap-1.5" style={{ color: '#ffffff' }}>
            <Sparkles className="w-3 h-3 text-white" /> {project.category}
          </span>

          {project.metrics && project.metrics[0] && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 backdrop-blur-md">
              {project.metrics[0].label}: <strong className="text-white keep-white" style={{ color: '#ffffff' }}>{project.metrics[0].value}</strong>
            </span>
          )}
        </div>

        {/* Content Card Body */}
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 flex flex-col justify-end z-10 space-y-2">
          <span className="text-[11px] font-mono text-accent font-semibold tracking-wide">
            {project.subtitle}
          </span>
          <h3 className="font-display font-extrabold text-lg sm:text-xl md:text-2xl text-white keep-white tracking-tight leading-snug drop-shadow-md" style={{ color: '#ffffff' }}>
            {project.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed" style={{ color: '#cbd5e1' }}>
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-white/15 border border-white/15 text-[10px] font-mono text-slate-200"
                style={{ color: '#e2e8f0' }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-3 pt-2 pointer-events-auto">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-accent hover:bg-accent/90 text-white keep-white text-xs font-mono font-bold shadow-md hover:shadow-accent/40 transition-all hover:scale-105 active:scale-95"
                style={{ color: '#ffffff' }}
              >
                <ExternalLink className="w-3.5 h-3.5 text-white" />
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white keep-white border border-white/20 text-xs font-mono font-semibold transition-all hover:scale-105 active:scale-95"
                style={{ color: '#ffffff' }}
              >
                <Github className="w-3.5 h-3.5 text-white" />
                Code
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default DepthBlurCarousel;
