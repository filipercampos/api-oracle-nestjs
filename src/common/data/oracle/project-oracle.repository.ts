import { BaseOracleMetadata } from '@common/data/base/base.metadata';
import { BaseOracleRepository } from '@common/data/oracle/base-oracle-repository';
import { BaseMapper } from '../base/base.mapper';

export type ProjectMetadataType = {
  ID: string;
  NAME: string;
  DESCRIPTION: string;
  CREATEDAT: Date;
  UPDATEDAT: Date;
};
export class ProjectMetadata extends BaseOracleMetadata {
  tableName = 'ibp100.project_test';
  primaryKeyName = {
    name: 'id',
    type: 'string',
  };
  metadata = ['ID', 'NAME', 'DESCRIPTION', 'CREATEDAT', 'UPDATEDAT'];
}
export type ProjectEntity = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

class ProjectMapper extends BaseMapper<ProjectEntity> {
  fromJson(data: any): ProjectEntity {
    return {
      id: data.ID.toString('hex'),
      name: data.NAME,
      description: data.DESCRIPTION,
      createdAt: data.CREATEDAT,
      updatedAt: data.UPDATEDAT,
    };
  }
}
export class ProjectOracleRepository extends BaseOracleRepository<
  ProjectEntity,
  ProjectMetadataType
> {
  constructor() {
    super(new ProjectMetadata(), new ProjectMapper());
  }

  async createTable() {
    // Create table
    const sql = `CREATE TABLE ${this.tableName} (
          id RAW(16) default sys_guid() primary key,
          name varchar2(45),
          description varchar2(4000),
          createdat timestamp with time zone default current_timestamp,
          updatedat timestamp null
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
