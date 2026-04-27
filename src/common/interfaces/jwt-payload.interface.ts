import { Role } from '@common/decorators/roles.decorator';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}
