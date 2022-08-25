import { BaseValidationPipe } from '@common/data/pipes/base-validation.pipe';
import { UserService } from '@modules/user/user.service';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PostTaskDto } from '../dto/post-task.dto';

@Injectable()
export class PostTaskPipe extends BaseValidationPipe {
  constructor(
    @Inject(REQUEST) protected request: Request,
    private service: UserService,
  ) {
    super(request);
  }

  validate(body: PostTaskDto) {
    //find user
    return this.service.getUserById(body.userId);
  }
}
