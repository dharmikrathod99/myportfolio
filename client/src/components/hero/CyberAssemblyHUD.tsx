'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export interface CyberAssemblyHUDProps {
  progress: number; // 0 to 100
  item?: string; // current asset path being fetched
  loaded?: number;
  total?: number;
  isManualTrigger?: boolean;
  onComplete: () => void;
  onShake: (isShaking: boolean) => void;
  onSkip: () => void;
}

interface CodeLine {
  num: number;
  tokens: { text: string; color: string }[];
}

// Authentic Cyberpunk / Three.js Quantum Assembly Code
const CODE_FILE: CodeLine[] = [
  {
    num: 1,
    tokens: [
      { text: '// MIA_CYBORG_V4K // NEURAL 3D RUNTIME ENGINE', color: '#64748B' },
    ],
  },
  {
    num: 2,
    tokens: [
      { text: 'import ', color: '#F472B6' },
      { text: '{ WebGLRenderer, Scene, PerspectiveCamera } ', color: '#38BDF8' },
      { text: 'from ', color: '#F472B6' },
      { text: '"three";', color: '#34D399' },
    ],
  },
  {
    num: 3,
    tokens: [
      { text: 'import ', color: '#F472B6' },
      { text: '{ MeshoptDecoder } ', color: '#38BDF8' },
      { text: 'from ', color: '#F472B6' },
      { text: '"three/addons/libs/meshopt_decoder.js";', color: '#34D399' },
    ],
  },
  {
    num: 4,
    tokens: [
      { text: 'import ', color: '#F472B6' },
      { text: '{ compileElectricNeckShader } ', color: '#38BDF8' },
      { text: 'from ', color: '#F472B6' },
      { text: '"@cyber/shaders/neon_circuit";', color: '#34D399' },
    ],
  },
  {
    num: 5,
    tokens: [{ text: '', color: '' }],
  },
  {
    num: 6,
    tokens: [
      { text: 'const ', color: '#F472B6' },
      { text: 'CYBER_CONFIG ', color: '#FBBF24' },
      { text: '= {', color: '#FFFFFF' },
    ],
  },
  {
    num: 7,
    tokens: [
      { text: '  targetMesh: ', color: '#94A3B8' },
      { text: '"/models/mia.glb"', color: '#34D399' },
      { text: ',', color: '#FFFFFF' },
    ],
  },
  {
    num: 8,
    tokens: [
      { text: '  resolution: ', color: '#94A3B8' },
      { text: '"4K_ULTRA_HD_60FPS"', color: '#34D399' },
      { text: ',', color: '#FFFFFF' },
    ],
  },
  {
    num: 9,
    tokens: [
      { text: '  emissiveCircuit: ', color: '#94A3B8' },
      { text: '"/models/neck_emissive.png"', color: '#34D399' },
      { text: ',', color: '#FFFFFF' },
    ],
  },
  {
    num: 10,
    tokens: [
      { text: '  vramAlloc: ', color: '#94A3B8' },
      { text: '"16.0_GB_FORCE_VRAM"', color: '#34D399' },
      { text: ',', color: '#FFFFFF' },
    ],
  },
  {
    num: 11,
    tokens: [
      { text: '  biometrics: ', color: '#94A3B8' },
      { text: '"REALTIME_MOUSE_HEAD_FOLLOW"', color: '#34D399' },
    ],
  },
  {
    num: 12,
    tokens: [{ text: '};', color: '#FFFFFF' }],
  },
  {
    num: 13,
    tokens: [{ text: '', color: '' }],
  },
  {
    num: 14,
    tokens: [
      { text: 'async function ', color: '#F472B6' },
      { text: 'bootQuantumPipeline', color: '#60A5FA' },
      { text: '() {', color: '#FFFFFF' },
    ],
  },
  {
    num: 15,
    tokens: [
      { text: '  console.', color: '#94A3B8' },
      { text: 'log', color: '#60A5FA' },
      { text: '("[KERNEL] Booting WebGL2 hardware pipeline...");', color: '#34D399' },
    ],
  },
  {
    num: 16,
    tokens: [
      { text: '  const ', color: '#F472B6' },
      { text: 'meshBuffer ', color: '#E2E8F0' },
      { text: '= ', color: '#F472B6' },
      { text: 'await ', color: '#F472B6' },
      { text: 'MeshoptDecoder.', color: '#38BDF8' },
      { text: 'decodeGeometry', color: '#60A5FA' },
      { text: '(CYBER_CONFIG.targetMesh);', color: '#E2E8F0' },
    ],
  },
  {
    num: 17,
    tokens: [
      { text: '  const ', color: '#F472B6' },
      { text: 'neckShader ', color: '#E2E8F0' },
      { text: '= ', color: '#F472B6' },
      { text: 'compileElectricNeckShader', color: '#60A5FA' },
      { text: '({ cycle: 3.0, color: "#00B8FF" });', color: '#E2E8F0' },
    ],
  },
  {
    num: 18,
    tokens: [
      { text: '  ', color: '' },
      { text: '// Overclocking GPU voltage for 4K ray tracing...', color: '#64748B' },
    ],
  },
  {
    num: 19,
    tokens: [
      { text: '  sysctl.', color: '#94A3B8' },
      { text: 'set', color: '#60A5FA' },
      { text: '("kernel.neural_overclock", ', color: '#E2E8F0' },
      { text: '"VOLTAGE_1.21_GW"', color: '#34D399' },
      { text: ');', color: '#E2E8F0' },
    ],
  },
  {
    num: 20,
    tokens: [
      { text: '  return ', color: '#F472B6' },
      { text: 'mountScene', color: '#60A5FA' },
      { text: '(meshBuffer, neckShader);', color: '#E2E8F0' },
    ],
  },
  {
    num: 21,
    tokens: [{ text: '}', color: '#FFFFFF' }],
  },
  {
    num: 22,
    tokens: [{ text: '', color: '' }],
  },
  {
    num: 23,
    tokens: [
      { text: '// EXECUTE PIPELINE WITH ZERO THROTTLING', color: '#F59E0B' },
    ],
  },
  {
    num: 24,
    tokens: [
      { text: 'bootQuantumPipeline().', color: '#E2E8F0' },
      { text: 'catch', color: '#F472B6' },
      { text: '(err => ', color: '#E2E8F0' },
      { text: 'panic', color: '#EF4444' },
      { text: '(0xDEADBEEF));', color: '#EF4444' },
    ],
  },
];

// Terminal execution logs
interface TerminalMsg {
  type: 'info' | 'success' | 'warn' | 'fatal';
  text: string;
}

export default function CyberAssemblyHUD({
  progress = 0,
  item = '',
  loaded = 0,
  total = 0,
  isManualTrigger = false,
  onComplete,
  onShake,
  onSkip,
}: CyberAssemblyHUDProps) {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<'CODING' | 'CRASHING' | 'REBOOTING'>('CODING');
  const [termLogs, setTermLogs] = useState<TerminalMsg[]>([
    { type: 'info', text: '➜ [COMPILER] ts-node src/quantum_core.ts --mode=production' },
    { type: 'info', text: '➜ [SYS] WebGL2 context initialized @ 4K Ultra-HD' },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editorScrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loggedMilestones = useRef<Set<number>>(new Set());

  // Matrix Digital Rain Canvas Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const chars = '0123456789ABCDEF<>{}/*=+~_[]!#';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = new Array(columns).fill(1);

    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(2, 5, 18, 0.15)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = phase === 'CRASHING' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0, 240, 255, 0.35)';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animId = requestAnimationFrame(drawMatrix);
    };

    animId = requestAnimationFrame(drawMatrix);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [phase]);

  // Map progress to visible code lines
  const visibleLinesCount = Math.max(
    4,
    Math.min(CODE_FILE.length, Math.floor((progress / 95) * CODE_FILE.length) + 3)
  );

  // Auto-scroll code editor
  useEffect(() => {
    if (editorScrollRef.current) {
      editorScrollRef.current.scrollTop = editorScrollRef.current.scrollHeight;
    }
  }, [visibleLinesCount]);

  // Terminal compiler logs advancing with progress
  useEffect(() => {
    const p = Math.floor(progress);

    const addMsg = (type: 'info' | 'success' | 'warn' | 'fatal', text: string) => {
      setTermLogs((prev) => [...prev, { type, text }]);
    };

    if (p >= 20 && !loggedMilestones.current.has(20)) {
      loggedMilestones.current.add(20);
      addMsg('info', `➜ [FETCH] Fetching 3D assets: ${item ? item.split('/').pop() : 'mia.glb'} (${loaded}/${Math.max(1, total)})`);
    }

    if (p >= 40 && !loggedMilestones.current.has(40)) {
      loggedMilestones.current.add(40);
      addMsg('success', '✓ [DECODE] Meshopt geometry buffers decompressed [36,000 vertices]');
    }

    if (p >= 65 && !loggedMilestones.current.has(65)) {
      loggedMilestones.current.add(65);
      addMsg('success', '✓ [SHADERS] Electric neon neck circuit compiled: neck_emissive.png');
    }

    if (p >= 85 && !loggedMilestones.current.has(85)) {
      loggedMilestones.current.add(85);
      addMsg('warn', '⚠ [VOLTAGE] Core temperature climbing: 1,420°C [COOLING FAILURE]');
    }

    // Trigger Crash at 100%
    if (p >= 100 && phase === 'CODING' && !loggedMilestones.current.has(100)) {
      loggedMilestones.current.add(100);
      addMsg('fatal', '🚨 [FATAL EXCEPTION] 0xDEADBEEF: SERVER CORE OVERLOAD!');
      addMsg('fatal', '💥 [CRASH] SYSTEM CORE MELTDOWN // HIGH VOLTAGE DISCHARGE 💥');

      setPhase('CRASHING');
      onShake(true);

      const crashTimer = setTimeout(() => {
        onShake(false);
        setPhase('REBOOTING');

        const rebootTimer = setTimeout(() => {
          onComplete();
        }, 500);

        return () => clearTimeout(rebootTimer);
      }, 750);

      return () => clearTimeout(crashTimer);
    }
  }, [progress, item, loaded, total, phase, onShake, onComplete]);

  const isCrashing = phase === 'CRASHING';
  const isRebooting = phase === 'REBOOTING';

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {!isRebooting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.35 }}
          className={`fixed inset-0 z-[9999] w-full h-full flex flex-col justify-between font-mono select-none overflow-hidden transition-colors duration-200 ${
            isCrashing ? 'bg-[#180306]/95' : 'bg-[#030712]/95'
          } backdrop-blur-3xl`}
        >
          {/* Matrix Digital Rain Canvas Background */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-0" />

          {/* CRT Glitch Scanlines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_3px] pointer-events-none opacity-70 animate-scanline-sweep z-10" />

          {/* Red Alert Glitch Vignette during Crash */}
          {isCrashing && (
            <div className="absolute inset-0 pointer-events-none bg-red-900/30 mix-blend-color-dodge animate-pulse z-20" />
          )}

          {/* 1. TOP VS-CODE / IDE HEADER BAR */}
          <header
            className={`relative z-30 px-4 sm:px-6 py-2.5 border-b flex items-center justify-between text-xs transition-colors duration-200 ${
              isCrashing
                ? 'bg-red-950/80 border-red-500/50 text-red-300'
                : 'bg-[#070D1F]/90 border-cyan-500/20 text-[#8AE4FA]'
            }`}
          >
            {/* Left: Window Controls & Active IDE Tabs */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 mr-2">
                <span className={`w-3 h-3 rounded-full ${isCrashing ? 'bg-red-500 animate-ping' : 'bg-red-500'}`} />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>

              {/* IDE Tabs */}
              <div className="flex items-center gap-1">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-t-md border-t-2 text-[11px] font-semibold ${
                    isCrashing
                      ? 'bg-red-900/40 border-red-500 text-red-200'
                      : 'bg-[#0E172A] border-cyan-400 text-white shadow-sm'
                  }`}
                >
                  <span className="text-cyan-400 text-[10px]">TS</span>
                  <span>quantum_core.ts</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-[#64748B] text-[11px]">
                  <span className="text-purple-400 text-[10px]">GLSL</span>
                  <span>electric_neck.frag</span>
                </div>
              </div>
            </div>

            {/* Right: Real-time Progress Readout & Skip */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#94A3B8] hidden sm:inline">COMPILING:</span>
                <span className={`font-bold ${isCrashing ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
                  {Math.min(100, Math.floor(progress))}%
                </span>
              </div>

              <button
                onClick={onSkip}
                className="px-2.5 py-0.5 rounded border border-white/20 hover:border-cyan-400 hover:bg-cyan-500/20 text-white/80 hover:text-white text-[10px] uppercase tracking-wider transition-all cursor-pointer"
              >
                SKIP ⏭
              </button>
            </div>
          </header>

          {/* 2. MAIN CENTER CODE EDITOR (The Real Coding Effect) */}
          <main className="relative z-30 flex-1 flex flex-col p-3 sm:p-6 overflow-hidden">
            {/* Editor Window Body */}
            <div
              ref={editorScrollRef}
              className={`flex-1 rounded-xl border p-4 sm:p-6 overflow-y-auto backdrop-blur-xl transition-colors duration-200 shadow-2xl scrollbar-thin scrollbar-thumb-cyan-500/30 ${
                isCrashing
                  ? 'bg-red-950/40 border-red-500/60 shadow-[0_0_50px_rgba(239,68,68,0.25)]'
                  : 'bg-[#020719]/85 border-cyan-500/30 shadow-[0_0_40px_rgba(0,240,255,0.12)]'
              }`}
            >
              {/* Code lines streaming down */}
              <div className="space-y-1 text-xs sm:text-[13px] leading-relaxed">
                {CODE_FILE.slice(0, visibleLinesCount).map((line) => (
                  <div key={line.num} className="flex items-baseline gap-4 group">
                    {/* Line number */}
                    <span className="w-8 text-right select-none text-[#475569] group-hover:text-cyan-400 text-xs font-mono">
                      {line.num}
                    </span>

                    {/* Syntax Tokens */}
                    <div className="flex-1 font-mono break-all">
                      {line.tokens.map((tok, idx) => (
                        <span key={idx} style={{ color: isCrashing && tok.color !== '#64748B' ? '#F87171' : tok.color }}>
                          {tok.text}
                        </span>
                      ))}

                      {/* Blinking typing cursor on active line */}
                      {line.num === visibleLinesCount && phase === 'CODING' && (
                        <span className="inline-block w-2 h-3.5 ml-1 bg-cyan-400 animate-pulse align-middle" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Integrated Terminal / Compiler Output Pane */}
            <div
              className={`mt-3 rounded-lg border p-3 text-xs leading-relaxed max-h-32 sm:max-h-36 overflow-y-auto backdrop-blur-md transition-colors duration-200 ${
                isCrashing
                  ? 'bg-red-950/60 border-red-500/60 text-red-200'
                  : 'bg-[#02091c]/90 border-cyan-500/20 text-[#94A3B8]'
              }`}
            >
              <div className="flex items-center justify-between pb-1 mb-2 border-b border-white/10 text-[10px]">
                <span className="text-white font-semibold">OUTPUT CONSOLE // TTY_COMPILER</span>
                <span className="text-cyan-400">NODE v20.17 // TSC 5.6.3</span>
              </div>

              <div className="space-y-1 text-[11px] sm:text-xs">
                {termLogs.map((log, i) => (
                  <div
                    key={i}
                    className={`${
                      log.type === 'fatal'
                        ? 'text-red-400 font-bold animate-pulse'
                        : log.type === 'warn'
                          ? 'text-yellow-400'
                          : log.type === 'success'
                            ? 'text-emerald-400 font-medium'
                            : 'text-[#8AE4FA]'
                    }`}
                  >
                    {log.text}
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* 3. BOTTOM STATUS STRIP (VS Code Style) */}
          <footer
            className={`relative z-30 px-4 sm:px-6 py-1.5 border-t flex items-center justify-between text-[10px] sm:text-[11px] transition-colors duration-200 ${
              isCrashing
                ? 'bg-red-900 border-red-500/50 text-white'
                : 'bg-[#007ACC] text-white border-blue-400/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-bold flex items-center gap-1">
                <span>⚡</span> {isCrashing ? 'CRASH OVERLOAD' : 'main*'}
              </span>
              <span className="hidden sm:inline">0 Errors, 0 Warnings</span>
            </div>

            <div className="flex items-center gap-4 text-[10px]">
              <span>Ln {visibleLinesCount}, Col 42</span>
              <span>Spaces: 2</span>
              <span>UTF-8</span>
              <span className="font-semibold">{isCrashing ? 'KERNEL_CRASH' : 'TypeScript JSX'}</span>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
