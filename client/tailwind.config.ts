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
          DEFAULT: '#0A0A0A',
          light: '#171717',
          dark: '#030303',
        },
        secondary: {
          DEFAULT: '#FFFFFF',
          hover: '#F3F4F6',
          dark: '#E5E7EB',
        },
        accent: {
          DEFAULT: '#00FB1B',
          hover: '#26FF3E',
          glow: 'rgba(0, 251, 27, 0.4)',
        },
        dark: {
          bg: '#050505',
          surface: '#0D0D0D',
          card: '#141414',
          border: '#262626',
        },
        customText: {
          primary: '#FFFFFF',
          secondary: '#A3A3A3',
          muted: '#737373',
        },
        aurora: {
          cyan: '#00F0FF',
          blue: '#3B82F6',
          purple: '#8B5CF6',
          green: '#00FB1B',
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
        'aurora-glow': 'radial-gradient(ellipse at top left, rgba(0, 251, 27, 0.2) 0%, rgba(0, 251, 27, 0.05) 45%, transparent 70%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      boxShadow: {
        'accent-glow': '0 0 25px rgba(0, 251, 27, 0.35)',
        'primary-glow': '0 0 30px rgba(0, 251, 27, 0.15)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
};

export default config;
