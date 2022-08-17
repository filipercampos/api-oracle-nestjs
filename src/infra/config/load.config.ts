import { AppConfig } from './app.config';
import { Configuration } from './configuration';
/**
 * Initialize env config
 */
export const loadConfig = (): AppConfig => {
  if (!process.env.ENV) {
    throw new Error(`Env config invalid`);
  }
  //env default is production
  const env = `${process.env.ENV}.env`;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const envConfig = require('dotenv').config({ path: env }).parsed;
  if (!process.env.PORT) {
    throw new Error(`Env PORT config not defined`);
  }
  const config = new AppConfig(envConfig);
  Configuration.config = config;
  return config;
};
