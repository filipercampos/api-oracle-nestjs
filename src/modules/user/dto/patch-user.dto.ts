import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Length } from 'class-validator';

export class PatchUserDto {
  @ApiProperty({ description: 'First name' })
  @Length(4, 100, { message: 'Name min 4 e max 100 characteres' })
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  lastName: string;

  @Length(11, 11, {
    message: 'CPF deve conter 11 caracteres',
  })
  @Expose({ name: 'cpf' })
  @ApiProperty({ description: 'CPF' })
  cpf: string;
}
