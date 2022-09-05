import { BaseOracleMetadata } from '@common/data/base/base.metadata';
/**
 * Mnemonics types
 */
export type TaskMetadataType = {
  TSK_ID: string;
  TSK_NAM: string;
  TSK_DSC: string;
  TSK_USU_ID: number;
  TSK_STS: number;
  TSK_CRT_AT: Date;
  TSK_UPD_AT: Date;
};
/**
 * Metadata for Mnemonics
 */
export class TaskMetadata extends BaseOracleMetadata {
  // owner.tableName
  // owner = app001
  // table = api001_tsk
  tableName = 'API001_TSK';
  primaryKeyName = {
    name: 'TSK_ID',
    type: 'string',
  };
  //fields table
  metadata = [
    'TSK_ID',
    'TSK_NAM',
    'TSK_DSC',
    'TSK_USU_ID',
    'TSK_STS',
    'TSK_CRT_AT',
    'TSK_UPD_AT',
  ];
  //type
  type: TaskMetadataType;
}
