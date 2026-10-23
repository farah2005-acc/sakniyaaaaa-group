import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  User,
  Globe,
  Smartphone,
  Monitor,
  Menu,
  X,
  Scale,
  Heart,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { SakniyaLogo } from './SakniyaLogo';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const {
    user,
    role,
    setRole,
    language,
    setLanguage,
    favorites,
    comparedProperties,
    setActiveModal,
    isMobileDeviceMode,
    setIsMobileDeviceMode,
    searchFilter,
    setSearchFilter,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { id: 'explore', labelEn: 'Properties', labelAr: 'العقارات' },
    { id: 'roommates', labelEn: 'Roommate Match', labelAr: 'مطابقة الزملاء' },
    { id: 'map', labelEn: 'Interactive Map', labelAr: 'خريطة السكن' },
    { id: 'bookings', labelEn: 'My Stays', labelAr: 'حجوزاتي' },
    ...(role === 'owner' ? [{ id: 'owner_dashboard', labelEn: 'Host Area', labelAr: 'إدارة السكن' }] : []),
    ...(role === 'admin' ? [{ id: 'admin', labelEn: 'Admin', labelAr: 'لوحة التحكم' }] : []),
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#F8F4EC]/95 dark:bg-[#191614]/95 backdrop-blur-md border-b border-[#E9DDCC] dark:border-[#3D352E] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark & New App Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <SakniyaLogo
              size="md"
              variant="app_icon"
              showText={true}
              onClick={() => setActiveTab('explore')}
            />
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium text-[#765541] dark:text-[#D4BFA8]">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap transition-colors py-1 relative ${
                  activeTab === item.id
                    ? 'text-[#C47D60] dark:text-[#D8896C] font-semibold'
                    : 'text-[#765541]/80 dark:text-[#D4BFA8]/80 hover:text-[#765541] dark:hover:text-[#EDE6DE]'
                }`}
              >
                {language === 'ar' ? item.labelAr : item.labelEn}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C47D60] dark:bg-[#D8896C] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Action & User Utilities */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Favorites Quick Button */}
            <button
              onClick={() => {
                setActiveTab('explore');
                setSearchFilter((prev) => ({ ...prev, favoritesOnly: !prev.favoritesOnly }));
              }}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                searchFilter.favoritesOnly
                  ? 'bg-[#C47D60] dark:bg-[#D8896C] text-white border-[#C47D60] shadow-sm'
                  : 'bg-[#E9DDCC]/50 dark:bg-[#24201D] hover:bg-[#E9DDCC] dark:hover:bg-[#2D2723] text-[#765541] dark:text-[#D4BFA8] border-[#E9DDCC] dark:border-[#3D352E]'
              }`}
              title={language === 'ar' ? 'عرض العقارات المفضلة' : 'View favorite properties'}
            >
              <Heart className={`w-3.5 h-3.5 ${searchFilter.favoritesOnly ? 'fill-current' : favorites.length > 0 ? 'fill-[#C47D60] dark:fill-[#D8896C] text-[#C47D60] dark:text-[#D8896C]' : 'text-[#765541] dark:text-[#D4BFA8]'}`} />
              <span>{language === 'ar' ? 'المفضلة' : 'Favorites'}</span>
              {favorites.length > 0 && (
                <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  searchFilter.favoritesOnly ? 'bg-white text-[#C47D60]' : 'bg-[#C47D60] text-white'
                }`}>
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Compare Quick Badge if selected */}
            {comparedProperties.length > 0 && (
              <button
                onClick={() => setActiveModal('compare')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#E9DDCC]/60 dark:bg-[#24201D] hover:bg-[#E9DDCC] dark:hover:bg-[#2D2723] text-[#765541] dark:text-[#D4BFA8] text-xs font-semibold rounded-xl border border-[#E9DDCC] dark:border-[#3D352E] transition-colors"
                title={language === 'ar' ? 'مقارنة العقارات المحددة' : 'Compare selected'}
              >
                <Scale className="w-3.5 h-3.5 text-[#C47D60] dark:text-[#D8896C]" />
                <span>{language === 'ar' ? 'المقارنة' : 'Compare'}</span>
                <span className="w-4 h-4 bg-[#C47D60] text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  {comparedProperties.length}
                </span>
              </button>
            )}

            {/* Dynamic Light / Night Mode Theme Toggle */}
            <ThemeToggle />

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="p-2 rounded-xl text-[#765541] dark:text-[#D4BFA8] hover:bg-[#E9DDCC]/40 dark:hover:bg-[#2D2723] border border-[#E9DDCC]/80 dark:border-[#3D352E] text-xs font-semibold flex items-center gap-1 transition-colors"
              title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              <Globe className="w-3.5 h-3.5 text-[#697A58] dark:text-[#A9B59A]" />
              <span className="uppercase text-[11px] font-mono">{language === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Mobile Device Simulator Toggle */}
            <button
              onClick={() => setIsMobileDeviceMode((prev) => !prev)}
              className={`hidden lg:flex items-center gap-1 p-2 rounded-xl border text-xs font-medium transition-colors ${
                isMobileDeviceMode
                  ? 'bg-[#765541] dark:bg-[#C47D60] text-white border-[#765541] dark:border-[#C47D60]'
                  : 'text-[#765541] dark:text-[#D4BFA8] hover:bg-[#E9DDCC]/40 dark:hover:bg-[#2D2723] border-[#E9DDCC]/80 dark:border-[#3D352E]'
              }`}
              title={
                isMobileDeviceMode
                  ? (language === 'ar' ? 'الرجوع إلى عرض سطح المكتب' : 'Switch to Desktop View')
                  : (language === 'ar' ? 'معاينة تطبيق الجوال (iOS / Android)' : 'Preview Mobile App Mode')
              }
            >
              {isMobileDeviceMode ? (
                <>
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="text-[11px]">{language === 'ar' ? 'كمبيوتر' : 'Desktop'}</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="text-[11px]">{language === 'ar' ? 'موبايل' : 'Mobile'}</span>
                </>
              )}
            </button>

            {/* Host CTA or Role Switcher */}
            {role === 'tenant' ? (
              <button
                onClick={() => {
                  setRole('owner');
                  setActiveTab('owner_dashboard');
                }}
                className="hidden sm:inline-flex px-3.5 py-2 text-xs font-semibold text-[#765541] dark:text-[#D4BFA8] hover:text-[#604230] hover:bg-[#E9DDCC]/50 dark:hover:bg-[#2D2723] rounded-xl border border-[#E9DDCC] dark:border-[#3D352E] transition-colors whitespace-nowrap"
              >
                {language === 'ar' ? 'أضف عقارك' : 'List Property'}
              </button>
            ) : (
              <button
                onClick={() => {
                  setRole('tenant');
                  setActiveTab('explore');
                }}
                className="hidden sm:inline-flex px-3.5 py-2 text-xs font-semibold text-[#765541] dark:text-[#D4BFA8] hover:text-[#604230] hover:bg-[#E9DDCC]/50 dark:hover:bg-[#2D2723] rounded-xl border border-[#E9DDCC] dark:border-[#3D352E] transition-colors whitespace-nowrap"
              >
                {language === 'ar' ? 'تصفح كمستأجر' : 'Browse as Tenant'}
              </button>
            )}

            {/* Profile Menu Trigger */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full border border-[#E9DDCC] dark:border-[#3D352E] hover:border-[#C47D60] transition-colors bg-white dark:bg-[#24201D] focus:outline-none"
                aria-label="User profile"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden bg-[#E9DDCC] dark:bg-[#3D352E]">
                  {user ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 m-1.5 text-stone-500" />
                  )}
                </div>
                <span className="text-xs font-medium text-[#34332F] dark:text-[#EDE6DE] max-w-[80px] truncate hidden md:inline">
                  {user ? user.name.split(' ')[0] : 'Guest'}
                </span>
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div
                  className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-64 bg-[#F8F4EC] dark:bg-[#24201D] border border-[#E9DDCC] dark:border-[#3D352E] rounded-2xl shadow-xl py-2 z-50 text-xs"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[#E9DDCC] dark:border-[#3D352E]">
                    <p className="font-bold text-[#765541] dark:text-[#EDE6DE]">{user?.name}</p>
                    <p className="text-[11px] text-stone-500 dark:text-[#9E9287] truncate">{user?.email}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-[#A9B59A]/30 text-[#697A58] dark:text-[#A9B59A] text-[10px] font-semibold">
                        {role === 'tenant' ? (language === 'ar' ? 'طالب / مستأجر' : 'Tenant / Student') : role === 'owner' ? (language === 'ar' ? 'صاحب عقار' : 'Property Owner') : 'Admin'}
                      </span>
                      {user?.isVerified && (
                        <span className="text-[#697A58] dark:text-[#A9B59A] text-[10px] flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          {language === 'ar' ? 'موثق' : 'Verified'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Switch Role Fast Selection with Nora, Yomna, Farah */}
                  <div className="px-4 py-2 border-b border-[#E9DDCC] dark:border-[#3D352E]">
                    <p className="text-[10px] text-stone-400 dark:text-stone-500 uppercase font-semibold mb-1">
                      {language === 'ar' ? 'التبديل بين الحسابات التجريبية' : 'Demo Character Accounts'}
                    </p>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => {
                          setRole('tenant');
                          setActiveTab('explore');
                        }}
                        className={`text-left rtl:text-right px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-2 ${role === 'tenant' ? 'bg-[#765541] dark:bg-[#C47D60] text-white font-bold' : 'hover:bg-[#E9DDCC]/40 dark:hover:bg-[#2D2723] text-[#765541] dark:text-[#D4BFA8]'}`}
                      >
                        <img
                          src="/src/assets/images/avatar_nora_tenant_1792715698432.jpg"
                          alt="Nora"
                          className="w-5 h-5 rounded-full object-cover shrink-0"
                        />
                        <span>{language === 'ar' ? 'نورا (مستأجرة / طالبة)' : 'Nora (Student Tenant)'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setRole('owner');
                          setActiveTab('owner_dashboard');
                        }}
                        className={`text-left rtl:text-right px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-2 ${role === 'owner' ? 'bg-[#765541] dark:bg-[#C47D60] text-white font-bold' : 'hover:bg-[#E9DDCC]/40 dark:hover:bg-[#2D2723] text-[#765541] dark:text-[#D4BFA8]'}`}
                      >
                        <img
                          src="/src/assets/images/avatar_yomna_landlord_1792715698491.jpg"
                          alt="Yomna"
                          className="w-5 h-5 rounded-full object-cover shrink-0"
                        />
                        <span>{language === 'ar' ? 'يُمنى (مالكة عقار)' : 'Yomna (Landlord)'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setRole('admin');
                          setActiveTab('admin');
                        }}
                        className={`text-left rtl:text-right px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-2 ${role === 'admin' ? 'bg-[#765541] dark:bg-[#C47D60] text-white font-bold' : 'hover:bg-[#E9DDCC]/40 dark:hover:bg-[#2D2723] text-[#765541] dark:text-[#D4BFA8]'}`}
                      >
                        <img
                          src="/src/assets/images/avatar_farah_owner_1792715698559.jpg"
                          alt="Farah"
                          className="w-5 h-5 rounded-full object-cover shrink-0"
                        />
                        <span>{language === 'ar' ? 'فرح (إدارة وسكنية)' : 'Farah (App Owner)'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="w-full text-left rtl:text-right px-4 py-2 hover:bg-[#E9DDCC]/40 dark:hover:bg-[#2D2723] text-[#765541] dark:text-[#D4BFA8]"
                    >
                      {language === 'ar' ? 'حجوزاتي والتقييمات المتبادلة' : 'My Stays & Mutual Reviews'}
                    </button>
                    <button
                      onClick={() => setActiveTab('login')}
                      className="w-full text-left rtl:text-right px-4 py-2 hover:bg-[#E9DDCC]/40 dark:hover:bg-[#2D2723] text-[#765541] dark:text-[#D4BFA8]"
                    >
                      {language === 'ar' ? 'صفحة تسجيل الدخول' : 'Login Page'}
                    </button>
                    <button
                      onClick={() => setActiveTab('signup')}
                      className="w-full text-left rtl:text-right px-4 py-2 hover:bg-[#E9DDCC]/40 dark:hover:bg-[#2D2723] text-[#765541] dark:text-[#D4BFA8]"
                    >
                      {language === 'ar' ? 'صفحة إنشاء حساب جديد' : 'Sign Up Page'}
                    </button>
                    <button
                      onClick={() => setActiveModal('verify')}
                      className="w-full text-left rtl:text-right px-4 py-2 hover:bg-[#E9DDCC]/40 dark:hover:bg-[#2D2723] text-[#765541] dark:text-[#D4BFA8]"
                    >
                      {language === 'ar' ? 'مركز التوثيق ورفع الهوية' : 'Verification Center'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Nav Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#765541] dark:text-[#EDE6DE] hover:bg-[#E9DDCC]/50 dark:hover:bg-[#24201D]"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F8F4EC] dark:bg-[#191614] border-b border-[#E9DDCC] dark:border-[#3D352E] px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left rtl:text-right px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-[#765541] dark:bg-[#C47D60] text-white'
                  : 'text-[#765541] dark:text-[#D4BFA8] hover:bg-[#E9DDCC]/50 dark:hover:bg-[#24201D]'
              }`}
            >
              {language === 'ar' ? item.labelAr : item.labelEn}
            </button>
          ))}
          <div className="pt-2 border-t border-[#E9DDCC] dark:border-[#3D352E] flex items-center justify-between">
            <button
              onClick={() => {
                setRole(role === 'tenant' ? 'owner' : 'tenant');
                setMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-[#C47D60] dark:text-[#D8896C]"
            >
              {role === 'tenant'
                ? (language === 'ar' ? 'تبديل لوضع صاحب العقار' : 'Switch to Host Mode')
                : (language === 'ar' ? 'تبديل لوضع المستأجر' : 'Switch to Tenant Mode')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
