import React from 'react';
import { PropertyListing } from '../../types';
import { useApp } from '../../context/AppContext';
import { Heart, Star, ShieldCheck, MapPin, Scale, Sparkles, Clock } from 'lucide-react';

interface PropertyCardProps {
  property: PropertyListing;
  onSelect: (property: PropertyListing) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect }) => {
  const { language, favorites, toggleFavorite, comparedProperties, toggleCompare, searchFilter } = useApp();

  const isFavorite = favorites.includes(property.id);
  const isCompared = comparedProperties.includes(property.id);

  // Calculate commute to selected campus if a university is chosen
  const campusCommute = searchFilter.universityId
    ? property.location.nearbyUniversities.find((u) => u.universityId === searchFilter.universityId)
    : property.location.nearbyUniversities[0];

  return (
    <article
      onClick={() => onSelect(property)}
      className="group bg-white rounded-3xl border border-[#E9DDCC] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Container with Scrim & Actions */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E9DDCC]">
        <img
          src={property.coverImage}
          alt={language === 'ar' ? property.titleAr : property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges / Buttons */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Verified Host Marker */}
          <div className="pointer-events-auto">
            {property.ownerVerified && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-full shadow-sm text-[11px] font-semibold text-[#697A58] border border-[#697A58]/20">
                <ShieldCheck className="w-3.5 h-3.5 text-[#697A58]" />
                <span>{language === 'ar' ? 'سكن موثق' : 'Verified Host'}</span>
              </div>
            )}
          </div>

          {/* Action cluster: Compare & Favorite */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCompare(property.id);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                isCompared
                  ? 'bg-[#765541] text-white shadow-md'
                  : 'bg-white/80 hover:bg-white text-[#765541] hover:text-[#C47D60]'
              }`}
              title={language === 'ar' ? 'إضافة إلى المقارنة' : 'Compare'}
            >
              <Scale className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(property.id);
              }}
              aria-label={
                isFavorite
                  ? (language === 'ar' ? 'إزالة من المفضلة' : 'Remove from favorites')
                  : (language === 'ar' ? 'إضافة إلى المفضلة' : 'Add to favorites')
              }
              aria-pressed={isFavorite}
              className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 transform active:scale-90 ${
                isFavorite
                  ? 'bg-white text-[#C47D60] shadow-md ring-2 ring-[#C47D60]/40 scale-105'
                  : 'bg-white/85 hover:bg-white text-stone-700 hover:text-[#C47D60] hover:scale-110 shadow-sm'
              }`}
              title={
                isFavorite
                  ? (language === 'ar' ? 'في المفضلة (انقر للإزالة)' : 'In favorites (click to remove)')
                  : (language === 'ar' ? 'حفظ في المفضلة' : 'Save to favorites')
              }
            >
              <Heart
                className={`w-4 h-4 transition-all duration-300 ${
                  isFavorite
                    ? 'fill-[#C47D60] text-[#C47D60] scale-110 drop-shadow-sm'
                    : 'text-stone-700 hover:text-[#C47D60]'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Bottom image overlay with commute info */}
        {campusCommute && (
          <div className="absolute bottom-2.5 left-3 right-3">
            <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-xl text-[11px] text-[#F8F4EC] flex items-center justify-between font-medium">
              <span className="flex items-center gap-1 truncate max-w-[70%]">
                <Clock className="w-3 h-3 text-[#E9DDCC]" />
                <span className="truncate">{language === 'ar' ? campusCommute.nameAr : campusCommute.nameEn}</span>
              </span>
              <span className="font-mono tabular-nums text-amber-200">
                {campusCommute.walkingMinutes} {language === 'ar' ? 'د سيراً' : 'm walk'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Rating metadata */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <div className="flex items-center gap-1 truncate font-medium text-[#765541]">
              <MapPin className="w-3.5 h-3.5 text-[#C47D60] shrink-0" />
              <span className="truncate">
                {language === 'ar'
                  ? `${property.location.neighborhoodAr}، ${property.location.cityAr}`
                  : `${property.location.neighborhood}, ${property.location.city}`}
              </span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-[#34332F] shrink-0">
              <Star className="w-3.5 h-3.5 fill-[#C47D60] text-[#C47D60]" />
              <span className="font-mono tabular-nums">{property.rating.toFixed(1)}</span>
              <span className="text-stone-400 text-[10px]">({property.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm text-[#34332F] line-clamp-1 mb-2 group-hover:text-[#C47D60] transition-colors">
            {language === 'ar' ? property.titleAr : property.title}
          </h3>

          {/* Clean Unboxed Metadata with · separator */}
          <div className="flex items-center flex-wrap gap-1.5 text-xs text-stone-500 mb-3">
            <span>
              {property.propertyType === 'apartment'
                ? (language === 'ar' ? 'شقة كاملة' : 'Apartment')
                : property.propertyType === 'private_room'
                ? (language === 'ar' ? 'غرفة خاصة' : 'Private Room')
                : property.propertyType === 'shared_room'
                ? (language === 'ar' ? 'غرفة مشتركة' : 'Shared Room')
                : (language === 'ar' ? 'استوديو' : 'Studio')}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{property.totalBedrooms} {language === 'ar' ? 'غرف' : 'beds'}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{property.hasAC ? (language === 'ar' ? 'تكييف' : 'AC') : (language === 'ar' ? 'مروحة' : 'Fan')}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{property.isBathroomPrivate ? (language === 'ar' ? 'حمام خاص' : 'Private Bath') : (language === 'ar' ? 'حمام مشترك' : 'Shared Bath')}</span>
          </div>
        </div>

        {/* Pricing Baseline */}
        <div className="pt-3 border-t border-[#E9DDCC]/70 flex items-baseline justify-between">
          <div>
            <span className="text-lg font-bold text-[#765541] font-mono tabular-nums">
              {property.monthlyPrice.toLocaleString()}
            </span>
            <span className="text-xs text-stone-500 font-medium"> {language === 'ar' ? 'ج.م / شهرياً' : 'EGP / month'}</span>
          </div>

          <span className="text-[11px] font-semibold text-[#697A58]">
            {property.utilitiesIncluded
              ? (language === 'ar' ? 'شامل الفواتير' : 'Utilities incl.')
              : (language === 'ar' ? '+ خدمات تقديرية' : '+ utilities')}
          </span>
        </div>
      </div>
    </article>
  );
};
