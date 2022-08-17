import oracledb = require('oracledb');

/**
 * Interface aux for OracleParameter
 */
export interface OracleParamaterType {
  key: {
    type:
      | typeof oracledb.STRING
      | typeof oracledb.DATE
      | typeof oracledb.NUMBER;
    dir: typeof oracledb.BIND_IN;
    val: string;
  };
}
/**
 * Oracle statement
 */
export interface OracleStatement {
  sql: string;
  values?: any[];
}
/**
 * Oracle limit rows
 */
export interface OracleLimitRow {
  top: number;
}

/**
 * Oracle parameter
 */
export interface IOracleParameter {
  get value(): OracleParamaterType & any;

  get hasData(): boolean;

  get whereOptions(): string;
}
/**
 * Oracle order
 */
export interface IOracleOrderBy {
  direction?: 'ASC' | 'DESC';
  field: string;
}
/**
 * Oracle pagination
 */
export type OraclePaginationType = {
  /**
   * Page
   */
  page: number;

  /**
   * Limit rows
   */
  limit: number;

  /**
   * Indicate pagination (default true)
   */
  paginate?: boolean;
};
