import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { PropertySearch } from './components/discovery/PropertySearch';
import { PropertyCard } from './components/discovery/PropertyCard';
import { PropertyDetailModal } from './components/discovery/PropertyDetailModal';
import { InteractiveMap } from './components/discovery/InteractiveMap';
import { PropertyCompareModal } from './components/discovery/PropertyCompareModal';
import { RoommateMatchingView } from './components/roommates/RoommateMatchingView';
import { BookingCheckoutModal } from './components/booking/BookingCheckoutModal';
import { TenantDashboard } from './components/tenant/TenantDashboard';
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { CreateListingWizard } from './components/owner/CreateListingWizard';
import { ChatModal } from './components/chat/ChatModal';
import { VerificationModal } from './components/auth/VerificationModal';
import { AdminConsole } from './components/admin/AdminConsole';
import { MisbahWidget } from './components/misbah/MisbahWidget';
import { PersistentComparisonBar } from './components/discovery/PersistentComparisonBar';
import { MobileFrameWrapper } from './components/mobile/MobileFrameWrapper';
import { PropertyListing, PropertyRoom, Booking } from './types';
import { Sparkles, ShieldCheck, Heart, Map, List, CheckCircle2 } from 'lucide-react';

const MainApp: React.FC = () => {
  const {
    language,
    role,
    properties,
    favorites,
    searchFilter,
    setSearchFilter,
    activeModal,
    setActiveModal,
    notification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('explore');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [bookingProperty, setBookingProperty] = useState<PropertyListing | null>(null);
  const [bookingRoom, setBookingRoom] = useState<PropertyRoom | undefined>(undefined);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Filter properties based on live search criteria
  const filteredProperties = properties.filter((p) => {
    if (searchFilter.city && p.location.city.toLowerCase() !== searchFilter.city.toLowerCase()) {
      return false;
    }
    if (searchFilter.propertyType && searchFilter.propertyType !== 'all') {
      if (p.propertyType !== searchFilter.propertyType) return false;
    }
    if (searchFilter.maxPrice && p.monthlyPrice > searchFilter.maxPrice) {
      return false;
    }
    if (searchFilter.privateBathroomOnly && !p.isBathroomPrivate) {
      return false;
    }
    if (searchFilter.acOnly && !p.hasAC) {
      return false;
    }
    if (searchFilter.wifiOnly && !p.hasWifi) {
      return false;
    }
    if (searchFilter.universityId) {
      const commute = p.location.nearbyUniversities.find((u) => u.universityId === searchFilter.universityId);
      if (!commute || commute.walkingMinutes > searchFilter.maxCommuteMinutes) {
        // also check transit/driving
        if (commute && commute.transitMinutes > searchFilter.maxCommuteMinutes) {
          return false;
        }
      }
    }
    if (searchFilter.favoritesOnly && !favorites.includes(p.id)) {
      return false;
    }
    return true;
  });

  const handleStartBooking = (prop: PropertyListing, room?: PropertyRoom) => {
    setSelectedProperty(null);
    setBookingProperty(prop);
    setBookingRoom(room);
  };

  return (
    <MobileFrameWrapper activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="min-h-screen flex flex-col bg-[#F8F4EC] dark:bg-[#191614] text-[#34332F] dark:text-[#EDE6DE] transition-colors duration-300">
        
        {/* Global Notification Toast */}
        {notification && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
            <div
              className={`px-5 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border ${
                notification.type === 'success'
                  ? 'bg-[#697A58] text-white border-[#697A58]'
                  : notification.type === 'error'
                  ? 'bg-[#C47D60] text-white border-[#C47D60]'
                  : 'bg-[#765541] text-white border-[#765541]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        {/* Header Contract */}
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
          
          {/* Active Tab Routing */}
          {activeTab === 'explore' && (
            <div className="space-y-8">
              
              {/* Storefront Hero Showcase (1 bold focal point as per frontend-design skill) */}
              <div className="relative rounded-[32px] overflow-hidden bg-[#E9DDCC] border border-[#E9DDCC] min-h-[340px] sm:min-h-[400px] flex items-center">
                <img
                  src="/src/assets/images/sakniya_hero_apartment_1792632264751.jpg"
                  alt="Cozy Bohemian Living in Egypt"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Measured Scrim for WCAG 4.5:1 contrast */}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/85 via-black/55 to-transparent rtl:from-black/85 rtl:via-black/55 rtl:to-transparent" />

                <div className="relative z-10 p-6 sm:p-10 md:p-14 max-w-2xl text-white space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium text-amber-200">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'سكن الطلاب والموظفين الأول في مصر' : 'Student & Professional Housing'}</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif leading-tight">
                    {language === 'ar' ? 'مكانك، وناسك، وراحتك.' : 'Your space. Your people. Your peace.'}
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-light">
                    {language === 'ar'
                      ? 'اكتشف غرفاً وشققاً مريحة بأسلوب بوهيمي دافئ بالقرب من جامعتك أو عملك، وطابق أسلوب حياتك مع رفيق السكن الأنسب بعيداً عن المفاجآت.'
                      : 'Discover sunlit bohemian apartments and rooms near Egyptian campuses, paired with transparent roommate compatibility.'}
                  </p>
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => setActiveTab('roommates')}
                      className="px-5 py-2.5 bg-[#C47D60] hover:bg-[#b06a4e] text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                    >
                      {language === 'ar' ? 'ابحث عن روميت متوافق' : 'Find Roommate Match'}
                    </button>
                    <button
                      onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
                      className="px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Map className="w-4 h-4 text-amber-200" />
                      <span>{viewMode === 'grid' ? (language === 'ar' ? 'عرض على الخريطة' : 'Map View') : (language === 'ar' ? 'عرض القائمة' : 'List View')}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Search & Location Bar */}
              <PropertySearch />

              {/* Controls bar: Results Count & View Mode Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold font-serif text-[#34332F] dark:text-[#EDE6DE]">
                    {language === 'ar' ? 'العقارات والغرف المتاحة' : 'Available Spaces'}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-[#9E9287]">
                    {filteredProperties.length} {language === 'ar' ? 'عقار معتمد ومتحقق منه' : 'verified listings found'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Favorites Filter Button */}
                  <button
                    onClick={() => setSearchFilter((prev) => ({ ...prev, favoritesOnly: !prev.favoritesOnly }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                      searchFilter.favoritesOnly
                        ? 'bg-[#C47D60] dark:bg-[#D8896C] text-white border-[#C47D60] shadow-sm'
                        : 'bg-white dark:bg-[#24201D] hover:bg-[#F8F4EC] dark:hover:bg-[#2D2723] text-[#765541] dark:text-[#D4BFA8] border-[#E9DDCC] dark:border-[#3D352E]'
                    }`}
                    title={language === 'ar' ? 'تصفية حسب العقارات المفضلة' : 'Filter by favorites'}
                  >
                    <Heart className={`w-3.5 h-3.5 transition-transform ${searchFilter.favoritesOnly ? 'fill-current scale-110' : 'text-[#C47D60] dark:text-[#D8896C]'}`} />
                    <span>{language === 'ar' ? 'المفضلة' : 'Favorites'}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono tabular-nums ${
                      searchFilter.favoritesOnly ? 'bg-white text-[#C47D60]' : 'bg-[#E9DDCC] dark:bg-[#3D352E] text-[#765541] dark:text-[#D4BFA8]'
                    }`}>
                      {favorites.length}
                    </span>
                  </button>

                  {/* Grid / Map segmented control */}
                  <div className="flex items-center p-1 bg-white dark:bg-[#24201D] rounded-xl border border-[#E9DDCC] dark:border-[#3D352E]">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        viewMode === 'grid' ? 'bg-[#765541] dark:bg-[#C47D60] text-white shadow-sm' : 'text-stone-500 dark:text-[#9E9287] hover:text-stone-800 dark:hover:text-[#EDE6DE]'
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'بطاقات' : 'Grid'}</span>
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        viewMode === 'map' ? 'bg-[#765541] dark:bg-[#C47D60] text-white shadow-sm' : 'text-stone-500 dark:text-[#9E9287] hover:text-stone-800 dark:hover:text-[#EDE6DE]'
                      }`}
                    >
                      <Map className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'خريطة' : 'Map'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Results View (Grid or Map) */}
              {viewMode === 'grid' ? (
                filteredProperties.length === 0 ? (
                  <div className="bg-white dark:bg-[#24201D] rounded-3xl p-12 text-center border border-[#E9DDCC] dark:border-[#3D352E] space-y-3">
                    <p className="font-bold text-sm text-[#34332F] dark:text-[#EDE6DE]">
                      {language === 'ar' ? 'لا توجد نتائج تطابق فلاتر البحث الحالية' : 'No properties matched your current filters'}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-[#9E9287]">
                      {language === 'ar' ? 'جرب توسيع نطاق الميزانية أو إزالة شرط الجامعة.' : 'Try expanding your budget slider or choosing all areas.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {filteredProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        onSelect={(p) => setSelectedProperty(p)}
                      />
                    ))}
                  </div>
                )
              ) : (
                <InteractiveMap
                  properties={filteredProperties}
                  onSelectProperty={(p) => setSelectedProperty(p)}
                />
              )}
            </div>
          )}

          {activeTab === 'roommates' && <RoommateMatchingView />}

          {activeTab === 'map' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold font-serif text-[#34332F]">
                  {language === 'ar' ? 'خريطة السكن التفاعلية والجامعات' : 'Interactive Egyptian Housing Map'}
                </h1>
                <p className="text-xs text-stone-500">
                  {language === 'ar' ? 'تصفح مقار الجامعات ومواقع الشقق والغرف مباشرة مع أسعار الإيجار' : 'Explore campuses and listing pins with direct rent tags'}
                </p>
              </div>
              <InteractiveMap
                properties={filteredProperties}
                onSelectProperty={(p) => setSelectedProperty(p)}
              />
            </div>
          )}

          {activeTab === 'bookings' && <TenantDashboard />}

          {activeTab === 'owner_dashboard' && (
            <OwnerDashboard
              onOpenCreateWizard={() => setIsWizardOpen(true)}
              onSelectProperty={(p) => setSelectedProperty(p)}
            />
          )}

          {activeTab === 'admin' && <AdminConsole />}

        </main>

        {/* Footer */}
        <Footer />

        {/* Floating Misbah Table Lamp Assistant */}
        <MisbahWidget />

        {/* Persistent Bottom Property Comparison Bar */}
        <PersistentComparisonBar />

        {/* Modals */}
        {selectedProperty && (
          <PropertyDetailModal
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
            onBook={handleStartBooking}
          />
        )}

        {bookingProperty && (
          <BookingCheckoutModal
            property={bookingProperty}
            room={bookingRoom}
            onClose={() => setBookingProperty(null)}
            onSuccess={() => {
              // Handled inside modal with voucher view
            }}
          />
        )}

        {activeModal === 'compare' && (
          <PropertyCompareModal
            onClose={() => setActiveModal(null)}
            onBook={(p) => handleStartBooking(p)}
          />
        )}

        {activeModal === 'chat' && (
          <ChatModal onClose={() => setActiveModal(null)} />
        )}

        {activeModal === 'verify' && (
          <VerificationModal onClose={() => setActiveModal(null)} />
        )}

        {isWizardOpen && (
          <CreateListingWizard
            onClose={() => setIsWizardOpen(false)}
            onSuccess={() => {}}
          />
        )}

      </div>
    </MobileFrameWrapper>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
