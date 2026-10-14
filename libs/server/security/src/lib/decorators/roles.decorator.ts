import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@exam-planner/shared-types';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
