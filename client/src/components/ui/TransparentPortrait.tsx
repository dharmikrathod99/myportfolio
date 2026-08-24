'use client';

import React, { useEffect, useRef, useState } from 'react';

interface TransparentPortraitProps {
  src: string;
  alt?: string;
  className?: string;
}

export function TransparentPortrait({
  src,
  alt = 'Dharmik Rathod - DR.Developer',
  className = '',
}: TransparentPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const w = img.naturalWidth;
      const h = img.naturalHeight;

      canvas.width = w;
      canvas.height = h;

      // Draw original image
      ctx.drawImage(img, 0, 0, w, h);

      // Extract image pixel data
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      // Sample top-left and top-right background colors
      const bgR = (data[0] + data[(w - 1) * 4]) / 2;
      const bgG = (data[1] + data[(w - 1) * 4 + 1]) / 2;
      const bgB = (data[2] + data[(w - 1) * 4 + 2]) / 2;

      // Process pixels: remove light studio background with anti-aliased feathering
      for (let y = 0; y < h; y++) {
        const bottomFactor = y > h * 0.82 ? Math.max(0, 1 - (y - h * 0.82) / (h * 0.18)) : 1;

        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // Euclidean color distance from sampled background
          const dR = r - bgR;
          const dG = g - bgG;
          const dB = b - bgB;
          const colorDist = Math.sqrt(dR * dR + dG * dG + dB * dB);

          // Luminance and saturation check
          const maxVal = Math.max(r, g, b);
          const minVal = Math.min(r, g, b);
          const saturation = maxVal - minVal;
          const isLightStudio = r > 180 && g > 180 && b > 180 && saturation < 35;

          if (isLightStudio || colorDist < 38) {
            // Smooth edge transparency
            if (colorDist < 20) {
              data[idx + 3] = 0; // Pure transparent background
            } else {
              const edgeAlpha = (colorDist - 20) / 18;
              data[idx + 3] = Math.floor(Math.min(data[idx + 3], edgeAlpha * 255 * bottomFactor));
            }
          } else {
            // Person pixel (apply soft bottom fade)
            data[idx + 3] = Math.floor(data[idx + 3] * bottomFactor);
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setIsLoaded(true);
    };
  }, [src]);

  return (
    <div className={`relative flex items-end justify-center ${className}`}>
      {/* 4K Ultra HD Transparent Cutout Canvas */}
      <canvas
        ref={canvasRef}
        aria-label={alt}
        className={`w-full h-full object-contain object-bottom select-none filter contrast-105 drop-shadow-[0_20px_50px_rgba(58,134,255,0.25)] dark:drop-shadow-[0_25px_60px_rgba(0,0,0,0.85)] transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

export default TransparentPortrait;
