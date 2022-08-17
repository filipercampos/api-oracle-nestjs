import { UserStatusEnum } from '../enums/user-status.enum';
/**
 * Entity user
 */
export class UserEntity {
  cpf: string;
  name: string;
  status: UserStatusEnum;
  expirationDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
