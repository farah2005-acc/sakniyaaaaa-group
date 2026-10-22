import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface StarRatingProps {
  rating: number; // e.g. 4.8
  reviewsCount: number; // e.g. 24
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRate?: (newRating: number) => void;
  showCount?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  reviewsCount,
  size = 'sm',
  interactive = true,
  onRate,
  showCount = true,
}) => {
  const { language, showNotification } = useApp();
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);

  const displayRating = userRating !== null ? userRating : (hoveredStar !== null ? hoveredStar : rating);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const handleStarClick = (e: React.MouseEvent, starIndex: number) => {
    e.stopPropagation();
    if (!interactive) return;
    setUserRating(starIndex);
    if (onRate) {
      onRate(starIndex);
    }
    showNotification(
      language === 'ar'
        ? `شكراً لتقييمك! تم تسجيل ${starIndex} من 5 نجوم.`
        : `Thank you! Recorded your rating of ${starIndex} out of 5 stars.`,
      'success'
    );
  };

  return (
    <div
      className="inline-flex items-center gap-1.5"
      onMouseLeave={() => setHoveredStar(null)}
      title={`${rating.toFixed(1)} / 5 (${reviewsCount} ${language === 'ar' ? 'تقييم موثق' : 'verified reviews'})`}
    >
      {/* 5-star Glyphs */}
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          // Calculate fill fraction
          const fillPercentage = Math.min(
            100,
            Math.max(0, (displayRating - (starIndex - 1)) * 100)
          );

          return (
            <div
              key={starIndex}
              className={`relative cursor-pointer transition-transform duration-150 ${
                interactive ? 'hover:scale-125 active:scale-95' : 'cursor-default'
              }`}
              onMouseEnter={() => interactive && setHoveredStar(starIndex)}
              onClick={(e) => handleStarClick(e, starIndex)}
            >
              {/* Background empty star */}
              <Star
                className={`${starSizes[size]} text-[#E9DDCC] dark:text-[#3D352E] transition-colors`}
              />

              {/* Foreground filled fraction star */}
              {fillPercentage > 0 && (
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <Star
                    className={`${starSizes[size]} fill-[#C47D60] dark:fill-[#D8896C] text-[#C47D60] dark:text-[#D8896C] drop-shadow-sm`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Numeric Score & Review Count */}
      <div className="flex items-center gap-1 text-xs">
        <span className="font-bold font-mono tabular-nums text-[#34332F] dark:text-[#EDE6DE]">
          {displayRating.toFixed(1)}
        </span>
        {showCount && (
          <span className="text-[10px] text-stone-400 dark:text-[#9E9287]">
            ({userRating !== null ? reviewsCount + 1 : reviewsCount})
          </span>
        )}
      </div>
    </div>
  );
};
