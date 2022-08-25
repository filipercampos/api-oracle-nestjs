import { MessageDto, PageDto } from '@common/dto';
import { PageOptionsDto } from '@common/dto/page-options.dto';
import { Injectable } from '@nestjs/common';
import { GetTaskDto, PostTaskDto, PutTaskDto } from '../dto';
import { GetTaskModel } from '../models/get-task.model';

@Injectable()
export abstract class ITaskUsecase {
  /**
   * Get task by id
   */
  abstract getTaskById(id: string): Promise<GetTaskModel>;

  /**
   * Get tasks
   */
  abstract getTasks(
    query: GetTaskDto,
    pagination?: PageOptionsDto,
  ): Promise<PageDto<GetTaskModel>>;

  /**
   * Save task
   */
  abstract postTask(body: PostTaskDto): Promise<MessageDto>;

  /**
   * Update task
   */
  abstract putTask(body: PutTaskDto): Promise<MessageDto>;

  /**
   * Delete task
   */
  abstract deleteTask(id: string): Promise<MessageDto>;
}
