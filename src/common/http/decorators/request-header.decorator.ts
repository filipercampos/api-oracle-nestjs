import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';

export const RequestHeader = createParamDecorator(
  async (value: any, ctx: ExecutionContext) => {
    // extract headers
    const headers = ctx.switchToHttp().getRequest().headers;
    // Convert headers to DTO object
    const dto = plainToInstance(value, headers, {
      excludeExtraneousValues: true,
    });
    // Validate
    try {
      await validateOrReject(dto);
    } catch (e) {
      if (Array.isArray(e) && e.some((x) => x instanceof ValidationError)) {
        let errorArr = [];
        e.forEach((err: ValidationError) => {
          errorArr = Object.keys(err.constraints).reduce((acc, curr) => {
            acc.push(err.constraints[curr]);
            return acc;
          }, errorArr);
        });
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: errorArr,
          error: 'Bad Request',
        });
      } else {
        throw new BadRequestException();
      }
    }
    // return header dto object
    return dto;
  },
);
