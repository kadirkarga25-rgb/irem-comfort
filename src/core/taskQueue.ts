/**
 * IC CMS PRO - Volume 6: Enterprise Infrastructure
 * Background Task Queue for asynchronous, ordered, resilient processing with auto-retries.
 */

import { loggerService } from './loggerService';
import { eventBus } from './eventBus';

export type TaskType = 
  | 'GitHubUpload' 
  | 'ImageProcessing' 
  | 'KnowledgeReindex' 
  | 'SEORefresh' 
  | 'BackupTask' 
  | 'AnalyticsCleanup' 
  | 'DeploymentTask'
  | 'NotificationTask';

export interface TaskItem {
  id: string;
  type: TaskType;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  completedAt?: string;
  error?: string;
  handler: () => Promise<void>;
}

export class TaskQueue {
  private queue: TaskItem[] = [];
  private isProcessing = false;

  public enqueue(type: TaskType, title: string, handler: () => Promise<void>, maxAttempts = 3): TaskItem {
    const task: TaskItem = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      title,
      status: 'pending',
      attempts: 0,
      maxAttempts,
      createdAt: new Date().toISOString(),
      handler
    };

    this.queue.push(task);
    loggerService.info('TaskQueue', `Enqueued task: ${task.title} (${task.id})`);
    
    // Auto trigger runner
    this.processQueue();

    return task;
  }

  private async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (true) {
      const pendingTask = this.queue.find(t => t.status === 'pending');
      if (!pendingTask) break;

      pendingTask.status = 'processing';
      pendingTask.attempts += 1;
      loggerService.info('TaskQueue', `Processing task: ${pendingTask.title} (Attempt ${pendingTask.attempts}/${pendingTask.maxAttempts})`);

      try {
        await pendingTask.handler();
        pendingTask.status = 'completed';
        pendingTask.completedAt = new Date().toISOString();
        loggerService.info('TaskQueue', `Completed task: ${pendingTask.title}`);
        
        eventBus.emit('DeploymentFinished', { taskId: pendingTask.id, title: pendingTask.title }, 'TaskQueue');
      } catch (err: any) {
        const errMsg = err?.message || 'Bilinmeyen görev hatası';
        if (pendingTask.attempts < pendingTask.maxAttempts) {
          pendingTask.status = 'pending';
          loggerService.warning('TaskQueue', `Task failed, retrying: ${pendingTask.title} (${errMsg})`);
        } else {
          pendingTask.status = 'failed';
          pendingTask.error = errMsg;
          loggerService.error('TaskQueue', `Task failed permanently: ${pendingTask.title} - ${errMsg}`);
        }
      }
    }

    this.isProcessing = false;
  }

  public getTasks(): Omit<TaskItem, 'handler'>[] {
    return this.queue.map(({ handler, ...rest }) => rest);
  }

  public clearCompleted() {
    this.queue = this.queue.filter(t => t.status !== 'completed');
  }
}

export const taskQueue = new TaskQueue();
