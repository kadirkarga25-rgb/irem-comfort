import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  COLLECTION_ITEMS, 
  CRAFTSMANSHIP_STEPS, 
  CONTACT_DATA, 
  ANNOUNCEMENT_TICKER,
  DEFAULT_FAQ_ITEMS
} from '../constants/data';
import { CollectionItem, CraftsmanshipStep, ContactInfo, FaqItem, AboutSlide } from '../types';
import { db, doc, setDoc, onSnapshot } from '../lib/firebase';

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

  isManagerOpen: boolean;
  setIsManagerOpen: (open: boolean) => void;
}

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

  // Real-time Firestore synchronization for all clients/devices/browsers
  useEffect(() => {
    const docRef = doc(db, "site_settings", "global");

    const fetchFallbackSettings = () => {
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
          }
        })
        .catch(err => console.error("Could not fetch settings from server fallback:", err));
    };

    let fallbackInterval: any = null;

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const s = snapshot.data();
          if (s.images) setImages(s.images);
          if (s.heroConfig) setHeroConfig(s.heroConfig);
          if (s.fairConfig) setFairConfig(s.fairConfig);
          if (s.contactData) setContactData(s.contactData);
          if (s.announcements) setAnnouncements(s.announcements);
          if (s.collectionItems) setCollectionItems(s.collectionItems);
          if (s.craftsmanshipSteps) setCraftsmanshipSteps(s.craftsmanshipSteps);
          if (s.faqItems) setFaqItems(s.faqItems);
          if (s.aboutSlides) setAboutSlides(s.aboutSlides);
        } else {
          // Document doesn't exist yet, seed initial default settings to Firestore
          const initialData = {
            images: getDefaultImages(),
            heroConfig: DEFAULT_HERO_CONFIG,
            fairConfig: DEFAULT_FAIR_CONFIG,
            contactData: CONTACT_DATA,
            announcements: ANNOUNCEMENT_TICKER,
            collectionItems: COLLECTION_ITEMS,
            craftsmanshipSteps: CRAFTSMANSHIP_STEPS,
            faqItems: DEFAULT_FAQ_ITEMS,
            aboutSlides: DEFAULT_ABOUT_SLIDES,
            updatedAt: new Date().toISOString()
          };
          setDoc(docRef, initialData).catch(err => {
            console.warn("Direct client Firestore write failed (using API fallback):", err);
          });
        }
      },
      (error) => {
        console.warn("Firestore client listener warning (Permission / Rules): Falling back to server API.", error);
        // Initial fetch + fallback polling if client Firestore rules restrict direct read
        fetchFallbackSettings();
        if (!fallbackInterval) {
          fallbackInterval = setInterval(fetchFallbackSettings, 5000);
        }
      }
    );

    return () => {
      unsubscribe();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, []);

  // Save changes permanently to Firestore Database & Backend
  const saveToServer = async (payload: Record<string, any>) => {
    try {
      const docRef = doc(db, "site_settings", "global");
      await setDoc(docRef, { ...payload, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (err) {
      console.error("Failed saving to Firestore:", err);
    }

    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: payload }),
    }).catch(err => console.error("Failed saving to server route:", err));
  };

  const updateHeroImage = (url: string) => {
    setImages(prev => {
      const next = { ...prev, heroImage: url };
      saveToServer({ images: next });
      return next;
    });
  };

  const updateAboutImage = (url: string) => {
    setImages(prev => {
      const next = { ...prev, aboutImage: url };
      saveToServer({ images: next });
      return next;
    });
  };

  const updateCraftsmanshipImage = (stepNumber: string, url: string) => {
    setImages(prev => {
      const next = {
        ...prev,
        craftsmanshipImages: {
          ...prev.craftsmanshipImages,
          [stepNumber]: url
        }
      };
      saveToServer({ images: next });
      return next;
    });
  };

  const updateCollectionImage = (itemId: string, field: 'image' | 'secondaryImage', url: string) => {
    setImages(prev => {
      const next = {
        ...prev,
        collectionImages: {
          ...prev.collectionImages,
          [itemId]: {
            ...prev.collectionImages[itemId],
            [field]: url
          }
        }
      };
      saveToServer({ images: next });
      return next;
    });
  };

  const resetAllImages = () => {
    const defaults = getDefaultImages();
    setImages(defaults);
    saveToServer({ images: defaults });
    try { localStorage.removeItem(LOCAL_STORAGE_KEY); } catch (e) {}
  };

  const updateHeroConfig = (newConfig: Partial<HeroConfig>) => {
    setHeroConfig(prev => {
      const next = { ...prev, ...newConfig };
      saveToServer({ heroConfig: next });
      return next;
    });
  };

  const resetHeroConfig = () => {
    setHeroConfig(DEFAULT_HERO_CONFIG);
    saveToServer({ heroConfig: DEFAULT_HERO_CONFIG });
    try { localStorage.removeItem(LOCAL_STORAGE_HERO_KEY); } catch (e) {}
  };

  const updateFairConfig = (newConfig: Partial<FairConfig>) => {
    setFairConfig(prev => {
      const next = { ...prev, ...newConfig };
      saveToServer({ fairConfig: next });
      return next;
    });
  };

  const resetFairConfig = () => {
    setFairConfig(DEFAULT_FAIR_CONFIG);
    saveToServer({ fairConfig: DEFAULT_FAIR_CONFIG });
    try { localStorage.removeItem(LOCAL_STORAGE_FAIR_KEY); } catch (e) {}
  };

  const updateContactData = (newContact: Partial<ContactInfo>) => {
    setContactData(prev => {
      const next = { ...prev, ...newContact };
      saveToServer({ contactData: next });
      return next;
    });
  };

  const resetContactData = () => {
    setContactData(CONTACT_DATA);
    saveToServer({ contactData: CONTACT_DATA });
    try { localStorage.removeItem(LOCAL_STORAGE_CONTACT_KEY); } catch (e) {}
  };

  const updateAnnouncements = (list: string[]) => {
    setAnnouncements(list);
    saveToServer({ announcements: list });
  };

  const resetAnnouncements = () => {
    setAnnouncements(ANNOUNCEMENT_TICKER);
    saveToServer({ announcements: ANNOUNCEMENT_TICKER });
    try { localStorage.removeItem(LOCAL_STORAGE_ANNOUNCEMENTS_KEY); } catch (e) {}
  };

  const updateCollectionItem = (itemId: string, newItem: Partial<CollectionItem>) => {
    setCollectionItems(prev => {
      const next = prev.map(item => item.id === itemId ? { ...item, ...newItem } : item);
      saveToServer({ collectionItems: next });
      return next;
    });
  };

  const addCollectionItem = (newItem: Omit<CollectionItem, 'id'>) => {
    setCollectionItems(prev => {
      const id = `item-${Date.now()}`;
      const itemWithId: CollectionItem = { ...newItem, id };
      const next = [itemWithId, ...prev];
      saveToServer({ collectionItems: next });
      return next;
    });
  };

  const deleteCollectionItem = (itemId: string) => {
    setCollectionItems(prev => {
      const next = prev.filter(item => item.id !== itemId);
      saveToServer({ collectionItems: next });
      return next;
    });
  };

  const resetCollectionItems = () => {
    setCollectionItems(COLLECTION_ITEMS);
    saveToServer({ collectionItems: COLLECTION_ITEMS });
    try { localStorage.removeItem(LOCAL_STORAGE_COLLECTION_KEY); } catch (e) {}
  };

  const updateCraftsmanshipStep = (stepNumber: string, newStep: Partial<CraftsmanshipStep>) => {
    setCraftsmanshipSteps(prev => {
      const next = prev.map(step => step.number === stepNumber ? { ...step, ...newStep } : step);
      saveToServer({ craftsmanshipSteps: next });
      return next;
    });
  };

  const resetCraftsmanshipSteps = () => {
    setCraftsmanshipSteps(CRAFTSMANSHIP_STEPS);
    saveToServer({ craftsmanshipSteps: CRAFTSMANSHIP_STEPS });
    try { localStorage.removeItem(LOCAL_STORAGE_CRAFTSMANSHIP_KEY); } catch (e) {}
  };

  const updateFaqItem = (id: string, newFaq: Partial<FaqItem>) => {
    setFaqItems(prev => {
      const next = prev.map(item => item.id === id ? { ...item, ...newFaq } : item);
      saveToServer({ faqItems: next });
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
      saveToServer({ faqItems: next });
      return next;
    });
  };

  const deleteFaqItem = (id: string) => {
    setFaqItems(prev => {
      const next = prev.filter(item => item.id !== id);
      saveToServer({ faqItems: next });
      return next;
    });
  };

  const resetFaqItems = () => {
    setFaqItems(DEFAULT_FAQ_ITEMS);
    saveToServer({ faqItems: DEFAULT_FAQ_ITEMS });
    try { localStorage.removeItem(LOCAL_STORAGE_FAQ_KEY); } catch (e) {}
  };

  const updateAboutSlide = (id: string, newSlide: Partial<AboutSlide>) => {
    setAboutSlides(prev => {
      const next = prev.map(slide => slide.id === id ? { ...slide, ...newSlide } : slide);
      saveToServer({ aboutSlides: next });
      return next;
    });
  };

  const addAboutSlide = (newSlide: Omit<AboutSlide, 'id'>) => {
    setAboutSlides(prev => {
      const newItem: AboutSlide = {
        ...newSlide,
        id: `slide-${Date.now()}`
      };
      const next = [...prev, newItem];
      saveToServer({ aboutSlides: next });
      return next;
    });
  };

  const deleteAboutSlide = (id: string) => {
    setAboutSlides(prev => {
      if (prev.length <= 1) return prev; // keep at least 1 slide
      const next = prev.filter(slide => slide.id !== id);
      saveToServer({ aboutSlides: next });
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
      saveToServer({ aboutSlides: next });
      return next;
    });
  };

  const resetAboutSlides = () => {
    setAboutSlides(DEFAULT_ABOUT_SLIDES);
    saveToServer({ aboutSlides: DEFAULT_ABOUT_SLIDES });
    try { localStorage.removeItem(LOCAL_STORAGE_ABOUT_SLIDES_KEY); } catch (e) {}
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
