'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface InteractivePortraitProps {
  baseImageUrl: string;
  revealImageUrl: string;
  blobRadius?: number;
  blobFadeSpeed?: number;
  lingerDuration?: number;
  className?: string;
}

export function InteractivePortrait({
  baseImageUrl,
  revealImageUrl,
  blobRadius = 0.45,
  blobFadeSpeed = 1.2,
  lingerDuration = 0.99,
  className = '',
}: InteractivePortraitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const initScene = () => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) {
        setTimeout(() => initScene(), 50);
        return;
      }

      // Clean up previous instance
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }

      const gu = {
        time: { value: 0 },
        dTime: { value: 0 },
        aspect: { value: width / height },
      };

      const scene = new THREE.Scene();
      scene.background = null; // Transparent background

      const camera = new THREE.OrthographicCamera(
        width / -2, width / 2, height / 2, height / -2, 0.1, 1000
      );
      camera.position.z = 1;

      const dpr = Math.min(window.devicePixelRatio || 1, 3);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(dpr);
      renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
      renderer.toneMapping = THREE.NoToneMapping;
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

      // Fade in after loading
      setTimeout(() => setIsReady(true), 200);

      // Blob class for interactive mouse-following reveal mask
      class Blob {
        renderer: any;
        rtOutput: any;
        prevRenderTarget: any;
        rtScene: any;
        rtCamera: any;
        uniforms: any;

        constructor(renderer: any) {
          this.renderer = renderer;
          const rtWidth = Math.round(width * Math.min(dpr, 2));
          const rtHeight = Math.round(height * Math.min(dpr, 2));

          this.rtOutput = new THREE.WebGLRenderTarget(rtWidth, rtHeight, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
          });
          this.prevRenderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
          });

          this.uniforms = {
            pointer: { value: new THREE.Vector2(10, 10) },
            isHovered: { value: 0 },
            lingerTimer: { value: 0 },
            idleTimer: { value: 0 },
            pointerRadius: { value: blobRadius },
            pointerDuration: { value: blobFadeSpeed },
            lingerDuration: { value: lingerDuration },
            prevFrame: { value: this.prevRenderTarget.texture },
            time: gu.time,
            dTime: gu.dTime,
            aspect: gu.aspect,
          };

          // Mouse & Touch handlers
          const handleMouseEnter = () => {
            this.uniforms.isHovered.value = 1;
            this.uniforms.lingerTimer.value = 0;
            this.uniforms.idleTimer.value = 0;
          };
          const handleMouseMove = (event: MouseEvent) => {
            this.uniforms.isHovered.value = 1;
            this.uniforms.lingerTimer.value = 0;
            this.uniforms.idleTimer.value = 0;
            const rect = container!.getBoundingClientRect();
            this.uniforms.pointer.value.x = ((event.clientX - rect.left) / width) * 2 - 1;
            this.uniforms.pointer.value.y = -(((event.clientY - rect.top) / height)) * 2 + 1;
          };
          const handleTouchMove = (event: TouchEvent) => {
            this.uniforms.isHovered.value = 1;
            this.uniforms.lingerTimer.value = 0;
            this.uniforms.idleTimer.value = 0;
            if (event.touches.length > 0) {
              const rect = container!.getBoundingClientRect();
              const touch = event.touches[0];
              this.uniforms.pointer.value.x = ((touch.clientX - rect.left) / width) * 2 - 1;
              this.uniforms.pointer.value.y = -(((touch.clientY - rect.top) / height)) * 2 + 1;
            }
          };
          const handleMouseLeave = () => {
            this.uniforms.isHovered.value = 0;
            this.uniforms.pointer.value.set(10, 10);
          };

          container!.addEventListener('mouseenter', handleMouseEnter);
          container!.addEventListener('mousemove', handleMouseMove, { passive: true });
          container!.addEventListener('touchstart', handleTouchMove, { passive: true });
          container!.addEventListener('touchmove', handleTouchMove, { passive: true });
          container!.addEventListener('mouseleave', handleMouseLeave);
          container!.addEventListener('touchend', handleMouseLeave, { passive: true });

          const blobMaterial = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: `
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = vec4(position.xy, 0.0, 1.0);
              }
            `,
            fragmentShader: `
              uniform float time, dTime, aspect, isHovered, lingerTimer, idleTimer, pointerRadius, lingerDuration;
              uniform vec2 pointer;
              uniform sampler2D prevFrame;
              varying vec2 vUv;

              float hash(vec2 p) { 
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); 
              }

              float noise(vec2 p) {
                vec2 i = floor(p); 
                vec2 f = fract(p); 
                f = f * f * (3.0 - 2.0 * f);
                float a = hash(i); 
                float b = hash(i + vec2(1.0, 0.0)); 
                float c = hash(i + vec2(0.0, 1.0)); 
                float d = hash(i + vec2(1.0, 1.0));
                return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
              }

              void main() {
                float rVal = texture2D(prevFrame, vUv).r;

                // 1. Manual Hover Expansion (Smooth real-time cursor control)
                if (isHovered > 0.5) {
                  vec2 uv = (vUv - 0.5) * 2.0 * vec2(aspect, 1.0);
                  vec2 mouse = pointer * vec2(aspect, 1.0);
                  vec2 toMouse = uv - mouse;
                  float angle = atan(toMouse.y, toMouse.x);
                  float dist = length(toMouse);

                  float noiseVal = noise(vec2(angle * 3.0 + time * 0.5, dist * 5.0));
                  float noiseVal2 = noise(vec2(angle * 5.0 - time * 0.3, dist * 3.0 + time));
                  float radiusVariation = 0.8 + noiseVal * 0.35 + noiseVal2 * 0.2;
                  float organicRadius = pointerRadius * radiusVariation;

                  float f = 1.0 - smoothstep(organicRadius * 0.05, organicRadius * 1.15, dist);
                  f *= 0.85 + noiseVal * 0.15;
                  rVal += f * 0.35;
                  rVal = clamp(rVal, 0.0, 1.0);
                } 
                // 2. Post-Hover Linger & Smooth Liquid Fade Out
                else if (idleTimer < lingerDuration + 0.25) {
                  if (lingerTimer < lingerDuration) {
                    // Lock manual reveal in place with subtle living shimmer
                    float pulse = sin(time * 2.0 + vUv.y * 8.0 + vUv.x * 4.0) * 0.002;
                    rVal = clamp(rVal + pulse, 0.0, 1.0);
                  } else {
                    // Liquid dissolve decay
                    float wave1 = noise(vUv * 7.0 + vec2(time * 0.9, -time * 0.7));
                    float wave2 = noise(vUv * 14.0 - vec2(time * 0.6, time * 0.8));
                    float ripple = (wave1 * 0.6 + wave2 * 0.4);
                    float decayRate = (dTime / 1.2) * (0.8 + ripple * 0.8);
                    rVal -= decayRate;
                    rVal = clamp(rVal, 0.0, 1.0);
                  }
                }
                // 3. Automatic Ambient Full-Photo Loop (Symmetric Smooth IN & OUT Transitions)
                else {
                  // 5.8s Total Cycle:
                  // 0.0s - 1.6s: Smooth IN-Transition Wave (rolls across whole photo)
                  // 1.6s - 2.9s: Hold 100% full revealed cyber portrait
                  // 2.9s - 4.5s: Smooth OUT-Transition Wave (liquid dissolves back to real photo)
                  // 4.5s - 5.8s: Peaceful rest on clean real photo, then loops
                  float cycle = mod(idleTimer - (lingerDuration + 0.25), 5.8);

                  float autoTarget = 0.0;
                  float waveDist = (1.0 - vUv.y) * 0.75 + vUv.x * 0.25;

                  if (cycle < 1.6) {
                    // Smooth IN-Transition Wave ("Come")
                    float inProg = smoothstep(0.0, 1.0, cycle / 1.6);
                    float nVal = noise(vUv * 5.0 + vec2(time * 0.5, -time * 0.4)) * 0.08;
                    float threshold = inProg * 1.5 - 0.25;
                    autoTarget = smoothstep(waveDist + nVal - 0.35, waveDist + nVal + 0.1, threshold);
                  } else if (cycle < 2.9) {
                    // 100% Full-Photo Hold with soft living pulse
                    float shimmer = sin(time * 1.8 + vUv.y * 6.0) * 0.015;
                    autoTarget = clamp(1.0 + shimmer, 0.0, 1.0);
                  } else if (cycle < 4.5) {
                    // Smooth OUT-Transition Wave ("Go")
                    float outProg = smoothstep(0.0, 1.0, (cycle - 2.9) / 1.6);
                    float nVal = noise(vUv * 5.0 - vec2(time * 0.5, time * 0.4)) * 0.08;
                    float threshold = (1.0 - outProg) * 1.5 - 0.25;
                    autoTarget = smoothstep(waveDist + nVal - 0.35, waveDist + nVal + 0.1, threshold);
                  } else {
                    // Rest state on 100% clean real photo
                    autoTarget = 0.0;
                  }

                  // Ultra-smooth 60fps frame interpolation
                  rVal = mix(rVal, autoTarget, clamp(dTime * 8.5, 0.0, 1.0));
                }

                rVal = clamp(rVal, 0.0, 1.0);
                gl_FragColor = vec4(vec3(rVal), 1.0);
              }
            `,
          });

          this.rtScene = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blobMaterial);
          this.rtCamera = new THREE.Camera();
        }

        render() {
          this.renderer.setRenderTarget(this.rtOutput);
          this.renderer.render(this.rtScene, this.rtCamera);
          this.renderer.setRenderTarget(null);
          const temp = this.prevRenderTarget;
          this.prevRenderTarget = this.rtOutput;
          this.rtOutput = temp;
          this.uniforms.prevFrame.value = this.prevRenderTarget.texture;
        }
      }

      const blob = new Blob(renderer);
      const textureLoader = new THREE.TextureLoader();
      textureLoader.crossOrigin = 'anonymous';

      let baseImage: any;
      let revealImage: any;

      // Update geometries helper — ensures zero cropping of hair or shoulders on any screen
      const updateImageGeometries = (img: any) => {
        if (!img || !baseImage || !revealImage) return;
        // Fit completely inside container with safe padding
        const safeMargin = 0.96;
        const scale = Math.min((width * safeMargin) / img.width, (height * safeMargin) / img.height);
        const planeWidth = img.width * scale;
        const planeHeight = img.height * scale;

        // Position bottom-aligned inside container
        const posY = -(height - planeHeight) / 2;

        baseImage.geometry.dispose();
        baseImage.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
        baseImage.position.set(0, posY, 0);

        revealImage.geometry.dispose();
        revealImage.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
        revealImage.position.set(0, posY, 0.1);
      };

      // Load base image (default visible) with Ultra HD 4K anisotropic texture filtering & pure sRGB colors
      const baseTexture = textureLoader.load(baseImageUrl, (texture: any) => {
        texture.colorSpace = THREE.LinearSRGBColorSpace;
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = maxAnisotropy;
        texture.needsUpdate = true;
        updateImageGeometries(texture.image);
      });

      // Load reveal image (shown on hover) with Ultra HD 4K anisotropic texture filtering & pure sRGB colors
      const revealTexture = textureLoader.load(revealImageUrl, (texture: any) => {
        texture.colorSpace = THREE.LinearSRGBColorSpace;
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = maxAnisotropy;
        texture.needsUpdate = true;
      });

      // Base image mesh (bottom layer) — hides itself smoothly where blob is active
      const baseImageMaterial = new THREE.ShaderMaterial({
        uniforms: {
          texBlob: { value: blob.rtOutput.texture },
          map: { value: baseTexture },
        },
        vertexShader: `
          precision highp float;
          varying vec2 vUv;
          varying vec4 vPosProj;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            vPosProj = gl_Position;
          }
        `,
        fragmentShader: `
          precision highp float;
          uniform sampler2D texBlob;
          uniform sampler2D map;
          varying vec2 vUv;
          varying vec4 vPosProj;

          void main() {
            vec4 texColor = texture2D(map, vUv);
            vec2 blobUV = ((vPosProj.xy / vPosProj.w) + 1.0) * 0.5;
            float blobVal = texture2D(texBlob, blobUV).r;

            // Fade out base image where blob is active
            texColor.a *= (1.0 - smoothstep(0.01, 0.25, blobVal));
            gl_FragColor = texColor;
          }
        `,
        transparent: true,
        depthWrite: false,
        depthTest: false,
      });
      baseImage = new THREE.Mesh(new THREE.PlaneGeometry(width, height), baseImageMaterial);
      scene.add(baseImage);

      // Reveal image mesh (top layer, masked by blob)
      const revealImageMaterial = new THREE.ShaderMaterial({
        uniforms: {
          texBlob: { value: blob.rtOutput.texture },
          map: { value: revealTexture },
        },
        vertexShader: `
          precision highp float;
          varying vec2 vUv;
          varying vec4 vPosProj;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            vPosProj = gl_Position;
          }
        `,
        fragmentShader: `
          precision highp float;
          uniform sampler2D texBlob;
          uniform sampler2D map;
          varying vec2 vUv;
          varying vec4 vPosProj;

          void main() {
            vec2 blobUV = ((vPosProj.xy / vPosProj.w) + 1.0) * 0.5;
            float blobVal = texture2D(texBlob, blobUV).r;

            if (blobVal < 0.001) discard;

            vec4 texColor = texture2D(map, vUv);
            texColor.a *= smoothstep(0.001, 0.95, blobVal);
            gl_FragColor = texColor;
          }
        `,
        transparent: true,
        depthWrite: false,
        depthTest: false,
      });
      revealImage = new THREE.Mesh(new THREE.PlaneGeometry(width, height), revealImageMaterial);
      scene.add(revealImage);

      baseImage.position.z = 0;
      revealImage.position.z = 0.1;

      const clock = new THREE.Clock();
      let animationId: number | null = null;
      let isVisible = true;

      const animate = () => {
        if (!isVisible) {
          animationId = null;
          return;
        }
        const dt = Math.min(clock.getDelta(), 0.1);
        gu.time.value += dt;
        gu.dTime.value = dt;

        // Advance lingerTimer & idleTimer when not hovered
        if (blob.uniforms.isHovered.value < 0.5) {
          blob.uniforms.lingerTimer.value += dt;
          blob.uniforms.idleTimer.value += dt;
        } else {
          blob.uniforms.lingerTimer.value = 0;
          blob.uniforms.idleTimer.value = 0;
        }

        baseImageMaterial.uniforms.texBlob.value = blob.rtOutput.texture;
        revealImageMaterial.uniforms.texBlob.value = blob.rtOutput.texture;
        blob.render();
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
      };

      const startAnimation = () => {
        if (!animationId && isVisible) {
          clock.getDelta(); // reset delta
          animationId = requestAnimationFrame(animate);
        }
      };

      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isVisible = entry?.isIntersecting ?? false;
          if (isVisible) {
            startAnimation();
          } else if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
          }
        },
        { threshold: 0.05 }
      );
      intersectionObserver.observe(container);

      startAnimation();

      // Resize handler
      const handleResize = () => {
        const newWidth = container!.clientWidth;
        const newHeight = container!.clientHeight;
        if (newWidth === 0 || newHeight === 0) return;

        camera.left = newWidth / -2;
        camera.right = newWidth / 2;
        camera.top = newHeight / 2;
        camera.bottom = newHeight / -2;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 3));
        renderer.setSize(newWidth, newHeight);
        gu.aspect.value = newWidth / newHeight;

        if (baseTexture.image) {
          updateImageGeometries(baseTexture.image);
        }
      };
      window.addEventListener('resize', handleResize);

      // Cleanup
      cleanupRef.current = () => {
        intersectionObserver.disconnect();
        window.removeEventListener('resize', handleResize);
        if (animationId) cancelAnimationFrame(animationId);
        if (container && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
        baseTexture.dispose();
        revealTexture.dispose();
        blob.rtOutput.dispose();
        blob.prevRenderTarget.dispose();
        scene.traverse((object: any) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((m: any) => m.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      };
    };

    initScene();

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [baseImageUrl, revealImageUrl, blobRadius, blobFadeSpeed, lingerDuration]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        cursor: 'default',
        overflow: 'visible',
        touchAction: 'pan-y',
        position: 'relative',
      }}
    >
      {/* Loading overlay — fades out when Three.js is ready */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: isReady ? 0 : 1,
          transition: 'opacity 0.8s ease-out',
          pointerEvents: isReady ? 'none' : 'auto',
          zIndex: 10,
        }}
      />
    </div>
  );
}

export default InteractivePortrait;
