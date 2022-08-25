import { RedisService } from '@common/cache/redis/redis.service';
import { IS_PUBLIC_KEY } from '@common/decorators/public.decorator';
import { ROLES_KEY } from '@common/decorators/roles.decorator';
import { UserDataAuthDto } from '@modules/auth/dto';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProfileRoleEnum } from '@shared/roles/profile.role.enum';
import { Request } from 'express';
/**
 * Validate roles at route level
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger(AuthGuard.name);
  constructor(
    @Inject(RedisService)
    private readonly redisService: RedisService,
    @Inject(Reflector)
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    //validate roles
    const requiredRoles = this.reflector.getAllAndOverride<ProfileRoleEnum>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    //validate roles
    await this._handleRoles(request, requiredRoles);

    //validate request
    return this._handleRequest(request);
  }

  /**
   * Handle roles
   */
  private async _handleRoles(request: Request, roles: any): Promise<boolean> {
    //extract user from request
    const user = request.user as UserDataAuthDto;
    //validate system/admin role
    if (ProfileRoleEnum.ADMIN === user.profile) {
      return true;
    }
    //validate roles
    if (!roles) {
      this.logger.error('No roles found at ' + request.route.path);
      throw new ForbiddenException('Access denied for this route');
    }
    //validate route allow profile
    else if (!user.profile || !roles.includes(user.profile)) {
      throw new ForbiddenException('Acess denied for this user');
    }

    //allow route
    return true;
  }
  private _handleRequest(request: Request): boolean {
    //TODO validate request
    return true;
  }
}
