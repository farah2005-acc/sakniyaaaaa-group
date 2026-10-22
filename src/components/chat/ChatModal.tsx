import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, Sparkles, ShieldCheck, MapPin, Building2 } from 'lucide-react';

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

  const recipientName = activeChatRecipient?.name || 'Haj Mahmoud El-Gohary';
  const recipientAvatar = activeChatRecipient?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
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
      <div className="bg-[#F8F4EC] rounded-3xl max-w-lg w-full h-[580px] border border-[#E9DDCC] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-white border-b border-[#E9DDCC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={recipientAvatar}
              alt={recipientName}
              className="w-10 h-10 rounded-full object-cover border border-[#E9DDCC]"
            />
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm text-[#34332F]">
                <span>{recipientName}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#697A58]" />
              </div>
              <p className="text-[10px] text-stone-500">
                {language === 'ar' ? 'محادثة آمنة وموثقة عبر سكنية' : 'Verified in-app secure chat'}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100">
            <X className="w-5 h-5 text-[#765541]" />
          </button>
        </div>

        {/* Property Context Snippet */}
        {propertyCtx && (
          <div className="px-4 py-2 bg-[#E9DDCC]/40 border-b border-[#E9DDCC] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <Building2 className="w-3.5 h-3.5 text-[#C47D60] shrink-0" />
              <span className="font-semibold text-[#34332F] truncate">{propertyCtx.title}</span>
            </div>
            <span className="font-mono font-bold text-[#765541] shrink-0">
              {propertyCtx.price.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
            </span>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-white/60 border-b border-[#E9DDCC] flex items-center gap-2 overflow-x-auto text-xs">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(language === 'ar' ? q.ar : q.en)}
              className="px-2.5 py-1 bg-[#F8F4EC] hover:bg-[#E9DDCC] text-[#765541] rounded-full text-[11px] font-medium border border-[#E9DDCC] shrink-0 whitespace-nowrap"
            >
              {language === 'ar' ? q.ar : q.en}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8F4EC]/60">
          {messages.map((m) => {
            const isMe = m.senderId === user?.id || m.senderId === 'user-tenant-1';
            return (
              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-[#765541] text-white rounded-br-none shadow-sm'
                      : 'bg-white text-[#34332F] border border-[#E9DDCC] rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-stone-400 mt-0.5 px-1 font-mono">
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
          className="p-3 bg-white border-t border-[#E9DDCC] flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={
              language === 'ar' ? 'اكتب رسالتك هنا بكل وضوح...' : 'Type a clear message...'
            }
            className="flex-1 px-3.5 py-2.5 text-xs bg-[#F8F4EC] border border-[#E9DDCC] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C47D60]"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-2.5 bg-[#C47D60] hover:bg-[#b06a4e] disabled:opacity-40 text-white rounded-xl transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
