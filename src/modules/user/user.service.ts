import { RedisService } from '@common/cache/redis/redis.service';
import { Injectable } from '@nestjs/common';
import { ERROR_DEFAULT } from '@shared/constants';
import { MessageDto } from '@shared/dto';
import { CryptoUtil } from '@shared/utils/crypto.util';
import { USER_MESSAGES } from './constants/user.const';
import { GetUserDto } from './dto/get-user.dto';
import { PatchUserExpirationDto } from './dto/patch-user.dto';
import { PostUserDto } from './dto/post-user.dto';
import { UserEntity } from './entities/user.entity';
import { IUserUsecase } from './interfaces/iuser-scope.usecase';
import { UserRepository } from './repositories/user.repository';
@Injectable()
export class UserService implements IUserUsecase {
  constructor(
    private repository: UserRepository,
    private redisService: RedisService,
  ) {}

  async getUsers(query: GetUserDto): Promise<UserEntity[]> {
    //cpf encrypted
    const redisKey = CryptoUtil.hashSha256(query.cpf).toUpperCase();
    //cache primary
    const cache: UserEntity[] = await this.redisService.get(redisKey);
    // exists cache
    if (cache) {
      //get scopes
      return cache;
    }

    //get scopes for access cpf
    const users = await this.repository.findUsers(query);

    if (users && users.length > 0) {
      //save cache
      await this.redisService.save(redisKey, users);
    }
    return users;
  }

  async patchUser(body: PatchUserExpirationDto) {
    //update scope
    const result = await this.repository.patchExpiration(body);
    if (!result) {
      throw new Error(ERROR_DEFAULT);
    }
    return new MessageDto(USER_MESSAGES.USER_UPDATE);
  }

  async postUser(body: PostUserDto) {
    //save scopes
    const result = await this.repository.saveUser(body);
    if (!result) {
      throw new Error(ERROR_DEFAULT);
    }
    return new MessageDto(USER_MESSAGES.USER_SAVE);
  }
}
