import { handleEntity } from '@global';
import { Injectable } from '@nestjs/common';
import { ERROR_DEFAULT } from '@shared/constants';
import { MessageDto } from '@shared/dto';
import { SCOPE_MESSAGES } from './constants/scope.const';
import { GetScopeDto } from './dto/get-scope.dto';
import { PostScopeDto } from './dto/post-scope.dto';
import { ScopeEntity } from './entities/scope.entity';
import { IScopeUsecase } from './interfaces/iscope.usecase';

import { ScopeRepository } from './repositories/scope.repository';

@Injectable()
export class ScopeService implements IScopeUsecase {
  constructor(private repository: ScopeRepository) {}

  async getScopeById(id: string): Promise<ScopeEntity> {
    const result = await this.repository.findById(id);
    if (!result) {
      handleEntity(SCOPE_MESSAGES.SCOPE_NOT_FOUND);
    }
    return result;
  }

  getScopes(query: GetScopeDto): Promise<ScopeEntity[]> {
    const params = this.repository.createParams();
    if (query.name) {
      params.push(this.repository.createParam({ SCP_NAM: query.name }));
    }
    return this.repository.find(params);
  }

  async postScope(body: PostScopeDto) {
    const mapper = this.repository.mapperEntity;
    const result = await this.repository.save(mapper.toPost(body));
    if (!result) {
      throw new Error(ERROR_DEFAULT);
    }
    return new MessageDto(SCOPE_MESSAGES.SCOPE_SAVE);
  }

  async deleteScope(id: string) {
    const result = await this.repository.deleteById(id);
    if (!result) {
      throw new Error(ERROR_DEFAULT);
    }
    return new MessageDto(SCOPE_MESSAGES.SCOPE_REMOVE);
  }
}
