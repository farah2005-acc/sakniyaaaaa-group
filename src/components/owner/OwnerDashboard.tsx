import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PropertyListing, Booking } from '../../types';
import { ReviewModal } from '../reviews/ReviewModal';
import { UserReviewsList } from '../reviews/UserReviewsList';
import {
  Building2,
  PlusCircle,
  Eye,
  Bookmark,
  Calendar,
  CheckCircle2,
  XCircle,
  MessageCircle,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  PauseCircle,
  PlayCircle,
  Sparkles,
  Star,
} from 'lucide-react';

interface OwnerDashboardProps {
  onOpenCreateWizard: () => void;
  onSelectProperty: (property: PropertyListing) => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  onOpenCreateWizard,
  onSelectProperty,
}) => {
  const {
    user,
    language,
    properties,
    bookings,
    reviews,
    updateBookingStatus,
    updateListingStatus,
    setActiveChatRecipient,
    setActiveModal,
    showNotification,
  } = useApp();

  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);

  const myProperties = properties.filter(
    (p) => p.ownerId === user?.id || p.ownerId === 'owner-1'
  );

  const ownerBookings = bookings.filter(
    (b) => b.ownerId === user?.id || b.ownerId === 'owner-1'
  );

  // Stats calculation
  const totalViews = myProperties.reduce((acc, p) => acc + (p.viewsCount || 0), 0);
  const totalSaves = myProperties.reduce((acc, p) => acc + (p.savesCount || 0), 0);
  const totalConfirmedEarnings = ownerBookings
    .filter((b) => b.status === 'confirmed')
    .reduce((acc, b) => acc + (b.totalRentAmount - b.platformFee), 0);

  const handleAcceptBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'accepted');
    showNotification(
      language === 'ar' ? 'تم قبول طلب الحجز وإشعار المستأجر' : 'Booking accepted and tenant notified',
      'success'
    );
  };

  const handleRejectBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'cancelled');
    showNotification(
      language === 'ar' ? 'تم رفض طلب الحجز' : 'Booking rejected',
      'info'
    );
  };

  return (
    <div className="space-y-8">
      {/* Host Welcome & Primary Stats */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9DDCC] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || '/src/assets/images/avatar_yomna_landlord_1792715698491.jpg'}
            alt={user?.name || 'Yomna'}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#C47D60] shadow-sm shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-[#697A58] bg-[#697A58]/10 px-2.5 py-0.5 rounded-full">
                {language === 'ar' ? 'منطقة ملاك سكنية' : 'Host Portal'}
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-xs font-semibold text-[#765541]">{user?.name || 'Yomna'}</span>
            </div>
            <h1 className="text-2xl font-bold font-serif text-[#34332F]">
              {language === 'ar' ? 'لوحة تحكم إدارة السكن وتأجير الغرف' : 'Property & Booking Management'}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              {language === 'ar'
                ? 'إدارة العقارات، استقبال طلبات الطلاب، ومتابعة التحويلات المالية وتقييم المستأجرين'
                : 'Manage listings, review student requests, track net earnings, and evaluate tenants'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCreateWizard}
          className="px-5 py-3 bg-[#765541] hover:bg-[#604230] text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-[#C47D60]" />
          <span>{language === 'ar' ? 'إضافة عقار جديد' : 'Create New Listing'}</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#E9DDCC] shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">{language === 'ar' ? 'إجمالي المشاهدات' : 'Total Views'}</span>
            <Eye className="w-4 h-4 text-[#765541]" />
          </div>
          <span className="text-2xl font-bold font-mono text-[#34332F] tabular-nums">{totalViews}</span>
          <span className="text-[11px] text-[#697A58] block mt-1">
            {language === 'ar' ? 'زيارات نشطة من طلاب الجامعات' : 'Active student inquiries'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E9DDCC] shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">{language === 'ar' ? 'مرات الحفظ بالمفضلة' : 'Saved to Favorites'}</span>
            <Bookmark className="w-4 h-4 text-[#C47D60]" />
          </div>
          <span className="text-2xl font-bold font-mono text-[#34332F] tabular-nums">{totalSaves}</span>
          <span className="text-[11px] text-stone-500 block mt-1">
            {language === 'ar' ? 'قوائم رغبات طلابية' : 'Student shortlists'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E9DDCC] shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">{language === 'ar' ? 'صافي الأرباح المؤكدة' : 'Net Verified Earnings'}</span>
            <DollarSign className="w-4 h-4 text-[#697A58]" />
          </div>
          <span className="text-2xl font-bold font-mono text-[#765541] tabular-nums">
            {totalConfirmedEarnings.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
          </span>
          <span className="text-[11px] text-[#697A58] block mt-1">
            {language === 'ar' ? 'بعد خصم عمولة المنصة ٥٪' : 'After 5% platform commission'}
          </span>
        </div>
      </div>

      {/* Booking Requests Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-serif text-[#34332F]">
          {language === 'ar' ? 'طلبات الحجز المستلمة' : 'Incoming Booking Requests'}
        </h2>

        {ownerBookings.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-[#E9DDCC] text-center text-xs text-stone-500">
            {language === 'ar' ? 'لا توجد طلبات حجز معلقة حالياً' : 'No pending booking requests'}
          </div>
        ) : (
          <div className="space-y-3">
            {ownerBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white p-5 rounded-3xl border border-[#E9DDCC] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-xs text-[#C47D60]">{b.referenceCode}</span>
                    <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-semibold">
                      {b.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#34332F]">{b.propertyTitle}</h4>
                  <p className="text-xs text-stone-500">
                    {language === 'ar' ? 'المستأجر' : 'Tenant'}: <span className="font-semibold text-[#765541]">{b.tenantName}</span> ({b.tenantPhone})
                  </p>
                  <p className="text-[11px] text-stone-400 font-mono mt-0.5">
                    {language === 'ar' ? 'تاريخ الدخول' : 'Move-in'}: {b.moveInDate} · {b.durationMonthsOrDays} {language === 'ar' ? 'أشهر' : 'months'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right rtl:text-left">
                    <span className="font-mono font-bold text-sm text-[#765541]">
                      {b.totalDue.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                    </span>
                    <span className="block text-[10px] text-stone-400">{b.paymentMethod}</span>
                  </div>

                  {b.status === 'confirmed' && (
                    reviews.some((r) => r.bookingId === b.id && r.reviewerId === user?.id) ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#697A58] bg-[#697A58]/10 rounded-xl border border-[#697A58]/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'تم تقييم المستأجر' : 'Tenant Reviewed'}</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => setReviewingBooking(b)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C47D60] hover:bg-[#b06a4e] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{language === 'ar' ? 'تقييم المستأجر' : 'Rate Tenant'}</span>
                      </button>
                    )
                  )}

                  {b.status === 'pending_owner' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAcceptBooking(b.id)}
                        className="px-3.5 py-1.5 bg-[#697A58] hover:bg-[#566547] text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        {language === 'ar' ? 'قبول' : 'Accept'}
                      </button>
                      <button
                        onClick={() => handleRejectBooking(b.id)}
                        className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-colors"
                      >
                        {language === 'ar' ? 'رفض' : 'Reject'}
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setActiveChatRecipient({
                        id: b.tenantId,
                        name: b.tenantName,
                        avatar: '/src/assets/images/avatar_nora_tenant_1792715698432.jpg',
                      });
                      setActiveModal('chat');
                    }}
                    className="p-2 rounded-xl bg-[#F8F4EC] hover:bg-[#E9DDCC] text-[#765541] transition-colors"
                    title={language === 'ar' ? 'مراسلة المستأجر' : 'Message Tenant'}
                  >
                    <MessageCircle className="w-4 h-4 text-[#C47D60]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Active Listings */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-serif text-[#34332F]">
          {language === 'ar' ? 'عقاراتي المعروضة' : 'My Active Listings'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myProperties.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl p-4 border border-[#E9DDCC] shadow-sm flex items-center gap-4"
            >
              <img
                src={p.coverImage}
                alt={p.title}
                className="w-24 h-24 rounded-2xl object-cover shrink-0 cursor-pointer"
                onClick={() => onSelectProperty(p)}
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#697A58]">
                    {p.status}
                  </span>
                  <div className="flex items-center gap-2 text-stone-400 text-xs font-mono">
                    <span className="flex items-center gap-0.5">
                      <Eye className="w-3.5 h-3.5" /> {p.viewsCount}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Bookmark className="w-3.5 h-3.5" /> {p.savesCount}
                    </span>
                  </div>
                </div>

                <h4
                  onClick={() => onSelectProperty(p)}
                  className="font-bold text-xs text-[#34332F] line-clamp-1 hover:text-[#C47D60] cursor-pointer"
                >
                  {language === 'ar' ? p.titleAr : p.title}
                </h4>

                <p className="text-[11px] text-stone-500">
                  {p.location.neighborhood} · {p.location.city}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-[#765541]">
                    {p.monthlyPrice.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                  </span>
                  <button
                    onClick={() => {
                      const newStatus = p.status === 'published' ? 'paused' : 'published';
                      updateListingStatus(p.id, newStatus);
                    }}
                    className="text-[11px] font-semibold text-stone-500 hover:text-[#765541] flex items-center gap-1"
                  >
                    {p.status === 'published' ? (
                      <>
                        <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>{language === 'ar' ? 'إيقاف مؤقت' : 'Pause'}</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-3.5 h-3.5 text-[#697A58]" />
                        <span>{language === 'ar' ? 'تفعيل' : 'Publish'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Landlord's Received Reviews from Tenants */}
      <UserReviewsList
        targetUserId={user?.id || 'owner-1'}
        targetRole="owner"
        targetName={user?.name || 'Yomna'}
      />

      {/* Review Tenant Modal */}
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
