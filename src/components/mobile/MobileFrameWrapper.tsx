import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, Users, Map, Calendar, User, Smartphone, Monitor } from 'lucide-react';

interface MobileFrameWrapperProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({
  children,
  activeTab,
  setActiveTab,
}) => {
  const { isMobileDeviceMode, setIsMobileDeviceMode, language, role } = useApp();

  if (!isMobileDeviceMode) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-stone-900 py-6 px-4 flex flex-col items-center justify-center">
      {/* Top Banner to switch back to Desktop */}
      <div className="mb-4 flex items-center justify-between w-full max-w-[420px] text-xs text-stone-300">
        <div className="flex items-center gap-2.5">
          <img
            src="/src/assets/images/sakniya_house_logo_1792680398805.jpg"
            alt="Sakniya Mobile App Icon"
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-xl shadow-md ring-1 ring-white/20 object-cover"
          />
          <div className="flex flex-col">
            <span className="font-bold text-white text-xs">
              {language === 'ar' ? 'تطبيق سَكَنِيّة للهواتف' : 'Sakniya Mobile App'}
            </span>
            <span className="text-[10px] text-stone-400">
              {language === 'ar' ? 'أيقونة التطبيق الرسمية (iOS / Android)' : 'Official App Icon (iOS / Android)'}
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsMobileDeviceMode(false)}
          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium flex items-center gap-1.5 transition-colors border border-white/10"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'سطح المكتب' : 'Desktop'}</span>
        </button>
      </div>

      {/* Phone Hardware Mockup Shell */}
      <div className="w-full max-w-[400px] h-[820px] bg-black rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-4 border-stone-800 relative flex flex-col overflow-hidden">
        
        {/* Dynamic Island / Notch & Status Bar */}
        <div className="h-8 w-full bg-[#F8F4EC] dark:bg-[#191614] rounded-t-[38px] flex items-center justify-between px-6 pt-1 text-[11px] font-bold text-stone-800 dark:text-[#EDE6DE] shrink-0 z-30 select-none transition-colors">
          <span>9:41</span>
          <div className="w-24 h-4 bg-black rounded-full mx-auto" />
          <div className="flex items-center gap-1">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="flex-1 bg-[#F8F4EC] dark:bg-[#191614] overflow-y-auto pb-20 relative transition-colors">
          {children}
        </div>

        {/* Minimal Mobile Bottom Navigation Bar (Section 1 & 21) */}
        <nav className="absolute bottom-3 left-3 right-3 h-16 bg-white/95 dark:bg-[#24201D]/95 backdrop-blur-md rounded-3xl border border-[#E9DDCC] dark:border-[#3D352E] shadow-lg flex items-center justify-around px-2 z-30 transition-colors">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
              activeTab === 'explore' ? 'text-[#C47D60] font-bold' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span>{language === 'ar' ? 'العقارات' : 'Explore'}</span>
          </button>

          <button
            onClick={() => setActiveTab('roommates')}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
              activeTab === 'roommates' ? 'text-[#C47D60] font-bold' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>{language === 'ar' ? 'الروميت' : 'Matches'}</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
              activeTab === 'map' ? 'text-[#C47D60] font-bold' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <Map className="w-5 h-5" />
            <span>{language === 'ar' ? 'الخريطة' : 'Map'}</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
              activeTab === 'bookings' ? 'text-[#C47D60] font-bold' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>{language === 'ar' ? 'حجوزاتي' : 'Stays'}</span>
          </button>

          {role === 'owner' ? (
            <button
              onClick={() => setActiveTab('owner_dashboard')}
              className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                activeTab === 'owner_dashboard' ? 'text-[#C47D60] font-bold' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <User className="w-5 h-5" />
              <span>{language === 'ar' ? 'عقاراتي' : 'Host'}</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                activeTab === 'admin' ? 'text-[#C47D60] font-bold' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <User className="w-5 h-5" />
              <span>{language === 'ar' ? 'حسابي' : 'Profile'}</span>
            </button>
          )}
        </nav>

        {/* Home Indicator Bar */}
        <div className="h-4 w-full bg-black rounded-b-[38px] flex items-center justify-center shrink-0">
          <div className="w-32 h-1 bg-white/40 rounded-full" />
        </div>
      </div>
    </div>
  );
};
