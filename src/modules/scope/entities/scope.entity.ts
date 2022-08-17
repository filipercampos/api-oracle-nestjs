import { BaseEntity } from '@common/data/base/base.entity';

/**
 * Entity scope
 */
export class ScopeEntity extends BaseEntity {
  id: string; //guid
  scope: string;
  description: string;
}
