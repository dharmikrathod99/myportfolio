'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { DKParticleEngine } from './DKParticleEngine';

export interface DKSceneProps {
  onProgressUpdate: (progress: number) => void;
  onAssemblyComplete: () => void;
  audioAmplitude: number;
  className?: string;
}

export function DKScene({
  onProgressUpdate,
  onAssemblyComplete,
  audioAmplitude,
  className = '',
}: DKSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<DKParticleEngine | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Device capability detection for adaptive particle count
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;

    let particleCount = 28000;
    if (isMobile) particleCount = 9000;
    else if (isTablet) particleCount = 16000;

    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

    // Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 6.2); // Start slightly farther away

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      // Fallback if WebGL fails
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0); // Transparent
    container.appendChild(renderer.domElement);

    // Humanoid Particle Engine
    const engine = new DKParticleEngine({ count: particleCount, dpr });
    engineRef.current = engine;
    scene.add(engine.points);

    // Assembly timeline with GSAP
    const assemblyObj = { phase: 0 };
    gsap.to(assemblyObj, {
      phase: 1.0,
      duration: 3.2,
      ease: 'power2.out',
    });

    // Camera glide inward during assembly
    gsap.to(camera.position, {
      z: 4.8,
      y: 0.1,
      duration: 3.6,
      ease: 'power3.out',
    });

    // Mouse Tracking & Parallax
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const planeIntersect = new THREE.Vector3();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      mouse.targetX = ndcX;
      mouse.targetY = ndcY;

      // Project mouse to 3D plane for physical particle forcefield
      raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
      raycaster.ray.intersectPlane(plane, planeIntersect);
      engine.mousePos3D.copy(planeIntersect);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    let animId: number;
    let lastTime = performance.now();
    let startTime = performance.now();
    let hasCompletedAssembly = false;

    const animate = () => {
      const now = performance.now();
      const dt = (now - lastTime) * 0.001;
      const elapsed = (now - startTime) * 0.001;
      lastTime = now;

      // Update Particle Physics Simulation
      engine.update(dt, elapsed, assemblyObj.phase);

      // Report Real Assembly Percentage
      onProgressUpdate(engine.realAssemblyProgress);

      if (engine.isFullyAssembled && !hasCompletedAssembly) {
        hasCompletedAssembly = true;
        engine.triggerEnergyPulse();
        onAssemblyComplete();
      }

      // Smooth Camera & Hologram Mouse Parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      engine.points.rotation.y = mouse.x * 0.18;
      engine.points.rotation.x = -mouse.y * 0.08;

      camera.position.x = mouse.x * 0.25;
      camera.position.y = 0.1 + mouse.y * 0.15;
      camera.lookAt(0, 0.1, 0);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);

      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      engine.dispose();
      renderer.dispose();
    };
  }, []);

  // Update audio amplitude in engine
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.audioAmplitude = audioAmplitude;
    }
  }, [audioAmplitude]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden select-none ${className}`}
    />
  );
}

export default DKScene;
