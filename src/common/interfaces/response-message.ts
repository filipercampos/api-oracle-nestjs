import { ApiProperty } from '@nestjs/swagger';

/**
 * Reponse error api
 */
export class ResponseErrorMessage {
  @ApiProperty()
  data: {
    message: string[];
    status: number;
    statusText: string;
    log: string;
    path: string;
  };
}

/**
 * Reponse message api
 */
export class ResponseMessage {
  @ApiProperty()
  data: {
    message: string;
  };
}
