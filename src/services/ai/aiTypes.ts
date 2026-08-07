/**
 * IC CMS PRO - AI Engine Architecture Interfaces (Volume 1 Foundation)
 * Prepared for Volume 2 AI Integration (Knowledge Engine, Conversation Engine, Recommendation Engine)
 */

export interface AIKnowledgeDocument {
  id: string;
  category: 'product' | 'brand' | 'faq' | 'craftsmanship' | 'leather_care' | 'b2b_wholesale';
  title: string;
  content: string;
  tags: string[];
  metadata?: Record<string, any>;
  lastIndexedAt?: string;
}

export interface AIPromptContext {
  customerPreferences?: {
    footType?: 'regular' | 'wide' | 'high_instep';
    usage?: 'daily' | 'work' | 'hospital_sabo' | 'summer_sandal';
    preferredMaterial?: 'leather' | 'suede' | 'nubuck';
  };
  conversationHistory?: Array<{
    role: 'user' | 'model' | 'system';
    content: string;
    timestamp: string;
  }>;
  relevantDocs?: AIKnowledgeDocument[];
}

export interface AIProductRecommendationQuery {
  footType?: string;
  category?: string;
  primaryNeed?: string; // e.g. "standing all day", "orthopedic support", "elegance"
  priceRangeMax?: number;
  colorPreference?: string;
}

export interface AIRecommendationResult {
  productId: string;
  productName: string;
  matchScore: number; // 0 - 100
  reasoning: string;
  recommendedSizeAdvice: string;
}

export interface AICustomerSentimentAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  leadScore: number; // 0 - 100
  intent: 'wholesale_inquiry' | 'retail_purchase' | 'support_question' | 'general';
  suggestedAction: string;
}

export interface AIServiceConfig {
  modelName: string; // e.g. 'gemini-2.5-flash'
  temperature: number;
  maxTokens: number;
  enableKnowledgeGrounding: boolean;
  enableHumanHandoff: boolean;
  confidenceThreshold: number;
}
