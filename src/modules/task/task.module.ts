import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { ITaskUsecase } from './interfaces/itask.usecase';
import { TaskRepository } from './repositories/task.repository';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  controllers: [TaskController],
  imports: [UserModule],
  providers: [
    TaskService,
    {
      provide: ITaskUsecase,
      useClass: TaskService,
    },
    TaskRepository,
  ],
  exports: [
    TaskService,
    {
      provide: ITaskUsecase,
      useClass: TaskService,
    },
    TaskRepository,
  ],
})
export class TaskModule {}
