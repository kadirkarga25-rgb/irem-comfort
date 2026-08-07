/**
 * IC CMS PRO - Volume 6: Enterprise Infrastructure
 * Central Service Registry for micro-service-like decoupling and health tracking.
 */

import { loggerService } from './loggerService';

export type ServiceHealthStatus = 'Healthy' | 'Warning' | 'Critical' | 'Offline';

export interface ServiceDescriptor {
  id: string;
  name: string;
  version: string;
  description: string;
  status: ServiceHealthStatus;
  lastPing: string;
  metadata?: Record<string, any>;
}

export class ServiceRegistry {
  private services: Map<string, ServiceDescriptor> = new Map();

  constructor() {
    this.initDefaultServices();
  }

  private initDefaultServices() {
    const defaults: ServiceDescriptor[] = [
      { id: 'knowledgeEngine', name: 'Knowledge Engine', version: '5.0.0', description: 'Vektör benzeri yerel bilgi arama ve indeksleme motoru', status: 'Healthy', lastPing: new Date().toISOString() },
      { id: 'conversationEngine', name: 'Conversation Engine', version: '5.0.0', description: 'Ziyaretçi ve AI diyalog orkestratörü', status: 'Healthy', lastPing: new Date().toISOString() },
      { id: 'learningEngine', name: 'Learning Engine', version: '5.0.0', description: 'Yönetici onaylı bilgi öğrenme ve sürüm takip merkezi', status: 'Healthy', lastPing: new Date().toISOString() },
      { id: 'crmService', name: 'CRM & Lead Service', version: '4.0.0', description: 'Ziyaretçi davranışı, canlı destek ve lead takibi', status: 'Healthy', lastPing: new Date().toISOString() },
      { id: 'analyticsService', name: 'Analytics & Traffic Engine', version: '4.0.0', description: 'Sistem metrikleri, dönüşüm oranları ve performans', status: 'Healthy', lastPing: new Date().toISOString() },
      { id: 'deploymentService', name: 'GitHub & CI/CD Deployment', version: '4.0.0', description: 'GitHub API ve Cloud Run canlı dağıtım hattı', status: 'Healthy', lastPing: new Date().toISOString() },
      { id: 'mediaService', name: 'Media & Asset Manager', version: '4.0.0', description: 'Görsel işleme, galeri ve önbellek havuzu', status: 'Healthy', lastPing: new Date().toISOString() },
      { id: 'backupService', name: 'System Backup & Restore', version: '4.0.0', description: 'Yerel ve bulut sistem yedekleme servisi', status: 'Healthy', lastPing: new Date().toISOString() },
      { id: 'securityService', name: 'Security & Auth Guard', version: '4.0.0', description: 'Erişim denetimi, rate limiting ve gizli anahtar koruması', status: 'Healthy', lastPing: new Date().toISOString() },
      { id: 'seoEngine', name: 'SEO & Meta Optimizer', version: '4.0.0', description: 'Arama motoru optimizasyonu ve sitemap jeneratörü', status: 'Healthy', lastPing: new Date().toISOString() },
      { id: 'notificationService', name: 'Notification Service', version: '4.0.0', description: 'Sistem uyarıları ve yönetici bildirimleri', status: 'Healthy', lastPing: new Date().toISOString() },
      { id: 'configCenter', name: 'Configuration Center', version: '6.0.0', description: 'Merkezi konfigürasyon ve parametre anahtarı', status: 'Healthy', lastPing: new Date().toISOString() }
    ];

    defaults.forEach(s => this.registerService(s));
  }

  public registerService(descriptor: ServiceDescriptor) {
    this.services.set(descriptor.id, descriptor);
    loggerService.info('ServiceRegistry', `Service registered: ${descriptor.name} (${descriptor.id})`);
  }

  public updateServiceStatus(id: string, status: ServiceHealthStatus, metadata?: Record<string, any>) {
    const existing = this.services.get(id);
    if (existing) {
      existing.status = status;
      existing.lastPing = new Date().toISOString();
      if (metadata) {
        existing.metadata = { ...existing.metadata, ...metadata };
      }
      this.services.set(id, existing);
    }
  }

  public getService(id: string): ServiceDescriptor | undefined {
    return this.services.get(id);
  }

  public getAllServices(): ServiceDescriptor[] {
    return Array.from(this.services.values());
  }

  public getOverallHealth(): ServiceHealthStatus {
    const list = this.getAllServices();
    if (list.some(s => s.status === 'Critical')) return 'Critical';
    if (list.some(s => s.status === 'Warning')) return 'Warning';
    if (list.some(s => s.status === 'Offline')) return 'Warning';
    return 'Healthy';
  }
}

export const serviceRegistry = new ServiceRegistry();
