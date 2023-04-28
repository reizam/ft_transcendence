import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@/auth/auth.service';
import { CookieOptions, Request, Response } from 'express';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard('42'))
  @Get('42')
  async loginWithFortyTwo() {
    // Empty
  }

  @UseGuards(AuthGuard('42'))
  @Get('42/callback')
  async loginWithFortyTwoCallback(@Req() req: Request, @Res() res: Response) {
    const jwt = await this.authService.login(req.user);
    console.log(req.user);
    const cookieOptions: CookieOptions = {
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24,
    };

    res.cookie('jwt', jwt.accessToken, cookieOptions);
    res.redirect(this.configService.get<string>('FRONTEND_URL'));
  }
}
