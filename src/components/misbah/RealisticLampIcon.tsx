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
      className={`relative inline-flex items-center justify-center transition-all duration-500 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Radial Bloom when Lamp is ON */}
      <div
        className={`absolute inset-0 -m-3 pointer-events-none rounded-full transition-all duration-700 ease-out ${
          isOn
            ? 'opacity-100 scale-125'
            : 'opacity-0 scale-75'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.45) 0%, rgba(217, 119, 6, 0.25) 45%, rgba(196, 125, 96, 0) 70%)',
          filter: 'blur(6px)',
        }}
      />

      {/* Downward Warm Ambient Light Cast Cone */}
      <div
        className={`absolute bottom-0 w-full h-[60%] pointer-events-none transition-all duration-700 ease-out ${
          isOn ? 'opacity-80 scale-110' : 'opacity-0 scale-90'
        }`}
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(254, 243, 199, 0.5) 0%, rgba(245, 158, 11, 0.2) 60%, transparent 100%)',
          filter: 'blur(5px)',
          transformOrigin: 'top center',
        }}
      />

      {/* Detailed SVG Bedside Lamp Vector */}
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 filter transition-all duration-500"
        style={{
          filter: isOn
            ? 'drop-shadow(0 0 10px rgba(245, 178, 124, 0.75)) drop-shadow(0 2px 5px rgba(0,0,0,0.25))'
            : 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))',
        }}
      >
        <defs>
          {/* Gradients for Shade (ON state) */}
          <linearGradient id="lampShadeLit" x1="16" y1="12" x2="48" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="35%" stopColor="#FDE68A" />
            <stop offset="70%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Gradients for Shade (OFF state) */}
          <linearGradient id="lampShadeOff" x1="16" y1="12" x2="48" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F2EBE0" />
            <stop offset="50%" stopColor="#D8C8B5" />
            <stop offset="100%" stopColor="#B39F8A" />
          </linearGradient>

          {/* Terracotta Ceramic Base Gradient */}
          <radialGradient id="ceramicBase" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#DF9B82" />
            <stop offset="45%" stopColor="#C47D60" />
            <stop offset="85%" stopColor="#964E33" />
            <stop offset="100%" stopColor="#6C341F" />
          </radialGradient>

          {/* Brass Accents Gradient */}
          <linearGradient id="brassGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#B48238" />
            <stop offset="50%" stopColor="#F7DF94" />
            <stop offset="100%" stopColor="#87581B" />
          </linearGradient>

          {/* Walnut Base Gradient */}
          <linearGradient id="walnutBase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#634533" />
            <stop offset="100%" stopColor="#3A2417" />
          </linearGradient>
        </defs>

        {/* 1. Finial & Top Brass Cap */}
        <circle cx="32" cy="7.5" r="1.5" fill="url(#brassGradient)" />
        <rect x="31" y="9" width="2" height="2" rx="0.5" fill="url(#brassGradient)" />

        {/* 2. Lamp Shade - Trapezoid pleated drum */}
        <path
          d="M 23 11 L 41 11 C 42 11 42.6 11.6 42.8 12.5 L 47.5 28.5 C 47.8 29.5 47.1 30.5 46 30.5 L 18 30.5 C 16.9 30.5 16.2 29.5 16.5 28.5 L 21.2 12.5 C 21.4 11.6 22 11 23 11 Z"
          fill={isOn ? 'url(#lampShadeLit)' : 'url(#lampShadeOff)'}
          stroke={isOn ? '#D97706' : '#9E8873'}
          strokeWidth="0.8"
          className="transition-colors duration-500 ease-in-out"
        />

        {/* Pleated Shade Texture Lines */}
        <g stroke={isOn ? '#F59E0B' : '#B8A48F'} strokeWidth="0.6" strokeOpacity={isOn ? 0.45 : 0.6}>
          <line x1="26" y1="11" x2="23" y2="30.5" />
          <line x1="29" y1="11" x2="27.5" y2="30.5" />
          <line x1="32" y1="11" x2="32" y2="30.5" />
          <line x1="35" y1="11" x2="36.5" y2="30.5" />
          <line x1="38" y1="11" x2="41" y2="30.5" />
        </g>

        {/* Shade Inner Glow Highlight Edge (when ON) */}
        {isOn && (
          <ellipse
            cx="32"
            cy="30.5"
            rx="14"
            ry="1.8"
            fill="#FEF3C7"
            fillOpacity="0.8"
          />
        )}

        {/* 3. Under-Shade Brass Neck & Harp */}
        <rect x="31" y="30.5" width="2" height="5" fill="url(#brassGradient)" />

        {/* Pull Chain with Brass Toggle Bead */}
        <line
          x1="38"
          y1="30.5"
          x2="38.5"
          y2="37"
          stroke="url(#brassGradient)"
          strokeWidth="0.75"
          strokeDasharray="1 1"
        />
        <circle cx="38.5" cy="38" r="1.1" fill="url(#brassGradient)" />

        {/* 4. Ceramic Terracotta Urn/Bulbous Body */}
        {/* Upper decorative collar ring */}
        <ellipse cx="32" cy="35.5" rx="3.5" ry="1.2" fill="url(#brassGradient)" />
        
        {/* Main curved ceramic vase shape */}
        <path
          d="M 30 36 C 26 38 23 42 23 47 C 23 52 26.5 55 32 55 C 37.5 55 41 52 41 47 C 41 42 38 38 34 36 Z"
          fill="url(#ceramicBase)"
        />

        {/* Glazed Ceramic Light Reflection Arc */}
        <path
          d="M 27 42 C 26 44 26 47 27 49"
          stroke="#F8DDD1"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity={isOn ? 0.75 : 0.5}
        />
        <circle cx="28" cy="40" r="0.8" fill="#FFFFFF" fillOpacity={isOn ? 0.9 : 0.6} />

        {/* 5. Circular Wooden Pedestal Stand */}
        <ellipse cx="32" cy="56" rx="10.5" ry="3.2" fill="url(#walnutBase)" />
        <ellipse cx="32" cy="55.2" rx="9" ry="2.2" fill="#523624" />

        {/* Ground Contact Shadow */}
        <ellipse cx="32" cy="58.5" rx="12" ry="1.8" fill="#000000" fillOpacity={isOn ? 0.25 : 0.18} />
      </svg>
    </div>
  );
};
