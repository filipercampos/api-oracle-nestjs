import { ApiProperty } from '@nestjs/swagger';

/**
 * User data authentacaion
 */
export class UserDataAuthDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  cpf: string;
  @ApiProperty()
  profile: string;
}
