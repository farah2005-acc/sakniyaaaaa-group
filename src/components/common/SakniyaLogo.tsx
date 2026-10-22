import React from 'react';
import { useApp } from '../../context/AppContext';

interface SakniyaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'app_icon' | 'vector' | 'badge';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export const SakniyaLogo: React.FC<SakniyaLogoProps> = ({
  size = 'md',
  variant = 'app_icon',
  showText = true,
  className = '',
  onClick,
}) => {
  const { language } = useApp();

  const iconSizes = {
    xs: 'w-7 h-7 rounded-lg',
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-11 h-11 rounded-2xl',
    lg: 'w-14 h-14 rounded-[20px]',
    xl: 'w-20 h-20 rounded-[28px]',
  };

  const textSizes = {
    xs: { title: 'text-sm', sub: 'text-[9px]' },
    sm: { title: 'text-base', sub: 'text-[10px]' },
    md: { title: 'text-xl', sub: 'text-[10px]' },
    lg: { title: 'text-2xl', sub: 'text-xs' },
    xl: { title: 'text-3xl', sub: 'text-sm' },
  };

  const APP_ICON_PATH = '/src/assets/images/sakniya_house_logo_1792680398805.jpg';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 group select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Logo Mark: Either 3D App Icon or Pure Vector SVG */}
      {variant === 'app_icon' ? (
        <div
          className={`relative ${iconSizes[size]} overflow-hidden shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 ring-1 ring-black/10 dark:ring-white/10 shrink-0 bg-[#F5EFE6] dark:bg-[#241F1C] flex items-center justify-center`}
        >
          <img
            src={APP_ICON_PATH}
            alt="Sakniya House Logo Icon"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-[1.08] transition-transform duration-300 group-hover:scale-115"
          />
          {/* Subtle highlight sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
        </div>
      ) : (
        /* Bespoke Vector Mark: Distinctive House Silhouette + Chimney + Arched Door + Glowing Heart Lantern */
        <div
          className={`relative ${iconSizes[size]} flex items-center justify-center bg-gradient-to-br from-[#8C5843] via-[#765541] to-[#4A3223] dark:from-[#D17B5B] dark:via-[#B86242] dark:to-[#6E3520] text-[#F8F4EC] shadow-md group-hover:scale-105 transition-all duration-300 shrink-0 overflow-hidden rounded-2xl`}
        >
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[82%] h-[82%]"
          >
            <defs>
              <linearGradient id="sakniyaRoof" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F8F4EC" />
                <stop offset="100%" stopColor="#EAD8C7" />
              </linearGradient>
              <linearGradient id="lanternGlow" x1="24" y1="20" x2="24" y2="34" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FEF3C7" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>

            {/* House Chimney */}
            <rect x="15" y="11" width="4" height="8" rx="1" fill="currentColor" opacity="0.9" />

            {/* House Silhouette & Gable Roof */}
            <path
              d="M 10 23 L 24 10 L 38 23 V 40 C 38 41.1 37.1 42 36 42 H 12 C 10.9 42 10 41.1 10 40 Z"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinejoin="round"
              fill="rgba(0,0,0,0.12)"
            />

            {/* Arched Doorway with Warm Glow */}
            <path
              d="M 18 42 V 28 C 18 24.6 20.7 22 24 22 C 27.3 22 30 24.6 30 28 V 42 Z"
              fill="url(#lanternGlow)"
              stroke="currentColor"
              strokeWidth="2"
            />

            {/* Hanging Lantern with glowing heart */}
            <line x1="24" y1="22" x2="24" y2="27" stroke="#34332F" strokeWidth="1.5" />
            <circle cx="24" cy="28.5" r="2.2" fill="#FEF3C7" stroke="#34332F" strokeWidth="1" />
            <path
              d="M 24 33 C 24 33 21.5 31.5 21.5 29.8 C 21.5 28.8 22.3 28 23.3 28 C 23.7 28 24 28.2 24 28.4 C 24 28.2 24.3 28 24.7 28 C 25.7 28 26.5 28.8 26.5 29.8 C 26.5 31.5 24 33 24 33 Z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      )}

      {/* Brand Wordmark & Tagline */}
      {showText && (
        <div className="flex flex-col text-left rtl:text-right">
          <div className="flex items-center gap-1.5">
            <span
              className={`${textSizes[size].title} font-bold tracking-tight text-[#765541] dark:text-[#EDE6DE] font-serif leading-tight group-hover:text-[#C47D60] dark:group-hover:text-[#D8896C] transition-colors`}
            >
              {language === 'ar' ? 'سَكَنِيّة' : 'Sakniya'}
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C47D60] dark:bg-[#D8896C]" />
          </div>
          <span
            className={`${textSizes[size].sub} text-[#A9B59A] dark:text-[#B4C2A5] font-medium tracking-wide leading-none`}
          >
            {language === 'ar' ? 'مكانك · وناسك · وراحتك' : 'Your space · Your people'}
          </span>
        </div>
      )}
    </div>
  );
};
