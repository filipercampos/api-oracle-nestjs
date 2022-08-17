import { ComicModule as ComicModuleMarvel } from '@app/marvel/index';
import { Module } from '@nestjs/common';
import { ComicController } from './comic.controller';

@Module({
  imports: [ComicModuleMarvel],
  controllers: [ComicController],
})
export class ComicModule {}
