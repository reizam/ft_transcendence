import { IsNotEmpty, IsNumber, IsIn } from 'class-validator';

export class UpdateFriendsList {
  @IsNotEmpty()
  @IsIn(['ADD', 'REMOVE'])
  operation: string;

  @IsNotEmpty()
  @IsNumber()
  friendId: number;
}

export type UserSummary = {
  id: number;
  username: string;
  elo: number;
  profilePicture: string;
  status: string;
};
