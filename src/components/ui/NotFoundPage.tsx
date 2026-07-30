import React from 'react';
import { Compass, Home, ShoppingBag, PhoneCall, ArrowLeft, AlertCircle } from 'lucide-react';

interface NotFoundPageProps {
  onReturnToSite?: () => void;
}

export function NotFoundPage({ onReturnToSite }: NotFoundPageProps) {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  const handleGoHome = () => {
    if (onReturnToSite) {
      onReturnToSite();
    } else {
      window.location.href = '/';
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    window.location.href = `/#${sectionId}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#111111] flex flex-col items-center justify-center p-4 sm:p-6 font-sans selection:bg-[#082C6C] selection:text-white relative overflow-hidden">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#082C6C]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#C8A96E]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card Container */}
      <div className="w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl shadow-xl overflow-hidden relative z-10 transition-all duration-300">
        
        {/* Header Band */}
        <div className="bg-[#082C6C] text-white p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#062050] via-[#082C6C] to-[#0A3888] opacity-95" />
          <div className="relative z-10 space-y-2">
            <span className="text-[10px] tracking-[6px] text-[#C8A96E] uppercase font-bold block">
              İrem Comfort Ayakkabıcılık
            </span>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/15 text-[11px] text-[#C8A96E] font-medium my-1">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Sayfa Bulunamadı</span>
            </div>
            <h1 className="text-6xl font-extrabold font-serif tracking-tight text-white my-2">
              404
            </h1>
            <div className="w-12 h-0.5 bg-[#C8A96E] mx-auto opacity-80" />
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 text-center space-y-6">
          
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
              Aradığınız Adres Bulunamadı
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              Aradığınız sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak kullanım dışı kalmış olabilir.
            </p>
          </div>

          {/* Path Badge display */}
          {currentPath && (
            <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 font-mono">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate max-w-[280px]">Geçersiz yol: <strong className="text-slate-900">{currentPath}</strong></span>
            </div>
          )}

          {/* Primary Return Button */}
          <button
            type="button"
            onClick={handleGoHome}
            className="w-full py-3.5 bg-[#082C6C] hover:bg-[#062050] text-white font-bold text-xs uppercase tracking-[2px] rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-[#C8A96E]" />
            <span>Ana Sayfaya Dön</span>
          </button>

          {/* Quick Links Header */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-3">
              Veya bunlara göz atabilirsiniz:
            </span>
            
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleNavigateSection('collection')}
                className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#082C6C] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#C8A96E]" />
                <span>Koleksiyonlar</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigateSection('contact')}
                className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#082C6C] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#C8A96E]" />
                <span>İletişim & Destek</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 text-center text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
          İrem Comfort — Müşteri Hizmetleri
        </div>

      </div>

    </div>
  );
}
