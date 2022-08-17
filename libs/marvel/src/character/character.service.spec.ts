import { loadConfig } from '@infra/config/load.config';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { CharacterModule } from './character.module';
import { ICharacterUsecase } from './icharacter.usecases';

jest.setTimeout(99999);

describe('IntermediariaService', () => {
  let service: ICharacterUsecase;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        CharacterModule,
        ConfigModule.forRoot({
          load: [loadConfig],
        }),
      ],
      providers: [],
    }).compile();

    service = module.get(ICharacterUsecase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
