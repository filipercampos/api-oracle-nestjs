import { BaseOracleRepository } from '@common/data/oracle/base-oracle-repository';
import { BaseMapper } from '../base/base.mapper';
import { BaseOracleMetadata } from '../base/base.metadata';
export type TaskMetadataType = {
  ID: string;
  NAME: string;
  DESCRIPTION: string;
  CREATEDAT: Date;
  UPDATEDAT: Date;
};
export class TaskMetadata extends BaseOracleMetadata {
  tableName = 'ibp100.task_test';
  primaryKeyName = {
    name: 'id',
    type: 'string',
  };
  metadata = ['ID', 'NAME', 'DESCRIPTION', 'CREATEDAT', 'UPDATEDAT', 'DONE'];
}
export type TaskEntity = {
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
      description: data.DESCRIPTION,
      createdAt: data.CREATEDAT,
      updatedAt: data.UPDATEDAT,
      done: data.DONE,
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
