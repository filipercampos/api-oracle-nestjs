import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PageMetaDto } from './page-meta.dto';
/**
 * Response page for pagination
 */
export class PageDto<T> {
  /**
   * Results data request
   */
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly results: T[];
  /**
   * Offset data
   */
  @ApiProperty()
  readonly offset: number;

  /**
   * Limit data
   */
  @ApiProperty()
  readonly limit: number;

  /**
   * Total elements available
   */
  @ApiProperty()
  readonly total: number;

  /**
   * Total elements from request
   */
  @ApiProperty()
  readonly count: number;

  /**
   * Page to be filter
   */
  @ApiProperty()
  readonly page: number;

  /**
   * Indicates has previous page
   */
  @ApiProperty()
  readonly hasPreviousPage: boolean;

  /**
   * Indicates has next page
   */
  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor(data: T[], meta: PageMetaDto) {
    this.results = data;
    this.limit = meta.limit;
    this.count = meta.count;
    this.total = meta.total;
    this.page = meta.page;
    this.hasPreviousPage = meta.hasPreviousPage;
    this.hasNextPage = meta.hasNextPage;
  }
}
