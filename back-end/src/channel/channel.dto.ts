import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateChannelDto {
  @IsBoolean()
  readonly private: boolean;

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
