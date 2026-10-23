import React from 'react';
import { PropertyListing } from '../../types';
import { useApp } from '../../context/AppContext';
import { Heart, ShieldCheck, MapPin, Scale, Clock } from 'lucide-react';
import { StarRating } from '../common/StarRating';

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
      className="group bg-white dark:bg-[#24201D] rounded-3xl border border-[#E9DDCC] dark:border-[#3D352E] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Container with Scrim & Actions */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E9DDCC] dark:bg-[#2D2723]">
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
              <div className="flex items-center gap-1 px-2.5 py-1 bg-white/95 dark:bg-[#191614]/90 backdrop-blur-md rounded-full shadow-sm text-[11px] font-semibold text-[#697A58] dark:text-[#A9B59A] border border-[#697A58]/20 dark:border-[#A9B59A]/30">
                <ShieldCheck className="w-3.5 h-3.5 text-[#697A58] dark:text-[#A9B59A]" />
                <span>{language === 'ar' ? 'سكن موثق' : 'Verified Host'}</span>
              </div>
            )}
          </div>

          {/* Action cluster: Compare Checkbox & Favorite Heart */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Justice Scales Comparison Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleCompare(property.id);
              }}
              aria-label={
                isCompared
                  ? (language === 'ar' ? 'إزالة من المقارنة' : 'Remove from comparison')
                  : (language === 'ar' ? 'مقارنة العقار (ميزان المقارنة العادلة)' : 'Compare Property (Justice Scale)')
              }
              aria-pressed={isCompared}
              className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 transform active:scale-90 border flex items-center justify-center ${
                isCompared
                  ? 'bg-[#765541] dark:bg-[#C47D60] text-white shadow-md ring-2 ring-[#C47D60]/40 scale-105 border-[#765541] dark:border-[#C47D60]'
                  : 'bg-white/85 dark:bg-[#24201D]/85 hover:bg-white dark:hover:bg-[#2D2723] text-stone-700 dark:text-stone-300 hover:text-[#765541] dark:hover:text-[#C47D60] hover:scale-110 shadow-sm border-[#E9DDCC]/70 dark:border-[#3D352E]'
              }`}
              title={
                isCompared
                  ? (language === 'ar' ? 'في المقارنة (ميزان العدالة - انقر للإزالة)' : 'Comparing (Justice Scale - click to remove)')
                  : (language === 'ar' ? 'مقارنة العقار (ميزان العدالة)' : 'Compare Property (Justice Scale)')
              }
            >
              <Scale
                className={`w-4 h-4 transition-all duration-300 ${
                  isCompared ? 'stroke-[2.5] text-white' : 'stroke-[1.75]'
                }`}
              />
            </button>

            {/* Heart Favorite Toggle Button */}
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
              className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 transform active:scale-90 border ${
                isFavorite
                  ? 'bg-white dark:bg-[#24201D] text-[#C47D60] dark:text-[#D8896C] shadow-md ring-2 ring-[#C47D60]/40 scale-105 border-[#C47D60]/40'
                  : 'bg-white/85 dark:bg-[#24201D]/85 hover:bg-white dark:hover:bg-[#2D2723] text-stone-700 dark:text-stone-300 hover:text-[#C47D60] hover:scale-110 shadow-sm border-[#E9DDCC]/70 dark:border-[#3D352E]'
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
                    ? 'fill-[#C47D60] dark:fill-[#D8896C] text-[#C47D60] dark:text-[#D8896C] scale-110 drop-shadow-sm'
                    : 'text-stone-700 dark:text-stone-300 hover:text-[#C47D60]'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Bottom image overlay with commute info */}
        {campusCommute && (
          <div className="absolute bottom-2.5 left-3 right-3">
            <div className="px-3 py-1.5 bg-black/65 backdrop-blur-md rounded-xl text-[11px] text-[#F8F4EC] flex items-center justify-between font-medium">
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
          {/* Location & Star Rating */}
          <div className="flex items-center justify-between gap-2 text-xs mb-2">
            <div className="flex items-center gap-1 truncate font-medium text-[#765541] dark:text-[#D4BFA8]">
              <MapPin className="w-3.5 h-3.5 text-[#C47D60] shrink-0" />
              <span className="truncate">
                {language === 'ar'
                  ? `${property.location.neighborhoodAr}، ${property.location.cityAr}`
                  : `${property.location.neighborhood}, ${property.location.city}`}
              </span>
            </div>

            {/* Interactive 5-Star Rating Component */}
            <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
              <StarRating
                rating={property.rating}
                reviewsCount={property.reviewsCount}
                size="sm"
                interactive={true}
              />
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm text-[#34332F] dark:text-[#EDE6DE] line-clamp-1 mb-2 group-hover:text-[#C47D60] dark:group-hover:text-[#D8896C] transition-colors">
            {language === 'ar' ? property.titleAr : property.title}
          </h3>

          {/* Clean Unboxed Metadata with · separator */}
          <div className="flex items-center flex-wrap gap-1.5 text-xs text-stone-500 dark:text-[#9E9287] mb-3">
            <span>
              {property.propertyType === 'apartment'
                ? (language === 'ar' ? 'شقة كاملة' : 'Apartment')
                : property.propertyType === 'private_room'
                ? (language === 'ar' ? 'غرفة خاصة' : 'Private Room')
                : property.propertyType === 'shared_room'
                ? (language === 'ar' ? 'غرفة مشتركة' : 'Shared Room')
                : (language === 'ar' ? 'استوديو' : 'Studio')}
            </span>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-600">·</span>
            <span>{property.totalBedrooms} {language === 'ar' ? 'غرف' : 'beds'}</span>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-600">·</span>
            <span>{property.hasAC ? (language === 'ar' ? 'تكييف' : 'AC') : (language === 'ar' ? 'مروحة' : 'Fan')}</span>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-600">·</span>
            <span>{property.isBathroomPrivate ? (language === 'ar' ? 'حمام خاص' : 'Private Bath') : (language === 'ar' ? 'حمام مشترك' : 'Shared Bath')}</span>
          </div>
        </div>

        {/* Pricing Baseline */}
        <div className="pt-3 border-t border-[#E9DDCC]/70 dark:border-[#3D352E]/70 flex items-baseline justify-between">
          <div>
            <span className="text-lg font-bold text-[#765541] dark:text-[#D4BFA8] font-mono tabular-nums">
              {property.monthlyPrice.toLocaleString()}
            </span>
            <span className="text-xs text-stone-500 dark:text-[#9E9287] font-medium"> {language === 'ar' ? 'ج.م / شهرياً' : 'EGP / month'}</span>
          </div>

          <span className="text-[11px] font-semibold text-[#697A58] dark:text-[#A9B59A]">
            {property.utilitiesIncluded
              ? (language === 'ar' ? 'شامل الفواتير' : 'Utilities incl.')
              : (language === 'ar' ? '+ خدمات تقديرية' : '+ utilities')}
          </span>
        </div>
      </div>
    </article>
  );
};
