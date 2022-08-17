/**
 * Configuração de autenticação
 */
export class AuthConfig {
  user: string;
  password: string;

  constructor(user: string, password: string) {
    this.user = user;
    this.password = password;
  }
}
/**
 * Generic Config
 */
export class ServerConfig {
  name: string;
  host: string;
  port: number;
  auth: AuthConfig | null;

  constructor(config: {
    name: string;
    host: string;
    port?: number;
    auth?: AuthConfig | null;
  }) {
    this.name = config.name;
    this.host = config.host;
    this.port = config.port;
    this.auth = config.auth;
  }
}
