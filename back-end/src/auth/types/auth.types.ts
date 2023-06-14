import { IsNumberString, MaxLength } from 'class-validator';

export interface IUser {
  fortytwoId: number;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  email: string;
}

export class Verify2FA {
  @IsNumberString(
    { no_symbols: true },
    { message: '2FA must have up to six numbers between 0-9' },
  )
  @MaxLength(6, { message: '2FA must have up to six numbers between 0-9' })
  token: string;
}
