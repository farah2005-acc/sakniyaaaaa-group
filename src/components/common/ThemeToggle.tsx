import React from 'react';
import { useApp } from '../../context/AppContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, language } = useApp();
  const isDark = theme === 'dark';

  const titleText = isDark
    ? language === 'ar'
      ? 'التبديل إلى الوضع النهاري (Light Mode)'
      : 'Switch to Light Mode'
    : language === 'ar'
    ? 'التبديل إلى الوضع الليلي الدافئ (Night Mode)'
    : 'Switch to Warm Night Mode';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={titleText}
      title={titleText}
      className={`relative p-2 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C47D60] group ${
        isDark
          ? 'bg-[#24201D] border-[#3D352E] text-amber-200 hover:bg-[#2D2723] hover:border-[#C47D60]/60 shadow-sm'
          : 'bg-white border-[#E9DDCC]/80 text-[#765541] hover:bg-[#F8F4EC] hover:border-[#C47D60]/50 shadow-sm'
      }`}
    >
      {/* Morphing Sun <-> Crescent Moon SVG Icon */}
      <div className="relative w-5 h-5 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 transform transition-transform duration-500 ease-spring"
          style={{
            transform: isDark ? 'rotate(40deg)' : 'rotate(0deg)',
          }}
        >
          {/* Mask for creating the smooth crescent moon bite */}
          <mask id="theme-crescent-mask">
            <rect x="0" y="0" width="24" height="24" fill="white" />
            <circle
              cx={isDark ? '17' : '28'}
              cy={isDark ? '7' : '4'}
              r="7"
              fill="black"
              className="transition-all duration-500 ease-out"
            />
          </mask>

          {/* Central Celestial Body (Sun sphere or Crescent moon body) */}
          <circle
            cx="12"
            cy="12"
            r={isDark ? '8' : '5'}
            mask="url(#theme-crescent-mask)"
            fill="currentColor"
            className={`transition-all duration-500 ease-out ${
              isDark ? 'text-amber-300' : 'text-amber-500 fill-amber-400/90'
            }`}
          />

          {/* Sun Rays - fade, shrink, and rotate outward in dark mode */}
          <g
            className={`transition-all duration-500 ease-out origin-center ${
              isDark
                ? 'opacity-0 scale-50 rotate-90 pointer-events-none'
                : 'opacity-100 scale-100 rotate-0 text-amber-500'
            }`}
          >
            {/* 8 rays around sun */}
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </g>

          {/* Night Mode Subtle Stars */}
          <g
            className={`transition-all duration-500 delay-100 origin-center ${
              isDark ? 'opacity-100 scale-100 text-amber-200' : 'opacity-0 scale-0'
            }`}
          >
            <circle cx="19" cy="5" r="0.75" fill="currentColor" />
            <circle cx="5" cy="18" r="0.6" fill="currentColor" />
          </g>
        </svg>
      </div>

      {/* Screen Reader Label */}
      <span className="sr-only">{titleText}</span>
    </button>
  );
};
