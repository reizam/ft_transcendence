import { DUser } from '@/decorators/user.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import { IUpdateProfile } from '@/profile/types/profile.types';
import {
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { User } from '@prisma/client';
import { Response } from 'express';
import { ProfileService } from './profile.service';

@UseGuards(AuthGuard('jwt'))
@Controller('profile')
export class ProfileController {
  constructor(
    private profileService: ProfileService,
    private prisma: PrismaService,
  ) {}

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
  async postDashboard(
    @DUser() user: User,
    @Body() updateDto: IUpdateProfile,
    @Res() res: Response,
  ): Promise<Response> {
    console.log(updateDto);
    if (updateDto.has2FA !== undefined) {
      await this.profileService
        .switch2FA(user.id, updateDto.has2FA)
        .catch((error) => {
          console.error({ error });
          throw new InternalServerErrorException();
        });
      return res.status(200).send();
    }
    if (updateDto.profilePicture !== undefined) {
      await this.profileService
        .updatePicture(user.id, updateDto.profilePicture)
        .catch((error) => {
          console.error({ error });
          throw new InternalServerErrorException();
        });
      return res.status(200).send();
    }
    if (updateDto.username !== undefined) {
      if (
        await this.profileService
          .updateUsername(user.id, updateDto.username)
          .catch((error) => {
            console.error({ error });
            throw new InternalServerErrorException();
          })
      )
        return res.status(200).send();
      else {
        throw new ConflictException(
          `The username ${updateDto.username} already exists`,
        );
      }
    }
    throw new UnprocessableEntityException();
  }
}
