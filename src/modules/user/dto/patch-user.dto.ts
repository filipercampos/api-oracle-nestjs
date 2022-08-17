import { ApiHideProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class PatchUserExpirationDto {
  @ApiHideProperty()
  user: UserEntity;
}
