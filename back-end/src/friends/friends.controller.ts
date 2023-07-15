import { DUser } from '@/decorators/user.decorator';
import { UpdateFriendsList } from './types/friends.types';
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Patch,
  Res,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Prisma, type User } from '@prisma/client';
import { Response } from 'express';
import { FriendsService } from './friends.service';

@UseGuards(AuthGuard('jwt'))
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  async getUsersList(
    @DUser() user: User,
    @Res() res: Response,
  ): Promise<Response> {
    const inGameIds = await this.friendsService.getInGameIds();
    const onlineIds = this.friendsService.getOnlineIds();
    const friends = await this.friendsService.getFriends(
      user.id,
      inGameIds,
      onlineIds,
    );
    const nonFriends = await this.friendsService.getNonFriends(
      user.id,
      friends,
      inGameIds,
      onlineIds,
    );
    return res.status(200).json({ friends: friends, nonFriends: nonFriends });
  }

  @Patch()
  async patchFriendsList(
    @DUser() user: User,
    @Body() updateDto: UpdateFriendsList,
    @Res() res: Response,
  ): Promise<Response> {
    if (updateDto.operation == 'ADD') {
      await this.friendsService
        .addFriend(user.id, updateDto.friendId)
        .catch((error) => {
          console.error({ error });
          if (error instanceof Error)
            throw new NotFoundException(error.message);
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025'
          )
            throw new NotFoundException("Your profile wasn't found");
          throw new InternalServerErrorException();
        });
      return res.status(204).send();
    }
    if (updateDto.operation == 'REMOVE') {
      await this.friendsService
        .removeFriend(user.id, updateDto.friendId)
        .catch((error) => {
          console.error({ error });
          if (error instanceof Error)
            throw new NotFoundException(error.message);
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025'
          )
            throw new NotFoundException("Your profile wasn't found");
          throw new InternalServerErrorException();
        });
      return res.status(204).send();
    }
    throw new UnprocessableEntityException();
  }
}
