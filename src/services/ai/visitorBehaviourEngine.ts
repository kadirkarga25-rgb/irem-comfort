/**
 * IC CMS PRO - Volume 2D: Visitor Behaviour Engine
 * Continuously analyzes visitor actions, page views, product time, shopping journey,
 * and calculates dynamic scores (Shopping Interest, Purchase Probability, Support Requirement, etc.)
 */

import { CollectionItem } from '../../types';

export type ShoppingInterestCategory =
  | 'Daily Comfort'
  | 'Hospital'
  | 'Office'
  | 'Home'
  | 'Outdoor'
  | 'Travel'
  | 'Premium Collection'
  | 'Wide Feet'
  | 'Sensitive Feet'
  | 'Orthopedic'
  | 'Wholesale'
  | 'Retail'
  | 'Gift'
  | 'Summer'
  | 'Winter'
  | 'Business'
  | 'Fashion';

export interface DynamicCustomerScores {
  shoppingInterestScore: number; // 0 to 100
  purchaseProbability: number;   // 0 to 100
  wholesaleProbability: number;  // 0 to 100
  conversationQuality: number;   // 0 to 100
  supportRequirement: number;    // 0 to 100
  confidenceLevel: 'High' | 'Medium' | 'Low';
}

export interface VisitorBehaviourState {
  currentPage: string;
  viewedProducts: CollectionItem[];
  viewedCategories: string[];
  timeOnProduct: number; // seconds
  timeOnWebsite: number; // seconds
  productsCompared: number;
  productsClicked: number;
  productsRecommended: number;
  productsOpened: number;
  shoppingInterests: ShoppingInterestCategory[];
  shoppingJourney: string[];
  scores: DynamicCustomerScores;
}

export class VisitorBehaviourEngine {
  private state: VisitorBehaviourState;

  constructor() {
    this.state = {
      currentPage: 'home',
      viewedProducts: [],
      viewedCategories: [],
      timeOnProduct: 0,
      timeOnWebsite: 0,
      productsCompared: 0,
      productsClicked: 0,
      productsRecommended: 0,
      productsOpened: 0,
      shoppingInterests: [],
      shoppingJourney: ['Siteye Giriş Yapıldı'],
      scores: {
        shoppingInterestScore: 30,
        purchaseProbability: 20,
        wholesaleProbability: 10,
        conversationQuality: 85,
        supportRequirement: 15,
        confidenceLevel: 'High'
      }
    };
  }

  public getBehaviourState(): VisitorBehaviourState {
    return { ...this.state };
  }

  public recordPageView(pageName: string): VisitorBehaviourState {
    this.state.currentPage = pageName;
    if (!this.state.shoppingJourney.includes(`Sayfa: ${pageName}`)) {
      this.state.shoppingJourney.push(`Sayfa: ${pageName}`);
    }
    this.recalculateScores();
    return this.getBehaviourState();
  }

  public recordProductView(product: CollectionItem): VisitorBehaviourState {
    this.state.productsOpened += 1;
    if (!this.state.viewedProducts.some(p => p.id === product.id)) {
      this.state.viewedProducts.unshift(product);
    }
    if (!this.state.viewedCategories.includes(product.category)) {
      this.state.viewedCategories.push(product.category);
    }
    this.state.shoppingJourney.push(`Ürün İnceleme: ${product.name}`);

    // Detect Shopping Interest Category
    this.detectShoppingInterests(`${product.name || ''} ${(product.features || []).join(' ')} ${product.category || ''}`);

    this.recalculateScores();
    return this.getBehaviourState();
  }

  public recordComparison(): VisitorBehaviourState {
    this.state.productsCompared += 1;
    this.state.shoppingJourney.push('Ürün Karşılaştırma Analizi Yapıldı');
    this.recalculateScores();
    return this.getBehaviourState();
  }

  public recordUserQuery(queryText: string): VisitorBehaviourState {
    this.detectShoppingInterests(queryText || '');
    this.recalculateScores();
    return this.getBehaviourState();
  }

  /**
   * Detects shopping interest categories based on text signals
   */
  private detectShoppingInterests(text: string) {
    const lower = (text || '').toLowerCase();
    const interests = new Set<ShoppingInterestCategory>(this.state.shoppingInterests);

    if (lower.includes('günlük') || lower.includes('yürüyüş')) interests.add('Daily Comfort');
    if (lower.includes('hastane') || lower.includes('sabo') || lower.includes('nöbet') || lower.includes('doktor')) interests.add('Hospital');
    if (lower.includes('ofis') || lower.includes('iş')) interests.add('Office');
    if (lower.includes('ev') || lower.includes('balkon')) interests.add('Home');
    if (lower.includes('dışarı') || lower.includes('outdoor')) interests.add('Outdoor');
    if (lower.includes('taraklı') || lower.includes('ödem') || lower.includes('geniş')) interests.add('Wide Feet');
    if (lower.includes('ortopedik') || lower.includes('jel') || lower.includes('ağrı')) interests.add('Orthopedic');
    if (lower.includes('toptan') || lower.includes('koli') || lower.includes('bayi') || lower.includes('seri')) interests.add('Wholesale');
    if (lower.includes('yaz') || lower.includes('sandalet')) interests.add('Summer');
    if (lower.includes('deri') || lower.includes('anilin')) interests.add('Premium Collection');

    this.state.shoppingInterests = Array.from(interests);
  }

  /**
   * Recalculates dynamic customer scores automatically
   */
  private recalculateScores() {
    let interestScore = 30 + (this.state.viewedProducts.length * 15) + (this.state.productsCompared * 10);
    let purchaseProb = 15 + (this.state.viewedProducts.length * 12) + (this.state.productsOpened * 8);
    let wholesaleProb = 10;
    let supportReq = 10;

    if (this.state.shoppingInterests.includes('Wholesale')) {
      wholesaleProb += 60;
      supportReq += 30;
    }

    if (this.state.shoppingInterests.includes('Wide Feet') || this.state.shoppingInterests.includes('Orthopedic')) {
      supportReq += 20;
    }

    if (this.state.productsCompared > 0) {
      interestScore += 20;
      purchaseProb += 15;
    }

    // Clamp values between 0 and 100
    this.state.scores.shoppingInterestScore = Math.min(Math.max(interestScore, 0), 99);
    this.state.scores.purchaseProbability = Math.min(Math.max(purchaseProb, 0), 99);
    this.state.scores.wholesaleProbability = Math.min(Math.max(wholesaleProb, 0), 99);
    this.state.scores.supportRequirement = Math.min(Math.max(supportReq, 0), 99);

    if (supportReq > 50) {
      this.state.scores.confidenceLevel = 'Medium';
    } else {
      this.state.scores.confidenceLevel = 'High';
    }
  }

  /**
   * Determines if a Smart Suggestion should be displayed non-intrusively
   */
  public getSmartSuggestion(): { shouldSuggest: boolean; suggestionText?: string; suggestionAction?: string } {
    if (this.state.scores.wholesaleProbability > 50) {
      return {
        shouldSuggest: true,
        suggestionText: 'Toptan sipariş ve özel koli imalat detaylarımızı incelemek ister misiniz?',
        suggestionAction: 'Toptan Sipariş Bilgisi Al'
      };
    }
    if (this.state.shoppingInterests.includes('Wide Feet')) {
      return {
        shouldSuggest: true,
        suggestionText: 'Taraklı ayaklar için özel ayarlanabilir cırtlı modellerimizi gördünüz mü?',
        suggestionAction: 'Taraklı Ayak Modellerini Listele'
      };
    }
    if (this.state.viewedProducts.length >= 2) {
      return {
        shouldSuggest: true,
        suggestionText: 'İncelediğiniz modeller arasındaki konfor ve taban farklarını karşılaştırabiliriz.',
        suggestionAction: 'Modelleri Karşılaştır'
      };
    }
    return { shouldSuggest: false };
  }
}

export const visitorBehaviourEngine = new VisitorBehaviourEngine();
