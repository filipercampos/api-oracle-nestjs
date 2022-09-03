import { RedisModule } from '@common/cache/redis/redis.module';
import { loadConfig } from '@infra/config/load.config';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { GetUserDto } from './dto/get-user.dto';
import { IUserUsecase } from './interfaces/iuser.usecase';
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
  it('/GET users', async () => {
    const scopes = await service.getUsers({
      email: 'user@gmail.com',
    } as GetUserDto);
    expect(Array.isArray(scopes)).toBeTruthy();
  });
});
