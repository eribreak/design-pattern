import { BaseUserDecorator } from "./BaseDecorator";
import { IUser } from "./IUser";
import { User } from "@prisma/client";
import { logger } from "../../shared/logger";
import { redis } from "../../cache/RedisCache";

// Logging Decorator
export class LoggingDecorator extends BaseUserDecorator {
  async findById(id: number): Promise<User | null> {
    logger.info("LoggingDecorator: findById", { id });
    const result = await this.decoratedUser.findById(id);
    logger.info("LoggingDecorator: findById result", { found: !!result });
    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    logger.info("LoggingDecorator: findByEmail", { email });
    const result = await this.decoratedUser.findByEmail(email);
    logger.info("LoggingDecorator: findByEmail result", { found: !!result });
    return result;
  }

  async findAll(): Promise<User[]> {
    logger.info("LoggingDecorator: findAll");
    const result = await this.decoratedUser.findAll();
    logger.info("LoggingDecorator: findAll result", { count: result.length });
    return result;
  }

  async create(data: { email: string; name: string; age?: number }): Promise<User> {
    logger.info("LoggingDecorator: create", { email: data.email });
    const result = await this.decoratedUser.create(data);
    logger.info("LoggingDecorator: create result", { id: result.id });
    return result;
  }

  async update(id: number, data: Partial<{ name: string; age: number }>): Promise<User> {
    logger.info("LoggingDecorator: update", { id, data });
    const result = await this.decoratedUser.update(id, data);
    logger.info("LoggingDecorator: update result", { id: result.id });
    return result;
  }

  async delete(id: number): Promise<void> {
    logger.info("LoggingDecorator: delete", { id });
    await this.decoratedUser.delete(id);
    logger.info("LoggingDecorator: delete done");
  }
}

// Caching Decorator (Redis-based)
export class CachingDecorator extends BaseUserDecorator {
  async findById(id: number): Promise<User | null> {
    const cacheKey = `user:${id}`;
    const cached = await redis.get<User>(cacheKey);
    if (cached) {
      logger.info("CachingDecorator: cache hit", { userId: id });
      return cached;
    }
    const result = await this.decoratedUser.findById(id);
    if (result) {
      await redis.set(cacheKey, result, 60);
    }
    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    const cacheKey = `user:email:${email}`;
    const cached = await redis.get<User>(cacheKey);
    if (cached) {
      logger.info("CachingDecorator: cache hit", { email });
      return cached;
    }
    const result = await this.decoratedUser.findByEmail(email);
    if (result) {
      await redis.set(cacheKey, result, 60);
    }
    return result;
  }

  async findAll(): Promise<User[]> {
    const cacheKey = "users:all";
    const cached = await redis.get<User[]>(cacheKey);
    if (cached) {
      logger.info("CachingDecorator: cache hit for findAll");
      return cached;
    }
    const result = await this.decoratedUser.findAll();
    await redis.set(cacheKey, result, 30);
    return result;
  }

  async create(data: { email: string; name: string; age?: number }): Promise<User> {
    const result = await this.decoratedUser.create(data);
    await redis.del(`user:email:${data.email}`);
    await redis.del("users:all");
    return result;
  }

  async update(id: number, data: Partial<{ name: string; age: number }>): Promise<User> {
    const result = await this.decoratedUser.update(id, data);
    await redis.del(`user:${id}`);
    await redis.del("users:all");
    return result;
  }

  async delete(id: number): Promise<void> {
    const user = await this.decoratedUser.findById(id);
    if (user) {
      await redis.del(`user:${id}`);
      await redis.del(`user:email:${user.email}`);
      await redis.del("users:all");
    }
    await this.decoratedUser.delete(id);
  }
}

// Metrics Decorator
export class MetricsDecorator extends BaseUserDecorator {
  private metrics: Map<string, number> = new Map();

  private increment(method: string): void {
    const count = this.metrics.get(method) || 0;
    this.metrics.set(method, count + 1);
  }

  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  async findById(id: number): Promise<User | null> {
    this.increment("findById");
    return this.decoratedUser.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    this.increment("findByEmail");
    return this.decoratedUser.findByEmail(email);
  }

  async findAll(): Promise<User[]> {
    this.increment("findAll");
    return this.decoratedUser.findAll();
  }

  async create(data: { email: string; name: string; age?: number }): Promise<User> {
    this.increment("create");
    return this.decoratedUser.create(data);
  }

  async update(id: number, data: Partial<{ name: string; age: number }>): Promise<User> {
    this.increment("update");
    return this.decoratedUser.update(id, data);
  }

  async delete(id: number): Promise<void> {
    this.increment("delete");
    return this.decoratedUser.delete(id);
  }
}