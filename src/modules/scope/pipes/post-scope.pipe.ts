import { BaseValidationPipe } from '@common/data/pipes/base-validation.pipe';
import { handleEntity } from '@global/index';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { SCOPE_MESSAGES } from '../constants/scope.const';
import { PostScopeDto } from '../dto/post-scope.dto';
import { ScopeRepository } from '../repositories/scope.repository';

@Injectable({ scope: Scope.REQUEST })
export class PostScopePipe extends BaseValidationPipe {
  constructor(
    @Inject(REQUEST) protected request: Request,
    private repository: ScopeRepository,
  ) {
    super(request);
  }

  async validate(body: PostScopeDto) {
    //find scopes
    const scopes = await this.repository.find({
      SCP_NAM: body.name,
    });
    //handle result
    if (scopes?.length > 0) {
      handleEntity(`'${body.name}' ${SCOPE_MESSAGES.SCOPE_EXISTS}`);
    }
    return true;
  }
}
