import {
  ApiPaginatedResponse,
  RequestParamId,
  Roles,
} from '@common/decorators';
import { ApiDataResponse } from '@common/decorators/api-data-response.decorator';
import { ApiErrorResponse } from '@common/decorators/api-error-response.decorator';
import { IdParamDto, PageDto } from '@common/dto';
import { PageOptionsDto } from '@common/dto/page-options.dto';
import {
  ResponseErrorMessage,
  ResponseMessage,
} from '@common/interfaces/response-message';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { X_API_KEY } from '@shared/constants';
import { GetTaskDto, PostTaskDto, PutTaskDto } from './dto';

import { ITaskUsecase } from './interfaces/itask.usecase';
import { GetTaskModel } from './models/get-task.model';
import { DeleteTaskPipe, PostTaskPipe, PutTaskPipe } from './pipes';

@ApiSecurity(X_API_KEY)
@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private service: ITaskUsecase) {}

  /**
   * Get scope by id
   */
  @ApiPaginatedResponse({
    type: GetTaskModel,
    description: 'Task list',
  })
  @ApiErrorResponse()
  @ApiParam({ name: 'id', type: String, required: true })
  @Roles()
  @Get(':id')
  getTask(@Param('id') id: string) {
    return this.service.getTaskById(id);
  }

  /**
   * Get tasks
   *
   */
  @ApiPaginatedResponse({ type: GetTaskModel, description: 'List of tasks' })
  @ApiErrorResponse()
  @Roles()
  @Get()
  getTasks(
    @Query() paginator: PageOptionsDto,
    @Query() query: GetTaskDto,
  ): Promise<PageDto<GetTaskModel>> {
    return this.service.getTasks(query, paginator);
  }

  /**
   * Save task
   */

  @ApiDataResponse({
    status: HttpStatus.CREATED,
    type: ResponseMessage,
  })
  @ApiErrorResponse()
  @Roles()
  @Post()
  postTask(@Body(PostTaskPipe) body: PostTaskDto) {
    return this.service.postTask(body);
  }

  /**
   * Update task
   */
  @ApiDataResponse({
    status: HttpStatus.OK,
    description: 'OK',
    type: ResponseMessage,
  })
  @ApiDataResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid parameters',
    type: ResponseErrorMessage,
  })
  @ApiDataResponse({
    status: HttpStatus.BAD_GATEWAY,
    description: 'Invalid response',
    type: ResponseErrorMessage,
  })
  @ApiParam({ name: 'id', description: 'Task ID', type: String })
  @Roles()
  @Put(':id')
  putTask(
    @RequestParamId(IdParamDto)
    @Body(PutTaskPipe)
    body: PutTaskDto,
  ) {
    //here i dont need task id like decorator
    return this.service.putTask(body);
  }

  /**
   * Delete task
   */
  @ApiDataResponse({
    status: HttpStatus.OK,
    description: 'OK',
    type: ResponseMessage,
  })
  @ApiDataResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid parameters',
    type: ResponseErrorMessage,
  })
  @ApiDataResponse({
    status: HttpStatus.BAD_GATEWAY,
    description: 'Invalid response',
    type: ResponseErrorMessage,
  })
  @Delete(':id')
  @Roles()
  @ApiParam({ description: 'Task ID', name: 'id', type: String })
  deleteTask(@Param('id', DeleteTaskPipe) id: string) {
    return this.service.deleteTask(id);
  }
}
