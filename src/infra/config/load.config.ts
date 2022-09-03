import { AppConfig } from './app.config';
import { Configuration } from './configuration';
/**
 * Initialize env config
 */
export const loadConfig = (): AppConfig => {
  if (!process.env.NODE_ENV) {
    throw new Error(`Env config invalid`);
  }
  //env default is production
  const env = `${process.env.NODE_ENV}.env`;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const envConfig = require('dotenv').config({ path: env }).parsed;
  process.env.PORT = envConfig.PORT || '3000';
  const config = new AppConfig(envConfig);
  Configuration.config = config;
  return config;
};
