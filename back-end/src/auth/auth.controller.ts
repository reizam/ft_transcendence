import { AuthService } from '@/auth/auth.service';
import { DUser } from '@/decorators/user.decorator';
import { Controller, Get, Res, UseGuards, Post, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { CookieOptions, Response } from 'express';

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

  @UseGuards(AuthGuard('42'))
  @Get('42/callback')
  async loginWithFortyTwoCallback(
    @DUser() user: User,
    @Res() res: Response,
  ): Promise<void> {
    const jwt = this.authService.login(user);
    const cookieOptions: CookieOptions = {
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24,
    };

    res.cookie('jwt', jwt.accessToken, cookieOptions);

    if(user.has2FA) {
      res.redirect(
        this.configService.get<string>('FRONTEND_URL', 'localhost:4000') + '/check2FA',
      );
    } else {
      res.redirect(
        this.configService.get<string>('FRONTEND_URL', 'localhost:4000'),
      );
    }
  }

  // 2FAuthenticator
  @Post('enable-2fa')
  async enable2FA(@DUser() user: User): Promise<{ dataUrl: string }> {
    const dataUrl = await this.authService.enable2FA(user);
    return { dataUrl };
  }

  @Post('verify-2fa')
  async verify2FA(
    @DUser() user: User,
    @Body('token') token: string,
  ): Promise<{ isValid: boolean }> {
    const isValid = await this.authService.verify2FA(user, token);
    return { isValid };
  }
}
