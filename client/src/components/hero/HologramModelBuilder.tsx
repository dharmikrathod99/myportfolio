'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export interface HologramModelBuilderProps {
  progress: number; // 0 to 100
  isComplete: boolean;
  onDissolveFinish?: () => void;
}

// -------------------------------------------------------------
// HIGH-TECH SCI-FI HOLOGRAPHIC SCANNER SHADER
// -------------------------------------------------------------
const HologramScanShader = {
  uniforms: {
    uTime: { value: 0 },
    uLaserY: { value: -0.85 },
    uProgress: { value: 0 },
    uDissolve: { value: 0 },
    uColorA: { value: new THREE.Color('#00F0FF') }, // Electric Cyan
    uColorB: { value: new THREE.Color('#8B5CF6') }, // Neon Purple
    uColorLaser: { value: new THREE.Color('#FFFFFF') },
  },
  vertexShader: `
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uLaserY;
    uniform float uDissolve;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      
      // Dynamic excitation ripple near the active laser line
      float dist = abs(worldPos.y - uLaserY);
      float ripple = exp(-dist * 12.0) * sin(uTime * 30.0 + position.y * 15.0) * 0.01;
      
      if (uDissolve > 0.0) {
        worldPos.xyz += normal * (uDissolve * 0.3) + vec3(
          sin(uTime * 15.0 + position.x * 8.0) * uDissolve * 0.08,
          uDissolve * 0.15,
          cos(uTime * 15.0 + position.z * 8.0) * uDissolve * 0.08
        );
      } else {
        worldPos.xyz += normal * ripple;
      }

      vWorldPosition = worldPos.xyz;
      vViewDir = normalize(cameraPosition - worldPos.xyz);
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uLaserY;
    uniform float uProgress;
    uniform float uDissolve;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorLaser;

    void main() {
      float diff = vWorldPosition.y - uLaserY;
      
      // Intense laser synthesis line
      float laserBand = exp(-pow(diff * 20.0, 2.0));
      
      // Build-up factor: parts below the laser are active
      float isBuilt = smoothstep(0.05, -0.05, diff);
      
      // Vertical holographic scanline sweep
      float scanline = sin(vWorldPosition.y * 100.0 - uTime * 6.0) * 0.25 + 0.75;
      
      // Fresnel rim glow
      float fresnel = pow(1.0 - max(0.0, dot(vNormal, vViewDir)), 2.0);
      
      // Color gradient: Cyan core, Purple rim, Pure White laser plane
      vec3 col = mix(uColorA, uColorB, fresnel * 0.7);
      col = mix(col, uColorLaser, laserBand * 0.9);
      
      // Below laser: active luminous hologram. Above laser: faint blueprint anticipation
      float alpha = mix(0.12, 0.75 + fresnel * 0.4, isBuilt);
      alpha += laserBand * 0.7;
      alpha *= scanline;
      
      if (uDissolve > 0.0) {
        alpha *= max(0.0, 1.0 - uDissolve);
      }
      
      if (alpha < 0.02) discard;
      
      gl_FragColor = vec4(col, alpha);
    }
  `,
};

export default function HologramModelBuilder({
  progress = 0,
  isComplete = false,
  onDissolveFinish,
}: HologramModelBuilderProps) {
  const groupRef = useRef<THREE.Group>(null);
  const laserGroupRef = useRef<THREE.Group>(null);
  const sparksRef = useRef<THREE.Points>(null);
  const gyroRef = useRef<THREE.Group>(null);
  const pedestalRef = useRef<THREE.Group>(null);
  const dissolveProgressRef = useRef(0);
  const isDissolvingRef = useRef(false);

  // Normalized laser height: from base (-0.85) to head height (0.45)
  const targetLaserY = useMemo(() => {
    return -0.85 + (Math.min(100, Math.max(0, progress)) / 100) * 1.30;
  }, [progress]);

  const currentLaserY = useRef(-0.85);

  // Shader materials
  const wireMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(HologramScanShader.uniforms),
      vertexShader: HologramScanShader.vertexShader,
      fragmentShader: HologramScanShader.fragmentShader,
      wireframe: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
  }, []);

  const solidMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(HologramScanShader.uniforms),
      vertexShader: HologramScanShader.vertexShader,
      fragmentShader: HologramScanShader.fragmentShader,
      wireframe: false,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
  }, []);

  // Anatomical contour slices (cross-sections forming a sleek humanoid silhouette)
  const contourSlices = useMemo(() => {
    const slices: { y: number; rx: number; rz: number; segments: number }[] = [];
    const count = 28;
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const y = -0.75 + t * 1.15; // from y = -0.75 up to y = 0.40

      let rx = 0.2;
      let rz = 0.16;

      if (y < -0.4) {
        // Waist & lower torso
        rx = 0.22 + (y + 0.75) * 0.15;
        rz = 0.18 + (y + 0.75) * 0.12;
      } else if (y < -0.05) {
        // Chest & Shoulders (flared)
        const st = (y + 0.4) / 0.35;
        rx = 0.26 + Math.sin(st * Math.PI) * 0.16;
        rz = 0.18 + Math.sin(st * Math.PI) * 0.08;
      } else if (y < 0.12) {
        // Neck (tapered)
        rx = 0.11;
        rz = 0.11;
      } else {
        // Cranial Head silhouette
        const ht = (y - 0.12) / 0.28;
        const radius = Math.sin(ht * Math.PI) * 0.18;
        rx = Math.max(0.04, radius * 1.05);
        rz = Math.max(0.04, radius * 1.15);
      }

      slices.push({ y, rx, rz, segments: 32 });
    }
    return slices;
  }, []);

  // Photon assembly spark particles
  const { sparkPositions, sparkVelocities } = useMemo(() => {
    const count = 100;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 0.25 + Math.random() * 0.18;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.04;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      velocities[i * 3] = (Math.random() - 0.5) * 0.015;
      velocities[i * 3 + 1] = Math.random() * 0.03 + 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.015;
    }
    return { sparkPositions: positions, sparkVelocities: velocities };
  }, []);

  useEffect(() => {
    if (isComplete) {
      isDissolvingRef.current = true;
    }
  }, [isComplete]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Smooth laser Y interpolation
    currentLaserY.current += (targetLaserY - currentLaserY.current) * 0.14;

    if (isDissolvingRef.current) {
      dissolveProgressRef.current = Math.min(1.0, dissolveProgressRef.current + delta * 2.0);
      if (dissolveProgressRef.current >= 1.0) {
        if (groupRef.current) {
          groupRef.current.visible = false;
        }
        if (onDissolveFinish) {
          onDissolveFinish();
        }
      }
    }

    const dissolveVal = dissolveProgressRef.current;

    // Update shaders
    [wireMat, solidMat].forEach((mat) => {
      mat.uniforms.uTime.value = time;
      mat.uniforms.uLaserY.value = currentLaserY.current;
      mat.uniforms.uProgress.value = progress / 100;
      mat.uniforms.uDissolve.value = dissolveVal;
    });

    // Move laser scanning disc
    if (laserGroupRef.current) {
      laserGroupRef.current.position.y = currentLaserY.current;
      laserGroupRef.current.rotation.y = time * 2.0;
      if (dissolveVal > 0) {
        const laserScale = 1.0 + dissolveVal * 0.6;
        laserGroupRef.current.scale.set(laserScale, laserScale, laserScale);
      }
    }

    // Animate sparks
    if (sparksRef.current) {
      const posAttr = sparksRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;
      for (let i = 0; i < array.length / 3; i++) {
        const i3 = i * 3;
        array[i3 + 1] += sparkVelocities[i3 + 1];
        if (array[i3 + 1] > 0.12) {
          array[i3 + 1] = -0.04;
          const angle = Math.random() * Math.PI * 2;
          const radius = 0.24 + Math.random() * 0.16;
          array[i3] = Math.cos(angle) * radius;
          array[i3 + 2] = Math.sin(angle) * radius;
        }
      }
      posAttr.needsUpdate = true;
    }

    // Gyroscope core rotation
    if (gyroRef.current) {
      gyroRef.current.rotation.x = time * 1.2;
      gyroRef.current.rotation.y = time * 1.8;
      gyroRef.current.rotation.z = time * 0.8;
    }

    // Base pedestal counter-rotation
    if (pedestalRef.current) {
      pedestalRef.current.children.forEach((c, idx) => {
        c.rotation.z += (idx % 2 === 0 ? 1 : -1) * delta * 0.6;
      });
    }

    if (groupRef.current) {
      if (dissolveVal > 0) {
        const s = 1.0 + dissolveVal * 0.05;
        groupRef.current.scale.set(s, s, s);
        groupRef.current.position.y = Math.sin(time * 2.0) * 0.012 + dissolveVal * 0.03;
      } else {
        groupRef.current.scale.set(1.0, 1.0, 1.0);
        groupRef.current.position.y = Math.sin(time * 2.0) * 0.012;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ========================================================= */}
      {/* 1. CYLINDRICAL HOLOGRAPHIC CONTAINMENT SCANNER MATRIX     */}
      {/* ========================================================= */}
      <mesh position={[0, -0.15, 0]} material={wireMat}>
        <cylinderGeometry args={[0.48, 0.52, 1.45, 24, 18, true]} />
      </mesh>

      {/* ========================================================= */}
      {/* 2. ANATOMICAL CONTOUR SCAN SLICES (CLEAN SCI-FI BLUEPRINT) */}
      {/* ========================================================= */}
      <group position={[0, 0, 0]}>
        {contourSlices.map((slice, idx) => (
          <mesh
            key={idx}
            position={[0, slice.y, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[slice.rx, slice.rz, 1]}
          >
            <ringGeometry args={[0.96, 1.0, slice.segments]} />
            <meshBasicMaterial
              color="#00F0FF"
              transparent
              opacity={0.55}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}

        {/* Central Vertical Spine Conduit */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.35, 8]} />
          <meshBasicMaterial color="#00F0FF" transparent opacity={0.6} />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* 3. QUANTUM GYROSCOPE CORE REACTOR (IN CHEST)             */}
      {/* ========================================================= */}
      <group position={[0, -0.15, 0]}>
        <group ref={gyroRef}>
          <mesh>
            <ringGeometry args={[0.07, 0.076, 24]} />
            <meshBasicMaterial color="#00F0FF" side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.055, 0.061, 24]} />
            <meshBasicMaterial color="#8B5CF6" side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
          <mesh>
            <octahedronGeometry args={[0.035, 0]} />
            <meshBasicMaterial color="#FFFFFF" wireframe />
          </mesh>
        </group>
        <pointLight color="#00F0FF" intensity={1.5} distance={1.2} />
      </group>

      {/* ========================================================= */}
      {/* 4. ACTIVE LASER SCANNING RING & PHOTON SPARKS             */}
      {/* ========================================================= */}
      <group ref={laserGroupRef} position={[0, -0.85, 0]}>
        {/* Intense Neon Laser Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.26, 0.44, 48]} />
          <meshBasicMaterial
            color="#00F0FF"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Outer Plasma Halo Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.44, 0.56, 36]} />
          <meshBasicMaterial
            color="#8B5CF6"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Laser Plane Fill */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.26, 32]} />
          <meshBasicMaterial
            color="#00F0FF"
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        <pointLight color="#00F0FF" intensity={2.5} distance={1.8} />

        {/* Spark Particles */}
        <points ref={sparksRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[sparkPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.02}
            color="#FFFFFF"
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>

      {/* ========================================================= */}
      {/* 5. BASE ROTATING CYBER PEDESTAL                           */}
      {/* ========================================================= */}
      <group position={[0, -0.82, 0]}>
        <group ref={pedestalRef} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <ringGeometry args={[0.62, 0.66, 48]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.45} side={THREE.DoubleSide} wireframe />
          </mesh>
          <mesh position={[0, 0, 0.005]}>
            <ringGeometry args={[0.48, 0.52, 32]} />
            <meshBasicMaterial color="#00F0FF" transparent opacity={0.65} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <ringGeometry args={[0.32, 0.36, 24]} />
            <meshBasicMaterial color="#8B5CF6" transparent opacity={0.5} side={THREE.DoubleSide} />
          </mesh>
        </group>
        {/* Floor Guide Beams */}
        {[-0.45, 0.45].map((x) =>
          [-0.45, 0.45].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0.65, z]}>
              <cylinderGeometry args={[0.0015, 0.0015, 1.3, 4]} />
              <meshBasicMaterial color="#00F0FF" transparent opacity={0.35} />
            </mesh>
          ))
        )}
      </group>
    </group>
  );
}
