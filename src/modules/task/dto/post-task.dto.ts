import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class PostTaskDto {
  @ApiProperty({ description: 'Task name invalid', required: true })
  name: string;

  @ApiProperty({ description: 'Task description invalid', required: true })
  description: string;

  @Type(() => Number)
  @IsInt({ message: 'User id invalid' })
  @ApiProperty({ required: false, type: Number })
  userId: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Complete true or false',
    type: Boolean,
    default: false,
  })
  done: boolean;
}
