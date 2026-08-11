import React from 'react';
import { 
  Sparkles, 
  Phone, 
  MessageCircle, 
  Instagram, 
  ShoppingBag, 
  MapPin, 
  Clock, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAppImages } from '../../context/ImageContext';
import { LogoFull } from '../brand/LogoFull';
import { LogoIC } from '../brand/LogoIC';

export function MaintenancePage() {
  const { contactData } = useAppImages();

  return (
    <div className="min-h-screen bg-[#062050] text-white flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[#0A2D6F] selection:text-white">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#0A2D6F]/80 via-[#0A2D6F]/30 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#031027]/90 rounded-full blur-3xl pointer-events-none" />

      {/* BACKGROUND LOGO REFLECTION & WATERMARK EFFECT */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 flex justify-center items-center opacity-10 sm:opacity-15">
        <div className="relative">
          {/* Giant Background Logo Icon */}
          <LogoIC size={560} color="#60A5FA" className="filter drop-shadow-[0_0_90px_rgba(59,130,246,0.6)] transform -rotate-6" />
          {/* Subtle Mirror Reflection below */}
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-full h-48 bg-gradient-to-t from-[#062050] via-[#062050]/80 to-transparent z-10" />
        </div>
      </div>

      {/* Top Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10 border-b border-white/10">
        <div className="flex items-center gap-3">
          <LogoFull iconSize={38} color="#FFFFFF" iremColor="#FFFFFF" comfortColor="#FFFFFF" />
          <div className="border-l border-white/20 pl-3 hidden sm:block">
            <span className="text-[11px] text-blue-200 tracking-widest uppercase font-semibold block">Manisa İmalatı</span>
            <span className="text-[10px] text-slate-300 tracking-wider block">Hakiki Deri Ayakkabı & Terlik</span>
          </div>
        </div>
      </header>

      {/* Main Central Card Section */}
      <main className="w-full max-w-4xl mx-auto px-6 py-12 flex-1 flex flex-col items-center justify-center text-center relative z-10">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-blue-100 text-xs font-medium tracking-wide mb-8 shadow-inner backdrop-blur-md animate-pulse">
          <Sparkles className="w-4 h-4 text-blue-300" />
          <span>Geliştirme & Yenilenme Aşamasında</span>
        </div>

        {/* Official Brand Logo Container with Shadow & Glass Card */}
        <div className="mb-8 relative flex flex-col items-center justify-center group">
          {/* Main Logo Card */}
          <div className="px-8 py-6 sm:px-10 sm:py-8 rounded-3xl bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-white/20 mx-auto flex items-center justify-center transition-transform hover:scale-[1.02] duration-300 relative z-10">
            <LogoFull iconSize={56} color="#0A2D6F" iremColor="#111827" comfortColor="#0A2D6F" />
          </div>

          {/* Mirrored Logo Reflection directly under the card */}
          <div className="w-full max-w-[340px] sm:max-w-[420px] h-12 overflow-hidden pointer-events-none relative -mt-2 opacity-25 filter blur-[0.8px] transform scale-y-[-1] select-none flex justify-center">
            <div className="px-8 py-6 sm:px-10 sm:py-8 rounded-3xl bg-white flex items-center justify-center">
              <LogoFull iconSize={56} color="#0A2D6F" iremColor="#111827" comfortColor="#0A2D6F" />
            </div>
            {/* Fade out reflection mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#062050] via-[#062050]/70 to-transparent" />
          </div>

          {/* Badge */}
          <div className="mt-3 bg-white text-[#062050] text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg border border-blue-900/10 flex items-center gap-2 relative z-10">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>YENİ SEZON ÇOK YAKINDA</span>
          </div>
        </div>

        {/* Main Titles */}
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4 leading-tight drop-shadow-md">
          Web Sitemiz Yenileniyor
        </h1>

        <p className="text-base sm:text-lg text-slate-200 max-w-2xl mb-4 leading-relaxed font-normal">
          Size daha iyi bir alışveriş deneyimi ve yeni sezon <span className="text-white font-semibold underline decoration-blue-400 decoration-2 underline-offset-4">%100 hakiki deri</span> konfor koleksiyonlarımızı sunabilmek için web sitemizi yeniliyoruz.
        </p>

        <p className="text-sm text-slate-300 max-w-lg mb-10 leading-relaxed">
          Çalışmalarımız hızla devam etmektedir. Çok yakında yeni arayüzümüz ve genişletilmiş ürün yelpazemizle yeniden hizmetinizdeyiz.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-12 text-left">
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-1">%100 Hakiki Deri</h3>
              <p className="text-xs text-slate-300 leading-snug">Özel el işçiliği ve ortopedik taban kalitesi.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 shrink-0 mt-0.5">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-1">Kesintisiz İletişim</h3>
              <p className="text-xs text-slate-300 leading-snug">Sipariş ve toptan talepleriniz için bize ulaşabilirsiniz.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-1">Manisa İmalatı</h3>
              <p className="text-xs text-slate-300 leading-snug">Atölyemizden direkt adresinize güvenli teslimat.</p>
            </div>
          </div>
        </div>

        {/* Contact & Social Links Bar */}
        <div className="w-full max-w-2xl bg-white/[0.05] backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6">
          <h2 className="text-xs uppercase tracking-widest text-blue-200 font-semibold mb-4 text-center">
            Sipariş & Bilgi İçin İletişim Kanallarımız
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {/* WhatsApp */}
            {contactData?.whatsapp && (
              <a
                href={`https://wa.me/${contactData.whatsapp}?text=${encodeURIComponent('Merhaba, İrem Comfort web sitenizden ulaşıyorum.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: {contactData.whatsappDisplay || contactData.whatsapp}</span>
              </a>
            )}

            {/* Phone */}
            {contactData?.phone && (
              <a
                href={`tel:${contactData.phone}`}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-medium transition-all duration-200"
              >
                <Phone className="w-4 h-4 text-blue-400" />
                <span>{contactData.phoneDisplay || contactData.phone}</span>
              </a>
            )}

            {/* Instagram */}
            {(contactData?.instagramUrl || contactData?.instagram) && (
              <a
                href={contactData.instagramUrl || `https://instagram.com/${contactData.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 text-pink-300 text-xs font-medium transition-all duration-200"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>Instagram: {contactData.instagram || '@iremcomfort'}</span>
              </a>
            )}

            {/* Trendyol */}
            {contactData?.trendyolUrl && (
              <a
                href={contactData.trendyolUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-300 text-xs font-medium transition-all duration-200"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Trendyol Mağazamız</span>
              </a>
            )}
          </div>

          {contactData?.address && (
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-slate-300 text-center">
              <MapPin className="w-3.5 h-3.5 text-blue-300 shrink-0" />
              <span>{contactData.address}</span>
            </div>
          )}
        </div>

      </main>

      {/* Footer Bar */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300 relative z-10">
        <p>© {new Date().getFullYear()} İrem Comfort — Tüm Hakları Saklıdır. Ayakkabıcılar Sitesi, Manisa.</p>
      </footer>
    </div>
  );
}

