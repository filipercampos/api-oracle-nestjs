import { BaseValidationPipe } from '@common/data/pipes/base-validation.pipe';
import { UserService } from '@modules/user/user.service';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PutTaskDto } from '../dto';

@Injectable()
export class PutTaskPipe extends BaseValidationPipe {
  constructor(
    @Inject(REQUEST) protected request: Request,
    private service: UserService,
  ) {
    super(request);
  }

  validate(body: PutTaskDto) {
    //find user
    return this.service.getUserById(body.userId);
  }

  transformData(data: PutTaskDto) {
    data.id = this.getParamsId() as string;
    return data;
  }
}
