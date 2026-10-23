import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  UserRole,
  Language,
  PropertyListing,
  RoommateProfile,
  RoommateQuestionnaire,
  Booking,
  ChatMessage,
  VerificationDocument,
  UserReview,
} from '../types';
import {
  INITIAL_PROPERTIES,
  CURRENT_USER_MOCK,
  CHARACTER_NORA,
  CHARACTER_YOMNA,
  CHARACTER_FARAH,
  INITIAL_ROOMMATE_PROFILES,
  INITIAL_BOOKINGS,
  INITIAL_USER_REVIEWS,
} from '../data/mockData';

interface AppContextType {
  user: User | null;
  role: UserRole;
  language: Language;
  properties: PropertyListing[];
  favorites: string[];
  comparedProperties: string[];
  bookings: Booking[];
  roommateProfiles: RoommateProfile[];
  myQuestionnaire: RoommateQuestionnaire | null;
  messages: ChatMessage[];
  verificationDocs: VerificationDocument[];
  reviews: UserReview[];
  registeredUsers: User[];
  activeModal: string | null;
  selectedProperty: PropertyListing | null;
  selectedBooking: Booking | null;
  activeChatRecipient: { id: string; name: string; avatar: string; propertyContext?: any } | null;
  isMobileDeviceMode: boolean;
  searchFilter: {
    governorate: string;
    city: string;
    neighborhood: string;
    universityId: string;
    propertyType: string;
    minPrice: number;
    maxPrice: number;
    privateBathroomOnly: boolean;
    acOnly: boolean;
    wifiOnly: boolean;
    maxCommuteMinutes: number;
    genderPolicy: string;
    keyword: string;
    favoritesOnly: boolean;
  };
  notification: { message: string; type: 'success' | 'info' | 'error' } | null;
  
  theme: 'light' | 'dark';
  isMisbahChatOpen: boolean;
  
  // Actions
  setUser: (u: User | null) => void;
  setRole: (r: UserRole) => void;
  setLanguage: (lang: Language) => void;
  toggleTheme: () => void;
  setIsMisbahChatOpen: (open: boolean) => void;
  toggleFavorite: (propertyId: string) => void;
  toggleCompare: (propertyId: string) => void;
  removeCompare: (propertyId: string) => void;
  clearCompare: () => void;
  setActiveModal: (m: string | null) => void;
  setSelectedProperty: (p: PropertyListing | null) => void;
  setSelectedBooking: (b: Booking | null) => void;
  setActiveChatRecipient: (r: any) => void;
  setIsMobileDeviceMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  setSearchFilter: React.Dispatch<React.SetStateAction<AppContextType['searchFilter']>>;
  showNotification: (msg: string, type?: 'success' | 'info' | 'error') => void;
  addBooking: (b: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status'], paymentInfo?: any) => void;
  addPropertyListing: (listing: PropertyListing) => void;
  updateListingStatus: (id: string, status: PropertyListing['status']) => void;
  saveQuestionnaire: (answers: RoommateQuestionnaire) => void;
  sendMessage: (text: string, recipientId: string, propertyContext?: any) => void;
  submitVerificationDoc: (doc: Omit<VerificationDocument, 'id' | 'submittedAt' | 'status'>) => void;
  approveVerificationDoc: (docId: string) => void;
  submitReview: (reviewData: Omit<UserReview, 'id' | 'createdAt'>) => { success: boolean; error?: string };
  login: (email: string, password: string, role?: UserRole) => { success: boolean; error?: string };
  signup: (data: { name: string; email: string; phone: string; password: string; role: UserRole; avatar: string }) => { success: boolean; error?: string };
  logout: () => void;
}

const defaultQuestionnaire: RoommateQuestionnaire = {
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
  gender: 'female',
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
};

const defaultFilters = {
  governorate: '',
  city: '',
  neighborhood: '',
  universityId: '',
  propertyType: 'all',
  minPrice: 0,
  maxPrice: 15000,
  privateBathroomOnly: false,
  acOnly: false,
  wifiOnly: false,
  maxCommuteMinutes: 60,
  genderPolicy: 'all',
  keyword: '',
  favoritesOnly: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Pre-seeded standard user accounts
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('sakniya_users');
    return saved
      ? JSON.parse(saved)
      : [
          { ...CHARACTER_NORA, password: 'password123' },
          { ...CHARACTER_YOMNA, password: 'password123' },
          { ...CHARACTER_FARAH, password: 'password123' },
        ];
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sakniya_auth_user');
    return saved ? JSON.parse(saved) : CHARACTER_NORA;
  });

  const [role, setRoleState] = useState<UserRole>(user?.role || 'tenant');
  const [language, setLanguageState] = useState<Language>('ar');
  const [properties, setProperties] = useState<PropertyListing[]>(() => {
    const saved = localStorage.getItem('sakniya_properties');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('sakniya_favorites');
    return saved ? JSON.parse(saved) : ['prop-1'];
  });
  const [comparedProperties, setComparedProperties] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('sakniya_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });
  const [roommateProfiles, setRoommateProfiles] = useState<RoommateProfile[]>(INITIAL_ROOMMATE_PROFILES);
  const [myQuestionnaire, setMyQuestionnaire] = useState<RoommateQuestionnaire | null>(() => {
    const saved = localStorage.getItem('sakniya_my_questionnaire');
    return saved ? JSON.parse(saved) : defaultQuestionnaire;
  });
  const [reviews, setReviews] = useState<UserReview[]>(() => {
    const saved = localStorage.getItem('sakniya_user_reviews');
    return saved ? JSON.parse(saved) : INITIAL_USER_REVIEWS;
  });
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('sakniya_messages');
    return saved ? JSON.parse(saved) : [
      {
        id: 'msg-1',
        conversationId: 'conv-owner-yomna',
        senderId: 'owner-yomna',
        senderName: 'Yomna Mostafa',
        senderRole: 'owner',
        text: 'أهلاً يا نورا، تم تأكيد حجزك للغرفة المشمسة ويسعدني استضافتك للفصل الدراسي القادم بكل ترحاب.',
        timestamp: '2026-10-20T14:35:00Z',
        read: true,
        propertyContext: { id: 'prop-1', title: 'Warm Bohemian Flat near PUA', price: 3200 },
      },
    ];
  });
  const [verificationDocs, setVerificationDocs] = useState<VerificationDocument[]>([
    {
      id: 'doc-1',
      userId: 'user-tenant-nora',
      userName: 'Nora El-Shamy',
      userRole: 'tenant',
      documentType: 'university_enrollment',
      documentNumber: 'AUC-CS-202403123',
      fileName: 'auc_student_card.jpg',
      submittedAt: '2026-10-15',
      status: 'approved',
    },
    {
      id: 'doc-2',
      userId: 'owner-yomna',
      userName: 'Yomna Mostafa',
      userRole: 'owner',
      documentType: 'proof_of_ownership',
      documentNumber: 'EGY-NOTARY-88391',
      fileName: 'title_deed_smouha.pdf',
      submittedAt: '2026-10-12',
      status: 'approved',
    },
  ]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [activeChatRecipient, setActiveChatRecipient] = useState<any>(null);
  const [isMobileDeviceMode, setIsMobileDeviceMode] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState(defaultFilters);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sakniya_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  const [isMisbahChatOpen, setIsMisbahChatOpen] = useState<boolean>(false);

  // Sync theme with HTML document class and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('sakniya_theme', theme);
  }, [theme]);

  // Sync language with HTML document dir
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Persist properties, bookings, favorites, reviews, users, and auth
  useEffect(() => {
    localStorage.setItem('sakniya_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('sakniya_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('sakniya_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('sakniya_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('sakniya_user_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('sakniya_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('sakniya_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sakniya_auth_user');
    }
  }, [user]);

  const setRole = (r: UserRole) => {
    setRoleState(r);
    if (r === 'owner') {
      setUser(CHARACTER_YOMNA);
    } else if (r === 'admin') {
      setUser(CHARACTER_FARAH);
    } else {
      setUser(CHARACTER_NORA);
    }
    showNotification(
      language === 'ar'
        ? `تم التبديل إلى حساب: ${r === 'owner' ? 'يُمنى (المالكة)' : r === 'admin' ? 'فرح (إدارة المنصة)' : 'نورا (المستأجرة)'}`
        : `Switched active profile to: ${r === 'owner' ? 'Yomna (Landlord)' : r === 'admin' ? 'Farah (App Owner)' : 'Nora (Tenant)'}`,
      'info'
    );
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const clearCompare = () => {
    setComparedProperties([]);
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(propertyId);
      const updated = exists ? prev.filter((id) => id !== propertyId) : [...prev, propertyId];
      showNotification(
        language === 'ar'
          ? (exists ? 'تمت إزالة العقار من المفضلة' : 'تمت إضافة العقار للمفضلة')
          : (exists ? 'Removed from favorites' : 'Added to favorites'),
        'success'
      );
      return updated;
    });
  };

  const toggleCompare = (propertyId: string) => {
    setComparedProperties((prev) => {
      if (prev.includes(propertyId)) {
        showNotification(
          language === 'ar' ? 'تمت إزالة العقار من المقارنة' : 'Removed from comparison',
          'info'
        );
        return prev.filter((id) => id !== propertyId);
      }
      if (prev.length >= 3) {
        showNotification(
          language === 'ar' ? 'يمكنك مقارنة ٣ عقارات كحد أقصى في نفس الوقت' : 'You can compare up to 3 properties at once',
          'error'
        );
        return prev;
      }
      const updated = [...prev, propertyId];
      showNotification(
        language === 'ar' ? 'تمت إضافة العقار لميزان المقارنة العادلة' : 'Added to justice comparison scale',
        'info'
      );
      return updated;
    });
  };

  const removeCompare = (propertyId: string) => {
    setComparedProperties((prev) => prev.filter((id) => id !== propertyId));
  };

  const addBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    showNotification(
      language === 'ar' ? 'تم تأكيد حجزك السكني بنجاح!' : 'Your rental booking is confirmed!',
      'success'
    );
  };

  const updateBookingStatus = (id: string, status: Booking['status'], paymentInfo?: any) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status, ...(paymentInfo || {}) } : b))
    );
  };

  const addPropertyListing = (listing: PropertyListing) => {
    setProperties((prev) => [listing, ...prev]);
    showNotification(
      language === 'ar' ? 'تم نشر عقارك الجديد بنجاح!' : 'Your new property has been published!',
      'success'
    );
  };

  const updateListingStatus = (id: string, status: PropertyListing['status']) => {
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const saveQuestionnaire = (answers: RoommateQuestionnaire) => {
    setMyQuestionnaire(answers);
    localStorage.setItem('sakniya_my_questionnaire', JSON.stringify(answers));
    showNotification(
      language === 'ar' ? 'تم تحديث استبيان أسلوب حياتك وإعادة تدريب نموذج التوافق!' : 'Lifestyle preferences saved & ML model retrained!',
      'success'
    );
  };

  const sendMessage = (text: string, recipientId: string, propertyContext?: any) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: `conv-${recipientId}`,
      senderId: user?.id || 'guest',
      senderName: user?.name || (language === 'ar' ? 'أنا' : 'Me'),
      senderRole: role,
      text,
      timestamp: new Date().toISOString(),
      read: true,
      propertyContext,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const submitVerificationDoc = (doc: Omit<VerificationDocument, 'id' | 'submittedAt' | 'status'>) => {
    const newDoc: VerificationDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setVerificationDocs((prev) => [newDoc, ...prev]);
    showNotification(
      language === 'ar' ? 'تم استلام وثيقة التوثيق بنجاح وقيد المراجعة' : 'Verification document received',
      'info'
    );
  };

  const approveVerificationDoc = (docId: string) => {
    setVerificationDocs((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, status: 'approved' } : d))
    );
    showNotification(language === 'ar' ? 'تم اعتماد الوثيقة وتوثيق الحساب' : 'Document approved', 'success');
  };

  /**
   * Two-Way Review Submission:
   * Enforces that reviews are only submitted for confirmed or completed transactions,
   * prevents duplicate reviews for the same booking, and updates state.
   */
  const submitReview = (
    reviewData: Omit<UserReview, 'id' | 'createdAt'>
  ): { success: boolean; error?: string } => {
    if (!user) {
      return {
        success: false,
        error: language === 'ar' ? 'يرجى تسجيل الدخول أولاً لإرسال التقييم' : 'Please log in to submit a review',
      };
    }

    // Verify booking interaction
    const booking = bookings.find((b) => b.id === reviewData.bookingId);
    if (!booking) {
      return {
        success: false,
        error: language === 'ar' ? 'لم يتم العثور على معاملة سكنية مطابقة' : 'No matching rental transaction found',
      };
    }

    if (booking.status !== 'confirmed' && booking.status !== 'completed' && booking.status !== 'active_stay') {
      return {
        success: false,
        error: language === 'ar' ? 'لا يمكن التقييم إلا بعد تأكيد أو إتمام الحجز السكني الفعلي' : 'Reviews are allowed only after a confirmed stay',
      };
    }

    // Prevent duplicate review for the same transaction by this reviewer
    const alreadyReviewed = reviews.some(
      (r) => r.bookingId === reviewData.bookingId && r.reviewerId === user.id
    );

    if (alreadyReviewed) {
      return {
        success: false,
        error: language === 'ar' ? 'لقد قمت مسبقاً بكتابة تقييم لهذه المعاملة السكنية' : 'You have already reviewed this rental stay',
      };
    }

    const newReview: UserReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setReviews((prev) => [newReview, ...prev]);
    showNotification(
      language === 'ar' ? 'تم نشر تقييمك المتبادل بنجاح!' : 'Your mutual review was published successfully!',
      'success'
    );

    return { success: true };
  };

  /**
   * Standard Email & Password Authentication
   */
  const login = (
    email: string,
    password: string,
    targetRole?: UserRole
  ): { success: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();

    // Check in registered users list or known characters
    let foundUser = registeredUsers.find((u) => u.email.toLowerCase() === trimmedEmail);

    // Support flexible demo logins
    if (!foundUser) {
      if (trimmedEmail.includes('yomna') || trimmedEmail.includes('owner')) {
        foundUser = { ...CHARACTER_YOMNA, password: 'password123' };
      } else if (trimmedEmail.includes('farah') || trimmedEmail.includes('admin')) {
        foundUser = { ...CHARACTER_FARAH, password: 'password123' };
      } else if (trimmedEmail.includes('nora') || trimmedEmail.includes('tenant')) {
        foundUser = { ...CHARACTER_NORA, password: 'password123' };
      }
    }

    if (!foundUser) {
      return {
        success: false,
        error: language === 'ar' ? 'البريد الإلكتروني غير مسجل في النظام' : 'No account found with this email',
      };
    }

    if (foundUser.password && password && foundUser.password !== password && password !== 'password123') {
      return {
        success: false,
        error: language === 'ar' ? 'كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى' : 'Incorrect password, please try again',
      };
    }

    const effectiveRole = targetRole || foundUser.role;
    setUser(foundUser);
    setRoleState(effectiveRole);

    showNotification(
      language === 'ar'
        ? `مرحباً بك مجدداً، ${foundUser.nameAr || foundUser.name}!`
        : `Welcome back, ${foundUser.name}!`,
      'success'
    );

    return { success: true };
  };

  const signup = (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    avatar: string;
  }): { success: boolean; error?: string } => {
    const trimmedEmail = data.email.trim().toLowerCase();

    if (registeredUsers.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      return {
        success: false,
        error: language === 'ar' ? 'هذا البريد الإلكتروني مسجل بالفعل' : 'This email address is already registered',
      };
    }

    if (data.password.length < 6) {
      return {
        success: false,
        error: language === 'ar' ? 'يجب أن تتكون كلمة المرور من ٦ أحرف على الأقل' : 'Password must be at least 6 characters',
      };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      nameAr: data.name,
      email: trimmedEmail,
      phone: data.phone,
      role: data.role,
      avatar: data.avatar || (data.role === 'owner' ? CHARACTER_YOMNA.avatar : CHARACTER_NORA.avatar),
      password: data.password,
      isVerified: true,
      verificationDocsSubmitted: false,
      rating: 5.0,
      reviewsCount: 0,
    };

    setRegisteredUsers((prev) => [newUser, ...prev]);
    setUser(newUser);
    setRoleState(data.role);

    showNotification(
      language === 'ar'
        ? `أهلاً بك في سكنية، ${newUser.name}!`
        : `Welcome to Sakniya, ${newUser.name}!`,
      'success'
    );

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sakniya_auth_user');
    showNotification(
      language === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'You have been logged out',
      'info'
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        role,
        language,
        properties,
        favorites,
        comparedProperties,
        bookings,
        roommateProfiles,
        myQuestionnaire,
        messages,
        verificationDocs,
        reviews,
        registeredUsers,
        activeModal,
        selectedProperty,
        selectedBooking,
        activeChatRecipient,
        isMobileDeviceMode,
        searchFilter,
        notification,
        theme,
        isMisbahChatOpen,
        setUser,
        setRole,
        setLanguage,
        toggleTheme,
        setIsMisbahChatOpen,
        toggleFavorite,
        toggleCompare,
        removeCompare,
        clearCompare,
        setActiveModal,
        setSelectedProperty,
        setSelectedBooking,
        setActiveChatRecipient,
        setIsMobileDeviceMode,
        setSearchFilter,
        showNotification,
        addBooking,
        updateBookingStatus,
        addPropertyListing,
        updateListingStatus,
        saveQuestionnaire,
        sendMessage,
        submitVerificationDoc,
        approveVerificationDoc,
        submitReview,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
