import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, Sparkles, ShieldCheck, MapPin, Building2 } from 'lucide-react';
import { RealisticLampIcon } from '../misbah/RealisticLampIcon';

interface ChatModalProps {
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ onClose }) => {
  const {
    user,
    role,
    language,
    messages,
    sendMessage,
    activeChatRecipient,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const recipientName = activeChatRecipient?.name || 'Yomna Mostafa';
  const recipientAvatar = activeChatRecipient?.avatar || '/src/assets/images/avatar_yomna_landlord_1792715698491.jpg';
  const propertyCtx = activeChatRecipient?.propertyContext;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text?: string) => {
    const msg = text || inputVal.trim();
    if (!msg) return;
    sendMessage(msg, activeChatRecipient?.id || 'owner-1', propertyCtx);
    setInputVal('');
  };

  const quickQuestions = [
    { en: 'Is this room available starting next month?', ar: 'هل الغرفة متاحة للاستلام بداية الشهر القادم؟' },
    { en: 'Can I schedule a quick visit or video call?', ar: 'هل يمكن ترتيب موعد للمعاينة أو مكالمة فيديو سريعة؟' },
    { en: 'Are all water and electricity utilities included?', ar: 'هل فواتير المياه والكهرباء والإنترنت مشمولة بالكامل؟' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#F8F4EC] dark:bg-[#191614] rounded-3xl max-w-lg w-full h-[580px] border border-[#E9DDCC] dark:border-[#3D352E] shadow-2xl flex flex-col overflow-hidden text-[#34332F] dark:text-[#EDE6DE] transition-colors">
        
        {/* Header with Synchronized Bedside Table Lamp */}
        <div className="px-5 py-3.5 bg-white dark:bg-[#24201D] border-b border-[#E9DDCC] dark:border-[#3D352E] flex items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={recipientAvatar}
                alt={recipientName}
                className="w-10 h-10 rounded-full object-cover border border-[#E9DDCC] dark:border-[#3D352E]"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#697A58] ring-2 ring-white dark:ring-[#24201D]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm text-[#34332F] dark:text-[#EDE6DE]">
                <span>{recipientName}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#697A58] dark:text-[#A9B59A]" />
              </div>
              <p className="text-[10px] text-stone-500 dark:text-[#9E9287]">
                {language === 'ar' ? 'محادثة آمنة وموثقة عبر سكنية' : 'Verified in-app secure chat'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Lit Bedside Table Lamp in Chat Header */}
            <div
              className="p-1 rounded-xl bg-amber-400/10 dark:bg-amber-400/15 border border-amber-400/30 flex items-center gap-1.5 px-2"
              title={language === 'ar' ? 'مصباح المحادثة مُضاء ودافئ' : 'Chat lamp illuminated and warm'}
            >
              <RealisticLampIcon isOn={true} size={28} />
              <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-300 hidden sm:inline">
                {language === 'ar' ? 'المحادثة نشطة' : 'Active'}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-[#2D2723] text-[#765541] dark:text-[#D4BFA8] transition-colors"
              aria-label={language === 'ar' ? 'إغلاق المحادثة' : 'Close Chat'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Property Context Snippet */}
        {propertyCtx && (
          <div className="px-4 py-2 bg-[#E9DDCC]/40 dark:bg-[#24201D]/70 border-b border-[#E9DDCC] dark:border-[#3D352E] flex items-center justify-between text-xs transition-colors">
            <div className="flex items-center gap-2 truncate">
              <Building2 className="w-3.5 h-3.5 text-[#C47D60] dark:text-[#D8896C] shrink-0" />
              <span className="font-semibold text-[#34332F] dark:text-[#EDE6DE] truncate">{propertyCtx.title}</span>
            </div>
            <span className="font-mono font-bold text-[#765541] dark:text-[#D4BFA8] shrink-0">
              {propertyCtx.price.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
            </span>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-white/60 dark:bg-[#24201D]/50 border-b border-[#E9DDCC] dark:border-[#3D352E] flex items-center gap-2 overflow-x-auto text-xs transition-colors">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(language === 'ar' ? q.ar : q.en)}
              className="px-2.5 py-1 bg-[#F8F4EC] dark:bg-[#2D2723] hover:bg-[#E9DDCC] dark:hover:bg-[#3D352E] text-[#765541] dark:text-[#D4BFA8] rounded-full text-[11px] font-medium border border-[#E9DDCC] dark:border-[#3D352E] shrink-0 whitespace-nowrap transition-colors"
            >
              {language === 'ar' ? q.ar : q.en}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8F4EC]/60 dark:bg-[#191614]/80 transition-colors">
          {messages.map((m) => {
            const isMe = m.senderId === user?.id || m.senderId === 'user-tenant-1';
            return (
              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-[#C47D60] dark:bg-[#D8896C] text-white rounded-br-none shadow-sm'
                      : 'bg-white dark:bg-[#24201D] text-[#34332F] dark:text-[#EDE6DE] border border-[#E9DDCC] dark:border-[#3D352E] rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5 px-1 font-mono">
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white dark:bg-[#24201D] border-t border-[#E9DDCC] dark:border-[#3D352E] flex items-center gap-2 transition-colors"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={
              language === 'ar' ? 'اكتب رسالتك هنا بكل وضوح...' : 'Type a clear message...'
            }
            className="flex-1 px-3.5 py-2.5 text-xs bg-[#F8F4EC] dark:bg-[#191614] border border-[#E9DDCC] dark:border-[#3D352E] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C47D60] text-[#34332F] dark:text-[#EDE6DE] placeholder:text-stone-400 dark:placeholder:text-stone-500"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-2.5 bg-[#C47D60] hover:bg-[#b06a4e] dark:bg-[#D8896C] dark:hover:bg-[#b06a4e] disabled:opacity-40 text-white rounded-xl transition-colors shrink-0"
            aria-label="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
