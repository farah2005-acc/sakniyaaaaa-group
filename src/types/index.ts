export type UserRole = 'tenant' | 'owner' | 'admin';

export type Language = 'ar' | 'en';

export interface User {
  id: string;
  name: string;
  nameAr?: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  isVerified: boolean;
  university?: string;
  faculty?: string;
  workplace?: string;
  verificationDocsSubmitted?: boolean;
  password?: string;
  bio?: string;
  bioAr?: string;
  rating?: number;
  reviewsCount?: number;
}

export type PropertyType = 'apartment' | 'private_room' | 'shared_room' | 'studio' | 'student_residence';

export type LeaseDurationType = 'daily' | 'monthly' | 'semester' | 'annual';

export interface PropertyRoom {
  id: string;
  name: string;
  nameAr: string;
  type: 'private' | 'shared';
  bedsCount: number;
  availableBeds: number;
  monthlyPrice: number;
  privateBathroom: boolean;
  hasAC: boolean;
  hasBalcony: boolean;
}

export interface Amenity {
  id: string;
  labelEn: string;
  labelAr: string;
  iconName: string;
}

export interface HouseRules {
  smokingAllowed: boolean;
  petsAllowed: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  guestsAllowed: boolean;
  overnightGuestsAllowed: boolean;
  cleaningSchedule: string;
  genderPolicy: 'any' | 'male_only' | 'female_only';
  customRules?: string[];
}

export interface PropertyLocation {
  governorate: string;
  governorateAr: string;
  city: string;
  cityAr: string;
  neighborhood: string;
  neighborhoodAr: string;
  streetApprox: string;
  streetApproxAr: string;
  lat: number;
  lng: number;
  nearbyUniversities: {
    universityId: string;
    nameEn: string;
    nameAr: string;
    walkingMinutes: number;
    drivingMinutes: number;
    transitMinutes: number;
  }[];
}

export interface PropertyListing {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  propertyType: PropertyType;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerPhone: string;
  ownerVerified: boolean;
  location: PropertyLocation;
  images: string[];
  coverImage: string;
  monthlyPrice: number;
  depositAmount: number;
  shortStayDailyPrice?: number;
  utilitiesIncluded: boolean;
  estimatedUtilitiesMonthly: number;
  totalBedrooms: number;
  availableBedrooms: number;
  totalBathrooms: number;
  isBathroomPrivate: boolean;
  hasAC: boolean;
  hasWifi: boolean;
  hasKitchen: boolean;
  hasElevator: boolean;
  hasWashingMachine: boolean;
  hasBalcony: boolean;
  amenities: string[];
  houseRules: HouseRules;
  rooms: PropertyRoom[];
  availableFrom: string;
  minimumStayMonths: number;
  status: 'pending_approval' | 'published' | 'paused' | 'rejected';
  viewsCount: number;
  savesCount: number;
  rating: number;
  reviewsCount: number;
  featured?: boolean;
}

export interface UniversityCampus {
  id: string;
  nameEn: string;
  nameAr: string;
  institutionType: 'public' | 'private' | 'national' | 'technological';
  governorate: string;
  governorateAr: string;
  city: string;
  cityAr: string;
  lat: number;
  lng: number;
  website?: string;
}

export interface RoommateQuestionnaire {
  // Routine (20%)
  wakingTime: 'early_bird' | 'moderate' | 'night_owl' | 'flexible';
  sleepingTime: 'early' | 'moderate' | 'late_night';
  studyAtHomeFrequency: 'always' | 'often' | 'rarely' | 'campus_library';
  timeSpentAtHome: 'mostly_home' | 'half_day' | 'evening_only';
  
  // Cleanliness (20%)
  cleanlinessStandard: 'meticulous' | 'moderate' | 'relaxed';
  cleaningChoreSharing: 'strict_schedule' | 'take_turns' | 'hire_cleaner' | 'clean_own_mess';
  kitchenCleanExpectation: 'immediately_after_use' | 'same_day' | 'next_morning';
  bathroomCleanFrequency: 'daily' | 'twice_weekly' | 'weekly';

  // Smoking (15%)
  isSmoker: boolean;
  comfortableWithSmokers: boolean;
  smokingInsideAllowed: boolean;

  // Noise & Study (15%)
  noiseTolerance: 'silent_required' | 'moderate_ok' | 'headphones_always' | 'ambient_music';
  quietHoursExpectation: 'strict_early' | 'reasonable' | 'flexible';
  remoteWorkOrOnlineClasses: boolean;

  // Guests (10%)
  guestFrequency: 'never' | 'rarely' | 'weekends_only' | 'frequent';
  overnightGuestsOk: boolean;
  socialLivingStyle: 'very_private' | 'friendly_independent' | 'family_style';

  // Pets (10%)
  hasPets: boolean;
  comfortableWithPets: boolean;
  petAllergies: boolean;

  // Shared Kitchen & Resources (5%)
  cookingFrequency: 'daily_cook' | 'light_cook' | 'takeout_heavy';
  foodSharingPreference: 'separate_everything' | 'share_basics_oil_spices' | 'cook_together';
  acUsagePreference: 'heavy_summer' | 'moderate_fans' | 'sparingly_to_save';

  // Communication (5%)
  conflictResolutionStyle: 'discuss_immediately' | 'calm_after_reflection' | 'written_notes';
  houseRulesAgreement: boolean;

  // ML Features: Interests & Study Habits
  interests?: string[];
  studyStyle?: 'deep_focus_solo' | 'collaborative_study' | 'campus_library' | 'flexible';
  studyHoursDaily?: number;
  examSeasonRoutine?: 'silent_monk_mode' | 'moderate_routine' | 'study_group';

  // Preferences & Demographics
  gender: 'male' | 'female';
  genderPreference: 'same_gender' | 'any';
  budgetMaxMonthly: number;
  preferredCities: string[];
  preferredNeighborhoods: string[];
  targetUniversityOrWorkplace?: string;
  optInDiscovery: boolean;
}

export interface RoommateProfile {
  userId: string;
  fullName: string;
  fullNameAr?: string;
  avatar: string;
  university?: string;
  faculty?: string;
  workplace?: string;
  isStudent: boolean;
  budgetMax: number;
  preferredAreas: string[];
  bio: string;
  bioAr?: string;
  answers: RoommateQuestionnaire;
  interests?: string[];
  studyHabits?: {
    style: string;
    styleAr: string;
    hoursPerDay: number;
    preferredTime: string;
    preferredTimeAr: string;
  };
  lifestyleHighlights?: {
    en: string;
    ar: string;
  }[];
  updatedAt: string;
}

export interface CompatibilityReport {
  score: number; // 0 - 100
  matchedAspects: {
    category: string;
    categoryAr: string;
    weight: number;
    score: number;
    summaryEn: string;
    summaryAr: string;
  }[];
  sharedPreferences: { en: string; ar: string }[];
  potentialConflicts: { en: string; ar: string }[];
  missingInformation: { en: string; ar: string }[];
  suggestedQuestions: { en: string; ar: string }[];
}

export interface MLCompatibilityPillar {
  key: 'study_habits' | 'lifestyle' | 'interests';
  nameEn: string;
  nameAr: string;
  score: number; // 0 - 100
  weight: number;
  icon: string;
  summaryEn: string;
  summaryAr: string;
}

export interface MLCompatibilityReport extends CompatibilityReport {
  mlOverallScore: number;
  confidence: number;
  vectorCosineSimilarity: number;
  pillars: {
    studyHabits: MLCompatibilityPillar;
    lifestyle: MLCompatibilityPillar;
    commonInterests: MLCompatibilityPillar;
  };
  commonInterests: {
    id: string;
    labelEn: string;
    labelAr: string;
    icon: string;
  }[];
  studyComparison: {
    metricEn: string;
    metricAr: string;
    userValEn: string;
    userValAr: string;
    matchValEn: string;
    matchValAr: string;
    isMatch: boolean;
  }[];
  lifestyleComparison: {
    metricEn: string;
    metricAr: string;
    userValEn: string;
    userValAr: string;
    matchValEn: string;
    matchValAr: string;
    isMatch: boolean;
  }[];
  aiInsight: {
    en: string;
    ar: string;
    highlightBadgeEn: string;
    highlightBadgeAr: string;
  };
  icebreaker: {
    en: string;
    ar: string;
  };
}

export type BookingStatus =
  | 'draft'
  | 'pending_owner'
  | 'accepted'
  | 'awaiting_payment'
  | 'confirmed'
  | 'active_stay'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export type PaymentMethodType = 'visa_mastercard' | 'instapay' | 'vodafone_cash' | 'bank_transfer';

export interface Booking {
  id: string;
  referenceCode: string;
  propertyId: string;
  propertyTitle: string;
  propertyTitleAr: string;
  propertyImage: string;
  propertyAddress: string;
  propertyAddressAr: string;
  roomId?: string;
  roomName?: string;
  tenantId: string;
  tenantName: string;
  tenantPhone: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  moveInDate: string;
  moveOutDate?: string;
  leaseDuration: LeaseDurationType;
  durationMonthsOrDays: number;
  monthlyRent: number;
  totalRentAmount: number;
  depositAmount: number;
  platformCommissionRate: number; // e.g. 0.05 or 0.15
  platformFee: number;
  totalDue: number;
  status: BookingStatus;
  paymentMethod?: PaymentMethodType;
  paymentReference?: string;
  paymentConfirmedAt?: string;
  createdAt: string;
  updatedAt: string;
  cancellationPolicy: string;
  specialRequests?: string;
}

export interface Review {
  id: string;
  propertyId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: 'tenant' | 'verified_stay';
  rating: number;
  comment: string;
  commentAr?: string;
  createdAt: string;
  ownerResponse?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  read: boolean;
  propertyContext?: {
    id: string;
    title: string;
    price: number;
  };
}

export interface VerificationDocument {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  documentType: 'national_id' | 'proof_of_ownership' | 'university_enrollment' | 'employment_letter';
  documentNumber: string;
  fileName: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface UserReview {
  id: string;
  bookingId: string;
  propertyId?: string;
  propertyTitle?: string;
  propertyTitleAr?: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: 'tenant' | 'owner';
  reviewerAvatar: string;
  targetUserId: string;
  targetUserName: string;
  targetUserRole: 'tenant' | 'owner';
  rating: number; // 1 to 5
  criteria: {
    communication: number; // 1 to 5
    honestyOrReliability: number; // 1 to 5
    cleanlinessOrPropertyCare: number; // 1 to 5
    respectOrAgreements: number; // 1 to 5
  };
  comment: string;
  createdAt: string;
}
