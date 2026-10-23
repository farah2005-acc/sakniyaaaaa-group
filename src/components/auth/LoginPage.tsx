import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, User as UserIcon } from 'lucide-react';
import { SakniyaLogo } from '../common/SakniyaLogo';

interface LoginPageProps {
  onNavigateToSignUp: () => void;
  onSuccessRedirect: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateToSignUp,
  onSuccessRedirect,
}) => {
  const { language, login } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('tenant');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg(language === 'ar' ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email');
      return;
    }

    if (!password) {
      setErrorMsg(language === 'ar' ? 'يرجى إدخال كلمة المرور' : 'Please enter your password');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password, selectedRole);
      setIsLoading(false);

      if (res.success) {
        onSuccessRedirect(selectedRole);
      } else {
        setErrorMsg(res.error || (language === 'ar' ? 'فشل تسجيل الدخول' : 'Login failed'));
      }
    }, 600);
  };

  const handleQuickDemo = (role: UserRole, demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setSelectedRole(role);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white dark:bg-[#24201D] rounded-[32px] border border-[#E9DDCC] dark:border-[#3D352E] shadow-xl p-6 sm:p-8 space-y-6 transition-colors">
        
        {/* Brand Header with Corrected Original Logo */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <SakniyaLogo size="lg" showText={true} />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#34332F] dark:text-[#EDE6DE]">
              {language === 'ar' ? 'تسجيل الدخول إلى حسابك' : 'Sign in to Your Account'}
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              {language === 'ar'
                ? 'أدخل بياناتك للوصول إلى لوحة التحكم والحجوزات والتقييمات المتبادلة'
                : 'Enter your credentials to access your rentals, stays, and reviews'}
            </p>
          </div>
        </div>

        {/* Role Selector Tabs (Tenant vs Landlord) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#765541] dark:text-[#D4BFA8]">
            {language === 'ar' ? 'نوع الحساب' : 'Account Role'}
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#F8F4EC] dark:bg-[#1E1A18] rounded-2xl border border-[#E9DDCC] dark:border-[#3D352E]">
            <button
              type="button"
              onClick={() => setSelectedRole('tenant')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                selectedRole === 'tenant'
                  ? 'bg-white dark:bg-[#2F2925] text-[#C47D60] shadow-sm'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'مستأجر / طالب' : 'Tenant / Student'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('owner')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                selectedRole === 'owner'
                  ? 'bg-white dark:bg-[#2F2925] text-[#C47D60] shadow-sm'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'مالك عقار' : 'Landlord / Host'}</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl text-xs text-red-600 dark:text-red-300 animate-in fade-in">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#765541] dark:text-[#EDE6DE]">
              {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={selectedRole === 'tenant' ? 'nora@sakniya.eg' : 'yomna@sakniya.eg'}
                className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2.5 bg-[#F8F4EC] dark:bg-[#1E1A18] border border-[#E9DDCC] dark:border-[#3D352E] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C47D60] text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
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

          {/* Quick Demo Fill Buttons */}
          <div className="pt-1 flex flex-wrap gap-1.5 text-[11px] text-stone-500">
            <span className="font-semibold text-stone-400">{language === 'ar' ? 'حسابات تجريبية:' : 'Quick Demo:'}</span>
            <button
              type="button"
              onClick={() => handleQuickDemo('tenant', 'nora@sakniya.eg')}
              className="text-[#C47D60] hover:underline font-bold"
            >
              نورا (مستأجرة)
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => handleQuickDemo('owner', 'yomna@sakniya.eg')}
              className="text-[#765541] hover:underline font-bold"
            >
              يُمنى (مالكة)
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin', 'farah@sakniya.eg')}
              className="text-stone-600 hover:underline font-bold"
            >
              فرح (إدارة)
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#C47D60] hover:bg-[#b06a4e] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>{language === 'ar' ? 'جارٍ التحقق...' : 'Verifying...'}</span>
            ) : (
              <>
                <span>{language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
                {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </form>

        {/* Footer Link to Sign Up */}
        <div className="pt-2 text-center text-xs text-stone-500 border-t border-[#E9DDCC]/70 dark:border-[#3D352E]/70">
          <span>{language === 'ar' ? 'ليس لديك حساب بعد؟' : "Don't have an account?"} </span>
          <button
            type="button"
            onClick={onNavigateToSignUp}
            className="font-bold text-[#C47D60] hover:underline ml-1"
          >
            {language === 'ar' ? 'أنشئ حساباً جديداً الآن' : 'Sign up now'}
          </button>
        </div>

      </div>
    </div>
  );
};
