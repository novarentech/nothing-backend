import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { Role } from '@common/decorators/roles.decorator';

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(Role).optional(),
});

export class RegisterDto extends createZodDto(RegisterSchema) { }
