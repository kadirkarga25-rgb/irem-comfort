/**
 * IC CMS PRO - Volume 2D: Human Support Handover Form Modal
 * Collects contact information, subject, optional phone, and optional newsletter opt-in.
 * Never auto-transfers. Requires visitor confirmation.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserCheck, X, Send, ShieldCheck, Mail, Phone, User, FileText, CheckCircle2 } from 'lucide-react';
import { adminSettingsService } from '../../services/adminSettings';
import { crmService } from '../../services/crmService';

interface HumanSupportHandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (fullName: string) => void;
}

export const HumanSupportHandoverModal: React.FC<HumanSupportHandoverModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess
}) => {
  const settings = adminSettingsService.getSettings();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Toptan / Özel Üretim / Müşteri Destek');
  const [message, setMessage] = useState('');
  const [newsletterOptIn, setNewsletterOptIn] = useState(false); // CRITICAL: Never preselect it
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);

    // 1. Update Local CRM
    crmService.setHumanSupportRequested({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      subject: subject.trim(),
      message: message.trim(),
      newsletterConsent: newsletterOptIn
    });

    // 2. Submit lead to server endpoint
    try {
      await fetch('/api/contact/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          inquiryType: subject.trim(),
          message: message.trim(),
          newsletterOptIn
        })
      });
    } catch {
      // Offline / local fallback
    }

    setIsSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      onSubmitSuccess(fullName.trim());
      onClose();
      setSubmitted(false);
      setFullName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setNewsletterOptIn(false);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#082C6C] via-[#0b357f] to-[#124BAA] p-5 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Canlı Müşteri Temsilcisi Talebi</h3>
                <p className="text-[11px] text-slate-200 font-medium">
                  {settings.supportWorkingHours}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Talebiniz Alındı!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                {settings.automaticReplyMessage}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {settings.humanTransferMessage}
              </p>

              <div className="space-y-3">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Adınız Soyadınız <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="Örn: Mehmet Yılmaz"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#082C6C] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    E-posta Adresiniz <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="ornek@domain.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#082C6C] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Phone (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Telefon / WhatsApp <span className="text-slate-400 font-normal">(İsteğe Bağlı)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      placeholder="0532 000 00 00"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#082C6C] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Görüşme Konusu <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <select
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#082C6C] outline-none"
                    >
                      <option value="Toptan Sipariş ve Bayilik">Toptan Sipariş ve Bayilik</option>
                      <option value="Özel İmalat ve Numune Talebi">Özel İmalat ve Numune Talebi</option>
                      <option value="Numara ve Kalıp Tavsiyesi">Numara ve Kalıp Tavsiyesi</option>
                      <option value="Sipariş Durumu ve Kargo">Sipariş Durumu ve Kargo</option>
                      <option value="Diğer Sorular">Diğer Sorular</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Temsilcimize İletmek İstediğiniz Not <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Lütfen sormak istediğiniz konuyu kısaca özetleyiniz..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#082C6C] outline-none"
                  />
                </div>

                {/* Newsletter Checkbox (Unchecked by default) */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newsletterOptIn}
                      onChange={e => setNewsletterOptIn(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#082C6C] rounded border-slate-300 focus:ring-[#082C6C]"
                    />
                    <span className="text-[11px] text-slate-600 leading-snug">
                      {settings.newsletterText}
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#082C6C] hover:bg-[#0b357f] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Gönderiliyor...' : 'Temsilciye Bağlan'}</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
