import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { 
  COLLECTION_ITEMS, 
  CRAFTSMANSHIP_STEPS, 
  CONTACT_DATA, 
  ANNOUNCEMENT_TICKER,
  DEFAULT_FAQ_ITEMS
} from '../constants/data';
import { CollectionItem, CraftsmanshipStep, ContactInfo, FaqItem, AboutSlide, SystemConfig, SeoConfig, ThemeConfig, ThemePreset, SectionOrderItem } from '../types';
import { deepMerge } from '../utils/deepMerge';

async function uploadImageToGithub(dataUrl: string, folder: string = "site_images"): Promise<string> {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith("data:image/")) {
    return dataUrl;
  }
  try {
    const res = await fetch('/api/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dataUrl, folder })
    });
    const data = await res.json();
    if (data?.success && data?.url) {
      return data.url;
    }
  } catch (err) {
    console.error("Error uploading image to GitHub via API:", err);
  }
  return dataUrl;
}

export interface HeroConfig {
  badgeText: string;
  title: string;
  description: string;
  primaryBtnText: string;
  secondaryBtnText: string;
  signatureModelTitle: string;
  signatureModelSub: string;
}

export interface FairConfig {
  enabled: boolean;
  name: string;
  location: string;
  standNumber: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  description: string;
  posterUrl: string;
  qrCodeUrl: string;
  badgeText: string;
  whatsappContact: string;
}

export interface AppImages {
  heroImage: string;
  aboutImage: string;
  craftsmanshipImages: Record<string, string>; // step number -> image url
  collectionImages: Record<string, { image: string; secondaryImage?: string }>; // item id -> images
}

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1603808033176-9d134e6f2c74?auto=format&fit=crop&q=80&w=1200';
const DEFAULT_ABOUT_IMAGE = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200';

export const DEFAULT_HERO_CONFIG: HeroConfig = {
  badgeText: 'Kuruluş 1993 • Manisa Ayakkabıcılar Sitesi İmalatı',
  title: 'Bayan Comfort Deri Sandalet & Terlik.',
  description: '%100 Hakiki deri saya, ortopedik kavisli anatomik taban ve Manisa atölyemizin usta el işçiliği. Gün boyu adımlarınıza hafiflik ve zarif konfor katan yeni sezon modellerimizi keşfedin.',
  primaryBtnText: 'Koleksiyonu Keşfet',
  secondaryBtnText: 'Atölyemiz',
  signatureModelTitle: 'Çift Tokalı Hakiki Deri Terlik',
  signatureModelSub: 'Yumuşak Dana Derisi Saya • Anatomik Yumuşak Konfor Taban'
};

export const DEFAULT_FAIR_CONFIG: FairConfig = {
  enabled: false,
  name: 'AYMOD Uluslararası Ayakkabı Moda Fuarı',
  location: 'İstanbul Fuar Merkezi (İFM) - Yeşilköy',
  standNumber: 'Hall 4 - Stand B214',
  startDate: '2026-08-20',
  endDate: '2026-08-23',
  description: 'İrem Comfort olarak 2026-2027 Sezonu Erkek & Kadın Hakiki Deri Terlik, Sandalet ve Ortopedik Comfort koleksiyonumuzu sergiliyoruz. Tüm iş ortaklarımızı standımıza bekleriz.',
  posterUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://iremcomfort.com/fuar-stanti',
  badgeText: 'RESMİ FUAR DAVETİ',
  whatsappContact: '905330297125'
};

export const DEFAULT_ABOUT_SLIDES: AboutSlide[] = [
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1603808033176-9d134e6f2c74?auto=format&fit=crop&q=80&w=1200',
    badge: 'İREM COMFORT • MANİSA',
    title: 'Hakiki Deri.',
    subtitle: 'Doğal Konfor.',
    alt: 'İrem Comfort Hakiki Deri Bayan Sandalet Model'
  },
  {
    id: 'slide-2',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200',
    badge: '%100 HAKİKİ SAYA',
    title: '%100 Hakiki Deri',
    subtitle: 'Nefes Alan Yumuşak Dana ve Kuzu Derisi',
    alt: 'Manisa Atölyesi Hakiki Deri Doku Yakın Çekim'
  },
  {
    id: 'slide-3',
    image: 'https://images.unsplash.com/photo-1531819177115-428566ccfb50?auto=format&fit=crop&q=80&w=1200',
    badge: 'MANİSA ATÖLYESİ',
    title: "Manisa'da Üretiliyor",
    subtitle: 'Usta Ellerin Geleneksel Dikiş Zanaatı',
    alt: 'Manisa Ayakkabıcılar Sitesi Deri Zanaatkarlığı'
  },
  {
    id: 'slide-4',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1200',
    badge: 'ORTOPEDİK TABAN',
    title: 'Anatomik Konfor',
    subtitle: 'Ayak Kavisini Destekleyen Esnek Taban Structure',
    alt: 'Anatomik Ortopedik Taban Mimarisi Yakın Çekim'
  }
];

const getDefaultImages = (): AppImages => {
  const craftMap: Record<string, string> = {};
  CRAFTSMANSHIP_STEPS.forEach(step => {
    craftMap[step.number] = step.image;
  });

  const collMap: Record<string, { image: string; secondaryImage?: string }> = {};
  COLLECTION_ITEMS.forEach(item => {
    collMap[item.id] = {
      image: item.image,
      secondaryImage: item.secondaryImage
    };
  });

  return {
    heroImage: DEFAULT_HERO_IMAGE,
    aboutImage: DEFAULT_ABOUT_IMAGE,
    craftsmanshipImages: craftMap,
    collectionImages: collMap
  };
};

export interface DeploymentProgress {
  status: 'VALIDATING' | 'UPLOADING' | 'COMMITTED' | 'WAITING_VERCEL' | 'BUILDING' | 'DEPLOYING' | 'READY' | 'ERROR';
  stepIndex: number;
  logs: string[];
  durationSeconds?: number;
  durationString?: string;
  error?: string;
}

interface ImageContextType {
  images: AppImages;
  updateHeroImage: (url: string) => void;
  updateAboutImage: (url: string) => void;
  updateCraftsmanshipImage: (stepNumber: string, url: string) => void;
  updateCollectionImage: (itemId: string, field: 'image' | 'secondaryImage', url: string) => void;
  resetAllImages: () => void;
  
  // Hero Text & Banner Config
  heroConfig: HeroConfig;
  updateHeroConfig: (newConfig: Partial<HeroConfig>) => void;
  resetHeroConfig: () => void;

  // Fair Config
  fairConfig: FairConfig;
  updateFairConfig: (newConfig: Partial<FairConfig>) => void;
  resetFairConfig: () => void;

  // Contact Info Config
  contactData: ContactInfo;
  updateContactData: (newContact: Partial<ContactInfo>) => void;
  resetContactData: () => void;

  // Announcements Ticker Config
  announcements: string[];
  updateAnnouncements: (list: string[]) => void;
  resetAnnouncements: () => void;

  // Collection Items Dynamic Store
  collectionItems: CollectionItem[];
  updateCollectionItem: (itemId: string, newItem: Partial<CollectionItem>) => void;
  addCollectionItem: (newItem: Omit<CollectionItem, 'id'>) => void;
  deleteCollectionItem: (itemId: string) => void;
  resetCollectionItems: () => void;

  // Craftsmanship Steps Dynamic Store
  craftsmanshipSteps: CraftsmanshipStep[];
  updateCraftsmanshipStep: (stepNumber: string, newStep: Partial<CraftsmanshipStep>) => void;
  resetCraftsmanshipSteps: () => void;

  // FAQ Items Dynamic Store
  faqItems: FaqItem[];
  updateFaqItem: (id: string, newFaq: Partial<FaqItem>) => void;
  addFaqItem: (newFaq: Omit<FaqItem, 'id'>) => void;
  deleteFaqItem: (id: string) => void;
  resetFaqItems: () => void;

  // About Section Slides Dynamic Store
  aboutSlides: AboutSlide[];
  updateAboutSlide: (id: string, newSlide: Partial<AboutSlide>) => void;
  addAboutSlide: (newSlide: Omit<AboutSlide, 'id'>) => void;
  deleteAboutSlide: (id: string) => void;
  moveAboutSlide: (id: string, direction: 'up' | 'down') => void;
  resetAboutSlides: () => void;

  // System & Deploy Store
  systemConfig: SystemConfig;
  updateSystemConfig: (newConfig: Partial<SystemConfig>) => void;
  triggerDeploy: (
    commitMessage?: string,
    customToken?: string,
    onProgress?: (progress: DeploymentProgress) => void
  ) => Promise<{ success: boolean; message: string; logs?: string[]; durationString?: string; error?: string }>;

  // SEO, Robots & Sitemap Store
  seoConfig: SeoConfig;
  updateSeoConfig: (newConfig: Partial<SeoConfig>) => void;
  resetSeoConfig: () => void;

  // Theme & Color Store
  themeConfig: ThemeConfig;
  updateThemeConfig: (newConfig: Partial<ThemeConfig>) => void;
  resetThemeConfig: () => void;

  // Homepage Section Order Store
  sectionOrder: SectionOrderItem[];
  updateSectionOrder: (newOrder: SectionOrderItem[]) => void;
  moveSection: (id: string, direction: 'up' | 'down') => void;
  toggleSectionEnabled: (id: string) => void;
  resetSectionOrder: () => void;

  // Dirty State & Immutable Deep Merge Store
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
  markDirty: () => void;
  getCurrentAdminState: (additionalState?: Record<string, any>) => Record<string, any>;
  saveAllChanges: (additionalState?: Record<string, any>) => Promise<{ success: boolean; message: string }>;
  discardUnsavedChanges: () => Promise<void>;

  isManagerOpen: boolean;
  setIsManagerOpen: (open: boolean) => void;

  // Single Source of Truth Initial Loading Gate
  isSettingsLoaded: boolean;
}

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  preset: 'lux-gold',
  primaryColor: '#0A2D6F',
  accentColor: '#D4AF37',
  backgroundColor: '#FFFFFF',
  textColor: '#111111',
  headerBg: '#062050'
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'lux-gold',
    name: 'Altın & Deri Lüks (Varsayılan)',
    description: 'Lacivert zemin, kelebek altın detaylar, klasik Manisa ayakkabı amblemi',
    primaryColor: '#0A2D6F',
    accentColor: '#D4AF37',
    backgroundColor: '#FFFFFF',
    textColor: '#111111',
    headerBg: '#062050',
    previewGradient: 'from-[#0A2D6F] to-[#D4AF37]'
  },
  {
    id: 'dark-bordeaux',
    name: 'Gece Siyahı & Bordo Elegant',
    description: 'Mat kütle siyahı, koyu bordo dikiş vurguları ve asil tasarım',
    primaryColor: '#18181B',
    accentColor: '#991B1B',
    backgroundColor: '#FAFAFA',
    textColor: '#18181B',
    headerBg: '#0F0F10',
    previewGradient: 'from-[#18181B] to-[#991B1B]'
  },
  {
    id: 'emerald-gold',
    name: 'Zümrüt Yeşil & Altın Klasik',
    description: 'Koyu zümrüt yeşili ve kehribar altın dokusu ile organik konfor hissi',
    primaryColor: '#064E3B',
    accentColor: '#D97706',
    backgroundColor: '#F8FAF9',
    textColor: '#0F172A',
    headerBg: '#022C22',
    previewGradient: 'from-[#064E3B] to-[#D97706]'
  },
  {
    id: 'leather-brown',
    name: 'Atölye Taba & Hakiki Deri Kahve',
    description: 'Hakiki taba deri tonları, zanaat ruhunu yansıtan sıcak doğal renkler',
    primaryColor: '#3F2E21',
    accentColor: '#C59B27',
    backgroundColor: '#FAF7F2',
    textColor: '#271D16',
    headerBg: '#281D15',
    previewGradient: 'from-[#3F2E21] to-[#C59B27]'
  },
  {
    id: 'ocean-copper',
    name: 'Deniz Mavisi & Bakır Comfort',
    description: 'Ferah deniz mavisi ve bakır şerit tonlarıyla ferah yazlık konsept',
    primaryColor: '#0284C7',
    accentColor: '#D97706',
    backgroundColor: '#F0F9FF',
    textColor: '#0F172A',
    headerBg: '#075985',
    previewGradient: 'from-[#0284C7] to-[#D97706]'
  }
];

export const DEFAULT_SECTION_ORDER: SectionOrderItem[] = [
  { id: 'hero', title: 'Hero (Ana Karşılama)', subtitle: 'Slogan, butonlar ve öne çıkan hakiki deri terlik görseli', enabled: true },
  { id: 'about', title: 'Hakkımızda & Hikayemiz', subtitle: 'Manisa imalatı, 1993\'ten beri miras ve slayt galeri', enabled: true },
  { id: 'collection', title: 'Koleksiyon & Ürünlerimiz', subtitle: 'Sandalet ve terlik ürün kartları, kategori filtreleri', enabled: true },
  { id: 'craftsmanship', title: 'Zanaat & Atölye Süreci', subtitle: 'Elde kesim, saya dikim, ortopedik montaj adımları', enabled: true },
  { id: 'why-us', title: 'Neden İrem Comfort', subtitle: 'Anatomik taban, %100 hakiki saya, toptan avantajlar', enabled: true },
  { id: 'faq', title: 'Sıkça Sorulan Sorular (SSS)', subtitle: 'Toptan sipariş, kalıp, kargo ve deri bakımı rehberi', enabled: true },
  { id: 'contact', title: 'İletişim & Konum', subtitle: 'WhatsApp, showroom adresi, harita ve mesaj formu', enabled: true },
  { id: 'newsletter', title: 'E-Bülten & Kataloğ', subtitle: 'E-posta e-bülten kayıt alanı ve dijital katalog indirme', enabled: true }
];

export const DEFAULT_SYSTEM_CONFIG: SystemConfig = {
  maxWaitTimeSeconds: 120,
  isDeploying: false,
  lastDeployedAt: null,
  deployingMessage: "Website update is in progress.\nThe new version will be available in about 1 minute.",
  githubRepo: "kadirkarga25-rgb/irem-comfort",
  githubBranch: "main",
  stage1Text: "Sitemizin güncellenmesi tamamlanıyor, beklediğiniz için teşekkürler.",
  stage2Text: "Sitemiz güncellendi, hoş geldiniz!",
  deploymentVideo: "",
  enableDeploymentIntro: false,
  videoVolume: 0.8,
  loopVideo: false,
  autoplayVideo: true,
  mutedVideo: true,
  skipButton: true,
  fadeDuration: 800,
  minLoadingTime: 3,
  deploymentRevision: "v1.0.0"
};

export const DEFAULT_SEO_CONFIG: SeoConfig = {
  metaTitle: "İrem Comfort — Bayan Hakiki Deri Terlik & Sandalet | Manisa İmalatı",
  metaDescription: "1993'ten beri Manisa Ayakkabıcılar Sitesi'nde imal edilen %100 hakiki deri bayan ortopedik terlik ve sandalet modelleri.",
  metaKeywords: "irem comfort, hakiki deri terlik, bayan terlik, ortopedik sandalet, manisa ayakkabı, imalat",
  ogImage: "/uploads/logo/irem-comfort-logo.jpg",
  canonicalUrl: "https://iremcomfort.com",
  robotsTxt: "User-agent: *\nAllow: /\nSitemap: https://iremcomfort.com/sitemap.xml",
  sitemapXml: ""
};

const ImageContext = createContext<ImageContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'irem_comfort_app_images_v1';
const LOCAL_STORAGE_HERO_KEY = 'irem_comfort_hero_config_v1';
const LOCAL_STORAGE_FAIR_KEY = 'irem_comfort_fair_config_v1';
const LOCAL_STORAGE_CONTACT_KEY = 'irem_comfort_contact_v1';
const LOCAL_STORAGE_ANNOUNCEMENTS_KEY = 'irem_comfort_announcements_v1';
const LOCAL_STORAGE_COLLECTION_KEY = 'irem_comfort_collection_items_v1';
const LOCAL_STORAGE_CRAFTSMANSHIP_KEY = 'irem_comfort_craftsmanship_v1';
const LOCAL_STORAGE_FAQ_KEY = 'irem_comfort_faq_v1';
const LOCAL_STORAGE_ABOUT_SLIDES_KEY = 'irem_comfort_about_slides_v1';


export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<AppImages>(() => getDefaultImages());
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(DEFAULT_HERO_CONFIG);
  const [fairConfig, setFairConfig] = useState<FairConfig>(DEFAULT_FAIR_CONFIG);
  const [contactData, setContactData] = useState<ContactInfo>(CONTACT_DATA);
  const [announcements, setAnnouncements] = useState<string[]>(ANNOUNCEMENT_TICKER);
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>(COLLECTION_ITEMS);
  const [craftsmanshipSteps, setCraftsmanshipSteps] = useState<CraftsmanshipStep[]>(CRAFTSMANSHIP_STEPS);
  const [faqItems, setFaqItems] = useState<FaqItem[]>(DEFAULT_FAQ_ITEMS);
  const [aboutSlides, setAboutSlides] = useState<AboutSlide[]>(DEFAULT_ABOUT_SLIDES);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(DEFAULT_SYSTEM_CONFIG);
  const [seoConfig, setSeoConfig] = useState<SeoConfig>(DEFAULT_SEO_CONFIG);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(DEFAULT_THEME_CONFIG);
  const [sectionOrder, setSectionOrder] = useState<SectionOrderItem[]>(DEFAULT_SECTION_ORDER);
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  // Single Source of Truth Loading Gate
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

  // Dirty State & Deep Merge Save Ref
  const [isDirty, setIsDirty] = useState(false);
  const markDirty = useCallback(() => setIsDirty(true), []);
  const lastSavedSettingsRef = useRef<any>(null);

  // Apply dynamic theme CSS custom properties to document root
  useEffect(() => {
    if (themeConfig) {
      document.documentElement.style.setProperty('--primary', themeConfig.primaryColor);
      document.documentElement.style.setProperty('--accent', themeConfig.accentColor);
      document.documentElement.style.setProperty('--bg-light', themeConfig.backgroundColor);
      document.documentElement.style.setProperty('--text-dark', themeConfig.textColor);
      document.documentElement.style.setProperty('--header-bg', themeConfig.headerBg);
    }
  }, [themeConfig]);

  // Clear legacy LocalStorage keys so they never interfere with server settings
  useEffect(() => {
    try {
      [
        'irem_comfort_app_images_v1',
        'irem_comfort_hero_config_v1',
        'irem_comfort_fair_config_v1',
        'irem_comfort_contact_v1',
        'irem_comfort_announcements_v1',
        'irem_comfort_collection_items_v1',
        'irem_comfort_craftsmanship_v1',
        'irem_comfort_faq_v1',
        'irem_comfort_about_slides_v1',
        'irem_admin_session',
        'ic_cms_admin_settings_v2d',
        'ic_cms_config_center_v6',
        'irem_contact_leads',
        'irem_newsletter_subscribers'
      ].forEach(k => localStorage.removeItem(k));
    } catch (e) {}
  }, []);

  // Real-time synchronization using server settings endpoint
  useEffect(() => {
    let isMounted = true;
    const fetchSettings = () => {
      if (isDirty) {
        if (isMounted) setIsSettingsLoaded(true);
        return;
      }
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          if (data?.success && data?.settings && isMounted) {
            const s = data.settings;
            lastSavedSettingsRef.current = s;
            if (s.images) setImages(s.images);
            if (s.heroConfig) setHeroConfig(s.heroConfig);
            if (s.fairConfig) setFairConfig(s.fairConfig);
            if (s.contactData) setContactData(s.contactData);
            if (s.announcements) setAnnouncements(s.announcements);
            if (s.collectionItems) setCollectionItems(s.collectionItems);
            if (s.craftsmanshipSteps) setCraftsmanshipSteps(s.craftsmanshipSteps);
            if (s.faqItems) setFaqItems(s.faqItems);
            if (s.aboutSlides) setAboutSlides(s.aboutSlides);
            if (s.systemConfig) setSystemConfig(prev => ({ ...prev, ...s.systemConfig }));
            if (s.seoConfig) setSeoConfig(prev => ({ ...prev, ...s.seoConfig }));
            if (s.themeConfig) setThemeConfig(prev => ({ ...prev, ...s.themeConfig }));
            if (s.sectionOrder && Array.isArray(s.sectionOrder)) setSectionOrder(s.sectionOrder);
          }
        })
        .catch(err => {
          console.warn("Initial settings fetch error:", err);
        })
        .finally(() => {
          if (isMounted) {
            setIsSettingsLoaded(true);
          }
        });
    };

    fetchSettings();
    const interval = setInterval(fetchSettings, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isDirty]);

  // Save specific section to backend server & local file
  const saveSection = async (sectionName: string, dataObj: Record<string, any>) => {
    const payload = dataObj[sectionName] !== undefined ? dataObj[sectionName] : dataObj;

    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: sectionName, data: payload }),
    }).catch(err => console.error("Failed saving section to server route:", err));
  };

  const updateHeroImage = async (url: string) => {
    const cleanUrl = await uploadImageToGithub(url, 'hero');
    setImages(prev => {
      const next = { ...prev, heroImage: cleanUrl };
      saveSection('images', { images: next });
      return next;
    });
  };

  const updateAboutImage = async (url: string) => {
    const cleanUrl = await uploadImageToGithub(url, 'about');
    setImages(prev => {
      const next = { ...prev, aboutImage: cleanUrl };
      saveSection('images', { images: next });
      return next;
    });
  };

  const updateCraftsmanshipImage = async (stepNumber: string, url: string) => {
    const cleanUrl = await uploadImageToGithub(url, 'craftsmanship');
    setImages(prev => {
      const next = {
        ...prev,
        craftsmanshipImages: {
          ...prev.craftsmanshipImages,
          [stepNumber]: cleanUrl
        }
      };
      saveSection('images', { images: next });
      return next;
    });
  };

  const updateCollectionImage = async (itemId: string, field: 'image' | 'secondaryImage', url: string) => {
    const cleanUrl = await uploadImageToGithub(url, 'products');
    setImages(prev => {
      const next = {
        ...prev,
        collectionImages: {
          ...prev.collectionImages,
          [itemId]: {
            ...prev.collectionImages[itemId],
            [field]: cleanUrl
          }
        }
      };
      saveSection('images', { images: next });
      return next;
    });

    setCollectionItems(prev => {
      const next = prev.map(item => item.id === itemId ? { ...item, [field]: cleanUrl } : item);
      saveSection('collectionItems', { collectionItems: next });
      return next;
    });
  };

  const resetAllImages = () => {
    const defaults = getDefaultImages();
    setImages(defaults);
    saveSection('images', { images: defaults });
  };

  const updateHeroConfig = (newConfig: Partial<HeroConfig>) => {
    setHeroConfig(prev => {
      const next = deepMerge(prev, newConfig);
      saveSection('heroConfig', { heroConfig: next });
      return next;
    });
    setIsDirty(true);
  };

  const resetHeroConfig = () => {
    setHeroConfig(DEFAULT_HERO_CONFIG);
    saveSection('heroConfig', { heroConfig: DEFAULT_HERO_CONFIG });
    setIsDirty(true);
  };

  const updateFairConfig = async (newConfig: Partial<FairConfig>) => {
    const processed = { ...newConfig };
    if (processed.posterUrl && processed.posterUrl.startsWith('data:image/')) {
      processed.posterUrl = await uploadImageToGithub(processed.posterUrl, 'fair');
    }
    if (processed.qrCodeUrl && processed.qrCodeUrl.startsWith('data:image/')) {
      processed.qrCodeUrl = await uploadImageToGithub(processed.qrCodeUrl, 'fair');
    }
    setFairConfig(prev => {
      const next = deepMerge(prev, processed);
      saveSection('fairConfig', { fairConfig: next });
      return next;
    });
    setIsDirty(true);
  };

  const resetFairConfig = () => {
    setFairConfig(DEFAULT_FAIR_CONFIG);
    saveSection('fairConfig', { fairConfig: DEFAULT_FAIR_CONFIG });
    setIsDirty(true);
  };

  const updateContactData = (newContact: Partial<ContactInfo>) => {
    setContactData(prev => {
      const next = deepMerge(prev, newContact);
      saveSection('contactData', { contactData: next });
      return next;
    });
    setIsDirty(true);
  };

  const resetContactData = () => {
    setContactData(CONTACT_DATA);
    saveSection('contactData', { contactData: CONTACT_DATA });
    setIsDirty(true);
  };

  const updateAnnouncements = (list: string[]) => {
    setAnnouncements(list);
    saveSection('announcements', { announcements: list });
    setIsDirty(true);
  };

  const resetAnnouncements = () => {
    setAnnouncements(ANNOUNCEMENT_TICKER);
    saveSection('announcements', { announcements: ANNOUNCEMENT_TICKER });
    setIsDirty(true);
  };

  const updateCollectionItem = async (itemId: string, newItem: Partial<CollectionItem>) => {
    const itemToSave = { ...newItem };
    if (itemToSave.image && itemToSave.image.startsWith('data:image/')) {
      itemToSave.image = await uploadImageToGithub(itemToSave.image, 'products');
    }
    if (itemToSave.secondaryImage && itemToSave.secondaryImage.startsWith('data:image/')) {
      itemToSave.secondaryImage = await uploadImageToGithub(itemToSave.secondaryImage, 'products');
    }
    setCollectionItems(prev => {
      const next = prev.map(item => item.id === itemId ? { ...item, ...itemToSave } : item);
      saveSection('collectionItems', { collectionItems: next });
      return next;
    });
  };

  const addCollectionItem = async (newItem: Omit<CollectionItem, 'id'>) => {
    const itemToSave = { ...newItem };
    if (itemToSave.image && itemToSave.image.startsWith('data:image/')) {
      itemToSave.image = await uploadImageToGithub(itemToSave.image, 'products');
    }
    if (itemToSave.secondaryImage && itemToSave.secondaryImage.startsWith('data:image/')) {
      itemToSave.secondaryImage = await uploadImageToGithub(itemToSave.secondaryImage, 'products');
    }
    const id = `item-${Date.now()}`;
    const itemWithId: CollectionItem = { ...itemToSave, id };
    setCollectionItems(prev => {
      const next = [itemWithId, ...prev];
      saveSection('collectionItems', { collectionItems: next });
      return next;
    });
  };

  const deleteCollectionItem = (itemId: string) => {
    setCollectionItems(prev => {
      const next = prev.filter(item => item.id !== itemId);
      saveSection('collectionItems', { collectionItems: next });
      return next;
    });
  };

  const resetCollectionItems = () => {
    setCollectionItems(COLLECTION_ITEMS);
    saveSection('collectionItems', { collectionItems: COLLECTION_ITEMS });
  };

  const updateCraftsmanshipStep = async (stepNumber: string, newStep: Partial<CraftsmanshipStep>) => {
    const stepToSave = { ...newStep };
    if (stepToSave.image && stepToSave.image.startsWith('data:image/')) {
      stepToSave.image = await uploadImageToGithub(stepToSave.image, 'craftsmanship');
    }
    setCraftsmanshipSteps(prev => {
      const next = prev.map(step => step.number === stepNumber ? { ...step, ...stepToSave } : step);
      saveSection('craftsmanshipSteps', { craftsmanshipSteps: next });
      return next;
    });
  };

  const resetCraftsmanshipSteps = () => {
    setCraftsmanshipSteps(CRAFTSMANSHIP_STEPS);
    saveSection('craftsmanshipSteps', { craftsmanshipSteps: CRAFTSMANSHIP_STEPS });
  };

  const updateFaqItem = (id: string, newFaq: Partial<FaqItem>) => {
    setFaqItems(prev => {
      const next = prev.map(item => item.id === id ? { ...item, ...newFaq } : item);
      saveSection('faqItems', { faqItems: next });
      return next;
    });
  };

  const addFaqItem = (newFaq: Omit<FaqItem, 'id'>) => {
    setFaqItems(prev => {
      const newItem: FaqItem = {
        ...newFaq,
        id: `faq-${Date.now()}`
      };
      const next = [newItem, ...prev];
      saveSection('faqItems', { faqItems: next });
      return next;
    });
  };

  const deleteFaqItem = (id: string) => {
    setFaqItems(prev => {
      const next = prev.filter(item => item.id !== id);
      saveSection('faqItems', { faqItems: next });
      return next;
    });
  };

  const resetFaqItems = () => {
    setFaqItems(DEFAULT_FAQ_ITEMS);
    saveSection('faqItems', { faqItems: DEFAULT_FAQ_ITEMS });
  };

  const updateAboutSlide = async (id: string, newSlide: Partial<AboutSlide>) => {
    const slideToSave = { ...newSlide };
    if (slideToSave.image && slideToSave.image.startsWith('data:image/')) {
      slideToSave.image = await uploadImageToGithub(slideToSave.image, 'about');
    }
    setAboutSlides(prev => {
      const next = prev.map(slide => slide.id === id ? { ...slide, ...slideToSave } : slide);
      saveSection('aboutSlides', { aboutSlides: next });
      return next;
    });
  };

  const addAboutSlide = async (newSlide: Omit<AboutSlide, 'id'>) => {
    const slideToSave = { ...newSlide };
    if (slideToSave.image && slideToSave.image.startsWith('data:image/')) {
      slideToSave.image = await uploadImageToGithub(slideToSave.image, 'about');
    }
    const newItem: AboutSlide = {
      ...slideToSave,
      id: `slide-${Date.now()}`
    };
    setAboutSlides(prev => {
      const next = [...prev, newItem];
      saveSection('aboutSlides', { aboutSlides: next });
      return next;
    });
  };

  const deleteAboutSlide = (id: string) => {
    setAboutSlides(prev => {
      if (prev.length <= 1) return prev;
      const next = prev.filter(slide => slide.id !== id);
      saveSection('aboutSlides', { aboutSlides: next });
      return next;
    });
  };

  const moveAboutSlide = (id: string, direction: 'up' | 'down') => {
    setAboutSlides(prev => {
      const index = prev.findIndex(s => s.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(newIndex, 0, moved);
      saveSection('aboutSlides', { aboutSlides: next });
      return next;
    });
  };

  const resetAboutSlides = () => {
    setAboutSlides(DEFAULT_ABOUT_SLIDES);
    saveSection('aboutSlides', { aboutSlides: DEFAULT_ABOUT_SLIDES });
  };

  const updateSystemConfig = (newConfig: Partial<SystemConfig>) => {
    setSystemConfig(prev => {
      const next = deepMerge(prev, newConfig);
      saveSection('systemConfig', { systemConfig: next });
      return next;
    });
    setIsDirty(true);
  };

  const updateSeoConfig = (newConfig: Partial<SeoConfig>) => {
    setSeoConfig(prev => {
      const next = deepMerge(prev, newConfig);
      saveSection('seoConfig', { seoConfig: next });
      return next;
    });
    setIsDirty(true);
  };

  const resetSeoConfig = () => {
    setSeoConfig(DEFAULT_SEO_CONFIG);
    saveSection('seoConfig', { seoConfig: DEFAULT_SEO_CONFIG });
    setIsDirty(true);
  };

  const updateThemeConfig = (newConfig: Partial<ThemeConfig>) => {
    setThemeConfig(prev => {
      const next = deepMerge(prev, newConfig);
      saveSection('themeConfig', { themeConfig: next });
      return next;
    });
    setIsDirty(true);
  };

  const resetThemeConfig = () => {
    setThemeConfig(DEFAULT_THEME_CONFIG);
    saveSection('themeConfig', { themeConfig: DEFAULT_THEME_CONFIG });
    setIsDirty(true);
  };

  const updateSectionOrder = (newOrder: SectionOrderItem[]) => {
    setSectionOrder(newOrder);
    saveSection('sectionOrder', { sectionOrder: newOrder });
    setIsDirty(true);
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    setSectionOrder(prev => {
      const idx = prev.findIndex(item => item.id === id);
      if (idx === -1) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === prev.length - 1) return prev;

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      const next = [...prev];
      const [moved] = next.splice(idx, 1);
      next.splice(targetIdx, 0, moved);

      saveSection('sectionOrder', { sectionOrder: next });
      return next;
    });
    setIsDirty(true);
  };

  const toggleSectionEnabled = (id: string) => {
    setSectionOrder(prev => {
      const next = prev.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item);
      saveSection('sectionOrder', { sectionOrder: next });
      return next;
    });
    setIsDirty(true);
  };

  const resetSectionOrder = () => {
    setSectionOrder(DEFAULT_SECTION_ORDER);
    saveSection('sectionOrder', { sectionOrder: DEFAULT_SECTION_ORDER });
    setIsDirty(true);
  };

  const getCurrentAdminState = useCallback((additionalState?: Record<string, any>) => {
    return {
      images,
      heroConfig,
      fairConfig,
      contactData,
      announcements,
      collectionItems,
      craftsmanshipSteps,
      faqItems,
      aboutSlides,
      systemConfig,
      seoConfig,
      themeConfig,
      sectionOrder,
      ...(additionalState || {})
    };
  }, [
    images,
    heroConfig,
    fairConfig,
    contactData,
    announcements,
    collectionItems,
    craftsmanshipSteps,
    faqItems,
    aboutSlides,
    systemConfig,
    seoConfig,
    themeConfig,
    sectionOrder
  ]);

  const saveAllChanges = async (additionalState?: Record<string, any>): Promise<{ success: boolean; message: string }> => {
    const currentStateObj = getCurrentAdminState(additionalState);

    // Immutable Deep Merge with last saved baseline settings
    const mergedPayload = deepMerge(lastSavedSettingsRef.current || {}, currentStateObj);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'ALL', data: mergedPayload })
      });
      const data = await res.json();
      if (data.success || res.ok) {
        lastSavedSettingsRef.current = mergedPayload;
        setIsDirty(false);
        return { success: true, message: '✓ Tüm değişiklikler immutable deep merge ile başarıyla kaydedildi!' };
      }
    } catch (err) {
      console.error('Error in saveAllChanges:', err);
    }
    return { success: false, message: 'Ayarlar kaydedilirken bir hata oluştu.' };
  };

  const discardUnsavedChanges = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data?.success && data?.settings) {
        const s = data.settings;
        lastSavedSettingsRef.current = s;
        if (s.images) setImages(s.images);
        if (s.heroConfig) setHeroConfig(s.heroConfig);
        if (s.fairConfig) setFairConfig(s.fairConfig);
        if (s.contactData) setContactData(s.contactData);
        if (s.announcements) setAnnouncements(s.announcements);
        if (s.collectionItems) setCollectionItems(s.collectionItems);
        if (s.craftsmanshipSteps) setCraftsmanshipSteps(s.craftsmanshipSteps);
        if (s.faqItems) setFaqItems(s.faqItems);
        if (s.aboutSlides) setAboutSlides(s.aboutSlides);
        if (s.systemConfig) setSystemConfig(s.systemConfig);
        if (s.seoConfig) setSeoConfig(s.seoConfig);
        if (s.themeConfig) setThemeConfig(s.themeConfig);
        if (s.sectionOrder && Array.isArray(s.sectionOrder)) setSectionOrder(s.sectionOrder);
      }
    } catch (e) {}
    setIsDirty(false);
  };

  const triggerDeploy = async (
    commitMessage?: string,
    customToken?: string,
    onProgress?: (progress: DeploymentProgress) => void,
    additionalState?: Record<string, any>
  ): Promise<{ success: boolean; message: string; logs?: string[]; durationString?: string; error?: string }> => {
    const deployTime = new Date().toISOString();
    updateSystemConfig({ isDeploying: true, lastDeployedAt: deployTime });

    const tokenToSend = customToken || localStorage.getItem('irem_github_token') || undefined;
    const repoToSend = systemConfig.githubRepo || localStorage.getItem('irem_github_repo') || undefined;
    const branchToSend = systemConfig.githubBranch || localStorage.getItem('irem_github_branch') || undefined;

    // Build complete current Admin state payload
    const freshStatePayload = getCurrentAdminState(additionalState);

    try {
      const response = await fetch('/api/deploy-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          githubToken: tokenToSend,
          githubRepo: repoToSend,
          githubBranch: branchToSend,
          commitMessage: commitMessage || "Site güncellendi ve yayınlandı",
          settings: freshStatePayload
        })
      });

      const data = await response.json();

      if (!data.success) {
        updateSystemConfig({ isDeploying: false });
        return {
          success: false,
          message: data.error || 'GitHub commit hatası.',
          logs: data.deployment?.logs || ['❌ Deployment failed during upload.'],
          error: data.error
        };
      }

      if (onProgress && data.deployment) {
        onProgress(data.deployment);
      }

      // Poll /api/deploy-status every 2 seconds until status becomes READY or ERROR
      return new Promise((resolve) => {
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch('/api/deploy-status');
            const statusData = await statusRes.json();
            const dep = statusData.deployment as DeploymentProgress | undefined;

            if (dep) {
              if (onProgress) {
                onProgress(dep);
              }

              if (dep.status === 'READY') {
                clearInterval(pollInterval);
                setIsDirty(false);
                lastSavedSettingsRef.current = freshStatePayload;
                updateSystemConfig({ isDeploying: false, lastDeployedAt: new Date().toISOString() });
                resolve({
                  success: true,
                  message: 'Deployment completed successfully.',
                  logs: dep.logs,
                  durationString: dep.durationString
                });
              } else if (dep.status === 'ERROR') {
                clearInterval(pollInterval);
                updateSystemConfig({ isDeploying: false });
                resolve({
                  success: false,
                  message: dep.error || 'Deployment failed.',
                  logs: dep.logs,
                  error: dep.error,
                  durationString: dep.durationString
                });
              }
            }
          } catch (pollErr) {
            console.warn('Poll error:', pollErr);
          }
        }, 2000);
      });
    } catch (err) {
      console.error('Deploy error:', err);
      updateSystemConfig({ isDeploying: false });
      return { success: false, message: 'Sunucuyla bağlantı kurulurken hata oluştu.' };
    }
  };

  return (
    <ImageContext.Provider
      value={{
        images,
        updateHeroImage,
        updateAboutImage,
        updateCraftsmanshipImage,
        updateCollectionImage,
        resetAllImages,
        heroConfig,
        updateHeroConfig,
        resetHeroConfig,
        fairConfig,
        updateFairConfig,
        resetFairConfig,
        contactData,
        updateContactData,
        resetContactData,
        announcements,
        updateAnnouncements,
        resetAnnouncements,
        collectionItems,
        updateCollectionItem,
        addCollectionItem,
        deleteCollectionItem,
        resetCollectionItems,
        craftsmanshipSteps,
        updateCraftsmanshipStep,
        resetCraftsmanshipSteps,
        faqItems,
        updateFaqItem,
        addFaqItem,
        deleteFaqItem,
        resetFaqItems,
        aboutSlides,
        updateAboutSlide,
        addAboutSlide,
        deleteAboutSlide,
        moveAboutSlide,
        resetAboutSlides,
        systemConfig,
        updateSystemConfig,
        seoConfig,
        updateSeoConfig,
        resetSeoConfig,
        themeConfig,
        updateThemeConfig,
        resetThemeConfig,
        sectionOrder,
        updateSectionOrder,
        moveSection,
        toggleSectionEnabled,
        resetSectionOrder,
        isDirty,
        setIsDirty,
        markDirty,
        getCurrentAdminState,
        saveAllChanges,
        discardUnsavedChanges,
        triggerDeploy,
        isManagerOpen,
        setIsManagerOpen,
        isSettingsLoaded
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};


export const useAppImages = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useAppImages must be used within an ImageProvider');
  }
  return context;
};
