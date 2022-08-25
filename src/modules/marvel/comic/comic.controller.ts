import { IComicUsecase } from '@app/marvel/comic/icomic.usecases';
import { Comic } from '@app/marvel/comic/models/comic.model';
import { ResponseErrorMessage } from '@common/interfaces/response-message';
import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('marvel')
@Controller('marvel')
export class ComicController {
  constructor(private service: IComicUsecase) {}

  /**
   * Get comic by id
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
    type: Comic,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid parameters',
    type: ResponseErrorMessage,
  })
  @ApiResponse({
    status: HttpStatus.BAD_GATEWAY,
    description: 'Invalid response',
    type: ResponseErrorMessage,
  })
  @Get('comics/:id')
  @ApiParam({ name: 'id', type: String, required: true })
  getComicById(@Param('id') id: string) {
    return this.service.getComicById(id);
  }

  /**
   * Get comics
   *
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
    type: Comic,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid parameters',
    type: ResponseErrorMessage,
  })
  @ApiResponse({
    status: HttpStatus.BAD_GATEWAY,
    description: 'Invalid response',
    type: ResponseErrorMessage,
  })
  @ApiQuery({ name: 'title', type: String, required: false })
  @Get('comics')
  getComics(@Query('title') title: string) {
    return this.service.getComics(title);
  }
}
