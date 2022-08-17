import { RedisModule } from '@common/cache/redis/redis.module';
import { loadConfig } from '@infra/config/load.config';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { SCOPE_MESSAGES } from './constants/scope.const';
import { PostScopeDto } from './dto/post-scope.dto';
import { ScopeModule } from './scope.module';
import { ScopeService } from './scope.service';
describe('ScopeScopes', () => {
  let app: INestApplication;
  const scopeService = {
    getScopes: () => {
      return {
        data: {
          scopes: ['test1', 'test2'],
          message: [],
          varejo: false,
        },
      };
    },
    postResponse: () => {
      return { message: SCOPE_MESSAGES.SCOPE_SAVE };
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ScopeModule,
        RedisModule,
        ConfigModule.forRoot({
          load: [loadConfig],
        }),
      ],
    })
      .overrideProvider(ScopeService)
      .useValue(scopeService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET scopes`, () => {
    return request(app.getHttpServer())
      .get('/scopes')
      .set({ cpf: '01234567890' })
      .expect(200)
      .expect(scopeService.getScopes());
  });

  it(`/POST scopes`, () => {
    const body = {
      name: 'Test',
      description: 'Test',
    } as PostScopeDto;
    return request(app.getHttpServer())
      .post('/scopes')
      .send(body)
      .expect(201)
      .expect(scopeService.postResponse());
  });

  afterAll(async () => {
    await app.close();
  });
});
