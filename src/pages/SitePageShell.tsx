import React from 'react';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { FloatingAssistant } from '../components/ui/FloatingAssistant';
import { useAppImages } from '../context/ImageContext';
import { CONTACT_DATA } from '../constants/data';

interface SitePageShellProps {
  children: React.ReactNode;
  title: string;
  eyebrow?: string;
  intro?: string;
  activePath?: string;
  legal?: { open: (doc: any) => void };
  onAdminClick?: () => void;
}

export const SitePageShell: React.FC<SitePageShellProps> = ({ children, title, eyebrow, intro, activePath, legal, onAdminClick }) => {
  const { language } = useAppImages();
  return (
    <div className="ic-site-page min-h-screen bg-[#f7f5f1] text-[#122033]">
      <Header scrollY={0} activeSection={activePath || ''} onNavigate={(path) => { window.history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')); }} />
      <main className="pt-24 sm:pt-28">
        <section className="ic-page-hero border-b border-[#122033]/10 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-14 sm:py-20">
            {eyebrow && <div className="text-[11px] font-extrabold tracking-[0.24em] uppercase text-[#8b6a2b] mb-4">{eyebrow}</div>}
            <h1 className="max-w-4xl text-4xl sm:text-6xl lg:text-7xl font-serif-luxury font-semibold tracking-tight leading-[0.98] text-[#10284d]">{title}</h1>
            {intro && <p className="max-w-3xl mt-6 text-base sm:text-lg text-slate-600 leading-relaxed">{intro}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/toptan-satis" className="inline-flex items-center gap-2 rounded-full bg-[#102f59] text-white px-5 py-3 text-sm font-bold hover:bg-[#0b2445] transition">Toptan Çalışmaya Başlayalım <ArrowRight className="w-4 h-4" /></a>
              <a href={`https://wa.me/${CONTACT_DATA.whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white border border-[#102f59]/20 text-[#102f59] px-5 py-3 text-sm font-bold hover:border-[#102f59] transition"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
            </div>
          </div>
        </section>
        {children}
      </main>
      <Footer onNavigate={(path) => { window.history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')); }} onAdminClick={onAdminClick} onOpenLegalDoc={legal?.open} />
      <FloatingAssistant />
    </div>
  );
};
