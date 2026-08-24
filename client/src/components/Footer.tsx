'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp, Terminal, Github, Linkedin, Twitter, Mail, MapPin, Clock, Send, ShieldCheck } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';

export default function Footer() {
  const [localTime, setLocalTime] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setLocalTime(new Intl.DateTimeFormat('en-US', options).format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="relative bg-dark-bg border-t border-white/10 pt-16 pb-12 overflow-hidden">
      {/* Glow Backdrop */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-accent/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary border border-white/10 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-accent" />
              </div>
              <span className="font-display font-bold text-xl text-white flex items-center gap-0.5">
                <span className="text-accent">DR.</span>Developer
              </span>
            </div>
            <p className="text-xs font-mono text-accent -mt-2">
              Dharmik Rathod Developer • Full Stack MERN & AI
            </p>
            <p className="text-customText-secondary text-sm leading-relaxed max-w-sm">
              Building scalable, high-performance web applications with modern technologies for startups, businesses, and clients worldwide.
            </p>

            {/* Local Time Widget & Location */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-customText-secondary pt-2">
              <div className="flex items-center gap-1.5 bg-dark-card border border-white/5 px-3 py-1.5 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                <span>Surat, India</span>
              </div>
              <div className="flex items-center gap-1.5 bg-dark-card border border-white/5 px-3 py-1.5 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-aurora-cyan" />
                <span>IST: {localTime || '10:00 PM'}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase">Navigation</h4>
            <ul className="space-y-2 text-xs font-medium text-customText-secondary">
              <li><a href="#about" className="hover:text-accent transition-colors">About Journey</a></li>
              <li><a href="#skills" className="hover:text-accent transition-colors">Tech Capabilities</a></li>
              <li><a href="#services" className="hover:text-accent transition-colors">Services Directory</a></li>
              <li><a href="#projects" className="hover:text-accent transition-colors">Featured Projects</a></li>
              <li><a href="#blog" className="hover:text-accent transition-colors">Technical Articles</a></li>
              <li><a href="#faq" className="hover:text-accent transition-colors">FAQ & Solutions</a></li>
            </ul>
          </div>

          {/* Col 4: Services */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase">Expertise</h4>
            <ul className="space-y-2 text-xs font-medium text-customText-secondary">
              <li>Next.js Web Apps</li>
              <li>Full Stack Architecture</li>
              <li>REST API & Cloud Infra</li>
              <li>Technical SEO & AEO</li>
              <li>OpenAI & Gemini Integrations</li>
              <li>Core Web Vitals Tuning</li>
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase">Tech Newsletter</h4>
            <p className="text-xs text-customText-secondary">
              Subscribe for insights on AEO, Next.js optimization, and full-stack architecture.
            </p>
            {subscribed ? (
              <div className="p-3 bg-accent/10 border border-accent/30 rounded-xl text-accent text-xs font-mono flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Subscribed successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="enter your email..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-dark-card border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent font-mono placeholder:text-customText-muted"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-accent text-dark-bg rounded-lg text-xs font-bold hover:bg-accent-hover transition-colors flex items-center justify-center"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-customText-secondary">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>© {new Date().getFullYear()} Dharmik Tarasaka. Tarasaka Digital Solutions.</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a href={PORTFOLIO_DATA.personalInfo.github} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-dark-card border border-white/5 hover:text-accent hover:border-accent/40 transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href={PORTFOLIO_DATA.personalInfo.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-dark-card border border-white/5 hover:text-accent hover:border-accent/40 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href={PORTFOLIO_DATA.personalInfo.twitter} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-dark-card border border-white/5 hover:text-accent hover:border-accent/40 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href={`mailto:${PORTFOLIO_DATA.personalInfo.email}`} className="p-2 rounded-lg bg-dark-card border border-white/5 hover:text-accent hover:border-accent/40 transition-colors">
              <Mail className="w-4 h-4" />
            </a>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-card border border-white/10 hover:border-accent/40 text-customText-secondary hover:text-accent transition-all"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
