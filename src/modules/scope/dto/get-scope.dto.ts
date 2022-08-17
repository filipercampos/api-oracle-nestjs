import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class GetScopeDto {
  @IsOptional()
  @IsString({ message: 'Scope invalid' })
  @ApiProperty({ required: false })
  name: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Invalid parent id' })
  @ApiProperty({ required: false, type: Number })
  parent: number;
}
