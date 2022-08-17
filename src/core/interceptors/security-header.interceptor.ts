import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { Response as ExpressResponse } from 'express';

@Injectable()
export class SecurityHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const Response: ExpressResponse = context.switchToHttp().getResponse();

    Response.setHeader('Cache-Control', 'no-store');
    Response.setHeader('Content-Security-Policy', 'frame-ancestors none');
    Response.setHeader('X-Content-Type-Options', 'nosniff');
    Response.setHeader('X-Frame-Options', 'DENY');

    return next.handle();
  }
}
