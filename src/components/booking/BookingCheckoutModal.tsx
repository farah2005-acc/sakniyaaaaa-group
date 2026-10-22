import React, { useState } from 'react';
import { PropertyListing, PropertyRoom, Booking, LeaseDurationType, PaymentMethodType } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Printer,
  Sparkles,
} from 'lucide-react';

interface BookingCheckoutModalProps {
  property: PropertyListing;
  room?: PropertyRoom;
  onClose: () => void;
  onSuccess: (booking: Booking) => void;
}

export const BookingCheckoutModal: React.FC<BookingCheckoutModalProps> = ({
  property,
  room,
  onClose,
  onSuccess,
}) => {
  const { user, language, addBooking } = useApp();

  const [leaseDuration, setLeaseDuration] = useState<LeaseDurationType>('semester');
  const [moveInDate, setMoveInDate] = useState('2026-11-01');
  const [durationCount, setDurationCount] = useState(3); // 3 months for semester
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('instapay');
  const [mobileWalletNumber, setMobileWalletNumber] = useState(user?.phone || '01094567890');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Pricing calculations
  const baseMonthlyPrice = room ? room.monthlyPrice : property.monthlyPrice;
  const isShortStay = leaseDuration === 'daily';
  const effectiveRent = isShortStay
    ? (property.shortStayDailyPrice || 600) * durationCount
    : baseMonthlyPrice * durationCount;

  const deposit = isShortStay ? 500 : (property.depositAmount || baseMonthlyPrice);
  const commissionRate = isShortStay ? 0.15 : 0.05; // 15% for short stay, 5% for semester
  const platformFee = Math.round(effectiveRent * commissionRate);
  const totalDue = effectiveRent + deposit + platformFee;

  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        referenceCode: `SAK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        propertyId: property.id,
        propertyTitle: property.title,
        propertyTitleAr: property.titleAr,
        propertyImage: property.coverImage,
        propertyAddress: `${property.location.neighborhood}, ${property.location.city}`,
        propertyAddressAr: `${property.location.neighborhoodAr}، ${property.location.cityAr}`,
        roomId: room?.id,
        roomName: room?.name,
        tenantId: user ? user.id : 'guest-1',
        tenantName: user ? user.name : 'Karim Hassan',
        tenantPhone: user ? user.phone : '+20 109 456 7890',
        ownerId: property.ownerId,
        ownerName: property.ownerName,
        ownerPhone: property.ownerPhone,
        moveInDate,
        leaseDuration,
        durationMonthsOrDays: durationCount,
        monthlyRent: baseMonthlyPrice,
        totalRentAmount: effectiveRent,
        depositAmount: deposit,
        platformCommissionRate: commissionRate,
        platformFee,
        totalDue,
        status: 'confirmed',
        paymentMethod,
        paymentReference:
          paymentMethod === 'instapay'
            ? `IPN-EG-${Math.floor(1000000 + Math.random() * 9000000)}`
            : paymentMethod === 'vodafone_cash'
            ? `VF-CASH-${Math.floor(100000 + Math.random() * 900000)}`
            : `CARD-TX-${Math.floor(100000 + Math.random() * 900000)}`,
        paymentConfirmedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cancellationPolicy: 'Moderate: Full refund if cancelled 14 days before move-in date.',
      };

      addBooking(newBooking);
      setConfirmedBooking(newBooking);
      setIsProcessing(false);
      onSuccess(newBooking);
    }, 1500);
  };

  if (confirmedBooking) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E9DDCC] shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-[#697A58]/15 rounded-full flex items-center justify-center mx-auto text-[#697A58]">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <div className="inline-block px-3 py-1 bg-[#697A58]/10 text-[#697A58] text-[11px] font-bold rounded-full mb-2">
              {language === 'ar' ? 'تم تأكيد الحجز وإصدار السند' : 'Booking Confirmed & Issued'}
            </div>
            <h2 className="text-xl font-bold font-serif text-[#34332F]">
              {language === 'ar' ? 'تهانينا! تم تأكيد إقامتك بنجاح' : 'Congratulations! Your Stay is Confirmed'}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {language === 'ar'
                ? `رقم السند المرجعي: ${confirmedBooking.referenceCode}`
                : `Booking Reference: ${confirmedBooking.referenceCode}`}
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="bg-[#F8F4EC] p-4 rounded-2xl border border-[#E9DDCC] text-left rtl:text-right text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-stone-500">{language === 'ar' ? 'السكن' : 'Property'}:</span>
              <span className="font-bold text-[#34332F]">{language === 'ar' ? property.titleAr : property.title}</span>
            </div>
            {room && (
              <div className="flex justify-between">
                <span className="text-stone-500">{language === 'ar' ? 'الغرفة' : 'Room'}:</span>
                <span className="font-semibold">{language === 'ar' ? room.nameAr : room.name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-stone-500">{language === 'ar' ? 'تاريخ الدخول' : 'Move-in Date'}:</span>
              <span className="font-mono font-semibold">{confirmedBooking.moveInDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">{language === 'ar' ? 'إجمالي المدفوع' : 'Total Paid'}:</span>
              <span className="font-mono font-bold text-[#765541]">
                {confirmedBooking.totalDue.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#E9DDCC] text-[11px]">
              <span className="text-stone-500">{language === 'ar' ? 'المرجع البنكي' : 'Gateway Ref'}:</span>
              <span className="font-mono text-[#697A58]">{confirmedBooking.paymentReference}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 py-3 bg-[#F8F4EC] hover:bg-[#E9DDCC] text-[#765541] font-semibold text-xs rounded-xl border border-[#E9DDCC] transition-colors flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'ar' ? 'طباعة الإيصال' : 'Print Voucher'}</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-[#765541] hover:bg-[#604230] text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              {language === 'ar' ? 'عرض في حجوزاتي' : 'View in My Stays'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#F8F4EC] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-[#E9DDCC] shadow-2xl relative flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E9DDCC] flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="font-bold text-base text-[#765541] font-serif">
              {language === 'ar' ? 'إتمام الحجز الآمن عبر سكنية' : 'Secure Booking & Lease Checkout'}
            </h2>
            <p className="text-[11px] text-stone-500">
              {language === 'ar' ? 'عقود موثقة وحماية كاملة للوديعة والتأمين' : 'Legally protected deposit & contract agreement'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100">
            <X className="w-5 h-5 text-[#765541]" />
          </button>
        </div>

        <form onSubmit={handleCompleteBooking} className="p-6 space-y-6">
          
          {/* Selected Accommodation Brief */}
          <div className="p-4 bg-white rounded-2xl border border-[#E9DDCC] flex items-center gap-4">
            <img src={property.coverImage} alt={property.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-[#C47D60]">
                {room ? (language === 'ar' ? 'غرفة محددة' : 'Selected Room') : (language === 'ar' ? 'السكن بالكامل' : 'Entire Property')}
              </span>
              <h3 className="font-bold text-sm text-[#34332F] line-clamp-1">
                {language === 'ar' ? property.titleAr : property.title}
              </h3>
              {room && (
                <p className="text-xs text-[#765541] font-semibold mt-0.5">
                  {language === 'ar' ? room.nameAr : room.name}
                </p>
              )}
              <p className="text-[11px] text-stone-500">
                {property.location.neighborhood} · {property.location.city}
              </p>
            </div>
          </div>

          {/* Duration & Move-in Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-stone-600 font-bold mb-1">
                {language === 'ar' ? 'نوع مدة الإيجار' : 'Lease Duration Type'}
              </label>
              <select
                value={leaseDuration}
                onChange={(e) => {
                  const val = e.target.value as LeaseDurationType;
                  setLeaseDuration(val);
                  if (val === 'semester') setDurationCount(3);
                  else if (val === 'annual') setDurationCount(12);
                  else if (val === 'monthly') setDurationCount(1);
                  else if (val === 'daily') setDurationCount(3);
                }}
                className="w-full p-2.5 bg-white border border-[#E9DDCC] rounded-xl font-medium"
              >
                <option value="semester">{language === 'ar' ? 'فصل دراسي (٣ أشهر — عمولة ٥٪)' : 'Semester (3 Months — 5% Fee)'}</option>
                <option value="annual">{language === 'ar' ? 'عقد سنوي (١٢ شهر — عمولة ٥٪)' : 'Annual Lease (12 Months — 5% Fee)'}</option>
                <option value="monthly">{language === 'ar' ? 'شهري متجدد' : 'Monthly Recurring'}</option>
                {property.shortStayDailyPrice && (
                  <option value="daily">{language === 'ar' ? 'إقامة قصيرة (٢-٣ أيام — عمولة ١٥٪)' : 'Short Stay (2-3 Days — 15% Fee)'}</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-stone-600 font-bold mb-1">
                {language === 'ar' ? 'تاريخ استلام الغرفة' : 'Move-in Date'}
              </label>
              <input
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#E9DDCC] rounded-xl font-medium font-mono"
                required
              />
            </div>
          </div>

          {/* Transparent Cost Breakdown */}
          <div className="bg-white p-5 rounded-2xl border border-[#E9DDCC] space-y-2.5 text-xs text-stone-600">
            <h4 className="font-bold text-[#765541] uppercase text-[11px] mb-2">
              {language === 'ar' ? 'تفاصيل الحساب المالي الشفاف' : 'Transparent Fee Breakdown'}
            </h4>
            <div className="flex justify-between">
              <span>{language === 'ar' ? `قيمة الإيجار (${durationCount} ${isShortStay ? 'أيام' : 'أشهر'})` : `Rental Subtotal (${durationCount} ${isShortStay ? 'days' : 'months'})`}</span>
              <span className="font-mono tabular-nums font-semibold">{effectiveRent.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}</span>
            </div>
            <div className="flex justify-between">
              <span>{language === 'ar' ? 'التأمين المسترد عند الاستلام' : 'Refundable Security Deposit'}</span>
              <span className="font-mono tabular-nums font-semibold">{deposit.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                <span>{language === 'ar' ? `رسوم خدمة سكنية (${commissionRate * 100}٪)` : `Platform Fee (${commissionRate * 100}%)`}</span>
                <span className="text-[10px] text-[#697A58] font-bold">({isShortStay ? 'إقامة قصيرة' : 'فصل دراسي'})</span>
              </span>
              <span className="font-mono tabular-nums font-semibold text-[#697A58]">{platformFee.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}</span>
            </div>
            <div className="pt-3 border-t border-[#E9DDCC] flex justify-between items-baseline font-bold text-sm text-[#34332F]">
              <span>{language === 'ar' ? 'الإجمالي المطلوب دفعه الآن' : 'Total Amount Due'}</span>
              <span className="text-lg font-mono text-[#765541] tabular-nums">
                {totalDue.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
              </span>
            </div>
          </div>

          {/* Egyptian Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-[#765541] mb-2">
              {language === 'ar' ? 'طريقة الدفع المعتمدة في مصر' : 'Egyptian Payment Gateway'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              
              {/* InstaPay */}
              <button
                type="button"
                onClick={() => setPaymentMethod('instapay')}
                className={`p-3.5 rounded-2xl border text-left rtl:text-right flex flex-col justify-between transition-all ${
                  paymentMethod === 'instapay'
                    ? 'border-[#C47D60] bg-white ring-2 ring-[#C47D60]/20 shadow-sm'
                    : 'border-[#E9DDCC] bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#34332F]">InstaPay</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#C47D60]" />
                </div>
                <p className="text-[10px] text-stone-500">
                  {language === 'ar' ? 'تحويل فوري عبر شبكة المدفوعات اللحظية' : 'Instant IPN transfer'}
                </p>
              </button>

              {/* Vodafone Cash */}
              <button
                type="button"
                onClick={() => setPaymentMethod('vodafone_cash')}
                className={`p-3.5 rounded-2xl border text-left rtl:text-right flex flex-col justify-between transition-all ${
                  paymentMethod === 'vodafone_cash'
                    ? 'border-[#C47D60] bg-white ring-2 ring-[#C47D60]/20 shadow-sm'
                    : 'border-[#E9DDCC] bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#34332F]">Vodafone Cash</span>
                  <Smartphone className="w-3.5 h-3.5 text-red-500" />
                </div>
                <p className="text-[10px] text-stone-500">
                  {language === 'ar' ? 'محافظ الهاتف الذكية المصرية' : 'Mobile e-wallets'}
                </p>
              </button>

              {/* Visa / Master */}
              <button
                type="button"
                onClick={() => setPaymentMethod('visa_mastercard')}
                className={`p-3.5 rounded-2xl border text-left rtl:text-right flex flex-col justify-between transition-all ${
                  paymentMethod === 'visa_mastercard'
                    ? 'border-[#C47D60] bg-white ring-2 ring-[#C47D60]/20 shadow-sm'
                    : 'border-[#E9DDCC] bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#34332F]">Visa / Master</span>
                  <CreditCard className="w-3.5 h-3.5 text-[#697A58]" />
                </div>
                <p className="text-[10px] text-stone-500">
                  {language === 'ar' ? 'بطاقة بنكية مصرفية' : 'Bank credit / debit'}
                </p>
              </button>
            </div>
          </div>

          {/* Sandbox Demo Warning Label */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">
                {language === 'ar' ? 'وضع المحاكاة التجريبية (DEMO SANDBOX)' : 'Demo Sandbox Environment'}
              </span>
              <span>
                {language === 'ar'
                  ? 'هذه معاملة تجريبية آمنة لاختبار تدفق الحجز وسندات الدفع، ولن يتم خصم أي أموال حقيقية.'
                  : 'This is a simulation sandbox transaction for testing booking workflows. No real money will be charged.'}
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-500 hover:text-[#765541] text-xs font-semibold"
            >
              {language === 'ar' ? 'رجوع' : 'Back'}
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-8 py-3 bg-[#C47D60] hover:bg-[#b06a4e] disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2"
            >
              {isProcessing ? (
                <span>{language === 'ar' ? 'جارٍ التحقق وتأكيد الدفع...' : 'Processing secure payment...'}</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    {language === 'ar'
                      ? `تأكيد الدفع (${totalDue.toLocaleString()} ج.م)`
                      : `Confirm & Pay (${totalDue.toLocaleString()} EGP)`}
                  </span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
