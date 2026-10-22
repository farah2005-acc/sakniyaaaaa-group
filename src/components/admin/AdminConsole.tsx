import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Building2,
  Users,
  FileCheck,
  DollarSign,
  CheckCircle2,
  XCircle,
  Percent,
  Sliders,
  MapPin,
  TrendingUp,
} from 'lucide-react';

export const AdminConsole: React.FC = () => {
  const {
    language,
    properties,
    bookings,
    verificationDocs,
    approveVerificationDoc,
    updateListingStatus,
    showNotification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'listings' | 'verifications' | 'commissions' | 'bookings'>('listings');
  const [semesterCommissionRate, setSemesterCommissionRate] = useState(5);
  const [shortStayCommissionRate, setShortStayCommissionRate] = useState(15);

  const handleApproveListing = (propId: string) => {
    updateListingStatus(propId, 'published');
    showNotification(
      language === 'ar' ? 'تمت الموافقة على نشر العقار' : 'Listing approved and published',
      'success'
    );
  };

  const handleRejectListing = (propId: string) => {
    updateListingStatus(propId, 'rejected');
    showNotification(
      language === 'ar' ? 'تم رفض العقار لمخالفة المعايير' : 'Listing rejected',
      'error'
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#34332F] text-[#F8F4EC] p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#697A58]" />
            <span className="text-xs text-[#E9DDCC] font-mono uppercase tracking-wider">
              {language === 'ar' ? 'بوابة إدارة سكنية الرسمية' : 'Sakniya Platform Operations'}
            </span>
          </div>
          <h1 className="text-2xl font-bold font-serif">
            {language === 'ar' ? 'لوحة تحكم المشرف والرقابة والجودة' : 'Platform Administration & Oversight'}
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            {language === 'ar'
              ? 'مراجعة طلبات التوثيق الحكومية، تدقيق العقارات، وإدارة نسب العمولة'
              : 'Audit property listings, verify identity deeds, and configure platform commissions'}
          </p>
        </div>

        {/* Tab Pills */}
        <div className="inline-flex p-1 bg-white/10 rounded-2xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'listings' ? 'bg-[#C47D60] text-white shadow-sm' : 'text-stone-300 hover:text-white'
            }`}
          >
            {language === 'ar' ? 'العقارات' : 'Listings'}
          </button>
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'verifications' ? 'bg-[#C47D60] text-white shadow-sm' : 'text-stone-300 hover:text-white'
            }`}
          >
            {language === 'ar' ? 'التوثيق' : 'Verifications'}
          </button>
          <button
            onClick={() => setActiveTab('commissions')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'commissions' ? 'bg-[#C47D60] text-white shadow-sm' : 'text-stone-300 hover:text-white'
            }`}
          >
            {language === 'ar' ? 'العمولات' : 'Commissions'}
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'bookings' ? 'bg-[#C47D60] text-white shadow-sm' : 'text-stone-300 hover:text-white'
            }`}
          >
            {language === 'ar' ? 'الحجوزات' : 'Bookings'}
          </button>
        </div>
      </div>

      {/* Tab 1: Listings Moderation Queue */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-serif text-[#34332F]">
            {language === 'ar' ? 'قائمة العقارات والتدقيق' : 'Property Listings Audit Queue'}
          </h2>

          <div className="space-y-3">
            {properties.map((p) => (
              <div
                key={p.id}
                className="bg-white p-5 rounded-3xl border border-[#E9DDCC] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-4">
                  <img src={p.coverImage} alt={p.title} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-stone-500 uppercase text-[10px]">
                        {p.propertyType}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'published' ? 'bg-[#697A58]/15 text-[#697A58]' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-[#34332F]">{p.title}</h3>
                    <p className="text-stone-500">
                      {p.location.neighborhood} · {p.location.city} — {p.ownerName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <span className="font-mono font-bold text-sm text-[#765541]">
                    {p.monthlyPrice.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveListing(p.id)}
                      className="px-3 py-1.5 bg-[#697A58] hover:bg-[#566547] text-white font-bold rounded-xl transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'اعتماد ونشر' : 'Approve'}</span>
                    </button>
                    <button
                      onClick={() => handleRejectListing(p.id)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'إيقاف / رفض' : 'Reject'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Document Verification Queue */}
      {activeTab === 'verifications' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-serif text-[#34332F]">
            {language === 'ar' ? 'طابور فحص مستندات الملاك والطلاب' : 'Identity & Ownership Document Queue'}
          </h2>

          <div className="space-y-3">
            {verificationDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-5 rounded-3xl border border-[#E9DDCC] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[#765541]">{doc.userName}</span>
                    <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded-full capitalize">
                      {doc.userRole}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      doc.status === 'approved' ? 'bg-[#697A58]/15 text-[#697A58]' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                  <p className="text-stone-600 font-semibold capitalize">
                    {doc.documentType.replace(/_/g, ' ')}
                  </p>
                  <p className="text-stone-400 font-mono text-[11px] mt-0.5">
                    Ref: {doc.documentNumber} · File: {doc.fileName} · Date: {doc.submittedAt}
                  </p>
                </div>

                {doc.status === 'pending' && (
                  <button
                    onClick={() => approveVerificationDoc(doc.id)}
                    className="px-4 py-2 bg-[#697A58] hover:bg-[#566547] text-white font-bold rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'ar' ? 'اعتماد المستند' : 'Approve Document'}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Commission Settings */}
      {activeTab === 'commissions' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9DDCC] shadow-sm space-y-6 max-w-xl">
          <div className="flex items-center gap-3">
            <Percent className="w-6 h-6 text-[#C47D60]" />
            <div>
              <h2 className="text-base font-bold font-serif text-[#34332F]">
                {language === 'ar' ? 'إعدادات عمولة منصة سكنية' : 'Platform Commission Configuration'}
              </h2>
              <p className="text-xs text-stone-500">
                {language === 'ar' ? 'تحديد النسب الرسمية الشفافة المقتطعة تلقائياً عند الدفع' : 'Set transparent commission rates for each rental duration'}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold text-[#765541] mb-1">
                <span>{language === 'ar' ? 'عمولة عقود الفصول الدراسية والسنوية' : 'Semester & Annual Leases'}</span>
                <span className="font-mono text-sm">{semesterCommissionRate}%</span>
              </div>
              <input
                type="range"
                min={2}
                max={10}
                value={semesterCommissionRate}
                onChange={(e) => setSemesterCommissionRate(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-[#E9DDCC] rounded-lg accent-[#C47D60]"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                {language === 'ar' ? 'المعدل القياسي الموصى به لطلاب الجامعات هو ٥٪' : 'Recommended standard for student leases is 5%'}
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-[#765541] mb-1">
                <span>{language === 'ar' ? 'عمولة الإقامات القصيرة (٢-٣ أيام)' : 'Short Stays (2-3 Days)'}</span>
                <span className="font-mono text-sm">{shortStayCommissionRate}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={20}
                value={shortStayCommissionRate}
                onChange={(e) => setShortStayCommissionRate(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-[#E9DDCC] rounded-lg accent-[#C47D60]"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                {language === 'ar' ? 'المعدل القياسي للإقامات السياحية أو المؤقتة هو ١٥٪' : 'Standard hospitality commission is 15%'}
              </p>
            </div>

            <button
              onClick={() => showNotification(language === 'ar' ? 'تم حفظ قواعد العمولة بنجاح' : 'Commission rules updated', 'success')}
              className="w-full py-3 bg-[#765541] hover:bg-[#604230] text-white font-bold rounded-xl transition-colors"
            >
              {language === 'ar' ? 'حفظ وتطبيق القواعد' : 'Save Commission Rules'}
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Bookings Oversight */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-serif text-[#34332F]">
            {language === 'ar' ? 'كافة المعاملات المالية والحجوزات' : 'All Platform Bookings & Transactions'}
          </h2>

          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white p-5 rounded-3xl border border-[#E9DDCC] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-xs text-[#C47D60]">{b.referenceCode}</span>
                    <span className="font-semibold text-stone-600">{b.tenantName} → {b.ownerName}</span>
                  </div>
                  <h4 className="font-bold text-[#34332F]">{b.propertyTitle}</h4>
                  <p className="text-stone-400 font-mono text-[11px] mt-0.5">
                    Gateway: {b.paymentMethod} · Ref: {b.paymentReference}
                  </p>
                </div>

                <div className="text-right rtl:text-left">
                  <span className="font-mono font-bold text-sm text-[#765541]">
                    {b.totalDue.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                  </span>
                  <span className="block text-[11px] text-[#697A58] font-semibold">
                    Fee: {b.platformFee.toLocaleString()} EGP ({b.platformCommissionRate * 100}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
