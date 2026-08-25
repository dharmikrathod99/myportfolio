'use client';

import React, { useEffect, useRef } from 'react';

const BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260713_140344_79e1296a-86d7-43fd-9b5f-63ffe560f291.png&w=1280&q=85';

const FRONT_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260713_162101_0d7498c5-29bb-47bf-a99f-2773c0a880a9.mp4';

const OVERLAY_IMAGE =
  'https://soft-zoom-63098134.figma.site/_assets/v11/3f10f1876e118f72a396e05a6c2d099569478272.png';

export default function MeasuredSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoMaskRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<SVGSVGElement>(null);

  // Target and smoothed cursor coordinates
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const gridOffset = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const lastInteractionTime = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Center spotlight initially
    const rect = section.getBoundingClientRect();
    const initialX = rect.width ? rect.width / 2 : 400;
    const initialY = rect.height ? rect.height * 0.65 : 350;
    targetPos.current = { x: initialX, y: initialY };
    currentPos.current = { x: initialX, y: initialY };

    const handleMouseMove = (e: MouseEvent) => {
      const currentRect = section.getBoundingClientRect();
      targetPos.current = {
        x: e.clientX - currentRect.left,
        y: e.clientY - currentRect.top,
      };
      isHovering.current = true;
      lastInteractionTime.current = performance.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const currentRect = section.getBoundingClientRect();
        targetPos.current = {
          x: e.touches[0].clientX - currentRect.left,
          y: e.touches[0].clientY - currentRect.top,
        };
        isHovering.current = true;
        lastInteractionTime.current = performance.now();
      }
    };

    const handleMouseLeave = () => {
      isHovering.current = false;
      lastInteractionTime.current = 0;
    };

    section.addEventListener('mousemove', handleMouseMove, { passive: true });
    section.addEventListener('touchstart', handleTouchMove, { passive: true });
    section.addEventListener('touchmove', handleTouchMove, { passive: true });
    section.addEventListener('mouseleave', handleMouseLeave);

    let animId: number;
    let autoTime = 0;

    const renderLoop = () => {
      const now = performance.now();
      const currentRect = section.getBoundingClientRect();
      const width = currentRect.width || 800;
      const height = currentRect.height || 600;

      // If user hasn't moved cursor recently or is not hovering: smoothly auto-move
      const isIdle = !isHovering.current || (now - lastInteractionTime.current > 1800);

      if (isIdle) {
        autoTime += 0.02;
        // Organic parametric sweep across the characters (Catbus, Totoro, Spirit)
        const autoX =
          width * 0.5 +
          Math.sin(autoTime * 0.75) * (width * 0.28) +
          Math.cos(autoTime * 1.4) * (width * 0.09);
        const autoY =
          height * 0.65 +
          Math.sin(autoTime * 1.1) * (height * 0.12) +
          Math.cos(autoTime * 0.6) * (height * 0.06);

        targetPos.current = { x: autoX, y: autoY };
      }

      // Smooth cursor lerp (0.09 factor for velvety buttery motion)
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.09;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.09;

      // Parallax Grid Offset (0.06 factor)
      const normX = (currentPos.current.x - width / 2) / (width / 2 || 1);
      const normY = (currentPos.current.y - height / 2) / (height / 2 || 1);
      gridOffset.current.x += (normX * 16 - gridOffset.current.x) * 0.06;
      gridOffset.current.y += (normY * 16 - gridOffset.current.y) * 0.06;

      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(${gridOffset.current.x}px, ${gridOffset.current.y}px, 0)`;
      }

      // Responsive spotlight radius (140px on mobile -> 260px on desktop)
      const spotlightRadius = Math.round(Math.min(Math.max(width * 0.36, 130), 260));

      // Update radial mask on video
      if (videoMaskRef.current) {
        const maskGradient = `radial-gradient(circle ${spotlightRadius}px at ${currentPos.current.x}px ${currentPos.current.y}px, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 40%, rgba(255,255,255,0.75) 60%, rgba(255,255,255,0.4) 75%, rgba(255,255,255,0.12) 88%, rgba(255,255,255,0) 100%)`;
        videoMaskRef.current.style.webkitMaskImage = maskGradient;
        videoMaskRef.current.style.maskImage = maskGradient;
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('touchstart', handleTouchMove);
      section.removeEventListener('touchmove', handleTouchMove);
      section.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      id="measured-experience"
      ref={sectionRef}
      className="relative w-full h-[75vh] sm:h-[85vh] lg:h-screen min-h-[480px] sm:min-h-[640px] max-h-[1080px] overflow-hidden select-none bg-[#0a0a0a] text-white font-sans border-y border-white/10"
      style={{ touchAction: 'pan-y' }}
    >
      {/* ================= LAYER 1: PARALLAX GRID BACKGROUND (z-0, opacity 0.1) ================= */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-15 overflow-hidden">
        <svg
          ref={gridRef}
          className="w-[120%] h-[120%] -top-[10%] -left-[10%] absolute transition-transform duration-75 will-change-transform"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="measured-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#64748b" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#measured-grid)" />
        </svg>
      </div>

      {/* ================= LAYER 2: BACKGROUND IMAGE (z-10) ================= */}
      <div
        className="absolute inset-0 z-10 bg-[center_top_15%] sm:bg-center bg-cover bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url('${BG_IMAGE_1}')`,
        }}
      />

      {/* ================= LAYER 3: HERO TEXT (z-20) ================= */}
      <div className="absolute inset-x-0 top-5 sm:top-10 md:top-16 z-20 flex flex-col items-center justify-center pointer-events-none text-center px-3">
        <span className="text-[8px] xs:text-[9px] sm:text-xs font-mono tracking-[0.25em] sm:tracking-[0.3em] uppercase text-white/70 mb-1 sm:mb-2 drop-shadow-md">
          Full Stack MERN & AI Software Engineer
        </span>
        <h2 className="font-instrument text-[2.6rem] xs:text-[3.4rem] sm:text-[6rem] md:text-[8.8rem] lg:text-[12rem] xl:text-[15rem] leading-[0.88] text-white tracking-tight drop-shadow-[0_12px_40px_rgba(0,0,0,0.95)] select-none whitespace-nowrap">
          DR. DEVELOPER
        </h2>
      </div>

      {/* ================= LAYER 4: OVERLAY IMAGE (z-25) ================= */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={OVERLAY_IMAGE}
        alt="Atmospheric Depth Overlay"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-25 opacity-90 mix-blend-screen"
      />

      {/* ================= LAYER 5: SPOTLIGHT REVEAL VIDEO (z-30) ================= */}
      {/* Clipped to the bottom 62% of viewport, revealed via cursor/auto radial mask */}
      <div
        ref={videoMaskRef}
        className="absolute inset-0 z-30 pointer-events-none will-change-[mask-image] overflow-hidden"
        style={{
          clipPath: 'inset(38% 0 0 0)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      >
        <video
          src={FRONT_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bottom Subtle Interaction Hint */}
      <div className="absolute bottom-3 sm:bottom-6 inset-x-0 z-40 flex items-center justify-center pointer-events-none px-3 text-center">
        <div className="liquid-glass rounded-full px-3.5 py-1 sm:py-1.5 text-[9px] sm:text-[11px] font-mono text-white/70 flex items-center gap-1.5 sm:gap-2 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          <span>Move cursor or touch screen to explore spotlight</span>
        </div>
      </div>
    </div>
  );
}
