import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { PaginationQueryDto } from '@shared/dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
export const ApiPaginationHeader = createParamDecorator(
  async (data: any, ctx: ExecutionContext) => {
    // extract headers
    const headers = ctx.switchToHttp().getRequest().headers;
    const pagination = new PaginationQueryDto();
    pagination.page = headers['page'] as number;
    pagination.limit = headers['limit'] as number;
    pagination.paginate = headers['paginate'] as boolean;

    // Convert headers to DTO object
    const dto = plainToInstance(data, headers, {
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
        throw new BadRequestException('Paginator invalid');
      }
    }
    // return header dto object
    return dto;
  },
);
