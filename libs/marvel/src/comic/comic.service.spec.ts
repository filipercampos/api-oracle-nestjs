import { loadConfig } from '@infra/config/load.config';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { ComicModule } from './comic.module';
import { IComicUsecase } from './icomic.usecases';

jest.setTimeout(99999);

describe('Comic Service', () => {
  let service: IComicUsecase;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ComicModule,
        ConfigModule.forRoot({
          load: [loadConfig],
        }),
      ],
      providers: [],
    }).compile();

    service = module.get(IComicUsecase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
