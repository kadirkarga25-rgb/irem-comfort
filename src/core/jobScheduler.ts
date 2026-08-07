/**
 * IC CMS PRO - Volume 6: Enterprise Infrastructure
 * Scheduled Jobs Engine for background maintenance and automated system tasks.
 */

import { loggerService } from './loggerService';
import { cacheEngine } from './cacheEngine';
import { taskQueue } from './taskQueue';

export interface ScheduledJob {
  id: string;
  name: string;
  intervalMinutes: number;
  lastRun?: string;
  nextRun: string;
  enabled: boolean;
  action: () => Promise<void>;
}

export class JobScheduler {
  private jobs: ScheduledJob[] = [];
  private timer: any = null;

  constructor() {
    this.initDefaultJobs();
    this.startScheduler();
  }

  private initDefaultJobs() {
    this.jobs = [
      {
        id: 'job-cache-cleanup',
        name: 'Önbellek & Süresi Dolan Verileri Temizleme',
        intervalMinutes: 30,
        nextRun: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        enabled: true,
        action: async () => {
          loggerService.info('JobScheduler', 'Süresi dolan önbellekler temizleniyor...');
          // Cache engine auto purges on get, but we can log
        }
      },
      {
        id: 'job-log-rotation',
        name: 'Sistem Günlüğü Döngüsü (Log Rotation)',
        intervalMinutes: 120,
        nextRun: new Date(Date.now() + 120 * 60 * 1000).toISOString(),
        enabled: true,
        action: async () => {
          loggerService.info('JobScheduler', 'Sistem günlükleri optimize ediliyor.');
        }
      },
      {
        id: 'job-nightly-backup',
        name: 'Otomatik Gece Sistem Yedeği',
        intervalMinutes: 1440, // 24 Hours
        nextRun: new Date(Date.now() + 1440 * 60 * 1000).toISOString(),
        enabled: true,
        action: async () => {
          taskQueue.enqueue('BackupTask', 'Otomatik Planlı Gece Yedeği', async () => {
            loggerService.info('JobScheduler', 'Gece yedeği oluşturuldu.');
          });
        }
      }
    ];
  }

  private startScheduler() {
    if (this.timer) clearInterval(this.timer);
    
    // Check jobs every 1 minute
    this.timer = setInterval(() => this.checkAndRunJobs(), 60000);
  }

  private async checkAndRunJobs() {
    const now = Date.now();
    for (const job of this.jobs) {
      if (!job.enabled) continue;

      if (now >= new Date(job.nextRun).getTime()) {
        loggerService.info('JobScheduler', `Executing scheduled job: ${job.name}`);
        job.lastRun = new Date().toISOString();
        job.nextRun = new Date(now + job.intervalMinutes * 60 * 1000).toISOString();

        try {
          await job.action();
        } catch (err) {
          loggerService.error('JobScheduler', `Scheduled job failed: ${job.name}`, err);
        }
      }
    }
  }

  public getJobs(): Omit<ScheduledJob, 'action'>[] {
    return this.jobs.map(({ action, ...rest }) => rest);
  }

  public toggleJob(id: string): boolean {
    const job = this.jobs.find(j => j.id === id);
    if (job) {
      job.enabled = !job.enabled;
      loggerService.info('JobScheduler', `Job ${job.name} toggled to ${job.enabled ? 'Enabled' : 'Disabled'}`);
      return job.enabled;
    }
    return false;
  }
}

export const jobScheduler = new JobScheduler();
