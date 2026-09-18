'use client';

import React, { Suspense, useRef, useEffect, useLayoutEffect, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls, useTexture, Environment, useProgress } from '@react-three/drei';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { motion, AnimatePresence } from 'framer-motion';
import NightSkyBackground from './NightSkyBackground';
import ElectricBackgroundText from './ElectricBackgroundText';
import CyberAssemblyHUD from './CyberAssemblyHUD';
import HologramModelBuilder from './HologramModelBuilder';
import DaykanVoiceWidget from './DaykanVoiceWidget';
import DaykanVoiceManager, { VisemeFrame } from './DaykanVoiceManager';
import { useSmoothScroll } from '@/components/SmoothScroll';
import { useTheme } from '@/context/ThemeContext';

export interface MiaModelProps {
  className?: string;
  showStatusLabel?: boolean;
}

// -------------------------------------------------------------
// RESPONSIVE CAMERA & MODEL FRAMING ENGINE
// Seamlessly adapts the desktop baseline reference design to
// laptop, tablet landscape/portrait, and all mobile viewports.
// -------------------------------------------------------------
export function getResponsiveCameraConfig(width: number, height: number) {
  const aspect = width / (height || 1);

  // Desktop landscape (aspect >= 1.6): exact reference values
  if (aspect >= 1.6) {
    return {
      camDist: 1.92,
      camY: 0.08,
      targetY: 0.08,
      fov: 35,
      modelScale: 1.46,
      modelY: -4.26,
    };
  }

  // Smooth fluid interpolation between mobile portrait (aspect <= 0.5) and desktop (aspect >= 1.6)
  const t = Math.max(0, Math.min(1, (aspect - 0.5) / (1.6 - 0.5)));
  const smoothT = t * t * (3 - 2 * t);

  // Mobile portrait framing:
  // Elevates model and tightens distance to eliminate the large empty gap above the head
  // while preserving full head, face, eyes, hair, and cybernetic jacket framing.
  const camDist = THREE.MathUtils.lerp(2.22, 1.92, smoothT);
  const fov = THREE.MathUtils.lerp(37, 35, smoothT);
  const camY = THREE.MathUtils.lerp(0.06, 0.08, smoothT);
  const targetY = THREE.MathUtils.lerp(0.06, 0.08, smoothT);
  const modelScale = THREE.MathUtils.lerp(1.42, 1.46, smoothT);
  const modelY = THREE.MathUtils.lerp(-4.00, -4.26, smoothT);

  return { camDist, camY, targetY, fov, modelScale, modelY };
}

function ResponsiveCameraRig({ orbitRef }: { orbitRef: React.RefObject<any> }) {
  const { camera, size, gl } = useThree();

  useLayoutEffect(() => {
    if (!size.width || !size.height) return;
    const config = getResponsiveCameraConfig(size.width, size.height);
    const persCam = camera as THREE.PerspectiveCamera;

    if (persCam.isPerspectiveCamera) {
      persCam.fov = config.fov;
      persCam.position.set(0, config.camY, config.camDist);
      persCam.updateProjectionMatrix();
    }

    if (orbitRef.current) {
      orbitRef.current.target.set(0, config.targetY, 0);
      orbitRef.current.update();
    }
  }, [camera, size.width, size.height, orbitRef]);

  // Guarantee mobile browser can ALWAYS perform native vertical page scrolling over the 3D canvas
  useEffect(() => {
    const canvas = gl?.domElement;
    if (!canvas) return;

    canvas.style.touchAction = 'pan-y';
    canvas.style.setProperty('touch-action', 'pan-y', 'important');

    const observer = new MutationObserver(() => {
      if (canvas.style.touchAction !== 'pan-y') {
        canvas.style.setProperty('touch-action', 'pan-y', 'important');
      }
    });

    observer.observe(canvas, { attributes: true, attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, [gl]);

  return null;
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

// 4K Studio Lighting Rig - Soft Flattering Beauty Rig with Rim Lights
function StudioLighting() {
  return (
    <>
      {/* Atmosphere Fog */}
      <fog attach="fog" args={['#070A14', 3.2, 7.5]} />

      {/* Ambient Fill */}
      <ambientLight intensity={0.9} color="#D8E8F8" />

      {/* Key Light (Soft Electric Sky Blue on Face - 4K High Quality) */}
      <directionalLight
        position={[2.2, 2.8, 2.5]}
        intensity={2.3}
        color="#BAE6FD"
      />

      {/* Fill Light (Soft Lavender Blue) */}
      <directionalLight
        position={[-2.5, 1.8, 2.2]}
        intensity={1.5}
        color="#C7D2FE"
      />

      {/* Hair Silhouette & Rim Light - Highlights high-volume hair crown & shoulders */}
      <directionalLight
        position={[0, 3.4, -2.4]}
        intensity={3.5}
        color="#38BDF8"
      />

      {/* Front Soft Beauty Fill - Enhances eyes & lips without harsh blown-out glare */}
      <pointLight
        position={[0, 0.35, 1.9]}
        intensity={0.8}
        color="#F8FAFC"
      />
    </>
  );
}

// -------------------------------------------------------------
// CYBERNETIC EARPHONE WITH DYNAMIC ELECTRICITY GLOW EFFECT
// -------------------------------------------------------------
function CyberEarphone({ headBone }: { headBone?: THREE.Bone }) {
  const earphoneRef = useRef<THREE.Group>(null);
  const coreLightRef = useRef<THREE.PointLight>(null);
  const coreMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const arcMatRef = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(() => {
    if (!headBone || !earphoneRef.current) return;
    const group = earphoneRef.current;
    headBone.add(group);
    return () => {
      if (headBone && group) {
        headBone.remove(group);
      }
    };
  }, [headBone]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const tau = t % 3.0;

    // Electric pulse synchronized with neck & face circuit animation
    let power = 1.0;
    if (tau < 0.16) {
      // Rapid lightning strikes
      const s1 = (tau >= 0.02 && tau < 0.06) ? 2.8 : 0.4;
      const s2 = (tau >= 0.09) ? 3.4 : 0.0;
      power = Math.max(s1, s2);
    } else if (tau < 1.45) {
      // Flowing electric sine wave
      power = 1.8 + Math.sin(t * 8.0) * 0.5;
    } else if (tau < 1.95) {
      // Gradual decay
      const fade = (1.95 - tau) / 0.50;
      power = Math.max(0.3, fade * 1.6);
    } else if (tau < 2.85) {
      // Standby idle hum
      power = 0.4 + Math.sin(t * 3.5) * 0.15;
    } else {
      // Recharge surge
      power = 0.5 + ((tau - 2.85) / 0.15) * 1.5;
    }

    // Micro electric jitter & sparks
    const jitter = Math.sin(t * 55.0) * Math.sin(t * 80.0) * 0.18;
    const totalPower = Math.max(0.2, power + jitter);

    if (coreLightRef.current) {
      coreLightRef.current.intensity = totalPower * 3.5;
    }
    if (coreMatRef.current) {
      coreMatRef.current.emissiveIntensity = totalPower * 4.2;
    }
    if (arcMatRef.current) {
      arcMatRef.current.opacity = Math.min(1.0, 0.35 + totalPower * 0.45);
    }
  });

  return (
    <group
      ref={earphoneRef}
      name="CyberEarphone_Right"
      position={[6.85, 1.40, -7.35]}
      rotation={[0.15, -0.15, 0.08]}
      scale={1.0}
    >
      {/* 1. Outer Brushed Titanium Earphone Chassis */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.75, 0.88, 0.45, 32]} />
        <meshStandardMaterial
          color="#0A0E17"
          roughness={0.22}
          metalness={0.92}
        />
      </mesh>

      {/* 2. Chamfered Chrome Outer Bezel Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.22]}>
        <torusGeometry args={[0.78, 0.09, 16, 32]} />
        <meshStandardMaterial
          color="#1E293B"
          roughness={0.15}
          metalness={0.95}
        />
      </mesh>

      {/* 3. Cybernetic Cartilage Clip / Helix Ear Hook */}
      <mesh position={[0.45, 0.65, 0.05]} rotation={[0.4, 0.3, -0.6]}>
        <torusGeometry args={[0.95, 0.07, 12, 32, Math.PI * 0.75]} />
        <meshStandardMaterial
          color="#0F172A"
          roughness={0.18}
          metalness={0.92}
        />
      </mesh>

      {/* 4. Acoustic Transducer Hub (Center Titanium Cap) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.24]}>
        <cylinderGeometry args={[0.32, 0.35, 0.12, 24]} />
        <meshStandardMaterial
          color="#050811"
          roughness={0.3}
          metalness={0.85}
        />
      </mesh>

      {/* 5. Glowing Electric Energy Core LED Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.26]}>
        <ringGeometry args={[0.38, 0.68, 32]} />
        <meshStandardMaterial
          ref={coreMatRef}
          color="#00F0FF"
          emissive="#00E5FF"
          emissiveIntensity={3.5}
          roughness={0.1}
          metalness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 6. Glowing Electricity Arc Ring (Hovering Plasma Halo) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.28]}>
        <ringGeometry args={[0.70, 0.76, 32]} />
        <meshBasicMaterial
          ref={arcMatRef}
          color="#38BDF8"
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 7. Neural Stream Antenna / Comms Fin */}
      <mesh position={[-0.2, -0.75, -0.15]} rotation={[0, 0, 0.25]}>
        <boxGeometry args={[0.18, 0.95, 0.12]} />
        <meshStandardMaterial
          color="#0F172A"
          roughness={0.25}
          metalness={0.88}
        />
      </mesh>

      {/* 8. Active Indicator Light on Comms Fin */}
      <mesh position={[-0.2, -1.05, -0.22]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color="#00F0FF" />
      </mesh>

      {/* Dynamic Electric Point Light - Radiates electric cyan onto ear, cheek & hair */}
      <pointLight
        ref={coreLightRef}
        color="#00F0FF"
        distance={4.5}
        intensity={3.2}
        position={[0, 0, -0.6]}
      />
    </group>
  );
}

// -------------------------------------------------------------
// 3D MIA MODEL WITH 4K RENDERING & ELECTRIC NECK GLOW
// -------------------------------------------------------------
export type HairstyleId = 'flowing' | 'bun' | 'undercut';

interface CharacterFaceBones {
  head?: THREE.Bone;
  neckUpper?: THREE.Bone;
  neckLower?: THREE.Bone;
  leftEye?: THREE.Bone;
  rightEye?: THREE.Bone;
  rightHand?: THREE.Bone;
  leftHand?: THREE.Bone;
  rightUpperArm?: THREE.Bone;
  leftUpperArm?: THREE.Bone;
}

interface BaseBoneRotations {
  head?: THREE.Euler;
  headQuat?: THREE.Quaternion;
  neckUpper?: THREE.Euler;
  neckUpperQuat?: THREE.Quaternion;
  neckLower?: THREE.Euler;
  leftEye?: THREE.Euler;
  rightEye?: THREE.Euler;
}

interface EyeTrackingCalibration {
  leftRestQuat: THREE.Quaternion;
  rightRestQuat: THREE.Quaternion;
  leftRestFwdInHead: THREE.Vector3;
  rightRestFwdInHead: THREE.Vector3;
}

const Model = React.memo(function Model({
  onPointerUpdate,
  hairstyle = 'flowing',
  onReady,
}: {
  onPointerUpdate?: (x: number, y: number) => void;
  hairstyle?: HairstyleId;
  onReady?: () => void;
}) {
  const { size, camera, gl } = useThree();
  const group = useRef<THREE.Group>(null);
  const bonesRef = useRef<CharacterFaceBones>({});
  const baseRotationsRef = useRef<BaseBoneRotations>({});
  const eyeCalibrationRef = useRef<EyeTrackingCalibration | null>(null);
  const skinHeadMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const neckLightRef = useRef<THREE.PointLight | null>(null);
  const [headBone, setHeadBone] = useState<THREE.Bone | null>(null);
  const hasSignaledReadyRef = useRef(false);

  const uniformsRef = useRef<{ uTime: { value: number } }>({
    uTime: { value: 0 },
  });

  const hairMeshesRef = useRef<{
    undercutScalp?: THREE.Mesh;
    undercutHair?: THREE.Mesh;
    samuraiBun?: THREE.Mesh;
    halfUpHair?: THREE.Mesh;
    halfUpHairSecondary?: THREE.Mesh;
    halfUpScalp?: THREE.Mesh;
  }>({});

  // Quaternion refs for smooth, jitter-free 3D gaze tracking
  const currentLeftQuatRef = useRef(new THREE.Quaternion());
  const currentRightQuatRef = useRef(new THREE.Quaternion());

  // Subtle, delayed head and neck following state refs
  const currentHeadYawRef = useRef(0);
  const currentHeadPitchRef = useRef(0);
  const currentNeckYawRef = useRef(0);
  const currentNeckPitchRef = useRef(0);
  const tempHeadEulerRef = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const tempHeadDeltaQRef = useRef(new THREE.Quaternion());
  const tempNeckDeltaQRef = useRef(new THREE.Quaternion());

  // Real-time speech & viseme lip sync state
  const visemeStateRef = useRef<VisemeFrame>({
    viseme: 'REST',
    weight: 0,
    jawOpen: 0,
    lipRound: 0,
    lipWidth: 0,
    lipClosure: 0,
    lipPress: 0,
    smile: 0,
    isPause: true,
    word: '',
    phraseType: 'REST',
  });
  const morphDampedWeightsRef = useRef<Record<number, number>>({});
  const speechHeadYawRef = useRef(0);
  const speechHeadPitchRef = useRef(0);

  useEffect(() => {
    const unsub = DaykanVoiceManager.getInstance().subscribeViseme((frame) => {
      visemeStateRef.current = frame;
    });
    return unsub;
  }, []);

  // Cached math objects to prevent garbage collection allocations in useFrame
  const raycasterRef = useRef(new THREE.Raycaster());
  const targetPlaneRef = useRef(new THREE.Plane());
  const identityQuatRef = useRef(new THREE.Quaternion());
  const tempCamFwdRef = useRef(new THREE.Vector3());
  const tempPlaneNormalRef = useRef(new THREE.Vector3());
  const tempPlanePointRef = useRef(new THREE.Vector3());
  const tempTarget3DRef = useRef(new THREE.Vector3());
  const tempTargetCamRef = useRef(new THREE.Vector3());
  const tempEyeCenterRef = useRef(new THREE.Vector3());
  const tempEyeCenterCamRef = useRef(new THREE.Vector3());
  const tempLeftEyePosRef = useRef(new THREE.Vector3());
  const tempRightEyePosRef = useRef(new THREE.Vector3());
  const tempHeadWorldQuatRef = useRef(new THREE.Quaternion());
  const tempInvHeadQuatRef = useRef(new THREE.Quaternion());
  const tempGazeWorldRef = useRef(new THREE.Vector3());
  const tempGazeHeadRef = useRef(new THREE.Vector3());
  const tempDeltaQRef = useRef(new THREE.Quaternion());
  const tempTargetQuatRef = useRef(new THREE.Quaternion());
  const tempNdcRef = useRef(new THREE.Vector2());

  const pointerTargetRef = useRef({ x: 0, y: 0, isHovered: false });
  const scrollGazeOffsetRef = useRef(0);
  const prevPointerRef = useRef({ x: 0, y: 0 });
  const pointerVelocityRef = useRef(0);
  const tempHeadGazeDirRef = useRef(new THREE.Vector3());
  const headWorldPosRef = useRef(new THREE.Vector3());
  const handWorldPosRef = useRef(new THREE.Vector3());
  const eyelashMeshRef = useRef<THREE.Mesh | null>(null);
  const blinkTimerRef = useRef({
    nextBlinkTime: 3.0,
    isBlinking: false,
    blinkProgress: 0,
  });

  // Unified pointer, touch & scroll tracking with mobile gesture intent detection
  useEffect(() => {
    const canvas = gl?.domElement;

    const updateCoords = (clientX: number, clientY: number) => {
      const x = (clientX / window.innerWidth) * 2 - 1;
      const y = -((clientY / window.innerHeight) * 2 - 1);
      pointerTargetRef.current = { x, y, isHovered: true };
    };

    // Desktop pointer tracking (mouse only) - preserves 100% desktop mouse experience
    const handlePointerMoveDesktop = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      updateCoords(e.clientX, e.clientY);
    };

    const handlePointerLeave = () => {
      pointerTargetRef.current = { x: 0, y: 0, isHovered: false };
    };

    const handleBlur = () => {
      pointerTargetRef.current = { x: 0, y: 0, isHovered: false };
    };

    // Gesture state for mobile touch / stylus devices
    const touchGestureState = {
      pointerId: null as number | null,
      startX: 0,
      startY: 0,
      startTime: 0,
      intent: 'undecided' as 'undecided' | 'scroll' | 'model',
      isOverModel: false,
      captured: false,
    };

    // Touch pointerdown: check whether touch starts directly on Daykan or empty hero space
    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') {
        updateCoords(e.clientX, e.clientY);
        return;
      }

      // Check if touch is directly on the Daykan 3D model
      let isOverModel = false;
      if (canvas && camera && group.current) {
        const rect = canvas.getBoundingClientRect();
        const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        tempNdcRef.current.set(ndcX, ndcY);
        raycasterRef.current.setFromCamera(tempNdcRef.current, camera);
        const hits = raycasterRef.current.intersectObjects(group.current.children, true);
        const hasMeshHit = hits.some(
          (h) => h.object.visible && !(h.object as any).isPoints
        );

        // Daykan interactive bust zone on mobile (centered head & chest)
        const inBustZone = Math.abs(ndcX) < 0.42 && ndcY > -0.65 && ndcY < 0.82;
        isOverModel = hasMeshHit || inBustZone;
      }

      touchGestureState.pointerId = e.pointerId;
      touchGestureState.startX = e.clientX;
      touchGestureState.startY = e.clientY;
      touchGestureState.startTime = performance.now();
      touchGestureState.intent = isOverModel ? 'undecided' : 'scroll';
      touchGestureState.isOverModel = isOverModel;
      touchGestureState.captured = false;

      // Note: If touch starts on empty Hero space (isOverModel === false),
      // intent is immediately 'scroll'. Browser will handle native page scrolling without touching model.
    };

    // Touch pointermove: evaluate gesture intent before deciding whether to scroll or move Daykan
    const handlePointerMoveTouch = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      if (touchGestureState.pointerId !== e.pointerId) return;

      const deltaX = e.clientX - touchGestureState.startX;
      const deltaY = e.clientY - touchGestureState.startY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      const dist = Math.hypot(deltaX, deltaY);
      const elapsed = performance.now() - touchGestureState.startTime;

      if (touchGestureState.intent === 'undecided') {
        const GESTURE_THRESHOLD = 10; // px
        if (dist < GESTURE_THRESHOLD) {
          // Check for deliberate press/hold on Daykan before dragging (> 220ms)
          if (elapsed > 220 && touchGestureState.isOverModel) {
            touchGestureState.intent = 'model';
          } else {
            return; // Still undecided: do not move model, let browser determine scroll
          }
        } else {
          // Movement threshold crossed: evaluate gesture direction
          if (absY > absX * 1.15 && elapsed < 260) {
            // Predominantly vertical swipe: normal page scroll gesture!
            touchGestureState.intent = 'scroll';
            return;
          } else if (touchGestureState.isOverModel) {
            // Horizontal or intentional manipulation on model
            touchGestureState.intent = 'model';
          } else {
            touchGestureState.intent = 'scroll';
            return;
          }
        }
      }

      if (touchGestureState.intent === 'scroll') {
        // Native page scroll: Daykan does not move!
        return;
      }

      if (touchGestureState.intent === 'model') {
        // User intentionally interacting with model: capture pointer and update Daykan
        if (!touchGestureState.captured && canvas) {
          try {
            canvas.setPointerCapture(e.pointerId);
            touchGestureState.captured = true;
          } catch {
            // Pointer capture fallback
          }
        }

        updateCoords(e.clientX, e.clientY);
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    // Pointer up or cancel: release capture and cleanly reset gesture state
    const handlePointerUpOrCancel = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') {
        pointerTargetRef.current = { x: 0, y: 0, isHovered: false };
        return;
      }

      if (touchGestureState.pointerId === e.pointerId) {
        if (touchGestureState.captured && canvas) {
          try {
            canvas.releasePointerCapture(e.pointerId);
          } catch {
            // Pointer release fallback
          }
        }

        if (touchGestureState.intent === 'model') {
          pointerTargetRef.current = { x: 0, y: 0, isHovered: false };
        }

        touchGestureState.pointerId = null;
        touchGestureState.intent = 'undecided';
        touchGestureState.isOverModel = false;
        touchGestureState.captured = false;
      }
    };

    // Smooth subtle gaze adjustment when page scrolls down on both mobile and desktop
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const heroH = window.innerHeight || 800;
      if (scrollY > 0 && scrollY < heroH * 1.5) {
        const ratio = Math.min(1, scrollY / heroH);
        scrollGazeOffsetRef.current = -ratio * 0.42; // Natural downward glance towards incoming content
      } else {
        scrollGazeOffsetRef.current = 0;
      }
    };

    window.addEventListener('pointermove', handlePointerMoveDesktop, { passive: true });
    window.addEventListener('pointermove', handlePointerMoveTouch, { passive: false });
    if (canvas) {
      canvas.addEventListener('pointerdown', handlePointerDown, { passive: true });
    }
    window.addEventListener('pointerup', handlePointerUpOrCancel, { passive: true });
    window.addEventListener('pointercancel', handlePointerUpOrCancel, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('pointermove', handlePointerMoveDesktop);
      window.removeEventListener('pointermove', handlePointerMoveTouch);
      if (canvas) {
        canvas.removeEventListener('pointerdown', handlePointerDown);
      }
      window.removeEventListener('pointerup', handlePointerUpOrCancel);
      window.removeEventListener('pointercancel', handlePointerUpOrCancel);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('blur', handleBlur);
    };
  }, [camera, gl]);

  // Load GLTF model, custom head beauty diffuse map, smoothed normal map, neck emissive map, and eye maps
  const { scene, animations } = useGLTF('/models/mia.glb', true, true, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
  const neckEmissiveMap = useTexture('/models/neck_emissive.png?v=7');
  const headDiffuseMap = useTexture('/models/head_diffuse.png?v=8');
  const headNormalMap = useTexture('/models/head_normal.png?v=6');
  const eyeDiffuseMap = useTexture('/models/eye_diffuse.png?v=3');
  const eyeNormalMap = useTexture('/models/eye_normal.png?v=3');
  const hairSpecularMap = useTexture('/models/hair_specular.png');
  const scalpDiffuseMap = useTexture('/models/scalp_diffuse.png');

  useEffect(() => {
    // Optimized texture setup with GPU-friendly settings
    const configureTexture = (tex: THREE.Texture, colorSpace: THREE.ColorSpace) => {
      tex.flipY = false;
      tex.colorSpace = colorSpace;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.anisotropy = 4; // Balance between quality and GPU cost
      tex.needsUpdate = true;
    };

    if (neckEmissiveMap) {
      configureTexture(neckEmissiveMap, THREE.SRGBColorSpace);
    }
    if (eyeDiffuseMap) {
      configureTexture(eyeDiffuseMap, THREE.SRGBColorSpace);
    }
    if (eyeNormalMap) {
      configureTexture(eyeNormalMap, THREE.LinearSRGBColorSpace);
    }
    if (hairSpecularMap) {
      configureTexture(hairSpecularMap, THREE.LinearSRGBColorSpace);
    }
    if (scalpDiffuseMap) {
      configureTexture(scalpDiffuseMap, THREE.SRGBColorSpace);
    }
  }, [neckEmissiveMap, eyeDiffuseMap, eyeNormalMap, hairSpecularMap, scalpDiffuseMap]);

  const headMeshRef = useRef<THREE.Mesh | null>(null);

  // Filter out animations that raise hand to head/hair/forehead (ADJUST_HAIR, CYBER_TOUCH)
  // while preserving all natural idle hand movements, subtle arm repositioning, body motion, and walk stride.
  // Also filter morph target eyelid blink tracks and eye bone tracks so eyes stay completely static and focused.
  const filteredAnimations = useMemo(() => {
    const FORBIDDEN_GESTURE_KEYWORDS = [
      'adjust_hair',
      'cyber_touch',
      'scratch',
      'hair',
      'head_touch',
      'touch_head',
    ];

    return animations
      .filter((clip) => {
        const lowerName = clip.name.toLowerCase();
        return !FORBIDDEN_GESTURE_KEYWORDS.some((kw) => lowerName.includes(kw));
      })
      .map((clip) => {
        const cloned = clip.clone();
        cloned.tracks = cloned.tracks.filter((track) => {
          const tname = track.name.toLowerCase();
          const isEyeTrack = tname.includes('eye');
          const isMorphTrack =
            tname.includes('morphtarget') ||
            tname.includes('target_') ||
            tname.includes('weights');
          const isHeadOrNeck =
            tname.includes('head') ||
            tname.includes('necktwist02') ||
            tname.includes('neck_02');
          return !isEyeTrack && !isMorphTrack && !isHeadOrNeck;
        });
        return cloned;
      });
  }, [animations]);

  const { actions, names } = useAnimations(filteredAnimations, group);
  const activeActionRef = useRef<THREE.AnimationAction | null>(null);

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

      // 1. Hide lower body parts not in the photo and GLTF eye occlusion meshes
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
        childName.includes('eye_occlusion') ||
        childName.includes('tearline') ||
        child.name === 'Object_10' || // Std_Tearline_R
        child.name === 'Object_11' || // Std_Tearline_L
        child.name === 'Object_12' || // Std_Eye_Occlusion_R (covers eyeballs in GLTF)
        child.name === 'Object_13' || // Std_Eye_Occlusion_L (covers eyeballs in GLTF)
        child.name === '10' ||
        child.name === '11' ||
        child.name === '12' ||
        child.name === '13' ||
        childName.includes('cyberwear') ||
        child.name === 'Object_19' ||
        child.name === 'Object_21' ||
        child.name === 'Object_22' ||
        child.name === 'Object_23' ||
        child.name === 'Object_24' ||
        child.name === 'Object_25' ||
        child.name === 'Object_56' || // Undercut Scalp - buzzcut mesh that covered forehead in chocolate tone
        child.name === 'Object_57' || // Undercut Hair
        child.name === 'Object_59'    // Samurai Bun
      ) {
        child.visible = false;
        child.castShadow = false;
        child.receiveShadow = false;
        return;
      }

      // 2. Crystal-Clear Eye Materials & Neon Ultra HD Materials
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

        materials.forEach((mat) => {
          if (!mat) return;
          const matName = mat.name || '';

          // Hide lower body materials & eye occlusion overlays
          if (
            matName.includes('Std_Skin_Leg') ||
            matName.includes('Loose_Biker_Boots') ||
            matName.includes('Leg_Wrap') ||
            matName.includes('Belt1') ||
            matName.includes('Suit1') ||
            matName.includes('songbird') ||
            matName.includes('Eye_Occlusion') ||
            matName.includes('Tearline')
          ) {
            child.visible = false;
            return;
          }

          // 2A. Crystal-Clear Realistic Eyeballs & Irises (Ga_Eye)
          if (matName.includes('Ga_Eye')) {
            const eyeMat = mat as THREE.MeshStandardMaterial;
            if (eyeDiffuseMap) {
              eyeDiffuseMap.colorSpace = THREE.SRGBColorSpace;
              eyeDiffuseMap.needsUpdate = true;
              eyeMat.map = eyeDiffuseMap;
            }
            if (eyeNormalMap) {
              eyeNormalMap.colorSpace = THREE.LinearSRGBColorSpace;
              eyeNormalMap.needsUpdate = true;
              eyeMat.normalMap = eyeNormalMap;
            }
            eyeMat.color = new THREE.Color('#FFFFFF');
            eyeMat.roughness = 0.08; // Glossy specular reflection on cornea
            eyeMat.metalness = 0.0;
            eyeMat.transparent = false;
            eyeMat.opacity = 1.0;
            eyeMat.depthWrite = true;
            eyeMat.depthTest = true;
            eyeMat.visible = true;
            eyeMat.needsUpdate = true;
            mesh.visible = true;
            mesh.renderOrder = 1;
          }

          // 2B. Ultra-HD Eyelashes (Std_Eyelash)
          if (matName.includes('Std_Eyelash') || matName.includes('Eyelash')) {
            const lashMat = mat as THREE.MeshStandardMaterial;
            lashMat.transparent = true;
            lashMat.alphaTest = 0.35;
            lashMat.depthWrite = true;
            lashMat.depthTest = true;
            lashMat.side = THREE.DoubleSide;
            lashMat.roughness = 0.3;
            lashMat.metalness = 0.05;
            lashMat.color = new THREE.Color('#0D0F14');
            if (lashMat.map) {
              lashMat.map.colorSpace = THREE.SRGBColorSpace;
              lashMat.map.needsUpdate = true;
            }
            lashMat.needsUpdate = true;
            mesh.visible = true;
            mesh.renderOrder = 3;
            eyelashMeshRef.current = mesh;
          }


          // 2B. Cybernetic Neck Electric Circuit Glowing Material & Shader FX
          if (matName.includes('Std_Skin_Head') || matName.includes('Skin_Head')) {
            const stdMat = mat as THREE.MeshStandardMaterial;
            stdMat.emissiveMap = neckEmissiveMap;
            stdMat.emissive = new THREE.Color('#0088FF');
            stdMat.emissiveIntensity = 2.4;
            stdMat.roughness = 0.52;
            stdMat.metalness = 0.02;

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
            headMeshRef.current = mesh;
            if (mesh.morphTargetInfluences) {
              mesh.morphTargetInfluences.fill(0);
            }
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

          // Cyberwear Head Implants - hide to preserve clean natural face
          if (matName.includes('Cyberwear_Head') || matName.includes('Cyberwear_Face')) {
            mesh.visible = false;
            return;
          }

          // Inner Collar & Trim Details
          if (matName.includes('Jacket6')) {
            const stdMat = mat as THREE.MeshStandardMaterial;
            stdMat.color = new THREE.Color('#0A0E17');
            stdMat.roughness = 0.32;
            stdMat.metalness = 0.45;
            stdMat.depthWrite = true;
            stdMat.transparent = false;
            stdMat.needsUpdate = true;
          }

          // 2C. Luxurious, Silky, Jet Black Hair & Natural Female Scalp Styling
          if (
            matName.includes('Hair_Transparency') ||
            matName.includes('Hair_2_Transparency') ||
            matName.includes('Hair_3_Transparency')
          ) {
            const hairMat = mat as THREE.MeshStandardMaterial;
            hairMat.transparent = true;
            hairMat.alphaTest = 0.06;
            hairMat.depthWrite = true;
            hairMat.depthTest = true;
            hairMat.side = THREE.DoubleSide; // Render both sides of each strand card
            hairMat.roughness = 0.26; // Silky specular reflections
            hairMat.metalness = 0.06;
            hairMat.color = new THREE.Color('#0C0B10'); // Deep obsidian black base

            // Track hair meshes by material
            if (matName.includes('Hair_3_Transparency')) {
              hairMeshesRef.current.undercutHair = mesh;
            } else if (matName.includes('Hair_2_Transparency')) {
              hairMeshesRef.current.samuraiBun = mesh;
            } else if (matName.includes('Hair_Transparency')) {
              hairMeshesRef.current.halfUpHair = mesh;
            }

            // Enhance strand density, feather hair roots at scalp, and add anisotropic specular sheen
            hairMat.onBeforeCompile = (shader) => {
              shader.uniforms.hairSpecularMap = { value: hairSpecularMap };
              shader.fragmentShader = `
                uniform sampler2D hairSpecularMap;
              ` + shader.fragmentShader;

              // Smooth root fade and strand micro-sheen
              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <map_fragment>',
                `
                #ifdef USE_MAP
                  vec4 hairSample = texture2D( map, vMapUv );

                  // 1. Natural female hairline root taper & soft card tip anti-aliasing:
                  // Softly feather strand roots and fine strand tips to eliminate rectangular card borders
                  float rootFade = smoothstep( 1.0, 0.88, vMapUv.y );
                  float tipFade = smoothstep( 0.0, 0.10, vMapUv.y );
                  hairSample.a *= mix( 0.50, 1.0, rootFade * tipFade );

                  // 2. Multi-Depth CGI Dark Obsidian / Espresso Hair Tone:
                  // Deep obsidian roots with silky espresso strand body and natural depth occlusion
                  float rootOcclusion = smoothstep(0.35, 0.92, vMapUv.y);
                  vec3 obsidianRoot = vec3(0.012, 0.010, 0.015);
                  vec3 espressoBody = vec3(0.050, 0.044, 0.054);
                  vec3 hairBase = mix(obsidianRoot, espressoBody, (1.0 - rootOcclusion * 0.60) * hairSample.r);

                  // Micro-strand optical striation: creates subtle strand separation across the hair card
                  float strandVariation = sin(vMapUv.x * 65.0) * 0.07 + 0.93;
                  hairBase *= strandVariation;

                  // 3. Subtle Futuristic Electric-Blue / Cyan Specular Rim Highlights
                  // Soft velvety grazing shimmer across strand contours without plastic shine
                  vec3 viewD = normalize( -vViewPosition );
                  vec3 normD = normalize( vNormal );
                  float grazing = pow( 1.0 - clamp( dot( normD, viewD ), 0.0, 1.0 ), 3.8 );
                  vec3 electricCyanGlint = vec3(0.015, 0.18, 0.32) * grazing * hairSample.r * 0.75;

                  hairSample.rgb = hairBase + electricCyanGlint;
                  diffuseColor *= hairSample;
                #endif
                `
              );

              // 4. Strand-aligned Anisotropic Specular Highlights (Kajiya-Kay / Marschner style)
              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <roughnessmap_fragment>',
                `
                #include <roughnessmap_fragment>
                #ifdef USE_MAP
                  vec4 strandSpec = texture2D( hairSpecularMap, vMapUv );
                  // Modulate roughness along strand lines for silky anisotropic reflections
                  roughnessFactor = mix(0.20, 0.36, 1.0 - strandSpec.r);
                #endif
                `
              );
            };
            hairMat.needsUpdate = true;
          }

          if (matName.includes('Scalp_2_Transparency')) {
            const scalpMat = mat as THREE.MeshStandardMaterial;
            hairMeshesRef.current.halfUpScalp = mesh;
            if (scalpDiffuseMap) {
              scalpDiffuseMap.colorSpace = THREE.SRGBColorSpace;
              scalpDiffuseMap.needsUpdate = true;
              scalpMat.map = scalpDiffuseMap;
            }
            scalpMat.transparent = true;
            scalpMat.depthWrite = false;
            scalpMat.depthTest = true;
            scalpMat.opacity = 0.95;
            scalpMat.alphaTest = 0.01;
            scalpMat.side = THREE.FrontSide;
            scalpMat.roughness = 0.55;
            scalpMat.metalness = 0.02;
            scalpMat.color = new THREE.Color('#0A090D'); // Rich dark espresso black matching hair roots

            scalpMat.onBeforeCompile = (shader) => {
              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <map_fragment>',
                `
                #ifdef USE_MAP
                  vec4 scalpTex = texture2D( map, vMapUv );
                  // Smooth organic feathering curve for scalp edge:
                  // softly transitions baby hairs into the forehead skin without hard polygon cuts
                  float feather = smoothstep(0.04, 0.50, scalpTex.a);
                  scalpTex.a = feather;
                  scalpTex.rgb = vec3(0.035, 0.030, 0.040);
                  diffuseColor *= scalpTex;
                #endif
                `
              );
            };
            scalpMat.needsUpdate = true;
            mesh.renderOrder = 1;
          }

          if (matName.includes('Scalp_3_Transparency')) {
            const scalpMat = mat as THREE.MeshStandardMaterial;
            hairMeshesRef.current.undercutScalp = mesh;
            scalpMat.visible = false;
            scalpMat.opacity = 0.0;
            scalpMat.transparent = true;
            scalpMat.needsUpdate = true;
          }
        });

        // Track hair mesh instances for live style switching
        if (child.name === 'Object_56' || child.name === 'mesh_32') hairMeshesRef.current.undercutScalp = child as THREE.Mesh;
        if (child.name === 'Object_57' || child.name === 'mesh_33') hairMeshesRef.current.undercutHair = child as THREE.Mesh;
        if (child.name === 'Object_59' || child.name === 'mesh_34') hairMeshesRef.current.samuraiBun = child as THREE.Mesh;
        if (child.name === 'Object_62' || child.name === 'mesh_36') hairMeshesRef.current.halfUpScalp = child as THREE.Mesh;

        // Front / Top Hair: Organic volume elevation and layered strand refinement
        if ((child.name === 'Object_61' || child.name === 'mesh_35') && (child as THREE.Mesh).isMesh) {
          const halfUpMesh = child as THREE.Mesh;
          hairMeshesRef.current.halfUpHair = halfUpMesh;

          if (!halfUpMesh.userData.hasFrontHairVolumeApplied) {
            halfUpMesh.userData.hasFrontHairVolumeApplied = true;

            const geo = halfUpMesh.geometry.clone();
            const pos = geo.attributes.position;
            const uv = geo.attributes.uv;

            for (let i = 0; i < pos.count; i++) {
              const x = pos.getX(i);
              const y = pos.getY(i);
              const z = pos.getZ(i);
              const v = uv ? uv.getY(i) : 0;

              const dX = Math.abs(x - 6721);
              // Lateral falloff: maintains broad feminine crown dome (dX up to 240) then softly tapers into sides (dX 440)
              const latFactor = 1.0 - THREE.MathUtils.smoothstep(dX, 240, 440);
              // Front/top crown region: rises smoothly from mid-head to front scalp
              const frontZFactor = THREE.MathUtils.smoothstep(z, 900, 1450);
              // Hairline anchor: softly tapers right at forehead edge so hairline remains locked to scalp
              const hairlineTaper = 1.0 - THREE.MathUtils.smoothstep(z, 2220, 2370) * 0.75;
              const zFactor = frontZFactor * hairlineTaper;
              // Root anchor: anchors actual scalp insertion (v > 0.92) while releasing strand body for soft feminine volume
              const rootAnchor = 1.0 - THREE.MathUtils.smoothstep(v, 0.90, 0.99);
              const volumeWeight = latFactor * zFactor * rootAnchor;

              if (volumeWeight > 0.005) {
                // Strand group clustering: creates natural layered locks with depth channels between them
                const strandCluster = Math.sin(x * 0.032 + z * 0.024);
                const clusterVolume = 1.0 + strandCluster * 0.18; // +/- 18% depth variation between locks

                // Rounded feminine crown dome (convex cosine profile across top, eliminating sharp mohawk ridge)
                const domeFactor = Math.cos(Math.min(1.0, dX / 360) * Math.PI * 0.45);
                const baseLiftY = (90.0 + 34.0 * THREE.MathUtils.smoothstep(z, 1300, 2050)) * volumeWeight * domeFactor;
                const liftY = baseLiftY * clusterVolume;

                const archZ = (46.0 + strandCluster * 8.0) * volumeWeight * THREE.MathUtils.smoothstep(z, 1150, 1950) * (1.0 - THREE.MathUtils.smoothstep(z, 2050, 2350) * 0.55);
                const signX = (x >= 6721) ? 1.0 : -1.0;
                const spreadX = signX * 22.0 * volumeWeight * THREE.MathUtils.smoothstep(dX, 50, 360);

                // Feminine side-swept flow and soft organic strand drape
                const sideSweep = 24.0 * volumeWeight * THREE.MathUtils.smoothstep(z, 1100, 2150);
                const lockCurlX = Math.sin(y * 0.016 + z * 0.012) * 10.0 * volumeWeight;
                const lockCurlY = Math.cos(x * 0.012 + z * 0.014) * 8.0 * volumeWeight;

                pos.setXYZ(i, x + spreadX + sideSweep + lockCurlX, y + liftY + lockCurlY, z + archZ);
              }
            }
            geo.computeVertexNormals();
            halfUpMesh.geometry = geo;

            // Secondary layered strand mesh: delicate feminine wisps, soft fringe layering & strand separation
            if ((halfUpMesh as THREE.SkinnedMesh).isSkinnedMesh && halfUpMesh.parent) {
              const skinnedHalfUp = halfUpMesh as THREE.SkinnedMesh;
              const secGeo = halfUpMesh.geometry.clone();
              const secPos = secGeo.attributes.position;
              const secUv = secGeo.attributes.uv;

              for (let i = 0; i < secPos.count; i++) {
                const x = secPos.getX(i);
                const y = secPos.getY(i);
                const z = secPos.getZ(i);
                const v = secUv ? secUv.getY(i) : 0;

                const dX = Math.abs(x - 6721);
                const secLatFactor = 1.0 - THREE.MathUtils.smoothstep(dX, 220, 420);
                const frontZFactor = THREE.MathUtils.smoothstep(z, 980, 1500);
                const hairlineTaper = 1.0 - THREE.MathUtils.smoothstep(z, 2200, 2370) * 0.80;
                const rootAnchor = 1.0 - THREE.MathUtils.smoothstep(v, 0.88, 0.98);
                const secWeight = secLatFactor * frontZFactor * hairlineTaper * rootAnchor;

                if (secWeight > 0.008) {
                  const secCluster = Math.sin(x * 0.028 - z * 0.03);
                  const secDome = Math.cos(Math.min(1.0, dX / 340) * Math.PI * 0.45);
                  const secLiftY = (36.0 + 14.0 * THREE.MathUtils.smoothstep(z, 1300, 2050)) * secWeight * secDome * (1.0 + secCluster * 0.20);
                  const secArchZ = 24.0 * secWeight * THREE.MathUtils.smoothstep(z, 1200, 2000);
                  const secSideSweep = 28.0 * secWeight * THREE.MathUtils.smoothstep(z, 1100, 2150);
                  const secFlowX = secSideSweep + (Math.sin(x * 0.014 + y * 0.02) * 12.0 + secCluster * 6.0) * secWeight;
                  secPos.setXYZ(i, x + secFlowX, y + secLiftY, z + secArchZ);
                }
              }
              secGeo.computeVertexNormals();

              const secMat = Array.isArray(halfUpMesh.material)
                ? halfUpMesh.material[0].clone()
                : (halfUpMesh.material as THREE.Material).clone();
              if ((secMat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
                const stdSecMat = secMat as THREE.MeshStandardMaterial;
                stdSecMat.roughness = 0.25;
                stdSecMat.alphaTest = 0.12;
                stdSecMat.needsUpdate = true;
              }

              const secMesh = skinnedHalfUp.clone();
              secMesh.name = 'HalfUpHair_Secondary_Layer';
              secMesh.geometry = secGeo;
              secMesh.material = secMat;
              secMesh.skeleton = skinnedHalfUp.skeleton;
              secMesh.bind(skinnedHalfUp.skeleton, skinnedHalfUp.bindMatrix);
              secMesh.renderOrder = 4;
              secMesh.frustumCulled = false;

              if (skinnedHalfUp.parent) {
                skinnedHalfUp.parent.add(secMesh);
              }
              hairMeshesRef.current.halfUpHairSecondary = secMesh;
            }
          }
        }
      }

      // 3. Identify Head and Neck bones
      if ((child as THREE.Bone).isBone) {
        const bone = child as THREE.Bone;
        const name = bone.name;

        if (name.includes('Head') || name.toLowerCase().includes('head')) {
          foundBones.head = bone;
          baseRotations.head = bone.rotation.clone();
          baseRotations.headQuat = bone.quaternion.clone();
          setHeadBone(bone);
        } else if (name.includes('NeckTwist02') || name.includes('Neck_02')) {
          foundBones.neckUpper = bone;
          baseRotations.neckUpper = bone.rotation.clone();
          baseRotations.neckUpperQuat = bone.quaternion.clone();

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
        } else if (name.includes('L_Eye') || name.includes('Eye_048')) {
          foundBones.leftEye = bone;
          baseRotations.leftEye = bone.rotation.clone();
        } else if (name.includes('R_Eye') || name.includes('Eye_047')) {
          foundBones.rightEye = bone;
          baseRotations.rightEye = bone.rotation.clone();
        } else if (name.includes('R_Hand') || name.toLowerCase().includes('r_hand')) {
          foundBones.rightHand = bone;
        } else if (name.includes('L_Hand') || name.toLowerCase().includes('l_hand')) {
          foundBones.leftHand = bone;
        } else if (name.includes('R_Upperarm') && !name.includes('Twist')) {
          foundBones.rightUpperArm = bone;
        } else if (name.includes('L_Upperarm') && !name.includes('Twist')) {
          foundBones.leftUpperArm = bone;
        }
      }
    });

    bonesRef.current = foundBones;
    baseRotationsRef.current = baseRotations;

    // Ground-truth anatomical calibration for eye line-of-sight tracking
    if (foundBones.leftEye && foundBones.rightEye) {
      // The natural optical axis in bone local space is (0, -1, 0)
      // because bind pose rotation has Euler _x = -PI / 2
      const boneLocalFwd = new THREE.Vector3(0, -1, 0);
      const lQuat = foundBones.leftEye.quaternion.clone();
      const rQuat = foundBones.rightEye.quaternion.clone();
      eyeCalibrationRef.current = {
        leftRestQuat: lQuat,
        rightRestQuat: rQuat,
        leftRestFwdInHead: boneLocalFwd.clone().applyQuaternion(lQuat),
        rightRestFwdInHead: boneLocalFwd.clone().applyQuaternion(rQuat),
      };
      currentLeftQuatRef.current.copy(lQuat);
      currentRightQuatRef.current.copy(rQuat);
    }

  }, [scene, neckEmissiveMap, eyeDiffuseMap, eyeNormalMap, hairSpecularMap, scalpDiffuseMap]);

  // Continuous & Infinite Walking Animation System:
  // Starts the existing walking animation (MOTION / WALK_STRIDE) and ensures it loops indefinitely
  // with LoopRepeat and infinite repetitions, without any automatic transition to idle or standing poses.
  useEffect(() => {
    const walkClipName =
      names.find((n) => n === 'MOTION') ||
      names.find((n) => n === 'WALK_STRIDE') ||
      names[0];

    if (!walkClipName || !actions[walkClipName]) return;

    // Ensure all other action tracks are stopped so only walking plays
    Object.keys(actions).forEach((key) => {
      if (key !== walkClipName) {
        actions[key]?.stop();
      }
    });

    const walkAction = actions[walkClipName];
    if (walkAction) {
      walkAction.setLoop(THREE.LoopRepeat, Infinity);
      walkAction.clampWhenFinished = false;
      walkAction.enabled = true;
      if (!walkAction.isRunning()) {
        walkAction.reset().fadeIn(0.5).play();
      }
      activeActionRef.current = walkAction;
    }

    return () => {
      walkAction?.stop();
    };
  }, [actions, names]);

  // Premium Futuristic Short Pixie / Textured Crop:
  // Combines the crown/top textured hair (halfUpHair) with the clean tapered sides (undercutHair)
  // and the natural feathered scalp base, creating a feminine, well-groomed, elegant silhouette.
  useEffect(() => {
    const { undercutScalp, undercutHair, samuraiBun, halfUpHair, halfUpHairSecondary, halfUpScalp } = hairMeshesRef.current;
    if (halfUpHair) {
      halfUpHair.visible = true;
      halfUpHair.renderOrder = 3;
      if (halfUpHair.parent) halfUpHair.parent.visible = true;
    }
    if (halfUpHairSecondary) {
      halfUpHairSecondary.visible = true;
      halfUpHairSecondary.renderOrder = 4;
      if (halfUpHairSecondary.parent) halfUpHairSecondary.parent.visible = true;
    }
    if (halfUpScalp) {
      halfUpScalp.visible = true;
      halfUpScalp.renderOrder = 1;
      if (halfUpScalp.parent) halfUpScalp.parent.visible = true;
    }
    if (undercutHair) {
      undercutHair.visible = true;
      undercutHair.renderOrder = 2;
      if (undercutHair.parent) undercutHair.parent.visible = true;
    }
    if (samuraiBun) {
      samuraiBun.visible = false;
    }
    if (undercutScalp) undercutScalp.visible = false;
    if (halfUpHairSecondary && hairstyle === 'bun') {
      halfUpHairSecondary.visible = false;
    }
  }, [hairstyle]);

  // Real-time Face & Head Mouse Tracking
  useFrame((state, delta) => {
    // Notify parent container as soon as the model is active and rendering its first frame
    if (!hasSignaledReadyRef.current) {
      hasSignaledReadyRef.current = true;
      if (onReady) {
        onReady();
      }
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

    // -------------------------------------------------------------
    // NATURAL HUMAN BLINKING SYSTEM (EYELIDS & EYELASHES)
    // -------------------------------------------------------------
    const blink = blinkTimerRef.current;
    if (!blink.isBlinking) {
      if (state.clock.elapsedTime >= blink.nextBlinkTime) {
        blink.isBlinking = true;
        blink.blinkProgress = 0;
      }
    } else {
      // Natural human blink cycle (~0.16s: rapid close, gentle open)
      blink.blinkProgress += delta / 0.16;
      if (blink.blinkProgress >= 1.0) {
        blink.isBlinking = false;
        blink.blinkProgress = 0;
        // Schedule next natural blink between 3.2s and 6.2s
        blink.nextBlinkTime = state.clock.elapsedTime + 3.2 + Math.random() * 3.0;
      }
    }

    // Bell curve for smooth natural closing and opening (0 -> 1 -> 0)
    const blinkWeight = blink.isBlinking
      ? Math.sin(blink.blinkProgress * Math.PI)
      : 0.0;

    // Apply synchronized natural blink (target 16: left eyelid, target 17: right eyelid)
    if (headMeshRef.current && headMeshRef.current.morphTargetInfluences && headMeshRef.current.morphTargetInfluences.length > 17) {
      headMeshRef.current.morphTargetInfluences[16] = blinkWeight;
      headMeshRef.current.morphTargetInfluences[17] = blinkWeight;
    }
    if (eyelashMeshRef.current && eyelashMeshRef.current.morphTargetInfluences && eyelashMeshRef.current.morphTargetInfluences.length > 17) {
      eyelashMeshRef.current.morphTargetInfluences[16] = blinkWeight;
      eyelashMeshRef.current.morphTargetInfluences[17] = blinkWeight;
    }

    // -------------------------------------------------------------
    // REAL-TIME SPEECH & VISEME LIP-SYNC LAYER
    // Pure, anatomical, non-destructive lip morph targets.
    // Preserves 100% of the skeletal rig, chin, jawline, teeth, and rest pose.
    // -------------------------------------------------------------
    const bones = bonesRef.current;
    const visemeData = visemeStateRef.current;

    // High-Precision Pure Lip Morph Targets on Head Mesh (Targets 116, 46, 47, 110, 111, 80, 81, 115, 114, 50, 51)
    // All of these have 0.0 neck displacement and 0% chin deformation.
    if (headMeshRef.current && headMeshRef.current.morphTargetInfluences) {
      const influences = headMeshRef.current.morphTargetInfluences;
      const targetMap = morphDampedWeightsRef.current;

      const rawTargets: Record<number, number> = {
        116: 0, // Natural lower lip drop / mouth opening
        46: 0,  // Subtle upper lip lift R
        47: 0,  // Subtle upper lip lift L
        110: 0, // Mouth corner wide R
        111: 0, // Mouth corner wide L
        80: 0,  // Lip rounding / pucker R
        81: 0,  // Lip rounding / pucker L
        115: 0, // Bilabial closure (M, B, P)
        114: 0, // Lower lip press / labiodental (F, V)
        50: 0,  // Friendly subtle cheek/smile warmth R
        51: 0,  // Friendly subtle cheek/smile warmth L
      };

      if (!visemeData.isPause && visemeData.weight > 0.01) {
        // Active speaking articulation
        // 1. Lower lip opening & jaw drop effect (pure lip morph 116)
        rawTargets[116] = Math.min(0.44, visemeData.jawOpen * 0.44);

        // 2. Subtle upper lip raise supporting open vowels
        const upperLift = Math.min(0.14, visemeData.jawOpen * 0.14);
        rawTargets[46] = upperLift;
        rawTargets[47] = upperLift;

        // 3. Mouth corners widening (E, I, and smile engagement)
        const cornerWide = Math.min(0.36, visemeData.lipWidth * 0.35 + visemeData.smile * 0.08);
        rawTargets[110] = cornerWide;
        rawTargets[111] = cornerWide;

        // 4. Lip rounding & funneling (O, U, W)
        const roundPucker = Math.min(0.42, visemeData.lipRound * 0.40);
        rawTargets[80] = roundPucker;
        rawTargets[81] = roundPucker;

        // 5. Bilabial lip closure (M, B, P)
        // Notice: when M, B, P occurs, closure suppresses mouth opening for a crisp seal!
        const closure = Math.min(0.48, visemeData.lipClosure * 0.48);
        if (closure > 0.08) {
          rawTargets[115] = closure;
          rawTargets[116] = Math.max(0, rawTargets[116] - closure * 0.95);
        }

        // 6. Lower lip tuck & labiodental (F, V, TH)
        rawTargets[114] = Math.min(0.28, visemeData.lipPress * 0.28);

        // 7. Subtle humanoid facial engagement & cheek warmth
        const cheekWarmth = Math.min(0.15, visemeData.smile * 0.15);
        rawTargets[50] = cheekWarmth;
        rawTargets[51] = cheekWarmth;
      } else {
        // Natural micro-pause / resting presence
        // Cheeks maintain slight warm intelligent baseline, mouth is closed
        const baseWarmth = visemeData.smile > 0 ? Math.min(0.08, visemeData.smile * 0.08) : 0;
        rawTargets[50] = baseWarmth;
        rawTargets[51] = baseWarmth;
      }

      // Smoothly damp all speech morph target influences and reset cleanly to 0
      const speechKeys = [116, 46, 47, 110, 111, 80, 81, 115, 114, 50, 51];
      for (const idx of speechKeys) {
        if (idx < influences.length) {
          const desired = rawTargets[idx] || 0;
          const cur = targetMap[idx] || 0;
          let next = THREE.MathUtils.damp(cur, desired, 26, delta);
          if (Math.abs(next) < 0.001) next = 0;
          targetMap[idx] = next;
          influences[idx] = next;
        }
      }
    }

    // Proximity & Height Safety Guard:
    // Guarantees that neither hand can ever raise towards the head, forehead, or hair
    if (bones.head) {
      const headPos = headWorldPosRef.current;
      const handPos = handWorldPosRef.current;
      bones.head.getWorldPosition(headPos);

      if (bones.rightHand && bones.rightUpperArm) {
        bones.rightHand.getWorldPosition(handPos);
        if (handPos.distanceTo(headPos) < 0.45 || handPos.y > headPos.y - 0.28) {
          bones.rightUpperArm.rotation.x = THREE.MathUtils.clamp(bones.rightUpperArm.rotation.x, -0.5, 0.25);
          bones.rightUpperArm.rotation.z = THREE.MathUtils.clamp(bones.rightUpperArm.rotation.z, -1.2, -0.1);
        }
      }

      if (bones.leftHand && bones.leftUpperArm) {
        bones.leftHand.getWorldPosition(handPos);
        if (handPos.distanceTo(headPos) < 0.45 || handPos.y > headPos.y - 0.28) {
          bones.leftUpperArm.rotation.x = THREE.MathUtils.clamp(bones.leftUpperArm.rotation.x, -0.5, 0.25);
          bones.leftUpperArm.rotation.z = THREE.MathUtils.clamp(bones.leftUpperArm.rotation.z, 0.1, 1.2);
        }
      }
    }

    // -------------------------------------------------------------
    // ACCURATE 3D CAMERA RAYCASTING & NATURAL EYE TARGETING
    // -------------------------------------------------------------
    const { camera } = state;
    const { x, y, isHovered } = pointerTargetRef.current;
    const scrollGaze = scrollGazeOffsetRef.current || 0;
    const ndcX = isHovered ? x : 0.0;
    const ndcY = isHovered ? y : scrollGaze;
    const isEngaged = isHovered || Math.abs(scrollGaze) > 0.02;

    if (onPointerUpdate) {
      onPointerUpdate(ndcX, ndcY);
    }

    const calib = eyeCalibrationRef.current;

    if (bones.leftEye && bones.rightEye && bones.head && calib) {
      // Track mouse movement velocity to make head response feel organically alive
      const pDeltaX = ndcX - prevPointerRef.current.x;
      const pDeltaY = ndcY - prevPointerRef.current.y;
      prevPointerRef.current.x = ndcX;
      prevPointerRef.current.y = ndcY;
      const instantSpeed = Math.sqrt(pDeltaX * pDeltaX + pDeltaY * pDeltaY) / Math.max(0.001, delta);
      // Fast attack to notice motion immediately, smooth decay as motion ceases
      const velAttack = 15.0;
      const velDecay = 2.5;
      const velRate = instantSpeed > pointerVelocityRef.current ? velAttack : velDecay;
      pointerVelocityRef.current = THREE.MathUtils.damp(
        pointerVelocityRef.current,
        instantSpeed,
        velRate,
        delta
      );

      // Velocity weight: slow motion produces a very subtle response (~40%), normal motion reaches full natural response (100%)
      const speedNorm = Math.min(1.0, pointerVelocityRef.current / 0.6);
      const velocityWeight = isHovered ? (0.4 + 0.6 * speedNorm) : (isEngaged ? 0.75 : 0.0);

      // 1. Refresh world positions for eye bones
      bones.leftEye.getWorldPosition(tempLeftEyePosRef.current);
      bones.rightEye.getWorldPosition(tempRightEyePosRef.current);
      tempEyeCenterRef.current
        .addVectors(tempLeftEyePosRef.current, tempRightEyePosRef.current)
        .multiplyScalar(0.5);

      // 2. Physical 3D screen-plane cursor target:
      // Maps the 2D cursor position directly to the true screen plane at the camera distance.
      tempEyeCenterCamRef.current
        .copy(tempEyeCenterRef.current)
        .applyMatrix4(camera.matrixWorldInverse);
      const camDistToEyes = Math.max(0.5, -tempEyeCenterCamRef.current.z);

      const persCam = camera as THREE.PerspectiveCamera;
      const camFov = persCam.fov ?? 35;
      const camAspect = persCam.aspect ?? (state.size.width / (state.size.height || 1));
      const vFovRad = THREE.MathUtils.degToRad(camFov);
      const halfH = camDistToEyes * Math.tan(vFovRad / 2);
      const halfW = halfH * camAspect;

      if (isEngaged) {
        tempTargetCamRef.current.set(
          ndcX * halfW,
          ndcY * halfH,
          0 // exactly on the camera screen plane
        );
      } else {
        tempTargetCamRef.current.set(0, 0, 0);
      }

      // Transform target into World Space
      tempTarget3DRef.current
        .copy(tempTargetCamRef.current)
        .applyMatrix4(camera.matrixWorld);

      // 3. Synchronized Face/Head Follow derived from general gaze direction to target
      // Uses the accurate 3D gaze target direction rather than raw cursor values
      const headPos = headWorldPosRef.current;
      bones.head.getWorldPosition(headPos);

      // General gaze direction from head to 3D target
      tempHeadGazeDirRef.current
        .subVectors(tempTarget3DRef.current, headPos)
        .normalize();

      // Yaw (horizontal) and Pitch (vertical) toward target
      const rawGazeYaw = Math.atan2(tempHeadGazeDirRef.current.x, Math.max(0.001, tempHeadGazeDirRef.current.z));
      const rawGazePitch = Math.asin(THREE.MathUtils.clamp(tempHeadGazeDirRef.current.y, -1, 1));

      // Reaction threshold / dead-zone:
      // Small movements: eyes respond, head stays still.
      // Meaningful movements: eyes respond, head subtly follows.
      const gazeDist = Math.sqrt(rawGazeYaw * rawGazeYaw + rawGazePitch * rawGazePitch);
      const headDeadzone = 0.04; // ~2.3 degrees
      let headGazeScale = 0.0;
      if (isEngaged && gazeDist > headDeadzone) {
        const excess = (gazeDist - headDeadzone) / Math.max(0.001, 0.45 - headDeadzone);
        headGazeScale = THREE.MathUtils.clamp(excess, 0, 1) * velocityWeight;
      }

      // Controlled, sophisticated humanoid robotic speaking orientation:
      // Subtly reinforces natural speech phrases without any continuous nodding or shaking
      let targetSpeechYaw = 0.0;
      let targetSpeechPitch = 0.0;

      if (!visemeData.isPause) {
        if (visemeData.phraseType === 'GREETING') {
          // "Hello": subtle polite greeting orientation
          targetSpeechYaw = 0.008;
          targetSpeechPitch = -0.010;
        } else if (visemeData.phraseType === 'STATEMENT') {
          // Confident, calm humanoid posture during credentials
          targetSpeechYaw = 0.002;
          targetSpeechPitch = -0.005;
        } else if (visemeData.phraseType === 'EMPHASIS') {
          // "Today": slight deliberate focal adjustment
          targetSpeechYaw = -0.006;
          targetSpeechPitch = -0.012;
        } else if (visemeData.phraseType === 'QUESTION') {
          // "how can I help you?": slight attentive question tilt
          targetSpeechYaw = -0.014;
          targetSpeechPitch = -0.016;
        }
      }

      speechHeadYawRef.current = THREE.MathUtils.damp(speechHeadYawRef.current, targetSpeechYaw, 3.5, delta);
      speechHeadPitchRef.current = THREE.MathUtils.damp(speechHeadPitchRef.current, targetSpeechPitch, 3.5, delta);

      const subtleHeadYaw = THREE.MathUtils.clamp(
        rawGazeYaw * 0.20 * headGazeScale + speechHeadYawRef.current,
        -0.065,
        0.065
      );
      const subtleHeadPitch = THREE.MathUtils.clamp(
        -rawGazePitch * 0.10 * headGazeScale + speechHeadPitchRef.current,
        -0.040,
        0.040
      );

      // Subtle breathing & idle life micro-movements
      const microYaw = Math.sin(t * 0.45) * 0.002 + Math.sin(t * 0.18) * 0.001;
      const microPitch = Math.sin(t * 0.60) * 0.0015 + Math.cos(t * 0.22) * 0.001;

      const targetTotalYaw = subtleHeadYaw + microYaw;
      const targetTotalPitch = subtleHeadPitch + microPitch;

      // Natural hierarchy: Neck takes ~25%, Head takes ~75%
      const targetNeckYaw = targetTotalYaw * 0.25;
      const targetNeckPitch = targetTotalPitch * 0.25;
      const targetHeadYaw = targetTotalYaw * 0.75;
      const targetHeadPitch = targetTotalPitch * 0.75;

      // Natural delayed smooth easing (head damping 2.6 vs eye damping 12)
      // "Eyes first, face second": Eyes react immediately, head follows with a natural soft delay and settles smoothly
      const headDamping = 2.6;
      currentNeckYawRef.current = THREE.MathUtils.damp(
        currentNeckYawRef.current,
        targetNeckYaw,
        headDamping,
        delta
      );
      currentNeckPitchRef.current = THREE.MathUtils.damp(
        currentNeckPitchRef.current,
        targetNeckPitch,
        headDamping,
        delta
      );
      currentHeadYawRef.current = THREE.MathUtils.damp(
        currentHeadYawRef.current,
        targetHeadYaw,
        headDamping,
        delta
      );
      currentHeadPitchRef.current = THREE.MathUtils.damp(
        currentHeadPitchRef.current,
        targetHeadPitch,
        headDamping,
        delta
      );

      const base = baseRotationsRef.current;

      // Apply rotation to NeckUpper
      if (bones.neckUpper && base.neckUpperQuat) {
        tempHeadEulerRef.current.set(
          currentNeckPitchRef.current,
          currentNeckYawRef.current,
          0,
          'YXZ'
        );
        tempNeckDeltaQRef.current.setFromEuler(tempHeadEulerRef.current);
        bones.neckUpper.quaternion
          .copy(base.neckUpperQuat)
          .multiply(tempNeckDeltaQRef.current);
      }

      // Apply rotation to Head
      if (bones.head && base.headQuat) {
        tempHeadEulerRef.current.set(
          currentHeadPitchRef.current,
          currentHeadYawRef.current,
          0,
          'YXZ'
        );
        tempHeadDeltaQRef.current.setFromEuler(tempHeadEulerRef.current);
        bones.head.quaternion
          .copy(base.headQuat)
          .multiply(tempHeadDeltaQRef.current);
      }

      // Refresh world matrix so eye bones and head quat reflect the new head turn for exact gaze calculation
      if (group.current) {
        group.current.updateWorldMatrix(true, true);
      }

      // Refresh eye positions after head/neck update
      bones.leftEye.getWorldPosition(tempLeftEyePosRef.current);
      bones.rightEye.getWorldPosition(tempRightEyePosRef.current);

      // 3. Coordinate transformation into Head local space
      // (accounts for model position/scale, camera OrbitControls rotation, and animated head tilts)
      bones.head.getWorldQuaternion(tempHeadWorldQuatRef.current);
      tempInvHeadQuatRef.current.copy(tempHeadWorldQuatRef.current).invert();

      const maxGazeAngle = 0.42; // ~24 degrees: natural anatomical limit, fully prevents socket clipping
      const dampingSpeed = 12; // Responsive, smooth easing without perceptible lag or jitter
      const slerpFactor = 1 - Math.exp(-dampingSpeed * delta);

      // === LEFT EYE TARGETING ===
      // Vector from left eye to 3D cursor target in world space
      tempGazeWorldRef.current
        .subVectors(tempTarget3DRef.current, tempLeftEyePosRef.current)
        .normalize();
      // Transform gaze direction into Head local space
      tempGazeHeadRef.current
        .copy(tempGazeWorldRef.current)
        .applyQuaternion(tempInvHeadQuatRef.current);
      // Compute rotational delta from rest forward to desired gaze
      tempDeltaQRef.current.setFromUnitVectors(
        calib.leftRestFwdInHead,
        tempGazeHeadRef.current
      );
      // Natural human anatomical angle limit
      const leftAngle = 2 * Math.acos(Math.min(1, Math.max(-1, tempDeltaQRef.current.w)));
      if (leftAngle > maxGazeAngle) {
        tempDeltaQRef.current.slerp(identityQuatRef.current, 1 - maxGazeAngle / leftAngle);
      }
      // Target quaternion in Head local space = deltaQ * restQuat
      tempTargetQuatRef.current.multiplyQuaternions(
        tempDeltaQRef.current,
        calib.leftRestQuat
      );
      // Smooth interpolation & apply to bone
      currentLeftQuatRef.current.slerp(tempTargetQuatRef.current, slerpFactor);
      bones.leftEye.quaternion.copy(currentLeftQuatRef.current);

      // === RIGHT EYE TARGETING ===
      // Vector from right eye to 3D cursor target in world space
      tempGazeWorldRef.current
        .subVectors(tempTarget3DRef.current, tempRightEyePosRef.current)
        .normalize();
      // Transform gaze direction into Head local space
      tempGazeHeadRef.current
        .copy(tempGazeWorldRef.current)
        .applyQuaternion(tempInvHeadQuatRef.current);
      // Compute rotational delta from rest forward to desired gaze
      tempDeltaQRef.current.setFromUnitVectors(
        calib.rightRestFwdInHead,
        tempGazeHeadRef.current
      );
      // Natural human anatomical angle limit
      const rightAngle = 2 * Math.acos(Math.min(1, Math.max(-1, tempDeltaQRef.current.w)));
      if (rightAngle > maxGazeAngle) {
        tempDeltaQRef.current.slerp(identityQuatRef.current, 1 - maxGazeAngle / rightAngle);
      }
      // Target quaternion in Head local space = deltaQ * restQuat
      tempTargetQuatRef.current.multiplyQuaternions(
        tempDeltaQRef.current,
        calib.rightRestQuat
      );
      // Smooth interpolation & apply to bone
      currentRightQuatRef.current.slerp(tempTargetQuatRef.current, slerpFactor);
      bones.rightEye.quaternion.copy(currentRightQuatRef.current);
    }

    if (group.current) {
      const frameConfig = getResponsiveCameraConfig(state.size.width, state.size.height);
      group.current.position.set(0, frameConfig.modelY, 0);
      group.current.rotation.set(0, 0, 0);
      group.current.scale.set(frameConfig.modelScale, frameConfig.modelScale, frameConfig.modelScale);
    }
  });

  const initialConfig = getResponsiveCameraConfig(size.width, size.height);

  return (
    <group
      ref={group}
      position={[0, initialConfig.modelY, 0]}
      rotation={[0, 0, 0]}
      scale={initialConfig.modelScale}
      dispose={null}
    >
      <primitive object={scene} />
      {headBone && <CyberEarphone headBone={headBone} />}
    </group>
  );
});

// Preload the GLB model asset and textures
useGLTF.preload('/models/mia.glb', true, true, (loader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
});
useTexture.preload('/models/neck_emissive.png?v=7');
useTexture.preload('/models/head_diffuse.png?v=8');
useTexture.preload('/models/head_normal.png?v=6');
useTexture.preload('/models/eye_diffuse.png?v=3');
useTexture.preload('/models/eye_normal.png?v=3');
useTexture.preload('/models/hair_specular.png');
useTexture.preload('/models/scalp_diffuse.png');

export function MiaModel({ className = '', showStatusLabel = true }: MiaModelProps) {
  const [mounted, setMounted] = useState(false);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const handlePointerUpdate = useCallback((x: number, y: number) => {
    setMouseCoords({
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
    });
  }, []);
  const [hairstyle, setHairstyle] = useState<HairstyleId>('flowing');
  const orbitControlsRef = useRef<any>(null);
  const { lenis } = useSmoothScroll();
  const { setIsSiteLoading } = useTheme();

  // Detect mobile touchscreen devices so OrbitControls is disabled on phone/tablet to preserve 100% native smooth scrolling
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    const checkTouch = () => {
      const hasTouch =
        typeof window !== 'undefined' &&
        ('ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          window.matchMedia('(pointer: coarse)').matches ||
          window.innerWidth < 1024);
      setIsTouchDevice(hasTouch);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  // Real Three.js asset loading tracker
  const { active, progress: realProgress, item, loaded, total } = useProgress();
  const [hasCompletedInitialLoad, setHasCompletedInitialLoad] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const handleModelReady = useCallback(() => {
    setIsModelReady(true);
  }, []);

  // Smooth progress state (0 to 100)
  const [displayProgress, setDisplayProgress] = useState(0);
  const targetProgressRef = useRef(0);

  // Hologram & Real Model choreography
  const [showHologram, setShowHologram] = useState(true);
  const [isHologramDissolving, setIsHologramDissolving] = useState(false);
  const [showRealModel, setShowRealModel] = useState(false);

  // HUD visibility for Framer Motion exit animation
  const [showHUD, setShowHUD] = useState(true);

  // Manual replay state
  const [manualTrigger, setManualTrigger] = useState(false);

  // Shaking and flare effects
  const [isShaking, setIsShaking] = useState(false);
  const [showFlare, setShowFlare] = useState(false);
  const isCompletingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Advance targetProgress smoothly and coordinate with model readiness
  useEffect(() => {
    if (hasCompletedInitialLoad && !manualTrigger) return;

    if (manualTrigger) {
      targetProgressRef.current = 0;
      isCompletingRef.current = false;
      return;
    }

    if (isModelReady) {
      targetProgressRef.current = 100;
    } else if (!active && realProgress === 100) {
      targetProgressRef.current = Math.max(targetProgressRef.current, 95);
    } else {
      targetProgressRef.current = Math.max(targetProgressRef.current, Math.min(92, realProgress * 0.95));
    }
  }, [active, realProgress, hasCompletedInitialLoad, manualTrigger, isModelReady]);

  // 2. 60FPS Fluid Progress Interpolator (Zero chunky jumps, guaranteed smooth ramp)
  useEffect(() => {
    if (hasCompletedInitialLoad && !manualTrigger) return;

    let animId: number;
    let lastTime = performance.now();

    const updateProgress = (now: number) => {
      const dt = Math.min(0.08, (now - lastTime) / 1000);
      lastTime = now;

      if (manualTrigger) {
        targetProgressRef.current = Math.min(100, targetProgressRef.current + dt * 65);
      } else {
        if (isModelReady) {
          targetProgressRef.current = 100;
        } else {
          // Continuous smooth ramp for guaranteed visual prestige up to 95% while model prepares
          targetProgressRef.current = Math.max(
            targetProgressRef.current,
            Math.min(95, targetProgressRef.current + dt * 45)
          );
        }
      }

      setDisplayProgress((prev) => {
        const target = targetProgressRef.current;
        if (prev >= 100) return 100;

        const diff = target - prev;
        if (diff <= 0.25 && target >= 100) {
          return 100;
        }

        const step = Math.max(diff * 6.2 * dt, dt * 28);
        return Math.min(target, prev + step);
      });

      animId = requestAnimationFrame(updateProgress);
    };

    animId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animId);
  }, [hasCompletedInitialLoad, manualTrigger, isModelReady]);

  // 3. Graceful Completion Sequence once displayProgress hits 100 AND model is verified ready
  useEffect(() => {
    if (displayProgress >= 100 && (isModelReady || manualTrigger) && !isCompletingRef.current && (showHUD || manualTrigger)) {
      isCompletingRef.current = true;

      // Begin hologram quantum dissolve & reveal real 3D model
      setIsHologramDissolving(true);
      setShowRealModel(true);
      setShowFlare(true);

      const flareTimer = setTimeout(() => {
        setShowFlare(false);
      }, 700);

      // Fade out HUD via Framer Motion AnimatePresence
      const hudTimer = setTimeout(() => {
        setShowHUD(false);
      }, 450);

      // Cleanly finalize completion after animations settle
      const completeTimer = setTimeout(() => {
        setShowHologram(false);
        setHasCompletedInitialLoad(true);
        setManualTrigger(false);
        setIsSiteLoading(false);
        setIsShaking(false);
      }, 950);

      return () => {
        clearTimeout(flareTimer);
        clearTimeout(hudTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [displayProgress, isModelReady, showHUD, manualTrigger, setIsSiteLoading]);

  // Safety watchdog: If network or asset loading hangs for > 15 seconds on very slow connections, gracefully complete
  // so the user is never stuck on a loading screen or locked scroll
  useEffect(() => {
    if (hasCompletedInitialLoad) return;
    const safetyTimer = setTimeout(() => {
      if (!isModelReady) {
        console.warn('MiaModel: Asset loading reached safety watchdog window. Completing initialization gracefully.');
        setIsModelReady(true);
        targetProgressRef.current = 100;
        setDisplayProgress(100);
      }
    }, 15000);
    return () => clearTimeout(safetyTimer);
  }, [isModelReady, hasCompletedInitialLoad]);

  const handleReplay = () => {
    isCompletingRef.current = false;
    targetProgressRef.current = 0;
    setDisplayProgress(0);
    setIsHologramDissolving(false);
    setShowHologram(true);
    setShowRealModel(false);
    setShowHUD(true);
    setManualTrigger(true);
    setIsShaking(false);
    setIsSiteLoading(true);
  };

  const handleSkip = () => {
    isCompletingRef.current = true;
    targetProgressRef.current = 100;
    setDisplayProgress(100);
    setIsModelReady(true);
    setIsHologramDissolving(true);
    setShowRealModel(true);
    setShowHUD(false);
    setShowFlare(false);
    setIsShaking(false);
    setTimeout(() => {
      setShowHologram(false);
      setHasCompletedInitialLoad(true);
      setManualTrigger(false);
      setIsSiteLoading(false);
    }, 300);
  };

  const isCurrentlyLoading = showHUD || isCompletingRef.current || manualTrigger;

  // Synchronize site loading state to hide navbar while loading
  useEffect(() => {
    setIsSiteLoading(isCurrentlyLoading);
  }, [isCurrentlyLoading, setIsSiteLoading]);

  // Reset loading state if unmounted
  useEffect(() => {
    return () => {
      setIsSiteLoading(false);
    };
  }, [setIsSiteLoading]);

  // Complete page scroll lock while loading HUD is active
  useEffect(() => {
    if (showHUD) {
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
  }, [showHUD, lenis]);

  if (!mounted) {
    return (
      <div className={`relative w-full h-full min-h-[100dvh] flex items-center justify-center bg-[#070A14] ${className}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#00F0FF]/30 border-t-[#00F0FF] animate-spin shadow-[0_0_15px_#00F0FF]" />
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

      {/* 1B. Electric Cyber Background Model Name 'DIYKAN' (Revealed only after model is loaded) */}
      <ElectricBackgroundText isLoaded={showRealModel && !showHUD} />

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
      <div 
        className="absolute inset-0 w-full h-full z-10 touch-pan-y pointer-events-auto"
        style={{ touchAction: 'pan-y' }}
      >
        <Canvas
          dpr={[1, 1.75]} // 4K retina clamping for locked 60+ FPS
          camera={{ position: [0, 0.08, 1.92], fov: 35 }}
          flat={false}
          gl={{
            antialias: true,
            alpha: true,
            stencil: false,
            depth: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.16,
          }}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-pan-y"
          style={{ touchAction: 'pan-y' }}
        >
          {/* Background Precompilation */}
          <PrecompilePipeline />

          {/* 4K Studio Lighting */}
          <StudioLighting />

          {/* Realistic PBR Environment Reflections - wrapped in Suspense so network CDN never blocks Canvas */}
          <Suspense fallback={null}>
            <Environment preset="city" environmentIntensity={0.4} />
          </Suspense>

          {/* 3D Holographic Wireframe Model Builder (Active during loading & dissolve) */}
          {showHologram && (
            <HologramModelBuilder
              progress={displayProgress}
              isComplete={isHologramDissolving}
            />
          )}

          {/* 4K Model with Face/Head Tracking & Electric Neck Glow */}
          <Suspense fallback={null}>
            <group visible={showRealModel}>
              <Model
                hairstyle={hairstyle}
                onPointerUpdate={handlePointerUpdate}
                onReady={handleModelReady}
              />
            </group>
          </Suspense>

          {/* Dynamic Responsive Camera Rig */}
          <ResponsiveCameraRig orbitRef={orbitControlsRef} />

          {/* OrbitControls - Enabled for desktop mouse drag; disabled on touchscreens to ensure 100% smooth native mobile scrolling while model tracks touch & scroll */}
          <OrbitControls
            ref={orbitControlsRef}
            enabled={!isTouchDevice}
            target={[0, 0.08, 0]}
            enableZoom={false}
            enablePan={false}
            touches={{
              ONE: (THREE.TOUCH as any).NONE ?? 0,
              TWO: (THREE.TOUCH as any).NONE ?? 0,
            }}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.7}
            minAzimuthAngle={-Math.PI / 3.5}
            maxAzimuthAngle={Math.PI / 3.5}
            dampingFactor={0.05}
            rotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* 4. Full-Screen Cyberpunk Coding Terminal Loader with Smooth AnimatePresence */}
      <AnimatePresence>
        {showHUD && (
          <CyberAssemblyHUD
            progress={displayProgress}
            item={item}
            loaded={loaded}
            total={total}
            isManualTrigger={manualTrigger}
            onShake={setIsShaking}
            onComplete={() => {}}
            onSkip={handleSkip}
          />
        )}
      </AnimatePresence>

      {/* Corner Tech Brackets with Live Tracking Telemetry */}
      <div className="absolute top-24 sm:top-28 left-6 sm:left-12 pointer-events-none select-none z-20 hidden md:block">
        <div className="flex flex-col gap-1 text-[10px] font-mono text-[#38BDF8]/70 tracking-wider">
          <div className="flex items-center gap-1.5 text-[#38BDF8]">
            <span className="inline-block w-2 h-2 border-t-2 border-l-2 border-[#38BDF8]" />
            <span>EYE_GAZE </span>
          </div>
          <span className="text-[9px] text-[#94A3B8]/70 font-mono">
            TARGET_LOCK: [{mouseCoords.x >= 0 ? `+${mouseCoords.x}` : mouseCoords.x},{' '}
            {mouseCoords.y >= 0 ? `+${mouseCoords.y}` : mouseCoords.y}]
          </span>
        </div>
      </div>

      {/* 5. Real-Time AI Robot Voice, Microphone & Speech Assistant Widget */}
      {showRealModel && !showHUD && <DaykanVoiceWidget />}
    </div>
  );
}

export default MiaModel;
