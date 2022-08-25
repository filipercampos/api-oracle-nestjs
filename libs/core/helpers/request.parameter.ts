import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { BaseParameterEnum } from '../enums/base-parameter.enum';
import { BaseParameter } from '../interfaces/external/base.parameter';
import { BodyParameter } from './body.parameter';
import { QueryParameter } from './query.parameter';

/**
 *  @deprecated Replaced with {@link BaseParameter}. Will be removed in v1.0.2
 **/
export class RequestParameter {
  constructor(
    query: QueryParameter,
    body: BodyParameter,
    headers: AxiosRequestHeaders,
  ) {
    this._query = query;
    this._body = body;
    this.config = {};
    this.config.headers = headers;
  }

  protected _endpoint: string;
  private _path?: string;
  private _query?: QueryParameter;
  private _body?: BodyParameter;
  config: AxiosRequestConfig;

  push(...params: BaseParameter[]): void {
    for (const p of params) {
      if (p.type == BaseParameterEnum.Query) {
        this._query = p;
      } else if (p.type == BaseParameterEnum.Body) {
        this._body = p;
      } else if (p.type == BaseParameterEnum.Header) {
        this.config.headers = p.values;
      } else {
        throw new Error('parameter type not mapped');
      }
    }
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
  set path(value: string | number | boolean) {
    this._path = `/${value}`;
  }

  /**
   * Get parameter `in path`
   */
  get path(): string {
    return this.path;
  }

  /**
   * Query parameters
   */
  get query(): string {
    return this._query.values;
  }

  /**
   * Get body
   */
  get body(): Record<string, any> {
    return this._body.values;
  }

  /**
   * Set headers
   */
  set headers(headers: AxiosRequestHeaders) {
    this.config.headers = headers;
  }

  /**
   * Get headers
   */
  get headers() {
    return this.config.headers;
  }

  /**
   * Url with path and query params
   */
  get url(): string {
    if (this._path) {
      return `${this.endpoint}${this._path}${this._query.values}`;
    }
    return `${this.endpoint}${this._query.values}`;
  }
}
