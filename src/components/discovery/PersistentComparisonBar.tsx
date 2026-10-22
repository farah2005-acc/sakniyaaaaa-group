import React from 'react';
import { useApp } from '../../context/AppContext';
import { Scale, X, ArrowRight, ArrowLeft, Trash2 } from 'lucide-react';

export const PersistentComparisonBar: React.FC = () => {
  const {
    properties,
    comparedProperties,
    removeCompare,
    clearCompare,
    setActiveModal,
    language,
  } = useApp();

  // Show only when 2 or more properties are selected
  if (comparedProperties.length < 2) return null;

  const comparedList = properties.filter((p) => comparedProperties.includes(p.id));

  return (
    <div
      role="region"
      aria-label={language === 'ar' ? 'شريط مقارنة العقارات' : 'Property comparison dock'}
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="bg-[#FFFFFF]/95 dark:bg-[#24201D]/95 backdrop-blur-xl border-2 border-[#C47D60]/50 dark:border-[#D8896C]/50 rounded-2xl sm:rounded-3xl shadow-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#34332F] dark:text-[#EDE6DE]">
        
        {/* Left: Summary & Selected Item Thumbnails */}
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto overflow-x-auto py-1">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#765541] dark:bg-[#3D352E] text-white flex items-center justify-center shadow-inner">
              <Scale className="w-5 h-5 text-[#E9DDCC]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <span>{language === 'ar' ? 'مقارنة العقارات' : 'Compare Properties'}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#C47D60] text-white font-mono">
                  {comparedList.length} / 3
                </span>
              </div>
              <p className="text-[10px] text-stone-500 dark:text-[#9E9287]">
                {language === 'ar' ? 'جاهز للمقارنة المباشرة' : 'Ready for side-by-side review'}
              </p>
            </div>
          </div>

          <div className="h-7 w-[1px] bg-[#E9DDCC] dark:bg-[#3D352E] hidden sm:block shrink-0" />

          {/* Thumbnails */}
          <div className="flex items-center gap-2 shrink-0">
            {comparedList.map((prop) => (
              <div
                key={prop.id}
                className="group relative flex items-center gap-2 p-1.5 pr-2.5 rtl:pr-1.5 rtl:pl-2.5 rounded-xl bg-[#F8F4EC] dark:bg-[#2D2723] border border-[#E9DDCC] dark:border-[#3D352E] text-xs shadow-sm hover:border-[#C47D60] transition-colors"
              >
                <img
                  src={prop.coverImage}
                  alt={prop.title}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div className="max-w-[90px] sm:max-w-[110px] truncate text-left rtl:text-right">
                  <p className="font-semibold text-[11px] truncate text-[#34332F] dark:text-[#EDE6DE]">
                    {language === 'ar' ? prop.titleAr : prop.title}
                  </p>
                  <p className="text-[10px] font-mono text-[#765541] dark:text-[#D4BFA8]">
                    {prop.monthlyPrice} <span className="text-[9px]">{language === 'ar' ? 'ج.م' : 'EGP'}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCompare(prop.id);
                  }}
                  className="p-1 rounded-full text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  title={language === 'ar' ? 'إزالة من المقارنة' : 'Remove from comparison'}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          <button
            type="button"
            onClick={clearCompare}
            className="px-3 py-2 text-stone-500 dark:text-[#9E9287] hover:text-stone-800 dark:hover:text-[#EDE6DE] text-xs font-semibold rounded-xl hover:bg-[#E9DDCC]/40 dark:hover:bg-[#3D352E]/50 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'ar' ? 'إلغاء الكل' : 'Clear All'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal('compare')}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-[#C47D60] hover:bg-[#b06a4e] text-white text-xs font-bold rounded-xl shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            <span>{language === 'ar' ? 'قارن الآن' : 'Compare Now'}</span>
            <span className="font-mono text-[11px] opacity-90">({comparedList.length})</span>
            {language === 'ar' ? (
              <ArrowLeft className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
