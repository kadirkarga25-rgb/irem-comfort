import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, FileText, Cookie, Check } from 'lucide-react';
import { CONTACT_DATA, BRAND_NAME } from '../../constants/data';

export type LegalDocType = 'privacy' | 'kvkk' | 'cookies';

interface LegalModalProps {
  isOpen: boolean;
  initialType?: LegalDocType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialType = 'privacy',
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<LegalDocType>(initialType);

  useEffect(() => {
    setActiveTab(initialType);
  }, [initialType, isOpen]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.body.classList.add('lenis-prevent');
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.classList.remove('lenis-prevent');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.classList.remove('lenis-prevent');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[85vh] sm:max-h-[90vh] lenis-prevent"
          data-lenis-prevent="true"
        >
          {/* Modal Header */}
          <div className="px-6 py-5 bg-[#0A2D6F] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-white font-serif-luxury">
                  Yasal Bilgilendirme ve Politikalar
                </h3>
                <p className="text-xs text-white/70">
                  {BRAND_NAME} • Müşteri Hakları ve Veri Güvenliği
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 shrink-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'privacy'
                  ? 'border-[#0A2D6F] text-[#0A2D6F] bg-white rounded-t-lg shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Gizlilik Politikası</span>
            </button>

            <button
              onClick={() => setActiveTab('kvkk')}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'kvkk'
                  ? 'border-[#0A2D6F] text-[#0A2D6F] bg-white rounded-t-lg shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>KVKK Aydınlatma Metni</span>
            </button>

            <button
              onClick={() => setActiveTab('cookies')}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'cookies'
                  ? 'border-[#0A2D6F] text-[#0A2D6F] bg-white rounded-t-lg shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Cookie className="w-4 h-4" />
              <span>Çerez Politikası</span>
            </button>
          </div>

          {/* Modal Content Area */}
          <div
            className="p-6 sm:p-8 overflow-y-auto overscroll-contain space-y-6 text-slate-700 text-sm leading-relaxed lenis-prevent"
            data-lenis-prevent="true"
            onTouchMove={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            {activeTab === 'privacy' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-xl font-bold text-[#0A2D6F] font-serif-luxury">Gizlilik Politikası</h4>
                  <p className="text-xs text-slate-400 mt-1">Son Güncelleme: 01 Ocak 2026</p>
                </div>

                <p>
                  <strong>{BRAND_NAME}</strong> (Kadir Karga - İrem Comfort Terlik & Sandalet İmalatı, Manisa) olarak, web sitemizi ziyaret eden değerli müşterilerimizin ve iş ortaklarımızın kişisel veri gizliliğine son derece önem veriyoruz.
                </p>

                <h5 className="font-bold text-slate-900 text-base pt-2">1. Toplanan Kişisel Veriler</h5>
                <p>
                  Web sitemiz üzerinden e-bülten kaydı yapmanız, iletişim ve katalog talep formunu doldurmanız veya memnuniyet anketlerimize katılmanız halinde aşağıdaki bilgiler işlenmektedir:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>İletişim Bilgileri:</strong> Ad, soyad, e-posta adresi, telefon numarası.</li>
                  <li><strong>Ticari / İş Bilgileri:</strong> Şehir, firma adı, mağaza veya toptan talep detayları.</li>
                  <li><strong>Teknik & Trafik Verileri:</strong> IP adresi, erişim tarih/saati, tarayıcı türü ve kullanılan çerez (cookie) verileri.</li>
                </ul>

                <h5 className="font-bold text-slate-900 text-base pt-2">2. Verilerin Kullanım Amaçları</h5>
                <p>
                  Toplanan verileriniz yalnızca aşağıdaki meşru amaçlar doğrultusunda kullanılmaktadır:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Toptan ve perakende terlik/sandalet katalog ve fiyat listesi taleplerinizi karşılamak,</li>
                  <li>Sipariş, imalat ve sevkiyat süreçleriyle ilgili bilgilendirme yapmak,</li>
                  <li>Rıza vermeniz halinde yeni sezon ürün koleksiyonları, kampanya ve özel bülten gönderimleri sağlamak,</li>
                  <li>Web sitemizin performansını, güvenliğini ve kullanıcı deneyimini iyileştirmek.</li>
                </ul>

                <h5 className="font-bold text-slate-900 text-base pt-2">3. Veri Güvenliği ve Paylaşım</h5>
                <p>
                  Kişisel verileriniz hiçbir koşulda ticari amaçlarla üçüncü şahıslara satılmaz, kiralanmaz veya izinsiz aktarılmaz. Tüm verileriniz SSL şifrelemeli güvenli sunucularda saklanmakta olup, yasal yükümlülükler dışında yetkisiz erişimlere karşı korunmaktadır.
                </p>

                <h5 className="font-bold text-slate-900 text-base pt-2">4. İletişim Bilgilerimiz</h5>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
                  <p><strong>Unvan:</strong> {BRAND_NAME} Terlik & Sandalet İmalatı</p>
                  <p><strong>Adres:</strong> {CONTACT_DATA.address}</p>
                  <p><strong>E-Posta:</strong> {CONTACT_DATA.email}</p>
                  <p><strong>Telefon / WhatsApp:</strong> {CONTACT_DATA.phoneDisplay}</p>
                </div>
              </div>
            )}

            {activeTab === 'kvkk' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-xl font-bold text-[#0A2D6F] font-serif-luxury">
                    6698 Sayılı KVKK Uyarınca Aydınlatma Metni
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Kişisel Verilerin Korunması Kanunu Kapsamında Bilgilendirme</p>
                </div>

                <p>
                  6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, <strong>{BRAND_NAME}</strong> olarak, Veri Sorumlusu sıfatıyla, kişisel verilerinizi aşağıda açıklanan kapsamda ve mevzuatın öngördüğü sınırlar dâhilinde işlemekteyiz.
                </p>

                <h5 className="font-bold text-slate-900 text-base pt-2">1. Kişisel Verilerin İşlenme Amacı ve Hukuki Sebebi</h5>
                <p>
                  Kişisel verileriniz, KVKK'nın 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları dâhilinde; sözleşmenin kurulması ve ifası, hukuki yükümlülüklerin yerine getirilmesi, veri sorumlusunun meşru menfaatleri ve açık rızanız hukuki sebeplerine dayalı olarak işlenmektedir.
                </p>

                <h5 className="font-bold text-slate-900 text-base pt-2">2. Kişisel Verilerin Aktarılması</h5>
                <p>
                  İşlenen kişisel verileriniz; kanunen yetkili kamu kurum ve kuruluşlarına yasal zorunluluk hallerinde ve e-bülten/iletişim hizmetlerinin teknik alt yapısını sağlayan yetkili sunucu ve bilişim hizmeti sağlayıcılarına aktarılabilmektedir.
                </p>

                <h5 className="font-bold text-slate-900 text-base pt-2">3. KVKK Kapsamındaki Haklarınız (Madde 11)</h5>
                <p>
                  Kanunun 11. maddesi uyarınca veri sahibi olarak aşağıdaki haklara sahipsiniz:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
                  <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme,</li>
                  <li>Kişisel verilerinizin işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                  <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,</li>
                  <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
                  <li>KVKK 7. maddede öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme,</li>
                  <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme.</li>
                </ul>

                <h5 className="font-bold text-slate-900 text-base pt-2">4. Haklarınızı Kullanma Yöntemi</h5>
                <p>
                  Yukarıda belirtilen haklarınızı kullanmak için taleplerinizi içeren dilekçenizi ıslak imzalı olarak Manisa adresimize posta yoluyla iletebilir veya <strong>{CONTACT_DATA.email}</strong> e-posta adresimize güvenli elektronik imza / e-posta ile ulaştırabilirsiniz.
                </p>
              </div>
            )}

            {activeTab === 'cookies' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-xl font-bold text-[#0A2D6F] font-serif-luxury">Çerez (Cookie) Politikası</h4>
                  <p className="text-xs text-slate-400 mt-1">Web Sitemizde Kullanılan Çerezler ve Kullanım Amaçları</p>
                </div>

                <p>
                  {BRAND_NAME} web sitemizde, ziyaretçilerimize daha iyi bir kullanıcı deneyimi sunabilmek, site işlevselliğini sağlamak ve tercihlerinizi hatırlamak amacıyla çerezler (cookies) kullanmaktayız.
                </p>

                <h5 className="font-bold text-slate-900 text-base pt-2">Kullanılan Çerez Türleri</h5>

                <div className="space-y-3 pt-1">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-900 text-xs uppercase tracking-wider text-[#0A2D6F]">
                      1. Zorunlu Çerezler (Strictly Necessary Cookies)
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Web sitemizin temel fonksiyonlarının çalışması, oturum yönetimi ve güvenlik için gereklidir. Bu çerezler engellenemez.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-900 text-xs uppercase tracking-wider text-[#0A2D6F]">
                      2. İşlevsellik ve Tercih Çerezleri (Functionality Cookies)
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Site üzerindeki dil, anket katılım durumunuz, açılış tercihleriniz gibi seçimlerinizi hatırlayarak sonraki ziyaretlerinizde kişiselleştirilmiş deneyim sunar.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-900 text-xs uppercase tracking-wider text-[#0A2D6F]">
                      3. Performans ve Analitik Çerezleri (Performance Cookies)
                    </p>

                    <p className="text-xs text-slate-600 mt-1">
                      Sitemizi kaç kişinin ziyaret ettiğini, hangi sayfaların popüler olduğunu anonim şekilde analiz ederek hizmet kalitemizi artırmamıza yardımcı olur.
                    </p>
                  </div>
                </div>

                <h5 className="font-bold text-slate-900 text-base pt-2">Çerez Tercihlerini Değiştirme</h5>
                <p>
                  Dilediğiniz zaman tarayıcı ayarlarınızdan çerezleri engelleyebilir veya silebilirsiniz. Ancak zorunlu çerezlerin kapatılması durumunda sitemizin bazı alanları düzgün çalışmayabilir.
                </p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-500 hidden sm:inline">
              Sorularınız için: <strong className="text-slate-800">{CONTACT_DATA.email}</strong>
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#0A2D6F] hover:bg-[#082357] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer ml-auto shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>Okudum ve Anladım</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
