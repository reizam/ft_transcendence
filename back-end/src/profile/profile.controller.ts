import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@/auth/auth.service';
import { CookieOptions, Request, Response } from 'express';
import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';

@Controller('profile')
export class ProfileController {

  // @UseGuards(AuthGuard('42'))
  @Get()
    testGet(@Req() req: Request): {ip: string} {
        console.log(req.headers.cookie)
        return {'ip': 'dis pas de betises'};
    }

}
