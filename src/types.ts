export interface CollectionItem {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  secondaryImage: string;
  materials: string[];
  dimensions: string;
  leatherGrades: string[];
  colors: { name: string; hex: string }[];
  features: string[];
  isFeatured?: boolean;
  trendyolUrl?: string;
}

export interface CraftsmanshipStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  detailPoints: string[];
  image: string;
  iconName: string;
}

export interface WhyUsCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  metric: string;
  metricLabel: string;
  iconName: string;
}

export interface ContactInfo {
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappDisplay: string;
  instagram: string;
  instagramUrl?: string;
  instagramVerified?: boolean;
  email: string;
  address: string;
  showroomHours: string;
  trendyolUrl?: string;
  lat?: number;
  lng?: number;
  googleMapsUrl?: string;
}

export interface FaqItem {
  id: string;
  category: 'toptan' | 'kargo' | 'bakim' | 'kalip' | 'genel';
  question: string;
  answer: string;
  isPopular?: boolean;
  isActive?: boolean;
}

export interface AboutSlide {
  id: string;
  image: string;
  badge: string;
  title: string;
  subtitle: string;
  alt: string;
}

export interface SystemConfig {
  isMaintenanceMode: boolean;
  autoMaintenanceOnDeploy: boolean;
  maxWaitTimeSeconds?: number;
  isDeploying: boolean;
  lastDeployedAt: string | null;
  maintenanceTitle: string;
  maintenanceMessage: string;
  deployingMessage: string;
  githubRepo: string;
  githubBranch: string;
  introVideoUrl?: string;
  enableLaunchIntro?: boolean;
  stage1Text?: string;
  stage2Text?: string;
}

export interface SeoConfig {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  canonicalUrl: string;
  robotsTxt: string;
  sitemapXml: string;
}

export interface MediaFile {
  id: string;
  name: string;
  path: string;
  folder: string;
  size: number;
  updatedAt: string;
}

export interface ThemeConfig {
  preset: string; // 'lux-gold' | 'dark-bordeaux' | 'emerald-gold' | 'leather-brown' | 'ocean-copper' | 'custom'
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headerBg: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headerBg: string;
  previewGradient: string;
}

export interface SectionOrderItem {
  id: string;
  title: string;
  subtitle: string;
  enabled: boolean;
}


