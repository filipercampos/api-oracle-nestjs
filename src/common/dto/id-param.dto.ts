import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class IdParamDto {
  @IsString({ message: 'ID must be string' })
  @ApiProperty({ required: false, type: String })
  @Expose({ name: 'id' })
  id: string;
}

export class IdParamNumberDto {
  @Type(() => Number)
  @IsInt({ message: 'ID must be number' })
  @ApiProperty({ required: false, type: Number })
  @Expose({ name: 'id' })
  id: string;
}
