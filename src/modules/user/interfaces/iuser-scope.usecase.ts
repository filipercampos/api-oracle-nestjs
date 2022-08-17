import { Injectable } from '@nestjs/common';
import { MessageDto } from '@shared/dto';
import { GetUserDto } from '../dto/get-user.dto';
import { PatchUserExpirationDto } from '../dto/patch-user.dto';
import { PostUserDto } from '../dto/post-user.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export abstract class IUserUsecase {
  /**
   * Get user's
   */
  abstract getUsers(query: GetUserDto): Promise<UserEntity[]>;

  /**
   * Update user's data
   */
  abstract patchUser(body: PatchUserExpirationDto): Promise<MessageDto>;

  /**
   * Save user's data
   */
  abstract postUser(body: PostUserDto): Promise<MessageDto>;
}
