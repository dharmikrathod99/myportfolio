'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextAnimateProps {
  text: string;
  className?: string;
  type?: 'words' | 'chars';
  delay?: number;
  duration?: number;
  stagger?: number;
  highlightText?: string;
  highlightClassName?: string;
}

export function TextAnimate({
  text,
  className = '',
  type = 'words',
  delay = 0,
  duration = 0.5,
  stagger = 0.05,
  highlightText,
  highlightClassName = 'text-accent',
}: TextAnimateProps) {
  const items = type === 'words' ? text.split(' ') : text.split('');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: stagger,
      },
    },
  };

  const childVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: 'blur(8px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={cn('inline-flex flex-wrap', className)}
    >
      {items.map((item, index) => {
        const isHighlighted = highlightText && item.toLowerCase().includes(highlightText.toLowerCase());

        return (
          <motion.span
            key={index}
            variants={childVariants}
            className={cn(
              type === 'words' ? 'mr-[0.25em] inline-block' : 'inline-block',
              isHighlighted ? highlightClassName : ''
            )}
          >
            {item === ' ' ? '\u00A0' : item}
          </motion.span>
        );
      })}
    </motion.span>
  );
}
