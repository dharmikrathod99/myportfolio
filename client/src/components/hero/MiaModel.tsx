'use client';

import React, { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls, useTexture, Environment, useProgress } from '@react-three/drei';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { motion, AnimatePresence } from 'framer-motion';
import NightSkyBackground from './NightSkyBackground';
import CyberAssemblyHUD from './CyberAssemblyHUD';
import HologramModelBuilder from './HologramModelBuilder';
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
  hairstyle = 'flowing',
}: {
  onPointerUpdate?: (x: number, y: number) => void;
  hairstyle?: HairstyleId;
}) {
  const group = useRef<THREE.Group>(null);
  const bonesRef = useRef<CharacterFaceBones>({});
  const baseRotationsRef = useRef<BaseBoneRotations>({});
  const skinHeadMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const neckLightRef = useRef<THREE.PointLight | null>(null);
  const [headBone, setHeadBone] = useState<THREE.Bone | null>(null);

  const uniformsRef = useRef<{ uTime: { value: number } }>({
    uTime: { value: 0 },
  });

  const hairMeshesRef = useRef<{
    undercutScalp?: THREE.Mesh;
    undercutHair?: THREE.Mesh;
    samuraiBun?: THREE.Mesh;
    halfUpHair?: THREE.Mesh;
    halfUpScalp?: THREE.Mesh;
    hairExtra1?: THREE.SkinnedMesh;
    hairExtra2?: THREE.SkinnedMesh;
  }>({});

  // Smooth interpolated angles for natural eye gaze tracking
  const currentEyeYawRef = useRef(0);
  const currentEyePitchRef = useRef(0);
  const pointerTargetRef = useRef({ x: 0, y: 0, isHovered: false });

  // Global mouse tracking: works across the entire viewport and detects mouseleave
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      pointerTargetRef.current = { x, y, isHovered: true };
    };

    const handlePointerLeave = () => {
      pointerTargetRef.current = { x: 0, y: 0, isHovered: false };
    };

    const handleBlur = () => {
      pointerTargetRef.current = { x: 0, y: 0, isHovered: false };
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Load GLTF model, custom head beauty diffuse map, smoothed normal map, neck emissive map, and eye maps
  const { scene, animations } = useGLTF('/models/mia.glb', true, true, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
  const neckEmissiveMap = useTexture('/models/neck_emissive.png?v=7');
  const headDiffuseMap = useTexture('/models/head_diffuse.png?v=8');
  const headNormalMap = useTexture('/models/head_normal.png?v=6');
  const eyeDiffuseMap = useTexture('/models/eye_diffuse.png?v=3');
  const eyeNormalMap = useTexture('/models/eye_normal.png?v=3');

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
  }, [neckEmissiveMap, eyeDiffuseMap, eyeNormalMap]);

  const headMeshRef = useRef<THREE.Mesh | null>(null);

  // Filter out morph target eyelid blink tracks and eye bone tracks so eyes stay completely static
  const filteredAnimations = useMemo(() => {
    return animations.map((clip) => {
      const cloned = clip.clone();
      cloned.tracks = cloned.tracks.filter((track) => {
        const tname = track.name.toLowerCase();
        const isEyeTrack = tname.includes('eye');
        const isMorphTrack = tname.includes('morphtarget') || tname.includes('target_') || tname.includes('weights');
        return !isEyeTrack && !isMorphTrack;
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

          // 2C. Luxurious, Silky, Jet Black Hair & Scalp Styling
          if (
            matName.includes('Hair_Transparency') ||
            matName.includes('Hair_2_Transparency') ||
            matName.includes('Hair_3_Transparency')
          ) {
            const hairMat = mat as THREE.MeshStandardMaterial;
            hairMat.transparent = true;
            hairMat.alphaTest = 0.08;
            hairMat.depthWrite = true;
            hairMat.depthTest = true;
            hairMat.side = THREE.DoubleSide; // Render both sides of each strand card
            hairMat.roughness = 0.28; // Silky specular highlights on black hair
            hairMat.metalness = 0.15;
            hairMat.color = new THREE.Color('#121214'); // Rich, deep dark black hair

            // Enhance strand density so hair looks rich, thick, and lush
            hairMat.onBeforeCompile = (shader) => {
              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <alphatest_fragment>',
                `
                #ifdef USE_ALPHATEST
                  diffuseColor.a = pow(diffuseColor.a, 0.72);
                  if ( diffuseColor.a < alphaTest ) discard;
                #endif
                `
              );
            };
            hairMat.needsUpdate = true;
          }

          if (matName.includes('Scalp_2_Transparency')) {
            const scalpMat = mat as THREE.MeshStandardMaterial;
            scalpMat.transparent = true;
            scalpMat.alphaTest = 0.25; // Clean threshold prevents faint boundary root haze from encroaching on forehead
            scalpMat.depthWrite = true;
            scalpMat.opacity = 1.0;
            scalpMat.roughness = 0.55;
            scalpMat.metalness = 0.05;
            scalpMat.color = new THREE.Color('#121214'); // Rich dark black matching hair
            scalpMat.needsUpdate = true;
          }

          if (matName.includes('Scalp_3_Transparency')) {
            // Scalp 3 belongs to undercut buzzcut which covers forehead - hide completely
            const scalpMat = mat as THREE.MeshStandardMaterial;
            scalpMat.visible = false;
            scalpMat.opacity = 0.0;
            scalpMat.transparent = true;
            scalpMat.needsUpdate = true;
          }
        });

        // Track hair mesh instances for live style switching
        if (child.name === 'Object_56') hairMeshesRef.current.undercutScalp = child as THREE.Mesh;
        if (child.name === 'Object_57') hairMeshesRef.current.undercutHair = child as THREE.Mesh;
        if (child.name === 'Object_59') hairMeshesRef.current.samuraiBun = child as THREE.Mesh;
        if (child.name === 'Object_61') hairMeshesRef.current.halfUpHair = child as THREE.Mesh;
        if (child.name === 'Object_62') hairMeshesRef.current.halfUpScalp = child as THREE.Mesh;
      }

      // 3. Identify Head and Neck bones
      if ((child as THREE.Bone).isBone) {
        const bone = child as THREE.Bone;
        const name = bone.name;

        if (name.includes('Head') || name.toLowerCase().includes('head')) {
          foundBones.head = bone;
          baseRotations.head = bone.rotation.clone();
          setHeadBone(bone);
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
        } else if (name.includes('L_Eye') || name.includes('Eye_048')) {
          foundBones.leftEye = bone;
          baseRotations.leftEye = bone.rotation.clone();
        } else if (name.includes('R_Eye') || name.includes('Eye_047')) {
          foundBones.rightEye = bone;
          baseRotations.rightEye = bone.rotation.clone();
        }
      }
    });

    // 4. Create lush multi-layer hair strands for Object_61 (Half_up_Hair)
    const baseHalfUpHair = hairMeshesRef.current.halfUpHair as THREE.SkinnedMesh | undefined;
    if (baseHalfUpHair && baseHalfUpHair.geometry && baseHalfUpHair.parent) {
      const parent = baseHalfUpHair.parent;

      const createHairLayer = (
        name: string,
        normalOffset: number,
        shiftX: number,
        shiftY: number,
        shiftZ: number
      ) => {
        const clonedGeo = baseHalfUpHair.geometry.clone();
        const pos = clonedGeo.attributes.position;
        const norm = clonedGeo.attributes.normal;
        if (pos && norm) {
          for (let i = 0; i < pos.count; i++) {
            const nx = norm.getX(i);
            const ny = norm.getY(i);
            const nz = norm.getZ(i);
            pos.setXYZ(
              i,
              pos.getX(i) + nx * normalOffset + shiftX,
              pos.getY(i) + ny * normalOffset + shiftY,
              pos.getZ(i) + nz * normalOffset + shiftZ
            );
          }
          pos.needsUpdate = true;
          clonedGeo.computeVertexNormals();
        }

        const layerMesh = new THREE.SkinnedMesh(clonedGeo, baseHalfUpHair.material);
        layerMesh.bind(baseHalfUpHair.skeleton, baseHalfUpHair.bindMatrix);
        layerMesh.name = name;
        layerMesh.frustumCulled = true;
        layerMesh.renderOrder = 2;
        layerMesh.castShadow = false;
        return layerMesh;
      };

      if (!parent.getObjectByName('Half_up_Hair_Extra_1')) {
        const extra1 = createHairLayer('Half_up_Hair_Extra_1', 0.005, 0.003, 0.001, -0.002);
        parent.add(extra1);
        hairMeshesRef.current.hairExtra1 = extra1;
      }

      if (!parent.getObjectByName('Half_up_Hair_Extra_2')) {
        const extra2 = createHairLayer('Half_up_Hair_Extra_2', -0.004, -0.003, -0.001, 0.002);
        parent.add(extra2);
        hairMeshesRef.current.hairExtra2 = extra2;
      }
    }

    bonesRef.current = foundBones;
    baseRotationsRef.current = baseRotations;

    // Play smooth natural walk animation without hand movements to hair/face
    const targetClip = names[0];

    if (targetClip && actions[targetClip]) {
      Object.values(actions).forEach((act) => act?.stop());
      const act = actions[targetClip];
      act?.reset().fadeIn(0.4).play();
      activeActionRef.current = act;
    }
  }, [actions, names, scene, neckEmissiveMap, eyeDiffuseMap, eyeNormalMap]);

  // Default original model hair
  useEffect(() => {
    const { undercutScalp, undercutHair, samuraiBun, halfUpHair, halfUpScalp, hairExtra1, hairExtra2 } = hairMeshesRef.current;
    if (halfUpHair) {
      halfUpHair.visible = true;
      halfUpHair.renderOrder = 2;
    }
    if (halfUpScalp) {
      halfUpScalp.visible = true;
      halfUpScalp.renderOrder = 1;
    }
    if (hairExtra1) {
      hairExtra1.visible = true;
      hairExtra1.renderOrder = 2;
    }
    if (hairExtra2) {
      hairExtra2.visible = true;
      hairExtra2.renderOrder = 2;
    }
    if (samuraiBun) samuraiBun.visible = false;
    if (undercutScalp) undercutScalp.visible = false;
    if (undercutHair) undercutHair.visible = false;
  }, [hairstyle]);

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

    // Ensure eyelids remain open and natural
    if (headMeshRef.current && headMeshRef.current.morphTargetInfluences) {
      headMeshRef.current.morphTargetInfluences.fill(0);
    }

    // Seamlessly loop the walk stride section (0.0s - 2.45s) so no hand-to-head movements ever occur
    if (activeActionRef.current && activeActionRef.current.time >= 2.45) {
      activeActionRef.current.time = 0.0;
    }

    // -------------------------------------------------------------
    // ANATOMICALLY REALISTIC MOUSE-FOLLOWING EYE GAZE TRACKING
    // -------------------------------------------------------------
    // 1. Calculate normalized cursor position with diagonal radius constraint
    const { x, y, isHovered } = pointerTargetRef.current;

    if (onPointerUpdate) {
      onPointerUpdate(isHovered ? x : 0, isHovered ? y : 0);
    }

    let targetEyeYaw = 0.0;
    let targetEyePitch = 0.0;

    if (isHovered) {
      const dist = Math.hypot(x, y);
      const scale = dist > 1.0 ? 1.0 / dist : 1.0;
      const normX = x * scale;
      const normY = y * scale;

      // Subtle, anatomically realistic movement limits:
      // When cursor moves left (normX < 0) -> yaw is negative (looks left)
      // When cursor moves right (normX > 0) -> yaw is positive (looks right)
      // When cursor moves upward (normY > 0) -> pitch is negative (looks slightly upward)
      // When cursor moves downward (normY < 0) -> pitch is positive (looks slightly downward)
      // Eyeballs stay strictly within natural sclera boundaries (~7.5 deg yaw, ~4.5 deg pitch)
      targetEyeYaw = normX * 0.13;
      targetEyePitch = -normY * 0.08;
    }

    // Fluid, human-like easing/interpolation (no snapping, jitter, or unnatural sudden jumps)
    currentEyeYawRef.current = THREE.MathUtils.damp(
      currentEyeYawRef.current,
      targetEyeYaw,
      6.5,
      delta
    );
    currentEyePitchRef.current = THREE.MathUtils.damp(
      currentEyePitchRef.current,
      targetEyePitch,
      6.5,
      delta
    );

    const eyeYaw = currentEyeYawRef.current;
    const eyePitch = currentEyePitchRef.current;

    const bones = bonesRef.current;

    // Static eyes with 0 animation (clean, focused, forward gaze)
    if (bones.leftEye) {
      bones.leftEye.rotation.set(0, 0, 0);
    }
    if (bones.rightEye) {
      bones.rightEye.rotation.set(0, 0, 0);
    }

    if (group.current) {
      group.current.position.set(0, -4.26, 0);
      group.current.rotation.set(0, 0, 0);
    }
  });

  return (
    <group
      ref={group}
      position={[0, -4.26, 0]}
      rotation={[0, 0, 0]}
      scale={1.46}
      dispose={null}
    >
      <primitive object={scene} />
      {headBone && <CyberEarphone headBone={headBone} />}
    </group>
  );
}

// Preload the GLB model asset and textures
useGLTF.preload('/models/mia.glb', true, true, (loader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
});
useTexture.preload('/models/neck_emissive.png?v=7');
useTexture.preload('/models/head_diffuse.png?v=8');
useTexture.preload('/models/head_normal.png?v=6');
useTexture.preload('/models/eye_diffuse.png?v=3');
useTexture.preload('/models/eye_normal.png?v=3');

export function MiaModel({ className = '', showStatusLabel = true }: MiaModelProps) {
  const [mounted, setMounted] = useState(false);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const [hairstyle, setHairstyle] = useState<HairstyleId>('flowing');
  const { lenis } = useSmoothScroll();
  const { setIsSiteLoading } = useTheme();

  // Real Three.js asset loading tracker
  const { active, progress: realProgress, item, loaded, total } = useProgress();
  const [hasCompletedInitialLoad, setHasCompletedInitialLoad] = useState(false);

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

  // 1. Advance targetProgress smoothly
  useEffect(() => {
    if (hasCompletedInitialLoad && !manualTrigger) return;

    if (manualTrigger) {
      targetProgressRef.current = 0;
      isCompletingRef.current = false;
      return;
    }

    if (!active && realProgress === 100) {
      targetProgressRef.current = 100;
    } else {
      targetProgressRef.current = Math.max(targetProgressRef.current, realProgress);
    }
  }, [active, realProgress, hasCompletedInitialLoad, manualTrigger]);

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
        // Continuous smooth ramp for guaranteed visual prestige
        targetProgressRef.current = Math.max(
          targetProgressRef.current,
          Math.min(95, targetProgressRef.current + dt * 55)
        );
        if (!active && realProgress === 100) {
          targetProgressRef.current = 100;
        }
      }

      setDisplayProgress((prev) => {
        const target = targetProgressRef.current;
        if (prev >= 100) return 100;

        const diff = target - prev;
        if (diff <= 0.25 && target >= 100) {
          return 100;
        }

        const step = Math.max(diff * 5.8 * dt, dt * 32);
        return Math.min(target, prev + step);
      });

      animId = requestAnimationFrame(updateProgress);
    };

    animId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animId);
  }, [hasCompletedInitialLoad, manualTrigger, active, realProgress]);

  // 3. Graceful Completion Sequence once displayProgress hits 100
  useEffect(() => {
    if (displayProgress >= 100 && !isCompletingRef.current && (showHUD || manualTrigger)) {
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
  }, [displayProgress, showHUD, manualTrigger, setIsSiteLoading]);

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
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Background Precompilation */}
          <PrecompilePipeline />

          {/* 4K Studio Lighting */}
          <StudioLighting />

          {/* Realistic PBR Environment Reflections */}
          <Environment preset="city" environmentIntensity={0.4} />

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
                onPointerUpdate={(x, y) => {
                  setMouseCoords({
                    x: Number(x.toFixed(2)),
                    y: Number(y.toFixed(2)),
                  });
                }}
              />
            </group>
          </Suspense>

          {/* OrbitControls */}
          <OrbitControls
            target={[0, 0.08, 0]}
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
            <span>EYE_GAZE // TRACKING</span>
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

      {/* Interactive Control Hint Pill, Hairstyle Selector & Re-trigger Button */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col sm:flex-row items-center gap-3 select-none z-20">
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0D1527]/85 border border-[#38BDF8]/40 backdrop-blur-md text-[11px] font-mono text-[#8AE4FA] shadow-[0_0_25px_rgba(56,189,248,0.25)] pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
          <span className="tracking-wider">MOVE CURSOR TO FOCUS EYES // DRAG TO ROTATE</span>
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
