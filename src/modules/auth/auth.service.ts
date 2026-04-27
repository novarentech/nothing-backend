import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@config/config.service';
import { UsersService } from '@modules/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '@common/interfaces/jwt-payload.interface';
import { Role } from '@common/decorators/roles.decorator';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role || Role.User,
    });

    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    return this.generateTokens(payload);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    return this.generateTokens(payload);
  }

  async refresh(refreshToken: string) {
    try {
      const secret = this.configService.get('JWT_REFRESH_SECRET', 'change_me_too');
      const decoded = this.jwtService.verify(refreshToken, { secret }) as JwtPayload;
      
      const payload: JwtPayload = { sub: decoded.sub, email: decoded.email, role: decoded.role };
      return this.generateTokens(payload);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(payload: JwtPayload) {
    const accessSecret = this.configService.get('JWT_ACCESS_SECRET', 'change_me');
    const refreshSecret = this.configService.get('JWT_REFRESH_SECRET', 'change_me_too');
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRES', '15m') as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES', '7d') as any,
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
