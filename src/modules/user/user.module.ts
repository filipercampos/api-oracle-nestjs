import { ScopeRepository } from '@modules/scope/repositories/scope.repository';
import { Module } from '@nestjs/common';
import { IUserUsecase } from './interfaces/iuser-scope.usecase';
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
    ScopeRepository,
  ],
  controllers: [UserController],
})
export class UserModule {}
