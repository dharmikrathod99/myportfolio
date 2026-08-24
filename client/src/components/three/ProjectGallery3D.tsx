'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Float, Billboard, Text, RoundedBox } from '@react-three/drei';
import { PORTFOLIO_DATA, Project } from '@/data/portfolioData';

function ProjectCard3D({ project, index, total }: {
  project: Project;
  index: number;
  total: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      // Gentle floating
      groupRef.current.position.y += Math.sin(t * 0.5 + index * 1.2) * 0.001;
      groupRef.current.rotation.y = Math.sin(t * 0.2 + index) * 0.05;
    }
  });

  // Arrange in a circular spiral
  const angle = (index / total) * Math.PI * 2;
  const radius = 8;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = (index - total / 2) * 0.8;

  return (
    <group ref={groupRef} position={[x, y, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
        {/* Card Background */}
        <RoundedBox args={[4, 2.5, 0.1]} radius={0.15} smoothness={4}>
          <meshStandardMaterial
            color="#0A0F18"
            metalness={0.6}
            roughness={0.3}
            transparent
            opacity={0.9}
          />
        </RoundedBox>

        {/* Blue accent border glow */}
        <RoundedBox args={[4.08, 2.58, 0.08]} radius={0.17} smoothness={4} position={[0, 0, -0.02]}>
          <meshBasicMaterial
            color="#3A86FF"
            transparent
            opacity={0.2}
          />
        </RoundedBox>

        {/* Project Title */}
        <Billboard position={[0, 0.5, 0.1]}>
          <Text
            fontSize={0.28}
            color="#3A86FF"
            anchorX="center"
            anchorY="middle"
            maxWidth={3.5}
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {project.title}
          </Text>
        </Billboard>

        {/* Category Badge */}
        <Billboard position={[0, -0.15, 0.1]}>
          <Text
            fontSize={0.15}
            color="#3A86FF"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.1}
          >
            {project.category.toUpperCase()}
          </Text>
        </Billboard>

        {/* Subtitle */}
        <Billboard position={[0, -0.6, 0.1]}>
          <Text
            fontSize={0.13}
            color="#94A3B8"
            anchorX="center"
            anchorY="middle"
            maxWidth={3.5}
          >
            {project.description.slice(0, 80)}...
          </Text>
        </Billboard>

        {/* Small glow */}
        <pointLight intensity={0.25} color="#3A86FF" distance={3} position={[0, 0, 1]} />
      </Float>
    </group>
  );
}

export default function ProjectGallery3D() {
  const projects = PORTFOLIO_DATA.projects.slice(0, 6);

  return (
    <group position={[0, -20, 0]}>
      {/* Section Label */}
      <Billboard position={[0, 5, 0]}>
        <Text
          fontSize={0.6}
          color="#3A86FF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
          letterSpacing={0.15}
        >
          FEATURED PROJECTS
        </Text>
      </Billboard>

      {/* Project Cards */}
      {projects.map((project, i) => (
        <ProjectCard3D
          key={project.id}
          project={project}
          index={i}
          total={projects.length}
        />
      ))}

      {/* Center ambient glow */}
      <mesh position={[0, 0, 0]} scale={2}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#3A86FF" transparent opacity={0.03} />
      </mesh>
    </group>
  );
}
