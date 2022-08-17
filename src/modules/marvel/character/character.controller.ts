import { ICharacterUsecase } from '@app/marvel/character/icharacter.usecases';
import { Character } from '@app/marvel/character/models/character.model';
import { ResponseErrorMessage } from '@common/interfaces/response-message';
import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('marvel')
@Controller('marvel')
export class CharacterController {
  constructor(private service: ICharacterUsecase) {}

  /**
   * Get character by id
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
    type: Character,
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
  @Get('characteres/:id')
  @ApiParam({ name: 'id', type: String, required: true })
  getScope(@Param('id') id: string) {
    return this.service.getCharacterById(id);
  }

  /**
   * Get characters
   *
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
    type: Character,
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
  @ApiQuery({ name: 'name', type: String, required: false })
  @Get('characteres')
  getCharacteres(@Query() query: any) {
    //TODO
    return this.service.getCharacters(query.name);
  }
}
