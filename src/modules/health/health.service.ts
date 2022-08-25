import { OracleConnectionFactory } from '@infra/database/oracle/oracle-connection.factory';
import {
  OracleOraError,
  OracleOraErrorDescription,
} from '@infra/database/oracle/oracle.constants';
import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { MessageDto } from '@common/dto';

@Injectable()
export class HealthService {
  async healthCheck() {
    try {
      const conn = await new OracleConnectionFactory().createConnection();
      await conn.close();
      return new MessageDto('API is up and running');
    } catch (err) {
      let message = 'API is down';
      const code = err.errorNum;
      if (code === OracleOraError.ACCESS_DENIED) {
        message = OracleOraErrorDescription[code];
      } else if (code === OracleOraError.SERVER_UNVALIABLE) {
        throw new ServiceUnavailableException(OracleOraErrorDescription[code]);
      }
      throw new BadGatewayException(message);
    }
  }
}
