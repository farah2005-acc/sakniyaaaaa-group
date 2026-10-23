import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Eye, EyeOff, Lock, Mail, Phone, User as UserIcon, ArrowRight, ArrowLeft, ShieldCheck, Check } from 'lucide-react';
import { SakniyaLogo } from '../common/SakniyaLogo';

interface SignUpPageProps {
  onNavigateToLogin: () => void;
  onSuccessRedirect: (role: UserRole) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onNavigateToLogin,
  onSuccessRedirect,
}) => {
  const { language, signup } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+20 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('tenant');
  
  // Cartoon avatar selector options
  const avatarOptions = [
    {
      id: 'nora',
      name: language === 'ar' ? 'نورا (مستأجرة/طالبة)' : 'Nora (Student Tenant)',
      url: '/src/assets/images/avatar_nora_tenant_1792715698432.jpg',
      recommendedFor: 'tenant',
    },
    {
      id: 'yomna',
      name: language === 'ar' ? 'يُمنى (مالكة عقار)' : 'Yomna (Landlord Host)',
      url: '/src/assets/images/avatar_yomna_landlord_1792715698491.jpg',
      recommendedFor: 'owner',
    },
    {
      id: 'farah',
      name: language === 'ar' ? 'فرح (شخصية المنصة)' : 'Farah (Platform Profile)',
      url: '/src/assets/images/avatar_farah_owner_1792715698559.jpg',
      recommendedFor: 'admin',
    },
  ];

  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    role === 'owner' ? avatarOptions[1].url : avatarOptions[0].url
  );

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'owner') {
      setSelectedAvatar(avatarOptions[1].url);
    } else {
      setSelectedAvatar(avatarOptions[0].url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg(language === 'ar' ? 'يرجى إدخال الاسم بالكامل' : 'Please enter your full name');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg(language === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setErrorMsg(
        language === 'ar'
          ? 'يجب أن تتكون كلمة المرور من ٦ خانات على الأقل'
          : 'Password must be at least 6 characters'
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(
        language === 'ar'
          ? 'كلمتا المرور غير متطابقتين'
          : 'Passwords do not match'
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = signup({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        role,
        avatar: selectedAvatar,
      });

      setIsLoading(false);

      if (res.success) {
        onSuccessRedirect(role);
      } else {
        setErrorMsg(res.error || (language === 'ar' ? 'فشل إنشاء الحساب' : 'Failed to create account'));
      }
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg bg-white dark:bg-[#24201D] rounded-[32px] border border-[#E9DDCC] dark:border-[#3D352E] shadow-xl p-6 sm:p-8 space-y-6 transition-colors">
        
        {/* Brand Header with Corrected Logo */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <SakniyaLogo size="lg" showText={true} />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#34332F] dark:text-[#EDE6DE]">
              {language === 'ar' ? 'إنشاء حساب جديد في سكنية' : 'Create a New Account'}
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              {language === 'ar'
                ? 'انضم إلى مجتمع سكن الطلاب والمُلّاك الموثقين في مصر'
                : 'Join the community of verified students, roommates, and hosts'}
            </p>
          </div>
        </div>

        {/* Account Role Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#765541] dark:text-[#D4BFA8]">
            {language === 'ar' ? 'أنا أسجل بصفتي:' : 'Register as:'}
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#F8F4EC] dark:bg-[#1E1A18] rounded-2xl border border-[#E9DDCC] dark:border-[#3D352E]">
            <button
              type="button"
              onClick={() => handleRoleChange('tenant')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'tenant'
                  ? 'bg-white dark:bg-[#2F2925] text-[#C47D60] shadow-sm'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'مستأجر / طالب' : 'Tenant / Student'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('owner')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'owner'
                  ? 'bg-white dark:bg-[#2F2925] text-[#C47D60] shadow-sm'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'صاحب عقار / مالك' : 'Landlord / Host'}</span>
            </button>
          </div>
        </div>

        {/* Cartoon Female Avatar Picker */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#765541] dark:text-[#D4BFA8]">
            {language === 'ar' ? 'اختر صورتك الكرتونية المعبرة' : 'Select Your Cartoon Avatar'}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {avatarOptions.map((opt) => {
              const isSelected = selectedAvatar === opt.url;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedAvatar(opt.url)}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer text-center flex flex-col items-center gap-1.5 ${
                    isSelected
                      ? 'border-[#C47D60] bg-[#C47D60]/10 ring-2 ring-[#C47D60]/30 shadow-sm'
                      : 'border-[#E9DDCC] dark:border-[#3D352E] bg-[#F8F4EC] dark:bg-[#1E1A18] hover:border-[#C47D60]/50'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={opt.url}
                      alt={opt.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-stone-700 shadow-sm"
                    />
                    {isSelected && (
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#C47D60] text-white flex items-center justify-center shadow">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-stone-700 dark:text-stone-300 line-clamp-1">
                    {opt.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl text-xs text-red-600 dark:text-red-300 animate-in fade-in">
            {errorMsg}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#765541] dark:text-[#EDE6DE]">
              {language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language === 'ar' ? 'مثال: نورا الشامي' : 'e.g. Nora El-Shamy'}
                className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2.5 bg-[#F8F4EC] dark:bg-[#1E1A18] border border-[#E9DDCC] dark:border-[#3D352E] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C47D60] text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#765541] dark:text-[#EDE6DE]">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@pua.edu.eg"
                  className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2.5 bg-[#F8F4EC] dark:bg-[#1E1A18] border border-[#E9DDCC] dark:border-[#3D352E] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C47D60] text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#765541] dark:text-[#EDE6DE]">
                {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+20 100 123 4567"
                  className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2.5 bg-[#F8F4EC] dark:bg-[#1E1A18] border border-[#E9DDCC] dark:border-[#3D352E] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C47D60] text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Password & Confirm Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#765541] dark:text-[#EDE6DE]">
                {language === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2.5 bg-[#F8F4EC] dark:bg-[#1E1A18] border border-[#E9DDCC] dark:border-[#3D352E] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C47D60] text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#765541] dark:text-[#EDE6DE]">
                {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 rtl:pl-10 rtl:pr-9 pr-10 py-2.5 bg-[#F8F4EC] dark:bg-[#1E1A18] border border-[#E9DDCC] dark:border-[#3D352E] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C47D60] text-xs sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#C47D60] hover:bg-[#b06a4e] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span>{language === 'ar' ? 'جارٍ إنشاء الحساب...' : 'Creating Account...'}</span>
            ) : (
              <>
                <span>{language === 'ar' ? 'إنشاء حسابي والبدء' : 'Create Account & Get Started'}</span>
                {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </form>

        {/* Footer Link to Login */}
        <div className="pt-2 text-center text-xs text-stone-500 border-t border-[#E9DDCC]/70 dark:border-[#3D352E]/70">
          <span>{language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'} </span>
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="font-bold text-[#C47D60] hover:underline ml-1"
          >
            {language === 'ar' ? 'سجّل الدخول من هنا' : 'Log in here'}
          </button>
        </div>

      </div>
    </div>
  );
};
