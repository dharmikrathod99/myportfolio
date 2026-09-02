import * as THREE from 'three';

export interface ParticleConfig {
  count: number;
  dpr: number;
}

// Brand color palette
const COLOR_PRIMARY = new THREE.Color('#56AEEB');   // Cyan Blue
const COLOR_BRIGHT = new THREE.Color('#8AE4FA');    // Bright Cyan
const COLOR_DARK = new THREE.Color('#4381B7');      // Deep Blue
const COLOR_GOLD = new THREE.Color('#DDA856');      // Gold AI Core
const COLOR_LIGHT_GOLD = new THREE.Color('#DEC890');// Light Gold

export class DKParticleEngine {
  public count: number;
  public geometry: THREE.BufferGeometry;
  public material: THREE.ShaderMaterial;
  public points: THREE.Points;

  // CPU physics arrays
  private currentPositions: Float32Array;
  private targetPositions: Float32Array;
  private velocities: Float32Array;
  private masses: Float32Array;
  private dampings: Float32Array;
  private delays: Float32Array;
  private noiseSeeds: Float32Array;
  private colors: Float32Array;
  private sizes: Float32Array;
  private isCoreArray: Float32Array;

  // Progress metrics
  public realAssemblyProgress: number = 0;
  public isFullyAssembled: boolean = false;
  private energyPulseTriggered: boolean = false;

  // Interaction vectors
  public mousePos3D: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public audioAmplitude: number = 0;

  constructor(config: ParticleConfig) {
    this.count = config.count;

    this.currentPositions = new Float32Array(this.count * 3);
    this.targetPositions = new Float32Array(this.count * 3);
    this.velocities = new Float32Array(this.count * 3);
    this.masses = new Float32Array(this.count);
    this.dampings = new Float32Array(this.count);
    this.delays = new Float32Array(this.count);
    this.noiseSeeds = new Float32Array(this.count * 3);
    this.colors = new Float32Array(this.count * 3);
    this.sizes = new Float32Array(this.count);
    this.isCoreArray = new Float32Array(this.count);

    this.generateHumanoidParticles();
    this.initParticlePhysics();

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.currentPositions, 3));
    this.geometry.setAttribute('customColor', new THREE.BufferAttribute(this.colors, 3));
    this.geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));
    this.geometry.setAttribute('isCore', new THREE.BufferAttribute(this.isCoreArray, 1));

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uAudioAmplitude: { value: 0 },
        uPulse: { value: 0 },
        uPixelRatio: { value: config.dpr },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uAudioAmplitude;
        uniform float uPulse;
        uniform float uPixelRatio;

        attribute vec3 customColor;
        attribute float size;
        attribute float isCore;

        varying vec3 vColor;
        varying float vAlpha;
        varying float vIsCore;

        void main() {
          vColor = customColor;
          vIsCore = isCore;

          vec3 pos = position;

          // React to voice amplitude in mouth/face and core regions
          if (isCore > 0.5 || (pos.y > 0.1 && pos.y < 1.4 && abs(pos.x) < 0.5)) {
            float voiceJitter = sin(uTime * 30.0 + pos.y * 10.0) * uAudioAmplitude * 0.04;
            pos.z += voiceJitter;
            pos.x += voiceJitter * 0.5;
          }

          // Subtle energy pulse on full assembly
          if (uPulse > 0.0) {
            vec3 expandDir = normalize(pos);
            pos += expandDir * uPulse * 0.15;
          }

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          // Point size with voice amplitude boost and depth scaling
          float voiceSizeBoost = 1.0 + (isCore > 0.5 ? uAudioAmplitude * 1.5 : uAudioAmplitude * 0.5);
          gl_PointSize = (size * voiceSizeBoost * uPixelRatio * (280.0 / -mvPosition.z));

          // Soft alpha
          vAlpha = clamp(0.4 + sin(uTime * 2.0 + pos.y * 4.0) * 0.2 + (isCore > 0.5 ? 0.35 : 0.0), 0.2, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        varying float vIsCore;

        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);

          if (dist > 0.5) discard;

          // Smooth radial falloff
          float intensity = smoothstep(0.5, 0.02, dist);
          float coreShimmer = smoothstep(0.18, 0.0, dist) * (vIsCore > 0.5 ? 1.4 : 0.8);

          vec3 finalColor = vColor + vec3(coreShimmer * 0.5);
          gl_FragColor = vec4(finalColor, vAlpha * intensity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(this.geometry, this.material);
  }

  /**
   * Generates mathematical 3D target coordinates for the humanoid structure
   */
  private generateHumanoidParticles() {
    let index = 0;
    const total = this.count;

    // Layer 1: Head & Face Scan Latitudes (35% of particles)
    const headCount = Math.floor(total * 0.35);
    const headSlices = 48;

    for (let s = 0; s < headSlices; s++) {
      const v = s / (headSlices - 1); // 0 (chin) to 1 (top of head)
      const ty = -0.2 + v * 1.55;

      let rx = 0;
      if (v < 0.25) {
        rx = 0.25 + v * 1.3;
      } else if (v < 0.65) {
        rx = 0.58 + Math.sin((v - 0.25) * Math.PI) * 0.08;
      } else {
        const domeV = (v - 0.65) / 0.35;
        rx = Math.sqrt(Math.max(0.01, 1.0 - domeV * domeV)) * 0.62;
      }

      const rz = rx * 0.96;
      const pointsInSlice = Math.floor(headCount / headSlices);

      for (let p = 0; p < pointsInSlice; p++) {
        if (index >= total) break;

        const u = p / pointsInSlice;
        const uAngle = Math.PI * (1.0 - u); // Front semi-arc

        let tx = Math.cos(uAngle) * rx;
        let tz = Math.sin(uAngle) * rz;
        let actualTy = ty;

        // Wave ripples in facial center
        if (v > 0.25 && v < 0.7) {
          const wave = Math.sin(((v - 0.25) / 0.45) * Math.PI);
          actualTy += Math.sin(tx * 16.0) * 0.018 * wave;
        }

        const distFromFaceCore = Math.sqrt(tx * tx + (actualTy - 0.55) * (actualTy - 0.55) * 2.0);
        let col = COLOR_PRIMARY.clone();
        let isCore = 0;

        if (distFromFaceCore < 0.35) {
          // Gold neural face center
          col = COLOR_GOLD.clone().lerp(COLOR_LIGHT_GOLD, 0.4);
          isCore = 1;
        } else if (distFromFaceCore < 0.6) {
          col = COLOR_BRIGHT.clone().lerp(COLOR_GOLD, (0.6 - distFromFaceCore) * 2.5);
        } else {
          col = Math.random() > 0.4 ? COLOR_BRIGHT : COLOR_PRIMARY;
        }

        this.setParticleTarget(index, tx, actualTy, tz, col, 1.4 + Math.random() * 0.8, isCore, 0.1 + (1.0 - v) * 0.4);
        index++;
      }
    }

    // Layer 2: Gold AI Core in Chest & Central Spine (15% of particles)
    const coreCount = Math.floor(total * 0.15);
    for (let c = 0; c < coreCount; c++) {
      if (index >= total) break;

      const r = Math.pow(Math.random(), 1.6) * 0.36;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      // Centered around chest core (y = -0.85)
      const tx = Math.cos(theta) * Math.cos(phi) * r;
      const ty = -0.85 + Math.sin(phi) * r;
      const tz = 0.18 + Math.sin(theta) * Math.cos(phi) * (r * 0.7);

      const col = COLOR_GOLD.clone().lerp(COLOR_LIGHT_GOLD, Math.random() * 0.6);
      this.setParticleTarget(index, tx, ty, tz, col, 2.0 + Math.random() * 1.6, 1, 0.7 + Math.random() * 0.2);
      index++;
    }

    // Layer 3: Neck, Spine & Neural Pathways (15% of particles)
    const neckCount = Math.floor(total * 0.15);
    const neckStreams = 32;
    for (let n = 0; n < neckStreams; n++) {
      const streamV = n / (neckStreams - 1);
      const nxRatio = (streamV - 0.5) * 2.0;
      const isSpine = Math.abs(nxRatio) < 0.28;
      const pts = Math.floor(neckCount / neckStreams);

      for (let p = 0; p < pts; p++) {
        if (index >= total) break;

        const sv = p / (pts - 1);
        const ty = -0.2 - sv * 0.55;
        const width = 0.24 + sv * 0.20;

        let tx = nxRatio * width;
        let tz = Math.sqrt(Math.max(0.01, 1.0 - nxRatio * nxRatio)) * 0.22;

        if (isSpine) {
          tx += Math.sin(sv * Math.PI * 4) * 0.015;
          tz += 0.04;
        }

        const col = isSpine
          ? COLOR_GOLD.clone().lerp(COLOR_LIGHT_GOLD, 0.5)
          : COLOR_BRIGHT.clone().lerp(COLOR_PRIMARY, 0.3);

        this.setParticleTarget(index, tx, ty, tz, col, isSpine ? 1.8 : 1.3, isSpine ? 1 : 0, 0.3 + sv * 0.3);
        index++;
      }
    }

    // Layer 4: Shoulders, Clavicles & Chest Concentric Fiber Streams (30% of particles)
    const shoulderCount = Math.floor(total * 0.30);
    const arcs = 55;
    const ptsPerArc = Math.floor(shoulderCount / arcs);

    for (let a = 0; a < arcs; a++) {
      const arcV = a / (arcs - 1); // 0 to 1

      for (let p = 0; p < ptsPerArc; p++) {
        if (index >= total) break;

        const u = (p / (ptsPerArc - 1)) * 2.0 - 1.0; // -1 to +1
        const absU = Math.abs(u);

        const spanWidth = 0.42 + arcV * 2.1;
        const tx = u * spanWidth;

        // Trapezius and shoulder deltoid curve
        const ty = -0.75 - arcV * 0.85 - (absU * absU) * (0.42 + arcV * 0.55);
        const tz = 0.15 - (absU * absU) * 0.25 - arcV * 0.22;

        let col = COLOR_PRIMARY.clone();
        let isCore = 0;

        if (absU < 0.12 && arcV < 0.35) {
          col = COLOR_GOLD.clone();
          isCore = 1;
        } else if (absU > 0.6) {
          col = COLOR_DARK.clone().lerp(COLOR_PRIMARY, 0.4);
        } else {
          col = COLOR_BRIGHT.clone();
        }

        this.setParticleTarget(index, tx, ty, tz, col, 1.2 + Math.random() * 0.6, isCore, 0.45 + arcV * 0.4);
        index++;
      }
    }

    // Layer 5: Ambient Floating Spark Dust Cloud (Remaining particles)
    while (index < total) {
      const theta = Math.random() * Math.PI * 2;
      const r = 0.8 + Math.random() * 2.2;
      const tx = Math.cos(theta) * r;
      const ty = THREE.MathUtils.lerp(-2.0, 2.2, Math.random());
      const tz = (Math.random() - 0.5) * 1.5;

      const col = Math.random() > 0.5 ? COLOR_BRIGHT : COLOR_PRIMARY;
      this.setParticleTarget(index, tx, ty, tz, col, 0.9 + Math.random() * 0.7, 0, 0.1 + Math.random() * 0.8);
      index++;
    }
  }

  private setParticleTarget(
    i: number,
    tx: number,
    ty: number,
    tz: number,
    color: THREE.Color,
    size: number,
    isCore: number,
    delay: number
  ) {
    this.targetPositions[i * 3] = tx;
    this.targetPositions[i * 3 + 1] = ty;
    this.targetPositions[i * 3 + 2] = tz;

    this.colors[i * 3] = color.r;
    this.colors[i * 3 + 1] = color.g;
    this.colors[i * 3 + 2] = color.b;

    this.sizes[i] = size;
    this.isCoreArray[i] = isCore;
    this.delays[i] = delay;
  }

  /**
   * Initializes initial scattered positions and physics variables
   */
  private initParticlePhysics() {
    for (let i = 0; i < this.count; i++) {
      // Scatter in a wide 3D atmospheric volume
      const spreadR = 6.0 + Math.random() * 8.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      this.currentPositions[i * 3] = Math.cos(theta) * Math.cos(phi) * spreadR;
      this.currentPositions[i * 3 + 1] = Math.sin(phi) * spreadR + 0.4;
      this.currentPositions[i * 3 + 2] = Math.sin(theta) * Math.cos(phi) * spreadR;

      this.velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      this.velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      this.velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      this.masses[i] = 0.8 + Math.random() * 0.6;
      this.dampings[i] = 0.88 + Math.random() * 0.04;

      this.noiseSeeds[i * 3] = Math.random() * 100;
      this.noiseSeeds[i * 3 + 1] = Math.random() * 100;
      this.noiseSeeds[i * 3 + 2] = Math.random() * 100;
    }
  }

  /**
   * Updates physical particle simulation every frame
   */
  public update(deltaTime: number, elapsedTime: number, globalProgressFactor: number) {
    const dt = Math.min(deltaTime, 0.05);
    let convergedParticles = 0;

    const positions = this.currentPositions;
    const targets = this.targetPositions;
    const vels = this.velocities;
    const count = this.count;

    // Mouse forcefield coordinates
    const mx = this.mousePos3D.x;
    const my = this.mousePos3D.y;
    const mouseRadius = 0.85;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const delay = this.delays[i];

      // Particle activation based on staggered delay and assembly phase
      const particleProgress = Math.max(0.0, Math.min(1.0, (globalProgressFactor - delay * 0.3) / 0.7));

      if (particleProgress <= 0.01) {
        // Idle floating before assembly
        positions[idx] += vels[idx];
        positions[idx + 1] += vels[idx + 1];
        positions[idx + 2] += vels[idx + 2];
        continue;
      }

      const cx = positions[idx];
      const cy = positions[idx + 1];
      const cz = positions[idx + 2];

      const tx = targets[idx];
      const ty = targets[idx + 1];
      const tz = targets[idx + 2];

      const dx = tx - cx;
      const dy = ty - cy;
      const dz = tz - cz;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // Check convergence for real assembly percentage (within threshold distance and stabilized)
      if (dist < 0.12) {
        convergedParticles++;
      }

      // Physics Attraction Force: F = dir * strength * distance
      const attractionStrength = 5.8 * particleProgress;
      const forceX = (dx / (dist + 0.001)) * Math.min(dist, 1.5) * attractionStrength;
      const forceY = (dy / (dist + 0.001)) * Math.min(dist, 1.5) * attractionStrength;
      const forceZ = (dz / (dist + 0.001)) * Math.min(dist, 1.5) * attractionStrength;

      // Organic Turbulence / Simplex Noise
      const nSeedX = this.noiseSeeds[idx];
      const nSeedY = this.noiseSeeds[idx + 1];
      const turbulence = (1.0 - Math.min(1.0, particleProgress * 1.2)) * 0.18;
      const noiseX = Math.sin(elapsedTime * 2.5 + nSeedX + cy * 2.0) * turbulence;
      const noiseY = Math.cos(elapsedTime * 2.0 + nSeedY + cx * 2.0) * turbulence;

      // Mouse Physical Forcefield Repulsion
      let mouseRepelX = 0;
      let mouseRepelY = 0;
      let mouseRepelZ = 0;

      if (this.isFullyAssembled) {
        const mdx = cx - mx;
        const mdy = cy - my;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mDist < mouseRadius && mDist > 0.01) {
          const repelForce = (1.0 - mDist / mouseRadius) * 0.6;
          mouseRepelX = (mdx / mDist) * repelForce;
          mouseRepelY = (mdy / mDist) * repelForce;
          mouseRepelZ = repelForce * 0.4;
        }
      }

      // Living idle breathing harmonic oscillation
      let breathZ = 0;
      if (this.isFullyAssembled) {
        breathZ = Math.sin(elapsedTime * 1.8 + cy * 3.5) * 0.008;
      }

      // Velocity Integration
      const mass = this.masses[i];
      const damping = this.dampings[i];

      vels[idx] = (vels[idx] + (forceX + noiseX + mouseRepelX) * dt / mass) * damping;
      vels[idx + 1] = (vels[idx + 1] + (forceY + noiseY + mouseRepelY) * dt / mass) * damping;
      vels[idx + 2] = (vels[idx + 2] + (forceZ + mouseRepelZ + breathZ) * dt / mass) * damping;

      positions[idx] += vels[idx];
      positions[idx + 1] += vels[idx + 1];
      positions[idx + 2] += vels[idx + 2];
    }

    this.geometry.attributes.position.needsUpdate = true;

    // Real Assembly Percentage Calculation
    const calculatedPercent = Math.min(100, Math.floor((convergedParticles / count) * 100));
    this.realAssemblyProgress = calculatedPercent;

    if (calculatedPercent >= 99 && !this.isFullyAssembled) {
      this.isFullyAssembled = true;
    }

    // Update Shader Uniforms
    this.material.uniforms.uTime.value = elapsedTime;
    this.material.uniforms.uAudioAmplitude.value = this.audioAmplitude;
  }

  /**
   * Triggers an elegant energy pulse on completion
   */
  public triggerEnergyPulse() {
    if (this.energyPulseTriggered) return;
    this.energyPulseTriggered = true;

    let pulseVal = 1.0;
    const pulseInterval = setInterval(() => {
      pulseVal -= 0.05;
      if (pulseVal <= 0) {
        this.material.uniforms.uPulse.value = 0;
        clearInterval(pulseInterval);
      } else {
        this.material.uniforms.uPulse.value = pulseVal;
      }
    }, 25);
  }

  public dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
