import oracledb = require('oracledb');
import { FindOptionsWhere } from '../interfaces/find-options-where';
import {
  IOracleParameter,
  OracleParamaterType,
} from '../interfaces/ioracle.parameter';

/**
 * Oracle parameter
 */
export class OracleParameter<T> implements IOracleParameter {
  private _parameter: OracleParamaterType;
  private _fieldName: string;
  private _operator: string;

  constructor(
    data:
      | FindOptionsWhere<T>
      | Record<string, string | number | boolean | Date>,
    op: 'AND' | 'OR' | '<>' | 'LIKE' = 'AND',
  ) {
    const keys = Object.keys(data);
    const key = keys[0];
    const value = data[key];
    this._operator = op;
    this._fieldName = key;
    const properties = {
      type: oracledb.STRING,
      dir: oracledb.BIND_IN,
      val: value,
    };

    if (typeof value === 'number') {
      properties.type = oracledb.NUMBER;
    } else if (value instanceof Date) {
      properties.type = oracledb.DATE;
    } else {
      properties.type = oracledb.STRING;
    }

    const param: any = { properties };
    param[key] = properties;
    delete param['properties'];

    this._parameter = param;
  }

  get parameter(): OracleParamaterType & any {
    return this._parameter;
  }

  get value(): OracleParamaterType & any {
    return this.parameter;
  }

  get fieldName(): string {
    return this._fieldName;
  }

  get operator(): string {
    return this._operator;
  }

  get whereOptions(): string {
    if (!this.hasData) return '';
    return `${this._operator} ${this.fieldName} = :${this.fieldName}`.toUpperCase();
  }

  get hasData(): boolean {
    return Object.keys(this._parameter).length > 0;
  }
}

/**
 * Oracle parameter array
 */
export class OracleParameters<T> implements IOracleParameter {
  constructor(...param: OracleParameter<T>[]) {
    this._parameters.push(...param);
  }
  private _parameters: OracleParameter<T>[] = [];

  push(...param: OracleParameter<T>[]) {
    this._parameters.push(...param);
  }

  get parameters(): OracleParameter<T>[] {
    return this._parameters;
  }

  get value(): Record<string, any> {
    const values: any = {};
    //converter array to map
    for (const o of this._parameters) {
      const keys = Object.keys(o.parameter);
      //set {key:value}
      values[keys[0]] = o.parameter[keys[0]];
    }
    return values;
  }

  get hasData() {
    return Object.keys(this.value).length > 0;
  }

  get whereOptions(): string {
    if (!this.hasData) return '';
    let where = '';
    for (let i = 0; i < this._parameters.length; i++) {
      const p = this._parameters[i];
      if (i == 0) {
        if (p.operator != 'LIKE') {
          where += `${p.whereOptions.replace(p.operator, '').trim()}`;
        } else {
          where += `${p.whereOptions
            .replace(p.operator, '')
            .replace('=', p.operator)
            .trim()}`;
        }
      } else if (i < this._parameters.length - 1) {
        where += `\n${p.whereOptions}\n`;
      } else {
        where += `\n${p.whereOptions} `;
      }
    }
    return where.toUpperCase();
  }
}
