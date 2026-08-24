import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-dark-bg text-customText-primary flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-dark-card border border-white/10 flex items-center justify-center mb-6">
        <WifiOff className="w-8 h-8 text-accent" />
      </div>
      <span className="text-accent font-mono text-sm uppercase tracking-wider mb-2">PWA OFFLINE MODE</span>
      <h1 className="font-display font-extrabold text-4xl text-white tracking-tight mb-4">
        You are currently offline
      </h1>
      <p className="text-customText-secondary text-sm max-w-md mb-8 font-mono">
        Please check your network connection. Cached pages from Dharmik Tarasaka's portfolio remain accessible.
      </p>
    </div>
  );
}
