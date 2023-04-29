import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '@/prisma/prisma.service';
import type { User } from '@prisma/client';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { IUpdateProfile } from '@/profile/types/profile.types';
import { DUser } from '@/decorators/user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('profile')
export class ProfileController {
  constructor(private prisma: PrismaService) {}

  @Get()
  getDashboard(@DUser() user: User, @Res() res: Response): Response {
    console.log('user: ', user);
    return res.status(200).json(user);
  }

  @Get(':id')
  async getProfile(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const user = await this.prisma.user.findFirst({
      where: {
        fortytwoId: id,
      },
    });
    console.log(user);
    return res.status(200).json(user);
  }

  @Post()
  postDashboard(
    @DUser() user: User,
    @Body() updateDto: IUpdateProfile,
    @Res() res: Response,
  ): Response {
    let result: any;
    let _json: any;

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
