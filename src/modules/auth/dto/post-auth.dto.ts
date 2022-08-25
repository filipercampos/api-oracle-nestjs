import { ApiProperty } from '@nestjs/swagger';

export class PostAuthDto {
  @ApiProperty({ description: 'Email', required: true })
  username: string;
  @ApiProperty({ description: 'Password', required: true })
  password: string;
}
