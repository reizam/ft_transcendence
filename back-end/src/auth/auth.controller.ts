import { AuthService } from '@/auth/auth.service';
import { DUser } from '@/decorators/user.decorator';
import {
  Controller,
  Get,
  Res,
  UseGuards,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { CookieOptions, Response } from 'express';
import { Verify2FA } from './types/auth.types';
import { WithWasJustCreated } from '@/profile/types/profile.types';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard('42'))
  @Get('42')
  async loginWithFortyTwo(): Promise<void> {
    // Empty
  }

  getCookieOptions(): CookieOptions {
    return {
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24,
    };
  }

  @UseGuards(AuthGuard('42'))
  @Get('42/callback')
  async loginWithFortyTwoCallback(
    @DUser() user: WithWasJustCreated<User>,
    @Res() res: Response,
  ): Promise<void> {
    const jwt = this.authService.login(user);

    res.cookie('jwt', jwt.accessToken, this.getCookieOptions());
    if (user.has2FA) {
      res.redirect(
        this.configService.get<string>('FRONTEND_URL', 'pongue.live') +
          '/check2FA',
      );
    } else {
      if (user.wasJustCreated)
        res.cookie('newUser', 'true', this.getCookieOptions());
      res.cookie('2FA', 'disabled', this.getCookieOptions());
      res.redirect(
        this.configService.get<string>('FRONTEND_URL', 'pongue.live') +
          '/profile',
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('verify2FA')
  async verify2FA(
    @DUser() user: User,
    @Body() twoFactorDto: Verify2FA,
    @Res() res: Response,
  ): Promise<Response> {
    const isValid = await this.authService.verify2FA(user, twoFactorDto.token);

    if (isValid) {
      res.cookie('2FA', 'validated', this.getCookieOptions());
      return res.status(200).send();
    }
    throw new UnauthorizedException('2FA verification failed');
  }
}
