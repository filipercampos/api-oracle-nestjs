import { RedisModule } from '@common/cache/redis/redis.module';
import { loadConfig } from '@infra/config/load.config';
import { handleAuthMock } from '../../../../mocks/auth.mock';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CharacterModule } from './character.module';
describe('Character e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        CharacterModule,
        RedisModule,
        ConfigModule.forRoot({
          load: [loadConfig],
        }),
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => handleAuthMock(context),
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET marvel/characteres/:id`, () => {
    return request(app.getHttpServer())
      .get('/marvel/characteres/1011297')
      .expect(200);
  });

  it(`/GET /marvel/characteres`, () => {
    return request(app.getHttpServer())
      .get('/marvel/characteres?name=Agent Brand')
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
