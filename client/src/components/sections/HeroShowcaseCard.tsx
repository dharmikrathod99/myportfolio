'use client';

import React, { useEffect, useRef } from 'react';
import { Eye } from 'lucide-react';

const BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260713_140344_79e1296a-86d7-43fd-9b5f-63ffe560f291.png&w=1280&q=85';

const FRONT_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260713_162101_0d7498c5-29bb-47bf-a99f-2773c0a880a9.mp4';

export default function HeroShowcaseCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoMaskRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const gridRef = useRef<SVGSVGElement>(null);
  const isVisible = useRef(false);

  // Target and smoothed cursor coordinates
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const gridOffset = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const lastInteractionTime = useRef(0);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Center spotlight initially
    const rect = card.getBoundingClientRect();
    const initialX = rect.width ? rect.width / 2 : 320;
    const initialY = rect.height ? rect.height * 0.65 : 340;
    targetPos.current = { x: initialX, y: initialY };
    currentPos.current = { x: initialX, y: initialY };

    const handleMouseMove = (e: MouseEvent) => {
      const currentRect = card.getBoundingClientRect();
      targetPos.current = {
        x: e.clientX - currentRect.left,
        y: e.clientY - currentRect.top,
      };
      isHovering.current = true;
      lastInteractionTime.current = performance.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const currentRect = card.getBoundingClientRect();
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

    card.addEventListener('mousemove', handleMouseMove, { passive: true });
    card.addEventListener('touchstart', handleTouchMove, { passive: true });
    card.addEventListener('touchmove', handleTouchMove, { passive: true });
    card.addEventListener('mouseleave', handleMouseLeave);

    let animId: number | null = null;
    let autoTime = 0;

    const renderLoop = () => {
      if (!isVisible.current) return;

      const now = performance.now();
      const currentRect = card.getBoundingClientRect();
      const width = currentRect.width || 600;
      const height = currentRect.height || 550;

      // Smooth buttery auto-orbit when idle
      const isIdle = !isHovering.current || (now - lastInteractionTime.current > 1800);

      if (isIdle) {
        autoTime += 0.022;
        const autoX =
          width * 0.5 +
          Math.sin(autoTime * 0.8) * (width * 0.26) +
          Math.cos(autoTime * 1.3) * (width * 0.08);
        const autoY =
          height * 0.64 +
          Math.sin(autoTime * 1.05) * (height * 0.12) +
          Math.cos(autoTime * 0.55) * (height * 0.05);

        targetPos.current = { x: autoX, y: autoY };
      }

      // Smooth cursor lerp (0.09 factor)
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.09;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.09;

      // Subtle parallax on grid background
      const normX = (currentPos.current.x - width / 2) / (width / 2 || 1);
      const normY = (currentPos.current.y - height / 2) / (height / 2 || 1);
      gridOffset.current.x += (normX * 12 - gridOffset.current.x) * 0.06;
      gridOffset.current.y += (normY * 12 - gridOffset.current.y) * 0.06;

      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(${gridOffset.current.x}px, ${gridOffset.current.y}px, 0)`;
      }

      // Responsive spotlight radius
      const spotlightRadius = Math.round(Math.min(Math.max(width * 0.38, 120), 240));

      // Update radial mask on video
      if (videoMaskRef.current) {
        const maskGradient = `radial-gradient(circle ${spotlightRadius}px at ${currentPos.current.x}px ${currentPos.current.y}px, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 42%, rgba(255,255,255,0.75) 62%, rgba(255,255,255,0.38) 78%, rgba(255,255,255,0.1) 90%, rgba(255,255,255,0) 100%)`;
        videoMaskRef.current.style.webkitMaskImage = maskGradient;
        videoMaskRef.current.style.maskImage = maskGradient;
      }

      animId = requestAnimationFrame(renderLoop);
    };

    // IntersectionObserver to pause rendering and video when offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        isVisible.current = inView;
        if (inView) {
          videoRef.current?.play().catch(() => {});
          if (!animId) animId = requestAnimationFrame(renderLoop);
        } else {
          videoRef.current?.pause();
          if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
          }
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(card);

    return () => {
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('touchstart', handleTouchMove);
      card.removeEventListener('touchmove', handleTouchMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative w-full h-[430px] sm:h-[500px] lg:h-[570px] rounded-[28px] sm:rounded-[32px] border-2 border-[#00F0FF]/70 shadow-[0_0_35px_rgba(0,240,255,0.22),inset_0_0_20px_rgba(0,240,255,0.06)] overflow-hidden bg-[#060A14] select-none touch-pan-y group"
      style={{ touchAction: 'pan-y' }}
    >
      {/* ================= LAYER 1: PARALLAX GRID BACKGROUND (z-0, opacity 0.12) ================= */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-12 overflow-hidden">
        <svg
          ref={gridRef}
          className="w-[120%] h-[120%] -top-[10%] -left-[10%] absolute transition-transform duration-75 will-change-transform"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="hero-card-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38BDF8" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-card-grid)" />
        </svg>
      </div>

      {/* ================= LAYER 2: BACKGROUND IMAGE (z-10) ================= */}
      <div
        className="absolute inset-0 z-10 bg-[center_top_18%] sm:bg-center bg-cover bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url('${BG_IMAGE_1}')`,
        }}
      />

      {/* ================= LAYER 3: SERIF HERO TITLE (z-[15]: BEHIND GLASS JAR) ================= */}
      <div className="absolute inset-x-0 top-8 sm:top-10 md:top-12 z-[15] flex flex-col items-center justify-center pointer-events-none text-center px-4 overflow-visible">
        <h2
          className="font-instrument text-[2.6rem] xs:text-[3.2rem] sm:text-[4.5rem] md:text-[5.6rem] lg:text-[6.4rem] leading-[0.92] text-white keep-white tracking-wide drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)] select-none whitespace-nowrap"
          style={{ color: '#ffffff' }}
        >
          DR. DEVELOPER
        </h2>
      </div>

      {/* ================= LAYER 4: GLASS JAR FOREGROUND (z-[25]: IN FRONT OF TEXT) ================= */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/terrarium-foreground.webp"
        alt="Glass Terrarium Jar Foreground"
        className="absolute inset-0 w-full h-full object-cover object-[center_top_18%] sm:object-center pointer-events-none z-[25]"
      />

      {/* ================= LAYER 5: SPOTLIGHT REVEAL VIDEO (z-30) ================= */}
      <div
        ref={videoMaskRef}
        className="absolute inset-0 z-30 pointer-events-none will-change-[mask-image] overflow-hidden mix-blend-screen"
        style={{
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      >
        <video
          ref={videoRef}
          src={FRONT_VIDEO}
          preload="none"
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-[center_top_18%] sm:object-center"
        />
      </div>

      {/* ================= BOTTOM INTERACTION PILL (z-40) ================= */}
      <div className="absolute bottom-3.5 sm:bottom-4 inset-x-0 z-40 flex items-center justify-center pointer-events-none px-3 text-center">
        <div className="bg-[#071120]/80 border border-white/20 backdrop-blur-md rounded-full px-3.5 sm:px-4 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-mono text-white/85 flex items-center gap-1.5 sm:gap-2 shadow-xl whitespace-nowrap">
          <Eye className="w-3 h-3 text-[#00F0FF] animate-pulse" />
          <span>Move cursor or touch screen to explore spotlight</span>
        </div>
      </div>
    </div>
  );
}
