import { loadConfig } from '@infra/config/load.config';
import { UserRepository } from './user.repository';
//Use this env for tests
process.env.ENV = 'local';
//load envs
loadConfig();

describe('TDD UserRepository', () => {
  let repository: UserRepository;

  beforeEach(() => {
    repository = new UserRepository();
  });

  it.skip('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('Get Users', async () => {
    const query = { USU_CPF: '00012345678' };
    const result = await repository.find(query);
    expect(Array.isArray(result)).toBeTruthy();
  });
});