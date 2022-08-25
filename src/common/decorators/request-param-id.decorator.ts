import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';

/**
 * RequestHeader decorator
 */
export const RequestParamId = createParamDecorator(
  async (value: any, ctx: ExecutionContext) => {
    // extract params
    const params = ctx.switchToHttp().getRequest().params;
    // Convert params to DTO object
    const plainInstance = plainToInstance(value, params, {
      excludeExtraneousValues: true,
    });
    if (plainInstance['id'] === ':id') {
      throw new BadRequestException('ID is required in path');
    }
    // Validate
    try {
      await validateOrReject(plainInstance);
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
    return plainInstance;
  },
);
