import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { BaseParameterEnum } from '../enums/base-parameter.enum';
import { BaseParameter } from '../interfaces/external/base.parameter';

export class BodyParameter extends BaseParameter {
  constructor(
    endpoint: string,
    headers?: AxiosRequestHeaders,
    config?: AxiosRequestConfig,
  ) {
    super(endpoint, headers, config);
  }
  override get data() {
    return this.values;
  }

  get type(): BaseParameterEnum {
    return BaseParameterEnum.Body;
  }
}
