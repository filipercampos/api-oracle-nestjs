import { Test } from '@nestjs/testing';
import { RedisModule } from './../../common/cache/redis/redis.module';
import { AuthModule } from './auth.module';
import { IAuthUsecase } from './interfaces/iauth.usecase';

describe('AuthService', () => {
  let service: IAuthUsecase;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [RedisModule, AuthModule],
    }).compile();

    service = module.get<IAuthUsecase>(IAuthUsecase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('/POST auth', () => {
    const username = 'user@gmail.com';
    const password = '1234';
    expect(service.authentication(username, password)).toBeDefined();
  });
});
