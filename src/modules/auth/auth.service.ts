import { PostUserDto } from '@modules/user/dto/post-user.dto';
import { UserEntity } from '@modules/user/entities/user.entity';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ERROR_DEFAULT } from '@shared/constants';
import { BcryptUtil } from '@shared/utils/bcrypt.util';
import { UserService } from './../user/user.service';
import { JwtTokenDto } from './dto/token-jwt.dto';
import { UserDataAuthDto } from './dto/user-data-auth.dto';
import { IAuthUsecase } from './interfaces/iauth.usecase';

@Injectable()
export class AuthService implements IAuthUsecase {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * Authenticate user database and check password
   *
   * Password is removed from response
   */
  async authentication(
    username: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.userService.findByEmail(username);
    if (!user) {
      throw new UnprocessableEntityException('Email not found');
    }
    const hashPassword = await BcryptUtil.hash(password);
    const matching = await BcryptUtil.compare(password, hashPassword);
    if (!matching) {
      throw new UnprocessableEntityException('Wrong password');
    }
    // remove password from user
    // const { password, ...result } = user;
    delete user.password;
    return user;
  }

  /**
   * Generate JWT token
   */
  async signWithCredentials(user: UserEntity): Promise<JwtTokenDto> {
    const payload = {
      id: user.id,
      cpf: user.cpf,
      profile: user.profile,
    } as UserDataAuthDto;

    return {
      token: this.jwtService.sign(payload),
    };
  }

  /**
   * Save user
   */
  async saveUser(body: PostUserDto): Promise<JwtTokenDto> {
    //encrypt password
    const hashPassword = await BcryptUtil.hash(body.password);
    //set new password
    body.password = hashPassword;
    //save user
    const result = await this.userService.postUser(body);
    if (!result) {
      throw new Error(ERROR_DEFAULT);
    }
    const user = await this.userService.findByEmail(body.email);

    return this.signWithCredentials(user);
  }
}
