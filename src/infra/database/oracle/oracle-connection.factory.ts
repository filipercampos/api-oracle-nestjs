import { oracleDbConfig } from '@infra/config/oracle.config';
import oracledb = require('oracledb');
/**
 * Connection Factory Oracle
 *
 * autoCommit: true
 */
export class OracleConnectionFactory {
  constructor() {
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    oracledb.autoCommit = true;
  }
  createConnection() {
    return oracledb.getConnection(oracleDbConfig());
  }
}
