import { IsArray, IsBoolean, IsNumber, IsOptional } from 'class-validator';
/**
 * Pagination dto
 */
export class PaginationDto {
  /**
   * Offset data
   */
  @IsNumber()
  offset: number;

  /**
   * Limit data
   */
  @IsNumber()
  limit: number;

  /**
   * Total elements available
   */
  @IsNumber()
  total: number;

  /**
   * Total elements from request
   */
  @IsNumber()
  count: number;

  /**
   * Results data request
   */
  @IsArray()
  results: Array<any>;
}
/**
 * Pagination query parameters
 */
export class PaginationQueryDto {
  @IsOptional()
  @IsNumber()
  page: number;

  @IsOptional()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsBoolean()
  paginate: boolean;
}
