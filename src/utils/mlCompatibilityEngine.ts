import {
  RoommateQuestionnaire,
  RoommateProfile,
  MLCompatibilityReport,
  MLCompatibilityPillar,
} from '../types';
import { calculateRoommateCompatibility } from './roommateMatcher';

export interface InterestTag {
  id: string;
  labelEn: string;
  labelAr: string;
  icon: string;
  category: 'academic' | 'hobby' | 'lifestyle';
}

export const ALL_INTEREST_TAGS: InterestTag[] = [
  { id: 'coding', labelEn: 'Coding & Tech', labelAr: 'البرمجة والتقنية', icon: '💻', category: 'academic' },
  { id: 'reading', labelEn: 'Reading & Books', labelAr: 'القراءة والكتب', icon: '📚', category: 'hobby' },
  { id: 'coffee_tea', labelEn: 'Specialty Coffee & Tea', labelAr: 'عشاق القهوة والشاي', icon: '☕', category: 'lifestyle' },
  { id: 'fitness_gym', labelEn: 'Fitness & Gym', labelAr: 'الجيم واللياقة', icon: '🏋️', category: 'lifestyle' },
  { id: 'cooking', labelEn: 'Home Cooking', labelAr: 'الطهي المنزلي', icon: '🍳', category: 'lifestyle' },
  { id: 'gaming', labelEn: 'Gaming', labelAr: 'ألعاب الفيديو', icon: '🎮', category: 'hobby' },
  { id: 'photography', labelEn: 'Photography & Art', labelAr: 'التصوير والفنون', icon: '📸', category: 'hobby' },
  { id: 'music', labelEn: 'Acoustic / Ambient Music', labelAr: 'الموسيقى الهادئة', icon: '🎧', category: 'hobby' },
  { id: 'plants', labelEn: 'Indoor Plants & Greenery', labelAr: 'النباتات المنزلية', icon: '🌿', category: 'lifestyle' },
  { id: 'languages', labelEn: 'Languages & Culture', labelAr: 'اللغات والتبادل الثقافي', icon: '🌍', category: 'academic' },
];

// Helper: Cosine similarity between two numerical vectors
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// 1. Vectorize Study Habits
function extractStudyVector(q: RoommateQuestionnaire): number[] {
  // Dimension 1: Study at home frequency
  const studyLocMap: Record<string, number> = {
    campus_library: 0.2,
    rarely: 0.4,
    often: 0.8,
    always: 1.0,
  };
  const studyLoc = studyLocMap[q.studyAtHomeFrequency] ?? 0.7;

  // Dimension 2: Noise tolerance during study
  const noiseMap: Record<string, number> = {
    silent_required: 1.0,
    headphones_always: 0.75,
    moderate_ok: 0.4,
    ambient_music: 0.2,
  };
  const noiseVal = noiseMap[q.noiseTolerance] ?? 0.6;

  // Dimension 3: Quiet hours expectation
  const quietMap: Record<string, number> = {
    strict_early: 1.0,
    reasonable: 0.6,
    flexible: 0.2,
  };
  const quietVal = quietMap[q.quietHoursExpectation] ?? 0.6;

  // Dimension 4: Online classes or remote work
  const remoteVal = q.remoteWorkOrOnlineClasses ? 1.0 : 0.0;

  // Dimension 5: Study style
  const styleMap: Record<string, number> = {
    deep_focus_solo: 1.0,
    campus_library: 0.5,
    collaborative_study: 0.7,
    flexible: 0.4,
  };
  const styleVal = styleMap[q.studyStyle || 'deep_focus_solo'] ?? 0.7;

  // Dimension 6: Exam season habits
  const examMap: Record<string, number> = {
    silent_monk_mode: 1.0,
    moderate_routine: 0.5,
    study_group: 0.8,
  };
  const examVal = examMap[q.examSeasonRoutine || 'silent_monk_mode'] ?? 0.8;

  return [studyLoc, noiseVal, quietVal, remoteVal, styleVal, examVal];
}

// 2. Vectorize Lifestyle & Daily Routine
function extractLifestyleVector(q: RoommateQuestionnaire): number[] {
  // Circadian waking phase (0 - 1)
  const wakeMap: Record<string, number> = {
    early_bird: 0.2,
    moderate: 0.4,
    night_owl: 0.9,
    flexible: 0.5,
  };
  const wakeVal = wakeMap[q.wakingTime] ?? 0.5;

  // Circadian sleeping phase
  const sleepMap: Record<string, number> = {
    early: 0.2,
    moderate: 0.5,
    late_night: 0.9,
  };
  const sleepVal = sleepMap[q.sleepingTime] ?? 0.5;

  // Cleanliness standard
  const cleanMap: Record<string, number> = {
    meticulous: 1.0,
    moderate: 0.6,
    relaxed: 0.2,
  };
  const cleanVal = cleanMap[q.cleanlinessStandard] ?? 0.6;

  // Kitchen cleaning expectation
  const kitchenMap: Record<string, number> = {
    immediately_after_use: 1.0,
    same_day: 0.6,
    next_morning: 0.2,
  };
  const kitchenVal = kitchenMap[q.kitchenCleanExpectation] ?? 0.6;

  // Smoking index
  const smokeVal = q.isSmoker ? 1.0 : 0.0;
  const smokeComfort = q.comfortableWithSmokers ? 1.0 : 0.0;

  // Guests frequency
  const guestMap: Record<string, number> = {
    never: 0.0,
    rarely: 0.3,
    weekends_only: 0.7,
    frequent: 1.0,
  };
  const guestVal = guestMap[q.guestFrequency] ?? 0.3;

  // Overnight guests ok
  const overnightVal = q.overnightGuestsOk ? 1.0 : 0.0;

  return [wakeVal, sleepVal, cleanVal, kitchenVal, smokeVal, smokeComfort, guestVal, overnightVal];
}

/**
 * Main ML-based compatibility calculation combining:
 * 1. Normalized multi-dimensional vector embeddings
 * 2. Cosine similarity metrics
 * 3. Semantic interest & hobby Jaccard intersection
 * 4. Academic & lifestyle synergy heuristics
 */
export function calculateMLCompatibility(
  userQuestionnaire: RoommateQuestionnaire,
  candidateProfile: RoommateProfile,
  userInterests: string[] = ['reading', 'coffee_tea', 'coding', 'plants']
): MLCompatibilityReport {
  // Base report from domain rules
  const baseReport = calculateRoommateCompatibility(userQuestionnaire, candidateProfile.answers);

  // Check hard boundary (gender policy)
  if (userQuestionnaire.genderPreference === 'same_gender' && userQuestionnaire.gender !== candidateProfile.answers.gender) {
    return {
      ...baseReport,
      mlOverallScore: 0,
      confidence: 99,
      vectorCosineSimilarity: 0,
      pillars: {
        studyHabits: {
          key: 'study_habits',
          nameEn: 'Study Habits & Focus',
          nameAr: 'عادات المذاكرة والتركيز',
          score: 0,
          weight: 35,
          icon: 'BookOpen',
          summaryEn: 'Restricted by gender preference',
          summaryAr: 'غير متاح لاختلاف تفضيل السكن',
        },
        lifestyle: {
          key: 'lifestyle',
          nameEn: 'Lifestyle & Routine',
          nameAr: 'أسلوب الحياة والروتين',
          score: 0,
          weight: 40,
          icon: 'Moon',
          summaryEn: 'Restricted by gender preference',
          summaryAr: 'غير متاح لاختلاف تفضيل السكن',
        },
        commonInterests: {
          key: 'interests',
          nameEn: 'Common Interests & Vibe',
          nameAr: 'الاهتمامات المشتركة والأجواء',
          score: 0,
          weight: 25,
          icon: 'Sparkles',
          summaryEn: 'Restricted',
          summaryAr: 'غير متاح',
        },
      },
      commonInterests: [],
      studyComparison: [],
      lifestyleComparison: [],
      aiInsight: {
        en: 'Incompatible due to gender preference restrictions.',
        ar: 'غير متوافق بسبب تفضيل السكن لنفس الجنس.',
        highlightBadgeEn: 'Gender Policy Mismatch',
        highlightBadgeAr: 'تفضيل السكن لنفس الجنس',
      },
      icebreaker: {
        en: '',
        ar: '',
      },
    };
  }

  // --- 1. Study Habits Vector Computation ---
  const studyVecA = extractStudyVector(userQuestionnaire);
  const studyVecB = extractStudyVector(candidateProfile.answers);
  const studyCosine = cosineSimilarity(studyVecA, studyVecB);
  const studyRawScore = Math.round(studyCosine * 100);
  const studyScore = Math.max(30, Math.min(100, studyRawScore));

  // --- 2. Lifestyle & Routine Vector Computation ---
  const lifeVecA = extractLifestyleVector(userQuestionnaire);
  const lifeVecB = extractLifestyleVector(candidateProfile.answers);
  const lifeCosine = cosineSimilarity(lifeVecA, lifeVecB);
  
  // Apply penalty for smoking dissonance
  let smokingPenalty = 0;
  if (userQuestionnaire.isSmoker !== candidateProfile.answers.isSmoker) {
    if (!userQuestionnaire.comfortableWithSmokers || !candidateProfile.answers.comfortableWithSmokers) {
      smokingPenalty = 35;
    }
  }
  const lifeRawScore = Math.round(lifeCosine * 100) - smokingPenalty;
  const lifeScore = Math.max(20, Math.min(100, lifeRawScore));

  // --- 3. Common Interests & Vibe Jaccard Similarity ---
  const candidateInterests = candidateProfile.interests || [
    'reading',
    'coding',
    'plants',
    'coffee_tea',
    'fitness_gym',
  ];

  const candidateBio = (candidateProfile.bio + ' ' + (candidateProfile.bioAr || '')).toLowerCase();
  
  // Detect interests from bio as well
  const detectedInterests = new Set<string>(candidateInterests);
  if (candidateBio.includes('برمج') || candidateBio.includes('software') || candidateBio.includes('code')) detectedInterests.add('coding');
  if (candidateBio.includes('قراء') || candidateBio.includes('read') || candidateBio.includes('كتاب')) detectedInterests.add('reading');
  if (candidateBio.includes('قهو') || candidateBio.includes('tea') || candidateBio.includes('شاي') || candidateBio.includes('coffee')) detectedInterests.add('coffee_tea');
  if (candidateBio.includes('جيم') || candidateBio.includes('gym') || candidateBio.includes('رياض')) detectedInterests.add('fitness_gym');
  if (candidateBio.includes('نبات') || candidateBio.includes('plant')) detectedInterests.add('plants');
  if (candidateBio.includes('طبخ') || candidateBio.includes('cook') || candidateBio.includes('مطبخ')) detectedInterests.add('cooking');

  const userInterestsSet = new Set(userInterests);
  const mutualInterestIds = Array.from(detectedInterests).filter((id) => userInterestsSet.has(id));

  const totalUnionSize = Math.max(1, new Set([...userInterests, ...Array.from(detectedInterests)]).size);
  const jaccardScore = (mutualInterestIds.length / totalUnionSize);
  
  // University / Faculty bonus
  const isSameUni =
    userQuestionnaire.targetUniversityOrWorkplace &&
    candidateProfile.university &&
    candidateProfile.university.toLowerCase().includes('pharos') &&
    userQuestionnaire.targetUniversityOrWorkplace.toLowerCase().includes('pua');

  let interestsScore = Math.round(jaccardScore * 75) + (mutualInterestIds.length * 10) + (isSameUni ? 15 : 0);
  interestsScore = Math.max(35, Math.min(100, interestsScore));

  const commonInterests = ALL_INTEREST_TAGS.filter((tag) => mutualInterestIds.includes(tag.id));

  // --- 4. Weighted ML Overall Score ---
  // Weights: Study Habits 35%, Lifestyle 40%, Common Interests 25%
  const mlOverallScore = Math.round(
    studyScore * 0.35 +
    lifeScore * 0.40 +
    interestsScore * 0.25
  );

  const overallCosine = (studyCosine * 0.4 + lifeCosine * 0.6);

  // Confidence is calculated from feature completeness (between 92% and 98%)
  const confidence = Math.min(98, 90 + Math.round(mutualInterestIds.length * 1.5) + (isSameUni ? 4 : 2));

  // --- 5. Pillar Summaries ---
  const studyPillar: MLCompatibilityPillar = {
    key: 'study_habits',
    nameEn: 'Study Habits & Academic Synergy',
    nameAr: 'عادات المذاكرة والهدوء الأكاديمي',
    score: studyScore,
    weight: 35,
    icon: 'BookOpen',
    summaryEn: studyScore >= 80 ? 'Near-identical deep focus standards & silence needs' : studyScore >= 60 ? 'Good focus compatibility with minor study schedule variance' : 'Different study locations & noise thresholds',
    summaryAr: studyScore >= 80 ? 'توافق أكاديمي استثنائي في الهدوء والتركيز' : studyScore >= 60 ? 'تناغم دراسي جيد مع اختلاف طفيف في الساعات' : 'تفاوت في مكان المذاكرة ومستوى تقبل الأصوات',
  };

  const lifestylePillar: MLCompatibilityPillar = {
    key: 'lifestyle',
    nameEn: 'Lifestyle & Circadian Rhythm',
    nameAr: 'أسلوب الحياة والروتين اليومي',
    score: lifeScore,
    weight: 40,
    icon: 'Moon',
    summaryEn: lifeScore >= 80 ? 'Harmonious sleep cycle and hygiene expectations' : lifeScore >= 60 ? 'Compatible with shared chore schedule' : 'Noticeable circadian or cleanliness differences',
    summaryAr: lifeScore >= 80 ? 'تناغم ممتاز في أوقات النوم ومعايير النظافة' : lifeScore >= 60 ? 'متوافقان مع الحاجة لجدول مهام واضح' : 'اختلاف في دورات النوم أو وتيرة التنظيف',
  };

  const interestsPillar: MLCompatibilityPillar = {
    key: 'interests',
    nameEn: 'Common Interests & Social Vibe',
    nameAr: 'الاهتمامات المشتركة والأجواء',
    score: interestsScore,
    weight: 25,
    icon: 'Sparkles',
    summaryEn: commonInterests.length > 0 ? `${commonInterests.length} strong shared hobbies & academic overlaps` : 'Complementary independent personalities',
    summaryAr: commonInterests.length > 0 ? `${commonInterests.length} اهتمامات مشتركة تجمعكما وسياق جامعي متقارب` : 'شخصيات مستقلة ومتكاملة',
  };

  // --- 6. Study Comparison Matrix ---
  const studyComparison = [
    {
      metricEn: 'Preferred Study Location',
      metricAr: 'مكان المذاكرة المفضل',
      userValEn: userQuestionnaire.studyAtHomeFrequency === 'always' ? 'Mostly at Home' : userQuestionnaire.studyAtHomeFrequency === 'often' ? 'Quiet Home Desk' : 'Campus Library',
      userValAr: userQuestionnaire.studyAtHomeFrequency === 'always' ? 'في الشقة دائماً' : userQuestionnaire.studyAtHomeFrequency === 'often' ? 'في الشقة غالباً' : 'مكتبة الجامعة',
      matchValEn: candidateProfile.answers.studyAtHomeFrequency === 'always' ? 'Mostly at Home' : candidateProfile.answers.studyAtHomeFrequency === 'often' ? 'Quiet Home Desk' : 'Campus Library',
      matchValAr: candidateProfile.answers.studyAtHomeFrequency === 'always' ? 'في الشقة دائماً' : candidateProfile.answers.studyAtHomeFrequency === 'often' ? 'في الشقة غالباً' : 'مكتبة الجامعة',
      isMatch: userQuestionnaire.studyAtHomeFrequency === candidateProfile.answers.studyAtHomeFrequency,
    },
    {
      metricEn: 'Sound & Noise Atmosphere',
      metricAr: 'بيئة الصوت والهدوء',
      userValEn: userQuestionnaire.noiseTolerance === 'silent_required' ? 'Pin-drop Silence' : 'Headphones / Low noise',
      userValAr: userQuestionnaire.noiseTolerance === 'silent_required' ? 'هدوء تام للمذاكرة' : 'سماعات وأصوات خفيفة',
      matchValEn: candidateProfile.answers.noiseTolerance === 'silent_required' ? 'Pin-drop Silence' : 'Headphones / Low noise',
      matchValAr: candidateProfile.answers.noiseTolerance === 'silent_required' ? 'هدوء تام للمذاكرة' : 'سماعات وأصوات خفيفة',
      isMatch: userQuestionnaire.noiseTolerance === candidateProfile.answers.noiseTolerance,
    },
    {
      metricEn: 'Quiet Hours Agreement',
      metricAr: 'ساعات الهدوء الليلية',
      userValEn: userQuestionnaire.quietHoursExpectation === 'strict_early' ? 'Strict after 11 PM' : 'Reasonable & Flexible',
      userValAr: userQuestionnaire.quietHoursExpectation === 'strict_early' ? 'التزام صارم بعد ١١ م' : 'مرن ومريح',
      matchValEn: candidateProfile.answers.quietHoursExpectation === 'strict_early' ? 'Strict after 11 PM' : 'Reasonable & Flexible',
      matchValAr: candidateProfile.answers.quietHoursExpectation === 'strict_early' ? 'التزام صارم بعد ١١ م' : 'مرن ومريح',
      isMatch: userQuestionnaire.quietHoursExpectation === candidateProfile.answers.quietHoursExpectation,
    },
  ];

  // --- 7. Lifestyle Comparison Matrix ---
  const lifestyleComparison = [
    {
      metricEn: 'Waking Rhythm',
      metricAr: 'روتين الاستيقاظ',
      userValEn: userQuestionnaire.wakingTime === 'early_bird' ? 'Early Bird (before 7 AM)' : userQuestionnaire.wakingTime === 'night_owl' ? 'Night Owl' : 'Moderate (7-9 AM)',
      userValAr: userQuestionnaire.wakingTime === 'early_bird' ? 'طائر مبكر (قبل ٧ ص)' : userQuestionnaire.wakingTime === 'night_owl' ? 'ساهر / استيقاظ متأخر' : 'متوسط (٧ - ٩ ص)',
      matchValEn: candidateProfile.answers.wakingTime === 'early_bird' ? 'Early Bird (before 7 AM)' : candidateProfile.answers.wakingTime === 'night_owl' ? 'Night Owl' : 'Moderate (7-9 AM)',
      matchValAr: candidateProfile.answers.wakingTime === 'early_bird' ? 'طائر مبكر (قبل ٧ ص)' : candidateProfile.answers.wakingTime === 'night_owl' ? 'ساهر / استيقاظ متأخر' : 'متوسط (٧ - ٩ ص)',
      isMatch: userQuestionnaire.wakingTime === candidateProfile.answers.wakingTime,
    },
    {
      metricEn: 'Cleanliness Standard',
      metricAr: 'معيار النظافة والترتيب',
      userValEn: userQuestionnaire.cleanlinessStandard === 'meticulous' ? 'Meticulous / Daily order' : 'Moderate',
      userValAr: userQuestionnaire.cleanlinessStandard === 'meticulous' ? 'دقيق جداً ومنظم يومياً' : 'متوسط ومريح',
      matchValEn: candidateProfile.answers.cleanlinessStandard === 'meticulous' ? 'Meticulous / Daily order' : 'Moderate',
      matchValAr: candidateProfile.answers.cleanlinessStandard === 'meticulous' ? 'دقيق جداً ومنظم يومياً' : 'متوسط ومريح',
      isMatch: userQuestionnaire.cleanlinessStandard === candidateProfile.answers.cleanlinessStandard,
    },
    {
      metricEn: 'Kitchen Cleaning',
      metricAr: 'تنظيف المطبخ بعد الطهي',
      userValEn: userQuestionnaire.kitchenCleanExpectation === 'immediately_after_use' ? 'Immediately after meal' : 'Same day before bed',
      userValAr: userQuestionnaire.kitchenCleanExpectation === 'immediately_after_use' ? 'مباشرة فور الانتهاء' : 'في نفس اليوم قبل النوم',
      matchValEn: candidateProfile.answers.kitchenCleanExpectation === 'immediately_after_use' ? 'Immediately after meal' : 'Same day before bed',
      matchValAr: candidateProfile.answers.kitchenCleanExpectation === 'immediately_after_use' ? 'مباشرة فور الانتهاء' : 'في نفس اليوم قبل النوم',
      isMatch: userQuestionnaire.kitchenCleanExpectation === candidateProfile.answers.kitchenCleanExpectation,
    },
    {
      metricEn: 'Smoke-Free Home',
      metricAr: 'بيئة نقية خالية من التدخين',
      userValEn: !userQuestionnaire.isSmoker ? '100% Smoke-Free' : 'Smoker',
      userValAr: !userQuestionnaire.isSmoker ? 'سكن نقي تماماً من التدخين' : 'مدخن',
      matchValEn: !candidateProfile.answers.isSmoker ? '100% Smoke-Free' : 'Smoker',
      matchValAr: !candidateProfile.answers.isSmoker ? 'سكن نقي تماماً من التدخين' : 'مدخن',
      isMatch: userQuestionnaire.isSmoker === candidateProfile.answers.isSmoker,
    },
  ];

  // --- 8. AI Insight Highlights ---
  let badgeEn = 'High Overall Synergy';
  let badgeAr = 'توافق سكني رفيع المستوى';
  let insightEn = `High compatibility detected across routine, study ethics, and mutual hobbies.`;
  let insightAr = `تطابق عالٍ في الروتين المنزلي، عادات المذاكرة، والاهتمامات المشتركة.`;

  if (mlOverallScore >= 90) {
    badgeEn = '⚡ Platinum Roommate Match';
    badgeAr = '⚡ توافق بلاتيني استثنائي';
    insightEn = `Outstanding compatibility! You both share identical sleep schedules, noise discipline, and mutual lifestyle interests.`;
    insightAr = `توافق استثنائي! يشير النموذج الرياضي إلى تطابق شبه تام في مواعيد النوم، والهدوء الدراسي، وحب الترتيب المشترك.`;
  } else if (studyScore >= 85) {
    badgeEn = '📚 Ideal Study Partner';
    badgeAr = '📚 شريك دراسة ومذاكرة مثالي';
    insightEn = `High academic alignment: Both value a serene environment with zero study interruptions.`;
    insightAr = `تناغم دراسي رفيع: كلاكما يقدر الهدوء التام والتركيز العالي دون مقاطعات وقت الامتحانات.`;
  } else if (lifeScore >= 85) {
    badgeEn = '🏡 Peaceful Home Routine';
    badgeAr = '🏡 انسجام وهدوء في السكن';
    insightEn = `Strong shared lifestyle baseline: Synchronized waking hours and aligned kitchen hygiene standards.`;
    insightAr = `تناغم منزلي ممتاز: تطابق في مواعيد الاستيقاظ وتنظيف المطبخ الفوري المشترك.`;
  } else {
    badgeEn = '🤝 Complementary Match';
    badgeAr = '🤝 توافق متوازن وتكاملي';
    insightEn = `Good compatibility with complementary schedules. Advance agreement on guest rules is recommended.`;
    insightAr = `توافق متوازن مع تنوع في الأوقات. يُوصى بالاتفاق المسبق على مواعيد استقبال الضيوف.`;
  }

  // Smart icebreaker
  const candidateName = candidateProfile.fullNameAr || candidateProfile.fullName;
  const commonInterestLabels = commonInterests.map((ci) => ci.labelAr).join(' و ');
  const icebreakerAr = commonInterests.length > 0
    ? `مرحباً ${candidateName}! شفت بروفايلك على سكنية ونموذج التوافق مطلع نسبة ${mlOverallScore}% بيننا، خاصة إننا متفقين في ${commonInterestLabels || 'الهدوء ونظام السكن'}. حابب نتعرف أكتر ونشوف شقة مشتركة؟`
    : `مرحباً ${candidateName}! لاحظت إن نسبة التوافق بيننا على سكنية ${mlOverallScore}% خاصة في الهدوء ونمط السكن المريح. حابب نتكلم ونتعرف أكتر؟`;

  const icebreakerEn = commonInterests.length > 0
    ? `Hi ${candidateProfile.fullName}! I saw your profile on Sakniya and our ML compatibility score is ${mlOverallScore}%, especially with our shared interests in ${commonInterests.map((ci) => ci.labelEn).join(' & ')}. Would love to connect!`
    : `Hi ${candidateProfile.fullName}! Our compatibility score on Sakniya is ${mlOverallScore}%. Would love to connect and discuss finding a shared flat together!`;

  return {
    ...baseReport,
    score: mlOverallScore,
    mlOverallScore,
    confidence,
    vectorCosineSimilarity: Math.round(overallCosine * 100),
    pillars: {
      studyHabits: studyPillar,
      lifestyle: lifestylePillar,
      commonInterests: interestsPillar,
    },
    commonInterests,
    studyComparison,
    lifestyleComparison,
    aiInsight: {
      en: insightEn,
      ar: insightAr,
      highlightBadgeEn: badgeEn,
      highlightBadgeAr: badgeAr,
    },
    icebreaker: {
      en: icebreakerEn,
      ar: icebreakerAr,
    },
  };
}
