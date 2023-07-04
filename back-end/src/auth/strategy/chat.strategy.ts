import { AuthService } from '@/auth/auth.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class ChatStrategy extends PassportStrategy(Strategy, 'chat') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'channelId' });
  }

  async validate(
    channelId: number,
    password: string,
  ): Promise<void /*IChanell*/> {
    // const channel = await this.authService.validateChatUser(
    //   channelId,
    //   password,
    // );
    // if (!channel) {
    //   throw new UnauthorizedException();
    // }
    // return channel as IChannel;
  }
}
