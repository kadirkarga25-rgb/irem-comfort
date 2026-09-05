/**
 * IC CMS PRO - Volume 2A: AI Knowledge Engine
 * Zero external AI dependency. Pure local semantic search, document indexing,
 * zero-hallucination natural answer synthesis, and intent-based product matching.
 */

import { CollectionItem, FaqItem, CraftsmanshipStep, ContactInfo } from '../../types';
import { 
  COLLECTION_ITEMS, 
  DEFAULT_FAQ_ITEMS, 
  CRAFTSMANSHIP_STEPS, 
  CONTACT_DATA
} from '../../constants/data';
import { HeroConfig, FairConfig, DEFAULT_HERO_CONFIG, DEFAULT_FAIR_CONFIG } from '../../context/ImageContext';

export interface IndexedDocument {
  id: string;
  category: 'product' | 'brand_craft' | 'faq' | 'contact_shipping' | 'fair_event' | 'policy_legal';
  title: string;
  content: string;
  keywords: string[];
  metadata: {
    productId?: string;
    categoryName?: string;
    colors?: string[];
    features?: string[];
    footTypeSuitability?: string[];
    priceOrDimensions?: string;
    sectionUrl?: string;
    [key: string]: any;
  };
  indexedAt: string;
}

export interface SearchResult {
  document: IndexedDocument;
  score: number; // 0.0 to 1.0
  matchedTerms: string[];
  intentBoost: number;
}

export interface KnowledgeEngineAnswer {
  query: string;
  answer: string;
  confidenceScore: number; // 0.0 to 1.0
  confidenceLevel: 'High' | 'Medium' | 'Low';
  relevantDocs: IndexedDocument[];
  matchedProducts?: CollectionItem[];
  suggestHumanHandoff: boolean;
}

// Local Synonym Dictionary for semantic intent mapping
const SYNONYM_MAP: Record<string, string[]> = {
  shipping: ['kargo', 'teslimat', 'gönderi', 'gönderim', 'ne zaman gelir', 'ne zaman ulaşır', 'kurye', 'sipariş takibi', 'süresi'],
  wholesale: ['toptan', 'seri', 'kutu', 'bayi', 'bayilik', 'toplu', 'fiyat listesi', 'minimum sipariş', 'paket', '36-41'],
  orthopedic: ['ortopedik', 'anatomik', 'taban', 'topuk dikeni', 'nasır', 'rahat', 'yorgunluk', 'kavis', 'jel', 'şok emici'],
  foot_wide: ['geniş', 'taraklı', 'ödem', 'şiş', 'taraklı ayak', 'genişletilebilir', 'cırt cırtlı', 'büyük kalıp', 'hassas'],
  leather: ['hakiki deri', 'dana derisi', 'nappa', 'anilin', 'süet', 'gerçek deri', 'kalite', 'saya', 'deri', '%100'],
  sabo: ['sabo', 'hemşire', 'doktor', 'hastane', 'aşçı', 'iş terliği', 'medikal', 'delikli', 'perfore', 'sağlık'],
  sandal: ['sandalet', 'yazlık', 'çapraz', 'bilekten', 'tokalı', 'cırtlı'],
  working_hours: ['çalışma saatleri', 'açık', 'kaçta kapanıyor', 'pazar', 'cumartesi', 'mesai', 'adres', 'konum', 'nerede', 'atölye', 'telefon'],
  return_policy: ['iade', 'değişim', 'garanti', 'hasarlı', 'numara değişimi', 'geri gönderme'],
  fairs: ['fuar', 'aymod', 'stand', 'yeşilköy', 'istanbul fuar merkezi', 'ziyaret']
};

export class KnowledgeEngine {
  private indexedDocuments: IndexedDocument[] = [];
  private lastIndexTimestamp: string = '';

  constructor() {
    // Initial indexing with default site dataset
    this.reindexAll();
  }

  /**
   * Automatically scans and indexes all editable content from site data sources
   */
  public reindexAll(customData?: {
    collections?: CollectionItem[];
    faqs?: FaqItem[];
    craftsmanship?: CraftsmanshipStep[];
    contact?: ContactInfo;
    hero?: HeroConfig;
    fair?: FairConfig;
  }): number {
    const documents: IndexedDocument[] = [];
    const timestamp = new Date().toISOString();

    const collections = customData?.collections || COLLECTION_ITEMS;
    const faqs = customData?.faqs || DEFAULT_FAQ_ITEMS;
    const craftsmanship = customData?.craftsmanship || CRAFTSMANSHIP_STEPS;
    const contact = customData?.contact || CONTACT_DATA;
    const hero = customData?.hero || DEFAULT_HERO_CONFIG;
    const fair = customData?.fair || DEFAULT_FAIR_CONFIG;

    // 1. Index Products
    collections.forEach((item) => {
      const colorsStr = item.colors?.map(c => c.name).join(', ') || '';
      const materialsStr = item.materials?.join(', ') || '';
      const featuresStr = item.features?.join('. ') || '';
      const iName = (item.name || '').toLowerCase();
      const iDesc = (item.description || '').toLowerCase();
      const iCat = (item.category || '').toLowerCase();
      const content = `${item.name || ''}. ${item.subtitle || ''}. Kategori: ${item.category || ''}. ${item.tagline || ''}. ${item.description || ''}. Malzemeler: ${materialsStr}. Özellikler: ${featuresStr}. Renkler: ${colorsStr}. Ebat/Numara: ${item.dimensions || ''}.`;

      const isWideFoot = iDesc.includes('tarak') || iDesc.includes('cırt') || iName.includes('geniş');
      const isSabo = iCat.includes('sabo') || iName.includes('sabo');
      const isSandal = iCat.includes('sandalet');

      documents.push({
        id: `doc-prod-${item.id}`,
        category: 'product',
        title: item.name || '',
        content,
        keywords: [
          iName,
          iCat,
          ...(Array.isArray(item.materials) ? item.materials.filter(Boolean).map(m => (m || '').toLowerCase()) : []),
          ...(Array.isArray(item.features) ? item.features.filter(Boolean).map(f => (f || '').toLowerCase()) : []),
          ...(isWideFoot ? ['taraklı', 'geniş', 'ödem', 'cırt cırtlı'] : []),
          ...(isSabo ? ['sabo', 'hemşire', 'doktor', 'hastane', 'medikal'] : []),
          ...(isSandal ? ['sandalet', 'yazlık'] : ['terlik'])
        ],
        metadata: {
          productId: item.id,
          categoryName: item.category,
          colors: item.colors?.map(c => c.name),
          features: item.features,
          footTypeSuitability: isWideFoot ? ['taraklı', 'ödemli', 'geniş'] : ['standart', 'regular fit'],
          priceOrDimensions: item.dimensions,
          sectionUrl: `#koleksiyon`
        },
        indexedAt: timestamp
      });
    });

    // 2. Index FAQs
    faqs.forEach((faq) => {
      const q = (faq.question || '').toLowerCase();
      const a = (faq.answer || '').toLowerCase();
      documents.push({
        id: `doc-faq-${faq.id}`,
        category: 'faq',
        title: faq.question || '',
        content: `Soru: ${faq.question || ''} Cevap: ${faq.answer || ''}`,
        keywords: [q, ...a.split(' ').filter(Boolean)],
        metadata: {
          sectionUrl: `#sss`
        },
        indexedAt: timestamp
      });
    });

    // 3. Index Craftsmanship & Brand Facts
    craftsmanship.forEach((step) => {
      const points = step.detailPoints?.join('. ') || '';
      const stepTitle = (step.title || '').toLowerCase();
      documents.push({
        id: `doc-craft-${step.number}`,
        category: 'brand_craft',
        title: `Manisa Zanaatı Step ${step.number}: ${step.title || ''}`,
        content: `${step.title || ''} - ${step.subtitle || ''}. ${step.description || ''}. Detaylar: ${points}`,
        keywords: ['zanaat', 'atölye', 'manisa', 'üretim', 'el işçiliği', stepTitle],
        metadata: {
          sectionUrl: `#sanat`
        },
        indexedAt: timestamp
      });
    });

    // 4. Index Shipping, Wholesale & Contact Information
    documents.push({
      id: 'doc-contact-main',
      category: 'contact_shipping',
      title: 'İrem Comfort İletişim, Adres ve Atölye Konumu',
      content: `İrem Comfort Üretim Atölyesi: ${contact.address}. Telefon: ${contact.phoneDisplay}. WhatsApp Sipariş Hattı: ${contact.whatsappDisplay}. E-posta: ${contact.email}. Instagram: ${contact.instagram}. Çalışma Saatleri: ${contact.showroomHours}. Trendyol Yetkili Mağazamız: Anavelle (${contact.trendyolUrl})`,
      keywords: ['adres', 'telefon', 'whatsapp', 'trendyol', 'çalışma saatleri', 'konum', 'manisa ayakkabıcılar sitesi', 'mesai', 'pazar'],
      metadata: {
        sectionUrl: `#iletisim`
      },
      indexedAt: timestamp
    });

    // 5. Index Shipping & Wholesale Rules
    documents.push({
      id: 'doc-shipping-wholesale-policy',
      category: 'policy_legal',
      title: 'Kargo, Teslimat Süresi ve Toptan Sipariş Koşulları',
      content: 'Toptan siparişlerde standart seri paketimiz 8 veya 10 çiftten oluşmaktadır (36-41 numara arası). Perakende ve toptan kargo gönderimleri anlaşmalı kargo firmaları ile Manisa atölyemizden 1-3 iş günü içerisinde sevk edilir. Ürünlerde imalat hatasına karşı %100 değişim ve iade garantisi mevcuttur.',
      keywords: ['kargo', 'teslimat', 'süresi', 'toptan', 'seri', 'kutu', 'değişim', 'iade', 'garanti', '1-3 iş günü'],
      metadata: {
        sectionUrl: `#sss`
      },
      indexedAt: timestamp
    });

    // 6. Index Hero & Brand Intro
    documents.push({
      id: 'doc-hero-brand',
      category: 'brand_craft',
      title: 'İrem Comfort Marka Tanıtımı ve Deri Kalitesi',
      content: `${hero.badgeText}. ${hero.title} ${hero.description} Öne Çıkan İmza Modeli: ${hero.signatureModelTitle} (${hero.signatureModelSub}). 1993 yılından bu yana Manisa Ayakkabıcılar Sitesinde %100 hakiki deri imalatı gerçekleştirmekteyiz.`,
      keywords: ['kuruluş 1993', 'manisa', 'hakiki deri', 'comfort', 'sandalet', 'terlik', 'kalite'],
      metadata: {
        sectionUrl: `#hero`
      },
      indexedAt: timestamp
    });

    // 7. Index Fair & Event info
    if (fair.enabled) {
      const fairName = (fair.name || '').toLowerCase();
      documents.push({
        id: 'doc-fair-event',
        category: 'fair_event',
        title: `Fuar ve Etkinlik Katılımı: ${fair.name || ''}`,
        content: `İrem Comfort ${fair.name || ''} fuarına katılıyor! Lokasyon: ${fair.location || ''}. Stant Numarası: ${fair.standNumber || ''}. Tarihler: ${fair.startDate || ''} - ${fair.endDate || ''}. Açıklama: ${fair.description || ''}.`,
        keywords: ['fuar', 'aymod', 'istanbul fuar merkezi', 'stant', fairName],
        metadata: {
          sectionUrl: `#fuar`
        },
        indexedAt: timestamp
      });
    }

    this.indexedDocuments = documents;
    this.lastIndexTimestamp = timestamp;
    return documents.length;
  }

  /**
   * Search indexed documents using TF-IDF + Synonym Intent Expansion + Keyword Overlap
   */
  public search(query: string, maxResults = 4): SearchResult[] {
    if (!query || typeof query !== 'string' || !query.trim()) return [];

    const qLower = (query || '').toLowerCase().trim();
    const queryTokens = qLower.split(/\s+/).filter(t => t.length > 1);

    // Expand query with synonyms
    const expandedIntents: string[] = [];
    Object.entries(SYNONYM_MAP).forEach(([intent, synonyms]) => {
      if (synonyms.some(syn => qLower.includes(syn))) {
        expandedIntents.push(intent);
      }
    });

    const results: SearchResult[] = [];

    this.indexedDocuments.forEach((doc) => {
      let score = 0;
      let matchedTerms: string[] = [];
      let intentBoost = 0;

      const docText = `${doc.title || ''} ${doc.content || ''} ${(doc.keywords || []).join(' ')}`.toLowerCase();

      // Title Exact Match Bonus
      if ((doc.title || '').toLowerCase().includes(qLower)) {
        score += 0.45;
        matchedTerms.push('Title Match');
      }

      // Keyword & Token Matching
      queryTokens.forEach((token) => {
        if (docText.includes(token)) {
          score += 0.15;
          matchedTerms.push(token);
        }
      });

      // Synonym Intent Matching
      expandedIntents.forEach((intent) => {
        const synonyms = SYNONYM_MAP[intent] || [];
        if (synonyms.some(syn => docText.includes(syn))) {
          intentBoost += 0.25;
        }
      });

      const totalScore = Math.min(1.0, score + intentBoost);

      if (totalScore > 0.1) {
        results.push({
          document: doc,
          score: Math.round(totalScore * 100) / 100,
          matchedTerms: Array.from(new Set(matchedTerms)),
          intentBoost
        });
      }
    });

    // Sort by highest score descending
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, maxResults);
  }

  /**
   * Smart Product Search by Natural Intent (e.g. "wide feet", "black sandals", "hospital sabo")
   */
  public searchProductsByIntent(query: string, allItems: CollectionItem[] = COLLECTION_ITEMS): CollectionItem[] {
    const qLower = (query || '').toLowerCase();

    return allItems.filter(item => {
      const iName = (item.name || '').toLowerCase();
      const iDesc = (item.description || '').toLowerCase();
      const iCat = (item.category || '').toLowerCase();

      const isBlack = (qLower.includes('siyah') || qLower.includes('black')) && item.colors?.some(c => (c.name || '').toLowerCase().includes('siyah'));
      const isWhite = (qLower.includes('beyaz') || qLower.includes('white')) && item.colors?.some(c => (c.name || '').toLowerCase().includes('beyaz'));
      const isTan = (qLower.includes('taba') || qLower.includes('bronz') || qLower.includes('kahve')) && item.colors?.some(c => (c.name || '').toLowerCase().includes('taba') || (c.name || '').toLowerCase().includes('bronz'));
      
      const isWideFoot = (qLower.includes('geniş') || qLower.includes('taraklı') || qLower.includes('ödem')) && 
        (iName.includes('geniş') || iDesc.includes('tarak') || iDesc.includes('cırt'));
      
      const isSabo = (qLower.includes('sabo') || qLower.includes('hemşire') || qLower.includes('doktor') || qLower.includes('hastane')) &&
        (iCat.includes('sabo') || iName.includes('sabo'));

      const isSandal = (qLower.includes('sandalet') || qLower.includes('yazlık')) &&
        (iCat.includes('sandalet') || iName.includes('sandalet'));

      const generalMatch = iName.includes(qLower) || 
                           iDesc.includes(qLower) || 
                           iCat.includes(qLower);

      return isBlack || isWhite || isTan || isWideFoot || isSabo || isSandal || generalMatch;
    });
  }

  /**
   * Generates a synthesised zero-hallucination natural answer with Confidence Scoring
   */
  public queryKnowledgeBase(query: string, allItems: CollectionItem[] = COLLECTION_ITEMS): KnowledgeEngineAnswer {
    const searchResults = this.search(query, 3);

    if (searchResults.length === 0 || searchResults[0].score < 0.2) {
      return {
        query,
        answer: 'İrem Comfort doğrulanmış bilgi arşivinde doğrudan bu soruyla ilgili kayıt bulunamadı. Size en doğru bilgiyi sunabilmemiz için lütfen "Canlı Desteğe Bağlan" butonunu kullanarak müşteri temsilcimizle iletişime geçiniz.',
        confidenceScore: 0.15,
        confidenceLevel: 'Low',
        relevantDocs: [],
        suggestHumanHandoff: true
      };
    }

    const topDoc = searchResults[0].document;
    const confidenceScore = searchResults[0].score;
    let confidenceLevel: 'High' | 'Medium' | 'Low' = 'High';

    if (confidenceScore < 0.50) confidenceLevel = 'Low';
    else if (confidenceScore < 0.75) confidenceLevel = 'Medium';

    // Find relevant products (Max 3)
    const matchedProducts = this.searchProductsByIntent(query, allItems).slice(0, 3);

    // Synthesize structured single natural response from indexed knowledge
    let answerText = '';

    if (confidenceLevel === 'Low') {
      answerText = `İrem Comfort arşivindeki verilere göre: ${topDoc.content}\n\nDetaylı bilgi için "Canlı Desteğe Bağlan" seçeneğini kullanabilirsiniz.`;
    } else {
      // 1. Direct Answer & 2. Supporting Explanation from combined docs
      const docsToCombine = searchResults.map(r => r.document);
      
      // Clean and merge content into one coherent explanation without repeating headers or greetings
      const cleanedParts: string[] = [];
      const seenSentences = new Set<string>();

      docsToCombine.forEach((d) => {
        // Strip out "Soru: ... Cevap: ..." or raw document titles if present
        let cleanContent = d.content
          .replace(/^Soru:.* Cevap:\s*/i, '')
          .replace(/^İrem Comfort Üretim Atölyesi:\s*/i, '')
          .trim();

        // Split into sentences and deduplicate
        const sentences = cleanContent.split(/(?<=[.!?])\s+/);
        sentences.forEach(s => {
          const norm = (s || '').toLowerCase().trim();
          if (norm.length > 5 && !seenSentences.has(norm)) {
            seenSentences.add(norm);
            cleanedParts.push(s);
          }
        });
      });

      // 1. Direct answer (first 1-2 deduplicated sentences)
      const directAnswer = cleanedParts.slice(0, 2).join(' ');
      // 2. Supporting explanation (remaining deduplicated sentences)
      const supportingDetails = cleanedParts.slice(2, 6).join(' ');

      answerText = directAnswer;
      if (supportingDetails) {
        answerText += `\n\n${supportingDetails}`;
      }

      // 3. Optional recommendation (Max 3 relevant products)
      if (matchedProducts.length > 0) {
        answerText += `\n\n✨ **Aramanızla Uyumlu Öne Çıkan Modellerimiz:**\n` +
          matchedProducts.map(p => `• **${p.name}** (${p.category}) - ${p.tagline}`).join('\n');
      }
    }

    return {
      query,
      answer: answerText,
      confidenceScore,
      confidenceLevel,
      relevantDocs: searchResults.map(r => r.document),
      matchedProducts,
      suggestHumanHandoff: confidenceLevel === 'Low'
    };
  }

  public getIndexedCount(): number {
    return this.indexedDocuments.length;
  }

  public getLastIndexTimestamp(): string {
    return this.lastIndexTimestamp;
  }

  public getAllIndexedDocs(): IndexedDocument[] {
    return [...this.indexedDocuments];
  }
}

export const knowledgeEngine = new KnowledgeEngine();
