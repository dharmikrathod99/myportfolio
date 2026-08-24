'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface VengeanceBentoItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  colSpan?: string;
}

export function VengeanceBentoGrid({ items }: { items: VengeanceBentoItem[] }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setActiveId(id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item, idx) => {
        const isHovered = activeId === item.id;
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            onMouseMove={(e) => handleMouseMove(e, item.id)}
            onMouseLeave={() => setActiveId(null)}
            className={`relative overflow-hidden rounded-3xl border border-white/10 bg-dark-surface p-8 transition-all duration-500 hover:border-accent/40 shadow-2xl ${
              item.colSpan || ''
            }`}
          >
            {/* Vengeance Spotlight Effect */}
            {isHovered && (
              <div
                className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300"
                style={{
                  background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 136, 204, 0.18), transparent 80%)`,
                }}
              />
            )}

            {/* Badge */}
            {item.badge && (
              <span className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-[10px] uppercase font-bold tracking-wider mb-4">
                {item.badge}
              </span>
            )}

            {/* Icon Header */}
            <div className="p-3.5 rounded-2xl bg-dark-card border border-white/10 w-fit mb-4">
              {item.icon}
            </div>

            <span className="text-xs font-mono text-accent uppercase tracking-wider">{item.subtitle}</span>
            <h3 className="font-display font-bold text-xl text-white mt-1 mb-3">
              {item.title}
            </h3>
            <p className="text-customText-secondary text-xs sm:text-sm leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
