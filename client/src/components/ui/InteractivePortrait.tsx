'use client';

import React, { useEffect, useRef, useState } from 'react';

interface InteractivePortraitProps {
  baseImageUrl: string;
  revealImageUrl: string;
  blobRadius?: number;
  blobFadeSpeed?: number;
  className?: string;
}

export function InteractivePortrait({
  baseImageUrl,
  revealImageUrl,
  blobRadius = 0.45,
  blobFadeSpeed = 1.2,
  className = '',
}: InteractivePortraitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const loadThreeJS = async () => {
      if ((window as any).THREE) {
        initScene((window as any).THREE);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.async = true;
      script.onload = () => {
        if ((window as any).THREE) {
          initScene((window as any).THREE);
        }
      };
      document.head.appendChild(script);
    };

    const initScene = (THREE: any) => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) {
        setTimeout(() => initScene(THREE), 50);
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

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

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
          this.rtOutput = new THREE.WebGLRenderTarget(width, height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
          });
          this.prevRenderTarget = new THREE.WebGLRenderTarget(width, height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
          });

          this.uniforms = {
            pointer: { value: new THREE.Vector2(10, 10) },
            pointerDown: { value: 1 },
            pointerRadius: { value: blobRadius },
            pointerDuration: { value: blobFadeSpeed },
            prevFrame: { value: this.prevRenderTarget.texture },
            time: gu.time,
            dTime: gu.dTime,
            aspect: gu.aspect,
          };

          // Mouse & Touch handlers
          const handleMouseMove = (event: MouseEvent) => {
            const rect = container!.getBoundingClientRect();
            this.uniforms.pointer.value.x = ((event.clientX - rect.left) / width) * 2 - 1;
            this.uniforms.pointer.value.y = -(((event.clientY - rect.top) / height)) * 2 + 1;
          };
          const handleTouchMove = (event: TouchEvent) => {
            if (event.touches.length > 0) {
              const rect = container!.getBoundingClientRect();
              const touch = event.touches[0];
              this.uniforms.pointer.value.x = ((touch.clientX - rect.left) / width) * 2 - 1;
              this.uniforms.pointer.value.y = -(((touch.clientY - rect.top) / height)) * 2 + 1;
            }
          };
          const handleMouseLeave = () => {
            this.uniforms.pointer.value.set(10, 10);
          };

          container!.addEventListener('mousemove', handleMouseMove);
          container!.addEventListener('touchmove', handleTouchMove);
          container!.addEventListener('mouseleave', handleMouseLeave);
          container!.addEventListener('touchend', handleMouseLeave);

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
              uniform float time, dTime, aspect, pointerDown, pointerRadius, pointerDuration;
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
                // Decay back to original image over pointerDuration (~1.2 seconds)
                rVal -= dTime / pointerDuration;
                rVal = clamp(rVal, 0.0, 1.0);

                float f = 0.0;
                if (pointerDown > 0.5) {
                  vec2 uv = (vUv - 0.5) * 2.0 * vec2(aspect, 1.0);
                  vec2 mouse = pointer * vec2(aspect, 1.0);
                  vec2 toMouse = uv - mouse;
                  float angle = atan(toMouse.y, toMouse.x);
                  float dist = length(toMouse);

                  float noiseVal = noise(vec2(angle * 3.0 + time * 0.5, dist * 5.0));
                  float noiseVal2 = noise(vec2(angle * 5.0 - time * 0.3, dist * 3.0 + time));
                  float radiusVariation = 0.75 + noiseVal * 0.45 + noiseVal2 * 0.25;
                  float organicRadius = pointerRadius * radiusVariation;

                  f = 1.0 - smoothstep(organicRadius * 0.05, organicRadius * 1.15, dist);
                  f *= 0.85 + noiseVal * 0.15;
                }

                rVal += f * 0.3;
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

      // Update geometries helper — ensures zero cropping of hair at the top
      const updateImageGeometries = (img: any) => {
        if (!img || !baseImage || !revealImage) return;
        // Fit 100% inside container so hair is NEVER cropped
        const scale = Math.min(width / img.width, height / img.height);
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

      // Load base image (default visible)
      const baseTexture = textureLoader.load(baseImageUrl, (texture: any) => {
        texture.encoding = THREE.sRGBEncoding;
        updateImageGeometries(texture.image);
      });

      // Load reveal image (shown on hover)
      const revealTexture = textureLoader.load(revealImageUrl, (texture: any) => {
        texture.encoding = THREE.sRGBEncoding;
      });

      // Base image mesh (bottom layer) — hides itself smoothly where blob is active
      const baseImageMaterial = new THREE.ShaderMaterial({
        uniforms: {
          texBlob: { value: blob.rtOutput.texture },
          map: { value: baseTexture },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec4 vPosProj;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            vPosProj = gl_Position;
          }
        `,
        fragmentShader: `
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
          varying vec2 vUv;
          varying vec4 vPosProj;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            vPosProj = gl_Position;
          }
        `,
        fragmentShader: `
          uniform sampler2D texBlob;
          uniform sampler2D map;
          varying vec2 vUv;
          varying vec4 vPosProj;

          void main() {
            vec2 blobUV = ((vPosProj.xy / vPosProj.w) + 1.0) * 0.5;
            float blobVal = texture2D(texBlob, blobUV).r;

            if (blobVal < 0.01) discard;

            vec4 texColor = texture2D(map, vUv);
            texColor.a *= smoothstep(0.01, 0.25, blobVal);
            gl_FragColor = texColor;
          }
        `,
        transparent: true,
      });
      revealImage = new THREE.Mesh(new THREE.PlaneGeometry(width, height), revealImageMaterial);
      scene.add(revealImage);

      baseImage.position.z = 0;
      revealImage.position.z = 0.1;

      const clock = new THREE.Clock();
      let animationId: number;

      const animate = () => {
        const dt = clock.getDelta();
        gu.time.value += dt;
        gu.dTime.value = dt;
        baseImageMaterial.uniforms.texBlob.value = blob.rtOutput.texture;
        revealImageMaterial.uniforms.texBlob.value = blob.rtOutput.texture;
        blob.render();
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
      };
      animate();

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
        renderer.setSize(newWidth, newHeight);
        gu.aspect.value = newWidth / newHeight;

        if (baseTexture.image) {
          updateImageGeometries(baseTexture.image);
        }
      };
      window.addEventListener('resize', handleResize);

      // Cleanup
      cleanupRef.current = () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
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

    loadThreeJS();

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [baseImageUrl, revealImageUrl, blobRadius, blobFadeSpeed]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        cursor: 'default',
        overflow: 'visible',
        touchAction: 'none',
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
