import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserReview } from '../../types';
import { Star, ShieldCheck, MessageSquare, ThumbsUp } from 'lucide-react';

interface UserReviewsListProps {
  targetUserId: string;
  targetRole: 'tenant' | 'owner';
  targetName: string;
}

export const UserReviewsList: React.FC<UserReviewsListProps> = ({
  targetUserId,
  targetRole,
  targetName,
}) => {
  const { reviews, language } = useApp();

  // Filter reviews written about this target user
  const userReviews = reviews.filter((r) => r.targetUserId === targetUserId);

  const averageRating =
    userReviews.length > 0
      ? (userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(1)
      : '5.0';

  return (
    <div className="bg-white dark:bg-[#24201D] rounded-3xl p-6 sm:p-7 border border-[#E9DDCC] dark:border-[#3D352E] shadow-sm space-y-6 transition-colors">
      {/* Header and Aggregate Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E9DDCC] dark:border-[#3D352E]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base sm:text-lg text-[#34332F] dark:text-[#EDE6DE] font-serif">
              {language === 'ar'
                ? `تقييمات وآراء ${targetRole === 'owner' ? 'المستأجرين في المالك' : 'المُلّاك في المستأجر'}`
                : `Reviews for ${targetName}`}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#697A58]/10 text-[#697A58] dark:text-[#A9B59A] border border-[#697A58]/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>{language === 'ar' ? 'معاملات موثقة' : 'Verified Stays'}</span>
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            {language === 'ar'
              ? 'تقييمات متبادلة حقيقية مبنية على عقود وحجوزات سكنية مؤكدة عبر منصة سكنية.'
              : 'Authentic two-way reviews verified by real completed stays.'}
          </p>
        </div>

        {/* Score badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-center sm:text-right rtl:sm:text-left">
            <div className="text-3xl font-black font-mono text-[#C47D60] dark:text-[#D8896C] tabular-nums leading-none">
              {averageRating}
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-1 mt-1 text-[#F59E0B]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    Number(averageRating) >= s ? 'fill-current' : 'text-stone-300 dark:text-stone-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-stone-400 font-semibold mt-0.5 block">
              {userReviews.length} {language === 'ar' ? 'تقييمات فعلية' : 'reviews'}
            </span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {userReviews.length === 0 ? (
        <div className="py-8 text-center text-stone-400 dark:text-stone-500 text-xs">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>{language === 'ar' ? 'لا توجد تقييمات منشورة بعد لهذا الحساب' : 'No verified reviews yet'}</p>
        </div>
      ) : (
        <div className="space-y-4 divide-y divide-[#E9DDCC]/60 dark:divide-[#3D352E]/60">
          {userReviews.map((rev) => (
            <div key={rev.id} className="pt-4 first:pt-0 space-y-3">
              {/* Reviewer line */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.reviewerAvatar}
                    alt={rev.reviewerName}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#E9DDCC] dark:border-[#3D352E] shadow-sm shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#34332F] dark:text-[#EDE6DE]">
                        {rev.reviewerName}
                      </span>
                      <span className="text-[10px] text-[#765541] dark:text-[#D4BFA8] bg-[#765541]/10 px-2 py-0.5 rounded-full font-semibold">
                        {rev.reviewerRole === 'tenant'
                          ? (language === 'ar' ? 'مستأجرة موثقة' : 'Verified Tenant')
                          : (language === 'ar' ? 'مالكة موثقة' : 'Verified Landlord')}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-400 mt-0.5">
                      {rev.propertyTitleAr || rev.propertyTitle} · {rev.createdAt}
                    </p>
                  </div>
                </div>

                {/* Star rating for this review */}
                <div className="flex items-center gap-1 text-[#F59E0B] shrink-0">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold font-mono text-[#34332F] dark:text-[#EDE6DE]">
                    {rev.rating}
                  </span>
                </div>
              </div>

              {/* Comment text */}
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed pr-2 pl-2">
                "{rev.comment}"
              </p>

              {/* Sub-criteria chips */}
              {rev.criteria && (
                <div className="flex flex-wrap gap-2 text-[10px] text-stone-500 dark:text-stone-400 pt-1">
                  <span className="px-2 py-0.5 bg-[#F8F4EC] dark:bg-[#1E1A18] rounded-md border border-[#E9DDCC] dark:border-[#3D352E]">
                    {language === 'ar' ? 'التواصل:' : 'Communication:'} {rev.criteria.communication}/5
                  </span>
                  <span className="px-2 py-0.5 bg-[#F8F4EC] dark:bg-[#1E1A18] rounded-md border border-[#E9DDCC] dark:border-[#3D352E]">
                    {language === 'ar' ? 'المصداقية:' : 'Reliability:'} {rev.criteria.honestyOrReliability}/5
                  </span>
                  <span className="px-2 py-0.5 bg-[#F8F4EC] dark:bg-[#1E1A18] rounded-md border border-[#E9DDCC] dark:border-[#3D352E]">
                    {language === 'ar' ? 'النظافة والصيانة:' : 'Care & Hygiene:'} {rev.criteria.cleanlinessOrPropertyCare}/5
                  </span>
                  <span className="px-2 py-0.5 bg-[#F8F4EC] dark:bg-[#1E1A18] rounded-md border border-[#E9DDCC] dark:border-[#3D352E]">
                    {language === 'ar' ? 'الاحترام:' : 'Respect:'} {rev.criteria.respectOrAgreements}/5
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
