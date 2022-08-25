import { Public } from '@common/decorators/public.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { ResponseErrorMessage } from '@common/interfaces/response-message';
import { PostUserDto } from '@modules/user/dto/post-user.dto';
import { PostUserPipe } from '@modules/user/pipes/post-user.pipe';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CpfHeader } from '@shared/decorators/cpf.decorator';
import { CpfHeaderDto } from '@shared/dto';
import { ProfileRoleEnum } from '@shared/roles/profile.role.enum';
import { ResponseMessage } from './../../common/interfaces/response-message';
import { X_API_KEY } from './../../shared/constants';
import { PostAuthDto } from './dto/post-auth.dto';
import { JwtTokenDto } from './dto/token-jwt.dto';
import { UserDataAuthDto } from './dto/user-data-auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { IAuthUsecase } from './interfaces/iauth.usecase';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private service: IAuthUsecase) {}

  /**
   * Authentication and get token
   * */
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'CREATED',
    type: JwtTokenDto,
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
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('token')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async accessToken(@Request() req, @Body() body: PostAuthDto) {
    return this.service.signWithCredentials(req.user);
  }

  /**
   * Refresh token
   * */
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'CREATED',
    type: JwtTokenDto,
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
  @Public()
  @Post('refresh-token')
  async refreshToken(@Request() req: Request) {
    return this.service.signWithCredentials(req.headers[X_API_KEY]);
  }

  /**
   * Save user
   * */
  @ApiHeader({
    name: 'cpf',
    description: 'CPF user',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'CREATED',
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
  @Public()
  @Post('register')
  register(
    @CpfHeader(CpfHeaderDto)
    @Body(PostUserPipe)
    body: PostUserDto,
  ) {
    return this.service.saveUser(body);
  }
  /**
   * Data information from user authenticated
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
    type: UserDataAuthDto,
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
  @Get('/info')
  @Roles(ProfileRoleEnum.DEFAULT)
  getUserInfo(@Request() req) {
    return req.user;
  }
}
