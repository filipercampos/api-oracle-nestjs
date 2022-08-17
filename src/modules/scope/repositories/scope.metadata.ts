import { BaseOracleMetadata } from '@common/data/base/base.metadata';
/**
 * Mnemonics
 */
export type ScopeMetadataType = {
  SCP_ID: string;
  SCP_NAM: string;
  SCP_DSC: string;
};
/**
 * Metadata for Mnemonics
 */
export class ScopeMetadata extends BaseOracleMetadata {
  // owner.tableName
  // owner = api001
  // table = apt001_scp
  tableName = 'app001.apt001_scp';
  primaryKeyName = {
    name: 'scp_id',
    type: 'string',
  };
  //fields table
  metadata = ['SCP_ID', 'SCP_NAM', 'SCP_DSC'];
  //type
  type: ScopeMetadataType;
}
