import { FindOptionsWhere } from '@common/data/interfaces/find-options-where';
import { BaseOracleRepository } from '@common/data/oracle/base-oracle-repository';
import { Injectable } from '@nestjs/common';
import { ScopeEntity } from '../entities/scope.entity';
import { ScopeMapper } from '../mapper/scope.mapper';
import { ScopeMetadata, ScopeMetadataType } from './scope.metadata';

@Injectable()
export class ScopeRepository extends BaseOracleRepository<
  ScopeEntity,
  ScopeMetadataType
> {
  constructor() {
    super(new ScopeMetadata(), new ScopeMapper());
  }

  /**
   * Find scopes list with pagination
   */
  async findWithPagination(criteria: FindOptionsWhere<ScopeMetadataType>) {
    return super.find(criteria, {
      order: {
        field: 'SCP_NAM',
        direction: 'DESC',
      },
      paginate: {
        page: 1,
        limit: 10,
      },
    });
  }
}
