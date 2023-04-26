import { AuthService } from '@/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Controller } from '@nestjs/common';
import { Get, Req, Res, UseGuards } from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';

@Controller('profile')
export class ProfileController {
  @Get()
  @UseGuards(AuthGuard('jwt'))
  sendInfo(@Req() req: Request, @Res() res: Response): any {
    // Access the user object from the request
    const user = req.user;
    console.log(user);
    // You can now use the user information in your response
    const profile = {
      username: 'test', // Assuming the user object has a 'username' property
      // Add any other user properties you'd like to include in the response
    };

    return res.status(200).json(profile);
  }
}
