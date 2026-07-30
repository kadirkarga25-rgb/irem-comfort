import React, { createContext, useContext, useState, useEffect } from 'react';
import { COLLECTION_ITEMS, CRAFTSMANSHIP_STEPS } from '../constants/data';

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

export const DEFAULT_FAIR_CONFIG: FairConfig = {
  enabled: true,
  name: 'AYMOD Uluslararası Ayakkabı Moda Fuarı',
  location: 'İstanbul Fuar Merkezi (İFM) - Yeşilköy',
  standNumber: 'Hall 4 - Stand B214',
  startDate: '2026-08-20',
  endDate: '2026-08-23',
  description: 'İrem Comfort olarak 2026-2027 Sezonu Erkek & Kadın Hakiki Deri Terlik, Sandalet ve Ortopedik Comfort koleksiyonumuzu sergiliyoruz. Tüm iş ortaklarımızı standımıza bekleriz.',
  posterUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://iremcomfort.com/fuar-stanti',
  badgeText: 'RESMİ FUAR DAVETİ',
  whatsappContact: '905336688329'
};

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
  
  // Fair Config
  fairConfig: FairConfig;
  updateFairConfig: (newConfig: Partial<FairConfig>) => void;
  resetFairConfig: () => void;

  isManagerOpen: boolean;
  setIsManagerOpen: (open: boolean) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'irem_comfort_app_images_v1';
const LOCAL_STORAGE_FAIR_KEY = 'irem_comfort_fair_config_v1';

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<AppImages>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const defaults = getDefaultImages();
        return {
          heroImage: parsed.heroImage || defaults.heroImage,
          aboutImage: parsed.aboutImage || defaults.aboutImage,
          craftsmanshipImages: { ...defaults.craftsmanshipImages, ...(parsed.craftsmanshipImages || {}) },
          collectionImages: { ...defaults.collectionImages, ...(parsed.collectionImages || {}) }
        };
      }
    } catch (e) {
      console.error('Failed to parse saved images from localStorage', e);
    }
    return getDefaultImages();
  });

  const [fairConfig, setFairConfig] = useState<FairConfig>(() => {
    try {
      const savedFair = localStorage.getItem(LOCAL_STORAGE_FAIR_KEY);
      if (savedFair) {
        return { ...DEFAULT_FAIR_CONFIG, ...JSON.parse(savedFair) };
      }
    } catch (e) {
      console.error('Failed to parse saved fair config', e);
    }
    return DEFAULT_FAIR_CONFIG;
  });

  const [isManagerOpen, setIsManagerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(images));
    } catch (e) {
      console.error('Failed to save images to localStorage', e);
    }
  }, [images]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_FAIR_KEY, JSON.stringify(fairConfig));
    } catch (e) {
      console.error('Failed to save fair config to localStorage', e);
    }
  }, [fairConfig]);

  const updateHeroImage = (url: string) => {
    setImages(prev => ({ ...prev, heroImage: url }));
  };

  const updateAboutImage = (url: string) => {
    setImages(prev => ({ ...prev, aboutImage: url }));
  };

  const updateCraftsmanshipImage = (stepNumber: string, url: string) => {
    setImages(prev => ({
      ...prev,
      craftsmanshipImages: {
        ...prev.craftsmanshipImages,
        [stepNumber]: url
      }
    }));
  };

  const updateCollectionImage = (itemId: string, field: 'image' | 'secondaryImage', url: string) => {
    setImages(prev => ({
      ...prev,
      collectionImages: {
        ...prev.collectionImages,
        [itemId]: {
          ...prev.collectionImages[itemId],
          [field]: url
        }
      }
    }));
  };

  const resetAllImages = () => {
    const defaults = getDefaultImages();
    setImages(defaults);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  };

  const updateFairConfig = (newConfig: Partial<FairConfig>) => {
    setFairConfig(prev => ({ ...prev, ...newConfig }));
  };

  const resetFairConfig = () => {
    setFairConfig(DEFAULT_FAIR_CONFIG);
    try {
      localStorage.removeItem(LOCAL_STORAGE_FAIR_KEY);
    } catch (e) {
      // ignore
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
        fairConfig,
        updateFairConfig,
        resetFairConfig,
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
