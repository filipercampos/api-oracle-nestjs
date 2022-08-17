import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_1_DAY } from '@shared/constants';
import * as redisStore from 'cache-manager-redis-store';

export class RedisConfigFactory implements CacheOptionsFactory {
  constructor(private config: ConfigService) {}
  createCacheOptions(): CacheModuleOptions | Promise<CacheModuleOptions> {
    const config = this.config || new ConfigService(); //config must be global
    return {
      store: redisStore,
      host: config.get('REDIS_HOST'),
      port: config.get('REDIS_PORT'),
      ttl: CACHE_1_DAY,
      db: 0,
    };
  }
}
