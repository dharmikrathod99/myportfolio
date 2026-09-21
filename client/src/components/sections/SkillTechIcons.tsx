'use client';

import React from 'react';

export interface TechIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

// 1. HTML5 Shield Icon (Official Orange)
export function Html5Icon({ className = 'w-6 h-6', size = 26, ...props }: TechIconProps) {
  return (
    <svg viewBox="0 0 512 512" width={size} height={size} className={className} fill="none" {...props}>
      <path d="M71 460L30 0h452l-41 460-185 52-185-52z" fill="#E34F26" />
      <path d="M256 472l149-41 35-391H256v432z" fill="#EF652A" />
      <path d="M256 208h-63l-4-49h67V110H135l13 147h108v-49zm0 148l-68-18-4-50h-49l8 98 113 31v-61z" fill="#EBEBEB" />
      <path d="M256 110v49h63l-6 67h-57v49h53l-5 58-48 13v50l89-25 12-134 2-17 4-50H256z" fill="#FFFFFF" />
    </svg>
  );
}

// 2. CSS3 Shield Icon (Official Blue)
export function Css3Icon({ className = 'w-6 h-6', size = 26, ...props }: TechIconProps) {
  return (
    <svg viewBox="0 0 512 512" width={size} height={size} className={className} fill="none" {...props}>
      <path d="M71 460L30 0h452l-41 460-185 52-185-52z" fill="#1572B6" />
      <path d="M256 472l149-41 35-391H256v432z" fill="#33A9DC" />
      <path d="M256 208h-63l-4-49h67V110H135l13 147h108v-49zm0 148l-68-18-4-50h-49l8 98 113 31v-61z" fill="#EBEBEB" />
      <path d="M374 159l-4 49h-114v49h57l-5 58-52 14v50l93-26 12-143 2-23 2-28H256v50h118z" fill="#FFFFFF" />
    </svg>
  );
}

// 3. JavaScript Square Icon (Official Yellow with crisp black "JS")
export function JavaScriptIcon({ className = 'w-6 h-6', size = 26, ...props }: TechIconProps) {
  return (
    <svg viewBox="0 0 512 512" width={size} height={size} className={className} fill="none" {...props}>
      <rect width="512" height="512" rx="72" fill="#F7DF1E" />
      <text
        x="50%"
        y="58%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#000000"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="900"
        fontSize="250"
        letterSpacing="-15"
      >
        JS
      </text>
    </svg>
  );
}

// 4. React Atom Icon (Official Cyan)
export function ReactIcon({ className = 'w-6 h-6', size = 26, ...props }: TechIconProps) {
  return (
    <svg viewBox="-11.5 -10.23174 23 20.46348" width={size} height={size} className={className} fill="none" {...props}>
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

// 5. Node.js Hexagon Icon (Official Green)
export function NodejsIcon({ className = 'w-6 h-6', size = 26, ...props }: TechIconProps) {
  return (
    <svg viewBox="0 0 256 288" width={size} height={size} className={className} fill="none" {...props}>
      <path
        d="M128 0L9 68.6v150.8L128 288l119-68.6V68.6L128 0zm68.5 197.8c-2.4 1.4-19.8 11.4-38.4 11.4-35.3 0-48.4-19.8-48.4-48.9 0-33.8 16.7-49.3 48.6-49.3 22 0 34.6 9.3 36.9 11.1l-10.8 16.9c-2.6-1.9-12.8-7.8-26.1-7.8-17.7 0-25.9 8.6-25.9 29.1 0 18.5 7.2 28.7 26.5 28.7 13.9 0 23.3-6.5 26.3-8.8l11.3 17.6z"
        fill="#339933"
      />
      <path
        d="M128 42L41.3 92v104L128 246l86.7-50V92L128 42zm-8.8 107.6c-4.4 2.6-11.8 4.2-18.4 4.2-16.1 0-26.6-8.7-26.6-23.8 0-14.7 10.3-23.7 26.3-23.7 6.6 0 13.7 1.6 18.7 4.1v39.2z"
        fill="#5FA04E"
      />
    </svg>
  );
}

// 6. Express.js Badge (Official Dark "ex")
export function ExpressIcon({ className = 'w-6 h-6', size = 26, ...props }: TechIconProps) {
  return (
    <svg viewBox="0 0 512 512" width={size} height={size} className={className} fill="none" {...props}>
      <circle cx="256" cy="256" r="236" fill="#0B1324" stroke="#334155" strokeWidth="16" />
      <text
        x="50%"
        y="58%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="sans-serif"
        fontWeight="800"
        fontSize="175"
        letterSpacing="-6"
      >
        ex
      </text>
    </svg>
  );
}

// 7. MongoDB Leaf Icon (Official Green)
export function MongoDbIcon({ className = 'w-6 h-6', size = 26, ...props }: TechIconProps) {
  return (
    <svg viewBox="0 0 256 548" width={size} height={size} className={className} fill="none" {...props}>
      <path
        d="M123.6 542.4c-4.3-17.7-50.6-116.7-88.7-187.8C5 296 0 250 0 205.8 0 88 56.6 23.5 120.3 0c3.2 0 6.6 1.8 7.9 4.3 15.3 27.5 10.5 73.5 10.5 107.3 0 162.2 4.3 194.2-15.1 430.8z"
        fill="#47A248"
      />
      <path
        d="M135.7 547.4c-4.2-12.8-14.7-65.7-14.7-77.5 0-72.2 6.7-228.3 6.7-251.3 0-77.2-13.7-124.6-1.5-214.3C196.2 38.6 256 114.7 256 227.3c0 98.4-44.6 181.7-88.7 259.7-15.4 27.3-27.4 48.7-31.6 60.4z"
        fill="#499D4A"
      />
      <path
        d="M128 548c-1.3 0-2.6-.5-3.5-1.5-3.6-3.8-12-68.9-12-108.5 0-77.8 8.8-197.8 8.8-242.3 0-66.2-7.5-116.8 6.7-195.7.5 0 1 .4 1.5.9 3.5 4.8 11.2 59.8 11.2 108.2 0 77.8-8.8 197.8-8.8 242.3 0 66.2 7.5 116.8-3.9 196.6z"
        fill="#E8E7D5"
      />
    </svg>
  );
}

// 8. Tailwind CSS Twin Waves Icon (Official Cyan)
export function TailwindIcon({ className = 'w-6 h-6', size = 26, ...props }: TechIconProps) {
  return (
    <svg viewBox="0 0 256 154" width={size} height={size} className={className} fill="none" {...props}>
      <path
        d="M128 0C93.9 0 72.5 17 64 51c12.8-17 27.7-23.4 44.8-19.2 9.8 2.4 16.7 9.5 24.5 17.3C146 61.9 161.7 77 192 77c34.1 0 55.5-17 64-51-12.8 17-27.7 23.4-44.8 19.2-9.8-2.4-16.7-9.5-24.5-17.3C174 15.1 158.3 0 128 0zM64 77C29.9 77 8.5 94 0 128c12.8-17 27.7-23.4 44.8-19.2 9.8 2.4 16.7 9.5 24.5 17.3C82 138.9 97.7 154 128 154c34.1 0 55.5-17 64-51-12.8 17-27.7 23.4-44.8 19.2-9.8-2.4-16.7-9.5-24.5-17.3C110 92.1 94.3 77 64 77z"
        fill="#06B6D4"
      />
    </svg>
  );
}

// 9. Bootstrap Icon (Official Purple "B")
export function BootstrapIcon({ className = 'w-6 h-6', size = 26, ...props }: TechIconProps) {
  return (
    <svg viewBox="0 0 512 512" width={size} height={size} className={className} fill="none" {...props}>
      <rect width="512" height="512" rx="100" fill="#7952B3" />
      <path
        d="M292.5 352c42.5 0 69.5-19.5 69.5-54 0-26-17.5-44.5-45.5-49v-2c23-5.5 37.5-23 37.5-44.5 0-31-25.5-49.5-64.5-49.5H168v199h124.5zm-72-157h58c19.5 0 31.5 9.5 31.5 26 0 17-12 27-33 27h-56.5V195zm0 84h65.5c22 0 35 10 35 29 0 19.5-13.5 30-36.5 30h-64V279z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

// 10. Python Dual Snake Icon (Official Blue & Yellow)
export function PythonIcon({ className = 'w-6 h-6', size = 26, ...props }: TechIconProps) {
  return (
    <svg viewBox="0 0 256 255" width={size} height={size} className={className} fill="none" {...props}>
      <path
        d="M126.9 0C60.7 0 64.9 28.7 64.9 28.7l.1 29.7h63.2v9H39.2S0 62.9 0 129.2c0 66.2 34.2 63.9 34.2 63.9h20.4V164s-1.1-34.9 34.2-34.9h58.8s33.1-.5 33.1-32.6V32.6S185.1 0 126.9 0zm-33.7 19.4c6.3 0 11.4 5.1 11.4 11.4 0 6.3-5.1 11.4-11.4 11.4-6.3 0-11.4-5.1-11.4-11.4 0-6.3 5.1-11.4 11.4-11.4z"
        fill="#3776AB"
      />
      <path
        d="M129.1 254.9c66.2 0 62-28.7 62-28.7l-.1-29.7h-63.2v-9h88.9s39.2 4.5 39.2-61.8c0-66.2-34.2-63.9-34.2-63.9h-20.4v29.1s1.1 34.9-34.2 34.9h-58.8s-33.1.5-33.1 32.6v63.9s4.4 32.6 62.6 32.6zm33.7-19.4c-6.3 0-11.4-5.1-11.4-11.4 0-6.3 5.1-11.4 11.4-11.4 6.3 0 11.4 5.1 11.4 11.4 0 6.3-5.1 11.4-11.4 11.4z"
        fill="#FFD43A"
      />
    </svg>
  );
}

// 11. Figma Multi-Color Icon
export function FigmaIcon({ className = 'w-6 h-6', size = 26, ...props }: TechIconProps) {
  return (
    <svg viewBox="0 0 256 384" width={size} height={size} className={className} fill="none" {...props}>
      <path d="M64 384c35.3 0 64-28.7 64-64v-64H64c-35.3 0-64 28.7-64 64s28.7 64 64 64z" fill="#0ACF83" />
      <path d="M0 192c0-35.3 28.7-64 64-64h64v128H64c-35.3 0-64-28.7-64-64z" fill="#A259FF" />
      <path d="M0 64C0 28.7 28.7 0 64 0h64v128H64C28.7 128 0 99.3 0 64z" fill="#F24E1E" />
      <path d="M128 0h64c35.3 0 64 28.7 64 64s-28.7 64-64 64h-64V0z" fill="#FF7262" />
      <circle cx="192" cy="192" r="64" fill="#1ABCFE" />
    </svg>
  );
}

// 12. Framer Motion Geometric Ribbon Icon
export function FramerMotionIcon({ className = 'w-6 h-6', size = 26, ...props }: TechIconProps) {
  return (
    <svg viewBox="0 0 256 256" width={size} height={size} className={className} fill="none" {...props}>
      <path d="M0 0h256v85.3H128z" fill="#0055FF" />
      <path d="M0 85.3h128l128 85.4H0z" fill="#38BDF8" />
      <path d="M0 170.7h128v85.3z" fill="#818CF8" />
    </svg>
  );
}

// 13. API Integration Icon (Glowing Cyan Cloud with API badge & connected nodes)
export function ApiIntegrationIcon({ className = 'w-6 h-6', size = 26, ...props }: TechIconProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} fill="none" {...props}>
      <path
        d="M48 24a14 14 0 0 0-27.1-3.6A11 11 0 0 0 10 31a11 11 0 0 0 4 8.5"
        stroke="#00F0FF"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M54 35a9 9 0 0 0-2-17.8"
        stroke="#00F0FF"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <rect x="15" y="27" width="34" height="24" rx="7" fill="#081427" stroke="#00F0FF" strokeWidth="2.8" />
      <text
        x="32"
        y="43.5"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#00F0FF"
        fontSize="12.5"
        fontWeight="bold"
        fontFamily="system-ui, sans-serif"
        letterSpacing="0.8"
      >
        API
      </text>
      <circle cx="10" cy="40" r="2.5" fill="#38BDF8" />
      <circle cx="54" cy="40" r="2.5" fill="#38BDF8" />
      <path d="M32 27v-6m-12 6l-4-4m28 4l4-4" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// 14. AI Automation Icon (Glowing Cyan/Sky-Blue Brain with Circuit Nodes)
export function AiAutomationIcon({ className = 'w-6 h-6', size = 26, ...props }: TechIconProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} fill="none" {...props}>
      <path
        d="M28 10a14 14 0 0 0-14 14c0 3.8 1.5 7.2 4 9.7A13 13 0 0 0 16 46c0 4.4 3.6 8 8 8h4V10z"
        stroke="#38BDF8"
        strokeWidth="2.8"
        fill="#081A36"
      />
      <path
        d="M36 10a14 14 0 0 1 14 14c0 3.8-1.5 7.2-4 9.7A13 13 0 0 1 48 46c0 4.4-3.6 8-8 8h-4V10z"
        stroke="#00F0FF"
        strokeWidth="2.8"
        fill="#081A36"
      />
      <circle cx="36" cy="22" r="2.5" fill="#00F0FF" />
      <path d="M36 22h8m-8 12h10m-10 10h6" stroke="#00F0FF" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="44" cy="22" r="2" fill="#FFFFFF" />
      <circle cx="46" cy="34" r="2" fill="#FFFFFF" />
      <circle cx="42" cy="44" r="2" fill="#FFFFFF" />
      <path d="M28 32h8" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

// 15. Git & GitHub Icon (Official GitHub Invertocat in White)
export function GitGithubIcon({ className = 'w-6 h-6', size = 26, ...props }: TechIconProps) {
  return (
    <svg viewBox="0 0 256 250" width={size} height={size} className={className} fill="none" {...props}>
      <path
        d="M128 0C57.3 0 0 57.3 0 128c0 56.5 36.7 104.5 87.5 121.4 6.4 1.2 8.7-2.8 8.7-6.2 0-3.1-.1-11.2-.2-22-35.6 7.7-43.1-17.2-43.1-17.2-5.8-14.8-14.2-18.7-14.2-18.7-11.6-8 .9-7.8.9-7.8 12.9.9 19.6 13.2 19.6 13.2 11.4 19.6 30 13.9 37.3 10.6 1.2-8.3 4.5-13.9 8.2-17.1-28.4-3.2-58.3-14.2-58.3-63.3 0-14 5-25.5 13.2-34.5-1.3-3.2-5.7-16.3 1.3-34 0 0 10.8-3.5 35.3 13.2 10.2-2.8 21.2-4.3 32.2-4.3 11 0 22 1.4 32.2 4.3 24.5-16.7 35.3-13.2 35.3-13.2 7 17.7 2.6 30.8 1.3 34 8.2 9 13.2 20.5 13.2 34.5 0 49.2-29.9 60-58.5 63.2 4.6 4 8.7 11.8 8.7 23.8 0 17.2-.2 31-.2 35.3 0 3.4 2.3 7.5 8.8 6.2C219.3 232.4 256 184.5 256 128 256 57.3 198.7 0 128 0z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

// 16. Data Analysis Icon (Ascending Bar Chart Columns)
export function DataAnalysisIcon({ className = 'w-6 h-6', size = 26, ...props }: TechIconProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} fill="none" {...props}>
      <rect x="8" y="38" width="9" height="18" rx="2.5" fill="#0C1D38" stroke="#38BDF8" strokeWidth="2.5" />
      <rect x="22" y="26" width="9" height="30" rx="2.5" fill="#0C264D" stroke="#38BDF8" strokeWidth="2.5" />
      <rect x="36" y="16" width="9" height="40" rx="2.5" fill="#0284C7" stroke="#00F0FF" strokeWidth="2.5" />
      <rect x="50" y="8" width="9" height="48" rx="2.5" fill="#38BDF8" stroke="#00F0FF" strokeWidth="2.5" />
    </svg>
  );
}

// 17. Firebase Icon (Official 3D Faceted Flame)
export function FirebaseIcon({ className = 'w-6 h-6', size = 26, ...props }: TechIconProps) {
  return (
    <svg viewBox="0 0 256 352" width={size} height={size} className={className} fill="none" {...props}>
      <path
        d="M37.7 186.2L116 39.8a6.5 6.5 0 0 1 12 2.7l23.5 137.9-113.8 5.8z"
        fill="#FFCA28"
      />
      <path
        d="M3.7 274.6l34-88.4 113.8-5.8L3.7 274.6z"
        fill="#FFA000"
      />
      <path
        d="M128 351.4c-1.3 0-2.5-.3-3.7-1L3.7 274.6l147.8-94.2L252 274.6l-120.3 75.8a7.7 7.7 0 0 1-3.7 1z"
        fill="#F57C00"
      />
      <path
        d="M252.3 274.6L197.8 61.2a6.5 6.5 0 0 0-11.8-1.5L151.5 180.4l100.8 94.2z"
        fill="#FFCA28"
      />
    </svg>
  );
}

// 18. Docker Whale Icon (Official Docker Blue)
export function DockerIcon({ className = 'w-6 h-6', size = 26, ...props }: TechIconProps) {
  return (
    <svg viewBox="0 0 256 182" width={size} height={size} className={className} fill="none" {...props}>
      <path
        d="M251.7 85.8c-3-2.2-9.7-4.1-17.7-2.6-2.6-11.5-12.8-19.8-24.8-19.8-1.3 0-2.6.1-3.9.3-5-18.7-22.3-32.3-42.5-32.3-1.6 0-3.3.1-4.9.3C152.1 12.3 133.5 0 112 0c-2.3 0-4.6.1-6.8.5-8.2 1.4-15.8 5.1-22 10.6-2-1.3-4.4-2.1-7-2.1-7.2 0-13 5.8-13 13v9.8H48.4c-7.2 0-13 5.8-13 13v14.8H13c-7.2 0-13 5.8-13 13V90c0 49.7 40.3 90 90 90h54c60.8 0 110-49.2 110-110 0-7.8-1.1-15.3-2.3-22.2z"
        fill="#2496ED"
      />
      <rect x="74" y="44" width="22" height="18" rx="2" fill="#FFFFFF" opacity="0.9" />
      <rect x="100" y="44" width="22" height="18" rx="2" fill="#FFFFFF" opacity="0.9" />
      <rect x="126" y="44" width="22" height="18" rx="2" fill="#FFFFFF" opacity="0.9" />
      <rect x="74" y="66" width="22" height="18" rx="2" fill="#FFFFFF" opacity="0.9" />
      <rect x="100" y="66" width="22" height="18" rx="2" fill="#FFFFFF" opacity="0.9" />
      <rect x="126" y="66" width="22" height="18" rx="2" fill="#FFFFFF" opacity="0.9" />
      <rect x="48" y="66" width="22" height="18" rx="2" fill="#FFFFFF" opacity="0.9" />
      <rect x="152" y="66" width="22" height="18" rx="2" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );
}

// 19. 3D Website Design Icon (Glowing isometric 3D geometry / wireframe prism)
export function ThreeDWebsiteDesignIcon({ className = 'w-6 h-6', size = 26, ...props }: TechIconProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} fill="none" {...props}>
      <defs>
        <linearGradient id="cubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#00F0FF" />
        </linearGradient>
        <linearGradient id="cubeLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
        <linearGradient id="cubeRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4338CA" />
        </linearGradient>
      </defs>
      {/* 3D Isometric Cube / Prism */}
      <polygon points="32,7 55,20 32,33 9,20" fill="url(#cubeTop)" fillOpacity="0.9" stroke="#00F0FF" strokeWidth="1.5" strokeLinejoin="round" />
      <polygon points="9,20 32,33 32,57 9,44" fill="url(#cubeLeft)" fillOpacity="0.9" stroke="#38BDF8" strokeWidth="1.5" strokeLinejoin="round" />
      <polygon points="32,33 55,20 55,44 32,57" fill="url(#cubeRight)" fillOpacity="0.9" stroke="#818CF8" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Dimension & Wireframe Lines */}
      <line x1="32" y1="33" x2="32" y2="14" stroke="#FFFFFF" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.75" />
      <line x1="32" y1="33" x2="47" y2="41" stroke="#FFFFFF" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.65" />
      <line x1="32" y1="33" x2="17" y2="41" stroke="#FFFFFF" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.65" />
      {/* Subtle Orbit Ring */}
      <ellipse cx="32" cy="32" rx="27" ry="11" stroke="#00F0FF" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.45" transform="rotate(-15 32 32)" />
      {/* Vertex Nodes */}
      <circle cx="32" cy="7" r="2.2" fill="#FFFFFF" />
      <circle cx="55" cy="20" r="2.2" fill="#00F0FF" />
      <circle cx="9" cy="20" r="2.2" fill="#00F0FF" />
      <circle cx="32" cy="33" r="2.5" fill="#FFFFFF" />
      <circle cx="32" cy="57" r="2.2" fill="#818CF8" />
      <circle cx="55" cy="44" r="2.2" fill="#818CF8" />
      <circle cx="9" cy="44" r="2.2" fill="#38BDF8" />
    </svg>
  );
}

// 20. Blender 3D Suite Icon (Official Blender Orange, Blue & White Center)
export function BlenderIcon({ className = 'w-6 h-6', size = 26, ...props }: TechIconProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} fill="none" {...props}>
      {/* Blender 3 Radiating Arms */}
      <line x1="35" y1="37" x2="50" y2="12" stroke="#EA7600" strokeWidth="8.5" strokeLinecap="round" />
      <line x1="35" y1="37" x2="11" y2="23" stroke="#EA7600" strokeWidth="8.5" strokeLinecap="round" />
      <line x1="35" y1="37" x2="16" y2="52" stroke="#EA7600" strokeWidth="8.5" strokeLinecap="round" />
      {/* Outer Orange Body */}
      <circle cx="35" cy="37" r="16.5" fill="#EA7600" />
      {/* Inner Royal Blue Eye */}
      <circle cx="35" cy="37" r="10.5" fill="#22578A" />
      {/* Center White Dot */}
      <circle cx="35" cy="37" r="4.2" fill="#FFFFFF" />
    </svg>
  );
}

// 21. SEO Optimized Website Icon (Search Engine Optimization, Trending Growth & Web Window)
export function SeoOptimizedIcon({ className = 'w-6 h-6', size = 26, ...props }: TechIconProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} fill="none" {...props}>
      <defs>
        <linearGradient id="seoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      {/* Browser Window Frame */}
      <rect x="6" y="8" width="52" height="48" rx="8" fill="#071324" stroke="#00F0FF" strokeWidth="2.5" />
      {/* Window Title Bar */}
      <line x1="6" y1="20" x2="58" y2="20" stroke="#1E293B" strokeWidth="2" />
      <circle cx="13" cy="14" r="2" fill="#EF4444" />
      <circle cx="19" cy="14" r="2" fill="#F59E0B" />
      <circle cx="25" cy="14" r="2" fill="#10B981" />
      {/* URL search pill */}
      <rect x="31" y="11" width="22" height="6" rx="3" fill="#0B1E38" stroke="#38BDF8" strokeWidth="1" />
      {/* SEO Upward Rank Trajectory Line */}
      <path
        d="M13 46 L23 37 L31 42 L47 25"
        stroke="url(#seoGrad)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arrowhead on trajectory */}
      <path d="M41 25 H47 V31" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Search Magnifying Lens */}
      <circle cx="27" cy="33" r="7.5" stroke="#38BDF8" strokeWidth="2.5" fill="#081A36" fillOpacity="0.85" />
      <line x1="32.5" y1="38.5" x2="39" y2="45" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
      {/* Glowing SEO Pill Badge */}
      <rect x="11" y="47" width="24" height="7" rx="2" fill="#00F0FF" fillOpacity="0.2" stroke="#00F0FF" strokeWidth="0.8" />
      <text
        x="23"
        y="52.2"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#00F0FF"
        fontSize="5.5"
        fontWeight="bold"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="0.6"
      >
        SEO
      </text>
    </svg>
  );
}
