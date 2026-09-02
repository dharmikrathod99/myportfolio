'use client';

import React, { useState } from 'react';
import { Mic, MicOff, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DKInteractionBarProps {
  isOnline: boolean;
  interactionState: 'IDLE' | 'SPEAKING' | 'LISTENING' | 'THINKING';
  onStartListening: () => void;
  onStopListening: () => void;
  onSendMessage: (msg: string) => void;
}

export function DKInteractionBar({
  isOnline,
  interactionState,
  onStartListening,
  onStopListening,
  onSendMessage,
}: DKInteractionBarProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  if (!isOnline) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="w-full max-w-md sm:max-w-lg mx-auto"
    >
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-[#212636]/90 border border-[#353D50] backdrop-blur-xl shadow-2xl focus-within:border-[#56AEEB]/60 transition-all"
      >
        {/* Voice Microphone Button */}
        <button
          type="button"
          onClick={interactionState === 'LISTENING' ? onStopListening : onStartListening}
          aria-label={interactionState === 'LISTENING' ? 'Stop Listening' : 'Talk to DK'}
          className={`p-2.5 sm:p-3 rounded-xl flex items-center justify-center transition-all ${
            interactionState === 'LISTENING'
              ? 'bg-[#8AE4FA] text-[#0F1422] animate-pulse shadow-[0_0_15px_rgba(138,228,250,0.5)]'
              : 'bg-[#0F1422]/70 text-[#56AEEB] hover:bg-[#56AEEB]/20 hover:text-white'
          }`}
        >
          {interactionState === 'LISTENING' ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={
            interactionState === 'LISTENING'
              ? 'DK is listening to your voice...'
              : 'Talk to DK or type a message...'
          }
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-[#F5F7FA] placeholder-[#9DA7B8] focus:outline-none font-sans"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputValue.trim()}
          aria-label="Send message to DK"
          className="p-2.5 sm:p-3 rounded-xl bg-[#56AEEB] hover:bg-[#8AE4FA] disabled:opacity-40 disabled:hover:bg-[#56AEEB] text-[#0F1422] flex items-center justify-center transition-all font-bold shadow-md"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </motion.div>
  );
}

export default DKInteractionBar;
