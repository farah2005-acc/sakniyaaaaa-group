import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Users,
  Compass,
  Bookmark,
  PlusCircle,
  ShieldCheck,
  User,
  Globe,
  Smartphone,
  Monitor,
  Menu,
  X,
  Scale,
  Sparkles,
  Heart,
} from 'lucide-react';

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
    <header className="sticky top-0 z-30 bg-[#F8F4EC]/95 backdrop-blur-md border-b border-[#E9DDCC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark (Single text element wordmark in display face) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('explore')}
              className="flex items-center gap-2.5 text-left rtl:text-right group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#765541] text-[#F8F4EC] flex items-center justify-center font-bold text-xl shadow-sm group-hover:bg-[#604230] transition-colors">
                <span className="font-serif">س</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-[#765541] font-serif leading-none">
                  {language === 'ar' ? 'سَكَنِيّة' : 'Sakniya'}
                </span>
                <span className="text-[10px] text-[#A9B59A] font-medium tracking-wide">
                  {language === 'ar' ? 'مكانك · وناسك · وراحتك' : 'Your space · Your people'}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#765541]">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id === 'roommates') {
                    // also ensure modal is handled or view is selected
                  }
                }}
                className={`whitespace-nowrap transition-colors py-1 relative ${
                  activeTab === item.id
                    ? 'text-[#C47D60] font-semibold'
                    : 'text-[#765541]/80 hover:text-[#765541]'
                }`}
              >
                {language === 'ar' ? item.labelAr : item.labelEn}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C47D60] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Action & User Utilities */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Favorites Quick Button */}
            <button
              onClick={() => {
                setActiveTab('explore');
                setSearchFilter((prev) => ({ ...prev, favoritesOnly: !prev.favoritesOnly }));
              }}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                searchFilter.favoritesOnly
                  ? 'bg-[#C47D60] text-white border-[#C47D60] shadow-sm'
                  : 'bg-[#E9DDCC]/60 hover:bg-[#E9DDCC] text-[#765541] border-[#E9DDCC]'
              }`}
              title={language === 'ar' ? 'عرض العقارات المفضلة' : 'View favorite properties'}
            >
              <Heart className={`w-3.5 h-3.5 ${searchFilter.favoritesOnly ? 'fill-current' : favorites.length > 0 ? 'fill-[#C47D60] text-[#C47D60]' : 'text-[#765541]'}`} />
              <span>{language === 'ar' ? 'المفضلة' : 'Favorites'}</span>
              {favorites.length > 0 && (
                <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  searchFilter.favoritesOnly ? 'bg-white text-[#C47D60]' : 'bg-[#C47D60] text-white'
                }`}>
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Compare Badge if selected */}
            {comparedProperties.length > 0 && (
              <button
                onClick={() => setActiveModal('compare')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#E9DDCC]/60 hover:bg-[#E9DDCC] text-[#765541] text-xs font-semibold rounded-lg border border-[#E9DDCC] transition-colors"
                title={language === 'ar' ? 'مقارنة العقارات المحددة' : 'Compare selected'}
              >
                <Scale className="w-3.5 h-3.5 text-[#C47D60]" />
                <span>{language === 'ar' ? 'المقارنة' : 'Compare'}</span>
                <span className="w-4 h-4 bg-[#C47D60] text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  {comparedProperties.length}
                </span>
              </button>
            )}

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="p-2 rounded-xl text-[#765541] hover:bg-[#E9DDCC]/40 border border-[#E9DDCC]/60 text-xs font-semibold flex items-center gap-1 transition-colors"
              title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              <Globe className="w-3.5 h-3.5 text-[#697A58]" />
              <span className="uppercase text-[11px]">{language === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Mobile Device Simulator Toggle */}
            <button
              onClick={() => setIsMobileDeviceMode((prev) => !prev)}
              className={`hidden lg:flex items-center gap-1 p-2 rounded-xl border text-xs font-medium transition-colors ${
                isMobileDeviceMode
                  ? 'bg-[#765541] text-white border-[#765541]'
                  : 'text-[#765541] hover:bg-[#E9DDCC]/40 border-[#E9DDCC]/60'
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
                className="hidden sm:inline-flex px-3.5 py-2 text-xs font-medium text-[#765541] hover:text-[#604230] hover:bg-[#E9DDCC]/50 rounded-xl border border-[#E9DDCC] transition-colors whitespace-nowrap"
              >
                {language === 'ar' ? 'أضف عقارك' : 'List Property'}
              </button>
            ) : (
              <button
                onClick={() => {
                  setRole('tenant');
                  setActiveTab('explore');
                }}
                className="hidden sm:inline-flex px-3.5 py-2 text-xs font-medium text-[#765541] hover:text-[#604230] hover:bg-[#E9DDCC]/50 rounded-xl border border-[#E9DDCC] transition-colors whitespace-nowrap"
              >
                {language === 'ar' ? 'تصفح كمستأجر' : 'Browse as Tenant'}
              </button>
            )}

            {/* Profile Menu Trigger */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full border border-[#E9DDCC] hover:border-[#C47D60] transition-colors bg-white focus:outline-none"
                aria-label="User profile"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden bg-[#E9DDCC]">
                  {user ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 m-1.5 text-stone-500" />
                  )}
                </div>
                <span className="text-xs font-medium text-[#34332F] max-w-[80px] truncate hidden md:inline">
                  {user ? user.name.split(' ')[0] : 'Guest'}
                </span>
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div
                  className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-64 bg-[#F8F4EC] border border-[#E9DDCC] rounded-2xl shadow-xl py-2 z-50 text-xs"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[#E9DDCC]">
                    <p className="font-bold text-[#765541]">{user?.name}</p>
                    <p className="text-[11px] text-stone-500 truncate">{user?.email}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-[#A9B59A]/30 text-[#697A58] text-[10px] font-semibold">
                        {role === 'tenant' ? (language === 'ar' ? 'طالب / مستأجر' : 'Tenant / Student') : role === 'owner' ? (language === 'ar' ? 'صاحب عقار' : 'Property Owner') : 'Admin'}
                      </span>
                      {user?.isVerified && (
                        <span className="text-[#697A58] text-[10px] flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          {language === 'ar' ? 'موثق' : 'Verified'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Switch Role Fast Selection */}
                  <div className="px-4 py-2 border-b border-[#E9DDCC]">
                    <p className="text-[10px] text-stone-400 uppercase font-semibold mb-1">
                      {language === 'ar' ? 'تبديل الدور للتجربة' : 'Switch Role for Testing'}
                    </p>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => {
                          setRole('tenant');
                          setActiveTab('explore');
                        }}
                        className={`text-left rtl:text-right px-2 py-1.5 rounded-lg transition-colors ${role === 'tenant' ? 'bg-[#765541] text-white' : 'hover:bg-[#E9DDCC]/40 text-[#765541]'}`}
                      >
                        {language === 'ar' ? 'طالب / مستأجر (كريم حسن)' : 'Student / Tenant (Karim)'}
                      </button>
                      <button
                        onClick={() => {
                          setRole('owner');
                          setActiveTab('owner_dashboard');
                        }}
                        className={`text-left rtl:text-right px-2 py-1.5 rounded-lg transition-colors ${role === 'owner' ? 'bg-[#765541] text-white' : 'hover:bg-[#E9DDCC]/40 text-[#765541]'}`}
                      >
                        {language === 'ar' ? 'صاحب سكن (الحاج محمود)' : 'Host / Owner (Haj Mahmoud)'}
                      </button>
                      <button
                        onClick={() => {
                          setRole('admin');
                          setActiveTab('admin');
                        }}
                        className={`text-left rtl:text-right px-2 py-1.5 rounded-lg transition-colors ${role === 'admin' ? 'bg-[#765541] text-white' : 'hover:bg-[#E9DDCC]/40 text-[#765541]'}`}
                      >
                        {language === 'ar' ? 'إدارة المنصة (المسؤول)' : 'Platform Administrator'}
                      </button>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="w-full text-left rtl:text-right px-4 py-2 hover:bg-[#E9DDCC]/40 text-[#765541]"
                    >
                      {language === 'ar' ? 'حجوزاتي وإيصالات الدفع' : 'My Bookings & Receipts'}
                    </button>
                    <button
                      onClick={() => setActiveModal('verify')}
                      className="w-full text-left rtl:text-right px-4 py-2 hover:bg-[#E9DDCC]/40 text-[#765541]"
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
              className="md:hidden p-2 rounded-xl text-[#765541] hover:bg-[#E9DDCC]/50"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F8F4EC] border-b border-[#E9DDCC] px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left rtl:text-right px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-[#765541] text-white'
                  : 'text-[#765541] hover:bg-[#E9DDCC]/50'
              }`}
            >
              {language === 'ar' ? item.labelAr : item.labelEn}
            </button>
          ))}
          <div className="pt-2 border-t border-[#E9DDCC] flex items-center justify-between">
            <button
              onClick={() => {
                setRole(role === 'tenant' ? 'owner' : 'tenant');
                setMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-[#C47D60]"
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
