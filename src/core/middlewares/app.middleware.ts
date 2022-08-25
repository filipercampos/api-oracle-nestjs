import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import {
  FilterExceptionInterceptor,
  SecurityHeaderInterceptor,
  TimeoutInterceptor,
} from 'src/core/interceptors';
import { SwaggerDoc } from '../../docs/swagger.doc';
/**
 * Initialize app middlewares
 * @param app Application
 */
export function initializeMiddlewares(app: INestApplication) {
  //application prefix
  //app.setGlobalPrefix('api'); ignore (internal app)
  //versioning
  app.enableVersioning();
  //filter error
  app.useGlobalFilters(new FilterExceptionInterceptor());
  //interceptor
  app.useGlobalInterceptors(
    new TimeoutInterceptor(),
    new SecurityHeaderInterceptor(),
  );
  //decorator validation request
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  //express parsing content request
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: false }));
  app.enableCors({ origin: '*' });
  //swagger docs
  new SwaggerDoc().setupDocs(app);
}
