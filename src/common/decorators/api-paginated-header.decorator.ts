import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
export interface PaginationOptions {
  paginate: boolean;
  limit: number;
}
/**
 * Pagination parameters in header swagger docs
 */
export const ApiPaginatedHeader = (options?: PaginationOptions) => {
  return applyDecorators(
    ApiHeader({
      name: 'page',
      description: 'Page to be filter',
      schema: { type: 'number', minimum: 1, default: 1 },
    }),
    ApiHeader({
      name: 'limit',
      schema: {
        type: 'number',
        minimum: 1,
        maximum: options?.limit ?? 20,
        default: 20,
      },
      description: 'Limits the amount of records',
    }),
    ApiHeader({
      name: 'paginate',
      schema: {
        type: 'boolean',
        default: options?.paginate ?? true,
      },
      description: 'Indicates whether it will be paginated',
    }),
  );
};
