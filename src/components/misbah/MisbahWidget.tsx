import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, Send } from 'lucide-react';
import { RealisticLampIcon } from './RealisticLampIcon';

export const MisbahWidget: React.FC = () => {
  const {
    language,
    setSearchFilter,
    activeModal,
    setActiveModal,
    isMisbahChatOpen,
    setIsMisbahChatOpen,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'misbah' | 'user'; text: string; time: string }>>([
    {
      sender: 'misbah',
      text: language === 'ar'
        ? 'أهلاً بك! أنا مصباح، مرشدك الدافئ في سكنية. اضغط على أباجورة المكتب لتنير، وأنا جاهز لمساعدتك في العثور على سكن مريح، أو فهم درجات التوافق، أو حساب عمولة المنصة.'
        : "Hello! I'm Misbah, your cozy housing bedside lamp guide. Tap my table lamp to light up! I can help you discover rooms, calculate commute times, or match with ideal roommates.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isMisbahChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isMisbahChatOpen]);

  // Lamp ON/OFF state strictly mirrors the chat state
  const isLampOn = isMisbahChatOpen || activeModal === 'chat';

  const handleToggleLamp = () => {
    if (activeModal === 'chat') {
      setActiveModal(null);
    }
    setIsMisbahChatOpen(!isMisbahChatOpen);
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text || isLoading) return;

    if (!isMisbahChatOpen) {
      setIsMisbahChatOpen(true);
    }

    const userMsg = {
      sender: 'user' as const,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/misbah', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
        }),
      });

      const data = await response.json();
      const reply = data.reply || (language === 'ar' ? 'أنا هنا لمساعدتك دائماً في كل ما يخص السكن والزملاء.' : "I'm here to assist you with all your housing needs!");

      setMessages((prev) => [
        ...prev,
        {
          sender: 'misbah',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'misbah',
          text: language === 'ar'
            ? 'يمكنك تصفح شققنا المعتمدة في سموحة والشاطبي والدقي، أو فتح استبيان رفقاء السكن عبر القائمة.'
            : 'You can explore verified rooms in Smouha, Shatby, or Dokki, or open the roommate questionnaire via the menu.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      labelEn: 'Find room near PUA',
      labelAr: 'أريد سكناً قرب فاروس',
      action: () => {
        setSearchFilter((prev) => ({ ...prev, universityId: 'pua', city: 'Alexandria' }));
        handleSend(language === 'ar' ? 'أريد سكناً قريباً من جامعة فاروس في الإسكندرية' : 'Find me a room near Pharos University in Alexandria');
      },
    },
    {
      labelEn: 'Explain platform fees',
      labelAr: 'اشرح لي الرسوم والعمولة',
      action: () => {
        handleSend(language === 'ar' ? 'كم تبلغ عمولة منصة سكنية وما هي الرسوم المطبقة؟' : 'What are the platform fees and commission on Sakniya?');
      },
    },
    {
      labelEn: 'Find roommate match',
      labelAr: 'ابحث لي عن روميت مناسب',
      action: () => {
        setActiveModal('roommates');
        handleSend(language === 'ar' ? 'كيف يعمل نظام مطابقة رفقاء السكن؟' : 'How does the Roommate Match score work?');
      },
    },
    {
      labelEn: 'Quiet place with AC',
      labelAr: 'سكن هادئ بتكييف',
      action: () => {
        setSearchFilter((prev) => ({ ...prev, acOnly: true }));
        handleSend(language === 'ar' ? 'أبحث عن غرفة هادئة بتكييف للمذاكرة' : 'I need a quiet room with air conditioning for studying');
      },
    },
  ];

  return (
    <aside aria-label="Misbah Assistant" className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-3">
      {/* Expanded Chat Drawer */}
      {isMisbahChatOpen && (
        <div
          className="w-[360px] sm:w-[400px] h-[520px] bg-[#F8F4EC] dark:bg-[#191614] border border-[#E9DDCC] dark:border-[#3D352E] rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95"
          style={{ boxShadow: '0 24px 48px -12px rgba(118, 85, 65, 0.28)' }}
        >
          {/* Header */}
          <div className="bg-[#765541] dark:bg-[#2D2723] text-[#F8F4EC] px-4 py-3 flex items-center justify-between border-b border-[#3D352E]/30">
            <div className="flex items-center gap-3">
              {/* Mini Lamp in Header */}
              <div
                className={`relative p-1 rounded-2xl transition-all duration-500 cursor-pointer ${
                  isLampOn
                    ? 'bg-amber-400/20 ring-2 ring-amber-400/50 shadow-md scale-105'
                    : 'bg-stone-800/20 opacity-70'
                }`}
                onClick={handleToggleLamp}
                title={language === 'ar' ? 'انقر لإغلاق المحادثة وإطفاء المصباح' : 'Tap to close chat and extinguish lamp'}
              >
                <RealisticLampIcon isOn={isLampOn} size={32} />
              </div>

              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm">
                  <span>{language === 'ar' ? 'مصباح' : 'Misbah'}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold transition-all duration-500 flex items-center gap-1 ${
                      isLampOn
                        ? 'bg-amber-500 text-stone-900 shadow-sm'
                        : 'bg-stone-600 text-stone-300'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {isLampOn
                      ? (language === 'ar' ? 'المصباح مضيء' : 'Lamp Illuminated')
                      : (language === 'ar' ? 'المصباح مطفأ' : 'Lamp Off')}
                  </span>
                </div>
                <p className="text-[11px] text-[#E9DDCC]/80 dark:text-[#D4BFA8]">
                  {language === 'ar' ? 'مرشدك الذكي للسكن والزملاء' : 'Your cozy bohemian housing guide'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsMisbahChatOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-[#F8F4EC]/80 hover:text-white transition-colors"
                aria-label={language === 'ar' ? 'إغلاق المحادثة' : 'Close Misbah Chat'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Action Chips */}
          <div className="bg-[#E9DDCC]/30 dark:bg-[#24201D]/70 px-3 py-2 flex items-center gap-1.5 overflow-x-auto text-xs border-b border-[#E9DDCC] dark:border-[#3D352E]">
            {quickActions.map((qa, idx) => (
              <button
                key={idx}
                type="button"
                onClick={qa.action}
                className="whitespace-nowrap px-2.5 py-1 bg-white dark:bg-[#2D2723] hover:bg-[#F8F4EC] dark:hover:bg-[#3D352E] text-[#765541] dark:text-[#D4BFA8] rounded-full border border-[#E9DDCC] dark:border-[#3D352E] transition-colors text-[11px] font-medium shrink-0 flex items-center gap-1 shadow-xs"
              >
                <Sparkles className="w-3 h-3 text-[#C47D60] dark:text-[#D8896C]" />
                {language === 'ar' ? qa.labelAr : qa.labelEn}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8F4EC]/60 dark:bg-[#191614]/80">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#C47D60] dark:bg-[#D8896C] text-white rounded-br-none shadow-sm'
                      : 'bg-white dark:bg-[#24201D] text-[#34332F] dark:text-[#EDE6DE] border border-[#E9DDCC] dark:border-[#3D352E] rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5 px-1">{msg.time}</span>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-stone-400 text-xs py-2">
                <span className="w-2 h-2 rounded-full bg-[#C47D60] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#C47D60] animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-[#C47D60] animate-bounce delay-200" />
                <span className="text-[11px] text-[#765541] dark:text-[#D4BFA8]">
                  {language === 'ar' ? 'مصباح يفكر ويبحث...' : 'Misbah is checking details...'}
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-[#24201D] border-t border-[#E9DDCC] dark:border-[#3D352E] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                language === 'ar'
                  ? 'اسأل مصباح عن السكن، الجامعة، أو الزملاء...'
                  : 'Ask Misbah about housing, campus commute, roommates...'
              }
              className="flex-1 px-3 py-2 text-xs bg-[#F8F4EC] dark:bg-[#191614] border border-[#E9DDCC] dark:border-[#3D352E] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C47D60] text-[#34332F] dark:text-[#EDE6DE]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2 bg-[#765541] hover:bg-[#604230] dark:bg-[#C47D60] dark:hover:bg-[#b06a4e] disabled:opacity-40 text-white rounded-xl transition-colors shrink-0"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Interactive Lamp Button */}
      <button
        type="button"
        onClick={handleToggleLamp}
        aria-expanded={isMisbahChatOpen}
        className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-full border shadow-2xl transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-[#C47D60] ${
          isLampOn
            ? 'bg-[#F8F4EC] dark:bg-[#2D2723] border-[#C47D60] dark:border-[#D8896C] ring-4 ring-amber-400/30 dark:ring-amber-400/20 shadow-amber-500/20'
            : 'bg-white dark:bg-[#24201D] hover:bg-[#F8F4EC] dark:hover:bg-[#2D2723] border-[#E9DDCC] dark:border-[#3D352E]'
        }`}
        title={
          isLampOn
            ? (language === 'ar' ? 'مصباح مُضاء ومفتوح · انقر للإطفاء والإغلاق' : 'Misbah lit & open · Tap to turn off')
            : (language === 'ar' ? 'مصباح سكنية · انقر لإضاءة الأباجورة وبدء المحادثة' : 'Misbah lamp · Tap to light up & chat')
        }
      >
        {/* Realistic Bedside Table Lamp Icon with smooth ON/OFF glow */}
        <div className="relative flex items-center justify-center">
          <RealisticLampIcon isOn={isLampOn} size={38} />
        </div>

        <div className="text-left rtl:text-right hidden sm:block">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#765541] dark:text-[#EDE6DE]">
            <span>{language === 'ar' ? 'مصباح' : 'Misbah'}</span>
            <span
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                isLampOn ? 'bg-amber-400 ring-2 ring-amber-400/50 shadow-sm animate-pulse' : 'bg-stone-300 dark:bg-stone-600'
              }`}
            />
          </div>
          <p className="text-[10px] text-stone-500 dark:text-[#9E9287] transition-colors">
            {isLampOn
              ? (language === 'ar' ? 'المصباح مُضاء · المحادثة نشطة' : 'Lamp lit · Chat active')
              : (language === 'ar' ? 'انقر لإضاءة المصباح' : 'Tap to light up')}
          </p>
        </div>
      </button>
    </aside>
  );
};
