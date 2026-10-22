import { RoommateQuestionnaire, CompatibilityReport } from '../types';

export function calculateRoommateCompatibility(
  userA: RoommateQuestionnaire,
  userB: RoommateQuestionnaire,
  weights = {
    routine: 0.20,
    cleanliness: 0.20,
    noise: 0.15,
    smoking: 0.15,
    guests: 0.10,
    pets: 0.10,
    kitchen: 0.05,
    communication: 0.05,
  }
): CompatibilityReport {
  const sharedPreferences: { en: string; ar: string }[] = [];
  const potentialConflicts: { en: string; ar: string }[] = [];
  const missingInformation: { en: string; ar: string }[] = [];
  const suggestedQuestions: { en: string; ar: string }[] = [];

  // Check hard constraints: Gender preference
  if (userA.genderPreference === 'same_gender' && userA.gender !== userB.gender) {
    return {
      score: 0,
      matchedAspects: [],
      sharedPreferences: [],
      potentialConflicts: [
        { en: 'Gender preference restriction (requires same gender flatmate).', ar: 'تفضيل السكن مع نفس الجنس فقط.' }
      ],
      missingInformation: [],
      suggestedQuestions: [],
    };
  }

  // 1. Routine (20%)
  let routineScore = 0;
  if (userA.wakingTime === userB.wakingTime) {
    routineScore += 50;
    sharedPreferences.push({
      en: `Both have similar waking routines (${userA.wakingTime.replace('_', ' ')}).`,
      ar: `كلاكما يستيقظ في نفس التوقيت تقريباً.`,
    });
  } else if (
    (userA.wakingTime === 'early_bird' && userB.wakingTime === 'night_owl') ||
    (userA.wakingTime === 'night_owl' && userB.wakingTime === 'early_bird')
  ) {
    routineScore += 15;
    potentialConflicts.push({
      en: 'Opposite waking hours: one is an early bird while the other is a night owl.',
      ar: 'اختلاف كبير في مواعيد الاستيقاظ (طائر مبكر مقابل ساهر).',
    });
    suggestedQuestions.push({
      en: 'How will you manage morning alarms and evening lights without disturbing each other?',
      ar: 'كيف ستنظمون المنبهات الصباحية والإضاءة الليلية دون إزعاج؟',
    });
  } else {
    routineScore += 35;
  }

  if (userA.sleepingTime === userB.sleepingTime) {
    routineScore += 50;
  } else {
    routineScore += 25;
  }

  // 2. Cleanliness & Shared Responsibilities (20%)
  let cleanScore = 0;
  if (userA.cleanlinessStandard === userB.cleanlinessStandard) {
    cleanScore += 40;
    sharedPreferences.push({
      en: `Identical cleanliness standards (${userA.cleanlinessStandard}).`,
      ar: `نفس معيار النظافة والترتيب (${userA.cleanlinessStandard === 'meticulous' ? 'دقيق جداً' : 'متوسط ومريح'}).`,
    });
  } else if (
    (userA.cleanlinessStandard === 'meticulous' && userB.cleanlinessStandard === 'relaxed') ||
    (userA.cleanlinessStandard === 'relaxed' && userB.cleanlinessStandard === 'meticulous')
  ) {
    cleanScore += 10;
    potentialConflicts.push({
      en: 'Difference in cleanliness expectations (one prefers meticulous order, one is more relaxed).',
      ar: 'تفاوت في معايير النظافة (أحدكما دقيق جداً والآخر عفوي).',
    });
    suggestedQuestions.push({
      en: 'Would you agree to a fixed weekly chore rotation or hiring a shared cleaner?',
      ar: 'هل توافقون على جدول مهام أسبوعي ثابت أو الاستعانة بمساعد نظافة أسبوعي؟',
    });
  } else {
    cleanScore += 25;
  }

  if (userA.kitchenCleanExpectation === userB.kitchenCleanExpectation) {
    cleanScore += 30;
    sharedPreferences.push({
      en: 'Agreed on kitchen cleaning habits after cooking.',
      ar: 'اتفاق تام على تنظيف المطبخ بعد إعداد الطعام.',
    });
  } else {
    cleanScore += 15;
  }

  if (userA.cleaningChoreSharing === userB.cleaningChoreSharing) {
    cleanScore += 30;
  } else {
    cleanScore += 15;
  }

  // 3. Noise and Study Habits (15%)
  let noiseScore = 0;
  if (userA.noiseTolerance === userB.noiseTolerance) {
    noiseScore += 50;
    sharedPreferences.push({
      en: 'Similar sound and noise environment preference.',
      ar: 'توافق كامل في مستوى الهدوء المطلوب أثناء المذاكرة.',
    });
  } else if (
    (userA.noiseTolerance === 'silent_required' && userB.noiseTolerance === 'ambient_music') ||
    (userA.noiseTolerance === 'ambient_music' && userB.noiseTolerance === 'silent_required')
  ) {
    noiseScore += 10;
    potentialConflicts.push({
      en: 'One requires absolute silence while the other enjoys background music/media.',
      ar: 'أحدكما يحتاج هدوءاً تاماً بينما الآخر يفضل تشغيل وسائط أو موسيقى.',
    });
    suggestedQuestions.push({
      en: 'Are headphones always agreed upon during designated study hours?',
      ar: 'هل يمكن الاتفاق على استخدام السماعات بشكل دائم أثناء ساعات المذاكرة؟',
    });
  } else {
    noiseScore += 30;
  }

  if (userA.quietHoursExpectation === userB.quietHoursExpectation) {
    noiseScore += 50;
  } else {
    noiseScore += 25;
  }

  // 4. Smoking and Air Quality (15%)
  let smokingScore = 100;
  if (userA.isSmoker !== userB.isSmoker) {
    if (!userA.comfortableWithSmokers || !userB.comfortableWithSmokers) {
      smokingScore = 10;
      potentialConflicts.push({
        en: 'Smoking incompatibility: one resident is uncomfortable living around smoking.',
        ar: 'تعارض في التدخين: أحد الطرفين يفضل بيئة خالية تماماً من التدخين.',
      });
    } else {
      smokingScore = 60;
    }
  } else if (!userA.isSmoker && !userB.isSmoker) {
    smokingScore = 100;
    sharedPreferences.push({
      en: 'Both prefer a 100% smoke-free home environment.',
      ar: 'كلاكما غير مدخن ويفضل سكناً نقياً خالياً من التدخين.',
    });
  } else {
    smokingScore = 90;
  }

  // 5. Guests and Social Life (10%)
  let guestScore = 0;
  if (userA.guestFrequency === userB.guestFrequency) {
    guestScore += 50;
    sharedPreferences.push({
      en: `Similar guest visiting preferences (${userA.guestFrequency}).`,
      ar: `توافق على وتيرة استقبال الضيوف والزيارات.`,
    });
  } else {
    guestScore += 25;
  }
  if (userA.overnightGuestsOk === userB.overnightGuestsOk) {
    guestScore += 50;
  } else {
    guestScore += 15;
    suggestedQuestions.push({
      en: 'What are your mutual rules regarding family visits or overnight friends?',
      ar: 'ما هي قواعدكم المشتركة لزيارات العائلة أو مبيت الأصدقاء؟',
    });
  }

  // 6. Pets (10%)
  let petScore = 100;
  if (userA.hasPets || userB.hasPets) {
    if (userA.petAllergies || userB.petAllergies) {
      petScore = 10;
      potentialConflicts.push({
        en: 'Pet allergy conflict with pet owner.',
        ar: 'حساسية من الحيوانات الأليفة لدى أحد الطرفين.',
      });
    } else if (!userA.comfortableWithPets || !userB.comfortableWithPets) {
      petScore = 30;
      potentialConflicts.push({
        en: 'Discomfort living with pets.',
        ar: 'عدم الارتياح للعيش مع حيوانات أليفة.',
      });
    } else {
      petScore = 90;
    }
  } else {
    petScore = 100;
  }

  // 7. Kitchen & Shared Resources (5%)
  let kitchenScore = 0;
  if (userA.cookingFrequency === userB.cookingFrequency) kitchenScore += 50;
  else kitchenScore += 30;
  if (userA.foodSharingPreference === userB.foodSharingPreference) kitchenScore += 50;
  else kitchenScore += 30;

  // 8. Communication (5%)
  let commScore = 0;
  if (userA.conflictResolutionStyle === userB.conflictResolutionStyle) {
    commScore += 50;
  } else {
    commScore += 30;
  }
  if (userA.houseRulesAgreement && userB.houseRulesAgreement) {
    commScore += 50;
    sharedPreferences.push({
      en: 'Both firmly agree on maintaining transparent written house rules.',
      ar: 'كلاكما يرحب بوضع قواعد سكن مكتوبة واضحة ومحترمة.',
    });
  }

  // Calculate final weighted score
  const totalScore = Math.round(
    routineScore * weights.routine +
    cleanScore * weights.cleanliness +
    noiseScore * weights.noise +
    smokingScore * weights.smoking +
    guestScore * weights.guests +
    petScore * weights.pets +
    kitchenScore * weights.kitchen +
    commScore * weights.communication
  );

  const matchedAspects = [
    {
      category: 'Routine & Sleep',
      categoryAr: 'الروتين والنوم',
      weight: weights.routine * 100,
      score: routineScore,
      summaryEn: routineScore > 75 ? 'Strong alignment in daily schedule' : 'Some schedule divergence',
      summaryAr: routineScore > 75 ? 'توافق قوي في أوقات النوم والاستيقاظ' : 'اختلاف بسيط في التوقيتات',
    },
    {
      category: 'Cleanliness & Chores',
      categoryAr: 'النظافة والمهام المشتركة',
      weight: weights.cleanliness * 100,
      score: cleanScore,
      summaryEn: cleanScore > 75 ? 'Shared hygiene and kitchen standards' : 'Different chore expectations',
      summaryAr: cleanScore > 75 ? 'معايير نظافة متقاربة جداً' : 'تفاوت في طريقة توزيع المهام',
    },
    {
      category: 'Noise & Study',
      categoryAr: 'الهدوء والمذاكرة',
      weight: weights.noise * 100,
      score: noiseScore,
      summaryEn: noiseScore > 75 ? 'Harmonious study atmosphere' : 'Different noise comfort levels',
      summaryAr: noiseScore > 75 ? 'بيئة دراسية متناغمة' : 'مستويات متفاوتة لتحمل الأصوات',
    },
    {
      category: 'Smoking & Air',
      categoryAr: 'التدخين والهواء',
      weight: weights.smoking * 100,
      score: smokingScore,
      summaryEn: smokingScore > 75 ? 'No smoking conflicts' : 'Smoking boundary required',
      summaryAr: smokingScore > 75 ? 'توافق تام حول التدخين' : 'يحتاج اتفاق مسبق',
    },
    {
      category: 'Guests & Social',
      categoryAr: 'الزيارات والحياة الاجتماعية',
      weight: weights.guests * 100,
      score: guestScore,
      summaryEn: guestScore > 75 ? 'Matching guest policies' : 'Different visitor expectations',
      summaryAr: guestScore > 75 ? 'توافق على وتيرة الضيوف' : 'توقعات متباينة للزيارات',
    },
    {
      category: 'Pets',
      categoryAr: 'الحيوانات الأليفة',
      weight: weights.pets * 100,
      score: petScore,
      summaryEn: petScore > 75 ? 'Compatible' : 'Pet consideration required',
      summaryAr: petScore > 75 ? 'متوافق تماماً' : 'يحتاج مراعاة للحيوانات',
    },
  ];

  return {
    score: Math.min(100, Math.max(0, totalScore)),
    matchedAspects,
    sharedPreferences,
    potentialConflicts,
    missingInformation,
    suggestedQuestions,
  };
}
