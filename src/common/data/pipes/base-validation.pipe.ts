import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
/**
 * Base pipe validation
 */
@Injectable({ scope: Scope.REQUEST })
export abstract class BaseValidationPipe implements PipeTransform<any> {
  constructor(@Inject(REQUEST) protected request: Request) {}
  /**
   * Validate
   */
  abstract validate(data: any): any;

  /**
   * Handle data
   */
  transformData(data: any): any {
    return data;
  }

  /**
   * Transform data
   */
  async transform(value: any, metadata: ArgumentMetadata) {
    //check body
    if (value instanceof Object && this.isEmpty(value)) {
      throw new BadRequestException(`Validation failed: No Body provided`);
    }
    //validate
    await this.validate(value);
    //transform
    await this.transformData(value);
    //handle default
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errorsList = await validate(object);
    if (errorsList.length > 0) {
      const message = [];
      for (const error of errorsList) {
        const errorsObject = error.constraints;
        const { isNotEmpty } = errorsObject;
        if (isNotEmpty) {
          const parameter = isNotEmpty.split(' ')[0];
          message.push({
            title: `Parameter ${parameter} required`,
            parameter: `${parameter}`,
          });
        }
      }
      if (message.length > 0) {
        throw new BadRequestException(message);
      }
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }

  private isEmpty(value: any) {
    if (Object.keys(value).length > 0) {
      return false;
    }
    return true;
  }
  /**
   * Extract params in path
   */
  getParamsId(): number | string {
    const id: any = this.request.params['id'];
    if (isNaN(id)) {
      if (id === ':id') {
        return null;
      }
      return id;
    }
    return parseInt(id);
  }
}
