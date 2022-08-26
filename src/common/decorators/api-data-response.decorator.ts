import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

interface IResponseDecoratorApiResponse<T> {
  type: Type<any | T>;
  description?: string;
  status?: HttpStatus;
}
/**
 * Response data swagger docs
 */
export const ApiDataResponse = <TModel extends Type<any>>(
  options: IResponseDecoratorApiResponse<any | TModel>,
) => {
  const status = options.status ?? HttpStatus.OK;

  return applyDecorators(
    ApiExtraModels(options.type),
    ApiResponse({
      status: status,
      description: options.description || HttpStatus[status],
      schema: {
        properties: {
          data: {
            $ref: getSchemaPath(options.type),
          },
        },
      },
    }),
  );
};
