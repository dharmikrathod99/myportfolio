'use client';

import React, { useState } from 'react';

export interface CyberX81ModelProps {
  className?: string;
  showStatusLabel?: boolean;
}

export function CyberX81Model({
  className = '',
  showStatusLabel = false,
}: CyberX81ModelProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Forward wheel events to window scroll so mouse scroll never gets trapped
  const handleWheel = (e: React.WheelEvent) => {
    window.scrollBy({
      top: e.deltaY,
      behavior: 'auto',
    });
  };

  return (
    <div
      onWheel={handleWheel}
      className={`relative w-full h-[100dvh] min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#0F1422] select-none touch-pan-y ${className}`}
      style={{ backgroundColor: '#0F1422' }}
    >
      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0F1422] z-40">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#56AEEB]/30 border-t-[#56AEEB] animate-spin" />
          <p className="text-[11px] sm:text-xs font-mono text-[#8AE4FA] uppercase tracking-widest animate-pulse">
            LOADING 3D CYBER HERO...
          </p>
        </div>
      )}

      {/* Full-Screen Ultra-Responsive 3D Viewport in matching #0F1422 */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0F1422] flex items-center justify-center pointer-events-auto">
        {/* Precision Top Mask (covers only title bar, adapts across mobile/tablet/desktop) */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-4 sm:h-5 md:h-6 bg-[#0F1422] z-30 pointer-events-none"
        />

        {/* Precision Bottom Mask (covers bottom controls & watermark across all devices) */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-8 sm:h-10 md:h-12 bg-[#0F1422] z-30 pointer-events-none"
        />

        {/* 3D Model Iframe - Positioned slightly higher using CSS positioning */}
        <div className="w-[120vw] sm:w-[112vw] md:w-[108vw] lg:w-[104vw] h-[115dvh] sm:h-[110dvh] md:h-[108dvh] -mt-[4vh] sm:-mt-[5.5vh] md:-mt-[6.5vh] flex items-center justify-center overflow-hidden bg-[#0F1422]">
          <iframe
            title="Character CYBER X81 BY Oscar Creativo"
            src="https://sketchfab.com/models/346a50ae2903428f85ac31fb2ba8fd48/embed?autostart=1&scrollwheel=0&ui_hint=0&ui_controls=0&ui_infos=0&ui_watermark=0&ui_stop=0&ui_inspector=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0"
            className="w-full h-full border-0 block transform scale-[1.08] xs:scale-[1.12] sm:scale-[1.18] md:scale-[1.22] lg:scale-[1.26] 2xl:scale-[1.30] bg-[#0F1422]"
            style={{ backgroundColor: '#0F1422' }}
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
            onLoad={() => setIsLoaded(true)}
          />
        </div>
      </div>

      {/* Optional Status HUD */}
      {showStatusLabel && (
        <div className="absolute right-4 sm:right-8 lg:right-20 top-20 sm:top-24 pointer-events-none select-none z-30">
          <div className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg bg-[#212636]/90 border border-[#353D50] backdrop-blur-md shadow-[0_0_20px_rgba(138,228,250,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8AE4FA] animate-ping" />
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#8AE4FA] uppercase">
              CYBER X81 // ONLINE
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default CyberX81Model;
