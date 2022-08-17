import { Logger } from '@nestjs/common';
import OracleDB from 'oracledb';
import { OracleStatement } from '../interfaces/ioracle.parameter';

export class LoggerOracle {
  private logger: Logger;
  private _showLog: boolean;
  constructor(logger: Logger, showLog: boolean) {
    this.logger = logger;
    this._showLog = showLog;
  }
  /**
   * Logger message
   */
  private log(message: string) {
    if (this._showLog) {
      this.logger.log(message);
    }
  }
  /**
   * Script log command 'execute'
   */
  logExcecute(result: OracleDB.Result<any>) {
    if (Object.keys(result).length == 0) {
      this.log('Execute script');
    } else {
      this.log('Execute rows affected: ' + result.rowsAffected);
    }
  }
  /**
   * Script log command 'batch'
   */
  logBatch(result: OracleDB.Result<any>) {
    this.log('batch rows affected: ' + result.rowsAffected);
  }
  /**
   * Script log command 'save'
   */
  logSave(result: OracleDB.Result<any>) {
    this.log('Saved rows: ' + result.rowsAffected);
  }
  /**
   * Script log command 'find'
   */
  logFind(result: OracleDB.Result<any>) {
    this.log('Find rows count: ' + result.rows?.length);
  }
  /**
   * Script log command 'update'
   */
  logUpdate(result: OracleDB.Result<any>) {
    this.log('Updated rows: ' + result.rowsAffected);
  }
  /**
   * Script log command 'delete'
   */
  logDelete(result: OracleDB.Result<any>) {
    this.log('Deleted rows: ' + result.rowsAffected);
  }

  /**
   * Handle log sql text
   */
  logStatement(statement: OracleStatement) {
    const line =
      '================================================================================================';
    let message = `Script SQL\n${line}\n${statement.sql}\n`;
    if (statement.values) {
      message += `VALUES\n${statement.values.toString()}\n`;
    }
    message += `${line}`;
    this.log(message);
  }
}
