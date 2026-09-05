export interface ColorOption {
  name: string;
  hex: string;
  image?: string;
}

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
  colors: ColorOption[];
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

export interface TestimonialItem {
  id: string;
  name?: string;
  author?: string;
  role: string;
  location?: string;
  rating: number; // 1-5
  comment: string;
  productId?: string;
  productName?: string;
  date?: string;
  type?: 'toptan' | 'perakende';
  verified?: boolean;
  avatar?: string;
  avatarUrl?: string;
}

export type Language = 'tr' | 'en' | 'ar';

export interface AnalyticsMetrics {
  totalVisitors: number;
  fairModalOpens: number;
  fairCuts: number;
  whatsappClicks: number;
  catalogDownloads: number;
}

export interface SystemConfig {
  maxWaitTimeSeconds?: number;
  isDeploying: boolean;
  lastDeployedAt: string | null;
  deployingMessage: string;
  githubRepo: string;
  githubBranch: string;
  stage1Text?: string;
  stage2Text?: string;

  // Deployment Experience & Video System
  deploymentVideo?: string;
  enableDeploymentIntro?: boolean;
  videoVolume?: number; // 0.0 to 1.0
  loopVideo?: boolean;
  autoplayVideo?: boolean;
  mutedVideo?: boolean;
  skipButton?: boolean;
  fadeDuration?: number; // milliseconds
  minLoadingTime?: number; // seconds
  deploymentRevision?: string;
  isOnboardingCompleted?: boolean;
}

export interface SeoConfig {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  canonicalUrl: string;
  robotsTxt: string;
  sitemapXml: string;
  gaTrackingId?: string; // e.g. G-XXXXXXXXXX
  metaPixelId?: string;  // e.g. 1234567890
}

export interface MediaFile {
  id: string;
  name: string;
  path: string;
  folder: string;
  size: number;
  updatedAt: string;
  type?: 'image' | 'video';
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
  startDate: string;
  endDate: string;
  description: string;
  posterUrl: string;
  qrCodeUrl: string;
  badgeText: string;
  whatsappContact: string;
}
