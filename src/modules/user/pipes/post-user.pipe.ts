import { BaseValidationPipe } from '@common/data/pipes/base-validation.pipe';
import { handleEntity } from '@global/index';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { USER_MESSAGES } from '../constants/user.const';
import { PostUserDto } from '../dto/post-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { GetUserDto } from './../dto/get-user.dto';
/**
 * Validate post user scope
 */
@Injectable({ scope: Scope.REQUEST })
export class PostUserPipe extends BaseValidationPipe {
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
    const users = await this.userRepository.findUsers({ cpf } as GetUserDto);
    //handle result
    if (users && users.length > 0) {
      handleEntity(USER_MESSAGES.USER_EXISTS);
    }
    return true;
  }

  override async transformData(data: PostUserDto) {
    //get cpf from header
    const header = this.request.headers as unknown;
    //transform data
    data.cpf = header['cpf'];
    return data;
  }
}
