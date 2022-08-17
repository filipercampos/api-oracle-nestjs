import { ConfigService } from '@nestjs/config';
/**
 * Oracle db config
 */
export const oracleDbConfig = function () {
  const config = new ConfigService();
  const host = config.get('ORACLE_HOST');
  const port = config.get('ORACLE_PORT');
  const user = config.get('ORACLE_USERNAME');
  const password = config.get('ORACLE_PASSWORD');
  const serviceName = config.get('ORACLE_SERVICENAME');
  return {
    user: user,
    password: password,
    connectString: `${host}:${port}/${serviceName}`,
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0,
  };
};
