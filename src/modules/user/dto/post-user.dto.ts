import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ProfileRoleEnum } from '@shared/roles/profile.role.enum';
import { IsEmail, IsEnum, Length } from 'class-validator';

export class PostUserDto {
  @ApiProperty({ description: 'First name' })
  @Length(4, 100, { message: 'Name min 4 e max 100 characteres' })
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  lastName: string;

  @ApiProperty({ required: true })
  @IsEmail({ message: 'Email is not valid' })
  email: string;

  @ApiProperty({ description: 'Password' })
  @Length(4, 32, { message: 'Password must be min 4 e max 32 characteres' })
  password: string;

  @IsEnum(ProfileRoleEnum, { message: 'Profile invalid' })
  @ApiProperty({ enum: ProfileRoleEnum, required: true })
  profile: ProfileRoleEnum;

  @ApiHideProperty()
  cpf: string;

  @ApiHideProperty()
  user: any;
}
