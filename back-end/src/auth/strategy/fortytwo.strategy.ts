import { AuthService } from '@/auth/auth.service';
import { FortytwoUser } from '@/auth/types/fortytwo.types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('FORTYTWO_APP_ID'),
      clientSecret: configService.get<string>('FORTYTWO_APP_SECRET'),
      callbackURL: configService.get<string>('FORTYTWO_CALLBACK_URL'),
      profileFields: {
        username: 'login',
        firstName: 'first_name',
        lastName: 'last_name',
      },
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    { _json: profile }: { _json: FortytwoUser },
  ) {
    const user = await this.authService.validateUser({
      fortytwoId: profile.id as number,
      username: profile.login as string,
      firstName: profile.first_name as string,
      lastName: profile.last_name as string,
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
