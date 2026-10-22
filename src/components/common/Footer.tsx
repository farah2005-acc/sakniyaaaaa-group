import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Heart, Sparkles, MapPin, Building2, PhoneCall } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setSearchFilter } = useApp();

  return (
    <footer className="bg-[#E9DDCC]/40 dark:bg-[#191614] border-t border-[#E9DDCC] dark:border-[#3D352E] text-[#765541] dark:text-[#D4BFA8] mt-20 pt-14 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#765541] dark:bg-[#C47D60] text-[#F8F4EC] dark:text-[#191614] flex items-center justify-center font-bold text-lg font-serif">
                س
              </div>
              <span className="text-xl font-bold font-serif text-[#765541] dark:text-[#EDE6DE]">
                {language === 'ar' ? 'سَكَنِيّة' : 'Sakniya'}
              </span>
            </div>
            <p className="text-xs text-[#765541]/80 leading-relaxed">
              {language === 'ar'
                ? 'منصة السكن التشاركي ومطابقة رفقاء السكن الأولى للطلاب والموظفين في مصر. بيئة دافئة، عقود موثوقة، وأمان متكامل.'
                : 'Egypt’s premier housing & roommate compatibility platform for university students and professionals. Cozy bohemian living, verified stays, and peace of mind.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#697A58] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#697A58]" />
              <span>{language === 'ar' ? 'عقود موثقة ودفع آمن عبر إنستاباي والمحافظ' : 'Verified leases & safe payments via InstaPay & Wallets'}</span>
            </div>
          </div>

          {/* Quick Governorates & Cities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#765541] mb-4">
              {language === 'ar' ? 'مناطق السكن النشطة' : 'Active Student Hubs'}
            </h4>
            <ul className="space-y-2 text-xs text-[#765541]/80">
              <li>
                <button
                  onClick={() => setSearchFilter((prev) => ({ ...prev, city: 'Alexandria', neighborhood: 'Smouha' }))}
                  className="hover:text-[#C47D60] transition-colors"
                >
                  {language === 'ar' ? 'الإسكندرية · سموحة والشاطبي والأزارطة' : 'Alexandria · Smouha, Shatby & Azarita'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSearchFilter((prev) => ({ ...prev, city: 'Cairo', neighborhood: 'Maadi' }))}
                  className="hover:text-[#C47D60] transition-colors"
                >
                  {language === 'ar' ? 'القاهرة · المعادي والدقي ومدينة نصر' : 'Cairo · Maadi, Dokki & Nasr City'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSearchFilter((prev) => ({ ...prev, city: '6th of October' }))}
                  className="hover:text-[#C47D60] transition-colors"
                >
                  {language === 'ar' ? 'السادس من أكتوبر والشيخ زايد' : '6th of October & Sheikh Zayed'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSearchFilter((prev) => ({ ...prev, city: 'Tanta' }))}
                  className="hover:text-[#C47D60] transition-colors"
                >
                  {language === 'ar' ? 'طنطا والدلتا (المجمع الطبي)' : 'Tanta & Delta Campuses'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSearchFilter((prev) => ({ ...prev, city: 'New Borg El Arab' }))}
                  className="hover:text-[#C47D60] transition-colors"
                >
                  {language === 'ar' ? 'برج العرب الجديدة (الجامعة اليابانية)' : 'New Borg El Arab (E-JUST)'}
                </button>
              </li>
            </ul>
          </div>

          {/* Universites Directory */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#765541] mb-4">
              {language === 'ar' ? 'الجامعات المعتمدة' : 'Campus Direct Commutes'}
            </h4>
            <ul className="space-y-2 text-xs text-[#765541]/80">
              <li>
                <button
                  onClick={() => setSearchFilter((prev) => ({ ...prev, universityId: 'pua' }))}
                  className="hover:text-[#C47D60] transition-colors"
                >
                  {language === 'ar' ? 'جامعة فاروس بالإسكندرية (PUA)' : 'Pharos University in Alexandria (PUA)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSearchFilter((prev) => ({ ...prev, universityId: 'alex_shatby' }))}
                  className="hover:text-[#C47D60] transition-colors"
                >
                  {language === 'ar' ? 'جامعة الإسكندرية (الشاطبي والأزارطة)' : 'Alexandria University (Shatby & Medical)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSearchFilter((prev) => ({ ...prev, universityId: 'cairo_uni' }))}
                  className="hover:text-[#C47D60] transition-colors"
                >
                  {language === 'ar' ? 'جامعة القاهرة (الجيزة)' : 'Cairo University (Giza)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSearchFilter((prev) => ({ ...prev, universityId: 'auc' }))}
                  className="hover:text-[#C47D60] transition-colors"
                >
                  {language === 'ar' ? 'الجامعة الأمريكية والألمانية بالقاهرة' : 'AUC & GUC Campuses'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSearchFilter((prev) => ({ ...prev, universityId: 'tanta_uni' }))}
                  className="hover:text-[#C47D60] transition-colors"
                >
                  {language === 'ar' ? 'جامعة طنطا والمجمع الطبي' : 'Tanta University Medical Campus'}
                </button>
              </li>
            </ul>
          </div>

          {/* Transparent Trust & Commission */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#765541] mb-4">
              {language === 'ar' ? 'الشفافية والأمان' : 'Transparency & Safety'}
            </h4>
            <p className="text-xs text-[#765541]/80 leading-relaxed mb-3">
              {language === 'ar'
                ? 'عمولة المنصة: ٥٪ فقط لعقود الفصول الدراسية والسنوية، و١٥٪ للإقامات القصيرة. لا رسوم خفية أبداً.'
                : 'Platform commission: 5% for semester & annual leases, 15% for 2-3 day short stays. Zero hidden markups.'}
            </p>
            <div className="p-3 bg-white/70 dark:bg-[#24201D] rounded-xl border border-[#E9DDCC] dark:border-[#3D352E] text-xs">
              <span className="font-semibold block text-[#765541] dark:text-[#EDE6DE]">
                {language === 'ar' ? 'مصباح (مساعدك الدائم)' : 'Misbah Assistant'}
              </span>
              <span className="text-[11px] text-stone-500 dark:text-[#9E9287]">
                {language === 'ar' ? 'انقر على المصباح بأسفل الشاشة في أي وقت.' : 'Click the glowing lamp widget anytime.'}
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#E9DDCC] dark:border-[#3D352E] flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 dark:text-[#9E9287] gap-4">
          <p>
            © 2026 Sakniya | سكنية. {language === 'ar' ? 'جميع الحقوق محفوظة في جمهورية مصر العربية' : 'All rights reserved in Egypt.'}
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>{language === 'ar' ? 'شروط الخدمة' : 'Terms of Service'}</span>
            <span>·</span>
            <span>{language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
            <span>·</span>
            <span>{language === 'ar' ? 'دعم الطلاب والملاك' : 'Host & Student Support'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
