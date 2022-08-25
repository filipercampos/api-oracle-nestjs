import { Roles } from '@common/decorators/roles.decorator';
import {
  ResponseErrorMessage,
  ResponseMessage,
} from '@common/interfaces/response-message';
import { UserEntity } from '@modules/user/entities/user.entity';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ProfileRoleEnum } from '@shared/roles/profile.role.enum';
import { X_API_KEY } from './../../shared/constants';
import { GetUserDto, PatchUserDto } from './dto';
import { IUserUsecase } from './interfaces/iuser.usecase';
import { PatchUserPipe } from './pipes/patch-user.pipe';

@ApiSecurity(X_API_KEY)
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private service: IUserUsecase) {}

  /**
   * Get user
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
    type: UserEntity,
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
  getUserById(@Param('id') id: number) {
    return this.service.getUserById(id);
  }

  /**
   * Get users
   *
   * Required admin role
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
    type: [UserEntity],
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
  @Roles(ProfileRoleEnum.ADMIN)
  // @UseGuards(JwtAuthGuard) is global
  @Get()
  getUsers(@Query() query: GetUserDto) {
    return this.service.getUsers(query);
  }

  /**
   * Update user's data
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
  @Patch()
  patchUserScopes(@Body(PatchUserPipe) body: PatchUserDto) {
    return this.service.patchUser(body);
  }
}
