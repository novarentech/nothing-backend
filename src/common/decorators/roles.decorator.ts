import { SetMetadata } from '@nestjs/common';

export enum Role {
  Admin = 'Admin',
  User = 'User',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
