import { ApiConfig } from './api-config';
import { ServerConfig } from './server.config';

/**
 * App Config
 *
 * Encapsulates environment variables in an interface
 *
 */
export class AppConfig {
  env: string;
  apiMarvel: ApiConfig;
  redis: ServerConfig;

  constructor(config: any) {
    this.env = process.env.ENV;
    //redis instance
    this.redis = new ServerConfig({
      name: 'REDIS',
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
    });
    //marvel api
    this.apiMarvel = new ApiConfig({
      url: config.API_MARVEL_URL,
      token: config.API_MARVEL_TOKEN,
    });
  }
}
