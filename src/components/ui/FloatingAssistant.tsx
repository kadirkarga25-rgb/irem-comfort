import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useConversation } from '../../context/ConversationContext';
import { CONTACT_DATA } from '../../constants/data';
import { HumanSupportHandoverModal } from './HumanSupportHandoverModal';
import { ConversationRatingModal } from './ConversationRatingModal';
import { 
  MessageSquare, X, Send, Bot, Sparkles, 
  ExternalLink, Phone, ShieldCheck, ChevronDown, 
  Trash2, Layers, Tag, ArrowRight, CornerDownLeft,
  Scale, Eye, CheckCircle, Star, UserCheck, Headset,
  ThumbsUp, Heart
} from 'lucide-react';

export const FloatingAssistant: React.FC = () => {
  const {
    isOpen,
    hasUnread,
    activeProduct,
    messages,
    proactiveBubbleText,
    crmRecord,
    isHumanSupportModalOpen,
    sessionId,
    toggleChat,
    openChat,
    closeChat,
    sendMessage,
    dismissProactiveBubble,
    clearConversation,
    recordProductView,
    openHumanSupportModal,
    closeHumanSupportModal,
    submitHumanSupportSuccess
  } = useConversation();

  const [input, setInput] = useState('');
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      
      // Prevent background body scroll on mobile viewports when chat is open
      const originalOverflow = document.body.style.overflow;
      if (window.innerWidth < 640) {
        document.body.style.overflow = 'hidden';
      }
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [messages, isOpen]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const handleQuickAction = (payload: string) => {
    sendMessage(payload);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none">
      
      {/* 1. Proactive Floating Bubble Tooltip */}
      <AnimatePresence>
        {!isOpen && proactiveBubbleText && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-16 right-0 mb-2 w-72 sm:w-80 bg-white rounded-2xl p-4 shadow-2xl border border-[#082C6C]/15 z-50 overflow-hidden"
          >
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
              <div className="flex items-center gap-2 text-[#082C6C] font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>İrem Comfort Satış Danışmanı</span>
              </div>
              <button
                onClick={dismissProactiveBubble}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p 
              onClick={openChat}
              className="text-xs text-slate-700 leading-relaxed font-medium cursor-pointer hover:text-[#082C6C] transition-colors"
            >
              {proactiveBubbleText}
            </p>

            <button
              onClick={openChat}
              className="mt-3 w-full py-1.5 px-3 bg-[#082C6C] hover:bg-[#061f4d] text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <span>Danışmana Sorun</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Floating Toggle Button */}
      {!isOpen && (
        <motion.button
          onClick={toggleChat}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#082C6C] via-[#0D3B8B] to-[#124BAA] text-white shadow-2xl border-2 border-white/80 flex items-center justify-center cursor-pointer overflow-hidden z-40"
          aria-label="Dijital Satış Danışmanı"
        >
          {/* Subtle gold ring effect */}
          <div className="absolute inset-0 rounded-full border border-amber-400/30 group-hover:border-amber-400/70 transition-colors" />

          <Bot className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300 drop-shadow" />

          {/* Unread badge indicator */}
          {hasUnread && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white animate-pulse" />
          )}
        </motion.button>
      )}

      {/* 3. Expanded Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-[92vw] sm:w-[420px] h-[560px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-[#082C6C]/15 flex flex-col overflow-hidden z-50 select-text overscroll-contain"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#082C6C] via-[#0b357f] to-[#124BAA] p-4 text-white flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-amber-300">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold tracking-tight">İrem Comfort Danışman</h3>
                    <span className="px-1.5 py-0.5 rounded bg-amber-400/20 border border-amber-300/40 text-amber-300 font-extrabold text-[9px] tracking-widest uppercase shadow-sm">
                      BETA
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                  </div>
                  <p className="text-[10px] text-purple-200 font-light">
                    {crmRecord.isHumanOperatorActive ? '🟢 Canlı Müşteri Temsilcisi Bağlandı' : 'Canlı Hakiki Deri Asistanı'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsRatingModalOpen(true)}
                  className="p-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors border border-amber-300/40 cursor-pointer"
                  title="Sohbeti Değerlendir"
                >
                  <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span className="hidden sm:inline">Değerlendir</span>
                </button>
                <button
                  onClick={openHumanSupportModal}
                  className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors border border-white/20 cursor-pointer"
                  title="Canlı Temsilciye Bağlan"
                >
                  <Headset className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Canlı Destek</span>
                </button>
                <button
                  onClick={clearConversation}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  title="Sohbeti Temizle"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (messages.length > 2) {
                      setIsRatingModalOpen(true);
                    } else {
                      closeChat();
                    }
                  }}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  aria-label="Kapat & Değerlendir"
                  title="Kapat"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Active Product Context Header Strip */}
            {activeProduct && (
              <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2 flex items-center justify-between text-xs text-amber-900 shrink-0">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Tag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate font-semibold">
                    İncelenen Ürün: <strong className="text-[#082C6C]">{activeProduct.name}</strong>
                  </span>
                </div>
                <span className="text-[10px] bg-amber-200/60 px-2 py-0.5 rounded font-mono shrink-0">Aktif</span>
              </div>
            )}

            {/* Messages Area */}
            <div 
              className="flex-1 p-4 overflow-y-auto overscroll-contain space-y-3.5 bg-slate-50/50"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'visitor' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      msg.sender === 'visitor'
                        ? 'bg-[#082C6C] text-white rounded-br-none shadow-sm'
                        : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line font-medium">{msg.text}</p>

                    {/* Volume 2C: Smart Product Cards (Max 3) */}
                    {msg.smartProductCards && msg.smartProductCards.length > 0 && (
                      <div className="mt-3 space-y-2 text-slate-900">
                        {msg.smartProductCards.map((card, idx) => (
                          <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2 hover:border-[#082C6C]/40 transition-colors">
                            <div className="flex items-start gap-2.5">
                              <img
                                src={card.product.image}
                                alt={card.product.name}
                                className="w-14 h-14 object-cover rounded-lg border border-slate-100 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className="font-bold text-[12px] text-slate-900 truncate block">{card.product.name}</span>
                                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0">
                                    %{card.score} Uyum
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-600 line-clamp-2 leading-tight">{card.matchReason}</p>
                                <div className="mt-1 flex items-center gap-1.5 text-[9px] text-slate-500 font-medium">
                                  <span>{card.product.dimensions}</span>
                                </div>
                              </div>
                            </div>

                            {/* Card Action Buttons */}
                            <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                              <button
                                onClick={() => recordProductView(card.product)}
                                className="flex-1 py-1 px-2 bg-slate-100 hover:bg-[#082C6C] hover:text-white text-slate-800 rounded-md font-bold text-[10px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Detay İncele</span>
                              </button>
                              <button
                                onClick={() => handleQuickAction(`"${card.product.name}" hakkında detaylı bilgi almak istiyorum.`)}
                                className="flex-1 py-1 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-md font-bold text-[10px] text-center transition-colors cursor-pointer"
                              >
                                <span>Soru Sor</span>
                              </button>
                              {card.product.trendyolUrl && (
                                <a
                                  href={card.product.trendyolUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="py-1 px-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-md font-bold text-[10px] transition-colors"
                                  title="Trendyol Mağazası"
                                >
                                  <span>Trendyol ↗</span>
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Volume 2C: Comparison Mode Matrix */}
                    {msg.comparisonData && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-[11px] text-[#082C6C]">
                          <Scale className="w-4 h-4 text-amber-600" />
                          <span>Ürün Karşılaştırma Analizi</span>
                        </div>
                        <div className="space-y-1.5 text-[10px] divide-y divide-slate-200/60">
                          {msg.comparisonData.comparisonPoints.map((point, idx) => (
                            <div key={idx} className="pt-1.5 flex flex-col gap-0.5">
                              <span className="font-extrabold text-slate-700">{point.feature}:</span>
                              <div className="grid grid-cols-2 gap-1 text-[9.5px]">
                                <div className="bg-white p-1.5 rounded border border-slate-200">
                                  <span className="font-bold block text-slate-800">{msg.comparisonData?.productA.name.split(' ')[2] || 'A Model'}:</span>
                                  <span className="text-slate-600">{point.valueA}</span>
                                </div>
                                <div className="bg-white p-1.5 rounded border border-slate-200">
                                  <span className="font-bold block text-slate-800">{msg.comparisonData?.productB.name.split(' ')[2] || 'B Model'}:</span>
                                  <span className="text-slate-600">{point.valueB}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Single Matched Product Fallback Card */}
                    {!msg.smartProductCards && msg.matchedProduct && (
                      <div className="mt-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-slate-900">
                        <div className="flex items-center gap-2">
                          <img
                            src={msg.matchedProduct.image}
                            alt={msg.matchedProduct.name}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                          />
                          <div>
                            <span className="font-bold text-[11px] block">{msg.matchedProduct.name}</span>
                            <span className="text-[10px] text-slate-500 block">{msg.matchedProduct.category}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Interactive Action Buttons */}
                    {msg.actionButtons && msg.actionButtons.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                        {msg.actionButtons.map((btn, idx) => {
                          if (btn.type === 'link' && btn.url) {
                            return (
                              <a
                                key={idx}
                                href={btn.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-1.5 px-3 bg-[#082C6C]/10 hover:bg-[#082C6C]/20 text-[#082C6C] rounded-lg font-bold text-[11px] flex items-center justify-between transition-colors"
                              >
                                <span>{btn.label}</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            );
                          }

                          if (btn.type === 'whatsapp' || btn.type === 'live_support') {
                            return (
                              <button
                                key={idx}
                                onClick={openHumanSupportModal}
                                className="w-full py-1.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg font-bold text-[11px] flex items-center justify-between transition-colors shadow-sm cursor-pointer"
                              >
                                <span>{btn.label || 'Canlı Desteğe Bağlan 🎧'}</span>
                                <Headset className="w-3.5 h-3.5" />
                              </button>
                            );
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => handleQuickAction(btn.payload || btn.label)}
                              className="w-full py-1.5 px-3 bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-900 rounded-lg font-semibold text-[11px] text-left transition-colors cursor-pointer"
                            >
                              {btn.label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                  </div>

                  <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Chips Bar & End Conversation Action */}
            <div className="px-3 py-2 bg-slate-100 border-t border-slate-200/80 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setIsRatingModalOpen(true)}
                className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 border border-amber-500 rounded-full text-[10px] font-extrabold whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-sm flex items-center gap-1"
              >
                <Star className="w-3 h-3 fill-slate-950" />
                <span>Sohbeti Bitir & Değerlendir</span>
              </button>
              {[
                'Kargo ne zaman gelir?',
                'Toptan sipariş şartları',
                'Taraklı ayak terlikleri',
                'Trendyol linki'
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(prompt)}
                  className="px-2.5 py-1 bg-white hover:bg-purple-100 hover:text-purple-900 border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 whitespace-nowrap transition-colors cursor-pointer shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Bir soru yazın..."
                className="flex-1 py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#082C6C]"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-9 h-9 bg-[#082C6C] hover:bg-[#061f4d] disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Human Support Handover Form Modal */}
      <HumanSupportHandoverModal
        isOpen={isHumanSupportModalOpen}
        onClose={closeHumanSupportModal}
        onSubmitSuccess={submitHumanSupportSuccess}
      />

      {/* 5. Visitor Conversation Rating & Evaluation Modal */}
      <ConversationRatingModal
        isOpen={isRatingModalOpen}
        sessionId={sessionId}
        onClose={() => setIsRatingModalOpen(false)}
        onSubmittedSuccess={() => {
          closeChat();
        }}
      />

    </div>
  );
};
