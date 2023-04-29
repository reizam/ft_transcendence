import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@/auth/auth.service';
import { CookieOptions, Response } from 'express';
import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { DUser } from '@/decorators/user.decorator';

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
    const jwt = await this.authService.login(user);
    console.log(user);
    const cookieOptions: CookieOptions = {
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24,
    };

    res.cookie('jwt', jwt.accessToken, cookieOptions);
    res.redirect(this.configService.get<string>('FRONTEND_URL'));
  }
}
