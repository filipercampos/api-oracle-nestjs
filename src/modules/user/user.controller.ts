import {
  ResponseErrorMessage,
  ResponseMessage,
} from '@common/interfaces/response-message';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiCpfHeader } from '@shared/decorators/cpf.decorator';
import { CpfHeaderDto } from '@shared/dto';
import { GetUserDto } from './dto/get-user.dto';
import { PatchUserExpirationDto } from './dto/patch-user.dto';
import { PostUserDto } from './dto/post-user.dto';
import { IUserUsecase } from './interfaces/iuser-scope.usecase';
import { GetUserScopeModel } from './models/get-user.model';
import { PatchtUserPipe } from './pipes/patch-user.pipe';
import { PostUserPipe } from './pipes/post-user.pipe';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private service: IUserUsecase) {}

  /**
   * Get user'   */
  @ApiHeader({
    name: 'cpf',
    description: 'CPF user',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
    type: GetUserScopeModel,
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
  @Get()
  getScopes(
    @ApiCpfHeader(CpfHeaderDto)
    cpfHeader: CpfHeaderDto,
    @Query()
    query: GetUserDto,
  ) {
    //transf cpf header to query
    query.cpf = cpfHeader.cpf;
    return this.service.getUsers(query);
  }

  /**
   * Save user authorization scope
   */
  @ApiHeader({
    name: 'cpf',
    description: 'CPF user',
    required: true,
  })
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
  postUserScope(
    @ApiCpfHeader(CpfHeaderDto)
    @Body(PostUserPipe)
    body: PostUserDto,
  ) {
    return this.service.postUser(body);
  }

  /**
   * Update user's authorization scope
   */
  @ApiHeader({
    name: 'cpf',
    description: 'CPF user',
    required: true,
  })
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
  @Patch()
  patchUserScopes(
    @ApiCpfHeader(CpfHeaderDto)
    @Body(PatchtUserPipe)
    body: PatchUserExpirationDto,
  ) {
    return this.service.patchUser(body);
  }
}
