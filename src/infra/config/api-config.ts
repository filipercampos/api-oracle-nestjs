type IApiConfig = {
  url: string;
  username?: string;
  password?: string;
  token?: string;
  clientId?: string;
  secret?: string;
  grantType?: string;
};
/**
 * API Config
 */
export class ApiConfig implements IApiConfig {
  url: string;
  username?: string;
  password?: string;
  token?: string;
  clientId?: string;
  secret?: string;
  grantType?: string;

  constructor(config: IApiConfig) {
    this.url = config.url;
    this.username = config.username;
    this.password = config.password;
    this.token = config.token;
    this.clientId = config.clientId;
    this.secret = config.secret;
    this.grantType = config.grantType;
  }
}
