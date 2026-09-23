/**
 * IC CMS PRO - Volume 2D: Visitor Session Memory, Behaviour Engine & Conversation Context
 * Tracks active product, viewed products history, active page section,
 * visitor behaviour scores, CRM record sync, and live human operator takeover.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CollectionItem } from '../types';
import { conversationEngine, ConversationMessage, ConversationContextState } from '../services/ai/conversationEngine';
import { visitorBehaviourEngine, VisitorBehaviourState } from '../services/ai/visitorBehaviourEngine';
import { crmService, VisitorCrmRecord } from '../services/crmService';
import { conversationLogger } from '../services/ai/conversationLogger';

interface ConversationContextType {
  isOpen: boolean;
  hasUnread: boolean;
  activeProduct: CollectionItem | null;
  viewedProducts: CollectionItem[];
  messages: ConversationMessage[];
  proactiveBubbleText: string | null;
  behaviourState: VisitorBehaviourState;
  crmRecord: VisitorCrmRecord;
  isHumanSupportModalOpen: boolean;
  sessionId: string;
  
  // Actions
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  openChatWithPrompt: (promptText: string) => void;
  setActiveProduct: (item: CollectionItem | null) => void;
  recordProductView: (item: CollectionItem) => void;
  sendMessage: (text: string) => void;
  dismissProactiveBubble: () => void;
  clearConversation: () => void;
  openHumanSupportModal: () => void;
  closeHumanSupportModal: () => void;
  submitHumanSupportSuccess: (fullName: string) => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

const ADVISOR_NAMES = ['Elif', 'Derya', 'Selin', 'Merve'];
const getSessionAdvisorName = (sessionId: string) => {
  let hash = 0;
  for (let i = 0; i < sessionId.length; i++) hash = (hash * 31 + sessionId.charCodeAt(i)) >>> 0;
  return ADVISOR_NAMES[hash % ADVISOR_NAMES.length];
};

const INITIAL_WELCOME_MSG: ConversationMessage = {
  id: 'welcome-0',
  sender: 'assistant',
  text: 'Merhaba 👋 Ben İrem Comfort dijital satış danışmanınız.\n\nMağazanız için model, koleksiyon, numara veya toptan sipariş konusunda birlikte bakalım. Ne aradığınızı yazmanız yeterli.',
  timestamp: 'Şimdi',
  actionButtons: [
    { label: 'Toptan Sipariş Koşulları', type: 'quick_reply', payload: 'Toptan sipariş şartları nelerdir?' },
    { label: 'Kargo & Teslimat Süreleri', type: 'quick_reply', payload: 'Kargo kaç günde teslim edilir?' },
    { label: 'Canlı Temsilciye Bağlan', type: 'quick_reply', payload: 'Canlı müşteri temsilcisi ile görüşmek istiyorum.' }
  ]
};

export const ConversationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessionId] = useState<string>(() => {
    let id = sessionStorage.getItem('ic_cms_session_id');
    if (!id) {
      id = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      sessionStorage.setItem('ic_cms_session_id', id);
    }
    return id;
  });

  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [activeProduct, setActiveProductState] = useState<CollectionItem | null>(null);
  const [viewedProducts, setViewedProducts] = useState<CollectionItem[]>([]);
  const [messages, setMessages] = useState<ConversationMessage[]>([INITIAL_WELCOME_MSG]);
  const [proactiveBubbleText, setProactiveBubbleText] = useState<string | null>(null);
  const [proactiveTriggered, setProactiveTriggered] = useState(false);
  const [isHumanSupportModalOpen, setIsHumanSupportModalOpen] = useState(false);
  const [lowConfidenceStreak, setLowConfidenceStreak] = useState(0);

  const [behaviourState, setBehaviourState] = useState<VisitorBehaviourState>(visitorBehaviourEngine.getBehaviourState());
  const [crmRecord, setCrmRecord] = useState<VisitorCrmRecord>(crmService.getActiveRecord());

  // Log initial welcome message in conversation logger
  useEffect(() => {
    conversationLogger.getOrCreateSession(sessionId);
  }, [sessionId]);

  // Periodically sync CRM record to detect live admin takeover messages
  useEffect(() => {
    const interval = setInterval(() => {
      const latest = crmService.getActiveRecord();
      setCrmRecord(latest);
      if (latest.conversationHistory.length > messages.length) {
        setMessages(latest.conversationHistory);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [messages]);

  // Set active product and update behaviour/session memory
  const setActiveProduct = useCallback((item: CollectionItem | null) => {
    setActiveProductState(item);
    if (item) {
      setViewedProducts(prev => {
        if (!prev.some(p => p.id === item.id)) {
          return [item, ...prev];
        }
        return prev;
      });
      const updatedBehaviour = visitorBehaviourEngine.recordProductView(item);
      setBehaviourState(updatedBehaviour);
      crmService.updateRecord({
        viewedProducts: updatedBehaviour.viewedProducts,
        scores: updatedBehaviour.scores
      });
    }
  }, []);

  const recordProductView = useCallback((item: CollectionItem) => {
    setActiveProduct(item);
  }, [setActiveProduct]);

  // Beta Notice Display Check
  const checkAndShowBetaNotice = useCallback(() => {}, []);

  // Handle sending a user message
  const sendMessage = useCallback((text: string) => {
    if (!text || typeof text !== 'string' || !text.trim()) return;

    // Check if user explicitly wants human support
    const lower = (text || '').toLowerCase();
    if (lower.includes('canlı müşteri temsilcisi') || lower.includes('temsilciye bağlan') || lower.includes('insanla görüş') || lower.includes('canlı destek')) {
      setIsHumanSupportModalOpen(true);
    }

    const userMsgTime = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ConversationMessage = {
      id: `user-${Date.now()}`,
      sender: 'visitor',
      text,
      timestamp: userMsgTime
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setProactiveBubbleText(null);

    // Log user message to conversationLogger
    conversationLogger.logVisitorMessage(sessionId, text, window.location.hash || 'home', activeProduct);

    // Update Visitor Behaviour Engine & CRM
    const updatedBehaviour = visitorBehaviourEngine.recordUserQuery(text);
    setBehaviourState(updatedBehaviour);
    crmService.updateRecord({
      conversationHistory: newMessages,
      scores: updatedBehaviour.scores
    });

    // If Human Operator is connected, AI stays silent!
    if (crmRecord.isHumanOperatorActive) {
      return;
    }

    // Otherwise, generate AI assistant response
    const sessionContext: ConversationContextState = {
      activeProduct,
      viewedProducts,
      currentPage: window.location.hash || 'home',
      previousQuestion: messages.length > 0 ? messages[messages.length - 1].text : null,
      conversationHistory: newMessages,
      shoppingInterest: activeProduct ? activeProduct.category : null
    };

    setTimeout(async () => {
      let assistantReply: ConversationMessage | null = null;
      try {
        const productsForAi = (activeProduct ? [activeProduct, ...viewedProducts] : viewedProducts).slice(0, 8);
        const aiRes = await fetch('/api/assistant/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: window.location.pathname,
            activeProduct,
            products: productsForAi,
            messages: newMessages.slice(-10)
          })
        });
        const aiData = await aiRes.json().catch(() => null);
        if (aiRes.ok && aiData?.success && aiData.text) {
          assistantReply = {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: String(aiData.text),
            timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
            confidenceLevel: 'High',
            confidenceScore: 96,
            matchedProduct: activeProduct || undefined,
            actionButtons: [
              { label: 'Toptan Bilgi Al', type: 'quick_reply', payload: 'Toptan sipariş ve seri şartları hakkında bilgi almak istiyorum.' },
              { label: 'Canlı Desteğe Bağlan', type: 'quick_reply', payload: 'Canlı destek ekibinizle görüşmek istiyorum.' }
            ]
          };
        }
      } catch {
        // Local deterministic fallback below.
      }

      if (!assistantReply) {
        assistantReply = conversationEngine.generateResponse(text, sessionContext);
      }

      if (newMessages.filter(m => m.sender === 'visitor').length === 1 && !/^ben (elif|derya|selin|merve)\b/i.test(assistantReply.text)) {
        const advisorName = getSessionAdvisorName(sessionId);
        assistantReply = { ...assistantReply, text: `Tabii, ben ${advisorName}. ${assistantReply.text}` };
      }

      const confidence = Number(assistantReply.confidenceScore || 0);
      const looksLikeFailure = /\b(anlamadım|anlayamadım|bilmiyorum|yardımcı olamam|netleştireyim)\b/i.test(assistantReply.text);
      if (confidence < 60 || looksLikeFailure) {
        const nextStreak = lowConfidenceStreak + 1;
        setLowConfidenceStreak(nextStreak);
        if (nextStreak >= 2) {
          setIsHumanSupportModalOpen(true);
          assistantReply = {
            ...assistantReply,
            text: `Bu konuda sizi daha fazla bekletmeyeyim. Benim elimdeki bilgilerle net ve doğru bir cevap veremiyorsam, satış ekibimizden bir yetkiliyle görüştüreyim. İsterseniz iletişim bilgilerinizi bırakın; talebiniz doğrudan ekibe iletilsin.`,
            actionButtons: [
              { label: 'Yetkiliye Bağlan', type: 'live_support' },
              { label: 'Soruyu Bir Kez Daha Açıklayın', type: 'quick_reply', payload: text }
            ]
          };
        }
      } else {
        setLowConfidenceStreak(0);
      }

      const fullHistory = [...newMessages, assistantReply];
      setMessages(fullHistory);
      conversationLogger.logAssistantResponse(sessionId, assistantReply, undefined, undefined, window.location.pathname || 'home', activeProduct);
      crmService.updateRecord({ conversationHistory: fullHistory });
      if (!isOpen) setHasUnread(true);
    }, 120);
  }, [activeProduct, viewedProducts, messages, isOpen, crmRecord.isHumanOperatorActive, sessionId]);

  // Proactive greeting trigger: 20 seconds after landing if visitor hasn't opened chat
  useEffect(() => {
    if (proactiveTriggered) return;

    const timer = setTimeout(() => {
      if (!isOpen) {
        const text = conversationEngine.generateProactiveGreeting('time_20s', activeProduct);
        setProactiveBubbleText(text);
        setHasUnread(true);
        setProactiveTriggered(true);
      }
    }, 20000);

    return () => clearTimeout(timer);
  }, [isOpen, proactiveTriggered, activeProduct]);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => {
      const next = !prev;
      if (next) {
        setHasUnread(false);
        setProactiveBubbleText(null);
        checkAndShowBetaNotice();
      }
      return next;
    });
  }, [checkAndShowBetaNotice]);

  const openChat = useCallback(() => {
    setIsOpen(true);
    setHasUnread(false);
    setProactiveBubbleText(null);
    checkAndShowBetaNotice();
  }, [checkAndShowBetaNotice]);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openChatWithPrompt = useCallback((promptText: string) => {
    openChat();
    sendMessage(promptText);
  }, [openChat, sendMessage]);

  const dismissProactiveBubble = useCallback(() => {
    setProactiveBubbleText(null);
  }, []);

  const clearConversation = useCallback(() => {
    const resetList = [INITIAL_WELCOME_MSG];
    setMessages(resetList);
    crmService.updateRecord({ conversationHistory: resetList });
  }, []);

  const openHumanSupportModal = useCallback(() => {
    setIsHumanSupportModalOpen(true);
  }, []);

  const closeHumanSupportModal = useCallback(() => {
    setIsHumanSupportModalOpen(false);
  }, []);

  const submitHumanSupportSuccess = useCallback((fullName: string) => {
    const time = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const handoverConfirmationMsg: ConversationMessage = {
      id: `handover-${Date.now()}`,
      sender: 'assistant',
      text: `Teşekkürler Sayın **${fullName}**,\n\nCanlı müşteri temsilcimize talebiniz başarıyla iletildi. Müşteri temsilcimiz belirtmiş olduğunuz e-posta/telefon üzerinden en kısa sürede sizinle iletişime geçecektir.`,
      timestamp: time,
      actionButtons: [
        { label: 'Atölye İletişim & Konum', type: 'quick_reply', payload: 'Atölyeniz nerede, adres bilgisi alabilir miyim?' },
        { label: 'Canlı Destek Durumu', type: 'quick_reply', payload: 'Temsilci bekleme durumunu öğrenmek istiyorum.' }
      ]
    };
    setMessages(prev => [...prev, handoverConfirmationMsg]);
    crmService.updateRecord({
      conversationHistory: [...messages, handoverConfirmationMsg]
    });

    conversationLogger.requestLiveSupport(sessionId, {
      fullName,
      email: crmService.getActiveRecord().email || 'bilgi@iremcomfort.com',
      subject: 'Müşteri Canlı Destek Talebi'
    });
  }, [messages, sessionId]);

  return (
    <ConversationContext.Provider
      value={{
        isOpen,
        hasUnread,
        activeProduct,
        viewedProducts,
        messages,
        proactiveBubbleText,
        behaviourState,
        crmRecord,
        isHumanSupportModalOpen,
        sessionId,
        toggleChat,
        openChat,
        closeChat,
        openChatWithPrompt,
        setActiveProduct,
        recordProductView,
        sendMessage,
        dismissProactiveBubble,
        clearConversation,
        openHumanSupportModal,
        closeHumanSupportModal,
        submitHumanSupportSuccess
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = (): ConversationContextType => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
};
