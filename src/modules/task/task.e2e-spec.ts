import { RedisModule } from '@common/cache/redis/redis.module';
import { loadConfig } from '@infra/config/load.config';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { handleAuthMock } from '../../../mocks/auth.mock';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { TASK_MESSAGES } from './constants/task.const';
import { PostTaskDto } from './dto/post-task.dto';
import { TaskController } from './task.controller';
import { TaskModule } from './task.module';

describe('Task e2e', () => {
  let app: INestApplication;
  let server: TaskController;
  const serviceMock = {
    postResponse() {
      return { message: TASK_MESSAGES.TASK_SAVE };
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TaskModule,
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
    // Reference the server instance
    server = app.getHttpServer();
    await app.init();
  });

  it(`/POST task`, () => {
    const body = {
      name: 'Task test',
      description: 'Description Test',
      userId: 1,
    } as PostTaskDto;
    return request(server)
      .post('/tasks')
      .send(body)
      .expect(201)
      .expect(serviceMock.postResponse());
  });

  it(`/GET tasks/:id`, () => {
    return request(server)
      .get('/tasks/E7C9A6B01BE60A45E053020011AC0506')
      .expect(200);
  });

  it(`/GET tasks`, () => {
    return request(server).get('/tasks?page=1&limit=20').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
