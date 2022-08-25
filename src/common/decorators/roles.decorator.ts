import { SetMetadata } from '@nestjs/common';
import { ProfileRoleEnum } from '@shared/roles/profile.role.enum';
export const ROLES_KEY = 'roles';
/**
 * Roles decorator
 */
export const Roles = (...roles: ProfileRoleEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
