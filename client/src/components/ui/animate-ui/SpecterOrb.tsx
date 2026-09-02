'use client';

import React, { useEffect, useRef } from 'react';

export interface SpecterOrbProps {
  className?: string;
  speed?: number;
  size?: number;
}

const VERTEX_SHADER = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

out vec4 fragColor;

// Smooth 3D simplex noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// 2-Octave FBM noise for organic sphere breathing
float fbm(vec3 p) {
  float v = snoise(p);
  v += 0.5 * snoise(p * 2.02 + vec3(1.2, -0.8, 0.4));
  return v;
}

// Raymarched Sphere Distance Function
float map(vec3 p, float t) {
  float radius = 0.88;
  vec3 noiseP = p * 1.35 + vec3(0.0, -t * 0.35, t * 0.2);
  float disp = fbm(noiseP) * 0.16;
  return length(p) - (radius + disp);
}

// Calculate Surface Normal
vec3 calcNormal(vec3 p, float t) {
  float d = map(p, t);
  vec2 e = vec2(0.003, 0.0);
  return normalize(vec3(
    map(p + e.xyy, t) - d,
    map(p + e.yxy, t) - d,
    map(p + e.yyx, t) - d
  ));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);
  
  // Camera & Ray Setup
  vec3 ro = vec3(0.0, 0.0, 2.3);
  vec3 rd = normalize(vec3(uv, -1.35));
  
  float t = uTime * 0.7;
  
  // Clean Black Background
  vec3 col = vec3(0.0, 0.0, 0.0);
  
  // Raymarching
  float dO = 0.0;
  float hitDist = -1.0;
  vec3 hitPos = vec3(0.0);
  
  for (int i = 0; i < 64; i++) {
    vec3 p = ro + rd * dO;
    float dS = map(p, t);
    
    if (dS < 0.001) {
      hitDist = dO;
      hitPos = p;
      break;
    }
    dO += dS * 0.6;
    if (dO > 4.0) break;
  }
  
  // Colors exactly matching the user screenshot:
  // Primary: Pure Glowing Neon Electric Blue (#0040FF / #0052FF)
  // Secondary: Soft Magenta/Violet on the bottom-left (#C026D3 / #9333EA)
  vec3 neonBlue = vec3(0.0, 0.35, 1.0);
  vec3 violetPink = vec3(0.85, 0.12, 0.95);
  
  if (hitDist > 0.0) {
    vec3 nor = calcNormal(hitPos, t);
    
    // Fresnel Rim Glow (sharp, intense, glowing edge like in the screenshot)
    float fresnel = pow(clamp(1.0 - abs(dot(-rd, nor)), 0.0, 1.0), 2.2);
    
    // Bottom-left violet edge gradient
    float violetBlend = smoothstep(-0.2, -0.7, hitPos.y + hitPos.x * 0.4);
    vec3 rimColor = mix(neonBlue, violetPink, violetBlend * 0.85);
    
    // Internal fluid smoke patch (upper right & lower left blue clouds)
    float cloudNoise1 = snoise(hitPos * 2.2 + vec3(-t * 0.4, t * 0.3, 0.0));
    float cloudNoise2 = snoise(hitPos * 3.0 + vec3(t * 0.2, -t * 0.5, 1.0));
    float internalCloud = smoothstep(0.1, 0.8, cloudNoise1 * 0.6 + cloudNoise2 * 0.4);
    
    // Core color composition
    col = rimColor * (fresnel * 3.2);
    col += neonBlue * internalCloud * (1.0 - fresnel * 0.4) * 0.85;
    col += rimColor * pow(fresnel, 5.0) * 1.5; // Razor-sharp bright rim crest
  } else {
    // Subtle outer halo around the orb silhouette
    float distToCenter = length(uv);
    float glow = exp(-max(0.0, distToCenter - 0.55) * 12.0) * 0.18;
    col = neonBlue * glow;
  }
  
  fragColor = vec4(col, 1.0);
}
`;

export function SpecterOrb({
  className = '',
  speed = 1.0,
}: SpecterOrbProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      console.warn('WebGL2 not supported for SpecterOrb');
      return;
    }

    const vertShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertShader, VERTEX_SHADER);
    gl.compileShader(vertShader);

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragShader, FRAGMENT_SHADER);
    gl.compileShader(fragShader);

    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      console.error('Shader error:', gl.getShaderInfoLog(fragShader));
      return;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTimeLoc = gl.getUniformLocation(program, 'uTime');
    const uResLoc = gl.getUniformLocation(program, 'uResolution');

    const handleResize = () => {
      if (!container || !canvas) return;
      const w = container.offsetWidth || window.innerWidth;
      const h = container.offsetHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);

      gl.useProgram(program);
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    let animationFrameId: number | null = null;
    const startTime = performance.now();
    let isVisible = true;

    const render = (now: number) => {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      const elapsed = (now - startTime) * 0.001 * speed;
      gl.useProgram(program);
      gl.uniform1f(uTimeLoc, elapsed);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      animationFrameId = requestAnimationFrame(render);
    };

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && !animationFrameId) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [speed]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#000000] ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block transform-gpu will-change-transform"
      />
    </div>
  );
}

export default SpecterOrb;
