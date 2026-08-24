import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A0A0A', // Luxury Deep Black
          light: '#1F2937',
          dark: '#000000',
        },
        secondary: {
          DEFAULT: '#FFFFFF', // Crisp Pure White
          hover: '#F9FAFB',
          dark: '#F3F4F6',
        },
        accent: {
          DEFAULT: '#3A86FF',       // User Brand Sky Blue (#3A86FF)
          hover: '#2563EB',         // Deep Electric Blue Hover
          light: '#EBF3FF',         // Soft Sky Blue Tint
          dark: '#1D4ED8',          // Deep Sky Blue Dark
          glow: 'rgba(58, 134, 255, 0.45)',
          muted: 'rgba(58, 134, 255, 0.12)',
        },
        dark: {
          bg: '#05050A',
          surface: '#0B0F19',
          card: '#111827',
          border: '#1F2937',
          muted: '#6B7280',
        },
        customText: {
          primary: '#0A0A0A',       // Luxury Crisp Black
          secondary: '#374151',     // Slate Medium Dark Text
          muted: '#6B7280',         // Refined Muted Text
        },
        aurora: {
          cyan: '#60A5FA',
          blue: '#3A86FF',
          purple: '#6366F1',
          sky: '#3A86FF',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
        display: ['var(--font-display)', 'Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'aurora': 'aurora 15s ease infinite',
        'pulse-glow': 'pulseGlow 3s infinite ease-in-out',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.03)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'border-beam': {
          '100%': {
            offsetDistance: '100%',
          },
        },
        marquee: {
          from: { transform: 'translateX(0%)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'aurora-glow': 'radial-gradient(ellipse at top left, rgba(58, 134, 255, 0.2) 0%, rgba(58, 134, 255, 0.05) 45%, transparent 70%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.4) 100%)',
      },
      boxShadow: {
        'accent-glow': '0 0 25px rgba(58, 134, 255, 0.45)',
        'primary-glow': '0 0 30px rgba(58, 134, 255, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
        'premium-card': '0 10px 30px -10px rgba(0, 0, 0, 0.05), 0 20px 25px -5px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
};

export default config;
