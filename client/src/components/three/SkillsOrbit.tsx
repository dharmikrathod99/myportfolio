'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Float, Billboard, Text } from '@react-three/drei';

const SKILLS = [
  { name: 'React', color: '#38BDF8' },
  { name: 'Node.js', color: '#0EA5E9' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'MongoDB', color: '#0284C7' },
  { name: 'Next.js', color: '#FFFFFF' },
  { name: 'Three.js', color: '#1818E7' },
  { name: 'Express', color: '#94A3B8' },
  { name: 'Python', color: '#38BDF8' },
  { name: 'Docker', color: '#2496ED' },
  { name: 'AWS', color: '#0EA5E9' },
  { name: 'GraphQL', color: '#FF299B' },
  { name: 'Tailwind', color: '#38BDF8' },
];

function SkillOrb({ name, color, position, index }: {
  name: string;
  color: string;
  position: [number, number, number];
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      // Orbital motion
      const angle = t * 0.15 + (index * (Math.PI * 2)) / SKILLS.length;
      const radius = 6 + Math.sin(t * 0.3 + index) * 0.5;
      groupRef.current.position.x = Math.cos(angle) * radius;
      groupRef.current.position.z = Math.sin(angle) * radius;
      groupRef.current.position.y = Math.sin(t * 0.4 + index * 0.8) * 1.5;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.5;
      meshRef.current.rotation.x = Math.sin(t + index) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Glowing Sphere */}
        <mesh ref={meshRef} scale={0.6}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.2}
            wireframe
          />
        </mesh>

        {/* Label Billboard */}
        <Billboard position={[0, 1.2, 0]}>
          <Text
            fontSize={0.3}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {name}
          </Text>
        </Billboard>

        {/* Glow point light */}
        <pointLight intensity={0.3} color={color} distance={4} />
      </Float>
    </group>
  );
}

export default function SkillsOrbit() {
  return (
    <group position={[0, -8, 0]}>
      {/* Central core */}
      <mesh scale={0.8}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#3A86FF"
          emissive="#3A86FF"
          emissiveIntensity={0.6}
          metalness={0.9}
          roughness={0.1}
          wireframe
        />
      </mesh>

      {/* Orbit ring visual */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[6, 0.015, 8, 100]} />
        <meshBasicMaterial color="#3A86FF" transparent opacity={0.3} />
      </mesh>

      {/* Skill Orbs */}
      {SKILLS.map((skill, i) => (
        <SkillOrb
          key={skill.name}
          name={skill.name}
          color={skill.color}
          position={[0, 0, 0]}
          index={i}
        />
      ))}

      {/* Section Label */}
      <Billboard position={[0, 4, 0]}>
        <Text
          fontSize={0.6}
          color="#3A86FF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#FFFFFF"
          letterSpacing={0.15}
        >
          SKILLS & TECHNOLOGIES
        </Text>
      </Billboard>
    </group>
  );
}
