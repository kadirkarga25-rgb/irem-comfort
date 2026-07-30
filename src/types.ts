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
}
