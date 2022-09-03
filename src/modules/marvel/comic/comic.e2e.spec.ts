import { RedisModule } from '@common/cache/redis/redis.module';
import { loadConfig } from '@infra/config/load.config';
import { handleAuthMock } from '../../../../mocks/auth.mock';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { ComicModule } from './comic.module';
describe('Comic e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ComicModule,
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

  it(`/GET /marvel/comics/:id`, () => {
    return request(app.getHttpServer()).get('/marvel/comics/1308').expect(200);
  });

  it(`/GET /marvel/comics`, () => {
    return request(app.getHttpServer())
      .get(
        '/marvel/comics?title=Marvel Age Spider-Man Vol. 2: Everyday Hero (Digest)',
      )
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
