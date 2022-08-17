import { CharacterModule as CharacterModuleMarvel } from '@app/marvel/index';
import { Module } from '@nestjs/common';
import { CharacterController } from './character.controller';

@Module({
  imports: [CharacterModuleMarvel],
  controllers: [CharacterController],
})
export class CharacterModule {}
