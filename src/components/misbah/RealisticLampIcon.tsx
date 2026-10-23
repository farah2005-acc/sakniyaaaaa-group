import React from 'react';

interface RealisticLampIconProps {
  isOn: boolean;
  className?: string;
  size?: number; // size in px, defaults to 44
}

export const RealisticLampIcon: React.FC<RealisticLampIconProps> = ({
  isOn,
  className = '',
  size = 44,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none transition-all duration-700 ease-out ${className}`}
      style={{ width: size, height: size }}
    >
      {/* 1. Large Ambient Radial Bloom (Warm Golden Aura) */}
      <div
        className={`absolute inset-0 -m-4 pointer-events-none rounded-full transition-all duration-700 ease-out ${
          isOn
            ? 'opacity-100 scale-125'
            : 'opacity-0 scale-75'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.45) 0%, rgba(245, 158, 11, 0.25) 40%, rgba(196, 125, 96, 0.12) 60%, transparent 75%)',
          filter: 'blur(8px)',
        }}
        aria-hidden="true"
      />

      {/* 2. Downward Warm Ambient Light Cast Cone (Desk Light) */}
      <div
        className={`absolute -bottom-2 w-[140%] h-[70%] pointer-events-none transition-all duration-700 ease-out ${
          isOn ? 'opacity-90 scale-110' : 'opacity-0 scale-90'
        }`}
        style={{
          background: 'radial-gradient(ellipse at 50% 25%, rgba(254, 243, 199, 0.6) 0%, rgba(245, 158, 11, 0.25) 50%, transparent 80%)',
          filter: 'blur(6px)',
          transformOrigin: 'top center',
        }}
        aria-hidden="true"
      />

      {/* 3. Detailed SVG Bedside Lamp Vector */}
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 filter transition-all duration-700 ease-out"
        style={{
          filter: isOn
            ? 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.65)) drop-shadow(0 3px 6px rgba(0,0,0,0.22))'
            : 'drop-shadow(0 1px 3px rgba(0,0,0,0.12))',
        }}
        aria-hidden="true"
      >
        <defs>
          {/* Gradients for Shade (ON state) - Warm Luminous Amber */}
          <linearGradient id="lampShadeLit" x1="16" y1="11" x2="48" y2="30.5" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="30%" stopColor="#FDE68A" />
            <stop offset="65%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Gradients for Shade (OFF state) - Calm Earthy Oatmeal Linen */}
          <linearGradient id="lampShadeOff" x1="16" y1="11" x2="48" y2="30.5" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F5EFE6" />
            <stop offset="50%" stopColor="#D9CBB9" />
            <stop offset="100%" stopColor="#B8A793" />
          </linearGradient>

          {/* Terracotta Ceramic Base Gradient */}
          <radialGradient id="ceramicBase" cx="35%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#E2A18A" />
            <stop offset="40%" stopColor="#C47D60" />
            <stop offset="80%" stopColor="#964E33" />
            <stop offset="100%" stopColor="#6C341F" />
          </radialGradient>

          {/* Brass Accents Gradient */}
          <linearGradient id="brassGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#B48238" />
            <stop offset="45%" stopColor="#FCE7A4" />
            <stop offset="70%" stopColor="#E5B94F" />
            <stop offset="100%" stopColor="#87581B" />
          </linearGradient>

          {/* Walnut Base Gradient */}
          <linearGradient id="walnutBase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#634533" />
            <stop offset="100%" stopColor="#3A2417" />
          </linearGradient>
        </defs>

        {/* 1. Finial & Top Brass Cap */}
        <circle cx="32" cy="7.5" r="1.6" fill="url(#brassGradient)" />
        <rect x="31" y="9" width="2" height="2" rx="0.5" fill="url(#brassGradient)" />

        {/* 2. Lamp Shade - Pleated Drum with Cross-fading Smooth Opacity */}
        {/* Base Unlit Shade Layer */}
        <path
          d="M 23 11 L 41 11 C 42 11 42.6 11.6 42.8 12.5 L 47.5 28.5 C 47.8 29.5 47.1 30.5 46 30.5 L 18 30.5 C 16.9 30.5 16.2 29.5 16.5 28.5 L 21.2 12.5 C 21.4 11.6 22 11 23 11 Z"
          fill="url(#lampShadeOff)"
          stroke="#9E8873"
          strokeWidth="0.8"
        />

        {/* Unlit Pleats Texture */}
        <g stroke="#B8A48F" strokeWidth="0.6" strokeOpacity="0.65">
          <line x1="26" y1="11" x2="23" y2="30.5" />
          <line x1="29" y1="11" x2="27.5" y2="30.5" />
          <line x1="32" y1="11" x2="32" y2="30.5" />
          <line x1="35" y1="11" x2="36.5" y2="30.5" />
          <line x1="38" y1="11" x2="41" y2="30.5" />
        </g>

        {/* Lit Warm Glowing Shade Overlay (Smooth CSS Opacity Cross-fade) */}
        <g
          className={`transition-opacity duration-700 ease-in-out ${
            isOn ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <path
            d="M 23 11 L 41 11 C 42 11 42.6 11.6 42.8 12.5 L 47.5 28.5 C 47.8 29.5 47.1 30.5 46 30.5 L 18 30.5 C 16.9 30.5 16.2 29.5 16.5 28.5 L 21.2 12.5 C 21.4 11.6 22 11 23 11 Z"
            fill="url(#lampShadeLit)"
            stroke="#D97706"
            strokeWidth="0.9"
          />

          {/* Golden Pleat Highlights */}
          <g stroke="#FFFBEB" strokeWidth="0.75" strokeOpacity="0.8">
            <line x1="26" y1="11" x2="23" y2="30.5" />
            <line x1="29" y1="11" x2="27.5" y2="30.5" />
            <line x1="32" y1="11" x2="32" y2="30.5" />
            <line x1="35" y1="11" x2="36.5" y2="30.5" />
            <line x1="38" y1="11" x2="41" y2="30.5" />
          </g>

          {/* Shade Bottom Aperture Glow Ring */}
          <ellipse
            cx="32"
            cy="30.5"
            rx="14"
            ry="2.0"
            fill="#FEF3C7"
            fillOpacity="0.9"
          />
        </g>

        {/* 3. Under-Shade Brass Neck & Harp */}
        <rect x="31" y="30.5" width="2" height="5" fill="url(#brassGradient)" />

        {/* Delicate Brass Pull Chain with Toggle Bead */}
        <g
          className="transition-transform duration-500 ease-out"
          style={{ transform: isOn ? 'translateY(1.5px)' : 'translateY(0)' }}
        >
          <line
            x1="38"
            y1="30.5"
            x2="38.5"
            y2="37"
            stroke="url(#brassGradient)"
            strokeWidth="0.75"
            strokeDasharray="1 1"
          />
          <circle cx="38.5" cy="38" r="1.2" fill="url(#brassGradient)" />
        </g>

        {/* 4. Ceramic Terracotta Urn Base */}
        {/* Upper decorative collar ring */}
        <ellipse cx="32" cy="35.5" rx="3.5" ry="1.2" fill="url(#brassGradient)" />
        
        {/* Main curved ceramic vase shape */}
        <path
          d="M 30 36 C 26 38 23 42 23 47 C 23 52 26.5 55 32 55 C 37.5 55 41 52 41 47 C 41 42 38 38 34 36 Z"
          fill="url(#ceramicBase)"
        />

        {/* Glazed Ceramic Specular Light Reflection Arc */}
        <path
          d="M 27 42 C 26 44 26 47 27 49"
          stroke="#F8DDD1"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity={isOn ? 0.85 : 0.45}
          className="transition-all duration-700 ease-out"
        />
        <circle
          cx="28"
          cy="40"
          r="0.8"
          fill="#FFFFFF"
          fillOpacity={isOn ? 0.95 : 0.6}
          className="transition-all duration-700 ease-out"
        />

        {/* 5. Circular Wooden Pedestal Stand */}
        <ellipse cx="32" cy="56" rx="10.5" ry="3.2" fill="url(#walnutBase)" />
        <ellipse cx="32" cy="55.2" rx="9" ry="2.2" fill="#523624" />

        {/* Ground Contact Shadow */}
        <ellipse
          cx="32"
          cy="58.5"
          rx="12"
          ry="1.8"
          fill="#000000"
          fillOpacity={isOn ? 0.28 : 0.16}
          className="transition-all duration-700 ease-out"
        />
      </svg>
    </div>
  );
};
