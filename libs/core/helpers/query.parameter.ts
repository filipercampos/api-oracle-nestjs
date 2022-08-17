import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { BaseParameterEnum } from '../enums/base-parameter.enum';
import {
  BaseParameter,
  ParameterValue,
} from '../interfaces/external/base.parameter';

export class QueryParameter extends BaseParameter {
  constructor(
    endpoint: string,
    headers?: AxiosRequestHeaders,
    config?: AxiosRequestConfig,
  ) {
    super(endpoint, headers, config);
    this.queryParams = '';
    this._values = [];
  }

  override get params() {
    return this.values;
  }
  /**
   * Push parameters `in query`
   */
  override push(o: ParameterValue) {
    if (!o) return;
    const keys = Object.keys(o);
    for (const key of keys) {
      const value: any = o[key];
      this.pushParam(key, value);
    }
  }
  /**
   * Push single parameter
   */
  override pushParam(key: string, value: string | number | boolean | Date) {
    if (!key || key === '') {
      throw new Error('key is required to pushParam');
    }
    if (!value || value === '') {
      throw new Error('value is required to pushParam');
    }
    let newUrl = '';
    if (this._values.length == 0) {
      newUrl += `?${key}=${value}`;
    } else {
      newUrl += `&${key}=${value}`;
    }
    this._values.push({
      name: key,
      value: value,
    });
    this.queryParams += newUrl;
  }

  override get values(): string {
    return this.queryParams;
  }

  get type(): BaseParameterEnum {
    return BaseParameterEnum.Query;
  }
}
