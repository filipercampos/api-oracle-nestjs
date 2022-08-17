import { ObjectUtil } from '@shared/utils/object.util';
import { BindParameters } from 'oracledb';
import { FindOptionsWhere } from '../interfaces/find-options-where';
import {
  IOracleOrderBy,
  OracleLimitRow,
  OraclePaginationType,
} from '../interfaces/ioracle.parameter';
import { ObjectLiteral } from '../interfaces/object-literal';
import { OracleParameter, OracleParameters } from '../oracle/oracle.parameter';
/**
 * Oracle statement
 */
interface OracleStatement {
  sql: string;
  bindParams: BindParameters;
}
/**
 * Metadata oracle
 */
export interface OracleEntityMetadata {
  tableName: string;
  primaryKeyName: {
    name: string;
    type: number | string;
  };
  metadata: ObjectLiteral;
}
/**
 * Oracle metadata type
 */
export type OracleMetadataType = ObjectLiteral;

/**
 * Base Oracle Metadata
 */
export abstract class BaseOracleMetadata implements OracleEntityMetadata {
  /**
   * Table name
   */
  abstract get tableName(): string;

  /**
   * Primary key name
   */
  abstract get primaryKeyName(): {
    name: string;
    type: number | string;
  };

  /**
   * Metadata array of fields from table
   */
  abstract metadata: string[];

  /**
   * Fields for quert
   */
  get fields(): string[] {
    if (this.metadata instanceof Array<string>) {
      return this.metadata;
    }
    return Object.keys(this.metadata);
  }

  /**
   * Create SELECT from oracle parameters
   */
  createQuery(
    params:
      | FindOptionsWhere<any>
      | OracleParameter<any>
      | OracleParameters<any>,
    fields?: Array<string>,
    limit?: OracleLimitRow,
  ): OracleStatement {
    let top = '';
    if (limit) {
      if (limit.top > 1) {
        top = ` AND ROWNUM <= ${limit.top}`;
      } else if (limit.top === 1) {
        top = ` AND ROWNUM = ${limit.top}`;
      }
    }
    let fieldsName: any;

    if (fields && fields.length > 0) {
      for (const f of fields) {
        if (!this.fields.includes(f)) {
          throw new Error(`field name is invalid ${f}`);
        }
      }
      fieldsName = fields;
    } else {
      fieldsName = '*';
    }
    if (ObjectUtil.isEmpty(params) || !params?.hasData) {
      const sql = `SELECT ${fieldsName} FROM ${this.tableName} ${top.replace(
        'AND ',
        '',
      )}`;
      return { sql, bindParams: {} };
    }

    if (BaseOracleMetadata.instanceOfParameter(params)) {
      const values = BaseOracleMetadata.extractCriteriaValues(params.value);
      const sql = `SELECT ${fieldsName} FROM ${this.tableName} \nWHERE ${params.whereOptions}${top}`;
      return { sql, bindParams: values };
    } else {
      const whereOptions = BaseOracleMetadata.extractCriteriaNative(params);
      const sql = `SELECT ${fieldsName} FROM ${this.tableName} \nWHERE ${whereOptions}${top}`;
      return { sql, bindParams: {} };
    }
  }

  /**
   * Inject parameters on statement
   */
  injectParams(
    sqlText: string,
    params?:
      | OracleParameter<any>
      | OracleParameters<any>
      | FindOptionsWhere<any>,
    orderBy?: IOracleOrderBy,
  ): OracleStatement {
    if (!params) return { sql: sqlText, bindParams: {} };
    let whereOptions = '';
    if (BaseOracleMetadata.instanceOfParameter(params)) {
      whereOptions = params.whereOptions;
    } else {
      whereOptions = BaseOracleMetadata.extractCriteriaNative(params);
    }
    let order = '';
    if (orderBy) {
      order = `\nORDER BY ${orderBy.field} ${
        orderBy.direction ?? ''
      }`.toUpperCase();
    } else {
      order = '';
    }
    let sql = '';
    if (sqlText.includes('WHERE')) {
      sql = `${sqlText} \n ${whereOptions} ${order}`;
    } else {
      sql = `${sqlText} \nWHERE ${whereOptions} ${order}`;
    }
    return { sql, bindParams: params?.value };
  }

  /**
   * Get sql text SELECT from criteria native
   */
  static extractCriteriaNative<T>(criteria: FindOptionsWhere<T>): string {
    const keys = Object.keys(criteria);
    let condition = '';
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      let value = criteria[key];
      if (typeof value == 'string') {
        value = `'${value}'`;
      }
      if (keys.length == 1) {
        return `${key} = ${value}`;
      }
      if (i == 0) {
        condition += `${key} = ${value}\n`;
      } else if (i < keys.length - 1) {
        condition += `AND ${key} = ${value}\n`;
      } else {
        condition += `AND ${key} = ${value}`;
      }
    }
    return condition;
  }

  /**
   * Get sql text from criteria
   */
  static extractCriteriaValues<T>(
    criteria:
      | FindOptionsWhere<T>
      | Record<string, string | number | boolean | Date>,
  ): any[] {
    return Object.values(criteria);
  }

  /**
   * Create insert command Oracle
   */
  static createInsertCommand(tableName: string, entity: any): OracleStatement {
    let sqlText = `INSERT INTO ${tableName} (@keys) VALUES (@keysBind)`;
    const keys: Array<string> = Object.keys(entity);
    const keysBinds = [];
    const values = [];
    for (let i = 0; i < keys.length; i++) {
      const key: string = keys[i];
      keysBinds.push(`:${key.toLowerCase()}`);
      const value = entity[key];
      if (value === undefined) {
        throw new Error(
          `createInsertCommand invalid key ${key} value ${value}`,
        );
      }
      values.push(value);
    }
    sqlText = sqlText.replace('@keys', keys.toString());
    sqlText = sqlText.replace('@keysBind', keysBinds.toString());
    return {
      sql: sqlText,
      bindParams: values,
    };
  }

  /**
   * Create update command Oracle
   */
  static createUpdateCommand(
    tableName: string,
    entity: any,
    criteria: FindOptionsWhere<any>,
  ): OracleStatement {
    let entries = '';
    const whereOptions = BaseOracleMetadata.extractCriteriaNative(criteria);

    const keys: any = Object.keys(entity);
    const values: any = Object.values(entity);
    for (let i = 0; i < keys.length; i++) {
      const key: string = keys[i];
      const entryValue = `${key.toLowerCase()} = :${key.toLowerCase()}`;
      if (i < keys.length - 1) {
        entries += `${entryValue},`;
      } else {
        entries += `${entryValue}`;
      }
    }
    const sqlText = `UPDATE ${tableName} SET ${entries} WHERE ${whereOptions}`;
    return {
      sql: sqlText,
      bindParams: values,
    };
  }

  /**
   * Create delete command Oracle
   */
  static createDeleteCommand(
    tableName: string,
    criteria: FindOptionsWhere<any>,
  ): OracleStatement {
    const condition = BaseOracleMetadata.extractCriteriaNative(criteria);
    const sql = `DELETE FROM ${tableName} WHERE ${condition}`;
    return { sql, bindParams: undefined };
  }

  /**
   * Check weather object implements {@link IOracleParameter}
   */
  static instanceOfParameter(
    object: any,
  ): object is OracleParameter<any> | OracleParameters<any> {
    return 'whereOptions' in object && 'value' in object && 'hasData' in object;
  }

  /**
   * Create offset pagination
   */
  static createOffset(
    pagination: OraclePaginationType,
    orderBy?: IOracleOrderBy,
  ): string {
    let page: number, limit: number;
    if (pagination.page) {
      page = pagination.page;
    }
    if (pagination.limit) {
      limit = pagination.limit;
    }
    const order = orderBy ? `${orderBy.field} ${orderBy.direction}` : '';
    if (page && limit) {
      return `\nORDER BY ${order}\nOFFSET ${page} ROWS FETCH NEXT ${limit} ROWS ONLY`;
    }
    return '';
  }
}