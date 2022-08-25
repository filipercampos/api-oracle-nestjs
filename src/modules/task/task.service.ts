import { OraclePaginationType } from '@common/data/interfaces/ioracle.parameter';
import { MessageDto, PageDto, PageMetaDto } from '@common/dto';
import { PageOptionsDto } from '@common/dto/page-options.dto';
import { handleEntity } from '@global';
import { Injectable } from '@nestjs/common';
import { ERROR_DEFAULT } from '@shared/constants';
import { TASK_MESSAGES } from './constants/task.const';
import { PutTaskDto } from './dto';
import { GetTaskDto } from './dto/get-task.dto';
import { PostTaskDto } from './dto/post-task.dto';
import { TaskEntity } from './entities/task.entity';
import { ITaskUsecase } from './interfaces/itask.usecase';

import { TaskRepository } from './repositories/task.repository';

@Injectable()
export class TaskService implements ITaskUsecase {
  constructor(private repository: TaskRepository) {}

  async getTaskById(id: string): Promise<TaskEntity> {
    const result = await this.repository.findById(id);
    if (!result) {
      handleEntity(TASK_MESSAGES.TASK_NOT_FOUND);
    }
    return result;
  }

  async getTasks(
    query: GetTaskDto,
    pageOptions: PageOptionsDto,
  ): Promise<PageDto<TaskEntity>> {
    const params = this.repository.createParams();
    if (query.name) {
      params.push(this.repository.createParam({ TSK_NAM: query.name }));
    }
    if (query.userId) {
      params.push(this.repository.createParam({ TSK_USU_ID: query.userId }));
    }
    if (query.done != undefined) {
      const status = query.done ? 1 : 0;
      params.push(this.repository.createParam({ TSK_STS: status }));
    }
    const { results, count } = await this.repository.findWithPagination(
      params,
      pageOptions as OraclePaginationType,
      {
        order: {
          field: 'TSK_CRT_AT',
        },
      },
    );

    const pageMetaDto = new PageMetaDto({ pageOptions, count });

    return new PageDto(results, pageMetaDto);
  }

  async postTask(body: PostTaskDto) {
    const mapper = this.repository.mapperEntity;
    const result = await this.repository.save(mapper.toPost(body));
    if (!result) {
      throw new Error(ERROR_DEFAULT);
    }
    return new MessageDto(TASK_MESSAGES.TASK_SAVE);
  }

  async putTask(body: PutTaskDto) {
    const data = this.repository.mapperEntity.toUpdate(body);
    const result = await this.repository.update(body.id, data);
    if (!result) {
      throw new Error(ERROR_DEFAULT);
    }
    return new MessageDto(TASK_MESSAGES.TASK_UPDATE);
  }

  async deleteTask(id: string) {
    const result = await this.repository.deleteById(id);
    if (!result) {
      throw new Error(ERROR_DEFAULT);
    }
    return new MessageDto(TASK_MESSAGES.TASK_REMOVE);
  }
}
