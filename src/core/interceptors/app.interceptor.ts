import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class AppInterceptor implements NestInterceptor {
  // private readonly logger = new Logger(LoggingInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //To handle request/response
    // const ctx = context.switchToHttp();
    // const request = ctx.getRequest<Request>();
    //  const response = ctx.getResponse() as Response;
    // next.handle();

    //handle response
    return next.handle().pipe(
      map((data) => {
        //response default key is data
        //Example
        //{ data: any }
        if (data?.data) {
          return data;
        } else if (data instanceof String) {
          data = { message: data }; //default message
        } else if (data instanceof Array) {
          data = { results: data }; //default results
        }
        //get data
        return { data };
      }),
    );
  }
}
