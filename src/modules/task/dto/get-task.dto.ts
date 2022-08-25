import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class GetTaskDto {
  @IsOptional()
  @IsString({ message: 'Task name invalid' })
  @ApiProperty({ description: 'Task name', required: false })
  name: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'User id invalid' })
  @ApiProperty({ description: 'User Task ID', required: false, type: Number })
  userId: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, description: 'Task Status', type: Boolean })
  done: boolean;
}
