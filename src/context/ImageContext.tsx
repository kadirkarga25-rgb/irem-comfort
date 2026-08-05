import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  COLLECTION_ITEMS, 
  CRAFTSMANSHIP_STEPS, 
  CONTACT_DATA, 
  ANNOUNCEMENT_TICKER,
  DEFAULT_FAQ_ITEMS
} from '../constants/data';
import { CollectionItem, CraftsmanshipStep, ContactInfo, FaqItem, AboutSlide } from '../types';

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

  // System, Maintenance Mode & Deploy Store
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

  isManagerOpen: boolean;
  setIsManagerOpen: (open: boolean) => void;
}

export const DEFAULT_SYSTEM_CONFIG: SystemConfig = {
  isMaintenanceMode: false,
  autoMaintenanceOnDeploy: true,
  maxWaitTimeSeconds: 120,
  isDeploying: false,
  lastDeployedAt: null,
  maintenanceTitle: "Website Maintenance",
  maintenanceMessage: "Our website is currently being updated with new content.\nPlease try again in approximately 2–5 minutes.",
  deployingMessage: "Website update is in progress.\nThe new version will be available in about 1 minute.",
  githubRepo: "kargakadir4525/irem-comfort",
  githubBranch: "main",
  stage1Text: "Sitemizin tamamlanmasına çok az kaldı, beklediğiniz için teşekkürler.",
  stage2Text: "Sitemiz tamamlandı, beklediğiniz için teşekkürler.",
  enableLaunchIntro: true,
  introVideoUrl: ""
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
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  // Clear legacy LocalStorage keys so they never interfere
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
        'irem_comfort_about_slides_v1'
      ].forEach(k => localStorage.removeItem(k));
    } catch (e) {}
  }, []);

  // Real-time synchronization using server settings endpoint
  useEffect(() => {
    const fetchSettings = () => {
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          if (data?.success && data?.settings) {
            const s = data.settings;
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
          }
        })
        .catch(() => {});
    };

    fetchSettings();
    const interval = setInterval(fetchSettings, 5000);
    return () => clearInterval(interval);
  }, []);

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
      const next = { ...prev, ...newConfig };
      saveSection('heroConfig', { heroConfig: next });
      return next;
    });
  };

  const resetHeroConfig = () => {
    setHeroConfig(DEFAULT_HERO_CONFIG);
    saveSection('heroConfig', { heroConfig: DEFAULT_HERO_CONFIG });
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
      const next = { ...prev, ...processed };
      saveSection('fairConfig', { fairConfig: next });
      return next;
    });
  };

  const resetFairConfig = () => {
    setFairConfig(DEFAULT_FAIR_CONFIG);
    saveSection('fairConfig', { fairConfig: DEFAULT_FAIR_CONFIG });
  };

  const updateContactData = (newContact: Partial<ContactInfo>) => {
    setContactData(prev => {
      const next = { ...prev, ...newContact };
      saveSection('contactData', { contactData: next });
      return next;
    });
  };

  const resetContactData = () => {
    setContactData(CONTACT_DATA);
    saveSection('contactData', { contactData: CONTACT_DATA });
  };

  const updateAnnouncements = (list: string[]) => {
    setAnnouncements(list);
    saveSection('announcements', { announcements: list });
  };

  const resetAnnouncements = () => {
    setAnnouncements(ANNOUNCEMENT_TICKER);
    saveSection('announcements', { announcements: ANNOUNCEMENT_TICKER });
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
      const next = { ...prev, ...newConfig };
      saveSection('systemConfig', { systemConfig: next });
      return next;
    });
  };

  const updateSeoConfig = (newConfig: Partial<SeoConfig>) => {
    setSeoConfig(prev => {
      const next = { ...prev, ...newConfig };
      saveSection('seoConfig', { seoConfig: next });
      return next;
    });
  };

  const resetSeoConfig = () => {
    setSeoConfig(DEFAULT_SEO_CONFIG);
    saveSection('seoConfig', { seoConfig: DEFAULT_SEO_CONFIG });
  };

  const triggerDeploy = async (
    commitMessage?: string,
    customToken?: string,
    onProgress?: (progress: DeploymentProgress) => void
  ): Promise<{ success: boolean; message: string; logs?: string[]; durationString?: string; error?: string }> => {
    const deployTime = new Date().toISOString();
    updateSystemConfig({ isDeploying: true, lastDeployedAt: deployTime });

    const tokenToSend = customToken || localStorage.getItem('irem_github_token') || undefined;
    const repoToSend = systemConfig.githubRepo || localStorage.getItem('irem_github_repo') || undefined;
    const branchToSend = systemConfig.githubBranch || localStorage.getItem('irem_github_branch') || undefined;

    try {
      const response = await fetch('/api/deploy-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          githubToken: tokenToSend,
          githubRepo: repoToSend,
          githubBranch: branchToSend,
          commitMessage: commitMessage || "Site güncellendi ve yayınlandı"
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
                updateSystemConfig({ isDeploying: false, isMaintenanceMode: false, lastDeployedAt: new Date().toISOString() });
                resolve({
                  success: true,
                  message: 'Deployment completed successfully.',
                  logs: dep.logs,
                  durationString: dep.durationString
                });
              } else if (dep.status === 'ERROR') {
                clearInterval(pollInterval);
                updateSystemConfig({ isDeploying: false, isMaintenanceMode: false });
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
        triggerDeploy,
        isManagerOpen,
        setIsManagerOpen
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
