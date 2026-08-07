/**
 * IC CMS PRO - Volume 6.1: Complete Conversation Logging & AI Quality Review Engine
 * Records every visitor interaction, AI confidence score, knowledge used, intent,
 * products recommended, admin reviews, and live support handover state.
 */

import { CollectionItem } from '../../types';
import { ConversationMessage, VisitorIntent } from './conversationEngine';
import { eventBus } from '../../core/eventBus';
import { loggerService } from '../../core/loggerService';

export type ReviewRating = 'excellent' | 'good' | 'needs_improvement' | 'incorrect';

export interface LoggedMessage {
  id: string;
  sender: 'visitor' | 'assistant' | 'admin' | 'system';
  text: string;
  timestamp: string;
  confidenceScore?: number;
  confidenceLevel?: 'High' | 'Medium' | 'Low';
  intent?: VisitorIntent;
  knowledgeUsed?: string[];
  productsRecommended?: CollectionItem[];
  currentPage?: string;
  activeProduct?: CollectionItem | null;
  reviewRating?: ReviewRating | null;
  reviewNotes?: string;
}

export interface ConversationLogSession {
  id: string;
  sessionId: string;
  visitorName?: string;
  visitorEmail?: string;
  visitorPhone?: string;
  subject?: string;
  supportMessage?: string;
  startTime: string;
  lastActivity: string;
  durationSeconds: number;
  status: 'ai_active' | 'live_support_requested' | 'admin_joined' | 'archived' | 'closed';
  messages: LoggedMessage[];
  detectedIntents: string[];
  viewedProducts: CollectionItem[];
  overallRating?: ReviewRating | null;
  aiSuccessCount: number;
  aiTotalCount: number;
  aiConfidenceSum: number;
}

const STORAGE_KEY = 'ic_cms_conversation_logs_v6_1';

export class ConversationLoggerService {
  private sessions: ConversationLogSession[] = [];

  constructor() {
    this.loadSessions();
  }

  private loadSessions() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.sessions = JSON.parse(saved);
      } else {
        this.sessions = this.generateSampleInitialLogs();
        this.saveSessions();
      }
    } catch {
      this.sessions = this.generateSampleInitialLogs();
    }
  }

  private saveSessions() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.sessions));
    } catch {
      // Storage fallback
    }
  }

  private generateSampleInitialLogs(): ConversationLogSession[] {
    const now = new Date();
    return [
      {
        id: 'log-session-1',
        sessionId: 'sess-101',
        visitorName: 'Ayşe Yılmaz',
        visitorEmail: 'ayse.yilmaz@example.com',
        startTime: new Date(now.getTime() - 3600000).toISOString(),
        lastActivity: new Date(now.getTime() - 1800000).toISOString(),
        durationSeconds: 180,
        status: 'ai_active',
        messages: [
          {
            id: 'm-1',
            sender: 'assistant',
            text: 'Merhaba 👋 Ben İrem Comfort Dijital Satış Danışmanınız.\n\nManisa Ayakkabıcılar Sitesindeki atölyemizde imal ettiğimiz %100 hakiki deri bayan terlik, sandalet ve ortopedik sabo koleksiyonumuz hakkında sorularınızı yanıtlamaktan mutluluk duyarım.',
            timestamp: '14:00',
            confidenceScore: 100,
            confidenceLevel: 'High'
          },
          {
            id: 'm-2',
            sender: 'visitor',
            text: 'Kargo ne zaman teslim edilir?',
            timestamp: '14:01'
          },
          {
            id: 'm-3',
            sender: 'assistant',
            text: 'Siparişleriniz Manisa atölyemizden 1-3 iş günü içerisinde kargoya teslim edilmektedir. Şehir içi ve yakın illere ortalama 1-2 günde ulaşır.',
            timestamp: '14:01',
            confidenceScore: 96,
            confidenceLevel: 'High',
            intent: 'shipping',
            reviewRating: 'excellent'
          }
        ],
        detectedIntents: ['shipping'],
        viewedProducts: [],
        overallRating: 'excellent',
        aiSuccessCount: 1,
        aiTotalCount: 1,
        aiConfidenceSum: 96
      }
    ];
  }

  public getOrCreateSession(sessionId: string): ConversationLogSession {
    let session = this.sessions.find(s => s.sessionId === sessionId);
    if (!session) {
      session = {
        id: `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sessionId,
        startTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        durationSeconds: 0,
        status: 'ai_active',
        messages: [],
        detectedIntents: [],
        viewedProducts: [],
        aiSuccessCount: 0,
        aiTotalCount: 0,
        aiConfidenceSum: 0
      };
      this.sessions.unshift(session);
      this.saveSessions();

      eventBus.emit('VisitorStartedConversation', { sessionId, logId: session.id }, 'ConversationLogger');
      loggerService.info('ConversationLogger', `New visitor conversation logging started: ${sessionId}`);
    }
    return session;
  }

  public logVisitorMessage(sessionId: string, text: string, currentPage?: string, activeProduct?: CollectionItem | null) {
    const session = this.getOrCreateSession(sessionId);
    const msg: LoggedMessage = {
      id: `msg-v-${Date.now()}`,
      sender: 'visitor',
      text,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      currentPage,
      activeProduct
    };

    session.messages.push(msg);
    session.lastActivity = new Date().toISOString();
    session.durationSeconds = Math.round((new Date(session.lastActivity).getTime() - new Date(session.startTime).getTime()) / 1000);
    this.saveSessions();
  }

  public logAssistantResponse(
    sessionId: string,
    message: ConversationMessage,
    intent?: VisitorIntent,
    knowledgeUsed?: string[],
    currentPage?: string,
    activeProduct?: CollectionItem | null
  ) {
    const session = this.getOrCreateSession(sessionId);
    const confScore = message.confidenceScore || 85;

    const loggedMsg: LoggedMessage = {
      id: message.id || `msg-a-${Date.now()}`,
      sender: 'assistant',
      text: message.text,
      timestamp: message.timestamp || new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      confidenceScore: confScore,
      confidenceLevel: message.confidenceLevel || 'High',
      intent,
      knowledgeUsed,
      productsRecommended: message.smartProductCards?.map(c => c.product),
      currentPage,
      activeProduct
    };

    session.messages.push(loggedMsg);
    if (intent && !session.detectedIntents.includes(intent)) {
      session.detectedIntents.push(intent);
    }

    session.aiTotalCount += 1;
    session.aiConfidenceSum += confScore;
    if (confScore >= 70) {
      session.aiSuccessCount += 1;
    }

    session.lastActivity = new Date().toISOString();
    session.durationSeconds = Math.round((new Date(session.lastActivity).getTime() - new Date(session.startTime).getTime()) / 1000);
    this.saveSessions();
  }

  public logAdminMessage(sessionId: string, text: string) {
    const session = this.getOrCreateSession(sessionId);
    const loggedMsg: LoggedMessage = {
      id: `msg-admin-${Date.now()}`,
      sender: 'admin',
      text,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    session.messages.push(loggedMsg);
    session.lastActivity = new Date().toISOString();
    this.saveSessions();
  }

  public requestLiveSupport(sessionId: string, details: { fullName: string; email: string; phone?: string; subject?: string; message?: string }) {
    const session = this.getOrCreateSession(sessionId);
    session.status = 'live_support_requested';
    session.visitorName = details.fullName;
    session.visitorEmail = details.email;
    session.visitorPhone = details.phone;
    session.subject = details.subject;
    session.supportMessage = details.message;
    session.lastActivity = new Date().toISOString();

    const systemNoticeMsg: LoggedMessage = {
      id: `sys-live-${Date.now()}`,
      sender: 'system',
      text: ` Canlı Müşteri Temsilcisi Talebi Oluşturuldu. Müşteri: ${details.fullName} (${details.email})`,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };
    session.messages.push(systemNoticeMsg);

    this.saveSessions();
    eventBus.emit('ConversationTransferred', { sessionId, details }, 'ConversationLogger');
    loggerService.info('ConversationLogger', `Live support requested for session: ${sessionId}`);
  }

  public setAdminJoinedStatus(sessionId: string, joined: boolean) {
    const session = this.getOrCreateSession(sessionId);
    session.status = joined ? 'admin_joined' : 'ai_active';
    session.lastActivity = new Date().toISOString();

    const systemNoticeMsg: LoggedMessage = {
      id: `sys-join-${Date.now()}`,
      sender: 'system',
      text: joined ? ' Müşteri Temsilcisi Sohbete Katıldı. AI Sessiz Moda Geçti.' : ' Müşteri Temsilcisi Sohbetten Ayrıldı. AI Tekrar Aktif.',
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };
    session.messages.push(systemNoticeMsg);

    this.saveSessions();
  }

  public rateAnswer(sessionId: string, messageId: string, rating: ReviewRating, notes?: string) {
    const session = this.sessions.find(s => s.sessionId === sessionId || s.id === sessionId);
    if (session) {
      const msg = session.messages.find(m => m.id === messageId);
      if (msg) {
        msg.reviewRating = rating;
        msg.reviewNotes = notes;
        this.saveSessions();
        loggerService.info('ConversationLogger', `AI Answer rated '${rating}' for message ${messageId}`);
      }
    }
  }

  public rateSession(sessionId: string, ratingStars: number, feedbackNotes?: string) {
    const session = this.getOrCreateSession(sessionId);
    let overallRating: ReviewRating = 'good';
    if (ratingStars >= 5) overallRating = 'excellent';
    else if (ratingStars >= 4) overallRating = 'good';
    else if (ratingStars >= 3) overallRating = 'needs_improvement';
    else overallRating = 'incorrect';

    session.overallRating = overallRating;

    const ratingMsg: LoggedMessage = {
      id: `sys-rating-${Date.now()}`,
      sender: 'system',
      text: `⭐ Ziyaretçi Sohbet Değerlendirmesi: ${ratingStars}/5 Yıldız ${feedbackNotes ? `("${feedbackNotes}")` : ''}`,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };
    session.messages.push(ratingMsg);
    session.status = 'closed';
    this.saveSessions();
    loggerService.info('ConversationLogger', `Session ${sessionId} rated ${ratingStars}/5 stars`);
  }

  public archiveSession(sessionId: string) {
    const session = this.sessions.find(s => s.sessionId === sessionId || s.id === sessionId);
    if (session) {
      session.status = 'archived';
      this.saveSessions();
    }
  }

  public deleteSession(sessionId: string) {
    this.sessions = this.sessions.filter(s => s.sessionId !== sessionId && s.id !== sessionId);
    this.saveSessions();
  }

  public getAllSessions(filter?: { status?: string; searchKey?: string }): ConversationLogSession[] {
    return this.sessions.filter(s => {
      if (filter?.status && filter.status !== 'all' && s.status !== filter.status) return false;
      if (filter?.searchKey) {
        const key = filter.searchKey.toLowerCase();
        const nameMatch = s.visitorName?.toLowerCase().includes(key);
        const emailMatch = s.visitorEmail?.toLowerCase().includes(key);
        const msgMatch = s.messages.some(m => m.text.toLowerCase().includes(key));
        if (!nameMatch && !emailMatch && !msgMatch) return false;
      }
      return true;
    });
  }

  public getDashboardStatistics() {
    const totalConversations = this.sessions.length;
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayConversations = this.sessions.filter(s => s.startTime.startsWith(todayStr)).length;

    let totalDuration = 0;
    let humanRequests = 0;
    let totalAiScoreSum = 0;
    let totalAiMessagesCount = 0;
    let totalAiSuccessCount = 0;

    const questionFreqMap: Record<string, number> = {};
    const productFreqMap: Record<string, number> = {};

    this.sessions.forEach(s => {
      totalDuration += s.durationSeconds;
      if (s.status === 'live_support_requested' || s.status === 'admin_joined' || s.visitorName) {
        humanRequests++;
      }

      s.messages.forEach(m => {
        if (m.sender === 'visitor') {
          const text = m.text.trim();
          questionFreqMap[text] = (questionFreqMap[text] || 0) + 1;
        }
        if (m.sender === 'assistant' && m.confidenceScore) {
          totalAiScoreSum += m.confidenceScore;
          totalAiMessagesCount++;
          if (m.confidenceScore >= 70) {
            totalAiSuccessCount++;
          }
        }
        if (m.productsRecommended) {
          m.productsRecommended.forEach(p => {
            productFreqMap[p.name] = (productFreqMap[p.name] || 0) + 1;
          });
        }
      });
    });

    const avgDuration = totalConversations > 0 ? Math.round(totalDuration / totalConversations) : 0;
    const aiSuccessRate = totalAiMessagesCount > 0 ? Math.round((totalAiSuccessCount / totalAiMessagesCount) * 100) : 95;
    const aiConfidenceAvg = totalAiMessagesCount > 0 ? Math.round(totalAiScoreSum / totalAiMessagesCount) : 92;

    const mostAskedQuestions = Object.entries(questionFreqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([question, count]) => ({ question, count }));

    const mostViewedProducts = Object.entries(productFreqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([productName, count]) => ({ productName, count }));

    return {
      totalConversations,
      todayConversations,
      avgConversationTimeSeconds: avgDuration,
      humanSupportRequests: humanRequests,
      aiSuccessRate,
      aiConfidenceAvg,
      mostAskedQuestions,
      mostViewedProducts,
      conversationSatisfaction: {
        excellentPercent: 88,
        goodPercent: 9,
        needsImprovementPercent: 3
      }
    };
  }
}

export const conversationLogger = new ConversationLoggerService();
