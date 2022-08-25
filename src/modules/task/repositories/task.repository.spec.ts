import { loadConfig } from '@infra/config/load.config';
import { TaskMetadataType } from './task.metadata';
import { TaskRepository } from './task.repository';
//Use this env for tests
process.env.ENV = 'local';
//load envs
loadConfig();

describe('TDD TaskRepository', () => {
  let repository: TaskRepository;

  beforeEach(() => {
    repository = new TaskRepository();
    repository.showLog(true);
  });

  it.skip('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it.skip('Save', async () => {
    const data = {
      TSK_NAM: 'Task 1',
      TSK_DSC: 'Task description ',
    } as TaskMetadataType;
    const result = await repository.save(data);
    expect(result).toBeTruthy();
  });

  it('Find by ID', async () => {
    const id = 'E4B8B3E0D6103207E05396441EAC48E1';
    const result = await repository.findById(id);
    expect(result).toBeTruthy();
  });

  it('Find By One', async () => {
    const scope = 'scope';
    const result = await repository.findOneBy({ TSK_NAM: scope });
    expect(result).toBeTruthy();
  });

  it('Find', async () => {
    const scope = 'scope';
    const result = await repository.find({ TSK_NAM: scope });
    expect(Array.isArray(result)).toBeTruthy();
  });

  it('Delete Task', async () => {
    const id = 'E4F4BD7982D7B213E05398441EAC4E66';
    const result = await repository.deleteById(id);
    expect(result).toBeTruthy();
  });

  // afterAll(async () => {});
});
