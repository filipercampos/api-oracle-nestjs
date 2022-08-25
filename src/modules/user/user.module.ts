import { TaskRepository } from './../task/repositories/task.repository';
import { Module } from '@nestjs/common';
import { IUserUsecase } from './interfaces/iuser.usecase';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [],
  providers: [
    UserService,
    {
      provide: IUserUsecase,
      useClass: UserService,
    },
    UserRepository,
    TaskRepository,
  ],
  exports: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
