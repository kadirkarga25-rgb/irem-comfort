/**
 * IC CMS PRO - Volume 6: Enterprise Infrastructure
 * Central Configuration Manager - Single Source of Truth for system configs.
 */

import { loggerService } from './loggerService';
import { eventBus } from './eventBus';

export interface SystemCoreConfig {
  ai: {
    enabled: boolean;
    minimumConfidence: number;
    automaticReindex: boolean;
    localOnly: boolean;
  };
  cms: {
    siteName: string;
    language: string;
    timeZone: string;
  };
  crm: {
    liveSupportEnabled: boolean;
    leadAutoCapture: boolean;
    visitorTracking: boolean;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    autoSitemap: boolean;
  };
  security: {
    rateLimitingEnabled: boolean;
    maxRequestsPerMin: number;
    forceHttps: boolean;
  };
  deployment: {
    githubRepo: string;
    githubBranch: string;
    autoDeployOnUpdate: boolean;
  };
}

const CONFIG_CENTER_KEY = 'ic_cms_config_center_v6';

export class ConfigCenter {
  private config: SystemCoreConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): SystemCoreConfig {
    try {
      const saved = localStorage.getItem(CONFIG_CENTER_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }

    return {
      ai: {
        enabled: true,
        minimumConfidence: 0.40,
        automaticReindex: true,
        localOnly: true
      },
      cms: {
        siteName: 'İrem Comfort - %100 Hakiki Deri Terlik & Sabo',
        language: 'tr-TR',
        timeZone: 'Europe/Istanbul'
      },
      crm: {
        liveSupportEnabled: true,
        leadAutoCapture: true,
        visitorTracking: true
      },
      seo: {
        metaTitle: 'İrem Comfort - Kadın Hakiki Deri Terlik, Sabo ve Sandalet',
        metaDescription: 'Manisa atölyelerimizde el işçiliğiyle ürettiğimiz %100 hakiki deri ortopedik bayan terlik ve sabo koleksiyonu.',
        autoSitemap: true
      },
      security: {
        rateLimitingEnabled: true,
        maxRequestsPerMin: 120,
        forceHttps: true
      },
      deployment: {
        githubRepo: localStorage.getItem('irem_github_repo') || 'kadirkarga25-rgb/irem-comfort',
        githubBranch: localStorage.getItem('irem_github_branch') || 'main',
        autoDeployOnUpdate: false
      }
    };
  }

  public getConfig(): SystemCoreConfig {
    return JSON.parse(JSON.stringify(this.config));
  }

  public updateConfig(updates: Partial<SystemCoreConfig>): SystemCoreConfig {
    this.config = {
      ...this.config,
      ...updates,
      ai: { ...this.config.ai, ...(updates.ai || {}) },
      cms: { ...this.config.cms, ...(updates.cms || {}) },
      crm: { ...this.config.crm, ...(updates.crm || {}) },
      seo: { ...this.config.seo, ...(updates.seo || {}) },
      security: { ...this.config.security, ...(updates.security || {}) },
      deployment: { ...this.config.deployment, ...(updates.deployment || {}) }
    };

    try {
      localStorage.setItem(CONFIG_CENTER_KEY, JSON.stringify(this.config));
    } catch {
      // Memory fallback
    }

    loggerService.info('ConfigCenter', 'System configuration updated successfully.');
    eventBus.emit('SettingsUpdated', this.config, 'ConfigCenter');

    return this.getConfig();
  }
}

export const configCenter = new ConfigCenter();
