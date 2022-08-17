import { BaseMapper, Mappper } from '@common/data/base/base.mapper';
import { PostUserDto } from '../dto/post-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserScopeMetadataType } from '../repositories/user.metadata';

export class UserMapper extends BaseMapper<UserEntity> {
  fromJson(data: any): UserEntity {
    return {
      cpf: data.USU_CPF.toString(),
      name: data.USU_NOM,
      status: data.USU_STS,
      expirationDate: data.USU_EXP_DAT,
      createdAt: data.USU_CRE_AT,
      updatedAt: data.USU_UPD_AT,
    };
  }

  fromJsonScopes(data: any): Array<string> {
    return data.map((i: any) => i.USU_ECP_ARZ);
  }

  override toPost(body: PostUserDto): UserScopeMetadataType {
    const user = body.user as UserEntity;
    //columns name table
    const metadata = {
      USU_CPF: user.cpf,
      USU_NAM: user.name,
      USU_STS: user.status,
      USU_EXP: user.expirationDate,
    } as UserScopeMetadataType;
    return metadata;
  }

  override toArray(result: any) {
    return Mappper.mapperArray<UserEntity>(result, this.fromJson);
  }
}
