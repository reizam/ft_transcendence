import { AuthService } from '@/auth/auth.service';
import { DUser } from '@/decorators/user.decorator';
import { ProfileService } from '@/profile/profile.service';
import { UpdateProfile } from '@/profile/types/profile.types';
import { exclude } from '@/utils/exclude';
import {
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Res,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { User } from '@prisma/client';
import { Response } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('profile')
export class ProfileController {
  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
  ) {}

  @Get()
  async getDashboard(
    @DUser() user: User,
    @Res() res: Response,
  ): Promise<Response> {
    const rank = await this.profileService.getRank(user);
    const filteredUser = exclude(user, ['twoFactorSecret']);
    const userWithRank = { ...filteredUser, rank: rank };

    return res.status(200).json(userWithRank);
  }

  @Get(':id')
  async getProfile(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const user = await this.authService.validateUser({ sub: id });

    if (!user) return res.status(200).json(user);

    const rank = await this.profileService.getRank(user);
    const filteredUser = exclude(user, ['twoFactorSecret']);
    const userWithRank = { ...filteredUser, rank: rank };

    return res.status(200).json(userWithRank);
  }

  @Patch()
  async patchDashboard(
    @DUser() user: User,
    @Body() updateDto: UpdateProfile,
    @Res() res: Response,
  ): Promise<Response> {
    if (updateDto.has2FA !== undefined) {
      const qrCodeDataUrl: string | null = await this.profileService
        .switch2FA(user, updateDto.has2FA)
        .catch((error) => {
          console.error({ error });
          throw new InternalServerErrorException();
        });
      return qrCodeDataUrl
        ? res.send({ qrCodeDataUrl })
        : res.status(204).send();
    }
    if (updateDto.profilePicture !== undefined) {
      await this.profileService
        .updatePicture(user.id, updateDto.profilePicture)
        .catch((error) => {
          console.error({ error });
          throw new InternalServerErrorException();
        });
      return res.status(204).send();
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
        return res.status(204).send();
      else {
        throw new ConflictException(
          `The username ${updateDto.username} already exists`,
        );
      }
    }
    throw new UnprocessableEntityException();
  }
}
