import React from 'react';
import { LogoFull } from '../brand/LogoFull';
import { CONTACT_DATA, BRAND_NAME } from '../../constants/data';
import { ArrowUp, Instagram, MessageCircle, Mail, MapPin, ShoppingBag } from 'lucide-react';
import { useAppImages } from '../../context/ImageContext';
import { LegalDocType } from '../ui/LegalModal';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onAdminClick?: () => void;
  onOpenLegalDoc?: (docType: LegalDocType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onAdminClick, onOpenLegalDoc }) => {
  const { contactData: liveContact } = useAppImages();
  const contact = liveContact || CONTACT_DATA;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#082C6C] text-white pt-20 pb-12 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Identity Column */}
          <div className="lg:col-span-5 space-y-6">
            <div onClick={() => onNavigate('hero')} className="cursor-pointer">
              <LogoFull iconSize={42} color="#FFFFFF" showText={true} />
            </div>

            <p className="text-sm text-white/70 font-light max-w-md leading-relaxed">
              %100 hakiki deri bayan comfort terlik ve sandalet üretimi. Anatomik konfor taban ve el işçiliği dikiş kalitesiyle Manisa Ayakkabıcılar Sitesindeki imalathanemizde üretilmektedir.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              {contact.trendyolUrl && (
                <a
                  href={contact.trendyolUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-full bg-[#F27A1A] hover:bg-[#d9660c] text-white text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all shadow-md"
                  aria-label="Trendyol Mağazamız"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Trendyol</span>
                </a>
              )}

              <a
                href={contact.instagramUrl || "https://www.instagram.com/irem.comfort"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#082C6C] flex items-center justify-center transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>

              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#0A2D6F] flex items-center justify-center transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>

              <a
                href={`mailto:${contact.email}`}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#0A2D6F] flex items-center justify-center transition-all"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Column */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/60">
              Site Navigasyonu
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-white/80">
              <li>
                <button onClick={() => onNavigate('hero')} className="hover:text-white transition-colors cursor-pointer">
                  Ana Sayfa
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
                  Hakkımızda
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('collection')} className="hover:text-white transition-colors cursor-pointer">
                  Özel Koleksiyon
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('craftsmanship')} className="hover:text-white transition-colors cursor-pointer">
                  El İşçiliği & Deri
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('why-us')} className="hover:text-white transition-colors cursor-pointer">
                  Neden Biz?
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors cursor-pointer">
                  İletişim & Katalog
                </button>
              </li>
            </ul>
          </div>

          {/* Flagship Showroom Column */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/60">
              Manisa Showroom & Atölye
            </h4>
            <div className="space-y-3 text-sm text-white/80 font-light">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-white/60 shrink-0 mt-1" />
                <span>{contact.address}</span>
              </div>
              <p className="text-xs text-white/60 pt-2 border-t border-white/10">
                Manisa • İstanbul • Özel Proje Gönderimi
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} {BRAND_NAME}. Tüm Hakları Saklıdır. www.iremcomfort.com</p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              onClick={() => onOpenLegalDoc && onOpenLegalDoc('privacy')}
              className="hover:text-white transition-colors cursor-pointer text-xs"
            >
              Gizlilik Politikamız
            </button>
            <button
              onClick={() => onOpenLegalDoc && onOpenLegalDoc('kvkk')}
              className="hover:text-white transition-colors cursor-pointer text-xs"
            >
              KVKK Metni
            </button>
            <button
              onClick={() => onOpenLegalDoc && onOpenLegalDoc('cookies')}
              className="hover:text-white transition-colors cursor-pointer text-xs"
            >
              Çerez Politikası
            </button>
            {onAdminClick ? (
              <button
                onClick={onAdminClick}
                className="hover:text-white text-white/40 transition-colors cursor-pointer text-[11px]"
              >
                Yönetici Girişi
              </button>
            ) : (
              <a
                href="#admin"
                className="hover:text-white text-white/40 transition-colors cursor-pointer text-[11px]"
              >
                Yönetici Girişi
              </a>
            )}

            {/* Back To Top Button */}
            <button
              onClick={scrollToTop}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#0A2D6F] flex items-center justify-center transition-all cursor-pointer"
              aria-label="Yukarı Çık"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
