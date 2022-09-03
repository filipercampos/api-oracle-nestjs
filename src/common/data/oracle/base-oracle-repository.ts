import { OracleConnectionFactory } from '@infra/database/oracle/oracle-connection.factory';
import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { BaseMapper } from '../base/base.mapper';
import { BaseOracleMetadata } from '../base/base.metadata';
import { FindOptionsWhere } from '../interfaces/find-options-where';
import {
  IOracleOrderBy,
  OraclePaginationType,
} from '../interfaces/ioracle.parameter';
import { IRepository } from '../interfaces/irepository';
import { LoggerOracle } from '../utils/logger-oracle';
import { IOracleResults } from './../interfaces/ioracle-results';
import { OracleParameter, OracleParameters } from './oracle.parameter';
import oracledb = require('oracledb');
/**
 * Base Oracle Repository
 */
export class BaseOracleRepository<T, M> implements IRepository<T, M> {
  private readonly logger: Logger;
  private readonly loggerOracle: LoggerOracle;
  protected readonly tableName: string;
  protected readonly primaryKeyName: string;
  protected readonly metadata: BaseOracleMetadata;
  protected autoCommit: boolean;
  private _showLog: boolean;
  private connectionFactory: OracleConnectionFactory;
  private connection: oracledb.Connection;
  readonly mapperEntity: BaseMapper<T>;

  /**
   * Create base reposytory
   */
  constructor(metadata: BaseOracleMetadata, mapper?: BaseMapper<T>) {
    this.autoCommit = true;
    this.tableName = metadata.tableName.toUpperCase();
    this.primaryKeyName = metadata.primaryKeyName.name.toUpperCase();
    this.logger = new Logger(this.constructor.name);
    this.connectionFactory = new OracleConnectionFactory();
    this._showLog = process.env.NODE_ENV === 'local';
    this.mapperEntity = mapper;
    this.metadata = metadata;
    this.loggerOracle = new LoggerOracle(this.logger, this._showLog);
  }

  /**
   * Open connection
   */
  protected async openConnection(): Promise<oracledb.Connection> {
    const connection = await this.connectionFactory.createConnection();
    this.connection = connection;
    return connection;
  }

  /**
   * Find row by primary key
   */
  async findById(id: number | string): Promise<T> {
    this.log('findById');
    //create criteria
    const criteria = this.createPkCriteria(id);
    //build select
    const query = this.metadata.createQuery(criteria);
    this.loggerOracle.logStatement(query);
    //open connection
    const connection = await this.openConnection();
    //get results
    const result = await connection
      .execute(query.sql, {}, { maxRows: 1 })
      .finally(() => this.closeConnection());
    if (result.rows.length > 0) {
      const data: any = result.rows[0];
      if (this.mapperEntity) {
        return this.mapperEntity.fromJson(data);
      }
      return data;
    }
    return null;
  }

  /**
   * Find one row by
   *
   * Criteria always use operator AND
   */
  async findOneBy(criteria: FindOptionsWhere<M>): Promise<T> {
    this.log('findOneBy');
    const query = this.metadata.createQuery(criteria);
    this.loggerOracle.logStatement(query);
    const connection = await this.openConnection();
    const result = await connection
      .execute(query.sql, query.bindParams, { maxRows: 1 })
      .then((result) => result.rows)
      .finally(() => this.closeConnection());
    if (result.length > 0) {
      const data: any = result[0];
      if (this.mapperEntity) {
        return this.mapperEntity.fromJson(data);
      }
      return data;
    }
    return null;
  }

  /**
   * Find rows by criteria/parameters
   *
   * Object 'criteria' always use operator AND
   *
   * To use other operator use {@link OracleParameter}
   */
  async find(
    criteria: FindOptionsWhere<M> | OracleParameter<M> | OracleParameters<M>,
    options?: {
      fields?: Array<string>;
      order?: IOracleOrderBy;
    },
  ): Promise<T[]> {
    this.log('find');
    const connection = await this.openConnection();
    const query = this.metadata.createQuery(criteria, options?.fields);

    this.loggerOracle.logStatement(query);
    return connection
      .execute(query.sql, query.bindParams)
      .then((result) => {
        this.loggerOracle.logFind(result);
        const results: any = result.rows ?? [];
        if (this.mapperEntity) {
          return this.mapperEntity.toArray(results);
        }
        return results;
      })
      .finally(() => this.closeConnection());
  }
  /**
   * Find rows by criteria/parameters
   *
   * Object 'criteria' always use operator AND
   *
   * To use other operator use {@link OracleParameter}
   */
  async findWithPagination(
    criteria: FindOptionsWhere<M> | OracleParameter<M> | OracleParameters<M>,
    pagination: OraclePaginationType,
    options?: {
      fields?: Array<string>;
      order?: IOracleOrderBy;
    },
  ): Promise<IOracleResults<T>> {
    this.log('find');
    if (!pagination || Object.keys(pagination).length == 0) {
      throw new Error('pagination is required');
    }
    const connection = await this.openConnection();
    //build query pagination
    const query = this.metadata.createCriteriaOffset(
      criteria,
      pagination,
      options?.fields,
      options?.order,
    );
    this.loggerOracle.logStatement(query);
    return connection
      .execute(query.sql, query.bindParams)
      .then((result) => {
        this.loggerOracle.logFind(result);
        let results: any = result.rows ?? [];
        //total count
        const count =
          results?.length > 0 ? results[0]['TOTAL_COUNT'] : undefined;
        //mapper data
        if (this.mapperEntity) {
          results = this.mapperEntity.toArray(results);
        }
        return { results, count };
      })
      .finally(() => this.closeConnection());
  }

  /**
   * Save row
   */
  async save(entity: M): Promise<boolean> {
    this.log('save');
    const connection = await this.openConnection();
    const query = BaseOracleMetadata.createInsertCommand(
      this.tableName,
      entity,
    );
    this.loggerOracle.logStatement(query);
    return connection
      .execute(query.sql, query.bindParams, {
        autoCommit: this.autoCommit,
      })
      .then((result) => {
        this.loggerOracle.logSave(result);
        return this.hasAffected(result);
      })
      .finally(() => this.closeConnection());
  }

  /**
   * Update row
   */
  async update(id: number | string, data: M): Promise<oracledb.Result<any>> {
    this.log('update');
    const connection = await this.openConnection();
    const criteria = {};
    criteria[this.primaryKeyName] = id;
    const query = BaseOracleMetadata.createUpdateCommand(
      this.tableName,
      data,
      criteria,
    );
    this.loggerOracle.logStatement(query);
    return connection
      .execute(query.sql, query.bindParams, {
        autoCommit: this.autoCommit,
      })
      .then((result) => {
        this.loggerOracle.logUpdate(result);
        return result;
      })
      .finally(() => this.closeConnection());
  }

  /**
   * Delete row
   */
  async deleteById(id: string | number): Promise<oracledb.Result<any>> {
    this.log('deleteById');
    const connection = await this.openConnection();
    //create criteria
    const criteria = this.createPkCriteria(id);
    //build delete from criteriaia
    const query = BaseOracleMetadata.createDeleteCommand(
      this.tableName,
      criteria,
    );
    this.loggerOracle.logStatement(query);
    return connection
      .execute(query.sql, {}, { autoCommit: this.autoCommit })
      .then((result) => {
        this.loggerOracle.logDelete(result);
        return result;
      })
      .finally(() => this.closeConnection());
  }

  /**
   * Delete row by criteria
   */
  async delete(criteria: FindOptionsWhere<T>): Promise<oracledb.Result<any>> {
    this.log('delete');
    const connection = await this.openConnection();
    //build delete from criteria
    const query = BaseOracleMetadata.createDeleteCommand(
      this.tableName,
      criteria,
    );
    this.loggerOracle.logStatement(query);
    return connection
      .execute(query.sql, {}, { autoCommit: this.autoCommit })
      .then((result) => {
        this.loggerOracle.logDelete(result);
        return result;
      })
      .finally(() => this.closeConnection());
  }

  /**
   * Execute SQL statement SELECT
   */
  async query(
    sqlText: string,
    params?: OracleParameter<any> | OracleParameters<M>,
    orderBy?: IOracleOrderBy,
  ): Promise<Array<any>> {
    const connection = await this.openConnection();
    const query = this.metadata.injectParams(sqlText, params, orderBy);
    this.loggerOracle.logStatement(query);
    return connection
      .execute(query.sql, query.bindParams)
      .then((result) => {
        this.loggerOracle.logFind(result);
        return result.rows;
      })
      .finally(() => this.closeConnection());
  }

  /**
   * Execute SQL or PL/SQL statement
   */
  async execute(
    sql: string,
    binds?: oracledb.BindParameters | OracleParameter<M> | OracleParameters<M>,
    autoCommit?: boolean,
  ): Promise<oracledb.Result<any>> {
    const connection = await this.openConnection();
    const params = BaseOracleMetadata.instanceOfParameter(binds)
      ? binds.value
      : binds;
    if (binds instanceof Array) {
      const statement = { sql, values: binds };
      this.loggerOracle.logStatement(statement);
    } else {
      this.loggerOracle.logStatement(params);
    }
    return connection
      .execute(sql, params ?? {}, { autoCommit: autoCommit ?? true })
      .then((result) => {
        this.loggerOracle.logExcecute(result);
        return result;
      })
      .finally(() => this.closeConnection());
  }

  /**
   * Execute DML or PL/SQL for inserting or updating multiple rows
   */
  async executeMany(
    sql: string,
    binds: oracledb.BindParameters[] | OracleParameter<M>[],
    autoCommit?: boolean,
  ): Promise<oracledb.Result<any>> {
    const connection = await this.openConnection();
    const params = BaseOracleMetadata.instanceOfParameter(binds)
      ? binds.value
      : binds;
    return connection
      .executeMany(sql, params, { autoCommit: autoCommit ?? true })
      .then((result) => {
        this.loggerOracle.logExcecute(result);
        return result;
      })
      .finally(() => this.closeConnection());
  }

  /**
   * Update row
   */
  async updateCriteria(
    criteria: FindOptionsWhere<T>,
    data: T | any,
  ): Promise<boolean> {
    this.log('updateCriteria');
    const connection = await this.openConnection();
    const sqlCommand = BaseOracleMetadata.createUpdateCommand(
      this.tableName,
      data,
      criteria,
    );
    return connection
      .execute(sqlCommand.sql, sqlCommand.bindParams, {
        autoCommit: this.autoCommit,
      })
      .then((result) => {
        this.loggerOracle.logUpdate(result);
        return this.hasAffected(result);
      })
      .finally(() => this.closeConnection());
  }

  /**
   * Close connection
   */
  protected async closeConnection(): Promise<void> {
    try {
      return await this.connection?.close();
    } catch (error) {
      this.handleError(error, 'closeConnection');
    }
  }

  /**
   * Commit transaction
   */
  protected commit(): Promise<void> {
    try {
      return this.connection?.commit();
    } catch (error) {
      this.handleError(error, 'commit');
    }
  }

  /**
   * Rollback files
   */
  protected rollback(): Promise<void> {
    try {
      return this.connection?.rollback();
    } catch (error) {
      this.handleError(error, 'rollback');
    }
  }

  /**
   * Read sql file from directory infra/database/sql
   */
  protected getSqlText(fileNameSql: string): string {
    try {
      const dir = path.join(__dirname, '../../../../src/infra/database/sql');
      if (!fileNameSql.includes('sql')) {
        fileNameSql += '.sql';
      }
      const pathFile = path.join(dir, fileNameSql);
      return fs.readFileSync(pathFile, { encoding: 'utf-8' });
    } catch (error) {
      this.handleError(error, 'getSqlText');
    }
  }

  /**
   * Check rows affected
   */
  protected hasAffected(result: oracledb.Result<any>): boolean {
    return result.rowsAffected > 0;
  }

  /**
   * Create oracle parameter
   */
  public createParam(type: FindOptionsWhere<M>): OracleParameter<M> {
    return new OracleParameter<M>(type);
  }

  /**
   * Create oracle parameters
   */
  public createParams(...params: OracleParameter<M>[]): OracleParameters<M> {
    return new OracleParameters<M>(...params);
  }

  /**
   * Handle error
   */
  protected handleError(error: Error, funcName: string) {
    const message = error instanceof Error ? error.message : error;
    this.logger.error(`${funcName ?? ''} ${message}`);
    throw error;
  }

  /**
   * Creta criteria using primary key name
   */
  private createPkCriteria(id: string | number) {
    //create param
    const criteria = {};
    //set value on primary key name
    if (this.metadata.primaryKeyName.type === 'number') {
      criteria[this.primaryKeyName] = parseInt(id.toString());
    } else {
      criteria[this.primaryKeyName] = id.toString();
    }
    return criteria;
  }

  /**
   * Print logs
   */
  protected log(message: any) {
    if (this._showLog) {
      this.logger.log(message instanceof Error ? message.message : message);
    }
  }

  /**
   * Show logs
   */
  public showLog(enable: boolean) {
    this._showLog = enable ?? false;
  }
}
