import { BaseOracleRepository } from '@common/data/oracle/base-oracle-repository';
import { Injectable } from '@nestjs/common';
import { TaskEntity } from '../entities/task.entity';
import { TaskMapper } from '../mapper/task.mapper';
import { TaskMetadata, TaskMetadataType } from './task.metadata';

@Injectable()
export class TaskRepository extends BaseOracleRepository<
  TaskEntity,
  TaskMetadataType
> {
  constructor() {
    super(new TaskMetadata(), new TaskMapper());
  }
}
