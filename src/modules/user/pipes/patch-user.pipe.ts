import { BaseValidationPipe } from '@common/data/pipes/base-validation.pipe';
import { handleEntity } from '@global/index';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { USER_MESSAGES } from '../constants/user.const';
import { PatchUserExpirationDto } from '../dto/patch-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

/**
 * Validate scope patch
 */
@Injectable({ scope: Scope.REQUEST })
export class PatchtUserPipe extends BaseValidationPipe {
  private user: UserEntity;
  constructor(
    @Inject(REQUEST) protected request: Request,
    private userRepository: UserRepository,
  ) {
    super(request);
  }
  async validate(_) {
    const header = this.request.headers as unknown;
    //get cpf from header
    const cpf = header['cpf'];
    //find user
    const user = await this.userRepository.findUsers(cpf);
    //handle result
    if (!user || user.length == 0) {
      handleEntity(USER_MESSAGES.USER_NOT_FOUND);
    }
    this.user = user[0];
    return true;
  }

  override async transformData(data: PatchUserExpirationDto) {
    data.user = this.user;
    return data;
  }
}
