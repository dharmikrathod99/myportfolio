'use client';

import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  color?: string;
  secondaryOpacity?: number;
}

/**
 * Exact Framer Home Duotone Curved Badge Vector
 * Extracted from Framer Module UbxrSki7i / Home-CSxJou
 */
export function FramerHomeIcon({
  size = 24,
  className = '',
  color = 'currentColor',
  secondaryOpacity = 0.2,
  ...props
}: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <g transform="translate(6 6)">
        {/* Soft Duotone Background Fill */}
        <path
          d="M 0 38.203 C 0 31.389 3.232 24.939 8.8 20.624 L 28.8 5.135 C 37.642 -1.712 50.358 -1.712 59.2 5.135 L 79.2 20.624 C 84.768 24.939 88 31.389 88 38.203 L 88 65.289 C 88 77.832 77.255 88 64 88 L 24 88 C 10.745 88 0 77.832 0 65.289 Z"
          fill={color}
          opacity={secondaryOpacity}
        />
        {/* Outer Curved Silhouette */}
        <path
          d="M 0 38.203 C 0 31.389 3.232 24.939 8.8 20.624 L 28.8 5.135 C 37.642 -1.712 50.358 -1.712 59.2 5.135 L 79.2 20.624 C 84.768 24.939 88 31.389 88 38.203 L 88 65.289 C 88 77.832 77.255 88 64 88 L 24 88 C 10.745 88 0 77.832 0 65.289 Z"
          stroke={color}
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Central Entrance Line Notch */}
        <path
          d="M 44 80.667 L 44 56.777"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/**
 * Premium Duotone Code / Engineering Icon
 */
export function FramerCodeIcon({
  size = 24,
  className = '',
  color = 'currentColor',
  secondaryOpacity = 0.2,
  ...props
}: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <g transform="translate(6 6)">
        {/* Duotone Background Shield */}
        <rect
          x="4"
          y="4"
          width="80"
          height="80"
          rx="22"
          fill={color}
          opacity={secondaryOpacity}
        />
        <rect
          x="4"
          y="4"
          width="80"
          height="80"
          rx="22"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Code Brackets & Slash */}
        <path
          d="M 32 36 L 20 44 L 32 52"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 56 36 L 68 44 L 56 52"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 47 30 L 41 58"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/**
 * Premium Duotone Zap / Transform / Speed Icon
 */
export function FramerZapIcon({
  size = 24,
  className = '',
  color = 'currentColor',
  secondaryOpacity = 0.2,
  ...props
}: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <g transform="translate(6 6)">
        {/* Soft Background Lightning */}
        <path
          d="M 52 4 L 14 50 L 44 50 L 36 84 L 74 38 L 44 38 Z"
          fill={color}
          opacity={secondaryOpacity}
        />
        <path
          d="M 52 4 L 14 50 L 44 50 L 36 84 L 74 38 L 44 38 Z"
          stroke={color}
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/**
 * Premium Duotone Track Record / Award Icon
 */
export function FramerAwardIcon({
  size = 24,
  className = '',
  color = 'currentColor',
  secondaryOpacity = 0.2,
  ...props
}: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <g transform="translate(6 6)">
        {/* Central Badge Fill */}
        <circle
          cx="44"
          cy="36"
          r="28"
          fill={color}
          opacity={secondaryOpacity}
        />
        <circle
          cx="44"
          cy="36"
          r="28"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Ribbons */}
        <path
          d="M 30 58 L 22 84 L 44 72 L 66 84 L 58 58"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Central Star dot */}
        <circle cx="44" cy="36" r="6" fill={color} />
      </g>
    </svg>
  );
}

/**
 * Premium Duotone Stack / Layers Icon
 */
export function FramerStackIcon({
  size = 24,
  className = '',
  color = 'currentColor',
  secondaryOpacity = 0.2,
  ...props
}: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <g transform="translate(6 6)">
        {/* Top layer fill */}
        <path
          d="M 44 8 L 82 26 L 44 44 L 6 26 Z"
          fill={color}
          opacity={secondaryOpacity}
        />
        <path
          d="M 44 8 L 82 26 L 44 44 L 6 26 Z"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 6 48 L 44 66 L 82 48"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 6 70 L 44 88 L 82 70"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/**
 * Premium Duotone Sparkles / AI Magic Icon
 */
export function FramerSparklesIcon({
  size = 24,
  className = '',
  color = 'currentColor',
  secondaryOpacity = 0.2,
  ...props
}: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <g transform="translate(6 6)">
        {/* Big Star Fill */}
        <path
          d="M 44 4 C 44 26 22 48 0 48 C 22 48 44 70 44 92 C 44 70 66 48 88 48 C 66 48 44 26 44 4 Z"
          fill={color}
          opacity={secondaryOpacity}
        />
        <path
          d="M 44 4 C 44 26 22 48 0 48 C 22 48 44 70 44 92 C 44 70 66 48 88 48 C 66 48 44 26 44 4 Z"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Mini Accent Star */}
        <circle cx="74" cy="18" r="6" fill={color} />
      </g>
    </svg>
  );
}

/**
 * Premium Duotone Terminal Icon
 */
export function FramerTerminalIcon({
  size = 24,
  className = '',
  color = 'currentColor',
  secondaryOpacity = 0.2,
  ...props
}: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <g transform="translate(6 6)">
        <rect
          x="4"
          y="10"
          width="80"
          height="68"
          rx="18"
          fill={color}
          opacity={secondaryOpacity}
        />
        <rect
          x="4"
          y="10"
          width="80"
          height="68"
          rx="18"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Prompt chevron */}
        <path
          d="M 22 34 L 38 44 L 22 54"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Cursor underscore */}
        <path
          d="M 48 54 L 66 54"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/**
 * Premium Duotone Document / Resume Icon
 */
export function FramerFileIcon({
  size = 24,
  className = '',
  color = 'currentColor',
  secondaryOpacity = 0.2,
  ...props
}: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <g transform="translate(6 6)">
        <path
          d="M 16 6 L 54 6 L 76 28 L 76 82 C 76 87 72 90 66 90 L 16 90 C 10 90 6 87 6 82 L 6 14 C 6 9 10 6 16 6 Z"
          fill={color}
          opacity={secondaryOpacity}
        />
        <path
          d="M 16 6 L 54 6 L 76 28 L 76 82 C 76 87 72 90 66 90 L 16 90 C 10 90 6 87 6 82 L 6 14 C 6 9 10 6 16 6 Z"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 52 6 L 52 28 L 74 28"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 22 48 L 58 48"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M 22 66 L 46 66"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
