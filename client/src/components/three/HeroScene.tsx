'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

export default function HeroScene() {
  const particlesRef = useRef<THREE.Points>(null);
  const icoRef = useRef<THREE.Mesh>(null);

  // Generate star field positions
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return positions;
  }, []);

  const particleSizes = useMemo(() => {
    const sizes = new Float32Array(2000);
    for (let i = 0; i < 2000; i++) {
      sizes[i] = Math.random() * 0.08 + 0.02;
    }
    return sizes;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.02;
      particlesRef.current.rotation.x = Math.sin(t * 0.01) * 0.1;
    }

    if (icoRef.current) {
      icoRef.current.rotation.x = t * 0.15;
      icoRef.current.rotation.y = t * 0.1;
      icoRef.current.rotation.z = t * 0.05;
    }
  });

  return (
    <group position={[0, 2, 0]}>
      {/* Particle Star Field */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2000}
            array={particlePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={2000}
            array={particleSizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#3A86FF"
          size={0.12}
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Floating Wireframe Icosahedron */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={icoRef} position={[0, -2, -2]}>
          <icosahedronGeometry args={[2.5, 1]} />
          <meshBasicMaterial
            color="#3A86FF"
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>
      </Float>

      {/* Outer Glow Ring */}
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh position={[0, -2, -2]} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[3.2, 0.02, 16, 100]} />
          <meshBasicMaterial color="#60A5FA" transparent opacity={0.4} />
        </mesh>
      </Float>

      {/* Accent Light Sources */}
      <pointLight position={[10, 10, 10]} intensity={0.6} color="#3A86FF" />
      <pointLight position={[-10, -5, 5]} intensity={0.3} color="#94A3B8" />
      <pointLight position={[0, 5, -10]} intensity={0.2} color="#E2E8F0" />
    </group>
  );
}
