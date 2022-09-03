import { PageOptionsDto } from '@common/dto';
import { loadConfig } from '@infra/config/load.config';
import { Test } from '@nestjs/testing';
import { RedisModule } from './../../common/cache/redis/redis.module';
import { GetTaskDto } from './dto/get-task.dto';
import { ITaskUsecase } from './interfaces/itask.usecase';
import { TaskModule } from './task.module';

describe('TaskService', () => {
  let service: ITaskUsecase;
  beforeAll(() => {
    loadConfig();
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [RedisModule, TaskModule],
    }).compile();

    service = module.get<ITaskUsecase>(ITaskUsecase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('/GET task/:id', async () => {
    const id = '1445263C5BEA4733A5FB64DEA42C89A1';
    await service.getTaskById(id).then((data) => {
      expect(data).toBeDefined();
    });
  });
  it('/GET task', async () => {
    const query = {
      name: 'Task 1',
    } as GetTaskDto;
    await service
      .getTasks(query, { page: 1, limit: 10 } as PageOptionsDto)
      .then((data) => {
        expect(data).toBeDefined();
      });
  });
});
