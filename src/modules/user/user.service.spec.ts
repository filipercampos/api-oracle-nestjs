import { RedisModule } from '@common/cache/redis/redis.module';
import { loadConfig } from '@infra/config/load.config';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { IUserUsecase } from './interfaces/iuser-scope.usecase';
import { UserModule } from './user.module';

describe('UserService', () => {
  let service: IUserUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        RedisModule,
        UserModule,
        ConfigModule.forRoot({
          load: [loadConfig],
        }),
      ],
      providers: [],
    }).compile();

    service = module.get(IUserUsecase);
  });

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('Get Scopes', async () => {
    const scopes = await service.getUsers('8448699459');
    expect(Array.isArray(scopes)).toBeTruthy();
  });
});
