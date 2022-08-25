import { MessageDto } from '@common/dto';
import { PostUserDto } from '@modules/user/dto/post-user.dto';
import { UserEntity } from '@modules/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { JwtTokenDto } from '../dto';

@Injectable()
export abstract class IAuthUsecase {
  /**
   * Get user's
   */
  abstract authentication(
    username: string,
    password: string,
  ): Promise<UserEntity>;

  /**
   * Get user token JWT
   */
  abstract signWithCredentials(body: UserEntity): Promise<JwtTokenDto>;

  /**
   * Save user's data
   */
  abstract saveUser(body: PostUserDto): Promise<MessageDto>;
}
