import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';
import { CustomConfigService } from '../config/config.service';
import { getPagination } from '../common/utils/pagination';

@Injectable()
export class RedisService implements OnModuleDestroy, OnModuleInit {
  private readonly redis: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly config: CustomConfigService) {
    this.redis = new Redis({
      host: config.getRedisHost(),
      port: config.getRedisPort(),
      // password: config.getRedisPassword(),
    });
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }

  onModuleInit() {
    this.redis.on('connect', () => {
      this.logger.log('🧠 Redis connected');
    });

    this.redis.on('ready', () => {
      this.logger.log('🚀 Redis ready to use');
    });

    this.redis.on('error', (err) => {
      this.logger.error('Redis error', err);
    });

    this.redis.on('close', () => {
      this.logger.warn('Redis connection closed');
    });

    this.redis.on('reconnecting', () => {
      this.logger.warn('Redis reconnecting...');
    });
  }

  async setRedis<T>(key: string, body: T, ttl?: number) {
    await this.redis.setex(key, ttl || 60 * 60 * 12, JSON.stringify(body));
  }

  async getRedis<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  }

  async delRedis(key: string): Promise<boolean> {
    const value = await this.redis.del(key);
    return value > 0;
  }

  async getMany<T>(
    sub: string,
    pagination?: { page?: number; limit?: number },
  ): Promise<{ data: T[] }> {
    const { limit, skip } = getPagination(pagination || {});
    let cursor = '0';
    const rows: T[] = [];

    do {
      const [nextCursor, keys] = await this.redis.scan(
        cursor,
        'MATCH',
        `${sub}*`,
        'COUNT',
        100,
      );

      if (keys.length) {
        const pipeline = this.redis.pipeline();
        keys.forEach((key) => pipeline.get(key));
        const result = (await pipeline.exec()) as [Error | null, string][];
        for (let i = skip; i < skip + limit; i++) {
          const [err, data] = result[i];
          if (!err && data.length) {
            rows.push(JSON.parse(data) as T);
          }
        }
      }

      cursor = nextCursor;
    } while (cursor !== '0');

    return { data: rows };
  }

  async setMany<T>(
    sub: string,
    field: string,
    data: T[],
    ttl?: number,
  ): Promise<[error: Error | null, result: unknown][]> {
    if (data.length) {
      const pipeline = this.redis.pipeline();

      data.forEach((r) =>
        pipeline.setex(
          `${sub}:${r[field]}`,
          ttl || 60 * 60 * 12,
          JSON.stringify(r),
        ),
      );
      const result = await pipeline.exec();
      return result || [];
    }
    return [];
  }

  get client(): Redis {
    return this.redis;
  }
}
