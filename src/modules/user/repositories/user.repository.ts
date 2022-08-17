import { BaseOracleRepository } from '@common/data/oracle/base-oracle-repository';
import { OracleParameters } from '@common/data/oracle/oracle.parameter';
import { Injectable } from '@nestjs/common';
import { DATA_VIGENCIA as MAX_EXPIRATION_DATE } from '@shared/constants';
import { GetUserDto } from '../dto/get-user.dto';
import { PatchUserExpirationDto } from '../dto/patch-user.dto';
import { PostUserDto } from '../dto/post-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserStatusEnum } from '../enums/user-status.enum';
import { UserMapper } from '../mapper/user.mapper';
import { UserScopeMetadata, UserScopeMetadataType } from './user.metadata';

@Injectable()
export class UserRepository extends BaseOracleRepository<
  UserEntity,
  UserScopeMetadataType
> {
  constructor() {
    super(new UserScopeMetadata(), new UserMapper());
  }

  /**
   * Find user's enable
   */
  async findUsers(query: GetUserDto): Promise<UserEntity[]> {
    try {
      this.log('findUsers');
      const sql = this.getSqlText('users/user.get');
      const params = new OracleParameters(
        this.createParam({ USU_CPF: query.cpf }),
        this.createParam({ USU_STS: UserStatusEnum.ENABLE }), // user active
        this.createParam({ USU_EXP: MAX_EXPIRATION_DATE }), // max exp
      );
      const result = await this.query(sql, params, {
        field: 'USU_NAM',
      });
      return this.mapperEntity.toArray(result);
    } catch (err) {
      this.handleError(err, 'findUsers');
    }
  }

  /**
   * Update user
   */
  async patchExpiration(body: PatchUserExpirationDto): Promise<boolean> {
    try {
      this.log('patchUser');
      //use post
      const sqlUser = this.getSqlText('apt001_usu/user.post');
      //user expiration (script use sysdate)
      const sqlExp = this.getSqlText('apt001_usu/user-expiration.patch');
      //use data
      const user = body.user;
      //user data
      const bindUser = [user.cpf, user.name, user.status, user.expirationDate];
      //expiration data
      const bindExp = [user.cpf, user.expirationDate];
      //create connection
      const conn = await this.openConnection();
      //update expiration
      const resultExp = await conn.execute(sqlExp, bindExp, {
        autoCommit: false,
      });
      //save user new expiration
      const resultUser = await conn.execute(sqlUser, bindUser, {
        autoCommit: false,
      });
      //has results
      if (this.hasAffected(resultExp) && this.hasAffected(resultUser)) {
        await conn.commit();
      } else {
        await conn.rollback();
        return false;
      }
      return true;
    } catch (err) {
      this.handleError(err, 'patchUser');
    }
  }

  /**
   * Save
   */
  async saveUser(body: PostUserDto): Promise<boolean> {
    try {
      this.log('saveUser');
      const sql = this.getSqlText('apt001_usu/user.post');
      const binds = [
        body.cpf,
        body.name,
        UserStatusEnum.ENABLE,
        MAX_EXPIRATION_DATE,
      ];
      const result = await this.execute(sql, binds, true);
      return this.hasAffected(result);
    } catch (err) {
      this.handleError(err, 'save');
    }
  }
}
