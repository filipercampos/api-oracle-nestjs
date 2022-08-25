import { ApiPaginatedResponse, RequestParamId } from '@common/decorators';
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
import { ApiParam, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
    type: GetTaskModel,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid parameters',
    type: ResponseErrorMessage,
  })
  @ApiResponse({
    status: HttpStatus.BAD_GATEWAY,
    description: 'Invalid response',
    type: ResponseErrorMessage,
  })
  @Get(':id')
  @ApiParam({ name: 'id', type: String, required: true })
  getTask(@Param('id') id: string) {
    return this.service.getTaskById(id);
  }

  /**
   * Get tasks
   *
   */
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid parameters',
    type: ResponseErrorMessage,
  })
  @ApiResponse({
    status: HttpStatus.BAD_GATEWAY,
    description: 'Invalid response',
    type: ResponseErrorMessage,
  })
  @ApiPaginatedResponse({ model: GetTaskModel, description: 'List of tasks' })
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

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
    type: ResponseMessage,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid parameters',
    type: ResponseErrorMessage,
  })
  @ApiResponse({
    status: HttpStatus.BAD_GATEWAY,
    description: 'Invalid response',
    type: ResponseErrorMessage,
  })
  @Post()
  postTask(@Body(PostTaskPipe) body: PostTaskDto) {
    return this.service.postTask(body);
  }

  /**
   * Update task
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
    type: ResponseMessage,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid parameters',
    type: ResponseErrorMessage,
  })
  @ApiResponse({
    status: HttpStatus.BAD_GATEWAY,
    description: 'Invalid response',
    type: ResponseErrorMessage,
  })
  @ApiParam({ name: 'id', description: 'Task ID', type: String })
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
   * Update task
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
    type: ResponseMessage,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid parameters',
    type: ResponseErrorMessage,
  })
  @ApiResponse({
    status: HttpStatus.BAD_GATEWAY,
    description: 'Invalid response',
    type: ResponseErrorMessage,
  })
  @Delete(':id')
  @ApiParam({ description: 'Task ID', name: 'id', type: String })
  deleteTask(@Param('id', DeleteTaskPipe) id: string) {
    return this.service.deleteTask(id);
  }
}
