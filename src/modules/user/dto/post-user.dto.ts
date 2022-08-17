import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class PostUserDto {
  @ApiProperty({ description: 'User name' })
  @Length(5, 100, { message: 'Name min 5 e max 100 characteres' })
  name: string;

  @ApiHideProperty()
  cpf: string;

  @ApiHideProperty()
  user: any;
}
