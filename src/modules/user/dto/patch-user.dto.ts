import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, Length } from 'class-validator';
import { UserStatusEnum } from '../enums/user-status.enum';

export class PatchUserDto {
  @ApiProperty({ description: 'First name' })
  @Length(4, 100, { message: 'Name min 4 e max 100 characteres' })
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  lastName: string;

  @ApiProperty({ description: 'CPF' })
  cpf: string;

  @IsOptional()
  @IsEnum(UserStatusEnum, { message: 'Status invalid' })
  @ApiProperty({ description: 'Status', enum: UserStatusEnum, required: false })
  status: UserStatusEnum = UserStatusEnum.ENABLE;
}
