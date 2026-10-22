import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, Send, Compass, Users, HelpCircle, Building2, ChevronDown, RefreshCw } from 'lucide-react';

export const MisbahWidget: React.FC = () => {
  const { language, setSearchFilter, setActiveModal } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isLampOn, setIsLampOn] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'misbah' | 'user'; text: string; time: string }>>([
    {
      sender: 'misbah',
      text: language === 'ar'
        ? 'أهلاً بك! أنا مصباح (مصباحك الدافئ في سكنية) 🪔. اضغط على المصباح لتنيره، وأنا جاهز لمساعدتك في العثور على سكن مريح، أو فهم درجات التوافق، أو حساب عمولة المنصة.'
        : "Hello! I'm Misbah, your cozy housing lamp guide 🪔. Tap my lamp to light up! I can help you discover rooms, calculate commute times, or match with ideal roommates.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleToggleLamp = () => {
    setIsLampOn((prev) => !prev);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text || isLoading) return;

    if (!isLampOn) {
      setIsLampOn(true);
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
    } catch (err) {
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
      {isOpen && (
        <div
          className="w-[360px] sm:w-[400px] h-[520px] bg-[#F8F4EC] border border-[#E9DDCC] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300"
          style={{ boxShadow: '0 20px 40px -10px rgba(118, 85, 65, 0.18)' }}
        >
          {/* Header */}
          <div className="bg-[#765541] text-[#F8F4EC] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all duration-500 cursor-pointer ${
                  isLampOn ? 'border-[#C47D60] ring-4 ring-[#C47D60]/30 shadow-md scale-105' : 'border-[#E9DDCC]/40 opacity-80'
                }`}
                onClick={() => setIsLampOn(!isLampOn)}
                title={language === 'ar' ? 'اضغط لتشغيل/إطفاء ضوء مصباح' : 'Tap to toggle lamp light'}
              >
                <img
                  src="/src/assets/images/sakniya_misbah_lamp_1792632265594.jpg"
                  alt="Misbah"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm">
                  <span>{language === 'ar' ? 'مصباح' : 'Misbah'}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full transition-colors ${isLampOn ? 'bg-[#C47D60] text-white' : 'bg-stone-600 text-stone-300'}`}>
                    {isLampOn ? (language === 'ar' ? 'مُضاء ومستعد' : 'Glowing') : (language === 'ar' ? 'انقر لإضاءتي' : 'Tap to glow')}
                  </span>
                </div>
                <p className="text-[11px] text-[#E9DDCC]/80">
                  {language === 'ar' ? 'مرشدك الذكي للسكن والزملاء' : 'Your cozy bohemian housing guide'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-[#F8F4EC]/80 hover:text-white transition-colors"
                aria-label="Close Misbah Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Action Chips */}
          <div className="bg-[#E9DDCC]/30 px-3 py-2 flex items-center gap-1.5 overflow-x-auto text-xs border-b border-[#E9DDCC]">
            {quickActions.map((qa, idx) => (
              <button
                key={idx}
                onClick={qa.action}
                className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-[#F8F4EC] text-[#765541] rounded-full border border-[#E9DDCC] transition-colors text-[11px] font-medium shrink-0 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-[#C47D60]" />
                {language === 'ar' ? qa.labelAr : qa.labelEn}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8F4EC]/60">
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
                      ? 'bg-[#C47D60] text-white rounded-br-none shadow-sm'
                      : 'bg-white text-[#34332F] border border-[#E9DDCC] rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-stone-400 mt-0.5 px-1">{msg.time}</span>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-stone-400 text-xs py-2">
                <span className="w-2 h-2 rounded-full bg-[#C47D60] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#C47D60] animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-[#C47D60] animate-bounce delay-200" />
                <span className="text-[11px] text-[#765541]">
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
            className="p-3 bg-white border-t border-[#E9DDCC] flex items-center gap-2"
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
              className="flex-1 px-3 py-2 text-xs bg-[#F8F4EC] border border-[#E9DDCC] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C47D60] text-[#34332F]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2 bg-[#765541] hover:bg-[#604230] disabled:opacity-40 text-white rounded-xl transition-colors shrink-0"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Interactive Lamp Button */}
      <button
        onClick={handleToggleLamp}
        className={`group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-full border shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C47D60] ${
          isLampOn
            ? 'bg-[#F8F4EC] border-[#C47D60] ring-4 ring-[#C47D60]/20 animate-glow'
            : 'bg-white hover:bg-[#F8F4EC] border-[#E9DDCC]'
        }`}
        title={language === 'ar' ? 'مصباح — مساعد سكنية الذكي' : 'Misbah — Sakniya Assistant'}
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#C47D60]/40">
          <img
            src="/src/assets/images/sakniya_misbah_lamp_1792632265594.jpg"
            alt="Misbah"
            className="w-full h-full object-cover"
          />
          {/* Subtle light aura */}
          {isLampOn && (
            <div className="absolute inset-0 bg-[#C47D60]/20 mix-blend-color-burn pointer-events-none" />
          )}
        </div>
        <div className="text-left rtl:text-right hidden sm:block">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#765541]">
            <span>{language === 'ar' ? 'مصباح' : 'Misbah'}</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isLampOn ? 'bg-[#C47D60] animate-ping' : 'bg-stone-300'
              }`}
            />
          </div>
          <p className="text-[10px] text-stone-500">
            {isLampOn
              ? (language === 'ar' ? 'الضوء مُضاء · اضغط للمحادثة' : 'Lamp lit · Tap to chat')
              : (language === 'ar' ? 'اضغط للإضاءة' : 'Tap to light')}
          </p>
        </div>
      </button>
    </aside>
  );
};
