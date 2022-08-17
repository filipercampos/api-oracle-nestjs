import { IMapperProperty } from '@common/data/base/base.mapper';
import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { BaseParameterEnum } from 'libs/core/enums/base-parameter.enum';

export type QueryParameterValue = {
  [key: string]: string | number | boolean | Date;
};

export type ParameterValue = {
  [key: string]: string | number | boolean | Date | Record<string, any>;
};

export interface IBaseParameter {
  /**
   * Push parameter
   */
  push(params: Record<string, string | number | boolean | Date>): void;
  /**
   * Push single parameter
   */
  pushParam(key: string, value: string | number | boolean | Date): void;
  /**
   * Parameters values
   */
  get values(): string | any;
  /**
   * Request type
   */
  get type(): BaseParameterEnum;
}

export abstract class BaseParameter {
  protected _endpoint: string;
  protected _path?: string;
  public url: string;

  protected queryParams: string;
  protected _values: any;
  config: AxiosRequestConfig;
  mapper: IMapperProperty;

  constructor(
    endpoint: string,
    headers?: AxiosRequestHeaders,
    config?: AxiosRequestConfig,
  ) {
    this._endpoint = endpoint;
    this._values = {};
    this.config = config ?? {};
    if (headers) {
      this.config.headers = headers;
    }
  }

  /**
   * Set parameters
   */
  push(o: ParameterValue) {
    if (!o) return;
    const keys = Object.keys(o);
    for (const k of keys) {
      this._values[k] = o[k];
    }
  }

  /**
   * Set single parameter
   */
  pushParam(key: string, value: string | number | boolean | Date) {
    if (!key || key === '') {
      throw new Error('key is required to pushParam');
    }
    if (!value || value === '') {
      throw new Error('value is required to pushParam');
    }
    this._values[key] = value;
    return this._values[key];
  }

  /**
   * Push array parameter `in query`
   */
  pushParamArray(name: string, values: Array<any>) {
    if (values.length > 0) {
      let params = values[0];
      for (let i = 1; i < values.length; i++) {
        const id = values[i];
        params = `${params},${id}`;
      }
      this.pushParam(name, params);
    }
  }

  /**
   * Build url request
   */
  requestUrl(baseUrl: string) {
    if (this._path) {
      this.url = `${baseUrl}/${this._endpoint}`;
    } else {
      this.url = `${baseUrl}/${this.endpoint}${this.values}`;
    }
    return this.url;
  }

  /**
   * Route request
   */
  get endpoint(): string {
    return this._endpoint;
  }

  /**
   * Push parameter `in path`
   */
  set path(value: string) {
    this._path = value;
  }

  /**
   * Push parameter `in path`
   */
  set headers(value: AxiosRequestHeaders) {
    this.config.headers = value;
  }

  /**
   * Get headers
   */
  get headers() {
    return this.config.headers;
  }

  /**
   * Get body
   */
  get data() {
    return this.config.data;
  }

  /**
   * Get query
   */
  get params() {
    return this.config.params;
  }

  /**
   * Get values
   */
  get values(): any {
    return this._values;
  }

  /**
   * Request type
   */
  abstract get type(): BaseParameterEnum;
}
