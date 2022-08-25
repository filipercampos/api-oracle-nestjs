import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, Length } from 'class-validator';

export class CpfHeaderDto {
  @IsDefined({ message: 'CPF obrigatório' })
  @Length(11, 11, {
    message: 'CPF deve conter 11 caracteres',
  })
  @ApiProperty()
  @Expose({ name: 'cpf' })
  cpf: string;
}
