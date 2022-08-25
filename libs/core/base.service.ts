import { ApiConfig } from '@infra/config/api-config';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { Agent } from 'https';
import { firstValueFrom } from 'rxjs';
import { BodyParameter, HeaderParameter, QueryParameter } from './helpers';
import { BaseParameter } from './interfaces/external/base.parameter';
/**
 * Integration base service
 */
export abstract class BaseService {
  protected config: ApiConfig;
  private _useAgent: boolean;
  private _showLog: boolean;
  private readonly logger: Logger;

  constructor(config: ApiConfig, private httpService: HttpService, ssl = true) {
    this.config = config;
    this._useAgent = ssl;
    this._showLog = process.env.ENV !== 'production';
    this.logger = new Logger(this.constructor.name);
  }
  private logRequest(config: AxiosRequestConfig | BaseParameter) {
    if (this._showLog) {
      const url = config.url;
      const data = config.data;
      const params = config.params;
      const headers = config.headers;
      this.logger.log('Base URL: ' + this.config.url);
      if (headers) this.logger.log('Headers: ' + JSON.stringify(headers));
      if (params) this.logger.log('Query: ' + JSON.stringify(params));
      if (data) this.logger.log('Body: ' + JSON.stringify(data));
      this.logger.log('URL: ' + JSON.stringify(url));
    }
  }
  /**
   * Request HTTP
   */
  async requestAxios<T>(config: AxiosRequestConfig): Promise<T> {
    this._handleSsl(config);
    this.logRequest(config);
    try {
      const res = await firstValueFrom(this.httpService.request<T>(config));
      return res.data;
    } catch (err) {
      throw this._handleErrorRequest(err, 'requestAxios');
    }
  }

  /**
   * Request GET
   */
  async get<T>(params: QueryParameter): Promise<T> {
    this._handleSsl(params.config);
    const url = params.requestUrl(this.config.url);
    this.logRequest(params);
    try {
      const res = await firstValueFrom(
        this.httpService.get<T>(encodeURI(url), params.config),
      );
      if (params.mapper) {
        return params.mapper.fromJson(res.data);
      }
      return res.data;
    } catch (err) {
      return this._handleErrorRequest(err, 'get');
    }
  }

  /**
   * Request POST
   */
  async post<T>(params: BodyParameter): Promise<T> {
    this._handleSsl(params.config);
    const url = params.requestUrl(this.config.url);
    this.logRequest(params);
    try {
      const res = await firstValueFrom(
        this.httpService.post<T>(encodeURI(url), params.values, params.config),
      );
      return res.data;
    } catch (err) {
      throw this._handleErrorRequest(err, 'post');
    }
  }

  /**
   * Request PUT
   */
  async put<T>(params: BodyParameter): Promise<T> {
    this._handleSsl(params.config);
    const url = params.requestUrl(this.config.url);
    this.logRequest(params);
    try {
      const res = await firstValueFrom(
        this.httpService.put<T>(encodeURI(url), params.values, params.config),
      );
      return res.data;
    } catch (err) {
      throw this._handleErrorRequest(err, 'put');
    }
  }

  /**
   * Request PATCH
   */
  async patch<T>(params: BodyParameter): Promise<T> {
    this._handleSsl(params.config);
    const url = params.requestUrl(this.config.url);
    this.logRequest(params);
    try {
      const res = await firstValueFrom(
        this.httpService.patch<T>(encodeURI(url), params.values, params.config),
      );
      return res.data;
    } catch (err) {
      throw this._handleErrorRequest(err, 'patch');
    }
  }
  /**
   * Request DELETE
   */
  async delete<T>(params: HeaderParameter): Promise<T> {
    this._handleSsl(params.config);
    const url = params.requestUrl(this.config.url);
    this.logRequest(params);
    try {
      const res = await firstValueFrom(
        this.httpService.delete<T>(encodeURI(url), params.config),
      );
      return res.data;
    } catch (err) {
      throw this._handleErrorRequest(err, 'delete');
    }
  }

  /**
   * Enable/disable ssl
   */
  public ssl(ssl: boolean) {
    this._useAgent = ssl;
  }

  /**
   * Enable/disable logs
   */
  set showLog(show: boolean) {
    this._showLog = show;
  }

  /**
   * Logs std
   */
  protected log(message: any) {
    if (this._showLog) {
      this.logger.log(message instanceof Error ? message.message : message);
    }
  }

  /**
   * Enable logs and disable ssl
   */
  public debugMode() {
    this._useAgent = false;
    this._showLog = true;
  }

  /**
   * Handle error request
   */
  private _handleErrorRequest(err: AxiosError, funcName: string) {
    //always show error
    if (err.isAxiosError && err.response) {
      const data = JSON.stringify(err.response.data);
      this.logger.error(
        `${funcName}: ${err.config.url} | ${err.message}| response: ${data}`,
      );
    } else {
      this.logger.error(`${funcName ?? ''}: ${err.message}`);
    }
    const hook = this['onHandleRequestError'];
    if (hook) {
      return hook(err);
    }
    return err;
  }

  /**
   * Disable SSL
   */
  private _handleSsl(config: AxiosRequestConfig) {
    if (this._useAgent === false) {
      // At request level
      const agent = new Agent({
        rejectUnauthorized: false,
      });
      config.httpsAgent = agent;
    }
  }
}
