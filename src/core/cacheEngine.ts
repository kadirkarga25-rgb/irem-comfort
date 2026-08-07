/**
 * IC CMS PRO - Volume 6: Enterprise Infrastructure
 * Unified Cache Engine supporting TTL, tag-based invalidation, and memory stats.
 */

import { loggerService } from './loggerService';

export interface CacheEntry<T = any> {
  key: string;
  data: T;
  tags: string[];
  expiresAt: number | null; // null = persistent until invalidated
  createdAt: string;
  hits: number;
}

export class CacheEngine {
  private cache: Map<string, CacheEntry> = new Map();

  public set<T>(key: string, data: T, tags: string[] = [], ttlMs: number | null = null): void {
    const entry: CacheEntry<T> = {
      key,
      data,
      tags,
      expiresAt: ttlMs ? Date.now() + ttlMs : null,
      createdAt: new Date().toISOString(),
      hits: 0
    };

    this.cache.set(key, entry);
    loggerService.info('CacheEngine', `Cache set for key: ${key} (Tags: ${tags.join(', ')})`);
  }

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check expiration
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      loggerService.info('CacheEngine', `Cache expired for key: ${key}`);
      return null;
    }

    entry.hits += 1;
    return entry.data as T;
  }

  public invalidateKey(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      loggerService.info('CacheEngine', `Cache invalidated key: ${key}`);
    }
    return deleted;
  }

  public invalidateTag(tag: string): number {
    let count = 0;
    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (entry.tags.includes(tag)) {
        this.cache.delete(key);
        count++;
      }
    }
    if (count > 0) {
      loggerService.info('CacheEngine', `Cache invalidated tag '${tag}' (${count} items deleted)`);
    }
    return count;
  }

  public clearAll(): void {
    this.cache.clear();
    loggerService.info('CacheEngine', 'All cache cleared.');
  }

  public getStats() {
    const totalEntries = this.cache.size;
    let totalHits = 0;
    const tagsSet = new Set<string>();

    for (const entry of Array.from(this.cache.values())) {
      totalHits += entry.hits;
      entry.tags.forEach(t => tagsSet.add(t));
    }

    return {
      totalEntries,
      totalHits,
      activeTags: Array.from(tagsSet)
    };
  }
}

export const cacheEngine = new CacheEngine();
