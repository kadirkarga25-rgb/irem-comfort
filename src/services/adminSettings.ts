/**
 * IC CMS PRO - Volume 2D: Admin Settings Service
 * Configurable parameters for AI, Human Support, CRM, Behaviour Engine, Working Hours & Texts.
 * Ensures zero hardcoded configuration logic.
 */

export interface AdminSettingsConfig {
  enableHumanSupport: boolean;
  enableCRM: boolean;
  enableBehaviourAnalysis: boolean;
  enableLiveMonitor: boolean;
  enableNewsletter: boolean;
  enableVisitorMemory: boolean;
  supportWorkingHours: string;
  automaticReplyMessage: string;
  newsletterText: string;
  humanTransferMessage: string;
}

const DEFAULT_SETTINGS: AdminSettingsConfig = {
  enableHumanSupport: true,
  enableCRM: true,
  enableBehaviourAnalysis: true,
  enableLiveMonitor: true,
  enableNewsletter: true,
  enableVisitorMemory: true,
  supportWorkingHours: 'Hafta içi 08:30 - 18:30 / Cumartesi 09:00 - 14:00',
  automaticReplyMessage: 'Talebiniz kaydedilmiştir. Müşteri temsilcimiz çalışma saatleri içerisinde sizinle iletişime geçecektir.',
  newsletterText: 'İsterseniz yeni koleksiyonlarımız, kampanyalarımız ve duyurularımız hakkında da e-posta alabilirsiniz.',
  humanTransferMessage: 'Konu hakkında uzman müşteri temsilcimizle görüşmek ister misiniz? Size hemen canlı destek sağlayabiliriz.'
};

export class AdminSettingsService {
  private settings: AdminSettingsConfig;

  constructor() {
    this.settings = { ...DEFAULT_SETTINGS };
  }

  public getSettings(): AdminSettingsConfig {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<AdminSettingsConfig>): AdminSettingsConfig {
    this.settings = { ...this.settings, ...newSettings };
    return { ...this.settings };
  }

  public resetToDefaults(): AdminSettingsConfig {
    this.settings = { ...DEFAULT_SETTINGS };
    return { ...this.settings };
  }
}

export const adminSettingsService = new AdminSettingsService();
