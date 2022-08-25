import { Injectable } from '@nestjs/common';
import { MessageDto } from '@common/dto';
import { GetUserDto } from '../dto/get-user.dto';
import { PatchUserDto } from '../dto/patch-user.dto';
import { PostUserDto } from '../dto/post-user.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export abstract class IUserUsecase {
  /**
   * Get user
   */
  abstract getUserById(id: number): Promise<UserEntity>;

  /**
   * Get user's
   */
  abstract getUsers(query: GetUserDto): Promise<UserEntity[]>;

  /**
   * Update user's data
   */
  abstract patchUser(body: PatchUserDto): Promise<MessageDto>;

  /**
   * Save user's data
   */
  abstract postUser(body: PostUserDto): Promise<MessageDto>;
}
