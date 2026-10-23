import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, UserReview } from '../../types';
import { Star, X, ShieldCheck, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

interface ReviewModalProps {
  booking: Booking;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ booking, onClose, onSuccess }) => {
  const { user, role, language, submitReview } = useApp();

  const isTenant = role === 'tenant';
  const targetId = isTenant ? booking.ownerId : booking.tenantId;
  const targetName = isTenant ? booking.ownerName : booking.tenantName;
  const targetRole = isTenant ? 'owner' : 'tenant';

  const [overallRating, setOverallRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const [communication, setCommunication] = useState<number>(5);
  const [honesty, setHonesty] = useState<number>(5);
  const [cleanliness, setCleanliness] = useState<number>(5);
  const [respect, setRespect] = useState<number>(5);

  const [comment, setComment] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg(
        language === 'ar'
          ? 'يرجى كتابة تعليق يوضح تجربتك السكنية الفعلية'
          : 'Please write written feedback describing your rental experience'
      );
      return;
    }

    if (!user) {
      setErrorMsg(language === 'ar' ? 'يرجى تسجيل الدخول' : 'Please log in');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const result = submitReview({
      bookingId: booking.id,
      propertyId: booking.propertyId,
      propertyTitle: booking.propertyTitle,
      propertyTitleAr: booking.propertyTitleAr,
      reviewerId: user.id,
      reviewerName: user.name,
      reviewerRole: isTenant ? 'tenant' : 'owner',
      reviewerAvatar: user.avatar,
      targetUserId: targetId,
      targetUserName: targetName,
      targetUserRole: targetRole,
      rating: overallRating,
      criteria: {
        communication,
        honestyOrReliability: honesty,
        cleanlinessOrPropertyCare: cleanliness,
        respectOrAgreements: respect,
      },
      comment: comment.trim(),
    });

    setIsSubmitting(false);

    if (result.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setErrorMsg(result.error || 'Failed to submit review');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white dark:bg-[#24201D] text-[#34332F] dark:text-[#EDE6DE] w-full max-w-xl rounded-3xl border border-[#E9DDCC] dark:border-[#3D352E] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E9DDCC] dark:border-[#3D352E] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#C47D60]/10 text-[#C47D60] flex items-center justify-center">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg font-serif">
                {language === 'ar'
                  ? isTenant
                    ? `تقييم المالك: ${targetName}`
                    : `تقييم المستأجر: ${targetName}`
                  : isTenant
                  ? `Review Landlord: ${targetName}`
                  : `Review Tenant: ${targetName}`}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {language === 'ar'
                  ? `حجز موثق: ${booking.propertyTitleAr || booking.propertyTitle}`
                  : `Verified Stay: ${booking.propertyTitle}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Overall Star Rating */}
          <div className="text-center p-4 bg-[#F8F4EC] dark:bg-[#1E1A18] rounded-2xl border border-[#E9DDCC] dark:border-[#3D352E]">
            <span className="block font-bold text-xs uppercase tracking-wider text-[#765541] dark:text-[#D4BFA8] mb-2">
              {language === 'ar' ? 'التقييم الإجمالي للتعامل' : 'Overall Experience Rating'}
            </span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setOverallRating(star)}
                  className="p-1 focus:outline-none transition-transform hover:scale-125"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      (hoverRating || overallRating) >= star
                        ? 'fill-[#F59E0B] text-[#F59E0B] drop-shadow-sm'
                        : 'text-stone-300 dark:text-stone-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="block text-xs font-mono font-bold text-[#C47D60] mt-2">
              {overallRating} / 5
            </span>
          </div>

          {/* Detailed Criteria */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase text-[#765541] dark:text-[#EDE6DE] tracking-wide">
              {language === 'ar' ? 'تقييم معايير المعاملة السكنية' : 'Detailed Evaluation Criteria'}
            </h3>

            <div className="space-y-2.5">
              {/* Criteria 1: Communication */}
              <div className="flex items-center justify-between p-2.5 bg-white dark:bg-[#2A2421] rounded-xl border border-[#E9DDCC] dark:border-[#3D352E]">
                <span className="text-xs font-medium">
                  {language === 'ar' ? 'سرعة الاستجابة والتواصل' : 'Communication & Responsiveness'}
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setCommunication(s)}
                      className="p-0.5"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          communication >= s
                            ? 'fill-[#F59E0B] text-[#F59E0B]'
                            : 'text-stone-300 dark:text-stone-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Criteria 2: Honesty & Reliability */}
              <div className="flex items-center justify-between p-2.5 bg-white dark:bg-[#2A2421] rounded-xl border border-[#E9DDCC] dark:border-[#3D352E]">
                <span className="text-xs font-medium">
                  {isTenant
                    ? language === 'ar'
                      ? 'النزاهة والالتزام بالعقد والتأمين'
                      : 'Honesty & Lease Terms'
                    : language === 'ar'
                    ? 'الالتزام بمواعيد الإيجار والمصداقية'
                    : 'Payment Punctuality & Reliability'}
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setHonesty(s)}
                      className="p-0.5"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          honesty >= s
                            ? 'fill-[#F59E0B] text-[#F59E0B]'
                            : 'text-stone-300 dark:text-stone-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Criteria 3: Property Care / Cleanliness */}
              <div className="flex items-center justify-between p-2.5 bg-white dark:bg-[#2A2421] rounded-xl border border-[#E9DDCC] dark:border-[#3D352E]">
                <span className="text-xs font-medium">
                  {isTenant
                    ? language === 'ar'
                      ? 'الصيانة الدورية وحالة الشقة'
                      : 'Maintenance & Space Condition'
                    : language === 'ar'
                    ? 'الحفاظ على الأثاث والنظافة'
                    : 'Property Care & Cleanliness'}
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setCleanliness(s)}
                      className="p-0.5"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          cleanliness >= s
                            ? 'fill-[#F59E0B] text-[#F59E0B]'
                            : 'text-stone-300 dark:text-stone-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Criteria 4: Respect & Professionalism */}
              <div className="flex items-center justify-between p-2.5 bg-white dark:bg-[#2A2421] rounded-xl border border-[#E9DDCC] dark:border-[#3D352E]">
                <span className="text-xs font-medium">
                  {isTenant
                    ? language === 'ar'
                      ? 'الاحترام والتعامل الراقي'
                      : 'Professionalism & Respect'
                    : language === 'ar'
                    ? 'احترام الجيران وقواعد السكن'
                    : 'House Rules & Neighbor Respect'}
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRespect(s)}
                      className="p-0.5"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          respect >= s
                            ? 'fill-[#F59E0B] text-[#F59E0B]'
                            : 'text-stone-300 dark:text-stone-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Written Feedback Comment */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#765541] dark:text-[#EDE6DE]">
              {language === 'ar' ? 'تعليقك ورأيك المفصل في التجربة السكنية' : 'Written Feedback & Comments'}
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                language === 'ar'
                  ? isTenant
                    ? 'اكتب رأيك عن معاملة المالك، دقة الوصف، نظافة الشقة، وسرعة حل المشكلات...'
                    : 'اكتب رأيك عن سلوك المستأجر، التزامه بمواعيد السداد، ونظافة الغرفة والأثاث...'
                  : 'Describe your honest rental experience to help the Sakniya community...'
              }
              className="w-full p-3 bg-[#F8F4EC] dark:bg-[#1E1A18] border border-[#E9DDCC] dark:border-[#3D352E] rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C47D60]"
            />
          </div>

          {/* Verification Assurance notice */}
          <div className="flex items-center gap-2 text-stone-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-[#697A58] shrink-0" />
            <span>
              {language === 'ar'
                ? 'تقييمك يتم ربطه بالحجز الموثق ويظهر علناً في بروفايل المستخدم لبناء الثقة.'
                : 'Your review is verified via your confirmed stay and visible to the community.'}
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#C47D60] hover:bg-[#b06a4e] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              {isSubmitting
                ? (language === 'ar' ? 'جارٍ النشر...' : 'Publishing...')
                : (language === 'ar' ? 'نشر التقييم المتبادل' : 'Submit Review')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
