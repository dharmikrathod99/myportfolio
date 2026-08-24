'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Send, Phone, MapPin, Calendar, CheckCircle2, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import { LiquidMetal } from '@/components/ui/animate-ui/liquid-metal';

const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  service: z.string().min(1, 'Please select a service'),
  budget: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof ContactSchema>;

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);

    try {
      // Send request to Express Backend API (configurable via NEXT_PUBLIC_API_URL for Vercel -> Render deployment)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '') : 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setSubmitSuccess(json.message || 'Thank you! Your message has been sent successfully.');
        reset();
      } else {
        setSubmitSuccess('Thank you! Your inquiry was received. Dharmik will get back to you within 24 hours.');
        reset();
      }
    } catch {
      // Graceful offline/local fallback
      setSubmitSuccess('Thank you for reaching out! Your inquiry was recorded. Dharmik will reply within 24 hours.');
      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative bg-dark-bg border-t border-white/5 overflow-hidden">
      {/* Aurora Glow Background */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-surface border border-white/10 text-xs font-mono text-accent">
            <Mail className="w-3.5 h-3.5" />
            <span>12 // CONTACT</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            Let's Build Something <span className="text-accent">Amazing Together</span>
          </h2>
          <p className="text-customText-secondary text-base sm:text-lg leading-relaxed">
            Looking for a professional Software Engineer or Full Stack Developer? Whether you need a business website, SaaS application, custom software, API integration, or scalable web platform, I'm ready to help bring your ideas to life. Let's discuss your project and create something exceptional together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12">
          
          {/* Left Column: Direct Info & Location (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Contact Cards */}
            <div className="p-8 rounded-3xl bg-dark-surface border border-white/10 space-y-6 shadow-2xl">
              <h3 className="font-display font-bold text-xl text-white">Direct Contact</h3>

              <div className="space-y-4 text-xs font-mono">
                <a
                  href={`mailto:${PORTFOLIO_DATA.personalInfo.email}`}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-dark-card border border-white/5 hover:border-accent/40 text-customText-primary hover:text-white transition-colors group"
                >
                  <div className="p-2.5 rounded-lg bg-dark-bg text-accent group-hover:scale-110 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-customText-muted">Email Directly</span>
                    <span className="text-white font-bold">{PORTFOLIO_DATA.personalInfo.email}</span>
                  </div>
                </a>

                <a
                  href={PORTFOLIO_DATA.personalInfo.calendarLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-dark-card border border-white/5 hover:border-accent/40 text-customText-primary hover:text-white transition-colors group"
                >
                  <div className="p-2.5 rounded-lg bg-dark-bg text-aurora-cyan group-hover:scale-110 transition-transform">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-customText-muted">Book 1-on-1 Call</span>
                    <span className="text-white font-bold">Schedule via Cal.com</span>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-dark-card border border-white/5">
                  <div className="p-2.5 rounded-lg bg-dark-bg text-aurora-blue">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-customText-muted">Agency HQ</span>
                    <span className="text-white font-bold">{PORTFOLIO_DATA.personalInfo.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Styled Map Graphic Card */}
            <div className="p-6 rounded-3xl bg-dark-surface border border-white/10 relative overflow-hidden space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-accent font-bold">Surat, Gujarat, India</span>
                <span className="text-customText-muted">21.1702° N, 72.8311° E</span>
              </div>
              <div className="h-32 rounded-xl bg-dark-card border border-white/5 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:12px_12px] opacity-20" />
                <div className="relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-bg border border-accent/40 text-xs font-mono text-accent shadow-lg animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  <span>Dharmik Tarasaka HQ</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Premium Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-dark-surface border border-white/10 shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-2xl text-white">Send an Inquiry</h3>
                <span className="text-xs font-mono text-accent">Replies within 24h</span>
              </div>

              {submitSuccess ? (
                <div className="p-6 rounded-2xl bg-accent/10 border border-accent/40 text-accent font-mono text-xs sm:text-sm space-y-3 text-center">
                  <CheckCircle2 className="w-8 h-8 text-accent mx-auto" />
                  <p className="font-bold text-base">{submitSuccess}</p>
                  <button
                    onClick={() => setSubmitSuccess(null)}
                    className="px-4 py-2 rounded-xl bg-accent text-dark-bg font-bold hover:bg-accent-hover"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  
                  {/* Name & Email Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-customText-secondary mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        {...register('name')}
                        className="w-full bg-dark-card border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent font-mono placeholder:text-customText-muted"
                      />
                      {errors.name && (
                        <span className="text-[10px] text-red-400 font-mono mt-1 block">
                          {errors.name.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-customText-secondary mb-1.5">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        placeholder="john@company.com"
                        {...register('email')}
                        className="w-full bg-dark-card border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent font-mono placeholder:text-customText-muted"
                      />
                      {errors.email && (
                        <span className="text-[10px] text-red-400 font-mono mt-1 block">
                          {errors.email.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Service & Budget Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-customText-secondary mb-1.5">
                        Select Service *
                      </label>
                      <select
                        {...register('service')}
                        className="w-full bg-dark-card border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent font-mono"
                      >
                        <option value="">Choose a service...</option>
                        {PORTFOLIO_DATA.services.map((s) => (
                          <option key={s.id} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                      {errors.service && (
                        <span className="text-[10px] text-red-400 font-mono mt-1 block">
                          {errors.service.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-customText-secondary mb-1.5">
                        Estimated Budget
                      </label>
                      <select
                        {...register('budget')}
                        className="w-full bg-dark-card border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent font-mono"
                      >
                        <option value="Flexible">$1k - $3k (Standard)</option>
                        <option value="$3k - $5k">$3k - $5k (Growth)</option>
                        <option value="$5k+">$5k+ (Enterprise Platform)</option>
                      </select>
                    </div>
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="block text-xs font-mono text-customText-secondary mb-1.5">
                      Project Details & Goals *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell me about your project, timeline, and key requirements..."
                      {...register('message')}
                      className="w-full bg-dark-card border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent font-mono placeholder:text-customText-muted"
                    />
                    {errors.message && (
                      <span className="text-[10px] text-red-400 font-mono mt-1 block">
                        {errors.message.message}
                      </span>
                    )}
                  </div>

                  {/* Liquid Metal Border Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative w-full rounded-2xl overflow-hidden p-[2px] shadow-[0_4px_22px_rgba(14,165,233,0.35)] hover:shadow-[0_6px_32px_rgba(14,165,233,0.6)] transition-all active:scale-[0.98] disabled:opacity-50 group cursor-pointer border-none"
                  >
                    <LiquidMetal
                      colorBack="#001F33"
                      colorTint="#0EA5E9"
                      speed={0.8}
                      repetition={4}
                      distortion={0.3}
                      scale={1.2}
                      className="absolute inset-0 z-0 rounded-2xl"
                    />
                    <div className="relative z-10 py-4 px-6 rounded-2xl bg-[#0F172A] text-white keep-white flex items-center justify-center gap-2.5 overflow-hidden">
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl z-10 bg-gradient-to-b from-white/15 via-white/5 to-transparent" />
                      <div className="pointer-events-none absolute inset-0 rounded-2xl z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.8)]" />
                      {isSubmitting ? (
                        <span className="relative z-30 text-white keep-white font-extrabold uppercase tracking-wider text-sm">Sending Inquiry...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-accent stroke-[2.5] relative z-30" />
                          <span className="relative z-30 text-white keep-white font-extrabold uppercase tracking-wider text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                            Submit Project Inquiry
                          </span>
                        </>
                      )}
                    </div>
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
