import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Send, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Lütfen geçerli bir e-posta adresi yazınız.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setMessage(data.message || 'Bültenimize kaydınız başarıyla alındı. Teşekkür ederiz!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Abonelik kaydı oluşturulamadı.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Bir bağlantı hatası oluştu, lütfen tekrar deneyin.');
    }
  };

  return (
    <section className="bg-gradient-to-br from-[#062050] via-[#082C6C] to-[#0A3888] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center space-y-6">
        
        {/* Top Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-amber-300 uppercase tracking-widest">
          <BookOpen className="w-3.5 h-3.5" />
          <span>E-Bülten & Yeni Sezon Kataloğu</span>
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif-luxury tracking-tight text-white">
            Yeni Koleksiyon ve Fuar Haberlerinden Haberdar Olun
          </h2>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
            İrem Comfort hakiki deri terlik ve sandalet yeni sezon modellerimizi, fuar davetiyelerini ve toptan katalog güncellemelerini e-posta adresinize gönderelim.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5 p-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/60">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="E-posta adresinizi giriniz..."
                className="w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder-white/50 text-sm font-medium focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-70"
            >
              {status === 'loading' ? (
                <span>Kaydediliyor...</span>
              ) : (
                <>
                  <span>Bültene Abone Ol</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Feedback Messages */}
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-200 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{message}</span>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-rose-500/20 border border-rose-400/40 rounded-xl text-rose-200 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
              <span>{message}</span>
            </motion.div>
          )}
        </form>

      </div>
    </section>
  );
};
