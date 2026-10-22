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
} from '../types';
import {
  INITIAL_PROPERTIES,
  CURRENT_USER_MOCK,
  INITIAL_ROOMMATE_PROFILES,
  INITIAL_BOOKINGS,
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
  gender: 'male',
  genderPreference: 'same_gender',
  budgetMaxMonthly: 4000,
  preferredCities: ['Alexandria'],
  preferredNeighborhoods: ['Smouha', 'Shatby'],
  targetUniversityOrWorkplace: 'pua',
  optInDiscovery: true,
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
  const [user, setUser] = useState<User | null>(CURRENT_USER_MOCK);
  const [role, setRoleState] = useState<UserRole>('tenant');
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
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('sakniya_messages');
    return saved ? JSON.parse(saved) : [
      {
        id: 'msg-1',
        conversationId: 'conv-owner-1',
        senderId: 'owner-1',
        senderName: 'Haj Mahmoud El-Gohary',
        senderRole: 'owner',
        text: 'أهلاً يا كريم، تم استلام حجزك للغرفة المشمسة ويسعدني استضافتك للفصل الدراسي القادم.',
        timestamp: '2026-10-20T14:35:00Z',
        read: true,
        propertyContext: { id: 'prop-1', title: 'Warm Bohemian Flat near PUA', price: 3200 },
      },
    ];
  });
  const [verificationDocs, setVerificationDocs] = useState<VerificationDocument[]>([
    {
      id: 'doc-1',
      userId: 'user-tenant-1',
      userName: 'Karim Hassan',
      userRole: 'tenant',
      documentType: 'university_enrollment',
      documentNumber: 'PUA-ENG-202403123',
      fileName: 'pua_student_card.jpg',
      submittedAt: '2026-10-15',
      status: 'approved',
    },
    {
      id: 'doc-2',
      userId: 'owner-1',
      userName: 'Haj Mahmoud El-Gohary',
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

  // Persist properties, bookings, favorites
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

  const setRole = (r: UserRole) => {
    setRoleState(r);
    if (r === 'owner') {
      setUser({
        id: 'owner-1',
        name: 'Haj Mahmoud El-Gohary',
        nameAr: 'الحاج محمود الجوهري',
        email: 'mahmoud.gohary@sakniya.eg',
        phone: '+20 100 234 5678',
        role: 'owner',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        isVerified: true,
        verificationDocsSubmitted: true,
      });
    } else if (r === 'admin') {
      setUser({
        id: 'admin-1',
        name: 'Sakniya Admin',
        nameAr: 'إدارة سكنية',
        email: 'admin@sakniya.eg',
        phone: '+20 100 000 0000',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        isVerified: true,
      });
    } else {
      setUser(CURRENT_USER_MOCK);
    }
    showNotification(
      language === 'ar' ? `تم التبديل إلى حساب: ${r === 'owner' ? 'صاحب سكن' : r === 'admin' ? 'مسؤول النظام' : 'مستأجر/طالب'}` : `Switched view to: ${r}`,
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
        language === 'ar' ? 'تمت إضافة العقار لقائمة المقارنة' : 'Added to comparison list',
        'info'
      );
      return updated;
    });
  };

  const removeCompare = (propertyId: string) => {
    setComparedProperties((prev) => prev.filter((id) => id !== propertyId));
  };

  const addBooking = (newBooking: Booking) => {
    // Check for conflicting confirmed bookings on the same room
    const conflict = bookings.find(
      (b) =>
        b.propertyId === newBooking.propertyId &&
        b.roomId === newBooking.roomId &&
        b.status === 'confirmed' &&
        b.moveInDate === newBooking.moveInDate
    );

    if (conflict) {
      showNotification(
        language === 'ar' ? 'عفواً، هذه الغرفة محجوزة بالفعل في نفس الفترة!' : 'This room is already booked for that date!',
        'error'
      );
      return;
    }

    setBookings((prev) => [newBooking, ...prev]);
    showNotification(
      language === 'ar' ? 'تم إرسال طلب الحجز بنجاح!' : 'Booking request sent successfully!',
      'success'
    );
  };

  const updateBookingStatus = (id: string, status: Booking['status'], paymentInfo?: any) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            status,
            ...(paymentInfo || {}),
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      })
    );
  };

  const addPropertyListing = (listing: PropertyListing) => {
    setProperties((prev) => [listing, ...prev]);
    showNotification(
      language === 'ar' ? 'تم نشر العقار بنجاح في المنصة!' : 'Property published successfully!',
      'success'
    );
  };

  const updateListingStatus = (id: string, status: PropertyListing['status']) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  const saveQuestionnaire = (answers: RoommateQuestionnaire) => {
    setMyQuestionnaire(answers);
    localStorage.setItem('sakniya_my_questionnaire', JSON.stringify(answers));
    showNotification(
      language === 'ar' ? 'تم حفظ وتحديث ملف التوافق السكني بنجاح!' : 'Roommate profile preferences updated successfully!',
      'success'
    );
  };

  const sendMessage = (text: string, recipientId: string, propertyContext?: any) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: `conv-${recipientId}`,
      senderId: user ? user.id : 'guest',
      senderName: user ? user.name : 'Guest',
      senderRole: role,
      text,
      timestamp: new Date().toISOString(),
      read: true,
      propertyContext,
    };

    setMessages((prev) => [...prev, newMsg]);

    // Simulated auto-reply from owner if messaging owner
    if (recipientId === 'owner-1' && role === 'tenant') {
      setTimeout(() => {
        const reply: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          conversationId: `conv-${recipientId}`,
          senderId: 'owner-1',
          senderName: 'Haj Mahmoud El-Gohary',
          senderRole: 'owner',
          text: language === 'ar'
            ? 'شكراً لتواصلك يا كريم! المكان متاح ونرحب بك للمعاينة أو إتمام الحجز عبر سكنية في أي وقت.'
            : 'Thanks for reaching out! The place is available and you are welcome to visit or complete booking on Sakniya.',
          timestamp: new Date().toISOString(),
          read: false,
          propertyContext,
        };
        setMessages((prev) => [...prev, reply]);
      }, 1200);
    }
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
      language === 'ar' ? 'تم رفع المستند وبانتظار مراجعة المسؤولين' : 'Document uploaded for admin review',
      'info'
    );
  };

  const approveVerificationDoc = (docId: string) => {
    setVerificationDocs((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, status: 'approved' } : d))
    );
    showNotification(
      language === 'ar' ? 'تم قبول واعتماد المستند بنجاح' : 'Document approved successfully',
      'success'
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
