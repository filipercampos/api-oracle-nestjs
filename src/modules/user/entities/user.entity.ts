import { BaseEntity } from '@common/data/base/base.entity';
import { UserStatusEnum } from '../enums/user-status.enum';
import { TaskEntity } from './../../task/entities/task.entity';
/**
 * Entity user
 */
export class UserEntity extends BaseEntity {
  id: number;
  /** Primary key */
  cpf: string;
  firstName: string;
  lastName: string;
  status: UserStatusEnum;
  profile: string;
  createdAt: Date;
  updatedAt: Date;
  password?: string;
  tasks: TaskEntity[];
}
