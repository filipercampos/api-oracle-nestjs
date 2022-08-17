import { AppConfig } from './app.config';
/**
 * Configuration (Singletone)
 *
 */
export class Configuration {
  static config: AppConfig;

  /** Alias name for config */
  static get I(): AppConfig {
    return Configuration.config;
  }
}
