import { ApiProperty } from '@nestjs/swagger';

/**
 * Response Task
 */
export class GetTaskModel {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  userId: number;
  @ApiProperty()
  done: boolean;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
