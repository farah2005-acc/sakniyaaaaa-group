import React, { useState } from 'react';
import { PropertyListing, PropertyType } from '../../types';
import { useApp } from '../../context/AppContext';
import { EGYPT_GOVERNORATES, UNIVERSITIES } from '../../data/mockData';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Building2,
  MapPin,
  Bed,
  CheckSquare,
  Image,
  DollarSign,
  Shield,
  FileCheck,
  CheckCircle,
  Upload,
} from 'lucide-react';

interface CreateListingWizardProps {
  onClose: () => void;
  onSuccess: (newListing: PropertyListing) => void;
}

export const CreateListingWizard: React.FC<CreateListingWizardProps> = ({
  onClose,
  onSuccess,
}) => {
  const { user, language, addPropertyListing } = useApp();
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    title: 'Cozy Sunlit Student Apartment',
    titleAr: 'شقة طلابية مشمسة ودافئة',
    description: 'Freshly decorated bohemian student flat with natural wood furnishings, high speed internet, and a peaceful study area.',
    descriptionAr: 'شقة طلابية جديدة بتصميم بوهيمي هادئ، أثاث خشبي طبيعي وإنترنت سريع وركن مخصص للمذاكرة.',
    propertyType: 'apartment' as PropertyType,
    governorate: 'Alexandria',
    governorateAr: 'الإسكندرية',
    city: 'Alexandria',
    cityAr: 'الإسكندرية',
    neighborhood: 'Smouha',
    neighborhoodAr: 'سموحة',
    streetApprox: 'Victor Emanuel St',
    streetApproxAr: 'شارع فيكتور عمانويل',
    monthlyPrice: 4500,
    depositAmount: 4500,
    shortStayDailyPrice: 550,
    utilitiesIncluded: true,
    estimatedUtilitiesMonthly: 0,
    totalBedrooms: 2,
    availableBedrooms: 2,
    totalBathrooms: 1,
    isBathroomPrivate: true,
    hasAC: true,
    hasWifi: true,
    hasKitchen: true,
    hasElevator: true,
    hasWashingMachine: true,
    hasBalcony: true,
    smokingAllowed: false,
    petsAllowed: false,
    quietHoursStart: '23:00',
    quietHoursEnd: '07:00',
    guestsAllowed: true,
    genderPolicy: 'any' as const,
    availableFrom: '2026-11-01',
    minimumStayMonths: 3,
    coverImage: '/src/assets/images/sakniya_hero_apartment_1792632264751.jpg',
    ownershipDocNumber: 'EGY-REG-99120',
  });

  const nextStep = () => setStep((prev) => Math.min(10, prev + 1));
  const prevStep = () => setStep((prev) => Math.max(1, prev - 1));

  const handleSubmit = () => {
    const newListing: PropertyListing = {
      id: `prop-${Date.now()}`,
      title: formData.title,
      titleAr: formData.titleAr,
      description: formData.description,
      descriptionAr: formData.descriptionAr,
      propertyType: formData.propertyType,
      ownerId: user?.id || 'owner-1',
      ownerName: user?.name || 'Haj Mahmoud El-Gohary',
      ownerAvatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      ownerPhone: user?.phone || '+20 100 234 5678',
      ownerVerified: true,
      location: {
        governorate: formData.governorate,
        governorateAr: formData.governorateAr,
        city: formData.city,
        cityAr: formData.cityAr,
        neighborhood: formData.neighborhood,
        neighborhoodAr: formData.neighborhoodAr,
        streetApprox: formData.streetApprox,
        streetApproxAr: formData.streetApproxAr,
        lat: 31.2052,
        lng: 29.9548,
        nearbyUniversities: [
          {
            universityId: 'pua',
            nameEn: 'Pharos University (PUA)',
            nameAr: 'جامعة فاروس',
            walkingMinutes: 10,
            drivingMinutes: 4,
            transitMinutes: 6,
          },
        ],
      },
      images: [
        formData.coverImage,
        '/src/assets/images/sakniya_room_bohemian_1792632264953.jpg',
        '/src/assets/images/sakniya_shared_kitchen_1792632265818.jpg',
      ],
      coverImage: formData.coverImage,
      monthlyPrice: formData.monthlyPrice,
      depositAmount: formData.depositAmount,
      shortStayDailyPrice: formData.shortStayDailyPrice,
      utilitiesIncluded: formData.utilitiesIncluded,
      estimatedUtilitiesMonthly: formData.estimatedUtilitiesMonthly,
      totalBedrooms: formData.totalBedrooms,
      availableBedrooms: formData.availableBedrooms,
      totalBathrooms: formData.totalBathrooms,
      isBathroomPrivate: formData.isBathroomPrivate,
      hasAC: formData.hasAC,
      hasWifi: formData.hasWifi,
      hasKitchen: formData.hasKitchen,
      hasElevator: formData.hasElevator,
      hasWashingMachine: formData.hasWashingMachine,
      hasBalcony: formData.hasBalcony,
      amenities: ['wifi', 'ac', 'kitchen', 'elevator', 'washing_machine', 'balcony'],
      houseRules: {
        smokingAllowed: formData.smokingAllowed,
        petsAllowed: formData.petsAllowed,
        quietHoursStart: formData.quietHoursStart,
        quietHoursEnd: formData.quietHoursEnd,
        guestsAllowed: formData.guestsAllowed,
        overnightGuestsAllowed: false,
        cleaningSchedule: 'Weekly rotation',
        genderPolicy: formData.genderPolicy,
      },
      rooms: [
        {
          id: `room-${Date.now()}-1`,
          name: 'Master Room',
          nameAr: 'الغرفة الرئيسية',
          type: 'private',
          bedsCount: 1,
          availableBeds: 1,
          monthlyPrice: formData.monthlyPrice,
          privateBathroom: formData.isBathroomPrivate,
          hasAC: formData.hasAC,
          hasBalcony: formData.hasBalcony,
        },
      ],
      availableFrom: formData.availableFrom,
      minimumStayMonths: formData.minimumStayMonths,
      status: 'published',
      viewsCount: 1,
      savesCount: 0,
      rating: 5.0,
      reviewsCount: 0,
    };

    addPropertyListing(newListing);
    onSuccess(newListing);
    onClose();
  };

  const stepsList = [
    { num: 1, nameEn: 'Type', nameAr: 'نوع السكن' },
    { num: 2, nameEn: 'Location', nameAr: 'الموقع' },
    { num: 3, nameEn: 'Capacity', nameAr: 'الغرف' },
    { num: 4, nameEn: 'Amenities', nameAr: 'المرافق' },
    { num: 5, nameEn: 'Photos', nameAr: 'الصور' },
    { num: 6, nameEn: 'Pricing', nameAr: 'الأسعار' },
    { num: 7, nameEn: 'Rules', nameAr: 'القواعد' },
    { num: 8, nameEn: 'Dates', nameAr: 'المواعيد' },
    { num: 9, nameEn: 'Verification', nameAr: 'التوثيق' },
    { num: 10, nameEn: 'Publish', nameAr: 'المعاينة' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-[#F8F4EC] rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-[#E9DDCC] shadow-2xl flex flex-col">
        
        {/* Header with step progress */}
        <div className="px-6 py-4 bg-white/90 backdrop-blur-md border-b border-[#E9DDCC] sticky top-0 z-20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-[#C47D60] tracking-wider">
              {language === 'ar' ? `الخطوة ${step} من ١٠` : `Step ${step} of 10`}
            </span>
            <h2 className="font-bold text-base text-[#765541] font-serif">
              {language === 'ar' ? 'معالج إضافة عقار جديد' : 'Property Listing Wizard'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100">
            <X className="w-5 h-5 text-[#765541]" />
          </button>
        </div>

        {/* Step Progress Pill Indicator */}
        <div className="px-6 py-3 bg-[#E9DDCC]/30 border-b border-[#E9DDCC] overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-[500px]">
            {stepsList.map((s) => (
              <div
                key={s.num}
                onClick={() => setStep(s.num)}
                className={`flex-1 py-1 px-2 rounded-lg text-center text-[10px] font-semibold cursor-pointer transition-all ${
                  step === s.num
                    ? 'bg-[#765541] text-white shadow-sm'
                    : step > s.num
                    ? 'bg-[#697A58]/20 text-[#697A58]'
                    : 'bg-white/60 text-stone-400'
                }`}
              >
                {language === 'ar' ? s.nameAr : s.nameEn}
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Form Body */}
        <div className="p-6 sm:p-8 flex-1">
          
          {/* Step 1: Type */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-[#34332F]">
                {language === 'ar' ? 'ما نوع هذا السكن؟' : 'What type of accommodation is this?'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { id: 'apartment', labelEn: 'Entire Apartment', labelAr: 'شقة بالكامل' },
                  { id: 'private_room', labelEn: 'Private Room in Shared Flat', labelAr: 'غرفة مستقلة في شقة مشتركة' },
                  { id: 'shared_room', labelEn: 'Bed in Shared Room', labelAr: 'سرير في غرفة مشتركة' },
                  { id: 'studio', labelEn: 'Studio Suite', labelAr: 'استوديو مستقل' },
                  { id: 'student_residence', labelEn: 'Student Residence Building', labelAr: 'سكن طلابي مخصص' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, propertyType: t.id as any })}
                    className={`p-4 rounded-2xl border text-left rtl:text-right font-medium transition-all ${
                      formData.propertyType === t.id
                        ? 'border-[#C47D60] bg-white ring-2 ring-[#C47D60]/20 font-bold'
                        : 'border-[#E9DDCC] bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    {language === 'ar' ? t.labelAr : t.labelEn}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-sm text-[#34332F]">
                {language === 'ar' ? 'أين يقع هذا السكن في مصر؟' : 'Where is this property located?'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">
                    {language === 'ar' ? 'المحافظة' : 'Governorate'}
                  </label>
                  <select
                    value={formData.governorate}
                    onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#E9DDCC] rounded-xl"
                  >
                    {EGYPT_GOVERNORATES.map((g) => (
                      <option key={g.id} value={g.nameEn}>
                        {language === 'ar' ? g.nameAr : g.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 font-semibold mb-1">
                    {language === 'ar' ? 'الحي أو المنطقة' : 'Neighborhood'}
                  </label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#E9DDCC] rounded-xl font-medium"
                    placeholder="e.g. Smouha, Shatby, Maadi"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-600 font-semibold mb-1">
                    {language === 'ar' ? 'الشارع أو المعلم القريب' : 'Approximate Street or Landmark'}
                  </label>
                  <input
                    type="text"
                    value={formData.streetApprox}
                    onChange={(e) => setFormData({ ...formData, streetApprox: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#E9DDCC] rounded-xl font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Capacity */}
          {step === 3 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-sm text-[#34332F]">
                {language === 'ar' ? 'عدد الغرف والأسِرّة والحمامات' : 'Rooms and Capacity'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">
                    {language === 'ar' ? 'إجمالي غرف النوم' : 'Total Bedrooms'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.totalBedrooms}
                    onChange={(e) => setFormData({ ...formData, totalBedrooms: parseInt(e.target.value, 10) || 1 })}
                    className="w-full p-2.5 bg-white border border-[#E9DDCC] rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">
                    {language === 'ar' ? 'الحمامات' : 'Bathrooms'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.totalBathrooms}
                    onChange={(e) => setFormData({ ...formData, totalBathrooms: parseInt(e.target.value, 10) || 1 })}
                    className="w-full p-2.5 bg-white border border-[#E9DDCC] rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Amenities */}
          {step === 4 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-sm text-[#34332F]">
                {language === 'ar' ? 'المرافق والتجهيزات المتوفرة' : 'Amenities & Features'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { key: 'hasAC', labelEn: 'Air Conditioning', labelAr: 'تكييف هواء' },
                  { key: 'hasWifi', labelEn: 'Optical Fiber Wi-Fi', labelAr: 'إنترنت فايبر سريع' },
                  { key: 'hasKitchen', labelEn: 'Fitted Kitchen', labelAr: 'مطبخ كامل' },
                  { key: 'hasWashingMachine', labelEn: 'Washing Machine', labelAr: 'غسالة ملابس' },
                  { key: 'hasElevator', labelEn: 'Elevator', labelAr: 'مصعد بالعمارة' },
                  { key: 'hasBalcony', labelEn: 'Balcony', labelAr: 'بلكونة / تراس' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2 p-3 bg-white rounded-xl border border-[#E9DDCC] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(formData as any)[item.key]}
                      onChange={(e) => setFormData({ ...formData, [item.key]: e.target.checked })}
                      className="w-4 h-4 accent-[#C47D60]"
                    />
                    <span className="font-medium">{language === 'ar' ? item.labelAr : item.labelEn}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Photos */}
          {step === 5 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-sm text-[#34332F]">
                {language === 'ar' ? 'صور السكن (تصوير حقيقي وواضح)' : 'Property Photography'}
              </h3>
              <div className="p-6 border-2 border-dashed border-[#C47D60]/40 rounded-2xl bg-white text-center space-y-2">
                <Upload className="w-8 h-8 text-[#C47D60] mx-auto" />
                <p className="font-semibold text-stone-700">
                  {language === 'ar' ? 'تم اختيار صور السكن البوهيمية المعتمدة' : 'High-fidelity bohemian photos attached'}
                </p>
                <div className="grid grid-cols-3 gap-3 pt-3">
                  <img src="/src/assets/images/sakniya_hero_apartment_1792632264751.jpg" alt="Living" className="h-24 w-full object-cover rounded-xl" />
                  <img src="/src/assets/images/sakniya_room_bohemian_1792632264953.jpg" alt="Bedroom" className="h-24 w-full object-cover rounded-xl" />
                  <img src="/src/assets/images/sakniya_shared_kitchen_1792632265818.jpg" alt="Kitchen" className="h-24 w-full object-cover rounded-xl" />
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Pricing */}
          {step === 6 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-sm text-[#34332F]">
                {language === 'ar' ? 'تحديد أسعار الإيجار والوديعة' : 'Rent & Deposit Pricing'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">
                    {language === 'ar' ? 'الإيجار الشهري (ج.م)' : 'Monthly Rent (EGP)'}
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyPrice}
                    onChange={(e) => setFormData({ ...formData, monthlyPrice: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2.5 bg-white border border-[#E9DDCC] rounded-xl font-mono text-sm font-bold text-[#765541]"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">
                    {language === 'ar' ? 'التأمين المسترد (ج.م)' : 'Security Deposit (EGP)'}
                  </label>
                  <input
                    type="number"
                    value={formData.depositAmount}
                    onChange={(e) => setFormData({ ...formData, depositAmount: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2.5 bg-white border border-[#E9DDCC] rounded-xl font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Rules */}
          {step === 7 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-sm text-[#34332F]">
                {language === 'ar' ? 'قواعد السكن والاشتراطات' : 'House Rules'}
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2 p-3 bg-white rounded-xl border border-[#E9DDCC]">
                  <input
                    type="checkbox"
                    checked={formData.smokingAllowed}
                    onChange={(e) => setFormData({ ...formData, smokingAllowed: e.target.checked })}
                    className="w-4 h-4 accent-[#C47D60]"
                  />
                  <span>{language === 'ar' ? 'يسمح بالتدخين داخل السكن' : 'Smoking allowed inside'}</span>
                </label>
                <label className="flex items-center gap-2 p-3 bg-white rounded-xl border border-[#E9DDCC]">
                  <input
                    type="checkbox"
                    checked={formData.petsAllowed}
                    onChange={(e) => setFormData({ ...formData, petsAllowed: e.target.checked })}
                    className="w-4 h-4 accent-[#C47D60]"
                  />
                  <span>{language === 'ar' ? 'يسمح باصطحاب حيوانات أليفة' : 'Pets allowed'}</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 8: Dates */}
          {step === 8 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-sm text-[#34332F]">
                {language === 'ar' ? 'تاريخ الإتاحة والحد الأدنى للإقامة' : 'Availability & Minimum Stay'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">
                    {language === 'ar' ? 'متاح بدءاً من' : 'Available From'}
                  </label>
                  <input
                    type="date"
                    value={formData.availableFrom}
                    onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#E9DDCC] rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">
                    {language === 'ar' ? 'أقل مدة إيجار (شهور)' : 'Minimum Stay (Months)'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.minimumStayMonths}
                    onChange={(e) => setFormData({ ...formData, minimumStayMonths: parseInt(e.target.value, 10) || 1 })}
                    className="w-full p-2.5 bg-white border border-[#E9DDCC] rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 9: Verification */}
          {step === 9 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-sm text-[#34332F]">
                {language === 'ar' ? 'توثيق ملكية العقار والهوية' : 'Title Deed & Identity Verification'}
              </h3>
              <div className="p-4 bg-white rounded-2xl border border-[#E9DDCC] space-y-3">
                <div className="flex items-center gap-2 text-[#697A58] font-bold">
                  <Shield className="w-4 h-4" />
                  <span>{language === 'ar' ? 'إثبات الملكية أو التوكيل القانوني' : 'Ownership Deed or Legal Authorization'}</span>
                </div>
                <input
                  type="text"
                  value={formData.ownershipDocNumber}
                  onChange={(e) => setFormData({ ...formData, ownershipDocNumber: e.target.value })}
                  className="w-full p-2.5 bg-[#F8F4EC] border border-[#E9DDCC] rounded-xl font-mono"
                  placeholder="e.g. Registered Deed # / الشهر العقاري"
                />
                <p className="text-[11px] text-stone-500">
                  {language === 'ar' ? 'مستنداتك مشفرة ولا تظهر لأي مستخدم آخر نهائياً.' : 'Your identity documents are securely encrypted.'}
                </p>
              </div>
            </div>
          )}

          {/* Step 10: Preview & Publish */}
          {step === 10 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-sm text-[#34332F]">
                {language === 'ar' ? 'معاينة العقار قبل النشر' : 'Review & Publish'}
              </h3>
              <div className="bg-white p-5 rounded-2xl border border-[#E9DDCC] space-y-3">
                <div className="flex items-center gap-3">
                  <img src={formData.coverImage} alt="Cover" className="w-20 h-16 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-sm text-[#34332F]">{formData.titleAr}</h4>
                    <p className="text-stone-500">{formData.neighborhood} · {formData.city}</p>
                    <span className="font-mono font-bold text-[#765541]">
                      {formData.monthlyPrice.toLocaleString()} ج.م / شهرياً
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-[#697A58]/10 text-[#697A58] rounded-xl flex items-center gap-2 text-xs font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  <span>{language === 'ar' ? 'العقار جاهز للنشر الفوري بعد استيفاء الشروط.' : 'Listing is complete and ready to publish.'}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Controls */}
        <div className="px-6 py-4 bg-white/90 border-t border-[#E9DDCC] flex items-center justify-between">
          <button
            type="button"
            disabled={step === 1}
            onClick={prevStep}
            className="px-4 py-2 text-xs font-bold text-[#765541] disabled:opacity-30 hover:bg-stone-100 rounded-xl"
          >
            {language === 'ar' ? 'السابق' : 'Previous'}
          </button>

          {step < 10 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2.5 bg-[#765541] hover:bg-[#604230] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <span>{language === 'ar' ? 'التالي' : 'Next'}</span>
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-8 py-2.5 bg-[#C47D60] hover:bg-[#b06a4e] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{language === 'ar' ? 'نشر العقار الآن' : 'Publish Listing'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
