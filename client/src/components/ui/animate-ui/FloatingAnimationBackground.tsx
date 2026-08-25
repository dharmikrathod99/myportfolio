'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface FloatingAnimationBackgroundProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  speed?: number;
  className?: string;
}

// Full Ultra HD 4K GLSL Vertex Shader
const VERTEX_SHADER = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// Full Ultra HD 4K GLSL Fragment Shader from Framer Floating-Animation module
const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uIsLight;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,  0.366025403784439,
   -0.577350269189626,  0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
    0.5 - vec3(
      dot(x0, x0),
      dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)
    ), 
    0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  // Custom Smooth Color Ramp
  int index = 0;
  for (int i = 0; i < 2; i++) {
    if (colors[i].position <= uv.x) {
      index = i;
    }
  }
  
  ColorStop currentColor = colors[index];
  ColorStop nextColor = colors[index + 1];
  float range = max(0.001, nextColor.position - currentColor.position);
  float lerpFactor = clamp((uv.x - currentColor.position) / range, 0.0, 1.0);
  vec3 rampColor = mix(currentColor.color, nextColor.color, lerpFactor);
  
  // Organic fluid noise wave displacement
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  
  float midPoint = 0.20;
  float animationAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  
  // Base background: Pure White (#FFFFFF) in Light Mode, Rich Obsidian (#07070C) in Dark Mode
  vec3 baseBg = mix(vec3(0.03, 0.03, 0.05), vec3(1.0, 1.0, 1.0), uIsLight);
  vec3 finalColor = mix(baseBg, rampColor, animationAlpha);
  
  fragColor = vec4(finalColor, 1.0);
}
`;

// Helper: parse hex color into normalized RGB float [0..1]
function parseHexColor(hex: string, defaultRgb: [number, number, number]): [number, number, number] {
  if (!hex) return defaultRgb;
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16) / 255;
    const g = parseInt(clean[1] + clean[1], 16) / 255;
    const b = parseInt(clean[2] + clean[2], 16) / 255;
    return [r, g, b];
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;
    return [r, g, b];
  }
  return defaultRgb;
}

export function FloatingAnimationBackground({
  colorStops = ['#764105', '#1818E7', '#FF299B'], // Exact Framer screenshot colors
  amplitude = 1.0,
  blend = 0.5,
  speed = 1.0,
  className = '',
}: FloatingAnimationBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  const isLight = theme === 'light';

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: true,
      powerPreference: 'high-performance',
    });

    if (!gl) {
      console.warn('WebGL2 not supported, fallback active.');
      return;
    }

    // Compile Vertex Shader
    const vertShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertShader, VERTEX_SHADER);
    gl.compileShader(vertShader);

    // Compile Fragment Shader
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragShader, FRAGMENT_SHADER);
    gl.compileShader(fragShader);

    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      console.error('Fragment shader compile error:', gl.getShaderInfoLog(fragShader));
      return;
    }

    // Create Program
    const program = gl.createProgram()!;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Fullscreen Triangle Geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, -1,
       3, -1,
      -1,  3,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform Locations
    const uTimeLoc = gl.getUniformLocation(program, 'uTime');
    const uAmpLoc = gl.getUniformLocation(program, 'uAmplitude');
    const uBlendLoc = gl.getUniformLocation(program, 'uBlend');
    const uResLoc = gl.getUniformLocation(program, 'uResolution');
    const uColorStopsLoc = gl.getUniformLocation(program, 'uColorStops');
    const uIsLightLoc = gl.getUniformLocation(program, 'uIsLight');

    // Exact Framer Colors parsed:
    // #764105 -> [118/255, 65/255, 5/255]
    // #1818E7 -> [24/255, 24/255, 231/255]
    // #FF299B -> [255/255, 41/255, 155/255]
    const defaultColors: [number, number, number][] = [
      [0.4627, 0.2549, 0.0196],
      [0.0941, 0.0941, 0.9058],
      [1.0000, 0.1607, 0.6078],
    ];

    const parsedColors = colorStops.map((c, i) => parseHexColor(c, defaultColors[i] || [1, 0, 0]));
    const flatColors = new Float32Array(parsedColors.flat());

    // High performance background DPR scaling
    const handleResize = () => {
      if (!container || !canvas) return;
      const width = container.offsetWidth || window.innerWidth;
      const height = container.offsetHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.0);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);

      gl.useProgram(program);
      gl.uniform2f(uResLoc, canvas.width, canvas.height);

      const baseHeight = 800;
      const scaleFactor = baseHeight / Math.max(1, height);
      gl.uniform1f(uAmpLoc, amplitude * scaleFactor);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);
    handleResize();

    let animationFrameId: number | null = null;
    const startTime = performance.now();
    let isPageVisible = !document.hidden;

    const render = (time: number) => {
      if (!isPageVisible) {
        animationFrameId = null;
        return;
      }
      const elapsed = (time - startTime) * 0.001 * speed;
      gl.useProgram(program);
      gl.uniform1f(uTimeLoc, elapsed);
      gl.uniform1f(uBlendLoc, blend);
      gl.uniform3fv(uColorStopsLoc, flatColors);
      gl.uniform1f(uIsLightLoc, isLight ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      animationFrameId = requestAnimationFrame(render);
    };

    const startRendering = () => {
      if (!animationFrameId && isPageVisible) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) {
        startRendering();
      } else if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    startRendering();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [colorStops, amplitude, blend, speed, isLight]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-colors duration-500 ${
        isLight ? 'bg-white' : 'bg-[#05050A]'
      } ${className}`}
    >
      {/* Crisp 4K Ultra HD WebGL Canvas rendering directly into pixels */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block transform-gpu will-change-transform"
      />

      {/* Subtle Bottom Dropoff matching Framer screenshots */}
      <div
        className={`absolute inset-x-0 bottom-0 h-48 pointer-events-none transition-colors duration-500 ${
          isLight
            ? 'bg-gradient-to-t from-white via-white/50 to-transparent'
            : 'bg-gradient-to-t from-[#05050A] via-[#05050A]/40 to-transparent'
        }`}
      />
    </div>
  );
}

export default FloatingAnimationBackground;
