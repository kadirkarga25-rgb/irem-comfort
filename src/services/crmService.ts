/**
 * IC CMS PRO - Volume 2D: Local CRM & Visitor Session Memory Service
 * Manages visitor profiles, conversation histories, dynamic customer scores,
 * support statuses, and privacy consent rules.
 */

import { CollectionItem } from '../types';
import { ConversationMessage } from './ai/conversationEngine';
import { DynamicCustomerScores, ShoppingInterestCategory } from './ai/visitorBehaviourEngine';

export type SupportStatus = 'bot_active' | 'human_requested' | 'human_connected' | 'closed';

export interface VisitorCrmRecord {
  visitorId: string;
  sessionId: string;
  fullName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  notes?: string;
  conversationHistory: ConversationMessage[];
  viewedProducts: CollectionItem[];
  viewedCategories: string[];
  shoppingInterests: ShoppingInterestCategory[];
  scores: DynamicCustomerScores;
  supportStatus: SupportStatus;
  newsletterConsent: boolean;
  privacyConsentGiven: boolean;
  isHumanOperatorActive: boolean;
  currentPage: string;
  createdAt: string;
  lastActivity: string;
}

const CRM_STORAGE_KEY = 'ic_cms_visitor_crm_v2d';

export class CrmService {
  private activeRecord: VisitorCrmRecord;

  constructor() {
    this.activeRecord = this.initializeVisitorRecord();
  }

  private initializeVisitorRecord(): VisitorCrmRecord {
    const existing = this.loadFromStorage();
    if (existing) {
      return existing;
    }

    const newVisitorId = `VISITOR-${Math.floor(100000 + Math.random() * 900000)}`;
    const newSessionId = `SESS-${Date.now().toString(36)}`;

    return {
      visitorId: newVisitorId,
      sessionId: newSessionId,
      conversationHistory: [],
      viewedProducts: [],
      viewedCategories: [],
      shoppingInterests: ['Daily Comfort'],
      scores: {
        shoppingInterestScore: 35,
        purchaseProbability: 20,
        wholesaleProbability: 10,
        conversationQuality: 90,
        supportRequirement: 10,
        confidenceLevel: 'High'
      },
      supportStatus: 'bot_active',
      newsletterConsent: false,
      privacyConsentGiven: true,
      isHumanOperatorActive: false,
      currentPage: 'home',
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };
  }

  private loadFromStorage(): VisitorCrmRecord | null {
    try {
      const saved = localStorage.getItem(CRM_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Memory fallback
    }
    return null;
  }

  public getActiveRecord(): VisitorCrmRecord {
    return { ...this.activeRecord };
  }

  public updateRecord(updates: Partial<VisitorCrmRecord>): VisitorCrmRecord {
    this.activeRecord = {
      ...this.activeRecord,
      ...updates,
      lastActivity: new Date().toISOString()
    };

    if (this.activeRecord.privacyConsentGiven) {
      try {
        localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(this.activeRecord));
      } catch {
        // Fallback
      }
    }
    return this.getActiveRecord();
  }

  public setHumanSupportRequested(info: { fullName: string; email: string; phone?: string; subject?: string; message?: string; newsletterConsent: boolean }): VisitorCrmRecord {
    return this.updateRecord({
      fullName: info.fullName,
      email: info.email,
      phone: info.phone,
      subject: info.subject,
      notes: info.message,
      newsletterConsent: info.newsletterConsent,
      supportStatus: 'human_requested'
    });
  }

  public setOperatorTakeover(active: boolean): VisitorCrmRecord {
    return this.updateRecord({
      isHumanOperatorActive: active,
      supportStatus: active ? 'human_connected' : 'bot_active'
    });
  }

  public setOperatorActive(active: boolean): VisitorCrmRecord {
    return this.setOperatorTakeover(active);
  }

  public sendAdminTakeoverMessage(text: string): VisitorCrmRecord {
    const time = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const adminMsg: ConversationMessage = {
      id: `admin-${Date.now()}`,
      sender: 'admin',
      text,
      timestamp: time
    };
    return this.updateRecord({
      conversationHistory: [...this.activeRecord.conversationHistory, adminMsg]
    });
  }
}

export const crmService = new CrmService();
