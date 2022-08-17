import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetHealthDto {
  @ApiProperty({
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  level: number;

  @ApiProperty({
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  status: number;
}
