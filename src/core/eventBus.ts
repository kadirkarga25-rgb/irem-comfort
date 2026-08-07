/**
 * IC CMS PRO - Volume 6: Enterprise Infrastructure
 * Centralized Event Bus for decoupled system communication and event-driven architecture.
 */

export type EventType =
  | 'ProductCreated'
  | 'ProductUpdated'
  | 'ProductDeleted'
  | 'ImageUploaded'
  | 'ImageDeleted'
  | 'KnowledgeApproved'
  | 'KnowledgeRejected'
  | 'VisitorStartedConversation'
  | 'ConversationTransferred'
  | 'DeploymentStarted'
  | 'DeploymentFinished'
  | 'BackupCreated'
  | 'SettingsUpdated'
  | 'NewsletterSubscribed'
  | 'CRMCreated';

export interface SystemEvent<T = any> {
  id: string;
  type: EventType;
  payload: T;
  timestamp: string;
  source: string;
}

export type EventListener<T = any> = (event: SystemEvent<T>) => void | Promise<void>;

export class EventBus {
  private listeners: Map<EventType, Set<EventListener>> = new Map();
  private eventHistory: SystemEvent[] = [];
  private maxHistorySize = 100;

  public subscribe<T = any>(type: EventType, listener: EventListener<T>): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener as EventListener);

    // Return unsubscribe function
    return () => {
      const set = this.listeners.get(type);
      if (set) {
        set.delete(listener as EventListener);
      }
    };
  }

  public async emit<T = any>(type: EventType, payload: T, source = 'system'): Promise<SystemEvent<T>> {
    const event: SystemEvent<T> = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      payload,
      timestamp: new Date().toISOString(),
      source
    };

    // Keep history
    this.eventHistory.unshift(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.pop();
    }

    // Notify listeners
    const handlers = this.listeners.get(type);
    if (handlers) {
      for (const listener of Array.from(handlers)) {
        try {
          await listener(event);
        } catch (error) {
          console.error(`[EventBus] Error handling event ${type}:`, error);
        }
      }
    }

    return event;
  }

  public getHistory(): SystemEvent[] {
    return [...this.eventHistory];
  }

  public clearHistory(): void {
    this.eventHistory = [];
  }
}

export const eventBus = new EventBus();
