import { RedisModule } from '@common/cache/redis/redis.module';
import { loadConfig } from '@infra/config/load.config';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { TASK_MESSAGES } from './constants/task.const';
import { PostTaskDto } from './dto/post-task.dto';
import { TaskModule } from './task.module';
import { TaskService } from './task.service';
describe('Task e2e', () => {
  let app: INestApplication;
  const serviceMock = {
    getTasks: () => {
      return {
        data: {
          message: [],
        },
      };
    },
    postResponse: () => {
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
      .overrideProvider(TaskService)
      .useValue(serviceMock)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });
  it(`/POST task`, () => {
    const body = {
      name: 'Task test',
      description: 'Description Test',
      userId: 2,
      done: false,
    } as PostTaskDto;
    return request(app.getHttpServer())
      .post('/tasks')
      .send(body)
      .expect(201)
      .expect(serviceMock.postResponse());
  });
  it(`/GET tasks/:id`, () => {
    return request(app.getHttpServer()).get('/tasks').expect(200);
  });
  it(`/GET tasks`, () => {
    return request(app.getHttpServer()).get('/tasks').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
