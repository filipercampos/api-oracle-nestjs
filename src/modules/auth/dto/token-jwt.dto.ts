import { ApiProperty } from '@nestjs/swagger';

export class JwtTokenDto {
  @ApiProperty()
  token: string;
}
