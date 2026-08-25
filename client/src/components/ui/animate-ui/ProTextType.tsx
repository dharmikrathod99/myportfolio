'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type CursorPreset = '|' | '_' | '‖' | '❚' | '▋' | '▌' | '█';

export interface ProTextTypeProps extends React.HTMLAttributes<HTMLElement> {
  text: string | string[];
  as?: 'div' | 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  typingSpeed?: number;
  deletingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  loop?: boolean;
  variableSpeed?: { min: number; max: number };
  startOnVisible?: boolean;
  reverseMode?: boolean;
  showCursor?: boolean;
  cursorMode?: 'preset' | 'custom';
  cursorCharacterPreset?: CursorPreset;
  customCursorCharacter?: string;
  cursorClassName?: string;
  cursorBlinkDuration?: number;
  textColors?: string[];
  cursorColorMode?: 'matchFirst' | 'custom';
  cursorCustomColor?: string;
  hideCursorWhileTyping?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ProTextType - High Performance Framer-grade Typewriter Effect
 * Matches Framer ProTextType-KXoZ module specifications
 */
export function ProTextType({
  text,
  as: Tag = 'span',
  typingSpeed = 45,
  deletingSpeed = 25,
  initialDelay = 200,
  pauseDuration = 2000,
  loop = true,
  variableSpeed = { min: 25, max: 65 },
  startOnVisible = true,
  reverseMode = false,
  showCursor = true,
  cursorMode = 'preset',
  cursorCharacterPreset = '|',
  customCursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors,
  cursorColorMode = 'matchFirst',
  cursorCustomColor,
  hideCursorWhileTyping = false,
  className = '',
  style,
  ...rest
}: ProTextTypeProps) {
  const textArray = useMemo(
    () => (Array.isArray(text) ? text : [text ?? '']),
    [text]
  );

  const cursorChar =
    cursorMode === 'custom'
      ? customCursorCharacter?.length
        ? customCursorCharacter
        : '|'
      : cursorCharacterPreset;

  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);

  const containerRef = useRef<HTMLDivElement>(null);

  const firstColor = (textColors && textColors[0]) || 'currentColor';
  const resolvedCursorColor =
    cursorColorMode === 'custom' && cursorCustomColor
      ? cursorCustomColor
      : firstColor;

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    const lo = Math.max(0, Number(min) || 0);
    const hi = Math.max(lo, Number(max) || lo);
    return Math.random() * (hi - lo) + lo;
  }, [variableSpeed, typingSpeed]);

  const getCurrentTextColor = useCallback(() => {
    if (!textColors || textColors.length === 0) return undefined;
    return textColors[currentTextIndex % textColors.length];
  }, [textColors, currentTextIndex]);

  // Start animation when scrolled into viewport
  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;
    const el = containerRef.current;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [startOnVisible]);

  // Main typing & deleting animation state machine
  useEffect(() => {
    if (!isVisible) return;
    let timeout: NodeJS.Timeout | undefined;

    const currentText = textArray[currentTextIndex] ?? '';
    const processed = reverseMode
      ? currentText.split('').reverse().join('')
      : currentText;

    const run = () => {
      if (isDeleting) {
        if (displayedText.length === 0) {
          setIsDeleting(false);
          if (currentTextIndex === textArray.length - 1 && !loop) return;
          setCurrentTextIndex((i) => (i + 1) % textArray.length);
          setCurrentCharIndex(0);
          timeout = setTimeout(() => {}, pauseDuration);
        } else {
          timeout = setTimeout(() => {
            setDisplayedText((prev) => prev.slice(0, -1));
          }, deletingSpeed);
        }
      } else {
        if (currentCharIndex < processed.length) {
          timeout = setTimeout(
            () => {
              setDisplayedText((prev) => prev + processed[currentCharIndex]);
              setCurrentCharIndex((i) => i + 1);
            },
            variableSpeed ? getRandomSpeed() : typingSpeed
          );
        } else {
          if (textArray.length > 1 && (loop || currentTextIndex < textArray.length - 1)) {
            timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
          }
        }
      }
    };

    if (currentCharIndex === 0 && !isDeleting && displayedText === '') {
      timeout = setTimeout(run, initialDelay);
    } else {
      run();
    }

    return () => timeout && clearTimeout(timeout);
  }, [
    isVisible,
    textArray,
    currentTextIndex,
    loop,
    currentCharIndex,
    displayedText,
    isDeleting,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    initialDelay,
    reverseMode,
    variableSpeed,
    getRandomSpeed,
  ]);

  const shouldHideCursor =
    hideCursorWhileTyping &&
    (currentCharIndex < (textArray[currentTextIndex] ?? '').length || isDeleting);

  const Component = Tag as any;

  return (
    <Component
      ref={containerRef}
      className={cn('inline-flex items-center flex-wrap whitespace-pre-wrap', className)}
      style={style}
      {...rest}
    >
      <span
        className="text-type__content"
        style={{ color: getCurrentTextColor() }}
      >
        {displayedText}
      </span>

      {showCursor && !shouldHideCursor && (
        <motion.span
          className={cn('text-type__cursor ml-1 inline-block select-none font-mono font-bold text-accent', cursorClassName)}
          style={{ color: resolvedCursorColor }}
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: cursorBlinkDuration,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          aria-hidden="true"
        >
          {cursorChar}
        </motion.span>
      )}
    </Component>
  );
}

export default ProTextType;
