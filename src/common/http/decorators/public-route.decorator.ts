import { SetMetadata } from '@nestjs/common';
import { PublicRouteRole } from '../enums/public-route-role.enum';

export const ROLES_KEY = 'roles';
export const PublicRoute = () =>
  SetMetadata(ROLES_KEY, [PublicRouteRole.isPublicRoute]);
