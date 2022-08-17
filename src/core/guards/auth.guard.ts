import { RedisService } from '@common/cache/redis/redis.service';
import { PublicRouteRole } from '@common/http/enums/public-route-role.enum';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(RedisService)
    private readonly redisService: RedisService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    return this._handleRequest(request);
  }

  private _handleRequest(request: Request): boolean {
    //TODO validate request
    if (request.route.includes(PublicRouteRole.isPublicRoute)) {
      return true;
    }
    return false;
  }
}
