'use client';

import React, { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls, Sparkles, useTexture, Environment } from '@react-three/drei';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import NightSkyBackground from './NightSkyBackground';
import CyberAssemblyHUD from './CyberAssemblyHUD';

export interface MiaModelProps {
  className?: string;
  showStatusLabel?: boolean;
}

// Background Holographic Cyber Ring
function HolographicRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.15;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = -t * 0.08;
    }
  });

  return (
    <group position={[0, 0.15, -0.8]}>
      {/* Inner Glowing Ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[1.3, 1.33, 64]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer Dashed/Faint Ring */}
      <mesh ref={outerRingRef}>
        <ringGeometry args={[1.65, 1.67, 48]} />
        <meshBasicMaterial
          color="#818CF8"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// 4K Studio Lighting Rig
function StudioLighting() {
  return (
    <>
      {/* Smooth Atmosphere Fog */}
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
// 3D HOLOGRAPHIC SCANNING LASER BEAM
// -------------------------------------------------------------
function HoloScanLaser({ progress }: { progress: number }) {
  const laserRef = useRef<THREE.Group>(null);
  const scanRingRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!laserRef.current || progress >= 1.0) return;
    const t = state.clock.elapsedTime;

    // Sweeping vertical scan beam through Mia's body & head
    const scanHeight = -0.55 + 0.95 * (Math.sin(t * 3.8) * 0.5 + 0.5);
    laserRef.current.position.y = scanHeight;

    if (scanRingRef.current) {
      scanRingRef.current.rotation.z = t * 1.8;
      const s = 1.0 + Math.sin(t * 7.0) * 0.06;
      scanRingRef.current.scale.set(s, s, 1);
    }

    if (lightRef.current) {
      lightRef.current.intensity = (1.0 - progress * 0.6) * (3.5 + Math.sin(t * 10.0) * 1.0);
    }
  });

  if (progress >= 1.0) return null;

  return (
    <group ref={laserRef} position={[0, 0, 0.04]}>
      {/* Outer Glowing Cyan Laser Scan Ring */}
      <mesh ref={scanRingRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.32, 0.48, 64]} />
        <meshBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner High-Intensity Beam */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.12, 0.31, 48]} />
        <meshBasicMaterial
          color="#8AE4FA"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Dynamic Laser Light cast on Model Vertices */}
      <pointLight ref={lightRef} color="#00F0FF" distance={1.2} intensity={3.5} />
    </group>
  );
}

// -------------------------------------------------------------
// SINGLE-PIXEL HOLOGRAPHIC PARTICLE ASSEMBLY SYSTEM
// -------------------------------------------------------------
const NUM_ASSEMBLY_PARTICLES = 36000;

function HoloPixelAssembly({ progress }: { progress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const coreOrbRef = useRef<THREE.Mesh>(null);
  const coreRingRef = useRef<THREE.Mesh>(null);

  // Generate 36,000 anatomical target coordinates mapping Mia's exact 3D bust & head
  const { geometry, shaderMaterial } = useMemo(() => {
    const positions = new Float32Array(NUM_ASSEMBLY_PARTICLES * 3);
    const aTarget = new Float32Array(NUM_ASSEMBLY_PARTICLES * 3);
    const aOrigin = new Float32Array(NUM_ASSEMBLY_PARTICLES * 3);
    const aDelay = new Float32Array(NUM_ASSEMBLY_PARTICLES);
    const aColor = new Float32Array(NUM_ASSEMBLY_PARTICLES * 3);
    const aSize = new Float32Array(NUM_ASSEMBLY_PARTICLES);
    const aVortex = new Float32Array(NUM_ASSEMBLY_PARTICLES);

    let idx = 0;

    // Helper to add a particle
    const addPt = (
      tx: number,
      ty: number,
      tz: number,
      delay: number,
      color: [number, number, number],
      size: number,
      vortex: number
    ) => {
      // Starting position: bottom singularity energy core at [0, -0.68, 0.05]
      const ox = (Math.random() - 0.5) * 0.08;
      const oy = -0.68 + (Math.random() - 0.5) * 0.08;
      const oz = 0.05 + (Math.random() - 0.5) * 0.08;

      positions[idx * 3] = ox;
      positions[idx * 3 + 1] = oy;
      positions[idx * 3 + 2] = oz;

      aOrigin[idx * 3] = ox;
      aOrigin[idx * 3 + 1] = oy;
      aOrigin[idx * 3 + 2] = oz;

      aTarget[idx * 3] = tx;
      aTarget[idx * 3 + 1] = ty;
      aTarget[idx * 3 + 2] = tz;

      aDelay[idx] = delay;

      aColor[idx * 3] = color[0];
      aColor[idx * 3 + 1] = color[1];
      aColor[idx * 3 + 2] = color[2];

      aSize[idx] = size;
      aVortex[idx] = vortex;

      idx++;
    };

    // 1. Head & Facial Features (15,000 pixels) - Later assembly phase
    for (let i = 0; i < 15000; i++) {
      const z = 0.03 + Math.random() * 0.39; // Three.js Y (height)
      const t = (z - 0.03) / 0.39;
      const rx = 0.13 + Math.sin(t * Math.PI) * 0.065;
      const rz = 0.15 + Math.sin(t * Math.PI) * 0.055;
      const theta = Math.random() * Math.PI * 2;
      const tx = rx * Math.cos(theta) + (Math.random() - 0.5) * 0.01;
      const ty = z + (Math.random() - 0.5) * 0.01;
      const tz = rz * Math.sin(theta) + 0.03 + (Math.random() - 0.5) * 0.01;

      // Delayed assembly for head
      const delay = 0.25 + Math.random() * 0.45;
      const color: [number, number, number] =
        Math.random() < 0.6
          ? [0.0, 0.92, 1.0] // Electric Cyan
          : Math.random() < 0.85
            ? [0.35, 0.75, 1.0] // Electric Sky Blue
            : [0.95, 0.98, 1.0]; // White-hot spark

      addPt(tx, ty, tz, delay, color, 2.2 + Math.random() * 1.5, 0.6 + Math.random() * 0.8);
    }

    // 2. Cybernetic Neck & Throat Implant (7,000 pixels) - High-density electric circuit
    for (let i = 0; i < 7000; i++) {
      const y = -0.18 + Math.random() * 0.22;
      // Focus on front throat where the cyber circuit is
      const theta = (Math.random() - 0.5) * Math.PI * 0.75;
      const r = 0.095 + (Math.random() - 0.5) * 0.015;
      const tx = r * Math.sin(theta);
      const ty = y;
      const tz = r * Math.cos(theta) + 0.04;

      const delay = 0.15 + Math.random() * 0.35;
      const color: [number, number, number] =
        Math.random() < 0.5
          ? [0.0, 1.0, 1.0] // Intense Electric Cyan
          : Math.random() < 0.85
            ? [0.9, 0.98, 1.0] // White-hot core
            : [0.05, 0.55, 1.0]; // Deep neon blue

      addPt(tx, ty, tz, delay, color, 2.8 + Math.random() * 1.8, 0.4 + Math.random() * 0.5);
    }

    // 3. Chest, Shoulders, and Cyber Jacket (14,000 pixels) - Erupts first
    for (let i = 0; i < 14000; i++) {
      const t = Math.random();
      const ty = -0.65 + t * 0.47;
      const w = 0.20 + Math.pow(1.0 - t, 0.85) * 0.46;
      const side = Math.random() < 0.5 ? -1.0 : 1.0;
      const u = Math.random();
      const tx = side * u * w;
      const tz = -0.04 + Math.cos(u * Math.PI * 0.5) * 0.13 + (Math.random() - 0.5) * 0.015;

      const delay = (1.0 - t) * 0.28 + Math.random() * 0.18;
      const color: [number, number, number] =
        Math.random() < 0.65
          ? [0.0, 0.82, 0.98] // Cyan
          : Math.random() < 0.85
            ? [0.55, 0.40, 0.98] // Cyber Violet
            : [0.20, 0.95, 1.0]; // Azure

      addPt(tx, ty, tz, delay, color, 2.4 + Math.random() * 1.6, 0.8 + Math.random() * 0.7);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aTarget', new THREE.BufferAttribute(aTarget, 3));
    geo.setAttribute('aOrigin', new THREE.BufferAttribute(aOrigin, 3));
    geo.setAttribute('aDelay', new THREE.BufferAttribute(aDelay, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(aColor, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(aSize, 1));
    geo.setAttribute('aVortex', new THREE.BufferAttribute(aVortex, 1));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uProgress: { value: 0 },
        uTime: { value: 0 },
      },
      vertexShader: `
        uniform float uProgress;
        uniform float uTime;
        attribute vec3 aTarget;
        attribute vec3 aOrigin;
        attribute float aDelay;
        attribute vec3 aColor;
        attribute float aSize;
        attribute float aVortex;

        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = aColor;

          // Normalized local progress for this individual quantum pixel
          float localP = clamp((uProgress - aDelay) / max(0.001, 1.0 - aDelay), 0.0, 1.0);

          // Smooth cubic ease out
          float ease = 1.0 - pow(1.0 - localP, 3.0);

          // Swirling vortex trajectory
          float angle = (1.0 - ease) * aVortex * 6.28 + uTime * 2.5 * (1.0 - ease);
          float radius = (1.0 - ease) * 0.38;
          vec3 swirl = vec3(cos(angle) * radius, sin(ease * 3.1415) * 0.09, sin(angle) * radius);

          // Micro electric jitter as particles lock into 4K resolution
          float jitter = sin(uTime * 30.0 + aTarget.y * 40.0) * 0.004 * (1.0 - ease);

          vec3 currentPos = mix(aOrigin, aTarget, ease) + swirl + vec3(jitter);

          vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          // Point size with distance attenuation
          float sizeBoost = (1.0 - ease) * 2.2;
          gl_PointSize = (aSize + sizeBoost) * (280.0 / -mvPosition.z);

          // Gracefully fade out once the 4K model is materialized (progress 0.85 -> 1.0)
          float fadeOut = smoothstep(1.0, 0.82, uProgress);
          vAlpha = smoothstep(0.0, 0.08, localP) * fadeOut;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;

          // Soft luminous core falloff
          float glow = smoothstep(0.5, 0.0, dist);
          float core = smoothstep(0.2, 0.0, dist);

          vec3 col = mix(vColor, vec3(1.0), core * 0.65);
          gl_FragColor = vec4(col, vAlpha * glow);
        }
      `,
    });

    return { geometry: geo, shaderMaterial: mat };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    shaderMaterial.uniforms.uProgress.value = progress;
    shaderMaterial.uniforms.uTime.value = t;

    // Animate Singularity Energy Core Orb
    if (coreOrbRef.current) {
      const orbScale = Math.max(0.001, (1.0 - Math.min(1.0, progress * 1.3))) * (1.0 + Math.sin(t * 8.0) * 0.15);
      coreOrbRef.current.scale.setScalar(orbScale);
      coreOrbRef.current.rotation.y = t * 2.0;
    }
    if (coreRingRef.current) {
      const ringScale = Math.max(0.001, (1.0 - Math.min(1.0, progress * 1.3))) * (1.0 + Math.cos(t * 6.0) * 0.2);
      coreRingRef.current.scale.setScalar(ringScale);
      coreRingRef.current.rotation.z = -t * 3.0;
    }
  });

  // Once fully assembled and dissolved, unmount points to free GPU
  if (progress >= 1.0) {
    return null;
  }

  return (
    <group>
      {/* 36,000 Quantum Voxel Points */}
      <points ref={pointsRef} geometry={geometry} material={shaderMaterial} />

      {/* Singularity Eruption Orb & Accents */}
      <group position={[0, -0.68, 0.05]}>
        <mesh ref={coreOrbRef}>
          <sphereGeometry args={[0.07, 32, 32]} />
          <meshBasicMaterial color="#00F0FF" />
        </mesh>
        <mesh ref={coreRingRef}>
          <ringGeometry args={[0.09, 0.11, 32]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
        <pointLight
          color="#00F0FF"
          intensity={Math.max(0, (1.0 - progress) * 5.0)}
          distance={1.5}
        />
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 3D MIA MODEL WITH 4K RENDERING & ELECTRIC NECK GLOW
// -------------------------------------------------------------
interface CharacterFaceBones {
  head?: THREE.Bone;
  neckUpper?: THREE.Bone;
  neckLower?: THREE.Bone;
}

interface BaseBoneRotations {
  head?: THREE.Euler;
  neckUpper?: THREE.Euler;
  neckLower?: THREE.Euler;
}

function Model({
  onPointerUpdate,
  assemblyProgress,
}: {
  onPointerUpdate?: (x: number, y: number) => void;
  assemblyProgress: number;
}) {
  const group = useRef<THREE.Group>(null);
  const bonesRef = useRef<CharacterFaceBones>({});
  const baseRotationsRef = useRef<BaseBoneRotations>({});
  const skinHeadMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const uniformsRef = useRef<{ uTime: { value: number } }>({
    uTime: { value: 0 },
  });

  // Smooth interpolated angles for head tracking
  const currentYawRef = useRef(0);
  const currentPitchRef = useRef(0);
  const currentRollRef = useRef(0);

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

  const { actions, names } = useAnimations(animations, group);

  // Setup bones, materials, and crystal-clear eye visibility
  useEffect(() => {
    const foundBones: CharacterFaceBones = {};
    const baseRotations: BaseBoneRotations = {};

    scene.traverse((child) => {
      const childName = (child.name || '').toLowerCase();

      // 1. Hide lower body parts not in the photo (legs, boots, leg wraps, lower belts, suit, tablet)
      if (
        childName.includes('leg') ||
        childName.includes('boot') ||
        childName.includes('tablet') ||
        childName.includes('songbird') ||
        childName.includes('wrap') ||
        childName.includes('suit') ||
        childName.includes('icosphere') ||
        childName.includes('plane')
      ) {
        child.visible = false;
        return;
      }

      // 2. Crystal-Clear Eye Materials Fix & Neon Ultra HD Materials
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

        materials.forEach((mat) => {
          if (!mat) return;
          const matName = mat.name || '';

          // Hide any lower body materials
          if (
            matName.includes('Std_Skin_Leg') ||
            matName.includes('Loose_Biker_Boots') ||
            matName.includes('Leg_Wrap') ||
            matName.includes('Belt1') ||
            matName.includes('Suit1') ||
            matName.includes('songbird')
          ) {
            child.visible = false;
            return;
          }

          // Enhance Ga_Eye (Iris, Pupil, Sclera)
          if (matName.includes('Ga_Eye') || matName.includes('Eye')) {
            (mat as THREE.MeshStandardMaterial).roughness = 0.08;
            (mat as THREE.MeshStandardMaterial).metalness = 0.0;
            mat.depthWrite = true;
            mat.transparent = false;
            mat.needsUpdate = true;
          }

          // Ensure Tearline and Eye Occlusion never block or fog the eye iris
          if (matName.includes('Eye_Occlusion') || matName.includes('Tearline')) {
            mat.depthWrite = false;
            mat.transparent = true;
            mat.opacity = 0.15;
            mat.needsUpdate = true;
          }

          // 2B. Cybernetic Neck Electric Circuit Glowing Material & Shader FX
          if (matName.includes('Std_Skin_Head') || matName.includes('Skin_Head')) {
            const stdMat = mat as THREE.MeshStandardMaterial;
            stdMat.emissiveMap = neckEmissiveMap;
            stdMat.emissive = new THREE.Color('#0088FF');
            stdMat.emissiveIntensity = 2.4;
            stdMat.roughness = 0.46; // Natural soft skin texture
            stdMat.metalness = 0.04;

            // Inject custom 3-second electric neon blue glow & glow-off shader
            stdMat.onBeforeCompile = (shader) => {
              shader.uniforms.uTime = uniformsRef.current.uTime;
              shader.fragmentShader = `
                uniform float uTime;
              ` + shader.fragmentShader;

              // 1. Invert white-painted diffuse map into dark titanium cyber metal
              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <map_fragment>',
                `
                #ifdef USE_MAP
                  vec4 sampledDiffuseColor = texture2D( map, vMapUv );
                  
                  #ifdef USE_EMISSIVEMAP
                    vec4 neckMask = texture2D( emissiveMap, vMapUv );
                    float isCyberCircuit = dot(neckMask.rgb, vec3(0.299, 0.587, 0.114));
                    if (isCyberCircuit > 0.03) {
                      // Replace flat white paint with dark titanium cyberware metal
                      vec3 darkTitanium = vec3(0.035, 0.055, 0.085);
                      sampledDiffuseColor.rgb = mix(sampledDiffuseColor.rgb, darkTitanium, min(1.0, isCyberCircuit * 1.8));
                    }
                  #endif

                  diffuseColor *= sampledDiffuseColor;
                #endif
                `
              );

              // 2. Pure Light Electric Neon Blue Glow & Glow-off Cycle
              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <emissivemap_fragment>',
                `
                #ifdef USE_EMISSIVEMAP
                  vec4 emissiveTex = texture2D( emissiveMap, vEmissiveMapUv );
                  float lum = dot(emissiveTex.rgb, vec3(0.299, 0.587, 0.114));
                  
                  // Only illuminate where cyber circuit lines exist
                  if (lum > 0.03) {
                    // EXACT 3-SECOND AUTOMATIC NEON ELECTRIC GLOW & GLOW-OFF CYCLE
                    float tau = mod(uTime, 3.0);
                    float neonPower = 0.0;
                    
                    if (tau < 0.16) {
                      // High-voltage double-strike ignition (electric flicker on)
                      float strike1 = step(0.02, tau) * (1.0 - step(0.06, tau));
                      float strike2 = step(0.09, tau);
                      neonPower = (strike1 * 1.5 + strike2 * 2.0);
                    } else if (tau < 1.45) {
                      // FULL GLOW ON: Energized electric neon blue with traveling bio-current
                      float wave = sin(vEmissiveMapUv.y * 36.0 - uTime * 6.5) * 0.20 + 0.90;
                      neonPower = wave * 2.0;
                    } else if (tau < 1.95) {
                      // Voltage discharge (smooth electrical fade down to off)
                      float fade = (1.95 - tau) / 0.50;
                      neonPower = smoothstep(0.0, 1.0, fade) * 1.4;
                    } else if (tau < 2.85) {
                      // FULL GLOW OFF: Zero emissive, dark titanium cyberware
                      neonPower = 0.0;
                    } else {
                      // Pre-strike electrical simmer right before ignition
                      float charge = (tau - 2.85) / 0.15;
                      neonPower = charge * 0.30;
                    }

                    // Electric micro-sparks & current jitter
                    float jitter = sin(uTime * 50.0) * sin(uTime * 70.0) * 0.12;
                    float spark = step(0.965, fract(sin(dot(vEmissiveMapUv.xy, vec2(12.9898, 78.233)) + uTime * 15.0) * 43758.5453));

                    // Pure Light Electric Neon Blue Palette (Vibrant Electric Cyan-Blue)
                    vec3 electricNeonBlue = vec3(0.0, 0.72, 1.0);  // Brilliant electric neon blue #00B8FF
                    vec3 deepElectricBlue = vec3(0.0, 0.40, 1.0);  // Saturated azure base #0066FF
                    vec3 neonCyanCore    = vec3(0.10, 0.92, 1.0);  // High-energy neon core #1AEBFF

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

          // 2C. MODEL CLOTH WEAR WITH NEON ULTRA HD
          // Main Cyber Jacket: Deep obsidian/carbon tech-leather
          if (matName.includes('Jacket1')) {
            const stdMat = mat as THREE.MeshStandardMaterial;
            stdMat.color = new THREE.Color('#10141D'); // Deep sleek cyberpunk carbon black
            stdMat.roughness = 0.35; // Premium tactical leather sheen
            stdMat.metalness = 0.22; // Subtle cyber-fabric metallic weave
            stdMat.depthWrite = true;
            stdMat.transparent = false;
            stdMat.needsUpdate = true;
          }

          // Glowing Neon Ultra HD Cyber Piping (Collar rim, lapels, and shoulder straps)
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

          // Metallic Buckles, Rings & Hardware (Chrome / Titanium)
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
        } else if (name.includes('NeckTwist02') || name.includes('Neck_02')) {
          foundBones.neckUpper = bone;
          baseRotations.neckUpper = bone.rotation.clone();

          // Add targeted neck electric lighting glow
          if (!bone.getObjectByName('NeckElectricLight')) {
            const neckLight = new THREE.PointLight(0x00E5FF, 3.2, 0.9);
            neckLight.name = 'NeckElectricLight';
            neckLight.position.set(0, 0.05, 0.12);
            bone.add(neckLight);
          }
        } else if (name.includes('NeckTwist01') || name.includes('Neck') || name.toLowerCase().includes('neck')) {
          foundBones.neckLower = bone;
          baseRotations.neckLower = bone.rotation.clone();
        }
      }
    });

    bonesRef.current = foundBones;
    baseRotationsRef.current = baseRotations;

    // Play default ambient idle action if available
    if (names.length > 0 && actions[names[0]]) {
      actions[names[0]]?.reset().fadeIn(0.5).play();
    }
  }, [actions, names, scene, neckEmissiveMap]);

  // Real-time Face & Head ONLY Mouse Tracking with 4K Shading & Assembly Dissolve
  useFrame((state, delta) => {
    const { pointer } = state;

    if (onPointerUpdate) {
      onPointerUpdate(pointer.x, pointer.y);
    }

    // Materialize model based on assembly progress (smooth fade in during 0.70 -> 1.0)
    if (group.current) {
      const isVisible = assemblyProgress >= 0.70;
      group.current.visible = isVisible;

      if (isVisible) {
        // Materialization scale/opacity pop
        const matEase = Math.min(1.0, (assemblyProgress - 0.70) / 0.28);
        const scaleVal = 1.5 * (0.96 + 0.04 * Math.sin(matEase * Math.PI * 0.5));
        group.current.scale.setScalar(scaleVal);
      }
    }

    // Update shader time uniform for flowing electric pulse waves
    uniformsRef.current.uTime.value = state.clock.elapsedTime;

    // Calculate 3-Second Automatic Electric Neon Power Cycle (0 to 3s)
    const t = state.clock.elapsedTime;
    const tau = t % 3.0;
    let neonPower = 0.0;

    if (tau < 0.15) {
      // High-voltage double-strike ignition (flicker on)
      const strike1 = (tau >= 0.02 && tau < 0.05) ? 1.0 : 0.0;
      const strike2 = tau >= 0.08 ? 1.0 : 0.0;
      neonPower = strike1 * 1.6 + strike2 * 1.9;
    } else if (tau < 1.45) {
      // Energized glow with pulsing current
      const wave = Math.sin(t * 7.5) * 0.18 + 0.90;
      neonPower = wave * 1.8;
    } else if (tau < 1.95) {
      // Smooth voltage decay into glow-off
      const fade = (1.95 - tau) / 0.50;
      neonPower = fade * fade * 1.2;
    } else if (tau < 2.85) {
      // GLOW OFF (Dark metallic state)
      neonPower = 0.01;
    } else {
      // Pre-strike simmer
      const charge = (tau - 2.85) / 0.15;
      neonPower = charge * 0.35;
    }

    // Animate material emissive intensity fallback & color in electric blue
    if (skinHeadMatRef.current) {
      skinHeadMatRef.current.emissive.set('#0077FF');
      skinHeadMatRef.current.emissiveIntensity = Math.max(0.02, neonPower * 2.2);
    }

    // Animate targeted neck electric blue point light
    if (bonesRef.current.neckUpper) {
      const neckLight = bonesRef.current.neckUpper.getObjectByName('NeckElectricLight') as THREE.PointLight | null;
      if (neckLight) {
        neckLight.color.set('#00D2FF');
        neckLight.intensity = Math.max(0.02, neonPower * 3.6);
      }
    }

    // Head tracking (active when assembly is near complete)
    const trackWeight = Math.min(1.0, Math.max(0.0, (assemblyProgress - 0.85) / 0.15));

    const targetYaw = pointer.x * 0.45 * trackWeight;
    const targetPitch = -pointer.y * 0.25 * trackWeight;
    const targetRoll = -pointer.x * pointer.y * 0.04 * trackWeight;

    currentYawRef.current = THREE.MathUtils.damp(currentYawRef.current, targetYaw, 7.5, delta);
    currentPitchRef.current = THREE.MathUtils.damp(currentPitchRef.current, targetPitch, 7.5, delta);
    currentRollRef.current = THREE.MathUtils.damp(currentRollRef.current, targetRoll, 7.5, delta);

    const yaw = currentYawRef.current;
    const pitch = currentPitchRef.current;
    const roll = currentRollRef.current;

    const bones = bonesRef.current;
    const base = baseRotationsRef.current;

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

// Scene Assembly Controller
function AssemblyController({
  onProgressUpdate,
  resetSignal,
}: {
  onProgressUpdate: (p: number) => void;
  resetSignal: number;
}) {
  const progressRef = useRef(0);

  useEffect(() => {
    progressRef.current = 0;
  }, [resetSignal]);

  useFrame((_, delta) => {
    if (progressRef.current < 1.0) {
      // ~3.6s assemble duration
      progressRef.current = Math.min(1.0, progressRef.current + delta * 0.28);
      onProgressUpdate(progressRef.current);
    }
  });

  return null;
}

export function MiaModel({ className = '', showStatusLabel = true }: MiaModelProps) {
  const [mounted, setMounted] = useState(false);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const [assemblyProgress, setAssemblyProgress] = useState(0);
  const [resetCount, setResetCount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleReassemble = () => {
    setAssemblyProgress(0);
    setResetCount((prev) => prev + 1);
  };

  if (!mounted) {
    return (
      <div className={`relative w-full h-full min-h-[100dvh] flex items-center justify-center bg-[#070A14] ${className}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#38BDF8]/30 border-t-[#38BDF8] animate-spin" />
          <p className="text-xs font-mono text-[#8AE4FA] uppercase tracking-widest animate-pulse">
            INITIALIZING 4K NEURAL ASSEMBLY...
          </p>
        </div>
      </div>
    );
  }

  const isAssembling = assemblyProgress < 1.0;
  const progressPercent = Math.min(100, Math.floor(assemblyProgress * 100));

  return (
    <div
      className={`relative w-full h-[100dvh] min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#070A14] select-none touch-pan-y ${className}`}
    >
      {/* 1. Exact 100% Night Sky Background with Twinkling Stars & Shooting Comets */}
      <NightSkyBackground />

      {/* 2. 4K Ultra-HD 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 w-full h-full z-10">
        <Canvas
          dpr={[1, 2]} // 4K / High-DPI Resolution
          camera={{ position: [0, 0.05, 1.85], fov: 36 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.16,
          }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Timeline Animation Controller */}
          <AssemblyController
            onProgressUpdate={setAssemblyProgress}
            resetSignal={resetCount}
          />

          {/* 4K Studio Lighting */}
          <StudioLighting />

          {/* Realistic PBR Environment Reflections for 4K Leather & Chrome Hardware */}
          <Environment preset="city" environmentIntensity={0.4} />

          {/* 3D Holographic Laser Scan Grid */}
          <HoloScanLaser progress={assemblyProgress} />

          {/* Single-Pixel Quantum Assembly Particle Engine */}
          <HoloPixelAssembly progress={assemblyProgress} />

          {/* 4K Model with Face/Head Tracking & Electric Neck Glow */}
          <Suspense fallback={null}>
            <Model
              assemblyProgress={assemblyProgress}
              onPointerUpdate={(x, y) => {
                setMouseCoords({
                  x: Number(x.toFixed(2)),
                  y: Number(y.toFixed(2)),
                });
              }}
            />
          </Suspense>

          {/* User Interaction OrbitControls */}
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

      {/* 3. High-Tech Cybernetic Holographic HUD Assembly Telemetry */}
      {isAssembling && (
        <CyberAssemblyHUD
          progress={assemblyProgress}
          onReassemble={handleReassemble}
        />
      )}

      {/* Corner Tech Brackets with Live Tracking Telemetry */}
      <div className="absolute top-28 left-6 sm:left-12 pointer-events-none select-none z-20 hidden md:block">
        <div className="flex flex-col gap-1 text-[10px] font-mono text-[#38BDF8]/70 tracking-wider">
          <div className="flex items-center gap-1.5 text-[#38BDF8]">
            <span className="inline-block w-2 h-2 border-t-2 border-l-2 border-[#38BDF8]" />
            <span>{isAssembling ? 'NEURAL_MATRIX // ASSEMBLING' : 'FACE_TRACKING // ACTIVE'}</span>
          </div>
          <span className="text-[9px] text-[#94A3B8]/70 font-mono">
            TARGET_LOCK: [{mouseCoords.x >= 0 ? `+${mouseCoords.x}` : mouseCoords.x},{' '}
            {mouseCoords.y >= 0 ? `+${mouseCoords.y}` : mouseCoords.y}]
          </span>
        </div>
      </div>

      <div className="absolute top-28 right-6 sm:right-12 pointer-events-none select-none z-20 hidden md:block text-right">
        <div className="flex flex-col gap-1 text-[10px] font-mono text-[#C084FC]/70 tracking-wider items-end">
          <div className="flex items-center gap-1.5 text-[#C084FC]">
            <span>ELECTRIC_NECK // GLOWING</span>
            <span className="inline-block w-2 h-2 border-t-2 border-r-2 border-[#C084FC]" />
          </div>
          <span className="text-[9px] text-[#94A3B8]/70 font-mono">4K RESOLUTION // 60 FPS</span>
        </div>
      </div>

      {/* Interactive Control Hint Pill & Re-assemble Trigger */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col sm:flex-row items-center gap-3 select-none z-20">
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0D1527]/85 border border-[#38BDF8]/40 backdrop-blur-md text-[11px] font-mono text-[#8AE4FA] shadow-[0_0_25px_rgba(56,189,248,0.25)] pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
          <span className="tracking-wider">MOVE CURSOR TO FOCUS FACE // DRAG TO ROTATE</span>
        </div>

        {/* Re-assemble Button */}
        <button
          onClick={handleReassemble}
          className="px-3 py-1 rounded-full bg-[#090D1A]/90 border border-[#38BDF8]/50 hover:border-[#00F0FF] hover:bg-[#38BDF8]/20 transition-all text-[10px] font-mono text-[#38BDF8] hover:text-[#FFFFFF] uppercase tracking-widest cursor-pointer shadow-[0_0_15px_rgba(56,189,248,0.2)]"
        >
          ↻ RE-ASSEMBLE 4K
        </button>
      </div>

      {/* Online Status HUD */}
      {showStatusLabel && (
        <div className="absolute right-4 sm:right-8 lg:right-20 top-20 sm:top-24 pointer-events-none select-none z-30">
          <div className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg bg-[#0F172A]/90 border border-[#38BDF8]/40 backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,0.25)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#8AE4FA] uppercase">
              {isAssembling ? `ASSEMBLING // ${progressPercent}%` : 'MIA // 4K ONLINE'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MiaModel;
