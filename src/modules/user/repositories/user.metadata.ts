import { BaseOracleMetadata } from '@common/data/base/base.metadata';

export type UserScopeMetadataType = {
  USU_CPF: string;
  USU_NAM: string;
  USU_STS: number;
  USU_EXP: Date;
  USU_CRT_AT: Date;
  USU_UPT_AT: Date;
};

export class UserScopeMetadata extends BaseOracleMetadata {
  tableName = 'app000.apt001_usu';
  primaryKeyName = {
    name: 'usu_cpf',
    type: 'string',
  };
  metadata = ['USU_CPF', 'USU_NOM', 'USU_STS', 'USU_CRT_AT', 'USU_UPT_AT'];
  type: UserScopeMetadataType;
}
