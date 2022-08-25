import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { CpfCnpjUtil } from '@shared/utils/cpf-cnpj/cpf-cnpj.util';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
/**
 * Request in header cpf
 */
export const CpfHeader = createParamDecorator(
  async (data: any, ctx: ExecutionContext) => {
    // extract headers
    const headers = ctx.switchToHttp().getRequest().headers;
    const cpf = headers['cpf'] as string;

    if (!cpf) throw new BadRequestException('CPF obrigatório');

    if (cpf.length < 11)
      throw new BadRequestException('CPF deve conter 11 caracteres');

    if (!CpfCnpjUtil.isCpf(cpf)) {
      throw new BadRequestException('CPF inválido');
    }
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
        throw new BadRequestException('CPF inválido');
      }
    }
    // return header dto object
    return dto;
  },
);
