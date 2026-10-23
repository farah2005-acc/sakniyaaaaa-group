import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import { ReviewModal } from '../reviews/ReviewModal';
import { UserReviewsList } from '../reviews/UserReviewsList';
import {
  Calendar,
  ShieldCheck,
  MapPin,
  Clock,
  Printer,
  MessageCircle,
  AlertCircle,
  FileText,
  User,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Star,
  CheckCircle2,
} from 'lucide-react';

export const TenantDashboard: React.FC = () => {
  const {
    user,
    language,
    bookings,
    reviews,
    updateBookingStatus,
    setActiveChatRecipient,
    setActiveModal,
    showNotification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'confirmed' | 'pending'>('all');
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);

  const myBookings = bookings.filter((b) => b.tenantId === user?.id || b.tenantId === 'user-tenant-1');
  const filteredBookings = activeTab === 'all'
    ? myBookings
    : myBookings.filter((b) => b.status === activeTab);

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من إلغاء هذا الحجز وفقاً لسياسة الإلغاء؟' : 'Are you sure you want to cancel this booking according to the cancellation policy?')) {
      updateBookingStatus(bookingId, 'cancelled');
      showNotification(
        language === 'ar' ? 'تم إلغاء الحجز وبدء إجراءات استرداد التأمين' : 'Booking cancelled; refund initiated',
        'info'
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Summary Card */}
      <div className="bg-white dark:bg-[#24201D] rounded-3xl p-6 sm:p-8 border border-[#E9DDCC] dark:border-[#3D352E] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors">
        <div className="flex items-center gap-5">
          <img
            src={user?.avatar || '/src/assets/images/avatar_nora_tenant_1792715698432.jpg'}
            alt={user?.name || 'User'}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#C47D60] dark:border-[#D8896C] shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-serif text-[#34332F] dark:text-[#EDE6DE]">{user?.name}</h1>
              {user?.isVerified && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#697A58] dark:text-[#A9B59A] bg-[#697A58]/10 dark:bg-[#697A58]/20 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {language === 'ar' ? 'حساب موثق' : 'Verified Student'}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 dark:text-[#9E9287] mt-1 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#765541] dark:text-[#D4BFA8]" />
              <span>{user?.university || 'Pharos University in Alexandria (PUA)'}</span>
              <span>·</span>
              <span>{user?.faculty || 'Computer Science & Engineering'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setActiveModal('verify')}
            className="flex-1 md:flex-initial px-4 py-2 bg-[#F8F4EC] dark:bg-[#2D2723] hover:bg-[#E9DDCC] dark:hover:bg-[#3D352E] text-[#765541] dark:text-[#D4BFA8] rounded-xl text-xs font-semibold border border-[#E9DDCC] dark:border-[#3D352E] transition-colors flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-[#697A58] dark:text-[#A9B59A]" />
            <span>{language === 'ar' ? 'إدارة الوثائق والهوية' : 'Verification Documents'}</span>
          </button>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold font-serif text-[#34332F] dark:text-[#EDE6DE]">
              {language === 'ar' ? 'سجل الحجوزات والإقامات' : 'My Housing Bookings & Stays'}
            </h2>
            <p className="text-xs text-stone-500 dark:text-[#9E9287]">
              {language === 'ar' ? 'متابعة عقود الإيجار، إيصالات الدفع، والتواصل مع الملاك' : 'Track leases, verified receipts, and direct host messaging'}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="inline-flex p-1 bg-white dark:bg-[#24201D] rounded-2xl border border-[#E9DDCC] dark:border-[#3D352E] text-xs font-medium">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'all' ? 'bg-[#765541] dark:bg-[#C47D60] text-white shadow-sm' : 'text-stone-600 dark:text-[#D4BFA8] hover:text-[#765541]'
              }`}
            >
              {language === 'ar' ? 'الكل' : 'All'}
            </button>
            <button
              onClick={() => setActiveTab('confirmed')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'confirmed' ? 'bg-[#765541] dark:bg-[#C47D60] text-white shadow-sm' : 'text-stone-600 dark:text-[#D4BFA8] hover:text-[#765541]'
              }`}
            >
              {language === 'ar' ? 'المؤكدة' : 'Confirmed'}
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'pending' ? 'bg-[#765541] dark:bg-[#C47D60] text-white shadow-sm' : 'text-stone-600 dark:text-[#D4BFA8] hover:text-[#765541]'
              }`}
            >
              {language === 'ar' ? 'بانتظار الرد' : 'Pending'}
            </button>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-white dark:bg-[#24201D] rounded-3xl p-10 border border-[#E9DDCC] dark:border-[#3D352E] text-center space-y-3">
            <Calendar className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto" />
            <h3 className="font-bold text-sm text-[#34332F] dark:text-[#EDE6DE]">
              {language === 'ar' ? 'لا توجد حجوزات في هذا القسم' : 'No bookings in this category'}
            </h3>
            <p className="text-xs text-stone-500 dark:text-[#9E9287]">
              {language === 'ar' ? 'تصفح قائمة العقارات المعتمدة وقدم طلب حجزك الأول.' : 'Explore verified accommodations to make your first booking.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white dark:bg-[#24201D] rounded-3xl p-5 sm:p-6 border border-[#E9DDCC] dark:border-[#3D352E] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={b.propertyImage}
                    alt={b.propertyTitle}
                    className="w-24 h-24 rounded-2xl object-cover border border-[#E9DDCC] dark:border-[#3D352E] shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-[#C47D60] dark:text-[#D8896C] bg-[#C47D60]/10 px-2 py-0.5 rounded-lg">
                        {b.referenceCode}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          b.status === 'confirmed'
                            ? 'bg-[#697A58]/15 text-[#697A58] dark:text-[#A9B59A]'
                            : b.status === 'cancelled'
                            ? 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                            : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {b.status === 'confirmed'
                          ? (language === 'ar' ? 'مؤكد ومدفوع' : 'Confirmed')
                          : b.status === 'cancelled'
                          ? (language === 'ar' ? 'ملغي' : 'Cancelled')
                          : (language === 'ar' ? 'بانتظار التأكيد' : 'Pending')}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-[#34332F] dark:text-[#EDE6DE]">
                      {language === 'ar' ? b.propertyTitleAr : b.propertyTitle}
                    </h3>
                    {b.roomName && (
                      <p className="text-xs font-semibold text-[#765541] dark:text-[#D4BFA8]">
                        {b.roomName}
                      </p>
                    )}
                    <p className="text-[11px] text-stone-500 dark:text-[#9E9287] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C47D60] dark:text-[#D8896C]" />
                      <span>{language === 'ar' ? b.propertyAddressAr : b.propertyAddress}</span>
                    </p>

                    <div className="pt-1 flex items-center gap-3 text-xs text-stone-600 dark:text-stone-400 font-mono tabular-nums">
                      <span>{language === 'ar' ? 'تاريخ الدخول' : 'Check-in'}: {b.moveInDate}</span>
                      <span>·</span>
                      <span>{language === 'ar' ? 'المدة' : 'Duration'}: {b.durationMonthsOrDays} {b.leaseDuration === 'daily' ? (language === 'ar' ? 'أيام' : 'days') : (language === 'ar' ? 'أشهر' : 'months')}</span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Actions */}
                <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-[#E9DDCC] dark:border-[#3D352E]">
                  <div className="text-left md:text-right rtl:text-right rtl:md:text-left">
                    <span className="text-base font-bold font-mono text-[#765541] dark:text-[#D4BFA8] tabular-nums">
                      {b.totalDue.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                    </span>
                    <span className="block text-[10px] text-[#697A58] dark:text-[#A9B59A] font-medium">
                      {language === 'ar' ? `مدفوع عبر ${b.paymentMethod || 'إنستاباي'}` : `Paid via ${b.paymentMethod}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => {
                        setActiveChatRecipient({
                          id: b.ownerId,
                          name: b.ownerName,
                          avatar: '/src/assets/images/avatar_yomna_landlord_1792715698491.jpg',
                        });
                        setActiveModal('chat');
                      }}
                      className="p-2 rounded-xl bg-[#F8F4EC] dark:bg-[#2D2723] hover:bg-[#E9DDCC] dark:hover:bg-[#3D352E] text-[#765541] dark:text-[#D4BFA8] transition-colors"
                      title={language === 'ar' ? 'مراسلة المالك' : 'Message Owner'}
                    >
                      <MessageCircle className="w-4 h-4 text-[#C47D60] dark:text-[#D8896C]" />
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="p-2 rounded-xl bg-[#F8F4EC] dark:bg-[#2D2723] hover:bg-[#E9DDCC] dark:hover:bg-[#3D352E] text-[#765541] dark:text-[#D4BFA8] transition-colors"
                      title={language === 'ar' ? 'طباعة العقد وسند الحجز' : 'Print Voucher'}
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    {b.status === 'confirmed' && (
                      <>
                        {reviews.some((r) => r.bookingId === b.id && r.reviewerId === user?.id) ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#697A58] bg-[#697A58]/10 rounded-xl border border-[#697A58]/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{language === 'ar' ? 'تم تقييم المالك' : 'Reviewed'}</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setReviewingBooking(b)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-white bg-[#C47D60] hover:bg-[#b06a4e] rounded-xl shadow-sm transition-colors"
                          >
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{language === 'ar' ? 'تقييم المالك' : 'Rate Host'}</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="px-3 py-1.5 text-[11px] font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          {language === 'ar' ? 'إلغاء الحجز' : 'Cancel'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tenant's Profile Reviews from Landlords */}
      <UserReviewsList
        targetUserId={user?.id || 'user-tenant-1'}
        targetRole="tenant"
        targetName={user?.name || 'Nora'}
      />

      {/* Review Modal */}
      {reviewingBooking && (
        <ReviewModal
          booking={reviewingBooking}
          onClose={() => setReviewingBooking(null)}
          onSuccess={() => setReviewingBooking(null)}
        />
      )}
    </div>
  );
};
