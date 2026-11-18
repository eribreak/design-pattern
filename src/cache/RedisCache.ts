// Simple in-memory cache for demonstration (replace with Redis in production)
interface CacheItem<T> {
  value: T;
  expiresAt: number;
}

export class RedisCache {
  private static instance: RedisCache | null = null;
  private cache: Map<string, CacheItem<unknown>> = new Map();

  private constructor() {}

  static getInstance(): RedisCache {
    if (!RedisCache.instance) {
      RedisCache.instance = new RedisCache();
    }
    return RedisCache.instance;
  }

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds: number = 60): Promise<void> {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiresAt });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async flushAll(): Promise<void> {
    this.cache.clear();
  }
}

// Singleton export
export const redis = RedisCache.getInstance();