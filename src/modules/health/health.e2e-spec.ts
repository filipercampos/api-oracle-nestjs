import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { HealthModule } from './health.module';
import { HealthService } from './health.service';
describe('HealthScopes', () => {
  let app: INestApplication;
  const service = {
    healthCheck: () => ({
      data: {
        message: 'API is up and running',
      },
    }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HealthModule],
    })
      .overrideProvider(HealthService)
      .useValue(service)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET health`, () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect(service.healthCheck());
  });

  afterAll(async () => {
    await app.close();
  });
});
