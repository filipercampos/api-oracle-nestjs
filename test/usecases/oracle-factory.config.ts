import { OracleConnectionFactory } from '@infra/database/oracle/oracle-connection.factory';
import { ScopeEntity } from '@modules/scope/entities/scope.entity';
import { UserEntity } from '@modules/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

/**
 * This project use {@link OracleConnectionFactory} src/infra/oracle-connection-factory
 *
 * @deprecated
 */
@Injectable()
export class OracleConfigFactory implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'oracle',
      host: this.configService.get('ORACLE_HOST'),
      port: this.configService.get('ORACLE_PORT'),
      username: this.configService.get('ORACLE_USERNAME'),
      password: this.configService.get('ORACLE_PASSWORD'),
      connectString: this._buildConnectionString(),
      synchronize: false,
      entities: [UserEntity, ScopeEntity],
    };
  }

  private _buildConnectionString() {
    const host = this.configService.get('ORACLE_HOST');
    const port = this.configService.get('ORACLE_PORT');
    const serviceName = this.configService.get('ORACLE_SERVICENAME');
    const protocol = `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)`;
    const hostName = `(HOST=${host})(PORT=${port}))`;
    const connect_data = `(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=${serviceName})))`;
    const connectionString = `${protocol}${hostName}${connect_data}`;
    return connectionString;
  }
}
