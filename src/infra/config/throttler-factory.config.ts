import { ConfigService } from '@nestjs/config';
import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';

export class ThrottlerFactoryConfig implements ThrottlerOptionsFactory {
  constructor(private config: ConfigService) {}
  createThrottlerOptions(): ThrottlerModuleOptions {
    const config = this.config || new ConfigService();
    return {
      ttl: config.get('THROTTLE_TTL'),
      limit: config.get('THROTTLE_LIMIT'),
    };
  }
}
