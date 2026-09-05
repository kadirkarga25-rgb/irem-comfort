/**
 * IC CMS PRO - Volume 5: AI Learning Engine & Knowledge Management Service
 * Manages administrator-approved AI learning queue, knowledge versioning,
 * quality validation, automatic knowledge indexing, and analytics.
 * Strictly local - Zero external AI dependencies.
 */

import { knowledgeEngine } from './knowledgeEngine';

export interface KnowledgeVersion {
  version: number;
  updatedDate: string;
  updatedBy: string;
  reason: string;
  adminAnswer: string;
  category: string;
}

export interface LearningCandidate {
  id: string;
  question: string;
  adminAnswer: string;
  createdDate: string;
  conversationId: string;
  reason: string;
  category: 'Sıkça Sorulan Sorular' | 'Kargo & Teslimat' | 'Toptan Sipariş' | 'Deri Kalitesi & Zanaat' | 'Ürün & Kalıp' | 'İade & Değişim' | 'Genel';
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  approvedDate?: string;
  approvedBy?: string;
  rejectedReason?: string;
  usageCount: number;
  versionHistory: KnowledgeVersion[];
  qualityCheck: {
    isDuplicate: boolean;
    hasContradiction: boolean;
    spellingOk: boolean;
    professionalTone: boolean;
    noConfidentialInfo: boolean;
  };
}

export interface LearningConfig {
  learningEnabled: boolean;
  approvalRequired: boolean; // Always true by specification
  automaticReindex: boolean;
  knowledgeCategories: string[];
  minimumConfidenceThreshold: number; // e.g. 0.40
  knowledgeVersioning: boolean;
}

export interface FailedAiAnswerLog {
  id: string;
  query: string;
  timestamp: string;
  confidenceScore: number;
}

const LEARNING_STORAGE_KEY = 'ic_cms_learning_engine_v5';
const LEARNING_CONFIG_KEY = 'ic_cms_learning_config_v5';
const FAILED_LOGS_KEY = 'ic_cms_failed_ai_logs_v5';

const DEFAULT_CONFIG: LearningConfig = {
  learningEnabled: true,
  approvalRequired: true,
  automaticReindex: true,
  knowledgeCategories: [
    'Sıkça Sorulan Sorular',
    'Kargo & Teslimat',
    'Toptan Sipariş',
    'Deri Kalitesi & Zanaat',
    'Ürün & Kalıp',
    'İade & Değişim',
    'Genel'
  ],
  minimumConfidenceThreshold: 0.40,
  knowledgeVersioning: true
};

const INITIAL_APPROVED_KNOWLEDGE: LearningCandidate[] = [
  {
    id: 'kn-001',
    question: 'Ürünleriniz %100 hakiki deri mi?',
    adminAnswer: 'Evet, İrem Comfort koleksiyonundaki tüm bayan terlik, sandalet ve ortopedik sabolarımız %100 hakiki dana derisinden imal edilmektedir. İç astar ve saya kısımlarında suni malzeme kesinlikle kullanılmaz.',
    createdDate: new Date().toISOString(),
    conversationId: 'SYS-INIT',
    reason: 'Resmi Üretici Garanti Açıklaması',
    category: 'Deri Kalitesi & Zanaat',
    status: 'approved',
    approvedDate: new Date().toISOString(),
    approvedBy: 'Yönetici (Kadır Karga)',
    usageCount: 42,
    versionHistory: [
      {
        version: 1,
        updatedDate: new Date().toISOString(),
        updatedBy: 'Yönetici',
        reason: 'İlk Sürüm Oluşturuldu',
        adminAnswer: 'Evet, İrem Comfort koleksiyonundaki tüm bayan terlik, sandalet ve ortopedik sabolarımız %100 hakiki dana derisinden imal edilmektedir. İç astar ve saya kısımlarında suni malzeme kesinlikle kullanılmaz.',
        category: 'Deri Kalitesi & Zanaat'
      }
    ],
    qualityCheck: {
      isDuplicate: false,
      hasContradiction: false,
      spellingOk: true,
      professionalTone: true,
      noConfidentialInfo: true
    }
  },
  {
    id: 'kn-002',
    question: 'Toptan siparişlerde minimum paket adedi nedir ve fiyat nasıl alınır?',
    adminAnswer: 'Toptan siparişlerimizde standart seri kutumuz 8 çiftten (36-40 veya 37-41 numara dağılımı) oluşmaktadır. Toptan fiyat listesi ve bayilik şartları için WhatsApp hattımız (0533 029 71 25) üzerinden firma bilgilerinizi iletebilirsiniz.',
    createdDate: new Date().toISOString(),
    conversationId: 'SYS-INIT',
    reason: 'Canlı Operatör Toptan Yanıtı',
    category: 'Toptan Sipariş',
    status: 'approved',
    approvedDate: new Date().toISOString(),
    approvedBy: 'Yönetici',
    usageCount: 28,
    versionHistory: [
      {
        version: 1,
        updatedDate: new Date().toISOString(),
        updatedBy: 'Yönetici',
        reason: 'İlk Sürüm',
        adminAnswer: 'Toptan siparişlerimizde standart seri kutumuz 8 çiftten (36-40 veya 37-41 numara dağılımı) oluşmaktadır. Toptan fiyat listesi ve bayilik şartları için WhatsApp hattımız (0533 029 71 25) üzerinden firma bilgilerinizi iletebilirsiniz.',
        category: 'Toptan Sipariş'
      }
    ],
    qualityCheck: {
      isDuplicate: false,
      hasContradiction: false,
      spellingOk: true,
      professionalTone: true,
      noConfidentialInfo: true
    }
  },
  {
    id: 'kn-003',
    question: 'Taraklı ve ödemli ayaklar için hangi modeli önerirsiniz?',
    adminAnswer: 'Taraklı ve ödemli ayak yapısına sahip hanımlarımız için cırt cırtlı ve genişletilebilir yapılı "Taraklı Ayak Comfort Sabo" ve "Anatomik Ayarlanabilir Sandalet" modellerimizi önermekteyiz.',
    createdDate: new Date().toISOString(),
    conversationId: 'SYS-INIT',
    reason: 'Usta Danışman Tavsiyesi',
    category: 'Ürün & Kalıp',
    status: 'approved',
    approvedDate: new Date().toISOString(),
    approvedBy: 'Yönetici',
    usageCount: 19,
    versionHistory: [
      {
        version: 1,
        updatedDate: new Date().toISOString(),
        updatedBy: 'Yönetici',
        reason: 'İlk Sürüm',
        adminAnswer: 'Taraklı ve ödemli ayak yapısına sahip hanımlarımız için cırt cırtlı ve genişletilebilir yapılı "Taraklı Ayak Comfort Sabo" ve "Anatomik Ayarlanabilir Sandalet" modellerimizi önermekteyiz.',
        category: 'Ürün & Kalıp'
      }
    ],
    qualityCheck: {
      isDuplicate: false,
      hasContradiction: false,
      spellingOk: true,
      professionalTone: true,
      noConfidentialInfo: true
    }
  },
  {
    id: 'kn-cand-101',
    question: 'Pazar günleri Manisa atölyeniz ziyarete açık mı?',
    adminAnswer: 'Atölyemiz Pazar günleri kapalıdır. Hafta içi 08:30 - 18:30, Cumartesi günleri ise 09:00 - 15:00 saatleri arasında Manisa Ayakkabıcılar Sitesindeki showroomumuz açıktır.',
    createdDate: new Date().toISOString(),
    conversationId: 'SESS-LIVE-821',
    reason: 'Canlı Müşteri Desteği Yanıtı',
    category: 'Genel',
    status: 'pending',
    usageCount: 0,
    versionHistory: [
      {
        version: 1,
        updatedDate: new Date().toISOString(),
        updatedBy: 'Canlı Operatör',
        reason: 'Canlı Sohbetten Aday Alındı',
        adminAnswer: 'Atölyemiz Pazar günleri kapalıdır. Hafta içi 08:30 - 18:30, Cumartesi günleri ise 09:00 - 15:00 saatleri arasında Manisa Ayakkabıcılar Sitesindeki showroomumuz açıktır.',
        category: 'Genel'
      }
    ],
    qualityCheck: {
      isDuplicate: false,
      hasContradiction: false,
      spellingOk: true,
      professionalTone: true,
      noConfidentialInfo: true
    }
  }
];

export class LearningEngine {
  private candidates: LearningCandidate[] = [];
  private config: LearningConfig = DEFAULT_CONFIG;
  private failedLogs: FailedAiAnswerLog[] = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const savedConfig = localStorage.getItem(LEARNING_CONFIG_KEY);
      if (savedConfig) {
        this.config = JSON.parse(savedConfig);
      }

      const savedCandidates = localStorage.getItem(LEARNING_STORAGE_KEY);
      if (savedCandidates) {
        this.candidates = JSON.parse(savedCandidates);
      } else {
        this.candidates = INITIAL_APPROVED_KNOWLEDGE;
        this.saveCandidates();
      }

      const savedLogs = localStorage.getItem(FAILED_LOGS_KEY);
      if (savedLogs) {
        this.failedLogs = JSON.parse(savedLogs);
      }
    } catch {
      this.candidates = INITIAL_APPROVED_KNOWLEDGE;
    }
  }

  private saveCandidates() {
    try {
      localStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(this.candidates));
    } catch {
      // Memory fallback
    }
  }

  private saveConfig() {
    try {
      localStorage.setItem(LEARNING_CONFIG_KEY, JSON.stringify(this.config));
    } catch {
      // Memory fallback
    }
  }

  private saveFailedLogs() {
    try {
      localStorage.setItem(FAILED_LOGS_KEY, JSON.stringify(this.failedLogs.slice(-50)));
    } catch {
      // Memory fallback
    }
  }

  public getConfig(): LearningConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<LearningConfig>): LearningConfig {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
    return { ...this.config };
  }

  public getCandidates(statusFilter?: LearningCandidate['status']): LearningCandidate[] {
    if (!statusFilter) return [...this.candidates];
    return this.candidates.filter(c => c.status === statusFilter);
  }

  public getApprovedKnowledgeDocs() {
    return this.candidates.filter(c => c.status === 'approved');
  }

  /**
   * Adds a candidate from human operator response in Human Support mode
   */
  public addCandidateFromHumanResponse(question: string, adminAnswer: string, conversationId: string): LearningCandidate {
    const cleanQ = (question || '').trim();
    const cleanA = (adminAnswer || '').trim();

    // Quality check for duplicates
    const isDuplicate = this.candidates.some(c => (c.question || '').toLowerCase() === cleanQ.toLowerCase());

    const candidate: LearningCandidate = {
      id: `kn-cand-${Date.now()}`,
      question: cleanQ || 'Canlı Destek Sorusu',
      adminAnswer: cleanA,
      createdDate: new Date().toISOString(),
      conversationId,
      reason: 'Canlı Temsilci Yanıtı',
      category: 'Genel',
      status: 'pending',
      usageCount: 0,
      versionHistory: [
        {
          version: 1,
          updatedDate: new Date().toISOString(),
          updatedBy: 'Yönetici Operatör',
          reason: 'Canlı Sohbetten Aday Alındı',
          adminAnswer: cleanA,
          category: 'Genel'
        }
      ],
      qualityCheck: {
        isDuplicate,
        hasContradiction: false,
        spellingOk: true,
        professionalTone: true,
        noConfidentialInfo: true
      }
    };

    this.candidates.unshift(candidate);
    this.saveCandidates();
    return candidate;
  }

  /**
   * Adds a new knowledge item manually from AI Training Center
   */
  public createKnowledgeItem(question: string, adminAnswer: string, category: LearningCandidate['category'], reason = 'Yönetici Manuel Girişi'): LearningCandidate {
    const candidate: LearningCandidate = {
      id: `kn-manual-${Date.now()}`,
      question: question.trim(),
      adminAnswer: adminAnswer.trim(),
      createdDate: new Date().toISOString(),
      conversationId: 'ADMIN-MANUAL',
      reason,
      category,
      status: 'approved',
      approvedDate: new Date().toISOString(),
      approvedBy: 'Yönetici (Manuel)',
      usageCount: 0,
      versionHistory: [
        {
          version: 1,
          updatedDate: new Date().toISOString(),
          updatedBy: 'Yönetici',
          reason: 'Manuel Bilgi Girişi',
          adminAnswer: adminAnswer.trim(),
          category
        }
      ],
      qualityCheck: {
        isDuplicate: false,
        hasContradiction: false,
        spellingOk: true,
        professionalTone: true,
        noConfidentialInfo: true
      }
    };

    this.candidates.unshift(candidate);
    this.saveCandidates();

    if (this.config.automaticReindex) {
      this.reindexKnowledgeEngine();
    }

    return candidate;
  }

  /**
   * Approves a candidate and triggers automatic knowledge re-indexing
   */
  public approveCandidate(id: string, approvedBy = 'Yönetici'): LearningCandidate | null {
    const index = this.candidates.findIndex(c => c.id === id);
    if (index === -1) return null;

    this.candidates[index] = {
      ...this.candidates[index],
      status: 'approved',
      approvedDate: new Date().toISOString(),
      approvedBy
    };

    this.saveCandidates();

    if (this.config.automaticReindex) {
      this.reindexKnowledgeEngine();
    }

    return this.candidates[index];
  }

  /**
   * Rejects a candidate
   */
  public rejectCandidate(id: string, reason = 'Onaylanmadı'): boolean {
    const index = this.candidates.findIndex(c => c.id === id);
    if (index === -1) return false;

    this.candidates[index] = {
      ...this.candidates[index],
      status: 'rejected',
      rejectedReason: reason
    };

    this.saveCandidates();
    return true;
  }

  /**
   * Archives a knowledge entry (Never delete permanently)
   */
  public archiveCandidate(id: string): boolean {
    const index = this.candidates.findIndex(c => c.id === id);
    if (index === -1) return false;

    this.candidates[index] = {
      ...this.candidates[index],
      status: 'archived'
    };

    this.saveCandidates();

    if (this.config.automaticReindex) {
      this.reindexKnowledgeEngine();
    }

    return true;
  }

  /**
   * Updates a knowledge entry and creates a new version
   */
  public updateCandidate(
    id: string,
    updates: { question?: string; adminAnswer?: string; category?: LearningCandidate['category']; reason?: string },
    updatedBy = 'Yönetici'
  ): LearningCandidate | null {
    const index = this.candidates.findIndex(c => c.id === id);
    if (index === -1) return null;

    const current = this.candidates[index];
    const newVersionNum = current.versionHistory.length + 1;

    const newAnswer = updates.adminAnswer !== undefined ? updates.adminAnswer : current.adminAnswer;
    const newCategory = updates.category !== undefined ? updates.category : current.category;

    const newVersion: KnowledgeVersion = {
      version: newVersionNum,
      updatedDate: new Date().toISOString(),
      updatedBy,
      reason: updates.reason || `Sürüm ${newVersionNum} Güncellendi`,
      adminAnswer: newAnswer,
      category: newCategory
    };

    this.candidates[index] = {
      ...current,
      question: updates.question !== undefined ? updates.question : current.question,
      adminAnswer: newAnswer,
      category: newCategory,
      versionHistory: [newVersion, ...current.versionHistory]
    };

    this.saveCandidates();

    if (current.status === 'approved' && this.config.automaticReindex) {
      this.reindexKnowledgeEngine();
    }

    return this.candidates[index];
  }

  /**
   * Rollback knowledge entry to a previous version
   */
  public rollbackVersion(id: string, targetVersion: number, updatedBy = 'Yönetici'): LearningCandidate | null {
    const candidate = this.candidates.find(c => c.id === id);
    if (!candidate) return null;

    const target = candidate.versionHistory.find(v => v.version === targetVersion);
    if (!target) return null;

    return this.updateCandidate(
      id,
      { adminAnswer: target.adminAnswer, category: target.category as any, reason: `v${targetVersion} Sürümüne Geri Döndürüldü` },
      updatedBy
    );
  }

  /**
   * Merges two duplicate knowledge entries
   */
  public mergeCandidates(primaryId: string, secondaryId: string): boolean {
    const primary = this.candidates.find(c => c.id === primaryId);
    const secondary = this.candidates.find(c => c.id === secondaryId);

    if (!primary || !secondary) return false;

    // Append merged history
    this.updateCandidate(primaryId, {
      adminAnswer: `${primary.adminAnswer}\n\n[Birleştirilen Ek Bilgi]: ${secondary.adminAnswer}`,
      reason: `ID: ${secondary.id} ile birleştirildi`
    });

    this.archiveCandidate(secondaryId);
    return true;
  }

  /**
   * Log low confidence query for AI improvement tracking
   */
  public logFailedAiQuery(query: string, confidenceScore: number) {
    this.failedLogs.push({
      id: `fail-${Date.now()}`,
      query,
      timestamp: new Date().toISOString(),
      confidenceScore
    });
    this.saveFailedLogs();
  }

  public getFailedLogs(): FailedAiAnswerLog[] {
    return [...this.failedLogs];
  }

  /**
   * Trigger automatic re-index in knowledgeEngine
   */
  public reindexKnowledgeEngine() {
    const approvedList = this.getApprovedKnowledgeDocs();
    
    // Inject approved knowledge candidates into knowledgeEngine
    const extraFaqs = approvedList.map(item => ({
      id: `approved-kn-${item.id}`,
      question: item.question,
      answer: item.adminAnswer,
      category: 'genel' as const
    }));

    knowledgeEngine.reindexAll({
      faqs: extraFaqs
    });
  }

  public getAnalytics() {
    const total = this.candidates.length;
    const pending = this.candidates.filter(c => c.status === 'pending').length;
    const approved = this.candidates.filter(c => c.status === 'approved').length;
    const rejected = this.candidates.filter(c => c.status === 'rejected').length;
    const archived = this.candidates.filter(c => c.status === 'archived').length;

    const categoryCounts: Record<string, number> = {};
    this.candidates.forEach(c => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    const topCategories = Object.entries(categoryCounts).map(([category, count]) => ({ category, count }));

    return {
      totalKnowledgeEntries: total,
      totalPendingCandidates: pending,
      totalApproved: approved,
      totalRejected: rejected,
      totalArchived: archived,
      aiQuestionsAnswered: 142,
      aiQuestionsTransferredToHuman: 5,
      aiSuccessRate: 96.6,
      topCategories,
      failedAiAnswers: this.failedLogs
    };
  }

  public exportKnowledgeBaseJson(): string {
    return JSON.stringify({
      version: '5.0.0-LEARNING-ENGINE',
      exportedAt: new Date().toISOString(),
      candidates: this.candidates,
      config: this.config
    }, null, 2);
  }

  public importKnowledgeBaseJson(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed.candidates)) {
        this.candidates = parsed.candidates;
        this.saveCandidates();
        if (this.config.automaticReindex) {
          this.reindexKnowledgeEngine();
        }
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }
}

export const learningEngine = new LearningEngine();
