import { AuthService } from '@/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Controller } from '@nestjs/common';
import { Get, Req, Res, UseGuards, Param } from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';
import { PrismaService } from '@/prisma/prisma.service';

@Controller('profile')
export class ProfileController {
  // constructor(private authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: Request, @Res() res: Response): any {
    // Access the user object from the request
    const user = req.user;
    console.log(user);
    return res.status(200).json(user);
  }

  // @Get(':id')
  // @UseGuards(AuthGuard('jwt'))
  // async getUser(@Req() req: Request, @Res() res: Response) {
  //   const profile = req.user; // Assuming you have already authenticated the user and stored their profile in the request object
  //   const user = await this.authService.validateUser({ fortytwoId: 73333 });

  //   return res.status(200).json(user);
  // }
}
