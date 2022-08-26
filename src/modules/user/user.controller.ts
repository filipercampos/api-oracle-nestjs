import { ApiPaginatedResponse } from '@common/decorators';
import { ApiDataResponse } from '@common/decorators/api-data-response.decorator';
import { ApiErrorResponse } from '@common/decorators/api-error-response.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { ResponseMessage } from '@common/interfaces/response-message';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { X_API_KEY } from '@shared/constants';
import { ProfileRoleEnum } from '@shared/roles/profile.role.enum';
import { GetUserDto, PatchUserDto } from './dto';
import { IUserUsecase } from './interfaces/iuser.usecase';
import { GetUserModel } from './models/get-user.model';
import { PatchUserPipe } from './pipes/patch-user.pipe';

@ApiSecurity(X_API_KEY)
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private service: IUserUsecase) {}

  /**
   * Get user
   */
  @ApiPaginatedResponse({
    description: 'User data',
    type: GetUserModel,
  })
  @ApiErrorResponse()
  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.service.getUserById(id);
  }

  /**
   * Get users
   *
   * Required admin role
   */
  @ApiPaginatedResponse({
    description: 'OK',
    type: GetUserModel,
  })
  @ApiErrorResponse()
  @Roles(ProfileRoleEnum.ADMIN)
  // @UseGuards(JwtAuthGuard) is global
  @Get()
  getUsers(@Query() query: GetUserDto) {
    return this.service.getUsers(query);
  }

  /**
   * Update user's data
   */
  @ApiDataResponse({
    status: HttpStatus.OK,
    description: 'OK',
    type: ResponseMessage,
  })
  @ApiErrorResponse()
  @Patch()
  patchUser(@Body(PatchUserPipe) body: PatchUserDto) {
    return this.service.patchUser(body);
  }
}
