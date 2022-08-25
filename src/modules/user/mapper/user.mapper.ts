import { BaseMapper } from '@common/data/base/base.mapper';
import { PostUserDto } from '../dto/post-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserMetadataType } from '../repositories/user.metadata';

export class UserMapper extends BaseMapper<UserEntity> {
  fromJson(data: any): UserEntity {
    return {
      id: data.USU_ID,
      cpf: data.USU_CPF.toString(),
      firstName: data.USU_FRT_NAM,
      lastName: data.USU_LST_NAM,
      profile: data.USU_PFL,
      status: data.USU_STS,
      createdAt: data.USU_CRT_AT,
      updatedAt: data.USU_UPD_AT,
      password: data.USU_PSW,
      tasks: [],
    };
  }

  override toPost(body: PostUserDto): UserMetadataType {
    const user = body.user as UserEntity;
    //columns name table
    const metadata = {
      USU_CPF: user.cpf,
      USU_FRT_NAM: user.firstName,
      USU_LST_NAM: user.firstName,
      USU_STS: user.status,
    } as UserMetadataType;
    return metadata;
  }
}
