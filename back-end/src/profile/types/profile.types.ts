import {
  IsAscii,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class IUpdateProfile {
  @IsOptional()
  @IsBoolean()
  has2FA: boolean;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  profilePicture: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsAscii()
  username: string;
}
