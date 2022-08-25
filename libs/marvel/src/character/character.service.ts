import { IntegrationException } from '@common/exceptions/integration.exception';
import { Configuration } from '@infra/config/configuration';
import { HttpService } from '@nestjs/axios';
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { OnHandleRequestError } from 'libs/core/interfaces/hooks/on-handle-request-error.interface';
import { BaseService } from '../../../core/base.service';
import { QueryParameter } from '../../../core/helpers';
import { ICharacterUsecase } from './icharacter.usecases';
import { Character } from './models/character.model';

/**
 * Marvel lib service
 */
@Injectable()
export class CharacterService
  extends BaseService
  implements ICharacterUsecase, OnHandleRequestError
{
  constructor(httpService: HttpService) {
    super(Configuration.I.apiMarvel, httpService);
  }
  /**
   * Get character by id
   */
  async getCharacterById(id: string): Promise<Character> {
    const endpoint = `characters/${id}`;
    const params = new QueryParameter(endpoint);
    params.pushParam('apikey', this.config.token);
    return this.get<Character>(params);
  }
  /**
   * Get character by id
   */
  async getCharacters(name: string): Promise<Character[]> {
    const endpoint = 'characters';
    const params = new QueryParameter(endpoint);
    if (name) {
      params.pushParam('name', name);
    }
    params.pushParam('apikey', this.config.token);
    return this.get<Character[]>(params);
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
