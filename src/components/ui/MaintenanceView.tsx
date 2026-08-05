import React from 'react';
import { motion } from 'motion/react';
import { LogoFull } from '../brand/LogoFull';
import { Wrench, Phone, MessageCircle, ShieldCheck, Clock, Lock } from 'lucide-react';
import { useAppImages } from '../../context/ImageContext';

export const MaintenanceView: React.FC = () => {
  const { systemConfig, contactData } = useAppImages();

  // Poll server settings and deployment status to auto-refresh when maintenance is disabled
  React.useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/deploy-status');
        const data = await res.json();
        if (data && data.systemConfig) {
          if (data.systemConfig.isMaintenanceMode === false && data.systemConfig.isDeploying === false) {
            window.location.reload();
          }
        }
      } catch (e) {
        // ignore fetch error
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAdminClick = () => {
    window.location.href = '/admin';
  };

  const whatsappUrl = `https://wa.me/${contactData.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Merhaba İrem Comfort, web sitenizdeki bakım çalışması hakkında bilgi almak istiyorum.')}`;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between items-center p-6 relative overflow-hidden font-sans selection:bg-[#082C6C] selection:text-white">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#082C6C]/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header Logo */}
      <header className="w-full max-w-5xl flex items-center justify-between pt-4 z-10">
        <div className="bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-lg">
          <LogoFull className="h-8 text-white" />
        </div>

        <button
          onClick={handleAdminClick}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
          title="Yönetici Girişi"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Yönetici Paneli</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl w-full text-center my-auto py-12 space-y-8 z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative inline-block"
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#082C6C] to-slate-800 border border-amber-500/40 flex items-center justify-center shadow-2xl shadow-blue-900/50 mx-auto">
            <Wrench className="w-12 h-12 text-amber-400 animate-pulse" />
          </div>
          <span className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-widest shadow">
            BAKIM MODU
          </span>
        </motion.div>

        <div className="space-y-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-serif-luxury"
          >
            Sitede Bakım Çalışması Yapılmaktadır
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto font-light leading-relaxed"
          >
            {systemConfig.maintenanceMessage || "Sitemiz sizler için güncellenmekte ve iyileştirilmektedir. Lütfen 2-5 dakika içerisinde tekrar deneyiniz."}
          </motion.p>
        </div>

        {/* Live Timer Notice */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md inline-flex items-center gap-3 text-xs text-amber-300 font-mono font-medium"
        >
          <Clock className="w-4 h-4 text-amber-400 animate-spin" />
          <span>Tahmini Tamamlanma Süresi: 2 - 5 Dakika</span>
        </motion.div>

        {/* Quick Contact Options */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Destek & Sipariş</span>
          </a>

          <a
            href={`tel:${contactData.phone.replace(/[^0-9+]/g, '')}`}
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 flex items-center gap-2 cursor-pointer"
          >
            <Phone className="w-4 h-4 text-amber-400" />
            <span>Müşteri Hizmetleri: {contactData.phone}</span>
          </a>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-slate-500 text-[11px] font-light z-10 pb-4">
        <p>© {new Date().getFullYear()} İrem Comfort Ayakkabıcılık - Tüm Hakları Saklıdır.</p>
      </footer>
    </div>
  );
};
