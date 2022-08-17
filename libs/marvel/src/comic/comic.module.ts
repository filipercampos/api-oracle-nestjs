import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ComicService } from './comic.service';
import { IComicUsecase } from './icomic.usecases';

@Module({
  imports: [HttpModule, ComicModule],
  providers: [
    ComicService,
    {
      provide: IComicUsecase,
      useClass: ComicService,
    },
  ],
  exports: [
    ComicService,
    {
      provide: IComicUsecase,
      useClass: ComicService,
    },
  ],
})
export class ComicModule {}
