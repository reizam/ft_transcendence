import { AuthService } from '@/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Controller } from '@nestjs/common';
import { Get, Req, Res, UseGuards, Param } from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';
import { PrismaService } from '@/prisma/prisma.service';

@Controller('profile')
export class ProfileController {
  @Get()
  @UseGuards(AuthGuard('jwt'))
  sendInfo(@Req() req: Request, @Res() res: Response): any {
    // Access the user object from the request
    const user = req.user;
    return res.status(200).json(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async sendInfoId(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    const result = await this.prisma.user.findUnique({
      where: {
        id: 42,
      },
    });

  //   return res.status(200).json(result);
  // }
}
