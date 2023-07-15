import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateChannelDto {
  @IsBoolean()
  readonly isPrivate: boolean;

  @IsString()
  @IsOptional()
  readonly password?: string;

  @IsArray()
  @IsInt({
    each: true,
  })
  // @ArrayNotEmpty()
  readonly users: number[];
}

export class PutChannelDto {
  @IsInt()
  readonly channelId: number;

  @IsBoolean()
  readonly withPassword: boolean;

  @IsString()
  @IsOptional()
  readonly password?: string;
}

export class JoinProtectedChannelDto {
  @IsInt()
  readonly channelId: number;

  @IsString()
  readonly password: string;
}

export class PostChannelSendMessageDto {
  @IsString()
  @IsNotEmpty()
  readonly message: string;

  @IsInt()
  readonly channelId: number;
}

export class GetChannelMessagesDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  readonly channelId: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  readonly page: number;

  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  readonly limit: number;
}

export class GetChannelsDto {
  @IsInt()
  @Min(0)
  @Type(() => Number)
  readonly page: number;

  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  readonly limit: number;
}

export class BlockUserDto {
  @IsInt()
  @Min(1)
  readonly id: number;

  @IsBoolean()
  readonly toggleBlock: boolean;
}

export class sanctionUserDto {
  @IsIn(['kick', 'mute', 'unmute', 'ban', 'unban', 'promote', 'demote'])
  @IsString()
  readonly sanction: string;

  @IsInt()
  @Min(1)
  readonly userId: number;

  @IsInt()
  @Min(1)
  readonly channelId: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  readonly minutesToMute?: number;
}
