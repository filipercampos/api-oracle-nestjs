import { BaseOracleMetadata } from '@common/data/base/base.metadata';

export type UserMetadataType = {
  USU_ID: number;
  USU_CPF: string;
  USU_PSW: string;
  USU_FRT_NAM: string;
  USU_LST_NAM: string;
  USU_EML: string;
  USU_STS: number;
  USU_PFL: string;
  USU_CRT_AT: Date;
  USU_UPT_AT: Date;
};

export class UserMetadata extends BaseOracleMetadata {
  tableName = 'API001_USU';
  primaryKeyName = {
    name: 'USU_ID',
    type: 'number',
  };
  metadata = [
    'USU_ID',
    'USU_CPF',
    'USU_PSW',
    'USU_FRT_NAM',
    'USU_LST_NAM',
    'USU_EML',
    'USU_STS',
    'USU_PFL',
    'USU_CRT_AT',
    'USU_UPD_AT',
  ];
  type: UserMetadataType;
}
