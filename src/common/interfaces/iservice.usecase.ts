import { Injectable } from '@nestjs/common';
import { MessageDto } from '@common/dto';
@Injectable()
export abstract class IServiceGetByIdUsecase<T> {
  /**
   * Get item by id
   */
  abstract getById(id: string): Promise<T>;
}

@Injectable()
export abstract class IServiceFindUsecase<T> {
  /**
   * Get items
   */
  abstract find<E>(query: E): Promise<T[]>;
}

@Injectable()
export abstract class IServiceSaveUsecase {
  /**
   * Save data
   */
  abstract save<E>(body: E): Promise<MessageDto>;
}

@Injectable()
export abstract class IServiceUpdateUsecase {
  /**
   * Update data
   */
  abstract update<E>(id: string | number, body: E): Promise<MessageDto>;
}

@Injectable()
export abstract class IServiceDeleteUsecase {
  /**
   * Delete data by id
   */
  abstract delete(id: string): Promise<MessageDto>;
}

export type IServiceUsecaseType = IServiceGetByIdUsecase<any> &
  IServiceFindUsecase<any> &
  IServiceSaveUsecase &
  IServiceUpdateUsecase &
  IServiceDeleteUsecase;

@Injectable()
export abstract class IServiceUsecase<T>
  implements
    IServiceGetByIdUsecase<T>,
    IServiceFindUsecase<T>,
    IServiceSaveUsecase,
    IServiceUpdateUsecase,
    IServiceDeleteUsecase
{
  /**
   * Get item by id
   */
  abstract getById(id: string): Promise<T>;

  /**
   * Get items
   */
  abstract find<E>(query: E): Promise<T[]>;

  /**
   * Save data
   */
  abstract save<E>(body: E): Promise<MessageDto>;

  /**
   * Update data
   */
  abstract update<E>(id: string | number, body: E): Promise<MessageDto>;

  /**
   * Delete data by id
   */
  abstract delete(id: string): Promise<MessageDto>;
}
