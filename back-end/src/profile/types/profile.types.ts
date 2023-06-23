import {
  IsAscii,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateProfile {
  @IsOptional()
  @IsBoolean()
  has2FA: boolean;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  profilePicture: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsAscii()
  @MaxLength(15, { message: 'Username cannot exceed 15 characters' })
  username: string;
}

export type WithRank<T> = T & {
  rank?: number;
};

export type WithBlockedUsers<T> = T & {
  blockedUsers?: number[];
};
