import { Language } from '../types';

export interface TranslationDictionary {
  // Navigation & Common UI
  navHome: string;
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
  moreNav: string;

  // Products Page
  productsTitle: string;
  productsSub: string;
  productsCategoryAll: string;
  productsShareBtn: string;
  productsDetailsBtn: string;
  productsBackToHome: string;
  sizeGuideBtn: string;
  shareCopiedToast: string;
  inquireWhatsAppBtn: string;
  colorsLabel: string;
  sizesLabel: string;
  featuresLabel: string;

  // Hero Section
  heroBadge: string;
  heroTitle: string;
  heroDesc: string;
  heroBtnPrimary: string;
  heroBtnSecondary: string;
  heroSignatureTitle: string;
  heroSignatureSub: string;
  heroSignatureBadge: string;
  heroFeature1Title: string;
  heroFeature1Sub: string;
  heroFeature2Title: string;
  heroFeature2Sub: string;
  heroFeature3Title: string;
  heroFeature3Sub: string;

  // About Section
  aboutBadge: string;
  aboutTitle: string;
  aboutTitleHighlight: string;
  aboutSubtitle: string;
  aboutStoryHeading: string;
  aboutStoryP1: string;
  aboutStoryP2: string;
  aboutStatsYears: string;
  aboutStatsYearsLabel: string;
  aboutStatsLeather: string;
  aboutStatsLeatherLabel: string;
  aboutStatsComfort: string;
  aboutStatsComfortLabel: string;
  aboutPillar1Title: string;
  aboutPillar1Desc: string;
  aboutPillar2Title: string;
  aboutPillar2Desc: string;
  aboutPillar3Title: string;
  aboutPillar3Desc: string;
  aboutPillar4Title: string;
  aboutPillar4Desc: string;

  // Craftsmanship Section
  craftBadge: string;
  craftTitle: string;
  craftTitleHighlight: string;
  craftSubtitle: string;
  craftStagePrefix: string;
  craftStageOf: string;
  craftCriteriaTitle: string;
  craftWorkshopLabel: string;

  // Collection Section
  collectionBadge: string;
  collectionTitle: string;
  collectionTitleHighlight: string;
  collectionSubtitle: string;
  collectionFilterAll: string;
  collectionFilterSlippers: string;
  collectionFilterSandals: string;
  collectionFilterSabo: string;
  collectionFilterCork: string;
  collectionPrevTitle: string;
  collectionNextTitle: string;
  collectionAllProductsBtn: string;

  // Why Us Section
  whyUsBadge: string;
  whyUsTitle: string;
  whyUsTitleHighlight: string;
  whyUsSubtitle: string;

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
  fairStripInviteBadge: string;
  fairStripInviteStand: string;
  fairStripRegisterBtn: string;

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
  testimonialsSuccessMsg: string;

  // FAQ Section
  faqBadge: string;
  faqTitle: string;
  faqTitleHighlight: string;
  faqSubtitle: string;
  faqSearchPlaceholder: string;
  faqCategoryAll: string;
  faqCategoryWholesale: string;
  faqCategoryShipping: string;
  faqCategoryCare: string;
  faqCategorySizing: string;
  faqWhatsappBoxTitle: string;
  faqWhatsappBoxDesc: string;
  faqWhatsappBoxBtn: string;
  faqContactBoxTitle: string;
  faqContactBoxDesc: string;
  faqContactBoxBtn: string;

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
  contactAddressTitle: string;
  contactHours: string;
  contactHoursTitle: string;
  contactDirectCall: string;
  contactGetDirections: string;
  contactTrendyolStoreTitle: string;
  contactTrendyolStoreDesc: string;
  contactSentSuccessTitle: string;
  contactSentSuccessDesc: string;

  // Newsletter
  newsletterBadge: string;
  newsletterTitle: string;
  newsletterDesc: string;
  newsletterPlaceholder: string;
  newsletterBtn: string;
  newsletterSuccess: string;
  newsletterError: string;

  // Footer & Misc
  footerCopyright: string;
  footerTagline: string;
  footerRights: string;
  footerNavTitle: string;
  footerContactTitle: string;
  legalPrivacy: string;
  legalKvkk: string;
  legalCookies: string;
  searchPlaceholder: string;
  backToTop: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  tr: {
    navHome: "Ana Sayfa",
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
    moreNav: "Diğer",

    productsTitle: "Tüm Ürünlerimiz & Sezon Kataloğu",
    productsSub: "Manisa imalatımız hakiki deri bayan terlik, sandalet ve ortopedik sabo koleksiyonumuz.",
    productsCategoryAll: "Tüm Kategoriler",
    productsShareBtn: "Paylaş",
    productsDetailsBtn: "Detayları İncele",
    productsBackToHome: "Ana Sayfaya Dön",
    sizeGuideBtn: "Ayak Ölçü Tablosu",
    shareCopiedToast: "Ürün bağlantısı panoya kopyalandı!",
    inquireWhatsAppBtn: "WhatsApp'tan Bilgi & Sipariş",
    colorsLabel: "Mevcut Renkler",
    sizesLabel: "Numara Seçimi",
    featuresLabel: "Öne Çıkan Özellikler",

    heroBadge: "Kuruluş 1993 • Manisa Ayakkabıcılar Sitesi İmalatı",
    heroTitle: "Bayan Comfort Deri Sandalet & Terlik.",
    heroDesc: "%100 Hakiki deri saya, ortopedik kavisli anatomik taban ve Manisa atölyemizin usta el işçiliği. Gün boyu adımlarınıza hafiflik ve zarif konfor katan yeni sezon modellerimizi keşfedin.",
    heroBtnPrimary: "Koleksiyonu Keşfet",
    heroBtnSecondary: "Atölyemiz",
    heroSignatureTitle: "Çift Tokalı Hakiki Deri Terlik",
    heroSignatureSub: "Yumuşak Dana Derisi Saya • Anatomik Yumuşak Konfor Taban",
    heroSignatureBadge: "İmza Modelimiz",
    heroFeature1Title: "%100",
    heroFeature1Sub: "Hakiki Deri",
    heroFeature2Title: "Anatomik",
    heroFeature2Sub: "Konfor Taban",
    heroFeature3Title: "Yerli",
    heroFeature3Sub: "Manisa İmalatı",

    aboutBadge: "MİRAS & ZANAAT",
    aboutTitle: "1993'ten Beri Manisa'da",
    aboutTitleHighlight: "Hakiki Deri Konforu",
    aboutSubtitle: "Manisa Ayakkabıcılar Sitesi'nde 30 yılı aşkın süredir kadın terlik ve sandalet imalatında kalite, zarafet ve el işçiliğini buluşturuyoruz.",
    aboutStoryHeading: "Atölyemizin Hikayesi & İmalat Tutkusu",
    aboutStoryP1: "İrem Comfort olarak hikayemiz, 1993 yılında Manisa Ayakkabıcılar Sitesi'nde küçük bir zanaat atölyesinde başladı. Kuruluşumuzdan bu yana temel ilkemiz hiç değişmedi: Sentetik ve kalitesiz malzemelerden uzak durarak, kadın ayak anatomisine tam oturan %100 hakiki deri ürünler üretmek.",
    aboutStoryP2: "Bugün atölyemizde usta ellerin dikiş tecrübesi, yenilikçi ortopedik taban teknolojisiyle harmanlanmaktadır. Türkiye genelindeki seçkin butiklerin ve toptan mağazaların güvenilir üretici ortağı olmaktan gurur duyuyoruz.",
    aboutStatsYears: "30+",
    aboutStatsYearsLabel: "Yıllık İmalat Tecrübesi",
    aboutStatsLeather: "%100",
    aboutStatsLeatherLabel: "Hakiki Deri Garantisi",
    aboutStatsComfort: "Anatomik",
    aboutStatsComfortLabel: "Ortopedik Kavis Desteği",
    aboutPillar1Title: "%100 Hakiki Deri",
    aboutPillar1Desc: "Sadece nefes alabilen, terleme yapmayan yumuşak hakiki dana ve kuzu saya derileri kullanıyoruz.",
    aboutPillar2Title: "Manisa İmalat Zanaatı",
    aboutPillar2Desc: "Her bir terlik ve sandalet, Manisa Ayakkabıcılar Sitesindeki atölyemizde tecrübeli ustalarımızca özenle dikilir.",
    aboutPillar3Title: "Anatomik Konfor Taban",
    aboutPillar3Desc: "Ayak kavislerini tam destekleyen, topuk yükünü emen özel ortopedik kavisli taban mimarisi.",
    aboutPillar4Title: "Şık & Fonksiyonel",
    aboutPillar4Desc: "Çift tokalı klasiklerden ortopedik sabolara, hem işte hem günlük yaşamda zarif adımlar.",

    craftBadge: "DİKİŞLERİN ARKASINDAKİ SANAT",
    craftTitle: "Tavizsiz Zanaat ve",
    craftTitleHighlight: "Aşamaları",
    craftSubtitle: "İlk deri seçiminden son cila dokunuşuna kadar her bir İrem Comfort tasarımı dört hassas zanaat aşamasından geçer.",
    craftStagePrefix: "Aşama",
    craftStageOf: "04",
    craftCriteriaTitle: "Kalite Kriterleri",
    craftWorkshopLabel: "Manisa Atölye Üretimi",

    collectionBadge: "ÖNE ÇIKAN SEZON MODELLERİ",
    collectionTitle: "Bayan Comfort",
    collectionTitleHighlight: "Sandalet & Terlik",
    collectionSubtitle: "Manisa atölyemizde imal edilen %100 hakiki deri bayan terlik, sandalet ve ortopedik sabo modellerimizden öne çıkanlar.",
    collectionFilterAll: "Tümü",
    collectionFilterSlippers: "Bayan Terlik",
    collectionFilterSandals: "Bayan Sandalet",
    collectionFilterSabo: "Sabo & Ortopedik",
    collectionFilterCork: "Mantar Taban",
    collectionPrevTitle: "Önceki Modeller",
    collectionNextTitle: "Sonraki Modeller",
    collectionAllProductsBtn: "Tüm Kataloğu İncele",

    whyUsBadge: "İREM COMFORT FARKI",
    whyUsTitle: "Neden",
    whyUsTitleHighlight: "Biz",
    whyUsSubtitle: "Bayan comfort terlik ve sandalet imalatımızı öne çıkaran 5 temel değerimiz.",

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
    fairStripInviteBadge: "Fuar Davetiyesi",
    fairStripInviteStand: "Standımıza Davetlisiniz!",
    fairStripRegisterBtn: "Kayıt & Davetiye Al",

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
    testimonialsSuccessMsg: "Değerlendirmeniz başarıyla eklendi, teşekkür ederiz!",

    faqBadge: "MERAK EDİLENLER",
    faqTitle: "Sıkça Sorulan",
    faqTitleHighlight: "Sorular",
    faqSubtitle: "Hakiki deri kalitesi, toptan sipariş süreci, kalıp detayları ve kargo hakkında merak ettikleriniz.",
    faqSearchPlaceholder: "Sorularda veya konularda ara...",
    faqCategoryAll: "Tüm Sorular",
    faqCategoryWholesale: "Toptan & Üretim",
    faqCategoryShipping: "Kargo & Teslimat",
    faqCategoryCare: "Hakiki Deri Bakımı",
    faqCategorySizing: "Numara & Kalıp",
    faqWhatsappBoxTitle: "Farklı bir sorunuz mu var?",
    faqWhatsappBoxDesc: "Müşteri temsilcimize WhatsApp hattımızdan 7/24 doğrudan yazabilirsiniz.",
    faqWhatsappBoxBtn: "WhatsApp'tan Danışın",
    faqContactBoxTitle: "Fabrika Showroom'u Ziyaret Edin",
    faqContactBoxDesc: "Manisa Ayakkabıcılar Sitesi'ndeki atölyemize çayımızı içmeye bekleriz.",
    faqContactBoxBtn: "İletişim & Harita",

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
    contactAddressTitle: "Showroom & Atölye Adresi",
    contactHours: "Pzt - Cmt: 08:30 - 19:00",
    contactHoursTitle: "Çalışma Saatleri",
    contactDirectCall: "Doğrudan İletişim Hatları",
    contactGetDirections: "Yol Tarifi Al",
    contactTrendyolStoreTitle: "Trendyol Anavelle Mağazamız",
    contactTrendyolStoreDesc: "İrem Comfort modellerimizi Trendyol Anavelle mağazamız güvencesiyle doğrudan sipariş verin.",
    contactSentSuccessTitle: "Mesajınız Bize Ulaştı!",
    contactSentSuccessDesc: "Atölye müşteri temsilcimiz en kısa sürede sizinle iletişime geçecektir.",

    newsletterBadge: "E-BÜLTEN & YENİ SEZON KATALOĞU",
    newsletterTitle: "Yeni Koleksiyon ve Fuar Haberlerinden Haberdar Olun",
    newsletterDesc: "İrem Comfort hakiki deri terlik ve sandalet yeni sezon modellerimizi, fuar davetiyelerini ve toptan katalog güncellemelerini e-posta adresinize gönderelim.",
    newsletterPlaceholder: "E-posta adresinizi giriniz...",
    newsletterBtn: "Bültene Kaydol",
    newsletterSuccess: "Bültenimize kaydınız başarıyla alındı. Teşekkür ederiz!",
    newsletterError: "Lütfen geçerli bir e-posta adresi yazınız.",

    footerCopyright: "İrem Comfort Hakiki Deri Ayakkabı & Terlik Sanayi. Tüm hakları saklıdır.",
    footerTagline: "Manisa Ayakkabıcılar Sitesi Atölye Üretimi • %100 Hakiki Deri Bayan Comfort Terlik & Sandalet",
    footerRights: "Tüm hakları saklıdır.",
    footerNavTitle: "Site Navigasyonu",
    footerContactTitle: "İletişim & Showroom",
    legalPrivacy: "Gizlilik Politikası",
    legalKvkk: "KVKK Aydınlatma Metni",
    legalCookies: "Çerez Politikası",
    searchPlaceholder: "Model veya kategori ara...",
    backToTop: "Yukarı Çık"
  },

  en: {
    navHome: "Home",
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
    moreNav: "More",

    productsTitle: "All Products & Seasonal Catalog",
    productsSub: "Handcrafted genuine leather women's slippers, sandals and orthopedic clogs from our Manisa workshop.",
    productsCategoryAll: "All Categories",
    productsShareBtn: "Share",
    productsDetailsBtn: "View Details",
    productsBackToHome: "Return to Home",
    sizeGuideBtn: "Size Guide",
    shareCopiedToast: "Product link copied to clipboard!",
    inquireWhatsAppBtn: "Inquire via WhatsApp",
    colorsLabel: "Available Colors",
    sizesLabel: "Select Size",
    featuresLabel: "Key Features",

    heroBadge: "Est. 1993 • Manufactured in Manisa Footwear Industrial Estate",
    heroTitle: "Women's Comfort Genuine Leather Sandals & Slippers.",
    heroDesc: "100% Genuine leather uppers, orthopedic anatomical curved soles, and master craftsmanship from our Manisa workshop. Discover our new season collection delivering all-day lightness and elegance.",
    heroBtnPrimary: "Explore Collection",
    heroBtnSecondary: "Our Workshop",
    heroSignatureTitle: "Double-Buckle Genuine Leather Slipper",
    heroSignatureSub: "Soft Calfskin Leather Upper • Anatomical Soft Comfort Sole",
    heroSignatureBadge: "Our Signature Model",
    heroFeature1Title: "100%",
    heroFeature1Sub: "Genuine Leather",
    heroFeature2Title: "Anatomical",
    heroFeature2Sub: "Comfort Sole",
    heroFeature3Title: "Handmade",
    heroFeature3Sub: "Manisa Workshop",

    aboutBadge: "HERITAGE & CRAFTSMANSHIP",
    aboutTitle: "Handcrafted in Manisa Since 1993",
    aboutTitleHighlight: "Genuine Leather Comfort",
    aboutSubtitle: "For over 30 years in the Manisa Footwear Industrial Estate, we blend precision, timeless elegance and artisanal hand-stitching.",
    aboutStoryHeading: "Our Workshop Heritage & Dedication",
    aboutStoryP1: "Our journey began in 1993 in a small artisanal workshop within the Manisa Footwear Industrial Estate. From day one, our founding principle has never changed: rejecting synthetic and artificial materials to create 100% genuine leather footwear tailored to the female foot anatomy.",
    aboutStoryP2: "Today in our workshop, master stitching techniques are combined with innovative orthopedic sole architecture. We are proud to be the trusted manufacturing partner for distinguished boutiques and wholesale partners across Europe and the Middle East.",
    aboutStatsYears: "30+",
    aboutStatsYearsLabel: "Years of Craftsmanship",
    aboutStatsLeather: "100%",
    aboutStatsLeatherLabel: "Genuine Leather Guarantee",
    aboutStatsComfort: "Anatomical",
    aboutStatsComfortLabel: "Orthopedic Arch Support",
    aboutPillar1Title: "100% Genuine Leather",
    aboutPillar1Desc: "We only use breathable, soft genuine calfskin and lambskin upper leathers that prevent perspiration.",
    aboutPillar2Title: "Manisa Artisan Workshop",
    aboutPillar2Desc: "Each slipper and sandal is carefully stitched by experienced artisans in our Manisa workshop.",
    aboutPillar3Title: "Anatomical Comfort Footbed",
    aboutPillar3Desc: "Orthopedic sole architecture supporting the foot arch and absorbing heel impact effortlessly.",
    aboutPillar4Title: "Elegant & Functional",
    aboutPillar4Desc: "From double-buckle classics to orthopedic sabo clogs, graceful steps at work and everyday life.",

    craftBadge: "THE ART BEHIND THE STITCHES",
    craftTitle: "Uncompromising Craft &",
    craftTitleHighlight: "Stages",
    craftSubtitle: "From the initial hide selection to the final hand-polishing touch, every Irem Comfort design undergoes four meticulous craft stages.",
    craftStagePrefix: "Stage",
    craftStageOf: "04",
    craftCriteriaTitle: "Quality Criteria",
    craftWorkshopLabel: "Manisa Workshop Production",

    collectionBadge: "FEATURED SEASONAL SHOWCASE",
    collectionTitle: "Women's Comfort",
    collectionTitleHighlight: "Sandals & Slippers",
    collectionSubtitle: "Highlights from our 100% genuine leather women's slippers, sandals and orthopedic clogs handcrafted in Manisa.",
    collectionFilterAll: "All",
    collectionFilterSlippers: "Women's Slippers",
    collectionFilterSandals: "Women's Sandals",
    collectionFilterSabo: "Orthopedic Sabo",
    collectionFilterCork: "Cork Footbed",
    collectionPrevTitle: "Previous Models",
    collectionNextTitle: "Next Models",
    collectionAllProductsBtn: "View Full Catalog",

    whyUsBadge: "THE IREM COMFORT DIFFERENCE",
    whyUsTitle: "Why Choose",
    whyUsTitleHighlight: "Us",
    whyUsSubtitle: "5 core values distinguishing our women's comfort leather footwear manufacturing.",

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
    fairStripInviteBadge: "Fair Invitation",
    fairStripInviteStand: "You Are Invited to Our Stand!",
    fairStripRegisterBtn: "Register & Get Pass",

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
    testimonialsSuccessMsg: "Thank you! Your review has been submitted successfully.",

    faqBadge: "FREQUENT QUESTIONS",
    faqTitle: "Frequently Asked",
    faqTitleHighlight: "Questions",
    faqSubtitle: "Find detailed answers regarding leather quality, wholesale inquiries, sizing and international shipping.",
    faqSearchPlaceholder: "Search questions or topics...",
    faqCategoryAll: "All Questions",
    faqCategoryWholesale: "Wholesale & Production",
    faqCategoryShipping: "Shipping & Delivery",
    faqCategoryCare: "Genuine Leather Care",
    faqCategorySizing: "Sizing & Fit",
    faqWhatsappBoxTitle: "Have a specific question?",
    faqWhatsappBoxDesc: "Reach our customer service team on WhatsApp 24/7 for instant answers.",
    faqWhatsappBoxBtn: "Ask on WhatsApp",
    faqContactBoxTitle: "Visit Our Workshop Showroom",
    faqContactBoxDesc: "We gladly welcome you to our workshop in Manisa Footwear Estate.",
    faqContactBoxBtn: "Contact & Directions",

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
    contactAddressTitle: "Showroom & Workshop Address",
    contactHours: "Mon - Sat: 08:30 - 19:00",
    contactHoursTitle: "Working Hours",
    contactDirectCall: "Direct Contact Lines",
    contactGetDirections: "Get Directions",
    contactTrendyolStoreTitle: "Trendyol Anavelle Store",
    contactTrendyolStoreDesc: "Order Irem Comfort models online with confidence through our verified store.",
    contactSentSuccessTitle: "Message Sent Successfully!",
    contactSentSuccessDesc: "Our workshop representative will get back to you shortly.",

    newsletterBadge: "NEWSLETTER & SEASONAL CATALOG",
    newsletterTitle: "Stay Informed on New Collections and Fairs",
    newsletterDesc: "Receive our new season genuine leather slippers, fair invitations and wholesale catalog updates directly in your inbox.",
    newsletterPlaceholder: "Enter your email address...",
    newsletterBtn: "Subscribe",
    newsletterSuccess: "Thank you for subscribing to our newsletter!",
    newsletterError: "Please enter a valid email address.",

    footerCopyright: "Irem Comfort Genuine Leather Footwear Ltd. All rights reserved.",
    footerTagline: "Handcrafted in Manisa Footwear Estate • 100% Genuine Leather Women Comfort Footwear",
    footerRights: "All rights reserved.",
    footerNavTitle: "Quick Navigation",
    footerContactTitle: "Contact & Showroom",
    legalPrivacy: "Privacy Policy",
    legalKvkk: "GDPR / KVKK Notice",
    legalCookies: "Cookie Policy",
    searchPlaceholder: "Search models or categories...",
    backToTop: "Back to Top"
  },

  ar: {
    navHome: "الرئيسية",
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
    moreNav: "المزيد",

    productsTitle: "جميع المنتجات وكتالوج الموسم",
    productsSub: "شباشب وصنادل نسائية جلد طبيعي ونعل طبي مصنوعة في ورشتنا بمانيسا.",
    productsCategoryAll: "جميع الفئات",
    productsShareBtn: "مشاركة",
    productsDetailsBtn: "معاينة التفاصيل",
    productsBackToHome: "العودة إلى الرئيسية",
    sizeGuideBtn: "دليل المقاسات",
    shareCopiedToast: "تم نسخ رابط المنتج بنجاح!",
    inquireWhatsAppBtn: "استفسار وطلب عبر واتساب",
    colorsLabel: "الألوان المتوفرة",
    sizesLabel: "اختيار المقاس",
    featuresLabel: "المواصفات الرئيسية",

    heroBadge: "تأسست ١٩٩٣ • صناعة ورش مانيسا للأحذية الجلدية",
    heroTitle: "صنادل وشباشب نسائية مريحة من الجلد الطبيعي.",
    heroDesc: "جلد طبيعي ١٠٠٪، نعل طبّي مريح، وحرفية عالية من ورشتنا في مانيسا. اكتشف تشكيلة الموسم الجديد لخفة وراحة طوال اليوم.",
    heroBtnPrimary: "استكشف المجموعة",
    heroBtnSecondary: "ورشتنا",
    heroSignatureTitle: "شبشب من الجلد الطبيعي بمشبك مزدوج",
    heroSignatureSub: "وجه من جلد البقر الناعم • نعل طبي مريح للغاية",
    heroSignatureBadge: "موديلنا المميز",
    heroFeature1Title: "١٠٠٪",
    heroFeature1Sub: "جلد طبيعي",
    heroFeature2Title: "تشريحي",
    heroFeature2Sub: "نعل طبي مريح",
    heroFeature3Title: "صناعة يدوية",
    heroFeature3Sub: "ورش مانيسا",

    aboutBadge: "الأصالة والحرفية",
    aboutTitle: "صناعة يدوية في مانيسا منذ ١٩٩٣",
    aboutTitleHighlight: "راحة الجلد الطبيعي",
    aboutSubtitle: "لأكثر من ٣٠ عاماً في المنطقة الصناعية للأحذية بمانيسا، نجمع بين الدقة والأناقة الكلاسيكية والخياطة اليدوية المتقنة.",
    aboutStoryHeading: "تاريخ ورشتنا وشغف الصناعة",
    aboutStoryP1: "بدأت قصتنا في عام ١٩٩٣ في ورشة حرفية صغيرة للأحذية في مانيسا. ومنذ تأسيسنا، لم يتغير مبدأنا: تجنب المواد الصناعية الرخيصة وتصنيع أحذية جلد طبيعي ١٠٠٪ تناسب تشريح القدم النسائية بكل راحة.",
    aboutStoryP2: "اليوم في ورشتنا، ندمج خبرة خياطة كبار الحرفيين مع تكنولوجيا النعل الطبي المبتكرة. نفخر بكوننا شريك التصنيع الموثوق لأرقى البوتيكات ومحلات الجملة في تركيا والشرق الأوسط وأوروبا.",
    aboutStatsYears: "+٣٠",
    aboutStatsYearsLabel: "عاماً من الخبرة الحرفية",
    aboutStatsLeather: "١٠٠٪",
    aboutStatsLeatherLabel: "ضمان الجلد الطبيعي",
    aboutStatsComfort: "تشريحي",
    aboutStatsComfortLabel: "دعم طبي لقوس القدم",
    aboutPillar1Title: "جلد طبيعي ١٠٠٪",
    aboutPillar1Desc: "نستخدم فقط جلود العجل والماعز الطبيعية الناعمة والمسامية التي تمنع التعرق تماماً.",
    aboutPillar2Title: "حرفية ورشة مانيسا",
    aboutPillar2Desc: "تُخاط كل قطعة بعناية فائقة بأيدي أمهر المعلمين في ورشتنا بمانيسا.",
    aboutPillar3Title: "نعل طبي مريح",
    aboutPillar3Desc: "هيكل نعل طبي مبتكر يدعم انحناءات باطن القدم ويمتص صدمات المشي.",
    aboutPillar4Title: "أناقة وعملية",
    aboutPillar4Desc: "من الموديلات الكلاسيكية ذات الإبزيمين إلى القباقيب الطبية، لخطوات أنيقة ومريحة في كل وقت.",

    craftBadge: "الفن الكامن خلف الغرز",
    craftTitle: "حرفية لا تهاون فيها و",
    craftTitleHighlight: "مراحلها",
    craftSubtitle: "من أول اختيار لطبقات الجلد حتى اللمسة التلميعية الأخيرة، يمر كل تصميم لإيريم كومفورت بأربع مراحل حرفية دقيقة.",
    craftStagePrefix: "المرحلة",
    craftStageOf: "٠٤",
    craftCriteriaTitle: "معايير الجودة",
    craftWorkshopLabel: "إنتاج ورش مانيسا",

    collectionBadge: "تشكيلة الموسم المميزة",
    collectionTitle: "صنادل وشباشب",
    collectionTitleHighlight: "نسائية مريحة",
    collectionSubtitle: "أبرز موديلات الشباشب والصنادل والقباقيب الطبية النسائية المصنوعة من جلد طبيعي ١٠٠٪ في ورشتنا بمانيسا.",
    collectionFilterAll: "الكل",
    collectionFilterSlippers: "شباشب نسائية",
    collectionFilterSandals: "صنادل نسائية",
    collectionFilterSabo: "طبي وسابو",
    collectionFilterCork: "نعل فلين",
    collectionPrevTitle: "الموديلات السابقة",
    collectionNextTitle: "الموديلات التالية",
    collectionAllProductsBtn: "استعراض الكتالوج بالكامل",

    whyUsBadge: "ما يميز إيريم كومفورت",
    whyUsTitle: "لماذا",
    whyUsTitleHighlight: "نحن",
    whyUsSubtitle: "٥ قيم أساسية تجعلنا الخيار الأول في صناعة الأحذية النسائية المريحة المصنوعة من الجلد الطبيعي.",

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
    fairStripInviteBadge: "دعوة المعرض",
    fairStripInviteStand: "أهلاً بكم في جناحنا!",
    fairStripRegisterBtn: "التسجيل واستلام الدعوة",

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
    testimonialsSuccessMsg: "شكراً لك! تمت إضافة تقييمك بنجاح.",

    faqBadge: "الأسئلة المتكررة",
    faqTitle: "الأسئلة",
    faqTitleHighlight: "الشائعة",
    faqSubtitle: "إجابات تفصيلية عن جودة الجلد، طلبات الجملة والتصدير، المقاسات والشحن الدولي.",
    faqSearchPlaceholder: "البحث في الأسئلة والمواضيع...",
    faqCategoryAll: "جميع الأسئلة",
    faqCategoryWholesale: "الجملة والإنتاج",
    faqCategoryShipping: "الشحن والتوصيل",
    faqCategoryCare: "العناية بالجلد الطبيعي",
    faqCategorySizing: "المقاسات والقوالب",
    faqWhatsappBoxTitle: "هل لديك سؤال خاص؟",
    faqWhatsappBoxDesc: "يمكنك التواصل مباشرة مع فريق خدمة العملاء عبر واتساب على مدار الساعة.",
    faqWhatsappBoxBtn: "تواصل عبر واتساب",
    faqContactBoxTitle: "تفضل بزيارة معرض ورشتنا",
    faqContactBoxDesc: "يسعدنا دائماً استقبالكم في ورشتنا بالمنطقة الصناعية بمانيسا.",
    faqContactBoxBtn: "الاتصال والموقع",

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
    contactAddressTitle: "عنوان المعرض والورشة",
    contactHours: "الإثنين - السبت: ٠٨:٣٠ - ١٩:٠٠",
    contactHoursTitle: "ساعات العمل",
    contactDirectCall: "خطوط الاتصال المباشر",
    contactGetDirections: "الحصول على الاتجاهات",
    contactTrendyolStoreTitle: "متجرنا على ترينديول",
    contactTrendyolStoreDesc: "اطلب موديلات إيريم كومفورت أونلاين بكل ثقة وضمان من متجرنا المعتمد.",
    contactSentSuccessTitle: "تم استلام رسالتك بنجاح!",
    contactSentSuccessDesc: "سيتواصل معك ممثل الورشة في أقرب وقت ممكن.",

    newsletterBadge: "النشرة البريدية وكتالوج الموسم",
    newsletterTitle: "كن أول من يعلم بالمجموعات الجديدة والمعارض",
    newsletterDesc: "احصل على أحدث موديلات الشباشب والصنادل المصنوعة من جلد طبيعي ودعوات المعارض وتحديثات الكتالوج مباشرة على بريدك الإلكتروني.",
    newsletterPlaceholder: "أدخل بريدك الإلكتروني...",
    newsletterBtn: "اشتراك",
    newsletterSuccess: "تم اشتراكك في النشرة الإخبارية بنجاح. شكراً لك!",
    newsletterError: "يرجى كتابة عنوان بريد إلكتروني صالح.",

    footerCopyright: "جميع الحقوق محفوظة لشركة إيريم كومفورت للأحذية الجلدية.",
    footerTagline: "صناعة يدوية في مانيسا • أحذية وشباشب نسائية جلد طبيعي ١٠٠٪",
    footerRights: "جميع الحقوق محفوظة.",
    footerNavTitle: "خريطة الموقع",
    footerContactTitle: "الاتصال والمعرض",
    legalPrivacy: "سياسة الخصوصية",
    legalKvkk: "حماية البيانات الشخصية",
    legalCookies: "سياسة ملفات تعريف الارتباط",
    searchPlaceholder: "البحث عن موديل أو فئة...",
    backToTop: "إلى الأعلى"
  }
};
