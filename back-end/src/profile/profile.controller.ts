import { AuthService } from '@/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Controller } from '@nestjs/common';
import {
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';
import { PrismaService } from '@/prisma/prisma.service';

@UseGuards(AuthGuard('jwt'))
@Controller('profile')
export class ProfileController {
  constructor(private prisma: PrismaService) {}

  @Get()
  getDashboard(@Req() req: Request, @Res() res: Response): any {
    const user = req.user;
    console.log('user: ', user);
    return res.status(200).json(user);
  }

  @Get(':id')
  async getProfile(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.prisma.user.findFirst({
      where: {
        fortytwoId: id,
      },
    });
    console.log(user);
    return res.status(200).json(user);
  }

  @Post()
  postDashboard(@Req() req: Request, @Res() res: Response): any {
    let result: any;
    const _json = req.body;

    if (_json.switch2FA) {
      // function to switch 2FA value, then load result to
      // be displayed in front-end, wether it has worked or not
    }
    if (_json.changePicture) {
      // function to switch picture value, then load result to
      // be displayed in front-end, wether it has worked or not
    }
    if (_json.changeUsername) {
      // function to switch picture value, then load result to
      // be displayed in front-end, wether it has worked or not
    }
    console.log(_json);
    return res.status(200).json(result);
  }
}
