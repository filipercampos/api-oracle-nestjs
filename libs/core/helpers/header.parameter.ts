import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { BaseParameterEnum } from '../enums/base-parameter.enum';
import { BaseParameter } from '../interfaces/external/base.parameter';

export class HeaderParameter extends BaseParameter {
  constructor(
    endpoint: string,
    headers?: AxiosRequestHeaders,
    config?: AxiosRequestConfig,
  ) {
    super(endpoint, headers, config);
  }

  get type(): BaseParameterEnum {
    return BaseParameterEnum.Header;
  }
}
