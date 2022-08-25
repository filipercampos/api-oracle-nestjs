import { BaseMapper } from '@common/data/base/base.mapper';
import { BaseOracleMetadata } from '@common/data/base/base.metadata';
import { BaseOracleRepository } from '@common/data/oracle/base-oracle-repository';
export type TaskMetadataType = {
  ID: string;
  NAME: string;
  DESCRIPTION: string;
  DONE: boolean;
  CREATEDAT: Date;
  UPDATEDAT: Date;
};
export class TaskMetadata extends BaseOracleMetadata {
  tableName = 'task_test';
  primaryKeyName = {
    name: 'id',
    type: 'string',
  };
  metadata = ['ID', 'NAME', 'DESCRIPTION', 'CREATEDAT', 'UPDATEDAT', 'DONE'];
  type: TaskMetadataType;
}
type TaskEntity = {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  done: boolean;
};

class TaskMapper extends BaseMapper<TaskEntity> {
  fromJson(data: any): TaskEntity {
    return {
      id: data.ID,
      name: data.NAME,
      done: data.DONE,
      description: data.DESCRIPTION,
      createdAt: data.CREATEDAT,
      updatedAt: data.UPDATEDAT,
    };
  }
}
export class TaskOracleRepository extends BaseOracleRepository<
  TaskEntity,
  TaskMetadataType
> {
  constructor() {
    super(new TaskMetadata(), new TaskMapper());
  }

  async createTable() {
    // Create table
    const sql = `CREATE TABLE ${this.tableName} (
          id number generated always as identity,
          name varchar2(45),
          description varchar2(4000),
          createdat timestamp with time zone default current_timestamp,
          updatedat timestamp null,
          done number(1,0),
          primary key (id)
        )`;
    return this.execute(sql);
  }

  dropTable() {
    const sql = `begin
    execute immediate 'drop table ${this.tableName}';
    exception when others then if sqlcode <> -942 then raise; end if;
  end;`;
    return this.execute(sql);
  }
  dispose() {
    return this.dropTable();
  }
}
