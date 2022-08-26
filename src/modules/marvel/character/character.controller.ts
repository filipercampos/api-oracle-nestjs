import { ICharacterUsecase } from '@app/marvel/character/icharacter.usecases';
import { Character } from '@app/marvel/character/models/character.model';
import { ApiDataResponse } from '@common/decorators/api-data-response.decorator';
import { ApiErrorResponse } from '@common/decorators/api-error-response.decorator';
import { ResponseErrorMessage } from '@common/interfaces/response-message';
import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiMarvelResponse } from '@shared/decorators/api-marvel-response.decorator';

@ApiTags('marvel')
@Controller('marvel')
export class CharacterController {
  constructor(private service: ICharacterUsecase) {}

  /**
   * Get character by id
   */
  @ApiMarvelResponse({
    description: 'Character list with one Character data',
    type: Character,
  })
  @ApiErrorResponse()
  @Get('characteres/:id')
  @ApiParam({ name: 'id', type: String, required: true })
  getCharacterById(@Param('id') id: string) {
    return this.service.getCharacterById(id);
  }

  /**
   * Get characters
   *
   */
  @ApiMarvelResponse({
    description: 'Character list',
    type: Character,
  })
  @ApiDataResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid parameters',
    type: ResponseErrorMessage,
  })
  @ApiDataResponse({
    status: HttpStatus.BAD_GATEWAY,
    description: 'Invalid response',
    type: ResponseErrorMessage,
  })
  @ApiQuery({ name: 'name', type: String, required: false })
  @Get('characteres')
  getCharacteres(@Query() query: any) {
    //TODO
    return this.service.getCharacters(query.name);
  }
}
