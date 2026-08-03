import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CONTACT_DATA } from '../../constants/data';
import { Phone, MessageCircle, Instagram, Mail, MapPin, Send, CheckCircle2, Clock, BadgeCheck, ExternalLink, ShoppingBag } from 'lucide-react';
import { useAppImages } from '../../context/ImageContext';

interface ContactSectionProps {
  prefilledSubject?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ prefilledSubject = '' }) => {
  const { contactData: liveContact } = useAppImages();
  const contact = liveContact || CONTACT_DATA;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    inquiryType: 'Showroom Randevusu',
    message: prefilledSubject ? `İlgilendiğim ürün / konu: ${prefilledSubject}` : ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Store in localStorage as backup
      const existingLeads = JSON.parse(localStorage.getItem('irem_contact_leads') || '[]');
      existingLeads.unshift({
        ...formData,
        id: `LEAD-${Date.now()}`,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('irem_contact_leads', JSON.stringify(existingLeads));

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Contact submit error:', err);
      // Local fallback success
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-32 bg-[#F8F8F8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#0A2D6F] uppercase"
          >
            <span className="w-8 h-[1px] bg-[#0A2D6F]" />
            <span>İletişim & Showroom Danışmanlığı</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-light tracking-tight text-[#111111]"
          >
            Bizimle <span className="font-serif-luxury font-bold text-[#0A2D6F]">İletişime Geçin</span>.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base text-[#111111]/70 font-light"
          >
            Bayan comfort hakiki deri terlik ve sandalet modellerimizi incelemek, katalog talep etmek veya Manisa Ayakkabıcılar Sitesindeki imalathanemizden sipariş vermek için bizimle iletişime geçin.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Trendyol Online Store Card */}
            {CONTACT_DATA.trendyolUrl && (
              <a
                href={CONTACT_DATA.trendyolUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 rounded-2xl bg-gradient-to-r from-[#F27A1A] to-[#E05C00] text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 flex items-center justify-between group cursor-pointer border border-orange-400/30"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white text-[#F27A1A] flex items-center justify-center font-black text-xl shadow-md shrink-0">
                    <ShoppingBag className="w-6 h-6 text-[#F27A1A]" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="bg-white/20 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider">
                        Online Alışveriş
                      </span>
                      <span className="text-xs text-white/90 font-medium">Trendyol Mağazamız</span>
                    </div>
                    <h4 className="text-lg font-bold font-serif-luxury text-white">
                      Trendyol'da İrem Comfort
                    </h4>
                    <p className="text-xs text-white/90 font-light">
                      Modellerimizi Trendyol güvencesiyle online sipariş verin
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 group-hover:bg-white group-hover:text-[#F27A1A] flex items-center justify-center transition-colors text-white shrink-0 ml-2">
                  <ExternalLink className="w-5 h-5" />
                </div>
              </a>
            )}

            {/* Phone Card */}
            <a
              href={`tel:${CONTACT_DATA.phone}`}
              className="p-6 rounded-2xl bg-white border border-[#0A2D6F]/10 hover:border-[#0A2D6F] hover:shadow-lg transition-all duration-300 flex items-center gap-5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0A2D6F]/5 text-[#0A2D6F] group-hover:bg-[#0A2D6F] group-hover:text-white flex items-center justify-center transition-colors">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#0A2D6F] uppercase tracking-wider block">
                  Müşteri Hizmetleri & Telefon
                </span>
                <span className="text-lg font-bold text-[#111111] font-serif-luxury">
                  {CONTACT_DATA.phoneDisplay}
                </span>
              </div>
            </a>

            {/* WhatsApp Card */}
            <a
              href={`https://wa.me/${CONTACT_DATA.whatsapp}?text=Merhaba%20%C4%B0rem%20Comfort%2C%20yeni%20sezon%20ürünleriniz%20ve%20kataloğunuz%20hakkında%20bilgi%20almak%20istiyorum.`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-white border border-[#0A2D6F]/10 hover:border-emerald-500 hover:shadow-lg transition-all duration-300 flex items-center gap-5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                  WhatsApp Danışma Hattı
                </span>
                <span className="text-lg font-bold text-[#111111] font-serif-luxury">
                  {CONTACT_DATA.whatsappDisplay}
                </span>
              </div>
            </a>

            {/* Email Card */}
            <a
              href={`mailto:${CONTACT_DATA.email}`}
              className="p-6 rounded-2xl bg-white border border-[#0A2D6F]/10 hover:border-[#0A2D6F] hover:shadow-lg transition-all duration-300 flex items-center gap-5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0A2D6F]/5 text-[#0A2D6F] group-hover:bg-[#0A2D6F] group-hover:text-white flex items-center justify-center transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#0A2D6F] uppercase tracking-wider block">
                  E-Posta İletişim
                </span>
                <span className="text-base font-bold text-[#111111] font-serif-luxury">
                  {CONTACT_DATA.email}
                </span>
              </div>
            </a>

            {/* Instagram Card with Blue Verified Badge */}
            <a
              href={CONTACT_DATA.instagramUrl || "https://www.instagram.com/irem.comfort"}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-white border border-[#0A2D6F]/10 hover:border-pink-500 hover:shadow-lg transition-all duration-300 flex items-center gap-5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-md">
                <Instagram className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-pink-600 uppercase tracking-wider block">
                    Resmi Instagram
                  </span>
                  <BadgeCheck className="w-4 h-4 fill-[#0095F6] text-white" />
                </div>
                <span className="text-lg font-bold text-[#111111] font-serif-luxury flex items-center gap-1">
                  {CONTACT_DATA.instagram}
                  <BadgeCheck className="w-4 h-4 fill-[#0095F6] text-white inline-block" />
                </span>
              </div>
            </a>

            {/* Showroom Location Box */}
            <div className="p-6 rounded-2xl bg-[#0A2D6F] text-white space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-white/80 shrink-0" />
                <h4 className="font-bold text-base font-serif-luxury">Showroom & Adres</h4>
              </div>
              <p className="text-xs text-white/90 leading-relaxed font-light">
                {CONTACT_DATA.address}
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-[11px] text-white/70">
                <Clock className="w-4 h-4 text-white/60" />
                <span>{CONTACT_DATA.showroomHours}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-3xl border border-[#0A2D6F]/10 shadow-2xl">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8 space-y-6"
                >
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-[#111111] font-serif-luxury">
                      Teşekkür Ederiz, Sayın {formData.fullName}
                    </h3>
                    <p className="text-base text-[#111111]/80 max-w-lg mx-auto font-medium leading-relaxed">
                      Talebiniz alındı, en kısa sürede sizlere geri dönüş sağlanacaktır.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ fullName: '', email: '', phone: '', inquiryType: 'Showroom Randevusu', message: '' });
                    }}
                    className="px-6 py-3 rounded-full bg-[#0A2D6F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#163E87] transition-all cursor-pointer shadow-md"
                  >
                    Yeni Mesaj Gönder
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <span className="text-xs font-bold text-[#0A2D6F] uppercase tracking-widest">
                      İletişim Formu
                    </span>
                    <h3 className="text-2xl font-bold text-[#111111] font-serif-luxury mt-1">
                      Katalog & Bilgi Talebi
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                        Ad Soyad *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Örn: Ahmet Yılmaz"
                        className="w-full px-4 py-3.5 rounded-xl bg-[#F8F8F8] border border-[#0A2D6F]/10 text-sm focus:outline-none focus:border-[#0A2D6F] focus:bg-white transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                        E-Posta Adresi *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Örn: ahmet@example.com"
                        className="w-full px-4 py-3.5 rounded-xl bg-[#F8F8F8] border border-[#0A2D6F]/10 text-sm focus:outline-none focus:border-[#0A2D6F] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                        Telefon Numarası *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0533 029 71 25"
                        className="w-full px-4 py-3.5 rounded-xl bg-[#F8F8F8] border border-[#0A2D6F]/10 text-sm focus:outline-none focus:border-[#0A2D6F] focus:bg-white transition-all"
                      />
                    </div>

                    {/* Inquiry Type */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                        Talebiniz
                      </label>
                      <select
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl bg-[#F8F8F8] border border-[#0A2D6F]/10 text-sm focus:outline-none focus:border-[#0A2D6F] focus:bg-white transition-all"
                      >
                        <option value="Yeni Sezon Kataloğu">Yeni Sezon Terlik & Sandalet Kataloğu</option>
                        <option value="Toptan Sipariş">Toptan Mağaza & B2B Siparişi</option>
                        <option value="Perakende Sipariş">Perakende Sipariş & Model Bilgisi</option>
                        <option value="Atölye Randevusu">Manisa Atölye Ziyareti</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                      Mesajınız / Özel İstekleriniz *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="İlgilendiğiniz modeller, katalog talebi veya özel ölçüleriniz..."
                      className="w-full px-4 py-3.5 rounded-xl bg-[#F8F8F8] border border-[#0A2D6F]/10 text-sm focus:outline-none focus:border-[#0A2D6F] focus:bg-white transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-full bg-[#0A2D6F] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-3 hover:bg-[#163E87] transition-all cursor-pointer shadow-xl active:scale-98 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Gönderiliyor...</span>
                    ) : (
                      <>
                        <span>Talebi Gönder</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};
