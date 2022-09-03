import { loadConfig } from '@infra/config/load.config';
import { TaskMetadataType } from './task.metadata';
import { TaskRepository } from './task.repository';

describe('TDD TaskRepository', () => {
  let repository: TaskRepository;

  beforeAll(() => {
    loadConfig();
  });

  beforeEach(() => {
    repository = new TaskRepository();
    repository.showLog(true);
  });

  it.skip('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('Save', async () => {
    const data = {
      TSK_NAM: 'Task 1',
      TSK_DSC: 'Task description ',
      TSK_STS: 1,
      TSK_USU_ID: 1,
    } as TaskMetadataType;
    const result = await repository.save(data);
    expect(result).toBeTruthy();
  });

  it('Find by ID', async () => {
    const id = 'E7C9A6B01BE60A45E053020011AC0506';
    const result = await repository.findById(id);
    expect(result).toBeTruthy();
  });

  it('Find By One', async () => {
    const name = 'Task 1';
    const result = await repository.findOneBy({ TSK_NAM: name });
    expect(result).toBeTruthy();
  });

  it('Find', async () => {
    const name = 'Task 1';
    const result = await repository.find({ TSK_NAM: name });
    expect(Array.isArray(result)).toBeTruthy();
  });

  it('Delete Task', async () => {
    const id = 'E4F4BD7982D7B213E05398441EAC4E66';
    const result = await repository.deleteById(id);
    expect(result).toBeTruthy();
  });
});
