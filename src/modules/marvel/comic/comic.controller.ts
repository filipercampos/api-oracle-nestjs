import { IComicUsecase } from '@app/marvel/comic/icomic.usecases';
import { Comic } from '@app/marvel/comic/models/comic.model';
import { ApiErrorResponse } from '@common/decorators/api-error-response.decorator';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiMarvelResponse } from '@shared/decorators/api-marvel-response.decorator';
import { X_API_KEY } from './../../../shared/constants';
@ApiSecurity(X_API_KEY)
@ApiTags('marvel')
@Controller('marvel')
export class ComicController {
  constructor(private service: IComicUsecase) {}

  /**
   * Get comic by id
   */
  @ApiMarvelResponse({
    description: 'Comic list with one comic data',
    type: Comic,
  })
  @ApiErrorResponse()
  @Get('comics/:id')
  @ApiParam({ name: 'id', type: String, required: true })
  getComicById(@Param('id') id: string) {
    return this.service.getComicById(id);
  }

  /**
   * Get comics
   *
   */
  @ApiMarvelResponse({
    description: 'Comic list',
    type: Comic,
  })
  @ApiErrorResponse()
  @ApiQuery({ name: 'title', type: String, required: false })
  @Get('comics')
  getComics(@Query('title') title: string) {
    return this.service.getComics(title);
  }
}
