import { Public } from '@common/decorators/public.decorator';
import {
  ResponseErrorMessage,
  ResponseMessage,
} from '@common/interfaces/response-message';
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@Public()
@ApiTags('health')
@Controller(['health'])
export class HealthController {
  constructor(private service: HealthService) {}
  /**
   * Health check status
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
    type: ResponseMessage,
  })
  @ApiResponse({
    status: HttpStatus.REQUEST_TIMEOUT,
    description: 'Request timeout',
    type: ResponseErrorMessage,
  })
  @ApiResponse({
    status: HttpStatus.BAD_GATEWAY,
    description: 'No connection database',
    type: ResponseErrorMessage,
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Server off',
    type: ResponseErrorMessage,
  })
  @Get()
  getHealth() {
    return this.service.healthCheck();
  }
}
