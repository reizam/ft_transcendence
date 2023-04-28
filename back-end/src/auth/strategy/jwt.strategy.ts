import { AuthService } from '@/auth/auth.service';
import { IJWTPayload } from '@/auth/types/jwt.types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: IJWTPayload) {
    const user = await this.authService.validateUser({
      fortytwoId: payload.fortytwoId,
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      profilePicture: payload.profilePicture,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
