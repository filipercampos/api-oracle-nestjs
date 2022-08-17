import {
  ProjectMetadataType,
  ProjectOracleRepository,
} from '@common/data/oracle/project-oracle.repository';
import { loadConfig } from '@infra/config/load.config';

describe('TDD ProjectRepository', () => {
  let repository: ProjectOracleRepository;
  beforeAll(() => {
    process.env.ENV = 'local';
    loadConfig();
    repository = new ProjectOracleRepository();
  });
  it('create table', async () => {
    await repository.dropTable();
    const result = await repository.createTable();
    expect(result).toBeDefined();
  });

  it('save', async () => {
    const e = {
      NAME: 'My Project',
      DESCRIPTION: 'Design and project API Auth',
    } as ProjectMetadataType;
    const result = await repository.save(e);
    expect(result).toBeDefined();
  });

  it('findById', async () => {
    const find = await repository.findOneBy({});
    const result = await repository.findById(find.id);
    expect(result).toBeDefined();
  });

  it('findOne', async () => {
    const result = await repository.findOneBy({ NAME: 'My Project' });
    expect(result).toBeDefined();
  });

  it('update/:id', async () => {
    const id = '';
    const data = {
      DESCRIPTION: 'Design and project API Auth Scopos',
      UPDATEDAT: new Date(),
    } as ProjectMetadataType;
    const result = await repository.update(id, data);
    expect(result).toBeDefined();
  });

  it('delete', async () => {
    const id = '';
    const result = await repository.delete({ id });
    expect(result).toBeDefined();
  });

  afterAll(async () => {
    await repository.dispose();
  });
});
