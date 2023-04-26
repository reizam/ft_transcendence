import { AuthService } from '@/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Controller } from '@nestjs/common';
import { Get, Post, Req, Res, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';
import { PrismaService } from '@/prisma/prisma.service';


@UseGuards(AuthGuard('jwt'))
@Controller('profile')
export class ProfileController {
  constructor(private prisma: PrismaService) {}

  @Get()
  getDashboard(@Req() req: Request, @Res() res: Response): any {
    const user = req.user;
    // console.log(user);
    return res.status(200).json(user);
  }

  @Post()
  postDashboard(@Req() req: Request, @Res() res: Response): any {
    const user = req.body;
    console.log(user);
    return res.status(200).json(user);
  }

  @Get(':id')
  async getProfile(@Param('id', ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
    const user = await this.prisma.user.findFirst({
      where: {
        fortytwoId: id,
      }});
    console.log(user);
    return res.status(200).json(user);
  }
}
