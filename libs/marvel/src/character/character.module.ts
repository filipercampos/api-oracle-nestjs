import { CharacterController } from '@modules/marvel/character/character.controller';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { ICharacterUsecase } from './icharacter.usecases';

@Module({
  imports: [HttpModule, CharacterModule],
  controllers: [CharacterController],
  providers: [
    CharacterService,
    {
      provide: ICharacterUsecase,
      useClass: CharacterService,
    },
  ],
  exports: [
    CharacterService,
    {
      provide: ICharacterUsecase,
      useClass: CharacterService,
    },
  ],
})
export class CharacterModule {}
