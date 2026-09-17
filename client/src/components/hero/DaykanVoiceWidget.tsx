'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, AlertCircle, Loader2 } from 'lucide-react';
import { DaykanVoiceManager, VoiceState } from './DaykanVoiceManager';

export interface DaykanVoiceWidgetProps {
  className?: string;
}

export function DaykanVoiceWidget({ className = '' }: DaykanVoiceWidgetProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [amplitude, setAmplitude] = useState<number>(0);
  const [subtitle, setSubtitle] = useState<string>('');
  const [languageMode, setLanguageMode] = useState<'auto' | 'hi' | 'en'>('auto');
  const manager = DaykanVoiceManager.getInstance();

  useEffect(() => {
    // Pre-initialize Web Audio & AnalyserNode on widget mount for zero-latency response
    manager.initAudio();

    const unsubState = manager.subscribeState(setVoiceState);
    const unsubAmp = manager.subscribeAmplitude(setAmplitude);
    const unsubSub = manager.subscribeSubtitle(setSubtitle);
    const unsubLang = manager.subscribeLanguageMode(setLanguageMode);

    return () => {
      unsubState();
      unsubAmp();
      unsubSub();
      unsubLang();
    };
  }, [manager]);

  // Support direct query testing via URL parameter (?query=What+is+React)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get('query') || params.get('diykan_query') || params.get('daykan_query');
    if (queryParam) {
      const url = new URL(window.location.href);
      url.searchParams.delete('query');
      url.searchParams.delete('diykan_query');
      url.searchParams.delete('daykan_query');
      window.history.replaceState({}, '', url.toString());

      const timer = setTimeout(() => {
        manager.processUserQuery(queryParam);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [manager]);

  // Auto-hide terminal 8 seconds after speech & processing complete
  useEffect(() => {
    if (voiceState === 'IDLE' && subtitle) {
      const hideTimer = setTimeout(() => {
        setSubtitle('');
      }, 8000);
      return () => clearTimeout(hideTimer);
    }
  }, [voiceState, subtitle]);

  const handleMicClick = () => {
    if (voiceState === 'LISTENING') {
      manager.stopListening();
    } else if (voiceState === 'SPEAKING' || voiceState === 'THINKING' || voiceState === 'PREPARING_SPEECH') {
      manager.cancelSpeech();
    } else {
      manager.startListening();
    }
  };


  // Generate 5 dynamic audio waveform frequency bars
  const waveHeights = [
    Math.max(15, amplitude * 100 * 0.7 + Math.random() * 8),
    Math.max(25, amplitude * 100 * 1.1 + Math.random() * 12),
    Math.max(35, amplitude * 100 * 1.4 + Math.random() * 16),
    Math.max(25, amplitude * 100 * 1.0 + Math.random() * 12),
    Math.max(15, amplitude * 100 * 0.6 + Math.random() * 8),
  ];

  return (
    <div
      className={`fixed bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 w-auto max-w-[95vw] pointer-events-auto select-none ${className}`}
    >
      {/* 1. Live Spoken Caption Compact Coding Terminal Window */}
      <AnimatePresence>
        {subtitle && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`w-full max-w-[300px] sm:max-w-[360px] rounded-lg bg-[#070D18]/95 border backdrop-blur-2xl shadow-xl overflow-hidden transition-all duration-300 ${
              voiceState === 'THINKING' || voiceState === 'PREPARING_SPEECH'
                ? 'border-[#818CF8]/45 shadow-[0_0_20px_rgba(129,140,248,0.2)]'
                : 'border-[#00F0FF]/30 shadow-[0_0_20px_rgba(0,240,255,0.16)]'
            }`}
          >
            {/* Terminal Titlebar */}
            <div className="flex items-center justify-between px-2 py-1 bg-[#0A1226]/90 border-b border-white/10 select-none">
              {/* Traffic Light Window Controls */}
              <div className="flex items-center gap-1.2">
                <button
                  type="button"
                  onClick={() => setSubtitle('')}
                  title="Close terminal (Esc)"
                  aria-label="Close terminal"
                  className="w-1.5 h-1.5 rounded-full bg-[#EF4444]/90 hover:bg-[#EF4444] shadow-[0_0_4px_rgba(239,68,68,0.6)] cursor-pointer transition-transform active:scale-75"
                />
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]/90 shadow-[0_0_4px_rgba(245,158,11,0.6)]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]/90 shadow-[0_0_4px_rgba(16,185,129,0.6)]" />
                <span className="ml-1 text-[8px] font-mono text-slate-400 tracking-wide">
                  diykan@voice-ai:~
                </span>
              </div>

              {/* Terminal Status / Mode Badge */}
              <div className="flex items-center gap-1">
                <span
                  className={`w-1 h-1 rounded-full ${
                    voiceState === 'THINKING' || voiceState === 'PREPARING_SPEECH'
                      ? 'bg-[#A78BFA] animate-ping'
                      : voiceState === 'SPEAKING'
                      ? 'bg-[#34D399] animate-pulse'
                      : 'bg-[#00F0FF]'
                  }`}
                />
                <span
                  className={`text-[7.5px] font-mono font-semibold tracking-wider uppercase ${
                    voiceState === 'THINKING' || voiceState === 'PREPARING_SPEECH'
                      ? 'text-[#C4B5FD]'
                      : voiceState === 'SPEAKING'
                      ? 'text-[#34D399]'
                      : 'text-[#38BDF8]'
                  }`}
                >
                  {voiceState === 'THINKING'
                    ? 'THINKING'
                    : voiceState === 'PREPARING_SPEECH'
                    ? 'PREPARING'
                    : voiceState === 'SPEAKING'
                    ? 'TRANSMITTING'
                    : 'READY'}
                </span>
              </div>
            </div>

            {/* Terminal Console Output Body */}
            <div className="p-2 max-h-20 sm:max-h-24 overflow-y-auto custom-scrollbar text-left font-mono">
              <div className="flex items-start gap-1 text-[10px] sm:text-[10.5px] leading-tight">
                <span className="text-[#00F0FF] select-none font-bold shrink-0 text-[10px]">$</span>
                <p className="text-slate-200 tracking-tight break-words">
                  {subtitle}
                  <span className="inline-block w-1 h-2.5 ml-0.5 bg-[#00F0FF] animate-pulse align-middle" />
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Futuristic Microphone Control Capsule */}
      <div className="flex items-center gap-3 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full bg-[#070D1F]/90 border border-[#00F0FF]/35 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,240,255,0.18)]">
        {/* Pulsing Tactical Microphone Button */}
        <div className="relative flex items-center justify-center shrink-0">
          {voiceState === 'LISTENING' && (
            <>
              <span className="absolute -inset-1.5 rounded-full bg-[#00F0FF]/30 animate-ping" />
              <span className="absolute -inset-3 rounded-full bg-[#00F0FF]/15 animate-pulse" />
            </>
          )}
          {(voiceState === 'THINKING' || voiceState === 'PREPARING_SPEECH') && (
            <>
              <span className="absolute -inset-1.5 rounded-full bg-[#818CF8]/30 animate-ping" />
              <span className="absolute -inset-3 rounded-full bg-[#818CF8]/15 animate-pulse" />
            </>
          )}

          <button
            type="button"
            onClick={handleMicClick}
            aria-label={
              voiceState === 'LISTENING'
                ? 'Stop Listening'
                : voiceState === 'THINKING' || voiceState === 'PREPARING_SPEECH' || voiceState === 'SPEAKING'
                ? 'Cancel Speech'
                : 'Speak to Diykan'
            }
            className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer ${
              voiceState === 'LISTENING'
                ? 'bg-[#00F0FF] text-[#070D1F] shadow-[0_0_25px_#00F0FF] scale-105'
                : voiceState === 'THINKING' || voiceState === 'PREPARING_SPEECH'
                ? 'bg-[#818CF8] text-[#070D1F] shadow-[0_0_25px_#818CF8] scale-105'
                : voiceState === 'SPEAKING'
                ? 'bg-[#38BDF8] text-[#070D1F] shadow-[0_0_20px_#38BDF8]'
                : voiceState === 'ERROR'
                ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)]'
                : 'bg-[#0B1528] text-[#38BDF8] hover:bg-[#00F0FF]/20 hover:text-[#00F0FF] border border-[#00F0FF]/40 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]'
            }`}
          >
            {voiceState === 'LISTENING' ? (
              <MicOff className="w-5 h-5 animate-pulse" />
            ) : voiceState === 'THINKING' || voiceState === 'PREPARING_SPEECH' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : voiceState === 'SPEAKING' ? (
              <Volume2 className="w-5 h-5 animate-bounce" />
            ) : voiceState === 'ERROR' ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Telemetry Status & Live Frequency Waveform */}
        <div className="flex flex-col pr-2 shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                voiceState === 'LISTENING'
                  ? 'bg-[#00F0FF] animate-ping'
                  : voiceState === 'THINKING' || voiceState === 'PREPARING_SPEECH'
                  ? 'bg-[#A78BFA] animate-pulse'
                  : voiceState === 'SPEAKING'
                  ? 'bg-[#34D399] animate-pulse'
                  : voiceState === 'ERROR'
                  ? 'bg-rose-400'
                  : 'bg-[#38BDF8]'
              }`}
            />
            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-[#BAE6FD] whitespace-nowrap">
              {voiceState === 'LISTENING'
                ? 'LISTENING... (SPEAK FREELY)'
                : voiceState === 'THINKING'
                ? 'DIYKAN THINKING...'
                : voiceState === 'PREPARING_SPEECH'
                ? 'PREPARING RESPONSE...'
                : voiceState === 'SPEAKING'
                ? 'DIYKAN SPEAKING...'
                : voiceState === 'ERROR'
                ? 'MIC RECONNECT REQUIRED'
                : 'DIYKAN - YOUR VOICE ASSISTANT'}
            </span>
          </div>

          {/* Real-time Frequency / Cadence Bouncing Bars */}
          <div className="flex items-center gap-1 h-3 mt-1">
            {voiceState === 'LISTENING' || voiceState === 'SPEAKING' ? (
              waveHeights.map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-[#00F0FF] rounded-full transition-all duration-75 ease-out shadow-[0_0_6px_#00F0FF]"
                  style={{ height: `${Math.min(16, h * 0.16)}px` }}
                />
              ))
            ) : voiceState === 'THINKING' ? (
              <span className="text-[9px] font-mono text-[#A78BFA] tracking-tight animate-pulse flex items-center gap-1 whitespace-nowrap">
                Generating neural response...
              </span>
            ) : voiceState === 'PREPARING_SPEECH' ? (
              <span className="text-[9px] font-mono text-[#A78BFA] tracking-tight animate-pulse flex items-center gap-1 whitespace-nowrap">
                Synthesizing neural voice...
              </span>
            ) : (
              <span className="text-[9px] font-mono text-[#64748B] tracking-tight whitespace-nowrap">
                Click mic to talk
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DaykanVoiceWidget;
