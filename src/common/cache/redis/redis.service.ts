import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_1_DAY } from '@shared/constants';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  private logger = new Logger(RedisService.name);
  /**
   * Get cache by key
   */
  async get<T>(key: string): Promise<any> {
    try {
      return await this.cacheManager.get<T>(key);
    } catch (error) {
      this.logger.error(`get ${key} error: ${error.message}`);
      return null;
    }
  }

  /**
   * Check exists data
   */
  async hasCache(key: string): Promise<boolean> {
    try {
      const cacheData = await this.cacheManager.get(key);
      return cacheData != null;
    } catch (error) {
      this.logger.error(`hasCache ${key} error: ${error.message}`);
      return false;
    }
  }
  /**
   * Save data in cache
   */
  async save(key: string, data: any, expireat?: number): Promise<void> {
    try {
      const cacheCfg = { ttl: expireat || CACHE_1_DAY };
      await this.cacheManager.set(key, data, cacheCfg);
    } catch (error) {
      this.logger.error(`set ${key} error: ${error.message}`);
    }
  }

  /**
   * Delete cache by key
   * @param key Chave
   */
  async delete(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      this.logger.log(`del ${key} error: ${error.message}`);
    }
  }

  /**
   * Clear all data cache
   */
  async clear() {
    const keys = await this.cacheManager.store.keys();
    await this.cacheManager.del(keys);
  }
}
