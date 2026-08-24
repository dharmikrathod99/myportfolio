'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Float, Billboard, Text } from '@react-three/drei';

export default function ContactPortal() {
  const ringRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Portal particles
  const portalParticles = useMemo(() => {
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 1.5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return positions;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.3;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -t * 0.5;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.z = t * 0.1;
    }
  });

  return (
    <group position={[0, -32, 0]}>
      {/* Section Label */}
      <Billboard position={[0, 6, 0]}>
        <Text
          fontSize={0.6}
          color="#3A86FF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
          letterSpacing={0.15}
        >
          GET IN TOUCH
        </Text>
      </Billboard>

      {/* Outer Portal Ring */}
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh ref={ringRef}>
          <torusGeometry args={[3.5, 0.08, 16, 100]} />
          <meshStandardMaterial
            color="#3A86FF"
            emissive="#3A86FF"
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Inner Ring */}
        <mesh ref={innerRingRef}>
          <torusGeometry args={[2.8, 0.04, 12, 80]} />
          <meshStandardMaterial
            color="#60A5FA"
            emissive="#2563EB"
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Portal center glow */}
        <mesh>
          <circleGeometry args={[2.5, 64]} />
          <meshBasicMaterial
            color="#3A86FF"
            transparent
            opacity={0.06}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Portal particles */}
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={500}
              array={portalParticles}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#3A86FF"
            size={0.06}
            transparent
            opacity={0.6}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </Float>

      {/* Contact CTA Text */}
      <Billboard position={[0, 0, 1]}>
        <Text
          fontSize={0.35}
          color="#0A0A0A"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#FFFFFF"
        >
          CONNECT WITH DHARMIK
        </Text>
      </Billboard>

      <Billboard position={[0, -0.6, 1]}>
        <Text
          fontSize={0.18}
          color="#374151"
          anchorX="center"
          anchorY="middle"
        >
          dharmik@tarasakadigital.com
        </Text>
      </Billboard>

      {/* Portal glow lights */}
      <pointLight position={[0, 0, 3]} intensity={1} color="#3A86FF" distance={10} />
      <pointLight position={[0, 0, -2]} intensity={0.5} color="#60A5FA" distance={8} />
    </group>
  );
}
