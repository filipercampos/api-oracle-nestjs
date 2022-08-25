import { ApiHideProperty } from '@nestjs/swagger';
import { TaskEntity } from './../entities/task.entity';

export class PatchTaskExpirationDto {
  @ApiHideProperty()
  task: TaskEntity;
}
