import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UNIVERSITIES } from '../../data/mockData';
import { MapPin, GraduationCap, DollarSign, SlidersHorizontal, RotateCcw, Clock } from 'lucide-react';

export const PropertySearch: React.FC = () => {
  const { language, searchFilter, setSearchFilter } = useApp();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const resetFilters = () => {
    setSearchFilter({
      governorate: '',
      city: '',
      neighborhood: '',
      universityId: '',
      propertyType: 'all',
      minPrice: 0,
      maxPrice: 15000,
      privateBathroomOnly: false,
      acOnly: false,
      wifiOnly: false,
      maxCommuteMinutes: 60,
      genderPolicy: 'all',
      keyword: '',
      favoritesOnly: false,
    });
  };

  const propertyTypes = [
    { id: 'all', labelEn: 'All Types', labelAr: 'الكل' },
    { id: 'apartment', labelEn: 'Apartment', labelAr: 'شقة كاملة' },
    { id: 'private_room', labelEn: 'Private Room', labelAr: 'غرفة مستقلة' },
    { id: 'shared_room', labelEn: 'Shared Room', labelAr: 'غرفة مشتركة' },
    { id: 'studio', labelEn: 'Studio', labelAr: 'استوديو' },
  ];

  return (
    <div className="bg-white dark:bg-[#24201D] rounded-3xl p-5 md:p-6 border border-[#E9DDCC] dark:border-[#3D352E] shadow-sm transition-colors duration-300">
      {/* Primary 3-column Search Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        
        {/* Field 1: City / Area Selection */}
        <div className="relative">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#765541] dark:text-[#D4BFA8] mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#C47D60] dark:text-[#D8896C]" />
            <span>{language === 'ar' ? 'المدينة أو المنطقة' : 'City or Neighborhood'}</span>
          </label>
          <div className="relative">
            <select
              value={searchFilter.city}
              onChange={(e) => setSearchFilter((prev) => ({ ...prev, city: e.target.value }))}
              aria-label={language === 'ar' ? 'اختر المدينة' : 'Select City'}
              className="w-full pl-3 pr-8 py-2.5 bg-[#F8F4EC] dark:bg-[#191614] border border-[#E9DDCC] dark:border-[#3D352E] rounded-xl text-xs font-medium text-[#34332F] dark:text-[#EDE6DE] focus:outline-none focus:ring-1 focus:ring-[#C47D60] appearance-none"
            >
              <option value="">{language === 'ar' ? 'كل المدن المصرية (الإسكندرية، القاهرة، طنطا...)' : 'All Egyptian Cities'}</option>
              <option value="Alexandria">{language === 'ar' ? 'الإسكندرية (سموحة، الشاطبي، الأزارطة، ميامي)' : 'Alexandria (Smouha, Shatby, Azarita)'}</option>
              <option value="Cairo">{language === 'ar' ? 'القاهرة (المعادي، مدينة نصر، التجمع)' : 'Cairo (Maadi, Nasr City, New Cairo)'}</option>
              <option value="Giza">{language === 'ar' ? 'الجيزة (الدقي، المهندسين، ٦ أكتوبر)' : 'Giza (Dokki, Mohandessin, October)'}</option>
              <option value="Tanta">{language === 'ar' ? 'طنطا — الغربية (المجمع الطبي)' : 'Tanta — Gharbia (Medical Compound)'}</option>
              <option value="Damanhour">{language === 'ar' ? 'دمنهور — البحيرة' : 'Damanhour — Beheira'}</option>
              <option value="Mansoura">{language === 'ar' ? 'المنصورة — الدقهلية' : 'Mansoura — Dakahlia'}</option>
            </select>
          </div>
        </div>

        {/* Field 2: Target Campus / Work Commute */}
        <div className="relative">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#765541] dark:text-[#D4BFA8] mb-1.5 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-[#697A58] dark:text-[#A9B59A]" />
            <span>{language === 'ar' ? 'الجامعة أو جهة العمل (لحساب المشوار)' : 'University or Workplace Reference'}</span>
          </label>
          <div className="relative">
            <select
              value={searchFilter.universityId}
              onChange={(e) => setSearchFilter((prev) => ({ ...prev, universityId: e.target.value }))}
              aria-label={language === 'ar' ? 'اختر الجامعة' : 'Select University'}
              className="w-full pl-3 pr-8 py-2.5 bg-[#F8F4EC] dark:bg-[#191614] border border-[#E9DDCC] dark:border-[#3D352E] rounded-xl text-xs font-medium text-[#34332F] dark:text-[#EDE6DE] focus:outline-none focus:ring-1 focus:ring-[#C47D60] appearance-none"
            >
              <option value="">{language === 'ar' ? 'دون تحديد جامعة (عرض كافة المناطق)' : 'Any campus or location'}</option>
              {UNIVERSITIES.map((u) => (
                <option key={u.id} value={u.id}>
                  {language === 'ar' ? u.nameAr : u.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Field 3: Budget Maximum */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#765541] dark:text-[#D4BFA8] flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#C47D60] dark:text-[#D8896C]" />
              <span>{language === 'ar' ? 'أقصى ميزانية شهرية' : 'Max Monthly Budget'}</span>
            </label>
            <span className="text-xs font-bold text-[#765541] dark:text-[#D4BFA8] font-mono tabular-nums">
              {searchFilter.maxPrice.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
            </span>
          </div>
          <input
            type="range"
            min={1500}
            max={15000}
            step={250}
            value={searchFilter.maxPrice}
            onChange={(e) => setSearchFilter((prev) => ({ ...prev, maxPrice: parseInt(e.target.value, 10) }))}
            className="w-full h-2 bg-[#E9DDCC] dark:bg-[#3D352E] rounded-lg appearance-none cursor-pointer accent-[#C47D60]"
          />
        </div>
      </div>

      {/* Property Type Filter Chips & Advanced Toggle */}
      <div className="mt-4 pt-4 border-t border-[#E9DDCC]/60 dark:border-[#3D352E]/60 flex flex-wrap items-center justify-between gap-3">
        {/* Type tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {propertyTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => setSearchFilter((prev) => ({ ...prev, propertyType: t.id }))}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-colors whitespace-nowrap shrink-0 ${
                searchFilter.propertyType === t.id
                  ? 'bg-[#765541] dark:bg-[#C47D60] text-white shadow-sm'
                  : 'bg-[#F8F4EC] dark:bg-[#191614] text-[#765541] dark:text-[#D4BFA8] hover:bg-[#E9DDCC] dark:hover:bg-[#2D2723]'
              }`}
            >
              {language === 'ar' ? t.labelAr : t.labelEn}
            </button>
          ))}
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F4EC] dark:bg-[#191614] hover:bg-[#E9DDCC] dark:hover:bg-[#2D2723] text-[#765541] dark:text-[#D4BFA8] rounded-xl text-xs font-semibold border border-[#E9DDCC] dark:border-[#3D352E] transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C47D60] dark:text-[#D8896C]" />
            <span>{showAdvanced ? (language === 'ar' ? 'إخفاء الفلاتر' : 'Less filters') : (language === 'ar' ? 'فلاتر دقيقة' : 'More filters')}</span>
          </button>
          <button
            onClick={resetFilters}
            className="p-2 text-stone-400 dark:text-[#9E9287] hover:text-[#765541] dark:hover:text-[#EDE6DE] hover:bg-[#F8F4EC] dark:hover:bg-[#2D2723] rounded-xl transition-colors"
            title={language === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset filters'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advanced Filter Collapse */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-[#E9DDCC]/60 dark:border-[#3D352E]/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Commute Time Limit */}
          <div>
            <label className="block text-stone-500 dark:text-[#9E9287] font-semibold mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#697A58] dark:text-[#A9B59A]" />
              <span>{language === 'ar' ? 'أقصى وقت للمشوار (دقائق)' : 'Max Commute (Minutes)'}</span>
            </label>
            <div className="flex items-center gap-2">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setSearchFilter((prev) => ({ ...prev, maxCommuteMinutes: mins }))}
                  className={`flex-1 py-1.5 rounded-lg border text-center font-mono tabular-nums transition-colors ${
                    searchFilter.maxCommuteMinutes === mins
                      ? 'bg-[#697A58] text-white border-[#697A58]'
                      : 'bg-[#F8F4EC] dark:bg-[#191614] text-[#765541] dark:text-[#D4BFA8] border-[#E9DDCC] dark:border-[#3D352E]'
                  }`}
                >
                  {mins} {language === 'ar' ? 'د' : 'm'}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Amenities */}
          <div className="sm:col-span-2 flex flex-wrap items-center gap-2 pt-4 sm:pt-5">
            <button
              onClick={() => setSearchFilter((prev) => ({ ...prev, privateBathroomOnly: !prev.privateBathroomOnly }))}
              className={`px-3 py-1.5 rounded-xl border transition-colors ${
                searchFilter.privateBathroomOnly
                  ? 'bg-[#C47D60] text-white border-[#C47D60]'
                  : 'bg-[#F8F4EC] dark:bg-[#191614] text-[#765541] dark:text-[#D4BFA8] border-[#E9DDCC] dark:border-[#3D352E]'
              }`}
            >
              {language === 'ar' ? 'حمام خاص فقط' : 'Private Bathroom'}
            </button>
            <button
              onClick={() => setSearchFilter((prev) => ({ ...prev, acOnly: !prev.acOnly }))}
              className={`px-3 py-1.5 rounded-xl border transition-colors ${
                searchFilter.acOnly
                  ? 'bg-[#C47D60] text-white border-[#C47D60]'
                  : 'bg-[#F8F4EC] dark:bg-[#191614] text-[#765541] dark:text-[#D4BFA8] border-[#E9DDCC] dark:border-[#3D352E]'
              }`}
            >
              {language === 'ar' ? 'تكييف هواء (AC)' : 'Air Conditioning'}
            </button>
            <button
              onClick={() => setSearchFilter((prev) => ({ ...prev, wifiOnly: !prev.wifiOnly }))}
              className={`px-3 py-1.5 rounded-xl border transition-colors ${
                searchFilter.wifiOnly
                  ? 'bg-[#C47D60] text-white border-[#C47D60]'
                  : 'bg-[#F8F4EC] dark:bg-[#191614] text-[#765541] dark:text-[#D4BFA8] border-[#E9DDCC] dark:border-[#3D352E]'
              }`}
            >
              {language === 'ar' ? 'إنترنت سريع (Wi-Fi)' : 'High-Speed Wi-Fi'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
