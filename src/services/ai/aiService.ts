/**
 * IC CMS PRO - AI Engine Abstraction Service (Volume 1 Foundation)
 * Provides clean architectural interfaces and safe fallbacks.
 * Full Gemini API integration will be enabled in Volume 2.
 */

import { knowledgeEngine, KnowledgeEngineAnswer, IndexedDocument } from './knowledgeEngine';
import {
  AIKnowledgeDocument,
  AIPromptContext,
  AIProductRecommendationQuery,
  AIRecommendationResult,
  AICustomerSentimentAnalysis,
  AIServiceConfig
} from './aiTypes';

export const DEFAULT_AI_CONFIG: AIServiceConfig = {
  modelName: 'gemini-2.5-flash',
  temperature: 0.7,
  maxTokens: 1024,
  enableKnowledgeGrounding: true,
  enableHumanHandoff: true,
  confidenceThreshold: 0.85
};

export class AIServiceArchitecture {
  private config: AIServiceConfig = { ...DEFAULT_AI_CONFIG };

  constructor(initialConfig?: Partial<AIServiceConfig>) {
    if (initialConfig) {
      this.config = { ...this.config, ...initialConfig };
    }
  }

  /**
   * Update AI Engine configuration settings
   */
  public updateConfig(newConfig: Partial<AIServiceConfig>): AIServiceConfig {
    this.config = { ...this.config, ...newConfig };
    return this.config;
  }

  /**
   * Get current AI Engine configuration
   */
  public getConfig(): AIServiceConfig {
    return { ...this.config };
  }

  /**
   * Retrieve structured natural answer using KnowledgeEngine (Volume 2A)
   */
  public queryKnowledgeBaseEngine(query: string): KnowledgeEngineAnswer {
    return knowledgeEngine.queryKnowledgeBase(query);
  }

  /**
   * AI Product Recommendation Engine using local Intent Matcher
   */
  public async getProductRecommendations(
    query: AIProductRecommendationQuery
  ): Promise<AIRecommendationResult[]> {
    const qStr = `${query.primaryNeed || ''} ${query.category || ''} ${query.footType || ''} ${query.colorPreference || ''}`;
    const items = knowledgeEngine.searchProductsByIntent(qStr);

    return items.map(item => ({
      productId: item.id,
      productName: item.name,
      matchScore: 95,
      reasoning: `${item.tagline}. ${item.description}`,
      recommendedSizeAdvice: `${item.dimensions}. Regular Fit.`
    }));
  }

  /**
   * Customer Inquiry Sentiment & Lead Scoring Analyzer
   */
  public analyzeLeadSentiment(message: string, inquiryType: string): AICustomerSentimentAnalysis {
    const msgLower = (message || '').toLowerCase();
    const inqLower = (inquiryType || '').toLowerCase();
    const isWholesale = inqLower.includes('toptan') || msgLower.includes('seri') || msgLower.includes('kutu') || msgLower.includes('bayi');

    return {
      sentiment: msgLower.includes('acil') || msgLower.includes('teşekkür') ? 'positive' : 'neutral',
      leadScore: isWholesale ? 90 : 70,
      intent: isWholesale ? 'wholesale_inquiry' : 'retail_purchase',
      suggestedAction: isWholesale ? 'WhatsApp üzerinden toptan fiyat listesi ve seri kataloğu iletiniz.' : 'Müşteriye ürün numarası ve kalıp bilgisi sununuz.'
    };
  }
}

export const aiService = new AIServiceArchitecture();

