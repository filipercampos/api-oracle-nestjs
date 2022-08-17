import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsEnum, Length } from 'class-validator';
import { UserStatusEnum } from '../enums/user-status.enum';

export class GetUserDto {
  @ApiProperty()
  @Length(5, 100, { message: 'Name min 5 e max 100 characteres' })
  name: string;

  @IsEnum(UserStatusEnum, { message: 'Status inválido' })
  @ApiProperty({ enum: UserStatusEnum })
  status: UserStatusEnum;

  @ApiHideProperty()
  cpf: string;
}
