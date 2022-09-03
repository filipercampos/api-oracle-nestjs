import { IntegrationException } from '@common/exceptions/integration.exception';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
@Catch()
export class FilterExceptionInterceptor implements ExceptionFilter {
  private readonly logger = new Logger(FilterExceptionInterceptor.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp() as HttpArgumentsHost;
    const response = ctx.getResponse() as Response;
    const request = ctx.getRequest() as Request;
    const isHttpException = exception instanceof HttpException;
    const status: number = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    let error: any = '';
    //handle message from response
    //because has more details
    if (isHttpException && exception.getResponse()) {
      const messageObject = exception.getResponse() ?? exception.message;
      error = '';
      if (messageObject['message']) {
        error = messageObject['message'];
      } else if (messageObject instanceof Array) {
        for (let i = 0; i < messageObject.length; i++) {
          let message = messageObject[i];
          message = message.split('.');

          const indexof = message.indexOf(message[message.length - 1]);
          if (i < messageObject.length - 1) {
            error += message[indexof] + '\n';
          } else {
            error += message[indexof];
          }
        }
      } else {
        error = messageObject;
      }
    } else if (exception.message) {
      error = exception.message;
    } else {
      //is string or else
      error = exception;
    }
    const statusLogger = [
      HttpStatus.REQUEST_TIMEOUT,
      HttpStatus.TOO_MANY_REQUESTS,
      HttpStatus.INTERNAL_SERVER_ERROR,
    ];
    let exceptionCode: number;
    if (statusLogger.includes(status) || status) {
      this.logger.error(
        `Request: ${request.url}, status: ${status}, error: ${JSON.stringify(
          error,
        )}`,
      );
    }
    if (status == HttpStatus.TOO_MANY_REQUESTS) {
      error = 'Too Many Requests';
    } else if (status == HttpStatus.INTERNAL_SERVER_ERROR) {
      if (exception instanceof IntegrationException) {
        error = exception.message;
        exceptionCode = exception.status;
      } else {
        exceptionCode = exception['response']?.status;
        error = 'Internal error';
      }
    }
    //log and response
    const data = {
      message: error,
      code: status,
      statusText: HttpStatus[status],
      log: 'Request failed at ' + new Date().toISOString(),
      path: request.originalUrl,
      exceptionCode: exceptionCode,
    };

    response.status(status).json({ data });
  }
}
