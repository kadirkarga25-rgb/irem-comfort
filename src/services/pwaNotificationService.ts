/**
 * PWA & Push Notification Service for İrem Comfort Admin
 * Handles Service Worker registration, Web Notifications API, Web Audio API chime sounds,
 * and automatic background alerts for live support requests & leads.
 */

import { eventBus } from '../core/eventBus';
import { loggerService } from '../core/loggerService';

export interface PwaNotificationOptions {
  body?: string;
  tag?: string;
  url?: string;
  vibrate?: number[];
  requireInteraction?: boolean;
}

class PwaNotificationService {
  private swRegistration: ServiceWorkerRegistration | null = null;
  private permissionState: NotificationPermission = 'default';
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    // 1. Check Notification permission
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permissionState = Notification.permission;
    }

    // 2. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        this.swRegistration = reg;
        loggerService.info('PwaNotificationService', 'Service Worker registered successfully');

        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                loggerService.info('PwaNotificationService', 'New PWA version available');
              }
            });
          }
        });
      } catch (err) {
        loggerService.error('PwaNotificationService', `Service worker registration failed: ${err}`);
      }
    }

    // 3. Listen to EventBus for automatic background alerts
    this.attachEventBusListeners();
  }

  private attachEventBusListeners() {
    // Event: Live Support Requested
    eventBus.subscribe('ConversationTransferred', (event) => {
      const data = event.payload;
      const visitorName = data?.details?.fullName || 'Anonim Ziyaretçi';
      const subject = data?.details?.subject || 'Canlı Müşteri Desteği Bekleniyor';
      this.sendNotification(
        ` CANLI DESTEK TALEBİ!`,
        `Müşteri: ${visitorName}\nKonu: ${subject}`,
        {
          tag: 'live-support-alert',
          url: '/?admin=true&tab=live_monitor',
          requireInteraction: true
        }
      );
    });

    // Event: New Visitor Started Conversation
    eventBus.subscribe('VisitorStartedConversation', (event) => {
      this.sendNotification(
        ` Yeni Ziyaretçi Sohbeti`,
        `Sitede yeni bir müşteri AI asistan ile sohbet başlattı.`,
        {
          tag: 'visitor-chat',
          url: '/?admin=true&tab=conv_logs'
        }
      );
    });

    // Event: New Lead or CRM Item
    eventBus.subscribe('CRMCreated', (event) => {
      this.sendNotification(
        ` Yeni Müşteri Talebi`,
        `Yeni bir toptan/sipariş talebi düştü. İncelemek için tıklayın.`,
        {
          tag: 'new-lead-alert',
          url: '/?admin=true&tab=crm'
        }
      );
    });
  }

  /**
   * Request Notification permission from user
   */
  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      alert('Bu tarayıcı web bildirimlerini desteklemiyor.');
      return false;
    }

    try {
      const perm = await Notification.requestPermission();
      this.permissionState = perm;
      if (perm === 'granted') {
        loggerService.info('PwaNotificationService', 'Notification permission granted');
        this.playChimeSound();
        this.sendNotification(
          ' Bildirimler Aktif!',
          'Canlı destek ve yeni müşteri talepleri anında telefonunuza ve bilgisayarınıza ulaştırılacaktır.',
          { tag: 'pwa-activated' }
        );
        return true;
      } else {
        loggerService.warning('PwaNotificationService', 'Notification permission denied or dismissed');
        return false;
      }
    } catch (e) {
      loggerService.error('PwaNotificationService', `Permission request error: ${e}`);
      return false;
    }
  }

  /**
   * Get current notification permission state
   */
  public getPermissionState(): NotificationPermission {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'denied';
    return Notification.permission;
  }

  /**
   * Play clean Web Audio bell sound for immediate attention
   */
  public playChimeSound() {
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }

      if (this.audioCtx) {
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }

        const now = this.audioCtx.currentTime;

        // Note 1 (High bell)
        const osc1 = this.audioCtx.createOscillator();
        const gain1 = this.audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, now); // A5
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc1.connect(gain1);
        gain1.connect(this.audioCtx.destination);
        osc1.start(now);
        osc1.stop(now + 0.6);

        // Note 2 (Chime resolution)
        const osc2 = this.audioCtx.createOscillator();
        const gain2 = this.audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1320, now + 0.15); // E6
        gain2.gain.setValueAtTime(0.4, now + 0.15);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
        osc2.connect(gain2);
        gain2.connect(this.audioCtx.destination);
        osc2.start(now + 0.15);
        osc2.stop(now + 0.9);
      }
    } catch (err) {
      console.warn('Audio chime playback omitted:', err);
    }
  }

  /**
   * Send a Notification to device (Desktop & Mobile PWA)
   */
  public async sendNotification(title: string, bodyText?: string, opts?: PwaNotificationOptions) {
    const messageBody = bodyText || opts?.body || 'Yeni güncelleme mevcut.';

    // 1. Always play chime sound and vibrate
    this.playChimeSound();

    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(opts?.vibrate || [200, 100, 200, 100, 400]);
      } catch (e) {}
    }

    // 2. Check if notifications are granted
    if (this.getPermissionState() !== 'granted') {
      loggerService.warning('PwaNotificationService', 'Cannot show notification: Permission not granted');
      return;
    }

    const options: any = {
      body: messageBody,
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      vibrate: opts?.vibrate || [200, 100, 200, 100, 400],
      tag: opts?.tag || 'irem-alert',
      renotify: true,
      requireInteraction: opts?.requireInteraction ?? true,
      data: { url: opts?.url || '/?admin=true' }
    };

    // 3. Display via Service Worker if available for background delivery
    try {
      if (this.swRegistration && 'showNotification' in this.swRegistration) {
        await this.swRegistration.showNotification(title, options);
        loggerService.info('PwaNotificationService', `Notification sent via SW: ${title}`);
        return;
      }
    } catch (err) {
      loggerService.warning('PwaNotificationService', `SW Notification failed, falling back to window Notification: ${err}`);
    }

    // 4. Fallback to window Notification API
    try {
      if ('Notification' in window) {
        const notif = new Notification(title, options);
        notif.onclick = () => {
          window.focus();
          if (opts?.url) {
            window.location.href = opts.url;
          }
          notif.close();
        };
      }
    } catch (e) {
      loggerService.error('PwaNotificationService', `Window notification failed: ${e}`);
    }
  }

  /**
   * Test background notification for admin validation
   */
  public async testNotification() {
    if (this.getPermissionState() !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return;
    }

    this.sendNotification(
      ' Test Arka Plan Bildirimi',
      'İrem Comfort Admin PWA mobil bildirimleri ve sesli uyarılar sorunsuz çalışıyor!',
      {
        tag: 'test-notification',
        url: '/?admin=true'
      }
    );
  }
}

export const pwaNotificationService = new PwaNotificationService();
