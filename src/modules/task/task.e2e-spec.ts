import { RedisModule } from '@common/cache/redis/redis.module';
import { loadConfig } from '@infra/config/load.config';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { TASK_MESSAGES } from './constants/task.const';
import { PostTaskDto } from './dto/post-task.dto';
import { TaskModule } from './scope.module';
import { TaskService } from './scope.service';
describe('TaskTasks', () => {
  let app: INestApplication;
  const scopeService = {
    getTasks: () => {
      return {
        data: {
          scopes: ['test1', 'test2'],
          message: [],
          varejo: false,
        },
      };
    },
    postResponse: () => {
      return { message: TASK_MESSAGES.SCOPE_SAVE };
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
      .expect(scopeService.getTasks());
  });

  it(`/POST scopes`, () => {
    const body = {
      name: 'Test',
      description: 'Test',
    } as PostTaskDto;
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
