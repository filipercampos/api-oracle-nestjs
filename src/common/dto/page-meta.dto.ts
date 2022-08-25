import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { PageMetaParamsDto } from '../interfaces/ipage-meta-params';

export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly offset: number;

  @ApiProperty()
  readonly count: number;

  @ApiProperty()
  readonly total: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor({ pageOptions, count }: PageMetaParamsDto) {
    this.page = pageOptions.page;
    this.limit = pageOptions.limit;
    this.count = count;
    this.total = Math.ceil(this.count / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.total;
  }
}
