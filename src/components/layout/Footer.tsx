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
  const { contactData: liveContact, language, t } = useAppImages();
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
              {language === 'tr'
                ? '%100 hakiki deri bayan comfort terlik ve sandalet üretimi. Anatomik konfor taban ve el işçiliği dikiş kalitesiyle Manisa Ayakkabıcılar Sitesindeki imalathanemizde üretilmektedir.'
                : language === 'en'
                ? '100% genuine leather women\'s comfort slippers and sandals production. Handcrafted with anatomical footbeds at our workshop in Manisa Shoemakers Industrial Estate.'
                : 'إنتاج نعال وصنادل طبية ومريحة للنساء مصنوعة من جلد طبيعي 100% بنعل مريح وخياطة يدوية دقيقة في ورشتنا بمجمع مانيسا للأحذية.'}
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
              {language === 'tr' ? 'Site Navigasyonu' : language === 'en' ? 'Quick Navigation' : 'روابط سريعة'}
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-white/80">
              <li>
                <button onClick={() => onNavigate('hero')} className="hover:text-white transition-colors cursor-pointer">
                  {language === 'tr' ? 'Ana Sayfa' : language === 'en' ? 'Home' : 'الرئيسية'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
                  {t.navAbout || (language === 'tr' ? 'Hakkımızda' : language === 'en' ? 'About Us' : 'عن الشركة')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('collection')} className="hover:text-white transition-colors cursor-pointer">
                  {t.navCollection || (language === 'tr' ? 'Özel Koleksiyon' : language === 'en' ? 'Special Collection' : 'التشكيلة الخاصة')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('craftsmanship')} className="hover:text-white transition-colors cursor-pointer">
                  {t.navCraftsmanship || (language === 'tr' ? 'El İşçiliği & Deri' : language === 'en' ? 'Craftsmanship & Leather' : 'الحرفية والجلد')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('why-us')} className="hover:text-white transition-colors cursor-pointer">
                  {t.navWhyUs || (language === 'tr' ? 'Neden Biz?' : language === 'en' ? 'Why Us?' : 'لماذا نحن؟')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-white transition-colors cursor-pointer">
                  {t.navFaq || (language === 'tr' ? 'Sıkça Sorulan Sorular (SSS)' : language === 'en' ? 'FAQ' : 'الأسئلة الشائعة')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors cursor-pointer">
                  {t.navContact || (language === 'tr' ? 'İletişim & Katalog' : language === 'en' ? 'Contact & Catalog' : 'الاتصال والكتالوج')}
                </button>
              </li>

            </ul>
          </div>

          {/* Flagship Showroom Column */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/60">
              {language === 'tr' ? 'Manisa Showroom & Atölye' : language === 'en' ? 'Manisa Showroom & Workshop' : 'معرض مانيسا والورشة'}
            </h4>
            <div className="space-y-3 text-sm text-white/80 font-light">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-white/60 shrink-0 mt-1" />
                <span>{contact.address}</span>
              </div>
              <p className="text-xs text-white/60 pt-2 border-t border-white/10">
                {language === 'tr'
                  ? 'Manisa • İstanbul • Özel Proje Gönderimi'
                  : language === 'en'
                  ? 'Manisa • Istanbul • Worldwide & Custom Orders'
                  : 'مانيسا • إسطنبول • شحن الطلبات الخاصة'}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>
            © {new Date().getFullYear()} {BRAND_NAME}. {language === 'tr' ? 'Tüm Hakları Saklıdır.' : language === 'en' ? 'All Rights Reserved.' : 'جميع الحقوق محفوظة.'} www.iremcomfort.com
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              onClick={() => onOpenLegalDoc && onOpenLegalDoc('privacy')}
              className="hover:text-white transition-colors cursor-pointer text-xs"
            >
              {language === 'tr' ? 'Gizlilik Politikamız' : language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}
            </button>
            <button
              onClick={() => onOpenLegalDoc && onOpenLegalDoc('kvkk')}
              className="hover:text-white transition-colors cursor-pointer text-xs"
            >
              {language === 'tr' ? 'KVKK Metni' : language === 'en' ? 'Data Protection' : 'حماية البيانات'}
            </button>
            <button
              onClick={() => onOpenLegalDoc && onOpenLegalDoc('cookies')}
              className="hover:text-white transition-colors cursor-pointer text-xs"
            >
              {language === 'tr' ? 'Çerez Politikası' : language === 'en' ? 'Cookie Policy' : 'سياسة ملفات الارتباط'}
            </button>
            {onAdminClick ? (
              <button
                onClick={onAdminClick}
                className="hover:text-white text-white/40 transition-colors cursor-pointer text-[11px]"
              >
                {language === 'tr' ? 'Yönetici Girişi' : language === 'en' ? 'Admin Access' : 'دخول المدير'}
              </button>
            ) : (
              <a
                href="#admin"
                className="hover:text-white text-white/40 transition-colors cursor-pointer text-[11px]"
              >
                {language === 'tr' ? 'Yönetici Girişi' : language === 'en' ? 'Admin Access' : 'دخول المدير'}
              </a>
            )}

            {/* Back To Top Button */}
            <button
              onClick={scrollToTop}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#0A2D6F] flex items-center justify-center transition-all cursor-pointer"
              aria-label={language === 'tr' ? 'Yukarı Çık' : language === 'en' ? 'Back to top' : 'إلى الأعلى'}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
