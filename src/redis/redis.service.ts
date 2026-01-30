import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  /**
   * Write key-value to Redis
   * @param key Redis key
   * @param value Value to store (auto-serialized if object)
   * @param ttl Time-to-live in seconds (optional)
   */
  async write<T = any>(key: string, value: T, ttl?: number): Promise<void> {
    const data =
      typeof value === 'object' ? JSON.stringify(value) : String(value);
    if (ttl && ttl > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      await this.redisClient.set(key, data, 'EX', ttl);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
      await this.redisClient.set(key, data);
    }
  }

  /**
   * Read key from Redis
   * @param key Redis key
   * @returns Parsed JSON if valid, or raw string
   */
  async read<T = any>(key: string): Promise<T | null> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const data = await this.redisClient.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return data as any;
    }
  }

  /**
   * Delete key from Redis
   * @param key Redis key
   */
  async delete(key: string): Promise<number> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
    return await this.redisClient.del(key);
  }

  /**
   * Check if key exists
   * @param key Redis key
   * @returns true if exists
   */
  async exists(key: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const result = await this.redisClient.exists(key);
    return result === 1;
  }
}
