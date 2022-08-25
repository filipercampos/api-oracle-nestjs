import { BaseOracleRepository } from '@common/data/oracle/base-oracle-repository';
import {
  OracleParameter,
  OracleParameters,
} from '@common/data/oracle/oracle.parameter';
import { Injectable } from '@nestjs/common';
import { GetUserDto } from '../dto/get-user.dto';
import { PostUserDto } from '../dto/post-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserStatusEnum } from '../enums/user-status.enum';
import { UserMapper } from '../mapper/user.mapper';
import { PatchUserDto } from './../dto/patch-user.dto';
import { UserMetadata, UserMetadataType } from './user.metadata';

@Injectable()
export class UserRepository extends BaseOracleRepository<
  UserEntity,
  UserMetadataType
> {
  constructor() {
    super(new UserMetadata(), new UserMapper());
  }

  /**
   * Find user's enable
   */
  async findUsers(query: GetUserDto): Promise<UserEntity[]> {
    try {
      this.log('findUsers');
      const params = new OracleParameters();
      if (query.name) {
        const paramLikeName = new OracleParameter<UserMetadataType>(
          { USU_FRT_NAM: `${query.name}%` },
          'LIKE',
        );
        params.push(paramLikeName);
      }
      if (query.email) {
        params.push(this.createParam({ USU_EML: query.email }));
      }
      if (query.cpf) {
        params.push(this.createParam({ USU_CPF: query.cpf }));
      }
      if (query.status != undefined) {
        //get enum value
        const status: any = UserStatusEnum[query.status];
        params.push(this.createParam({ USU_STS: status }));
      }
      const result = await this.find(params);
      for (let i = 0; i < result.length; i++) {
        result[i].password = undefined;
      }
      return result;
    } catch (err) {
      this.handleError(err, 'findUsers');
    }
  }

  /**
   * Save user data
   */
  async saveUser(body: PostUserDto): Promise<boolean> {
    try {
      this.log('saveUser');
      const sql = this.getSqlText('api001_usu/user.post');
      const binds = [
        body.cpf,
        body.password,
        body.profile,
        body.email,
        UserStatusEnum.ENABLE,
        body.firstName,
        body.lastName,
      ];
      const result = await this.execute(sql, binds, true);
      return this.hasAffected(result);
    } catch (err) {
      this.handleError(err, 'saveUser');
    }
  }

  /**
   * Update user data
   */
  async patchUser(body: PatchUserDto): Promise<boolean> {
    try {
      this.log('patchUser');
      const sql = this.getSqlText('api001_usu/user.patch');
      const binds = [body.firstName, body.lastName, body.cpf];
      const result = await this.execute(sql, binds, true);
      return this.hasAffected(result);
    } catch (err) {
      this.handleError(err, 'patchUser');
    }
  }
}
