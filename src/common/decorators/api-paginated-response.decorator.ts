import { PageDto } from '@common/dto/page.dto';
import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

interface IPaginatedDecoratorApiResponse<T> {
  model: Type<any & T>;
  description?: string;
}
/**
 * Response pagination swagger docs
 */
export const ApiPaginatedResponse = <TModel extends Type<any>>(
  options: IPaginatedDecoratorApiResponse<TModel>,
) => {
  return applyDecorators(
    ApiExtraModels(PageDto, options.model),
    ApiOkResponse({
      status: HttpStatus.OK,
      description: options.description || 'Successfully received model list',
      schema: {
        properties: {
          data: {
            type: 'object',
            $ref: getSchemaPath(PageDto),
            properties: {
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(options.model) },
              },
            },
          },
        },
        //or multiple
        // allOf: [
        //   {
        //     properties: {
        //       data: {
        //         type: 'object',
        //         $ref: getSchemaPath(PageDto),
        //         properties: {
        //           results: {
        //             type: 'array',
        //             items: { $ref: getSchemaPath(options.model) },
        //           },
        //         },
        //       },
        //     },
        //   },
        // ],
      },
    }),
  );
};
