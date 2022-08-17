import { CharacterModule } from '@app/marvel';
import { Module } from '@nestjs/common';
import { ComicModule } from './comic/comic.module';

@Module({
  imports: [CharacterModule, ComicModule],
})
export class MarvelModule {}
