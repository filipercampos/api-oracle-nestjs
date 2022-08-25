import { RedisService } from '@common/cache/redis/redis.service';
import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ERROR_DEFAULT } from '@shared/constants';
import { MessageDto } from '@common/dto';
import { CryptoUtil } from '@shared/utils/crypto.util';
import { TaskRepository } from './../task/repositories/task.repository';
import { USER_MESSAGES } from './constants/user.const';
import { GetUserDto } from './dto/get-user.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { PostUserDto } from './dto/post-user.dto';
import { UserEntity } from './entities/user.entity';
import { IUserUsecase } from './interfaces/iuser.usecase';
import { UserRepository } from './repositories/user.repository';
@Injectable()
export class UserService implements IUserUsecase {
  constructor(
    private repository: UserRepository,
    private taskRepository: TaskRepository,
    private redisService: RedisService,
  ) {}

  async getUserById(id: number): Promise<UserEntity> {
    //get user by email
    const result = await this.repository.findById(id);
    //check has data
    if (result) {
      result.password = undefined;
      try {
        result.tasks = await this.taskRepository.find({
          TSK_USU_ID: result.id,
        });
      } catch (err) {}
      return result;
    }
    throw new UnprocessableEntityException('User not found');
  }
  /**
   * Get user by email
   */
  async findByEmail(email: string): Promise<UserEntity> {
    //cache primary
    const cache: UserEntity = await this.redisService.get(email);
    // exists cache
    if (cache) {
      //get users on cache
      return cache;
    }
    //get user by email
    const users = await this.repository.findUsers({ email } as GetUserDto);
    //check has data
    if (users.length > 0) {
      //save cache
      await this.redisService.save(email, users[0]);
      //get user data
      return users[0];
    }
    return null;
  }

  /**
   * Get user by CPF
   */
  async findByCpf(cpf: string): Promise<UserEntity> {
    //cpf encrypted
    const redisKey = CryptoUtil.hashSha256(cpf).toUpperCase();
    //cache primary
    const cache: UserEntity = await this.redisService.get(redisKey);
    // exists cache
    if (cache) {
      //get users on cache
      return cache;
    }
    //get user by cpf
    const users = await this.repository.findUsers({ cpf } as GetUserDto);
    //check has data
    if (users.length > 0) {
      //save cache
      await this.redisService.save(redisKey, users[0]);
      //get user data
      return users[0];
    }
    return null;
  }

  /**
   * Get users from query
   */
  getUsers(query: GetUserDto): Promise<UserEntity[]> {
    if (Object.keys(query).length == 0)
      throw new BadRequestException('At least one parameter must be provided');
    //exec query to find users
    return this.repository.findUsers(query);
  }

  /**
   * Save user
   */
  async postUser(body: PostUserDto) {
    //save scopes
    const result = await this.repository.saveUser(body);
    if (!result) {
      throw new Error(ERROR_DEFAULT);
    }
    return new MessageDto(USER_MESSAGES.USER_SAVE);
  }

  /**
   * Update user
   */
  async patchUser(body: PatchUserDto) {
    //update user data
    const result = await this.repository.patchUser(body);
    if (!result) {
      throw new Error(ERROR_DEFAULT);
    }
    return new MessageDto(USER_MESSAGES.USER_UPDATE);
  }
}
