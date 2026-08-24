'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center, Float } from '@react-three/drei';

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
          color="#00FB1B"
          size={0.12}
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Rotating Wireframe Icosahedron */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={icoRef} scale={3}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial
            color="#00FB1B"
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>
      </Float>

      {/* Hero Title - Using simple mesh text since Text3D needs fonts */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
        <group position={[0, 0, 0]}>
          {/* Name */}
          <mesh position={[0, 0.8, 0]}>
            <planeGeometry args={[12, 1.5]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>

          {/* Inner glow sphere */}
          <mesh position={[0, 0, -2]} scale={4}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial
              color="#00FB1B"
              transparent
              opacity={0.03}
            />
          </mesh>
        </group>
      </Float>

      {/* Accent Light Sources */}
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00FB1B" />
      <pointLight position={[-10, -5, 5]} intensity={0.3} color="#A3E635" />
      <pointLight position={[0, 5, -10]} intensity={0.2} color="#FFFFFF" />
    </group>
  );
}
