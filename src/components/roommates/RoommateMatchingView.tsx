import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoommateProfile, RoommateQuestionnaire, MLCompatibilityReport } from '../../types';
import { calculateMLCompatibility, ALL_INTEREST_TAGS } from '../../utils/mlCompatibilityEngine';
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
  BookOpen,
  Coffee,
  Moon,
  Sun,
  Brain,
  Zap,
  Copy,
  Check,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';

type SortCriteria = 'ml_score' | 'study_habits' | 'lifestyle' | 'interests';

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
  const [sortBy, setSortBy] = useState<SortCriteria>('ml_score');
  const [copiedIcebreaker, setCopiedIcebreaker] = useState(false);

  // User's questionnaire state
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
      interests: ['reading', 'plants', 'coffee_tea', 'coding'],
      studyStyle: 'deep_focus_solo',
      studyHoursDaily: 5,
      examSeasonRoutine: 'silent_monk_mode',
    }
  );

  // User's selected interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    formState.interests || ['reading', 'plants', 'coffee_tea', 'coding']
  );

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) => {
      const exists = prev.includes(interestId);
      const updated = exists ? prev.filter((id) => id !== interestId) : [...prev, interestId];
      setFormState((curr) => ({ ...curr, interests: updated }));
      return updated;
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedForm = { ...formState, interests: selectedInterests };
    saveQuestionnaire(updatedForm);
    setActiveTab('matches');
  };

  // Compute machine learning compatibility matches
  const matches = roommateProfiles.map((profile) => {
    const report: MLCompatibilityReport = calculateMLCompatibility(
      { ...formState, interests: selectedInterests },
      profile,
      selectedInterests
    );
    return {
      profile,
      report,
    };
  }).sort((a, b) => {
    if (sortBy === 'study_habits') {
      return b.report.pillars.studyHabits.score - a.report.pillars.studyHabits.score;
    }
    if (sortBy === 'lifestyle') {
      return b.report.pillars.lifestyle.score - a.report.pillars.lifestyle.score;
    }
    if (sortBy === 'interests') {
      return b.report.pillars.commonInterests.score - a.report.pillars.commonInterests.score;
    }
    return b.report.mlOverallScore - a.report.mlOverallScore;
  });

  // Effective selected profile (default to top match if not set)
  const currentSelectedProfile = selectedProfile || matches[0]?.profile;
  const currentSelectedMatch = matches.find((m) => m.profile.userId === currentSelectedProfile?.userId) || matches[0];

  const handleStartChatWithIcebreaker = (profile: RoommateProfile, icebreakerText: string) => {
    setActiveChatRecipient({
      id: profile.userId,
      name: language === 'ar' ? (profile.fullNameAr || profile.fullName) : profile.fullName,
      avatar: profile.avatar,
    });
    setActiveModal('chat');
  };

  const handleCopyIcebreaker = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIcebreaker(true);
    setTimeout(() => setCopiedIcebreaker(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Hero Header with ML Engine Highlights */}
      <div className="bg-gradient-to-r from-[#765541] via-[#5F4030] to-[#3B261A] text-[#F8F4EC] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-white/10">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#C47D60]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-[#F59E0B]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-[#F8F4EC] mb-3.5 border border-white/20 shadow-sm">
            <Brain className="w-3.5 h-3.5 text-[#FEF3C7] animate-pulse" />
            <span>{language === 'ar' ? 'محرك التوافق السكني بالذكاء الاصطناعي (ML Matching Engine)' : 'Machine Learning Compatibility Engine'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-emerald-300 font-mono">v2.4 Active</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif mb-2.5 text-white tracking-tight">
            {language === 'ar' ? 'مطابقة رفقاء السكن بنموذج التوافق الذكي' : 'AI-Powered Roommate Compatibility'}
          </h1>
          
          <p className="text-xs sm:text-sm text-[#E9DDCC] leading-relaxed mb-6 font-light">
            {language === 'ar'
              ? 'يقوم نموذج التعلّم الآلي بتحليل ومقارنة متجهات أسلوب الحياة عبر ٣ ركائز أساسية: عادات المذاكرة والهدوء (٣٥٪)، الروتين اليومي والنوم (٤٠٪)، والاهتمامات المشتركة والأجواء (٢٥٪) لإيجاد الشريك الأمثل لسكينتك.'
              : 'Our vector-similarity model compares profiles across 3 core pillars: Study Habits & Focus (35%), Lifestyle & Circadian Rhythm (40%), and Common Interests & Vibe (25%) to ensure peaceful shared living.'}
          </p>

          {/* Tab Navigation & Mode Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center p-1 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10">
              <button
                onClick={() => setActiveTab('matches')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'matches'
                    ? 'bg-white text-[#765541] shadow-md'
                    : 'text-[#E9DDCC] hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-[#C47D60]" />
                <span>{language === 'ar' ? 'المرشحون والتوافق الذكي' : 'Top AI Matches'}</span>
              </button>
              <button
                onClick={() => setActiveTab('questionnaire')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'questionnaire'
                    ? 'bg-white text-[#765541] shadow-md'
                    : 'text-[#E9DDCC] hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-[#C47D60]" />
                <span>{language === 'ar' ? 'تعديل بياناتي واهتماماتي' : 'My Preferences & Vectors'}</span>
              </button>
            </div>

            {/* Quick Summary Badge */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 bg-black/20 rounded-xl text-xs text-[#E9DDCC] border border-white/5">
              <TrendingUp className="w-3.5 h-3.5 text-[#C47D60]" />
              <span>
                {language === 'ar'
                  ? `تم العثور على ${matches.length} زملاء محتملين بدقة تنبؤ تفوق ٩٢٪`
                  : `${matches.length} candidates analyzed with >92% confidence`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'matches' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Matches List (7 Cols on large screen) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Sorting & Filter Bar */}
            <div className="bg-white dark:bg-[#24201D] rounded-2xl p-3 border border-[#E9DDCC] dark:border-[#3D352E] shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs transition-colors">
              <div className="flex items-center gap-2 font-medium text-stone-700 dark:text-stone-300">
                <Sliders className="w-3.5 h-3.5 text-[#C47D60]" />
                <span className="font-semibold">{language === 'ar' ? 'ترتيب النتائج حسب:' : 'Sort by:'}</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setSortBy('ml_score')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    sortBy === 'ml_score'
                      ? 'bg-[#C47D60] text-white shadow-sm'
                      : 'bg-[#F8F4EC] dark:bg-[#2F2925] text-stone-600 dark:text-stone-300 hover:text-[#C47D60]'
                  }`}
                >
                  {language === 'ar' ? '⚡ التوافق الإجمالي (ML Score)' : '⚡ ML Match (Default)'}
                </button>
                <button
                  onClick={() => setSortBy('study_habits')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    sortBy === 'study_habits'
                      ? 'bg-[#765541] text-white shadow-sm'
                      : 'bg-[#F8F4EC] dark:bg-[#2F2925] text-stone-600 dark:text-stone-300 hover:text-[#765541]'
                  }`}
                >
                  {language === 'ar' ? '📚 عادات المذاكرة' : '📚 Study Habits'}
                </button>
                <button
                  onClick={() => setSortBy('lifestyle')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    sortBy === 'lifestyle'
                      ? 'bg-[#765541] text-white shadow-sm'
                      : 'bg-[#F8F4EC] dark:bg-[#2F2925] text-stone-600 dark:text-stone-300 hover:text-[#765541]'
                  }`}
                >
                  {language === 'ar' ? '🏡 أسلوب الحياة' : '🏡 Lifestyle'}
                </button>
                <button
                  onClick={() => setSortBy('interests')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    sortBy === 'interests'
                      ? 'bg-[#765541] text-white shadow-sm'
                      : 'bg-[#F8F4EC] dark:bg-[#2F2925] text-stone-600 dark:text-stone-300 hover:text-[#765541]'
                  }`}
                >
                  {language === 'ar' ? '🎯 الاهتمامات' : '🎯 Interests'}
                </button>
              </div>
            </div>

            {/* List of Candidates */}
            <div className="space-y-4">
              {matches.map(({ profile, report }) => {
                const isSelected = currentSelectedProfile?.userId === profile.userId;

                return (
                  <div
                    key={profile.userId}
                    onClick={() => setSelectedProfile(profile)}
                    className={`bg-white dark:bg-[#24201D] rounded-3xl p-5 border transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg relative overflow-hidden ${
                      isSelected
                        ? 'border-[#C47D60] ring-2 ring-[#C47D60]/25 shadow-md'
                        : 'border-[#E9DDCC] dark:border-[#3D352E] hover:border-[#C47D60]/60'
                    }`}
                  >
                    {/* Top Right / Left ML Insight Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#C47D60]/10 text-[#C47D60] border border-[#C47D60]/20">
                        <Sparkles className="w-3 h-3 text-[#C47D60]" />
                        <span>{language === 'ar' ? report.aiInsight.highlightBadgeAr : report.aiInsight.highlightBadgeEn}</span>
                      </div>

                      <span className="text-[10px] text-stone-500 font-mono font-medium">
                        {language === 'ar' ? `دقة النموذج: ${report.confidence}٪` : `Model Confidence: ${report.confidence}%`}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* User Profile Info */}
                      <div className="flex items-start gap-4">
                        <div className="relative shrink-0">
                          <img
                            src={profile.avatar}
                            alt={profile.fullName}
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E9DDCC] dark:border-[#3D352E] shadow-sm"
                          />
                          {profile.isStudent && (
                            <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                              {language === 'ar' ? 'طالب' : 'Student'}
                            </span>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-[#34332F] dark:text-[#EDE6DE]">
                              {language === 'ar' ? profile.fullNameAr || profile.fullName : profile.fullName}
                            </h3>
                            <span className="text-[10px] text-[#765541] dark:text-[#D18E74] bg-[#765541]/10 px-2 py-0.5 rounded-full font-semibold">
                              {profile.faculty || profile.university}
                            </span>
                          </div>
                          
                          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                            {language === 'ar' ? profile.bioAr || profile.bio : profile.bio}
                          </p>

                          {/* Highlighted Common Interests Chips */}
                          {report.commonInterests.length > 0 && (
                            <div className="mt-3 flex flex-wrap items-center gap-1.5">
                              <span className="text-[10px] font-semibold text-stone-500">
                                {language === 'ar' ? 'اهتمامات مشتركة:' : 'Common:'}
                              </span>
                              {report.commonInterests.map((interest) => (
                                <span
                                  key={interest.id}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#697A58]/10 text-[#697A58] dark:text-[#A1B88D] rounded-lg text-[10px] font-semibold border border-[#697A58]/20"
                                >
                                  <span>{interest.icon}</span>
                                  <span>{language === 'ar' ? interest.labelAr : interest.labelEn}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Radial / Score Pill */}
                      <div className="flex sm:flex-col items-center justify-between sm:justify-center border-t sm:border-t-0 sm:border-l rtl:sm:border-l-0 rtl:sm:border-r border-[#E9DDCC] dark:border-[#3D352E] pt-3 sm:pt-0 sm:px-5 shrink-0">
                        <div className="text-center">
                          <div className="relative inline-flex items-center justify-center">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F8F4EC] to-[#EFE7DC] dark:from-[#2F2925] dark:to-[#1E1A18] border border-[#E9DDCC] dark:border-[#3D352E] flex flex-col items-center justify-center shadow-inner">
                              <span className="text-2xl font-black font-mono text-[#C47D60] leading-none tabular-nums">
                                {report.mlOverallScore}%
                              </span>
                              <span className="text-[9px] text-[#765541] dark:text-[#E9DDCC] font-bold tracking-tight mt-0.5 uppercase">
                                {language === 'ar' ? 'توافق ML' : 'ML Match'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3 Pillar Mini Breakdown Progress Bars */}
                    <div className="mt-4 pt-3.5 border-t border-[#E9DDCC]/70 dark:border-[#3D352E]/70 grid grid-cols-3 gap-3 text-xs">
                      {/* Study Habits */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-400 font-medium">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-[#765541]" />
                            <span>{language === 'ar' ? 'المذاكرة' : 'Study'}</span>
                          </span>
                          <span className="font-mono font-bold text-[#765541] dark:text-[#D18E74]">
                            {report.pillars.studyHabits.score}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-[#E9DDCC]/60 dark:bg-stone-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#765541] dark:bg-[#C47D60] rounded-full transition-all duration-500"
                            style={{ width: `${report.pillars.studyHabits.score}%` }}
                          />
                        </div>
                      </div>

                      {/* Lifestyle */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Moon className="w-3 h-3 text-[#C47D60]" />
                            <span>{language === 'ar' ? 'الروتين' : 'Lifestyle'}</span>
                          </span>
                          <span className="font-mono font-bold text-[#C47D60]">
                            {report.pillars.lifestyle.score}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-[#E9DDCC]/60 dark:bg-stone-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#C47D60] rounded-full transition-all duration-500"
                            style={{ width: `${report.pillars.lifestyle.score}%` }}
                          />
                        </div>
                      </div>

                      {/* Common Interests */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#697A58]" />
                            <span>{language === 'ar' ? 'الاهتمامات' : 'Interests'}</span>
                          </span>
                          <span className="font-mono font-bold text-[#697A58] dark:text-[#A1B88D]">
                            {report.pillars.commonInterests.score}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-[#E9DDCC]/60 dark:bg-stone-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#697A58] dark:bg-[#8CA278] rounded-full transition-all duration-500"
                            style={{ width: `${report.pillars.commonInterests.score}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-4 pt-3 border-t border-[#E9DDCC]/50 dark:border-[#3D352E]/50 flex items-center justify-between gap-2">
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 italic">
                        {language === 'ar' ? report.aiInsight.ar : report.aiInsight.en}
                      </p>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProfile(profile);
                          }}
                          className="px-3 py-1.5 bg-[#F8F4EC] dark:bg-[#2F2925] hover:bg-[#E9DDCC] text-stone-700 dark:text-stone-200 rounded-xl text-xs font-semibold transition-colors border border-[#E9DDCC] dark:border-[#3D352E]"
                        >
                          {language === 'ar' ? 'التقرير المفصل' : 'Details'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartChatWithIcebreaker(profile, language === 'ar' ? report.icebreaker.ar : report.icebreaker.en);
                          }}
                          className="px-3.5 py-1.5 bg-[#765541] hover:bg-[#604230] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'محادثة' : 'Chat'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* In-Depth Compatibility Report Drawer (5 Cols on large screen) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm text-[#765541] dark:text-[#EDE6DE] font-serif flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-[#C47D60]" />
                <span>{language === 'ar' ? 'تقرير التوافق والخوارزمية الذكية' : 'Deep ML Comparison Report'}</span>
              </h2>
              <span className="text-xs text-stone-500">
                {language === 'ar' ? 'مقارنة حية' : 'Live Analysis'}
              </span>
            </div>

            {currentSelectedMatch ? (
              <div className="bg-white dark:bg-[#24201D] rounded-3xl p-6 border border-[#E9DDCC] dark:border-[#3D352E] shadow-md space-y-6 transition-colors">
                
                {/* Candidate Header */}
                <div className="text-center pb-4 border-b border-[#E9DDCC] dark:border-[#3D352E]">
                  <div className="relative inline-block mb-3">
                    <img
                      src={currentSelectedMatch.profile.avatar}
                      alt={currentSelectedMatch.profile.fullName}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-[#C47D60] shadow-md"
                    />
                    <div className="absolute -bottom-2 inset-x-0 mx-auto w-max px-2.5 py-0.5 rounded-full bg-[#765541] text-white text-[10px] font-bold shadow-sm">
                      {language === 'ar' ? 'المرشح المحدد' : 'Selected'}
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-[#34332F] dark:text-[#EDE6DE]">
                    {language === 'ar' ? currentSelectedMatch.profile.fullNameAr || currentSelectedMatch.profile.fullName : currentSelectedMatch.profile.fullName}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {currentSelectedMatch.profile.university} · {currentSelectedMatch.profile.faculty}
                  </p>

                  {/* ML Overall Score Banner */}
                  <div className="mt-3 p-3 bg-gradient-to-r from-[#F8F4EC] to-[#EFE7DC] dark:from-[#2F2925] dark:to-[#1E1A18] rounded-2xl border border-[#E9DDCC] dark:border-[#3D352E] flex items-center justify-around">
                    <div>
                      <div className="text-3xl font-black font-mono text-[#C47D60] tabular-nums">
                        {currentSelectedMatch.report.mlOverallScore}%
                      </div>
                      <span className="text-[10px] font-bold text-stone-500 block uppercase">
                        {language === 'ar' ? 'نسبة التوافق الذكي' : 'Overall ML Match'}
                      </span>
                    </div>

                    <div className="h-8 w-px bg-stone-300 dark:bg-stone-700" />

                    <div>
                      <div className="text-2xl font-bold font-mono text-[#765541] dark:text-[#EDE6DE] tabular-nums">
                        {currentSelectedMatch.report.confidence}%
                      </div>
                      <span className="text-[10px] font-bold text-stone-500 block uppercase">
                        {language === 'ar' ? 'دقة التنبؤ' : 'Confidence'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3 Pillars Deep Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase text-[#765541] dark:text-[#EDE6DE] tracking-wide flex items-center justify-between">
                    <span>{language === 'ar' ? 'الركائز الثلاث للتوافق' : 'Three Core Pillars'}</span>
                    <span className="text-[10px] text-stone-400 font-normal">Weights: 35% · 40% · 25%</span>
                  </h4>

                  {/* Pillar 1: Study Habits */}
                  <div className="p-3 bg-[#F8F4EC] dark:bg-[#2F2925] rounded-2xl border border-[#E9DDCC] dark:border-[#3D352E] space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#765541] dark:text-[#EDE6DE]">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-[#C47D60]" />
                        <span>{language === 'ar' ? currentSelectedMatch.report.pillars.studyHabits.nameAr : currentSelectedMatch.report.pillars.studyHabits.nameEn}</span>
                      </span>
                      <span className="font-mono text-sm font-bold text-[#C47D60]">
                        {currentSelectedMatch.report.pillars.studyHabits.score}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C47D60] rounded-full"
                        style={{ width: `${currentSelectedMatch.report.pillars.studyHabits.score}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">
                      {language === 'ar' ? currentSelectedMatch.report.pillars.studyHabits.summaryAr : currentSelectedMatch.report.pillars.studyHabits.summaryEn}
                    </p>
                  </div>

                  {/* Pillar 2: Lifestyle & Routine */}
                  <div className="p-3 bg-[#F8F4EC] dark:bg-[#2F2925] rounded-2xl border border-[#E9DDCC] dark:border-[#3D352E] space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#765541] dark:text-[#EDE6DE]">
                      <span className="flex items-center gap-1.5">
                        <Moon className="w-4 h-4 text-[#765541]" />
                        <span>{language === 'ar' ? currentSelectedMatch.report.pillars.lifestyle.nameAr : currentSelectedMatch.report.pillars.lifestyle.nameEn}</span>
                      </span>
                      <span className="font-mono text-sm font-bold text-[#765541] dark:text-[#EDE6DE]">
                        {currentSelectedMatch.report.pillars.lifestyle.score}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#765541] dark:bg-[#D18E74] rounded-full"
                        style={{ width: `${currentSelectedMatch.report.pillars.lifestyle.score}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">
                      {language === 'ar' ? currentSelectedMatch.report.pillars.lifestyle.summaryAr : currentSelectedMatch.report.pillars.lifestyle.summaryEn}
                    </p>
                  </div>

                  {/* Pillar 3: Common Interests & Vibe */}
                  <div className="p-3 bg-[#F8F4EC] dark:bg-[#2F2925] rounded-2xl border border-[#E9DDCC] dark:border-[#3D352E] space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#697A58] dark:text-[#A1B88D]">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#697A58]" />
                        <span>{language === 'ar' ? currentSelectedMatch.report.pillars.commonInterests.nameAr : currentSelectedMatch.report.pillars.commonInterests.nameEn}</span>
                      </span>
                      <span className="font-mono text-sm font-bold text-[#697A58] dark:text-[#A1B88D]">
                        {currentSelectedMatch.report.pillars.commonInterests.score}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#697A58] dark:bg-[#A1B88D] rounded-full"
                        style={{ width: `${currentSelectedMatch.report.pillars.commonInterests.score}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">
                      {language === 'ar' ? currentSelectedMatch.report.pillars.commonInterests.summaryAr : currentSelectedMatch.report.pillars.commonInterests.summaryEn}
                    </p>
                  </div>
                </div>

                {/* Side-by-Side Study Habits & Lifestyle Comparison */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase text-[#765541] dark:text-[#EDE6DE] tracking-wide">
                    {language === 'ar' ? 'مقارنة تفصيلية جنباً إلى جنب' : 'Side-by-Side Preferences'}
                  </h4>

                  <div className="border border-[#E9DDCC] dark:border-[#3D352E] rounded-2xl overflow-hidden divide-y divide-[#E9DDCC] dark:divide-[#3D352E] text-xs">
                    {/* Header */}
                    <div className="bg-[#F8F4EC] dark:bg-[#2F2925] p-2.5 font-bold flex justify-between text-stone-600 dark:text-stone-300">
                      <span>{language === 'ar' ? 'المعيار' : 'Metric'}</span>
                      <span className="text-[#C47D60]">{language === 'ar' ? 'أنت مقابل المرشح' : 'You vs Match'}</span>
                    </div>

                    {/* Study Habit rows */}
                    {currentSelectedMatch.report.studyComparison.map((row, idx) => (
                      <div key={idx} className="p-2.5 flex items-center justify-between gap-2">
                        <span className="font-medium text-stone-700 dark:text-stone-300">
                          {language === 'ar' ? row.metricAr : row.metricEn}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span className={`px-2 py-0.5 rounded-md font-semibold ${row.isMatch ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}`}>
                            {language === 'ar' ? row.matchValAr : row.matchValEn}
                          </span>
                          {row.isMatch && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                        </div>
                      </div>
                    ))}

                    {/* Lifestyle rows */}
                    {currentSelectedMatch.report.lifestyleComparison.map((row, idx) => (
                      <div key={`life-${idx}`} className="p-2.5 flex items-center justify-between gap-2">
                        <span className="font-medium text-stone-700 dark:text-stone-300">
                          {language === 'ar' ? row.metricAr : row.metricEn}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span className={`px-2 py-0.5 rounded-md font-semibold ${row.isMatch ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'}`}>
                            {language === 'ar' ? row.matchValAr : row.matchValEn}
                          </span>
                          {row.isMatch && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Personalized Icebreaker Card */}
                <div className="p-4 bg-gradient-to-br from-[#765541]/10 via-[#C47D60]/10 to-transparent rounded-2xl border border-[#C47D60]/30 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#765541] dark:text-[#EDE6DE] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#C47D60]" />
                      <span>{language === 'ar' ? 'رسالة بدء التعارف المقترحة ذكياً' : 'AI Icebreaker Prompt'}</span>
                    </span>
                    <button
                      onClick={() => handleCopyIcebreaker(language === 'ar' ? currentSelectedMatch.report.icebreaker.ar : currentSelectedMatch.report.icebreaker.en)}
                      className="text-stone-500 hover:text-[#765541] flex items-center gap-1 text-[11px] font-semibold"
                    >
                      {copiedIcebreaker ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">{language === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'نسخ' : 'Copy'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="p-3 bg-white dark:bg-[#1E1A18] rounded-xl border border-[#E9DDCC] dark:border-[#3D352E] text-stone-700 dark:text-stone-300 text-[11px] leading-relaxed italic">
                    "{language === 'ar' ? currentSelectedMatch.report.icebreaker.ar : currentSelectedMatch.report.icebreaker.en}"
                  </p>

                  <button
                    onClick={() => handleStartChatWithIcebreaker(currentSelectedMatch.profile, language === 'ar' ? currentSelectedMatch.report.icebreaker.ar : currentSelectedMatch.report.icebreaker.en)}
                    className="w-full py-2.5 bg-[#765541] hover:bg-[#604230] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-colors text-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{language === 'ar' ? 'إرسال هذه الرسالة وبدء المحادثة' : 'Send Icebreaker & Open Chat'}</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        /* Multi-step Lifestyle & ML Vector Questionnaire Form */
        <form onSubmit={handleSaveForm} className="bg-white dark:bg-[#24201D] rounded-3xl p-6 sm:p-8 border border-[#E9DDCC] dark:border-[#3D352E] shadow-sm space-y-8 transition-colors">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C47D60]/10 rounded-full text-xs font-semibold text-[#C47D60] mb-2">
              <Brain className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تدريب متجهات التوافق الشخصية' : 'Personal ML Feature Calibration'}</span>
            </div>
            <h2 className="text-xl font-bold font-serif text-[#34332F] dark:text-[#EDE6DE] mb-1">
              {language === 'ar' ? 'استبيان أسلوب الحياة، عادات المذاكرة، والاهتمامات المشتركة' : 'Lifestyle, Study Habits & Interests Questionnaire'}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {language === 'ar'
                ? 'إجاباتك هنا تتحول إلى متجهات رياضية لمطابقتها مع بقية الطلاب والباحثين عن سكن مشترك بأعلى دقة ممكنة.'
                : 'Your preferences are encoded into numerical vectors for high-precision cosine similarity matching.'}
            </p>
          </div>

          {/* Section 1: Common Interests & Hobbies (ML Feature Pillar 3) */}
          <div className="space-y-4 pt-4 border-t border-[#E9DDCC] dark:border-[#3D352E]">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#765541] dark:text-[#EDE6DE] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C47D60]" />
                <span>{language === 'ar' ? '١. الاهتمامات المشتركة والأجواء المفضلة (الوزن: ٢٥٪)' : '1. Common Interests & Vibe (Weight: 25%)'}</span>
              </h3>
              <span className="text-[11px] text-stone-400">
                {selectedInterests.length} {language === 'ar' ? 'محددة' : 'selected'}
              </span>
            </div>
            <p className="text-xs text-stone-500">
              {language === 'ar' ? 'اختر الاهتمامات التي تميزك للبحث عن شركاء سكن يشاركونك نفس الشغف والأجواء:' : 'Select topics you enjoy to match with compatible roommates:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_INTEREST_TAGS.map((tag) => {
                const isSelected = selectedInterests.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleInterest(tag.id)}
                    className={`px-3 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                      isSelected
                        ? 'bg-[#C47D60] text-white border-[#C47D60] shadow-sm scale-105'
                        : 'bg-[#F8F4EC] dark:bg-[#2F2925] text-stone-700 dark:text-stone-300 border-[#E9DDCC] dark:border-[#3D352E] hover:border-[#C47D60]'
                    }`}
                  >
                    <span>{tag.icon}</span>
                    <span>{language === 'ar' ? tag.labelAr : tag.labelEn}</span>
                    {isSelected && <Check className="w-3 h-3 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Study Habits & Focus (ML Feature Pillar 1) */}
          <div className="space-y-4 pt-4 border-t border-[#E9DDCC] dark:border-[#3D352E]">
            <h3 className="font-bold text-sm text-[#765541] dark:text-[#EDE6DE] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#C47D60]" />
              <span>{language === 'ar' ? '٢. عادات المذاكرة والهدوء الأكاديمي (الوزن: ٣٥٪)' : '2. Study Habits & Academic Focus (Weight: 35%)'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-600 dark:text-stone-400 font-semibold mb-1">
                  {language === 'ar' ? 'أسلوب المذاكرة المفضل' : 'Preferred Study Style'}
                </label>
                <select
                  value={formState.studyStyle || 'deep_focus_solo'}
                  onChange={(e) => setFormState({ ...formState, studyStyle: e.target.value as any })}
                  className="w-full p-2.5 bg-[#F8F4EC] dark:bg-[#2F2925] border border-[#E9DDCC] dark:border-[#3D352E] rounded-xl text-stone-800 dark:text-stone-200"
                >
                  <option value="deep_focus_solo">{language === 'ar' ? 'مذاكرة فردية بتركيز عميق وهدوء تام' : 'Deep Focus Solo in Silence'}</option>
                  <option value="campus_library">{language === 'ar' ? 'أفضل مكتبة الجامعة أو مقاهي المذاكرة' : 'Campus Library or Study Cafes'}</option>
                  <option value="collaborative_study">{language === 'ar' ? 'مذاكرة تشاركية وتبادل مذكرات' : 'Collaborative Study with Flatmate'}</option>
                  <option value="flexible">{language === 'ar' ? 'مرن حسب مادة الدراسة' : 'Flexible'}</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-400 font-semibold mb-1">
                  {language === 'ar' ? 'الروتين أثناء فترة الامتحانات (Exam Season)' : 'Exam Season Atmosphere'}
                </label>
                <select
                  value={formState.examSeasonRoutine || 'silent_monk_mode'}
                  onChange={(e) => setFormState({ ...formState, examSeasonRoutine: e.target.value as any })}
                  className="w-full p-2.5 bg-[#F8F4EC] dark:bg-[#2F2925] border border-[#E9DDCC] dark:border-[#3D352E] rounded-xl text-stone-800 dark:text-stone-200"
                >
                  <option value="silent_monk_mode">{language === 'ar' ? 'وضع الهدوء الصارم (Monk Mode) بدون أي إزعاج' : 'Silent Monk Mode (Zero Distractions)'}</option>
                  <option value="moderate_routine">{language === 'ar' ? 'روتين معتاد مع فترات راحة' : 'Moderate Routine with Breaks'}</option>
                  <option value="study_group">{language === 'ar' ? 'مجموعات مراجعة مشتركة' : 'Study Group Reviews'}</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-400 font-semibold mb-1">
                  {language === 'ar' ? 'مستوى الهدوء المطلوب في الشقة' : 'Noise Tolerance in Flat'}
                </label>
                <select
                  value={formState.noiseTolerance}
                  onChange={(e) => setFormState({ ...formState, noiseTolerance: e.target.value as any })}
                  className="w-full p-2.5 bg-[#F8F4EC] dark:bg-[#2F2925] border border-[#E9DDCC] dark:border-[#3D352E] rounded-xl text-stone-800 dark:text-stone-200"
                >
                  <option value="silent_required">{language === 'ar' ? 'هدوء تام مطلوب للمذاكرة' : 'Complete silence required'}</option>
                  <option value="headphones_always">{language === 'ar' ? 'استخدام السماعات بشكل مستمر' : 'Headphones always used'}</option>
                  <option value="moderate_ok">{language === 'ar' ? 'أصوات خلفية خفيفة مقبولة' : 'Moderate background sound is fine'}</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-400 font-semibold mb-1">
                  {language === 'ar' ? 'ساعات الهدوء الليلية' : 'Quiet Hours Expectation'}
                </label>
                <select
                  value={formState.quietHoursExpectation}
                  onChange={(e) => setFormState({ ...formState, quietHoursExpectation: e.target.value as any })}
                  className="w-full p-2.5 bg-[#F8F4EC] dark:bg-[#2F2925] border border-[#E9DDCC] dark:border-[#3D352E] rounded-xl text-stone-800 dark:text-stone-200"
                >
                  <option value="strict_early">{language === 'ar' ? 'التزام صارم بالهدوء بعد ١١ مساءً' : 'Strict early after 11 PM'}</option>
                  <option value="reasonable">{language === 'ar' ? 'معقول ومريح (بعد ١٢ ليلاً)' : 'Reasonable (after midnight)'}</option>
                  <option value="flexible">{language === 'ar' ? 'مرن' : 'Flexible'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Lifestyle, Sleep & Routine (ML Feature Pillar 2) */}
          <div className="space-y-4 pt-4 border-t border-[#E9DDCC] dark:border-[#3D352E]">
            <h3 className="font-bold text-sm text-[#765541] dark:text-[#EDE6DE] flex items-center gap-2">
              <Moon className="w-4 h-4 text-[#C47D60]" />
              <span>{language === 'ar' ? '٣. الروتين اليومي والنظافة المشتركة (الوزن: ٤٠٪)' : '3. Lifestyle, Sleep & Hygiene (Weight: 40%)'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-600 dark:text-stone-400 font-semibold mb-1">
                  {language === 'ar' ? 'موعد الاستيقاظ المعتاد' : 'Usual Waking Time'}
                </label>
                <select
                  value={formState.wakingTime}
                  onChange={(e) => setFormState({ ...formState, wakingTime: e.target.value as any })}
                  className="w-full p-2.5 bg-[#F8F4EC] dark:bg-[#2F2925] border border-[#E9DDCC] dark:border-[#3D352E] rounded-xl text-stone-800 dark:text-stone-200"
                >
                  <option value="early_bird">{language === 'ar' ? 'طائر مبكر (قبل ٧ صباحاً)' : 'Early Bird (before 7 AM)'}</option>
                  <option value="moderate">{language === 'ar' ? 'متوسط (بين ٧ إلى ٩ صباحاً)' : 'Moderate (7 AM - 9 AM)'}</option>
                  <option value="night_owl">{language === 'ar' ? 'ساهر / استيقاظ متأخر' : 'Night Owl (after 10 AM)'}</option>
                  <option value="flexible">{language === 'ar' ? 'مرن حسب مواعيد المحاضرات' : 'Flexible'}</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-400 font-semibold mb-1">
                  {language === 'ar' ? 'موعد النوم المعتاد' : 'Usual Sleeping Time'}
                </label>
                <select
                  value={formState.sleepingTime}
                  onChange={(e) => setFormState({ ...formState, sleepingTime: e.target.value as any })}
                  className="w-full p-2.5 bg-[#F8F4EC] dark:bg-[#2F2925] border border-[#E9DDCC] dark:border-[#3D352E] rounded-xl text-stone-800 dark:text-stone-200"
                >
                  <option value="early">{language === 'ar' ? 'مبكر (قبل ١١ مساءً)' : 'Early (before 11 PM)'}</option>
                  <option value="moderate">{language === 'ar' ? 'معتاد (بين ١١ مساءً و١ صباحاً)' : 'Midnight (11 PM - 1 AM)'}</option>
                  <option value="late_night">{language === 'ar' ? 'سهر بعد ٢ صباحاً' : 'Late night (after 2 AM)'}</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-400 font-semibold mb-1">
                  {language === 'ar' ? 'معيارك العام لنظافة الشقة' : 'Preferred Cleanliness Level'}
                </label>
                <select
                  value={formState.cleanlinessStandard}
                  onChange={(e) => setFormState({ ...formState, cleanlinessStandard: e.target.value as any })}
                  className="w-full p-2.5 bg-[#F8F4EC] dark:bg-[#2F2925] border border-[#E9DDCC] dark:border-[#3D352E] rounded-xl text-stone-800 dark:text-stone-200"
                >
                  <option value="meticulous">{language === 'ar' ? 'دقيق جداً ومنظم يومياً' : 'Meticulous / Daily order'}</option>
                  <option value="moderate">{language === 'ar' ? 'متوسط ومريح مع تنظيف دوري' : 'Moderate / Tidy regularly'}</option>
                  <option value="relaxed">{language === 'ar' ? 'عفوي وبسيط' : 'Relaxed'}</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-400 font-semibold mb-1">
                  {language === 'ar' ? 'تنظيف المطبخ بعد الطهي' : 'Kitchen Cleaning Expectation'}
                </label>
                <select
                  value={formState.kitchenCleanExpectation}
                  onChange={(e) => setFormState({ ...formState, kitchenCleanExpectation: e.target.value as any })}
                  className="w-full p-2.5 bg-[#F8F4EC] dark:bg-[#2F2925] border border-[#E9DDCC] dark:border-[#3D352E] rounded-xl text-stone-800 dark:text-stone-200"
                >
                  <option value="immediately_after_use">{language === 'ar' ? 'مباشرة فور الانتهاء من الطهي' : 'Immediately after cooking'}</option>
                  <option value="same_day">{language === 'ar' ? 'في نفس اليوم قبل النوم' : 'Same day before bed'}</option>
                  <option value="next_morning">{language === 'ar' ? 'صباح اليوم التالي' : 'Next morning'}</option>
                </select>
              </div>
            </div>

            {/* Smoking Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <label className="flex items-center gap-2 p-3 bg-[#F8F4EC] dark:bg-[#2F2925] rounded-xl cursor-pointer border border-[#E9DDCC] dark:border-[#3D352E]">
                <input
                  type="checkbox"
                  checked={formState.isSmoker}
                  onChange={(e) => setFormState({ ...formState, isSmoker: e.target.checked })}
                  className="w-4 h-4 accent-[#C47D60]"
                />
                <span className="font-medium text-[#34332F] dark:text-[#EDE6DE]">
                  {language === 'ar' ? 'أنا مدخن (سجائر أو فيب)' : 'I smoke (cigarettes or vape)'}
                </span>
              </label>

              <label className="flex items-center gap-2 p-3 bg-[#F8F4EC] dark:bg-[#2F2925] rounded-xl cursor-pointer border border-[#E9DDCC] dark:border-[#3D352E]">
                <input
                  type="checkbox"
                  checked={formState.comfortableWithSmokers}
                  onChange={(e) => setFormState({ ...formState, comfortableWithSmokers: e.target.checked })}
                  className="w-4 h-4 accent-[#C47D60]"
                />
                <span className="font-medium text-[#34332F] dark:text-[#EDE6DE]">
                  {language === 'ar' ? 'مرتاح للعيش مع زميل مدخن في الشقة' : 'Comfortable living with a smoker'}
                </span>
              </label>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-6 border-t border-[#E9DDCC] dark:border-[#3D352E] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('matches')}
              className="px-4 py-2 text-stone-500 hover:text-[#765541] text-xs font-semibold"
            >
              {language === 'ar' ? 'إلغاء والعودة' : 'Cancel & Back'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#765541] hover:bg-[#604230] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'ar' ? 'حفظ وإعادة تدريب نموذج التوافق' : 'Save & Retrain ML Matching Model'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
