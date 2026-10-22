import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoommateProfile, RoommateQuestionnaire } from '../../types';
import { calculateRoommateCompatibility } from '../../utils/roommateMatcher';
import {
  Users,
  Sparkles,
  Sliders,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Heart,
  Save,
  RotateCcw,
} from 'lucide-react';

export const RoommateMatchingView: React.FC = () => {
  const {
    language,
    myQuestionnaire,
    saveQuestionnaire,
    roommateProfiles,
    setActiveChatRecipient,
    setActiveModal,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'matches' | 'questionnaire'>('matches');
  const [selectedProfile, setSelectedProfile] = useState<RoommateProfile | null>(null);
  const [formState, setFormState] = useState<RoommateQuestionnaire>(
    myQuestionnaire || {
      wakingTime: 'early_bird',
      sleepingTime: 'early',
      studyAtHomeFrequency: 'often',
      timeSpentAtHome: 'half_day',
      cleanlinessStandard: 'meticulous',
      cleaningChoreSharing: 'take_turns',
      kitchenCleanExpectation: 'immediately_after_use',
      bathroomCleanFrequency: 'daily',
      isSmoker: false,
      comfortableWithSmokers: false,
      smokingInsideAllowed: false,
      noiseTolerance: 'silent_required',
      quietHoursExpectation: 'strict_early',
      remoteWorkOrOnlineClasses: false,
      guestFrequency: 'rarely',
      overnightGuestsOk: false,
      socialLivingStyle: 'friendly_independent',
      hasPets: false,
      comfortableWithPets: false,
      petAllergies: false,
      cookingFrequency: 'light_cook',
      foodSharingPreference: 'separate_everything',
      acUsagePreference: 'moderate_fans',
      conflictResolutionStyle: 'discuss_immediately',
      houseRulesAgreement: true,
      gender: 'male',
      genderPreference: 'same_gender',
      budgetMaxMonthly: 4000,
      preferredCities: ['Alexandria'],
      preferredNeighborhoods: ['Smouha', 'Shatby'],
      targetUniversityOrWorkplace: 'pua',
      optInDiscovery: true,
    }
  );

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    saveQuestionnaire(formState);
    setActiveTab('matches');
  };

  // Compute matches using the algorithm
  const matches = roommateProfiles.map((profile) => {
    const report = calculateRoommateCompatibility(formState, profile.answers);
    return {
      profile,
      report,
    };
  }).sort((a, b) => b.report.score - a.report.score);

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-[#765541] text-[#F8F4EC] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs text-[#E9DDCC] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C47D60]" />
            <span>{language === 'ar' ? 'ميزة سكنية الحصرية' : "Sakniya's Signature Algorithm"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif mb-2">
            {language === 'ar' ? 'نظام مطابقة رفقاء السكن المتوافقين' : 'Roommate Compatibility Matcher'}
          </h1>
          <p className="text-xs sm:text-sm text-[#E9DDCC]/90 leading-relaxed mb-6">
            {language === 'ar'
              ? 'لا نعتمد على الحظ. خوارزميتنا تفحص ٨ محاور لأسلوب الحياة: الروتين ومواعيد النوم، النظافة وتوزيع المهام، الهدوء والمذاكرة، التدخين، والضيوف لضمان راحة بالك وسكينتك.'
              : 'Lifestyle compatibility evaluated across 8 structured dimensions (Routine 20%, Cleanliness 20%, Noise 15%, Smoking 15%, Guests 10%, Pets 10%, Kitchen 5%, Communication 5%). Transparent and respectful.'}
          </p>

          {/* Tab Navigation */}
          <div className="inline-flex items-center p-1 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('matches')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'matches'
                  ? 'bg-white text-[#765541] shadow-md'
                  : 'text-[#E9DDCC] hover:text-white'
              }`}
            >
              {language === 'ar' ? 'النتائج والتوافق' : 'Matching Results'}
            </button>
            <button
              onClick={() => setActiveTab('questionnaire')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'questionnaire'
                  ? 'bg-white text-[#765541] shadow-md'
                  : 'text-[#E9DDCC] hover:text-white'
              }`}
            >
              {language === 'ar' ? 'استبيان أسلوب حياتي' : 'My Lifestyle Questionnaire'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'matches' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Matches List (2 Columns on large) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm text-[#765541] font-serif">
                {language === 'ar' ? 'أفضل المرشحين المتوافقين معك' : 'Top Lifestyle Matches for You'}
              </h2>
              <span className="text-xs text-stone-500">
                {matches.length} {language === 'ar' ? 'ملفات نشطة' : 'active profiles'}
              </span>
            </div>

            <div className="space-y-4">
              {matches.map(({ profile, report }) => (
                <div
                  key={profile.userId}
                  onClick={() => setSelectedProfile(profile)}
                  className={`bg-white rounded-3xl p-5 border transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md ${
                    selectedProfile?.userId === profile.userId
                      ? 'border-[#C47D60] ring-2 ring-[#C47D60]/20'
                      : 'border-[#E9DDCC] hover:border-[#765541]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* User Profile Info */}
                    <div className="flex items-start gap-4">
                      <img
                        src={profile.avatar}
                        alt={profile.fullName}
                        className="w-14 h-14 rounded-2xl object-cover border border-[#E9DDCC] shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-[#34332F]">
                            {language === 'ar' ? profile.fullNameAr || profile.fullName : profile.fullName}
                          </h3>
                          <span className="text-[10px] text-[#697A58] bg-[#697A58]/10 px-2 py-0.5 rounded-full font-semibold">
                            {profile.isStudent ? (language === 'ar' ? 'طالب جامعي' : 'Student') : (language === 'ar' ? 'موظف' : 'Employee')}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">{profile.university}</p>
                        <p className="text-xs text-stone-600 mt-2 line-clamp-2">
                          {language === 'ar' ? profile.bioAr || profile.bio : profile.bio}
                        </p>
                      </div>
                    </div>

                    {/* Compatibility Score Circle */}
                    <div className="flex sm:flex-col items-center justify-between sm:justify-center border-t sm:border-t-0 sm:border-l rtl:sm:border-l-0 rtl:sm:border-r border-[#E9DDCC] pt-3 sm:pt-0 sm:px-6 shrink-0">
                      <div className="text-center">
                        <div className="text-2xl font-black font-mono text-[#C47D60] tabular-nums">
                          {report.score}%
                        </div>
                        <span className="text-[10px] text-stone-500 font-semibold block uppercase">
                          {language === 'ar' ? 'توافق أسلوب الحياة' : 'Lifestyle Match'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Summary */}
                  <div className="mt-4 pt-4 border-t border-[#E9DDCC]/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-[#697A58] font-medium text-[11px]">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{report.sharedPreferences[0]?.ar || report.sharedPreferences[0]?.en || 'توافق عام في السكن'}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveChatRecipient({
                          id: profile.userId,
                          name: profile.fullName,
                          avatar: profile.avatar,
                        });
                        setActiveModal('chat');
                      }}
                      className="px-3 py-1.5 bg-[#765541] hover:bg-[#604230] text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'بدء محادثة' : 'Chat'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Compatibility Report Drawer */}
          <div className="space-y-4">
            <h2 className="font-bold text-sm text-[#765541] font-serif">
              {language === 'ar' ? 'تقرير التوافق التفصيلي' : 'In-Depth Compatibility Report'}
            </h2>

            {selectedProfile ? (
              (() => {
                const report = calculateRoommateCompatibility(formState, selectedProfile.answers);
                return (
                  <div className="bg-white rounded-3xl p-6 border border-[#E9DDCC] shadow-md space-y-6">
                    <div className="text-center pb-4 border-b border-[#E9DDCC]">
                      <img
                        src={selectedProfile.avatar}
                        alt={selectedProfile.fullName}
                        className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-[#C47D60] mb-2"
                      />
                      <h3 className="font-bold text-base text-[#34332F]">{selectedProfile.fullName}</h3>
                      <div className="mt-2 inline-block px-4 py-1 rounded-full bg-[#C47D60]/10 text-[#C47D60] font-black font-mono text-lg tabular-nums">
                        {report.score}% {language === 'ar' ? 'نسبة التوافق' : 'Compatibility'}
                      </div>
                    </div>

                    {/* Category Breakdown Bars */}
                    <div>
                      <h4 className="font-bold text-xs uppercase text-[#765541] mb-3">
                        {language === 'ar' ? 'توزيع المحاور الثمانية' : 'Dimensional Breakdown'}
                      </h4>
                      <div className="space-y-2.5">
                        {report.matchedAspects.map((aspect, i) => (
                          <div key={i} className="text-xs">
                            <div className="flex justify-between text-stone-600 mb-1">
                              <span>{language === 'ar' ? aspect.categoryAr : aspect.category}</span>
                              <span className="font-mono tabular-nums font-semibold">{aspect.score}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#E9DDCC] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#C47D60] rounded-full transition-all duration-500"
                                style={{ width: `${aspect.score}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shared Preferences */}
                    {report.sharedPreferences.length > 0 && (
                      <div className="p-3 bg-[#697A58]/10 rounded-2xl border border-[#697A58]/20 space-y-1.5 text-xs">
                        <span className="font-bold text-[#697A58] flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'نقاط التوافق القوية' : 'Strong Shared Preferences'}</span>
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-stone-700 text-[11px]">
                          {report.sharedPreferences.map((sp, idx) => (
                            <li key={idx}>{language === 'ar' ? sp.ar : sp.en}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Potential Conflicts & Boundaries */}
                    {report.potentialConflicts.length > 0 && (
                      <div className="p-3 bg-[#C47D60]/10 rounded-2xl border border-[#C47D60]/20 space-y-1.5 text-xs">
                        <span className="font-bold text-[#C47D60] flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'نقاط تتطلب اتفاقاً مسبقاً' : 'Potential Divergences'}</span>
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-stone-700 text-[11px]">
                          {report.potentialConflicts.map((pc, idx) => (
                            <li key={idx}>{language === 'ar' ? pc.ar : pc.en}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Suggested Discussion Questions */}
                    {report.suggestedQuestions.length > 0 && (
                      <div className="p-3 bg-[#F8F4EC] rounded-2xl border border-[#E9DDCC] space-y-1.5 text-xs">
                        <span className="font-bold text-[#765541] flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-[#C47D60]" />
                          <span>{language === 'ar' ? 'أسئلة مقترحة للنقاش قبل السكن' : 'Questions to Discuss Together'}</span>
                        </span>
                        <ul className="space-y-1 text-stone-600 text-[11px]">
                          {report.suggestedQuestions.map((sq, idx) => (
                            <li key={idx}>· {language === 'ar' ? sq.ar : sq.en}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="bg-white rounded-3xl p-6 border border-[#E9DDCC] text-center text-xs text-stone-500">
                <Users className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                <p>{language === 'ar' ? 'اختر أحد المرشحين لعرض تحليل التوافق المفصل' : 'Select a candidate to view the in-depth compatibility report'}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Multi-step Lifestyle Questionnaire Form */
        <form onSubmit={handleSaveForm} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9DDCC] shadow-sm space-y-8">
          <div>
            <h2 className="text-xl font-bold font-serif text-[#34332F] mb-1">
              {language === 'ar' ? 'استبيان أسلوب الحياة والتوافق السكني' : 'Lifestyle & Living Compatibility Form'}
            </h2>
            <p className="text-xs text-stone-500">
              {language === 'ar'
                ? 'إجاباتك تساعدنا في حساب درجة التوافق بدقة وحمايتك من الخلافات اليومية في السكن.'
                : 'Your declared preferences help build transparent compatibility scores without stereotypes.'}
            </p>
          </div>

          {/* Section A: Daily Routine & Sleep (20%) */}
          <div className="space-y-4 pt-4 border-t border-[#E9DDCC]">
            <h3 className="font-bold text-sm text-[#765541] flex items-center justify-between">
              <span>A. {language === 'ar' ? 'الروتين اليومي ومواعيد النوم (الوزن: ٢٠٪)' : 'Daily Routine & Sleep (Weight: 20%)'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  {language === 'ar' ? 'موعد الاستيقاظ المعتاد' : 'Usual Waking Time'}
                </label>
                <select
                  value={formState.wakingTime}
                  onChange={(e) => setFormState({ ...formState, wakingTime: e.target.value as any })}
                  className="w-full p-2.5 bg-[#F8F4EC] border border-[#E9DDCC] rounded-xl"
                >
                  <option value="early_bird">{language === 'ar' ? 'طائر مبكر (قبل ٧ صباحاً)' : 'Early Bird (before 7 AM)'}</option>
                  <option value="moderate">{language === 'ar' ? 'متوسط (بين ٧ إلى ٩ صباحاً)' : 'Moderate (7 AM - 9 AM)'}</option>
                  <option value="night_owl">{language === 'ar' ? 'ساهر / استيقاظ متأخر' : 'Night Owl (after 10 AM)'}</option>
                  <option value="flexible">{language === 'ar' ? 'مرن حسب مواعيد المحاضرات' : 'Flexible'}</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  {language === 'ar' ? 'موعد النوم المعتاد' : 'Usual Sleeping Time'}
                </label>
                <select
                  value={formState.sleepingTime}
                  onChange={(e) => setFormState({ ...formState, sleepingTime: e.target.value as any })}
                  className="w-full p-2.5 bg-[#F8F4EC] border border-[#E9DDCC] rounded-xl"
                >
                  <option value="early">{language === 'ar' ? 'مبكر (قبل ١١ مساءً)' : 'Early (before 11 PM)'}</option>
                  <option value="moderate">{language === 'ar' ? 'معتاد (بين ١١ مساءً و١ صباحاً)' : 'Midnight (11 PM - 1 AM)'}</option>
                  <option value="late_night">{language === 'ar' ? 'سهر بعد ٢ صباحاً' : 'Late night (after 2 AM)'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section B: Cleanliness & Chores (20%) */}
          <div className="space-y-4 pt-4 border-t border-[#E9DDCC]">
            <h3 className="font-bold text-sm text-[#765541]">
              B. {language === 'ar' ? 'معايير النظافة والمهام المشتركة (الوزن: ٢٠٪)' : 'Cleanliness & Shared Chores (Weight: 20%)'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  {language === 'ar' ? 'معيارك العام لنظافة الغرفة' : 'Preferred Cleanliness Level'}
                </label>
                <select
                  value={formState.cleanlinessStandard}
                  onChange={(e) => setFormState({ ...formState, cleanlinessStandard: e.target.value as any })}
                  className="w-full p-2.5 bg-[#F8F4EC] border border-[#E9DDCC] rounded-xl"
                >
                  <option value="meticulous">{language === 'ar' ? 'دقيق جداً ومنظم يومياً' : 'Meticulous / Daily order'}</option>
                  <option value="moderate">{language === 'ar' ? 'متوسط ومريح مع تنظيف دوري' : 'Moderate / Tidy regularly'}</option>
                  <option value="relaxed">{language === 'ar' ? 'عفوي وبسيط' : 'Relaxed'}</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  {language === 'ar' ? 'تنظيف المطبخ بعد الطهي' : 'Kitchen Cleaning Expectation'}
                </label>
                <select
                  value={formState.kitchenCleanExpectation}
                  onChange={(e) => setFormState({ ...formState, kitchenCleanExpectation: e.target.value as any })}
                  className="w-full p-2.5 bg-[#F8F4EC] border border-[#E9DDCC] rounded-xl"
                >
                  <option value="immediately_after_use">{language === 'ar' ? 'مباشرة فور الانتهاء من الطهي' : 'Immediately after cooking'}</option>
                  <option value="same_day">{language === 'ar' ? 'في نفس اليوم قبل النوم' : 'Same day before bed'}</option>
                  <option value="next_morning">{language === 'ar' ? 'صباح اليوم التالي' : 'Next morning'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section C: Smoking (15%) */}
          <div className="space-y-4 pt-4 border-t border-[#E9DDCC]">
            <h3 className="font-bold text-sm text-[#765541]">
              C. {language === 'ar' ? 'التدخين وجودة الهواء (الوزن: ١٥٪)' : 'Smoking & Air Quality (Weight: 15%)'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <label className="flex items-center gap-2 p-3 bg-[#F8F4EC] rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.isSmoker}
                  onChange={(e) => setFormState({ ...formState, isSmoker: e.target.checked })}
                  className="w-4 h-4 accent-[#C47D60]"
                />
                <span className="font-medium text-[#34332F]">{language === 'ar' ? 'أنا مدخن (سجائر أو فيب)' : 'I smoke (cigarettes or vape)'}</span>
              </label>

              <label className="flex items-center gap-2 p-3 bg-[#F8F4EC] rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.comfortableWithSmokers}
                  onChange={(e) => setFormState({ ...formState, comfortableWithSmokers: e.target.checked })}
                  className="w-4 h-4 accent-[#C47D60]"
                />
                <span className="font-medium text-[#34332F]">{language === 'ar' ? 'مرتاح للعيش مع زميل مدخن في الشقة' : 'Comfortable living with a smoker'}</span>
              </label>
            </div>
          </div>

          {/* Section D: Noise & Study (15%) */}
          <div className="space-y-4 pt-4 border-t border-[#E9DDCC]">
            <h3 className="font-bold text-sm text-[#765541]">
              D. {language === 'ar' ? 'الهدوء وساعات المذاكرة (الوزن: ١٥٪)' : 'Noise & Study Habits (Weight: 15%)'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  {language === 'ar' ? 'مستوى الهدوء المطلوب' : 'Noise Tolerance in the Flat'}
                </label>
                <select
                  value={formState.noiseTolerance}
                  onChange={(e) => setFormState({ ...formState, noiseTolerance: e.target.value as any })}
                  className="w-full p-2.5 bg-[#F8F4EC] border border-[#E9DDCC] rounded-xl"
                >
                  <option value="silent_required">{language === 'ar' ? 'هدوء تام مطلوب للمذاكرة' : 'Complete silence required'}</option>
                  <option value="headphones_always">{language === 'ar' ? 'استخدام السماعات بشكل مستمر' : 'Headphones always used'}</option>
                  <option value="moderate_ok">{language === 'ar' ? 'أصوات خلفية خفيفة مقبولة' : 'Moderate background sound is fine'}</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  {language === 'ar' ? 'استقبال الضيوف' : 'Guest Frequency'}
                </label>
                <select
                  value={formState.guestFrequency}
                  onChange={(e) => setFormState({ ...formState, guestFrequency: e.target.value as any })}
                  className="w-full p-2.5 bg-[#F8F4EC] border border-[#E9DDCC] rounded-xl"
                >
                  <option value="never">{language === 'ar' ? 'ممنوع الضيوف نهائياً' : 'No guests at all'}</option>
                  <option value="rarely">{language === 'ar' ? 'نادراً جداً وبإذن مسبق' : 'Rarely with advance notice'}</option>
                  <option value="weekends_only">{language === 'ar' ? 'في عطلة نهاية الأسبوع فقط' : 'Weekends only'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-6 border-t border-[#E9DDCC] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('matches')}
              className="px-4 py-2 text-stone-500 hover:text-[#765541] text-xs font-semibold"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#765541] hover:bg-[#604230] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'ar' ? 'حفظ وتحديث ملف التوافق' : 'Save & Recalculate Matches'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
