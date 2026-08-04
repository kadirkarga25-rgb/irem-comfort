import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  COLLECTION_ITEMS, 
  CRAFTSMANSHIP_STEPS, 
  CONTACT_DATA, 
  ANNOUNCEMENT_TICKER,
  DEFAULT_FAQ_ITEMS
} from '../constants/data';
import { CollectionItem, CraftsmanshipStep, ContactInfo, FaqItem, AboutSlide } from '../types';
import { db, doc, setDoc, onSnapshot, deleteDoc, uploadBase64Image } from '../lib/firebase';

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

  // Real-time Firestore synchronization across split documents
  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    const fetchFallback = () => {
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
        .catch(() => {});
    };

    try {
      unsubscribes.push(onSnapshot(doc(db, "site_settings", "hero"), snap => {
        if (snap.exists() && snap.data().heroConfig) setHeroConfig(snap.data().heroConfig);
      }, () => {}));

      unsubscribes.push(onSnapshot(doc(db, "site_settings", "fair"), snap => {
        if (snap.exists() && snap.data().fairConfig) setFairConfig(snap.data().fairConfig);
      }, () => {}));

      unsubscribes.push(onSnapshot(doc(db, "site_settings", "contact"), snap => {
        if (snap.exists() && snap.data().contactData) setContactData(snap.data().contactData);
      }, () => {}));

      unsubscribes.push(onSnapshot(doc(db, "site_settings", "announcements"), snap => {
        if (snap.exists() && (snap.data().list || snap.data().announcements)) {
          setAnnouncements(snap.data().list || snap.data().announcements);
        }
      }, () => {}));

      unsubscribes.push(onSnapshot(doc(db, "site_settings", "about"), snap => {
        if (snap.exists() && (snap.data().slides || snap.data().aboutSlides)) {
          setAboutSlides(snap.data().slides || snap.data().aboutSlides);
        }
      }, () => {}));

      unsubscribes.push(onSnapshot(doc(db, "site_settings", "craftsmanship"), snap => {
        if (snap.exists() && (snap.data().steps || snap.data().craftsmanshipSteps)) {
          setCraftsmanshipSteps(snap.data().steps || snap.data().craftsmanshipSteps);
        }
      }, () => {}));

      unsubscribes.push(onSnapshot(doc(db, "site_settings", "faq"), snap => {
        if (snap.exists() && (snap.data().items || snap.data().faqItems)) {
          setFaqItems(snap.data().items || snap.data().faqItems);
        }
      }, () => {}));

      unsubscribes.push(onSnapshot(doc(db, "site_settings", "images"), snap => {
        if (snap.exists() && (snap.data().images || snap.data())) {
          const imgData = snap.data().images || snap.data();
          if (imgData.heroImage) setImages(imgData);
        }
      }, () => {}));

      unsubscribes.push(onSnapshot(doc(db, "site_settings", "products"), snap => {
        if (snap.exists() && (snap.data().items || snap.data().collectionItems)) {
          setCollectionItems(snap.data().items || snap.data().collectionItems);
        }
      }, () => {}));
    } catch (e) {
      console.warn("Firestore listeners warning:", e);
    }

    fetchFallback();

    return () => {
      unsubscribes.forEach(unsub => {
        try { unsub(); } catch (e) {}
      });
    };
  }, []);

  // Save specific section to its dedicated Firestore document & backend route
  const saveSection = async (sectionName: string, dataObj: Record<string, any>) => {
    let docName = sectionName.replace('Config', '').replace('Data', '').replace('Items', '').replace('Steps', '').replace('Slides', '').toLowerCase();
    if (docName === 'collection') docName = 'products';

    const payload = dataObj[sectionName] !== undefined ? dataObj[sectionName] : dataObj;

    try {
      const docRef = doc(db, "site_settings", docName);
      let fieldObj: Record<string, any> = {};

      if (docName === 'hero') fieldObj = { heroConfig: payload };
      else if (docName === 'fair') fieldObj = { fairConfig: payload };
      else if (docName === 'contact') fieldObj = { contactData: payload };
      else if (docName === 'announcements') fieldObj = { list: payload };
      else if (docName === 'about') fieldObj = { slides: payload };
      else if (docName === 'craftsmanship') fieldObj = { steps: payload };
      else if (docName === 'faq') fieldObj = { items: payload };
      else if (docName === 'images') fieldObj = { images: payload };
      else if (docName === 'products') fieldObj = { items: payload };
      else fieldObj = { [sectionName]: payload };

      fieldObj.updatedAt = new Date().toISOString();
      await setDoc(docRef, fieldObj, { merge: true });
    } catch (err) {
      console.warn(`Firestore direct save [site_settings/${docName}] warning:`, err);
    }

    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: sectionName, data: payload }),
    }).catch(err => console.error("Failed saving section to server route:", err));
  };

  const updateHeroImage = async (url: string) => {
    const cleanUrl = await uploadBase64Image(url, 'hero');
    setImages(prev => {
      const next = { ...prev, heroImage: cleanUrl };
      saveSection('images', { images: next });
      return next;
    });
  };

  const updateAboutImage = async (url: string) => {
    const cleanUrl = await uploadBase64Image(url, 'about');
    setImages(prev => {
      const next = { ...prev, aboutImage: cleanUrl };
      saveSection('images', { images: next });
      return next;
    });
  };

  const updateCraftsmanshipImage = async (stepNumber: string, url: string) => {
    const cleanUrl = await uploadBase64Image(url, 'craftsmanship');
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
    const cleanUrl = await uploadBase64Image(url, 'products');
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
      processed.posterUrl = await uploadBase64Image(processed.posterUrl, 'fair');
    }
    if (processed.qrCodeUrl && processed.qrCodeUrl.startsWith('data:image/')) {
      processed.qrCodeUrl = await uploadBase64Image(processed.qrCodeUrl, 'fair');
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
      itemToSave.image = await uploadBase64Image(itemToSave.image, 'products');
    }
    if (itemToSave.secondaryImage && itemToSave.secondaryImage.startsWith('data:image/')) {
      itemToSave.secondaryImage = await uploadBase64Image(itemToSave.secondaryImage, 'products');
    }
    setCollectionItems(prev => {
      const next = prev.map(item => item.id === itemId ? { ...item, ...itemToSave } : item);
      saveSection('collectionItems', { collectionItems: next });
      return next;
    });
    // Also save individual product document
    try {
      const prodRef = doc(db, "products", itemId);
      setDoc(prodRef, { ...newItem, id: itemId, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
    } catch (e) {}
  };

  const addCollectionItem = async (newItem: Omit<CollectionItem, 'id'>) => {
    const itemToSave = { ...newItem };
    if (itemToSave.image && itemToSave.image.startsWith('data:image/')) {
      itemToSave.image = await uploadBase64Image(itemToSave.image, 'products');
    }
    if (itemToSave.secondaryImage && itemToSave.secondaryImage.startsWith('data:image/')) {
      itemToSave.secondaryImage = await uploadBase64Image(itemToSave.secondaryImage, 'products');
    }
    const id = `item-${Date.now()}`;
    const itemWithId: CollectionItem = { ...itemToSave, id };
    setCollectionItems(prev => {
      const next = [itemWithId, ...prev];
      saveSection('collectionItems', { collectionItems: next });
      return next;
    });
    try {
      const prodRef = doc(db, "products", id);
      setDoc(prodRef, { ...itemWithId, updatedAt: new Date().toISOString() }).catch(() => {});
    } catch (e) {}
  };

  const deleteCollectionItem = (itemId: string) => {
    setCollectionItems(prev => {
      const next = prev.filter(item => item.id !== itemId);
      saveSection('collectionItems', { collectionItems: next });
      return next;
    });
    try {
      deleteDoc(doc(db, "products", itemId)).catch(() => {});
    } catch (e) {}
  };

  const resetCollectionItems = () => {
    setCollectionItems(COLLECTION_ITEMS);
    saveSection('collectionItems', { collectionItems: COLLECTION_ITEMS });
  };

  const updateCraftsmanshipStep = async (stepNumber: string, newStep: Partial<CraftsmanshipStep>) => {
    const stepToSave = { ...newStep };
    if (stepToSave.image && stepToSave.image.startsWith('data:image/')) {
      stepToSave.image = await uploadBase64Image(stepToSave.image, 'craftsmanship');
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
      slideToSave.image = await uploadBase64Image(slideToSave.image, 'about');
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
      slideToSave.image = await uploadBase64Image(slideToSave.image, 'about');
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
