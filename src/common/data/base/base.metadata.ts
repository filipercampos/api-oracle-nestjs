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

  abstract get type(): OracleMetadataType;

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
      fieldsName = this.fields;
    }
    const paramsRecord = params?.value ? params.value : params;
    if (ObjectUtil.isEmpty(paramsRecord)) {
      const sql = `SELECT ${fieldsName} FROM ${this.tableName.toUpperCase()} ${top.replace(
        'AND ',
        '',
      )}`;
      return { sql, bindParams: {} };
    }

    if (BaseOracleMetadata.instanceOfParameter(params)) {
      const values = BaseOracleMetadata.extractCriteriaValues(params.value);
      const sql = `SELECT ${fieldsName} FROM ${this.tableName.toUpperCase()} \nWHERE ${
        params.whereOptions
      }${top}`;
      return { sql, bindParams: values };
    } else {
      const whereOptions = BaseOracleMetadata.extractCriteriaNative(params);
      const sql = `SELECT ${fieldsName} FROM ${this.tableName.toUpperCase()} \nWHERE ${whereOptions}${top}`;
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
    if (!criteria) throw new Error('criteria is not provided');
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
    let sqlText = `INSERT INTO ${tableName.toUpperCase()} (@keys) VALUES (@keysBind)`;
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
      sql: sqlText.toUpperCase(),
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
    const sqlText = `UPDATE ${tableName.toUpperCase()} SET ${entries.toUpperCase()} WHERE ${whereOptions}`;
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
    const sql = `DELETE FROM ${tableName.toUpperCase()} WHERE ${condition}`;
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
   * Create query with pagination
   */
  createCriteriaOffset(
    params:
      | FindOptionsWhere<any>
      | OracleParameter<any>
      | OracleParameters<any>,
    pagination: OraclePaginationType,
    fields?: Array<string>,
    orderBy?: IOracleOrderBy,
  ): OracleStatement {
    //binds
    const binds = {
      bindParams: {},
    } as OracleStatement;
    //pagination options
    const page: number = pagination.page;
    const limit: number = pagination.limit;

    let fieldsName: string[] = [];

    if (fields && fields.length > 0) {
      for (const f of fields) {
        if (!this.fields.includes(f)) {
          throw new Error(`field name is invalid ${f}`);
        }
      }
      fieldsName = fields;
    } else {
      fieldsName = this.fields;
    }
    //calculate total pages
    // const totalPagesField = `COUNT(*) OVER () / ${limit} TOTAL_COUNT`;
    const totalCountField = `\nCOUNT(*) OVER () TOTAL_COUNT`;

    //check has parameters
    const paramsRecord = params?.value ? params.value : params;
    if (ObjectUtil.isEmpty(paramsRecord)) {
      const sql = `SELECT ${fieldsName}, ${totalCountField} FROM ${this.tableName.toUpperCase()}`;
      binds.sql = sql;
    }
    //oracle parameters
    else if (BaseOracleMetadata.instanceOfParameter(params)) {
      const values = BaseOracleMetadata.extractCriteriaValues(params.value);
      const sql = `SELECT ${fieldsName}, ${totalCountField} FROM ${this.tableName.toUpperCase()} \nWHERE ${
        params.whereOptions
      }`;
      //set statement
      binds.sql = sql;
      binds.bindParams = values;
    } else {
      //sql native
      const whereOptions = BaseOracleMetadata.extractCriteriaNative(params);
      const sql = `SELECT ${fieldsName}, ${totalCountField} FROM ${this.tableName.toUpperCase()} \nWHERE ${whereOptions}`;
      //set statement
      binds.sql = sql;
    }
    //set order
    const order = `ORDER BY ${orderBy.field ?? 1} ${
      orderBy.direction ?? 'ASC'
    }`;
    //set offset (this option not working with page not exists)
    //Example
    // total = 2
    // page = 3
    // results = true
    // const offset = `OFFSET ${page} ROWS FETCH NEXT ${limit} ROWS ONLY`;
    // build offset
    // binds.sql = `${binds.sql}\n${order}\n${offset}`;
    const sqlPagination = `SELECT * FROM
(
    SELECT t.*, ROWNUM rownumid
    FROM
    (
      ${binds.sql}\n${order}
    ) t
    WHERE ROWNUM < ((${page} * ${limit}) + 1 )
)
WHERE rownumid >= (((${page}-1) * ${limit}) + 1)`;
    //build pagination statement
    binds.sql = sqlPagination;

    return binds;
  }
}
