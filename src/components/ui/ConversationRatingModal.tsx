/**
 * IC CMS PRO - Volume 6.1: Visitor Conversation Feedback & Rating Modal
 * Prompts the visitor to rate their AI Assistant conversation experience (1-5 stars)
 * and submit optional written feedback.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, CheckCircle, MessageSquare, HeartHandshake, Send } from 'lucide-react';
import { conversationLogger } from '../../services/ai/conversationLogger';

interface ConversationRatingModalProps {
  isOpen: boolean;
  sessionId: string;
  onClose: () => void;
  onSubmittedSuccess?: () => void;
}

export const ConversationRatingModal: React.FC<ConversationRatingModalProps> = ({
  isOpen,
  sessionId,
  onClose,
  onSubmittedSuccess
}) => {
  const [ratingStars, setRatingStars] = useState<number>(5);
  const [hoverStars, setHoverStars] = useState<number | null>(null);
  const [feedbackNotes, setFeedbackNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    conversationLogger.rateSession(sessionId, ratingStars, feedbackNotes);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ic_assistant_rated', 'true');
    }
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setFeedbackNotes('');
      if (onSubmittedSuccess) onSubmittedSuccess();
      onClose();
    }, 1800);
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 1: return '😞 Çok Yetersiz';
      case 2: return '😐 Geliştirilmeli';
      case 3: return '🙂 Ortalama';
      case 4: return '😊 İyi & Faydalı';
      case 5: return '🤩 Mükemmel Danışmanlık';
      default: return '';
    }
  };

  const activeStarsDisplay = hoverStars || ratingStars;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#082C6C] via-[#0D3B8B] to-[#124BAA] p-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-amber-300 border border-white/20">
                <Star className="w-5 h-5 fill-amber-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight">Sohbet Değerlendirmesi</h3>
                <p className="text-[11px] text-amber-200">İrem Comfort Dijital Danışman Hizmeti</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-3"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-emerald-600 shadow-md">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-800">Değerlendirmeniz Alındı!</h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  Değerli görüşleriniz için çok teşekkür ederiz. İrem Comfort danışmanlık kalitesini sürekli geliştirmeye devam ediyoruz.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleRatingSubmit} className="space-y-5">
                <div className="text-center space-y-1">
                  <p className="text-xs text-slate-600 font-medium">
                    Dijital Asistanımızla gerçekleştirdiğiniz görüşmeden ne derece memnun kaldınız?
                  </p>
                </div>

                {/* Star Rating Controls */}
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingStars(star)}
                        onMouseEnter={() => setHoverStars(star)}
                        onMouseLeave={() => setHoverStars(null)}
                        className="p-1.5 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            star <= activeStarsDisplay
                              ? 'text-amber-400 fill-amber-400 drop-shadow'
                              : 'text-slate-300 fill-slate-100'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <span className="text-xs font-bold text-[#082C6C] bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full shadow-sm">
                    {getRatingLabel(activeStarsDisplay)}
                  </span>
                </div>

                {/* Optional Feedback Comment */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Görüş veya Önerileriniz <span className="text-slate-400 font-normal">(İsteğe Bağlı)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={feedbackNotes}
                    onChange={(e) => setFeedbackNotes(e.target.value)}
                    placeholder="Deneyiminiz hakkında eklemek istediğiniz bir detay var mı?"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 font-medium focus:outline-none focus:border-[#082C6C] resize-none"
                  />
                </div>

                {/* Submit Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Şimdilik Geç
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <span>Değerlendirmeyi Gönder</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
