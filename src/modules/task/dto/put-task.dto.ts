import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class PutTaskDto {
  @ApiHideProperty()
  id: string;

  @ApiProperty({ description: 'Task name invalid', required: true })
  name: string;

  @ApiProperty({ description: 'Task description invalid', required: true })
  description: string;

  @ApiProperty({ description: 'User to be authorizated', required: true })
  userId: number;

  @IsBoolean()
  @ApiProperty({ description: 'Complete true or false', type: Boolean })
  done: boolean;
}
