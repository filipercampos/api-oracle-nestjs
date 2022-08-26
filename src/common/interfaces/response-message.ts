import { ApiProperty } from '@nestjs/swagger';

/**
 * Reponse error api
 */
export class ResponseErrorMessage {
  @ApiProperty()
  message: string[];
  @ApiProperty()
  status: number;
  @ApiProperty()
  statusText: string;
  @ApiProperty()
  log: string;
  @ApiProperty()
  path: string;
}

/**
 * Reponse message api
 */
export class ResponseMessage {
  @ApiProperty()
  message: string;
}
