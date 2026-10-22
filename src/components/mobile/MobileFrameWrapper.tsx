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
        <span className="flex items-center gap-1.5 font-bold">
          <Smartphone className="w-4 h-4 text-[#C47D60]" />
          <span>{language === 'ar' ? 'معاينة تطبيق الجوال (iOS / Android)' : 'Mobile App Simulation (iOS / Android)'}</span>
        </span>
        <button
          onClick={() => setIsMobileDeviceMode(false)}
          className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium flex items-center gap-1 transition-colors"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'سطح المكتب' : 'Exit to Desktop'}</span>
        </button>
      </div>

      {/* Phone Hardware Mockup Shell */}
      <div className="w-full max-w-[400px] h-[820px] bg-black rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-4 border-stone-800 relative flex flex-col overflow-hidden">
        
        {/* Dynamic Island / Notch & Status Bar */}
        <div className="h-8 w-full bg-[#F8F4EC] rounded-t-[38px] flex items-center justify-between px-6 pt-1 text-[11px] font-bold text-stone-800 shrink-0 z-30 select-none">
          <span>9:41</span>
          <div className="w-24 h-4 bg-black rounded-full mx-auto" />
          <div className="flex items-center gap-1">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="flex-1 bg-[#F8F4EC] overflow-y-auto pb-20 relative">
          {children}
        </div>

        {/* Minimal Mobile Bottom Navigation Bar (Section 1 & 21) */}
        <nav className="absolute bottom-3 left-3 right-3 h-16 bg-white/95 backdrop-blur-md rounded-3xl border border-[#E9DDCC] shadow-lg flex items-center justify-around px-2 z-30">
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
