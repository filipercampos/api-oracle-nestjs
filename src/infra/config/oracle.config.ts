/**
 * Oracle db config
 */
export function oracleDbConfig() {
  const host = process.env.ORACLE_DB_HOST;
  const port = process.env.ORACLE_DB_PORT;
  const user = process.env.ORACLE_DB_USERNAME;
  const password = process.env.ORACLE_DB_PASSWORD;
  const serviceName = process.env.ORACLE_DB_SERVICENAME;

  return {
    user: user,
    password: password,
    connectString: `${host}:${port}/${serviceName}`,
  };
}
