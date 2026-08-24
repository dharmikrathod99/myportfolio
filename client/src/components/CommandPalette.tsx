'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Code, User, Briefcase, Mail, FileText, ExternalLink, Sparkles, Terminal } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';

interface CommandItem {
  id: string;
  label: string;
  category: 'Navigation' | 'Actions' | 'Social';
  icon: React.ReactNode;
  action: () => void;
}

export default function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const scrollToSection = (id: string) => {
    onClose();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const commands: CommandItem[] = [
    {
      id: 'nav-hero',
      label: 'Jump to Overview (Hero)',
      category: 'Navigation',
      icon: <Terminal className="w-4 h-4 text-accent" />,
      action: () => scrollToSection('hero'),
    },
    {
      id: 'nav-about',
      label: 'About & Journey',
      category: 'Navigation',
      icon: <User className="w-4 h-4 text-accent" />,
      action: () => scrollToSection('about'),
    },
    {
      id: 'nav-skills',
      label: 'Technical Skills & Stack',
      category: 'Navigation',
      icon: <Code className="w-4 h-4 text-accent" />,
      action: () => scrollToSection('skills'),
    },
    {
      id: 'nav-services',
      label: 'Services & Solutions',
      category: 'Navigation',
      icon: <Sparkles className="w-4 h-4 text-accent" />,
      action: () => scrollToSection('services'),
    },
    {
      id: 'nav-projects',
      label: 'Featured Projects',
      category: 'Navigation',
      icon: <Briefcase className="w-4 h-4 text-accent" />,
      action: () => scrollToSection('projects'),
    },
    {
      id: 'nav-contact',
      label: 'Contact Dharmik',
      category: 'Navigation',
      icon: <Mail className="w-4 h-4 text-accent" />,
      action: () => scrollToSection('contact'),
    },
    {
      id: 'act-email',
      label: `Email: ${PORTFOLIO_DATA.personalInfo.email}`,
      category: 'Actions',
      icon: <Mail className="w-4 h-4 text-aurora-cyan" />,
      action: () => {
        window.location.href = `mailto:${PORTFOLIO_DATA.personalInfo.email}`;
        onClose();
      },
    },
    {
      id: 'act-resume',
      label: 'Download Complete Resume (PDF)',
      category: 'Actions',
      icon: <FileText className="w-4 h-4 text-aurora-blue" />,
      action: () => {
        scrollToSection('contact');
        onClose();
      },
    },
    {
      id: 'soc-github',
      label: 'Open GitHub Profile',
      category: 'Social',
      icon: <ExternalLink className="w-4 h-4 text-aurora-purple" />,
      action: () => {
        window.open(PORTFOLIO_DATA.personalInfo.github, '_blank');
        onClose();
      },
    },
    {
      id: 'soc-linkedin',
      label: 'Connect on LinkedIn',
      category: 'Social',
      icon: <ExternalLink className="w-4 h-4 text-aurora-blue" />,
      action: () => {
        window.open(PORTFOLIO_DATA.personalInfo.linkedin, '_blank');
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark-bg/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-xl bg-dark-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 dark-terminal"
          >
            {/* Input Header */}
            <div className="flex items-center px-4 border-b border-white/10 py-3">
              <Search className="w-5 h-5 text-white mr-3" />
              <input
                type="text"
                placeholder="Type a command or search section..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-white focus:outline-none text-base placeholder:text-customText-secondary font-mono"
              />
              <button
                onClick={onClose}
                className="p-1 text-customText-secondary hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all text-left text-sm group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-dark-card border border-white/5 group-hover:border-white/30 transition-colors">
                        {cmd.icon}
                      </div>
                      <span className="text-white font-medium group-hover:text-white transition-colors">
                        {cmd.label}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-customText-secondary bg-white/5 px-2 py-1 rounded">
                      {cmd.category}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-customText-secondary font-mono text-sm">
                  No commands found matching "{query}"
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-dark-card border-t border-white/5 flex items-center justify-between text-xs text-customText-secondary font-mono">
              <span>Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded">ESC</kbd> to exit</span>
              <span>Dharmik Tarasaka OS</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
