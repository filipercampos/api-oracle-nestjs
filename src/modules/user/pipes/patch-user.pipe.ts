import { BaseValidationPipe } from '@common/data/pipes/base-validation.pipe';
import { handleEntity } from '@global/index';
import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CpfCnpjUtil } from '@shared/utils/cpf-cnpj/cpf-cnpj.util';
import { Request } from 'express';
import { USER_MESSAGES } from '../constants/user.const';
import { PatchUserDto } from '../dto/patch-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { GetUserDto } from './../dto/get-user.dto';

/**
 * Validate scope patch
 */
@Injectable({ scope: Scope.REQUEST })
export class PatchUserPipe extends BaseValidationPipe {
  private user: UserEntity;
  constructor(
    @Inject(REQUEST) protected request: Request,
    private userRepository: UserRepository,
  ) {
    super(request);
  }
  async validate(body: PatchUserDto) {
    if (!CpfCnpjUtil.isCpf(body.cpf)) {
      throw new BadRequestException('CPF inválido');
    }
    //find user
    const user = await this.userRepository.findUsers({
      cpf: body.cpf,
    } as GetUserDto);
    //handle result
    if (!user || user.length == 0) {
      handleEntity(USER_MESSAGES.USER_NOT_FOUND);
    }
    return true;
  }
}
