import { AuthGuard } from '@nestjs/passport';
import { Controller } from '@nestjs/common';
import { Get, Req, Res, UseGuards } from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';

@Controller('profile')
export class ProfileController {

  // @UseGuards(AuthGuard('42'))
  @Get()
    sendInfo(@Req() req: Request, @Res() res: Response): any {
      const profile = {
        username: "Matt",
      }
      console.log(req.headers);

      return res.status(200).json(profile);
    }
}
