import { BaseValidationPipe } from '@common/data/pipes/base-validation.pipe';
import { handleEntity } from '@global/index';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { TASK_MESSAGES } from '../constants/task.const';
import { TaskRepository } from '../repositories/task.repository';

@Injectable()
export class DeleteTaskPipe extends BaseValidationPipe {
  constructor(
    @Inject(REQUEST) protected request: Request,
    private repository: TaskRepository,
  ) {
    super(request);
  }

  async validate(id: string) {
    //find task
    const result = await this.repository.findById(id);
    //handle result
    if (!result) {
      handleEntity(`'${id}' ${TASK_MESSAGES.TASK_NOT_FOUND}`);
    }
    return true;
  }
}
