import { IntegrationException } from '@common/exceptions/integration.exception';
import { Configuration } from '@infra/config/configuration';
import { HttpService } from '@nestjs/axios';
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BaseService } from '../../../core/base.service';
import { QueryParameter } from '../../../core/helpers';

import { OnHandleRequestError } from '../../../core/interfaces/hooks/on-handle-request-error.interface';
import { IComicUsecase } from './icomic.usecases';
import { Comic } from './models/comic.model';

/**
 * Marvel lib service
 */
@Injectable()
export class ComicService
  extends BaseService
  implements IComicUsecase, OnHandleRequestError
{
  constructor(httpService: HttpService) {
    super(Configuration.I.apiMarvel, httpService);
  }
  /**
   * Get comic by id
   */
  async getComicById(id: string): Promise<Comic> {
    const endpoint = `comics/${id}`;
    const params = new QueryParameter(endpoint);
    params.pushParam('apikey', this.config.token);
    return this.get<Comic>(params);
  }
  /**
   * Get comics by title
   */
  async getComics(title: string): Promise<Comic[]> {
    const endpoint = 'comics';
    const params = new QueryParameter(endpoint);
    params.pushParam('apikey', this.config.token);
    if (title) {
      params.pushParam('title', title);
    }
    return this.get<Comic[]>(params);
  }
  /**
   * Handle custom error request
   */
  onHandleRequestError(err: any): void {
    const res = err.response;
    if (res) {
      const status = res.status;
      const message = res.data.message;
      const error = [message ?? res.data];

      if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        if (message) {
          throw new IntegrationException(message, status);
        }
        throw new InternalServerErrorException(error);
      }
      //your handled here
    }
    throw err;
  }
}
