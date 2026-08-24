'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'dark' | 'light';
type SiteMode = '2d' | '3d';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  siteMode: SiteMode;
  isTransitioning: boolean;
  transformSite: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [siteMode, setSiteMode] = useState<SiteMode>('2d');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
    } else {
      document.documentElement.classList.add('dark');
    }

    const savedMode = localStorage.getItem('portfolio-site-mode') as SiteMode | null;
    if (savedMode === '3d') {
      setSiteMode('3d');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('portfolio-theme', nextTheme);

    if (nextTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  };

  const transformSite = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // After transition animation completes (~2.8s), swap the mode
    setTimeout(() => {
      const nextMode: SiteMode = siteMode === '2d' ? '3d' : '2d';
      setSiteMode(nextMode);
      localStorage.setItem('portfolio-site-mode', nextMode);

      // Force dark mode in 3D
      if (nextMode === '3d' && theme === 'light') {
        setTheme('dark');
        localStorage.setItem('portfolio-theme', 'dark');
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }

      // Small delay to let the new shell mount, then fade out transition
      setTimeout(() => {
        setIsTransitioning(false);
      }, 400);
    }, 2400);
  }, [isTransitioning, siteMode, theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, siteMode, isTransitioning, transformSite }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
