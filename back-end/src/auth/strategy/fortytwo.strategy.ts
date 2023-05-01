import { AuthService } from '@/auth/auth.service';
import { FortytwoUser } from '@/auth/types/fortytwo.types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Strategy as Strategy42 } from 'passport-42';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy42, '42') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('FORTYTWO_APP_ID'),
      clientSecret: configService.get<string>('FORTYTWO_APP_SECRET'),
      callbackURL: configService.get<string>('FORTYTWO_CALLBACK_URL'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    { _json: profile }: { _json: FortytwoUser },
  ): Promise<User> {
    const user = await this.authService.validateOrCreateUser({
      fortytwoId: profile.id as number,
      username: profile.login as string,
      firstName: profile.first_name as string,
      lastName: profile.last_name as string,
      profilePicture: profile.image.link as string,
      email: profile.email as string,
    });
    return user;
  }
}
