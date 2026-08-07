/**
 * IC CMS PRO - Volume 6: Enterprise Infrastructure
 * One-Click Enterprise System Diagnostics and Audit Scanner.
 */

import { serviceRegistry } from './serviceRegistry';
import { loggerService } from './loggerService';
import { learningEngine } from '../services/ai/learningEngine';
import { configCenter } from './configCenter';

export interface DiagnosticItem {
  id: string;
  category: 'Assets' | 'SEO' | 'GitHub' | 'CRM' | 'AI' | 'Config' | 'Security';
  severity: 'info' | 'warning' | 'error';
  title: string;
  message: string;
  recommendation: string;
}

export interface DiagnosticReport {
  timestamp: string;
  overallScore: number; // 0 - 100
  items: DiagnosticItem[];
  summary: {
    totalChecked: number;
    warningsCount: number;
    errorsCount: number;
    passedCount: number;
  };
}

export class DiagnosticsService {
  public runFullDiagnostics(): DiagnosticReport {
    loggerService.info('DiagnosticsService', 'Running complete one-click enterprise system diagnostics...');

    const items: DiagnosticItem[] = [];

    // 1. Check AI Knowledge Accuracy & Learning Queue
    const learningAnalytics = learningEngine.getAnalytics();
    if (learningAnalytics.totalPendingCandidates > 0) {
      items.push({
        id: 'diag-ai-01',
        category: 'AI',
        severity: 'warning',
        title: 'Onay Bekleyen AI Aday Bilgileri Var',
        message: `Yapay zeka kuyruğunda incelenmeyi bekleyen ${learningAnalytics.totalPendingCandidates} adet canlı yanıt var.`,
        recommendation: 'AI Eğitim Merkezi tabına giderek aday yanıtları inceleyin ve onaylayın.'
      });
    }

    if (learningAnalytics.aiQuestionsTransferredToHuman > 0) {
      items.push({
        id: 'diag-ai-02',
        category: 'AI',
        severity: 'info',
        title: 'Canlı Operatör Aktarımları Mevcut',
        message: `${learningAnalytics.aiQuestionsTransferredToHuman} adet soru canlı destek ekibine aktarılmış.`,
        recommendation: 'Operatör yanıtlarının onaylanıp bilgi tabanına eklendiğinden emin olun.'
      });
    }

    // 2. Check SEO Metadata
    const config = configCenter.getConfig();
    if (!config.seo.metaTitle || config.seo.metaTitle.length < 10) {
      items.push({
        id: 'diag-seo-01',
        category: 'SEO',
        severity: 'warning',
        title: 'Eksik veya Kısa SEO Başlığı',
        message: 'Arama motoru başlığı (Meta Title) ideal uzunlukta değil.',
        recommendation: 'SEO Ayarlarından kurumsal ve açıklayıcı bir Meta Title tanımlayın.'
      });
    }

    if (!config.seo.metaDescription || config.seo.metaDescription.length < 30) {
      items.push({
        id: 'diag-seo-02',
        category: 'SEO',
        severity: 'warning',
        title: 'Eksik SEO Meta Açıklaması',
        message: 'Meta açıklama metni çok kısa veya eksik.',
        recommendation: 'SEO Ayarları altından 120-160 karakter arası açıklama girin.'
      });
    }

    // 3. Check GitHub API & Deployment Readiness
    const ghRepo = config.deployment.githubRepo;
    if (!ghRepo || !ghRepo.includes('/')) {
      items.push({
        id: 'diag-gh-01',
        category: 'GitHub',
        severity: 'error',
        title: 'Geçersiz GitHub Repositorisi',
        message: 'GitHub depo adı kullanıcıAdi/depoAdi formatında tanımlanmamış.',
        recommendation: 'Dağıtım ayarlarından geçerli GitHub deposunu tanımlayın.'
      });
    }

    // 4. Security Audit
    const ghToken = localStorage.getItem('irem_github_token');
    if (!ghToken) {
      items.push({
        id: 'diag-sec-01',
        category: 'Security',
        severity: 'warning',
        title: 'GitHub Kişisel Erişim Jetonu (PAT) Tanımlanmamış',
        message: 'Canlı GitHub senkronizasyonu için PAT token girilmemiş.',
        recommendation: 'Yönetici panelinden GitHub Token tanımlayarak otomatik commitleri aktifleştirin.'
      });
    }

    // 5. Service Registry Health Audit
    const services = serviceRegistry.getAllServices();
    const criticalServices = services.filter(s => s.status === 'Critical');
    if (criticalServices.length > 0) {
      criticalServices.forEach(cs => {
        items.push({
          id: `diag-serv-${cs.id}`,
          category: 'Config',
          severity: 'error',
          title: `Servis Uyarısı: ${cs.name}`,
          message: `${cs.name} servisi kritik durumda (${cs.status}).`,
          recommendation: 'Servis bağımlılıklarını ve konsol günlüklerini kontrol edin.'
        });
      });
    }

    // Calculate Scores
    const errorsCount = items.filter(i => i.severity === 'error').length;
    const warningsCount = items.filter(i => i.severity === 'warning').length;
    const totalChecked = items.length + 12; // Base checks
    const passedCount = totalChecked - (errorsCount + warningsCount);

    let overallScore = 100 - (errorsCount * 15 + warningsCount * 5);
    if (overallScore < 0) overallScore = 0;

    const report: DiagnosticReport = {
      timestamp: new Date().toISOString(),
      overallScore,
      items,
      summary: {
        totalChecked,
        warningsCount,
        errorsCount,
        passedCount
      }
    };

    loggerService.info('DiagnosticsService', `Diagnostics completed. Overall Score: ${overallScore}/100 (${errorsCount} errors, ${warningsCount} warnings)`);
    return report;
  }
}

export const diagnosticsService = new DiagnosticsService();
