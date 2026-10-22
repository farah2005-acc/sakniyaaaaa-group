import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Check, Minus, Scale } from 'lucide-react';

interface PropertyCompareModalProps {
  onClose: () => void;
  onBook: (property: any) => void;
}

export const PropertyCompareModal: React.FC<PropertyCompareModalProps> = ({
  onClose,
  onBook,
}) => {
  const { language, properties, comparedProperties, removeCompare } = useApp();

  const comparedList = properties.filter((p) => comparedProperties.includes(p.id));

  if (comparedList.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-[#F8F4EC] dark:bg-[#191614] p-8 rounded-3xl max-w-md w-full text-center border border-[#E9DDCC] dark:border-[#3D352E] text-[#34332F] dark:text-[#EDE6DE] shadow-2xl">
          <Scale className="w-12 h-12 text-[#765541] dark:text-[#D4BFA8] mx-auto mb-3 opacity-60" />
          <h3 className="font-bold text-lg mb-1">
            {language === 'ar' ? 'قائمة المقارنة فارغة' : 'Comparison list is empty'}
          </h3>
          <p className="text-xs text-stone-500 dark:text-[#9E9287] mb-6">
            {language === 'ar'
              ? 'اضغط على مربع المقارنة في بطاقة أي عقار لإضافته إلى المقارنة جنباً إلى جنب.'
              : 'Check the compare box on any property card to add it to side-by-side comparison.'}
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#765541] dark:bg-[#C47D60] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
          >
            {language === 'ar' ? 'تصفح العقارات' : 'Browse Properties'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-[#F8F4EC] dark:bg-[#191614] rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto border border-[#E9DDCC] dark:border-[#3D352E] shadow-2xl flex flex-col text-[#34332F] dark:text-[#EDE6DE]">
        
        {/* Header */}
        <div className="sticky top-0 bg-[#F8F4EC] dark:bg-[#191614] px-6 py-4 border-b border-[#E9DDCC] dark:border-[#3D352E] flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#C47D60] dark:text-[#D8896C]" />
            <h2 className="font-bold text-base text-[#765541] dark:text-[#EDE6DE] font-serif">
              {language === 'ar' ? 'مقارنة العقارات جنباً إلى جنب' : 'Side-by-Side Property Comparison'}
            </h2>
            <span className="text-xs text-stone-400 dark:text-[#9E9287]">({comparedList.length} / 3)</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#E9DDCC] dark:hover:bg-[#24201D] transition-colors"
          >
            <X className="w-5 h-5 text-[#765541] dark:text-[#EDE6DE]" />
          </button>
        </div>

        {/* Comparison Table Grid */}
        <div className="p-6 overflow-x-auto">
          <div className="min-w-[650px] grid grid-cols-4 gap-4 text-xs">
            
            {/* Criteria Column */}
            <div className="space-y-6 pt-36 font-semibold text-[#765541] dark:text-[#D4BFA8] border-r rtl:border-r-0 rtl:border-l border-[#E9DDCC]/80 dark:border-[#3D352E] pr-4 rtl:pr-0 rtl:pl-4">
              <div className="h-9 flex items-center">{language === 'ar' ? 'سعر الإيجار الشهري' : 'Monthly Rent'}</div>
              <div className="h-9 flex items-center">{language === 'ar' ? 'تأمين مسترد' : 'Security Deposit'}</div>
              <div className="h-9 flex items-center">{language === 'ar' ? 'الفواتير والخدمات' : 'Utilities'}</div>
              <div className="h-9 flex items-center">{language === 'ar' ? 'نوع السكن' : 'Property Type'}</div>
              <div className="h-9 flex items-center">{language === 'ar' ? 'الحمام' : 'Bathroom'}</div>
              <div className="h-9 flex items-center">{language === 'ar' ? 'تكييف الهواء' : 'Air Conditioning'}</div>
              <div className="h-9 flex items-center">{language === 'ar' ? 'إنترنت Wi-Fi' : 'High-Speed Wi-Fi'}</div>
              <div className="h-9 flex items-center">{language === 'ar' ? 'سياسة التدخين' : 'Smoking Policy'}</div>
              <div className="h-9 flex items-center">{language === 'ar' ? 'الحيوانات الأليفة' : 'Pet Policy'}</div>
              <div className="h-9 flex items-center">{language === 'ar' ? 'أقرب جامعة' : 'Campus Commute'}</div>
            </div>

            {/* Compared Property Columns */}
            {comparedList.map((prop) => (
              <div key={prop.id} className="space-y-6 flex flex-col bg-white dark:bg-[#24201D] p-4 rounded-2xl border border-[#E9DDCC] dark:border-[#3D352E] shadow-sm">
                
                {/* Header card with Image & remove button */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-800">
                  <img src={prop.coverImage} alt={prop.title} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeCompare(prop.id)}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                    title={language === 'ar' ? 'إزالة' : 'Remove'}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <h4 className="font-bold text-xs text-[#34332F] dark:text-[#EDE6DE] line-clamp-2 h-8">
                  {language === 'ar' ? prop.titleAr : prop.title}
                </h4>

                <div className="h-9 flex items-center font-bold text-[#765541] dark:text-[#D4BFA8] font-mono text-sm">
                  {prop.monthlyPrice.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                </div>

                <div className="h-9 flex items-center font-mono text-stone-600 dark:text-[#9E9287]">
                  {prop.depositAmount.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                </div>

                <div className="h-9 flex items-center text-stone-600 dark:text-[#9E9287]">
                  {prop.utilitiesIncluded ? (language === 'ar' ? 'شامل الفواتير' : 'Included') : `~${prop.estimatedUtilitiesMonthly} EGP`}
                </div>

                <div className="h-9 flex items-center capitalize text-stone-600 dark:text-[#9E9287]">
                  {prop.propertyType.replace('_', ' ')}
                </div>

                <div className="h-9 flex items-center text-stone-600 dark:text-[#9E9287]">
                  {prop.isBathroomPrivate ? (language === 'ar' ? 'حمام خاص' : 'Private') : (language === 'ar' ? 'حمام مشترك' : 'Shared')}
                </div>

                <div className="h-9 flex items-center">
                  {prop.hasAC ? <Check className="w-4 h-4 text-[#697A58] dark:text-[#A9B59A]" /> : <Minus className="w-4 h-4 text-stone-400 dark:text-stone-600" />}
                </div>

                <div className="h-9 flex items-center">
                  {prop.hasWifi ? <Check className="w-4 h-4 text-[#697A58] dark:text-[#A9B59A]" /> : <Minus className="w-4 h-4 text-stone-400 dark:text-stone-600" />}
                </div>

                <div className="h-9 flex items-center text-stone-600 dark:text-[#9E9287]">
                  {prop.houseRules.smokingAllowed ? (language === 'ar' ? 'مسموح' : 'Allowed') : (language === 'ar' ? 'ممنوع' : 'No smoking')}
                </div>

                <div className="h-9 flex items-center text-stone-600 dark:text-[#9E9287]">
                  {prop.houseRules.petsAllowed ? (language === 'ar' ? 'مسموح' : 'Allowed') : (language === 'ar' ? 'غير مسموح' : 'No pets')}
                </div>

                <div className="h-9 flex items-center font-mono text-stone-600 dark:text-[#9E9287]">
                  {prop.location.nearbyUniversities[0]?.walkingMinutes} {language === 'ar' ? 'د سيراً' : 'min walk'}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onBook(prop);
                    }}
                    className="w-full py-2 bg-[#C47D60] hover:bg-[#b06a4e] text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
                  >
                    {language === 'ar' ? 'حجز هذا السكن' : 'Book this'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
