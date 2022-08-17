import { RedisConfigFactory } from '@infra/config/redis.config';
import { CacheModule, Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: RedisConfigFactory,
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
