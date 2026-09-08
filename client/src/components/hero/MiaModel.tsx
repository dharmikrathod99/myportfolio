'use client';

import React, { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls, useTexture, Environment, useProgress } from '@react-three/drei';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { motion } from 'framer-motion';
import NightSkyBackground from './NightSkyBackground';
import CyberAssemblyHUD from './CyberAssemblyHUD';
import { useSmoothScroll } from '@/components/SmoothScroll';
import { useTheme } from '@/context/ThemeContext';

export interface MiaModelProps {
  className?: string;
  showStatusLabel?: boolean;
}

// -------------------------------------------------------------
// WEBGL GPU PRE-COMPILATION PIPELINE
// Compiles all shaders and textures in the background so there is
// ZERO frame-drop or stutter when the model appears.
// -------------------------------------------------------------
function PrecompilePipeline() {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    try {
      if (gl && scene && camera) {
        gl.compile(scene, camera);
      }
    } catch {
      // Safe fallback
    }
  }, [gl, scene, camera]);

  return null;
}

// 4K Studio Lighting Rig
function StudioLighting() {
  return (
    <>
      {/* Atmosphere Fog */}
      <fog attach="fog" args={['#070A14', 3.2, 7.5]} />

      {/* Ambient Fill */}
      <ambientLight intensity={1.5} />

      {/* Key Light (Electric Cyan on Face - 4K High Quality) */}
      <directionalLight
        position={[2.5, 3.0, 3.0]}
        intensity={3.6}
        color="#8AE4FA"
      />

      {/* Fill Light (Soft Electric Sky Blue) */}
      <directionalLight
        position={[-3.0, 2.0, 2.5]}
        intensity={2.6}
        color="#56AEEB"
      />

      {/* Rim / Hair Light (Cyber Violet / Magenta on Silhouette) */}
      <pointLight
        position={[0, 2.8, -2.0]}
        intensity={5.2}
        color="#C084FC"
      />

      {/* Front Face Spotlight - Directly illuminates Eyes and Facial Features */}
      <pointLight
        position={[0, 0.1, 1.7]}
        intensity={2.2}
        color="#F0F9FF"
      />
    </>
  );
}

// -------------------------------------------------------------
// 3D MIA MODEL WITH 4K RENDERING & ELECTRIC NECK GLOW
// -------------------------------------------------------------
interface CharacterFaceBones {
  head?: THREE.Bone;
  neckUpper?: THREE.Bone;
  neckLower?: THREE.Bone;
  leftEye?: THREE.Bone;
  rightEye?: THREE.Bone;
}

interface BaseBoneRotations {
  head?: THREE.Euler;
  neckUpper?: THREE.Euler;
  neckLower?: THREE.Euler;
  leftEye?: THREE.Euler;
  rightEye?: THREE.Euler;
}

function Model({
  onPointerUpdate,
}: {
  onPointerUpdate?: (x: number, y: number) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const bonesRef = useRef<CharacterFaceBones>({});
  const baseRotationsRef = useRef<BaseBoneRotations>({});
  const skinHeadMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const neckLightRef = useRef<THREE.PointLight | null>(null);
  const uniformsRef = useRef<{ uTime: { value: number } }>({
    uTime: { value: 0 },
  });

  // Smooth interpolated angles for head & eye tracking
  const currentYawRef = useRef(0);
  const currentPitchRef = useRef(0);
  const currentRollRef = useRef(0);
  const currentEyeYawRef = useRef(0);
  const currentEyePitchRef = useRef(0);

  // Load GLTF model and custom neck electric circuit emissive texture map
  const { scene, animations } = useGLTF('/models/mia.glb', true, true, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
  const neckEmissiveMap = useTexture('/models/neck_emissive.png');

  useEffect(() => {
    if (neckEmissiveMap) {
      neckEmissiveMap.flipY = false;
      neckEmissiveMap.colorSpace = THREE.SRGBColorSpace;
      neckEmissiveMap.needsUpdate = true;
    }
  }, [neckEmissiveMap]);

  // Use model animations directly to preserve exact 3D eye socket positions and forward keyframes
  const { actions, names } = useAnimations(animations, group);

  // Setup bones, materials, and crystal-clear eye visibility with frustum culling
  useEffect(() => {
    const foundBones: CharacterFaceBones = {};
    const baseRotations: BaseBoneRotations = {};

    scene.traverse((child) => {
      const childName = (child.name || '').toLowerCase();

      // Enable frustum culling for maximum performance
      if ((child as THREE.Mesh).isMesh) {
        child.frustumCulled = true;
      }

      // 1. Hide lower body parts not in the photo
      if (
        childName.includes('leg') ||
        childName.includes('boot') ||
        childName.includes('tablet') ||
        childName.includes('songbird') ||
        childName.includes('wrap') ||
        childName.includes('suit') ||
        childName.includes('icosphere') ||
        childName.includes('plane') ||
        childName.includes('occlusion') ||
        childName.includes('tearline')
      ) {
        child.visible = false;
        child.castShadow = false;
        child.receiveShadow = false;
        return;
      }

      // 2. Crystal-Clear Eye Materials Fix & Neon Ultra HD Materials
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

        materials.forEach((mat) => {
          if (!mat) return;
          const matName = mat.name || '';

          // Hide any lower body materials or eye occlusion blockers
          if (
            matName.includes('Std_Skin_Leg') ||
            matName.includes('Loose_Biker_Boots') ||
            matName.includes('Leg_Wrap') ||
            matName.includes('Belt1') ||
            matName.includes('Suit1') ||
            matName.includes('songbird') ||
            matName.includes('Eye_Occlusion') ||
            matName.includes('Tearline') ||
            matName.includes('Occlusion')
          ) {
            child.visible = false;
            return;
          }

          // Enhance Ga_Eye (Iris, Pupil, Sclera) - Always 100% visible, opaque and razor sharp
          if (matName.includes('Ga_Eye') || matName.includes('Eye')) {
            const eyeMat = mat as THREE.MeshStandardMaterial;
            eyeMat.roughness = 0.06;
            eyeMat.metalness = 0.0;
            eyeMat.depthWrite = true;
            eyeMat.depthTest = true;
            eyeMat.transparent = false;
            eyeMat.opacity = 1.0;
            mesh.renderOrder = 0;
            eyeMat.needsUpdate = true;
          }

          // 2B. Cybernetic Neck Electric Circuit Glowing Material & Shader FX
          if (matName.includes('Std_Skin_Head') || matName.includes('Skin_Head')) {
            const stdMat = mat as THREE.MeshStandardMaterial;
            stdMat.emissiveMap = neckEmissiveMap;
            stdMat.emissive = new THREE.Color('#0088FF');
            stdMat.emissiveIntensity = 2.4;
            stdMat.roughness = 0.46;
            stdMat.metalness = 0.04;

            stdMat.onBeforeCompile = (shader) => {
              shader.uniforms.uTime = uniformsRef.current.uTime;
              shader.fragmentShader = `
                uniform float uTime;
              ` + shader.fragmentShader;

              // Invert white-painted diffuse map into dark titanium cyber metal
              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <map_fragment>',
                `
                #ifdef USE_MAP
                  vec4 sampledDiffuseColor = texture2D( map, vMapUv );
                  
                  #ifdef USE_EMISSIVEMAP
                    vec4 neckMask = texture2D( emissiveMap, vMapUv );
                    float isCyberCircuit = dot(neckMask.rgb, vec3(0.299, 0.587, 0.114));
                    if (isCyberCircuit > 0.03) {
                      vec3 darkTitanium = vec3(0.035, 0.055, 0.085);
                      sampledDiffuseColor.rgb = mix(sampledDiffuseColor.rgb, darkTitanium, min(1.0, isCyberCircuit * 1.8));
                    }
                  #endif

                  diffuseColor *= sampledDiffuseColor;
                #endif
                `
              );

              // Pure Light Electric Neon Blue Glow & Glow-off Cycle
              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <emissivemap_fragment>',
                `
                #ifdef USE_EMISSIVEMAP
                  vec4 emissiveTex = texture2D( emissiveMap, vEmissiveMapUv );
                  float lum = dot(emissiveTex.rgb, vec3(0.299, 0.587, 0.114));
                  
                  if (lum > 0.03) {
                    float tau = mod(uTime, 3.0);
                    float neonPower = 0.0;
                    
                    if (tau < 0.16) {
                      float strike1 = step(0.02, tau) * (1.0 - step(0.06, tau));
                      float strike2 = step(0.09, tau);
                      neonPower = (strike1 * 1.5 + strike2 * 2.0);
                    } else if (tau < 1.45) {
                      float wave = sin(vEmissiveMapUv.y * 36.0 - uTime * 6.5) * 0.20 + 0.90;
                      neonPower = wave * 2.0;
                    } else if (tau < 1.95) {
                      float fade = (1.95 - tau) / 0.50;
                      neonPower = smoothstep(0.0, 1.0, fade) * 1.4;
                    } else if (tau < 2.85) {
                      neonPower = 0.0;
                    } else {
                      float charge = (tau - 2.85) / 0.15;
                      neonPower = charge * 0.30;
                    }

                    float jitter = sin(uTime * 50.0) * sin(uTime * 70.0) * 0.12;
                    float spark = step(0.965, fract(sin(dot(vEmissiveMapUv.xy, vec2(12.9898, 78.233)) + uTime * 15.0) * 43758.5453));

                    vec3 electricNeonBlue = vec3(0.0, 0.72, 1.0);
                    vec3 deepElectricBlue = vec3(0.0, 0.40, 1.0);
                    vec3 neonCyanCore    = vec3(0.10, 0.92, 1.0);

                    vec3 currentGlow = mix(deepElectricBlue, electricNeonBlue, 0.5 + 0.5 * sin(vEmissiveMapUv.y * 28.0 - uTime * 6.0));
                    currentGlow = mix(currentGlow, neonCyanCore, spark * 0.5);

                    float boost = (neonPower + spark * neonPower * 0.8 + jitter * neonPower * 0.1);
                    totalEmissiveRadiance = currentGlow * boost * 2.6 * min(1.0, lum * 1.5);
                  } else {
                    totalEmissiveRadiance = vec3(0.0);
                  }
                #endif
                `
              );
            };

            stdMat.needsUpdate = true;
            skinHeadMatRef.current = stdMat;
          }

          // Main Cyber Jacket
          if (matName.includes('Jacket1')) {
            const stdMat = mat as THREE.MeshStandardMaterial;
            stdMat.color = new THREE.Color('#10141D');
            stdMat.roughness = 0.35;
            stdMat.metalness = 0.22;
            stdMat.depthWrite = true;
            stdMat.transparent = false;
            stdMat.needsUpdate = true;
          }

          // Glowing Neon Ultra HD Cyber Piping
          if (matName.includes('Jacket2') || matName.includes('Jacket4')) {
            const stdMat = mat as THREE.MeshStandardMaterial;
            stdMat.color = new THREE.Color('#00F0FF');
            stdMat.emissive = new THREE.Color('#00E5FF');
            stdMat.emissiveIntensity = 2.2;
            stdMat.roughness = 0.15;
            stdMat.metalness = 0.45;
            stdMat.depthWrite = true;
            stdMat.transparent = false;
            stdMat.needsUpdate = true;
          }

          // Metallic Buckles, Rings & Hardware
          if (
            matName.includes('Belt2') ||
            matName.includes('Jacket3') ||
            matName.includes('Jacket5') ||
            matName.includes('Jacket7')
          ) {
            const stdMat = mat as THREE.MeshStandardMaterial;
            stdMat.color = new THREE.Color('#E2E8F0');
            stdMat.metalness = 0.95;
            stdMat.roughness = 0.12;
            stdMat.depthWrite = true;
            stdMat.transparent = false;
            stdMat.needsUpdate = true;
          }

          // Cyber Badges & Patches
          if (matName.includes('Jacket8')) {
            const stdMat = mat as THREE.MeshStandardMaterial;
            stdMat.roughness = 0.26;
            stdMat.metalness = 0.32;
            stdMat.emissive = new THREE.Color('#818CF8');
            stdMat.emissiveIntensity = 0.65;
            stdMat.depthWrite = true;
            stdMat.transparent = false;
            stdMat.needsUpdate = true;
          }

          // Inner Collar & Trim Details
          if (matName.includes('Jacket6') || matName.includes('Cyberwear_Head_5')) {
            const stdMat = mat as THREE.MeshStandardMaterial;
            stdMat.color = new THREE.Color('#0A0E17');
            stdMat.roughness = 0.32;
            stdMat.metalness = 0.45;
            stdMat.depthWrite = true;
            stdMat.transparent = false;
            stdMat.needsUpdate = true;
          }
        });
      }

      // 3. Identify Head and Neck bones
      if ((child as THREE.Bone).isBone) {
        const bone = child as THREE.Bone;
        const name = bone.name;

        if (name.includes('Head') || name.toLowerCase().includes('head')) {
          foundBones.head = bone;
          baseRotations.head = bone.rotation.clone();
        } else if (name.includes('L_Eye') || name.toLowerCase().includes('lefteye') || name.includes('Eye_L')) {
          foundBones.leftEye = bone;
          bone.position.set(7.71875, 7.64453125, 3.33984375);
        } else if (name.includes('R_Eye') || name.toLowerCase().includes('righteye') || name.includes('Eye_R')) {
          foundBones.rightEye = bone;
          bone.position.set(7.71875, 7.64453125, -3.33984375);
        } else if (name.includes('NeckTwist02') || name.includes('Neck_02')) {
          foundBones.neckUpper = bone;
          baseRotations.neckUpper = bone.rotation.clone();

          let neckLight = bone.getObjectByName('NeckElectricLight') as THREE.PointLight | null;
          if (!neckLight) {
            neckLight = new THREE.PointLight(0x00E5FF, 3.2, 0.9);
            neckLight.name = 'NeckElectricLight';
            neckLight.position.set(0, 0.05, 0.12);
            bone.add(neckLight);
          }
          neckLightRef.current = neckLight;
        } else if (name.includes('NeckTwist01') || name.includes('Neck') || name.toLowerCase().includes('neck')) {
          foundBones.neckLower = bone;
          baseRotations.neckLower = bone.rotation.clone();
        }
      }
    });

    bonesRef.current = foundBones;
    baseRotationsRef.current = baseRotations;

    if (names.length > 0 && actions[names[0]]) {
      actions[names[0]]?.reset().play();
    }
  }, [actions, names, scene, neckEmissiveMap]);

  // Real-time Face & Head Mouse Tracking
  useFrame((state, delta) => {
    const { pointer } = state;

    if (onPointerUpdate) {
      onPointerUpdate(pointer.x, pointer.y);
    }

    uniformsRef.current.uTime.value = state.clock.elapsedTime;

    const t = state.clock.elapsedTime;
    const tau = t % 3.0;
    let neonPower = 0.0;

    if (tau < 0.15) {
      const strike1 = (tau >= 0.02 && tau < 0.05) ? 1.0 : 0.0;
      const strike2 = tau >= 0.08 ? 1.0 : 0.0;
      neonPower = strike1 * 1.6 + strike2 * 1.9;
    } else if (tau < 1.45) {
      const wave = Math.sin(t * 7.5) * 0.18 + 0.90;
      neonPower = wave * 1.8;
    } else if (tau < 1.95) {
      const fade = (1.95 - tau) / 0.50;
      neonPower = fade * fade * 1.2;
    } else if (tau < 2.85) {
      neonPower = 0.01;
    } else {
      const charge = (tau - 2.85) / 0.15;
      neonPower = charge * 0.35;
    }

    // Direct ref updates avoiding object allocations in useFrame
    if (skinHeadMatRef.current) {
      skinHeadMatRef.current.emissiveIntensity = Math.max(0.02, neonPower * 2.2);
    }

    if (neckLightRef.current) {
      neckLightRef.current.intensity = Math.max(0.02, neonPower * 3.6);
    }

    // Head & Neck tracking
    const targetYaw = pointer.x * 0.45;
    const targetPitch = -pointer.y * 0.25;
    const targetRoll = -pointer.x * pointer.y * 0.04;

    currentYawRef.current = THREE.MathUtils.damp(currentYawRef.current, targetYaw, 7.5, delta);
    currentPitchRef.current = THREE.MathUtils.damp(currentPitchRef.current, targetPitch, 7.5, delta);
    currentRollRef.current = THREE.MathUtils.damp(currentRollRef.current, targetRoll, 7.5, delta);

    // Eye Gaze Tracking: Natural, focused eye movement tracking the mouse cursor
    const targetEyeYaw = pointer.x * 0.12;
    const targetEyePitch = -pointer.y * 0.08;

    currentEyeYawRef.current = THREE.MathUtils.damp(currentEyeYawRef.current, targetEyeYaw, 10.0, delta);
    currentEyePitchRef.current = THREE.MathUtils.damp(currentEyePitchRef.current, targetEyePitch, 10.0, delta);

    const yaw = currentYawRef.current;
    const pitch = currentPitchRef.current;
    const roll = currentRollRef.current;
    const eyeYaw = currentEyeYawRef.current;
    const eyePitch = currentEyePitchRef.current;

    const bones = bonesRef.current;
    const base = baseRotationsRef.current;

    // Apply relative eye gaze focus on top of the forward-facing animated eye orientation
    if (bones.leftEye) {
      bones.leftEye.rotation.y += eyeYaw;
      bones.leftEye.rotation.x += eyePitch;
    }

    if (bones.rightEye) {
      bones.rightEye.rotation.y += eyeYaw;
      bones.rightEye.rotation.x += eyePitch;
    }

    if (bones.head && base.head) {
      bones.head.rotation.y = base.head.y + yaw * 0.70;
      bones.head.rotation.x = base.head.x + pitch * 0.65;
      bones.head.rotation.z = base.head.z + roll * 0.50;
    }

    if (bones.neckUpper && base.neckUpper) {
      bones.neckUpper.rotation.y = base.neckUpper.y + yaw * 0.20;
      bones.neckUpper.rotation.x = base.neckUpper.x + pitch * 0.20;
    }

    if (bones.neckLower && base.neckLower) {
      bones.neckLower.rotation.y = base.neckLower.y + yaw * 0.10;
      bones.neckLower.rotation.x = base.neckLower.x + pitch * 0.10;
    }

    if (group.current) {
      group.current.position.set(0, -4.15, 0);
      group.current.rotation.set(0, 0, 0);
    }
  });

  return (
    <group
      ref={group}
      position={[0, -4.15, 0]}
      rotation={[0, 0, 0]}
      scale={1.5}
      dispose={null}
    >
      <primitive object={scene} />
    </group>
  );
}

// Preload the GLB model asset and emissive texture
useGLTF.preload('/models/mia.glb', true, true, (loader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
});
useTexture.preload('/models/neck_emissive.png');

export function MiaModel({ className = '', showStatusLabel = true }: MiaModelProps) {
  const [mounted, setMounted] = useState(false);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const { lenis } = useSmoothScroll();
  const { setIsSiteLoading } = useTheme();

  // Real Three.js asset loading tracker
  const { active, progress: realProgress, item, loaded, total } = useProgress();
  const [hasCompletedInitialLoad, setHasCompletedInitialLoad] = useState(false);

  // Manual replay state
  const [manualTrigger, setManualTrigger] = useState(false);
  const [manualProgress, setManualProgress] = useState(0);

  // Shaking and flare effects
  const [isShaking, setIsShaking] = useState(false);
  const [showFlare, setShowFlare] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if model was already cached on mount
  useEffect(() => {
    if (!active && realProgress === 100) {
      setHasCompletedInitialLoad(true);
      setIsSiteLoading(false);
    }
  }, [active, realProgress, setIsSiteLoading]);

  // Handle manual replay simulation (smooth 0 to 100 progress over ~1.8s)
  useEffect(() => {
    if (!manualTrigger) return;
    let cur = 0;
    const interval = setInterval(() => {
      cur += 4;
      if (cur >= 100) {
        cur = 100;
        setManualProgress(100);
        clearInterval(interval);
      } else {
        setManualProgress(cur);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [manualTrigger]);

  const handleReplay = () => {
    setManualProgress(0);
    setManualTrigger(true);
    setIsShaking(false);
    setIsSiteLoading(true);
  };

  const handleSkip = () => {
    setHasCompletedInitialLoad(true);
    setManualTrigger(false);
    setIsShaking(false);
    setIsSiteLoading(false);
  };

  const handleComplete = () => {
    setHasCompletedInitialLoad(true);
    setManualTrigger(false);
    setIsShaking(false);
    setShowFlare(true);
    setIsSiteLoading(false);
    setTimeout(() => {
      setShowFlare(false);
    }, 850);
  };

  // Only show the full-screen terminal if model is ACTUALLY loading or manually re-triggered
  const isActualLoading = !hasCompletedInitialLoad && (active || realProgress < 100);
  const shouldShowLoader = isActualLoading || manualTrigger;
  const currentProgress = manualTrigger ? manualProgress : realProgress;

  // Synchronize site loading state to hide navbar while loading
  useEffect(() => {
    setIsSiteLoading(shouldShowLoader);
  }, [shouldShowLoader, setIsSiteLoading]);

  // Reset loading state if unmounted
  useEffect(() => {
    return () => {
      setIsSiteLoading(false);
    };
  }, [setIsSiteLoading]);

  // Complete page scroll lock while loading is active
  useEffect(() => {
    if (shouldShowLoader) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      window.scrollTo(0, 0);

      if (lenis) {
        lenis.stop();
        lenis.scrollTo(0, { immediate: true });
      }

      const preventDefaultScroll = (e: Event) => {
        e.preventDefault();
      };

      window.addEventListener('wheel', preventDefaultScroll, { passive: false });
      window.addEventListener('touchmove', preventDefaultScroll, { passive: false });

      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        if (lenis) {
          lenis.start();
        }
        window.removeEventListener('wheel', preventDefaultScroll);
        window.removeEventListener('touchmove', preventDefaultScroll);
      };
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (lenis) {
        lenis.start();
      }
    }
  }, [shouldShowLoader, lenis]);

  if (!mounted) {
    return (
      <div className={`relative w-full h-full min-h-[100dvh] flex items-center justify-center bg-[#070A14] ${className}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#38BDF8]/30 border-t-[#38BDF8] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-[100dvh] min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#070A14] select-none touch-pan-y ${
        isShaking ? 'animate-catastrophic-shake' : ''
      } ${className}`}
    >
      {/* 1. Exact Night Sky Background with Twinkling Stars & Shooting Comets */}
      <NightSkyBackground />

      {/* 2. Blinding Cyan/White Reboot Shockwave Flare upon server restore */}
      {showFlare && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0, 1, 0], scale: [0.6, 1.4, 2.2] }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden"
        >
          <div className="w-[150vw] h-[150vh] rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,1)_0%,_rgba(0,240,255,0.85)_30%,_rgba(56,189,248,0.3)_60%,_transparent_75%)] mix-blend-screen" />
        </motion.div>
      )}

      {/* 3. 4K Ultra-HD 3D WebGL Canvas Layer (Ultra Fast, Zero Lag) */}
      <div className="absolute inset-0 w-full h-full z-10">
        <Canvas
          dpr={[1, 1.75]} // 4K retina clamping for locked 60+ FPS
          camera={{ position: [0, 0.05, 1.85], fov: 36 }}
          gl={{
            antialias: true,
            alpha: true,
            stencil: false,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.16,
          }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Background Precompilation */}
          <PrecompilePipeline />

          {/* 4K Studio Lighting */}
          <StudioLighting />

          {/* Realistic PBR Environment Reflections */}
          <Environment preset="city" environmentIntensity={0.4} />

          {/* 4K Model with Face/Head Tracking & Electric Neck Glow */}
          <Suspense fallback={null}>
            <Model
              onPointerUpdate={(x, y) => {
                setMouseCoords({
                  x: Number(x.toFixed(2)),
                  y: Number(y.toFixed(2)),
                });
              }}
            />
          </Suspense>

          {/* OrbitControls */}
          <OrbitControls
            target={[0, 0.05, 0]}
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.7}
            minAzimuthAngle={-Math.PI / 3.5}
            maxAzimuthAngle={Math.PI / 3.5}
            dampingFactor={0.05}
            rotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* 4. Full-Screen Cyberpunk Coding Terminal Loader */}
      {shouldShowLoader && (
        <CyberAssemblyHUD
          progress={currentProgress}
          item={item}
          loaded={loaded}
          total={total}
          isManualTrigger={manualTrigger}
          onShake={setIsShaking}
          onComplete={handleComplete}
          onSkip={handleSkip}
        />
      )}

      {/* Corner Tech Brackets with Live Tracking Telemetry */}
      <div className="absolute top-24 sm:top-28 left-6 sm:left-12 pointer-events-none select-none z-20 hidden md:block">
        <div className="flex flex-col gap-1 text-[10px] font-mono text-[#38BDF8]/70 tracking-wider">
          <div className="flex items-center gap-1.5 text-[#38BDF8]">
            <span className="inline-block w-2 h-2 border-t-2 border-l-2 border-[#38BDF8]" />
            <span>EYE_GAZE & FACE // TRACKING</span>
          </div>
          <span className="text-[9px] text-[#94A3B8]/70 font-mono">
            TARGET_LOCK: [{mouseCoords.x >= 0 ? `+${mouseCoords.x}` : mouseCoords.x},{' '}
            {mouseCoords.y >= 0 ? `+${mouseCoords.y}` : mouseCoords.y}]
          </span>
        </div>
      </div>

      <div className="absolute top-24 sm:top-28 right-6 sm:right-12 pointer-events-none select-none z-20 hidden md:block text-right">
        <div className="flex flex-col gap-1 text-[10px] font-mono text-[#C084FC]/70 tracking-wider items-end">
          <div className="flex items-center gap-1.5 text-[#C084FC]">
            <span>ELECTRIC_NECK // GLOWING</span>
            <span className="inline-block w-2 h-2 border-t-2 border-r-2 border-[#C084FC]" />
          </div>
          <span className="text-[9px] text-[#94A3B8]/70 font-mono">4K ULTRA-HD // 60 FPS</span>
        </div>
      </div>

      {/* Interactive Control Hint Pill & Re-trigger Button */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col sm:flex-row items-center gap-3 select-none z-20">
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0D1527]/85 border border-[#38BDF8]/40 backdrop-blur-md text-[11px] font-mono text-[#8AE4FA] shadow-[0_0_25px_rgba(56,189,248,0.25)] pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
          <span className="tracking-wider">MOVE CURSOR FOR EYES & FACE FOCUS // DRAG TO ROTATE</span>
        </div>

        {/* Re-trigger Server Crash & Loading Button */}
        <button
          onClick={handleReplay}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#090D1A]/90 border border-[#38BDF8]/60 hover:border-[#00F0FF] hover:bg-[#38BDF8]/20 transition-all text-[11px] font-mono font-bold text-[#38BDF8] hover:text-[#FFFFFF] uppercase tracking-wider cursor-pointer shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]"
        >
          <span>⚡ RE-TRIGGER CRASH & LOAD</span>
        </button>
      </div>

      {/* Online Status HUD */}
      {showStatusLabel && (
        <div className="absolute right-4 sm:right-8 lg:right-20 top-20 sm:top-24 pointer-events-none select-none z-30">
          <div className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg bg-[#0F172A]/90 border border-[#38BDF8]/40 backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,0.25)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#8AE4FA] uppercase">
              MIA // 4K ONLINE
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MiaModel;
