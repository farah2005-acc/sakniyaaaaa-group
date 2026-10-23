import React, { useState } from 'react';
import { PropertyListing, PropertyRoom } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Heart,
  Scale,
  ShieldCheck,
  MapPin,
  Star,
  Clock,
  Wifi,
  Wind,
  UtensilsCrossed,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Calendar,
  Share2,
  Flag,
  ChevronRight,
  Info,
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: PropertyListing;
  onClose: () => void;
  onBook: (property: PropertyListing, room?: PropertyRoom) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onBook,
}) => {
  const {
    language,
    favorites,
    toggleFavorite,
    comparedProperties,
    toggleCompare,
    setActiveChatRecipient,
    setActiveModal,
    showNotification,
    reviews,
  } = useApp();

  const ownerReviews = reviews.filter(
    (r) => r.targetUserId === property.ownerId || r.targetUserId === 'owner-1'
  );
  const avgOwnerRating =
    ownerReviews.length > 0
      ? (ownerReviews.reduce((sum, r) => sum + r.rating, 0) / ownerReviews.length).toFixed(1)
      : property.rating?.toFixed(1) || '4.9';

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<PropertyRoom | undefined>(
    property.rooms.length > 0 ? property.rooms[0] : undefined
  );

  const isFavorite = favorites.includes(property.id);
  const isCompared = comparedProperties.includes(property.id);

  const handleStartChat = () => {
    setActiveChatRecipient({
      id: property.ownerId,
      name: property.ownerName,
      avatar: property.ownerAvatar,
      propertyContext: {
        id: property.id,
        title: language === 'ar' ? property.titleAr : property.title,
        price: property.monthlyPrice,
      },
    });
    setActiveModal('chat');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showNotification(
        language === 'ar' ? 'تم نسخ رابط العقار بنجاح' : 'Property link copied to clipboard',
        'success'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="bg-[#F8F4EC] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-[#E9DDCC] shadow-2xl relative flex flex-col">
        
        {/* Top Control Bar */}
        <div className="sticky top-0 z-20 bg-[#F8F4EC]/95 backdrop-blur-md px-6 py-4 border-b border-[#E9DDCC] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#765541]">
              {property.propertyType.replace('_', ' ').toUpperCase()}
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500">
              {language === 'ar' ? property.location.cityAr : property.location.city}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleCompare(property.id)}
              className={`p-2 rounded-full border transition-colors ${
                isCompared
                  ? 'bg-[#765541] text-white border-[#765541]'
                  : 'bg-white text-[#765541] border-[#E9DDCC] hover:bg-[#E9DDCC]'
              }`}
              title={language === 'ar' ? 'مقارنة' : 'Compare'}
            >
              <Scale className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(property.id)}
              className={`p-2 rounded-full border transition-colors ${
                isFavorite
                  ? 'bg-[#C47D60] text-white border-[#C47D60]'
                  : 'bg-white text-[#765541] border-[#E9DDCC] hover:bg-[#E9DDCC]'
              }`}
              title={language === 'ar' ? 'مفضلة' : 'Favorite'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white text-[#765541] border border-[#E9DDCC] hover:bg-[#E9DDCC] transition-colors"
              title={language === 'ar' ? 'مشاركة' : 'Share'}
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white text-[#765541] border border-[#E9DDCC] hover:bg-[#E9DDCC] transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="p-6 pb-2">
          <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-stone-200 shadow-inner relative">
            <img
              src={property.images[activeImageIndex] || property.coverImage}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            {property.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full">
                {property.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      activeImageIndex === idx ? 'bg-white scale-125' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {property.images.length > 1 && (
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx ? 'border-[#C47D60] scale-95' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content & Purchase Split */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left / Center 2 Columns: Description & Details */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Title & Location Header */}
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                <MapPin className="w-3.5 h-3.5 text-[#C47D60]" />
                <span className="font-semibold text-[#765541]">
                  {language === 'ar'
                    ? `${property.location.streetApproxAr} · ${property.location.neighborhoodAr}، ${property.location.cityAr}`
                    : `${property.location.streetApprox} · ${property.location.neighborhood}, ${property.location.city}`}
                </span>
              </div>
              <h1 className="text-2xl font-bold font-serif text-[#34332F] leading-snug">
                {language === 'ar' ? property.titleAr : property.title}
              </h1>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <div className="flex items-center gap-1 font-bold text-[#34332F]">
                  <Star className="w-4 h-4 fill-[#C47D60] text-[#C47D60]" />
                  <span>{property.rating}</span>
                  <span className="text-stone-400 font-normal">({property.reviewsCount} {language === 'ar' ? 'تقييم موثق' : 'verified reviews'})</span>
                </div>
                <span>·</span>
                <span className="text-[#697A58] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {language === 'ar' ? 'سكن موثق ومعتمد' : 'Verified Listing'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="text-sm text-stone-700 leading-relaxed bg-white p-5 rounded-2xl border border-[#E9DDCC]">
              <h3 className="font-bold text-xs uppercase text-[#765541] mb-2">
                {language === 'ar' ? 'عن هذا السكن' : 'About this Space'}
              </h3>
              <p>{language === 'ar' ? property.descriptionAr : property.description}</p>
            </div>

            {/* Rooms Available Selection */}
            {property.rooms && property.rooms.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-[#E9DDCC]">
                <h3 className="font-bold text-xs uppercase text-[#765541] mb-3">
                  {language === 'ar' ? 'الغرف والأسِرّة المتاحة للحجز الفردي' : 'Available Rooms & Beds'}
                </h3>
                <div className="space-y-3">
                  {property.rooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedRoom?.id === room.id
                          ? 'border-[#C47D60] bg-[#F8F4EC] ring-1 ring-[#C47D60]'
                          : 'border-[#E9DDCC] hover:bg-stone-50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-[#34332F]">
                          {language === 'ar' ? room.nameAr : room.name}
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-1">
                          <span>{room.type === 'private' ? (language === 'ar' ? 'غرفة خاصة' : 'Private') : (language === 'ar' ? 'غرفة مشتركة' : 'Shared')}</span>
                          <span>·</span>
                          <span>{room.privateBathroom ? (language === 'ar' ? 'حمام خاص' : 'Private Bath') : (language === 'ar' ? 'حمام مشترك' : 'Shared Bath')}</span>
                          <span>·</span>
                          <span>{room.hasAC ? (language === 'ar' ? 'تكييف' : 'AC') : (language === 'ar' ? 'مروحة' : 'Fan')}</span>
                        </div>
                      </div>
                      <div className="text-right rtl:text-left">
                        <span className="font-mono font-bold text-sm text-[#765541]">
                          {room.monthlyPrice.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                        </span>
                        <span className="block text-[10px] text-stone-400">
                          {language === 'ar' ? 'شهرياً' : '/ month'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Commute to Campuses */}
            <div className="bg-white p-5 rounded-2xl border border-[#E9DDCC]">
              <h3 className="font-bold text-xs uppercase text-[#765541] mb-3 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#697A58]" />
                <span>{language === 'ar' ? 'أوقات المشوار المقدرة للكليات والجامعات' : 'Verified Campus Commute Estimates'}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {property.location.nearbyUniversities.map((uni, idx) => (
                  <div key={idx} className="p-3 bg-[#F8F4EC] rounded-xl border border-[#E9DDCC]">
                    <span className="font-bold text-[#34332F] block truncate">
                      {language === 'ar' ? uni.nameAr : uni.nameEn}
                    </span>
                    <div className="flex items-center justify-between text-stone-600 mt-2 font-mono tabular-nums text-[11px]">
                      <span>{uni.walkingMinutes} {language === 'ar' ? 'د سيراً' : 'm walk'}</span>
                      <span>{uni.transitMinutes} {language === 'ar' ? 'د مواصلات' : 'm transit'}</span>
                      <span>{uni.drivingMinutes} {language === 'ar' ? 'د سيارة' : 'm drive'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules & Amenities */}
            <div className="bg-white p-5 rounded-2xl border border-[#E9DDCC]">
              <h3 className="font-bold text-xs uppercase text-[#765541] mb-3">
                {language === 'ar' ? 'قواعد السكن والاشتراطات' : 'House Rules & Community Expectations'}
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  {property.houseRules.smokingAllowed ? (
                    <CheckCircle2 className="w-4 h-4 text-[#697A58]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#C47D60]" />
                  )}
                  <span>{property.houseRules.smokingAllowed ? (language === 'ar' ? 'مسموح بالتدخين' : 'Smoking allowed') : (language === 'ar' ? 'ممنوع التدخين داخل السكن' : 'Strictly smoke-free')}</span>
                </div>
                <div className="flex items-center gap-2">
                  {property.houseRules.petsAllowed ? (
                    <CheckCircle2 className="w-4 h-4 text-[#697A58]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#C47D60]" />
                  )}
                  <span>{property.houseRules.petsAllowed ? (language === 'ar' ? 'مسموح بالحيوانات الأليفة' : 'Pets allowed') : (language === 'ar' ? 'غير مسموح بالحيوانات' : 'No pets')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#765541]" />
                  <span>{language === 'ar' ? `ساعات الهدوء: من ${property.houseRules.quietHoursStart} إلى ${property.houseRules.quietHoursEnd}` : `Quiet hours: ${property.houseRules.quietHoursStart} - ${property.houseRules.quietHoursEnd}`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#765541]" />
                  <span>{language === 'ar' ? `سياسة الجنس: ${property.houseRules.genderPolicy === 'male_only' ? 'شباب فقط' : property.houseRules.genderPolicy === 'female_only' ? 'بنات فقط' : 'الكل متاح'}` : `Gender policy: ${property.houseRules.genderPolicy}`}</span>
                </div>
              </div>
            </div>

            {/* Host Profile */}
            <div className="bg-white p-5 rounded-2xl border border-[#E9DDCC] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={property.ownerAvatar}
                  alt={property.ownerName}
                  className="w-12 h-12 rounded-full object-cover border border-[#E9DDCC]"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-[#34332F]">
                    <span>{property.ownerName}</span>
                    <ShieldCheck className="w-4 h-4 text-[#697A58]" />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#F59E0B]">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{avgOwnerRating}</span>
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="text-xs text-stone-500">
                      {ownerReviews.length} {language === 'ar' ? 'تقييمات موثقة' : 'verified reviews'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleStartChat}
                className="px-4 py-2 bg-[#F8F4EC] hover:bg-[#E9DDCC] text-[#765541] font-semibold text-xs rounded-xl border border-[#E9DDCC] flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#C47D60]" />
                <span>{language === 'ar' ? 'مراسلة المالك' : 'Message Host'}</span>
              </button>
            </div>

            {/* Reviews about this Landlord */}
            {ownerReviews.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-[#E9DDCC] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase text-[#765541]">
                    {language === 'ar' ? 'آراء المستأجرين في المالك' : 'Tenant Reviews & Feedback'}
                  </h3>
                  <span className="text-[11px] font-mono font-bold text-[#C47D60]">
                    ★ {avgOwnerRating} / 5
                  </span>
                </div>
                <div className="space-y-2.5">
                  {ownerReviews.slice(0, 2).map((r) => (
                    <div key={r.id} className="p-3 bg-[#F8F4EC] rounded-xl border border-[#E9DDCC] space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img
                            src={r.reviewerAvatar}
                            alt={r.reviewerName}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="font-bold text-[#34332F]">{r.reviewerName}</span>
                        </div>
                        <div className="flex items-center text-[#F59E0B] text-xs">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="ml-1 font-mono font-bold">{r.rating}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed italic">
                        "{r.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Purchase Box */}
          <div className="space-y-4">
            <div className="sticky top-24 bg-white p-6 rounded-3xl border border-[#E9DDCC] shadow-lg space-y-5">
              
              {/* Pricing Header */}
              <div className="flex items-baseline justify-between border-b border-[#E9DDCC] pb-4">
                <div>
                  <span className="text-2xl font-bold font-mono text-[#765541]">
                    {(selectedRoom ? selectedRoom.monthlyPrice : property.monthlyPrice).toLocaleString()}
                  </span>
                  <span className="text-xs text-stone-500 font-medium"> {language === 'ar' ? 'ج.م / شهرياً' : 'EGP / month'}</span>
                </div>
                <div className="text-right rtl:text-left text-[11px] text-[#697A58] font-semibold">
                  {property.utilitiesIncluded
                    ? (language === 'ar' ? 'شامل الفواتير' : 'Utilities incl.')
                    : (language === 'ar' ? `~${property.estimatedUtilitiesMonthly} ج فواتير` : `~${property.estimatedUtilitiesMonthly} EGP util`)}
                </div>
              </div>

              {/* Fee Breakdown Transparency */}
              <div className="space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>{language === 'ar' ? 'تأمين مسترد عند المغادرة' : 'Refundable Security Deposit'}</span>
                  <span className="font-mono tabular-nums font-semibold">
                    {property.depositAmount.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'ar' ? 'عمولة المنصة (عقد فصل دراسي ٥٪)' : 'Platform Commission (Semester 5%)'}</span>
                  <span className="font-mono tabular-nums text-[#697A58] font-semibold">
                    {Math.round((selectedRoom ? selectedRoom.monthlyPrice : property.monthlyPrice) * 0.05).toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-stone-400">
                  <span>{language === 'ar' ? 'الحد الأدنى للإقامة' : 'Minimum Stay'}</span>
                  <span>{property.minimumStayMonths} {language === 'ar' ? 'أشهر' : 'months'}</span>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={() => onBook(property, selectedRoom)}
                className="w-full py-3.5 bg-[#C47D60] hover:bg-[#b06a4e] text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{language === 'ar' ? 'طلب الحجز الآمن' : 'Request Secure Booking'}</span>
              </button>

              <p className="text-[11px] text-center text-stone-400">
                {language === 'ar'
                  ? 'لن يتم سحب أي مبالغ حتى يوافق صاحب السكن على طلبك.'
                  : 'You will not be charged until the host approves your request.'}
              </p>

              {/* Support & Guarantee note */}
              <div className="p-3 bg-[#F8F4EC] rounded-xl border border-[#E9DDCC] text-[11px] text-stone-600 space-y-1">
                <div className="font-bold text-[#765541] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#697A58]" />
                  <span>{language === 'ar' ? 'ضمان سكنية للأمان السكني' : 'Sakniya Housing Guarantee'}</span>
                </div>
                <p>
                  {language === 'ar'
                    ? 'حماية كاملة للعربون حتى استلام الغرفة ومطابقتها للمواصفات.'
                    : 'Full deposit protection until check-in and room inspection.'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
