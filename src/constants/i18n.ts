import { Language } from '../types';

export interface TranslationDictionary {
  // Navigation & Common UI
  navProductsPage: string;
  navCollection: string;
  navCraftsmanship: string;
  navAbout: string;
  navWhyUs: string;
  navTestimonials: string;
  navContact: string;
  navFaq: string;
  navFair: string;
  navCatalog: string;
  navOnlineStore: string;

  // Products Page
  productsTitle: string;
  productsSub: string;
  productsCategoryAll: string;
  productsShareBtn: string;
  productsDetailsBtn: string;
  productsBackToHome: string;
  
  // Hero Section
  heroBadge: string;
  heroTitle: string;
  heroDesc: string;
  heroBtnPrimary: string;
  heroBtnSecondary: string;
  heroSignatureTitle: string;
  heroSignatureSub: string;

  // Fair Modal & Envelope
  fairInviteHeader: string;
  fairInviteTitle: string;
  fairCutInstruction: string;
  fairCutPercent: string;
  fairDragInstruction: string;
  fairOpenButton: string;
  fairStandInfo: string;
  fairCountdownStarted: string;
  fairCountdownDays: string;
  fairCountdownHours: string;
  fairCountdownMins: string;
  fairCountdownSecs: string;
  fairAppointmentBtn: string;
  fairMapBtn: string;
  fairCloseBtn: string;

  // Testimonials
  testimonialsBadge: string;
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  testimonialsAll: string;
  testimonialsWholesale: string;
  testimonialsRetail: string;
  testimonialsSubmitBtn: string;
  testimonialsVerified: string;
  testimonialsFormTitle: string;
  testimonialsFormName: string;
  testimonialsFormRole: string;
  testimonialsFormComment: string;
  testimonialsFormProduct: string;
  testimonialsFormType: string;
  testimonialsFormSubmit: string;

  // Contact
  contactBadge: string;
  contactTitle: string;
  contactSubtitle: string;
  contactWholesaleNotice: string;
  contactFormName: string;
  contactFormPhone: string;
  contactFormSubject: string;
  contactFormMessage: string;
  contactFormSend: string;
  contactAddress: string;
  contactHours: string;
  contactDirectCall: string;

  // Footer & Misc
  footerCopyright: string;
  footerTagline: string;
  footerRights: string;
  legalPrivacy: string;
  legalKvkk: string;
  legalCookies: string;
  searchPlaceholder: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  tr: {
    navProductsPage: "Ürünlerimiz",
    navCollection: "Koleksiyon",
    navCraftsmanship: "Atölyemiz",
    navAbout: "Hakkımızda",
    navWhyUs: "Neden Biz",
    navTestimonials: "Referanslar",
    navContact: "İletişim",
    navFaq: "Sıkça Sorulan Sorular",
    navFair: "Fuar Daveti",
    navCatalog: "Katalog İndir",
    navOnlineStore: "Trendyol (Anavelle)",

    productsTitle: "Tüm Ürünlerimiz & Sezon Kataloğu",
    productsSub: "Manisa imalatımız hakiki deri bayan terlik, sandalet ve ortopedik sabo koleksiyonumuz.",
    productsCategoryAll: "Tüm Kategoriler",
    productsShareBtn: "Paylaş",
    productsDetailsBtn: "Detayları İncele",
    productsBackToHome: "Ana Sayfaya Dön",

    heroBadge: "Kuruluş 1993 • Manisa Ayakkabıcılar Sitesi İmalatı",
    heroTitle: "Bayan Comfort Deri Sandalet & Terlik.",
    heroDesc: "%100 Hakiki deri saya, ortopedik kavisli anatomik taban ve Manisa atölyemizin usta el işçiliği. Gün boyu adımlarınıza hafiflik ve zarif konfor katan yeni sezon modellerimizi keşfedin.",
    heroBtnPrimary: "Koleksiyonu Keşfet",
    heroBtnSecondary: "Atölyemiz",
    heroSignatureTitle: "Çift Tokalı Hakiki Deri Terlik",
    heroSignatureSub: "Yumuşak Dana Derisi Saya • Anatomik Yumuşak Konfor Taban",

    fairInviteHeader: "SAYIN ZİYARETÇİMİZ, DAVETLİSİNİZ!",
    fairInviteTitle: "AYMOD Uluslararası Ayakkabı Moda Fuarı",
    fairCutInstruction: "Üstünü Çizgiden Kesin",
    fairCutPercent: "KESİLDİ",
    fairDragInstruction: "─── ✂️ MAKASI SAĞA KAYDIRIN VEYA TIKLAYIN ───",
    fairOpenButton: "✂️ DAVETİYEYİ KESİP AÇ & İNCELE",
    fairStandInfo: "Stand & Konum Bilgisi",
    fairCountdownStarted: "FUARIMIZ BAŞLADI!",
    fairCountdownDays: "GÜN",
    fairCountdownHours: "SAAT",
    fairCountdownMins: "DAKİKA",
    fairCountdownSecs: "SANİYE",
    fairAppointmentBtn: "WhatsApp'tan Randevu Al",
    fairMapBtn: "Haritada Konumu Aç",
    fairCloseBtn: "Siteye Devam Et",

    testimonialsBadge: "GÜVEN VE MEMNUNİYET",
    testimonialsTitle: "Müşteri Yorumları & Referanslar",
    testimonialsSubtitle: "Atölyemizden sipariş veren toptan mağazalarımız ve perakende müşterilerimizin değerlendirmeleri.",
    testimonialsAll: "Tüm Yorumlar",
    testimonialsWholesale: "Toptan / Butik Müşterileri",
    testimonialsRetail: "Perakende Müşterileri",
    testimonialsSubmitBtn: "Siz de Değerlendirme Yapın",
    testimonialsVerified: "Onaylı Müşteri",
    testimonialsFormTitle: "Değerlendirmenizi Gönderin",
    testimonialsFormName: "Adınız Soyadınız / Mağaza Adınız",
    testimonialsFormRole: "Unvan / Şehir (Örn: İzmir Elegance Butik)",
    testimonialsFormComment: "Yorumunuz & Deneyiminiz",
    testimonialsFormProduct: "Aldığınız Model / Ürün",
    testimonialsFormType: "Müşteri Tipi",
    testimonialsFormSubmit: "Yorumu Yayınla",

    contactBadge: "DOĞRUDAN ULAŞIN",
    contactTitle: "İletişim & Fabrika Showroom",
    contactSubtitle: "Toptan katalog talebi, özel siparişler veya perakende danışmanlığı için Manisa atölyemizle iletişime geçin.",
    contactWholesaleNotice: "Toptan sipariş ve bayilik görüşmeleri için doğrudan WhatsApp hattımızdan kataloğumuzu talep edebilirsiniz.",
    contactFormName: "Adınız Soyadınız / Firma Adı",
    contactFormPhone: "Telefon / WhatsApp Numaranız",
    contactFormSubject: "Konu (Toptan / Perakende / Özel Üretim)",
    contactFormMessage: "Mesajınız...",
    contactFormSend: "Mesajı Gönder",
    contactAddress: "Manisa Ayakkabıcılar Sitesi 5757.Sk No:21/A Yunusemre/Manisa",
    contactHours: "Pzt - Cmt: 08:30 - 19:00",
    contactDirectCall: "Doğrudan İletişim Hatları",

    footerCopyright: "İrem Comfort Hakiki Deri Ayakkabı & Terlik Sanayi. Tüm hakları saklıdır.",
    footerTagline: "Manisa Ayakkabıcılar Sitesi Atölye Üretimi • %100 Hakiki Deri Bayan Comfort Terlik & Sandalet",
    footerRights: "Tüm hakları saklıdır.",
    legalPrivacy: "Gizlilik Politikası",
    legalKvkk: "KVKK Aydınlatma Metni",
    legalCookies: "Çerez Politikası",
    searchPlaceholder: "Model veya kategori ara..."
  },

  en: {
    navProductsPage: "Our Products",
    navCollection: "Collection",
    navCraftsmanship: "Our Workshop",
    navAbout: "About Us",
    navWhyUs: "Why Choose Us",
    navTestimonials: "Testimonials",
    navContact: "Contact",
    navFaq: "FAQ",
    navFair: "Fair Invitation",
    navCatalog: "Download Catalog",
    navOnlineStore: "Trendyol Store",

    productsTitle: "All Products & Seasonal Catalog",
    productsSub: "Handcrafted genuine leather women's slippers, sandals and orthopedic clogs from our Manisa workshop.",
    productsCategoryAll: "All Categories",
    productsShareBtn: "Share",
    productsDetailsBtn: "View Details",
    productsBackToHome: "Return to Home",

    heroBadge: "Est. 1993 • Manufactured in Manisa Footwear Industrial Estate",
    heroTitle: "Women's Comfort Genuine Leather Sandals & Slippers.",
    heroDesc: "100% Genuine leather uppers, orthopedic anatomical curved soles, and master craftsmanship from our Manisa workshop. Discover our new season collection delivering all-day lightness and elegance.",
    heroBtnPrimary: "Explore Collection",
    heroBtnSecondary: "Our Workshop",
    heroSignatureTitle: "Double-Buckle Genuine Leather Slipper",
    heroSignatureSub: "Soft Calfskin Leather Upper • Anatomical Soft Comfort Sole",

    fairInviteHeader: "DEAR VISITOR, YOU ARE INVITED!",
    fairInviteTitle: "AYMOD International Footwear Fashion Fair",
    fairCutInstruction: "Cut Along The Dotted Line",
    fairCutPercent: "CUT",
    fairDragInstruction: "─── ✂️ SLIDE SCISSORS TO RIGHT OR CLICK ───",
    fairOpenButton: "✂️ CUT ENVELOPE TO OPEN & INSPECT",
    fairStandInfo: "Stand & Location Details",
    fairCountdownStarted: "THE FAIR HAS STARTED!",
    fairCountdownDays: "DAYS",
    fairCountdownHours: "HOURS",
    fairCountdownMins: "MINS",
    fairCountdownSecs: "SECS",
    fairAppointmentBtn: "Book Appointment on WhatsApp",
    fairMapBtn: "Open Location on Map",
    fairCloseBtn: "Continue to Website",

    testimonialsBadge: "TRUST & SATISFACTION",
    testimonialsTitle: "Customer Reviews & References",
    testimonialsSubtitle: "Feedback from boutique store partners and retail customers ordering from our factory.",
    testimonialsAll: "All Reviews",
    testimonialsWholesale: "Wholesale Boutique Partners",
    testimonialsRetail: "Retail Customers",
    testimonialsSubmitBtn: "Leave a Review",
    testimonialsVerified: "Verified Buyer",
    testimonialsFormTitle: "Submit Your Feedback",
    testimonialsFormName: "Full Name / Store Name",
    testimonialsFormRole: "Title / City (e.g. Istanbul Boutique Owner)",
    testimonialsFormComment: "Your Review & Experience",
    testimonialsFormProduct: "Purchased Model",
    testimonialsFormType: "Customer Type",
    testimonialsFormSubmit: "Publish Review",

    contactBadge: "GET IN TOUCH",
    contactTitle: "Contact & Factory Showroom",
    contactSubtitle: "Contact our Manisa workshop for wholesale catalogs, custom orders, or export inquiries.",
    contactWholesaleNotice: "Request our wholesale export catalog directly via WhatsApp.",
    contactFormName: "Full Name / Company Name",
    contactFormPhone: "Phone / WhatsApp Number",
    contactFormSubject: "Subject (Wholesale / Export / Custom)",
    contactFormMessage: "Your message...",
    contactFormSend: "Send Message",
    contactAddress: "Manisa Footwear Estate 5757. St No:21/A Manisa / Turkey",
    contactHours: "Mon - Sat: 08:30 - 19:00",
    contactDirectCall: "Direct Contact Lines",

    footerCopyright: "Irem Comfort Genuine Leather Footwear Ltd. All rights reserved.",
    footerTagline: "Handcrafted in Manisa Footwear Estate • 100% Genuine Leather Women Comfort Footwear",
    footerRights: "All rights reserved.",
    legalPrivacy: "Privacy Policy",
    legalKvkk: "GDPR / KVKK Notice",
    legalCookies: "Cookie Policy",
    searchPlaceholder: "Search models or categories..."
  },

  ar: {
    navProductsPage: "منتجاتنا",
    navCollection: "المجموعة",
    navCraftsmanship: "ورشتنا",
    navAbout: "عن الشركة",
    navWhyUs: "لماذا نحن",
    navTestimonials: "آراء العملاء",
    navContact: "اتصل بنا",
    navFaq: "الأسئلة الشائعة",
    navFair: "دعوة المعرض",
    navCatalog: "تحميل الكتالوج",
    navOnlineStore: "متجر ترينديول",

    productsTitle: "جميع المنتجات وكتالوج الموسم",
    productsSub: "شباشب وصنادل نسائية جلد طبيعي ونعل طبي مصنوعة في ورشتنا بمانيسا.",
    productsCategoryAll: "جميع الفئات",
    productsShareBtn: "مشاركة",
    productsDetailsBtn: "معاينة التفاصيل",
    productsBackToHome: "العودة إلى الرئيسية",

    heroBadge: "تأسست ١٩٩٣ • صناعة ورش مانيسا للأحذية الجلدية",
    heroTitle: "صنادل وشباشب نسائية مريحة من الجلد الطبيعي.",
    heroDesc: "جلد طبيعي ١٠٠٪، نعل طبّي مريح، وحرفية عالية من ورشتنا في مانيسا. اكتشف تشكيلة الموسم الجديد لخفة وراحة طوال اليوم.",
    heroBtnPrimary: "استكشف المجموعة",
    heroBtnSecondary: "ورشتنا",
    heroSignatureTitle: "شبشب من الجلد الطبيعي بمشبك مزدوج",
    heroSignatureSub: "وجه من جلد البقر الناعم • نعل طبي مريح للغاية",

    fairInviteHeader: "زائرنا العزيز، أنت مدعو!",
    fairInviteTitle: "معرض أيمود الدولي لموضة الأحذية",
    fairCutInstruction: "اقطع على طول الخط المنقط",
    fairCutPercent: "مقطوع",
    fairDragInstruction: "─── ✂️ اسحب المقص لليمين أو انقر ───",
    fairOpenButton: "✂️ اقطع الظرف للفتح والمعاينة",
    fairStandInfo: "تفاصيل الجناح والموقع",
    fairCountdownStarted: "بدأ المعرض الآن!",
    fairCountdownDays: "أيام",
    fairCountdownHours: "ساعة",
    fairCountdownMins: "دقيقة",
    fairCountdownSecs: "ثانية",
    fairAppointmentBtn: "احجز موعد عبر الواتساب",
    fairMapBtn: "افتح الموقع على الخريطة",
    fairCloseBtn: "المتابعة إلى الموقع",

    testimonialsBadge: "الثقة والرضا",
    testimonialsTitle: "آراء العملاء والشركاء",
    testimonialsSubtitle: "تقييمات أصحاب المحلات التجارية والعملاء الذين اشتروا من ورشتنا.",
    testimonialsAll: "جميع التقييمات",
    testimonialsWholesale: "عملاء الجملة والمحلات",
    testimonialsRetail: "عملاء التجزئة",
    testimonialsSubmitBtn: "أضف تقييمك",
    testimonialsVerified: "مشتري معتمد",
    testimonialsFormTitle: "إرسال تقييمك",
    testimonialsFormName: "الاسم الكامل / اسم المتجر",
    testimonialsFormRole: "الصفة / المدينة",
    testimonialsFormComment: "تقييمك وتجربتك",
    testimonialsFormProduct: "المنتج أو الموديل",
    testimonialsFormType: "نوع العميل",
    testimonialsFormSubmit: "نشر التقييم",

    contactBadge: "تواصل مباشر",
    contactTitle: "الاتصال ومعرض المصنع",
    contactSubtitle: "تواصل مع ورشتنا في مانيسا لطلب كتالوج الجملة والتصدير أو الطلبات الخاصة.",
    contactWholesaleNotice: "اطلب كتالوج الجملة والتصدير مباشرة عبر واتساب.",
    contactFormName: "الاسم / اسم الشركة",
    contactFormPhone: "رقم الهاتف / الواتساب",
    contactFormSubject: "الموضوع (جملة / تصدير / إنتاج خاص)",
    contactFormMessage: "رسالتك...",
    contactFormSend: "إرسال الرسالة",
    contactAddress: "المنطقة الصناعية للأحذية مانيسا - تركيا",
    contactHours: "الإثنين - السبت: ٠٨:٣٠ - ١٩:٠٠",
    contactDirectCall: "خطوط الاتصال المباشر",

    footerCopyright: "جميع الحقوق محفوظة لشركة إيريم كومفورت للأحذية الجلدية.",
    footerTagline: "صناعة يدوية في مانيسا • أحذية وشباشب نسائية جلد طبيعي ١٠٠٪",
    footerRights: "جميع الحقوق محفوظة.",
    legalPrivacy: "سياسة الخصوصية",
    legalKvkk: "حماية البيانات الشخصية",
    legalCookies: "سياسة ملفات تعريف الارتباط",
    searchPlaceholder: "البحث عن موديل أو فئة..."
  }
};
