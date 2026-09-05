/**
 * IC CMS PRO - Volume 2B: Local Conversation Engine & Digital Sales Consultant
 * Manages conversational context, active product state, user intent interpretation,
 * follow-up memory, and natural luxury sales representative dialogue generation.
 */

import { CollectionItem } from '../../types';
import { knowledgeEngine, KnowledgeEngineAnswer } from './knowledgeEngine';
import { productMatchingEngine, ProductMatchResult, ComparisonResult } from './productMatchingEngine';
import { CONTACT_DATA, COLLECTION_ITEMS } from '../../constants/data';

export interface SmartProductCardData {
  product: CollectionItem;
  score: number;
  matchReason: string;
  recommendedFor: string;
}

export interface ConversationMessage {
  id: string;
  sender: 'visitor' | 'assistant' | 'admin' | 'system';
  text: string;
  timestamp: string;
  confidenceLevel?: 'High' | 'Medium' | 'Low';
  confidenceScore?: number;
  matchedProduct?: CollectionItem;
  smartProductCards?: SmartProductCardData[];
  comparisonData?: ComparisonResult;
  guidedQuestion?: string;
  actionButtons?: Array<{
    label: string;
    type: 'link' | 'quick_reply' | 'whatsapp' | 'live_support';
    url?: string;
    payload?: string;
  }>;
}

export interface ConversationContextState {
  activeProduct: CollectionItem | null;
  viewedProducts: CollectionItem[];
  currentPage: string;
  previousQuestion: string | null;
  conversationHistory: ConversationMessage[];
  shoppingInterest: string | null;
}

export type VisitorIntent = 
  | 'greeting'
  | 'color_variants'
  | 'product_comfort'
  | 'shipping'
  | 'size_fit'
  | 'wholesale_inquiry'
  | 'purchase_location'
  | 'product_recommendation'
  | 'comparison_query'
  | 'uncertain_guidance'
  | 'company_info'
  | 'general_query';

export interface IntentAnalysis {
  primaryIntent: VisitorIntent;
  topic: string;
  isExplicitPurchaseRequested: boolean;
  targetProductKeywords: string[];
}

export class ConversationEngine {
  /**
   * Pipeline Step 1 & 2: Understand visitor's intent & identify primary topic
   */
  private analyzeIntentAndTopic(query: string, context: ConversationContextState): IntentAnalysis {
    const qLower = (query || '').toLowerCase().trim();

    const isExplicitPurchaseRequested = 
      qLower.includes('trendyol') || 
      qLower.includes('satın al') || 
      qLower.includes('nereden alabilirim') || 
      qLower.includes('satınal') || 
      qLower.includes('mağaza linki') || 
      qLower.includes('sipariş ver') ||
      qLower.includes('fiyatı ne kadar');

    // Extract product keywords if mentioned
    const targetProductKeywords: string[] = [];
    if (context.activeProduct?.name) {
      targetProductKeywords.push((context.activeProduct.name || '').toLowerCase());
    }

    // Determine Intent
    let primaryIntent: VisitorIntent = 'general_query';

    if (/^(merhaba|selam|günaydın|iyi günler|iyi akşamlar|iyi çalışmalar|kolay gelsin)$/i.test(qLower)) {
      primaryIntent = 'greeting';
    } else if (qLower.includes('karşılaştır') || qLower.includes('farkı ne') || qLower.includes('arasındaki fark') || qLower.includes('hangisi daha iyi') || qLower.includes('vs')) {
      primaryIntent = 'comparison_query';
    } else if (qLower.includes('bilmiyorum') || qLower.includes('kararsız') || qLower.includes('ne almalıyım') || qLower.includes('hangisini seçmeliyim') || qLower.includes('yardımcı ol')) {
      primaryIntent = 'uncertain_guidance';
    } else if (qLower.includes('renk') || qLower.includes('siyah') || qLower.includes('beyaz') || qLower.includes('taba') || qLower.includes('başka')) {
      primaryIntent = 'color_variants';
    } else if (qLower.includes('rahat') || qLower.includes('ortopedik') || qLower.includes('ağrı') || qLower.includes('taban') || qLower.includes('kullanım') || qLower.includes('sabo')) {
      primaryIntent = 'product_comfort';
    } else if (qLower.includes('kargo') || qLower.includes('teslimat') || qLower.includes('kaç gün') || qLower.includes('ulaşır') || qLower.includes('gönderim')) {
      primaryIntent = 'shipping';
    } else if (qLower.includes('numara') || qLower.includes('kalıp') || qLower.includes('36') || qLower.includes('37') || qLower.includes('38') || qLower.includes('39') || qLower.includes('40') || qLower.includes('taraklı')) {
      primaryIntent = 'size_fit';
    } else if (qLower.includes('toptan') || qLower.includes('seri') || qLower.includes('koli') || qLower.includes('imalat') || qLower.includes('bayilik')) {
      primaryIntent = 'wholesale_inquiry';
    } else if (isExplicitPurchaseRequested) {
      primaryIntent = 'purchase_location';
    } else if (qLower.includes('öneri') || qLower.includes('tavsiye') || qLower.includes('hangisi') || qLower.includes('en çok satan') || qLower.includes('sandalet') || qLower.includes('terlik')) {
      primaryIntent = 'product_recommendation';
    } else if (qLower.includes('nerede') || qLower.includes('adres') || qLower.includes('atölye') || qLower.includes('manisa') || qLower.includes('hakkında') || qLower.includes('iletişim')) {
      primaryIntent = 'company_info';
    }

    return {
      primaryIntent,
      topic: qLower,
      isExplicitPurchaseRequested,
      targetProductKeywords
    };
  }

  /**
   * Pipeline Step 3, 4, 5 & 6: Collect knowledge, remove duplication & rank by priority
   * Priority: Current Product -> Current Conversation -> Website Knowledge -> Previous Conversation -> General Company Info
   */
  private synthesizeRankedKnowledge(
    userText: string,
    intent: IntentAnalysis,
    context: ConversationContextState
  ): {
    combinedSentences: string[];
    matchedProducts: CollectionItem[];
    confidenceLevel: 'High' | 'Medium' | 'Low';
    confidenceScore: number;
  } {
    const activeProd = context.activeProduct;
    const rawKnowledge: KnowledgeEngineAnswer = knowledgeEngine.queryKnowledgeBase(userText);
    const seenSentences = new Set<string>();
    const combinedSentences: string[] = [];

    const addUniqueSentence = (sentence: string) => {
      const clean = (sentence || '').trim();
      const norm = clean.toLowerCase();
      if (norm.length > 5 && !seenLineSetHas(seenSentences, norm)) {
        seenSentences.add(norm);
        combinedSentences.push(clean);
      }
    };

    // Priority 1: Current Active Product Context
    if (activeProd) {
      if (intent.primaryIntent === 'color_variants') {
        const availableColors = activeProd.colors?.map(c => c.name).filter(Boolean).join(', ') || 'Standart Deri Tonları';
        const hasBlack = activeProd.colors?.some(c => (c.name || '').toLowerCase().includes('siyah'));
        addUniqueSentence(`İncelemekte olduğunuz "${activeProd.name}" modelimizin renk seçenekleri: ${availableColors}.`);
        if (intent.topic.includes('siyah')) {
          addUniqueSentence(hasBlack ? `Evet, bu modelimizin Siyah renk seçeneği üretilmektedir.` : `Bu modelimizde siyah renk tükenmiş olabilir. Dilerseniz siyah renkteki diğer hakiki deri modellerimizi sunabilirim.`);
        }
        addUniqueSentence(`Tüm ürünlerimizde %100 hakiki anilin deri saya ve nefes alabilir deri astar kullanılmaktadır.`);
      } else if (intent.primaryIntent === 'product_comfort') {
        const features = activeProd.features?.join(', ') || 'Anatomik kavisli taban yapısı';
        addUniqueSentence(`"${activeProd.name}" modelimiz gün boyu süren ayakta durmalarda maksimum konfor sağlamak üzere anatomik kavis desteği ile tasarlanmıştır.`);
        addUniqueSentence(`Öne çıkan özellikleri: ${features}.`);
        addUniqueSentence(`Şok emici özel taban yapısı sayesinde diz ve bel yükünü dengeler.`);
      } else if (intent.primaryIntent === 'size_fit') {
        addUniqueSentence(`"${activeProd.name}" modelimizin mevcut numara serisi: ${activeProd.dimensions}.`);
        addUniqueSentence(`Kalıplarımız tam standart (Regular Fit) ölçülerdedir. Günlük ayak numaranızı tercih etmenizi öneririz.`);
        if (intent.topic.includes('taraklı')) {
          addUniqueSentence(`Taraklı veya ödemli ayaklar için cırt cırtlı ve ayarlanabilir tokalı terlik modellerimiz ekstra rahatlık sunmaktadır.`);
        }
      } else if (intent.primaryIntent === 'purchase_location' || intent.isExplicitPurchaseRequested) {
        addUniqueSentence(`"${activeProd.name}" modelimizi Trendyol yetkili satıcımız **Anavelle** mağazamızdan veya Manisa atölyemizden sipariş verebilirsiniz.`);
      }
    }

    // Priority 2 & 3: Search results from Website Knowledge Engine
    if (rawKnowledge.relevantDocs.length > 0) {
      rawKnowledge.relevantDocs.forEach(doc => {
        let cleanContent = doc.content
          .replace(/^Soru:.* Cevap:\s*/i, '')
          .replace(/^İrem Comfort Üretim Atölyesi:\s*/i, '')
          .trim();

        const sentences = cleanContent.split(/(?<=[.!?])\s+/);
        sentences.forEach(s => addUniqueSentence(s));
      });
    }

    // Priority 4 & 5: Relevant Products (Strictly Max 3)
    let matchedProducts = rawKnowledge.matchedProducts ? rawKnowledge.matchedProducts.slice(0, 3) : [];
    if (activeProd && !matchedProducts.some(p => p.id === activeProd.id)) {
      matchedProducts = [activeProd, ...matchedProducts].slice(0, 3);
    }

    return {
      combinedSentences,
      matchedProducts,
      confidenceLevel: rawKnowledge.confidenceLevel,
      confidenceScore: rawKnowledge.confidenceScore
    };
  }

  /**
   * Pipeline Step 7 & 8: Generate ONE natural, structured response
   * Structure: 1. Direct Answer 2. Supporting Explanation 3. Optional Recommendation (Max 3)
   */
  private generateStructuredResponse(
    intent: IntentAnalysis,
    combinedSentences: string[],
    matchedProducts: CollectionItem[],
    context: ConversationContextState
  ): string {
    // Handling Greeting Intent
    if (intent.primaryIntent === 'greeting') {
      let welcomeMsg = 'Merhaba, İrem Comfort Müşteri Danışma Hattına hoş geldiniz 👋\n\n1993 yılından bu yana Manisa Ayakkabıcılar Sitesindeki atölyemizde imal ettiğimiz %100 hakiki deri bayan terlik, sandalet ve ortopedik sabo koleksiyonumuz hakkında size nasıl yardımcı olabilirim?';
      if (context.viewedProducts.length > 0) {
        welcomeMsg += `\n\nZiyaretiniz sırasında ${context.viewedProducts.length} adet modelimizi incelediniz. Dilerseniz modellerimiz hakkında merak ettiğiniz detayları yanıtlayabilirim.`;
      }
      return welcomeMsg;
    }

    if (combinedSentences.length === 0) {
      return `Bu konuda size daha doğru yardımcı olabilmemiz için canlı destek ekibimize bağlanabilirsiniz.`;
    }

    // 1. Direct Answer (first 1-2 core sentences)
    const directAnswer = combinedSentences.slice(0, 2).join(' ');

    // 2. Supporting Explanation (next 2-4 supporting sentences)
    const supportingExplanation = combinedSentences.slice(2, 5).join(' ');

    let responseText = directAnswer;
    if (supportingExplanation) {
      responseText += `\n\n${supportingExplanation}`;
    }

    // 3. Optional Recommendation (Only if relevant and helps answer the user, Max 3)
    if (
      (intent.primaryIntent === 'product_recommendation' || intent.primaryIntent === 'size_fit' || intent.primaryIntent === 'product_comfort') &&
      matchedProducts.length > 0
    ) {
      responseText += `\n\n✨ **Öne Çıkan Uygun Modellerimiz (Maks. 3):**\n` +
        matchedProducts.map(p => `• **${p.name}** (${p.category}) - ${p.tagline}`).join('\n');
    }

    return responseText;
  }

  /**
   * Pipeline Step 9 & 10: Perform Quality Validation & Self-Review Check
   */
  private performQualityValidationAndSelfReview(
    rawText: string,
    intent: IntentAnalysis,
    activeProduct: CollectionItem | null
  ): string {
    let cleanText = rawText;

    // 1. Remove duplicate greetings or double intros
    cleanText = cleanText.replace(/(Sayın Müşterimiz,\s*)+/gi, 'Sayın Müşterimiz, ');
    cleanText = cleanText.replace(/(Merhaba,\s*)+/gi, 'Merhaba, ');
    cleanText = cleanText.replace(/(Merhaba 👋\s*)+/gi, 'Merhaba 👋 ');

    // 2. Deduplicate repeated paragraphs/sentences
    const lines = cleanText.split('\n');
    const uniqueLines: string[] = [];
    const seenLineSet = new Set<string>();

    lines.forEach(line => {
      const trimmed = (line || '').trim();
      const norm = trimmed.toLowerCase();
      if (norm.length < 5) {
        uniqueLines.push(line);
      } else if (!seenLineSet.has(norm)) {
        seenLineSet.add(norm);
        uniqueLines.push(line);
      }
    });

    cleanText = uniqueLines.join('\n').trim();

    // 3. Self-Review Check: "Does this answer fully solve the visitor's question?"
    // If text is too short or missing key context, append a polite wrap-up
    if (cleanText.length < 25 && intent.primaryIntent !== 'greeting') {
      cleanText += '\n\nAtölyemizden detaylı bilgi almak veya özel sipariş oluşturmak için dilediğiniz zaman bize ulaşabilirsiniz.';
    }

    return cleanText;
  }

  /**
   * Main Public Entrypoint: Generates a single validated response following the 10-step pipeline & Volume 2C Shopping Intelligence
   */
  public generateResponse(
    userText: string,
    context: ConversationContextState
  ): ConversationMessage {
    const timestamp = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    // Step 1 & 2: Understand Visitor Intent & Topic
    const intent = this.analyzeIntentAndTopic(userText, context);

    // Volume 2C: Special Handling for Step-by-Step Shopping Guidance when user is uncertain
    if (intent.primaryIntent === 'uncertain_guidance') {
      const guidanceText = `Kararsız kalmanız çok doğal! İrem Comfort koleksiyonunda size en doğru ürünü önerebilmem için tek bir soru sorayım:\n\nÜrünü daha çok **günlük şehir kullanımı**, **iş/hastane gibi uzun ayakta durma** veya **taraklı ayak rahatlığı** için mi tercih edeceksiniz?`;
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: guidanceText,
        timestamp,
        confidenceLevel: 'High',
        confidenceScore: 98,
        guidedQuestion: 'Kullanım amacınızı belirterek en uygun modeli hemen listeleyebiliriz.',
        actionButtons: [
          { label: 'Günlük Şehir Kullanımı', type: 'quick_reply', payload: 'Günlük rahat şehir kullanımı için model önerir misiniz?' },
          { label: 'İş / Hastane Sabo', type: 'quick_reply', payload: 'Hastane ve ayakta çalışma için ortopedik sabo önerisi alabilir miyim?' },
          { label: 'Taraklı Ayaklar İçin', type: 'quick_reply', payload: 'Taraklı ve ödemli ayaklar için cırtlı terlik tavsiyesi istiyorum.' },
          { label: 'Yazlık Sandalet', type: 'quick_reply', payload: 'Yazlık hafif hakiki deri sandalet tavsiyesi veriri misiniz?' }
        ]
      };
    }

    // Volume 2C: Special Handling for Comparison Mode
    if (intent.primaryIntent === 'comparison_query') {
      const prodA = COLLECTION_ITEMS[0]; // Çift Tokalı
      const prodB = COLLECTION_ITEMS[1]; // Ortopedik Sabo
      const comparison = productMatchingEngine.compareProducts(prodA, prodB);

      const compText = `**${prodA.name}** ile **${prodB.name}** modellerimizin karşılaştırması:\n\n` +
        `• **${prodA.name}**: Günlük pratik kullanım, ayarlanabilir metal tokalar, çift bantlı esnek deri saya.\n` +
        `• **${prodB.name}**: Sağlık/iş ortamlarında ayakta uzun süre kalanlar için ortopedik pedli taban, nefes alan hava delikli deri.\n\n` +
        `💡 *Karar:* ${comparison.verdict}`;

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: compText,
        timestamp,
        confidenceLevel: 'High',
        confidenceScore: 95,
        comparisonData: comparison,
        smartProductCards: [
          { product: prodA, score: 96, matchReason: 'Günlük Şıklık & Çift Tokalı Uyum', recommendedFor: prodA.subtitle },
          { product: prodB, score: 94, matchReason: 'Ortopedik Destek & Havalandırmalı', recommendedFor: prodB.subtitle }
        ],
        actionButtons: [
          { label: 'Canlı Desteğe Bağlan', type: 'quick_reply', payload: 'Canlı destek ekibinizle görüşmek istiyorum.' },
          { label: 'Tüm Koleksiyonu İncele', type: 'quick_reply', payload: 'Koleksiyonunuzdaki tüm modeller hakkında bilgi almak istiyorum.' }
        ]
      };
    }

    // Step 3, 4, 5 & 6: Search Knowledge Engine & Score Products with Product Matching Engine
    const knowledge = this.synthesizeRankedKnowledge(userText, intent, context);
    const scoredMatches = productMatchingEngine.matchProducts(userText, context.activeProduct);

    // Step 7 & 8: Generate ONE natural, structured response
    let rawResponseText = this.generateStructuredResponse(intent, knowledge.combinedSentences, knowledge.matchedProducts, context);

    if (knowledge.confidenceScore < 60) {
      rawResponseText = `Bu konuda size daha doğru yardımcı olabilmemiz için canlı destek ekibimize bağlanabilirsiniz.`;
    }

    // Step 9: Perform Quality Validation & Silent Self-Review
    const finalAnswerText = this.performQualityValidationAndSelfReview(rawResponseText, intent, context.activeProduct);

    // Convert scored products to Smart Product Cards (Max 3)
    let smartCards: SmartProductCardData[] | undefined = undefined;
    if (
      intent.primaryIntent === 'product_recommendation' ||
      intent.primaryIntent === 'product_comfort' ||
      intent.primaryIntent === 'size_fit' ||
      intent.primaryIntent === 'color_variants' ||
      intent.primaryIntent === 'wholesale_inquiry'
    ) {
      smartCards = scoredMatches.map(m => ({
        product: m.product,
        score: m.score,
        matchReason: m.matchReason,
        recommendedFor: m.recommendedFor
      }));
    }

    // Build Action Buttons - Strictly respect Official Site & Live Support Rules
    let actionButtons: ConversationMessage['actionButtons'] = [
      { label: 'Atölye İletişim & Konum', type: 'quick_reply', payload: 'Atölyeniz nerede, adres bilgisi alabilir miyim?' },
      { label: 'Canlı Desteğe Bağlan', type: 'quick_reply', payload: 'Canlı destek ekibinizle görüşmek istiyorum.' }
    ];

    if (intent.isExplicitPurchaseRequested) {
      const trendyolUrl = context.activeProduct?.trendyolUrl || CONTACT_DATA.trendyolUrl;
      actionButtons.unshift({ label: 'Trendyol Mağazamız ↗', type: 'link', url: trendyolUrl });
    } else if (intent.primaryIntent === 'wholesale_inquiry') {
      actionButtons = [
        { label: 'Toptan Katalog Bilgisi', type: 'quick_reply', payload: 'Toptan sipariş ve koli imalat şartları nelerdir?' },
        { label: 'Canlı Desteğe Bağlan', type: 'quick_reply', payload: 'Canlı destek ekibinizle görüşmek istiyorum.' }
      ];
    } else if (intent.primaryIntent === 'size_fit') {
      actionButtons = [
        { label: 'Taraklı Ayak Modelleri', type: 'quick_reply', payload: 'Taraklı ayaklar için uygun terlikler hangileridir?' },
        { label: 'Canlı Desteğe Bağlan', type: 'quick_reply', payload: 'Canlı destek ekibinizle görüşmek istiyorum.' }
      ];
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: finalAnswerText,
      timestamp,
      confidenceLevel: knowledge.confidenceLevel,
      confidenceScore: knowledge.confidenceScore,
      matchedProduct: smartCards?.[0]?.product || knowledge.matchedProducts[0],
      smartProductCards: smartCards,
      actionButtons
    };
  }

  /**
   * Generates proactive non-spam messages based on user browsing signals
   */
  public generateProactiveGreeting(triggerType: 'time_20s' | 'product_dwell' | 'category_sandals', activeProduct: CollectionItem | null): string {
    if (triggerType === 'product_dwell' && activeProduct) {
      return `Merhaba 👋 **"${activeProduct.name}"** modelimizin hakiki deri kalitesi ve numaraları hakkında merak ettiğiniz bir şey var mı?`;
    }

    if (triggerType === 'category_sandals') {
      return `Yazlık hakiki deri sandalet modellerimizi inceliyorsunuz. Size en uygun numarayı veya taban yüksekliğini birlikte seçebiliriz.`;
    }

    return `Merhaba 👋 İrem Comfort Manisa Atölyesine hoş geldiniz. Terlik, sandalet ve toptan siparişlerinizde yardıma ihtiyacınız olursa buradayım.`;
  }
}

// Helper to check deduplication safely
function seenLineSetHas(set: Set<string>, key: string): boolean {
  for (const existing of set) {
    if (existing.includes(key) || key.includes(existing)) {
      return true;
    }
  }
  return false;
}

export const conversationEngine = new ConversationEngine();
