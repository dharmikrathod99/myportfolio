'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { DaykanVoiceManager, VoiceState } from './DaykanVoiceManager';

export interface DaykanVoiceWidgetProps {
  className?: string;
}

export function DaykanVoiceWidget({ className = '' }: DaykanVoiceWidgetProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [amplitude, setAmplitude] = useState<number>(0);
  const [subtitle, setSubtitle] = useState<string>('');
  const manager = DaykanVoiceManager.getInstance();

  useEffect(() => {
    const unsubState = manager.subscribeState(setVoiceState);
    const unsubAmp = manager.subscribeAmplitude(setAmplitude);
    const unsubSub = manager.subscribeSubtitle(setSubtitle);

    return () => {
      unsubState();
      unsubAmp();
      unsubSub();
    };
  }, [manager]);

  // Support direct query testing via URL parameter (?query=What+is+React)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get('query') || params.get('daykan_query');
    if (queryParam) {
      const url = new URL(window.location.href);
      url.searchParams.delete('query');
      url.searchParams.delete('daykan_query');
      window.history.replaceState({}, '', url.toString());

      const timer = setTimeout(() => {
        manager.processUserQuery(queryParam);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [manager]);

  const handleMicClick = () => {
    if (voiceState === 'LISTENING') {
      manager.stopListening();
    } else if (voiceState === 'SPEAKING' || voiceState === 'THINKING' || voiceState === 'PREPARING_SPEECH') {
      manager.cancelSpeech();
    } else {
      manager.startListening();
    }
  };

  const handleManualHelloClick = () => {
    manager.speakDaykanIntroduction();
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
      className={`fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 w-full max-w-[94vw] sm:max-w-md pointer-events-auto select-none ${className}`}
    >
      {/* 1. Live Spoken Caption Subtitle Balloon */}
      <AnimatePresence>
        {subtitle && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`w-full px-4 py-3 rounded-2xl bg-[#070D1F]/95 border backdrop-blur-xl flex items-start gap-3 text-left shadow-2xl transition-colors duration-300 ${
              voiceState === 'THINKING' || voiceState === 'PREPARING_SPEECH'
                ? 'border-[#818CF8]/50 shadow-[0_0_35px_rgba(129,140,248,0.25)]'
                : 'border-[#00F0FF]/40 shadow-[0_0_35px_rgba(0,240,255,0.2)]'
            }`}
          >
            <div className="relative mt-0.5 flex-shrink-0">
              <span
                className={`w-2.5 h-2.5 rounded-full inline-block ${
                  voiceState === 'THINKING' || voiceState === 'PREPARING_SPEECH'
                    ? 'bg-[#A78BFA] animate-ping'
                    : 'bg-[#00F0FF] animate-ping'
                }`}
              />
              <span
                className={`absolute inset-0 w-2.5 h-2.5 rounded-full ${
                  voiceState === 'THINKING' || voiceState === 'PREPARING_SPEECH'
                    ? 'bg-[#A78BFA]'
                    : 'bg-[#00F0FF]'
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[10px] font-mono font-bold tracking-widest uppercase ${
                    voiceState === 'THINKING' || voiceState === 'PREPARING_SPEECH'
                      ? 'text-[#C4B5FD]'
                      : 'text-[#38BDF8]'
                  }`}
                >
                  {voiceState === 'THINKING' || voiceState === 'PREPARING_SPEECH'
                    ? 'DAYKAN // NEURAL PROCESSING'
                    : 'DAYKAN // NEURAL SPEECH'}
                </span>
                {voiceState === 'SPEAKING' ? (
                  <span className="text-[9px] font-mono text-[#34D399] animate-pulse font-semibold">
                    TRANSMITTING
                  </span>
                ) : voiceState === 'THINKING' ? (
                  <span className="text-[9px] font-mono text-[#A78BFA] animate-pulse font-semibold">
                    THINKING
                  </span>
                ) : voiceState === 'PREPARING_SPEECH' ? (
                  <span className="text-[9px] font-mono text-[#A78BFA] animate-pulse font-semibold">
                    PREPARING
                  </span>
                ) : null}
              </div>
              <p className="text-xs sm:text-sm text-slate-100 font-sans leading-relaxed tracking-wide">
                {subtitle}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Futuristic Microphone Control Capsule */}
      <div className="flex items-center gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-[#070D1F]/90 border border-[#00F0FF]/35 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,240,255,0.18)]">
        {/* Pulsing Tactical Microphone Button */}
        <div className="relative flex items-center justify-center">
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
                : 'Speak to Daykan'
            }
            className={`relative w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer ${
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
        <div className="flex flex-col pr-1 sm:pr-2">
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
            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-[#BAE6FD]">
              {voiceState === 'LISTENING'
                ? 'LISTENING... (SPEAK FREELY)'
                : voiceState === 'THINKING'
                ? 'DAYKAN THINKING...'
                : voiceState === 'PREPARING_SPEECH'
                ? 'PREPARING RESPONSE...'
                : voiceState === 'SPEAKING'
                ? 'DAYKAN SPEAKING...'
                : voiceState === 'ERROR'
                ? 'MIC RECONNECT REQUIRED'
                : 'AI VOICE CONVERSATION'}
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
              <span className="text-[9px] font-mono text-[#A78BFA] tracking-tight animate-pulse flex items-center gap-1">
                Generating neural response...
              </span>
            ) : voiceState === 'PREPARING_SPEECH' ? (
              <span className="text-[9px] font-mono text-[#A78BFA] tracking-tight animate-pulse flex items-center gap-1">
                Synthesizing neural voice...
              </span>
            ) : (
              <span className="text-[9px] font-mono text-[#64748B] tracking-tight">
                Click mic to talk or click Say "Hello"
              </span>
            )}
          </div>
        </div>

        {/* Quick Trigger "Hello" Pill for instant accessibility */}
        {voiceState === 'IDLE' && (
          <button
            type="button"
            onClick={handleManualHelloClick}
            title="Click to hear Daykan introduction"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00F0FF]/10 hover:bg-[#00F0FF]/25 border border-[#00F0FF]/30 text-[10px] font-mono font-semibold text-[#38BDF8] hover:text-[#00F0FF] transition-all cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.15)]"
          >
            <Sparkles className="w-3 h-3" />
            <span>Say "Hello"</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default DaykanVoiceWidget;
