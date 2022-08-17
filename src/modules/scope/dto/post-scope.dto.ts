import { ApiProperty } from '@nestjs/swagger';

export class PostScopeDto {
  @ApiProperty({ description: 'Scope name invalid' })
  name: string;

  @ApiProperty({ description: 'Scope description invalid' })
  description: string;
}
