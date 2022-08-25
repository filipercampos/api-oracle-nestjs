import { loadConfig } from '@infra/config/load.config';
import { TaskOracleRepository } from './task-oracle.repository';
const tableName = 'ibp100.task_test';
describe('TDD  Script over TaskEntityRepository', () => {
  let repository: TaskOracleRepository;
  beforeAll(() => {
    process.env.ENV = 'local';
    loadConfig();
    repository = new TaskOracleRepository();
  });

  it('create table', async () => {
    await repository.dropTable();
    const result = await repository.createTable();
    expect(result).toBeDefined();
  });

  it('insert', async () => {
    const sql = `INSERT INTO ${tableName} (name, description, done) VALUES (:name, :description, :done)`;
    const binds = ['Create API', 'Design and project API Auth', 0];
    const result = await repository.execute(sql, binds);
    expect(result).toBeDefined();
  });

  it('insert many', async () => {
    const sql = `INSERT INTO ${tableName} (name, description, done)  VALUES (:1, :2, :3)`;
    const binds = [
      ['Project', 'Structure project', 0],
      ['Database', 'Data access', 0],
      ['API', 'Create API NestJS', 0],
    ];
    const result = await repository.executeMany(sql, binds);
    expect(result).toBeDefined();
  });

  it('select', async () => {
    const sql = `SELECT * FROM ${tableName} WHERE ROWNUM=1`;
    const result = await repository.query(sql);
    expect(Array.isArray(result)).toBeTruthy();
  });

  it('update/:id', async () => {
    const sql = `UPDATE ${tableName} 
        SET done = :done, updatedat = :updatedat 
        WHERE id = :id`;
    const binds = [1, new Date(), 1];
    const result = await repository.execute(sql, binds);
    expect(result).toBeDefined();
  });

  it('update values', async () => {
    const sql = `UPDATE ${tableName} 
      SET done = :1, updatedat= :2 
      WHERE ID = :3`;
    const binds = [1, new Date(), 1];
    const result = await repository.execute(sql, binds);
    expect(result).toBeDefined();
  });

  it('Delete', async () => {
    const sql = `DELETE FROM ${tableName} where id = :id`;
    const binds = [1];
    const result = await repository.execute(sql, binds);
    expect(result).toBeDefined();
  });

  afterAll(async () => {
    await repository.dispose();
  });
});
