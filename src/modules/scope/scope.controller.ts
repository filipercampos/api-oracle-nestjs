import {
  ResponseErrorMessage,
  ResponseMessage,
} from '@common/interfaces/response-message';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetScopeDto } from './dto/get-scope.dto';
import { PostScopeDto } from './dto/post-scope.dto';
import { ScopeEntity } from './entities/scope.entity';
import { IScopeUsecase } from './interfaces/iscope.usecase';
import { GetScopeModel } from './models/get-scope.model';
import { PostScopePipe } from './pipes/post-scope.pipe';

@ApiTags('scopes')
@Controller('scopes')
export class ScopeController {
  constructor(private service: IScopeUsecase) {}

  /**
   * Get scope by id
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
    type: ScopeEntity,
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
  getScope(@Param('id') id: string) {
    return this.service.getScopeById(id);
  }

  /**
   * Get scopes
   *
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
    type: GetScopeModel,
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
  @ApiQuery({ name: 'name', type: String, required: false })
  @ApiQuery({ name: 'parent', type: Number, required: false })
  @Get()
  getScopes(@Query() query: GetScopeDto) {
    return this.service.getScopes(query);
  }

  /**
   * Save scope
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
  postUserScope(@Body(PostScopePipe) body: PostScopeDto) {
    return this.service.postScope(body);
  }
}
